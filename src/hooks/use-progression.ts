import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { ClearanceLevel, CompletionMethod, Preferences, ProgressionState } from '@/types';
import { progressionStore, type ProgressionStore } from '@/lib/puzzles/progression';
import { validatePuzzleAnswer } from '@/lib/puzzles/validate';

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
  const reset = useCallback(
    (keepPreferences = true) => dispatch({ type: 'reset', keepPreferences }),
    [dispatch]
  );

  const derived = useMemo(() => {
    const completions = Object.values(state.completed);
    return {
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
    reset
  };
}

export type ProgressionApi = ReturnType<typeof useProgression>;
