import { create } from 'zustand';

import { defaultFlowId, flows } from '@/data';
import type { BucketId, CategoryId, LandingConditionId, SessionState } from '@/data/types';
import { calculateCategoryScores } from '@/lib';

// The single session store (DATA_MODEL §17). Store actions are the ONLY place that touches
// /src/lib — screens read state and dispatch actions, never compute. No persistence in v1:
// state lives in memory and a refresh starts fresh (intentional for the prototype).
//
// The runner cursor lives here as one source of truth — `stepIndex` (which step), plus the
// within-step position for scenes (`scenePhase` intro/rating, `choiceIndex`) and a `history`
// back-stack of visited step indices. Centralizing it makes Back a single, branch-aware reverse
// traversal (mirrors the Claude Design mockup's `qGoBack`): users named "no way back" as a top
// research gap, so back navigation must walk choices → scene intro → previous step faithfully.
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
  /** Move the runner cursor forward: to a branch target by step id, or to the next step.
   *  Pushes the current step onto `history` and resets the scene cursor for the new step. */
  advanceStep: (toStepId?: string) => void;
  /** Begin a scene's rating beat (the Continue press): intro → rating, cursor at choice 0. */
  startScene: () => void;
  /** Record one scene choice's bucket, then advance: to the next choice, or — on the scene's
   *  last choice — forward to the next step (or finish the flow, triggering scoring). */
  rateChoice: (choiceId: string, bucket: BucketId) => void;
  /** Reverse one step of the flow: previous choice → scene intro → previous step (re-entering a
   *  prior scene at its last choice). Branch-aware via `history`; a no-op at the very first step. */
  goBack: () => void;
  completeFlow: () => void; // triggers category scoring
  /** DEV ONLY: seed a plausible completed run and jump to results, skipping the quiz. Wired to a
   *  dev-only control on Landing; remove before ship (VISUAL_REARCHITECTURE.md Phase G). */
  devSeedResults: () => void;
  reset: () => void;
}

const createInitialState = (): SessionState => ({
  currentScreen: 'landing',
  stepIndex: 0,
  history: [],
  scenePhase: 'intro',
  choiceIndex: 0,
  lastDirection: 'forward',
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

    advanceStep: (toStepId) =>
      set((store) => {
        const flow = activeFlow();
        const current = store.state.stepIndex;
        const target =
          toStepId === undefined ? current + 1 : flow.steps.findIndex((s) => s.id === toStepId);
        // Forward-only (data-integrity enforces it at author time; this guards runtime).
        const stepIndex = target > current ? target : current + 1;
        return {
          state: {
            ...store.state,
            history: [...store.state.history, current],
            stepIndex,
            scenePhase: 'intro',
            choiceIndex: 0,
            lastDirection: 'forward',
          },
        };
      }),

    startScene: () =>
      set((store) => ({ state: { ...store.state, scenePhase: 'rating', choiceIndex: 0 } })),

    rateChoice: (choiceId, bucket) =>
      set((store) => {
        const flow = activeFlow();
        const step = flow.steps[store.state.stepIndex];
        if (!step || step.type !== 'scene') return {}; // guard: only scenes are rated
        const statementBuckets = { ...store.state.statementBuckets, [choiceId]: bucket };
        const lastChoice = step.choices.length - 1;

        // Not the last choice → walk to the next one within this scene.
        if (store.state.choiceIndex < lastChoice) {
          return {
            state: { ...store.state, statementBuckets, choiceIndex: store.state.choiceIndex + 1 },
          };
        }

        // Last choice → leave the scene. End of flow → score + route to results; else next step.
        const nextIndex = store.state.stepIndex + 1;
        if (nextIndex >= flow.steps.length) {
          const categoryResult = calculateCategoryScores(flow, store.state.answers, statementBuckets);
          return {
            state: { ...store.state, statementBuckets, categoryResult, currentScreen: 'results' },
          };
        }
        return {
          state: {
            ...store.state,
            statementBuckets,
            history: [...store.state.history, store.state.stepIndex],
            stepIndex: nextIndex,
            scenePhase: 'intro',
            choiceIndex: 0,
            lastDirection: 'forward',
          },
        };
      }),

    goBack: () =>
      set((store) => {
        const flow = activeFlow();
        const { stepIndex, scenePhase, choiceIndex, history } = store.state;
        const step = flow.steps[stepIndex];

        // Inside a scene's rating beat, step back within the scene first (no history change).
        if (step?.type === 'scene' && scenePhase === 'rating') {
          if (choiceIndex > 0) {
            return { state: { ...store.state, choiceIndex: choiceIndex - 1 } };
          }
          return { state: { ...store.state, scenePhase: 'intro' } }; // first choice → scene intro
        }

        // MC step, or a scene's intro beat → cross back to the previous visited step.
        if (history.length === 0) return {}; // very first step: nothing behind
        const prevIndex = history[history.length - 1];
        const prev = flow.steps[prevIndex];
        const enterPrevScene = prev?.type === 'scene';
        return {
          state: {
            ...store.state,
            history: history.slice(0, -1),
            stepIndex: prevIndex,
            // Re-enter a prior scene at its last rated choice; a prior MC just shows its answer.
            scenePhase: enterPrevScene ? 'rating' : 'intro',
            choiceIndex: enterPrevScene ? prev.choices.length - 1 : 0,
            lastDirection: 'back',
          },
        };
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

    devSeedResults: () =>
      set(() => {
        const flow = flows[defaultFlowId];
        const answers: Record<string, string> = {};
        const statementBuckets: Record<string, BucketId> = {};
        // Rotate which role "wins" each scene for a believable, non-degenerate spread.
        const winners: CategoryId[] = ['specialist', 'integrator', 'technician'];
        let sceneN = 0;
        for (const step of flow.steps) {
          if (step.type === 'mc') {
            const pick =
              step.choices.find((c) => c.categories.includes('specialist')) ?? step.choices[0];
            answers[step.id] = pick.id;
          } else {
            const winner = winners[sceneN % winners.length];
            sceneN += 1;
            for (const choice of step.choices) {
              statementBuckets[choice.id] =
                choice.category === winner
                  ? 'thats-me'
                  : choice.category === 'technician'
                    ? 'maybe'
                    : 'not-me';
            }
          }
        }
        const categoryResult = calculateCategoryScores(flow, answers, statementBuckets);
        return {
          state: {
            ...createInitialState(),
            answers,
            statementBuckets,
            categoryResult,
            currentScreen: 'results',
          },
        };
      }),

    // Replaces only `state` — flowId is intentionally preserved (see header comment).
    reset: () => set({ state: createInitialState() }),
  };
});
