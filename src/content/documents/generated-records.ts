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
  'Dr. Arthur Sedley',
  'Dame Eleanor Cross',
  'CEO Nigel Ashby',
  'Helena Cross',
  'Dr. Thaddeus Holt',
  'Dr. Evelyn Reed',
  'Dr. Naomi Chen',
  'Dr. Jonas Weiss',
  'Dr. Ewan Thorne',
  'Mara Finch',
  'Martin Sedley',
  'Chief Engineer Sarah Lin',
  'Commander J. R. Calderon',
  'Dr. Tobias Voss',
  'Dr. Brigitte Laroche',
  'Harrison Blake',
  'Agent Paul Kiernan',
  'Dr. Henrik Lindqvist',
  'Dr. Soraya Morales',
  'Dr. Marcus Saito',
  'Dr. Diane Kowalski',
  'Julian Thorne',
  'Vincent Adeyemi',
  'Roman Sleptsov',
  'Dr. Tariq Al-Mansoor',
  'Eleni Kouris',
  'Lukas Meyer',
  'Philip Warrender',
  'Dr. Clara Zimmerman',
  'Niall O’Connor',
  'Dr. Hiroshi Tanaka',
  'Zhenya Petrov',
  'Dr. Astrid Lindberg',
  'Diego Ramirez',
  'Chloe Fontaine',
  'Frank Bedell',
  'Dr. Anya Sharma',
  'Kasper Vang',
  'Dr. Rebecca Osei',
  'Tessa Ashby',
  'Commander Bruce Halloran',
  'Nora Beaumont',
  'Dr. Ronald Abernathy',
  'Ingrid Holm',
  'David Wren'
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

    // Stubs cut at slightly different lengths, so the rebuilt bodies do not all
    // read the same. Two of the summaries below are what the cabinet said, not
    // what the record said; the discrepancy is in the register and dated.
    const summaryLead =
      i % 3 === 0
        ? `Rebuilt stub. ${topicObj.topic}, ${dept.name.split(' ')[0]} file, ${year}.`
        : i % 3 === 1
          ? `${topicObj.topic}. Recorded against the ${dept.name.split(' ')[0]} series, ${year}.`
          : `Index stub only. ${topicObj.topic}, filed ${dateStr}.`;

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
      summary: `${summaryLead} Body rebuilt from stub; wording approximate.`,
      content: `OPERATIONAL RECORD ${code}\nREF: GPC board directive file ${i}-${year}\nDATE: ${dateStr}\nSIGNED: ${author}\n\nPURPOSE:\nIssued to cover ${topicObj.topic.toLowerCase()}. Standing telemetry has the 14.8Hz baseline carrier [REDACTED: remains within 98.4% phase lock with planetary mantle sensors]. Personnel are reminded that [REDACTED: unshielded civilians are not exposed to continuous amplitudes exceeding 84dB].\n\nINSTRUCTIONS:\n1. Keep logging structural micro-vibration in all sub-basement sectors. Do not annotate the logs by hand.\n2. On drift exceeding 0.1Hz, start [REDACTED: secondary Helmholtz dampening jacks] and report by voice, not by ticket.\n3. Verify every data packet against the Postojna hash table.`,
      redactedContent: `OPERATIONAL RECORD ${code}\nREF: GPC board directive file ${i}-${year}\nDATE: ${dateStr}\nSIGNED: ${author}\n\nPURPOSE:\nIssued to cover ${topicObj.topic.toLowerCase()}. Standing telemetry has the 14.8Hz baseline carrier remains within 98.4% phase lock with planetary mantle sensors. Personnel are reminded that unshielded civilians are not exposed to continuous amplitudes exceeding 84dB without prior Compound 88-T dosing.\n\nINSTRUCTIONS:\n1. Keep logging structural micro-vibration in all sub-basement sectors. Do not annotate the logs by hand.\n2. On drift exceeding 0.1Hz, start secondary Helmholtz dampening jacks and notify Executive Governance at once. The notification requirement is not discretionary.\n3. Verify every data packet against the Postojna hash table before anything goes to a client ministry.`,
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
