/**
 * FIELD DIRECTIVES — the case file's spine.
 *
 * The Seven Seals are the puzzles; the Field Directives are the *story* laid
 * over them. Thorne leaves a numbered run of instructions ("open this record,
 * run a sweep, lift the bars, take the dump") and the archive records the
 * observable events that satisfy them in a **validated milestones ledger**.
 *
 * Two rules keep the player's side free of bookkeeping:
 *
 * 1. **Observable only.** A milestone may only be tied to something the player
 *    actually did in the UI — opened a record, visited a section, collected a
 *    fragment, broke a seal, ran `scan`, engaged the de-scrambler, played an
 *    artifact, opened the safe, took a download.
 * 2. **Validated.** An observation that matches no catalogued milestone is
 *    dropped, the ledger is de-duplicated by milestone id, and anything
 *    unrecognised in a stored save is discarded on load (see
 *    `lib/puzzles/directives.ts`).
 *
 * Every directive pays **FIELD INTEL**: new lore that stitches the mystery
 * together, written to the journal and announced as a revelation toast. No
 * directive ever grants clearance — only the seals do.
 */
import type { ActiveTab } from './index';

/** Every observable event the ledger understands. */
export type MilestoneEventKind =
  | 'prologue-read'
  | 'record-opened'
  | 'section-visited'
  | 'fragment-collected'
  | 'seal-broken'
  | 'terminal-scan'
  | 'descrambler-engaged'
  | 'audio-played'
  | 'safe-opened'
  | 'download-taken'
  | 'finale-complete';

/**
 * A single observation, dispatched by whatever surface the player touched.
 * `target` is the id inside that kind (record id, tab, fragment id, seal id,
 * audio artifact id, download id) — omitted when the kind is enough on its own.
 */
export interface MilestoneEvent {
  kind: MilestoneEventKind;
  target?: string;
}

/**
 * What a catalogued milestone requires. Mostly a 1:1 mirror of
 * `MilestoneEvent`, plus count thresholds that no single click can express
 * (`fragments-collected`).
 */
export type MilestoneRule =
  | { kind: 'prologue-read' }
  | { kind: 'record-opened'; recordId: string }
  | { kind: 'section-visited'; tab: ActiveTab }
  | { kind: 'fragments-collected'; atLeast: number }
  | { kind: 'seal-broken'; sealId: 1 | 2 | 3 | 4 | 5 | 6 | 7 }
  | { kind: 'terminal-scan' }
  | { kind: 'descrambler-engaged' }
  | { kind: 'audio-played'; audioId?: string }
  | { kind: 'safe-opened' }
  | { kind: 'download-taken'; downloadId?: string }
  | { kind: 'finale-complete' };

/** One catalogued step. Ids are stable forever — they appear in saves. */
export interface MilestoneDef {
  id: string;
  rule: MilestoneRule;
  /** Player-facing checklist line, imperative ("Open the commissioning log"). */
  label: string;
  /** One line of guidance shown while the step is outstanding. */
  nudge?: string;
}

/** One row of the ledger: which step was satisfied, and when. */
export interface MilestoneEntry {
  /** Milestone id (never an arbitrary event — see `recordObservation`). */
  id: string;
  kind: MilestoneEventKind;
  target?: string;
  /** ISO timestamp. Stored saves are validated for shape, not clock value. */
  at: string;
}

/** A recovered FIELD INTEL filing — the payoff for a directive. */
export interface FieldIntel {
  id: string;
  /** Printed reference, e.g. `FIELD INTEL 04`. */
  code: string;
  title: string;
  /** Lore paragraphs; rendered in order, never truncated. */
  paragraphs: string[];
  /** Where the operator is pointed next, in-world. */
  source?: string;
}

/** A directive: one in-world instruction and the steps that close it. */
export interface DirectiveDef {
  id: string;
  /** Printed numeral, e.g. `04`. */
  numeral: string;
  chapterId: string;
  /** Short codename shown on the board, e.g. `THE SQUARE`. */
  codename: string;
  /** Thorne's instruction, in his voice. */
  brief: string;
  /** Milestone ids; all of them must be satisfied. */
  milestones: string[];
  /** FIELD INTEL paid on completion. */
  intelId: string;
  /** Journal line written on completion. */
  journal: string;
  /** Toast body. Defaults to the intel title when omitted. */
  toast?: string;
}

/** A chapter (act): a run of directives and its completion announcement. */
export interface ChapterDef {
  id: string;
  numeral: string;
  title: string;
  subtitle: string;
  directiveIds: string[];
  /** Announced (toast + journal) when the last directive in the chapter closes. */
  closing: string;
  /** CSS colour for the chapter rule. */
  accent: string;
}

/** The persisted Field Directives case file. */
export interface DirectivesState {
  /**
   * The validated milestones ledger — every observable step the operator has
   * taken, in the order the archive recorded them. De-duplicated by milestone
   * id; unknown or malformed rows are dropped on load.
   */
  ledger: MilestoneEntry[];
  /** directiveId → ISO time the directive closed. */
  completed: Record<string, string>;
  /** Recovered FIELD INTEL ids, in the order they were filed. */
  intel: string[];
  /** chapterId → ISO time the chapter's announcement was made. */
  chapters: Record<string, string>;
}
