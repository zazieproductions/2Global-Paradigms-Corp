/**
 * CHOIR CODE — the Order's cipher alphabet, drawn on the 3×3 Saturn grid.
 *
 * Each character is three strokes between grid points plus a marked node. The
 * alphabet is generated deterministically (seed 1480) so it is identical on
 * every build. Rendered by `ChoirGlyph` in components/ui/order-marks.tsx.
 */

/** Grid point coordinates (column, row). */
export const CHOIR_GRID: readonly (readonly [number, number])[] = [
  [0, 0],
  [1, 0],
  [2, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2]
];

/** Every stroke a glyph may use (pairs of grid indices). */
export const CHOIR_SEGMENTS: readonly (readonly [number, number])[] = [
  [0, 1],
  [1, 2],
  [3, 4],
  [4, 5],
  [6, 7],
  [7, 8],
  [0, 3],
  [3, 6],
  [1, 4],
  [4, 7],
  [2, 5],
  [5, 8],
  [0, 4],
  [4, 8],
  [2, 4],
  [4, 6],
  [1, 3],
  [1, 5],
  [3, 7],
  [5, 7]
];

export interface ChoirGlyphSpec {
  segs: number[];
  node: number;
  ring: boolean;
}

const mulberry = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const CHOIR_ALPHABET: Readonly<Record<string, ChoirGlyphSpec>> = (() => {
  const out: Record<string, ChoirGlyphSpec> = {};
  const seen = new Set<string>();
  const rnd = mulberry(1480);
  for (let i = 0; i < 26; i++) {
    let spec: ChoirGlyphSpec;
    let key: string;
    do {
      const segs = new Set<number>();
      while (segs.size < 3) segs.add(Math.floor(rnd() * CHOIR_SEGMENTS.length));
      const sorted = [...segs].sort((a, b) => a - b);
      spec = { segs: sorted, node: Math.floor(rnd() * 9), ring: rnd() > 0.55 };
      key = sorted.join(',') + '|' + spec.node + spec.ring;
    } while (seen.has(key));
    seen.add(key);
    out[String.fromCharCode(65 + i)] = spec;
  }
  return out;
})();
