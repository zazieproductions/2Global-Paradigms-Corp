# Chronology

How the fifty-five years of this archive are organised, why they are arranged that way, and how to audit
a change to any of it. The full entry-by-entry table is generated:
[generated/CHRONOLOGY.md](generated/CHRONOLOGY.md). This document is the reading of it.

## 1. Three chronologies, one timeline

Every `/timeline` entry carries two lines of prose, and that is the whole trick:

- `description` — what the company said at the time. Public register, past tense, no speculation.
- `internalImpact` — what somebody typed into the record afterwards. Present tense, specific, often
  contradicting the line above it.

`isCovert` marks the 33 entries where the second line is doing the real work (7 + 11 + 15 across the
three eras; the generated table counts them per era). **Never write a covert
entry whose `internalImpact` merely restates the `description`.** If there is nothing to hide, the entry
is not covert and the flag must be false.

Underneath that sit two more chronologies the archive keeps separately:

| Chronology | Kept in                                              | Register                             |
| ---------- | ---------------------------------------------------- | ------------------------------------ |
| Corporate  | `history/timeline.ts`, annual reports, press         | Bureaucratic, defensive              |
| Liturgical | `content/documents/order-documents.ts` (`ovp-*`)     | Scriptural, unhurried, present tense |
| Technical  | programme dossiers, technical specs, audio artifacts | Numeric, unsentimental               |

The three agree on dates and disagree on meaning. That disagreement is not an error to be reconciled — it
is what a recovered archive looks like.

## 2. The eras

`TimelineEra` is a union of exactly three labels (`src/types/content.ts`). `validateCanon()` requires each
entry's year to fall inside its era's declared range, and the eras to tile 1971–2026 with no gap.

Counts below are read from [generated/CHRONOLOGY.md](generated/CHRONOLOGY.md), not retyped.

| Era                  | Span      | Entries | Covert | Share | Shape of the period                                                                                                                                                       |
| -------------------- | --------- | ------: | -----: | ----: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Early Foundations    | 1971–1989 |      12 |      7 |   58% | Two people, one measurement, and the discovery that the measurement is not geology. Ends with the Descent.                                                                |
| Millennial Expansion | 1990–2009 |      20 |     11 |   55% | Infrastructure. The company learns to operate at scale and builds the machinery of concealment (Palimpsest, 1994; Postojna, 1998; Janitor, 1998).                         |
| Modern Hegemony      | 2010–2026 |      20 |     15 |   75% | Delivery. The tone stops being an experiment and becomes municipal plant, classroom bells, HVAC and handsets. Ends with Thorne, the leak, and the carrier approaching 15. |

The covert share dips in the middle era and then jumps. That is the intended shape: the expansion years
were mostly honest paperwork about digging things, and the concealment burden arrives when the tone stops
being an experiment and starts being infrastructure people sleep inside.

## 3. The spine

Nine events carry the whole structure. They are declared as data in `src/lib/archive/canon.ts`
(`CANON_SPINE`) and each one names the records that evidence it; `validateCanon()` proves the evidence
exists and agrees on the date.

| Date       | Event                                          | Id                   |
| ---------- | ---------------------------------------------- | -------------------- |
| 1971-04-12 | Paradigms Systems Ltd. incorporated, Cambridge | `spine-founding`     |
| 1972-11-04 | Liber Carrier written                          | `spine-order-rule`   |
| 1974-09-18 | The 14.8 Hz carrier measured                   | `spine-baseline`     |
| 1986-11-10 | Station 07 commissioned                        | `spine-station-07`   |
| 1989-11-04 | Borehole 4 breaches; the Descent               | `spine-descent`      |
| 1989-11-20 | Project Vesper chartered                       | `spine-vesper`       |
| 1994-05-18 | Reson-8 recalled; Palimpsest begins            | `spine-palimpsest`   |
| 1998-03-22 | Postojna acquired                              | `spine-postojna`     |
| 2019-11-04 | Thorne's exfiltration                          | `spine-exfiltration` |

Everything else is arranged around these. Before adding a new entry, ask which spine event it elaborates;
if the answer is "none", it is scenery and should probably be a station incident or a programme milestone
instead.

### Intervals that must be preserved

These are authored resonances, and each one is stated in-world:

| Interval                     | Length                                                                   | Where it is stated                                 |
| ---------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------- |
| Descent → exfiltration       | 30 years to the day (1989-11-04 → 2019-11-04)                            | Seal VII transmission; `tl-46`                     |
| Descent → predicted crossing | 37 years to the minute (1989-11-04 04:32 → 2026-11-04 04:32 UTC)         | `ovp-009` (de-scrambled)                           |
| Charter → Liber Carrier      | 1 year, 7 months — the Order's rule predates the company's first product | `ovp-003`                                          |
| Descent → Vesper charter     | 16 days (1989-11-04 → 1989-11-20)                                        | `tl-11` → `tl-12`; arithmetic, not stated in-world |
| Foundation → 55th year       | 1971-04-12 → 2026-01-10 entry is titled "Fifty-five years…"              | `tl-52`                                            |

If a date moves, every interval above must be re-checked by hand — `validateCanon()` proves the _dates_
agree with their evidence, not the _intervals_ between spine events.

## 4. The frame dates

The recovery is a second chronology and it must not be confused with the corporate one.

| Date       | Log       | Action                                                      |
| ---------- | --------- | ----------------------------------------------------------- |
| 2026-08-02 | `rst-001` | `VAULT0` volume mounted from the Obsidian Proxy mirror      |
| 2026-08-19 | `rst-002` | Authored dossiers (`doc-001…doc-025`) restored to full text |
| 2026-09-04 | `rst-003` | Operational records rebuilt from index stubs                |
| 2026-09-11 | `rst-004` | Personnel cross-references repaired                         |
| 2026-09-17 | `rst-005` | Palimpsest beacon capture quarantined                       |
| 2026-09-22 | `rst-006` | Six outbound URLs confirmed dead                            |

The frame year is `CANON_CHRONOLOGY.frameYear = 2026`. No corporate record may be dated after
`2026-01-10` (the last timeline entry) and no restoration log before `2026-08-02`. The gap between them
is unexplained and should stay that way.

## 5. Deliberate gaps

| Gap                                | Why                                                                                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No 1990 entry                      | The era begins in 1990; the first entry is 1991. The year is a boundary, not an event.                                                                                        |
| No 2010 entry                      | Same. The Modern Hegemony era begins in 2010; the first entry is 2011.                                                                                                        |
| 1975–1977, 1980–1981, 1983         | The company was small and nothing was worth recording. Silence is evidence of scale.                                                                                          |
| Unresolved `linkedDocuments` codes | Records that were never recovered — the warnings `npm run validate:content` prints, currently 77. Listed as **warnings** on purpose; they render in-world as "not recovered". |
| Page 9 of the Cambridge baseline   | `tl-02` states it is not in the archive. It must never be written.                                                                                                            |

Adding an entry to fill a gap is allowed. Removing the "not recovered" behaviour for a code that does
resolve is a bug fix; adding the missing record is a canon change and needs a drift-log entry.

## 6. Rules for new entries

1. `year` must equal the year of `dateString`. Checked (`INV-CHRON-02`).
2. `dateString` is `YYYY-MM-DD`, always. Checked (`INV-CHRON-02`).
3. `era` must be one of the three union members and its range must contain `year`. Checked
   (`INV-CHRON-03`).
4. Entries are ordered by date in the source array. Checked (`INV-CHRON-04`).
5. `departmentCode` must be one of the ten real department codes. Checked.
6. `classification` is the tier at which a reader may see the entry — not the tier of the underlying
   event. A Level 1 entry can describe a Level 5 event badly; that is the point.
7. `isCovert` requires an `internalImpact` that adds information.
8. If the entry concerns a spine event, cite it in the record's `links` rather than restating the date.

## 7. Auditing

```sh
npm run validate:canon        # chronology, eras, spine evidence, entity naming, terminology
npm run validate:content      # ids, cross-references, dates, transcripts
npm run archive:report:check  # docs/generated/CHRONOLOGY.md still matches the collection
npm run archive:report        # regenerate it after a content change
```

To audit a single year by hand, read the generated table first and then confirm against source:

```sh
# every timeline entry for a year, with its flags
grep -n "dateString: '1994" -A 4 src/content/history/timeline.ts

# every record dated in a year, across all collections
grep -rn "date: '1994-\|dateString: '1994-\|recordingDate: '1994-\|year: 1994" src/content | sort

# who says what about a spine event
grep -rn "1989-11-04\|Borehole 4" src/content
```

The generated table is the audit surface — read `docs/generated/CHRONOLOGY.md`, find the year, and check
that the tier, the covert flag and the department code match the record. Anything the table cannot show
is not auditable and belongs in this file.

Related: [CANON.md](CANON.md) §2 (the carrier's own chronology) · [CONTINUITY.md](CONTINUITY.md) ·
[REVELATION.md](REVELATION.md) §5 (what the player is allowed to know when)
