import { useId, type CSSProperties } from 'react';
import { CHOIR_ALPHABET, CHOIR_GRID, CHOIR_SEGMENTS } from '@/lib/puzzles/choir-script';
import { polar, starPath, TAU } from '@/lib/utils/geometry';
import { cn } from '@/lib/utils/cn';

// ============================================================================
// OCCULT SYMBOL LIBRARY — Ordo Vocis Profundae
// All sigils are hand-built SVG so they render identically everywhere.
// Every sigil is decorative (aria-hidden); meaning is always also given in text.
// ============================================================================

const SYMBOL_FONT = 'var(--font-symbol)';
const SEALED = 'var(--color-seal-sealed)';

/** A planetary glyph forced to text presentation. Pass `label` when it carries meaning. */
export function PlanetGlyph({
  glyph,
  className = '',
  style,
  label
}: {
  glyph: string;
  className?: string;
  style?: CSSProperties;
  label?: string;
}) {
  return (
    <span
      className={cn('font-symbol', className)}
      style={style}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
    >
      {glyph}
      {'\uFE0E'}
    </span>
  );
}

// ----------------------------------------------------------------------------
// THE GREAT SIGIL OF THE ORDER
// circle · heptagram {7/3} · inverted triangle · carrier wave · seven nodes · eye
// ----------------------------------------------------------------------------
export function OrderSigil({
  size = 64,
  color = 'currentColor',
  className = '',
  spin = false,
  strokeWidth = 1.2,
  showText = false
}: {
  size?: number;
  color?: string;
  className?: string;
  spin?: boolean;
  strokeWidth?: number;
  showText?: boolean;
}) {
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
      <g
        className={spin ? 'ovp-spin-slow' : undefined}
        style={spin ? { transformOrigin: '50px 50px' } : undefined}
      >
        <circle cx={c} cy={c} r={47} />
        <circle cx={c} cy={c} r={37} strokeOpacity={0.6} />
        {showText && (
          <text fill={color} stroke="none" fontSize="5.2" letterSpacing="1.6" fontFamily="serif">
            <textPath href={`#rim-${uid}`}>
              ORDO · VOCIS · PROFUNDAE · MCMLXXI · XIV·VIII · ORDO · VOCIS · PROFUNDAE ·
            </textPath>
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
}

// ----------------------------------------------------------------------------
// SEAL EMBLEM — a wax-seal style medallion for each of the seven seals
// ----------------------------------------------------------------------------
export function SealEmblem({
  numeral,
  glyph,
  subtitle,
  accent,
  state,
  size = 96
}: {
  numeral: string;
  glyph: string;
  subtitle: string;
  accent: string;
  state: 'sealed' | 'open' | 'broken';
  size?: number;
}) {
  const uid = useId().replace(/:/g, '');
  const col = state === 'sealed' ? SEALED : accent;
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
      <circle
        cx="50"
        cy="50"
        r="33"
        fill="none"
        stroke={col}
        strokeWidth="0.8"
        strokeDasharray={state === 'sealed' ? '2 2' : undefined}
      />
      <text fill={col} fontSize="6" letterSpacing="1.4" fontFamily="serif">
        <textPath
          href={`#sr-${uid}`}
        >{`${subtitle.toUpperCase()} · SIGILLUM ${numeral} · ${subtitle.toUpperCase()} ·`}</textPath>
      </text>
      <path d={starPath(50, 50, 33, 7, 3)} fill="none" stroke={col} strokeOpacity={0.3} strokeWidth="0.6" />
      <text x="50" y="57" textAnchor="middle" fill={col} fontSize="24" style={{ fontFamily: SYMBOL_FONT }}>
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
}

// ----------------------------------------------------------------------------
// CHOIR SCRIPT — the Order's cipher alphabet, drawn on the 3×3 Saturn grid
// ----------------------------------------------------------------------------

export function ChoirGlyph({
  letter,
  size = 28,
  color = 'currentColor',
  dim = false,
  className = ''
}: {
  letter: string;
  size?: number;
  color?: string;
  dim?: boolean;
  className?: string;
}) {
  const spec = CHOIR_ALPHABET[letter.toUpperCase()];
  if (!spec) return <span style={{ display: 'inline-block', width: size }} />;
  const p = (i: number) => {
    const [gx, gy] = CHOIR_GRID[i];
    return [6 + gx * 14, 6 + gy * 14] as const;
  };
  const [nx, ny] = p(spec.node);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden>
      {CHOIR_GRID.map((_, i) => {
        const [x, y] = p(i);
        return <circle key={i} cx={x} cy={y} r={0.9} fill={color} opacity={dim ? 0.15 : 0.25} />;
      })}
      {spec.segs.map((si) => {
        const [a, b] = CHOIR_SEGMENTS[si];
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
        <circle
          cx={nx}
          cy={ny}
          r={3.4}
          fill="none"
          stroke={color}
          strokeWidth={1.6}
          opacity={dim ? 0.45 : 1}
        />
      ) : (
        <circle cx={nx} cy={ny} r={2.4} fill={color} opacity={dim ? 0.45 : 1} />
      )}
    </svg>
  );
}

/** Render a phrase in Choir Script, one glyph per letter. Decorative: give the reading in text elsewhere. */
export function ChoirText({
  text,
  size = 22,
  color = 'currentColor',
  className = ''
}: {
  text: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex flex-wrap gap-x-3 gap-y-1 ${className}`} aria-hidden>
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="inline-flex gap-0.5">
          {word.split('').map((ch, ci) => (
            <ChoirGlyph key={ci} letter={ch} size={size} color={color} />
          ))}
        </span>
      ))}
    </span>
  );
}

// ----------------------------------------------------------------------------
// Decorative bits
// ----------------------------------------------------------------------------
export function AlchemicalRow({ className = '' }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 font-symbol', className)} aria-hidden>
      {['🜍', '🜔', '☿', '🜂', '🜄', '🜁', '🜃', '🜚', '🜛'].map((g, i) => (
        <span key={i}>{g + '\uFE0E'}</span>
      ))}
    </div>
  );
}

/** A large, near-invisible sigil fixed behind the archive. */
export function SigilWatermark({ intensity = 0.035 }: { intensity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      aria-hidden
    >
      <div style={{ opacity: intensity }} className="text-fuchsia-300">
        <OrderSigil size={720} spin showText strokeWidth={0.5} />
      </div>
    </div>
  );
}
