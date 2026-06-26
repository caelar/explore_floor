import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { durations, easings } from '@/lib';
import { useFlow, useSessionStore } from '@/state';

import { MCQuestion } from './MCQuestion';
import { SceneSortView } from './SceneSortView';

// The step runner for the narrative flow (DATA_MODEL §17): one screen that renders the
// current step by type and walks the flow's step list. Branching is a data fact — an
// MC choice may carry `branchTo`; everything else falls through sequentially.
// No robot, by design (D-017).

export function FlowRunner() {
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();
  const flow = useFlow();

  const currentScreen = useSessionStore((s) => s.state.currentScreen);
  const stepIndex = useSessionStore((s) => s.state.stepIndex);
  const recordAnswer = useSessionStore((s) => s.recordAnswer);
  const advanceStep = useSessionStore((s) => s.advanceStep);
  const completeFlow = useSessionStore((s) => s.completeFlow);

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

  /** A scene records its choices itself (into statementBuckets); once all four are
   *  bucketed it advances sequentially, or completes the flow if it's the last step.
   *  Scenes never branch, so there's no target to follow. */
  function handleSceneDone() {
    if (stepIndex + 1 >= steps.length) {
      completeFlow();
    } else {
      advanceStep();
    }
  }

  return (
    <main className="mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center p-space-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          className="flex w-full flex-col items-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durations.snap, ease: easings.soft }}
        >
          {step.type === 'mc' && <MCQuestion step={step} onChoose={handleChoice} />}
          {step.type === 'scene' && (
            <SceneSortView
              step={step}
              sceneNumber={sceneSteps.findIndex((s) => s.id === step.id) + 1}
              sceneTotal={sceneSteps.length}
              reduce={reduce}
              onDone={handleSceneDone}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
