import type { CategoryId, CategoryWeights, ResultsCardsCopy, RoleDetail } from '@/data/types';
import type { CategoryContribution } from '@/lib/categoryBreakdown';
import type { FitLine } from '@/lib/screenerFit';

import { SignalBars } from './SignalBars';
import { StatBox } from './StatBox';
import { WhyYouMatched } from './WhyYouMatched';

// One column of the compare screen (D-029 Phase D): a role's "overview first page," mirroring the
// cards hero + "The role" tab so the two roles read against each other in the same shape. Hero
// (match label, neutral name + %, signal bars active on this role, inline per-column "why you
// matched"), then role description, salary/education stat boxes, and "What you'll do" duties.
// Faithful to the mockup's compare column: no path-up callout (that stays a headline affordance),
// no tabs. Reuses SignalBars / WhyYouMatched / StatBox unchanged. Tokens only.

interface CompareColumnProps {
  copy: ResultsCardsCopy;
  detail: RoleDetail;
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  pct: number;
  /** This role's rank (0 = top match) for the match label. */
  rank: number;
  contribution: CategoryContribution;
  fitLines: FitLine[];
  isTopMatch: boolean;
  expanded: boolean;
  reduce: boolean;
  onToggle: () => void;
}

export function CompareColumn(props: CompareColumnProps) {
  const { copy, detail, ranking, matchPercentages, pct, rank } = props;
  const matchLabel = copy.matchLabels[rank] ?? copy.matchLabels[copy.matchLabels.length - 1];
  const educationLines = detail.education.split(' or ');

  return (
    <div className="flex flex-col gap-space-5" data-testid="compare-column">
      <div className="rounded-lg border border-glass-border-soft bg-glass-fill p-space-4">
        <p className="font-body text-small text-text-on-dark-faint">{matchLabel}</p>
        <div className="mt-space-1 flex items-end justify-between gap-space-2">
          <h3 className="font-heading text-h3 text-text-on-dark" data-testid="compare-role-name">
            {detail.roleName}
          </h3>
          <span
            className="font-heading text-h4 text-text-on-dark"
            data-testid={`compare-match-pct-${detail.categoryId}`}
          >
            {pct}%
          </span>
        </div>

        <div className="mt-space-3">
          <SignalBars
            order={ranking}
            matchPercentages={matchPercentages}
            activeCategory={detail.categoryId}
            reduce={props.reduce}
          />
        </div>

        <div className="mt-space-3 border-t border-glass-border-soft pt-space-3">
          <WhyYouMatched
            copy={copy}
            detail={detail}
            contribution={props.contribution}
            fitLines={props.fitLines}
            pct={pct}
            isTopMatch={props.isTopMatch}
            expanded={props.expanded}
            reduce={props.reduce}
            onToggle={props.onToggle}
          />
        </div>
      </div>

      <section>
        <h3 className="font-heading text-h5 text-text-on-dark">{copy.descriptionHeading}</h3>
        <p className="mt-space-2 font-body text-body text-text-on-dark-muted">{detail.description}</p>
      </section>

      <div className="flex flex-col gap-space-3 sm:flex-row">
        <StatBox label={copy.salaryLabel}>
          <p className="font-heading text-h4 text-text-on-dark">{detail.salaryMedian}</p>
        </StatBox>
        <StatBox label={copy.educationLabel}>
          <ul className="flex flex-col gap-space-1">
            {educationLines.map((line) => (
              <li key={line} className="flex gap-space-2 font-body text-body text-text-on-dark-muted">
                <span className="text-text-on-dark-muted">&bull;</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
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
