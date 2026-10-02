# Architecture

Global Paradigms Corp. is a **static, client-only single-page app**: React 19 + React Router 7, built by
Vite 7, styled with Tailwind CSS v4, and tested with Vitest + Testing Library. There is no server, database
or API. Everything the archive knows ships in the JavaScript bundle, and player progress lives in the
browser's `localStorage`.

> Global Paradigms Corp. is an original work of fiction by Zazie Productions. See the root `README.md`.

## Repository map

```
.
├── .github/workflows/ci.yml   six jobs: verify, content, canon, docs, seo, test — see CONTRIBUTING.md §4
├── index.html                 Vite entry. SEO/GEO head + generated crawlable block + JSON-LD
│                              (see docs/SEO.md). No third-party scripts.
├── public/
│   ├── _redirects, _headers   Netlify / Cloudflare Pages redirects + security headers
│   ├── robots.txt             open to all crawlers; AI crawlers welcomed by name
│   ├── sitemap.xml            exactly the 19 routed sections
│   ├── llms.txt               two-era brief for models and agents
│   ├── favicon.svg
│   └── assets/{audio,documents,images,textures,downloads}/   static media
│       └── images/og-card.jpg 1200×630 social card referenced by og:image
├── scripts/puzzle-digest.mjs          `npm run puzzle:digest` — hashes a puzzle answer for definitions.ts
├── scripts/render-static-block.mjs    `npm run seo:render` — regenerates index.html's generated regions
│                                      and the JSON-LD CSP hash in public/_headers + vercel.json
├── scripts/archive-report.mjs         `npm run archive:report` / `archive:report:check` — regenerates
│                                      docs/generated/ from src/content/**; CI fails on drift
├── scripts/generate-seo.mjs           `npm run seo:generate` / `seo:check` — per-route static entry
│                                      points, robots.txt, sitemap.xml, llms.txt
├── scripts/verify-dist.mjs            `npm run verify:dist` — fails the build if the artifact would not
│                                      be crawlable (runs automatically at the end of `npm run build`)
├── scripts/lib/                       shared generator library: `load-seo.mjs` (esbuild-bundles
│                                      `src/config/seo.ts` for Node) and `seo-surfaces.mjs` (every
│                                      machine-facing template)
├── vercel.json                Vercel build, redirects, SPA rewrite (excludes the crawler files), headers (CSP)
├── vite.config.ts             `@` alias → src, bundles to /static, manual vendor chunks
├── vitest.config.ts           jsdom, src/tests/setup.ts
├── eslint.config.js           flat config; bans `../` imports (use `@/…`)
├── AGENTS.md                  operating contract for AI agents working in this repo
├── docs/                      you are here — see docs/README.md for the map
└── src/
    ├── main.tsx               mounts <App/>, imports self-hosted fonts + global CSS
    ├── app/                   application shell and routing
    │   ├── app.tsx                RouterProvider
    │   ├── router.tsx             route table (lazy pages) + legacy redirects + 404
    │   ├── route-elements.tsx     RootLayout, LegacyRedirect, RouteError
    │   ├── archive-shell.tsx      boot gate, skip link, header/sidebar, global keys, all dialogs
    │   └── archive-ui-context.tsx which dialog is open; openDocument(); navigateToTab()
    ├── pages/                 one file per route (default export, lazy-loaded)
    ├── components/
    │   ├── archive/           document viewer, search, dead-link viewer, guide, RedactedText, SealMark
    │   ├── audio/             persistent audio player bar
    │   ├── corporate/         training-module + job-application modals
    │   ├── layout/            top header, sidebar
    │   ├── puzzles/           boot sequence, terminal, safe, clearance, prologue/finale, case banner,
    │   │                      directive board (the field run)
    │   │   ├── seals/         the seven seal puzzle widgets
    │   │   └── gateway/       the Gateway Transmission beginner trail
    │   └── ui/                design-system primitives (Modal, Panel, Badge, stamps, sigils, …)
    ├── content/               ALL authored data — no JSX
    │   ├── documents/ personnel/ offices/ projects/ departments/ audio/ communications/
    │   ├── corporate/ history/ restoration/ tools/ web/
    │   ├── puzzles/           definitions, seals, directives (field run), gateway, downloads, terminal text
    │   └── index.ts           barrel: every collection
    ├── lib/
    │   ├── archive/           record normaliser (records.ts), clearance helpers, redaction,
    │   │                      canon registry (canon.ts) + the two validators
    │   ├── puzzles/           progression store, investigation, directives (ledger), salvage, ciphers
    │   ├── search/            search index + query engine
    │   ├── audio/             Web Audio engine (procedural; no audio files)
    │   └── utils/             cn, sha256, download, text, geometry
    ├── hooks/                 useProgression, useInvestigation, useDirectives, useArchiveSearch, …
    ├── config/                site copy, navigation, clearance tiers, puzzle settings, feature flags
    ├── styles/                tokens.css, base.css, archive.css, boot.css, occult.css (index.css imports all)
    ├── types/                 records.ts, content.ts, puzzles.ts, directives.ts, search.ts (from index.ts)
    └── tests/                 Vitest suites + helpers
```

### Layering rules

| Layer     | May import                                   | Must not import            |
| --------- | -------------------------------------------- | -------------------------- |
| `types`   | nothing                                      | —                          |
| `content` | `types`, `lib/utils`, `lib/archive/*` (pure) | `config/navigation`, React |
| `config`  | `types`, `content`                           | components                 |

| `lib` | `types`, `content`, `config` | React components |
| `hooks` | `lib`, `config`, `content` | pages |
| `components` | everything above, `app/archive-ui-context` | pages |
| `pages` | everything above | other pages |

`config/seo-copy.ts` is a deliberate exception to the usual shape of `config`: it imports **nothing at
all**. The Node tsconfig project typechecks `src/tests/seo.test.ts` against it, and that project has no
DOM and cannot compile the component graph; `scripts/render-static-block.mjs` bundles it with esbuild for
the same reason. Anything needing the router (`SECTION_INDEX`, `routeSeo`) lives in `config/seo.ts`, which
re-exports the copy so consumers keep one import point. The studio/os/name values inside the copy are
therefore literals, and `seo.test.ts` pins them to `SITE`.

`config/navigation.ts` imports `@/content` (for record counts), so content must never import navigation —
that would be a cycle. Seal clues therefore store tab ids and build `/${tab}` paths themselves; a
content-integrity test checks every such path exists.

## Runtime flow

```
main.tsx
 └─ <App>  →  RouterProvider(routes)
     └─ RootLayout
         └─ <ArchiveShell>                          (app/archive-shell.tsx)
             ├─ BootSequence (FEATURES.bootSequence) → onComplete(callsign) → PrologueModal (first visit)
             ├─ skip link → <main id="main-content">
             ├─ TopHeader · Sidebar
             ├─ <Outlet/>  →  lazy page (Suspense + ErrorBoundary per page)
             ├─ AudioPlayerBar
             └─ dialogs: DocumentViewer (?doc=), GlobalSearch, Terminal, Safe, Clearance, Guide,
                 DeadLinkViewer, Gateway, TapeSpool (Directive 17), Finale, RevelationToasts
```

- **Dialogs** are coordinated by `ArchiveUiContext`: exactly one is open at a time; `openDialog`,
  `closeDialog`, `toggleDialog`.
- **Documents open by URL**: `openDocument(doc)` sets `?doc=<id>`, so a record can be deep-linked, and
  Back closes it. `?record=<id>` does the same for personnel/stations/programs via `useRecordParam`.
- **Global keys** (ignored while typing in a field): `/` or Ctrl/Cmd-K search, `` ` `` / `~` terminal,
  `u` de-scrambler, `Esc` closes the top-most dialog.
- **The `<head>` is rewritten on every navigation.** `<RouteMetadata/>` (`components/seo/route-metadata.tsx`,
  mounted by `ArchiveShell`) runs `routeSeo(pathname)` and writes the title, canonical, robots directive,
  Open Graph and Twitter tags into the live document, because Google renders JavaScript and therefore
  indexes the post-mount document rather than the head the static entry point served. Query strings are
  stripped so `?record=` / `?doc=` modal states collapse onto their section instead of being indexed as
  near-duplicates; a path with no canonical page (a missing file) gets `noindex` and no canonical at all.

## The SEO / GEO layer

Full strategy, keyword targets and the crawler matrix live in `docs/SEO.md`. Architecturally there are
three pieces:

1. **A static crawlable block inside `#root`.** Engines that do not execute JavaScript (GPTBot, ClaudeBot,
   PerplexityBot, OAI-SearchBot) would otherwise read an empty `<div>`. On `/` and `/legacy` the block is
   the complete two-era entity statement — lede, fact table, eras, quotes, FAQ, section index, fiction
   notice; every other route gets its own heading and description plus the same section index, so a
   section page is never a doorway page and never restates the homepage. React clears it on mount, so a
   JS user sees the terminal instead, and it doubles as real content during bundle download.
2. **Generated regions, generated everywhere.** Every machine-facing string is rendered from
   `config/seo.ts` by `scripts/lib/seo-surfaces.mjs`. `scripts/render-static-block.mjs` injects the block
   and the JSON-LD `@graph` into `index.html` between comment markers and rewrites the JSON-LD's sha256
   into the CSP in `public/_headers` and `vercel.json`; `scripts/generate-seo.mjs` injects all three
   regions, per route, into the built entry points (replacing the head Vite served), and writes
   `robots.txt`, `sitemap.xml` and `llms.txt`. `npm run seo:check` (part of `npm run check`) fails if any
   of them drifts from the copy; the block check compares content, not indentation, so Prettier stays free
   to format the file.
3. **Crawler files as real files.** `public/robots.txt`, `public/sitemap.xml` and `public/llms.txt` are
   excluded from the SPA rewrite in `vercel.json` (negative lookahead) and win over the `/*` splat in
   `public/_redirects`, so they are served as themselves. `_headers` caches them for one hour with
   `must-revalidate` so an edit propagates quickly.
4. **The artifact is verified, not assumed.** `scripts/verify-dist.mjs` runs at the end of
   `npm run build` and fails if a route entry point is missing its title, canonical, JSON-LD or crawlable
   block, if the sitemap is HTML or does not match the route manifest, if the 404 is not `noindex`, or if
   a catch-all rewrite would shadow the discovery files.

The `/legacy` route (`pages/legacy-page.tsx`) renders `LEGACY_PAGE` from the same copy inside the app —
amber-toned and filed under "OUT OF WORLD" in the sidebar, because it is the one page that talks about the
real domain rather than the fictional company. It is deliberately **not** an archive record: out-of-world
copy never enters the normaliser, the search index, or the export pipeline.

## State

| State                 | Where                                  | Persistence                          |
| --------------------- | -------------------------------------- | ------------------------------------ |
| Player progression    | `lib/puzzles/progression.ts` (store)   | `localStorage["gpc.progression.v1"]` |
| Milestones ledger     | `state.directives` in the same store   | same save (v3+)                      |
| Open dialog, open doc | `ArchiveUiContext` + URL search params | URL only                             |
| Audio playback        | `lib/audio/audio-engine.ts` singleton  | none                                 |
| Transient notices     | `lib/puzzles/revelations.ts`           | none                                 |

The progression store is a tiny framework-agnostic external store (`getState` / `dispatch` /
`subscribe`) with a pure reducer. React reads it via `useSyncExternalStore` in `useProgression()`;
`useInvestigation()` layers the Seven Seals selectors on top and `useDirectives()` the FIELD DIRECTIVES
read model. The reducer itself runs the Field Directives completion watcher (`syncCase()` in
`lib/puzzles/directives.ts`) after every action, so observable steps close their directive without any
component filing bookkeeping. See [PUZZLE_SYSTEM.md](PUZZLE_SYSTEM.md).

## Data flow

1. Authors write typed records in `src/content/**` ([CONTENT_MODEL.md](CONTENT_MODEL.md)).
2. `lib/archive/records.ts` normalises every collection into a uniform `ArchiveEntry` (id, kind, code,
   title, date, year, classification, status, sourcePath, tags, related, links, route, summary, body…).
   Missing metadata is derived (e.g. `sourcePath`), and cross-references are resolved.
3. `lib/archive/validate-content.ts` checks the whole archive _structurally_: unique ids, dangling
   references, dates, missing transcripts (`npm run validate:content`).
4. `lib/archive/validate-canon.ts` checks it _narratively_: chronology coherence, spine-event evidence,
   entity naming, code hygiene, spelling and the seal machinery (`npm run validate:canon`). Both read the
   declared facts in `lib/archive/canon.ts` — see [CONTINUITY.md](CONTINUITY.md).
5. Pages read the typed collections directly. Search and "related records" read `ArchiveEntry`.

## Search

`lib/search/search-index.ts`

1. **Normalise**: `getArchiveEntries()` (412 records across 17 kinds).
2. **Index** (lazy, once): per entry, one lower-cased string per field — `code, title, tags, author,
filename, project, department, office, year, summary, body`.
3. **Query**: split into terms (quoted phrases stay together). **AND** semantics: every term must hit at
   least one field. Score = sum of `FIELD_WEIGHTS` for each field hit (code 10 → body 1), with a large
   boost for an exact code match. Snippets come from the summary or body around the first term.
4. **Filters** run before scoring: kind, format, clearance tier, department, project, office, file status,
   media type, date range.

A linear scan over precomputed strings stays well under a millisecond per keystroke at this size. Past
roughly 10k records, swap in an inverted index; the `searchArchive()` API would not change.

**Client-safety.** Words hidden behind `[REDACTED: …]` are stripped before indexing, and the Order's own
records (`tags` include `Order`) are indexed by title and abstract only. Search can never surface text the
player isn't yet allowed to read. Both rules have tests (`search.test.ts`).

## Performance

- Every page is `React.lazy` and code-split. Vendor chunks (`react` incl. the router, `icons`) and the `content` data chunk are
  split in `vite.config.ts`. Hashed bundles go to `/static/*` and are cached immutably.
- Audio is synthesised on demand with Web Audio. No media files, and nothing starts without a user
  gesture.
- Fonts are self-hosted (`@fontsource/*`) with `font-display: swap`.

## Build commands

| Command                           | What it does                                         |
| --------------------------------- | ---------------------------------------------------- |
| `npm run dev`                     | Vite dev server with HMR                             |
| `npm run build`                   | `tsc -b` then `vite build` → `dist/`                 |
| `npm run preview`                 | serve `dist/` locally                                |
| `npm run typecheck`               | `tsc -b` (app + node configs)                        |
| `npm run lint` / `lint:fix`       | ESLint (flat config, React hooks, a11y-minded rules) |
| `npm run format` / `format:check` | Prettier (width 110)                                 |
| `npm test` / `test:watch`         | Vitest (jsdom)                                       |
| `npm run validate:content`        | content-integrity suite only (structural)            |
| `npm run validate:canon`          | canon suite only (narrative continuity)              |
| `npm run puzzle:digest -- …`      | hash a puzzle answer                                 |
| `npm run archive:report`          | regenerate `docs/generated/` from the content        |
| `npm run archive:report:check`    | fail if `docs/generated/` is stale                   |
| `npm run check`                   | typecheck → lint → test → report check → build       |
