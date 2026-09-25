import React, { useState } from 'react';
import { Building2, Users, DollarSign, ShieldAlert, Award, FileText, ChevronRight } from 'lucide-react';
import { Department } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface DepartmentsViewProps {
  departments: Department[];
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({ departments }) => {
  const [selectedDept, setSelectedDept] = useState<Department | null>(departments[0]);

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              CORPORATE DIRECTORATES & ORGANIZATIONAL CHARTERS
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            10 Primary Administrative, Scientific & Obfuscation Divisions
          </p>
        </div>

        <span className="text-[11px] px-2.5 py-1 bg-[#0d131f] border border-[#1f2c42] rounded text-slate-300 font-bold self-start md:self-auto">
          10 GLOBAL DIRECTORATES
        </span>
      </div>

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Selected Department Detail */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDept && (
            <div className="p-5 bg-[#0a0e18] border border-purple-500/40 rounded-lg shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c273c] pb-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-purple-400 text-sm font-mono tracking-wider">
                    {selectedDept.code} DIRECTORATE
                  </span>
                  <h2 className="text-base font-bold text-white">{selectedDept.name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">HEADQUARTERS:</span>
                  <span className="text-slate-300 font-bold">{selectedDept.headquarters}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#070b13] border border-[#182335] p-3 rounded text-[10px]">
                <div>
                  <span className="text-slate-500 block">DIRECTOR:</span>
                  <span className="text-slate-200 font-bold truncate block">{selectedDept.director}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">DEPUTY DIRECTOR:</span>
                  <span className="text-slate-300 truncate block">{selectedDept.deputyDirector}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">HEADCOUNT:</span>
                  <span className="text-cyan-300 font-bold">{selectedDept.headcount} Staff</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ANNUAL BUDGET:</span>
                  <span className="text-emerald-400 font-bold">{selectedDept.annualBudget}</span>
                </div>
              </div>

              {/* Public Mandate */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  PUBLIC CORPORATE MANDATE:
                </span>
                <p className="text-[11px] text-slate-300 bg-[#070b13] p-3.5 rounded border border-[#182335] leading-relaxed">
                  {selectedDept.mandate}
                </p>
              </div>

              {/* Classified Charter */}
              <div className="space-y-1">
                <span className="text-[10px] text-rose-400 font-bold block uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  CLASSIFIED OPERATIONAL DIRECTIVE (LEVEL 4+):
                </span>
                <p className="text-[11px] text-rose-200 bg-rose-950/20 p-3.5 rounded border border-rose-600/40 font-mono leading-relaxed">
                  {selectedDept.classifiedCharter}
                </p>
              </div>

              {/* Sub-Divisions */}
              <div className="space-y-2 border-t border-[#182335] pt-3">
                <span className="text-[10px] text-purple-300 font-bold block">
                  SUBORDINATE BRANCHES & SPECIALIST UNITS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDept.subDivisions.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[#080c14] border border-[#1a2336] rounded text-[11px] text-slate-200 font-bold flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Department List */}
        <div className="space-y-2">
          <div className="p-2.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg font-bold text-xs text-white">
            CORPORATE DIVISIONS (10)
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {departments.map((dept) => {
              const isSelected = selectedDept?.id === dept.id;
              return (
                <div
                  key={dept.id}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setSelectedDept(dept);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-[#0a0e18] hover:bg-[#0e1524] border-[#1b263b] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-purple-300 text-[11px] font-mono">{dept.code}</span>
                    <h3 className="font-bold text-xs truncate text-slate-200">{dept.name}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{dept.director}</p>
                  </div>

                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                    {dept.headcount}
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
