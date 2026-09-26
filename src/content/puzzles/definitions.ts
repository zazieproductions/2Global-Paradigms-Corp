import type { Clue, PuzzleDefinition, PuzzleReward, PuzzleSurface } from '@/types';
import { DOCUMENTS } from '@/content/documents';
import { SEALS, sealPuzzleId, type SealDef, type SealId } from './seals';

/**
 * ARG puzzle definitions.
 *
 * ANSWERS ARE NEVER STORED HERE IN PLAIN TEXT. `digests` holds SHA-256 hashes
 * of each accepted answer after the listed `normalize` steps. Generate one with:
 *
 *   npm run puzzle:digest -- -n alnum-upper "your answer"
 *
 * Tier-3 hints may state an answer outright — that is the deliberate assisted
 * route, and opening it marks the completion as "assisted".
 * See docs/PUZZLE_SYSTEM.md before adding or editing a puzzle.
 *
 * Two chains live here:
 *  - THE SEVEN SEALS (`seal-1` … `seal-7`) — the main investigation. Narrative
 *    lives in `seals.ts`; clearance is EARNED only through these.
 *  - GATEWAY TRANSMISSION (`gateway-*`) — a guided beginner trail. It opens
 *    the case file but can never raise clearance.
 */

/** Seal answer digests (normalised with `alnum-upper`). */
const SEAL_DIGESTS: Record<SealId, string[]> = {
  // Seal I: the nine cells of the square, row by row.
  1: ['6cb844f906c350939c31fafe7807295abf1028f0cd54e89fe4107d465a2f6574'],
  2: ['7b159589ee17e67deb9d966558c768d520d3dad0fd5c4735f14fe367e8a4b843'],
  3: ['b4b509c92f7439244a6ca3bbb01e5fcbcf0278d65f5c787227c09e3344a2a830'],
  // Seal IV: the three dial values joined with `|`.
  4: ['04177b11ed18ff0f4fa33b74e9e1ac823c488355fc923d709dd1e80f32ed1897'],
  5: ['de1f7613d4da464f19ee81219f1d990bad6d9508ed48be2f84b346a0d0279125'],
  // Seal VI: the Whistleblower Safe combination.
  6: ['e49ec846db7527df7ff483009fe61700e6435072c8c5b551ab08f0a13fc45a07'],
  7: ['6cd91639e54781dd790d1cccdb9dabe2094bc1fb9cebaee9ce02e8556958113e']
};

const SURFACE: Record<SealId, PuzzleSurface> = {
  1: 'sanctum',
  2: 'sanctum',
  3: 'sanctum',
  4: 'sanctum',
  5: 'document-viewer',
  6: 'palimpsest-safe',
  7: 'sanctum'
};

const docIdForCode = (code: string) => DOCUMENTS.find((d) => d.code === code)?.id;

function sealClues(seal: SealDef): Clue[] {
  return seal.pointers.map((p, i): Clue => {
    const id = `seal-${seal.id}-clue-${i + 1}`;
    if (p.docCode) {
      const docId = docIdForCode(p.docCode);
      return docId
        ? { id, text: p.label, location: { type: 'record', ref: { kind: 'document', id: docId } } }
        : { id, text: p.label, location: { type: 'ui', label: p.docCode } };
    }
    if (p.tab) return { id, text: p.label, location: { type: 'route', path: `/${p.tab}` } };
    return { id, text: p.label, location: { type: 'ui', label: p.label } };
  });
}

function sealRewards(seal: SealDef): PuzzleReward[] {
  const rewards: PuzzleReward[] = [];
  if (seal.rewardLevel) {
    const level = (
      {
        2: 'Level 2 - Confidential',
        3: 'Level 3 - Secret',
        4: 'Level 4 - Top Secret',
        5: 'Level 5 - Black Dossier'
      } as const
    )[seal.rewardLevel];
    rewards.push({ type: 'clearance', level });
  }
  if (seal.id === 6) {
    // Thorne's safe: the de-scrambler switches on and the leak dump is released.
    rewards.push({ type: 'unredact' }, { type: 'download', id: 'palimpsest-master-dump' });
  }
  return rewards;
}

const SEAL_PUZZLES: PuzzleDefinition[] = SEALS.map((seal) => ({
  id: sealPuzzleId(seal.id),
  title: `Seal ${seal.numeral} — ${seal.title}`,
  narrative: seal.objective,
  surface: SURFACE[seal.id],
  clues: sealClues(seal),
  validation: { method: 'sha256', normalize: ['alnum-upper'], digests: SEAL_DIGESTS[seal.id] },
  hints: [
    { tier: 1, label: 'ASK THORNE', text: seal.hints[0] },
    { tier: 2, label: 'ASK AGAIN', text: seal.hints[1] },
    { tier: 3, label: 'TELL ME', text: seal.hints[2], revealsAnswer: true }
  ],
  success: { heading: `SEAL ${seal.numeral} BROKEN — ${seal.sealWord}`, body: seal.rewardText },
  rewards: sealRewards(seal),
  requires:
    seal.id === 1
      ? undefined
      : [{ type: 'puzzle-completed', puzzleId: sealPuzzleId((seal.id - 1) as SealId) }],
  journal: `Seal ${seal.numeral} (${seal.planet} ${seal.glyph}) broken — Seal-Word recovered: ${seal.sealWord}. ${seal.rewardText}`
}));

const GATEWAY_PUZZLES: PuzzleDefinition[] = [
  {
    id: 'gateway-sequence',
    title: 'Gateway Transmission — The Vesper Sequence',
    narrative:
      'Six iron rungs were re-hung out of order after a fire. Hang them by the years they were installed.',
    surface: 'gateway-transmission',
    clues: [
      {
        id: 'gateway-rungs',
        text: 'Every rung still wears its installation year (1971–1976).',
        location: { type: 'ui', label: 'Gateway Transmission — mausoleum marquee' }
      }
    ],
    validation: {
      method: 'sha256',
      normalize: ['alnum-upper'],
      digests: [
        '541faadc96241a28cdb6792e04a91b16805c05307727605f65d41af370964651',
        'c90eee318972e73cbb50f9978f30364a42f8f99425a0aed621dac7666e82974d'
      ]
    },
    hints: [
      {
        tier: 1,
        label: 'FIELD NOTES',
        text: 'Put the years in increasing order and read their letters; the scorched plate is still legible.'
      },
      { tier: 3, label: 'REVEAL', text: 'VESPAR', revealsAnswer: true }
    ],
    success: { heading: '✓ VESPER SEQUENCE ACCEPTED', body: 'MARQUEE RE-HUNG // SIGNAL RELAY OPENING…' },
    rewards: []
  },
  {
    id: 'gateway-signal',
    title: 'Gateway Transmission — The Signal',
    narrative: 'Six devices dialled the carrier in sequence. Chain their badges in tap order.',
    surface: 'gateway-transmission',
    clues: [
      {
        id: 'gateway-voices',
        text: 'Each device remembers only its own place in the queue.',
        location: { type: 'ui', label: 'Gateway Transmission — voice logs' }
      }
    ],
    validation: {
      method: 'sha256',
      normalize: ['alnum-upper'],
      digests: ['2eb0ba6ad3b5f45a4441fc5dfa1ca1496cf34ca42789b981e4fbfb2ed4136708']
    },
    hints: [
      {
        tier: 1,
        label: 'FIELD NOTES',
        text: 'Wake every badge and read each voice. They will tell you “I tapped first…” through “…sixth.”'
      },
      { tier: 3, label: 'REVEAL', text: '987316', revealsAnswer: true }
    ],
    success: { heading: '✓ SIGNAL INTERPRETED', body: 'CARRIER UNLOCKED // WAVEFORM DECODING…' },
    rewards: [],
    requires: [{ type: 'puzzle-completed', puzzleId: 'gateway-sequence' }]
  },
  {
    id: 'gateway-waveform',
    title: 'Gateway Transmission — The Waveform',
    narrative: 'Four lattice rows carry exactly one carrier pulse. Wire them to the ledger, top to bottom.',
    surface: 'gateway-transmission',
    clues: [
      {
        id: 'gateway-lattice',
        text: 'Live rows have exactly one carrier pulse (+).',
        location: { type: 'ui', label: 'Gateway Transmission — carrier lattice' }
      }
    ],
    validation: {
      method: 'sha256',
      normalize: ['alnum-upper'],
      digests: ['9f842867a9a08b928696c6ee282ddf9f679d5522fede1495529c44ac86e8348b']
    },
    hints: [
      {
        tier: 1,
        label: 'FIELD NOTES',
        text: 'Live rows = exactly one pulse: H1, H2, H3, H4. Read their ledger glyphs top to bottom.'
      },
      { tier: 3, label: 'REVEAL', text: 'COLD', revealsAnswer: true }
    ],
    success: { heading: '✓ WAVEFORM UNDERSTOOD', body: 'GATE INTERLOCK OPENING — FINAL VERIFICATION…' },
    rewards: [],
    requires: [{ type: 'puzzle-completed', puzzleId: 'gateway-signal' }]
  },
  {
    id: 'gateway-transmission',
    title: 'Gateway Transmission — The Gate',
    narrative: 'The interlock console re-asks all three keys, joined in order.',
    surface: 'gateway-transmission',
    clues: [],
    validation: {
      method: 'sha256',
      normalize: ['alnum-upper'],
      digests: [
        'bf0b3172e5b2ab712eea4cec9110b2054e8f86101f98ba8c5273d07cc41b4478',
        '5579e43d6294e7c1a2954069e270a6e9f25c793ddd5f33e4ae3b9cc82c73acce'
      ]
    },
    hints: [
      {
        tier: 1,
        label: 'REMIND ME',
        text: 'Nothing new is asked here: re-enter the keys you already kept — sequence, signal, waveform — in that order.'
      }
    ],
    success: {
      heading: 'ORIGIN PROTOCOL',
      body: 'Three keys kept: VESPAR · 987316 · COLD. The case file is open — begin with Saturn.'
    },
    // Deliberately no clearance: only the seals raise it.
    rewards: [],
    requires: [{ type: 'puzzle-completed', puzzleId: 'gateway-waveform' }],
    journal: 'Gateway Transmission solved: VESPAR · 987316 · COLD. The well is open — the Seven Seals await.'
  }
];

export const PUZZLES: PuzzleDefinition[] = [...SEAL_PUZZLES, ...GATEWAY_PUZZLES];
