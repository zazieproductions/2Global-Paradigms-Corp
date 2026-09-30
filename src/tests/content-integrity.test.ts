/**
 * Content integrity — also runnable on its own via `npm run validate:content`.
 * Errors fail the build; warnings are printed for editors.
 */
import { describe, expect, it } from 'vitest';
import { AUDIO_ARTIFACTS, DOCUMENTS, PERSONNEL, PUZZLES } from '@/content';
import { FRAGMENTS, SEALS } from '@/content/puzzles/seals';
import { NAV_ITEMS, pathForTab } from '@/config/navigation';
import { GHOSTS } from '@/content/restoration/purge-manifest';
import { ERA_TWO } from '@/config/seo-copy';
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
   * were deliberately never recovered; those surface as warnings. That is only a
   * useful signal if every *other* warning shape has been fixed — so the
   * tolerated shape is pinned here.
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

  /**
   * Directive 17 splits the unresolved set in two, and the split is the hook.
   *
   * Three of the unresolved codes are *purged* records: struck from the live
   * index under Executive Directive 17 but surviving as shards on the Postojna
   * spool, recoverable through the tape-salvage mechanic. The rest were simply
   * never recovered and must stay that way.
   *
   * So the floor on this warning count is not zero and not the full set — it is
   * "every ghost still struck, plus the permanent gaps". A ghost that starts
   * resolving means someone put the record back in the live index, which
   * contradicts the directive and makes the spool redundant. See INV-TAPE-01.
   */
  /**
   * `src/config/seo-copy.ts` is deliberately import-free so the Node-side static
   * generator can read it, which means its corpus figures are literals that
   * nothing upstream keeps honest. They are rendered into `llms.txt`, the
   * JSON-LD and the crawlable block — the surfaces models and crawlers actually
   * read — so a stale number there is worse than a stale number in prose.
   *
   * `records` and `recordKinds` must be exact. `corpusCharacters` is written
   * with a tilde ("~245,000 characters"), so it must be the measured figure
   * rounded to the nearest thousand — precise enough to be true, round enough
   * to read like the approximation it is labelled as.
   *
   * The character measure is the one `scripts/archive-report.mjs` prints in
   * `docs/generated/CORPUS.md`: summaries plus bodies across every entry.
   */
  it('keeps the machine-facing corpus figures equal to the measured corpus', () => {
    const all = getArchiveEntries();
    expect(ERA_TWO.records).toBe(all.length);
    expect(ERA_TWO.recordKinds).toBe(new Set(all.map((e) => e.kind)).size);

    const chars = all.reduce((n, e) => n + (e.summary?.length ?? 0) + (e.body?.length ?? 0), 0);
    expect(ERA_TWO.corpusCharacters, `measured ${chars} chars`).toBe(Math.round(chars / 1000) * 1000);
  });

  it('keeps every purged record struck from the live index', () => {
    const unresolved = new Set(
      warnings.map((w) => w.message.match(/^linked document (\S+) not recovered$/)?.[1] ?? '')
    );
    expect(GHOSTS.length).toBeGreaterThan(0);
    for (const ghost of GHOSTS) {
      expect(unresolved.has(ghost.code), `${ghost.id} ${ghost.code}`).toBe(true);
    }
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
