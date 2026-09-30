/**
 * OPERATION SILENTIUM — directive selectors.
 *
 * Pure functions over `ProgressionState`. A directive step is complete when
 * its observable event has happened; a directive completes when all of its
 * steps are complete; a chapter unlocks when the previous chapter is fully
 * complete. Chapters and the directives inside them unlock in order, so the
 * operator always has exactly one CURRENT OBJECTIVE.
 */
import type { ProgressionState } from '@/types';
import {
  DIRECTIVES,
  DIRECTIVE_CHAPTERS,
  directivesInChapter,
  routeMilestone,
  type Directive,
  type DirectiveChapter,
  type DirectiveEvent,
  type DirectiveStep
} from '@/content/puzzles/directives';
import { earnedLevel } from './investigation';

/** Has the event described by `event` happened for this operator? */
export function eventComplete(state: ProgressionState, event: DirectiveEvent): boolean {
  switch (event.type) {
    case 'puzzle':
      return !!state.completed[event.id];
    case 'record':
      return !!state.discovered[event.id];
    case 'route':
      return !!state.milestones[routeMilestone(event.tab)];
    case 'fragments':
      return state.investigation.fragments.length >= event.count;
    case 'clearance':
      return earnedLevel(state) >= event.rank;
    case 'milestone':
      return !!state.milestones[event.id];
    case 'prologue':
      return state.investigation.prologueSeen;
    case 'finale':
      return state.investigation.finaleComplete;
  }
}

export const stepComplete = (state: ProgressionState, step: DirectiveStep): boolean =>
  eventComplete(state, step.event);

/** First incomplete step, or null when the directive is done. */
export const nextStep = (state: ProgressionState, directive: Directive): DirectiveStep | null =>
  directive.steps.find((s) => !stepComplete(state, s)) ?? null;

export const directiveComplete = (state: ProgressionState, directive: Directive): boolean =>
  nextStep(state, directive) === null;

export const directiveProgress = (
  state: ProgressionState,
  directive: Directive
): { done: number; total: number } => ({
  done: directive.steps.filter((s) => stepComplete(state, s)).length,
  total: directive.steps.length
});

export const chapterComplete = (state: ProgressionState, chapter: DirectiveChapter): boolean =>
  directivesInChapter(chapter.id).every((d) => directiveComplete(state, d));

/** Chapters unlock strictly in order. */
export function chapterUnlocked(state: ProgressionState, chapter: DirectiveChapter): boolean {
  const prev = DIRECTIVE_CHAPTERS.find((c) => c.index === chapter.index - 1);
  return !prev || chapterComplete(state, prev);
}

/** A directive is active when its chapter is unlocked and it is next in line. */
export function directiveActive(state: ProgressionState, directive: Directive): boolean {
  const chapter = DIRECTIVE_CHAPTERS.find((c) => c.id === directive.chapterId);
  if (!chapter || !chapterUnlocked(state, chapter)) return false;
  const peers = directivesInChapter(chapter.id);
  const idx = peers.findIndex((d) => d.id === directive.id);
  return peers.slice(0, idx).every((d) => directiveComplete(state, d));
}

/** The one directive the operator should be doing now (first active, incomplete). */
export const currentDirective = (state: ProgressionState): Directive | null =>
  DIRECTIVES.find((d) => directiveActive(state, d) && !directiveComplete(state, d)) ?? null;

export const completedDirectiveCount = (state: ProgressionState): number =>
  DIRECTIVES.filter((d) => directiveComplete(state, d)).length;

export const completedChapterCount = (state: ProgressionState): number =>
  DIRECTIVE_CHAPTERS.filter((c) => chapterComplete(state, c)).length;

/** The operator's standing, named for the highest completed chapter. */
export function operationStanding(state: ProgressionState): string {
  const done = DIRECTIVE_CHAPTERS.filter((c) => chapterComplete(state, c));
  return done.length ? done[done.length - 1].standing : 'UNASSIGNED';
}

/** True once every directive in every chapter is complete. */
export const operationComplete = (state: ProgressionState): boolean =>
  completedDirectiveCount(state) === DIRECTIVES.length;
