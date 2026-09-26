import React, { useMemo, useState } from 'react';
import { gpcAudio } from '../../lib/audioEngine';

// SEAL I — KAMEA SATURNI. The Lo Shu / Saturn magic square.
// Givens (4, 9) in the top row fix the orientation → unique solution.

const GIVENS: Record<number, number> = { 0: 4, 1: 9 };
const SOLUTION = [4, 9, 2, 3, 5, 7, 8, 1, 6];
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

export const MagicSquarePuzzle: React.FC<{ solved: boolean; accent: string; onSolve: () => void }> = ({
  solved,
  accent,
  onSolve
}) => {
  const [cells, setCells] = useState<(number | null)[]>(() =>
    solved ? SOLUTION : Array.from({ length: 9 }, (_, i) => GIVENS[i] ?? null)
  );
  const [selected, setSelected] = useState<number | null>(null);

  const sums = useMemo(
    () => LINES.map((l) => (l.every((i) => cells[i] !== null) ? l.reduce((s, i) => s + (cells[i] as number), 0) : null)),
    [cells]
  );

  const place = (digit: number | null) => {
    if (selected === null || GIVENS[selected] !== undefined || solved) return;
    gpcAudio.playTone(digit ? 110 * Math.pow(2, digit / 12) * 2 : 220, 0.4, 'triangle', 0.1);
    const next = [...cells];
    // A digit may only appear once — remove it from wherever it was.
    if (digit !== null) {
      const prev = next.indexOf(digit);
      if (prev !== -1 && GIVENS[prev] === undefined) next[prev] = null;
      if (prev !== -1 && GIVENS[prev] !== undefined) return;
    }
    next[selected] = digit;
    setCells(next);
    const complete = next.every((c) => c !== null);
    if (complete) {
      const ok = LINES.every((l) => l.reduce((s, i) => s + (next[i] as number), 0) === 15) && new Set(next).size === 9;
      if (ok) {
        setTimeout(() => {
          gpcAudio.playSealBreak();
          onSolve();
        }, 350);
      } else {
        gpcAudio.playUiSound('deny');
      }
    }
    // auto-advance to next empty cell
    const nextEmpty = next.findIndex((c, i) => c === null && i > selected);
    setSelected(nextEmpty === -1 ? next.findIndex((c) => c === null) : nextEmpty);
  };

  const used = new Set(cells.filter((c): c is number => c !== null));
  const lineColor = (s: number | null) => (s === null ? 'text-slate-600' : s === 15 ? 'text-emerald-400' : 'text-rose-400');

  return (
    <div
      className="flex flex-col md:flex-row gap-6 items-center"
      onKeyDown={(e) => {
        const d = parseInt(e.key, 10);
        if (d >= 1 && d <= 9) place(d);
        if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') place(null);
      }}
      tabIndex={0}
    >
      <div className="relative">
        {/* Diagonal sums */}
        <span className={`absolute -top-5 -left-6 text-[10px] font-bold ${lineColor(sums[6])}`}>{sums[6] ?? '·'}</span>
        <span className={`absolute -top-5 -right-6 text-[10px] font-bold ${lineColor(sums[7])}`}>{sums[7] ?? '·'}</span>
        <div className="grid grid-cols-[repeat(3,56px)_28px] gap-1.5 items-center">
          {[0, 1, 2].map((r) => (
            <React.Fragment key={r}>
              {[0, 1, 2].map((c) => {
                const i = r * 3 + c;
                const given = GIVENS[i] !== undefined;
                const isSel = selected === i && !solved;
                return (
                  <button
                    key={i}
                    onClick={() => !given && !solved && setSelected(i)}
                    className={`w-14 h-14 flex items-center justify-center text-2xl font-occult border rounded-sm transition-all ${
                      given ? 'bg-slate-800/70 text-slate-300 cursor-default' : 'bg-black/60 text-slate-100 cursor-pointer hover:bg-slate-900'
                    }`}
                    style={{
                      borderColor: isSel ? accent : solved ? `${accent}aa` : '#334155',
                      boxShadow: isSel ? `0 0 14px ${accent}88` : solved ? `0 0 10px ${accent}44` : undefined
                    }}
                  >
                    {cells[i] ?? ''}
                  </button>
                );
              })}
              <span className={`text-[10px] font-bold pl-1 ${lineColor(sums[r])}`}>{sums[r] ?? '·'}</span>
            </React.Fragment>
          ))}
          {[3, 4, 5].map((li) => (
            <span key={li} className={`text-[10px] font-bold text-center ${lineColor(sums[li])}`}>
              {sums[li] ?? '·'}
            </span>
          ))}
        </div>
      </div>

      {!solved ? (
        <div className="space-y-2">
          <p className="text-[10px] text-slate-500 tracking-wider">SELECT A CELL, THEN INSCRIBE A NUMERAL (OR TYPE 1–9):</p>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
              <button
                key={d}
                onClick={() => place(d)}
                className={`w-9 h-9 rounded-sm border font-occult text-base cursor-pointer transition-all ${
                  used.has(d) ? 'border-slate-800 text-slate-600 bg-slate-900/40' : 'border-slate-600 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
            <button
              onClick={() => place(null)}
              className="w-9 h-9 rounded-sm border border-slate-700 text-slate-500 hover:text-slate-200 text-[9px] cursor-pointer"
            >
              ERASE
            </button>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed max-w-xs">
            Line sums appear beside each row, beneath each column, and at the corners for the diagonals.
            <span className="text-emerald-400"> Green</span> means the line is balanced.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="font-occult text-6xl" style={{ color: accent, textShadow: `0 0 24px ${accent}` }}>
            XV
          </div>
          <p className="text-[10px] text-slate-400 tracking-widest mt-1">SATURN'S CONSTANT · 15</p>
        </div>
      )}
    </div>
  );
};
