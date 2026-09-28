/** Puzzle-system settings. */
export const PUZZLE_SETTINGS = {
  /**
   * localStorage key. v1 saves stored under the same key are upgraded in place
   * (see parseStoredState); bump only if an upgrade becomes impossible.
   */
  storageKey: 'gpc.progression.v1',
  /**
   * Key used by the pre-restructure Seven Seals build (`ArgContext`). Read once
   * to migrate a returning player's case file; never written.
   */
  legacyInvestigationKey: 'ovp.investigation.v1',
  /** Journal entries kept (oldest dropped first). */
  maxJournalEntries: 200,
  /** Maximum characters accepted by any puzzle input. */
  maxInputLength: 32
} as const;

/**
 * Legacy "executive override" codes from earlier builds and the lore. They are
 * REVOKED in-world: typing one on Channel 9 or at the master-key prompt only
 * produces a rejection. None of them grants anything.
 */
export const REVOKED_CODES: readonly string[] = ['432-88', '4328', '1480', '0432', '1989', '3120', 'sedley'];
