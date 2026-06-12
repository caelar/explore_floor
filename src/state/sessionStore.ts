import { create } from 'zustand';

import { classicFlow, defaultFlowId, flows } from '@/data';
import type { BucketId, Decision, FlowId, RoleId, SessionState } from '@/data/types';
import { assembleRobot, calculateCategoryScores, calculateScores, setMuted } from '@/lib';

// The single session store (DATA_MODEL §12 + §17). Store actions are the ONLY place that
// touches /src/lib — screens read state and dispatch actions, never compute. No persistence
// in v1: state lives in memory and a refresh starts fresh (intentional for the prototype).
//
// `flowId` (the study condition, DATA_MODEL §17) deliberately lives NEXT TO `state`, not
// inside it: `reset()` replaces only `state`, so the researcher's chosen flow survives
// "Start over" between participants. Flows are resolved via `get()` INSIDE each action so
// a flow switched on Landing is honored — never capture them at factory time.
//
// The classic actions (recordDecision/advanceRound/completeSorting) and the category-flow
// actions (recordAnswer/recordStatement/advanceStep/completeFlow) are disjoint: category
// flows never touch `robot` (the build beat is intentionally skipped this iteration — the
// hook for re-enabling it later is routing a category flow through /build, D-017).

interface SessionStore {
  state: SessionState;
  flowId: FlowId;
  selectFlow: (id: FlowId) => void;
  startSession: () => void;
  // ---- classic flow ----
  recordDecision: (itemId: string, decision: Decision) => void;
  advanceRound: () => void;
  completeSorting: () => void; // triggers scoring, finalizes the robot
  tryOnRole: (roleId: RoleId) => void;
  // ---- category flows ----
  recordAnswer: (stepId: string, choiceId: string) => void;
  recordStatement: (statementId: string, bucket: BucketId) => void;
  /** Move the runner cursor: to a branch target by step id, or to the next step. */
  advanceStep: (toStepId?: string) => void;
  completeFlow: () => void; // triggers category scoring
  // ---- shared ----
  toggleSound: () => void;
  reset: () => void;
}

const createInitialState = (): SessionState => ({
  currentScreen: 'landing',
  currentRound: 0,
  decisions: {},
  scoreResult: null,
  robot: null,
  currentlyTryingOn: null,
  soundEnabled: false,
  stepIndex: 0,
  answers: {},
  statementBuckets: {},
  categoryResult: null,
});

export const useSessionStore = create<SessionStore>((set, get) => {
  const activeFlow = () => flows[get().flowId];
  // Classic-action helper. Category flows never call the classic actions, but fall back to
  // the classic set defensively rather than crash if one ever fires out of band.
  const activeItems = () => {
    const flow = activeFlow();
    return flow.kind === 'classic' ? flow.questionSet.items : classicFlow.questionSet.items;
  };

  return {
    state: createInitialState(),
    flowId: defaultFlowId,

    selectFlow: (id) => set({ flowId: id }),

    startSession: () => {
      const flow = activeFlow();
      set({
        state:
          flow.kind === 'classic'
            ? {
                ...createInitialState(),
                currentScreen: 'sort',
                currentRound: 1,
                robot: assembleRobot({}, flow.questionSet.items, null),
              }
            : { ...createInitialState(), currentScreen: 'flow' },
      });
    },

    recordDecision: (itemId, decision) =>
      set((store) => {
        const decisions = { ...store.state.decisions, [itemId]: decision };
        return {
          state: { ...store.state, decisions, robot: assembleRobot(decisions, activeItems(), null) },
        };
      }),

    advanceRound: () =>
      set((store) => ({
        state: {
          ...store.state,
          currentRound: Math.min(store.state.currentRound + 1, 4) as SessionState['currentRound'],
        },
      })),

    completeSorting: () =>
      set((store) => {
        const scoreResult = calculateScores(store.state.decisions, activeItems());
        const robot = {
          ...assembleRobot(store.state.decisions, activeItems(), scoreResult.primaryArchetype),
          isFinalized: true,
        };
        return {
          state: {
            ...store.state,
            scoreResult,
            robot,
            currentlyTryingOn: scoreResult.primaryRole,
            currentRound: 4,
            currentScreen: 'build',
          },
        };
      }),

    tryOnRole: (roleId) =>
      set((store) => ({ state: { ...store.state, currentlyTryingOn: roleId } })),

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
        if (flow.kind === 'classic') return store;
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
        if (flow.kind === 'classic') return store;
        const categoryResult = calculateCategoryScores(
          flow,
          store.state.answers,
          store.state.statementBuckets,
        );
        return { state: { ...store.state, categoryResult, currentScreen: 'results' } };
      }),

    toggleSound: () =>
      set((store) => {
        const soundEnabled = !store.state.soundEnabled;
        setMuted(!soundEnabled);
        return { state: { ...store.state, soundEnabled } };
      }),

    // Replaces only `state` — flowId is intentionally preserved (see header comment).
    reset: () => set({ state: createInitialState() }),
  };
});

// Dev-only handle. Classic is dormant — kept in code but dropped from the landing
// switcher (D-021) — so the classic E2E specs select it through this hook instead
// of the UI. Vite strips this from production builds.
if (import.meta.env.DEV) {
  (globalThis as Record<string, unknown>).__sessionStore = useSessionStore;
}
