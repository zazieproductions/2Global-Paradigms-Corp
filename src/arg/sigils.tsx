import React, { useId } from 'react';

// ============================================================================
// OCCULT SYMBOL LIBRARY — Ordo Vocis Profundae
// All sigils are hand-built SVG so they render identically everywhere.
// ============================================================================

import { polar, starPath, SYMBOL_FONT } from './geometry';

const TAU = Math.PI * 2;

export const PlanetGlyph: React.FC<{ glyph: string; className?: string; style?: React.CSSProperties }> = ({
  glyph,
  className = '',
  style
}) => (
  <span className={className} style={{ fontFamily: SYMBOL_FONT, fontVariantEmoji: 'text', ...style } as React.CSSProperties}>
    {glyph}
    {'\uFE0E'}
  </span>
);

// ----------------------------------------------------------------------------
// THE GREAT SIGIL OF THE ORDER
// circle · heptagram {7/3} · inverted triangle · carrier wave · seven nodes · eye
// ----------------------------------------------------------------------------
export const OrderSigil: React.FC<{
  size?: number;
  color?: string;
  className?: string;
  spin?: boolean;
  strokeWidth?: number;
  showText?: boolean;
}> = ({ size = 64, color = 'currentColor', className = '', spin = false, strokeWidth = 1.2, showText = false }) => {
  const uid = useId().replace(/:/g, '');
  const c = 50;
  const wave = Array.from({ length: 41 }, (_, i) => {
    const x = 22 + i * 1.4;
    const y = c + Math.sin((i / 40) * TAU * 2.5) * 4;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      aria-hidden
    >
      <defs>
        <path id={`rim-${uid}`} d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
      </defs>
      <g style={spin ? { transformOrigin: '50px 50px', animation: 'ovp-spin 60s linear infinite' } : undefined}>
        <circle cx={c} cy={c} r={47} />
        <circle cx={c} cy={c} r={37} strokeOpacity={0.6} />
        {showText && (
          <text fill={color} stroke="none" fontSize="5.2" letterSpacing="1.6" fontFamily="serif">
            <textPath href={`#rim-${uid}`}>ORDO · VOCIS · PROFUNDAE · MCMLXXI · XIV·VIII · ORDO · VOCIS · PROFUNDAE ·</textPath>
          </text>
        )}
        <path d={starPath(c, c, 37, 7, 3)} strokeLinejoin="round" />
        {Array.from({ length: 7 }, (_, i) => {
          const [x, y] = polar(c, c, 37, i, 7);
          return <circle key={i} cx={x} cy={y} r={2} fill={color} />;
        })}
      </g>
      <path d="M50,72 L31,39 L69,39 Z" strokeOpacity={0.85} />
      <path d={wave} strokeOpacity={0.9} />
      <ellipse cx={c} cy={46} rx={6} ry={3.4} />
      <circle cx={c} cy={46} r={1.4} fill={color} />
    </svg>
  );
};

// ----------------------------------------------------------------------------
// SEAL EMBLEM — a wax-seal style medallion for each of the seven seals
// ----------------------------------------------------------------------------
export const SealEmblem: React.FC<{
  numeral: string;
  glyph: string;
  subtitle: string;
  accent: string;
  state: 'sealed' | 'open' | 'broken';
  size?: number;
}> = ({ numeral, glyph, subtitle, accent, state, size = 96 }) => {
  const uid = useId().replace(/:/g, '');
  const col = state === 'sealed' ? '#334155' : accent;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <path id={`sr-${uid}`} d="M50,50 m-39,0 a39,39 0 1,1 78,0 a39,39 0 1,1 -78,0" />
        <radialGradient id={`sg-${uid}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={col} stopOpacity={state === 'broken' ? 0.35 : 0.18} />
          <stop offset="100%" stopColor="#000" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="47" fill={`url(#sg-${uid})`} stroke={col} strokeWidth="1.2" />
      <circle cx="50" cy="50" r="33" fill="none" stroke={col} strokeWidth="0.8" strokeDasharray={state === 'sealed' ? '2 2' : undefined} />
      <text fill={col} fontSize="6" letterSpacing="1.4" fontFamily="serif">
        <textPath href={`#sr-${uid}`}>{`${subtitle.toUpperCase()} · SIGILLUM ${numeral} · ${subtitle.toUpperCase()} ·`}</textPath>
      </text>
      <path d={starPath(50, 50, 33, 7, 3)} fill="none" stroke={col} strokeOpacity={0.3} strokeWidth="0.6" />
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fill={col}
        fontSize="24"
        style={{ fontFamily: SYMBOL_FONT }}
      >
        {glyph + '\uFE0E'}
      </text>
      <text x="50" y="76" textAnchor="middle" fill={col} fontSize="7" fontFamily="serif" letterSpacing="1">
        {numeral}
      </text>
      {state === 'broken' && (
        <path d="M22,18 L44,42 L38,52 L60,64 L54,74 L80,86" fill="none" stroke="#05070c" strokeWidth="2.6" />
      )}
      {state === 'sealed' && (
        <g stroke="#475569" strokeWidth="1">
          <rect x="44" y="84" width="12" height="9" rx="1.5" fill="#0b0f19" />
          <path d="M46.5,84 v-3 a3.5,3.5 0 0,1 7,0 v3" fill="none" />
        </g>
      )}
    </svg>
  );
};

// ----------------------------------------------------------------------------
// CHOIR SCRIPT — the Order's cipher alphabet, drawn on the 3×3 Saturn grid
// ----------------------------------------------------------------------------
const GRID: [number, number][] = [
  [0, 0], [1, 0], [2, 0],
  [0, 1], [1, 1], [2, 1],
  [0, 2], [1, 2], [2, 2]
];
const SEGMENTS: [number, number][] = [
  [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8],
  [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8],
  [0, 4], [4, 8], [2, 4], [4, 6], [1, 3], [1, 5], [3, 7], [5, 7]
];

const mulberry = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface GlyphSpec {
  segs: number[];
  node: number;
  ring: boolean;
}

const CHOIR_ALPHABET: Record<string, GlyphSpec> = (() => {
  const out: Record<string, GlyphSpec> = {};
  const seen = new Set<string>();
  const rnd = mulberry(1480);
  for (let i = 0; i < 26; i++) {
    let spec: GlyphSpec;
    let key: string;
    do {
      const segs = new Set<number>();
      while (segs.size < 3) segs.add(Math.floor(rnd() * SEGMENTS.length));
      const sorted = [...segs].sort((a, b) => a - b);
      spec = { segs: sorted, node: Math.floor(rnd() * 9), ring: rnd() > 0.55 };
      key = sorted.join(',') + '|' + spec.node + spec.ring;
    } while (seen.has(key));
    seen.add(key);
    out[String.fromCharCode(65 + i)] = spec;
  }
  return out;
})();

export const ChoirGlyph: React.FC<{
  letter: string;
  size?: number;
  color?: string;
  dim?: boolean;
  className?: string;
}> = ({ letter, size = 28, color = 'currentColor', dim = false, className = '' }) => {
  const spec = CHOIR_ALPHABET[letter.toUpperCase()];
  if (!spec) return <span style={{ display: 'inline-block', width: size }} />;
  const p = (i: number) => {
    const [gx, gy] = GRID[i];
    return [6 + gx * 14, 6 + gy * 14] as const;
  };
  const [nx, ny] = p(spec.node);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden>
      {GRID.map((_, i) => {
        const [x, y] = p(i);
        return <circle key={i} cx={x} cy={y} r={0.9} fill={color} opacity={dim ? 0.15 : 0.25} />;
      })}
      {spec.segs.map((si) => {
        const [a, b] = SEGMENTS[si];
        const [x1, y1] = p(a);
        const [x2, y2] = p(b);
        return (
          <line
            key={si}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={2.4}
            strokeLinecap="round"
            opacity={dim ? 0.45 : 1}
          />
        );
      })}
      {spec.ring ? (
        <circle cx={nx} cy={ny} r={3.4} fill="none" stroke={color} strokeWidth={1.6} opacity={dim ? 0.45 : 1} />
      ) : (
        <circle cx={nx} cy={ny} r={2.4} fill={color} opacity={dim ? 0.45 : 1} />
      )}
    </svg>
  );
};

/** Render a phrase in Choir Script, one glyph per letter. */
export const ChoirText: React.FC<{ text: string; size?: number; color?: string; className?: string }> = ({
  text,
  size = 22,
  color = 'currentColor',
  className = ''
}) => (
  <span className={`inline-flex flex-wrap gap-x-3 gap-y-1 ${className}`}>
    {text.split(' ').map((word, wi) => (
      <span key={wi} className="inline-flex gap-0.5">
        {word.split('').map((ch, ci) => (
          <ChoirGlyph key={ci} letter={ch} size={size} color={color} />
        ))}
      </span>
    ))}
  </span>
);

// ----------------------------------------------------------------------------
// Decorative bits
// ----------------------------------------------------------------------------
export const AlchemicalRow: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`} style={{ fontFamily: SYMBOL_FONT }}>
    {['🜍', '🜔', '☿', '🜂', '🜄', '🜁', '🜃', '🜚', '🜛'].map((g, i) => (
      <span key={i}>{g + '\uFE0E'}</span>
    ))}
  </div>
);

/** A large, near-invisible sigil fixed behind the archive. */
export const SigilWatermark: React.FC<{ intensity?: number }> = ({ intensity = 0.035 }) => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
    <div style={{ opacity: intensity }} className="text-fuchsia-300">
      <OrderSigil size={720} spin showText strokeWidth={0.5} />
    </div>
  </div>
);
