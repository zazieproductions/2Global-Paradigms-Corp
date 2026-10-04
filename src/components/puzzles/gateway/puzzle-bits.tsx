import { useState, useEffect, type ReactNode, type FC, useId } from 'react';
import { useProgression } from '@/hooks/use-progression';
import { getPuzzle } from '@/lib/puzzles/validate';

// ============================================================================
// Shared cipher-interface primitives, reused across every puzzle step.
// ----------------------------------------------------------------------------
//  * ScrambleText    left-to-right scramble-in reveal (static phrase)
//  * TypedText       character-level "live transmission" typing loop
//  * ScanlineSVG     the bordered decoder background (glitch + scan + grid)
//  * PuzzlePanel     standard glass terminal body with a corner ticker
//  * SmallCapsTitle  pulsing section header w/ leading glyph
//  * HintBlock       collapsible guided hint (★ straight answer toggle)
// ============================================================================

const SCRAMBLE_CHARS = '█▓▒░#%&@!?01';

export const ScrambleText: FC<{
  text: string;
  duration?: number;
  className?: string;
}> = ({ text, duration = 520, className = '' }) => {
  const [out, setOut] = useState('');

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(p * text.length);
      let s = '';
      for (let i = 0; i < text.length; i++) {
        if (i < reveal) s += text[i];
        else s += SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);

  return <span className={className}>{out}</span>;
};

export const TypedText: FC<{
  text: string;
  speed?: number;
  className?: string;
}> = ({ text, speed = 24, className = '' }) => (
  // Remount a fresh typer whenever the phrase changes, so the progress counter
  // always starts at zero without an imperative state reset.
  <TypedTextCore key={text} text={text} speed={speed} className={className} />
);

const TypedTextCore: FC<{ text: string; speed: number; className: string }> = ({
  text,
  speed,
  className
}) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setN((prev) => (prev >= text.length ? prev : prev + 1));
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className}>
      {text.slice(0, n)}
      {n < text.length && <span className="boot-caret text-cyan-300">▌</span>}
    </span>
  );
};

export const ScanlineSVG: FC<{ children?: ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`scan-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.16" />
          <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.02" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.16" />
        </linearGradient>
        <pattern id={`grid-${id}`} width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M 26 0 L 0 0 0 26" fill="none" stroke="#00f0ff" strokeOpacity="0.06" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
      <rect width="100%" height="100%" fill={`url(#scan-${id})`} />
      {children}
    </svg>
  );
};

export const PuzzlePanel: FC<{
  ticker?: string;
  className?: string;
  children: ReactNode;
}> = ({ ticker = 'GATEWAY TRANSMISSION', className = '', children }) => (
  <div
    className={`relative z-10 h-full flex flex-col p-2 sm:p-3 bg-[#030612] border border-cyan-500/25 shadow-[0_0_60px_rgba(0,240,255,0.14),inset_0_0_80px_rgba(0,240,255,0.05)] font-mono text-[11px] sm:text-xs text-slate-200 select-none ${className}`}
  >
    <ScanlineSVG />
    {/* travelling scan band */}
    <div
      className="absolute left-0 right-0 h-1/4 pointer-events-none z-20"
      style={{
        background: 'linear-gradient(to bottom, transparent, rgba(0,240,255,0.06), transparent)',
        animation: 'puzzle-scanband 7s linear infinite'
      }}
    />
    {/* Corner brackets */}
    <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t border-l border-cyan-400/70 pointer-events-none z-20" />
    <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t border-r border-cyan-400/70 pointer-events-none z-20" />
    <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b border-l border-cyan-400/70 pointer-events-none z-20" />
    <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b border-r border-cyan-400/70 pointer-events-none z-20" />

    {/* Ticker strip */}
    <div className="relative z-20 flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="shrink-0 flex items-center justify-between gap-3 mb-2">
        <span className="text-[9px] sm:text-[10px] tracking-[0.3em] text-cyan-300/90 font-bold truncate">
          ◈ {ticker}
        </span>
        <span className="hidden sm:flex items-center gap-1.5 text-[9px] text-emerald-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          REC: ONLINE
        </span>
      </div>
      {children}
    </div>
  </div>
);

export const SmallCapsTitle: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <h2
    className={`text-[11px] sm:text-sm font-bold tracking-[0.28em] text-cyan-300 flex items-center gap-2 ${className}`}
  >
    <span className="text-cyan-500 animate-pulse">▸</span>
    {children}
  </h2>
);

/** A feet-planting hint disclosure. */
export const HintBlock: FC<{ children: ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="text-[10px] leading-relaxed">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer text-slate-500 hover:text-cyan-300 transition-colors tracking-wider"
      >
        {open ? '▾ ' : '▸ '}
        {open ? 'HIDE FIELD NOTES' : 'OPEN FIELD NOTES'}
        <span className="text-slate-700 ml-1">(stuck? no judgment)</span>
      </button>
      {open && (
        <div className="mt-2 p-2.5 bg-[#060a14] border border-cyan-500/20 rounded text-slate-300 space-y-1.5">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Plain-answer reveal used inside HintBlock. The text is the puzzle's tier-3
 * hint from content/puzzles/definitions.ts; revealing it is recorded, so a
 * stage completed afterwards counts as ASSISTED in the progression store.
 */
export const AnswerPeek: FC<{ label: string; puzzleId: string }> = ({ label, puzzleId }) => {
  const { revealHint, state } = useProgression();
  const answer = getPuzzle(puzzleId)?.hints.find((h) => h.revealsAnswer)?.text;
  const show = (state.hintsRevealed[puzzleId] ?? 0) >= 3;
  if (!answer) return null;
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-500">{label}:</span>
      {show ? (
        <span className="text-cyan-300 font-bold tracking-widest">{answer}</span>
      ) : (
        <button
          type="button"
          onClick={() => revealHint(puzzleId, 3)}
          aria-label={`Reveal ${label.toLowerCase()} (counts as assisted)`}
          className="tap-target px-2 py-1 border border-slate-700 rounded text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors cursor-pointer"
        >
          REVEAL
        </button>
      )}
    </div>
  );
};
