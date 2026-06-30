import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';

import { Icon } from '@/components/Icon';
import { jobs, roleDetails } from '@/data';
import { durations, easings } from '@/lib';
import { categoryContributions } from '@/lib/categoryBreakdown';
import { deriveScreenerProfile, screenerFitLines } from '@/lib/screenerFit';
import { useFlow, useSessionStore } from '@/state';

import { AmbientField } from './AmbientField';
import { CompareView } from './CompareView';
import { fill } from './copy';
import { JobOverview } from './JobOverview';
import { ResultsConstellation } from './ResultsConstellation';
import { ResultsMap } from './ResultsMap';
import { ResultsPanel } from './ResultsPanel';
import { RoleHero } from './RoleHero';
import { RoleTabs } from './RoleTabs';
import { useResultsNav } from './useResultsNav';

// The dark results experience (DATA_MODEL §17, D-029 Phase C). Reads the scored result from the
// store (never recomputes) and renders the headline role-cards screen: a panel with a sticky
// control bar, the role hero (match %, signal bars, "why you matched"), and the role tabs, with
// prev/next stepping through the ranked roles. The Compare and Map control-bar actions switch an
// internal view; those screens land in Phases D/E, so they show a "coming next" stub for now.
export function ResultsExperience() {
  const navigate = useNavigate();
  const reduce = !!useReducedMotion();
  const flow = useFlow();
  const categoryResult = useSessionStore((s) => s.state.categoryResult);
  const answers = useSessionStore((s) => s.state.answers);
  const statementBuckets = useSessionStore((s) => s.state.statementBuckets);
  const reset = useSessionStore((s) => s.reset);
  const nav = useResultsNav(categoryResult?.ranking.length ?? 0);

  if (!categoryResult) {
    return (
      <main className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-space-3 p-space-6 text-center">
        <h2 className="font-heading text-h3 text-text-on-dark">No results yet</h2>
        <p className="font-body text-body text-text-on-dark-muted">
          Answer the questions first and we&rsquo;ll match you.
        </p>
        <Link to="/" className="font-body text-body text-arm-gold underline">
          Start the quiz
        </Link>
      </main>
    );
  }

  const cards = flow.resultsCopy.cards;
  const ranking = categoryResult.ranking;
  const role = ranking[nav.roleIndex];
  const detail = roleDetails[role];
  const pct = categoryResult.matchPercentages[role];
  // The breakdown engine returns every role at once; compare reads two of them, cards reads one.
  const contributions = categoryContributions(flow, answers, statementBuckets);
  const profile = deriveScreenerProfile(flow.id, answers);
  const contribution = contributions[role];
  const fitLines = screenerFitLines(role, profile);

  const handleRetake = () => {
    reset();
    navigate('/');
  };

  const fade = {
    initial: reduce ? false : { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reduce ? 0 : durations.snap, ease: easings.soft },
  };

  const pill =
    'inline-flex h-9 items-center gap-space-1 rounded-full border border-glass-border px-space-3 font-body text-body text-text-on-dark transition-colors hover:bg-glass-fill';

  const controlBar = (
    <>
      <button type="button" onClick={nav.openCompare} data-testid="open-compare" className={pill}>
        <Icon name="compare" size={19} />
        {cards.compareCta}
      </button>
      {nav.fromMap ? (
        // Reached cards via the map → constellation → "Role overview" path: the forward action dives
        // back into THIS role's job constellation (matches the mockup's "Explore {role} careers").
        <button
          type="button"
          onClick={() => nav.openConstellation(nav.roleIndex)}
          data-testid="explore-role"
          className={pill}
        >
          {fill(cards.exploreRoleCta, { role: detail.roleName })}
          <Icon name="arrow-r" size={18} />
        </button>
      ) : nav.atEnd ? (
        <button
          type="button"
          onClick={() => nav.setView('map')}
          data-testid="open-map"
          className="inline-flex h-9 items-center gap-space-1 rounded-full bg-arm-gold px-space-4 font-body text-body font-medium text-near-black transition-colors hover:bg-arm-gold-soft"
        >
          {cards.exploreCta}
          <Icon name="arrow-r" size={18} />
        </button>
      ) : (
        <button type="button" onClick={() => nav.setView('map')} data-testid="open-map" className={pill}>
          {cards.mapCta}
          <Icon name="arrow-r" size={18} />
        </button>
      )}
    </>
  );

  // Clicking the gutter around the cards panel navigates to the map — or back to the constellation if
  // the user dived in from there (reference parity: a full-bleed click layer sits behind the panel).
  const gutterToConstellation = nav.fromMap;
  const onGutterClick = gutterToConstellation
    ? () => nav.openConstellation(nav.roleIndex)
    : () => nav.setView('map');
  const gutterLabel = gutterToConstellation
    ? fill(cards.exploreRoleCta, { role: detail.roleName })
    : cards.mapCta;

  // One viewport-height canvas with a SHARED AmbientField behind every view, so the cards / compare /
  // job-overview panels float over the same orb background as the map + constellation (each panel is
  // translucent glass; the full-bleed views render their content directly over the field).
  return (
    <main
      className="relative h-[calc(100dvh-var(--spacing-nav))] w-full overflow-hidden"
      data-testid="results"
    >
      <AmbientField reduce={reduce} />
      <AnimatePresence mode="wait" initial={false}>
        {nav.view === 'cards' ? (
          <motion.div key="cards" className="absolute inset-0" {...fade}>
            {/* Gutter click layer behind the panel (cards only). */}
            <button
              type="button"
              aria-label={gutterLabel}
              data-testid="cards-gutter"
              onClick={onGutterClick}
              className="absolute inset-0 cursor-pointer"
            />
            <ResultsPanel controlBar={controlBar}>
              <RoleHero
                copy={cards}
                detail={detail}
                rank={nav.roleIndex}
                roleCount={ranking.length}
                ranking={ranking}
                matchPercentages={categoryResult.matchPercentages}
                pct={pct}
                contribution={contribution}
                fitLines={fitLines}
                isTopMatch={nav.roleIndex === 0}
                expanded={nav.expanded}
                reduce={reduce}
                onToggle={nav.toggleExpanded}
                onPrev={nav.prev}
                onNext={nav.next}
                atStart={nav.atStart}
                atEnd={nav.atEnd}
              />
              <div className="mx-auto w-full max-w-results">
                <RoleTabs
                  copy={cards}
                  detail={detail}
                  activeTab={nav.activeTab}
                  onTab={nav.setActiveTab}
                />
              </div>
              <div className="mx-auto flex w-full max-w-results justify-center pt-space-2">
                <button
                  type="button"
                  data-testid="retake"
                  onClick={handleRetake}
                  className="font-body text-small text-text-on-dark-faint underline transition-colors hover:text-text-on-dark"
                >
                  {flow.resultsCopy.retake}
                </button>
              </div>
            </ResultsPanel>
          </motion.div>
        ) : nav.view === 'compare' ? (
          <motion.div key="compare" className="absolute inset-0" {...fade}>
            <CompareView
              copy={cards}
              ranking={ranking}
              matchPercentages={categoryResult.matchPercentages}
              contributions={contributions}
              profile={profile}
              nav={nav}
              reduce={reduce}
            />
          </motion.div>
        ) : nav.view === 'selected' || nav.view === 'job' ? (
          // selected + job share one mounted shell, so the constellation never remounts between
          // them — only the side panel's body swaps (see ResultsConstellation / JobSidePanel).
          <motion.div key="constellation" className="absolute inset-0" {...fade}>
            <ResultsConstellation
              copy={cards}
              detail={detail}
              rank={nav.roleIndex}
              pct={pct}
              jobs={jobs[role]}
              view={nav.view}
              selectedJob={nav.selectedJob}
              ranking={ranking}
              matchPercentages={categoryResult.matchPercentages}
              reduce={reduce}
              onOpenJob={nav.openJob}
              onBackToMap={() => nav.setView('map')}
              onBackToConstellation={nav.backToConstellation}
              onRoleOverview={nav.roleOverview}
              onOpenJobOverview={nav.openJobOverview}
            />
          </motion.div>
        ) : nav.view === 'job-overview' ? (
          <motion.div key="job-overview" className="absolute inset-0" {...fade}>
            <JobOverview
              copy={cards}
              detail={detail}
              job={jobs[role][nav.selectedJob ?? 0]}
              onBack={nav.backToJob}
            />
          </motion.div>
        ) : (
          <motion.div key="map" className="absolute inset-0" {...fade}>
            <ResultsMap
              copy={cards.map}
              ranking={ranking}
              matchPercentages={categoryResult.matchPercentages}
              reduce={reduce}
              onDive={nav.openConstellation}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
