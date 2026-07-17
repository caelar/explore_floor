import { MAP_RANK_CLUSTERS } from '@/data/careerMapArt';
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
  careerMapJobNodes,
  careerMapJobs,
  careerMapRemapCameraForViewportResize,
  careerMapRoles,
  careerMapScreenToViewBox,
  careerMapZoom,
  MAP_VIEW,
} from '@/lib/careerMapLayout';

describe('careerMapLayout', () => {
  const ranking: CategoryId[] = ['integrator', 'specialist', 'technician'];
  const matchPercentages: CategoryWeights = { integrator: 60, specialist: 30, technician: 30 };

  it('maps ranking[0] to the closest-match cluster hub', () => {
    const roles = careerMapRoles(ranking, matchPercentages);
    expect(roles[0].category).toBe('integrator');
    expect(roles[0].cx).toBeCloseTo(MAP_RANK_CLUSTERS[0].hub.cx, 1);
    expect(roles[0].r).toBeCloseTo(65.788, 1);
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
      const cmds = connected.match(/[MLHV][^MLHV]*/gi) ?? [];
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
          points.push({ x: x + edge.x, y: y + edge.y });
        } else if (type === 'H') {
          x = nums[0];
          points.push({ x: x + edge.x, y: y + edge.y });
        } else if (type === 'V') {
          y = nums[0];
          points.push({ x: x + edge.x, y: y + edge.y });
        }
      }

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

  it('converts a 1px screen gap to viewBox units from map scale', () => {
    const gap = careerMapEdgeGapViewBox(900, 0.94, 1);
    expect(gap).toBeCloseTo(1.29, 1);
  });

  it('colors edges by the role occupying each rank slot', () => {
    const reordered: CategoryId[] = ['specialist', 'integrator', 'technician'];
    const edges = careerMapEdgeLayouts(reordered, 'overview');
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
    const overview = careerMapCameraForPhase(ranking, 'overview', viewport);
    const role = careerMapCameraForPhase(ranking, 'role', viewport, 'integrator');
    const bounds = careerMapContentBounds(ranking, 'role', 'integrator');

    expect(role.scale).toBeGreaterThan(overview.scale);
    expect(careerMapCirclesFitViewport(bounds, viewport, role)).toBe(true);
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
    const bounds = careerMapContentBounds(ranking, 'overview');
    const fit = careerMapFitScale(viewport);
    const ideal = careerMapCameraForPhase(ranking, 'overview', viewport);
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
    const role = careerMapCameraForPhase(ranking, 'role', viewport, 'integrator');
    const job = careerMapJobs('integrator', ranking.indexOf('integrator'), 'overview')[0];
    const jobCamera = careerMapCameraForPhase(ranking, 'job', viewport, 'integrator', 0);
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
    const prePanel = careerMapCameraForPhase(ranking, 'job', viewport, 'integrator', 0, {
      mapPaneWidth: pane,
      paneOffsetLeft: panel,
    });
    const docked = careerMapCameraForPhase(
      ranking,
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
    const camera = careerMapCameraForPhase(ranking, 'overview', viewport);

    expect(camera.scale).toBeCloseTo(careerMapFitScale(viewport), 2);
  });
});
