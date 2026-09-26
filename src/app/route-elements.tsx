/** Elements used by the route table (kept separate so router.tsx stays config-only). */
import { Navigate, useLocation, useRouteError } from 'react-router-dom';
import { ArchiveUiProvider } from './archive-ui-context';
import { ArchiveShell } from './archive-shell';
import { SystemNotice } from '@/components/ui/system-notice';

export function RootLayout() {
  return (
    <ArchiveUiProvider>
      <ArchiveShell />
    </ArchiveUiProvider>
  );
}

/** Redirect that preserves the query string (so `?doc=` / `?record=` survive). */
export function LegacyRedirect({ to }: { to: string }) {
  const { search, hash } = useLocation();
  return <Navigate to={`${to}${search}${hash}`} replace />;
}

export function RouteError() {
  const error = useRouteError();
  if (import.meta.env.DEV) console.error(error);
  return (
    <div className="min-h-dvh bg-void p-6 font-mono">
      <SystemNotice
        kind="error"
        title="Archive kernel fault"
        action={
          <a href="/" className="text-caption text-cyan-400 underline">
            Cold-boot the archive
          </a>
        }
      >
        PARADIGM-OS could not mount this view. Reload to restart the session; your investigation progress is
        kept.
      </SystemNotice>
    </div>
  );
}
