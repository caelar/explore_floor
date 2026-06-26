import { roleDetails } from '@/data';
import type { CategoryWeights } from '@/data/types';
import { CATEGORIES } from '@/data/types';
import { CATEGORY_ANGLES, polarPoint, radarPoints } from '@/lib';

interface FitRadarProps {
  matchPercentages: CategoryWeights;
}

// The "How you fit" graphic on the role sheet (the team's results wireframe 2):
// a three-axis radar (a triangle) — one axis per role, same orientation as the node map —
// with the user's match polygon filled over light gridlines. Static by design.

const RADIUS = 110;
const LABEL_DISTANCE = 132;
const GRID_LEVELS = [25, 50, 75, 100];

const toPointsAttr = (points: { x: number; y: number }[]) =>
  points.map((p) => `${p.x},${p.y}`).join(' ');

// Derived from CATEGORIES so the grid follows the role set (no hardcoded keys to drift).
const gridWeights = (level: number): CategoryWeights =>
  Object.fromEntries(CATEGORIES.map((c) => [c, level])) as CategoryWeights;

export function FitRadar({ matchPercentages }: FitRadarProps) {
  return (
    <svg
      viewBox="-210 -160 420 320"
      className="mx-auto w-full max-w-80"
      role="img"
      aria-label={`How you fit: ${CATEGORIES.map(
        (c) => `${roleDetails[c].roleName} ${matchPercentages[c]}%`,
      ).join(', ')}`}
      data-testid="fit-radar"
    >
      {GRID_LEVELS.map((level) => (
        <polygon
          key={level}
          points={toPointsAttr(radarPoints(gridWeights(level), RADIUS))}
          className="fill-none stroke-border-default"
          strokeWidth={1.5}
        />
      ))}
      <polygon
        points={toPointsAttr(radarPoints(matchPercentages, RADIUS))}
        className="fill-near-black/15 stroke-text-faint"
        strokeWidth={2}
      />
      {CATEGORIES.map((category) => {
        const point = polarPoint(LABEL_DISTANCE, CATEGORY_ANGLES[category]);
        return (
          <text
            key={category}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-text-muted text-[14px]"
          >
            {roleDetails[category].roleName}
          </text>
        );
      })}
    </svg>
  );
}
