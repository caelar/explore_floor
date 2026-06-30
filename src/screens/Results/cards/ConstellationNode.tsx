import { motion } from 'motion/react';
import type { CSSProperties } from 'react';

import type { RoleAccent } from '@/components/categoryAccent';
import { SparkleStar } from '@/components/SparkleStar';
import type { Job } from '@/data/types';
import { durations, easings } from '@/lib';

// One job node on the results constellation (D-029 Phase F). A circular button holding a four-point
// sparkle star (the Claude Design glyph) that rings the role center; the label sits below it (rendered
// by ConstellationField, since titles run wider than the node). Three motion layers, deliberately on
// separate elements so they never fight: the outer wrapper owns the gentle idle float, the inner
// button owns the hover lift, and the star owns its glow + twinkle. Active = the open job (accent fill
// + glow); dimmed = another job is open. Reduced motion drops the float, twinkle, entrance, and hover.

interface ConstellationNodeProps {
  job: Job;
  accent: RoleAccent;
  /** Layout index (drives the per-node float/twinkle stagger). */
  index: number;
  active: boolean;
  dimmed: boolean;
  reduce: boolean;
  /** Absolute left/top/width from the field's view → percentage mapping. */
  style: CSSProperties;
  onClick: () => void;
}

export function ConstellationNode({
  job,
  accent,
  index,
  active,
  dimmed,
  reduce,
  style,
  onClick,
}: ConstellationNodeProps) {
  return (
    <motion.div
      className="absolute"
      style={{ ...style, aspectRatio: '1 / 1' }}
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      animate={
        reduce
          ? { opacity: dimmed ? 0.45 : 1 }
          : { opacity: dimmed ? 0.45 : 1, scale: 1, y: [0, -7] }
      }
      transition={
        reduce
          ? { duration: 0 }
          : {
              opacity: { duration: durations.glide, delay: index * 0.06, ease: easings.soft },
              scale: { duration: durations.glide, delay: index * 0.06, ease: easings.soft },
              // Gentle symmetric idle float — mirror so it eases to a stop at both the top and
              // bottom of the bob (an asymmetric ease on a [0,-y,0] loop reads jerky at the peak).
              // Off the UI motion scale (multi-second ambient loop, no token home); a symmetric
              // easeInOut on purpose — the mirror loop wants symmetry, and easings.soft is slightly
              // asymmetric.
              y: {
                duration: 4 + index * 0.4,
                delay: index * 0.3,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              },
            }
      }
    >
      <motion.button
        type="button"
        data-testid={`constellation-node-${job.id}`}
        onClick={onClick}
        aria-label={job.title}
        aria-pressed={active}
        className={`grid h-full w-full place-items-center rounded-full border transition-colors ${
          active ? `${accent.bg} border-transparent` : 'border-glass-border bg-glass-fill-strong'
        }`}
        // Active node gets a role-tinted glow; the offset/blur are decorative literals (no shadow
        // token for a colored node glow), mirroring BubbleField.
        style={active ? { boxShadow: `0 0 28px ${accent.glow}` } : undefined}
        whileHover={reduce ? undefined : { y: -6, scale: 1.06 }}
        transition={{ duration: durations.snap, ease: easings.soft }}
      >
        {/* The sparkle twinkles (opacity + scale) and carries a soft role-tinted glow so it reads as
            lit even at rest. Inactive uses the soft tint (clears the 3:1 graphical-contrast bar on the
            glass fill); the open node uses on-accent ink and stays solid (no twinkle) for legibility. */}
        <motion.span
          className="grid place-items-center"
          animate={reduce || active ? undefined : { opacity: [0.6, 1], scale: [0.9, 1.1] }}
          transition={
            reduce || active
              ? undefined
              : {
                  duration: 2.4 + index * 0.5,
                  delay: index * 0.4,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }
          }
        >
          <SparkleStar
            size={52}
            className={active ? accent.onAccent : accent.textSoft}
            // Layered drop-shadows (tight core + wider halo) read as a real glow at rest, not a
            // faint smudge; the glow token is low-alpha so a single 7px pass barely showed.
            style={
              active
                ? undefined
                : { filter: `drop-shadow(0 0 5px ${accent.glow}) drop-shadow(0 0 12px ${accent.glow})` }
            }
          />
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
