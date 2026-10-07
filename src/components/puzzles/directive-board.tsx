/**
 * FIELD DIRECTIVES board — the case file's spine, rendered.
 *
 * Three things live here: the directive the operator is on (with its steps,
 * ticked automatically), the chapter run behind and ahead of it, and the
 * FIELD INTEL archive every closed directive has paid. The milestone ledger
 * itself is open to inspection at the bottom — it is the player's notebook,
 * written for them.
 *
 * Nothing in this component dispatches. Steps complete themselves from what
 * the operator does elsewhere in the archive (see lib/puzzles/directives.ts).
 */
import { useState, type ReactNode } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  ListChecks,
  ScrollText,
  Sparkles
} from 'lucide-react';
import type { ActiveTab } from '@/types';
import { useDirectives } from '@/hooks/use-directives';
import type { DirectiveStatus, MilestoneStatus } from '@/lib/puzzles/directives';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { cn } from '@/lib/utils/cn';

/** Renders `backticked` fragments as in-world code, everything else as text. */
function Inline({ text }: { text: string }): ReactNode {
  return (
    <>
      {text.split(/(`[^`]+`)/g).map((part, i) =>
        part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
          <code key={i} className="text-cyan-300 bg-cyan-950/40 px-1 rounded">
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function Step({ status, accent }: { status: MilestoneStatus; accent: string }) {
  const { def, done, at } = status;
  return (
    <li className="flex items-start gap-2 text-[11px] leading-snug">
      {done ? (
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-px" style={{ color: accent }} aria-hidden />
      ) : (
        <Circle className="w-3.5 h-3.5 shrink-0 mt-px text-slate-600" aria-hidden />
      )}
      <span className={done ? 'text-slate-300' : 'text-slate-400'}>
        <Inline text={def.label} />
        <span className="sr-only">{done ? ' — done' : ' — outstanding'}</span>
        {done && at && <span className="text-slate-600"> · {at.slice(0, 16).replace('T', ' ')}</span>}
        {!done && def.nudge && (
          <span className="block text-slate-500 italic">
            <Inline text={def.nudge} />
          </span>
        )}
      </span>
    </li>
  );
}

function DirectiveRow({
  status,
  accent,
  open,
  onToggle,
  isCurrent
}: {
  status: DirectiveStatus;
  accent: string;
  open: boolean;
  onToggle: () => void;
  isCurrent: boolean;
}) {
  const { def, complete, milestones } = status;
  const done = milestones.filter((m) => m.done).length;
  return (
    <li
      className={cn(
        'rounded border',
        complete ? 'border-emerald-900/40 bg-black/20' : 'border-line-strong bg-black/40',
        isCurrent && 'border-cyan-500/50 shadow-glow-sm shadow-cyan-500/10'
      )}
      aria-current={isCurrent ? 'step' : undefined}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer hover:bg-hover/60 rounded"
      >
        {open ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden />
        )}
        <span
          className="font-occult text-[11px] tracking-widest shrink-0"
          style={{ color: complete ? accent : isCurrent ? '#e2e8f0' : '#64748b' }}
        >
          {def.numeral}
        </span>
        <span
          className={cn(
            'text-[11px] tracking-wider flex-1 truncate',
            complete ? 'text-slate-300' : isCurrent ? 'text-cyan-200 font-bold' : 'text-slate-500'
          )}
        >
          {def.codename}
        </span>
        {complete ? (
          <span className="text-[9px] tracking-widest text-emerald-400 shrink-0">CLEARED</span>
        ) : (
          <span className="text-[9px] tracking-widest text-slate-500 shrink-0 tabular-nums">
            {done}/{milestones.length}
          </span>
        )}
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 border-t border-line/60 pt-2">
          <p className="text-[11px] text-slate-400 italic leading-relaxed">
            <Inline text={def.brief} />
          </p>
          <ul className="space-y-1">
            {milestones.map((m) => (
              <Step key={m.def.id} status={m} accent={accent} />
            ))}
          </ul>
          {complete && status.intel ? (
            <p className="text-[10px] text-cyan-300/80 tracking-wide">
              FIELD INTEL FILED — {status.intel.code}: {status.intel.title}
            </p>
          ) : (
            <p className="text-[10px] text-slate-500 tracking-wide">
              PAYS FIELD INTEL ON COMPLETION · JOURNAL LINE · NOTICE
            </p>
          )}
        </div>
      )}
    </li>
  );
}

interface DirectiveBoardProps {
  /** Jump to a section the operator has not walked yet. */
  onNavigateTab?: (tab: ActiveTab) => void;
}

/** The board, mounted in the case file (`/sanctum`). */
export function DirectiveBoard({ onNavigateTab }: DirectiveBoardProps) {
  const board = useDirectives();
  /** Rows the operator has collapsed; anything else open on the run follows the action. */
  const [collapsedRows, setCollapsedRows] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  /** 'auto' keeps the newest FIELD INTEL filing open as it is filed. */
  const [intelChoice, setIntelChoice] = useState<'auto' | 'none' | string>('auto');
  const [showLedger, setShowLedger] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const current = board.current;
  const rowIsOpen = (id: string) =>
    expandedRows.includes(id) || (id === current?.def.id && !collapsedRows.includes(id));
  const toggleRow = (id: string) => {
    if (rowIsOpen(id)) {
      setCollapsedRows((prev) => [...new Set([...prev, id])]);
      setExpandedRows((prev) => prev.filter((x) => x !== id));
    } else {
      setExpandedRows((prev) => [...new Set([...prev, id])]);
      setCollapsedRows((prev) => prev.filter((x) => x !== id));
    }
  };
  const openIntelId =
    intelChoice === 'auto' ? (board.lastIntel?.id ?? null) : intelChoice === 'none' ? null : intelChoice;
  const toggleIntel = (id: string) =>
    setIntelChoice((prev) => {
      const openId = prev === 'auto' ? (board.lastIntel?.id ?? null) : prev === 'none' ? null : prev;
      return openId === id ? 'none' : id;
    });
  const accent = board.currentChapter?.def.accent ?? '#22d3ee';
  const pct = board.stepsTotal ? Math.round((board.stepsDone / board.stepsTotal) * 100) : 0;

  return (
    <section
      className="rounded border border-cyan-900/40 bg-inset p-4 space-y-3"
      aria-labelledby="field-directives"
    >
      {/* ------------------------------------------------------------ HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-cyan-900/30 pb-3">
        <div>
          <p className="text-[10px] tracking-[0.35em] text-cyan-400/80 flex items-center gap-1.5">
            <ListChecks className="w-3.5 h-3.5" aria-hidden /> FIELD DIRECTIVES · THORNE'S RUN
          </p>
          <h2 id="field-directives" className="font-occult text-xl md:text-2xl text-slate-100">
            {current
              ? `Directive ${current.def.numeral} — ${current.def.codename}`
              : 'All directives cleared'}
          </h2>
          <p className="text-[11px] text-slate-500 italic">
            Steps tick themselves. Every directive pays FIELD INTEL — new material on the 15.000 Completion,
            the mirror, the Seventh Chamber.
          </p>
        </div>
        <div className="text-[10px] text-slate-400 space-y-1 shrink-0">
          <p>
            DIRECTIVES: <span className="text-cyan-300 font-bold">{board.completedDirectives}</span>/
            {board.totalDirectives} · STEPS:{' '}
            <span className="text-cyan-300 font-bold">{board.stepsDone}</span>/{board.stepsTotal} · INTEL
            FILED: <span className="text-cyan-300 font-bold">{board.intel.length}</span>
          </p>
          <div
            className="h-1.5 w-full md:w-64 rounded bg-slate-800 overflow-hidden"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={pct}
            aria-label="Field directives progress"
          >
            <div className="h-full bg-cyan-400/70" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------- CURRENT DIRECTIVE */}
      {current ? (
        <div
          className="rounded border p-3 bg-black/40 space-y-2"
          style={{ borderColor: `color-mix(in srgb, ${accent} 45%, transparent)` }}
        >
          <div className="flex items-center gap-2 text-[10px] tracking-[0.3em]" style={{ color: accent }}>
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: accent }}
              aria-hidden
            />
            CHAPTER {board.currentChapter?.def.numeral} · {board.currentChapter?.def.title} · ON YOU NOW
          </div>
          <p className="text-[12px] text-slate-300 italic leading-relaxed">
            &ldquo;
            <Inline text={current.def.brief} />
            &rdquo;
            <span className="not-italic text-slate-500"> — E.T.</span>
          </p>
          <ul className="space-y-1">
            {current.milestones.map((m) => (
              <Step key={m.def.id} status={m} accent={accent} />
            ))}
          </ul>
          {onNavigateTab && (
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  onNavigateTab('sanctum');
                }}
                className="tap-target px-2.5 py-1.5 rounded border border-cyan-700/60 text-cyan-300 hover:bg-cyan-950/40 text-[10px] tracking-wider cursor-pointer"
              >
                CASE FILE
              </button>
              <button
                type="button"
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  onNavigateTab('audio');
                }}
                className="tap-target px-2.5 py-1.5 rounded border border-line-bright text-slate-300 hover:bg-hover text-[10px] tracking-wider cursor-pointer"
              >
                ACOUSTIC LAB
              </button>
              <button
                type="button"
                onClick={() => {
                  gpcAudio.playUiSound('click');
                  onNavigateTab('timeline');
                }}
                className="tap-target px-2.5 py-1.5 rounded border border-line-bright text-slate-300 hover:bg-hover text-[10px] tracking-wider cursor-pointer"
              >
                TIMELINE
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded border border-emerald-800/50 bg-emerald-950/20 p-3 text-[11px] text-emerald-200">
          Every directive in the run is cleared and every FIELD INTEL filing is on the record. The case file
          stays open — re-read it any time.
        </div>
      )}

      {/* ------------------------------------------------------------ CHAPTERS */}
      <div className="space-y-2">
        {board.chapters.map((chapter) => {
          // A cleared chapter keeps its announcement and folds its run away
          // until the operator asks to see the archive.
          const showRun = !chapter.complete || showArchived;
          return (
            <div key={chapter.def.id} className="rounded border border-line/70 bg-black/20">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-line/60">
                <span
                  className="font-occult text-[11px] tracking-widest"
                  style={{ color: chapter.def.accent }}
                >
                  CHAPTER {chapter.def.numeral}
                </span>
                <span className="text-[11px] text-slate-300 tracking-wider flex-1 truncate">
                  {chapter.def.title}
                </span>
                {chapter.complete ? (
                  <span className="text-[9px] tracking-widest text-emerald-400">COMPLETE</span>
                ) : (
                  <span className="text-[9px] tracking-widest text-slate-500 tabular-nums">
                    {chapter.done}/{chapter.total}
                  </span>
                )}
              </div>
              <p className="px-3 pt-2 text-[10px] text-slate-500 italic">{chapter.def.subtitle}</p>
              {chapter.complete && (
                <p
                  className="px-3 pt-1.5 text-[10px] leading-snug"
                  style={{ color: `color-mix(in srgb, ${chapter.def.accent} 75%, white)` }}
                >
                  {chapter.def.closing}
                </p>
              )}
              {showRun && (
                <ul className="p-2 space-y-1.5">
                  {chapter.directives.map((d) => (
                    <DirectiveRow
                      key={d.def.id}
                      status={d}
                      accent={chapter.def.accent}
                      isCurrent={d.def.id === current?.def.id}
                      open={rowIsOpen(d.def.id)}
                      onToggle={() => {
                        gpcAudio.playUiSound('click');
                        toggleRow(d.def.id);
                      }}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => setShowArchived((v) => !v)}
          aria-expanded={!showArchived}
          className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer tracking-wider"
        >
          {showArchived ? 'HIDE CLEARED CHAPTERS' : 'SHOW CLEARED CHAPTERS'}
        </button>
      </div>

      {/* --------------------------------------------------------- FIELD INTEL */}
      <div className="space-y-2">
        <p className="text-[10px] tracking-[0.3em] text-cyan-400/80 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" aria-hidden /> FIELD INTEL RECOVERED · {board.intel.length}/
          {board.totalDirectives}
        </p>
        {board.intel.length === 0 ? (
          <p className="text-[11px] text-slate-500 italic">
            Nothing filed yet. Clear the first directive and the archive will hand you the first paragraph.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {[...board.intel].reverse().map((intel) => {
              const open = openIntelId === intel.id;
              return (
                <li key={intel.id} className="rounded border border-cyan-900/40 bg-black/30">
                  <button
                    type="button"
                    onClick={() => {
                      gpcAudio.playUiSound('click');
                      toggleIntel(intel.id);
                    }}
                    aria-expanded={open}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer hover:bg-hover/50 rounded"
                  >
                    {open ? (
                      <ChevronDown className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden />
                    )}
                    <span className="text-[9px] tracking-widest text-cyan-400/80 shrink-0 font-bold">
                      {intel.code}
                    </span>
                    <span className="text-[11px] text-slate-300 truncate">{intel.title}</span>
                  </button>
                  {open && (
                    <div className="px-3 pb-3 space-y-2 border-t border-cyan-900/30 pt-2">
                      {intel.paragraphs.map((p, i) => (
                        <p key={i} className="text-[11px] text-slate-300 leading-relaxed">
                          {p}
                        </p>
                      ))}
                      {intel.source && (
                        <p className="text-[10px] text-slate-500 tracking-wide">SOURCE: {intel.source}</p>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* -------------------------------------------------------------- LEDGER */}
      <div>
        <button
          type="button"
          onClick={() => {
            gpcAudio.playUiSound('click');
            setShowLedger((v) => !v);
          }}
          aria-expanded={showLedger}
          className="text-[10px] tracking-[0.3em] text-slate-500 hover:text-slate-300 cursor-pointer flex items-center gap-1.5"
        >
          <ScrollText className="w-3.5 h-3.5" aria-hidden /> MILESTONES LEDGER · {board.ledger.length} ENTRIES
          {showLedger ? (
            <ChevronDown className="w-3.5 h-3.5" aria-hidden />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" aria-hidden />
          )}
        </button>
        {showLedger && (
          <div className="mt-2 rounded border border-line/70 bg-black/30 max-h-56 overflow-y-auto scrollbar-thin">
            <table className="w-full text-[10px]">
              <caption className="sr-only">
                Observable steps recorded in the milestones ledger, newest first
              </caption>
              <thead className="text-slate-500 sticky top-0 bg-black/80">
                <tr>
                  <th scope="col" className="text-left font-normal px-2 py-1">
                    RECORDED
                  </th>
                  <th scope="col" className="text-left font-normal px-2 py-1">
                    STEP
                  </th>
                </tr>
              </thead>
              <tbody>
                {board.ledger.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-2 py-2 text-slate-600 italic">
                      Nothing recorded yet — the ledger fills itself as you work.
                    </td>
                  </tr>
                )}
                {board.ledger.map((row) => (
                  <tr key={row.id} className="border-t border-line/40">
                    <td className="px-2 py-1 text-slate-500 whitespace-nowrap tabular-nums">
                      {row.at.slice(0, 16).replace('T', ' ')}
                    </td>
                    <td className="px-2 py-1 text-slate-300">
                      {row.target ? <span className="text-slate-500">{row.target} · </span> : null}
                      {row.kind.toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
