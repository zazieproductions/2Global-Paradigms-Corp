import { createContext, useContext } from 'react';
import { SIGNAL_KEYS } from '../data/signalPuzzles';

// Global Paradigms Corp. — Signal Chain shared types & context
// Kept separate from SignalChainProvider so that fast-refresh keeps working.

export const STORAGE_KEY = 'gpc.signal.chain.v1';

export type SignalStageId = 1 | 2 | 3;

export interface SubmitResult {
  ok: boolean;
  /** stage that this key unlocked, if any */
  unlocked: SignalStageId | 'final' | null;
  message: string;
}

export interface ChainState {
  /** keys already accepted by the gate (lowercase) */
  accepted: string[];
  /** keys the operator has physically seen (heard / decrypted / painted) */
  discovered: string[];
  /** true once the waterfall has completed at least one full pass */
  printObserved: boolean;
  /** attempts logged at the gate, newest first */
  attemptLog: string[];
}

export interface SignalChainApi extends ChainState {
  keys: typeof SIGNAL_KEYS;
  submitKey: (raw: string) => SubmitResult;
  noteDiscovered: (key: string) => void;
  markPrintObserved: () => void;
  resetChain: () => void;
  isStageOpen: (stage: SignalStageId) => boolean;
  isSolved: (stage: SignalStageId) => boolean;
  isFinalOpen: () => boolean;
}

export const EMPTY_STATE: ChainState = {
  accepted: [],
  discovered: [],
  printObserved: false,
  attemptLog: []
};

export const SignalChainContext = createContext<SignalChainApi | null>(null);

export function normaliseKey(raw: string): string {
  return raw.trim().toUpperCase().replace(/[^A-Z]/g, '');
}

export function loadChainState(): ChainState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw) as Partial<ChainState>;
    return {
      accepted: Array.isArray(parsed.accepted) ? parsed.accepted : [],
      discovered: Array.isArray(parsed.discovered) ? parsed.discovered : [],
      printObserved: !!parsed.printObserved,
      attemptLog: Array.isArray(parsed.attemptLog) ? parsed.attemptLog.slice(0, 8) : []
    };
  } catch {
    return EMPTY_STATE;
  }
}

export function useSignalChain(): SignalChainApi {
  const ctx = useContext(SignalChainContext);
  if (!ctx) throw new Error('useSignalChain must be used inside <SignalChainProvider>');
  return ctx;
}
