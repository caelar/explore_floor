import type { CharacterId } from './types';

// Maps each scene step ID to a background image path (relative to /public).
// Presentation assets live here, not in the flow data, so quiz content stays
// independent of visuals and both can be tuned separately.
// Add a new entry here when a scene's background image is ready; scenes without
// an entry fall back to the dark canvas background.

/** Figma 1368:314 — factory-floor illustration shared by Landing + intro MC steps. */
export const LANDING_BG = '/explore_floor/scenes/landing-bg.png';

/** Figma 1369:452 — portrait art on the choose-character cards. */
export const CHARACTER_SELECT_ART: Record<CharacterId, string> = {
  girl: '/explore_floor/scenes/characters/character-select-girl.svg',
  boy: '/explore_floor/scenes/characters/character-select-boy.svg',
};

// Default character shown on entrance; bounce swaps to a random variation.
export const CHARACTER_DEFAULT = '/explore_floor/scenes/character.svg';
export const CHARACTER_VARIATIONS = [
  '/explore_floor/scenes/character-variation-1.svg',
  '/explore_floor/scenes/character-variation-2.svg',
  '/explore_floor/scenes/character-variation-3.svg',
] as const;

/** Boy scene sprites (Figma Quiz-Sketches-Assets 428:147). */
export const CHARACTER_BOY_DEFAULT = '/explore_floor/scenes/character-boy.svg';
export const CHARACTER_BOY_VARIATIONS = [
  '/explore_floor/scenes/character-boy-variation-1.svg',
  '/explore_floor/scenes/character-boy-variation-2.svg',
  '/explore_floor/scenes/character-boy-variation-3.svg',
] as const;

/** Scene-rating sprites + bounce pool, keyed by the user's character pick. */
export const CHARACTER_SCENE_DEFAULT: Record<CharacterId, string> = {
  girl: CHARACTER_DEFAULT,
  boy: CHARACTER_BOY_DEFAULT,
};

export const CHARACTER_SCENE_VARIATIONS: Record<CharacterId, readonly string[]> = {
  girl: CHARACTER_VARIATIONS,
  boy: CHARACTER_BOY_VARIATIONS,
};

/** Resolve the scene-rating character sprite for the active step + pick. */
export function sceneCharacterSrc(_sceneId: string, characterId: CharacterId): string {
  return CHARACTER_SCENE_DEFAULT[characterId];
}

export const SCENE_BACKGROUNDS: Record<string, string> = {
  'n-s1': '/explore_floor/scenes/scene-1.png',
  'n-s2': '/explore_floor/scenes/scene-2.png',
  'n-s3': '/explore_floor/scenes/scene-3.png',
  'n-s4': '/explore_floor/scenes/scene-4.png',
  'n-s5': '/explore_floor/scenes/scene-5.png',
  'n-s6': '/explore_floor/scenes/scene-6.png',
  'n-s7': '/explore_floor/scenes/scene-7.png',
};

// Legacy per-scene map (girl default). FlowRunner resolves via sceneCharacterSrc instead.
export const SCENE_CHARACTERS: Record<string, string> = {
  'n-s1': CHARACTER_DEFAULT,
  'n-s2': CHARACTER_DEFAULT,
  'n-s3': CHARACTER_DEFAULT,
  'n-s4': CHARACTER_DEFAULT,
  'n-s5': CHARACTER_DEFAULT,
  'n-s6': CHARACTER_DEFAULT,
  'n-s7': CHARACTER_DEFAULT,
};

// Maps each scene step ID to a thought bubble (presence signals that a bubble
// should render for this scene). The value is kept as a path for forward-compat
// (future scenes may carry different illustration assets), but ThoughtBubble
// renders with CSS, not as an <img>. All scenes share the same placeholder entry.
const BUBBLE = '/explore_floor/scenes/thought-bubble.svg';
export const SCENE_BUBBLES: Record<string, string> = {
  'n-s1': BUBBLE,
  'n-s2': BUBBLE,
  'n-s3': BUBBLE,
  'n-s4': BUBBLE,
  'n-s5': BUBBLE,
  'n-s6': BUBBLE,
  'n-s7': BUBBLE,
};
