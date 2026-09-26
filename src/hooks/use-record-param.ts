import { useSearchParams } from 'react-router-dom';

/**
 * Reads `?record=<id>` for deep-linking into a list/detail page.
 *
 * Pages use it as the *initial* selection only:
 *   const recordId = useRecordParam();
 *   const [selected, setSelected] = useState(() => find(recordId) ?? fallback);
 * The router keys each page by this param, so following a new deep link
 * remounts the page with the new initial selection.
 */
export function useRecordParam(): string | null {
  const [params] = useSearchParams();
  return params.get('record');
}

/** Pick the item matching `?record=` from a list, falling back to `fallback`. */
export function pickRecord<T extends { id: string }>(items: T[], recordId: string | null, fallback: T): T;
export function pickRecord<T extends { id: string }>(
  items: T[],
  recordId: string | null,
  fallback?: T | null
): T | null;
export function pickRecord<T extends { id: string }>(
  items: T[],
  recordId: string | null,
  fallback: T | null = null
) {
  return (recordId && items.find((i) => i.id === recordId)) || fallback;
}
