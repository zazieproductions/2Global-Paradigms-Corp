import React, { useState } from 'react';
import { Briefcase, X, CheckCircle2, ShieldCheck, Download, User, Mail, MapPin } from 'lucide-react';
import { JobPosting } from '../types';
import { gpcAudio } from '../lib/audioEngine';

interface ApplicationModalProps {
  job: JobPosting | null;
  onClose: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ job, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [statement, setStatement] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    gpcAudio.playUiSound('scan');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      gpcAudio.playUiSound('grant');
    }, 1200);
  };

  const handleDownloadConfirmation = () => {
    gpcAudio.playUiSound('print');
    const text =
      `=================================================================\n` +
      `   GLOBAL PARADIGMS CORP. // CANDIDATE APPLICATION RECEIPT\n` +
      `=================================================================\n\n` +
      `REQUISITION ID: ${job.requisitionId}\n` +
      `POSITION: ${job.title.toUpperCase()}\n` +
      `DEPARTMENT: ${job.department.toUpperCase()}\n` +
      `LOCATION: ${job.location.toUpperCase()}\n` +
      `SECURITY CLEARANCE REQUIRED: ${job.clearanceRequired}\n\n` +
      `CANDIDATE NAME: ${name.toUpperCase()}\n` +
      `EMAIL: ${email.toLowerCase()}\n` +
      `SUBMISSION TIMESTAMP: ${new Date().toISOString()}\n` +
      `BIOMETRIC VETTING STATUS: PROVISIONAL QUEUED (Level 3 Pre-Screen)\n\n` +
      `NOTICE TO APPLICANT:\n` +
      `You will be contacted by a GPC Human Capital Vetting Officer within 72 hours\n` +
      `to schedule your preliminary hearing and neurological resonance evaluation.\n` +
      `Do not disclose this application to unauthorized external entities.\n` +
      `=================================================================\n`;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.requisitionId}_Application_Receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none font-mono text-xs">
      <div className="bg-[#0b0f19] border border-cyan-500/40 rounded-lg max-w-lg w-full p-6 shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col text-slate-200">
        <div className="flex items-center justify-between border-b border-[#1c273c] pb-3 mb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Briefcase className="w-4 h-4" />
            <span>CLASSIFIED RECRUITMENT APPLICATION</span>
          </div>
          <button
            onClick={() => {
              gpcAudio.playUiSound('click');
              onClose();
            }}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3 bg-[#070b13] border border-[#182335] rounded space-y-1">
              <span className="text-[10px] text-cyan-400 font-bold">{job.requisitionId}</span>
              <h3 className="text-sm font-bold text-white">{job.title}</h3>
              <p className="text-[10px] text-slate-400">{job.location} | {job.clearanceRequired}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">APPLICANT FULL NAME:</label>
                <div className="flex items-center gap-2 bg-[#06080e] border border-[#1b2538] rounded px-2.5 py-1.5 focus-within:border-cyan-500">
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dr. / Analyst / Officer Name"
                    className="flex-1 bg-transparent border-none text-slate-100 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">SECURE CONTACT EMAIL:</label>
                <div className="flex items-center gap-2 bg-[#06080e] border border-[#1b2538] rounded px-2.5 py-1.5 focus-within:border-cyan-500">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="applicant@domain.com"
                    className="flex-1 bg-transparent border-none text-slate-100 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">
                  SECURITY CLEARANCE STATEMENT & EXPERIENCE SUMMARY:
                </label>
                <textarea
                  rows={3}
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  placeholder="Outline prior defense research, acoustic DSP experience, and willingness to undergo mandatory psychological vetting..."
                  className="w-full bg-[#06080e] border border-[#1b2538] rounded p-2 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 resize-none font-mono"
                />
              </div>
            </div>

            <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded text-[9px] text-amber-200 leading-tight">
              NOTICE: By submitting, you consent to automated GPC background screening, including sovereign financial credit checks and non-invasive acoustic resonance profiling.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded cursor-pointer transition-colors text-xs"
              >
                {isSubmitting ? 'PROCESSING VETTING...' : 'TRANSMIT APPLICATION'}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
            <div>
              <h3 className="text-sm font-bold text-white">APPLICATION TRANSMITTED</h3>
              <p className="text-[11px] text-slate-300 mt-1">
                Your dossier has been routed to the <span className="text-cyan-400 font-bold">{job.department}</span> recruitment cell.
              </p>
            </div>
            <button
              onClick={handleDownloadConfirmation}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded cursor-pointer transition-colors text-xs"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD APPLICATION RECEIPT (.TXT)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
