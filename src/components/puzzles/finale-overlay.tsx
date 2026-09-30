import { useEffect, useRef, useState, type FC } from 'react';
import { Modal } from '@/components/ui/modal';
import { SEALS } from '@/content/puzzles/seals';
import { gpcAudio } from '@/lib/audio/audio-engine';

// ============================================================================
// THE COUNTER-RITE — the ending sequence, triggered by speaking the Name.
// A dialog: every line is also announced to screen readers, the sequence can
// be skipped at any time (button or Escape), and motion is stilled under
// prefers-reduced-motion. The rite is recorded only when the operator
// returns to the archive.
//
// It is staged as a readout, not a spectacle: the carrier falls, the seven
// seal-words are struck off one by one, and the voices come up underneath.
// ============================================================================

const RITE_MS = 16000;
const SILENCE_MS = 3500;

const SCRIPT: { at: number; text: string; tone?: 'voice' | 'sys' | 'naylor' }[] = [
  { at: 400, text: 'INVOCATION RECEIVED ON ALL 22 STATIONS', tone: 'sys' },
  { at: 1800, text: 'ORPHEUS.', tone: 'voice' },
  { at: 3400, text: '…who calls me by that name…', tone: 'voice' },
  {
    at: 5200,
    text: 'I sang for thirty-seven years. I thought if I stopped, it would stop listening.',
    tone: 'voice'
  },
  { at: 7600, text: 'I am turning around.', tone: 'voice' },
  { at: 9400, text: 'CARRIER PHASE INVERSION DETECTED — STATIONS 01–22', tone: 'sys' },
  { at: 11200, text: "Let him go, Operator. Don't look back.", tone: 'naylor' }
];

export const FinaleOverlay: FC<{ open: boolean; callsign: string; onComplete: () => void }> = ({
  open,
  callsign,
  onComplete
}) => (open ? <FinaleSequence callsign={callsign} onComplete={onComplete} /> : null);

const FinaleSequence: FC<{ callsign: string; onComplete: () => void }> = ({ callsign, onComplete }) => {
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<'rite' | 'silence' | 'epilogue'>('rite');
  const returnRef = useRef<HTMLButtonElement>(null);
  const breakPlayed = useRef(false);

  useEffect(() => {
    gpcAudio.stopAllArtifacts();
    gpcAudio.stopLiveSynth();
    gpcAudio.playCounterTone(12);
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const e = performance.now() - start;
      setElapsed(e);
      if (e > 13500 && !breakPlayed.current) {
        breakPlayed.current = true;
        gpcAudio.playSealBreak();
      }
      if (e < RITE_MS) raf = requestAnimationFrame(tick);
      else setPhase((p) => (p === 'rite' ? 'silence' : p));
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase === 'silence') {
      const id = setTimeout(() => setPhase('epilogue'), SILENCE_MS);
      return () => clearTimeout(id);
    }
    if (phase === 'epilogue') returnRef.current?.focus();
  }, [phase]);

  const skip = () => setPhase('epilogue');

  const t = Math.min(1, elapsed / 13000);
  const hz = Math.max(0, 14.802 * Math.pow(1 - t, 1.6));

  const spoken = SCRIPT.filter((l) => elapsed >= l.at);

  return (
    <Modal
      open
      onClose={phase === 'epilogue' ? onComplete : skip}
      title="The Counter-Rite"
      size="full"
      tone="order"
      hideTitleBar
      className="bg-black! border-0! rounded-none! relative items-center justify-center overflow-hidden"
      bodyClassName="flex flex-col items-center justify-center w-full h-full"
    >
      {/* Screen-reader transcript of the rite, one line at a time. */}
      <p className="sr-only" aria-live="polite">
        {phase === 'rite'
          ? spoken[spoken.length - 1]?.text
          : phase === 'silence'
            ? 'SILENTIUM. 0.000 Hz.'
            : ''}
      </p>
      {phase !== 'epilogue' && (
        <button
          type="button"
          onClick={skip}
          className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded border border-slate-700 text-caption text-slate-400 hover:text-white hover:border-slate-500 cursor-pointer"
        >
          SKIP TO EPILOGUE
        </button>
      )}

      {phase === 'rite' && (
        <div className="w-full max-w-3xl px-6 flex flex-col items-center text-center">
          <div>
            <p className="text-[10px] tracking-[0.4em] text-slate-500">PLANETARY CARRIER</p>
            <p className="text-5xl font-bold tabular-nums text-cyan-300">
              {hz.toFixed(3)} <span className="text-xl">Hz</span>
            </p>
          </div>

          {/* The register of seals, struck off as the carrier falls. */}
          <ol className="mt-7 w-full max-w-sm space-y-1" aria-hidden>
            {SEALS.map((s, i) => {
              const struck = t > (i + 0.4) / 7;
              return (
                <li
                  key={s.id}
                  className="flex items-baseline gap-3 text-[11px] transition-opacity duration-500"
                  style={{ opacity: struck ? 0.4 : 1 }}
                >
                  <span className="w-6 text-left text-slate-600 font-order">{s.numeral}</span>
                  <span className="w-16 text-left text-slate-500">{s.planet}</span>
                  <span className="flex-1 self-center border-b border-dotted border-slate-800" />
                  <span
                    className={`font-order tracking-[0.15em] ${
                      struck ? 'text-slate-600 line-through' : 'text-slate-300'
                    }`}
                  >
                    {s.sealWord}
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 h-28 w-full space-y-1.5" aria-hidden>
            {spoken.slice(-3).map((l) => (
              <p
                key={l.at}
                className={`ovp-revelation ${
                  l.tone === 'voice'
                    ? 'text-base text-slate-100'
                    : l.tone === 'naylor'
                      ? 'text-sm text-fuchsia-300'
                      : 'text-[10px] tracking-[0.3em] text-amber-400'
                }`}
              >
                {l.tone === 'naylor' ? `— ${l.text} — E.N.` : l.text}
              </p>
            ))}
          </div>
        </div>
      )}

      {phase === 'silence' && (
        <div className="relative text-center ovp-revelation">
          <p className="font-order text-5xl md:text-7xl font-bold text-slate-100 tracking-[0.14em]">
            SILENTIUM
          </p>
          <p className="mt-4 text-[11px] tracking-[0.5em] text-slate-500">0.000 Hz</p>
        </div>
      )}

      {phase === 'epilogue' && (
        <div className="relative max-w-2xl px-6 text-center space-y-5 ovp-revelation">
          <p className="font-order text-3xl font-bold text-slate-100">The Choir is silent.</p>
          <div className="text-[12px] text-slate-400 leading-relaxed space-y-3 text-left">
            <p>
              For the first time since April 1971, there is nothing under Cambridge. Twenty-two stations
              report a flat line. Project Monolith&apos;s deep beacon at 2,900 km has stopped transmitting. In
              a thousand subway stations at six o&apos;clock, nobody feels tired.
            </p>
            <p>
              The Order will say it was a sensor fault. Palimpsest will rewrite the week. But the repository
              at Postojna keeps everything, and now it keeps this too: the name of the operator who spoke the
              Name.
            </p>
            <p className="font-order text-center text-lg text-slate-200 pt-2">{callsign.toUpperCase()}</p>
            <p className="text-center text-[10px] tracking-[0.4em] text-slate-600">
              CASE CLOSED · SEVEN OF SEVEN SEALS BROKEN
            </p>
          </div>
          <p className="text-[10px] text-slate-600 italic">
            The archive stays open. Some say that if you listen long enough at Station 07, you can hear
            something humming a new tune.
          </p>
          <button
            ref={returnRef}
            type="button"
            onClick={onComplete}
            className="px-6 py-2.5 rounded border border-slate-500 text-slate-200 hover:bg-white hover:text-black font-order font-bold tracking-[0.14em] text-xs cursor-pointer transition-colors"
          >
            RETURN TO THE ARCHIVE
          </button>
        </div>
      )}
    </Modal>
  );
};
