/**
 * Content collection models.
 *
 * These shapes mirror the authored content modules in `src/content/**`.
 * Field names are intentionally stable — they are the contract between
 * writers and the UI. Add new optional fields rather than renaming.
 */
import type { ClearanceLevel, RecordMeta } from './records';

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export type DocumentCategory =
  | 'Dossier'
  | 'Memorandum'
  | 'Field Report'
  | 'Technical Spec'
  | 'Incident Log'
  | 'Legal Filing'
  | 'Research Paper'
  | 'Executive Order'
  | 'Audio Log'
  | 'Transcript';

export type ClassificationStamp =
  | 'UNCLASSIFIED'
  | 'RESTRICTED'
  | 'CONFIDENTIAL'
  | 'SECRET // NOFORN'
  | 'TOP SECRET // EYES ONLY'
  | 'BLACK LEVEL // SANITIZED';

/** One historical edit of a document (sanitisation passes, re-indexing, leaks). */
export interface DocumentRevision {
  /** Revision label, e.g. `r1`, `r2-SANITIZED`. */
  revision: string;
  date: string;
  editor: string;
  summary: string;
  /** Body text of this revision, if it differs from the current one. */
  content?: string;
}

export interface DocumentRecord extends RecordMeta {
  id: string;
  /** Human-facing document ID, e.g. `DOC-1971-FOUNDING`. See CONTENT_STYLE_GUIDE. */
  code: string;
  title: string;
  category: DocumentCategory;
  departmentId: string;
  departmentName: string;
  author: string;
  /** ISO date `YYYY-MM-DD`. */
  date: string;
  clearance: ClearanceLevel;
  summary: string;
  /** Body as shown with redactions applied. */
  content: string;
  /** Cleartext revealed when the redaction de-scrambler is ON. */
  redactedContent?: string;
  tags: string[];
  classificationStamp: ClassificationStamp;
  relatedPersonnel?: string[];
  relatedStations?: string[];
  relatedPrograms?: string[];
  downloadableFilename?: string;
  isWhistleblowerLeak?: boolean;
  revisions?: DocumentRevision[];
}

// ---------------------------------------------------------------------------
// People, places, organisation
// ---------------------------------------------------------------------------

export type PersonnelStatus =
  'Active' | 'On Leave' | 'Transferred' | 'Missing' | 'Terminated' | 'Quarantined';

export interface Personnel extends RecordMeta {
  id: string;
  employeeId: string;
  name: string;
  title: string;
  departmentId: string;
  departmentName: string;
  clearance: ClearanceLevel;
  stationId: string;
  stationName: string;
  status: PersonnelStatus;
  hireDate: string;
  email: string;
  phoneExtension: string;
  biography: string;
  classifiedNotes: string;
  linkedDocuments: string[];
  avatarSeed: string;
}
/** Preferred alias used in docs and new code. */
export type PersonnelProfile = Personnel;

export type FacilityType =
  | 'Corporate Tower'
  | 'Subterranean Bunker'
  | 'Acoustic Array'
  | 'Seabed Hydrophone'
  | 'High-Altitude Sensor'
  | 'Permafrost Vault';

export type StationStatus =
  'Operational' | 'Elevated Alert' | 'Under Containment' | 'Decommissioned' | 'Restricted Access';

export interface RegionalStation extends RecordMeta {
  id: string;
  code: string;
  name: string;
  region: string;
  coordinates: string;
  latitude: number;
  longitude: number;
  facilityType: FacilityType;
  status: StationStatus;
  personnelCount: number;
  leadPersonnelId: string;
  leadPersonnelName: string;
  establishedDate: string;
  frequencyBand: string;
  description: string;
  incidentHistory: string[];
  activeProjects: string[];
}
/** Regional offices and field stations share one model. */
export type OfficeRecord = RegionalStation;

export type ThreatLevel = 'Low' | 'Moderate' | 'High' | 'Critical' | 'Existential';
export type ProgramStatus = 'Active' | 'Covert Active' | 'Suspended' | 'Merged' | 'Disavowed';

export interface InternalProgram extends RecordMeta {
  id: string;
  code: string;
  name: string;
  leadDepartmentId: string;
  director: string;
  clearance: ClearanceLevel;
  threatLevel: ThreatLevel;
  budgetAnnual: string;
  startYear: number;
  status: ProgramStatus;
  objective: string;
  publicCoverStory: string;
  classifiedReality: string;
  milestones: { year: number; event: string }[];
  linkedPersonnel: string[];
  linkedStations: string[];
}
/** Projects (Vesper, Palimpsest, Monolith, …). */
export type ProjectRecord = InternalProgram;

export interface Department extends RecordMeta {
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

export interface DiscontinuedProduct extends RecordMeta {
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

// ---------------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------------

export type SynthesisPreset =
  'infrasound' | 'vesperTone' | 'hydrophone' | 'reson8' | 'seismic' | 'palimpsest';

/**
 * A recovered audio artifact. Audio is procedurally synthesised by the
 * Web Audio engine — there are no media files — and it is always opt-in.
 * `transcript` is REQUIRED: it is the text-first fallback for every artifact.
 */
export interface AudioArtifact extends RecordMeta {
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
  synthesisPreset: SynthesisPreset;
  spectralNotes: string;
  /** Plain-language description of what the audio sounds like (for non-listeners). */
  audioDescription?: string;
  /** Out-of-world production credits (sound design, voice). */
  credits?: string[];
  /** Optional hosted file — if ever added, must still ship with a transcript. */
  src?: string;
}

// ---------------------------------------------------------------------------
// Corporate publications & communications
// ---------------------------------------------------------------------------

export interface AnnualReport extends RecordMeta {
  /** `ar-<year>` */
  id: string;
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

export interface EmailMessage {
  senderName: string;
  senderEmail: string;
  timestamp: string;
  body: string;
  hasAttachment?: boolean;
  attachmentName?: string;
}

export interface EmailThread extends RecordMeta {
  id: string;
  threadCode: string;
  subject: string;
  date: string;
  classification: ClearanceLevel;
  participants: { name: string; email: string; role: string }[];
  messages: EmailMessage[];
}

export interface MeetingRecord extends RecordMeta {
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

export interface PressRelease extends RecordMeta {
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

export type TimelineEra =
  'Early Foundations (1971-1989)' | 'Millennial Expansion (1990-2009)' | 'Modern Hegemony (2010-2026)';

export interface TimelineEntry extends RecordMeta {
  id: string;
  year: number;
  dateString: string;
  title: string;
  era: TimelineEra;
  departmentCode: string;
  classification: ClearanceLevel;
  description: string;
  internalImpact: string;
  isCovert: boolean;
}
/** Preferred alias used in docs and new code. */
export type TimelineEvent = TimelineEntry;

export interface Newsletter extends RecordMeta {
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

export interface TrainingModule extends RecordMeta {
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

export interface JobPosting extends RecordMeta {
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

export type DeadLinkError =
  '404 Not Found' | '410 Gone / Subpoenaed' | 'Domain Seized' | 'Redirection Blocked' | 'Wayback Mirror 1998';

/**
 * A fictional, non-resolving URL recovered from the archive.
 * These are NEVER rendered as clickable links.
 */
export interface DeadLink extends RecordMeta {
  id: string;
  url: string;
  originalHost: string;
  errorType: DeadLinkError;
  originalTitle: string;
  cachedSnippet: string;
  investigatorNotes: string;
  archiveDate: string;
}

/** One of the "5 Pillars of Certainty" corporate doctrine entries. */
export interface CompanyPillar {
  number: string;
  title: string;
  subtitle: string;
  doctrine: string;
  practicalApplication: string;
  executiveQuote: string;
}

// ---------------------------------------------------------------------------
// Restoration (the frame story: the archive is being recovered)
// ---------------------------------------------------------------------------

export type RestorationAction = 'recovered' | 'restored' | 'reindexed' | 'repaired' | 'quarantined' | 'lost';

/** An operator log entry from the archive restoration effort. */
export interface RestorationLog extends RecordMeta {
  id: string;
  code: string;
  title: string;
  date: string;
  operator: string;
  action: RestorationAction;
  /** 0–100 integrity estimate after this action. */
  integrity: number;
  affected: string[];
  notes: string;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Directive 17 — purge salvage ("the unquiet tape")
// ---------------------------------------------------------------------------

/** One out-of-order shard line of a purged record, as the tape spool returns it. */
export interface SalvageShard {
  /**
   * Player-visible reel locator (reel offset, timestamp or frame number).
   * Ascending locator = original reading order; this is the splice key.
   */
  locator: string;
  /** 1-based position on the original tape. The splice target. */
  order: number;
  text: string;
}

/**
 * A record purged under Directive 17 that survives only as a tape ghost.
 * Ghosts are NOT archive records: the live index refuses them, search cannot
 * surface them, and only the tape spool can give them back.
 */
export interface PurgedGhost {
  id: string;
  /** The cited-but-missing archive code this ghost answers for. */
  code: string;
  title: string;
  /** In-world date of the original record (`YYYY-MM-DD`). */
  date: string;
  /** When the purge struck it from the live index. */
  purgedOn: string;
  /** Personnel record ids whose dossiers still cite this code. */
  citedBy: string[];
  /** What the index remembers instead of a body. */
  preamble: string;
  /** How to order the shards (shown before the splice). */
  locatorNote: string;
  shards: SalvageShard[];
  /** Printed once the splice holds. */
  closing: string;
}

/** The payoff: the purge order itself, recovered from the same spool. */
export interface Directive17Record {
  code: string;
  title: string;
  signatory: string;
  lines: string[];
}
