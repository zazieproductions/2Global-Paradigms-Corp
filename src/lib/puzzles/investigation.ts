/**
 * THE SEVEN SEALS — pure selectors over `ProgressionState`.
 *
 * Clearance is EARNED: the highest `clearance` reward among completed puzzles
 * (only seals grant one). The operator may choose to browse at a lower level;
 * a stale choice is dropped automatically when a seal raises the ceiling.
 */
import type { ClearanceLevel, ProgressionState } from '@/types';
import { FRAGMENTS, SEALS, sealPuzzleId, type SealId } from '@/content/puzzles/seals';
import { clearanceForTier, clearanceTier } from '@/lib/archive/clearance';
import { getPuzzle } from './validate';

/** Rank the de-scrambler (and the degree names) become available at. */
export const DESCRAMBLER_RANK = 3;

/** Highest clearance rank earned through completed puzzles (1–5). */
export function earnedLevel(state: ProgressionState): number {
  let rank = 1;
  for (const id of Object.keys(state.completed)) {
    for (const reward of getPuzzle(id)?.rewards ?? []) {
      if (reward.type === 'clearance') rank = Math.max(rank, clearanceTier(reward.level));
    }
  }
  return rank;
}

export const levelFromRank = (rank: number): ClearanceLevel =>
  clearanceForTier(Math.max(1, Math.min(5, rank))) ?? 'Level 1 - General';

/** The level the archive actually filters by. */
export function effectiveClearance(state: ProgressionState): ClearanceLevel {
  const earned = earnedLevel(state);
  const { clearance, chosenAt } = state.access;
  return chosenAt === earned && clearanceTier(clearance) <= earned ? clearance : levelFromRank(earned);
}

export const effectiveRank = (state: ProgressionState): number => clearanceTier(effectiveClearance(state));

export const isDescramblerUnlocked = (state: ProgressionState): boolean =>
  earnedLevel(state) >= DESCRAMBLER_RANK;

/** True when redacted cleartext should be shown. */
export const isUnredacted = (state: ProgressionState): boolean =>
  state.access.unredacted && isDescramblerUnlocked(state);

export const isSealSolved = (state: ProgressionState, id: SealId): boolean =>
  !!state.completed[sealPuzzleId(id)];

export const solvedSeals = (state: ProgressionState): SealId[] =>
  SEALS.filter((s) => isSealSolved(state, s.id)).map((s) => s.id);

/** Seals open strictly in order. */
export const isSealOpen = (state: ProgressionState, id: SealId): boolean =>
  id === 1 || isSealSolved(state, (id - 1) as SealId);

/** First unbroken seal, or null when all seven are broken. */
export const currentSeal = (state: ProgressionState): SealId | null =>
  SEALS.find((s) => !isSealSolved(state, s.id))?.id ?? null;

/** Choir-code letters the operator can read (all of them once Seal III is broken). */
export function knownLetters(state: ProgressionState): Set<string> {
  const all = isSealSolved(state, 3);
  const set = new Set<string>();
  for (const f of FRAGMENTS) {
    if (all || state.investigation.fragments.includes(f.id)) f.letters.forEach((l) => set.add(l));
  }
  return set;
}

/** Hint tier opened for a seal (0–3). */
export const sealHintTier = (state: ProgressionState, id: SealId): number =>
  state.hintsRevealed[sealPuzzleId(id)] ?? 0;
