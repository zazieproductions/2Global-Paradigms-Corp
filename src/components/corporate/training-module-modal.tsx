import { useState } from 'react';
import { AlertCircle, ArrowRight, Award, Download, GraduationCap, RotateCcw } from 'lucide-react';
import type { TrainingModule } from '@/types';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { downloadFile } from '@/lib/utils/download';
import { sha256Hex } from '@/lib/utils/sha256';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils/cn';

/** Minimum score (percent) required for certification. */
const PASS_MARK = 66;

interface TrainingModuleModalProps {
  module: TrainingModule | null;
  onClose: () => void;
}

export function TrainingModuleModal({ module, onClose }: TrainingModuleModalProps) {
  if (!module) return null;
  return <TrainingPortal key={module.id} module={module} onClose={onClose} />;
}

function TrainingPortal({ module, onClose }: { module: TrainingModule; onClose: () => void }) {
  const [step, setStep] = useState<'reading' | 'quiz' | 'certified'>('reading');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const allAnswered = Object.keys(answers).length === module.quiz.length;

  const submitQuiz = () => {
    const correct = module.quiz.filter((q, i) => answers[i] === q.correctIndex).length;
    const pct = Math.round((correct / module.quiz.length) * 100);
    setScore(pct);
    if (pct >= PASS_MARK) {
      gpcAudio.playUiSound('grant');
      setStep('certified');
    } else {
      gpcAudio.playUiSound('deny');
    }
  };

  const downloadCertificate = () => {
    gpcAudio.playUiSound('print');
    const rule = '='.repeat(65);
    const date = new Date().toISOString().split('T')[0];
    downloadFile(
      `${module.moduleCode}_GPC_Certificate.txt`,
      [
        rule,
        '       GLOBAL PARADIGMS CORPORATION // CERTIFICATION',
        rule,
        '',
        'THIS CERTIFIES THAT THE INVESTIGATOR HAS COMPLETED:',
        '',
        `   ${module.moduleCode}: ${module.title.toUpperCase()}`,
        '',
        `AWARDED DESIGNATION: ${module.certificationTitle.toUpperCase()}`,
        `FINAL SCORE: ${score}%`,
        'AUTHORITY: GPC BIO-HARMONIC & TRAINING DIRECTORATE',
        `DATE: ${date}`,
        `VALIDATION HASH: GPC-CERT-${sha256Hex(`${module.moduleCode}|${date}|${score}`).slice(0, 8).toUpperCase()}`,
        rule,
        '-- CERTIFICATE GENERATED LOCALLY BY PARADIGM-OS.'
      ].join('\n')
    );
  };

  return (
    <Modal
      open
      onClose={onClose}
      variant="window"
      tone="warning"
      size="2xl"
      icon={GraduationCap}
      className="max-w-3xl"
      title={
        <span className="text-slate-200 text-xs tracking-wider">
          GPC TRAINING PORTAL // {module.moduleCode}
          <span className="text-caption text-slate-500 ml-2 font-normal">
            [{module.departmentCode} DIRECTORATE]
          </span>
        </span>
      }
      bodyClassName="p-4 md:p-6 space-y-6 text-slate-200"
    >
      {step === 'reading' && (
        <div className="space-y-6">
          <div>
            <span className="text-caption px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 font-bold">
              ESTIMATED TIME: {module.estimatedMinutes} MINS
            </span>
            <h3 className="text-base md:text-lg font-bold text-white mt-2">{module.title}</h3>
            <p className="text-label text-slate-400 mt-1 leading-relaxed">{module.overview}</p>
          </div>

          <div className="space-y-4">
            {module.sections.map((sec) => (
              <section key={sec.title} className="p-4 bg-inset border border-line rounded space-y-2">
                <h4 className="font-bold text-cyan-300 text-xs">{sec.title}</h4>
                <p className="text-label text-slate-300 leading-relaxed whitespace-pre-line">{sec.text}</p>
                {sec.safetyGuideline && (
                  <div className="mt-2 p-2.5 bg-amber-950/20 border-l-2 border-amber-500 rounded text-caption text-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" aria-hidden />
                    <span>{sec.safetyGuideline}</span>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                gpcAudio.playUiSound('click');
                setStep('quiz');
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded cursor-pointer transition-colors shadow-lg"
            >
              <span>PROCEED TO CERTIFICATION QUIZ</span>
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {step === 'quiz' && (
        <div className="space-y-6">
          <div className="border-b border-line pb-3">
            <h3 className="text-sm font-bold text-white">
              MANDATORY COMPLIANCE EVALUATION: {module.moduleCode}
            </h3>
            <p className="text-caption text-slate-400 mt-0.5">
              Answer all questions below. Minimum score of {PASS_MARK}% required to receive GPC Employee
              Certification.
            </p>
          </div>

          <div className="space-y-6">
            {module.quiz.map((q, qIdx) => (
              <fieldset key={q.question} className="p-4 bg-shell border border-line-strong rounded space-y-3">
                <legend className="font-bold text-cyan-300 text-label px-1">
                  QUESTION {qIdx + 1}: {q.question}
                </legend>
                <div className="space-y-1.5">
                  {q.options.map((opt, optIdx) => {
                    const checked = answers[qIdx] === optIdx;
                    return (
                      <label
                        key={opt}
                        className={cn(
                          'p-2.5 rounded border text-label cursor-pointer transition-all flex items-center justify-between gap-3 focus-within:ring-1 focus-within:ring-cyan-400',
                          checked
                            ? 'bg-cyan-500/15 border-cyan-400 text-white font-semibold'
                            : 'bg-panel border-line-subtle text-slate-400 hover:text-slate-200'
                        )}
                      >
                        <span>{opt}</span>
                        <input
                          type="radio"
                          name={`q-${qIdx}`}
                          checked={checked}
                          onChange={() => {
                            gpcAudio.playUiSound('click');
                            setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
                            setScore(null);
                          }}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className={cn(
                            'w-3.5 h-3.5 shrink-0 rounded-full border flex items-center justify-center',
                            checked ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'
                          )}
                        >
                          {checked && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {score !== null && score < PASS_MARK && (
            <p
              role="alert"
              className="p-3 bg-rose-950/30 border border-rose-600/50 rounded text-caption text-rose-300"
            >
              EVALUATION FAILED — SCORE {score}%. Compliance standing not renewed. Review the material and
              resubmit.
            </p>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                gpcAudio.playUiSound('click');
                setStep('reading');
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
            >
              Back to Material
            </button>
            <button
              type="button"
              onClick={submitQuiz}
              disabled={!allAnswered}
              className={cn(
                'px-5 py-2.5 rounded font-bold transition-colors shadow-lg',
                allAnswered
                  ? 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              )}
            >
              SUBMIT EVALUATION
            </button>
          </div>
        </div>
      )}

      {step === 'certified' && (
        <div className="flex flex-col items-center text-center p-6 space-y-6" role="status">
          <Award className="w-16 h-16 text-amber-400 animate-bounce" aria-hidden />
          <div>
            <h3 className="text-base md:text-lg font-bold text-white">
              CERTIFICATION AWARDED // SCORE: {score}%
            </h3>
            <p className="text-xs text-emerald-400 font-bold mt-1">{module.certificationTitle}</p>
            <p className="text-caption text-slate-400 mt-2 max-w-md mx-auto">
              Your successful evaluation has been logged to the Postojna Caverns training database. Your
              compliance standing has been renewed for 365 days.
            </p>
          </div>

          <div className="w-full max-w-md bg-inset border-2 border-amber-500/60 p-6 rounded text-left space-y-3 font-serif text-slate-200 relative shadow-2xl">
            <div className="text-center border-b border-slate-700 pb-2">
              <span className="text-micro font-mono tracking-widest text-slate-400 uppercase block">
                GLOBAL PARADIGMS CORPORATION
              </span>
              <span className="text-xs font-bold text-amber-300 tracking-wider">
                OFFICIAL CERTIFICATE OF COMPETENCY
              </span>
            </div>
            <p className="text-label leading-relaxed">
              This certifies that the investigator has demonstrated mastery in{' '}
              <span className="font-bold text-white">{module.title}</span> under the supervision of the{' '}
              {module.departmentCode} Directorate.
            </p>
            <div className="flex justify-between items-end pt-3 border-t border-slate-800 text-micro font-mono text-slate-500">
              <div>
                <span>HASH: 0x88F...99A</span>
                <br />
                <span>STATUS: PURE / CERTIFIED</span>
              </div>
              <div className="text-right">
                <span className="italic font-serif text-slate-400">Dr. Naomi Chen</span>
                <br />
                <span>DIRECTOR OF TRAINING</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={downloadCertificate}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded cursor-pointer transition-colors shadow-md text-xs"
            >
              <Download className="w-4 h-4" aria-hidden />
              <span>DOWNLOAD CERTIFICATE (.TXT)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('reading');
                setAnswers({});
                setScore(null);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden />
              <span>Retake</span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
