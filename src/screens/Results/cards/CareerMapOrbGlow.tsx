import { motion } from 'motion/react';

import { MAP_STROKE_WIDTH } from '@/data/careerMapArt';
import { durations, easings } from '@/lib';

// Expanding role-colored rings on map-orb hover — tight bloom, soft ripple.

const GLOW_RING = {
  fill: { fromR: 0.98, toR: 1.5, toOpacity: 0.14 },
  ring: { fromR: 0.96, toR: 1.28, toOpacity: 0.38 },
  ripple: { fromR: 1.02, toR: 1.45, fromOpacity: 0.28 },
} as const;

interface CareerMapOrbGlowProps {
  cx: number;
  cy: number;
  baseR: number;
  glow: string;
  reduce: boolean;
  /** Steady selected-state bloom (Figma 1349:312) — skips the hover entrance. */
  persistent?: boolean;
}

export function CareerMapOrbGlow({
  cx,
  cy,
  baseR,
  glow,
  reduce,
  persistent = false,
}: CareerMapOrbGlowProps) {
  const expand = reduce || persistent
    ? { duration: durations.instant }
    : { duration: durations.glide, ease: easings.soft };

  if (persistent) {
    return (
      <g pointerEvents="none">
        <circle
          cx={cx}
          cy={cy}
          fill={glow}
          r={baseR * GLOW_RING.fill.toR}
          fillOpacity={GLOW_RING.fill.toOpacity}
        />
        <circle
          cx={cx}
          cy={cy}
          fill="none"
          stroke={glow}
          strokeWidth={MAP_STROKE_WIDTH * 2}
          r={baseR * GLOW_RING.ring.toR}
          strokeOpacity={GLOW_RING.ring.toOpacity}
        />
      </g>
    );
  }

  return (
    <motion.g pointerEvents="none" initial={false}>
      <motion.circle
        cx={cx}
        cy={cy}
        fill={glow}
        initial={{ r: baseR * GLOW_RING.fill.fromR, fillOpacity: 0 }}
        animate={{ r: baseR * GLOW_RING.fill.toR, fillOpacity: GLOW_RING.fill.toOpacity }}
        exit={{ r: baseR * GLOW_RING.fill.fromR, fillOpacity: 0 }}
        transition={expand}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        fill="none"
        stroke={glow}
        strokeWidth={MAP_STROKE_WIDTH * 2}
        initial={{ r: baseR * GLOW_RING.ring.fromR, strokeOpacity: 0 }}
        animate={{ r: baseR * GLOW_RING.ring.toR, strokeOpacity: GLOW_RING.ring.toOpacity }}
        exit={{ r: baseR * GLOW_RING.ring.fromR, strokeOpacity: 0 }}
        transition={{ ...expand, delay: reduce ? 0 : 0.08 }}
      />
      <motion.circle
        cx={cx}
        cy={cy}
        fill="none"
        stroke={glow}
        strokeWidth={MAP_STROKE_WIDTH * 1.5}
        vectorEffect="non-scaling-stroke"
        initial={{ r: baseR * GLOW_RING.ripple.fromR, strokeOpacity: GLOW_RING.ripple.fromOpacity }}
        animate={{ r: baseR * GLOW_RING.ripple.toR, strokeOpacity: 0 }}
        exit={{ r: baseR * GLOW_RING.ripple.fromR, strokeOpacity: 0 }}
        transition={{ ...expand, delay: reduce ? 0 : 0.16 }}
      />
    </motion.g>
  );
}
