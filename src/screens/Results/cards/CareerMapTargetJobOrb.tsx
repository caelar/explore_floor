import { motion } from 'motion/react';

import { MAP_ORB_FILL_OPACITY, MAP_STROKE_OPACITY, MAP_STROKE_WIDTH } from '@/data/careerMapArt';
import { durations, easings } from '@/lib';

// Figma 1395:509 — target-role job orb. Unfilled when set but not open; filled + glow when selected.
// Mount plays a soft bloom + star fade-in; unmount fades out (AnimatePresence in CareerMapField).

/** Star size vs orb diameter from Figma (47px star in ~78.7px orb). */
const STAR_TO_DIAMETER = 47 / 78.675;

const ENTRANCE = {
  bloom: { fromR: 0.92, toR: 1.6, fromOpacity: 0.42 },
  ring: { fromR: 0.96, toR: 1.38, fromOpacity: 0.55, delay: 0.07 },
  body: { delay: 0.05, fromScale: 0.55 },
  star: { delay: 0.12 },
} as const;

interface CareerMapTargetJobOrbProps {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  starColor: string;
  glow: string;
  selected: boolean;
  reduce: boolean;
}

export function CareerMapTargetJobOrb({
  cx,
  cy,
  r,
  fill,
  starColor,
  glow,
  selected,
  reduce,
}: CareerMapTargetJobOrbProps) {
  const starSize = 2 * r * STAR_TO_DIAMETER;
  const stateTransition = reduce
    ? { duration: durations.instant }
    : { duration: durations.glide, ease: easings.soft };
  const bloomTransition = (delay = 0) =>
    reduce
      ? { duration: durations.instant }
      : { duration: durations.pour, ease: easings.soft, delay };

  return (
    <motion.g
      data-testid="career-map-target-orb"
      data-target-selected={selected}
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, transition: { duration: durations.snap, ease: easings.soft } }
      }
      transition={stateTransition}
    >
      {!reduce && (
        <>
          <motion.circle
            cx={cx}
            cy={cy}
            fill={glow}
            initial={{ r: r * ENTRANCE.bloom.fromR, fillOpacity: ENTRANCE.bloom.fromOpacity }}
            animate={{ r: r * ENTRANCE.bloom.toR, fillOpacity: 0 }}
            transition={bloomTransition()}
          />
          <motion.circle
            cx={cx}
            cy={cy}
            fill="none"
            stroke={glow}
            strokeWidth={MAP_STROKE_WIDTH * 2}
            initial={{ r: r * ENTRANCE.ring.fromR, strokeOpacity: ENTRANCE.ring.fromOpacity }}
            animate={{ r: r * ENTRANCE.ring.toR, strokeOpacity: 0 }}
            transition={bloomTransition(ENTRANCE.ring.delay)}
          />
        </>
      )}

      <motion.g
        initial={reduce ? false : { opacity: 0, scale: ENTRANCE.body.fromScale }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...stateTransition, delay: reduce ? 0 : ENTRANCE.body.delay }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill={fill}
          initial={reduce ? false : { fillOpacity: 0 }}
          animate={{ fillOpacity: selected ? 1 : MAP_ORB_FILL_OPACITY }}
          transition={stateTransition}
        />
        {!selected && (
          <motion.circle
            cx={cx}
            cy={cy}
            r={r - MAP_STROKE_WIDTH * 0.5}
            fill="none"
            stroke={fill}
            strokeWidth={MAP_STROKE_WIDTH}
            initial={reduce ? false : { strokeOpacity: 0 }}
            animate={{ strokeOpacity: MAP_STROKE_OPACITY }}
            transition={stateTransition}
          />
        )}
        <motion.text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Material Icons'"
          fontSize={starSize}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ fill: selected ? '#262626' : starColor, opacity: 1 }}
          transition={{ ...stateTransition, delay: reduce ? 0 : ENTRANCE.star.delay }}
        >
          star
        </motion.text>
      </motion.g>
    </motion.g>
  );
}
