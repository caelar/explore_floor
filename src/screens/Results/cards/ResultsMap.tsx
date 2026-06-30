import type { CategoryId, CategoryWeights, ResultsMapCopy } from '@/data/types';

import { BubbleField } from './BubbleField';

// The ambient bubble map (D-029 Phase E) — screen 5 of the mockup's results system. A full-bleed
// dark canvas: a decorative AmbientField behind, a glass "your results" intro card, and the three
// roles as match-%-sized bubbles you tap to dive into a role's cards. The map is the hub (reference
// parity: no back control — you arrive via Skip and leave by diving into a role). Full-bleed by
// design, so it renders OUTSIDE the rounded results panel (ResultsExperience relaxes the <main>).

interface ResultsMapProps {
  copy: ResultsMapCopy;
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  reduce: boolean;
  /** Dive into the role at this rank index. */
  onDive: (rank: number) => void;
}

export function ResultsMap({ copy, ranking, matchPercentages, reduce, onDive }: ResultsMapProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" data-testid="results-map">
      <div className="relative z-10 flex h-full flex-col px-space-3 py-space-4">
        <div className="mx-auto mt-space-5 w-full max-w-map-card rounded-lg border border-glass-border bg-glass-fill-strong px-space-5 py-space-4 text-center shadow-dark-card backdrop-blur-panel">
          <h1 className="font-heading text-h3 text-text-on-dark">{copy.title}</h1>
          <div className="my-space-3 h-px bg-glass-border" />
          <p className="font-body text-body text-text-on-dark-muted">{copy.intro}</p>
          <p className="mt-space-1 font-body text-body text-text-on-dark-faint">{copy.hint}</p>
        </div>

        <div className="flex min-h-0 flex-1 items-center justify-center py-space-3">
          <BubbleField
            ranking={ranking}
            matchPercentages={matchPercentages}
            reduce={reduce}
            onDive={onDive}
          />
        </div>
      </div>
    </div>
  );
}
