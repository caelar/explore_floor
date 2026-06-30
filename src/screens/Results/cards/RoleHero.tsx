import { Icon } from '@/components/Icon';
import type { CategoryId, CategoryWeights, ResultsCardsCopy, RoleDetail } from '@/data/types';
import type { CategoryContribution } from '@/lib/categoryBreakdown';
import type { FitLine } from '@/lib/screenerFit';

import { fill } from './copy';
import { SignalBars } from './SignalBars';
import { WhyYouMatched } from './WhyYouMatched';

// The results role hero (D-029 Phase C): match label + position, the role name + match %, the
// per-role signal bars, and the inline "why you matched" block, flanked by prev/next role arrows.
// Faithful to the mockup: the role name and % are neutral on dark (the accent lives in the active
// signal bar), sentence-case labels, tokens only.

interface RoleHeroProps {
  copy: ResultsCardsCopy;
  detail: RoleDetail;
  rank: number;
  roleCount: number;
  ranking: CategoryId[];
  matchPercentages: CategoryWeights;
  pct: number;
  contribution: CategoryContribution;
  fitLines: FitLine[];
  isTopMatch: boolean;
  expanded: boolean;
  reduce: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  atStart: boolean;
  atEnd: boolean;
}

export function RoleHero(props: RoleHeroProps) {
  const { copy, detail, rank, roleCount, ranking, matchPercentages, pct, contribution } = props;
  const matchLabel = copy.matchLabels[rank] ?? copy.matchLabels[copy.matchLabels.length - 1];

  return (
    <div className="flex items-start justify-center gap-space-2">
      <HeroArrow dir="prev" disabled={props.atStart} onClick={props.onPrev} />

      <div className="relative min-w-0 max-w-results flex-1 rounded-lg border border-glass-border-soft bg-glass-fill p-space-4">
        <div className="flex items-center justify-between gap-space-3">
          <p className="font-body text-small text-text-on-dark-faint">{matchLabel}</p>
          <p className="font-body text-small text-text-on-dark-muted">
            {fill(copy.stepLabel, { index: rank + 1, total: roleCount })}
          </p>
        </div>

        <div className="mt-space-1 flex items-end justify-between gap-space-2">
          <h2 className="font-heading text-h2 text-text-on-dark" data-testid="role-name">
            {detail.roleName}
          </h2>
          <span
            className="font-heading text-h3 text-text-on-dark"
            data-testid={`match-pct-${detail.categoryId}`}
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
            contribution={contribution}
            fitLines={props.fitLines}
            pct={pct}
            isTopMatch={props.isTopMatch}
            expanded={props.expanded}
            reduce={props.reduce}
            onToggle={props.onToggle}
          />
        </div>
      </div>

      <HeroArrow dir="next" disabled={props.atEnd} onClick={props.onNext} />
    </div>
  );
}

function HeroArrow({
  dir,
  disabled,
  onClick,
}: {
  dir: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={dir === 'prev' ? 'Previous role' : 'Next role'}
      data-testid={`role-${dir}`}
      // mt aligns the arrow's vertical centre with the role-name / % title row (reference parity: the
      // gutter arrows sit level with the title so the "step through roles" affordance reads clearly).
      className={`mt-space-6 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-glass-border transition-colors disabled:pointer-events-none ${
        disabled
          ? 'bg-glass-fill text-text-on-dark-faint opacity-50'
          : 'bg-glass-fill text-text-on-dark hover:bg-glass-fill-strong'
      }`}
    >
      <Icon name={dir === 'prev' ? 'chevron-l' : 'chevron-r'} size={24} />
    </button>
  );
}
