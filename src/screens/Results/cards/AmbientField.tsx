import { motion } from 'motion/react';

import { breathe } from '@/lib';

// The atmospheric layer behind the results bubble map (D-029 Phase E): large, heavily-blurred,
// role-tinted orbs that slowly breathe. Purely decorative (aria-hidden, pointer-events-none) — it
// keeps the four-grey dark palette from going flat without competing with the bubbles. Colors come
// from the role accent tokens; the blur radius, positions, and sizes mirror the Claude Design
// mockup's ambientData() and have no token equivalent, so they live here as decorative values.
// Reduced motion pins each orb at a constant opacity (no pulse).

interface Orb {
  left: string;
  top: string;
  size: number;
  color: string;
}

const ORBS: Orb[] = [
  { left: '12%', top: '76%', size: 320, color: 'var(--color-role-specialist)' },
  { left: '86%', top: '22%', size: 260, color: 'var(--color-role-technician)' },
  { left: '80%', top: '84%', size: 380, color: 'var(--color-role-integrator)' },
  { left: '6%', top: '30%', size: 220, color: 'var(--color-role-specialist)' },
  { left: '50%', top: '92%', size: 300, color: 'var(--color-role-technician)' },
  { left: '94%', top: '54%', size: 200, color: 'var(--color-role-integrator)' },
];

export function AmbientField({ reduce }: { reduce: boolean }) {
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
            background: orb.color,
            filter: 'blur(52px)',
          }}
          initial={false}
          animate={reduce ? { opacity: 0.16 } : { opacity: [0.1, 0.22] }}
          transition={
            reduce
              ? { duration: 0 }
              : // Slow, per-orb-varied breathe; `mirror` keeps the fade symmetric (eases to a stop at
                // both ends). Base off the UI scale (see `breathe` in motion.ts — multi-second ambient
                // loops); +i spreads each orb; easing is a symmetric easeInOut.
                {
                  duration: breathe.orb + i,
                  delay: i * 0.4,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }
          }
        />
      ))}
    </div>
  );
}
