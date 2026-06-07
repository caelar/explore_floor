import { roleDetails } from '@/data';
import type { CategoryId, CategoryWeights } from '@/data/types';

interface YourRolesProps {
  /** Categories best→worst; the panel features the top matches. */
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  onOpenRole: (category: CategoryId) => void;
}

// The "Your roles" panel from the exam results wireframe: the user's best-matching role(s) as
// tappable cards that open the shared role detail sheet (description, activities, salary, fit
// radar). Top two by rank — enough to give a recommendation plus a runner-up without turning
// the panel into the full four-role list.
const TOP_ROLES = 2;

export function YourRoles({ ranking, matchPercentages, onOpenRole }: YourRolesProps) {
  return (
    <section className="flex w-full flex-col gap-space-3" data-testid="your-roles">
      <h3 className="font-heading text-h5 text-text-strong">Your roles</h3>
      <div className="flex flex-col gap-space-2">
        {ranking.slice(0, TOP_ROLES).map((category) => (
          <button
            key={category}
            type="button"
            data-testid={`role-card-${category}`}
            onClick={() => onOpenRole(category)}
            className="flex items-center justify-between rounded-md border border-border-default bg-bg px-space-4 py-space-3 text-left transition-colors hover:bg-bg-section"
          >
            <span className="flex flex-col">
              <span className="font-heading text-h5 text-text-strong">
                {roleDetails[category].roleName}
              </span>
              <span className="text-small text-text-faint">Tap to explore this role</span>
            </span>
            <span className="text-body font-medium text-text-muted">
              {matchPercentages[category]}%
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
