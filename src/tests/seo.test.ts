import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SITE } from '@/config/site';
import {
  ANSWER_FIRST,
  CANONICAL_ORIGIN,
  ERA_TWO,
  FACT_TABLE,
  FAQ,
  SEO_DESCRIPTION,
  SEO_H1,
  SEO_SOCIAL,
  SEO_TITLE,
  absoluteUrl
} from '@/config/seo-copy';
const read = (relative: string): string => readFileSync(join(process.cwd(), relative), 'utf8');
const SEO_PAGES = JSON.parse(read('src/config/seo-pages.json')).pages as {
  path: string;
  title: string;
  heading: string;
  description: string;
}[];
const INDEX_HTML = read('index.html');
const HEAD = INDEX_HTML.replace(/\s+/g, ' ');
const ROBOTS = read('public/robots.txt');
const SITEMAP = read('public/sitemap.xml').replace(/<!--[\s\S]*?-->/g, '');
const LLMS = read('public/llms.txt');
const MANIFEST = read('public/site.webmanifest');
const ROUTER_SOURCE = read('src/app/router.tsx');

const squash = (value: string): string => value.replace(/\s+/g, ' ').trim();

const textOf = (html: string): string =>
  squash(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&rsquo;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&mdash;/g, '—')
      .replace(/&ndash;/g, '–')
      .replace(/&middot;/g, '·')
      .replace(/&rarr;/g, '→')
  );

const region = (begin: string, end: string): string => {
  const start = INDEX_HTML.indexOf(begin);
  const finish = INDEX_HTML.indexOf(end);
  expect(start, `marker ${begin} must exist in index.html`).toBeGreaterThan(-1);
  expect(finish, `marker ${end} must exist in index.html`).toBeGreaterThan(start);
  return INDEX_HTML.slice(start + begin.length, finish);
};

const STATIC_BLOCK = region('<!-- @gpc-static-block:begin -->', '<!-- @gpc-static-block:end -->');
const STATIC_TEXT = textOf(STATIC_BLOCK);
const JSONLD_SOURCE = region('<!-- @gpc-seo-jsonld:begin -->', '<!-- @gpc-seo-jsonld:end -->');

type JsonNode = Record<string, unknown>;
const JSONLD = JSON.parse(
  JSONLD_SOURCE.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? 'null'
) as { '@context': unknown; '@graph': JsonNode[] };
const node = (type: string): JsonNode | undefined =>
  JSONLD['@graph'].find((entry) => entry['@type'] === type);

const ROUTER_PATHS = [...ROUTER_SOURCE.matchAll(/\{\s*path:\s*'([^']+)'/g)]
  .map((match) => (match[1] === '/' ? '/' : `/${match[1]}`))
  .filter((route) => !route.includes('*'));

// ---------------------------------------------------------------------------
describe('archive headline metadata', () => {
  it('keeps the site shell, metadata source and route manifest aligned', () => {
    expect(SEO_TITLE).toBe(SITE.title);
    expect(SEO_DESCRIPTION).toBe(SITE.description);
    expect(SEO_TITLE).toBe(SEO_PAGES.find((page) => page.path === '/')?.title);
    expect(SEO_DESCRIPTION).toBe(SEO_PAGES.find((page) => page.path === '/')?.description);
    expect(ERA_TWO.publisher).toBe(SITE.studio);
    expect(ERA_TWO.os).toBe(SITE.osVersion);
    expect(SEO_SOCIAL.siteName).toBe(SITE.name);
  });

  it('uses concise titles and a full search-result summary', () => {
    expect(SEO_TITLE.length).toBeGreaterThanOrEqual(30);
    expect(SEO_TITLE.length).toBeLessThanOrEqual(65);
    expect(SEO_DESCRIPTION.length).toBeGreaterThanOrEqual(110);
    expect(SEO_DESCRIPTION.length).toBeLessThanOrEqual(165);
    expect(SEO_DESCRIPTION).toContain('recovered records');
    expect(SEO_DESCRIPTION).toContain('restoration logs');
  });
});

// ---------------------------------------------------------------------------
describe('index.html metadata and social card', () => {
  it('serves the canonical title, description and HTTPS URL', () => {
    expect(HEAD).toContain(`<title>${SEO_TITLE}</title>`);
    expect(HEAD).toContain(`content="${SEO_DESCRIPTION}"`);
    expect(HEAD).toContain(`<link rel="canonical" href="${absoluteUrl('/')}" />`);
    expect(CANONICAL_ORIGIN).toBe('https://globalparadigmscorp.com');
  });

  it('allows indexing with complete Open Graph and Twitter metadata', () => {
    const robots = HEAD.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? '';
    expect(robots).toContain('index');
    expect(robots).toContain('follow');
    expect(robots).toContain('max-snippet:-1');
    expect(robots).not.toContain('noindex');
    expect(HEAD).toContain(`<meta name="author" content="${SITE.studio}" />`);

    const image = absoluteUrl(SEO_SOCIAL.image);
    for (const [property, value] of [
      ['og:site_name', SITE.name],
      ['og:type', 'website'],
      ['og:locale', 'en_US'],
      ['og:url', absoluteUrl('/')],
      ['og:title', SEO_TITLE],
      ['og:description', SEO_DESCRIPTION],
      ['og:image', image],
      ['og:image:width', '1200'],
      ['og:image:height', '630'],
      ['og:image:alt', SEO_SOCIAL.imageAlt]
    ]) {
      expect(HEAD, `missing ${property}`).toContain(`<meta property="${property}" content="${value}" />`);
    }
    for (const [name, value] of [
      ['twitter:card', 'summary_large_image'],
      ['twitter:title', SEO_TITLE],
      ['twitter:description', SEO_DESCRIPTION],
      ['twitter:image', image],
      ['twitter:image:alt', SEO_SOCIAL.imageAlt]
    ]) {
      expect(HEAD, `missing ${name}`).toContain(`<meta name="${name}" content="${value}" />`);
    }
  });

  it('ships the redesigned 1200×630 social card and a matching SVG source', () => {
    const buffer = readFileSync(join(process.cwd(), 'public', SEO_SOCIAL.image));
    let index = 2;
    let dimensions: [number, number] | null = null;
    while (index < buffer.length && !dimensions) {
      if (buffer[index] !== 0xff) {
        index += 1;
        continue;
      }
      const marker = buffer[index + 1];
      if (marker >= 0xc0 && marker <= 0xc3) {
        dimensions = [buffer.readUInt16BE(index + 7), buffer.readUInt16BE(index + 5)];
      } else if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
        index += 2;
      } else {
        index += 2 + buffer.readUInt16BE(index + 2);
      }
    }
    expect(dimensions).toEqual([1200, 630]);
    const artwork = read('public/assets/images/og-card.svg');
    expect(artwork).toContain('RECOVERED');
    expect(artwork).toContain('ARCHIVE');
    expect(artwork).not.toMatch(/2006|HOAX/i);
  });
});

// ---------------------------------------------------------------------------
describe('crawlable archive summary', () => {
  it('sits inside #root, has one heading and preserves the answer-first opening', () => {
    const rootIndex = INDEX_HTML.indexOf('<div id="root">');
    const blockIndex = INDEX_HTML.indexOf('<!-- @gpc-static-block:begin -->');
    expect(rootIndex).toBeGreaterThan(-1);
    expect(blockIndex).toBeGreaterThan(rootIndex);
    expect(STATIC_TEXT.length).toBeGreaterThan(1500);
    expect(STATIC_TEXT).toContain(squash(SEO_H1));
    expect((STATIC_BLOCK.match(/<h1[\s>]/g) ?? []).length).toBe(1);
    for (const paragraph of ANSWER_FIRST) expect(STATIC_TEXT).toContain(squash(paragraph));
    expect(STATIC_TEXT.indexOf(squash(ANSWER_FIRST[0]))).toBeLessThan(
      STATIC_TEXT.indexOf('The archive, in rows')
    );
  });

  it('shows every archive fact and operator reference from the shared source', () => {
    for (const row of FACT_TABLE) {
      expect(STATIC_TEXT, `fact field: ${row.field}`).toContain(squash(row.field));
      expect(STATIC_TEXT, `fact value: ${row.value}`).toContain(squash(row.value));
    }
    for (const entry of FAQ) {
      expect(STATIC_TEXT, `question: ${entry.q}`).toContain(squash(entry.q));
      expect(STATIC_TEXT, `answer: ${entry.q}`).toContain(squash(entry.a));
    }
  });

  it('links every routed archive section exactly once', () => {
    const hrefs = [...STATIC_BLOCK.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(ROUTER_PATHS)).toEqual(new Set(SEO_PAGES.map((page) => page.path)));
    for (const route of ROUTER_PATHS) {
      expect(
        hrefs.filter((href) => href === route),
        `section link: ${route}`
      ).toHaveLength(1);
    }
  });
});

// ---------------------------------------------------------------------------
describe('structured data', () => {
  it('parses a five-node graph with the archive, publisher, page and FAQ', () => {
    expect(JSONLD['@context']).toBe('https://schema.org');
    expect(JSONLD['@graph']).toHaveLength(5);
    expect(node('WebSite')).toBeTruthy();
    expect(node('Organization')).toBeTruthy();
    expect(node('CreativeWork')).toBeTruthy();
    expect(node('WebPage')).toBeTruthy();
    expect(node('FAQPage')).toBeTruthy();
  });

  it('names the publisher as the Organization and the archive as a CreativeWork', () => {
    const publisher = node('Organization');
    const archive = node('CreativeWork');
    expect(publisher?.name).toBe(SITE.studio);
    expect(archive?.name).toBe(SEO_TITLE);
    expect(archive?.datePublished).toBe(ERA_TWO.reopenedYear);
    expect(archive?.isAccessibleForFree).toBe(true);
    expect(String(archive?.abstract)).toContain('sealed case files');
    expect(archive).not.toHaveProperty('disambiguatingDescription');
  });

  it('keeps structured answers identical to the operator reference', () => {
    const entries = node('FAQPage')?.mainEntity as JsonNode[];
    expect(entries).toHaveLength(FAQ.length);
    entries.forEach((entry, index) => {
      expect(entry.name).toBe(FAQ[index].q);
      expect((entry.acceptedAnswer as JsonNode).text).toBe(FAQ[index].a);
    });
  });

  it('uses the canonical page and selected social artwork', () => {
    expect((node('WebPage')?.primaryImageOfPage as JsonNode).url).toBe(absoluteUrl(SEO_SOCIAL.image));
    expect(node('WebPage')?.url).toBe(absoluteUrl('/'));
    expect(node('WebSite')?.description).toBe(SEO_DESCRIPTION);
  });
});

// ---------------------------------------------------------------------------
describe('robots.txt and sitemap.xml', () => {
  const crawlerGroup = (agent: string): boolean =>
    new RegExp(
      `User-agent:\\s*${agent.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*\\nAllow:\\s*/`,
      'i'
    ).test(ROBOTS);

  it('allows open crawling and lists the configured discovery agents', () => {
    expect(ROBOTS).toMatch(/User-agent:\s*\*\s*\nAllow:\s*\//);
    expect(ROBOTS).not.toMatch(/^\s*Disallow:/m);
    expect(ROBOTS).toContain(`Sitemap: ${absoluteUrl('/sitemap.xml')}`);
    for (const agent of [
      'GPTBot',
      'OAI-SearchBot',
      'ChatGPT-User',
      'ClaudeBot',
      'Claude-Web',
      'Claude-SearchBot',
      'anthropic-ai',
      'PerplexityBot',
      'Perplexity-User',
      'Google-Extended',
      'Applebot-Extended',
      'Amazonbot',
      'Meta-ExternalAgent',
      'cohere-ai',
      'DuckAssistBot',
      'MistralAI-User',
      'Bytespider',
      'CCBot'
    ]) {
      expect(crawlerGroup(agent), `robots.txt entry for ${agent}`).toBe(true);
    }
  });

  it('lists every canonical route in manifest order without query variants', () => {
    const locations = [...SITEMAP.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locations).toEqual(SEO_PAGES.map((page) => absoluteUrl(page.path)));
    expect(SITEMAP).not.toMatch(/<priority>|<changefreq>/);
    expect(SITEMAP).not.toContain('?record=');
    expect(SITEMAP).not.toContain('?doc=');
  });
});

// ---------------------------------------------------------------------------
describe('llms.txt', () => {
  it('opens with the same archive summary and fact table', () => {
    const beginning = LLMS.slice(0, 1600);
    for (const paragraph of ANSWER_FIRST) expect(beginning).toContain(paragraph);
    expect(LLMS.indexOf(ANSWER_FIRST[0])).toBeLessThan(LLMS.indexOf('## Archive index'));
    for (const row of FACT_TABLE) expect(LLMS).toContain(`| ${row.field} | ${row.value} |`);
  });

  it('indexes every route and keeps case-file answers out of the discovery index', () => {
    for (const route of ROUTER_PATHS) expect(LLMS).toContain(absoluteUrl(route));
    expect(LLMS).toContain('Case-file answer keys are not included in this index.');
    expect(LLMS).toContain('Progress is stored in this browser only');
  });
});

// ---------------------------------------------------------------------------
describe('public discovery surfaces', () => {
  it('does not expose the withheld framing terms in crawlable text or metadata', () => {
    const surfaces = [
      INDEX_HTML,
      ROBOTS,
      SITEMAP,
      LLMS,
      MANIFEST,
      read('public/favicon.svg'),
      read('public/assets/images/og-card.svg')
    ];
    for (const surface of surfaces) expect(surface).not.toMatch(/\b(?:arg|fiction\w*)\b/i);
  });

  it('keeps /legacy as the stable route for the Restoration Ledger', () => {
    const ledger = SEO_PAGES.find((page) => page.path === '/legacy');
    const navigation = read('src/config/navigation.ts');
    expect(ledger?.title).toContain('Restoration Ledger');
    expect(ledger?.heading).toBe('Restoration Ledger');
    expect(ledger?.description).toContain('archive');
    expect(navigation).toContain("id: 'legacy'");
    expect(navigation).toContain("label: 'Restoration Ledger'");
    expect(read('src/pages/legacy-page.tsx')).toContain('RESTORATION_LOGS');
  });
});

// ---------------------------------------------------------------------------
describe('generated regions and the JSON-LD CSP hash', () => {
  it('keeps index.html synchronized with the SEO source', () => {
    const output = execFileSync(process.execPath, ['scripts/render-static-block.mjs', '--check'], {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    expect(output).toContain('✓');
  });

  it('keeps robots.txt, sitemap.xml and llms.txt synchronized', () => {
    const output = execFileSync(process.execPath, ['scripts/generate-seo.mjs', '--check'], {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    expect(output).toContain('validated');
  });

  it('matches the hash served in public/_headers and vercel.json', () => {
    const liveHash = `'sha256-${createHash('sha256')
      .update(JSONLD_SOURCE.match(/<script[^>]*>([\s\S]*)<\/script>/)![1], 'utf8')
      .digest('base64')}'`;
    expect(read('public/_headers')).toContain(liveHash);
    expect(read('vercel.json')).toContain(liveHash);
  });
});
