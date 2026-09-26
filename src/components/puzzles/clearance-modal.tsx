import { useEffect, useState, type FormEvent } from 'react';
import { AlertOctagon, CheckCircle2, Key, Lock, Shield } from 'lucide-react';
import type { ClearanceLevel } from '@/types';
import { CLEARANCE_TIERS } from '@/config/clearance';
import { PUZZLE_SETTINGS } from '@/config/puzzles';
import { DEGREES, EARNED_BY, LEVEL_CORRESPONDENCE, getSeal } from '@/content/puzzles/seals';
import { MASTER_KEY_CODE } from '@/content/puzzles/gateway';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { useProgression } from '@/hooks/use-progression';
import { useInvestigation } from '@/hooks/use-investigation';
import { Modal } from '@/components/ui/modal';
import { PlanetGlyph } from '@/components/ui/sigils';
import { cn } from '@/lib/utils/cn';

const TIER_BORDER: Record<number, string> = {
  1: 'border-slate-600 text-slate-300',
  2: 'border-blue-500 text-blue-300',
  3: 'border-cyan-500 text-cyan-300',
  4: 'border-amber-500 text-amber-300',
  5: 'border-rose-500 text-rose-300'
};

interface ClearanceModalProps {
  open: boolean;
  onClose: () => void;
  /** Route to the Seven Seals case file. */
  onOpenSanctum: () => void;
}

/**
 * Clearance is EARNED by breaking the seals: the operator may choose any tier
 * up to the one they have earned (to browse "as" a lower clearance), and the
 * legacy master-key field only ever answers in-world that keys are revoked.
 */
export function ClearanceModal({ open, onClose, onOpenSanctum }: ClearanceModalProps) {
  const { clearance: current, earnedLevel, setClearance } = useProgression();
  const { currentSeal } = useInvestigation();
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-close shortly after a successful change.
  useEffect(() => {
    if (!successMsg) return;
    const id = setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 900);
    return () => clearTimeout(id);
  }, [successMsg, onClose]);

  const select = (level: ClearanceLevel, tier: number) => {
    if (tier > earnedLevel) {
      gpcAudio.playUiSound('deny');
      setSuccessMsg('');
      setAuthError(`DEGREE NOT YET EARNED. ${EARNED_BY[tier].toUpperCase()}.`);
      return;
    }
    gpcAudio.playUiSound('grant');
    setClearance(level);
    setAuthError('');
    setSuccessMsg(`Clearance updated to ${level}`);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    gpcAudio.playUiSound('deny');
    setAuthError(
      passcode.trim() === MASTER_KEY_CODE
        ? 'MASTER KEY 01 (D. CROSS) WAS REVOKED ON 1989-11-04, THE NIGHT OF THE DESCENT. THE ORDER DOES NOT OPEN FOR KEYS.'
        : 'NO MASTER KEYS REMAIN IN SERVICE. DEGREES ARE EARNED THROUGH THE SEALS.'
    );
    setPasscode('');
  };

  const seal = currentSeal ? getSeal(currentSeal) : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="SECURITY CLEARANCE PROFILER"
      icon={Shield}
      tone="neutral"
      size="lg"
    >
      <div className="space-y-4">
        <div className="p-3 bg-inset border border-line rounded flex items-center justify-between gap-2">
          <span className="text-label text-slate-400">CURRENT CLEARANCE:</span>
          <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-700">
            {current.toUpperCase()}
          </span>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-caption text-slate-400 font-bold mb-2">SELECT AUTHORIZATION LEVEL:</legend>
          {CLEARANCE_TIERS.map((item) => {
            const isCurrent = current === item.level;
            const earned = item.tier <= earnedLevel;
            return (
              <button
                type="button"
                key={item.level}
                onClick={() => select(item.level, item.tier)}
                aria-pressed={isCurrent}
                aria-disabled={!earned}
                className={cn(
                  'w-full text-left p-3 rounded border cursor-pointer transition-all',
                  TIER_BORDER[item.tier],
                  isCurrent ? 'bg-slate-800/80 font-bold ring-1 ring-cyan-400' : 'bg-canvas hover:bg-hover',
                  !earned && 'opacity-60'
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    <PlanetGlyph glyph={LEVEL_CORRESPONDENCE[item.tier].glyph} />
                    {item.label}
                    {earned && earnedLevel >= 3 && (
                      <span className="text-micro font-normal text-fuchsia-300/70 font-occult">
                        · {DEGREES[item.tier]}
                      </span>
                    )}
                  </span>
                  {!earned && <Lock className="w-3 h-3 text-slate-500" aria-label="Not yet earned" />}
                  {isCurrent && (
                    <span className="text-micro px-1.5 py-px rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                      ACTIVE
                    </span>
                  )}
                </span>
                <span className="block text-caption text-slate-400 mt-1 leading-normal font-normal">
                  {item.description}
                </span>
                <span
                  className={cn(
                    'block text-micro mt-1 font-normal',
                    earned ? 'text-emerald-500/80' : 'text-slate-500'
                  )}
                >
                  {earned ? '✓ ' : '✕ '}
                  {EARNED_BY[item.tier]}
                </span>
              </button>
            );
          })}
        </fieldset>

        <form onSubmit={submit} className="pt-2 border-t border-slate-800 space-y-2">
          <label
            htmlFor="master-key"
            className="text-caption text-slate-400 font-bold flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" aria-hidden />
            LEGACY EXECUTIVE MASTER KEY (DEPRECATED):
          </label>
          <div className="flex gap-2">
            <input
              id="master-key"
              type="password"
              autoComplete="off"
              maxLength={PUZZLE_SETTINGS.maxInputLength}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter master key..."
              aria-describedby={authError ? 'master-key-error' : undefined}
              className="field flex-1 min-w-0 px-3 text-slate-100 focus-visible:border-amber-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded cursor-pointer transition-colors"
            >
              ELEVATE
            </button>
          </div>
        </form>

        <button
          type="button"
          onClick={onOpenSanctum}
          className="w-full py-2 rounded border border-fuchsia-800 text-fuchsia-300 hover:bg-fuchsia-950/40 cursor-pointer font-occult tracking-widest text-label"
        >
          {seal ? `CONTINUE AT SEAL ${seal.numeral} — ${seal.title.toUpperCase()}` : 'VIEW THE CASE FILE'}
        </button>

        <div aria-live="polite">
          {authError && (
            <p
              id="master-key-error"
              className="text-caption text-rose-400 font-bold flex items-center gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5 shrink-0" aria-hidden />
              <span>{authError}</span>
            </p>
          )}
          {successMsg && (
            <p className="text-caption text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
              <span>{successMsg}</span>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
