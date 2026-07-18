import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon, SceneBackground, SceneCharacter } from '@/components';
import { CHARACTER_SCENE_VARIATIONS, LANDING_BG, SCENE_BACKGROUNDS, SCENE_BUBBLES, sceneCharacterSrc } from '@/data/sceneBackgrounds';
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
  const choiceIndex = useSessionStore((s) => s.state.choiceIndex);
  const history = useSessionStore((s) => s.state.history);
  const lastDirection = useSessionStore((s) => s.state.lastDirection);

  // True while the character is sliding out BEFORE the store advances to the next step.
  // Kept local (not in the store) because it's a pure presentation concern: it only
  // affects visibility of the character and thought bubble, not scoring or navigation.
  const [sceneExiting, setSceneExiting] = useState(false);

  // Reset the flag whenever the step or phase actually changes (covers both the normal
  // advance and any goBack path that reverts scenePhase or stepIndex).
  useEffect(() => {
    setSceneExiting(false);
  }, [stepIndex, scenePhase]);
  const answers = useSessionStore((s) => s.state.answers);
  const characterId = useSessionStore((s) => s.state.characterId);
  const recordAnswer = useSessionStore((s) => s.recordAnswer);
  const advanceStep = useSessionStore((s) => s.advanceStep);
  const completeFlow = useSessionStore((s) => s.completeFlow);
  const goBack = useSessionStore((s) => s.goBack);

  // Navigation is declarative off currentScreen so it can't race the store updates:
  // completing the flow sets 'loading' (→ /loading), then results (→ /results).
  const active = currentScreen === 'flow';
  useEffect(() => {
    if (currentScreen === 'results') {
      navigate('/results');
    } else if (currentScreen === 'loading') {
      navigate('/loading');
    } else if (active && !characterId) {
      navigate('/character', { replace: true });
    } else if (!active) {
      navigate('/', { replace: true });
    }
  }, [currentScreen, active, characterId, navigate]);

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

  // Intro MC steps center in the viewport; scenes stay top-anchored so the Continue→rating
  // morph and scene→scene transitions don't lurch (the slide-up comes from SceneSortView's spacer).
  const isMc = step.type === 'mc';
  const backgroundSrc =
    step.type === 'scene' ? SCENE_BACKGROUNDS[step.id] : step.type === 'mc' ? LANDING_BG : undefined;
  const backgroundOverlay = step.type === 'mc' ? 'landing' : 'scene';
  const characterSrc =
    step.type === 'scene' && characterId ? sceneCharacterSrc(step.id, characterId) : undefined;
  const characterVariations = characterId ? CHARACTER_SCENE_VARIATIONS[characterId] : undefined;
  const bubbleSrc = step.type === 'scene' ? SCENE_BUBBLES[step.id] : undefined;
  const rating = scenePhase === 'rating';
  // Separate flag for the character: false while sceneExiting so the character slides
  // out before the step advances. cardShift keeps using `rating` (unchanged by sceneExiting)
  // so the card holds its shifted position until the step actually changes.
  const characterVisible = rating && !sceneExiting;

  // When the character is visible, shift the quiz card left so the two sit side-by-side.
  // -304px aligns the glass card's visible left edge with the RC logo's left edge in the nav
  // on a 1280px desktop viewport (natural centered position = (1280-672)/2 = 304px; 304-304 = 0px
  // outer edge, plus the 32px p-space-5 padding inside = 32px glass edge = logo left edge).
  const cardShift = characterSrc && rating && !reduce ? -304 : 0;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
    <SceneBackground src={backgroundSrc} overlay={backgroundOverlay} />
    <SceneCharacter src={characterSrc} bubbleSrc={bubbleSrc} sceneId={step.type === 'scene' ? step.id : undefined} visible={characterVisible} choiceIndex={choiceIndex} reduce={reduce} variations={characterVariations} />
    <motion.main
      className={`relative z-20 mx-auto flex w-full max-w-read flex-1 flex-col items-center p-space-5 ${
        isMc ? 'justify-center' : 'justify-start pt-space-7'
      }`}
      initial={false}
      animate={{ x: cardShift }}
      transition={{ duration: durations.glide, ease: easings.soft }}
    >
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
              onBeforeLastChoice={() => setSceneExiting(true)}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Persistent, centered Back — the top research-gap fix (users had no way back). Reverses one
          step of the flow: previous choice → scene intro → previous step (branch-aware via history),
          with prior picks pre-lit so a revisit reads as "here's what you chose". Sits on a small
          glass platter so it holds its own surface over the scene illustrations (CM-03). */}
      {canGoBack && (
        <button
          type="button"
          data-testid="flow-back"
          onClick={goBack}
          className="absolute bottom-space-4 left-1/2 flex h-control-lg -translate-x-1/2 items-center gap-space-1 rounded-full border border-glass-border bg-glass-fill-strong px-space-3 text-small font-medium text-text-on-dark backdrop-blur-panel transition-colors hover:text-text-on-dark-muted"
        >
          <Icon name="arrow-l" size={20} />
          Back
        </button>
      )}
    </motion.main>
    </div>
  );
}
