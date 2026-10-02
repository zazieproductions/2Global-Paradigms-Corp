/**
 * SEO / GEO configuration — the single import point for every surface that
 * describes this site to search engines and to generative engines.
 *
 * Three layers, on purpose:
 *
 *   ./seo-copy        the prose: both eras, the FAQ, the legacy narrative.
 *                     Deliberately import-free so the Node toolchain
 *                     (`scripts/lib/load-seo.mjs`) can bundle it without
 *                     dragging React in, and so `src/tests/seo.test.ts` can
 *                     typecheck it in the Node project.
 *   ./seo-pages.json  the route manifest: one title, heading and description
 *                     per canonical URL. Plain JSON, because the build scripts
 *                     and `scripts/verify-dist.mjs` read it too.
 *   this file         the routing-aware helpers, plus re-exports so consumers
 *                     write `@/config/seo` and nothing else.
 *
 * Surfaces that must agree, all asserted by src/tests/seo.test.ts and
 * src/tests/seo-route.test.tsx: index.html head · the generated crawlable
 * block · the generated JSON-LD · robots.txt · sitemap.xml · llms.txt ·
 * SITE.title · the /legacy page · the per-route <head> the shell writes after
 * navigation. See docs/SEO.md.
 */
import seoData from './seo-pages.json';
import { NAV_ITEMS } from '@/config/navigation';
import { FICTION_NOTICE, SITE } from '@/config/site';
import { SEO_DESCRIPTION, SEO_TITLE, absoluteUrl } from './seo-copy';

export * from './seo-copy';
export { FICTION_NOTICE, SITE };

export interface SeoPage {
  path: string;
  title: string;
  heading: string;
  description: string;
}

export interface SeoSite {
  origin: string;
  name: string;
  defaultTitle: string;
  description: string;
  image: string;
  imageAlt: string;
  language: string;
  locale: string;
  lastModified: string;
}

export const SEO_SITE: SeoSite = seoData.site;
export const SEO_PAGES: SeoPage[] = seoData.pages;

const pagesByPath = new Map(SEO_PAGES.map((page) => [page.path, page]));

/**
 * The archive's own section index, derived from the navigation so the
 * crawlable block's internal links can never disagree with the router.
 */
export const SECTION_INDEX = NAV_ITEMS.map((item) => ({
  path: item.path,
  label: item.label
}));

/** Strip query/hash state and trailing slashes so every page has one canonical path. */
export function normalizeSeoPath(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0] || '/';
  if (path === '/') return path;
  return path.replace(/\/+$/, '') || '/';
}

export function getSeoPage(pathname: string): SeoPage | undefined {
  return pagesByPath.get(normalizeSeoPath(pathname));
}

export function canonicalUrl(pathname: string): string {
  const path = normalizeSeoPath(pathname);
  return `${SEO_SITE.origin}${path === '/' ? '/' : path}`;
}

/**
 * Per-route SEO metadata for the live document.
 *
 * Google renders JavaScript, so what it indexes is the post-mount document —
 * not the head Vite served. `RouteMetadata` therefore reads this on every
 * navigation, and index.html plus the per-route static entry points remain the
 * fallback for crawlers that never execute a line of JavaScript. Query strings
 * are stripped: `?record=` and `?doc=` are modal states, not pages, and every
 * one of them collapses onto its section rather than being indexed as a
 * near-duplicate of it.
 */
export interface RouteSeo {
  /** `null` for a path with no canonical page: do not declare one. */
  canonical: string | null;
  title: string;
  description: string;
  /** False for a missing path, so the shell can mark it `noindex`. */
  indexable: boolean;
}

export function routeSeo(pathname: string): RouteSeo {
  const path = normalizeSeoPath(pathname);
  const page = pagesByPath.get(path);

  if (!page) {
    return {
      canonical: null,
      indexable: false,
      title: `File Not Found // ${SITE.name}`,
      description: `No record is mounted at ${path} on ${SITE.name}. Return to the Command Dashboard, or read the domain's 2006 hoax and 2026 reopening in the Legacy File.`
    };
  }

  return {
    canonical: canonicalUrl(page.path),
    indexable: true,
    title: page.title,
    description: page.description
  };
}

/** The homepage copy, kept honest against the route manifest by the tests. */
export const HOME_COPY = { title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: absoluteUrl('/') };
