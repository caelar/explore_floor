import { AnimatePresence, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DragSortCard, DropZone, ProgressBar, RoundIndicator } from '@/components';
import type { Decision } from '@/data/types';
import { durationsMs } from '@/lib';
import { useQuestionSet, useSessionStore } from '@/state';

import { RoundBeat } from './RoundBeat';

// Phase 1 sort: one item at a time into two neutral bins. The card drags freely anywhere on the
// canvas and is dropped onto a bin (or a bin is tapped). The conveyor + arm come in Phase 2. The
// store + scoring already exist — this screen only orchestrates: derive the current item, dispatch
// decisions, mark round transitions, and hand off to the build beat when every item is sorted.

export function Sort() {
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();

  // Items, rounds, and sort copy all come from the active question set (A/B test condition).
  const { items, rounds, sortCopy } = useQuestionSet();
  const decisions = useSessionStore((s) => s.state.decisions);
  const recordDecision = useSessionStore((s) => s.recordDecision);
  const advanceRound = useSessionStore((s) => s.advanceRound);
  const completeSorting = useSessionStore((s) => s.completeSorting);

  const currentItem = items.find((item) => !decisions[item.id]);
  const decidedCount = items.length - items.filter((item) => !decisions[item.id]).length;
  const currentRound = currentItem?.round ?? 4;
  const allDecided = !currentItem;

  const [activeBin, setActiveBin] = useState<Decision | null>(null);
  const [beatCopy, setBeatCopy] = useState<string | null>(null);

  const advanced = useRef(false);
  const binRefs = {
    keep: useRef<HTMLButtonElement>(null),
    pass: useRef<HTMLButtonElement>(null),
  };

  // Which bin (if any) sits under a screen point — drives both the drag-over highlight and the
  // drop resolution. Viewport coords (matches getBoundingClientRect).
  function resolveDrop(clientX: number, clientY: number): Decision | null {
    for (const decision of ['keep', 'pass'] as const) {
      const rect = binRefs[decision].current?.getBoundingClientRect();
      if (
        rect &&
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        return decision;
      }
    }
    return null;
  }

  // The round beat is non-blocking and auto-dismisses.
  useEffect(() => {
    if (!beatCopy) return;
    const timer = setTimeout(() => setBeatCopy(null), durationsMs.reveal);
    return () => clearTimeout(timer);
  }, [beatCopy]);

  // Once everything is sorted, finalize scoring + robot and hand off to the build beat.
  useEffect(() => {
    if (allDecided && !advanced.current) {
      advanced.current = true;
      completeSorting();
      navigate('/build');
    }
  }, [allDecided, completeSorting, navigate]);

  function choose(decision: Decision) {
    if (!currentItem) return;
    const fromRound = currentItem.round;
    setActiveBin(null);
    recordDecision(currentItem.id, decision);

    // Detect a round boundary using the next still-undecided item (decisions is pre-update,
    // so exclude the item we just decided).
    const next = items.find((item) => item.id !== currentItem.id && !decisions[item.id]);
    if (next && next.round > fromRound) {
      advanceRound();
      const enterCopy = rounds.find((r) => r.round === next.round)?.enterCopy;
      if (enterCopy) setBeatCopy(enterCopy);
    }
  }

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col gap-space-5 p-space-5">
      <header className="flex flex-col gap-space-3">
        <RoundIndicator round={currentRound} total={4} />
        <ProgressBar value={decidedCount} total={items.length} />
      </header>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-space-5">
        <div className="flex items-center justify-center gap-space-5">
          <DropZone<Decision>
            ref={binRefs.pass}
            id="pass"
            testId="sort-pass"
            label={sortCopy.passLabel}
            active={activeBin === 'pass'}
            onChoose={choose}
          />

          <div className="relative flex h-52 w-80 shrink-0 items-center justify-center">
            <AnimatePresence mode="popLayout">
              {currentItem && (
                <DragSortCard<Decision>
                  key={currentItem.id}
                  label={currentItem.label}
                  reduce={reduce}
                  resolveDrop={resolveDrop}
                  onHover={setActiveBin}
                  onCommit={choose}
                />
              )}
            </AnimatePresence>
          </div>

          <DropZone<Decision>
            ref={binRefs.keep}
            id="keep"
            testId="sort-keep"
            label={sortCopy.keepLabel}
            active={activeBin === 'keep'}
            onChoose={choose}
          />
        </div>

        <p className="text-small text-text-faint">{sortCopy.dragHint}</p>

        <AnimatePresence>
          {beatCopy && <RoundBeat copy={beatCopy} reduce={reduce} />}
        </AnimatePresence>
      </div>
    </main>
  );
}
