// Global Paradigms Corp. — Signal Chain cipher primitives
// Morse keying, 5×7 dot-matrix glyphs, and the Vigenère (tabula recta) tools
// used by the three linked ARG puzzles in SIGNALS & INTERCEPTS.

// ── MORSE ─────────────────────────────────────────────────────────────────

export const MORSE_TABLE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.'
};

const MORSE_REVERSE: Record<string, string> = Object.entries(MORSE_TABLE).reduce(
  (acc, [letter, code]) => {
    acc[code] = letter;
    return acc;
  },
  {} as Record<string, string>
);

export function morseDecodeLetter(code: string): string | null {
  return MORSE_REVERSE[code] ?? null;
}

export function morseEncodeWord(word: string): string {
  return word
    .toUpperCase()
    .split('')
    .map((ch) => MORSE_TABLE[ch] ?? '')
    .filter(Boolean)
    .join(' ');
}

export interface MorseElement {
  sym: '.' | '-';
  /** seconds from the start of transmission */
  start: number;
  /** seconds of key-down time */
  dur: number;
  /** the letter this element belongs to */
  char: string;
  /** true when this element completes its letter */
  endsLetter: boolean;
}

/**
 * Build a keying timeline for a word at a given speed.
 * Standard timing: dot = 1 unit, dash = 3 units, intra-character gap = 1 unit,
 * inter-character gap = 3 units (PARIS standard, 1 unit = 1.2 / wpm seconds).
 */
export function buildMorseTimeline(text: string, wpm: number): MorseElement[] {
  const unit = 1.2 / Math.max(4, wpm);
  const elements: MorseElement[] = [];
  let t = 0;

  const letters = text
    .toUpperCase()
    .split('')
    .filter((ch) => MORSE_TABLE[ch]);

  letters.forEach((char, li) => {
    const code = MORSE_TABLE[char];
    code.split('').forEach((sym, si) => {
      const isDot = sym === '.';
      elements.push({
        sym: isDot ? '.' : '-',
        start: t,
        dur: isDot ? unit : unit * 3,
        char,
        endsLetter: si === code.length - 1
      });
      t += (isDot ? unit : unit * 3) + unit; // element + intra-character gap
    });
    if (li < letters.length - 1) t += unit * 2; // top up to a 3-unit letter gap
  });

  return elements;
}

/** Total on-air time of a timeline, in seconds. */
export function morseTimelineLength(elements: MorseElement[]): number {
  if (elements.length === 0) return 0;
  const last = elements[elements.length - 1];
  return last.start + last.dur;
}

/** Classify a hand-keyed press length (seconds) at a given speed. */
export function classifyKeyPress(seconds: number, wpm: number): '.' | '-' {
  const unit = 1.2 / Math.max(4, wpm);
  return seconds >= unit * 1.8 ? '-' : '.';
}

// ── 5×7 DOT MATRIX GLYPHS ─────────────────────────────────────────────────

/** Row 0 is the TOP row of the glyph. '#' = lit pixel. */
export const DOT_MATRIX: Record<string, string[]> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.###.', '#...#', '#....', '#.###', '#...#', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  J: ['..###', '...#.', '...#.', '...#.', '...#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#...#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
  '3': ['#####', '...#.', '..#..', '...#.', '....#', '#...#', '.###.'],
  '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '..##.', '..##.'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....']
};

/**
 * Flatten text into waterfall columns.
 * Each returned entry is one time-column: null = silent column, otherwise the
 * list of lit glyph rows (0 = top row of the glyph = highest frequency bin).
 */
export function textToMatrixColumns(
  text: string,
  gapColumns = 1,
  padColumns = 4
): (number[] | null)[] {
  const columns: (number[] | null)[] = [];
  for (let i = 0; i < padColumns; i++) columns.push(null);

  const chars = text.toUpperCase().split('');
  chars.forEach((ch) => {
    const glyph = DOT_MATRIX[ch] ?? DOT_MATRIX[' '];
    for (let c = 0; c < 5; c++) {
      const lit: number[] = [];
      for (let r = 0; r < 7; r++) {
        if (glyph[r]?.[c] === '#') lit.push(r);
      }
      columns.push(lit);
    }
    // one silent column between glyphs so the letters separate on the print
    for (let g = 0; g < gapColumns; g++) columns.push(null);
  });

  for (let i = 0; i < padColumns; i++) columns.push(null);
  return columns;
}

// ── VIGENÈRE (TABULA RECTA) ───────────────────────────────────────────────

export function lettersOnly(text: string): string {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
}

export function vigenereShift(letter: string, keyLetter: string, direction: 1 | -1): string {
  const l = letter.charCodeAt(0) - 65;
  const k = keyLetter.charCodeAt(0) - 65;
  return String.fromCharCode((((l + direction * k) % 26) + 26) % 26 + 65);
}

/** Decrypt A–Z ciphertext with a repeating key (non-letters in the key are ignored). */
export function vigenereDecrypt(cipherLetters: string, key: string): string {
  const cleanKey = lettersOnly(key);
  if (!cleanKey) return cipherLetters;
  let out = '';
  for (let i = 0, k = 0; i < cipherLetters.length; i++) {
    const ch = cipherLetters[i];
    if (ch < 'A' || ch > 'Z') {
      out += ch;
      continue;
    }
    out += vigenereShift(ch, cleanKey[k % cleanKey.length], -1);
    k++;
  }
  return out;
}

/** Encrypt A–Z plaintext with a repeating key. */
export function vigenereEncrypt(plainLetters: string, key: string): string {
  const cleanKey = lettersOnly(key);
  if (!cleanKey) return plainLetters;
  let out = '';
  for (let i = 0, k = 0; i < plainLetters.length; i++) {
    const ch = plainLetters[i];
    if (ch < 'A' || ch > 'Z') {
      out += ch;
      continue;
    }
    out += vigenereShift(ch, cleanKey[k % cleanKey.length], 1);
    k++;
  }
  return out;
}

// ── TRAFFIC LEGIBILITY HEURISTIC ──────────────────────────────────────────

const COMMON_TRIGRAMS = [
  'THE', 'AND', 'ING', 'ION', 'ENT', 'HER', 'FOR', 'THA', 'NTH', 'INT',
  'ERE', 'TIO', 'TER', 'EST', 'ERS', 'ATI', 'HAT', 'ATE', 'ALL', 'ETH',
  'HES', 'VER', 'HIS', 'OFT', 'ITH', 'FTH', 'STH', 'OTH', 'RES', 'ONT',
  'STA', 'EVE', 'RED', 'EAR', 'ORD', 'OVE', 'TWO', 'THO', 'NDS', 'AVE'
];

const COMMON_WORDS = [
  'THE', 'AND', 'STOP', 'WORD', 'TONE', 'HOLD', 'THIS', 'THAT', 'WITH',
  'FROM', 'HAVE', 'BEEN', 'NOT', 'OUR', 'HAS', 'TRAFFIC', 'CARRIER',
  'OPERATION', 'AUTHORISATION', 'RELAY', 'GANDER', 'SPECTRAL', 'PRINT'
];

/**
 * Rough English-plausibility score in 0..1. Used by the decryptor workbench to
 * show how close a candidate key is — it is a heuristic, not a proof.
 */
export function legibilityScore(text: string): number {
  const clean = lettersOnly(text);
  if (clean.length < 3) return 0;

  let triHits = 0;
  for (let i = 0; i < clean.length - 2; i++) {
    if (COMMON_TRIGRAMS.includes(clean.slice(i, i + 3))) triHits++;
  }
  const triRatio = triHits / (clean.length - 2);

  const words = clean.match(/.{1,20}/g) ?? [];
  let wordHits = 0;
  COMMON_WORDS.forEach((w) => {
    if (clean.includes(w)) wordHits++;
  });
  const wordRatio = Math.min(1, wordHits / Math.max(1, words.length / 8));

  return Math.max(0, Math.min(1, triRatio * 2.4 + wordRatio * 0.35));
}
