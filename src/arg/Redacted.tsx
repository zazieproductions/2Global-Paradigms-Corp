import React from 'react';

/**
 * Palimpsest redaction renderer. Replaces "[REDACTED]" / "[REDACTED: …]" with
 * solid black bars of roughly the same length — the hidden words are NOT placed
 * in the DOM, so the only way to read them is the De-Scrambler.
 */
export const renderRedacted = (text: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  const re = /\[REDACTED(?::\s*([^\]]*))?\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const len = Math.max(5, Math.min(60, (m[1]?.length ?? 8)));
    out.push(
      <span
        key={k++}
        className="inline bg-slate-200 text-slate-200 rounded-[1px] select-none mx-0.5 px-0.5 break-all"
        title="REDACTED — Project Palimpsest"
        aria-label="redacted"
      >
        {'█'.repeat(Math.ceil(len * 0.8))}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

export const stripRedactions = (text: string) => text.replace(/\[REDACTED(?::\s*[^\]]*)?\]/g, '[REDACTED]');
