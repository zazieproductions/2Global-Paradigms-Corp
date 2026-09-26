import React, { useState } from 'react';
import { PuzzlePanel, SmallCapsTitle, HintBlock, AnswerPeek } from './PuzzleBits';
import { SIGNAL_DEVICES, SIGNAL_DISPLAY_ORDER, SIGNAL_TAP_ORDER, isValidSignal, StepId } from '../../data/argPuzzle';
import { gpcAudio } from '../../lib/audioEngine';

interface StepSignalProps {
  onSolve: (step: StepId) => void;
}

// ============================================================================
// STEP C — THE SIGNAL
// ----------------------------------------------------------------------------
// Six devices dialled the carrier one after another. Each badge is a digit;
// each voice remembers only its OWN place in the queue. Press the banners in
// tap order (9 → 8 → 7 → 3 → 1 → 6), then confirm the six-digit code.
// ============================================================================

export const StepSignal: React.FC<StepSignalProps> = ({ onSolve }) => {
  const [awake, setAwake] = useState<Record<string, boolean>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [resetCount, setResetCount] = useState(0);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const pick = (id: string) => {
    if (done) return;
    gpcAudio.playUiSound('keystroke');
    setAwake((a) => ({ ...a, [id]: true }));
    if (order.includes(id)) return; // already queued — ignore
    if (order.length < 6 && SIGNAL_TAP_ORDER[order.length] === id) {
      const next = [...order, id];
      setOrder(next);
      if (next.length === 6) gpcAudio.playUiSound('grant');
      return;
    }
    // wrong node — the grid rejects the sequence
    gpcAudio.playUiSound('deny');
    setResetCount((c) => c + 1);
    setOrder([]);
    setError('WRONG NODE — THE GRID FLICKERED AND DROPPED THE ORDER');
    setValue('');
  };

  const submit = () => {
    if (isValidSignal(value)) {
      gpcAudio.playUiSound('grant');
      setDone(true);
      setTimeout(() => onSolve('waveform'), 900);
    } else {
      gpcAudio.playUiSound('deny');
      setError('SIGNAL NOISE — HEAR EACH VOICE, THEN CHAIN THE BADGES');
      setValue('');
    }
  };

  return (
    <PuzzlePanel ticker="THE SIGNAL — DEVICE QUEUE // CARRIER 14.802 Hz">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1 flex flex-col gap-3">
        <SmallCapsTitle>TASK 2 OF 3 — THE SIGNAL</SmallCapsTitle>

        <div className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
          Six devices dialled the carrier one after another. Each remembers{' '}
          <span className="text-cyan-300 font-bold">only its own place in the queue</span>.{" "}
          <span className="text-slate-300">Wake them, hear them, then chain their badges in tap order.</span>
        </div>

        {/* Current chain */}
        <div className="border border-cyan-500/25 bg-[#04060b] p-2.5">
          <div className="text-[9px] text-slate-500 tracking-widest flex items-center justify-between">
            <span>DIAL CHAIN</span>
            <span>
              {order.length}/6 LOCKED{resetCount > 0 && ` · RESET ×${resetCount}`}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 min-h-[30px]">
            {SIGNAL_TAP_ORDER.map((s, i) => (
              <span
                key={`slot-${i}`}
                className={`w-8 h-8 flex items-center justify-center rounded border text-[13px] font-black transition-all ${
                  i < order.length
                    ? 'border-cyan-400/80 bg-cyan-950/60 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.35)]'
                    : 'border-slate-700 bg-[#080c14] text-slate-700'
                }`}
              >
                {i < order.length ? order[i] : '·'}
              </span>
            ))}
            <span className="ml-1 text-[9px] text-slate-600">
              {order.length === 6 ? '✓ CARRIER ACCEPTS THE CHAIN' : 'tap badges left → right'}
            </span>
          </div>
        </div>

        {/* Banners */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {SIGNAL_DISPLAY_ORDER.map((id) => {
            const device = SIGNAL_DEVICES.find((d) => d.id === id)!;
            const idx = order.indexOf(id);
            return (
              <button
                key={id}
                onClick={() => pick(id)}
                className={`cursor-pointer group relative p-2.5 h-24 text-left border rounded transition-all ${
                  idx !== -1
                    ? 'border-cyan-400/70 bg-cyan-950/40 shadow-[0_0_22px_rgba(0,240,255,0.25)]'
                    : awake[id]
                      ? 'border-slate-600 bg-[#070b13] opacity-90'
                      : 'border-slate-700/70 bg-[#07090f] hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="w-7 h-7 rounded border border-slate-600 bg-[#0a0e18] flex items-center justify-center text-cyan-300 font-black text-[13px]">
                    {id}
                  </span>
                  {idx !== -1 && (
                    <span className="text-[8px] px-1 py-0.5 rounded bg-cyan-950 border border-cyan-700 text-cyan-200 font-black tracking-widest">
                      TAP {idx + 1}
                    </span>
                  )}
                </div>
                <div className="text-[8px] text-slate-400 mt-1 line-clamp-2">{device.model}</div>
              </button>
            );
          })}
        </div>

        {/* Awake recollections */}
        {Object.keys(awake).some((k) => awake[k]) && (
          <div className="border border-[#141b2c] bg-[#05070d] p-2.5">
            <div className="text-[9px] text-slate-500 tracking-wider border-b border-[#141b2c] pb-1 mb-1.5">
              VOICE LOGS — <span className="text-fuchsia-400">CHANNEL 9 · SUB-AUDIBLE</span>
            </div>
            <div className="space-y-1 max-h-44 overflow-y-auto scrollbar-thin">
              {SIGNAL_DEVICES.filter((d) => awake[d.id]).map((d) => (
                <p key={d.id} className="text-[10px] text-slate-300 italic leading-relaxed">
                  <span className="text-fuchsia-400 font-bold not-italic mr-1">[{d.id}]</span>
                  “{d.recollection}”
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        {!done ? (
          <div className="border border-cyan-500/30 bg-[#05070d] p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold shrink-0">gpc@vector:~$</span>
              <span className="text-slate-500 text-[10px]">transmit --tapcode</span>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value.slice(0, 6).replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="6-DIGIT TAP ORDER…"
                className="flex-1 bg-transparent border-none text-cyan-300 placeholder-slate-600 focus:outline-none font-mono tracking-[0.35em]"
                spellCheck={false}
                autoComplete="off"
                inputMode="numeric"
              />
              <button
                onClick={submit}
                className="shrink-0 px-2.5 py-1 bg-cyan-900/60 hover:bg-cyan-800/60 border border-cyan-500/50 text-cyan-200 font-bold tracking-widest rounded cursor-pointer transition-colors"
              >
                ⏎
              </button>
            </div>
            {error && <div className="mt-1.5 text-[10px] text-rose-400 font-bold">{error}</div>}
          </div>
        ) : (
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded text-center">
            <div className="text-emerald-300 font-black tracking-[0.3em] text-sm sm:text-base">
              ✓ SIGNAL INTERPRETED
            </div>
            <div className="text-[10px] text-emerald-500/80 mt-1">
              CARRIER UNLOCKED // WAVEFORM DECODING…
            </div>
          </div>
        )}

        <HintBlock>
          <p className="text-slate-400">
            Wake every badge and read each voice. They will tell you{' '}
            <span className="text-slate-300">“I tapped first…” through “…sixth.”</span> Chain the
            badges in that order.
          </p>
          <AnswerPeek label="TAP ORDER">987316</AnswerPeek>
        </HintBlock>
      </div>
    </PuzzlePanel>
  );
};

export default StepSignal;
