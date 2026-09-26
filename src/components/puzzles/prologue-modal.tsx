import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { OrderSigil } from '@/components/ui/sigils';
import { PROLOGUE_TRANSMISSION } from '@/content/puzzles/seals';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gpcAudio } from '@/lib/audio/audio-engine';

/**
 * First-run onboarding: Thorne's dead-drop "breaks into" the archive right
 * after the cold boot, typing itself out like a live intercept. The full text
 * is always available to assistive tech, and the typing can be skipped
 * (click / "SHOW ALL") or is skipped entirely under reduced motion.
 */
export function PrologueModal({
  open,
  callsign,
  onBegin,
  onDismiss
}: {
  open: boolean;
  callsign: string;
  onBegin: () => void;
  onDismiss: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onDismiss}
      title="Unscheduled transmission on Channel 9"
      tone="order"
      size="2xl"
      variant="window"
      className="bg-[#07050b]!"
      headerActions={
        <span className="text-micro text-slate-600 hidden sm:inline">FOR: {callsign.toUpperCase()}</span>
      }
    >
      {open && <PrologueBody onBegin={onBegin} onDismiss={onDismiss} />}
    </Modal>
  );
}

function PrologueBody({ onBegin, onDismiss }: { onBegin: () => void; onDismiss: () => void }) {
  const reduced = useReducedMotion();
  const text = PROLOGUE_TRANSMISSION;
  const [shown, setShown] = useState(reduced ? text.length : 0);
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
    <>
      <div className="absolute inset-0 ovp-vignette pointer-events-none" aria-hidden />
      <div className="relative p-5 flex gap-5">
        <div className="hidden sm:block text-fuchsia-400/70 shrink-0 ovp-breathe" aria-hidden>
          <OrderSigil size={88} spin />
        </div>
        <div className="flex-1 max-h-[55vh] overflow-y-auto scrollbar-thin text-[12px] leading-relaxed text-slate-300 whitespace-pre-line">
          {/* Full message for screen readers; the typed copy is visual only. */}
          <p className="sr-only">{text}</p>
          <p aria-hidden>
            {text.slice(0, shown)}
            {!done && <span className="boot-caret text-fuchsia-400">█</span>}
          </p>
        </div>
      </div>
      <div className="relative px-5 pb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onDismiss}
          className="text-caption text-slate-600 hover:text-slate-400 cursor-pointer"
        >
          ignore the message and browse the archive
        </button>
        <div className="flex items-center gap-2">
          {!done && (
            <button
              type="button"
              onClick={() => setShown(text.length)}
              className="px-3 py-2 rounded border border-fuchsia-800/60 text-fuchsia-300 text-caption tracking-widest cursor-pointer hover:bg-fuchsia-950/40"
            >
              SHOW ALL
            </button>
          )}
          <button
            type="button"
            onClick={onBegin}
            className="px-5 py-2.5 rounded bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-occult font-bold tracking-[0.25em] text-xs cursor-pointer"
          >
            BEGIN AT THE FIRST SEAL
          </button>
        </div>
      </div>
    </>
  );
}
