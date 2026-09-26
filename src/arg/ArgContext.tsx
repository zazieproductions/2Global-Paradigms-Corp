import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ClearanceLevel } from '../types';
import { FRAGMENTS, SEALS, type SealId } from './seals';
import { levelFromRank } from './levels';

// ============================================================================
// INVESTIGATION STATE — persisted between sessions so the case survives reloads
// ============================================================================

const STORAGE_KEY = 'ovp.investigation.v1';

export interface JournalEntry {
  t: string; // ISO timestamp
  text: string;
  kind: 'seal' | 'fragment' | 'system' | 'finale';
}

interface Persisted {
  solved: SealId[];
  fragments: string[];
  hintsRevealed: Record<number, number>;
  prologueSeen: boolean;
  finaleComplete: boolean;
  journal: JournalEntry[];
}

const EMPTY: Persisted = {
  solved: [],
  fragments: [],
  hintsRevealed: {},
  prologueSeen: false,
  finaleComplete: false,
  journal: []
};

export interface Revelation {
  id: number;
  title: string;
  body: string;
  glyph?: string;
  accent?: string;
}

interface ArgContextValue extends Persisted {
  earnedLevel: number;
  maxClearance: ClearanceLevel;
  descramblerUnlocked: boolean;
  currentSeal: SealId | null;
  isSolved: (id: SealId) => boolean;
  isSealOpen: (id: SealId) => boolean;
  solveSeal: (id: SealId) => void;
  collectFragment: (id: string) => void;
  knownLetters: Set<string>;
  revealHint: (id: SealId) => void;
  markPrologueSeen: () => void;
  completeFinale: () => void;
  resetInvestigation: () => void;
  addJournal: (text: string, kind?: JournalEntry['kind']) => void;
  revelations: Revelation[];
  dismissRevelation: (id: number) => void;
  finaleActive: boolean;
  setFinaleActive: (v: boolean) => void;
  notify: (title: string, body: string, glyph?: string, accent?: string) => void;
}

const ArgContext = createContext<ArgContextValue | null>(null);

const load = (): Persisted => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Persisted>) };
  } catch {
    return EMPTY;
  }
};

let revelationSeq = 1;

export const ArgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Persisted>(load);
  const [revelations, setRevelations] = useState<Revelation[]>([]);
  const [finaleActive, setFinaleActive] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — investigation becomes session-only */
    }
  }, [state]);

  const pushRevelation = useCallback((r: Omit<Revelation, 'id'>) => {
    const id = revelationSeq++;
    setRevelations((prev) => [...prev.slice(-2), { ...r, id }]);
    setTimeout(() => setRevelations((prev) => prev.filter((x) => x.id !== id)), 9000);
  }, []);

  const addJournal = useCallback((text: string, kind: JournalEntry['kind'] = 'system') => {
    setState((s) => ({ ...s, journal: [...s.journal, { t: new Date().toISOString(), text, kind }] }));
  }, []);

  const earnedLevel = useMemo(() => {
    let lvl = 1;
    for (const seal of SEALS) {
      if (state.solved.includes(seal.id) && seal.rewardLevel) lvl = Math.max(lvl, seal.rewardLevel);
    }
    return lvl;
  }, [state.solved]);

  const isSolved = useCallback((id: SealId) => state.solved.includes(id), [state.solved]);
  const isSealOpen = useCallback(
    (id: SealId) => id === 1 || state.solved.includes((id - 1) as SealId),
    [state.solved]
  );

  const currentSeal = useMemo<SealId | null>(() => {
    for (const s of SEALS) if (!state.solved.includes(s.id)) return s.id;
    return null;
  }, [state.solved]);

  const solveSeal = useCallback(
    (id: SealId) => {
      setState((s) => {
        if (s.solved.includes(id)) return s;
        const seal = SEALS.find((x) => x.id === id)!;
        return {
          ...s,
          solved: [...s.solved, id],
          journal: [
            ...s.journal,
            {
              t: new Date().toISOString(),
              kind: 'seal',
              text: `Seal ${seal.numeral} (${seal.planet} ${seal.glyph}) broken — Seal-Word recovered: ${seal.sealWord}. ${seal.rewardText}`
            }
          ]
        };
      });
      const seal = SEALS.find((x) => x.id === id)!;
      pushRevelation({
        title: `SEAL ${seal.numeral} BROKEN — ${seal.sealWord}`,
        body: seal.rewardText,
        glyph: seal.glyph,
        accent: seal.accent
      });
    },
    [pushRevelation]
  );

  const collectFragment = useCallback(
    (id: string) => {
      const frag = FRAGMENTS.find((f) => f.id === id);
      if (!frag || state.fragments.includes(id)) return;
      setState((s) =>
        s.fragments.includes(id)
          ? s
          : {
              ...s,
              fragments: [...s.fragments, id],
              journal: [
                ...s.journal,
                {
                  t: new Date().toISOString(),
                  kind: 'fragment',
                  text: `Choir Script fragment recovered in ${frag.location}: glyphs for ${frag.letters.join(', ')}.`
                }
              ]
            }
      );
      pushRevelation({
        title: 'CHOIR SCRIPT FRAGMENT RECOVERED',
        body: `${frag.location} — the Codex now reads: ${frag.letters.join(' · ')}  (${state.fragments.length + 1}/7)`,
        glyph: '⍟',
        accent: '#f87171'
      });
    },
    [pushRevelation, state.fragments]
  );

  const knownLetters = useMemo(() => {
    const set = new Set<string>();
    const all = state.solved.includes(3);
    for (const f of FRAGMENTS) if (all || state.fragments.includes(f.id)) f.letters.forEach((l) => set.add(l));
    return set;
  }, [state.fragments, state.solved]);

  const revealHint = useCallback((id: SealId) => {
    setState((s) => ({
      ...s,
      hintsRevealed: { ...s.hintsRevealed, [id]: Math.min(3, (s.hintsRevealed[id] || 0) + 1) }
    }));
  }, []);

  const markPrologueSeen = useCallback(() => {
    setState((s) =>
      s.prologueSeen
        ? s
        : {
            ...s,
            prologueSeen: true,
            journal: [
              ...s.journal,
              { t: new Date().toISOString(), kind: 'system', text: 'Dead-drop received from Dr. Aris Thorne. Case opened: THE SEVEN SEALS.' }
            ]
          }
    );
  }, []);

  const completeFinale = useCallback(() => {
    setState((s) => ({
      ...s,
      finaleComplete: true,
      solved: s.solved.includes(7) ? s.solved : [...s.solved, 7],
      journal: [
        ...s.journal,
        { t: new Date().toISOString(), kind: 'finale', text: 'The Name was spoken. Counter-Rite performed. Carrier: 0.000 Hz. SILENTIUM.' }
      ]
    }));
  }, []);

  const resetInvestigation = useCallback(() => {
    setState({ ...EMPTY, prologueSeen: true, journal: [{ t: new Date().toISOString(), kind: 'system', text: 'Investigation purged. The seals have closed again.' }] });
  }, []);

  const value: ArgContextValue = {
    ...state,
    earnedLevel,
    maxClearance: levelFromRank(earnedLevel),
    descramblerUnlocked: earnedLevel >= 3,
    currentSeal,
    isSolved,
    isSealOpen,
    solveSeal,
    collectFragment,
    knownLetters,
    revealHint,
    markPrologueSeen,
    completeFinale,
    resetInvestigation,
    addJournal,
    revelations,
    dismissRevelation: (id) => setRevelations((prev) => prev.filter((x) => x.id !== id)),
    finaleActive,
    setFinaleActive,
    notify: (title, body, glyph, accent) => pushRevelation({ title, body, glyph, accent })
  };

  return <ArgContext.Provider value={value}>{children}</ArgContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useArg = () => {
  const ctx = useContext(ArgContext);
  if (!ctx) throw new Error('useArg must be used inside <ArgProvider>');
  return ctx;
};
