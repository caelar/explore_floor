// Loading interstitial between the narrative quiz and results (Figma Quiz-Sketches-Assets 432:323).
// Status lines rotate as the faux progress bar advances; tuned in data, not component logic.

export const loadingCopy = {
  /** Total simulated load time (ms) before the progress bar reaches 100%. */
  durationMs: 3500,
  /** Hold at 100% before fading out to results (ms). */
  lingerMs: 700,
  /** Status lines shown in order as progress crosses each quarter. */
  messages: [
    'Coding programs...',
    'Calibrating sensors...',
    'Mapping career paths...',
    'Analyzing your choices...',
  ],
} as const;
