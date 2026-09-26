import { useState } from 'react';
import { CheckCircle2, Circle, HelpCircle, Key, RotateCcw, Tv, Volume2, VolumeX } from 'lucide-react';
import { DOCUMENTS, PUZZLES } from '@/content';
import { FICTION_NOTICE } from '@/config/site';
import { FEATURES } from '@/config/features';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useProgression } from '@/hooks/use-progression';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils/cn';

interface ArchiveGuideModalProps {
  open: boolean;
  onClose: () => void;
  onOpenSafe: () => void;
}

const Kbd = ({ children }: { children: string }) => (
  <kbd className="px-1 py-px bg-slate-800 rounded border border-slate-700 text-slate-300">{children}</kbd>
);

/** Help, operator settings, investigation progress and reset — plus the out-of-world notice. */
export function ArchiveGuideModal({ open, onClose, onOpenSafe }: ArchiveGuideModalProps) {
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

        <section className="p-3 bg-inset border border-line rounded space-y-1.5 text-caption">
          <h3 className="text-cyan-300 font-bold">KEY FEATURES & ARG INVESTIGATION SECRETS:</h3>
          <p>
            • <span className="text-white font-bold">Cold Boot Terminal:</span> Every reload starts inside a
            live BIOS-style boot. Type hidden <span className="text-cyan-300">Channel 9</span> commands while
            it runs (<span className="text-cyan-300">help</span>,{' '}
            <span className="text-cyan-300">vesper</span>, <span className="text-cyan-300">thorne</span>,{' '}
            <span className="text-cyan-300">skip</span>) — executive codes grant Level 5 on session init.{' '}
            <Kbd>ESC</Kbd> or the SKIP button fast-forwards.
          </p>
          <p>
            • <span className="text-white font-bold">{DOCUMENTS.length} Unique Records:</span> Dossiers,
            meeting minutes, technical schematics, incident logs, and leaked memos.
          </p>
          <p>
            • <span className="text-white font-bold">Redaction De-Scrambler:</span> Toggle the top bar eye
            button (or press <Kbd>U</Kbd>) to decrypt and reveal hidden cleartext across all files.
          </p>
          <p>
            • <span className="text-white font-bold">Command Terminal Backdoor:</span> Click{' '}
            <span className="text-cyan-400">GPC://CLI</span> or press <Kbd>~</Kbd> to access command line
            tools (<span className="text-cyan-300">scan</span>,{' '}
            <span className="text-cyan-300">leak-dump</span>, <span className="text-cyan-300">override</span>,{' '}
            <span className="text-cyan-300">hint</span>).
          </p>
          <p>
            • <span className="text-white font-bold">Audio Lab & DSP Synthesizer:</span> Play procedural Web
            Audio captures of the 14.8Hz planetary carrier, Project Vesper chimes, and deep trench pulses.
            Nothing plays until you press play, and every recording has a full text transcript.
          </p>
          <p>
            • <span className="text-white font-bold">Whistleblower Safe:</span> Open the key icon in the top
            header and enter Dr. Thorne's 4-digit code to elevate clearance to Level 5.
          </p>
          <p>
            • <span className="text-white font-bold">Employee Modules & Careers:</span> Take interactive
            compliance quizzes with printable certificates or submit (fictional) job applications.
          </p>
          <p>
            • <span className="text-white font-bold">Keyboard:</span> <Kbd>/</Kbd> or <Kbd>Ctrl K</Kbd> search
            · <Kbd>~</Kbd> terminal · <Kbd>U</Kbd> de-scrambler · <Kbd>Esc</Kbd> closes the top-most window.
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
