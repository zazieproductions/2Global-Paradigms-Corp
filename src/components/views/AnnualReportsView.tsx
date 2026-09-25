import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calendar, FileText, Download, ShieldAlert, Award } from 'lucide-react';
import { AnnualReport } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface AnnualReportsViewProps {
  reports: AnnualReport[];
}

export const AnnualReportsView: React.FC<AnnualReportsViewProps> = ({ reports }) => {
  const [selectedReport, setSelectedReport] = useState<AnnualReport>(reports[reports.length - 1]); // Default 2025

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              ANNUAL STRATEGIC REPORTS & CONTINUITY AUDITS
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Historical Sovereign Disclosures, Fiscal Headlines & Scrubbed Archival Footnotes (1986-2025)
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] overflow-x-auto">
          {reports.map((rep) => (
            <button
              key={rep.year}
              onClick={() => {
                gpcAudio.playUiSound('click');
                setSelectedReport(rep);
              }}
              className={`px-3 py-1.5 rounded transition-all font-bold cursor-pointer whitespace-nowrap ${
                selectedReport.year === rep.year
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-[#0d131f] text-slate-400 hover:text-slate-200 border border-[#1f2c42]'
              }`}
            >
              {rep.year} REPORT
            </button>
          ))}
        </div>
      </div>

      {/* Selected Report Dossier */}
      {selectedReport && (
        <div className="max-w-4xl mx-auto bg-[#0a0e18] border border-[#1b263b] rounded-lg p-6 md:p-8 space-y-6 shadow-2xl">
          {/* Top Headline Banner */}
          <div className="border-b-2 border-slate-700 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                GLOBAL PARADIGMS CORP. // INTEGRATED ANNUAL DISCLOSURE
              </span>
              <h2 className="text-base md:text-xl font-bold text-white mt-1">
                {selectedReport.title}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-emerald-400 font-mono block">
                {selectedReport.revenue}
              </span>
              <span className="text-[10px] text-slate-400">CONSOLIDATED REVENUE</span>
            </div>
          </div>

          {/* Fiscal Headline & Stability Index */}
          <div className="p-3.5 bg-[#0d131f] border border-[#1b273d] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-300 font-bold">{selectedReport.fiscalHeadline}</span>
            <span className="text-amber-400 font-bold font-mono px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800 shrink-0">
              {selectedReport.civicContinuityIndex}
            </span>
          </div>

          {/* Executive Letter to Sovereign Clients */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">
              EXECUTIVE ADDRESS TO SOVEREIGN CLIENTS & SHAREHOLDERS:
            </span>
            <div className="p-4 bg-[#070b13] border border-[#182335] rounded text-slate-300 text-[11px] leading-relaxed whitespace-pre-line font-serif">
              {selectedReport.executiveLetter}
            </div>
          </div>

          {/* Key Strategic Initiatives */}
          <div className="space-y-2">
            <span className="text-[10px] text-cyan-400 font-bold block uppercase">
              KEY STRATEGIC CONTINUITY INITIATIVES:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {selectedReport.keyInitiatives.map((init, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[#080c14] border border-[#1a2336] rounded text-[10px] text-slate-200 leading-normal"
                >
                  <span className="text-cyan-400 font-bold block mb-1">INITIATIVE 0{idx + 1}:</span>
                  {init}
                </div>
              ))}
            </div>
          </div>

          {/* Demographic Metrics Table */}
          <div className="space-y-2">
            <span className="text-[10px] text-emerald-400 font-bold block uppercase">
              DEMOGRAPHIC RESILIENCE & COMPLIANCE METRICS:
            </span>
            <div className="border border-[#182335] rounded overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-[#0e1422] text-slate-400 border-b border-[#182335]">
                  <tr>
                    <th className="p-2.5">MEASURED DEMOGRAPHIC METRIC</th>
                    <th className="p-2.5">RECORDED VALUE</th>
                    <th className="p-2.5">STATISTICAL VARIANCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151f30]">
                  {selectedReport.demographicMetrics.map((m, idx) => (
                    <tr key={idx} className="hover:bg-[#0c111e]">
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
          <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-600 rounded text-[10px] text-rose-200 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-rose-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              CLASSIFIED AIRS AUDIT FOOTNOTE:
            </span>
            <p className="font-mono">{selectedReport.scrubbedFootnote}</p>
          </div>
        </div>
      )}
    </div>
  );
};
