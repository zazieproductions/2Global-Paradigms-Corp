import type { ReactNode } from 'react';
import { AlertTriangle, FileQuestion, Info, Loader2, Lock, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type NoticeKind = 'info' | 'empty' | 'loading' | 'missing' | 'denied' | 'error';

const KINDS: Record<NoticeKind, { icon: typeof Info; tone: string; code: string }> = {
  info: { icon: Info, tone: 'border-cyan-700/50 text-cyan-300', code: 'SYS-INFO' },
  empty: { icon: SearchX, tone: 'border-line-strong text-slate-400', code: 'IDX-000' },
  loading: { icon: Loader2, tone: 'border-cyan-700/50 text-cyan-300', code: 'SPOOL' },
  missing: { icon: FileQuestion, tone: 'border-amber-700/50 text-amber-300', code: 'ERR-404' },
  denied: { icon: Lock, tone: 'border-rose-700/50 text-rose-300', code: 'ERR-403' },
  error: { icon: AlertTriangle, tone: 'border-rose-700/50 text-rose-300', code: 'ERR-500' }
};

interface SystemNoticeProps {
  kind?: NoticeKind;
  title: ReactNode;
  children?: ReactNode;
  /** Override the in-world status code shown in the corner. */
  code?: string;
  action?: ReactNode;
  className?: string;
  compact?: boolean;
}

/**
 * Terminal-style system message. Used for empty results, loading spools,
 * missing files and access-denied states — always written in the GPC voice.
 */
export function SystemNotice({
  kind = 'info',
  title,
  children,
  code,
  action,
  className,
  compact = false
}: SystemNoticeProps) {
  const { icon: Icon, tone, code: defaultCode } = KINDS[kind];
  return (
    <div
      role={kind === 'error' || kind === 'denied' ? 'alert' : 'status'}
      aria-live={kind === 'loading' ? 'polite' : undefined}
      className={cn(
        'bg-inset border border-dashed rounded font-mono',
        tone,
        compact ? 'p-3 text-caption' : 'p-6 text-label',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn('w-5 h-5 shrink-0', kind === 'loading' && 'animate-spin')} aria-hidden />
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold uppercase tracking-wider">{title}</p>
            <span className="text-micro text-slate-500 shrink-0">[{code ?? defaultCode}]</span>
          </div>
          {children && <div className="text-slate-400 leading-relaxed">{children}</div>}
          {action && <div className="pt-1">{action}</div>}
        </div>
      </div>
    </div>
  );
}
