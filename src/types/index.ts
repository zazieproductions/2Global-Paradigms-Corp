export type * from './records';
export type * from './content';
export type * from './puzzles';
export type * from './directives';
export type * from './search';

/**
 * Stable identifiers for every archive section. These double as URL slugs
 * (see `src/config/navigation.ts`) and must not be renamed without a redirect.
 */
export type ActiveTab =
  | 'dashboard'
  | 'documents'
  | 'personnel'
  | 'stations'
  | 'programs'
  | 'departments'
  | 'products'
  | 'audio'
  | 'reports'
  | 'communications'
  | 'timeline'
  | 'newsletters'
  | 'training'
  | 'careers'
  | 'values'
  | 'tools'
  | 'deadlinks'
  | 'sanctum';
