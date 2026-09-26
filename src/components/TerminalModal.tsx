import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { DocumentRecord, ClearanceLevel } from '../types';
import { gpcAudio } from '../lib/audioEngine';
import { useArg } from '../arg/ArgContext';
import { clearanceRank, levelFromRank } from '../arg/levels';
import { matchesDigest, ordinalGematria, vigenereDecrypt } from '../arg/cipher';
import { DIGESTS, FRAGMENTS, MERCURY_CIPHERTEXT, SEALS } from '../arg/seals';
import { renderRedacted, stripRedactions } from '../arg/Redacted';
import { ChoirGlyph } from '../arg/sigils';

// The planchette: an in-world hint voice that changes as the case advances.
const COMMUNE: string[] = [
  'THE SQUARE IS OLDER THAN THE COMPANY',
  'WALK THE STAR FROM THE SUN',
  'THE PUBLIC FACE IS SIGNED IN RED',
  'EARTH EVENING CHILD',
  'READ THE HEAD OF EVERY VERSE',
  'THE WHEEL WANTS THE NAME OF THE CAVES',
  'O R P H E U  WHO',
  'THANK YOU'
];

const Planchette: React.FC<{ text: string }> = ({ text }) => {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (n >= text.length) return;
    const id = setTimeout(() => {
      setN((v) => v + 1);
      gpcAudio.playTone(180 + Math.random() * 60, 0.25, 'sine', 0.05);
    }, 260);
    return () => clearTimeout(id);
  }, [n, text.length]);
  return (
    <div className="space-y-1">
      <p className="text-fuchsia-400/70 text-[10px] tracking-widest">THE PLANCHETTE MOVES…</p>
      <p className="font-occult text-lg tracking-[0.5em] text-fuchsia-200">{text.slice(0, n)}<span className="boot-caret">▮</span></p>
    </div>
  );
};

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  operatorCallsign?: string;
  clearance: ClearanceLevel;
  onSetClearance: (level: ClearanceLevel) => void;
  isUnredacted: boolean;
  onToggleUnredacted: () => void;
  documents: DocumentRecord[];
  onSelectDocument: (doc: DocumentRecord) => void;
}

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  isOpen,
  onClose,
  operatorCallsign = 'ANONYMOUS_INVESTIGATOR',
  clearance,
  onSetClearance,
  isUnredacted,
  onToggleUnredacted,
  documents,
  onSelectDocument
}) => {
  const argState = useArg();
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([
    {
      command: 'sys.init',
      output: (
        <div className="space-y-1 text-slate-400">
          <p className="text-cyan-400 font-bold">
            GLOBAL PARADIGMS CORP. // PARADIGM-OS [CLI TERMINAL v8.4.2]
          </p>
          <p>POSTOJNA REPOSITORY ENCRYPTED LINK: ONLINE (SHA256: 0x7F4A...)</p>
          <p>AUTHENTICATED AS: {operatorCallsign.toUpperCase()} // {clearance.toUpperCase()}</p>
          <p className="text-amber-400">
            Type <span className="text-cyan-300 font-bold">"help"</span> for the command index, or <span className="text-fuchsia-300 font-bold">"seals"</span> to review the investigation.
          </p>
        </div>
      )
    }
  ]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    gpcAudio.playUiSound('keystroke');
    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    let outputNode: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        outputNode = (
          <div className="space-y-1.5 text-slate-300">
            <p className="text-cyan-400 font-bold">AVAILABLE COMMANDS:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div><span className="text-cyan-300 font-bold">help</span> — Display command manual</div>
              <div><span className="text-cyan-300 font-bold">clear</span> — Clear terminal screen</div>
              <div><span className="text-cyan-300 font-bold">whoami</span> — Identity, clearance & degree</div>
              <div><span className="text-cyan-300 font-bold">clearance &lt;1-5&gt;</span> — Switch to an earned clearance</div>
              <div><span className="text-cyan-300 font-bold">ls docs [n]</span> — List indexed documents (page n)</div>
              <div><span className="text-cyan-300 font-bold">cat &lt;doc_code&gt;</span> — Print a document you are cleared for</div>
              <div><span className="text-cyan-300 font-bold">scan</span> — Run planetary 14.8Hz harmonic scan</div>
              <div><span className="text-cyan-300 font-bold">decrypt</span> — Toggle Redaction De-Scrambler (L3+)</div>
              <div><span className="text-cyan-300 font-bold">play &lt;1-6&gt;</span> — Play audio artifact preset</div>
              <div><span className="text-cyan-300 font-bold">stop</span> — Stop all active audio streams</div>
              <div><span className="text-cyan-300 font-bold">leak-dump</span> — Thorne's exfiltration directory</div>
              <div><span className="text-cyan-300 font-bold">status</span> — Field stations & telemetry state</div>
              <div><span className="text-fuchsia-300 font-bold">seals</span> — Progress of the Seven Seals</div>
              <div><span className="text-fuchsia-300 font-bold">codex</span> — Your Choir Script key</div>
              <div><span className="text-fuchsia-300 font-bold">gematria &lt;text&gt;</span> — Ordinal letter-sum (A=1…Z=26)</div>
              <div><span className="text-fuchsia-300 font-bold">wheel &lt;keyword&gt;</span> — Turn the Mercury Wheel on Thorne's courier line</div>
              <div><span className="text-fuchsia-300 font-bold">commune</span> — Place your hand on the planchette</div>
              <div><span className="text-fuchsia-300 font-bold">invoke &lt;name&gt;</span> — Speak a name into the carrier</div>
              <div><span className="text-cyan-300 font-bold">exit</span> — Close terminal backdoor</div>
            </div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'whoami':
        outputNode = (
          <div className="text-slate-300">
            <p>USER: {operatorCallsign.toUpperCase()}</p>
            <p>SESSION ORIGIN: COLD BOOT TERMINAL // CH9</p>
            <p>CLEARANCE: <span className="text-amber-400 font-bold">{clearance}</span> (EARNED: LEVEL {argState.earnedLevel})</p>
            <p>DEGREE: <span className="text-fuchsia-300">{argState.earnedLevel >= 3 ? ['', 'NEOPHYTE', 'ZELATOR', 'PRACTICUS', 'PHILOSOPHUS', 'MAGISTER UMBRAE'][clearanceRank(clearance)] : '████████ (requires Level 3)'}</span></p>
            <p>SEALS BROKEN: <span className="text-fuchsia-300">{argState.solved.length}/7</span></p>
            <p>REDACTION DE-SCRAMBLER: {isUnredacted ? <span className="text-rose-400 font-bold">ACTIVE (UNREDACTED)</span> : <span className="text-slate-400">INACTIVE</span>}</p>
            <p>NODE CONNECTION: London Tower Obsidian Proxy // Session Encrypted</p>
          </div>
        );
        break;

      case 'clearance': {
        const lvl = parseInt(arg, 10);
        if (!(lvl >= 1 && lvl <= 5)) {
          gpcAudio.playUiSound('deny');
          outputNode = <p className="text-rose-400">Usage: clearance &lt;1-5&gt;</p>;
        } else if (lvl > argState.earnedLevel) {
          gpcAudio.playUiSound('deny');
          outputNode = (
            <p className="text-rose-400">
              DENIED. Level {lvl} has not been earned. Your degree ceiling is LEVEL {argState.earnedLevel}. Break the next seal (type <span className="text-fuchsia-300">seals</span>).
            </p>
          );
        } else {
          onSetClearance(levelFromRank(lvl));
          gpcAudio.playUiSound('grant');
          outputNode = <p className="text-emerald-400">Clearance set to: {levelFromRank(lvl).toUpperCase()}</p>;
        }
        break;
      }

      case 'override':
        gpcAudio.playUiSound('deny');
        outputNode = (
          <div className="text-rose-300 space-y-1">
            <p className="font-bold">*** OVERRIDE REJECTED ***</p>
            <p>MASTER KEY 01 (DAME E. CROSS) — REVOKED 1989-11-04 05:14 UTC.</p>
            <p className="text-slate-400">Reason on file: "The Order does not open for keys. It opens for voices."</p>
            <p className="text-fuchsia-300">Clearance is earned through the Seven Seals. Type <span className="font-bold">seals</span>.</p>
          </div>
        );
        break;

      case 'decrypt':
      case 'unredact':
        if (!argState.descramblerUnlocked) {
          gpcAudio.playUiSound('deny');
          outputNode = <p className="text-rose-400">DE-SCRAMBLER LOCKED — requires LEVEL 3 (Seal II: The Wheel of Days).</p>;
          break;
        }
        onToggleUnredacted();
        gpcAudio.playUiSound('unredact');
        outputNode = (
          <p className="text-cyan-300">
            Redaction de-scrambler toggled: <span className="font-bold">{!isUnredacted ? 'ENABLED (Cleartext Revealed)' : 'DISABLED (Redactions Re-Applied)'}</span>
          </p>
        );
        break;

      case 'scan':
        gpcAudio.playUiSound('scan');
        outputNode = (
          <div className="text-slate-300 space-y-1">
            <p className="text-cyan-400 font-bold">--- PLANETARY INFRASONIC TELEMETRY SCAN ---</p>
            <p>STATION 07 (SVALBARD): 14.802 Hz @ 94.2 dB (SURGE ALERT: +18.4%)</p>
            <p>STATION 05 (ATACAMA): 4.200 Hz (Atmospheric Pillar Phase Locked)</p>
            <p>STATION 09 (DIEGO GARCIA): 54.000 Hz Mantle Harmonic Ramp Active</p>
            <p>STATION 19 (AZORES NODE 14): Transatlantic Grid Coupling Confirmed</p>
            <p>STATION 06 (SITE 19 UTAH): 32.400 Hz Structural Containment Tone Normal</p>
            <p className="text-amber-400">COMPOSITE PLANETARY COUPLING INDEX: 99.94%</p>
          </div>
        );
        break;

      case 'play': {
        const idx = parseInt(arg, 10);
        if (idx === 1) {
          gpcAudio.playArtifact('infrasound', 'audio-01');
          outputNode = <p className="text-cyan-300">Now playing: Station 07 Sub-Permafrost Infrasound Capture (14.8Hz)...</p>;
        } else if (idx === 2) {
          gpcAudio.playArtifact('vesperTone', 'audio-02');
          outputNode = <p className="text-cyan-300">Now playing: Project Vesper Municipal Test Broadcast (Sector 9)...</p>;
        } else if (idx === 3) {
          gpcAudio.playArtifact('hydrophone', 'audio-03');
          outputNode = <p className="text-cyan-300">Now playing: Diego Garcia Trench Hydrophone 12 Anomalous Deep Pulse...</p>;
        } else if (idx === 4) {
          gpcAudio.playArtifact('reson8', 'audio-04');
          outputNode = <p className="text-cyan-300">Now playing: Reson-8 Prototype Test Loop #4 (Uncensored Recovery)...</p>;
        } else if (idx === 5) {
          gpcAudio.playArtifact('seismic', 'audio-05');
          outputNode = <p className="text-cyan-300">Now playing: Black Ridge Appalachian Seismic Resonance ("Singing Seam")...</p>;
        } else if (idx === 6) {
          gpcAudio.playArtifact('palimpsest', 'audio-06');
          outputNode = <p className="text-cyan-300">Now playing: Project Palimpsest Telemetry Burst & Encrypted Carrier...</p>;
        } else {
          outputNode = <p className="text-slate-400">Usage: play &lt;1-6&gt; (e.g. "play 1")</p>;
        }
        break;
      }

      case 'stop':
        gpcAudio.stopAllArtifacts();
        gpcAudio.playUiSound('click');
        outputNode = <p className="text-slate-400">All audio streams terminated.</p>;
        break;

      case 'leak-dump':
        outputNode = (
          <div className="text-rose-300 space-y-1">
            <p className="font-bold">=== DR. ARIS THORNE EXFILTRATION DIRECTORY (OCTOBER 2019) ===</p>
            <p>1. <span className="text-cyan-300">DOC-2019-PALIMPSEST-LEAK</span> — 48GB Svalbard Borehole 4 Infrasound Master</p>
            <p>2. <span className="text-cyan-300">DOC-2011-OAKHAVEN-AUDIT</span> — Oakhaven Mass Dissociation Clinical Post-Mortem</p>
            <p>3. <span className="text-cyan-300">DOC-1994-RESON8-CASUALTIES</span> — 82 Reson-8 Hospitalizations & £48.2M Settlements</p>
            <p>4. <span className="text-cyan-300">DOC-1989-SVALBARD-EVENT</span> — Disappearance of Dr. Arthur Vance-Vane</p>
            <p>5. <span className="text-cyan-300">AUDIO-01-SVALBARD</span> — Raw 14.8Hz Permafrost Audio Tape with Thorne Voice Log</p>
            <p className="text-slate-400 mt-2">Type "cat &lt;doc_code&gt;" to read any record directly.</p>
          </div>
        );
        break;

      case 'cat': {
        const targetDoc = documents.find(
          (d) =>
            d.code.toLowerCase() === arg.toLowerCase() ||
            d.id.toLowerCase() === arg.toLowerCase() ||
            d.title.toLowerCase().includes(arg.toLowerCase())
        );
        if (targetDoc && clearanceRank(targetDoc.clearance) > clearanceRank(clearance)) {
          gpcAudio.playUiSound('deny');
          outputNode = (
            <p className="text-rose-400">
              {targetDoc.code}: SEALED. Classified {targetDoc.clearance}; you hold {clearance}. The wax holds.
            </p>
          );
        } else if (targetDoc) {
          gpcAudio.playUiSound('print');
          outputNode = (
            <div className="bg-[#06080e] p-3 border border-slate-700 rounded text-slate-200 space-y-2 text-[11px]">
              <div className="flex justify-between border-b border-slate-700 pb-1 text-[10px]">
                <span className="text-cyan-400 font-bold">{targetDoc.code}</span>
                <span className="text-amber-400">{targetDoc.classificationStamp}</span>
              </div>
              <h4 className="font-bold text-white">{targetDoc.title}</h4>
              <p className="text-slate-400">{targetDoc.summary}</p>
              <div className="bg-[#0b0e17] p-2 rounded border border-slate-800 text-slate-300 whitespace-pre-line font-mono text-[10px]">
                {isUnredacted && argState.descramblerUnlocked && targetDoc.redactedContent
                  ? targetDoc.redactedContent
                  : renderRedacted(stripRedactions(targetDoc.content))}
              </div>
            </div>
          );
        } else {
          gpcAudio.playUiSound('deny');
          outputNode = <p className="text-rose-400">Error: Document "{arg}" not found in local index.</p>;
        }
        break;
      }

      case 'ls': {
        const [sub, pageArg] = arg.split(' ');
        if (sub === 'docs' || !sub) {
          const page = Math.max(1, parseInt(pageArg || '1', 10) || 1);
          const per = 15;
          const pages = Math.ceil(documents.length / per);
          const slice = documents.slice((page - 1) * per, page * per);
          outputNode = (
            <div className="space-y-1 text-[11px] text-slate-300">
              <p className="text-cyan-400 font-bold">INDEXED REPOSITORY RECORDS — PAGE {page}/{pages}:</p>
              {slice.map((d) => {
                const sealed = clearanceRank(d.clearance) > clearanceRank(clearance);
                return (
                  <div key={d.id} className={`flex justify-between gap-2 ${sealed ? 'opacity-50' : ''}`}>
                    <span className="text-cyan-300 font-mono">{sealed ? '[SEALED] ' : ''}{d.code}</span>
                    <span className="truncate text-slate-400 max-w-[340px]">{d.title}</span>
                    <span className="text-[10px] text-slate-500">{d.clearance.split(' - ')[0]}</span>
                  </div>
                );
              })}
              <p className="text-slate-500 text-[10px]">Next page: ls docs {Math.min(pages, page + 1)}  ·  Order records: search "Order" (press /)</p>
            </div>
          );
        } else {
          outputNode = <p className="text-slate-400">Usage: ls docs [page]</p>;
        }
        break;
      }

      case 'seals':
        outputNode = (
          <div className="space-y-1 text-[11px]">
            <p className="text-fuchsia-300 font-bold">THE SEVEN SEALS — ORDO VOCIS PROFUNDAE</p>
            {SEALS.map((sd) => {
              const done = argState.isSolved(sd.id);
              const active = argState.currentSeal === sd.id;
              return (
                <p key={sd.id} className={`whitespace-pre ${done ? 'text-slate-300' : active ? 'text-amber-300' : 'text-slate-600'}`}>
                  {sd.glyph + '\uFE0E'} {sd.numeral.padEnd(4, ' ')} {sd.title.padEnd(28, ' ')} {done ? `BROKEN · ${sd.sealWord}` : active ? '◀ ACTIVE' : 'SEALED'}
                </p>
              );
            })}
            {argState.currentSeal && (
              <p className="text-slate-400 pt-1">OBJECTIVE: {SEALS[argState.currentSeal - 1].objective}</p>
            )}
          </div>
        );
        break;

      case 'codex': {
        const known = [...argState.knownLetters].sort();
        outputNode = (
          <div className="space-y-2 text-[11px]">
            <p className="text-rose-300 font-bold">CHOIR SCRIPT CODEX — {known.length} GLYPHS KNOWN ({FRAGMENTS.filter((f) => argState.fragments.includes(f.id)).length}/7 FRAGMENTS)</p>
            {known.length === 0 ? (
              <p className="text-slate-500">You know no glyphs yet. The Order signs its public pages faintly.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {known.map((l) => (
                  <span key={l} className="flex flex-col items-center border border-rose-900/50 rounded px-1 py-0.5">
                    <ChoirGlyph letter={l} size={22} color="#fb7185" />
                    <span className="font-occult text-rose-200">{l}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        );
        break;
      }

      case 'gematria': {
        if (!arg.trim()) {
          outputNode = <p className="text-slate-400">Usage: gematria &lt;text&gt;  (ordinal: A=1 … Z=26)</p>;
          break;
        }
        const v = ordinalGematria(arg);
        const notes: Record<number, string> = {
          15: "Saturn's constant. The Square completes at fifteen.",
          45: 'The sum of the Square of Saturn (1 through 9).',
          53: 'CHOIR.',
          102: 'The name that must not be spoken in the Voice’s hearing.',
          148: 'The carrier, written without its point.',
          432: 'The evening voice.',
          741: 'The child’s voice.'
        };
        outputNode = (
          <p className="text-fuchsia-200">
            ORDINAL GEMATRIA of "{arg.toUpperCase()}" = <span className="font-bold text-white">{v}</span>
            {notes[v] && <span className="text-fuchsia-400/80"> — {notes[v]}</span>}
          </p>
        );
        break;
      }

      case 'wheel': {
        if (!arg.trim()) {
          outputNode = (
            <div className="text-[11px] text-slate-300">
              <p>COURIER LINE: <span className="text-purple-300">{MERCURY_CIPHERTEXT}</span></p>
              <p className="text-slate-500">Usage: wheel &lt;keyword&gt;</p>
            </div>
          );
          break;
        }
        const plain = vigenereDecrypt(MERCURY_CIPHERTEXT, arg);
        const ok = plain.startsWith('THE SAFE');
        if (ok) gpcAudio.playUiSound('grant');
        outputNode = <p className={ok ? 'text-purple-200 font-bold' : 'text-slate-500'}>{'☿\uFE0E'} {plain}</p>;
        break;
      }

      case 'commune': {
        const idx = argState.finaleComplete ? 7 : (argState.currentSeal ?? 7) - 1;
        outputNode = <Planchette text={COMMUNE[idx]} />;
        break;
      }

      case 'ordo':
      case 'vox':
        outputNode = (
          <div className="text-fuchsia-200 text-[11px] space-y-1">
            <p className="font-occult tracking-widest">ORDO VOCIS PROFUNDAE</p>
            <p className="italic text-slate-400">"There is a Voice beneath the world. It speaks at fourteen and eight-tenths. We did not make it. We have heard it."</p>
            <p className="text-slate-500">— Liber Carrier, I. (DOC-1972-LIBER-CARRIER, Level 3)</p>
          </div>
        );
        break;

      case 'invoke': {
        const name = arg.trim();
        if (!name) {
          outputNode = <p className="text-slate-400">Usage: invoke &lt;name&gt;</p>;
          break;
        }
        if (matchesDigest(name, DIGESTS.seal7)) {
          if (!argState.isSolved(6)) {
            gpcAudio.playUiSound('deny');
            outputNode = <p className="text-fuchsia-300">The name leaves your mouth and goes nowhere. Six seals still bind the carrier. Nothing below can hear you yet.</p>;
          } else if (argState.finaleComplete) {
            outputNode = <p className="text-slate-300 italic">You say his name. There is no answer. Only quiet — the good kind.</p>;
          } else {
            gpcAudio.playUiSound('alarm');
            outputNode = <p className="text-white font-bold">THE CARRIER FALTERS…</p>;
            setTimeout(() => {
              onClose();
              argState.setFinaleActive(true);
            }, 900);
          }
        } else {
          gpcAudio.playUiSound('deny');
          outputNode = <p className="text-slate-500 italic">You speak "{name.toUpperCase()}" into the carrier. 14.802 Hz. Nothing turns around.</p>;
        }
        break;
      }

      case 'status':
        outputNode = (
          <div className="text-slate-300 space-y-1">
            <p className="text-cyan-400 font-bold">=== GPC GLOBAL SYSTEM STATUS ===</p>
            <p>ACTIVE REGIONAL STATIONS: 22 / 22 ONLINE</p>
            <p>SUBTERRANEAN REDOUBTS (AETHELGARD): 14 CERTIFIED (720-Day Autonomous)</p>
            <p>TIER-1 HERITAGE COHORT ENROLLMENT: 10,000 / 10,000 SEATS COMMITTED</p>
            <p>POSTOJNA REPOSITORY HASH SYNC: 100% (SHA256)</p>
            <p>LITHOSPHERIC 14.8Hz CARRIER: 14.802 Hz (0.05% Drift toward 15.0Hz)</p>
            <p className="text-emerald-400">EXECUTIVE DIRECTIVE 01: PRE-ACTIVATION STANDBY</p>
          </div>
        );
        break;

      case 'exit':
        onClose();
        return;

      default:
        gpcAudio.playUiSound('deny');
        outputNode = (
          <p className="text-rose-400">
            Unknown command: "{trimmed}". Type <span className="text-cyan-300 font-bold">"help"</span> for manual.
          </p>
        );
        break;
    }

    setHistory((prev) => [...prev, { command: trimmed, output: outputNode }]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 select-none font-mono text-xs">
      <div
        className={`bg-[#05070c] border border-cyan-500/50 rounded-lg flex flex-col shadow-[0_0_60px_rgba(0,240,255,0.2)] overflow-hidden transition-all ${
          isFullscreen ? 'w-full h-full' : 'max-w-4xl w-full h-[600px] max-h-[90vh]'
        }`}
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#090d15] border-b border-[#1b273d]">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200 tracking-wider text-xs">
              GPC://TERMINAL_BACKDOOR // TTY-04 [PARADIGM-OS]
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setHistory([])}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
              title="Clear Terminal Output"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                gpcAudio.playUiSound('click');
                onClose();
              }}
              className="p-1 hover:bg-rose-900/60 text-slate-400 hover:text-white rounded ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Content Screen */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs bg-[#04060a] scrollbar-thin text-slate-300">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <span className="text-slate-500">gpc@terminal:~$</span>
                <span>{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Command Input Line */}
        <div className="p-3 bg-[#080c14] border-t border-[#182335] flex items-center gap-2">
          <span className="text-cyan-400 font-bold shrink-0">gpc@terminal:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleCommand(inputVal);
              }
            }}
            placeholder="Type 'help', 'seals', 'commune', 'cat DOC-2019-THORNE-NOTEBOOK'..."
            className="flex-1 bg-transparent border-none text-cyan-300 placeholder-slate-600 text-xs focus:outline-none font-mono"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
