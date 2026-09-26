/**
 * Archive UI context — overlay state shared by the shell and every page.
 *
 * Player progression (clearance, de-scrambler, puzzles, preferences) lives in
 * the progression store (`useProgression`). This context only holds which
 * dialog is open. The document viewer is URL-driven (`?doc=<id|code>`) so
 * every document is deep-linkable.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { ActiveTab, DeadLink, DocumentRecord, JobPosting, TrainingModule } from '@/types';
import { pathForTab } from '@/config/navigation';
import { resolveDocument } from '@/lib/archive/records';

export type ArchiveDialog =
  | { type: 'search' }
  | { type: 'terminal' }
  | { type: 'safe' }
  | { type: 'clearance' }
  | { type: 'help' }
  /** Thorne's dead-drop — shown once after the first boot. */
  | { type: 'prologue' }
  /** The Counter-Rite (Seal VII). */
  | { type: 'finale' }
  /** Gateway Transmission — the guided beginner trail. */
  | { type: 'gateway' }
  | { type: 'training'; module: TrainingModule }
  | { type: 'job'; job: JobPosting }
  | { type: 'dead-link'; link: DeadLink };

export interface ArchiveUi {
  dialog: ArchiveDialog | null;
  openDialog: (dialog: ArchiveDialog) => void;
  closeDialog: () => void;
  /** Toggle a simple dialog (used by the `~` terminal shortcut). */
  toggleDialog: (type: 'terminal' | 'search') => void;
  /** Raw `?doc=` value, if any. */
  documentParam: string | null;
  /** The resolved document for `?doc=`, or undefined if missing / not set. */
  openDocumentRecord: DocumentRecord | undefined;
  openDocument: (docOrId: DocumentRecord | string) => void;
  closeDocument: () => void;
  navigateToTab: (tab: ActiveTab, recordId?: string) => void;
}

const ArchiveUiContext = createContext<ArchiveUi | null>(null);

export function ArchiveUiProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ArchiveDialog | null>(null);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  const documentParam = params.get('doc');
  const openDocumentRecord = useMemo(() => resolveDocument(documentParam), [documentParam]);

  const openDocument = useCallback(
    (docOrId: DocumentRecord | string) => {
      const id = typeof docOrId === 'string' ? docOrId : docOrId.id;
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('doc', id);
          return next;
        },
        { preventScrollReset: true }
      );
    },
    [setParams]
  );

  const closeDocument = useCallback(() => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('doc');
        return next;
      },
      { preventScrollReset: true }
    );
  }, [setParams]);

  const navigateToTab = useCallback(
    (tab: ActiveTab, recordId?: string) => {
      const path = pathForTab(tab);
      navigate(recordId ? `${path}?record=${encodeURIComponent(recordId)}` : path);
    },
    [navigate]
  );

  const closeDialog = useCallback(() => setDialog(null), []);
  const toggleDialog = useCallback(
    (type: 'terminal' | 'search') => setDialog((d) => (d?.type === type ? null : { type })),
    []
  );

  const value = useMemo<ArchiveUi>(
    () => ({
      dialog,
      openDialog: setDialog,
      closeDialog,
      toggleDialog,
      documentParam,
      openDocumentRecord,
      openDocument,
      closeDocument,
      navigateToTab
    }),
    [
      dialog,
      closeDialog,
      toggleDialog,
      documentParam,
      openDocumentRecord,
      openDocument,
      closeDocument,
      navigateToTab
    ]
  );

  return <ArchiveUiContext.Provider value={value}>{children}</ArchiveUiContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useArchiveUi(): ArchiveUi {
  const ctx = useContext(ArchiveUiContext);
  if (!ctx) throw new Error('useArchiveUi must be used inside <ArchiveUiProvider>');
  return ctx;
}
