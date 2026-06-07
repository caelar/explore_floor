import { Link, useNavigate } from 'react-router-dom';

import { CATEGORIES } from '@/data/types';
import { useFlow, useSessionStore } from '@/state';

// The shared results for the study flows (DATA_MODEL §17). Slice 3 stub: heading,
// the four category percentages, retake. Slice 4 replaces the list with the node map
// (concentric rings) + role detail sheet; the testids below are the stable contract
// the e2e specs assert against either way.
export function CategoryResults() {
  const navigate = useNavigate();
  const flow = useFlow();
  const categoryResult = useSessionStore((s) => s.state.categoryResult);
  const reset = useSessionStore((s) => s.reset);

  if (flow.kind === 'classic' || !categoryResult) {
    return (
      <main className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center gap-space-3 p-space-6 text-center">
        <h2 className="font-heading text-h2 text-text-strong">No results yet</h2>
        <p className="text-body text-text-muted">Answer the questions first and we&apos;ll match you.</p>
        <Link to="/" className="text-body text-arm-blue underline">
          Start the quiz
        </Link>
      </main>
    );
  }

  function handleRetake() {
    reset();
    navigate('/');
  }

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col items-center gap-space-5 p-space-5">
      <h2 className="font-heading text-h2 text-text-strong">{flow.resultsCopy.heading}</h2>

      <ul className="flex flex-col gap-space-2">
        {CATEGORIES.map((category) => (
          <li key={category} className="text-body text-text-default">
            {category}:{' '}
            <span data-testid={`category-pct-${category}`}>
              {categoryResult.matchPercentages[category]}%
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        data-testid="retake"
        onClick={handleRetake}
        className="text-small text-text-faint underline transition-colors hover:text-text-default"
      >
        {flow.resultsCopy.retake}
      </button>
    </main>
  );
}
