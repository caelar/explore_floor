import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import type { BucketDef, BucketId } from '@/data/types';
import { durations, durationsMs, easings } from '@/lib';

export interface BucketSortItem {
  id: string;
  label: string;
}

interface BucketSortProps {
  /** Items to sort, in presentation order. */
  items: BucketSortItem[];
  /** Which item is active (the scene's choiceIndex, owned by the store). */
  currentIndex: number;
  /** The rating rows, top to bottom (SORT_BUCKETS today). */
  buckets: BucketDef[];
  reduce: boolean;
  /** Which bucket an item already sits in (read from the caller's store slice) — pre-lights the
   *  prior pick when a user steps Back into a choice they already rated. */
  bucketOf: (id: string) => BucketId | undefined;
  /** Record one item's bucket and advance the scene cursor (store-owned). */
  onRate: (id: string, bucket: BucketId) => void;
  cardTestId?: string;
  progressTestId?: string;
}

// The one-card-at-a-time choice rater, re-skinned dark for step 8 (D-029 Phase B). Swipe boundary
// matches the mockup: ONLY the prompt card slides (in +130, out -90, `qChoiceCardRef`); the rating
// rows are a STATIC sibling that never animates (`qRatingRows` sit outside the slide clip). Because
// the rows are identical for every choice, keeping them mounted while only the card swaps reads
// clean — and their gold focus ring is no longer clipped by the card's overflow-hidden track (the
// deferred Phase-G a11y note). Click-only: the rater sorts via tap/Enter on the rating rows. (The
// old drag path — DragSortCard / DropZone — was removed as dead code; see DECISIONS D-031.)
export function BucketSort({
  items,
  currentIndex,
  buckets,
  reduce,
  bucketOf,
  onRate,
  cardTestId = 'sort-card',
  progressTestId = 'choice-progress',
}: BucketSortProps) {
  const current = items[currentIndex];
  const currentId = current?.id;

  // Per-choice lit/acted state lives here (not in the sliding card) so the rows stay mounted and
  // fixed. Reset when the active choice changes: pre-lit from the prior pick on a Back revisit
  // (re-pickable, so `acted` stays false). `bucketOf` is read through a ref so the reset keys only
  // off the choice id, not the inline function's identity.
  const [picked, setPicked] = useState<BucketId | null>(null);
  const [acted, setActed] = useState(false);
  const timer = useRef<number | null>(null);
  const bucketOfRef = useRef(bucketOf);
  bucketOfRef.current = bucketOf;
  useEffect(() => {
    setPicked(currentId ? (bucketOfRef.current(currentId) ?? null) : null);
    setActed(false);
  }, [currentId]);
  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);

  const choose = (bucket: BucketId) => {
    if (acted || !current) return;
    setActed(true);
    setPicked(bucket); // light it now; it holds through the snap before the card slides out
    if (reduce) {
      onRate(current.id, bucket);
      return;
    }
    timer.current = window.setTimeout(() => onRate(current.id, bucket), durationsMs.snap);
  };

  const reducedFade = { duration: durations.snap, ease: easings.soft };
  const variants = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, x: 130 },
    animate: reduce
      ? { opacity: 1, transition: reducedFade }
      : { opacity: 1, x: 0, transition: { duration: durations.glide, ease: easings.soft } },
    exit: reduce
      ? { opacity: 0, transition: reducedFade }
      : { opacity: 0, x: -90, transition: { duration: durations.snap, ease: easings.soft } },
  };

  return (
    <div className="flex w-full flex-col gap-space-3">
      <p className="text-small text-text-on-dark" data-testid={progressTestId}>
        Choice {Math.min(currentIndex + 1, items.length)} of {items.length}
      </p>

      {/* Only the prompt card slides. overflow-hidden clips its horizontal travel (in +130 / out -90)
          to this column; the rating rows below live OUTSIDE this clip. */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={current.id}
              data-testid={cardTestId}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="rounded-lg border border-glass-border bg-glass-fill-strong p-space-4 backdrop-blur-panel"
            >
              {/* Body token (16px / Montserrat 700 — the only loaded heading face; a 600 request
                  resolved to it anyway): small enough that every scene choice label fits on
                  ONE line (longest measured ~442px in a ~558px card), so the cards are a uniform, compact
                  single-line height — the rating rows below don't jump between choices, and the card no
                  longer dwarfs the scene recap above it. (At the old 20px some labels wrapped to two
                  lines, which was what drove the jump and the oversized look.) */}
              <p className="font-heading text-body font-bold text-text-on-dark">{current.label}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Standalone rating rows (the mockup's qRatingRows) — static, never animate; act on the
          active choice. Same treatment as the intro answer rows. */}
      <div className="flex flex-col gap-space-2">
        {buckets.map((bucket) => {
          const isLit = picked === bucket.id;
          return (
            <button
              key={bucket.id}
              type="button"
              data-testid={`bucket-${bucket.id}`}
              disabled={acted || !current}
              onClick={() => choose(bucket.id)}
              className={`w-full rounded-md border px-space-4 py-space-3 text-left font-body text-body transition-colors disabled:pointer-events-none ${
                isLit
                  ? 'border-arm-gold bg-arm-gold text-near-black'
                  : 'border-glass-border bg-glass-fill-strong text-text-on-dark backdrop-blur-panel hover:border-arm-gold hover:bg-arm-gold hover:text-near-black'
              }`}
            >
              {bucket.label}
            </button>
          );
        })}
      </div>

      <p className="text-small text-text-on-dark">
        Select the response that fits. Your pick advances to the next choice.
      </p>
    </div>
  );
}
