# GLOBAL PARADIGMS CORP. — Recovered Archive

> **ACCESSION CARD**
>
> | Field   | Value                                                                                               |
> | ------- | --------------------------------------------------------------------------------------------------- |
> | Work    | _Global Paradigms Corp. // Secure Archive & Intelligence Repository_                                |
> | Studio  | Zazie Productions                                                                                   |
> | Medium  | Interactive fiction / single-player ARG, delivered as a fully static web application                |
> | Engine  | React 19 · React Router 7 · Vite 7 · Tailwind CSS v4 · TypeScript (strict) · Vitest 5               |
> | Corpus  | 412 typed records across 17 kinds · ~245,000 characters of narrative text · 1971 → 2026 in-world    |
> | Runtime | None. No server, no database, no API, no analytics. Everything the story knows ships in the bundle. |
> | Fiction | Entirely invented. No real organisations, people, science, or events.                               |

| Domain | globalparadigmscorp.com — a 2006 fan hoax, twenty years dark, reopened 2026 (see `docs/SEO.md`) |

**FICTION //** Global Paradigms Corp. is an original work of interactive fiction. The company, its staff,
projects, products, documents and events are invented; real place names appear only as fictional settings.
This domain previously hosted an unrelated, unauthorized fan-made hoax page during the 2006 alternate
reality game for a television series; that page was taken down the same year and is not preserved,
continued, endorsed or referenced by this work. The 2026 archive is not affiliated with any existing
franchise, studio, broadcaster, or the author of that earlier site.
This notice is also rendered inside the application itself, on every public page.

---

## What this is

A cold terminal boots. `PARADIGM-OS v8.4.2` rolls past. You are a guest investigator inside the recovered
document archive of **Global Paradigms Corp.** — a strategic-forecasting company founded in 1971, best
known for measuring a 14.8 Hz sub-audible tone in bedrock, for products that were recalled, and for a
secret it kept inside its own vaults: **the Ordo Vocis Profundae**, and the Seven Seals they locked over it.

You read the records. You search 412 of them — documents, personnel files, station telemetry, annual
reports, emails, dead hyperlinks from a 1998 intranet, restoration logs written by the archivists who
recovered all of it. Clearance levels gate what you can open, and clearance is **earned by breaking the
Seals**, never granted by clicking. Seven cryptographic puzzles, each keyed to a planetary seal and a
colour, escalate from a magic square to a hymn acrostic to a name spoken into the carrier signal.

The project exists twice over: as a piece of fiction with an actual investigation arc (puzzles, ciphers,
hidden Choir Script fragments on ordinary-looking corporate pages), and as an engineering artifact — a
type-safe content pipeline, a redaction system that is correct at the DOM level, and a static build with
no moving parts.

**What this repo is not:** a game engine, a framework, or a template. It is one self-contained work.
The engineering decisions documented below exist to keep _this_ corpus consistent over long authoring
sessions, and that constraint shaped nearly everything.

---

## Quick start

Requires **Node ≥ 20.19** (measured on 22.22.3), npm, and a modern browser.

```sh
git clone https://github.com/zazieproductions/2Global-Paradigms-Corp.git
cd 2Global-Paradigms-Corp
npm ci
npm run dev        # http://localhost:5173
```

The full verification pipeline in one command — typecheck → lint → tests → derived-docs check → build:

```sh
npm run check
```

The three commands for working on the fiction itself:

```sh
npm run validate:canon      # narrative continuity — 0 errors expected
npm run validate:content    # structural integrity — 0 errors; warnings are authored gaps
npm run archive:report      # regenerate docs/generated/, then read `git diff docs/generated`
```

No API keys, no `.env` file, no docker-compose, no account. The app fetches nothing beyond its own
static files: `grep -rE "fetch\(|XMLHttpRequest|sendBeacon" src/` returns zero hits by design.

---

## Claims, with the command to check each one

This README deliberately contains no unverifiable adjectives. Every count below was measured against this
checkout on 2026-09-30; regenerate any of them with the listed command. Corpus figures (records, kinds,
date span, character count) are maintained in
[`docs/generated/CORPUS.md`](docs/generated/CORPUS.md) and fail CI if they go stale.

| Claim                                                                                                                                     | Verify with                                    |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `tsc -b` passes with zero errors under `strict: true` (+ `noUnusedLocals`/`noUnusedParameters`/`noFallthroughCasesInSwitch`)              | `npm run typecheck`                            |
| ESLint (flat config) and Prettier are clean                                                                                               | `npm run lint && npm run format:check`         |
| **193 tests in 16 files** pass (reducer, validation, search, routes, a11y, boot, digest script, content integrity, tape salvage, SEO/GEO) | `npm test`                                     |
| index.html's crawlable layer, JSON-LD, the CSP hash, robots.txt, sitemap.xml and llms.txt all agree with `src/config/seo.ts`              | `npm run seo:check`                            |
| The built artifact is crawlable: 19 route entry points, non-HTML sitemap, real 404, no catch-all rewrite                                  | `npm run verify:dist`                          |
| 412 records, 17 kinds, no duplicate ids, no dangling cross-refs                                                                           | `npm run validate:content`                     |
| Chronology, entity naming, seal machinery and terminology agree with the declared canon                                                   | `npm run validate:canon`                       |
| The derived reference in `docs/generated/` matches the source                                                                             | `npm run archive:report:check`                 |
| Every redaction has a de-scrambled counterpart                                                                                            | part of the suite above (`content-integrity`)  |
| No runtime network calls; no `dangerouslySetInnerHTML`/`innerHTML`/`eval` anywhere in `src/`                                              | the greps shown in “Quick start”               |
| Initial JS+CSS transfer ≈ **347 kB gzipped** incl. the entire corpus                                                                      | `npm run build` and read the chunk table below |

---

## The archive, counted

All content is typed data in `src/content/**` — no story text lives in components. The sidebar badges and
the counts below are **derived from the collections themselves**, so they cannot go stale.

| Kind         | Count | Kind        | Count | Kind              | Count |
| ------------ | ----: | ----------- | ----: | ----------------- | ----: |
| `document`   |   174 | `press`     |    16 | `newsletter`      |     6 |
| `timeline`   |    52 | `project`   |    14 | `audio`           |     6 |
| `personnel`  |    45 | `email`     |    14 | `annual-report`   |     6 |
| `office`     |    22 | `job`       |    12 | `restoration-log` |     6 |
| `department` |    10 | `meeting`   |    10 | `training`        |     4 |
| `product`    |     8 | `dead-link` |     7 |                   |       |

- **174 documents** = 25 hand-authored core records (`doc-001…doc-025`), 140 templated catalogue entries
  (`doc-026…doc-165`), and 9 Ordo Vocis Profundae evidence files (`ovp-001…ovp-009`).
- **Routing:** 20 lazy pages — 18 archive sections, the Legacy File, and an in-world `FILE NOT FOUND`
  view — and 6 legacy
  aliases that are 301s at the edge (`vercel.json`, `public/_redirects`) and `Navigate replace` in-app,
  with query strings preserved (a route test pins that).
- **Corpus:** ~245,000 characters of summaries + bodies across the normalised archive; in-world dates run
  1971–2026. Both figures are generated, not retyped — see [`docs/generated/CORPUS.md`](docs/generated/CORPUS.md).
- **Every audio artifact ships a transcript and a plain-language description** (validator-enforced) — the
  fiction never depends on hearing it.

---

## The investigation

Two puzzle tracks share one engine. Logic is pure and framework-free (`src/lib/puzzles/**`); widgets only
render results. Components never compare answers themselves.

### Clearance — earned, never chosen

Five tiers (`Level 1 · General` → `Level 5 · Black Dossier`). Your effective clearance is the _maximum
reward of puzzles you have completed_; the profiler lets you browse below it, never above. Sealed records
open as a notice — title, abstract, which seal earns access — and **their exports are refused**.

### THE SEVEN SEALS (`/sanctum`) — the main track

Seals open strictly in order; the reducer enforces it, so a stray dispatch cannot skip ahead. Each yields a
Seal-Word. The colour column is the design-system token that themes each seal (`--color-seal-*`); swatches
below are approximate, hex is canonical.

| Seal | Planet  | Glyph | Widget / puzzle                                       | Colour (token)             | Earns                         |
| ---- | ------- | :---: | ----------------------------------------------------- | -------------------------- | ----------------------------- |
| I    | Saturn  |   ♄   | Magic square (Kamea Saturni)                          | ⬜ `#94a3b8` · lead steel  | L2                            |
| II   | Jupiter |   ♃   | Heptagram / Wheel of Days                             | 🟦 `#60a5fa` · tin blue    | L3 + de-scrambler             |
| III  | Mars    |   ♂   | Choir Script cipher (Scattered Choir)                 | 🟥 `#f87171` · iron red    | full glyph alphabet           |
| IV   | Sun     |   ☉   | Three-voice tone lock (typed numbers; audio optional) | 🟨 `#fbbf24` · gold        | L4                            |
| V    | Venus   |   ♀   | Hymn acrostic (Redacted Hymn)                         | 🟩 `#34d399` · venus green | —                             |
| VI   | Mercury |   ☿   | Vigenère wheel → opens Thorne's safe                  | 🟪 `#c084fc` · quicksilver | L5 + master dump              |
| VII  | Moon    |   ☾   | The Name — terminal `invoke <name>`                   | ⬜ `#e2e8f0` · moon silver | the finale (carrier 0.000 Hz) |

**Answers are stored as SHA-256 digests**, not as text: `npm run puzzle:digest -- -n alnum-upper "…"`
regenerates one, and nothing in `definitions.ts` is greppable for an answer. They are _not_ absent from
the bundle, and this README does not claim otherwise — the assisted route requires plaintext tier-3
hints, and success/journal text names what was solved. The full list of where answers may and may not
live is [`docs/REVELATION.md`](docs/REVELATION.md) §6; the only place they are collected for testing is
`src/tests/seal-fixtures.ts`, which is test-only and never bundled.

### Everything else on the track

- **Gateway Transmission** — a four-step guided beginner trail (sequence → signal → waveform →
  transmission). Grants _no clearance_: only the seals do. Ends with a JSON evidence export, `OriginProtocol_Gateway_Transmission.json`.
- **Choir Script fragments** — glyph pairs hidden faintly on seven _public_ pages (newsletters, careers,
  timeline, values, products, reports, dead links). Collecting one teaches its letters; Order documents
  carry marginalia readable only for letters you know.
- **Directive 17 — the Unquiet Tape** — a hidden salvage layer. Files the dossiers cite but the vault
  “never recovered” were _struck, not deleted_: they survive as tape ghosts on the Postojna spool, and you
  splice one back together by ordering its reel fragments (`salvage <code>` in the terminal’s undocumented
  dead channels, or from a dossier’s “not in vault” citation — purged codes also answer `?doc=` with
  “Ghost on the tape” instead of a 404). Splice all three and the spool replays the purge order itself.
  No clearance and no answers: the ghosts are not records (they never enter search or exports), and a test
  pins that the layer cannot leak anything still sealed.
- **Hints are tiered and no-shame:** `ASK THORNE → ASK AGAIN → TELL ME`. Tier 3 hands over the answer, the
  completion is marked **ASSISTED**, every reward is still granted, and a later unassisted replay upgrades
  the record — an assisted replay never downgrades an unassisted one.
- **Terminal (`~`)** — 21 documented commands (`whoami`, `cat <doc-code>`, `scan`, `gematria`, `codex`,
  `invoke`…), plus a few undocumented aliases that exist only to react in-fiction to the wrong moves, and
  two dead channels (`purge` / `salvage`) that answer for the files Directive 17 struck. Seven legacy
  “executive override” codes are recognised **solely so they can be refused**.
- **Persistence** — `localStorage["gpc.progression.v1"]`, validated on load: unknown ids, malformed
  entries, and stored clearance above earned clearance are dropped; a pre-restructure save key is migrated
  once, read-only. Private mode / quota exceeded degrades silently to memory. No accounts, no sync, no
  telemetry — per-browser progress is an accepted trade-off, not an oversight.

---

## Colour as documentation

The palette is a schema, not a mood board: colour is assigned only where the fiction gives it a meaning,
and every state that has a colour also has text.

| Token      | Hex         | In-world meaning     | UI meaning               |
| ---------- | ----------- | -------------------- | ------------------------ |
| `signal`   | `#00f0ff`   | the 14.8 Hz carrier  | primary interactive      |
| `phosphor` | `#39ff14`   | telemetry OK         | status OK                |
| `alert`    | `#ff0055`   | breach               | danger / de-scrambler on |
| `order`    | `#d946ef`   | Ordo Vocis Profundae | seals, case file         |
| `void`     | `#04060a`   | the terminal well    | page/canvas base         |
| `seal-*`   | table above | planetary metals     | per-seal theming         |

Tailwind's `slate-500`/`slate-600` are **overridden** (`#8190a5`, `#738299`) so 10px metadata still clears
WCAG AA contrast on the panel surfaces. No arbitrary hex values are allowed in components — if a colour
recurs, it becomes a token (`docs/DESIGN_SYSTEM.md`).

---

## Engineering notes

### Architecture

Static, client-only SPA. Data flows one way:

```
content (typed TS) → normaliser (ArchiveEntry) → pages · search · validator
                                    ↑
              progression store (pure reducer + useSyncExternalStore)
```

- **A layering table in `docs/ARCHITECTURE.md`** defines what may import what (`types → content → config →
lib → hooks → components → pages`), and ESLint bans `../` imports outright — everything crosses folders
  via `@/` aliases, which is what makes the layer rules mechanically checkable.
- **One dialog at a time**, coordinated by a context; documents deep-link as `?doc=<id or code>` so Back
  closes them (both spellings are tested); records deep-link as `?record=<id>`. Global keys (`/` or
  ⌘/Ctrl-K search, `` ` `` terminal, `u` de-scrambler) are suppressed while typing.
- **Per-page `React.lazy` + Suspense + ErrorBoundary**: one corrupt page cannot take down the archive; the
  boundary recovers in-world.

### The redaction invariant

Hidden words are written inline as `[REDACTED: …]` and **stripped before render** — they never reach the
DOM, exports, the clipboard, or the search index. Records with the `Order` tag are indexed by title and
abstract only. Search can therefore never surface text the player is not cleared to read, and both rules
are pinned by tests (`search.test.ts`, `content-integrity.test.ts`); any document hiding words must supply
`redactedContent` or the suite fails. With zero `innerHTML`/`dangerouslySetInnerHTML` in `src/`, the
invariant rests on React's own text rendering — there is no raw-HTML side door to keep honest.

### Search

A linear scan over per-field normalised strings with `AND` semantics and field-weighted scoring (code 10 →
body 1, huge boost for exact code matches). ~412 records keeps a keystroke well under a millisecond; the
documented escape hatch past ~10k records is an inverted index _behind the same `searchArchive()` API_.
Facet filters (kind, format, clearance tier, department, project, office, file status, media type, date
range) run before scoring.

### Audio

There are no audio files. All six artifacts are synthesised on demand with the Web Audio API from typed
`synthesisPreset` data; the `AudioContext` is created lazily on first user gesture and nothing — _nothing_ —
autoplays. A persistent player bar carries playback; sound can be muted globally; transcripts always exist.

### Build & performance (measured, `npm run build`, ~5 s)

| Chunk          | Role                                             |         Raw |        Gzip |
| -------------- | ------------------------------------------------ | ----------: | ----------: |
| `react`        | react-dom + router                               |    315.7 kB |    100.5 kB |
| `content`      | the 412-record corpus + the tape ghosts          |    385.3 kB |    130.2 kB |
| `index`        | app code, including the SEO/GEO layer            |    273.3 kB |     82.1 kB |
| CSS            | tokens + archive + boot + occult                 |    135.7 kB |     26.9 kB |
| `icons`        | lucide subset                                    |     21.3 kB |      7.1 kB |
| 25 more chunks | 21 lazy route chunks + 4 split shared components | 0.2–36.7 kB | 0.2–11.4 kB |

≈347 kB gzipped of JS+CSS on first visit, _including the whole story_ and the crawlable layer
(`routeSeo()`, the live `<head>` rewrites, the Legacy File). Hashed bundles emit to `/static/*` and are
served `max-age=31536000, immutable`; the corpus chunk is intentionally one large cacheable object
(`chunkSizeWarningLimit: 700` with the reason in a comment, not silenced). Fonts are self-hosted
`@fontsource` subsets with `font-display: swap`. Total `dist/`: 109 files, 3.5 MB on disk — 19 route entry
points plus `404.html` carry the crawlable block and JSON-LD written by `scripts/generate-seo.mjs`.

### HTTP posture

`vercel.json` and `public/_headers` ship identical security headers (the comment in each file keeps them in
sync): a strict `default-src 'self'` CSP, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
and `Permissions-Policy` that **denies camera, microphone, geolocation, and interest-cohort**. No mechanic
in this game touches the real world: puzzles never ask for personal data, make requests, or read sensors.
The only build-time environment variables are `VITE_FEATURE_*` flags (`envPrefix: ['VITE_']` keeps secrets
out of reach by construction — and there are none to keep).

### Testing

193 tests across 16 files, all `console.error`-hostile (the route suite fails if rendering logs one):
`content-integrity` (ids, cross-refs, redaction pairing, clue targets, the exact set of tolerated
validator warnings, and that every purged record stays struck), `canon` (chronology coherence, spine
evidence, seal order and Seal-Word initials, Choir coverage, degree alignment, entity naming, Directive 17),
`progression` (reducer: ordering,
clearance derivation, assisted upgrades, save migration/quota fallback), `puzzle-validation` (normalisation,
revoked codes, requirement gating), `search` (AND semantics + the two client-safety rules), `routes` (every
nav path renders, legacy redirects preserve query strings, `?doc=`/`?record=` deep links record
discovery), `modal-boot` (focus trap, Escape, focus restore), `puzzles-ui`, `mobile-ux`, `salvage` +
`salvage-ui` (Directive 17 ghost content, the splice engine, the spool interaction, and the rule that the
hidden layer never leaks sealed answers), `verify-dist` (the build artifact stays crawlable: sitemap,
robots, llms.txt, 404, and the generated JSON-LD in every entry point), `seo` + `seo-route` (below), and a
test that the digest script matches `lib/puzzles/validate.ts` byte-for-byte semantics.

### SEO & GEO

The domain spent 2006–2026 documented on the web as a _Lost_ ARG hoax, so the discoverability problem is
entity resolution: be the clearest citable statement of what the URL is now while confirming what it was.

Copy lives once in `src/config/seo.ts` (prose in `seo-copy.ts`, routes in `seo-pages.json`) and every
machine-facing surface is **generated from it**: `scripts/render-static-block.mjs` writes the crawlable
block and JSON-LD in `index.html`, and `scripts/generate-seo.mjs` writes the per-route entry points,
`robots.txt`, `sitemap.xml` and `llms.txt` after each build. Non-JS crawlers — GPTBot, ClaudeBot,
PerplexityBot, OAI-SearchBot — cannot execute the SPA, and before this layer the only HTML they could read
was an empty `<div id="root">`; now every route ships the two-era dossier in raw HTML, and React clears the
container on mount so players see the terminal instead.

The JSON-LD deliberately carries **no `Organization` node for the fictional company**, so no engine can
hallucinate a real business out of it; the real publisher holds that node, and the work itself carries a
`disambiguatingDescription` plus a `subjectOf` pointing at the external record of the 2006 hoax.

`robots.txt` welcomes AI crawlers by name, `sitemap.xml` covers exactly the 19 routed sections and nothing
that is not routed, and `llms.txt` is a one-page brief for models — including the two rules that matter
when this site is summarised: it is fiction, and the two eras are not one work. The `seo` and `seo-route`
suites (51 tests) hold every surface — head tags, generated regions, the CSP hash, robots, sitemap, llms,
`SITE.title` — to the same account, and `npm run check` runs `seo:check` so a stale generated file fails
CI. Rationale, keyword targets, the crawler matrix and the franchise-naming decision: `docs/SEO.md`.

### Accessibility (a product requirement, not a coat of paint)

Skip link + landmarks; exactly one `h1` per page; `role="dialog"` modals with focus trap and restore; every
puzzle widget keyboard-operable — the magic square, heptagram, tone-lock dials and keypads all work without
a pointer, and the tone lock accepts typed numbers because the audio is flavour, not a requirement. Labels
on every input, `aria-live` for puzzle results, state never signalled by colour alone (`L3`, `SEALED`,
`✓ earned`), `prefers-reduced-motion` collapses every animation, and no information lives in motion or
hover.

---

## Authoring

The content pipeline is the part most likely to be extended, so it has the hardest rules
(`docs/CONTENT_MODEL.md`):

1. One collection per file, `SCREAMING_CASE` array exports, re-exported from a single barrel.
2. **Ids are stable forever** (they appear in URLs, saves, and cross-references); human-facing `code`s
   like `DOC-1994-HALLOWAY-MEMO` are separate fields.
3. Cross-references are typed ids checked by `validateContent()` in CI; `sourcePath` and other metadata are
   derived by the normaliser rather than hand-maintained.
4. `editorialNote` never renders and never exports — author margin notes cannot leak into the fiction.
5. New record → append → `npm run validate:content`. It appears in the vault, search, and related-records
   panels automatically, addressable at `/documents?doc=<id or code>`.

Conventions: Prettier (print width 110, single quotes, no trailing commas — `.prettierrc.json` is
authoritative, not taste); `type`-only imports enforced by ESLint; `Button` defaults to
`type="button"`; `cn()` is a plain class joiner _not_ tailwind-merge, so a passed `className` cannot
silently override base styles — the escape hatch is Tailwind's `!` suffix, deliberately awkward.

## Deployment

It is a folder of static files. `npm run build` emits a crawlable HTML entry point for every public route,
generates the crawler files, and writes a real noindex 404, then runs `verify:dist` and fails if the
artifact would not be crawlable (missing discovery file, HTML sitemap, an entry point with no crawlable
block, or a catch-all rewrite). No broad SPA fallback is needed — and a `/*  /index.html  200` rule, in
`_redirects` or in a hosting dashboard, hides `/sitemap.xml` and `/robots.txt` behind the application
shell, so `verify:dist` rejects it. The repo ships ready-made config for **Vercel** (`vercel.json`) and
**Netlify/Cloudflare Pages** (`public/_headers`, `public/_redirects` — keep the redirect tables in all
three places in sync; a routes test covers the in-app half). `npm run preview` serves the exact production
output locally. The crawler-facing files (`robots.txt`, `sitemap.xml`, `llms.txt`) are real files in the
publish directory and are excluded from the SPA rewrite in both `vercel.json` and `public/_redirects`, so
they are served as themselves rather than as the app shell. `public/assets/**`
directories are intentionally empty: media is optional garnish on a procedurally-synthesised, text-first
corpus (drop files in, set `src` on an `AudioArtifact`, and see
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) §7). Build-time flags: `VITE_FEATURE_BOOT_SEQUENCE`, `VITE_FEATURE_PERSIST_PROGRESS`,
`VITE_FEATURE_ASSISTED_BYPASS`, `VITE_FEATURE_UI_SOUNDS` (all default on). `GPC_SOURCE_TAGS=1` opts into a
gitignored, machine-local Vite plugin that tags JSX with `file:line` for element pickers; production builds
never require it.

## Documentation map

Start at [`docs/README.md`](docs/README.md), which holds the map and the reading orders.

**Narrative architecture** — what is true, and how it stays true

| Document                                                     | Covers                                                                                                |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| [`docs/CANON.md`](docs/CANON.md)                             | the story bible: cosmology, institutions, people, places, programmes, terminology, order of authority |
| [`docs/CHRONOLOGY.md`](docs/CHRONOLOGY.md)                   | three chronologies, the nine spine events, the intervals between them, eras, authored gaps            |
| [`docs/CONTINUITY.md`](docs/CONTINUITY.md)                   | the named invariants and what enforces each, the authored gaps, the drift log                         |
| [`docs/REVELATION.md`](docs/REVELATION.md)                   | knowledge states, the five gates, clue readability, spoiler containment                               |
| [`docs/CLUE_LEDGER.md`](docs/CLUE_LEDGER.md)                 | clue → payoff traceability and the change-impact table                                                |
| [`docs/CONTENT_STYLE_GUIDE.md`](docs/CONTENT_STYLE_GUIDE.md) | the five registers, numbers, dates, codes, redactions, prohibited content                             |

**Engineering** — how it is built

| Document                                         | Covers                                                         |
| ------------------------------------------------ | -------------------------------------------------------------- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)   | repo map, layering rules, runtime flow, state, search, build   |
| [`docs/CONTENT_MODEL.md`](docs/CONTENT_MODEL.md) | types, collections, normaliser, redaction syntax, authoring    |
| [`docs/PUZZLE_SYSTEM.md`](docs/PUZZLE_SYSTEM.md) | puzzle model, validation, hints/assisted, rewards, persistence |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | tokens, components, a11y, responsive behaviour                 |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)       | hosts, redirects, headers, caching, environment flags, media   |

**Process** — [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) (the contract, the loop, CI, and the section for AI agents)
and [`AGENTS.md`](AGENTS.md) at the repo root.

**Generated** — `docs/generated/` is derived from the source by `npm run archive:report` and verified by
`npm run archive:report:check`: [`CORPUS.md`](docs/generated/CORPUS.md) (the authoritative counts),
[`CHRONOLOGY.md`](docs/generated/CHRONOLOGY.md), [`CLUE_LEDGER.md`](docs/generated/CLUE_LEDGER.md),
[`KNOWLEDGE_MATRIX.md`](docs/generated/KNOWLEDGE_MATRIX.md) and
[`REGISTRY.md`](docs/generated/REGISTRY.md) and
[`CANON_LEDGER.json`](docs/generated/CANON_LEDGER.json). Never hand-edit them.

## Known limitations (stated, not buried)

- **Digests are spoiler deterrents, not security.** Answers are not greppable in the bundle, but short
  answers brute-force in milliseconds and anyone can edit their own `localStorage`. Accepted: this is a
  single-player story, and the design compensates by marking assisted runs honestly.
- **Assisted-route text contains answers by design** (tier-3 hints, success bodies, journal lines must
  exist client-side). Server-side validation is modelled in the types (`validation.method: 'server'`) and
  deliberately **not implemented**; static builds report such puzzles `unavailable`.
- **Progress is per-browser.** Clearing site data starts over; there are no accounts and none planned.
- **No `LICENSE` file exists yet**, so none is granted: all code and narrative content is © Zazie
  Productions, all rights reserved. Adopting explicit (and likely separate) licenses for code vs. content
  is an open item.
- **Media assets are still absent.** `public/assets/**` is empty by design (audio is synthesised, the
  corpus is text), and every artifact ships a transcript, so nothing is blocked — but a hosted recording
  would be strictly better than a synthesis preset for `audio-01`. See
  [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) §7.

## FAQ

**Is any of this real?** No. Every entity is invented; the app repeats this on every page, in the
`<noscript>` fallback, and in its meta description.

**Does it phone home?** It cannot — there is no runtime code path that makes requests, verified by grep and
by a CSP whose `connect-src` is `'self'`.

**Why a static site for a puzzle game?** Because the entire truth has to ship to the player anyway; a
server would add an attack surface, an uptime obligation, and a privacy story without adding a single
puzzle the game can actually use. The one thing a server _would_ buy (real answer validation) is modelled
in the types so the day it matters is a swap, not a rewrite.

**I want to read the raw records without playing.** `/documents?doc=<id or code>`, search, and the vault
views already treat the archive as a library; clearance gating is a story device, and the corpus source in
`src/content/**` is written to be read as plain TypeScript.

## Credits

Design, engineering, and all 412 records of the archive: **Zazie Productions**, built in the open with
dependabot on the dependency graph. Bugs, corrections, and accessibility reports are handled as issues on
this repository; puzzle spoilers belong on the vault floor, not the issue tracker.

```
PARADIGM-OS v8.4.2 // GLOBAL PARADIGMS CORP. — SECURE ARCHIVE
END OF ACCESSION SUMMARY // THE RECORDS ARE REAL AS LONG AS YOU KEEP READING
LOGOFF: close this tab. the carrier will still be there.
```
