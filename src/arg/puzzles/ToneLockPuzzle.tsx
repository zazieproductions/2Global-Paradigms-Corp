import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { matchesDigest } from '../cipher';
import { DIGESTS } from '../seals';
import { gpcAudio } from '../../lib/audioEngine';

// SEAL IV — THE THREE VOICES. A frequency lock tuned by ear and by research.

interface Dial {
  key: 'earth' | 'evening' | 'child';
  title: string;
  latin: string;
  catechism: string;
  min: number;
  max: number;
  step: number;
  glyph: string;
}

const DIALS: Dial[] = [
  { key: 'earth', title: 'VOX TERRAE', latin: 'Voice of the Earth', catechism: 'heard beneath Cambridge', min: 0.1, max: 30, step: 0.1, glyph: '♁' },
  { key: 'evening', title: 'VOX VESPERI', latin: 'Voice of Evening', catechism: 'heard by the cities at six', min: 100, max: 1000, step: 1, glyph: '☾' },
  { key: 'child', title: 'VOX INFANTIS', latin: 'Voice of the Child', catechism: 'rung in every school bell', min: 100, max: 1500, step: 1, glyph: '🜚' }
];

export const ToneLockPuzzle: React.FC<{ solved: boolean; accent: string; onSolve: () => void }> = ({
  solved,
  accent,
  onSolve
}) => {
  const [vals, setVals] = useState<Record<Dial['key'], number>>(
    solved ? { earth: 14.8, evening: 432, child: 741 } : { earth: 7.8, evening: 440, child: 528 }
  );
  const [failed, setFailed] = useState(0);

  const sound = (d: Dial) => {
    const v = vals[d.key];
    if (d.key === 'earth') {
      // infrasound is inaudible: render it as a trembling 55 Hz drone modulated at the dial's rate
      gpcAudio.playInvocation([55, 110], v, 2.4);
    } else {
      gpcAudio.playTone(v, 1.6, 'sine', 0.16);
    }
  };

  const attune = () => {
    const key = `${vals.earth.toFixed(1)}|${Math.round(vals.evening)}|${Math.round(vals.child)}`;
    if (matchesDigest(key, DIGESTS.seal4)) {
      gpcAudio.playInvocation([vals.evening, vals.child, vals.evening * 1.5], vals.earth, 6);
      setTimeout(() => {
        gpcAudio.playSealBreak();
        onSolve();
      }, 1800);
    } else {
      gpcAudio.playUiSound('deny');
      setFailed((n) => n + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DIALS.map((d) => {
          const v = vals[d.key];
          const pct = ((v - d.min) / (d.max - d.min)) * 100;
          return (
            <div key={d.key} className="p-3 rounded border bg-black/50 space-y-2" style={{ borderColor: `${accent}44` }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-occult text-sm" style={{ color: accent }}>
                    {d.title}
                  </p>
                  <p className="text-[9px] text-slate-500 italic">
                    {d.latin} — {d.catechism}
                  </p>
                </div>
                <span className="text-2xl text-slate-600" style={{ fontFamily: "'Noto Sans Symbols', serif" }}>
                  {d.glyph}
                </span>
              </div>

              {/* dial face */}
              <div className="relative h-20 flex items-center justify-center">
                <svg viewBox="0 0 100 60" className="w-full h-full">
                  <path d="M10,55 A40,40 0 0,1 90,55" fill="none" stroke="#1e293b" strokeWidth="6" />
                  <path
                    d="M10,55 A40,40 0 0,1 90,55"
                    fill="none"
                    stroke={accent}
                    strokeWidth="6"
                    strokeDasharray={`${(pct / 100) * 125.6} 200`}
                    opacity={0.8}
                  />
                  {Array.from({ length: 13 }, (_, i) => {
                    const a = Math.PI + (i / 12) * Math.PI;
                    return (
                      <line
                        key={i}
                        x1={50 + Math.cos(a) * 32}
                        y1={55 + Math.sin(a) * 32}
                        x2={50 + Math.cos(a) * 36}
                        y2={55 + Math.sin(a) * 36}
                        stroke="#475569"
                        strokeWidth="0.8"
                      />
                    );
                  })}
                  <text x="50" y="52" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="monospace">
                    {d.step < 1 ? v.toFixed(1) : Math.round(v)}
                  </text>
                  <text x="50" y="59" textAnchor="middle" fill="#64748b" fontSize="5">
                    Hz
                  </text>
                </svg>
              </div>

              <input
                type="range"
                min={d.min}
                max={d.max}
                step={d.step}
                value={v}
                disabled={solved}
                onChange={(e) => setVals((p) => ({ ...p, [d.key]: parseFloat(e.target.value) }))}
                className="w-full accent-amber-400"
              />
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min={d.min}
                  max={d.max}
                  step={d.step}
                  value={d.step < 1 ? v.toFixed(1) : Math.round(v)}
                  disabled={solved}
                  onChange={(e) => {
                    const n = parseFloat(e.target.value);
                    if (!isNaN(n)) setVals((p) => ({ ...p, [d.key]: Math.max(d.min, Math.min(d.max, n)) }));
                  }}
                  className="flex-1 min-w-0 bg-black border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                />
                <button
                  onClick={() => sound(d)}
                  className="px-2 py-1 rounded border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white cursor-pointer"
                  title="Sound this voice"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!solved ? (
        <div key={failed} className={`flex items-center gap-3 ${failed ? 'ovp-shake' : ''}`}>
          <button
            onClick={attune}
            className="px-5 py-2 rounded font-occult font-bold text-xs tracking-[0.3em] text-black cursor-pointer"
            style={{ background: accent }}
          >
            SOUND THE THREE TOGETHER
          </button>
          {failed > 0 && (
            <span className="text-[10px] text-rose-400 font-bold">DISSONANCE. THE GOLD SEAL STAYS COLD. ({failed})</span>
          )}
        </div>
      ) : (
        <p className="text-[11px] font-occult tracking-widest" style={{ color: accent }}>
          HARMONIA TRIPLEX — 14.8 · 432 · 741
        </p>
      )}
    </div>
  );
};
