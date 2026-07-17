import { durations } from '@/lib/motion';

// Figma 433:338 / 437:166 — loading interstitial miniature map stage.

export const LOADING_MAP_STAGE = { width: 475, height: 205 } as const;
export const LOADING_MAP_VIEWPORT = { width: 365.35, height: 189.24 } as const;

/** Mirrors CareerMapField overview entrance — orbs first, then dotted edges. */
export const LOADING_MAP_ENTRANCE = {
  orbStagger: 0.055,
  orbDuration: durations.reveal,
  edgeDelay: 0.42,
  edgeStagger: 0.035,
  edgeDuration: durations.reveal,
} as const;

export const LOADING_MAP_VIEW_PADDING = 28;
