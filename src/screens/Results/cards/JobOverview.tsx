import { useState } from 'react';

import { Icon } from '@/components/Icon';
import { bridgePrograms, fitNarrative } from '@/data';
import type { Job, ResultsCardsCopy, RoleDetail } from '@/data/types';

import { BridgeProgramRow } from './BridgeProgramRow';
import { Chip } from './Chip';
import { fill } from './copy';
import { EducationList } from './EducationList';
import { ResultsPanel } from './ResultsPanel';
import { StatBox } from './StatBox';
import { TrajectoryViz } from './TrajectoryViz';

// Screen 7 of the mockup's results system (D-029 Phase F): the standalone job-overview page. Lives
// in the same rounded scroll panel as the cards (ResultsPanel) with its own control bar — a Back to
// the job overlay and an inert "Set as target role" pill (chrome only, no real wiring per scope).
// Three tabs: the job overview, skills + competencies + bridge programs, and a "how you fit"
// trajectory. Local tab state (the cards' nav.activeTab is the cards' 2-tab cursor, not this).

interface JobOverviewProps {
  copy: ResultsCardsCopy;
  detail: RoleDetail;
  job: Job;
  onBack: () => void;
}

export function JobOverview({ copy, detail, job, onBack }: JobOverviewProps) {
  const explore = copy.explore;
  const [tab, setTab] = useState(0);
  const programs = bridgePrograms[detail.categoryId];

  // Control bar mirrors the role screens: the primary nav (here, Back) sits on the RIGHT, with the
  // inert "Set as target role" chrome on the left (Caelan's call — diverges from the mockup's
  // left-back layout for cross-screen consistency).
  const controlBar = (
    <>
      {/* Inert chrome (no real "set target" action in scope). */}
      <span
        data-testid="set-target"
        className="inline-flex h-9 items-center gap-space-1 rounded-full bg-arm-gold px-space-4 font-heading text-body font-medium text-near-black"
      >
        <Icon name="star" size={18} />
        {explore.setTargetCta}
      </span>
      {/* Right-positioned, so the affordance points right (onward to the role's careers), matching
          the other "Explore … →" controls rather than a left-back chevron on the right edge. */}
      <button
        type="button"
        onClick={onBack}
        data-testid="job-overview-back"
        className="inline-flex h-9 items-center gap-space-1 rounded-full border border-glass-border px-space-3 font-body text-body text-text-on-dark transition-colors hover:bg-glass-fill"
      >
        {fill(explore.overviewBack, { role: detail.roleName })}
        <Icon name="arrow-r" size={18} />
      </button>
    </>
  );

  return (
    <ResultsPanel controlBar={controlBar}>
      <div className="mx-auto flex w-full max-w-results flex-col gap-space-5" data-testid="job-overview">
        <header>
          <p className="font-body text-small text-text-on-dark-faint">
            {fill(explore.jobEyebrow, { role: detail.roleName })}
          </p>
          {/* Title + tier pill in a justify-between row (reference parity): the level pill on the
              right lightly reinforces the rung framing (Entry level / Mid level / Planning). */}
          <div className="mt-space-1 flex items-start justify-between gap-space-3">
            <h1 className="font-heading text-h2 text-text-on-dark">{job.title}</h1>
            <span className="mt-space-1 shrink-0 rounded-full border border-glass-border bg-glass-fill px-space-3 py-space-1 font-body text-small text-text-on-dark-muted">
              {detail.tierLabel}
            </span>
          </div>
        </header>

        <div className="flex gap-space-5 border-b border-glass-border" role="tablist">
          {explore.overviewTabs.map((label, i) => {
            const active = tab === i;
            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(i)}
                data-testid={`job-overview-tab-${i}`}
                className={`-mb-px border-b-2 pb-space-3 font-heading text-body transition-colors ${
                  active
                    ? 'border-text-on-dark font-bold text-text-on-dark'
                    : 'border-transparent font-medium text-text-on-dark-faint hover:text-text-on-dark-muted'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {tab === 0 ? (
          <div className="flex flex-col gap-space-5">
            <section>
              <h2 className="font-heading text-h5 text-text-on-dark">{copy.descriptionHeading}</h2>
              <p className="mt-space-2 font-body text-body text-text-on-dark-muted">{job.summary}</p>
            </section>
            <div className="flex flex-col gap-space-3 sm:flex-row">
              <StatBox label={copy.salaryLabel}>
                <p className="font-heading text-h4 text-text-on-dark">
                  {job.salaryMedian ?? detail.salaryMedian}
                </p>
              </StatBox>
              <StatBox label={copy.educationLabel}>
                <EducationList education={job.education ?? detail.education} />
              </StatBox>
            </div>
            <section>
              <h2 className="font-heading text-h5 text-text-on-dark">{explore.responsibilitiesHeading}</h2>
              <ul className="mt-space-3 flex flex-col gap-space-2">
                {job.responsibilities.map((item) => (
                  <li key={item} className="flex gap-space-2 font-body text-body text-text-on-dark-muted">
                    <span className="text-text-on-dark-faint">&bull;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : tab === 1 ? (
          <div className="flex flex-col gap-space-6">
            <section>
              <h2 className="font-heading text-h5 text-text-on-dark">{copy.competenciesHeading}</h2>
              <div className="mt-space-3 grid grid-cols-1 gap-space-2 sm:grid-cols-2">
                {detail.competencies.map((competency) => (
                  <div
                    key={competency}
                    className="flex items-center gap-space-2 font-body text-body text-text-on-dark-muted"
                  >
                    <Icon name="check" size={18} className="shrink-0 text-text-on-dark-faint" />
                    {competency}
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="font-heading text-h5 text-text-on-dark">{explore.jobSkillsHeading}</h2>
              <div className="mt-space-3 flex flex-wrap gap-space-1">
                {job.skills.map((skill) => (
                  <Chip key={skill}>{skill}</Chip>
                ))}
              </div>
            </section>
            <section>
              <h2 className="font-heading text-h5 text-text-on-dark">{explore.closeGapHeading}</h2>
              <p className="mt-space-1 font-body text-small text-text-on-dark-faint">
                {explore.closeGapSubtitle}
              </p>
              <div className="mt-space-3 flex flex-col gap-space-2">
                {programs.map((program) => (
                  <BridgeProgramRow key={program.title} program={program} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="flex flex-col gap-space-5">
            <section>
              <h2 className="font-heading text-h5 text-text-on-dark">
                {fill(explore.youAsHeading, { noun: job.roleNoun ?? job.title })}
              </h2>
              <p className="mt-space-2 font-body text-body text-text-on-dark-muted">
                {fill(fitNarrative[detail.categoryId], { noun: job.roleNoun ?? job.title })}
              </p>
            </section>
            <section>
              <h2 className="font-heading text-h5 text-text-on-dark">{explore.trajectoryHeading}</h2>
              <div className="mt-space-3">
                <TrajectoryViz category={detail.categoryId} />
              </div>
            </section>
          </div>
        )}
      </div>
    </ResultsPanel>
  );
}
