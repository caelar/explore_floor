import { CATEGORIES, type CategoryWeights } from '@/data/types';
import { CATEGORY_ANGLES, fanPoints, polarPoint, radarPoints } from '@/lib/nodeLayout';

describe('fanPoints', () => {
  it('places a single point straight along the base angle', () => {
    const [p] = fanPoints({ x: 100, y: 50 }, 0, 1, 80, 140);
    expect(p.x).toBeCloseTo(180);
    expect(p.y).toBeCloseTo(50);
  });

  it('spreads n points symmetrically around the base angle at the given distance', () => {
    const origin = { x: 0, y: 0 };
    const points = fanPoints(origin, 90, 3, 100, 120);
    expect(points).toHaveLength(3);
    for (const p of points) {
      expect(Math.hypot(p.x - origin.x, p.y - origin.y)).toBeCloseTo(100);
    }
    // Middle point sits on the base angle (straight down, +y); flanks mirror in x.
    expect(points[1].x).toBeCloseTo(0);
    expect(points[1].y).toBeCloseTo(100);
    expect(points[0].x).toBeCloseTo(-points[2].x);
    expect(points[0].y).toBeCloseTo(points[2].y);
  });
});

describe('polarPoint', () => {
  it('maps -90° to straight up in SVG space (y negative)', () => {
    const p = polarPoint(100, -90);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(-100);
  });

  it('maps 0° to the right', () => {
    const p = polarPoint(100, 0);
    expect(p.x).toBeCloseTo(100);
    expect(p.y).toBeCloseTo(0);
  });
});

describe('CATEGORY_ANGLES', () => {
  it('gives every category a distinct axis', () => {
    const angles = CATEGORIES.map((c) => CATEGORY_ANGLES[c]);
    expect(new Set(angles).size).toBe(CATEGORIES.length);
  });
});

describe('radarPoints', () => {
  const weights: CategoryWeights = { technician: 100, specialist: 50, integrator: 0 };

  it('returns one vertex per role in CATEGORIES order', () => {
    const points = radarPoints(weights, 200);
    expect(points).toHaveLength(CATEGORIES.length);
    // technician (100%) sits at full radius on its axis; integrator (0%) collapses to center.
    expect(Math.hypot(points[0].x, points[0].y)).toBeCloseTo(200);
    expect(Math.hypot(points[2].x, points[2].y)).toBeCloseTo(0);
  });

  it('scales vertices linearly with the match percentage', () => {
    const points = radarPoints(weights, 200);
    expect(Math.hypot(points[1].x, points[1].y)).toBeCloseTo(100); // specialist 50%
  });

  it('clamps out-of-range percentages into 0-100', () => {
    const points = radarPoints({ technician: 150, specialist: -20, integrator: 0 }, 200);
    expect(Math.hypot(points[0].x, points[0].y)).toBeCloseTo(200);
    expect(Math.hypot(points[1].x, points[1].y)).toBeCloseTo(0);
  });
});
