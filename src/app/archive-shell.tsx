/**
 * Archive shell — the persistent chrome around every page:
 * skip link, top bar, sidebar, routed page (<Outlet/>), audio bar, dialogs,
 * global keyboard shortcuts and the cold-boot gate.
 */
import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { FEATURES } from '@/config/features';
import { NAV_ITEMS, tabForPath } from '@/config/navigation';
import { SITE } from '@/config/site';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useProgression } from '@/hooks/use-progression';
import { TopHeader } from '@/components/layout/top-header';
import { Sidebar } from '@/components/layout/sidebar';
import { AudioPlayerBar } from '@/components/audio/audio-player-bar';
import { DocumentViewerModal } from '@/components/archive/document-viewer-modal';
import { GlobalSearchModal } from '@/components/archive/global-search-modal';
import { DeadLinkViewerModal } from '@/components/archive/dead-link-viewer-modal';
import { ArchiveGuideModal } from '@/components/archive/archive-guide-modal';
import { TerminalModal } from '@/components/puzzles/terminal-modal';
import { PalimpsestSafeModal } from '@/components/puzzles/palimpsest-safe-modal';
import { ClearanceModal } from '@/components/puzzles/clearance-modal';
import { BootSequence } from '@/components/puzzles/boot-sequence';
import { TrainingModuleModal } from '@/components/corporate/training-module-modal';
import { ApplicationModal } from '@/components/corporate/application-modal';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { FictionNotice } from '@/components/ui/fiction-notice';
import { SystemNotice } from '@/components/ui/system-notice';
import { useArchiveUi } from './archive-ui-context';
import { cn } from '@/lib/utils/cn';

const isTypingTarget = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

export function PageLoading() {
  return (
    <div className="p-4 md:p-6">
      <SystemNotice kind="loading" title="Spooling records from VAULT0…" code="SPOOL">
        Decompressing sector index. Tape heads aligning.
      </SystemNotice>
    </div>
  );
}

export function ArchiveShell() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const ui = useArchiveUi();
  const { dialog, openDialog, closeDialog, toggleDialog } = ui;
  const { state, setUnredacted, discover, complete, setCallsign } = useProgression();
  const [bootDone, setBootDone] = useState(!FEATURES.bootSequence);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const firstRoute = useRef(true);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile drawer whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setSidebarOpen(false);
  }

  // Keep the audio engine's UI-sound switch in sync with the saved preference.
  useEffect(() => {
    gpcAudio.toggleSound(state.preferences.sound);
  }, [state.preferences.sound]);

  // Record documents the operator has opened.
  const openDocId = ui.openDocumentRecord?.id;
  useEffect(() => {
    if (openDocId) discover(openDocId);
  }, [openDocId, discover]);

  // Title + focus management on navigation.
  useEffect(() => {
    const tab = tabForPath(pathname);
    const label = NAV_ITEMS.find((i) => i.id === tab)?.label ?? 'Missing File';
    document.title = tab === 'dashboard' ? SITE.title : `${label} // ${SITE.name}`;
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  // Global keyboard shortcuts (never while typing or while a dialog is open).
  useEffect(() => {
    if (!bootDone) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;
      if (document.querySelector('[aria-modal="true"]')) return;
      if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        gpcAudio.playUiSound('click');
        openDialog({ type: 'search' });
      } else if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        gpcAudio.playUiSound('scan');
        toggleDialog('terminal');
      } else if ((e.key === 'u' || e.key === 'U') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        gpcAudio.playUiSound('unredact');
        setUnredacted(!state.access.unredacted);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bootDone, openDialog, toggleDialog, setUnredacted, state.access.unredacted]);

  const record = params.get('record') ?? '';

  return (
    <>
      {!bootDone && (
        <BootSequence
          onComplete={(callsign, executiveOverride) => {
            setCallsign(callsign);
            if (executiveOverride) complete('boot-override', 'answer');
            setBootDone(true);
            gpcAudio.playUiSound('grant');
          }}
        />
      )}

      <div
        className={cn(
          'flex flex-col w-screen h-dvh bg-void text-slate-200 overflow-hidden font-mono',
          state.preferences.crt && 'crt-scanlines'
        )}
        inert={!bootDone}
      >
        <a
          href="#archive-main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-3 focus:py-2 focus:bg-cyan-500 focus:text-black focus:font-bold focus:rounded"
        >
          Skip to archive content
        </a>

        <TopHeader sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <div className="flex flex-1 w-full min-h-0 overflow-hidden relative">
          <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

          <main
            id="archive-main"
            ref={mainRef}
            tabIndex={-1}
            className="flex-1 flex flex-col min-w-0 h-full bg-canvas overflow-hidden relative outline-none"
          >
            <ErrorBoundary resetKey={pathname}>
              <Suspense fallback={<PageLoading />}>
                {/* Remount a page when its ?record= deep link changes (not when ?doc= changes). */}
                <Outlet key={record} />
              </Suspense>
            </ErrorBoundary>
            <FictionNotice className="md:hidden px-3 py-1.5 border-t border-line bg-inset" />
          </main>
        </div>

        <AudioPlayerBar />
      </div>

      {/* Dialogs */}
      <GlobalSearchModal
        open={dialog?.type === 'search'}
        onClose={closeDialog}
        onOpenDocument={ui.openDocument}
      />
      <TerminalModal
        open={dialog?.type === 'terminal'}
        onClose={closeDialog}
        onOpenDocument={ui.openDocument}
      />
      <PalimpsestSafeModal open={dialog?.type === 'safe'} onClose={closeDialog} />
      <ClearanceModal open={dialog?.type === 'clearance'} onClose={closeDialog} />
      <ArchiveGuideModal
        open={dialog?.type === 'help'}
        onClose={closeDialog}
        onOpenSafe={() => openDialog({ type: 'safe' })}
      />
      <TrainingModuleModal
        module={dialog?.type === 'training' ? dialog.module : null}
        onClose={closeDialog}
      />
      <ApplicationModal job={dialog?.type === 'job' ? dialog.job : null} onClose={closeDialog} />
      <DeadLinkViewerModal
        deadLink={dialog?.type === 'dead-link' ? dialog.link : null}
        onClose={closeDialog}
      />
      <DocumentViewerModal
        requestedId={ui.documentParam}
        document={ui.openDocumentRecord}
        onClose={ui.closeDocument}
        isGlobalUnredacted={state.access.unredacted}
        onToggleUnredacted={() => setUnredacted(!state.access.unredacted)}
      />
    </>
  );
}
