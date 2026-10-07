# Revelation

How narrative knowledge is withheld, released and recontextualised — treated as a system with states,
gates and transitions, not as a set of ad-hoc decisions. The generated numbers are in
[generated/KNOWLEDGE_MATRIX.md](generated/KNOWLEDGE_MATRIX.md); this is the model behind them.

## 1. Three audiences

Everything in this repository is written for one of three readers, and confusing them is the most common
source of spoilers and of flat prose.

| Audience                          | What they know                                  | What they may be told                                                   |
| --------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------- |
| **The player**                    | Whatever they have unlocked in this browser     | Only what a gate has released. Never more, not even in UI chrome.       |
| **The in-world reader**           | Whatever the record's clearance and date permit | What that department, at that date, at that tier, would have been told. |
| **The author** (you, or an agent) | Everything — this document included             | Anything, but only in `docs/`, `editorialNote`, or test fixtures.       |

The two failure modes:

- **Author knowledge leaking into a low-clearance record.** A Level 1 press release that says "the
  carrier" has been written by someone who read the Level 5 file. Fix: write the press release as if the
  Order does not exist, because the person who wrote it believes that.
- **Player knowledge assumed too early.** A clue that says "as you learned at Postojna" inside a puzzle
  that opens before Seal V. Fix: the clue must be readable by someone who has only broken the seals that
  precede it — see §4.

## 2. The five knowledge states

A piece of information is in exactly one of these states for a given player.

| State                       | Meaning                                                                | Mechanism                                                            |
| --------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Absent**                  | Not in the bundle the player can reach — because it does not exist yet | Not used: everything ships. See §6.                                  |
| **Present but unreadable**  | Rendered as a bar, a sigil, or a sealed notice                         | `RedactedText`, Choir Script marginalia, sealed-record screen        |
| **Present and misreadable** | Readable, and wrong on purpose                                         | Public copy: press releases, values, annual reports                  |
| **Released**                | Gated content now shown                                                | Clearance tier, De-Scrambler, fragment collection, puzzle completion |
| **Recontextualised**        | Already read, now meaning something else                               | Seal revelations, terminal `gematria` notes                          |

**Recontextualisation is the strongest tool in the kit and the cheapest to misuse.** It costs nothing to
write and it is the only state that rewards a player for what they already did. The archive's best
example is Seal V: the sidebar has read `DATABASE: GPC_POSTOJNA_MASTER` since the first session
(`src/components/layout/sidebar.tsx`), and the revelation is simply that this was never a backup site.

Rules for recontextualisation:

1. The earlier text must be **literally true** and **harmless out of context**. Never plant a line that
   reads as a spoiler to a first-time reader.
2. The reveal must quote or point at the earlier text, not merely allude to it.
3. One recontextualisation per seal, maximum. More than that and nothing lands.

## 3. The five gates

| Gate                        | Opens at                                           | What it releases                                                         | Implemented in                                                            |
| --------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Clearance tier**          | Seals I, II, IV, VI (ranks 2, 3, 4, 5)             | 44 → 82 → 100 → 63 records become readable, cumulatively                 | `earnedLevel()`, `effectiveClearance()` in `lib/puzzles/investigation.ts` |
| **Redaction De-Scrambler**  | Seal II (rank 3)                                   | `redactedContent` on 173 of the 174 documents; the words under every bar | `DESCRAMBLER_RANK`, `isUnredacted()`, `RedactedText`                      |
| **Choir Script letters**    | 7 fragments on public pages, or all 26 at Seal III | Order marginalia renders as text instead of unknown glyphs               | `knownLetters()`, `CHOIR_ALPHABET`                                        |
| **Puzzle requirement**      | `requires: [{ type: 'puzzle-completed' }]`         | The next seal; the safe; the finale                                      | `progressionReducer`, `validatePuzzleAnswer()`                            |
| **Route / download unlock** | Reward of a specific puzzle                        | `unlockedRoutes`, `unlockedDownloads` (the Palimpsest master dump)       | `PuzzleReward` of type `route` / `download`                               |

Two properties of this design are worth preserving:

- **Clearance is earned, never chosen.** The profiler and `clearance <n>` can move the operator _down_
  the ladder, never up. A stored clearance above earned clearance is discarded on load.
- **Gates are monotonic.** Nothing the player does removes access. Purging the case
  (`purge-case`) is an explicit, player-initiated reset and is the only exception.

### Reading the matrix

[generated/KNOWLEDGE_MATRIX.md](generated/KNOWLEDGE_MATRIX.md) gives, per tier: how many records are
released, and how many are readable cumulatively. The shape of that table is a design statement:

- **123 records are readable on arrival**: 66 at Level 1 plus 57 in kinds that carry no classification
  at all (stations, departments, products, job postings, dead links, newsletters, training modules,
  restoration logs). **The public surface of the company is genuinely public.** That is what makes the
  concealed layer legible as concealment rather than as an absence of content.
- The releases then climb 44 → 82 → 100 → 63 at Levels 2, 3, 4 and 5, reaching all 412 after Seal VI.
- The largest single release is Seal IV (100 records, Level 4) — the point at which the operational
  archive, as opposed to the corporate one, opens.

## 4. Clue readability

The rule that keeps the puzzle chain honest:

> A clue for puzzle _N_ must be readable by a player who has completed puzzles _1…N−1_ and nothing else.

Concretely:

- If a clue points at a record above the clearance earned by seal _N−1_, the clue is unusable. The
  ledger shows this: cross-reference the clue's target in
  [generated/CLUE_LEDGER.md](generated/CLUE_LEDGER.md) against that record's tier in
  [generated/KNOWLEDGE_MATRIX.md](generated/KNOWLEDGE_MATRIX.md).
- A clue may point at a **sealed** record on purpose — the sealed notice is itself information ("this
  exists, it is Level 5, Seal VI earns access"). Seal I's first pointer does exactly this with the
  Company Charter. That is a valid use; a clue that _requires reading_ a sealed record is not.
- A clue may point at Choir marginalia only for letters taught by fragments (fragments are on public
  pages and need no clearance), or after Seal III.
- Never gate a clue behind an audio artifact alone. Every artifact has a transcript for this reason
  (`INV-REC-02`).

### Current state of the seal pointers

Read this against [generated/CLUE_LEDGER.md](generated/CLUE_LEDGER.md). Five of the thirteen seal
pointers name a record, and four of those are above the clearance the player holds at that seal:

| Seal | Pointer record            | Tier | Reachable when the seal opens?                         | Reading                                                                                                                                                |
| :--: | ------------------------- | :--: | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
|  I   | `doc-001` Company Charter |  5   | No — and the pointer says so ("sealed to you for now") | Intended: the sealed notice _is_ the clue.                                                                                                             |
| III  | `doc-007` Svalbard Event  |  5   | No                                                     | Supplementary. The answer comes from the Choir inscription, not from this record; the pointer promises a payoff the player collects later, at Level 5. |
|  V   | `ovp-006` Hymnal          |  4   | Yes — Seal IV granted Level 4                          | Correct, and load-bearing: the acrostic only reads with the De-Scrambler on.                                                                           |
| VII  | `ovp-008`, `ovp-009`      |  5   | Yes — Seal VI granted Level 5                          | Correct.                                                                                                                                               |

Two things follow, and both are invariants in all but name:

- **A pointer above the player's tier must be labelled as such** (Seal I does; Seal III does not). If you
  add one, say so in the label, or lower the record's tier.
- **No answer may depend on an unreachable record.** Seal III is safe because its answer is on public
  pages. Before adding a pointer above the current tier, confirm the answer is obtainable without it.

## 5. What the player knows, when

The canonical playthrough as a knowledge state machine. Use it to check any new content against.

| Stage                | Knows                                                                                 | Does not know                                               |
| -------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Landing (shell)      | The company exists; the sections; a callsign; that a transmission is waiting           | That there is a puzzle at all                               |
| Cold boot (`boot`)   | PARADIGM-OS boots; a callsign is chosen; Channel 9 exists                              | That there is a puzzle at all                               |
| Gateway Transmission | There is an "Origin Protocol"; three keys; the case file exists                       | What the keys mean; anything about the Order                |
| Prologue (Thorne)    | There is an Order; there are seven seals; clearance is earned by breaking them        | Any specific fact                                           |
| After Seal I         | Saturn's constant is 15; the carrier drifts toward 15.000; "Completion of the Square" | That the Order is inside the company rather than beneath it |
| After Seal II        | The lobby inlay is a sigil; the word LITURGY; the De-Scrambler exists                 | What the words under the bars say                           |
| After Seal III       | The Choir Script; SVALBARD; the 1989 Descent; that Sedley went down                   | That Sedley is still there                                  |
| After Seal IV        | The three programmes are one chord; 14.8 / 432 / 741                                  | That the hymn hides a location                              |
| After Seal V         | POSTOJNA; the sidebar footer was the reliquary all along                              | What is kept there                                          |
| After Seal VI        | Level 5; the safe; the leak dump; the name is a singer's                              | The name                                                    |
| After Seal VII       | ORPHEUS; the counter-rite; the carrier falls to 0.000                                 | —                                                           |

**Rule.** New content must be placeable in this table. If it cannot be — if it is knowledge with no stage
at which it belongs — it is either redundant or premature.

**The salvage layer is deliberately not in this table.** Tape salvage is orthogonal to the seal spine: it
is gated by _noticing_, not by clearance. A Level 1 player who reads `p-001`'s dossier closely can find a
struck record and splice it before breaking Seal I. That is intentional — the purge is a company secret,
not an Order one, and the Order's progression should not be the only door. What the layer must never do is
pay out a Seal-Word, a degree, or a clearance (`INV-TAPE-04`); its reward is testimony, and testimony is
worth less than a key.

## 6. Spoiler containment

This is a static site: the whole truth ships to the browser. Containment is about _friction and
conscience_, not security. The rules that follow are the project's honest position, and
[PUZZLE_SYSTEM.md](PUZZLE_SYSTEM.md) "Limitations" states the technical version.

**Where plaintext answers legitimately exist:**

1. `src/tests/seal-fixtures.ts` — test-only, never imported by the app, never bundled.
2. Tier-3 hints (`revealsAnswer: true`) — the assisted route requires them.
3. Success bodies and journal lines — the player has already solved it at that point.
4. In-world text that is _about_ the answer rather than being it: `DOC-1989-DESCENT-ORPHEUS` narrates the
   naming; the Choir inscription constant names Svalbard; `gematria` notes annotate 53 and 102.

**Where they must never appear:**

- Any new hint at tier 1 or 2. `canon.test.ts` asserts that no seal's Seal-Word appears in its own tier-1
  or tier-2 hint.
- Any UI chrome, tooltip, `aria-label`, alt text, page title, meta tag or URL.
- `docs/**` other than this document and [CANON.md](CANON.md), which are author-side by declaration.
- Commit messages, PR descriptions and issue text. Puzzle spoilers belong on the vault floor.
- Generated files. `docs/generated/**` is derived from shipped content and therefore already inside the
  spoiler ceiling; it must not add to it.

**Answers are digests in app data.** `npm run puzzle:digest -- -n alnum-upper "…"` regenerates one. Never
store a plaintext answer in `definitions.ts` — the digests are the only reason a casual `grep` of the
bundle does not end the game in ten seconds.

## 7. The revelation graph

Each seal is a node with three edges: **what it teaches**, **what it unlocks**, and **what it
recontextualises**. Keep all three when adding a seal-like puzzle; a puzzle with only the second is a
lock, not a revelation.

| Seal | Teaches                                         | Unlocks                               | Recontextualises                                   |
| :--: | ----------------------------------------------- | ------------------------------------- | -------------------------------------------------- |
|  I   | The constant 15; the drift; the Completion      | Level 2 (44 records)                  | The header's carrier readout                       |
|  II  | LITURGY; the inlay is a sigil                   | Level 3 + De-Scrambler                | Every black bar in the archive                     |
| III  | The Choir Script; SVALBARD; the Descent         | Full glyph alphabet                   | Seven public pages that were carrying glyphs       |
|  IV  | The three voices are one chord                  | Level 4 (100 records)                 | Chime, Vesper and the carrier as separate dossiers |
|  V   | POSTOJNA                                        | The Mercury Wheel                     | The sidebar footer                                 |
|  VI  | The safe; the leak dump; the name is a singer's | Level 5, De-Scrambler on, master dump | Everything Palimpsest covered                      |
| VII  | ORPHEUS; the counter-rite                       | The finale                            | Fifty-five years of "the carrier" as a person      |

## 8. Adding a revelation

1. Place it in the §5 table. If there is no stage for it, stop.
2. Choose the gate. Prefer an existing one; a new gate is a new mechanism and needs an implementation, a
   test and a row in §3.
3. Write the _pre_-revelation text first and check it is harmless to a first-time reader.
4. Write the revelation so that it points at the earlier text explicitly.
5. If it gates a record, the record's tier must be exactly the tier the gate grants — not one above
   (unreachable) and not one below (free).
6. Update [generated/KNOWLEDGE_MATRIX.md](generated/KNOWLEDGE_MATRIX.md) with `npm run archive:report`
   and read the diff.
7. Add the clue rows to the ledger and confirm §4 still holds for every puzzle downstream.

### Anti-patterns

| Anti-pattern                           | Why it fails                                                   | Instead                                            |
| -------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------- |
| Revealing in UI chrome                 | Breaks the player-knowledge boundary; cannot be ungated        | Put it behind a tier                               |
| A clue that requires audio             | Excludes non-listeners; the fiction must not depend on hearing | Transcript, always (`INV-REC-02`)                  |
| A clue that requires colour or motion  | Excludes; also invisible to search and tests                   | Text, plus a labelled control                      |
| Gating a Level 3 record behind Seal IV | 82 records become dead weight                                  | Match the tier to the gate                         |
| Two revelations in one seal            | Neither lands                                                  | Move one to the next seal or to a terminal command |
| An answer in a tier-1 hint             | Ends the puzzle; marks nothing                                 | Tier 3 only, with `revealsAnswer: true`            |
| Retconning a date to fit new prose     | Breaks `CANON_SPINE` and every interval                        | Change the prose, or write a drift-log entry       |

Related: [CANON.md](CANON.md) · [CLUE_LEDGER.md](CLUE_LEDGER.md) · [PUZZLE_SYSTEM.md](PUZZLE_SYSTEM.md) ·
[CONTINUITY.md](CONTINUITY.md)
