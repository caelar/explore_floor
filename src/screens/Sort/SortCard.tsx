import { motion, type PanInfo, useAnimationControls } from 'motion/react';
import { forwardRef, useEffect } from 'react';

import type { Decision, InterestItem } from '@/data/types';
import { durations, easings } from '@/lib';

interface SortCardProps {
  item: InterestItem;
  reduce: boolean;
  /** Which bin (if any) sits under a screen point — for hover highlight + drop resolution. */
  resolveDrop: (clientX: number, clientY: number) => Decision | null;
  /** Fired while dragging so the parent can light the bin under the card. */
  onHover: (decision: Decision | null) => void;
  /** Fired when the card is dropped onto a bin. */
  onCommit: (decision: Decision) => void;
}

// The single interest card. Motion owns the drag: the card moves freely anywhere on the canvas,
// shrinks when picked up (whileDrag), and — when dropped onto a bin — shrinks away into that bin
// (the exit scales to 0 in place via popLayout, so it disappears where it was dropped). Dropped
// off a bin, it glides back to center. No dragSnapToOrigin (it would fight the shrink-in-place).
const pointerXY = (
  event: MouseEvent | TouchEvent | PointerEvent,
): { x: number; y: number } | null => {
  if ('clientX' in event) return { x: event.clientX, y: event.clientY };
  const touch = event.changedTouches[0] ?? event.touches[0];
  return touch ? { x: touch.clientX, y: touch.clientY } : null;
};

export const SortCard = forwardRef<HTMLDivElement, SortCardProps>(function SortCard(
  { item, reduce, resolveDrop, onHover, onCommit },
  ref,
) {
  const controls = useAnimationControls();

  // Settle to rest after the initial mount; drag/exit take over from there.
  useEffect(() => {
    controls.start(reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 });
  }, [controls, reduce]);

  function handleDrag(event: MouseEvent | TouchEvent | PointerEvent, _info: PanInfo) {
    const point = pointerXY(event);
    onHover(point ? resolveDrop(point.x, point.y) : null);
  }

  function handleDragEnd(event: MouseEvent | TouchEvent | PointerEvent, _info: PanInfo) {
    const point = pointerXY(event);
    const decision = point ? resolveDrop(point.x, point.y) : null;
    onHover(null);
    if (decision) {
      onCommit(decision); // card unmounts → exit shrinks it into the bin at the drop spot
    } else {
      // Not on a bin — glide back to center.
      controls.start({ x: 0, y: 0, transition: { duration: durations.glide, ease: easings.soft } });
    }
  }

  return (
    <motion.div
      ref={ref}
      data-testid="sort-card"
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
      animate={controls}
      exit={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
      transition={{ duration: durations.glide, ease: easings.soft }}
      drag={!reduce}
      dragMomentum={false}
      whileDrag={{ scale: 0.9, zIndex: 10 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      className="flex w-80 shrink-0 cursor-grab touch-none select-none flex-col items-center justify-center rounded-md border border-border-default bg-bg p-space-6 text-center shadow-card active:cursor-grabbing"
    >
      <span className="font-heading text-h4 text-text-strong">{item.label}</span>
    </motion.div>
  );
});
