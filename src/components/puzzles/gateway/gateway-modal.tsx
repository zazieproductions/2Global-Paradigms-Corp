import { useCallback, useEffect, useRef, useState, type FC, Fragment } from 'react';
import { X } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { useProgression } from '@/hooks/use-progression';
import { gpcAudio } from '@/lib/audio/audio-engine';
import type { StepId } from '@/content/puzzles/gateway';
import { StepContact } from './step-contact';
import { StepSequence } from './step-sequence';
import { StepSignal } from './step-signal';
import { StepWaveform } from './step-waveform';
import { StepGate } from './step-gate';

interface GatewayModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after the gate is recorded (the shell routes to /sanctum). */
  onComplete: () => void;
}

const STEP_LABEL: Record<StepId, string> = {
  contact: 'INTERCEPT',
  sequence: 'VESPER SEQUENCE',
  signal: 'THE SIGNAL',
  waveform: 'THE WAVEFORM',
  gate: 'THE GATE'
};

// ============================================================================
// GATEWAY TRANSMISSION — the beginner ARG puzzle host.
// ----------------------------------------------------------------------------
// Owns the stage machine: contact → sequence → signal → waveform → gate.
// A persistent "VSFTRACE" film counter doubles as the step map (pulsing on
// the current stage) so the player always knows how deep they are.
// Every stage validates through the progression store (digests only), so
// stage completions, assisted reveals and replays are all recorded.
// ============================================================================

export const GatewayModal: FC<GatewayModalProps> = ({ open, onClose, onComplete }) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Gateway Transmission"
    description="A five-stage intercept: contact, the Vesper sequence, the signal, the waveform and the gate."
    size="full"
    tone="order"
    hideTitleBar
    className="bg-black/90! border-0! p-0!"
    bodyClassName="h-full"
  >
    {open && <GatewayHost onClose={onClose} onComplete={onComplete} />}
  </Modal>
);

const GatewayHost: FC<Omit<GatewayModalProps, 'open'>> = ({ onClose, onComplete }) => {
  const { attempt } = useProgression();
  const verifier = useCallback(
    (puzzleId: string) => (input: string) => attempt(puzzleId, input).ok,
    [attempt]
  );
  const verifyGate = useCallback((joined: string) => attempt('gateway-transmission', joined).ok, [attempt]);
  // A fresh instance means "opening" — greet the operator on mount.
  const [step, setStep] = useState<StepId>('contact');
  const [exitAnim, setExitAnim] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    gpcAudio.playUiSound('scan');
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, []);

  const advance = (next: StepId) => {
    gpcAudio.playUiSound('grant');
    setStep(next);
  };

  const finishGate = () => {
    gpcAudio.playUiSound('unredact');
    setExitAnim(true);
    closeTimer.current = window.setTimeout(() => {
      setExitAnim(false);
      onClose();
      onComplete();
    }, 700);
  };

  const handleDismiss = () => {
    gpcAudio.playUiSound('click');
    setExitAnim(true);
    closeTimer.current = window.setTimeout(() => {
      setExitAnim(false);
      onClose();
    }, 620);
  };

  const filmOrder: StepId[] = ['contact', 'sequence', 'signal', 'waveform', 'gate'];
  const idx = filmOrder.indexOf(step);

  return (
    <div className="relative h-full p-0 sm:p-2 md:p-4 font-mono overflow-hidden">
      <div
        className="relative w-full h-full flex flex-col bg-[#01020a]"
        style={
          exitAnim
            ? { animation: 'gate-crt-off 0.62s ease-in forwards' }
            : { animation: 'gate-crt-on 0.5s ease-out both' }
        }
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-3 sm:px-4 h-11 border-b border-cyan-500/25 bg-[#05070d]">
          <div className="flex items-center gap-2 text-cyan-300 font-bold tracking-wider text-[10px] sm:text-xs">
            <span className="text-fuchsia-400">◈</span> GATEWAY TRANSMISSION
            <span className="hidden sm:inline text-slate-600 font-normal">
              // PARADIGM-OS SUB-CHANNEL CH9
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-500 tracking-widest hidden sm:inline">
              STAGE {idx + 1}/5
            </span>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 hover:bg-rose-900/60 text-slate-400 hover:text-white rounded cursor-pointer"
              title="Close transmission"
              aria-label="Close transmission"
            >
              <X className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* Film counter map */}
        <ol
          className="shrink-0 flex items-center gap-2 px-3 sm:px-4 h-7 border-b border-[#141b2c] bg-[#030509] overflow-x-auto"
          aria-label={`Stage ${idx + 1} of 5`}
        >
          {filmOrder.map((s, i) => (
            <Fragment key={s}>
              {i > 0 && (
                <li className="text-slate-700 text-[9px]" aria-hidden>
                  ·
                </li>
              )}
              <li
                aria-current={i === idx ? 'step' : undefined}
                className={`text-[9px] tracking-widest whitespace-nowrap ${
                  i < idx
                    ? 'text-emerald-400'
                    : i === idx
                      ? 'text-cyan-300 font-bold animate-pulse'
                      : 'text-slate-600'
                }`}
              >
                {i < idx ? '✓ ' : i === idx ? '▸ ' : ''}
                {STEP_LABEL[s]}
              </li>
            </Fragment>
          ))}
        </ol>

        {/* Stage body */}
        <div className="flex-1 min-h-0 p-2 sm:p-3">
          <div className="h-full flex flex-col">
            {step === 'contact' && <StepContact onSolve={advance} />}
            {step === 'sequence' && <StepSequence onSolve={advance} verify={verifier('gateway-sequence')} />}
            {step === 'signal' && <StepSignal onSolve={advance} verify={verifier('gateway-signal')} />}
            {step === 'waveform' && <StepWaveform onSolve={advance} verify={verifier('gateway-waveform')} />}
            {step === 'gate' && <StepGate onComplete={finishGate} verify={verifyGate} />}
          </div>
        </div>
      </div>

      {/* CRT overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.22) 1px, rgba(0,0,0,0) 2px)',
          mixBlendMode: 'multiply'
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.8) 100%)'
        }}
      />
    </div>
  );
};
