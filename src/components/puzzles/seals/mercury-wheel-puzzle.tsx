import { useState, type FC } from 'react';
import { KeyRound } from 'lucide-react';
import { vigenereDecrypt } from '@/lib/puzzles/cipher';
import { MERCURY_CIPHERTEXT } from '@/content/puzzles/seals';
import { gpcAudio } from '@/lib/audio/audio-engine';

// SEAL VI — THE MERCURY WHEEL. A working Vigenère cipher disk.
// The seal itself breaks when the Whistleblower Safe is opened with the
// code described by the decrypted message.

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const Wheel: FC<{ shift: number; accent: string; activeLetter?: string }> = ({
  shift,
  accent,
  activeLetter
}) => {
  const C = 110;
  return (
    <svg width={220} height={220} viewBox="0 0 220 220" aria-hidden className="max-w-full h-auto">
      <circle cx={C} cy={C} r={104} fill="#05070c" stroke="#334155" />
      <circle cx={C} cy={C} r={80} fill="none" stroke="#1e293b" />
      <circle cx={C} cy={C} r={56} fill="#070a12" stroke={accent} strokeOpacity={0.5} />
      {/* outer ring: ciphertext letters (fixed) */}
      {ALPHA.split('').map((l, i) => {
        const a = (i / 26) * Math.PI * 2 - Math.PI / 2;
        return (
          <text
            key={`o${l}`}
            x={C + Math.cos(a) * 92}
            y={C + Math.sin(a) * 92 + 4}
            textAnchor="middle"
            fontSize={11}
            fill={activeLetter === l ? accent : '#94a3b8'}
            className="font-order"
          >
            {l}
          </text>
        );
      })}
      {/* inner ring: plaintext letters (rotates by key shift) */}
      <g
        style={{
          transform: `rotate(${(shift / 26) * 360}deg)`,
          transformOrigin: `${C}px ${C}px`,
          transition: 'transform 0.6s cubic-bezier(.2,.9,.2,1)'
        }}
      >
        {ALPHA.split('').map((l, i) => {
          const a = (i / 26) * Math.PI * 2 - Math.PI / 2;
          return (
            <text
              key={`i${l}`}
              x={C + Math.cos(a) * 68}
              y={C + Math.sin(a) * 68 + 4}
              textAnchor="middle"
              fontSize={10}
              fill={accent}
              fillOpacity={0.85}
              className="font-order"
            >
              {l}
            </text>
          );
        })}
      </g>
      <text x={C} y={C + 8} textAnchor="middle" fontSize={26} fill={accent} className="font-symbol">
        ☿
      </text>
      <line x1={C} y1={4} x2={C} y2={22} stroke={accent} strokeWidth={2} />
    </svg>
  );
};

export const MercuryWheelPuzzle: FC<{
  solved: boolean;
  accent: string;
  onOpenSafe: () => void;
}> = ({ solved, accent, onOpenSafe }) => {
  const [key, setKey] = useState('');
  const clean = key.toUpperCase().replace(/[^A-Z]/g, '');
  const plain = clean ? vigenereDecrypt(MERCURY_CIPHERTEXT, clean) : '';
  const shift = clean ? clean.charCodeAt(0) - 65 : 0;
  const looksRight = plain.startsWith('THE SAFE');

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
      <Wheel shift={-shift} accent={accent} activeLetter={MERCURY_CIPHERTEXT[0]} />
      <div className="flex-1 w-full space-y-3">
        <div>
          <p className="text-[9px] text-slate-500 tracking-widest mb-1">
            COURIER CIPHERTEXT — RECOVERED FROM A NAYLOR DEAD-DROP
          </p>
          <p className="font-mono text-sm tracking-[0.25em] p-2.5 bg-black/60 border border-slate-800 rounded text-slate-300 break-words">
            {MERCURY_CIPHERTEXT}
          </p>
        </div>
        <div>
          <label htmlFor="mercury-key" className="block text-[9px] text-slate-500 tracking-widest mb-1">
            COURIER KEYWORD
          </label>
          <input
            id="mercury-key"
            maxLength={32}
            autoComplete="off"
            value={key}
            onChange={(e) => {
              setKey(e.target.value);
              gpcAudio.playUiSound('keystroke');
            }}
            disabled={solved}
            placeholder="Turn the wheel with a keyword…"
            spellCheck={false}
            className="w-full bg-black/60 border rounded px-3 py-2 text-sm tracking-[0.25em] uppercase text-slate-100 placeholder:text-slate-600 placeholder:tracking-normal placeholder:normal-case focus:outline-none font-order"
            style={{ borderColor: `${accent}66` }}
          />
        </div>
        <div>
          <p className="text-[9px] text-slate-500 tracking-widest mb-1">PLAINTEXT</p>
          <p
            aria-live="polite"
            className="font-mono text-sm tracking-[0.25em] p-2.5 bg-black/60 border rounded min-h-[42px] break-words transition-colors"
            style={{ borderColor: looksRight ? accent : '#1e293b', color: looksRight ? accent : '#64748b' }}
          >
            {plain || '— — — — —'}
          </p>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          How the wheel works: each letter of the keyword turns the inner ring by that many places (A=0, B=1 …
          Z=25). The keyword repeats across the message. With the right keyword, the message reads in plain
          English.
        </p>
        {!solved && (
          <button
            type="button"
            onClick={onOpenSafe}
            className="flex items-center gap-2 px-4 py-2 rounded font-order font-bold text-xs tracking-[0.25em] text-black cursor-pointer"
            style={{ background: accent }}
          >
            <KeyRound className="w-3.5 h-3.5" aria-hidden /> APPROACH THE SAFE
          </button>
        )}
      </div>
    </div>
  );
};
