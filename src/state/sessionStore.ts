import { create } from 'zustand';

import { defaultFlowId, flows } from '@/data';
import type { BucketId, LandingConditionId, SessionState } from '@/data/types';
import { calculateCategoryScores } from '@/lib';

// The single session store (DATA_MODEL §17). Store actions are the ONLY place that touches
// /src/lib — screens read state and dispatch actions, never compute. No persistence in v1:
// state lives in memory and a refresh starts fresh (intentional for the prototype).
//
// `flowId` (the study condition) deliberately lives NEXT TO `state`, not inside it: `reset()`
// replaces only `state`, so the researcher's chosen condition survives "Start over" between
// participants. The flow is resolved via `get()` INSIDE each action so a condition switched
// on Landing is honored. The armed condition can also be 'select' (the /select comparator, a
// route not a flow): Landing's CTA routes there without starting a session, so the flow
// actions never run with it armed; `activeFlow()` still falls back to the default defensively.

interface SessionStore {
  state: SessionState;
  flowId: LandingConditionId;
  selectFlow: (id: LandingConditionId) => void;
  startSession: () => void;
  recordAnswer: (stepId: string, choiceId: string) => void;
  recordStatement: (statementId: string, bucket: BucketId) => void;
  /** Move the runner cursor: to a branch target by step id, or to the next step. */
  advanceStep: (toStepId?: string) => void;
  completeFlow: () => void; // triggers category scoring
  reset: () => void;
}

const createInitialState = (): SessionState => ({
  currentScreen: 'landing',
  stepIndex: 0,
  answers: {},
  statementBuckets: {},
  categoryResult: null,
});

export const useSessionStore = create<SessionStore>((set, get) => {
  const activeFlow = () => {
    const { flowId } = get();
    return flows[flowId === 'select' ? defaultFlowId : flowId];
  };

  return {
    state: createInitialState(),
    flowId: defaultFlowId,

    selectFlow: (id) => set({ flowId: id }),

    startSession: () => set({ state: { ...createInitialState(), currentScreen: 'flow' } }),

    recordAnswer: (stepId, choiceId) =>
      set((store) => ({
        state: { ...store.state, answers: { ...store.state.answers, [stepId]: choiceId } },
      })),

    recordStatement: (statementId, bucket) =>
      set((store) => ({
        state: {
          ...store.state,
          statementBuckets: { ...store.state.statementBuckets, [statementId]: bucket },
        },
      })),

    advanceStep: (toStepId) =>
      set((store) => {
        const flow = activeFlow();
        const current = store.state.stepIndex;
        const target =
          toStepId === undefined ? current + 1 : flow.steps.findIndex((s) => s.id === toStepId);
        // Forward-only (data-integrity enforces it at author time; this guards runtime).
        const stepIndex = target > current ? target : current + 1;
        return { state: { ...store.state, stepIndex } };
      }),

    completeFlow: () =>
      set((store) => {
        const flow = activeFlow();
        const categoryResult = calculateCategoryScores(
          flow,
          store.state.answers,
          store.state.statementBuckets,
        );
        return { state: { ...store.state, categoryResult, currentScreen: 'results' } };
      }),

    // Replaces only `state` — flowId is intentionally preserved (see header comment).
    reset: () => set({ state: createInitialState() }),
  };
});
