import { describe, expect, it } from 'vitest';

import { jobs } from '@/data/jobs';
import { buildJobTrajectory, jobMapLocation } from '@/lib/jobTrajectory';

describe('buildJobTrajectory', () => {
  it('builds a three-rung ladder for Robotics Programmer with cross-tier prior', () => {
    const job = jobs.specialist.find((j) => j.id === 'specialist-robotics-specialist')!;
    const rungs = buildJobTrajectory(job);

    expect(rungs.map((r) => r.kind)).toEqual(['next', 'current', 'prior']);
    expect(rungs.find((r) => r.kind === 'current')?.job.title).toBe('Robotics Programmer');
    expect(rungs.find((r) => r.kind === 'prior')?.job.title).toBe('Robot Operator');
    expect(rungs.find((r) => r.kind === 'prior')?.crossCategory).toBe(true);
    expect(rungs.find((r) => r.kind === 'next')?.job.title).toBe('Robotics Engineer');
    expect(rungs.find((r) => r.kind === 'next')?.crossCategory).toBe(false);
  });

  it('omits the prior rung for entry-level jobs', () => {
    const job = jobs.technician.find((j) => j.id === 'technician-entry-level-robotics')!;
    const rungs = buildJobTrajectory(job);

    expect(rungs.map((r) => r.kind)).toEqual(['next', 'current']);
    expect(rungs.find((r) => r.kind === 'current')?.job.title).toBe('Entry Level Robotics');
  });

  it('omits the next rung for the senior-most integrator job', () => {
    const job = jobs.integrator.find((j) => j.id === 'integrator-robotics-integrator')!;
    const rungs = buildJobTrajectory(job);

    expect(rungs.map((r) => r.kind)).toEqual(['current', 'prior']);
    expect(rungs.find((r) => r.kind === 'current')?.job.title).toBe('Robotics Integrator');
  });

  it('resolves map rank + job index for cross-tier trajectory targets', () => {
    const ranking = ['specialist', 'integrator', 'technician'] as const;
    expect(jobMapLocation('integrator-robotics-integrator', ranking)).toEqual({
      rank: 1,
      jobIndex: 0,
    });
    expect(jobMapLocation('technician-robot-operator', ranking)).toEqual({
      rank: 2,
      jobIndex: 0,
    });
  });
});
