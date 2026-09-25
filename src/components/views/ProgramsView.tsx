import React, { useState } from 'react';
import {
  FolderLock,
  Search,
  ShieldAlert,
  Calendar,
  AlertOctagon,
  Building2,
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import { InternalProgram } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface ProgramsViewProps {
  programs: InternalProgram[];
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({ programs }) => {
  const [selectedProgram, setSelectedProgram] = useState<InternalProgram | null>(programs[0]);
  const [threatFilter, setThreatFilter] = useState<string>('all');

  const filteredPrograms = programs.filter((pr) => {
    if (threatFilter === 'all') return true;
    return pr.threatLevel === threatFilter;
  });

  const getThreatBadge = (level: InternalProgram['threatLevel']) => {
    switch (level) {
      case 'Existential':
        return 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse font-bold';
      case 'Critical':
        return 'bg-red-950 text-red-300 border-red-600 font-bold';
      case 'High':
        return 'bg-amber-950 text-amber-300 border-amber-600';
      case 'Moderate':
        return 'bg-cyan-950 text-cyan-300 border-cyan-600';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-rose-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              INTERNAL PROGRAM DOSSIERS & BLACK BUDGET PROJECTS
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            14 Active & Covert Global Strategic Operations // Executive Governance
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px]">
          {['all', 'Existential', 'Critical', 'High', 'Moderate'].map((threat) => (
            <button
              key={threat}
              onClick={() => {
                gpcAudio.playUiSound('click');
                setThreatFilter(threat);
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                threatFilter === threat
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-600 font-bold'
                  : 'bg-[#0d131f] text-slate-400 hover:text-slate-200 border border-[#1f2c42]'
              }`}
            >
              {threat === 'all' ? 'All Threat Levels' : threat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Program Detail + List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Program Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedProgram && (
            <div className="p-5 bg-[#0a0e18] border border-rose-500/40 rounded-lg shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c273c] pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-400 text-sm font-mono">
                      {selectedProgram.code}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded border ${getThreatBadge(selectedProgram.threatLevel)}`}>
                      THREAT: {selectedProgram.threatLevel.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedProgram.name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">START YEAR:</span>
                  <span className="text-slate-300 font-bold">{selectedProgram.startYear}</span>
                </div>
              </div>

              {/* Program Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#070b13] border border-[#182335] p-3 rounded text-[10px]">
                <div>
                  <span className="text-slate-500 block">DIRECTOR:</span>
                  <span className="text-slate-200 truncate block">{selectedProgram.director}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ANNUAL BUDGET:</span>
                  <span className="text-emerald-400 font-bold">{selectedProgram.budgetAnnual}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">STATUS:</span>
                  <span className="text-cyan-300 font-bold">{selectedProgram.status.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CLEARANCE:</span>
                  <span className="text-amber-400 font-bold">{selectedProgram.clearance.split(' - ')[0]}</span>
                </div>
              </div>

              {/* Public Cover Story vs Classified Reality */}
              <div className="space-y-3">
                <div className="p-3.5 bg-[#070b13] border-l-2 border-slate-600 rounded space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">
                    PUBLIC COVER STORY / REGULATORY FILING:
                  </span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {selectedProgram.publicCoverStory}
                  </p>
                </div>

                <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-500 rounded space-y-1">
                  <span className="text-[10px] text-rose-400 font-bold block uppercase flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    CLASSIFIED OPERATIONAL REALITY (LEVEL 4+ EYES ONLY):
                  </span>
                  <p className="text-[11px] text-rose-200 leading-relaxed font-mono">
                    {selectedProgram.classifiedReality}
                  </p>
                </div>
              </div>

              {/* Objective */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block">STRATEGIC OBJECTIVE:</span>
                <p className="text-[11px] text-slate-300 bg-[#070b13] p-3 rounded border border-[#182335] leading-relaxed">
                  {selectedProgram.objective}
                </p>
              </div>

              {/* Historical Milestones */}
              <div className="space-y-2 border-t border-[#182335] pt-3">
                <span className="text-[10px] text-amber-400 font-bold block">
                  PROGRAM MILESTONES & DISCLOSURES:
                </span>
                <div className="space-y-1.5">
                  {selectedProgram.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2 bg-[#080c14] border border-[#1a2336] rounded text-[10px]"
                    >
                      <span className="font-bold text-cyan-400 shrink-0 font-mono">{m.year}:</span>
                      <span className="text-slate-300 leading-normal">{m.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Program List */}
        <div className="space-y-2">
          <div className="p-2.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg font-bold text-xs text-white">
            PROJECT DOSSIERS ({filteredPrograms.length})
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredPrograms.map((pr) => {
              const isSelected = selectedProgram?.id === pr.id;
              return (
                <div
                  key={pr.id}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setSelectedProgram(pr);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-[#0a0e18] hover:bg-[#0e1524] border-[#1b263b] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-rose-300 text-[11px] font-mono">{pr.code}</span>
                      <span className="text-[9px] text-slate-500 truncate">{pr.startYear}</span>
                    </div>
                    <h3 className="font-bold text-xs truncate text-slate-200">{pr.name}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{pr.budgetAnnual} / yr</p>
                  </div>

                  <span className={`text-[8px] px-1.5 py-0.2 rounded border shrink-0 ${getThreatBadge(pr.threatLevel)}`}>
                    {pr.threatLevel.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
