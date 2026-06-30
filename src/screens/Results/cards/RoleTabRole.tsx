import { Icon } from '@/components/Icon';
import type { ResultsCardsCopy, RoleDetail } from '@/data/types';

import { StatBox } from './StatBox';

// Tab 1 "The role": the role description, an optional upward-path callout (entry Technician),
// salary + education stat cards, and the authored "What you'll do" duties. Tokens only (D-029).
export function RoleTabRole({ copy, detail }: { copy: ResultsCardsCopy; detail: RoleDetail }) {
  return (
    <div className="mt-space-4 flex flex-col gap-space-5">
      <section>
        <h3 className="font-heading text-h5 text-text-on-dark">{copy.descriptionHeading}</h3>
        <p className="mt-space-2 font-body text-body text-text-on-dark-muted">{detail.description}</p>
      </section>

      {detail.pathUp && (
        <div
          className="flex gap-space-2 rounded-lg border border-glass-border-soft bg-glass-fill p-space-4"
          data-testid="path-up"
        >
          <Icon name="trending" size={20} className="mt-space-0 shrink-0 text-role-technician" />
          <p className="font-body text-body text-text-on-dark-muted">{detail.pathUp}</p>
        </div>
      )}

      <div className="flex flex-col gap-space-3 sm:flex-row">
        <StatBox label={copy.salaryLabel}>
          <p className="font-heading text-h4 text-text-on-dark">{detail.salaryMedian}</p>
        </StatBox>
        {/* Education matches the salary box: one bold line (educationShort, e.g. "Bachelor's"),
            not the multi-line bulleted list — same compact treatment as the constellation side rail. */}
        <StatBox label={copy.educationLabel}>
          <p className="font-heading text-h4 text-text-on-dark">{detail.educationShort}</p>
        </StatBox>
      </div>

      <section>
        <h3 className="font-heading text-h5 text-text-on-dark">{copy.dutiesHeading}</h3>
        <ul className="mt-space-3 flex flex-col gap-space-2">
          {detail.duties.map((duty) => (
            <li
              key={duty.heading}
              className="flex gap-space-2 font-body text-body text-text-on-dark-muted"
            >
              <span className="text-text-on-dark-faint">&bull;</span>
              <span>
                <strong className="font-bold text-text-on-dark">{duty.heading}.</strong> {duty.text}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
