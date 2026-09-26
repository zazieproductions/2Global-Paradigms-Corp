/**
 * Archive search.
 *
 * Indexing strategy (see docs/ARCHITECTURE.md → "Search"):
 *  1. `getArchiveEntries()` normalises every collection (~450 records).
 *  2. `buildSearchIndex()` precomputes one lower-cased string per searchable
 *     field for each entry. This happens once, lazily, on first search.
 *  3. A query is split into terms (quoted phrases kept together). Every term
 *     must match at least one field (AND semantics). Each field match adds a
 *     weighted score; exact code matches get a large boost.
 *  4. Filters are applied before scoring, so they are cheap.
 *
 * At the current scale a linear scan over precomputed strings is well under
 * a millisecond per keystroke. If the archive grows past ~10k records, swap
 * `buildSearchIndex` for an inverted index — the public API won't change.
 *
 * Only the *redacted* body is indexed: cleartext hidden behind the
 * de-scrambler must never be discoverable through search.
 */
import type { ArchiveEntry, SearchField, SearchFilters, SearchQuery, SearchResult } from '@/types';
import { getArchiveEntries } from '@/lib/archive/records';
import { clearanceTier } from '@/lib/archive/clearance';
import { snippetAround } from '@/lib/utils/text';

export const FIELD_WEIGHTS: Record<SearchField, number> = {
  code: 10,
  title: 6,
  tags: 5,
  author: 4,
  filename: 4,
  project: 3,
  department: 3,
  office: 3,
  year: 3,
  summary: 2,
  body: 1
};

const FIELDS = Object.keys(FIELD_WEIGHTS) as SearchField[];

export interface IndexedEntry {
  entry: ArchiveEntry;
  fields: Record<SearchField, string>;
}

export interface SearchIndex {
  items: IndexedEntry[];
}

const lc = (s: string | undefined | null) => (s ?? '').toLowerCase();

export function indexEntry(entry: ArchiveEntry): IndexedEntry {
  return {
    entry,
    fields: {
      code: lc(entry.code),
      title: lc(entry.title),
      tags: lc(entry.tags.join(' | ')),
      author: lc(entry.author),
      filename: lc(entry.filename),
      project: lc(entry.projects.join(' | ')),
      department: lc(entry.department),
      office: lc(entry.office),
      year: entry.year ? String(entry.year) : '',
      summary: lc(entry.summary),
      body: lc(entry.body)
    }
  };
}

export function buildSearchIndex(entries: ArchiveEntry[] = getArchiveEntries()): SearchIndex {
  return { items: entries.map(indexEntry) };
}

let defaultIndex: SearchIndex | null = null;
/** Lazily-built index over the whole archive. */
export function getSearchIndex(): SearchIndex {
  if (!defaultIndex) defaultIndex = buildSearchIndex();
  return defaultIndex;
}

/** Split a query into lower-case terms; `"quoted phrases"` stay intact. */
export function tokenize(text: string): string[] {
  const terms: string[] = [];
  const re = /"([^"]+)"|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const t = (m[1] ?? m[2]).trim().toLowerCase();
    // Skip punctuation-only fragments like `/` or `--`.
    if (t && /[\p{L}\p{N}]/u.test(t)) terms.push(t);
  }
  return terms;
}

const inList = (value: string | undefined, list: string[] | undefined) =>
  !list || list.length === 0 || (!!value && list.includes(value));

/** True if an entry satisfies every active filter. */
export function matchesFilters(e: ArchiveEntry, f: SearchFilters | undefined): boolean {
  if (!f) return true;
  if (f.kinds?.length && !f.kinds.includes(e.kind)) return false;
  if (f.formats?.length && !f.formats.includes(e.format)) return false;
  if (f.mediaTypes?.length && !f.mediaTypes.includes(e.mediaType)) return false;
  if (f.statuses?.length && !f.statuses.includes(e.status)) return false;
  if (f.clearanceTiers?.length) {
    if (!e.classification || !f.clearanceTiers.includes(clearanceTier(e.classification))) return false;
  }
  if (!inList(e.department, f.departments)) return false;
  if (!inList(e.office, f.offices)) return false;
  if (f.projects?.length && !e.projects.some((p) => f.projects!.includes(p))) return false;
  if (f.dateFrom || f.dateTo) {
    if (!e.date) return false;
    if (f.dateFrom && e.date < f.dateFrom) return false;
    if (f.dateTo && e.date > f.dateTo) return false;
  }
  return true;
}

function scoreItem(item: IndexedEntry, terms: string[]): { score: number; matched: SearchField[] } | null {
  let score = 0;
  const matched = new Set<SearchField>();
  for (const term of terms) {
    let termHit = false;
    for (const field of FIELDS) {
      const value = item.fields[field];
      if (!value) continue;
      const idx = value.indexOf(term);
      if (idx === -1) continue;
      termHit = true;
      matched.add(field);
      let s = FIELD_WEIGHTS[field];
      if (idx === 0) s += FIELD_WEIGHTS[field] * 0.5; // prefix bonus
      if (field === 'code' && value === term) s += 50; // exact document ID
      score += s;
    }
    if (!termHit) return null; // AND semantics
  }
  return { score, matched: [...matched] };
}

/**
 * Search the archive. With empty text and filters, returns filtered entries in
 * index order (useful for browsing).
 */
export function searchArchive(query: SearchQuery, index: SearchIndex = getSearchIndex()): SearchResult[] {
  const terms = tokenize(query.text);
  const limit = query.limit ?? 50;
  const results: SearchResult[] = [];

  for (const item of index.items) {
    if (!matchesFilters(item.entry, query.filters)) continue;
    if (terms.length === 0) {
      results.push({
        entry: item.entry,
        score: 0,
        matchedFields: [],
        snippet: snippetAround(item.entry.summary, '')
      });
      continue;
    }
    const hit = scoreItem(item, terms);
    if (!hit) continue;
    const firstTerm = terms[0];
    const source = item.fields.summary.includes(firstTerm)
      ? item.entry.summary
      : item.fields.body.includes(firstTerm)
        ? item.entry.body
        : item.entry.summary;
    results.push({
      entry: item.entry,
      score: hit.score,
      matchedFields: hit.matched,
      snippet: snippetAround(source, firstTerm)
    });
  }

  if (terms.length) results.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title));
  return results.slice(0, limit);
}

/** Distinct values available for building filter UIs. */
export function getFacets(entries: ArchiveEntry[] = getArchiveEntries()) {
  const uniq = (xs: Array<string | undefined>) =>
    [...new Set(xs.filter((x): x is string => !!x))].sort((a, b) => a.localeCompare(b));
  const years = entries.map((e) => e.year).filter((y): y is number => y !== null);
  return {
    departments: uniq(entries.map((e) => e.department)),
    projects: uniq(entries.flatMap((e) => e.projects)),
    formats: uniq(entries.map((e) => e.format)),
    statuses: uniq(entries.map((e) => e.status)),
    yearRange: years.length ? ([Math.min(...years), Math.max(...years)] as const) : null
  };
}
