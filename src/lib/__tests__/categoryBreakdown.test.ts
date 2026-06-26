import type { BucketId, CategoryFlow, FlowStep, LandingCopy } from '@/data/types';
import { categoryContributions } from '@/lib/categoryBreakdown';
import { computeCategoryMax } from '@/lib/categoryScoring';

// Fixtures mirror the narrative flow shape (a mapped MC + a scene sort). Real content is
// covered by data-integrity. The breakdown is currently unwired — it's the match-explanation
// engine the high-fidelity results screen (step 8) will graft onto the narrative.

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
  kind: 'narrative',
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
      { id: 'q-spec', label: 'Coding it', categories: ['specialist'] },
      { id: 'q-tech', label: 'Running it', categories: ['technician'] },
    ],
  },
  {
    type: 'scene',
    id: 'sort',
    prompt: 'Around the house.',
    question: 'Which sounds like you?',
    choices: [
      { id: 's-spec-1', label: 'Building a website', category: 'specialist' },
      { id: 's-spec-2', label: 'Debugging code', category: 'specialist' },
      { id: 's-tech-1', label: 'Fixing a chair', category: 'technician' },
    ],
  },
];

describe('categoryContributions', () => {
  it('lists the choices marked "that\'s me" as earned, with n-of-m counts', () => {
    const buckets: Record<string, BucketId> = {
      's-spec-1': 'thats-me',
      's-spec-2': 'not-me',
      's-tech-1': 'thats-me',
    };
    const result = categoryContributions(makeFlow(steps), {}, buckets);
    expect(result.specialist.earned).toEqual(['Building a website']);
    expect(result.specialist.earnedCount).toBe(1);
    expect(result.specialist.totalCount).toBe(3); // q (specialist) + 2 specialist scene choices
    expect(result.technician.earned).toEqual(['Fixing a chair']);
    expect(result.technician.totalCount).toBe(2); // q (technician) + 1 technician scene choice
  });

  it('separates maybe choices from earned ones (maybe earns nothing today)', () => {
    const result = categoryContributions(makeFlow(steps), {}, { 's-spec-1': 'maybe' });
    expect(result.specialist.earned).toEqual([]);
    expect(result.specialist.maybe).toEqual(['Building a website']);
    expect(result.specialist.earnedCount).toBe(0);
  });

  it('breaks a scene down by bucket (earned vs on-the-fence)', () => {
    const sceneFlow = makeFlow([
      {
        type: 'scene',
        id: 's',
        prompt: 'p',
        question: 'q',
        choices: [
          { id: 's-tech', label: 'Fix your bike', category: 'technician' },
          { id: 's-spec', label: 'To-do list', category: 'specialist' },
          { id: 's-int', label: 'Planned outfit', category: 'integrator' },
        ],
      },
    ]);
    const result = categoryContributions(sceneFlow, {}, {
      's-tech': 'thats-me',
      's-spec': 'maybe',
      's-int': 'not-me',
    });
    expect(result.technician.earned).toEqual(['Fix your bike']);
    expect(result.technician.earnedCount).toBe(1);
    expect(result.specialist.maybe).toEqual(['To-do list']);
    expect(result.specialist.earned).toEqual([]);
    expect(result.integrator.earned).toEqual([]);
    expect(result.integrator.totalCount).toBe(1); // every scene choice counts toward its max
  });

  it('counts a chosen scored MC pick as an earned contribution for its role', () => {
    const result = categoryContributions(makeFlow(steps), { q: 'q-spec' }, {});
    expect(result.specialist.earned).toContain('Coding it');
    expect(result.specialist.earnedCount).toBe(1);
    expect(result.technician.earned).toEqual([]); // q-tech not chosen
  });

  it('feeds every role the choice maps to when a pick maps to two', () => {
    const twoWay = makeFlow([
      {
        type: 'mc',
        id: 'm',
        question: 'Day?',
        choices: [{ id: 'm-hands', label: 'Hands-on work', categories: ['technician', 'specialist'] }],
      },
    ]);
    const result = categoryContributions(twoWay, { m: 'm-hands' }, {});
    expect(result.technician.earned).toEqual(['Hands-on work']);
    expect(result.specialist.earned).toEqual(['Hands-on work']);
  });

  it('returns an entry for every role, empty where nothing contributed', () => {
    const result = categoryContributions(makeFlow(steps), {}, {});
    for (const category of ['technician', 'specialist', 'integrator'] as const) {
      expect(result[category].earned).toEqual([]);
      expect(result[category].earnedCount).toBe(0);
    }
    expect(result.integrator.totalCount).toBe(0); // no integrator items in the fixture
  });

  it('is pure — identical input yields a deeply equal result', () => {
    const flow = makeFlow(steps);
    const buckets: Record<string, BucketId> = { 's-spec-1': 'thats-me' };
    expect(categoryContributions(flow, {}, buckets)).toEqual(
      categoryContributions(flow, {}, buckets),
    );
  });
});
