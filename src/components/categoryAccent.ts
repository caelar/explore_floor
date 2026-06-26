import type { CategoryId } from '@/data/types';

// Role accent text classes for the narrative results (DATA_MODEL §17). Reuses existing brand
// tokens — technician→gold, specialist→blue, integrator→teal (gold carries over from the old
// Operate, which the entry Technician folds in) — so no new palette work. MUST be full literal
// class names: a dynamic `text-${token}` would not be seen by Tailwind v4's scanner. Used only
// by the category results screens.

export const CATEGORY_ACCENT_TEXT: Record<CategoryId, string> = {
  technician: 'text-arm-gold',
  specialist: 'text-arm-blue',
  integrator: 'text-arm-teal',
};
