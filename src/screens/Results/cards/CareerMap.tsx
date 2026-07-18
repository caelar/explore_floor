import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/Icon';
import { MAP_CONTEXT_PANEL } from '@/data/careerMapArt';
import type { CategoryId, CategoryWeights, Job, ResultsCardsCopy, ResultsMapCopy, RoleDetail } from '@/data/types';
import { durations, durationsMs, easings, jobMapLocation, type MapPaneDock, type MapPhase } from '@/lib';

import { CareerMapField } from './CareerMapField';
import { MapContextPanel } from './MapContextPanel';

// Unified zoomable career map: a truly full-bleed infinite canvas at every phase, with overlay
// chrome — the intro card / "?" pill, a persistent exit platter (CM-09), and the floating
// MapContextPanel at role + job zoom (CM-10). The camera fits the active cluster into the pane
// the panel leaves free (CM-11); the panel mounts once the phase camera lands.

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
  targetJobId: string | null;
  onSetTargetJob: (jobId: string) => void;
}

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
  targetJobId,
  onSetTargetJob,
}: CareerMapProps) {
  // CM-07: the directions card never vanishes for good — exploring collapses it into a
  // persistent "?" pill, and the mode carries across phase changes (a later overview re-entry
  // shows the pill, not the card). One settle-based re-expand per map visit, so it never nags.
  const [introMode, setIntroMode] = useState<'expanded' | 'collapsed'>('expanded');
  const [introRevealed, setIntroRevealed] = useState(reduce);
  const autoReExpandedRef = useRef(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [mdUp, setMdUp] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches,
  );
  const job = selectedJob !== null ? jobs[selectedJob] : undefined;
  const paneDock: MapPaneDock = phase === 'overview' ? 'none' : mdUp ? 'left' : 'bottom';

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

  // The panel mounts once the phase camera lands (onCameraSettled below); the timeout covers a
  // missed motion callback (e.g. headless), derived from the phase glide instead of a magic number.
  useEffect(() => {
    if (phase === 'overview') {
      setPanelOpen(false);
      return;
    }
    if (reduce) {
      setPanelOpen(true);
      return;
    }
    const timer = window.setTimeout(
      () => setPanelOpen(true),
      durationsMs[phase === 'job' ? 'pour' : 'glide'] + 100,
    );
    return () => window.clearTimeout(timer);
  }, [phase, reduce, selectedJob]);

  const onCameraSettled = useCallback(() => {
    if (phase !== 'overview') setPanelOpen(true);
  }, [phase]);

  const onMapEntranceComplete = useCallback(() => {
    setIntroRevealed(true);
  }, []);

  const collapseIntro = useCallback(
    () => setIntroMode((mode) => (mode === 'expanded' ? 'collapsed' : mode)),
    [],
  );
  const expandIntro = useCallback(() => setIntroMode('expanded'), []);
  const onOverviewSettle = useCallback(() => {
    if (autoReExpandedRef.current) return;
    setIntroMode((mode) => {
      if (mode !== 'collapsed') return mode;
      autoReExpandedRef.current = true;
      return 'expanded';
    });
  }, []);

  const introFade = {
    initial: reduce ? false : { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: -8 },
    transition: { duration: reduce ? durations.instant : durations.glide, ease: easings.soft },
  };

  const panelFade = {
    initial: reduce ? false : { opacity: 0, x: -12 },
    animate: { opacity: 1, x: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, x: -12 },
    transition: { duration: reduce ? durations.instant : durations.snap, ease: easings.soft },
  };

  return (
    <div className="absolute inset-0 overflow-hidden" data-testid="results-map">
      <div className="absolute inset-0">
        <CareerMapField
          ranking={ranking}
          matchPercentages={matchPercentages}
          phase={phase}
          activeRoleIndex={roleIndex}
          selectedJob={selectedJob}
          targetJobId={targetJobId}
          paneDock={paneDock}
          reduce={reduce}
          onSelectRole={onSelectRole}
          onSelectJob={onSelectJob}
          onDeselectRole={onDeselectRole ?? onBackToOverview}
          onDeselectJob={onDeselectJob ?? onBackToRole}
          onExplore={collapseIntro}
          onOverviewSettle={onOverviewSettle}
          onCameraTransitionEnd={onCameraSettled}
          onEntranceComplete={onMapEntranceComplete}
        />
      </div>

      {/* overlay chrome: exit platter, intro card / pill, and the floating context panel */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {/* Persistent exit (CM-09): one label, one place, every phase. */}
        <button
          type="button"
          onClick={onBackToCards}
          data-testid="map-back-cards"
          className="pointer-events-auto absolute right-space-3 top-space-3 inline-flex h-control-lg items-center gap-space-1 rounded-full border border-glass-border bg-glass-fill-strong px-space-3 font-body text-small font-medium text-text-on-dark-muted backdrop-blur-panel transition-colors hover:text-text-on-dark"
        >
          <Icon name="chevron-l" size={18} />
          {cardsCopy.backToResults}
        </button>

        <AnimatePresence mode="wait">
          {phase === 'overview' && introRevealed && introMode === 'expanded' && (
            <motion.div
              key="map-intro"
              {...introFade}
              className="absolute inset-x-space-3 top-space-3 flex justify-center pt-space-6"
              data-testid="career-map-intro"
            >
              <div className="relative w-full max-w-map-card rounded-lg border border-glass-border bg-glass-fill-strong px-space-5 py-space-4 text-center shadow-dark-card backdrop-blur-panel">
                <button
                  type="button"
                  data-testid="career-map-intro-dismiss"
                  aria-label={copy.hideDirections}
                  onClick={collapseIntro}
                  className="pointer-events-auto absolute right-space-2 top-space-2 flex h-6 w-6 items-center justify-center rounded-full text-text-on-dark-faint transition-colors hover:text-text-on-dark"
                >
                  <Icon name="x" size={16} />
                </button>
                <h1 className="font-heading text-h3 text-text-on-dark">{copy.title}</h1>
                <div className="my-space-3 h-px bg-glass-border" />
                <p className="font-body text-body text-text-on-dark-muted">{copy.intro}</p>
                <p className="mt-space-1 font-body text-body text-text-on-dark-muted">{copy.dots}</p>
                <p className="mt-space-1 font-body text-body text-text-on-dark-faint">{copy.hint}</p>
              </div>
            </motion.div>
          )}
          {phase === 'overview' && introRevealed && introMode === 'collapsed' && (
            <motion.div
              key="map-intro-pill"
              {...introFade}
              className="absolute inset-x-space-3 top-space-3 flex justify-center"
            >
              <button
                type="button"
                data-testid="career-map-intro-pill"
                aria-label={copy.showDirections}
                onClick={expandIntro}
                className="pointer-events-auto flex h-control-tap w-control-tap items-center justify-center rounded-full border border-glass-border bg-glass-fill-strong font-heading text-h4 text-text-on-dark shadow-dark-card backdrop-blur-panel transition-colors hover:border-arm-gold hover:text-arm-gold"
              >
                ?
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating context panel (CM-10): persists across role <-> job, exits at overview. */}
        <AnimatePresence>
          {phase !== 'overview' && panelOpen && (
            <motion.div
              key="context-panel"
              {...panelFade}
              className="pointer-events-auto absolute z-20"
              style={
                mdUp
                  ? {
                      left: MAP_CONTEXT_PANEL.margin,
                      top: MAP_CONTEXT_PANEL.margin,
                      bottom: MAP_CONTEXT_PANEL.margin,
                      width: MAP_CONTEXT_PANEL.width,
                    }
                  : {
                      left: MAP_CONTEXT_PANEL.mobileMargin,
                      right: MAP_CONTEXT_PANEL.mobileMargin,
                      bottom: MAP_CONTEXT_PANEL.mobileMargin,
                      maxHeight: `${MAP_CONTEXT_PANEL.mobileMaxHeightRatio * 100}%`,
                      height: `${MAP_CONTEXT_PANEL.mobileMaxHeightRatio * 100}%`,
                    }
              }
            >
              <MapContextPanel
                phase={phase === 'job' ? 'job' : 'role'}
                copy={cardsCopy}
                detail={detail}
                rank={roleIndex}
                pct={matchPercentages[detail.categoryId]}
                jobs={jobs}
                job={job}
                ranking={ranking}
                matchPercentages={matchPercentages}
                reduce={reduce}
                targetJobId={targetJobId}
                onOpenJob={(jobIndex) => onSelectJob(roleIndex, jobIndex)}
                onNavigateToJob={navigateToJob}
                onBackToOverview={onBackToOverview}
                onBackToRole={onBackToRole}
                onSetTargetJob={onSetTargetJob}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
