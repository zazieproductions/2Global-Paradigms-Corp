import { useDeferredValue, useMemo } from 'react';
import type { SearchFilters, SearchResult } from '@/types';
import { searchArchive } from '@/lib/search/search-index';

/**
 * Debounce-free search: `useDeferredValue` keeps typing responsive while the
 * (sub-millisecond) scan runs at lower priority.
 */
export function useArchiveSearch(text: string, filters?: SearchFilters, limit = 50) {
  const deferredText = useDeferredValue(text);
  const filterKey = JSON.stringify(filters ?? {});
  const results: SearchResult[] = useMemo(
    () => searchArchive({ text: deferredText, filters: JSON.parse(filterKey) as SearchFilters, limit }),
    [deferredText, filterKey, limit]
  );
  return { results, isStale: deferredText !== text };
}
