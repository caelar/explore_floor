import type { CategoryId, CategoryWeights } from '@/data/types';
import { CATEGORIES } from '@/data/types';

// Pure geometry for the category results screen (node map + fit radar). No React,
// no units of its own — callers pass radii in their viewBox space and translate
// from the center themselves.

export interface Point {
  x: number;
  y: number;
}

/** Fixed axis per category, shared by the node map and the radar so the two reads
 *  orient the same way: operate up, plan right, program down, repair left. */
export const CATEGORY_ANGLES: Record<CategoryId, number> = {
  operate: -90,
  plan: 0,
  program: 90,
  repair: 180,
};

/** Ring radius for a match rank (0 = best = innermost), growing outward evenly. */
export function ringRadius(rank: number, innerRadius: number, gap: number): number {
  return innerRadius + rank * gap;
}

/** Polar → SVG cartesian around (0,0). SVG y grows downward, so -90° is straight up. */
export function polarPoint(radius: number, angleDeg: number): Point {
  const radians = (angleDeg * Math.PI) / 180;
  return { x: radius * Math.cos(radians), y: radius * Math.sin(radians) };
}

/** Radar polygon vertices in CATEGORIES order: each category's match percentage
 *  (0-100, clamped) scaled onto its axis. */
export function radarPoints(matchPercentages: CategoryWeights, radius: number): Point[] {
  return CATEGORIES.map((category) => {
    const fraction = Math.min(100, Math.max(0, matchPercentages[category])) / 100;
    return polarPoint(fraction * radius, CATEGORY_ANGLES[category]);
  });
}
