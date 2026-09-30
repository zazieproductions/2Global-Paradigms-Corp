/** Initials for avatar tiles: "Dr. Ewan Naylor" → "DAT". */
export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join('');

/** Case-insensitive `includes` that tolerates undefined. */
export const includesCI = (haystack: string | undefined, needle: string): boolean =>
  !!haystack && haystack.toLowerCase().includes(needle.toLowerCase());

/** Extract the leading 4-digit year from any date-ish string. */
export function yearOf(value: string | number | undefined | null): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (!value) return null;
  const m = /(1[89]\d{2}|20\d{2})/.exec(value);
  return m ? Number(m[1]) : null;
}

/** Normalise a date-ish string ("2024-11-20 23:14 UTC", "1989") to `YYYY-MM-DD` when possible. */
export function isoDateOf(value: string | number | undefined | null): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'number') return `${value}-01-01`;
  const full = /(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (full) return `${full[1]}-${full[2]}-${full[3]}`;
  const y = yearOf(value);
  return y ? `${y}-01-01` : null;
}

/** Build a short snippet of `text` centred on the first match of `term`. */
export function snippetAround(text: string, term: string, radius = 70): string {
  if (!text) return '';
  const i = term ? text.toLowerCase().indexOf(term.toLowerCase()) : -1;
  if (i < 0) return text.length > radius * 2 ? `${text.slice(0, radius * 2).trimEnd()}…` : text;
  const start = Math.max(0, i - radius);
  const end = Math.min(text.length, i + term.length + radius);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}
