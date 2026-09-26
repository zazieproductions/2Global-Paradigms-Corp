import { useEffect, useState } from 'react';
import {
  Eye,
  EyeOff,
  HelpCircle,
  Key,
  Lock,
  Menu,
  Radio,
  Search,
  Shield,
  Terminal,
  Tv,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import type { ClearanceLevel } from '@/types';
import { REGIONAL_STATIONS } from '@/content';
import { SITE } from '@/config/site';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { clearanceTier } from '@/lib/archive/clearance';
import { useProgression } from '@/hooks/use-progression';
import { useDescrambler } from '@/hooks/use-investigation';
import { useArchiveUi } from '@/app/archive-ui-context';
import { HeaderOverflowMenu } from './header-overflow-menu';
import { cn } from '@/lib/utils/cn';

const CLEARANCE_PILL: Record<number, string> = {
  5: 'bg-rose-950 text-rose-300 border-rose-600 animate-pulse',
  4: 'bg-amber-950 text-amber-300 border-amber-500',
  3: 'bg-cyan-950 text-cyan-300 border-cyan-500',
  2: 'bg-blue-950 text-blue-300 border-blue-500',
  1: 'bg-slate-900 text-slate-300 border-slate-700'
};
const pillFor = (lvl: ClearanceLevel) => CLEARANCE_PILL[clearanceTier(lvl)] ?? CLEARANCE_PILL[1];

const ICON_BTN = 'tap-target p-1.5 rounded transition-all cursor-pointer border';

/** Live UTC clock + simulated 14.8 Hz carrier drift (decorative). */
function CarrierStatus() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const drift = (14.802 + Math.sin(now.getTime() * 0.0005) * 0.006).toFixed(3);

  return (
    <div
      className="hidden xl:flex items-center gap-4 bg-canvas border border-line-subtle px-3 py-1 rounded"
      aria-hidden
    >
      <div className="flex items-center gap-1.5 text-label">
        <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span className="text-slate-400">PLANETARY CARRIER:</span>
        <span className="text-cyan-300 font-bold">{drift} Hz</span>
      </div>
      <span className="text-slate-600">|</span>
      <div className="flex items-center gap-1.5 text-label">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-glow-sm shadow-phosphor" />
        <span className="text-slate-400">{REGIONAL_STATIONS.length} STATIONS ONLINE</span>
      </div>
      <span className="text-slate-600">|</span>
      <span className="text-caption text-amber-400 font-semibold">
        {now.toUTCString().replace('GMT', 'UTC')}
      </span>
    </div>
  );
}

interface TopHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function TopHeader({ sidebarOpen, onToggleSidebar }: TopHeaderProps) {
  const { state, clearance, setPreference } = useProgression();
  const { unredacted, unlocked: descramblerUnlocked, toggle: toggleDescrambler } = useDescrambler();
  const { openDialog } = useArchiveUi();
  const { crt, sound } = state.preferences;

  const click =
    (fn: () => void, sfx: Parameters<typeof gpcAudio.playUiSound>[0] = 'click') =>
    () => {
      gpcAudio.playUiSound(sfx);
      fn();
    };

  return (
    <header className="h-header bg-shell border-b border-line-strong flex items-center justify-between gap-1.5 md:gap-2 px-2 md:px-4 safe-x font-mono z-40 text-xs shrink-0 shadow-bar">
      {/* Brand */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className={cn(ICON_BTN, 'md:hidden bg-hover text-slate-300 border-line-bright')}
          aria-label={sidebarOpen ? 'Close archive sections' : 'Open archive sections'}
          aria-expanded={sidebarOpen}
          aria-controls="archive-sidebar"
        >
          {sidebarOpen ? <X className="w-4 h-4" aria-hidden /> : <Menu className="w-4 h-4" aria-hidden />}
        </button>
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 shrink-0 rounded bg-gradient-to-br from-cyan-500 via-indigo-600 to-rose-600 p-0.5 shadow-glow shadow-signal/35 flex items-center justify-center"
            aria-hidden
          >
            <div className="w-full h-full bg-inset rounded-[2px] flex items-center justify-center">
              <span className="text-cyan-400 font-black text-xs tracking-tighter">GPC</span>
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-wider text-sm truncate">
                GLOBAL PARADIGMS CORP.
              </span>
              <span className="hidden sm:inline-block text-micro px-1.5 py-px rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/80">
                {SITE.osVersion}
              </span>
            </div>
            <span className="hidden sm:block text-caption text-slate-400 truncate max-w-[200px] md:max-w-none">
              ARCHIVE NET // OPERATOR: {state.callsign.toUpperCase()} // STRATEGIC FORECASTING & CIVIC
              CONTINUITY
            </span>
          </div>
        </div>
      </div>

      <CarrierStatus />

      {/* Controls */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {/* Gateway Transmission (beginner puzzle trail) */}
        <button
          type="button"
          onClick={click(() => openDialog({ type: 'gateway' }), 'unredact')}
          className="tap-target flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 bg-fuchsia-950/40 hover:bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-500/50 hover:border-fuchsia-400 rounded transition-all cursor-pointer text-xs shadow-glow-sm shadow-order/15"
          title="Replay the buffered Gateway Transmission"
          aria-label="Gateway Transmission"
        >
          <Radio className="w-3.5 h-3.5 text-fuchsia-400 motion-safe:animate-pulse" aria-hidden />
          <span className="hidden md:inline text-label font-bold tracking-wider">▸ TRANSMISSION</span>
        </button>

        <button
          type="button"
          onClick={click(() => openDialog({ type: 'search' }))}
          className="tap-target flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 bg-hover hover:bg-active text-slate-200 border border-line-bright hover:border-cyan-500/50 rounded transition-all cursor-pointer text-xs"
          title="Global Archive Search (Ctrl+K or /)"
          aria-label="Search archive"
          aria-keyshortcuts="/ Control+K"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" aria-hidden />
          <span className="hidden md:inline text-label">SEARCH ARCHIVE</span>
          <kbd className="hidden lg:inline text-micro px-1 py-px bg-slate-800 rounded border border-slate-700 text-slate-400">
            /
          </kbd>
        </button>

        <button
          type="button"
          onClick={toggleDescrambler}
          aria-pressed={unredacted}
          aria-keyshortcuts="U"
          className={cn(
            'tap-target flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer border',
            unredacted
              ? 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-glow-sm shadow-alert/40 animate-pulse'
              : 'bg-hover text-slate-300 hover:text-white border-line-bright'
          )}
          title={
            unredacted
              ? 'De-Scrambler Active: Black Redactions Revealed'
              : descramblerUnlocked
                ? 'Enable Redaction De-Scrambler'
                : 'De-Scrambler locked — earned at Level 3'
          }
          aria-label={
            descramblerUnlocked ? 'Redaction de-scrambler' : 'Redaction de-scrambler (locked until Level 3)'
          }
        >
          {!descramblerUnlocked ? (
            <Lock className="w-3.5 h-3.5 text-slate-500" aria-hidden />
          ) : unredacted ? (
            <Eye className="w-3.5 h-3.5 text-rose-400" aria-hidden />
          ) : (
            <EyeOff className="w-3.5 h-3.5 text-slate-400" aria-hidden />
          )}
          <span className="hidden sm:inline text-label">{unredacted ? 'DE-SCRAMBLER: ON' : 'REDACTED'}</span>
        </button>

        <button
          type="button"
          onClick={click(() => openDialog({ type: 'terminal' }), 'scan')}
          className="tap-target hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-hover hover:bg-active text-cyan-300 border border-line-bright hover:border-cyan-500/60 rounded transition-all cursor-pointer text-xs"
          title="Open GPC Command Terminal (~)"
          aria-label="Open command terminal"
          aria-keyshortcuts="`"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" aria-hidden />
          <span className="hidden md:inline text-label">GPC://CLI</span>
        </button>

        <button
          type="button"
          onClick={click(() => openDialog({ type: 'safe' }))}
          className={cn(
            ICON_BTN,
            'hidden sm:inline-flex bg-hover hover:bg-amber-950/40 text-amber-400 border-line-bright hover:border-amber-500/50'
          )}
          title="Whistleblower Cryptographic Safe (Project Palimpsest Bypass)"
          aria-label="Open whistleblower safe"
        >
          <Key className="w-3.5 h-3.5" aria-hidden />
        </button>

        <button
          type="button"
          onClick={click(() => setPreference('crt', !crt))}
          aria-pressed={crt}
          className={cn(
            ICON_BTN,
            'hidden sm:inline-flex',
            crt
              ? 'bg-cyan-950 text-cyan-300 border-cyan-500 shadow-glow-sm shadow-signal'
              : 'bg-hover text-slate-400 hover:text-slate-200 border-line-bright'
          )}
          title="Toggle Retro CRT Scanline Display Mode"
          aria-label="CRT scanline mode"
        >
          <Tv className="w-3.5 h-3.5" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => {
            setPreference('sound', !sound);
            gpcAudio.toggleSound(!sound);
            gpcAudio.playUiSound('click');
          }}
          aria-pressed={sound}
          className={cn(
            ICON_BTN,
            'hidden sm:inline-flex',
            sound
              ? 'bg-hover text-cyan-400 border-line-bright'
              : 'bg-rose-950/50 text-rose-400 border-rose-800'
          )}
          title={sound ? 'Mute Mechanical UI Sounds' : 'Unmute UI Sound Effects'}
          aria-label="Interface sounds"
        >
          {sound ? (
            <Volume2 className="w-3.5 h-3.5" aria-hidden />
          ) : (
            <VolumeX className="w-3.5 h-3.5" aria-hidden />
          )}
        </button>

        <button
          type="button"
          onClick={click(() => openDialog({ type: 'clearance' }))}
          className={cn(
            'tap-target flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded border text-caption font-bold tracking-wider cursor-pointer transition-all',
            pillFor(clearance)
          )}
          title="Click to authenticate or elevate Security Clearance"
          aria-label={`Security clearance: ${clearance}. Change clearance`}
        >
          <Shield className="w-3 h-3" aria-hidden />
          <span className="truncate max-w-[70px] md:max-w-none">{clearance.toUpperCase()}</span>
        </button>

        <button
          type="button"
          onClick={click(() => openDialog({ type: 'help' }))}
          className={cn(
            ICON_BTN,
            'hidden sm:inline-flex bg-hover hover:bg-slate-800 text-slate-400 hover:text-white border-line-bright'
          )}
          title="About Global Paradigms Corp. Archive & Architecture Guide"
          aria-label="Archive guide and progress"
        >
          <HelpCircle className="w-3.5 h-3.5" aria-hidden />
        </button>

        {/* Everything the bar drops below `sm` stays reachable here. */}
        <HeaderOverflowMenu
          crt={crt}
          sound={sound}
          onToggleCrt={click(() => setPreference('crt', !crt))}
          onToggleSound={() => {
            setPreference('sound', !sound);
            gpcAudio.toggleSound(!sound);
            gpcAudio.playUiSound('click');
          }}
          onOpenTerminal={click(() => openDialog({ type: 'terminal' }), 'scan')}
          onOpenSafe={click(() => openDialog({ type: 'safe' }))}
          onOpenGuide={click(() => openDialog({ type: 'help' }))}
        />
      </div>
    </header>
  );
}
