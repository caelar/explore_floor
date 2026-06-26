import { AnimatePresence, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { roleDetails } from '@/data';
import type { CategoryId } from '@/data/types';
import { deriveScreenerProfile, screenerFitLines } from '@/lib';
import { useFlow, useSessionStore } from '@/state';

import { FitNote } from './FitNote';
import { NodeMap } from './NodeMap';
import { RoleDetailSheet } from './RoleDetailSheet';

// The narrative flow's results (DATA_MODEL §17): a node graph. The recommended (top-matched)
// role is stated up top and starts front-and-center on the map; the other three sit behind it
// and swap in on tap. The active category's job titles branch off the front — tap one for the
// role sheet (RC.org content + fit radar). This screen orchestrates: which category is centered,
// which title's sheet is open, and retake.
export function CategoryResults() {
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();
  const flow = useFlow();
  const categoryResult = useSessionStore((s) => s.state.categoryResult);
  const answers = useSessionStore((s) => s.state.answers);
  const reset = useSessionStore((s) => s.reset);

  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [openTitle, setOpenTitle] = useState<{ category: CategoryId; title: string } | null>(null);

  if (!categoryResult) {
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

  // Defaults to the top match; a swap overrides it until retake. The heading names whichever
  // role is centered — at default that's the recommendation (centerLabel overline); on a swap
  // it names the role being explored.
  const active = activeCategory ?? categoryResult.primaryCategory;
  const isTopMatch = active === categoryResult.primaryCategory;
  // The fit read follows whichever role is centered (defaults to the top match, swaps with it).
  const fitLines = screenerFitLines(active, deriveScreenerProfile(flow.id, answers));

  function handleRetake() {
    reset();
    navigate('/');
  }

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col items-center gap-space-4 p-space-5">
      <div className="flex flex-col items-center gap-space-1 text-center">
        <p className="text-overline uppercase text-text-faint">
          {isTopMatch ? flow.resultsCopy.centerLabel : 'You’re exploring'}
        </p>
        <h2 className="font-heading text-h2 text-text-strong">{roleDetails[active].roleName}</h2>
      </div>
      <p className="max-w-md text-center text-small text-text-faint">{flow.resultsCopy.mapHint}</p>

      <FitNote lines={fitLines} />

      <div className="w-full max-w-sm">
        <NodeMap
          result={categoryResult}
          activeCategory={active}
          onSelectCategory={setActiveCategory}
          onOpenTitle={(category, title) => setOpenTitle({ category, title })}
          reduce={reduce}
        />
      </div>

      <button
        type="button"
        data-testid="retake"
        onClick={handleRetake}
        className="text-small text-text-faint underline transition-colors hover:text-text-default"
      >
        {flow.resultsCopy.retake}
      </button>

      <AnimatePresence>
        {openTitle && (
          <RoleDetailSheet
            detail={roleDetails[openTitle.category]}
            jobTitle={openTitle.title}
            matchPercentages={categoryResult.matchPercentages}
            copy={flow.resultsCopy.sheet}
            reduce={reduce}
            onClose={() => setOpenTitle(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
