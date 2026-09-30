// ============================================================================
// OPERATION SILENTIUM — DIRECTIVES
// ----------------------------------------------------------------------------
// The mission layer that binds the scattered archive into one investigation.
// Everything the operator can do is organised into five escalating chapters;
// each chapter contains directives with auto-tracked steps. Steps complete by
// themselves when the matching event happens in the archive (a record opened,
// a section visited, a seal broken, a fragment recovered, a milestone reached)
// — the player never bookkeeps.
//
// Each directive pays out FIELD INTEL: a short lore paragraph revealed only on
// completion. Chapters unlock strictly in order, directives within a chapter
// unlock in order, so there is always exactly one CURRENT OBJECTIVE.
//
// THIS FILE IS NARRATIVE CONTENT ONLY. No answers live here — directive steps
// only *reference* the seals, whose validation stays in `definitions.ts`.
// ============================================================================

import type { ActiveTab } from '@/types';

/**
 * Environmental events the progression store records as milestones.
 * Route visits are stored as `route:<tab>` and are generated, not listed.
 */
export type MilestoneId =
  | 'terminal-scan'
  | 'terminal-codex'
  | 'descrambler-on'
  | 'audio-played'
  | 'audio-station07'
  | 'safe-opened'
  | 'dump-retrieved';

export const MILESTONE_IDS: MilestoneId[] = [
  'terminal-scan',
  'terminal-codex',
  'descrambler-on',
  'audio-played',
  'audio-station07',
  'safe-opened',
  'dump-retrieved'
];

/** Milestone id recorded when the operator first visits a section. */
export const routeMilestone = (tab: ActiveTab): string => `route:${tab}`;

/** Every tab whose visit is recorded as a milestone. */
export const ROUTE_MILESTONE_TABS: ActiveTab[] = [
  'dashboard',
  'documents',
  'personnel',
  'stations',
  'programs',
  'departments',
  'products',
  'audio',
  'reports',
  'communications',
  'timeline',
  'newsletters',
  'training',
  'careers',
  'values',
  'tools',
  'deadlinks',
  'sanctum',
  'directives'
];

const KNOWN_MILESTONES = new Set<string>([...MILESTONE_IDS, ...ROUTE_MILESTONE_TABS.map(routeMilestone)]);

/** The reducer only ever records milestones it knows by name. */
export const isKnownMilestone = (id: string): boolean => KNOWN_MILESTONES.has(id);

// ---------------------------------------------------------------------------
// Events & steps
// ---------------------------------------------------------------------------

/** An observable fact about the operator's investigation. */
export type DirectiveEvent =
  | { type: 'puzzle'; id: string }
  | { type: 'record'; id: string }
  | { type: 'route'; tab: ActiveTab }
  | { type: 'fragments'; count: number }
  | { type: 'clearance'; rank: 1 | 2 | 3 | 4 | 5 }
  | { type: 'milestone'; id: MilestoneId }
  | { type: 'prologue' }
  | { type: 'finale' };

export interface DirectiveStep {
  id: string;
  /** What the operator is told to do. */
  label: string;
  /** Where / how, in one line. */
  hint: string;
  event: DirectiveEvent;
}

/** Lore paid out when a directive completes. */
export interface FieldIntel {
  title: string;
  text: string;
}

export interface Directive {
  id: string;
  chapterId: string;
  /** In-world designation, e.g. `OP-04`. */
  code: string;
  title: string;
  /** Two or three sentences of orders from the Restoration Cell. */
  briefing: string;
  steps: DirectiveStep[];
  intel: FieldIntel;
  /** Investigation-journal line written on completion. */
  journal: string;
}

export interface DirectiveChapter {
  id: string;
  index: number;
  code: string;
  title: string;
  subtitle: string;
  briefing: string;
  /** Design-system colour used to theme the chapter. */
  accent: string;
  /** Operator standing granted by completing the chapter. */
  standing: string;
}

// ---------------------------------------------------------------------------
// CHAPTER I — ARRIVAL PROTOCOL
// ---------------------------------------------------------------------------

const CHAPTER_1: DirectiveChapter = {
  id: 'ch-1',
  index: 1,
  code: 'CH-1',
  title: 'ARRIVAL PROTOCOL',
  subtitle: 'Learn the surface before you descend.',
  accent: '#00f0ff',
  standing: 'PROBATIONARY READER',
  briefing:
    'You are inside the recovered archive of Global Paradigms Corp. Everything here is real the way recovered things are real: legible, ordered, and watched. Learn the surface of the machine. Then begin the descent. Directives are released as you prove you can hold them.'
};

const OP_01: Directive = {
  id: 'op-01',
  chapterId: 'ch-1',
  code: 'OP-01',
  title: 'FIRST SHIFT',
  briefing:
    'Report for duty. Read the transmission that broke into your session, and learn to drive the terminal — the archive answers questions asked in the right syntax.',
  steps: [
    {
      id: 'op-01-dashboard',
      label: 'Report to the Command Dashboard',
      hint: 'The landing page of the archive. You are expected there.',
      event: { type: 'route', tab: 'dashboard' }
    },
    {
      id: 'op-01-prologue',
      label: 'Read the intercepted dead-drop transmission',
      hint: 'It arrives on its own after the boot sequence. If you dismissed it, the case file can replay it.',
      event: { type: 'prologue' }
    },
    {
      id: 'op-01-scan',
      label: 'Open the terminal and run `scan`',
      hint: 'Press ` (backtick) anywhere, then type: scan',
      event: { type: 'milestone', id: 'terminal-scan' }
    }
  ],
  intel: {
    title: 'THE WELL',
    text: 'What you are reading was rebuilt from backup shards, tape mirrors and one Postojna hash tree that outlived the company. The Restoration Cell counted 412 records the scrubbers missed or deemed too boring to kill. Clearance here is not a rank you are given — it is a measurement of what you have proved you can hold. That is why only the seals grant it, and nothing else.'
  },
  journal: 'OP-01 complete — first shift done. Terminal answered. The archive knows the operator now.'
};

const OP_02: Directive = {
  id: 'op-02',
  chapterId: 'ch-1',
  code: 'OP-02',
  title: 'THE GATEWAY TRANSMISSION',
  briefing:
    'Thorne left a guided trail for whoever came after him: four locks on the relay gate, each one teaching a move the case will need later. Walk it end to end. It grants no clearance — it grants competence.',
  steps: [
    {
      id: 'op-02-sequence',
      label: 'Re-hang the mausoleum marquee (the Vesper Sequence)',
      hint: 'Open the Gateway Transmission from the header radio icon.',
      event: { type: 'puzzle', id: 'gateway-sequence' }
    },
    {
      id: 'op-02-signal',
      label: 'Chain the six signal devices in tap order',
      hint: 'Each device remembers only its own place in the queue.',
      event: { type: 'puzzle', id: 'gateway-signal' }
    },
    {
      id: 'op-02-waveform',
      label: 'Wire the carrier lattice to the ledger',
      hint: 'Live rows carry exactly one pulse.',
      event: { type: 'puzzle', id: 'gateway-waveform' }
    },
    {
      id: 'op-02-gate',
      label: 'Re-enter the three keys and open the gate',
      hint: 'The interlock asks for everything you kept, in order.',
      event: { type: 'puzzle', id: 'gateway-transmission' }
    }
  ],
  intel: {
    title: 'THREE KEYS',
    text: 'VESPAR. 987316. COLD. Three keys the gate re-asks — and three things the company wanted forgotten: a name, an order, a temperature. Thorne’s marginal note on the gateway schematic is two words: “The well opens downward.”'
  },
  journal: 'OP-02 complete — Gateway Transmission walked. VESPAR · 987316 · COLD. The well is open.'
};

const OP_03: Directive = {
  id: 'op-03',
  chapterId: 'ch-1',
  code: 'OP-03',
  title: 'FIRST SEAL — SATURN',
  briefing:
    'Open the case file and break the first seal: the Square of Lead. Nine cells, one constant, and a chill when you compare it to the number in the header. Saturn pays in clearance.',
  steps: [
    {
      id: 'op-03-sanctum',
      label: 'Enter the Seven Seals case file',
      hint: 'The Sanctum — the glowing entry at the top of the sidebar.',
      event: { type: 'route', tab: 'sanctum' }
    },
    {
      id: 'op-03-seal',
      label: 'Break Seal I — The Square of Lead',
      hint: 'Digits 1–9 once each; every line sums to the same constant.',
      event: { type: 'puzzle', id: 'seal-1' }
    },
    {
      id: 'op-03-clearance',
      label: 'Hold LEVEL 2 clearance',
      hint: 'Granted automatically the moment the seal breaks.',
      event: { type: 'clearance', rank: 2 }
    }
  ],
  intel: {
    title: 'FIFTEEN',
    text: 'The constant of Saturn is 15. The carrier in the header reads 14.802 Hz and climbs about 0.05% a year — the Order’s own boards say so. The internal liturgy has a name for the day it reaches 15.000: the Completion of the Square. Every redoubt, every Cohort, every “continuity investment” in this archive is scheduled against that arrival. You are Level 2 now. Read like someone who is expected.'
  },
  journal:
    'OP-03 complete — Seal I (Saturn ♄) broken. Clearance LEVEL 2. The Order’s calendar is visible now.'
};

// ---------------------------------------------------------------------------
// CHAPTER II — THE LITURGY BENEATH
// ---------------------------------------------------------------------------

const CHAPTER_2: DirectiveChapter = {
  id: 'ch-2',
  index: 2,
  code: 'CH-2',
  title: 'THE LITURGY BENEATH',
  subtitle: 'The company is the shell. The liturgy is the kernel.',
  accent: '#d946ef',
  standing: 'CLEARED INVESTIGATOR',
  briefing:
    'The Order of the Deep Voice files its work under seven planetary seals — and Thorne hid his evidence behind the same seven, because the scrubbers are forbidden to touch liturgy. Keep breaking them, strictly in order. And start reading what the black bars cover.'
};

const OP_04: Directive = {
  id: 'op-04',
  chapterId: 'ch-2',
  code: 'OP-04',
  title: 'SECOND SEAL — JUPITER',
  briefing:
    'Every GPC lobby hides the same brass inlay. Trace the week across it, break the second seal, and turn on the lamp — from this rank on, the archive reads differently.',
  steps: [
    {
      id: 'op-04-seal',
      label: 'Break Seal II — The Wheel of Days',
      hint: 'Click the heptagram in the order of the days of the week, beginning Sunday.',
      event: { type: 'puzzle', id: 'seal-2' }
    },
    {
      id: 'op-04-descrambler',
      label: 'Activate the Redaction De-Scrambler',
      hint: 'Press U, or use the eye in the header. It is yours now.',
      event: { type: 'milestone', id: 'descrambler-on' }
    },
    {
      id: 'op-04-redacted',
      label: 'Read one covered record with the lamp on',
      hint: 'DOC-1979-SITE19-GROUNDBREAKING is Level 3 — open it from the vault and look at the bars.',
      event: { type: 'record', id: 'doc-004' }
    }
  ],
  intel: {
    title: 'WHAT THE BARS COVER',
    text: 'Palimpsest does not delete. It covers. Every black bar in this archive still has its words underneath, and the De-Scrambler is not a hacking tool — it is a reading lamp. Rule of thumb from here on: any document they bothered to bar is a document that matters, and the ones with the most bars are the ones that end this case.'
  },
  journal: 'OP-04 complete — Seal II (Jupiter ♃) broken. De-Scrambler engaged. The bars have undersides now.'
};

const OP_05: Directive = {
  id: 'op-05',
  chapterId: 'ch-2',
  code: 'OP-05',
  title: 'THE SCATTERED CHOIR',
  briefing:
    'The Order writes in its own alphabet and keeps the key in pieces, hidden on its own public pages where no initiate would look twice. Recover the fragments, finish the Codex, and read the sentence the Order hid in plain sight.',
  steps: [
    {
      id: 'op-05-three',
      label: 'Recover 3 Choir Script fragments',
      hint: 'Faint glyphs near the top of the public pages: Newsletters, Careers, Timeline, Values, Products, Reports, Dead Links. Hover or focus them.',
      event: { type: 'fragments', count: 3 }
    },
    {
      id: 'op-05-seven',
      label: 'Recover all 7 fragments',
      hint: 'Seven public pages, seven fragments. The Codex panel on the seal shows what you hold.',
      event: { type: 'fragments', count: 7 }
    },
    {
      id: 'op-05-seal',
      label: 'Break Seal III — The Scattered Choir',
      hint: 'Enter the PLACE the completed inscription names.',
      event: { type: 'puzzle', id: 'seal-3' }
    }
  ],
  intel: {
    title: 'THE CHOIR READS',
    text: 'Seven fragments, seven public pages, one sentence: THE CHOIR SINGS BENEATH SVALBARD. The Order hid its own confession inside its own marketing — the only place it believed no one would read twice. Your Codex is complete now. Wherever else you meet Choir Script in this archive, it is not decoration. It is instructions. Read all of them.'
  },
  journal: 'OP-05 complete — Seal III (Mars ♂) broken. The Codex reads. SVALBARD is the place.'
};

const OP_06: Directive = {
  id: 'op-06',
  chapterId: 'ch-2',
  code: 'OP-06',
  title: 'THE MISSING FOUNDER',
  briefing:
    'Before the next seal: learn what happened to the man who signed the charter. The company calls it a disavowal. The Order calls it the Descent. Follow the paper trail to the ice.',
  steps: [
    {
      id: 'op-06-commission',
      label: 'Open the Svalbard commission order',
      hint: 'DOC-1986-SVALBARD-COMMISSION — Level 2, in the vault. Search by code.',
      event: { type: 'record', id: 'doc-006' }
    },
    {
      id: 'op-06-stations',
      label: 'Study the Regional Stations map',
      hint: 'Find Station 07. Note how far down Borehole 4 goes.',
      event: { type: 'route', tab: 'stations' }
    },
    {
      id: 'op-06-timeline',
      label: 'Walk the timeline to 1989',
      hint: 'The Historical Timeline keeps the official version. Read the Svalbard entry.',
      event: { type: 'route', tab: 'timeline' }
    }
  ],
  intel: {
    title: 'THE DESCENT',
    text: 'November 1989. Arthur Sedley took the Borehole 4 lift down to minus 820 metres for a listening vigil, and the lift came back up without him. The company booked it as a disavowal; the Order booked it as a Descent, and it keeps a card for that word in the annual report, like a sacrament. A Level 5 event file about that night exists — you will read it when you hold the rank. Until then, remember: a founder went down, and the company kept running.'
  },
  journal: 'OP-06 complete — the Descent reconstructed. Sedley went down in 1989 and did not come back.'
};

// ---------------------------------------------------------------------------
// CHAPTER III — THREE VOICES, ONE HYMN
// ---------------------------------------------------------------------------

const CHAPTER_3: DirectiveChapter = {
  id: 'ch-3',
  index: 3,
  code: 'CH-3',
  title: 'THREE VOICES, ONE HYMN',
  subtitle: 'Three frequencies. Three offices. One song.',
  accent: '#fbbf24',
  standing: 'LITURGY CLEARED',
  briefing:
    'A hymn in three parts has been sung at a billion people every evening for thirty years, and the paperwork for each part sits in a different office, because boredom is the safest safe. Find the chord. Find the reliquary. Learn what the dead pages of the old web still remember.'
};

const OP_07: Directive = {
  id: 'op-07',
  chapterId: 'ch-3',
  code: 'OP-07',
  title: 'THE CHORD',
  briefing:
    'The Sun seal wants three voices tuned at once. Walk the project dossiers, hear at least one artifact with your own ears, then set the three dials of the Sun Lock.',
  steps: [
    {
      id: 'op-07-programs',
      label: 'Study the Project Dossiers',
      hint: 'Find the programme behind each voice: Earth, Evening, Child.',
      event: { type: 'route', tab: 'programs' }
    },
    {
      id: 'op-07-audio',
      label: 'Play any acoustic artifact',
      hint: 'The Acoustic Artifacts lab synthesises them on demand. Headphones recommended.',
      event: { type: 'milestone', id: 'audio-played' }
    },
    {
      id: 'op-07-seal',
      label: 'Break Seal IV — The Three Voices',
      hint: 'Three dials, three frequencies in Hz. Each is written down somewhere boring.',
      event: { type: 'puzzle', id: 'seal-4' }
    }
  ],
  intel: {
    title: 'ONE HYMN, THREE PARTS',
    text: '14.8 Hz under the ground. 432 Hz in every city at six o’clock. 741 Hz in every school bell. Separately: geology, municipal infrastructure, education policy. Together: one chord. Chime, Vesper and the carrier were never three programmes — they are one hymn, filed in three offices so that no single employee ever held the whole song. Play them together once, in the lab, and notice what the room does.'
  },
  journal: 'OP-07 complete — Seal IV (Sun ☉) broken. LEVEL 4. The three voices were always one hymn.'
};

const OP_08: Directive = {
  id: 'op-08',
  chapterId: 'ch-3',
  code: 'OP-08',
  title: 'THE REDACTED HYMN',
  briefing:
    'The Order keeps its originals in a reliquary, and the reliquary’s location is hidden where no outsider reads: inside a company hymn. Open the hymnal with the lamp on and read down the edge.',
  steps: [
    {
      id: 'op-08-hymnal',
      label: 'Open the Hymnal of the Sealed Choir',
      hint: 'DOC-1987-HYMNAL-OVP — Level 4. De-Scrambler ON before you read.',
      event: { type: 'record', id: 'ovp-005' }
    },
    {
      id: 'op-08-seal',
      label: 'Break Seal V — The Redacted Hymn',
      hint: 'An acrostic. The laziest kind, according to Thorne.',
      event: { type: 'puzzle', id: 'seal-5' }
    }
  ],
  intel: {
    title: 'THE RELIQUARY',
    text: 'POSTOJNA. The sidebar has been telling you since your first session — look at the bottom: DATABASE: GPC_POSTOJNA_MASTER. Not a backup site. A reliquary, in the old sense: the place the original is kept so the copy in circulation can always be made to agree with it. A liturgy must be remembered exactly, precisely where the world is made to forget it. Keep the word. It is a place, and it is also a key.'
  },
  journal: 'OP-08 complete — Seal V (Venus ♀) broken. The reliquary has a name: POSTOJNA.'
};

const OP_09: Directive = {
  id: 'op-09',
  chapterId: 'ch-3',
  code: 'OP-09',
  title: 'DEAD PAGES WHISPER',
  briefing:
    'The old public web remembers what the company rewrote. Visit the dead-link shelf and read the record of Thorne’s mirror — the one they had to seize.',
  steps: [
    {
      id: 'op-09-deadlinks',
      label: 'Enter Dead Links & Wayback Mirrors',
      hint: 'Broken doors, kept on file. Seven of them.',
      event: { type: 'route', tab: 'deadlinks' }
    },
    {
      id: 'op-09-mirror',
      label: 'Open the seized whistleblower relay record',
      hint: 'palimpsest-archive.ch — Domain Seized, March 2020.',
      event: { type: 'record', id: 'dead-03' }
    }
  ],
  intel: {
    title: 'WHAT DEAD LINKS KEEP',
    text: 'The mirror holding Thorne’s master files was seized in March 2020 by court order on application by GPC itself. But by the time of the seizure it had been pulled 211 times — thirty-four of those from inside the company’s own network. That was the part of the report that got people moved. Dead links are not broken doors. They are doors someone is still holding shut from the other side.'
  },
  journal: 'OP-09 complete — the seized mirror read. 211 pulls, 34 from inside the fence.'
};

// ---------------------------------------------------------------------------
// CHAPTER IV — BLACK DOSSIER
// ---------------------------------------------------------------------------

const CHAPTER_4: DirectiveChapter = {
  id: 'ch-4',
  index: 4,
  code: 'CH-4',
  title: 'BLACK DOSSIER',
  subtitle: 'Level 5 exists because someone wanted a room with no windows.',
  accent: '#ff0055',
  standing: 'BLACK CLEARANCE',
  briefing:
    'Everything Palimpsest has been covering is about to become legible to you. Open Thorne’s safe, take the dump, read the Black records, and learn who has been sitting in the Seventh Chamber. Then go and end the song.'
};

const OP_10: Directive = {
  id: 'op-10',
  chapterId: 'ch-4',
  code: 'OP-10',
  title: 'THE MESSENGER’S WHEEL',
  briefing:
    'Mercury is the messenger, so the Order gives its couriers a wheel. Turn it with the name of the reliquary, read what it tells you about the hour, and open the whistleblower safe in the top bar.',
  steps: [
    {
      id: 'op-10-safe',
      label: 'Open the Palimpsest Cryptographic Safe',
      hint: 'The key icon in the top bar.',
      event: { type: 'milestone', id: 'safe-opened' }
    },
    {
      id: 'op-10-seal',
      label: 'Break Seal VI — The Mercury Wheel',
      hint: 'The safe opens at the hour Vesper sings.',
      event: { type: 'puzzle', id: 'seal-6' }
    },
    {
      id: 'op-10-dump',
      label: 'Extract the whistleblower data dump',
      hint: 'It sits inside the open safe, as a .JSON.',
      event: { type: 'milestone', id: 'dump-retrieved' }
    }
  ],
  intel: {
    title: 'MAGISTER UMBRAE',
    text: 'Inside the safe: a lead tablet with a seven-pointed star, a cassette labelled “BH4 — 05:15”, and a note in Thorne’s hand — “Umbra. The shadow behind the record. You’re a Magister now — read the Black files.” Level 5 is the top of the ladder. There is nothing above you now but the Moon, and the Moon is a mirror.'
  },
  journal: 'OP-10 complete — Seal VI (Mercury ☿) broken. LEVEL 5 — BLACK DOSSIER. The dump is out.'
};

const OP_11: Directive = {
  id: 'op-11',
  chapterId: 'ch-4',
  code: 'OP-11',
  title: 'THE BLACK RECORDS',
  briefing:
    'Three documents were worth a scrubber crew working overtime. Read all three, in full, with the lamp on.',
  steps: [
    {
      id: 'op-11-charter',
      label: 'Read the 1971 Founding Charter',
      hint: 'DOC-1971-FOUNDING — Level 5. Note who else “witnesses” the signature.',
      event: { type: 'record', id: 'doc-001' }
    },
    {
      id: 'op-11-descent',
      label: 'Read the Descent of Orpheus',
      hint: 'DOC-1989-DESCENT-ORPHEUS — Level 5. The night the lift came back empty.',
      event: { type: 'record', id: 'ovp-007' }
    },
    {
      id: 'op-11-chamber',
      label: 'Read the Seventh Chamber minutes',
      hint: 'DOC-2025-SEVENTH-CHAMBER — Level 5. The attendance sheet is the point.',
      event: { type: 'record', id: 'ovp-008' }
    }
  ],
  intel: {
    title: 'ORPHEUS WENT DOWN',
    text: 'Three Black records, one story. The 1971 charter was witnessed by something that is not a person. The 1989 Descent gave the Deep Voice a singer — Sedley’s voice, answering from minus 820 metres ever since. And the Seventh Chamber minutes show the board still taking attendance from both sides of the borehole. The carrier is not drifting. It is climbing. And it has been answering in a dead man’s voice for thirty years.'
  },
  journal: 'OP-11 complete — the Black records read. The charter, the Descent, the Chamber. One story.'
};

const OP_12: Directive = {
  id: 'op-12',
  chapterId: 'ch-4',
  code: 'OP-12',
  title: 'THE ATTENDANCE ROLL',
  briefing:
    'Names in minutes mean nothing until you put faces to them. Cross-reference the Chamber against the living company before you do anything irreversible.',
  steps: [
    {
      id: 'op-12-personnel',
      label: 'Check the Personnel Directory',
      hint: 'Match the Chamber attendance sheet against current staff. Note the statuses.',
      event: { type: 'route', tab: 'personnel' }
    },
    {
      id: 'op-12-cohort',
      label: 'Read the Silent Cohort trial log',
      hint: 'DOC-2021-SILENT-COHORT-LOG — Level 5. Day 45 is the important day.',
      event: { type: 'record', id: 'doc-023' }
    },
    {
      id: 'op-12-reports',
      label: 'Review the Annual Strategic Disclosures',
      hint: 'Read the continuity line items. Follow the money downward.',
      event: { type: 'route', tab: 'reports' }
    }
  ],
  intel: {
    title: 'THE ROLL CALL',
    text: 'Cross-reference the Seventh Chamber minutes against the personnel directory and the Cohort log: the attendees are still employed, still listed Active, still signing the annual disclosures. Whatever sits under Cambridge is not being managed by the company. It is being fed by it — one cohort, one vigil, one six o’clock at a time. Now you know who is in the room. That is what you needed for the last seal.'
  },
  journal: 'OP-12 complete — the attendance roll matched. They are still on the payroll. All of them.'
};

// ---------------------------------------------------------------------------
// CHAPTER V — SILENTIUM
// ---------------------------------------------------------------------------

const CHAPTER_5: DirectiveChapter = {
  id: 'ch-5',
  index: 5,
  code: 'CH-5',
  title: 'SILENTIUM',
  subtitle: 'Six words make six letters. The seventh seal is a name.',
  accent: '#e2e8f0',
  standing: 'SILENTIUM',
  briefing:
    'You hold six Seal-Words. Their first letters finish a name from the old story — the singer who went down for love and looked back. The seventh seal is not solved. It is spoken, once. After that, there is only what an archive does with silence.'
};

const OP_13: Directive = {
  id: 'op-13',
  chapterId: 'ch-5',
  code: 'OP-13',
  title: 'THE NAME THAT ENDS THE SONG',
  briefing:
    'Take the first letter of each Seal-Word, in order. Finish the name. Then speak it at the Moon seal — or in the terminal, where speech has always been the interface. Say it once.',
  steps: [
    {
      id: 'op-13-finale',
      label: 'Perform the Counter-Rite',
      hint: 'Seal VII, in the Sanctum. Or: terminal → invoke <name>.',
      event: { type: 'finale' }
    }
  ],
  intel: {
    title: 'SILENTIUM',
    text: 'The carrier is falling. 14.802 … 9.1 … 3.3 … 0.000. For the first time since April 1971 there is nothing under Cambridge. Twenty-two stations report a flat line. In a thousand subway stations at six o’clock, nobody feels tired. The singer was called by his name, and he turned around. The song is over. The records remain.'
  },
  journal: 'OP-13 complete — the Name was spoken. Carrier 0.000 Hz. SILENTIUM.'
};

const OP_14: Directive = {
  id: 'op-14',
  chapterId: 'ch-5',
  code: 'OP-14',
  title: 'AFTER THE SONG',
  briefing:
    'Walk the archive one last time and watch what silence looks like on the instruments. Then come back here and close the file.',
  steps: [
    {
      id: 'op-14-dashboard',
      label: 'Watch the carrier telemetry on the Dashboard',
      hint: 'The number in the first panel has stopped climbing.',
      event: { type: 'route', tab: 'dashboard' }
    },
    {
      id: 'op-14-timeline',
      label: 'Re-read the timeline’s final era',
      hint: 'Modern Hegemony, 2010–2026. The last entries read differently now.',
      event: { type: 'route', tab: 'timeline' }
    },
    {
      id: 'op-14-sanctum',
      label: 'Return to the case file',
      hint: 'All seven emblems are lit. The circle is closed.',
      event: { type: 'route', tab: 'sanctum' }
    }
  ],
  intel: {
    title: 'WHAT THE ARCHIVISTS WROTE',
    text: 'Restoration Cell, final note: “We recovered 412 records and one instruction the company never managed to scrub — THE RECORDS ARE REAL AS LONG AS YOU KEEP READING. The carrier is silent now, but silence is also a frequency. Keep the archive open. Someone will come looking for it again. When they do, hand them the directives.” — END OF OPERATION.'
  },
  journal: 'OP-14 complete — the archive walked in silence. Operation SILENTIUM closed.'
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const DIRECTIVE_CHAPTERS: DirectiveChapter[] = [CHAPTER_1, CHAPTER_2, CHAPTER_3, CHAPTER_4, CHAPTER_5];

export const DIRECTIVES: Directive[] = [
  OP_01,
  OP_02,
  OP_03,
  OP_04,
  OP_05,
  OP_06,
  OP_07,
  OP_08,
  OP_09,
  OP_10,
  OP_11,
  OP_12,
  OP_13,
  OP_14
];

export const OPERATION_NAME = 'OPERATION SILENTIUM';
export const OPERATION_CELL = 'RESTORATION CELL // FIELD DIRECTIVE RELAY';

export const getChapter = (id: string): DirectiveChapter | undefined =>
  DIRECTIVE_CHAPTERS.find((c) => c.id === id);

export const getDirective = (id: string): Directive | undefined => DIRECTIVES.find((d) => d.id === id);

/** Directives belonging to a chapter, in order. */
export const directivesInChapter = (chapterId: string): Directive[] =>
  DIRECTIVES.filter((d) => d.chapterId === chapterId);
