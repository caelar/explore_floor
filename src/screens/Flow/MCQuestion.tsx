import { motion, type Variants } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import type { MCStep } from '@/data/types';
import { durations, durationsMs, easings } from '@/lib';

// Answer rows cascade in after the card has slid into place (delayChildren ≈ the runner's glide),
// so the choices arrive a beat behind the question instead of all at once. Reduced motion skips it
// (the rows mount already shown). Only opacity/transform animate, so the buttons stay hit-testable
// mid-entrance.
const choiceListVariants: Variants = {
  hidden: {},
  show: { transition: { delayChildren: durations.glide, staggerChildren: 0.06 } },
};
const choiceRowVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: durations.glide, ease: easings.soft } },
};

interface MCQuestionProps {
  step: MCStep;
  /** 1-based position among the flow's MC steps, for the "Question N of M" cue. */
  questionNumber: number;
  questionTotal: number;
  /** The answer already on record for this step (pre-lit on a Back revisit); undefined if fresh. */
  selectedId?: string;
  reduce: boolean;
  onChoose: (choiceId: string) => void;
}

// A single-select multiple-choice step, re-skinned dark for step 8 (D-029 Phase B): a glass
// question card (muted "Question N of M" → hairline divider → optional prompt → the question)
// over a stack of full-width, left-aligned answer rows. Native buttons — tap or Tab/Enter.
// Rows invert to brand gold (dark ink) on hover; picking one fills it gold and auto-advances.
//
// "Stays lit to show state" (Caelan, matching the mockup): picking a row fills it gold and HOLDS
// for a beat before the step advances. The runner wraps this card in AnimatePresence, which keeps
// it mounted (with its `picked` state) while it slides out — so the lit row stays lit through the
// exit. `acted` disables every row the moment one is picked, so a stray tap can't land on this card
// while it slides away (it would otherwise overwrite the answer or skip a step). A Back revisit is a
// fresh mount: `selectedId` pre-lights the stored answer but `acted` starts false, so the user can
// re-pick (any answer, even the same one, re-advances).
export function MCQuestion({
  step,
  questionNumber,
  questionTotal,
  selectedId,
  reduce,
  onChoose,
}: MCQuestionProps) {
  const [picked, setPicked] = useState<string | null>(selectedId ?? null);
  const [acted, setActed] = useState(false);
  const timer = useRef<number | null>(null);
  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);

  const choose = (choiceId: string) => {
    if (acted) return;
    setActed(true);
    setPicked(choiceId); // light it now; it holds through the exit slide
    if (reduce) {
      onChoose(choiceId);
      return;
    }
    timer.current = window.setTimeout(() => onChoose(choiceId), durationsMs.snap);
  };

  return (
    <div className="flex w-full flex-col gap-space-4">
      <div className="flex flex-col gap-space-3 rounded-lg border border-glass-border bg-glass-fill p-space-5">
        <p className="text-small text-text-on-dark-faint">
          Question {questionNumber} of {questionTotal}
        </p>
        <div className="border-t border-glass-border-soft" />
        {step.prompt && step.promptPlacement !== 'below' && (
          <p className="text-body text-text-on-dark-muted">{step.prompt}</p>
        )}
        <h2 className="font-heading text-h3 text-text-on-dark">{step.question}</h2>
        {step.prompt && step.promptPlacement === 'below' && (
          // A factual qualifier shown under the question as a quiet reference line (D-029 polish).
          <p className="text-small text-text-on-dark-faint">{step.prompt}</p>
        )}
      </div>

      <motion.div
        className="flex flex-col gap-space-2"
        data-testid="mc-choices"
        variants={choiceListVariants}
        initial={reduce ? false : 'hidden'}
        animate="show"
      >
        {step.choices.map((choice) => {
          const isPicked = picked === choice.id;
          return (
            <motion.button
              key={choice.id}
              type="button"
              variants={choiceRowVariants}
              disabled={acted}
              onClick={() => choose(choice.id)}
              className={`w-full rounded-md border px-space-4 py-space-3 text-left font-body text-body transition-colors disabled:pointer-events-none ${
                isPicked
                  ? 'border-arm-gold bg-arm-gold text-near-black'
                  : 'border-glass-border bg-glass-fill text-text-on-dark hover:border-arm-gold hover:bg-arm-gold hover:text-near-black'
              }`}
            >
              {choice.label}
            </motion.button>
          );
        })}
      </motion.div>

      <p className="text-small text-text-on-dark-faint">Select an answer to continue.</p>
    </div>
  );
}
