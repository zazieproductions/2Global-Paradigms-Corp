<!-- GENERATED FILE — DO NOT EDIT. -->
<!-- Regenerate with: npm run archive:report   Verify with: npm run archive:report:check -->

# Entity registry (derived)

Who owns what, who is where, and how densely each entity is cross-referenced. This is the table to
read before naming a person, moving one between stations, or assigning a programme to a department:
`validateCanon()` will fail on a mismatch, and this is where you can see the mismatch coming.

## Departments

| Code | Name | Director | Deputy | HQ | Head | Programmes led | Timeline entries |
| --- | --- | --- | --- | --- | ---: | --- | ---: |
| `SFPC` | Department of Strategic Forecasting & Predictive Chronology | Dr. Thaddeus Holt | Dr. Evelyn Reed | Tower Obsidian, Floor 44, London | 342 | Echo-State | 3 |
| `PEFD` | Psychoacoustics & Environmental Frequency Directorate | Dr. Naomi Chen | Dr. Jonas Weiss | Rosslyn Sub-Complex, Vault 02, Arlington, VA | 518 | Vesper, Chime, Cicada, Vitruvian | 11 |
| `CCDR` | Division of Civic Continuity & Demographic Resilience | Mara Finch | Martin Sedley | Swiss Alps Redoubt (Grimsel Pass) | 420 | Aethelgard | 7 |
| `SISO` | Subterranean Infrastructure & Station Operations | Chief Engineer Sarah Lin | Commander J. R. Calderon | Site 19 (Great Salt Lake Trench, UT) | 890 | Janitor, Stentor | 6 |
| `BECM` | Behavioral Economics & Compliance Metrics | Dr. Tobias Voss | Dr. Brigitte Laroche | Tokyo Chiyoda Deep Tower, B3 | 280 | Hypnos | 1 |
| `TOPN` | Tactical Obfuscation & Public Narrative | Harrison Blake | Agent Paul Kiernan | Tower Obsidian, Floor 38, London | 195 | — | 1 |
| `ASIAN` | Atmospheric Sensing & Infrasonic Array Network | Dr. Henrik Lindqvist | Dr. Soraya Morales | Nordic Array Station 07, Spitsbergen | 310 | Boreas, Stillwater, Monolith | 11 |
| `EGSPU` | Executive Governance & Special Projects Unit | CEO Nigel Ashby | Executive VP Helena Cross | Tower Obsidian, The Obsidian Penthouse, London | 65 | — | 5 |
| `BHRR` | Bio-Harmonic Reclamation & Remediation | Dr. Marcus Saito | Dr. Diane Kowalski | Yellowknife Sub-Permafrost Lab, Canada | 230 | Morpheus | 2 |
| `AIRS` | Archive Integrity & Retrospective Scrubbing | Vincent Adeyemi | Agent Paul Kiernan | Postojna Caverns Secure Repository, Slovenia | 140 | Palimpsest | 5 |

## Programmes

| Code | Name | Dept | Director | Since | Status | Threat | People | Stations |
| --- | --- | --- | --- | ---: | --- | --- | ---: | ---: |
| `PROG-BOREAS` | Project Boreas | `asian` | Dr. Henrik Lindqvist | 1986 | Active | High | 4 | 3 |
| `PROG-VESPER` | Project Vesper | `pefd` | Dr. Naomi Chen | 1989 | Active | Critical | 5 | 3 |
| `PROG-HYPNOS` | Project Hypnos | `becm` | Dr. Tobias Voss | 2002 | Active | Moderate | 3 | 2 |
| `PROG-CHIME` | Project Chime | `pefd` | Dr. Jonas Weiss | 2006 | Active | Moderate | 2 | 2 |
| `PROG-PALIMPSEST` | Project Palimpsest | `airs` | Vincent Adeyemi | 1994 | Covert Active | Critical | 5 | 3 |
| `PROG-JANITOR` | Project Janitor | `siso` | Chief Engineer Sarah Lin | 1998 | Active | High | 3 | 3 |
| `PROG-ECHO-STATE` | Project Echo-State | `sfpc` | Dr. Evelyn Reed | 2015 | Active | High | 4 | 3 |
| `PROG-STENTOR` | Project Stentor | `siso` | Commander J. R. Calderon | 1991 | Active | Critical | 4 | 4 |
| `PROG-CICADA` | Project Cicada | `pefd` | Dr. Naomi Chen | 2012 | Active | Moderate | 2 | 4 |
| `PROG-AETHELGARD` | Project Aethelgard | `ccdr` | Mara Finch | 1984 | Covert Active | Existential | 5 | 4 |
| `PROG-STILLWATER` | Project Stillwater | `asian` | Dr. Tariq Al-Mansoor | 2009 | Active | Moderate | 2 | 3 |
| `PROG-MORPHEUS` | Project Morpheus | `bhrr` | Dr. Marcus Saito | 2014 | Active | High | 3 | 2 |
| `PROG-VITRUVIAN` | Project Vitruvian | `pefd` | Dr. Naomi Chen | 2016 | Active | Low | 2 | 2 |
| `PROG-MONOLITH` | Project Monolith | `asian` | Dr. Henrik Lindqvist | 2001 | Covert Active | Existential | 5 | 5 |

`Covert Active` marks the three that are the Order's work rather than the company's.

## Stations & arrays

| Code | Name | Region | Type | Status | Lead | Est. | Band | Projects |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `LON-01-HQ` | Global HQ - Tower Obsidian | Western Europe (United Kingdom) | Corporate Tower | Operational | CEO Nigel Ashby | 1971-04-12 | 22.0 Hz (Architectural Anti-Resonance) | 3 |
| `VA-02-HUB` | North American Operational Hub - Rosslyn Sub-Complex | North America (Virginia, USA) | Subterranean Bunker | Operational | Dr. Naomi Chen | 1982-08-15 | 14.8 Hz / 432 Hz Dual Modulated | 3 |
| `TYO-03-PAC` | Pacific Basin Analytics - Tokyo Chiyoda Deep Tower | East Asia (Japan) | Corporate Tower | Operational | Dr. Tobias Voss | 1989-03-01 | 60.0 Hz Power-Grid Injected Sub-Harmonic | 3 |
| `SVA-04-ARR` | Nordic Acoustic Array - Station 07 | Arctic (Spitsbergen, Svalbard) | Permafrost Vault | Elevated Alert | Dr. Henrik Lindqvist | 1986-11-10 | 14.8 Hz Sub-Permafrost Harmonic Baseline | 3 |
| `CHI-05-ALT` | High-Altitude Infrasound Array - Atacama Trench Station | South America (Atacama, Chile) | High-Altitude Sensor | Operational | Dr. Soraya Morales | 1995-04-12 | 4.2 Hz Atmospheric Standing Pillar | 2 |
| `UT-06-CNT` | Sub-Basin Containment Facility - Site 19 | North America (Utah, USA) | Subterranean Bunker | Under Containment | Chief Engineer Sarah Lin | 1979-09-20 | 32.4 Hz Heavy Structural Containment Tone | 3 |
| `YK-07-BOR` | Sub-Boreal Propagation Array - Yellowknife Sub-Permafrost Lab | North America (Northwest Territories, Canada) | Permafrost Vault | Operational | Dr. Marcus Saito | 1992-06-18 | 18.2 Hz Boreal Waveguide | 2 |
| `SWI-08-RED` | European Civic Continuity Bunker - Swiss Alps Redoubt | Western Europe (Grimsel Pass, Switzerland) | Subterranean Bunker | Operational | Mara Finch | 1984-10-05 | 528 Hz Harmonic Stabilization Field | 2 |
| `DG-09-HYD` | Indian Ocean Submerged Monitor - Diego Garcia Hydrophone 12 | Indian Ocean (Diego Garcia Trench) | Seabed Hydrophone | Operational | Dr. Tariq Al-Mansoor | 2001-12-04 | 54.0 Hz Abyssal Trench Pulse | 2 |
| `SLO-10-ARC` | Balkan Harmonic Calibration Center - Postojna Caverns | Eastern Europe (Slovenia) | Subterranean Bunker | Operational | Vincent Adeyemi | 1998-03-22 | 7.83 Hz Schumann Resonator Array | 2 |
| `KEN-11-EQU` | Equatorial Infrasonic Array - Mount Kenya Observatory | Sub-Saharan Africa (Kenya) | High-Altitude Sensor | Operational | Dr. Henrik Lindqvist | 2006-05-18 | 11.4 Hz Equatorial Ducting | 2 |
| `SWE-12-BAL` | Baltic Infrasonic Array - Gotland Deep Sensor 4 | Northern Europe (Gotland, Sweden) | Subterranean Bunker | Operational | Dr. Henrik Lindqvist | 1999-07-14 | 19.8 Hz Baltic Baseline | 2 |
| `AUS-13-RED` | Australasian Continuity Depot - Woomera Redoubt | Oceania (South Australia) | Subterranean Bunker | Operational | Mara Finch | 1991-11-20 | 432 Hz Southern Hemisphere Harmonic | 2 |
| `TDC-14-OCN` | South Atlantic Hydrophone Array - Tristan da Cunha Post 02 | South Atlantic (Tristan da Cunha) | Seabed Hydrophone | Operational | Dr. Tariq Al-Mansoor | 2008-02-11 | 8.1 Hz Deep Atlantic Resonator | 1 |
| `NV-15-MOJ` | Mojave Acoustic Propagation Corridor - Sector 44 | North America (Nevada, USA) | Subterranean Bunker | Operational | Chief Engineer Sarah Lin | 1985-09-08 | 14.8 Hz High-Power Carrier Array | 2 |
| `WV-16-APP` | Appalachian Seismic-Acoustic Station - Black Ridge | North America (West Virginia, USA) | Subterranean Bunker | Operational | Dr. Clara Zimmerman | 2004-10-18 | 42.0 Hz Coal Seam Resonant Node | 2 |
| `SIB-17-TIK` | Siberian Boundary Station - Tiksi Sub-Zero Post | Northern Asia (Siberia) | Permafrost Vault | Operational | Roman Sleptsov | 2012-11-05 | 14.8 Hz Polar East Baseline | 2 |
| `CAY-18-TRO` | Caribbean Acoustic Depth Laboratory - Cayman Trough Platform 9 | Caribbean (Cayman Trench) | Seabed Hydrophone | Operational | Dr. Tariq Al-Mansoor | 2015-01-20 | 72.0 Hz Deep Trench Chime | 2 |
| `AZO-19-MAR` | Mid-Atlantic Ridge Array Node 14 - Azores Seabed Station | Atlantic Ocean (Azores) | Seabed Hydrophone | Operational | Kasper Vang | 2017-06-20 | 16.4 Hz Spreading Ridge Harmonic | 2 |
| `JEJ-20-VAU` | East Asian Continuity Facility - Jeju Island Deep Vault | East Asia (South Korea) | Subterranean Bunker | Operational | Dr. Tobias Voss | 2016-08-14 | 432 Hz Regional Stabilizer | 2 |
| `KGL-21-DEM` | Sub-Saharan Demographic Monitor - Kigali Urban Lab | Sub-Saharan Africa (Rwanda) | Corporate Tower | Operational | Dr. Rebecca Osei | 2016-01-18 | 24.8 Hz Urban Baseline | 2 |
| `PAT-22-FJD` | South American Continuity Center - Patagonia Fjord Station | South America (Patagonia, Chile) | Subterranean Bunker | Operational | Mara Finch | 2018-09-12 | 528 Hz Fjord Acoustic Trap | 2 |

## Personnel

| Id | Name | Status | Tier | Dept | Station | Hired | Linked docs | Missing | Links |
| --- | --- | --- | :--: | --- | --- | --- | ---: | ---: | ---: |
| `p-001` | Dr. Arthur Sedley | Terminated | 5 | `egspu` | `st-01` | 1971-04-12 | 9 | 1 | 0 |
| `p-002` | Dame Eleanor Cross | Active | 5 | `egspu` | `st-08` | 1971-04-12 | 9 | 2 | 0 |
| `p-003` | Nigel Ashby | Active | 5 | `egspu` | `st-01` | 2004-09-01 | 5 | 3 | 0 |
| `p-004` | Helena Cross | Active | 5 | `egspu` | `st-01` | 2008-03-15 | 4 | 2 | 0 |
| `p-005` | Dr. Thaddeus Holt | Active | 4 | `sfpc` | `st-01` | 2009-11-20 | 5 | 2 | 0 |
| `p-006` | Dr. Evelyn Reed | Active | 4 | `sfpc` | `st-01` | 2014-06-01 | 4 | 2 | 0 |
| `p-007` | Dr. Naomi Chen | Active | 4 | `pefd` | `st-02` | 2006-02-14 | 7 | 1 | 1 |
| `p-008` | Dr. Jonas Weiss | Active | 4 | `pefd` | `st-02` | 2011-08-15 | 6 | 2 | 0 |
| `p-009` | Dr. Ewan Thorne | Missing | 3 | `pefd` | `st-04` | 2015-05-10 | 6 | 1 | 1 |
| `p-010` | Mara Finch | Active | 4 | `ccdr` | `st-08` | 2005-01-10 | 4 | 2 | 0 |
| `p-011` | Martin Sedley | Active | 4 | `ccdr` | `st-08` | 2013-04-01 | 4 | 1 | 0 |
| `p-012` | Sarah Lin | Active | 4 | `siso` | `st-06` | 2007-07-22 | 7 | 2 | 0 |
| `p-013` | Commander J. R. Calderon | Active | 4 | `siso` | `st-06` | 2010-02-18 | 3 | 2 | 0 |
| `p-014` | Dr. Tobias Voss | Active | 4 | `becm` | `st-03` | 2012-09-12 | 4 | 2 | 0 |
| `p-015` | Dr. Brigitte Laroche | Active | 3 | `becm` | `st-03` | 2016-10-01 | 3 | 2 | 0 |
| `p-016` | Harrison Blake | Active | 4 | `topn` | `st-01` | 2008-05-19 | 4 | 3 | 0 |
| `p-017` | Agent Paul Kiernan | Active | 4 | `topn` | `st-01` | 2015-08-01 | 5 | 2 | 0 |
| `p-018` | Dr. Henrik Lindqvist | Active | 4 | `asian` | `st-04` | 2003-10-15 | 8 | 1 | 1 |
| `p-019` | Dr. Soraya Morales | Active | 4 | `asian` | `st-05` | 2011-03-25 | 3 | 2 | 0 |
| `p-020` | Dr. Marcus Saito | Active | 4 | `bhrr` | `st-07` | 2010-06-14 | 5 | 2 | 0 |
| `p-021` | Dr. Diane Kowalski | Active | 3 | `bhrr` | `st-07` | 2017-02-10 | 5 | 2 | 0 |
| `p-022` | Julian Thorne | Terminated | 5 | `airs` | `st-10` | 1998-04-01 | 5 | 2 | 0 |
| `p-023` | Vincent Adeyemi | Active | 4 | `airs` | `st-10` | 2019-12-01 | 4 | 2 | 0 |
| `p-024` | Roman Sleptsov | Active | 3 | `siso` | `st-17` | 2012-11-05 | 4 | 1 | 0 |
| `p-025` | Dr. Tariq Al-Mansoor | Active | 4 | `asian` | `st-09` | 2015-09-18 | 5 | 1 | 1 |
| `p-026` | Eleni Kouris | Active | 3 | `ccdr` | `st-08` | 2018-01-22 | 3 | 2 | 0 |
| `p-027` | Lukas Meyer | Active | 3 | `pefd` | `st-01` | 2016-04-12 | 6 | 2 | 0 |
| `p-028` | Philip Warrender | Active | 4 | `topn` | `st-01` | 2011-11-11 | 6 | 2 | 0 |
| `p-029` | Dr. Clara Zimmerman | Active | 3 | `asian` | `st-16` | 2019-07-08 | 4 | 1 | 1 |
| `p-030` | Niall O’Connor | Active | 2 | `siso` | `st-01` | 2015-03-01 | 4 | 2 | 0 |
| `p-031` | Dr. Hiroshi Tanaka | Active | 4 | `pefd` | `st-03` | 2013-09-14 | 6 | 2 | 0 |
| `p-032` | Zhenya Petrov | Active | 3 | `sfpc` | `st-01` | 2020-01-15 | 3 | 2 | 0 |
| `p-033` | Dr. Astrid Lindberg | Active | 3 | `bhrr` | `st-04` | 2018-11-01 | 3 | 1 | 1 |
| `p-034` | Diego Ramirez | Active | 3 | `siso` | `st-05` | 2014-08-30 | 3 | 1 | 0 |
| `p-035` | Chloe Fontaine | Active | 3 | `pefd` | `st-02` | 2021-03-15 | 3 | 2 | 0 |
| `p-036` | Frank Bedell | Active | 4 | `siso` | `st-06` | 2009-12-01 | 4 | 1 | 0 |
| `p-037` | Dr. Anya Sharma | Active | 3 | `sfpc` | `st-01` | 2019-09-01 | 4 | 1 | 0 |
| `p-038` | Kasper Vang | Active | 3 | `asian` | `st-19` | 2017-06-20 | 3 | 1 | 0 |
| `p-039` | Dr. Rebecca Osei | Active | 3 | `bhrr` | `st-21` | 2016-01-18 | 3 | 2 | 0 |
| `p-040` | Tessa Ashby | Active | 3 | `topn` | `st-01` | 2020-04-01 | 3 | 2 | 0 |
| `p-041` | Commander Bruce Halloran | Quarantined | 4 | `siso` | `st-04` | 2008-10-10 | 3 | 1 | 1 |
| `p-042` | Nora Beaumont | Active | 2 | `airs` | `st-10` | 2022-05-15 | 3 | 2 | 0 |
| `p-043` | Dr. Ronald Abernathy | Active | 4 | `becm` | `st-01` | 2011-04-05 | 3 | 2 | 0 |
| `p-044` | Ingrid Holm | Active | 2 | `asian` | `st-04` | 2021-09-01 | 3 | 1 | 0 |
| `p-045` | David Wren | Terminated | 4 | `sfpc` | `st-02` | 2016-08-10 | 3 | 2 | 0 |

"Missing" counts document codes that were never recovered. They are authored gaps, listed in
[`../CONTINUITY.md`](../CONTINUITY.md) §3, and they render in-world as "not recovered".

## Cross-reference density

| Measure | Value |
| --- | ---: |
| Typed links (`links`) | 7 |
| Loose relations (`related`) | 797 |
| Personnel `linkedDocuments` that resolve | 201 |
| Personnel `linkedDocuments` that do not (authored gaps) | 77 |
| Records with no inbound or outbound reference | 153 |
