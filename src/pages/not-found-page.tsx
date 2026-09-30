import { Link, useLocation } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { SystemNotice } from '@/components/ui/system-notice';

/** Missing-file state for unknown URLs. */
export default function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <ArchivePage>
      <ViewHeader
        icon={FileQuestion}
        iconClassName="text-amber-400"
        title="FILE NOT FOUND"
        subtitle="Vault index lookup failed"
      />
      <SystemNotice
        kind="missing"
        title="No record at this path"
        code="ERR-404"
        action={
          <Link to="/" className="text-caption text-cyan-400 hover:text-cyan-300 underline">
            Return to Command Dashboard
          </Link>
        }
      >
        <span className="text-amber-300 break-all">{pathname}</span> is not mounted on VAULT0. The folder may
        have been purged under Directive 17 or never existed. Use the sidebar or archive search to continue.
        Nothing purged is ever gone: the tape remembers what the index refuses (terminal:{' '}
        <span className="text-cyan-300">salvage</span>).
      </SystemNotice>
    </ArchivePage>
  );
}
