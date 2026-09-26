import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface SelectCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  /** Border/background colour classes used when selected. */
  selectedClassName?: string;
  children: ReactNode;
}

/**
 * A list item that selects a record. Replaces clickable `<div>`s so every
 * list is keyboard-reachable and announces its pressed state.
 */
export function SelectCard({
  selected = false,
  selectedClassName = 'bg-active border-cyan-500/60',
  className,
  children,
  ...rest
}: SelectCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'tap-row w-full text-left border rounded transition-colors cursor-pointer',
        selected ? selectedClassName : 'bg-panel border-line hover:border-line-bright hover:bg-hover',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
