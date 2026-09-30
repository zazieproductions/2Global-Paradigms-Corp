# Search indexing and sitemap operations

The canonical production origin is **https://globalparadigmscorp.com**. Search metadata is deliberately
centralised in [`src/config/seo-pages.json`](../src/config/seo-pages.json); do not introduce a second route
list for SEO.

## What production emits

`npm run build` runs Vite and then `scripts/generate-seo.mjs`. The post-build step creates:

- one crawlable HTML entry point for every canonical route (`dist/<route>/index.html`);
- a self-canonical URL, unique title and unique description in the **raw HTML** of each entry point;
- an accessible, text-first route summary and internal navigation before React runs;
- `dist/sitemap.xml` containing canonical, indexable, 200-status URLs only;
- `dist/robots.txt`, with the absolute sitemap location; and
- `dist/404.html`, marked `noindex`, so removed or unknown URLs remain real 404s instead of soft 404s.

The client-side `RouteMetadata` component keeps the same tags correct after React Router navigation and
canonicalises query-string record views to their section page. It marks unknown client routes `noindex`.

The sitemap intentionally omits `priority` and `changefreq`. Search engines ignore those hints. Its
`lastmod` value should represent a meaningful public content change, not deployment time.

## Changing routes or metadata

1. Add or update the route in `src/config/navigation.ts` and `src/app/router.tsx` as usual.
2. Add matching metadata in `src/config/seo-pages.json`.
3. If public content changed materially, update `site.lastModified` to the actual change date.
4. Run:

   ```sh
   npm run seo:generate
   npm run seo:check
   npm run check
   ```

`seo:generate` refreshes the committed `public/sitemap.xml` and `public/robots.txt`. Tests require the SEO
manifest to match every canonical navigation route. Keep legacy URLs out of the sitemap and add permanent
redirects to both `vercel.json` and `public/_redirects` when a canonical route is renamed.

If the canonical hostname changes, update `site.origin` in `seo-pages.json`, regenerate the public files,
and update the constant JSON-LD block in `index.html`. Recalculate its CSP hash in both `vercel.json` and
`public/_headers` after changing that JSON-LD block.

## Google Search Console relaunch checklist

After deploying the build:

1. Confirm the apex domain uses HTTPS and that any `www` hostname permanently redirects to the apex.
2. Open these URLs without authentication and verify they return `200`:
   - `https://globalparadigmscorp.com/robots.txt`
   - `https://globalparadigmscorp.com/sitemap.xml`
   - `https://globalparadigmscorp.com/`
   - `https://globalparadigmscorp.com/documents`
3. Verify a made-up URL returns `404`, not `200`.
4. In the **Domain property** for `globalparadigmscorp.com`, go to **Indexing → Sitemaps** and submit
   `https://globalparadigmscorp.com/sitemap.xml`. Remove obsolete sitemap submissions.
5. Use **URL Inspection → Test live URL** on the home page. Check that crawling is allowed, the declared
   canonical is `https://globalparadigmscorp.com/`, and the rendered page contains the archive heading.
6. Request indexing for the home page, `/documents`, and `/sanctum`. The submitted sitemap handles the
   rest; repeatedly requesting every URL does not accelerate indexing.
7. Monitor **Page indexing** for `Blocked by robots.txt`, `Duplicate without user-selected canonical`,
   `Crawled — currently not indexed`, and soft-404 reports.

A sitemap helps Google discover and recrawl pages; it cannot guarantee indexing or rankings. Because this
domain has existed before, map an old URL to a new URL only when there is a genuine equivalent. Let
obsolete URLs return `404` (or `410` at the edge) rather than redirecting every historical URL to the home
page, which can create soft-404 signals.
