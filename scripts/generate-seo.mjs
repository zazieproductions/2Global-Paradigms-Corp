#!/usr/bin/env node
/**
 * Generate crawlable HTML entry points, robots.txt and sitemap.xml from the
 * shared SEO manifest. Vite remains the application bundler; this post-build
 * step turns its single shell into one static document per public route.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const configPath = path.join(root, 'src/config/seo-pages.json');
const publicDir = path.join(root, 'public');
const distDir = path.join(root, 'dist');
const config = JSON.parse(await readFile(configPath, 'utf8'));
const { site, pages } = config;

const INDEX_DIRECTIVES = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

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
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const canonicalUrl = (pagePath) => `${site.origin}${pagePath === '/' ? '/' : pagePath}`;

function renderHead(page, indexable = true) {
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const url = canonicalUrl(page.path);
  const image = `${site.origin}${site.image}`;
  const directives = indexable ? INDEX_DIRECTIVES : 'noindex, nofollow';
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

function renderNavigation(activePath) {
  const items = pages
    .map((page) => {
      const current = page.path === activePath ? ' aria-current="page"' : '';
      return `              <li><a href="${page.path}"${current}>${escapeHtml(page.heading)}</a></li>`;
    })
    .join('\n');

  return `<nav aria-label="Archive sections">
            <h2>Explore the archive</h2>
            <ul>
${items}
            </ul>
          </nav>`;
}

function renderFallback(page, isNotFound = false) {
  const breadcrumb =
    page.path === '/'
      ? ''
      : `<nav aria-label="Breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
            <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
              <a itemprop="item" href="/"><span itemprop="name">Recovered Archive</span></a>
              <meta itemprop="position" content="1" />
            </span>
            <span aria-hidden="true"> / </span>
            <span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
              <span itemprop="name">${escapeHtml(page.heading)}</span>
              <meta itemprop="position" content="2" />
            </span>
          </nav>`;
  const interactiveNote = isNotFound
    ? 'Return to the recovered archive or choose a public section below.'
    : 'JavaScript opens this section in the interactive archive terminal. Every public section is also linked below.';

  return `<!-- SEO_FALLBACK_START -->
      <main id="seo-fallback">
        <article itemscope itemtype="https://schema.org/CreativeWork">
          ${breadcrumb}
          <p class="seo-kicker">Recovered archive // original interactive fiction</p>
          <h1 itemprop="headline">${escapeHtml(page.heading)}</h1>
          <p itemprop="description">${escapeHtml(page.description)}</p>
          <p>${interactiveNote}</p>
          ${renderNavigation(page.path)}
          <p class="seo-notice">
            FICTION // An original interactive story by Zazie Productions. All organisations, people and
            events are invented. This work is not affiliated with any existing franchise, studio or prior
            third-party website.
          </p>
        </article>
      </main>
      <!-- SEO_FALLBACK_END -->`;
}

function renderPage(template, page, indexable = true, isNotFound = false) {
  const withHead = template.replace(
    /<!-- SEO_PAGE_START -->[\s\S]*?<!-- SEO_PAGE_END -->/,
    renderHead(page, indexable)
  );
  return withHead.replace(
    /<!-- SEO_FALLBACK_START -->[\s\S]*?<!-- SEO_FALLBACK_END -->/,
    renderFallback(page, isNotFound)
  );
}

function renderSitemap() {
  const urls = pages
    .map(
      (page) => `  <url>
    <loc>${canonicalUrl(page.path)}</loc>
    <lastmod>${site.lastModified}</lastmod>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function renderRobots() {
  return `# Global Paradigms Corp. is a public interactive-fiction archive.
User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`;
}

async function writeOrCheck(filePath, content, check) {
  if (check) {
    let existing = '';
    try {
      existing = await readFile(filePath, 'utf8');
    } catch {
      fail(`${path.relative(root, filePath)} is missing; run npm run seo:generate`);
    }
    if (existing !== content) {
      fail(`${path.relative(root, filePath)} is stale; run npm run seo:generate`);
    }
    return;
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, content);
}

validateConfig();
const sitemap = renderSitemap();
const robots = renderRobots();
const check = process.argv.includes('--check');
const writePublic = check || process.argv.includes('--public');

if (writePublic) {
  await writeOrCheck(path.join(publicDir, 'sitemap.xml'), sitemap, check);
  await writeOrCheck(path.join(publicDir, 'robots.txt'), robots, check);
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
      'The requested Global Paradigms Corp. archive path does not exist. Return to the recovered interactive-fiction archive.'
  };
  await writeFile(path.join(distDir, '404.html'), renderPage(template, notFound, false, true));
  await writeFile(path.join(distDir, 'sitemap.xml'), sitemap);
  await writeFile(path.join(distDir, 'robots.txt'), robots);
}

console.log(
  check
    ? `[seo] validated ${pages.length} canonical pages and generated public files`
    : `[seo] generated ${pages.length} canonical pages${writePublic ? ', sitemap.xml and robots.txt' : ''}`
);
