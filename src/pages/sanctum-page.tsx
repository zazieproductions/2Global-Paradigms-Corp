/**
 * /sanctum — THE SEVEN SEALS case file. Narrative lives in
 * content/puzzles/seals.ts; validation and progress in the progression store.
 */
import { useState } from 'react';
import { ArrowRight, BookOpen, Lightbulb, Lock, RotateCcw, ScrollText, Radio, FileText } from 'lucide-react';
import { ORDER_GLOSS, ORDER_NAME, PROLOGUE_TRANSMISSION, SEALS, type SealId } from '@/content/puzzles/seals';
import { OrderPlate, PlanetGlyph, SealDisc } from '@/components/ui/order-marks';
import { polar, starPath } from '@/lib/utils/geometry';
import { MagicSquarePuzzle } from '@/components/puzzles/seals/magic-square-puzzle';
import { HeptagramPuzzle } from '@/components/puzzles/seals/heptagram-puzzle';
import { ChoirCipherPuzzle } from '@/components/puzzles/seals/choir-cipher-puzzle';
import { ToneLockPuzzle } from '@/components/puzzles/seals/tone-lock-puzzle';
import { MercuryWheelPuzzle } from '@/components/puzzles/seals/mercury-wheel-puzzle';
import { HymnPuzzle, NamePuzzle } from '@/components/puzzles/seals/simple-puzzles';
import { useArchiveUi } from '@/app/archive-ui-context';
import { useDescrambler, useInvestigation } from '@/hooks/use-investigation';
import { gpcAudio } from '@/lib/audio/audio-engine';

export default function SanctumPage() {
  const arg = useInvestigation();
  const ui = useArchiveUi();
  const { unredacted: isUnredacted, toggle: onToggleUnredacted } = useDescrambler();
  const onNavigateTab = ui.navigateToTab;
  const onOpenDocCode = (code: string) => ui.openDocument(code);
  const onOpenSafe = () => ui.openDialog({ type: 'safe' });
  const [selected, setSelected] = useState<SealId>(arg.currentSeal ?? 7);
  const [showPrologue, setShowPrologue] = useState(!arg.solved.length);
  const [confirmReset, setConfirmReset] = useState(false);

  const seal = SEALS.find((s) => s.id === selected)!;
  const solved = arg.isSolved(seal.id);
  const open = arg.isSealOpen(seal.id);
  const hintLevel = arg.hintsRevealed[seal.id] || 0;

  const onAttempt = (answer: string) => arg.attemptSeal(seal.id, answer).ok;

  const renderPuzzle = () => {
    switch (seal.id) {
      case 1:
        return <MagicSquarePuzzle solved={solved} accent={seal.accent} onAttempt={onAttempt} />;
      case 2:
        return <HeptagramPuzzle solved={solved} accent={seal.accent} onAttempt={onAttempt} />;
      case 3:
        return (
          <ChoirCipherPuzzle
            solved={solved}
            accent={seal.accent}
            onAttempt={onAttempt}
            onNavigateTab={onNavigateTab}
            hintLevel={hintLevel}
          />
        );
      case 4:
        return <ToneLockPuzzle solved={solved} accent={seal.accent} onAttempt={onAttempt} />;
      case 5:
        return (
          <HymnPuzzle
            solved={solved}
            accent={seal.accent}
            onAttempt={onAttempt}
            onOpenDoc={onOpenDocCode}
            isUnredacted={isUnredacted}
            descramblerUnlocked={arg.descramblerUnlocked}
            onToggleUnredacted={onToggleUnredacted}
          />
        );
      case 6:
        return <MercuryWheelPuzzle solved={solved} accent={seal.accent} onOpenSafe={onOpenSafe} />;
      case 7:
        return (
          <NamePuzzle
            solved={solved}
            accent={seal.accent}
            solvedIds={arg.solved}
            onAttempt={(name) => {
              if (!arg.attemptSeal(7, name).ok) return false;
              gpcAudio.playUiSound('alarm');
              ui.openDialog({ type: 'finale' });
              return true;
            }}
          />
        );
    }
  };

  // --- the seal index plate (seven discs on the week-order figure) ----------
  const W = 340;
  const C = W / 2;
  // 118 leaves room for the planet caption printed under each disc.
  const R = 118;

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin relative">
      <div className="relative p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* ------------------------------------------------------------ HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-fuchsia-900/40 pb-4">
          <div className="flex items-center gap-4">
            <OrderPlate size={64} />
            <div>
              <p className="text-[10px] tracking-[0.3em] text-fuchsia-400/80">CASE FILE · {ORDER_NAME}</p>
              <h1 className="font-order text-3xl md:text-4xl font-bold text-slate-100">The Seven Seals</h1>
              <p className="text-[11px] text-slate-500">
                {ORDER_GLOSS}. Seven files, in order. Each one opens more of the archive.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px]">
            <button
              type="button"
              aria-expanded={showPrologue}
              onClick={() => setShowPrologue((v) => !v)}
              className="tap-target flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded border border-fuchsia-800/60 text-fuchsia-300 hover:bg-fuchsia-950/40 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" /> {showPrologue ? 'HIDE' : 'RE-READ'} NAYLOR&apos;S DEAD-DROP
            </button>
            <div className="px-3 py-1.5 rounded border border-slate-800 text-slate-400">
              SEALS BROKEN: <span className="text-fuchsia-300 font-bold">{arg.solved.length}/7</span>
            </div>
            <div className="px-3 py-1.5 rounded border border-slate-800 text-slate-400">
              EARNED CLEARANCE: <span className="text-amber-300 font-bold">LEVEL {arg.earnedLevel}</span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ PROLOGUE */}
        {showPrologue && (
          <div className="relative p-5 rounded border border-fuchsia-900/50 bg-black/60 ovp-revelation">
            <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] text-fuchsia-400 mb-3">
              INTERCEPTED DEAD-DROP · SENDER: E. NAYLOR · ROUTED VIA WAYBACK MIRROR 1998 · INTEGRITY: PARTIAL
            </div>
            <p className="whitespace-pre-line text-[12px] leading-relaxed text-slate-300 max-w-3xl">
              {PROLOGUE_TRANSMISSION}
            </p>
            <div className="mt-4 p-3 rounded bg-black/50 border border-slate-800 text-[11px] text-slate-400 max-w-3xl space-y-1">
              <p className="text-slate-200 font-bold tracking-wider">HOW THIS INVESTIGATION WORKS</p>
              <p>
                • Each seal below is a puzzle. Its answer is hidden somewhere in this archive: documents,
                dossiers, stations, audio, the public pages.
              </p>
              <p>
                • Breaking a seal raises your clearance. Records above your clearance appear{' '}
                <span className="text-rose-300">SEALED</span> until you earn them.
              </p>
              <p>
                • Stuck? Each seal has three hints, from a nudge to the full answer. There is no penalty for
                using them.
              </p>
              <p>
                • Your progress is saved in this browser. Tools you&apos;ll use: Search (
                <kbd className="px-1 bg-slate-800 rounded">/</kbd>), Terminal (
                <kbd className="px-1 bg-slate-800 rounded">~</kbd>), De-Scrambler (
                <kbd className="px-1 bg-slate-800 rounded">U</kbd>, from Level 3).
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
          {/* ---------------------------------------------------------- LEFT: PLATE */}
          <div className="space-y-4">
            <div
              className="relative mx-auto origin-top scale-[0.85] sm:scale-100"
              style={{ width: W, height: W }}
              role="group"
              aria-label="The seven seals"
            >
              <svg width={W} height={W} className="absolute inset-0" aria-hidden>
                <circle cx={C} cy={C} r={R + 36} fill="none" stroke="#383146" strokeOpacity={0.6} />
                <circle
                  cx={C}
                  cy={C}
                  r={R - 36}
                  fill="none"
                  stroke="#383146"
                  strokeOpacity={0.4}
                  strokeDasharray="2 5"
                />
                <path d={starPath(C, C, R, 7, 3)} fill="none" stroke="#4a415a" strokeOpacity={0.3} />
                {/* light the lines between broken seals in week order */}
                {SEALS.map((s, i) => {
                  if (!arg.isSolved(s.id) || i === 0) return null;
                  const [x1, y1] = polar(C, C, R, i - 1, 7);
                  const [x2, y2] = polar(C, C, R, i, 7);
                  return (
                    <line
                      key={s.id}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={s.accent}
                      strokeOpacity={0.5}
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[9px] tracking-[0.3em] text-slate-600">BROKEN</p>
                <p className="font-order text-4xl font-bold tabular-nums text-slate-200">
                  {arg.solved.length}
                  <span className="text-slate-600 text-2xl">/7</span>
                </p>
              </div>
              {SEALS.map((s, i) => {
                const [x, y] = polar(C, C, R, i, 7);
                const st = arg.isSolved(s.id) ? 'broken' : arg.isSealOpen(s.id) ? 'open' : 'sealed';
                const isSel = s.id === selected;
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Seal ${s.numeral} — ${s.title} (${st === 'broken' ? 'broken' : st === 'open' ? 'active' : 'still closed'})`}
                    aria-pressed={isSel}
                    onClick={() => {
                      gpcAudio.playTone(180 + i * 40, 0.5, 'sine', 0.08);
                      setSelected(s.id);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer"
                    style={{ left: x, top: y }}
                    title={`Seal ${s.numeral} — ${s.title}`}
                  >
                    <span className={`transition-transform ${isSel ? 'scale-110' : 'hover:scale-105'}`}>
                      <SealDisc numeral={s.numeral} state={st} accent={s.accent} size={isSel ? 66 : 58} />
                    </span>
                    <span
                      className="text-[9px] tracking-[0.18em]"
                      style={{ color: st === 'sealed' ? '#5b6478' : s.accent }}
                    >
                      {s.planet.toUpperCase()}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Seal-Words */}
            <div className="p-3 rounded border border-slate-800 bg-black/40">
              <p className="text-[9px] tracking-[0.3em] text-slate-500 mb-2">SEAL-WORDS RECOVERED</p>
              <div className="grid grid-cols-2 gap-1.5">
                {SEALS.map((s) => {
                  const have = arg.isSolved(s.id);
                  return (
                    <div key={s.id} className="flex items-center gap-2 text-[11px]">
                      <PlanetGlyph
                        glyph={s.glyph}
                        className="w-4 text-center"
                        style={{ color: have ? s.accent : '#334155' }}
                      />
                      <span
                        className={`font-order tracking-[0.12em] ${have ? 'text-slate-200' : 'text-slate-700'}`}
                      >
                        {have ? s.sealWord : '· · · · ·'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Journal */}
            <div className="p-3 rounded border border-slate-800 bg-black/40">
              <p className="text-[9px] tracking-[0.3em] text-slate-500 mb-2 flex items-center gap-1.5">
                <ScrollText className="w-3 h-3" /> INVESTIGATOR&apos;S JOURNAL
              </p>
              <div
                className="max-h-48 overflow-y-auto scrollbar-thin space-y-1.5 pr-1"
                tabIndex={0}
                aria-label="Investigator's journal, newest first"
              >
                {arg.journal.length === 0 && (
                  <p className="text-[10px] text-slate-600 italic">Nothing recorded yet.</p>
                )}
                {[...arg.journal].reverse().map((j, i) => (
                  <div key={`${j.t}-${i}`} className="text-[10px] leading-snug">
                    <span className="text-slate-600">{j.t.slice(0, 16).replace('T', ' ')} </span>
                    <span
                      className={
                        j.kind === 'seal'
                          ? 'text-fuchsia-300'
                          : j.kind === 'fragment'
                            ? 'text-rose-300'
                            : j.kind === 'finale'
                              ? 'text-white font-bold'
                              : 'text-slate-400'
                      }
                    >
                      {j.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end text-[10px]">
              {!confirmReset ? (
                <button
                  type="button"
                  onClick={() => setConfirmReset(true)}
                  className="flex items-center gap-1 text-slate-600 hover:text-rose-400 cursor-pointer"
                  title="Close all seven seals again. Discovered files and preferences are kept."
                >
                  <RotateCcw className="w-3 h-3" aria-hidden /> purge case
                </button>
              ) : (
                <span className="flex gap-2" role="group" aria-label="Confirm purge">
                  <button
                    type="button"
                    autoFocus
                    onClick={() => {
                      arg.purgeCase();
                      setConfirmReset(false);
                      setSelected(1);
                    }}
                    className="text-rose-400 font-bold cursor-pointer"
                  >
                    confirm purge
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="text-slate-500 cursor-pointer"
                  >
                    cancel
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* ---------------------------------------------------------- RIGHT: SEAL */}
          <div className="rounded-lg border border-line-strong bg-black/60 overflow-hidden">
            {/* seal header */}
            <div className="flex items-center gap-4 p-4 border-b border-line-subtle">
              <SealDisc
                numeral={seal.numeral}
                state={solved ? 'broken' : open ? 'open' : 'sealed'}
                accent={seal.accent}
                size={56}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-[0.25em]" style={{ color: seal.accent }}>
                  SEAL {seal.numeral} · {seal.planet.toUpperCase()} · {seal.metal.toUpperCase()} ·{' '}
                  {seal.day.toUpperCase()}
                </p>
                <h2 className="font-order text-2xl font-bold text-slate-100">{seal.title}</h2>
                <p className="text-[11px] text-slate-500">{seal.subtitle}</p>
              </div>
              <div className="text-right text-[10px] hidden md:block">
                {solved ? (
                  <span
                    className="px-2 py-1 rounded border"
                    style={{ color: seal.accent, borderColor: seal.accent }}
                  >
                    BROKEN{arg.isAssisted(seal.id) ? ' · ASSISTED' : ''}
                  </span>
                ) : open ? (
                  <span className="px-2 py-1 rounded border border-amber-600 text-amber-300">ACTIVE</span>
                ) : (
                  <span className="px-2 py-1 rounded border border-slate-700 text-slate-500">CLOSED</span>
                )}
              </div>
            </div>

            {!open ? (
              <div className="p-10 text-center space-y-3">
                <Lock className="w-8 h-8 mx-auto text-slate-600" />
                <p className="font-order text-lg font-bold text-slate-400">
                  Seal {seal.numeral} is still closed.
                </p>
                <p className="text-[11px] text-slate-500">
                  Break Seal {SEALS[seal.id - 2]?.numeral} — <em>{SEALS[seal.id - 2]?.title}</em> — first.
                </p>
                <button
                  type="button"
                  onClick={() => arg.currentSeal && setSelected(arg.currentSeal)}
                  className="text-[11px] text-fuchsia-300 underline cursor-pointer"
                >
                  go to the active seal
                </button>
              </div>
            ) : (
              <div className="p-4 md:p-5 space-y-5">
                {/* transmission */}
                <div className="relative pl-4 border-l-2" style={{ borderColor: `${seal.accent}88` }}>
                  <p className="text-[9px] tracking-[0.3em] text-slate-500 mb-1.5">
                    TRANSMISSION · E. NAYLOR
                  </p>
                  <p className="whitespace-pre-line text-[12px] leading-relaxed text-slate-300">
                    {seal.transmission}
                  </p>
                </div>

                {/* objective */}
                <div className="p-3 rounded bg-white/[0.03] border border-slate-800">
                  <p className="text-[9px] tracking-[0.3em] text-slate-400 mb-1 font-bold">YOUR OBJECTIVE</p>
                  <p className="text-[12px] text-slate-200">{seal.objective}</p>
                  {!solved && seal.rewardText && (
                    <p className="text-[10px] text-slate-500 mt-1.5">
                      Reward: <span className="text-amber-300/90">{seal.rewardText}</span>
                    </p>
                  )}
                </div>

                {/* the puzzle */}
                <div className="py-2">{renderPuzzle()}</div>

                {/* revelation */}
                {solved && (
                  <div className="p-4 rounded border border-line-strong bg-white/[0.02] ovp-revelation">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] tracking-[0.3em] font-bold" style={{ color: seal.accent }}>
                        AFTERWORD
                      </p>
                      <p className="font-order text-sm tracking-[0.15em]" style={{ color: seal.accent }}>
                        SEAL-WORD: {seal.sealWord}
                      </p>
                    </div>
                    <p className="whitespace-pre-line text-[12px] leading-relaxed text-slate-200">
                      {seal.revelation}
                    </p>
                    <p className="text-[10px] italic text-slate-500 mt-2">
                      {seal.sealWord} — {seal.sealWordGloss}
                    </p>
                    {seal.id < 7 && (
                      <button
                        type="button"
                        onClick={() => setSelected((seal.id + 1) as SealId)}
                        className="mt-3 flex items-center gap-1.5 text-[11px] font-bold cursor-pointer"
                        style={{ color: SEALS[seal.id].accent }}
                      >
                        PROCEED TO SEAL {SEALS[seal.id].numeral} <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* pointers */}
                <div className="flex flex-wrap gap-2">
                  {seal.pointers.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => (p.docCode ? onOpenDocCode(p.docCode) : p.tab && onNavigateTab(p.tab))}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-slate-800 hover:border-slate-600 text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {p.docCode ? <FileText className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* hints */}
                {!solved && (
                  <div className="border-t border-slate-800 pt-3 space-y-2" aria-live="polite">
                    {seal.hints.slice(0, hintLevel).map((h, i) => (
                      <div key={i} className="flex gap-2 text-[11px] ovp-revelation">
                        <span className="text-amber-400 font-bold shrink-0">{['I.', 'II.', 'III.'][i]}</span>
                        <span className={i === 2 ? 'text-amber-200' : 'text-slate-300'}>{h}</span>
                      </div>
                    ))}
                    {hintLevel < 3 && (
                      <button
                        type="button"
                        onClick={() => {
                          gpcAudio.playUiSound('unredact');
                          arg.revealHint(seal.id);
                        }}
                        className="flex items-center gap-1.5 text-[10px] text-amber-400/80 hover:text-amber-300 cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        {hintLevel === 0
                          ? 'Ask Naylor for a hint'
                          : hintLevel === 1
                            ? 'A stronger hint'
                            : 'Reveal the answer (marks this seal as assisted)'}
                        <span className="text-slate-600">({hintLevel}/3)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
