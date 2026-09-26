import { describe, expect, it } from 'vitest';
import { PUZZLES } from '@/content';
import {
  getPuzzle,
  nextHint,
  normalizeAnswer,
  revealedHints,
  validatePuzzleAnswer
} from '@/lib/puzzles/validate';
import { createInitialState } from '@/lib/puzzles/progression';

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
  it('accepts the canonical answers', () => {
    expect(validatePuzzleAnswer('palimpsest-safe', '1480').ok).toBe(true);
    expect(validatePuzzleAnswer('palimpsest-safe', ' 1989 ').ok).toBe(true);
    expect(validatePuzzleAnswer('executive-master-key', 'PALIMPSEST').ok).toBe(true);
    expect(validatePuzzleAnswer('terminal-override', '432-88').ok).toBe(true);
    expect(validatePuzzleAnswer('boot-override', '0432').ok).toBe(true);
  });

  it('rejects wrong, empty and unknown input with a reason', () => {
    expect(validatePuzzleAnswer('palimpsest-safe', '0000')).toMatchObject({ ok: false, reason: 'incorrect' });
    expect(validatePuzzleAnswer('palimpsest-safe', '   ')).toMatchObject({ ok: false, reason: 'empty' });
    expect(validatePuzzleAnswer('nope', '1480')).toMatchObject({ ok: false, reason: 'unknown-puzzle' });
  });

  it('is case-sensitive only where the definition says so', () => {
    // palimpsest-safe normalises with trim only; 4-digit codes are unaffected
    expect(normalizeAnswer('  AbC ', ['trim'])).toBe('AbC');
    expect(normalizeAnswer('  AbC ', ['trim', 'lowercase'])).toBe('abc');
  });

  it('works with a progression state argument', () => {
    expect(validatePuzzleAnswer('palimpsest-safe', '3120', createInitialState()).ok).toBe(true);
  });
});

describe('hints', () => {
  it('reveal progressively', () => {
    const p = getPuzzle('palimpsest-safe')!;
    expect(revealedHints(p, 0)).toHaveLength(0);
    expect(nextHint(p, 0)?.tier).toBe(p.hints[0].tier);
    const last = p.hints[p.hints.length - 1];
    expect(nextHint(p, last.tier)).toBeUndefined();
    expect(revealedHints(p, last.tier)).toHaveLength(p.hints.length);
  });
});
