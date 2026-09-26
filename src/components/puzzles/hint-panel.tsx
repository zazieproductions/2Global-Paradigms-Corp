import { useId, useState } from 'react';
import { ChevronDown, LifeBuoy, Lightbulb } from 'lucide-react';
import type { PuzzleDefinition } from '@/types';
import { FEATURES } from '@/config/features';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { nextHint, revealedHints } from '@/lib/puzzles/validate';
import { useProgression } from '@/hooks/use-progression';
import { cn } from '@/lib/utils/cn';

interface HintPanelProps {
  puzzle: PuzzleDefinition;
  /** Called after the assisted bypass completes the puzzle. */
  onBypass?: () => void;
  className?: string;
}

/**
 * Progressive, opt-in hints plus the no-shame assisted route.
 * Collapsed by default so nothing is spoiled unless the player asks.
 */
export function HintPanel({ puzzle, onBypass, className }: HintPanelProps) {
  const { state, revealHint, bypass } = useProgression();
  const [open, setOpen] = useState(false);
  const bodyId = useId();
  const tier = state.hintsRevealed[puzzle.id] ?? 0;
  const shown = revealedHints(puzzle, tier);
  const next = nextHint(puzzle, tier);
  const canBypass = FEATURES.assistedBypass && !!puzzle.bypass;

  return (
    <div className={cn('border border-line rounded bg-inset text-caption', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={bodyId}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-slate-400 hover:text-slate-200 cursor-pointer"
      >
        <span className="flex items-center gap-1.5 font-bold">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" aria-hidden />
          STUCK? INVESTIGATOR ASSISTANCE
          {shown.length > 0 && (
            <span className="text-slate-500 font-normal">
              ({shown.length}/{puzzle.hints.length} opened)
            </span>
          )}
        </span>
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
      </button>

      {open && (
        <div id={bodyId} className="px-3 pb-3 space-y-2 border-t border-line-subtle pt-2">
          {shown.length === 0 && (
            <p className="text-slate-500">
              Hints open one at a time. The last one gives the answer outright and marks this puzzle as
              assisted.
            </p>
          )}
          <ol className="space-y-1.5" aria-live="polite">
            {shown.map((h) => (
              <li key={h.tier} className="leading-relaxed">
                <span
                  className={cn('font-bold mr-1.5', h.revealsAnswer ? 'text-amber-400' : 'text-cyan-400')}
                >
                  {h.label}:
                </span>
                <span className="text-slate-300">{h.text}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2 pt-1">
            {next && (
              <button
                type="button"
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  revealHint(puzzle.id, next.tier);
                }}
                className={cn(
                  'px-2.5 py-1 rounded border cursor-pointer',
                  next.revealsAnswer
                    ? 'border-amber-600/60 text-amber-300 hover:bg-amber-950/40'
                    : 'border-cyan-700/60 text-cyan-300 hover:bg-cyan-950/40'
                )}
              >
                {next.revealsAnswer ? 'Reveal answer (assisted)' : `Open hint: ${next.label}`}
              </button>
            )}
            {canBypass && !state.completed[puzzle.id] && (
              <button
                type="button"
                onClick={() => {
                  gpcAudio.playUiSound('grant');
                  bypass(puzzle.id);
                  onBypass?.();
                }}
                title={puzzle.bypass!.description}
                className="px-2.5 py-1 rounded border border-emerald-700/60 text-emerald-300 hover:bg-emerald-950/40 cursor-pointer flex items-center gap-1.5"
              >
                <LifeBuoy className="w-3.5 h-3.5" aria-hidden />
                {puzzle.bypass!.label}
              </button>
            )}
          </div>
          {canBypass && puzzle.bypass && <p className="text-slate-500">{puzzle.bypass.description}</p>}
        </div>
      )}
    </div>
  );
}
