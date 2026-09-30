// ============================================================================
// FIELD DIRECTIVES — the spine of the case file.
// ----------------------------------------------------------------------------
// Thorne's dead drop does not stop at seven puzzles. It leaves a run of
// instructions: things to open, sections to walk, a sweep to run, bars to
// lift, a safe to turn, a dump to take. The archive watches for those
// observable events (see `lib/puzzles/directives.ts`) and closes each
// directive the moment its steps are done — the operator keeps no notes.
//
// Every directive pays FIELD INTEL: the paragraph, or two, that makes the
// mystery cohere. This file is NARRATIVE CONTENT ONLY; the rules for what
// counts as "done" live in the milestone rules next to each step.
//
// Canon this layer must not contradict:
//   • 1971-04-12  Sedley + Eleanor Cross incorporate Paradigms Systems Ltd.
//   • 1974-09-18  the 14.8 Hz Cambridge baseline is measured.
//   • 1986        Station 07 commissioned (six microbarometers, four geophones).
//   • 1989-11-04  the Descent: Borehole 4, -820m, lift returns empty at 05:14;
//                 at 05:15 every Spitsbergen geophone records a singing voice.
//   • 2019-11-04  Thorne leaves with 48GB; Directive 09 purges him.
//   • 2020-03-12  mirror 15 seized by Agent Kiernan — 211 pulls, 34 internal.
//   • 2025-12-21  Seventh Chamber: Completion fixed at 2026-11-04 04:32 UTC.
//   • 2016→       the chair has not left Grimsel. Directive 01 has no override.
// ============================================================================
import type { ChapterDef, DirectiveDef, FieldIntel, MilestoneDef } from '@/types';

// ---------------------------------------------------------------------------
// THE MILESTONE CATALOGUE
// Only steps listed here can ever enter the ledger.
// ---------------------------------------------------------------------------

export const MILESTONES: MilestoneDef[] = [
  {
    id: 'm-prologue',
    rule: { kind: 'prologue-read' },
    label: "Read Thorne's dead drop",
    nudge: 'The case file opens it for you on the first visit.'
  },
  {
    id: 'm-visit-timeline',
    rule: { kind: 'section-visited', tab: 'timeline' },
    label: 'Walk the Historical Timeline (1971-2026)',
    nudge: 'Sidebar → CONTINUITY & ARCHIVES → Historical Timeline.'
  },
  {
    id: 'm-audio',
    rule: { kind: 'audio-played' },
    label: 'Play one acoustic artifact in the Acoustic Lab',
    nudge: 'Every capture has a transcript; nothing plays until you press play.'
  },
  {
    id: 'm-seal-1',
    rule: { kind: 'seal-broken', sealId: 1 },
    label: 'Break Seal I — The Square of Lead',
    nudge: 'The Sanctum. Restore the square; the constant is the point.'
  },
  {
    id: 'm-record-commission',
    rule: { kind: 'record-opened', recordId: 'doc-006' },
    label: 'Open the Station 07 commissioning log (DOC-1986-SVALBARD-COMMISSION)',
    nudge: 'Level 2 and above: it is the dryest record in the vault. Read it anyway.'
  },
  {
    id: 'm-scan',
    rule: { kind: 'terminal-scan' },
    label: 'Run `scan` in the Terminal',
    nudge: 'Open the terminal with ~ and type: scan'
  },
  {
    id: 'm-fragments-3',
    rule: { kind: 'fragments-collected', atLeast: 3 },
    label: 'Recover 3 Choir Script fragments from the public pages',
    nudge: 'Newsletters, Careers, Timeline, the Pillars, Products, Reports, Dead Links.'
  },
  {
    id: 'm-seal-2',
    rule: { kind: 'seal-broken', sealId: 2 },
    label: 'Break Seal II — The Wheel of Days',
    nudge: 'Trace the week across the inlay, starting from the Sun.'
  },
  {
    id: 'm-descrambler',
    rule: { kind: 'descrambler-engaged' },
    label: 'Engage the Redaction De-Scrambler',
    nudge: 'Press U, or use the eye in the header. Earned at Level 3.'
  },
  {
    id: 'm-seal-3',
    rule: { kind: 'seal-broken', sealId: 3 },
    label: 'Break Seal III — The Scattered Choir',
    nudge: 'Seven fragments spell an inscription. Enter the place it names.'
  },
  {
    id: 'm-seal-4',
    rule: { kind: 'seal-broken', sealId: 4 },
    label: 'Break Seal IV — The Three Voices',
    nudge: 'Three dials, three programmes, one chord.'
  },
  {
    id: 'm-seal-5',
    rule: { kind: 'seal-broken', sealId: 5 },
    label: 'Break Seal V — The Redacted Hymn',
    nudge: 'Open the Hymnal de-scrambled and read down the first letters.'
  },
  {
    id: 'm-safe',
    rule: { kind: 'safe-opened' },
    label: "Open Thorne's whistleblower safe",
    nudge: 'The brass key in the top bar. The wheel gives you the hour.'
  },
  {
    id: 'm-dump',
    rule: { kind: 'download-taken', downloadId: 'palimpsest-master-dump' },
    label: 'Take the whistleblower dump (.JSON)',
    nudge: 'The download button appears inside the open safe.'
  },
  {
    id: 'm-seal-7',
    rule: { kind: 'finale-complete' },
    label: 'Break Seal VII — speak the Name (the Counter-Rite)',
    nudge: 'Six Seal-Words give you the initials. Say it once.'
  }
];

// ---------------------------------------------------------------------------
// FIELD INTEL — what every directive pays
// ---------------------------------------------------------------------------

export const FIELD_INTEL: FieldIntel[] = [
  {
    id: 'intel-01',
    code: 'FIELD INTEL 01',
    title: 'Whoever wrote the dead drop kept a diary',
    paragraphs: [
      "The dead drop is four pages long and every paragraph is dated except the first. Start with what the archive can check: Paradigms Systems Ltd. was incorporated on 12 April 1971 at a solicitor's office on Sidney Street, first-year turnover £14,000, one client and no product. The founding document lists a research programme. Nobody outside the two founders ever read it.",
      'The drop was routed through a 1998 intranet mirror, a 2004 robots.txt exclusion and two dead hyperlinks that our own restoration logs describe as "purged under Directive 17". Every hop in the route sits inside a window when something was being removed. He did not hide the letter. He hid it in the file where the removals are recorded.',
      'So: the sender is not a whistleblower with a folder. He is an archivist with a habit, and the habit is to file things where the destruction is legible.'
    ],
    source: 'Dead drop // archived routing headers, 1998 mirror'
  },
  {
    id: 'intel-02',
    code: 'FIELD INTEL 02',
    title: 'The timeline is a changelog, not a history',
    paragraphs: [
      'Fifty-five years, and three edits that matter. 1971: the charter is amended to strike the research programme from the public text. November 1989: Dr. Arthur Sedley stops being a co-founder who died in a fall and becomes a motor accident in Switzerland, which his family was told on the day of the Descent. 2016: nothing is removed at all — the chair simply stops leaving Grimsel, and every subsequent anniversary note is drafted by the communications desk and signed by nobody.',
      'Each edit lands within seventy-two hours of a signal event: the first measurement, the borehole, the lock-down design. The record is not being tidied. It is being kept in step with something that is still moving.'
    ],
    source: 'Historical Timeline // entries dated 1971, 1989, 2016'
  },
  {
    id: 'intel-03',
    code: 'FIELD INTEL 03',
    title: 'The carrier is below hearing, which is the point',
    paragraphs: [
      'Fourteen point eight hertz is under the floor of human hearing. What you feel at that frequency is not sound; it is a pressure in the chest, a tiredness, a slight nausea on a stairwell. The Order has spent fifty years putting it under cities.',
      'Thorne\'s own capture from Borehole 4 has the line the whole archive turns on: "That is not an echo. An echo comes back. This one is still coming." The spectral notes agree with him — clean peaks at 14.8, 29.6, 59.2 and 312 Hz with almost no noise between them. Ground recordings are never that tidy. This one is being transmitted.',
      'Station 07 was reporting +18.4% above baseline before he ran. The station did not fail. It was told the noise was gas venting, and it wrote that down, because that is what the form asks.'
    ],
    source: 'Acoustic Lab // ART-01-SVALBARD transcript'
  },
  {
    id: 'intel-04',
    code: 'FIELD INTEL 04',
    title: 'The Completion of the Square is a date, not a prophecy',
    paragraphs: [
      'Fifteen is the constant of the square. Fifteen is also where the carrier is going. It reads 14.802 Hz on every status board in this archive; internal telemetry has it at 14.988 and rising through 36 measured months. Predictive Chronology fixes the crossing at 2026-11-04, 04:32 UTC — thirty-seven years to the minute after the lift came back up empty.',
      'Two things in that file should have stopped the programme. The acceleration is not steady; it tracks our own transmit volume with a lag of about nine weeks, which means the carrier is answering us. And the model that produced the date was corrected upward three times, each time by a smaller margin, and the last three corrections were made by the same analyst. That is not forecasting.',
      'They wrote down a schedule, and something underneath agreed to it.'
    ],
    source: 'AIRS Level 5 restricted note // carrier & divergence model'
  },
  {
    id: 'intel-05',
    code: 'FIELD INTEL 05',
    title: 'One paragraph of paperwork, and what it leaves out',
    paragraphs: [
      'The Station 07 commissioning log is a single paragraph: six cryogenic microbarometers, four deep-permafrost geophones, a generator, minus twenty-four degrees, forty-minute telemetry sync. It is the dullest record in the vault and it is the one that explains the borehole.',
      'A permafrost station needs microbarometers to hear weather. It does not need geophones pushed through two hundred metres of ice and rock, and it does not need a shaft. The shaft exists because the 1974 Cambridge baseline was not steady — it was measured at 14.8 and it was already moving, and the only way to find out what moves a frequency under a continent is to go down and listen to the rock that answers it.',
      'Commissioning date 10 November 1986. Two years later Sedley stopped travelling under his own name. Three years after that he went down Borehole 4 and did not come back up.'
    ],
    source: 'DOC-1986-SVALBARD-COMMISSION'
  },
  {
    id: 'intel-06',
    code: 'FIELD INTEL 06',
    title: 'Coupling: 99.94%',
    paragraphs: [
      'The sweep returns twenty-two regional stations phase-locked to the same carrier, a composite planetary coupling index of 99.94%, and one honest number inside the noise: Station 07 still sitting +18.4% above baseline, three years after the man who took the recording left the island.',
      'Then notice what the sweep is describing. Fourteen continuity redoubts, twenty-two acoustic arrays, one hash-synchronised repository: this is not the company infrastructure and the occult network sitting side by side. It is one network with two sets of paperwork. The redoubts are not shelters. They are the ends of the cable.'
    ],
    source: 'Terminal // scan, planetary infrasonic telemetry'
  },
  {
    id: 'intel-07',
    code: 'FIELD INTEL 07',
    title: 'The Order signs its public pages',
    paragraphs: [
      'Initiation in the Ordo Vocis Profundae never hands over the whole alphabet. An initiate gets letters — two or three, on a scrap, in a grid of nine points lifted straight out of the Square of Saturn. It is a security model built for a company: the people who can read the inscriptions are the people who have collected enough of them.',
      "So the fragments are not hidden on the vault floor. They are on the pages nobody in the Order is required to read twice: newsletters, job postings, the founder's five pillars, the recall notices. Each fragment teaches its letters the moment you take it, and they spell one sentence — the sentence cut into the lift door at Borehole 4.",
      'THE CHOIR SINGS BENEATH SVALBARD. It is not a riddle for outsiders. It is a service notice, addressed to whoever happens to look.'
    ],
    source: 'Choir Script fragments // seven public sections'
  },
  {
    id: 'intel-08',
    code: 'FIELD INTEL 08',
    title: 'What Palimpsest covers, and who it is covering',
    paragraphs: [
      "LITURGY. The word on the lobby floor is the word for a public work performed on behalf of something else, and it is also the reason Palimpsest cannot touch the Order's own material: the scrubbers refuse liturgical text by design. Everything else is fair game, and everything else is only ever covered, never deleted. Every black bar in this archive has words underneath it, and now you can read them.",
      'Two covered clauses, side by side. An operational record instructs staff that "unshielded civilians are not exposed to continuous amplitudes exceeding 84dB without prior Compound 88-T dosing". The compound is a proprietary sedative with an olfactory route, and the training modules describe its use as a welfare measure.',
      'So the redactions are not hiding a hazard from the public. They are hiding from the public that they are the ones being dosed.'
    ],
    source: 'De-scrambled operational records // 1980s-2000s'
  },
  {
    id: 'intel-09',
    code: 'FIELD INTEL 09',
    title: 'The lift came back up twice',
    paragraphs: [
      'SVALBARD. The incident record has the times, and the times are worse than the story. 03:14, drill string 4 enters an open void at minus 820 metres, acoustic surge of 134 dB at 14.8 Hz. 04:32, Arthur Sedley goes down alone in the hoist cage against standing orders. The cable parts at minus 740 metres. No remains.',
      'Then the second line, which nobody at head office reads out loud: the cage came back up empty, twice, with the second descent logged at 04:32 and no one in it. At 04:51 the carrier, steady for eighteen years, moved to 14.806. At 05:15 every geophone on Spitsbergen recorded a human voice singing under the signal.',
      'It has not stopped. The void below minus 820 metres is open to a depth they cannot measure, and the company calls its silence a success.'
    ],
    source: 'DOC-1989-SVALBARD-EVENT // DOC-1989-DESCENT-ORPHEUS'
  },
  {
    id: 'intel-10',
    code: 'FIELD INTEL 10',
    title: 'Three programmes, one hymn',
    paragraphs: [
      '14.8 Hz, 432 Hz, 741 Hz. Chime in the school bells, Vesper at eighteen hundred in a thousand transit corridors, and the carrier underneath both. They were never three research programmes with three budget lines. They are three parts of one chord, and the company has been performing it in public, on schedule, to a billion people, since 1978.',
      'The hymn is not an artefact of the sites. The sites are the instrument: the subway tunnels are the pipes, the school bells are the rim, and the deep array at 2,900 kilometres is the thing the Order is measuring its own performance against.'
    ],
    source: 'Programme dossiers // Chime, Vesper, Monolith'
  },
  {
    id: 'intel-11',
    code: 'FIELD INTEL 11',
    title: 'Postojna keeps the original',
    paragraphs: [
      'The reliquary in the karst is not a backup. It is the copy in circulation that gets made to agree with it again — a liturgy has to be remembered exactly, even where the world has to forget it, and that is the difference between lying to a public and lying in a ledger.',
      'The sidebar said it on your first visit: GPC_POSTOJNA_MASTER, hash sync 100%. Which means the record you have been reading all night is the *subordinate* text. When the minutes say that Lin confirmed Postojna holds the synchronised copies and that the originals remain in their own archive, and that this was not her decision to explain, she is telling the meeting something simple: the company does not own the truth. It is holding it.',
      'Keep the word. It is a place, it is a key, and it is where the Order goes to check what it believes.'
    ],
    source: 'Seal V revelation // meeting minutes, repository custody'
  },
  {
    id: 'intel-12',
    code: 'FIELD INTEL 12',
    title: 'Two hundred and eleven',
    paragraphs: [
      'The seizure file for mirror 15 is stamped 12 March 2020, Agent Kiernan. By the time the domain went down the archive had been pulled 211 times. Thirty-four of those came from inside our own network, which the report notes as the part that got people moved between desks.',
      'Here is what the pull log shows that the summary does not. One of the thirty-four is timestamped 23:41 on the night before the seizure, from a terminal registered at Aethelgard-1 — the Grimsel redoubt, twelve hundred metres into granite, where nothing is registered because nobody works there. It pulled exactly one file out of forty-eight gigabytes.',
      "The Seventh Chamber annex. Someone in the deepest room in the company downloaded the whistleblower's copy of their own minutes, on the eve of the seizure, and did not take anything else. Not evidence. A proof-read."
    ],
    source: 'Restoration log // dead link dead-03, pull analysis'
  },
  {
    id: 'intel-13',
    code: 'FIELD INTEL 13',
    title: 'Not evidence. A key list',
    paragraphs: [
      'The dump is 48 gigabytes and almost none of it is a smoking gun. It is a key list: three stations with coordinates and depths, the array count, the disavowed personnel — Sedley in 1989, Thorne in 2019, Wren in 2024 — and one line of text under the Order block: the Completion, dated to the minute, with a note from Thorne reading "Read DOC-1989-DESCENT-ORPHEUS. Then read the seven words aloud."',
      'He never meant this to go to a court. He meant it to go to whoever could still get below ground before November, and he left the instruction in the JSON because a file that survives seizure is a file that was copied first.',
      'You have the key list. What is missing is the seventh word.'
    ],
    source: 'Palimpsest_Whistleblower_Master_Dump.json'
  },
  {
    id: 'intel-14',
    code: 'FIELD INTEL 14',
    title: 'Who is in the Seventh Chamber',
    paragraphs: [
      "Read the attendance sheet again. Six names and a line: the Magistra, Ashby, Holt, Weiss, Adeyemi, Calderon, and Dame Eleanor Cross attending by line from Aethelgard-1. Six chairs in a room built to seven sides, in the deepest redoubt the company owns, above a shaft that has been singing in a missing man's voice since 05:15 on 4 November 1989.",
      'The chair has not left Grimsel since 2016. Every set of minutes since is written in one hand, and it is not hers. The closing line of the winter solstice record is not a decision: "Arthur is nearly at the surface. He is singing so beautifully. Nobody is to say his name." A council does not minute a sentence like that. A séance does.',
      'Which answers the last question. The Seventh Chamber has never been governed by a person. Since 2016 the seventh seat has been occupied by the carrier, and the humans file the minutes it dictates. That is why Directive 01 has no manual override — the override was removed at design stage, in that room, because the thing that triggers the lockdown does not take dictation from people.',
      'You said the name. The lift came up empty. This time it came up with him in it, and the song has stopped.'
    ],
    source: 'DOC-2025-SEVENTH-CHAMBER // Counter-Rite transcript'
  }
];

// ---------------------------------------------------------------------------
// DIRECTIVES — the run of instructions, in order
// ---------------------------------------------------------------------------

export const DIRECTIVES: DirectiveDef[] = [
  {
    id: 'dir-01',
    numeral: '01',
    chapterId: 'ch-1',
    codename: 'THE DEAD DROP',
    brief:
      'Read the letter before you touch anything. If it is real, the archive will disagree with itself in specific places, and I want you to see them.',
    milestones: ['m-prologue'],
    intelId: 'intel-01',
    journal:
      'Directive 01 closed — dead drop read. FIELD INTEL 01 filed: the route, not the letter, is the story.',
    toast: 'Dead drop read. FIELD INTEL 01 filed.'
  },
  {
    id: 'dir-02',
    numeral: '02',
    chapterId: 'ch-1',
    codename: 'THE CHANGELOG',
    brief:
      'Walk the Historical Timeline end to end. Do not read it as history. Read it as a document that has been edited, and count the edits.',
    milestones: ['m-visit-timeline'],
    intelId: 'intel-02',
    journal:
      'Directive 02 closed — timeline walked. FIELD INTEL 02 filed: three edits, each in step with a signal event.',
    toast: 'Timeline walked. FIELD INTEL 02 filed.'
  },
  {
    id: 'dir-03',
    numeral: '03',
    chapterId: 'ch-1',
    codename: 'THE BASEMENT',
    brief:
      'Press play on one capture in the Acoustic Lab. Front to back, with the transcript open. The frequency is the least interesting thing in the room.',
    milestones: ['m-audio'],
    intelId: 'intel-03',
    journal:
      'Directive 03 closed — capture played. FIELD INTEL 03 filed: the carrier is transmitted, not geological.',
    toast: 'Capture played. FIELD INTEL 03 filed.'
  },
  {
    id: 'dir-04',
    numeral: '04',
    chapterId: 'ch-2',
    codename: 'THE SQUARE',
    brief:
      'The first seal is arithmetic. Restore the square — and when you have the constant, look at the carrier readout in the header and tell me you do not get a chill.',
    milestones: ['m-seal-1'],
    intelId: 'intel-04',
    journal:
      'Directive 04 closed — Seal I broken. FIELD INTEL 04 filed: the Completion of the Square, 2026-11-04 04:32 UTC.',
    toast: 'The constant is fifteen, and the carrier is climbing to meet it.'
  },
  {
    id: 'dir-05',
    numeral: '05',
    chapterId: 'ch-2',
    codename: 'ONE PARAGRAPH',
    brief:
      'Open the Station 07 commissioning log. It is dull, it is short, and it explains why there is a shaft in the permafrost at all.',
    milestones: ['m-record-commission'],
    intelId: 'intel-05',
    journal:
      'Directive 05 closed — commissioning log opened. FIELD INTEL 05 filed: geophones on a weather station.',
    toast: 'Commissioning log opened. FIELD INTEL 05 filed.'
  },
  {
    id: 'dir-06',
    numeral: '06',
    chapterId: 'ch-2',
    codename: 'THE SWEEP',
    brief:
      'Open the terminal (~) and run scan. Twenty-two stations, one composite index. Count them against the redoubts in the annual reports.',
    milestones: ['m-scan'],
    intelId: 'intel-06',
    journal:
      'Directive 06 closed — planetary sweep run. FIELD INTEL 06 filed: one network, two sets of paperwork.',
    toast: 'Sweep complete — coupling 99.94%. FIELD INTEL 06 filed.'
  },
  {
    id: 'dir-07',
    numeral: '07',
    chapterId: 'ch-3',
    codename: 'THE PUBLIC FACE',
    brief:
      'Take three of the fragments the Order hid on its own public pages. Nobody inside the company is required to read twice, so nothing gets noticed. That is the whole security model.',
    milestones: ['m-fragments-3'],
    intelId: 'intel-07',
    journal: 'Directive 07 closed — three Choir Script fragments recovered. FIELD INTEL 07 filed.',
    toast: 'Three fragments taken. FIELD INTEL 07 filed.'
  },
  {
    id: 'dir-08',
    numeral: '08',
    chapterId: 'ch-3',
    codename: 'LIFT THE BARS',
    brief:
      'Break Jupiter, then use what it earns you. Turn the De-Scrambler on and read the sentences Palimpsest covered rather than deleted.',
    milestones: ['m-seal-2', 'm-descrambler'],
    intelId: 'intel-08',
    journal: 'Directive 08 closed — de-scrambler engaged. FIELD INTEL 08 filed: who the redactions protect.',
    toast: 'Bars lifted. FIELD INTEL 08 filed.'
  },
  {
    id: 'dir-09',
    numeral: '09',
    chapterId: 'ch-3',
    codename: 'THE DESCENT',
    brief:
      'Mars wants the place the inscription names. Bring the whole Codex with you when you go — you will want to re-read the inscriptions elsewhere in this archive afterwards.',
    milestones: ['m-seal-3'],
    intelId: 'intel-09',
    journal: 'Directive 09 closed — Seal III broken. FIELD INTEL 09 filed: the lift came up twice.',
    toast: 'Seal III broken. FIELD INTEL 09 filed.'
  },
  {
    id: 'dir-10',
    numeral: '10',
    chapterId: 'ch-4',
    codename: 'THE THREE VOICES',
    brief:
      'Tune the Sun Lock to the three voices. Two are programmes in the dossiers. The third has been under Cambridge since before the company existed.',
    milestones: ['m-seal-4'],
    intelId: 'intel-10',
    journal: 'Directive 10 closed — Seal IV broken. FIELD INTEL 10 filed: three programmes, one hymn.',
    toast: 'Seal IV broken. FIELD INTEL 10 filed.'
  },
  {
    id: 'dir-11',
    numeral: '11',
    chapterId: 'ch-4',
    codename: 'THE RELIQUARY',
    brief:
      'Venus is an acrostic in a bad redaction job. Open the Hymnal de-scrambled and read down the left-hand edge of the verses.',
    milestones: ['m-seal-5'],
    intelId: 'intel-11',
    journal: 'Directive 11 closed — Seal V broken. FIELD INTEL 11 filed: Postojna keeps the original.',
    toast: 'Seal V broken. FIELD INTEL 11 filed.'
  },
  {
    id: 'dir-12',
    numeral: '12',
    chapterId: 'ch-4',
    codename: 'THE SAFE',
    brief:
      'Turn the Mercury Wheel with the reliquary word until the courier message reads, then open the safe with the hour it describes. Brass key, top bar.',
    milestones: ['m-safe'],
    intelId: 'intel-12',
    journal: 'Directive 12 closed — the safe is open. FIELD INTEL 12 filed: two hundred and eleven.',
    toast: 'The safe is open. FIELD INTEL 12 filed.'
  },
  {
    id: 'dir-13',
    numeral: '13',
    chapterId: 'ch-4',
    codename: 'THE DUMP',
    brief:
      'Take a copy of everything I have. Download the JSON and keep it somewhere that is not this browser. A file that survives seizure is a file that was copied first.',
    milestones: ['m-dump'],
    intelId: 'intel-13',
    journal: 'Directive 13 closed — the dump is taken. FIELD INTEL 13 filed: not evidence, a key list.',
    toast: 'Dump taken. FIELD INTEL 13 filed.'
  },
  {
    id: 'dir-14',
    numeral: '14',
    chapterId: 'ch-5',
    codename: 'THE NAME',
    brief:
      'Six words, six initials, one name the Order forbids itself to say. Speak it once and finish this.',
    milestones: ['m-seal-7'],
    intelId: 'intel-14',
    journal:
      'Directive 14 closed — the Name was spoken. FIELD INTEL 14 filed: who is in the Seventh Chamber.',
    toast: 'Counter-Rite performed. FIELD INTEL 14 filed.'
  }
];

// ---------------------------------------------------------------------------
// CHAPTERS — five acts; the last one closes the case
// ---------------------------------------------------------------------------

export const CHAPTERS: ChapterDef[] = [
  {
    id: 'ch-1',
    numeral: 'I',
    title: 'THE DEAD DROP',
    subtitle: 'Before you break anything, learn what you are breaking into',
    directiveIds: ['dir-01', 'dir-02', 'dir-03'],
    closing:
      'CHAPTER I COMPLETE — THE DEAD DROP: the case is open, and the archive is already disagreeing with itself. Saturn is waiting.',
    accent: '#22d3ee'
  },
  {
    id: 'ch-2',
    numeral: 'II',
    title: 'THE SQUARE',
    subtitle: 'One constant, one date, twenty-two stations',
    directiveIds: ['dir-04', 'dir-05', 'dir-06'],
    closing:
      'CHAPTER II COMPLETE — THE SQUARE: you have the constant, the date it arrives and the network built to meet it. Mars is next.',
    accent: '#94a3b8'
  },
  {
    id: 'ch-3',
    numeral: 'III',
    title: 'THE PUBLIC FACE',
    subtitle: 'The Order signs the pages nobody reads twice',
    directiveIds: ['dir-07', 'dir-08', 'dir-09'],
    closing:
      'CHAPTER III COMPLETE — THE PUBLIC FACE: the inscriptions read as text now, and Palimpsest covers rather than deletes. Go down where the inscription points.',
    accent: '#f87171'
  },
  {
    id: 'ch-4',
    numeral: 'IV',
    title: 'THE RELIQUARY',
    subtitle: 'The originals are in Slovenia; the safe is the index',
    directiveIds: ['dir-10', 'dir-11', 'dir-12', 'dir-13'],
    closing:
      'CHAPTER IV COMPLETE — THE RELIQUARY: three voices, one hymn, one copy of everything you are holding. Six words are yours.',
    accent: '#c084fc'
  },
  {
    id: 'ch-5',
    numeral: 'V',
    title: 'THE SEVENTH CHAMBER',
    subtitle: 'Six chairs, seven sides, one voice on the line',
    directiveIds: ['dir-14'],
    closing:
      'CHAPTER V COMPLETE — THE SEVENTH CHAMBER: the minutes were dictated, the door was never locked, and the name was the only key. SILENTIUM.',
    accent: '#e2e8f0'
  }
];

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export const getMilestone = (id: string): MilestoneDef | undefined => MILESTONES.find((m) => m.id === id);
export const getDirective = (id: string): DirectiveDef | undefined => DIRECTIVES.find((d) => d.id === id);
export const getIntel = (id: string): FieldIntel | undefined => FIELD_INTEL.find((i) => i.id === id);
export const getChapter = (id: string): ChapterDef | undefined => CHAPTERS.find((c) => c.id === id);
