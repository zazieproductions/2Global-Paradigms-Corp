import React, { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { JobPosting } from '../../types';
import { gpcAudio } from '../../lib/audioEngine';

interface CareersViewProps {
  jobPostings: JobPosting[];
  onOpenApplyModal: (job: JobPosting) => void;
}

export const CareersView: React.FC<CareersViewProps> = ({ jobPostings, onOpenApplyModal }) => {
  const [selectedJob, setSelectedJob] = useState<JobPosting>(jobPostings[0]);

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-4 font-mono text-xs text-slate-200 bg-[#06080e] scrollbar-thin">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#182335] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base md:text-lg font-bold text-white tracking-wider">
              CLASSIFIED RECRUITMENT & HUMAN CAPITAL OPPORTUNITIES
            </h1>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            12 Open Requisitions Across Global Subterranean & Infrasonic Facilities
          </p>
        </div>

        <span className="text-[11px] px-2.5 py-1 bg-emerald-950/40 border border-emerald-600/60 rounded text-emerald-300 font-bold self-start md:self-auto">
          ACTIVE REQUISITIONS: 12
        </span>
      </div>

      {/* Main Grid: Selected Job Detail + Job List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Selected Job Dossier */}
        <div className="lg:col-span-2 space-y-4">
          {selectedJob && (
            <div className="p-5 bg-[#0a0e18] border border-emerald-500/40 rounded-lg shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c273c] pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 text-xs font-mono">{selectedJob.requisitionId}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700 font-bold">
                      {selectedJob.clearanceRequired.split(' - ')[0]}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white">{selectedJob.title}</h2>
                </div>

                <button
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    onOpenApplyModal(selectedJob);
                  }}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded cursor-pointer transition-colors shadow-md text-xs self-start sm:self-auto"
                >
                  APPLY FOR POSITION
                </button>
              </div>

              {/* Job Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-[#070b13] border border-[#182335] p-3 rounded text-[10px]">
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
                <span className="text-[10px] text-slate-400 font-bold block uppercase">POSITION SUMMARY:</span>
                <p className="text-[11px] text-slate-300 leading-relaxed bg-[#070b13] p-3 rounded border border-[#182335]">
                  {selectedJob.overview}
                </p>
              </div>

              {/* Responsibilities */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-cyan-400 font-bold block uppercase">KEY OPERATIONAL RESPONSIBILITIES:</span>
                <div className="space-y-1">
                  {selectedJob.responsibilities.map((r, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-amber-400 font-bold block uppercase">TECHNICAL QUALIFICATIONS:</span>
                <div className="space-y-1">
                  {selectedJob.qualifications.map((q, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Psychological Requirements */}
              <div className="p-3.5 bg-rose-950/20 border-l-2 border-rose-600 rounded space-y-1 text-[10px]">
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
          <div className="p-2.5 bg-[#0a0e18] border border-[#1b263b] rounded-lg font-bold text-xs text-white">
            OPEN REQUISITIONS (12)
          </div>

          <div className="space-y-1.5 max-h-[700px] overflow-y-auto pr-1 scrollbar-thin">
            {jobPostings.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setSelectedJob(job);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'bg-[#0a0e18] hover:bg-[#0e1524] border-[#1b263b] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-[10px] font-mono">{job.requisitionId}</span>
                    <span className="text-[9px] text-slate-500">{job.postingDate}</span>
                  </div>
                  <h3 className="font-bold text-xs text-slate-200 truncate">{job.title}</h3>
                  <p className="text-[10px] text-slate-500 truncate">{job.location}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
