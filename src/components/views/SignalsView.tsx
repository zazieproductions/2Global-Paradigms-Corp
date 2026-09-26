import React, { useState } from 'react';
import {
  AudioWaveform,
  Radio,
  Activity,
  Lock,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Terminal as TerminalIcon
} from 'lucide-react';
import { GanderBeacon } from '../signals/GanderBeacon';
import { RavensportCarrier } from '../signals/RavensportCarrier';
import { SpectralPrint } from '../signals/SpectralPrint';
import { useSignalChain } from '../../lib/signalChainContext';
import { gpcAudio } from '../../lib/audioEngine';

interface SignalsViewProps {
  onOpenTerminal: () => void;
  onGrantBlackDossier?: () => void;
}

export const SignalsView: React.FC<SignalsViewProps> = ({ onOpenTerminal, onGrantBlackDossier }) => {
  const chain = useSignalChain();
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(() => {
    if (chain.isSolved(2)) return 3;
    if (chain.isSolved(1)) return 2;
    return 1;
  });

  const stages = [
    {
      id: 1 as const,
      code: 'SIG-01-GANDER',
      label: 'Gander Beacon',
      icon: Radio,
      blurb: '620 Hz Morse keyer — spells the name of the house'
    },
    {
      id: 2 as const,
      code: 'SIG-02-RAVENSPORT',
      label: 'Ravensport Carrier',
      icon: AudioWaveform,
      blurb: 'Five-letter groups — live Vigenère workbench'
    },
    {
      id: 3 as const,
      code: 'SIG-03-HOLDTONE',
      label: 'Hold-Tone Print',
      icon: Activity,
      blurb: 'Waterfall spectrogram — the word inside the spiral'
    }
  ];

  const keyChips = [
    { n: 1, label: 'KEY ONE', value: 'HOUSE NAME' },
    { n: 2, label: 'KEY TWO', value: 'AUTHORISATION WORD' },
    { n: 3, label: 'KEY THREE', value: 'THE PRINT' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <AudioWaveform className="w-5 h-5 text-amber-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              SIGNALS & INTERCEPTS — THREE LINKED CARRIERS
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Off-book transmissions held at Station 23. Each carrier yields the key that unseals the next.
          </p>
        </div>

        <button
          onClick={() => {
            gpcAudio.playUiSound('scan');
            onOpenTerminal();
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#111827] hover:bg-[#1a2438] border border-cyan-700/60 text-cyan-300 font-bold rounded cursor-pointer transition-colors text-[11px]"
        >
          <TerminalIcon className="w-3.5 h-3.5" />
          OPEN TERMINAL ( ~ )
        </button>
      </div>

      {/* Chain progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {keyChips.map((chip) => {
          const solved = chip.n === 1 ? chain.isSolved(1) : chip.n === 2 ? chain.isSolved(2) : chain.isSolved(3);
          const key =
            chip.n === 1 ? chain.keys.one : chip.n === 2 ? chain.keys.two : chain.keys.three;
          const discovered = chain.discovered.includes(key.toLowerCase());
          return (
            <div
              key={chip.n}
              className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                solved
                  ? 'bg-emerald-950/30 border-emerald-600/60'
                  : discovered
                  ? 'bg-amber-950/25 border-amber-600/50'
                  : 'bg-[#0a0e18] border-[#1b263b]'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  {solved ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  )}
                  <span className="text-[10px] font-bold text-white">{chip.label}</span>
                  <span className="text-[9px] text-slate-500 truncate">{chip.value}</span>
                </div>
                <div className="text-[10px] mt-1 font-mono tracking-[0.25em]">
                  {solved ? (
                    <span className="text-emerald-300 font-bold">{key} — TRANSMITTED</span>
                  ) : discovered ? (
                    <span className="text-amber-300 font-bold">{key} — RECOVERED, NOT SENT</span>
                  ) : (
                    <span className="text-slate-600">████ — NOT RECOVERED</span>
                  )}
                </div>
              </div>
              <KeyRound
                className={`w-4 h-4 shrink-0 ${
                  solved ? 'text-emerald-400' : discovered ? 'text-amber-400' : 'text-slate-700'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Stage switcher */}
      <div className="flex items-center gap-1 bg-[#0d131f] border border-[#1f2c42] rounded p-0.5 text-[11px] overflow-x-auto">
        {stages.map((s) => {
          const open = chain.isStageOpen(s.id);
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => {
                gpcAudio.playUiSound('click');
                setActiveStage(s.id);
              }}
              title={s.blurb}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-all font-bold cursor-pointer whitespace-nowrap ${
                activeStage === s.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {open ? <Icon className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>
                0{s.id} {s.label}
              </span>
              {!open && <span className="text-[9px] opacity-70">SEALED</span>}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-2 pr-1">
          <button
            onClick={() => {
              gpcAudio.playUiSound('deny');
              chain.resetChain();
            }}
            className="flex items-center gap-1 px-2 py-1 text-[9px] text-slate-500 hover:text-rose-300 cursor-pointer rounded"
            title="Clear all recovered keys and re-seal the chain"
          >
            <RotateCcw className="w-3 h-3" />
            RESET CHAIN
          </button>
        </div>
      </div>

      {/* Panels */}
      {activeStage === 1 && <GanderBeacon />}
      {activeStage === 2 && <RavensportCarrier />}
      {activeStage === 3 && <SpectralPrint onGrantBlackDossier={onGrantBlackDossier} />}

      {/* Chain explainer */}
      <div className="p-3 bg-[#0a0e18] border border-[#1b263b] rounded text-[10px] text-slate-500 leading-relaxed">
        CHAIN OF CUSTODY: <span className="text-slate-300">SIG-01</span> keyer → house name (
        <span className="text-amber-300">key one</span>) → unseals <span className="text-slate-300">SIG-02</span>{' '}
        Vigenère traffic → names its own authorisation word (<span className="text-amber-300">key two</span>) →
        unseals <span className="text-slate-300">SIG-03</span> waterfall → paints the word the spiral has carried
        since 2006 (<span className="text-amber-300">key three</span>) → final hold-tone disclosure. Keys are
        transmitted at the terminal with{' '}
        <span className="text-cyan-300 font-bold">key &lt;word&gt;</span>; type{' '}
        <span className="text-cyan-300 font-bold">signals</span> for status.
      </div>
    </div>
  );
};
