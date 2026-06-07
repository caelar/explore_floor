import type { BucketId, CategoryFlow, FlowStep, LandingCopy } from '@/data/types';
import {
  calculateCategoryScores,
  computeCategoryMax,
  MAYBE_WEIGHT,
} from '@/lib/categoryScoring';

// Small fixture flows — the unit contract is independent of the authored content
// (data-integrity covers the real flows). Shapes mirror the narrative/exam specs.

const landingCopy: LandingCopy = {
  overline: 'o',
  heading: 'h',
  description: 'd',
  cta: 'c',
};

const resultsCopy = {
  heading: 'h',
  mapHint: 'm',
  centerLabel: 'c',
  retake: 'r',
  sheet: {
    activities: 'a',
    education: 'e',
    titles: 't',
    salary: 's',
    fit: 'f',
    addToProfile: 'p',
  },
};

const makeFlow = (steps: FlowStep[]): CategoryFlow => ({
  id: 'narrative',
  kind: 'narrative',
  name: 'Fixture',
  landingCopy,
  resultsCopy,
  steps,
  expectedCategoryMax: computeCategoryMax(steps),
});

/** Q1 branches: yes → q2, no → skips q2 to q3 (mirrors the narrative college question). */
const branchingSteps: FlowStep[] = [
  {
    type: 'mc',
    id: 'q1',
    question: 'Are you planning on going to college?',
    choices: [
      { id: 'yes', label: 'Yes', categories: [] },
      { id: 'no', label: 'No', categories: [], branchTo: 'q3' },
    ],
  },
  {
    type: 'mc',
    id: 'q2',
    question: 'How long?',
    choices: [
      { id: 'short', label: 'Little as possible', categories: [] },
      { id: 'typical', label: 'Typical', categories: [] },
    ],
  },
  {
    type: 'mc',
    id: 'q3',
    question: 'What would you be happy spending your day doing?',
    choices: [
      { id: 'hands', label: 'Doing hands-on work', categories: ['operate', 'repair'] },
      { id: 'typing', label: 'Typing on a computer', categories: ['program'] },
      { id: 'leading', label: 'Leading others', categories: ['plan'] },
    ],
  },
  {
    type: 'scene',
    id: 's1',
    prompt: 'Your alarm goes off.',
    question: 'How do you start the day?',
    choices: [
      { id: 's1-plan', label: 'Planned outfit', category: 'plan' },
      { id: 's1-repair', label: 'Help make breakfast', category: 'repair' },
      { id: 's1-program', label: 'To-do list', category: 'program' },
      { id: 's1-operate', label: 'Walk my dog', category: 'operate' },
    ],
  },
];

const sortSteps: FlowStep[] = [
  {
    type: 'statementSort',
    id: 'sort',
    buckets: [
      { id: 'thats-me', label: "That's me" },
      { id: 'maybe', label: 'Maybe' },
      { id: 'not-me', label: 'Not me' },
    ],
    statements: [
      { id: 'st-1', label: 'Fixing a chair', category: 'repair' },
      { id: 'st-2', label: 'Prototyping cool things', category: 'program' },
      { id: 'st-3', label: 'Planning events', category: 'plan' },
      { id: 'st-4', label: 'Watching for problems', category: 'operate' },
      { id: 'st-5', label: 'Debugging code', category: 'repair' },
    ],
  },
];

describe('computeCategoryMax', () => {
  it('counts an MC step once per category present in its choices, not per choice', () => {
    // Two plan-mapped choices in one single-select step must still cap plan at 1.
    const max = computeCategoryMax([
      {
        type: 'mc',
        id: 'q',
        question: 'Fulfillment?',
        choices: [
          { id: 'a', label: 'Inspiring others', categories: ['plan'] },
          { id: 'b', label: 'Earning money', categories: ['plan'] },
          { id: 'c', label: 'Helping people', categories: ['operate', 'repair'] },
          { id: 'd', label: 'Solving problems', categories: ['program'] },
        ],
      },
    ]);
    expect(max).toEqual({ operate: 1, repair: 1, program: 1, plan: 1 });
  });

  it('adds one to every category for a scene and one per statement category', () => {
    const max = computeCategoryMax([...branchingSteps, ...sortSteps]);
    // q3 (1 each) + scene (1 each) + statements (repair 2, program 1, plan 1, operate 1)
    expect(max).toEqual({ operate: 3, repair: 4, program: 3, plan: 3 });
  });
});

describe('calculateCategoryScores', () => {
  it('tallies a scored MC answer into every category the choice maps to', () => {
    const result = calculateCategoryScores(makeFlow(branchingSteps), {
      q1: 'yes',
      q2: 'typical',
      q3: 'hands',
      s1: 's1-program',
    }, {});
    expect(result.raw).toEqual({ operate: 1, repair: 1, program: 1, plan: 0 });
  });

  it('normalizes each category against its own max on the path taken', () => {
    const result = calculateCategoryScores(makeFlow(branchingSteps), {
      q1: 'yes',
      q2: 'typical',
      q3: 'typing',
      s1: 's1-program',
    }, {});
    // program: 2 of 2 on this path; others 0.
    expect(result.matchPercentages).toEqual({ operate: 0, repair: 0, program: 100, plan: 0 });
    expect(result.primaryCategory).toBe('program');
  });

  it('excludes branched-over steps from raw and max (the No path skips q2)', () => {
    const flow = makeFlow(branchingSteps);
    const noPath = calculateCategoryScores(flow, { q1: 'no', q3: 'leading', s1: 's1-plan' }, {});
    const yesPath = calculateCategoryScores(
      flow,
      { q1: 'yes', q2: 'short', q3: 'leading', s1: 's1-plan' },
      {},
    );
    // q2 is unscored, so both paths see identical category ceilings — but the walk
    // itself must not visit q2 on the No path (robust to q2 gaining weights later).
    expect(noPath.matchPercentages).toEqual(yesPath.matchPercentages);
    expect(noPath.raw).toEqual({ operate: 0, repair: 0, program: 0, plan: 2 });
  });

  it("scores statement buckets: that's-me = 1, not-me = 0, maybe = MAYBE_WEIGHT", () => {
    const buckets: Record<string, BucketId> = {
      'st-1': 'thats-me',
      'st-2': 'not-me',
      'st-3': 'maybe',
      'st-4': 'thats-me',
      'st-5': 'not-me',
    };
    const result = calculateCategoryScores(makeFlow(sortSteps), {}, buckets);
    expect(result.raw).toEqual({
      operate: 1,
      repair: 1,
      program: 0,
      plan: MAYBE_WEIGHT,
    });
    // With MAYBE_WEIGHT = 0 today, a maybe must not move the percentage.
    expect(result.matchPercentages.plan).toBe(Math.round((MAYBE_WEIGHT / 1) * 100));
  });

  it('keeps the maybe weight tunable — the tally formula honors a non-zero value', () => {
    // Guards the tunability contract without asserting the current constant:
    // raw.plan is exactly MAYBE_WEIGHT (st-3 is the only plan statement, bucketed maybe).
    const result = calculateCategoryScores(makeFlow(sortSteps), {}, { 'st-3': 'maybe' });
    expect(result.raw.plan).toBe(MAYBE_WEIGHT);
    expect(MAYBE_WEIGHT).toBeGreaterThanOrEqual(0);
    expect(MAYBE_WEIGHT).toBeLessThanOrEqual(1);
  });

  it('treats unanswered statements as not-me', () => {
    const result = calculateCategoryScores(makeFlow(sortSteps), {}, { 'st-1': 'thats-me' });
    expect(result.raw).toEqual({ operate: 0, repair: 1, program: 0, plan: 0 });
    expect(result.matchPercentages.repair).toBe(50); // 1 of 2 repair statements
  });

  it('saturates to 100s when everything is answered in favor', () => {
    const buckets: Record<string, BucketId> = Object.fromEntries(
      sortSteps[0].type === 'statementSort'
        ? sortSteps[0].statements.map((s) => [s.id, 'thats-me' as BucketId])
        : [],
    );
    const result = calculateCategoryScores(makeFlow(sortSteps), {}, buckets);
    expect(result.matchPercentages).toEqual({ operate: 100, repair: 100, program: 100, plan: 100 });
  });

  it('returns all zeros and a deterministic ranking when nothing is answered', () => {
    const result = calculateCategoryScores(makeFlow(branchingSteps), {}, {});
    expect(result.matchPercentages).toEqual({ operate: 0, repair: 0, program: 0, plan: 0 });
    expect(result.ranking).toEqual(['operate', 'repair', 'program', 'plan']);
    expect(result.primaryCategory).toBe('operate');
  });

  it('orders ranking best-first with the stable operate > repair > program > plan tiebreak', () => {
    const result = calculateCategoryScores(makeFlow(sortSteps), {}, {
      'st-2': 'thats-me', // program 1/1 = 100
      'st-1': 'thats-me', // repair 1/2 = 50
    });
    expect(result.ranking).toEqual(['program', 'repair', 'operate', 'plan']);
    expect(result.primaryCategory).toBe('program');
    const [a, b, c, d] = result.ranking;
    expect(result.matchPercentages[a]).toBeGreaterThanOrEqual(result.matchPercentages[b]);
    expect(result.matchPercentages[b]).toBeGreaterThanOrEqual(result.matchPercentages[c]);
    expect(result.matchPercentages[c]).toBeGreaterThanOrEqual(result.matchPercentages[d]);
  });

  it('ignores answers that reference unknown choices', () => {
    const result = calculateCategoryScores(makeFlow(branchingSteps), { q3: 'nonsense' }, {});
    expect(result.raw).toEqual({ operate: 0, repair: 0, program: 0, plan: 0 });
  });

  it('is pure — identical input yields a deeply equal result', () => {
    const flow = makeFlow(branchingSteps);
    const answers = { q1: 'no', q3: 'hands', s1: 's1-operate' };
    expect(calculateCategoryScores(flow, answers, {})).toEqual(
      calculateCategoryScores(flow, answers, {}),
    );
  });
});
