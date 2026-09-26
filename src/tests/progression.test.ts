import { describe, expect, it } from 'vitest';
import {
  createInitialState,
  createProgressionStore,
  hasEarnedClearance,
  parseStoredState,
  progressionReducer
} from '@/lib/puzzles/progression';
import { PUZZLE_SETTINGS } from '@/config/puzzles';

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

  it('applies rewards on completion', () => {
    const s = progressionReducer(createInitialState(), {
      type: 'complete',
      puzzleId: 'palimpsest-safe',
      method: 'answer'
    });
    expect(s.completed['palimpsest-safe']).toMatchObject({ method: 'answer', assisted: false });
    expect(s.access.clearance).toMatch(/^Level 5/);
    expect(s.access.unredacted).toBe(true);
    expect(s.unlockedDownloads).toContain('palimpsest-master-dump');
    expect(hasEarnedClearance(s, 'Level 5 - Black Dossier')).toBe(true);
  });

  it('marks bypasses and answer-revealing hints as assisted', () => {
    const bypassed = progressionReducer(createInitialState(), {
      type: 'complete',
      puzzleId: 'palimpsest-safe',
      method: 'bypass'
    });
    expect(bypassed.completed['palimpsest-safe'].assisted).toBe(true);

    let s = createInitialState();
    s = progressionReducer(s, { type: 'reveal-hint', puzzleId: 'palimpsest-safe', tier: 99 });
    s = progressionReducer(s, { type: 'complete', puzzleId: 'palimpsest-safe', method: 'answer' });
    expect(s.completed['palimpsest-safe'].assisted).toBe(true);
  });

  it('upgrades an assisted completion when replayed unassisted', () => {
    let s = progressionReducer(createInitialState(), {
      type: 'complete',
      puzzleId: 'executive-master-key',
      method: 'bypass'
    });
    s = progressionReducer(s, { type: 'complete', puzzleId: 'executive-master-key', method: 'answer' });
    expect(s.completed['executive-master-key'].assisted).toBe(false);
  });

  it('does not grant clearance without a completion', () => {
    expect(hasEarnedClearance(createInitialState(), 'Level 5 - Black Dossier')).toBe(false);
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
    expect(parseStoredState(JSON.stringify({ version: 2 }))).toBeNull();
    const parsed = parseStoredState(
      JSON.stringify({ version: 1, access: { clearance: 'Level 9 - God Mode' }, completed: { x: { at: 1 } } })
    );
    expect(parsed?.access.clearance).toBe(createInitialState().access.clearance);
    expect(parsed?.completed).toEqual({});
  });

  it('keeps working when storage throws', () => {
    const broken = memoryStorage();
    broken.setItem = () => {
      throw new Error('quota');
    };
    broken.setItem.bind(broken);
    const store = createProgressionStore(broken);
    expect(() => store.dispatch({ type: 'discover', recordId: 'doc-001' })).not.toThrow();
    expect(store.getState().discovered['doc-001']).toBeTruthy();
    expect(PUZZLE_SETTINGS.storageKey).toBeTruthy();
  });
});
