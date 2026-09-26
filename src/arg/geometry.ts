// Sacred geometry helpers for the Order's sigils.

export const TAU = Math.PI * 2;

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

export const SYMBOL_FONT =
  "'Noto Sans Symbols', 'Noto Sans Symbols 2', 'Segoe UI Symbol', 'Apple Symbols', 'DejaVu Sans', serif";

