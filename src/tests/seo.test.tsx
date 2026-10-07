import { describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { NAV_ITEMS } from '@/config/navigation';
import { canonicalUrl, SEO_PAGES, SEO_SITE } from '@/config/seo';
import { renderArchive } from './render';

vi.mock('@/config/features', () => ({
  FEATURES: {
    bootSequence: false,
    archiveShell: false,
    persistProgress: false,
    assistedBypass: true,
    uiSoundsDefault: false
  }
}));

const indexHtml = Object.values(
  import.meta.glob('/index.html', { query: '?raw', import: 'default', eager: true })
)[0] as string;
const sitemapXml = Object.values(
  import.meta.glob('/public/sitemap.xml', { query: '?raw', import: 'default', eager: true })
)[0] as string;
const robotsTxt = Object.values(
  import.meta.glob('/public/robots.txt', { query: '?raw', import: 'default', eager: true })
)[0] as string;

describe('SEO manifest', () => {
  it('has exactly one unique metadata record for every public route', () => {
    expect(SEO_PAGES.map((page) => page.path).sort()).toEqual(NAV_ITEMS.map((item) => item.path).sort());
    expect(new Set(SEO_PAGES.map((page) => page.title)).size).toBe(SEO_PAGES.length);
    expect(new Set(SEO_PAGES.map((page) => page.description)).size).toBe(SEO_PAGES.length);
  });

  it('uses concise titles and substantial descriptions', () => {
    for (const page of SEO_PAGES) {
      expect(page.title.length, `${page.path} title length`).toBeGreaterThanOrEqual(30);
      expect(page.title.length, `${page.path} title length`).toBeLessThanOrEqual(65);
      expect(page.description.length, `${page.path} description length`).toBeGreaterThanOrEqual(110);
      expect(page.description.length, `${page.path} description length`).toBeLessThanOrEqual(165);
    }
  });

  it('keeps the canonical origin HTTPS and query-free', () => {
    expect(SEO_SITE.origin).toBe('https://globalparadigmscorp.com');
    expect(canonicalUrl('/documents?record=doc-001')).toBe('https://globalparadigmscorp.com/documents');
  });
});

describe('discovery files', () => {
  it('lists only canonical public routes in the sitemap', () => {
    const locations = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    expect(locations).toEqual(SEO_PAGES.map((page) => canonicalUrl(page.path)));
    expect(sitemapXml).not.toContain('<priority>');
    expect(sitemapXml).not.toContain('<changefreq>');
  });

  it('allows crawling and advertises the absolute sitemap URL', () => {
    expect(robotsTxt.startsWith('User-agent: *\nAllow: /\n')).toBe(true);
    expect(robotsTxt).toContain(`Sitemap: ${SEO_SITE.origin}/sitemap.xml`);
    expect(robotsTxt).not.toMatch(/Disallow:\s*\//);
  });

  it('ships canonical, social, structured and crawlable metadata in raw HTML', () => {
    expect(indexHtml).toContain(`<link rel="canonical" href="${SEO_SITE.origin}/"`);
    expect(indexHtml).toContain('name="robots"');
    expect(indexHtml).toContain('property="og:image"');
    expect(indexHtml).toContain('name="twitter:card" content="summary_large_image"');
    expect(indexHtml).toContain('type="application/ld+json"');
    // The crawlable block is generated; generate-seo.mjs writes the same
    // regions, with this route's copy, into every other static entry point.
    expect(indexHtml).toContain('<!-- @gpc-static-block:begin -->');
    expect(indexHtml).toContain('class="gpc-static"');
    expect(indexHtml).toContain('href="/documents"');
  });

  it('keeps /legacy as the Restoration Ledger in metadata, navigation and the live app', async () => {
    expect(SEO_PAGES.find((page) => page.path === '/legacy')?.heading).toBe('Restoration Ledger');
    expect(NAV_ITEMS.find((item) => item.path === '/legacy')).toMatchObject({
      id: 'legacy',
      label: 'Restoration Ledger'
    });

    renderArchive('/legacy');
    expect(await screen.findByRole('heading', { name: 'Restoration Ledger' })).toBeInTheDocument();
    expect(screen.getByText('Six outbound URLs confirmed dead')).toBeInTheDocument();
  });
});

describe('client-side route metadata', () => {
  it('updates title, description and canonical URL after navigation', async () => {
    const page = SEO_PAGES.find((candidate) => candidate.path === '/documents');
    expect(page).toBeDefined();
    renderArchive('/documents?record=doc-001');

    await waitFor(() => expect(document.title).toBe(page?.title));
    expect(document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content).toBe(
      page?.description
    );
    expect(document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href).toBe(
      `${SEO_SITE.origin}/documents`
    );
    expect(document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content).toContain(
      'index, follow'
    );
  });

  it('removes the canonical and applies noindex on a missing route', async () => {
    renderArchive('/missing-archive-file');

    await waitFor(() => expect(document.title).toContain('File Not Found'));
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
    expect(document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content).toBe(
      'noindex, nofollow'
    );
  });
});
