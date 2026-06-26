import type { BucketId, CategoryFlow, FlowStep, LandingCopy } from '@/data/types';
import {
  calculateCategoryScores,
  computeCategoryMax,
  MAYBE_WEIGHT,
} from '@/lib/categoryScoring';

// Small fixture flows — the unit contract is independent of the authored content
// (data-integrity covers the real flow). Shapes mirror the narrative spec: a branching
// intro and per-choice scene sorts, scored across the three roles.

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
      // A two-role tag, like the narrative's "$85,000+" → specialist + integrator.
      { id: 'hands', label: 'Doing hands-on work', categories: ['technician', 'specialist'] },
      { id: 'typing', label: 'Typing on a computer', categories: ['specialist'] },
      { id: 'leading', label: 'Leading others', categories: ['integrator'] },
    ],
  },
  {
    type: 'scene',
    id: 's1',
    prompt: 'Your alarm goes off.',
    question: 'How do you start the day?',
    choices: [
      { id: 's1-integrator', label: 'Planned outfit', category: 'integrator' },
      { id: 's1-technician', label: 'Help make breakfast', category: 'technician' },
      { id: 's1-specialist', label: 'To-do list', category: 'specialist' },
    ],
  },
];

/** A scene used as a multi-choice sort fixture (several choices per role). */
const sortSteps: FlowStep[] = [
  {
    type: 'scene',
    id: 'sort',
    prompt: 'Around the house.',
    question: 'Which sounds like you?',
    choices: [
      { id: 'st-1', label: 'Fix your bike', category: 'technician' },
      { id: 'st-2', label: 'Prototyping cool things', category: 'specialist' },
      { id: 'st-3', label: 'Planning events', category: 'integrator' },
      { id: 'st-4', label: 'Watching for problems', category: 'technician' },
      { id: 'st-5', label: 'Debugging code', category: 'specialist' },
    ],
  },
];

describe('computeCategoryMax', () => {
  it('counts an MC step once per role present in its choices, not per choice', () => {
    // Two integrator-mapped choices in one single-select step must still cap integrator at 1.
    const max = computeCategoryMax([
      {
        type: 'mc',
        id: 'q',
        question: 'Fulfillment?',
        choices: [
          { id: 'a', label: 'Inspiring others', categories: ['integrator'] },
          { id: 'b', label: 'Earning money', categories: ['integrator'] },
          { id: 'c', label: 'Hands-on work', categories: ['technician'] },
          { id: 'd', label: 'Solving problems', categories: ['specialist'] },
        ],
      },
    ]);
    expect(max).toEqual({ technician: 1, specialist: 1, integrator: 1 });
  });

  it('adds one per role for a scene and one per scene choice', () => {
    const max = computeCategoryMax([...branchingSteps, ...sortSteps]);
    // q3 (tech 1, spec 1, int 1) + scene s1 (1 each) + sort scene (tech 2, spec 2, int 1).
    expect(max).toEqual({ technician: 4, specialist: 4, integrator: 3 });
  });
});

describe('calculateCategoryScores', () => {
  it('tallies a scored MC answer into every role the choice maps to', () => {
    const result = calculateCategoryScores(
      makeFlow(branchingSteps),
      { q1: 'yes', q2: 'typical', q3: 'hands' },
      { 's1-integrator': 'thats-me' },
    );
    // hands → technician + specialist; the scene's integrator choice → integrator.
    expect(result.raw).toEqual({ technician: 1, specialist: 1, integrator: 1 });
  });

  it('normalizes each role against its own max on the path taken', () => {
    const result = calculateCategoryScores(
      makeFlow(branchingSteps),
      { q1: 'yes', q2: 'typical', q3: 'typing' },
      { 's1-specialist': 'thats-me' },
    );
    // specialist: 2 of 2 on this path (q3 typing + the scene's specialist choice); others 0.
    expect(result.matchPercentages).toEqual({ technician: 0, specialist: 100, integrator: 0 });
    expect(result.primaryCategory).toBe('specialist');
  });

  it('buckets each scene choice independently — several roles (or none) can score', () => {
    // No path: q1 no → q3 (skips q2). The scene has one choice per role; bucket them
    // separately — a scene is no longer a single pick (D-018).
    const result = calculateCategoryScores(
      makeFlow(branchingSteps),
      { q1: 'no', q3: 'leading' },
      {
        's1-technician': 'thats-me',
        's1-specialist': 'maybe', // scores MAYBE_WEIGHT
        's1-integrator': 'not-me',
      },
    );
    // q3 leading → integrator; scene: technician +1, specialist +MAYBE_WEIGHT, integrator +0.
    expect(result.raw).toEqual({ technician: 1, specialist: MAYBE_WEIGHT, integrator: 1 });
  });

  it('excludes branched-over steps from raw and max (the No path skips q2)', () => {
    const flow = makeFlow(branchingSteps);
    const buckets: Record<string, BucketId> = { 's1-integrator': 'thats-me' };
    const noPath = calculateCategoryScores(flow, { q1: 'no', q3: 'leading' }, buckets);
    const yesPath = calculateCategoryScores(
      flow,
      { q1: 'yes', q2: 'short', q3: 'leading' },
      buckets,
    );
    // q2 is unscored, so both paths see identical role ceilings — but the walk itself must
    // not visit q2 on the No path (robust to q2 gaining weights later).
    expect(noPath.matchPercentages).toEqual(yesPath.matchPercentages);
    expect(noPath.raw).toEqual({ technician: 0, specialist: 0, integrator: 2 });
  });

  it("scores scene buckets: that's-me = 1, not-me = 0, maybe = MAYBE_WEIGHT", () => {
    const buckets: Record<string, BucketId> = {
      'st-1': 'thats-me',
      'st-2': 'not-me',
      'st-3': 'maybe',
      'st-4': 'thats-me',
      'st-5': 'not-me',
    };
    const result = calculateCategoryScores(makeFlow(sortSteps), {}, buckets);
    expect(result.raw).toEqual({
      technician: 2,
      specialist: 0,
      integrator: MAYBE_WEIGHT,
    });
    // With MAYBE_WEIGHT = 0 today, a maybe must not move the percentage.
    expect(result.matchPercentages.integrator).toBe(Math.round((MAYBE_WEIGHT / 1) * 100));
  });

  it('keeps the maybe weight tunable — the tally formula honors a non-zero value', () => {
    // Guards the tunability contract without asserting the current constant:
    // raw.integrator is exactly MAYBE_WEIGHT (st-3 is the only integrator choice, bucketed maybe).
    const result = calculateCategoryScores(makeFlow(sortSteps), {}, { 'st-3': 'maybe' });
    expect(result.raw.integrator).toBe(MAYBE_WEIGHT);
    expect(MAYBE_WEIGHT).toBeGreaterThanOrEqual(0);
    expect(MAYBE_WEIGHT).toBeLessThanOrEqual(1);
  });

  it('treats unanswered choices as not-me', () => {
    const result = calculateCategoryScores(makeFlow(sortSteps), {}, { 'st-1': 'thats-me' });
    expect(result.raw).toEqual({ technician: 1, specialist: 0, integrator: 0 });
    expect(result.matchPercentages.technician).toBe(50); // 1 of 2 technician choices
  });

  it('saturates to 100s when everything is answered in favor', () => {
    const buckets: Record<string, BucketId> = Object.fromEntries(
      sortSteps[0].type === 'scene'
        ? sortSteps[0].choices.map((c) => [c.id, 'thats-me' as BucketId])
        : [],
    );
    const result = calculateCategoryScores(makeFlow(sortSteps), {}, buckets);
    expect(result.matchPercentages).toEqual({ technician: 100, specialist: 100, integrator: 100 });
  });

  it('returns all zeros and a deterministic ranking when nothing is answered', () => {
    const result = calculateCategoryScores(makeFlow(branchingSteps), {}, {});
    expect(result.matchPercentages).toEqual({ technician: 0, specialist: 0, integrator: 0 });
    expect(result.ranking).toEqual(['technician', 'specialist', 'integrator']);
    expect(result.primaryCategory).toBe('technician');
  });

  it('orders ranking best-first with the stable technician > specialist > integrator tiebreak', () => {
    const result = calculateCategoryScores(makeFlow(sortSteps), {}, {
      'st-2': 'thats-me', // specialist
      'st-5': 'thats-me', // specialist 2/2 = 100
      'st-1': 'thats-me', // technician 1/2 = 50
    });
    expect(result.ranking).toEqual(['specialist', 'technician', 'integrator']);
    expect(result.primaryCategory).toBe('specialist');
    const [a, b, c] = result.ranking;
    expect(result.matchPercentages[a]).toBeGreaterThanOrEqual(result.matchPercentages[b]);
    expect(result.matchPercentages[b]).toBeGreaterThanOrEqual(result.matchPercentages[c]);
  });

  it('ignores answers that reference unknown choices', () => {
    const result = calculateCategoryScores(makeFlow(branchingSteps), { q3: 'nonsense' }, {});
    expect(result.raw).toEqual({ technician: 0, specialist: 0, integrator: 0 });
  });

  it('is pure — identical input yields a deeply equal result', () => {
    const flow = makeFlow(branchingSteps);
    const answers = { q1: 'no', q3: 'hands' };
    const buckets: Record<string, BucketId> = { 's1-technician': 'thats-me' };
    expect(calculateCategoryScores(flow, answers, buckets)).toEqual(
      calculateCategoryScores(flow, answers, buckets),
    );
  });
});
