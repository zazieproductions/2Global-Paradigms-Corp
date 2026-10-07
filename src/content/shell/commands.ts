/**
 * Archive shell — the command index and session copy for the docked console
 * (`components/archive/shell-terminal.tsx`).
 *
 * The shell is a navigation surface, not a puzzle: it moves an operator between
 * routed sections and record viewers. Anything that grants access, reveals
 * redactions or advances the case belongs to the Channel 9 backdoor
 * (`components/puzzles/terminal-modal.tsx`), which the shell can only hand off
 * to (`cli`). Never let a command here change progression state.
 *
 * Register: technical. Machine output is lowercase the way a shell is; the
 * login banner is the only uppercase line, because it is the machine naming
 * itself. See docs/CONTENT_STYLE_GUIDE.md §1 and §7.
 */

export interface ShellCommand {
  /** Canonical command name, as typed. */
  cmd: string;
  /** Argument placeholder shown in the index (`<path>`, `[on|off]`…). */
  arg?: string;
  desc: string;
  /** Also handed off to another surface (a dialog) rather than the router. */
  handoff?: boolean;
}

/** Documented commands. `help` prints this table in order. */
export const SHELL_COMMANDS: ShellCommand[] = [
  { cmd: 'help', arg: '[command]', desc: 'Command index, or the usage of one command' },
  { cmd: 'ls', arg: '[section]', desc: 'List sections, or the route a section mounts at' },
  { cmd: 'cd', arg: '<section>', desc: 'Change section (aliases: open, goto)' },
  { cmd: 'pwd', desc: 'Print the route the archive is currently showing' },
  { cmd: 'open', arg: '<section|record>', desc: 'Open a section, a record code, or a hit from `find`' },
  { cmd: 'find', arg: '<terms>', desc: 'Search every recovered record; `open <n>` opens hit n' },
  { cmd: 'read', arg: '<document>', desc: 'Open a document in the viewer' },
  { cmd: 'back', desc: 'Return to the previous route' },
  { cmd: 'history', desc: 'Commands typed in this session' },
  { cmd: 'clear', desc: 'Clear the screen (Ctrl+L)' },
  { cmd: 'whoami', desc: 'Operator, clearance and case progress' },
  { cmd: 'callsign', arg: '[name]', desc: 'Show or set the operator callsign' },
  { cmd: 'crt', arg: '[on|off]', desc: 'CRT scanline display' },
  { cmd: 'sound', arg: '[on|off]', desc: 'Interface sounds' },
  { cmd: 'transmission', desc: 'Read the unscheduled Channel 9 message', handoff: true },
  { cmd: 'cli', desc: 'Open the Channel 9 backdoor (~)', handoff: true },
  { cmd: 'boot', desc: 'Replay the cold-boot sequence', handoff: true },
  { cmd: 'exit', desc: 'Close the shell (Esc)' }
];

/**
 * Section aliases accepted wherever a section is expected. Keys are matched
 * after lower-casing; values must be a section id in `config/navigation.ts`.
 * A command name is never an alias: `ls san` completes to `sanctum`, not `ls`.
 */
export const SHELL_ALIASES: Record<string, string> = {
  docs: 'documents',
  vault: 'documents',
  vault0: 'documents',
  people: 'personnel',
  staff: 'personnel',
  roster: 'personnel',
  sites: 'stations',
  arrays: 'stations',
  projects: 'programs',
  dossiers: 'programs',
  depts: 'departments',
  recalls: 'products',
  acoustics: 'audio',
  apps: 'tools',
  financials: 'reports',
  comms: 'communications',
  email: 'communications',
  minutes: 'communications',
  bulletins: 'newsletters',
  courses: 'training',
  jobs: 'careers',
  hiring: 'careers',
  doctrine: 'values',
  pillars: 'values',
  case: 'sanctum',
  ledger: 'legacy',
  restoration: 'legacy',
  home: 'dashboard',
  root: 'dashboard'
};

/** Lines printed when the shell opens (after the dynamic login line). */
export const SHELL_INTRO = {
  banner: 'GLOBAL PARADIGMS CORP. // ARCHIVE SHELL — VAULT0 (read-only index)',
  hint: 'type `help` for the command index, `ls` for the sections. `exit` or Esc closes the shell.',
  /** Printed only while the first Channel 9 message is unread. */
  transmissionWaiting: 'one unscheduled transmission is waiting on the Channel 9 backdoor — type: transmission',
  transmissionOpened: 'channel 9 — playing the buffered message',
  cliOpened: 'channel 9 backdoor open — `~` reopens it without the shell',
  bootReplay: 'replaying the cold boot — Esc or SKIP ends it',
  /** Appended to `command not found`, so a wrong move always has a next step. */
  notFoundHint: 'type `help` for the command index.'
} as const;

/** Lines printed by `help` above the table. */
export const SHELL_HELP_HEADING = 'COMMAND INDEX';
