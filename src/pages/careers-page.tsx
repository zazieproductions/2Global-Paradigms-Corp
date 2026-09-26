import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import type { JobPosting } from '@/types';
import { JOB_POSTINGS } from '@/content';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useArchiveUi } from '@/app/archive-ui-context';
import { pickRecord, useRecordParam } from '@/hooks/use-record-param';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';

const jobPostings = JOB_POSTINGS;

export default function CareersPage() {
  const { openDialog } = useArchiveUi();
  const recordId = useRecordParam();
  const [selectedJob, setSelectedJob] = useState<JobPosting>(() =>
    pickRecord(jobPostings, recordId, jobPostings[0])
  );

  return (
    <ArchivePage>
      <ViewHeader
        icon={Briefcase}
        iconClassName="text-emerald-400"
        title="CLASSIFIED RECRUITMENT & HUMAN CAPITAL OPPORTUNITIES"
        subtitle={`${jobPostings.length} Open Requisitions Across Global Subterranean & Infrasonic Facilities`}
        aside={
          <span className="text-label px-2.5 py-1 bg-emerald-950/40 border border-emerald-600/60 rounded text-emerald-300 font-bold self-start md:self-auto">
            ACTIVE REQUISITIONS: {jobPostings.length}
          </span>
        }
      />

      {/* Main Grid: Selected Job Detail + Job List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Selected Job Dossier */}
        <div className="lg:col-span-2 space-y-4">
          {selectedJob && (
            <div className="p-5 bg-panel border border-emerald-500/40 rounded-lg shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line-strong pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 text-xs font-mono">
                      {selectedJob.requisitionId}
                    </span>
                    <span className="text-micro px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-bold">
                      {selectedJob.clearanceRequired.split(' - ')[0]}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedJob.title}</h2>
                </div>

                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    openDialog({ type: 'job', job: selectedJob });
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded cursor-pointer transition-colors shadow-md text-xs self-start sm:self-auto"
                >
                  APPLY FOR POSITION
                </button>
              </div>

              {/* Job Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-inset border border-line p-3 rounded text-caption">
                <div>
                  <span className="text-slate-500 block">DEPARTMENT:</span>
                  <span className="text-slate-200 truncate block">{selectedJob.department}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">PRIMARY LOCATION:</span>
                  <span className="text-purple-300 truncate block">{selectedJob.location}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">COMPENSATION BAND:</span>
                  <span className="text-emerald-400 font-bold truncate block">{selectedJob.salaryRange}</span>
                </div>
              </div>

              {/* Role Overview */}
              <div className="space-y-1">
                <span className="text-caption text-slate-400 font-bold block uppercase">
                  POSITION SUMMARY:
                </span>
                <p className="text-label text-slate-300 leading-relaxed bg-inset p-3 rounded border border-line">
                  {selectedJob.overview}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-1.5">
                <span className="text-caption text-cyan-400 font-bold block uppercase">
                  KEY OPERATIONAL RESPONSIBILITIES:
                </span>
                <div className="space-y-1">
                  {selectedJob.responsibilities.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-label text-slate-300">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-1.5">
                <span className="text-caption text-amber-400 font-bold block uppercase">
                  TECHNICAL QUALIFICATIONS:
                </span>
                <div className="space-y-1">
                  {selectedJob.qualifications.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-label text-slate-300">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Psychological Requirements */}
              <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-600 rounded space-y-1 text-caption">
                <span className="font-bold text-rose-400 block uppercase">
                  MANDATORY PSYCHOLOGICAL & RESILIENCE VETTING:
                </span>
                <div className="space-y-1">
                  {selectedJob.psychologicalRequirements.map((p, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-rose-200 font-mono">
                      <span>•</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Job Openings List */}
        <div className="space-y-2">
          <div className="p-2.5 bg-panel border border-line-strong rounded-lg font-bold text-xs text-white">
            OPEN REQUISITIONS ({jobPostings.length})
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {jobPostings.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <button
                  type="button"
                  key={job.id}
                  aria-pressed={isSelected}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setSelectedJob(job);
                  }}
                  className={`w-full text-left p-3 rounded-lg border cursor-pointer transition-all space-y-1 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-400 text-white shadow-glow-sm shadow-emerald-500/20'
                      : 'bg-panel hover:bg-hover border-line-strong text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-caption font-mono">
                      {job.requisitionId}
                    </span>
                    <span className="text-micro text-slate-500">{job.postingDate}</span>
                  </span>
                  <span className="block font-bold text-xs text-slate-200 truncate">{job.title}</span>
                  <span className="block text-caption text-slate-500 truncate">{job.location}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ArchivePage>
  );
}
