import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
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
  const lastDirection = useSessionStore((s) => s.state.lastDirection);
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

  // Directional step slide: forward enters from the right and exits left; Back mirrors it (enters
  // from the left, exits right). `custom` carries the direction to the EXITING step too, so a Back
  // press slides the outgoing step the correct way. Reduced motion drops the travel to a crossfade.
  const dir = lastDirection === 'back' ? -1 : 1;
  const stepVariants: Variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: 40 * d }),
    center: reduce ? { opacity: 1 } : { opacity: 1, x: 0 },
    exit: (d: number) =>
      reduce
        ? { opacity: 0 }
        : { opacity: 0, x: -40 * d, transition: { duration: durations.snap, ease: easings.soft } },
  };

  // Every step top-anchors (justify-start under the header), matching the reference. Pinning the
  // card's top makes a step swap a clean horizontal slide and never re-centers a tall (rating-phase)
  // block against a short (intro) one — the scene→scene "lurch/reset". The liked scene "slide
  // upward" is produced inside SceneSortView by a shrinking spacer (the reference's qSpacer), not by
  // flex-centering, so both the lurch fix and the morph hold together.

  return (
    <main className="relative mx-auto flex w-full max-w-read flex-1 flex-col items-center justify-start p-space-5 pt-space-7">
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step.id}
          custom={dir}
          className="flex w-full flex-col items-center"
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduce ? durations.snap : durations.glide, ease: easings.soft }}
        >
          {step.type === 'mc' && (
            <MCQuestion
              step={step}
              // Position among the MC steps the user has reached on THIS path: count answered MC
              // steps that sit BEFORE the current step (+1 for the current one). Index-based, not a
              // global answered-count — counting every answered step inflated the number on a Back
              // revisit (once all six were answered, every screener read "6 of 6"). A skipped branch
              // step (Q2 on the No path) stays uncounted because it was never answered, so the count
              // still has no gap (D-029 Phase B; design-review p3).
              questionNumber={
                steps.slice(0, stepIndex).filter((s) => s.type === 'mc' && answers[s.id] !== undefined)
                  .length + 1
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
