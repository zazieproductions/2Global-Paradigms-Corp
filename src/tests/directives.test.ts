/**
 * OPERATION SILENTIUM — the directive (mission) layer:
 * milestone storage in the reducer + the pure selectors that derive
 * chapter unlocking, directive ordering and the single current objective.
 */
import { describe, expect, it } from 'vitest';
import type { ProgressionState } from '@/types';
import { DIRECTIVES, DIRECTIVE_CHAPTERS, directivesInChapter } from '@/content/puzzles/directives';
import {
  chapterComplete,
  chapterUnlocked,
  completedDirectiveCount,
  currentDirective,
  directiveActive,
  directiveComplete,
  directiveProgress,
  eventComplete,
  operationComplete,
  operationStanding,
  stepComplete
} from '@/lib/puzzles/directives';
import { createInitialState, parseStoredState, progressionReducer } from '@/lib/puzzles/progression';
import { FRAGMENTS } from '@/content/puzzles/seals';
import { withSeals } from './seal-fixtures';

const milestone = (id: string) => ({ type: 'milestone', id }) as const;
const puzzle = (puzzleId: string) => ({ type: 'complete', puzzleId, method: 'answer' }) as const;
const discover = (recordId: string) => ({ type: 'discover', recordId }) as const;

/** Complete everything up to and including the given directive id. */
function through(directiveId: string): ProgressionState {
  let s = createInitialState();
  for (const d of DIRECTIVES) {
    for (const step of d.steps) {
      const ev = step.event;
      switch (ev.type) {
        case 'puzzle':
          if (ev.id === 'seal-7') {
            s = progressionReducer(s, { type: 'complete-finale', at: 'TF' });
          } else {
            s = progressionReducer(s, puzzle(ev.id));
          }
          break;
        case 'record':
          s = progressionReducer(s, discover(ev.id));
          break;
        case 'route':
          s = progressionReducer(s, milestone(`route:${ev.tab}`));
          break;
        case 'fragments':
          for (let i = s.investigation.fragments.length; i < ev.count; i++) {
            s = progressionReducer(s, { type: 'collect-fragment', fragmentId: FRAGMENTS[i].id });
          }
          break;
        case 'clearance':
          break; // derived — satisfied by the seal completions above
        case 'milestone':
          s = progressionReducer(s, milestone(ev.id));
          break;
        case 'prologue':
          s = progressionReducer(s, { type: 'mark-prologue-seen' });
          break;
        case 'finale':
          s = progressionReducer(s, { type: 'complete-finale', at: 'TF' });
          break;
      }
    }
    if (d.id === directiveId) return s;
  }
  return s;
}

describe('milestone storage', () => {
  it('records known milestones and ignores unknown ids', () => {
    const s0 = createInitialState();
    const s1 = progressionReducer(s0, milestone('terminal-scan'));
    expect(s1.milestones['terminal-scan']).toBeTruthy();
    const bogus = progressionReducer(s1, milestone('definitely-not-real'));
    expect(bogus).toBe(s1);
  });

  it('records route-visit milestones', () => {
    const s = progressionReducer(createInitialState(), milestone('route:dashboard'));
    expect(s.milestones['route:dashboard']).toBeTruthy();
  });

  it('does not re-record a milestone twice', () => {
    const s1 = progressionReducer(createInitialState(), milestone('audio-played'));
    const s2 = progressionReducer(s1, milestone('audio-played'));
    expect(s2).toBe(s1);
  });

  it('keeps milestones through a case purge but clears them on reset', () => {
    let s = progressionReducer(withSeals(2), milestone('terminal-scan'));
    s = progressionReducer(s, { type: 'purge-case' });
    expect(s.milestones['terminal-scan']).toBeTruthy();
    expect(s.completed['seal-1']).toBeUndefined();
    s = progressionReducer(s, { type: 'reset' });
    expect(s.milestones['terminal-scan']).toBeUndefined();
  });

  it('drops unknown or malformed milestones when parsing a save', () => {
    const saved = {
      ...createInitialState(),
      milestones: { 'terminal-scan': 'T1', 'route:sanctum': 'T2', 'evil-injection': 'T3', ok: 42 }
    };
    const parsed = parseStoredState(JSON.stringify(saved))!;
    expect(parsed.milestones['terminal-scan']).toBe('T1');
    expect(parsed.milestones['route:sanctum']).toBe('T2');
    expect(parsed.milestones['evil-injection']).toBeUndefined();
    expect(parsed.milestones['ok']).toBeUndefined();
  });
});

describe('directive selectors', () => {
  it('starts every operator on OP-01 with only chapter I unlocked', () => {
    const s = createInitialState();
    expect(currentDirective(s)?.id).toBe('op-01');
    expect(chapterUnlocked(s, DIRECTIVE_CHAPTERS[0])).toBe(true);
    expect(chapterUnlocked(s, DIRECTIVE_CHAPTERS[1])).toBe(false);
    expect(directiveActive(s, DIRECTIVES[1])).toBe(false); // OP-02 waits for OP-01
    expect(operationStanding(s)).toBe('UNASSIGNED');
  });

  it('completes steps as their events happen', () => {
    let s = progressionReducer(createInitialState(), milestone('route:dashboard'));
    const op01 = DIRECTIVES.find((d) => d.id === 'op-01')!;
    expect(stepComplete(s, op01.steps[0])).toBe(true);
    expect(stepComplete(s, op01.steps[1])).toBe(false);

    s = progressionReducer(s, { type: 'mark-prologue-seen' });
    s = progressionReducer(s, milestone('terminal-scan'));
    expect(directiveComplete(s, op01)).toBe(true);
    expect(directiveProgress(s, op01)).toEqual({ done: 3, total: 3 });
    expect(currentDirective(s)?.id).toBe('op-02');
  });

  it('tracks fragment counts, clearance ranks and record discoveries', () => {
    let s = createInitialState();
    const frags = DIRECTIVES.find((d) => d.id === 'op-05')!.steps;
    expect(eventComplete(s, frags[0].event)).toBe(false);
    s = progressionReducer(s, { type: 'collect-fragment', fragmentId: 'frag-news' });
    s = progressionReducer(s, { type: 'collect-fragment', fragmentId: 'frag-careers' });
    expect(eventComplete(s, frags[0].event)).toBe(false);
    s = progressionReducer(s, { type: 'collect-fragment', fragmentId: 'frag-timeline' });
    expect(eventComplete(s, frags[0].event)).toBe(true);

    expect(eventComplete(withSeals(1), { type: 'clearance', rank: 2 })).toBe(true);
    expect(eventComplete(withSeals(1), { type: 'clearance', rank: 3 })).toBe(false);

    const black = DIRECTIVES.find((d) => d.id === 'op-11')!.steps[0];
    expect(eventComplete(s, black.event)).toBe(false);
    expect(eventComplete(progressionReducer(s, discover('doc-001')), black.event)).toBe(true);
  });

  it('unlocks chapters strictly in order and raises standing', () => {
    const ch1Done = through('op-03');
    expect(chapterComplete(ch1Done, DIRECTIVE_CHAPTERS[0])).toBe(true);
    expect(chapterUnlocked(ch1Done, DIRECTIVE_CHAPTERS[1])).toBe(true);
    expect(operationStanding(ch1Done)).toBe('PROBATIONARY READER');
    expect(currentDirective(ch1Done)?.id).toBe('op-04');
    // Chapter III stays sealed until chapter II is fully complete.
    expect(chapterUnlocked(ch1Done, DIRECTIVE_CHAPTERS[2])).toBe(false);
  });

  it('requires every directive in a chapter before the next chapter opens', () => {
    // Break seals I–II but skip the non-seal directives of chapter II.
    const partial = withSeals(2);
    expect(chapterComplete(partial, DIRECTIVE_CHAPTERS[1])).toBe(false);
    expect(chapterUnlocked(partial, DIRECTIVE_CHAPTERS[2])).toBe(false);
  });

  it('runs the whole operation to SILENTIUM', () => {
    const end = through('op-14');
    expect(operationComplete(end)).toBe(true);
    expect(completedDirectiveCount(end)).toBe(DIRECTIVES.length);
    expect(currentDirective(end)).toBeNull();
    expect(operationStanding(end)).toBe('SILENTIUM');
    for (const c of DIRECTIVE_CHAPTERS) expect(chapterComplete(end, c)).toBe(true);
  });

  it('keeps chapters contiguous and directives chaptered', () => {
    for (let i = 1; i < DIRECTIVE_CHAPTERS.length; i++) {
      expect(DIRECTIVE_CHAPTERS[i].index).toBe(DIRECTIVE_CHAPTERS[i - 1].index + 1);
    }
    for (const c of DIRECTIVE_CHAPTERS) {
      expect(directivesInChapter(c.id).length).toBeGreaterThan(0);
      for (const d of directivesInChapter(c.id)) expect(d.chapterId).toBe(c.id);
    }
  });
});
