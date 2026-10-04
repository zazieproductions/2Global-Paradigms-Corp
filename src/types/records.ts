/**
 * Shared record primitives used by every piece of archive content.
 *
 * Every content collection extends `RecordMeta`, which carries the optional
 * editorial fields (status, source path, related records, internal links).
 * The archive layer (`src/lib/archive/records.ts`) normalises every record
 * into an `ArchiveEntry`, where all of those fields are guaranteed present.
 */

export type ClearanceLevel =
  | 'Level 1 - General'
  | 'Level 2 - Confidential'
  | 'Level 3 - Secret'
  | 'Level 3 - Secret (REVOKED)'
  | 'Level 4 - Top Secret'
  | 'Level 4 - Top Secret (REVOKED)'
  | 'Level 5 - Black Dossier'
  | 'Level 5 - Black Dossier (REVOKED)';

/** Editorial / in-world recovery state of a record. */
export type ContentStatus =
  | 'recovered' // intact, readable
  | 'partial' // some fields lost
  | 'redacted' // cleartext only visible with the de-scrambler
  | 'corrupted' // unreadable / placeholder
  | 'restored' // repaired by the restoration team
  | 'draft'; // authoring only — excluded from production indexes

/** Every addressable collection in the archive. */
export type RecordKind =
  | 'document'
  | 'personnel'
  | 'office'
  | 'project'
  | 'department'
  | 'product'
  | 'audio'
  | 'email'
  | 'meeting'
  | 'press'
  | 'timeline'
  | 'newsletter'
  | 'training'
  | 'job'
  | 'dead-link'
  | 'annual-report'
  | 'restoration-log';

/** A typed pointer to another record. */
export interface RecordRef {
  kind: RecordKind;
  id: string;
}

export type LinkRelation =
  'mentions' | 'authored-by' | 'located-at' | 'part-of' | 'supersedes' | 'contradicts' | 'related';

/** A directed, annotated cross-reference between two records. */
export interface DocumentLink {
  to: RecordRef;
  relation: LinkRelation;
  /** Optional in-world annotation shown next to the link. */
  note?: string;
}

/**
 * Optional editorial metadata every record may declare.
 * Missing values are filled in by the archive normaliser.
 */
export interface RecordMeta {
  /** Recovery state. Defaults to `recovered` (or `redacted` when cleartext exists). */
  contentStatus?: ContentStatus;
  /** Archive path, e.g. `//POSTOJNA/VAULT0/DOCS/1971/...`. Derived when omitted. */
  sourcePath?: string;
  /** Loose relationships (in addition to any collection-specific id arrays). */
  related?: RecordRef[];
  /** Annotated internal links. */
  links?: DocumentLink[];
  /** Out-of-world authoring note. Never rendered to players. */
  editorialNote?: string;
}

/** Output format / medium of a record, used by search filters. */
export type RecordFormat =
  | 'document'
  | 'profile'
  | 'location'
  | 'dossier'
  | 'charter'
  | 'product-sheet'
  | 'audio'
  | 'email'
  | 'minutes'
  | 'press-release'
  | 'event'
  | 'newsletter'
  | 'course'
  | 'job-posting'
  | 'web-capture'
  | 'report'
  | 'log';

export type MediaType = 'text' | 'audio' | 'data' | 'web';
