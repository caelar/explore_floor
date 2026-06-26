import type { Flow, FlowId } from '../types';
import { narrativeFlow } from './narrativeFlow';

// The flow registry (DATA_MODEL §17). The store resolves the active flow through this map;
// the landing switcher and the per-flow data-integrity tests iterate the ordered list.
// Narrative is the only flow after the strip (Phase 4); Classic and Exam were archived.

export const flows: Record<FlowId, Flow> = {
  narrative: narrativeFlow,
};

export { narrativeFlow };

/** The default (and only) flow. */
export const defaultFlowId: FlowId = 'narrative';

/** Ordered list — drives the landing switcher segments and `describe.each` in tests. */
export const flowList: Flow[] = [narrativeFlow];
