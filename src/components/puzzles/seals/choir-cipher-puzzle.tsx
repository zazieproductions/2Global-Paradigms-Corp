import { type FC } from 'react';
import { ChoirGlyph } from '@/components/ui/sigils';
import { AnswerInput } from './answer-input';
import { CHOIR_INSCRIPTION, FRAGMENTS } from '@/content/puzzles/seals';
import { useInvestigation } from '@/hooks/use-investigation';
import type { ActiveTab } from '@/types';

// SEAL III — THE SCATTERED CHOIR.
// A substitution cipher in the Order's own script. The key is distributed as
// seven fragments hidden across the public-facing archive sections.

export const ChoirCipherPuzzle: FC<{
  solved: boolean;
  accent: string;
  /** Submit an answer; returns true if the seal accepted it. */
  onAttempt: (value: string) => boolean;
  onNavigateTab: (tab: ActiveTab) => void;
  hintLevel: number;
}> = ({ solved, accent, onAttempt, onNavigateTab, hintLevel }) => {
  const { fragments, knownLetters } = useInvestigation();

  return (
    <div className="space-y-5">
      {/* The inscription */}
      <div className="p-4 rounded border bg-black/60" style={{ borderColor: `${accent}44` }}>
        <p className="text-[9px] text-slate-500 tracking-widest mb-3">
          INSCRIPTION — BOREHOLE 4 LIFT DOOR, STATION 07 (TRANSCRIBED BY A.T., 2019-10-11)
        </p>
        <p className="sr-only">
          Letters you can read so far:{' '}
          {CHOIR_INSCRIPTION.split('')
            .map((ch) => (ch === ' ' ? ' / ' : knownLetters.has(ch) ? ch : 'blank'))
            .join(' ')}
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-3" aria-hidden>
          {CHOIR_INSCRIPTION.split(' ').map((word, wi) => (
            <div key={wi} className="flex gap-1">
              {word.split('').map((ch, ci) => {
                const known = knownLetters.has(ch);
                return (
                  <div key={ci} className="flex flex-col items-center">
                    <ChoirGlyph letter={ch} size={30} color={known ? accent : '#94a3b8'} />
                    <span
                      className="font-occult text-xs h-4 transition-all"
                      style={{ color: known ? accent : '#334155' }}
                    >
                      {known ? ch : '·'}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Fragment hunt */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] text-slate-400 tracking-widest">
            CODEX FRAGMENTS — {solved ? 7 : fragments.length}/7 RECOVERED
          </p>
          <p className="text-[9px] text-slate-600">
            Fragments glow faintly near the top of their page. Hover or Tab to reveal, click or press Enter to
            take.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {FRAGMENTS.map((f) => {
            const found = solved || fragments.includes(f.id);
            const showLoc = found || hintLevel >= 1;
            return (
              <div
                key={f.id}
                className="flex items-center gap-3 p-2 rounded border bg-black/40"
                style={{ borderColor: found ? `${accent}66` : '#1e293b' }}
              >
                <div className="flex gap-0.5 shrink-0">
                  {f.letters.map((l) => (
                    <div key={l} className="flex flex-col items-center">
                      <ChoirGlyph letter={l} size={22} color={found ? accent : '#1e293b'} />
                      <span className="text-[9px] font-occult" style={{ color: found ? accent : '#1e293b' }}>
                        {found ? l : '?'}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[10px] italic leading-snug ${found ? 'text-slate-300' : 'text-slate-400'}`}
                  >
                    “{f.riddle}”
                  </p>
                  {showLoc && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab(f.tab)}
                      className="text-[9px] tracking-wider underline cursor-pointer mt-0.5"
                      style={{ color: found ? '#64748b' : accent }}
                    >
                      {found ? `✓ ${f.location}` : `→ ${f.location}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!solved && (
        <div>
          <p className="text-[10px] text-slate-400 tracking-widest mb-1.5">WHERE DOES THE DOOR POINT?</p>
          <AnswerInput
            onSubmit={onAttempt}
            accent={accent}
            fieldLabel="The place the inscription names"
            placeholder="Name the place the inscription names…"
          />
        </div>
      )}
    </div>
  );
};
