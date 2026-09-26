import type { RestorationLog } from '@/types';

/**
 * Operator logs from the (fictional) restoration of the recovered archive.
 * These frame the site itself: the player is browsing a mirror that is still
 * being repaired. Keep entries short, dated, and in operator voice.
 */
export const RESTORATION_LOGS: RestorationLog[] = [
  {
    id: 'rst-001',
    code: 'RST-2026-0001',
    title: 'VAULT0 volume mounted from Obsidian Proxy mirror',
    date: '2026-08-02',
    operator: 'MIRROR OPERATOR 3',
    action: 'recovered',
    integrity: 41,
    affected: [],
    notes:
      'Initial mount of the Postojna master volume. Index tree intact, record bodies fragmentary. Hash root 0x7F4A...9E02 matches the leaked manifest.',
    tags: ['Vault0', 'Mount', 'Postojna']
  },
  {
    id: 'rst-002',
    code: 'RST-2026-0014',
    title: 'Authored dossiers (doc-001 to doc-025) restored to full text',
    date: '2026-08-19',
    operator: 'MIRROR OPERATOR 3',
    action: 'restored',
    integrity: 63,
    affected: ['doc-001', 'doc-007', 'doc-022', 'doc-025'],
    notes:
      'Twenty-five priority dossiers reassembled from the Thorne exfiltration set. Redaction masks preserved; cleartext layer recoverable with the de-scrambler.',
    tags: ['Dossiers', 'Thorne', 'Redaction']
  },
  {
    id: 'rst-003',
    code: 'RST-2026-0031',
    title: 'Operational records rebuilt from index stubs',
    date: '2026-09-04',
    operator: 'MIRROR OPERATOR 5',
    action: 'reindexed',
    integrity: 72,
    affected: [],
    notes:
      'Records doc-026 to doc-165 were rebuilt from surviving index stubs only. Titles, dates and routing metadata are reliable; bodies are templated reconstructions and should be treated as partial.',
    tags: ['Index', 'Reconstruction', 'Partial']
  },
  {
    id: 'rst-004',
    code: 'RST-2026-0038',
    title: 'Personnel cross-references repaired',
    date: '2026-09-11',
    operator: 'MIRROR OPERATOR 5',
    action: 'repaired',
    integrity: 78,
    affected: ['p-001', 'p-002', 'p-009'],
    notes:
      'Malformed personnel and station pointers in the rebuilt records were corrected. Several dossiers still cite files that were never recovered; those links now report FILE NOT RECOVERED instead of failing silently.',
    tags: ['Personnel', 'Cross-reference']
  },
  {
    id: 'rst-005',
    code: 'RST-2026-0042',
    title: 'Palimpsest beacon capture quarantined',
    date: '2026-09-17',
    operator: 'MIRROR OPERATOR 1',
    action: 'quarantined',
    integrity: 78,
    affected: ['audio-06'],
    notes:
      'ART-06 contains live scrubbing instructions. Playback is synthesised locally and is always opt-in. Full transcript retained as the primary copy.',
    tags: ['Audio', 'Palimpsest', 'Quarantine']
  },
  {
    id: 'rst-006',
    code: 'RST-2026-0047',
    title: 'Six outbound URLs confirmed dead',
    date: '2026-09-22',
    operator: 'MIRROR OPERATOR 1',
    action: 'lost',
    integrity: 81,
    affected: ['dead-01', 'dead-02', 'dead-03', 'dead-04', 'dead-05', 'dead-06'],
    notes:
      'External references in the archive no longer resolve. Cached snippets retained. Links are displayed as text only and are never followed.',
    tags: ['Dead Links', 'Wayback']
  }
];
