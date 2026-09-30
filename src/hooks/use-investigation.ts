/**
 * THE SEVEN SEALS — the investigation API used by the Sanctum, the seal
 * puzzles, the terminal, the safe and the shell.
 *
 * A thin facade over the progression store (`useProgression`) plus the
 * ephemeral revelation toasts. It owns no state of its own, so the case file
 * is persisted, validated, reset and migrated exactly like every other piece
 * of progression.
 */
import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { ValidationResult } from '@/types';
import { FRAGMENTS, SEAL_FOR_RANK, getSeal, sealPuzzleId, type SealId } from '@/content/puzzles/seals';
import { gpcAudio } from '@/lib/audio/audio-engine';
import {
  DESCRAMBLER_RANK,
  currentSeal,
  isSealOpen,
  isSealSolved,
  knownLetters,
  sealHintTier,
  solvedSeals
} from '@/lib/puzzles/investigation';
import { revelationStore, type Revelation } from '@/lib/puzzles/revelations';
import { checkAnswer } from '@/lib/puzzles/validate';
import { useProgression } from './use-progression';

export function useRevelations() {
  const items = useSyncExternalStore(
    revelationStore.subscribe,
    revelationStore.getSnapshot,
    revelationStore.getSnapshot
  );
  return { revelations: items, dismiss: revelationStore.dismiss };
}

export const notify = (title: string, body: string, glyph?: string, accent?: string) =>
  revelationStore.notify({ title, body, glyph, accent });

export function useInvestigation() {
  const progression = useProgression();
  const { state, attempt, revealHint: revealPuzzleHint, collectFragment: collect } = progression;
  const inv = state.investigation;

  const announceSeal = useCallback((id: SealId) => {
    const seal = getSeal(id);
    notify(`SEAL ${seal.numeral} BROKEN — ${seal.sealWord}`, seal.rewardText, seal.glyph, seal.accent);
  }, []);

  /**
   * Validate an answer for a seal and, if correct and the seal is open, break
   * it. Seal VII is only *checked* here — the rite (`completeFinale`) breaks it.
   */
  const attemptSeal = useCallback(
    (id: SealId, input: string): ValidationResult => {
      const puzzleId = sealPuzzleId(id);
      if (id === 7) {
        if (!isSealOpen(state, 7)) return { ok: false, puzzleId, reason: 'unavailable' };
        return checkAnswer(puzzleId, input)
          ? { ok: true, puzzleId }
          : { ok: false, puzzleId, reason: input.trim() ? 'incorrect' : 'empty' };
      }
      const wasSolved = isSealSolved(state, id);
      const result = attempt(puzzleId, input);
      if (result.ok && !wasSolved) announceSeal(id);
      return result;
    },
    [attempt, announceSeal, state]
  );

  /** Correct answer regardless of seal order (for "NOT YET" responses). */
  const isCorrect = useCallback((id: SealId, input: string) => checkAnswer(sealPuzzleId(id), input), []);

  const revealHint = useCallback(
    (id: SealId) => revealPuzzleHint(sealPuzzleId(id), Math.min(3, sealHintTier(state, id) + 1)),
    [revealPuzzleHint, state]
  );

  const collectFragment = useCallback(
    (fragmentId: string) => {
      const frag = FRAGMENTS.find((f) => f.id === fragmentId);
      if (!frag || inv.fragments.includes(fragmentId)) return;
      collect(fragmentId);
      notify(
        'CHOIR CODE FRAGMENT RECOVERED',
        `${frag.location} — the Codex now reads: ${frag.letters.join(' · ')}  (${inv.fragments.length + 1}/${FRAGMENTS.length})`,
        '⍟',
        'var(--color-seal-mars)'
      );
    },
    [collect, inv.fragments]
  );

  const derived = useMemo(() => {
    const solved = solvedSeals(state);
    const hintsRevealed: Partial<Record<SealId, number>> = {};
    for (const id of [1, 2, 3, 4, 5, 6, 7] as SealId[]) hintsRevealed[id] = sealHintTier(state, id);
    return {
      solved,
      hintsRevealed,
      currentSeal: currentSeal(state),
      knownLetters: knownLetters(state),
      isSolved: (id: SealId) => isSealSolved(state, id),
      isSealOpen: (id: SealId) => isSealOpen(state, id),
      /** True if the seal's answer-revealing hint was opened before it was broken. */
      isAssisted: (id: SealId) => !!state.completed[sealPuzzleId(id)]?.assisted
    };
  }, [state]);

  return {
    fragments: inv.fragments,
    prologueSeen: inv.prologueSeen,
    finaleComplete: inv.finaleComplete,
    journal: inv.journal,
    earnedLevel: progression.earnedLevel,
    maxClearance: progression.maxClearance,
    clearance: progression.clearance,
    descramblerUnlocked: progression.descramblerUnlocked,
    unredacted: progression.unredacted,
    ...derived,
    attemptSeal,
    isCorrect,
    revealHint,
    collectFragment,
    markPrologueSeen: progression.markPrologueSeen,
    completeFinale: progression.completeFinale,
    purgeCase: progression.purgeCase,
    addJournal: progression.addJournal,
    notify
  };
}

export type InvestigationApi = ReturnType<typeof useInvestigation>;
export type { Revelation };

/**
 * The Redaction De-Scrambler switch used by the header, the `U` shortcut, the
 * document viewer and the Sanctum. It is earned at Level 3 (Seal II); below
 * that the toggle is refused in-world instead of silently doing nothing.
 */
export function useDescrambler() {
  const { state, unredacted, descramblerUnlocked, setUnredacted } = useProgression();
  const requested = state.access.unredacted;
  const toggle = useCallback(() => {
    if (!descramblerUnlocked) {
      gpcAudio.playUiSound('deny');
      notify(
        'DE-SCRAMBLER LOCKED',
        `Requires LEVEL ${DESCRAMBLER_RANK} — break ${SEAL_FOR_RANK[DESCRAMBLER_RANK]}.`,
        getSeal(2).glyph,
        getSeal(2).accent
      );
      return;
    }
    gpcAudio.playUiSound('unredact');
    setUnredacted(!requested);
  }, [descramblerUnlocked, requested, setUnredacted]);
  return { unredacted, unlocked: descramblerUnlocked, toggle };
}
