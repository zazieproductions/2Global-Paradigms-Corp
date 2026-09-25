import React, { useState } from 'react';
import { Link2Off, Globe, History, AlertTriangle, ExternalLink, ShieldAlert, Archive } from 'lucide-react';
import { DeadLink } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface DeadLinksViewProps {
  deadLinks: DeadLink[];
  onOpenDeadLinkModal: (link: DeadLink) => void;
}

export const DeadLinksView: React.FC<DeadLinksViewProps> = ({ deadLinks, onOpenDeadLinkModal }) => {
  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link2Off className="w-5 h-5 text-rose-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              DEAD EXTERNAL LINKS & SEIZED MIRROR ARCHIVES
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            6 Purged External Forums, Seized Whistleblower Mirrors & 1998 Wayback Snapshots
          </p>
        </div>

        <span className="text-[11px] px-2.5 py-1 bg-rose-950/40 border border-rose-600/60 rounded text-rose-300 font-bold self-start md:self-auto">
          6 PURGED DESTINATIONS
        </span>
      </div>

      {/* Grid of Dead Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deadLinks.map((link) => (
          <div
            key={link.id}
            onClick={() => {
              gpcAudio.playUiSound('click');
              onOpenDeadLinkModal(link);
            }}
            className="p-5 bg-[#0a0e18] hover:bg-[#0e1627] border border-[#1b263b] hover:border-rose-500/50 rounded-lg shadow-lg flex flex-col justify-between space-y-4 group cursor-pointer transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#182335] pb-2">
                <span className="font-bold text-rose-400 text-xs font-mono">{link.errorType}</span>
                <span className="text-[10px] text-slate-500">{link.archiveDate.split(': ')[1]?.slice(0, 10) || ''}</span>
              </div>

              <div className="flex items-center gap-2 text-cyan-300">
                <Globe className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-bold truncate group-hover:text-rose-300 transition-colors">
                  {link.url}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-200 leading-snug">
                {link.originalTitle}
              </h3>

              <div className="p-3 bg-[#070b13] border-l-2 border-rose-500 rounded text-[10px] text-slate-300 italic font-serif leading-relaxed line-clamp-3">
                {link.cachedSnippet}
              </div>
            </div>

            <div className="pt-2 border-t border-[#151f30] flex items-center justify-between text-[10px] text-slate-400">
              <span>HOST: {link.originalHost}</span>
              <span className="text-rose-400 font-bold group-hover:underline flex items-center gap-1">
                <span>INSPECT CACHE</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
