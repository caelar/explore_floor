import type { CategoryId } from '@/data/types';

// Category accent text classes for the study flows (DATA_MODEL §17). Reuses the four
// existing brand tokens — operate→yellow, repair→orange, program→blue, plan→teal — so no
// new palette work (the study presentation stays minimal). MUST be full literal class
// names: a dynamic `text-${token}` would not be seen by Tailwind v4's scanner. Used only by
// the category results screens.

export const CATEGORY_ACCENT_TEXT: Record<CategoryId, string> = {
  operate: 'text-arm-gold',
  repair: 'text-arm-orange',
  program: 'text-arm-blue',
  plan: 'text-arm-teal',
};
