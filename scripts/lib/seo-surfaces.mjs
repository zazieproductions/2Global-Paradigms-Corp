/**
 * Surface templates.
 *
 * The crawlable block, structured data, robots.txt, sitemap.xml and llms.txt
 * are all rendered from `src/config/seo.ts` and the route manifest so they
 * cannot drift from the metadata used by the app.
 */

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const indent = (html, spaces) =>
  html
    .split('\n')
    .map((line) => (line.trim() ? ' '.repeat(spaces) + line : line))
    .join('\n');

const FULL_RECORD_ROUTES = new Set(['/']);

const pageFor = (seo, path) => {
  const page = seo.SEO_PAGES.find((candidate) => candidate.path === path);
  if (!page) throw new Error(`[seo] no route manifest entry for ${path}`);
  return page;
};

const homePage = (seo) => pageFor(seo, '/');

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

export function renderJsonLd(seo, page = homePage(seo)) {
  const origin = seo.CANONICAL_ORIGIN;
  const url = seo.absoluteUrl(page.path);
  const image = seo.absoluteUrl(seo.SEO_SOCIAL.image);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${origin}/#website`,
        url: seo.absoluteUrl('/'),
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
        description: 'Independent studio publishing interactive digital archives.'
      },
      {
        '@type': 'CreativeWork',
        '@id': `${origin}/#archive`,
        name: seo.WORK_TITLE,
        alternateName: ['The Seven Seals', seo.ERA_TWO.os],
        genre: ['Recovered archive', 'Investigative puzzle', 'Epistolary records'],
        creator: { '@id': `${origin}/#publisher` },
        publisher: { '@id': `${origin}/#publisher` },
        datePublished: String(seo.ERA_TWO.reopenedYear),
        inLanguage: 'en',
        isAccessibleForFree: true,
        abstract: seo.WORK_ABSTRACT,
        about: [
          { '@type': 'Thing', name: 'Strategic forecasting' },
          { '@type': 'Thing', name: 'Records management' },
          { '@type': 'Thing', name: 'Cryptography' }
        ]
      },
      {
        '@type': 'WebPage',
        '@id': page.path === '/' ? `${origin}/#webpage` : `${origin}${page.path}#webpage`,
        url,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': `${origin}/#website` },
        about: { '@id': `${origin}/#archive` },
        primaryImageOfPage: { '@type': 'ImageObject', url: image },
        inLanguage: 'en',
        dateModified: seo.SEO_SITE.lastModified
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

export function renderJsonLdScript(seo, page = homePage(seo)) {
  return `<script type="application/ld+json" id="gpc-jsonld">\n${JSON.stringify(
    renderJsonLd(seo, page),
    null,
    2
  )}\n</script>`;
}

// ---------------------------------------------------------------------------
// Crawlable archive block
// ---------------------------------------------------------------------------

function renderLede(seo) {
  const lines = ['    <div class="lede">'];
  for (const paragraph of seo.ANSWER_FIRST) lines.push(`      <p>${escapeHtml(paragraph)}</p>`);
  lines.push('    </div>');
  return lines;
}

function renderFactTable(seo) {
  const lines = [
    '    <h2>The archive, in rows</h2>',
    '    <table>',
    '      <caption>Current archive index</caption>',
    '      <tbody>'
  ];
  for (const row of seo.FACT_TABLE) {
    lines.push('        <tr>');
    lines.push(`          <th scope="row">${escapeHtml(row.field)}</th>`);
    lines.push(`          <td>${escapeHtml(row.value)}</td>`);
    lines.push('        </tr>');
  }
  lines.push('      </tbody>', '    </table>');
  return lines;
}

function renderFaq(seo) {
  const lines = ['', '    <h2>Operator reference</h2>'];
  for (const entry of seo.FAQ) {
    lines.push(`    <h3>${escapeHtml(entry.q)}</h3>`);
    lines.push(`    <p>${escapeHtml(entry.a)}</p>`);
  }
  return lines;
}

function renderSectionIndex(seo, currentPath) {
  const lines = ['', '    <h2>Archive sections</h2>', '    <ul class="index">'];
  for (const item of seo.SECTION_INDEX) {
    const current = item.path === currentPath ? ' aria-current="page"' : '';
    lines.push(`      <li><a href="${escapeHtml(item.path)}"${current}>${escapeHtml(item.label)}</a></li>`);
  }
  lines.push('    </ul>');
  return lines;
}

/** Render a crawlable, route-specific summary with the common archive index. */
export function renderStaticBlock(seo, page = homePage(seo)) {
  const full = FULL_RECORD_ROUTES.has(page.path);
  const lines = [
    '<div class="gpc-static">',
    '  <div class="wrap">',
    '    <noscript>',
    '      <p class="noscript-note">',
    '        PARADIGM-OS // BOOT HALTED — the archive terminal requires JavaScript. The record index remains readable below.',
    '      </p>',
    '    </noscript>',
    ''
  ];

  if (full) {
    lines.push(
      `    <p class="kicker">${escapeHtml(seo.SITE.osVersion)} &nbsp;//&nbsp; ${escapeHtml(seo.SITE.tagline)}</p>`,
      '',
      `    <h1>${escapeHtml(seo.SEO_H1)}</h1>`,
      `    <p class="kicker">${escapeHtml(seo.SEO_SUBTITLE)}</p>`,
      '',
      ...renderLede(seo),
      '',
      ...renderFactTable(seo),
      ...renderFaq(seo)
    );
  } else {
    lines.push(
      '    <p class="kicker">GPC // RECOVERED RECORD INDEX</p>',
      '',
      `    <h1>${escapeHtml(page.heading)}</h1>`,
      `    <p class="lede">${escapeHtml(page.description)}</p>`,
      '',
      '    <p>Records remain indexed across the archive sections below. Restricted material requires the appropriate clearance.</p>'
    );
  }

  lines.push(...renderSectionIndex(seo, page.path), '  </div>', '</div>');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Discovery files
// ---------------------------------------------------------------------------

export function renderRobots(seo) {
  const lines = ['User-agent: *', 'Allow: /', ''];

  for (const line of seo.ROBOTS_NOTE) lines.push(line ? `# ${line}` : '#');
  lines.push('');

  for (const group of seo.AI_CRAWLERS) {
    lines.push(`# --- ${group.vendor} ${'-'.repeat(Math.max(0, 68 - group.vendor.length))}`);
    for (const agent of group.agents) {
      lines.push(`User-agent: ${agent}`, 'Allow: /', '');
    }
  }

  lines.push(`Sitemap: ${seo.absoluteUrl('/sitemap.xml')}`);
  return `${lines.join('\n')}\n`;
}

export function renderSitemap(seo) {
  const urls = seo.SEO_PAGES.map(
    (page) => `  <url>
    <loc>${seo.absoluteUrl(page.path)}</loc>
    <lastmod>${seo.SEO_SITE.lastModified}</lastmod>
  </url>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/** A compact text index of archive sections and operator notes. */
export function renderLlms(seo) {
  const lines = [];
  const push = (line = '') => lines.push(line);

  push('# Global Paradigms Corp.');
  push();
  push(`> ${seo.ANSWER_FIRST[0]}`);
  push();
  for (const paragraph of seo.ANSWER_FIRST.slice(1)) {
    push(paragraph);
    push();
  }

  push('## Archive index');
  push();
  push('| Field | Value |');
  push('| --- | --- |');
  for (const row of seo.FACT_TABLE) push(`| ${row.field} | ${row.value} |`);
  push();
  push('## Archive sections');
  push();
  for (const page of seo.SEO_PAGES) {
    push(`- [${page.heading}](${seo.absoluteUrl(page.path)}): ${page.description}`);
  }
  push();
  push('## Operator notes');
  push();
  push('1. Case-file answer keys are not included in this index.');
  push('2. Progress is stored in this browser only; no account is required.');
  push();
  push(`- [Sitemap](${seo.absoluteUrl('/sitemap.xml')}): all ${seo.SEO_PAGES.length} archive sections.`);
  push(`- [robots.txt](${seo.absoluteUrl('/robots.txt')}): crawler access rules.`);
  push();

  return lines.join('\n');
}

export { escapeHtml, indent, pageFor, homePage };
