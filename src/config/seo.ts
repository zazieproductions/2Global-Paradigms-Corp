import seoData from './seo-pages.json';

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
