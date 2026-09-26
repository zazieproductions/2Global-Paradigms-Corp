import { useState } from 'react';
import { Clock } from 'lucide-react';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { TIMELINE_ENTRIES } from '@/content';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';

const timeline = TIMELINE_ENTRIES;

export default function TimelinePage() {
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
    <ArchivePage>
      <ViewHeader
        icon={Clock}
        iconClassName="text-indigo-400"
        title="HISTORICAL TIMELINE // FIFTY-FIVE YEARS OF CERTAINTY"
        subtitle={`${timeline.length} Documented Milestones, Infrasonic Discoveries & Covert Crises (1971-2026)`}
        aside={
          <div
            className="flex flex-wrap items-center gap-1.5 text-caption"
            role="group"
            aria-label="Filter timeline"
          >
            {eras.map((era) => (
              <button
                type="button"
                key={era.id}
                aria-pressed={selectedEra === era.id}
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  setSelectedEra(era.id);
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedEra === era.id
                    ? 'bg-indigo-600 text-white font-bold shadow-md'
                    : 'bg-raised text-slate-400 hover:text-slate-200 border border-line-strong'
                }`}
              >
                {era.label}
              </button>
            ))}

            <button
              type="button"
              aria-pressed={covertOnly}
              aria-label="Covert events only"
              onClick={() => {
                gpcAudio.playUiSound('click');
                setCovertOnly(!covertOnly);
              }}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer border ${
                covertOnly
                  ? 'bg-rose-950 text-rose-300 border-rose-600 font-bold'
                  : 'bg-raised text-slate-400 border-line-strong'
              }`}
            >
              {covertOnly ? 'COVERT ONLY' : 'SHOW ALL'}
            </button>
          </div>
        }
      />

      {/* Vertical Timeline Stream */}
      <div className="max-w-4xl mx-auto space-y-6 relative py-4">
        {/* Center line */}
        <div className="absolute top-0 bottom-0 left-6 md:left-8 w-0.5 bg-active pointer-events-none" />

        {filteredEvents.map((entry) => (
          <div key={entry.id} className="relative flex items-start gap-4 md:gap-6 group">
            {/* Timeline Dot with Year Badge */}
            <div className="w-12 md:w-16 h-8 rounded bg-hover border border-cyan-500/50 flex items-center justify-center text-label font-bold text-cyan-300 shrink-0 z-10 shadow-lg group-hover:scale-105 transition-transform">
              {entry.year}
            </div>

            {/* Event Card */}
            <div className="flex-1 p-4 rounded-lg bg-panel hover:bg-hover border border-line-strong hover:border-cyan-500/50 transition-all space-y-2 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-line pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-caption text-slate-400 font-mono">{entry.dateString}</span>
                  <span className="text-micro px-1.5 py-px rounded bg-slate-800 text-cyan-400 border border-slate-700 font-bold">
                    {entry.departmentCode}
                  </span>
                  {entry.isCovert && (
                    <span className="text-nano px-1.5 py-px rounded bg-rose-950 text-rose-300 border border-rose-600 font-bold">
                      COVERT
                    </span>
                  )}
                </div>
                <span className="text-micro text-amber-400 font-bold">
                  {entry.classification.split(' - ')[0]}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                {entry.title}
              </h3>

              <p className="text-label text-slate-300 leading-relaxed">{entry.description}</p>

              <div className="p-2.5 bg-inset border-l-2 border-indigo-500 rounded text-caption text-slate-400 leading-normal">
                <span className="text-indigo-400 font-bold block mb-0.5">INTERNAL STRATEGIC IMPACT:</span>
                {entry.internalImpact}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ArchivePage>
  );
}
