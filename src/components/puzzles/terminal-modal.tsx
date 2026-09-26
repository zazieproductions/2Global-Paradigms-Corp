import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Maximize2, Minimize2, Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import {
  AUDIO_ARTIFACTS,
  DOCUMENTS,
  REGIONAL_STATIONS,
  TERMINAL_HELP,
  TERMINAL_LEAK_DUMP,
  TERMINAL_SCAN,
  TERMINAL_STATUS
} from '@/content';
import type { TerminalLine, TerminalTone } from '@/content/puzzles/terminal-text';
import { PUZZLE_SETTINGS } from '@/config/puzzles';
import { SITE } from '@/config/site';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { clearanceForTier, shortClearance } from '@/lib/archive/clearance';
import { getPuzzle, nextHint } from '@/lib/puzzles/validate';
import { hasEarnedClearance } from '@/lib/puzzles/progression';
import { useProgression } from '@/hooks/use-progression';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils/cn';

const PUZZLE_ID = 'terminal-override';
const LS_LIMIT = 15;

const TONE_CLASS: Record<TerminalTone, string> = {
  heading: 'text-cyan-400 font-bold',
  body: 'text-slate-300',
  muted: 'text-slate-400',
  warn: 'text-amber-400',
  ok: 'text-emerald-400',
  alert: 'text-rose-300',
  code: 'text-cyan-300'
};

function Lines({ lines }: { lines: TerminalLine[] }) {
  return (
    <div className="space-y-1">
      {lines.map((l, i) => (
        <p key={i} className={TONE_CLASS[l.tone ?? 'body']}>
          {l.code && (
            <>
              <span className="text-cyan-300">{l.code}</span> —{' '}
            </>
          )}
          {l.text}
        </p>
      ))}
    </div>
  );
}

interface Entry {
  id: number;
  command: string;
  output: ReactNode;
}

interface TerminalModalProps {
  open: boolean;
  onClose: () => void;
  onOpenDocument: (id: string) => void;
}

export function TerminalModal({ open, onClose, onOpenDocument }: TerminalModalProps) {
  if (!open) return null;
  return <Terminal onClose={onClose} onOpenDocument={onOpenDocument} />;
}

function Terminal({ onClose, onOpenDocument }: Omit<TerminalModalProps, 'open'>) {
  const progression = useProgression();
  const { state, attempt, setClearance, setUnredacted, revealHint } = progression;
  const { clearance, unredacted } = state.access;
  const reducedMotion = useReducedMotion();
  const puzzle = getPuzzle(PUZZLE_ID)!;

  const nextId = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputVal, setInputVal] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const [recall, setRecall] = useState<{ list: string[]; index: number }>({ list: [], index: -1 });
  const [history, setHistory] = useState<Entry[]>(() => [
    {
      id: 0,
      command: 'sys.init',
      output: (
        <div className="space-y-1 text-slate-400">
          <p className="text-cyan-400 font-bold">
            GLOBAL PARADIGMS CORP. // PARADIGM-OS [CLI TERMINAL {SITE.osVersion.split(' ')[1]}]
          </p>
          <p>POSTOJNA REPOSITORY ENCRYPTED LINK: ONLINE (SHA256: 0x7F4A...)</p>
          <p>
            AUTHENTICATED AS: {state.callsign.toUpperCase()} // {clearance.toUpperCase()}
          </p>
          <p className="text-amber-400">
            Type <span className="text-cyan-300 font-bold">"help"</span> for command index or{' '}
            <span className="text-cyan-300 font-bold">"override &lt;code&gt;"</span> for administrative
            bypass.
          </p>
        </div>
      )
    }
  ]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'end' });
  }, [history, reducedMotion]);

  const print = (command: string, output: ReactNode) =>
    setHistory((prev) => [...prev, { id: nextId.current++, command, output }]);

  const run = (raw: string) => {
    const trimmed = raw.trim().slice(0, 120);
    if (!trimmed) return;
    setRecall((r) => ({ list: [...r.list, trimmed].slice(-50), index: -1 }));
    setInputVal('');
    gpcAudio.playUiSound('keystroke');

    const [head, ...rest] = trimmed.split(/\s+/);
    const cmd = head.toLowerCase();
    const arg = rest.join(' ');

    switch (cmd) {
      case 'help':
        return print(
          trimmed,
          <div className="space-y-1.5 text-slate-300">
            <p className="text-cyan-400 font-bold">AVAILABLE COMMANDS:</p>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-label">
              {TERMINAL_HELP.map((h) => (
                <div key={h.cmd}>
                  <dt className="inline text-cyan-300 font-bold">{h.cmd}</dt>{' '}
                  <dd className="inline">— {h.desc}</dd>
                </div>
              ))}
            </dl>
          </div>
        );

      case 'clear':
        setHistory([]);
        return;

      case 'whoami':
        return print(
          trimmed,
          <div className="text-slate-300">
            <p>USER: {state.callsign.toUpperCase()}</p>
            <p>SESSION ORIGIN: COLD BOOT TERMINAL // CH9</p>
            <p>
              CLEARANCE: <span className="text-amber-400 font-bold">{clearance}</span>
            </p>
            <p>
              REDACTION DE-SCRAMBLER:{' '}
              {unredacted ? (
                <span className="text-rose-400 font-bold">ACTIVE (UNREDACTED)</span>
              ) : (
                <span className="text-slate-400">INACTIVE</span>
              )}
            </p>
            <p>NODE CONNECTION: London Tower Obsidian Proxy // Session Encrypted</p>
          </div>
        );

      case 'clearance': {
        const tier = Number.parseInt(arg, 10);
        const level = clearanceForTier(tier);
        if (!level) {
          gpcAudio.playUiSound('deny');
          return print(trimmed, <p className="text-rose-400">Usage: clearance &lt;1-5&gt;</p>);
        }
        if (tier === 5 && !hasEarnedClearance(state, level)) {
          gpcAudio.playUiSound('deny');
          return print(
            trimmed,
            <p className="text-rose-400">
              LEVEL 5 REQUIRES EXECUTIVE AUTHORITY. Usage: override &lt;code&gt;
            </p>
          );
        }
        setClearance(level);
        gpcAudio.playUiSound('grant');
        const tone = [
          'text-emerald-400',
          'text-blue-400',
          'text-cyan-400',
          'text-amber-400',
          'text-rose-400 font-bold'
        ][tier - 1];
        return print(trimmed, <p className={tone}>Clearance adjusted to: {level.toUpperCase()}</p>);
      }

      case 'override': {
        const result = attempt(PUZZLE_ID, arg);
        if (result.ok) {
          gpcAudio.playUiSound('grant');
          return print(
            `override ${'•'.repeat(Math.min(arg.length, 8))}`,
            <div className="text-rose-300 font-bold space-y-1" role="status">
              <p>{puzzle.success.heading}</p>
              <p>{puzzle.success.body}</p>
              <p>SECURITY LEVEL ELEVATED: LEVEL 5 - BLACK DOSSIER</p>
              <p>REDACTION DE-SCRAMBLER: FORCED ON</p>
              <p className="text-slate-300">
                All {DOCUMENTS.length} historical dossiers, casualty settlement files, and unredacted Svalbard
                telemetry records are now fully decrypted.
              </p>
            </div>
          );
        }
        gpcAudio.playUiSound('deny');
        return print(
          arg ? `override ${'•'.repeat(Math.min(arg.length, 8))}` : trimmed,
          <p className="text-rose-400">
            {arg
              ? 'INVALID OVERRIDE CODE. ATTEMPT LOGGED TO TOPN SECURITY.'
              : 'Usage: override <code>. Type "hint" if you are stuck.'}
          </p>
        );
      }

      case 'hint': {
        const tier = state.hintsRevealed[PUZZLE_ID] ?? 0;
        const next = nextHint(puzzle, tier);
        if (!next) {
          const last = puzzle.hints[puzzle.hints.length - 1];
          return print(
            trimmed,
            <p className="text-amber-400">
              {last.label}: {last.text}
            </p>
          );
        }
        if (next.revealsAnswer && arg.toLowerCase() !== 'confirm') {
          return print(
            trimmed,
            <p className="text-slate-400">
              The next hint gives the answer and marks this override as assisted. Type{' '}
              <span className="text-cyan-300">hint confirm</span> to continue.
            </p>
          );
        }
        revealHint(PUZZLE_ID, next.tier);
        return print(
          trimmed,
          <p className={next.revealsAnswer ? 'text-amber-400' : 'text-cyan-300'}>
            {next.label}: {next.text}
          </p>
        );
      }

      case 'progress':
        return print(
          trimmed,
          <div className="text-slate-300 space-y-0.5">
            <p className="text-cyan-400 font-bold">=== INVESTIGATION PROGRESS ===</p>
            <p>RECORDS OPENED: {progression.discoveredCount}</p>
            <p>
              PUZZLES SOLVED: {progression.completedCount} ({progression.assistedCount} assisted)
            </p>
            <p className="text-slate-500">
              Progress is stored in this browser only. Reset it from the Archive Guide.
            </p>
          </div>
        );

      case 'decrypt':
      case 'unredact':
        setUnredacted(!unredacted);
        gpcAudio.playUiSound('unredact');
        return print(
          trimmed,
          <p className="text-cyan-300">
            Redaction de-scrambler toggled:{' '}
            <span className="font-bold">
              {!unredacted ? 'ENABLED (Cleartext Revealed)' : 'DISABLED (Redactions Re-Applied)'}
            </span>
          </p>
        );

      case 'scan':
        gpcAudio.playUiSound('scan');
        return print(trimmed, <Lines lines={TERMINAL_SCAN} />);

      case 'play': {
        const idx = Number.parseInt(arg, 10);
        const artifact = AUDIO_ARTIFACTS[idx - 1];
        if (!artifact) {
          return print(
            trimmed,
            <p className="text-slate-400">Usage: play &lt;1-{AUDIO_ARTIFACTS.length}&gt; (e.g. "play 1")</p>
          );
        }
        const started = gpcAudio.playArtifact(artifact.synthesisPreset, artifact.id);
        return print(
          trimmed,
          started ? (
            <div className="space-y-1">
              <p className="text-cyan-300">Now playing: {artifact.title}...</p>
              <p className="text-slate-500">
                Text transcript for {artifact.code}: see Acoustic Artifacts &amp; Synth.
              </p>
            </div>
          ) : (
            <p className="text-amber-400">
              Audio output unavailable in this browser. Transcript available in Acoustic Artifacts.
            </p>
          )
        );
      }

      case 'stop':
        gpcAudio.stopAll();
        gpcAudio.playUiSound('click');
        return print(trimmed, <p className="text-slate-400">All audio streams terminated.</p>);

      case 'leak-dump':
        return print(trimmed, <Lines lines={TERMINAL_LEAK_DUMP} />);

      case 'cat': {
        const q = arg.toLowerCase();
        const doc = q
          ? (DOCUMENTS.find((d) => d.code.toLowerCase() === q || d.id.toLowerCase() === q) ??
            DOCUMENTS.find((d) => d.title.toLowerCase().includes(q)))
          : undefined;
        if (!doc) {
          gpcAudio.playUiSound('deny');
          return print(
            trimmed,
            <p className="text-rose-400">Error: Document "{arg}" not found in local index.</p>
          );
        }
        gpcAudio.playUiSound('print');
        progression.discover(doc.id);
        return print(
          trimmed,
          <div className="bg-canvas p-3 border border-slate-700 rounded text-slate-200 space-y-2 text-label">
            <div className="flex justify-between gap-2 border-b border-slate-700 pb-1 text-caption">
              <span className="text-cyan-400 font-bold">{doc.code}</span>
              <span className="text-amber-400">{doc.classificationStamp}</span>
            </div>
            <h4 className="font-bold text-white">{doc.title}</h4>
            <p className="text-slate-400">{doc.summary}</p>
            <div className="bg-panel p-2 rounded border border-slate-800 text-slate-300 whitespace-pre-line font-mono text-caption">
              {unredacted && doc.redactedContent ? doc.redactedContent : doc.content}
            </div>
            <button
              type="button"
              onClick={() => onOpenDocument(doc.id)}
              className="text-caption text-cyan-400 hover:text-cyan-300 underline"
            >
              Open in dossier viewer
            </button>
          </div>
        );
      }

      case 'ls':
        if (arg && arg !== 'docs') return print(trimmed, <p className="text-slate-400">Usage: ls docs</p>);
        return print(
          trimmed,
          <div className="space-y-1 text-label text-slate-300">
            <p className="text-cyan-400 font-bold">INDEXED REPOSITORY RECORDS (Top {LS_LIMIT} shown):</p>
            {DOCUMENTS.slice(0, LS_LIMIT).map((d) => (
              <div key={d.id} className="flex justify-between gap-2">
                <span className="text-cyan-300 font-mono">{d.code}</span>
                <span className="truncate text-slate-400 max-w-[340px]">{d.title}</span>
                <span className="text-caption text-slate-500">{shortClearance(d.clearance)}</span>
              </div>
            ))}
            <p className="text-slate-500 text-caption">
              ...and {DOCUMENTS.length - LS_LIMIT} more records in database.
            </p>
          </div>
        );

      case 'status':
        return print(trimmed, <Lines lines={TERMINAL_STATUS(REGIONAL_STATIONS.length)} />);

      case 'exit':
        onClose();
        return;

      default:
        gpcAudio.playUiSound('deny');
        return print(
          trimmed,
          <p className="text-rose-400">
            Unknown command: "{trimmed}". Type <span className="text-cyan-300 font-bold">"help"</span> for
            manual.
          </p>
        );
    }
  };

  const headerActions = (
    <>
      <button
        type="button"
        onClick={() => setHistory([])}
        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
        title="Clear Terminal Output"
        aria-label="Clear terminal output"
      >
        <Trash2 className="w-3.5 h-3.5" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => setFullscreen((v) => !v)}
        className="hidden sm:block p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
        title="Toggle Fullscreen"
        aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        aria-pressed={fullscreen}
      >
        {fullscreen ? (
          <Minimize2 className="w-3.5 h-3.5" aria-hidden />
        ) : (
          <Maximize2 className="w-3.5 h-3.5" aria-hidden />
        )}
      </button>
    </>
  );

  return (
    <Modal
      open
      onClose={onClose}
      variant="window"
      size="4xl"
      icon={TerminalIcon}
      title={
        <span className="text-slate-200 tracking-wider text-xs">
          GPC://TERMINAL_BACKDOOR // TTY-04 [PARADIGM-OS]
        </span>
      }
      headerActions={headerActions}
      initialFocusRef={inputRef}
      className={cn(
        'bg-void border-cyan-500/50 transition-all',
        fullscreen ? 'max-w-none h-full max-h-none' : 'h-[600px]'
      )}
      bodyClassName="flex flex-col"
    >
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs bg-void scrollbar-thin text-slate-300"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="text-slate-500">gpc@terminal:~$</span>
              <span>{item.command}</span>
            </div>
            <div className="pl-4">{item.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        className="p-3 bg-shell border-t border-line flex items-center gap-2 shrink-0"
        onSubmit={(e) => {
          e.preventDefault();
          run(inputVal);
        }}
      >
        <label htmlFor="gpc-terminal-input" className="text-cyan-400 font-bold shrink-0">
          gpc@terminal:~$
        </label>
        <input
          id="gpc-terminal-input"
          ref={inputRef}
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={PUZZLE_SETTINGS.maxInputLength * 4}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp' && recall.list.length) {
              e.preventDefault();
              const index = recall.index === -1 ? recall.list.length - 1 : Math.max(recall.index - 1, 0);
              setRecall((r) => ({ ...r, index }));
              setInputVal(recall.list[index]);
            } else if (e.key === 'ArrowDown' && recall.index !== -1) {
              e.preventDefault();
              const index = recall.index + 1;
              if (index >= recall.list.length) {
                setRecall((r) => ({ ...r, index: -1 }));
                setInputVal('');
              } else {
                setRecall((r) => ({ ...r, index }));
                setInputVal(recall.list[index]);
              }
            }
          }}
          placeholder="Type 'help', 'scan', 'leak-dump', or 'cat DOC-2019-PALIMPSEST-LEAK'..."
          className="flex-1 min-w-0 bg-transparent border-none text-cyan-300 placeholder-slate-600 text-xs focus:outline-none font-mono"
        />
      </form>
    </Modal>
  );
}
