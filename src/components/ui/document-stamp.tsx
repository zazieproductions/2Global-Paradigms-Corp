import type { ClassificationStamp } from '@/types';
import { cn } from '@/lib/utils/cn';

/** Colour per stamp. The stamp text is always rendered, so colour is never the only signal. */
const STAMP_TONES: Record<ClassificationStamp, { badge: string; stamp: string }> = {
  'BLACK LEVEL // SANITIZED': {
    badge: 'bg-rose-950/80 text-rose-300 border-rose-700',
    stamp: 'border-rose-600 text-rose-500 bg-rose-950/20'
  },
  'TOP SECRET // EYES ONLY': {
    badge: 'bg-red-950/80 text-red-300 border-red-700',
    stamp: 'border-red-600 text-red-500 bg-red-950/20'
  },
  'SECRET // NOFORN': {
    badge: 'bg-amber-950/80 text-amber-300 border-amber-700',
    stamp: 'border-amber-600 text-amber-500 bg-amber-950/20'
  },
  CONFIDENTIAL: {
    badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-700',
    stamp: 'border-cyan-600 text-cyan-500 bg-cyan-950/20'
  },
  RESTRICTED: {
    badge: 'bg-slate-900 text-slate-400 border-slate-700',
    stamp: 'border-slate-600 text-slate-400 bg-slate-900/40'
  },
  UNCLASSIFIED: {
    badge: 'bg-slate-900 text-slate-400 border-slate-700',
    stamp: 'border-slate-600 text-slate-400 bg-slate-900/40'
  }
};

interface DocumentStampProps {
  stamp: ClassificationStamp;
  /** `badge`: compact list marker. `stamp`: rotated rubber stamp for document headers. */
  variant?: 'badge' | 'stamp';
  className?: string;
}

/** Document classification marking (e.g. `SECRET // NOFORN`). */
export function DocumentStamp({ stamp, variant = 'badge', className }: DocumentStampProps) {
  const tone = STAMP_TONES[stamp] ?? STAMP_TONES.UNCLASSIFIED;
  return (
    <span
      className={cn(
        variant === 'badge'
          ? 'inline-block text-micro px-1.5 py-px rounded border w-fit font-bold'
          : 'inline-block border-2 border-dashed px-3 py-1 rounded text-center -rotate-3 uppercase font-black text-xs tracking-wider',
        variant === 'badge' ? tone.badge : tone.stamp,
        className
      )}
    >
      {stamp}
    </span>
  );
}
