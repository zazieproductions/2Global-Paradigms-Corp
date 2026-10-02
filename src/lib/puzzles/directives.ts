/**
 * FIELD DIRECTIVES — the milestone engine.
 *
 * Pure functions over `ProgressionState`; no React, no storage, no audio. The
 * reducer calls `syncCase()` after every action, so a directive closes the
 * moment its steps are observably done — opening a record, visiting a section,
 * collecting fragments, breaking a seal, running `scan`, engaging the
 * de-scrambler, playing an artifact, opening the safe, taking the dump.
 *
 * The ledger is VALIDATED in three places:
 *
 * 1. **On observation** — `observeEvent()` only records events that match a
 *    catalogued milestone (`MILESTONES`). Anything else is dropped on the
 *    floor rather than written into the case file.
 * 2. **On sync** — `syncCase()` backfills the ledger from durable state
 *    (discoveries, seals, fragments, the prologue), so a save written before
 *    this layer existed still gets its intel, and nothing is ever recorded
 *    twice (the ledger is keyed by milestone id).
 * 3. **On load** — `parseDirectivesState()` discards unknown ids, malformed
 *    rows and duplicates from a stored save.
 *
 * Directives pay FIELD INTEL and journal lines. They never grant clearance:
 * only the Seven Seals do that (see `investigation.ts`).
 */
import type {
  ChapterDef,
  DirectiveDef,
  DirectivesState,
  FieldIntel,
  JournalEntry,
  MilestoneDef,
  MilestoneEntry,
  MilestoneEvent,
  MilestoneRule,
  ProgressionState
} from '@/types';
import { PUZZLE_SETTINGS } from '@/config/puzzles';
import { NAV_ITEMS } from '@/config/navigation';
import { AUDIO_ARTIFACTS, DOCUMENTS } from '@/content';
import {
  CHAPTERS,
  DIRECTIVES,
  FIELD_INTEL,
  MILESTONES,
  getDirective,
  getIntel
} from '@/content/puzzles/directives';
import { PUZZLE_DOWNLOADS } from '@/content/puzzles/downloads';
import { FRAGMENTS, sealPuzzleId } from '@/content/puzzles/seals';
import { isSealSolved, isUnredacted } from './investigation';

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

export const createDirectivesState = (): DirectivesState => ({
  ledger: [],
  completed: {},
  intel: [],
  chapters: {}
});

// ---------------------------------------------------------------------------
// Observation — rule matching and ledger writes
// ---------------------------------------------------------------------------

/** The `target` a rule keys on, for the ledger row's index/audit column. */
export function targetOfRule(rule: MilestoneRule): string | undefined {
  switch (rule.kind) {
    case 'record-opened':
      return rule.recordId;
    case 'section-visited':
      return rule.tab;
    case 'seal-broken':
      return String(rule.sealId);
    case 'audio-played':
      return rule.audioId;
    case 'download-taken':
      return rule.downloadId;
    default:
      return undefined;
  }
}

/** Does this event satisfy this rule? Count rules are derived, never dispatched. */
export function matchesRule(rule: MilestoneRule, event: MilestoneEvent): boolean {
  if (rule.kind === 'fragments-collected') return false;
  if (rule.kind !== event.kind) return false;
  switch (rule.kind) {
    case 'record-opened':
      return event.target === rule.recordId;
    case 'section-visited':
      return event.target === rule.tab;
    case 'seal-broken':
      return event.target === String(rule.sealId);
    case 'audio-played':
      return !rule.audioId || event.target === rule.audioId;
    case 'download-taken':
      return !rule.downloadId || event.target === rule.downloadId;
    default:
      return true;
  }
}

/**
 * Every catalogued milestone an event would satisfy. Exported so the surfaces
 * that dispatch observations (and their tests) can be explicit about it.
 */
export const milestonesForEvent = (event: MilestoneEvent): MilestoneDef[] =>
  MILESTONES.filter((m) => matchesRule(m.rule, event));

const rowFor = (milestone: MilestoneDef, at: string): MilestoneEntry => ({
  id: milestone.id,
  kind: milestone.rule.kind === 'fragments-collected' ? 'fragment-collected' : milestone.rule.kind,
  target: targetOfRule(milestone.rule),
  at
});

/**
 * Record an observation. Returns the same state when the event matches no
 * catalogue entry, or when every matching milestone is already in the ledger —
 * so a stray dispatch from a component can never corrupt the case file.
 */
export function observeEvent(state: ProgressionState, event: MilestoneEvent, at?: string): ProgressionState {
  const matched = milestonesForEvent(event);
  if (!matched.length) return state;
  const recorded = new Set(state.directives.ledger.map((e) => e.id));
  const fresh = matched.filter((m) => !recorded.has(m.id));
  if (!fresh.length) return state;
  const stamp = at ?? new Date().toISOString();
  return {
    ...state,
    directives: {
      ...state.directives,
      ledger: [...state.directives.ledger, ...fresh.map((m) => rowFor(m, stamp))]
    }
  };
}

// ---------------------------------------------------------------------------
// Derivation — what the state itself proves
// ---------------------------------------------------------------------------

/**
 * Is this milestone provable from durable state alone? Returns the timestamp
 * where the record has one (so a backfilled ledger row carries the real time),
 * `{}` when it happened at an unknown moment, or null when it has not.
 */
function deriveMilestone(rule: MilestoneRule, state: ProgressionState): { at?: string } | null {
  switch (rule.kind) {
    case 'prologue-read':
      return state.investigation.prologueSeen ? { at: prologueAt(state) } : null;
    case 'record-opened': {
      const at = state.discovered[rule.recordId];
      return at ? { at } : null;
    }
    case 'fragments-collected':
      return state.investigation.fragments.length >= rule.atLeast ? { at: lastFragmentAt(state) } : null;
    case 'seal-broken': {
      const completion = state.completed[sealPuzzleId(rule.sealId)];
      return isSealSolved(state, rule.sealId) && completion ? { at: completion.at } : null;
    }
    case 'finale-complete':
      return state.investigation.finaleComplete ? { at: state.completed[sealPuzzleId(7)]?.at } : null;
    case 'descrambler-engaged':
      // Switching it on by hand, or a seal reward leaving it on: either way the
      // black bars are off the record, which is what the step is about.
      return isUnredacted(state) ? { at: undefined } : null;
    case 'safe-opened':
      // Seal VI *is* the safe: its combination is the only input that turns
      // it, so a broken Seal VI proves the door came open.
      return isSealSolved(state, 6) ? { at: state.completed[sealPuzzleId(6)]?.at } : null;
    default:
      return null;
  }
}

const prologueAt = (state: ProgressionState): string | undefined =>
  state.investigation.journal.find((j) => j.text.includes('Dead-drop received'))?.t;

const lastFragmentAt = (state: ProgressionState): string | undefined =>
  [...state.investigation.journal].reverse().find((j) => j.kind === 'fragment')?.t;

/** Milestone ids the state proves, whatever the ledger happens to hold. */
export function satisfiedMilestones(state: ProgressionState): Set<string> {
  const satisfied = new Set(state.directives.ledger.map((e) => e.id));
  for (const m of MILESTONES) {
    if (!satisfied.has(m.id) && deriveMilestone(m.rule, state)) satisfied.add(m.id);
  }
  return satisfied;
}

// ---------------------------------------------------------------------------
// The completion watcher (pure half)
// ---------------------------------------------------------------------------

function appendJournal(
  journal: JournalEntry[],
  text: string,
  kind: JournalEntry['kind'],
  at: string
): JournalEntry[] {
  return [...journal, { t: at, text, kind }].slice(-PUZZLE_SETTINGS.maxJournalEntries);
}

/**
 * The completion watcher. Backfills anything the state proves but the ledger
 * has not recorded, closes every directive whose steps are done, files its
 * FIELD INTEL, writes the journal lines and announces completed chapters.
 *
 * Idempotent: a second call on the returned state returns that same object.
 */
export function syncCase(state: ProgressionState, at?: string): ProgressionState {
  const stamp = at ?? new Date().toISOString();
  const recorded = new Set(state.directives.ledger.map((e) => e.id));

  // 1. Backfill the ledger from durable state (old saves, migrated cases).
  const backfill: MilestoneEntry[] = [];
  for (const m of MILESTONES) {
    if (recorded.has(m.id)) continue;
    const derived = deriveMilestone(m.rule, state);
    if (derived) backfill.push(rowFor(m, derived.at ?? stamp));
  }
  const ledger = backfill.length ? [...state.directives.ledger, ...backfill] : state.directives.ledger;
  const satisfied = new Set(ledger.map((e) => e.id));

  // 2. Close directives, file intel, close chapters.
  const completed = { ...state.directives.completed };
  const intel = [...state.directives.intel];
  const chapters = { ...state.directives.chapters };
  let journal = state.investigation.journal;
  let changed = backfill.length > 0;

  for (const chapter of CHAPTERS) {
    for (const directiveId of chapter.directiveIds) {
      const directive = getDirective(directiveId);
      if (!directive || completed[directive.id]) continue;
      if (!directive.milestones.every((id) => satisfied.has(id))) continue;
      completed[directive.id] = stamp;
      changed = true;
      journal = appendJournal(journal, directive.journal, 'directive', stamp);
      const filing = getIntel(directive.intelId);
      if (filing && !intel.includes(filing.id)) intel.push(filing.id);
    }
    if (
      chapter.directiveIds.length > 0 &&
      chapter.directiveIds.every((id) => completed[id]) &&
      !chapters[chapter.id]
    ) {
      chapters[chapter.id] = stamp;
      changed = true;
      journal = appendJournal(
        journal,
        `Chapter ${chapter.numeral} complete — ${chapter.title}.`,
        'intel',
        stamp
      );
    }
  }

  if (!changed) return state;
  return {
    ...state,
    directives: { ledger, completed, intel, chapters },
    investigation: { ...state.investigation, journal }
  };
}

// ---------------------------------------------------------------------------
// Selectors for the UI
// ---------------------------------------------------------------------------

export interface MilestoneStatus {
  def: MilestoneDef;
  done: boolean;
  at?: string;
}

export interface DirectiveStatus {
  def: DirectiveDef;
  complete: boolean;
  at?: string;
  milestones: MilestoneStatus[];
  intel: FieldIntel | undefined;
}

export interface ChapterStatus {
  def: ChapterDef;
  complete: boolean;
  at?: string;
  directives: DirectiveStatus[];
  done: number;
  total: number;
}

export interface DirectiveBoard {
  chapters: ChapterStatus[];
  /** First directive still open, or null when the case is closed. */
  current: DirectiveStatus | null;
  currentChapter: ChapterStatus | null;
  /** FIELD INTEL recovered, in filing order. */
  intel: FieldIntel[];
  lastIntel: FieldIntel | null;
  /** Ledger rows, newest first. */
  ledger: MilestoneEntry[];
  completedDirectives: number;
  totalDirectives: number;
  /** Steps done / steps total across the whole run. */
  stepsDone: number;
  stepsTotal: number;
}

export function directiveBoard(state: ProgressionState): DirectiveBoard {
  const ledger = state.directives.ledger;
  const recordedAt = new Map(ledger.map((e) => [e.id, e.at]));
  const satisfied = satisfiedMilestones(state);

  const statusOf = (directive: DirectiveDef): DirectiveStatus => ({
    def: directive,
    complete: !!state.directives.completed[directive.id],
    at: state.directives.completed[directive.id],
    milestones: directive.milestones.map((id) => {
      const def = MILESTONES.find((m) => m.id === id);
      return {
        def: def ?? { id, rule: { kind: 'prologue-read' }, label: id },
        done: satisfied.has(id),
        at: recordedAt.get(id)
      };
    }),
    intel: getIntel(directive.intelId)
  });

  const chapters: ChapterStatus[] = CHAPTERS.map((def) => {
    const directives = def.directiveIds
      .map((id) => getDirective(id))
      .filter((d): d is DirectiveDef => !!d)
      .map(statusOf);
    const done = directives.filter((d) => d.complete).length;
    return {
      def,
      complete: !!state.directives.chapters[def.id],
      at: state.directives.chapters[def.id],
      directives,
      done,
      total: directives.length
    };
  });

  const flat = chapters.flatMap((c) => c.directives);
  const current = flat.find((d) => !d.complete) ?? null;
  const intel = state.directives.intel.map((id) => getIntel(id)).filter((f): f is FieldIntel => !!f);

  return {
    chapters,
    current,
    currentChapter: current ? (chapters.find((c) => c.def.id === current.def.chapterId) ?? null) : null,
    intel,
    lastIntel: intel.length ? intel[intel.length - 1] : null,
    ledger: [...ledger].reverse(),
    completedDirectives: flat.filter((d) => d.complete).length,
    totalDirectives: flat.length,
    stepsDone: flat.reduce((n, d) => n + d.milestones.filter((m) => m.done).length, 0),
    stepsTotal: flat.reduce((n, d) => n + d.milestones.length, 0)
  };
}

// ---------------------------------------------------------------------------
// The pulse — what changed, for the revelation toasts
// ---------------------------------------------------------------------------

export interface DirectivePulse {
  directives: DirectiveDef[];
  intel: FieldIntel[];
  chapters: ChapterDef[];
}

/**
 * Diff two case files into the events a watcher should announce. Used by
 * `useDirectiveWatcher()` to raise revelation toasts without any component
 * knowing which directive just closed.
 */
export function directivePulse(prev: ProgressionState, next: ProgressionState): DirectivePulse {
  const before = prev.directives;
  const after = next.directives;
  return {
    directives: DIRECTIVES.filter((d) => !before.completed[d.id] && !!after.completed[d.id]),
    intel: FIELD_INTEL.filter((f) => !before.intel.includes(f.id) && after.intel.includes(f.id)),
    chapters: CHAPTERS.filter((c) => !before.chapters[c.id] && !!after.chapters[c.id])
  };
}

// ---------------------------------------------------------------------------
// Persistence — validated parse of untrusted data
// ---------------------------------------------------------------------------

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);

const KNOWN_MILESTONES = new Set(MILESTONES.map((m) => m.id));
const KNOWN_DIRECTIVES = new Set(DIRECTIVES.map((d) => d.id));
const KNOWN_INTEL = new Set(FIELD_INTEL.map((f) => f.id));
const KNOWN_CHAPTERS = new Set(CHAPTERS.map((c) => c.id));

function parseLedger(value: unknown): MilestoneEntry[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const rows: MilestoneEntry[] = [];
  for (const raw of value) {
    if (!isRecord(raw)) continue;
    const id = typeof raw.id === 'string' ? raw.id : '';
    const at = typeof raw.at === 'string' && raw.at ? raw.at : '';
    // Only catalogued milestones, once each, with a timestamp.
    if (!KNOWN_MILESTONES.has(id) || seen.has(id) || !at) continue;
    seen.add(id);
    const milestone = MILESTONES.find((m) => m.id === id)!;
    rows.push({
      id,
      kind: milestone.rule.kind === 'fragments-collected' ? 'fragment-collected' : milestone.rule.kind,
      target: targetOfRule(milestone.rule),
      at
    });
  }
  return rows;
}

function parseStamps(value: unknown, known: Set<string>): Record<string, string> {
  if (!isRecord(value)) return {};
  const out: Record<string, string> = {};
  for (const [id, at] of Object.entries(value)) {
    if (known.has(id) && typeof at === 'string' && at) out[id] = at;
  }
  return out;
}

/** Turn untrusted stored JSON into a valid Field Directives case file. */
export function parseDirectivesState(value: unknown): DirectivesState {
  if (!isRecord(value)) return createDirectivesState();
  const intel = Array.isArray(value.intel)
    ? [...new Set(value.intel.filter((id): id is string => typeof id === 'string' && KNOWN_INTEL.has(id)))]
    : [];
  return {
    ledger: parseLedger(value.ledger),
    completed: parseStamps(value.completed, KNOWN_DIRECTIVES),
    intel,
    chapters: parseStamps(value.chapters, KNOWN_CHAPTERS)
  };
}

// ---------------------------------------------------------------------------
// Content integrity
// ---------------------------------------------------------------------------

export interface DirectiveIssue {
  level: 'error' | 'warning';
  where: string;
  message: string;
}

/**
 * Cross-reference check for the directive catalogue. Run by
 * `validateContent()` (and therefore CI) and by the test suite.
 */
export function validateDirectiveCatalogue(): DirectiveIssue[] {
  const issues: DirectiveIssue[] = [];
  const err = (where: string, message: string) => issues.push({ level: 'error', where, message });
  const warn = (where: string, message: string) => issues.push({ level: 'warning', where, message });

  const dupes = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);
  for (const id of dupes(MILESTONES.map((m) => m.id))) err(`milestone:${id}`, 'duplicate id');
  for (const id of dupes(DIRECTIVES.map((d) => d.id))) err(`directive:${id}`, 'duplicate id');
  for (const id of dupes(FIELD_INTEL.map((f) => f.id))) err(`intel:${id}`, 'duplicate id');
  for (const id of dupes(CHAPTERS.map((c) => c.id))) err(`chapter:${id}`, 'duplicate id');

  const navTabs = new Set(NAV_ITEMS.map((i) => i.id));
  const audioIds = new Set(AUDIO_ARTIFACTS.map((a) => a.id));
  const downloadIds = new Set(Object.keys(PUZZLE_DOWNLOADS));
  const fragmentIds = new Set(FRAGMENTS.map((f) => f.id));

  for (const m of MILESTONES) {
    const where = `milestone:${m.id}`;
    if (!m.label.trim()) err(where, 'missing label');
    const rule = m.rule;
    switch (rule.kind) {
      case 'record-opened':
        if (!DOCUMENTS.some((d) => d.id === rule.recordId)) err(where, `unknown record "${rule.recordId}"`);
        break;
      case 'section-visited':
        if (!navTabs.has(rule.tab)) err(where, `unknown section "${rule.tab}"`);
        break;
      case 'fragments-collected':
        if (rule.atLeast < 1 || rule.atLeast > FRAGMENTS.length)
          err(where, `atLeast ${rule.atLeast} outside 1..${FRAGMENTS.length}`);
        break;
      case 'seal-broken':
        if (rule.sealId < 1 || rule.sealId > 7) err(where, `seal ${rule.sealId} does not exist`);
        break;
      case 'audio-played':
        if (rule.audioId && !audioIds.has(rule.audioId)) err(where, `unknown audio "${rule.audioId}"`);
        break;
      case 'download-taken':
        if (rule.downloadId && !downloadIds.has(rule.downloadId))
          err(where, `unknown download "${rule.downloadId}"`);
        break;
      default:
        break;
    }
    if (rule.kind === 'fragments-collected' && !fragmentIds.size) warn(where, 'no fragments authored');
  }

  const usedMilestones = new Set<string>();
  const usedIntel = new Set<string>();
  const listedIn = new Map<string, string[]>();

  for (const c of CHAPTERS) {
    const where = `chapter:${c.id}`;
    if (!c.closing.trim()) err(where, 'missing closing announcement');
    if (!c.directiveIds.length) err(where, 'empty chapter');
    for (const id of c.directiveIds) {
      if (!DIRECTIVES.some((d) => d.id === id)) err(where, `unknown directive "${id}"`);
      listedIn.set(id, [...(listedIn.get(id) ?? []), c.id]);
    }
    for (const id of dupes(c.directiveIds)) err(where, `directive "${id}" listed twice`);
  }

  for (const d of DIRECTIVES) {
    const where = `directive:${d.id}`;
    if (!d.brief.trim()) err(where, 'missing brief');
    if (!d.journal.trim()) err(where, 'missing journal line');
    if (!d.milestones.length) err(where, 'no milestones');
    for (const id of d.milestones) {
      usedMilestones.add(id);
      if (!MILESTONES.some((m) => m.id === id)) err(where, `unknown milestone "${id}"`);
    }
    if (dupes(d.milestones).length) err(where, 'duplicate milestone in the same directive');
    if (!FIELD_INTEL.some((f) => f.id === d.intelId)) err(where, `unknown intel "${d.intelId}"`);
    if (usedIntel.has(d.intelId)) err(where, `intel "${d.intelId}" already pays another directive`);
    usedIntel.add(d.intelId);
    if (!CHAPTERS.some((c) => c.id === d.chapterId)) err(where, `unknown chapter "${d.chapterId}"`);
    const chapters = listedIn.get(d.id) ?? [];
    if (chapters.length !== 1) err(where, `listed in ${chapters.length} chapters`);
    else if (chapters[0] !== d.chapterId)
      err(where, `chapterId "${d.chapterId}" disagrees with chapter list "${chapters[0]}"`);
  }

  for (const f of FIELD_INTEL) {
    const where = `intel:${f.id}`;
    if (!f.code.trim() || !f.title.trim()) err(where, 'missing code or title');
    if (!f.paragraphs.length) err(where, 'no paragraphs');
    if (f.paragraphs.some((p) => !p.trim())) err(where, 'empty paragraph');
  }

  for (const m of MILESTONES) {
    if (!usedMilestones.has(m.id)) warn(`milestone:${m.id}`, 'not required by any directive');
  }
  for (const f of FIELD_INTEL) {
    if (!usedIntel.has(f.id)) warn(`intel:${f.id}`, 'not paid by any directive');
  }

  return issues;
}
