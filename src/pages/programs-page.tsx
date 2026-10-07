import { useState } from 'react';
import { FolderLock, ShieldAlert } from 'lucide-react';
import type { InternalProgram } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { INTERNAL_PROGRAMS } from '@/content';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { pickRecord, useRecordParam } from '@/hooks/use-record-param';

const programs = INTERNAL_PROGRAMS;

export default function ProgramsPage() {
  const recordId = useRecordParam();
  const [selectedProgram, setSelectedProgram] = useState<InternalProgram | null>(() =>
    pickRecord(programs, recordId, programs[0])
  );
  const [threatFilter, setThreatFilter] = useState<string>('all');

  const filteredPrograms = programs.filter((pr) => {
    if (threatFilter === 'all') return true;
    return pr.threatLevel === threatFilter;
  });

  const getThreatBadge = (level: InternalProgram['threatLevel']) => {
    switch (level) {
      case 'Existential':
        return 'bg-rose-950 text-rose-300 border-rose-600 font-bold';
      case 'Critical':
        return 'bg-red-950 text-red-300 border-red-600 font-bold';
      case 'High':
        return 'bg-amber-950 text-amber-300 border-amber-600';
      case 'Moderate':
        return 'bg-cyan-950 text-cyan-300 border-cyan-600';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  return (
    <ArchivePage>
      <ViewHeader
        icon={FolderLock}
        iconClassName="text-rose-400"
        title="INTERNAL PROGRAM DOSSIERS & BLACK BUDGET PROJECTS"
        subtitle={`${programs.length} Active & Covert Global Strategic Operations // Executive Governance`}
        aside={
          <div
            className="flex flex-wrap items-center gap-1.5 text-caption"
            role="group"
            aria-label="Filter by threat level"
          >
            {['all', 'Existential', 'Critical', 'High', 'Moderate'].map((threat) => (
              <button
                type="button"
                key={threat}
                aria-pressed={threatFilter === threat}
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  setThreatFilter(threat);
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  threatFilter === threat
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-600 font-bold'
                    : 'bg-raised text-slate-400 hover:text-slate-200 border border-line-strong'
                }`}
              >
                {threat === 'all' ? 'All Threat Levels' : threat}
              </button>
            ))}
          </div>
        }
      />

      {/* Main Grid: Program Detail + List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Program Details */}
        <div className="lg:col-span-2 space-y-4">
          {selectedProgram && (
            <div className="p-5 bg-panel border border-rose-500/40 rounded-lg shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line-strong pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-rose-400 text-sm font-mono">{selectedProgram.code}</span>
                    <span
                      className={`text-micro px-2 py-0.5 rounded border ${getThreatBadge(selectedProgram.threatLevel)}`}
                    >
                      THREAT: {selectedProgram.threatLevel.toUpperCase()}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedProgram.name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-caption text-slate-500 block">START YEAR:</span>
                  <span className="text-slate-300 font-bold">{selectedProgram.startYear}</span>
                </div>
              </div>

              {/* Program Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-inset border border-line p-3 rounded text-caption">
                <div>
                  <span className="text-slate-500 block">DIRECTOR:</span>
                  <span className="text-slate-200 truncate block">{selectedProgram.director}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ANNUAL BUDGET:</span>
                  <span className="text-emerald-400 font-bold">{selectedProgram.budgetAnnual}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">STATUS:</span>
                  <span className="text-cyan-300 font-bold">{selectedProgram.status.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CLEARANCE:</span>
                  <span className="text-amber-400 font-bold">
                    {selectedProgram.clearance.split(' - ')[0]}
                  </span>
                </div>
              </div>

              {/* Public Cover Story vs Classified Reality */}
              <div className="space-y-3">
                <div className="p-3.5 bg-inset border-l-2 border-slate-600 rounded space-y-1">
                  <span className="text-caption text-slate-400 font-bold block uppercase">
                    PUBLIC COVER STORY / REGULATORY FILING:
                  </span>
                  <p className="text-label text-slate-300 leading-relaxed">
                    {selectedProgram.publicCoverStory}
                  </p>
                </div>

                <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-500 rounded space-y-1">
                  <span className="text-caption text-rose-400 font-bold block uppercase flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                    CLASSIFIED OPERATIONAL REALITY (LEVEL 4+ EYES ONLY):
                  </span>
                  <p className="text-label text-rose-200 leading-relaxed font-mono">
                    {selectedProgram.classifiedReality}
                  </p>
                </div>
              </div>

              {/* Objective */}
              <div className="space-y-1">
                <span className="text-caption text-slate-400 font-bold block">STRATEGIC OBJECTIVE:</span>
                <p className="text-label text-slate-300 bg-inset p-3 rounded border border-line leading-relaxed">
                  {selectedProgram.objective}
                </p>
              </div>

              {/* Historical Milestones */}
              <div className="space-y-2 border-t border-line pt-3">
                <span className="text-caption text-amber-400 font-bold block">
                  PROGRAM MILESTONES & DISCLOSURES:
                </span>
                <div className="space-y-1.5">
                  {selectedProgram.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2 bg-shell border border-line rounded text-caption"
                    >
                      <span className="font-bold text-cyan-400 shrink-0 font-mono">{m.year}:</span>
                      <span className="text-slate-300 leading-normal">{m.event}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Program List */}
        <div className="space-y-2">
          <div className="p-2.5 bg-panel border border-line-strong rounded-lg font-bold text-xs text-white">
            PROJECT DOSSIERS ({filteredPrograms.length})
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {filteredPrograms.map((pr) => {
              const isSelected = selectedProgram?.id === pr.id;
              return (
                <button
                  type="button"
                  key={pr.id}
                  aria-pressed={isSelected}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setSelectedProgram(pr);
                  }}
                  className={`w-full text-left p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-400 text-white shadow-glow shadow-rose-500/20'
                      : 'bg-panel hover:bg-hover border-line-strong text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block space-y-0.5 min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="font-bold text-rose-300 text-label font-mono">{pr.code}</span>
                      <span className="text-micro text-slate-500 truncate">{pr.startYear}</span>
                    </span>
                    <span className="block font-bold text-xs truncate text-slate-200">{pr.name}</span>
                    <span className="block text-caption text-slate-500 truncate">{pr.budgetAnnual} / yr</span>
                  </span>

                  <span
                    className={`text-nano px-1.5 py-px rounded border shrink-0 ${getThreatBadge(pr.threatLevel)}`}
                  >
                    {pr.threatLevel.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ArchivePage>
  );
}
