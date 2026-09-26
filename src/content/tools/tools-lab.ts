/**
 * Copy and fixtures for the Sub-Audible Software Tools page (/tools).
 * Presentation lives in src/pages/tools-lab-page.tsx.
 */

export type ToolId = 'calc' | 'recon' | 'meter' | 'stream';

export const TOOLS_LAB_TOOLS: { id: ToolId; label: string }[] = [
  { id: 'calc', label: 'Evacuation Calculator' },
  { id: 'recon', label: 'Redaction Reconstruction' },
  { id: 'meter', label: 'Behavioral Sync Tracker' },
  { id: 'stream', label: 'Seismic Telemetry Feed' }
];

/** Tool 02 — corrupted segments and their reconstructed cleartext. */
export const RECON_SEGMENTS: { scrambled: string; clear: string }[] = [
  {
    scrambled: 'T-E  14.8-Z  C-RR-ER  IS  N-T  G-OT-ER-AL;  IT  IS  AN  AR-IF-CI-L  BE-C-N.',
    clear: 'THE 14.8HZ CARRIER IS NOT GEOTHERMAL; IT IS AN ARTIFICIAL BEACON.'
  },
  {
    scrambled: 'DR.  AR-IS  TH-RN-  EX-IL-TR-TED  48GB  FR-M  ST-TI-N  07  BO-EH-LE  4.',
    clear: 'DR. ARIS THORNE EXFILTRATED 48GB FROM STATION 07 BOREHOLE 4.'
  },
  {
    scrambled: 'AL-  140,000  RE-ON-8  UN-TS  WE-E  EN-OM-ED  IN  UT-H  SA-T  VA-LT-S.',
    clear: 'ALL 140,000 RESON-8 UNITS WERE ENTOMBED IN UTAH SALT VAULTS.'
  }
];

/** Tool 03 — BECM self-assessment. Option index + 1 is the recorded answer value. */
export const SYNC_DIAGNOSTIC: { q: string; opts: string[] }[] = [
  {
    q: '1. Do you ever hear rhythmic spoken words or choral harmonies inside the building HVAC ducts?',
    opts: ['Never (0 pts)', 'Occasionally during evening shifts (2 pts)', 'Frequently in quiet rooms (3 pts)']
  },
  {
    q: '2. Have you experienced waking dreams featuring geometric black monoliths rising from ice?',
    opts: ['Never (0 pts)', 'Once or twice after field rotation (2 pts)', 'Regularly every Friday (3 pts)']
  },
  {
    q: '3. What is your emotional response when hearing a sudden 14.8Hz sub-audible tone?',
    opts: [
      'Immediate calm and compliance (3 pts)',
      'Mild curiosity (1 pt)',
      'Acute panic and headache (0 pts)'
    ]
  },
  {
    q: '4. Would you report an immediate colleague if you observed them copying unencrypted files?',
    opts: ['Instantly without hesitation (3 pts)', 'Depends on the colleague (1 pt)', 'No (0 pts)']
  }
];

export const SYNC_PASS_SCORE = 75;

/** Tool 04 — stations cycled by the simulated packet feed. */
export const TELEMETRY_STREAM_STATIONS = [
  'SVALBARD-07',
  'UTAH-SITE19',
  'DIEGO-GARCIA',
  'ATACAMA-05',
  'AZORES-14',
  'TIKSI-17'
];
