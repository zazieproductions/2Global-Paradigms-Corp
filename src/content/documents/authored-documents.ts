import type { DocumentRecord } from '@/types';

/**
 * Hand-authored archive documents (doc-001 … doc-025).
 * These carry the core narrative. Add new authored documents here.
 *
 * House style for this file: these are working papers, not literature. They
 * were written by engineers, lawyers and clerks on deadline, and several of
 * them are visibly worse than the others. Keep it that way.
 */
export const AUTHORED_DOCUMENTS: DocumentRecord[] = [
  // FOUNDING & HISTORICAL (1971-1989)
  {
    id: 'doc-001',
    code: 'DOC-1971-FOUNDING',
    title: 'Charter of Establishment: Paradigms Systems Ltd.',
    category: 'Executive Order',
    departmentId: 'dept-egspu',
    departmentName: 'Executive Governance & Special Projects Unit',
    author: 'Dr. Arthur Sedley & Eleanor Cross',
    date: '1971-04-12',
    clearance: 'Level 5 - Black Dossier',
    summary:
      'Founding covenant, executed in Cambridge. Registers the company for work on probabilistic forecasting and lithospheric acoustics. Two pages, unusually short for what it did.',
    content:
      'Executed in the City of Cambridge, 12 April 1971. The undersigned establish PARADIGMS SYSTEMS LIMITED to investigate macro-temporal probabilistic mechanics and [REDACTED: the 14.8Hz subterranean carrier identified in East Anglia]. Initial capital £50,000, from [REDACTED: a single government account].',
    redactedContent:
      'BY THIS COVENANT, executed in the City of Cambridge on this twelfth day of April, 1971, the undersigned establish PARADIGMS SYSTEMS LIMITED for the purpose of investigating macro-temporal probabilistic mechanics and the 14.8Hz subterranean carrier identified beneath East Anglia. Initial capital of £50,000, drawn in full from the Special Intelligence Fund of the Ministry of Defence. Two signatures. No witnesses.',
    tags: ['Founding', 'Charter', 'Cambridge', 'Historical'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    relatedPersonnel: ['p-001', 'p-002'],
    relatedStations: ['st-01'],
    downloadableFilename: 'GPC_Charter_1971_Declassified.pdf'
  },
  {
    id: 'doc-002',
    code: 'DOC-1974-CAMBRIDGE-BASELINE',
    title: 'Detection of a continuous 14.8Hz oscillation beneath Cambridgeshire',
    category: 'Research Paper',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    author: 'Dr. Arthur Sedley',
    date: '1974-09-18',
    clearance: 'Level 4 - Top Secret',
    summary:
      'Three geophone stations, one tone, no decay over eighty miles. Sedley wrote this one himself, which is why it is shorter and worse than the papers his staff produced.',
    content:
      'Three geophone stations across Cambridgeshire register an unbroken sinusoid at 14.802 Hz, amplitude [REDACTED: 78dB above crustal noise]. No attenuation over 80 miles. It is not possible for this to be [REDACTED: a tectonic or industrial source].',
    redactedContent:
      'Three geophone stations across Cambridgeshire register an unbroken sinusoid at 14.802 Hz, amplitude 78dB above crustal noise. No attenuation over 80 miles. It is not possible for this to be a tectonic or industrial source. I have run the waveform against every known geological process and against three of the standard atmospheric models. The signature is artificial. Something under the county is transmitting, and it has been transmitting for a very long time.',
    tags: ['Infrasound', 'Baseline', 'Geology', 'Discovery'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-001'],
    relatedStations: ['st-01'],
    downloadableFilename: 'Sedley_Cambridge_Infrasound_1974.pdf'
  },
  {
    id: 'doc-003',
    code: 'DOC-1978-SUBWAY-TRIAL',
    title: 'Field report: Central Line audio trial, Holborn and Oxford Circus',
    category: 'Field Report',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    author: 'Dr. Arthur Sedley',
    date: '1978-06-14',
    clearance: 'Level 4 - Top Secret',
    summary:
      'First live test of the carrier on a civilian population, run under a station-announcement upgrade. Read the last line before you decide what kind of company this is.',
    content:
      'On 12 June, 17:30–19:00, a 432Hz/14.8Hz harmonic carrier was fed through the public address at Holborn and Oxford Circus. Transit velocity monitored. [REDACTED: Passenger disputes fell 38.2%; platform dwell time fell 14%].',
    redactedContent:
      'On 12 June, 17:30–19:00, a 432Hz/14.8Hz harmonic carrier was fed through the public address at Holborn and Oxford Circus. Transit velocity monitored. Passenger disputes fell 38.2%; platform dwell time fell 14%. No passenger reported awareness of any sound. Three per cent reported a metallic taste. Recommend we do not test in summer, when the windows are open.',
    tags: ['Project Vesper', 'Transit', 'London', 'Entrainment'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-001', 'p-007'],
    relatedStations: ['st-01'],
    downloadableFilename: 'London_Subway_Trial_Report_1978.pdf'
  },
  {
    id: 'doc-004',
    code: 'DOC-1979-SITE19-GROUNDBREAKING',
    title: 'Site survey and excavation proposal: Great Salt Lake sub-basin',
    category: 'Technical Spec',
    departmentId: 'dept-siso',
    departmentName: 'Subterranean Infrastructure & Station Operations',
    author: 'Chief Geologist Owen Bragg',
    date: '1979-09-20',
    clearance: 'Level 3 - Secret',
    summary:
      'Why the company chose a salt flat in Utah to put a hole in: the halite absorbs almost everything, including, as it turns out, sound that is supposed to stay underground.',
    content:
      'Deep halite strata at the Great Salt Lake give better acoustic dampening than anything we have measured. Sub-Levels 1 to 4 to proceed under cover of a [REDACTED: Department of the Interior mineral survey]. Anchor loads must be rated for [REDACTED: 120dB of sustained low-frequency crustal pressure].',
    redactedContent:
      'Deep halite strata at the Great Salt Lake give better acoustic dampening than anything we have measured. Sub-Levels 1 to 4 to proceed under cover of a Department of the Interior mineral survey. Anchor loads must be rated for 120dB of sustained low-frequency crustal pressure from the Salt Lake mantle fissure. Note for the file: the strata are excellent at absorbing sound from below. They are equally good at holding it in. If we ever have to go down there and turn something off, the dampening will be working against us.',
    tags: ['Site 19', 'Utah', 'Engineering', 'Salt Dome'],
    classificationStamp: 'SECRET // NOFORN',
    relatedPersonnel: ['p-012', 'p-036'],
    relatedStations: ['st-06'],
    downloadableFilename: 'Site19_Excavation_Blueprint_1979.pdf'
  },
  {
    id: 'doc-005',
    code: 'DOC-1984-AETHELGARD-BLUEPRINT',
    title: 'Executive Directive 04: continuity redoubts and the Heritage Cohort',
    category: 'Executive Order',
    departmentId: 'dept-ccdr',
    departmentName: 'Division of Civic Continuity & Demographic Resilience',
    author: 'Dame Eleanor Cross',
    date: '1984-10-05',
    clearance: 'Level 5 - Black Dossier',
    summary:
      'Authorises fourteen sovereign redoubts and the names that go in them. Written in 1984, twelve years before anything the company says it was preparing for.',
    content:
      'On a declaration of catastrophic civil divergence or an un-attenuated [REDACTED: 14.8Hz surge], governance of contracted states passes automatically to the [REDACTED: Grimsel Pass redoubt]. Life support guaranteed for 720 days of total isolation.',
    redactedContent:
      "On a declaration of catastrophic civil divergence, biological destabilisation, or an un-attenuated 14.8Hz surge, governance of contracted states passes automatically to the Swiss Alps Redoubt at Grimsel Pass. Life support guaranteed for 720 days of total isolation for the 10,000 enrolled members of the Tier-1 Heritage Cohort. Enrolment is by invitation and the invitations are not the board's to make. See Annex C. Do not circulate Annex C.",
    tags: ['Project Aethelgard', 'Swiss Alps', 'Continuity', 'Executive'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    relatedPersonnel: ['p-002', 'p-010'],
    relatedStations: ['st-08', 'st-13', 'st-20'],
    downloadableFilename: 'Project_Aethelgard_Charter_1984.pdf'
  },
  {
    id: 'doc-006',
    code: 'DOC-1986-SVALBARD-COMMISSION',
    title: 'Commissioning log: Station 07, Spitsbergen',
    category: 'Technical Spec',
    departmentId: 'dept-asian',
    departmentName: 'Atmospheric Sensing & Infrasonic Array Network',
    author: 'Dr. Henrik Lindqvist',
    date: '1986-11-10',
    clearance: 'Level 2 - Confidential',
    summary:
      'Routine paperwork on the opening of Station 07. Six microbarometers, four geophones, one generator, minus twenty-four degrees.',
    content:
      'Station 07 operational 08:00 UTC. Six cryogenic microbarometers and four deep-permafrost geophones calibrated and reading. Ambient -24C. Telemetry to London via satellite relay, 40-minute sync.',
    tags: ['Station 07', 'Svalbard', 'Commissioning', 'Arctic'],
    classificationStamp: 'RESTRICTED',
    relatedPersonnel: ['p-018'],
    relatedStations: ['st-04'],
    downloadableFilename: 'Station07_Commissioning_Log_1986.pdf'
  },
  {
    id: 'doc-007',
    code: 'DOC-1989-SVALBARD-EVENT',
    title: 'Incident record: Borehole 4 cavity breach, loss of personnel',
    category: 'Incident Log',
    departmentId: 'dept-siso',
    departmentName: 'Subterranean Infrastructure & Station Operations',
    author: 'Chief Engineer Sarah Lin',
    date: '1989-11-04',
    clearance: 'Level 5 - Black Dossier',
    summary:
      'The drill went into an open void at 820 metres. What came back up the shaft was not air. Filed by the duty engineer, who then spent the rest of her career at other stations.',
    content:
      'At 03:14 UTC drill string 4 entered an open void at -820m. Acoustic surge up the shaft measured [REDACTED: 134dB at 14.8Hz]. Dr. Arthur Sedley entered the hoist cage and descended, against standing orders. Hoist cable parted at -740m. [REDACTED: No remains recovered; declared disavowed].',
    redactedContent:
      'At 03:14 UTC drill string 4 entered an open void at -820m. Acoustic surge up the shaft measured 134dB at 14.8Hz. Dr. Arthur Sedley entered the hoist cage and descended, against standing orders and against the express instruction of the station chief. Hoist cable parted at -740m. No remains recovered; declared disavowed and purged under Directive 09. The void below -820m is open to a depth we cannot measure. Recommend the shaft is not logged as an engineering failure, because it was not one. He went down on purpose and the cage came back up empty, twice, with the second descent logged at 04:32 and no one in it.',
    tags: ['Station 07', 'Breach', 'Sedley', 'Classified'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    relatedPersonnel: ['p-001', 'p-018', 'p-012'],
    relatedStations: ['st-04'],
    downloadableFilename: 'Station07_Borehole4_Breach_1989.pdf'
  },
  {
    id: 'doc-008',
    code: 'DOC-1989-VESPER-CHARTER',
    title: 'Operational blueprint: municipal harmonic network',
    category: 'Dossier',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    author: 'Dr. Naomi Chen',
    date: '1989-11-20',
    clearance: 'Level 4 - Top Secret',
    summary:
      'Vesper in its first form, three weeks after Svalbard. An engineering document about evening tones in transit systems that reads, in places, like a hymn.',
    content:
      'Vesper puts a working acoustic perimeter through the transit nodes of a city. A tri-tonal cluster (396 / 528 / 639 Hz) modulated by a [REDACTED: 0.35Hz entrainment wave] reduces evening assembly impulses by [REDACTED: 42%].',
    redactedContent:
      'Vesper puts a working acoustic perimeter through the transit nodes of a city. A tri-tonal cluster (396 / 528 / 639 Hz) modulated by a 0.35Hz entrainment wave reduces evening assembly impulses by 42% across the commuter peak. Deployment cost per city is roughly a new tram line and a fraction of the policing it replaces, which is the argument that will be put to the treasuries. The tone is not audible. Nobody will ever know it is there. I have signed the sheet because the numbers work, and I would like the record to show that I asked what happens to the ones who can hear it anyway.',
    tags: ['Project Vesper', 'Acoustics', 'Transit', 'Compliance'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-007', 'p-008'],
    relatedStations: ['st-01', 'st-02'],
    downloadableFilename: 'Project_Vesper_Master_Blueprint_1989.pdf'
  },

  // EXPANSION ERA (1990-2009)
  {
    id: 'doc-009',
    code: 'DOC-1992-RESON8-SPECS',
    title: 'Specification: Reson-8 dual-oscillator board',
    category: 'Technical Spec',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    author: 'Dr. Hiroshi Tanaka',
    date: '1992-02-14',
    clearance: 'Level 3 - Secret',
    summary:
      'The consumer sleep machine, in schematic form. Two oscillators 6.8Hz apart, wired straight into the mains. It shipped in that state for two years.',
    content:
      'Left channel fixed at 216.0Hz, right at 222.8Hz, producing a 6.8Hz binaural differential in headphones. Power stage couples to [REDACTED: an unshielded mains transformer].',
    redactedContent:
      'Left channel fixed at 216.0Hz, right at 222.8Hz, producing a 6.8Hz binaural differential in headphones. Power stage couples to an unshielded mains transformer, so domestic wiring at 50 or 60Hz behaves as a second, uncontrolled radiator. I flagged the coupling in February and was told the enclosure would screen it. The enclosure does not screen it. Recommended fix is a Faraday cage in the base at 40p a unit; the decision is above my floor.',
    tags: ['Reson-8', 'Schematic', 'Consumer', 'Patent'],
    classificationStamp: 'SECRET // NOFORN',
    relatedPersonnel: ['p-031'],
    relatedStations: ['st-02'],
    downloadableFilename: 'Reson8_Engineering_Schematics_1992.pdf'
  },
  {
    id: 'doc-010',
    code: 'DOC-1994-RESON8-CASUALTIES',
    title: 'Casualty audit: Reson-8 neurological cases, 1992–1994',
    category: 'Incident Log',
    departmentId: 'dept-bhrr',
    departmentName: 'Bio-Harmonic Reclamation & Remediation',
    author: 'Dr. Marcus Saito',
    date: '1994-04-28',
    clearance: 'Level 5 - Black Dossier',
    summary:
      'Eighty-two hospital admissions and four deaths, taken from fourteen hospital systems. The phrase "shared hallucination" appears in this file forty-one times.',
    content:
      'Fourteen hospitals, 82 admissions, 4 deaths. Presentation: sleep paralysis, tachycardia, and [REDACTED: shared auditory hallucinations of a voice behind domestic walls]. [REDACTED: total settlement £48.2M].',
    redactedContent:
      'Fourteen hospitals, 82 admissions, 4 deaths. Presentation: sleep paralysis, tachycardia, and shared auditory hallucinations of a voice behind domestic walls. The voice was described identically by patients who had never met and by patients in four countries: quiet, male, and reading out a number. Total settlement £48.2M paid through Swiss escrow with gag orders attached. Twelve thousand units remain unaccounted for. They were recalled and crushed, which is true, and they were not all crushed at the same site, which is also true.',
    tags: ['Reson-8', 'Casualties', 'Recall', 'Medical'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    relatedPersonnel: ['p-020', 'p-028'],
    relatedStations: ['st-02'],
    downloadableFilename: 'Reson8_Coroner_Audit_Classified_1994.pdf'
  },
  {
    id: 'doc-011',
    code: 'DOC-1994-PALIMPSEST-MANUAL',
    title: 'Palimpsest: standing procedure for retroactive redaction (1994 issue)',
    category: 'Memorandum',
    departmentId: 'dept-airs',
    departmentName: 'Archive Integrity & Retrospective Scrubbing',
    author: 'Julian Naylor',
    date: '1994-06-01',
    clearance: 'Level 5 - Black Dossier',
    summary:
      'The three-step procedure, in plain language, with a note at the end that somebody added much later and never removed.',
    content:
      'On reaching a casualty or anomaly threshold, AIRS officers execute in order:\n1. Extract and incinerate the primary paper dossier.\n2. Inject hash collisions across all digital backups.\n3. Re-attribute the incident publicly to [REDACTED: utility failure, gas venting or weather].',
    redactedContent:
      'On reaching a casualty or anomaly threshold, AIRS officers execute in order:\n1. Extract and incinerate the primary paper dossier.\n2. Inject hash collisions across all digital backups.\n3. Re-attribute the incident publicly to utility failure, gas venting or weather.\n\nStep 3 is the only part that has to be done well and it is the part we spend the least time on. The wording is drafted by the communications desk and nobody in this office reads it. Two of the four phrasings in the annex are, on their face, not credible.\n\nMargin note, undated, in a later hand: The originals are kept. That has always been the arrangement and it is the only reason any of this is still recoverable. Read the procedure again. Nowhere in it does it say a record is destroyed. Line 1 says the paper leaves the building.',
    tags: ['Project Palimpsest', 'Redaction', 'AIRS', 'Protocol'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    relatedPersonnel: ['p-022', 'p-023'],
    relatedStations: ['st-10'],
    downloadableFilename: 'Palimpsest_SOP_Manual_1994.pdf'
  },
  {
    id: 'doc-012',
    code: 'DOC-1998-POSTOJNA-SURVEY',
    title: 'Structural report: Postojna cavern vaults, suitability for microfilm',
    category: 'Technical Spec',
    departmentId: 'dept-siso',
    departmentName: 'Subterranean Infrastructure & Station Operations',
    author: 'Chief Engineer Sarah Lin',
    date: '1998-03-22',
    clearance: 'Level 3 - Secret',
    summary:
      'A cave in Slovenia that absorbs eighty decibels and sits outside every surveillance jurisdiction the company has ever had to worry about. Chosen for the microfilm archive.',
    content:
      'Postojna karst gives natural dampening above 80dB from 1Hz to 100Hz. Humidistatic chambers to hold [REDACTED: 400,000 canisters from 1971 onward], immune to EMP and satellite survey.',
    redactedContent:
      'Postojna karst gives natural dampening above 80dB from 1Hz to 100Hz. Humidistatic chambers to hold 400,000 canisters from 1971 onward, immune to EMP and satellite survey. The site is not a data centre and should never be described as one in writing. Data is elsewhere. This is where the paper lives: every original that has ever been pulled from circulation, catalogued by year and kept dry. I have signed the drawings. I have not been asked to sign anything about the contents.',
    tags: ['Postojna', 'Slovenia', 'Vault', 'Archive'],
    classificationStamp: 'SECRET // NOFORN',
    relatedPersonnel: ['p-012', 'p-022'],
    relatedStations: ['st-10'],
    downloadableFilename: 'Postojna_Caverns_Geological_Survey_1998.pdf'
  },
  {
    id: 'doc-013',
    code: 'DOC-2001-DIEGO-BEACON',
    title: 'Hydrophone 12: first interception of the 54Hz sweep',
    category: 'Field Report',
    departmentId: 'dept-asian',
    departmentName: 'Atmospheric Sensing & Infrasonic Array Network',
    author: 'Dr. Tariq Al-Mansoor',
    date: '2001-12-04',
    clearance: 'Level 5 - Black Dossier',
    summary:
      'Something at the bottom of the Indian Ocean sweeps from 54 to 78Hz every 64 seconds, and the arithmetic of the sweep is too regular to be geology.',
    content:
      "Hydrophone 12, moored at -5,400m in the Chagos Trench, recorded a sweep from 54Hz to 78Hz repeating every 64 seconds, stable to [REDACTED: better than 0.001%]. Arrival vector places the source at [REDACTED: 2,900km down, in the D'' layer].",
    redactedContent:
      "Hydrophone 12, moored at -5,400m in the Chagos Trench, recorded a sweep from 54Hz to 78Hz repeating every 64 seconds, stable to better than 0.001% across eleven weeks. Arrival vector places the source at 2,900km down, in the D'' layer at the base of the mantle. Nothing in the oceanographic literature describes a source like this. The sweep is phase-locked to the Svalbard borehole to within one part in ten thousand, which means the two are the same instrument or the same conversation.",
    tags: ['Diego Garcia', 'Hydrophone', 'Project Monolith', 'Mantle'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    relatedPersonnel: ['p-025', 'p-018'],
    relatedStations: ['st-09', 'st-04'],
    downloadableFilename: 'Diego_Garcia_Mantle_Pulse_Log_2001.pdf'
  },
  {
    id: 'doc-014',
    code: 'DOC-2002-PARACALM-AUDIT',
    title: 'Paediatric audit: ParaCalm nursery units, 2000–2002',
    category: 'Incident Log',
    departmentId: 'dept-bhrr',
    departmentName: 'Bio-Harmonic Reclamation & Remediation',
    author: 'Dr. Diane Kowalski',
    date: '2002-09-14',
    clearance: 'Level 4 - Top Secret',
    summary:
      'Twelve thousand nursery machines, one firmware error, four hundred infants followed for two years. They stopped looking at faces and started looking at walls.',
    content:
      'Four hundred infants in Indiana tracked for 24 months. Abnormal auditory-cortex development in the exposed group, with prolonged fixation on structural walls and [REDACTED: speech onset delayed to age four]. All 12,000 units recalled; disposed of at [REDACTED: Site 19].',
    redactedContent:
      'Four hundred infants in Indiana tracked for 24 months. Abnormal auditory-cortex development in the exposed group, with prolonged fixation on structural walls and speech onset delayed to age four in the majority of cases. All 12,000 units recalled and disposed of at Site 19 in concrete-lined cells, because the disposal contractor refused to take them and we could not explain why. Two hundred and eleven of the children are now adults. Nobody in this company has ever asked what they are like.',
    tags: ['ParaCalm', 'Pediatric', 'Recall', 'Medical'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-021'],
    relatedStations: ['st-02', 'st-06'],
    downloadableFilename: 'ParaCalm_Pediatric_Clinical_Audit_2002.pdf'
  },
  {
    id: 'doc-015',
    code: 'DOC-2006-CHIME-SPECIFICATIONS',
    title: 'Chime-88 school bell module: specification and installation note',
    category: 'Technical Spec',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    author: 'Dr. Jonas Weiss',
    date: '2006-03-20',
    clearance: 'Level 3 - Secret',
    summary:
      'School bells, 4,200 districts. The point is not the bell. The point is teaching an entire generation what to do when they hear that interval.',
    content:
      'Chime-88 replaces the mechanical gong with a synthesised dual harmonic, 741Hz with a 1176Hz overtone. The pair produces fast autonomic alerting without conscious irritation, so that pupils respond immediately to [REDACTED: later municipal tone transitions].',
    redactedContent:
      'Chime-88 replaces the mechanical gong with a synthesised dual harmonic, 741Hz with a 1176Hz overtone. The pair produces fast autonomic alerting without conscious irritation, so that pupils respond immediately to later municipal tone transitions without needing to be told what they mean. The order book is 4,200 districts and the tender documents describe it as a hearing-safety product. I wrote the technical annex to those tenders. I would rather not have my name on the marketing.',
    tags: ['Project Chime', 'Schools', 'Conditioning', 'Acoustics'],
    classificationStamp: 'SECRET // NOFORN',
    relatedPersonnel: ['p-008'],
    relatedStations: ['st-02'],
    downloadableFilename: 'Project_Chime_Technical_Specs_2006.pdf'
  },
  {
    id: 'doc-016',
    code: 'DOC-2008-VERIPULSE-TRADING-FLOOR',
    title: 'Settlement dossier: Frankfurt trading floor, 15 September 2008',
    category: 'Legal Filing',
    departmentId: 'dept-topn',
    departmentName: 'Tactical Obfuscation & Public Narrative',
    author: 'Philip Warrender',
    date: '2008-09-22',
    clearance: 'Level 4 - Top Secret',
    summary:
      'Thirty-four traders, one wristband product, one very bad afternoon in Frankfurt. Settled quietly, all parties gagged.',
    content:
      'On 15 September 2008, 34 desk staff wearing VeriPulse bands experienced simultaneous motor tremor and phase-locking to the 50Hz building supply, during the Lehman collapse. [REDACTED: £34M in confidential settlements].',
    redactedContent:
      'On 15 September 2008, 34 desk staff wearing VeriPulse bands experienced simultaneous motor tremor and phase-locking to the 50Hz building supply, during the Lehman collapse. The insurer would have defended it and lost. £34M in confidential settlements with perpetual covenants, product line terminated within the week, firmware wiped by broadcast kill-signal. Note for the file: the tremors were not caused by the market. My own view is that the bands amplified something that was already in the room, and I have asked twice for the raw telemetry and been given a summary both times.',
    tags: ['VeriPulse', 'Legal', 'Settlement', 'Frankfurt'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-028', 'p-031'],
    relatedStations: ['st-01'],
    downloadableFilename: 'VeriPulse_Frankfurt_Settlement_2008.pdf'
  },

  // MODERN HEGEMONY (2010-2026)
  {
    id: 'doc-017',
    code: 'DOC-2011-OAKHAVEN-AUDIT',
    title: 'Post-mortem: Oakhaven municipal trial, termination of Phase 3',
    category: 'Dossier',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    author: 'Dr. Naomi Chen & Dr. Diane Kowalski',
    date: '2011-10-04',
    clearance: 'Level 4 - Top Secret',
    summary:
      'A whole town stopped in the street for four minutes and faced the same direction. Fourteen hundred people, one broadcast at six decibels over the limit.',
    content:
      'At 16:30 the carriers broadcast at +6dB over target. Approximately 1,400 residents stopped moving, on foot and in vehicles, facing north-northwest for [REDACTED: 4 minutes 12 seconds]. 42 cases of retrograde amnesia were treated with [REDACTED: Compound 88-T]. Local press archives seized.',
    redactedContent:
      'At 16:30 the carriers broadcast at +6dB over target. Approximately 1,400 residents stopped moving, on foot and in vehicles, facing north-northwest for 4 minutes 12 seconds. 42 cases of retrograde amnesia were treated with Compound 88-T. Local press archives seized and destroyed under Palimpsest. The residents were not panicking. That is the finding that ended the programme, and it is why the two of us have written this together rather than separately: a crowd in a panic runs. A crowd that has been called does not.',
    tags: ['Oakhaven', 'Project Vesper', 'Incident', 'Amnesia'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-007', 'p-021', 'p-016'],
    relatedStations: ['st-02'],
    downloadableFilename: 'Oakhaven_Trial_Complete_PostMortem_2011.pdf'
  },
  {
    id: 'doc-018',
    code: 'DOC-2012-CICADA-BLUEPRINT',
    title: 'Project Cicada: piezoelectric arrays in paved carriageway, I-80',
    category: 'Technical Spec',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    author: 'Lukas Meyer',
    date: '2012-06-01',
    clearance: 'Level 3 - Secret',
    summary:
      'A hundred and twenty miles of interstate that pays for its own tone out of tyre pressure. Nobody notices because everyone is on their way to work.',
    content:
      'Tyre compression at highway speed generates 12–18V per transducer module, which powers sub-surface resonant bars re-radiating a passive [REDACTED: 14.8Hz entrainment wave] into vehicle cabins.',
    redactedContent:
      'Tyre compression at highway speed generates 12–18V per transducer module, which powers sub-surface resonant bars re-radiating a passive 14.8Hz entrainment wave into vehicle cabins. Effect measured at 200 miles of carriageway: lower lane-change variance, lower average speed, fewer aggressive overtakes. I have been asked to describe this in the client papers as a "smoothness benefit". The bars are not snow-melt and they are not energy harvesting. They are a loudspeaker with no amplifier.',
    tags: ['Project Cicada', 'Highway', 'Piezoelectric', 'Transportation'],
    classificationStamp: 'SECRET // NOFORN',
    relatedPersonnel: ['p-027'],
    relatedStations: ['st-06', 'st-15'],
    downloadableFilename: 'Project_Cicada_Highway_Grid_2012.pdf'
  },
  {
    id: 'doc-019',
    code: 'DOC-2015-ECHO-STATE-ALGORITHM',
    title: 'Echo-London v1.4: multi-agent demographic twin, method and results',
    category: 'Research Paper',
    departmentId: 'dept-sfpc',
    departmentName: 'Department of Strategic Forecasting & Predictive Chronology',
    author: 'Dr. Evelyn Reed',
    date: '2015-07-02',
    clearance: 'Level 4 - Top Secret',
    summary:
      'Eight point eight million simulated Londoners, each with an anxiety parameter. Raise the carrier and watch the city go quiet in the model before it goes quiet in reality.',
    content:
      'Echo-London v1.4 tracks 8.8 million autonomous agents. Coupling agent anxiety to [REDACTED: simulated carrier amplitude] predicts the hour at which assembly impulses decay into apathy.',
    redactedContent:
      'Echo-London v1.4 tracks 8.8 million autonomous agents. Coupling agent anxiety to simulated carrier amplitude predicts the hour at which assembly impulses decay into apathy. Accuracy against the 2011–2014 municipal record is within eleven minutes for London and within the hour for Tokyo. I built the anxiety coupling because I was asked to model unrest, and I want the file to record that the model does not predict unrest. It predicts compliance, and it predicts it extremely well.',
    tags: ['Project Echo-State', 'Simulation', 'Algorithms', 'Demographics'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-005', 'p-006'],
    relatedStations: ['st-01'],
    downloadableFilename: 'EchoState_MultiAgent_Algorithm_2015.pdf'
  },
  {
    id: 'doc-020',
    code: 'DOC-2016-VITRUVIAN-EXECUTIVE',
    title: 'Project Vitruvian: ceiling-void resonators, Tower Obsidian and client sites',
    category: 'Technical Spec',
    departmentId: 'dept-pefd',
    departmentName: 'Psychoacoustics & Environmental Frequency Directorate',
    author: 'Lukas Meyer',
    date: '2016-04-18',
    clearance: 'Level 3 - Secret',
    summary:
      'Acoustic cavities tuned to 14.8 and 22.0Hz in the ceilings of executive floors. Thirty-two decibels of quiet, sold to clients as an air-handling feature.',
    content:
      'Concealed cavities in penthouse ceiling voids and lift shafts, tuned to 14.8Hz and 22.0Hz. Provides [REDACTED: 32dB of attenuation], isolating executive floors from the municipal tones in the streets below.',
    redactedContent:
      'Concealed cavities in penthouse ceiling voids and lift shafts, tuned to 14.8Hz and 22.0Hz. Provides 32dB of attenuation, isolating executive floors from the municipal tones in the streets below. Same detail as the Observation job in London, thirty-four client sites to date. Two notes for whoever inherits this: the cavities only work while they are empty, and the client is not told what they are tuned to. If anybody ever asks why the boardroom is silent and the pavement is not, that person has understood the building.',
    tags: ['Project Vitruvian', 'Architecture', 'Executive', 'Dampeners'],
    classificationStamp: 'SECRET // NOFORN',
    relatedPersonnel: ['p-027'],
    relatedStations: ['st-01'],
    downloadableFilename: 'Project_Vitruvian_Architectural_Specs_2016.pdf'
  },
  {
    id: 'doc-021',
    code: 'DOC-2018-COMPOUND88-SPECS',
    title: 'Compound 88-T: formulation and clinical note',
    category: 'Research Paper',
    departmentId: 'dept-bhrr',
    departmentName: 'Bio-Harmonic Reclamation & Remediation',
    author: 'Dr. Marcus Saito',
    date: '2018-11-20',
    clearance: 'Level 4 - Top Secret',
    summary:
      'Ear drops that quiet the Hum in 45 minutes, at the cost of music and most of your dreaming. Prescribed to staff who cannot be allowed to keep hearing it.',
    content:
      'Compound 88-T pairs an otic corticosteroid with a synthetic alkaloid that damps stereocilia resonance. Within 45 minutes it suppresses [REDACTED: perception of the Hum and of spoken phrases] in about nine cases in ten.',
    redactedContent:
      'Compound 88-T pairs an otic corticosteroid with a synthetic alkaloid that damps stereocilia resonance. Within 45 minutes it suppresses perception of the Hum and of spoken phrases in about nine cases in ten. The tenth case is usually a person who has decided to keep listening, and there is no formulation for that. Side effects: loss of musical appreciation, dream suppression, and in three recorded cases a persistent sense of having lost something that the patient cannot name. All three were research staff. None of them returned to field work.',
    tags: ['Compound 88-T', 'Pharmacology', 'Medical', 'Hygiene'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-020'],
    relatedStations: ['st-07'],
    downloadableFilename: 'Compound88T_Pharmacological_Specs_2018.pdf'
  },
  {
    id: 'doc-022',
    code: 'DOC-2019-PALIMPSEST-LEAK',
    title: 'Damage assessment: Station 07 exfiltration, November 2019',
    category: 'Incident Log',
    departmentId: 'dept-topn',
    departmentName: 'Tactical Obfuscation & Public Narrative',
    author: 'Agent Paul Kiernan',
    date: '2019-11-04',
    clearance: 'Level 5 - Black Dossier',
    summary:
      'Forty-eight gigabytes left Svalbard on a snowmobile and a satellite link. This is the file that says what was in them and what we are doing about it.',
    content:
      'Dr. Ewan Naylor downloaded the October telemetry set and pushed it out through an encrypted relay before leaving Longyearbyen. The files show the 14.8Hz signal is [REDACTED: not geological, and 18.4% stronger than at commissioning]. Directive 09 purge authorised.',
    redactedContent:
      'Dr. Ewan Naylor downloaded the October telemetry set and pushed it out through an encrypted relay before leaving Longyearbyen. The files show the 14.8Hz signal is not geological, is artificially modulated, and is 18.4% stronger than at commissioning. Directive 09 purge authorised; reward set at £250,000. Assessment: the bounty is a formality. He has already distributed copies to fourteen mirrors and to at least one party we cannot see. Recommend the emphasis of the operation shifts from recovery to discredit, and that the recovery language stays in the file for the auditors.',
    tags: ['Whistleblower', 'Naylor', 'Leaks', 'Station 07'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    isWhistleblowerLeak: true,
    relatedPersonnel: ['p-009', 'p-017', 'p-018'],
    relatedStations: ['st-04'],
    downloadableFilename: 'Palimpsest_Leak_Damage_Assessment_2019.pdf'
  },
  {
    id: 'doc-023',
    code: 'DOC-2021-SILENT-COHORT-LOG',
    title: 'Trial record: Silent Cohort, Grimsel Pass, 90 days',
    category: 'Field Report',
    departmentId: 'dept-ccdr',
    departmentName: 'Division of Civic Continuity & Demographic Resilience',
    author: 'Martin Sedley',
    date: '2021-12-15',
    clearance: 'Level 5 - Black Dossier',
    summary:
      'One hundred and twenty people under a kilometre of granite with the aerials physically removed. On day 45 they began having the same dream, and it was not about the mountain.',
    content:
      'By day 45, 38% of the cohort showed synchronised REM patterns. Subjects independently drew [REDACTED: a black hexagonal column at 14.8Hz] standing in permafrost. Establishes penetration of the carrier through deep rock.',
    redactedContent:
      'By day 45, 38% of the cohort showed synchronised REM patterns. Subjects independently drew the same object: a black hexagonal column at 14.8Hz standing in permafrost, drawn by people who have never been north of Interlaken and were not told anything about Svalbard. Establishes penetration of the carrier through deep rock, and something else about where it goes when it arrives. I have asked to run the trial again with a larger cohort. Three requests, no answer. My own reading is that an answer would require somebody to write down what is happening to the isolation group, and nobody wants to do that.',
    tags: ['Swiss Alps', 'Isolation', 'Dreams', 'Continuity'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    relatedPersonnel: ['p-011', 'p-002'],
    relatedStations: ['st-08'],
    downloadableFilename: 'Silent_Cohort_Trial_Log_2021.pdf'
  },
  {
    id: 'doc-024',
    code: 'DOC-2023-CELLULAR-CARRIER-STUDY',
    title: 'Cellular handset delivery of the sub-carrier: compliance results',
    category: 'Research Paper',
    departmentId: 'dept-becm',
    departmentName: 'Behavioral Economics & Compliance Metrics',
    author: 'Dr. Anya Sharma & Dr. Tobias Voss',
    date: '2023-09-01',
    clearance: 'Level 4 - Top Secret',
    summary:
      'The carrier, through a phone speaker, on a ringtone. Stay-at-home adherence moved from two-thirds to almost complete, and nobody complained.',
    content:
      'A 14.8Hz sub-carrier embedded in standard notification audio damped recipient cortisol response by 42% across 14 pilot metros. Adherence to emergency orders rose from [REDACTED: 67.2% to 98.6%].',
    redactedContent:
      'A 14.8Hz sub-carrier embedded in standard notification audio damped recipient cortisol response by 42% across 14 pilot metros. Adherence to emergency orders rose from 67.2% to 98.6% with no reported public resistance. The mechanism is not persuasion. People did not agree with the order; they stopped wanting to argue with it. We have asked for the study to be submitted to a journal and have been refused twice, on the ground that the pilot metros cannot be named. They cannot be named because there is nothing in the contract that mentions any of this.',
    tags: ['Cellular', 'Mobile', 'Compliance', 'Behavioral'],
    classificationStamp: 'TOP SECRET // EYES ONLY',
    relatedPersonnel: ['p-037', 'p-014'],
    relatedStations: ['st-01', 'st-03'],
    downloadableFilename: 'Cellular_Infrasound_Compliance_Study_2023.pdf'
  },
  {
    id: 'doc-025',
    code: 'DOC-2024-MONOLITH-SYNCHRONY',
    title: 'Monolith synthesis: forecast for the 15.000Hz crossing',
    category: 'Dossier',
    departmentId: 'dept-asian',
    departmentName: 'Atmospheric Sensing & Infrasonic Array Network',
    author: 'Dr. Henrik Lindqvist & Dr. Tariq Al-Mansoor',
    date: '2024-04-22',
    clearance: 'Level 5 - Black Dossier',
    summary:
      'Twenty-two stations, one number, going up. On present trend it crosses 15.000 in October 2026. The board has already booked the date.',
    content:
      'The carrier has moved from 14.802Hz to 14.988Hz in 36 months. Extrapolation puts it through [REDACTED: 15.000Hz in October 2026], after which coupling between the mantle source and human nervous systems doubles. [REDACTED: Directive 01 pre-activation authorised].',
    redactedContent:
      'The carrier has moved from 14.802Hz to 14.988Hz in 36 months. Extrapolation puts it through 15.000Hz in October 2026, after which coupling between the mantle source and human nervous systems doubles. Directive 01 pre-activation authorised for all fourteen redoubts. Two observations for the record. First, the acceleration is not steady; it tracks our own transmit volume with a lag of roughly nine weeks, which means it is answering us. Second, the model that produced the October 2026 date was corrected upward three times, each time by a smaller margin, and the last three corrections were made by the same analyst. We are not forecasting a natural event. We are writing down a schedule that something else has already agreed to.',
    tags: ['Project Monolith', 'Phase Transition', '15Hz', 'Global'],
    classificationStamp: 'BLACK LEVEL // SANITIZED',
    relatedPersonnel: ['p-018', 'p-025', 'p-003'],
    relatedStations: ['st-04', 'st-09', 'st-19'],
    downloadableFilename: 'Project_Monolith_Global_Synthesis_2024.pdf'
  }
];
