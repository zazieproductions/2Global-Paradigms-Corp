import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { FICTION_NOTICE, SITE } from '@/config/site';
import {
  ANSWER_FIRST,
  CANONICAL_ORIGIN,
  ERA_ONE,
  ERA_TWO,
  FACT_TABLE,
  FAQ,
  LEGACY_PAGE,
  SEO_DESCRIPTION,
  SEO_H1,
  SEO_SOCIAL,
  SEO_TITLE,
  absoluteUrl
} from '@/config/seo-copy';

/**
 * SEO / GEO invariants.
 *
 * The site describes itself on surfaces that cannot import each other: the
 * <head> of index.html, the generated crawlable block inside it, the generated
 * JSON-LD, robots.txt, sitemap.xml, llms.txt — plus SITE.title and /legacy,
 * which a mounted React app writes at runtime. If any two disagree, a crawler
 * (human or synthetic) gets a different story from a different door, which is
 * exactly the failure that makes a domain with a hoax in its past
 * untrustworthy.
 *
 * Copy lives in src/config/seo.ts. The two generated regions of index.html are
 * checked here and by `npm run seo:check`; edit the copy, run
 * `npm run seo:render`, and this suite goes green again.
 *
 * Lives in the Node tsconfig project (like digest-script.test.ts) because it
 * reads files off disk. It deliberately does not render React: the router is
 * read as source text so the sitemap can be held to the route table without
 * dragging the component graph into a typecheck that has no DOM.
 */
// Vitest runs from the repository root (see digest-script.test.ts, which
// relies on the same). import.meta.url is rewritten under jsdom and cannot be
// trusted for on-disk paths here.
const read = (relative: string): string => readFileSync(join(process.cwd(), relative), 'utf8');

const INDEX_HTML = read('index.html');
/** Prettier wraps long tags across lines; head assertions ignore layout. */
const HEAD = INDEX_HTML.replace(/\s+/g, ' ');
const ROBOTS = read('public/robots.txt');
// Comments in the sitemap explain the file; assertions are about its body.
const SITEMAP = read('public/sitemap.xml').replace(/<!--[\s\S]*?-->/g, '');
const LLMS = read('public/llms.txt');
const ROUTER_SOURCE = read('src/app/router.tsx');

/** Collapse formatting so assertions are about content, not indentation. */
const squash = (s: string): string => s.replace(/\s+/g, ' ').trim();

/** Turn an HTML fragment into comparable plain text. */
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
  const i = INDEX_HTML.indexOf(begin);
  const j = INDEX_HTML.indexOf(end);
  expect(i, `marker ${begin} must exist in index.html`).toBeGreaterThan(-1);
  expect(j, `marker ${end} must exist in index.html`).toBeGreaterThan(i);
  return INDEX_HTML.slice(i + begin.length, j);
};

const STATIC_BLOCK = region('<!-- @gpc-static-block:begin -->', '<!-- @gpc-static-block:end -->');
const STATIC_TEXT = textOf(STATIC_BLOCK);

type JsonNode = Record<string, unknown>;
const JSONLD = JSON.parse(
  region('<!-- @gpc-seo-jsonld:begin -->', '<!-- @gpc-seo-jsonld:end -->').match(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/
  )?.[1] ?? 'null'
) as { '@context': unknown; '@graph': JsonNode[] };
const node = (type: string): JsonNode | undefined => JSONLD['@graph'].find((n) => n['@type'] === type);

/** Routed public paths, read off the route table as source text. */
const ROUTER_PATHS: string[] = [
  ...[...ROUTER_SOURCE.matchAll(/\{\s*path:\s*'([^']+)'/g)].map((m) => (m[1] === '/' ? '/' : `/${m[1]}`))
].filter((path) => !path.includes('*'));

// ---------------------------------------------------------------------------
describe('the headline copy', () => {
  it('keeps index.html, SITE and seo-copy saying the same thing', () => {
    expect(SEO_TITLE).toBe(SITE.title);
    expect(SEO_DESCRIPTION).toBe(SITE.description);
    // seo-copy is import-free, so its studio/os/name are literals; pin them.
    expect(ERA_TWO.publisher).toBe(SITE.studio);
    expect(ERA_TWO.os).toBe(SITE.osVersion);
    expect(SEO_SOCIAL.siteName).toBe(SITE.name);
  });

  it('fits the SERP windows Google truncates at', () => {
    expect(SEO_TITLE.length).toBeGreaterThanOrEqual(30);
    expect(SEO_TITLE.length).toBeLessThanOrEqual(60);
    expect(SEO_DESCRIPTION.length).toBeGreaterThanOrEqual(140);
    expect(SEO_DESCRIPTION.length).toBeLessThanOrEqual(160);
  });

  it('carries both eras and the reopening in title and description', () => {
    const combined = `${SEO_TITLE} ${SEO_DESCRIPTION}`.toLowerCase();
    for (const token of ['global paradigms', '2006', 'lost', 'arg', 'hoax', '2026', 'hanso', 'valenzetti'])
      expect(combined, `missing query token: ${token}`).toContain(token);
  });
});

// ---------------------------------------------------------------------------
describe('index.html <head>', () => {
  it('serves the canonical title, description and canonical URL', () => {
    expect(HEAD).toContain(`<title>${SEO_TITLE}</title>`);
    expect(HEAD).toContain(`content="${SEO_DESCRIPTION}"`);
    expect(HEAD).toContain(`<link rel="canonical" href="${absoluteUrl('/')}" />`);
  });

  it('allows indexing and long snippets', () => {
    const robots = HEAD.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? '';
    expect(robots).toContain('index');
    expect(robots).toContain('follow');
    expect(robots).toContain('max-snippet:-1');
    expect(robots).not.toContain('noindex');
  });

  it('names the real publisher, never the fictional company', () => {
    expect(HEAD).toContain(`<meta name="author" content="${SITE.studio}" />`);
  });

  it('carries a complete Open Graph and Twitter card', () => {
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
      expect(HEAD, `missing og:${property}`).toContain(`<meta property="${property}" content="${value}" />`);
    }
    for (const [name, value] of [
      ['twitter:card', 'summary_large_image'],
      ['twitter:title', SEO_TITLE],
      ['twitter:description', SEO_DESCRIPTION],
      ['twitter:image', image],
      ['twitter:image:alt', SEO_SOCIAL.imageAlt]
    ]) {
      expect(HEAD, `missing twitter:${name}`).toContain(`<meta name="${name}" content="${value}" />`);
    }
  });

  it('ships an og:image that exists and is exactly the declared size', () => {
    const buffer = readFileSync(join(process.cwd(), 'public', SEO_SOCIAL.image));
    // JPEG SOF0..SOF3 carries the dimensions.
    let i = 2;
    let dims: [number, number] | null = null;
    while (i < buffer.length && !dims) {
      if (buffer[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buffer[i + 1];
      if (marker >= 0xc0 && marker <= 0xc3) {
        dims = [buffer.readUInt16BE(i + 7), buffer.readUInt16BE(i + 5)];
      } else if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2;
      } else {
        i += 2 + buffer.readUInt16BE(i + 2);
      }
    }
    expect(dims).toEqual([1200, 630]);
  });
});

// ---------------------------------------------------------------------------
describe('the static crawlable block (non-JS crawlers)', () => {
  it('exists, sits inside #root, and is substantial', () => {
    const rootIndex = INDEX_HTML.indexOf('<div id="root">');
    const blockIndex = INDEX_HTML.indexOf('<!-- @gpc-static-block:begin -->');
    expect(rootIndex).toBeGreaterThan(-1);
    expect(blockIndex).toBeGreaterThan(rootIndex);
    expect(STATIC_TEXT.length).toBeGreaterThan(4000);
  });

  it('opens with the entity statement as its only h1', () => {
    expect(STATIC_TEXT).toContain(squash(SEO_H1));
    expect((STATIC_BLOCK.match(/<h1[\s>]/g) ?? []).length).toBe(1);
  });

  it('states the complete answer before anything else', () => {
    for (const paragraph of ANSWER_FIRST) expect(STATIC_TEXT).toContain(squash(paragraph));
    expect(STATIC_TEXT.indexOf(squash(ANSWER_FIRST[0]))).toBeLessThan(
      STATIC_TEXT.indexOf('The record, in rows')
    );
  });

  it('carries every row of the fact table', () => {
    for (const row of FACT_TABLE) {
      expect(STATIC_TEXT, `fact row: ${row.field}`).toContain(squash(row.field));
      expect(STATIC_TEXT, `fact value: ${row.value}`).toContain(squash(row.value));
    }
  });

  it('carries every legacy section, quote and question', () => {
    for (const section of LEGACY_PAGE.sections) {
      expect(STATIC_TEXT, `section: ${section.heading}`).toContain(squash(section.heading));
      for (const paragraph of section.paragraphs ?? [])
        expect(STATIC_TEXT, `paragraph in ${section.id}`).toContain(squash(paragraph));
      for (const quote of section.quotes ?? [])
        expect(STATIC_TEXT, `quote in ${section.id}`).toContain(squash(quote.text));
      if (section.callout) expect(STATIC_TEXT).toContain(squash(section.callout));
    }
    for (const entry of FAQ) {
      expect(STATIC_TEXT, `faq q: ${entry.q}`).toContain(squash(entry.q));
      expect(STATIC_TEXT, `faq a: ${entry.q}`).toContain(squash(entry.a));
    }
  });

  it('names every Era I entity a searcher might be chasing', () => {
    for (const client of ERA_ONE.clients) expect(STATIC_TEXT).toContain(client);
    for (const person of ERA_ONE.staff) expect(STATIC_TEXT).toContain(person.name);
    for (const token of ['The Lost Experience', 'Lost', '2006', String(ERA_TWO.reopenedYear), SITE.studio]) {
      expect(STATIC_TEXT, `entity: ${token}`).toContain(token);
    }
  });

  it('links to every routed section exactly once', () => {
    const hrefs = (STATIC_BLOCK.match(/href="([^"]+)"/g) ?? []).map((h) => h.slice(6, -1));
    for (const path of ROUTER_PATHS) {
      expect(
        hrefs.filter((h: string) => h === path),
        `section link: ${path}`
      ).toHaveLength(1);
    }
  });

  it('closes with the out-of-world fiction notice, verbatim', () => {
    expect(STATIC_TEXT).toContain(squash(`FICTION // ${FICTION_NOTICE.long}`));
  });
});

// ---------------------------------------------------------------------------
describe('JSON-LD', () => {
  it('describes five nodes and parses', () => {
    expect(JSONLD['@context']).toBe('https://schema.org');
    expect(JSONLD['@graph']).toHaveLength(5);
  });

  it('never marks the fictional company up as a real organisation', () => {
    const organisations = JSONLD['@graph'].filter((n) => n['@type'] === 'Organization');
    expect(organisations).toHaveLength(1);
    expect(organisations[0].name).toBe(SITE.studio);
    for (const n of organisations) expect(String(n.name)).not.toContain('Global Paradigms');
  });

  it('disambiguates the CreativeWork and dates it to the reopening', () => {
    const work = node('CreativeWork');
    expect(work).toBeTruthy();
    expect(String(work?.disambiguatingDescription)).toMatch(/not affiliated|unrelated/i);
    expect(work?.datePublished).toBe(String(ERA_TWO.reopenedYear));
    expect(work?.isAccessibleForFree).toBe(true);
    expect(String(work?.abstract)).toContain('Seven Seals');
  });

  it('points at the external record of Era I', () => {
    const subjectOf = node('CreativeWork')?.subjectOf as JsonNode[];
    expect(subjectOf[0].url).toBe(LEGACY_PAGE.sources[0].url);
  });

  it('mirrors the FAQ exactly, question and answer', () => {
    const entities = node('FAQPage')?.mainEntity as JsonNode[];
    expect(entities).toHaveLength(FAQ.length);
    entities.forEach((entity, i) => {
      expect(entity.name).toBe(FAQ[i].q);
      expect((entity.acceptedAnswer as JsonNode).text).toBe(FAQ[i].a);
    });
  });

  it('declares the social image and canonical home page', () => {
    expect((node('WebPage')?.primaryImageOfPage as JsonNode).url).toBe(absoluteUrl(SEO_SOCIAL.image));
    expect(node('WebPage')?.url).toBe(absoluteUrl('/'));
    expect(node('WebSite')?.description).toBe(SEO_DESCRIPTION);
  });
});

// ---------------------------------------------------------------------------
describe('robots.txt', () => {
  const crawlerGroup = (agent: string): boolean =>
    new RegExp(
      `User-agent:\\s*${agent.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*\\nAllow:\\s*/`,
      'i'
    ).test(ROBOTS);

  it('lets everyone in — there is nothing private to hide', () => {
    expect(ROBOTS).toMatch(/User-agent:\s*\*\s*\nAllow:\s*\//);
    expect(ROBOTS).not.toMatch(/^\s*Disallow:/m);
  });

  it('welcomes every generative crawler by name', () => {
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
      expect(crawlerGroup(agent), `robots.txt must welcome ${agent}`).toBe(true);
    }
  });

  it('points at the sitemap', () => {
    expect(ROBOTS).toContain(`Sitemap: ${absoluteUrl('/sitemap.xml')}`);
  });
});

// ---------------------------------------------------------------------------
describe('sitemap.xml', () => {
  const locs = [...SITEMAP.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const sitemapPaths = locs.map((loc) => loc.replace(CANONICAL_ORIGIN, ''));

  it('covers every routed section and nothing that is not routed', () => {
    expect(new Set(sitemapPaths)).toEqual(new Set(ROUTER_PATHS));
  });

  it('lists the legacy file first, because it is the page engines should cite', () => {
    const legacy = SITEMAP.indexOf(`${CANONICAL_ORIGIN}/legacy</loc>`);
    expect(legacy).toBeGreaterThan(-1);
    expect(legacy).toBeLessThan(SITEMAP.indexOf(`${CANONICAL_ORIGIN}/sanctum</loc>`));
  });

  it('omits the priority and changefreq hints search engines ignore', () => {
    expect(SITEMAP).not.toMatch(/<priority>|<changefreq>/);
  });

  it('emits only absolute URLs under the canonical origin', () => {
    expect(locs).toHaveLength(19);
    for (const loc of locs) expect(loc).toMatch(new RegExp(`^${CANONICAL_ORIGIN}/`));
  });

  it('omits the modal deep-link query strings', () => {
    expect(SITEMAP).not.toContain('?record=');
    expect(SITEMAP).not.toContain('?doc=');
  });
});

// ---------------------------------------------------------------------------
describe('llms.txt', () => {
  it('opens with the answer-first paragraph, verbatim', () => {
    // The same passage opens the crawlable block in index.html and /legacy:
    // one entity statement, three surfaces, no paraphrase drift.
    const head = LLMS.slice(0, 1600);
    for (const paragraph of ANSWER_FIRST) expect(head).toContain(paragraph);
    expect(LLMS.indexOf(squash(ANSWER_FIRST[0]))).toBeLessThan(LLMS.indexOf('## The entity, in brief'));
  });

  it('states the entity and the non-affiliation up front', () => {
    const head = LLMS.slice(0, 1600);
    expect(head).toContain('Global Paradigms Corp.');
    expect(head.toLowerCase()).toContain('fiction');
    expect(head).toContain('not affiliated with');
    expect(head).toContain('The Lost Experience');
  });

  it('points models at the citation targets first', () => {
    const legacy = LLMS.indexOf(absoluteUrl('/legacy'));
    expect(legacy).toBeGreaterThan(-1);
    expect(legacy).toBeLessThan(LLMS.indexOf(absoluteUrl('/sanctum')));
  });

  it('tells models not to invent puzzle answers', () => {
    expect(LLMS.toLowerCase()).toContain('answers are intentionally absent');
  });
});

// ---------------------------------------------------------------------------
describe('the generated regions are in sync', () => {
  it('keeps index.html derived from src/config/seo.ts', () => {
    // Same assertion as `npm run seo:check:static`, in-suite so a bare
    // `npm test` cannot be fooled by a stale index.html.
    const output = execFileSync(process.execPath, ['scripts/render-static-block.mjs', '--check'], {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    expect(output).toContain('✓');
  });

  it('keeps the committed discovery files derived from the same copy', () => {
    // `npm run seo:check:discovery`: robots.txt, sitemap.xml and llms.txt are
    // generated, and this fails if any of them is stale.
    const output = execFileSync(process.execPath, ['scripts/generate-seo.mjs', '--check'], {
      encoding: 'utf8',
      cwd: process.cwd()
    });
    expect(output).toContain('validated');
  });
});

// ---------------------------------------------------------------------------
describe('the CSP hash for the inline JSON-LD', () => {
  // An inline <script type="application/ld+json"> still needs a script-src
  // hash. The hash is generated by scripts/render-static-block.mjs; a stale one
  // means the structured data is silently blocked in production.
  const liveHash = `'sha256-${createHash('sha256')
    .update(
      region('<!-- @gpc-seo-jsonld:begin -->', '<!-- @gpc-seo-jsonld:end -->').match(
        /<script[^>]*>([\s\S]*)<\/script>/
      )![1],
      'utf8'
    )
    .digest('base64')}'`;

  it('matches the hash served in public/_headers and vercel.json', () => {
    expect(read('public/_headers')).toContain(liveHash);
    expect(read('vercel.json')).toContain(liveHash);
  });
});

// ---------------------------------------------------------------------------
describe('the retired social card', () => {
  it('is not referenced anywhere: one image, 1200×630, /assets/images/og-card.jpg', () => {
    expect(INDEX_HTML).not.toContain('og-image.png');
    expect(read('src/config/seo-pages.json')).not.toContain('og-image.png');
    expect(read('vercel.json')).not.toContain('og-image.png');
    expect(read('src/config/seo-copy.ts')).not.toContain('og-image.png');
  });
});

// ---------------------------------------------------------------------------
describe('the route manifest', () => {
  const PAGES = JSON.parse(read('src/config/seo-pages.json')).pages as {
    path: string;
    title: string;
    description: string;
  }[];

  it('describes the home route with the headline copy', () => {
    const home = PAGES.find((page) => page.path === '/');
    expect(home?.title).toBe(SEO_TITLE);
    expect(home?.description).toBe(SEO_DESCRIPTION);
  });

  it('describes the legacy file with its own title and a full-length description', () => {
    const legacy = PAGES.find((page) => page.path === '/legacy');
    expect(legacy?.title).toContain('Legacy File');
    expect(legacy?.description).toContain('2006');
    expect(legacy?.description.length).toBeGreaterThanOrEqual(110);
  });

  it('names every routed path exactly once', () => {
    // Order is the navigation's, not the route table's: the sitemap lists
    // /legacy first, because it is the page a generative engine should cite.
    expect([...PAGES.map((page) => page.path)].sort()).toEqual([...ROUTER_PATHS].sort());
    expect(PAGES.map((page) => page.path)[1]).toBe('/legacy');
  });
});

// ---------------------------------------------------------------------------
describe('llms.txt covers the whole archive', () => {
  it('links every routed section', () => {
    for (const path of ROUTER_PATHS) {
      expect(LLMS, `llms.txt is missing ${path}`).toContain(absoluteUrl(path));
    }
  });

  it('carries the same fact table the crawlable block shows', () => {
    for (const row of FACT_TABLE) expect(LLMS).toContain(`| ${row.field} |`);
  });
});
