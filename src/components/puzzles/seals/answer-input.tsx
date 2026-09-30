import { useId, useState, type FC, type FormEvent } from 'react';
import { gpcAudio } from '@/lib/audio/audio-engine';

const DENIALS = [
  'THE SEAL DOES NOT ANSWER.',
  'THE CHOIR IS SILENT. TRY AGAIN.',
  'WRONG VOICE. THE SEAL HOLDS.',
  'NOT THAT WORD. THE ORDER HAS NOTED YOUR ATTEMPT.',
  'THE PLATE GOES DARK. SOMETHING BELOW SHIFTS.'
];

/**
 * Free-text seal answer. Validation happens in the progression layer:
 * `onSubmit` returns true when the answer was accepted.
 */
export const AnswerInput: FC<{
  onSubmit: (value: string) => boolean;
  placeholder?: string;
  accent: string;
  label?: string;
  /** Accessible name for the text field. */
  fieldLabel?: string;
  disabled?: boolean;
}> = ({
  onSubmit,
  placeholder = 'Speak the answer…',
  accent,
  label = 'SPEAK',
  fieldLabel = 'Your answer',
  disabled
}) => {
  const errId = useId();
  const [val, setVal] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!val.trim() || disabled) return;
    if (onSubmit(val)) {
      gpcAudio.playSealBreak();
      setErr(null);
    } else {
      gpcAudio.playUiSound('deny');
      setErr(DENIALS[Math.floor(Math.random() * DENIALS.length)]);
      setShake((n) => n + 1);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-1.5">
      <div key={shake} className={`flex gap-2 ${shake ? 'ovp-shake' : ''}`}>
        <input
          value={val}
          disabled={disabled}
          onChange={(e) => {
            setVal(e.target.value);
            setErr(null);
          }}
          placeholder={placeholder}
          aria-label={fieldLabel}
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? errId : undefined}
          maxLength={32}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          enterKeyHint="go"
          className="flex-1 min-w-0 bg-black/60 border rounded px-3 py-2.5 sm:py-2 text-sm tracking-[0.2em] uppercase text-slate-100 placeholder:text-slate-600 placeholder:tracking-normal placeholder:normal-case focus:outline-none font-order disabled:opacity-40"
          style={{ borderColor: `${accent}66` }}
        />
        <button
          type="submit"
          disabled={disabled}
          className="tap-target shrink-0 px-4 py-2.5 sm:py-2 rounded font-bold text-xs tracking-widest text-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-order"
          style={{ background: accent }}
        >
          {label}
        </button>
      </div>
      {err && (
        <p id={errId} role="alert" className="text-caption text-rose-400 font-bold tracking-wider">
          {err}
        </p>
      )}
    </form>
  );
};
