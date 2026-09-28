import type { Department } from '@/types';

/**
 * Directorate pages as published on the internal intranet.
 *
 * House style: the mandate is written by the directorate; the classified
 * charter was added by the executive office and is written in a flat,
 * instruction-shaped register. Keep the two voices apart.
 */
export const DEPARTMENTS: Department[] = [
  {
    id: 'dept-sfpc',
    code: 'SFPC',
    name: 'Department of Strategic Forecasting & Predictive Chronology',
    director: 'Dr. Thaddeus Holt',
    deputyDirector: 'Dr. Evelyn Reed',
    headquarters: 'Tower Obsidian, Floor 44, London',
    headcount: 342,
    annualBudget: '£1.42 Billion',
    mandate:
      'Forecasting for sovereign and institutional clients: market, civil and demographic, at horizons from ninety days to two years. The desk also runs the variance audits the rest of the firm argues with.',
    classifiedCharter:
      'Where a forecast shows divergence above 2.8% and the client has not asked for the number, act on it before publishing. The desk is not to describe this as suppression in any document that leaves the floor.',
    subDivisions: [
      'Chronological Variance Unit',
      'Synthetic Twin City Modelling',
      'Demographic Stress Desk',
      'Pre-Crisis Liquidity'
    ]
  },
  {
    id: 'dept-pefd',
    code: 'PEFD',
    name: 'Psychoacoustics & Environmental Frequency Directorate',
    director: 'Dr. Naomi Chen',
    deputyDirector: 'Dr. Jonas Weiss',
    headquarters: 'Rosslyn Sub-Complex, Vault 02, Arlington, VA',
    headcount: 518,
    annualBudget: '£2.15 Billion',
    mandate:
      'Acoustics work across the estate: buildings, transit, water and open air. The directorate holds the carrier schedule and the only complete set of calibration records.',
    classifiedCharter:
      'Maintain the 14.8Hz baseline grid. Find anomalies before they find a client, and where an anomaly cannot be damped, tune it. Chen signs the schedule herself; there is no deputy signature line.',
    subDivisions: [
      'Infrasonic Propagation',
      'Binaural Entrainment',
      'Standing-Wave Architecture',
      'Municipal Tone Modulators'
    ]
  },
  {
    id: 'dept-ccdr',
    code: 'CCDR',
    name: 'Division of Civic Continuity & Demographic Resilience',
    director: 'Mara Finch',
    deputyDirector: 'Martin Sedley',
    headquarters: 'Swiss Alps Redoubt (Grimsel Pass)',
    headcount: 420,
    annualBudget: '£1.88 Billion',
    mandate:
      'Continuity contracts, redoubt provisioning, cohort administration and rationing schedules. The division is the client-facing half of Aethelgard and the part that has to look ordinary.',
    classifiedCharter:
      'Keep ten thousand seats ready for seven hundred and twenty days across fourteen sites. The roster is closed and staff are not eligible; that sentence is not to be softened in any briefing.',
    subDivisions: [
      'Sub-Surface Habitability',
      'Seed and Cultural Stores',
      'Post-Event Supply Routing',
      'Civic Relocation'
    ]
  },
  {
    id: 'dept-siso',
    code: 'SISO',
    name: 'Subterranean Infrastructure & Station Operations',
    director: 'Chief Engineer Sarah Lin',
    deputyDirector: 'Commander J. R. Calderon',
    headquarters: 'Site 19 (Great Salt Lake Trench, UT)',
    headcount: 890,
    annualBudget: '£3.40 Billion',
    mandate:
      'Drilling, deep works, station engineering and the containment systems. SISO crews are the only staff who spend their working week below the level at which the company says anything true.',
    classifiedCharter:
      'Hold the fissures at Station 07, Black Ridge and the Atacama under physical cordon. Where a fracture will not hold, pour it again until it does, and do not log the pour in the station journal.',
    subDivisions: [
      'Deep Borehole Engineering',
      'Acoustic Containment Crews',
      'Permafrost Stations',
      'Hydrophone Array Logistics'
    ]
  },
  {
    id: 'dept-becm',
    code: 'BECM',
    name: 'Behavioral Economics & Compliance Metrics',
    director: 'Dr. Tobias Voss',
    deputyDirector: 'Dr. Brigitte Laroche',
    headquarters: 'Tokyo Chiyoda Deep Tower, B3',
    headcount: 280,
    annualBudget: '£950 Million',
    mandate:
      'Compliance measurement, sentiment work and the internal diagnostics. BECM supplies the numbers that every other directorate quotes and none of them checks.',
    classifiedCharter:
      'Establish civilian tolerance thresholds for the carrier and report them as headroom. Delivery tuning in the field is capped at the figure on the last approved sheet; requests to raise it go to the executive office, not to the desk.',
    subDivisions: [
      'Sentiment Mapping',
      'Panic Velocity',
      'Compliance Waveform Testing',
      'Demographic Inertia'
    ]
  },
  {
    id: 'dept-topn',
    code: 'TOPN',
    name: 'Tactical Obfuscation & Public Narrative',
    director: 'Harrison Blake',
    deputyDirector: 'Agent Paul Kiernan',
    headquarters: 'Tower Obsidian, Floor 38, London',
    headcount: 195,
    annualBudget: '£780 Million',
    mandate:
      'Press, filings, crisis wording and public narrative. Everything the other directorates do has to pass through this floor before it becomes a sentence that anyone outside can read.',
    classifiedCharter:
      'Discredit or absorb reports of the hum, of municipal ear complaints, of mass auditory events and of disclosures. Where a story cannot be killed, own it and publish the boring version first.',
    subDivisions: [
      'Phenomena Desk',
      'Regulatory Liaison',
      'Mirror and Wayback Scrubbing',
      'Whistleblower Handling'
    ]
  },
  {
    id: 'dept-asian',
    code: 'ASIAN',
    name: 'Atmospheric Sensing & Infrasonic Array Network',
    director: 'Dr. Henrik Lindqvist',
    deputyDirector: 'Dr. Soraya Morales',
    headquarters: 'Nordic Array Station 07, Spitsbergen',
    headcount: 310,
    annualBudget: '£1.12 Billion',
    mandate:
      "Twenty-two stations, continuous record, planetary coverage in every band from the sea floor to the ionosphere. The array is the company's equivalent of an honest witness and is treated accordingly.",
    classifiedCharter:
      'Watch the carrier every hour of every day. Where an anomaly cannot be explained, log it in the annex and keep the annex off the client reporting chain. Nothing that reaches a client deck is to describe the carrier as rising.',
    subDivisions: [
      'Polar Array Group',
      'Deep Hydrophone Network',
      'High-Altitude Barometry',
      'Lithospheric Vibration'
    ]
  },
  {
    id: 'dept-egspu',
    code: 'EGSPU',
    name: 'Executive Governance & Special Projects Unit',
    director: 'CEO Nigel Ashby',
    deputyDirector: 'Executive VP Helena Cross',
    headquarters: 'Tower Obsidian, The Obsidian Penthouse, London',
    headcount: 65,
    annualBudget: '£4.20 Billion',
    mandate:
      'Strategy, board business, acquisitions, black allocation and the sovereign relationship. Sixty-five people, of whom eleven are cleared for everything.',
    classifiedCharter:
      'Standing authority over Vesper, Palimpsest and the Station 07 containment protocol. Level 5 sanitisations are ordered here and signed by a single hand; the unit does not minute the reason, only the decision.',
    subDivisions: ['Black Allocation', 'Sovereign Treaty Group', 'Clearance Oversight', 'Historical Revision']
  },
  {
    id: 'dept-bhrr',
    code: 'BHRR',
    name: 'Bio-Harmonic Reclamation & Remediation',
    director: 'Dr. Marcus Saito',
    deputyDirector: 'Dr. Diane Kowalski',
    headquarters: 'Yellowknife Sub-Permafrost Lab, Canada',
    headcount: 230,
    annualBudget: '£860 Million',
    mandate:
      'Occupational medicine, auditory health and the clinics. The directorate treats staff who have been below for too long and certifies everyone else as fit to go below.',
    classifiedCharter:
      'Treat and isolate Stage-3 acoustic dissociation, glossolalia and temporal dislocation from Station 07 and trench exposure. Compound 88-T is dispensed to a register held in this building and is not to be referenced in a personnel file.',
    subDivisions: [
      'Station Decontamination',
      'Cognitive Dampener Formulation',
      'Amnestic Therapy',
      'Cochlear Filtering'
    ]
  },
  {
    id: 'dept-airs',
    code: 'AIRS',
    name: 'Archive Integrity & Retrospective Scrubbing',
    director: 'Vincent Adeyemi',
    deputyDirector: 'Agent Paul Kiernan',
    headquarters: 'Postojna Caverns Secure Repository, Slovenia',
    headcount: 140,
    annualBudget: '£620 Million',
    mandate:
      'Records: preservation, vaulting, audit and classification. The archive holds two copies of everything and the reader is not told which one they are holding.',
    classifiedCharter:
      'Redact, shred and substitute. Cover the 1994 deaths, the Oakhaven trial and every leak since. Where the originals cannot be destroyed they are moved to Postojna, and where they can be destroyed the destroyed version must be able to pass as the original.',
    subDivisions: ['Shred and Incineration', 'Hash Re-Indexing', 'Microfilm Vault', 'Redaction Enforcement']
  }
];
