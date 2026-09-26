import { FICTION_NOTICE } from '@/config/site';
import { cn } from '@/lib/utils/cn';

/** Out-of-world disclaimer. Must remain visible on every public surface. */
export function FictionNotice({
  variant = 'short',
  className
}: {
  variant?: 'short' | 'long';
  className?: string;
}) {
  return (
    <p className={cn('text-micro text-slate-500 font-mono leading-relaxed', className)} role="note">
      {FICTION_NOTICE[variant]}
    </p>
  );
}
