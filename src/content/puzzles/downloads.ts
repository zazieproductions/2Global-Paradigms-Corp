/**
 * Downloadable in-world artifacts unlocked by puzzles.
 * Keyed by the `download` reward id in `definitions.ts`.
 * Coordinates and names are archive case-file details.
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
      exfiltrator: 'Dr. Ewan Thorne (Senior Fellow, PEFD)',
      dateExfiltrated: '2019-11-04 03:14:22 UTC',
      hashRoot: 'SHA256: 0x98AE44F12C0982BA349881FE',
      summary:
        'The 14.8Hz planetary baseline is an active non-biological broadcast. GPC has constructed 22 regional arrays to phase-lock surface electrical grids to this harmonic carrier.',
      keyCoordinates: [
        { station: 'Station 07 (Svalbard)', coords: '78.2232° N, 15.6267° E', depth: '-820m' },
        { station: 'Site 19 (Utah)', coords: '41.1158° N, 112.8711° W', depth: '-600m' },
        { station: 'Diego Garcia Hydrophone 12', coords: '7.3195° S, 72.4229° E', depth: '-5400m' }
      ],
      disavowedPersonnel: ['Dr. Arthur Sedley (1989)', 'Julian Thorne (2019)', 'David Wren (2024)'],
      order: {
        name: 'ORDO VOCIS PROFUNDAE (Order of the Deep Voice)',
        degrees: ['Neophyte', 'Zelator', 'Practicus', 'Philosophus', 'Magister Umbrae'],
        completionOfTheSquare: '2026-11-04T04:32:00Z (carrier projected to reach 15.000 Hz)',
        note: 'Read DOC-1989-DESCENT-ORPHEUS. Then read the seven words aloud. — E.T.'
      }
    }
  }
};

/**
 * Whistleblower-safe combinations players will *try* (lore numbers, revoked
 * keys). Each gets its own in-world rebuff instead of a flat error. None of
 * these is the combination.
 */
export const SAFE_DECOYS: Record<string, string> = {
  '1480': 'THE TUMBLERS HUM AT 14.8… AND FALL STILL. TOO OBVIOUS, THORNE WOULD SAY.',
  '1989': 'THE YEAR OF THE DESCENT. THE SAFE DOES NOT GRIEVE.',
  '0432': 'CONCERT PITCH. THE SAFE IS NOT A TUNING FORK.',
  '3120': 'SPITSBERGEN OVERTONE. CLOSE IN SPIRIT, WRONG IN FACT.',
  '4328': 'MASTER KEY 01 WAS REVOKED ON 1989-11-04.',
  '0015': 'THE SQUARE IS NOT YET COMPLETE.',
  '1500': 'THE SQUARE IS NOT YET COMPLETE.'
};
