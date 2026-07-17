import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import { Icon } from '@/components/Icon';
import { MAP_JOB_PANEL_MAX_WIDTH } from '@/data/careerMapArt';
import type { CategoryId, CategoryWeights, Job, ResultsCardsCopy, ResultsMapCopy, RoleDetail } from '@/data/types';
import { durations, easings, jobMapLocation, type MapPhase } from '@/lib';

import { CareerMapField } from './CareerMapField';
import { fill } from './copy';
import { JobOverview } from './JobOverview';

// Unified zoomable career map: full-bleed infinite canvas with overlay chrome (intro card,
// back nav). JobOverview panel docks left on the job-selected phase only.

interface CareerMapProps {
  copy: ResultsMapCopy;
  cardsCopy: ResultsCardsCopy;
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  phase: MapPhase;
  roleIndex: number;
  detail: RoleDetail;
  jobs: Job[];
  selectedJob: number | null;
  reduce: boolean;
  onSelectRole: (rank: number) => void;
  onSelectJob: (rank: number, jobIndex: number) => void;
  onDeselectRole?: () => void;
  onDeselectJob?: () => void;
  onBackToOverview: () => void;
  onBackToRole: () => void;
  onBackToCards: () => void;
  onJobOverviewBack: () => void;
  targetJobId: string | null;
  onSetTargetJob: (jobId: string) => void;
}

const backRow =
  'inline-flex items-center gap-space-1 font-body text-small font-medium text-text-on-dark-muted transition-colors hover:text-text-on-dark';

export function CareerMap({
  copy,
  cardsCopy,
  ranking,
  matchPercentages,
  phase,
  roleIndex,
  detail,
  jobs,
  selectedJob,
  reduce,
  onSelectRole,
  onSelectJob,
  onDeselectRole,
  onDeselectJob,
  onBackToOverview,
  onBackToRole,
  onBackToCards,
  onJobOverviewBack,
  targetJobId,
  onSetTargetJob,
}: CareerMapProps) {
  const [introVisible, setIntroVisible] = useState(true);
  const [introRevealed, setIntroRevealed] = useState(reduce);
  const [jobPanelOpen, setJobPanelOpen] = useState(false);
  const [mdUp, setMdUp] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  );
  const job = selectedJob !== null ? jobs[selectedJob] : undefined;

  const navigateToJob = useCallback(
    (jobId: string) => {
      const location = jobMapLocation(jobId, ranking);
      if (location) onSelectJob(location.rank, location.jobIndex);
    },
    [ranking, onSelectJob],
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setMdUp(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (phase === 'overview') setIntroVisible(true);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'job') {
      setJobPanelOpen(false);
      return;
    }
    if (reduce) {
      setJobPanelOpen(true);
      return;
    }
    // Fallback: if the motion camera callback is missed (e.g. headless), still dock the panel
    // after the job-zoom duration (Figma: panel follows the pour).
    const timer = window.setTimeout(() => setJobPanelOpen(true), 800);
    return () => window.clearTimeout(timer);
  }, [phase, reduce, selectedJob]);

  const onJobZoomComplete = useCallback(() => {
    if (phase === 'job') setJobPanelOpen(true);
  }, [phase]);

  const onMapEntranceComplete = useCallback(() => {
    setIntroRevealed(true);
  }, []);

  const dismissIntro = useCallback(() => setIntroVisible(false), []);

  const introFade = {
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: { duration: reduce ? durations.instant : durations.glide, ease: easings.soft },
  };

  const backControl =
    phase === 'overview' ? (
      <button type="button" onClick={onBackToCards} data-testid="map-back-cards" className={backRow}>
        <Icon name="chevron-l" size={18} />
        {fill(cardsCopy.backToRole, { role: detail.roleName })}
      </button>
    ) : phase === 'role' ? (
      <button type="button" onClick={onBackToOverview} data-testid="map-back-overview" className={backRow}>
        <Icon name="chevron-l" size={18} />
        {cardsCopy.backToMap}
      </button>
    ) : null;

  const panelSlide = {
    initial: reduce ? false : { x: '-100%' },
    animate: { x: 0 },
    exit: reduce ? { opacity: 0 } : { x: '-100%' },
    transition: { duration: reduce ? durations.instant : durations.snap, ease: easings.soft },
  };

  const jobPanelLane =
    phase === 'job' && mdUp ? (
      <div
        className="relative h-full shrink-0"
        style={{ width: MAP_JOB_PANEL_MAX_WIDTH }}
        aria-hidden={!jobPanelOpen}
      >
        <AnimatePresence>
          {job && jobPanelOpen && (
            <motion.div
              key="career-map-job-panel"
              {...panelSlide}
              className="pointer-events-auto absolute inset-0 z-20 overflow-hidden"
              data-testid="career-map-job-panel"
            >
              <div className="h-full overflow-y-auto p-space-3">
                <JobOverview
                  key={job.id}
                  copy={cardsCopy}
                  detail={detail}
                  job={job}
                  onBack={onJobOverviewBack}
                  embedded
                  onNavigateToJob={navigateToJob}
                  isTargetRole={targetJobId === job.id}
                  onSetTargetRole={() => onSetTargetJob(job.id)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ) : null;

  const jobPanelMobile =
    phase === 'job' && !mdUp ? (
      <AnimatePresence>
        {job && jobPanelOpen && (
          <motion.div
            key="career-map-job-panel-mobile"
            {...panelSlide}
            className="pointer-events-auto relative z-20 w-full shrink-0 overflow-hidden"
            data-testid="career-map-job-panel"
          >
            <div className="h-full overflow-y-auto p-space-3">
              <JobOverview
                key={job.id}
                copy={cardsCopy}
                detail={detail}
                job={job}
                onBack={onJobOverviewBack}
                embedded
                onNavigateToJob={navigateToJob}
                isTargetRole={targetJobId === job.id}
                onSetTargetRole={() => onSetTargetJob(job.id)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    ) : null;

  return (
    <div className="absolute inset-0 overflow-hidden" data-testid="results-map">
      <div className="relative z-10 flex h-full">
        {jobPanelLane}
        {jobPanelMobile}

        <div className="relative min-h-0 min-w-0 flex-1 overflow-visible">
          <CareerMapField
            ranking={ranking}
            matchPercentages={matchPercentages}
            phase={phase}
            activeRoleIndex={roleIndex}
            selectedJob={selectedJob}
            targetJobId={targetJobId}
            reduce={reduce}
            onSelectRole={onSelectRole}
            onSelectJob={onSelectJob}
            onDeselectRole={onDeselectRole ?? onBackToOverview}
            onDeselectJob={onDeselectJob ?? onBackToRole}
            onExplore={dismissIntro}
            onCameraTransitionEnd={onJobZoomComplete}
            onEntranceComplete={onMapEntranceComplete}
          />

          <div className="pointer-events-none absolute inset-0 z-20">
            {backControl ? (
              <div className="pointer-events-auto absolute left-space-3 top-space-3">{backControl}</div>
            ) : null}

            <AnimatePresence>
              {phase === 'overview' && introVisible && introRevealed && (
                <motion.div
                  key="map-intro"
                  {...introFade}
                  className="absolute inset-x-space-3 top-space-3 flex justify-center pt-space-6"
                  data-testid="career-map-intro"
                >
                  <div className="w-full max-w-map-card rounded-lg border border-glass-border bg-glass-fill-strong px-space-5 py-space-4 text-center shadow-dark-card backdrop-blur-panel">
                    <h1 className="font-heading text-h3 text-text-on-dark">{copy.title}</h1>
                    <div className="my-space-3 h-px bg-glass-border" />
                    <p className="font-body text-body text-text-on-dark-muted">{copy.intro}</p>
                    <p className="mt-space-1 font-body text-body text-text-on-dark-faint">{copy.hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
