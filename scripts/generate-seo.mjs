#!/usr/bin/env node
/**
 * Generate the crawlable build output and the committed discovery files.
 *
 * Vite remains the application bundler; this post-build step turns its single
 * shell into one static document per public route, each with its own head,
 * JSON-LD and crawlable block, so a crawler that never executes JavaScript
 * still gets a complete, self-canonical page. It also writes — and, with
 * `--check`, verifies — the three committed files in public/ that describe the
 * site to crawlers: robots.txt, sitemap.xml and llms.txt.
 *
 * Every string comes from src/config/seo.ts (via scripts/lib/load-seo.mjs) and
 * src/config/seo-pages.json, so no surface can drift from the copy the app
 * shows a player.
 *
 * Usage:
 *   node scripts/generate-seo.mjs                    build dist/ from dist/index.html
 *   node scripts/generate-seo.mjs --public           also refresh public/sitemap.xml etc.
 *   node scripts/generate-seo.mjs --check            verify the committed public files only
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { loadSeo, ROOT } from './lib/load-seo.mjs';
import {
  renderJsonLdScript,
  renderLlms,
  renderRobots,
  renderSitemap,
  renderStaticBlock
} from './lib/seo-surfaces.mjs';

const configPath = path.join(ROOT, 'src/config/seo-pages.json');
const publicDir = path.join(ROOT, 'public');
const distDir = path.join(ROOT, 'dist');
const config = JSON.parse(await readFile(configPath, 'utf8'));
const { site, pages } = config;
const seo = await loadSeo();

const INDEX_DIRECTIVES = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX_DIRECTIVES = 'noindex, nofollow';

function fail(message) {
  throw new Error(`[seo] ${message}`);
}

function validateConfig() {
  if (!/^https:\/\/[^/]+$/.test(site.origin)) {
    fail(`site.origin must be an HTTPS origin without a trailing slash; received ${site.origin}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(site.lastModified)) {
    fail(`site.lastModified must use YYYY-MM-DD; received ${site.lastModified}`);
  }
  if (!Array.isArray(pages) || pages.length === 0) fail('at least one public page is required');

  const paths = new Set();
  const titles = new Set();
  const descriptions = new Set();
  for (const page of pages) {
    if (!/^\/(?:[a-z0-9-]+)?$/.test(page.path)) fail(`invalid canonical path: ${page.path}`);
    if (page.path !== '/' && page.path.endsWith('/')) fail(`trailing slash is not canonical: ${page.path}`);
    if (paths.has(page.path)) fail(`duplicate path: ${page.path}`);
    if (titles.has(page.title)) fail(`duplicate title: ${page.title}`);
    if (descriptions.has(page.description)) fail(`duplicate description for ${page.path}`);
    if (page.title.length < 30 || page.title.length > 65) {
      fail(`${page.path} title should be 30–65 characters; received ${page.title.length}`);
    }
    if (page.description.length < 110 || page.description.length > 165) {
      fail(`${page.path} description should be 110–165 characters; received ${page.description.length}`);
    }
    paths.add(page.path);
    titles.add(page.title);
    descriptions.add(page.description);
  }
  if (!paths.has('/')) fail('the home page is missing');
  if (site.origin !== seo.CANONICAL_ORIGIN) {
    fail(`seo-pages.json origin (${site.origin}) disagrees with CANONICAL_ORIGIN (${seo.CANONICAL_ORIGIN})`);
  }
  if (pages.length !== seo.SEO_PAGES.length) {
    fail('the route manifest the scripts read and the one the app reads disagree');
  }
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const canonicalUrl = (pagePath) => `${site.origin}${pagePath === '/' ? '/' : pagePath}`;

/**
 * The per-route head. index.html carries this same block hand-written for `/`
 * (asserted by src/tests/seo.test.ts); every other route gets it injected here.
 */
function renderHead(page, indexable = true) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const url = canonicalUrl(page.path);
  const image = `${site.origin}${site.image}`;
  const directives = indexable ? INDEX_DIRECTIVES : NOINDEX_DIRECTIVES;
  const canonical = indexable ? `    <link rel="canonical" href="${url}" />\n` : '';

  return `<!-- SEO_PAGE_START -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${directives}" />
    <meta name="googlebot" content="${directives}" />
${canonical}    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(site.name)}" />
    <meta property="og:locale" content="${escapeHtml(site.locale)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(site.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${escapeHtml(site.imageAlt)}" />
    <!-- SEO_PAGE_END -->`;
}

/** Replace the three generated regions of a page with this route's version. */
function renderPage(template, page, indexable = true) {
  return template
    .replace(/<!-- SEO_PAGE_START -->[\s\S]*?<!-- SEO_PAGE_END -->/, renderHead(page, indexable))
    .replace(
      /<!-- @gpc-seo-jsonld:begin -->[\s\S]*?<!-- @gpc-seo-jsonld:end -->/,
      renderJsonLdScript(seo, page)
    )
    .replace(
      /<!-- @gpc-static-block:begin -->[\s\S]*?<!-- @gpc-static-block:end -->/,
      renderStaticBlock(seo, page)
    );
}

async function writeOrCheck(filePath, content, check) {
  if (check) {
    let existing = '';
    try {
      existing = await readFile(filePath, 'utf8');
    } catch {
      fail(`${path.relative(ROOT, filePath)} is missing; run npm run seo:generate`);
    }
    if (existing !== content) {
      fail(`${path.relative(ROOT, filePath)} is stale; run npm run seo:generate`);
    }
    return;
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

validateConfig();

const discovery = {
  'robots.txt': renderRobots(seo),
  'sitemap.xml': renderSitemap(seo),
  'llms.txt': renderLlms(seo)
};

const check = process.argv.includes('--check');
const writePublic = check || process.argv.includes('--public');

if (writePublic) {
  for (const [name, content] of Object.entries(discovery)) {
    await writeOrCheck(path.join(publicDir, name), content, check);
  }
}

if (!check && !process.argv.includes('--public-only')) {
  const templatePath = path.join(distDir, 'index.html');
  let template;
  try {
    template = await readFile(templatePath, 'utf8');
  } catch {
    fail('dist/index.html is missing; run this post-build or pass --public-only');
  }

  for (const page of pages) {
    const html = renderPage(template, page);
    if (page.path === '/') {
      await writeFile(path.join(distDir, 'index.html'), html);
      continue;
    }

    const slug = page.path.slice(1);
    const directoryEntry = path.join(distDir, slug, 'index.html');
    await mkdir(path.dirname(directoryEntry), { recursive: true });
    await writeFile(directoryEntry, html);
    // Flat entries support extensionless URLs on hosts that implement clean URLs
    // rather than directory indexes (including Vite's production preview).
    await writeFile(path.join(distDir, `${slug}.html`), html);
  }

  const notFound = {
    path: '/404',
    title: `File Not Found | ${site.name}`,
    heading: 'Archive File Not Found',
    description:
      'The requested Global Paradigms Corp. archive path does not exist. Return to the recovered archive index.'
  };
  await writeFile(path.join(distDir, '404.html'), renderPage(template, notFound, false));

  for (const [name, content] of Object.entries(discovery)) {
    await writeFile(path.join(distDir, name), content);
  }
}

console.log(
  check
    ? `[seo] validated ${pages.length} canonical pages, robots.txt, sitemap.xml and llms.txt`
    : `[seo] generated ${pages.length} canonical pages${writePublic ? ', plus robots.txt, sitemap.xml and llms.txt' : ''}`
);
