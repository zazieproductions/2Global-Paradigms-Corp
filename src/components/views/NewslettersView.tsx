import React, { useState } from 'react';
import { Newspaper, Calendar, AlertTriangle, Coffee, ShieldAlert, Award, ChevronRight } from 'lucide-react';
import { Newsletter } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface NewslettersViewProps {
  newsletters: Newsletter[];
}

export const NewslettersView: React.FC<NewslettersViewProps> = ({ newsletters }) => {
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter>(newsletters[0]);

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-cyan-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              INTERNAL STAFF NEWSLETTERS & BULLETINS
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            6 Official Corporate Publications // Employee Spotlights & Safety Bulletins
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] overflow-x-auto">
          {newsletters.map((nl) => (
            <button
              key={nl.id}
              onClick={() => {
                gpcAudio.playUiSound('click');
                setSelectedNewsletter(nl);
              }}
              className={`px-3 py-1.5 rounded transition-all font-bold cursor-pointer whitespace-nowrap ${
                selectedNewsletter.id === nl.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-[#0d131f] text-slate-400 hover:text-slate-200 border border-[#1f2c42]'
              }`}
            >
              {nl.issueNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Newsletter Newspaper Layout */}
      {selectedNewsletter && (
        <div className="max-w-4xl mx-auto bg-[#0a0e18] border border-[#1b263b] rounded-lg p-6 md:p-8 space-y-6 shadow-2xl">
          {/* Newspaper Masthead */}
          <div className="border-b-4 border-double border-slate-600 pb-4 text-center space-y-1">
            <span className="text-[9px] tracking-widest text-slate-400 uppercase font-bold block">
              {selectedNewsletter.volumeName}
            </span>
            <h2 className="text-lg md:text-2xl font-bold text-white tracking-widest uppercase">
              {selectedNewsletter.title.split(' // ')[0]}
            </h2>
            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800">
              <span>ISSUE: {selectedNewsletter.issueNumber}</span>
              <span>PUBLICATION DATE: {selectedNewsletter.publicationDate}</span>
              <span>FOR INTERNAL CIRCULATION ONLY</span>
            </div>
          </div>

          {/* Lead Article */}
          <div className="p-5 bg-[#070b13] border border-[#182335] rounded-lg space-y-2">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              FEATURE LEAD STORY:
            </span>
            <h3 className="text-sm md:text-base font-bold text-white leading-snug">
              {selectedNewsletter.leadArticle.headline}
            </h3>
            <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line font-serif">
              {selectedNewsletter.leadArticle.content}
            </p>
          </div>

          {/* Secondary Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedNewsletter.secondaryArticles.map((art, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#080c14] border border-[#1a2336] rounded space-y-2"
              >
                <h4 className="text-xs font-bold text-cyan-300">{art.headline}</h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-serif">
                  {art.content}
                </p>
              </div>
            ))}
          </div>

          {/* Employee Spotlight & Cafeteria Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#182335] pt-4">
            {/* Employee Spotlight */}
            <div className="p-4 bg-[#070b13] border-l-2 border-emerald-500 rounded space-y-2">
              <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                EMPLOYEE OF THE MONTH SPOTLIGHT:
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">{selectedNewsletter.employeeSpotlight.name}</h4>
                <p className="text-[10px] text-slate-400">{selectedNewsletter.employeeSpotlight.role}</p>
              </div>
              <p className="text-[11px] text-slate-300 italic font-serif">
                {selectedNewsletter.employeeSpotlight.quote}
              </p>
            </div>

            {/* Cafeteria Specials */}
            <div className="p-4 bg-[#070b13] border-l-2 border-amber-500 rounded space-y-2">
              <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5" />
                STAFF CAFETERIA HIGHLIGHTS:
              </span>
              <p className="text-[11px] text-slate-300 leading-normal font-serif">
                {selectedNewsletter.cafeteriaSpecial}
              </p>
            </div>
          </div>

          {/* Cryptic Safety Notice */}
          <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-600 rounded text-[10px] text-rose-200 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-rose-400 uppercase">
              <ShieldAlert className="w-3.5 h-3.5" />
              MANDATORY FACILITY SAFETY NOTICE:
            </span>
            <p className="font-mono">{selectedNewsletter.safetyNotice}</p>
          </div>
        </div>
      )}
    </div>
  );
};
