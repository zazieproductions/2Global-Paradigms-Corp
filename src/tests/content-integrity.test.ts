/**
 * Content integrity — also runnable on its own via `npm run validate:content`.
 * Errors fail the build; warnings are printed for editors.
 */
import { describe, expect, it } from 'vitest';
import { AUDIO_ARTIFACTS, DOCUMENTS, PERSONNEL, PUZZLES } from '@/content';
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
});
