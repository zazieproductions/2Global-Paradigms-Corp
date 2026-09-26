import React, { useState } from 'react';
import { matchesDigest } from '../cipher';
import { gpcAudio } from '../../lib/audioEngine';

const DENIALS = [
  'THE SEAL DOES NOT ANSWER.',
  'THE CHOIR IS SILENT. TRY AGAIN.',
  'WRONG VOICE. THE WAX HOLDS.',
  'NOT THAT WORD. THE ORDER HAS NOTED YOUR ATTEMPT.',
  'THE SIGIL DIMS. SOMETHING BELOW SHIFTS.'
];

export const AnswerInput: React.FC<{
  digest: string;
  onSolve: () => void;
  placeholder?: string;
  accent: string;
  label?: string;
  disabled?: boolean;
}> = ({ digest, onSolve, placeholder = 'Speak the answer…', accent, label = 'SPEAK', disabled }) => {
  const [val, setVal] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!val.trim() || disabled) return;
    if (matchesDigest(val, digest)) {
      gpcAudio.playSealBreak();
      setErr(null);
      onSolve();
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
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-black/60 border rounded px-3 py-2 text-sm tracking-[0.2em] uppercase text-slate-100 placeholder:text-slate-600 placeholder:tracking-normal placeholder:normal-case focus:outline-none font-occult disabled:opacity-40"
          style={{ borderColor: `${accent}66` }}
        />
        <button
          type="submit"
          disabled={disabled}
          className="px-4 py-2 rounded font-bold text-xs tracking-widest text-black cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-occult"
          style={{ background: accent }}
        >
          {label}
        </button>
      </div>
      {err && <p className="text-[10px] text-rose-400 font-bold tracking-wider">{err}</p>}
    </form>
  );
};
