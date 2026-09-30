# AGENTS.md

Operating contract for AI agents working in this repository. Read all of it; it is short on purpose.

**This is an authored work of fiction, not a template.** It is a single self-contained interactive
fiction / ARG by Zazie Productions: 412 typed archive records across 17 kinds, a 1971–2026 chronology, a
concealed second institution inside the company, and a seven-puzzle progression spine. The engineering
exists to keep that corpus consistent over long authoring sessions. Preserving the fiction is the job.

## Read before you write

1. [`docs/CANON.md`](docs/CANON.md) — what is true. Read it end to end; it is the shortest path to not
   inventing a contradiction.
2. [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) §_For AI agents_ — the contract, including the "never" list.
3. [`docs/generated/CANON_LEDGER.json`](docs/generated/CANON_LEDGER.json) — the same canon as data, if
   you would rather parse than read.
4. Whichever system doc matches your task, from the map in [`docs/README.md`](docs/README.md).

## Hard rules

- **Fiction is data.** Story text lives in `src/content/**` as typed records. Never write prose into a
  component.
- **Never invent a fact.** Names, codes, dates and frequencies must be derived from the corpus or
  declared in `src/lib/archive/canon.ts` with evidence. Grep before you write.
- **Never renumber or rename a record id.** Ids live in URLs, player saves and cross-references.
- **Never put a puzzle answer anywhere new.** Plaintext answers exist only in tier-3 hints,
  success/journal text, and `src/tests/seal-fixtures.ts`.
- **Never weaken a validator to make it pass**, and never edit `docs/generated/**` (it is derived).
- **Never "fix" an unresolved reference** without checking `docs/CONTINUITY.md` §3. Most are deliberate
  in-world gaps; three are records _struck_ under Directive 17 and recoverable only through the
  tape-salvage mechanic. Adding either to the live index is a canon error, not a fix.
- **Never reorganise folders or restructure the content model** as a side effect of another task.
- **Never retype a count into prose.** Link the generated table or run `npm run archive:report`.

## Verify before you report

```sh
npm run validate:canon      # narrative continuity — expect 0 errors; 1 warning is recorded and allowed
npm run validate:content    # structural integrity — expect 0 errors; warnings are authored
npm run archive:report      # regenerate docs/generated/, then read `git diff docs/generated`
npm test                    # full suite
npm run check               # typecheck → lint → test → seo check → report check → build
```

`git diff docs/generated` is the real changelog: it shows what your content change did downstream. If it
contains something you did not intend, that is the bug.

When you report, state the command you ran and the number it returned — "`npm run validate:canon` →
0 errors, 1 warning (the recorded `ECHO` exception)", not "checks pass". Say plainly what you could not
check. A confident guess in this repository produces a contradiction that nobody notices until a player
does.

## Where spoilers go

Nowhere public. Not in a commit message, a PR description, an issue, a code comment or a variable name.
`docs/CANON.md` and `docs/REVELATION.md` are author-side by declaration and are the only prose that may
name the ending.
