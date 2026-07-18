import {
  MAP_CONTEXT_PANEL,
  MAP_HUB_SIZING,
  MAP_JOB_R,
  MAP_RANK_CLUSTERS,
  MAP_STROKE_WIDTH,
  MAP_VIEW,
  type MapEdgeArt,
  type MapHubArt,
  type MapJobArt,
  mapRankCluster,
} from '@/data/careerMapArt';
import type { CategoryId, CategoryWeights } from '@/data/types';

export { MAP_VIEW } from '@/data/careerMapArt';

export type MapPhase = 'overview' | 'role' | 'job';

export interface CareerMapRoleLayout {
  category: CategoryId;
  rank: number;
  cx: number;
  cy: number;
  r: number;
  strokeWidth: number;
}

export interface CareerMapJobLayout {
  category: CategoryId;
  rank: number;
  jobIndex: number;
  cx: number;
  cy: number;
  r: number;
  /** Label-anchor nudge in viewBox units (CM-08) — moves the title, not the orb or its edges. */
  labelDx?: number;
  labelDy?: number;
}

export interface CareerMapEdgeLayout extends MapEdgeArt {
  category: CategoryId;
  rank: number;
}

export interface CareerMapEdge {
  category: CategoryId;
  d: string;
}

export interface CareerMapZoom {
  scale: number;
  focusX: number;
  focusY: number;
}

const ZOOM_JOB_R = 39.337;
const MIN_ZOOM_RATIO = 0.4;
const MAX_ZOOM_RATIO = 4.5;
const CAMERA_PADDING = 44;
/** Shrink auto-fit scale slightly so padding math never clips on float rounding. */
const CAMERA_FIT_FUDGE = 0.992;

/** Job title labels sit below each orb in role/job phases — include in camera bounds. */
export const MAP_JOB_LABEL = {
  halfWidth: 60,
  gapBelow: 6,
  estimatedHeight: 72,
} as const;

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export interface MapBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface MapCamera {
  scale: number;
  x: number;
  y: number;
}

function circleBounds(cx: number, cy: number, r: number): MapBounds {
  return { minX: cx - r, minY: cy - r, maxX: cx + r, maxY: cy + r };
}

function mergeBounds(...parts: MapBounds[]): MapBounds {
  return parts.reduce(
    (acc, b) => ({
      minX: Math.min(acc.minX, b.minX),
      minY: Math.min(acc.minY, b.minY),
      maxX: Math.max(acc.maxX, b.maxX),
      maxY: Math.max(acc.maxY, b.maxY),
    }),
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
  );
}

function jobLabelBounds(cx: number, cy: number, r: number): MapBounds {
  const { halfWidth, gapBelow, estimatedHeight } = MAP_JOB_LABEL;
  return {
    minX: cx - halfWidth,
    minY: cy + r + gapBelow,
    maxX: cx + halfWidth,
    maxY: cy + r + gapBelow + estimatedHeight,
  };
}

/** Scale so the full map fits the viewport height (width-driven aspect). */
export function careerMapFitScale(viewport: { width: number; height: number }): number {
  const mapHeightAtFullWidth = viewport.width * (MAP_VIEW.height / MAP_VIEW.width);
  if (mapHeightAtFullWidth <= 0) return 1;
  return Math.min(1, viewport.height / mapHeightAtFullWidth) * 0.94;
}

/** The Figma art draws one stroke ratio for both hub sizes (1.848/65.788 ≈ 1.276/45.441). */
const HUB_STROKE_RATIO =
  MAP_RANK_CLUSTERS[0].hub.strokeWidth / MAP_RANK_CLUSTERS[0].hub.r;

/**
 * CM-05: area-true hub radius — area ∝ match %, so r = k·√pct. A pure function of pct, which
 * makes tied percentages render identical by construction. The floor keeps the smallest hub at
 * the Figma small-hub size (label legibility); the cap preserves cross-cluster clearance.
 */
export function careerMapHubRadius(pct: number): number {
  const { anchorPct, anchorR, minR, maxR } = MAP_HUB_SIZING;
  const k = anchorR / Math.sqrt(anchorPct);
  const safe = Number.isFinite(pct) ? clamp(pct, 0, 100) : 0;
  return clamp(k * Math.sqrt(safe), minR, maxR);
}

/**
 * Maps user ranking onto three fixed Figma clusters. ranking[0] → closest (large center),
 * ranking[1] → second (lower-right), ranking[2] → third (upper-left). Cluster positions are
 * constant; each hub's size encodes that role's match % (CM-05), so ties read equal.
 */
export function careerMapRoles(
  ranking: CategoryId[],
  matchPercentages: CategoryWeights,
): CareerMapRoleLayout[] {
  return ranking.slice(0, MAP_RANK_CLUSTERS.length).map((category, rank) => {
    const { hub } = mapRankCluster(rank);
    const r = careerMapHubRadius(matchPercentages[category]);
    return {
      category,
      rank,
      cx: hub.cx,
      cy: hub.cy,
      r,
      strokeWidth: r * HUB_STROKE_RATIO,
    };
  });
}

export function careerMapJobs(
  category: CategoryId,
  rank: number,
  phase: MapPhase,
): CareerMapJobLayout[] {
  const cluster = mapRankCluster(rank);
  const r = phase === 'overview' ? MAP_JOB_R : ZOOM_JOB_R;
  return cluster.jobs.map((job, jobIndex) => ({
    category,
    rank,
    jobIndex,
    cx: job.cx,
    cy: job.cy,
    r,
    labelDx: job.labelDx,
    labelDy: job.labelDy,
  }));
}

export function careerMapJobNodes(
  ranking: CategoryId[],
  phase: MapPhase,
  activeCategory?: CategoryId,
): CareerMapJobLayout[] {
  const visible =
    phase === 'overview'
      ? ranking.map((category, rank) => ({ category, rank }))
      : activeCategory
        ? [{ category: activeCategory, rank: ranking.indexOf(activeCategory) }]
        : [];

  return visible.flatMap(({ category, rank }) =>
    rank >= 0 ? careerMapJobs(category, rank, phase) : [],
  );
}

/** Every cluster's jobs at overview size — highlighting never enlarges orbs. */
export function careerMapAllJobNodes(
  ranking: CategoryId[],
  _phase?: MapPhase,
  _activeCategory?: CategoryId,
): CareerMapJobLayout[] {
  return ranking.flatMap((category, rank) =>
    rank >= 0 ? careerMapJobs(category, rank, 'overview') : [],
  );
}

/** Bounds of one role cluster (hub + jobs, optional job labels) for camera fit. */
export function careerMapClusterBounds(
  ranking: CategoryId[],
  matchPercentages: CategoryWeights,
  activeCategory: CategoryId,
  includeJobLabels = false,
): MapBounds {
  const rank = ranking.indexOf(activeCategory);
  if (rank < 0) return careerMapContentBounds(ranking, matchPercentages, 'overview');

  const roles = careerMapRoles(ranking, matchPercentages);
  const activeRole = roles.find((role) => role.category === activeCategory);
  const parts: MapBounds[] = [];

  if (activeRole) {
    parts.push(
      circleBounds(activeRole.cx, activeRole.cy, activeRole.r + activeRole.strokeWidth),
    );
  }

  for (const job of careerMapJobs(activeCategory, rank, 'overview')) {
    parts.push(circleBounds(job.cx, job.cy, job.r + MAP_STROKE_WIDTH));
    if (includeJobLabels) {
      parts.push(jobLabelBounds(job.cx, job.cy, job.r));
    }
  }

  return mergeBounds(...parts);
}

type OrthoCommand = { type: 'M' | 'H' | 'V'; values: number[] };

function parseOrthoCommands(d: string): OrthoCommand[] {
  return (d.match(/[MLHV][^MLHV]*/gi) ?? []).map((cmd) => {
    const type = cmd[0] as OrthoCommand['type'];
    const values = cmd
      .slice(1)
      .trim()
      .split(/[\s,]+/)
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    return { type, values };
  });
}

function orthoCommandsToPoints(cmds: OrthoCommand[]): { x: number; y: number }[] {
  let x = 0;
  let y = 0;
  const points: { x: number; y: number }[] = [];
  for (const cmd of cmds) {
    if (cmd.type === 'M') {
      x = cmd.values[0];
      y = cmd.values[1];
      points.push({ x, y });
    } else if (cmd.type === 'H') {
      x = cmd.values[0];
      points.push({ x, y });
    } else if (cmd.type === 'V') {
      y = cmd.values[0];
      points.push({ x, y });
    }
  }
  return points;
}

function orthoCommandsToD(cmds: OrthoCommand[]): string {
  return cmds
    .map((cmd) => {
      if (cmd.type === 'M') return `M${cmd.values[0]} ${cmd.values[1]}`;
      return `${cmd.type}${cmd.values[0]}`;
    })
    .join('');
}

function setOrthoPoint(cmds: OrthoCommand[], pointIndex: number, point: { x: number; y: number }): void {
  const cmd = cmds[pointIndex];
  if (cmd.type === 'M') {
    cmd.values[0] = point.x;
    cmd.values[1] = point.y;
  } else if (cmd.type === 'H') {
    cmd.values[0] = point.x;
  } else {
    cmd.values[0] = point.y;
  }
}

/** Convert a screen-pixel gap to viewBox units at the current map scale. */
export function careerMapEdgeGapViewBox(
  viewportWidth: number,
  cameraScale: number,
  screenGapPx = 1,
): number {
  const mapWidth = Math.max(viewportWidth, 1);
  const scale = Math.max(cameraScale, 0.01);
  return (MAP_VIEW.width / (mapWidth * scale)) * screenGapPx;
}

/**
 * Trim the job-side endpoint to sit just outside the overview orb (plus optional gap), and the
 * hub-side endpoint flush onto the hub circle. The art bakes hub endpoints onto the fixed Figma
 * radii; with %-sized hubs (CM-05) the live `hub.r` differs, so the hub-nearest point is re-set
 * along its axis-aligned segment — no gap off a floored hub, no line through a grown hub's
 * translucent fill.
 */
export function careerMapConnectedEdgePath(
  edge: MapEdgeArt,
  hub: MapHubArt,
  jobs: readonly MapJobArt[],
  gapVb = 0,
): string {
  const cmds = parseOrthoCommands(edge.d);
  if (cmds.length === 0) return edge.d;

  const localPoints = orthoCommandsToPoints(cmds);
  const lastIdx = localPoints.length - 1;
  const toGlobal = (p: { x: number; y: number }) => ({
    x: p.x + edge.x,
    y: p.y + edge.y,
  });
  const start = toGlobal(localPoints[0]);
  const end = toGlobal(localPoints[lastIdx]);
  const distStartHub = Math.hypot(start.x - hub.cx, start.y - hub.cy);
  const distEndHub = Math.hypot(end.x - hub.cx, end.y - hub.cy);
  const jobPointIdx = distStartHub < distEndHub ? lastIdx : 0;
  const jobPoint = jobPointIdx === lastIdx ? end : start;

  let nearest = jobs[0];
  let nearestDist = Infinity;
  for (const job of jobs) {
    const dist = Math.hypot(jobPoint.x - job.cx, jobPoint.y - job.cy);
    if (dist < nearestDist) {
      nearestDist = dist;
      nearest = job;
    }
  }

  const fromCenterDx = jobPoint.x - nearest.cx;
  const fromCenterDy = jobPoint.y - nearest.cy;
  const fromCenterDist = Math.hypot(fromCenterDx, fromCenterDy);
  if (fromCenterDist < 0.01) return edge.d;

  const targetDist = MAP_JOB_R + gapVb;
  const connectedGlobal = {
    x: nearest.cx + (fromCenterDx / fromCenterDist) * targetDist,
    y: nearest.cy + (fromCenterDy / fromCenterDist) * targetDist,
  };
  const connectedLocal = {
    x: connectedGlobal.x - edge.x,
    y: connectedGlobal.y - edge.y,
  };

  setOrthoPoint(cmds, jobPointIdx, connectedLocal);

  // Hub side. The art bakes endpoints onto the fixed Figma radii, so the live radius needs a
  // re-trim in both directions: a floored hub leaves the endpoint floating outside the circle
  // (pull it in flush), and a grown hub can swallow the endpoint and even whole corners of the
  // path (drop the swallowed points, trim the first crossing segment). Points map 1:1 to
  // commands and every command is absolute, so dropping commands never shifts the rest.
  const hubEndIdx = jobPointIdx === lastIdx ? 0 : lastIdx;
  const step = hubEndIdx === 0 ? 1 : -1;
  const globalPoints = localPoints.map(toGlobal);
  globalPoints[jobPointIdx] = connectedGlobal;
  const insideHub = (p: { x: number; y: number }) =>
    Math.hypot(p.x - hub.cx, p.y - hub.cy) < hub.r;

  let m = hubEndIdx;
  while (m !== jobPointIdx && insideHub(globalPoints[m])) m += step;

  if (m === hubEndIdx) {
    // Endpoint on or outside the circle: pull it in flush along its adjoining axis-aligned
    // segment (no-op within float noise when the radius matches the art).
    const axisCmd = hubEndIdx === 0 ? cmds[1] : cmds[lastIdx];
    if (lastIdx >= 1 && axisCmd && (axisCmd.type === 'H' || axisCmd.type === 'V')) {
      const endpoint = globalPoints[hubEndIdx];
      if (axisCmd.type === 'V') {
        const perp = endpoint.x - hub.cx;
        if (Math.abs(perp) < hub.r) {
          const along = Math.sqrt(hub.r * hub.r - perp * perp);
          const yNew = hub.cy + (Math.sign(endpoint.y - hub.cy) || 1) * along;
          setOrthoPoint(cmds, hubEndIdx, { x: endpoint.x - edge.x, y: yNew - edge.y });
        }
      } else {
        const perp = endpoint.y - hub.cy;
        if (Math.abs(perp) < hub.r) {
          const along = Math.sqrt(hub.r * hub.r - perp * perp);
          const xNew = hub.cx + (Math.sign(endpoint.x - hub.cx) || 1) * along;
          setOrthoPoint(cmds, hubEndIdx, { x: xNew - edge.x, y: endpoint.y - edge.y });
        }
      }
    }
    return orthoCommandsToD(cmds);
  }

  // Grown hub: the crossing segment runs from globalPoints[m - step] (inside) to
  // globalPoints[m] (outside); it is axis-aligned, so keep its fixed coordinate and solve
  // the circle for the other.
  const outside = globalPoints[m];
  const inside = globalPoints[m - step];
  const vertical = Math.abs(outside.x - inside.x) < Math.abs(outside.y - inside.y);
  let crossing: { x: number; y: number };
  if (vertical) {
    const perp = inside.x - hub.cx;
    const along = Math.sqrt(Math.max(hub.r * hub.r - perp * perp, 0));
    crossing = { x: inside.x, y: hub.cy + (Math.sign(outside.y - hub.cy) || 1) * along };
  } else {
    const perp = inside.y - hub.cy;
    const along = Math.sqrt(Math.max(hub.r * hub.r - perp * perp, 0));
    crossing = { x: hub.cx + (Math.sign(outside.x - hub.cx) || 1) * along, y: inside.y };
  }
  const crossingLocal = { x: crossing.x - edge.x, y: crossing.y - edge.y };

  if (hubEndIdx === 0) {
    // Swallowed points 0..m-1 collapse into a new M at the crossing; cmds[m] onward survive.
    const kept = cmds.slice(m);
    kept.unshift({ type: 'M', values: [crossingLocal.x, crossingLocal.y] });
    return orthoCommandsToD(kept);
  }
  // Swallowed points m+1..last drop; cmds[m+1] becomes the crossing segment's new endpoint.
  const kept = cmds.slice(0, m + 2);
  setOrthoPoint(kept, m + 1, crossingLocal);
  return orthoCommandsToD(kept);
}

export function careerMapEdgeLayouts(
  ranking: CategoryId[],
  matchPercentages: CategoryWeights,
  phase: MapPhase,
  activeCategory?: CategoryId,
  edgeGapVb = 0,
): CareerMapEdgeLayout[] {
  const visible =
    phase === 'overview'
      ? ranking.map((category, rank) => ({ category, rank }))
      : activeCategory
        ? [{ category: activeCategory, rank: ranking.indexOf(activeCategory) }]
        : [];

  const edges: CareerMapEdgeLayout[] = [];
  for (const { category, rank } of visible) {
    if (rank < 0) continue;
    const cluster = mapRankCluster(rank);
    const hub = { ...cluster.hub, r: careerMapHubRadius(matchPercentages[category]) };
    for (const edge of cluster.edges) {
      edges.push({
        ...edge,
        category,
        rank,
        d: careerMapConnectedEdgePath(edge, hub, cluster.jobs, edgeGapVb),
      });
    }
  }
  return edges;
}

export function careerMapEdges(
  roles: CareerMapRoleLayout[],
  phase: MapPhase,
  activeCategory?: CategoryId,
): CareerMapEdge[] {
  const visible =
    phase === 'overview' ? roles : roles.filter((role) => role.category === activeCategory);

  return visible.flatMap((role) => {
    const cluster = mapRankCluster(role.rank);
    const hub = { ...cluster.hub, r: role.r };
    return cluster.edges.map((edge) => ({
      category: role.category,
      d: careerMapConnectedEdgePath(edge, hub, cluster.jobs),
    }));
  });
}

/** Bounding box of content the camera should keep in frame for the current phase. */
export function careerMapContentBounds(
  ranking: CategoryId[],
  matchPercentages: CategoryWeights,
  phase: MapPhase,
  activeCategory?: CategoryId,
): MapBounds {
  if (phase === 'overview') {
    const roles = careerMapRoles(ranking, matchPercentages);
    const jobNodes = careerMapAllJobNodes(ranking);
    const parts: MapBounds[] = [];

    for (const role of roles) {
      parts.push(circleBounds(role.cx, role.cy, role.r + role.strokeWidth));
    }
    for (const job of jobNodes) {
      parts.push(circleBounds(job.cx, job.cy, job.r + MAP_STROKE_WIDTH));
    }
    return mergeBounds(...parts);
  }

  if (activeCategory) {
    return careerMapClusterBounds(
      ranking,
      matchPercentages,
      activeCategory,
      phase === 'role' || phase === 'job',
    );
  }

  return careerMapContentBounds(ranking, matchPercentages, 'overview');
}

/** Smallest scale that keeps `bounds` inside the viewport (with padding). */
export function careerMapMinScaleForBounds(
  bounds: MapBounds,
  viewport: { width: number; height: number },
  screenPadding = CAMERA_PADDING,
): number {
  const mapWidth = viewport.width;
  const mapHeight = mapWidth * (MAP_VIEW.height / MAP_VIEW.width);
  const boundsW = Math.max(bounds.maxX - bounds.minX, 1);
  const boundsH = Math.max(bounds.maxY - bounds.minY, 1);
  const availW = Math.max(1, viewport.width - screenPadding * 2);
  const availH = Math.max(1, viewport.height - screenPadding * 2);

  const scaleForW = availW / ((boundsW / MAP_VIEW.width) * mapWidth);
  const scaleForH = availH / ((boundsH / MAP_VIEW.height) * mapHeight);
  return Math.min(scaleForW, scaleForH);
}

export function careerMapPanLimits(
  bounds: MapBounds,
  viewport: { width: number; height: number },
  scale: number,
  screenPadding = CAMERA_PADDING,
): { minX: number; maxX: number; minY: number; maxY: number } {
  const mapWidth = viewport.width;
  const mapHeight = mapWidth * (MAP_VIEW.height / MAP_VIEW.width);

  return {
    minX: screenPadding - (bounds.minX / MAP_VIEW.width) * mapWidth * scale,
    maxX:
      viewport.width -
      screenPadding -
      (bounds.maxX / MAP_VIEW.width) * mapWidth * scale,
    minY: screenPadding - (bounds.minY / MAP_VIEW.height) * mapHeight * scale,
    maxY:
      viewport.height -
      screenPadding -
      (bounds.maxY / MAP_VIEW.height) * mapHeight * scale,
  };
}

/** Fit the camera so all content in `bounds` stays inside the viewport with padding. */
export function careerMapCamera(
  bounds: MapBounds,
  viewport: { width: number; height: number },
  options?: { maxScale?: number; screenPadding?: number },
): MapCamera {
  const fit = careerMapFitScale(viewport);
  const screenPadding = options?.screenPadding ?? CAMERA_PADDING;
  const mapWidth = viewport.width;
  const mapHeight = mapWidth * (MAP_VIEW.height / MAP_VIEW.width);

  const boundsW = Math.max(bounds.maxX - bounds.minX, 1);
  const boundsH = Math.max(bounds.maxY - bounds.minY, 1);
  const availW = Math.max(1, viewport.width - screenPadding * 2);
  const availH = Math.max(1, viewport.height - screenPadding * 2);

  const scaleForW = availW / ((boundsW / MAP_VIEW.width) * mapWidth);
  const scaleForH = availH / ((boundsH / MAP_VIEW.height) * mapHeight);
  const maxZoom = options?.maxScale ?? fit * MAX_ZOOM_RATIO;
  const scale = Math.min(Math.min(scaleForW, scaleForH), maxZoom) * CAMERA_FIT_FUDGE;

  const cx = (bounds.minX + bounds.maxX) / 2;
  const cy = (bounds.minY + bounds.maxY) / 2;
  const x = viewport.width / 2 - (cx / MAP_VIEW.width) * mapWidth * scale;
  const y = viewport.height / 2 - (cy / MAP_VIEW.height) * mapHeight * scale;

  return careerMapClampCamera(bounds, viewport, { scale, x, y }, {
    minScale: scale,
    maxScale: scale,
    screenPadding,
  });
}

/** Pin pan/zoom so visible circles never clip the viewport edges. */
export function careerMapClampCamera(
  bounds: MapBounds,
  viewport: { width: number; height: number },
  camera: MapCamera,
  options?: { minScale?: number; maxScale?: number; screenPadding?: number },
): MapCamera {
  const fit = careerMapFitScale(viewport);
  const screenPadding = options?.screenPadding ?? CAMERA_PADDING;
  const minScale = options?.minScale ?? fit * MIN_ZOOM_RATIO;
  const maxScale = options?.maxScale ?? fit * MAX_ZOOM_RATIO;
  const scale = clamp(camera.scale, minScale, maxScale);
  const limits = careerMapPanLimits(bounds, viewport, scale, screenPadding);

  const xLo = Math.min(limits.minX, limits.maxX);
  const xHi = Math.max(limits.minX, limits.maxX);
  const yLo = Math.min(limits.minY, limits.maxY);
  const yHi = Math.max(limits.minY, limits.maxY);

  return {
    scale,
    x: clamp(camera.x, xLo, xHi),
    y: clamp(camera.y, yLo, yHi),
  };
}

/** Figma 1296:1763 — selected job orb centered in the map pane as the panel floats beside it.
 *  The tighter padding (vs CAMERA_PADDING) is the job zoom's closer framing beat. */
const JOB_CAMERA_PADDING = 32;
const JOB_FOCUS_SCREEN_X = 0.5;

export function careerMapJobFocusBounds(cx: number, cy: number, r: number): MapBounds {
  return mergeBounds(
    circleBounds(cx, cy, r + MAP_STROKE_WIDTH),
    jobLabelBounds(cx, cy, r),
  );
}

/** The viewport rectangle the floating context panel leaves free for the camera (CM-11). */
export interface MapPaneRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export type MapPaneDock = 'left' | 'bottom' | 'none';

/** Pane geometry from the panel constants: 'left' = desktop float, 'bottom' = mobile sheet. */
export function careerMapPaneRect(
  viewport: { width: number; height: number },
  dock: MapPaneDock,
): MapPaneRect {
  if (dock === 'left') {
    const occupied = MAP_CONTEXT_PANEL.margin + MAP_CONTEXT_PANEL.width + MAP_CONTEXT_PANEL.gap;
    return {
      left: occupied,
      top: 0,
      width: Math.max(1, viewport.width - occupied),
      height: viewport.height,
    };
  }
  if (dock === 'bottom') {
    const occupied =
      viewport.height * MAP_CONTEXT_PANEL.mobileMaxHeightRatio + MAP_CONTEXT_PANEL.mobileMargin * 2;
    return {
      left: 0,
      top: 0,
      width: viewport.width,
      height: Math.max(1, viewport.height - occupied),
    };
  }
  return { left: 0, top: 0, width: viewport.width, height: viewport.height };
}

/**
 * Fit `bounds` into a pane of the viewport: scale to the pane's available space, center the
 * bounds (or an explicit `focus` point) at the pane's center. Available space comes from the
 * pane, but scale converts through the rendered map width (the map always renders at viewport
 * width). Pan/zoom stay free afterwards — this only sets the phase target.
 */
export function careerMapCameraForBoundsInPane(
  bounds: MapBounds,
  viewport: { width: number; height: number },
  pane: MapPaneRect,
  options?: { maxScale?: number; screenPadding?: number; focus?: { x: number; y: number } },
): MapCamera {
  const fit = careerMapFitScale(viewport);
  const screenPadding = options?.screenPadding ?? CAMERA_PADDING;
  const mapWidth = viewport.width;
  const mapHeight = mapWidth * (MAP_VIEW.height / MAP_VIEW.width);

  const boundsW = Math.max(bounds.maxX - bounds.minX, 1);
  const boundsH = Math.max(bounds.maxY - bounds.minY, 1);
  const availW = Math.max(1, pane.width - screenPadding * 2);
  const availH = Math.max(1, pane.height - screenPadding * 2);

  const scaleForW = availW / ((boundsW / MAP_VIEW.width) * mapWidth);
  const scaleForH = availH / ((boundsH / MAP_VIEW.height) * mapHeight);
  const maxZoom = options?.maxScale ?? fit * MAX_ZOOM_RATIO;
  const scale = Math.min(Math.min(scaleForW, scaleForH), maxZoom) * CAMERA_FIT_FUDGE;

  const cx = options?.focus?.x ?? (bounds.minX + bounds.maxX) / 2;
  const cy = options?.focus?.y ?? (bounds.minY + bounds.maxY) / 2;
  const x = pane.left + pane.width / 2 - (cx / MAP_VIEW.width) * mapWidth * scale;
  const y = pane.top + pane.height / 2 - (cy / MAP_VIEW.height) * mapHeight * scale;

  return { scale, x, y };
}

/** Zoom and pan so one job orb + label fills the map pane with the orb on screen center. */
export function careerMapCameraForJob(
  job: { cx: number; cy: number; r: number },
  viewport: { width: number; height: number },
  options?: { maxScale?: number; screenPadding?: number; focusScreenX?: number },
): MapCamera {
  const fit = careerMapFitScale(viewport);
  const screenPadding = options?.screenPadding ?? JOB_CAMERA_PADDING;
  const focusScreenX = options?.focusScreenX ?? JOB_FOCUS_SCREEN_X;
  const mapWidth = viewport.width;
  const mapHeight = mapWidth * (MAP_VIEW.height / MAP_VIEW.width);
  const bounds = careerMapJobFocusBounds(job.cx, job.cy, job.r);

  const boundsW = Math.max(bounds.maxX - bounds.minX, 1);
  const boundsH = Math.max(bounds.maxY - bounds.minY, 1);
  const availW = Math.max(1, viewport.width - screenPadding * 2);
  const availH = Math.max(1, viewport.height - screenPadding * 2);

  const scaleForW = availW / ((boundsW / MAP_VIEW.width) * mapWidth);
  const scaleForH = availH / ((boundsH / MAP_VIEW.height) * mapHeight);
  const maxZoom = options?.maxScale ?? fit * MAX_ZOOM_RATIO;
  const scale = Math.min(Math.min(scaleForW, scaleForH), maxZoom) * CAMERA_FIT_FUDGE;

  const focusScreenY = viewport.height / 2;
  const x = viewport.width * focusScreenX - (job.cx / MAP_VIEW.width) * mapWidth * scale;
  const y = focusScreenY - (job.cy / MAP_VIEW.height) * mapHeight * scale;

  return { scale, x, y };
}

export interface CareerMapCameraOptions {
  /** Pane the floating context panel leaves free (CM-11); phase targets fit into it. */
  pane?: MapPaneRect;
}

export function careerMapCameraForPhase(
  ranking: CategoryId[],
  matchPercentages: CategoryWeights,
  phase: MapPhase,
  viewport: { width: number; height: number },
  activeCategory?: CategoryId,
  selectedJobIndex?: number | null,
  options?: CareerMapCameraOptions,
): MapCamera {
  const fit = careerMapFitScale(viewport);
  const mapWidth = viewport.width;
  const mapHeight = mapWidth * (MAP_VIEW.height / MAP_VIEW.width);
  const pane = options?.pane;

  if (phase === 'overview') {
    const bounds = careerMapContentBounds(ranking, matchPercentages, 'overview');
    return careerMapClampCamera(bounds, viewport, {
      scale: fit,
      x: viewport.width / 2 - (mapWidth * fit) / 2,
      y: viewport.height / 2 - (mapHeight * fit) / 2,
    });
  }

  if (phase === 'job' && activeCategory && selectedJobIndex != null) {
    const rank = ranking.indexOf(activeCategory);
    if (rank >= 0) {
      const jobNodes = careerMapJobs(activeCategory, rank, 'overview');
      const job = jobNodes[selectedJobIndex];
      if (job) {
        if (pane) {
          return careerMapCameraForBoundsInPane(
            careerMapJobFocusBounds(job.cx, job.cy, job.r),
            viewport,
            pane,
            { screenPadding: JOB_CAMERA_PADDING, focus: { x: job.cx, y: job.cy } },
          );
        }
        return careerMapCameraForJob(job, viewport);
      }
    }
  }

  if (activeCategory) {
    const bounds = careerMapContentBounds(ranking, matchPercentages, phase, activeCategory);
    if (pane) {
      return careerMapCameraForBoundsInPane(bounds, viewport, pane);
    }
    return careerMapCamera(bounds, viewport);
  }

  const bounds = careerMapContentBounds(ranking, matchPercentages, 'overview');
  return careerMapClampCamera(bounds, viewport, {
    scale: fit,
    x: viewport.width / 2 - (mapWidth * fit) / 2,
    y: viewport.height / 2 - (mapHeight * fit) / 2,
  });
}

/** True when every corner of `bounds` is inside the viewport at the given camera. */
export function careerMapCirclesFitViewport(
  bounds: MapBounds,
  viewport: { width: number; height: number },
  camera: MapCamera,
  screenPadding = CAMERA_PADDING,
): boolean {
  const mapWidth = viewport.width;
  const mapHeight = mapWidth * (MAP_VIEW.height / MAP_VIEW.width);
  const { scale, x, y } = camera;

  const toScreen = (vx: number, vy: number) => ({
    x: x + (vx / MAP_VIEW.width) * mapWidth * scale,
    y: y + (vy / MAP_VIEW.height) * mapHeight * scale,
  });

  const corners = [
    toScreen(bounds.minX, bounds.minY),
    toScreen(bounds.maxX, bounds.minY),
    toScreen(bounds.minX, bounds.maxY),
    toScreen(bounds.maxX, bounds.maxY),
  ];

  return corners.every(
    (p) =>
      p.x >= screenPadding &&
      p.x <= viewport.width - screenPadding &&
      p.y >= screenPadding &&
      p.y <= viewport.height - screenPadding,
  );
}

export function careerMapPointInBounds(
  point: { x: number; y: number },
  bounds: MapBounds,
): boolean {
  return (
    point.x >= bounds.minX &&
    point.x <= bounds.maxX &&
    point.y >= bounds.minY &&
    point.y <= bounds.maxY
  );
}

export function careerMapScreenToViewBox(
  screenX: number,
  screenY: number,
  viewport: { width: number; height: number },
  camera: MapCamera,
): { x: number; y: number } {
  const mapWidth = viewport.width;
  const mapHeight = mapWidth * (MAP_VIEW.height / MAP_VIEW.width);
  return {
    x: ((screenX - camera.x) / (mapWidth * camera.scale)) * MAP_VIEW.width,
    y: ((screenY - camera.y) / (mapHeight * camera.scale)) * MAP_VIEW.height,
  };
}

export function careerMapZoom(
  phase: MapPhase,
  viewport: { width: number; height: number },
  focus?: { cx: number; cy: number },
): CareerMapZoom {
  const fit = careerMapFitScale(viewport);
  const phaseMult: Record<MapPhase, number> = { overview: 1, role: 2.15, job: 3.4 };
  const scale = fit * phaseMult[phase];
  const fx = focus?.cx ?? MAP_VIEW.width / 2;
  const fy = focus?.cy ?? MAP_VIEW.height / 2;
  const biasX = phase === 'job' ? viewport.width * 0.22 : 0;
  return {
    scale,
    focusX: viewport.width / 2 - fx * scale + biasX,
    focusY: viewport.height / 2 - fy * scale,
  };
}

export function jobMapPosition(
  category: CategoryId,
  jobIndex: number,
  ranking: CategoryId[],
): { cx: number; cy: number } {
  const rank = ranking.indexOf(category);
  const jobs = careerMapJobs(category, rank >= 0 ? rank : 0, 'overview');
  return jobs[jobIndex] ?? jobs[0];
}

export function orthogonalEdge(
  role: { cx: number; cy: number },
  job: { cx: number; cy: number },
): string {
  return `M ${role.cx} ${role.cy} H ${job.cx} V ${job.cy}`;
}

export { MAP_RANK_CLUSTERS, mapRankCluster };
