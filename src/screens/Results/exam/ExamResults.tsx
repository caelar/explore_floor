import { AnimatePresence, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CATEGORY_ACCENT_TEXT } from '@/components/categoryAccent';
import { roleDetails } from '@/data';
import type { CategoryId } from '@/data/types';
import { categoryContributions } from '@/lib';
import { RobotPlaceholder } from '@/scene/RobotPlaceholder';
import { useFlow, useSessionStore } from '@/state';

import { RoleDetailSheet } from '../category/RoleDetailSheet';
import { CategoryBars } from './CategoryBars';
import { ScoreBreakdown } from './ScoreBreakdown';
import { YourRoles } from './YourRoles';

// The exam flow's results (DATA_MODEL §17), per the team's exam results wireframe — a dashboard
// rather than the narrative's node map: a robot anchor + four category bars up top, then "why you
// scored that way" and "your roles" below. Reads the same categoryResult as the node map; "your
// roles" reuses the shared RoleDetailSheet. This screen only orchestrates: compute the score
// provenance, hold the open-role state, and lay the panels out.
export function ExamResults() {
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();
  const flow = useFlow();
  const categoryResult = useSessionStore((s) => s.state.categoryResult);
  const answers = useSessionStore((s) => s.state.answers);
  const statementBuckets = useSessionStore((s) => s.state.statementBuckets);
  const reset = useSessionStore((s) => s.reset);

  const [openRole, setOpenRole] = useState<CategoryId | null>(null);

  if (flow.kind !== 'exam' || !categoryResult) {
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

  const contributions = categoryContributions(flow, answers, statementBuckets);

  function handleRetake() {
    reset();
    navigate('/');
  }

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col items-center gap-space-5 p-space-5">
      <h2 className="font-heading text-h2 text-center text-text-strong">{flow.resultsCopy.heading}</h2>

      <div className="flex w-full flex-col items-center gap-space-5 sm:flex-row sm:items-center sm:gap-space-6">
        <div className="shrink-0">
          <RobotPlaceholder colorClass={CATEGORY_ACCENT_TEXT[categoryResult.primaryCategory]} />
        </div>
        <CategoryBars matchPercentages={categoryResult.matchPercentages} />
      </div>

      <ScoreBreakdown contributions={contributions} />

      <YourRoles
        ranking={categoryResult.ranking}
        matchPercentages={categoryResult.matchPercentages}
        onOpenRole={setOpenRole}
      />

      <button
        type="button"
        data-testid="retake"
        onClick={handleRetake}
        className="text-small text-text-faint underline transition-colors hover:text-text-default"
      >
        {flow.resultsCopy.retake}
      </button>

      <AnimatePresence>
        {openRole && (
          <RoleDetailSheet
            detail={roleDetails[openRole]}
            matchPercentages={categoryResult.matchPercentages}
            copy={flow.resultsCopy.sheet}
            reduce={reduce}
            onClose={() => setOpenRole(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
