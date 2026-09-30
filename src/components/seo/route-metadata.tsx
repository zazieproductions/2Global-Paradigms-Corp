import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { canonicalUrl, getSeoPage, SEO_SITE } from '@/config/seo';

const INDEX_DIRECTIVES = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOT_FOUND_TITLE = `File Not Found | ${SEO_SITE.name}`;
const NOT_FOUND_DESCRIPTION = 'The requested archive path does not exist.';

function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
}

function setCanonical(href?: string) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    existing?.remove();
    return;
  }

  const element = existing ?? document.createElement('link');
  element.rel = 'canonical';
  element.href = href;
  if (!existing) document.head.append(element);
}

/**
 * Keeps metadata correct after client-side navigation. Production entry points
 * already contain this metadata in their raw HTML; this covers SPA transitions.
 */
export function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = getSeoPage(pathname);
    const title = page?.title ?? NOT_FOUND_TITLE;
    const description = page?.description ?? NOT_FOUND_DESCRIPTION;
    const canonical = page ? canonicalUrl(page.path) : undefined;
    const image = `${SEO_SITE.origin}${SEO_SITE.image}`;

    document.title = title;
    document.documentElement.lang = SEO_SITE.language;
    setCanonical(canonical);

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="robots"]', 'name', 'robots', page ? INDEX_DIRECTIVES : 'noindex, nofollow');
    setMeta('meta[name="googlebot"]', 'name', 'googlebot', page ? INDEX_DIRECTIVES : 'noindex, nofollow');

    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SEO_SITE.name);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', SEO_SITE.locale);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', SEO_SITE.imageAlt);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonical ?? SEO_SITE.origin);

    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', SEO_SITE.imageAlt);
  }, [pathname]);

  return null;
}
