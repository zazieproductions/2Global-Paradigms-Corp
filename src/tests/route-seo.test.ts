import { describe, expect, it } from 'vitest';
import { LEGACY_NAV } from '@/config/navigation';
import { SEO_DESCRIPTION, SEO_TITLE, absoluteUrl } from '@/config/seo-copy';
import { routeSeo } from '@/config/seo';

/**
 * Per-route SEO metadata. Lives in the DOM project (unlike seo.test.ts)
 * because routeSeo resolves labels through the navigation, which touches the
 * component graph.
 */
describe('routeSeo()', () => {
  it('gives the homepage the canonical copy', () => {
    const home = routeSeo('/');
    expect(home.title).toBe(SEO_TITLE);
    expect(home.description).toBe(SEO_DESCRIPTION);
    expect(home.canonical).toBe(absoluteUrl('/'));
  });

  it('strips modal deep-link query strings from the canonical URL', () => {
    expect(routeSeo('/documents?record=doc-007').canonical).toBe(absoluteUrl('/documents'));
    expect(routeSeo('/legacy?x=1').canonical).toBe(absoluteUrl('/legacy'));
    expect(routeSeo('/personnel?doc=DOC-1989-SVALBARD-EVENT').canonical).toBe(absoluteUrl('/personnel'));
  });

  it('titles the legacy file with its own label', () => {
    const legacy = routeSeo('/legacy');
    expect(legacy.title).toContain(LEGACY_NAV.label);
    expect(legacy.description).toContain(SEO_DESCRIPTION);
  });

  it('never describes a missing route as content', () => {
    expect(routeSeo('/no/such/folder').title).toContain('File Not Found');
  });
});
