/**
 * Directive 17 — the unquiet tape.
 *
 * Covers the purge-salvage layer: content sanity (ghosts answer the archive's
 * "not recovered" citations), the pure splice engine, reducer/persistence
 * integration, and the rule that this hidden layer never leaks the Seven Seals
 * answers that are not already public.
 */
import { describe, expect, it } from 'vitest';
import type { ProgressionState, SalvageShard } from '@/types';
import { DIRECTIVE_17, GHOSTS, PERSONNEL } from '@/content';
import {
  allGhostsSalvaged,
  ghostBody,
  ghostForCode,
  isGhostCode,
  isSpliceCorrect,
  knownGhost,
  moveShard,
  salvagedCount,
  scrambledShards,
  spliceOrder
} from '@/lib/puzzles/salvage';
import {
  createInitialState,
  migrateLegacyInvestigation,
  parseStoredState,
  progressionReducer
} from '@/lib/puzzles/progression';
import { resolveDocument } from '@/lib/archive/records';
import { SEAL_ANSWERS } from './seal-fixtures';

const orders = (list: SalvageShard[]) => list.map((s) => s.order);

describe('Directive 17 content', () => {
  it('keeps ghost codes unique, cited, and missing from the live index', () => {
    const codes = GHOSTS.map((g) => g.code);
    expect(new Set(codes).size).toBe(codes.length);
    expect(GHOSTS.length).toBeGreaterThanOrEqual(3);
    for (const g of GHOSTS) {
      // The hook: every ghost is a code the dossiers cite but the index refuses.
      expect(resolveDocument(g.code), g.code).toBeUndefined();
      const cited = PERSONNEL.filter((p) => p.linkedDocuments.includes(g.code));
      expect(
        cited.map((p) => p.id),
        `${g.code} must be cited by a dossier`
      ).toEqual(g.citedBy);
    }
  });

  it('gives every ghost a solvable splice (unique locators, orders 1..n)', () => {
    for (const g of GHOSTS) {
      expect(g.shards.length, g.id).toBeGreaterThanOrEqual(4);
      const locators = g.shards.map((s) => s.locator);
      expect(new Set(locators).size, g.id).toBe(locators.length);
      expect(
        [...orders(g.shards)].sort((a, b) => a - b),
        g.id
      ).toEqual(g.shards.map((_, i) => i + 1));
      for (const s of g.shards) expect(s.text.trim(), `${g.id}/${s.locator}`).toBeTruthy();
    }
  });

  it('never scrambles a ghost into its solution', () => {
    for (const g of GHOSTS) expect(isSpliceCorrect(orders(scrambledShards(g))), g.id).toBe(false);
  });

  it('does not leak the answers that stay behind the seals', () => {
    // The Name (seal VII) and the safe combination (seal VI) must never appear
    // in this hidden layer; place-names that are already public are fine.
    const haystack = [
      ...GHOSTS.flatMap((g) => [g.title, g.preamble, g.closing, ...g.shards.map((s) => s.text)]),
      ...DIRECTIVE_17.lines
    ]
      .join('\n')
      .toUpperCase();
    for (const secret of [SEAL_ANSWERS[7], SEAL_ANSWERS[6]]) {
      expect(haystack.includes(secret.toUpperCase()), `leaks "${secret}"`).toBe(false);
    }
  });
});

describe('splice engine', () => {
  const ghost = GHOSTS[0];

  it('resolves ghost codes case-insensitively and rejects unknown ones', () => {
    expect(ghostForCode(ghost.code.toLowerCase())?.id).toBe(ghost.id);
    expect(ghostForCode(`  ${ghost.code} `)?.id).toBe(ghost.id);
    expect(ghostForCode('DOC-0000-NOTHING')).toBeUndefined();
    expect(isGhostCode(ghost.code)).toBe(true);
    expect(knownGhost(ghost.id)).toBe(true);
    expect(knownGhost('ghost-999')).toBe(false);
  });

  it('scrambles deterministically and always as a permutation', () => {
    const a = scrambledShards(ghost);
    const b = scrambledShards(ghost);
    expect(orders(a)).toEqual(orders(b));
    expect([...orders(a)].sort((x, y) => x - y)).toEqual(orders(spliceOrder(ghost)));
  });

  it('validates strictly ascending order only', () => {
    expect(isSpliceCorrect([1, 2, 3])).toBe(true);
    expect(isSpliceCorrect([1, 1, 2])).toBe(false);
    expect(isSpliceCorrect([3, 2, 1])).toBe(false);
    expect(isSpliceCorrect([1, 3, 2])).toBe(false);
  });

  it('moves shards one position and never off the ends', () => {
    const list = spliceOrder(ghost);
    const up = moveShard(list, 1, -1);
    expect(orders(up)).toEqual([list[1].order, list[0].order, ...orders(list.slice(2))]);
    expect(moveShard(list, 0, -1)).toBe(list);
    expect(moveShard(list, list.length - 1, 1)).toBe(list);
  });

  it('returns the body in tape order', () => {
    const body = ghostBody(ghost);
    const first = spliceOrder(ghost)[0].text;
    expect(body.startsWith(first)).toBe(true);
  });
});

describe('salvage progression', () => {
  const salvageAll = (state: ProgressionState): ProgressionState =>
    GHOSTS.reduce(
      (s, g) => progressionReducer(s, { type: 'salvage-ghost', ghostId: g.id, at: `T-${g.id}` }),
      state
    );

  it('records each splice once and journals it', () => {
    const s1 = progressionReducer(createInitialState(), {
      type: 'salvage-ghost',
      ghostId: GHOSTS[0].id,
      at: 'T1'
    });
    const s2 = progressionReducer(s1, { type: 'salvage-ghost', ghostId: GHOSTS[0].id, at: 'T2' });
    expect(s2).toBe(s1);
    expect(s1.investigation.salvaged).toEqual([GHOSTS[0].id]);
    const entry = s1.investigation.journal.at(-1);
    expect(entry?.kind).toBe('salvage');
    expect(entry?.text).toContain(GHOSTS[0].code);
  });

  it('ignores unknown ghost ids', () => {
    const s = progressionReducer(createInitialState(), {
      type: 'salvage-ghost',
      ghostId: 'ghost-999'
    });
    expect(s.investigation.salvaged).toEqual([]);
  });

  it('completes the directive only when every ghost is spliced', () => {
    const partial = progressionReducer(createInitialState(), {
      type: 'salvage-ghost',
      ghostId: GHOSTS[0].id
    });
    expect(allGhostsSalvaged(partial)).toBe(false);
    expect(salvagedCount(partial)).toBe(1);
    expect(allGhostsSalvaged(salvageAll(createInitialState()))).toBe(true);
    expect(salvagedCount(salvageAll(createInitialState()))).toBe(GHOSTS.length);
  });

  it('keeps spliced ghosts through a case purge, and wipes them on reset', () => {
    const full = salvageAll(createInitialState());
    const purged = progressionReducer(full, { type: 'purge-case', at: 'T9' });
    expect(purged.investigation.salvaged).toEqual(full.investigation.salvaged);
    expect(purged.investigation.fragments).toEqual([]);
    const reset = progressionReducer(full, { type: 'reset' });
    expect(reset.investigation.salvaged).toEqual([]);
  });

  it('drops unknown salvaged ids when loading a save', () => {
    const raw = JSON.stringify({
      version: 2,
      investigation: { salvaged: [GHOSTS[0].id, 'ghost-999'], journal: [] }
    });
    const state = parseStoredState(raw);
    expect(state?.investigation.salvaged).toEqual([GHOSTS[0].id]);
    const legacy = migrateLegacyInvestigation(JSON.stringify({ solved: [1] }));
    expect(legacy?.investigation.salvaged).toEqual([]);
  });
});
