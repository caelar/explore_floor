import type { QuestionSet, QuestionSetId } from '../types';
import { setA } from './setA';

// The question-set registry (DATA_MODEL §16). Only set A remains: the formal/playful
// A/B language test was superseded by the question-structure study (flows/, DATA_MODEL
// §17, D-017) before set B's content was ever authored. The classic flow wraps set A;
// the per-set data-integrity tests still iterate the list.

export const questionSets: Record<QuestionSetId, QuestionSet> = { a: setA };

/** Ordered list — drives `describe.each` in the per-set data-integrity tests. */
export const questionSetList: QuestionSet[] = [setA];
