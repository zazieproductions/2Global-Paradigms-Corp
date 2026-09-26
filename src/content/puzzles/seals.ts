// ============================================================================
// THE SEVEN SEALS OF THE ORDO VOCIS PROFUNDAE
// ----------------------------------------------------------------------------
// The narrative spine of the archive. Global Paradigms Corp. is the exoteric
// shell; the Order of the Deep Voice is the esoteric core. Dr. Aris Thorne hid
// his evidence behind the Order's own seven planetary seals, because Project
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

export const PROLOGUE_TRANSMISSION = `If you are reading this, the archive let you in. That means Palimpsest missed one door.

My name is Dr. Aris Thorne. Until October 2019 I was a Senior Fellow in the Psychoacoustics Directorate. Then I walked out of Station 07 with 48 gigabytes of borehole audio and a nosebleed that has not stopped.

What you are looking at is a company. What it is hiding is a church.

The founders did not "discover" the 14.8 Hz carrier under Cambridge in 1974. They were answering it. Behind the org chart there is an inner order — the ORDO VOCIS PROFUNDAE, the Order of the Deep Voice — and it has steered Global Paradigms since the charter was signed in 1971.

The Order marks its work with seven seals: one for each of the seven old planets, one metal, one day of the week. I hid my evidence behind those same seals, because Palimpsest's scrubbers are forbidden to touch the liturgy.

Break the seals in order. Each one you break will raise your clearance, and the archive will open further. Every seal gives up a word. Keep the words.

When all six words are yours, their first letters will tell you a name. Speak it at the seventh seal, and we can turn him around.

— A.T.`;

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
    sealWordGloss: 'order — the arrangement that must be kept',
    rewardLevel: 2,
    rewardText: 'Clearance raised to LEVEL 2 — CONFIDENTIAL',
    transmission: `The 1971 Cambridge charter was not only signed. It was sealed — pressed into a tablet of lead, and on the lead Vance-Vane scratched a square.

It is the oldest talisman in the Western grimoires: the Kamea of Saturn. Nine cells. The numbers one through nine, each used once. Every row, every column and both diagonals sum to the same constant.

I have recovered two of the numbers. Restore the other seven. Then look at what the constant is — and look at the carrier readout in the header of this archive.`,
    objective:
      'Complete the 3×3 magic square: place the digits 1–9 (each once) so every row, column and diagonal has the same sum.',
    hints: [
      'In any 3×3 square using 1–9, all eight lines share the same sum. Add 1 through 9 (=45) and divide across the three rows.',
      'Each line sums to 15. The centre cell sits on four lines at once — in every such square it must be 5. Opposite corners pair to 10.',
      'Top row: 4 · 9 · 2. Middle row: 3 · 5 · 7. Bottom row: 8 · 1 · 6.'
    ],
    revelation: `Fifteen. Saturn's constant.

The carrier reads 14.802 Hz, and the Order's own status boards show it drifting upward at 0.05% a year. Their internal liturgy calls the day it reaches 15.000 "the Completion of the Square."

Look at the Timeline and the Annual Reports with that in mind. Every "continuity" investment since 1984 — the Aethelgard redoubts, the Heritage Cohort — is timed to that arrival. They are not preparing for a disaster. They are preparing for a service.`,
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
    sealWordGloss: 'the wheel — the week that turns inside the star',
    rewardLevel: 3,
    rewardText: 'Clearance raised to LEVEL 3 — SECRET. Redaction De-Scrambler unlocked.',
    transmission: `Every GPC facility has the same floor inlay in its lobby: seven planetary glyphs in a circle. Visitors assume it is décor.

The glyphs sit in the Chaldean order — the ancient ranking of the planets by apparent speed, slowest to fastest. The Order rehearses one voice each day, and its liturgical week begins on the day of the Sun.

Trace the Choir's week across the inlay, point by point. The letters under each glyph will speak. If you trace it correctly, you will find you have drawn a star.`,
    objective:
      "Click the seven points of the heptagram in the order of the days of the week, starting with Sunday. The letters you collect spell the Seal-Word's key.",
    hints: [
      'The seven days of the week are named after the seven classical planets. Use the Table of Correspondences to match glyphs to planets.',
      'Sunday = Sun ☉, Monday = Moon ☽, Tuesday = Mars ♂ (French "mardi"), Wednesday = Mercury ☿ ("mercredi"), Thursday = Jupiter ♃ ("jeudi"), Friday = Venus ♀ ("vendredi"), Saturday = Saturn ♄.',
      'Trace ☉ → ☽ → ♂ → ☿ → ♃ → ♀ → ♄. The letters spell LITURGY.'
    ],
    revelation: `LITURGY. The corporation is a liturgy — a public work performed on behalf of something.

The heptagram you just drew is the Order's master sigil. It is on the cover of every Level 5 binder, embossed so lightly you can only see it under raking light.

Your clearance is now high enough to run the Redaction De-Scrambler. Press U, or use the eye in the header. Palimpsest never deletes — it only covers. Everything under the black bars is still there.`,
    pointers: [{ label: 'Project Dossiers — note which ones have "choir" cover names', tab: 'programs' }]
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
    transmission: `The Order writes in its own alphabet — the Choir Script. Each glyph is drawn on a grid of nine points, the Square of Saturn again.

No one inside GPC ever holds the whole key. Instead, fragments are hidden in plain sight on the public-facing materials, where the uninitiated will never look twice: seven fragments, each teaching two or three letters.

I have transcribed an inscription from the door of the Borehole 4 lift at Station 07. Find the seven fragments — they glow faintly when you hover over them, or when you reach them with the keyboard — and read what the door says. Tell me where it points.`,
    objective:
      'Find the 7 hidden sigil-fragments scattered across the public archive sections. Each one teaches glyphs of the Choir Script. Decode the inscription and enter the PLACE it names.',
    hints: [
      'The fragments are in the corporate, public-facing sections: Newsletters, Careers, Timeline, the 5 Pillars, Recalled Products, Annual Reports and Dead Links. Look near the top of each page for a faint glyph.',
      'You do not need every fragment. Once most letters are revealed, the inscription reads like a sentence: "THE CHOIR SINGS BENEATH …"',
      'The inscription reads THE CHOIR SINGS BENEATH SVALBARD. The answer is SVALBARD.'
    ],
    revelation: `SVALBARD. Station 07, the Spitsbergen Permafrost Vault.

Vance-Vane commissioned it in 1986. In November 1989 he rode the Borehole 4 lift down to -820 metres for a "listening vigil." The lift came back up empty. The official record calls it a disavowal. The Order calls it the Descent.

Your Codex is complete. From now on, when you see the Choir Script elsewhere in the archive, you can read it.`,
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
    transmission: `The Order's rite of the Sun requires three voices sounded together. Every initiate learns them as a catechism:

"The first is the voice of the Earth, which the founders heard beneath Cambridge.
The second is the voice of Evening, which the cities hear at six o'clock.
The third is the voice of the Child, which rings in every school bell."

Each of those voices is a project in the dossiers, and each has a frequency. Tune the three dials of the Sun Lock. When all three voices agree, the gold seal opens.`,
    objective:
      'Set the three dials to the correct frequencies (Hz). The values are in the Project Dossiers and research papers — find the project behind each "voice."',
    hints: [
      'Earth → the 1974 Cambridge baseline / Project Boreas. Evening → the project that broadcasts at 18:00. Child → the project that tunes institutional school bells.',
      "Earth = the planetary carrier. Evening = Project Vesper's musical-pitch carrier. Child = the LOWER of Project Chime's bell harmonic pair.",
      'Earth 14.8 Hz · Evening 432 Hz · Child 741 Hz.'
    ],
    revelation: `14.8, 432, 741. The Harmonia Triplex.

Played together, the two audible tones beat against each other while the carrier trembles beneath them. The Order believes this chord is a greeting. Project Vesper, Project Chime and the carrier itself were never separate programs. They are three parts of one hymn, sung every evening into a billion ears.

Level 4 is open. There is a hymnal in the vault. Palimpsest redacted it — lazily.`,
    pointers: [
      { label: 'Project Dossiers', tab: 'programs' },
      { label: 'Acoustic Artifacts & Synth — try the tones yourself', tab: 'audio' }
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
    rewardText: "The Mercury Wheel is unlocked. The courier's cipher can now be turned.",
    transmission: `Find the record titled "Hymnal of the Sealed Choir." It is Level 4, catalogued under Executive Governance in 1987.

The Order hid the location of its reliquary — the place where every original, unscrubbed record is kept — inside the hymn itself. Palimpsest's operator on shift that night did the minimum: one bar per line, always at the same position.

Open it with the De-Scrambler on. The Order always hides the truth at the head of the verse.`,
    objective:
      'Open the Hymnal document in the Master Document Vault with the Redaction De-Scrambler enabled. Read the first letter of each line. Enter the place it spells.',
    hints: [
      'Search the vault for "Hymnal" (press /). You need Level 4 and the De-Scrambler (press U).',
      'Read only the FIRST LETTER of each of the eight lines of the hymn, top to bottom. It is an acrostic.',
      "The letters spell POSTOJNA — the Slovenian caves that house GPC's master repository."
    ],
    revelation: `POSTOJNA. The karst caves in Slovenia. The sidebar has been telling you the whole time: DATABASE: GPC_POSTOJNA_MASTER.

It is not a data centre. It is a reliquary. The Order keeps every original record there before Palimpsest rewrites the public copy — because a liturgy must be remembered exactly, even when the world must forget it.

Keep that word. It is also a key.`,
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
    transmission: `Mercury is the messenger. The Order's couriers carry their instructions enciphered on a brass wheel — what the rest of the world calls a Vigenère cipher. The keyword changes with each courier. Mine was the name of the reliquary.

Before I ran, I left the combination to my safe in this archive enciphered on the wheel. The safe is the brass key in the top bar of this archive. What is inside it is everything.

Turn the wheel with the right key and do what the message says.`,
    objective:
      "Enter the keyword into the Mercury Wheel to decrypt Thorne's message. Then open the Whistleblower Safe (the key icon in the top bar) with the 4-digit code it describes.",
    hints: [
      'The keyword is the answer to the previous seal (the name of the reliquary).',
      'Decrypted: "THE SAFE OPENS AT THE HOUR VESPER SINGS." Check the Project Vesper dossier for its daily broadcast time.',
      'Vesper broadcasts at 18:00. Open the safe with 1800.'
    ],
    revelation: `The safe is open. You are Level 5 — Black Dossier.

Everything Palimpsest hid is readable now. Read the Black records. Read "The Descent of Orpheus." Read the Seventh Chamber minutes.

Then come to the last seal. You have six words. The Order gave Vance-Vane a singer's name when he went down — the one from the old story, who descended for love, sang the dead to tears, and looked back.`,
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
    transmission: `The Moon is the last seal because the Moon is the mirror. Everything the Order sends down, the Moon sends back.

Arthur Vance-Vane is still down there. What the Order calls the Deep Voice — the thing at 2,900 km that Project Monolith tracks — has been singing with his voice since 1989. The carrier is his. The drift toward fifteen is him, climbing.

There is one thing the old story says will make a singer stop. Call him by his name, and he turns around.

Take the first letter of each of your six Seal-Words. Finish the name. Speak it here, or in the terminal: invoke <name>.`,
    objective:
      'Write the initials of Seal-Words I–VI in order, complete the name, and speak it. (You can also type "invoke <name>" in the terminal.)',
    hints: [
      'Your Seal-Words are ORDO, ROTA, PROFUNDUM, HARMONIA, ECHO, UMBRA. Their initials are O-R-P-H-E-U…',
      'The singer of Greek myth who went down into the underworld to retrieve Eurydice, and looked back.',
      'ORPHEUS.'
    ],
    revelation: `SILENTIUM.

The carrier is falling. 14.802 … 9.1 … 3.3 … 0.000.

For the first time since April 1971, there is nothing under Cambridge. Twenty-two stations report a flat line. In a thousand subway stations at six o'clock, nobody feels tired.

Thank you, Operator. — A.T.`,
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
