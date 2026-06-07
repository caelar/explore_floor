import type { MCStep } from '@/data/types';

interface MCQuestionProps {
  step: MCStep;
  onChoose: (choiceId: string) => void;
}

// A single-select multiple-choice step (the pink stickies on the team's board):
// optional lead-in prompt, the question, and a tappable column of choices. Native
// buttons — tap or Tab/Enter. Deliberately quiet styling: the study wants attention
// on the question structure, not the chrome.
export function MCQuestion({ step, onChoose }: MCQuestionProps) {
  return (
    <div className="flex w-full max-w-md flex-col gap-space-4 text-center">
      {step.prompt && <p className="text-body text-text-muted">{step.prompt}</p>}
      <h2 className="font-heading text-h3 text-text-strong">{step.question}</h2>
      <div className="flex flex-col gap-space-2" data-testid="mc-choices">
        {step.choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            onClick={() => onChoose(choice.id)}
            className="rounded-md border border-border-default bg-bg px-space-4 py-space-3 font-body text-body text-text-default transition-colors hover:bg-bg-section"
          >
            {choice.label}
          </button>
        ))}
      </div>
    </div>
  );
}
