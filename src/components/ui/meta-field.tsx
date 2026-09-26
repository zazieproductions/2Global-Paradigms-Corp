import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface MetaFieldProps {
  label: ReactNode;
  children: ReactNode;
  /** Tailwind text colour for the value. */
  valueClassName?: string;
  className?: string;
  /** Render label and value on one line. */
  inline?: boolean;
}

/** Label / value pair used in every record header grid (`DIRECTOR: …`). */
export function MetaField({ label, children, valueClassName, className, inline = false }: MetaFieldProps) {
  return (
    <div className={cn(inline ? 'flex items-baseline gap-1.5' : 'min-w-0', className)}>
      <span className={cn('meta-label', !inline && 'block')}>{label}</span>
      <span className={cn('text-slate-200', !inline && 'block truncate', valueClassName)}>{children}</span>
    </div>
  );
}

/** Inset grid wrapper for a group of MetaFields. */
export function MetaGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-inset border border-line p-3 rounded text-caption',
        className
      )}
    >
      {children}
    </div>
  );
}
