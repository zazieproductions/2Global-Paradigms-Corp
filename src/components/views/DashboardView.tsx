import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  FileText,
  Users,
  MapPin,
  FolderLock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  HardDrive,
  Activity,
  Terminal,
  Volume2,
  Lock,
  Eye,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  DocumentRecord,
  Personnel,
  RegionalStation,
  InternalProgram,
  ClearanceLevel,
  ActiveTab
} from '../../types';
import { gpcAudio } from '../../lib/audioEngine';
import { CaseBanner } from '../../arg/CaseBanner';
import { useArg } from '../../arg/ArgContext';

interface DashboardViewProps {
  documents: DocumentRecord[];
  personnel: Personnel[];
  stations: RegionalStation[];
  programs: InternalProgram[];
  clearance: ClearanceLevel;
  isUnredacted: boolean;
  onSelectDocument: (doc: DocumentRecord) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenTerminal: () => void;
  onOpenSecretSafe: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  documents,
  personnel,
  stations,
  programs,
  clearance,
  isUnredacted,
  onSelectDocument,
  onNavigateTab,
  onOpenTerminal,
  onOpenSecretSafe
}) => {
  const [carrierHz, setCarrierHz] = useState(14.802);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const { finaleComplete } = useArg();

  useEffect(() => {
    const logs = [
      'STATION 07 [SVALBARD]: BOREHOLE 4 INFRASOUND AMPLITUDE: +18.4% (94.2 dB)',
      'SITE 19 [UTAH]: CHAMBER 04 BARITE GROUT INJECTION: COMPLETED (32.4 Hz CONTAINED)',
      'DIEGO GARCIA [HYDROPHONE 12]: 54Hz MANTLE RAMP INTERCEPTED (PHASE-LOCKED)',
      'POSTOJNA REPOSITORY: DIGITAL HASH TREE VALIDATION: 100% PURE (SHA256)',
      'ROSSLYN SUB-COMPLEX: MUNICIPAL TRANSIT ENTRAINMENT CYCLE: 18:00 STANDBY'
    ];
    setTelemetryLogs(logs);

    const interval = setInterval(() => {
      setCarrierHz((prev) => Number((14.802 + (Math.random() - 0.5) * 0.012).toFixed(3)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const urgentDocs = documents.filter((d) => d.clearance.includes('Level 4') || d.clearance.includes('Level 5')).slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-6 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* The Seven Seals — investigation spine */}
      <CaseBanner onOpen={() => { gpcAudio.playUiSound('click'); onNavigateTab('sanctum'); }} />

      {/* Top Banner / Executive Alert */}
      <div className="p-4 bg-gradient-to-r from-rose-950/40 via-[#111726] to-[#0d1320] border border-rose-500/40 rounded-lg shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-rose-950/80 border border-rose-600 text-rose-400 shrink-0 mt-0.5 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-rose-400 text-xs tracking-wider">
                CRITICAL SYSTEM ALERT // DIRECTIVE 01 STANDBY
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-900/60 text-white font-bold">
                LEVEL 5
              </span>
            </div>
            <h1 className="text-sm md:text-base font-bold text-white mt-1">
              Station 07 Infrasonic Surge & Impending 15.0Hz Planetary Phase Transition
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed max-w-3xl">
              Planetary carrier telemetry indicates amplitude acceleration across Svalbard, Diego Garcia, and Atacama nodes. All 14 subterranean Aethelgard redoubts are placed on 60-minute emergency seal readiness.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              gpcAudio.playUiSound('scan');
              onNavigateTab('audio');
            }}
            className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded cursor-pointer transition-colors shadow-md text-xs flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>LAUNCH AUDIO SCANNER</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <span>PLANETARY CARRIER</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-lg md:text-xl font-bold text-cyan-300 font-mono">
            {finaleComplete ? '0.000' : carrierHz} Hz
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{finaleComplete ? 'NO SIGNAL — SILENTIUM' : '99.94% Phase-Locked'}</span>
          </div>
        </div>

        <div className="p-3.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <span>REGIONAL STATIONS</span>
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg md:text-xl font-bold text-purple-300">
            {stations.length} Active
          </div>
          <div className="text-[10px] text-slate-400">
            Across 5 Continents & Oceans
          </div>
        </div>

        <div className="p-3.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <span>INDEXED ARCHIVE FILES</span>
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg md:text-xl font-bold text-indigo-300">
            {documents.length} Records
          </div>
          <div className="text-[10px] text-slate-400">
            100% Postojna Hash Synced
          </div>
        </div>

        <div className="p-3.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-[10px]">
            <span>TIER-1 HERITAGE COHORT</span>
            <Users className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg md:text-xl font-bold text-amber-300">
            10,000 Seats
          </div>
          <div className="text-[10px] text-emerald-400">
            100% Committed Allocation
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Classified Dossiers & Live Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Classified Dossiers */}
          <div className="p-4 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-[#182335] pb-2">
              <span className="font-bold text-xs text-white flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-rose-400" />
                RESTRICTED EXECUTIVE DOSSIERS & ANOMALY LOGS
              </span>
              <button
                onClick={() => onNavigateTab('documents')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View All {documents.length}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {urgentDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    onSelectDocument(doc);
                  }}
                  className="p-3 rounded bg-[#070b13] hover:bg-[#0e1524] border border-[#172236] hover:border-cyan-500/50 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors text-[11px] truncate">
                        {doc.title}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 border border-slate-700 shrink-0">
                        {doc.code}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {doc.summary}
                    </p>
                    <div className="flex items-center gap-3 text-[9px] text-slate-500">
                      <span>Author: {doc.author}</span>
                      <span>•</span>
                      <span>Date: {doc.date}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800 text-rose-300 font-bold">
                      {doc.clearance.split(' - ')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Telemetry Stream */}
          <div className="p-4 bg-[#07090f] border border-[#172236] rounded-lg space-y-2">
            <div className="flex items-center justify-between border-b border-[#151e2e] pb-2">
              <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                PLANETARY ARRAY TELEMETRY STREAM (LIVE PACKET FEED)
              </span>
              <span className="text-[9px] text-emerald-400 font-bold animate-pulse">
                REC: ONLINE
              </span>
            </div>
            <div className="bg-[#04060a] p-3 rounded border border-slate-900 font-mono text-[10px] space-y-1 text-slate-400 max-h-36 overflow-y-auto">
              {telemetryLogs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-600">[{new Date().toISOString().split('T')[1].slice(0, 8)}]</span>
                  <span className={idx === 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Access & System Utilities */}
        <div className="space-y-6">
          {/* Quick Access Portals */}
          <div className="p-4 bg-[#0a0e18] border border-[#1b263b] rounded-lg space-y-3">
            <h3 className="font-bold text-xs text-white border-b border-[#182335] pb-2">
              CORE DIRECTORY JUMP-POINTS
            </h3>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => onNavigateTab('personnel')}
                className="p-2.5 rounded bg-[#070b13] hover:bg-[#101726] border border-[#162133] hover:border-cyan-500/40 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Personnel Roster ({personnel.length} Profiles)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => onNavigateTab('stations')}
                className="p-2.5 rounded bg-[#070b13] hover:bg-[#101726] border border-[#162133] hover:border-cyan-500/40 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>Field Stations & Boreholes ({stations.length} Hubs)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => onNavigateTab('programs')}
                className="p-2.5 rounded bg-[#070b13] hover:bg-[#101726] border border-[#162133] hover:border-cyan-500/40 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <FolderLock className="w-4 h-4 text-rose-400" />
                  <span>Project Dossiers ({programs.length} Projects)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => onNavigateTab('products')}
                className="p-2.5 rounded bg-[#070b13] hover:bg-[#101726] border border-[#162133] hover:border-cyan-500/40 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Recalled Product Vault (8 Devices)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => onNavigateTab('tools')}
                className="p-2.5 rounded bg-[#070b13] hover:bg-[#101726] border border-[#162133] hover:border-cyan-500/40 text-left transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Sub-Audible Software Tools (5 Apps)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* ARG Backdoors & Interactive Tools Box */}
          <div className="p-4 bg-[#0a0e18] border border-amber-500/30 rounded-lg space-y-3">
            <h3 className="font-bold text-xs text-amber-400 border-b border-[#182335] pb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              INTERACTIVE ARG BACKDOORS
            </h3>
            <div className="space-y-2 text-[11px]">
              <button
                onClick={() => {
                  gpcAudio.playUiSound('scan');
                  onOpenTerminal();
                }}
                className="w-full p-2 bg-[#121927] hover:bg-[#192336] border border-[#22304d] hover:border-cyan-500/50 rounded text-left flex items-center justify-between text-cyan-300 cursor-pointer"
              >
                <span>Launch GPC Command Terminal</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">GPC://CLI</span>
              </button>

              <button
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  onOpenSecretSafe();
                }}
                className="w-full p-2 bg-[#121927] hover:bg-[#192336] border border-[#22304d] hover:border-amber-500/50 rounded text-left flex items-center justify-between text-amber-300 cursor-pointer"
              >
                <span>Whistleblower PIN Safe</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">PALIMPSEST</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
