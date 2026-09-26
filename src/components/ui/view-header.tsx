import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ViewHeaderProps {
  icon: LucideIcon;
  /** Tailwind text colour for the icon, e.g. `text-purple-400`. */
  iconClassName?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-hand slot: badges, counters, actions. */
  aside?: ReactNode;
  className?: string;
}

/** Standard section heading: icon + uppercase title + subtitle, with an optional aside. */
export function ViewHeader({
  icon: Icon,
  iconClassName = 'text-cyan-400',
  title,
  subtitle,
  aside,
  className
}: ViewHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-line pb-4',
        className
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Icon className={cn('w-5 h-5 shrink-0', iconClassName)} aria-hidden />
          <h1 className="text-base md:text-lg font-bold text-white tracking-wider">{title}</h1>
        </div>
        {subtitle && <p className="text-label text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {aside && <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">{aside}</div>}
    </header>
  );
}
