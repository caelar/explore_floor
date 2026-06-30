import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '@/components';
import { durations, easings } from '@/lib';
import { useFlow, useSessionStore } from '@/state';

import { MCQuestion } from './MCQuestion';
import { SceneSortView } from './SceneSortView';

// The step runner for the narrative flow (DATA_MODEL §17): one screen that renders the
// current step by type and walks the flow's step list. Branching is a data fact — an
// MC choice may carry `branchTo`; everything else falls through sequentially. The runner
// cursor (stepIndex + scene phase/choice + a history back-stack) lives in the store, so
// Back is a single branch-aware reverse traversal. No robot, by design (D-017).

export function FlowRunner() {
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();
  const flow = useFlow();

  const currentScreen = useSessionStore((s) => s.state.currentScreen);
  const stepIndex = useSessionStore((s) => s.state.stepIndex);
  const scenePhase = useSessionStore((s) => s.state.scenePhase);
  const history = useSessionStore((s) => s.state.history);
  const answers = useSessionStore((s) => s.state.answers);
  const recordAnswer = useSessionStore((s) => s.recordAnswer);
  const advanceStep = useSessionStore((s) => s.advanceStep);
  const completeFlow = useSessionStore((s) => s.completeFlow);
  const goBack = useSessionStore((s) => s.goBack);

  // Navigation is declarative off currentScreen so it can't race the store updates:
  // completing the flow sets 'results' (→ /results); a refresh resets the store (→ Landing).
  const active = currentScreen === 'flow';
  useEffect(() => {
    if (currentScreen === 'results') {
      navigate('/results');
    } else if (!active) {
      navigate('/', { replace: true });
    }
  }, [currentScreen, active, navigate]);

  if (!active) return null;

  const steps = flow.steps;
  const sceneSteps = steps.filter((s) => s.type === 'scene');
  const mcSteps = steps.filter((s) => s.type === 'mc');
  const step = steps[stepIndex];
  if (!step) return null;

  /** Record an MC answer, then follow the branch (or the sequence) — or finish
   *  (completeFlow flips currentScreen to 'results'; the effect above routes there). */
  function handleChoice(choiceId: string) {
    if (!step || step.type !== 'mc') return;
    recordAnswer(step.id, choiceId);
    const branchTo = step.choices.find((choice) => choice.id === choiceId)?.branchTo;
    const nextIndex =
      branchTo === undefined ? stepIndex + 1 : steps.findIndex((s) => s.id === branchTo);
    if (nextIndex < 0 || nextIndex >= steps.length) {
      completeFlow();
    } else {
      advanceStep(branchTo);
    }
  }

  // Back is offered whenever there's somewhere to reverse to: within a scene's rating beat there's
  // always the scene intro behind, and any step past the first has a previous step on the stack.
  const canGoBack = (step.type === 'scene' && scenePhase === 'rating') || history.length > 0;

  // Every step top-anchors (justify-start under the header), matching the reference. Pinning the
  // card's top makes a step swap a clean horizontal slide and never re-centers a tall (rating-phase)
  // block against a short (intro) one — the scene→scene "lurch/reset". The liked scene "slide
  // upward" is produced inside SceneSortView by a shrinking spacer (the reference's qSpacer), not by
  // flex-centering, so both the lurch fix and the morph hold together.

  return (
    <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-start p-space-5 pt-space-7">
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          className="flex w-full flex-col items-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
          exit={
            reduce
              ? { opacity: 0 }
              : { opacity: 0, x: -40, transition: { duration: durations.snap, ease: easings.soft } }
          }
          transition={{ duration: reduce ? durations.snap : durations.glide, ease: easings.soft }}
        >
          {step.type === 'mc' && (
            <MCQuestion
              step={step}
              // Running position among the MC steps actually answered on this path (+1 for the
              // current, still-unanswered one), so a branch that skips a question — Q1 "No" jumps
              // over Q2 — never leaves a gap in the count (D-029 Phase B; design-review p3).
              questionNumber={
                mcSteps.filter((s) => s.id !== step.id && answers[s.id] !== undefined).length + 1
              }
              questionTotal={mcSteps.length}
              selectedId={answers[step.id]}
              reduce={reduce}
              onChoose={handleChoice}
            />
          )}
          {step.type === 'scene' && (
            <SceneSortView
              step={step}
              sceneNumber={sceneSteps.findIndex((s) => s.id === step.id) + 1}
              sceneTotal={sceneSteps.length}
              reduce={reduce}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Persistent, centered Back — the top research-gap fix (users had no way back). Reverses one
          step of the flow: previous choice → scene intro → previous step (branch-aware via history),
          with prior picks pre-lit so a revisit reads as "here's what you chose". */}
      {canGoBack && (
        <button
          type="button"
          data-testid="flow-back"
          onClick={goBack}
          className="absolute bottom-space-4 left-1/2 flex -translate-x-1/2 items-center gap-space-1 text-small font-medium text-text-on-dark-faint transition-colors hover:text-text-on-dark"
        >
          <Icon name="arrow-l" size={20} />
          Back
        </button>
      )}
    </main>
  );
}
