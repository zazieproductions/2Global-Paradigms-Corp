/** Puzzle-system settings. */
export const PUZZLE_SETTINGS = {
  /** localStorage key. Bump the suffix together with ProgressionState.version. */
  storageKey: 'gpc.progression.v1',
  /** Maximum characters accepted by any puzzle input. */
  maxInputLength: 32
} as const;
