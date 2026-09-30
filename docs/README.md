# Documentation

The production documentation for _Global Paradigms Corp. — Recovered Archive_: an authored interactive
fiction / ARG delivered as a static React + TypeScript application, whose story exists as typed data
rather than as page prose.

These documents are an authoring tool, not a description. Each one either **decides** something (canon,
continuity, style), **explains a system** (architecture, content model, puzzles, revelation, design), or
**is generated from the source** (`generated/`). Nothing here is decorative; if a document stops being
true, that is a bug.

## The map

### Narrative architecture — what is true, and how it stays true

| Document                                         | Read it when                                                                                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [CANON.md](CANON.md)                             | You are about to state a fact. The story bible: cosmology, institutions, people, places, programmes, terminology, and the order of authority when sources conflict. |
| [CHRONOLOGY.md](CHRONOLOGY.md)                   | You are touching a date. Three chronologies, the nine spine events, the intervals between them, the eras, and the deliberate gaps.                                  |
| [CONTINUITY.md](CONTINUITY.md)                   | You are editing an existing record. The named invariants and what enforces each, the authored gaps, and the drift log.                                              |
| [REVELATION.md](REVELATION.md)                   | You are gating, revealing or recontextualising anything. Knowledge states, the five gates, clue readability, spoiler containment.                                   |
| [CLUE_LEDGER.md](CLUE_LEDGER.md)                 | You are changing a clue, a pointer or a reward. Source → transformation → payoff, and the change-impact table.                                                      |
| [CONTENT_STYLE_GUIDE.md](CONTENT_STYLE_GUIDE.md) | You are writing prose. The five registers, numbers, dates, codes, redactions, typography, prohibited content.                                                       |

### Engineering — how it is built

| Document                             | Read it when                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| [ARCHITECTURE.md](ARCHITECTURE.md)   | You need the repo map, the layering rules, the runtime flow, or the state and data flow.                     |
| [CONTENT_MODEL.md](CONTENT_MODEL.md) | You are adding or changing a record. Types, collections, the normaliser, redaction syntax.                   |
| [PUZZLE_SYSTEM.md](PUZZLE_SYSTEM.md) | You are adding or changing a puzzle. The puzzle model, validation, hints, rewards, progression, persistence. |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | You are building or restyling UI. Tokens, components, accessibility, responsive behaviour.                   |
| [DEPLOYMENT.md](DEPLOYMENT.md)       | You are shipping. Host requirements, redirects, headers, caching, environment flags, media.                  |
| [SEO.md](SEO.md)                     | You are touching metadata, the static route output, the sitemap, or Search Console.                          |

### Process

| Document                           | Read it when                                                                                                                 |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Always, before your first change. The contract, the standard loop, CI, the commit convention, and the section for AI agents. |
| [`../README.md`](../README.md)     | You want the accession card: what this is, the measured claims, and how to check each one.                                   |

### Generated — derived from source, never hand-edited

Regenerate with `npm run archive:report`; CI fails if they are stale (`npm run archive:report:check`).

| File                                                           | Contains                                                                                                                                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [generated/CORPUS.md](generated/CORPUS.md)                     | The authoritative counts: records, kinds, id ranges, code prefixes, clearance distribution, sidebar sections, legacy redirects.                                           |
| [generated/CHRONOLOGY.md](generated/CHRONOLOGY.md)             | Every timeline entry with its flags, plus the spine events and their evidence.                                                                                            |
| [generated/CLUE_LEDGER.md](generated/CLUE_LEDGER.md)           | Every clue, seal pointer, hint tier and reward — with what each resolves to.                                                                                              |
| [generated/KNOWLEDGE_MATRIX.md](generated/KNOWLEDGE_MATRIX.md) | Records per kind per tier, the unlock ladder, what each seal releases, the Order material, the redaction surface.                                                         |
| [generated/REGISTRY.md](generated/REGISTRY.md)                 | Who owns what and who is where: departments with the programmes they lead, programmes, stations with their leads, the full personnel roster with cross-reference density. |
| [generated/CANON_LEDGER.json](generated/CANON_LEDGER.json)     | The same canon, puzzle and terminal graph as machine-readable JSON, for tooling and for agents that would rather parse than read.                                         |

## Reading orders

**Ten minutes, no changes planned.** `../README.md` → [CANON.md](CANON.md) §1–2 →
[REVELATION.md](REVELATION.md) §1–3.

**First content contribution.** [CONTRIBUTING.md](CONTRIBUTING.md) → [CONTENT_MODEL.md](CONTENT_MODEL.md)
→ [CONTENT_STYLE_GUIDE.md](CONTENT_STYLE_GUIDE.md) → [CANON.md](CANON.md) §10–12.

**First puzzle contribution.** [PUZZLE_SYSTEM.md](PUZZLE_SYSTEM.md) → [CLUE_LEDGER.md](CLUE_LEDGER.md) →
[REVELATION.md](REVELATION.md) §4 and §6.

**Auditing the fiction.** [CONTINUITY.md](CONTINUITY.md) §2 → the four commands in §7 →
[generated/KNOWLEDGE_MATRIX.md](generated/KNOWLEDGE_MATRIX.md).

**An AI agent joining the repository.** [`../AGENTS.md`](../AGENTS.md) → [CANON.md](CANON.md) →
[CONTRIBUTING.md](CONTRIBUTING.md) §_For AI agents_ → [generated/CANON_LEDGER.json](generated/CANON_LEDGER.json).

## The three commands that matter

```sh
npm run validate:canon      # narrative continuity — 0 errors expected
npm run validate:content    # structural integrity — 0 errors; warnings are authored gaps
npm run archive:report      # regenerate generated/, then read `git diff docs/generated`
```

`npm run check` runs the full gate: typecheck → lint → test → report check → build.

## Maintenance contract

- **A document that decides something must say what enforces it.** Every invariant in
  [CONTINUITY.md](CONTINUITY.md) §2 names its mechanism; `convention` is used only where nothing does,
  and that is a known risk rather than an oversight.
- **A document that measures something must be generated.** Counts, tables and matrices live in
  `generated/`. Hand-written prose links to them instead of restating them.
- **A document that describes a system must survive the system changing.** Where a description can be
  checked cheaply, it is — the seal order, the fragment coverage, the terminal's codes and the counts are
  all asserted in `src/tests/canon.test.ts`.
- **When you find a document that is wrong, fix it in the same commit.** Stale documentation is the
  cheapest failure in this repository to prevent and the most expensive to discover later.
