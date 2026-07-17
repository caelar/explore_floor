import { motion } from 'motion/react';

import type { CategoryId } from '@/data/types';
import { durations, easings } from '@/lib';

// The atmospheric layer behind the results bubble map (D-029 Phase E): large, heavily-blurred,
// role-tinted orbs that slowly breathe. Purely decorative (aria-hidden, pointer-events-none) — it
// keeps the four-grey dark palette from going flat without competing with the bubbles. Colors come
// from the role accent tokens; the blur radius, positions, and sizes mirror the Claude Design
// mockup's ambientData() and have no token equivalent, so they live here as decorative values.
// Reduced motion pins each orb at a constant opacity and size (no pulse). When a map role/job is
// focused, all orbs ease toward that role's accent hue.

/** Slow ambient breathe — off the UI motion scale (multi-second decorative loop). */
const AMBIENT_BREATHE_S = 18;
const AMBIENT_COLOR_SHIFT_S = 1.4;
const AMBIENT_OPACITY: [number, number] = [0.04, 0.11];
const AMBIENT_SIZE_PULSE_S = 23;
const AMBIENT_SIZE_PULSE = {
  x: [0.96, 1.05] as [number, number],
  y: [0.94, 1.06] as [number, number],
};

const ROLE_AMBIENT_COLOR: Record<CategoryId, string> = {
  technician: '#ffb81c',
  specialist: '#117289',
  integrator: '#bf5309',
};

interface Orb {
  left: string;
  top: string;
  size: number;
  color: string;
}

const ORBS: Orb[] = [
  { left: '12%', top: '76%', size: 320, color: ROLE_AMBIENT_COLOR.specialist },
  { left: '86%', top: '22%', size: 260, color: ROLE_AMBIENT_COLOR.technician },
  { left: '80%', top: '84%', size: 380, color: ROLE_AMBIENT_COLOR.integrator },
  { left: '6%', top: '30%', size: 220, color: ROLE_AMBIENT_COLOR.specialist },
  { left: '50%', top: '92%', size: 300, color: ROLE_AMBIENT_COLOR.technician },
  { left: '94%', top: '54%', size: 200, color: ROLE_AMBIENT_COLOR.integrator },
];

interface AmbientFieldProps {
  reduce: boolean;
  /** When set (map role/job focus), every orb eases to this role's accent. */
  focusCategory?: CategoryId | null;
}

export function AmbientField({ reduce, focusCategory = null }: AmbientFieldProps) {
  const focusColor = focusCategory ? ROLE_AMBIENT_COLOR[focusCategory] : null;
  const colorTransition = reduce
    ? { duration: durations.instant }
    : { duration: AMBIENT_COLOR_SHIFT_S, ease: easings.soft };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
            marginLeft: -orb.size / 2,
            marginTop: -orb.size / 2,
            filter: 'blur(52px)',
          }}
          initial={false}
          animate={
            reduce
              ? {
                  opacity: (AMBIENT_OPACITY[0] + AMBIENT_OPACITY[1]) / 2,
                  background: focusColor ?? orb.color,
                  scaleX: 1,
                  scaleY: 1,
                }
              : {
                  opacity: AMBIENT_OPACITY,
                  background: focusColor ?? orb.color,
                  scaleX: AMBIENT_SIZE_PULSE.x,
                  scaleY: AMBIENT_SIZE_PULSE.y,
                }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  opacity: {
                    duration: AMBIENT_BREATHE_S,
                    delay: i * 2.4,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                  },
                  scaleX: {
                    duration: AMBIENT_SIZE_PULSE_S,
                    delay: i * 2.1 + 0.6,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                  },
                  scaleY: {
                    duration: AMBIENT_SIZE_PULSE_S + 4,
                    delay: i * 2.1,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                  },
                  background: colorTransition,
                }
          }
        />
      ))}
    </div>
  );
}
