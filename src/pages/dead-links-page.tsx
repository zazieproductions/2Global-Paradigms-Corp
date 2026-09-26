import { Link2Off, Globe, ExternalLink } from 'lucide-react';
import { DEAD_LINKS } from '@/content';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useArchiveUi } from '@/app/archive-ui-context';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';

const deadLinks = DEAD_LINKS;

export default function DeadLinksPage() {
  const { openDialog } = useArchiveUi();
  return (
    <ArchivePage>
      <ViewHeader
        icon={Link2Off}
        iconClassName="text-rose-400"
        title="DEAD EXTERNAL LINKS & SEIZED MIRROR ARCHIVES"
        subtitle={`${deadLinks.length} Purged External Forums, Seized Whistleblower Mirrors & 1998 Wayback Snapshots`}
        aside={
          <span className="text-label px-2.5 py-1 bg-rose-950/40 border border-rose-600/60 rounded text-rose-300 font-bold self-start md:self-auto">
            {deadLinks.length} PURGED DESTINATIONS
          </span>
        }
      />

      {/* Grid of Dead Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deadLinks.map((link) => (
          <button
            type="button"
            aria-haspopup="dialog"
            key={link.id}
            onClick={() => {
              gpcAudio.playUiSound('click');
              openDialog({ type: 'dead-link', link });
            }}
            className="w-full text-left p-5 bg-panel hover:bg-hover border border-line-strong hover:border-rose-500/50 rounded-lg shadow-lg flex flex-col justify-between space-y-4 group cursor-pointer transition-all"
          >
            <span className="block space-y-2.5">
              <span className="flex items-center justify-between border-b border-line pb-2">
                <span className="font-bold text-rose-400 text-xs font-mono">{link.errorType}</span>
                <span className="text-caption text-slate-500">
                  {link.archiveDate.split(': ')[1]?.slice(0, 10) || ''}
                </span>
              </span>

              <span className="flex items-center gap-2 text-cyan-300">
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-bold truncate group-hover:text-rose-300 transition-colors">
                  {link.url}
                </span>
              </span>

              <span className="block text-xs font-bold text-slate-200 leading-snug">
                {link.originalTitle}
              </span>

              <span className="block p-3 bg-inset border-l-2 border-rose-500 rounded text-caption text-slate-300 italic font-serif leading-relaxed line-clamp-3">
                {link.cachedSnippet}
              </span>
            </span>

            <span className="pt-2 border-t border-line-subtle flex items-center justify-between text-caption text-slate-400">
              <span>HOST: {link.originalHost}</span>
              <span className="text-rose-400 font-bold group-hover:underline flex items-center gap-1">
                <span>INSPECT CACHE</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </span>
          </button>
        ))}
      </div>
    </ArchivePage>
  );
}
