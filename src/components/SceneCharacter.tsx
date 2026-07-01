import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { useEffect } from 'react';

import { durations, easings } from '@/lib';

import { ThoughtBubble } from './ThoughtBubble';

interface SceneCharacterProps {
  /** Public-relative path for the character sprite. Pass undefined when no character for this scene. */
  src: string | undefined;
  /** Public-relative path for the thought bubble image. Pass undefined for no bubble. */
  bubbleSrc: string | undefined;
  /** True when the scene is in the rating phase (after Continue is pressed). */
  visible: boolean;
  /** Which choice inside the scene is currently shown (0-based). Used to re-trigger the
   *  bounce and cycle the thought bubble's symbol on every new question. */
  choiceIndex: number;
  reduce: boolean;
}

// Choreography (all delays measured from when visible=true, i.e. Continue press):
//   0.0 – 0.4s  card slides left        (FlowRunner, cardShift)
//   0.4 – 0.8s  character slides in     (CHAR_DELAY + durations.glide)
//   1.0s        character bounce starts  (hint that pose will change)
//   1.1s        thought bubble pops up   (circles stagger in from ThoughtBubble)
const CHAR_DELAY = durations.glide;             // 0.4s
const BOUNCE_DELAY = durations.glide * 2 + 0.2; // 1.0s
const BUBBLE_DELAY = durations.glide * 2 + 0.3; // 1.1s

// How long after a new choice appears before the re-bounce fires.
const REBOUNCE_DELAY = 0.15; // seconds

export function SceneCharacter({ src, bubbleSrc, visible, choiceIndex, reduce }: SceneCharacterProps) {
  // useAnimate lets us imperatively replay the bounce each time choiceIndex changes,
  // rather than relying on a one-shot `animate` prop that only fires on mount.
  const [charRef, animateBounce] = useAnimate();

  useEffect(() => {
    if (!visible || reduce || !charRef.current) return;
    // First question (choiceIndex=0) keeps the longer choreography delay so the bounce
    // follows the character's entrance. Subsequent questions use a short pause instead.
    const delay = choiceIndex === 0 ? BOUNCE_DELAY : REBOUNCE_DELAY;
    void animateBounce(
      charRef.current,
      { y: [0, -12, 0, -6, 0, -3, 0] },
      {
        duration: 0.7,
        ease: easings.soft,
        times: [0, 0.15, 0.35, 0.5, 0.65, 0.8, 1],
        delay,
      },
    );
  }, [visible, choiceIndex, reduce, animateBounce]);

  if (!src) return null;

  return (
    <>
      {/* ── Character ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="scene-character"
            className="pointer-events-none fixed z-20"
            // Figma spec (node 299:148): character is 480×832px anchored at
            // (calc(60%+102px), 165px). The image is taller than the 800px
            // viewport so the feet/legs are cropped below the fold — this is
            // intentional, giving an "in-the-scene" zoomed perspective.
            style={{ left: 'calc(60% + 102px)', top: '165px' }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 80 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: 80, transition: { duration: durations.snap, ease: easings.soft } }
            }
            transition={{
              duration: reduce ? durations.snap : durations.glide,
              ease: easings.soft,
              delay: reduce ? 0 : CHAR_DELAY,
            }}
          >
            {/* Bounce is driven imperatively by the useEffect above (useAnimate),
                so this img carries no `animate` prop for y. */}
            <img
              ref={charRef}
              src={src}
              alt=""
              aria-hidden="true"
              className="h-[832px] w-[480px] object-contain object-top"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Thought bubble ────────────────────────────────────────────────── */}
      {bubbleSrc && (
        <AnimatePresence>
          {visible && (
            <motion.div
              key="thought-bubble"
              // z-30 places the bubble above the quiz card (z-20) so it never
              // gets clipped by the card's stacking context.
              className="pointer-events-none fixed z-30"
              // Exact position from Figma node 278:209 ("Think bubble"),
              // which already uses the zoomed-in 480×832 character (node 299:150).
              style={{ left: '800px', top: '140px' }}
              // The parent wrapper only handles presence fade so AnimatePresence
              // can unmount cleanly. Individual circle entrances (spring scale)
              // and perpetual bobs are owned by ThoughtBubble internally.
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: durations.snap, ease: easings.soft } }}
              transition={{ duration: 0.05 }}
            >
              <ThoughtBubble baseDelay={BUBBLE_DELAY} symbolIndex={choiceIndex} reduce={reduce} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
