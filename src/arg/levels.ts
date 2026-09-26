import type { ClearanceLevel } from '../types';

// Clearance levels double as the Order's degrees of initiation (Liber Carrier §IV).
export const LEVELS: ClearanceLevel[] = [
  'Level 1 - General',
  'Level 2 - Confidential',
  'Level 3 - Secret',
  'Level 4 - Top Secret',
  'Level 5 - Black Dossier'
];

export const clearanceRank = (lvl: ClearanceLevel | string): number => {
  const m = /Level (\d)/.exec(lvl);
  return m ? parseInt(m[1], 10) : 1;
};

export const levelFromRank = (rank: number): ClearanceLevel =>
  LEVELS[Math.max(0, Math.min(4, rank - 1))];

