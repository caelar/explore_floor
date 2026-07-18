import { MAP_HUB_SIZING, MAP_RANK_CLUSTERS, type MapEdgeArt } from '@/data/careerMapArt';
import type { CategoryId, CategoryWeights } from '@/data/types';
import {
  careerMapAllJobNodes,
  careerMapCameraForPhase,
  careerMapCirclesFitViewport,
  careerMapClampCamera,
  careerMapConnectedEdgePath,
  careerMapContentBounds,
  careerMapEdgeGapViewBox,
  careerMapEdgeLayouts,
  careerMapEdges,
  careerMapFitScale,
  careerMapHubRadius,
  careerMapJobNodes,
  careerMapJobs,
  careerMapRemapCameraForViewportResize,
  careerMapRoles,
  careerMapScreenToViewBox,
  careerMapZoom,
  MAP_VIEW,
} from '@/lib/careerMapLayout';

/** Resolve an orthogonal path's points to global (viewBox) coordinates. */
function edgePathPoints(d: string, edge: MapEdgeArt): { x: number; y: number }[] {
  const cmds = d.match(/[MLHV][^MLHV]*/gi) ?? [];
  let x = 0;
  let y = 0;
  const points: { x: number; y: number }[] = [];
  for (const cmd of cmds) {
    const type = cmd[0];
    const nums = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    if (type === 'M') {
      x = nums[0];
      y = nums[1];
    } else if (type === 'H') {
      x = nums[0];
    } else if (type === 'V') {
      y = nums[0];
    }
    points.push({ x: x + edge.x, y: y + edge.y });
  }
  return points;
}

describe('careerMapLayout', () => {
  const ranking: CategoryId[] = ['integrator', 'specialist', 'technician'];
  const matchPercentages: CategoryWeights = { integrator: 60, specialist: 30, technician: 30 };

  describe('careerMapHubRadius (CM-05)', () => {
    it('anchors the sizing so a 40% match renders at the Figma hero radius', () => {
      expect(careerMapHubRadius(40)).toBeCloseTo(MAP_RANK_CLUSTERS[0].hub.r, 3);
    });

    it('is area-true: doubling the match doubles the orb area', () => {
      const r40 = careerMapHubRadius(40);
      const r80 = careerMapHubRadius(80);
      expect((r80 * r80) / (r40 * r40)).toBeCloseTo(2, 5);
    });

    it('floors at the Figma small-hub radius and caps for cross-cluster clearance', () => {
      expect(careerMapHubRadius(0)).toBe(MAP_HUB_SIZING.minR);
      expect(careerMapHubRadius(5)).toBe(MAP_HUB_SIZING.minR);
      expect(careerMapHubRadius(100)).toBe(MAP_HUB_SIZING.maxR);
    });

    it('never shrinks as the match grows', () => {
      const radii = [0, 10, 20, 40, 70, 100].map(careerMapHubRadius);
      for (let i = 1; i < radii.length; i += 1) {
        expect(radii[i]).toBeGreaterThanOrEqual(radii[i - 1]);
      }
    });
  });

  it('maps ranking[0] to the closest-match cluster hub, sized by its match %', () => {
    const roles = careerMapRoles(ranking, matchPercentages);
    expect(roles[0].category).toBe('integrator');
    expect(roles[0].cx).toBeCloseTo(MAP_RANK_CLUSTERS[0].hub.cx, 1);
    expect(roles[0].r).toBeCloseTo(careerMapHubRadius(60), 5);
    expect(roles[0].r).toBeGreaterThan(roles[1].r);
  });

  it('renders tied percentages at exactly equal size (CM-05 hard requirement)', () => {
    const roles = careerMapRoles(ranking, matchPercentages);
    expect(matchPercentages[roles[1].category]).toBe(matchPercentages[roles[2].category]);
    expect(roles[1].r).toBe(roles[2].r);
    expect(roles[1].strokeWidth).toBe(roles[2].strokeWidth);
  });

  it('maps ranking[1] and [2] to second and third clusters', () => {
    const roles = careerMapRoles(ranking, matchPercentages);
    expect(roles[1].cx).toBeCloseTo(MAP_RANK_CLUSTERS[1].hub.cx, 1);
    expect(roles[2].cx).toBeCloseTo(MAP_RANK_CLUSTERS[2].hub.cx, 1);
  });

  it('keeps cluster job positions fixed while swapping role at rank 0', () => {
    const integratorJobs = careerMapJobs('integrator', 0, 'overview');
    const specialistTop = careerMapJobs('specialist', 0, 'overview');
    expect(integratorJobs[0].cx).toBeCloseTo(specialistTop[0].cx, 1);
    expect(integratorJobs[0].cx).toBeCloseTo(MAP_RANK_CLUSTERS[0].jobs[0].cx, 1);
  });

  it('returns four job nodes per cluster at Figma size', () => {
    const jobNodes = careerMapJobs('integrator', 0, 'overview');
    expect(jobNodes).toHaveLength(4);
    expect(jobNodes[0].r).toBeCloseTo(19.669, 1);
  });

  it('builds four edges per visible cluster', () => {
    const roles = careerMapRoles(ranking, matchPercentages);
    expect(careerMapEdges(roles, 'overview')).toHaveLength(12);
    expect(careerMapEdges(roles, 'role', 'integrator')).toHaveLength(4);
  });

  it('trims edge paths to stop just outside overview job orbs', () => {
    const cluster = MAP_RANK_CLUSTERS[0];
    const gapVb = 1.25;
    for (const edge of cluster.edges) {
      const connected = careerMapConnectedEdgePath(edge, cluster.hub, cluster.jobs, gapVb);
      const points = edgePathPoints(connected, edge);
      const start = points[0];
      const end = points[points.length - 1];
      const distStartHub = Math.hypot(start.x - cluster.hub.cx, start.y - cluster.hub.cy);
      const distEndHub = Math.hypot(end.x - cluster.hub.cx, end.y - cluster.hub.cy);
      const jobPoint = distStartHub < distEndHub ? end : start;

      let nearestDist = Infinity;
      for (const job of cluster.jobs) {
        nearestDist = Math.min(nearestDist, Math.hypot(jobPoint.x - job.cx, jobPoint.y - job.cy));
      }

      expect(nearestDist).toBeCloseTo(19.669 + gapVb, 1);
    }
  });

  it('re-trims the hub-side endpoint flush onto the live hub radius (CM-05)', () => {
    for (const cluster of MAP_RANK_CLUSTERS) {
      // Floored, art-native, and grown radii; 90 swallows a corner on the second/third
      // cluster art (their inner corner sits ~80vb from the hub center).
      for (const liveR of [MAP_HUB_SIZING.minR, cluster.hub.r, 90]) {
        const hub = { ...cluster.hub, r: liveR };
        for (const edge of cluster.edges) {
          const connected = careerMapConnectedEdgePath(edge, hub, cluster.jobs);
          const points = edgePathPoints(connected, edge);
          const start = points[0];
          const end = points[points.length - 1];
          const dStart = Math.hypot(start.x - hub.cx, start.y - hub.cy);
          const dEnd = Math.hypot(end.x - hub.cx, end.y - hub.cy);
          expect(Math.min(dStart, dEnd)).toBeCloseTo(liveR, 1);
          // No surviving point may sit inside the live circle (swallowed corners drop).
          for (const p of points) {
            expect(Math.hypot(p.x - hub.cx, p.y - hub.cy)).toBeGreaterThanOrEqual(liveR - 0.1);
          }
        }
      }
    }
  });

  it('converts a 1px screen gap to viewBox units from map scale', () => {
    const gap = careerMapEdgeGapViewBox(900, 0.94, 1);
    expect(gap).toBeCloseTo(1.29, 1);
  });

  it('colors edges by the role occupying each rank slot', () => {
    const reordered: CategoryId[] = ['specialist', 'integrator', 'technician'];
    const edges = careerMapEdgeLayouts(reordered, matchPercentages, 'overview');
    const closestEdges = edges.filter((e) => e.rank === 0);
    expect(closestEdges.every((e) => e.category === 'specialist')).toBe(true);
  });

  it('returns twelve job nodes in overview', () => {
    expect(careerMapJobNodes(ranking, 'overview')).toHaveLength(12);
  });

  it('scales overview zoom to fit the viewport height', () => {
    const viewport = { width: 900, height: 500 };
    const fit = careerMapFitScale(viewport);
    const z = careerMapZoom('overview', viewport);
    expect(fit).toBeCloseTo(0.94, 2);
    expect(z.scale).toBeCloseTo(fit, 4);
  });

  it('shrinks the map when the viewport is shorter than map aspect', () => {
    const viewport = { width: 1200, height: 400 };
    const fit = careerMapFitScale(viewport);
    const mapHeight = viewport.width * (MAP_VIEW.height / MAP_VIEW.width);
    expect(fit).toBeLessThan(1);
    expect(fit * mapHeight).toBeCloseTo(viewport.height * 0.94, 0);
  });

  it('zooms to fit the highlighted cluster when a role is focused', () => {
    const viewport = { width: 900, height: 620 };
    const ranking: CategoryId[] = ['specialist', 'integrator', 'technician'];
    const overview = careerMapCameraForPhase(ranking, matchPercentages, 'overview', viewport);
    const role = careerMapCameraForPhase(ranking, matchPercentages, 'role', viewport, 'integrator');
    const bounds = careerMapContentBounds(ranking, matchPercentages, 'role', 'integrator');

    expect(role.scale).toBeGreaterThan(overview.scale);
    expect(careerMapCirclesFitViewport(bounds, viewport, role)).toBe(true);
  });

  it('keeps a sane camera at extreme percentages (all floors, all caps)', () => {
    const viewport = { width: 900, height: 620 };
    for (const pct of [5, 100]) {
      const pcts: CategoryWeights = { integrator: pct, specialist: pct, technician: pct };
      const bounds = careerMapContentBounds(ranking, pcts, 'overview');
      expect(Number.isFinite(bounds.minX)).toBe(true);
      expect(Number.isFinite(bounds.maxY)).toBe(true);

      const overview = careerMapCameraForPhase(ranking, pcts, 'overview', viewport);
      expect(overview.scale).toBeCloseTo(careerMapFitScale(viewport), 2);

      const role = careerMapCameraForPhase(ranking, pcts, 'role', viewport, 'integrator');
      const clusterBounds = careerMapContentBounds(ranking, pcts, 'role', 'integrator');
      expect(careerMapCirclesFitViewport(clusterBounds, viewport, role)).toBe(true);
    }
  });

  it('returns every cluster job node when a role is focused', () => {
    const ranking: CategoryId[] = ['specialist', 'integrator', 'technician'];
    expect(careerMapAllJobNodes(ranking, 'role', 'integrator')).toHaveLength(12);
  });

  it('keeps job orb size at overview scale when a role is highlighted', () => {
    const ranking: CategoryId[] = ['specialist', 'integrator', 'technician'];
    const nodes = careerMapAllJobNodes(ranking, 'role', 'integrator');
    const integratorJobs = nodes.filter((n) => n.category === 'integrator');
    expect(integratorJobs.every((n) => n.r === 19.669)).toBe(true);
  });

  it('clamps pan after zoom-out drift so circles never clip', () => {
    const viewport = { width: 900, height: 620 };
    const ranking: CategoryId[] = ['specialist', 'integrator', 'technician'];
    const bounds = careerMapContentBounds(ranking, matchPercentages, 'overview');
    const fit = careerMapFitScale(viewport);
    const ideal = careerMapCameraForPhase(ranking, matchPercentages, 'overview', viewport);
    const drifted = {
      scale: ideal.scale * 0.75,
      x: ideal.x + 120,
      y: ideal.y + 90,
    };
    const clamped = careerMapClampCamera(bounds, viewport, drifted, {
      minScale: fit * 0.4,
      maxScale: fit * 4.5,
    });

    expect(careerMapCirclesFitViewport(bounds, viewport, clamped)).toBe(true);
  });

  it('zooms tighter on the selected job and centers it in the map pane', () => {
    const viewport = { width: 520, height: 720 };
    const ranking: CategoryId[] = ['specialist', 'integrator', 'technician'];
    const role = careerMapCameraForPhase(ranking, matchPercentages, 'role', viewport, 'integrator');
    const job = careerMapJobs('integrator', ranking.indexOf('integrator'), 'overview')[0];
    const jobCamera = careerMapCameraForPhase(
      ranking,
      matchPercentages,
      'job',
      viewport,
      'integrator',
      0,
    );
    const mapWidth = viewport.width;
    const screenX =
      jobCamera.x + (job.cx / MAP_VIEW.width) * mapWidth * jobCamera.scale;

    expect(jobCamera.scale).toBeGreaterThan(role.scale);
    expect(screenX).toBeCloseTo(viewport.width * 0.5, 0);
  });

  it('frames job zoom for the docked-left panel before the panel opens', () => {
    const viewport = { width: 1200, height: 720 };
    const panel = 696;
    const pane = viewport.width - panel;
    const ranking: CategoryId[] = ['specialist', 'integrator', 'technician'];
    const job = careerMapJobs('integrator', ranking.indexOf('integrator'), 'overview')[0];
    const prePanel = careerMapCameraForPhase(ranking, matchPercentages, 'job', viewport, 'integrator', 0, {
      mapPaneWidth: pane,
      paneOffsetLeft: panel,
    });
    const docked = careerMapCameraForPhase(
      ranking,
      matchPercentages,
      'job',
      { width: pane, height: viewport.height },
      'integrator',
      0,
    );

    const preScreenX =
      prePanel.x + (job.cx / MAP_VIEW.width) * viewport.width * prePanel.scale;
    const dockedScreenX =
      docked.x + (job.cx / MAP_VIEW.width) * pane * docked.scale;

    expect(preScreenX).toBeCloseTo(panel + pane / 2, 0);
    expect(dockedScreenX).toBeCloseTo(pane / 2, 0);
    const preBoundsScreenW =
      ((job.r * 2) / MAP_VIEW.width) * viewport.width * prePanel.scale;
    expect(preBoundsScreenW).toBeLessThanOrEqual(pane - 64 + 1);
  });

  it('remaps the camera when the map viewport shrinks for the job panel lane', () => {
    const from = { width: 1200, height: 720 };
    const to = { width: 504, height: 720 };
    const camera = careerMapCameraForPhase(
      ['specialist', 'integrator', 'technician'],
      matchPercentages,
      'role',
      from,
      'integrator',
    );
    const remapped = careerMapRemapCameraForViewportResize(camera, from, to);
    const centerBefore = careerMapScreenToViewBox(from.width / 2, from.height / 2, from, camera);
    const centerAfter = careerMapScreenToViewBox(to.width / 2, to.height / 2, to, remapped);

    expect(centerBefore.x).toBeCloseTo(centerAfter.x, 2);
    expect(centerBefore.y).toBeCloseTo(centerAfter.y, 2);
    expect(remapped.scale).toBe(camera.scale);
  });

  it('keeps overview camera at the height-fit scale', () => {
    const viewport = { width: 900, height: 500 };
    const ranking: CategoryId[] = ['specialist', 'integrator', 'technician'];
    const camera = careerMapCameraForPhase(ranking, matchPercentages, 'overview', viewport);

    expect(camera.scale).toBeCloseTo(careerMapFitScale(viewport), 2);
  });
});
