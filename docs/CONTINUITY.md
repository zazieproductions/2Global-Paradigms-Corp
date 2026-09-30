# Continuity

The register of what must stay true, what checks it, and what has already drifted. This is the document
to read before editing an existing record rather than adding a new one.

- **[CANON.md](CANON.md)** says what is true.
- **This file** says how it is kept true, and records every deliberate change.
- **[CHRONOLOGY.md](CHRONOLOGY.md)** is the time axis. **[REVELATION.md](REVELATION.md)** is the
  knowledge axis. **[CLUE_LEDGER.md](CLUE_LEDGER.md)** is the dependency axis.

## 1. The continuity contract

Four statements, in order of how often they are broken:

1. **A fact stated twice must be stated identically.** Not paraphrased — identically, for anything a
   validator or a puzzle reads: names, codes, frequencies, dates, degree names, seal words.
2. **A fact stated at two clearances may disagree in meaning but never in value.** Palimpsest changes
   _interpretation_, not arithmetic. A Level 1 press release may call the Oakhaven trial a "municipal
   wellness pilot"; it may not give a different date for it.
3. **Nothing may be revealed before the gate that reveals it.** See [REVELATION.md](REVELATION.md).
4. **A gap is authored or it is a bug.** Every unresolved reference, dead link and missing page is
   deliberate and is listed in §3.

## 2. Invariants

Declared as data in `CANON_INVARIANTS` (`src/lib/archive/canon.ts`) so the generated ledger and the
drift log can cite them by id. `enforcedBy` names the mechanism; `convention` means a human or an agent
must hold the line and CI will not.

| Id              | Invariant                                                                             | Enforced by        |
| --------------- | ------------------------------------------------------------------------------------- | ------------------ |
| `INV-CHRON-01`  | Every in-world date falls between 1971 and 2026 inclusive                             | `validate-canon`   |
| `INV-CHRON-02`  | A timeline entry's `year` equals the year of its `dateString`                         | `validate-canon`   |
| `INV-CHRON-03`  | A timeline entry's `era` range contains its `year`                                    | `validate-canon`   |
| `INV-CHRON-04`  | The timeline is sorted ascending and has no duplicate ids                             | `validate-canon`   |
| `INV-SPINE-01`  | Every spine event has evidence, and all of it resolves                                | `validate-canon`   |
| `INV-SPINE-02`  | Every dated piece of spine evidence carries the spine event's date                    | `validate-canon`   |
| `INV-ENTITY-01` | A personnel file's department/station names match the records its ids point at        | `validate-canon`   |
| `INV-ENTITY-02` | A station's `leadPersonnelName` names the person its `leadPersonnelId` resolves to    | `validate-canon`   |
| `INV-ENTITY-03` | A document's `departmentName` matches its `departmentId`                              | `validate-canon`   |
| `INV-ENTITY-04` | Department, station, program and audio codes are unique and correctly prefixed        | `validate-canon`   |
| `INV-TERM-01`   | No banned spelling variant of a canonical proper noun ships                           | `validate-canon`   |
| `INV-TERM-02`   | Every command `help` lists is implemented in the terminal component                   | tests              |
| `INV-TERM-03`   | Every documented alias is implemented, and none is listed by `help`                   | tests              |
| `INV-SEAL-01`   | Seven seals, in planetary order, with distinct Seal-Words                             | `validate-canon`   |
| `INV-SEAL-02`   | Seal-Words I–VI initial to the first six letters of the name Seal VII reveals         | `validate-canon`   |
| `INV-SEAL-03`   | Clearance rewards ascend monotonically across the seals                               | `validate-canon`   |
| `INV-SEAL-04`   | `EARNED_BY`, `SEAL_FOR_RANK` and `DEGREES` agree with `SEALS` and the canon           | `validate-canon`   |
| `INV-CHOIR-01`  | The seven fragments teach every letter the inscription needs                          | `validate-canon`   |
| `INV-CHOIR-02`  | Each fragment hides on the tab it names; no tab hosts two                             | `validate-canon`   |
| `INV-REF-01`    | Every record code printed by the terminal resolves to a real record                   | `validate-canon`   |
| `INV-REF-02`    | A document code is never used to cite an audio artifact                               | `validate-canon`   |
| `INV-GATE-01`   | Gateway steps chain in order and grant no clearance                                   | `validate-canon`   |
| `INV-REV-01`    | No puzzle clue points at a missing record or route                                    | `validate-content` |
| `INV-REV-02`    | Hidden words are stripped before render, export, clipboard and index                  | tests              |
| `INV-REV-03`    | Order material is tagged `Order` and is never Level 1                                 | tests              |
| `INV-REV-04`    | Plaintext answers appear only in tier-3 hints, success/journal text and test fixtures | **convention**     |
| `INV-REC-01`    | Record ids are never reused or renamed; codes are separate from ids                   | **convention**     |
| `INV-REC-02`    | Every audio artifact ships a transcript and a plain-language description              | `validate-content` |
| `INV-COUNT-01`  | The declared structural counts match the live collections                             | `validate-canon`   |

Adding an invariant: add the row to `CANON_INVARIANTS` first, then the check. A check with no invariant
row is invisible to the generated ledger; an invariant row with no check is a promise nobody keeps.

### What "convention" means in practice

The three convention rows are the ones an AI agent is most likely to break, because nothing fails:

- **`INV-REV-04`** — do not put an answer anywhere new. Tier-3 hints, success bodies and journal lines
  already contain answers because the assisted route requires them; that is the ceiling, not a
  starting point. See [REVELATION.md](REVELATION.md) §6.
- **`INV-REC-01`** — never renumber. `doc-026` stays `doc-026` even if a record is deleted; the id is in
  URLs, saves and cross-references.
- Everything in `CANON_TERMS` **is** checked, so prefer adding a rule there over relying on vigilance.

## 3. Authored gaps

Deliberate absences. Do not "fix" these.

| Gap                                | Scale                                                         | Why                                                                                               |
| ---------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Unresolved `linkedDocuments` codes | the warnings `npm run validate:content` prints — currently 77 | Records that were never recovered. They render in-world as "not recovered" on the personnel page. |
| Dead outbound URLs                 | 7 (`/deadlinks`)                                              | The archive is a recovery; the web it points at is gone. Never rendered as clickable links.       |
| Page 9 of the Cambridge baseline   | 1                                                             | `tl-02` states it is not in the archive. It must never be written.                                |
| `partial` / `corrupted` records    | varies by `contentStatus`                                     | Recovery is incomplete by design.                                                                 |
| The frame restorer's identity      | 1                                                             | Anonymous. The restoration logs are the only in-world commentary permitted.                       |
| The Chapter House's location       | 1                                                             | Never located (`ovp-003`).                                                                        |

The warning count is a monitored number: `npm run validate:content` prints it, and a large _drop_ usually
means someone added records to paper over a gap. A drop of exactly the number you intended to fix is
correct; anything else is a signal to look.

Every warning the content validator emits is now of this one kind, and that is **pinned by a test**:
`content-integrity.test.ts` fails if any warning does not match `linked document <CODE> not recovered`, and
also fails if the count reaches zero. The property is enforced, not merely asserted here.

It became enforceable on 2026-09-30, when `DOC_CODE` was widened so that correctly-formed `TRANSIT-…` codes
stopped being reported as malformed (see the drift log). Before that the warning count mixed two unrelated
problems and could not carry meaning. Now a warning of any _other_ shape is new information about a defect —
or a new deliberate gap that must be ruled on in this section before the test is widened.

## 4. Drift log

Every deliberate change to a load-bearing fact, newest first. Format:

`date · id(s) affected · what changed · why · what was re-verified`

| Date       | Records                                                       | Change                                                                                                                                                                                                                                                       | Reason                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-09-30 | `terminal-text.ts` (`TERMINAL_LEAK_DUMP`)                     | Printed code `AUDIO-01-SVALBARD` → `ART-01-SVALBARD`, and the line now says the entry is an audio artifact (`play 1`) rather than implying `cat` will open it                                                                                                | `ART-01-SVALBARD` is the artifact's real accession code; `AUDIO-01-SVALBARD` resolved to nothing, so the terminal was advertising a command that could only fail. Found by `INV-REF-01`.                                                                                                                                                                                                                                                                                       |
| 2026-09-30 | `p-007`, `p-009`, `p-018`, `p-025`, `p-029`, `p-033`, `p-041` | Seven `linkedDocuments` entries citing audio artifacts (`AUDIO-01-SVALBARD-INFRASOUND`, `AUDIO-02-VESPER-TAPE`, `AUDIO-03-DIEGO-GARCIA-HYDROPHONE`, `AUDIO-05-BLACK-RIDGE-SEISMIC`) replaced with typed `links: [{ to: { kind: 'audio', id: 'audio-0N' } }]` | `linkedDocuments` is a document-code field; the cross-references were unreadable to the normaliser and counted as unrecovered documents. Moving them to the typed link model makes them resolve, appear in related-record panels, and be validated. `validate:content` warnings 94 → 87 at the time. Found by `INV-REF-02`.                                                                                                                                                    |
| 2026-09-30 | `DOC_CODE` in `src/lib/archive/validate-content.ts`           | Document-code pattern `^[A-Z]{2,5}-…` → `^[A-Z]{2,7}-…`                                                                                                                                                                                                      | `generated-records.ts` legitimately builds codes with the prefix `TRANSIT` (7 letters), alongside `OCEAN`, `POLAR`, `LEGAL` and `BEHAV`. Ten records were reported as having a "non-standard code" when they were correctly formed, so the validator was warning about its own authored content and the 87-warning figure mixed two unrelated problems. Widening the bound makes every remaining warning an unresolved reference. Warnings 87 → 77; 0 errors before and after. |
| 2026-09-30 | `p-025`                                                       | `stationName` "Indian Ocean Submerged Monitor - Diego Garcia Trench Hydrophone 12" → "…Diego Garcia Hydrophone 12"                                                                                                                                           | Did not name `st-09`. The region field already carries "Diego Garcia Trench"; the facility name is the load-bearing string. Found by `INV-ENTITY-01`.                                                                                                                                                                                                                                                                                                                          |

No canon fact (date, frequency, name, degree, Seal-Word) has been changed. All three entries above are
corrections of a record to match canon, not changes to canon.

## 5. Where drift actually comes from

Ranked by how often it has occurred in this corpus, with the defence for each:

| Source                                       | Example                                 | Defence                                                                     |
| -------------------------------------------- | --------------------------------------- | --------------------------------------------------------------------------- |
| A code invented in prose                     | `AUDIO-01-SVALBARD` in the leak dump    | `INV-REF-01` / `INV-REF-02`                                                 |
| A name re-derived from memory                | "Diego Garcia **Trench** Hydrophone 12" | `INV-ENTITY-01/02/03`                                                       |
| A spelling that looks right                  | `Ethelgard`, `Profunda`                 | `CANON_TERMS`                                                               |
| A count quoted in prose going stale          | "85 tests in 8 files" in the README     | derived tables in `docs/generated/`; see §6                                 |
| A clue pointing at a record that was renamed | —                                       | `INV-REV-01`, plus the resolved-pointer table in `generated/CLUE_LEDGER.md` |
| A reward granted by the wrong puzzle         | —                                       | `INV-SEAL-03`, `INV-GATE-01`                                                |
| An answer copied into a new hint             | —                                       | **convention** — `INV-REV-04`, review only                                  |

## 6. Numbers in prose

Any number written in a hand-written document goes stale. The rule:

- **Measured numbers** (record counts, kind counts, corpus size, test counts, chunk sizes) must either be
  quoted from a generated table with a pointer, or be regenerated. Never retype them.
  `docs/generated/CORPUS.md` is the authoritative source for corpus figures.
- **Declared numbers** (seven seals, five tiers, ten departments) are canon and belong in `CANON_COUNTS`,
  where `INV-COUNT-01` checks them against the collections.

If you find yourself typing "412 records" into prose, link
[generated/CORPUS.md](generated/CORPUS.md) instead.

## 7. Review checklist

Before committing a content change:

- [ ] `npm run validate:canon` — 0 errors
- [ ] `npm run validate:content` — 0 errors; warning count changed only by the number you intended
- [ ] `npm run archive:report` then `git diff docs/generated` — read the diff; it is the real changelog
- [ ] `npm test` — full suite
- [ ] If a date, name, code or frequency moved: a row in §4 with the reason
- [ ] If a new load-bearing fact appeared: a `CANON_SPINE` entry or constant, plus an invariant
- [ ] If a record was gated differently: the row in `generated/KNOWLEDGE_MATRIX.md` still makes sense
- [ ] No answer text added outside tier-3 hints, success bodies, journal lines or `seal-fixtures.ts`

Related: [CONTRIBUTING.md](CONTRIBUTING.md) for the workflow · [REVELATION.md](REVELATION.md) for gating
· [CLUE_LEDGER.md](CLUE_LEDGER.md) for puzzle dependencies
