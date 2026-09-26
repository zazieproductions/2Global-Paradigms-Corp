import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

/** Scrollable page body used by every archive section. */
export function ArchivePage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex-1 overflow-y-auto overscroll-contain p-3 md:p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] space-y-4 font-mono text-xs text-slate-200 bg-canvas scrollbar-thin',
        className
      )}
    >
      {children}
    </div>
  );
}
