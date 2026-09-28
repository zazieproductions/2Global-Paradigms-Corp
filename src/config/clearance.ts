import type { ClearanceLevel } from '@/types';

export interface ClearanceTier {
  level: ClearanceLevel;
  tier: 1 | 2 | 3 | 4 | 5;
  label: string;
  description: string;
  /** Design-system tone used by badges (see components/ui/badge.tsx). */
  tone: 'neutral' | 'info' | 'signal' | 'warning' | 'danger';
}

/** The five selectable clearance tiers, lowest first. */
export const CLEARANCE_TIERS: ClearanceTier[] = [
  {
    level: 'Level 1 - General',
    tier: 1,
    label: 'Level 1 // General Corporate',
    description:
      'Public press releases, company values, general announcements, and basic employee guidelines.',
    tone: 'neutral'
  },
  {
    level: 'Level 2 - Confidential',
    tier: 2,
    label: 'Level 2 // Confidential Operational',
    description:
      'Standard field station logs, routine engineering tickets, and department organizational charters.',
    tone: 'info'
  },
  {
    level: 'Level 3 - Secret',
    tier: 3,
    label: 'Level 3 // Secret Directorate',
    description:
      'Station telemetry logs, Project Cicada specs, Compound 88-T clinical data, and legal settlement summaries.',
    tone: 'signal'
  },
  {
    level: 'Level 4 - Top Secret',
    tier: 4,
    label: 'Level 4 // Top Secret / NOFORN',
    description:
      'Project Vesper blueprints, Oakhaven trial post-mortems, Reson-8 casualty audits, and Site 19 fissure logs.',
    tone: 'warning'
  },
  {
    level: 'Level 5 - Black Dossier',
    tier: 5,
    label: 'Level 5 // Black Dossier / Sanitized',
    description:
      'Project Monolith mantle beacon telemetry, Dr. Arthur Sedley disavowal files, and Palimpsest raw leaks.',
    tone: 'danger'
  }
];

/**
 * Clearance every new operator starts with. Higher tiers are EARNED by
 * breaking the Seven Seals (see `earnedLevel()` in lib/puzzles/investigation.ts).
 */
export const DEFAULT_CLEARANCE: ClearanceLevel = 'Level 1 - General';
