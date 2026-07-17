import { useState } from 'react';

import { Icon } from '@/components/Icon';
import { bridgePrograms, fitNarrative } from '@/data';
import { JOB_LEVEL_LABELS, type Job, ResultsCardsCopy, RoleDetail } from '@/data/types';

import { BridgeProgramRow } from './BridgeProgramRow';
import { Chip } from './Chip';
import { fill } from './copy';
import { JobEducationStat, JobSalaryStat } from './JobOverviewStats';
import { ResultsPanel } from './ResultsPanel';
import { TrajectoryViz } from './TrajectoryViz';

// Job description card on the career map (Figma 1386:494). Three tabs — job overview, skills and
// competencies, how you fit — with per-job copy from jobs.ts and role-level stats from roleDetails.

interface JobOverviewProps {
  copy: ResultsCardsCopy;
  detail: RoleDetail;
  job: Job;
  onBack: () => void;
  embedded?: boolean;
  onNavigateToJob?: (jobId: string) => void;
  isTargetRole?: boolean;
  onSetTargetRole?: () => void;
}

export function JobOverview({
  copy,
  detail,
  job,
  onBack,
  embedded = false,
  onNavigateToJob,
  isTargetRole = false,
  onSetTargetRole,
}: JobOverviewProps) {
  const explore = copy.explore;
  const [tab, setTab] = useState(0);
  const programs = bridgePrograms[detail.categoryId];
  const salaryMedian = job.salaryMedian ?? detail.salaryMedian;
  const educationCredential = job.education ?? detail.educationShort;
  const educationSubline = job.education ? undefined : detail.educationSubline;
  const roleNoun = job.roleNoun ?? job.title;

  const controlBar = (
    <>
      <button
        type="button"
        data-testid="set-target"
        aria-pressed={isTargetRole}
        onClick={() => onSetTargetRole?.()}
        disabled={!onSetTargetRole}
        className={`inline-flex h-9 items-center gap-space-1 rounded-full px-space-4 font-heading text-body font-medium transition-colors ${
          isTargetRole
            ? 'bg-arm-gold text-text-default'
            : 'bg-text-subtle text-arm-gold hover:bg-text-subtle/90'
        }`}
      >
        <Icon
          name="star"
          size={18}
          className={isTargetRole ? 'text-text-default' : 'text-arm-gold'}
        />
        {isTargetRole ? explore.currentTargetCta : explore.setTargetCta}
      </button>
      <button
        type="button"
        onClick={onBack}
        data-testid="job-overview-back"
        aria-label={fill(explore.overviewBack, { role: detail.roleName })}
        className="inline-flex size-6 items-center justify-center text-text-on-dark transition-colors hover:text-text-on-dark-muted"
      >
        <Icon name="close" size={24} />
      </button>
    </>
  );

  return (
    <ResultsPanel controlBar={controlBar} variant={embedded ? 'embedded' : 'floating'}>
      <div className="mx-auto flex w-full max-w-results flex-col gap-space-5" data-testid="job-overview">
        <header>
          <p className="font-body text-small text-text-on-dark-faint">
            {fill(explore.jobEyebrow, { role: detail.roleName })}
          </p>
          <h1 className="mt-space-1 font-heading text-h2 text-text-on-dark">{job.title}</h1>
          <span
            className="mt-space-2 inline-flex rounded-full border border-glass-border bg-glass-fill px-space-4 py-space-2 font-body text-small text-text-on-dark-muted"
            data-testid="job-level-pill"
          >
            {JOB_LEVEL_LABELS[job.seniority]}
          </span>
        </header>

        <div className="flex w-full justify-between border-b border-glass-border" role="tablist">
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
                className={`-mb-px border-b-2 pb-space-3 text-body transition-colors ${
                  active
                    ? 'border-text-on-dark font-heading font-bold text-text-on-dark'
                    : 'border-transparent font-body font-normal text-text-on-dark-faint hover:text-text-on-dark-muted'
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
              <JobSalaryStat label={copy.salaryLabel} median={salaryMedian} />
              <JobEducationStat
                label={copy.educationLabel}
                credential={educationCredential}
                subline={educationSubline}
              />
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
              <div className="mt-space-3 flex flex-wrap gap-space-2">
                {job.skills.map((skill) => (
                  <Chip key={skill} variant="job">
                    {skill}
                  </Chip>
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
                {fill(explore.youAsHeading, { noun: roleNoun })}
              </h2>
              <p className="mt-space-2 font-body text-body text-text-on-dark-muted">
                {fill(fitNarrative[detail.categoryId], { noun: roleNoun })}
              </p>
            </section>
            <section>
              <h2 className="font-heading text-h5 text-text-on-dark">{explore.trajectoryHeading}</h2>
              <div className="mt-space-3">
                <TrajectoryViz
                  job={job}
                  crossRoleLabel={explore.trajectoryCrossRole}
                  onSelectJob={
                    onNavigateToJob
                      ? (target) => {
                          if (target.id !== job.id) onNavigateToJob(target.id);
                        }
                      : undefined
                  }
                />
              </div>
            </section>
          </div>
        )}
      </div>
    </ResultsPanel>
  );
}
