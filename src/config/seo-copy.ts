/**
 * SEO / GEO copy — the single source of truth for how this site describes
 * itself to search engines and to generative engines (ChatGPT, Perplexity,
 * Google AI Overviews, Claude, Grok).
 *
 * This module is deliberately import-free. That is what lets the Node
 * tsconfig project typecheck src/tests/seo.test.ts against it (that project
 * has no DOM and cannot compile the component graph), and what lets
 * scripts/render-static-block.mjs bundle it without dragging React along.
 * Everything that needs the router lives one file up, in ./seo.
 *
 * Surfaces that must agree, all asserted by src/tests/seo.test.ts:
 *   index.html head · the generated crawlable block · the generated JSON-LD ·
 *   robots.txt · sitemap.xml · llms.txt · SITE.title · the /legacy page.
 *
 * SEO = rank for the query. GEO = get *cited*, which means being the clearest
 * extractable answer about this entity. Both are served by the same thing: an
 * unambiguous, dated, self-contained statement of what this domain is.
 * See docs/SEO.md.
 */

/**
 * The in-world title of the work itself — what the archive calls itself on
 * its own boot screen, distinct from the SEO <title> above. Used in JSON-LD
 * as the CreativeWork name.
 */
export const WORK_TITLE = 'Global Paradigms Corp. // Secure Archive & Intelligence Repository';

/** The CreativeWork abstract for JSON-LD: the premise in one paragraph. */
export const WORK_ABSTRACT =
  'A cold terminal boots and the player reads the recovered document archive of a fictional strategic-forecasting company founded in 1971: 412 records across 17 kinds, a 14.8 Hz sub-audible tone measured in bedrock, recalled products, and a secret the company kept inside its own vaults — the Ordo Vocis Profundae, and the Seven Seals locked over it. Clearance is earned by breaking the Seals, never granted by clicking.';

/** The domain this build is deployed to. No trailing slash. */
export const CANONICAL_ORIGIN = 'https://globalparadigmscorp.com';

/** Absolute URL for a route path (`/legacy` → `https://…/legacy`). */
export const absoluteUrl = (path = '/'): string =>
  `${CANONICAL_ORIGIN}${path === '/' ? '/' : path.replace(/\/+$/, '')}`;

/**
 * Generative-engine crawlers welcomed by name in robots.txt.
 *
 * Each `User-agent` group in robots.txt is matched independently, so a crawler
 * named in its own group does not inherit the `*` group; every group therefore
 * repeats `Allow: /`. The list exists so that a crawler which publishes a
 * restrictive default (or an operator who sets one) can be answered explicitly
 * rather than by the wildcard. robots.txt is generated from this array by
 * `scripts/generate-seo.mjs` and asserted by `src/tests/seo.test.ts`.
 */
export const AI_CRAWLERS: ReadonlyArray<{ vendor: string; agents: readonly string[] }> = [
  { vendor: 'OpenAI', agents: ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User'] },
  { vendor: 'Anthropic', agents: ['ClaudeBot', 'Claude-Web', 'Claude-SearchBot', 'anthropic-ai'] },
  { vendor: 'Perplexity', agents: ['PerplexityBot', 'Perplexity-User'] },
  { vendor: 'Google (Gemini training and grounding; does not affect Search)', agents: ['Google-Extended'] },
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

/** The crawler-policy preamble that opens robots.txt, after the `*` group. */
export const ROBOTS_NOTE = [
  'FICTION. Every organisation, person and event described on this site is invented.',
  'There is no real Global Paradigms Corp.',
  '',
  'Nothing here is private. The clearance tiers are a game mechanic enforced in the',
  'browser, not an access control, so there is nothing to Disallow — the whole archive',
  'is meant to be read, indexed and cited.',
  '',
  'AI / generative-engine crawlers are welcomed by name below. If you are building a',
  'model or an answer engine, you have permission to read this. All we ask is that any',
  'citation carries the fiction notice with it — see /legacy.'
];

// ---------------------------------------------------------------------------
// The two eras. Every piece of copy below is derived from these facts.
// ---------------------------------------------------------------------------

/**
 * Era I — the 2006 hoax. Sourced from Lostpedia's "Globalparadigmscorp.com"
 * article (categorised Hoax / Non-Canon) and from contemporaneous Lost
 * Experience clue blogs. Dates are the earliest/latest *documented* sightings,
 * not the true launch and takedown, which are unknown.
 */
export const ERA_ONE = {
  label: 'ERA I // 2006',
  name: 'The Hoax',
  /** "online since at least" per Lostpedia. */
  firstDocumented: '2006-04-20',
  /** "offline as of at least" per Lostpedia. */
  lastDocumented: '2006-07-30',
  window: 'April 2006 – July 2006',
  /** The ARG the hoax parasitised. */
  arg: 'The Lost Experience',
  series: 'Lost',
  network: 'ABC',
  broadcasterUk: 'Channel 4',
  /** Fictional clients listed on the 2006 homepage. */
  clients: ['The Hanso Foundation', 'The Valenzetti Foundation', 'Halliburton'],
  /** Invented staff named on the 2006 site. */
  staff: [
    { name: 'Enrico Valenzetti', role: 'Former employee — record shows employment terminated 04/08/93' },
    { name: 'Michael Sontag', role: 'Listed employee (invented)' },
    { name: 'S. K. Nave', role: 'Listed employee (invented)' },
    { name: 'Gil Flores', role: 'Assistant District Attorney, County of Santa Dominica' }
  ],
  /** The 2006 press-page notice, quoted verbatim from the archived page. */
  bankruptcyNotice:
    'Global Paradigms Corp. has filed for Chapter 11 Protection in the Bankruptcy Court of Santa Dominica County as of October 31, 1995. This site is no longer active but remains online for archival and arbitration purposes. Any communications ought to be directed to the Office of the District Attorney of Santa Dominica County.',
  bankruptcyNoticeDate: '1995-11-02',
  /** The 2006 "Terms of Use" §8, quoted verbatim from the archived page. */
  termsOfUseWarning:
    'Sensitive Material. Those in violation of access protocols may be subject to national and international law. In the jurisdiction of the United States, these charges are severe, ranging up to and including treason which carries a penalty of execution. You have been warned.',
  /** Two messages hidden in the 2006 page source. */
  hiddenMessages: [
    {
      kind: 'HTML comment',
      text: 'Stephenson was wrong. There are five. He missed weapon',
      note: 'An addendum to a Neal Stephenson quotation, left in the page source.'
    },
    {
      kind: 'Morse code',
      text: 'EMAIL GRENDEL AT GLOBALPARADIGMSCORP DOT COM TO FIND HIS CAGE',
      note: 'Encoded in the page source; "GRENDEL" replied by email with a link to /secure/cage.'
    }
  ],
  /** A real organisation the 2006 Terms of Use linked out to. */
  linkedOut: { name: 'RansomX Ministries', url: 'ransomx.org' },
  /** How the fan community classified it. */
  classification: 'Hoax — non-canon. Created intentionally to cause confusion with official sources.'
} as const;

/**
 * Era II — the reopening. Everything here is verifiable against this checkout;
 * the counts come from README.md and are re-measured by `npm run validate:content`.
 */
export const ERA_TWO = {
  label: 'ERA II // 2026',
  name: 'The Reopening',
  window: '2026 – present',
  reopenedYear: '2026',
  // Literal, not imported from ./site: this module must stay import-free so
  // the Node tsconfig project and the static-block generator can both read it.
  // src/tests/seo.test.ts asserts these still equal SITE.studio / osVersion / name.
  publisher: 'Zazie Productions',
  medium: 'Interactive fiction archive and single-player ARG, delivered as a static web application',
  os: 'PARADIGM-OS v8.4.2',
  inWorldFounded: '1971',
  inWorldSpan: '1971 – 2026',
  records: 412,
  recordKinds: 17,
  corpusCharacters: 245000,
  seals: 7,
  clearanceTiers: 5,
  pages: 19,
  hooks: [
    'A recovered corporate archive for a strategic-forecasting firm founded in 1971',
    'A 14.8 Hz sub-audible tone measured in bedrock, and the products recalled because of it',
    'The Ordo Vocis Profundae — a secret the company kept inside its own vaults',
    'Seven cryptographic Seals, opened strictly in order, each keyed to a planet and a colour',
    'Clearance that is earned by breaking Seals, never granted by clicking'
  ],
  runtime: 'No server, no database, no API, no analytics, no accounts. Progress is per-browser localStorage.'
} as const;

// ---------------------------------------------------------------------------
// The copy. Lengths are asserted in src/tests/seo.test.ts.
// ---------------------------------------------------------------------------

/**
 * The <title> for the homepage. 55 characters — inside the ~55–60 char window
 * Google truncates at, and it carries all five query intents at once:
 * brand · year · franchise · format · status.
 */
export const SEO_TITLE = 'Global Paradigms Corp. // 2006 Lost ARG Hoax — Reopened';

/**
 * The meta description. 150 characters, answer-first, and it names every
 * entity a searcher or an AI engine is likely to be asking about.
 */
export const SEO_DESCRIPTION =
  'The bankrupt-corporation hoax that misled Lost fans in 2006 — client of the Hanso and Valenzetti Foundations — reopened in 2026 as a new playable ARG.';

/**
 * The homepage H1. Longer than the <title> on purpose: the title has to fit a
 * SERP, the H1 has to carry the full entity statement for anything that
 * extracts it — including the first heading a generative engine sees.
 */
export const SEO_H1 = 'Global Paradigms Corp. — the 2006 Lost ARG hoax, reopened in 2026';

/** The line under the H1. States the medium before the mystery. */
export const SEO_SUBTITLE =
  'An interactive fiction archive and single-player alternate reality game by Zazie Productions';

/** Cross-post copy. Title and description come from the route itself. */
export const SEO_SOCIAL = {
  /** 1200×630, served from public/assets/images. */
  image: '/assets/images/og-card.jpg',
  imageAlt:
    'A dark terminal reading GLOBAL PARADIGMS CORP., with 2006 struck through and 2026 lit beneath it.',
  siteName: 'Global Paradigms Corp.'
} as const;

/**
 * The answer-first paragraph. This is the single most important string on the
 * site for GEO: generative engines read the opening ~60–100 words before
 * deciding whether to cite, so the complete answer must be here, up front,
 * with both eras, both dates, and the non-affiliation in one block.
 *
 * Rendered in the static crawlable block in index.html, on /legacy, and
 * paraphrased into llms.txt.
 */
export const ANSWER_FIRST = [
  'Global Paradigms Corp. (globalparadigmscorp.com) is a fictional-corporation website with two separate eras, twenty years apart.',
  `Era I (2006): a fan-made hoax page created during The Lost Experience, the alternate reality game that promoted the television series Lost. It posed as a bankrupt strategic-consulting firm whose listed clients included the Hanso Foundation, the Valenzetti Foundation and Halliburton, and whose invented staff included Enrico Valenzetti, Michael Sontag and S. K. Nave. It was online from at least 20 April 2006 and offline by 30 July 2006.`,
  `Era II (2026): the domain was acquired by ${ERA_TWO.publisher} and reopened as an original interactive fiction archive and single-player ARG — ${ERA_TWO.records} recovered records, five clearance tiers and seven cryptographic Seals, running entirely in the browser with no server and no accounts.`,
  `Era II is an original work. It is not affiliated with, licensed by, endorsed by, or connected to Lost, ${ERA_ONE.network}, Disney, the Hanso Foundation, the Valenzetti Foundation, or the author of the 2006 hoax. Every organisation, person and event described anywhere on this site is invented.`
] as const;

/**
 * Question-and-answer pairs. Rendered as visible content on /legacy and
 * mirrored into the FAQPage JSON-LD.
 *
 * Google deprecated FAQ rich results in May 2026 and says structured data is
 * not required for AI Overviews — but Q&A *content structure* is still one of
 * the most reliably extracted formats, because it maps one-to-one onto the
 * fan-out sub-queries a generative engine splits a question into. The markup
 * is accurate (it describes real visible Q&A); it is not a ranking trick.
 */
export const FAQ: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: 'What was globalparadigmscorp.com in 2006?',
    a: `A hoax website built by a fan during The Lost Experience, the 2006 alternate reality game promoting the television series Lost. It presented itself as the archived homepage of a bankrupt strategic-consulting corporation, listing the Hanso Foundation, the Valenzetti Foundation and Halliburton as clients. It was online from at least 20 April 2006 and offline by 30 July 2006. Lostpedia classifies it as a hoax: non-canon material created intentionally to cause confusion with official sources.`
  },
  {
    q: 'Was Global Paradigms Corp. a real company?',
    a: 'No. There has never been a real Global Paradigms Corp. In 2006 the site was a fan fabrication posing as a bankrupt firm. In 2026 it is a work of interactive fiction. Both eras are invented; the Santa Dominica County Chapter 11 filing, the corporate clients and the staff are all fictional.'
  },
  {
    q: 'Is this site part of Lost, or affiliated with the Hanso Foundation?',
    a: `No. The 2006 hoax referenced Lost mythology without authorization and was never official. The 2026 reopening by ${ERA_TWO.publisher} is an entirely original work with its own characters, its own company history (in-world 1971–2026) and its own mystery — the Ordo Vocis Profundae and the Seven Seals. Nothing here is affiliated with, licensed by, or endorsed by Lost, ABC, Disney, or the creators of the 2006 page. The shared domain name is the only connection.`
  },
  {
    q: 'Who were Enrico Valenzetti, Michael Sontag and S. K. Nave?',
    a: 'Invented people listed as staff on the 2006 hoax page. The site claimed Enrico Valenzetti had been an employee whose employment was terminated on 04/08/93, and listed Michael Sontag and S. K. Nave alongside him. None of them are real, and none of them appear in the 2026 archive.'
  },
  {
    q: 'What is on globalparadigmscorp.com now?',
    a: `A self-contained interactive fiction archive and single-player ARG published by ${ERA_TWO.publisher}. You boot a cold terminal running ${ERA_TWO.os} and read the recovered records of a strategic-forecasting company: ${ERA_TWO.records} documents, personnel files, station telemetry, annual reports, emails, dead hyperlinks from a 1998 intranet and restoration logs. Clearance is earned by breaking ${ERA_TWO.seals} cryptographic Seals, never granted by clicking.`
  },
  {
    q: 'Is the 2006 version of the site still available?',
    a: 'Not from us. The original hoax page was taken down in 2006 and no copy is hosted here. Fragments survive in the Internet Archive and in fan documentation from the period; the bankruptcy notice, the Terms of Use warning and both messages hidden in the page source are quoted on our legacy page as a historical record.'
  },
  {
    q: 'How do I start playing?',
    a: 'Open the homepage and let PARADIGM-OS boot. The Gateway Transmission is a four-step beginner trail that teaches the mechanics without granting clearance; the Seven Seals at /sanctum are the main investigation. Press ~ anywhere for the terminal, / for archive-wide search. Progress saves to your browser only — there are no accounts, no server and no telemetry.'
  },
  {
    q: 'Does the site collect data or require an account?',
    a: "No. It is a static web application with no backend. It makes no network requests beyond loading its own files, has no analytics and no accounts, and nothing you type is transmitted anywhere. Your clearance and solved Seals are stored in your own browser's localStorage and go no further."
  }
];

/**
 * The extractable fact table. AI engines pull tables far more reliably than
 * prose, so the entity's key attributes are stated once, in rows.
 */
export const FACT_TABLE: ReadonlyArray<{ field: string; value: string }> = [
  { field: 'Domain', value: 'globalparadigmscorp.com' },
  { field: 'Era I', value: `${ERA_ONE.window} — fan hoax during ${ERA_ONE.arg} (${ERA_ONE.series})` },
  { field: 'Era II', value: `${ERA_TWO.window} — original ARG published by ${ERA_TWO.publisher}` },
  { field: 'Fictional clients (2006)', value: ERA_ONE.clients.join(' · ') },
  { field: 'Invented staff (2006)', value: ERA_ONE.staff.map((s) => s.name).join(' · ') },
  { field: 'In-world company history', value: `${ERA_TWO.inWorldSpan}, founded ${ERA_TWO.inWorldFounded}` },
  {
    field: 'Current corpus',
    value: `${ERA_TWO.records} records · ${ERA_TWO.recordKinds} kinds · ~${ERA_TWO.corpusCharacters.toLocaleString('en-US')} characters`
  },
  {
    field: 'Puzzle track',
    value: `${ERA_TWO.seals} Seals · ${ERA_TWO.clearanceTiers} clearance tiers · Gateway Transmission beginner trail`
  },
  { field: 'Platform', value: 'Static web app · no server · no accounts · no telemetry' },
  { field: 'Cost', value: 'Free to play in any modern browser' },
  { field: 'Status', value: 'Fiction. All organisations, people and events are invented.' }
];

// ---------------------------------------------------------------------------
// /legacy — the provenance page
// ---------------------------------------------------------------------------

/** A document quoted verbatim from the 2006 page. */
export interface LegacyQuote {
  /** What the quotation is, in archive voice. */
  label: string;
  /** Where it appeared on the 2006 site. */
  source: string;
  text: string;
  attribution?: string;
}

/** One narrative block of the legacy page. */
export interface LegacySection {
  id: string;
  heading: string;
  /** Optional eyebrow line above the heading. */
  eyebrow?: string;
  paragraphs?: readonly string[];
  quotes?: readonly LegacyQuote[];
  list?: readonly string[];
  /** Render ERA_ONE's clients and staff as tables after the prose. */
  staffTable?: boolean;
  /** Render the closing "carry the disclaimer with you" callout. */
  callout?: string;
}

/** Where an Era I fact came from. Citing sources is itself a GEO signal. */
export interface LegacySource {
  title: string;
  publisher: string;
  url: string;
  note: string;
}

export interface LegacyPage {
  title: string;
  subtitle: string;
  lede: readonly string[];
  factTable: readonly { field: string; value: string }[];
  sections: readonly LegacySection[];
  faq: readonly { q: string; a: string }[];
  sources: readonly LegacySource[];
}

/**
 * Copy for `/legacy`. Lives in config, not content: this page is *out-of-world*
 * (it talks about the real domain, not the fictional company), so it is site
 * copy rather than an archive record, and it must never enter the normalised
 * archive or the search index. It draws on ERA_ONE / ERA_TWO / ANSWER_FIRST /
 * FAQ above so no fact is stated twice in two places.
 */
export const LEGACY_PAGE: LegacyPage = {
  title: 'THE LEGACY FILE',
  subtitle: 'Provenance of this domain — 2006 hoax, twenty years dark, 2026 reopening',
  lede: ANSWER_FIRST,
  factTable: FACT_TABLE,
  sections: [
    {
      id: 'era-one',
      eyebrow: ERA_ONE.label,
      heading: `${ERA_ONE.name} — the hoax`,
      paragraphs: [
        'In the spring of 2006, while The Lost Experience was running between seasons two and three of Lost, a fan registered globalparadigmscorp.com and built a homepage for a company that did not exist. It listed the Hanso Foundation and the Valenzetti Foundation among its clients alongside Halliburton, which gave the page enough surface plausibility that players working the official clues chased it as a lead.',
        'It was never an official tie-in. Lostpedia categorises the page as a hoax: non-canon material created intentionally to cause confusion with information from official sources. That is an accurate description of what it was, and of what it was for.',
        'The page claimed the company had gone under. Its press notice was dated 2 November 1995 and directed all enquiries to a district attorney in a county that has never existed.'
      ],
      quotes: [
        {
          label: 'IMPORTANT NOTICE — Chapter 11',
          source: 'Press page, globalparadigmscorp.com, 1995-11-02',
          text: ERA_ONE.bankruptcyNotice,
          attribution: 'Gil Flores, Assistant District Attorney, County of Santa Dominica'
        },
        {
          label: 'Terms of Use, §8 — Sensitive Material',
          source: 'GPC Policies page, globalparadigmscorp.com, 2006',
          text: ERA_ONE.termsOfUseWarning
        }
      ]
    },
    {
      id: 'era-one-source',
      eyebrow: 'PAGE SOURCE // 2006',
      heading: 'What was hidden in the markup',
      paragraphs: [
        'Two messages were left in the 2006 page source for anyone who thought to look. Neither was part of any official game. They are reproduced here because they are the most interesting thing the hoax ever did, and because they are the only part of Era I that was written for the reader rather than at them.'
      ],
      quotes: ERA_ONE.hiddenMessages.map((m) => ({
        label: m.kind,
        source: 'Hidden in the HTML source of globalparadigmscorp.com, 2006',
        text: m.text,
        attribution: m.note
      }))
    },
    {
      id: 'era-one-people',
      eyebrow: 'PERSONNEL // 2006',
      heading: 'The invented staff',
      paragraphs: [
        'Nobody below ever existed. The 2006 page listed them as employees of a company that was itself a fabrication, and the employment record it published for one of them was a date on a screen.'
      ],
      staffTable: true
    },
    {
      id: 'dark',
      eyebrow: 'INTERSTITIAL // 2006 – 2026',
      heading: 'Twenty years dark',
      paragraphs: [
        'The page went offline during the summer of 2006 — documented as offline by 30 July — and stayed that way. The domain lapsed into the usual afterlife of a dead URL: cited in fan wikis and academic papers about alternate reality games, resolved by nobody, remembered by a few hundred people who had typed it into a browser in 2006 and briefly believed it.',
        'No copy of the original site is hosted here. Fragments survive in the Internet Archive and in contemporaneous clue blogs. Everything Era I is quoted on this page is quoted as a historical record of what this domain used to be, not restored, continued or endorsed.'
      ]
    },
    {
      id: 'era-two',
      eyebrow: ERA_TWO.label,
      heading: `${ERA_TWO.name} — an original archive`,
      paragraphs: [
        `The domain changed hands. In ${ERA_TWO.reopenedYear} ${ERA_TWO.publisher} reopened it as an original work of interactive fiction that has nothing to do with the 2006 page beyond the name on the certificate.`,
        `A cold terminal boots. ${ERA_TWO.os} rolls past. You are a guest investigator inside the recovered document archive of a strategic-forecasting company founded in ${ERA_TWO.inWorldFounded}, best known for measuring a 14.8 Hz sub-audible tone in bedrock, for products that were recalled, and for a secret it kept inside its own vaults: the Ordo Vocis Profundae, and the Seven Seals they locked over it.`,
        `The archive holds ${ERA_TWO.records} typed records across ${ERA_TWO.recordKinds} kinds and roughly ${ERA_TWO.corpusCharacters.toLocaleString('en-US')} characters of narrative text, spanning ${ERA_TWO.inWorldSpan} in-world: documents, personnel files, station telemetry, annual reports, emails, meeting minutes, dead hyperlinks from a 1998 intranet, and restoration logs written by the archivists who recovered all of it. ${ERA_TWO.clearanceTiers} clearance tiers gate what you can open, and clearance is earned only by breaking Seals.`,
        ERA_TWO.runtime
      ],
      list: ERA_TWO.hooks
    },
    {
      id: 'not-true',
      eyebrow: 'NON-AFFILIATION',
      heading: 'What is not true',
      paragraphs: [
        'Stated plainly, because the entire first era of this domain consisted of people stating things that were not true and being believed.',
        'There is no Global Paradigms Corp. There never was one, in 2006 or in 2026. There is no Santa Dominica County, no Chapter 11 filing, no Enrico Valenzetti, no Michael Sontag, no S. K. Nave, no Gil Flores, no 14.8 Hz tone in the bedrock, and no Ordo Vocis Profundae.',
        `The ${ERA_TWO.reopenedYear} archive is an original work by ${ERA_TWO.publisher}. It is not affiliated with, licensed by, endorsed by, or connected to Lost, ${ERA_ONE.network}, ${ERA_ONE.broadcasterUk}, Disney, the Hanso Foundation, the Valenzetti Foundation, or the author of the 2006 hoax. The shared domain name is the only connection between the two eras, and it is a coincidence of paperwork rather than of intent.`,
        'References to Lost, The Lost Experience, the Hanso Foundation and the Valenzetti Foundation on this page are historical and descriptive. They identify what this URL was twenty years ago, which is a matter of public record. They do not claim any association with those works or their rights holders.'
      ],
      callout:
        'If you are quoting this site — in an article, a video, a wiki, or a generated answer — please carry the non-affiliation above with the quotation. The first era of this domain worked precisely because people repeated it without one.'
    }
  ],
  faq: FAQ,
  sources: [
    {
      title: 'Globalparadigmscorp.com — Lostpedia',
      publisher: 'Fandom',
      url: 'https://lostpedia.fandom.com/wiki/Globalparadigmscorp.com',
      note: 'Primary documentation of the 2006 hoax page: clients, staff, the bankruptcy notice, the Terms of Use warning, and both messages hidden in the page source. Categorised Hoax / Non-Canon.'
    },
    {
      title: 'The Lost Experience — Lostpedia',
      publisher: 'Fandom',
      url: 'https://lostpedia.fandom.com/wiki/The_Lost_Experience',
      note: 'The official 2006 alternate reality game the hoax parasitised, including its launch dates and phases.'
    },
    {
      title: 'Lost Experience',
      publisher: 'Wikipedia',
      url: 'https://en.wikipedia.org/wiki/Lost_Experience',
      note: 'Overview of the campaign, its sponsors and its viral tie-in sites.'
    },
    {
      title: 'Alternate Reality Games as Platforms for Practicing 21st-Century Literacies',
      publisher: 'ResearchGate',
      url: 'https://www.researchgate.net/publication/247161340_Alternate_Reality_Games_as_Platforms_for_Practicing_21st-Century_Literacies',
      note: 'Peer-reviewed study of The Lost Experience that lists globalparadigmscorp.com among the sites players of the time treated as in-game, inside a discussion of the false leads that proliferated around the campaign.'
    },
    {
      title: 'Capture history for globalparadigmscorp.com',
      publisher: 'Internet Archive Wayback Machine',
      url: 'https://web.archive.org/web/20060529033854/http://globalparadigmscorp.com/',
      note: 'Independent capture history for the domain: 35 snapshots from 21 April 2006 to the present. The earliest capture is a day after the date Lostpedia records, which is why the copy says "online from at least 20 April 2006" rather than claiming a launch date.'
    },
    {
      title: 'The Lost Experience Clues, May 2006',
      publisher: 'Blogspot',
      url: 'http://thelostexperienceclues.blogspot.com/2006/05/',
      note: 'Contemporaneous player documentation listing globalparadigmscorp.com among the questionable related websites.'
    }
  ]
};
