import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Terminal,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Tv,
  Radio,
  Key,
  Lock,
  Unlock,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { ClearanceLevel } from '../types';
import { gpcAudio } from '../lib/audioEngine';

interface TopHeaderProps {
  clearance: ClearanceLevel;
  onOpenClearanceModal: () => void;
  onOpenSearch: () => void;
  onOpenTerminal: () => void;
  isUnredacted: boolean;
  onToggleUnredacted: () => void;
  isCrtEnabled: boolean;
  onToggleCrt: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
  onOpenSecretSafe: () => void;
  onOpenHelp: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  clearance,
  onOpenClearanceModal,
  onOpenSearch,
  onOpenTerminal,
  isUnredacted,
  onToggleUnredacted,
  isCrtEnabled,
  onToggleCrt,
  isSoundMuted,
  onToggleSound,
  onOpenSecretSafe,
  onOpenHelp
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [pulsePhase, setPulsePhase] = useState<number>(14.802);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'UTC'));
      // Subtle micro-drift simulation of the 14.8Hz carrier
      const drift = 14.802 + Math.sin(now.getTime() * 0.0005) * 0.006;
      setPulsePhase(Number(drift.toFixed(3)));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getClearanceColor = (lvl: ClearanceLevel) => {
    if (lvl.includes('Level 5')) return 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse';
    if (lvl.includes('Level 4')) return 'bg-amber-950 text-amber-300 border-amber-500';
    if (lvl.includes('Level 3')) return 'bg-cyan-950 text-cyan-300 border-cyan-500';
    if (lvl.includes('Level 2')) return 'bg-blue-950 text-blue-300 border-blue-500';
    return 'bg-slate-900 text-slate-300 border-slate-700';
  };

  return (
    <header className="h-14 bg-[#090d14] border-b border-[#1b2538] flex items-center justify-between px-3 md:px-4 font-mono select-none z-40 text-xs shrink-0 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
      {/* Brand & Corporate Designation */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 via-indigo-600 to-rose-600 p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.35)] flex items-center justify-center">
            <div className="w-full h-full bg-[#070a12] rounded-[2px] flex items-center justify-center">
              <span className="text-cyan-400 font-black text-xs tracking-tighter">GPC</span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-wider text-sm">
                GLOBAL PARADIGMS CORP.
              </span>
              <span className="hidden sm:inline-block text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
                PARADIGM-OS v8.4.2
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="truncate max-w-[200px] md:max-w-none">
                ARCHIVE NET // STRATEGIC FORECASTING & CIVIC CONTINUITY
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Infrasound Status */}
      <div className="hidden xl:flex items-center gap-4 bg-[#05070d] border border-[#162033] px-3 py-1 rounded">
        <div className="flex items-center gap-1.5 text-[11px]">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-slate-400">PLANETARY CARRIER:</span>
          <span className="text-cyan-300 font-bold">{pulsePhase} Hz</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#39ff14]"></span>
          <span className="text-slate-400">22 STATIONS ONLINE</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="text-[10px] text-slate-400">
          <span className="text-amber-400 font-semibold">{currentTime}</span>
        </div>
      </div>

      {/* Action Controls & Clearance Pill */}
      <div className="flex items-center gap-2">
        {/* Global Search Button */}
        <button
          onClick={() => {
            gpcAudio.playUiSound('click');
            onOpenSearch();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0f1523] hover:bg-[#151e33] text-slate-200 border border-[#22304d] hover:border-cyan-500/50 rounded transition-all cursor-pointer text-xs"
          title="Global Archive Search (Ctrl+K or /)"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline text-[11px]">SEARCH ARCHIVE</span>
          <kbd className="hidden lg:inline text-[9px] px-1 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">
            /
          </kbd>
        </button>

        {/* Redaction Toggle */}
        <button
          onClick={() => {
            gpcAudio.playUiSound('unredact');
            onToggleUnredacted();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer border ${
            isUnredacted
              ? 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-[0_0_12px_rgba(255,0,85,0.4)] animate-pulse'
              : 'bg-[#0f1523] text-slate-300 hover:text-white border-[#22304d]'
          }`}
          title={isUnredacted ? 'De-Scrambler Active: Black Redactions Revealed' : 'Enable Redaction De-Scrambler'}
        >
          {isUnredacted ? <Eye className="w-3.5 h-3.5 text-rose-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
          <span className="hidden sm:inline text-[11px]">
            {isUnredacted ? 'DE-SCRAMBLER: ON' : 'REDACTED'}
          </span>
        </button>

        {/* Command Terminal Backdoor */}
        <button
          onClick={() => {
            gpcAudio.playUiSound('scan');
            onOpenTerminal();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0f1523] hover:bg-[#151e33] text-cyan-300 border border-[#22304d] hover:border-cyan-500/60 rounded transition-all cursor-pointer text-xs"
          title="Open GPC Command Terminal (~)"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline text-[11px]">GPC://CLI</span>
        </button>

        {/* Whistleblower Cryptographic Safe */}
        <button
          onClick={() => {
            gpcAudio.playUiSound('click');
            onOpenSecretSafe();
          }}
          className="p-1.5 bg-[#0f1523] hover:bg-amber-950/40 text-amber-400 border border-[#22304d] hover:border-amber-500/50 rounded transition-all cursor-pointer"
          title="Whistleblower Cryptographic Safe (Project Palimpsest Bypass)"
        >
          <Key className="w-3.5 h-3.5" />
        </button>

        {/* CRT Mode Toggle */}
        <button
          onClick={() => {
            gpcAudio.playUiSound('click');
            onToggleCrt();
          }}
          className={`p-1.5 rounded transition-all cursor-pointer border ${
            isCrtEnabled
              ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-[0_0_8px_#00f0ff]'
              : 'bg-[#0f1523] text-slate-400 hover:text-slate-200 border-[#22304d]'
          }`}
          title="Toggle Retro CRT Scanline Display Mode"
        >
          <Tv className="w-3.5 h-3.5" />
        </button>

        {/* Sound Effects Toggle */}
        <button
          onClick={() => {
            onToggleSound();
            gpcAudio.playUiSound('click');
          }}
          className={`p-1.5 rounded transition-all cursor-pointer border ${
            !isSoundMuted
              ? 'bg-[#0f1523] text-cyan-400 border-[#22304d]'
              : 'bg-rose-950/50 text-rose-400 border-rose-800'
          }`}
          title={!isSoundMuted ? 'Mute Mechanical UI Sounds' : 'Unmute UI Sound Effects'}
        >
          {!isSoundMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Clearance Level Badge */}
        <button
          onClick={() => {
            gpcAudio.playUiSound('click');
            onOpenClearanceModal();
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold tracking-wider cursor-pointer transition-all ${getClearanceColor(
            clearance
          )}`}
          title="Click to authenticate or elevate Security Clearance"
        >
          <Shield className="w-3 h-3" />
          <span className="truncate max-w-[90px] md:max-w-none">{clearance.toUpperCase()}</span>
        </button>

        {/* Help / Archive Guide */}
        <button
          onClick={() => {
            gpcAudio.playUiSound('click');
            onOpenHelp();
          }}
          className="p-1.5 bg-[#0f1523] hover:bg-slate-800 text-slate-400 hover:text-white border border-[#22304d] rounded transition-all cursor-pointer"
          title="About Global Paradigms Corp. Archive & Architecture Guide"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
