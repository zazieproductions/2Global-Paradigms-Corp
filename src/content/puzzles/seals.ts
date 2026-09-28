// ============================================================================
// THE SEVEN SEALS OF THE ORDO VOCIS PROFUNDAE
// ----------------------------------------------------------------------------
// The narrative spine of the archive. Global Paradigms Corp. is the exoteric
// shell; the Order of the Deep Voice is the esoteric core. Ewan Thorne hid his
// evidence behind the Order's own seven planetary seals, because Project
// Palimpsest's scrubbers are forbidden to touch liturgical material.
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

My name is Ewan Thorne. I was a research fellow in the Psychoacoustics Directorate until October 2019, when I walked out of Station 07 with 48 gigabytes of borehole audio and a nosebleed that hasn't stopped since.

Here is the part nobody at head office will say out loud. Global Paradigms keeps a church in the basement and pays its clergy out of the training budget. The founders did not discover the 14.8Hz carrier under Cambridge in 1974. They were already answering it, and the order behind the boardroom — the ORDO VOCIS PROFUNDAE — has been steering this firm since the charter was signed in 1971.

The Order files its work under seven seals: seven planets, seven metals, seven days. I have put what I know behind the same seven seals, because Palimpsest's scrubbers will not touch the liturgy. It is the only hiding place they respect.

Break them in order. Each one you break raises your clearance and opens another room of this archive. Each one gives up a word. Write the words down.

When you have six, their first letters will give you a name. Say that name at the seventh seal, and we can turn him around.

— E.T.`;

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
    subtitle: 'Kamea Saturni',
    sealWord: 'ORDO',
    sealWordGloss: 'order — the arrangement that has to be kept',
    rewardLevel: 2,
    rewardText: 'Clearance raised to LEVEL 2 — CONFIDENTIAL',
    transmission: `The Cambridge charter was not only signed in 1971. It was sealed. Arthur Sedley had a tablet of lead cut for the purpose, roughly the size of a hymn book, and on it he scratched a square.

Nine cells. The numbers one to nine, each used once. Every row, every column, both diagonals — the same total. It is the oldest trick in the Western grimoires and he lifted it whole out of a manuscript he had no business owning.

I have two of the numbers from the tablet. The other seven are gone; the lead was scored and folded at some point in the eighties and the rest of the grid is illegible under the fold.

Restore the square. Then look at what the constant is, and look at the carrier readout at the top of this archive, and tell me you don't get a chill.`,
    objective:
      'Complete the 3×3 magic square. Place the digits 1–9, each exactly once, so every row, column and diagonal comes to the same total.',
    hints: [
      'Add 1 to 9 and you get 45. Three rows, same total each. That is your constant. Work backwards from it.',
      'The constant is 15. In any square of this kind the middle cell sits on four of the eight lines, so it has to be 5. Opposite corners mirror each other to 10.',
      'Top row 4 9 2. Middle row 3 5 7. Bottom row 8 1 6.'
    ],
    revelation: `Fifteen. The constant of Saturn.

Now look at the carrier in the header: 14.802 Hz. The Order's own status boards show it climbing at about 0.05% a year, and the internal liturgy has a name for the day it reaches 15.000 — the Completion of the Square.

Go back through the timeline with that in your head. Every continuity investment since 1984, the redoubts, the Cohorts, all of it, is scheduled against that arrival. They are not getting ready for a disaster. They are getting ready for a service.`,
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
    subtitle: 'Heptagramma Chaldaeorum',
    sealWord: 'ROTA',
    sealWordGloss: 'the wheel — the week turning inside the star',
    rewardLevel: 3,
    rewardText: 'Clearance raised to LEVEL 3 — SECRET. Redaction De-Scrambler unlocked.',
    transmission: `Every GPC building has the same floor inlay in the lobby. Seven planetary glyphs in a ring, set in brass, with a letter under each one. Visitors walk over it and think it is a planetarium decoration, which is what the facilities brief calls it.

The glyphs are in the Chaldean order — the old ranking of the planets by how fast they appear to move. The Order sings to one of them each day, and its week starts on the Sun.

Trace the week across the inlay. Take the letters in the order you touch them. If you do it right you will have drawn a star, and the letters will be a word.`,
    objective:
      'Click the seven points of the heptagram in the order of the days of the week, beginning with Sunday. The letters you collect spell the Seal-Word.',
    hints: [
      'Sunday, Monday, Tuesday and so on are named after the seven classical planets. The table of correspondences under the inlay will do the matching for you.',
      'Sunday is the Sun. Monday is the Moon. Tuesday is Mars, Wednesday Mercury, Thursday Jupiter, Friday Venus, Saturday Saturn.',
      'Run it Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn. The letters come out LITURGY.'
    ],
    revelation: `LITURGY.

That is the word for what this is, and I did not pick it. A liturgy is a public work performed on behalf of something else. Everyone in the building walks over the sigil on their way to the lifts.

You have drawn the Order's master sigil. It is on the cover of every Level 5 binder, embossed so lightly that you only see it under a raking light.

Your clearance will carry the De-Scrambler now. Press U, or use the eye in the header. Palimpsest does not delete anything. It covers. Every black bar in this archive still has the words underneath it, and I would like you to start reading them.`,
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
    title: 'The Scattered Choir',
    subtitle: 'Scriptura Chori',
    sealWord: 'PROFUNDUM',
    sealWordGloss: 'the deep — where the voice is',
    rewardText: "The Choir Script Codex is complete. The Order's inscriptions are now legible to you.",
    transmission: `The Order writes in its own alphabet, the Choir Script. Every glyph sits on a grid of nine points — the Square of Saturn again, they are incapable of inventing anything new.

Nobody inside this company is ever given the whole key. The fragments are hidden in plain sight on the public material instead: seven of them, on pages no initiate would bother to read twice, teaching two or three letters each.

I copied an inscription off the door of the Borehole 4 lift at Station 07. It is the sentence the whole Order is built on, and it is sitting on their own public website in pieces.

Find the seven fragments. They show themselves if you hover, or if you reach them with the keyboard. Read the inscription, and tell me where it points.`,
    objective:
      'Find the 7 sigil-fragments hidden across the public sections of the archive. Together they spell an inscription. Enter the PLACE it names.',
    hints: [
      'The fragments sit on the corporate pages: Newsletters, Careers, Timeline, the five Pillars, Recalled Products, Annual Reports and Dead Links. Look near the top of each one, for a faint glyph.',
      'You do not need all seven. Once most of the letters are in, it reads like a sentence: "THE CHOIR SINGS BENEATH …"',
      'The inscription reads THE CHOIR SINGS BENEATH SVALBARD. The answer is SVALBARD.'
    ],
    revelation: `SVALBARD. Station 07. The vault they cut into the permafrost above Longyearbyen, which officially exists to study ice.

Sedley commissioned the borehole at Station 07 in 1986, four years after his first seizure and two years before he stopped travelling under his own name. In November 1989 he took the Borehole 4 lift down to minus 820 metres for a listening vigil and the lift came back up without him. The company calls that a disavowal. The Order calls it the Descent, and it keeps a card in the annual report for it.

Your Codex is complete — Choir Script elsewhere in this archive will read as text from now on. Do not skim those inscriptions. Several of them are instructions.`,
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
    subtitle: 'Harmonia Triplex',
    sealWord: 'HARMONIA',
    sealWordGloss: 'harmony — three voices bound into one',
    rewardLevel: 4,
    rewardText: 'Clearance raised to LEVEL 4 — TOP SECRET.',
    transmission: `The rite of the Sun wants three voices together. Every initiate learns them as a catechism, and I have heard it recited by men in very good suits:

"The first is the voice of the Earth, which the founders heard beneath Cambridge.
The second is the voice of Evening, which the cities hear at six o'clock.
The third is the voice of the Child, which rings in every school bell."

All three are programmes in the dossiers. All three have a frequency. Somebody in this company built them as three parts of one chord and then wrote it down in the paperwork in three separate places, because that is how you keep a secret in an organisation this size: you make it boring and you spread it out.

Tune the three dials of the Sun Lock. When the three agree the gold seal opens.`,
    objective:
      'Set the three dials to the correct frequencies in Hz. Each value is in the dossiers and the research papers — find the programme behind each "voice".',
    hints: [
      'Earth is the planetary carrier from the Cambridge baseline work. Evening is the 18:00 municipal broadcast. Child is the school-bell programme, and you want the lower of its two harmonics.',
      'Earth is the 14.8 Hz carrier. Evening is Vesper at 432 Hz. Child is Chime, and the lower bell tone is 741 Hz.',
      'Earth 14.8 · Evening 432 · Child 741.'
    ],
    revelation: `Fourteen point eight. Four hundred and thirty-two. Seven hundred and forty-one.

Play them together and the two audible tones beat against each other while the carrier moves underneath, and something happens in the room that I am not going to describe in writing. Chime, Vesper and the carrier were never three programmes. They are one hymn with three parts, and the Order has been singing it at a billion people every evening for thirty years.

Level 4 is open to you now. There is a hymnal in the vault — literally, a book of hymns, filed by a curator who thought he was being funny. Palimpsest redacted it, and badly. Start there.`,
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
    subtitle: 'Hymnus Obscuratus',
    sealWord: 'ECHO',
    sealWordGloss: 'the echo — what answers when the voice is spoken to',
    rewardText: 'The Mercury Wheel is unlocked. The courier cipher can now be turned.',
    transmission: `Find the record called "Hymnal of the Sealed Choir." Executive Governance, catalogued 1987, Level 4.

The Order needed somewhere to keep its originals — the unscrubbed versions of things, the ones written before the public copy was tidied. Obviously you cannot label a shelf "originals" in a company this size. So they put the location of the reliquary in a hymn, in the verse, and trusted that no outsider would ever read a company hymn all the way through.

The scrubber on duty that night clearly didn't. One bar per line, same position every time, and home by seven.

Open it with the De-Scrambler on. Read down the first letters.`,
    objective:
      'Open the Hymnal in the document vault with the Redaction De-Scrambler enabled. Read the first letter of each line and enter the place they spell.',
    hints: [
      'Search the vault for "Hymnal" — press / to search. You need Level 4 and the De-Scrambler, so press U first.',
      'Read only the first letter of each of the eight lines of the hymn, top to bottom. It is an acrostic, and a lazy one.',
      'The letters spell POSTOJNA. The karst caves in Slovenia where the company keeps its master repository.'
    ],
    revelation: `POSTOJNA.

The sidebar has been telling you since your first session. Look at the bottom of it: DATABASE: GPC_POSTOJNA_MASTER. Not a backup site. A reliquary, in the old sense of the word: the place the original is kept so that the copy in circulation can be made to agree with it again.

The Order keeps every original at Postojna before Palimpsest rewrites the public version. A liturgy has to be remembered exactly, even where the world has to forget it, and this is the difference between lying to a public and lying in a ledger.

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
    subtitle: 'Rota Mercurii',
    sealWord: 'UMBRA',
    sealWordGloss: 'the shadow — what is kept behind the record',
    rewardLevel: 5,
    rewardText: 'Clearance raised to LEVEL 5 — BLACK DOSSIER.',
    transmission: `Mercury is the messenger, so the Order gives its couriers a wheel — a brass disc with two rings of letters, which the rest of the world calls a Vigenère cipher and the Order calls the Wheel of the Messenger. The keyword changes with every courier. Mine is the name of the reliquary.

Before I ran, I left the combination to my safe on the wheel. The safe is the brass key in the top bar of this archive. Everything I have is behind that door.

Turn the wheel with the right word, read what it says, and do what it tells you.`,
    objective:
      "Enter the keyword into the Mercury Wheel to decrypt Thorne's message, then open the Whistleblower Safe (the key icon in the top bar) with the 4-digit code the message describes.",
    hints: [
      'The keyword is the answer to the previous seal. The name of the reliquary.',
      'The message decodes as: "THE SAFE OPENS AT THE HOUR VESPER SINGS." The Vesper dossier has the broadcast time.',
      'Vesper broadcasts at 18:00. Open the safe with 1800.'
    ],
    revelation: `The safe is open. You are Level 5, which is as high as the ladder goes.

Everything Palimpsest has been covering is legible now. Read the Black records. Read the Descent of Orpheus. Read the Seventh Chamber minutes and the names on the attendance sheet.

Then come to the last seal, because you have six words and you need one more. When Sedley went down the borehole in 1989 the Order gave him a singer's name — the one from the old story, who went down to the underworld for love, sang the dead into tears, and looked back.`,
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
    subtitle: 'Nomen Silentii',
    sealWord: 'SILENTIUM',
    sealWordGloss: 'silence — the end of the song',
    rewardText: 'The Counter-Rite is performed.',
    transmission: `The Moon is last because the Moon is the mirror. Whatever the Order sends down comes back up.

Arthur Sedley is still down there. What they call the Deep Voice — the thing Project Monolith tracks at 2,900 kilometres, the one that has been drifting toward fifteen for forty years — has been singing in his voice since 1989. The carrier is his. The drift is him, climbing.

The old story has one thing to say about making a singer stop. You call him by his name, and he turns around.

Take the first letter of each of your six Seal-Words. Finish the name. Then say it here, or in the terminal: invoke <name>. Say it once.`,
    objective:
      'Write the initials of Seal-Words I–VI in order, complete the name, and speak it. (You can also type "invoke <name>" in the terminal.)',
    hints: [
      'Your Seal-Words are ORDO, ROTA, PROFUNDUM, HARMONIA, ECHO, UMBRA. Their initials are O-R-P-H-E-U…',
      'The singer from the Greek myth. He went down for Eurydice, and he looked back.',
      'ORPHEUS.'
    ],
    revelation: `SILENTIUM.

The carrier is falling. 14.802 … 9.1 … 3.3 … 0.000.

For the first time since April 1971 there is nothing under Cambridge. Twenty-two stations are reporting a flat line. In a thousand subway stations at six o'clock, nobody feels tired.

Thank you, Operator. — E.T.`,
    pointers: [
      { label: 'The Descent of Orpheus (Level 5)', docCode: 'DOC-1989-DESCENT-ORPHEUS' },
      { label: 'Minutes of the Seventh Chamber (Level 5)', docCode: 'DOC-2025-SEVENTH-CHAMBER' }
    ]
  }
];

// The courier message left for Seal VI (enciphered with the reliquary's name)
export const MERCURY_CIPHERTEXT = 'IVW LOOR OESFL OC GHT VGNF ERSESJ LWWTS';

// ----------------------------------------------------------------------------
// SEAL III — CHOIR SCRIPT FRAGMENTS hidden across the public archive
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
    riddle: 'Where the staff gossip, the Order signs its name.'
  },
  {
    id: 'frag-careers',
    tab: 'careers',
    letters: ['E', 'C'],
    location: 'Classified Job Postings',
    riddle: 'Among the positions no sane person should apply for.'
  },
  {
    id: 'frag-timeline',
    tab: 'timeline',
    letters: ['O', 'I'],
    location: 'Historical Timeline',
    riddle: 'Where history is kept in order — and rewritten.'
  },
  {
    id: 'frag-values',
    tab: 'values',
    letters: ['R', 'S'],
    location: '5 Pillars of Certainty',
    riddle: 'Beneath the five pillars that hold up the lie.'
  },
  {
    id: 'frag-products',
    tab: 'products',
    letters: ['N', 'G'],
    location: 'Recalled Products Archive',
    riddle: 'Among the things they buried in salt.'
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
    riddle: 'Where dead pages still whisper.'
  }
];

export const CHOIR_INSCRIPTION = 'THE CHOIR SINGS BENEATH SVALBARD';

// Clearance level → planetary metal (used for occult badges)
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

/** Clearance ranks double as the Order's degrees of initiation (Liber Carrier §IV). Index = rank. */
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
