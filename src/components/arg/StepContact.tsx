import React, { useState, useEffect } from 'react';
import { PuzzlePanel, TypedText, SmallCapsTitle, HintBlock } from './PuzzleBits';
import { FIRST_CONTACT_TEMPLATES, StepId } from '../../data/argPuzzle';

interface StepContactProps {
  onSolve: (step: StepId) => void;
}

// ============================================================================
// STEP A — FIRST CONTACT
// ----------------------------------------------------------------------------
// A corrupted transmission interrupted the boot. The Record button re-plays the
// fragments as a live-typed intercept; INVESTIGATE / FORWARD / TRASH decide how
// the story continues. Auto-play + clear signposting keep it beginner-safe.
// ============================================================================

export const StepContact: React.FC<StepContactProps> = ({ onSolve }) => {
  const [current, setCurrent] = useState<string | null>(null);
  const [linesLeft, setLinesLeft] = useState(0);
  const [runId, setRunId] = useState(0);
  const replay = () => setRunId((n) => n + 1);

  useEffect(() => {
    let i = 0;
    const timers: number[] = [];
    const next = () => {
      if (i >= FIRST_CONTACT_TEMPLATES.length) {
        setCurrent(null);
        setLinesLeft(0);
        return;
      }
      setCurrent(FIRST_CONTACT_TEMPLATES[i]);
      setLinesLeft(FIRST_CONTACT_TEMPLATES.length - 1 - i);
      i += 1;
      timers.push(window.setTimeout(next, 1300));
    };
    timers.push(window.setTimeout(next, 700));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [runId]);

  return (
    <PuzzlePanel ticker="FIRST CONTACT — UNSOLICITED CARRIER 14.802 Hz">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin pr-1 flex flex-col gap-3">
        <SmallCapsTitle>TRANSMISSION INTERCEPT — RECOVERED IN BOOT LOG</SmallCapsTitle>

        {/* Intercept feed */}
        <div className="border border-rose-500/40 bg-[#0a0610] p-2.5 sm:p-3 flex flex-col gap-1 h-40 sm:h-44">
          <div className="flex items-center justify-between text-[9px] text-rose-400/80 font-bold tracking-wider border-b border-rose-900/50 pb-1">
            <span>⚠ LIVE TAP // CHANNEL 9 // EST. ORIGIN: POSTOJNA SUBLEVEL 4</span>
            <span className="animate-pulse">● REC</span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            {current && (
              <TypedText
                key={current}
                text={current}
                speed={14}
                className="text-[11px] sm:text-xs text-rose-200 whitespace-pre-wrap"
              />
            )}
            {!current && (
              <div className="text-[11px] text-rose-300/70 leading-relaxed">
                <span className="text-rose-400 font-bold tracking-wider">
                  [NOW PLAYS ONE LAST PHRASE:]
                </span>
                <br />
                'F 77 L WHERE ARE YOU — THORNE'
              </div>
            )}
          </div>
          <div className="flex items-center justify-between text-[9px] text-slate-600 tracking-widest">
            <span>{linesLeft > 0 ? `${linesLeft} FRAGMENT${linesLeft === 1 ? '' : 'S'} QUEUED` : 'TAP COMPLETE'}</span>
            <span>CH9 // SHARED NIGHTMARE</span>
          </div>
        </div>

        {/* Briefing */}
        <div className="text-[11px] sm:text-xs text-slate-300 leading-relaxed space-y-2">
          <p>
            Six devices still whisper through the dead lights. Their voices were{' '}
            <span className="text-rose-300 font-bold">tapped in order</span> — each one remembers only
            its own place in the queue.
          </p>
          <p>
            Before them, six rungs were re-hung out of order on the mausoleum marquee. The order is
            still scribed on each one — you just have to look.
          </p>
        </div>

        {/* Decision row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={replay}
            className="cursor-pointer px-3 py-2 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/50 hover:border-rose-400 text-rose-200 font-bold tracking-widest rounded transition-colors"
          >
            ⏵ REPLAY TRANSMISSION
          </button>
          <button
            onClick={() => onSolve('sequence')}
            className="cursor-pointer px-3 py-2 bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-500/50 hover:border-cyan-300 text-cyan-100 font-bold tracking-widest rounded transition-colors"
          >
            FORWARD: VESPER SEQUENCE →
          </button>
          <button
            onClick={() => onSolve('sequence')}
            className="cursor-pointer px-3 py-2 bg-slate-900/60 hover:bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-slate-200 font-bold tracking-widest rounded transition-colors"
          >
            TRASH // IGNORE
          </button>
        </div>

        <HintBlock>
          <p>Nothing to solve here — yet. Lock away two clues:</p>
          <p>
            <span className="text-rose-300">① six devices were tapped in order</span> — each voice remembers its place.
          </p>
          <p>
            <span className="text-cyan-300">② six marquee rungs still carry their installation years.</span>
          </p>
          <p className="text-slate-500">
            Press <span className="text-slate-300">“FORWARD: VESPER SEQUENCE →”</span> to continue.
          </p>
        </HintBlock>
      </div>
    </PuzzlePanel>
  );
};

export default StepContact;
