import type { CategoryId, CategoryWeights, Job, ResultsCardsCopy, RoleDetail } from '@/data/types';

import { ConstellationField } from './ConstellationField';
import { JobSidePanel } from './JobSidePanel';

// Screen 6 of the mockup's results system (D-029 Phase F): a role's job constellation, with the
// job overlay layered on the SAME mounted shell. `selected` and `job` both render here (one keyed
// branch in ResultsExperience) so the constellation never remounts between them — only the side
// panel's body swaps. Full-bleed over the shared AmbientField (rendered once in ResultsExperience):
// a glass 404px side rail and the constellation field beside it (desktop-first; responsive is Phase G).

interface ResultsConstellationProps {
  copy: ResultsCardsCopy;
  detail: RoleDetail;
  rank: number;
  pct: number;
  jobs: Job[];
  view: 'selected' | 'job';
  selectedJob: number | null;
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  reduce: boolean;
  onOpenJob: (jobIndex: number) => void;
  onBackToMap: () => void;
  onBackToConstellation: () => void;
  onRoleOverview: () => void;
  onOpenJobOverview: () => void;
}

export function ResultsConstellation({
  copy,
  detail,
  rank,
  pct,
  jobs,
  view,
  selectedJob,
  ranking,
  matchPercentages,
  reduce,
  onOpenJob,
  onBackToMap,
  onBackToConstellation,
  onRoleOverview,
  onOpenJobOverview,
}: ResultsConstellationProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" data-testid="results-constellation">
      <div className="relative z-10 flex h-full w-full gap-space-4 p-space-3">
        <div className="w-[var(--container-job-panel)] shrink-0">
          <JobSidePanel
            view={view}
            copy={copy}
            explore={copy.explore}
            detail={detail}
            rank={rank}
            pct={pct}
            jobs={jobs}
            selectedJob={selectedJob}
            ranking={ranking}
            matchPercentages={matchPercentages}
            reduce={reduce}
            onOpenJob={onOpenJob}
            onBackToMap={onBackToMap}
            onBackToConstellation={onBackToConstellation}
            onRoleOverview={onRoleOverview}
            onOpenJobOverview={onOpenJobOverview}
          />
        </div>

        <div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center">
          <ConstellationField
            category={detail.categoryId}
            roleName={detail.roleName}
            pct={pct}
            jobs={jobs}
            selectedJob={selectedJob}
            reduce={reduce}
            onSelect={onOpenJob}
          />
        </div>
      </div>
    </div>
  );
}
