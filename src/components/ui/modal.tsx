import { useEffect, useId, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { X, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

/**
 * Accessible modal dialog used by every overlay in the archive.
 *
 * - Rendered in a portal with `role="dialog"` + `aria-modal` + `aria-labelledby`.
 * - Focus moves into the dialog on open and returns to the opener on close.
 * - Tab / Shift+Tab are trapped inside.
 * - Escape closes only the top-most dialog (a module-level stack tracks nesting).
 * - Background scroll is locked while any dialog is open.
 */

const stack: symbol[] = [];

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

export type ModalTone = 'signal' | 'warning' | 'success' | 'danger' | 'neutral' | 'purple';
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';

const TONE: Record<ModalTone, { frame: string; title: string }> = {
  signal: { frame: 'border-cyan-500/40 shadow-glow-lg shadow-signal/20', title: 'text-cyan-400' },
  warning: { frame: 'border-amber-500/40 shadow-glow-lg shadow-amber-500/15', title: 'text-amber-400' },
  success: { frame: 'border-emerald-500/40 shadow-glow-lg shadow-emerald-500/15', title: 'text-emerald-400' },
  danger: { frame: 'border-rose-500/40 shadow-glow-lg shadow-rose-500/15', title: 'text-rose-400' },
  purple: { frame: 'border-purple-500/40 shadow-glow-lg shadow-purple-500/15', title: 'text-purple-400' },
  neutral: { frame: 'border-line-bright shadow-modal', title: 'text-slate-200' }
};

const SIZE: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl'
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** Accessible description (id wired to aria-describedby). */
  description?: ReactNode;
  icon?: LucideIcon;
  tone?: ModalTone;
  size?: ModalSize;
  /**
   * `card`: padded box with an inline title row (small dialogs).
   * `window`: edge-to-edge title bar + scrollable body (viewers, terminals).
   */
  variant?: 'card' | 'window';
  /** Extra controls rendered in the title bar, before the close button. */
  headerActions?: ReactNode;
  footer?: ReactNode;
  /** Close when the dimmed backdrop is clicked. Off by default to protect input. */
  closeOnBackdrop?: boolean;
  /** Element to focus on open (defaults to the first focusable child). */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Hide the title bar visually (title stays available to screen readers). The body must provide its own close control. */
  hideTitleBar?: boolean;
  /** Vertical placement. `top` suits command palettes. */
  position?: 'center' | 'top';
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  tone = 'signal',
  size = 'lg',
  variant = 'card',
  headerActions,
  footer,
  closeOnBackdrop = false,
  initialFocusRef,
  position = 'center',
  hideTitleBar = false,
  className,
  bodyClassName,
  children
}: ModalProps) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const token = Symbol('modal');
    stack.push(token);
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const dialog = dialogRef.current;
    const focusFirst = () => {
      const target =
        initialFocusRef?.current ??
        dialog?.querySelector<HTMLElement>('[data-autofocus]') ??
        dialog?.querySelector<HTMLElement>(FOCUSABLE) ??
        dialog;
      target?.focus();
    };
    // Wait a frame so children (e.g. inputs) have mounted.
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e: KeyboardEvent) => {
      if (stack[stack.length - 1] !== token || !dialog) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (n) => n.offsetParent !== null || n === document.activeElement
      );
      if (nodes.length === 0) {
        e.preventDefault();
        dialog.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown, true);
      const i = stack.indexOf(token);
      if (i !== -1) stack.splice(i, 1);
      if (stack.length === 0) document.body.style.overflow = prevOverflow;
      if (opener && document.contains(opener)) opener.focus();
    };
  }, [open, initialFocusRef]);

  if (!open) return null;

  const t = TONE[tone];
  const closeButton = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close dialog"
      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
    >
      <X className="w-4 h-4" aria-hidden />
    </button>
  );
  const heading = (
    <div className={cn('flex items-center gap-2 font-bold min-w-0', t.title)}>
      {Icon && <Icon className="w-5 h-5 shrink-0" aria-hidden />}
      <h2 id={titleId} className="truncate">
        {title}
      </h2>
    </div>
  );

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex justify-center bg-black/85 backdrop-blur-md p-3 font-mono text-xs',
        position === 'top' ? 'items-start pt-16 md:pt-24' : 'items-center'
      )}
      onMouseDown={(e) => {
        if (closeOnBackdrop && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          'bg-panel border rounded-lg w-full text-slate-200 flex flex-col outline-none',
          position === 'top' ? 'max-h-[80vh]' : 'max-h-[92vh]',
          SIZE[size],
          t.frame,
          variant === 'card' && 'p-6 space-y-4 overflow-y-auto scrollbar-thin',
          variant === 'window' && 'overflow-hidden',
          className
        )}
      >
        {hideTitleBar ? (
          <h2 id={titleId} className="sr-only">
            {title}
          </h2>
        ) : variant === 'card' ? (
          <div className="flex items-center justify-between gap-3 border-b border-line-strong pb-3">
            {heading}
            <div className="flex items-center gap-1.5 shrink-0">
              {headerActions}
              {closeButton}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-raised border-b border-line-strong shrink-0">
            {heading}
            <div className="flex items-center gap-1.5 shrink-0">
              {headerActions}
              {closeButton}
            </div>
          </div>
        )}
        {description && (
          <p id={descId} className={cn('text-label text-slate-400', variant === 'window' && 'px-4 pt-3')}>
            {description}
          </p>
        )}
        <div
          className={cn(
            variant === 'window' && 'flex-1 min-h-0 overflow-y-auto scrollbar-thin',
            bodyClassName
          )}
        >
          {children}
        </div>
        {footer && (
          <div
            className={cn(
              'flex justify-end gap-2',
              variant === 'card' ? 'pt-2' : 'px-4 py-3 border-t border-line-strong bg-raised shrink-0'
            )}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
