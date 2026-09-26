# Content model

All archive content is **typed data** in `src/content/**`. Components never embed story text beyond UI
chrome. The types live in `src/types/` (`records.ts`, `content.ts`, `puzzles.ts`, `search.ts`) and are
re-exported from `@/types`.

## Principles

1. **One collection per file**, exported as a `SCREAMING_CASE` array, re-exported from `src/content/index.ts`.
2. **Every record has a stable `id`**, which is never reused or renamed (ids appear in URLs, saves and
   cross-references).
3. **Human-facing codes are separate from ids.** For example, `id: 'doc-007'` has
   `code: 'DOC-1989-SVALBARD-EVENT'`.
4. **Cross-references are ids**, checked by `validateContent()` (run in tests and via
   `npm run validate:content`).
5. **Dates are ISO `YYYY-MM-DD`** (or a bare year where only that is known).
6. **Editorial notes stay out of the fiction.** `editorialNote` is never rendered or exported.

## Shared metadata

Every record type extends `RecordMeta` (all fields optional; the normaliser fills gaps):

| Field           | Type             | Notes                                                                         |
| --------------- | ---------------- | ----------------------------------------------------------------------------- |
| `contentStatus` | `ContentStatus`  | `recovered` · `partial` · `redacted` · `corrupted` · `restored` · `draft`     |
| `sourcePath`    | `string`         | in-world path. Derived as `//POSTOJNA/VAULT0/<KIND>/<YEAR>/<CODE>` if omitted |
| `related`       | `RecordRef[]`    | loose relations `{ kind, id }`                                                |
| `links`         | `DocumentLink[]` | annotated, directed links `{ to, relation, note? }`                           |
| `editorialNote` | `string`         | authoring-only; never shown                                                   |

`relation` is one of `mentions`, `authored-by`, `located-at`, `part-of`, `supersedes`, `contradicts` or
`related`. `draft` records are excluded from the normalised archive (and therefore from search).

### The normalised entry

`lib/archive/records.ts → getArchiveEntries()` turns every collection into an `ArchiveEntry`. This
guarantees the fields every record needs: **id, kind, code, title, date, year, classification, status,
sourcePath, tags, related, links, route** (internal link), **summary, body, filename, author, department,
projects, office, format, mediaType**. Search, "related records" and the content validator all work on
entries.

## Collections

| Kind (`RecordKind`) | Type                  | File                                         | Export                  | Id format           |
| ------------------- | --------------------- | -------------------------------------------- | ----------------------- | ------------------- |
| `document`          | `DocumentRecord`      | `documents/authored-documents.ts`            | `AUTHORED_DOCUMENTS`    | `doc-001`           |
|                     |                       | `documents/generated-records.ts` (templated) | `GENERATED_DOCUMENTS`   | `doc-026`…`doc-165` |
|                     |                       | `documents/order-documents.ts`               | `ORDER_DOCUMENTS`       | `ovp-001`           |
| `personnel`         | `Personnel`           | `personnel/personnel.ts`                     | `PERSONNEL`             | `p-001`             |
| `office`            | `RegionalStation`     | `offices/stations.ts`                        | `REGIONAL_STATIONS`     | `st-01`             |
| `project`           | `InternalProgram`     | `projects/programs.ts`                       | `INTERNAL_PROGRAMS`     | `prog-01`           |
| `department`        | `Department`          | `departments/departments.ts`                 | `DEPARTMENTS`           | `dept-sfpc`         |
| `audio`             | `AudioArtifact`       | `audio/audio-artifacts.ts`                   | `AUDIO_ARTIFACTS`       | `audio-01`          |
| `email`             | `EmailThread`         | `communications/emails.ts`                   | `EMAIL_THREADS`         | `eml-01`            |
| `meeting`           | `MeetingRecord`       | `communications/meetings.ts`                 | `MEETING_RECORDS`       | `meet-01`           |
| `newsletter`        | `Newsletter`          | `communications/newsletters.ts`              | `NEWSLETTERS`           | `news-01`           |
| `press`             | `PressRelease`        | `communications/press-releases.ts`           | `PRESS_RELEASES`        | `pr-01`             |
| `timeline`          | `TimelineEntry`       | `history/timeline.ts`                        | `TIMELINE_ENTRIES`      | `tl-01`             |
| `product`           | `DiscontinuedProduct` | `corporate/discontinued-products.ts`         | `DISCONTINUED_PRODUCTS` | `prod-01`           |
| `annual-report`     | `AnnualReport`        | `corporate/annual-reports.ts`                | `ANNUAL_REPORTS`        | `ar-1986`           |
| `training`          | `TrainingModule`      | `corporate/training-modules.ts`              | `TRAINING_MODULES`      | `train-01`          |
| `job`               | `JobPosting`          | `corporate/job-postings.ts`                  | `JOB_POSTINGS`          | `job-01`            |
| `dead-link`         | `DeadLink`            | `web/dead-links.ts`                          | `DEAD_LINKS`            | `dead-01`           |
| `restoration-log`   | `RestorationLog`      | `restoration/restoration-logs.ts`            | `RESTORATION_LOGS`      | `rst-001`           |

Not addressable as records: `corporate/values.ts` (`COMPANY_VALUES`), `tools/tools-lab.ts` (tool
definitions), and everything in `content/puzzles/` (see [PUZZLE_SYSTEM.md](PUZZLE_SYSTEM.md)).

Aliases for the brief's vocabulary: `OfficeRecord = RegionalStation` (offices and field stations),
`ProjectRecord = InternalProgram`, `PersonnelProfile = Personnel`, `TimelineEvent = TimelineEntry`.

### Supporting types

| Type                                                                  | Where              | Purpose                                                                           |
| --------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------- |
| `DocumentRevision`                                                    | `types/content.ts` | prior versions of a document (`revisions?: DocumentRevision[]`)                   |
| `DocumentLink`                                                        | `types/records.ts` | annotated cross-reference                                                         |
| `ClearanceLevel`                                                      | `types/records.ts` | `Level 1 - General` … `Level 5 - Black Dossier` (+ suffixes)                      |
| `AccessState`                                                         | `types/puzzles.ts` | chosen clearance + de-scrambler request                                           |
| `SearchFilters`                                                       | `types/search.ts`  | kinds, formats, clearance tiers, dept, project, office, status, media, date range |
| `PuzzleDefinition`, `Clue`, `Hint`, `UnlockCondition`, `PuzzleReward` | `types/puzzles.ts` | see PUZZLE_SYSTEM                                                                 |

## Documents in detail

```ts
interface DocumentRecord extends RecordMeta {
  id: string; // 'doc-166'
  code: string; // 'DOC-1994-HALLOWAY-MEMO'  (see CONTENT_STYLE_GUIDE)
  title: string;
  category: DocumentCategory; // 'Memorandum' | 'Dossier' | 'Field Report' | …
  departmentId: string; // must exist in DEPARTMENTS
  departmentName: string;
  author: string;
  date: string; // 'YYYY-MM-DD'
  clearance: ClearanceLevel; // gates reading: see "Clearance" below
  summary: string; // the unclassified abstract
  content: string; // body as shown WITHOUT the de-scrambler
  redactedContent?: string; // cleartext shown WITH the de-scrambler
  tags: string[]; // include 'Order' for Ordo Vocis Profundae material
  classificationStamp: ClassificationStamp;
  relatedPersonnel?: string[]; // p-…
  relatedStations?: string[]; // st-…
  relatedPrograms?: string[]; // prog-…
  downloadableFilename?: string;
  isWhistleblowerLeak?: boolean;
  revisions?: DocumentRevision[];
}
```

### Redactions

Write hidden words inline in `content` and `summary` as `[REDACTED: the hidden words]` (or a bare
`[REDACTED]`). Then:

- Without the de-scrambler, the words are **stripped before render** (`RedactedText`, `stripRedactions`),
  so they never reach the DOM, exports, the clipboard or the search index.
- With the de-scrambler (earned at Level 3), the viewer shows `redactedContent` when present.
- A document that hides words must also provide `redactedContent`. A test enforces this.

### Clearance

A document whose `clearance` tier is above the player's **effective clearance** opens as a
_sealed_ notice (title, abstract, which seal earns access) instead of its body. Exports refuse while it is
sealed. Keep Level 1 for anything a first-time visitor should be able to read.

## Adding content

### A new document

1. Append to `AUTHORED_DOCUMENTS` in `src/content/documents/authored-documents.ts` (or `ORDER_DOCUMENTS`
   for Order material):

   ```ts
   {
     id: 'doc-166',
     code: 'DOC-1994-HALLOWAY-MEMO',
     title: 'Memorandum: Relocation of the Halloway Tapes',
     category: 'Memorandum',
     departmentId: 'dept-airs',
     departmentName: 'Archive Integrity & Retrospective Scrubbing',
     author: 'M. Okonkwo',
     date: '1994-03-11',
     clearance: 'Level 2 - Confidential',
     summary: 'Transfer order for the Halloway reels to [REDACTED: Vault 0].',
     content: 'Effective immediately, all reels are to be moved to [REDACTED: Vault 0] …',
     redactedContent: 'Effective immediately, all reels are to be moved to Vault 0 …',
     tags: ['Archive', 'Audio'],
     classificationStamp: 'CONFIDENTIAL',
     relatedPersonnel: ['p-012'],
     links: [{ to: { kind: 'audio', id: 'audio-03' }, relation: 'mentions', note: 'the reels themselves' }]
   }
   ```

2. Run `npm run validate:content`. Fix every **error**; read the warnings (some are intentional in-world
   gaps).
3. The document appears automatically in the vault, search, related-record panels and `/documents?doc=doc-166`.

### A new personnel file, station or program

Add the record to its collection file and reference existing ids (`departmentId`, `stationId`,
`leadPersonnelId`, `linkedPersonnel` …). The validator reports unknown ids. Pages pick it up through the
barrel and deep-link via `?record=<id>`.

### An audio artifact

Every `AudioArtifact` **must** have a non-empty `transcript` (the text-first fallback; the validator
errors without one) and should have an `audioDescription` (what it sounds like, for non-listeners). Audio
is synthesised from `synthesisPreset`, so no media file is needed. If you add a recording, put it in
`public/assets/audio/`, set `src`, and see [DEPLOYMENT.md](DEPLOYMENT.md#media-hosting). Nothing may
autoplay.

### A new collection

1. Add the type to `src/types/content.ts` (extend `RecordMeta`) and a `RecordKind` in `records.ts`.
2. Create `src/content/<area>/<name>.ts` and export it from `src/content/index.ts`.
3. Map it in `buildEntries()` in `lib/archive/records.ts` (route, summary, body, format, mediaType).
4. Add referential checks to `lib/archive/validate-content.ts` if it references other collections.
