/**
 * Dashboard strip that keeps OPERATION SILENTIUM front and centre: the current
 * directive, its next step, and one-click ways to pursue it.
 */
import { type FC } from 'react';
import { ArrowRight, Crosshair, MapPin } from 'lucide-react';
import { OPERATION_NAME } from '@/content/puzzles/directives';
import { getDocumentById } from '@/lib/archive/records';
import { useDirectives } from '@/hooks/use-directives';
import { useProgression } from '@/hooks/use-progression';
import { useArchiveUi } from '@/app/archive-ui-context';
import { pathForTab } from '@/config/navigation';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { Link } from 'react-router-dom';

const GO_BTN =
  'tap-target flex items-center gap-1.5 px-3 py-2 rounded border text-[11px] font-bold tracking-wider cursor-pointer transition-colors';

export const DirectiveTracker: FC = () => {
  const dir = useDirectives();
  const { state } = useProgression();
  const { navigateToTab, openDocument, openDialog } = useArchiveUi();

  const { current, currentStep } = dir;

  // One-click pursuit of the current step, when the step names a destination.
  let stepAction: { label: string; go: () => void } | null = null;
  if (current && currentStep) {
    const ev = currentStep.event;
    if (ev.type === 'route') {
      stepAction = { label: `GO TO ${ev.tab.toUpperCase()}`, go: () => navigateToTab(ev.tab) };
    } else if (ev.type === 'record') {
      const doc = getDocumentById(ev.id);
      stepAction = doc
        ? { label: `OPEN ${doc.code}`, go: () => openDocument(doc) }
        : { label: 'GO TO DEAD LINKS', go: () => navigateToTab('deadlinks') };
    } else if (ev.type === 'puzzle' && ev.id.startsWith('seal-')) {
      stepAction = { label: 'OPEN THE CASE FILE', go: () => navigateToTab('sanctum') };
    } else if (ev.type === 'puzzle' && ev.id.startsWith('gateway-')) {
      stepAction = { label: 'OPEN THE GATEWAY', go: () => openDialog({ type: 'gateway' }) };
    }
  }

  const visitedRoutes = Object.keys(state.milestones).filter((k) => k.startsWith('route:')).length;

  return (
    <section
      aria-label="Current objective"
      className="relative overflow-hidden p-4 rounded-lg border border-cyan-800/50 bg-gradient-to-r from-cyan-950/30 via-[#090d14] to-[#0b0d16]"
    >
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] tracking-[0.35em] text-cyan-400/90 flex items-center gap-2">
            <Crosshair className="w-3 h-3" aria-hidden />
            {OPERATION_NAME} · DIRECTIVE RELAY
          </p>
          {dir.done ? (
            <p className="font-occult text-lg text-slate-100 mt-1">
              ALL DIRECTIVES COMPLETE — the archive is quiet now.
            </p>
          ) : current && currentStep ? (
            <>
              <p className="font-occult text-lg text-slate-100 mt-1">
                {current.code} · {current.title}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5 max-w-2xl">
                NEXT: <span className="text-cyan-200">{currentStep.label}</span>
                <span className="text-slate-500"> — {currentStep.hint}</span>
              </p>
            </>
          ) : (
            <p className="font-occult text-lg text-slate-100 mt-1">Mission Control is idle.</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span className="text-[10px] px-2.5 py-1.5 rounded border border-slate-800 text-slate-400">
            DIRECTIVES:{' '}
            <span className="text-cyan-300 font-bold">
              {dir.completedCount}/{dir.total}
            </span>
          </span>
          <span className="hidden sm:inline text-[10px] px-2.5 py-1.5 rounded border border-slate-800 text-slate-400">
            CHAPTERS: <span className="text-cyan-300 font-bold">{dir.completedChapters}/5</span>
          </span>
          <span
            className="hidden md:inline text-[10px] px-2.5 py-1.5 rounded border border-slate-800 text-slate-400"
            title={`Sections visited: ${visitedRoutes} · Standing: ${dir.standing}`}
          >
            STANDING: <span className="text-cyan-300 font-bold">{dir.standing}</span>
          </span>
          {stepAction && !dir.done && (
            <button
              type="button"
              onClick={() => {
                gpcAudio.playUiSound('click');
                stepAction!.go();
              }}
              className={`${GO_BTN} border-cyan-500/60 text-cyan-300 hover:bg-cyan-950/50`}
            >
              <MapPin className="w-3.5 h-3.5" aria-hidden />
              {stepAction.label}
            </button>
          )}
          <Link
            to={pathForTab('directives')}
            onClick={() => gpcAudio.playUiSound('click')}
            className={`${GO_BTN} bg-cyan-600 hover:bg-cyan-500 border-cyan-500 text-black`}
          >
            MISSION CONTROL <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};
