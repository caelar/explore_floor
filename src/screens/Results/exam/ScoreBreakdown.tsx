import { roleDetails } from '@/data';
import { CATEGORIES } from '@/data/types';
import type { CategoryContributions } from '@/lib';

interface ScoreBreakdownProps {
  contributions: CategoryContributions;
}

// The "Breakdowns" panel from the exam results wireframe, read as "why you scored that way":
// for each category, the things the user actually said yes to (the items that earned points),
// with an n-of-m count, plus the maybes shown quietly as on-the-fence. Score provenance straight
// from categoryContributions — same path the engine scored, so the numbers always reconcile.
export function ScoreBreakdown({ contributions }: ScoreBreakdownProps) {
  return (
    <section
      className="flex w-full flex-col gap-space-4 rounded-md border border-border-default bg-bg p-space-4"
      data-testid="score-breakdown"
    >
      <h3 className="font-heading text-h5 text-text-strong">Why you scored that way</h3>

      {CATEGORIES.map((category) => {
        const entry = contributions[category];
        if (entry.totalCount === 0) return null;
        return (
          <div key={category} className="flex flex-col gap-space-1">
            <p className="text-body font-medium text-text-default">
              {roleDetails[category].roleName}{' '}
              <span className="text-text-faint">
                — you matched {entry.earnedCount} of {entry.totalCount}
              </span>
            </p>
            {entry.earned.length > 0 && (
              <p className="text-small text-text-muted">You said yes to: {entry.earned.join(', ')}.</p>
            )}
            {entry.maybe.length > 0 && (
              <p className="text-small text-text-faint">On the fence: {entry.maybe.join(', ')}.</p>
            )}
          </div>
        );
      })}
    </section>
  );
}
