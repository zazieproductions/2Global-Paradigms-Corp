/**
 * Content integrity checks.
 *
 * Run by `npm run validate:content` and by the test suite. Errors fail CI;
 * warnings are informational (e.g. a personnel file cites a document code
 * that was never recovered — that is an intentional in-world gap).
 */
import {
  AUDIO_ARTIFACTS,
  DEPARTMENTS,
  DOCUMENTS,
  INTERNAL_PROGRAMS,
  PERSONNEL,
  PUZZLES,
  REGIONAL_STATIONS
} from '@/content';
import { CLEARANCE_TIERS } from '@/config/clearance';
import type { ArchiveEntry } from '@/types';
import { validateDirectiveCatalogue } from '@/lib/puzzles/directives';
import { findEntry, getArchiveEntries, resolveDocument } from './records';

export interface ContentIssue {
  level: 'error' | 'warning';
  where: string;
  message: string;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/**
 * Document code shape: a 2–7 letter series prefix, a year, an uppercase slug.
 * Seven letters is not slack — `TRANSIT-…` is the longest series prefix in
 * `generated-records.ts`, alongside `OCEAN`, `POLAR`, `LEGAL` and `BEHAV`.
 * Keeping the bound tight means this warning only ever fires on a genuinely
 * malformed code, so the warnings the suite prints are all of one kind
 * (unresolved references — see docs/CONTINUITY.md §3).
 */
const DOC_CODE = /^[A-Z]{2,7}-\d{4}-[A-Z0-9-]+$/;
const CLEARANCES = new Set<string>(CLEARANCE_TIERS.map((t) => t.level));

export function validateContent(entries: ArchiveEntry[] = getArchiveEntries()): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const err = (where: string, message: string) => issues.push({ level: 'error', where, message });
  const warn = (where: string, message: string) => issues.push({ level: 'warning', where, message });

  // 1. Unique ids within each kind.
  const seen = new Set<string>();
  for (const e of entries) {
    const key = `${e.kind}:${e.id}`;
    if (seen.has(key)) err(key, 'duplicate id');
    seen.add(key);
    if (!e.title.trim()) err(key, 'missing title');
    if (!e.sourcePath) err(key, 'missing source path');
  }

  // 2. Unique document codes + format.
  const codes = new Set<string>();
  for (const d of DOCUMENTS) {
    const code = d.code.toUpperCase();
    if (codes.has(code)) err(`document:${d.id}`, `duplicate code ${d.code}`);
    codes.add(code);
    if (!DOC_CODE.test(d.code)) warn(`document:${d.id}`, `non-standard code "${d.code}"`);
    if (!ISO_DATE.test(d.date)) err(`document:${d.id}`, `date "${d.date}" is not YYYY-MM-DD`);
  }

  // 3. Classification values.
  const checkClearance = (where: string, level: string) => {
    const base = level.replace(' (REVOKED)', '');
    if (!CLEARANCES.has(base)) err(where, `unknown classification "${level}"`);
  };
  DOCUMENTS.forEach((d) => checkClearance(`document:${d.id}`, d.clearance));
  PERSONNEL.forEach((p) => checkClearance(`personnel:${p.id}`, p.clearance));
  INTERNAL_PROGRAMS.forEach((p) => checkClearance(`project:${p.id}`, p.clearance));
  AUDIO_ARTIFACTS.forEach((a) => checkClearance(`audio:${a.id}`, a.classification));

  // 4. Cross-references resolve.
  const deptIds = new Set(DEPARTMENTS.map((d) => d.id));
  const personIds = new Set(PERSONNEL.map((p) => p.id));
  const stationIds = new Set(REGIONAL_STATIONS.map((s) => s.id));
  const programIds = new Set(INTERNAL_PROGRAMS.map((p) => p.id));

  for (const d of DOCUMENTS) {
    const w = `document:${d.id}`;
    if (!deptIds.has(d.departmentId)) err(w, `unknown department ${d.departmentId}`);
    d.relatedPersonnel?.forEach((id) => personIds.has(id) || err(w, `unknown personnel ${id}`));
    d.relatedStations?.forEach((id) => stationIds.has(id) || err(w, `unknown station ${id}`));
    d.relatedPrograms?.forEach((id) => programIds.has(id) || err(w, `unknown program ${id}`));
  }
  for (const p of PERSONNEL) {
    const w = `personnel:${p.id}`;
    if (!deptIds.has(p.departmentId)) err(w, `unknown department ${p.departmentId}`);
    if (!stationIds.has(p.stationId)) err(w, `unknown station ${p.stationId}`);
    for (const code of p.linkedDocuments) {
      if (!resolveDocument(code)) warn(w, `linked document ${code} not recovered`);
    }
  }
  for (const s of REGIONAL_STATIONS) {
    if (s.leadPersonnelId && !personIds.has(s.leadPersonnelId)) {
      err(`office:${s.id}`, `unknown lead ${s.leadPersonnelId}`);
    }
  }
  for (const pr of INTERNAL_PROGRAMS) {
    const w = `project:${pr.id}`;
    if (!deptIds.has(pr.leadDepartmentId)) err(w, `unknown department ${pr.leadDepartmentId}`);
    pr.linkedPersonnel.forEach((id) => personIds.has(id) || err(w, `unknown personnel ${id}`));
    pr.linkedStations.forEach((id) => stationIds.has(id) || err(w, `unknown station ${id}`));
  }

  // 5. Generic related refs + links on every entry.
  for (const e of entries) {
    for (const r of e.related) {
      if (!findEntry(r)) warn(`${e.kind}:${e.id}`, `related ${r.kind}:${r.id} does not resolve`);
    }
    for (const l of e.links) {
      if (!findEntry(l.to)) err(`${e.kind}:${e.id}`, `link ${l.to.kind}:${l.to.id} does not resolve`);
    }
  }

  // 6. Audio must be text-first.
  for (const a of AUDIO_ARTIFACTS) {
    if (!a.transcript.trim()) err(`audio:${a.id}`, 'missing transcript (required text fallback)');
  }

  // 7. Puzzles.
  const puzzleIds = new Set<string>();
  for (const p of PUZZLES) {
    const w = `puzzle:${p.id}`;
    if (puzzleIds.has(p.id)) err(w, 'duplicate puzzle id');
    puzzleIds.add(p.id);
    if (p.hints.length === 0) err(w, 'no hints defined');
    const tiers = p.hints.map((h) => h.tier);
    if (tiers.some((t, i) => i > 0 && t <= tiers[i - 1])) err(w, 'hint tiers must ascend');
    if (p.validation.method === 'sha256') {
      if (p.validation.digests.length === 0) err(w, 'no answer digests');
      p.validation.digests.forEach((d) => /^[0-9a-f]{64}$/.test(d) || err(w, `malformed digest ${d}`));
    }
    for (const c of p.clues) {
      if (c.location.type === 'record' && !findEntry(c.location.ref)) {
        err(w, `clue ${c.id} points to missing ${c.location.ref.kind}:${c.location.ref.id}`);
      }
    }
  }
  for (const p of PUZZLES) {
    for (const r of p.requires ?? []) {
      if (r.type === 'puzzle-completed' && !puzzleIds.has(r.puzzleId)) {
        err(`puzzle:${p.id}`, `requires unknown puzzle ${r.puzzleId}`);
      }
    }
  }

  // 8. Field directives, their milestone rules and their FIELD INTEL filings.
  //    Every step must point at something the archive really contains, because
  //    the ledger will only ever accept a catalogued observation.
  for (const issue of validateDirectiveCatalogue()) {
    if (issue.level === 'error') err(issue.where, issue.message);
    else warn(issue.where, issue.message);
  }

  return issues;
}
