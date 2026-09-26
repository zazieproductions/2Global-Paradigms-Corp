import type { ClearanceLevel } from '@/types';
import { CLEARANCE_TIERS } from '@/config/clearance';

/** Numeric tier (1–5) of a clearance level, including revoked variants. */
export function clearanceTier(level: ClearanceLevel | string): number {
  const m = /Level (\d)/.exec(level);
  return m ? Number(m[1]) : 0;
}

/** "Level 4 - Top Secret" → "Level 4". */
export const shortClearance = (level: ClearanceLevel | string): string => level.split(' - ')[0];

export const isRevoked = (level: ClearanceLevel): boolean => level.includes('REVOKED');

/** Selectable clearance for a tier number, or undefined. */
export const clearanceForTier = (tier: number): ClearanceLevel | undefined =>
  CLEARANCE_TIERS.find((t) => t.tier === tier)?.level;

/** Design-system tone for a clearance level. */
export function clearanceTone(level: ClearanceLevel | string) {
  const tier = clearanceTier(level);
  return CLEARANCE_TIERS.find((t) => t.tier === tier)?.tone ?? 'neutral';
}
