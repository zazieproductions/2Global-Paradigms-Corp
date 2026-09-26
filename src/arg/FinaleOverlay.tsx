import React, { useEffect, useState } from 'react';
import { OrderSigil, SealEmblem } from './sigils';
import { SEALS } from './seals';
import { gpcAudio } from '../lib/audioEngine';

// ============================================================================
// THE COUNTER-RITE — the ending sequence, triggered by speaking the Name.
// ============================================================================

const SCRIPT: { at: number; text: string; tone?: 'voice' | 'sys' | 'thorne' }[] = [
  { at: 400, text: 'INVOCATION RECEIVED ON ALL 22 STATIONS', tone: 'sys' },
  { at: 1800, text: 'ORPHEUS.', tone: 'voice' },
  { at: 3400, text: '…who calls me by that name…', tone: 'voice' },
  { at: 5200, text: 'I sang for thirty-seven years. I thought if I stopped, it would stop listening.', tone: 'voice' },
  { at: 7600, text: 'I am turning around.', tone: 'voice' },
  { at: 9400, text: 'CARRIER PHASE INVERSION DETECTED — STATIONS 01–22', tone: 'sys' },
  { at: 11200, text: 'Let him go, Operator. Don\'t look back.', tone: 'thorne' }
];

export const FinaleOverlay: React.FC<{ callsign: string; onComplete: () => void }> = ({ callsign, onComplete }) => {
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState<'rite' | 'silence' | 'epilogue'>('rite');

  useEffect(() => {
    gpcAudio.stopAllArtifacts();
    gpcAudio.stopLiveSynth();
    gpcAudio.playCounterTone(12);
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const e = performance.now() - start;
      setElapsed(e);
      if (e > 13500 && e < 13600) gpcAudio.playSealBreak();
      if (e < 16000) raf = requestAnimationFrame(tick);
      else setPhase('silence');
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase === 'silence') {
      const id = setTimeout(() => setPhase('epilogue'), 3500);
      return () => clearTimeout(id);
    }
  }, [phase]);

  const t = Math.min(1, elapsed / 13000);
  const hz = Math.max(0, 14.802 * Math.pow(1 - t, 1.6));
  const shattering = elapsed > 12500;

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono overflow-hidden ${
        elapsed > 9300 && elapsed < 10500 ? 'ovp-invert-pulse' : ''
      }`}
    >
      <div className="absolute inset-0 ovp-vignette" />

      {phase === 'rite' && (
        <>
          {/* the seven seals orbit and collapse inward */}
          <div className="absolute inset-0 flex items-center justify-center">
            {SEALS.map((s, i) => {
              const a = (i / 7) * Math.PI * 2 + elapsed / 2200;
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
                  <SealEmblem numeral={s.numeral} glyph={s.glyph} subtitle={s.subtitle} accent={s.accent} state="broken" size={62} />
                </div>
              );
            })}
          </div>

          <div className={`relative text-fuchsia-300 ${shattering ? 'ovp-shatter' : ''}`} style={{ transform: `rotate(${elapsed / 30}deg)` }}>
            <OrderSigil size={260} showText strokeWidth={0.9} />
          </div>

          <div className="relative mt-8 text-center">
            <p className="text-[10px] tracking-[0.5em] text-slate-500">PLANETARY CARRIER</p>
            <p className="text-5xl font-bold tabular-nums text-cyan-300" style={{ textShadow: '0 0 30px rgba(34,211,238,0.6)' }}>
              {hz.toFixed(3)} <span className="text-xl">Hz</span>
            </p>
          </div>

          <div className="relative mt-6 h-28 w-full max-w-xl text-center space-y-1.5">
            {SCRIPT.filter((l) => elapsed >= l.at)
              .slice(-3)
              .map((l) => (
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
                  {l.tone === 'thorne' ? `— ${l.text} — A.T.` : l.text}
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
          <div className="mx-auto w-fit text-slate-300">
            <OrderSigil size={70} color="#e2e8f0" />
          </div>
          <p className="font-occult text-3xl text-slate-100">The Choir is silent.</p>
          <div className="text-[12px] text-slate-400 leading-relaxed space-y-3 text-left">
            <p>
              For the first time since April 1971, there is nothing under Cambridge. Twenty-two stations report a flat line. Project
              Monolith's deep beacon at 2,900 km has stopped transmitting. In a thousand subway stations at six o'clock, nobody feels
              tired.
            </p>
            <p>
              The Order will say it was a sensor fault. Palimpsest will rewrite the week. But the reliquary at Postojna keeps
              everything exactly — and now it keeps this, too: the name of the operator who spoke the Name.
            </p>
            <p className="font-occult text-center text-lg text-slate-200 pt-2">{callsign.toUpperCase()}</p>
            <p className="text-center text-[10px] tracking-[0.4em] text-slate-600">CASE CLOSED · SEVEN OF SEVEN SEALS BROKEN</p>
          </div>
          <p className="text-[10px] text-slate-700 italic ovp-flicker">
            …the archive is still open. Some say that if you listen long enough at Station 07, you can hear something
            humming a new tune.
          </p>
          <button
            onClick={onComplete}
            className="px-6 py-2.5 rounded border border-slate-500 text-slate-200 hover:bg-white hover:text-black font-occult tracking-[0.3em] text-xs cursor-pointer transition-colors"
          >
            RETURN TO THE ARCHIVE
          </button>
        </div>
      )}
    </div>
  );
};
