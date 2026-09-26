import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type BadgeTone =
  'neutral' | 'info' | 'signal' | 'indigo' | 'success' | 'danger' | 'warning' | 'purple';

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral: 'bg-raised text-slate-300 border-line-strong',
  info: 'bg-blue-950 text-blue-300 border-blue-800',
  signal: 'bg-cyan-950 text-cyan-300 border-cyan-800',
  indigo: 'bg-indigo-950 text-indigo-300 border-indigo-800',
  success: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  danger: 'bg-rose-950 text-rose-300 border-rose-800',
  warning: 'bg-amber-950 text-amber-300 border-amber-800',
  purple: 'bg-purple-950 text-purple-300 border-purple-800'
};

interface BadgeProps {
  tone?: BadgeTone;
  size?: 'xs' | 'sm';
  className?: string;
  children: ReactNode;
  title?: string;
}

/** Compact metadata pill used for counts, statuses and categories. */
export function Badge({ tone = 'neutral', size = 'xs', className, children, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-center gap-1 rounded border font-bold font-mono whitespace-nowrap',
        size === 'xs' ? 'text-micro px-1.5 py-px' : 'text-label px-2.5 py-1',
        BADGE_TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
