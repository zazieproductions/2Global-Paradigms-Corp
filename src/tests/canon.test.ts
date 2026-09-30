/**
 * Canon continuity — also runnable on its own via `npm run validate:canon`.
 *
 * `content-integrity.test.ts` proves the archive is structurally sound; this
 * suite proves it is narratively sound. See docs/CONTINUITY.md for what each
 * invariant means and what to do when one fails.
 */
// Node types are referenced per-file rather than added to tsconfig.app.json, so
// app code keeps its client-only surface (`types: ["vite/client"]`). This suite
// reads a component's source to prove the terminal's `help` is honest.
/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  DOCUMENTS,
  PERSONNEL,
  PUZZLES,
  REGIONAL_STATIONS,
  TERMINAL_ALIASES,
  TERMINAL_HELP,
  TIMELINE_ENTRIES
} from '@/content';
import { CHOIR_ALPHABET } from '@/lib/puzzles/choir-script';
import { CHOIR_INSCRIPTION, DEGREES, FRAGMENTS, SEALS } from '@/content/puzzles/seals';
import { getArchiveEntries } from '@/lib/archive/records';
import { validateCanon } from '@/lib/archive/validate-canon';
import {
  CANON_CHRONOLOGY,
  CANON_COUNTS,
  CANON_DEGREES,
  CANON_ERAS,
  CANON_INVARIANTS,
  CANON_SPINE
} from '@/lib/archive/canon';

describe('canon continuity', () => {
  const issues = validateCanon();
  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');

  it('has no canon errors', () => {
    if (warnings.length) {
      console.warn(
        `[validate:canon] ${warnings.length} warning(s):\n` +
          warnings.map((w) => `  - ${w.where}: ${w.message}`).join('\n')
      );
    }
    expect(errors.map((e) => `${e.where}: ${e.message}`)).toEqual([]);
  });

  it('declares every invariant with an id and an owner', () => {
    const ids = CANON_INVARIANTS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const inv of CANON_INVARIANTS) {
      expect(inv.id).toMatch(/^INV-[A-Z]+-\d{2}$/);
      expect(inv.statement.length).toBeGreaterThan(12);
      expect(inv.enforcedBy).toBeTruthy();
    }
  });

  it('covers the declared chronology exactly', () => {
    const years = TIMELINE_ENTRIES.map((t) => t.year);
    expect(Math.min(...years)).toBe(CANON_CHRONOLOGY.firstYear);
    expect(Math.max(...years)).toBe(CANON_CHRONOLOGY.lastYear);
    // The three eras tile the span with no gap or overlap.
    const sorted = [...CANON_ERAS].sort((a, b) => a.from - b.from);
    expect(sorted[0].from).toBe(CANON_CHRONOLOGY.firstYear);
    expect(sorted.at(-1)?.to).toBe(CANON_CHRONOLOGY.lastYear);
    sorted.slice(1).forEach((era, i) => expect(era.from).toBe(sorted[i].to + 1));
    expect(TIMELINE_ENTRIES.every((t) => CANON_ERAS.some((e) => e.label === t.era))).toBe(true);
  });

  it('gives every spine event evidence that resolves', () => {
    const known = new Set(getArchiveEntries().map((e) => e.id));
    const timelineIds = new Set(TIMELINE_ENTRIES.map((t) => t.id));
    const puzzleIds = new Set(PUZZLES.map((p) => p.id));
    for (const event of CANON_SPINE) {
      const { timeline = [], records = [], narrates = [], mentions = [] } = event.evidence;
      expect(timeline.length + records.length + narrates.length + mentions.length, event.id).toBeGreaterThan(
        0
      );
      for (const id of timeline) expect(timelineIds.has(id), `${event.id} → ${id}`).toBe(true);
      for (const id of [...records, ...narrates, ...mentions]) {
        expect(known.has(id), `${event.id} → ${id}`).toBe(true);
      }
      if (event.payoff) expect(puzzleIds.has(event.payoff), `${event.id} → ${event.payoff}`).toBe(true);
    }
  });

  it('keeps the seven seals in planetary order with distinct Seal-Words', () => {
    expect(SEALS).toHaveLength(CANON_COUNTS.seals);
    expect(SEALS.map((s) => s.planet)).toEqual([
      'Saturn',
      'Jupiter',
      'Mars',
      'Sun',
      'Venus',
      'Mercury',
      'Moon'
    ]);
    expect(SEALS.map((s) => s.id)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(new Set(SEALS.map((s) => s.sealWord)).size).toBe(7);
    // No Seal-Word may leak into a tier-1 or tier-2 hint.
    for (const s of SEALS) {
      for (const tier of [0, 1]) {
        expect(s.hints[tier].toUpperCase().includes(s.sealWord), `seal ${s.id} tier ${tier + 1}`).toBe(false);
      }
    }
  });

  it('teaches every letter the Choir inscription needs', () => {
    expect(FRAGMENTS).toHaveLength(CANON_COUNTS.choirFragments);
    expect(Object.keys(CHOIR_ALPHABET)).toHaveLength(CANON_COUNTS.choirLetters);
    const taught = new Set(FRAGMENTS.flatMap((f) => f.letters));
    for (const letter of new Set(CHOIR_INSCRIPTION.replace(/[^A-Z]/g, '').split(''))) {
      expect(taught.has(letter), letter).toBe(true);
    }
    // No fragment may teach a letter that is not in the alphabet it belongs to.
    for (const f of FRAGMENTS) {
      for (const l of f.letters) expect(CHOIR_ALPHABET[l], `${f.id} → ${l}`).toBeTruthy();
    }
  });

  it('keeps the initiation degrees aligned with clearance ranks', () => {
    expect([...DEGREES]).toEqual([...CANON_DEGREES]);
    expect(CANON_DEGREES[0]).toBe('');
    for (let rank = 1; rank <= CANON_COUNTS.clearanceRanks; rank++) {
      expect(CANON_DEGREES[rank], `rank ${rank}`).toBeTruthy();
    }
  });

  it('implements every command the terminal advertises', () => {
    // The terminal's dispatch is a switch in a component, so the only way to
    // prove `help` is honest is to read the source. INV-TERM-02 / INV-TERM-03.
    const src = readFileSync(resolve(process.cwd(), 'src/components/puzzles/terminal-modal.tsx'), 'utf8');
    const cases = new Set([...src.matchAll(/^\s*case '([a-z-]+)':/gm)].map((m) => m[1]));
    for (const h of TERMINAL_HELP) {
      const head = h.cmd.split(/\s+/)[0];
      expect(cases.has(head), `help lists "${h.cmd}" but there is no case '${head}'`).toBe(true);
    }
    for (const a of TERMINAL_ALIASES) {
      expect(cases.has(a.cmd), `alias "${a.cmd}" is documented but not implemented`).toBe(true);
    }
    // No alias may appear in the help list: the point is that it is undocumented.
    const documented = new Set(TERMINAL_HELP.map((h) => h.cmd.split(/\s+/)[0]));
    for (const a of TERMINAL_ALIASES) expect(documented.has(a.cmd), a.cmd).toBe(false);
  });

  it('names people and places the same way everywhere', () => {
    const station = new Map(REGIONAL_STATIONS.map((s) => [s.id, s.name]));
    for (const p of PERSONNEL) {
      const name = station.get(p.stationId);
      if (name) expect(p.stationName.startsWith(name), `${p.id} → ${p.stationId}`).toBe(true);
    }
    // Document codes are never reused as artifact codes.
    const codes = DOCUMENTS.map((d) => d.code);
    expect(codes.every((c) => !/^AUDIO-/.test(c))).toBe(true);
  });
});
