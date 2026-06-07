import { motion, type PanInfo, useAnimationControls } from 'motion/react';
import { type ForwardedRef, forwardRef, type ReactElement, type Ref, useEffect } from 'react';

import { durations, easings } from '@/lib';

interface DragSortCardProps<T extends string> {
  label: string;
  reduce: boolean;
  /** Which target (if any) sits under a screen point — for hover highlight + drop resolution. */
  resolveDrop: (clientX: number, clientY: number) => T | null;
  /** Fired while dragging so the parent can light the zone under the card. */
  onHover: (target: T | null) => void;
  /** Fired when the card is dropped onto a zone. */
  onCommit: (target: T) => void;
  /** Tap-to-pick fallback (scene steps offer several cards, so tapping a ZONE can't
   *  identify the pick). Motion suppresses the tap when a real drag happened; also
   *  makes the card keyboard-operable (Enter/Space). Omit where zones are tappable. */
  onTap?: () => void;
  /** Card scale: classic sort + statements use the full card; scene grids go compact. */
  size?: 'default' | 'compact';
  testId?: string;
}

const SIZE_CLASSES = {
  default: 'w-80 p-space-6 text-h4',
  compact: 'w-64 p-space-4 text-h5',
} as const;

// The draggable sort card, generic over its drop-target ids: the classic sort uses
// Decision ('keep' | 'pass'), the exam statement sort uses BucketId, the narrative
// scenes use a single zone id. Motion owns the drag: the card moves freely anywhere
// on the canvas, shrinks when picked up (whileDrag), and — when dropped onto a zone —
// shrinks away into it (the exit scales to 0 in place via popLayout, so it disappears
// where it was dropped). Dropped off a zone, it glides back to center. No
// dragSnapToOrigin (it would fight the shrink-in-place).

const pointerXY = (
  event: MouseEvent | TouchEvent | PointerEvent,
): { x: number; y: number } | null => {
  if ('clientX' in event) return { x: event.clientX, y: event.clientY };
  const touch = event.changedTouches[0] ?? event.touches[0];
  return touch ? { x: touch.clientX, y: touch.clientY } : null;
};

function DragSortCardInner<T extends string>(
  {
    label,
    reduce,
    resolveDrop,
    onHover,
    onCommit,
    onTap,
    size = 'default',
    testId = 'sort-card',
  }: DragSortCardProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
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
    const target = point ? resolveDrop(point.x, point.y) : null;
    onHover(null);
    if (target) {
      onCommit(target); // card unmounts → exit shrinks it into the zone at the drop spot
    } else {
      // Not on a zone — glide back to center.
      controls.start({ x: 0, y: 0, transition: { duration: durations.glide, ease: easings.soft } });
    }
  }

  return (
    <motion.div
      ref={ref}
      data-testid={testId}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
      animate={controls}
      exit={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
      transition={{ duration: durations.glide, ease: easings.soft }}
      drag={!reduce}
      dragMomentum={false}
      whileDrag={{ scale: 0.9, zIndex: 10 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onTap={onTap}
      role={onTap ? 'button' : undefined}
      tabIndex={onTap ? 0 : undefined}
      onKeyDown={
        onTap
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onTap();
              }
            }
          : undefined
      }
      className={`flex shrink-0 cursor-grab touch-none select-none flex-col items-center justify-center rounded-md border border-border-default bg-bg text-center shadow-card active:cursor-grabbing ${SIZE_CLASSES[size]}`}
    >
      <span className="font-heading text-text-strong">{label}</span>
    </motion.div>
  );
}

// forwardRef erases generics, so re-assert the generic signature on the way out
// (popLayout exits need the ref; the cast keeps T flowing to callers).
export const DragSortCard = forwardRef(DragSortCardInner) as <T extends string>(
  props: DragSortCardProps<T> & { ref?: Ref<HTMLDivElement>; key?: string },
) => ReactElement;
