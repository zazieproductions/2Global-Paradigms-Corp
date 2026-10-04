import { describe, expect, it } from 'vitest';
import { NAV_ITEMS } from '@/config/navigation';
import { SEO_DESCRIPTION, SEO_TITLE, absoluteUrl } from '@/config/seo-copy';
import { routeSeo } from '@/config/seo';

/**
 * Per-route SEO metadata. Lives in the DOM project (unlike seo.test.ts)
 * because seo.ts reads the navigation, which touches the component graph.
 */
describe('routeSeo()', () => {
  it('gives the homepage the canonical copy', () => {
    const home = routeSeo('/');
    expect(home.title).toBe(SEO_TITLE);
    expect(home.description).toBe(SEO_DESCRIPTION);
    expect(home.canonical).toBe(absoluteUrl('/'));
    expect(home.indexable).toBe(true);
  });

  it('strips modal deep-link query strings from the canonical URL', () => {
    expect(routeSeo('/documents?record=doc-007').canonical).toBe(absoluteUrl('/documents'));
    expect(routeSeo('/legacy?x=1').canonical).toBe(absoluteUrl('/legacy'));
    expect(routeSeo('/personnel?doc=DOC-1989-SVALBARD-EVENT').canonical).toBe(absoluteUrl('/personnel'));
  });

  it('titles every routed section with its own manifest title', () => {
    for (const item of NAV_ITEMS) {
      const seo = routeSeo(item.path);
      expect(seo.title, item.path).not.toContain('File Not Found');
      expect(seo.canonical, item.path).toBe(absoluteUrl(item.path));
    }
  });

  it('routes the stable legacy path to the Restoration Ledger metadata', () => {
    const ledger = routeSeo('/legacy');
    expect(ledger.title).toContain('Restoration Ledger');
    expect(ledger.description).toContain('recovery');
    expect(ledger.description).not.toBe(SEO_DESCRIPTION);
  });

  it('never describes a missing route as content', () => {
    const missing = routeSeo('/no/such/folder');
    expect(missing.title).toContain('File Not Found');
    expect(missing.canonical).toBeNull();
    expect(missing.indexable).toBe(false);
  });
});
