import { polarPoint } from './nodeLayout';

// Pure layout for the results job constellation (D-029 Phase F). Every role features exactly 4 jobs,
// so the canonical layout is the Claude Design reference's **4-corner** arrangement: the role center
// in the middle, the four jobs at the corners of a wider-than-tall rectangle (reference NODE_POS,
// scaled to our view), labels below each. For any other count it falls back to an even polar ring.
// Coordinates are in a fixed CONSTELLATION_VIEW space (the field scales them to responsive
// percentages — see ConstellationField). No React, no side effects; unit-tested in
// __tests__/constellationLayout.test.ts. (Reuses polarPoint from nodeLayout for the fallback ring;
// deliberately NOT fanPoints, which arcs a bounded spread and would collide nodes on a full ring.)

/** Logical drawing space for the constellation field. Taller-ish than the reference so the enlarged
 *  corners + their below-labels use the vertical space beside the 404px rail. */
export const CONSTELLATION_VIEW = { width: 1040, height: 760 } as const;

// Geometry defaults, scaled up toward the reference's generous proportions (240px center / 156px
// nodes). The corner offsets place the four nodes at a wide rectangle (reference is wider than tall)
// that fits the view with room for the below-labels to clear the center. The polar fallback is tuned
// so a 5-node ring still fits (adjacent chord at N=5 ≈ 329px > 2·nodeR = 156px).
const DEFAULTS = {
  centerR: 120, // role center circle radius (reference 120)
  nodeR: 78, // job node radius (reference 78)
  cornerDx: 360, // corner node x-offset from center (the ring is wider than tall, per the reference)
  cornerDy: 205, // corner node y-offset from center
  orbit: 280, // polar fallback: distance from center to each node center
  startAngleDeg: -90, // polar fallback: first node straight up
} as const;

export interface ConstellationOptions {
  startAngleDeg?: number;
  orbit?: number;
  nodeR?: number;
  centerR?: number;
  cornerDx?: number;
  cornerDy?: number;
}

export interface ConstellationNodeLayout {
  index: number;
  angleDeg: number;
  cx: number;
  cy: number;
  r: number;
  /** Dashed edge endpoints: from the center rim out to the node rim (both clear of the circles). */
  edge: { x1: number; y1: number; x2: number; y2: number };
}

export interface ConstellationLayout {
  center: { cx: number; cy: number; r: number };
  nodes: ConstellationNodeLayout[];
}

/** Positioned job nodes around the role center for a path with `count` featured jobs. */
export function constellationLayout(
  count: number,
  opts: ConstellationOptions = {},
): ConstellationLayout {
  const centerR = opts.centerR ?? DEFAULTS.centerR;
  const nodeR = opts.nodeR ?? DEFAULTS.nodeR;
  const cx = CONSTELLATION_VIEW.width / 2;
  const cy = CONSTELLATION_VIEW.height / 2;
  const center = { cx, cy, r: centerR };

  // Canonical 4-job layout: four corners of a wide rectangle (reference NODE_POS order: top-left,
  // top-right, bottom-right, bottom-left). Each dashed edge runs rim-to-rim along the center→node line.
  if (count === 4) {
    const dx = opts.cornerDx ?? DEFAULTS.cornerDx;
    const dy = opts.cornerDy ?? DEFAULTS.cornerDy;
    const corners = [
      { x: -dx, y: -dy },
      { x: dx, y: -dy },
      { x: dx, y: dy },
      { x: -dx, y: dy },
    ];
    const nodes: ConstellationNodeLayout[] = corners.map((c, index) => {
      const len = Math.hypot(c.x, c.y);
      const ux = c.x / len;
      const uy = c.y / len;
      return {
        index,
        angleDeg: (Math.atan2(c.y, c.x) * 180) / Math.PI,
        cx: cx + c.x,
        cy: cy + c.y,
        r: nodeR,
        edge: {
          x1: cx + ux * centerR,
          y1: cy + uy * centerR,
          x2: cx + c.x - ux * nodeR,
          y2: cy + c.y - uy * nodeR,
        },
      };
    });
    return { center, nodes };
  }

  // Fallback: an even polar ring for any other count.
  const orbit = opts.orbit ?? DEFAULTS.orbit;
  const startAngleDeg = opts.startAngleDeg ?? DEFAULTS.startAngleDeg;
  const nodes: ConstellationNodeLayout[] = Array.from({ length: Math.max(0, count) }, (_, index) => {
    const angleDeg = startAngleDeg + (index * 360) / count;
    const node = polarPoint(orbit, angleDeg);
    const start = polarPoint(centerR, angleDeg); // center rim
    const end = polarPoint(orbit - nodeR, angleDeg); // node rim
    return {
      index,
      angleDeg,
      cx: cx + node.x,
      cy: cy + node.y,
      r: nodeR,
      edge: { x1: cx + start.x, y1: cy + start.y, x2: cx + end.x, y2: cy + end.y },
    };
  });

  return { center, nodes };
}
