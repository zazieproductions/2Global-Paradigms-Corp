import React, { useEffect, useState } from 'react';
import { OrderSigil } from './sigils';
import { PROLOGUE_TRANSMISSION } from './seals';
import { gpcAudio } from '../lib/audioEngine';

/**
 * First-run onboarding: Thorne's dead-drop "breaks into" the archive right
 * after the cold boot, typing itself out like a live intercept.
 */
export const PrologueModal: React.FC<{ callsign: string; onBegin: () => void; onDismiss: () => void }> = ({
  callsign,
  onBegin,
  onDismiss
}) => {
  const [shown, setShown] = useState(0);
  const text = PROLOGUE_TRANSMISSION;
  const done = shown >= text.length;

  useEffect(() => {
    if (done) return;
    const id = setTimeout(() => {
      setShown((n) => Math.min(text.length, n + 4));
      if (Math.random() < 0.15) gpcAudio.playUiSound('keystroke');
    }, 12);
    return () => clearTimeout(id);
  }, [shown, done, text.length]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm p-3 font-mono">
      <div className="absolute inset-0 ovp-vignette pointer-events-none" />
      <div className="relative max-w-2xl w-full rounded-lg border border-fuchsia-800/60 bg-[#07050b] shadow-[0_0_80px_rgba(192,38,211,0.25)] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-fuchsia-900/60 bg-fuchsia-950/20 text-[10px] tracking-[0.3em]">
          <span className="text-fuchsia-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse" /> UNSCHEDULED TRANSMISSION ON CHANNEL 9
          </span>
          <span className="text-slate-600">FOR: {callsign.toUpperCase()}</span>
        </div>
        <div className="p-5 flex gap-5">
          <div className="hidden sm:block text-fuchsia-400/70 shrink-0 ovp-breathe">
            <OrderSigil size={88} spin />
          </div>
          <div
            className="flex-1 max-h-[55vh] overflow-y-auto scrollbar-thin text-[12px] leading-relaxed text-slate-300 whitespace-pre-line cursor-pointer"
            onClick={() => setShown(text.length)}
            title="Click to reveal the whole message"
          >
            {text.slice(0, shown)}
            {!done && <span className="boot-caret text-fuchsia-400">█</span>}
          </div>
        </div>
        <div className="px-5 pb-5 flex flex-wrap items-center justify-between gap-3">
          <button onClick={onDismiss} className="text-[10px] text-slate-600 hover:text-slate-400 cursor-pointer">
            ignore the message and browse the archive
          </button>
          <button
            onClick={onBegin}
            disabled={!done}
            className="px-5 py-2.5 rounded bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-30 text-white font-occult font-bold tracking-[0.25em] text-xs cursor-pointer"
          >
            BEGIN AT THE FIRST SEAL
          </button>
        </div>
      </div>
    </div>
  );
};
