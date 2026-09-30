/**
 * Live <head> metadata mutation.
 *
 * The archive is a client-rendered SPA, so the head Vite serves is a fallback:
 * Google renders JavaScript and indexes whatever the document says *after*
 * mount. Every navigation therefore rewrites the title, the canonical URL and
 * the social/description tags, so that each section is indexed as itself and
 * every `?record=` / `?doc=` modal deep link collapses onto its section.
 *
 * Idempotent by construction — each helper finds the existing element or
 * creates it, so repeated navigations never accumulate duplicate tags.
 */

/** Set (or create) a `<link rel="…">` in the document head. */
export function upsertLink(rel: string, href: string): void {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

/**
 * Set (or create) a meta tag addressed by `name` or by `property` (Open Graph
 * uses `property`, everything else uses `name`).
 */
export function upsertMeta(key: string, content: string, attr: 'name' | 'property' = 'name'): void {
  if (typeof document === 'undefined') return;
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
}
