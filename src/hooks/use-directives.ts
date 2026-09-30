/**
 * FIELD DIRECTIVES — React access to the milestone ledger.
 *
 * `useDirectives()` is the read model (chapters, the open directive, recovered
 * FIELD INTEL, the ledger) plus the handful of observation dispatchers the
 * surfaces call. `useDirectiveWatcher()` is the completion watcher's noisy
 * half: it diffs the case file and raises revelation toasts for newly filed
 * intel and completed chapters. Mount it once, in the shell.
 */
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import type { ActiveTab, MilestoneEvent } from '@/types';
import { progressionStore, type ProgressionStore } from '@/lib/puzzles/progression';
import { directiveBoard, directivePulse } from '@/lib/puzzles/directives';
import { notify } from './use-investigation';

export function useDirectives(store: ProgressionStore = progressionStore) {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  const { dispatch } = store;

  /** Record an observable step. Unknown events are dropped by the ledger. */
  const observe = useCallback((event: MilestoneEvent) => dispatch({ type: 'observe', event }), [dispatch]);
  const visitSection = useCallback(
    (tab: ActiveTab) => dispatch({ type: 'observe', event: { kind: 'section-visited', target: tab } }),
    [dispatch]
  );
  const scanRun = useCallback(
    () => dispatch({ type: 'observe', event: { kind: 'terminal-scan' } }),
    [dispatch]
  );
  const audioPlayed = useCallback(
    (artifactId?: string) =>
      dispatch({ type: 'observe', event: { kind: 'audio-played', target: artifactId } }),
    [dispatch]
  );
  const safeOpened = useCallback(
    () => dispatch({ type: 'observe', event: { kind: 'safe-opened' } }),
    [dispatch]
  );
  const downloadTaken = useCallback(
    (downloadId?: string) =>
      dispatch({ type: 'observe', event: { kind: 'download-taken', target: downloadId } }),
    [dispatch]
  );

  const board = useMemo(() => directiveBoard(state), [state]);

  return { state, ...board, observe, visitSection, scanRun, audioPlayed, safeOpened, downloadTaken };
}

export type DirectivesApi = ReturnType<typeof useDirectives>;

/**
 * The completion watcher's announcements. Subscribes to the store and turns
 * each newly closed directive / chapter into a revelation toast; nothing else
 * in the app needs to know that a directive exists.
 */
export function useDirectiveWatcher(store: ProgressionStore = progressionStore) {
  useEffect(() => {
    let previous = store.getState();
    return store.subscribe(() => {
      const next = store.getState();
      if (next === previous) return;
      const pulse = directivePulse(previous, next);
      previous = next;
      for (const directive of pulse.directives) {
        const intel = pulse.intel.find((f) => f.id === directive.intelId);
        notify(
          `DIRECTIVE ${directive.numeral} CLEARED — ${directive.codename}`,
          directive.toast ?? intel?.title ?? directive.brief,
          '✦',
          '#22d3ee'
        );
      }
      for (const chapter of pulse.chapters) {
        notify(
          `CHAPTER ${chapter.numeral} COMPLETE — ${chapter.title}`,
          chapter.closing,
          '☉',
          chapter.accent
        );
      }
    });
  }, [store]);
}
