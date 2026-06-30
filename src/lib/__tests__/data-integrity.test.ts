import { bridgePrograms } from '@/data/bridgePrograms';
import { flowList, flows } from '@/data/flows';
import { jobs } from '@/data/jobs';
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

  it('has complete, non-empty owned copy (landing + results, incl. the dark cards copy)', () => {
    // The cards copy is mostly flat strings (+ the matchLabels array); the compare
    // recommendation, the Phase E map block, and the Phase F explore block are nested objects —
    // pull them out and check their values too (explore's overviewTabs array is flattened in).
    const { recommendation, map, explore, ...cardScalars } = flow.resultsCopy.cards;
    const strings = [
      ...Object.values(flow.landingCopy),
      flow.resultsCopy.heading,
      flow.resultsCopy.mapHint,
      flow.resultsCopy.centerLabel,
      flow.resultsCopy.retake,
      ...Object.values(flow.resultsCopy.sheet),
      // ResultsCardsCopy: scalar strings + the matchLabels array, flattened.
      ...Object.values(cardScalars).flat(),
      ...Object.values(recommendation),
      ...Object.values(map),
      ...Object.values(explore).flat(),
    ];
    for (const value of strings) {
      expect(typeof value).toBe('string');
      expect(value.trim()).not.toBe('');
    }
  });

  it('gives the cards copy three match labels (one per ranked role)', () => {
    expect(flow.resultsCopy.cards.matchLabels).toHaveLength(3);
  });

  it('gives the explore copy three job-overview tab labels', () => {
    expect(flow.resultsCopy.cards.explore.overviewTabs).toHaveLength(3);
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
      for (const value of [
        detail.roleName,
        detail.description,
        detail.education,
        detail.educationShort,
        detail.salary,
        detail.salaryShort,
      ]) {
        expect(value.trim()).not.toBe('');
      }
      expect(detail.jobActivities.length).toBeGreaterThan(0);
      expect(detail.commonJobTitles.length).toBeGreaterThan(0);
    }
  });

  it('gives every role authored duties + ARM competencies for the results cards (Phase C)', () => {
    for (const category of CATEGORIES) {
      const detail = roleDetails[category];
      expect(detail.duties.length, category).toBeGreaterThan(0);
      for (const duty of detail.duties) {
        expect(duty.heading.trim(), category).not.toBe('');
        expect(duty.text.trim(), category).not.toBe('');
      }
      expect(detail.competencies.length, category).toBeGreaterThan(0);
      for (const competency of detail.competencies) expect(competency.trim()).not.toBe('');
      expect(detail.whyMomentsText.trim(), category).not.toBe('');
    }
  });

  it('features exactly 4 jobs per role with non-empty content (Phase F, 4-corner constellation)', () => {
    // Exactly 4 featured jobs per role so the constellation reads as the reference's 4-corner ring
    // (jobs.ts): Specialist + Integrator feature 4 of ARM's 5 common titles; Technician's 4th is
    // added from ARM's title list. Per-job content is placeholder but must be present + well-formed.
    const expectedCounts: Record<(typeof CATEGORIES)[number], number> = {
      technician: 4,
      specialist: 4,
      integrator: 4,
    };
    const allIds: string[] = [];
    for (const category of CATEGORIES) {
      const roleJobs = jobs[category];
      expect(roleJobs.length, category).toBe(expectedCounts[category]);
      for (const job of roleJobs) {
        expect(job.categoryId, job.id).toBe(category);
        for (const value of [job.id, job.title, job.summary]) {
          expect(value.trim(), job.id).not.toBe('');
        }
        expect(job.responsibilities.length, job.id).toBeGreaterThan(0);
        for (const r of job.responsibilities) expect(r.trim(), job.id).not.toBe('');
        expect(job.skills.length, job.id).toBeGreaterThan(0);
        for (const s of job.skills) expect(s.trim(), job.id).not.toBe('');
        if (job.roleNoun !== undefined) expect(job.roleNoun.trim(), job.id).not.toBe('');
        if (job.salaryMedian !== undefined) expect(job.salaryMedian.trim(), job.id).not.toBe('');
        if (job.education !== undefined) expect(job.education.trim(), job.id).not.toBe('');
        allIds.push(job.id);
      }
    }
    expect(new Set(allIds).size, 'job ids unique across roles').toBe(allIds.length);
  });

  it('provides at least one bridge program per role with non-empty content', () => {
    for (const category of CATEGORIES) {
      const programs = bridgePrograms[category];
      expect(programs.length, category).toBeGreaterThan(0);
      for (const program of programs) {
        expect(program.title.trim(), category).not.toBe('');
        expect(program.school.trim(), category).not.toBe('');
        expect(['mechatronics', 'systems', 'certification', 'controls']).toContain(program.icon);
      }
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
