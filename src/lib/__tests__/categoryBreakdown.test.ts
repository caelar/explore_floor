import type { BucketId, CategoryFlow, FlowStep, LandingCopy } from '@/data/types';
import { categoryContributions } from '@/lib/categoryBreakdown';
import { computeCategoryMax } from '@/lib/categoryScoring';

// Fixtures mirror the exam flow shape (one mapped MC + a statement sort), which is the
// only flow that renders the breakdown. Real content is covered by data-integrity.

const landingCopy: LandingCopy = { overline: 'o', heading: 'h', description: 'd', cta: 'c' };
const resultsCopy = {
  heading: 'h',
  mapHint: 'm',
  centerLabel: 'c',
  retake: 'r',
  sheet: { activities: 'a', education: 'e', titles: 't', salary: 's', fit: 'f', addToProfile: 'p' },
};

const makeFlow = (steps: FlowStep[]): CategoryFlow => ({
  id: 'narrative',
  kind: 'exam',
  name: 'Fixture',
  landingCopy,
  resultsCopy,
  steps,
  expectedCategoryMax: computeCategoryMax(steps),
});

const steps: FlowStep[] = [
  {
    type: 'mc',
    id: 'q',
    question: 'Tech?',
    choices: [
      { id: 'q-prog', label: 'Coding it', categories: ['program'] },
      { id: 'q-op', label: 'Running it', categories: ['operate'] },
    ],
  },
  {
    type: 'statementSort',
    id: 'sort',
    buckets: [
      { id: 'thats-me', label: "That's me" },
      { id: 'maybe', label: 'Maybe' },
      { id: 'not-me', label: 'Not me' },
    ],
    statements: [
      { id: 's-prog-1', label: 'Building a website', category: 'program' },
      { id: 's-prog-2', label: 'Debugging code', category: 'program' },
      { id: 's-rep-1', label: 'Fixing a chair', category: 'repair' },
      { id: 's-op-1', label: 'Watching for problems', category: 'operate' },
    ],
  },
];

describe('categoryContributions', () => {
  it('lists the statements marked "that\'s me" as earned, with n-of-m counts', () => {
    const buckets: Record<string, BucketId> = {
      's-prog-1': 'thats-me',
      's-prog-2': 'not-me',
      's-rep-1': 'thats-me',
    };
    const result = categoryContributions(makeFlow(steps), {}, buckets);
    expect(result.program.earned).toEqual(['Building a website']);
    expect(result.program.earnedCount).toBe(1);
    expect(result.program.totalCount).toBe(3); // q (program) + 2 program statements
    expect(result.repair.earned).toEqual(['Fixing a chair']);
    expect(result.repair.totalCount).toBe(1);
  });

  it('separates maybe statements from earned ones (maybe earns nothing today)', () => {
    const result = categoryContributions(makeFlow(steps), {}, { 's-prog-1': 'maybe' });
    expect(result.program.earned).toEqual([]);
    expect(result.program.maybe).toEqual(['Building a website']);
    expect(result.program.earnedCount).toBe(0);
  });

  it('breaks a scene down by bucket like statements (earned vs on-the-fence)', () => {
    const sceneFlow = makeFlow([
      {
        type: 'scene',
        id: 's',
        prompt: 'p',
        question: 'q',
        choices: [
          { id: 's-op', label: 'Walk my dog', category: 'operate' },
          { id: 's-rep', label: 'Make breakfast', category: 'repair' },
          { id: 's-prog', label: 'To-do list', category: 'program' },
          { id: 's-plan', label: 'Planned outfit', category: 'plan' },
        ],
      },
    ]);
    const result = categoryContributions(sceneFlow, {}, {
      's-op': 'thats-me',
      's-rep': 'maybe',
      's-prog': 'not-me',
    });
    expect(result.operate.earned).toEqual(['Walk my dog']);
    expect(result.operate.earnedCount).toBe(1);
    expect(result.repair.maybe).toEqual(['Make breakfast']);
    expect(result.repair.earned).toEqual([]);
    expect(result.program.earned).toEqual([]);
    expect(result.plan.totalCount).toBe(1); // every scene choice counts toward its max
  });

  it('counts a chosen scored MC pick as an earned contribution for its category', () => {
    const result = categoryContributions(makeFlow(steps), { q: 'q-prog' }, {});
    expect(result.program.earned).toContain('Coding it');
    expect(result.program.earnedCount).toBe(1);
    expect(result.operate.earned).toEqual([]); // q-op not chosen
  });

  it('feeds every category the choice maps to when a pick maps to two', () => {
    const twoWay = makeFlow([
      {
        type: 'mc',
        id: 'm',
        question: 'Day?',
        choices: [{ id: 'm-hands', label: 'Hands-on work', categories: ['operate', 'repair'] }],
      },
    ]);
    const result = categoryContributions(twoWay, { m: 'm-hands' }, {});
    expect(result.operate.earned).toEqual(['Hands-on work']);
    expect(result.repair.earned).toEqual(['Hands-on work']);
  });

  it('returns an entry for every category, empty where nothing contributed', () => {
    const result = categoryContributions(makeFlow(steps), {}, {});
    for (const category of ['operate', 'repair', 'program', 'plan'] as const) {
      expect(result[category].earned).toEqual([]);
      expect(result[category].earnedCount).toBe(0);
    }
    expect(result.plan.totalCount).toBe(0); // no plan items in the fixture
  });

  it('is pure — identical input yields a deeply equal result', () => {
    const flow = makeFlow(steps);
    const buckets: Record<string, BucketId> = { 's-prog-1': 'thats-me' };
    expect(categoryContributions(flow, {}, buckets)).toEqual(
      categoryContributions(flow, {}, buckets),
    );
  });
});
