import type {
  BucketId,
  CategoryFlow,
  CategoryId,
  CategoryResult,
  CategoryWeights,
  FlowStep,
} from '@/data/types';
import { CATEGORIES } from '@/data/types';

// The category scoring engine for the study flows (DATA_MODEL §17). Pure, mirrors
// scoring.ts: each category is normalized against its own achievable max so unequal
// statement counts (8/7/7/8) don't structurally favor any category. The max is
// computed over the path the user actually took — a branched-over step (Q2 on the
// "No" path) contributes to neither raw nor max.

/** How much a 'maybe' bucket counts toward its statement's category. The prior user
 *  study asked for a maybe option; the team wants it scored as a no FOR NOW. Tunable
 *  here, in one place — flipping this re-weights every maybe with no other change. */
export const MAYBE_WEIGHT = 0;

export function calculateCategoryScores(
  flow: CategoryFlow,
  answers: Record<string, string>,
  statementBuckets: Record<string, BucketId>,
): CategoryResult {
  const raw = zeroWeights();
  const max = zeroWeights();

  for (const step of walkPath(flow.steps, answers)) {
    addStepMax(max, step);
    addStepRaw(raw, step, answers, statementBuckets);
  }

  const matchPercentages = Object.fromEntries(
    CATEGORIES.map((c) => [c, toPercent(raw[c], max[c])]),
  ) as CategoryWeights;

  // Stable sort keeps the CATEGORIES order as the deterministic tiebreak.
  const ranking = [...CATEGORIES].sort((a, b) => matchPercentages[b] - matchPercentages[a]);

  return { raw, matchPercentages, ranking, primaryCategory: ranking[0] };
}

/** The full-flow category ceiling, branches included — what a user could score if every
 *  step were reachable. data-integrity asserts this equals the flow's declared
 *  expectedCategoryMax, so authored content can't silently drift. */
export function computeCategoryMax(steps: FlowStep[]): CategoryWeights {
  const max = zeroWeights();
  for (const step of steps) addStepMax(max, step);
  return max;
}

/** Yield the steps on the path the recorded answers actually took. MC choices may
 *  branch forward by step id; everything else falls through sequentially. Backward
 *  or unknown branch targets are ignored (data-integrity rejects them at author time).
 *  Exported so the results breakdown walks the exact same path as the score. */
export function* walkPath(
  steps: FlowStep[],
  answers: Record<string, string>,
): Generator<FlowStep> {
  const idToIndex = new Map(steps.map((step, index) => [step.id, index]));
  let index = 0;
  while (index < steps.length) {
    const step = steps[index];
    yield step;
    let next = index + 1;
    if (step.type === 'mc') {
      const chosen = step.choices.find((choice) => choice.id === answers[step.id]);
      if (chosen?.branchTo !== undefined) {
        const target = idToIndex.get(chosen.branchTo);
        if (target !== undefined && target > index) next = target;
      }
    }
    index = next;
  }
}

/** A step's ceiling contribution: single-select steps add 1 per category *present*
 *  among their choices (two plan-mapped choices in one question still cap plan at 1);
 *  each sort statement adds 1 to its own category. */
function addStepMax(max: CategoryWeights, step: FlowStep): void {
  switch (step.type) {
    case 'mc': {
      const present = new Set<CategoryId>(step.choices.flatMap((choice) => choice.categories));
      for (const category of present) max[category] += 1;
      break;
    }
    case 'scene':
      for (const choice of step.choices) max[choice.category] += 1;
      break;
    case 'statementSort':
      for (const statement of step.statements) max[statement.category] += 1;
      break;
  }
}

function addStepRaw(
  raw: CategoryWeights,
  step: FlowStep,
  answers: Record<string, string>,
  statementBuckets: Record<string, BucketId>,
): void {
  switch (step.type) {
    case 'mc': {
      const chosen = step.choices.find((choice) => choice.id === answers[step.id]);
      for (const category of chosen?.categories ?? []) raw[category] += 1;
      break;
    }
    case 'scene': {
      const chosen = step.choices.find((choice) => choice.id === answers[step.id]);
      if (chosen) raw[chosen.category] += 1;
      break;
    }
    case 'statementSort':
      for (const statement of step.statements) {
        raw[statement.category] += bucketWeight(statementBuckets[statement.id]);
      }
      break;
  }
}

function bucketWeight(bucket: BucketId | undefined): number {
  if (bucket === 'thats-me') return 1;
  if (bucket === 'maybe') return MAYBE_WEIGHT;
  return 0; // 'not-me' or unanswered
}

function zeroWeights(): CategoryWeights {
  return { operate: 0, repair: 0, program: 0, plan: 0 };
}

function toPercent(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
