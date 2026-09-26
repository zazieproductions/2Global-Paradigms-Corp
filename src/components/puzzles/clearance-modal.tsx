import { useEffect, useState, type FormEvent } from 'react';
import { AlertOctagon, CheckCircle2, Key, Lock, Shield } from 'lucide-react';
import type { ClearanceLevel } from '@/types';
import { CLEARANCE_TIERS } from '@/config/clearance';
import { PUZZLE_SETTINGS } from '@/config/puzzles';
import { gpcAudio } from '@/lib/audio/audio-engine';
import { getPuzzle } from '@/lib/puzzles/validate';
import { hasEarnedClearance } from '@/lib/puzzles/progression';
import { useProgression } from '@/hooks/use-progression';
import { Modal } from '@/components/ui/modal';
import { HintPanel } from './hint-panel';
import { cn } from '@/lib/utils/cn';

const PUZZLE_ID = 'executive-master-key';

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
}

export function ClearanceModal({ open, onClose }: ClearanceModalProps) {
  const puzzle = getPuzzle(PUZZLE_ID)!;
  const { state, attempt, setClearance } = useProgression();
  const current = state.access.clearance;
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

  const select = (level: ClearanceLevel, locked?: boolean) => {
    if (locked && !hasEarnedClearance(state, level)) {
      gpcAudio.playUiSound('deny');
      setAuthError('LEVEL 5 REQUIRES EXECUTIVE MASTER KEY CODE (OR TERMINAL OVERRIDE).');
      return;
    }
    gpcAudio.playUiSound('grant');
    setClearance(level);
    setAuthError('');
    setSuccessMsg(`Clearance updated to ${level}`);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = attempt(PUZZLE_ID, passcode);
    if (result.ok) {
      gpcAudio.playUiSound('grant');
      setAuthError('');
      setSuccessMsg(puzzle.success.body);
    } else {
      gpcAudio.playUiSound('deny');
      setAuthError(
        result.reason === 'empty' ? 'ENTER A MASTER KEY CODE.' : 'INVALID MASTER KEY CODE. SECURITY NOTIFIED.'
      );
      setPasscode('');
    }
  };

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
            const locked = item.locked && !hasEarnedClearance(state, item.level);
            return (
              <button
                type="button"
                key={item.level}
                onClick={() => select(item.level, item.locked)}
                aria-pressed={isCurrent}
                className={cn(
                  'w-full text-left p-3 rounded border cursor-pointer transition-all',
                  TIER_BORDER[item.tier],
                  isCurrent ? 'bg-slate-800/80 font-bold ring-1 ring-cyan-400' : 'bg-canvas hover:bg-hover'
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="font-bold text-xs flex items-center gap-1.5">
                    {locked && <Lock className="w-3 h-3" aria-label="Locked" />}
                    {item.label}
                  </span>
                  {isCurrent && (
                    <span className="text-micro px-1.5 py-px rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                      ACTIVE
                    </span>
                  )}
                </span>
                <span className="block text-caption text-slate-400 mt-1 leading-normal font-normal">
                  {item.description}
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
            EXECUTIVE MASTER KEY AUTHORIZATION (LEVEL 5 BYPASS):
          </label>
          <div className="flex gap-2">
            <input
              id="master-key"
              type="password"
              autoComplete="off"
              maxLength={PUZZLE_SETTINGS.maxInputLength}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter master key code..."
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

        <div aria-live="polite">
          {authError && (
            <p
              id="master-key-error"
              className="text-caption text-rose-400 font-bold flex items-center gap-1.5"
            >
              <AlertOctagon className="w-3.5 h-3.5" aria-hidden />
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

        <HintPanel puzzle={puzzle} onBypass={() => setSuccessMsg(puzzle.success.body)} />
      </div>
    </Modal>
  );
}
