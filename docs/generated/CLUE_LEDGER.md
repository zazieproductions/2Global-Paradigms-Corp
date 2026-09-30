<!-- GENERATED FILE — DO NOT EDIT. -->
<!-- Regenerate with: npm run archive:report   Verify with: npm run archive:report:check -->

# Clue ledger (derived)

Every clue, requirement and reward in the puzzle system, with the record or route it resolves to.
Read this before moving, renaming or gating anything: if a row here changes, a player-facing
path changes with it. Narrative reading of the same data is in [`../CLUE_LEDGER.md`](../CLUE_LEDGER.md).

## Seal ladder

| Seal | Planet | Glyph | Metal | Day | Widget surface | Requires | Grants |
| --- | --- | :--: | --- | --- | --- | --- | --- |
| I | Saturn | ♄ | Lead | Saturday | `sanctum` | — | L2 |
| II | Jupiter | ♃ | Tin | Thursday | `sanctum` | `seal-1` | L3 |
| III | Mars | ♂ | Iron | Tuesday | `sanctum` | `seal-2` | — |
| IV | Sun | ☉ | Gold | Sunday | `sanctum` | `seal-3` | L4 |
| V | Venus | ♀ | Copper | Friday | `document-viewer` | `seal-4` | — |
| VI | Mercury | ☿ | Quicksilver | Wednesday | `palimpsest-safe` | `seal-5` | L5 + unredact + download `palimpsest-master-dump` |
| VII | Moon | ☽ | Silver | Monday | `sanctum` | `seal-6` | — |

## Clues

| Puzzle | Clue id | Pointer text | Location type | Resolves to |
| --- | --- | --- | --- | --- |
| `seal-1` | `seal-1-clue-1` | Company Charter (Level 5 — sealed to you for now) | record | `document:doc-001` |
| `seal-1` | `seal-1-clue-2` | Historical Timeline | route | `/timeline` |
| `seal-2` | `seal-2-clue-1` | Programme dossiers — check the cover names | route | `/programs` |
| `seal-3` | `seal-3-clue-1` | Regional Stations — Station 07 | route | `/stations` |
| `seal-3` | `seal-3-clue-2` | The 1989 Svalbard Event | record | `document:doc-007` |
| `seal-4` | `seal-4-clue-1` | Programme dossiers | route | `/programs` |
| `seal-4` | `seal-4-clue-2` | Acoustic artefacts — hear the tones yourself | route | `/audio` |
| `seal-5` | `seal-5-clue-1` | Open the Hymnal | record | `document:ovp-006` |
| `seal-5` | `seal-5-clue-2` | Master Document Vault | route | `/documents` |
| `seal-6` | `seal-6-clue-1` | Project Vesper dossier | route | `/programs` |
| `seal-6` | `seal-6-clue-2` | Dead Links & Wayback Mirrors — the courier drop | route | `/deadlinks` |
| `seal-7` | `seal-7-clue-1` | The Descent of Orpheus (Level 5) | record | `document:ovp-008` |
| `seal-7` | `seal-7-clue-2` | Minutes of the Seventh Chamber (Level 5) | record | `document:ovp-009` |
| `gateway-sequence` | `gateway-rungs` | Every rung still wears its installation year (1971–1976). | ui | UI · Gateway Transmission — mausoleum marquee |
| `gateway-signal` | `gateway-voices` | Each device remembers only its own place in the queue. | ui | UI · Gateway Transmission — voice logs |
| `gateway-waveform` | `gateway-lattice` | Live rows have exactly one carrier pulse (+). | ui | UI · Gateway Transmission — carrier lattice |
| `gateway-transmission` | — | _no clues: re-asks keys already held_ | — | — |

## Seal pointers (narrative layer)

`seals.ts` authors pointers as tabs or document codes; `definitions.ts` resolves them to clues.
A pointer that does not resolve degrades to a plain UI label — which is how drift hides.

| Seal | Label | Tab / doc code | Resolved |
| --- | --- | --- | --- |
| I | Company Charter (Level 5 — sealed to you for now) | `DOC-1971-FOUNDING` | `document:doc-001` |
| I | Historical Timeline | `timeline` | `/timeline` |
| II | Programme dossiers — check the cover names | `programs` | `/programs` |
| III | Regional Stations — Station 07 | `stations` | `/stations` |
| III | The 1989 Svalbard Event | `DOC-1989-SVALBARD-EVENT` | `document:doc-007` |
| IV | Programme dossiers | `programs` | `/programs` |
| IV | Acoustic artefacts — hear the tones yourself | `audio` | `/audio` |
| V | Open the Hymnal | `DOC-1987-HYMNAL-OVP` | `document:ovp-006` |
| V | Master Document Vault | `documents` | `/documents` |
| VI | Project Vesper dossier | `programs` | `/programs` |
| VI | Dead Links & Wayback Mirrors — the courier drop | `deadlinks` | `/deadlinks` |
| VII | The Descent of Orpheus (Level 5) | `DOC-1989-DESCENT-ORPHEUS` | `document:ovp-008` |
| VII | Minutes of the Seventh Chamber (Level 5) | `DOC-2025-SEVENTH-CHAMBER` | `document:ovp-009` |

## Hints

| Puzzle | Tier 1 | Tier 2 | Tier 3 | Reveals answer |
| --- | --- | --- | --- | :--: |
| `seal-1` | ASK THORNE | ASK AGAIN | TELL ME | ● |
| `seal-2` | ASK THORNE | ASK AGAIN | TELL ME | ● |
| `seal-3` | ASK THORNE | ASK AGAIN | TELL ME | ● |
| `seal-4` | ASK THORNE | ASK AGAIN | TELL ME | ● |
| `seal-5` | ASK THORNE | ASK AGAIN | TELL ME | ● |
| `seal-6` | ASK THORNE | ASK AGAIN | TELL ME | ● |
| `seal-7` | ASK THORNE | ASK AGAIN | TELL ME | ● |
| `gateway-sequence` | FIELD NOTES | — | REVEAL | ● |
| `gateway-signal` | FIELD NOTES | — | REVEAL | ● |
| `gateway-waveform` | FIELD NOTES | — | REVEAL | ● |
| `gateway-transmission` | REMIND ME | — | — |  |

Tier 3 is the assisted route. Opening it before a correct answer marks the completion ASSISTED; every reward is still granted.

## Rewards

| Puzzle | Rewards |
| --- | --- |
| `seal-1` | clearance → Level 2 - Confidential |
| `seal-2` | clearance → Level 3 - Secret |
| `seal-3` | _none_ |
| `seal-4` | clearance → Level 4 - Top Secret |
| `seal-5` | _none_ |
| `seal-6` | clearance → Level 5 - Black Dossier; unredact; download `palimpsest-master-dump` |
| `seal-7` | _none_ |
| `gateway-sequence` | _none_ |
| `gateway-signal` | _none_ |
| `gateway-waveform` | _none_ |
| `gateway-transmission` | _none_ |

## Choir Script fragments

| Fragment | Tab | Letters | Riddle |
| --- | --- | --- | --- |
| `frag-news` | `/newsletters` | T H | Where the staff gossip, the Order signs its name. |
| `frag-careers` | `/careers` | E C | Among the positions no sane person should apply for. |
| `frag-timeline` | `/timeline` | O I | Where history is kept in order — and rewritten. |
| `frag-values` | `/values` | R S | Beneath the five pillars that hold up the lie. |
| `frag-products` | `/products` | N G | Among the things they buried in salt. |
| `frag-reports` | `/reports` | B A | In the ledgers they show the shareholders. |
| `frag-deadlinks` | `/deadlinks` | V L D | Where dead pages still whisper. |

Letters taught: **A B C D E G H I L N O R S T V** (15 of 26). Seal III teaches the remainder.
