import { useState, type FC, Fragment } from 'react';
import { PuzzlePanel, SmallCapsTitle, HintBlock, AnswerPeek } from './puzzle-bits';
import { WAVE_ROWS, HEDGE_KEYS, type StepId } from '@/content/puzzles/gateway';
import { gpcAudio } from '@/lib/audio/audio-engine';

interface StepWaveformProps {
  onSolve: (step: StepId) => void;
  /** Validates (and records) the answer through the progression store. */
  verify: (input: string) => boolean;
}

// ============================================================================
// STEP D — THE WAVEFORM
// ----------------------------------------------------------------------------
// The recovered carrier lattice is 8 rows × 8 slots. A '+' is a carrier pulse,
// an '×' is reverb. Four rows carry EXACTLY ONE carrier — those are the "live"
// rows. Wiring them to the casket-hedge ledger top-to-bottom reads C O L D.
// ============================================================================

const ROW_COUNT = WAVE_ROWS.map((r) => ({ label: r.label, carriers: r.cells.filter((c) => c === 2).length }));
const LIVE_ROWS = ROW_COUNT.filter((r) => r.carriers === 1).map((r) => r.label);

export const StepWaveform: FC<StepWaveformProps> = ({ onSolve, verify }) => {
  const [litUp, setLitUp] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const submit = () => {
    if (verify(value)) {
      gpcAudio.playUiSound('grant');
      setDone(true);
      setTimeout(() => onSolve('gate'), 900);
    } else {
      gpcAudio.playUiSound('deny');
      setError('GATE WORD MISREAD — WIRE THE LIVE ROWS TO THE LEDGER, TOP TO BOTTOM');
      setValue('');
    }
  };

  return (
    <PuzzlePanel ticker="THE WAVEFORM — LATTICE DECODER // 8×8">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1 flex flex-col gap-3">
        <SmallCapsTitle>TASK 3 OF 3 — THE WAVEFORM</SmallCapsTitle>

        <div className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed">
          The carrier lattice keeps <span className="text-cyan-300 font-bold">4 live rows</span> — rows with{' '}
          <span className="text-slate-300">exactly one carrier pulse (+)</span>. Wire them to the casket-hedge
          ledger <span className="text-rose-300 font-bold">top to bottom</span>.
        </div>

        {/* Matrix + ledger */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Matrix */}
          <div className="border border-cyan-500/25 bg-[#04060b] p-2.5">
            <div className="text-[9px] text-slate-500 tracking-wider border-b border-[#141b2c] pb-1 mb-2 flex items-center justify-between">
              <span>CARRIER LATTICE 8×8</span>
              <span>
                <span className="text-cyan-300">■ PULSE</span>
                <span className="text-slate-600"> / </span>
                <span className="text-rose-300">■ REVERB</span>
              </span>
            </div>
            <div className="w-full max-w-[340px] mx-auto font-mono leading-none">
              <div className="grid grid-cols-[24px_repeat(8,1fr)] gap-y-[3px]">
                <span />
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={`c${i}`} className="text-center text-[8px] text-slate-600">
                    {i + 1}
                  </span>
                ))}
                {WAVE_ROWS.map((r) => {
                  const carriers = r.cells.filter((c) => c === 2).length;
                  const live = litUp && carriers === 1;
                  return (
                    <Fragment key={r.label}>
                      <span
                        className={`text-[8px] self-center ${live ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}
                      >
                        {r.label}
                      </span>
                      {r.cells.map((c, i) => (
                        <span
                          key={`${r.label}-${i}`}
                          className="h-4 w-4 mx-auto flex items-center justify-center"
                        >
                          {c === 2 ? (
                            <span
                              className={`w-2.5 h-2.5 rounded-[2px] bg-cyan-300 ${
                                live ? 'animate-pulse' : ''
                              }`}
                              style={{ boxShadow: '0 0 6px rgba(0,240,255,0.9)' }}
                            />
                          ) : c === 1 ? (
                            <span
                              className="w-2.5 h-2.5 rounded-full bg-rose-400/70"
                              style={{ boxShadow: '0 0 5px rgba(244,63,94,0.6)' }}
                            />
                          ) : (
                            <span className="text-[8px] text-slate-800">·</span>
                          )}
                        </span>
                      ))}
                    </Fragment>
                  );
                })}
              </div>
            </div>
            <div className="mt-2 text-[9px] text-slate-500 text-center tracking-widest">
              {litUp
                ? `4 LIVE ROWS ISOLATED — ${LIVE_ROWS.join(' · ')}`
                : 'LAMP THE LIVE ROWS TO ISOLATE THEM'}
            </div>
          </div>

          {/* Ledger */}
          <div className="border border-slate-700/60 bg-[#05070d] p-2.5 flex flex-col">
            <div className="text-[9px] text-slate-500 tracking-wider border-b border-[#141b2c] pb-1 mb-2">
              CASKET-HEDGE LEDGER — WIRE BY ROW LABEL
            </div>
            <div className="flex flex-col gap-1.5">
              {ROW_COUNT.map((r) => {
                const rank = Number(r.label.slice(1)); // H1→1 … H8→8
                const key = HEDGE_KEYS.find((k) => k.rank === rank);
                const isLive = r.carriers === 1;
                const live = litUp && isLive;
                return (
                  <div
                    key={r.label}
                    className={`flex items-center justify-between px-2 py-1 rounded border ${
                      live ? 'border-cyan-500/60 bg-cyan-950/30' : 'border-slate-800 bg-[#070a12]'
                    }`}
                  >
                    <span className={`text-[9px] ${live ? 'text-cyan-300 font-bold' : 'text-slate-500'}`}>
                      {r.label} — {r.carriers} PULSE{r.carriers === 1 ? '' : 'S'}
                    </span>
                    <span
                      className={`text-[10px] font-black tracking-wider ${
                        key ? (live ? 'text-rose-300' : 'text-slate-700') : 'text-slate-800'
                      }`}
                    >
                      {key ? (litUp ? key.glyph : '?') : '·'}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-[9px] text-slate-500 leading-relaxed">
              Lamps reveal each wired glyph. Read the{' '}
              <span className="text-slate-300">four live rows only</span> (exactly one pulse), top to bottom.
            </p>
          </div>
        </div>

        {/* Controls */}
        {!done && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <button
              type="button"
              onClick={() => {
                gpcAudio.playUiSound('scan');
                setLitUp(true);
              }}
              className={`px-3 py-2 rounded font-bold tracking-widest cursor-pointer transition-colors border ${
                litUp
                  ? 'opacity-60 cursor-default border-cyan-700/50 text-cyan-500'
                  : 'bg-cyan-950/50 hover:bg-cyan-900/60 border-cyan-500/50 text-cyan-200'
              }`}
            >
              {litUp ? '✓ LIVE ROWS LAMPED' : '▤ LAMP LIVE ROWS'}
            </button>

            <div className="flex flex-1 items-center gap-2 border border-cyan-500/30 bg-[#05070d] p-2">
              <span className="text-cyan-400 font-bold shrink-0">gpc@vector:~$</span>
              <span className="text-slate-500 text-[10px] hidden sm:inline">transmit --entry</span>
              <input
                aria-label="Gate word, four letters"
                value={value}
                onChange={(e) => setValue(e.target.value.slice(0, 4).replace(/[^a-zA-Z]/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="4-LETTER GATE WORD…"
                className="flex-1 bg-transparent border-none text-cyan-300 placeholder-slate-600 focus:outline-none font-mono tracking-[0.4em]"
                spellCheck={false}
                autoComplete="off"
              />
              <button
                type="button"
                onClick={submit}
                className="shrink-0 px-2.5 py-1 bg-cyan-900/60 hover:bg-cyan-800/60 border border-cyan-500/50 text-cyan-200 font-bold tracking-widest rounded cursor-pointer transition-colors"
              >
                ⏎
              </button>
            </div>
          </div>
        )}

        {error && !done && <div className="text-[10px] text-rose-400 font-bold">{error}</div>}

        {done && (
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded text-center">
            <div className="text-emerald-300 font-black tracking-[0.3em] text-sm sm:text-base">
              ✓ WAVEFORM UNDERSTOOD
            </div>
            <div className="text-[10px] text-emerald-500/80 mt-1">
              GATE INTERLOCK OPENING — FINAL VERIFICATION…
            </div>
          </div>
        )}

        <HintBlock>
          <p className="text-slate-400">
            Live rows = <span className="text-cyan-300">exactly one blue pulse</span>:{' '}
            <span className="text-slate-300">H1, H2, H3, H4</span>. Their ledger glyphs, read top to bottom,
            are one of the oldest entry words the founders kept.
          </p>
          <AnswerPeek label="GATE WORD" puzzleId="gateway-waveform" />
        </HintBlock>
      </div>
    </PuzzlePanel>
  );
};
