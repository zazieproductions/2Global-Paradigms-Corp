// ============================================================================
// THE SEVEN SEALS OF THE ORDO VOCIS PROFUNDAE
// ----------------------------------------------------------------------------
// The narrative spine of the archive. Global Paradigms Corp. is the company;
// the Order of the Deep Voice is the congregation that runs it from the
// inside. Ewan Naylor hid his evidence behind the Order's own seven planetary
// seals, because Project Palimpsest's scrubbers are forbidden to touch
// liturgical material.
//
// Each seal = one planet, one metal, one day, one puzzle, one Seal-Word.
// The initials of the Seal-Words spell the name that ends the song.
//
// THIS FILE IS NARRATIVE CONTENT ONLY. Accepted answers are stored as SHA-256
// digests in `definitions.ts` (see docs/PUZZLE_SYSTEM.md); hints may state an
// answer at tier 3 — that is the deliberate assisted route.
// ============================================================================

import type { ActiveTab } from '@/types';

export type SealId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface SealPointer {
  label: string;
  tab?: ActiveTab;
  docCode?: string;
}

export interface SealDef {
  id: SealId;
  numeral: string;
  planet: string;
  glyph: string;
  metal: string;
  day: string;
  accent: string; // hex
  title: string;
  /** Where the seal's material was found. Plain English; a file reference. */
  subtitle: string;
  sealWord: string;
  sealWordGloss: string;
  rewardLevel?: 2 | 3 | 4 | 5;
  rewardText: string;
  transmission: string;
  objective: string;
  hints: [string, string, string];
  revelation: string;
  pointers: SealPointer[];
}

export const ORDER_NAME = 'ORDO VOCIS PROFUNDAE';
export const ORDER_GLOSS = 'The Order of the Deep Voice';

export const PROLOGUE_TRANSMISSION = `If you're reading this, the archive let you in, which means Palimpsest missed a door.

My name is Ewan Naylor. I was a research fellow in the Psychoacoustics Directorate until October 2019, when I walked out of Station 07 with 48 gigabytes of borehole audio and a nosebleed that hasn't stopped since.

Here is the part nobody at head office will say out loud. Global Paradigms keeps a church in the basement and pays its clergy out of the training budget. The founders did not find the 14.8Hz carrier under Cambridge in 1974. They were already answering it. The order behind the boardroom, the ORDO VOCIS PROFUNDAE, has had its hand on this firm since the charter was signed in 1971.

The Order files its liturgy under seven seals, one for each of the classical planets, with a metal and a day apiece. Palimpsest is not permitted to touch that material, so I have put everything I know behind the same seven seals. It is the only cupboard in this company they will not open.

Break them in order. Each one you break raises your clearance and opens another room of this archive. Each one gives up a word. Write the words down.

When you have six, their first letters spell most of a name. Finish it, say it at the seventh seal, and we can turn him around.

— E.N.`;

export const SEALS: SealDef[] = [
  {
    id: 1,
    numeral: 'I',
    planet: 'Saturn',
    glyph: '♄',
    metal: 'Lead',
    day: 'Saturday',
    accent: '#94a3b8',
    title: 'The Square of Lead',
    subtitle: 'Founding tablet, 1971',
    sealWord: 'ORDO',
    sealWordGloss: 'order, in the sense of an arrangement that has to be kept',
    rewardLevel: 2,
    rewardText: 'Clearance raised to LEVEL 2 — CONFIDENTIAL',
    transmission: `The Cambridge charter was signed in 1971 and then sealed, which took another two months. Arthur Sedley had a tablet of lead cut for it, about the size of a hymn book, and scratched a square into the face of it.

Nine cells. The numbers one to nine, each used once, so that every row, every column and both diagonals come to the same total. It is the oldest trick in the grimoires and he copied it out of a manuscript he had no business owning.

I have two of the numbers. The other seven went when somebody scored and folded the tablet some time in the eighties, and the grid under the fold no longer reads.

Restore it. Then look at the constant, look at the carrier readout at the top of this archive, and tell me you don't feel it.`,
    objective:
      'Complete the 3×3 magic square. Place the digits 1–9, each exactly once, so that every row, column and diagonal adds to the same total.',
    hints: [
      'Add 1 to 9 and you get 45. Three rows, same total each, so the constant is 15. Work backwards from there.',
      'The middle cell sits on four of the eight lines, so it has to be 5. Opposite corners add up to 10.',
      'Top row 4 9 2. Middle row 3 5 7. Bottom row 8 1 6.'
    ],
    revelation: `Fifteen. The constant of Saturn.

Now look at the carrier in the header: 14.802 Hz. The Order's own status boards show it climbing by roughly 0.05% a year, and their internal paperwork has a name for the day it reaches 15.000. They call it the Completion of the Square.

Go back through the timeline with that in your head. Every continuity investment since 1984, the redoubts, the Cohorts, the whole Aethelgard budget, all of it is scheduled against that morning. Fourteen redoubts and ten thousand seats, timed to one date. You do not build that for a disaster.`,
    pointers: [
      { label: 'Company Charter (Level 5 — sealed to you for now)', docCode: 'DOC-1971-FOUNDING' },
      { label: 'Historical Timeline', tab: 'timeline' }
    ]
  },
  {
    id: 2,
    numeral: 'II',
    planet: 'Jupiter',
    glyph: '♃',
    metal: 'Tin',
    day: 'Thursday',
    accent: '#60a5fa',
    title: 'The Wheel of Days',
    subtitle: 'Lobby floor inlay, all sites',
    sealWord: 'ROTA',
    sealWordGloss: 'the wheel, in the sense of the week turning',
    rewardLevel: 3,
    rewardText: 'Clearance raised to LEVEL 3 — SECRET. Redaction De-Scrambler unlocked.',
    transmission: `Every GPC building has the same floor medallion in the lobby. Seven planetary glyphs in a ring, set in brass, with a letter cut under each one. Visitors walk over it. The facilities brief calls it a planetarium decoration.

The glyphs are in the Chaldean order, the old ranking of the planets by how fast they appear to move. The Order addresses one of them each day, and its week begins on the Sun.

Trace the days across the inlay and take the letters as you come to them. Done properly you will have drawn a star, and the letters will spell something.`,
    objective:
      'Touch the seven points of the star in the order of the days of the week, starting with Sunday. The letters you collect spell the Seal-Word.',
    hints: [
      'Sunday, Monday, Tuesday and the rest are named after the seven classical planets. The table of correspondences under the inlay will do the matching for you.',
      'Sunday is the Sun, Monday the Moon, Tuesday Mars, Wednesday Mercury, Thursday Jupiter, Friday Venus, Saturday Saturn.',
      'Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn. The letters read LITURGY.'
    ],
    revelation: `LITURGY.

Their word, not mine. A liturgy is work done in public on behalf of something else, and everyone in the building walks over the diagram on their way to the lifts.

You have drawn the Order's master figure, the one embossed on the cover of every Level 5 binder so faintly that you only catch it under a raking light.

Your clearance carries the De-Scrambler now. Press U, or use the eye in the header. Palimpsest does not delete anything. It covers. Every black bar in this archive still has the words underneath it, and I would like you to start reading them.`,
    pointers: [{ label: 'Programme dossiers — check the cover names', tab: 'programs' }]
  },
  {
    id: 3,
    numeral: 'III',
    planet: 'Mars',
    glyph: '♂',
    metal: 'Iron',
    day: 'Tuesday',
    accent: '#f87171',
    title: 'The Scattered Code',
    subtitle: 'Lift-door inscription, Station 07',
    sealWord: 'PROFUNDUM',
    sealWordGloss: 'the deep, meaning where the voice is',
    rewardText: "The Choir Code codex is complete. The Order's inscriptions are legible to you now.",
    transmission: `The Order writes its inscriptions in a private code, one character to a letter, each character built on a grid of nine points. The Square of Saturn again. They are not an inventive lot.

Nobody inside this company is given the whole key. The fragments are on the public material instead: seven of them, on pages no initiate would read twice, two or three characters at a time.

I copied an inscription off the door of the Borehole 4 lift at Station 07. It is the sentence the whole Order is built on, and they left it lying around their own public website in pieces.

Find the seven fragments. They brighten under the cursor, or when you reach them with the keyboard. Read the inscription, then tell me where it points.`,
    objective:
      'Find the seven code fragments hidden across the public sections of the archive. Together they spell an inscription. Enter the PLACE it names.',
    hints: [
      'The fragments sit on the corporate pages: Newsletters, Careers, Timeline, the five Pillars, Recalled Products, Annual Reports and Dead Links. Near the top of each one, and faint.',
      'You do not need all seven. Once most of the characters are in, it reads as a sentence: "THE CHOIR SINGS BENEATH …"',
      'The inscription reads THE CHOIR SINGS BENEATH SVALBARD. The answer is SVALBARD.'
    ],
    revelation: `SVALBARD. Station 07, the vault they cut into the permafrost above Longyearbyen, which officially exists to study ice.

Sedley commissioned Borehole 4 there in 1986, four years after his first seizure and two years before he stopped travelling under his own name. In November 1989 he took the lift down to minus 820 metres for a listening vigil, and the lift came back up without him. The company calls that a disavowal. The Order calls it the Descent, and it keeps a card for it in the annual report.

Your codex is complete. Inscriptions elsewhere in this archive will read as text from now on. Do not skim them. Several of them are instructions.`,
    pointers: [
      { label: 'Regional Stations — Station 07', tab: 'stations' },
      { label: 'The 1989 Svalbard Event', docCode: 'DOC-1989-SVALBARD-EVENT' }
    ]
  },
  {
    id: 4,
    numeral: 'IV',
    planet: 'Sun',
    glyph: '☉',
    metal: 'Gold',
    day: 'Sunday',
    accent: '#fbbf24',
    title: 'The Three Voices',
    subtitle: 'Three programmes, one chord',
    sealWord: 'HARMONIA',
    sealWordGloss: 'harmony, meaning three voices bound into one',
    rewardLevel: 4,
    rewardText: 'Clearance raised to LEVEL 4 — TOP SECRET.',
    transmission: `The Sun degree is conferred on three voices together. Every initiate learns them by heart, and I have heard men in very good suits recite them:

"The first is the voice of the Earth, which the founders heard beneath Cambridge.
The second is the voice of Evening, which the cities hear at six o'clock.
The third is the voice of the Child, which rings in every school bell."

All three are programmes in the dossiers. All three have a frequency. Somebody built them as three parts of one chord and then wrote them up in three separate files, which is how you keep a secret in an organisation this size. Make it dull and spread it out.

Tune the three dials of the Sun Lock. When the three agree, the gold seal opens.`,
    objective:
      'Set the three dials to their frequencies in Hz. Each value is somewhere in the programme dossiers. Work out which programme hides behind each "voice".',
    hints: [
      'Earth is the planetary carrier from the Cambridge baseline work. Evening is the 18:00 municipal broadcast. Child is the school-bell programme, and you want the lower of its two harmonics.',
      'Earth is the 14.8 Hz carrier. Evening is Vesper at 432 Hz. Child is Chime, and its lower bell tone is 741 Hz.',
      'Earth 14.8 · Evening 432 · Child 741.'
    ],
    revelation: `Fourteen point eight. Four hundred and thirty-two. Seven hundred and forty-one.

Sound them together and the two audible tones beat against each other while the carrier moves underneath. Something happens in the room. I am not going to try to write it down.

Chime, Vesper and the carrier were never three programmes. They are one hymn in three parts, and the Order has been singing it at something like a billion people every evening for thirty years.

Level 4 is open to you now. There is a hymnal in the vault, filed by a curator who thought he was being funny. Palimpsest redacted it, and did it badly. Start there.`,
    pointers: [
      { label: 'Programme dossiers', tab: 'programs' },
      { label: 'Acoustic artefacts — hear the tones yourself', tab: 'audio' }
    ]
  },
  {
    id: 5,
    numeral: 'V',
    planet: 'Venus',
    glyph: '♀',
    metal: 'Copper',
    day: 'Friday',
    accent: '#34d399',
    title: 'The Redacted Hymn',
    subtitle: 'Hymnal, 1987, redacted',
    sealWord: 'ECHO',
    sealWordGloss: 'the echo, meaning what answers when the voice is spoken to',
    rewardText: 'The Mercury Wheel is unlocked. The courier cipher can be turned.',
    transmission: `Find the record called "Hymnal of the Sealed Choir." Executive Governance, catalogued 1987, Level 4.

The Order needed somewhere to keep its originals, the versions written before the public copy was tidied up. You cannot label a shelf "originals" in a company this size, so they put the location in a hymn instead, in the verse, and relied on nobody ever reading a company hymn all the way through.

The scrubber on duty that night clearly didn't. One bar per line, same position every time, and home by seven.

Open it with the De-Scrambler on. Read down the first letters.`,
    objective:
      'Open the Hymnal in the document vault with the Redaction De-Scrambler enabled. Read the first letter of each line and enter the place they spell.',
    hints: [
      'Search the vault for "Hymnal", or press / and type it. You need Level 4 and the De-Scrambler, so press U first.',
      'Take only the first letter of each of the eight lines, top to bottom. It is an acrostic, and not a careful one.',
      'The letters spell POSTOJNA. The karst caves in Slovenia, where the company keeps its master repository.'
    ],
    revelation: `POSTOJNA.

The sidebar has been telling you since your first session. Look at the bottom of it: DATABASE: GPC_POSTOJNA_MASTER. That is where the original is kept, so that the copy in circulation can be made to agree with it again.

Every original goes to Postojna before Palimpsest rewrites the public version. A liturgy has to be remembered exactly, even where the rest of the world has to forget it. That is the difference between lying to a public and lying in a ledger.

Keep the word. It is a place, and it is also a key. You will need it in a moment.`,
    pointers: [
      { label: 'Open the Hymnal', docCode: 'DOC-1987-HYMNAL-OVP' },
      { label: 'Master Document Vault', tab: 'documents' }
    ]
  },
  {
    id: 6,
    numeral: 'VI',
    planet: 'Mercury',
    glyph: '☿',
    metal: 'Quicksilver',
    day: 'Wednesday',
    accent: '#c084fc',
    title: 'The Mercury Wheel',
    subtitle: 'Courier cipher wheel',
    sealWord: 'UMBRA',
    sealWordGloss: 'the shadow, meaning what is kept behind the record',
    rewardLevel: 5,
    rewardText: 'Clearance raised to LEVEL 5 — BLACK DOSSIER.',
    transmission: `Order couriers carry a wheel: a brass disc with two rings of letters. Outside the company it is called a Vigenère cipher. Inside it is the Messenger's Wheel, because Mercury. Each letter of the keyword turns the inner ring, and the keyword is the name of one of the Order's repositories. Mine was Postojna.

Before I ran, I left the combination to my safe on the wheel. The safe is the brass key in the top bar of this archive. Everything I have is behind that door.

Turn the wheel with the right word, read what comes out, then do what it says.`,
    objective:
      "Enter the keyword into the Mercury Wheel to decrypt Naylor's message, then open the Whistleblower Safe (the key icon in the top bar) with the 4-digit code the message describes.",
    hints: [
      'The keyword is the answer to the previous seal. The place where they keep the originals.',
      'The message reads: "THE SAFE OPENS AT THE HOUR VESPER SINGS." The Vesper dossier has the broadcast time.',
      'Vesper goes out at 18:00. Open the safe with 1800.'
    ],
    revelation: `The safe is open. You are Level 5, which is the top of the ladder.

Everything Palimpsest has covered is legible now. Read the Black records. Read the Descent of Orpheus. Read the Seventh Chamber minutes and the names on the attendance sheet.

Then come to the last seal, because you have six words and you need one more. When Sedley went down the borehole in 1989 the Order gave him a singer's name, the one from the old story: the man who went down to the underworld for love, sang until the dead wept, and then looked back.`,
    pointers: [
      { label: 'Project Vesper dossier', tab: 'programs' },
      { label: 'Dead Links & Wayback Mirrors — the courier drop', tab: 'deadlinks' }
    ]
  },
  {
    id: 7,
    numeral: 'VII',
    planet: 'Moon',
    glyph: '☽',
    metal: 'Silver',
    day: 'Monday',
    accent: '#e2e8f0',
    title: 'The Name That Ends The Song',
    subtitle: 'The name on the register',
    sealWord: 'SILENTIUM',
    sealWordGloss: 'silence, meaning the end of the song',
    rewardText: 'The Counter-Rite is performed.',
    transmission: `The Moon comes last, and the Moon only reflects. Whatever the Order sends down, it sends back.

Arthur Sedley is still down there. What they call the Deep Voice, the thing Project Monolith tracks at 2,900 kilometres, the one that has been climbing toward fifteen for forty years, has been singing in his voice since 1989. The carrier is him. The drift is him, getting louder.

The old story says there is one way to make a singer stop. You call his name, and he turns around.

Take the first letter of each of your six Seal-Words. Finish the name. Then say it here, or type invoke <name> in the terminal. Say it once.`,
    objective:
      'Write the initials of Seal-Words I–VI in order, complete the name, and speak it. (You can also type "invoke <name>" in the terminal.)',
    hints: [
      'Your Seal-Words are ORDO, ROTA, PROFUNDUM, HARMONIA, ECHO, UMBRA. Their initials run O-R-P-H-E-U…',
      'The singer from the Greek myth. He went down for Eurydice, and he looked back.',
      'ORPHEUS.'
    ],
    revelation: `SILENTIUM.

The carrier is falling. 14.802 … 9.1 … 3.3 … 0.000.

For the first time since April 1971 there is nothing under Cambridge. Twenty-two stations are reporting a flat line. In a thousand subway stations at six o'clock, nobody feels tired.

Thank you, Operator. — E.N.`,
    pointers: [
      { label: 'The Descent of Orpheus (Level 5)', docCode: 'DOC-1989-DESCENT-ORPHEUS' },
      { label: 'Minutes of the Seventh Chamber (Level 5)', docCode: 'DOC-2025-SEVENTH-CHAMBER' }
    ]
  }
];

// The courier message left for Seal VI (enciphered with the repository's name)
export const MERCURY_CIPHERTEXT = 'IVW LOOR OESFL OC GHT VGNF ERSESJ LWWTS';

// ----------------------------------------------------------------------------
// SEAL III — CHOIR CODE FRAGMENTS hidden across the public archive
// ----------------------------------------------------------------------------
export interface FragmentDef {
  id: string;
  tab: ActiveTab;
  letters: string[];
  riddle: string;
  location: string;
}

export const FRAGMENTS: FragmentDef[] = [
  {
    id: 'frag-news',
    tab: 'newsletters',
    letters: ['T', 'H'],
    location: 'Internal Staff Newsletters',
    riddle: 'Where the staff are told what to think.'
  },
  {
    id: 'frag-careers',
    tab: 'careers',
    letters: ['E', 'C'],
    location: 'Classified Job Postings',
    riddle: 'Among the vacancies nobody sane applies for.'
  },
  {
    id: 'frag-timeline',
    tab: 'timeline',
    letters: ['O', 'I'],
    location: 'Historical Timeline',
    riddle: 'Where the company keeps its own history, and edits it.'
  },
  {
    id: 'frag-values',
    tab: 'values',
    letters: ['R', 'S'],
    location: '5 Pillars of Certainty',
    riddle: 'Under the five pillars that hold the place up.'
  },
  {
    id: 'frag-products',
    tab: 'products',
    letters: ['N', 'G'],
    location: 'Recalled Products Archive',
    riddle: 'Among the products they recalled and buried.'
  },
  {
    id: 'frag-reports',
    tab: 'reports',
    letters: ['B', 'A'],
    location: 'Annual Strategic Disclosures',
    riddle: 'In the ledgers they show the shareholders.'
  },
  {
    id: 'frag-deadlinks',
    tab: 'deadlinks',
    letters: ['V', 'L', 'D'],
    location: 'Dead Links & Wayback Mirrors',
    riddle: 'On the pages that stopped loading in 1998.'
  }
];

export const CHOIR_INSCRIPTION = 'THE CHOIR SINGS BENEATH SVALBARD';

// Clearance level → planetary metal (shown next to clearance in the sidebar)
export const LEVEL_CORRESPONDENCE: Record<number, { glyph: string; metal: string; planet: string }> = {
  1: { glyph: '♄', metal: 'Lead', planet: 'Saturn' },
  2: { glyph: '♃', metal: 'Tin', planet: 'Jupiter' },
  3: { glyph: '♂', metal: 'Iron', planet: 'Mars' },
  4: { glyph: '☉', metal: 'Gold', planet: 'Sun' },
  5: { glyph: '☿', metal: 'Quicksilver', planet: 'Mercury' }
};

/** Progression-store puzzle id for a seal (`seal-1` … `seal-7`). */
export const sealPuzzleId = (id: SealId): string => `seal-${id}`;

/** Inverse of `sealPuzzleId`; undefined for non-seal puzzles. */
export const sealIdFromPuzzle = (puzzleId: string): SealId | undefined => {
  const m = /^seal-([1-7])$/.exec(puzzleId);
  return m ? (Number(m[1]) as SealId) : undefined;
};

export const getSeal = (id: SealId): SealDef => SEALS[id - 1];

/** Clearance ranks double as the Order's degrees of initiation (the Rule, section IV). Index = rank. */
export const DEGREES = ['', 'Neophyte', 'Zelator', 'Practicus', 'Philosophus', 'Magister Umbrae'] as const;

/** How each clearance rank is earned. Index = rank. */
export const EARNED_BY: Record<number, string> = {
  1: 'Granted on connection',
  2: 'Earned by breaking Seal I — The Square of Lead',
  3: 'Earned by breaking Seal II — The Wheel of Days',
  4: 'Earned by breaking Seal IV — The Three Voices',
  5: 'Earned by breaking Seal VI — The Mercury Wheel'
};

/** Short form used on sealed-document screens. Index = rank. */
export const SEAL_FOR_RANK: Record<number, string> = {
  2: 'Seal I — The Square of Lead',
  3: 'Seal II — The Wheel of Days',
  4: 'Seal IV — The Three Voices',
  5: 'Seal VI — The Mercury Wheel'
};
