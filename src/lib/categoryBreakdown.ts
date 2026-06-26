import type { BucketId, CategoryFlow, CategoryId } from '@/data/types';
import { CATEGORIES } from '@/data/types';

import { walkPath } from './categoryScoring';

// Score provenance for the results "why you scored that way" read (DATA_MODEL §17). Pure,
// and walks the SAME branch-aware path as calculateCategoryScores, so the labels it surfaces
// are exactly the items that moved each role's raw score. Currently unwired — it's the
// match-explanation engine the high-fidelity narrative results screen (step 8) will graft on.
// `maybe` choices are reported separately — they earn nothing today (MAYBE_WEIGHT = 0) but
// are worth showing as "on the fence".

export interface CategoryContribution {
  category: CategoryId;
  /** Labels of items that added to this category's raw score. */
  earned: string[];
  /** Labels marked 'maybe' for this category (scored 0 now; shown as on-the-fence). */
  maybe: string[];
  earnedCount: number;
  /** This category's achievable max on the path taken (the denominator). */
  totalCount: number;
}

export type CategoryContributions = Record<CategoryId, CategoryContribution>;

export function categoryContributions(
  flow: CategoryFlow,
  answers: Record<string, string>,
  statementBuckets: Record<string, BucketId>,
): CategoryContributions {
  const out = {} as CategoryContributions;
  for (const category of CATEGORIES) {
    out[category] = { category, earned: [], maybe: [], earnedCount: 0, totalCount: 0 };
  }

  for (const step of walkPath(flow.steps, answers)) {
    switch (step.type) {
      case 'mc': {
        const chosen = step.choices.find((choice) => choice.id === answers[step.id]);
        for (const category of new Set(step.choices.flatMap((c) => c.categories))) {
          out[category].totalCount += 1;
        }
        for (const category of chosen?.categories ?? []) {
          out[category].earned.push(chosen!.label);
          out[category].earnedCount += 1;
        }
        break;
      }
      case 'scene':
        // Each scene choice is bucketed like a statement (D-018): "That's me" earns,
        // "Kinda me" ('maybe') is on-the-fence, "Not me"/unanswered earns nothing.
        for (const choice of step.choices) {
          const entry = out[choice.category];
          entry.totalCount += 1;
          const bucket = statementBuckets[choice.id];
          if (bucket === 'thats-me') {
            entry.earned.push(choice.label);
            entry.earnedCount += 1;
          } else if (bucket === 'maybe') {
            entry.maybe.push(choice.label);
          }
        }
        break;
    }
  }

  return out;
}
