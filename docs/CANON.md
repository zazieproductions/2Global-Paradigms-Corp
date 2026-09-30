# Canon

The story bible for _Global Paradigms Corp. — Recovered Archive_. This is the document that decides what
is true. When two records disagree, the canon wins; when the canon is silent, the record with the higher
clearance and the later in-world date wins, and the ambiguity should be recorded in
[CONTINUITY.md](CONTINUITY.md) rather than quietly resolved.

> **Spoilers.** This document is author-side. It names the Order, the Seal-Words and the ending. Nothing
> here may be copied into app-readable text ahead of the puzzle that reveals it — see
> [REVELATION.md](REVELATION.md).

## 0. Order of authority

When sources conflict, resolve in this order and never the other way round:

| Rank | Source                                            | Why                                                                    |
| ---: | ------------------------------------------------- | ---------------------------------------------------------------------- |
|    1 | `src/lib/archive/canon.ts`                        | The declared spine. Machine-checked against the collections.           |
|    2 | The record with the higher clearance, dated later | In-world, better-informed and better-edited.                           |
|    3 | Level 5 / Order material                          | The Order knows its own liturgy; the company only knows its paperwork. |
|    4 | The public copy (press, values, annual reports)   | Deliberately wrong. Useful as evidence of what is being covered.       |

The public copy being _false_ is not drift. Palimpsest exists to make it false, and the gap between the
public copy and the Level 5 record is the engine of the whole archive. Drift is when two records at the
**same** clearance, written by the **same** hand, disagree.

## 1. The premise, in one paragraph

Global Paradigms Corp. sells strategic forecasting to governments. In 1974 its founders measured a
continuous 14.8 Hz tone in Cambridgeshire bedrock and discovered it was not geology. Everything since —
twenty-two stations, fourteen programmes, eight recalled products, a church in the basement — is the
company's answer to that measurement. The concealed layer is the **Ordo Vocis Profundae**, which has
steered the firm since the charter was signed. The player is a guest investigator inside an archive
recovered in 2026, and the investigation is the Seven Seals.

## 2. Cosmology

### The carrier

| Fact                               | Value                                     | Where it is stated                 |
| ---------------------------------- | ----------------------------------------- | ---------------------------------- |
| Frequency as measured, 1974        | `14.8Hz`                                  | `tl-02`, `doc-002`                 |
| Standing instrument reading        | `14.802 Hz`                               | `TERMINAL_STATUS`, `TERMINAL_SCAN` |
| Annual drift asserted by the Order | `0.05%`                                   | Seal I revelation                  |
| Reading at the frame date          | `14.94 Hz`                                | `tl-52`, `ovp-009`                 |
| Liturgical threshold               | `15.000` — "the Completion of the Square" | Seal I revelation, `ovp-003` §V    |
| Predicted crossing                 | 2026-11-04, 04:32 UTC                     | `ovp-009` (de-scrambled)           |
| Source depth                       | Project Monolith tracks it at 2,900 km    | Seal VII transmission              |

The carrier is **not** a signal, a message or a machine. It is a voice. The Order's position (`ovp-003` §I)
is the shortest statement of the cosmology: _"There is a Voice beneath the world. It speaks at fourteen
and eight-tenths. We did not make it. We have heard it."_

**Rule.** The carrier never becomes benevolent, hostile or intelligible in prose. It is described only
through measurement, and through what people do about the measurement. Every project in §6 is a response
to a number, not to a meaning.

### The three voices

The Order's solar rite binds three programmes into one chord. They are one hymn with three parts and the
company has always filed them separately (`ovp-005`, Seal IV):

| Voice   | Programme                      | Hz   | Public cover                      |
| ------- | ------------------------------ | ---- | --------------------------------- |
| Earth   | Global Baseline Carrier        | 14.8 | — (never public)                  |
| Evening | Project Vesper                 | 432  | transit comfort, "the quiet hour" |
| Child   | Project Chime (lower harmonic) | 741  | school bell standards             |

Chime's second harmonic is 1176 Hz. Only the lower one is ever used in the rite; the pair appears in
`doc-015` and in Chime's dossier.

### The Descent

On 1989-11-04, Arthur Sedley went down Borehole 4 at Station 07 for the listening vigil a Magister is
permitted once in a lifetime, and the lift came back empty. Since 05:15 that day every geophone on
Spitsbergen has recorded a human voice singing beneath the carrier. The Order gave him the name
**Orpheus** as a compliment; it is now a warning, because `ovp-003` records that a singer who hears his
true name will turn around. The carrier is him, climbing. The finale is the counter-rite: the name is
spoken and the carrier falls to 0.000 Hz.

**Rule.** Sedley is never shown, quoted directly, or described from the inside. He is only ever measured,
reported or sung.

## 3. The company

| Field                      | Canon                                                                      |
| -------------------------- | -------------------------------------------------------------------------- |
| Founded                    | 1971-04-12, Cambridge, as **Paradigms Systems Ltd.**                       |
| Renamed                    | 1984-10-05, to **Global Paradigms Corporation** (`tl-06`)                  |
| Short form in UI and docs  | **Global Paradigms Corp.**                                                 |
| Founders                   | Dr. Arthur Sedley (research) and Dame Eleanor Cross (sovereign agreements) |
| CEO since                  | 2004-09-01, Nigel Ashby (`tl-26`)                                          |
| Headquarters               | Tower Obsidian, London (`st-01`)                                           |
| Tagline                    | `STRATEGIC FORECASTING // CIVIC CONTINUITY // EST. 1971`                   |
| Operating system           | `PARADIGM-OS v8.4.2`                                                       |
| Master repository          | `GPC_POSTOJNA_MASTER` (shown in the sidebar footer)                        |
| Departments                | 10                                                                         |
| Regional stations & arrays | 22                                                                         |
| Programmes                 | 14                                                                         |
| Recalled products          | 8                                                                          |

The ten departments are fixed and their codes are load-bearing (the timeline cites them):

| Code    | Name                                                        | Owns                                           |
| ------- | ----------------------------------------------------------- | ---------------------------------------------- |
| `EGSPU` | Executive Governance & Special Projects Unit                | the board, the founders, the Order's interface |
| `SFPC`  | Department of Strategic Forecasting & Predictive Chronology | the product the company actually sells         |
| `PEFD`  | Psychoacoustics & Environmental Frequency Directorate       | the carrier; Vesper, Chime, Cicada, Vitruvian  |
| `CCDR`  | Division of Civic Continuity & Demographic Resilience       | redoubts, cohorts, Aethelgard                  |
| `SISO`  | Subterranean Infrastructure & Station Operations            | digging, containment, Janitor, Stentor         |
| `BECM`  | Behavioral Economics & Compliance Metrics                   | Hypnos, the metrics that justify everything    |
| `TOPN`  | Tactical Obfuscation & Public Narrative                     | the press office and the story                 |
| `ASIAN` | Atmospheric Sensing & Infrasonic Array Network              | the stations, Monolith, Boreas, Stillwater     |
| `BHRR`  | Bio-Harmonic Reclamation & Remediation                      | Compound 88-T, Morpheus, the medical cover     |
| `AIRS`  | Archive Integrity & Retrospective Scrubbing                 | **Palimpsest** — the scrubbers                 |

Note the frame irony that the archive is authored against: `AIRS` is the department that redacted this
corpus, and the restoration logs (`rst-*`) are written by the people who undid its work in 2026.

## 4. The Order

`ORDO VOCIS PROFUNDAE` — _the Order of the Deep Voice_. The exoteric shell is the corporation; the
esoteric core is the Order, and the corporation's projects are its liturgy (`ovp-003` §II: _"The Company
is the outer court. Its projects are our liturgy; its employees, the congregation who do not know they
pray."_)

| Field        | Canon                                                                            |
| ------------ | -------------------------------------------------------------------------------- |
| Rule         | **Liber Carrier**, written 1972-11-04 — `ovp-003`                                |
| Alphabet     | **Choir Script**, 26 glyphs drawn on the 3×3 Saturn grid                         |
| Reliquary    | **Postojna**, Slovenia (`st-10`), acquired 1998-03-22                            |
| Master sigil | the seven-pointed heptagram in Chaldean order, inlaid in every lobby (`ovp-002`) |
| Week         | begins on the Sun; one planet sung to each day                                   |
| Hiding place | liturgical material, which Palimpsest's scrubbers are forbidden to touch         |

### Degrees

Clearance ranks **are** degrees of initiation. This is the single most load-bearing correspondence in the
fiction: it is why "bureaucracy" is a disguise and why raising clearance feels like initiation.

| Rank | Tier          | Degree          | Planet    | Metal       | Earned by                |
| :--: | ------------- | --------------- | --------- | ----------- | ------------------------ |
|  1   | General       | Neophyte        | Saturn ♄  | Lead        | granted on connection    |
|  2   | Confidential  | Zelator         | Jupiter ♃ | Tin         | Seal I                   |
|  3   | Secret        | Practicus       | Mars ♂    | Iron        | Seal II (+ De-Scrambler) |
|  4   | Top Secret    | Philosophus     | Sun ☉     | Gold        | Seal IV                  |
|  5   | Black Dossier | Magister Umbrae | Mercury ☿ | Quicksilver | Seal VI                  |

Declared in `CANON_DEGREES` (`src/lib/archive/canon.ts`), mirrored in `DEGREES`
(`src/content/puzzles/seals.ts`) and stated in-world at `ovp-003` §IV. `validateCanon()` fails if the
three disagree.

### The Seven Seals

| Seal | Planet  | Glyph | Metal       | Day       | Title                       | Seal-Word   |
| :--: | ------- | :---: | ----------- | --------- | --------------------------- | ----------- |
|  I   | Saturn  |   ♄   | Lead        | Saturday  | The Square of Lead          | `ORDO`      |
|  II  | Jupiter |   ♃   | Tin         | Thursday  | The Wheel of Days           | `ROTA`      |
| III  | Mars    |   ♂   | Iron        | Tuesday   | The Scattered Choir         | `PROFUNDUM` |
|  IV  | Sun     |   ☉   | Gold        | Sunday    | The Three Voices            | `HARMONIA`  |
|  V   | Venus   |   ♀   | Copper      | Friday    | The Redacted Hymn           | `ECHO`      |
|  VI  | Mercury |   ☿   | Quicksilver | Wednesday | The Mercury Wheel           | `UMBRA`     |
| VII  | Moon    |   ☽   | Silver      | Monday    | The Name That Ends The Song | `SILENTIUM` |

Seal-Words are canon and are **not** answers: they are the reward for each seal and they are printed on
the success screen. The answers are the places, numbers and configurations the puzzles ask for, and those
live only in `src/tests/seal-fixtures.ts` and as digests.

The initials of I–VI spell the first six letters of the name spoken at VII. `validateCanon()` proves this
arithmetically, so a future author cannot change one Seal-Word without breaking the build.

### Choir Script

26 glyphs, generated deterministically from seed 1480 (`src/lib/puzzles/choir-script.ts`) so the alphabet
is identical on every build. Seven fragments are hidden on public pages and each teaches two or three
letters; breaking Seal III teaches all of them. Order documents carry marginalia that renders only for
letters the operator already knows. See [generated/CLUE_LEDGER.md](generated/CLUE_LEDGER.md) for the
fragment table and [REVELATION.md](REVELATION.md) for the gating rule.

## 5. People

Principal cast. The full roster — every profile with its department, station, tier, status, hire date and
cross-reference density — is generated: [generated/REGISTRY.md](generated/REGISTRY.md).

| Id      | Name                     | Status      | Canon facts that must not move                                                                                                                                                            |
| ------- | ------------------------ | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p-001` | Dr. Arthur Sedley        | Terminated  | Co-founder 1971-04-12. Struck from the roster under Executive Directive 09, Nov 1989. Last seen Svalbard sub-level 4, 1989-11-04. There is no body. Order-name **Orpheus**.               |
| `p-002` | Dame Eleanor Cross       | Active      | Co-founder. Holder of Master Key 01 (Palimpsest crypt). Has not left the Grimsel complex since 2016. Board business by written minute, twice monthly.                                     |
| `p-003` | Nigel Ashby              | Active      | CEO from 2004-09-01. Signed the 2017 North American Vesper expansion without circulating the modelling.                                                                                   |
| `p-004` | Helena Cross             | Active      | **The Magistra.** Chairs the Seventh Chamber (`ovp-009`). Related to Eleanor; the relationship is deliberately never stated.                                                              |
| `p-009` | Dr. Ewan Thorne          | Missing     | The narrator. PEFD, posted to Station 07 in 2017. Left Longyearbyen 2019-11-04 with 48 GB. Clearance REVOKED. Handle `PalimpsestObserver`. Not armed; "not to be brought back conscious". |
| `p-022` | Julian Thorne            | Terminated  | AIRS. Disavowed 2019. **No relation to Ewan Thorne** — the archive's earlier cross-reference was an indexing error, and that line is canon.                                               |
| `p-041` | Commander Bruce Halloran | Quarantined | Isolation at Yellowknife since Dec 2019. Vocalises continuously at 14.8 Hz with harmonics. No relation to the Thorne family.                                                              |
| `p-045` | David Wren               | Terminated  | SFPC. Disavowed 2024 (per the leak dump).                                                                                                                                                 |

**Naming rules.**

- Surnames are unique across the roster except where a relationship is the point (Sedley, Cross, Ashby,
  Thorne). Two unrelated people may never share a surname.
- `Dr.` / `Dame` / `Commander` / `Agent` are part of the name and are used consistently.
- Thorne narrates in the first person and signs `— E.T.`. He is dry, specific, and never grand. He does
  not know the Order's inner workings; he is an acoustician who read too much.

## 6. Places

Canonical facility names. `validateCanon()` requires a personnel file's `stationName` to begin with the
station's `name`, so these strings are load-bearing.

| Id      | Code         | Canonical name                                              | In-world significance                                |
| ------- | ------------ | ----------------------------------------------------------- | ---------------------------------------------------- |
| `st-01` | `LON-01-HQ`  | Global HQ - Tower Obsidian                                  | London. Vitruvian fitted in the ceiling voids, 2016. |
| `st-04` | `SVA-04-ARR` | Nordic Acoustic Array - Station 07                          | Spitsbergen. Borehole 4, −820 m. The Descent.        |
| `st-06` | `UT-06-CNT`  | Sub-Basin Containment Facility - Site 19                    | Utah. Opened 1979; the Janitor began 1998.           |
| `st-08` | `SWI-08-RED` | European Civic Continuity Bunker - Swiss Alps Redoubt       | Grimsel Pass. Ninety days sealed, 2021.              |
| `st-09` | `DG-09-HYD`  | Indian Ocean Submerged Monitor - Diego Garcia Hydrophone 12 | Heard the 54 Hz sweep in 2001; the 2023 pulse.       |
| `st-10` | `SLO-10-ARC` | Balkan Harmonic Calibration Center - Postojna Caverns       | The reliquary. Master repository.                    |

The other sixteen are scenery with telemetry; they may be named in new records freely as long as the code
and region stay consistent. The full station table — leads, establishment dates, frequency bands and active
projects — is in [generated/REGISTRY.md](generated/REGISTRY.md).

**Two places are not stations** and must not be given one: the Cambridge site of the 1974 baseline
(there is no station there — it is where the company used to be) and the Chapter House where Liber
Carrier is kept, which is never located.

## 7. Programmes

Every programme has a `publicCoverStory` and a `classifiedReality`. The pair is the fiction's basic unit
of irony, and both halves are canon: the cover story is not a lie the author forgot to delete, it is what
a client is told.

| Code              | Name               | Dept  | Since | Tier |
| ----------------- | ------------------ | ----- | ----: | :--: |
| `PROG-BOREAS`     | Project Boreas     | ASIAN |  1986 |  4   |
| `PROG-VESPER`     | Project Vesper     | PEFD  |  1989 |  4   |
| `PROG-HYPNOS`     | Project Hypnos     | BECM  |  2002 |  4   |
| `PROG-CHIME`      | Project Chime      | PEFD  |  2006 |  3   |
| `PROG-PALIMPSEST` | Project Palimpsest | AIRS  |  1994 |  5   |
| `PROG-JANITOR`    | Project Janitor    | SISO  |  1998 |  4   |
| `PROG-ECHO-STATE` | Project Echo-State | SFPC  |  2015 |  4   |
| `PROG-STENTOR`    | Project Stentor    | SISO  |  1991 |  4   |
| `PROG-CICADA`     | Project Cicada     | PEFD  |  2012 |  3   |
| `PROG-AETHELGARD` | Project Aethelgard | CCDR  |  1984 |  5   |
| `PROG-STILLWATER` | Project Stillwater | ASIAN |  2009 |  4   |
| `PROG-MORPHEUS`   | Project Morpheus   | BHRR  |  2014 |  4   |
| `PROG-VITRUVIAN`  | Project Vitruvian  | PEFD  |  2016 |  3   |
| `PROG-MONOLITH`   | Project Monolith   | ASIAN |  2001 |  5   |

Three are **Covert Active** — Palimpsest, Aethelgard, Monolith — and those three are the Order's work
rather than the company's. Every other programme is the company's work, which the Order happens to use.

**Rule.** A new programme must state who benefits and what it costs. If it only adds menace it is
scenery and should be a station incident or a timeline entry instead.

## 8. Products

Eight recalled products (`/products`). Each is a domestic object that did something to people, and each
has a recall year that a timeline entry and usually a casualty audit agree with.

| Product                        | Recalled | Anchor                                                 |
| ------------------------------ | -------: | ------------------------------------------------------ |
| Reson-8 sleep unit             |     1994 | `tl-16`, `doc-010` — the event that created Palimpsest |
| VeriPulse stress band          |     2008 | `tl-31`                                                |
| ParaCalm nursery unit          |     2002 | `tl-24`, `doc-014`                                     |
| VesperTone HVAC module         |     2011 | `tl-34`                                                |
| Omniscan Mk IV traffic monitor |     2015 | `tl-41`                                                |
| Civic Continuity unit 300      |     2018 | —                                                      |
| EchoShield boardroom scrambler |     2021 | —                                                      |
| ChronoForecast terminal        |     2023 | `tl-49`                                                |

**Rule.** No new product may be recalled in a year that has no timeline entry, and none may be described
as a hoax. The products genuinely did what they advertised. That is the horror.

## 9. The frame story

The archive is a **recovery**, not a leak. Six restoration logs (`rst-001…rst-006`, Aug–Sep 2026) record
an unnamed operator mounting `VAULT0` from an "Obsidian Proxy mirror", rebuilding records from index
stubs, repairing personnel cross-references, quarantining a Palimpsest beacon capture, and confirming
six outbound URLs dead.

The frame is what licenses the whole conceit: dead links are dead, some cross-references point at records
that were never recovered (87 of them, listed as validator warnings on purpose), and some documents are
`partial` or `corrupted`. Those gaps are authored, not bugs.

**Rule.** The restorer is never named, never characterised and never speculates. `editorialNote` is
author-only and never renders; the restoration logs are the only in-world commentary permitted.

## 10. Terminology register

Canonical spellings, enforced by `CANON_TERMS` in `src/lib/archive/canon.ts`. A banned variant fails the
build.

| Canonical                                             | Never                                        |
| ----------------------------------------------------- | -------------------------------------------- |
| Global Paradigms Corp. / Global Paradigms Corporation | Global Paradigm Corp, Global Paradigms Corps |
| Ordo Vocis Profundae                                  | Ordo Vocis Profunda, Ordo Vocis Profundum    |
| Project Palimpsest                                    | Palimpset                                    |
| Postojna                                              | Postojnia, Postoina                          |
| Svalbard                                              | Svalbaard                                    |
| Thorne                                                | Thorn                                        |
| Sedley                                                | Sedly, Sedlay                                |
| Aethelgard                                            | Ethelgard, Aethelguard                       |
| Choir Script                                          | ChoirScript                                  |
| Orpheus                                               | Orpheous                                     |

Style-level preferences that are _not_ machine-enforced live in
[CONTENT_STYLE_GUIDE.md](CONTENT_STYLE_GUIDE.md) — notably that `14.8Hz` (public copy) and `14.802 Hz`
(telemetry) are both correct in their registers.

## 11. What is deliberately not fixed

Leaving these open is a decision, not an omission. Do not close them without a drift-log entry.

- **What the Voice wants.** Never stated. Only what it does.
- **Helena Cross's relationship to Eleanor.** Implied, never given.
- **Where the Chapter House is.** Never located.
- **What page 9 of the Cambridge baseline says.** `tl-02` states the page is not in the archive. It must
  stay missing.
- **Whether Thorne survives.** He is `Missing`, not dead.
- **The identity of the restorer.** Anonymous by design.
- **Anything after 2026-01-10** except the restoration logs (Aug–Sep 2026) and the predicted crossing of
  2026-11-04, which is a forecast inside the fiction.

## 12. Extending canon

1. Decide whether the new fact is **load-bearing** (two or more records depend on it, or a puzzle answer
   does). If it is not, write it into the record and stop — do not touch this file.
2. If it is load-bearing, add it to `src/lib/archive/canon.ts`: a constant, a `CANON_SPINE` event with
   typed evidence, or a `CANON_TERMS` rule.
3. State the invariant in `CANON_INVARIANTS` with a stable id, and check it in `validate-canon.ts`.
4. Record the change in the drift log at [CONTINUITY.md](CONTINUITY.md) §4 with the reason.
5. Run `npm run validate:canon && npm run archive:report`. The generated appendices will pick the new
   fact up; if they do not, the generator needs a row, not a hand edit.

Related: [CHRONOLOGY.md](CHRONOLOGY.md) · [CONTINUITY.md](CONTINUITY.md) ·
[REVELATION.md](REVELATION.md) · [CLUE_LEDGER.md](CLUE_LEDGER.md) ·
[CONTENT_STYLE_GUIDE.md](CONTENT_STYLE_GUIDE.md)
