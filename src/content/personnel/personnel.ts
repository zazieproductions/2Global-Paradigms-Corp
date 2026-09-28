import type { Personnel } from '@/types';

/**
 * Personnel directory.
 *
 * Biographies are as filed by HR at the time of hiring or departure; the
 * classified notes are written by whoever held the file last — AIRS, medical,
 * TOPN security — which is why the register changes from entry to entry.
 */
export const PERSONNEL: Personnel[] = [
  {
    id: 'p-001',
    employeeId: 'GPC-0001-EXEC',
    name: 'Dr. Arthur Sedley',
    title: 'Co-Founder; Director of Research (deceased, record purged)',
    departmentId: 'dept-egspu',
    departmentName: 'Executive Governance & Special Projects Unit',
    clearance: 'Level 5 - Black Dossier',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Terminated',
    hireDate: '1971-04-12',
    email: 'a.sedley@archive.globalparadigms.corp',
    phoneExtension: 'x0001',
    biography:
      'Reader in applied mathematics at Cambridge until 1971, when he left to found the firm with Eleanor Cross. Published little after the first three monographs; the papers that mattered were written for an internal circulation of nine people. Kept a flat in Bloomsbury that nobody was ever invited to.',
    classifiedNotes:
      'Name struck from the roster under Executive Directive 09 (Nov 1989). No portrait in a public corridor, no endowed chair, no comment to press. Last confirmed sighting: Svalbard sub-level 4, 4 November 1989. There is no body and there will not be one. Any new document bearing his signature is to come straight to this desk unopened.',
    linkedDocuments: ['DOC-1971-FOUNDING', 'DOC-1989-SVALBARD-EVENT', 'MEMO-1989-EXEC-TERMINATION'],
    avatarSeed: 'ArthurSedley'
  },
  {
    id: 'p-002',
    employeeId: 'GPC-0002-EXEC',
    name: 'Dame Eleanor Cross',
    title: 'Co-Founder; Board President Emerita',
    departmentId: 'dept-egspu',
    departmentName: 'Executive Governance & Special Projects Unit',
    clearance: 'Level 5 - Black Dossier',
    stationId: 'st-08',
    stationName: 'European Civic Continuity Bunker - Swiss Alps Redoubt',
    status: 'Active',
    hireDate: '1971-04-12',
    email: 'e.cross@board.globalparadigms.corp',
    phoneExtension: 'x0002',
    biography:
      'Treasury-adjacent civil servant before 1971; handled the sovereign agreements that gave the company its first nine national contracts. Has not left the Grimsel complex since 2016. Conducts board business by written minute, twice monthly.',
    classifiedNotes:
      'Holder, Master Key 01 (Palimpsest crypt). Signatory on every Level 5 transfer of the last thirty years. Board minutes should not be circulated to her above four pages — she reads them all and answers by return, which consumes the Chancery desk for a fortnight. Access requests are to go through her private secretary, not the main switchboard.',
    linkedDocuments: ['DOC-1971-FOUNDING', 'DOC-1999-MILLENNIUM-CHARTER', 'DOC-2022-SWISS-REDOUBT-MANDATE'],
    avatarSeed: 'EleanorCross'
  },
  {
    id: 'p-003',
    employeeId: 'GPC-0104-CEO',
    name: 'Nigel Ashby',
    title: 'Chief Executive',
    departmentId: 'dept-egspu',
    departmentName: 'Executive Governance & Special Projects Unit',
    clearance: 'Level 5 - Black Dossier',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2004-09-01',
    email: 'n.ashby@exec.globalparadigms.corp',
    phoneExtension: 'x1000',
    biography:
      'Came over from defence procurement in 2004, on the continuity side. Ran Civic Continuity for six years before the board moved him up in 2012. Comfortable in front of a select committee and better than most at saying nothing for ninety minutes.',
    classifiedNotes:
      'Signed off the Vesper expansion into North American transit in 2017 without circulating the modelling to the full board; the two members who objected have since left. Has declined three invitations from the International Telecommunications Tribunal and would like that noted as declining, not failing to respond. Prefers briefing papers on paper.',
    linkedDocuments: ['DOC-2017-HORIZON-50', 'DOC-2025-ANNUAL-DISCLOSURE', 'EML-2023-ASHBY-VESPER'],
    avatarSeed: 'NigelAshby'
  },
  {
    id: 'p-004',
    employeeId: 'GPC-0112-EVP',
    name: 'Helena Cross',
    title: 'Executive Vice President, Continuity',
    departmentId: 'dept-egspu',
    departmentName: 'Executive Governance & Special Projects Unit',
    clearance: 'Level 5 - Black Dossier',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2008-03-15',
    email: 'h.cross@exec.globalparadigms.corp',
    phoneExtension: 'x1004',
    biography:
      'Daughter of Dame Eleanor. Joined from a sovereign advisory practice; has run the continuity portfolio since 2014 and signs most of what leaves the executive floor. Allegedly sleeps four hours and tells people so.',
    classifiedNotes:
      'Holds the Aethelgard construction schedule across all fourteen redoubts personally. Runs the whistleblower containment line with TOPN and keeps no written agenda for it. Do not minute the Monday call.',
    linkedDocuments: ['DOC-2019-AETHELGARD-BLUEPRINT', 'EML-2024-LEAK-CONTAINMENT'],
    avatarSeed: 'HelenaCross'
  },
  {
    id: 'p-005',
    employeeId: 'GPC-0248-DIR',
    name: 'Dr. Thaddeus Holt',
    title: 'Director, Forecasting',
    departmentId: 'dept-sfpc',
    departmentName: 'Department of Strategic Forecasting & Predictive Chronology',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2009-11-20',
    email: 't.holt@sfpc.globalparadigms.corp',
    phoneExtension: 'x4401',
    biography:
      'Macro-econometrician, recruited out of a central bank research desk. Built the first production version of the forecasting engine largely by himself between 2010 and 2013, which he still mentions.',
    classifiedNotes:
      'Wrote to the board in March 2022 claiming the model was generating its own inputs — that the forecasts were stressing the sovereign debt it was predicting. Three internal reviews found no fault. He has since kept a private copy of the 2022 run outside the corporate estate; IT have been asked to find it and have not.',
    linkedDocuments: ['DOC-2022-CHRONO-FEEDBACK', 'REP-2022-CIVIC-ELASTICITY'],
    avatarSeed: 'ThaddeusHolt'
  },
  {
    id: 'p-006',
    employeeId: 'GPC-0249-SCI',
    name: 'Dr. Evelyn Reed',
    title: 'Deputy Director, Modelling',
    departmentId: 'dept-sfpc',
    departmentName: 'Department of Strategic Forecasting & Predictive Chronology',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2014-06-01',
    email: 'e.reed@sfpc.globalparadigms.corp',
    phoneExtension: 'x4408',
    biography:
      'Built the synthetic-city work that became Echo-State: full replicas of London, Tokyo and Chicago, populated by simulated residents who behave plausibly enough to be unsettling in a demo. Joined in 2014 from a transport-modelling group.',
    classifiedNotes:
      'Raised the 432-day periodicity in the municipal crime series in 2023 and matched it to the infrasonic release log from Station 07. Her note went to Holt only. Since then she has asked twice for the raw Svalbard telemetry and been given summaries.',
    linkedDocuments: ['DOC-2021-ECHO-STATE-REPORT', 'MEMO-2023-INFRASOUND-CORRELATION'],
    avatarSeed: 'EvelynReed'
  },
  {
    id: 'p-007',
    employeeId: 'GPC-0301-DIR',
    name: 'Dr. Naomi Chen',
    title: 'Director, Psychoacoustics & Environmental Frequency',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-02',
    stationName: 'North American Operational Hub - Rosslyn Sub-Complex, VA',
    status: 'Active',
    hireDate: '2006-02-14',
    email: 'n.chen@pefd.globalparadigms.corp',
    phoneExtension: 'x2001',
    biography:
      'Acoustic engineer by training, eighteen patents in sub-harmonic propagation, most of them filed in the four years after she joined. Designed the tone architecture behind Vesper and has spent the decade since telling people it is a comfort system.',
    classifiedNotes:
      'Objected to Oakhaven Phase 3 in writing, twice, in the fortnight before the trial was stopped. Both memos are in the AIRS vault, not this file. Has not attended a Level 5 review since 2012; sends a deputy. Considered reliable but not useful in a room with the board.',
    linkedDocuments: ['DOC-2011-OAKHAVEN-AUDIT', 'DOC-2015-VESPER-SPECS', 'AUDIO-02-VESPER-TAPE'],
    avatarSeed: 'NaomiChen'
  },
  {
    id: 'p-008',
    employeeId: 'GPC-0302-SCI',
    name: 'Dr. Jonas Weiss',
    title: 'Head of Waveform Research',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-02',
    stationName: 'North American Operational Hub - Rosslyn Sub-Complex, VA',
    status: 'Active',
    hireDate: '2011-08-15',
    email: 'j.weiss@pefd.globalparadigms.corp',
    phoneExtension: 'x2014',
    biography:
      'Auditory neuroscience, then acoustics. Wrote the internal hygiene manual that everybody cites and nobody follows. Drives in from Alexandria and complains about the commute in a way that has become a running joke on his floor.',
    classifiedNotes:
      'Assigned to look into the hum complaints from the flats above the Rosslyn ventilation shafts. His 2024 note concludes the residents are describing a real tone; it stops short of saying where it comes from. He has asked that the note not be filed under his name. Request declined.',
    linkedDocuments: ['DOC-2018-ACOUSTIC-HYGIENE-MANUAL', 'MEMO-2024-ROSSLYN-HUM'],
    avatarSeed: 'JonasWeiss'
  },
  {
    id: 'p-009',
    employeeId: 'GPC-0344-LEAK',
    name: 'Dr. Ewan Thorne',
    title: 'Research Fellow (absent without leave; clearance revoked)',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    clearance: 'Level 3 - Secret (REVOKED)',
    stationId: 'st-04',
    stationName: 'Nordic Acoustic Array - Station 07, Spitsbergen',
    status: 'Missing',
    hireDate: '2015-05-10',
    email: 'e.thorne@pefd.globalparadigms.corp',
    phoneExtension: 'x0709',
    biography:
      'Borehole acoustics. Posted to Station 07 in 2017 on a two-year rotation and did not come back on schedule. His personnel file is four lines long because he never returned any of the forms.',
    classifiedNotes:
      'Left Longyearbyen 4 Nov 2019 with 48GB of station telemetry. Warrant issued under Directive 09; reward authorised at £250,000. Uses the handle "PalimpsestObserver" on the mirrors. Two notes for the duty officer: he is not armed, and he is not to be brought back conscious. See the Seventh Chamber minute of 12 Feb 2020 before doing anything.',
    linkedDocuments: [
      'DOC-2019-PALIMPSEST-LEAK',
      'INC-2019-SVALBARD-STATION07',
      'AUDIO-01-SVALBARD-INFRASOUND'
    ],
    avatarSeed: 'EwanThorne'
  },
  {
    id: 'p-010',
    employeeId: 'GPC-0401-DIR',
    name: 'Mara Finch',
    title: 'Director, Civic Continuity',
    departmentId: 'dept-ccdr',
    departmentName: 'Division of Civic Continuity & Demographic Resilience',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-08',
    stationName: 'European Civic Continuity Bunker - Swiss Alps Redoubt',
    status: 'Active',
    hireDate: '2005-01-10',
    email: 'm.finch@ccdr.globalparadigms.corp',
    phoneExtension: 'x8001',
    biography:
      'Ex-civil defence, county level. Runs provisioning: food, air, medicine, the drills nobody enjoys. Was the only person to raise the question of who cleans the redoubts, which is why the maintenance contracts now exist.',
    classifiedNotes:
      'Keeps the Cohort Alpha list — ten thousand names, ranked, for deep-shelter relocation on a Level 4 declaration. Reviews it quarterly and has taken three names off it on her own authority. The removals were reinstated by the executive floor. She has not been told.',
    linkedDocuments: ['DOC-2019-COHORT-ALPHA', 'DOC-2022-SWISS-REDOUBT-MANDATE'],
    avatarSeed: 'MaraFinch'
  },
  {
    id: 'p-011',
    employeeId: 'GPC-0412-OPS',
    name: 'Martin Sedley',
    title: 'Deputy Director, Sub-Surface Logistics',
    departmentId: 'dept-ccdr',
    departmentName: 'Division of Civic Continuity & Demographic Resilience',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-08',
    stationName: 'European Civic Continuity Bunker - Swiss Alps Redoubt',
    status: 'Active',
    hireDate: '2013-04-01',
    email: 'm.sedley@ccdr.globalparadigms.corp',
    phoneExtension: 'x8012',
    biography:
      'Grandson of the co-founder, which he does not bring up and everyone knows. Power systems, hydroponics, the psychology of people shut in a mountain for months at a time. Spends most of the year at Grimsel and is on record as preferring it to London.',
    classifiedNotes:
      'Ran the 90-day Silent Cohort trial at Grimsel in 2021 with the comms mast physically removed. Two subjects required sedated extraction at day 61; the log describes this as "early exit, non-critical". Martin requested the trial be repeated with a larger cohort. Request not granted and not refused.',
    linkedDocuments: ['DOC-2021-SILENT-COHORT-LOG', 'REP-2025-CONTINUITY-AUDIT'],
    avatarSeed: 'MartinSedley'
  },
  {
    id: 'p-012',
    employeeId: 'GPC-0501-ENG',
    name: 'Sarah Lin',
    title: 'Chief Engineer, Underground Works',
    departmentId: 'dept-siso',
    departmentName: 'Subterranean Infrastructure & Station Operations',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-06',
    stationName: 'Sub-Basin Containment Facility - Site 19, Utah',
    status: 'Active',
    hireDate: '2007-07-22',
    email: 's.lin@siso.globalparadigms.corp',
    phoneExtension: 'x1901',
    biography:
      'Geotechnical engineer. Designed the containment sleeve around the Great Salt Lake fissure and has signed off every liner panel since. Keeps a paper notebook of every pour on site, which has twice saved an audit.',
    classifiedNotes:
      'August 2024: requested 40,000 further tons of dampening grout for Sub-Level 6 after micro-fracture readings tripled. Request approved at a third of the requested tonnage. She replied to the approval with a single sentence I have kept: "Then please put the reduction in writing over a signature."',
    linkedDocuments: ['DOC-2024-SITE19-FRACTURE-LOG', 'INC-2023-SEISMIC-BREACH'],
    avatarSeed: 'SarahLin'
  },
  {
    id: 'p-013',
    employeeId: 'GPC-0508-TAC',
    name: 'Commander J. R. Calderon',
    title: 'Operations Commander, Security & Containment',
    departmentId: 'dept-siso',
    departmentName: 'Subterranean Infrastructure & Station Operations',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-06',
    stationName: 'Sub-Basin Containment Facility - Site 19, Utah',
    status: 'Active',
    hireDate: '2010-02-18',
    email: 'jr.calderon@siso.globalparadigms.corp',
    phoneExtension: 'x1910',
    biography:
      'Engineering officer before he came to us; ran route clearance and then site security. Holds the perimeter plan for all twenty-two stations. Does not describe himself as a soldier and does not like it when others do.',
    classifiedNotes:
      'Enforced the thirty-day cordon at Yellowknife in 2020. His after-action note is the only honest document to come out of that month: it says the station was sealed because the crew had begun answering each other in the same voice, and that no medical officer was permitted entry. He has never been asked about it by the board and has never volunteered it.',
    linkedDocuments: ['DOC-2020-YELLOWKNIFE-CORDON', 'SEC-2024-STATION-READINESS'],
    avatarSeed: 'JRCalderon'
  },
  {
    id: 'p-014',
    employeeId: 'GPC-0601-DIR',
    name: 'Dr. Tobias Voss',
    title: 'Director, Behavioural Research',
    departmentId: 'dept-becm',
    departmentName: 'Behavioral Economics & Compliance Metrics',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-03',
    stationName: 'Pacific Basin Analytics - Tokyo Chiyoda Deep Tower',
    status: 'Active',
    hireDate: '2012-09-12',
    email: 't.voss@becm.globalparadigms.corp',
    phoneExtension: 'x3001',
    biography:
      'Neuro-economist. Studies risk appetite under sustained low-frequency exposure; the finding that people accept worse terms when they cannot hear why is his and is quoted in every client deck the company has produced since 2018.',
    classifiedNotes:
      'Supervised the Hypnos rollout across forty residential towers in East Asia. Reports quarterly and answers questions with data. Chief of Staff note, Dec 2023: he is not a problem, he is a resource, and the difference matters when he is eventually subpoenaed.',
    linkedDocuments: ['DOC-2016-HYPNOS-FIELD-TRIAL', 'REP-2024-COMPLIANCE-INDEX'],
    avatarSeed: 'TobiasVoss'
  },
  {
    id: 'p-015',
    employeeId: 'GPC-0615-SCI',
    name: 'Dr. Brigitte Laroche',
    title: 'Senior Analyst, Behavioural Metrics',
    departmentId: 'dept-becm',
    departmentName: 'Behavioral Economics & Compliance Metrics',
    clearance: 'Level 3 - Secret',
    stationId: 'st-03',
    stationName: 'Pacific Basin Analytics - Tokyo Chiyoda Deep Tower',
    status: 'Active',
    hireDate: '2016-10-01',
    email: 'b.laroche@becm.globalparadigms.corp',
    phoneExtension: 'x3015',
    biography:
      'Builds the compliance index out of transit taps, telecom volumes and background noise density. The index is now written into four municipal contracts, which she finds funnier than it should be.',
    classifiedNotes:
      'Her 2023 memo on retrograde amnesia after long Vesper exposure is correct and inconvenient. Recommend reclassification as a draft finding rather than a finding. She has been asked not to correspond on the subject outside the department and has complied; a copy exists on the Tokyo file server under "audio hygiene".',
    linkedDocuments: ['DOC-2023-AMNESIA-METRIC-MEMO', 'TRAIN-MOD-308'],
    avatarSeed: 'BrigitteLaroche'
  },
  {
    id: 'p-016',
    employeeId: 'GPC-0701-PR',
    name: 'Harrison Blake',
    title: 'Director of Communications',
    departmentId: 'dept-topn',
    departmentName: 'Tactical Obfuscation & Public Narrative',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2008-05-19',
    email: 'h.blake@topn.globalparadigms.corp',
    phoneExtension: 'x3801',
    biography:
      'Press officer in two governments before this. His job is to give journalists a better story than the true one, and he is good at it. Apologises to nobody and goes home at six.',
    classifiedNotes:
      '"Defective capacitor" — his phrase, 1994, and it is still doing work thirty years later. He had the Oakhaven Tribune archive servers wiped in 2011 with a single call to a hosting provider and no paperwork. Nothing that man does is minuted and I would stop trying.',
    linkedDocuments: [
      'PR-1994-RESON8-RECALL',
      'PR-2011-OAKHAVEN-STATEMENT',
      'DOC-2019-MEDIA-ATTRIBUTION-PLAYBOOK'
    ],
    avatarSeed: 'HarrisonBlake'
  },
  {
    id: 'p-017',
    employeeId: 'GPC-0710-SEC',
    name: 'Agent Paul Kiernan',
    title: 'Counter-Leak Investigator, TOPN',
    departmentId: 'dept-topn',
    departmentName: 'Tactical Obfuscation & Public Narrative',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2015-08-01',
    email: 'p.kiernan@topn.globalparadigms.corp',
    phoneExtension: 'x3810',
    biography:
      'Digital forensics, then counter-leak. Finds mirrors of stolen material, traces the people who post them, and files reports that read like a man who would rather be doing something else.',
    classifiedNotes:
      'Took down fourteen mirrors of the Station 07 audio master in 2020. Currently watching relay nodes in Helsinki and Montreal; his own assessment is that both are decoys and the real relay moves every Friday at 03:14. Has twice asked for authority to act off-network. Both requests refused on the grounds that the answer would be visible.',
    linkedDocuments: ['DOC-2020-DOMAIN-SEIZURE-ORDER', 'EML-2024-LEAK-CONTAINMENT'],
    avatarSeed: 'PaulKiernan'
  },
  {
    id: 'p-018',
    employeeId: 'GPC-0801-DIR',
    name: 'Dr. Henrik Lindqvist',
    title: 'Director, Infrasonic Network',
    departmentId: 'dept-asian',
    departmentName: 'Atmospheric Sensing & Infrasonic Array Network',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-04',
    stationName: 'Nordic Acoustic Array - Station 07, Spitsbergen',
    status: 'Active',
    hireDate: '2003-10-15',
    email: 'h.lindqvist@asian.globalparadigms.corp',
    phoneExtension: 'x0701',
    biography:
      'Geophysicist. Built the Nordic array — Spitsbergen, Gotland, Yellowknife — and has spent twenty years defending its budget on the grounds that you cannot hear a thing that has been sounding for a million years without very good instruments.',
    classifiedNotes:
      'Reported an 18.4% amplitude rise over thirty-six months, 2024. His note is careful and does not speculate. Privately he has told two colleagues that the rise looks less like geology every year. Those conversations are known to us and have been left alone.',
    linkedDocuments: ['DOC-2024-INFRASOUND-AMPLITUDE-STUDY', 'AUDIO-01-SVALBARD-INFRASOUND'],
    avatarSeed: 'HenrikLindqvist'
  },
  {
    id: 'p-019',
    employeeId: 'GPC-0814-SCI',
    name: 'Dr. Soraya Morales',
    title: 'Deputy Director, Infrasonic Cartography',
    departmentId: 'dept-asian',
    departmentName: 'Atmospheric Sensing & Infrasonic Array Network',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-05',
    stationName: 'High-Altitude Infrasound Array - Atacama Trench Station, Chile',
    status: 'Active',
    hireDate: '2011-03-25',
    email: 's.morales@asian.globalparadigms.corp',
    phoneExtension: 'x5014',
    biography:
      'Works on wave bending at altitude — how a tone from the ground arrives somewhere it should not. Based at Atacama for eleven years and has the telescope-burn to prove it.',
    classifiedNotes:
      'Found the standing column over the Atacama in 2017: 4.2Hz, stationary, 35km tall, and visible to the observatories as a shimmer they had been blaming on their own optics for a decade. She named it. That name has since appeared in three external papers, which is three papers too many.',
    linkedDocuments: ['DOC-2018-ATACAMA-PILLAR', 'REP-2017-HORIZON-ASSESSMENT'],
    avatarSeed: 'SorayaMorales'
  },
  {
    id: 'p-020',
    employeeId: 'GPC-0901-BIO',
    name: 'Dr. Marcus Saito',
    title: 'Director, Bio-Acoustic Medicine',
    departmentId: 'dept-bhrr',
    departmentName: 'Bio-Harmonic Reclamation & Remediation',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-07',
    stationName: 'Sub-Boreal Propagation Array - Yellowknife Sub-Permafrost Lab',
    status: 'Active',
    hireDate: '2010-06-14',
    email: 'm.saito@bhrr.globalparadigms.corp',
    phoneExtension: 'x7001',
    biography:
      'Ear, nose and throat, then occupational medicine. Treats field staff who have been exposed to undamped sources. Will tell you plainly that most of his job is persuading people the noise stopped after it has not.',
    classifiedNotes:
      'Compound 88-T is his, and it works in about nine cases out of ten. The tenth case is what the formulary calls refractory and what he calls a person who has decided to keep listening. He has asked for a permanent clinical team at Yellowknife and been granted one nurse.',
    linkedDocuments: ['DOC-2020-COMPOUND88-SPECS', 'TRAIN-MOD-204'],
    avatarSeed: 'MarcusSaito'
  },
  {
    id: 'p-021',
    employeeId: 'GPC-0908-BIO',
    name: 'Dr. Diane Kowalski',
    title: 'Clinical Officer, Neurological Hygiene',
    departmentId: 'dept-bhrr',
    departmentName: 'Bio-Harmonic Reclamation & Remediation',
    clearance: 'Level 3 - Secret',
    stationId: 'st-07',
    stationName: 'Sub-Boreal Propagation Array - Yellowknife Sub-Permafrost Lab',
    status: 'Active',
    hireDate: '2017-02-10',
    email: 'd.kowalski@bhrr.globalparadigms.corp',
    phoneExtension: 'x7008',
    biography:
      'Clinical psychologist. Handles auditory trauma, isolation panic and the particular sleep problems that come with living on top of a working source. Came to us from a provincial health service and has never said why she left it.',
    classifiedNotes:
      'Assessed 42 people after Oakhaven. Her figures — 88% needing permanent dampening — are the ones in the board pack. She now refuses to sign the summary page and signs an appendix instead, which is technically compliant. If the file is ever requested externally, the appendix is the document that matters.',
    linkedDocuments: ['DOC-2011-OAKHAVEN-EVAL', 'JOB-04-HYGIENE-OFFICER'],
    avatarSeed: 'DianeKowalski'
  },
  {
    id: 'p-022',
    employeeId: 'GPC-1001-ARC',
    name: 'Julian Thorne',
    title: 'Chief Archivist (terminated; clearance revoked)',
    departmentId: 'dept-airs',
    departmentName: 'Archive Integrity & Retrospective Scrubbing',
    clearance: 'Level 5 - Black Dossier (REVOKED)',
    stationId: 'st-10',
    stationName: 'Balkan Harmonic Calibration Center - Postojna Caverns, Slovenia',
    status: 'Terminated',
    hireDate: '1998-04-01',
    email: 'j.thorne@airs.globalparadigms.corp',
    phoneExtension: 'x1001',
    biography:
      'Ran the microfilm halls at Postojna for twenty-one years. Older brother of Ewan Thorne. Knew where every original was and, by the end, most of what was in them.',
    classifiedNotes:
      "Terminated 26 Nov 2019. Subjected to Level 5 memory remediation before release, the last person to receive it. The procedure took. He now lives in Ljubljana under his mother's name, works in a bookshop, and has twice been recognised by former colleagues and has not recognised them back.",
    linkedDocuments: ['DOC-2019-PALIMPSEST-INTERNAL', 'MEMO-2019-ARCHIVE-SANITY'],
    avatarSeed: 'JulianThorne'
  },
  {
    id: 'p-023',
    employeeId: 'GPC-1004-ARC',
    name: 'Vincent Adeyemi',
    title: 'Chief Redaction Officer',
    departmentId: 'dept-airs',
    departmentName: 'Archive Integrity & Retrospective Scrubbing',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-10',
    stationName: 'Balkan Harmonic Calibration Center - Postojna Caverns, Slovenia',
    status: 'Active',
    hireDate: '2019-12-01',
    email: 'v.adeyemi@airs.globalparadigms.corp',
    phoneExtension: 'x1004',
    biography:
      "Brought in the month after the exfiltration to rebuild the archive's security model. Former bank records investigator, which shows: everything he does leaves a trail, and the trail is in order.",
    classifiedNotes:
      'Runs the hash re-encoder that invalidates leaked copies across the corporate estate. Asked, at his interview, what happens to the originals at Postojna. Told they are the master. Has not asked again and keeps a list of everything he has been told not to open. SMART. Preserve the list.',
    linkedDocuments: ['DOC-2020-REDACTION-STANDARD-8', 'TOOL-REDACTION-RECON'],
    avatarSeed: 'VincentAdeyemi'
  },
  {
    id: 'p-024',
    employeeId: 'GPC-1102-ENG',
    name: 'Roman Sleptsov',
    title: 'Station Chief, Tiksi',
    departmentId: 'dept-siso',
    departmentName: 'Subterranean Infrastructure & Station Operations',
    clearance: 'Level 3 - Secret',
    stationId: 'st-17',
    stationName: 'Siberian Boundary Station - Tiksi Sub-Zero Post',
    status: 'Active',
    hireDate: '2012-11-05',
    email: 'r.sleptsov@siso.globalparadigms.corp',
    phoneExtension: 'x1702',
    biography:
      'Deep drilling. Has run Tiksi since 2015 with a crew of eleven and a generator that breaks every winter. Supervises the 12km sensor line along the Laptev margin and files his returns on time, which is more than the rest of the network manages.',
    classifiedNotes:
      'March 2025: reported ground warmth twenty degrees above the seasonal curve coinciding with a sustained low tone in the borehole. Then reported it again, unchanged, in April, May and June — a man making sure the record shows he said it every month.',
    linkedDocuments: ['DOC-2025-TIKSI-THERMAL-LOG'],
    avatarSeed: 'RomanSleptsov'
  },
  {
    id: 'p-025',
    employeeId: 'GPC-1140-OCE',
    name: 'Dr. Tariq Al-Mansoor',
    title: 'Principal Oceanographer, Hydro-Acoustics',
    departmentId: 'dept-asian',
    departmentName: 'Atmospheric Sensing & Infrasonic Array Network',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-09',
    stationName: 'Indian Ocean Submerged Monitor - Diego Garcia Trench Hydrophone 12',
    status: 'Active',
    hireDate: '2015-09-18',
    email: 't.almansoor@asian.globalparadigms.corp',
    phoneExtension: 'x0904',
    biography:
      'Deep-water acoustics, SOFAR channel work. Listens to the ocean for a living and has said, more than once, that the ocean is mostly boring, which is what makes the interesting parts interesting.',
    classifiedNotes:
      'Logged the 54Hz pulse on the Diego Garcia array in November 2023 and spent five weeks ruling out everything before saying where it was coming from. Source is 8,400 metres below seabed in a trench with no known structure of that kind. Recommend the term "pulse" is not used in external documents; the oceanographic release calls it a sediment event.',
    linkedDocuments: ['AUDIO-03-DIEGO-GARCIA-HYDROPHONE', 'DOC-2023-DIEGO-PULSE-MEMO'],
    avatarSeed: 'TariqAlMansoor'
  },
  {
    id: 'p-026',
    employeeId: 'GPC-1205-SOC',
    name: 'Eleni Kouris',
    title: 'Head of Relocation Modelling',
    departmentId: 'dept-ccdr',
    departmentName: 'Division of Civic Continuity & Demographic Resilience',
    clearance: 'Level 3 - Secret',
    stationId: 'st-08',
    stationName: 'European Civic Continuity Bunker - Swiss Alps Redoubt',
    status: 'Active',
    hireDate: '2018-01-22',
    email: 'e.kouris@ccdr.globalparadigms.corp',
    phoneExtension: 'x8025',
    biography:
      'Urban planner. Models how large numbers of people move through constrained spaces, and what happens when they stop trusting the signs. Her evacuation corridors are in the resilience plans of eleven European cities under a different cover.',
    classifiedNotes:
      'Did the crowd-funnelling work for the transit panic scenarios. Her files describe the 14.8Hz case in the same tone as a fire drill, which is either professionalism or something worth watching. No security concerns to date. Onboarding note from Finch: "Eleni asks good questions. Answer them properly or she will ask them somewhere else."',
    linkedDocuments: ['DOC-2022-TRANSIT-FUNNELING', 'TOOL-EVACUATION-CALC'],
    avatarSeed: 'EleniKouris'
  },
  {
    id: 'p-027',
    employeeId: 'GPC-1244-AUD',
    name: 'Lukas Meyer',
    title: 'Senior Architectural Acoustician',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    clearance: 'Level 3 - Secret',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2016-04-12',
    email: 'l.meyer@pefd.globalparadigms.corp',
    phoneExtension: 'x2044',
    biography:
      'Designs resonant cavities into buildings — the parts of a tower that hum on purpose. Joined to work on the Obsidian facade and stayed for the projects nobody else would take.',
    classifiedNotes:
      'Built the 22Hz cancellation fins on Tower Obsidian so the executive floors sit in a pocket of quiet while the street outside carries the tone. He thinks he is doing comfort engineering. Nobody has told him otherwise and nobody should; he is the only acoustician on staff who talks to planning authorities without being briefed first.',
    linkedDocuments: ['DOC-2016-TOWER-OBSIDIAN-SPECS', 'PROG-VITRUVIAN'],
    avatarSeed: 'LukasMeyer'
  },
  {
    id: 'p-028',
    employeeId: 'GPC-1301-LEG',
    name: 'Philip Warrender',
    title: 'General Counsel',
    departmentId: 'dept-topn',
    departmentName: 'Tactical Obfuscation & Public Narrative',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2011-11-11',
    email: 'p.warrender@legal.globalparadigms.corp',
    phoneExtension: 'x3822',
    biography:
      'Litigator, commercial and then everything else. Handles settlements, patents and the national security agreements that senior staff sign on their first morning and re-read never.',
    classifiedNotes:
      '142 out-of-court settlements for hum complaints — Bristol, Kokomo, Taos and the rest — all with perpetual silence covenants and no admission. His view, minuted once and never repeated, is that the covenants are unenforceable in four of the jurisdictions concerned and that the company is buying time rather than peace. He bills anyway, correctly.',
    linkedDocuments: ['LEGAL-2014-BRISTOL-SETTLEMENT', 'LEGAL-2020-TAOS-ACCORD'],
    avatarSeed: 'WarrenderLegal'
  },
  {
    id: 'p-029',
    employeeId: 'GPC-1339-RES',
    name: 'Dr. Clara Zimmerman',
    title: 'Resonance Analyst',
    departmentId: 'dept-asian',
    departmentName: 'Atmospheric Sensing & Infrasonic Array Network',
    clearance: 'Level 3 - Secret',
    stationId: 'st-16',
    stationName: 'Appalachian Seismic-Acoustic Station - Black Ridge, WV',
    status: 'Active',
    hireDate: '2019-07-08',
    email: 'c.zimmerman@asian.globalparadigms.corp',
    phoneExtension: 'x1604',
    biography:
      'Geophysicist out of a state survey office. Monitors the old coal seams under Black Ridge, which move more than the local population would like, and files weekly.',
    classifiedNotes:
      'Recorded the Singing Seam during hydraulic injection testing — a sustained tone from an unmined panel three hundred metres down, on pitch, for eleven hours. Her write-up is in the audio archive. Two of the three people who listened to the raw file at full gain reported headaches within the hour; that detail is not in the write-up.',
    linkedDocuments: ['AUDIO-05-BLACK-RIDGE-SEISMIC', 'DOC-2020-SINGING-SEAM'],
    avatarSeed: 'ClaraZimmerman'
  },
  {
    id: 'p-030',
    employeeId: 'GPC-1402-TEC',
    name: 'Niall O’Connor',
    title: 'Maintenance Supervisor, Sub-Basement',
    departmentId: 'dept-siso',
    departmentName: 'Subterranean Infrastructure & Station Operations',
    clearance: 'Level 2 - Confidential',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2015-03-01',
    email: 'n.oconnor@siso.globalparadigms.corp',
    phoneExtension: 'x0088',
    biography:
      'Looks after the chilled water, the dampers and the noise isolation on Basement Level 5. Union rep, informally, because he is the one who knows what everybody is paid.',
    classifiedNotes:
      'Reported a metallic ring in Sub-Basement 5 at closing time. Given ear dampeners and a compound he was told is for allergies. He has since stopped reporting it, which is not the same as it having stopped. His staff card was reissued twice in 2023 without explanation; nobody has told him why and the log does not record who requested it.',
    linkedDocuments: ['LOG-2023-SUBBASEMENT-MAINT', 'TRAIN-MOD-204'],
    avatarSeed: 'NiallOConnor'
  },
  {
    id: 'p-031',
    employeeId: 'GPC-1445-BIO',
    name: 'Dr. Hiroshi Tanaka',
    title: 'Neural Synchronisation Researcher',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-03',
    stationName: 'Pacific Basin Analytics - Tokyo Chiyoda Deep Tower',
    status: 'Active',
    hireDate: '2013-09-14',
    email: 'h.tanaka@pefd.globalparadigms.corp',
    phoneExtension: 'x3022',
    biography:
      "EEG work, alpha and theta phase-locking under ambient sound. His finding that a building can hold a frequency that reliably changes a room's mood is the quiet foundation of half this company's client work.",
    classifiedNotes:
      'Wrote the delivery firmware for the VeriPulse band. When the wristbands started causing tremors he filed the correction and asked for a full recall; the recall was ordered six weeks later and the delay is on the record, not on him. Since then he has kept his own copies of the test data. He is the third person I have written that sentence about.',
    linkedDocuments: ['PROD-VERIPULSE-RECALL', 'DOC-2008-PHASE-LOCKING-DATA'],
    avatarSeed: 'HiroshiTanaka'
  },
  {
    id: 'p-032',
    employeeId: 'GPC-1502-FOR',
    name: 'Zhenya Petrov',
    title: 'Senior Forecaster',
    departmentId: 'dept-sfpc',
    departmentName: 'Department of Strategic Forecasting & Predictive Chronology',
    clearance: 'Level 3 - Secret',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2020-01-15',
    email: 'z.petrov@sfpc.globalparadigms.corp',
    phoneExtension: 'x4419',
    biography:
      'Economist, hired for the unrest model at twenty-six. Two years in and already the person the department sends to defend its numbers to clients, which he does well and without enjoying.',
    classifiedNotes:
      'His memo on broadcast time and voter turnout is the most quotable thing in the archive and should never be quoted. Note in the margin, not his handwriting: "This is a 2023 finding. It would also have been a 1993 finding. Nobody looked." Recommend his transfer request to Echo-State is approved; he is too good at this to keep in a room with clients.',
    linkedDocuments: ['DOC-2023-VOTER-APATHY-STUDY', 'TOOL-COMPLIANCE-METER'],
    avatarSeed: 'ZhenyaPetrov'
  },
  {
    id: 'p-033',
    employeeId: 'GPC-1550-MED',
    name: 'Dr. Astrid Lindberg',
    title: 'Medical Officer, Nordic Array',
    departmentId: 'dept-bhrr',
    departmentName: 'Bio-Harmonic Reclamation & Remediation',
    clearance: 'Level 3 - Secret',
    stationId: 'st-04',
    stationName: 'Nordic Acoustic Array - Station 07, Spitsbergen',
    status: 'Active',
    hireDate: '2018-11-01',
    email: 'a.lindberg@bhrr.globalparadigms.corp',
    phoneExtension: 'x0715',
    biography:
      'Physician, rural practice in Finnmark for six years before this. Looks after thirty-two people living directly above a working borehole. Most of the job is sleep.',
    classifiedNotes:
      'Her 2023 crew study notes that around seventy per cent of long-serving staff report hearing words in the background drone, and that the words are the same words. She asked for the study to be repeated with a control group at Gotland. The request was granted. Gotland has since been removed from the comparison because of "operational constraints".',
    linkedDocuments: ['DOC-2023-SVALBARD-CREW-HEALTH', 'AUDIO-01-SVALBARD-INFRASOUND'],
    avatarSeed: 'AstridLindberg'
  },
  {
    id: 'p-034',
    employeeId: 'GPC-1601-OPS',
    name: 'Diego Ramirez',
    title: 'Station Superintendent, Atacama',
    departmentId: 'dept-siso',
    departmentName: 'Subterranean Infrastructure & Station Operations',
    clearance: 'Level 3 - Secret',
    stationId: 'st-05',
    stationName: 'High-Altitude Infrasound Array - Atacama Trench Station, Chile',
    status: 'Active',
    hireDate: '2014-08-30',
    email: 'd.ramirez@siso.globalparadigms.corp',
    phoneExtension: 'x5001',
    biography:
      'Runs logistics at 4,800 metres: power, water, cryogenics, and the trucks that come up twice a week. Has kept the station alive through two funding freezes by calling in favours.',
    classifiedNotes:
      'Ordered the barometric array down in 2021 during the pressure event, against standing instructions. The array survived. The standing instruction was written by someone in London who has never been above sea level. Recommend the instruction is amended rather than the man.',
    linkedDocuments: ['DOC-2021-ATACAMA-EVENT-LOG'],
    avatarSeed: 'DiegoRamirez'
  },
  {
    id: 'p-035',
    employeeId: 'GPC-1678-AUD',
    name: 'Chloe Fontaine',
    title: 'Acoustic Forensics',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    clearance: 'Level 3 - Secret',
    stationId: 'st-02',
    stationName: 'North American Operational Hub - Rosslyn Sub-Complex, VA',
    status: 'Active',
    hireDate: '2021-03-15',
    email: 'c.fontaine@pefd.globalparadigms.corp',
    phoneExtension: 'x2066',
    biography:
      'Analyses recordings from the public — phones, doorbells, dashcams — and matches them against our own calibration logs. Took the job thinking it was a forensic consultancy.',
    classifiedNotes:
      'Runs the takedown queue for the sky-trumpet videos. 1,200 notices in three years; about a third of them match a GPC sweep to within a second. She keeps a private spreadsheet of the ones that do not and has never been asked what is in it. NOTE: someone will have to ask her eventually, and it should be someone senior.',
    linkedDocuments: ['DOC-2022-SKY-TRUMPET-ANALYSIS', 'DOC-2020-DMCA-ENFORCEMENT'],
    avatarSeed: 'ChloeFontaine'
  },
  {
    id: 'p-036',
    employeeId: 'GPC-1704-SEC',
    name: 'Frank Bedell',
    title: 'Head of Security, Site 19',
    departmentId: 'dept-siso',
    departmentName: 'Subterranean Infrastructure & Station Operations',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-06',
    stationName: 'Sub-Basin Containment Facility - Site 19, Utah',
    status: 'Active',
    hireDate: '2009-12-01',
    email: 'f.bedell@siso.globalparadigms.corp',
    phoneExtension: 'x1904',
    biography:
      'Contract security before this; fifteen years in the same facility. Knows the perimeter, the camouflage programme and every rancher within forty kilometres, three of whom he has on retainer in all but name.',
    classifiedNotes:
      'Holds the authorisation for lethal force at Fissure Chamber 04 and has asked twice what is in Chamber 04. Told to stop asking. He has stopped asking and now walks the boundary of Chamber 04 once a week by himself, which is not a complaint, it is an observation, and I am filing it as one.',
    linkedDocuments: ['DOC-2019-SITE19-SECURITY-ORDER'],
    avatarSeed: 'FrankBedell'
  },
  {
    id: 'p-037',
    employeeId: 'GPC-1780-FOR',
    name: 'Dr. Anya Sharma',
    title: 'Demographic Modeller',
    departmentId: 'dept-sfpc',
    departmentName: 'Department of Strategic Forecasting & Predictive Chronology',
    clearance: 'Level 3 - Secret',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2019-09-01',
    email: 'a.sharma@sfpc.globalparadigms.corp',
    phoneExtension: 'x4430',
    biography:
      'Machine learning, supply chains, then populations. Built the curfew-compliance model in six weeks in 2022 and has been uneasy about the results ever since, which is the correct reaction.',
    classifiedNotes:
      'Her finding — that cellular delivery raises curfew compliance by around a third — is what the municipal contracts are actually about, whatever the annexes say. She has asked for the compliance model to be published in a peer-reviewed journal. Request refused. She asked why, in writing. That email is in the vault and should stay there.',
    linkedDocuments: ['DOC-2023-CELLULAR-CARRIER-STUDY', 'TOOL-EVACUATION-CALC'],
    avatarSeed: 'AnyaSharma'
  },
  {
    id: 'p-038',
    employeeId: 'GPC-1822-ENG',
    name: 'Kasper Vang',
    title: 'Hydrophone Engineer',
    departmentId: 'dept-asian',
    departmentName: 'Atmospheric Sensing & Infrasonic Array Network',
    clearance: 'Level 3 - Secret',
    stationId: 'st-19',
    stationName: 'Mid-Atlantic Ridge Array Node 14 - Azores Seabed Station',
    status: 'Active',
    hireDate: '2017-06-20',
    email: 'k.vang@asian.globalparadigms.corp',
    phoneExtension: 'x1914',
    biography:
      'Fibre-optic telemetry on the seabed. Keeps Node 14 running at 3,200 metres, which means he spends nine weeks a year on a boat and the rest of it wishing he were on the boat.',
    classifiedNotes:
      'Reported harmonic coupling between the ocean array and the North American grid in 2022 — the sea and the substations humming at each other. His note was passed to the utilities desk and to nobody else. He believes it went to the board. Recommend we let him keep believing that.',
    linkedDocuments: ['DOC-2022-AZORES-GRID-COUPLING'],
    avatarSeed: 'KasperVang'
  },
  {
    id: 'p-039',
    employeeId: 'GPC-1890-BIO',
    name: 'Dr. Rebecca Osei',
    title: 'Bio-Acoustic Toxicologist',
    departmentId: 'dept-bhrr',
    departmentName: 'Bio-Harmonic Reclamation & Remediation',
    clearance: 'Level 3 - Secret',
    stationId: 'st-21',
    stationName: 'Sub-Saharan Demographic Monitor - Kigali Urban Lab',
    status: 'Active',
    hireDate: '2016-01-18',
    email: 'r.osei@bhrr.globalparadigms.corp',
    phoneExtension: 'x2104',
    biography:
      'Tissue response to sustained low frequency, which is a small field and a depressing one. Runs the exposure studies at Kigali and publishes the harmless parts.',
    classifiedNotes:
      'Her paper on vascular micro-rupture risk in crowds exposed to focused infrasound is the single most damaging document in this archive and she knows it. It sits at Level 4. She has been told it is withheld pending peer review; peer review was completed in 2022. Do not let her find that out.',
    linkedDocuments: ['DOC-2018-VASCULAR-ACOUSTIC-RISK', 'TRAIN-MOD-204'],
    avatarSeed: 'RebeccaOsei'
  },
  {
    id: 'p-040',
    employeeId: 'GPC-1944-PR',
    name: 'Tessa Ashby',
    title: 'Narrative Strategist',
    departmentId: 'dept-topn',
    departmentName: 'Tactical Obfuscation & Public Narrative',
    clearance: 'Level 3 - Secret',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2020-04-01',
    email: 't.ashby@topn.globalparadigms.corp',
    phoneExtension: 'x3844',
    biography:
      'Daughter of the chief executive, which she is tired of hearing about. Writes the sustainability reports, the ESG annexes and the language that turns acoustic testing into ambient wellbeing.',
    classifiedNotes:
      'She coined "Civic Tranquility Ambient Infrastructure" for the Vesper disclosures. It is now in four languages and two sovereign filings. Worth noting that she asked, in 2022, whether the tone was audible to children under five. The answer given was that it was not. The answer was not true.',
    linkedDocuments: ['PR-2022-SUSTAINABLE-HARMONY', 'REP-2025-ANNUAL-DISCLOSURE'],
    avatarSeed: 'TessaAshby'
  },
  {
    id: 'p-041',
    employeeId: 'GPC-2001-OPS',
    name: 'Commander Bruce Halloran',
    title: 'Vault Operations Officer (in medical isolation)',
    departmentId: 'dept-siso',
    departmentName: 'Subterranean Infrastructure & Station Operations',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-04',
    stationName: 'Nordic Acoustic Array - Station 07, Spitsbergen',
    status: 'Quarantined',
    hireDate: '2008-10-10',
    email: 'b.halloran@siso.globalparadigms.corp',
    phoneExtension: 'x0704',
    biography:
      'Ran heavy drilling at Station 07 from 2010 until the 2019 breach. Eleven years of sinking shafts through permafrost and into whatever is under it. No relation to the Thorne family; the archive’s earlier cross-reference was an indexing error.',
    classifiedNotes:
      'In isolation at Yellowknife since December 2019. Does not sleep. Vocalises continuously at a pitch the medical officer measures, off the record, at 14.8Hz with harmonics. Two orderlies have asked to be reassigned. The isolation room is soundproofed to a standard that his voice does not respect.',
    linkedDocuments: ['DOC-2020-HALLORAN-QUARANTINE-LOG', 'AUDIO-01-SVALBARD-INFRASOUND'],
    avatarSeed: 'BruceHalloran'
  },
  {
    id: 'p-042',
    employeeId: 'GPC-2055-ARC',
    name: 'Nora Beaumont',
    title: 'Digitisation Archivist',
    departmentId: 'dept-airs',
    departmentName: 'Archive Integrity & Retrospective Scrubbing',
    clearance: 'Level 2 - Confidential',
    stationId: 'st-10',
    stationName: 'Balkan Harmonic Calibration Center - Postojna Caverns, Slovenia',
    status: 'Active',
    hireDate: '2022-05-15',
    email: 'n.beaumont@airs.globalparadigms.corp',
    phoneExtension: 'x1018',
    biography:
      'Scans microfilm, eleven hours a day, at a rate of about four thousand frames a week. Contract staff. Not briefed on the content of anything she handles, which is what makes what she found so awkward.',
    classifiedNotes:
      'While indexing the 1978 board minutes she found a distribution list with a fourth founding partner on it, listed only as "the Anchor", and a matching signature page where that name has been painted over rather than removed. She reported it to the curator. She has also kept a photograph on her own phone. Request to search her quarters was declined by Legal on the grounds that she would find out.',
    linkedDocuments: ['DOC-1978-BOARD-MINUTES', 'TOOL-REDACTION-RECON'],
    avatarSeed: 'NoraBeaumont'
  },
  {
    id: 'p-043',
    employeeId: 'GPC-2101-DIR',
    name: 'Dr. Ronald Abernathy',
    title: 'Chief Compliance & Vetting Officer',
    departmentId: 'dept-becm',
    departmentName: 'Behavioral Economics & Compliance Metrics',
    clearance: 'Level 4 - Top Secret',
    stationId: 'st-01',
    stationName: 'Global HQ - Tower Obsidian, London',
    status: 'Active',
    hireDate: '2011-04-05',
    email: 'r.abernathy@becm.globalparadigms.corp',
    phoneExtension: 'x3040',
    biography:
      'Occupational psychologist. Runs the vetting interviews, the loyalty screening and the twelve-question stability form that every Level 4 renewal depends on. Believes in the process in a way that makes people uncomfortable.',
    classifiedNotes:
      'The twelve questions are chosen so that three of them are unanswerable honestly, which gives him something to hold at renewal. He has never had a renewal refused and never explained what he does with the answers. Chief of Staff note, 2022: handle with care, do not socialise with.',
    linkedDocuments: ['TRAIN-MOD-412', 'TOOL-BEHAVIORAL-TRACKER'],
    avatarSeed: 'RonaldAbernathy'
  },
  {
    id: 'p-044',
    employeeId: 'GPC-2199-TEC',
    name: 'Ingrid Holm',
    title: 'Cryogenic Sensor Technician',
    departmentId: 'dept-asian',
    departmentName: 'Atmospheric Sensing & Infrasonic Array Network',
    clearance: 'Level 2 - Confidential',
    stationId: 'st-04',
    stationName: 'Nordic Acoustic Array - Station 07, Spitsbergen',
    status: 'Active',
    hireDate: '2021-09-01',
    email: 'i.holm@asian.globalparadigms.corp',
    phoneExtension: 'x0722',
    biography:
      'Keeps the helium loops cold for the SQUID sensors, which is three days of work a week and four days of waiting. Twenty-six years old. Has not yet signed a second contract and has not said whether she will.',
    classifiedNotes:
      'Reported frost forming in concentric rings around the primary shaft, evenly spaced, same spacing every time. Photographed it. The photograph has been seen by four people and studied by one, who resigned.',
    linkedDocuments: ['DOC-2023-ICE-CRYSTAL-ANOMALY'],
    avatarSeed: 'IngridHolm'
  },
  {
    id: 'p-045',
    employeeId: 'GPC-2250-LEAK',
    name: 'David Wren',
    title: 'Systems Analyst (terminated; clearance revoked)',
    departmentId: 'dept-sfpc',
    departmentName: 'Department of Strategic Forecasting & Predictive Chronology',
    clearance: 'Level 4 - Top Secret (REVOKED)',
    stationId: 'st-02',
    stationName: 'North American Operational Hub - Rosslyn Sub-Complex, VA',
    status: 'Terminated',
    hireDate: '2016-08-10',
    email: 'd.wren@sfpc.globalparadigms.corp',
    phoneExtension: 'x4488',
    biography:
      'Systems engineer, ran the integration between the forecasting model and the municipal tone controllers. Left the company in 2024 by the simple method of posting his source code somewhere public and not coming in.',
    classifiedNotes:
      'Currently in hiding, believed Eastern Europe. His dump linked the forecast outputs to the calibration schedule in a way that four separate auditors had missed. Nothing on the internal estate was removed by him, which is why we know how much he took. Old colleagues describe him as the last person who would do this. That is the second time this year I have written that sentence about a Level 4 analyst.',
    linkedDocuments: ['DOC-2024-LEAK-DUMP-SYS', 'EML-2024-LEAK-CONTAINMENT'],
    avatarSeed: 'DavidWren'
  }
];
