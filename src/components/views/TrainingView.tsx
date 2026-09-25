import React, { useState } from 'react';
import { GraduationCap, Award, Clock, BookOpen, ArrowRight, ShieldCheck } from 'lucide-react';
import { TrainingModule } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface TrainingViewProps {
  modules: TrainingModule[];
  onOpenModule: (module: TrainingModule) => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({ modules, onOpenModule }) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              EMPLOYEE ONBOARDING & PSYCHOLOGICAL COMPLIANCE MODULES
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            4 Mandatory Training Courses with Interactive Certification Quizzes
          </p>
        </div>

        <span className="text-[11px] px-2.5 py-1 bg-amber-950/40 border border-amber-600/60 rounded text-amber-300 font-bold self-start md:self-auto">
          MANDATORY ANNUAL CERTIFICATION
        </span>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="p-5 bg-[#0a0e18] border border-[#1b263b] hover:border-amber-500/50 rounded-lg shadow-lg flex flex-col justify-between space-y-4 group transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#182335] pb-2">
                <span className="font-bold text-amber-400 text-xs">{mod.moduleCode}</span>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mod.estimatedMinutes} MINS
                </span>
              </div>

              <h2 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {mod.title}
              </h2>

              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                {mod.overview}
              </p>

              <div className="p-2.5 bg-[#070b13] border border-[#182335] rounded text-[10px] text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="truncate">AWARDS: {mod.certificationTitle}</span>
              </div>
            </div>

            <button
              onClick={() => {
                gpcAudio.playUiSound('click');
                onOpenModule(mod);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded cursor-pointer transition-colors shadow-md text-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>START TRAINING MODULE</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
