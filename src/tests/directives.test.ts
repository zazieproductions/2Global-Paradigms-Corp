/**
 * FIELD DIRECTIVES — the milestone ledger, the completion watcher and the
 * FIELD INTEL payouts.
 *
 * These tests are the contract for "zero bookkeeping": every step below is
 * driven by the same action a UI surface dispatches, and the directive must
 * close (and file its intel) without any further call.
 */
import { describe, expect, it } from 'vitest';
import type { ProgressionState } from '@/types';
import { CHAPTERS, DIRECTIVES, FIELD_INTEL, MILESTONES } from '@/content/puzzles/directives';
import {
  createDirectivesState,
  directiveBoard,
  directivePulse,
  milestonesForEvent,
  observeEvent,
  parseDirectivesState,
  satisfiedMilestones,
  syncCase,
  targetOfRule,
  validateDirectiveCatalogue
} from '@/lib/puzzles/directives';
import {
  createInitialState,
  createProgressionStore,
  parseStoredState,
  progressionReducer
} from '@/lib/puzzles/progression';
import { getSeal } from '@/content/puzzles/seals';
import { withSeals } from './seal-fixtures';

const memoryStorage = (): Storage => {
  const m = new Map<string, string>();
  return {
    get length() {
      return m.size;
    },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => void m.delete(k),
    setItem: (k, v) => void m.set(k, v)
  };
};

/** The observable steps of the opening chapter, dispatched as the UI would. */
const openCase = (state: ProgressionState = createInitialState()): ProgressionState => {
  let s = progressionReducer(state, { type: 'mark-prologue-seen', at: 'T-PROLOGUE' });
  s = progressionReducer(s, {
    type: 'observe',
    event: { kind: 'section-visited', target: 'timeline' },
    at: 'T-TIMELINE'
  });
  s = progressionReducer(s, {
    type: 'observe',
    event: { kind: 'audio-played', target: 'audio-01' },
    at: 'T-AUDIO'
  });
  return s;
};

describe('field directives — catalogue', () => {
  it('is internally consistent (cross-references all resolve)', () => {
    const issues = validateDirectiveCatalogue();
    expect(issues.filter((i) => i.level === 'error').map((i) => `${i.where}: ${i.message}`)).toEqual([]);
  });

  it('only ever asks for steps a surface can dispatch', () => {
    for (const milestone of MILESTONES) {
      if (milestone.rule.kind === 'fragments-collected') continue;
      // An event carrying exactly the target the rule keys on must match it.
      const probe = { kind: milestone.rule.kind, target: targetOfRule(milestone.rule) };
      expect(
        milestonesForEvent(probe).some((m) => m.id === milestone.id),
        milestone.id
      ).toBe(true);
    }
  });

  it('pays every directive one unique FIELD INTEL filing', () => {
    const intelIds = DIRECTIVES.map((d) => d.intelId);
    expect(new Set(intelIds).size).toBe(DIRECTIVES.length);
    for (const id of intelIds) expect(FIELD_INTEL.some((f) => f.id === id)).toBe(true);
  });

  it('covers every directive exactly once across the chapters', () => {
    const listed = CHAPTERS.flatMap((c) => c.directiveIds);
    expect(listed.sort()).toEqual(DIRECTIVES.map((d) => d.id).sort());
  });
});

describe('field directives — the ledger', () => {
  it('records an observation once, and only if it is catalogued', () => {
    const start = createInitialState();
    const unknown = observeEvent(start, { kind: 'section-visited', target: 'dashboard' });
    expect(unknown).toBe(start);
    expect(unknown.directives.ledger).toEqual([]);

    const visited = observeEvent(start, { kind: 'section-visited', target: 'timeline' }, 'T1');
    expect(visited.directives.ledger).toEqual([
      { id: 'm-visit-timeline', kind: 'section-visited', target: 'timeline', at: 'T1' }
    ]);
    expect(observeEvent(visited, { kind: 'section-visited', target: 'timeline' }, 'T2')).toBe(visited);
  });

  it('rejects an event whose target the catalogue does not know', () => {
    const start = createInitialState();
    expect(observeEvent(start, { kind: 'record-opened', target: 'doc-999' })).toBe(start);
    expect(observeEvent(start, { kind: 'download-taken', target: 'not-a-download' })).toBe(start);
  });

  it('discards unknown, malformed and duplicate rows from a stored save', () => {
    const parsed = parseDirectivesState({
      ledger: [
        { id: 'm-prologue', kind: 'prologue-read', at: 'T1' },
        { id: 'm-prologue', kind: 'prologue-read', at: 'T2' }, // duplicate
        { id: 'm-invented', kind: 'prologue-read', at: 'T3' }, // not catalogued
        { id: 'm-visit-timeline', kind: 'section-visited' }, // no timestamp
        'nonsense'
      ],
      completed: { 'dir-01': 'T4', 'dir-99': 'T5' },
      intel: ['intel-01', 'intel-99', 'intel-01'],
      chapters: { 'ch-1': 'T6', 'ch-9': 'T7' }
    });
    expect(parsed.ledger.map((r) => r.id)).toEqual(['m-prologue']);
    expect(parsed.completed).toEqual({ 'dir-01': 'T4' });
    expect(parsed.intel).toEqual(['intel-01']);
    expect(parsed.chapters).toEqual({ 'ch-1': 'T6' });
  });

  it('derives satisfaction from durable state as well as the ledger', () => {
    const state = withSeals(1);
    expect(satisfiedMilestones(state).has('m-seal-1')).toBe(true);
    expect(satisfiedMilestones(state).has('m-seal-2')).toBe(false);
  });
});

describe('field directives — steps complete themselves', () => {
  it('reads the dead drop, walks the timeline and plays a capture into three closed directives', () => {
    const s = openCase();
    for (const id of ['dir-01', 'dir-02', 'dir-03']) {
      expect(s.directives.completed[id], id).toBeTruthy();
    }
    expect(s.directives.intel).toEqual(['intel-01', 'intel-02', 'intel-03']);
    expect(s.directives.chapters['ch-1']).toBeTruthy();
    // Journal lines: one per directive, plus the chapter close.
    expect(s.investigation.journal.filter((j) => j.kind === 'directive')).toHaveLength(3);
    expect(s.investigation.journal.some((j) => j.text.startsWith('Chapter I complete'))).toBe(true);
  });

  it('closes the seal directive from the completion alone, with no explicit observation', () => {
    const s = withSeals(1, openCase());
    expect(s.directives.completed['dir-04']).toBeTruthy();
    expect(s.directives.intel).toContain('intel-04');
    // Seal I grants clearance, never intel, and the reward is unchanged.
    expect(s.completed['seal-1']).toBeTruthy();
  });

  it('closes the commissioning-log directive when the record is opened', () => {
    const s = progressionReducer(withSeals(1, openCase()), {
      type: 'discover',
      recordId: 'doc-006',
      at: 'T-DOC'
    });
    expect(s.directives.completed['dir-05']).toBeTruthy();
    expect(s.directives.ledger.find((r) => r.id === 'm-record-commission')?.at).toBe('T-DOC');
  });

  it('closes the sweep directive when `scan` is run', () => {
    let s = withSeals(1, openCase());
    s = progressionReducer(s, { type: 'discover', recordId: 'doc-006' });
    s = progressionReducer(s, { type: 'observe', event: { kind: 'terminal-scan' }, at: 'T-SCAN' });
    expect(s.directives.completed['dir-06']).toBeTruthy();
    expect(s.directives.chapters['ch-2']).toBeTruthy();
  });

  it('counts fragments rather than requiring a particular one', () => {
    let s = openCase();
    for (const id of ['frag-news', 'frag-careers']) {
      s = progressionReducer(s, { type: 'collect-fragment', fragmentId: id });
    }
    expect(s.directives.completed['dir-07']).toBeFalsy();
    s = progressionReducer(s, { type: 'collect-fragment', fragmentId: 'frag-timeline' });
    expect(s.directives.completed['dir-07']).toBeTruthy();
    expect(s.directives.intel).toContain('intel-07');
  });

  it('closes the de-scrambler directive only when it is earned and switched on', () => {
    // Below Level 3 the toggle is refused, so the step must not record.
    const refused = progressionReducer(createInitialState(), { type: 'set-unredacted', value: true });
    expect(refused.directives.ledger.some((r) => r.id === 'm-descrambler')).toBe(false);

    let s = withSeals(2, openCase());
    s = progressionReducer(s, { type: 'set-unredacted', value: true });
    expect(s.directives.completed['dir-08']).toBeTruthy();
    expect(s.directives.intel).toContain('intel-08');
  });

  it('closes the safe directive when the safe is turned', () => {
    const solved = withSeals(6, openCase());
    expect(solved.directives.completed['dir-12']).toBeTruthy();
    expect(solved.directives.intel).toContain('intel-12');
  });

  it('waits for the dump to actually be taken', () => {
    let s = withSeals(6, openCase());
    const beforeDump = s.directives.completed['dir-13'];
    expect(beforeDump).toBeFalsy();
    s = progressionReducer(s, {
      type: 'observe',
      event: { kind: 'download-taken', target: 'palimpsest-master-dump' },
      at: 'T-DUMP'
    });
    expect(s.directives.completed['dir-13']).toBeTruthy();
    expect(s.directives.intel).toContain('intel-13');
  });

  it('closes the case on the Counter-Rite', () => {
    let s = withSeals(6, openCase());
    s = progressionReducer(s, { type: 'discover', recordId: 'doc-006' });
    s = progressionReducer(s, { type: 'observe', event: { kind: 'terminal-scan' } });
    s = progressionReducer(s, { type: 'complete-finale', at: 'T-RITE' });
    expect(s.directives.completed['dir-14']).toBeTruthy();
    expect(s.directives.intel).toContain('intel-14');
    expect(s.directives.chapters['ch-5']).toBeTruthy();
    expect(s.investigation.finaleComplete).toBe(true);
  });

  it('is idempotent: a second sync changes nothing', () => {
    const s = syncCase(withSeals(4, openCase()));
    expect(syncCase(s)).toBe(s);
    expect(
      progressionReducer(s, { type: 'observe', event: { kind: 'section-visited', target: 'values' } })
    ).toBe(s);
  });

  it('never lets a step be recorded twice, however it is reached', () => {
    let s = openCase();
    s = progressionReducer(s, { type: 'observe', event: { kind: 'section-visited', target: 'timeline' } });
    s = progressionReducer(s, { type: 'observe', event: { kind: 'audio-played', target: 'audio-04' } });
    const ledgerIds = s.directives.ledger.map((r) => r.id);
    expect(new Set(ledgerIds).size).toBe(ledgerIds.length);
  });
});

describe('field directives — the board and the watcher', () => {
  it('reports the open directive, its steps and its intel', () => {
    const board = directiveBoard(openCase());
    expect(board.current?.def.id).toBe('dir-04');
    expect(board.currentChapter?.def.id).toBe('ch-2');
    expect(board.completedDirectives).toBe(3);
    expect(board.totalDirectives).toBe(DIRECTIVES.length);
    expect(board.intel.map((f) => f.id)).toEqual(['intel-01', 'intel-02', 'intel-03']);
    expect(board.lastIntel?.code).toBe('FIELD INTEL 03');
    expect(board.ledger[0].id).toBe('m-audio');
  });

  it('pulses once per newly closed directive and chapter', () => {
    const before = openCase();
    const after = withSeals(1, before);
    const pulse = directivePulse(before, after);
    expect(pulse.directives.map((d) => d.id)).toEqual(['dir-04']);
    expect(pulse.intel.map((f) => f.id)).toEqual(['intel-04']);
    expect(pulse.chapters).toEqual([]);
    // The same diff, replayed, is silent.
    expect(directivePulse(after, syncCase(after))).toEqual({ directives: [], intel: [], chapters: [] });
  });

  it('announces a chapter exactly once, when its last directive closes', () => {
    let s = withSeals(1, openCase());
    s = progressionReducer(s, { type: 'discover', recordId: 'doc-006' });
    const before = s;
    s = progressionReducer(s, { type: 'observe', event: { kind: 'terminal-scan' } });
    expect(directivePulse(before, s).chapters.map((c) => c.id)).toEqual(['ch-2']);
    expect(directivePulse(s, syncCase(s)).chapters).toEqual([]);
  });
});

describe('field directives — persistence', () => {
  it('round-trips the case file through storage', () => {
    const storage = memoryStorage();
    const a = createProgressionStore(storage);
    a.dispatch({ type: 'mark-prologue-seen' });
    a.dispatch({ type: 'observe', event: { kind: 'section-visited', target: 'timeline' } });
    const b = createProgressionStore(storage);
    expect(b.getState().directives.completed['dir-01']).toBeTruthy();
    expect(b.getState().directives.intel).toEqual(['intel-01', 'intel-02']);
  });

  it('self-heals a v2 save: the intel the state already proves is filed on load', () => {
    const legacy = withSeals(3);
    const parsed = parseStoredState(
      JSON.stringify({
        version: 2,
        discovered: legacy.discovered,
        completed: legacy.completed,
        investigation: { ...legacy.investigation, prologueSeen: true }
      })
    );
    expect(parsed?.version).toBe(3);
    // Seal I, II and III are broken and the case is open: those directives hold.
    expect(parsed?.directives.completed['dir-01']).toBeTruthy();
    expect(parsed?.directives.completed['dir-04']).toBeTruthy();
    expect(parsed?.directives.completed['dir-08']).toBeFalsy(); // never switched it on by hand
    expect(parsed?.directives.intel).toContain('intel-04');
    expect(parsed?.directives.intel).toContain('intel-09');
  });

  it('keeps FIELD INTEL through a purge (knowledge is not clearance)', () => {
    const s = progressionReducer(withSeals(2, openCase()), { type: 'purge-case' });
    expect(s.completed).toEqual({});
    expect(s.directives.intel).toContain('intel-04');
    expect(s.directives.completed['dir-04']).toBeTruthy();
  });

  it('wipes the case file on a full reset', () => {
    const s = progressionReducer(openCase(), { type: 'reset', keepPreferences: true });
    expect(s.directives).toEqual(createDirectivesState());
  });
});

describe('field directives — the story it pays out', () => {
  const full = (() => {
    let s = openCase();
    s = progressionReducer(s, { type: 'discover', recordId: 'doc-006' });
    s = progressionReducer(s, { type: 'observe', event: { kind: 'terminal-scan' } });
    for (const id of ['frag-news', 'frag-careers', 'frag-timeline']) {
      s = progressionReducer(s, { type: 'collect-fragment', fragmentId: id });
    }
    s = withSeals(6, s);
    s = progressionReducer(s, { type: 'set-unredacted', value: true });
    s = progressionReducer(s, {
      type: 'observe',
      event: { kind: 'download-taken', target: 'palimpsest-master-dump' }
    });
    return progressionReducer(s, { type: 'complete-finale' });
  })();

  it('files all fourteen filings once the run is finished', () => {
    // Filed in the order the directives actually closed, so compare as a set.
    expect([...full.directives.intel].sort()).toEqual(FIELD_INTEL.map((f) => f.id).sort());
    expect(Object.keys(full.directives.completed)).toHaveLength(DIRECTIVES.length);
    expect(Object.keys(full.directives.chapters).sort()).toEqual(CHAPTERS.map((c) => c.id).sort());
    expect(directiveBoard(full).current).toBeNull();
  });

  it('answers the three questions the run is built around', () => {
    const text = FIELD_INTEL.map((f) => f.paragraphs.join(' ')).join(' ');
    expect(text).toContain('15'); // the constant
    expect(text).toContain('2026-11-04'); // the Completion of the Square
    expect(text).toContain('211'); // the pulls on the seized mirror
    expect(text).toContain('Seventh Chamber'); // who is really in it
  });

  it('never grants clearance: the field run cannot open a sealed record', () => {
    const withRun = progressionReducer(
      progressionReducer(createInitialState(), { type: 'mark-prologue-seen' }),
      { type: 'observe', event: { kind: 'section-visited', target: 'timeline' } }
    );
    expect(withRun.directives.completed['dir-02']).toBeTruthy();
    expect(withRun.completed).toEqual({});
    expect(withRun.access.clearance).toBe(createInitialState().access.clearance);
  });

  it('names the seal each seal step waits on', () => {
    for (const seal of [1, 2, 3, 4, 5, 7] as const) {
      const milestone = MILESTONES.find((m) => m.id === `m-seal-${seal}`);
      expect(milestone, `m-seal-${seal}`).toBeTruthy();
      expect(milestone!.label).toContain(getSeal(seal).numeral);
    }
    // Seal VI is the safe: its step waits on the door, not on a typed word.
    const safe = MILESTONES.find((m) => m.id === 'm-safe');
    expect(safe?.rule).toEqual({ kind: 'safe-opened' });
    expect(safe?.label).toContain('safe');
  });
});
