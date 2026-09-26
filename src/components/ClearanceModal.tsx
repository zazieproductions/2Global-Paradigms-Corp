import React, { useState } from 'react';
import { Shield, X, Lock, Unlock, CheckCircle2, AlertOctagon, Key } from 'lucide-react';
import { ClearanceLevel } from '../types';
import { gpcAudio } from '../lib/audioEngine';
import { useArg } from '../arg/ArgContext';
import { clearanceRank } from '../arg/levels';
import { LEVEL_CORRESPONDENCE, SEALS } from '../arg/seals';
import { PlanetGlyph } from '../arg/sigils';

const DEGREES = ['', 'Neophyte', 'Zelator', 'Practicus', 'Philosophus', 'Magister Umbrae'];
const EARNED_BY: Record<number, string> = {
  1: 'Granted on connection',
  2: 'Earned by breaking Seal I — The Square of Lead',
  3: 'Earned by breaking Seal II — The Wheel of Days',
  4: 'Earned by breaking Seal IV — The Three Voices',
  5: 'Earned by breaking Seal VI — The Mercury Wheel'
};

interface ClearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentClearance: ClearanceLevel;
  onSetClearance: (level: ClearanceLevel) => void;
  onEnableUnredacted: () => void;
  onOpenSanctum: () => void;
}

export const ClearanceModal: React.FC<ClearanceModalProps> = ({
  isOpen,
  onClose,
  currentClearance,
  onSetClearance,
  onOpenSanctum
}) => {
  const arg = useArg();
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const levels: { level: ClearanceLevel; label: string; desc: string; color: string }[] = [
    {
      level: 'Level 1 - General',
      label: 'Level 1 // General Corporate',
      desc: 'Public press releases, company values, general announcements, and basic employee guidelines.',
      color: 'border-slate-600 text-slate-300'
    },
    {
      level: 'Level 2 - Confidential',
      label: 'Level 2 // Confidential Operational',
      desc: 'Standard field station logs, routine engineering tickets, and department organizational charters.',
      color: 'border-blue-500 text-blue-300'
    },
    {
      level: 'Level 3 - Secret',
      label: 'Level 3 // Secret Directorate',
      desc: 'Station telemetry logs, Project Cicada specs, Compound 88-T clinical data, and legal settlement summaries.',
      color: 'border-cyan-500 text-cyan-300'
    },
    {
      level: 'Level 4 - Top Secret',
      label: 'Level 4 // Top Secret / NOFORN',
      desc: 'Project Vesper blueprints, Oakhaven trial post-mortems, Reson-8 casualty audits, and Site 19 fissure logs.',
      color: 'border-amber-500 text-amber-300'
    },
    {
      level: 'Level 5 - Black Dossier',
      label: 'Level 5 // Black Dossier / Sanitized',
      desc: 'Project Monolith mantle beacon telemetry, Dr. Arthur Vance-Vane disavowal files, and Palimpsest raw leaks.',
      color: 'border-rose-500 text-rose-300'
    }
  ];

  const handleSelectLevel = (lvl: ClearanceLevel) => {
    if (clearanceRank(lvl) > arg.earnedLevel) {
      gpcAudio.playUiSound('deny');
      setAuthError(`DEGREE NOT YET EARNED. ${EARNED_BY[clearanceRank(lvl)].toUpperCase()}.`);
      return;
    }
    gpcAudio.playUiSound('grant');
    onSetClearance(lvl);
    setSuccessMsg(`Clearance updated to ${lvl}`);
    setAuthError('');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  const handleVerifyMasterKey = (e: React.FormEvent) => {
    e.preventDefault();
    gpcAudio.playUiSound('deny');
    const code = passcode.trim();
    setAuthError(
      code === '432-88'
        ? 'MASTER KEY 01 (D. CROSS) WAS REVOKED ON 1989-11-04, THE NIGHT OF THE DESCENT. THE ORDER DOES NOT OPEN FOR KEYS.'
        : 'NO MASTER KEYS REMAIN IN SERVICE. DEGREES ARE EARNED THROUGH THE SEALS.'
    );
    setPasscode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none font-mono text-xs">
      <div className="bg-[#0b0f19] border border-[#23314a] rounded-lg max-w-lg w-full p-6 shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col text-slate-200">
        <div className="flex items-center justify-between border-b border-[#1c273c] pb-3 mb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Shield className="w-5 h-5" />
            <span>SECURITY CLEARANCE PROFILER</span>
          </div>
          <button
            onClick={() => {
              gpcAudio.playUiSound('click');
              onClose();
            }}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-[#070b13] border border-[#182335] rounded flex items-center justify-between">
            <span className="text-[11px] text-slate-400">CURRENT CLEARANCE:</span>
            <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-700">
              {currentClearance.toUpperCase()}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold block">
              SELECT AUTHORIZATION LEVEL:
            </span>
            {levels.map((item) => {
              const isCurrent = currentClearance === item.level;
              const r = clearanceRank(item.level);
              const earned = r <= arg.earnedLevel;
              return (
                <div
                  key={item.level}
                  onClick={() => handleSelectLevel(item.level)}
                  className={`p-3 rounded border cursor-pointer transition-all ${item.color} ${
                    isCurrent
                      ? 'bg-slate-800/80 font-bold ring-1 ring-cyan-400'
                      : 'bg-[#06080e] hover:bg-[#111724]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold text-xs flex items-center gap-2 ${earned ? '' : 'opacity-50'}`}>
                      <PlanetGlyph glyph={LEVEL_CORRESPONDENCE[r].glyph} />
                      {item.label}
                      <span className="text-[9px] font-normal text-fuchsia-300/70 font-occult">
                        {earned && arg.earnedLevel >= 3 ? `· ${DEGREES[r]}` : ''}
                      </span>
                    </span>
                    {!earned && <Lock className="w-3 h-3 text-slate-500" />}
                    {isCurrent && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                    {item.desc}
                  </p>
                  <p className={`text-[9px] mt-1 ${earned ? 'text-emerald-500/70' : 'text-slate-500'}`}>
                    {earned ? '✓ ' : '✕ '}{EARNED_BY[r]}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Master Key Bypass Input */}
          <form onSubmit={handleVerifyMasterKey} className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-bold block flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              LEGACY EXECUTIVE MASTER KEY (DEPRECATED):
            </span>
            <div className="flex gap-2">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter master key..."
                className="flex-1 bg-[#06080e] border border-[#1b2538] rounded px-3 py-1.5 text-slate-100 text-xs focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded cursor-pointer transition-colors"
              >
                ELEVATE
              </button>
            </div>
          </form>

          <button
            onClick={onOpenSanctum}
            className="w-full py-2 rounded border border-fuchsia-800 text-fuchsia-300 hover:bg-fuchsia-950/40 cursor-pointer font-occult tracking-widest text-[11px]"
          >
            {arg.currentSeal ? `CONTINUE AT SEAL ${SEALS[arg.currentSeal - 1].numeral} — ${SEALS[arg.currentSeal - 1].title.toUpperCase()}` : 'VIEW THE CASE FILE'}
          </button>

          {authError && (
            <div className="text-[10px] text-rose-400 font-bold flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>{authError}</span>
            </div>
          )}

          {successMsg && (
            <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
