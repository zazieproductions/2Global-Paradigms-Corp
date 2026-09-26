import { describe, expect, it } from 'vitest';
import { getArchiveEntries } from '@/lib/archive/records';
import { getFacets, searchArchive, tokenize } from '@/lib/search/search-index';

const ids = (text: string, filters = {}) =>
  searchArchive({ text, filters, limit: 20 }).map((r) => r.entry.id);

describe('archive search', () => {
  it('indexes every collection', () => {
    const kinds = new Set(getArchiveEntries().map((e) => e.kind));
    for (const k of ['document', 'personnel', 'office', 'project', 'audio', 'email'])
      expect(kinds.has(k as never)).toBe(true);
  });

  it('finds a document by its human-facing code', () => {
    expect(ids('DOC-1989-SVALBARD-EVENT')[0]).toBe('doc-007');
  });

  it('finds records by title words, author and tag', () => {
    expect(ids('palimpsest').length).toBeGreaterThan(0);
    expect(ids('thorne').length).toBeGreaterThan(0);
  });

  it('applies kind and date filters', () => {
    const onlyAudio = searchArchive({ text: '', filters: { kinds: ['audio'] }, limit: 50 });
    expect(onlyAudio.length).toBeGreaterThan(0);
    expect(onlyAudio.every((r) => r.entry.kind === 'audio')).toBe(true);

    const dated = searchArchive({
      text: '',
      filters: { dateFrom: '1971-01-01', dateTo: '1979-12-31' },
      limit: 200
    });
    expect(dated.every((r) => !!r.entry.date && r.entry.date >= '1971' && r.entry.date <= '1979-12-31')).toBe(
      true
    );
  });

  it('returns nothing for nonsense', () => {
    expect(ids('zzqqxxnotaword')).toHaveLength(0);
  });

  it('tokenises and exposes facets', () => {
    expect(tokenize('Station-07 / Svalbard')).toEqual(['station-07', 'svalbard']);
    expect(tokenize('"project vesper" memo')).toEqual(['project vesper', 'memo']);
    const f = getFacets();
    expect(f.departments.length).toBeGreaterThan(3);
    expect(f.formats).toContain('document');
    expect(f.yearRange?.[0]).toBeLessThanOrEqual(1971);
  });
});
