#!/usr/bin/env node
/**
 * Post-build verification of the artifact a host actually uploads.
 *
 * `npm run seo:check` guards the committed public/ files; this guards dist/.
 * A build can pass every unit test and still break Search Console by shipping
 * an HTML sitemap, a missing robots.txt, or a catch-all rewrite that answers
 * unknown paths — and the discovery files — with the application shell. Failing
 * the build here keeps that class of regression away from production.
 *
 * Usage: node scripts/verify-dist.mjs [--dist <dir>]
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(path.join(ROOT, 'src/config/seo-pages.json'), 'utf8'));
const { site, pages } = manifest;
const { origin } = site;

const SITEMAP_PROLOGUE = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const canonicalUrl = (pagePath) => (pagePath === '/' ? `${origin}/` : `${origin}${pagePath}`);

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

function parseArgs(argv) {
  const index = argv.indexOf('--dist');
  if (index === -1) return path.resolve(process.cwd(), 'dist');
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error('--dist requires a directory argument');
  }
  return path.resolve(process.cwd(), value);
}

/**
 * A rewrite that answers a wildcard source with the application shell hides
 * every static file underneath it: /sitemap.xml and /robots.txt included.
 */
function findShadowingRules(redirectsText) {
  const offenders = [];
  for (const rawLine of redirectsText.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const [from, to, rawStatus] = line.split(/\s+/);
    const status = (rawStatus ?? '').replace(/!$/, '');
    if (status !== '200' || !from || !to) continue;

    const target = to.replace(/^\/+/, '');
    const wildcard = from.includes('*') || from.includes(':');
    if (wildcard && target === 'index.html') {
      offenders.push(
        `_redirects rewrites every path to the application shell ("${from} ${to} ${status}"); remove it so /sitemap.xml, /robots.txt and unknown paths keep their real responses`
      );
      continue;
    }
    if (target === 'sitemap.xml' || target === 'robots.txt') {
      offenders.push(
        `_redirects shadows /${target} with a 200 rewrite; the static discovery file must be served`
      );
    }
  }
  return offenders;
}

async function main() {
  const distDir = parseArgs(process.argv.slice(2));
  const problems = [];

  const readArtifact = async (relativePath) => {
    try {
      return await readFile(path.join(distDir, relativePath), 'utf8');
    } catch {
      problems.push(`${relativePath} is missing from the build output`);
      return null;
    }
  };

  const looksLikeHtml = (text) => /<!doctype html|<html[\s>]/i.test(text);

  const checkSitemap = (xml) => {
    if (looksLikeHtml(xml)) {
      problems.push(
        'sitemap.xml is HTML, not XML; a catch-all rewrite is serving the app shell instead of the file'
      );
      return;
    }
    if (!xml.startsWith(`${SITEMAP_PROLOGUE}\n`)) {
      problems.push('sitemap.xml must begin with the XML declaration and the sitemap <urlset> element');
    }
    if (!xml.trimEnd().endsWith('</urlset>')) {
      problems.push('sitemap.xml is truncated; it does not close with </urlset>');
    }

    const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const expected = pages.map((page) => canonicalUrl(page.path));
    if (locations.join(',') !== expected.join(',')) {
      const missing = expected.filter((url) => !locations.includes(url));
      const unexpected = locations.filter((url) => !expected.includes(url));
      problems.push(
        `sitemap.xml does not match the SEO manifest (${locations.length}/${expected.length} URLs` +
          `${missing.length ? `; missing ${missing.join(', ')}` : ''}` +
          `${unexpected.length ? `; unexpected ${unexpected.join(', ')}` : ''})`
      );
    }

    const lastmods = [...xml.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)].map((match) => match[1]);
    if (lastmods.length !== locations.length) {
      problems.push(`sitemap.xml lists ${locations.length} URLs but ${lastmods.length} <lastmod> values`);
    }
    for (const value of lastmods) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        problems.push(`sitemap.xml has a malformed <lastmod> value: ${value}`);
      }
    }
    if (/<priority>|<changefreq>/.test(xml)) {
      problems.push(
        'sitemap.xml contains <priority> or <changefreq>, which the generator deliberately omits'
      );
    }
  };

  const checkRobots = (text) => {
    if (looksLikeHtml(text)) {
      problems.push(
        'robots.txt is HTML, not plain text; a catch-all rewrite is serving the app shell instead of the file'
      );
      return;
    }
    if (!text.startsWith('User-agent: *\nAllow: /\n')) {
      problems.push('robots.txt must begin with "User-agent: *" followed by "Allow: /"');
    }
    if (!text.includes(`Sitemap: ${origin}/sitemap.xml`)) {
      problems.push(`robots.txt does not advertise ${origin}/sitemap.xml`);
    }
    if (/^Disallow:\s*\/\s*$/m.test(text)) {
      problems.push('robots.txt blocks crawling with "Disallow: /"');
    }
  };

  const checkRoute = async (page) => {
    const url = canonicalUrl(page.path);
    const slug = page.path === '/' ? '' : page.path.slice(1);
    const targets = slug ? [path.join(slug, 'index.html'), `${slug}.html`] : ['index.html'];

    for (const target of targets) {
      const html = await readArtifact(target);
      if (html === null) continue;
      if (!html.includes(`<link rel="canonical" href="${url}" />`)) {
        problems.push(`${target} carries no self-referencing canonical link to ${url}`);
      }
      if (!html.includes(`<title>${escapeHtml(page.title)}</title>`)) {
        problems.push(`${target} is missing its SEO manifest title`);
      }
      if (!html.includes('content="index, follow')) {
        problems.push(`${target} is not marked indexable`);
      }
    }
  };

  const sitemap = await readArtifact('sitemap.xml');
  if (sitemap !== null) checkSitemap(sitemap);

  const robots = await readArtifact('robots.txt');
  if (robots !== null) checkRobots(robots);

  const notFound = await readArtifact('404.html');
  if (notFound !== null && !notFound.includes('content="noindex, nofollow"')) {
    problems.push('404.html is not marked noindex, so unknown paths can surface as soft 404s');
  }

  const redirects = await readArtifact('_redirects');
  if (redirects !== null) problems.push(...findShadowingRules(redirects));

  // Netlify/Cloudflare Pages read _headers from the artifact; readArtifact records it when absent.
  await readArtifact('_headers');

  for (const page of pages) {
    await checkRoute(page);
  }

  if (problems.length > 0) {
    console.error(`[verify-dist] ${path.relative(process.cwd(), distDir) || '.'} is not deployable:`);
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error('[verify-dist] fix the build output before deploying this revision');
    process.exitCode = 1;
    return;
  }

  console.log(
    `[verify-dist] ${pages.length} route entry points, sitemap.xml (${pages.length} URLs) and robots.txt verified for ${origin}`
  );
}

await main();
