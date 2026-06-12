import type { Flow, FlowId } from '../types';
import { classicFlow } from './classicFlow';
import { examFlow } from './examFlow';
import { narrativeFlow } from './narrativeFlow';

// The flow registry (DATA_MODEL §17). The store resolves the active flow through
// this map; the landing switcher and the per-flow data-integrity tests iterate the
// ordered list. Adding a flow = author the file, register it here, done.

export const flows: Record<FlowId, Flow> = {
  narrative: narrativeFlow,
  exam: examFlow,
  classic: classicFlow,
};

// Concrete exports so consumers can use narrowed types without re-narrowing
// (the classic question set especially — useQuestionSet's defensive fallback).
export { classicFlow, examFlow, narrativeFlow };

/** Narrative (the first switcher tab) is the default. Classic is dormant — kept
 *  registered here so its data stays validated, but it has no UI entry: the landing
 *  switcher dropped it for the role-select comparator (D-021). */
export const defaultFlowId: FlowId = 'narrative';

/** Ordered list — drives the landing switcher segments and `describe.each` in tests. */
export const flowList: Flow[] = [narrativeFlow, examFlow, classicFlow];
