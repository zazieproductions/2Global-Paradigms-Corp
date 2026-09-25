import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  CheckCircle2,
  AlertCircle,
  Award,
  Download,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { TrainingModule } from '../types';
import { gpcAudio } from '../lib/audioEngine';

interface TrainingModuleModalProps {
  module: TrainingModule | null;
  onClose: () => void;
}

export const TrainingModuleModal: React.FC<TrainingModuleModalProps> = ({
  module,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState<'reading' | 'quiz' | 'certified'>('reading');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number>(0);

  if (!module) return null;

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    gpcAudio.playUiSound('click');
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    module.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / module.quiz.length) * 100);
    setScore(calculatedScore);

    if (calculatedScore >= 66) {
      gpcAudio.playUiSound('grant');
      setCurrentStep('certified');
    } else {
      gpcAudio.playUiSound('deny');
    }
  };

  const handleDownloadCertificate = () => {
    gpcAudio.playUiSound('print');
    const certText =
      `=================================================================\n` +
      `       GLOBAL PARADIGMS CORPORATION // CERTIFICATION\n` +
      `=================================================================\n\n` +
      `THIS CERTIFIES THAT THE INVESTIGATOR HAS COMPLETED:\n\n` +
      `   ${module.moduleCode}: ${module.title.toUpperCase()}\n\n` +
      `AWARDED DESIGNATION: ${module.certificationTitle.toUpperCase()}\n` +
      `FINAL SCORE: ${score}%\n` +
      `AUTHORITY: GPC BIO-HARMONIC & TRAINING DIRECTORATE\n` +
      `DATE: ${new Date().toISOString().split('T')[0]}\n` +
      `VALIDATION HASH: GPC-CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}\n` +
      `=================================================================\n`;

    const blob = new Blob([certText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${module.moduleCode}_GPC_Certificate.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 select-none font-mono text-xs">
      <div className="bg-[#0b0f19] border border-amber-500/40 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0e1422] border-b border-[#1c273c]">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-5 h-5 text-amber-400" />
            <div>
              <span className="font-bold text-slate-200 text-xs tracking-wider">
                GPC TRAINING PORTAL // {module.moduleCode}
              </span>
              <span className="text-[10px] text-slate-500 ml-2">
                [{module.departmentCode} DIRECTORATE]
              </span>
            </div>
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 text-slate-200 scrollbar-thin">
          {currentStep === 'reading' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 font-bold">
                  ESTIMATED TIME: {module.estimatedMinutes} MINS
                </span>
                <h2 className="text-base md:text-lg font-bold text-white mt-2">
                  {module.title}
                </h2>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {module.overview}
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-4">
                {module.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 bg-[#070b13] border border-[#182335] rounded space-y-2">
                    <h3 className="font-bold text-cyan-300 text-xs">{sec.title}</h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">
                      {sec.text}
                    </p>
                    {sec.safetyGuideline && (
                      <div className="mt-2 p-2.5 bg-amber-950/20 border-l-2 border-amber-500 rounded text-[10px] text-amber-200 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{sec.safetyGuideline}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setCurrentStep('quiz');
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded cursor-pointer transition-colors shadow-lg"
                >
                  <span>PROCEED TO CERTIFICATION QUIZ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 'quiz' && (
            <div className="space-y-6">
              <div className="border-b border-[#182335] pb-3">
                <h2 className="text-sm font-bold text-white">
                  MANDATORY COMPLIANCE EVALUATION: {module.moduleCode}
                </h2>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Answer all questions below. Minimum score of 66% required to receive GPC Employee Certification.
                </p>
              </div>

              <div className="space-y-6">
                {module.quiz.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 bg-[#080c14] border border-[#1b273d] rounded space-y-3">
                    <span className="font-bold text-cyan-300 text-[11px]">
                      QUESTION {qIdx + 1}: {q.question}
                    </span>
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[qIdx] === optIdx;
                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(qIdx, optIdx)}
                            className={`p-2.5 rounded border text-[11px] cursor-pointer transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-cyan-500/15 border-cyan-400 text-white font-semibold'
                                : 'bg-[#0b101a] border-[#162030] text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <span>{opt}</span>
                            <div
                              className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'
                              }`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    gpcAudio.playUiSound('click');
                    setCurrentStep('reading');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                >
                  Back to Material
                </button>
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < module.quiz.length}
                  className={`px-5 py-2.5 rounded font-bold cursor-pointer transition-colors shadow-lg ${
                    Object.keys(selectedAnswers).length === module.quiz.length
                      ? 'bg-amber-500 hover:bg-amber-400 text-black'
                      : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  SUBMIT EVALUATION
                </button>
              </div>
            </div>
          )}

          {currentStep === 'certified' && (
            <div className="flex flex-col items-center text-center p-6 space-y-6">
              <Award className="w-16 h-16 text-amber-400 animate-bounce" />
              <div>
                <h2 className="text-base md:text-lg font-bold text-white">
                  CERTIFICATION AWARDED // SCORE: {score}%
                </h2>
                <p className="text-xs text-emerald-400 font-bold mt-1">
                  {module.certificationTitle}
                </p>
                <p className="text-[10px] text-slate-400 mt-2 max-w-md mx-auto">
                  Your successful evaluation has been logged to the Postojna Caverns training database. Your compliance standing has been renewed for 365 days.
                </p>
              </div>

              {/* Certificate Box */}
              <div className="w-full max-w-md bg-[#070b13] border-2 border-amber-500/60 p-6 rounded text-left space-y-3 font-serif text-slate-200 relative shadow-2xl">
                <div className="text-center border-b border-slate-700 pb-2">
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block">
                    GLOBAL PARADIGMS CORPORATION
                  </span>
                  <span className="text-xs font-bold text-amber-300 tracking-wider">
                    OFFICIAL CERTIFICATE OF COMPETENCY
                  </span>
                </div>
                <div className="text-[11px] leading-relaxed">
                  This certifies that the investigator has demonstrated mastery in{' '}
                  <span className="font-bold text-white">{module.title}</span> under the supervision of the {module.departmentCode} Directorate.
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-slate-800 text-[9px] font-mono text-slate-500">
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

              <div className="flex gap-3">
                <button
                  onClick={handleDownloadCertificate}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded cursor-pointer transition-colors shadow-md text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD CERTIFICATE (.TXT)</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentStep('reading');
                    setSelectedAnswers({});
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
