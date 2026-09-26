import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query from React.
 *
 * Layout should stay CSS-driven wherever possible — reach for this only when a
 * *behaviour* (not a style) has to differ on a phone, e.g. defaulting a dense
 * data table to its card view. Uses `useSyncExternalStore` so the first render
 * already has the right answer and resizes stay tear-free.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia?.(query);
      if (!mql) return () => {};
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia(query).matches;
  }, [query]);

  // Server/prerender snapshot: assume the desktop layout.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** `md` in the Tailwind scale — below it, the archive is in phone layout. */
export const MOBILE_QUERY = '(max-width: 767px)';

/** True on phone-width viewports. Safe in jsdom / prerender (returns false). */
export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY);
}
