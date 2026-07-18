import { AnimatePresence, motion, useAnimate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { CHARACTER_VARIATIONS } from '@/data/sceneBackgrounds';
import { durations, easings } from '@/lib';

import { ThoughtBubble } from './ThoughtBubble';

interface SceneCharacterProps {
  /** Public-relative path for the character sprite. Pass undefined when no character for this scene. */
  src: string | undefined;
  /** Public-relative path for the thought bubble image. Pass undefined for no bubble. */
  bubbleSrc: string | undefined;
  /** Scene step id — passed through to ThoughtBubble for per-scene icons. */
  sceneId: string | undefined;
  /** True when the scene is in the rating phase (after Continue is pressed). */
  visible: boolean;
  /** Which choice inside the scene is currently shown (0-based). Used to re-trigger the
   *  bounce and cycle the thought bubble's symbol on every new question. */
  choiceIndex: number;
  reduce: boolean;
  /** Bounce-pose pool for the picked character; defaults to the girl variations. */
  variations?: readonly string[];
}

// Choreography (all delays measured from when visible=true, i.e. Continue press):
//   0.0 – 0.4s  card slides left        (FlowRunner, cardShift)
//   0.4 – 0.8s  character slides in     (CHAR_DELAY + durations.glide)
//   1.0s        character bounce starts  (hint that pose will change)
//   1.1s        thought bubble pops up   (circles stagger in from ThoughtBubble)
const CHAR_DELAY = durations.glide;             // 0.4s
const BOUNCE_DELAY = durations.glide * 2 + 0.2; // 1.0s
const BUBBLE_DELAY = durations.glide * 2 + 0.3; // 1.1s

// Scaled img is 985.442px wide. The img used to sit at left:-218px inside a
// container at left:880 — that placed the img's left edge at viewport x=662,
// but overflow-hidden on the container (starting at x=880) clipped those 218px.
// Fix: shift the container left by 218px (→662) and set img left:0 so the full
// SVG is visible while img pixel 218 stays at viewport x=880 (same pose).
const CHAR_IMG_WIDTH = 985.442;
const CHAR_IMG_OFFSET = 218; // former img left:-218px bleed
const CHAR_CONTAINER_LEFT = 880 - CHAR_IMG_OFFSET; // 662
const CHAR_IMG_LEFT = 0;
const CHAR_CONTAINER_WIDTH = CHAR_IMG_WIDTH;

// How long after a new choice appears before the re-bounce fires.
const REBOUNCE_DELAY = 0.15; // seconds

function pickNextVariation(previous: string | undefined, pool: readonly string[]): string {
  const options = pool.filter((v) => v !== previous);
  if (options.length === 0) return pool[0] ?? previous ?? '';
  return options[Math.floor(Math.random() * options.length)];
}

export function SceneCharacter({ src, bubbleSrc, sceneId, visible, choiceIndex, reduce, variations = CHARACTER_VARIATIONS }: SceneCharacterProps) {
  // Default pose on entrance; each bounce swaps to a random variation.
  const [displayedSrc, setDisplayedSrc] = useState(src);
  const previousPoseRef = useRef<string | undefined>(src);
  // useAnimate lets us imperatively replay the bounce each time choiceIndex changes,
  // rather than relying on a one-shot `animate` prop that only fires on mount.
  const [charRef, animateBounce] = useAnimate();

  useEffect(() => {
    previousPoseRef.current = src;
    setDisplayedSrc(src);
  }, [src]);

  useEffect(() => {
    if (!visible) {
      previousPoseRef.current = src;
      setDisplayedSrc(src);
      return;
    }
    if (reduce) return;
    // First question (choiceIndex=0) keeps the longer choreography delay so the bounce
    // follows the character's entrance. Subsequent questions use a short pause instead.
    const delay = choiceIndex === 0 ? BOUNCE_DELAY : REBOUNCE_DELAY;

    const switchTimer = setTimeout(() => {
      const next = pickNextVariation(previousPoseRef.current, variations);
      previousPoseRef.current = next;
      setDisplayedSrc(next);
    }, delay * 1000);

    if (charRef.current) {
      void animateBounce(
        charRef.current,
        { y: [0, -12, 0, -6, 0, -3, 0] },
        {
          duration: durations.pour,
          ease: easings.soft,
          times: [0, 0.15, 0.35, 0.5, 0.65, 0.8, 1],
          delay,
        },
      );
    }

    return () => clearTimeout(switchTimer);
  }, [visible, choiceIndex, reduce, animateBounce, src, variations, charRef]);

  if (!src) return null;

  return (
    <>
      {/* ── Character ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="scene-character"
            className="pointer-events-none fixed z-20"
            style={{ left: `${CHAR_CONTAINER_LEFT}px`, top: '60px', bottom: 0 }}
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
            <div
              className="relative h-full overflow-hidden"
              style={{ width: CHAR_CONTAINER_WIDTH }}
            >
              <img
                ref={charRef}
                src={displayedSrc}
                alt=""
                aria-hidden="true"
                className="absolute max-w-none object-cover object-bottom"
                style={{
                  width: `${CHAR_IMG_WIDTH}px`,
                  height: 'calc(100% + 26px)',
                  top: '5px',
                  left: `${CHAR_IMG_LEFT}px`,
                }}
              />
            </div>
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
              // Figma node 357:207 — main bubble anchor at (670, 127).
              style={{ left: '770px', top: '127px' }}
              // The parent wrapper only handles presence fade so AnimatePresence
              // can unmount cleanly. Individual circle entrances (spring scale)
              // and perpetual bobs are owned by ThoughtBubble internally.
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: durations.snap, ease: easings.soft } }}
              transition={{ duration: 0.05 }}
            >
              <ThoughtBubble baseDelay={BUBBLE_DELAY} sceneId={sceneId} symbolIndex={choiceIndex} reduce={reduce} />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
}
