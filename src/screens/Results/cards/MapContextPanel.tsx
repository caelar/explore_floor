import { AnimatePresence, motion } from 'motion/react';

import { Icon } from '@/components/Icon';
import type {
  CategoryId,
  CategoryWeights,
  Job,
  ResultsCardsCopy,
  RoleDetail,
} from '@/data/types';
import { durations, easings } from '@/lib';

import { MapPanelJob } from './MapPanelJob';
import { MapPanelRole } from './MapPanelRole';

// The floating context panel (CM-09/10/11): persistent orientation at role and job zoom. One
// shell, two bodies — role content (top-match read, description, jobs-in-path) at role zoom,
// the full three-tab job content at job zoom — crossfading inside the shell so the map behind
// never remounts. The header carries the phase-local back (All paths / the role name) and a
// per-level kicker so the two beats read distinct. Floats with margin on all sides; the camera
// fits the cluster into the pane it leaves free (careerMapPaneRect).

interface MapContextPanelProps {
  phase: 'role' | 'job';
  copy: ResultsCardsCopy;
  detail: RoleDetail;
  rank: number;
  pct: number;
  jobs: Job[];
  job?: Job;
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  reduce: boolean;
  targetJobId: string | null;
  onOpenJob: (jobIndex: number) => void;
  onNavigateToJob: (jobId: string) => void;
  onBackToOverview: () => void;
  onBackToRole: () => void;
  onSetTargetJob: (jobId: string) => void;
}

const backRow =
  'inline-flex items-center gap-space-1 font-body text-small font-medium text-text-on-dark-muted transition-colors hover:text-text-on-dark';

export function MapContextPanel({
  phase,
  copy,
  detail,
  rank,
  pct,
  jobs,
  job,
  ranking,
  matchPercentages,
  reduce,
  targetJobId,
  onOpenJob,
  onNavigateToJob,
  onBackToOverview,
  onBackToRole,
  onSetTargetJob,
}: MapContextPanelProps) {
  const explore = copy.explore;
  const showJob = phase === 'job' && job;

  const fade = {
    initial: reduce ? false : { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: -6 },
    transition: { duration: reduce ? 0 : durations.snap, ease: easings.soft },
  };

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-glass-border bg-glass-panel shadow-dark-card backdrop-blur-panel"
      data-testid="map-context-panel"
    >
      {/* header: phase-local back + level kicker */}
      <div className="flex shrink-0 items-center justify-between gap-space-2 border-b border-glass-border px-space-4 py-space-2">
        {showJob ? (
          <button type="button" onClick={onBackToRole} data-testid="map-panel-back" className={backRow}>
            <Icon name="chevron-l" size={18} />
            {detail.roleName}
          </button>
        ) : (
          <button
            type="button"
            onClick={onBackToOverview}
            data-testid="map-panel-back"
            className={backRow}
          >
            <Icon name="chevron-l" size={18} />
            {explore.allPathsBack}
          </button>
        )}
        <span className="font-body text-small uppercase tracking-wide text-text-on-dark-faint">
          {showJob ? explore.panelKickerJob : explore.panelKickerRole}
        </span>
      </div>

      {/* body (scrolls; crossfades role <-> job, and job <-> job via the id key) */}
      <div className="min-h-0 flex-1 overflow-y-auto px-space-4 py-space-4">
        <AnimatePresence mode="wait" initial={false}>
          {showJob ? (
            <motion.div key={`job-${job.id}`} {...fade}>
              <MapPanelJob
                copy={copy}
                detail={detail}
                job={job}
                onNavigateToJob={onNavigateToJob}
                isTargetRole={targetJobId === job.id}
                onSetTargetRole={() => onSetTargetJob(job.id)}
              />
            </motion.div>
          ) : (
            <motion.div key="role" {...fade}>
              <MapPanelRole
                copy={copy}
                detail={detail}
                rank={rank}
                pct={pct}
                jobs={jobs}
                ranking={ranking}
                matchPercentages={matchPercentages}
                reduce={reduce}
                onOpenJob={onOpenJob}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
