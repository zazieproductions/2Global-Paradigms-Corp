import { type FC } from 'react';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { AnswerInput } from './answer-input';
import { SEALS } from '@/content/puzzles/seals';

// SEAL V — THE REDACTED HYMN
export const HymnPuzzle: FC<{
  solved: boolean;
  accent: string;
  /** Submit an answer; returns true if the seal accepted it. */
  onAttempt: (value: string) => boolean;
  onOpenDoc: (code: string) => void;
  isUnredacted: boolean;
  descramblerUnlocked: boolean;
  onToggleUnredacted: () => void;
}> = ({ solved, accent, onAttempt, onOpenDoc, isUnredacted, descramblerUnlocked, onToggleUnredacted }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onOpenDoc('DOC-1987-HYMNAL-OVP')}
        className="flex items-center gap-2 px-3 py-2 rounded border text-xs cursor-pointer hover:bg-white/5"
        style={{ borderColor: `${accent}66`, color: accent }}
      >
        <BookOpen className="w-3.5 h-3.5" /> OPEN “HYMNAL OF THE SEALED CHOIR”
      </button>
      <button
        type="button"
        aria-pressed={isUnredacted}
        onClick={onToggleUnredacted}
        disabled={!descramblerUnlocked}
        className={`flex items-center gap-2 px-3 py-2 rounded border text-xs cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
          isUnredacted ? 'border-rose-500 text-rose-300 bg-rose-950/40' : 'border-slate-700 text-slate-300'
        }`}
      >
        {isUnredacted ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        DE-SCRAMBLER: {isUnredacted ? 'ON' : 'OFF'}
      </button>
    </div>
    <div className="p-3 border border-slate-800 bg-black/50 rounded font-occult text-sm text-slate-400 leading-loose italic">
      <p className="text-[9px] not-italic font-mono text-slate-600 tracking-widest mb-1">
        THE HYMN AS PALIMPSEST LEFT IT (EXCERPT)
      </p>
      <p>
        <span
          className="bg-slate-300 text-transparent select-none rounded-sm px-1"
          aria-label="redacted"
          role="img"
        >
          █████
        </span>{' '}
        beneath the ice where the carrier is born,
      </p>
      <p>
        <span
          className="bg-slate-300 text-transparent select-none rounded-sm px-1"
          aria-label="redacted"
          role="img"
        >
          ████
        </span>{' '}
        the throat of the earth at the fourteenth hour…
      </p>
      <p className="text-slate-600">… six more lines …</p>
    </div>
    {!solved && (
      <div>
        <p className="text-[10px] text-slate-400 tracking-widest mb-1.5">WHERE IS THE RELIQUARY?</p>
        <AnswerInput
          onSubmit={onAttempt}
          accent={accent}
          fieldLabel="The reliquary"
          placeholder="Name the reliquary…"
        />
      </div>
    )}
  </div>
);

// SEAL VII — THE NAME THAT ENDS THE SONG
export const NamePuzzle: FC<{
  solved: boolean;
  accent: string;
  /** Submit an answer; returns true if the seal accepted it. */
  onAttempt: (value: string) => boolean;
  solvedIds: number[];
}> = ({ solved, accent, onAttempt, solvedIds }) => {
  const words = SEALS.slice(0, 6);
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3 justify-center">
        {words.map((s) => {
          const have = solvedIds.includes(s.id);
          return (
            <div key={s.id} className="text-center">
              <div
                className="font-occult text-3xl"
                style={{
                  color: have ? s.accent : '#1e293b',
                  textShadow: have ? `0 0 16px ${s.accent}` : undefined
                }}
              >
                {have ? s.sealWord[0] : '?'}
              </div>
              <div className="font-occult text-[9px] tracking-widest text-slate-500 mt-1">
                {have ? s.sealWord : '— — —'}
              </div>
            </div>
          );
        })}
        <div className="text-center">
          <div className="font-occult text-3xl text-slate-700 ovp-flicker">{solved ? 'S' : '_'}</div>
          <div className="font-occult text-[9px] tracking-widest text-slate-600 mt-1">
            {solved ? 'SILENTIUM' : '?'}
          </div>
        </div>
      </div>
      {!solved && (
        <div className="max-w-md mx-auto">
          <AnswerInput
            onSubmit={onAttempt}
            accent={accent}
            label="INVOKE"
            fieldLabel="The name that ends the song"
            placeholder="Speak the name…"
          />
        </div>
      )}
    </div>
  );
};
