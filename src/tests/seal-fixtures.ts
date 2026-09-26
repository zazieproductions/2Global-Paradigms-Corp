/**
 * Test-only answers. These never ship: the bundle stores digests only
 * (see docs/PUZZLE_SYSTEM.md). Keep in sync with the seal content.
 */
import type { ProgressionState } from '@/types';
import { progressionReducer, createInitialState } from '@/lib/puzzles/progression';
import type { SealId } from '@/content/puzzles/seals';

export const SEAL_ANSWERS: Record<SealId, string> = {
  1: '492357816',
  2: 'LITURGY',
  3: 'SVALBARD',
  4: '14.8|432|741',
  5: 'POSTOJNA',
  6: '1800',
  7: 'ORPHEUS'
};

/** State with seals 1..n broken (in order, unassisted). */
export function withSeals(n: number, state: ProgressionState = createInitialState()): ProgressionState {
  let s = state;
  for (let id = 1; id <= n; id++) {
    s = progressionReducer(s, { type: 'complete', puzzleId: `seal-${id}`, method: 'answer', at: `T${id}` });
  }
  return s;
}
