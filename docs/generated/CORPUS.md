<!-- GENERATED FILE — DO NOT EDIT. -->
<!-- Regenerate with: npm run archive:report   Verify with: npm run archive:report:check -->

# Corpus ledger

Measured from the live collections. This is the authoritative count of the archive: the sidebar
badges, `README.md` and every other document quote these numbers, and `archive:report:check`
fails CI if they disagree.

## Totals

| Measure | Value |
| --- | ---: |
| Records | 412 |
| Record kinds | 17 |
| In-world date span | 1971 – 2026 |
| Narrative characters (summaries + bodies) | 244,923 |
| Puzzle definitions | 11 |
| Terminal commands listed by `help` | 23 |
| Choir Script glyphs | 26 |

## Records by kind

| Kind | Records | Id range | Code prefixes | Source |
| --- | ---: | --- | --- | --- |
| `document` — Documents | 174 | `doc-001` … `ovp-009` | `BEHAV-…` · `BIO-…` · `DOC-…` · `ENG-…` · `INC-…` · `LEGAL-…` · `MEMO-…` · `OCEAN-…` · `POLAR-…` · `PR-…` · `REP-…` · `SEC-…` · `SPEC-…` · `SYS-…` | `src/content/documents/` |
| `personnel` — Personnel | 45 | `p-001` … `p-045` | `GPC-…` | `src/content/personnel/personnel.ts` |
| `office` — Offices & stations | 22 | `st-01` … `st-22` | `AUS-…` · `AZO-…` · `CAY-…` · `CHI-…` · `DG-…` · `JEJ-…` · `KEN-…` · `KGL-…` · `LON-…` · `NV-…` · `PAT-…` · `SIB-…` · `SLO-…` · `SVA-…` · `SWE-…` · `SWI-…` · `TDC-…` · `TYO-…` · `UT-…` · `VA-…` · `WV-…` · `YK-…` | `src/content/offices/stations.ts` |
| `project` — Projects | 14 | `prog-01` … `prog-14` | `PROG-…` | `src/content/projects/programs.ts` |
| `department` — Departments | 10 | `dept-airs` … `dept-topn` | — | `src/content/departments/departments.ts` |
| `product` — Recalled products | 8 | `prod-01` … `prod-08` | `GPC-…` | `src/content/corporate/discontinued-products.ts` |
| `audio` — Audio artifacts | 6 | `audio-01` … `audio-06` | `ART-…` | `src/content/audio/audio-artifacts.ts` |
| `email` — Email threads | 14 | `eml-01` … `eml-14` | `EML-…` | `src/content/communications/emails.ts` |
| `meeting` — Meeting minutes | 10 | `meet-01` … `meet-10` | `MIN-…` | `src/content/communications/meetings.ts` |
| `press` — Press releases | 16 | `pr-01` … `pr-16` | `PR-…` | `src/content/communications/press-releases.ts` |
| `timeline` — Timeline entries | 52 | `tl-01` … `tl-52` | — | `src/content/history/timeline.ts` |
| `newsletter` — Newsletters | 6 | `news-01` … `news-06` | `VOL-…` | `src/content/communications/newsletters.ts` |
| `training` — Training modules | 4 | `train-01` … `train-04` | `MOD-…` | `src/content/corporate/training-modules.ts` |
| `job` — Job postings | 12 | `job-01` … `job-12` | `REQ-…` | `src/content/corporate/job-postings.ts` |
| `dead-link` — Dead links | 7 | `dead-01` … `dead-07` | — | `src/content/web/dead-links.ts` |
| `annual-report` — Annual reports | 6 | `ar-1986` … `ar-2025` | `AR-…` | `src/content/corporate/annual-reports.ts` |
| `restoration-log` — Restoration logs | 6 | `rst-001` … `rst-006` | `RST-…` | `src/content/restoration/restoration-logs.ts` |

Id prefixes are stable and never reused. `documents` spans three id spaces — `doc-001…doc-025` (hand-authored core), `doc-026…doc-165` (templated catalogue) and `ovp-001…ovp-009` (the Order's own evidence files) — which is why its id range reads `doc-001 … ovp-009`.

## Directive 17 — records the live index refuses

The totals above count what the live index holds. Under Executive Directive 17 (standing, 1989-11-04 05:14 UTC) some records are not deleted but **struck**: they survive in one copy only, as scrambled shards on the Postojna spool vaults, and are recovered through the tape-salvage mechanic (`src/lib/puzzles/salvage.ts`). They are deliberately absent from the counts above and deliberately present in the unresolved-reference warnings — that overlap is the hook.

| Measure | Value |
| --- | ---: |
| Standing order | `DIR-1989-DIRECTIVE-17` |
| Purged records (ghosts) | 3 |
| Shards across all ghosts | 20 |

| Ghost | Code the index refuses | Original | Struck on | Cited by | Shards |
| --- | --- | --- | --- | --- | ---: |
| `ghost-001` | `MEMO-1989-EXEC-TERMINATION` | 1989-11-04 | 1990-02-11 | `p-001` | 7 |
| `ghost-002` | `INC-2019-SVALBARD-STATION07` | 2019-11-04 | 2019-11-20 | `p-009` | 7 |
| `ghost-003` | `DOC-2019-COHORT-ALPHA` | 2019-06-30 | 2025-03-02 | `p-010` | 6 |

Each ghost code is also cited by the personnel dossier listed above, which is how the mechanic is found: the dossier points at a document the index cannot produce. `INV-TAPE-01…04` keep the two sides in step — a ghost that starts resolving in the live index is a canon error, not a fix.

## Clearance distribution

| Tier | Records | Share |
| --- | ---: | ---: |
| Level 1 // General Corporate | 66 | 16.0% |
| Level 2 // Confidential Operational | 44 | 10.7% |
| Level 3 // Secret Directorate | 82 | 19.9% |
| Level 4 // Top Secret / NOFORN | 100 | 24.3% |
| Level 5 // Black Dossier / Sanitized | 63 | 15.3% |
| _no classification_ | 57 | 13.8% |

_No classification_ covers kinds that are not clearance-gated (products, job postings, dead links,
newsletters, training modules, restoration logs, departments, timeline entries whose classification
is narrative rather than a gate).

## Sidebar sections

| Route | Label | Badge |
| --- | --- | --- |
| `/sanctum` | The Seven Seals | 7 |
| `/legacy` | The Legacy File | 2006→2026 |
| `/` | Command Dashboard | SYS 8.4 |
| `/documents` | Master Document Vault | 174 |
| `/personnel` | Personnel Directory | 45 |
| `/stations` | Regional Stations & Arrays | 22 |
| `/programs` | Project Dossiers | 14 |
| `/departments` | Department Charters | 10 Depts |
| `/products` | Recalled Products Archive | 8 |
| `/audio` | Acoustic Artifacts & Synth | 6 Feeds |
| `/tools` | Sub-Audible Software Tools | 4 Tools |
| `/reports` | Annual Strategic Disclosures | 6 Years |
| `/communications` | Emails & Meeting Minutes | 24 Records |
| `/timeline` | Historical Timeline (1971-2026) | 52 Events |
| `/newsletters` | Internal Staff Newsletters | 6 Issues |
| `/training` | Employee Training Modules | 4 Modules |
| `/careers` | Classified Job Postings | 12 Open |
| `/values` | 5 Pillars of Certainty | Doctrine |
| `/deadlinks` | Dead Links & Wayback Mirrors | 7 Broken |

## Legacy redirects

| From | To |
| --- | --- |
| `/dashboard` | `/` |
| `/index.html` | `/` |
| `/dead-links` | `/deadlinks` |
| `/stations-map` | `/stations` |
| `/projects` | `/programs` |
| `/offices` | `/stations` |

Edge redirects live in `vercel.json` and `public/_redirects`; the in-app half is pinned by `routes.test.tsx`.
