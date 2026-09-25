import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Radio,
  Shield,
  Activity,
  AlertTriangle,
  Building2,
  Anchor,
  Compass,
  Thermometer,
  Layers
} from 'lucide-react';
import { RegionalStation } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface StationsMapViewProps {
  stations: RegionalStation[];
  onSelectStation?: (station: RegionalStation) => void;
}

export const StationsMapView: React.FC<StationsMapViewProps> = ({ stations }) => {
  const [selectedStation, setSelectedStation] = useState<RegionalStation | null>(stations[3]); // Default Station 07 Svalbard
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const regions = ['all', 'Western Europe', 'North America', 'Arctic', 'East Asia', 'South America', 'Indian Ocean', 'Eastern Europe', 'Oceania'];

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
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              REGIONAL FIELD STATIONS & BOREHOLE ARRAYS
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            22 Active Monitoring Nodes, Subterranean Bunkers & Abyssal Hydrophones
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] overflow-x-auto">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => {
                gpcAudio.playUiSound('click');
                setRegionFilter(reg);
              }}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                regionFilter === reg
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold'
                  : 'bg-[#0d131f] text-slate-400 hover:text-slate-200 border border-[#1f2c42]'
              }`}
            >
              {reg === 'all' ? 'All Global Regions' : reg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Station Detail & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Station Card & Coordinate Map */}
        <div className="lg:col-span-2 space-y-4">
          {selectedStation && (
            <div className="p-5 bg-[#0a0e18] border border-purple-500/40 rounded-lg shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c273c] pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-400 text-sm tracking-wider">
                      {selectedStation.code}
                    </span>
                    <span className={`text-[9px] px-2 py-0.5 rounded border ${getStatusBadge(selectedStation.status)}`}>
                      {selectedStation.status.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedStation.name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">ESTABLISHED:</span>
                  <span className="text-slate-300 font-bold">{selectedStation.establishedDate}</span>
                </div>
              </div>

              {/* Station Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-[#070b13] border border-[#182335] p-3 rounded text-[10px]">
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
                <span className="text-[10px] text-slate-400 font-bold block">FACILITY OVERVIEW:</span>
                <p className="text-[11px] text-slate-300 leading-relaxed bg-[#070b13] p-3 rounded border border-[#182335]">
                  {selectedStation.description}
                </p>
              </div>

              {/* Incident History */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-amber-400 font-bold block flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  CLASSIFIED INCIDENT HISTORY:
                </span>
                <div className="space-y-1.5">
                  {selectedStation.incidentHistory.map((inc, idx) => (
                    <div key={idx} className="p-2.5 bg-[#080c14] border border-[#1b2538] rounded text-[10px] text-slate-300 leading-normal">
                      {inc}
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Linked Projects */}
              <div className="pt-2 border-t border-[#182335]">
                <span className="text-[10px] text-slate-400 font-bold block mb-1.5">
                  ACTIVE RESEARCH & CONTAINMENT PROGRAMS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedStation.activeProjects.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded bg-[#0e1627] text-cyan-300 border border-cyan-700/60 text-[10px] font-bold"
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
          <div className="p-2.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg font-bold text-xs text-white">
            GLOBAL ARRAY NODES ({filteredStations.length})
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredStations.map((st) => {
              const isSelected = selectedStation?.id === st.id;
              return (
                <div
                  key={st.id}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setSelectedStation(st);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                      : 'bg-[#0a0e18] hover:bg-[#0e1524] border-[#1b263b] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300 text-[11px] font-mono">{st.code}</span>
                      <span className="text-[9px] text-slate-500 truncate">{st.region}</span>
                    </div>
                    <h3 className="font-bold text-xs truncate text-slate-200">{st.name}</h3>
                    <p className="text-[10px] text-slate-500 truncate">{st.frequencyBand}</p>
                  </div>

                  <span className={`text-[8px] px-1.5 py-0.2 rounded border shrink-0 ${getStatusBadge(st.status)}`}>
                    {st.status.split(' ')[0].toUpperCase()}
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
