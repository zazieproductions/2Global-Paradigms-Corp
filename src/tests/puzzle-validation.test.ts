import { describe, expect, it } from 'vitest';
import { PUZZLES } from '@/content';
import {
  getPuzzle,
  nextHint,
  normalizeAnswer,
  revealedHints,
  validatePuzzleAnswer,
  checkAnswer
} from '@/lib/puzzles/validate';
import { createInitialState, progressionReducer } from '@/lib/puzzles/progression';
import { REVOKED_CODES } from '@/config/puzzles';
import { SEAL_ANSWERS, withSeals } from './seal-fixtures';

describe('puzzle definitions', () => {
  it('have unique ids and the required fields', () => {
    const ids = PUZZLES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PUZZLES) {
      expect(p.title).toBeTruthy();
      expect(p.narrative).toBeTruthy();
      expect(p.validation.method).toBe('sha256');
      if (p.validation.method === 'sha256') expect(p.validation.digests.length).toBeGreaterThan(0);
      expect(p.hints.length).toBeGreaterThan(0);
      expect(p.success.heading).toBeTruthy();
      expect(p.success.body).toBeTruthy();
      // hint tiers ascend, and only the last tier may reveal the answer
      const tiers = p.hints.map((h) => h.tier);
      expect([...tiers].sort((a, b) => a - b)).toEqual(tiers);
      p.hints.slice(0, -1).forEach((h) => expect(h.revealsAnswer).toBeFalsy());
    }
  });

  it('store only 64-char hex digests, never plaintext answers', () => {
    for (const p of PUZZLES) {
      if (p.validation.method !== 'sha256') continue;
      for (const d of p.validation.digests) expect(d).toMatch(/^[0-9a-f]{64}$/);
    }
  });
});

describe('validatePuzzleAnswer', () => {
  it('accepts every seal answer, normalised alnum-upper', () => {
    const ready = withSeals(6);
    for (const [id, answer] of Object.entries(SEAL_ANSWERS)) {
      expect(validatePuzzleAnswer(`seal-${id}`, answer, ready).ok, `seal ${id}`).toBe(true);
    }
    expect(validatePuzzleAnswer('seal-2', '  li-turgy ', ready).ok).toBe(true);
    expect(validatePuzzleAnswer('seal-4', ' 14.8 | 432 | 741 ', ready).ok).toBe(true);
    expect(validatePuzzleAnswer('seal-4', '14.8 / 432 / 741', ready).ok).toBe(false);
  });

  it('accepts the gateway keys, including the VESPER variant', () => {
    let s = createInitialState();
    expect(validatePuzzleAnswer('gateway-sequence', 'vespar', s).ok).toBe(true);
    expect(validatePuzzleAnswer('gateway-sequence', 'VESPER', s).ok).toBe(true);
    s = progressionReducer(s, { type: 'complete', puzzleId: 'gateway-sequence', method: 'answer' });
    expect(validatePuzzleAnswer('gateway-signal', '987316', s).ok).toBe(true);
    s = progressionReducer(s, { type: 'complete', puzzleId: 'gateway-signal', method: 'answer' });
    expect(validatePuzzleAnswer('gateway-waveform', 'cold', s).ok).toBe(true);
    s = progressionReducer(s, { type: 'complete', puzzleId: 'gateway-waveform', method: 'answer' });
    expect(validatePuzzleAnswer('gateway-transmission', 'VESPAR|987316|COLD', s).ok).toBe(true);
    expect(validatePuzzleAnswer('gateway-transmission', 'VESPER|987316|COLD', s).ok).toBe(true);
    expect(validatePuzzleAnswer('gateway-transmission', 'VESPAR987316COLD', s).ok).toBe(false);
  });

  it('keeps later seals unavailable until the previous one is broken', () => {
    expect(validatePuzzleAnswer('seal-6', SEAL_ANSWERS[6], withSeals(4))).toMatchObject({
      ok: false,
      reason: 'unavailable'
    });
    // …but the fiction can still tell a correct-yet-premature answer apart.
    expect(checkAnswer('seal-6', SEAL_ANSWERS[6])).toBe(true);
    expect(checkAnswer('seal-6', '0000')).toBe(false);
  });

  it('grants nothing for the revoked v1 codes', () => {
    for (const code of REVOKED_CODES) {
      for (const p of PUZZLES) expect(checkAnswer(p.id, code), `${p.id} / ${code}`).toBe(false);
    }
    expect(getPuzzle('palimpsest-safe')).toBeUndefined();
    expect(getPuzzle('terminal-override')).toBeUndefined();
  });

  it('rejects wrong, empty and unknown input with a reason', () => {
    expect(validatePuzzleAnswer('seal-1', '123456789')).toMatchObject({ ok: false, reason: 'incorrect' });
    expect(validatePuzzleAnswer('seal-1', '   ')).toMatchObject({ ok: false, reason: 'empty' });
    expect(validatePuzzleAnswer('nope', '1480')).toMatchObject({ ok: false, reason: 'unknown-puzzle' });
  });

  it('normalises only as the definition says', () => {
    expect(normalizeAnswer('  AbC ', ['trim'])).toBe('AbC');
    expect(normalizeAnswer('  AbC ', ['trim', 'lowercase'])).toBe('abc');
    expect(normalizeAnswer(' 14.8 | 432 ', ['alnum-upper'])).toBe('14.8|432');
  });
});

describe('hints', () => {
  it('reveal progressively', () => {
    const p = getPuzzle('seal-1')!;
    expect(revealedHints(p, 0)).toHaveLength(0);
    expect(nextHint(p, 0)?.tier).toBe(p.hints[0].tier);
    const last = p.hints[p.hints.length - 1];
    expect(nextHint(p, last.tier)).toBeUndefined();
    expect(revealedHints(p, last.tier)).toHaveLength(p.hints.length);
  });
});
