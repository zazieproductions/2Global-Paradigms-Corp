/**
 * Progression store — the single source of truth for player state:
 * discovered files, completed / assisted puzzles, revealed hints, unlocked
 * routes & downloads, chosen clearance, de-scrambler, preferences, callsign,
 * and THE SEVEN SEALS case file (fragments, prologue, finale, journal).
 *
 * Framework-agnostic (a tiny external store). React reads it through
 * `useProgression()` / `useInvestigation()` (src/hooks).
 *
 * Persistence: localStorage under `PUZZLE_SETTINGS.storageKey`. Storage is
 * best-effort — private mode, quota errors or disabled storage silently fall
 * back to in-memory state. Stored data is validated on load; anything
 * malformed is discarded rather than trusted. This is a low-stakes, client-side
 * game state: players can edit it freely, and that is fine.
 */
import type {
  ClearanceLevel,
  CompletionMethod,
  JournalEntry,
  JournalKind,
  Preferences,
  ProgressionState,
  PuzzleDefinition
} from '@/types';
import { CLEARANCE_TIERS, DEFAULT_CLEARANCE } from '@/config/clearance';
import { FEATURES } from '@/config/features';
import { PUZZLE_SETTINGS } from '@/config/puzzles';
import { SITE } from '@/config/site';
import { FRAGMENTS, SEALS, sealPuzzleId } from '@/content/puzzles/seals';
import { isKnownMilestone } from '@/content/puzzles/directives';
import { clearanceTier } from '@/lib/archive/clearance';
import { earnedLevel } from './investigation';
import { getPuzzle, isPuzzleAvailable } from './validate';

export const createInitialState = (): ProgressionState => ({
  version: 2,
  callsign: SITE.defaultCallsign,
  discovered: {},
  completed: {},
  hintsRevealed: {},
  unlockedRoutes: [],
  unlockedDownloads: [],
  access: { clearance: DEFAULT_CLEARANCE, chosenAt: 0, unredacted: false },
  preferences: { crt: false, sound: FEATURES.uiSoundsDefault },
  investigation: { fragments: [], prologueSeen: false, finaleComplete: false, journal: [] },
  milestones: {}
});

// ---------------------------------------------------------------------------
// Pure reducer
// ---------------------------------------------------------------------------

export type ProgressionAction =
  | { type: 'discover'; recordId: string; at?: string }
  | { type: 'reveal-hint'; puzzleId: string; tier: number }
  | { type: 'complete'; puzzleId: string; method: CompletionMethod; at?: string }
  | { type: 'set-clearance'; level: ClearanceLevel }
  | { type: 'set-unredacted'; value: boolean }
  | { type: 'set-preference'; key: keyof Preferences; value: boolean }
  | { type: 'set-callsign'; callsign: string }
  | { type: 'collect-fragment'; fragmentId: string; at?: string }
  | { type: 'mark-prologue-seen'; at?: string }
  | { type: 'complete-finale'; at?: string }
  | { type: 'journal'; text: string; kind?: JournalKind; at?: string }
  /** Record an environmental event for the directive system (unknown ids are ignored). */
  | { type: 'milestone'; id: string; at?: string }
  /** Close the seals again: puzzles, hints, fragments, clearance. Keeps discoveries & preferences. */
  | { type: 'purge-case'; at?: string }
  | { type: 'reset'; keepPreferences?: boolean };

const uniqPush = (list: string[], value: string) => (list.includes(value) ? list : [...list, value]);
const now = (at?: string) => at ?? new Date().toISOString();

function withJournal(
  state: ProgressionState,
  text: string,
  kind: JournalKind,
  at?: string
): ProgressionState {
  const entry: JournalEntry = { t: now(at), text, kind };
  const journal = [...state.investigation.journal, entry].slice(-PUZZLE_SETTINGS.maxJournalEntries);
  return { ...state, investigation: { ...state.investigation, journal } };
}

function applyRewards(state: ProgressionState, puzzle: PuzzleDefinition): ProgressionState {
  let next = state;
  for (const reward of puzzle.rewards) {
    switch (reward.type) {
      case 'clearance':
        // Clearance is derived from completions (earnedLevel); nothing to store.
        break;
      case 'unredact':
        next = { ...next, access: { ...next.access, unredacted: true } };
        break;
      case 'route':
        next = { ...next, unlockedRoutes: uniqPush(next.unlockedRoutes, reward.path) };
        break;
      case 'download':
        next = { ...next, unlockedDownloads: uniqPush(next.unlockedDownloads, reward.id) };
        break;
      case 'record':
        next = next.discovered[reward.recordId]
          ? next
          : { ...next, discovered: { ...next.discovered, [reward.recordId]: new Date().toISOString() } };
        break;
    }
  }
  return next;
}

function complete(
  state: ProgressionState,
  puzzleId: string,
  method: CompletionMethod,
  at?: string
): ProgressionState {
  const puzzle = getPuzzle(puzzleId);
  // Locked puzzles (e.g. a seal whose predecessor is unbroken) cannot be completed, even by bypass.
  if (!puzzle || !isPuzzleAvailable(puzzle, state)) return state;
  const revealedTier = state.hintsRevealed[puzzleId] ?? 0;
  const usedAnswerHint = puzzle.hints.some((h) => h.revealsAnswer && h.tier <= revealedTier);
  const assisted = method === 'bypass' || usedAnswerHint;
  const previous = state.completed[puzzleId];
  // Replays keep the first completion unless an unassisted solve upgrades it.
  const completion =
    previous && (!previous.assisted || assisted) ? previous : { at: now(at), method, assisted };
  if (completion === previous) return state;
  let next = applyRewards({ ...state, completed: { ...state.completed, [puzzleId]: completion } }, puzzle);
  if (!previous && puzzle.journal) next = withJournal(next, puzzle.journal, 'seal', at);
  return next;
}

export function progressionReducer(state: ProgressionState, action: ProgressionAction): ProgressionState {
  switch (action.type) {
    case 'discover':
      if (state.discovered[action.recordId]) return state;
      return { ...state, discovered: { ...state.discovered, [action.recordId]: now(action.at) } };

    case 'reveal-hint': {
      const current = state.hintsRevealed[action.puzzleId] ?? 0;
      if (action.tier <= current) return state;
      return { ...state, hintsRevealed: { ...state.hintsRevealed, [action.puzzleId]: action.tier } };
    }

    case 'complete':
      return complete(state, action.puzzleId, action.method, action.at);

    case 'set-clearance': {
      // Degrees are earned through the seals — nothing above that can be chosen.
      const earned = earnedLevel(state);
      if (clearanceTier(action.level) > earned || !CLEARANCE_TIERS.some((t) => t.level === action.level)) {
        return state;
      }
      return { ...state, access: { ...state.access, clearance: action.level, chosenAt: earned } };
    }

    case 'set-unredacted':
      return state.access.unredacted === action.value
        ? state
        : { ...state, access: { ...state.access, unredacted: action.value } };

    case 'set-preference':
      return { ...state, preferences: { ...state.preferences, [action.key]: action.value } };

    case 'set-callsign':
      return { ...state, callsign: action.callsign.trim().slice(0, 24) || SITE.defaultCallsign };

    case 'collect-fragment': {
      const frag = FRAGMENTS.find((f) => f.id === action.fragmentId);
      if (!frag || state.investigation.fragments.includes(frag.id)) return state;
      const next: ProgressionState = {
        ...state,
        investigation: { ...state.investigation, fragments: [...state.investigation.fragments, frag.id] }
      };
      return withJournal(
        next,
        `Choir Script fragment recovered in ${frag.location}: glyphs for ${frag.letters.join(', ')}.`,
        'fragment',
        action.at
      );
    }

    case 'mark-prologue-seen':
      if (state.investigation.prologueSeen) return state;
      return withJournal(
        { ...state, investigation: { ...state.investigation, prologueSeen: true } },
        'Dead-drop received from Dr. Ewan Thorne. Case opened: THE SEVEN SEALS.',
        'system',
        action.at
      );

    case 'complete-finale': {
      if (state.investigation.finaleComplete) return state;
      // The seventh seal is broken by the rite itself, not by typing its answer.
      const sealed = complete(state, sealPuzzleId(7), 'answer', action.at);
      if (!sealed.completed[sealPuzzleId(7)]) return state;
      return withJournal(
        { ...sealed, investigation: { ...sealed.investigation, finaleComplete: true } },
        'The Name was spoken. Counter-Rite performed. Carrier: 0.000 Hz. SILENTIUM.',
        'finale',
        action.at
      );
    }

    case 'journal':
      return withJournal(state, action.text.slice(0, 500), action.kind ?? 'system', action.at);

    case 'milestone': {
      // Only milestones the directives content knows by name are ever stored.
      if (!isKnownMilestone(action.id) || state.milestones[action.id]) return state;
      return { ...state, milestones: { ...state.milestones, [action.id]: now(action.at) } };
    }

    case 'purge-case': {
      const fresh = createInitialState();
      return withJournal(
        {
          ...fresh,
          callsign: state.callsign,
          discovered: state.discovered,
          preferences: state.preferences,
          // What the operator has seen cannot be unseen: environmental
          // milestones survive the purge; the seals themselves re-close.
          milestones: state.milestones,
          investigation: { ...fresh.investigation, prologueSeen: true }
        },
        'Investigation purged. The seals have closed again.',
        'system',
        action.at
      );
    }

    case 'reset': {
      const fresh = createInitialState();
      return action.keepPreferences ? { ...fresh, preferences: state.preferences } : fresh;
    }
  }
}

// ---------------------------------------------------------------------------
// Persistence (validated, best-effort)
// ---------------------------------------------------------------------------

const VALID_LEVELS = new Set<string>(CLEARANCE_TIERS.map((t) => t.level));
const JOURNAL_KINDS = new Set<string>(['seal', 'fragment', 'system', 'finale', 'directive']);

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

function parseJournal(v: unknown): JournalEntry[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter(
      (e): e is JournalEntry =>
        isRecord(e) &&
        typeof e.t === 'string' &&
        typeof e.text === 'string' &&
        JOURNAL_KINDS.has(String(e.kind))
    )
    .map((e) => ({ t: e.t, text: e.text.slice(0, 500), kind: e.kind }))
    .slice(-PUZZLE_SETTINGS.maxJournalEntries);
}

const knownFragment = (id: string) => FRAGMENTS.some((f) => f.id === id);

/**
 * Parse untrusted JSON (a v1 or v2 save) into a valid v2 state, or null.
 * Exported for tests.
 */
export function parseStoredState(raw: string | null): ProgressionState | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(data) || (data.version !== 1 && data.version !== 2)) return null;
  const base = createInitialState();
  const access = isRecord(data.access) ? data.access : {};
  const prefs = isRecord(data.preferences) ? data.preferences : {};
  const inv = isRecord(data.investigation) ? data.investigation : {};
  const completed: ProgressionState['completed'] = {};
  if (isRecord(data.completed)) {
    for (const [id, c] of Object.entries(data.completed)) {
      // Puzzles that no longer exist (e.g. the revoked v1 master keys) are dropped.
      if (!getPuzzle(id)) continue;
      if (isRecord(c) && typeof c.at === 'string' && (c.method === 'answer' || c.method === 'bypass')) {
        completed[id] = { at: c.at, method: c.method, assisted: c.assisted === true };
      }
    }
  }
  const stringMap = (v: unknown) =>
    isRecord(v)
      ? (Object.fromEntries(Object.entries(v).filter(([, x]) => typeof x === 'string')) as Record<
          string,
          string
        >)
      : {};
  const numberMap = (v: unknown) =>
    isRecord(v)
      ? (Object.fromEntries(
          Object.entries(v).filter(([id, x]) => typeof x === 'number' && !!getPuzzle(id))
        ) as Record<string, number>)
      : {};

  const clearance =
    typeof access.clearance === 'string' && VALID_LEVELS.has(access.clearance)
      ? (access.clearance as ClearanceLevel)
      : base.access.clearance;
  const chosenAt = typeof access.chosenAt === 'number' ? access.chosenAt : 0;

  const state: ProgressionState = {
    version: 2,
    callsign: typeof data.callsign === 'string' ? data.callsign.slice(0, 24) : base.callsign,
    discovered: stringMap(data.discovered),
    completed,
    hintsRevealed: numberMap(data.hintsRevealed),
    unlockedRoutes: isStringArray(data.unlockedRoutes) ? data.unlockedRoutes : [],
    unlockedDownloads: isStringArray(data.unlockedDownloads) ? data.unlockedDownloads : [],
    access: { clearance, chosenAt, unredacted: access.unredacted === true },
    preferences: {
      crt: typeof prefs.crt === 'boolean' ? prefs.crt : base.preferences.crt,
      sound: typeof prefs.sound === 'boolean' ? prefs.sound : base.preferences.sound
    },
    investigation: {
      fragments: isStringArray(inv.fragments) ? inv.fragments.filter(knownFragment) : [],
      prologueSeen: inv.prologueSeen === true,
      finaleComplete: inv.finaleComplete === true,
      journal: parseJournal(inv.journal)
    },
    milestones: Object.fromEntries(
      Object.entries(isRecord(data.milestones) ? data.milestones : {}).filter(
        (e): e is [string, string] => isKnownMilestone(e[0]) && typeof e[1] === 'string'
      )
    )
  };
  // A stored choice above what the completions justify is not honoured.
  if (clearanceTier(state.access.clearance) > earnedLevel(state)) {
    state.access = { ...state.access, clearance: base.access.clearance, chosenAt: 0 };
  }
  return state;
}

/**
 * Convert the pre-restructure Seven Seals save (`ovp.investigation.v1`,
 * written by the old `ArgContext`) into a v2 state. Exported for tests.
 */
export function migrateLegacyInvestigation(raw: string | null): ProgressionState | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(data)) return null;
  const state = createInitialState();
  const at = new Date().toISOString();
  const solved = Array.isArray(data.solved)
    ? data.solved.filter((n): n is number => typeof n === 'number' && SEALS.some((s) => s.id === n))
    : [];
  for (const id of solved) {
    state.completed[`seal-${id}`] = { at, method: 'answer', assisted: false };
  }
  if (isRecord(data.hintsRevealed)) {
    for (const [id, tier] of Object.entries(data.hintsRevealed)) {
      if (typeof tier !== 'number' || !SEALS.some((s) => String(s.id) === id)) continue;
      const puzzleId = `seal-${id}`;
      state.hintsRevealed[puzzleId] = Math.min(3, Math.max(0, Math.floor(tier)));
      // A completion reached after the answer hint counts as assisted, as it would today.
      if (state.completed[puzzleId] && tier >= 3) state.completed[puzzleId].assisted = true;
    }
  }
  if (solved.includes(6)) {
    state.unlockedDownloads = ['palimpsest-master-dump'];
  }
  state.investigation = {
    fragments: isStringArray(data.fragments) ? data.fragments.filter(knownFragment) : [],
    prologueSeen: data.prologueSeen === true,
    finaleComplete: data.finaleComplete === true,
    journal: parseJournal(data.journal)
  };
  return state;
}

function safeStorage(): Storage | null {
  if (!FEATURES.persistProgress || typeof window === 'undefined') return null;
  try {
    const s = window.localStorage;
    const probe = '__gpc_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// External store
// ---------------------------------------------------------------------------

export interface ProgressionStore {
  getState(): ProgressionState;
  dispatch(action: ProgressionAction): void;
  subscribe(listener: () => void): () => void;
}

function loadState(storage: Storage): ProgressionState | null {
  const current = storage.getItem(PUZZLE_SETTINGS.storageKey);
  if (current !== null) return parseStoredState(current);
  // First visit on this build: adopt a Seven Seals case file from the old build.
  return migrateLegacyInvestigation(storage.getItem(PUZZLE_SETTINGS.legacyInvestigationKey));
}

export function createProgressionStore(storage: Storage | null = safeStorage()): ProgressionStore {
  const key = PUZZLE_SETTINGS.storageKey;
  let state: ProgressionState = createInitialState();
  if (storage) {
    try {
      state = loadState(storage) ?? state;
    } catch {
      // unreadable storage — start fresh
    }
  }
  const listeners = new Set<() => void>();

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispatch(action) {
      const next = progressionReducer(state, action);
      if (next === state) return;
      state = next;
      if (storage) {
        try {
          storage.setItem(key, JSON.stringify(state));
        } catch {
          // quota exceeded / storage revoked — keep playing in memory
        }
      }
      listeners.forEach((l) => l());
    }
  };
}

/** App-wide singleton. */
export const progressionStore = createProgressionStore();
