/**
 * OPERATION SILENTIUM — the directive API used by Mission Control, the
 * dashboard tracker and the completion watcher. Pure derivation over the
 * progression store; owns no state of its own.
 */
import { useMemo } from 'react';
import {
  DIRECTIVES,
  DIRECTIVE_CHAPTERS,
  directivesInChapter,
  type Directive,
  type DirectiveChapter
} from '@/content/puzzles/directives';
import {
  chapterComplete,
  chapterUnlocked,
  completedChapterCount,
  completedDirectiveCount,
  currentDirective,
  directiveActive,
  directiveComplete,
  directiveProgress,
  nextStep,
  operationComplete,
  operationStanding,
  stepComplete
} from '@/lib/puzzles/directives';
import { useProgression } from './use-progression';

export function useDirectives() {
  const { state } = useProgression();

  return useMemo(() => {
    const chapters = DIRECTIVE_CHAPTERS.map((chapter: DirectiveChapter) => ({
      chapter,
      directives: directivesInChapter(chapter.id),
      complete: chapterComplete(state, chapter),
      unlocked: chapterUnlocked(state, chapter)
    }));
    const current = currentDirective(state);
    return {
      chapters,
      all: DIRECTIVES,
      current,
      /** The next uncompleted step of the current directive, if any. */
      currentStep: current ? nextStep(state, current) : null,
      completedCount: completedDirectiveCount(state),
      completedChapters: completedChapterCount(state),
      total: DIRECTIVES.length,
      standing: operationStanding(state),
      done: operationComplete(state),
      isComplete: (d: Directive) => directiveComplete(state, d),
      isActive: (d: Directive) => directiveActive(state, d),
      isLocked: (d: Directive) =>
        !chapterUnlocked(
          state,
          DIRECTIVE_CHAPTERS.find((c) => c.id === d.chapterId)!
        ),
      progress: (d: Directive) => directiveProgress(state, d),
      stepDone: (d: Directive, stepIndex: number) => stepComplete(state, d.steps[stepIndex]),
      nextStepOf: (d: Directive) => nextStep(state, d)
    };
  }, [state]);
}

export type DirectivesApi = ReturnType<typeof useDirectives>;
