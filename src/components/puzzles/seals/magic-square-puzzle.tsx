import { useMemo, useState, type FC, Fragment } from 'react';
import { gpcAudio } from '@/lib/audio/audio-engine';

// SEAL I — KAMEA SATURNI. The Lo Shu / Saturn magic square.
// Givens (4, 9) in the top row fix the orientation → unique solution.
// The filled grid (cells joined, row by row) is checked by the seal validator.

const GIVENS: Record<number, number> = { 0: 4, 1: 9 };
const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const balanced = (grid: number[]) =>
  new Set(grid).size === 9 && LINES.every((l) => l.reduce((s, i) => s + grid[i], 0) === 15);

/** The unique completion of the givens — used to redraw the square once the seal is broken. */
function solveKamea(): number[] {
  const free = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => !Object.values(GIVENS).includes(d));
  const slots = [...Array(9).keys()].filter((i) => GIVENS[i] === undefined);
  const grid = Array.from({ length: 9 }, (_, i) => GIVENS[i] ?? 0);
  const walk = (k: number, pool: number[]): boolean => {
    if (k === slots.length) return balanced(grid);
    for (const d of pool) {
      grid[slots[k]] = d;
      if (
        walk(
          k + 1,
          pool.filter((x) => x !== d)
        )
      )
        return true;
    }
    return false;
  };
  walk(0, free);
  return grid;
}

export const MagicSquarePuzzle: FC<{
  solved: boolean;
  accent: string;
  /** Submit the filled grid; returns true if the seal accepted it. */
  onAttempt: (answer: string) => boolean;
}> = ({ solved, accent, onAttempt }) => {
  const [cells, setCells] = useState<(number | null)[]>(() =>
    solved ? solveKamea() : Array.from({ length: 9 }, (_, i) => GIVENS[i] ?? null)
  );
  const [selected, setSelected] = useState<number | null>(null);

  const sums = useMemo(
    () =>
      LINES.map((l) =>
        l.every((i) => cells[i] !== null) ? l.reduce((s, i) => s + (cells[i] as number), 0) : null
      ),
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
      const grid = next as number[];
      if (balanced(grid)) {
        setTimeout(() => {
          if (onAttempt(grid.join(''))) gpcAudio.playSealBreak();
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
  const lineColor = (s: number | null) =>
    s === null ? 'text-slate-600' : s === 15 ? 'text-emerald-400' : 'text-rose-400';

  return (
    <div
      className="flex flex-col md:flex-row gap-6 items-center"
      onKeyDown={(e) => {
        const d = parseInt(e.key, 10);
        if (d >= 1 && d <= 9) place(d);
        if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') place(null);
      }}
      role="group"
      aria-label="Kamea of Saturn — 3 by 3 square. Select a cell, then type a digit from 1 to 9."
    >
      <div className="relative">
        {/* Diagonal sums */}
        <span className={`absolute -top-5 -left-6 text-[10px] font-bold ${lineColor(sums[6])}`}>
          {sums[6] ?? '·'}
        </span>
        <span className={`absolute -top-5 -right-6 text-[10px] font-bold ${lineColor(sums[7])}`}>
          {sums[7] ?? '·'}
        </span>
        <div className="grid grid-cols-[repeat(3,56px)_28px] gap-1.5 items-center">
          {[0, 1, 2].map((r) => (
            <Fragment key={r}>
              {[0, 1, 2].map((c) => {
                const i = r * 3 + c;
                const given = GIVENS[i] !== undefined;
                const isSel = selected === i && !solved;
                return (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Row ${r + 1}, column ${c + 1}: ${cells[i] ?? 'empty'}${given ? ' (given)' : ''}`}
                    aria-pressed={isSel}
                    aria-disabled={given || solved}
                    onClick={() => !given && !solved && setSelected(i)}
                    className={`w-14 h-14 flex items-center justify-center text-2xl font-occult border rounded-sm transition-all ${
                      given
                        ? 'bg-slate-800/70 text-slate-300 cursor-default'
                        : 'bg-black/60 text-slate-100 cursor-pointer hover:bg-slate-900'
                    }`}
                    style={{
                      borderColor: isSel ? accent : solved ? `${accent}aa` : 'var(--color-seal-sealed)',
                      boxShadow: isSel ? `0 0 14px ${accent}88` : solved ? `0 0 10px ${accent}44` : undefined
                    }}
                  >
                    {cells[i] ?? ''}
                  </button>
                );
              })}
              <span className={`text-[10px] font-bold pl-1 ${lineColor(sums[r])}`}>{sums[r] ?? '·'}</span>
            </Fragment>
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
          <p className="text-[10px] text-slate-500 tracking-wider">
            SELECT A CELL, THEN INSCRIBE A NUMERAL (OR TYPE 1–9):
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
              <button
                key={d}
                type="button"
                aria-label={`Inscribe ${d}${used.has(d) ? ' (already placed)' : ''}`}
                onClick={() => place(d)}
                className={`w-full aspect-square min-h-[2.75rem] sm:w-9 sm:h-9 sm:min-h-0 rounded-sm border font-occult text-base cursor-pointer transition-all ${
                  used.has(d)
                    ? 'border-slate-800 text-slate-600 bg-slate-900/40'
                    : 'border-slate-600 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {d}
              </button>
            ))}
            <button
              type="button"
              onClick={() => place(null)}
              className="w-full aspect-square min-h-[2.75rem] sm:w-9 sm:h-9 sm:min-h-0 rounded-sm border border-slate-700 text-slate-500 hover:text-slate-200 text-[9px] cursor-pointer"
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
