import React, { useState } from 'react';
import { Clock, Calendar, Shield, Filter, AlertTriangle, ChevronRight } from 'lucide-react';
import { TimelineEntry } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface TimelineViewProps {
  timeline: TimelineEntry[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline }) => {
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [covertOnly, setCovertOnly] = useState<boolean>(false);

  const eras = [
    { id: 'all', label: 'All Eras (1971-2026)' },
    { id: 'Early Foundations (1971-1989)', label: 'Foundations (1971-1989)' },
    { id: 'Millennial Expansion (1990-2009)', label: 'Expansion (1990-2009)' },
    { id: 'Modern Hegemony (2010-2026)', label: 'Hegemony (2010-2026)' }
  ];

  const filteredEvents = timeline.filter((entry) => {
    if (selectedEra !== 'all' && entry.era !== selectedEra) return false;
    if (covertOnly && !entry.isCovert) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              HISTORICAL TIMELINE // FIFTY-FIVE YEARS OF CERTAINTY
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            52 Documented Milestones, Infrasonic Discoveries & Covert Crises (1971-2026)
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          {eras.map((era) => (
            <button
              key={era.id}
              onClick={() => {
                gpcAudio.playUiSound('click');
                setSelectedEra(era.id);
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                selectedEra === era.id
                  ? 'bg-indigo-600 text-white font-bold shadow-md'
                  : 'bg-[#0d131f] text-slate-400 hover:text-slate-200 border border-[#1f2c42]'
              }`}
            >
              {era.label}
            </button>
          ))}

          <button
            onClick={() => {
              gpcAudio.playUiSound('click');
              setCovertOnly(!covertOnly);
            }}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer border ${
              covertOnly
                ? 'bg-rose-950 text-rose-300 border-rose-600 font-bold'
                : 'bg-[#0d131f] text-slate-400 border-[#1f2c42]'
            }`}
          >
            {covertOnly ? 'COVERT ONLY' : 'SHOW ALL'}
          </button>
        </div>
      </div>

      {/* Vertical Timeline Stream */}
      <div className="max-w-4xl mx-auto space-y-6 relative py-4">
        {/* Center line */}
        <div className="absolute top-0 bottom-0 left-6 md:left-8 w-0.5 bg-[#1b263b] pointer-events-none" />

        {filteredEvents.map((entry) => (
          <div
            key={entry.id}
            className="relative flex items-start gap-4 md:gap-6 group"
          >
            {/* Timeline Dot with Year Badge */}
            <div className="w-12 md:w-16 h-8 rounded bg-[#0d1424] border border-cyan-500/50 flex items-center justify-center text-[11px] font-bold text-cyan-300 shrink-0 z-10 shadow-lg group-hover:scale-105 transition-transform">
              {entry.year}
            </div>

            {/* Event Card */}
            <div className="flex-1 p-4 rounded-lg bg-[#0a0e18] hover:bg-[#0e1627] border border-[#1b263b] hover:border-cyan-500/50 transition-all space-y-2 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#182335] pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">{entry.dateString}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 border border-slate-700 font-bold">
                    {entry.departmentCode}
                  </span>
                  {entry.isCovert && (
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold">
                      COVERT
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-amber-400 font-bold">
                  {entry.classification.split(' - ')[0]}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {entry.title}
              </h3>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {entry.description}
              </p>

              <div className="p-2.5 bg-[#070b13] border-l-2 border-indigo-500 rounded text-[10px] text-slate-400 leading-normal">
                <span className="text-indigo-400 font-bold block mb-0.5">INTERNAL STRATEGIC IMPACT:</span>
                {entry.internalImpact}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
