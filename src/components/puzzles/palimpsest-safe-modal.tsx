import { useState } from 'react';
import { CheckCircle2, Download, Key, ShieldAlert } from 'lucide-react';
import { PUZZLE_DOWNLOADS } from '@/content';
import { PUZZLE_SETTINGS } from '@/config/puzzles';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { getPuzzle } from '@/lib/puzzles/validate';
import { downloadJson } from '@/lib/utils/download';
import { useProgression } from '@/hooks/use-progression';
import { Modal } from '@/components/ui/modal';
import { HintPanel } from './hint-panel';
import { cn } from '@/lib/utils/cn';

const PUZZLE_ID = 'palimpsest-safe';
const PIN_LENGTH = 4;
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'ENTER'] as const;

interface PalimpsestSafeModalProps {
  open: boolean;
  onClose: () => void;
}

export function PalimpsestSafeModal({ open, onClose }: PalimpsestSafeModalProps) {
  const puzzle = getPuzzle(PUZZLE_ID)!;
  const { attempt, isCompleted, isDownloadUnlocked } = useProgression();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const unlocked = isCompleted(PUZZLE_ID);

  const verify = (code: string) => {
    const result = attempt(PUZZLE_ID, code);
    if (result.ok) {
      gpcAudio.playUiSound('grant');
      setError('');
    } else {
      gpcAudio.playUiSound('deny');
      setError('CRYPTOGRAPHIC AUTHENTICATION FAILED. ACCESS LOGGED.');
    }
    setPin('');
  };

  const press = (key: (typeof KEYS)[number] | string) => {
    if (key === 'CLR') {
      gpcAudio.playUiSound('click');
      setPin('');
      setError('');
      return;
    }
    if (key === 'ENTER') {
      if (pin.length) verify(pin);
      return;
    }
    if (!/^\d$/.test(key) || pin.length >= PIN_LENGTH) return;
    gpcAudio.playUiSound('keystroke');
    const next = pin + key;
    setPin(next);
    setError('');
    if (next.length === PIN_LENGTH) verify(next);
  };

  const download = PUZZLE_DOWNLOADS['palimpsest-master-dump'];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="PALIMPSEST CRYPTOGRAPHIC SAFE"
      icon={Key}
      tone="warning"
      size="md"
    >
      {!unlocked ? (
        <div className="flex flex-col items-center gap-4">
          <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded text-label text-amber-200 text-center leading-relaxed">
            <span className="font-bold block mb-1">RESTRICTED BACKDOOR ENCLAVE</span>
            {puzzle.narrative}
          </div>

          {/* PIN entry: works with the keypad, a physical keyboard, or a screen reader. */}
          <label className="sr-only" htmlFor="safe-pin">
            Four-digit authorization sequence
          </label>
          <input
            id="safe-pin"
            data-autofocus
            inputMode="numeric"
            autoComplete="off"
            maxLength={Math.min(PIN_LENGTH, PUZZLE_SETTINGS.maxInputLength)}
            value={pin}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, '').slice(0, PIN_LENGTH);
              setPin(digits);
              setError('');
              if (digits.length === PIN_LENGTH) verify(digits);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && pin.length) verify(pin);
            }}
            aria-describedby={error ? 'safe-error' : undefined}
            className="peer sr-only"
          />
          <div
            className="flex items-center justify-center gap-3 p-3 rounded peer-focus-visible:ring-1 peer-focus-visible:ring-amber-500"
            aria-hidden
          >
            {Array.from({ length: PIN_LENGTH }, (_, idx) => (
              <div
                key={idx}
                className={cn(
                  'w-10 h-12 rounded border flex items-center justify-center text-lg font-bold font-mono transition-all',
                  pin[idx]
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-glow-sm shadow-amber-500/40'
                    : 'bg-shell border-slate-700 text-slate-600'
                )}
              >
                {pin[idx] || '•'}
              </div>
            ))}
          </div>

          {error && (
            <p
              id="safe-error"
              role="alert"
              className="text-caption text-rose-400 font-bold flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden />
              <span>{error}</span>
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]" role="group" aria-label="Keypad">
            {KEYS.map((key) => (
              <button
                type="button"
                key={key}
                onClick={() => press(key)}
                aria-label={key === 'CLR' ? 'Clear' : key === 'ENTER' ? 'Submit' : key}
                className="py-2.5 rounded bg-hover hover:bg-active border border-line-strong hover:border-amber-500/50 text-slate-200 font-bold text-sm cursor-pointer transition-colors"
              >
                {key}
              </button>
            ))}
          </div>

          <HintPanel puzzle={puzzle} className="w-full" />
        </div>
      ) : (
        <div className="flex flex-col gap-4 text-center" role="status">
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/50 rounded flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" aria-hidden />
            <h3 className="text-sm font-bold text-emerald-300">{puzzle.success.heading}</h3>
            <p className="text-label text-slate-300">{puzzle.success.body}</p>
          </div>
          {download && isDownloadUnlocked(download.id) && (
            <button
              type="button"
              onClick={() => {
                gpcAudio.playUiSound('print');
                downloadJson(download.filename, download.data);
              }}
              className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-black font-bold rounded cursor-pointer transition-colors shadow-lg"
            >
              <Download className="w-4 h-4" aria-hidden />
              <span>DOWNLOAD WHISTLEBLOWER DATA DUMP (.JSON)</span>
            </button>
          )}
        </div>
      )}
    </Modal>
  );
}
