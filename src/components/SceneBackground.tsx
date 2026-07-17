import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { durations, easings } from '@/lib';

interface SceneBackgroundProps {
  /** Absolute URL or public-relative path for the background image. Pass undefined to fade out. */
  src: string | undefined;
  /** Landing uses near-black/50 (Figma 1368:440); scene illustrations use black/50 for AA. */
  overlay?: 'landing' | 'scene';
}

// Full-bleed scene background layer rendered behind the quiz card (z-10, below AppHeader z-40,
// above the dark canvas at z-auto). Uses AnimatePresence so scenes crossfade as the step changes
// and the background fades out entirely on non-scene steps (MC questions, results navigation).
export function SceneBackground({ src, overlay = 'scene' }: SceneBackgroundProps) {
  const reduce = !!useReducedMotion();
  const overlayClass = overlay === 'landing' ? 'bg-near-black/50' : 'bg-black/50';

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          key={src}
          className="pointer-events-none fixed inset-0 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: reduce ? durations.snap : durations.pour,
            ease: easings.soft,
          }}
        >
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Dark veil that keeps all text legible across both dark and light scene
              illustrations. 50% (up from 30%) is the minimum that brings white
              text (#f2f4f5) to ≥ 4.5:1 contrast on the lightest background in the
              set (scene 2, light gray-blue). Dark scenes like scene 1 (deep teal)
              remain well above threshold at any overlay level. */}
          <div className={`absolute inset-0 ${overlayClass}`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
