# Contributing

How to change this repository without breaking the fiction or the build. Written for human contributors
and for AI agents working in it; the contract is the same for both.

## 0. Read this first

| If you are…                     | Read, in order                                                                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| New to the project              | `README.md` → [docs/README.md](README.md) → [ARCHITECTURE.md](ARCHITECTURE.md)                                 |
| Writing or editing records      | [CONTENT_MODEL.md](CONTENT_MODEL.md) → [CONTENT_STYLE_GUIDE.md](CONTENT_STYLE_GUIDE.md) → [CANON.md](CANON.md) |
| Touching a puzzle, clue or gate | [PUZZLE_SYSTEM.md](PUZZLE_SYSTEM.md) → [CLUE_LEDGER.md](CLUE_LEDGER.md) → [REVELATION.md](REVELATION.md)       |
| Changing a date, name or code   | [CANON.md](CANON.md) → [CONTINUITY.md](CONTINUITY.md) → [CHRONOLOGY.md](CHRONOLOGY.md)                         |
| Changing the UI                 | [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)                                                                           |
| Shipping it                     | [DEPLOYMENT.md](DEPLOYMENT.md)                                                                                 |

## 1. The contract

Six rules. They are short because they are the ones that get broken.

1. **Fiction is data.** Story text lives in `src/content/**` as typed records. Components hold UI chrome
   only. If you are writing prose inside a `.tsx` file, stop.
2. **Ids are forever.** Never rename or renumber a record id. It is in URLs, in players' `localStorage`,
   and in cross-references. Human-facing `code`s are a separate field and may be changed with a
   drift-log entry.
3. **Facts are declared once.** A load-bearing fact belongs in `src/lib/archive/canon.ts`, not in three
   prose files. Prose points at it.
4. **Numbers are generated.** Do not retype a count into a document. Link
   [generated/CORPUS.md](generated/CORPUS.md) or run `npm run archive:report`.
5. **Answers have a ceiling.** Plaintext answers exist only in tier-3 hints, success/journal text and
   `src/tests/seal-fixtures.ts`. See [REVELATION.md](REVELATION.md) §6.
6. **Gaps are authored.** An unresolved reference is either deliberate (and listed in
   [CONTINUITY.md](CONTINUITY.md) §3) or a bug. Never silently paper over one.

## 2. Setup

```sh
npm ci          # Node >= 20.19
npm run dev     # http://localhost:5173
npm run check   # typecheck → lint → test → seo:check → archive:report:check → build
```

No API keys, no `.env`, no docker. The app fetches nothing beyond its own static files.

## 3. The standard loop

```sh
# 1. change something in src/content/** or src/lib/**
npm run validate:canon      # narrative continuity: 0 errors expected
npm run validate:content    # structural integrity: 0 errors; read the warnings
npm run archive:report      # regenerate docs/generated/
git diff docs/generated     # THIS IS THE REAL CHANGELOG — read it
npm test                    # full suite
npm run check               # the whole gate, before committing
```

The `git diff docs/generated` step is not optional. It is the only place where the _consequences_ of a
content change are visible: a clearance change shows up as a row moving between tiers, a renamed code
shows up as an `**UNRESOLVED**` pointer, a new record shows up as a count moving. If the diff is empty
when you expected it not to be, the change did not take effect.

## 4. Continuous integration

`.github/workflows/ci.yml` runs the same gate as `npm run check`, split into six jobs so a failure names
the layer that broke:

| Job       | Runs                                                      | Fails when                                                                                     |
| --------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `verify`  | `typecheck`, `lint`, `format:check`                       | the code is not sound or not formatted                                                         |
| `content` | `validate:content`                                        | an id, reference, date or transcript is broken                                                 |
| `canon`   | `validate:canon`                                          | the fiction contradicts itself                                                                 |
| `docs`    | `archive:report:check`                                    | `docs/generated/**` is stale or was hand-edited                                                |
| `seo`     | `seo:check`                                               | the committed route metadata, sitemap or robots.txt disagrees with `src/config/seo-pages.json` |
| `test`    | `npm test`, `npm run build` (which ends in `verify:dist`) | a player-facing path broke, it will not build, or the emitted artifact would not be crawled    |

The `docs` job is the one that surprises people. It exists because `docs/generated/**` is committed: if
you change content and do not run `npm run archive:report`, CI fails — and the diff it wants is the
changelog you should have read anyway.

## 5. Commit convention

Conventional commits, scoped by the layer touched:

| Scope     | Use for                                                          |
| --------- | ---------------------------------------------------------------- |
| `content` | records in `src/content/**`                                      |
| `canon`   | `src/lib/archive/canon.ts`, `validate-canon.ts`, the canon tests |
| `puzzles` | puzzle logic, progression, ciphers                               |
| `archive` | normaliser, clearance, redaction, search                         |
| `ui`      | components, pages, styles                                        |
| `docs`    | `docs/**`, `README.md`                                           |
| `build`   | vite, eslint, prettier, package scripts, deploy config           |

A continuity change gets the reason in the commit body, and a row in
[CONTINUITY.md](CONTINUITY.md) §4 if it moved a load-bearing fact. Puzzle spoilers never go in a commit
message, a PR description or an issue.

## 6. For AI agents

This section is the operating contract for an agent working in the repository. It exists because the
failure mode for an agent here is not a crash — it is a plausible sentence that contradicts a record
three files away.

### Before writing anything

- Read [CANON.md](CANON.md) end to end. It is the shortest path to not inventing a contradiction.
- Read the record you are about to edit **and** the two or three records that reference it. The
  cross-references are typed; `links`, `related`, `relatedPersonnel`, `relatedStations`,
  `relatedPrograms` and `linkedDocuments` will tell you who else knows this fact.
- Check whether the fact is load-bearing: is it in `CANON_SPINE`, `CANON_COUNTS`, `CANON_TERMS`, or
  cited by a puzzle? If yes, changing it is a canon event, not an edit.

### Never

- **Never invent a name, code, date, frequency or frequency-adjacent number.** Derive it: grep the
  corpus, or read the generated ledger. If it genuinely does not exist, add it to the canon registry with
  evidence rather than introducing it in prose.
- **Never "fix" an unresolved reference by creating the missing record** without checking
  [CONTINUITY.md](CONTINUITY.md) §3 first. They are deliberate — and they are the only kind of warning
  `npm run validate:content` emits, so any other warning is a real defect.
- **Never put an answer anywhere new.** Not in a comment, not in a test name, not in a variable name.
- **Never weaken a validator to make it pass.** If a check is wrong, say so and change the check with a
  reason; do not delete the assertion.
- **Never reorganise folders, rename files or restructure the content model** as a side effect of another
  task. The layering rules in [ARCHITECTURE.md](ARCHITECTURE.md) are what make the validators possible.
- **Never edit `docs/generated/**`.** It is derived; `archive:report:check` will fail.
- **Never retype a count.** Generate it or link it.

### Always

- Prefer extending the existing model over introducing a parallel one. A new record kind needs a type, a
  collection, a barrel export, a `buildEntries()` mapping and validator coverage — see
  [CONTENT_MODEL.md](CONTENT_MODEL.md) §"A new collection".
- Write the public copy as if the Order does not exist. Then write the truer line in `internalSubtext`,
  `internalImpact`, `classifiedReality` or `redactedContent`.
- State what you verified, with the command and its output. "Tests pass" is not a verification; "
  `npm run validate:canon` → 0 errors, 0 warnings" is.
- Report what you could not check. An honest gap costs nothing; a confident guess costs a round trip.

### The four checks that catch almost everything

```sh
npm run validate:canon      # did I contradict the fiction?
npm run validate:content    # did I break a reference?
git diff docs/generated     # what actually changed downstream?
npm test                    # did I break a player-facing path?
```

If all four are clean and the generated diff reads like the change you intended, the change is probably
right. If the diff contains something you did not intend, that is the bug.

## 7. Reporting problems

- **Bugs, accessibility reports, continuity errors:** issues on this repository. A continuity report is
  most useful with the two records that disagree, quoted, with their ids.
- **Puzzle spoilers:** never in an issue. They belong on the vault floor.
- **Proposed canon changes:** open an issue describing the fact, the records it affects, and the
  invariant you would add. Do not open a PR that changes a canon date without the drift-log row.

## 8. What "done" means

A change is finished when:

- [ ] `npm run check` passes (typecheck, lint, tests, report check, build)
- [ ] `npm run validate:canon` reports 0 errors
- [ ] `npm run validate:content` reports 0 errors and the warning count moved only by intent
- [ ] `docs/generated/**` regenerated, and the diff has been read
- [ ] Any load-bearing change has a row in [CONTINUITY.md](CONTINUITY.md) §4
- [ ] New prose has been read aloud once in the register it claims to belong to

Related: [docs/README.md](README.md) for the whole map · [CONTINUITY.md](CONTINUITY.md) for the review
checklist
