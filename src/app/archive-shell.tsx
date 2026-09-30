/**
 * Archive shell — the persistent chrome around every page:
 * skip link, top bar, sidebar, routed page (<Outlet/>), audio bar, dialogs,
 * global keyboard shortcuts and the cold-boot gate.
 */
import { Suspense, useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { FEATURES } from '@/config/features';
import { tabForPath } from '@/config/navigation';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useProgression } from '@/hooks/use-progression';
import { notify, useDescrambler } from '@/hooks/use-investigation';
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
import { PrologueModal } from '@/components/puzzles/prologue-modal';
import { FinaleOverlay } from '@/components/puzzles/finale-overlay';
import { GatewayModal } from '@/components/puzzles/gateway/gateway-modal';
import { HiddenSigilLayer } from '@/components/puzzles/hidden-sigil-layer';
import { RevelationToasts } from '@/components/puzzles/revelation-toasts';
import { SigilWatermark } from '@/components/ui/sigils';
import { TrainingModuleModal } from '@/components/corporate/training-module-modal';
import { ApplicationModal } from '@/components/corporate/application-modal';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { FictionNotice } from '@/components/ui/fiction-notice';
import { SystemNotice } from '@/components/ui/system-notice';
import { RouteMetadata } from '@/components/seo/route-metadata';
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
  const progression = useProgression();
  const { state, discover, setCallsign, markPrologueSeen, completeFinale } = progression;
  const { unredacted, toggle: toggleDescrambler } = useDescrambler();
  const solvedSeals = Object.keys(state.completed).filter((id) => id.startsWith('seal-')).length;
  const goToSanctum = () => {
    closeDialog();
    ui.navigateToTab('sanctum');
  };

  const [bootDone, setBootDone] = useState(!FEATURES.bootSequence);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const toggleDescramblerRef = useRef(() => {});
  const firstRoute = useRef(true);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile drawer whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setSidebarOpen(false);
  }

  useEffect(() => {
    toggleDescramblerRef.current = toggleDescrambler;
  });

  // Keep the audio engine's UI-sound switch in sync with the saved preference.
  useEffect(() => {
    gpcAudio.toggleSound(state.preferences.sound);
  }, [state.preferences.sound]);

  // Record documents the operator has opened.
  const openDocId = ui.openDocumentRecord?.id;
  useEffect(() => {
    if (openDocId) discover(openDocId);
  }, [openDocId, discover]);

  // Focus management on navigation. RouteMetadata owns the document head.
  useEffect(() => {
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
        toggleDescramblerRef.current();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [bootDone, openDialog, toggleDialog]);

  const record = params.get('record') ?? '';

  return (
    <>
      <RouteMetadata />
      {!bootDone && (
        <BootSequence
          onComplete={(callsign) => {
            setCallsign(callsign);
            setBootDone(true);
            gpcAudio.playUiSound('grant');
            // First visit: Thorne's dead-drop breaks in right after the boot.
            if (!state.investigation.prologueSeen) openDialog({ type: 'prologue' });
          }}
        />
      )}

      <div
        className={cn(
          'flex flex-col w-full h-dvh bg-void text-slate-200 overflow-hidden font-mono',
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
            <SigilWatermark intensity={0.012 + 0.006 * solvedSeals} />
            <HiddenSigilLayer activeTab={tabForPath(pathname)} />
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
        onInvoke={() => openDialog({ type: 'finale' })}
      />
      <PalimpsestSafeModal open={dialog?.type === 'safe'} onClose={closeDialog} onGoToSanctum={goToSanctum} />
      <ClearanceModal open={dialog?.type === 'clearance'} onClose={closeDialog} onOpenSanctum={goToSanctum} />
      <PrologueModal
        open={dialog?.type === 'prologue'}
        callsign={state.callsign}
        onBegin={() => {
          markPrologueSeen();
          goToSanctum();
        }}
        onDismiss={() => {
          markPrologueSeen();
          closeDialog();
        }}
      />
      <GatewayModal
        open={dialog?.type === 'gateway'}
        onClose={closeDialog}
        onComplete={() => {
          gpcAudio.playUiSound('grant');
          notify(
            'GATEWAY TRANSMISSION COMPLETE',
            'Three keys kept. The case file is open — begin with Saturn.',
            '✦',
            '#d946ef'
          );
          goToSanctum();
        }}
      />
      <FinaleOverlay
        open={dialog?.type === 'finale'}
        callsign={state.callsign}
        onComplete={() => {
          completeFinale();
          goToSanctum();
        }}
      />
      <ArchiveGuideModal
        open={dialog?.type === 'help'}
        onClose={closeDialog}
        onOpenSafe={() => openDialog({ type: 'safe' })}
        onOpenSanctum={goToSanctum}
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
        isGlobalUnredacted={unredacted}
        onToggleUnredacted={toggleDescrambler}
      />
      <RevelationToasts />
    </>
  );
}
