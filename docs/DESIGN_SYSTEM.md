# Design system

The look is a **dense, recovered corporate archive**: near-black terminal wells, cyan carrier signal,
tight monospace metadata, classification stamps, and the Order's fuchsia creeping in as the investigation
deepens. It is deliberately _not_ a SaaS dashboard. Keep information dense, keep chrome utilitarian, and
let the fiction carry the drama.

Stack: Tailwind CSS v4 (CSS-first config). Tokens are defined with `@theme` in `src/styles/tokens.css`, so
every token is available both as a utility (`bg-panel`, `text-caption`, `border-line-strong`) and as a CSS
variable (`var(--color-panel)`).

## The Order is paperwork, not a costume

The Ordo Vocis Profundae is a filing system with a liturgy attached, and it is drawn that way. Anything
that reads as set dressing is a bug. Concretely:

- **No sigils, seals, eyes, triangles, alchemical rows, or spinning watermarks.** Order material is
  distinguished by type (Archivo), by file codes, by numerals and by hairlines. The only figures that
  survive are diagrams the fiction needs: the seven-point week plate, the nine-point Choir code grid.
- **No Latin except where it is load-bearing.** The Order's own name (`ORDO VOCIS PROFUNDAE`), the seven
  Seal-Words (they spell the name), and the degree names. Everything else is English: `SEAL I · SATURN ·
LEAD · SATURDAY`, not `SIGILLUM I · Kamea Saturni`.
- **No glow, no pulse, no spin, no flicker, no vignette on Order surfaces.** Motion is limited to a
  plain fade (`ovp-revelation`), a stroke drawing itself in (`ovp-draw`), a code fragment brightening
  under the cursor (`ovp-fragment`), and a shake on a wrong answer (`ovp-shake`).
- **The Order's colour is a dusty plum, not hot magenta.** See "The Order's colour is muted on purpose".

The test to apply: if a detail would look at home on a metal album cover, cut it.

## Files

| File                 | Contents                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `styles/tokens.css`  | colours, fonts, type scale, shadows, layout sizes (`@theme`)                             |
| `styles/base.css`    | document defaults, global focus ring, reduced-motion override                            |
| `styles/archive.css` | utilities: `field`, `meta-label`, `scrollbar-thin`, `scrollbar-none`; CRT overlay; print |
| `styles/mobile.css`  | touch targets, safe areas, mobile type scale, iOS zoom fix, drawer motion                |
| `styles/boot.css`    | cold-boot animations                                                                     |
| `styles/order.css`   | Order / seal animations (`ovp-*`, `gate-*`, `puzzle-*`), `font-order`, `font-symbol`     |
| `styles/index.css`   | imports Tailwind + all of the above                                                      |

## Tokens

### Surfaces (dark → light)

| Token    | Hex       | Use                                     |
| -------- | --------- | --------------------------------------- |
| `void`   | `#04060a` | terminal wells, canvases, boot backdrop |
| `crt`    | `#01020a` | cold-boot CRT backdrop                  |
| `canvas` | `#06080e` | page background, inputs                 |
| `inset`  | `#070b13` | recessed wells inside panels            |
| `shell`  | `#090d14` | header + sidebar chrome                 |
| `panel`  | `#0a0e18` | default panel / card                    |
| `raised` | `#0d131f` | toolbars, headers, pills                |
| `hover`  | `#0e1524` | hovered rows / panels                   |
| `active` | `#182338` | pressed / selected                      |

### Lines

`line-subtle #151f30` (dividers in panels) · `line #182335` (panel border) · `line-strong #1b263b` (outer
border, table heads) · `line-bright #22304d` (buttons, modal frames).

### Signal and accents

| Token      | Hex                                                                                                                                             | Meaning                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `signal`   | `#00f0ff`                                                                                                                                       | the 14.8 Hz carrier; primary interactive          |
| `phosphor` | `#39ff14`                                                                                                                                       | status OK glow                                    |
| `alert`    | `#ff0055`                                                                                                                                       | breach / de-scrambler active                      |
| `order`    | `#b3a7c2`                                                                                                                                       | the Ordo Vocis Profundae — case file, Order marks |
| `seal-*`   | saturn `#94a3b8` · jupiter `#60a5fa` · mars `#f87171` · sun `#fbbf24` · venus `#34d399` · mercury `#c084fc` · moon `#e2e8f0` · sealed `#334155` |

Tailwind's palette (cyan, amber, rose, emerald, purple, fuchsia) is used for semantic tone. `slate-500` and
`slate-600` are **overridden** (`#8190a5`, `#738299`) so that small metadata text meets WCAG AA
contrast on `panel`/`canvas`.

### Typography

| Token / class          | Size     | Use                                      |
| ---------------------- | -------- | ---------------------------------------- |
| `text-nano`            | 8px      | decorative HUD only, never content       |
| `text-micro`           | 9px      | badges, stamps, metadata labels          |
| `text-caption`         | 10px     | metadata values, table meta, helper text |
| `text-label`           | 11px     | body copy inside panels                  |
| `text-xs` → `text-2xl` | Tailwind | headings, modal titles                   |

- `font-mono` is the house face (system monospace stack).
- `font-order` is Archivo (self-hosted), the Order's institutional display face: Order headings, seal
  titles, Seal-Words, and the Order's plate mark. Set upright with modest tracking; never italic by
  default. It is a grotesque, not a display serif, deliberately: the Order reads as an institution
  that files things, not as a cult with a logo.
- `font-symbol` is Noto Sans Symbols 1/2 for planetary glyphs, which are used as data labels (a
  planet next to a clearance level), never as decoration. Append `\uFE0E` to force text
  presentation, not emoji.

### Other

Shadows: `shadow-glow-sm`, `shadow-glow`, `shadow-glow-lg`, `shadow-modal`, `shadow-bar`. Colour a glow
with `shadow-<colour>/<alpha>`. Layout: `--spacing-header` (3.5rem), `--spacing-sidebar` (18rem).

**No arbitrary hex values in components.** If a colour recurs, make it a token. The exception is SVG
`stroke`/`fill` props on Order diagrams, which take `var(--color-seal-*)`, a fuchsia step, or a hex
from the seal table.

### The Order's colour is muted on purpose

`fuchsia` is the Ordo Vocis Profundae's ramp and appears ~100 times as `text-fuchsia-*`,
`border-fuchsia-*`, `bg-fuchsia-950/40`. The stock Tailwind fuchsia is hot magenta. `tokens.css`
overrides the whole scale with a dusty plum, the colour of a rubber stamp on a 1971 file card, so
the Order reads as paperwork rather than as neon. Overriding the scale (rather than rewriting the
classes) means every existing component keeps working and the whole ramp can be reverted in one
block if the mood ever needs to change.

## Components (`src/components/ui`)

| Component                              | Purpose                                                                                                                                                                                                                                                        |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ArchivePage`                          | page wrapper: padding, max width, vertical rhythm                                                                                                                                                                                                              |
| `ViewHeader`                           | page `<h1>`, kicker, description, actions                                                                                                                                                                                                                      |
| `Panel`, `SectionLabel`                | bordered panel; uppercase section heading                                                                                                                                                                                                                      |
| `Modal`                                | accessible dialog. Props: `tone` (signal, warning, success, danger, neutral, purple, order), `size` (sm → 5xl, full), `variant` (`card`, `window`), `position`, `headerActions`, `footer`, `description`, `initialFocusRef`, `hideTitleBar`, `closeOnBackdrop` |
| `Badge`                                | tone pill (`neutral, info, signal, indigo, success, danger, warning, purple`)                                                                                                                                                                                  |
| `ClassificationStamp`, `DocumentStamp` | clearance / classification stamps                                                                                                                                                                                                                              |
| `StatusLight`                          | status dot (`ok, signal, warn, alert, off, purple`) with a text label                                                                                                                                                                                          |
| `MetaField`, `MetaGrid`                | `LABEL: value` metadata pairs                                                                                                                                                                                                                                  |
| `FileIcon`                             | icon per record format                                                                                                                                                                                                                                         |
| `TreeRow`                              | directory-tree row (depth, expand state, selection)                                                                                                                                                                                                            |
| `SelectCard`                           | selectable list card (button semantics, `aria-pressed`/`aria-current`)                                                                                                                                                                                         |
| `SystemNotice`                         | empty / loading / missing / denied / error states in the GPC voice (`IDX-000`, `SPOOL`, `ERR-404`, `ERR-403`, `ERR-500`)                                                                                                                                       |
| `FictionNotice`                        | out-of-story notice                                                                                                                                                                                                                                            |
| `Button`                               | variants + sizes; defaults to `type="button"`                                                                                                                                                                                                                  |
| `ErrorBoundary`                        | per-page crash containment with an in-world recovery message                                                                                                                                                                                                   |
| `order-marks.tsx`                      | `OrderPlate`, `PlanetGlyph`, `SealDisc`, `ChoirGlyph`                                                                                                                                                                                                          |

Archive-specific building blocks live in `components/archive` (`RedactedText`, `SealMark`, the document
viewer and search). Audio controls are in `components/audio/audio-player-bar.tsx`.

### Utilities

- `field`: text input / select / textarea styling with a cyan focus ring.
- `meta-label`: uppercase caption label (`DOCUMENT ID:`).
- `scrollbar-thin` / `scrollbar-none`.
- `print-visible`: the document viewer's printable article.
- `cn()` is a plain class joiner, **not** tailwind-merge, so a `className` cannot override a
  conflicting base class. Use Tailwind v4's important suffix (`bg-black!`) when you really must.

## Accessibility

- **Landmarks and skip link.** A skip link targets `<main id="main-content">`, with header, nav
  (sidebar) and main landmarks. Every page has exactly one `<h1>` (via `ViewHeader`).
- **Focus.** There is a global 2px `signal` outline on `:focus-visible`, and inputs use `field`. Never
  remove outlines without a replacement.
- **Modals.** `Modal` is `role="dialog"` + `aria-modal`, labelled by its title and described by
  `description`. It traps Tab, closes on Escape, restores focus to the trigger and locks background
  scroll. Initial focus goes to `[data-autofocus]` or the first focusable element.
- **Keyboard.** Everything clickable is a `<button>` or link. Global shortcuts are ignored while typing.
  Puzzle widgets (magic square, heptagram, dials, keypads) all work from the keyboard.
- **Forms.** Every input has a `<label>` or `aria-label`. Errors use `role="alert"` or an `aria-live`
  region and are linked with `aria-describedby`.
- **Icons.** lucide-react (0.577) adds `aria-hidden="true"` automatically to icons that have no
  `aria-label`/`title`. Give an icon an `aria-label` (and `role="img"`) only when it carries meaning on
  its own.
- **Colour.** State is never shown by colour alone. Status lights, stamps and seal marks all have text
  (`L3`, `SEALED`, `✓ earned`).
- **Motion.** `prefers-reduced-motion` collapses all animations and transitions (`base.css`), and
  `useReducedMotion()` skips timed sequences. No information is conveyed by motion alone.
- **Audio.** Nothing autoplays. Every artifact has a transcript and a plain-language description, and
  sound can be muted globally.
- **Redactions.** `RedactedText` renders bars with an accessible label ("redacted") and never puts hidden
  words in the DOM.

## Responsive behaviour

The archive is one layout, progressively relaxed for small screens and coarse pointers — there is no
separate mobile build. Desktop rendering (≥ `md`, fine pointer) is unchanged by anything in
`styles/mobile.css`.

### Breakpoints

| Name | Width   | What changes                                                      |
| ---- | ------- | ----------------------------------------------------------------- |
| `xs` | ≥ 26rem | large phones regain a label or two next to icons                  |
| `sm` | ≥ 40rem | secondary header controls return inline; analyser labels reappear |
| `md` | ≥ 48rem | sidebar becomes permanent; tables show secondary columns          |
| `lg` | ≥ 64rem | three-column master/detail pages                                  |

### Layout

- ≥ `md`: the sidebar is always shown (16rem, 18rem at `lg`) beside the content.
- Below `md`: the sidebar is an off-canvas drawer (hamburger in the header) with a dimmed backdrop. It
  slides in (`.drawer-enter`), moves focus inside, closes on Escape, on backdrop tap and on navigation.
- Tables hide secondary columns (`hidden sm:table-cell`, `hidden md:table-cell`). The document vault
  **defaults to its card view on phones** (`useIsMobile`) — both views stay switchable at every size.
- Modals are bottom-anchored sheets below `sm` (`items-end`), sized with `dvh` so the iOS URL bar cannot
  clip them, and padded `p-4 sm:p-6`. Footers wrap rather than overflow.

### Touch

- `tap-target` grows a control's _hit area_ to 44×44px on coarse pointers via a transparent
  pseudo-element — nothing reflows, so the terminal's visual density survives. Use it on icon buttons.
- `tap-row` gives full-width rows (nav links, list items, menu items) a 44px minimum height on coarse
  pointers only.
- Every control gets `touch-action: manipulation` (no 300ms double-tap delay) and no grey tap flash.

### Reachability

Nothing may be keyboard-only or hover-only. Phones have neither.

- The `/`, `` ` `` and `U` shortcuts all have visible buttons.
- Controls the narrow header drops (terminal, whistleblower safe, CRT, sound, archive guide) live in
  `HeaderOverflowMenu` (the `⋮` button, `sm:hidden`), and are mirrored in the Archive Guide's
  _Operator console_.
- Text inputs that are submitted with Enter (terminal, boot callsign) carry `enterKeyHint` **and** a
  visible commit button below `sm`; the terminal also exposes its ArrowUp history as a button.

### Type & viewport

- Below `md`, `--text-nano/micro/caption/label/xs` are re-declared one step larger. Every generated
  utility is a `var()` reference, so the whole archive rescales at once.
- Fields render at ≥16px on coarse pointers, otherwise iOS Safari zooms the page on focus. This rule is
  **unlayered** so it outranks the `field` utility.
- `viewport-fit=cover` plus `safe-x` / `safe-b` keep the fixed chrome clear of notch and home indicator.
- Pinch-zoom is never disabled.

## Voice in UI states

Empty, loading, missing and denied states are written in character. Use `SystemNotice` rather than a bare
"No results". See [CONTENT_STYLE_GUIDE.md](CONTENT_STYLE_GUIDE.md).
