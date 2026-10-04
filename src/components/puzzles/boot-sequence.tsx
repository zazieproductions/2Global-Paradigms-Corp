import { useState, useEffect, useRef, useCallback } from 'react';
import { DOCUMENTS, REGIONAL_STATIONS } from '@/content';
import { SITE } from '@/config/site';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { REVOKED_CODES } from '@/config/puzzles';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useInvestigation } from '@/hooks/use-investigation';
import { OrderSigil } from '@/components/ui/sigils';

// ============================================================================
// GPC COLD BOOT TERMINAL — interactive boot / loading sequence
// ----------------------------------------------------------------------------
//   * CRT power-on → BIOS-style POST → staged boot log with progress bars
//   * Scramble-in corporate title, random signal glitches, intercepted packets
//   * LIVE hidden "Channel 9" command line — type while the boot runs:
//       help / skip / vesper / thorne / carrier / palimpsest / ordo / seals /
//       orpheus / gateway / caller
//   * Operator callsign prompt — your name is carried into the whole session
//   * Legacy executive override codes are REVOKED in-world — clearance is
//     earned through the Seven Seals (nothing typed here grants access)
//   * ESC or the SKIP button fast-forwards; CRT power-off wipe into the archive
//   * Channel 9 also has a real input so touch devices can transmit
// ============================================================================

interface BootSequenceProps {
  /** Called after the power-off wipe with the operator's callsign. */
  onComplete: (callsign: string) => void;
}

const LEVEL_NAMES = ['', 'GENERAL', 'CONFIDENTIAL', 'SECRET', 'TOP SECRET', 'BLACK DOSSIER'];

type Tone = 'dim' | 'info' | 'ok' | 'warn' | 'err' | 'accent' | 'secret' | 'cmd';

interface LogLine {
  id: number;
  text: string;
  tone: Tone;
  shown: number;
}

type Phase = 'power' | 'boot' | 'callsign' | 'granted' | 'exit';

const SCRAMBLE_CHARS = '█▓▒░#%&@$?01ABCDEF';

const DEFAULT_CALLSIGN = SITE.defaultCallsign;
const CH9_MAX = 32;

/** Plain-text directives recognised on Channel 9 (revoked codes are matched separately). */
const SECRET_COMMANDS = [
  'help',
  'skip',
  'abort',
  'vesper',
  'thorne',
  'carrier',
  '14.8',
  'palimpsest',
  'ordo',
  'orpheus',
  'seals',
  'gateway',
  'transmission',
  'caller'
];

const TONE_CLASS: Record<Tone, string> = {
  dim: 'text-slate-500',
  info: 'text-slate-300',
  ok: 'text-emerald-400',
  warn: 'text-amber-400',
  err: 'text-rose-500',
  accent: 'text-cyan-300',
  secret: 'text-fuchsia-400',
  cmd: 'text-cyan-400 font-bold'
};

const hexChunk = (len: number) =>
  Array.from({ length: len }, () => '0123456789ABCDEF'[(Math.random() * 16) | 0]).join('');

/** Left-to-right scramble reveal for the corporate title. */
function useScramble(target: string, active: boolean, duration = 950): string {
  const [out, setOut] = useState(() => target.replace(/[^\s]/g, ' '));

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(p * target.length);
      let s = '';
      for (let i = 0; i < target.length; i++) {
        if (target[i] === ' ') s += ' ';
        else if (i < reveal) s += target[i];
        else s += SCRAMBLE_CHARS[(Math.random() * SCRAMBLE_CHARS.length) | 0];
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setOut(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return out;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const reducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('power');
  const [lines, setLines] = useState<LogLine[]>([]);
  const [progress, setProgress] = useState(0);
  const [barLabel, setBarLabel] = useState('INITIALIZING');
  const [barStarted, setBarStarted] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [channelBuf, setChannelBuf] = useState('');
  const [callsignVal, setCallsignVal] = useState('');
  const [hexRain, setHexRain] = useState<string[]>(() => Array.from({ length: 26 }, () => hexChunk(8)));
  const [clock, setClock] = useState(() => new Date().toUTCString().replace('GMT', 'UTC'));
  const [uplink, setUplink] = useState(87);
  const [sessionId] = useState(() => `${hexChunk(4)}-${hexChunk(4)}`);
  const [grantedOperator, setGrantedOperator] = useState<string>(DEFAULT_CALLSIGN);
  const investigation = useInvestigation();

  // --- engine refs -----------------------------------------------------------
  // Token system: each mount of the effect claims a token; cleanup invalidates
  // it so StrictMode's double-mount can never run two scripts at once.
  const runTokenRef = useRef(0);
  const skipRef = useRef(false);
  const idRef = useRef(0);
  const bufRef = useRef('');
  const callsignResolveRef = useRef<((v: string) => void) | null>(null);
  // Read inside the (memoised) Channel 9 handler without re-creating it.
  const caseRef = useRef({ solved: 0, earned: 1 });
  useEffect(() => {
    caseRef.current = { solved: investigation.solved.length, earned: investigation.earnedLevel };
  }, [investigation.solved.length, investigation.earnedLevel]);
  const callsignRef = useRef<string>(DEFAULT_CALLSIGN);
  const phaseRef = useRef<Phase>('power');
  const progressRef = useRef(0);
  const lastSfxRef = useRef(0);
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const title = useScramble('GLOBAL PARADIGMS CORP.', phase !== 'power');
  const subtitle = useScramble(
    'STRATEGIC FORECASTING // CIVIC CONTINUITY // EST. 1971',
    phase !== 'power',
    1300
  );

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // --- shared helpers --------------------------------------------------------
  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, skipRef.current ? Math.min(ms, 8) : ms);
    });

  const setProg = (v: number) => {
    progressRef.current = v;
    setProgress(v);
  };

  const sfx = (type: Parameters<typeof gpcAudio.playUiSound>[0], throttleMs = 0) => {
    const now = performance.now();
    if (throttleMs && now - lastSfxRef.current < throttleMs) return;
    lastSfxRef.current = now;
    gpcAudio.playUiSound(type);
  };

  const triggerGlitch = useCallback((ms = 220) => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), ms);
  }, []);

  const patchLine = (id: number, patch: Partial<LogLine>) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const addLine = (text: string, tone: Tone, typing = false): number => {
    const id = ++idRef.current;
    setLines((prev) => [...prev, { id, text, tone, shown: typing && !skipRef.current ? 0 : text.length }]);
    return id;
  };

  const showFlash = (text: string) => {
    setFlash(text);
    triggerGlitch(260);
    setTimeout(() => setFlash((cur) => (cur === text ? null : cur)), 1700);
  };

  // --- hidden "Channel 9" commands ------------------------------------------
  const runSecret = useCallback(
    (raw: string) => {
      const cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      if (REVOKED_CODES.includes(cmd)) {
        addLine(`ch9> ${'•'.repeat(Math.min(cmd.length, 8))}`, 'cmd');
        sfx('alarm');
        triggerGlitch(420);
        addLine('*** EXECUTIVE OVERRIDE REJECTED ***', 'err');
        addLine('MASTER KEY 01 (D. CROSS) REVOKED 1989-11-04 05:14 UTC', 'err');
        addLine('"THE ORDER DOES NOT OPEN FOR KEYS. IT OPENS FOR VOICES."', 'secret');
        addLine('CLEARANCE IS EARNED. SEVEN SEALS. BEGIN WITH SATURN.', 'secret');
        return;
      }
      addLine(`ch9> ${raw.trim()}`, 'cmd');

      switch (cmd) {
        case 'help':
          sfx('scan');
          addLine('CHANNEL 9 COMMAND INDEX:', 'accent');
          addLine('  help .............. this list', 'dim');
          addLine('  skip | abort ...... fast-forward boot sequence', 'dim');
          addLine('  vesper ............ Project Vesper intercept fragment', 'dim');
          addLine('  thorne ............ A. Thorne exfil log fragment', 'dim');
          addLine('  carrier ........... planetary 14.802 Hz telemetry', 'dim');
          addLine('  palimpsest ........ Project Palimpsest burst decode', 'dim');
          addLine('  gateway ........... buffered Gateway Transmission intercept', 'dim');
          addLine('  seals ............. status of the seven seals', 'secret');
          addLine('  <exec code> ....... executive override (REVOKED)', 'warn');
          break;

        case 'skip':
        case 'abort':
          sfx('deny');
          addLine('MANUAL OVERRIDE — COMPRESSING BOOT SEQUENCE...', 'warn');
          skipRef.current = true;
          if (phaseRef.current === 'callsign' && callsignResolveRef.current) {
            const resolve = callsignResolveRef.current;
            callsignResolveRef.current = null;
            resolve(callsignVal.trim() || DEFAULT_CALLSIGN);
          }
          break;

        case 'vesper':
          sfx('unredact');
          addLine('PROJECT VESPER // MUNICIPAL CHIME TEST 9 — INTERCEPT', 'secret');
          addLine('4,112 VOLUNTEERS REPORTED "HEARING TOMORROW" FOR 72 HRS.', 'secret');
          addLine('TRANSCRIPT REDACTED BY ORDER OF D. CROSS — NODE 9 LEAKED 1/4', 'warn');
          break;

        case 'thorne':
          sfx('unredact');
          addLine('E. THORNE EXFIL LOG — 2019-10-14 03:41 UTC', 'secret');
          addLine('"if you are reading this, the carrier is already past 14.9."', 'secret');
          addLine('48GB BOREHOLE 4 DUMP MIRRORED TO 3 DEAD DROPS.', 'warn');
          break;

        case 'carrier':
        case '14.8':
          sfx('scan');
          addLine('PLANETARY CARRIER: 14.802 Hz — DRIFT 0.05%/YR TOWARD 15.000', 'accent');
          addLine('RESONANT WINDOW OPENS: 2026-11-04 04:32 UTC — STATIONS WARNED', 'warn');
          break;

        case 'palimpsest':
          sfx('unredact');
          addLine('PALIMPSEST TELEMETRY BURST — DECODED STUB:', 'secret');
          addLine('>> THEY BUILT THE ARCHIVE TO REMEMBER. IT LEARNED TO PREDICT.', 'secret');
          break;

        case 'gateway':
        case 'transmission':
          sfx('unredact');
          addLine('GATEWAY TRANSMISSION — BUFFERED INTERCEPT READY.', 'secret');
          addLine('A SIX-VOICE SIGNAL WANTS TO BE TAPPED IN THE RIGHT ORDER.', 'secret');
          addLine('OPEN IT VIA THE ✦ TRANSMISSION BUTTON AFTER THE BOOT, OR SEND "CALLER".', 'dim');
          break;

        case 'caller':
          sfx('scan');
          addLine('CALLER-ID: UNKNOWN // CH9 // SHARED NIGHTMARE RELAY', 'secret');
          addLine('THREE TASKS BEFORE THE GATE: SEQUENCE → SIGNAL → WAVEFORM.', 'warn');
          break;

        case 'ordo':
          sfx('unredact');
          triggerGlitch(260);
          addLine('ORDO VOCIS PROFUNDAE — CHAPTER ROLL INTERCEPT', 'secret');
          addLine('♄ NEOPHYTE  ♃ ZELATOR  ♂ PRACTICUS  ☉ PHILOSOPHUS  ☿ MAGISTER UMBRAE', 'secret');
          addLine('THE COMPANY IS THE OUTER COURT. — LIBER CARRIER II', 'dim');
          break;

        case 'seals':
          sfx('scan');
          addLine(
            `SEALS BROKEN: ${caseRef.current.solved}/7 // EARNED CLEARANCE: LEVEL ${caseRef.current.earned}`,
            'secret'
          );
          break;

        case 'orpheus':
          sfx('deny');
          triggerGlitch(600);
          addLine('…', 'secret');
          addLine('NOT HERE. NOT YET. HE CANNOT HEAR YOU THROUGH SEVEN SEALS.', 'err');
          break;

        default:
          if (cmd.length >= 3) {
            sfx('deny');
            addLine(`UNKNOWN DIRECTIVE "${raw.trim()}". ATTEMPT LOGGED TO TOPN SECURITY.`, 'err');
          }
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callsignVal]
  );

  // --- the boot script -------------------------------------------------------
  const runBoot = useCallback(async (token: number) => {
    const dead = () => runTokenRef.current !== token;
    // Thrown between steps so a replaced (unmounted) run stops instantly.
    const DIE = 'BOOT_RUN_REPLACED';
    const guard = async (ms: number) => {
      await sleep(ms);
      if (dead()) throw new Error(DIE);
    };

    const typeLine = async (text: string, tone: Tone, opts?: { instant?: boolean; gap?: number }) => {
      if (dead()) throw new Error(DIE);
      const typing = !opts?.instant && !skipRef.current;
      const id = addLine(text, tone, typing);
      sfx('keystroke', 90);

      if (!typing) {
        await sleep(opts?.gap ?? 55);
        if (dead()) throw new Error(DIE);
        return;
      }
      // ~2.4ms per character, updating in chunks to keep renders cheap
      for (let i = 5; i <= text.length + 4; i += 5) {
        if (dead()) throw new Error(DIE);
        if (skipRef.current) {
          patchLine(id, { shown: text.length });
          return;
        }
        patchLine(id, { shown: Math.min(i, text.length) });
        await sleep(12);
      }
      await sleep(opts?.gap ?? 85);
      if (dead()) throw new Error(DIE);
    };

    const animBar = async (to: number, label: string, ms: number) => {
      setBarStarted(true);
      setBarLabel(label);
      const from = progressRef.current;
      const steps = Math.max(1, Math.round(ms / 45));
      for (let i = 1; i <= steps; i++) {
        if (dead()) throw new Error(DIE);
        setProg(Math.round(from + (to - from) * (i / steps)));
        await sleep(ms / steps);
      }
    };

    try {
      await guard(560);
      setPhase('boot');
      sfx('scan', 0);

      await typeLine('PARADIGM-OS BOOTLOADER v8.4.2 // (C) 1971-2026 GLOBAL PARADIGMS CORP.', 'accent');
      await typeLine('VESPER-M7 SECURE PROC @ 14.802 MHz // TTY-04 POSTOJNA VAULT', 'dim', {
        instant: true
      });

      // Animated memory count
      const memId = addLine('MEMORY TEST . . . . . . . 0 KB', 'dim');
      for (let kb = 0; kb <= 65536; kb += 4096) {
        if (dead()) throw new Error(DIE);
        const done = kb === 65536;
        const memText = `MEMORY TEST . . . . . . . ${String(kb).padEnd(6)} KB ${done ? '— OK' : ''}`;
        setLines((prev) =>
          prev.map((l) => (l.id === memId ? { ...l, text: memText, shown: memText.length } : l))
        );
        await sleep(36);
      }
      sfx('grant', 300);
      await typeLine('ROM CHECKSUM: THORNE-CRYPTO REV.4 . . . . . . . . . SEALED', 'ok', {
        instant: true
      });

      await animBar(16, 'MOUNTING /dev/vault0 → POSTOJNA REPOSITORY', 480);
      await typeLine(`VOLUME VAULT0 MOUNTED — ${DOCUMENTS.length} RECORDS INDEXED`, 'ok');
      await typeLine('SHA-256 INDEX 0x7F4A...B21C VERIFIED', 'ok', { instant: true });
      await typeLine('HANDSHAKE: LONDON TOWER // OBSIDIAN PROXY . . . . . ONLINE', 'ok');

      await animBar(34, 'UPLINKING FIELD STATION TELEMETRY', 450);
      await typeLine('STATION 07 SVALBARD: 14.802 Hz @ 94.2 dB', 'info', { instant: true });
      await typeLine('!! CARRIER SURGE +18.4% — DRIFT TOWARD 15.000 Hz — LOGGED', 'warn');

      await guard(200);
      showFlash('ANOMALOUS PACKET CH-9: "DO NOT TRUST THE ARCHIVE"');
      sfx('deny', 400);
      await guard(950);
      await typeLine('PACKET DISCARDED — SOURCE UNTRACEABLE', 'dim', { instant: true });

      await animBar(58, 'VERIFYING CLEARANCE CRYPTOSYSTEM', 460);
      await typeLine('CHECKSUM VERIFICATION . . . . . . . . . . . . . . . . FAILED', 'err');
      sfx('deny', 250);
      await guard(380);
      triggerGlitch(300);
      await typeLine('FALLBACK KEY 01 . . . . . . . . . . . . . . . . . . . REVOKED', 'err');
      await typeLine('LITURGICAL KEY ♄♃♂☉♀☿☽ . . . . . . . . . . . . . . . . . OK', 'secret');

      await guard(240);
      triggerGlitch(160);
      await typeLine('·-·-· SIGNAL ACQUIRED — UNTRUSTED CARRIER BUFFERED FOR OPERATOR', 'secret', {
        instant: true
      });
      addLine('CH9 // "GATEWAY TRANSMISSION" — REPLAY FROM THE TOP BAR AFTER INIT', 'dim');

      await animBar(
        74,
        `BINDING ${REGIONAL_STATIONS.length} / ${REGIONAL_STATIONS.length} FIELD STATIONS`,
        460
      );
      await typeLine('AETHELGARD REDOUBTS: 14 CERTIFIED // 720-DAY AUTONOMOUS', 'info', {
        instant: true
      });
      await typeLine('TIER-1 HERITAGE COHORT: 10,000 / 10,000 SEATS COMMITTED', 'info', {
        instant: true
      });
      await typeLine('EXECUTIVE DIRECTIVE 01: PRE-ACTIVATION STANDBY', 'warn', { gap: 60 });

      await typeLine('ROOT ACCESS REQUIRED — IDENTIFY OPERATOR TO CONTINUE.', 'accent', {
        gap: 40
      });

      // ---- interactive callsign prompt ----
      setPhase('callsign');
      const entered = skipRef.current
        ? '' // boot was already fast-forwarded — don't block on the prompt
        : await new Promise<string>((resolve) => {
            callsignResolveRef.current = resolve;
          });
      if (dead()) throw new Error(DIE);
      const operator = (entered || '').trim().slice(0, 24) || DEFAULT_CALLSIGN;
      callsignRef.current = operator;
      setGrantedOperator(operator);

      await typeLine(`AUTHENTICATING OPERATOR: ${operator.toUpperCase()} . . . . . . . OK`, 'accent');
      await typeLine('CLEARANCE PROVISIONAL: LEVEL 2 — CONFIDENTIAL', 'ok', { instant: true });
      await typeLine('SESSION LOGGED // TOPN MONITORING ACTIVE', 'warn', { instant: true });

      await animBar(92, 'BINDING BIOMETRIC GHOST PRINT', 380);
      await animBar(100, 'ARCHIVE MOUNT COMPLETE', 340);
      await typeLine('ARCHIVE READY — AWAITING OPERATOR ACKNOWLEDGEMENT.', 'accent', { gap: 50 });

      await guard(300);
      triggerGlitch(320);
      setPhase('granted');
      sfx('grant');
    } catch (err) {
      if ((err as Error).message !== DIE) throw err;
      // run was replaced by StrictMode remount — stop silently
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- lifecycle -------------------------------------------------------------
  useEffect(() => {
    const token = ++runTokenRef.current;
    skipRef.current = false;
    runBoot(token);
    return () => {
      // Intentionally invalidates the token — this is not a DOM node ref.
      runTokenRef.current = token + 1;
      callsignResolveRef.current?.('');
      callsignResolveRef.current = null;
    };
  }, [runBoot]);

  // HUD clock + uplink jitter
  useEffect(() => {
    const id = setInterval(() => {
      setClock(new Date().toUTCString().replace('GMT', 'UTC'));
      setUplink(82 + Math.floor(Math.random() * 18));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Background hex packet rain
  useEffect(() => {
    if (phase === 'exit' || reducedMotion) return;
    const id = setInterval(() => {
      setHexRain((prev) => [...prev.slice(1), hexChunk(8)]);
    }, 95);
    return () => clearInterval(id);
  }, [phase, reducedMotion]);

  // Random micro-glitches while booting
  useEffect(() => {
    if (phase !== 'boot' || reducedMotion) return;
    const id = setInterval(() => {
      if (Math.random() < 0.55) triggerGlitch(90 + Math.random() * 140);
    }, 3100);
    return () => clearInterval(id);
  }, [phase, triggerGlitch, reducedMotion]);

  // Keep the tail of the log in view
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ block: 'end' });
  }, [lines, progress, phase]);

  // Autofocus the callsign prompt
  useEffect(() => {
    if (phase === 'callsign') {
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [phase]);

  const finish = useCallback(() => {
    if (phaseRef.current === 'exit') return;
    setPhase('exit');
    gpcAudio.playUiSound('unredact');
    setTimeout(() => onComplete(callsignRef.current), 620);
  }, [onComplete]);

  const skipAhead = useCallback(() => {
    if (phaseRef.current === 'exit') return;
    if (phaseRef.current === 'granted') {
      finish();
      return;
    }
    skipRef.current = true;
    if (phaseRef.current === 'callsign' && callsignResolveRef.current) {
      const resolve = callsignResolveRef.current;
      callsignResolveRef.current = null;
      resolve(callsignVal.trim() || DEFAULT_CALLSIGN);
    }
  }, [callsignVal, finish]);

  // --- global keyboard: Channel 9 buffer / skip / enter ---------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inInput = !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (e.key === 'Escape') {
        e.preventDefault();
        skipAhead();
        return;
      }

      if (phase === 'granted') {
        if (e.key === 'Enter') {
          e.preventDefault();
          finish();
        }
        return;
      }

      if (phase !== 'boot' || inInput) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = bufRef.current;
        bufRef.current = '';
        setChannelBuf('');
        if (cmd.trim()) runSecret(cmd);
        return;
      }
      if (e.key === 'Backspace') {
        e.preventDefault();
        bufRef.current = bufRef.current.slice(0, -1);
        setChannelBuf(bufRef.current);
        sfx('keystroke', 60);
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (bufRef.current.length >= CH9_MAX) return;
        bufRef.current += e.key;
        setChannelBuf(bufRef.current);
        sfx('keystroke', 60);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, runSecret, skipAhead, finish]);

  const submitCallsign = (raw: string) => {
    const value = raw.trim();
    if (
      value &&
      (SECRET_COMMANDS.includes(value.toLowerCase()) || REVOKED_CODES.includes(value.toLowerCase()))
    ) {
      runSecret(value);
      setCallsignVal('');
      return;
    }
    gpcAudio.playUiSound('grant');
    const resolve = callsignResolveRef.current;
    callsignResolveRef.current = null;
    resolve?.(value || DEFAULT_CALLSIGN);
  };

  const blocks = 34;
  const filled = Math.round((progress / 100) * blocks);

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden font-mono bg-crt boot-glitch-target ${
        glitching ? 'boot-glitching' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="GPC Cold Boot Terminal"
      aria-describedby="boot-status"
    >
      <p id="boot-status" className="sr-only" aria-live="polite">
        {phase === 'callsign'
          ? 'Operator callsign requested. Type a name and press Enter, or leave blank.'
          : phase === 'granted'
            ? 'Access granted. Press Enter or activate the initiate session button.'
            : phase === 'exit'
              ? 'Entering archive.'
              : 'Cold boot sequence running. Press Escape or use the Skip button to fast-forward.'}
      </p>
      {/* CRT power-on wrapper */}
      <div
        className="absolute inset-0"
        style={{
          animation:
            phase === 'exit'
              ? 'boot-crt-off 0.6s ease-in forwards'
              : 'boot-crt-on 0.75s cubic-bezier(.2,.8,.25,1) both'
        }}
      >
        <div
          className="absolute inset-0 flex flex-col"
          style={{ animation: 'boot-flicker 4.5s linear infinite' }}
        >
          {/* ---------------------------------------------------- HUD: top */}
          <div className="flex items-start justify-between px-3 sm:px-5 pt-2.5 text-micro sm:text-caption tracking-widest text-cyan-500/80 z-10">
            <div className="flex flex-col gap-0.5">
              <span className="text-cyan-300 font-bold">◈ SECURE UPLINK // NODE 09 POSTOJNA</span>
              <span className="text-slate-500">SESSION {sessionId} // OBSIDIAN PROXY</span>
            </div>
            <div className="hidden sm:flex flex-col gap-0.5 items-end">
              <span className="text-cyan-300 font-bold">{clock}</span>
              <span className="text-slate-500">
                UPLINK {uplink}%{' '}
                <span className="text-cyan-500">
                  {'█'.repeat(Math.round(uplink / 10))}
                  <span className="text-slate-700">{'░'.repeat(10 - Math.round(uplink / 10))}</span>
                </span>
              </span>
            </div>
          </div>

          {/* ------------------------------------------------ hex packet rain */}
          <div className="absolute right-1.5 top-16 bottom-10 hidden md:flex flex-col justify-end gap-[3px] text-nano leading-none text-emerald-500/25 overflow-hidden pointer-events-none">
            {hexRain.map((h, i) => (
              <span key={`${h}-${i}`} className="text-right">
                {h}
              </span>
            ))}
          </div>
          <div className="absolute left-1.5 top-16 bottom-10 hidden md:flex flex-col justify-start gap-[3px] text-nano leading-none text-cyan-500/20 overflow-hidden pointer-events-none">
            {[...hexRain].reverse().map((h, i) => (
              <span key={`l-${h}-${i}`}>{hexChunk(6)}</span>
            ))}
          </div>

          {/* ------------------------------------------------ main terminal */}
          <div className="flex-1 min-h-0 flex flex-col items-center px-3 sm:px-6 py-2 relative">
            {/* Title */}
            <div className="w-full max-w-3xl mt-1 mb-2 flex items-center justify-center gap-3">
              <img
                src="/favicon.svg"
                alt=""
                aria-hidden="true"
                className="hidden sm:block w-10 h-10 shrink-0 drop-shadow-[0_0_12px_rgba(107,198,190,0.22)]"
              />
              <div className="flex-1 min-w-0 text-center">
                <div className="boot-glow text-cyan-300 font-black text-[13px] sm:text-lg md:text-2xl tracking-[0.28em] whitespace-pre">
                  {title}
                </div>
                <div className="text-amber-400/80 text-[7px] sm:text-micro tracking-[0.4em] mt-1 whitespace-pre">
                  {subtitle}
                </div>
                <div className="mt-2 h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
              </div>
            </div>

            {/* Intercepted anomaly flash */}
            {flash && (
              <div className="boot-alert w-full max-w-3xl mb-1.5">
                <div className="border border-rose-500/70 bg-rose-950/40 text-rose-300 text-micro sm:text-caption px-2.5 py-1.5 tracking-wider">
                  <span className="text-rose-500 font-bold">⚠ {flash}</span>
                </div>
              </div>
            )}

            {/* Log stream */}
            <div className="w-full max-w-3xl flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1 text-caption sm:text-label leading-[1.55]">
              {lines.map((l) => (
                <div key={l.id} className={`${TONE_CLASS[l.tone]} whitespace-pre-wrap break-words`}>
                  <span className="text-slate-700 mr-1.5">[{String(l.id).padStart(2, '0')}]</span>
                  {l.text.slice(0, l.shown)}
                  {l.shown < l.text.length && <span className="boot-caret text-cyan-300">▌</span>}
                </div>
              ))}

              {/* Progress bar */}
              {barStarted && (
                <div className="mt-2 text-caption sm:text-label">
                  <span className="text-cyan-400">
                    [{'█'.repeat(filled)}
                    <span className="text-cyan-900">{'░'.repeat(blocks - filled)}</span>]{' '}
                  </span>
                  <span className="text-cyan-300 font-bold">{String(progress).padStart(3, ' ')}%</span>
                  <span className="text-slate-500 ml-2">{barLabel}</span>
                </div>
              )}

              {/* Callsign prompt */}
              {phase === 'callsign' && (
                <div className="mt-3 border border-cyan-500/40 bg-cyan-950/10 p-2.5 sm:p-3 space-y-1.5">
                  <div className="text-amber-400 font-bold text-caption sm:text-label tracking-wider">
                    ROOT ACCESS REQUIRED — IDENTIFY OPERATOR
                  </div>
                  <div className="flex items-center gap-2 text-label">
                    <span className="text-cyan-400 font-bold shrink-0">
                      <span className="hidden sm:inline">gpc@vault:~</span>$
                    </span>
                    <input
                      ref={inputRef}
                      aria-label="Operator callsign"
                      maxLength={24}
                      value={callsignVal}
                      onChange={(e) => setCallsignVal(e.target.value.slice(0, 24))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          submitCallsign(callsignVal);
                        }
                      }}
                      placeholder="OPERATOR CALLSIGN"
                      className="flex-1 min-w-0 bg-transparent border-none text-cyan-300 placeholder-slate-600 font-mono text-label focus:outline-none tracking-widest"
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                      autoCorrect="off"
                      enterKeyHint="go"
                    />
                    <span className="boot-caret text-cyan-300 hidden sm:inline">█</span>
                    {/* Soft keyboards hide their Enter key behind a "go" label;
                        give touch operators an unambiguous commit button. */}
                    <button
                      type="button"
                      onClick={() => submitCallsign(callsignVal)}
                      className="tap-target sm:hidden shrink-0 px-2.5 py-1 rounded border border-cyan-400/70 bg-cyan-950/40 text-cyan-200 text-micro font-bold tracking-widest"
                    >
                      ENTER
                    </button>
                  </div>
                  <div className="text-slate-600 text-micro tracking-wider">
                    [ENTER] ACCEPT · LEAVE BLANK FOR {DEFAULT_CALLSIGN} · CH9 STILL LISTENING
                  </div>
                </div>
              )}

              {/* Access granted plate */}
              {phase === 'granted' && (
                <div className="mt-4 flex flex-col items-center gap-3 py-2">
                  <div className="text-fuchsia-400/60 ovp-breathe" aria-hidden>
                    <OrderSigil size={54} spin={!reducedMotion} />
                  </div>
                  <div className="border-2 border-emerald-400/70 bg-emerald-950/20 px-4 sm:px-8 py-3 text-center shadow-glow-lg shadow-emerald-400/35">
                    <div className="text-emerald-300 font-black text-base sm:text-2xl tracking-[0.3em] whitespace-nowrap">
                      ACCESS GRANTED
                    </div>
                    <div className="text-emerald-500/80 text-nano sm:text-caption tracking-[0.35em] mt-1">
                      OPERATOR: {grantedOperator.toUpperCase()} // LEVEL {investigation.earnedLevel}{' '}
                      {LEVEL_NAMES[investigation.earnedLevel]}
                    </div>
                  </div>
                  <button
                    type="button"
                    autoFocus
                    onClick={finish}
                    className="tap-target boot-press-pulse cursor-pointer border border-cyan-400/70 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-200 px-5 sm:px-8 py-3 sm:py-2.5 text-label sm:text-xs font-bold tracking-[0.25em] rounded transition-colors"
                  >
                    PRESS [ ENTER ] TO INITIATE SESSION
                  </button>
                  <div className="text-slate-600 text-micro tracking-widest">
                    EXECUTIVE DIRECTIVE 01 STANDBY // TOPN MONITORING ACTIVE
                  </div>
                </div>
              )}

              <div ref={logEndRef} />
            </div>

            {/* Channel 9 listener footer — type anywhere, or use the field (touch devices). */}
            {(phase === 'boot' || phase === 'callsign') && (
              <form
                className="w-full max-w-3xl mt-1.5 flex items-center gap-2 text-caption border-t border-line pt-1.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  const cmd = bufRef.current;
                  bufRef.current = '';
                  setChannelBuf('');
                  if (cmd.trim()) runSecret(cmd);
                }}
              >
                <label htmlFor="ch9-input" className="text-fuchsia-400/90 font-bold tracking-wider shrink-0">
                  CH9 LISTENING
                </label>
                <span className="text-slate-700 shrink-0 hidden sm:inline" aria-hidden>
                  // ENTER TO TRANSMIT //
                </span>
                <input
                  id="ch9-input"
                  value={channelBuf}
                  maxLength={CH9_MAX}
                  onChange={(e) => {
                    bufRef.current = e.target.value.slice(0, CH9_MAX);
                    setChannelBuf(bufRef.current);
                  }}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="Channel 9 directive"
                  className="flex-1 min-w-0 bg-transparent border-none text-cyan-300 font-mono focus:outline-none placeholder-slate-700"
                  placeholder="▌"
                />
                <button
                  type="button"
                  onClick={skipAhead}
                  className="tap-target ml-auto shrink-0 px-2 py-1 border border-slate-700 hover:border-cyan-500/60 text-slate-500 hover:text-cyan-300 tracking-widest rounded"
                  aria-keyshortcuts="Escape"
                >
                  <span className="hidden sm:inline">ESC — </span>SKIP BOOT
                </button>
              </form>
            )}
          </div>

          {/* ------------------------------------------------- HUD: bottom */}
          <div className="flex items-center justify-between px-3 sm:px-5 pb-2 text-nano sm:text-micro tracking-widest text-slate-600 z-10">
            <span>45.7821° N / 14.2137° E — POSTOJNA VAULT SUBLEVEL 4</span>
            <span className="hidden sm:inline text-cyan-600/80">
              14.802 Hz ▲ 0.05%/YR — RESONANT WINDOW 2026-11-04 04:32 UTC
            </span>
            <span>BIOS 8.4.2 // THORNE-CRYPTO R4</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------- CRT overlays (always on) */}
      {/* scanlines */}
      <div className="boot-scanlines absolute inset-0 pointer-events-none z-20" aria-hidden />
      {/* travelling scan bar */}
      <div className="boot-scanbar absolute left-0 right-0 h-16 pointer-events-none z-20 bg-gradient-to-b from-transparent via-cyan-400/[0.06] to-transparent" />
      {/* vignette */}
      <div className="boot-vignette absolute inset-0 pointer-events-none z-20" aria-hidden />
      {/* corner brackets */}
      <div className="absolute inset-2 sm:inset-3 pointer-events-none z-20 border border-cyan-500/15" />
    </div>
  );
}
