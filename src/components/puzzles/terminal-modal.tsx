import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUp, Maximize2, Minimize2, Terminal as TerminalIcon, Trash2 } from 'lucide-react';
import {
  AUDIO_ARTIFACTS,
  DOCUMENTS,
  REGIONAL_STATIONS,
  TERMINAL_HELP,
  TERMINAL_LEAK_DUMP,
  TERMINAL_SCAN,
  TERMINAL_STATUS
} from '@/content';
import {
  COMMUNE_LINES,
  GEMATRIA_NOTES,
  type TerminalLine,
  type TerminalTone
} from '@/content/puzzles/terminal-text';
import {
  DEGREES,
  FRAGMENTS,
  MERCURY_CIPHERTEXT,
  SEALS,
  SEAL_FOR_RANK,
  getSeal
} from '@/content/puzzles/seals';
import { PUZZLE_SETTINGS } from '@/config/puzzles';
import { SITE } from '@/config/site';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { clearanceForTier, clearanceTier, shortClearance } from '@/lib/archive/clearance';
import { ordinalGematria, vigenereDecrypt } from '@/lib/puzzles/cipher';
import { useProgression } from '@/hooks/use-progression';
import { useInvestigation } from '@/hooks/use-investigation';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Modal } from '@/components/ui/modal';
import { ChoirGlyph } from '@/components/ui/sigils';
import { RedactedText } from '@/components/archive/redacted-text';
import { cn } from '@/lib/utils/cn';

const LS_PAGE_SIZE = 15;

/** The planchette spells its line one letter at a time (instantly under reduced motion). */
function Planchette({ text }: { text: string }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? text.length : 0);
  useEffect(() => {
    if (n >= text.length) return;
    const id = setTimeout(() => {
      setN((v) => v + 1);
      gpcAudio.playTone(180 + Math.random() * 60, 0.25, 'sine', 0.05);
    }, 260);
    return () => clearTimeout(id);
  }, [n, text.length]);
  return (
    <div className="space-y-1">
      <p className="text-fuchsia-400/70 text-caption tracking-widest">THE PLANCHETTE MOVES…</p>
      <p className="sr-only">{text}</p>
      <p className="font-occult text-lg tracking-[0.5em] text-fuchsia-200" aria-hidden>
        {text.slice(0, n)}
        {n < text.length && <span className="boot-caret">▮</span>}
      </p>
    </div>
  );
}

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
  /** Speaking the Name (seal VII) — the shell swaps this dialog for the finale. */
  onInvoke: () => void;
}

export function TerminalModal({ open, ...rest }: TerminalModalProps) {
  if (!open) return null;
  return <Terminal {...rest} />;
}

function Terminal({ onClose, onOpenDocument, onInvoke }: Omit<TerminalModalProps, 'open'>) {
  const progression = useProgression();
  const investigation = useInvestigation();
  const { state, setClearance, setUnredacted } = progression;
  const { clearance, unredacted, earnedLevel, descramblerUnlocked } = progression;
  const reducedMotion = useReducedMotion();
  const invokeTimer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (invokeTimer.current) window.clearTimeout(invokeTimer.current);
    },
    []
  );

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
            Type <span className="text-cyan-300 font-bold">"help"</span> for command index, or{' '}
            <span className="text-fuchsia-300 font-bold">"seals"</span> for the case file.
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
                  <dt className={cn('inline font-bold', h.order ? 'text-fuchsia-300' : 'text-cyan-300')}>
                    {h.cmd}
                  </dt>{' '}
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
              CLEARANCE: <span className="text-amber-400 font-bold">{clearance}</span> (EARNED: LEVEL{' '}
              {earnedLevel})
            </p>
            <p>
              DEGREE:{' '}
              <span className="text-fuchsia-300">
                {earnedLevel >= 3
                  ? DEGREES[clearanceTier(clearance)].toUpperCase()
                  : '████████ (requires Level 3)'}
              </span>
            </p>
            <p>
              SEALS BROKEN: <span className="text-fuchsia-300">{investigation.solved.length}/7</span>
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
        if (tier > earnedLevel) {
          gpcAudio.playUiSound('deny');
          return print(
            trimmed,
            <p className="text-rose-400">
              DENIED. Level {tier} has not been earned. Your degree ceiling is LEVEL {earnedLevel}. Break the
              next seal (type <span className="text-fuchsia-300">seals</span>).
            </p>
          );
        }
        setClearance(level);
        gpcAudio.playUiSound('grant');
        return print(trimmed, <p className="text-emerald-400">Clearance set to: {level.toUpperCase()}</p>);
      }

      case 'override':
        gpcAudio.playUiSound('deny');
        return print(
          arg ? `override ${'•'.repeat(Math.min(arg.length, 8))}` : trimmed,
          <div className="text-rose-300 space-y-1" role="status">
            <p className="font-bold">*** OVERRIDE REJECTED ***</p>
            <p>MASTER KEY 01 (DAME E. CROSS) — REVOKED 1989-11-04 05:14 UTC.</p>
            <p className="text-slate-400">
              Reason on file: "The Order does not open for keys. It opens for voices."
            </p>
            <p className="text-fuchsia-300">
              Clearance is earned through the Seven Seals. Type <span className="font-bold">seals</span>.
            </p>
          </div>
        );

      case 'hint': {
        const id = investigation.currentSeal;
        if (!id) {
          return print(
            trimmed,
            <p className="text-slate-400">No seal is waiting. Thorne has nothing more to say.</p>
          );
        }
        const seal = getSeal(id);
        const tier = investigation.hintsRevealed[id] ?? 0;
        const last = seal.hints.length - 1;
        if (tier > last) {
          return print(
            trimmed,
            <p className="text-amber-400">
              SEAL {seal.numeral} — III.: {seal.hints[last]}
            </p>
          );
        }
        if (tier === last && arg.toLowerCase() !== 'confirm') {
          return print(
            trimmed,
            <p className="text-slate-400">
              The next hint gives the answer and marks Seal {seal.numeral} as assisted. Type{' '}
              <span className="text-cyan-300">hint confirm</span> to continue.
            </p>
          );
        }
        investigation.revealHint(id);
        return print(
          trimmed,
          <p className={tier === last ? 'text-amber-400' : 'text-cyan-300'}>
            SEAL {seal.numeral} — {['I.', 'II.', 'III.'][tier]}: {seal.hints[tier]}
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
            <p>SEALS BROKEN: {investigation.solved.length}/7</p>
            <p>
              CHOIR FRAGMENTS: {investigation.fragments.length}/{FRAGMENTS.length}
            </p>
            <p className="text-slate-500">
              Progress is stored in this browser only. Reset it from the Archive Guide or purge the case in
              the Sanctum.
            </p>
          </div>
        );

      case 'decrypt':
      case 'unredact':
        if (!descramblerUnlocked) {
          gpcAudio.playUiSound('deny');
          return print(
            trimmed,
            <p className="text-rose-400">DE-SCRAMBLER LOCKED — requires LEVEL 3 ({SEAL_FOR_RANK[3]}).</p>
          );
        }
        setUnredacted(!state.access.unredacted);
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
        progression.milestone('terminal-scan');
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
        if (started) progression.milestone('audio-played');
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
        if (clearanceTier(doc.clearance) > clearanceTier(clearance)) {
          gpcAudio.playUiSound('deny');
          return print(
            trimmed,
            <p className="text-rose-400">
              {doc.code}: SEALED. Classified {doc.clearance}; you hold {clearance}. The wax holds.
            </p>
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
            <p className="text-slate-400">{unredacted ? doc.summary : <RedactedText text={doc.summary} />}</p>
            <div className="bg-panel p-2 rounded border border-slate-800 text-slate-300 whitespace-pre-line font-mono text-caption">
              {unredacted && doc.redactedContent ? doc.redactedContent : <RedactedText text={doc.content} />}
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

      case 'ls': {
        const [sub, pageArg] = arg.split(/\s+/);
        if (sub && sub !== 'docs') {
          return print(trimmed, <p className="text-slate-400">Usage: ls docs [page]</p>);
        }
        const pages = Math.max(1, Math.ceil(DOCUMENTS.length / LS_PAGE_SIZE));
        const page = Math.min(pages, Math.max(1, Number.parseInt(pageArg ?? '1', 10) || 1));
        const slice = DOCUMENTS.slice((page - 1) * LS_PAGE_SIZE, page * LS_PAGE_SIZE);
        return print(
          trimmed,
          <div className="space-y-1 text-label text-slate-300">
            <p className="text-cyan-400 font-bold">
              INDEXED REPOSITORY RECORDS — PAGE {page}/{pages}:
            </p>
            {slice.map((d) => {
              const sealed = clearanceTier(d.clearance) > clearanceTier(clearance);
              return (
                <div key={d.id} className={cn('flex justify-between gap-2', sealed && 'opacity-60')}>
                  <span className="text-cyan-300 font-mono">
                    {sealed ? '[SEALED] ' : ''}
                    {d.code}
                  </span>
                  <span className="truncate text-slate-400 max-w-[340px]">{d.title}</span>
                  <span className="text-caption text-slate-500">{shortClearance(d.clearance)}</span>
                </div>
              );
            })}
            <p className="text-slate-500 text-caption">
              {page < pages ? `Next page: ls docs ${page + 1}` : 'End of index.'} · Order records: search
              "Order" (press /)
            </p>
          </div>
        );
      }

      case 'seals':
        return print(
          trimmed,
          <div className="space-y-1 text-label">
            <p className="text-fuchsia-300 font-bold">THE SEVEN SEALS — ORDO VOCIS PROFUNDAE</p>
            {SEALS.map((sd) => {
              const done = investigation.isSolved(sd.id);
              const active = investigation.currentSeal === sd.id;
              return (
                <p
                  key={sd.id}
                  className={cn(
                    'whitespace-pre-wrap',
                    done ? 'text-slate-300' : active ? 'text-amber-300' : 'text-slate-500'
                  )}
                >
                  {sd.glyph + '\uFE0E'} {sd.numeral.padEnd(4, ' ')} {sd.title.padEnd(28, ' ')}{' '}
                  {done
                    ? `BROKEN · ${sd.sealWord}${investigation.isAssisted(sd.id) ? ' (assisted)' : ''}`
                    : active
                      ? '◀ ACTIVE'
                      : 'SEALED'}
                </p>
              );
            })}
            {investigation.currentSeal && (
              <p className="text-slate-400 pt-1">OBJECTIVE: {getSeal(investigation.currentSeal).objective}</p>
            )}
          </div>
        );

      case 'codex': {
        const known = [...investigation.knownLetters].sort();
        progression.milestone('terminal-codex');
        return print(
          trimmed,
          <div className="space-y-2 text-label">
            <p className="text-rose-300 font-bold">
              CHOIR SCRIPT CODEX — {known.length} GLYPHS KNOWN ({investigation.fragments.length}/
              {FRAGMENTS.length} FRAGMENTS)
            </p>
            {known.length === 0 ? (
              <p className="text-slate-500">
                You know no glyphs yet. The Order signs its public pages faintly.
              </p>
            ) : (
              <ul className="flex flex-wrap gap-2" aria-label="Known Choir Script glyphs">
                {known.map((l) => (
                  <li
                    key={l}
                    className="flex flex-col items-center border border-rose-900/50 rounded px-1 py-0.5"
                  >
                    <ChoirGlyph letter={l} size={22} color="#fb7185" />
                    <span className="font-occult text-rose-200">{l}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }

      case 'gematria': {
        if (!arg.trim()) {
          return print(
            trimmed,
            <p className="text-slate-400">Usage: gematria &lt;text&gt; (ordinal: A=1 … Z=26)</p>
          );
        }
        const v = ordinalGematria(arg);
        return print(
          trimmed,
          <p className="text-fuchsia-200">
            ORDINAL GEMATRIA of "{arg.toUpperCase()}" = <span className="font-bold text-white">{v}</span>
            {GEMATRIA_NOTES[v] && <span className="text-fuchsia-400/80"> — {GEMATRIA_NOTES[v]}</span>}
          </p>
        );
      }

      case 'wheel': {
        if (!arg.trim()) {
          return print(
            trimmed,
            <div className="text-label text-slate-300">
              <p>
                COURIER LINE: <span className="text-purple-300">{MERCURY_CIPHERTEXT}</span>
              </p>
              <p className="text-slate-500">Usage: wheel &lt;keyword&gt;</p>
            </div>
          );
        }
        const plain = vigenereDecrypt(MERCURY_CIPHERTEXT, arg);
        // The courier key is the Venus seal's answer; check it by digest.
        const ok = investigation.isCorrect(5, arg);
        if (ok) gpcAudio.playUiSound('grant');
        return print(
          trimmed,
          <p className={ok ? 'text-purple-200 font-bold' : 'text-slate-500'}>
            <span aria-hidden>{'☿\uFE0E'} </span>
            {plain}
          </p>
        );
      }

      case 'commune': {
        const idx = investigation.finaleComplete ? 7 : (investigation.currentSeal ?? 7) - 1;
        return print(trimmed, <Planchette text={COMMUNE_LINES[idx]} />);
      }

      case 'ordo':
      case 'vox':
        return print(
          trimmed,
          <div className="text-fuchsia-200 text-label space-y-1">
            <p className="font-occult tracking-widest">ORDO VOCIS PROFUNDAE</p>
            <p className="italic text-slate-400">
              "There is a Voice beneath the world. It speaks at fourteen and eight-tenths. We did not make it.
              We have heard it."
            </p>
            <p className="text-slate-500">— Liber Carrier, I. (DOC-1972-LIBER-CARRIER, Level 3)</p>
          </div>
        );

      case 'invoke': {
        const name = arg.trim();
        if (!name) return print(trimmed, <p className="text-slate-400">Usage: invoke &lt;name&gt;</p>);
        if (!investigation.isCorrect(7, name)) {
          gpcAudio.playUiSound('deny');
          return print(
            trimmed,
            <p className="text-slate-500 italic">
              You speak "{name.toUpperCase()}" into the carrier. 14.802 Hz. Nothing turns around.
            </p>
          );
        }
        if (!investigation.isSealOpen(7)) {
          gpcAudio.playUiSound('deny');
          return print(
            trimmed,
            <p className="text-fuchsia-300">
              The name leaves your mouth and goes nowhere. Six seals still bind the carrier. Nothing below can
              hear you yet.
            </p>
          );
        }
        if (investigation.finaleComplete) {
          return print(
            trimmed,
            <p className="text-slate-300 italic">
              You say his name. There is no answer. Only quiet — the good kind.
            </p>
          );
        }
        investigation.attemptSeal(7, name);
        gpcAudio.playUiSound('alarm');
        invokeTimer.current = window.setTimeout(onInvoke, reducedMotion ? 0 : 900);
        return print(trimmed, <p className="text-white font-bold">THE CARRIER FALTERS…</p>);
      }

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
        fullscreen ? 'max-w-none h-full max-h-none' : 'h-[80dvh] sm:h-[600px]'
      )}
      bodyClassName="flex flex-col"
    >
      <div
        className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-4 font-mono text-xs bg-void scrollbar-thin text-slate-300 break-words"
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-bold min-w-0">
              <span className="text-slate-500 shrink-0">
                <span className="hidden sm:inline">gpc@terminal:~</span>$
              </span>
              <span className="min-w-0 break-all">{item.command}</span>
            </div>
            <div className="pl-2 sm:pl-4">{item.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        className="p-2 sm:p-3 bg-shell border-t border-line flex items-center gap-2 shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        onSubmit={(e) => {
          e.preventDefault();
          run(inputVal);
        }}
      >
        <label htmlFor="gpc-terminal-input" className="text-cyan-400 font-bold shrink-0">
          <span className="hidden sm:inline">gpc@terminal:~</span>
          <span className="sm:hidden sr-only">Terminal command</span>
          <span aria-hidden>$</span>
        </label>
        <input
          id="gpc-terminal-input"
          ref={inputRef}
          type="text"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          enterKeyHint="send"
          inputMode="text"
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
          placeholder="Type 'help', 'scan', 'leak-dump'…"
          className="flex-1 min-w-0 bg-transparent border-none text-cyan-300 placeholder-slate-600 text-xs focus:outline-none font-mono"
        />

        {/* Touch devices have no ArrowUp and no visible Enter affordance. */}
        <button
          type="button"
          onClick={() => {
            if (!recall.list.length) return;
            const index = recall.index === -1 ? recall.list.length - 1 : Math.max(recall.index - 1, 0);
            setRecall((r) => ({ ...r, index }));
            setInputVal(recall.list[index]);
            inputRef.current?.focus();
          }}
          disabled={!recall.list.length}
          aria-label="Recall previous command"
          className="tap-target sm:hidden shrink-0 px-2 py-1.5 rounded border border-line-bright bg-hover text-slate-300 disabled:opacity-40"
        >
          <ArrowUp className="w-4 h-4" aria-hidden />
        </button>
        <button
          type="submit"
          aria-label="Run command"
          className="tap-target sm:hidden shrink-0 px-3 py-1.5 rounded border border-cyan-500/60 bg-cyan-950 text-cyan-300 text-label font-bold"
        >
          RUN
        </button>
      </form>
    </Modal>
  );
}
