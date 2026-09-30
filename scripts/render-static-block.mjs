#!/usr/bin/env node
/**
 * render-static-block — regenerates the machine-facing half of index.html.
 *
 *   node scripts/render-static-block.mjs            inject into index.html
 *   node scripts/render-static-block.mjs --check    exit 1 if index.html is stale
 *   node scripts/render-static-block.mjs --stdout   print the regions, touch nothing
 *
 * WHY THIS EXISTS
 * The site's SEO/GEO copy lives in src/config/seo.ts. Two surfaces cannot
 * import that module: index.html (Vite serves it as-is) and the crawlers that
 * read it. Before this script they were hand-copied, which meant every edit
 * to the copy silently desynchronised the crawlable layer — the exact failure
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
 * OAI-SearchBot do not execute JavaScript. React clears #root on mount, so
 * a JS user never sees it. Run it after any edit to src/config/seo.ts, or
 * rely on src/tests/seo.test.ts to fail the build until you do.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INDEX_HTML = join(ROOT, 'index.html');
const BUNDLE = join(ROOT, 'node_modules', '.tmp', 'gpc-seo-bundle.mjs');

const JSONLD_BEGIN = '<!-- @gpc-seo-jsonld:begin -->';
const JSONLD_END = '<!-- @gpc-seo-jsonld:end -->';
const BLOCK_BEGIN = '<!-- @gpc-static-block:begin -->';
const BLOCK_END = '<!-- @gpc-static-block:end -->';

// ---------------------------------------------------------------------------
// Load the source of truth. seo.ts is TypeScript that pulls in the navigation
// (for SECTION_INDEX), so it is bundled with esbuild — already a dependency of
// Vite — and imported from the emitted ESM file. React and lucide-react stay
// external and resolve normally from node_modules.
// ---------------------------------------------------------------------------
mkdirSync(dirname(BUNDLE), { recursive: true });
buildSync({
  entryPoints: [join(ROOT, 'src', 'config', 'seo.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
  alias: { '@': join(ROOT, 'src') },
  outfile: BUNDLE,
  logLevel: 'silent'
});
const seo = await import(BUNDLE);

// ---------------------------------------------------------------------------
// HTML escaping. The copy is plain prose; escaping keeps it that way even if
// a future edit introduces an ampersand or an angle bracket.
// ---------------------------------------------------------------------------
const esc = (text) =>
  String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const indent = (html, spaces) =>
  html
    .split('\n')
    .map((line) => (line.trim() ? ' '.repeat(spaces) + line : line))
    .join('\n');

// ---------------------------------------------------------------------------
// JSON-LD. Accurate by construction: the publisher carries the Organization
// node; the fictional company is a CreativeWork with an explicit
// disambiguatingDescription, and is never marked up as a real organisation.
// ---------------------------------------------------------------------------
function jsonLdGraph() {
  const origin = seo.CANONICAL_ORIGIN;
  const home = seo.absoluteUrl('/');
  const image = seo.absoluteUrl(seo.SEO_SOCIAL.image);
  const lostpedia = seo.LEGACY_PAGE.sources[0];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: home,
        name: seo.SITE.name,
        alternateName: ['GPC', 'Global Paradigms Corporation', 'globalparadigmscorp.com', 'PARADIGM-OS'],
        description: seo.SEO_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': `${origin}/#publisher` }
      },
      {
        '@type': 'Organization',
        '@id': `${origin}/#publisher`,
        name: seo.ERA_TWO.publisher,
        url: 'https://github.com/zazieproductions',
        description: 'Independent studio publishing original interactive fiction on the web.'
      },
      {
        '@type': 'CreativeWork',
        '@id': `${origin}/#work`,
        name: seo.WORK_TITLE,
        alternateName: ['The Seven Seals', seo.ERA_TWO.os],
        genre: ['Interactive fiction', 'Alternate reality game', 'Epistolary archive', 'Puzzle game'],
        creator: { '@id': `${origin}/#publisher` },
        publisher: { '@id': `${origin}/#publisher` },
        datePublished: String(seo.ERA_TWO.reopenedYear),
        inLanguage: 'en',
        isAccessibleForFree: true,
        abstract: seo.WORK_ABSTRACT,
        disambiguatingDescription:
          'Not a real corporation. The 2026 work at this URL is original interactive fiction by ' +
          `${seo.ERA_TWO.publisher}. It is unrelated to the unauthorized fan hoax page that occupied the ` +
          'same domain during the 2006 Lost alternate reality game, and is not affiliated with that ' +
          'television franchise, its network, or its rights holders.',
        about: [
          { '@type': 'Thing', name: 'Alternate reality game' },
          { '@type': 'Thing', name: 'Interactive fiction' },
          { '@type': 'Thing', name: 'Cryptography puzzle' }
        ],
        subjectOf: [
          {
            '@type': 'WebPage',
            url: lostpedia.url,
            name: `${lostpedia.title} — ${lostpedia.publisher}`,
            description: lostpedia.note
          }
        ]
      },
      {
        '@type': 'WebPage',
        '@id': `${origin}/#webpage`,
        url: home,
        name: seo.SEO_TITLE,
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}/#work` },
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
        inLanguage: 'en',
        datePublished: '2026-01-01',
        dateModified: new Date().toISOString().slice(0, 10)
      },
      {
        '@type': 'FAQPage',
        '@id': `${origin}/#faq`,
        mainEntity: seo.FAQ.map((entry) => ({
          '@type': 'Question',
          name: entry.q,
          acceptedAnswer: { '@type': 'Answer', text: entry.a }
        }))
      }
    ]
  };
}

// ---------------------------------------------------------------------------
// The crawlable body block.
// ---------------------------------------------------------------------------
function staticBlock() {
  const L = [];
  const push = (line) => L.push(line);

  push('<div class="gpc-static">');
  push('  <div class="wrap">');
  push('    <noscript>');
  push('      <p class="noscript-note">');
  push('        PARADIGM-OS // BOOT HALTED — the interactive terminal requires JavaScript. The full text of');
  push('        this archive&rsquo;s record is readable below without it.');
  push('      </p>');
  push('    </noscript>');
  push('');
  push(`    <p class="kicker">${esc(seo.SITE.osVersion)} &nbsp;//&nbsp; ${esc(seo.SITE.tagline)}</p>`);
  push('');
  push(`    <h1>${esc(seo.SEO_H1)}</h1>`);
  push(`    <p class="kicker">${esc(seo.SEO_SUBTITLE)}</p>`);
  push('');
  push('    <div class="lede">');
  for (const paragraph of seo.ANSWER_FIRST) push(`      <p>${esc(paragraph)}</p>`);
  push('    </div>');

  push('');
  push('    <h2>The record, in rows</h2>');
  push('    <table>');
  push('      <caption>');
  push('        Key facts about globalparadigmscorp.com');
  push('      </caption>');
  push('      <tbody>');
  for (const row of seo.FACT_TABLE) {
    push('        <tr>');
    push(`          <th scope="row">${esc(row.field)}</th>`);
    push(`          <td>${esc(row.value)}</td>`);
    push('        </tr>');
  }
  push('      </tbody>');
  push('    </table>');

  for (const section of seo.LEGACY_PAGE.sections) {
    push('');
    push(`    <h2 id="static-${esc(section.id)}">${esc(section.heading)}</h2>`);
    for (const paragraph of section.paragraphs ?? []) push(`    <p>${esc(paragraph)}</p>`);

    for (const quote of section.quotes ?? []) {
      // NB: a classed <span>, not <cite> — Prettier rewrites <cite> as
      // "<cite >" when it formats index.html, which would defeat --check.
      push('    <blockquote>');
      push(`      <p>${esc(quote.text)}</p>`);
      push(`      <span class="src">${esc(quote.label)} — ${esc(quote.source)}</span>`);
      push('    </blockquote>');
    }

    for (const item of section.list ?? []) push(`    <p class="hook">▸ ${esc(item)}</p>`);

    if (section.staffTable) {
      push('    <table>');
      push('      <caption>');
      push('        Clients and invented staff listed on the 2006 hoax page');
      push('      </caption>');
      push('      <tbody>');
      push('        <tr>');
      push('          <th scope="row">Clients</th>');
      push(`          <td>${esc(seo.ERA_ONE.clients.join(' · '))}</td>`);
      push('        </tr>');
      for (const person of seo.ERA_ONE.staff) {
        push('        <tr>');
        push(`          <th scope="row">${esc(person.name)}</th>`);
        push(`          <td>${esc(person.role)}</td>`);
        push('        </tr>');
      }
      push('      </tbody>');
      push('    </table>');
    }

    if (section.callout) push(`    <p class="callout">${esc(section.callout)}</p>`);
  }

  push('');
  push('    <h2>Questions the archive is asked</h2>');
  for (const entry of seo.LEGACY_PAGE.faq) {
    push(`    <h3>${esc(entry.q)}</h3>`);
    push(`    <p>${esc(entry.a)}</p>`);
  }

  push('');
  push('    <h2>Sections of the archive</h2>');
  push('    <ul class="index">');
  for (const item of seo.SECTION_INDEX) {
    push(`      <li><a href="${esc(item.path)}">${esc(item.label)}</a></li>`);
  }
  push('    </ul>');

  push('');
  push(`    <p class="notice" role="note">${esc(noticeLine())}</p>`);
  push('  </div>');
  push('</div>');

  return L.join('\n');
}

/** The closing out-of-world notice, verbatim from src/config/site.ts. */
function noticeLine() {
  return `FICTION // ${seo.FICTION_NOTICE.long}`;
}

// ---------------------------------------------------------------------------
// Marker surgery
// ---------------------------------------------------------------------------
function region(html, begin, end) {
  const i = html.indexOf(begin);
  const j = html.indexOf(end);
  if (i === -1 || j === -1) throw new Error(`marker pair not found in index.html: ${begin}`);
  return html.slice(i + begin.length, j);
}

function inject(html, begin, end, body) {
  const i = html.indexOf(begin);
  const j = html.indexOf(end);
  if (i === -1 || j === -1) throw new Error(`marker pair not found in index.html: ${begin}`);
  return html.slice(0, i + begin.length) + '\n' + body + '\n    ' + html.slice(j);
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

/** Pull the JSON out of a `<script type="application/ld+json">` region. */
const parseLdJson = (regionText) => {
  const match = regionText.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!match) throw new Error('no ld+json script inside the JSON-LD markers');
  return JSON.parse(match[1]);
};

/** Deep equality that ignores one volatile field (the freshness date). */
const sameGraph = (a, b) => {
  const strip = (g) => {
    const page = g['@graph'].find((n) => n['@type'] === 'WebPage');
    if (page) delete page.dateModified;
    return g;
  };
  return JSON.stringify(strip(a)) === JSON.stringify(strip(b));
};

const jsonLdScript =
  '<script type="application/ld+json" id="gpc-jsonld">\n' +
  JSON.stringify(jsonLdGraph(), null, 2) +
  '\n</script>';

const block = staticBlock();

const mode = process.argv[2];

if (mode === '--stdout') {
  console.log(jsonLdScript);
  console.log('\n\n');
  console.log(block);
  process.exit(0);
}

let html = readFileSync(INDEX_HTML, 'utf8');

if (mode === '--check') {
  const problems = [];
  try {
    if (!sameGraph(parseLdJson(region(html, JSONLD_BEGIN, JSONLD_END)), jsonLdGraph()))
      problems.push('the JSON-LD graph in index.html is stale');
  } catch (error) {
    problems.push(`the JSON-LD in index.html is unreadable (${error.message})`);
  }
  if (norm(region(html, BLOCK_BEGIN, BLOCK_END)) !== norm(block))
    problems.push('the static crawlable block in index.html is stale');
  if (problems.length) {
    console.error('✗ index.html is out of date with src/config/seo.ts:');
    for (const p of problems) console.error(`  - ${p}`);
    console.error('  Run: node scripts/render-static-block.mjs');
    process.exit(1);
  }
  console.log('✓ index.html matches src/config/seo.ts');
  process.exit(0);
}

html = inject(html, JSONLD_BEGIN, JSONLD_END, jsonLdScript);
html = inject(html, BLOCK_BEGIN, BLOCK_END, block);
writeFileSync(INDEX_HTML, html);
console.log('✓ index.html regenerated from src/config/seo.ts');
console.log(`  JSON-LD graph: ${jsonLdGraph()['@graph'].length} nodes, ${seo.FAQ.length} FAQ entries`);
console.log(`  Static block: ${norm(block).length} characters, ${seo.SECTION_INDEX.length} section links`);
