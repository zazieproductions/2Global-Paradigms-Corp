/**
 * Static in-world text printed by the GPC://CLI terminal.
 * Kept here so writers can edit it without touching the terminal component.
 * `tone` maps to a text colour in the terminal renderer.
 */
export type TerminalTone = 'heading' | 'body' | 'muted' | 'warn' | 'ok' | 'alert' | 'code';

export interface TerminalLine {
  text: string;
  tone?: TerminalTone;
  /** Optional leading code (rendered in cyan), e.g. a document ID. */
  code?: string;
}

export const TERMINAL_HELP: Array<{ cmd: string; desc: string; order?: boolean }> = [
  { cmd: 'help', desc: 'Display command manual' },
  { cmd: 'clear', desc: 'Clear terminal screen' },
  { cmd: 'whoami', desc: 'Identity, clearance & degree' },
  { cmd: 'clearance <1-5>', desc: 'Switch to an earned clearance' },
  { cmd: 'ls docs [n]', desc: 'List indexed documents (page n)' },
  { cmd: 'cat <doc_code>', desc: 'Print a document you are cleared for' },
  { cmd: 'scan', desc: 'Run planetary 14.8Hz harmonic scan' },
  { cmd: 'decrypt', desc: 'Toggle Redaction De-Scrambler (L3+)' },
  { cmd: 'play <1-6>', desc: 'Play audio artifact preset' },
  { cmd: 'stop', desc: 'Stop all active audio streams' },
  { cmd: 'leak-dump', desc: "Thorne's exfiltration directory" },
  { cmd: 'status', desc: 'Field stations & telemetry state' },
  { cmd: 'hint [confirm]', desc: 'Ask Thorne about the active seal' },
  { cmd: 'progress', desc: 'Show investigation progress' },
  { cmd: 'seals', desc: 'Progress of the Seven Seals', order: true },
  { cmd: 'codex', desc: 'Your Choir Script key', order: true },
  { cmd: 'gematria <text>', desc: 'Ordinal letter-sum (A=1…Z=26)', order: true },
  { cmd: 'wheel <keyword>', desc: "Turn the Mercury Wheel on Thorne's courier line", order: true },
  { cmd: 'commune', desc: 'Place your hand on the planchette', order: true },
  { cmd: 'invoke <name>', desc: 'Speak a name into the carrier', order: true },
  { cmd: 'exit', desc: 'Close terminal backdoor' }
];

/**
 * The planchette: an in-world hint voice that changes as the case advances.
 * Index = active seal − 1; the last line plays after the finale.
 */
export const COMMUNE_LINES: string[] = [
  'THE SQUARE IS OLDER THAN THE COMPANY',
  'WALK THE STAR FROM THE SUN',
  'THE PUBLIC FACE IS SIGNED IN RED',
  'EARTH EVENING CHILD',
  'READ THE HEAD OF EVERY VERSE',
  'THE WHEEL WANTS THE NAME OF THE CAVES',
  'O R P H E U  WHO',
  'THANK YOU'
];

/** Numbers the `gematria` command annotates. */
export const GEMATRIA_NOTES: Record<number, string> = {
  15: "Saturn's constant. The Square completes at fifteen.",
  45: 'The sum of the Square of Saturn (1 through 9).',
  53: 'CHOIR.',
  102: 'The name that must not be spoken in the Voice’s hearing.',
  148: 'The carrier, written without its point.',
  432: 'The evening voice.',
  741: 'The child’s voice.'
};

export const TERMINAL_SCAN: TerminalLine[] = [
  { text: '--- PLANETARY INFRASONIC TELEMETRY SCAN ---', tone: 'heading' },
  { text: 'STATION 07 (SVALBARD): 14.802 Hz @ 94.2 dB (SURGE ALERT: +18.4%)' },
  { text: 'STATION 05 (ATACAMA): 4.200 Hz (Atmospheric Pillar Phase Locked)' },
  { text: 'STATION 09 (DIEGO GARCIA): 54.000 Hz Mantle Harmonic Ramp Active' },
  { text: 'STATION 19 (AZORES NODE 14): Transatlantic Grid Coupling Confirmed' },
  { text: 'STATION 06 (SITE 19 UTAH): 32.400 Hz Structural Containment Tone Normal' },
  { text: 'COMPOSITE PLANETARY COUPLING INDEX: 99.94%', tone: 'warn' }
];

export const TERMINAL_LEAK_DUMP: TerminalLine[] = [
  { text: '=== DR. EWAN THORNE EXFILTRATION DIRECTORY (OCTOBER 2019) ===', tone: 'alert' },
  { code: 'DOC-2019-PALIMPSEST-LEAK', text: '48GB Svalbard Borehole 4 Infrasound Master', tone: 'alert' },
  { code: 'DOC-2011-OAKHAVEN-AUDIT', text: 'Oakhaven Mass Dissociation Clinical Post-Mortem', tone: 'alert' },
  {
    code: 'DOC-1994-RESON8-CASUALTIES',
    text: '82 Reson-8 Hospitalizations & £48.2M Settlements',
    tone: 'alert'
  },
  { code: 'DOC-1989-SVALBARD-EVENT', text: 'Disappearance of Dr. Arthur Sedley', tone: 'alert' },
  {
    code: 'AUDIO-01-SVALBARD',
    text: 'Raw 14.8Hz Permafrost Audio Tape with Thorne Voice Log',
    tone: 'alert'
  },
  { text: 'Type "cat <doc_code>" to read any record directly.', tone: 'muted' }
];

export const TERMINAL_STATUS = (stationCount: number): TerminalLine[] => [
  { text: '=== GPC GLOBAL SYSTEM STATUS ===', tone: 'heading' },
  { text: `ACTIVE REGIONAL STATIONS: ${stationCount} / ${stationCount} ONLINE` },
  { text: 'SUBTERRANEAN REDOUBTS (AETHELGARD): 14 CERTIFIED (720-Day Autonomous)' },
  { text: 'TIER-1 HERITAGE COHORT ENROLLMENT: 10,000 / 10,000 SEATS COMMITTED' },
  { text: 'POSTOJNA REPOSITORY HASH SYNC: 100% (SHA256)' },
  { text: 'LITHOSPHERIC 14.8Hz CARRIER: 14.802 Hz (0.05% Drift toward 15.0Hz)' },
  { text: 'EXECUTIVE DIRECTIVE 01: PRE-ACTIVATION STANDBY', tone: 'ok' }
];
