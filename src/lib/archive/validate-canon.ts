/**
 * Canon validation — continuity checking for the fiction itself.
 *
 * `validate-content.ts` proves the archive is *structurally* sound (ids unique,
 * references resolve, digests well-formed). This module proves it is
 * *narratively* sound: the chronology is internally consistent, the spine events
 * agree with the records that evidence them, people and places are named the
 * same way everywhere, and the seal machinery still spells what it is supposed
 * to spell.
 *
 * Same shape as `validateContent()`: errors fail CI, warnings are editorial.
 * Run by `npm run validate:canon` and by `src/tests/canon.test.ts`.
 */
import {
  AUDIO_ARTIFACTS,
  DEPARTMENTS,
  DOCUMENTS,
  INTERNAL_PROGRAMS,
  PERSONNEL,
  PUZZLES,
  REGIONAL_STATIONS,
  TERMINAL_HELP,
  TIMELINE_ENTRIES
} from '@/content';
import {
  CHOIR_INSCRIPTION,
  DEGREES,
  EARNED_BY,
  FRAGMENTS,
  SEALS,
  SEAL_FOR_RANK
} from '@/content/puzzles/seals';
import { CHOIR_ALPHABET } from '@/lib/puzzles/choir-script';
import { DIRECTIVE_17, GHOSTS } from '@/content/restoration/purge-manifest';
import { TERMINAL_LEAK_DUMP, TERMINAL_SCAN, TERMINAL_STATUS } from '@/content/puzzles/terminal-text';
import { CLEARANCE_TIERS } from '@/config/clearance';
import { NAV_ITEMS } from '@/config/navigation';
import type { ContentIssue } from './validate-content';
import { getArchiveEntries } from './records';
import {
  CANON_CHRONOLOGY,
  CANON_COUNTS,
  CANON_DEGREES,
  CANON_ERAS,
  CANON_ORDER,
  CANON_SPINE,
  CANON_TAPE_EXCEPTIONS,
  CANON_TERMS,
  NARRATION_WINDOW_DAYS
} from './canon';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
/** Codes that belong to a media/artifact collection rather than the document vault. */
const ARTEFACT_CODE = /^(ART|AUDIO)-/i;
/** Institutional prefixes the archive drops in short-form department names. */
const DEPT_PREFIX = /^(Department|Division|Directorate|Office|Unit) of\s+/;

/** Signed whole days from `a` to `b`, both `YYYY-MM-DD`. */
function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

/**
 * Accepted spellings of a department name. The vault's templated records use the
 * short form ("Civic Continuity & Demographic Resilience"); charters, personnel
 * files and the sidebar use the full one. Both are canonical; anything else is
 * drift.
 */
const departmentAliases = (name: string): Set<string> => new Set([name, name.replace(DEPT_PREFIX, '')]);

export function validateCanon(): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const err = (where: string, message: string) => issues.push({ level: 'error', where, message });
  const warn = (where: string, message: string) => issues.push({ level: 'warning', where, message });

  const entries = getArchiveEntries();
  const byId = new Map(entries.map((e) => [e.id, e]));

  // -------------------------------------------------------------------------
  // 1. Chronology
  // -------------------------------------------------------------------------
  const seenTimeline = new Set<string>();
  let previous: { id: string; date: string } | null = null;
  for (const t of TIMELINE_ENTRIES) {
    const w = `timeline:${t.id}`;
    if (seenTimeline.has(t.id)) err(w, 'duplicate timeline id');
    seenTimeline.add(t.id);

    if (!ISO_DATE.test(t.dateString)) err(w, `dateString "${t.dateString}" is not YYYY-MM-DD`);
    const yearOfDate = Number(t.dateString.slice(0, 4));
    if (Number.isFinite(yearOfDate) && yearOfDate !== t.year) {
      err(w, `year ${t.year} disagrees with dateString ${t.dateString}`);
    }
    if (t.year < CANON_CHRONOLOGY.firstYear || t.year > CANON_CHRONOLOGY.lastYear) {
      err(
        w,
        `year ${t.year} is outside the canon span ${CANON_CHRONOLOGY.firstYear}–${CANON_CHRONOLOGY.lastYear}`
      );
    }
    const era = CANON_ERAS.find((e) => e.label === t.era);
    if (!era) err(w, `unknown era "${t.era}"`);
    else if (t.year < era.from || t.year > era.to) {
      err(w, `year ${t.year} falls outside its declared era "${t.era}" (${era.from}–${era.to})`);
    }
    if (previous && t.dateString < previous.date) {
      err(w, `out of order: ${t.dateString} precedes ${previous.id} (${previous.date})`);
    }
    previous = { id: t.id, date: t.dateString };
  }

  // No record anywhere may sit outside the canon span.
  for (const e of entries) {
    if (e.year !== null && (e.year < CANON_CHRONOLOGY.firstYear || e.year > CANON_CHRONOLOGY.lastYear)) {
      err(
        `${e.kind}:${e.id}`,
        `year ${e.year} is outside ${CANON_CHRONOLOGY.firstYear}–${CANON_CHRONOLOGY.lastYear}`
      );
    }
    if (e.date !== null && !ISO_DATE.test(e.date)) {
      err(`${e.kind}:${e.id}`, `normalised date "${e.date}" is not YYYY-MM-DD`);
    }
  }

  // -------------------------------------------------------------------------
  // 2. Spine events
  // -------------------------------------------------------------------------
  for (const event of CANON_SPINE) {
    const w = `canon:${event.id}`;
    const { timeline = [], records = [], narrates = [], mentions = [] } = event.evidence;
    if (timeline.length + records.length + narrates.length + mentions.length === 0) {
      err(w, 'spine event declares no evidence');
    }
    for (const id of timeline) {
      const t = TIMELINE_ENTRIES.find((x) => x.id === id);
      if (!t) err(w, `evidence timeline ${id} does not exist`);
      else if (t.dateString !== event.date) {
        err(w, `evidence timeline ${id} is dated ${t.dateString}, expected ${event.date}`);
      }
    }
    for (const id of records) {
      const e = byId.get(id);
      if (!e) err(w, `evidence record ${id} does not exist`);
      else if (e.date !== event.date) {
        err(w, `evidence record ${id} is dated ${e.date ?? 'null'}, expected ${event.date}`);
      }
    }
    for (const id of narrates) {
      const e = byId.get(id);
      if (!e) err(w, `narrating record ${id} does not exist`);
      else if (e.date === null) warn(w, `narrating record ${id} is undated`);
      else {
        const drift = daysBetween(event.date, e.date);
        if (Math.abs(drift) > NARRATION_WINDOW_DAYS) {
          err(
            w,
            `narrating record ${id} is dated ${e.date}, ${drift} days from the event (window ±${NARRATION_WINDOW_DAYS})`
          );
        }
      }
    }
    for (const id of mentions) {
      if (!byId.has(id)) err(w, `evidence record ${id} does not exist`);
    }
    if (event.payoff && !PUZZLES.some((p) => p.id === event.payoff)) {
      warn(w, `payoff "${event.payoff}" is not a known puzzle id`);
    }
  }

  // -------------------------------------------------------------------------
  // 3. Entity coherence — a record must be named the same way everywhere
  // -------------------------------------------------------------------------
  const deptById = new Map(DEPARTMENTS.map((d) => [d.id, d]));
  const personById = new Map(PERSONNEL.map((p) => [p.id, p]));
  const stationById = new Map(REGIONAL_STATIONS.map((s) => [s.id, s]));

  for (const p of PERSONNEL) {
    const w = `personnel:${p.id}`;
    const dept = deptById.get(p.departmentId);
    if (dept && !departmentAliases(dept.name).has(p.departmentName)) {
      err(w, `departmentName "${p.departmentName}" ≠ ${p.departmentId} ("${dept.name}")`);
    }
    const station = stationById.get(p.stationId);
    // Personnel files append a locality ("…, London", "…, Spitsbergen") to the
    // facility name; that is house style. What must not change is the name itself.
    if (station && !p.stationName.startsWith(station.name)) {
      err(w, `stationName "${p.stationName}" does not name ${p.stationId} ("${station.name}")`);
    }
    if (!ISO_DATE.test(p.hireDate)) err(w, `hireDate "${p.hireDate}" is not YYYY-MM-DD`);
    for (const code of p.linkedDocuments) {
      if (ARTEFACT_CODE.test(code)) {
        err(
          w,
          `linkedDocuments cites "${code}": audio artifacts are not documents — use links: [{ to: { kind: 'audio', … } }]`
        );
      }
    }
  }

  for (const s of REGIONAL_STATIONS) {
    const w = `office:${s.id}`;
    const lead = s.leadPersonnelId ? personById.get(s.leadPersonnelId) : undefined;
    if (lead && !s.leadPersonnelName.includes(lead.name.replace(/^Dr\.\s*/, ''))) {
      err(
        w,
        `leadPersonnelName "${s.leadPersonnelName}" does not name ${s.leadPersonnelId} ("${lead.name}")`
      );
    }
    if (!ISO_DATE.test(s.establishedDate)) err(w, `establishedDate "${s.establishedDate}" is not YYYY-MM-DD`);
  }

  for (const d of DOCUMENTS) {
    const dept = deptById.get(d.departmentId);
    if (dept && !departmentAliases(dept.name).has(d.departmentName)) {
      err(`document:${d.id}`, `departmentName "${d.departmentName}" ≠ ${d.departmentId} ("${dept.name}")`);
    }
  }

  // -------------------------------------------------------------------------
  // 4. Code hygiene
  // -------------------------------------------------------------------------
  const uniqueCodes = (label: string, codes: string[], pattern: RegExp) => {
    const seen = new Set<string>();
    for (const c of codes) {
      if (!pattern.test(c)) err(label, `code "${c}" does not match ${pattern}`);
      if (seen.has(c)) err(label, `duplicate code ${c}`);
      seen.add(c);
    }
  };
  uniqueCodes(
    'canon:department-codes',
    DEPARTMENTS.map((d) => d.code),
    /^[A-Z]{3,5}$/
  );
  uniqueCodes(
    'canon:station-codes',
    REGIONAL_STATIONS.map((s) => s.code),
    /^[A-Z]{2,4}-\d{2}-[A-Z]{2,4}$/
  );
  uniqueCodes(
    'canon:program-codes',
    INTERNAL_PROGRAMS.map((p) => p.code),
    /^PROG-[A-Z0-9-]+$/
  );
  uniqueCodes(
    'canon:audio-codes',
    AUDIO_ARTIFACTS.map((a) => a.code),
    /^ART-\d{2}-[A-Z0-9-]+$/
  );

  // Department codes used by timeline entries must exist.
  const deptCodes = new Set(DEPARTMENTS.map((d) => d.code));
  for (const t of TIMELINE_ENTRIES) {
    if (!deptCodes.has(t.departmentCode)) {
      err(`timeline:${t.id}`, `unknown departmentCode "${t.departmentCode}"`);
    }
  }

  // -------------------------------------------------------------------------
  // 5. Every code the terminal prints resolves to a real record
  // -------------------------------------------------------------------------
  const codeIndex = new Map<string, string>();
  for (const d of DOCUMENTS) codeIndex.set(d.code.toUpperCase(), d.id);
  for (const a of AUDIO_ARTIFACTS) codeIndex.set(a.code.toUpperCase(), a.id);
  const terminalCodes = [
    ...TERMINAL_LEAK_DUMP.map((l) => l.code).filter((c): c is string => !!c),
    ...TERMINAL_STATUS(REGIONAL_STATIONS.length)
      .map((l) => (/[A-Z]{2,5}-\d{4}-[A-Z0-9-]+/.exec(l.text) ?? [])[0])
      .filter((c): c is string => !!c),
    ...TERMINAL_SCAN.map((l) => (/[A-Z]{2,5}-\d{4}-[A-Z0-9-]+/.exec(l.text) ?? [])[0]).filter(
      (c): c is string => !!c
    )
  ];
  for (const code of terminalCodes) {
    if (!codeIndex.has(code.toUpperCase())) {
      err('canon:terminal', `terminal prints code "${code}" which resolves to nothing`);
    }
  }

  // -------------------------------------------------------------------------
  // 6. Terminology
  // -------------------------------------------------------------------------
  const corpus: Array<[string, string]> = [];
  for (const e of entries) {
    corpus.push([
      `${e.kind}:${e.id}`,
      [e.title, e.summary, e.body, e.code, e.author ?? '', e.tags.join(' ')].join('\n')
    ]);
  }
  for (const d of DOCUMENTS) {
    corpus.push([`document:${d.id}:content`, `${d.content}\n${d.redactedContent ?? ''}`]);
  }
  for (const rule of CANON_TERMS) {
    for (const pattern of rule.banned) {
      const global = new RegExp(
        pattern.source,
        pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`
      );
      for (const [where, text] of corpus) {
        const hit = global.exec(text);
        if (hit) {
          err(where, `banned spelling "${hit[0]}" (canonical: ${rule.canonical}) — ${rule.note}`);
          break;
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // 7. The seal machinery
  // -------------------------------------------------------------------------
  if (SEALS.length !== CANON_COUNTS.seals) {
    err('canon:seals', `expected ${CANON_COUNTS.seals} seals, found ${SEALS.length}`);
  }
  const expectedPlanets = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
  SEALS.forEach((s, i) => {
    if (s.planet !== expectedPlanets[i]) {
      err(`seal:${s.id}`, `planet "${s.planet}" is out of order (expected ${expectedPlanets[i]})`);
    }
  });
  const words = SEALS.map((s) => s.sealWord);
  if (new Set(words).size !== words.length) err('canon:seals', 'Seal-Words are not distinct');

  // The initials of Seal-Words I–VI must be the first six letters of the name
  // Seal VII reveals; the player supplies the seventh.
  const initials = SEALS.slice(0, 6)
    .map((s) => s.sealWord[0])
    .join('');
  const revealed = SEALS[6].hints[2].replace(/[^A-Z]/g, '');
  if (revealed.length !== initials.length + 1 || revealed.slice(0, initials.length) !== initials) {
    err(
      'canon:seals',
      `Seal-Words I–VI initial to "${initials}" but Seal VII reveals "${revealed}" (expected ${initials} + one letter)`
    );
  }

  // Clearance rewards must ascend across the seals that grant them.
  let lastReward = 1;
  for (const s of SEALS) {
    if (s.rewardLevel === undefined) continue;
    if (s.rewardLevel <= lastReward) {
      err(
        `seal:${s.id}`,
        `clearance reward ${s.rewardLevel} does not exceed the previous reward ${lastReward}`
      );
    }
    lastReward = s.rewardLevel;
  }

  // EARNED_BY / SEAL_FOR_RANK / DEGREES must agree with SEALS and the canon.
  for (const rank of [2, 3, 4, 5] as const) {
    const earner = SEALS.find((s) => s.rewardLevel === rank);
    if (!earner) {
      err('canon:seals', `no seal grants clearance rank ${rank}`);
      continue;
    }
    const expected = `Seal ${earner.numeral} — ${earner.title}`;
    if (SEAL_FOR_RANK[rank] !== expected) {
      err('canon:seals', `SEAL_FOR_RANK[${rank}] "${SEAL_FOR_RANK[rank]}" ≠ "${expected}"`);
    }
    if (EARNED_BY[rank] !== `Earned by breaking ${expected}`) {
      err('canon:seals', `EARNED_BY[${rank}] does not name "${expected}"`);
    }
  }
  if (EARNED_BY[1] !== 'Granted on connection') {
    err('canon:seals', 'rank 1 must be "Granted on connection"');
  }
  if (DEGREES.length !== CANON_DEGREES.length || DEGREES.some((d, i) => d !== CANON_DEGREES[i])) {
    err('canon:seals', 'DEGREES in seals.ts has drifted from CANON_DEGREES');
  }
  if (CLEARANCE_TIERS.length !== CANON_COUNTS.clearanceRanks) {
    err('canon:clearance', `expected ${CANON_COUNTS.clearanceRanks} tiers, found ${CLEARANCE_TIERS.length}`);
  }

  // -------------------------------------------------------------------------
  // 8. Choir Script
  // -------------------------------------------------------------------------
  if (FRAGMENTS.length !== CANON_COUNTS.choirFragments) {
    err('canon:choir', `expected ${CANON_COUNTS.choirFragments} fragments, found ${FRAGMENTS.length}`);
  }
  if (Object.keys(CHOIR_ALPHABET).length !== CANON_COUNTS.choirLetters) {
    err(
      'canon:choir',
      `expected ${CANON_COUNTS.choirLetters} glyphs, found ${Object.keys(CHOIR_ALPHABET).length}`
    );
  }
  const taught = new Set(FRAGMENTS.flatMap((f) => f.letters));
  const needed = new Set(CHOIR_INSCRIPTION.replace(/[^A-Z]/g, '').split(''));
  for (const letter of needed) {
    if (!taught.has(letter))
      err('canon:choir', `no fragment teaches "${letter}", which the inscription needs`);
  }
  const tabs = FRAGMENTS.map((f) => f.tab);
  if (new Set(tabs).size !== tabs.length) err('canon:choir', 'two fragments hide on the same tab');
  const paths = new Set(NAV_ITEMS.map((i) => i.path));
  for (const f of FRAGMENTS) {
    if (!paths.has(`/${f.tab}`)) err(`fragment:${f.id}`, `tab "${f.tab}" has no route`);
  }

  // -------------------------------------------------------------------------
  // 9. Gateway
  // -------------------------------------------------------------------------
  const gateway = PUZZLES.filter((p) => p.id.startsWith('gateway-'));
  if (gateway.length !== CANON_COUNTS.gatewaySteps) {
    err('canon:gateway', `expected ${CANON_COUNTS.gatewaySteps} gateway steps, found ${gateway.length}`);
  }
  for (const p of gateway) {
    if (p.rewards.some((r) => r.type === 'clearance')) {
      err(`puzzle:${p.id}`, 'gateway steps must never grant clearance — only the seals do');
    }
  }

  // -------------------------------------------------------------------------
  // 9b. Directive 17 — the purge/salvage layer
  //
  // The ghost codes in `purge-manifest.ts` are the same codes the personnel
  // dossiers cite and the content validator reports as "not recovered". That is
  // the hook, not an oversight — but it only works if the two sides stay in
  // step. These checks are what keep them in step.
  // -------------------------------------------------------------------------
  const liveCodes = new Set(getArchiveEntries().map((e) => e.code));
  const personnelById = new Map(PERSONNEL.map((p) => [p.id, p]));
  const sealWords = SEALS.map((s) => s.sealWord);

  for (const ghost of GHOSTS) {
    const w = `purge:${ghost.id}`;

    // INV-TAPE-01 — struck, not deleted. If the code ever resolves in the live
    // index, the fiction ("deletion is insufficient; struck things are
    // forgotten") is contradicted and the spool becomes redundant.
    if (liveCodes.has(ghost.code))
      err(w, `code "${ghost.code}" resolves in the live index; a purged record must stay struck`);

    // INV-TAPE-02 — discoverable. Every dossier that cites the code must exist
    // and must actually cite it, or the mechanic cannot be found by playing.
    if (!ghost.citedBy.length) err(w, 'cited by nobody, so it cannot be discovered');
    for (const pid of ghost.citedBy) {
      const person = personnelById.get(pid);
      if (!person) {
        err(w, `cited by unknown personnel id "${pid}"`);
        continue;
      }
      if (!person.linkedDocuments?.includes(ghost.code))
        err(w, `${pid} is listed as citing "${ghost.code}" but does not`);
    }

    // INV-TAPE-03 — one correct splice. Orders must be exactly 1..n and the
    // locators must be unique and ascending, because `isSpliceCorrect` and the
    // in-world hint ("splice so the offsets count up") both assume it.
    const orders = ghost.shards.map((sh) => sh.order);
    const want = ghost.shards.map((_, i) => i + 1);
    if (JSON.stringify([...orders].sort((a, b) => a - b)) !== JSON.stringify(want))
      err(w, `shard orders are not exactly 1..${ghost.shards.length}: ${orders.join(',')}`);
    const locators = ghost.shards.map((sh) => sh.locator);
    if (new Set(locators).size !== locators.length) err(w, 'duplicate shard locators');
    if (!locators.every((l, i) => i === 0 || locators[i - 1] < l))
      err(w, 'shard locators do not ascend, so the stated splice rule is unsolvable');

    // INV-TAPE-04 — no answers in the salvage layer. The file header promises
    // this; the check makes the promise enforceable.
    const ghostText = [
      ghost.title,
      ghost.preamble,
      ghost.locatorNote,
      ...ghost.shards.map((sh) => sh.text)
    ].join('\n');
    for (const word of sealWords) {
      if (!word || !new RegExp(`\\b${word}\\b`).test(ghostText)) continue;
      const allowed = CANON_TAPE_EXCEPTIONS.some((x) => x.ghostId === ghost.id && x.sealWord === word);
      if (allowed) {
        warn(
          w,
          `ghost text contains the Seal-Word "${word}", allowed by CANON_TAPE_EXCEPTIONS — see docs/CONTINUITY.md §4`
        );
        continue;
      }
      err(w, `ghost text contains the Seal-Word "${word}"; the salvage layer carries no answers`);
    }
  }

  // Directive 17 itself is corpus text and carries the same promise.
  for (const word of sealWords) {
    if (word && DIRECTIVE_17.lines.some((l) => new RegExp(`\\b${word}\\b`).test(l)))
      err(`purge:${DIRECTIVE_17.code}`, `directive text contains the Seal-Word "${word}"`);
  }
  if (!GHOSTS.length) err('purge:manifest', 'no purged records declared');

  // -------------------------------------------------------------------------
  // 10. Structural counts
  // -------------------------------------------------------------------------
  const counts: Record<string, [number, number]> = {
    departments: [CANON_COUNTS.departments, DEPARTMENTS.length],
    programs: [CANON_COUNTS.programs, INTERNAL_PROGRAMS.length],
    stations: [CANON_COUNTS.stations, REGIONAL_STATIONS.length],
    personnel: [CANON_COUNTS.personnel, PERSONNEL.length],
    terminalCommands: [CANON_COUNTS.terminalCommands, TERMINAL_HELP.length]
  };
  for (const [name, [expected, actual]] of Object.entries(counts)) {
    if (expected !== actual)
      err(`canon:counts`, `${name}: canon declares ${expected}, collection has ${actual}`);
  }

  // The Order's own name must still be the one the canon declares.
  if (!corpus.some(([, text]) => text.includes(CANON_ORDER.latin))) {
    warn('canon:order', `the corpus never spells out "${CANON_ORDER.latin}"`);
  }

  return issues;
}

/** Errors only — the CI gate. */
export const canonErrors = (issues: ContentIssue[] = validateCanon()) =>
  issues.filter((i) => i.level === 'error');
