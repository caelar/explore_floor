import { Icon } from '@/components/Icon';
import type {
  CategoryId,
  CategoryWeights,
  Job,
  ResultsCardsCopy,
  RoleDetail,
} from '@/data/types';

import { fill } from './copy';
import { SignalBars } from './SignalBars';
import { StatBox } from './StatBox';

// The context panel's role body (CM-10): the pre-merge rail's role summary revived — match
// kicker, role name + %, signal bars, description, compact stat chips, and the jobs-in-path
// list (click a job to zoom to it). Back controls live in the panel header, not here.

interface MapPanelRoleProps {
  copy: ResultsCardsCopy;
  detail: RoleDetail;
  rank: number;
  pct: number;
  jobs: Job[];
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  reduce: boolean;
  onOpenJob: (jobIndex: number) => void;
}

// Hairline section rule between the panel's groups — same token as the header/footer borders.
const sectionRule = 'border-t border-glass-border';

export function MapPanelRole({
  copy,
  detail,
  rank,
  pct,
  jobs,
  ranking,
  matchPercentages,
  reduce,
  onOpenJob,
}: MapPanelRoleProps) {
  const explore = copy.explore;
  const matchLabel = copy.matchLabels[rank] ?? copy.matchLabels[copy.matchLabels.length - 1];

  return (
    <div className="flex flex-col gap-space-3" data-testid="map-panel-role">
      <div>
        <p className="font-body text-small text-text-on-dark-faint">{matchLabel}</p>
        <div className="mt-space-1 flex items-baseline justify-between gap-space-2">
          <h2 className="font-heading text-h4 text-text-on-dark">{detail.roleName}</h2>
          <span className="font-heading text-h4 tabular-nums text-text-on-dark">{pct}%</span>
        </div>
      </div>

      <SignalBars
        order={ranking}
        matchPercentages={matchPercentages}
        activeCategory={detail.categoryId}
        reduce={reduce}
        dense
      />

      <div className={sectionRule} aria-hidden="true" />

      <section>
        <h3 className="font-heading text-h5 text-text-on-dark">{copy.descriptionHeading}</h3>
        <p className="mt-space-2 font-body text-body text-text-on-dark-muted">{detail.description}</p>
      </section>

      {/* Compact stat chips: short single-line values so the panel reads as two small balanced
          chips, not the tall multi-line boxes the job body uses. */}
      <div className="flex flex-row gap-space-2">
        <StatBox label={copy.salaryLabel} compact>
          <p className="font-heading text-h5 font-bold text-text-on-dark">{detail.salaryShort}</p>
        </StatBox>
        <StatBox label={copy.educationLabel} compact>
          <p className="font-heading text-h5 font-bold text-text-on-dark">{detail.educationShort}</p>
        </StatBox>
      </div>

      <div className={sectionRule} aria-hidden="true" />

      <section>
        <div className="flex items-baseline justify-between gap-space-2">
          <h3 className="font-heading text-h5 text-text-on-dark">{explore.jobsInPathHeading}</h3>
          <span className="font-body text-small text-text-on-dark-faint">
            {fill(explore.jobsInPathCount, { n: jobs.length })}
          </span>
        </div>
        <ul className="mt-space-3 flex flex-col gap-space-2">
          {jobs.map((job, i) => (
            <li key={job.id}>
              <button
                type="button"
                data-testid={`job-list-${job.id}`}
                onClick={() => onOpenJob(i)}
                className="flex w-full items-center justify-between gap-space-2 rounded-md border border-glass-border-soft bg-glass-fill px-space-3 py-space-2 text-left font-body text-body text-text-on-dark transition-colors hover:bg-glass-fill-strong"
              >
                <span className="min-w-0 truncate">{job.title}</span>
                <Icon name="chevron-r" size={18} className="shrink-0 text-text-on-dark-faint" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
