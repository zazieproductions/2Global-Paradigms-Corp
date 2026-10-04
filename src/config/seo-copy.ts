/**
 * Canonical public metadata and crawlable copy.
 *
 * This module is deliberately import-free so the Node test project and the
 * static SEO generators can consume it without pulling in the React app.
 */

/** The title used in structured data and archive metadata. */
export const WORK_TITLE = 'Global Paradigms Corp. // Recovered Archive';

/** A concise archive summary for machine-readable page metadata. */
export const WORK_ABSTRACT =
  'A recovered records archive for Global Paradigms Corp., tracing a strategic-forecasting firm from 1971 through 2026. The index contains classified reports, station telemetry, redacted correspondence, restoration logs and seven sealed case files. Clearance is earned through the archive investigation.';

/** The domain this build is deployed to. No trailing slash. */
export const CANONICAL_ORIGIN = 'https://globalparadigmscorp.com';

/** Absolute URL for a route path (`/legacy` → `https://…/legacy`). */
export const absoluteUrl = (path = '/'): string =>
  `${CANONICAL_ORIGIN}${path === '/' ? '/' : path.replace(/\/+$/, '')}`;

/**
 * Generative-engine crawlers welcomed by name in robots.txt. Every group has
 * its own Allow rule because crawler groups are matched independently.
 */
export const AI_CRAWLERS: ReadonlyArray<{ vendor: string; agents: readonly string[] }> = [
  { vendor: 'OpenAI', agents: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'] },
  { vendor: 'Anthropic', agents: ['ClaudeBot', 'Claude-Web', 'Claude-SearchBot', 'anthropic-ai'] },
  { vendor: 'Perplexity', agents: ['PerplexityBot', 'Perplexity-User'] },
  { vendor: 'Google', agents: ['Google-Extended'] },
  { vendor: 'Apple', agents: ['Applebot-Extended'] },
  {
    vendor: 'Others',
    agents: [
      'Amazonbot',
      'Meta-ExternalAgent',
      'cohere-ai',
      'DuckAssistBot',
      'MistralAI-User',
      'Bytespider',
      'CCBot'
    ]
  }
];

/** Notes included as plain crawler-policy comments in robots.txt. */
export const ROBOTS_NOTE = [
  'Archive records are indexed for public reading; clearance is reflected in the local interface.',
  'Operator progress remains in this browser. No account is required.'
];

/** Recovered archive facts used by metadata and integrity tests. */
export const ERA_TWO = {
  publisher: 'Zazie Productions',
  os: 'PARADIGM-OS v8.4.2',
  reopenedYear: '2026',
  inWorldFounded: '1971',
  inWorldSpan: '1971 – 2026',
  records: 412,
  recordKinds: 17,
  corpusCharacters: 245000,
  seals: 7,
  clearanceTiers: 5,
  runtime: 'No account is required. Progress is stored in this browser.'
} as const;

/** The homepage title used in the browser, social cards and search results. */
export const SEO_TITLE = 'Global Paradigms Corp. // Recovered Archive';

/** A compact description that keeps the archive's contents in the foreground. */
export const SEO_DESCRIPTION =
  'Access the recovered records of Global Paradigms Corp. Search sealed dossiers, station telemetry, redacted correspondence and restoration logs from 1971–2026.';

/** The homepage heading shown to crawlers that do not execute JavaScript. */
export const SEO_H1 = 'Global Paradigms Corp. — Recovered Archive';

/** The line beneath the homepage heading. */
export const SEO_SUBTITLE = 'PARADIGM-OS v8.4.2 // ARCHIVE ACCESS OPEN // 1971–2026';

/** Social-card metadata. */
export const SEO_SOCIAL = {
  /** 1200×630, served from public/assets/images. */
  image: '/assets/images/og-card.jpg',
  imageAlt:
    'A dark archive terminal and the Global Paradigms Corp. insignia; record recovery remains in progress.',
  siteName: 'Global Paradigms Corp.'
} as const;

/**
 * The opening copy shared by the crawlable homepage and llms.txt. It describes
 * the archive without disclosing what the case files contain.
 */
export const ANSWER_FIRST = [
  'PARADIGM-OS v8.4.2 // GLOBAL PARADIGMS CORP. ARCHIVE ACCESS OPEN.',
  'This index holds recovered records from a strategic-forecasting firm founded in 1971. Reports, station telemetry, redacted correspondence and restoration notes span 1971–2026.',
  'Some files remain sealed, damaged or incomplete. Clearance is earned through the Seven Seals case file; operator progress is stored in this browser.'
] as const;

/** Visible help copy mirrored into the FAQPage structured data. */
export const FAQ: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: 'How do I begin?',
    a: 'Let PARADIGM-OS finish booting, then open the Gateway Transmission for a guided first pass. The Seven Seals case file contains the main sequence.'
  },
  {
    q: 'How is archive clearance earned?',
    a: 'Clearance advances through the Seven Seals. Records above your current level remain sealed until the corresponding work is complete.'
  },
  {
    q: 'How do I search the records?',
    a: 'Use the archive search control or press /. Search covers indexed records, personnel, stations and programmes.'
  },
  {
    q: 'Why are some records incomplete?',
    a: 'The restoration ledger tracks recovered, reindexed and missing material. Some source files and cross-references have not been recovered.'
  },
  {
    q: 'Where is my operator progress stored?',
    a: 'Progress is stored in this browser only. No account is required, and information entered in local forms is not transmitted or retained.'
  }
];

/** Compact archive facts for the crawlable homepage and llms.txt. */
export const FACT_TABLE: ReadonlyArray<{ field: string; value: string }> = [
  { field: 'Repository', value: 'GPC_POSTOJNA_MASTER' },
  { field: 'Operating system', value: ERA_TWO.os },
  { field: 'Record range', value: ERA_TWO.inWorldSpan },
  {
    field: 'Indexed material',
    value: `${ERA_TWO.records} records · ${ERA_TWO.recordKinds} kinds · ~${ERA_TWO.corpusCharacters.toLocaleString('en-US')} characters`
  },
  { field: 'Clearance', value: `${ERA_TWO.clearanceTiers} levels · ${ERA_TWO.seals} sealed case files` },
  { field: 'Archive state', value: 'PARTIAL RESTORATION' },
  { field: 'Operator progress', value: ERA_TWO.runtime }
];
