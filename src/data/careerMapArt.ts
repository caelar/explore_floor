import type { CategoryId } from '@/data/types';

// Career map art from Figma 1289:394 (groups: "Closest match", "Second closest match",
// "Third closest match"). Each group is a fixed shape — hub, four job orbs, branch paths. User
// results only decide which role name/color/% fills each rank slot (0 = closest, 1 = second, 2 = third).

export const MAP_VIEW = { width: 1094.663, height: 567 } as const;

export const MAP_ORB_FILL_OPACITY = 0.3;
/** Figma 1349:312 — selected job orb is a solid role-colored fill. */
export const MAP_SELECTED_ORB_FILL_OPACITY = 1;
export const MAP_STROKE_OPACITY = 0.3;
export const MAP_STROKE_WIDTH = 1.35646;
export const MAP_STROKE_DASH = '2.71 2.71';

/** Figma 1296:1661 — when one role is focused, its paths pop and other clusters recede. */
export const MAP_ACTIVE_EDGE_OPACITY = 0.75;
export const MAP_INACTIVE_EDGE_OPACITY = 0.18;
export const MAP_INACTIVE_CLUSTER_OPACITY = 0.38;

/** CM-06: job dots recede at overview so the role hubs lead; zooming in (or hovering a dot)
 *  brings them up on the same ramp that reveals their labels. */
export const MAP_OVERVIEW_JOB_DIM_OPACITY = 0.25;

/** CM-06: distinct hub glyph per role (Material Icons ligatures; the font is self-hosted, so
 *  verify new glyphs render). The mockup's set: hands-on robot arm / code brackets / planning
 *  clipboard, mapped to the roles' entry / mid-technical / planning tiers. */
export const MAP_HUB_ICON: Record<CategoryId, string> = {
  technician: 'precision_manufacturing',
  specialist: 'code',
  integrator: 'assignment',
};

/**
 * Figma 1349:312 — job title size relative to job-orb diameter in job-selected view.
 * Measured from the editable capture (32px title on ~120px orb in job-selected view).
 */
export const MAP_JOB_LABEL_RATIO = {
  selected: 32 / 119.925,
  selectedLine: 38 / 119.925,
  selectedWidth: 224 / 119.925,
  /** Gap between orb edge and label, as a fraction of orb diameter. */
  gap: 0.25,
} as const;

/** CM-10/11: the floating context panel (role + job zoom). Floats with margin on all sides —
 *  never edge-docked — and the camera fits the cluster into the pane it leaves free. Width sits
 *  between the old rail (404) and the old docked lane (696): wide enough for the three job tabs,
 *  narrow enough to leave a real map pane at 1024+. */
export const MAP_CONTEXT_PANEL = {
  width: 460,
  margin: 16, // --spacing-space-3
  gap: 16, // between the panel edge and the camera pane
  mobileMaxHeightRatio: 0.55,
  mobileMargin: 12, // --spacing-space-2
} as const;

/** CM-10 beat: at job zoom the selected orb stays lit while its cluster siblings recede. */
export const MAP_JOB_SIBLING_ORB_OPACITY = 0.55;

/** Figma 1296:1669 — hub label auto-layout ratios relative to bubble diameter. */
export const MAP_BUBBLE_LABEL = {
  contentWidth: 192.19 / 263.153,
  gap: 7.392 / 263.153,
  icon: 46.569 / 263.153,
  name: 17.741 / 263.153,
  pct: 41.395 / 263.153,
  nameLine: 23.654 / 17.741,
  pctLine: 47.308 / 41.395,
} as const;

/** Role colors on the map — kit tokens (technician gold, specialist teal, integrator orange). */
export const MAP_ROLE_COLOR: Record<CategoryId, string> = {
  technician: 'var(--color-role-technician-soft)',
  specialist: 'var(--color-role-specialist-soft)',
  integrator: 'var(--color-role-integrator-soft)',
};

/** Resolved hex for SVG text fills (CSS vars are unreliable on SVG text). */
export const MAP_ROLE_COLOR_HEX: Record<CategoryId, string> = {
  technician: '#ffd27a',
  specialist: '#7fe0f2',
  integrator: '#f2965a',
};

/** Ink on accent fills — mirrors @theme --color-near-black (a Motion-animated SVG fill needs a literal). */
export const MAP_INK_HEX = '#262626';

/** Hover glow on job orbs — mirrors @theme --color-role-*-glow tokens. */
export const MAP_JOB_GLOW_HEX: Record<CategoryId, string> = {
  technician: '#ffb81c',
  specialist: '#7fe0f2',
  integrator: '#f2965a',
};

export interface MapHubArt {
  cx: number;
  cy: number;
  r: number;
  strokeWidth: number;
}

export interface MapJobArt {
  cx: number;
  cy: number;
  /** Optional label-anchor nudge in viewBox units (CM-08) — shifts the job title away from a
   *  dashed edge without moving the orb or its edge geometry. */
  labelDx?: number;
  labelDy?: number;
}

export interface MapEdgeArt {
  x: number;
  y: number;
  width: number;
  height: number;
  d: string;
}

export interface MapRankCluster {
  /** Figma group label for reference. */
  label: 'closest' | 'second' | 'third';
  hub: MapHubArt;
  jobs: readonly MapJobArt[];
  edges: readonly MapEdgeArt[];
}

export const MAP_JOB_R = 19.669;

/** Three fixed clusters — geometry never changes; ranking only swaps role labels onto each slot. */
export const MAP_RANK_CLUSTERS: readonly MapRankCluster[] = [
  {
    label: 'closest',
    hub: { cx: 577.173, cy: 251.623, r: 65.788, strokeWidth: 1.848 },
    jobs: [
      { cx: 813.197, cy: 187.87 },
      { cx: 426.607, cy: 99.7 },
      { cx: 337.08, cy: 381.844 },
      { cx: 578.53, cy: 467.3 },
    ],
    edges: [
      { x: 446.275, y: 100.378, width: 131.577, height: 86.813, d: 'M130.898 86.8134V0.67823H0' },
      { x: 579.208, y: 316.733, width: 1.356, height: 130.898, d: 'M0.67823 0V130.898' },
      { x: 356.071, y: 256.371, width: 157.349, height: 126.829, d: 'M157.349 0.67823H53.5801V126.151H0' },
      { x: 642.284, y: 188.548, width: 151.245, height: 67.823, d: 'M0 67.1447H117.334V0.67823H151.245' },
    ],
  },
  {
    label: 'second',
    hub: { cx: 813.197, cy: 402.19, r: 45.441, strokeWidth: 1.276 },
    jobs: [
      { cx: 921.714, cy: 214.999 },
      { cx: 1074.994, cy: 400.834 },
      { cx: 647.71, cy: 361.497 },
      { cx: 653.135, cy: 547.331 },
    ],
    edges: [
      { x: 812.519, y: 233.989, width: 111.23, height: 123.438, d: 'M0.67823 123.438V39.3373H110.551V0' },
      { x: 666.7, y: 361.496, width: 101.734, height: 42.729, d: 'M101.734 42.0502H66.4665V0.67823H0' },
      { x: 858.639, y: 400.834, width: 196.008, height: 1.356, d: 'M0 0.67823H196.008' },
      { x: 672.804, y: 447.632, width: 143.106, height: 101.056, d: 'M142.428 0V100.378H0' },
    ],
  },
  {
    label: 'third',
    hub: { cx: 185.156, cy: 206.86, r: 45.441, strokeWidth: 1.276 },
    jobs: [
      { cx: 423.894, cy: 479.508 },
      { cx: 347.932, cy: 206.86 },
      { cx: 293.674, cy: 19.669 },
      { cx: 19.669, cy: 166.167 },
    ],
    edges: [
      { x: 184.478, y: 38.659, width: 111.23, height: 123.438, d: 'M0.67823 123.438V39.3373H110.551V0' },
      { x: 38.659, y: 166.166, width: 101.734, height: 42.729, d: 'M101.734 42.0502H66.4665V0.67823H0' },
      { x: 230.598, y: 206.182, width: 97.665, height: 1.356, d: 'M0 0.67823H97.6651' },
      { x: 184.478, y: 252.302, width: 220.425, height: 227.885, d: 'M0.67823 0V227.207H220.425' },
    ],
  },
] as const;

/** CM-05: area-true hub sizing — r = k·√pct, anchored so a 40% match renders at the Figma
 *  hero radius. Floor = the Figma small-hub radius (the label layout's proven worst case);
 *  cap keeps the biggest hub clear of the nearest cross-cluster job dot (closest hub → the
 *  second cluster's inner dot is 130.6vb away, so r 100 leaves ~11vb of daylight). */
export const MAP_HUB_SIZING = {
  anchorPct: 40,
  anchorR: MAP_RANK_CLUSTERS[0].hub.r,
  minR: MAP_RANK_CLUSTERS[1].hub.r,
  maxR: 100,
} as const;

/** @deprecated Use MAP_RANK_CLUSTERS[rank].hub */
export const MAP_ROLE_SLOTS = MAP_RANK_CLUSTERS.map((c) => c.hub);

export function mapRankCluster(rank: number): MapRankCluster {
  return MAP_RANK_CLUSTERS[rank] ?? MAP_RANK_CLUSTERS[0];
}
