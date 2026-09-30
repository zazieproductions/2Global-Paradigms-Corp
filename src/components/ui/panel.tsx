import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type PanelTone = 'default' | 'signal' | 'purple' | 'danger' | 'warning' | 'success';

const TONE_BORDER: Record<PanelTone, string> = {
  default: 'border-line-strong',
  signal: 'border-cyan-500/40',
  purple: 'border-purple-500/40',
  danger: 'border-rose-500/40',
  warning: 'border-amber-500/40',
  success: 'border-emerald-500/40'
};

interface PanelProps extends HTMLAttributes<HTMLElement> {
  tone?: PanelTone;
  as?: 'div' | 'section' | 'article' | 'aside' | 'nav';
  padded?: boolean;
  children: ReactNode;
}

/** The archive's base surface: dark panel, hairline border, rounded corners. */
export function Panel({
  tone = 'default',
  as: Tag = 'div',
  padded = true,
  className,
  children,
  ...rest
}: PanelProps) {
  return (
    <Tag
      className={cn('bg-panel border rounded-lg', TONE_BORDER[tone], padded && 'p-4', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Uppercase section label used inside panels (`PUBLIC CORPORATE MANDATE:`). */
export function SectionLabel({
  children,
  className,
  icon
}: {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn('text-caption text-slate-400 font-bold uppercase flex items-center gap-1.5', className)}
    >
      {icon}
      {children}
    </span>
  );
}
