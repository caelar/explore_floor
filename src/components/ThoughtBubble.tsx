// Thought bubble rendered as CSS shapes so it's always visible against
// any scene background without depending on SVG fill-opacity math.
//
// Structure (matches Figma node 278:209):
//   ┌──────────────────┐
//   │  large circle    │  170 × 170 px  — the main bubble body
//   │   [ symbol ]     │
//   └──────────────────┘
//          ● 40px  — mid dot
//            ● 28px  — small dot (tail terminus)
//
// Animation:
//   Circles pop in one-by-one starting from the smallest (tail end first),
//   each with a spring scale entrance staggered by ~0.15s. Once in, every
//   circle bobs gently on the y-axis in a continuous loop. Each circle has a
//   slightly different amplitude and duration so they drift in and out of
//   phase, keeping the bubble feeling alive without being distracting.
//
//   Each time `symbolIndex` changes (new question in the scene), the symbol
//   inside the main bubble springs out and the next one springs in. The
//   symbols are placeholders — they will be replaced with per-scene
//   illustrations once those assets are ready.
//
// Viewport position: set by the parent motion.div in SceneCharacter.

import { AnimatePresence, motion } from 'motion/react';

import { getThoughtBubbleIcon,THOUGHT_BUBBLE_ICON_PX } from '@/data/thoughtBubbleIcons';
import { durations } from '@/lib';

// Placeholder symbols for choices without a custom illustration yet.
const SYMBOLS = ['?', '!', '★'];

interface ThoughtBubbleProps {
  /** Seconds to wait before the first circle begins its entrance. */
  baseDelay?: number;
  /** Scene step id (e.g. n-s1) — used to look up per-scene bubble icons. */
  sceneId?: string;
  /** Which choice inside the scene is shown (0-based). Pass choiceIndex directly. */
  symbolIndex?: number;
  /** True when prefers-reduced-motion is active — skips spring and bob. */
  reduce?: boolean;
}

// Shared visual style for every circle (frosted-glass look).
const glass = {
  background: 'rgba(255,255,255,0.28)',
  backdropFilter: 'blur(6px)',
  border: '2px solid rgba(255,255,255,0.7)',
} as React.CSSProperties;

export function ThoughtBubble({ baseDelay = 0, sceneId, symbolIndex = 0, reduce = false }: ThoughtBubbleProps) {
  const iconSrc = getThoughtBubbleIcon(sceneId, symbolIndex);
  const symbol = SYMBOLS[symbolIndex % SYMBOLS.length];
  const contentKey = iconSrc ?? symbol;

  // Returns the animate + transition props for one circle.
  // stagger  — additional delay on top of baseDelay before entrance starts
  // yAmt     — peak vertical travel for the idle bob (px)
  // bobMs    — duration of one full bob cycle (seconds)
  function circle(stagger: number, yAmt: number, bobMs: number) {
    const entranceDelay = baseDelay + stagger;
    // Bob starts only after the spring entrance has had time to settle.
    const bobDelay = entranceDelay + 0.45;

    if (reduce) {
      return {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { duration: durations.instant, delay: entranceDelay },
      };
    }

    return {
      initial: { scale: 0, opacity: 0 },
      // y keyframes drive the perpetual bob; scale/opacity handle the entrance.
      animate: { scale: 1, opacity: 1, y: [0, -yAmt, 0] },
      transition: {
        // Deliberately snappier than the shared `spring` token — the bubble's pop-in feel.
        scale: { type: 'spring' as const, stiffness: 520, damping: 24, delay: entranceDelay },
        opacity: { duration: durations.instant, delay: entranceDelay },
        y: {
          duration: bobMs,
          repeat: Infinity,
          repeatType: 'loop' as const,
          ease: 'easeInOut',
          // Waits until entrance is done before looping.
          delay: bobDelay,
        },
      },
    };
  }

  return (
    // 170 × 228 bounding box — same proportions as the Figma SVG viewBox.
    <div className="relative" style={{ width: 170, height: 228 }}>
      {/* Small dot (tail terminus) — pops in first */}
      <motion.div
        className="absolute rounded-full"
        style={{
          ...glass,
          left: 141,
          top: 212,
          width: 28,
          height: 28,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
        {...circle(0, 2, 1.7)}
      />

      {/* Mid dot — pops in second */}
      <motion.div
        className="absolute rounded-full"
        style={{
          ...glass,
          left: 97,
          top: 180,
          width: 40,
          height: 40,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        }}
        {...circle(0.15, 3, 2.1)}
      />

      {/* Main bubble body — pops in last */}
      <motion.div
        className="absolute rounded-full"
        style={{
          ...glass,
          left: 0,
          top: 0,
          width: 170,
          height: 170,
          boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
        }}
        {...circle(0.3, 5, 2.5)}
      >
        {/* Symbol — springs out and back in each time symbolIndex changes.
            mode="wait" ensures the old symbol exits fully before the new one enters,
            keeping the swap crisp on fast taps. */}
        <div
          className={`absolute inset-0 flex items-center justify-center${iconSrc ? '' : ' pb-2'}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={contentKey}
              className="flex items-center justify-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={
                reduce
                  ? { duration: 0.1 }
                  : { type: 'spring', stiffness: 500, damping: 22, duration: 0.25 }
              }
            >
              {iconSrc ? (
                <img
                  src={iconSrc}
                  alt=""
                  aria-hidden="true"
                  width={THOUGHT_BUBBLE_ICON_PX}
                  height={THOUGHT_BUBBLE_ICON_PX}
                  className="shrink-0 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
                  style={{
                    width: THOUGHT_BUBBLE_ICON_PX,
                    height: THOUGHT_BUBBLE_ICON_PX,
                  }}
                />
              ) : (
                <span
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 700,
                    fontSize: 72,
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.9)',
                    textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    display: 'block',
                  }}
                >
                  {symbol}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
