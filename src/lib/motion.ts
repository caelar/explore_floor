// Single source of truth for motion timing (DESIGN_SYSTEM §8). Both engines — Motion
// (state-driven UI) and GSAP (scene choreography) — read these so the feel stays consistent.
// Easing curves are also mirrored into globals.css @theme (ease-soft / ease-snap utilities);
// durations live here because Tailwind v4 has no first-class duration token namespace.
//
// Not exercised in Phase 0 (no animation) — this establishes the seam for Phase 2+.

/** Durations in seconds (the native unit for both GSAP and Motion). */
export const durations = {
  instant: 0.1,
  snap: 0.2,
  glide: 0.4,
  pour: 0.7,
  reveal: 1.0,
} as const;

/** Same durations in milliseconds, for CSS / setTimeout contexts. */
export const durationsMs = {
  instant: 100,
  snap: 200,
  glide: 400,
  pour: 700,
  reveal: 1000,
} as const;

/**
 * Base durations (seconds) for the multi-second "breathe" idle loops on the results screens: the
 * ambient orbs, the bubble/constellation float, and the sparkle twinkle. Deliberately off the UI
 * scale above (which tops out at `reveal` 1s) — these are slow decorative loops, not UI feedback.
 * Each consumer adds its own small per-index/per-rank increment + stagger delay on top of the base.
 */
export const breathe = {
  orb: 7,
  bubble: 5,
  node: 4,
  sparkle: 2.4,
} as const;

/** Cubic-bezier control points. */
export const easings = {
  soft: [0.25, 0.46, 0.45, 0.94],
  snap: [0.5, 0, 0.1, 1.5],
} as const;

/** Motion physical spring for UI (GSAP scene uses its own eases / ease-snap). */
export const spring = { stiffness: 200, damping: 20 } as const;
