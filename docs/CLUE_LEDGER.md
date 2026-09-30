# Clue ledger

How to trace a clue from its source in the corpus to the payoff it earns, and how to change one without
breaking a puzzle four steps downstream. The exhaustive table — every clue, pointer, hint, reward and
requirement, with what each resolves to — is generated:
[generated/CLUE_LEDGER.md](generated/CLUE_LEDGER.md). This document is how to read and extend it.

## 1. Anatomy of a clue

```ts
{
  id: 'seal-3-clue-2',                     // stable; appears in nothing the player sees
  text: 'The 1989 Svalbard Event',         // the in-world pointer, shown in the hint UI
  location: { type: 'record', ref: { kind: 'document', id: 'doc-007' } }
}
```

Three location types, and the distinction matters for validation:

| Type     | Points at                                    | Validated                                    | Fails how                                |
| -------- | -------------------------------------------- | -------------------------------------------- | ---------------------------------------- |
| `record` | a record id, resolved through the normaliser | Yes — `INV-REV-01`                           | Build error if the record does not exist |
| `route`  | a nav path                                   | Yes — against `NAV_ITEMS`                    | Build error if the path is not a section |
| `ui`     | a free-text label                            | Only checked for accidental code-shaped text | Silently wrong                           |

`ui` is the weak link: nothing proves the label still describes the interface. The content-integrity
suite at least rejects a `ui` label that looks like a document code (`DOC-…`, `OVP-…`), because that is
almost always a pointer that failed to resolve and fell back. Prefer `record` and `route`; use `ui` only
for something genuinely in the chrome, like the Gateway's marquee.

### How seal pointers become clues

`src/content/puzzles/seals.ts` authors pointers as `{ tab }` or `{ docCode }`.
`src/content/puzzles/definitions.ts` resolves them in `sealClues()`:

```
docCode  →  DOCUMENTS.find(code)  →  { type: 'record', ref: { kind: 'document', id } }
         ↘  not found             →  { type: 'ui', label: docCode }        ← silent degradation
tab      →                        →  { type: 'route', path: `/${tab}` }
```

The silent fallback is the single most dangerous line in the puzzle system: a renamed document code does
not fail the build, it quietly turns a working pointer into a dead label. The
**Seal pointers (narrative layer)** table in the generated ledger exists to make that visible — any row
reading `**UNRESOLVED**` is a bug.

## 2. Source → transformation → payoff

Every puzzle is a chain. Writing the chain down is the check: if any link is missing, the puzzle is
unfair; if a link is in the wrong place, the puzzle is a spoiler.

| Seal | Source (where the data lives)                                               | Transformation (what the player does)                | Payoff                                                    |
| :--: | --------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------- |
|  I   | Two given digits in the transmission; the header's carrier readout          | Complete the 3×3 magic square; read the constant     | `ORDO`; Level 2; the realisation that 15 is the threshold |
|  II  | The lobby inlay spec (`ovp-002`); the Chaldean order; the days of the week  | Walk the heptagram Sunday-first; collect letters     | `ROTA`; Level 3 + De-Scrambler; LITURGY                   |
| III  | Seven fragments on seven public pages                                       | Collect glyphs; read the inscription                 | `PROFUNDUM`; full Choir alphabet; SVALBARD                |
|  IV  | Three programme dossiers, three frequencies                                 | Set three dials                                      | `HARMONIA`; Level 4; 14.8 / 432 / 741                     |
|  V   | The Hymnal (`ovp-006`), De-Scrambler on                                     | Read the first letter of each line                   | `ECHO`; POSTOJNA; the Mercury key                         |
|  VI  | The Mercury ciphertext (`MERCURY_CIPHERTEXT`); the Vesper broadcast time    | Turn the Vigenère wheel with POSTOJNA; read the code | `UMBRA`; Level 5; the safe; the master dump               |
| VII  | The six Seal-Words; `DOC-1989-DESCENT-ORPHEUS`; the `gematria` note for 102 | Take the initials; complete the name                 | `SILENTIUM`; the finale                                   |

Two structural facts worth keeping:

- **Every seal after II depends on the previous seal's _reward_, not just its completion.** V needs the
  De-Scrambler (II); VI needs V's answer as its keyword; VII needs all six Seal-Words. This is why the
  chain cannot be reordered or shortcut, and why `requires` alone is not the whole dependency story.
- **Seal III's source is the only one on public pages.** It is therefore the only seal solvable at
  Level 1, and the only one whose clue surface is fragment collection rather than record reading.

## 3. Change-impact analysis

Before changing anything in the table below, read the "breaks" column.

| If you change…                    | …check                                                                                        | …because                                                                                      |
| --------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| A document `code`                 | every seal pointer's resolved row; `linkedDocuments`; `TERMINAL_LEAK_DUMP`; `cat` deep links  | Codes are the join key for most cross-references, and a failed pointer degrades silently (§1) |
| A document `id`                   | URLs, saved progress, `related`/`links`, clue `ref`s                                          | Ids are in players' `localStorage`. Never renumber — `INV-REC-01`                             |
| A record's `clearance`            | `generated/KNOWLEDGE_MATRIX.md`; every clue pointing at it; [REVELATION.md](REVELATION.md) §4 | It may become unreachable at the seal that needs it, or free too early                        |
| A `departmentId` / `stationId`    | `departmentName`, `stationName` on every record that cites it                                 | `INV-ENTITY-01/02/03` fail on mismatch                                                        |
| A Seal-Word                       | `INV-SEAL-02` (the initials), the success heading, the journal line                           | The initials spell the finale's name                                                          |
| A seal's `rewardLevel`            | `EARNED_BY`, `SEAL_FOR_RANK`, `INV-SEAL-03`                                                   | Clearance is derived from rewards; the ladder must ascend                                     |
| A fragment's letters or tab       | `INV-CHOIR-01/02`; the inscription                                                            | The fragments must still teach every letter the inscription needs                             |
| A puzzle answer                   | `npm run puzzle:digest`; `seal-fixtures.ts`; the test suite                                   | Digests are the only copy in app data                                                         |
| A route path                      | `LEGACY_REDIRECTS` in all three places, `routes.test.tsx`                                     | Six aliases are already 301'd at the edge                                                     |
| A terminal command's printed code | `INV-REF-01`                                                                                  | The terminal advertises `cat <code>`; a bad code is a dead end                                |

The generated ledger is the impact map. After any of these changes:

```sh
npm run archive:report
git diff docs/generated
```

The diff _is_ the change-impact report. If it is empty, nothing downstream moved — which is either
reassuring or a sign the change did not take effect.

## 4. Adding a clue

1. Decide the location type. Prefer `record`; fall back to `route`; avoid `ui`.
2. Confirm the target is readable at the seal it belongs to
   ([REVELATION.md](REVELATION.md) §4). If it is above the current tier, the pointer label must say so.
3. Write `text` as an in-world pointer, not as an instruction. "Project Vesper dossier", not "go to the
   programmes page and find Vesper".
4. Give it a stable `id` (`<puzzle>-clue-<n>` for seals; a descriptive slug otherwise).
5. Run `npm run validate:content` (resolves `record` refs) and `npm run archive:report`, then read the
   new row in the ledger.

## 5. Adding a puzzle

The full procedure is in [PUZZLE_SYSTEM.md](PUZZLE_SYSTEM.md) §"Adding a puzzle". The ledger-specific
part:

- Every puzzle needs at least one clue, or an explicit reason it has none (`gateway-transmission`
  re-asks keys already held; the ledger renders that as _no clues: re-asks keys already held_ rather than
  an empty row).
- Rewards must be listed even when empty — an empty `rewards: []` is the assertion that the puzzle grants
  nothing, which `INV-GATE-01` checks for the Gateway.
- `requires` must name puzzles that exist (`validateContent()` checks this).
- The journal line is permanent record; the success body is not. Put anything the case file should
  remember in `journal`.

## 6. Auditing the ledger

```sh
npm run validate:content      # clue refs resolve; hint tiers ascend; digests well-formed
npm run validate:canon        # seal order, initials, fragment coverage, gateway gating, terminal codes
npm run archive:report:check  # the ledger still matches the source
```

By hand, the three questions that catch most problems:

1. **Does every clue resolve?** Scan the _Clues_ table for a target that is not `record:` / `route:`.
2. **Does every pointer resolve?** Scan the _Seal pointers_ table for `**UNRESOLVED**`.
3. **Is every reward reachable?** Walk the _Seal ladder_ table's `Requires` column: it must form a single
   chain `seal-1 → … → seal-7` with no branch and no gap.

Related: [REVELATION.md](REVELATION.md) · [PUZZLE_SYSTEM.md](PUZZLE_SYSTEM.md) ·
[CONTINUITY.md](CONTINUITY.md) §5
