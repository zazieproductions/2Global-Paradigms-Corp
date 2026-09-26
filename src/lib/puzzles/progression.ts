/**
 * Progression store — the single source of truth for player state:
 * discovered files, completed / assisted puzzles, revealed hints, unlocked
 * routes & downloads, clearance, de-scrambler, preferences and callsign.
 *
 * Framework-agnostic (a tiny external store). React reads it through
 * `useProgression()` (src/hooks/use-progression.ts).
 *
 * Persistence: localStorage under `PUZZLE_SETTINGS.storageKey`. Storage is
 * best-effort — private mode, quota errors or disabled storage silently fall
 * back to in-memory state. Stored data is validated on load; anything
 * malformed is discarded rather than trusted. This is a low-stakes, client-side
 * game state: players can edit it freely, and that is fine.
 */
import type {
  AccessState,
  ClearanceLevel,
  CompletionMethod,
  Preferences,
  ProgressionState,
  PuzzleDefinition
} from '@/types';
import { DEFAULT_CLEARANCE, CLEARANCE_TIERS } from '@/config/clearance';
import { FEATURES } from '@/config/features';
import { PUZZLE_SETTINGS } from '@/config/puzzles';
import { SITE } from '@/config/site';
import { PUZZLES } from '@/content';
import { getPuzzle } from './validate';

export const createInitialState = (): ProgressionState => ({
  version: 1,
  callsign: SITE.defaultCallsign,
  discovered: {},
  completed: {},
  hintsRevealed: {},
  unlockedRoutes: [],
  unlockedDownloads: [],
  access: { clearance: DEFAULT_CLEARANCE, unredacted: false },
  preferences: { crt: false, sound: FEATURES.uiSoundsDefault }
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
  | { type: 'reset'; keepPreferences?: boolean };

const uniqPush = (list: string[], value: string) => (list.includes(value) ? list : [...list, value]);

function applyRewards(state: ProgressionState, puzzle: PuzzleDefinition): ProgressionState {
  let next = state;
  for (const reward of puzzle.rewards) {
    switch (reward.type) {
      case 'clearance':
        next = { ...next, access: { ...next.access, clearance: reward.level } };
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

export function progressionReducer(state: ProgressionState, action: ProgressionAction): ProgressionState {
  switch (action.type) {
    case 'discover':
      if (state.discovered[action.recordId]) return state;
      return {
        ...state,
        discovered: { ...state.discovered, [action.recordId]: action.at ?? new Date().toISOString() }
      };

    case 'reveal-hint': {
      const current = state.hintsRevealed[action.puzzleId] ?? 0;
      if (action.tier <= current) return state;
      return { ...state, hintsRevealed: { ...state.hintsRevealed, [action.puzzleId]: action.tier } };
    }

    case 'complete': {
      const puzzle = getPuzzle(action.puzzleId);
      if (!puzzle) return state;
      const revealedTier = state.hintsRevealed[action.puzzleId] ?? 0;
      const usedAnswerHint = puzzle.hints.some((h) => h.revealsAnswer && h.tier <= revealedTier);
      const assisted = action.method === 'bypass' || usedAnswerHint;
      const previous = state.completed[action.puzzleId];
      // Replays keep the first completion unless an unassisted solve upgrades it.
      const completion =
        previous && (!previous.assisted || assisted)
          ? previous
          : { at: action.at ?? new Date().toISOString(), method: action.method, assisted };
      return applyRewards(
        { ...state, completed: { ...state.completed, [action.puzzleId]: completion } },
        puzzle
      );
    }

    case 'set-clearance':
      return { ...state, access: { ...state.access, clearance: action.level } };

    case 'set-unredacted':
      return state.access.unredacted === action.value
        ? state
        : { ...state, access: { ...state.access, unredacted: action.value } };

    case 'set-preference':
      return { ...state, preferences: { ...state.preferences, [action.key]: action.value } };

    case 'set-callsign':
      return { ...state, callsign: action.callsign.trim().slice(0, 24) || SITE.defaultCallsign };

    case 'reset': {
      const fresh = createInitialState();
      return action.keepPreferences ? { ...fresh, preferences: state.preferences } : fresh;
    }
  }
}

// ---------------------------------------------------------------------------
// Persistence (validated, best-effort)
// ---------------------------------------------------------------------------

const VALID_LEVELS = new Set<string>([
  ...CLEARANCE_TIERS.map((t) => t.level),
  'Level 3 - Secret (REVOKED)',
  'Level 4 - Top Secret (REVOKED)',
  'Level 5 - Black Dossier (REVOKED)'
]);

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === 'string');

/** Parse untrusted JSON into a valid state, or null. Exported for tests. */
export function parseStoredState(raw: string | null): ProgressionState | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isRecord(data) || data.version !== 1) return null;
  const base = createInitialState();
  const access = isRecord(data.access) ? data.access : {};
  const prefs = isRecord(data.preferences) ? data.preferences : {};
  const completed: ProgressionState['completed'] = {};
  if (isRecord(data.completed)) {
    for (const [id, c] of Object.entries(data.completed)) {
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
      ? (Object.fromEntries(Object.entries(v).filter(([, x]) => typeof x === 'number')) as Record<
          string,
          number
        >)
      : {};

  const clearance =
    typeof access.clearance === 'string' && VALID_LEVELS.has(access.clearance)
      ? (access.clearance as ClearanceLevel)
      : base.access.clearance;

  return {
    version: 1,
    callsign: typeof data.callsign === 'string' ? data.callsign.slice(0, 24) : base.callsign,
    discovered: stringMap(data.discovered),
    completed,
    hintsRevealed: numberMap(data.hintsRevealed),
    unlockedRoutes: isStringArray(data.unlockedRoutes) ? data.unlockedRoutes : [],
    unlockedDownloads: isStringArray(data.unlockedDownloads) ? data.unlockedDownloads : [],
    access: { clearance, unredacted: access.unredacted === true } satisfies AccessState,
    preferences: {
      crt: typeof prefs.crt === 'boolean' ? prefs.crt : base.preferences.crt,
      sound: typeof prefs.sound === 'boolean' ? prefs.sound : base.preferences.sound
    }
  };
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

export function createProgressionStore(storage: Storage | null = safeStorage()): ProgressionStore {
  const key = PUZZLE_SETTINGS.storageKey;
  let state: ProgressionState = createInitialState();
  if (storage) {
    try {
      state = parseStoredState(storage.getItem(key)) ?? state;
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

// ---------------------------------------------------------------------------
// Selectors
// ---------------------------------------------------------------------------

/** True once any completed puzzle has granted `level` (so it can be re-selected freely). */
export function hasEarnedClearance(state: ProgressionState, level: ClearanceLevel): boolean {
  return PUZZLES.some(
    (p) => !!state.completed[p.id] && p.rewards.some((r) => r.type === 'clearance' && r.level === level)
  );
}
