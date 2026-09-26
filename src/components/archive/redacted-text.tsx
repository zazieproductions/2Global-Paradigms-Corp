import { Fragment } from 'react';
import { splitRedactions } from '@/lib/archive/redaction';
import { cn } from '@/lib/utils/cn';

/**
 * Renders record text with Palimpsest redaction bars. Hidden words inside
 * `[REDACTED: …]` markers are discarded before render (see
 * lib/archive/redaction.ts), so they are never in the DOM, selectable, or
 * readable by devtools. Each bar is announced as "redacted".
 */
export function RedactedText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {splitRedactions(text).map((part, i) =>
        part.kind === 'text' ? (
          <Fragment key={i}>{part.text}</Fragment>
        ) : (
          <span
            key={i}
            role="img"
            aria-label="redacted"
            title="REDACTED — Project Palimpsest"
            className={cn(
              'redaction-bar inline-block align-middle bg-black border border-slate-800 rounded-[1px] h-[1em]'
            )}
            style={{ width: `${Math.max(3, Math.round(part.length * 0.55))}ch` }}
          />
        )
      )}
    </span>
  );
}
