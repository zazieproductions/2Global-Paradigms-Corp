/**
 * Downloadable in-world artifacts unlocked by puzzles.
 * Keyed by the `download` reward id in `definitions.ts`.
 * Coordinates and names are fictional story props.
 */
export interface PuzzleDownload {
  id: string;
  filename: string;
  data: unknown;
}

export const PUZZLE_DOWNLOADS: Record<string, PuzzleDownload> = {
  'palimpsest-master-dump': {
    id: 'palimpsest-master-dump',
    filename: 'Palimpsest_Whistleblower_Master_Dump.json',
    data: {
      archive: 'PROJECT PALIMPSEST UNREDACTED LEAK PACKAGE',
      exfiltrator: 'Dr. Aris Thorne (Senior Fellow, PEFD)',
      dateExfiltrated: '2019-11-04 03:14:22 UTC',
      hashRoot: 'SHA256: 0x98AE44F12C0982BA349881FE',
      summary:
        'The 14.8Hz planetary baseline is an active non-biological broadcast. GPC has constructed 22 regional arrays to phase-lock surface electrical grids to this harmonic carrier.',
      keyCoordinates: [
        { station: 'Station 07 (Svalbard)', coords: '78.2232° N, 15.6267° E', depth: '-820m' },
        { station: 'Site 19 (Utah)', coords: '41.1158° N, 112.8711° W', depth: '-600m' },
        { station: 'Diego Garcia Hydrophone 12', coords: '7.3195° S, 72.4229° E', depth: '-5400m' }
      ],
      disavowedPersonnel: ['Dr. Arthur Vance-Vane (1989)', 'Julian Thorne (2019)', 'David Vance-Wren (2024)'],
      _notice:
        'Fictional artifact from Global Paradigms Corp., an original interactive story by Zazie Productions.'
    }
  }
};
