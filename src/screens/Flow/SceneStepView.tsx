import { useRef, useState } from 'react';

import { DragSortCard, DropZone } from '@/components';
import type { SceneStep } from '@/data/types';

interface SceneStepViewProps {
  step: SceneStep;
  reduce: boolean;
  onChoose: (choiceId: string) => void;
}

/** The single drop-target id for a scene — which card was dropped comes from the
 *  card's own commit closure, so the zone doesn't need to know. */
type SceneZone = 'pick';

// A story beat (the blue "drag and drop" stickies on the team's board): the narrative
// setup, the ask, four choice cards — one per hidden category — and one neutral drop
// zone. Drag the card that's you into the zone, or tap it (the tap fallback also keeps
// the step operable under prefers-reduced-motion, where drag is disabled). Zone label +
// hint are runner chrome, not flow-owned copy — same intentional boundary as D-016.
export function SceneStepView({ step, reduce, onChoose }: SceneStepViewProps) {
  const [zoneActive, setZoneActive] = useState(false);
  const zoneRef = useRef<HTMLButtonElement>(null);

  function resolveDrop(clientX: number, clientY: number): SceneZone | null {
    const rect = zoneRef.current?.getBoundingClientRect();
    const hit =
      rect &&
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom;
    return hit ? 'pick' : null;
  }

  return (
    <div className="flex w-full flex-col items-center gap-space-5 text-center">
      <div className="flex max-w-md flex-col gap-space-3">
        <p className="text-body text-text-muted">{step.prompt}</p>
        <h2 className="font-heading text-h3 text-text-strong">{step.question}</h2>
      </div>

      <div className="grid grid-cols-2 justify-items-center gap-space-4" data-testid="scene-choices">
        {step.choices.map((choice) => (
          <DragSortCard<SceneZone>
            key={choice.id}
            label={choice.label}
            reduce={reduce}
            size="compact"
            testId="scene-card"
            resolveDrop={resolveDrop}
            onHover={(target) => setZoneActive(target === 'pick')}
            onCommit={() => onChoose(choice.id)}
            onTap={() => onChoose(choice.id)}
          />
        ))}
      </div>

      <DropZone<SceneZone>
        ref={zoneRef}
        id="pick"
        label="This is me"
        size="wide"
        active={zoneActive}
        onChoose={() => undefined} // tapping the zone can't know which card — cards are tappable instead
        testId="scene-zone"
      />
      <p className="text-small text-text-faint">Drag your pick here — or tap it.</p>
    </div>
  );
}
