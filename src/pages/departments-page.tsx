import { useState } from 'react';
import { Building2, ShieldAlert } from 'lucide-react';
import type { Department } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { DEPARTMENTS } from '@/content';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { pickRecord, useRecordParam } from '@/hooks/use-record-param';

const departments = DEPARTMENTS;

export default function DepartmentsPage() {
  const recordId = useRecordParam();
  const [selectedDept, setSelectedDept] = useState<Department | null>(() =>
    pickRecord(departments, recordId, departments[0])
  );

  return (
    <ArchivePage>
      <ViewHeader
        icon={Building2}
        iconClassName="text-purple-400"
        title="CORPORATE DIRECTORATES & ORGANIZATIONAL CHARTERS"
        subtitle={`${departments.length} Primary Administrative, Scientific & Obfuscation Divisions`}
        aside={
          <span className="text-label px-2.5 py-1 bg-raised border border-line-strong rounded text-slate-300 font-bold self-start md:self-auto">
            10 GLOBAL DIRECTORATES
          </span>
        }
      />

      {/* Main Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Selected Department Detail */}
        <div className="lg:col-span-2 space-y-4">
          {selectedDept && (
            <div className="p-5 bg-panel border border-purple-500/40 rounded-lg shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line-strong pb-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-purple-400 text-sm font-mono tracking-wider">
                    {selectedDept.code} DIRECTORATE
                  </span>
                  <h2 className="text-base font-bold text-white">{selectedDept.name}</h2>
                </div>

                <div className="text-right">
                  <span className="text-caption text-slate-500 block">HEADQUARTERS:</span>
                  <span className="text-slate-300 font-bold">{selectedDept.headquarters}</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-inset border border-line p-3 rounded text-caption">
                <div>
                  <span className="text-slate-500 block">DIRECTOR:</span>
                  <span className="text-slate-200 font-bold truncate block">{selectedDept.director}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">DEPUTY DIRECTOR:</span>
                  <span className="text-slate-300 truncate block">{selectedDept.deputyDirector}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">HEADCOUNT:</span>
                  <span className="text-cyan-300 font-bold">{selectedDept.headcount} Staff</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ANNUAL BUDGET:</span>
                  <span className="text-emerald-400 font-bold">{selectedDept.annualBudget}</span>
                </div>
              </div>

              {/* Public Mandate */}
              <div className="space-y-1">
                <span className="text-caption text-slate-400 font-bold block uppercase">
                  PUBLIC CORPORATE MANDATE:
                </span>
                <p className="text-label text-slate-300 bg-inset p-3.5 rounded border border-line leading-relaxed">
                  {selectedDept.mandate}
                </p>
              </div>

              {/* Classified Charter */}
              <div className="space-y-1">
                <span className="text-caption text-rose-400 font-bold block uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  CLASSIFIED OPERATIONAL DIRECTIVE (LEVEL 4+):
                </span>
                <p className="text-label text-rose-200 bg-rose-950/20 p-3.5 rounded border border-rose-600/40 font-mono leading-relaxed">
                  {selectedDept.classifiedCharter}
                </p>
              </div>

              {/* Sub-Divisions */}
              <div className="space-y-2 border-t border-line pt-3">
                <span className="text-caption text-purple-300 font-bold block">
                  SUBORDINATE BRANCHES & SPECIALIST UNITS:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDept.subDivisions.map((sub, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-shell border border-line rounded text-label text-slate-200 font-bold flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Department List */}
        <div className="space-y-2">
          <div className="p-2.5 bg-panel border border-line-strong rounded-lg font-bold text-xs text-white">
            CORPORATE DIVISIONS ({departments.length})
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {departments.map((dept) => {
              const isSelected = selectedDept?.id === dept.id;
              return (
                <button
                  type="button"
                  key={dept.id}
                  aria-pressed={isSelected}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setSelectedDept(dept);
                  }}
                  className={`w-full text-left p-3 rounded-lg border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-400 text-white shadow-glow shadow-purple-500/20'
                      : 'bg-panel hover:bg-hover border-line-strong text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block space-y-0.5 min-w-0">
                    <span className="font-bold text-purple-300 text-label font-mono">{dept.code}</span>
                    <span className="block font-bold text-xs truncate text-slate-200">{dept.name}</span>
                    <span className="block text-caption text-slate-500 truncate">{dept.director}</span>
                  </span>

                  <span className="text-micro px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                    {dept.headcount}
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
