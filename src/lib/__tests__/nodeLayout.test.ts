import { CATEGORIES, type CategoryWeights } from '@/data/types';
import { CATEGORY_ANGLES, polarPoint, radarPoints, ringRadius } from '@/lib/nodeLayout';

describe('ringRadius', () => {
  it('places rank 0 innermost and grows monotonically with rank', () => {
    const radii = [0, 1, 2, 3].map((rank) => ringRadius(rank, 80, 70));
    expect(radii[0]).toBe(80);
    for (let i = 1; i < radii.length; i++) {
      expect(radii[i]).toBeGreaterThan(radii[i - 1]);
    }
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
  const weights: CategoryWeights = { operate: 100, repair: 50, program: 0, plan: 100 };

  it('returns one vertex per category in CATEGORIES order', () => {
    const points = radarPoints(weights, 200);
    expect(points).toHaveLength(CATEGORIES.length);
    // operate (100%) sits at full radius on its axis; program (0%) collapses to center.
    expect(Math.hypot(points[0].x, points[0].y)).toBeCloseTo(200);
    expect(Math.hypot(points[2].x, points[2].y)).toBeCloseTo(0);
  });

  it('scales vertices linearly with the match percentage', () => {
    const points = radarPoints(weights, 200);
    expect(Math.hypot(points[1].x, points[1].y)).toBeCloseTo(100); // repair 50%
  });

  it('clamps out-of-range percentages into 0-100', () => {
    const points = radarPoints({ operate: 150, repair: -20, program: 0, plan: 0 }, 200);
    expect(Math.hypot(points[0].x, points[0].y)).toBeCloseTo(200);
    expect(Math.hypot(points[1].x, points[1].y)).toBeCloseTo(0);
  });
});
