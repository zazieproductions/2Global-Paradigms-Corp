# GLOBAL PARADIGMS CORP. — Recovered Archive

> **ACCESSION CARD**
>
> | Field   | Value                                                                                               |
> | ------- | --------------------------------------------------------------------------------------------------- |
> | Work    | _Global Paradigms Corp. // Secure Archive & Intelligence Repository_                                |
> | Studio  | Zazie Productions                                                                                   |
> | Medium  | Interactive fiction / single-player ARG, delivered as a fully static web application                |
> | Engine  | React 19 · React Router 7 · Vite 7 · Tailwind CSS v4 · TypeScript (strict) · Vitest 5               |
> | Corpus  | 412 typed records across 17 kinds · ~239,000 characters of narrative text · 1971 → 2026 in-world    |
> | Runtime | None. No server, no database, no API, no analytics. Everything the story knows ships in the bundle. |
> | Fiction | Entirely invented. No real organisations, people, science, or events.                               |

**FICTION //** Global Paradigms Corp. is an original work of interactive fiction. The company, its staff,
projects, products, documents and events are invented; real place names appear only as fictional settings.
Nothing here is affiliated with any existing franchise, studio, or prior third-party website.
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

Over everything sits **OPERATION SILENTIUM**, the mission layer: five chapters and fourteen directives
with auto-completing steps and FIELD INTEL payoffs, so the archive plays as one continuous, always-guided
investigation rather than a shelf of files. There is always exactly one current objective.

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

The full verification pipeline in one command — typecheck → lint → tests → build:

```sh
npm run check
```

No API keys, no `.env` file, no docker-compose, no account. The app fetches nothing beyond its own
static files: `grep -rE "fetch\(|XMLHttpRequest|sendBeacon" src/` returns zero hits by design.

---

## Claims, with the command to check each one

This README deliberately contains no unverifiable adjectives. Every count below was measured against this
checkout on 2026-09-30; regenerate any of them with the listed command.

| Claim                                                                                                                          | Verify with                                    |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| `tsc -b` passes with zero errors under `strict: true` (+ `noUnusedLocals`/`noUnusedParameters`/`noFallthroughCasesInSwitch`)   | `npm run typecheck`                            |
| ESLint (flat config) and Prettier are clean                                                                                    | `npm run lint && npm run format:check`         |
| **111 tests in 11 files** pass (reducer, validation, directives, search, routes, a11y, boot, digest script, content integrity) | `npm test`                                     |
| 412 records, 17 kinds, no duplicate ids, no dangling cross-refs                                                                | `npm run validate:content`                     |
| Every redaction has a de-scrambled counterpart                                                                                 | part of the suite above (`content-integrity`)  |
| No runtime network calls; no `dangerouslySetInnerHTML`/`innerHTML`/`eval` anywhere in `src/`                                   | the greps shown in “Quick start”               |
| Initial JS+CSS transfer ≈ **308 kB gzipped** incl. the entire corpus                                                           | `npm run build` and read the chunk table below |

---

## The archive, counted

All content is typed data in `src/content/**` — no story text lives in components. The sidebar badges and
the counts below are **derived from the collections themselves**, so they cannot go stale.

On top of the records sits the **mission layer** — OPERATION SILENTIUM (`/directives`): five chapters and
fourteen directives whose steps auto-complete from archive events, with a FIELD INTEL lore payoff per
directive (see “The investigation”).

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
- **Routing:** 20 lazy pages — 19 archive sections (including Mission Control, `/directives`) plus an
  in-world `FILE NOT FOUND` view — and 6 legacy aliases that are 301s at the edge (`vercel.json`,
  `public/_redirects`) and `Navigate replace` in-app, with query strings preserved (a route test pins that).
- **Corpus:** ~239,000 characters of summaries + bodies across the normalised archive; in-world dates run
  1971–2026.
- **Every audio artifact ships a transcript and a plain-language description** (validator-enforced) — the
  fiction never depends on hearing it.

---

## The investigation

Two puzzle tracks share one engine, and a mission layer sequences them into one playable arc. Logic is
pure and framework-free (`src/lib/puzzles/**`); widgets only render results. Components never compare
answers themselves.

### OPERATION SILENTIUM (`/directives`) — the mission layer

The archive is not left as a pile of records: everything the operator does is organised into **five
chapters / fourteen directives** with auto-tracked steps, from _Arrival Protocol_ through _The Liturgy
Beneath_, _Three Voices One Hymn_, _Black Dossier_ and _Silentium_.

- **One current objective, always.** Chapters unlock in order and directives within a chapter unlock in
  order, so there is exactly one thing to do next — surfaced on the dashboard, in the sidebar, and in
  Mission Control.
- **Steps complete themselves.** A step is an observable event (a record opened, a section visited, a
  fragment collected, a seal broken, the terminal answering `scan`, the de-scrambler engaging…). Nothing
  to submit, nothing to bookkeep; a `milestone` ledger in the progression store records the rest.
- **Every directive pays FIELD INTEL** — a lore paragraph that stitches the case together — plus a journal
  line and a toast; every chapter raises the operator's standing. Clearance still comes only from seals.
- Content in `src/content/puzzles/directives.ts`, selectors in `src/lib/puzzles/directives.ts`, tests in
  `src/tests/directives.test.ts` (selectors + reducer) and `src/tests/directives-ui.test.tsx` (page,
  tracker, completion watcher).

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

**Answers are deliberately absent from this README, from `docs/`, and from app-readable text.** Validation
is SHA-256 over normalised input (`npm run puzzle:digest -- -n alnum-upper "…"` regenerates a digest).
Plaintext answers exist in exactly one place: `src/tests/seal-fixtures.ts`, test-only.

### Everything else on the track

- **Gateway Transmission** — a four-step guided beginner trail (sequence → signal → waveform →
  transmission). Grants _no clearance_: only the seals do. Ends with a JSON evidence export, `OriginProtocol_Gateway_Transmission.json`.
- **Choir Script fragments** — glyph pairs hidden faintly on seven _public_ pages (newsletters, careers,
  timeline, values, products, reports, dead links). Collecting one teaches its letters; Order documents
  carry marginalia readable only for letters you know.
- **Hints are tiered and no-shame:** `ASK THORNE → ASK AGAIN → TELL ME`. Tier 3 hands over the answer, the
  completion is marked **ASSISTED**, every reward is still granted, and a later unassisted replay upgrades
  the record — an assisted replay never downgrades an unassisted one.
- **Terminal (`~`)** — 21 documented commands (`whoami`, `cat <doc-code>`, `scan`, `gematria`, `codex`,
  `invoke`…), plus a few undocumented aliases that exist only to react in-fiction to the wrong moves.
  Seven legacy “executive override” codes are recognised **solely so they can be refused**.
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

| Chunk          | Role                                            |            Raw |        Gzip |
| -------------- | ----------------------------------------------- | -------------: | ----------: |
| `react`        | react-dom + router                              |       315.7 kB |    100.7 kB |
| `content`      | the entire 412-record corpus + directive layer  |       397.5 kB |    133.3 kB |
| `index`        | app code                                        |       243.7 kB |     72.8 kB |
| CSS            | tokens + archive + boot + occult                |       137.0 kB |     27.4 kB |
| `icons`        | lucide subset                                   |        20.8 kB |      6.9 kB |
| 26 more chunks | 20 lazy page chunks + 6 split shared components | 0.2–38 kB each | 0.2–11.7 kB |

~346 kB gzipped of JS+CSS on first visit, _including the whole story_. Hashed bundles emit to `/static/*`
and are served `max-age=31536000, immutable`; the corpus chunk is intentionally one large cacheable object
(`chunkSizeWarningLimit: 700` with the reason in a comment, not silenced). Fonts are self-hosted
`@fontsource` subsets with `font-display: swap`. Total `dist/`: 67 files, 2.5 MB on disk.

### HTTP posture

`vercel.json` and `public/_headers` ship identical security headers (the comment in each file keeps them in
sync): a strict `default-src 'self'` CSP, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
and `Permissions-Policy` that **denies camera, microphone, geolocation, and interest-cohort**. No mechanic
in this game touches the real world: puzzles never ask for personal data, make requests, or read sensors.
The only build-time environment variables are `VITE_FEATURE_*` flags (`envPrefix: ['VITE_']` keeps secrets
out of reach by construction — and there are none to keep).

### Testing

111 tests across 11 files, all `console.error`-hostile (the route suite fails if rendering logs one):
`content-integrity` (ids, cross-refs, redaction pairing, clue targets, directive step targets),
`progression` (reducer: ordering, clearance derivation, assisted upgrades, save migration/quota fallback),
`directives` (milestone ledger + chapter/directive unlocking, end-to-end to SILENTIUM),
`puzzle-validation` (normalisation, revoked codes, requirement gating), `search` (AND semantics + the two
client-safety rules), `routes` (every nav path renders, legacy redirects preserve query strings,
`?doc=`/`?record=` deep links record discovery), `modal-boot` (focus trap, Escape, focus restore),
`puzzles-ui`, `directives-ui` (Mission Control, tracker strip, completion watcher), `mobile-ux`, and a test
that the digest script matches `lib/puzzles/validate.ts` byte-for-byte semantics.

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

It is a folder of static files. `npm run build` → serve `dist/` anywhere with an SPA fallback; the repo
ships ready-made config for **Vercel** (`vercel.json`), **Netlify/Cloudflare Pages** (`public/_headers`,
`public/_redirects` — keep the redirect tables in all three places in sync; a routes test covers the
in-app half), and `npm run preview` serves the exact production output locally. `public/assets/**`
directories are intentionally empty: media is optional garnish on a procedurally-synthesised, text-first
corpus (drop files in, set `src` on an `AudioArtifact`, and see the media-hosting notes referenced by
`docs/ARCHITECTURE.md`). Build-time flags: `VITE_FEATURE_BOOT_SEQUENCE`, `VITE_FEATURE_PERSIST_PROGRESS`,
`VITE_FEATURE_ASSISTED_BYPASS`, `VITE_FEATURE_UI_SOUNDS` (all default on). `GPC_SOURCE_TAGS=1` opts into a
gitignored, machine-local Vite plugin that tags JSX with `file:line` for element pickers; production builds
never require it.

## Documentation map

| Document                | Covers                                                         |
| ----------------------- | -------------------------------------------------------------- |
| `docs/ARCHITECTURE.md`  | repo map, layering rules, runtime flow, state, search, build   |
| `docs/CONTENT_MODEL.md` | types, collections, normaliser, redaction syntax, authoring    |
| `docs/PUZZLE_SYSTEM.md` | puzzle model, validation, hints/assisted, rewards, persistence |
| `docs/DESIGN_SYSTEM.md` | tokens, components, a11y, responsive behaviour                 |

Two files referenced inside those docs — `DEPLOYMENT.md` and `CONTENT_STYLE_GUIDE.md` — are not yet
committed. The README documents what _is_ true; the gap is tracked below rather than papered over.

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
- The two missing docs named above, and media assets generally.

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
