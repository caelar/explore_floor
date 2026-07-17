import { jobs } from '@/data/jobs';
import { CATEGORIES, type CategoryId, type Job } from '@/data/types';

/** Resolved rung on a job's career-progression ladder for TrajectoryViz. */
export interface TrajectoryRung {
  kind: 'prior' | 'current' | 'next';
  job: Job;
  /** True when this rung's categoryId differs from the selected (current) job's tier. */
  crossCategory: boolean;
}

const JOB_BY_ID = new Map<string, Job>(
  CATEGORIES.flatMap((categoryId) => jobs[categoryId].map((job) => [job.id, job] as const)),
);

export function jobById(id: string): Job | undefined {
  return JOB_BY_ID.get(id);
}

/** Map a featured job id to its rank slot + index within that role's job ring. */
export function jobMapLocation(
  jobId: string,
  ranking: readonly CategoryId[],
): { rank: number; jobIndex: number } | null {
  const job = JOB_BY_ID.get(jobId);
  if (!job) return null;
  const rank = ranking.indexOf(job.categoryId);
  if (rank === -1) return null;
  const jobIndex = jobs[job.categoryId].findIndex((entry) => entry.id === jobId);
  if (jobIndex === -1) return null;
  return { rank, jobIndex };
}

/** Build ordered rungs (top → bottom): next, current, prior — omitting undefined refs. */
export function buildJobTrajectory(current: Job): TrajectoryRung[] {
  const rungs: TrajectoryRung[] = [];

  if (current.trajectory.next) {
    const next = JOB_BY_ID.get(current.trajectory.next.jobId);
    if (next) {
      rungs.push({
        kind: 'next',
        job: next,
        crossCategory: next.categoryId !== current.categoryId,
      });
    }
  }

  rungs.push({ kind: 'current', job: current, crossCategory: false });

  if (current.trajectory.prior) {
    const prior = JOB_BY_ID.get(current.trajectory.prior.jobId);
    if (prior) {
      rungs.push({
        kind: 'prior',
        job: prior,
        crossCategory: prior.categoryId !== current.categoryId,
      });
    }
  }

  return rungs;
}

/** Vertical anchor (px) for 1–3 rungs inside the trajectory panel. Top → bottom. */
export function trajectoryRungY(count: number, index: number): number {
  if (count === 1) return 215;
  if (count === 2) return index === 0 ? 130 : 300;
  return [84, 215, 346][index] ?? 215;
}

export function allFeaturedJobs(): Job[] {
  return CATEGORIES.flatMap((categoryId) => jobs[categoryId]);
}
