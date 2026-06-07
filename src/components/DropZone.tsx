import { type ForwardedRef, forwardRef, type ReactElement, type Ref } from 'react';

interface DropZoneProps<T extends string> {
  id: T;
  label: string;
  /** Drop-target highlight (the card is hovering over this zone). */
  active: boolean;
  onChoose: (id: T) => void;
  testId?: string;
}

// A drop target for DragSortCard, generic over its id: classic sort bins, exam
// statement buckets, the narrative scene's choice zone. Neutral styling with the
// brand-yellow highlight (global, not a role color). Also a native button so
// tap-to-sort and Tab/Enter keep working. forwardRef so the parent can hit-test
// the drop position against this zone's box.
function DropZoneInner<T extends string>(
  { id, label, active, onChoose, testId }: DropZoneProps<T>,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      type="button"
      data-testid={testId}
      onClick={() => onChoose(id)}
      className={[
        'flex h-40 w-40 shrink-0 flex-col items-center justify-center rounded-md border-2 p-space-3 text-center transition-colors',
        active
          ? 'border-arm-yellow bg-arm-yellow/10 text-text-strong'
          : 'border-border-default bg-bg text-text-muted hover:bg-bg-section',
      ].join(' ')}
    >
      <span className="font-heading text-h5">{label}</span>
    </button>
  );
}

// forwardRef erases generics, so re-assert the generic signature on the way out.
export const DropZone = forwardRef(DropZoneInner) as <T extends string>(
  props: DropZoneProps<T> & { ref?: Ref<HTMLButtonElement> },
) => ReactElement;
