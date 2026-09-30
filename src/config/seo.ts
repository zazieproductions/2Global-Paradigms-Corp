/**
 * Routing-aware SEO helpers, layered over the import-free copy in
 * ./seo-copy. Re-exports everything from there, plus the site and fiction
 * notice, so consumers keep a single import point: `@/config/seo`.
 */
import { NAV_ITEMS } from '@/config/navigation';

export * from './seo-copy';
export { FICTION_NOTICE, SITE } from '@/config/site';

import { SEO_DESCRIPTION, SEO_TITLE, absoluteUrl } from './seo-copy';
import { SITE } from '@/config/site';

/**
 * The archive's own section index, derived from the navigation so the
 * crawlable block's internal links can never disagree with the router.
 */
export const SECTION_INDEX = NAV_ITEMS.map((item) => ({
  path: item.path,
  label: item.label
}));

/**
 * Per-route SEO metadata. The shell writes these into the live document on
 * every navigation, because Google renders JavaScript and therefore sees the
 * post-mount <title>, not the one in index.html.
 */
export interface RouteSeo {
  canonical: string;
  title: string;
  description: string;
}

/** Strip query strings — `?record=` and `?doc=` are modal deep links, not pages. */
const barePath = (pathname: string): string => {
  const clean = pathname.split('?')[0] ?? '/';
  if (clean === '' || clean === '/') return '/';
  return clean.endsWith('/') ? clean.slice(0, -1) : clean;
};

/**
 * Resolve the canonical URL, title and description for a pathname.
 * Unknown paths fall back to the in-world FILE NOT FOUND framing rather than
 * the homepage copy, so a crawler never sees a 404 route described as content.
 */
export function routeSeo(pathname: string): RouteSeo {
  const path = barePath(pathname);
  const item = NAV_ITEMS.find((i) => i.path === path);

  if (!item) {
    return {
      canonical: absoluteUrl(path),
      title: `File Not Found // ${SITE.name}`,
      description: `No record is mounted at ${path} on ${SITE.name}. Return to the Command Dashboard, or read the domain's 2006 hoax and 2026 reopening in the Legacy File.`
    };
  }

  if (path === '/') {
    return { canonical: absoluteUrl('/'), title: SEO_TITLE, description: SEO_DESCRIPTION };
  }

  return {
    canonical: absoluteUrl(path),
    title: `${item.label} // ${SITE.name}`,
    description: `${item.label} in ${SITE.name}: ${SEO_DESCRIPTION}`
  };
}
