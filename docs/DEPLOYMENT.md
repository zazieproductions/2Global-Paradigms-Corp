# Deployment

The output is a folder of static files. There is no server, no database, no API and no build-time
secret. This document covers where it goes, what the edge must do for it, and the handful of build-time
switches that exist.

```sh
npm ci
npm run build      # tsc -b, then vite build → dist/
npm run preview    # serve dist/ locally on 0.0.0.0:4173
```

`dist/` at the time of writing: **66 files, 2.4 MB on disk**. Everything the story knows is inside it.

## 1. Host requirements

Any static host will do, provided it does four things:

| Requirement                             | Why                                                                     | If the host cannot                          |
| --------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------- |
| SPA fallback to `/index.html`           | 19 client routes; deep links like `/documents?doc=doc-007` must resolve | Only `/` works; every other URL 404s        |
| Serve `/static/*` immutable, long-lived | Hashed bundles; the corpus chunk is one large cacheable object          | Cold loads re-download ~127 kB of story     |
| Send the security headers in §3         | The CSP is part of the privacy story, not decoration                    | The site still works; the guarantee weakens |
| Preserve the six legacy redirects       | Six URLs are already 301'd at the edge                                  | Bookmarks and inbound links break silently  |

The app makes **no** runtime network requests: `grep -rE "fetch\(|XMLHttpRequest|sendBeacon" src/`
returns nothing, and `connect-src 'self'` makes it impossible to add one without a header change.

## 2. Ready-made configs

Three places define the same two tables. They are commented as a set and must be edited together.

| File                                            | Host                      | Contains                                         |
| ----------------------------------------------- | ------------------------- | ------------------------------------------------ |
| `vercel.json`                                   | Vercel                    | build command, 6 redirects, SPA rewrite, headers |
| `public/_redirects`                             | Netlify, Cloudflare Pages | 6 redirects + SPA fallback                       |
| `public/_headers`                               | Netlify, Cloudflare Pages | the same headers                                 |
| `src/config/navigation.ts` → `LEGACY_REDIRECTS` | in-app                    | the same 6 redirects, for when the edge misses   |

```
/dashboard      → /
/index.html     → /
/dead-links     → /deadlinks
/stations-map   → /stations
/projects       → /programs
/offices        → /stations
```

All six are `301`/`permanent`, query strings preserved. `routes.test.tsx` pins the in-app half, including
that `?doc=` and `?record=` survive the redirect. There is no test for the edge halves — **if you add a
redirect, add it to all four places in the same commit.**

The Vercel rewrite excludes hashed bundles and media from the SPA fallback:

```
/((?!static/|assets/|favicon\.svg).*)  →  /index.html
```

Note the split: `/static/*` is build output (immutable, one year), `/assets/*` is `public/assets/**`
media (one day). Keeping them separate is what allows media to be replaced without invalidating the
bundles.

## 3. Headers

Identical in `vercel.json` and `public/_headers`, by design and by comment.

```
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
Content-Security-Policy:
  default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:;
  connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'
```

What each line buys:

- `Permissions-Policy` denies camera, microphone and geolocation. No mechanic uses them, and now none
  can. `interest-cohort=()` opts out of FLoC.
- `connect-src 'self'` means the bundle cannot phone home even if someone adds a `fetch`.
- `object-src 'none'` and `base-uri 'self'` close the two classic injection vectors.
- `style-src` needs `'unsafe-inline'` because Tailwind and React set inline styles. There is no
  third-party style source, so the exposure is limited to self-authored CSS.
- There is no `frame-ancestors`. If the archive is ever embedded, add it explicitly rather than relying
  on a default.

There is deliberately **no** `Content-Security-Policy-Report-Only` endpoint and no reporting URI:
reports would be a network request, and the project makes none.

## 4. Caching

| Path            | Policy                                | Contents                                 |
| --------------- | ------------------------------------- | ---------------------------------------- |
| `/static/*`     | `public, max-age=31536000, immutable` | Hashed JS, CSS and self-hosted fonts     |
| `/assets/*`     | `public, max-age=86400`               | Anything dropped into `public/assets/**` |
| everything else | host default                          | `index.html`, `favicon.svg`              |

`index.html` must **not** be cached long-lived — it is the only file whose contents change identity per
build, because it names the hashed bundles. Most static hosts do the right thing by default; check
before enabling an aggressive HTML cache.

## 5. Build output

`vite.config.ts` splits vendors manually and pins `assetsDir: 'static'`:

| Chunk     | Role                                            |              Raw |        Gzip |
| --------- | ----------------------------------------------- | ---------------: | ----------: |
| `content` | the entire corpus                               |         377.7 kB |    127.1 kB |
| `react`   | react-dom + router                              |         315.7 kB |    100.7 kB |
| `index`   | app code                                        |         237.8 kB |     70.9 kB |
| CSS       | tokens + archive + boot + occult                |         132.5 kB |     27.0 kB |
| `icons`   | lucide subset                                   |          20.5 kB |      6.8 kB |
| 24 more   | 19 lazy page chunks + 5 split shared components | 0.2–37.6 kB each | 0.2–11.7 kB |

`react`, `content` and `icons` are `modulepreload`ed from `index.html`, so the first visit transfers
roughly **333 kB gzipped of JS + CSS including the whole story**. These figures are read from
`npm run build` output and will move; treat the table as a shape, not a constant, and re-measure before
quoting it.

`chunkSizeWarningLimit: 700` is set with the reason in a comment rather than silencing the warning: the
corpus is intentionally one large cacheable object, because 412 records that always ship together are
cheaper as one immutable file than as a hundred requests.

## 6. Environment variables

Build-time only, all optional, all defaulting to on. `envPrefix: ['VITE_']` means nothing else reaches
client code — and there are no secrets to leak, because there is no server.

| Variable                        | Default | Effect                                           |
| ------------------------------- | ------- | ------------------------------------------------ |
| `VITE_FEATURE_BOOT_SEQUENCE`    | `true`  | Play the cold-boot terminal on load              |
| `VITE_FEATURE_PERSIST_PROGRESS` | `true`  | Write progression to `localStorage`              |
| `VITE_FEATURE_ASSISTED_BYPASS`  | `true`  | Offer the no-shame assisted route                |
| `VITE_FEATURE_UI_SOUNDS`        | `true`  | Default UI click sounds on (still gesture-gated) |

```sh
VITE_FEATURE_BOOT_SEQUENCE=false npm run build   # skip the boot for a demo or a screenshot
```

There is no `.env` file and none is needed. `.gitignore` excludes `.env*` except `.env.example`, which
does not exist because there is nothing to exemplify.

### Optional local tooling

`GPC_SOURCE_TAGS=1` opts into `.vite-source-tags.js`, a gitignored, machine-local Vite plugin that tags
JSX with `file:line` for element pickers:

```sh
GPC_SOURCE_TAGS=1 npm run dev
```

If the file is absent, Vite logs a warning and continues. **A production build must never require it.**
Note that the plugin file's own header comment predates the opt-in gate and claims it is "active in both
dev and build"; `vite.config.ts` is authoritative and loads it only under `GPC_SOURCE_TAGS=1`.

## 7. Media hosting

`public/assets/{audio,documents,downloads,images,textures}/` exist and are empty except for `.gitkeep`.
That is intentional: audio is synthesised from typed `synthesisPreset` data and the corpus is text.

To add a real file:

1. Drop it in the right directory. It will be served from `/assets/<dir>/<file>`.
2. Set `src` on the `AudioArtifact` (or the equivalent field).
3. **Keep the transcript.** `INV-REC-02` requires `transcript` and `audioDescription` on every artifact,
   with or without a file. The text-first fallback is the contract, not a courtesy.
4. Nothing may autoplay. The `AudioContext` is created lazily on the first user gesture.
5. Remember `/assets/*` is cached for one day, so a same-name replacement will not appear immediately for
   returning visitors.

Downloads (`OriginProtocol_Gateway_Transmission.json`, `Palimpsest_Whistleblower_Master_Dump.json`) are
generated in-browser from typed data and offered as blobs — they are not files in `public/` and do not
need hosting.

## 8. Verification before shipping

```sh
npm run check
# = typecheck → lint → test → archive:report:check → build
```

Then, against the real output:

```sh
npm run preview
curl -sI http://localhost:4173/            | grep -i 'content-security-policy'
curl -sI http://localhost:4173/documents   | head -1     # must be 200, not 404
grep -c 'modulepreload' dist/index.html                  # 3
```

`npm run preview` binds `0.0.0.0`, so it works inside containers and cloud previews.

## 9. Rollback

There is no migration, no schema and no server state, so rollback is redeploying the previous commit.
The only persistent state anywhere is a player's own `localStorage`, which is versioned
(`gpc.progression.v1`), validated on load, and silently discarded if it cannot be parsed. A rollback
cannot strand a player: a save from a newer build is dropped, not crashed on.

Related: [ARCHITECTURE.md](ARCHITECTURE.md) · [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) ·
[PUZZLE_SYSTEM.md](PUZZLE_SYSTEM.md) §"Persistence and migration"
