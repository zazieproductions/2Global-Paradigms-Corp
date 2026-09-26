import React, { useState } from 'react';
import { polar, starPath, SYMBOL_FONT } from '../geometry';
import { matchesDigest } from '../cipher';
import { DIGESTS } from '../seals';
import { gpcAudio } from '../../lib/audioEngine';

// SEAL II — THE WHEEL OF DAYS.
// Seven planets placed clockwise in the Chaldean order (slowest → fastest).
// Walking the {7/3} heptagram from the Sun yields the days of the week — a
// genuine piece of Hellenistic astrology the Order adopted as its master sigil.

const VERTICES = [
  { glyph: '♄', planet: 'Saturn', metal: 'Lead', letter: 'Y', tone: 196.0 },
  { glyph: '♃', planet: 'Jupiter', metal: 'Tin', letter: 'R', tone: 220.0 },
  { glyph: '♂', planet: 'Mars', metal: 'Iron', letter: 'T', tone: 246.94 },
  { glyph: '☉', planet: 'Sun', metal: 'Gold', letter: 'L', tone: 261.63 },
  { glyph: '♀', planet: 'Venus', metal: 'Copper', letter: 'G', tone: 293.66 },
  { glyph: '☿', planet: 'Mercury', metal: 'Quicksilver', letter: 'U', tone: 329.63 },
  { glyph: '☽', planet: 'Moon', metal: 'Silver', letter: 'I', tone: 392.0 }
];
const SOLVED_PATH = [3, 6, 2, 5, 1, 4, 0];

const C = 150;
const R = 112;

export const HeptagramPuzzle: React.FC<{ solved: boolean; accent: string; onSolve: () => void }> = ({
  solved,
  accent,
  onSolve
}) => {
  const [path, setPath] = useState<number[]>(solved ? SOLVED_PATH : []);
  const [failed, setFailed] = useState(false);

  const click = (i: number) => {
    if (solved || failed || path.includes(i)) return;
    gpcAudio.playTone(VERTICES[i].tone, 1.1, 'sine', 0.14);
    const next = [...path, i];
    setPath(next);
    if (next.length === 7) {
      const word = next.map((v) => VERTICES[v].letter).join('');
      if (matchesDigest(word, DIGESTS.seal2)) {
        setTimeout(() => {
          gpcAudio.playSealBreak();
          onSolve();
        }, 500);
      } else {
        setFailed(true);
        gpcAudio.playUiSound('deny');
        setTimeout(() => {
          setPath([]);
          setFailed(false);
        }, 1400);
      }
    }
  };

  const pt = (i: number) => polar(C, C, R, i, 7);
  const word = path.map((v) => VERTICES[v].letter);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
      <div className={failed ? 'ovp-shake' : ''}>
        <svg width={300} height={300} viewBox="0 0 300 300" className="select-none">
          <circle cx={C} cy={C} r={R + 26} fill="none" stroke="#1e293b" strokeWidth={1} />
          <circle cx={C} cy={C} r={R} fill="none" stroke="#1e293b" strokeWidth={1} strokeDasharray="3 4" />
          {/* ghost of the true star, faint — visible only once solved */}
          <path d={starPath(C, C, R, 7, 3)} fill="none" stroke={accent} strokeOpacity={solved ? 0.5 : 0.04} strokeWidth={1} />
          {path.slice(1).map((v, k) => {
            const [x1, y1] = pt(path[k]);
            const [x2, y2] = pt(v);
            const len = Math.hypot(x2 - x1, y2 - y1);
            return (
              <line
                key={k}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={failed ? '#f43f5e' : accent}
                strokeWidth={2}
                className="ovp-draw"
                style={{ ['--len' as string]: len } as React.CSSProperties}
              />
            );
          })}
          {solved && (
            (() => {
              const [x1, y1] = pt(path[6]);
              const [x2, y2] = pt(path[0]);
              return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={accent} strokeWidth={2} strokeDasharray="4 3" />;
            })()
          )}
          {VERTICES.map((v, i) => {
            const [x, y] = pt(i);
            const [lx, ly] = polar(C, C, R + 26, i, 7);
            const idx = path.indexOf(i);
            const on = idx !== -1;
            return (
              <g key={i} onClick={() => click(i)} className={solved ? '' : 'cursor-pointer'}>
                <circle
                  cx={x}
                  cy={y}
                  r={17}
                  fill="#05070c"
                  stroke={on ? (failed ? '#f43f5e' : accent) : '#475569'}
                  strokeWidth={on ? 2 : 1}
                  style={{ filter: on ? `drop-shadow(0 0 6px ${accent})` : undefined }}
                />
                <text
                  x={x}
                  y={y + 7}
                  textAnchor="middle"
                  fontSize={20}
                  fill={on ? accent : '#cbd5e1'}
                  style={{ fontFamily: SYMBOL_FONT, pointerEvents: 'none' }}
                >
                  {v.glyph + '\uFE0E'}
                </text>
                <text
                  x={lx}
                  y={ly + 4}
                  textAnchor="middle"
                  fontSize={12}
                  fill={on ? accent : '#64748b'}
                  className="font-occult"
                  style={{ pointerEvents: 'none' }}
                >
                  {v.letter}
                </text>
                {on && !solved && (
                  <text x={x + 14} y={y - 12} fontSize={9} fill="#94a3b8" style={{ pointerEvents: 'none' }}>
                    {idx + 1}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="space-y-4 w-full max-w-xs">
        <div>
          <p className="text-[10px] text-slate-500 tracking-widest mb-1.5">THE CHOIR SPEAKS:</p>
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className="w-8 h-10 border-b-2 flex items-end justify-center pb-1 font-occult text-xl"
                style={{ borderColor: word[i] ? accent : '#334155', color: failed ? '#f43f5e' : accent }}
              >
                {word[i] ?? ''}
              </div>
            ))}
          </div>
          {!solved && path.length > 0 && !failed && (
            <button
              onClick={() => setPath([])}
              className="mt-2 text-[10px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
            >
              erase the trace
            </button>
          )}
          {failed && <p className="text-[10px] text-rose-400 mt-2 font-bold">THE STAR DOES NOT CLOSE. THE TRACE FADES…</p>}
        </div>

        <div className="border border-slate-800 rounded bg-black/40">
          <p className="text-[9px] text-slate-500 tracking-widest px-2.5 py-1.5 border-b border-slate-800">
            TABLE OF CORRESPONDENCES
          </p>
          <table className="w-full text-[10px]">
            <tbody>
              {VERTICES.map((v) => (
                <tr key={v.planet} className="border-b border-slate-900 last:border-0">
                  <td className="px-2.5 py-1 text-base text-slate-300" style={{ fontFamily: SYMBOL_FONT }}>
                    {v.glyph + '\uFE0E'}
                  </td>
                  <td className="px-2 py-1 text-slate-300">{v.planet}</td>
                  <td className="px-2 py-1 text-slate-500">{v.metal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
