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

export const TERMINAL_HELP: Array<{ cmd: string; desc: string }> = [
  { cmd: 'help', desc: 'Display command manual' },
  { cmd: 'clear', desc: 'Clear terminal screen' },
  { cmd: 'whoami', desc: 'Display clearance & terminal identity' },
  { cmd: 'clearance <1-5>', desc: 'Switch clearance level' },
  { cmd: 'ls docs', desc: 'List indexed documents' },
  { cmd: 'cat <doc_code>', desc: 'Print raw classified document' },
  { cmd: 'scan', desc: 'Run planetary 14.8Hz harmonic scan' },
  { cmd: 'decrypt', desc: 'Toggle Redaction De-Scrambler' },
  { cmd: 'play <1-6>', desc: 'Play audio artifact preset' },
  { cmd: 'stop', desc: 'Stop all active audio streams' },
  { cmd: 'leak-dump', desc: "Access Dr. Aris Thorne's leak directory" },
  { cmd: 'override <code>', desc: 'Admin bypass for Level 5 Black Dossier' },
  { cmd: 'hint', desc: 'Request investigator assistance for the override' },
  { cmd: 'progress', desc: 'Show investigation progress' },
  { cmd: 'status', desc: 'Display field stations & telemetry state' },
  { cmd: 'exit', desc: 'Close terminal backdoor' }
];

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
  { text: '=== DR. ARIS THORNE EXFILTRATION DIRECTORY (OCTOBER 2019) ===', tone: 'alert' },
  { code: 'DOC-2019-PALIMPSEST-LEAK', text: '48GB Svalbard Borehole 4 Infrasound Master', tone: 'alert' },
  { code: 'DOC-2011-OAKHAVEN-AUDIT', text: 'Oakhaven Mass Dissociation Clinical Post-Mortem', tone: 'alert' },
  {
    code: 'DOC-1994-RESON8-CASUALTIES',
    text: '82 Reson-8 Hospitalizations & £48.2M Settlements',
    tone: 'alert'
  },
  { code: 'DOC-1989-SVALBARD-EVENT', text: 'Disappearance of Dr. Arthur Vance-Vane', tone: 'alert' },
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
