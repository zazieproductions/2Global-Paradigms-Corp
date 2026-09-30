# Puzzle system

The archive has two puzzle tracks built on one engine:

- **THE SEVEN SEALS** (`/sanctum`) is the main investigation. Seven puzzles open in order, and breaking
  them earns clearance, the redaction de-scrambler and the finale.
- **Gateway Transmission** (header ▸ TRANSMISSION) is a four-step guided beginner trail. It deliberately
  grants no clearance.

Logic is kept separate from presentation:

| Concern                                           | Where                                                                      |
| ------------------------------------------------- | -------------------------------------------------------------------------- |
| Puzzle definitions (data)                         | `src/content/puzzles/definitions.ts` (built from `seals.ts`, `gateway.ts`) |
| Seal lore, clue pointers, hints                   | `src/content/puzzles/seals.ts`                                             |
| Terminal text, downloads                          | `src/content/puzzles/terminal-text.ts`, `downloads.ts`                     |
| Answer validation (pure)                          | `src/lib/puzzles/validate.ts`                                              |
| Progression store (pure reducer + persistence)    | `src/lib/puzzles/progression.ts`                                           |
| Derived selectors (earned clearance, seal order…) | `src/lib/puzzles/investigation.ts`                                         |
| Ciphers / script helpers                          | `src/lib/puzzles/cipher.ts`, `choir-script.ts`                             |
| React access                                      | `src/hooks/use-progression.ts`, `src/hooks/use-investigation.ts`           |
| Widgets                                           | `src/components/puzzles/**`, `src/pages/sanctum-page.tsx`                  |

Components never compare answers themselves. They call the hooks and render the result.

## The puzzle model

```ts
interface PuzzleDefinition {
  id: string; // 'seal-3', 'gateway-signal'
  title: string;
  narrative: string; // in-world framing near the input
  surface: PuzzleSurface; // which UI hosts it: 'sanctum' | 'terminal' | 'palimpsest-safe' | …
  clues: Clue[]; // where the answer can be found (record, route or UI label)
  validation: AnswerValidation; // { method: 'sha256', normalize, digests }
  hints: Hint[]; // ascending tiers 1..3; only the last may reveal the answer
  success: { heading; body };
  bypass?: { label; description }; // optional no-shame assisted route
  rewards: PuzzleReward[]; // clearance | unredact | route | download | record
  requires?: UnlockCondition[]; // always | puzzle-completed | record-discovered
  journal?: string; // case-journal line written on first completion
}
```

The required pieces from the brief map as follows: **id, title, narrative context** (`narrative`), **clue
locations** (`clues`), **validation method** (`validation`), **progressive hints** (`hints`), **success
state** (`success` + `journal`), **assisted/bypass route** (the answer-revealing tier-3 hint, plus optional
`bypass`), and **unlocked content** (`rewards`).

### Validation

`validatePuzzleAnswer(id, input, state)` returns one of:

- `{ ok: true }`
- `{ ok: false, reason: 'incorrect' | 'empty' | 'unknown-puzzle' | 'unavailable' }`

1. The input is normalised by the definition's `normalize` steps (`trim`, `lowercase`, `collapse-spaces`,
   `strip-spaces`, `alnum-upper`). Seals use `alnum-upper`: uppercase, keeping only `A–Z 0–9 . |`.
   Multi-part answers are joined with `|`, e.g. the tone lock's three dials.
2. The result is SHA-256 hashed (`lib/utils/sha256.ts`, synchronous) and compared with `digests`.
3. `unavailable` means a `requires` condition isn't met. `checkAnswer()` ignores requirements so the
   fiction can react to a correct-but-premature answer ("NOT YET. VENUS FIRST.").

To add or change an answer:

```sh
npm run puzzle:digest -- -n alnum-upper "Your Answer"
# → prints the 64-char hex digest to paste into `digests`
```

### Hints and assisted completion

- Hints open one tier at a time (`revealHint`) and never go backwards. The highest opened tier is stored
  in `hintsRevealed[puzzleId]`.
- Every seal has three tiers: `ASK NAYLOR` → `ASK AGAIN` → `TELL ME`. Tier 3 has `revealsAnswer: true`.
  It is the **assisted route**: it gives the answer outright, with no penalty beyond the label.
- A completion is **assisted** if it used `method: 'bypass'` or an answer-revealing hint was opened
  first. Assisted completions still grant every reward; the case file just marks them "ASSISTED".
- Replaying an assisted puzzle unassisted upgrades the record. A later assisted replay never downgrades an
  unassisted one.

### Rewards and unlocks

| Reward      | Effect                                                                        |
| ----------- | ----------------------------------------------------------------------------- |
| `clearance` | raises **earned clearance** (derived from completions; never stored directly) |
| `unredact`  | turns the de-scrambler on (it only has effect once earned)                    |
| `download`  | adds to `unlockedDownloads` (e.g. `palimpsest-master-dump`)                   |
| `route`     | adds to `unlockedRoutes` (`isRouteUnlocked(path)`)                            |
| `record`    | marks a record as discovered                                                  |

**Clearance is earned, not chosen.** `earnedLevel(state)` is the highest `clearance` reward among
completed puzzles (minimum 1). The operator may browse _below_ it (Clearance profiler, terminal
`clearance <n>`), never above. A new seal overrides a stale lower choice (`AccessState.chosenAt`). The
de-scrambler unlocks at Level 3 (`DESCRAMBLER_RANK`), and pressing `u` below that only shows a notice.

Records above the effective clearance open as a sealed notice instead of their body, and their exports
are refused.

## THE SEVEN SEALS

Seals open strictly in order: `seal-N` requires `seal-(N-1)`. The reducer enforces this too, so a stray
dispatch cannot skip ahead. Each seal yields a **Seal-Word**; together they point to the finale.

| Seal | Title / widget                                | Reward                                |
| ---- | --------------------------------------------- | ------------------------------------- |
| I    | Saturn — magic square                         | Level 2                               |
| II   | Jupiter — heptagram / Wheel of Days           | Level 3 + de-scrambler                |
| III  | Mars — Choir Script cipher                    | full Choir Script alphabet            |
| IV   | Sun — the three-voice tone lock               | Level 4                               |
| V    | Venus — hymn acrostic                         | —                                     |
| VI   | Mercury — Vigenère wheel; opens Naylor's safe | Level 5, de-scrambler on, master dump |
| VII  | Moon — the Name (terminal `invoke <name>`)    | the finale (carrier 0.000 Hz)         |

Answers are intentionally **not** listed here. Maintainers can find them in
`src/tests/seal-fixtures.ts` (test-only; never imported by the app).

**Choir Script fragments.** Glyph pairs are hidden faintly on seven public pages (newsletters, careers,
timeline, values, products, reports, dead links). Collecting one teaches its letters; breaking Seal III
teaches all of them. Order documents carry Choir marginalia that is readable only for known letters.

**Accessibility.** Every seal can be solved by reading. The tone lock takes typed numbers (sounds are
optional), every widget is keyboard-operable with labelled inputs, and nothing depends on colour, hover
or motion alone. Animations respect `prefers-reduced-motion`.

## Gateway Transmission

`gateway-sequence` → `gateway-signal` → `gateway-waveform` → `gateway-transmission`. Each step requires
the previous one. The last step re-asks all three keys joined with `|`. Field notes accompany every step,
and the final screen offers `OriginProtocol_Gateway_Transmission.json` as a download. It has no clearance reward: only
the seals raise clearance.

## Progression service

`progressionStore` (singleton) is a framework-agnostic store around a pure `progressionReducer`.

| Tracks                      | Field                                                              |
| --------------------------- | ------------------------------------------------------------------ |
| discovered files            | `discovered[recordId] = ISO time`                                  |
| completed puzzles           | `completed[puzzleId] = { at, method, assisted }`                   |
| assisted completions        | `completed[…].assisted`, `assistedCount`                           |
| hints                       | `hintsRevealed[puzzleId]`                                          |
| unlocked routes / downloads | `unlockedRoutes`, `unlockedDownloads`                              |
| access                      | `access.{clearance, chosenAt, unredacted}`                         |
| investigation               | `investigation.{fragments, prologueSeen, finaleComplete, journal}` |
| preferences, callsign       | `preferences.{crt, sound}`, `callsign`                             |

React hooks:

- `useProgression()`: state, derived values (`earnedLevel`, `clearance`, `descramblerUnlocked`,
  `unredacted`, counts) and actions (`discover`, `complete`, `bypass`, `revealHint`, `setClearance`,
  `setUnredacted`, `collectFragment`, `purgeCase`, `reset`, …).
- `useInvestigation()`: Seven Seals view (`solved`, `currentSeal`, `knownLetters`, `attemptSeal`,
  `isCorrect`, `revealHint`, `notify`, …).
- `useDescrambler()`: `{ unredacted, unlocked, toggle }`.

### Reset and replay

- **Purge case** (`purge-case`, from the case file) closes the seals again: puzzles, hints, fragments and
  clearance. It keeps discoveries, callsign and preferences and skips the prologue.
- **Reset / replay** (`reset`, from the Archive Guide) wipes everything, optionally keeping preferences.

### Persistence and migration

- `localStorage["gpc.progression.v1"]` holds a v1 or v2 save, which is upgraded in place on load.
- On first load with no current save, a case file from the pre-restructure build
  (`ovp.investigation.v1`) is migrated once. It is read-only and never written.
- All stored data is **validated on load**: unknown puzzles, fragments, levels and malformed entries are
  dropped, and a stored clearance above what the completions earn is ignored.
- Storage is best-effort. In private mode, when the quota is exceeded, or with storage disabled, play
  falls back to memory silently. `VITE_FEATURE_PERSIST_PROGRESS=false` disables persistence.

## Limitations (client-only stack)

This is a static site. Everything the game knows ships to the browser, so:

- **Digests are a spoiler deterrent, not security.** Answers aren't greppable in plain text, but
  short answers can be brute-forced, and anyone can edit their own `localStorage`. That is acceptable for
  a single-player story.
- **Some answers are present in the bundle by design.** Tier-3 hints, success bodies and journal lines in
  `definitions.ts` / `seals.ts` contain answers. The assisted route needs them, the in-world "answer peek"
  reads the tier-3 hint, and the terminal's gematria notes hint at the final Name.
- **Client-side ciphers.** The Mercury wheel decrypts in the browser; its ciphertext and key logic are
  inspectable.
- **Revoked codes.** Old v1 executive codes (`REVOKED_CODES` in `config/puzzles.ts`) are recognised only
  so the fiction can reject them. They grant nothing.
- **Server validation** (`validation.method: 'server'`) is modelled in the types for a future serverless
  endpoint, but is not implemented. A static build reports those puzzles as `unavailable`.
- **Progress is per-browser.** Clearing site data or switching devices starts over. There are no accounts
  and no tracking.

No mechanic touches the real world. Puzzles never ask for personal data, never make network requests,
never use the camera, microphone or location, never autoplay audio, and never pretend to be anything but
fiction.

## Adding a puzzle

1. **Content.** Add a `PuzzleDefinition` to `definitions.ts` (or a new seal-like entry in its own content
   file that `definitions.ts` maps). Give it:
   - a unique `id`, a `narrative`, and `clues` pointing at records (`{ type: 'record', ref }`) or routes
   - `validation` with digests from `npm run puzzle:digest`
   - 1–3 ascending `hints`; only the last may use `revealsAnswer`
   - `success`, `rewards`, `requires` and a `journal` line
2. **Clues.** Make sure every clue exists in readable text: a document, transcript or page. Never rely on
   audio, colour, hover or motion alone.
3. **Widget.** Build the input in `src/components/puzzles/…`. Use `useInvestigation()` /
   `useProgression()` to attempt, reveal hints and read completion state. Label every input, support the
   keyboard, and announce results in an `aria-live` region.
4. **Host.** Mount it on its surface (sanctum card, terminal command, modal) and wire any dialog through
   `ArchiveUiContext`.
5. **Tests.** Add the plaintext answer to a test fixture (never to app code) and cover:
   validation, requirements, rewards, hint → assisted, and the UI path.
6. Run `npm run check`. The content validator also verifies digests, hint tiers and clue targets.
