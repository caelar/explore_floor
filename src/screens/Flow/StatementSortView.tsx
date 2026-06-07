import { AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { DragSortCard, DropZone, ProgressBar } from '@/components';
import type { BucketId, StatementSortStep } from '@/data/types';
import { useSessionStore } from '@/state';

interface StatementSortViewProps {
  step: StatementSortStep;
  reduce: boolean;
  onComplete: () => void;
}

// The exam flow's statement sort: one statement at a time into the three buckets
// ("That's me" / "Maybe" / "Not me" — labels live in the step data). Same proven
// mechanics as the classic sort — drag onto a bucket or tap one — just three targets
// instead of two and no robot. 'maybe' scores MAYBE_WEIGHT (0 today) at scoring time;
// the UI records the bucket honestly either way.
export function StatementSortView({ step, reduce, onComplete }: StatementSortViewProps) {
  const statementBuckets = useSessionStore((s) => s.state.statementBuckets);
  const recordStatement = useSessionStore((s) => s.recordStatement);

  const remaining = step.statements.filter((statement) => !statementBuckets[statement.id]);
  const current = remaining[0];
  const sortedCount = step.statements.length - remaining.length;
  const allSorted = remaining.length === 0;

  const [activeBucket, setActiveBucket] = useState<BucketId | null>(null);
  const bucketRefs = useRef<Partial<Record<BucketId, HTMLButtonElement | null>>>({});
  const completed = useRef(false);

  function resolveDrop(clientX: number, clientY: number): BucketId | null {
    for (const bucket of step.buckets) {
      const rect = bucketRefs.current[bucket.id]?.getBoundingClientRect();
      if (
        rect &&
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return bucket.id;
      }
    }
    return null;
  }

  function choose(bucket: BucketId) {
    if (!current) return;
    setActiveBucket(null);
    recordStatement(current.id, bucket);
  }

  // The last bucketed statement hands the runner back control (scoring + results).
  useEffect(() => {
    if (allSorted && !completed.current) {
      completed.current = true;
      onComplete();
    }
  }, [allSorted, onComplete]);

  return (
    <div className="flex w-full flex-col items-center gap-space-5">
      <div className="w-full max-w-md">
        <ProgressBar value={sortedCount} total={step.statements.length} testId="flow-progress" />
      </div>

      <div className="relative flex h-52 w-80 shrink-0 items-center justify-center">
        <AnimatePresence mode="popLayout">
          {current && (
            <DragSortCard<BucketId>
              key={current.id}
              label={current.label}
              reduce={reduce}
              testId="statement-card"
              resolveDrop={resolveDrop}
              onHover={setActiveBucket}
              onCommit={choose}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-space-4">
        {step.buckets.map((bucket) => (
          <DropZone<BucketId>
            key={bucket.id}
            ref={(el) => {
              bucketRefs.current[bucket.id] = el;
            }}
            id={bucket.id}
            label={bucket.label}
            active={activeBucket === bucket.id}
            onChoose={choose}
            testId={`bucket-${bucket.id}`}
          />
        ))}
      </div>
      <p className="text-small text-text-faint">Drag the card onto a bucket — or tap one.</p>
    </div>
  );
}
