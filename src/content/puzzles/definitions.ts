import type { PuzzleDefinition } from '@/types';
import { DOCUMENTS } from '@/content/documents';

/**
 * ARG puzzle definitions.
 *
 * ANSWERS ARE NEVER STORED HERE IN PLAIN TEXT. `digests` holds SHA-256 hashes
 * of each accepted answer after the listed `normalize` steps. Generate one with:
 *
 *   npm run puzzle:digest -- "your answer"
 *
 * Tier-3 hints may state an answer outright — that is the deliberate assisted
 * route, and opening it marks the completion as "assisted".
 * See docs/PUZZLE_SYSTEM.md before adding or editing a puzzle.
 */
export const PUZZLES: PuzzleDefinition[] = [
  {
    id: 'palimpsest-safe',
    title: 'Palimpsest Cryptographic Safe',
    narrative:
      "Enter Dr. Aris Thorne's 4-digit authorization sequence to decrypt all Level 5 Black Dossiers and disable corporate redaction masks.",
    surface: 'palimpsest-safe',
    clues: [
      {
        id: 'carrier-readout',
        text: 'The planetary carrier readout in the archive header never stops repeating its number.',
        location: { type: 'ui', label: 'Top bar — PLANETARY CARRIER' }
      },
      {
        id: 'baseline-paper',
        text: 'The 1974 Cambridge baseline paper names the frequency to three decimal places.',
        location: { type: 'record', ref: { kind: 'document', id: 'doc-002' } }
      },
      {
        id: 'station-07-event',
        text: 'Station 07 went dark in a year the company would rather forget.',
        location: { type: 'record', ref: { kind: 'document', id: 'doc-007' } }
      }
    ],
    validation: {
      method: 'sha256',
      normalize: ['trim'],
      digests: [
        '22b954454cfc20ef4813c70018c81004795496191338841e0ca4b9ed6e04e81a',
        '9113b98df80f877c7a2ee5d865a04c9514b4e9bf25a49d315b0b15f115d2f0d2',
        '93759af6f455b1610e615483cf5ea847b0b7248055c16be328c9f292d8695a9c',
        'e2628662818f57a41c342653ab5abacba7be97c3dacf6af99a6a0799212902ed'
      ]
    },
    hints: [
      {
        tier: 1,
        label: 'NUDGE',
        text: 'Thorne chose numbers the archive cannot stop repeating. Watch the carrier readout in the header.'
      },
      {
        tier: 2,
        label: 'POINTER',
        text: 'Four digits: the carrier frequency with the decimal point removed — or the year Station 07 went dark (see DOC-1989-SVALBARD-EVENT).'
      },
      {
        tier: 3,
        label: 'ARG LORE HINT',
        text: 'The planetary carrier frequency (14.8Hz = 1480), founding breach year (1989), or Solfeggio carrier (0432).',
        revealsAnswer: true
      }
    ],
    success: {
      heading: 'CRYPTOGRAPHIC BYPASS SUCCESSFUL',
      body: `You have authenticated as PALIMPSEST_OBSERVER. Clearance elevated to LEVEL 5 - BLACK DOSSIER. All ${DOCUMENTS.length} documents are now permanently de-scrambled.`
    },
    bypass: {
      label: 'REQUEST ASSISTED DECRYPTION',
      description:
        'Skip the keypad and open the safe with restoration-team credentials. Your progress will be marked as assisted.'
    },
    rewards: [
      { type: 'clearance', level: 'Level 5 - Black Dossier' },
      { type: 'unredact' },
      { type: 'download', id: 'palimpsest-master-dump' }
    ]
  },
  {
    id: 'executive-master-key',
    title: 'Executive Master Key Authorization',
    narrative: 'Level 5 requires the executive master key code (or a terminal override).',
    surface: 'clearance-profiler',
    clues: [
      {
        id: 'cross-master-key',
        text: 'Dame Eleanor Cross holds Master Key 01. Her personnel notes are worth reading.',
        location: { type: 'record', ref: { kind: 'personnel', id: 'p-002' } }
      },
      {
        id: 'founder',
        text: 'The founder who vanished at Station 07 left his surname on everything.',
        location: { type: 'record', ref: { kind: 'document', id: 'doc-001' } }
      }
    ],
    validation: {
      method: 'sha256',
      normalize: ['trim', 'lowercase'],
      digests: [
        '22b954454cfc20ef4813c70018c81004795496191338841e0ca4b9ed6e04e81a',
        'da507b76f23ff80465530c4e48954b5e14c95532ee93add17e3ffec55ecd667e',
        '0a5cec0b348b57fed596878cf03760d9475f3d2a84e62c61bf139945cea9389f',
        '9113b98df80f877c7a2ee5d865a04c9514b4e9bf25a49d315b0b15f115d2f0d2',
        '7c43ed48929b891f893a8e8bca0265d2d46f2507d374944ceb9bcd174466101f'
      ]
    },
    hints: [
      {
        tier: 1,
        label: 'NUDGE',
        text: 'Executives reuse what they know: frequencies, project names, founders.'
      },
      {
        tier: 2,
        label: 'POINTER',
        text: "Try the name of the leak-counter project, or the founding director's surname."
      },
      {
        tier: 3,
        label: 'ASSISTED ROUTE',
        text: 'Accepted master keys include 1480, 1989, 432-88, palimpsest and vance.',
        revealsAnswer: true
      }
    ],
    success: {
      heading: 'MASTER KEY AUTHENTICATED',
      body: 'MASTER KEY AUTHENTICATED: LEVEL 5 BLACK CLEARANCE GRANTED'
    },
    bypass: {
      label: 'USE RESTORATION CREDENTIALS',
      description: 'Grant Level 5 without the key. Your progress will be marked as assisted.'
    },
    rewards: [{ type: 'clearance', level: 'Level 5 - Black Dossier' }, { type: 'unredact' }]
  },
  {
    id: 'terminal-override',
    title: 'Terminal Supervisor Override',
    narrative: 'Legacy supervisor override on the GPC://CLI backdoor. Usage: override <code>',
    surface: 'terminal',
    clues: [
      {
        id: 'backdoor-email',
        text: 'Systems staff warned TOPN that the terminal still accepts a legacy override.',
        location: { type: 'record', ref: { kind: 'email', id: 'eml-14' } }
      }
    ],
    validation: {
      method: 'sha256',
      normalize: ['trim', 'lowercase'],
      digests: [
        'da507b76f23ff80465530c4e48954b5e14c95532ee93add17e3ffec55ecd667e',
        '22b954454cfc20ef4813c70018c81004795496191338841e0ca4b9ed6e04e81a',
        '0a5cec0b348b57fed596878cf03760d9475f3d2a84e62c61bf139945cea9389f'
      ]
    },
    hints: [
      {
        tier: 1,
        label: 'NUDGE',
        text: 'Someone in Systems complained about this backdoor by email. Check the communications archive.'
      },
      {
        tier: 2,
        label: 'POINTER',
        text: 'Read EML-2024-TERMINAL-BACKDOOR in Emails & Meeting Minutes.'
      },
      {
        tier: 3,
        label: 'ASSISTED ROUTE',
        text: 'Type: override 432-88',
        revealsAnswer: true
      }
    ],
    success: {
      heading: '*** EXECUTIVE OVERRIDE ACCEPTED ***',
      body: 'AUTHORITY: DAME ELEANOR CROSS // MASTER KEY 01'
    },
    rewards: [{ type: 'clearance', level: 'Level 5 - Black Dossier' }, { type: 'unredact' }]
  },
  {
    id: 'boot-override',
    title: 'Channel 9 Executive Override',
    narrative:
      'While the cold boot runs, a hidden Channel 9 listener accepts typed directives. Executive codes grant Level 5 on session init.',
    surface: 'boot-sequence',
    clues: [
      {
        id: 'ch9-help',
        text: 'Type "help" during the boot sequence to list Channel 9 directives.',
        location: { type: 'ui', label: 'Cold boot terminal — CH9 LISTENING' }
      }
    ],
    validation: {
      method: 'sha256',
      normalize: ['trim', 'lowercase'],
      digests: [
        'da507b76f23ff80465530c4e48954b5e14c95532ee93add17e3ffec55ecd667e',
        '22b954454cfc20ef4813c70018c81004795496191338841e0ca4b9ed6e04e81a',
        '93759af6f455b1610e615483cf5ea847b0b7248055c16be328c9f292d8695a9c'
      ]
    },
    hints: [
      { tier: 1, label: 'NUDGE', text: 'The boot log is listening. Type "help" while it runs.' },
      {
        tier: 3,
        label: 'ASSISTED ROUTE',
        text: 'Executive override codes: 432-88 | 1480 | 0432',
        revealsAnswer: true
      }
    ],
    success: {
      heading: '*** EXECUTIVE OVERRIDE ACCEPTED ***',
      body: 'LEVEL 5 — BLACK DOSSIER WILL BE GRANTED ON SESSION INIT.'
    },
    rewards: [{ type: 'clearance', level: 'Level 5 - Black Dossier' }, { type: 'unredact' }]
  }
];
