import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Radio,
  FileText,
  Users,
  MapPin,
  FolderLock,
  ArrowRight,
  AlertTriangle,
  Activity,
  Terminal,
  HelpCircle
} from 'lucide-react';
import type { ActiveTab } from '@/types';
import {
  DISCONTINUED_PRODUCTS,
  DOCUMENTS,
  INTERNAL_PROGRAMS,
  PERSONNEL,
  PUZZLES,
  REGIONAL_STATIONS
} from '@/content';
import { pathForTab, TOOLS_LAB_COUNT } from '@/config/navigation';
import { clearanceTier } from '@/lib/archive/clearance';
import { cn } from '@/lib/utils/cn';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useArchiveUi } from '@/app/archive-ui-context';
import { useProgression } from '@/hooks/use-progression';
import { ArchivePage } from '@/components/ui/archive-page';
import { ClassificationStamp } from '@/components/ui/classification-stamp';
import { CaseBanner } from '@/components/puzzles/case-banner';
import { SealMark } from '@/components/archive/seal-mark';
import { stripRedactions } from '@/lib/archive/redaction';

const documents = DOCUMENTS;
const personnel = PERSONNEL;
const stations = REGIONAL_STATIONS;
const programs = INTERNAL_PROGRAMS;

const TELEMETRY_LOGS = [
  'STATION 07 [SVALBARD]: BOREHOLE 4 INFRASOUND AMPLITUDE: +18.4% (94.2 dB)',
  'SITE 19 [UTAH]: CHAMBER 04 BARITE GROUT INJECTION: COMPLETED (32.4 Hz CONTAINED)',
  'DIEGO GARCIA [HYDROPHONE 12]: 54Hz MANTLE RAMP INTERCEPTED (PHASE-LOCKED)',
  'POSTOJNA REPOSITORY: DIGITAL HASH TREE VALIDATION: 100% PURE (SHA256)',
  'ROSSLYN SUB-COMPLEX: MUNICIPAL TRANSIT ENTRAINMENT CYCLE: 18:00 STANDBY'
];

const CARRIER_BASE_HZ = 14.802;
const CARRIER_JITTER_HZ = 0.012;
const CARRIER_TICK_MS = 2000;

const urgentDocs = documents.filter((d) => clearanceTier(d.clearance) >= 4).slice(0, 5);

const JUMP_LINK =
  'p-2.5 rounded bg-inset hover:bg-hover border border-line hover:border-cyan-500/40 text-left transition-colors flex items-center justify-between cursor-pointer';

function JumpLink({
  tab,
  icon: Icon,
  iconClassName,
  children
}: {
  tab: ActiveTab;
  icon: typeof Users;
  iconClassName: string;
  children: string;
}) {
  return (
    <Link to={pathForTab(tab)} className={JUMP_LINK}>
      <span className="flex items-center gap-2 text-slate-300">
        <Icon className={`w-4 h-4 ${iconClassName}`} />
        <span>{children}</span>
      </span>
      <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
    </Link>
  );
}

export default function DashboardPage() {
  const { openDocument, openDialog, navigateToTab } = useArchiveUi();
  const { discoveredCount, completedCount, clearance, unredacted, state } = useProgression();
  const finaleComplete = state.investigation.finaleComplete;
  const [carrierHz, setCarrierHz] = useState(CARRIER_BASE_HZ);
  const [bootTime] = useState(() => new Date().toISOString().split('T')[1].slice(0, 8));

  useEffect(() => {
    const interval = setInterval(() => {
      setCarrierHz(Number((CARRIER_BASE_HZ + (Math.random() - 0.5) * CARRIER_JITTER_HZ).toFixed(3)));
    }, CARRIER_TICK_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <ArchivePage className="space-y-6">
      <CaseBanner
        onOpen={() => {
          gpcAudio.playUiSound('click');
          navigateToTab('sanctum');
        }}
      />
      {/* Top Banner / Executive Alert */}
      <div className="p-4 bg-gradient-to-r from-rose-950/40 via-hover to-raised border border-rose-500/40 rounded-lg shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-rose-950/80 border border-rose-600 text-rose-400 shrink-0 mt-0.5 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-rose-400 text-xs tracking-wider">
                CRITICAL SYSTEM ALERT // DIRECTIVE 01 STANDBY
              </span>
              <span className="text-micro px-1.5 py-px rounded bg-rose-900/60 text-white font-bold">
                LEVEL 5
              </span>
            </div>
            <h1 className="text-sm md:text-base font-bold text-white mt-1">
              Station 07 Infrasonic Surge & Impending 15.0Hz Planetary Phase Transition
            </h1>
            <p className="text-label text-slate-400 mt-1 leading-relaxed max-w-3xl">
              Planetary carrier telemetry indicates amplitude acceleration across Svalbard, Diego Garcia, and
              Atacama nodes. All 14 subterranean Aethelgard redoubts are placed on 60-minute emergency seal
              readiness.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => {
              gpcAudio.playUiSound('scan');
              navigateToTab('audio');
            }}
            className="tap-target w-full md:w-auto justify-center px-3.5 py-2.5 md:py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded cursor-pointer transition-colors shadow-md text-xs flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>LAUNCH AUDIO SCANNER</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 bg-panel border border-line-strong rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-caption">
            <span>PLANETARY CARRIER</span>
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-lg md:text-xl font-bold text-cyan-300 font-mono">
            {finaleComplete ? '0.000' : carrierHz} Hz
          </div>
          <div
            className={cn(
              'text-caption flex items-center gap-1',
              finaleComplete ? 'text-slate-400' : 'text-emerald-400'
            )}
          >
            <span
              className={cn('w-1.5 h-1.5 rounded-full', finaleComplete ? 'bg-slate-500' : 'bg-emerald-400')}
            />
            <span>{finaleComplete ? 'NO SIGNAL — SILENTIUM' : '99.94% Phase-Locked'}</span>
          </div>
        </div>

        <div className="p-3.5 bg-panel border border-line-strong rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-caption">
            <span>REGIONAL STATIONS</span>
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg md:text-xl font-bold text-purple-300">{stations.length} Active</div>
          <div className="text-caption text-slate-400">Across 5 Continents & Oceans</div>
        </div>

        <div className="p-3.5 bg-panel border border-line-strong rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-caption">
            <span>INDEXED ARCHIVE FILES</span>
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg md:text-xl font-bold text-indigo-300">{documents.length} Records</div>
          <div className="text-caption text-slate-400">100% Postojna Hash Synced</div>
        </div>

        <div className="p-3.5 bg-panel border border-line-strong rounded-lg space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-caption">
            <span>TIER-1 HERITAGE COHORT</span>
            <Users className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg md:text-xl font-bold text-amber-300">10,000 Seats</div>
          <div className="text-caption text-emerald-400">100% Committed Allocation</div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Classified Dossiers & Live Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Classified Dossiers */}
          <div className="p-4 bg-panel border border-line-strong rounded-lg space-y-3">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="font-bold text-xs text-white flex items-center gap-2">
                <FolderLock className="w-4 h-4 text-rose-400" />
                RESTRICTED EXECUTIVE DOSSIERS & ANOMALY LOGS
              </span>
              <Link
                to={pathForTab('documents')}
                className="text-label text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View All {documents.length}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-2">
              {urgentDocs.map((doc) => (
                <button
                  type="button"
                  key={doc.id}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    openDocument(doc);
                  }}
                  className="w-full text-left p-3 rounded bg-inset hover:bg-hover border border-line hover:border-cyan-500/50 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <span className="block min-w-0 space-y-1">
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors text-label truncate">
                        {doc.title}
                      </span>
                      <span className="text-micro px-1.5 py-px rounded bg-slate-800 text-amber-400 border border-slate-700 shrink-0">
                        {doc.code}
                      </span>
                      <SealMark doc={doc} clearance={clearance} />
                    </span>
                    <span className="block text-caption text-slate-400 line-clamp-1">
                      {unredacted ? doc.summary : stripRedactions(doc.summary)}
                    </span>
                    <span className="flex items-center gap-3 text-micro text-slate-500">
                      <span>Author: {doc.author}</span>
                      <span>•</span>
                      <span>Date: {doc.date}</span>
                    </span>
                  </span>

                  <span className="block text-right shrink-0">
                    <ClassificationStamp level={doc.clearance} />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Telemetry Stream */}
          <div className="p-4 bg-canvas border border-line rounded-lg space-y-2">
            <div className="flex items-center justify-between border-b border-line-subtle pb-2">
              <span className="text-label font-bold text-cyan-400 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                PLANETARY ARRAY TELEMETRY STREAM (LIVE PACKET FEED)
              </span>
              <span className="text-micro text-emerald-400 font-bold animate-pulse">REC: ONLINE</span>
            </div>
            <div className="bg-void p-3 rounded border border-slate-900 font-mono text-caption space-y-1 text-slate-400 max-h-36 overflow-y-auto">
              {TELEMETRY_LOGS.map((log, idx) => (
                <div key={log} className="flex items-center gap-2">
                  <span className="text-slate-600">[{bootTime}]</span>
                  <span className={idx === 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}>{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Quick Access & System Utilities */}
        <div className="space-y-6">
          {/* Quick Access Portals */}
          <div className="p-4 bg-panel border border-line-strong rounded-lg space-y-3">
            <h2 className="font-bold text-xs text-white border-b border-line pb-2">
              CORE DIRECTORY JUMP-POINTS
            </h2>
            <nav className="grid grid-cols-1 gap-2 text-xs" aria-label="Directory jump-points">
              <JumpLink tab="personnel" icon={Users} iconClassName="text-emerald-400">
                {`Personnel Roster (${personnel.length} Profiles)`}
              </JumpLink>
              <JumpLink tab="stations" icon={MapPin} iconClassName="text-purple-400">
                {`Field Stations & Boreholes (${stations.length} Hubs)`}
              </JumpLink>
              <JumpLink tab="programs" icon={FolderLock} iconClassName="text-rose-400">
                {`Project Dossiers (${programs.length} Projects)`}
              </JumpLink>
              <JumpLink tab="products" icon={AlertTriangle} iconClassName="text-amber-400">
                {`Recalled Product Vault (${DISCONTINUED_PRODUCTS.length} Devices)`}
              </JumpLink>
              <JumpLink tab="tools" icon={Activity} iconClassName="text-cyan-400">
                {`Sub-Audible Software Tools (${TOOLS_LAB_COUNT} Apps)`}
              </JumpLink>
            </nav>
          </div>

          {/* ARG Backdoors & Interactive Tools Box */}
          <div className="p-4 bg-panel border border-amber-500/30 rounded-lg space-y-3">
            <h2 className="font-bold text-xs text-amber-400 border-b border-line pb-2 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              INTERACTIVE ARG BACKDOORS
            </h2>
            <div className="space-y-2 text-label">
              <button
                type="button"
                onClick={() => {
                  gpcAudio.playUiSound('scan');
                  openDialog({ type: 'terminal' });
                }}
                className="w-full p-2 bg-hover hover:bg-active border border-line-bright hover:border-cyan-500/50 rounded text-left flex items-center justify-between text-cyan-300 cursor-pointer"
              >
                <span>Launch GPC Command Terminal</span>
                <span className="text-micro px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">
                  GPC://CLI
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  openDialog({ type: 'safe' });
                }}
                className="w-full p-2 bg-hover hover:bg-active border border-line-bright hover:border-amber-500/50 rounded text-left flex items-center justify-between text-amber-300 cursor-pointer"
              >
                <span>Whistleblower PIN Safe</span>
                <span className="text-micro px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">
                  PALIMPSEST
                </span>
              </button>

              <button
                type="button"
                onClick={() => openDialog({ type: 'help' })}
                className="w-full p-2 bg-hover hover:bg-active border border-line-bright hover:border-emerald-500/50 rounded text-left flex items-center justify-between text-emerald-300 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> Investigation Progress & Guide
                </span>
                <span className="text-micro px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">
                  {discoveredCount} OPENED · {completedCount}/{PUZZLES.length} SOLVED
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ArchivePage>
  );
}
