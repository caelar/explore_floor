import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';

import {
  MAP_ORB_FILL_OPACITY,
  MAP_ROLE_COLOR,
  MAP_STROKE_DASH,
  MAP_STROKE_OPACITY,
  MAP_STROKE_WIDTH,
} from '@/data/careerMapArt';
import type { CategoryId, CategoryWeights } from '@/data/types';
import {
  careerMapAllJobNodes,
  careerMapContentBounds,
  careerMapEdgeLayouts,
  careerMapRoles,
  durations,
  easings,
} from '@/lib';

import {
  LOADING_MAP_ENTRANCE,
  LOADING_MAP_STAGE,
  LOADING_MAP_VIEW_PADDING,
  LOADING_MAP_VIEWPORT,
} from './loadingMapRig';

// Figma 437:166 — miniature career map preview with staggered orb / edge fade-in.

type EntranceStage = 'orbs' | 'edges' | 'complete';

interface LoadingMiniMapProps {
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  reduce: boolean;
}

const jobNodeKey = (category: CategoryId, jobIndex: number) => `${category}-${jobIndex}`;

export function LoadingMiniMap({ ranking, matchPercentages, reduce }: LoadingMiniMapProps) {
  const [entranceStage, setEntranceStage] = useState<EntranceStage>(reduce ? 'complete' : 'orbs');

  const roles = useMemo(
    () => careerMapRoles(ranking, matchPercentages),
    [ranking, matchPercentages],
  );
  const jobNodes = useMemo(() => careerMapAllJobNodes(ranking), [ranking]);
  const edges = useMemo(
    () => careerMapEdgeLayouts(ranking, matchPercentages, 'overview'),
    [ranking, matchPercentages],
  );

  const viewBox = useMemo(() => {
    const bounds = careerMapContentBounds(ranking, matchPercentages, 'overview');
    const pad = LOADING_MAP_VIEW_PADDING;
    return {
      x: bounds.minX - pad,
      y: bounds.minY - pad,
      width: bounds.maxX - bounds.minX + pad * 2,
      height: bounds.maxY - bounds.minY + pad * 2,
    };
  }, [ranking, matchPercentages]);

  const orbEntranceIndex = useMemo(() => {
    const index = new Map<string, number>();
    roles.forEach((role, i) => index.set(`hub-${role.category}`, i));
    jobNodes.forEach((node, i) => {
      index.set(jobNodeKey(node.category, node.jobIndex), roles.length + i);
    });
    return index;
  }, [roles, jobNodes]);

  useEffect(() => {
    if (reduce) {
      setEntranceStage('complete');
      return;
    }

    setEntranceStage('orbs');
    const edgeTimer = window.setTimeout(
      () => setEntranceStage('edges'),
      LOADING_MAP_ENTRANCE.edgeDelay * 1000,
    );

    return () => {
      window.clearTimeout(edgeTimer);
    };
  }, [reduce]);

  const entrancePlaying = !reduce && entranceStage !== 'complete';
  const edgesVisible = entranceStage === 'edges' || entranceStage === 'complete' || reduce;

  const orbTransition = (index: number) =>
    entrancePlaying
      ? {
          delay: index * LOADING_MAP_ENTRANCE.orbStagger,
          duration: LOADING_MAP_ENTRANCE.orbDuration,
          ease: easings.soft,
        }
      : { duration: durations.instant };

  const edgeTransition = (index: number) =>
    entrancePlaying
      ? {
          delay: edgesVisible ? index * LOADING_MAP_ENTRANCE.edgeStagger : 0,
          duration: LOADING_MAP_ENTRANCE.edgeDuration,
          ease: easings.soft,
        }
      : { duration: durations.instant };

  return (
    <div
      className="relative mx-auto overflow-visible"
      style={{ width: LOADING_MAP_STAGE.width, height: LOADING_MAP_STAGE.height }}
      data-testid="loading-mini-map"
      aria-hidden
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: LOADING_MAP_VIEWPORT.width,
          height: LOADING_MAP_VIEWPORT.height,
        }}
      >
        <svg
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          className="h-full w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <g pointerEvents="none">
            {edges.map((edge, i) => {
              const color = MAP_ROLE_COLOR[edge.category];
              return (
                <motion.g
                  key={`${edge.category}-${edge.rank}-${i}`}
                  transform={`translate(${edge.x} ${edge.y})`}
                  initial={entrancePlaying ? { opacity: 0 } : false}
                  animate={{ opacity: edgesVisible ? 1 : 0 }}
                  transition={edgeTransition(i)}
                >
                  <path
                    d={edge.d}
                    stroke={color}
                    strokeWidth={MAP_STROKE_WIDTH}
                    strokeOpacity={MAP_STROKE_OPACITY}
                    strokeDasharray={MAP_STROKE_DASH}
                    strokeLinecap="round"
                    fill="none"
                  />
                </motion.g>
              );
            })}

            {jobNodes.map((node) => {
              const color = MAP_ROLE_COLOR[node.category];
              const entranceIndex = orbEntranceIndex.get(jobNodeKey(node.category, node.jobIndex)) ?? 0;
              return (
                <motion.g
                  key={`job-${node.category}-${node.jobIndex}`}
                  initial={entrancePlaying ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={orbTransition(entranceIndex)}
                >
                  <circle cx={node.cx} cy={node.cy} r={node.r} fill={color} fillOpacity={MAP_ORB_FILL_OPACITY} />
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r={node.r - MAP_STROKE_WIDTH * 0.5}
                    fill="none"
                    stroke={color}
                    strokeWidth={MAP_STROKE_WIDTH}
                    strokeOpacity={MAP_STROKE_OPACITY}
                  />
                </motion.g>
              );
            })}

            {roles.map((role) => {
              const color = MAP_ROLE_COLOR[role.category];
              const innerR = role.r - role.strokeWidth * 0.5;
              const entranceIndex = orbEntranceIndex.get(`hub-${role.category}`) ?? 0;
              return (
                <motion.g
                  key={`hub-${role.category}`}
                  initial={entrancePlaying ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  transition={orbTransition(entranceIndex)}
                >
                  <circle
                    cx={role.cx}
                    cy={role.cy}
                    r={role.r}
                    fill={color}
                    fillOpacity={MAP_ORB_FILL_OPACITY}
                  />
                  <circle
                    cx={role.cx}
                    cy={role.cy}
                    r={innerR}
                    fill="none"
                    stroke={color}
                    strokeWidth={role.strokeWidth}
                    strokeOpacity={MAP_STROKE_OPACITY}
                  />
                </motion.g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
