import { cn } from '@/lib/utils/cn';

export type StatusLightTone = 'ok' | 'signal' | 'warn' | 'alert' | 'off' | 'purple';

const TONES: Record<StatusLightTone, string> = {
  ok: 'bg-emerald-400',
  signal: 'bg-cyan-400',
  warn: 'bg-amber-400',
  alert: 'bg-rose-500',
  off: 'bg-slate-600',
  purple: 'bg-purple-400'
};

interface StatusLightProps {
  tone?: StatusLightTone;
  /** Pulse animation (suppressed automatically under reduced motion). */
  pulse?: boolean;
  /** Accessible text. Omit when an adjacent label already conveys the status. */
  label?: string;
  className?: string;
}

/** Small indicator LED. Never the only carrier of meaning — pair with text. */
export function StatusLight({ tone = 'ok', pulse = false, label, className }: StatusLightProps) {
  return (
    <span
      className={cn(
        'inline-block w-1.5 h-1.5 rounded-full shrink-0',
        TONES[tone],
        pulse && 'animate-pulse',
        className
      )}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
