/**
 * Colours for <canvas> drawing (oscilloscopes, spectrum bars). Canvas can't
 * read Tailwind classes, so these mirror the tokens in src/styles/tokens.css.
 * Keep the two in sync.
 */
export const CANVAS_COLORS = {
  signal: '#00f0ff', // --color-signal
  phosphor: '#39ff14', // --color-phosphor
  alert: '#ff0055', // --color-alert
  canvas: '#06080e', // --color-canvas
  scope: '#080c14', // oscilloscope well (between void and canvas)
  grid: '#131c2d' // graticule lines
} as const;

/** Standard bottom→top spectrum gradient stops. */
export const SPECTRUM_STOPS: Array<[number, string]> = [
  [0, CANVAS_COLORS.signal],
  [0.6, CANVAS_COLORS.phosphor],
  [1, CANVAS_COLORS.alert]
];
