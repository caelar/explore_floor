import { animate, AnimatePresence, motion, useMotionValue, useMotionValueEvent } from 'motion/react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { jobs } from '@/data';
import {
  MAP_ACTIVE_EDGE_OPACITY,
  MAP_INACTIVE_CLUSTER_OPACITY,
  MAP_INACTIVE_EDGE_OPACITY,
  MAP_JOB_GLOW_HEX,
  MAP_JOB_LABEL_RATIO,
  MAP_ORB_FILL_OPACITY,
  MAP_ROLE_COLOR,
  MAP_ROLE_COLOR_HEX,
  MAP_SELECTED_ORB_FILL_OPACITY,
  MAP_STROKE_DASH,
  MAP_STROKE_OPACITY,
  MAP_STROKE_WIDTH,
} from '@/data/careerMapArt';
import type { CategoryId, CategoryWeights, Job } from '@/data/types';
import {
  careerMapAllJobNodes,
  careerMapCameraForPhase,
  careerMapClusterBounds,
  careerMapEdgeGapViewBox,
  careerMapEdgeLayouts,
  careerMapFitScale,
  careerMapPointInBounds,
  careerMapRemapCameraForViewportResize,
  careerMapRoles,
  careerMapScreenToViewBox,
  durations,
  easings,
  MAP_VIEW,
  type MapCamera,
  type MapPhase,
} from '@/lib';

import { CareerMapHubLabel } from './CareerMapHubLabel';
import { CareerMapOrbGlow } from './CareerMapOrbGlow';
import { CareerMapTargetJobOrb } from './CareerMapTargetJobOrb';

// Figma 1289:394 — infinite canvas; phase transitions animate focus to the active cluster, then
// pan and zoom stay free (no content-bounds clamp on drag or scroll). Clicks outside deselect.

interface CareerMapFieldProps {
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  phase: MapPhase;
  activeRoleIndex: number;
  selectedJob: number | null;
  targetJobId?: string | null;
  reduce: boolean;
  onSelectRole: (rank: number) => void;
  onSelectJob: (rank: number, jobIndex: number) => void;
  onDeselectRole?: () => void;
  onDeselectJob?: () => void;
  onExplore?: () => void;
  /** Fires when a phase camera glide finishes (used to defer the job panel until zoom lands). */
  onCameraTransitionEnd?: () => void;
  /** Fires when the overview entrance sequence finishes (orbs → edges). */
  onEntranceComplete?: () => void;
}

const { width: VW, height: VH } = MAP_VIEW;
const xPct = (v: number) => `${(v / VW) * 100}%`;
const yPct = (v: number) => `${(v / VH) * 100}%`;
const MIN_ZOOM_RATIO = 0.4;
const MAX_ZOOM_RATIO = 4.5;
const CLICK_DRAG_THRESHOLD_PX = 6;
const jobNodeKey = (category: CategoryId, jobIndex: number) => `${category}-${jobIndex}`;
/** Fade job titles in between ~12% and ~28% of the fit-to-max zoom range. */
const JOB_LABEL_ZOOM_FADE = { start: 0.12, end: 0.28 } as const;
/** Phase camera glide — job zoom completes before the side panel docks. */
const MAP_CAMERA_DURATION = {
  overview: durations.glide,
  role: durations.glide,
  job: durations.pour,
} as const satisfies Record<MapPhase, number>;
/** Overview load-in: orbs grow, then dotted edges draw, then the intro card (CareerMap). */
const MAP_ENTRANCE = {
  orbStagger: 0.055,
  orbDuration: durations.reveal,
  edgeDelay: 0.42,
  edgeStagger: 0.035,
  edgeDuration: durations.reveal,
  introHandoff: 0.12,
} as const;
type MapEntranceStage = 'orbs' | 'edges' | 'complete';
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const focusFadeTransition = (reduce: boolean) =>
  reduce ? { duration: durations.instant } : { duration: durations.glide, ease: easings.soft };

function jobLabelOpacityFromZoom(
  currentScale: number,
  fitScale: number,
  maxZoom: number,
  reduce: boolean,
): number {
  const range = maxZoom - fitScale;
  if (range <= 0) return 0;
  const t = (currentScale - fitScale) / range;
  if (reduce) return t >= JOB_LABEL_ZOOM_FADE.start ? 1 : 0;
  return clamp(
    (t - JOB_LABEL_ZOOM_FADE.start) / (JOB_LABEL_ZOOM_FADE.end - JOB_LABEL_ZOOM_FADE.start),
    0,
    1,
  );
}

export function CareerMapField({
  ranking,
  matchPercentages,
  phase,
  activeRoleIndex,
  selectedJob,
  targetJobId = null,
  reduce,
  onSelectRole,
  onSelectJob,
  onDeselectRole,
  onDeselectJob,
  onExplore,
  onCameraTransitionEnd,
  onEntranceComplete,
}: CareerMapFieldProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const cameraAnimRef = useRef<ReturnType<typeof animate>[]>([]);
  const exploredRef = useRef(false);
  const entrancePlayedRef = useRef(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const jobZoomCompleteRef = useRef(false);
  const preJobViewportRef = useRef<{ width: number; height: number } | null>(null);
  const jobRemapPendingRef = useRef(false);
  const prevPhaseRef = useRef<MapPhase>(phase);
  const [viewport, setViewport] = useState({ width: 900, height: 420 });
  const [zoomLabelOpacity, setZoomLabelOpacity] = useState(0);
  const [cameraScale, setCameraScale] = useState(1);
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);
  const [hoveredHub, setHoveredHub] = useState<CategoryId | null>(null);
  const [entranceStage, setEntranceStage] = useState<MapEntranceStage>(
    reduce ? 'complete' : 'orbs',
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setViewport({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const syncViewportSize = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setViewport({ width, height });
  }, []);

  useLayoutEffect(() => {
    syncViewportSize();
  }, [phase, syncViewportSize]);

  useLayoutEffect(() => {
    if (prevPhaseRef.current === 'role' && phase === 'job') {
      jobRemapPendingRef.current = true;
    }
    if (phase !== 'job') {
      jobRemapPendingRef.current = false;
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  useLayoutEffect(() => {
    if (phase === 'role') {
      preJobViewportRef.current = viewport;
    } else if (phase !== 'job') {
      preJobViewportRef.current = null;
    }
  }, [phase, viewport]);

  useLayoutEffect(() => {
    if (!jobRemapPendingRef.current || phase !== 'job' || reduce) return;

    const prior = preJobViewportRef.current;
    if (!prior) return;
    if (prior.width === viewport.width && prior.height === viewport.height) return;

    const remapped = careerMapRemapCameraForViewportResize(
      { x: x.get(), y: y.get(), scale: scale.get() },
      prior,
      viewport,
    );
    x.set(remapped.x);
    y.set(remapped.y);
    jobRemapPendingRef.current = false;
    preJobViewportRef.current = null;
  }, [phase, viewport, reduce, x, y, scale]);

  const roles = careerMapRoles(ranking, matchPercentages);
  const activeCategory = ranking[activeRoleIndex];

  const mapWidth = viewport.width;
  const mapHeight = mapWidth * (VH / VW);
  const fitScale = careerMapFitScale(viewport);
  const minZoom = fitScale * MIN_ZOOM_RATIO;
  const maxZoom = fitScale * MAX_ZOOM_RATIO;

  const syncZoomLabelOpacity = useCallback(
    (currentScale: number) => {
      setZoomLabelOpacity(jobLabelOpacityFromZoom(currentScale, fitScale, maxZoom, reduce));
    },
    [fitScale, maxZoom, reduce],
  );

  useMotionValueEvent(scale, 'change', syncZoomLabelOpacity);
  useMotionValueEvent(scale, 'change', setCameraScale);

  useEffect(() => {
    syncZoomLabelOpacity(scale.get());
    setCameraScale(scale.get());
  }, [syncZoomLabelOpacity, scale]);

  const activeClusterBounds = useMemo(
    () =>
      phase === 'overview' || !activeCategory
        ? null
        : careerMapClusterBounds(ranking, activeCategory, phase === 'role' || phase === 'job'),
    [ranking, phase, activeCategory],
  );

  const applyFreeCamera = useCallback(
    (camera: MapCamera) => {
      const nextScale = clamp(camera.scale, minZoom, maxZoom);
      x.set(camera.x);
      y.set(camera.y);
      scale.set(nextScale);
      return { ...camera, scale: nextScale };
    },
    [minZoom, maxZoom, x, y, scale],
  );

  const jobCameraKey =
    phase === 'job' && selectedJob !== null ? `${activeRoleIndex}-${selectedJob}` : null;

  useEffect(() => {
    if (!jobCameraKey) {
      jobZoomCompleteRef.current = false;
      return;
    }
    jobZoomCompleteRef.current = false;
  }, [jobCameraKey]);

  const phaseCamera = useMemo(
    () =>
      careerMapCameraForPhase(
        ranking,
        phase,
        viewport,
        phase === 'overview' ? undefined : activeCategory,
        phase === 'job' ? selectedJob : null,
      ),
    [ranking, phase, viewport, activeCategory, selectedJob],
  );

  const cancelCameraAnimation = useCallback(() => {
    cameraAnimRef.current.forEach((ctrl) => ctrl.stop());
    cameraAnimRef.current = [];
  }, []);

  const notifyExplore = useCallback(() => {
    if (phase !== 'overview' || exploredRef.current) return;
    exploredRef.current = true;
    onExplore?.();
  }, [phase, onExplore]);

  const handleMapBackgroundClick = useCallback(
    (clientX: number, clientY: number) => {
      if (!viewportRef.current || !activeClusterBounds) return;
      const rect = viewportRef.current.getBoundingClientRect();
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      const camera: MapCamera = { x: x.get(), y: y.get(), scale: scale.get() };
      const point = careerMapScreenToViewBox(localX, localY, viewport, camera);
      if (careerMapPointInBounds(point, activeClusterBounds)) return;
      onDeselectRole?.();
    },
    [activeClusterBounds, viewport, x, y, scale, onDeselectRole],
  );

  useEffect(() => {
    if (phase === 'overview') exploredRef.current = false;
  }, [phase]);

  useEffect(() => {
    cancelCameraAnimation();
    const target = phaseCamera;
    const cameraDuration = reduce
      ? durations.instant
      : phase === 'job' && jobZoomCompleteRef.current
        ? durations.instant
        : MAP_CAMERA_DURATION[phase];

    if (reduce) {
      x.set(target.x);
      y.set(target.y);
      scale.set(target.scale);
      if (phase === 'job' && !jobZoomCompleteRef.current) {
        jobZoomCompleteRef.current = true;
        onCameraTransitionEnd?.();
      }
      return;
    }

    let pending = 3;
    const onAxisDone = () => {
      pending -= 1;
      if (pending > 0) return;
      if (phase === 'job' && !jobZoomCompleteRef.current) {
        jobZoomCompleteRef.current = true;
        onCameraTransitionEnd?.();
      }
    };

    cameraAnimRef.current = [
      animate(x, target.x, { duration: cameraDuration, ease: easings.soft, onComplete: onAxisDone }),
      animate(y, target.y, { duration: cameraDuration, ease: easings.soft, onComplete: onAxisDone }),
      animate(scale, target.scale, { duration: cameraDuration, ease: easings.soft, onComplete: onAxisDone }),
    ];
    return cancelCameraAnimation;
  }, [phaseCamera, reduce, phase, selectedJob, x, y, scale, onCameraTransitionEnd, cancelCameraAnimation]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;

      cancelCameraAnimation();

      const currentScale = scale.get();
      const currentX = x.get();
      const currentY = y.get();
      const zoomFactor = Math.exp(-event.deltaY * 0.001);
      const nextScale = clamp(currentScale * zoomFactor, minZoom, maxZoom);
      if (nextScale === currentScale) return;

      if (nextScale > currentScale) notifyExplore();

      const ratio = nextScale / currentScale;
      applyFreeCamera({
        scale: nextScale,
        x: pointerX - (pointerX - currentX) * ratio,
        y: pointerY - (pointerY - currentY) * ratio,
      });
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [scale, x, y, minZoom, maxZoom, applyFreeCamera, cancelCameraAnimation, notifyExplore]);

  const edgeGapVb = useMemo(
    () => careerMapEdgeGapViewBox(viewport.width, cameraScale, 1),
    [viewport.width, cameraScale],
  );

  const edges = useMemo(
    () => careerMapEdgeLayouts(ranking, 'overview', undefined, edgeGapVb),
    [ranking, edgeGapVb],
  );
  const roleJobs = careerMapAllJobNodes(ranking, phase, activeCategory);

  const orbEntranceIndex = useMemo(() => {
    const index = new Map<string, number>();
    roles.forEach((role, i) => index.set(`hub-${role.category}`, i));
    roleJobs.forEach((node, i) => {
      index.set(jobNodeKey(node.category, node.jobIndex), roles.length + i);
    });
    return index;
  }, [roles, roleJobs]);

  const entrancePlaying = phase === 'overview' && !reduce && entranceStage !== 'complete';

  useEffect(() => {
    if (reduce) {
      setEntranceStage('complete');
      if (!entrancePlayedRef.current) {
        entrancePlayedRef.current = true;
        onEntranceComplete?.();
      }
      return;
    }

    if (phase !== 'overview' || entrancePlayedRef.current) {
      setEntranceStage('complete');
      if (phase !== 'overview') entrancePlayedRef.current = true;
      return;
    }

    setEntranceStage('orbs');
    const edgeTimer = window.setTimeout(
      () => setEntranceStage('edges'),
      MAP_ENTRANCE.edgeDelay * 1000,
    );
    const doneTimer = window.setTimeout(() => {
      setEntranceStage('complete');
      entrancePlayedRef.current = true;
      onEntranceComplete?.();
    }, (MAP_ENTRANCE.edgeDelay + MAP_ENTRANCE.edgeDuration + MAP_ENTRANCE.introHandoff) * 1000);

    return () => {
      window.clearTimeout(edgeTimer);
      window.clearTimeout(doneTimer);
    };
  }, [phase, reduce, onEntranceComplete]);

  const isRoleFocus = phase === 'role' || phase === 'job';

  return (
    <div
      ref={viewportRef}
      className="absolute inset-0 touch-none overflow-visible"
      style={{
        backgroundImage: 'radial-gradient(circle, rgb(255 255 255 / 0.045) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}
      data-testid="career-map-field"
      aria-label="Career map. Drag to pan, scroll to zoom."
    >
      <motion.div
        className="absolute left-0 top-0 cursor-grab overflow-visible"
        style={{
          width: mapWidth,
          height: mapHeight,
          transformOrigin: '0 0',
          x,
          y,
          scale,
        }}
        drag={!reduce}
        dragMomentum={false}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          pointerStartRef.current = { x: event.clientX, y: event.clientY };
        }}
        onDragStart={() => {
          cancelCameraAnimation();
          notifyExplore();
        }}
        onClick={(event) => {
          const start = pointerStartRef.current;
          pointerStartRef.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (dx * dx + dy * dy > CLICK_DRAG_THRESHOLD_PX * CLICK_DRAG_THRESHOLD_PX) return;
          if ((event.target as Element).closest('[data-map-interactive]')) return;
          handleMapBackgroundClick(event.clientX, event.clientY);
        }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        <div className="relative h-full w-full overflow-visible">
          <svg
            aria-hidden
            viewBox={`0 0 ${VW} ${VH}`}
            overflow="visible"
            className="absolute inset-0 h-full w-full overflow-visible"
            fill="none"
            data-testid="career-map-edges"
          >
            <g pointerEvents="none">
            {edges.map((edge, i) => {
              const color = MAP_ROLE_COLOR[edge.category];
              const isActiveCluster = isRoleFocus && edge.category === activeCategory;
              const edgeOpacity = isRoleFocus
                ? isActiveCluster
                  ? MAP_ACTIVE_EDGE_OPACITY
                  : MAP_INACTIVE_EDGE_OPACITY
                : MAP_STROKE_OPACITY;
              const edgesVisible =
                entranceStage === 'edges' || entranceStage === 'complete' || !entrancePlaying;
              return (
                <motion.g
                  key={`${edge.category}-${edge.rank}-${i}`}
                  transform={`translate(${edge.x} ${edge.y})`}
                  animate={{ opacity: edgeOpacity }}
                  transition={focusFadeTransition(reduce)}
                >
                  <motion.path
                    data-testid="career-map-edge"
                    d={edge.d}
                    stroke={color}
                    strokeWidth={MAP_STROKE_WIDTH}
                    strokeDasharray={MAP_STROKE_DASH}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                    initial={entrancePlaying ? { opacity: 0 } : false}
                    animate={{ opacity: edgesVisible ? 1 : 0 }}
                    transition={{
                      delay: edgesVisible ? i * MAP_ENTRANCE.edgeStagger : 0,
                      duration: reduce ? durations.instant : MAP_ENTRANCE.edgeDuration,
                      ease: easings.soft,
                    }}
                  />
                </motion.g>
              );
            })}

            {roleJobs.map((node) => {
              const color = MAP_ROLE_COLOR[node.category];
              const glow = MAP_JOB_GLOW_HEX[node.category];
              const job = jobs[node.category][node.jobIndex];
              const nodeKey = jobNodeKey(node.category, node.jobIndex);
              const isHovered = hoveredJob === nodeKey;
              const isActiveCluster = isRoleFocus && node.category === activeCategory;
              const isSelectedJob =
                phase === 'job' &&
                selectedJob === node.jobIndex &&
                node.category === activeCategory;
              const isTargetJob = targetJobId === job.id;
              const showGlow = isHovered || isSelectedJob;
              const nodeOpacity =
                isTargetJob || isActiveCluster
                  ? 1
                  : isRoleFocus
                    ? MAP_INACTIVE_CLUSTER_OPACITY
                    : 1;
              const fillTarget = isTargetJob
                ? MAP_SELECTED_ORB_FILL_OPACITY
                : isSelectedJob
                  ? MAP_SELECTED_ORB_FILL_OPACITY
                  : MAP_ORB_FILL_OPACITY;
              const entranceIndex = orbEntranceIndex.get(nodeKey) ?? 0;
              const orbTransition = entrancePlaying
                ? {
                    delay: entranceIndex * MAP_ENTRANCE.orbStagger,
                    duration: MAP_ENTRANCE.orbDuration,
                    ease: easings.soft,
                  }
                : { duration: durations.instant };
              return (
                <g key={`job-${node.category}-${node.jobIndex}`}>
                  <motion.g
                    initial={entrancePlaying ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={orbTransition}
                  >
                    <AnimatePresence>
                      {showGlow && (
                        <CareerMapOrbGlow
                          key={`glow-${nodeKey}`}
                          cx={node.cx}
                          cy={node.cy}
                          baseR={node.r}
                          glow={glow}
                          reduce={reduce}
                          persistent={isSelectedJob}
                        />
                      )}
                    </AnimatePresence>
                    <motion.g
                      animate={{ opacity: nodeOpacity }}
                      transition={focusFadeTransition(reduce)}
                    >
                      <AnimatePresence mode="popLayout">
                        {isTargetJob ? (
                          <CareerMapTargetJobOrb
                            key={`target-${job.id}`}
                            cx={node.cx}
                            cy={node.cy}
                            r={node.r}
                            fill={color}
                            starColor={MAP_ROLE_COLOR_HEX[node.category]}
                            glow={glow}
                            selected={isSelectedJob}
                            reduce={reduce}
                          />
                        ) : (
                          <motion.g key="default">
                            <motion.circle
                              cx={node.cx}
                              cy={node.cy}
                              r={node.r}
                              fill={color}
                              animate={{ fillOpacity: fillTarget }}
                              transition={focusFadeTransition(reduce)}
                            />
                            <motion.circle
                              cx={node.cx}
                              cy={node.cy}
                              r={node.r - MAP_STROKE_WIDTH * 0.5}
                              fill="none"
                              stroke={color}
                              strokeWidth={MAP_STROKE_WIDTH}
                              animate={{
                                strokeOpacity: isSelectedJob ? 0 : isHovered ? 1 : MAP_STROKE_OPACITY,
                              }}
                              transition={focusFadeTransition(reduce)}
                            />
                          </motion.g>
                        )}
                      </AnimatePresence>
                    </motion.g>
                  </motion.g>
                </g>
              );
            })}

            {roles.map((role) => {
              const color = MAP_ROLE_COLOR[role.category];
              const glow = MAP_JOB_GLOW_HEX[role.category];
              const isHovered = hoveredHub === role.category;
              const isActiveHub = isRoleFocus && role.category === activeCategory;
              const hubOpacity = isRoleFocus && !isActiveHub ? MAP_INACTIVE_CLUSTER_OPACITY : 1;
              const innerR = role.r - role.strokeWidth * 0.5;
              const entranceIndex = orbEntranceIndex.get(`hub-${role.category}`) ?? 0;
              const orbTransition = entrancePlaying
                ? {
                    delay: entranceIndex * MAP_ENTRANCE.orbStagger,
                    duration: MAP_ENTRANCE.orbDuration,
                    ease: easings.soft,
                  }
                : { duration: durations.instant };
              return (
                <g key={`hub-${role.category}`}>
                  <motion.g
                    initial={entrancePlaying ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={orbTransition}
                  >
                    <AnimatePresence>
                      {isHovered && (
                        <CareerMapOrbGlow
                          key={`hub-glow-${role.category}`}
                          cx={role.cx}
                          cy={role.cy}
                          baseR={role.r}
                          glow={glow}
                          reduce={reduce}
                        />
                      )}
                    </AnimatePresence>
                    <motion.g
                      animate={{ opacity: hubOpacity }}
                      transition={focusFadeTransition(reduce)}
                    >
                      <circle
                        cx={role.cx}
                        cy={role.cy}
                        r={innerR}
                        fill={color}
                        fillOpacity={MAP_ORB_FILL_OPACITY}
                      />
                      <motion.circle
                        cx={role.cx}
                        cy={role.cy}
                        r={innerR}
                        fill="none"
                        stroke={color}
                        strokeWidth={role.strokeWidth}
                        animate={{
                          strokeOpacity: isHovered || isActiveHub ? 1 : MAP_STROKE_OPACITY,
                        }}
                        transition={focusFadeTransition(reduce)}
                      />
                    </motion.g>
                  </motion.g>
                </g>
              );
            })}
            </g>

            {roles.map((role) => (
              <CareerMapHubLabel
                key={`label-${role.category}`}
                role={role}
                pct={matchPercentages[role.category]}
                entranceDelay={
                  entrancePlaying ? (orbEntranceIndex.get(`hub-${role.category}`) ?? 0) * MAP_ENTRANCE.orbStagger : 0
                }
                entrancePlaying={entrancePlaying}
                reduce={reduce}
                onSelect={() => onSelectRole(role.rank)}
                onHoverStart={() => setHoveredHub(role.category)}
                onHoverEnd={() =>
                  setHoveredHub((current) => (current === role.category ? null : current))
                }
              />
            ))}
          </svg>

          {roleJobs.map((node) => {
            const roleJobList = jobs[node.category];
            const job: Job = roleJobList[node.jobIndex];
            const nodeKey = jobNodeKey(node.category, node.jobIndex);
            const isTargetJob = targetJobId === job.id;
            const isActive =
              phase === 'job' &&
              selectedJob === node.jobIndex &&
              node.category === activeCategory;
            const hitPadVb = node.r + MAP_STROKE_WIDTH;
            const hitSizeVb = hitPadVb * 2;

            const onJobClick = () => {
              if (isActive && phase === 'job') {
                onDeselectJob?.();
                return;
              }
              onSelectJob(node.rank, node.jobIndex);
            };

            return (
              <button
                key={`job-hit-${node.category}-${node.jobIndex}`}
                type="button"
                data-map-interactive
                data-testid={`career-map-job-${job.id}`}
                data-target-role={isTargetJob || undefined}
                aria-label={job.title}
                aria-current={isActive ? 'true' : undefined}
                tabIndex={isActive ? -1 : 0}
                className="map-job-hit absolute cursor-pointer rounded-full border-0 bg-transparent p-0 focus:outline-none focus-visible:outline-none"
                style={{
                  left: xPct(node.cx - hitPadVb),
                  top: yPct(node.cy - hitPadVb),
                  width: xPct(hitSizeVb),
                  height: yPct(hitSizeVb),
                }}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setHoveredJob(nodeKey)}
                onMouseLeave={() =>
                  setHoveredJob((current) => (current === nodeKey ? null : current))
                }
                onClick={onJobClick}
              />
            );
          })}

          {roleJobs.map((node) => {
            const roleJobList = jobs[node.category];
            const job: Job = roleJobList[node.jobIndex];
            const isActiveCluster = isRoleFocus && node.category === activeCategory;
            const labelCompact = phase === 'job';

            const labelOpacity = isActiveCluster
              ? 1
              : zoomLabelOpacity * (isRoleFocus ? MAP_INACTIVE_CLUSTER_OPACITY : 1);

            const orbDiameterPx = ((2 * node.r) / VW) * mapWidth;
            const jobRatio = labelCompact ? MAP_JOB_LABEL_RATIO.selected : null;
            const lineRatio = labelCompact ? MAP_JOB_LABEL_RATIO.selectedLine : null;
            const widthRatio = labelCompact ? MAP_JOB_LABEL_RATIO.selectedWidth : null;
            const labelHalfWidthVb = labelCompact ? widthRatio! * node.r : 60;
            const labelGap = labelCompact ? MAP_JOB_LABEL_RATIO.gap * 2 * node.r : 6;

            return (
              <motion.span
                key={`${node.category}-${node.jobIndex}-label`}
                aria-hidden={labelOpacity <= 0}
                className={`pointer-events-none absolute text-center font-heading font-bold${labelCompact ? '' : ' text-small leading-tight'}`}
                animate={{ opacity: labelOpacity }}
                transition={focusFadeTransition(reduce)}
                style={{
                  fontSize: jobRatio ? jobRatio * orbDiameterPx : undefined,
                  lineHeight: lineRatio ? `${lineRatio * orbDiameterPx}px` : undefined,
                  left: xPct(node.cx + (node.labelDx ?? 0) - labelHalfWidthVb),
                  top: yPct(node.cy + node.r + labelGap + (node.labelDy ?? 0)),
                  width: xPct(labelHalfWidthVb * 2),
                  color: MAP_ROLE_COLOR[node.category],
                  // Dashed edges pass under some labels (CM-08) — a canvas-colored halo keeps the
                  // type legible without a collision engine.
                  textShadow:
                    '0 0 2px var(--color-near-black), 0 0 5px var(--color-near-black), 0 0 9px var(--color-near-black), 0 0 14px var(--color-near-black)',
                }}
              >
                {job.title}
              </motion.span>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
