import { GraduationCap, Clock, BookOpen, ShieldCheck } from 'lucide-react';
import { TRAINING_MODULES } from '@/content';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useArchiveUi } from '@/app/archive-ui-context';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';

const modules = TRAINING_MODULES;

export default function TrainingPage() {
  const { openDialog } = useArchiveUi();
  return (
    <ArchivePage>
      <ViewHeader
        icon={GraduationCap}
        iconClassName="text-amber-400"
        title="EMPLOYEE ONBOARDING & PSYCHOLOGICAL COMPLIANCE MODULES"
        subtitle={`${modules.length} Mandatory Training Courses with Interactive Certification Quizzes`}
        aside={
          <span className="text-label px-2.5 py-1 bg-amber-950/40 border border-amber-600/60 rounded text-amber-300 font-bold self-start md:self-auto">
            MANDATORY ANNUAL CERTIFICATION
          </span>
        }
      />

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className="p-5 bg-panel border border-line-strong hover:border-amber-500/50 rounded-lg shadow-lg flex flex-col justify-between space-y-4 group transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-line pb-2">
                <span className="font-bold text-amber-400 text-xs">{mod.moduleCode}</span>
                <span className="text-caption text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mod.estimatedMinutes} MINS
                </span>
              </div>

              <h2 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                {mod.title}
              </h2>

              <p className="text-label text-slate-400 leading-relaxed line-clamp-3">{mod.overview}</p>

              <div className="p-2.5 bg-inset border border-line rounded text-caption text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="truncate">AWARDS: {mod.certificationTitle}</span>
              </div>
            </div>

            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => {
                gpcAudio.playUiSound('click');
                openDialog({ type: 'training', module: mod });
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded cursor-pointer transition-colors shadow-md text-xs"
            >
              <BookOpen className="w-4 h-4" />
              <span>START TRAINING MODULE</span>
            </button>
          </div>
        ))}
      </div>
    </ArchivePage>
  );
}
