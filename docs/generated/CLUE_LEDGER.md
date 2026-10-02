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

## Terminal surface

The terminal (`~`) is a puzzle surface in its own right. `help` lists the documented commands;
the aliases below are undocumented on purpose and exist only to react in-fiction to the wrong move.

| Command | Documented | Purpose |
| --- | :--: | --- |
| `help` | yes | Display command manual |
| `clear` | yes | Clear terminal screen |
| `whoami` | yes | Identity, clearance & degree |
| `clearance <1-5>` | yes | Switch to an earned clearance |
| `ls docs [n]` | yes | List indexed documents (page n) |
| `cat <doc_code>` | yes | Print a document you are cleared for |
| `scan` | yes | Run planetary 14.8Hz harmonic scan |
| `decrypt` | yes | Toggle Redaction De-Scrambler (L3+) |
| `play <1-6>` | yes | Play audio artifact preset |
| `stop` | yes | Stop all active audio streams |
| `leak-dump` | yes | Thorne's exfiltration directory |
| `status` | yes | Field stations & telemetry state |
| `hint [confirm]` | yes | Ask Thorne about the active seal |
| `progress` | yes | Show investigation progress |
| `directives` | Order | Thorne's field directives & the step you are on |
| `intel [n]` | Order | Read the FIELD INTEL you have recovered |
| `seals` | Order | Progress of the Seven Seals |
| `codex` | Order | Your Choir Script key |
| `gematria <text>` | Order | Ordinal letter-sum (A=1…Z=26) |
| `wheel <keyword>` | Order | Turn the Mercury Wheel on Thorne's courier line |
| `commune` | Order | Place your hand on the planchette |
| `invoke <name>` | Order | Speak a name into the carrier |
| `exit` | yes | Close terminal backdoor |
| `override` | — | Rejects a master key. Master Key 01 was revoked 1989-11-04 05:14 UTC. |
| `unredact` | — | Alias of `decrypt`. |
| `ordo` | — | Prints the Order's name and Liber Carrier §I. |
| `vox` | — | Alias of `ordo`. |

`ORDO VOCIS PROFUNDAE` is quoted verbatim from `ovp-003` §I by `ordo`/`vox`, which is the one place
the Order states itself in the player's face before Seal I.

### The planchette (`commune`)

One line per active seal, indexed by `currentSeal − 1`; the last plays after the finale. It never
names an answer, which is what keeps it on the right side of the spoiler ceiling.

| Active seal | Line |
| --- | --- |
| Seal I — The Square of Lead | THE SQUARE IS OLDER THAN THE COMPANY |
| Seal II — The Wheel of Days | WALK THE STAR FROM THE SUN |
| Seal III — The Scattered Choir | THE PUBLIC FACE IS SIGNED IN RED |
| Seal IV — The Three Voices | EARTH EVENING CHILD |
| Seal V — The Redacted Hymn | READ THE HEAD OF EVERY VERSE |
| Seal VI — The Mercury Wheel | THE WHEEL WANTS THE NAME OF THE CAVES |
| Seal VII — The Name That Ends The Song | O R P H E U  WHO |
| _after the finale_ | THANK YOU |

### Gematria annotations (`gematria <text>`)

Ordinal letter-sums the terminal will comment on. Each is a nudge, not an answer.

| Sum | Note |
| ---: | --- |
| 15 | Saturn's constant. The Square completes at fifteen. |
| 45 | The sum of the Square of Saturn (1 through 9). |
| 53 | CHOIR. |
| 102 | The name that must not be spoken in the Voice’s hearing. |
| 148 | The carrier, written without its point. |
| 432 | The evening voice. |
| 741 | The child’s voice. |

### Revoked codes

Recognised solely so the fiction can refuse them. None grants anything.

| Code | Rejected by |
| --- | --- |
| `432-88` | `override`, the master-key prompt |
| `4328` | `override`, the master-key prompt |
| `1480` | `override`, the master-key prompt |
| `0432` | `override`, the master-key prompt |
| `1989` | `override`, the master-key prompt |
| `3120` | `override`, the master-key prompt |
| `sedley` | `override`, the master-key prompt |

## Tape salvage — Directive 17

The only mechanic whose payoff is a *document* rather than a clearance or a degree. Its sources are the unresolved references themselves: a dossier cites a code the live index cannot produce, and the code is recoverable from the spool. Shards are spliced into ascending locator order.

| Source (where it is found) | Payoff | Shards |
| --- | --- | ---: |
| dossier `p-001` cites `MEMO-1989-EXEC-TERMINATION`, which the index refuses | Executive Contract 0001 — Termination Memorandum (A. Sedley) | 7 |
| dossier `p-009` cites `INC-2019-SVALBARD-STATION07`, which the index refuses | Incident Report — Station 07, Borehole 4, night of 3–4 November 2019 | 7 |
| dossier `p-010` cites `DOC-2019-COHORT-ALPHA`, which the index refuses | Cohort Alpha — Tier-1 Heritage Continuity Register (header pages) | 6 |

### Recorded Seal-Word collisions in ghost text

`INV-TAPE-04` fails CI if a Seal-Word appears in the salvage layer, which promises to carry no answers. These are the deliberate, reviewed exceptions — flagged as warnings, never silent.

| Ghost | Seal-Word | Why it is allowed |
| --- | --- | --- |
| `ghost-003` | `ECHO` | The Cohort Alpha register names its alternates column "ECHO" alongside soprano/alto/tenor/bass — ordinary choral usage in-world, in a document about a choir. It is also the Seal V Seal-Word. Flagged, not resolved: if this is meant to be a plant, it is the only Seal-Word reachable before Seal V and should be treated as a clue; if it is not, rename the column. Decided by the narrative author, not by tooling. |

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
