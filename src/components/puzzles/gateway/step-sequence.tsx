import { useState, type FC } from 'react';
import { PuzzlePanel, SmallCapsTitle, TypedText, HintBlock, AnswerPeek } from './puzzle-bits';
import { RUNGS, RUNG_DISPLAY_ORDER, RUNG_VOICES, type StepId } from '@/content/puzzles/gateway';
import { gpcAudio } from '@/lib/audio/audio-engine';

interface StepSequenceProps {
  onSolve: (step: StepId) => void;
  /** Validates (and records) the answer through the progression store. */
  verify: (input: string) => boolean;
}

// ============================================================================
// STEP B — THE VESPER SEQUENCE
// ----------------------------------------------------------------------------
// Six iron rungs were re-hung out of order after a fire. Each rung still wears
// its installation year; the scorched one (R) tried to shed its name but the
// plate never gave. Combination: hang the rungs chronologically → V E S P A R
// (cataclysmic records spell VESPER; both accepted).
// ============================================================================

const chronological = (ids: string[]) =>
  [...ids].sort((a, b) => {
    const ra = RUNGS.find((r) => r.id === a)!;
    const rb = RUNGS.find((r) => r.id === b)!;
    return ra.year - rb.year;
  });

// Calculate the solution order (for the hint tape's "solved" flourish).
const solvedOrder = chronological(RUNG_DISPLAY_ORDER)
  .map((id) => RUNGS.find((r) => r.id === id)!.letter)
  .join('');

export const StepSequence: FC<StepSequenceProps> = ({ onSolve, verify }) => {
  const [tapped, setTapped] = useState<Record<string, boolean>>({});
  const [tape, setTape] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const isSealed = tapped.e && tapped.a && tapped.r;

  const tapRung = (id: string, voice: string) => {
    const next = { ...tapped, [id]: true };
    setTapped(next);
    setTape(voice);
    if (id === 'e' || id === 'a' || id === 'r') gpcAudio.playUiSound('scan');
    else gpcAudio.playUiSound('keystroke');
    if (next.e && next.a && next.r && !isSealed) gpcAudio.playUiSound('grant');
  };

  const submit = () => {
    if (verify(value)) {
      gpcAudio.playUiSound('grant');
      setDone(true);
      setTimeout(() => onSolve('signal'), 900);
    } else {
      gpcAudio.playUiSound('deny');
      setError('SEQUENCE MISREAD — HANG THE RUNGS BY THE YEARS THEY WERE INSTALLED');
      setValue('');
    }
  };

  return (
    <PuzzlePanel ticker="THE VESPER SEQUENCE — LITHOSPHERIC HARMONIC INDEX">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1 flex flex-col gap-3">
        <SmallCapsTitle>TASK 1 OF 3 — THE VESPER SEQUENCE</SmallCapsTitle>

        {/* ---- Rung marquee ---- */}
        <div className="p-2.5 border border-cyan-500/25 bg-[#05070d]">
          <div className="text-[9px] text-slate-500 tracking-widest border-b border-[#141b2c] pb-1 mb-2 flex items-center justify-between">
            <span>MAUSOLEUM MARQUEE // RE-HUNG AFTER THE FIRE</span>
            <span className="text-amber-400">ORDER LOST</span>
          </div>
          <div className="flex items-stretch justify-center gap-1.5 sm:gap-2">
            {RUNG_DISPLAY_ORDER.map((id, i) => {
              const rung = RUNGS.find((r) => r.id === id)!;
              const lit = !!tapped[id];
              return (
                <div key={id} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => tapRung(id, RUNG_VOICES[id])}
                    className={`cursor-pointer w-9 h-12 sm:w-12 sm:h-16 flex flex-col items-center justify-center border text-lg sm:text-2xl font-black transition-all ${
                      id === 'r' ? 'ring-1 ring-rose-500/60' : ''
                    }`}
                    style={{
                      borderColor: id === 'r' ? 'rgba(244,63,94,0.5)' : 'rgba(0,240,255,0.35)',
                      background:
                        id === 'r'
                          ? 'repeating-linear-gradient(45deg, #14060a 0 6px, #1d070c 6px 12px)'
                          : lit
                            ? 'rgba(0,240,255,0.10)'
                            : '#0a0d15',
                      color: id === 'r' ? 'rgba(244,63,94,0.9)' : '#67e8f9',
                      textShadow: lit || id === 'r' ? '0 0 8px rgba(0,240,255,0.5)' : 'none'
                    }}
                  >
                    <span>{rung.letter}</span>
                    <span className="text-[7px] sm:text-[8px] font-normal text-slate-600 leading-none mt-0.5">
                      {rung.year}
                    </span>
                  </button>
                  <span className="mt-1 text-[8px] text-slate-600 tracking-widest">
                    {lit ? '■ TAPPED' : `RUNG ${i + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 text-[9px] text-slate-500 text-center tracking-widest">
            TAP EVERY RUNG — NOTE ITS INSTALLATION YEAR
          </div>
        </div>

        {/* ---- Shrink + tape printer ---- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="border border-slate-700/60 bg-[#05070d] p-2.5">
            <div className="text-[9px] text-slate-500 tracking-wider border-b border-[#141b2c] pb-1 mb-2">
              SURVIVOR'S PLAQUE — 'THE DENOMINATION'
            </div>
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded border border-amber-500/40 bg-[#0b0e16]">
                <span className="text-[9px] text-amber-300 font-bold text-center leading-tight">
                  ★ FIRE
                  <br />
                  SURVIVOR
                </span>
              </div>
              <div className="text-[10px] text-slate-400 space-y-1 min-w-0">
                <p className="text-[10px] text-slate-400">
                  Six rungs carry six intact year-plates from{' '}
                  <span className="text-slate-200 font-bold">1971–1976</span>. Together they spell a single,
                  six-letter name.
                </p>
                <p className="text-[10px] italic text-amber-200/80">
                  “If you want it in order, count the years — not the grief.”
                </p>
              </div>
            </div>
          </div>

          <div className="border border-slate-700/60 bg-[#05070d] p-2.5 flex flex-col">
            <div className="text-[9px] text-slate-500 tracking-wider border-b border-[#141b2c] pb-1 mb-2">
              GROUNDSKEEPER'S TAPE // AUTO-FEED
            </div>
            <div className="flex-1 text-[10px] leading-relaxed text-amber-200/90 min-h-[52px]">
              {tape ? (
                <TypedText key={tape} text={tape} speed={8} />
              ) : (
                <span className="text-slate-600">tap the rungs to hear their years…</span>
              )}
            </div>
            <div className="mt-1 text-[9px] text-slate-600">
              {isSealed
                ? `THE SCORCHED RUNG REMEMBERS: I AM "R" — CHRONOLOGICAL: ${solvedOrder}`
                : 'the scorched rung only speaks when its neighbours do'}
            </div>
          </div>
        </div>

        {/* ---- Input ---- */}
        {!done ? (
          <div className="border border-cyan-500/30 bg-[#05070d] p-2.5">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold shrink-0">gpc@vector:~$</span>
              <span className="text-slate-500 text-[10px]">transmit --sequence</span>
              <input
                aria-label="Founders' name, six letters"
                value={value}
                onChange={(e) => setValue(e.target.value.slice(0, 6).replace(/[^a-zA-Z]/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="6-LETTER NAME — HANG THE RUNGS CHRONOLOGICALLY…"
                className="flex-1 bg-transparent border-none text-cyan-300 placeholder-slate-600 focus:outline-none font-mono tracking-widest"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
              <button
                type="button"
                aria-label="Transmit sequence"
                onClick={submit}
                className="shrink-0 px-2.5 py-1 bg-cyan-900/60 hover:bg-cyan-800/60 border border-cyan-500/50 text-cyan-200 font-bold tracking-widest rounded cursor-pointer transition-colors"
              >
                ⏎
              </button>
            </div>
            {error && (
              <div className="mt-1.5 text-[10px] text-rose-400 font-bold" role="alert">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded text-center">
            <div className="text-emerald-300 font-black tracking-[0.3em] text-sm sm:text-base">
              ✓ VESPER SEQUENCE ACCEPTED
            </div>
            <div className="text-[10px] text-emerald-500/80 mt-1">
              MARQUEE RE-HUNG // SIGNAL RELAY OPENING…
            </div>
          </div>
        )}

        <HintBlock>
          <p className="text-slate-400">
            The rungs look wrong, but <span className="text-slate-300">order is scribed on each plate</span>:{' '}
            <span className="text-slate-300">1971–1976</span>. Put the years in increasing order and read
            their letters; the scorched plate is still legible.
          </p>
          <AnswerPeek label="THE SEQUENCE" puzzleId="gateway-sequence" />
        </HintBlock>
      </div>
    </PuzzlePanel>
  );
};
