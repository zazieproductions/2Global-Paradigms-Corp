import { useEffect, useId, useRef, useState } from 'react';
import {
  Check,
  HelpCircle,
  Key,
  MoreVertical,
  Terminal,
  Tv,
  Volume2,
  VolumeX,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Phone-sized overflow menu for the top bar.
 *
 * On a narrow viewport the header cannot hold ten controls, and the archive's
 * power features (terminal, whistleblower safe, CRT mode, UI sound) used to be
 * `hidden sm:inline-flex` — i.e. completely unreachable on a phone, where there
 * is also no keyboard to hit their `~` / `U` shortcuts. Everything the desktop
 * bar exposes is reachable from here instead.
 */

interface HeaderOverflowMenuProps {
  crt: boolean;
  sound: boolean;
  onToggleCrt: () => void;
  onToggleSound: () => void;
  onOpenTerminal: () => void;
  onOpenSafe: () => void;
  onOpenGuide: () => void;
}

interface Item {
  icon: LucideIcon;
  label: string;
  hint: string;
  onSelect: () => void;
  /** Renders a checkmark and wires `aria-checked` (toggle semantics). */
  checked?: boolean;
  iconClassName?: string;
}

export function HeaderOverflowMenu({
  crt,
  sound,
  onToggleCrt,
  onToggleSound,
  onOpenTerminal,
  onOpenSafe,
  onOpenGuide
}: HeaderOverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Dismiss on outside tap, Escape, or scroll of the page behind.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open]);

  const items: Item[] = [
    {
      icon: Terminal,
      label: 'GPC://CLI',
      hint: 'Command terminal',
      iconClassName: 'text-cyan-400',
      onSelect: onOpenTerminal
    },
    {
      icon: Key,
      label: 'WHISTLEBLOWER SAFE',
      hint: 'Project Palimpsest bypass',
      iconClassName: 'text-amber-400',
      onSelect: onOpenSafe
    },
    {
      icon: Tv,
      label: 'CRT SCANLINES',
      hint: crt ? 'On' : 'Off',
      iconClassName: crt ? 'text-cyan-300' : 'text-slate-400',
      checked: crt,
      onSelect: onToggleCrt
    },
    {
      icon: sound ? Volume2 : VolumeX,
      label: 'INTERFACE SOUNDS',
      hint: sound ? 'On' : 'Muted',
      iconClassName: sound ? 'text-cyan-400' : 'text-rose-400',
      checked: sound,
      onSelect: onToggleSound
    },
    {
      icon: HelpCircle,
      label: 'ARCHIVE GUIDE',
      hint: 'How this archive works · progress',
      iconClassName: 'text-slate-300',
      onSelect: onOpenGuide
    }
  ];

  return (
    <div className="relative sm:hidden" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label="More archive controls"
        className={cn(
          'tap-target p-1.5 rounded border transition-all cursor-pointer',
          open ? 'bg-active text-white border-cyan-500/60' : 'bg-hover text-slate-300 border-line-bright'
        )}
      >
        <MoreVertical className="w-4 h-4" aria-hidden />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label="More archive controls"
          className="absolute right-0 top-full mt-1.5 w-60 max-w-[calc(100vw-1rem)] z-50 rounded-lg border border-line-bright bg-panel shadow-modal overflow-hidden"
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                role={item.checked === undefined ? 'menuitem' : 'menuitemcheckbox'}
                aria-checked={item.checked}
                onClick={() => {
                  setOpen(false);
                  item.onSelect();
                }}
                className="tap-row w-full flex items-center gap-3 px-3 py-2.5 text-left border-b border-line-subtle last:border-b-0 hover:bg-hover active:bg-active transition-colors"
              >
                <Icon className={cn('w-4 h-4 shrink-0', item.iconClassName)} aria-hidden />
                <span className="flex-1 min-w-0">
                  <span className="block text-label font-bold text-slate-200 tracking-wider truncate">
                    {item.label}
                  </span>
                  <span className="block text-micro text-slate-500 truncate">{item.hint}</span>
                </span>
                {item.checked && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
