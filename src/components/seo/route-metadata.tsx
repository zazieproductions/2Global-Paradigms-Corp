import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SEO_SITE, routeSeo } from '@/config/seo';
import { absoluteUrl } from '@/config/seo-copy';

const INDEX_DIRECTIVES = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const NOINDEX_DIRECTIVES = 'noindex, nofollow';

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
 * Keeps metadata correct after client-side navigation.
 *
 * Google renders JavaScript, so what it indexes is the post-mount document —
 * not the head the static entry point served. Production entry points already
 * contain this metadata in their raw HTML (see `scripts/generate-seo.mjs`);
 * this covers SPA transitions, and collapses `?record=` / `?doc=` modal deep
 * links onto their section instead of letting them be indexed as
 * near-duplicates. A path with no canonical page gets `noindex` and no
 * canonical, so a missing file is never described as content.
 */
export function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = routeSeo(pathname);
    const image = absoluteUrl(SEO_SITE.image);
    const directives = seo.indexable ? INDEX_DIRECTIVES : NOINDEX_DIRECTIVES;

    document.title = seo.title;
    document.documentElement.lang = SEO_SITE.language;
    setCanonical(seo.indexable ? (seo.canonical ?? undefined) : undefined);

    setMeta('meta[name="description"]', 'name', 'description', seo.description);
    setMeta('meta[name="robots"]', 'name', 'robots', directives);
    setMeta('meta[name="googlebot"]', 'name', 'googlebot', directives);

    setMeta('meta[property="og:title"]', 'property', 'og:title', seo.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', seo.description);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', SEO_SITE.name);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', SEO_SITE.locale);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', SEO_SITE.imageAlt);
    setMeta('meta[property="og:url"]', 'property', 'og:url', seo.canonical ?? SEO_SITE.origin);

    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', seo.title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', seo.description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', SEO_SITE.imageAlt);
  }, [pathname]);

  return null;
}
