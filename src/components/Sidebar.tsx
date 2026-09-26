import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  MapPin,
  FolderLock,
  Building2,
  PackageX,
  Radio,
  BarChart3,
  Mail,
  Clock,
  Newspaper,
  GraduationCap,
  Briefcase,
  Compass,
  Wrench,
  Link2Off,
  ChevronRight,
  ShieldAlert,
  HardDrive
} from 'lucide-react';
import { ActiveTab, ClearanceLevel } from '../types';
import { gpcAudio } from '../lib/audioEngine';
import { useArg } from '../arg/ArgContext';
import { clearanceRank } from '../arg/levels';
import { OrderSigil, PlanetGlyph } from '../arg/sigils';
import { LEVEL_CORRESPONDENCE, SEALS } from '../arg/seals';

const DEGREES = ['', 'Neophyte', 'Zelator', 'Practicus', 'Philosophus', 'Magister Umbrae'];

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  documentCount: number;
  personnelCount: number;
  stationCount: number;
  programCount: number;
  productCount: number;
  audioCount: number;
  reportCount: number;
  jobCount: number;
  clearance: ClearanceLevel;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  documentCount,
  personnelCount,
  stationCount,
  programCount,
  productCount,
  audioCount,
  reportCount,
  jobCount,
  clearance,
  isOpen
}) => {
  const arg = useArg();
  const rank = clearanceRank(clearance);
  const corr = LEVEL_CORRESPONDENCE[rank];
  const navSections = [
    {
      title: 'CORE REPOSITORIES',
      items: [
        {
          id: 'dashboard' as ActiveTab,
          label: 'Command Dashboard',
          icon: LayoutDashboard,
          badge: 'SYS 8.4',
          badgeColor: 'bg-cyan-950 text-cyan-400 border-cyan-800'
        },
        {
          id: 'documents' as ActiveTab,
          label: 'Master Document Vault',
          icon: FileText,
          badge: `${documentCount}`,
          badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800'
        },
        {
          id: 'personnel' as ActiveTab,
          label: 'Personnel Directory',
          icon: Users,
          badge: `${personnelCount}`,
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
        },
        {
          id: 'stations' as ActiveTab,
          label: 'Regional Stations & Arrays',
          icon: MapPin,
          badge: `${stationCount}`,
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800'
        },
        {
          id: 'programs' as ActiveTab,
          label: 'Project Dossiers',
          icon: FolderLock,
          badge: `${programCount}`,
          badgeColor: 'bg-rose-950 text-rose-300 border-rose-800'
        },
        {
          id: 'departments' as ActiveTab,
          label: 'Department Charters',
          icon: Building2,
          badge: '10 Depts',
          badgeColor: 'bg-purple-950 text-purple-300 border-purple-800'
        },
        {
          id: 'products' as ActiveTab,
          label: 'Recalled Products Archive',
          icon: PackageX,
          badge: `${productCount}`,
          badgeColor: 'bg-amber-950 text-amber-300 border-amber-800'
        }
      ]
    },
    {
      title: 'ACOUSTICS & TELEMETRY',
      items: [
        {
          id: 'audio' as ActiveTab,
          label: 'Acoustic Artifacts & Synth',
          icon: Radio,
          badge: `${audioCount} Feeds`,
          badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-700'
        },
        {
          id: 'tools' as ActiveTab,
          label: 'Sub-Audible Software Tools',
          icon: Wrench,
          badge: '5 Tools',
          badgeColor: 'bg-emerald-950 text-emerald-400 border-emerald-800'
        }
      ]
    },
    {
      title: 'CONTINUITY & ARCHIVES',
      items: [
        {
          id: 'reports' as ActiveTab,
          label: 'Annual Strategic Disclosures',
          icon: BarChart3,
          badge: `${reportCount} Years`,
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
        },
        {
          id: 'communications' as ActiveTab,
          label: 'Emails & Meeting Minutes',
          icon: Mail,
          badge: '24 Records',
          badgeColor: 'bg-blue-950 text-blue-300 border-blue-800'
        },
        {
          id: 'timeline' as ActiveTab,
          label: 'Historical Timeline (1971-2026)',
          icon: Clock,
          badge: '52 Events',
          badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800'
        },
        {
          id: 'newsletters' as ActiveTab,
          label: 'Internal Staff Newsletters',
          icon: Newspaper,
          badge: '6 Issues',
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
        }
      ]
    },
    {
      title: 'CORPORATE & HUMAN CAPITAL',
      items: [
        {
          id: 'training' as ActiveTab,
          label: 'Employee Training Modules',
          icon: GraduationCap,
          badge: '4 Modules',
          badgeColor: 'bg-amber-950 text-amber-300 border-amber-800'
        },
        {
          id: 'careers' as ActiveTab,
          label: 'Classified Job Postings',
          icon: Briefcase,
          badge: `${jobCount} Open`,
          badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800'
        },
        {
          id: 'values' as ActiveTab,
          label: '5 Pillars of Certainty',
          icon: Compass,
          badge: 'Doctrine',
          badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
        },
        {
          id: 'deadlinks' as ActiveTab,
          label: 'Dead Links & Wayback Mirrors',
          icon: Link2Off,
          badge: '7 Broken',
          badgeColor: 'bg-rose-950 text-rose-400 border-rose-800'
        }
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 md:w-72 bg-[#080b12] border-r border-[#1a2333] flex flex-col h-full overflow-y-auto select-none font-mono text-xs text-slate-300 shrink-0 scrollbar-thin">
      {/* Archive Header Status Box */}
      <div className="p-3 bg-gradient-to-b from-[#0c121d] to-[#080b12] border-b border-[#182335]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-cyan-400 font-bold tracking-widest flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            SECURE ARCHIVE REPO
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-bold">
            SYNCED
          </span>
        </div>
        <div className="bg-[#05070d] p-2 rounded border border-[#162133] text-[10px] flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-slate-500">DATABASE:</span>
            <span className="text-slate-300">GPC_POSTOJNA_MASTER</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">HASH ROOT:</span>
            <span className="text-cyan-400 truncate max-w-[120px]">0x7F4A...9E02</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">CLEARANCE:</span>
            <span className="text-amber-400 font-bold">{clearance.split(' - ')[0]}</span>
          </div>
          <div className="flex justify-between" title="Degree of initiation (Liber Carrier §IV)">
            <span className="text-slate-600">DEGREE:</span>
            <span className="text-fuchsia-300/80 flex items-center gap-1">
              {arg.earnedLevel >= 3 ? DEGREES[rank] : '████████'}
              <PlanetGlyph glyph={corr.glyph} />
            </span>
          </div>
        </div>
      </div>

      {/* THE CASE — Ordo Vocis Profundae */}
      <div className="p-2 pb-0">
        <button
          onClick={() => {
            gpcAudio.playUiSound('click');
            onSelectTab('sanctum');
          }}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded border transition-all cursor-pointer text-left ${
            activeTab === 'sanctum'
              ? 'bg-fuchsia-500/15 border-fuchsia-500/60 shadow-[0_0_16px_rgba(217,70,239,0.25)]'
              : 'bg-fuchsia-950/10 border-fuchsia-900/50 hover:border-fuchsia-600/60'
          }`}
        >
          <span className={`text-fuchsia-300 shrink-0 ${arg.currentSeal ? 'ovp-breathe' : ''}`}>
            <OrderSigil size={26} />
          </span>
          <span className="flex-1 min-w-0">
            <span className="block font-occult text-[12px] text-fuchsia-200 tracking-wider">The Seven Seals</span>
            <span className="block text-[9px] text-fuchsia-400/70 truncate">
              {arg.currentSeal
                ? `Active: Seal ${SEALS[arg.currentSeal - 1].numeral} — ${SEALS[arg.currentSeal - 1].title}`
                : 'Case closed · Silentium'}
            </span>
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded border border-fuchsia-800 bg-fuchsia-950 text-fuchsia-300 font-bold shrink-0">
            {arg.solved.length}/7
          </span>
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex flex-col p-2 gap-3.5">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="flex flex-col gap-1">
            <div className="px-2 py-1 text-[9px] font-bold tracking-widest text-slate-500 uppercase flex items-center justify-between">
              <span>{section.title}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      onSelectTab(item.id);
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 rounded transition-all cursor-pointer text-left group ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'hover:bg-[#111724] text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                          isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span className="text-[11px] truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border shrink-0 font-medium ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Subterranean Sensor Alert Footer */}
      <div className="mt-auto p-3 border-t border-[#182335] bg-[#070a10]">
        {arg.finaleComplete ? (
          <>
            <div className="flex items-center gap-2 text-slate-300 text-[10px] font-bold mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>STATION 07 — NO SIGNAL</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-tight">Carrier 0.000 Hz. Borehole 4 lift cage recovered. Frost on the inside has melted.</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-rose-400 text-[10px] font-bold mb-1">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
              <span>STATION 07 ALERT</span>
            </div>
            <p className="text-[9px] text-slate-500 leading-tight">
              Borehole 4 amplitude surge +18.4% above baseline. Executive Directive 01 standby confirmed.
              {arg.solved.length >= 3 && <span className="text-fuchsia-400/70"> Geophones report singing beneath the carrier.</span>}
            </p>
          </>
        )}
      </div>
    </aside>
  );
};
