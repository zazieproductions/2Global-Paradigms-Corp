import React from 'react';
import { Compass, Award, Shield, CheckCircle2, Quote } from 'lucide-react';
import { COMPANY_VALUES } from '../../data/values';

export const CompanyValuesView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-6 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="border-b border-[#182335] pb-4 space-y-1">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-cyan-400" />
          <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
            THE FIVE PILLARS OF PRE-EMPTIVE CERTAINTY
          </h1>
        </div>
        <p className="text-[11px] text-slate-400">
          Core Operating Doctrine & Philosophical Foundations of Global Paradigms Corporation (1971-2026)
        </p>
      </div>

      {/* 5 Pillars Cards */}
      <div className="max-w-4xl mx-auto space-y-6">
        {COMPANY_VALUES.map((pillar) => (
          <div
            key={pillar.number}
            className="p-6 bg-[#0a0e18] border border-[#1b263b] rounded-lg shadow-xl space-y-4 relative overflow-hidden"
          >
            {/* Roman Numeral Backdrop */}
            <div className="absolute top-2 right-4 text-6xl font-black text-slate-800/40 pointer-events-none select-none">
              {pillar.number}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">
                PILLAR {pillar.number} // DOCTRINAL PRINCIPLE
              </span>
              <h2 className="text-base md:text-lg font-bold text-white">
                {pillar.title}
              </h2>
              <p className="text-xs text-emerald-400 font-bold italic">
                {pillar.subtitle}
              </p>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed font-serif whitespace-pre-line bg-[#070b13] p-4 rounded border border-[#182335]">
              {pillar.doctrine}
            </p>

            <div className="p-3 bg-[#0d131f] border-l-2 border-cyan-500 rounded text-[10px] text-slate-300 space-y-1">
              <span className="font-bold text-cyan-300 block uppercase">
                OPERATIONAL APPLICATION & INFRASTRUCTURE:
              </span>
              <p>{pillar.practicalApplication}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 italic flex items-center gap-2">
              <Quote className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{pillar.executiveQuote}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
