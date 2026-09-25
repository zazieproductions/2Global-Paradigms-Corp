import React from 'react';
import { Link2Off, X, Globe, History, AlertTriangle, ShieldAlert, Archive } from 'lucide-react';
import { DeadLink } from '../types';
import { gpcAudio } from '../lib/audioEngine';

interface DeadLinkViewerModalProps {
  deadLink: DeadLink | null;
  onClose: () => void;
}

export const DeadLinkViewerModal: React.FC<DeadLinkViewerModalProps> = ({
  deadLink,
  onClose
}) => {
  if (!deadLink) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 select-none font-mono text-xs">
      <div className="bg-[#0b0f19] border border-rose-500/40 rounded-lg max-w-3xl w-full max-h-[85vh] flex flex-col shadow-[0_0_60px_rgba(255,0,85,0.2)] overflow-hidden text-slate-200">
        {/* Fake Browser Top Chrome */}
        <div className="p-3 bg-[#0d121c] border-b border-[#1c273c] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] text-slate-500 ml-2">GPC PROXY BROWSER v4.1</span>
            </div>
            <button
              onClick={() => {
                gpcAudio.playUiSound('click');
                onClose();
              }}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* URL Address Bar */}
          <div className="flex items-center gap-2 bg-[#05070d] border border-[#1b2538] px-3 py-1.5 rounded text-[11px] text-slate-300">
            <Globe className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate flex-1 text-rose-300">{deadLink.url}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 border border-rose-800 font-bold shrink-0">
              {deadLink.errorType.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Browser Viewport */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-[#07090e] scrollbar-thin">
          {/* Error Banner */}
          <div className="p-4 bg-rose-950/30 border border-rose-500/50 rounded flex items-start gap-3">
            <Link2Off className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-slate-300">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>HTTP STATUS: {deadLink.errorType}</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                HOST: {deadLink.originalHost}
              </p>
              <p className="text-[10px] text-rose-300">
                The requested external server could not be reached. The domain may have been seized, de-registered, or purged under GPC Project Palimpsest compliance injunctions.
              </p>
            </div>
          </div>

          {/* Cached Wayback Archive Mirror */}
          <div className="p-5 bg-[#0a0d16] border border-[#1e2a3f] rounded space-y-3">
            <div className="flex items-center justify-between border-b border-[#182335] pb-2">
              <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-cyan-400" />
                WAYBACK ARCHIVAL SNAPSHOT
              </span>
              <span className="text-[9px] text-slate-500">{deadLink.archiveDate}</span>
            </div>

            <h4 className="font-bold text-white text-xs">{deadLink.originalTitle}</h4>

            <div className="p-3 bg-[#05070d] border-l-2 border-cyan-500 text-slate-300 text-[11px] leading-relaxed whitespace-pre-line font-serif italic">
              {deadLink.cachedSnippet}
            </div>
          </div>

          {/* Internal Investigator Notes */}
          <div className="p-4 bg-[#0d121c] border border-slate-800 rounded space-y-1.5 text-[10px]">
            <span className="text-amber-400 font-bold block flex items-center gap-1.5">
              <Archive className="w-3.5 h-3.5 text-amber-400" />
              GPC INTERNAL INVESTIGATIVE LOG:
            </span>
            <p className="text-slate-300 leading-normal">{deadLink.investigatorNotes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
