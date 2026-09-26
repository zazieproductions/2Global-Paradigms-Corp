import { useEffect, useState, type FormEvent } from 'react';
import { AtSign, Briefcase, CheckCircle2, Download, Info, User } from 'lucide-react';
import type { JobPosting } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { downloadFile } from '@/lib/utils/download';
import { Modal } from '@/components/ui/modal';

interface ApplicationModalProps {
  job: JobPosting | null;
  onClose: () => void;
}

export function ApplicationModal({ job, onClose }: ApplicationModalProps) {
  if (!job) return null;
  // Keyed so the form resets between postings.
  return <ApplicationForm key={job.id} job={job} onClose={onClose} />;
}

/**
 * In-world job application. Purely theatrical: nothing is sent anywhere and
 * nothing is stored. Only an invented name is required.
 */
function ApplicationForm({ job, onClose }: { job: JobPosting; onClose: () => void }) {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [statement, setStatement] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle');

  useEffect(() => {
    if (status !== 'submitting') return;
    const id = setTimeout(() => {
      setStatus('done');
      gpcAudio.playUiSound('grant');
    }, 1200);
    return () => clearTimeout(id);
  }, [status]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    gpcAudio.playUiSound('scan');
    setStatus('submitting');
  };

  const downloadReceipt = () => {
    gpcAudio.playUiSound('print');
    const rule = '='.repeat(65);
    downloadFile(
      `${job.requisitionId}_Application_Receipt.txt`,
      [
        rule,
        '   GLOBAL PARADIGMS CORP. // CANDIDATE APPLICATION RECEIPT',
        rule,
        '',
        `REQUISITION ID: ${job.requisitionId}`,
        `POSITION: ${job.title.toUpperCase()}`,
        `DEPARTMENT: ${job.department.toUpperCase()}`,
        `LOCATION: ${job.location.toUpperCase()}`,
        `SECURITY CLEARANCE REQUIRED: ${job.clearanceRequired}`,
        '',
        `CANDIDATE NAME: ${name.trim().toUpperCase()}`,
        handle.trim() ? `CONTACT HANDLE: ${handle.trim()}` : 'CONTACT HANDLE: [WITHHELD]',
        `SUBMISSION TIMESTAMP: ${new Date().toISOString()}`,
        'BIOMETRIC VETTING STATUS: PROVISIONAL QUEUED (Level 3 Pre-Screen)',
        '',
        'NOTICE TO APPLICANT:',
        'You will be contacted by a GPC Human Capital Vetting Officer within 72 hours',
        'to schedule your preliminary hearing and neurological resonance evaluation.',
        'Do not disclose this application to unauthorized external entities.',
        rule,
        '-- Fictional document. Global Paradigms Corp. is an original story by Zazie Productions.',
        '-- Nothing you typed was transmitted or stored.'
      ].join('\n')
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="CLASSIFIED RECRUITMENT APPLICATION"
      icon={Briefcase}
      tone="signal"
      size="lg"
    >
      {status !== 'done' ? (
        <form onSubmit={submit} className="space-y-4">
          <div className="p-3 bg-inset border border-line rounded space-y-1">
            <span className="text-caption text-cyan-400 font-bold">{job.requisitionId}</span>
            <h3 className="text-sm font-bold text-white">{job.title}</h3>
            <p className="text-caption text-slate-400">
              {job.location} | {job.clearanceRequired}
            </p>
          </div>

          <p
            className="p-2.5 bg-cyan-950/20 border border-cyan-700/40 rounded text-caption text-cyan-200 leading-snug flex gap-2"
            role="note"
          >
            <Info className="w-3.5 h-3.5 shrink-0 mt-px" aria-hidden />
            <span>
              OUT OF STORY: this form is part of a work of fiction. Nothing is sent or saved — use an invented
              name. Your entry is only printed onto the receipt you can download.
            </span>
          </p>

          <div className="space-y-3">
            <div>
              <label htmlFor="app-name" className="block text-caption text-slate-400 mb-1">
                APPLICANT FULL NAME (IN-STORY):
              </label>
              <div className="field flex items-center gap-2 focus-within:border-cyan-500">
                <User className="w-3.5 h-3.5 text-slate-500" aria-hidden />
                <input
                  id="app-name"
                  type="text"
                  required
                  maxLength={60}
                  autoComplete="off"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. / Analyst / Officer Name"
                  className="flex-1 min-w-0 bg-transparent border-none text-slate-100 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="app-handle" className="block text-caption text-slate-400 mb-1">
                SECURE CONTACT HANDLE (OPTIONAL):
              </label>
              <div className="field flex items-center gap-2 focus-within:border-cyan-500">
                <AtSign className="w-3.5 h-3.5 text-slate-500" aria-hidden />
                <input
                  id="app-handle"
                  type="text"
                  maxLength={60}
                  autoComplete="off"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. night-shift-analyst — do not use a real address"
                  className="flex-1 min-w-0 bg-transparent border-none text-slate-100 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="app-statement" className="block text-caption text-slate-400 mb-1">
                SECURITY CLEARANCE STATEMENT & EXPERIENCE SUMMARY:
              </label>
              <textarea
                id="app-statement"
                rows={3}
                maxLength={1000}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder="Outline prior defense research, acoustic DSP experience, and willingness to undergo mandatory psychological vetting..."
                className="field w-full resize-none"
              />
            </div>
          </div>

          <div className="p-2.5 bg-amber-950/20 border border-amber-500/30 rounded text-micro text-amber-200 leading-tight">
            NOTICE: By submitting, you consent to automated GPC background screening, including sovereign
            financial credit checks and non-invasive acoustic resonance profiling.
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
              disabled={status === 'submitting'}
              className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded cursor-pointer transition-colors text-xs"
            >
              {status === 'submitting' ? 'PROCESSING VETTING...' : 'TRANSMIT APPLICATION'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center text-center space-y-4 py-4" role="status">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" aria-hidden />
          <div>
            <h3 className="text-sm font-bold text-white">APPLICATION TRANSMITTED</h3>
            <p className="text-label text-slate-300 mt-1">
              Your dossier has been routed to the{' '}
              <span className="text-cyan-400 font-bold">{job.department}</span> recruitment cell.
            </p>
          </div>
          <button
            type="button"
            onClick={downloadReceipt}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded cursor-pointer transition-colors text-xs"
          >
            <Download className="w-4 h-4" aria-hidden />
            <span>DOWNLOAD APPLICATION RECEIPT (.TXT)</span>
          </button>
        </div>
      )}
    </Modal>
  );
}
