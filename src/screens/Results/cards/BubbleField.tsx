import { motion } from 'motion/react';

import { ROLE_ACCENT } from '@/components/categoryAccent';
import { roleDetails } from '@/data';
import type { CategoryId, CategoryWeights } from '@/data/types';
import { breathe, BUBBLE_VIEW, bubbleLayout, durations, easings } from '@/lib';

// The three role bubbles on the results map (D-029 Phase E). Rank-based positions + match-%-sized
// radii come from the pure lib/bubbleLayout; this only renders them. Each bubble fills with its role
// accent, names the role + match % in the accent's on-color, carries a soft role-tinted glow, and
// gently floats (an outer wrapper owns the float so it never fights the inner hover lift). Tapping a
// bubble dives into that role's cards. Reduced motion drops the float + entrance + hover.

interface BubbleFieldProps {
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  reduce: boolean;
  /** Dive into the role at this rank index (index into `ranking`). */
  onDive: (rank: number) => void;
}

const xPct = (v: number) => `${(v / BUBBLE_VIEW.width) * 100}%`;
const yPct = (v: number) => `${(v / BUBBLE_VIEW.height) * 100}%`;

export function BubbleField({ ranking, matchPercentages, reduce, onDive }: BubbleFieldProps) {
  const bubbles = bubbleLayout(ranking, matchPercentages);

  return (
    <div
      className="relative mx-auto h-full max-w-full"
      // Height-driven so the field always fits the available vertical space (the flex parent is
      // min-h-0 + flex-1); width follows the aspect ratio and is capped at the --container-map width
      // and the viewport. Desktop-first (D-029 Phase D); the responsive story is Phase G.
      style={{
        aspectRatio: `${BUBBLE_VIEW.width} / ${BUBBLE_VIEW.height}`,
        width: 'auto',
        maxWidth: 'min(100%, var(--container-map))',
      }}
      data-testid="bubble-field"
    >
      {bubbles.map((b) => {
        const accent = ROLE_ACCENT[b.category];
        return (
          <motion.div
            key={b.category}
            className="absolute"
            style={{
              left: xPct(b.cx - b.r),
              top: yPct(b.cy - b.r),
              width: xPct(b.r * 2),
              aspectRatio: '1 / 1',
            }}
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: [0, -9] }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    opacity: { duration: durations.glide, delay: b.rank * 0.08, ease: easings.soft },
                    scale: { duration: durations.glide, delay: b.rank * 0.08, ease: easings.soft },
                    // Gentle, per-rank-varied idle float — `mirror` so it eases to a stop at both the
                    // top and bottom of the bob (an asymmetric ease on a [0,-y,0] loop reads jerky at
                    // the turnaround). Base off the UI scale (see `breathe` in motion.ts — multi-second
                    // ambient loops); per-rank increment varies each bubble; easing is a symmetric easeInOut.
                    y: {
                      duration: breathe.bubble + b.rank * 0.6,
                      delay: b.rank * 0.4,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                    },
                  }
            }
          >
            <motion.button
              type="button"
              data-testid={`map-bubble-${b.category}`}
              onClick={() => onDive(b.rank)}
              aria-label={`${roleDetails[b.category].roleName}, ${matchPercentages[b.category]} percent match`}
              className={`flex h-full w-full flex-col items-center justify-center rounded-full text-center ${accent.bg} ${accent.onAccent}`}
              // Role-tinted drop glow: the color is a token (accent.glow); the offset/blur are
              // decorative literals with no --shadow-dark-* equivalent (a colored bubble glow).
              style={{ boxShadow: `0 10px 44px ${accent.glow}` }}
              whileHover={reduce ? undefined : { y: -6, scale: 1.03 }}
              transition={{ duration: durations.snap, ease: easings.soft }}
            >
              {/* Fluid bubble text: the label scales with the (viewport-sized) bubble, so it has no
                  fixed type-scale token. Bounds are anchored to the scale — name ~body→h5, % ~h4→h3. */}
              <span
                className="font-heading font-bold leading-tight"
                style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)' }}
              >
                {roleDetails[b.category].roleName}
              </span>
              <span
                className="font-heading font-bold leading-none tabular-nums"
                style={{ fontSize: 'clamp(1.5rem, 2.6vw, 2.4rem)' }}
              >
                {matchPercentages[b.category]}%
              </span>
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
}
