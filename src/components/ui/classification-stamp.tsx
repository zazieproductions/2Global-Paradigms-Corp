import type { ClearanceLevel } from '@/types';
import { clearanceTier, isRevoked, shortClearance } from '@/lib/archive/clearance';
import { cn } from '@/lib/utils/cn';

const TIER_STYLES: Record<number, string> = {
  1: 'text-slate-300 border-slate-500/60 bg-slate-800/40',
  2: 'text-sky-300 border-sky-600/60 bg-sky-950/40',
  3: 'text-cyan-300 border-cyan-600/60 bg-cyan-950/40',
  4: 'text-amber-300 border-amber-600/60 bg-amber-950/40',
  5: 'text-rose-300 border-rose-600/60 bg-rose-950/40'
};

interface ClassificationStampProps {
  level: ClearanceLevel;
  /** Render the full label (`Level 3 - Secret`) instead of `Level 3`. */
  full?: boolean;
  className?: string;
}

/** Rubber-stamp style clearance marker. Tier is always written out, never colour-only. */
export function ClassificationStamp({ level, full = false, className }: ClassificationStampProps) {
  const tier = clearanceTier(level);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-px border rounded-sm font-mono font-bold uppercase tracking-wider text-micro whitespace-nowrap',
        TIER_STYLES[tier] ?? TIER_STYLES[1],
        isRevoked(level) && 'line-through decoration-rose-400',
        className
      )}
      title={level}
    >
      {full ? level : shortClearance(level)}
    </span>
  );
}
