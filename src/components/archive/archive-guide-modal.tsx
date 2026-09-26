import { useState } from 'react';
import { CheckCircle2, Circle, HelpCircle, Key, RotateCcw, Tv, Volume2, VolumeX } from 'lucide-react';
import { DOCUMENTS, PUZZLES } from '@/content';
import { FICTION_NOTICE } from '@/config/site';
import { FEATURES } from '@/config/features';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useProgression } from '@/hooks/use-progression';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils/cn';
import { OrderSigil } from '@/components/ui/sigils';

interface ArchiveGuideModalProps {
  open: boolean;
  onClose: () => void;
  onOpenSafe: () => void;
  onOpenSanctum?: () => void;
}

const Kbd = ({ children }: { children: string }) => (
  <kbd className="px-1 py-px bg-slate-800 rounded border border-slate-700 text-slate-300">{children}</kbd>
);

const Code = ({ children }: { children: string }) => <code className="text-cyan-300">{children}</code>;

/** Help, operator settings, investigation progress and reset — plus the out-of-world notice. */
export function ArchiveGuideModal({ open, onClose, onOpenSafe, onOpenSanctum }: ArchiveGuideModalProps) {
  const p = useProgression();
  const { crt, sound } = p.state.preferences;
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="GLOBAL PARADIGMS CORP. // ARCHIVE INVESTIGATION GUIDE"
      icon={HelpCircle}
      size="2xl"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded cursor-pointer transition-colors"
        >
          ENTER ARCHIVE
        </button>
      }
    >
      <div className="space-y-4 text-label leading-relaxed text-slate-300">
        <p>
          Welcome to the complete interactive web archive of{' '}
          <strong className="text-white">Global Paradigms Corporation (GPC)</strong>, an international
          strategic-forecasting, civic-continuity, and environmental-psychoacoustics consultancy operating
          from 1971 to 2026.
        </p>

        <p
          className="p-2.5 border border-amber-600/40 bg-amber-950/20 rounded text-caption text-amber-200"
          role="note"
        >
          <strong className="block mb-0.5">OUT OF STORY</strong>
          {FICTION_NOTICE.long}
        </p>

        <div className="flex gap-4 items-start">
          <span className="text-fuchsia-300 shrink-0 hidden sm:block" aria-hidden>
            <OrderSigil size={64} />
          </span>
          <p>
            On the surface: a corporation. Underneath: the{' '}
            <strong className="text-fuchsia-300">Ordo Vocis Profundae</strong>, an occult order that has
            steered the company around a 14.8 Hz signal under the Earth. A whistleblower,{' '}
            <strong className="text-white">Dr. Aris Thorne</strong>, has left you a trail.
          </p>
        </div>

        <section
          className="p-3 bg-fuchsia-950/20 border border-fuchsia-900/50 rounded space-y-1.5 text-caption"
          aria-labelledby="guide-how-to-play"
        >
          <h3 id="guide-how-to-play" className="text-fuchsia-300 font-bold tracking-wider">
            HOW TO PLAY — THE SEVEN SEALS
          </h3>
          <ol className="space-y-1 list-decimal list-inside">
            <li>
              Open <span className="text-white font-bold">The Seven Seals</span> (top of the sidebar). Each
              seal is one puzzle, with a clear objective.
            </li>
            <li>
              Answers are hidden across this archive: documents, dossiers, stations, audio transcripts,
              emails, even the public &ldquo;corporate&rdquo; pages. Every clue can be read as text.
            </li>
            <li>
              Breaking seals raises your <span className="text-amber-300">clearance</span>. Records above your
              clearance show as <span className="text-rose-300">SEALED</span> until earned.
            </li>
            <li>
              Each seal gives a <span className="text-white font-bold">Seal-Word</span>. Keep them — together
              they point to the final answer.
            </li>
            <li>
              Stuck? Every seal has 3 escalating hints (the last one gives the answer) and an assisted route.
              No penalty.
            </li>
            <li>Progress saves automatically in this browser only. You can purge it below.</li>
          </ol>
          {onOpenSanctum && (
            <button
              type="button"
              onClick={onOpenSanctum}
              className="mt-1 px-3 py-1 rounded border border-fuchsia-700 text-fuchsia-300 hover:bg-fuchsia-950/50 cursor-pointer font-bold"
            >
              GO TO THE SEVEN SEALS →
            </button>
          )}
        </section>

        <section className="p-3 bg-inset border border-line rounded space-y-1.5 text-caption">
          <h3 className="text-cyan-300 font-bold">YOUR INSTRUMENTS:</h3>
          <p>
            • <span className="text-white font-bold">Search</span> <Kbd>/</Kbd> or <Kbd>Ctrl K</Kbd> —
            full-text search across {DOCUMENTS.length} records, personnel, stations and programs.
          </p>
          <p>
            • <span className="text-white font-bold">Terminal</span> <Kbd>~</Kbd> — <Code>help</Code>,{' '}
            <Code>cat</Code>, <Code>seals</Code>, <Code>gematria</Code>, <Code>invoke</Code>,{' '}
            <Code>hint</Code>… and some commands it won&apos;t list.
          </p>
          <p>
            • <span className="text-white font-bold">Redaction De-Scrambler</span> <Kbd>U</Kbd> — lifts
            Palimpsest&apos;s black bars. Unlocks at Level 3.
          </p>
          <p>
            • <span className="text-white font-bold">Audio Lab</span> — procedural Web Audio captures and a
            live synthesizer. Nothing plays until you press play, and every capture has a full transcript.
          </p>
          <p>
            • <span className="text-white font-bold">Whistleblower Safe</span> (brass key, top bar) —
            Thorne&apos;s safe. You will learn the combination.
          </p>
          <p>
            • <span className="text-white font-bold">Cold Boot</span> — during the boot you can type on
            Channel 9. Try <Code>help</Code>. <Kbd>ESC</Kbd> or SKIP fast-forwards.
          </p>
          <p>
            • <span className="text-white font-bold">▸ Transmission</span> (top bar) — a guided beginner trail
            that opens the case: three easy keys (Vesper Sequence → The Signal → The Waveform) with field
            notes on every step. It cannot raise your clearance — only the seals can.
          </p>
          <p>
            • <span className="text-white font-bold">Employee Modules &amp; Careers:</span> interactive
            compliance quizzes with printable certificates, and (fictional) job applications.
          </p>
          <p>
            • <span className="text-white font-bold">Keyboard:</span> <Kbd>Esc</Kbd> closes the top-most
            window.
          </p>
          <p className="text-slate-500 italic">
            Look closely at the public pages. The Order signs its work faintly.
          </p>
        </section>

        {/* Operator console — mirrors top-bar toggles hidden on small screens */}
        <section className="p-3 bg-inset border border-line rounded space-y-2 text-caption">
          <h3 className="text-cyan-300 font-bold">OPERATOR CONSOLE:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              aria-pressed={crt}
              onClick={() => p.setPreference('crt', !crt)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded border',
                crt ? 'border-cyan-500 text-cyan-300 bg-cyan-950' : 'border-line-bright text-slate-300'
              )}
            >
              <Tv className="w-3.5 h-3.5" aria-hidden /> CRT SCANLINES: {crt ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              aria-pressed={sound}
              onClick={() => {
                p.setPreference('sound', !sound);
                gpcAudio.toggleSound(!sound);
              }}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded border',
                sound ? 'border-cyan-500 text-cyan-300 bg-cyan-950' : 'border-line-bright text-slate-300'
              )}
            >
              {sound ? (
                <Volume2 className="w-3.5 h-3.5" aria-hidden />
              ) : (
                <VolumeX className="w-3.5 h-3.5" aria-hidden />
              )}{' '}
              SOUND: {sound ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={onOpenSafe}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-amber-600/60 text-amber-300"
            >
              <Key className="w-3.5 h-3.5" aria-hidden /> OPEN WHISTLEBLOWER SAFE
            </button>
          </div>
        </section>

        {/* Progress */}
        <section
          className="p-3 bg-inset border border-line rounded space-y-2 text-caption"
          aria-labelledby="guide-progress"
        >
          <h3 id="guide-progress" className="text-cyan-300 font-bold">
            INVESTIGATION PROGRESS:
          </h3>
          <p className="text-slate-400">
            Records opened: <span className="text-white">{p.discoveredCount}</span> · Puzzles solved:{' '}
            <span className="text-white">
              {p.completedCount}/{PUZZLES.length}
            </span>
            {p.assistedCount > 0 && <> ({p.assistedCount} assisted)</>}
          </p>
          <ul className="space-y-1">
            {PUZZLES.map((pz) => {
              const c = p.state.completed[pz.id];
              return (
                <li key={pz.id} className="flex items-center gap-2">
                  {c ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" aria-hidden />
                  ) : (
                    <Circle className="w-3.5 h-3.5 text-slate-600" aria-hidden />
                  )}
                  <span className={c ? 'text-slate-200' : 'text-slate-500'}>{pz.title}</span>
                  <span className="sr-only">{c ? 'solved' : 'unsolved'}</span>
                  {c?.assisted && <span className="text-micro text-amber-400">ASSISTED</span>}
                </li>
              );
            })}
          </ul>
          <p className="text-slate-500">
            {FEATURES.persistProgress
              ? 'Progress is saved in this browser only (localStorage). Clearing site data or switching devices starts a fresh investigation.'
              : 'Progress persistence is disabled on this deployment; it resets when you reload.'}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => {
                  setConfirmReset(true);
                  setResetDone(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-rose-700/60 text-rose-300 hover:bg-rose-950/40"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden /> RESET / REPLAY INVESTIGATION
              </button>
            ) : (
              <>
                <span className="text-rose-300">Wipe clearance, discoveries and puzzle progress?</span>
                <button
                  type="button"
                  data-autofocus
                  onClick={() => {
                    p.reset(true);
                    setConfirmReset(false);
                    setResetDone(true);
                    gpcAudio.playUiSound('deny');
                  }}
                  className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold"
                >
                  CONFIRM RESET
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2.5 py-1 rounded border border-line-bright text-slate-300"
                >
                  CANCEL
                </button>
              </>
            )}
            <span aria-live="polite" className="text-emerald-400">
              {resetDone ? 'Investigation reset. Preferences kept.' : ''}
            </span>
          </div>
        </section>
      </div>
    </Modal>
  );
}
