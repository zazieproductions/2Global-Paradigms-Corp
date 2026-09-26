import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SIGNAL_KEYS } from '../data/signalPuzzles';
import {
  ChainState,
  EMPTY_STATE,
  loadChainState,
  normaliseKey,
  SignalChainApi,
  SignalChainContext,
  SignalStageId,
  STORAGE_KEY,
  SubmitResult
} from './signalChainContext';

// Global Paradigms Corp. — Signal Chain progression provider
// Shared between the SIGNALS & INTERCEPTS workbenches and the GPC terminal, so
// a key can be recovered with the audio tools and transmitted from the CLI.

export const SignalChainProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ChainState>(() => loadChainState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable — chain simply won't persist
    }
  }, [state]);

  const isSolved = useCallback(
    (stage: SignalStageId) => {
      const key = stage === 1 ? SIGNAL_KEYS.one : stage === 2 ? SIGNAL_KEYS.two : SIGNAL_KEYS.three;
      return state.accepted.includes(key.toLowerCase());
    },
    [state.accepted]
  );

  const isStageOpen = useCallback(
    (stage: SignalStageId) => {
      if (stage === 1) return true;
      if (stage === 2) return isSolved(1);
      return isSolved(2);
    },
    [isSolved]
  );

  const isFinalOpen = useCallback(() => isSolved(3), [isSolved]);

  const noteDiscovered = useCallback((key: string) => {
    const k = normaliseKey(key).toLowerCase();
    if (!k) return;
    setState((prev) =>
      prev.discovered.includes(k) ? prev : { ...prev, discovered: [...prev.discovered, k] }
    );
  }, []);

  const markPrintObserved = useCallback(() => {
    setState((prev) => (prev.printObserved ? prev : { ...prev, printObserved: true }));
  }, []);

  const submitKey = useCallback(
    (raw: string): SubmitResult => {
      const candidate = normaliseKey(raw);

      if (!candidate) {
        return { ok: false, unlocked: null, message: 'GATE: EMPTY KEYSTROKE. NOTHING TRANSMITTED.' };
      }

      const lower = candidate.toLowerCase();

      if (state.accepted.includes(lower)) {
        return { ok: true, unlocked: null, message: `GATE: ${candidate} ALREADY ON FILE. NO CHANGE.` };
      }

      const accept = (stage: SignalStageId | 'final', message: string): SubmitResult => {
        setState((prev) => ({
          ...prev,
          accepted: prev.accepted.includes(lower) ? prev.accepted : [...prev.accepted, lower],
          attemptLog: [
            `${new Date().toISOString().slice(11, 19)} ACCEPT  ${candidate}`,
            ...prev.attemptLog
          ].slice(0, 8)
        }));
        return { ok: true, unlocked: stage, message };
      };

      if (candidate === SIGNAL_KEYS.one) {
        return accept(
          2,
          `GATE: ${candidate} ACCEPTED — HOUSE KEY VALID. RAVENSPORT NUMBERS CARRIER UNSEALED. SEE SIGNALS // STAGE 02.`
        );
      }

      if (candidate === SIGNAL_KEYS.two) {
        return accept(
          3,
          `GATE: ${candidate} ACCEPTED — AUTHORISATION WORD VALID. HOLD-TONE SPECTRAL PRINT ONLINE. SEE SIGNALS // STAGE 03.`
        );
      }

      if (candidate === SIGNAL_KEYS.three) {
        return accept(
          'final',
          `GATE: ${candidate} ACCEPTED — PRINT MATCHED. FINAL HOLD-TONE DISCLOSURE UNSEALED. WELCOME TO THE LIST.`
        );
      }

      setState((prev) => ({
        ...prev,
        attemptLog: [
          `${new Date().toISOString().slice(11, 19)} REJECT  ${candidate}`,
          ...prev.attemptLog
        ].slice(0, 8)
      }));

      return {
        ok: false,
        unlocked: null,
        message: `GATE: ${candidate} REJECTED. ATTEMPT LOGGED TO TOPN SECURITY.`
      };
    },
    [state.accepted]
  );

  const resetChain = useCallback(() => setState(EMPTY_STATE), []);

  const value = useMemo<SignalChainApi>(
    () => ({
      ...state,
      keys: SIGNAL_KEYS,
      submitKey,
      noteDiscovered,
      markPrintObserved,
      resetChain,
      isStageOpen,
      isSolved,
      isFinalOpen
    }),
    [state, submitKey, noteDiscovered, markPrintObserved, resetChain, isStageOpen, isSolved, isFinalOpen]
  );

  return <SignalChainContext.Provider value={value}>{children}</SignalChainContext.Provider>;
};
