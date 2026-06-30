import { CONSTELLATION_VIEW, constellationLayout } from '@/lib/constellationLayout';

// The count-aware polar constellation layout (D-029 Phase F). N job nodes ring the role center on
// an even orbit; every node must stay inside CONSTELLATION_VIEW for the real role counts (3 and 5).

const dist = (ax: number, ay: number, bx: number, by: number) => Math.hypot(ax - bx, ay - by);

describe('constellationLayout', () => {
  it('returns one node per featured job, indexed 0..n-1', () => {
    const { nodes } = constellationLayout(5);
    expect(nodes).toHaveLength(5);
    expect(nodes.map((n) => n.index)).toEqual([0, 1, 2, 3, 4]);
  });

  it('centers the role in CONSTELLATION_VIEW', () => {
    const { center } = constellationLayout(3);
    expect(center.cx).toBe(CONSTELLATION_VIEW.width / 2);
    expect(center.cy).toBe(CONSTELLATION_VIEW.height / 2);
  });

  it('places every node the same orbit distance from the center', () => {
    const { center, nodes } = constellationLayout(5, { orbit: 210 });
    for (const n of nodes) {
      expect(dist(n.cx, n.cy, center.cx, center.cy)).toBeCloseTo(210, 5);
    }
  });

  it('spaces nodes evenly around the ring (360/n apart)', () => {
    const { nodes } = constellationLayout(5);
    for (let i = 1; i < nodes.length; i += 1) {
      expect(nodes[i].angleDeg - nodes[i - 1].angleDeg).toBeCloseTo(72, 5);
    }
  });

  it('draws each edge from the center rim out to the node rim', () => {
    const { center, nodes } = constellationLayout(3, { centerR: 96, nodeR: 64, orbit: 210 });
    for (const n of nodes) {
      expect(dist(n.edge.x1, n.edge.y1, center.cx, center.cy)).toBeCloseTo(96, 5);
      expect(dist(n.edge.x2, n.edge.y2, center.cx, center.cy)).toBeCloseTo(210 - 64, 5);
    }
  });

  it('lays 4 jobs out as four symmetric corners around the center (reference layout)', () => {
    const { center, nodes } = constellationLayout(4);
    expect(nodes).toHaveLength(4);
    // A rectangle's four corners share one distance from the center.
    const radii = nodes.map((n) => dist(n.cx, n.cy, center.cx, center.cy));
    for (const r of radii) expect(r).toBeCloseTo(radii[0], 5);
    // Wider than tall, per the reference (the x-spread exceeds the y-spread).
    const xs = nodes.map((n) => n.cx);
    const ys = nodes.map((n) => n.cy);
    expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(Math.max(...ys) - Math.min(...ys));
  });

  it.each([3, 4, 5])('keeps every node fully inside the view bounds for %i jobs', (count) => {
    for (const n of constellationLayout(count).nodes) {
      expect(n.cx - n.r).toBeGreaterThanOrEqual(0);
      expect(n.cx + n.r).toBeLessThanOrEqual(CONSTELLATION_VIEW.width);
      expect(n.cy - n.r).toBeGreaterThanOrEqual(0);
      expect(n.cy + n.r).toBeLessThanOrEqual(CONSTELLATION_VIEW.height);
    }
  });
});
