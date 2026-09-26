import { Compass, Quote } from 'lucide-react';
import { COMPANY_VALUES } from '@/content';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';

export default function CompanyValuesPage() {
  return (
    <ArchivePage className="space-y-6">
      <ViewHeader
        icon={Compass}
        title="THE FIVE PILLARS OF PRE-EMPTIVE CERTAINTY"
        subtitle="Core Operating Doctrine & Philosophical Foundations of Global Paradigms Corporation (1971-2026)"
      />

      {/* 5 Pillars Cards */}
      <div className="max-w-4xl mx-auto space-y-6">
        {COMPANY_VALUES.map((pillar) => (
          <article
            key={pillar.number}
            className="p-6 bg-panel border border-line-strong rounded-lg shadow-xl space-y-4 relative overflow-hidden"
          >
            {/* Roman Numeral Backdrop */}
            <div
              aria-hidden
              className="absolute top-2 right-4 text-6xl font-black text-slate-800/40 pointer-events-none select-none"
            >
              {pillar.number}
            </div>

            <div className="space-y-1">
              <span className="text-caption text-cyan-400 font-bold uppercase tracking-widest block">
                PILLAR {pillar.number} // DOCTRINAL PRINCIPLE
              </span>
              <h2 className="text-base md:text-lg font-bold text-white">{pillar.title}</h2>
              <p className="text-xs text-emerald-400 font-bold italic">{pillar.subtitle}</p>
            </div>

            <p className="text-label text-slate-300 leading-relaxed font-serif whitespace-pre-line bg-inset p-4 rounded border border-line">
              {pillar.doctrine}
            </p>

            <div className="p-3 bg-raised border-l-2 border-cyan-500 rounded text-caption text-slate-300 space-y-1">
              <span className="font-bold text-cyan-300 block uppercase">
                OPERATIONAL APPLICATION & INFRASTRUCTURE:
              </span>
              <p>{pillar.practicalApplication}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 text-caption text-slate-400 italic flex items-center gap-2">
              <Quote className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{pillar.executiveQuote}</span>
            </div>
          </article>
        ))}
      </div>
    </ArchivePage>
  );
}
