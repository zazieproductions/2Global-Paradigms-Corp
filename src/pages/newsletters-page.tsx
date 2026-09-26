import { useState } from 'react';
import { Newspaper, Coffee, ShieldAlert, Award } from 'lucide-react';
import type { Newsletter } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { NEWSLETTERS } from '@/content';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { pickRecord, useRecordParam } from '@/hooks/use-record-param';

const newsletters = NEWSLETTERS;

export default function NewslettersPage() {
  const recordId = useRecordParam();
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter>(() =>
    pickRecord(newsletters, recordId, newsletters[0])
  );

  return (
    <ArchivePage>
      <ViewHeader
        icon={Newspaper}
        iconClassName="text-cyan-400"
        title="INTERNAL STAFF NEWSLETTERS & BULLETINS"
        subtitle={`${newsletters.length} Official Corporate Publications // Employee Spotlights & Safety Bulletins`}
        aside={
          <div
            className="flex items-center gap-1.5 text-caption overflow-x-auto"
            role="group"
            aria-label="Newsletter issue"
          >
            {newsletters.map((nl) => (
              <button
                type="button"
                key={nl.id}
                aria-pressed={selectedNewsletter.id === nl.id}
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  setSelectedNewsletter(nl);
                }}
                className={`px-3 py-1.5 rounded transition-all font-bold cursor-pointer whitespace-nowrap ${
                  selectedNewsletter.id === nl.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-glow-sm shadow-signal/20'
                    : 'bg-raised text-slate-400 hover:text-slate-200 border border-line-strong'
                }`}
              >
                {nl.issueNumber}
              </button>
            ))}
          </div>
        }
      />

      {/* Selected Newsletter Newspaper Layout */}
      {selectedNewsletter && (
        <div className="max-w-4xl mx-auto bg-panel border border-line-strong rounded-lg p-6 md:p-8 space-y-6 shadow-2xl">
          {/* Newspaper Masthead */}
          <div className="border-b-4 border-double border-slate-600 pb-4 text-center space-y-1">
            <span className="text-micro tracking-widest text-slate-400 uppercase font-bold block">
              {selectedNewsletter.volumeName}
            </span>
            <h2 className="text-lg md:text-2xl font-bold text-white tracking-widest uppercase">
              {selectedNewsletter.title.split(' // ')[0]}
            </h2>
            <div className="flex items-center justify-between text-caption text-slate-500 pt-2 border-t border-slate-800">
              <span>ISSUE: {selectedNewsletter.issueNumber}</span>
              <span>PUBLICATION DATE: {selectedNewsletter.publicationDate}</span>
              <span>FOR INTERNAL CIRCULATION ONLY</span>
            </div>
          </div>

          {/* Lead Article */}
          <div className="p-5 bg-inset border border-line rounded-lg space-y-2">
            <span className="text-caption text-cyan-400 font-bold uppercase tracking-wider block">
              FEATURE LEAD STORY:
            </span>
            <h3 className="text-sm md:text-base font-bold text-white leading-snug">
              {selectedNewsletter.leadArticle.headline}
            </h3>
            <p className="text-label text-slate-300 leading-relaxed whitespace-pre-line font-serif">
              {selectedNewsletter.leadArticle.content}
            </p>
          </div>

          {/* Secondary Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedNewsletter.secondaryArticles.map((art, idx) => (
              <div key={idx} className="p-4 bg-shell border border-line rounded space-y-2">
                <h4 className="text-xs font-bold text-cyan-300">{art.headline}</h4>
                <p className="text-caption text-slate-400 leading-relaxed font-serif">{art.content}</p>
              </div>
            ))}
          </div>

          {/* Employee Spotlight & Cafeteria Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-line pt-4">
            {/* Employee Spotlight */}
            <div className="p-4 bg-inset border-l-2 border-emerald-500 rounded space-y-2">
              <span className="text-caption text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                EMPLOYEE OF THE MONTH SPOTLIGHT:
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">{selectedNewsletter.employeeSpotlight.name}</h4>
                <p className="text-caption text-slate-400">{selectedNewsletter.employeeSpotlight.role}</p>
              </div>
              <p className="text-label text-slate-300 italic font-serif">
                {selectedNewsletter.employeeSpotlight.quote}
              </p>
            </div>

            {/* Cafeteria Specials */}
            <div className="p-4 bg-inset border-l-2 border-amber-500 rounded space-y-2">
              <span className="text-caption text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5" />
                STAFF CAFETERIA HIGHLIGHTS:
              </span>
              <p className="text-label text-slate-300 leading-normal font-serif">
                {selectedNewsletter.cafeteriaSpecial}
              </p>
            </div>
          </div>

          {/* Cryptic Safety Notice */}
          <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-600 rounded text-caption text-rose-200 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-rose-400 uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              MANDATORY FACILITY SAFETY NOTICE:
            </span>
            <p className="font-mono">{selectedNewsletter.safetyNotice}</p>
          </div>
        </div>
      )}
    </ArchivePage>
  );
}
