# Content style guide

How the archive sounds. The corpus is ~245,000 characters written by a dozen different in-world hands
over fifty-five years, so "consistent voice" is the wrong target — **consistent registers** is the right
one. Every piece of text belongs to one of five registers below, and the register is determined by the
record, not by the author's mood.

Canonical spellings are enforced by `CANON_TERMS` in `src/lib/archive/canon.ts` and are not repeated
here; see [CANON.md](CANON.md) §10.

## 1. The five registers

| Register                  | Used by                                                             | Sound                                                                                        | Example                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Public**                | press releases, values, annual reports, job postings, newsletters   | Confident, vague, unctuous. Never admits a mechanism.                                        | "Stability is cheaper to maintain than to restore."                                                                            |
| **Internal bureaucratic** | memoranda, minutes, technical specs, incident logs, personnel files | Dry, specific, passive where blame is near. Abbreviations used without expansion.            | "Passenger agitation incidents fall by a fifth in the following quarter and the loss sheets are the cleanest anyone has seen." |
| **Liturgical**            | `ovp-*`, seal transmissions, Choir marginalia                       | Present tense, scriptural, numbered, unhurried. Uses "the Voice", "the Company", "the Rule". | "There is a Voice beneath the world. It speaks at fourteen and eight-tenths. We did not make it."                              |
| **Technical**             | research papers, telemetry, audio transcripts, terminal output      | Numeric, unsentimental, unit-precise. No adjectives.                                         | `STATION 07 (SVALBARD): 14.802 Hz @ 94.2 dB (SURGE ALERT: +18.4%)`                                                             |
| **Thorne**                | prologue, seal transmissions, hints, notebook                       | First person, dry, specific, occasionally funny, never grand. Signs `— E.T.`                 | "Here is the part nobody at head office will say out loud."                                                                    |

### The rule that matters most

**A record may only use its own register.** The failure to watch for is a Level 1 press release that
knows too much because its author read the Level 5 file. Write the public copy as if the Order does not
exist, because the person who wrote it believes that.

Corollary: `internalSubtext`, `internalImpact`, `classifiedReality`, `classifiedNotes`,
`scrubbedFootnote` and `redactedDiscussion` exist precisely so that the second, truer voice has somewhere
to live. Use them instead of contaminating the first.

## 2. Numbers and units

| Case                                | Convention                                                                 | Why                                                                |
| ----------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Public or 1970s copy                | `14.8Hz` — no space, one decimal                                           | That is how it was written at the time and how the press quotes it |
| Telemetry, terminal, Order material | `14.802 Hz` — space, three decimals                                        | Instrument precision is the point                                  |
| The threshold                       | `15.000` — never "fifteen hertz"                                           | The three decimals are liturgical                                  |
| Spell it out in liturgy             | "fourteen and eight-tenths"                                                | `ovp-003` §I does this and nothing else may break the pattern      |
| Money                               | `£` with a comma: `£48.2M`, `£250,000`                                     | The company is British; dollars appear only in US incident logs    |
| Depth                               | `-820 m`, `2,900 kilometres` — sign for below, spelled unit for the mantle | Deliberate inconsistency between instrument and narrative readings |
| Percentages                         | `0.05%`, `18.4%`                                                           | One decimal maximum unless the instrument gives more               |

Both `14.8Hz` and `14.802 Hz` are canonical in their registers — this is why the terminology checker does
**not** flag the spacing. Mixing them inside one record is the error.

## 3. Dates

- ISO `YYYY-MM-DD` in every typed field. The validators require it.
- In prose, write the long form the register calls for: "4 November 1989" (internal), "November 4, 1989"
  (US press), "1989-11-04 04:32 UTC" (technical), "the winter solstice" (liturgical).
- Never write a relative date ("last year", "recently") in a dated record. The archive is read out of
  order and fifty years later.
- A year-only value is allowed where only the year is known; the normaliser stores it as `YYYY-01-01`.

## 4. Codes and identifiers

| Thing               | Format                                   | Example                                               | Rule                                                                                                                                                                                                                                                                                           |
| ------------------- | ---------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Document code       | `PREFIX-YYYY-SLUG`                       | `DOC-1989-SVALBARD-EVENT`                             | 2–5 letter prefix, 4-digit year, uppercase slug with hyphens. Enforced (`validateContent()` warns on non-standard).                                                                                                                                                                            |
| Order document code | same, `DOC-` or `SPEC-`                  | `SPEC-1983-LOBBY-INLAY`                               | Order records use `ovp-###` ids and ordinary `DOC-`/`SPEC-` codes — the Order files inside the company's system on purpose.                                                                                                                                                                    |
| Record id           | `prefix-###`                             | `doc-007`, `p-009`, `st-04`, `prog-02`, `ovp-003`     | Lowercase, zero-padded. **Never reused or renamed.**                                                                                                                                                                                                                                           |
| Employee id         | `GPC-####-XXX`                           | `GPC-0001-EXEC`                                       | Four-digit sequence plus a function code. The 21 suffixes in use are role abbreviations (`EXEC`, `CEO`, `EVP`, `DIR`, `SCI`, `BIO`, `OPS`, `ENG`, `ARC`, `TEC`, `SEC`, `PR`, `FOR`, `AUD`, `MED`, `LEG`, `RES`, `SOC`, `TAC`, `OCE`, `LEAK`) — never a department code, never invented ad hoc. |
| Station code        | `AAA-##-AAA`                             | `SVA-04-ARR`                                          | Region, number, function. Enforced (`INV-ENTITY-04`).                                                                                                                                                                                                                                          |
| Programme code      | `PROG-NAME`                              | `PROG-VESPER`                                         | Uppercase, no year. Enforced.                                                                                                                                                                                                                                                                  |
| Audio code          | `ART-##-SLUG`                            | `ART-01-SVALBARD`                                     | **`ART-`, never `AUDIO-`.** Citing an artifact through a document field is a build error (`INV-REF-02`).                                                                                                                                                                                       |
| Restoration log     | `RST-YYYY-####`                          | `RST-2026-0014`                                       | Frame-year prefix.                                                                                                                                                                                                                                                                             |
| In-world path       | `//POSTOJNA/VAULT0/<KIND>/<YEAR>/<CODE>` | `//POSTOJNA/VAULT0/DOCS/1989/DOC-1989-SVALBARD-EVENT` | Derived by the normaliser when omitted. Only override it to make a point.                                                                                                                                                                                                                      |

**Never invent a code in prose.** If a code appears in text, it must resolve to a real record;
`INV-REF-01` checks everything the terminal prints, and `validateContent()` warns on every unresolved
`linkedDocuments` code. The 87 that remain are authored gaps, listed in
[CONTINUITY.md](CONTINUITY.md) §3.

## 5. Redactions

Write hidden words inline; the machinery does the rest.

```ts
summary: 'Transfer order for the Halloway reels to [REDACTED: Vault 0].',
content: 'Effective immediately, all reels are to be moved to [REDACTED: Vault 0] …',
redactedContent: 'Effective immediately, all reels are to be moved to Vault 0 …'
```

- `[REDACTED: the hidden words]` — a bar whose length approximates the span.
- `[REDACTED]` — a bar with nothing under it. Legitimate: sometimes Palimpsest won.
- A record that hides words **must** supply `redactedContent`, or the suite fails.
- Never put a redaction inside a code, an id, a title or a tag. Titles are the abstract: they are what a
  sealed record still shows, and what the search index keeps for Order material.
- The hidden words never reach the DOM, exports, the clipboard or the search index
  (`stripRedactions` runs at normalisation, before indexing). Do not add a code path that bypasses it.

**Choosing what to hide.** Redact the _specific_, not the _scary_. "[REDACTED: Vault 0]" is good: a
place name is a fact. "[REDACTED: the terrible truth]" is bad: it promises instead of concealing. The
best redactions hide a proper noun the reader will meet later at a higher tier.

## 6. Typography

- Em dash `—` for the internal register's asides; never a double hyphen.
- En dash `–` for ranges: `1971–2026`, `doc-001…doc-025`.
- Ellipsis `…` single character, used sparingly. Thorne uses it; bureaucratic records do not.
- Section signs in liturgy: `§I`, `§IV`.
- Planetary and alchemical glyphs come from `font-symbol` (Noto Sans Symbols) and are always paired with
  text — `♄ Saturn`, never `♄` alone. State is never carried by a glyph or a colour by itself.
- No emoji anywhere in content. The one exception is the `🜔` used by the sealed-record notice, which is
  an alchemical sign for a crucible, not an emoji.
- Terminal output is uppercase where the machine would be uppercase (`STATION 07`, `SURGE ALERT`) and
  lowercase where a human typed it (`Type "cat <doc_code>" to read any record directly.`).
- Curly apostrophes appear in the corpus where a name has one (`Niall O’Connor`). Keep them; do not
  normalise to straight quotes in a name.

## 7. Voice in UI states

Empty, loading, missing, denied and error states are in character and use `SystemNotice` rather than a
bare "No results". The five states and their codes:

| State   | Code      | Voice                                                             |
| ------- | --------- | ----------------------------------------------------------------- |
| empty   | `IDX-000` | The index has nothing; it is not sorry about it.                  |
| loading | `SPOOL`   | Tape language: spooling, buffering, mounting.                     |
| missing | `ERR-404` | The record was expected and is not there. Say which.              |
| denied  | `ERR-403` | Sealed. Name the tier required and the seal that earns it.        |
| error   | `ERR-500` | The archive faulted. Offer recovery in-world, then a real reload. |

Rules: never blame the player; never apologise more than once; always say what to do next. The sealed
state must name the tier **and** the seal (`SEAL_FOR_RANK`), because a dead end that does not say how to
open is a dead end.

## 8. The fiction notice

`FICTION_NOTICE` (`src/config/site.ts`) renders on every public page, in `<noscript>`, and in the meta
description. It is not voice and is not negotiable:

> Global Paradigms Corp. is an original work of interactive fiction by Zazie Productions. The company,
> its staff, projects, products, documents and events are invented. Real place names are used only as
> fictional settings.

Out-of-world text uses `FictionNotice`, never `SystemNotice`. The boundary between the two is the
boundary of the fiction and it is not crossed for jokes.

## 9. Prohibited

- **No real organisations, people, products or incidents.** Real place names are permitted as settings
  (Svalbard, Postojna, Grimsel) and nothing else.
- **No real science presented as fact.** 14.8 Hz infrasound, 432 Hz tuning and gematria are all real
  cultural material; the archive treats them as in-world folklore and never asserts a mechanism.
- **No harm instruction.** Nothing in the corpus may describe how to build, dose, or deploy anything.
  Compound 88-T has a formulation note and no recipe.
- **No real URLs.** `dead-links.ts` holds fictional, non-resolving addresses that are never rendered as
  clickable links.
- **No personal data requests.** No mechanic asks for anything, and the notice says so.
- **No answers** outside the places listed in [REVELATION.md](REVELATION.md) §6.

## 10. Checklist before committing text

- [ ] The record's register matches its kind and clearance
- [ ] Numbers follow §2; the register's frequency spelling is used throughout the record
- [ ] Dates are ISO in typed fields and never relative in prose
- [ ] Every code mentioned resolves, or is an authored gap you meant
- [ ] Redactions hide specifics, and `redactedContent` exists
- [ ] No glyph, colour or motion carries state alone
- [ ] `editorialNote` used for anything you needed to say out-of-world; it never renders
- [ ] `npm run validate:canon && npm run validate:content` — 0 errors

Related: [CANON.md](CANON.md) · [CONTENT_MODEL.md](CONTENT_MODEL.md) ·
[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) · [REVELATION.md](REVELATION.md)
