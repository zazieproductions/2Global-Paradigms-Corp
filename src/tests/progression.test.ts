import { describe, expect, it } from 'vitest';
import {
  createInitialState,
  createProgressionStore,
  migrateLegacyInvestigation,
  parseStoredState,
  progressionReducer
} from '@/lib/puzzles/progression';
import {
  currentSeal,
  earnedLevel,
  effectiveClearance,
  isDescramblerUnlocked,
  isSealOpen,
  isUnredacted,
  knownLetters
} from '@/lib/puzzles/investigation';
import { PUZZLE_SETTINGS } from '@/config/puzzles';
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

describe('progressionReducer', () => {
  it('records discoveries once', () => {
    const s1 = progressionReducer(createInitialState(), { type: 'discover', recordId: 'doc-001', at: 'T1' });
    const s2 = progressionReducer(s1, { type: 'discover', recordId: 'doc-001', at: 'T2' });
    expect(s2).toBe(s1);
    expect(s1.discovered['doc-001']).toBe('T1');
  });

  it('earns clearance only through the seals', () => {
    expect(earnedLevel(createInitialState())).toBe(1);
    expect(earnedLevel(withSeals(1))).toBe(2);
    expect(earnedLevel(withSeals(2))).toBe(3);
    expect(earnedLevel(withSeals(3))).toBe(3); // Seal III grants no clearance
    expect(earnedLevel(withSeals(4))).toBe(4);
    expect(earnedLevel(withSeals(6))).toBe(5);
  });

  it('applies seal VI rewards: Level 5, de-scrambler on, the master dump', () => {
    const s = withSeals(6);
    expect(effectiveClearance(s)).toMatch(/^Level 5/);
    expect(s.access.unredacted).toBe(true);
    expect(isUnredacted(s)).toBe(true);
    expect(s.unlockedDownloads).toContain('palimpsest-master-dump');
    expect(s.investigation.journal.some((j) => j.text.includes('UMBRA'))).toBe(true);
  });

  it('opens seals strictly in order and refuses out-of-order completions', () => {
    const s = createInitialState();
    expect(isSealOpen(s, 1)).toBe(true);
    expect(isSealOpen(s, 2)).toBe(false);
    const skipped = progressionReducer(s, { type: 'complete', puzzleId: 'seal-3', method: 'bypass' });
    expect(skipped).toBe(s);
    expect(currentSeal(withSeals(2))).toBe(3);
    expect(currentSeal(withSeals(7))).toBeNull();
  });

  it('locks the de-scrambler below Level 3', () => {
    let s = progressionReducer(createInitialState(), { type: 'set-unredacted', value: true });
    expect(isDescramblerUnlocked(s)).toBe(false);
    expect(isUnredacted(s)).toBe(false);
    s = withSeals(2, s);
    expect(isDescramblerUnlocked(s)).toBe(true);
    expect(isUnredacted(s)).toBe(true);
  });

  it('caps the chosen clearance at the earned level', () => {
    const s = withSeals(1);
    const tooHigh = progressionReducer(s, { type: 'set-clearance', level: 'Level 5 - Black Dossier' });
    expect(tooHigh).toBe(s);
    const lower = progressionReducer(withSeals(4), {
      type: 'set-clearance',
      level: 'Level 2 - Confidential'
    });
    expect(effectiveClearance(lower)).toBe('Level 2 - Confidential');
    // A new seal raises the ceiling and the stale lower choice gives way.
    expect(effectiveClearance(withSeals(6, lower))).toMatch(/^Level 5/);
  });

  it('marks bypasses and answer-revealing hints as assisted', () => {
    const bypassed = progressionReducer(createInitialState(), {
      type: 'complete',
      puzzleId: 'seal-1',
      method: 'bypass'
    });
    expect(bypassed.completed['seal-1'].assisted).toBe(true);

    let s = createInitialState();
    s = progressionReducer(s, { type: 'reveal-hint', puzzleId: 'seal-1', tier: 3 });
    s = progressionReducer(s, { type: 'complete', puzzleId: 'seal-1', method: 'answer' });
    expect(s.completed['seal-1'].assisted).toBe(true);
  });

  it('upgrades an assisted completion when replayed unassisted', () => {
    let s = progressionReducer(createInitialState(), {
      type: 'complete',
      puzzleId: 'seal-1',
      method: 'bypass'
    });
    s = progressionReducer(s, { type: 'complete', puzzleId: 'seal-1', method: 'answer' });
    expect(s.completed['seal-1'].assisted).toBe(false);
  });

  it('collects fragments once and learns their letters', () => {
    let s = progressionReducer(createInitialState(), { type: 'collect-fragment', fragmentId: 'bogus' });
    expect(s.investigation.fragments).toEqual([]);
    const first = progressionReducer(s, { type: 'collect-fragment', fragmentId: 'frag-news' });
    s = progressionReducer(first, { type: 'collect-fragment', fragmentId: 'frag-news' });
    expect(s).toBe(first);
    expect([...knownLetters(s)].sort()).toEqual(['H', 'T']);
    // Breaking Seal III teaches the whole script.
    expect(knownLetters(withSeals(3)).size).toBeGreaterThan(10);
  });

  it('only completes the finale once the sixth seal is broken', () => {
    const early = progressionReducer(createInitialState(), { type: 'complete-finale' });
    expect(early.investigation.finaleComplete).toBe(false);
    const done = progressionReducer(withSeals(6), { type: 'complete-finale' });
    expect(done.investigation.finaleComplete).toBe(true);
    expect(done.completed['seal-7']).toBeTruthy();
  });

  it('purges the case but keeps discoveries, callsign and preferences', () => {
    let s = progressionReducer(withSeals(3), { type: 'discover', recordId: 'doc-010' });
    s = progressionReducer(s, { type: 'set-callsign', callsign: 'WREN' });
    s = progressionReducer(s, { type: 'set-preference', key: 'crt', value: true });
    const purged = progressionReducer(s, { type: 'purge-case' });
    expect(purged.completed).toEqual({});
    expect(earnedLevel(purged)).toBe(1);
    expect(purged.discovered['doc-010']).toBeTruthy();
    expect(purged.callsign).toBe('WREN');
    expect(purged.preferences.crt).toBe(true);
    expect(purged.investigation.prologueSeen).toBe(true);
  });

  it('resets progress but can keep preferences', () => {
    let s = progressionReducer(createInitialState(), { type: 'set-preference', key: 'crt', value: true });
    s = progressionReducer(s, { type: 'discover', recordId: 'doc-002' });
    const reset = progressionReducer(s, { type: 'reset', keepPreferences: true });
    expect(reset.discovered).toEqual({});
    expect(reset.preferences.crt).toBe(true);
    expect(progressionReducer(s, { type: 'reset' }).preferences.crt).toBe(false);
  });

  it('clamps the callsign', () => {
    const s = progressionReducer(createInitialState(), { type: 'set-callsign', callsign: 'x'.repeat(80) });
    expect(s.callsign).toHaveLength(24);
  });
});

describe('persistence', () => {
  it('round-trips through storage', () => {
    const storage = memoryStorage();
    const a = createProgressionStore(storage);
    a.dispatch({ type: 'discover', recordId: 'doc-007' });
    const b = createProgressionStore(storage);
    expect(b.getState().discovered['doc-007']).toBeTruthy();
  });

  it('discards malformed or tampered data', () => {
    expect(parseStoredState('not json')).toBeNull();
    expect(parseStoredState(JSON.stringify({ version: 3 }))).toBeNull();
    const parsed = parseStoredState(
      JSON.stringify({
        version: 2,
        access: { clearance: 'Level 9 - God Mode' },
        completed: { x: { at: 1 }, 'terminal-override': { at: 'T', method: 'answer' } }
      })
    );
    expect(parsed?.access.clearance).toBe(createInitialState().access.clearance);
    expect(parsed?.completed).toEqual({});
  });

  it('does not honour a stored clearance above what the completions earn', () => {
    const parsed = parseStoredState(
      JSON.stringify({ version: 1, access: { clearance: 'Level 5 - Black Dossier', chosenAt: 5 } })
    );
    expect(effectiveClearance(parsed!)).toBe(createInitialState().access.clearance);
  });

  it('migrates the old Seven Seals save', () => {
    const migrated = migrateLegacyInvestigation(
      JSON.stringify({
        solved: [1, 2, 99],
        hintsRevealed: { 2: 3 },
        fragments: ['frag-careers', 'nope'],
        prologueSeen: true
      })
    );
    expect(Object.keys(migrated!.completed).sort()).toEqual(['seal-1', 'seal-2']);
    expect(migrated!.completed['seal-2'].assisted).toBe(true);
    expect(migrated!.investigation.fragments).toEqual(['frag-careers']);
    expect(earnedLevel(migrated!)).toBe(3);
    expect(migrateLegacyInvestigation('{oops')).toBeNull();
  });

  it('adopts the legacy save only when no current save exists', () => {
    const storage = memoryStorage();
    storage.setItem(PUZZLE_SETTINGS.legacyInvestigationKey, JSON.stringify({ solved: [1] }));
    expect(createProgressionStore(storage).getState().completed['seal-1']).toBeTruthy();
    storage.setItem(PUZZLE_SETTINGS.storageKey, JSON.stringify(createInitialState()));
    expect(createProgressionStore(storage).getState().completed['seal-1']).toBeUndefined();
  });

  it('keeps working when storage throws', () => {
    const broken = memoryStorage();
    broken.setItem = () => {
      throw new Error('quota');
    };
    const store = createProgressionStore(broken);
    expect(() => store.dispatch({ type: 'discover', recordId: 'doc-001' })).not.toThrow();
    expect(store.getState().discovered['doc-001']).toBeTruthy();
  });
});
