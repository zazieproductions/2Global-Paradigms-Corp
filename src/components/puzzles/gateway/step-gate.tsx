import { useState, useEffect, type FC } from 'react';
import { PuzzlePanel, SmallCapsTitle } from './puzzle-bits';
import { buildOriginPayload, MASTER_KEY_CODE, type GatewayKeys } from '@/content/puzzles/gateway';
import { checkAnswer } from '@/lib/puzzles/validate';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { downloadJson } from '@/lib/utils/download';

interface StepGateProps {
  /** Validates (and records) the joined keys `SEQUENCE|SIGNAL|WAVEFORM`. */
  verify: (joined: string) => boolean;
  onComplete: () => void;
}

const SLOT_PUZZLE: Record<keyof GatewayKeys, string> = {
  sequence: 'gateway-sequence',
  signal: 'gateway-signal',
  waveform: 'gateway-waveform'
};

const clean = (raw: string) => raw.trim().toUpperCase().replace(/[\s-]/g, '');

// ============================================================================
// STEP E — THE GATE (ORIGIN PROTOCOL / payoff)
// ----------------------------------------------------------------------------
// A single interlock console re-verifies all three answers, then runs a
// staged success reveal: three directory strikes, the carrier locks at
// 15.000 Hz and the ORIGIN PROTOCOL transmission drops, signed by Master
// Key 01. A downloadable evidence artifact is handed over.
// ============================================================================

const INTERLOCKS: {
  key: keyof GatewayKeys;
  slot: string;
  task: string;
  hint: string;
  max: number;
  digitsOnly: boolean;
}[] = [
  {
    key: 'sequence',
    slot: '01',
    task: 'THE VESPER SEQUENCE',
    hint: '6-letter founders name',
    max: 8,
    digitsOnly: false
  },
  { key: 'signal', slot: '02', task: 'THE SIGNAL', hint: '6-digit tap order', max: 6, digitsOnly: true },
  { key: 'waveform', slot: '03', task: 'THE WAVEFORM', hint: '4-letter gate word', max: 4, digitsOnly: false }
];

export const StepGate: FC<StepGateProps> = ({ verify, onComplete }) => {
  const [values, setValues] = useState<GatewayKeys>({ sequence: '', signal: '', waveform: '' });
  const [verdicts, setVerdicts] = useState<Record<string, boolean | null>>({
    sequence: null,
    signal: null,
    waveform: null
  });
  const [attempts, setAttempts] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [solved, setSolved] = useState(false);

  const check = (key: keyof GatewayKeys, raw: string) => {
    if (checkAnswer(SLOT_PUZZLE[key], raw)) {
      gpcAudio.playUiSound('grant');
      setVerdicts((v) => ({ ...v, [key]: true }));
    } else {
      gpcAudio.playUiSound('deny');
      setAttempts((a) => a + 1);
      setVerdicts((v) => ({ ...v, [key]: false }));
      window.setTimeout(() => setVerdicts((v) => (v[key] === false ? { ...v, [key]: null } : v)), 900);
    }
  };

  const allSolved = verdicts.sequence === true && verdicts.signal === true && verdicts.waveform === true;

  const keys: GatewayKeys = {
    sequence: clean(values.sequence),
    signal: clean(values.signal),
    waveform: clean(values.waveform)
  };
  const joined = `${keys.sequence}|${keys.signal}|${keys.waveform}`;

  useEffect(() => {
    if (!allSolved || solved) return;
    // All three slots agree — record the gateway itself.
    if (!verify(joined)) return;
    const timers: number[] = [];
    timers.push(window.setTimeout(() => setSolved(true), 260));
    const steps = [0, 1, 2, 3];
    steps.forEach((s, i) => timers.push(window.setTimeout(() => setRevealed(s + 1), 420 + i * 560)));
    timers.push(window.setTimeout(() => gpcAudio.playUiSound('alarm'), 470));
    timers.push(window.setTimeout(() => gpcAudio.playUiSound('grant'), 1400));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [allSolved, solved, verify, joined]);

  const downloadArtifact = () => {
    gpcAudio.playUiSound('print');
    downloadJson('OriginProtocol_Gateway_Transmission.json', buildOriginPayload(keys));
  };

  const payload = buildOriginPayload(keys);

  return (
    <PuzzlePanel ticker="THE GATE — INTERLOCK CONSOLE // MASTER KEY 01">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1 flex flex-col gap-3">
        {!solved ? (
          <>
            <SmallCapsTitle>FINAL VERIFICATION — RE-ENTER THE THREE KEYS</SmallCapsTitle>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
              The archive refuses to open until the three directives agree. They were solved in order — type
              them once more.
            </p>

            <div className="flex flex-col gap-2">
              {INTERLOCKS.map((il) => (
                <div
                  key={il.key}
                  className={`flex items-center gap-2.5 border p-2.5 rounded transition-all ${
                    verdicts[il.key] === true
                      ? 'border-emerald-500/60 bg-emerald-950/25'
                      : verdicts[il.key] === false
                        ? 'border-rose-500/60 bg-rose-950/25'
                        : 'border-[#1b263b] bg-[#05070d]'
                  }`}
                >
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded border shrink-0 ${
                      verdicts[il.key] === true
                        ? 'text-emerald-300 border-emerald-500/60'
                        : 'text-slate-500 border-slate-700'
                    }`}
                  >
                    {verdicts[il.key] === true ? '✓' : il.slot}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-slate-300 tracking-wider">{il.task}</div>
                    <div className="text-[9px] text-slate-600">{il.hint}</div>
                  </div>
                  {verdicts[il.key] === true ? (
                    <span className="text-emerald-300 font-black tracking-widest text-[11px]">SECURED</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <input
                        aria-label={`${il.task} — ${il.hint}`}
                        value={values[il.key]}
                        onChange={(e) => {
                          let v = e.target.value.slice(0, il.max);
                          if (il.digitsOnly) v = v.replace(/\D/g, '');
                          setValues((s) => ({ ...s, [il.key]: v }));
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && check(il.key, values[il.key])}
                        placeholder={il.digitsOnly ? '······' : il.max === 8 ? '········' : '····'}
                        className="w-24 bg-[#0a0e18] border border-[#22304d] rounded px-2 py-1 text-cyan-300 font-mono text-center tracking-[0.35em] focus:outline-none focus:border-cyan-500/60 placeholder-slate-700"
                        spellCheck={false}
                        autoComplete="off"
                        inputMode={il.digitsOnly ? 'numeric' : 'text'}
                      />
                      <button
                        type="button"
                        onClick={() => check(il.key, values[il.key])}
                        className="px-2 py-1 bg-[#121927] hover:bg-cyan-900/50 border border-[#22304d] rounded text-slate-300 hover:text-cyan-200 text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        VERIFY
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {attempts >= 3 && (
              <div className="text-[10px] text-amber-400 border border-amber-500/40 bg-amber-950/20 p-2.5 rounded leading-relaxed">
                YOU ALREADY SOLVED THESE — they are, in order: the{' '}
                <span className="text-slate-200 font-bold">1st key</span> is the{' '}
                <span className="text-cyan-300">founders sequence (sort the marquee rungs by year)</span>, the{' '}
                <span className="text-slate-200 font-bold">2nd</span> is the{' '}
                <span className="text-cyan-300">six taps (device queue)</span>, the{' '}
                <span className="text-slate-200 font-bold">3rd</span> is the{' '}
                <span className="text-cyan-300">casket-hedge ledger</span> (in the order they already came).
              </div>
            )}

            <div className="text-[9px] text-slate-600 tracking-wider">
              ALL THREE SEALS MUST READ “SECURED” TO BREAK THE INTERLOCK
            </div>
          </>
        ) : (
          <>
            <div className="text-center space-y-1">
              <SmallCapsTitle className="justify-center">DIRECTORY STRIKES — TOPN TALLY</SmallCapsTitle>
              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-300 tracking-widest">
                {[keys.sequence, keys.signal, keys.waveform.split('').join(' ')].map((s, i) => (
                  <span
                    key={`strike-${i}`}
                    className={`transition-all duration-300 ${
                      revealed > i ? 'text-emerald-300' : 'text-slate-700'
                    }`}
                  >
                    {revealed > i ? '✓ ' : '· '}
                    {s}
                  </span>
                ))}
              </div>
              <div className="text-[10px] text-fuchsia-300/80 animate-pulse tracking-[0.3em]">
                KEYS REMAPPED TO THE SEALS — THE REAL CASE BEGINS NOW
              </div>
            </div>

            {/* Origin protocol proclamation */}
            <div className="border-2 border-fuchsia-400/40 bg-fuchsia-950/20 p-4 sm:p-5 text-center shadow-[0_0_50px_rgba(192,38,211,0.22)]">
              <div className="text-[10px] text-rose-400 font-bold tracking-[0.3em] mb-2">
                INCOMING TRANSMISSION — SELF-SIGNED
              </div>
              <div className="text-emerald-300 font-black text-lg sm:text-2xl tracking-[0.2em]">
                ORIGIN PROTOCOL
              </div>
              <div className="text-[10px] text-slate-400 tracking-widest mt-1">
                AUTHORITY: {payload.authority}
              </div>
              <div className="text-[10px] text-fuchsia-300 tracking-widest mt-1">{payload.authenticity}</div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                {payload.keychain.map((k) => (
                  <div
                    key={k.directive}
                    className="border border-fuchsia-500/40 bg-[#0c0716] p-2 text-[10px]"
                  >
                    <div className="text-fuchsia-300 font-bold tracking-wider">{k.directive}</div>
                    <div className="text-slate-500">HASH: ACCEPTED ✓</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-[#090516] border border-fuchsia-500/30 rounded text-left text-[10px] space-y-1 text-slate-300">
                <div className="text-slate-500 tracking-wider text-[9px]">NOW UNLOCKED:</div>
                {payload.unlocked.map((u) => (
                  <div key={u} className="flex gap-2">
                    <span className="text-fuchsia-400">▸</span>
                    <span>{u}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-[11px] text-slate-300 tracking-wider">{payload.note}</div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                type="button"
                onClick={downloadArtifact}
                className="cursor-pointer px-4 py-2 bg-[#0f1622] hover:bg-[#16202f] border border-fuchsia-500/50 text-fuchsia-200 font-bold tracking-widest rounded transition-colors text-[10px]"
              >
                ⬇ SAVE ORIGIN PROTOCOL (.JSON)
              </button>
              <button
                type="button"
                onClick={onComplete}
                className="boot-press-pulse cursor-pointer px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black tracking-[0.25em] rounded transition-colors text-[11px]"
              >
                OPEN THE CASE FILE →
              </button>
            </div>

            <div className="text-center text-[9px] text-slate-600 tracking-widest">
              MASTER KEY {MASTER_KEY_CODE} REMAINS REVOKED · THE SEALS OPEN FOR THE THREE KEYS YOU JUST KEPT
            </div>
          </>
        )}
      </div>
    </PuzzlePanel>
  );
};
