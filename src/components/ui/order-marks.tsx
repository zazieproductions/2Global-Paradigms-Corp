import { CHOIR_ALPHABET, CHOIR_GRID, CHOIR_SEGMENTS } from '@/lib/puzzles/choir-script';
import { cn } from '@/lib/utils/cn';

// ============================================================================
// ORDER MARKS — Ordo Vocis Profundae
//
// The Order is a filing system with a liturgy attached, so it is drawn the
// way the rest of the archive is drawn: numerals, index plates, hairlines
// and stamps. No seals, no sigils, no symbols that mean nothing. Every mark
// here carries its own meaning in text next to it, or is decorative and
// marked aria-hidden.
// ============================================================================

/** A planetary glyph forced to text presentation. Pass `label` when it carries meaning. */
export function PlanetGlyph({
  glyph,
  className = '',
  style,
  label
}: {
  glyph: string;
  className?: string;
  style?: React.CSSProperties;
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
// THE ORDER'S MARK — a plain block plate carrying the Order's initials and
// its founding year. Reads as a company mark, because that is what it is.
// ----------------------------------------------------------------------------
export function OrderPlate({
  size = 56,
  className = '',
  established = '1971'
}: {
  size?: number;
  className?: string;
  established?: string;
}) {
  // Below 40px there is no room for the founding year; the initials carry it.
  const compact = size < 40;
  return (
    <span
      className={cn(
        'inline-flex shrink-0 flex-col items-center justify-center rounded border border-fuchsia-800/70 bg-black/40 font-order',
        className
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="font-bold leading-none tracking-[0.12em] text-fuchsia-300"
        style={{ fontSize: Math.round(size * (compact ? 0.34 : 0.23)) }}
      >
        OVP
      </span>
      {!compact && (
        <>
          <span className="mt-1 w-4 border-t border-fuchsia-800" style={{ borderTopWidth: 1 }} />
          <span
            className="mt-1 leading-none tracking-[0.14em] text-fuchsia-400/70"
            style={{ fontSize: Math.max(7, Math.round(size * 0.13)) }}
          >
            {established}
          </span>
        </>
      )}
    </span>
  );
}

// ----------------------------------------------------------------------------
// SEAL DISC — one of the seven seals, as a numbered index disc.
// State is carried by the ring (dashed = bound, solid = open) and by a struck
// rule across a broken seal. The numeral is always legible; colour is not the
// only signal, because every disc is labelled in text where it is used.
// ----------------------------------------------------------------------------
export function SealDisc({
  numeral,
  state,
  accent,
  size = 74
}: {
  numeral: string;
  state: 'sealed' | 'open' | 'broken';
  accent: string;
  size?: number;
}) {
  const col = state === 'sealed' ? 'var(--color-seal-sealed)' : accent;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="var(--color-inset)"
        stroke={col}
        strokeWidth="1.6"
        strokeDasharray={state === 'sealed' ? '3 4' : undefined}
        strokeOpacity={state === 'sealed' ? 0.9 : 1}
      />
      <text
        x="50"
        y="52"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={col}
        fontSize="34"
        fontWeight="500"
        letterSpacing="1"
        style={{ fontFamily: 'var(--font-order)' }}
      >
        {numeral}
      </text>
      {state === 'broken' && (
        <path d="M18,20 L82,80" stroke={col} strokeWidth="2" strokeLinecap="round" strokeOpacity="0.85" />
      )}
    </svg>
  );
}

// ----------------------------------------------------------------------------
// THE CHOIR CODE — the Order's nine-point signal alphabet, drawn on the same
// 3×3 grid as the Square of Saturn. A code, not a sigil: it encodes letters.
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
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity={dim ? 0.45 : 1}
          />
        );
      })}
      {spec.ring ? (
        <circle
          cx={nx}
          cy={ny}
          r="3.4"
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          opacity={dim ? 0.45 : 1}
        />
      ) : (
        <circle cx={nx} cy={ny} r="2.4" fill={color} opacity={dim ? 0.45 : 1} />
      )}
    </svg>
  );
}
