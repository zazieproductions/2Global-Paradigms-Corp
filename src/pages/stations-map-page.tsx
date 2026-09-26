import { useState } from 'react';
import { MapPin, Radio, AlertTriangle } from 'lucide-react';
import type { RegionalStation } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { REGIONAL_STATIONS } from '@/content';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { pickRecord, useRecordParam } from '@/hooks/use-record-param';

const stations = REGIONAL_STATIONS;

export default function StationsMapPage() {
  const recordId = useRecordParam();
  const [selectedStation, setSelectedStation] = useState<RegionalStation | null>(() =>
    pickRecord(stations, recordId, stations[3])
  ); // Default Station 07 Svalbard
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const regions = [
    'all',
    'Western Europe',
    'North America',
    'Arctic',
    'East Asia',
    'South America',
    'Indian Ocean',
    'Eastern Europe',
    'Oceania'
  ];

  const filteredStations = stations.filter((st) => {
    if (regionFilter === 'all') return true;
    return st.region.toLowerCase().includes(regionFilter.toLowerCase());
  });

  const getStatusBadge = (status: RegionalStation['status']) => {
    switch (status) {
      case 'Operational':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700';
      case 'Elevated Alert':
        return 'bg-amber-950/80 text-amber-300 border-amber-600 animate-pulse font-bold';
      case 'Under Containment':
        return 'bg-rose-950/80 text-rose-300 border-rose-600 font-bold';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  return (
    <ArchivePage>
      <ViewHeader
        icon={MapPin}
        iconClassName="text-purple-400"
        title="REGIONAL FIELD STATIONS & BOREHOLE ARRAYS"
        subtitle={`${stations.length} Active Monitoring Nodes, Subterranean Bunkers & Abyssal Hydrophones`}
        aside={
          <div
            className="flex items-center gap-1.5 text-caption overflow-x-auto"
            role="group"
            aria-label="Filter by region"
          >
            {regions.map((reg) => (
              <button
                type="button"
                key={reg}
                aria-pressed={regionFilter === reg}
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  setRegionFilter(reg);
                }}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                  regionFilter === reg
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold'
                    : 'bg-raised text-slate-400 hover:text-slate-200 border border-line-strong'
                }`}
              >
                {reg === 'all' ? 'All Global Regions' : reg}
              </button>
            ))}
          </div>
        }
      />

      {/* Main Grid: Station Detail & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Station Card & Coordinate Map */}
        <div className="lg:col-span-2 space-y-4">
          {selectedStation && (
            <div className="p-5 bg-panel border border-purple-500/40 rounded-lg shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line-strong pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-400 text-sm tracking-wider">
                      {selectedStation.code}
                    </span>
                    <span
                      className={`text-micro px-2 py-0.5 rounded border ${getStatusBadge(selectedStation.status)}`}
                    >
                      {selectedStation.status.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedStation.name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-caption text-slate-500 block">ESTABLISHED:</span>
                  <span className="text-slate-300 font-bold">{selectedStation.establishedDate}</span>
                </div>
              </div>

              {/* Station Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-inset border border-line p-3 rounded text-caption">
                <div>
                  <span className="text-slate-500 block">COORDINATES:</span>
                  <span className="text-cyan-300 font-bold">{selectedStation.coordinates}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">FACILITY TYPE:</span>
                  <span className="text-purple-300">{selectedStation.facilityType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">STATION LEAD:</span>
                  <span className="text-slate-200 truncate block">{selectedStation.leadPersonnelName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">PERSONNEL ON-SITE:</span>
                  <span className="text-emerald-400 font-bold">{selectedStation.personnelCount} Staff</span>
                </div>
              </div>

              {/* Frequency Band Callout */}
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/40 rounded flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span>ACOUSTIC FREQUENCY BAND:</span>
                  <span className="font-bold text-white">{selectedStation.frequencyBand}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-caption text-slate-400 font-bold block">FACILITY OVERVIEW:</span>
                <p className="text-label text-slate-300 leading-relaxed bg-inset p-3 rounded border border-line">
                  {selectedStation.description}
                </p>
              </div>

              {/* Incident History */}
              <div className="space-y-1.5">
                <span className="text-caption text-amber-400 font-bold block flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  CLASSIFIED INCIDENT HISTORY:
                </span>
                <div className="space-y-1.5">
                  {selectedStation.incidentHistory.map((inc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-shell border border-line-strong rounded text-caption text-slate-300 leading-normal"
                    >
                      {inc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Linked Projects */}
              <div className="pt-2 border-t border-line">
                <span className="text-caption text-slate-400 font-bold block mb-1.5">
                  ACTIVE RESEARCH & CONTAINMENT PROGRAMS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedStation.activeProjects.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-hover text-cyan-300 border border-cyan-700/60 text-caption font-bold"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Station Selector List */}
        <div className="space-y-2">
          <div className="p-2.5 bg-panel border border-line-strong rounded-lg font-bold text-xs text-white">
            GLOBAL ARRAY NODES ({filteredStations.length})
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredStations.map((st) => {
              const isSelected = selectedStation?.id === st.id;
              return (
                <button
                  type="button"
                  key={st.id}
                  aria-pressed={isSelected}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setSelectedStation(st);
                  }}
                  className={`w-full text-left p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-400 text-white shadow-glow shadow-purple-500/20'
                      : 'bg-panel hover:bg-hover border-line-strong text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block space-y-0.5 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300 text-label font-mono">{st.code}</span>
                      <span className="text-micro text-slate-500 truncate">{st.region}</span>
                    </span>
                    <span className="block font-bold text-xs truncate text-slate-200">{st.name}</span>
                    <span className="block text-caption text-slate-500 truncate">{st.frequencyBand}</span>
                  </span>

                  <span
                    className={`text-nano px-1.5 py-px rounded border shrink-0 ${getStatusBadge(st.status)}`}
                  >
                    {st.status.split(' ')[0].toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ArchivePage>
  );
}
