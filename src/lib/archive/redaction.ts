/**
 * Project Palimpsest redaction markers.
 *
 * Record bodies mark hidden words as `[REDACTED]` or `[REDACTED: hidden words]`.
 * The cleartext of a redacted record lives in `redactedContent` and is shown
 * only with the (earned) de-scrambler. Anything rendered without it must pass
 * through `stripRedactions` so the hidden words never reach the DOM.
 */
export const REDACTION_PATTERN = /\[REDACTED(?::\s*([^\]]*))?\]/g;

/** Replace every marker with a bare `[REDACTED]`, dropping any hidden words. */
export const stripRedactions = (text: string): string => text.replace(REDACTION_PATTERN, '[REDACTED]');

export interface RedactionPart {
  kind: 'text' | 'redaction';
  /** Text for `text` parts; empty for redactions (hidden words are never kept). */
  text: string;
  /** Approximate length of the hidden span, for drawing the bar. */
  length: number;
}

/** Split text into plain runs and redaction bars. Hidden words are discarded. */
export function splitRedactions(text: string): RedactionPart[] {
  const parts: RedactionPart[] = [];
  let last = 0;
  for (const m of text.matchAll(REDACTION_PATTERN)) {
    const idx = m.index ?? 0;
    if (idx > last) parts.push({ kind: 'text', text: text.slice(last, idx), length: idx - last });
    parts.push({ kind: 'redaction', text: '', length: Math.max(5, Math.min(60, m[1]?.length ?? 8)) });
    last = idx + m[0].length;
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last), length: text.length - last });
  return parts;
}
