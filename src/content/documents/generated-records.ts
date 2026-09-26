import type { DocumentRecord } from '@/types';

const CATEGORIES: DocumentRecord['category'][] = [
  'Dossier',
  'Memorandum',
  'Field Report',
  'Technical Spec',
  'Incident Log',
  'Legal Filing',
  'Research Paper',
  'Executive Order',
  'Audio Log',
  'Transcript'
];
const DEPT_MAP = [
  { id: 'dept-sfpc', name: 'Strategic Forecasting & Predictive Chronology' },
  { id: 'dept-pefd', name: 'Psychoacoustics & Environmental Frequency Directorate' },
  { id: 'dept-ccdr', name: 'Civic Continuity & Demographic Resilience' },
  { id: 'dept-siso', name: 'Subterranean Infrastructure & Station Operations' },
  { id: 'dept-becm', name: 'Behavioral Economics & Compliance Metrics' },
  { id: 'dept-topn', name: 'Tactical Obfuscation & Public Narrative' },
  { id: 'dept-asian', name: 'Atmospheric Sensing & Infrasonic Array Network' },
  { id: 'dept-egspu', name: 'Executive Governance & Special Projects Unit' },
  { id: 'dept-bhrr', name: 'Bio-Harmonic Reclamation & Remediation' },
  { id: 'dept-airs', name: 'Archive Integrity & Retrospective Scrubbing' }
];

const CLEARANCES: DocumentRecord['clearance'][] = [
  'Level 1 - General',
  'Level 2 - Confidential',
  'Level 3 - Secret',
  'Level 4 - Top Secret',
  'Level 5 - Black Dossier'
];

const STAMPS: DocumentRecord['classificationStamp'][] = [
  'UNCLASSIFIED',
  'RESTRICTED',
  'CONFIDENTIAL',
  'SECRET // NOFORN',
  'TOP SECRET // EYES ONLY',
  'BLACK LEVEL // SANITIZED'
];

const AUTHORS = [
  'Dr. Arthur Vance-Vane',
  'Dame Eleanor Cross',
  'CEO Alistair Sterling',
  'Helena Vance-Cross',
  'Dr. Thaddeus Holt',
  'Dr. Evelyn Reed',
  'Dr. Naomi Chen',
  'Dr. Jonas Sylvan',
  'Dr. Aris Thorne',
  'Mara Finch',
  'Arthur K. Vance-Cross',
  'Chief Engineer Sarah Lin',
  'Commander J. R. Calderon',
  'Dr. Kaelen Voss',
  'Dr. Brigitte Laroche',
  'Harrison Blake',
  'Agent Felix Mercer',
  'Dr. Henrik Lindqvist',
  'Dr. Soraya Morales',
  'Dr. Marcus Vance-Saito',
  'Dr. Diane Kowalski',
  'Julian Thorne',
  'Cassian Drake',
  'Mikhail Volkov',
  'Dr. Tariq Al-Mansoor',
  'Eleni Kouris',
  'Lukas Meyer',
  'Vance Sterling-Holt',
  'Dr. Clara Zimmerman',
  'Niall O’Connor',
  'Dr. Hiroshi Tanaka',
  'Zhenya Petrov',
  'Dr. Astrid Lindberg',
  'Diego Ramirez',
  'Chloe Fontaine',
  'Garrison Cole',
  'Dr. Anya Sharma',
  'Kasper Vang',
  'Dr. Rebecca Osei',
  'Tessa Sterling',
  'Commander Bruce Thorne',
  'Evelyn Vance-Sylvan',
  'Dr. Ronald Abernathy',
  'Ingrid Holm',
  'David Vance-Wren'
];

const TOPICS = [
  { prefix: 'SPEC', topic: 'Infrasound Harmonic Array Calibration Grid', tag: 'Acoustics' },
  { prefix: 'MEMO', topic: 'Demographic Migration Corridors & Redoubt Rationing', tag: 'Continuity' },
  { prefix: 'INC', topic: 'Subterranean Fissure Resonance Spike', tag: 'Incident' },
  { prefix: 'REP', topic: 'Predictive Chronology Variance Audit', tag: 'Forecasting' },
  { prefix: 'LEGAL', topic: 'Non-Disclosure Injunction & Settlement Accord', tag: 'Legal' },
  { prefix: 'BIO', topic: 'Compound 88-T Otological Dosage Schedule', tag: 'Medical' },
  { prefix: 'SYS', topic: 'Digital Hash Re-Indexer Validation Log', tag: 'Archive' },
  { prefix: 'SEC', topic: 'Perimeter Breach & Cordon Quarantine Directive', tag: 'Security' },
  { prefix: 'PR', topic: 'Public Media Clarification & Attribution Playbook', tag: 'Media' },
  { prefix: 'ENG', topic: 'Hydraulic Barite Grout Injection Telemetry', tag: 'Engineering' },
  { prefix: 'OCEAN', topic: 'Abyssal SOFAR Channel Waveform Analysis', tag: 'Oceanic' },
  { prefix: 'POLAR', topic: 'Sub-Permafrost Cryogenic SQUID Sensor Health', tag: 'Arctic' },
  { prefix: 'TRANSIT', topic: 'Subway PA Frequency Notch Attenuation Log', tag: 'Project Vesper' },
  { prefix: 'BEHAV', topic: 'Subconscious Compliance Index & Panic Thresholds', tag: 'Behavioral' }
];

/**
 * Deterministically generates the bulk "operational record" filler
 * (doc-026 … doc-165) that gives the vault its density. Output is stable
 * across builds: same index → same record.
 */
export function generateOperationalRecords(from = 26, to = 165): DocumentRecord[] {
  const records: DocumentRecord[] = [];
  for (let i = from; i <= to; i++) {
    const year = 1971 + Math.floor((i / 165) * 55);
    const dept = DEPT_MAP[i % DEPT_MAP.length];
    const author = AUTHORS[i % AUTHORS.length];
    const cat = CATEGORIES[i % CATEGORIES.length];
    const clr = CLEARANCES[i % CLEARANCES.length];
    const stamp = STAMPS[i % STAMPS.length];
    const topicObj = TOPICS[i % TOPICS.length];
    const month = (1 + (i % 12)).toString().padStart(2, '0');
    const day = (1 + (i % 28)).toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const code = `${topicObj.prefix}-${year}-GPC${i.toString().padStart(4, '0')}`;

    const isWhistleblower = i % 17 === 0;

    records.push({
      id: `doc-${i.toString().padStart(3, '0')}`,
      code: code,
      title: `${topicObj.topic} [Ref: ${code}]`,
      category: cat,
      departmentId: dept.id,
      departmentName: dept.name,
      author: author,
      date: dateStr,
      clearance: clr,
      summary: `Classified operational record detailing ${topicObj.topic.toLowerCase()} administered under GPC ${dept.name} mandate during fiscal cycle ${year}.`,
      content: `OPERATIONAL CLASSIFIED RECORD ${code}\nAUTHORITY: Global Paradigms Corporation Board Directive\nDATE: ${dateStr}\nAUTHOR: ${author}\n\nSUMMARY:\nThis record establishes operational guidelines regarding ${topicObj.topic.toLowerCase()}. All telemetry indicates that the 14.8Hz baseline carrier [REDACTED: remains within 98.4% phase lock with planetary mantle sensors]. Field personnel must ensure that [REDACTED: unshielded civilians are not exposed to continuous amplitudes exceeding 84dB].\n\nDIRECTIVES:\n1. Maintain continuous logging of structural micro-vibrations across all assigned sub-basement sectors.\n2. In the event of acoustic frequency drift exceeding 0.1Hz, initiate immediate [REDACTED: secondary Helmholtz dampening jacks].\n3. All data packets must be verified against the Postojna Caverns master hash table.`,
      redactedContent: `OPERATIONAL CLASSIFIED RECORD ${code}\nAUTHORITY: Global Paradigms Corporation Board Directive\nDATE: ${dateStr}\nAUTHOR: ${author}\n\nSUMMARY:\nThis record establishes operational guidelines regarding ${topicObj.topic.toLowerCase()}. All telemetry indicates that the 14.8Hz baseline carrier remains within 98.4% phase lock with planetary mantle sensors. Field personnel must ensure that unshielded civilians are not exposed to continuous amplitudes exceeding 84dB without prior Bio-Harmonic Compound 88-T dosing.\n\nDIRECTIVES:\n1. Maintain continuous logging of structural micro-vibrations across all assigned sub-basement sectors.\n2. In the event of acoustic frequency drift exceeding 0.1Hz, initiate immediate secondary Helmholtz dampening jacks and notify Executive Governance.\n3. All data packets must be verified against the Postojna Caverns master hash table before transmission to sovereign client ministries.`,
      tags: [topicObj.tag, dept.name.split(' ')[0], `${year}s`, clr.split(' - ')[1] || 'General'],
      classificationStamp: stamp,
      isWhistleblowerLeak: isWhistleblower,
      relatedPersonnel: [`p-${String((i % 45) + 1).padStart(3, '0')}`],
      relatedStations: [`st-${String((i % 22) + 1).padStart(2, '0')}`],
      downloadableFilename: `${code}_Classified_Archive.pdf`,
      // Rebuilt from index stubs — see restoration log RST-2026-0031.
      contentStatus: 'partial'
    });
  }
  return records;
}

export const GENERATED_DOCUMENTS: DocumentRecord[] = generateOperationalRecords();
