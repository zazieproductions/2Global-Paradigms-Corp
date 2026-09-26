import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { ClearanceLevel, CompletionMethod, JournalKind, Preferences, ProgressionState } from '@/types';
import { progressionStore, type ProgressionStore } from '@/lib/puzzles/progression';
import { validatePuzzleAnswer } from '@/lib/puzzles/validate';
import {
  earnedLevel,
  effectiveClearance,
  isDescramblerUnlocked,
  isUnredacted,
  levelFromRank
} from '@/lib/puzzles/investigation';

/**
 * Centralised access to player progression. Every component that reads or
 * changes discoveries, puzzle completions, clearance, preferences or the
 * callsign goes through this hook.
 */
export function useProgression(store: ProgressionStore = progressionStore) {
  const state: ProgressionState = useSyncExternalStore(store.subscribe, store.getState, store.getState);
  const { dispatch } = store;

  const discover = useCallback((recordId: string) => dispatch({ type: 'discover', recordId }), [dispatch]);
  const revealHint = useCallback(
    (puzzleId: string, tier: number) => dispatch({ type: 'reveal-hint', puzzleId, tier }),
    [dispatch]
  );
  const complete = useCallback(
    (puzzleId: string, method: CompletionMethod) => dispatch({ type: 'complete', puzzleId, method }),
    [dispatch]
  );
  /** Validate and, on success, record the completion. Returns the validation result. */
  const attempt = useCallback(
    (puzzleId: string, input: string) => {
      const result = validatePuzzleAnswer(puzzleId, input, store.getState());
      if (result.ok) dispatch({ type: 'complete', puzzleId, method: 'answer' });
      return result;
    },
    [dispatch, store]
  );
  const bypass = useCallback(
    (puzzleId: string) => dispatch({ type: 'complete', puzzleId, method: 'bypass' }),
    [dispatch]
  );
  const setClearance = useCallback(
    (level: ClearanceLevel) => dispatch({ type: 'set-clearance', level }),
    [dispatch]
  );
  const setUnredacted = useCallback(
    (value: boolean) => dispatch({ type: 'set-unredacted', value }),
    [dispatch]
  );
  const setPreference = useCallback(
    (key: keyof Preferences, value: boolean) => dispatch({ type: 'set-preference', key, value }),
    [dispatch]
  );
  const setCallsign = useCallback(
    (callsign: string) => dispatch({ type: 'set-callsign', callsign }),
    [dispatch]
  );
  const collectFragment = useCallback(
    (fragmentId: string) => dispatch({ type: 'collect-fragment', fragmentId }),
    [dispatch]
  );
  const markPrologueSeen = useCallback(() => dispatch({ type: 'mark-prologue-seen' }), [dispatch]);
  const completeFinale = useCallback(() => dispatch({ type: 'complete-finale' }), [dispatch]);
  const addJournal = useCallback(
    (text: string, kind: JournalKind = 'system') => dispatch({ type: 'journal', text, kind }),
    [dispatch]
  );
  /** Close the seals again (keeps discovered files, callsign and preferences). */
  const purgeCase = useCallback(() => dispatch({ type: 'purge-case' }), [dispatch]);
  const reset = useCallback(
    (keepPreferences = true) => dispatch({ type: 'reset', keepPreferences }),
    [dispatch]
  );

  const derived = useMemo(() => {
    const completions = Object.values(state.completed);
    const earned = earnedLevel(state);
    return {
      /** Highest clearance rank earned through the seals (1–5). */
      earnedLevel: earned,
      maxClearance: levelFromRank(earned),
      /** Level the archive filters by (chosen level, capped at earned). */
      clearance: effectiveClearance(state),
      descramblerUnlocked: isDescramblerUnlocked(state),
      /** De-scrambler requested AND earned. */
      unredacted: isUnredacted(state),
      isCompleted: (puzzleId: string) => !!state.completed[puzzleId],
      isDiscovered: (recordId: string) => !!state.discovered[recordId],
      isRouteUnlocked: (path: string) => state.unlockedRoutes.includes(path),
      isDownloadUnlocked: (id: string) => state.unlockedDownloads.includes(id),
      discoveredCount: Object.keys(state.discovered).length,
      completedCount: completions.length,
      assistedCount: completions.filter((c) => c.assisted).length
    };
  }, [state]);

  return {
    state,
    ...derived,
    discover,
    revealHint,
    complete,
    attempt,
    bypass,
    setClearance,
    setUnredacted,
    setPreference,
    setCallsign,
    collectFragment,
    markPrologueSeen,
    completeFinale,
    addJournal,
    purgeCase,
    reset
  };
}

export type ProgressionApi = ReturnType<typeof useProgression>;
