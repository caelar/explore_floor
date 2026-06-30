import { motion } from 'motion/react';

import { ROLE_ACCENT } from '@/components/categoryAccent';
import { roleDetails } from '@/data';
import type { CategoryId, CategoryWeights } from '@/data/types';
import { durations, easings } from '@/lib';

// The hero's per-role match bars (D-029 Phase C) — replaces the triangle fit radar. One bar per
// role in ranked order, width = that role's match %. The active (current) role's bar carries its
// accent fill; the others stay a flat neutral. Fills grow in on mount (reduced-motion: snap to
// width). Tokens only: recessed track on dark-canvas, role accent vs text-subtle fill.

interface SignalBarsProps {
  order: CategoryId[];
  matchPercentages: CategoryWeights;
  activeCategory: CategoryId;
  reduce: boolean;
  // `dense` tightens the row gap for the narrow constellation side rail (reference parity); the
  // hero / compare bars keep the roomier default.
  dense?: boolean;
}

export function SignalBars({
  order,
  matchPercentages,
  activeCategory,
  reduce,
  dense = false,
}: SignalBarsProps) {
  return (
    <div
      className={`flex flex-col ${dense ? 'gap-space-1' : 'gap-space-2'}`}
      data-testid="signal-bars"
    >
      {order.map((cat) => {
        const pct = matchPercentages[cat];
        const active = cat === activeCategory;
        return (
          <div key={cat} className="flex items-center gap-space-2" data-testid={`signal-bar-${cat}`}>
            <span
              className={`w-20 shrink-0 text-right font-body text-small ${
                active ? 'font-medium text-text-on-dark' : 'text-text-on-dark-faint'
              }`}
            >
              {roleDetails[cat].roleName}
            </span>
            <div className="h-3 flex-1 overflow-hidden rounded-sm bg-dark-canvas">
              <motion.div
                className={`h-full rounded-sm ${active ? ROLE_ACCENT[cat].bg : 'bg-text-subtle'}`}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: reduce ? 0 : durations.glide, ease: easings.soft }}
              />
            </div>
            <span
              className={`w-9 shrink-0 text-right font-body text-small tabular-nums ${
                active ? 'font-medium text-text-on-dark' : 'text-text-on-dark-faint'
              }`}
            >
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
