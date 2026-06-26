import { flowList, flows } from '@/data/flows';
import { roleDetails } from '@/data/roleDetails';
import type { CategoryFlow } from '@/data/types';
import { CATEGORIES } from '@/data/types';
import { computeCategoryMax } from '@/lib/categoryScoring';

// Guards every §17 flow invariant. Imports LIVE data so any bad content edit fails loudly
// here. The flow-shape checks run per category flow (narrative only after the strip); the
// cross-flow checks cover the role-detail ladders the results + screener-fit read.

const categoryFlows: CategoryFlow[] = flowList;

describe.each(categoryFlows)('§17 flow invariants — $name', (flow) => {
  const steps = flow.steps;
  const stepIds = steps.map((s) => s.id);

  it('has unique step ids', () => {
    expect(new Set(stepIds).size).toBe(stepIds.length);
  });

  it('resolves every branch target to a real, later step (forward-only)', () => {
    steps.forEach((step, index) => {
      if (step.type !== 'mc') return;
      for (const choice of step.choices) {
        if (choice.branchTo === undefined) continue;
        const target = stepIds.indexOf(choice.branchTo);
        expect(target, `${step.id} → ${choice.branchTo}`).toBeGreaterThan(index);
      }
    });
  });

  it('gives every scene exactly three choices covering all three roles', () => {
    for (const step of steps) {
      if (step.type !== 'scene') continue;
      expect(step.choices, step.id).toHaveLength(3);
      expect(new Set(step.choices.map((c) => c.category)), step.id).toEqual(new Set(CATEGORIES));
    }
  });

  it('keeps choice ids unique within the flow', () => {
    const ids = steps.flatMap((step) => step.choices.map((c) => c.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('matches the declared expectedCategoryMax against the computed full-path max', () => {
    expect(computeCategoryMax(steps)).toEqual(flow.expectedCategoryMax);
  });

  it('has complete, non-empty owned copy (landing + results)', () => {
    const strings = [
      ...Object.values(flow.landingCopy),
      flow.resultsCopy.heading,
      flow.resultsCopy.mapHint,
      flow.resultsCopy.centerLabel,
      flow.resultsCopy.retake,
      ...Object.values(flow.resultsCopy.sheet),
    ];
    for (const value of strings) {
      expect(typeof value).toBe('string');
      expect(value.trim()).not.toBe('');
    }
  });
});

describe('§17 narrative flow shape', () => {
  const narrative = flows.narrative as CategoryFlow;

  it('has exactly 7 scenes after the intro questions', () => {
    expect(narrative.steps.filter((s) => s.type === 'scene')).toHaveLength(7);
    // Six intro MC steps as of the V3 language pass: the new unscored Q0 (experience)
    // ahead of the original Q1–Q5.
    expect(narrative.steps.filter((s) => s.type === 'mc')).toHaveLength(6);
  });
});

describe('§17 cross-flow invariants', () => {
  it('gives every flow a unique id and a researcher-facing name', () => {
    expect(new Set(flowList.map((f) => f.id)).size).toBe(flowList.length);
    for (const flow of flowList) expect(flow.name.trim()).not.toBe('');
  });

  it('registers every flow in the map under its own id', () => {
    for (const flow of flowList) expect(flows[flow.id]).toBe(flow);
  });

  it('provides a role detail for every category with full sheet content', () => {
    for (const category of CATEGORIES) {
      const detail = roleDetails[category];
      expect(detail.categoryId).toBe(category);
      for (const value of [detail.roleName, detail.description, detail.education, detail.salary]) {
        expect(value.trim()).not.toBe('');
      }
      expect(detail.jobActivities.length).toBeGreaterThan(0);
      expect(detail.commonJobTitles.length).toBeGreaterThan(0);
    }
  });

  it('gives every role detail an education and pay level in 0..2 (screener fit, D-020)', () => {
    for (const category of CATEGORIES) {
      const detail = roleDetails[category];
      for (const level of [detail.educationLevel, detail.payLevel]) {
        expect(Number.isInteger(level), category).toBe(true);
        expect(level).toBeGreaterThanOrEqual(0);
        expect(level).toBeLessThanOrEqual(2);
      }
    }
  });

  it('maps the three role names onto three distinct roles', () => {
    const names = CATEGORIES.map((c) => roleDetails[c].roleName);
    expect(new Set(names).size).toBe(3);
  });
});
