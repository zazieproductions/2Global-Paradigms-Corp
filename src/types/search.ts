/**
 * Search & archive-index models.
 */
import type {
  ClearanceLevel,
  ContentStatus,
  MediaType,
  RecordFormat,
  RecordKind,
  RecordRef,
  DocumentLink
} from './records';

/**
 * A normalised, fully-populated view of any record. Produced by
 * `src/lib/archive/records.ts`; consumed by search, cross-linking and the
 * terminal. Every field required by the content model is guaranteed here.
 */
export interface ArchiveEntry {
  ref: RecordRef;
  id: string;
  kind: RecordKind;
  /** Human-facing ID (document code, employee ID, station code…). */
  code: string;
  title: string;
  /** ISO date (`YYYY-MM-DD`), or `null` when the record is undated. */
  date: string | null;
  year: number | null;
  classification: ClearanceLevel | null;
  status: ContentStatus;
  sourcePath: string;
  tags: string[];
  related: RecordRef[];
  links: DocumentLink[];
  /** App route that displays this record. */
  route: string;
  summary: string;
  /** Searchable body text (redacted form only — cleartext is never indexed). */
  body: string;
  filename?: string;
  author?: string;
  department?: string;
  projects: string[];
  office?: string;
  format: RecordFormat;
  mediaType: MediaType;
}

export interface SearchFilters {
  kinds?: RecordKind[];
  formats?: RecordFormat[];
  /** Match by clearance tier number (1–5). */
  clearanceTiers?: number[];
  departments?: string[];
  projects?: string[];
  offices?: string[];
  statuses?: ContentStatus[];
  mediaTypes?: MediaType[];
  /** Inclusive ISO date bounds. Undated records are excluded when set. */
  dateFrom?: string;
  dateTo?: string;
}

export interface SearchQuery {
  text: string;
  filters?: SearchFilters;
  limit?: number;
}

export type SearchField =
  | 'code'
  | 'title'
  | 'tags'
  | 'author'
  | 'filename'
  | 'department'
  | 'project'
  | 'office'
  | 'year'
  | 'summary'
  | 'body';

export interface SearchResult {
  entry: ArchiveEntry;
  score: number;
  matchedFields: SearchField[];
  snippet: string;
}
