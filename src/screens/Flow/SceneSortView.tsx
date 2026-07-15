import { AnimatePresence, motion } from 'motion/react';

import { CtaButton, Icon } from '@/components';
import { SORT_BUCKETS } from '@/data/flows/buckets';
import type { SceneStep } from '@/data/types';
import { durations, easings, typeScale } from '@/lib';
import { useSessionStore } from '@/state';

import { BucketSort } from './BucketSort';

interface SceneSortViewProps {
  step: SceneStep;
  /** 1-based position among the flow's scenes, for the "Scene N of M" cue. */
  sceneNumber: number;
  sceneTotal: number;
  reduce: boolean;
}

// A narrative scene as a sort (D-018), re-skinned dark for step 8 (D-029 Phase B). The mockup's
// two-beat is ONE morphing surface, not two swapped views: a glass scene-context card (the scenario
// + the ask) with a gold Continue; pressing it (`startScene`) flips the store's scenePhase to
// 'rating' and the card morphs in place — it compresses (padding + question shrink) while the
// choices region expands open below it. The runner is top-anchored (no flex-centering, so scene→scene
// doesn't lurch), so the liked "slide upward" comes from a shrinking spacer above the card (the
// mockup's qSpacer): tall in intro, near-zero in rating, so the card rises as the choices grow. The
// scene cursor lives in the store (scenePhase / choiceIndex) so Back can step within the scene and
// re-enter a prior scene at its last choice; this view just reads it and dispatches.
//
// Choice buckets reuse the shared statementBuckets slice (keyed by choice id) via `rateChoice`, so
// scoring reads them exactly like statement buckets. When the last choice lands, the store advances
// the flow (or finishes it). The runner keys this view by step id, so it remounts per scene.
export function SceneSortView({ step, sceneNumber, sceneTotal, reduce }: SceneSortViewProps) {
  const scenePhase = useSessionStore((s) => s.state.scenePhase);
  const choiceIndex = useSessionStore((s) => s.state.choiceIndex);
  const statementBuckets = useSessionStore((s) => s.state.statementBuckets);
  const startScene = useSessionStore((s) => s.startScene);
  const rateChoice = useSessionStore((s) => s.rateChoice);

  const rating = scenePhase === 'rating';
  // Snaps under reduced motion; otherwise the card compress + reveal share the soft glide.
  const morph = reduce
    ? { duration: 0 }
    : { duration: durations.glide, ease: easings.soft };

  return (
    <div className="flex w-full flex-col">
      {/* Shrinking spacer (the mockup's qSpacer): tall in intro, near-zero in rating. Because the
          runner top-anchors, pressing Continue collapses this so the card rises as the choices grow —
          the liked "slide upward", without the flex-centering that caused the scene→scene lurch. The
          56px resting height is a deliberate layout-tuning constant (off the space scale on purpose —
          this is an animated spacer height, not a token-able spacing utility). */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ height: rating ? 0 : 56 }}
        transition={morph}
      />

      <div className="flex w-full flex-col gap-space-5">
      {/* The scene-context card. Padding (32→24) plus the scenario + question font sizes animate as
          the card morphs intro→rating; these mirror the mockup's qSceneCard morph. A motion
          element with no `initial` snaps to the right phase on mount (Back re-entry) and only
          animates when scenePhase changes (the Continue press). */}
      <motion.div
        className="flex flex-col gap-space-3 rounded-lg border border-glass-border bg-glass-fill"
        initial={false}
        animate={{ padding: rating ? 24 : 32 }}
        transition={morph}
      >
        <p className="text-small text-text-on-dark-faint" data-testid="scene-progress">
          Scene {sceneNumber} of {sceneTotal}
        </p>
        <div className="border-t border-glass-border-soft" />
        {/* Inverted hierarchy (research: the scenario above a bold question kept getting skipped).
            The SCENARIO now leads at a heading size + weight; the QUESTION drops below it, smaller and
            lighter, so the eye reads the setup first. Both morph smaller as the card compresses into
            the rating beat, between type-scale steps via the lib typeScale mirror (Motion needs px
            strings; see typeScale.ts): scenario h4→body, question h5→body. `initial={false}` pins
            the mount value so a Back re-entry snaps to the right phase. */}
        <motion.p
          className="font-heading font-bold text-text-on-dark"
          initial={false}
          animate={rating ? { ...typeScale.body } : { ...typeScale.h4 }}
          transition={morph}
        >
          {step.prompt}
        </motion.p>
        <motion.h2
          className="font-body font-normal text-text-on-dark"
          initial={false}
          animate={rating ? { ...typeScale.body } : { ...typeScale.h5 }}
          transition={morph}
        >
          {step.question}
        </motion.h2>

        {!rating && (
          <div className="mt-space-2">
            <CtaButton
              color="gold"
              size="lg"
              data-testid="scene-continue"
              onClick={startScene}
            >
              Continue <Icon name="arrow-r" size={18} />
            </CtaButton>
          </div>
        )}
      </motion.div>

      {/* Choices region. Reveals (height 0 → auto) when rating; `initial={false}` so re-entering a
          scene via Back shows it already open while the Continue press still animates it in. */}
      <AnimatePresence initial={false}>
        {rating && (
          <motion.div
            key="choices"
            initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={morph}
            style={{ overflow: 'hidden' }}
          >
            <BucketSort
              items={step.choices}
              currentIndex={choiceIndex}
              buckets={SORT_BUCKETS}
              reduce={reduce}
              bucketOf={(id) => statementBuckets[id]}
              onRate={rateChoice}
              cardTestId="scene-card"
            />
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
