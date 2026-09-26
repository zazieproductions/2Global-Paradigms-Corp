import { useState } from 'react';
import { BarChart3, ShieldAlert } from 'lucide-react';
import type { AnnualReport } from '@/types';
import { ANNUAL_REPORTS } from '@/content';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { pickRecord, useRecordParam } from '@/hooks/use-record-param';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { cn } from '@/lib/utils/cn';

const reports = ANNUAL_REPORTS;

export default function AnnualReportsPage() {
  const recordId = useRecordParam();
  // Default: most recent report.
  const [selectedReport, setSelectedReport] = useState<AnnualReport>(() =>
    pickRecord(reports, recordId, reports[reports.length - 1])
  );

  return (
    <ArchivePage>
      <ViewHeader
        icon={BarChart3}
        iconClassName="text-emerald-400"
        title="ANNUAL STRATEGIC REPORTS & CONTINUITY AUDITS"
        subtitle="Historical Sovereign Disclosures, Fiscal Headlines & Scrubbed Archival Footnotes (1986-2025)"
        aside={
          <div
            className="flex items-center gap-1.5 text-caption overflow-x-auto max-w-full"
            role="group"
            aria-label="Report year"
          >
            {reports.map((rep) => (
              <button
                type="button"
                key={rep.id}
                aria-pressed={selectedReport.id === rep.id}
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  setSelectedReport(rep);
                }}
                className={cn(
                  'px-3 py-1.5 rounded transition-all font-bold cursor-pointer whitespace-nowrap border',
                  selectedReport.id === rep.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-glow-sm shadow-emerald-500/20'
                    : 'bg-raised text-slate-400 hover:text-slate-200 border-line-strong'
                )}
              >
                {rep.year} REPORT
              </button>
            ))}
          </div>
        }
      />

      {/* Selected Report Dossier */}
      {selectedReport && (
        <article className="max-w-4xl mx-auto bg-panel border border-line-strong rounded-lg p-6 md:p-8 space-y-6 shadow-2xl">
          {/* Top Headline Banner */}
          <div className="border-b-2 border-slate-700 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-caption text-cyan-400 font-bold uppercase tracking-widest">
                GLOBAL PARADIGMS CORP. // INTEGRATED ANNUAL DISCLOSURE
              </span>
              <h2 className="text-base md:text-xl font-bold text-white mt-1">{selectedReport.title}</h2>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-emerald-400 font-mono block">
                {selectedReport.revenue}
              </span>
              <span className="text-caption text-slate-400">CONSOLIDATED REVENUE</span>
            </div>
          </div>

          {/* Fiscal Headline & Stability Index */}
          <div className="p-3.5 bg-raised border border-line-strong rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-300 font-bold">{selectedReport.fiscalHeadline}</span>
            <span className="text-amber-400 font-bold font-mono px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800 shrink-0">
              {selectedReport.civicContinuityIndex}
            </span>
          </div>

          {/* Executive Letter to Sovereign Clients */}
          <div className="space-y-2">
            <span className="text-caption text-slate-400 font-bold block uppercase">
              EXECUTIVE ADDRESS TO SOVEREIGN CLIENTS & SHAREHOLDERS:
            </span>
            <div className="p-4 bg-inset border border-line rounded text-slate-300 text-label leading-relaxed whitespace-pre-line font-serif">
              {selectedReport.executiveLetter}
            </div>
          </div>

          {/* Key Strategic Initiatives */}
          <div className="space-y-2">
            <span className="text-caption text-cyan-400 font-bold block uppercase">
              KEY STRATEGIC CONTINUITY INITIATIVES:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedReport.keyInitiatives.map((init, idx) => (
                <div
                  key={init}
                  className="p-3 bg-shell border border-line rounded text-caption text-slate-200 leading-normal"
                >
                  <span className="text-cyan-400 font-bold block mb-1">INITIATIVE 0{idx + 1}:</span>
                  {init}
                </div>
              ))}
            </div>
          </div>

          {/* Demographic Metrics Table */}
          <div className="space-y-2">
            <span className="text-caption text-emerald-400 font-bold block uppercase">
              DEMOGRAPHIC RESILIENCE & COMPLIANCE METRICS:
            </span>
            <div className="border border-line rounded overflow-hidden overflow-x-auto overscroll-x-contain">
              <table className="w-full min-w-[30rem] text-left text-label">
                <caption className="sr-only">Demographic metrics for {selectedReport.year}</caption>
                <thead className="bg-hover text-slate-400 border-b border-line">
                  <tr>
                    <th scope="col" className="p-2.5">
                      MEASURED DEMOGRAPHIC METRIC
                    </th>
                    <th scope="col" className="p-2.5">
                      RECORDED VALUE
                    </th>
                    <th scope="col" className="p-2.5">
                      STATISTICAL VARIANCE
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-subtle">
                  {selectedReport.demographicMetrics.map((m) => (
                    <tr key={m.metric} className="hover:bg-raised">
                      <td className="p-2.5 text-slate-200 font-bold">{m.metric}</td>
                      <td className="p-2.5 text-emerald-300 font-mono">{m.value}</td>
                      <td className="p-2.5 text-slate-400">{m.variance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scrubbed Footnote (Project Palimpsest Redaction) */}
          <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-600 rounded text-caption text-rose-200 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden />
              CLASSIFIED AIRS AUDIT FOOTNOTE:
            </span>
            <p className="font-mono">{selectedReport.scrubbedFootnote}</p>
          </div>
        </article>
      )}
    </ArchivePage>
  );
}
