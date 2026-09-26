import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface TreeRowProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  depth?: number;
  icon?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}

/** Directory-tree style row (sidebar, file lists). Always a real button. */
export function TreeRow({
  active = false,
  depth = 0,
  icon,
  trailing,
  className,
  children,
  ...rest
}: TreeRowProps) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={cn(
        'tap-row w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded text-left transition-colors cursor-pointer',
        active
          ? 'bg-active border border-cyan-500/40 text-cyan-300'
          : 'border border-transparent text-slate-400 hover:bg-hover hover:text-slate-200',
        className
      )}
      style={depth ? { paddingLeft: `${0.625 + depth * 0.75}rem` } : undefined}
      {...rest}
    >
      <span className="flex items-center gap-2 min-w-0">
        {icon}
        <span className="truncate">{children}</span>
      </span>
      {trailing}
    </button>
  );
}
