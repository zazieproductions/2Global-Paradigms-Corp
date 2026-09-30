/**
 * Content integrity — also runnable on its own via `npm run validate:content`.
 * Errors fail the build; warnings are printed for editors.
 */
import { describe, expect, it } from 'vitest';
import { AUDIO_ARTIFACTS, DOCUMENTS, PERSONNEL, PUZZLES } from '@/content';
import { FRAGMENTS, SEALS } from '@/content/puzzles/seals';
import { NAV_ITEMS, pathForTab } from '@/config/navigation';
import { REDACTION_PATTERN } from '@/lib/archive/redaction';
import { getArchiveEntries } from '@/lib/archive/records';
import { validateContent } from '@/lib/archive/validate-content';

describe('content integrity', () => {
  const issues = validateContent();
  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');

  it('has no validation errors', () => {
    if (warnings.length) {
      console.warn(
        `[validate:content] ${warnings.length} warning(s):\n` +
          warnings
            .slice(0, 40)
            .map((w) => `  - ${w.where}: ${w.message}`)
            .join('\n')
      );
    }
    expect(errors.map((e) => `${e.where}: ${e.message}`)).toEqual([]);
  });

  /**
   * See docs/CONTINUITY.md §3. Some `linkedDocuments` entries cite records that
   * were deliberately never recovered; those surface as warnings and are
   * load-bearing fiction. That is only a useful signal if every *other* warning
   * shape has been fixed — so the tolerated shape is pinned here.
   *
   * If this test fails on a new message shape, one of two things happened: a real
   * defect appeared (fix it), or a new deliberate gap was introduced (rule on it
   * in CONTINUITY.md §3 and widen this pattern). Do not silence it.
   */
  it('warns only about references that were deliberately never recovered', () => {
    const unexpected = warnings
      .filter((w) => !/^linked document [A-Z0-9-]+ not recovered$/.test(w.message))
      .map((w) => `${w.where}: ${w.message}`);
    expect(unexpected).toEqual([]);
    // The gap itself is canon. If this ever hits zero, someone added records to
    // paper over an absence — read CONTINUITY.md §3 before accepting that.
    expect(warnings.length).toBeGreaterThan(0);
  });

  it('uses unique ids across the whole archive', () => {
    const seen = new Map<string, string>();
    for (const e of getArchiveEntries()) {
      const key = e.id;
      expect(seen.has(key), `duplicate id ${key}`).toBe(false);
      seen.set(key, e.kind);
    }
  });

  it('normalises every record with the shared metadata', () => {
    for (const e of getArchiveEntries()) {
      expect(e.id).toBeTruthy();
      expect(e.title).toBeTruthy();
      expect(e.sourcePath).toMatch(/^\/\//);
      expect(e.status).toBeTruthy();
      expect(Array.isArray(e.tags)).toBe(true);
      expect(e.route.startsWith('/')).toBe(true);
    }
  });

  it('ships a transcript and description with every audio artifact', () => {
    for (const a of AUDIO_ARTIFACTS) {
      expect(a.transcript.trim().length, a.id).toBeGreaterThan(40);
      expect(a.audioDescription, a.id).toBeTruthy();
    }
  });

  it('keeps document codes unique', () => {
    const codes = DOCUMENTS.map((d) => d.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it('points puzzle clues at records that exist', () => {
    const known = new Set(getArchiveEntries().map((e) => e.id));
    for (const p of PUZZLES) {
      for (const c of p.clues) {
        if (c.location.type === 'record')
          expect(known.has(c.location.ref.id), `${p.id} → ${c.location.ref.id}`).toBe(true);
      }
    }
    expect(PERSONNEL.length).toBeGreaterThan(0);
  });

  it('points seal clues at routes and document codes that exist', () => {
    const paths = new Set(NAV_ITEMS.map((i) => i.path));
    for (const p of PUZZLES) {
      for (const c of p.clues) {
        if (c.location.type === 'route')
          expect(paths.has(c.location.path), `${p.id} → ${c.location.path}`).toBe(true);
        // A pointer that names a record code must resolve to a record, not fall back to a label.
        if (c.location.type === 'ui') expect(c.location.label, p.id).not.toMatch(/^(DOC|OVP)-/);
      }
    }
    for (const f of FRAGMENTS) expect(pathForTab(f.tab), f.id).toBeTruthy();
    expect(SEALS).toHaveLength(7);
  });

  it('keeps the Order records tagged and above the public tier', () => {
    const order = DOCUMENTS.filter((d) => d.id.startsWith('ovp-'));
    expect(order.length).toBeGreaterThan(0);
    for (const d of order) {
      expect(d.tags, d.id).toContain('Order');
      expect(d.clearance, d.id).not.toMatch(/^Level 1/);
    }
  });

  it('only hides words where a de-scrambled version exists', () => {
    for (const d of DOCUMENTS) {
      const hides = [...d.content.matchAll(REDACTION_PATTERN)].some((m) => m[1]);
      if (hides) expect(d.redactedContent, d.id).toBeTruthy();
    }
  });
});
