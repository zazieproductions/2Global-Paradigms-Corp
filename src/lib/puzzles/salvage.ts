/**
 * DIRECTIVE 17 — tape salvage. Pure functions, no React, no storage.
 *
 * A purged record survives on the Postojna spool as out-of-order shard
 * fragments. The player reassembles one by ordering its shards so the reel
 * locators ascend (reel offsets, watch timestamps or frame numbers). The
 * validation is ordering, not answer-typing: `isSpliceCorrect()` is the only
 * judge, and components render its verdict — they never compare answers
 * themselves (docs/PUZZLE_SYSTEM.md).
 */
import type { ProgressionState, PurgedGhost, SalvageShard } from '@/types';
import { GHOSTS } from '@/content/restoration/purge-manifest';

const GHOSTS_BY_ID = new Map(GHOSTS.map((g) => [g.id, g]));
const GHOSTS_BY_CODE = new Map(GHOSTS.map((g) => [g.code.toUpperCase(), g]));

export const getGhost = (id: string): PurgedGhost | undefined => GHOSTS_BY_ID.get(id);

/** Resolve a cited-but-missing archive code (case-insensitive) to its tape ghost. */
export const ghostForCode = (code: string): PurgedGhost | undefined =>
  GHOSTS_BY_CODE.get(code.trim().toUpperCase());

export const isGhostCode = (code: string): boolean => ghostForCode(code) !== undefined;

/** True when the id names a known tape ghost (persistence validation). */
export const knownGhost = (id: string): boolean => GHOSTS_BY_ID.has(id);

/** Shards in tape order (ascending `order`). */
export const spliceOrder = (ghost: PurgedGhost): SalvageShard[] =>
  [...ghost.shards].sort((a, b) => a.order - b.order);

/** The recovered body of a ghost: shards in tape order. */
export const ghostBody = (ghost: PurgedGhost): string =>
  spliceOrder(ghost)
    .map((s) => s.text)
    .join('\n\n');

/** True when the given shard orders ascend — the splice holds. */
export const isSpliceCorrect = (orders: readonly number[]): boolean =>
  orders.every((o, i) => i === 0 || o > orders[i - 1]);

/** Move shard `index` one position up (-1) or down (+1). Returns a new list. */
export function moveShard(list: SalvageShard[], index: number, delta: -1 | 1): SalvageShard[] {
  const target = index + delta;
  if (index < 0 || index >= list.length || target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** Deterministic PRNG (mulberry32) so a ghost scrambles identically on every build. */
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const seedFrom = (id: string): number => {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/**
 * Shards as the spool returns them: a deterministic permutation of the ghost's
 * shards that is never already in splice order (a sorted scramble would be a
 * no-puzzle).
 */
export function scrambledShards(ghost: PurgedGhost): SalvageShard[] {
  const rnd = mulberry32(seedFrom(ghost.id));
  const out = [...ghost.shards];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (isSpliceCorrect(out.map((s) => s.order))) {
    out.push(out.shift()!);
  }
  return out;
}

/** Directive 17's own record is replayed only when every ghost is spliced. */
export const allGhostsSalvaged = (state: ProgressionState): boolean =>
  GHOSTS.every((g) => state.investigation.salvaged.includes(g.id));

/** How many ghosts are spliced. */
export const salvagedCount = (state: ProgressionState): number =>
  GHOSTS.filter((g) => state.investigation.salvaged.includes(g.id)).length;
