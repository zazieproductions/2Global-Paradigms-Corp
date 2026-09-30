import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import seoManifest from '@/config/seo-pages.json';

const { site, pages } = seoManifest;
const canonicalUrl = (pagePath: string) =>
  pagePath === '/' ? `${site.origin}/` : `${site.origin}${pagePath}`;

type Redirects = { _redirects?: string };
type ArtefactOverrides = {
  sitemap?: string;
  robots?: string;
  llms?: string;
  omit?: string[];
  /** Replaces the generated regions of every route entry point. */
  crawlable?: string;
};

/**
 * The part of a route entry point that scripts/generate-seo.mjs writes: the
 * JSON-LD graph and the crawlable block for crawlers that do not run
 * JavaScript.
 */
const crawlable = (page: (typeof pages)[number]) =>
  `<script type="application/ld+json" id="gpc-jsonld">{"@graph":[{"@type":"WebPage","url":"${canonicalUrl(
    page.path
  )}"},{"@type":"Organization","name":"Zazie Productions"}]}</script>\n<div class="gpc-static"><h1>${
    page.heading
  }</h1></div>`;

const renderSitemap = () =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map(
      (page) =>
        `  <url>\n    <loc>${canonicalUrl(page.path)}</loc>\n    <lastmod>${site.lastModified}</lastmod>\n  </url>`
    )
    .join('\n')}\n</urlset>\n`;

/** Write a minimal but valid build output, then apply the requested mutations. */
const writeArtefact = (redirects: Redirects = {}, overrides: ArtefactOverrides = {}) => {
  const dir = mkdtempSync(path.join(tmpdir(), 'gpc-dist-'));
  const omit = new Set(overrides.omit ?? []);
  const write = (relativePath: string, contents: string) => {
    if (omit.has(relativePath)) return;
    mkdirSync(path.dirname(path.join(dir, relativePath)), { recursive: true });
    writeFileSync(path.join(dir, relativePath), contents);
  };

  for (const page of pages) {
    const head = `<title>${page.title}</title>\n<link rel="canonical" href="${canonicalUrl(page.path)}" />\n<meta name="robots" content="index, follow" />`;
    const html = overrides.crawlable ? `${head}\n${overrides.crawlable}` : `${head}\n${crawlable(page)}`;
    if (page.path === '/') {
      write('index.html', html);
      continue;
    }
    const slug = page.path.slice(1);
    write(path.join(slug, 'index.html'), html);
    write(`${slug}.html`, html);
  }

  write('sitemap.xml', overrides.sitemap ?? renderSitemap());
  write(
    'llms.txt',
    overrides.llms ??
      '# Global Paradigms Corp.\n\n> fiction, not affiliated with any prior site.\n\n' +
        pages.map((page) => `${canonicalUrl(page.path)}`).join('\n')
  );
  write('robots.txt', overrides.robots ?? `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
  write(
    '404.html',
    '<meta name="robots" content="noindex, nofollow" />\n' +
      '<script type="application/ld+json" id="gpc-jsonld">{"@graph":[{"@type":"Organization","name":"Zazie Productions"}]}</script>\n'
  );
  write('_headers', '/*\n  X-Content-Type-Options: nosniff\n');
  write('_redirects', redirects._redirects ?? '# legacy routes\n/index.html  /  301\n');
  return dir;
};

const verify = (dir: string) => {
  try {
    const stdout = execFileSync(process.execPath, ['scripts/verify-dist.mjs', '--dist', dir], {
      cwd: process.cwd(),
      encoding: 'utf8'
    });
    return { ok: true, output: stdout };
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string };
    return { ok: false, output: `${failure.stdout ?? ''}${failure.stderr ?? ''}` };
  }
};

describe('verify:dist script', () => {
  it('accepts a complete, crawlable build output', () => {
    const dir = writeArtefact();
    try {
      const result = verify(dir);
      expect(result.output).toContain(`${pages.length} route entry points`);
      expect(result.ok).toBe(true);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects a catch-all rewrite that would answer /sitemap.xml with the app shell', () => {
    const dir = writeArtefact({ _redirects: '/*  /index.html  200\n' });
    try {
      const result = verify(dir);
      expect(result.ok).toBe(false);
      expect(result.output).toContain('rewrites every path to the application shell');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects an entry point with no crawlable block or JSON-LD', () => {
    const dir = writeArtefact({}, { crawlable: '<div id="root"></div>' });
    try {
      const result = verify(dir);
      expect(result.ok).toBe(false);
      expect(result.output).toContain('carries no crawlable block for non-JS crawlers');
      expect(result.output).toContain('carries no generated JSON-LD graph');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects structured data that marks the fictional company up as an organization', () => {
    const dir = writeArtefact(
      {},
      {
        crawlable:
          '<script type="application/ld+json" id="gpc-jsonld">{"@graph":[' +
          '{"@type":"Organization","name":"Global Paradigms Corp."}]}</script>\n' +
          '<div class="gpc-static">block</div>'
      }
    );
    try {
      const result = verify(dir);
      expect(result.ok).toBe(false);
      expect(result.output).toContain('exactly one Organization node');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects an llms.txt that lost the non-affiliation statement', () => {
    const dir = writeArtefact({}, { llms: '# Global Paradigms Corp.\n\nno disclaimer here\n' });
    try {
      const result = verify(dir);
      expect(result.ok).toBe(false);
      expect(result.output).toContain('non-affiliation');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects discovery files served as HTML', () => {
    const dir = writeArtefact({}, { sitemap: '<!doctype html><html><body>home</body></html>' });
    try {
      const result = verify(dir);
      expect(result.ok).toBe(false);
      expect(result.output).toContain('sitemap.xml is HTML');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('rejects a robots.txt without an allow rule and a missing route entry point', () => {
    const dir = writeArtefact({}, { robots: 'User-agent: *\nDisallow: /\n', omit: ['documents/index.html'] });
    try {
      const result = verify(dir);
      expect(result.ok).toBe(false);
      expect(result.output).toContain('robots.txt must begin with');
      expect(result.output).toContain('documents/index.html is missing');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
