/**
 * Content barrel — the single import point for every authored collection.
 *
 * UI code should prefer the query helpers in `src/lib/archive` over reaching
 * into these arrays directly, but read-only access is always safe.
 */
export { DOCUMENTS } from './documents';
export { AUTHORED_DOCUMENTS } from './documents/authored-documents';
export { GENERATED_DOCUMENTS } from './documents/generated-records';
export { PERSONNEL } from './personnel/personnel';
export { REGIONAL_STATIONS } from './offices/stations';
export { DEPARTMENTS } from './departments/departments';
export { INTERNAL_PROGRAMS } from './projects/programs';
export { AUDIO_ARTIFACTS } from './audio/audio-artifacts';
export { EMAIL_THREADS } from './communications/emails';
export { MEETING_RECORDS } from './communications/meetings';
export { PRESS_RELEASES } from './communications/press-releases';
export { NEWSLETTERS } from './communications/newsletters';
export { ANNUAL_REPORTS } from './corporate/annual-reports';
export { COMPANY_VALUES } from './corporate/values';
export { JOB_POSTINGS } from './corporate/job-postings';
export { TRAINING_MODULES } from './corporate/training-modules';
export { DISCONTINUED_PRODUCTS } from './corporate/discontinued-products';
export { TIMELINE_ENTRIES } from './history/timeline';
export { DEAD_LINKS } from './web/dead-links';
export { RESTORATION_LOGS } from './restoration/restoration-logs';
export { GHOSTS, DIRECTIVE_17 } from './restoration/purge-manifest';
export { PUZZLES } from './puzzles/definitions';
export { PUZZLE_DOWNLOADS } from './puzzles/downloads';
export { TERMINAL_HELP, TERMINAL_SCAN, TERMINAL_LEAK_DUMP, TERMINAL_STATUS } from './puzzles/terminal-text';
