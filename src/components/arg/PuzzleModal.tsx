import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { gpcAudio } from '../../lib/audioEngine';
import { StepId } from '../../data/argPuzzle';
import { StepContact } from './StepContact';
import { StepSequence } from './StepSequence';
import { StepSignal } from './StepSignal';
import { StepWaveform } from './StepWaveform';
import { StepGate } from './StepGate';

interface PuzzleModalProps {
  onClose: () => void;
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
// ============================================================================

export const PuzzleModal: React.FC<PuzzleModalProps> = ({ onClose, onComplete }) => {
  // The parent mounts this component only while the puzzle is open, so a fresh
  // instance already means "opening" — initialise stage state directly and
  // greet the operator on mount.
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
    <div className="fixed inset-0 z-[90] bg-black/90 p-2 sm:p-4 md:p-6 font-mono overflow-hidden">
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
              onClick={handleDismiss}
              className="p-1 hover:bg-rose-900/60 text-slate-400 hover:text-white rounded cursor-pointer"
              title="Close transmission"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Film counter map */}
        <div className="shrink-0 flex items-center gap-2 px-3 sm:px-4 h-7 border-b border-[#141b2c] bg-[#030509] overflow-x-auto">
          {filmOrder.map((s, i) => (
            <React.Fragment key={s}>
              {i > 0 && <span className="text-slate-700 text-[9px]">·</span>}
              <span
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
              </span>
            </React.Fragment>
          ))}
        </div>

        {/* Stage body */}
        <div className="flex-1 min-h-0 p-2 sm:p-3">
          <div className="h-full flex flex-col">
            {step === 'contact' && <StepContact onSolve={advance} />}
            {step === 'sequence' && <StepSequence onSolve={advance} />}
            {step === 'signal' && <StepSignal onSolve={advance} />}
            {step === 'waveform' && <StepWaveform onSolve={advance} />}
            {step === 'gate' && <StepGate onComplete={finishGate} />}
          </div>
        </div>
      </div>

      {/* CRT overlays */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0.22) 1px, rgba(0,0,0,0) 2px)',
          mixBlendMode: 'multiply'
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.8) 100%)'
        }}
      />
    </div>
  );
};

export default PuzzleModal;
