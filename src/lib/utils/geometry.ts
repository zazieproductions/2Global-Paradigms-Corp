/** Diagram helpers for the Order's figures (pure, SVG coordinate space). */

export const TAU = Math.PI * 2;

/** Point `i` of `n` evenly spaced on a circle (first point at 12 o'clock). */
export const polar = (cx: number, cy: number, r: number, i: number, n: number, rot = -Math.PI / 2) => {
  const a = rot + (TAU * i) / n;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
};

/** {n/k} star polygon path — {7/3} is the Order's heptagram. */
export const starPath = (cx: number, cy: number, r: number, n = 7, k = 3) => {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const [x, y] = polar(cx, cy, r, (i * k) % n, n);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(' ') + ' Z';
};
