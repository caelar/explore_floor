import { motion, useReducedMotion } from 'motion/react';

import { durations, easings } from '@/lib';

interface ProgressBarProps {
  /** How many items are decided so far. */
  value: number;
  /** Total items in the sort (24 classic, 30 statements). */
  total: number;
  /** Counter testid — classic keeps 'sort-progress'; the flow runner uses its own. */
  testId?: string;
}

// A filling brand-yellow bar + "n of total sorted" counter. Yellow is the global brand
// signature (not an archetype), so it's the right accent for neutral progress chrome.
// Fill grows via scaleX (GPU-friendly) — Motion-owned, reduced-motion aware (motion-quality).
export function ProgressBar({ value, total, testId = 'sort-progress' }: ProgressBarProps) {
  const reduce = useReducedMotion();
  const fraction = total === 0 ? 0 : Math.min(value / total, 1);

  return (
    <div className="flex flex-col gap-space-1">
      <div
        className="h-space-1 w-full overflow-hidden rounded-full bg-bg-section"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={total}
      >
        <motion.div
          className="h-full w-full origin-left rounded-full bg-arm-yellow"
          initial={false}
          animate={{ scaleX: fraction }}
          transition={
            reduce
              ? { duration: durations.instant }
              : { duration: durations.glide, ease: easings.soft }
          }
        />
      </div>
      <p className="text-small text-text-muted" data-testid={testId}>
        {value} of {total} sorted
      </p>
    </div>
  );
}
