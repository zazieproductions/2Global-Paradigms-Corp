/**
 * Archive record layer.
 *
 * Normalises every content collection into `ArchiveEntry` objects with a
 * guaranteed set of fields (id, title, date, classification, sourcePath,
 * related records, tags, status, links, route). Search, cross-linking, the
 * terminal and integrity checks all read from here instead of touching the
 * raw collections.
 */
import {
  ANNUAL_REPORTS,
  AUDIO_ARTIFACTS,
  DEAD_LINKS,
  DEPARTMENTS,
  DISCONTINUED_PRODUCTS,
  DOCUMENTS,
  EMAIL_THREADS,
  INTERNAL_PROGRAMS,
  JOB_POSTINGS,
  MEETING_RECORDS,
  NEWSLETTERS,
  PERSONNEL,
  PRESS_RELEASES,
  REGIONAL_STATIONS,
  RESTORATION_LOGS,
  TIMELINE_ENTRIES,
  TRAINING_MODULES
} from '@/content';
import type {
  ArchiveEntry,
  ClearanceLevel,
  ContentStatus,
  DocumentRecord,
  InternalProgram,
  Personnel,
  RecordKind,
  RecordMeta,
  RecordRef,
  RegionalStation
} from '@/types';
import { isoDateOf, yearOf } from '@/lib/utils/text';
import { stripRedactions } from '@/lib/archive/redaction';

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

const byId = <T extends { id: string }>(items: T[]) => new Map(items.map((i) => [i.id, i]));

const DOCS_BY_ID = byId(DOCUMENTS);
const DOCS_BY_CODE = new Map(DOCUMENTS.map((d) => [d.code.toUpperCase(), d]));
const PERSONNEL_BY_ID = byId(PERSONNEL);
const STATIONS_BY_ID = byId(REGIONAL_STATIONS);
const PROGRAMS_BY_ID = byId(INTERNAL_PROGRAMS);
const DEPARTMENTS_BY_ID = byId(DEPARTMENTS);

export const getDocumentById = (id: string): DocumentRecord | undefined => DOCS_BY_ID.get(id);
export const getDocumentByCode = (code: string): DocumentRecord | undefined =>
  DOCS_BY_CODE.get(code.trim().toUpperCase());
/** Resolve a document from an internal id (`doc-007`) or a public code (`DOC-1989-SVALBARD-EVENT`). */
export const resolveDocument = (idOrCode: string | null | undefined): DocumentRecord | undefined =>
  idOrCode ? (getDocumentById(idOrCode) ?? getDocumentByCode(idOrCode)) : undefined;

export const getPersonnelById = (id: string): Personnel | undefined => PERSONNEL_BY_ID.get(id);
export const getStationById = (id: string): RegionalStation | undefined => STATIONS_BY_ID.get(id);
export const getProgramById = (id: string): InternalProgram | undefined => PROGRAMS_BY_ID.get(id);
export const getDepartmentById = (id: string) => DEPARTMENTS_BY_ID.get(id);

/** Documents attached to a personnel profile, split into recovered and missing codes. */
export function linkedDocumentsFor(person: Personnel): { found: DocumentRecord[]; missing: string[] } {
  const found: DocumentRecord[] = [];
  const missing: string[] = [];
  for (const code of person.linkedDocuments) {
    const doc = resolveDocument(code);
    if (doc) found.push(doc);
    else missing.push(code);
  }
  // Also surface documents that point *at* this person.
  for (const doc of DOCUMENTS) {
    if (doc.relatedPersonnel?.includes(person.id) && !found.includes(doc)) found.push(doc);
  }
  return { found, missing };
}

// ---------------------------------------------------------------------------
// Project detection (projects are referenced by name across collections)
// ---------------------------------------------------------------------------

const PROJECT_MATCHERS = INTERNAL_PROGRAMS.map((p) => {
  const short = p.name.replace(/^Project\s+/i, '');
  return { name: p.name, re: new RegExp(`\\b${short.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i') };
});

function detectProjects(...texts: Array<string | undefined>): string[] {
  const hay = texts.filter(Boolean).join(' \u2022 ');
  return PROJECT_MATCHERS.filter((m) => m.re.test(hay)).map((m) => m.name);
}

// ---------------------------------------------------------------------------
// Normalisers
// ---------------------------------------------------------------------------

const KIND_DIR: Record<RecordKind, string> = {
  document: 'DOCS',
  personnel: 'HR/PERSONNEL',
  office: 'OPS/STATIONS',
  project: 'EXEC/PROJECTS',
  department: 'EXEC/CHARTERS',
  product: 'LEGAL/RECALLS',
  audio: 'ACOUSTICS/ARTIFACTS',
  email: 'COMMS/MAIL',
  meeting: 'COMMS/MINUTES',
  press: 'COMMS/PRESS',
  timeline: 'HISTORY/CHRONOLOGY',
  newsletter: 'COMMS/NEWSLETTERS',
  training: 'HR/TRAINING',
  job: 'HR/REQUISITIONS',
  'dead-link': 'NET/DEAD-LINKS',
  'annual-report': 'EXEC/DISCLOSURES',
  'restoration-log': 'MIRROR/RESTORATION'
};

const derivePath = (kind: RecordKind, code: string, year: number | null) =>
  `//POSTOJNA/VAULT0/${KIND_DIR[kind]}/${year ?? 'UNDATED'}/${code.toUpperCase().replace(/\s+/g, '_')}`;

const refs = (kind: RecordKind, ids: string[] | undefined): RecordRef[] =>
  (ids ?? []).filter(Boolean).map((id) => ({ kind, id }));

interface EntryInput extends Partial<Omit<ArchiveEntry, 'ref' | 'kind' | 'id'>> {
  kind: RecordKind;
  id: string;
  code: string;
  title: string;
  route: string;
  meta?: RecordMeta;
  rawDate?: string | number | null;
  defaultStatus?: ContentStatus;
}

function entry(input: EntryInput): ArchiveEntry {
  const { kind, id, code, meta, rawDate, defaultStatus, ...rest } = input;
  const date = isoDateOf(rawDate ?? null);
  const year = yearOf(rawDate ?? null);
  const related = [...(meta?.related ?? []), ...(rest.related ?? [])];
  return {
    ref: { kind, id },
    id,
    kind,
    code,
    title: rest.title,
    date,
    year,
    classification: rest.classification ?? null,
    status: meta?.contentStatus ?? defaultStatus ?? 'recovered',
    sourcePath: meta?.sourcePath ?? derivePath(kind, code, year),
    tags: rest.tags ?? [],
    related,
    links: meta?.links ?? [],
    route: rest.route,
    // Hidden words behind [REDACTED: …] never enter the index (see docs/PUZZLE_SYSTEM.md).
    summary: stripRedactions(rest.summary ?? ''),
    body: stripRedactions(rest.body ?? ''),
    filename: rest.filename,
    author: rest.author,
    department: rest.department,
    projects: rest.projects ?? [],
    office: rest.office,
    format: rest.format ?? 'document',
    mediaType: rest.mediaType ?? 'text'
  };
}

const withRecord = (path: string, id: string) => `${path}?record=${encodeURIComponent(id)}`;

function buildEntries(): ArchiveEntry[] {
  const out: ArchiveEntry[] = [];

  for (const d of DOCUMENTS) {
    out.push(
      entry({
        kind: 'document',
        id: d.id,
        code: d.code,
        title: d.title,
        rawDate: d.date,
        classification: d.clearance,
        meta: d,
        defaultStatus: d.redactedContent ? 'redacted' : 'recovered',
        tags: [...d.tags, d.category, d.classificationStamp],
        related: [
          ...refs('personnel', d.relatedPersonnel),
          ...refs('office', d.relatedStations),
          ...refs('project', d.relatedPrograms),
          { kind: 'department', id: d.departmentId }
        ],
        route: `/documents?doc=${encodeURIComponent(d.id)}`,
        summary: d.summary,
        // The Order's own records are searchable by title/abstract only, so
        // snippets cannot quote a record that is still sealed.
        body: d.tags.includes('Order') ? '' : d.content,
        filename: d.downloadableFilename,
        author: d.author,
        department: d.departmentName,
        projects: detectProjects(d.title, d.summary, d.tags.join(' ')),
        office: d.relatedStations
          ?.map((s) => getStationById(s)?.name)
          .filter(Boolean)
          .join(', '),
        format: 'document',
        mediaType: 'text'
      })
    );
  }

  for (const p of PERSONNEL) {
    out.push(
      entry({
        kind: 'personnel',
        id: p.id,
        code: p.employeeId,
        title: p.name,
        rawDate: p.hireDate,
        classification: p.clearance,
        meta: p,
        tags: [p.status, p.title],
        related: [
          { kind: 'department', id: p.departmentId },
          { kind: 'office', id: p.stationId },
          ...p.linkedDocuments
            .map((c) => resolveDocument(c))
            .filter((d): d is DocumentRecord => !!d)
            .map((d) => ({ kind: 'document' as const, id: d.id }))
        ],
        route: withRecord('/personnel', p.id),
        summary: `${p.title} — ${p.departmentName}`,
        body: p.biography,
        department: p.departmentName,
        projects: detectProjects(p.biography, p.title),
        office: p.stationName,
        format: 'profile'
      })
    );
  }

  for (const s of REGIONAL_STATIONS) {
    out.push(
      entry({
        kind: 'office',
        id: s.id,
        code: s.code,
        title: s.name,
        rawDate: s.establishedDate,
        meta: s,
        tags: [s.region, s.facilityType, s.status, s.frequencyBand],
        related: [{ kind: 'personnel', id: s.leadPersonnelId }],
        route: withRecord('/stations', s.id),
        summary: s.description,
        body: s.incidentHistory.join(' '),
        author: s.leadPersonnelName,
        projects: s.activeProjects,
        office: s.name,
        format: 'location',
        mediaType: 'data'
      })
    );
  }

  for (const pr of INTERNAL_PROGRAMS) {
    out.push(
      entry({
        kind: 'project',
        id: pr.id,
        code: pr.code,
        title: pr.name,
        rawDate: pr.startYear,
        classification: pr.clearance,
        meta: pr,
        tags: [pr.status, pr.threatLevel],
        related: [
          { kind: 'department', id: pr.leadDepartmentId },
          ...refs('personnel', pr.linkedPersonnel),
          ...refs('office', pr.linkedStations)
        ],
        route: withRecord('/programs', pr.id),
        summary: pr.objective,
        body: `${pr.publicCoverStory} ${pr.milestones.map((m) => m.event).join(' ')}`,
        author: pr.director,
        department: getDepartmentById(pr.leadDepartmentId)?.name,
        projects: [pr.name],
        format: 'dossier'
      })
    );
  }

  for (const dep of DEPARTMENTS) {
    out.push(
      entry({
        kind: 'department',
        id: dep.id,
        code: dep.code,
        title: dep.name,
        meta: dep,
        tags: dep.subDivisions,
        route: withRecord('/departments', dep.id),
        summary: dep.mandate,
        body: dep.subDivisions.join(' '),
        author: dep.director,
        department: dep.name,
        office: dep.headquarters,
        format: 'charter'
      })
    );
  }

  for (const pd of DISCONTINUED_PRODUCTS) {
    out.push(
      entry({
        kind: 'product',
        id: pd.id,
        code: pd.modelCode,
        title: pd.name,
        rawDate: pd.releaseYear,
        meta: pd,
        tags: [pd.intendedMarket, pd.patentNumber],
        route: withRecord('/products', pd.id),
        summary: pd.advertisedFunction,
        body: pd.recallReason,
        format: 'product-sheet'
      })
    );
  }

  for (const a of AUDIO_ARTIFACTS) {
    out.push(
      entry({
        kind: 'audio',
        id: a.id,
        code: a.code,
        title: a.title,
        rawDate: a.recordingDate,
        classification: a.classification,
        meta: a,
        tags: [a.carrierFrequency, a.synthesisPreset],
        route: withRecord('/audio', a.id),
        summary: a.summary,
        body: a.transcript,
        office: a.recordedAt,
        projects: detectProjects(a.title, a.summary),
        format: 'audio',
        mediaType: 'audio'
      })
    );
  }

  for (const e of EMAIL_THREADS) {
    out.push(
      entry({
        kind: 'email',
        id: e.id,
        code: e.threadCode,
        title: e.subject,
        rawDate: e.date,
        classification: e.classification,
        meta: e,
        tags: e.participants.map((p) => p.role),
        route: withRecord('/communications', e.id),
        summary: e.messages[0]?.body ?? '',
        body: e.messages.map((m) => m.body).join(' '),
        filename: e.messages.find((m) => m.attachmentName)?.attachmentName,
        author: e.participants.map((p) => p.name).join(', '),
        projects: detectProjects(e.subject, e.messages.map((m) => m.body).join(' ')),
        format: 'email'
      })
    );
  }

  for (const m of MEETING_RECORDS) {
    out.push(
      entry({
        kind: 'meeting',
        id: m.id,
        code: m.meetingCode,
        title: m.title,
        rawDate: m.date,
        classification: m.clearance,
        meta: m,
        tags: m.agenda,
        route: withRecord('/communications', m.id),
        summary: m.minutes,
        body: `${m.minutes} ${m.motionsPassed.join(' ')}`,
        author: m.chairperson,
        office: m.location,
        projects: detectProjects(m.title, m.minutes),
        format: 'minutes'
      })
    );
  }

  for (const pr of PRESS_RELEASES) {
    out.push(
      entry({
        kind: 'press',
        id: pr.id,
        code: pr.releaseNumber,
        title: pr.headline,
        rawDate: pr.date,
        classification: 'Level 1 - General',
        meta: pr,
        tags: [pr.city],
        route: withRecord('/communications', pr.id),
        summary: pr.leadParagraph,
        body: pr.bodyParagraphs.join(' '),
        author: pr.mediaContact,
        office: pr.city,
        projects: detectProjects(pr.headline, pr.leadParagraph),
        format: 'press-release'
      })
    );
  }

  for (const t of TIMELINE_ENTRIES) {
    out.push(
      entry({
        kind: 'timeline',
        id: t.id,
        code: `${t.year}-${t.departmentCode}`,
        title: t.title,
        rawDate: t.year,
        classification: t.classification,
        meta: t,
        tags: [t.era, t.departmentCode, ...(t.isCovert ? ['Covert'] : [])],
        route: withRecord('/timeline', t.id),
        summary: t.description,
        body: t.description,
        department: DEPARTMENTS.find((d) => d.code === t.departmentCode)?.name,
        projects: detectProjects(t.title, t.description),
        format: 'event',
        mediaType: 'data'
      })
    );
  }

  for (const n of NEWSLETTERS) {
    out.push(
      entry({
        kind: 'newsletter',
        id: n.id,
        code: n.issueNumber,
        title: n.title,
        rawDate: n.publicationDate,
        classification: 'Level 1 - General',
        meta: n,
        tags: [n.volumeName],
        route: withRecord('/newsletters', n.id),
        summary: n.leadArticle.headline,
        body: `${n.leadArticle.content} ${n.secondaryArticles.map((a) => `${a.headline} ${a.content}`).join(' ')}`,
        format: 'newsletter'
      })
    );
  }

  for (const tm of TRAINING_MODULES) {
    out.push(
      entry({
        kind: 'training',
        id: tm.id,
        code: tm.moduleCode,
        title: tm.title,
        meta: tm,
        tags: [tm.departmentCode, tm.certificationTitle],
        route: withRecord('/training', tm.id),
        summary: tm.overview,
        body: tm.sections.map((s) => `${s.title} ${s.text}`).join(' '),
        department: DEPARTMENTS.find((d) => d.code === tm.departmentCode)?.name,
        format: 'course'
      })
    );
  }

  for (const j of JOB_POSTINGS) {
    out.push(
      entry({
        kind: 'job',
        id: j.id,
        code: j.requisitionId,
        title: j.title,
        rawDate: j.postingDate,
        classification: j.clearanceRequired,
        meta: j,
        tags: [j.location],
        route: withRecord('/careers', j.id),
        summary: j.overview,
        body: [...j.responsibilities, ...j.qualifications].join(' '),
        department: j.department,
        office: j.location,
        format: 'job-posting'
      })
    );
  }

  for (const dl of DEAD_LINKS) {
    out.push(
      entry({
        kind: 'dead-link',
        id: dl.id,
        code: dl.originalHost,
        title: dl.originalTitle,
        rawDate: dl.archiveDate,
        meta: dl,
        defaultStatus: 'corrupted',
        tags: [dl.errorType],
        route: withRecord('/deadlinks', dl.id),
        summary: dl.cachedSnippet,
        body: dl.investigatorNotes,
        filename: dl.url,
        format: 'web-capture',
        mediaType: 'web'
      })
    );
  }

  for (const r of ANNUAL_REPORTS) {
    const id = r.id;
    out.push(
      entry({
        kind: 'annual-report',
        id,
        code: `AR-${r.year}`,
        title: r.title,
        rawDate: r.year,
        classification: 'Level 1 - General',
        meta: r,
        tags: r.keyInitiatives,
        route: withRecord('/reports', id),
        summary: r.fiscalHeadline,
        body: r.executiveLetter,
        format: 'report',
        mediaType: 'data'
      })
    );
  }

  for (const log of RESTORATION_LOGS) {
    out.push(
      entry({
        kind: 'restoration-log',
        id: log.id,
        code: log.code,
        title: log.title,
        rawDate: log.date,
        meta: log,
        defaultStatus: 'restored',
        tags: [...log.tags, log.action],
        related: log.affected.map((id) => refFromId(id)).filter((r): r is RecordRef => !!r),
        route: '/',
        summary: log.notes,
        body: log.notes,
        author: log.operator,
        format: 'log',
        mediaType: 'data'
      })
    );
  }

  return out.filter((e) => e.status !== 'draft');
}

/** Best-effort kind inference from an id prefix (used for loose id lists). */
export function refFromId(id: string): RecordRef | null {
  const prefixes: Array<[string, RecordKind]> = [
    ['doc-', 'document'],
    ['p-', 'personnel'],
    ['st-', 'office'],
    ['prog-', 'project'],
    ['dept-', 'department'],
    ['audio-', 'audio'],
    ['eml-', 'email'],
    ['dead-', 'dead-link'],
    ['rst-', 'restoration-log']
  ];
  const hit = prefixes.find(([p]) => id.startsWith(p));
  return hit ? { kind: hit[1], id } : null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

let cache: ArchiveEntry[] | null = null;
let cacheByKey: Map<string, ArchiveEntry> | null = null;

const keyOf = (ref: RecordRef) => `${ref.kind}:${ref.id}`;

/** All normalised archive entries (built once, then cached). */
export function getArchiveEntries(): ArchiveEntry[] {
  if (!cache) {
    cache = buildEntries();
    cacheByKey = new Map(cache.map((e) => [keyOf(e.ref), e]));
  }
  return cache;
}

export function findEntry(ref: RecordRef): ArchiveEntry | undefined {
  getArchiveEntries();
  return cacheByKey!.get(keyOf(ref));
}

/** Resolve an entry's related refs, dropping any that do not exist. */
export function relatedEntries(e: ArchiveEntry): ArchiveEntry[] {
  const seen = new Set<string>();
  const out: ArchiveEntry[] = [];
  for (const r of [...e.related, ...e.links.map((l) => l.to)]) {
    const k = keyOf(r);
    if (seen.has(k)) continue;
    seen.add(k);
    const hit = findEntry(r);
    if (hit) out.push(hit);
  }
  return out;
}

export const clearanceOf = (e: ArchiveEntry): ClearanceLevel | null => e.classification;
