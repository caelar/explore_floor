import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/Icon';
import { MAP_CONTEXT_PANEL } from '@/data/careerMapArt';
import type { CategoryId, CategoryWeights, Job, ResultsCardsCopy, ResultsMapCopy, RoleDetail } from '@/data/types';
import { durations, durationsMs, easings, type MapPaneDock, type MapPhase } from '@/lib';

import { CareerMapField } from './CareerMapField';
import { JobSidePanel } from './JobSidePanel';

// Unified zoomable career map: a truly full-bleed infinite canvas at every phase, with overlay
// chrome — the intro card / "?" pill, an overview-only "Back to your results" pill, and the
// docked JobSidePanel rail at role + job zoom. The camera fits the active cluster into the pane
// the rail leaves free (CM-11); the rail mounts once the phase camera lands. At role/job zoom the
// rail's own header owns the back nav, so the top-left exit pill shows only at overview.

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
  onRoleOverview: () => void;
  onOpenJobOverview: () => void;
  targetJobId: string | null;
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
  onRoleOverview,
  onOpenJobOverview,
  targetJobId,
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
  const paneDock: MapPaneDock = phase === 'overview' ? 'none' : mdUp ? 'left' : 'bottom';

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = () => setMdUp(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // The rail mounts once the phase camera lands (onCameraSettled below); the timeout covers a
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

      {/* overlay chrome: overview exit link, intro card / pill, and the docked rail */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {/* Overview-only exit pill (top-left). At role/job zoom the rail header owns the back nav. */}
        {phase === 'overview' && (
          <button
            type="button"
            onClick={onBackToCards}
            data-testid="map-back-cards"
            className="pointer-events-auto absolute left-space-3 top-space-3 inline-flex h-control-lg items-center gap-space-1 rounded-full border border-glass-border bg-glass-fill-strong px-space-3 font-body text-small font-medium text-text-on-dark-muted backdrop-blur-panel transition-colors hover:text-text-on-dark"
          >
            <Icon name="chevron-l" size={18} />
            {cardsCopy.backToResults}
          </button>
        )}

        <AnimatePresence mode="wait">
          {phase === 'overview' && introRevealed && introMode === 'expanded' && (
            <motion.div
              key="map-intro"
              {...introFade}
              className="absolute inset-x-space-3 top-space-3 flex justify-center pt-space-6"
              data-testid="career-map-intro"
            >
              <div className="relative w-full max-w-map-card rounded-lg border border-glass-border bg-glass-fill-strong px-space-5 py-space-3 text-center shadow-dark-card backdrop-blur-panel">
                <button
                  type="button"
                  data-testid="career-map-intro-dismiss"
                  aria-label={copy.hideDirections}
                  onClick={collapseIntro}
                  className="pointer-events-auto absolute right-space-2 top-space-2 flex size-control-sm items-center justify-center rounded-full text-text-on-dark-faint transition-colors hover:text-text-on-dark"
                >
                  <Icon name="x" size={16} />
                </button>
                <h1 className="font-heading text-h4 text-text-on-dark">{copy.title}</h1>
                <div className="my-space-1 h-px bg-glass-border" />
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
              className="absolute inset-x-space-3 top-space-3 flex justify-center pt-space-6 md:pt-0"
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

        {/* Docked rail: role summary at role zoom, compact job at job zoom; exits at overview. */}
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
              <JobSidePanel
                view={phase === 'job' ? 'job' : 'selected'}
                copy={cardsCopy}
                explore={cardsCopy.explore}
                detail={detail}
                rank={roleIndex}
                pct={matchPercentages[detail.categoryId]}
                jobs={jobs}
                selectedJob={selectedJob}
                ranking={ranking}
                matchPercentages={matchPercentages}
                reduce={reduce}
                onOpenJob={(jobIndex) => onSelectJob(roleIndex, jobIndex)}
                onBackToMap={onBackToOverview}
                onBackToConstellation={onBackToRole}
                onRoleOverview={onRoleOverview}
                onOpenJobOverview={onOpenJobOverview}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
