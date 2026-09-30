/**
 * /directives — MISSION CONTROL for OPERATION SILENTIUM.
 *
 * The quest log: five escalating chapters, fourteen directives, every step
 * auto-tracked. There is always exactly one CURRENT OBJECTIVE; everything
 * else is locked, active-soon, or recovered intel.
 */
import { ArrowRight, CheckCircle2, Circle, Crosshair, FileText, Lock, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OPERATION_CELL, type Directive } from '@/content/puzzles/directives';
import { getDocumentById } from '@/lib/archive/records';
import { pathForTab } from '@/config/navigation';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useArchiveUi } from '@/app/archive-ui-context';
import { useDirectives } from '@/hooks/use-directives';
import { ArchivePage } from '@/components/ui/archive-page';
import { ViewHeader } from '@/components/ui/view-header';
import { cn } from '@/lib/utils/cn';

const ACTION_BTN =
  'tap-target inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-[10px] font-bold tracking-wider cursor-pointer transition-colors';

export default function DirectivesPage() {
  const dir = useDirectives();
  const { navigateToTab, openDocument, openDialog } = useArchiveUi();

  const pursue = (d: Directive) => {
    const step = dir.nextStepOf(d);
    if (!step) return;
    const ev = step.event;
    gpcAudio.playUiSound('click');
    if (ev.type === 'route') navigateToTab(ev.tab);
    else if (ev.type === 'record') {
      const doc = getDocumentById(ev.id);
      if (doc) openDocument(doc);
      else navigateToTab('deadlinks');
    } else if (ev.type === 'puzzle') {
      if (ev.id.startsWith('seal-')) navigateToTab('sanctum');
      else if (ev.id.startsWith('gateway-')) openDialog({ type: 'gateway' });
    }
  };

  return (
    <ArchivePage className="space-y-6">
      <ViewHeader
        icon={Crosshair}
        iconClassName="text-cyan-400"
        title="MISSION CONTROL // OPERATION SILENTIUM"
        subtitle={`${OPERATION_CELL} — ${dir.total} directives across 5 chapters. Steps complete themselves as you work; your only job is to keep going.`}
        aside={
          <span className="text-label px-2.5 py-1 bg-cyan-950/40 border border-cyan-600/60 rounded text-cyan-300 font-bold self-start md:self-auto">
            {dir.completedCount}/{dir.total} DIRECTIVES · STANDING: {dir.standing}
          </span>
        }
      />

      {/* Overall progress */}
      <div className="p-3.5 bg-panel border border-line-strong rounded-lg space-y-2">
        <div className="flex items-center justify-between text-caption">
          <span className="text-slate-400 font-bold tracking-widest">OPERATION PROGRESS</span>
          <span className="text-cyan-300 font-bold">
            {Math.round((dir.completedCount / dir.total) * 100)}%
          </span>
        </div>
        <div
          className="h-2 rounded bg-inset overflow-hidden"
          role="progressbar"
          aria-valuenow={dir.completedCount}
          aria-valuemin={0}
          aria-valuemax={dir.total}
          aria-label="Directives completed"
        >
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all"
            style={{ width: `${(dir.completedCount / dir.total) * 100}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {dir.chapters.map(({ chapter, complete, unlocked }) => (
            <span
              key={chapter.id}
              className={cn(
                'text-micro px-2 py-1 rounded border font-bold tracking-wider',
                complete
                  ? 'text-black border-transparent'
                  : unlocked
                    ? 'text-slate-200 border-slate-600'
                    : 'text-slate-600 border-slate-800'
              )}
              style={complete ? { background: chapter.accent } : undefined}
            >
              {chapter.code} {complete ? '✓' : unlocked ? chapter.title : 'LOCKED'}
            </span>
          ))}
        </div>
      </div>

      {/* Current objective */}
      {dir.current && (
        <section
          aria-label="Current objective"
          className="p-4 rounded-lg border bg-gradient-to-br from-cyan-950/30 via-[#0a0e15] to-[#0b0d16]"
          style={{
            borderColor: `${dir.chapters.find((c) => c.chapter.id === dir.current!.chapterId)?.chapter.accent}55`
          }}
        >
          <p className="text-[10px] tracking-[0.35em] text-cyan-400 flex items-center gap-2 mb-1.5">
            <Crosshair className="w-3.5 h-3.5" aria-hidden /> CURRENT OBJECTIVE
          </p>
          <h2 className="font-occult text-xl text-slate-100">
            {dir.current.code} · {dir.current.title}
          </h2>
          {dir.currentStep && (
            <p className="text-[11px] text-slate-400 mt-1">
              NEXT STEP: <span className="text-cyan-200 font-bold">{dir.currentStep.label}</span>
              <span className="text-slate-500"> — {dir.currentStep.hint}</span>
            </p>
          )}
          <button
            type="button"
            onClick={() => pursue(dir.current!)}
            className={`${ACTION_BTN} mt-3 border-cyan-500/60 text-cyan-300 hover:bg-cyan-950/50`}
          >
            PURSUE THIS STEP <ArrowRight className="w-3.5 h-3.5" aria-hidden />
          </button>
        </section>
      )}

      {dir.done && (
        <div className="p-4 rounded-lg border border-slate-300/40 bg-gradient-to-br from-slate-200/10 to-transparent text-center space-y-1">
          <p className="font-occult text-xl text-slate-100">SILENTIUM — OPERATION COMPLETE</p>
          <p className="text-[11px] text-slate-400 max-w-2xl mx-auto">
            Every directive closed. The carrier is at 0.000 Hz and the archive remains open, exactly as the
            Restoration Cell asked. You may purge the case in the Sanctum and run it again, cleaner this time.
          </p>
        </div>
      )}

      {/* Chapters */}
      {dir.chapters.map(({ chapter, directives, complete, unlocked }) => (
        <section
          key={chapter.id}
          aria-labelledby={`chapter-${chapter.id}`}
          className={cn('rounded-lg border overflow-hidden', !unlocked && 'opacity-90')}
          style={{ borderColor: `${chapter.accent}${complete ? '66' : '33'}` }}
        >
          {/* Chapter header */}
          <div
            className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 border-b"
            style={{
              borderColor: `${chapter.accent}22`,
              background: `linear-gradient(120deg, ${chapter.accent}14, transparent 65%)`
            }}
          >
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.35em] font-bold" style={{ color: chapter.accent }}>
                {chapter.code} · CHAPTER {chapter.index} OF 5{' '}
                {complete ? '· COMPLETE ✓' : unlocked ? '· ACTIVE' : '· SEALED'}
              </p>
              <h2 id={`chapter-${chapter.id}`} className="font-occult text-lg text-slate-100">
                {chapter.title}
              </h2>
              <p className="text-[11px] text-slate-500 italic">{chapter.subtitle}</p>
            </div>
            <span
              className="text-[10px] px-2.5 py-1.5 rounded border shrink-0 self-start md:self-auto"
              style={{ color: chapter.accent, borderColor: `${chapter.accent}55` }}
            >
              STANDING ON COMPLETION: {chapter.standing}
            </span>
          </div>

          {!unlocked ? (
            <div className="p-6 text-center space-y-1.5 bg-black/30">
              <Lock className="w-6 h-6 mx-auto text-slate-600" aria-hidden />
              <p className="text-[11px] text-slate-500">
                Complete every directive in the previous chapter to decrypt this block.
              </p>
            </div>
          ) : (
            <>
              <p className="px-4 pt-3 text-[11px] text-slate-400 leading-relaxed max-w-3xl">
                {chapter.briefing}
              </p>
              <div className="p-4 grid grid-cols-1 gap-3">
                {directives.map((d) => {
                  const done = dir.isComplete(d);
                  const active = dir.isActive(d);
                  const locked = dir.isLocked(d) || (!active && !done);
                  const prog = dir.progress(d);
                  return (
                    <article
                      key={d.id}
                      aria-label={`Directive ${d.code}: ${d.title} (${done ? 'complete' : locked ? 'locked' : 'active'})`}
                      className={cn(
                        'rounded-lg border p-4 space-y-3 bg-black/40 transition-colors',
                        done
                          ? 'border-emerald-700/50'
                          : active
                            ? 'border-cyan-600/60 shadow-glow-sm shadow-signal/10'
                            : 'border-slate-800 opacity-70'
                      )}
                    >
                      {/* Directive heading */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            'text-micro px-2 py-0.5 rounded font-bold tracking-widest border',
                            done
                              ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                              : active
                                ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 animate-pulse'
                                : 'bg-slate-900 border-slate-700 text-slate-500'
                          )}
                        >
                          {done ? '✓ COMPLETE' : active ? 'ACTIVE' : 'PENDING'}
                        </span>
                        <h3 className="font-occult text-sm text-slate-100">
                          {d.code} · {d.title}
                        </h3>
                        <span className="ml-auto text-micro text-slate-500">
                          {prog.done}/{prog.total} STEPS
                        </span>
                      </div>

                      {active && <p className="text-[11px] text-slate-400 leading-relaxed">{d.briefing}</p>}

                      {/* Step checklist */}
                      <ul className="space-y-1.5" aria-label="Steps">
                        {d.steps.map((s, i) => {
                          const stepDone = dir.stepDone(d, i);
                          return (
                            <li key={s.id} className="flex items-start gap-2 text-[11px]">
                              {stepDone ? (
                                <CheckCircle2
                                  className="w-3.5 h-3.5 mt-px text-emerald-400 shrink-0"
                                  aria-hidden
                                />
                              ) : (
                                <Circle className="w-3.5 h-3.5 mt-px text-slate-600 shrink-0" aria-hidden />
                              )}
                              <span
                                className={
                                  stepDone
                                    ? 'text-slate-500 line-through decoration-slate-700'
                                    : 'text-slate-300'
                                }
                              >
                                {s.label}
                                {active &&
                                  !stepDone &&
                                  i === d.steps.findIndex((_st, j) => !dir.stepDone(d, j)) && (
                                    <span className="text-slate-500 not-italic"> — {s.hint}</span>
                                  )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>

                      {/* Pursue button for the active directive */}
                      {active && !done && (
                        <button
                          type="button"
                          onClick={() => pursue(d)}
                          className={`${ACTION_BTN} border-cyan-500/50 text-cyan-300 hover:bg-cyan-950/40`}
                        >
                          PURSUE <ArrowRight className="w-3 h-3" aria-hidden />
                        </button>
                      )}

                      {/* Recovered intel — the payoff */}
                      {done && (
                        <div className="p-3 rounded border border-emerald-800/50 bg-emerald-950/20 space-y-1">
                          <p className="text-[9px] tracking-[0.35em] font-bold text-emerald-400 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" aria-hidden /> FIELD INTEL RECOVERED —{' '}
                            {d.intel.title}
                          </p>
                          <p className="text-[11px] leading-relaxed text-slate-300">{d.intel.text}</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>
      ))}

      {/* How it works */}
      <div className="p-4 rounded-lg border border-line bg-panel text-[11px] text-slate-400 space-y-1.5">
        <p className="text-slate-200 font-bold tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" aria-hidden /> HOW DIRECTIVES WORK
        </p>
        <p>
          • Steps complete themselves the moment you do the thing — open the record, visit the section, break
          the seal. Nothing to submit, nothing to bookkeep.
        </p>
        <p>
          • Chapters unlock in order, directives within a chapter unlock in order: there is always exactly one
          current objective. If you are ever lost, pursue it.
        </p>
        <p>
          • Every directive pays FIELD INTEL on completion — the connective tissue of the case. Stuck on a
          seal? The Sanctum&apos;s three-tier hints still apply; directives never gate them.
        </p>
        <p className="flex items-center gap-1.5 pt-1">
          <FileText className="w-3.5 h-3.5" aria-hidden />
          Seals and clearance:{' '}
          <Link to={pathForTab('sanctum')} className="text-fuchsia-300 underline cursor-pointer">
            the case file
          </Link>
          . Progress is saved in this browser.
        </p>
      </div>
    </ArchivePage>
  );
}
