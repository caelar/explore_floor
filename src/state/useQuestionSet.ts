import { classicFlow } from '@/data';
import type { QuestionSet } from '@/data/types';

import { useFlow } from './useFlow';

/** The classic flow's question set — items + all the copy it owns (DATA_MODEL §16).
 *  Only the classic screens (Sort, Build, ClassicResults) consume this; when a category
 *  flow is active they're unreachable, but fall back to the classic set defensively
 *  rather than crash on an out-of-band render. */
export function useQuestionSet(): QuestionSet {
  const flow = useFlow();
  return flow.kind === 'classic' ? flow.questionSet : classicFlow.questionSet;
}
