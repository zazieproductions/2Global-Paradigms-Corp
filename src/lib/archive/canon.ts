/**
 * CANON — the machine-readable spine of the archive setting.
 *
 * This module is the single place where the facts that must never drift are
 * *declared* rather than implied. It is data, not behaviour: `validate-canon.ts`
 * reads it and proves it against the collections, and `scripts/archive-report.mjs`
 * reads it to write the human-facing reference in `docs/generated/`.
 *
 * RULES FOR THIS FILE
 *
 * 1. Declare a fact here only if it is load-bearing — i.e. two or more records
 *    depend on it being the same value, or a puzzle answer depends on it.
 * 2. Every declaration names its evidence (`evidence`) as record ids or
 *    timeline ids. `validateCanon()` proves the evidence exists and agrees.
 *    A fact with no evidence is a bug, not a style choice.
 * 3. Never put a puzzle answer here. Answers live in `src/tests/seal-fixtures.ts`
 *    (test-only) and as digests in `src/content/puzzles/definitions.ts`.
 *    See docs/REVELATION.md §"Spoiler containment".
 * 4. Change a value here only with a matching entry in the drift log
 *    (docs/CONTINUITY.md §4). The validator will otherwise fail the build.
 */

import type { TimelineEra } from '@/types';

// ---------------------------------------------------------------------------
// Chronology
// ---------------------------------------------------------------------------

/** In-world span of the archive. Verified against the timeline collection. */
export const CANON_CHRONOLOGY = {
  /** First in-world year any record may carry. */
  firstYear: 1971,
  /** Last in-world year any record may carry. */
  lastYear: 2026,
  /** Year the frame story (the restoration) takes place. */
  frameYear: 2026
} as const;

/** The three editorial eras of `/timeline`, with the year ranges they claim. */
export const CANON_ERAS: { label: TimelineEra; from: number; to: number }[] = [
  { label: 'Early Foundations (1971-1989)', from: 1971, to: 1989 },
  { label: 'Millennial Expansion (1990-2009)', from: 1990, to: 2009 },
  { label: 'Modern Hegemony (2010-2026)', from: 2010, to: 2026 }
];

// ---------------------------------------------------------------------------
// Institutions
// ---------------------------------------------------------------------------

/** The two legal identities of the company, and the date the first became the second. */
export const CANON_COMPANIES = [
  {
    name: 'Paradigms Systems Ltd.',
    /** Cambridge incorporation. */
    from: '1971-04-12',
    to: '1984-10-05',
    evidence: { timeline: 'tl-01', document: 'doc-001' }
  },
  {
    name: 'Global Paradigms Corporation',
    from: '1984-10-05',
    /** Still trading at the frame date. */
    to: null,
    evidence: { timeline: 'tl-06' }
  }
] as const;

/**
 * The concealed layer. The exoteric shell is the corporation; the esoteric core
 * is the Order. Both names are canonical and are used deliberately:
 * `latin` in liturgical/Level 5 material, `gloss` in exposition.
 */
export const CANON_ORDER = {
  latin: 'ORDO VOCIS PROFUNDAE',
  mixed: 'Ordo Vocis Profundae',
  gloss: 'The Order of the Deep Voice',
  /** Written 1972, one year after the charter: the Order predates the company's public face. */
  ruleDocument: 'ovp-003',
  /** The Order's own alphabet. */
  script: 'Choir Script',
  /** The reliquary where unscrubbed originals are kept. */
  reliquary: 'Postojna',
  evidence: { timeline: 'tl-11', document: 'ovp-003' }
} as const;

/**
 * Clearance ranks double as degrees of initiation (`Liber Carrier` §IV).
 * Index = clearance rank; index 0 is unused because rank 1 is granted, not earned.
 */
export const CANON_DEGREES = [
  '',
  'Neophyte',
  'Zelator',
  'Practicus',
  'Philosophus',
  'Magister Umbrae'
] as const;

// ---------------------------------------------------------------------------
// The carrier
// ---------------------------------------------------------------------------

/**
 * The Global Baseline Carrier — the fact the whole corpus hangs from.
 *
 * `measured` is the rounded figure used in 1974-era and public-facing copy
 * (`14.8Hz`). `nominal` is the instrument reading used in telemetry, terminal
 * output and Order material (`14.802 Hz`). Both are canonical; they are not
 * variants of each other. See docs/CONTENT_STYLE_GUIDE.md §"Numbers and units".
 */
export const CANON_CARRIER = {
  /** Hz, as measured 1974-09-18 and quoted in public copy. */
  measured: '14.8Hz',
  /** Hz, the standing instrument reading used by telemetry. */
  nominal: '14.802 Hz',
  /** The liturgical threshold: the "Completion of the Square". */
  completion: '15.000',
  /** Annual drift asserted by the Order's status boards. */
  driftPerYear: '0.05%',
  /** The reading at the frame date (timeline's last entry). */
  atFrameDate: '14.94',
  evidence: { timeline: 'tl-02', document: 'doc-002', lastEntry: 'tl-52' }
} as const;

/** The three "voices" of the solar rite, in the order the catechism names them. */
export const CANON_VOICES = [
  { voice: 'Earth', programme: 'Global Baseline Carrier', hz: '14.8' },
  { voice: 'Evening', programme: 'Project Vesper', hz: '432' },
  { voice: 'Child', programme: 'Project Chime', hz: '741' }
] as const;

// ---------------------------------------------------------------------------
// Spine events
// ---------------------------------------------------------------------------

export interface CanonSpineEvent {
  /** Stable id. Never reused; referenced from the drift log. */
  id: string;
  /** ISO date. Every piece of evidence must agree with it. */
  date: string;
  /** One-line statement of the fact. */
  fact: string;
  evidence: {
    /** Timeline ids whose `dateString` must equal `date`. */
    timeline?: string[];
    /** Record ids whose normalised date must equal `date` exactly (primary evidence). */
    records?: string[];
    /**
     * Record ids that narrate the event: they must exist and be dated within
     * `NARRATION_WINDOW_DAYS` of it. An account written the next morning, or a
     * courier protocol issued two days early, is correct; one dated a decade off
     * is drift.
     */
    narrates?: string[];
    /** Record ids that must exist. Date not checked — they merely concern the event. */
    mentions?: string[];
  };
  /** Which seal or track, if any, pays this event off. */
  payoff?: string;
}

/** How far a narrating record may sit from the event it narrates. */
export const NARRATION_WINDOW_DAYS = 30;

/**
 * The load-bearing chronology. Nine events; everything else in the archive is
 * scenery arranged around them. A change to any date here is a continuity
 * event and needs a drift-log entry.
 */
export const CANON_SPINE: CanonSpineEvent[] = [
  {
    id: 'spine-founding',
    date: '1971-04-12',
    fact: 'Paradigms Systems Ltd. is incorporated in Cambridge by Sedley and Cross.',
    evidence: { timeline: ['tl-01'], records: ['doc-001'], mentions: ['p-001', 'p-002', 'st-01'] }
  },
  {
    id: 'spine-order-rule',
    date: '1972-11-04',
    fact: 'Liber Carrier is written: the Order already has a rule before the company has a product.',
    evidence: { records: ['ovp-003'] }
  },
  {
    id: 'spine-baseline',
    date: '1974-09-18',
    fact: 'The 14.8Hz carrier is measured in Cambridgeshire bedrock.',
    evidence: { timeline: ['tl-02'], records: ['doc-002'] },
    payoff: 'seal-1'
  },
  {
    id: 'spine-station-07',
    date: '1986-11-10',
    fact: 'Station 07 is commissioned on Spitsbergen; Borehole 4 follows.',
    evidence: { timeline: ['tl-08'], records: ['doc-006'], mentions: ['st-04'] },
    payoff: 'seal-3'
  },
  {
    id: 'spine-descent',
    date: '1989-11-04',
    fact: 'Borehole 4 breaches. Sedley descends and does not return; the Order names him Orpheus.',
    evidence: {
      timeline: ['tl-11'],
      records: ['doc-007'],
      // The Order's own account is filed the following morning.
      narrates: ['ovp-008'],
      mentions: ['p-001', 'audio-01']
    },
    payoff: 'seal-7'
  },
  {
    id: 'spine-vesper',
    date: '1989-11-20',
    fact: 'Project Vesper is chartered sixteen days after the Descent.',
    evidence: { timeline: ['tl-12'], records: ['doc-008'], mentions: ['prog-02'] }
  },
  {
    id: 'spine-palimpsest',
    date: '1994-05-18',
    fact: 'Reson-8 is recalled and Project Palimpsest begins retroactive redaction.',
    evidence: {
      timeline: ['tl-16'],
      // The standing procedure is issued a fortnight after the recall it answers.
      narrates: ['doc-011'],
      mentions: ['prog-05', 'prod-01']
    }
  },
  {
    id: 'spine-postojna',
    date: '1998-03-22',
    fact: "The Postojna caverns are acquired as the Order's reliquary.",
    evidence: { timeline: ['tl-18'], records: ['doc-012'], mentions: ['st-10'] },
    payoff: 'seal-5'
  },
  {
    id: 'spine-exfiltration',
    date: '2019-11-04',
    fact: 'Thorne leaves Station 07 with 48GB — thirty years to the day after the Descent.',
    evidence: {
      timeline: ['tl-46'],
      records: ['doc-022'],
      // The courier protocol is enciphered two days before the run.
      narrates: ['ovp-007', 'ovp-001'],
      mentions: ['p-009']
    },
    payoff: 'seal-6'
  }
];

// ---------------------------------------------------------------------------
// Structural counts
// ---------------------------------------------------------------------------

/**
 * Counts the archive is built around. These are *assertions*, not measurements:
 * `validateCanon()` compares each against the live collection and fails on
 * mismatch, so the sidebar badges, the docs and the corpus cannot disagree.
 */
export const CANON_COUNTS = {
  seals: 7,
  choirFragments: 7,
  choirLetters: 26,
  clearanceRanks: 5,
  gatewaySteps: 4,
  departments: 10,
  programs: 14,
  stations: 22,
  personnel: 45,
  /** Terminal commands listed by `help`. Undocumented aliases are not counted. */
  terminalCommands: 23
} as const;

// ---------------------------------------------------------------------------
// Terminology
// ---------------------------------------------------------------------------

export interface CanonTermRule {
  /** The only acceptable spelling. */
  canonical: string;
  /** Case-insensitive patterns that must not appear anywhere in shipped content. */
  banned: RegExp[];
  /** Why the variants are wrong — quoted in the validator output. */
  note: string;
}

/**
 * Spelling rules for high-risk proper nouns. Only *clear* errors are banned:
 * the corpus legitimately contains both `14.8Hz` (public copy) and `14.802 Hz`
 * (telemetry), both `Global Paradigms Corp.` and `Global Paradigms Corporation`,
 * so those are style questions for docs/CONTENT_STYLE_GUIDE.md, not errors here.
 */
export const CANON_TERMS: CanonTermRule[] = [
  {
    canonical: 'Global Paradigms Corp.',
    banned: [/Global Paradigm Corp\b/i, /Global Paradigms Corps\b/i],
    note: 'The company name is plural in "Paradigms" and never "Corps".'
  },
  {
    canonical: 'Ordo Vocis Profundae',
    banned: [/Ordo Vocis Profunda\b(?!e)/i, /Ordo Vocis Profundum/i, /Ordo Voci Profundae/i],
    note: 'Latin genitive: "Profundae". The nominative "Profunda" and the neuter "Profundum" are both wrong.'
  },
  {
    canonical: 'Project Palimpsest',
    banned: [/Palimpset/i, /Palimpsestt/i],
    note: "Two p's, one t."
  },
  {
    canonical: 'Postojna',
    banned: [/Postojnia/i, /Postoina/i, /Postojns/i],
    note: 'Slovenian karst system; the reliquary of Seal V.'
  },
  {
    canonical: 'Svalbard',
    banned: [/Svalbaard/i, /Svalbarad/i],
    note: 'Archipelago containing Station 07 (Spitsbergen).'
  },
  {
    canonical: 'Thorne',
    banned: [/\bThorn\b(?!e)/i],
    note: 'Ewan and Julian Thorne. "Thorn" without the e is a different (nonexistent) person.'
  },
  {
    canonical: 'Sedley',
    banned: [/\bSedly\b/i, /\bSedlay\b/i],
    note: 'Dr. Arthur Sedley, co-founder.'
  },
  {
    canonical: 'Aethelgard',
    banned: [/(?<![A-Za-z])Ethelgard/i, /Aethelguard/i],
    note: 'The continuity-redoubt programme keeps its ae digraph and -gard ending.'
  },
  {
    canonical: 'Choir Script',
    banned: [/ChoirScript/, /Choir script\b/],
    note: 'Two capitalised words; it is the name of an alphabet, not a description.'
  },
  {
    canonical: 'Orpheus',
    banned: [/Orpheous/i, /Orpheu\b(?!s)/i],
    note: "Sedley's Order-name. Also the last word of the finale."
  }
];

// ---------------------------------------------------------------------------
// Invariants
// ---------------------------------------------------------------------------

export interface CanonInvariant {
  /** Stable id, cited from docs/CONTINUITY.md and the drift log. */
  id: string;
  /** Plain-English statement of what must hold. */
  statement: string;
  /** Where it is enforced. */
  enforcedBy: 'validate-canon' | 'validate-content' | 'tests' | 'build' | 'convention';
}

/**
 * The invariants the archive depends on. `validateCanon()` and
 * `validateContent()` between them check every `enforcedBy` value other than
 * `convention`; the convention rows are for reviewers and are restated in
 * docs/CONTINUITY.md.
 */
export const CANON_INVARIANTS: CanonInvariant[] = [
  {
    id: 'INV-CHRON-01',
    statement: 'Every in-world date falls between 1971 and 2026 inclusive.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-CHRON-02',
    statement: "A timeline entry's `year` equals the year of its `dateString`.",
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-CHRON-03',
    statement: "A timeline entry's `era` label range contains its `year`.",
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-CHRON-04',
    statement: 'The timeline is sorted ascending by date and has no duplicate ids.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-SPINE-01',
    statement: 'Every spine event has at least one piece of evidence, and all of it resolves.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-SPINE-02',
    statement: "Every dated piece of spine evidence carries the spine event's date.",
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-ENTITY-01',
    statement: "A personnel file's `departmentName`/`stationName` match the records its ids point at.",
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-ENTITY-02',
    statement: "A station's `leadPersonnelName` names the person its `leadPersonnelId` resolves to.",
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-ENTITY-03',
    statement: "A document's `departmentName` matches its `departmentId`.",
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-ENTITY-04',
    statement: 'Department, station, program and audio codes are unique and correctly prefixed.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-TERM-01',
    statement: 'No banned spelling variant of a canonical proper noun appears in shipped content.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-SEAL-01',
    statement: 'There are exactly seven seals, in planetary order Saturn→Moon, with distinct Seal-Words.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-SEAL-02',
    statement: 'The initials of Seal-Words I–VI are the first six letters of the name Seal VII reveals.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-SEAL-03',
    statement: 'Clearance rewards ascend monotonically across the seals that grant them.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-SEAL-04',
    statement: '`EARNED_BY`, `SEAL_FOR_RANK` and `DEGREES` agree with `SEALS` and `CANON_DEGREES`.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-CHOIR-01',
    statement: 'The seven fragments between them teach every letter the inscription needs.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-CHOIR-02',
    statement: 'Each fragment hides on the tab it names, and each tab hosts exactly one fragment.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-REF-01',
    statement: 'Every record code printed by the terminal resolves to a real record.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-REF-02',
    statement: 'A document code is never used to cite an audio artifact (`ART-…`, not `AUDIO-…`).',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-TERM-02',
    statement: 'Every command `help` lists is implemented in the terminal component.',
    enforcedBy: 'tests'
  },
  {
    id: 'INV-TERM-03',
    statement: 'Every documented alias is implemented, and no alias grants anything.',
    enforcedBy: 'tests'
  },
  {
    id: 'INV-GATE-01',
    statement: 'Gateway steps chain in order and grant no clearance reward.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-REV-01',
    statement: 'No puzzle clue points at a record or route that does not exist.',
    enforcedBy: 'validate-content'
  },
  {
    id: 'INV-REV-02',
    statement: 'Hidden words are stripped before render, export, clipboard and index.',
    enforcedBy: 'tests'
  },
  {
    id: 'INV-REV-03',
    statement: 'Order material is tagged `Order` and is never Level 1.',
    enforcedBy: 'tests'
  },
  {
    id: 'INV-REV-04',
    statement: 'Plaintext answers appear only in tier-3 hints, success/journal text and test fixtures.',
    enforcedBy: 'convention'
  },
  {
    id: 'INV-REC-01',
    statement: 'Record ids are never reused or renamed; codes are separate from ids.',
    enforcedBy: 'convention'
  },
  {
    id: 'INV-REC-02',
    statement: 'Every audio artifact ships a transcript and a plain-language description.',
    enforcedBy: 'validate-content'
  },
  {
    id: 'INV-COUNT-01',
    statement: 'The declared structural counts match the live collections.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-TAPE-01',
    statement:
      'A purged record is struck, not deleted: its code stays unresolved in the live index and survives only as shards on the Postojna spool.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-TAPE-02',
    statement:
      'Every ghost code is cited by a real personnel dossier, so the salvage layer stays discoverable from the archive itself.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-TAPE-03',
    statement:
      'Ghost shards are numbered 1..n with unique, ascending locators, so a splice has exactly one correct answer.',
    enforcedBy: 'validate-canon'
  },
  {
    id: 'INV-TAPE-04',
    statement:
      'The salvage layer carries no seal answers: no Seal-Word appears in Directive 17 or any ghost text, except where recorded in CANON_TAPE_EXCEPTIONS.',
    enforcedBy: 'validate-canon'
  }
];

/**
 * Reviewable exceptions to `INV-TAPE-04`.
 *
 * A Seal-Word appearing in ghost text is worth stopping on, because the salvage
 * layer promises to carry no answers. Most collisions are accidents. One is not
 * obviously an accident, so it is recorded here with its reason rather than
 * either deleted or ignored: if the author intended it as a plant, this is the
 * note that says so; if not, this is the note that says where to look.
 *
 * Adding an entry is a narrative decision and belongs in `docs/CONTINUITY.md`
 * §4 as well. Anything *not* listed here still fails CI.
 */
export const CANON_TAPE_EXCEPTIONS: ReadonlyArray<{
  ghostId: string;
  sealWord: string;
  reason: string;
}> = [
  {
    ghostId: 'ghost-003',
    sealWord: 'ECHO',
    reason:
      'The Cohort Alpha register names its alternates column "ECHO" alongside soprano/alto/tenor/bass — ordinary choral usage in-world, in a document about a choir. It is also the Seal V Seal-Word. Flagged, not resolved: if this is meant to be a plant, it is the only Seal-Word reachable before Seal V and should be treated as a clue; if it is not, rename the column. Decided by the narrative author, not by tooling.'
  }
];

/** Lookup by id, for the generated docs and the drift log. */
export const CANON_INVARIANT_BY_ID: Readonly<Record<string, CanonInvariant>> = Object.fromEntries(
  CANON_INVARIANTS.map((i) => [i.id, i])
);
