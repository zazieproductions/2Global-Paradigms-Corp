/**
 * Puzzle & progression models.
 *
 * Puzzle definitions live in `src/content/puzzles`. Validation logic lives in
 * `src/lib/puzzles`. Components never compare answers themselves — they call
 * `validatePuzzleAnswer()` and render the result.
 */
import type { ClearanceLevel, RecordRef } from './records';

/** Normalisation steps applied to player input before hashing. Order matters. */
export type NormalizeStep = 'trim' | 'lowercase' | 'collapse-spaces' | 'strip-spaces';

/**
 * How an answer is checked.
 *
 * - `sha256`: client-side. Only SHA-256 digests of the normalised answers ship
 *   in the bundle, so answers are not greppable in plain text. This is a
 *   spoiler-deterrent, NOT security — see docs/PUZZLE_SYSTEM.md.
 * - `server`: reserved for a future serverless endpoint. Not used by the
 *   current static deployment.
 */
export type AnswerValidation =
  | { method: 'sha256'; normalize: NormalizeStep[]; digests: string[] }
  | { method: 'server'; endpoint: string };

/** Where a clue can be found. */
export type ClueLocation =
  { type: 'record'; ref: RecordRef } | { type: 'route'; path: string } | { type: 'ui'; label: string };

export interface Clue {
  id: string;
  /** In-world pointer the hint system can reference. */
  text: string;
  location: ClueLocation;
}

export type HintTier = 1 | 2 | 3;

export interface Hint {
  tier: HintTier;
  label: string;
  text: string;
  /** Revealing this hint marks any later completion as "assisted". */
  revealsAnswer?: boolean;
}

export type UnlockCondition =
  | { type: 'always' }
  | { type: 'puzzle-completed'; puzzleId: string }
  | { type: 'record-discovered'; recordId: string };

export type PuzzleReward =
  | { type: 'clearance'; level: ClearanceLevel }
  | { type: 'unredact' }
  | { type: 'route'; path: string }
  | { type: 'download'; id: string }
  | { type: 'record'; recordId: string };

/** UI surface that hosts the puzzle input. */
export type PuzzleSurface = 'boot-sequence' | 'terminal' | 'palimpsest-safe' | 'clearance-profiler';

export interface PuzzleDefinition {
  id: string;
  title: string;
  /** In-world framing shown near the input. */
  narrative: string;
  surface: PuzzleSurface;
  clues: Clue[];
  validation: AnswerValidation;
  /** Progressive hints, ascending tier. The last tier may reveal the answer. */
  hints: Hint[];
  success: { heading: string; body: string };
  /** Accessible, no-shame path that completes the puzzle without the answer. */
  bypass?: { label: string; description: string };
  rewards: PuzzleReward[];
  /** Conditions before the puzzle is offered. Defaults to always available. */
  requires?: UnlockCondition[];
}

export type CompletionMethod = 'answer' | 'bypass';

export interface PuzzleCompletion {
  at: string;
  method: CompletionMethod;
  /** True if a bypass was used or an answer-revealing hint had been opened. */
  assisted: boolean;
}

/** What the operator may currently see. */
export interface AccessState {
  clearance: ClearanceLevel;
  /** Redaction de-scrambler on/off. */
  unredacted: boolean;
}

export interface Preferences {
  crt: boolean;
  sound: boolean;
}

/** Persisted player progression. Bump `version` when the shape changes. */
export interface ProgressionState {
  version: 1;
  callsign: string;
  /** recordId → ISO timestamp of first discovery. */
  discovered: Record<string, string>;
  completed: Record<string, PuzzleCompletion>;
  /** puzzleId → highest hint tier revealed. */
  hintsRevealed: Record<string, number>;
  unlockedRoutes: string[];
  unlockedDownloads: string[];
  access: AccessState;
  preferences: Preferences;
}

export type ValidationResult =
  | { ok: true; puzzleId: string }
  | { ok: false; puzzleId: string; reason: 'incorrect' | 'empty' | 'unknown-puzzle' | 'unavailable' };
