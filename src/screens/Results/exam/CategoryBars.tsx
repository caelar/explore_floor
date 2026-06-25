import { motion, useReducedMotion } from 'motion/react';

import { roleDetails } from '@/data';
import type { CategoryWeights } from '@/data/types';
import { CATEGORIES } from '@/data/types';
import { durations, easings } from '@/lib';

interface CategoryBarsProps {
  matchPercentages: CategoryWeights;
}

// The four category bars from the exam results wireframe: one labelled row per category in the
// fixed Operate→Repair→Program→Plan order, each a track with a fill scaled to the match %.
// Neutral fill (brand yellow, the global progress signature) — the bars read all four scores at
// a glance; the robot anchor and "your roles" carry the recommendation.
export function CategoryBars({ matchPercentages }: CategoryBarsProps) {
  const reduce = useReducedMotion();

  return (
    <div className="flex w-full flex-col gap-space-3">
      {CATEGORIES.map((category) => {
        const pct = matchPercentages[category];
        return (
          <div key={category} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-space-3">
            <span className="font-heading text-h5 text-text-strong">
              {roleDetails[category].roleName}
            </span>
            <div
              className="h-space-3 w-full overflow-hidden rounded-full bg-bg-section"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={roleDetails[category].roleName}
              data-testid={`category-bar-${category}`}
            >
              <motion.div
                className="h-full w-full origin-left rounded-full bg-arm-gold"
                initial={false}
                animate={{ scaleX: pct / 100 }}
                transition={
                  reduce
                    ? { duration: durations.instant }
                    : { duration: durations.glide, ease: easings.soft }
                }
              />
            </div>
            <span
              className="text-right text-body font-medium text-text-default"
              data-testid={`category-pct-${category}`}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
