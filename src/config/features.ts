/**
 * Feature flags. Flip these to change behaviour without touching components.
 * Build-time overrides: set `VITE_FEATURE_<NAME>=true|false` (see DEPLOYMENT.md).
 */
const envFlag = (name: string, fallback: boolean): boolean => {
  const raw = import.meta.env[`VITE_FEATURE_${name}`] as string | undefined;
  if (raw === undefined || raw === '') return fallback;
  return raw === 'true' || raw === '1';
};

export const FEATURES = {
  /**
   * Gate the archive behind the cold-boot terminal on every load. Off by
   * default: visitors land in the archive and the navigation shell drops in a
   * few seconds later. The boot is still reachable — `boot` in the shell.
   */
  bootSequence: envFlag('BOOT_SEQUENCE', false),
  /** Drop the interactive navigation shell in a few seconds after load. */
  archiveShell: envFlag('ARCHIVE_SHELL', true),
  /** Persist progression (discoveries, puzzles, clearance) to localStorage. */
  persistProgress: envFlag('PERSIST_PROGRESS', true),
  /** Offer the no-shame "assisted" bypass on every puzzle that defines one. */
  assistedBypass: envFlag('ASSISTED_BYPASS', true),
  /** Mechanical UI click sounds (still require a user gesture to start). */
  uiSoundsDefault: envFlag('UI_SOUNDS', true)
} as const;
