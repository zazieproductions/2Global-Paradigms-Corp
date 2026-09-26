// ============================================================================
// ARG PUZZLE — "GATEWAY TRANSMISSION"
// ----------------------------------------------------------------------------
// A beginner-grade, guided sequence that starts the moment the Cold Boot
// Terminal hands off to the archive and rewards the player with an
// "impressive-looking" payoff screen.
//
//   STEP A  Cold Boot Terminal → a static-laced "FIRST CONTACT" transmission
//           interrupts the boot log (Auto-answer recommended; prank / hang-up
//           just re-open it from the top header).
//
//   STEP B  THE VESPER SEQUENCE  Six iron rungs were re-hung out of order
//           after a fire, but every rung still wears its installation year
//           (1971–1976).  Hung chronologically they spell the six-letter
//           founders name: V E S P A R.
//
//   STEP C  THE SIGNAL  Six devices dialled the carrier in sequence. Each
//           badge is a digit and each voice remembers ONLY its own place in
//           the queue.  Chain the badges in tap order: 9 → 8 → 7 → 3 → 1 → 6.
//
//   STEP D  THE WAVEFORM  The carrier lattice hides four "live" rows with
//           exactly one pulse. Wire those rows to the casket-hedge ledger
//           (top to bottom) → C O L D.
//
//   STEP E  THE GATE  an interlock console re-asks all three answers:
//           VESPAR · 987316 · COLD.  Success raises clearance to Level 5,
//           forces the redaction de-scrambler, unlocks Thorne's safe code and
//           issues a signed "ORIGIN PROTOCOL" transmission with a downloadable
//           evidence artifact.
// ============================================================================

import { ClearanceLevel } from '../types';

/** The three answers, in presentation order. Never rendered on the page. */
export const PUZZLE_KEY = 'VESPAR';
export const PUZZLE_SIGNAL = '987316';
export const PUZZLE_WAVEFORM = 'COLD';

/** Executive override / Thorne master key, referenced across the app lore. */
export const MASTER_KEY_CODE = '432-88';

/** Accept loosely: case-insensitive and unicode-insensitive. */
export const norm = (s: string) => s.trim().toUpperCase();

/** Valid "vesper sequence" submissions — tolerates spelling variations. */
export const isValidVesperSequence = (raw: string) => {
  const v = norm(raw);
  return v === 'VESPAR' || v === 'VESPER';
};

/** Valid signal submissions — 6 digits with optional whitespace/dashes. */
export const isValidSignal = (raw: string) => {
  const v = norm(raw).replace(/[\s-]/g, '');
  return v === '987316';
};

/** Valid waveform submissions. */
export const isValidWaveform = (raw: string) => norm(raw) === 'COLD';

/** Terminal kernel order the player is shown in the marquee captions. */
export type StepId = 'contact' | 'sequence' | 'signal' | 'waveform' | 'gate';

// ----------------------------------------------------------------------------
// Marquee: six iron rungs hung out of order after the fire. Each carries an
// intact year-plate. One rung (R, 1976) was scorched but its plate survives.
// Hung chronologically, the sequence reads V E S P A R — the founding name.
// (Cataclysmic records spell the same name VESPER; both are accepted.)
// ----------------------------------------------------------------------------
export interface RungUnit {
  id: string;
  letter: string;
  year: number;
  burnt?: boolean;
}

export const RUNGS: RungUnit[] = [
  { id: 'v', letter: 'V', year: 1971 },
  { id: 'e', letter: 'E', year: 1972 },
  { id: 's', letter: 'S', year: 1973 },
  { id: 'p', letter: 'P', year: 1974 },
  { id: 'a', letter: 'A', year: 1975 },
  { id: 'r', letter: 'R', year: 1976, burnt: true }
];

/** The scrambled order the rungs were haphazardly re-hung after the fire. */
export const RUNG_DISPLAY_ORDER: string[] = ['p', 'a', 'v', 'r', 's', 'e'];

/** Flavour voice-lines per rung (each whispers its installation year). */
export const RUNG_VOICES: Record<string, string> = {
  v: 'first hung, 1971. I held the gate before the fire.',
  e: 'hung 1972. I used to hum in the wind.',
  s: 'hung 1973. I remember the season the glass broke.',
  p: 'hung 1974. They read me twice a day now.',
  a: 'hung 1975. The last rung to still answer.',
  r: 'hung 1976 — they tried to burn my name off. It never took.'
};


// ----------------------------------------------------------------------------
// The Signal — six devices dialled the carrier one after another. Each badge
// is a digit; each voice remembers only its OWN place in the queue. Read the
// badges in tap order → 9 8 7 3 1 6.
// ----------------------------------------------------------------------------
export interface SignalDevice {
  id: string; // badge digit (the code fragment)
  model: string; // short device identity
  recollection: string; // remembers its tap position (first…sixth)
}

export const SIGNAL_DEVICES: SignalDevice[] = [
  {
    id: '9',
    model: 'RESON-8 // HARMONIC GENERATOR',
    recollection: 'They call me Nine. The little sleep box that sang its owners awake. I tapped first.'
  },
  {
    id: '8',
    model: 'VESPERTONE // HVAC MODULATOR',
    recollection: 'The building hummed until everyone inside agreed. I tapped second.'
  },
  {
    id: '7',
    model: 'OMNISCAN MK IV // TRAFFIC MONITOR',
    recollection: 'I heard the old man on the avenue before he landed. I tapped third.'
  },
  {
    id: '3',
    model: 'UNIT 300 // EMERGENCY BROADCAST',
    recollection: 'I was rehearsed for the morning that never arrived. I tapped fourth.'
  },
  {
    id: '1',
    model: 'EC-6 // EMERGENCY CONSOLE',
    recollection: 'I was built for the 603-foot descent that never came. I tapped fifth.'
  },
  {
    id: '6',
    model: 'CHRONOFORECAST // PREDICTIVE TERMINAL',
    recollection: 'I knew Tuesday would fall. I printed it three times. I tapped sixth.'
  }
];

/** Screen order (shuffled so the tap order must be reconstructed). */
export const SIGNAL_DISPLAY_ORDER: string[] = ['7', '1', '9', '6', '8', '3'];

/** Badge digits in the correct tap order — the answer. */
export const SIGNAL_TAP_ORDER = ['9', '8', '7', '3', '1', '6'];

// ----------------------------------------------------------------------------
// The Waveform — the recovered carrier lattice, 8 rows × 8 slots.
//   + (2) = carrier pulse,  × (1) = reverb echo.
// Rows 1→8 contain carriers at columns 5, 3, 2, 1 — exactly the four
// "hedge rows" the ledger cites. Everything else is just waveform noise.
// ----------------------------------------------------------------------------
export interface WaveRow {
  label: string; // H1..H8
  cells: (0 | 1 | 2)[]; // 0 = none, 1 = echo ×, 2 = carrier +
}

// Rows H1–H4 each carry a single carrier (+) — at descending columns 5, 3, 2, 1.
// Rows H5–H6 are dense noise; H7–H8 are silent.
export const WAVE_ROWS: WaveRow[] = [
  { label: 'H1', cells: [0, 0, 0, 0, 2, 0, 0, 1] }, // lone carrier @ col 5
  { label: 'H2', cells: [0, 0, 2, 0, 0, 1, 0, 0] }, // lone carrier @ col 3
  { label: 'H3', cells: [0, 2, 0, 0, 0, 0, 1, 0] }, // lone carrier @ col 2
  { label: 'H4', cells: [2, 0, 0, 0, 1, 0, 0, 0] }, // lone carrier @ col 1
  { label: 'H5', cells: [1, 2, 2, 0, 2, 1, 0, 1] }, // noise row (3 carriers)
  { label: 'H6', cells: [0, 1, 0, 2, 2, 0, 1, 1] }, // noise row (2 carriers)
  { label: 'H7', cells: [0, 0, 0, 0, 0, 0, 0, 0] },
  { label: 'H8', cells: [0, 0, 0, 0, 0, 0, 0, 0] }
];

export const HEDGE_KEYS = [
  { rank: 1, glyph: 'C' },
  { rank: 2, glyph: 'O' },
  { rank: 3, glyph: 'L' },
  { rank: 4, glyph: 'D' }
];


// ----------------------------------------------------------------------------
// First-contact transmission fragments — injected as a glitch during the boot
// log. They are allusions, not answers.
// ----------------------------------------------------------------------------
export const FIRST_CONTACT_TEMPLATES: string[] = [
  'F 9 SCAN 01',
  'F 16 | EC-6 | 603 MORE FEET — YOU WERE TOO LATE. — T',
  'F 25 VESPER 17 VESPER 12 VESPER 14',
  'F 39 FORECAST 02',
  'F 41 F 41 FOUR TIMES F 41 — TRUST NO ONE',
  'F 50 OMNI 6 OMNI 6',
  'F 58 STAGE 62 120 DB . . . SILENCE',
  'F 63 PALIMPSEST — TIMESTAMP 04:32',
  'F 71 RESON8 12 RESON8 11',
  'F 77 L WHERE ARE YOU — THORNE'
];

// ----------------------------------------------------------------------------
// Success payload — self-signed "ORIGIN PROTOCOL" transmission.
// ----------------------------------------------------------------------------
export interface OriginPayload {
  protocol: string;
  authority: string;
  classification: ClearanceLevel;
  authenticity: string;
  keychain: { directive: string; accepted: boolean }[];
  unlocked: string[];
  note: string;
}

export const ORIGIN_PAYLOAD: OriginPayload = {
  protocol: 'ORIGIN PROTOCOL — GATEWAY TRANSMISSION',
  authority: 'DAME ELEANOR CROSS // MASTER KEY 01',
  classification: 'Level 2 - Confidential',
  authenticity: 'ACKNOWLEDGED // THE ORDER TAKES NOTE',
  keychain: [
    { directive: 'THE VESPER SEQUENCE', accepted: true },
    { directive: 'THE SIGNAL', accepted: true },
    { directive: 'THE WAVEFORM', accepted: true }
  ],
  unlocked: [
    'CASE FILE OPENED — THE SEVEN SEALS (SIDEBAR, TOP)',
    'THREE KEYS KEPT: VESPAR · 987316 · COLD',
    'TERMINAL & WHISTLEBLOWER SAFE — YOUR INVESTIGATION TOOLS',
    'MASTER KEY 432-88 IS REVOKED — CLEARANCE IS EARNED BY THE SEALS'
  ],
  note: 'THE ARCHIVE REMEMBERS. IT WAS NEVER MEANT TO FORGET.'
};
