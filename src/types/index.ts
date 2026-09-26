export type ClearanceLevel =
  | 'Level 1 - General'
  | 'Level 2 - Confidential'
  | 'Level 3 - Secret'
  | 'Level 3 - Secret (REVOKED)'
  | 'Level 4 - Top Secret'
  | 'Level 4 - Top Secret (REVOKED)'
  | 'Level 5 - Black Dossier'
  | 'Level 5 - Black Dossier (REVOKED)';

export interface DocumentRecord {
  id: string;
  code: string;
  title: string;
  category: 'Dossier' | 'Memorandum' | 'Field Report' | 'Technical Spec' | 'Incident Log' | 'Legal Filing' | 'Research Paper' | 'Executive Order' | 'Audio Log' | 'Transcript';
  departmentId: string;
  departmentName: string;
  author: string;
  date: string;
  clearance: ClearanceLevel;
  summary: string;
  content: string;
  redactedContent?: string; // Cleartext revealed when redaction de-scrambler is ON
  tags: string[];
  classificationStamp: 'UNCLASSIFIED' | 'RESTRICTED' | 'CONFIDENTIAL' | 'SECRET // NOFORN' | 'TOP SECRET // EYES ONLY' | 'BLACK LEVEL // SANITIZED';
  relatedPersonnel?: string[];
  relatedStations?: string[];
  relatedPrograms?: string[];
  downloadableFilename?: string;
  isWhistleblowerLeak?: boolean;
}

export interface Personnel {
  id: string;
  employeeId: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  clearance: ClearanceLevel;
  stationId: string;
  stationName: string;
  status: 'Active' | 'On Leave' | 'Transferred' | 'Missing' | 'Terminated' | 'Quarantined';
  hireDate: string;
  email: string;
  phoneExtension: string;
  biography: string;
  classifiedNotes: string;
  linkedDocuments: string[];
  avatarSeed: string;
}

export interface RegionalStation {
  id: string;
  code: string;
  name: string;
  region: string;
  coordinates: string;
  latitude: number;
  longitude: number;
  facilityType: 'Corporate Tower' | 'Subterranean Bunker' | 'Acoustic Array' | 'Seabed Hydrophone' | 'High-Altitude Sensor' | 'Permafrost Vault';
  status: 'Operational' | 'Elevated Alert' | 'Under Containment' | 'Decommissioned' | 'Restricted Access';
  personnelCount: number;
  leadPersonnelId: string;
  leadPersonnelName: string;
  establishedDate: string;
  frequencyBand: string;
  description: string;
  incidentHistory: string[];
  activeProjects: string[];
}

export interface InternalProgram {
  id: string;
  code: string;
  name: string;
  leadDepartmentId: string;
  director: string;
  clearance: ClearanceLevel;
  threatLevel: 'Low' | 'Moderate' | 'High' | 'Critical' | 'Existential';
  budgetAnnual: string;
  startYear: number;
  status: 'Active' | 'Covert Active' | 'Suspended' | 'Merged' | 'Disavowed';
  objective: string;
  publicCoverStory: string;
  classifiedReality: string;
  milestones: { year: number; event: string }[];
  linkedPersonnel: string[];
  linkedStations: string[];
}

export interface Department {
  id: string;
  code: string;
  name: string;
  director: string;
  deputyDirector: string;
  headquarters: string;
  headcount: number;
  annualBudget: string;
  mandate: string;
  classifiedCharter: string;
  subDivisions: string[];
}

export interface DiscontinuedProduct {
  id: string;
  modelCode: string;
  name: string;
  releaseYear: number;
  recallYear: number;
  intendedMarket: string;
  advertisedFunction: string;
  actualAnomaly: string;
  recallReason: string;
  casualtyEstimate: string;
  disposalProtocol: string;
  patentNumber: string;
}

export interface AudioArtifact {
  id: string;
  code: string;
  title: string;
  recordingDate: string;
  recordedAt: string;
  carrierFrequency: string;
  sampleRate: string;
  durationSeconds: number;
  classification: ClearanceLevel;
  summary: string;
  transcript: string;
  synthesisPreset: 'infrasound' | 'vesperTone' | 'hydrophone' | 'reson8' | 'seismic' | 'palimpsest';
  spectralNotes: string;
}

export interface AnnualReport {
  year: number;
  title: string;
  fiscalHeadline: string;
  revenue: string;
  civicContinuityIndex: string;
  executiveLetter: string;
  keyInitiatives: string[];
  demographicMetrics: { metric: string; value: string; variance: string }[];
  scrubbedFootnote: string;
}

export interface EmailThread {
  id: string;
  threadCode: string;
  subject: string;
  date: string;
  classification: ClearanceLevel;
  participants: { name: string; email: string; role: string }[];
  messages: {
    senderName: string;
    senderEmail: string;
    timestamp: string;
    body: string;
    hasAttachment?: boolean;
    attachmentName?: string;
  }[];
}

export interface MeetingRecord {
  id: string;
  meetingCode: string;
  title: string;
  date: string;
  location: string;
  chairperson: string;
  attendees: string[];
  agenda: string[];
  minutes: string;
  motionsPassed: string[];
  redactedDiscussion: string;
  clearance: ClearanceLevel;
}

export interface PressRelease {
  id: string;
  releaseNumber: string;
  date: string;
  headline: string;
  city: string;
  leadParagraph: string;
  bodyParagraphs: string[];
  mediaContact: string;
  disclaimer: string;
  internalSubtext: string;
}

export interface TimelineEntry {
  id: string;
  year: number;
  dateString: string;
  title: string;
  era: 'Early Foundations (1971-1989)' | 'Millennial Expansion (1990-2009)' | 'Modern Hegemony (2010-2026)';
  departmentCode: string;
  classification: ClearanceLevel;
  description: string;
  internalImpact: string;
  isCovert: boolean;
}

export interface Newsletter {
  id: string;
  issueNumber: string;
  title: string;
  publicationDate: string;
  volumeName: string;
  leadArticle: { headline: string; content: string };
  secondaryArticles: { headline: string; content: string }[];
  employeeSpotlight: { name: string; role: string; quote: string };
  cafeteriaSpecial: string;
  safetyNotice: string;
}

export interface TrainingModule {
  id: string;
  moduleCode: string;
  title: string;
  departmentCode: string;
  estimatedMinutes: number;
  overview: string;
  sections: { title: string; text: string; safetyGuideline?: string }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  certificationTitle: string;
}

export interface JobPosting {
  id: string;
  requisitionId: string;
  title: string;
  department: string;
  location: string;
  clearanceRequired: ClearanceLevel;
  salaryRange: string;
  overview: string;
  responsibilities: string[];
  qualifications: string[];
  psychologicalRequirements: string[];
  postingDate: string;
}

export interface DeadLink {
  id: string;
  url: string;
  originalHost: string;
  errorType: '404 Not Found' | '410 Gone / Subpoenaed' | 'Domain Seized' | 'Redirection Blocked' | 'Wayback Mirror 1998';
  originalTitle: string;
  cachedSnippet: string;
  investigatorNotes: string;
  archiveDate: string;
}

export type ActiveTab =
  | 'sanctum'
  | 'dashboard'
  | 'documents'
  | 'personnel'
  | 'stations'
  | 'programs'
  | 'departments'
  | 'products'
  | 'audio'
  | 'reports'
  | 'communications'
  | 'timeline'
  | 'newsletters'
  | 'training'
  | 'careers'
  | 'values'
  | 'tools'
  | 'deadlinks';
