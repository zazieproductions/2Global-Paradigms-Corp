import { useEffect, useRef, useState, type FC } from 'react';
import { OrderSigil, SealEmblem } from '@/components/ui/sigils';
import { Modal } from '@/components/ui/modal';
import { SEALS } from '@/content/puzzles/seals';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { gpcAudio } from '@/lib/audio/audio-engine';

// ============================================================================
// THE COUNTER-RITE — the ending sequence, triggered by speaking the Name.
// A dialog: every line is also announced to screen readers, the sequence can
// be skipped at any time (button or Escape), and motion is stilled under
// prefers-reduced-motion. The rite is recorded only when the operator
// returns to the archive.
// ============================================================================

const RITE_MS = 16000;
const SILENCE_MS = 3500;

const SCRIPT: { at: number; text: string; tone?: 'voice' | 'sys' | 'thorne' }[] = [
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
  { at: 11200, text: "Let him go, Operator. Don't look back.", tone: 'thorne' }
];

export const FinaleOverlay: FC<{ open: boolean; callsign: string; onComplete: () => void }> = ({
  open,
  callsign,
  onComplete
}) => (open ? <FinaleSequence callsign={callsign} onComplete={onComplete} /> : null);

const FinaleSequence: FC<{ callsign: string; onComplete: () => void }> = ({ callsign, onComplete }) => {
  const reduced = useReducedMotion();
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
  const shattering = elapsed > 12500;

  const spoken = SCRIPT.filter((l) => elapsed >= l.at);

  return (
    <Modal
      open
      onClose={phase === 'epilogue' ? onComplete : skip}
      title="The Counter-Rite"
      size="full"
      tone="order"
      hideTitleBar
      className={`bg-black! border-0! rounded-none! relative items-center justify-center overflow-hidden ${
        !reduced && elapsed > 9300 && elapsed < 10500 ? 'ovp-invert-pulse' : ''
      }`}
      bodyClassName="flex flex-col items-center justify-center w-full h-full"
    >
      <div className="absolute inset-0 ovp-vignette" aria-hidden />
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
        <>
          {/* the seven seals orbit and collapse inward */}
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
            {SEALS.map((s, i) => {
              const a = (i / 7) * Math.PI * 2 + (reduced ? 0 : elapsed / 2200);
              const r = 240 * (1 - t * 0.85);
              return (
                <div
                  key={s.id}
                  className="absolute transition-opacity"
                  style={{
                    transform: `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px)`,
                    opacity: shattering ? 0 : 0.9
                  }}
                >
                  <SealEmblem
                    numeral={s.numeral}
                    glyph={s.glyph}
                    subtitle={s.subtitle}
                    accent={s.accent}
                    state="broken"
                    size={62}
                  />
                </div>
              );
            })}
          </div>

          <div
            className={`relative text-fuchsia-300 ${shattering ? 'ovp-shatter' : ''}`}
            style={reduced ? undefined : { transform: `rotate(${elapsed / 30}deg)` }}
            aria-hidden
          >
            <OrderSigil size={260} showText strokeWidth={0.9} />
          </div>

          <div className="relative mt-8 text-center">
            <p className="text-[10px] tracking-[0.5em] text-slate-500">PLANETARY CARRIER</p>
            <p
              className="text-5xl font-bold tabular-nums text-cyan-300"
              style={{ textShadow: '0 0 30px rgba(34,211,238,0.6)' }}
              aria-hidden
            >
              {hz.toFixed(3)} <span className="text-xl">Hz</span>
            </p>
          </div>

          <div className="relative mt-6 h-28 w-full max-w-xl text-center space-y-1.5" aria-hidden>
            {spoken.slice(-3).map((l) => (
              <p
                key={l.at}
                className={`ovp-revelation ${
                  l.tone === 'voice'
                    ? 'font-occult text-lg text-slate-100 italic'
                    : l.tone === 'thorne'
                      ? 'text-sm text-fuchsia-300'
                      : 'text-[10px] tracking-[0.3em] text-amber-400'
                }`}
              >
                {l.tone === 'thorne' ? `— ${l.text} — E.T.` : l.text}
              </p>
            ))}
          </div>
        </>
      )}

      {phase === 'silence' && (
        <div className="relative text-center ovp-revelation">
          <p className="font-occult text-6xl md:text-8xl text-slate-100 tracking-[0.3em]">SILENTIUM</p>
          <p className="mt-4 text-[11px] tracking-[0.5em] text-slate-500">0.000 Hz</p>
        </div>
      )}

      {phase === 'epilogue' && (
        <div className="relative max-w-2xl px-6 text-center space-y-5 ovp-revelation">
          <div className="mx-auto w-fit text-slate-300" aria-hidden>
            <OrderSigil size={70} color="var(--color-seal-moon)" />
          </div>
          <p className="font-occult text-3xl text-slate-100">The Choir is silent.</p>
          <div className="text-[12px] text-slate-400 leading-relaxed space-y-3 text-left">
            <p>
              For the first time since April 1971, there is nothing under Cambridge. Twenty-two stations
              report a flat line. Project Monolith's deep beacon at 2,900 km has stopped transmitting. In a
              thousand subway stations at six o'clock, nobody feels tired.
            </p>
            <p>
              The Order will say it was a sensor fault. Palimpsest will rewrite the week. But the reliquary at
              Postojna keeps everything exactly — and now it keeps this, too: the name of the operator who
              spoke the Name.
            </p>
            <p className="font-occult text-center text-lg text-slate-200 pt-2">{callsign.toUpperCase()}</p>
            <p className="text-center text-[10px] tracking-[0.4em] text-slate-600">
              CASE CLOSED · SEVEN OF SEVEN SEALS BROKEN
            </p>
          </div>
          <p className="text-[10px] text-slate-700 italic ovp-flicker">
            …the archive is still open. Some say that if you listen long enough at Station 07, you can hear
            something humming a new tune.
          </p>
          <button
            ref={returnRef}
            type="button"
            onClick={onComplete}
            className="px-6 py-2.5 rounded border border-slate-500 text-slate-200 hover:bg-white hover:text-black font-occult tracking-[0.3em] text-xs cursor-pointer transition-colors"
          >
            RETURN TO THE ARCHIVE
          </button>
        </div>
      )}
    </Modal>
  );
};
