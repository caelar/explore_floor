/** Render size for bubble illustrations (matches Figma). */
export const THOUGHT_BUBBLE_ICON_PX = 100;

// Per-scene, per-choice illustrations inside the thought bubble.
// Keys: scene step id → choice index (0-based) → public-relative asset path.
// Scenes/choices without an entry fall back to the placeholder symbols in ThoughtBubble.
export const THOUGHT_BUBBLE_ICONS: Record<string, Partial<Record<number, string>>> = {
  'n-s1': {
    0: '/explore_floor/scenes/bubble-icons/scene-1-q1.svg',
    1: '/explore_floor/scenes/bubble-icons/scene-1-q2.svg',
    2: '/explore_floor/scenes/bubble-icons/scene-1-q3.svg',
  },
  'n-s2': {
    0: '/explore_floor/scenes/bubble-icons/scene-2-q1.svg',
    1: '/explore_floor/scenes/bubble-icons/scene-2-q2.svg',
    2: '/explore_floor/scenes/bubble-icons/scene-2-q3.svg',
  },
  'n-s3': {
    0: '/explore_floor/scenes/bubble-icons/scene-3-q1.svg',
    1: '/explore_floor/scenes/bubble-icons/scene-3-q2.svg',
    2: '/explore_floor/scenes/bubble-icons/scene-3-q3.svg',
  },
  'n-s4': {
    0: '/explore_floor/scenes/bubble-icons/scene-4-q1.svg',
    1: '/explore_floor/scenes/bubble-icons/scene-4-q2.svg',
    2: '/explore_floor/scenes/bubble-icons/scene-4-q3.svg',
  },
  'n-s5': {
    0: '/explore_floor/scenes/bubble-icons/scene-5-q1.svg',
    1: '/explore_floor/scenes/bubble-icons/scene-5-q2.svg',
    2: '/explore_floor/scenes/bubble-icons/scene-5-q3.svg',
  },
  'n-s6': {
    0: '/explore_floor/scenes/bubble-icons/scene-6-q1.svg',
    1: '/explore_floor/scenes/bubble-icons/scene-6-q2.svg',
    2: '/explore_floor/scenes/bubble-icons/scene-6-q3.svg',
  },
  'n-s7': {
    0: '/explore_floor/scenes/bubble-icons/scene-7-q1.svg',
    1: '/explore_floor/scenes/bubble-icons/scene-7-q2.svg',
    2: '/explore_floor/scenes/bubble-icons/scene-7-q3.svg',
  },
};

export function getThoughtBubbleIcon(sceneId: string | undefined, choiceIndex: number): string | undefined {
  if (!sceneId) return undefined;
  return THOUGHT_BUBBLE_ICONS[sceneId]?.[choiceIndex];
}
