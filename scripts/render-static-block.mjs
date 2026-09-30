#!/usr/bin/env node
/**
 * render-static-block — regenerates the machine-facing half of index.html.
 *
 *   node scripts/render-static-block.mjs            inject into index.html
 *   node scripts/render-static-block.mjs --check    exit 1 if index.html or the CSP hash is stale
 *   node scripts/render-static-block.mjs --stdout   print the regions, touch nothing
 *
 * WHY THIS EXISTS
 * The site's SEO/GEO copy lives in src/config/seo.ts. Two surfaces cannot
 * import that module: index.html (Vite serves it as-is) and the crawlers that
 * read it. Before this script they were hand-copied, which meant every edit to
 * the copy silently desynchronised the crawlable layer — the exact failure
 * mode the rest of this repo prevents by deriving counts from collections.
 *
 * So index.html carries two GENERATED regions between HTML comment markers:
 *
 *   <!-- @gpc-seo-jsonld:begin -->   …full JSON-LD @graph…        <!-- @gpc-seo-jsonld:end -->
 *   <!-- @gpc-static-block:begin --> …the crawlable body block…   <!-- @gpc-static-block:end -->
 *
 * Everything else in index.html (head tags, the block's <style>) is
 * hand-written and asserted by src/tests/seo.test.ts.
 *
 * The static block exists because GPTBot, ClaudeBot, PerplexityBot and
 * OAI-SearchBot do not execute JavaScript. React clears #root on mount, so a
 * JS user never sees it, and it is real content during bundle download where
 * there used to be a black screen. scripts/generate-seo.mjs renders the
 * per-route variants of the same block into the build output.
 *
 * The CSP hash is written here too: the JSON-LD is an inline <script>, so
 * public/_headers and vercel.json must carry the sha256 of its exact text —
 * including any whitespace Prettier adds. Generating it removes a manual step
 * that silently breaks structured data when someone forgets.
 *
 * index.html is listed in .prettierignore for the same reason: the hash is
 * over bytes, so the file cannot be reformatted by an unrelated tool.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadSeo, ROOT } from './lib/load-seo.mjs';
import { renderJsonLd, renderJsonLdScript, renderStaticBlock } from './lib/seo-surfaces.mjs';

const INDEX_HTML = join(ROOT, 'index.html');
const CSP_FILES = [join(ROOT, 'public', '_headers'), join(ROOT, 'vercel.json')];

const JSONLD_BEGIN = '<!-- @gpc-seo-jsonld:begin -->';
const JSONLD_END = '<!-- @gpc-seo-jsonld:end -->';
const BLOCK_BEGIN = '<!-- @gpc-static-block:begin -->';
const BLOCK_END = '<!-- @gpc-static-block:end -->';

/** The text between a marker pair (markers excluded). */
function region(html, begin, end) {
  const i = html.indexOf(begin);
  const j = html.indexOf(end);
  if (i === -1 || j === -1) throw new Error(`marker pair not found in index.html: ${begin}`);
  if (j < i) throw new Error(`markers are out of order in index.html: ${begin}`);
  return html.slice(i + begin.length, j);
}

/** Replace the text between a marker pair, keeping one blank line of padding. */
function inject(html, begin, end, body) {
  const i = html.indexOf(begin);
  const j = html.indexOf(end);
  if (i === -1 || j === -1) throw new Error(`marker pair not found in index.html: ${begin}`);
  return `${html.slice(0, i + begin.length)}\n${body}\n    ${html.slice(j)}`;
}

/**
 * Compare HTML ignoring formatting. Prettier owns index.html's layout and will
 * move text across tag boundaries and reflow it, so a plain whitespace
 * collapse is not enough: this also strips whitespace that sits against an
 * angle bracket. Both sides of the comparison pass through it, so what is
 * being asserted is the *content*, not the indentation.
 */
const norm = (s) =>
  s
    .replace(/>\s+</g, '><')
    .replace(/>\s+/g, '>')
    .replace(/\s+</g, '<')
    // Prettier's htmlWhitespaceSensitivity inserts spaces *inside* inline
    // element delimiters ("<span >…</span >") when their text wraps. Strip
    // them so the comparison sees tags, not Prettier's whitespace policy.
    .replace(/\s+>/g, '>')
    .replace(/<\/\s+/g, '</')
    .replace(/\s+/g, ' ')
    .trim();

/** sha256 of a script element's text content, as the CSP spec defines it. */
function cspHashOf(scriptHtml) {
  const match = scriptHtml.match(/<script[^>]*>([\s\S]*)<\/script>/);
  if (!match) throw new Error('no <script> element to hash');
  return `'sha256-${createHash('sha256').update(match[1], 'utf8').digest('base64')}'`;
}

const CSP_TOKEN = /'sha256-[A-Za-z0-9+/=]+'/;

function syncCspHash(hash, check) {
  const problems = [];
  for (const file of CSP_FILES) {
    const text = readFileSync(file, 'utf8');
    if (!CSP_TOKEN.test(text)) {
      problems.push(`${file.replace(`${ROOT}/`, '')} carries no sha256 CSP token to update`);
      continue;
    }
    const next = text.replace(CSP_TOKEN, hash);
    if (check) {
      if (next !== text) {
        problems.push(`${file.replace(`${ROOT}/`, '')} has a stale JSON-LD CSP hash (expected ${hash})`);
      }
      continue;
    }
    if (next !== text) writeFileSync(file, next);
  }
  return problems;
}

const seo = await loadSeo();
const jsonLdScript = renderJsonLdScript(seo);
const block = renderStaticBlock(seo);
const mode = process.argv[2];

if (mode === '--stdout') {
  console.log(jsonLdScript);
  console.log('\n\n');
  console.log(block);
  process.exit(0);
}

const html = readFileSync(INDEX_HTML, 'utf8');

if (mode === '--check') {
  const problems = [];
  let liveHash = null;

  const liveJsonLd = region(html, JSONLD_BEGIN, JSONLD_END);
  try {
    const live = JSON.parse(liveJsonLd.match(/<script[^>]*>([\s\S]*)<\/script>/)[1]);
    const expected = JSON.parse(jsonLdScript.match(/<script[^>]*>([\s\S]*)<\/script>/)[1]);
    if (JSON.stringify(live) !== JSON.stringify(expected)) {
      problems.push('the JSON-LD graph in index.html is stale');
    }
    liveHash = cspHashOf(liveJsonLd);
  } catch (error) {
    problems.push(`the JSON-LD in index.html is unreadable (${error.message})`);
  }

  if (norm(region(html, BLOCK_BEGIN, BLOCK_END)) !== norm(block)) {
    problems.push('the static crawlable block in index.html is stale');
  }

  if (liveHash) problems.push(...syncCspHash(liveHash, true));

  if (problems.length) {
    console.error('✗ index.html is out of date with src/config/seo.ts:');
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error('  Run: npm run seo:render');
    process.exit(1);
  }
  console.log('✓ index.html and the JSON-LD CSP hash match src/config/seo.ts');
  process.exit(0);
}

const nextHtml = inject(inject(html, JSONLD_BEGIN, JSONLD_END, jsonLdScript), BLOCK_BEGIN, BLOCK_END, block);
writeFileSync(INDEX_HTML, nextHtml);

const hash = cspHashOf(jsonLdScript);
const cspProblems = syncCspHash(hash, false);
if (cspProblems.length) {
  for (const problem of cspProblems) console.error(`  - ${problem}`);
  process.exitCode = 1;
}

console.log('✓ index.html regenerated from src/config/seo.ts');
console.log(`  JSON-LD: ${renderJsonLd(seo)['@graph'].length} nodes, ${seo.FAQ.length} FAQ entries`);
console.log(`  CSP: script-src ${hash}`);
console.log(`  Static block: ${norm(block).length} characters, ${seo.SECTION_INDEX.length} section links`);
