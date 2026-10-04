/**
 * Puzzle validation — pure functions, no React, no storage.
 *
 * Components hand raw player input to `validatePuzzleAnswer()` and render the
 * result. Answers are compared as SHA-256 digests of the normalised input, so
 * no accepted answer appears as a plain string literal in the bundle.
 */
import type {
  NormalizeStep,
  ProgressionState,
  PuzzleDefinition,
  UnlockCondition,
  ValidationResult
} from '@/types';
import { PUZZLES } from '@/content';
import { PUZZLE_SETTINGS } from '@/config/puzzles';
import { sha256Hex } from '@/lib/utils/sha256';

const PUZZLES_BY_ID = new Map(PUZZLES.map((p) => [p.id, p]));

export const getPuzzle = (id: string): PuzzleDefinition | undefined => PUZZLES_BY_ID.get(id);

export const getPuzzlesForSurface = (surface: PuzzleDefinition['surface']) =>
  PUZZLES.filter((p) => p.surface === surface);

export function normalizeAnswer(input: string, steps: NormalizeStep[]): string {
  let out = input.slice(0, PUZZLE_SETTINGS.maxInputLength);
  for (const step of steps) {
    switch (step) {
      case 'trim':
        out = out.trim();
        break;
      case 'lowercase':
        out = out.toLowerCase();
        break;
      case 'collapse-spaces':
        out = out.replace(/\s+/g, ' ');
        break;
      case 'strip-spaces':
        out = out.replace(/\s+/g, '');
        break;
      case 'alnum-upper':
        out = out.toUpperCase().replace(/[^A-Z0-9.|]/g, '');
        break;
    }
  }
  return out;
}

/** Digest helper shared by the validator and the `puzzle:digest` script. */
export const digestAnswer = (answer: string, steps: NormalizeStep[]): string =>
  sha256Hex(normalizeAnswer(answer, steps));

function conditionMet(cond: UnlockCondition, state?: ProgressionState): boolean {
  switch (cond.type) {
    case 'always':
      return true;
    case 'puzzle-completed':
      return !!state?.completed[cond.puzzleId];
    case 'record-discovered':
      return !!state?.discovered[cond.recordId];
  }
}

export function isPuzzleAvailable(puzzle: PuzzleDefinition, state?: ProgressionState): boolean {
  return (puzzle.requires ?? []).every((c) => conditionMet(c, state));
}

/**
 * True if `input` is an accepted answer, ignoring unlock requirements. Used
 * where the terminal reacts to a correct-but-premature answer ("NOT YET").
 */
export function checkAnswer(puzzleId: string, input: string): boolean {
  const puzzle = getPuzzle(puzzleId);
  if (!puzzle || !input.trim() || puzzle.validation.method !== 'sha256') return false;
  return puzzle.validation.digests.includes(digestAnswer(input, puzzle.validation.normalize));
}

/**
 * Check an answer. Synchronous and side-effect free — recording the
 * completion is the progression store's job.
 */
export function validatePuzzleAnswer(
  puzzleId: string,
  input: string,
  state?: ProgressionState
): ValidationResult {
  const puzzle = getPuzzle(puzzleId);
  if (!puzzle) return { ok: false, puzzleId, reason: 'unknown-puzzle' };
  if (!isPuzzleAvailable(puzzle, state)) return { ok: false, puzzleId, reason: 'unavailable' };
  if (!input.trim()) return { ok: false, puzzleId, reason: 'empty' };

  const { validation } = puzzle;
  if (validation.method !== 'sha256') {
    // Server validation is reserved; a static build cannot honour it.
    return { ok: false, puzzleId, reason: 'unavailable' };
  }
  const digest = digestAnswer(input, validation.normalize);
  return validation.digests.includes(digest)
    ? { ok: true, puzzleId }
    : { ok: false, puzzleId, reason: 'incorrect' };
}

/** Hints the player has already opened for a puzzle, ascending. */
export function revealedHints(puzzle: PuzzleDefinition, highestTier: number) {
  return puzzle.hints.filter((h) => h.tier <= highestTier);
}

/** The next hint to offer, or undefined when all are open. */
export function nextHint(puzzle: PuzzleDefinition, highestTier: number) {
  return puzzle.hints.find((h) => h.tier > highestTier);
}
