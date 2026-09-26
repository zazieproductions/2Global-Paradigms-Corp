import { Archive, Globe, History, Link2Off, X } from 'lucide-react';
import type { DeadLink } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { Modal } from '@/components/ui/modal';

interface DeadLinkViewerModalProps {
  deadLink: DeadLink | null;
  onClose: () => void;
}

/** Simulated proxy browser for a fictional dead URL. Nothing is fetched. */
export function DeadLinkViewerModal({ deadLink, onClose }: DeadLinkViewerModalProps) {
  if (!deadLink) return null;
  const close = () => {
    gpcAudio.playUiSound('click');
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={`Wayback mirror: ${deadLink.originalTitle}`}
      hideTitleBar
      variant="window"
      tone="danger"
      size="2xl"
      className="max-w-3xl max-h-[85vh] shadow-alert/20"
      bodyClassName="flex flex-col"
    >
      {/* Fake browser chrome */}
      <div className="p-3 bg-raised border-b border-line-strong flex flex-col gap-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-caption text-slate-500 ml-2">GPC PROXY BROWSER v4.1</span>
          </div>
          <button
            type="button"
            onClick={close}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
            aria-label="Close mirror"
          >
            <X className="w-4 h-4" aria-hidden />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-canvas border border-line-strong px-3 py-1.5 rounded text-label text-slate-300">
          <Globe className="w-3.5 h-3.5 text-rose-400 shrink-0" aria-hidden />
          <span className="truncate flex-1 text-rose-300" title="Fictional address — not a real site">
            {deadLink.url}
          </span>
          <span className="text-micro px-1.5 py-px rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold shrink-0">
            {deadLink.errorType.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-canvas scrollbar-thin">
        <div
          className="p-4 bg-rose-950/30 border border-rose-500/50 rounded flex items-start gap-3"
          role="alert"
        >
          <Link2Off className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" aria-hidden />
          <div className="space-y-1 text-slate-300">
            <h3 className="text-sm font-bold text-white">HTTP STATUS: {deadLink.errorType}</h3>
            <p className="text-label text-slate-400">HOST: {deadLink.originalHost}</p>
            <p className="text-caption text-rose-300">
              The requested external server could not be reached. The domain may have been seized,
              de-registered, or purged under GPC Project Palimpsest compliance injunctions.
            </p>
          </div>
        </div>

        <section className="p-5 bg-panel border border-line-strong rounded space-y-3">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <span className="text-caption font-bold text-cyan-400 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" aria-hidden />
              WAYBACK ARCHIVAL SNAPSHOT
            </span>
            <span className="text-micro text-slate-500">{deadLink.archiveDate}</span>
          </div>
          <h4 className="font-bold text-white text-xs">{deadLink.originalTitle}</h4>
          <div className="p-3 bg-canvas border-l-2 border-cyan-500 text-slate-300 text-label leading-relaxed whitespace-pre-line font-serif italic">
            {deadLink.cachedSnippet}
          </div>
        </section>

        <section className="p-4 bg-raised border border-slate-800 rounded space-y-1.5 text-caption">
          <h4 className="text-amber-400 font-bold flex items-center gap-1.5">
            <Archive className="w-3.5 h-3.5 text-amber-400" aria-hidden />
            GPC INTERNAL INVESTIGATIVE LOG:
          </h4>
          <p className="text-slate-300 leading-normal">{deadLink.investigatorNotes}</p>
        </section>
      </div>
    </Modal>
  );
}
