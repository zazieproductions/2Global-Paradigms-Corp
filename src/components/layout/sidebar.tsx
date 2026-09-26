import { NavLink } from 'react-router-dom';
import { HardDrive, ShieldAlert } from 'lucide-react';
import { NAV_SECTIONS } from '@/config/navigation';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { shortClearance } from '@/lib/archive/clearance';
import { useProgression } from '@/hooks/use-progression';
import { Badge } from '@/components/ui/badge';
import { FictionNotice } from '@/components/ui/fiction-notice';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  /** Mobile drawer state. Ignored at md+ where the sidebar is always shown. */
  open: boolean;
  onNavigate: () => void;
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const { state } = useProgression();

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn('fixed inset-0 top-header z-30 bg-black/70 md:hidden', open ? 'block' : 'hidden')}
        onClick={onNavigate}
        aria-hidden
      />
      <aside
        id="archive-sidebar"
        aria-label="Archive sections"
        className={cn(
          'bg-inset border-r border-line flex-col overflow-y-auto font-mono text-xs text-slate-300 shrink-0 scrollbar-thin',
          'w-sidebar max-w-[85vw] md:w-64 lg:w-72',
          'fixed top-header bottom-0 left-0 z-40 md:static md:z-auto md:flex md:h-full',
          open ? 'flex' : 'hidden'
        )}
      >
        {/* Archive status box */}
        <div className="p-3 bg-gradient-to-b from-raised to-inset border-b border-line">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-caption text-cyan-400 font-bold tracking-widest flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" aria-hidden />
              SECURE ARCHIVE REPO
            </span>
            <Badge tone="success">SYNCED</Badge>
          </div>
          <dl className="bg-canvas p-2 rounded border border-line text-caption flex flex-col gap-1">
            <div className="flex justify-between">
              <dt className="text-slate-500">DATABASE:</dt>
              <dd className="text-slate-300">GPC_POSTOJNA_MASTER</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">HASH ROOT:</dt>
              <dd className="text-cyan-400 truncate max-w-[120px]">0x7F4A...9E02</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">CLEARANCE:</dt>
              <dd className="text-amber-400 font-bold">{shortClearance(state.access.clearance)}</dd>
            </div>
          </dl>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-2 gap-3.5" aria-label="Primary">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-1">
              <h2 className="px-2 py-1 text-micro font-bold tracking-widest text-slate-500 uppercase">
                {section.title}
              </h2>
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        end={item.path === '/'}
                        onClick={() => {
                          gpcAudio.playUiSound('click');
                          onNavigate();
                        }}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center justify-between px-2.5 py-2 rounded transition-all text-left group border',
                            isActive
                              ? 'bg-cyan-500/15 text-cyan-300 font-bold border-cyan-500/40 shadow-glow-sm shadow-signal/20'
                              : 'hover:bg-hover text-slate-400 hover:text-slate-200 border-transparent'
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span className="flex items-center gap-2.5 truncate">
                              <Icon
                                aria-hidden
                                className={cn(
                                  'w-3.5 h-3.5 shrink-0 transition-colors',
                                  isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                                )}
                              />
                              <span className="text-label truncate">{item.label}</span>
                            </span>
                            <Badge tone={item.badgeTone} className="shrink-0 font-medium">
                              {item.badge}
                            </Badge>
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Station alert footer */}
        <div className="mt-auto p-3 border-t border-line bg-canvas space-y-2">
          <div>
            <div className="flex items-center gap-2 text-rose-400 text-caption font-bold mb-1">
              <ShieldAlert className="w-3.5 h-3.5 animate-pulse" aria-hidden />
              <span>STATION 07 ALERT</span>
            </div>
            <p className="text-micro text-slate-500 leading-tight">
              Borehole 4 amplitude surge +18.4% above baseline. Executive Directive 01 standby confirmed.
            </p>
          </div>
          <FictionNotice className="border-t border-line-subtle pt-2" />
        </div>
      </aside>
    </>
  );
}
