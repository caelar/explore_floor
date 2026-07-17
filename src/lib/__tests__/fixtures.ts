import type {
  CategoryFlow,
  FlowStep,
  LandingCopy,
  ResultsCardsCopy,
} from '@/data/types';
import { computeCategoryMax } from '@/lib/categoryScoring';

// Shared unit-test fixtures. The unit contracts (scoring, breakdown) are independent of the
// authored content (data-integrity covers the real flow), so these are deliberately tiny
// placeholder strings. Shapes mirror the narrative spec.

export const landingCopyFixture: LandingCopy = {
  overline: 'o',
  heading: 'h',
  description: 'd',
  cta: 'c',
};

const cardsCopyFixture: ResultsCardsCopy = {
  matchLabels: ['top', 'second', 'third'],
  stepLabel: '{index} of {total}',
  compareCta: 'compare',
  mapCta: 'map',
  exploreCta: 'explore',
  whyHeading: 'Why {role}?',
  collapsedLine: '{pointed}/{total} {role}{moreThanAny} {pct}',
  moreThanAny: ', most',
  seeBreakdown: 'see',
  hideBreakdown: 'hide',
  chosenLabel: 'chose',
  moreAnswers: '+{n} more',
  connectLabel: 'connect',
  openerNoun: 'opener',
  openersLabel: 'School & pay',
  momentNoun: 'moment',
  meaningLabel: 'means',
  meaningText: '{pointed}/{total} {role}{moreThanAny} {pct}',
  passedLabel: 'passed',
  passedCountLabel: '{passed} of {total}',
  passedText: '{passedExamples} {passed} {role} {pct}',
  passedExample: ', like {a} and {b}',
  roleTab: 'role',
  skillsTab: 'skills',
  descriptionHeading: 'desc',
  dutiesHeading: 'duties',
  competenciesHeading: 'comp',
  bridgeHeading: 'bridge',
  bridgeSubtitle: 'sub',
  salaryLabel: 'Salary',
  educationLabel: 'Education',
  backToRole: 'Back to {role}',
  compareWithLabel: 'Compare with',
  recommendationLabel: 'Our take',
  recommendation: {
    clearWinner: '{high} {low}',
    closeLowerBarrier: '{lowBarrier} {growToward}',
    closeEqualBarrier: '{high}',
  },
  backToMap: 'back to map',
  exploreRoleCta: 'Explore {role} careers',
  map: {
    title: 'your results',
    intro: 'intro',
    hint: 'hint',
  },
  explore: {
    jobsInPathHeading: 'jobs',
    jobsInPathCount: '{n} roles',
    roleOverviewCta: 'role overview',
    allPathsBack: 'all paths',
    jobEyebrow: 'Job in {role}',
    jobOverviewCta: 'job overview',
    responsibilitiesHeading: 'do',
    overviewBack: 'back',
    setTargetCta: 'set target',
    currentTargetCta: 'current target',
    overviewTabs: ['overview', 'skills', 'fit'],
    jobSkillsHeading: 'job skills',
    closeGapHeading: 'close gap',
    closeGapSubtitle: 'sub',
    youAsHeading: 'You as a {noun}',
    trajectoryHeading: 'where this leads',
    trajectoryCrossRole: '{role} path',
  },
};

export const resultsCopyFixture = {
  heading: 'h',
  mapHint: 'm',
  centerLabel: 'c',
  retake: 'r',
  cards: cardsCopyFixture,
  sheet: { activities: 'a', education: 'e', titles: 't', salary: 's', fit: 'f', addToProfile: 'p' },
};

export const makeFlow = (steps: FlowStep[]): CategoryFlow => ({
  id: 'narrative',
  kind: 'narrative',
  name: 'Fixture',
  landingCopy: landingCopyFixture,
  resultsCopy: resultsCopyFixture,
  steps,
  expectedCategoryMax: computeCategoryMax(steps),
});
