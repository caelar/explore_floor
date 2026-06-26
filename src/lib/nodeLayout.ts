import type { CategoryId, CategoryWeights } from '@/data/types';
import { CATEGORIES } from '@/data/types';

// Pure geometry for the category results screen (node map + fit radar). No React,
// no units of its own — callers pass radii in their viewBox space and translate
// from the center themselves.

export interface Point {
  x: number;
  y: number;
}

/** Fixed axis per role, shared by the node map and the radar so the two reads orient the
 *  same way. An upward-pointing equilateral triangle: technician at the top, specialist
 *  lower-right, integrator lower-left. */
export const CATEGORY_ANGLES: Record<CategoryId, number> = {
  technician: -90,
  specialist: 30,
  integrator: 150,
};

/** Polar → SVG cartesian around (0,0). SVG y grows downward, so -90° is straight up. */
export function polarPoint(radius: number, angleDeg: number): Point {
  const radians = (angleDeg * Math.PI) / 180;
  return { x: radius * Math.cos(radians), y: radius * Math.sin(radians) };
}

/** Fan `count` points around `baseAngleDeg` at `distance` from `origin`, spread evenly
 *  across `spreadDeg` (a single point goes straight along the base angle). Used to arc the
 *  alternative category nodes (up, behind the active one) and its job-title nodes (down,
 *  off the front). */
export function fanPoints(
  origin: Point,
  baseAngleDeg: number,
  count: number,
  distance: number,
  spreadDeg: number,
): Point[] {
  return Array.from({ length: count }, (_, i) => {
    const angle =
      count === 1 ? baseAngleDeg : baseAngleDeg - spreadDeg / 2 + (spreadDeg * i) / (count - 1);
    const offset = polarPoint(distance, angle);
    return { x: origin.x + offset.x, y: origin.y + offset.y };
  });
}

/** Radar polygon vertices in CATEGORIES order: each category's match percentage
 *  (0-100, clamped) scaled onto its axis. */
export function radarPoints(matchPercentages: CategoryWeights, radius: number): Point[] {
  return CATEGORIES.map((category) => {
    const fraction = Math.min(100, Math.max(0, matchPercentages[category])) / 100;
    return polarPoint(fraction * radius, CATEGORY_ANGLES[category]);
  });
}
