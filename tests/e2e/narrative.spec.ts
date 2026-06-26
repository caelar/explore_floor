import { expect, test } from '@playwright/test';

import { narrativeFlow } from '../../src/data/flows/narrativeFlow';
import type { BucketId } from '../../src/data/types';
import { calculateCategoryScores } from '../../src/lib/categoryScoring';

// The Narrative flow (DATA_MODEL §17): switch the condition on Landing, answer the intro
// questions (taking the Q1 "No" branch — Q2 must be skipped), then in each of the seven
// scenes sort all three choices into the three buckets (D-018). Bucketing each scene's
// specialist choice "That's me" and the rest "Not me" makes Specialist the runaway top
// match; displayed percentages match the scoring engine. Retake keeps the condition.

const mcAnswers: Record<string, string> = {
  'n-q0': 'n-q0-no', // experience question, unscored
  'n-q1': 'n-q1-no', // branches over n-q2
  'n-q3': 'n-q3-85',
  'n-q4': 'n-q4-typing',
  'n-q5': 'n-q5-solving',
};

const sceneIds = ['n-s1', 'n-s2', 'n-s3', 'n-s4', 'n-s5', 'n-s6', 'n-s7'];

const sceneStep = (id: string) => {
  const step = narrativeFlow.steps.find((s) => s.id === id);
  if (step?.type !== 'scene') throw new Error(`not a scene: ${id}`);
  return step;
};

// Each scene's specialist choice → "That's me"; the other two → "Not me".
const sceneBuckets: Record<string, BucketId> = {};
for (const id of sceneIds) {
  for (const choice of sceneStep(id).choices) {
    sceneBuckets[choice.id] = choice.category === 'specialist' ? 'thats-me' : 'not-me';
  }
}

const mcLabel = (stepId: string): string => {
  const step = narrativeFlow.steps.find((s) => s.id === stepId);
  if (step?.type !== 'mc') throw new Error(`bad step ${stepId}`);
  const choice = step.choices.find((c) => c.id === mcAnswers[stepId]);
  if (!choice) throw new Error(`bad choice for ${stepId}`);
  return choice.label;
};

test('narrative: branch over Q2, sort every scene into buckets, results match the engine, condition survives retake', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/');
  await page.getByTestId('flow-narrative').click();
  await expect(page.getByTestId('flow-narrative')).toHaveAttribute('aria-pressed', 'true');

  await page.getByTestId('start-cta').click();
  await expect(page).toHaveURL(/\/flow$/);

  // Intro questions. Q0 (experience) is a new unscored question shown first under the
  // opening prompt; then Q1 = No branches straight to Q3 — Q2 ("How long?") must never appear.
  await expect(
    page.getByRole('heading', { name: 'Do you have any experience in this field?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: mcLabel('n-q0'), exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Are you planning on going to college?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: mcLabel('n-q1'), exact: true }).click();
  await expect(page.getByRole('heading', { name: 'How long?' })).not.toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'What is the lowest salary you would feel satisfied with?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: mcLabel('n-q3'), exact: true }).click();
  await page.getByRole('button', { name: mcLabel('n-q4'), exact: true }).click();
  await page.getByRole('button', { name: mcLabel('n-q5'), exact: true }).click();

  // The middle bucket reads "Kinda me", not "Maybe" (D-018) — shared with the exam.
  await expect(page.getByTestId('bucket-maybe')).toContainText('Kinda me');

  // Seven scenes: each shows its four choice cards one at a time (data order). Bucket each
  // by tapping the target zone; the card exits (popLayout) as the next one mounts, so we
  // target the current card by its label.
  for (const id of sceneIds) {
    await expect(page.getByTestId('scene-progress')).toBeVisible();
    for (const choice of sceneStep(id).choices) {
      await expect(
        page.getByTestId('scene-card').filter({ hasText: choice.label }),
      ).toBeVisible();
      await page.getByTestId(`bucket-${sceneBuckets[choice.id]}`).click();
    }
  }

  // Role results: the node graph. Specialist is the runaway top match; displayed percentages
  // equal the engine's read of the same MC answers + scene buckets.
  await expect(page).toHaveURL(/\/results$/, { timeout: 7000 });
  const expected = calculateCategoryScores(narrativeFlow, mcAnswers, sceneBuckets);
  expect(expected.primaryCategory).toBe('specialist'); // every scene's specialist choice was "That's me"
  await expect(page.getByRole('heading', { name: 'Specialist' })).toBeVisible();
  for (const category of ['technician', 'specialist', 'integrator'] as const) {
    await expect(page.getByTestId(`category-pct-${category}`)).toHaveText(
      `${expected.matchPercentages[category]}%`,
    );
  }

  // Screener fit line (D-020): education + pay read on the top match. No college (Q1=No) +
  // a Specialist top match → an education heads-up; $85k target under Specialist pay → fits.
  await expect(page.getByTestId('fit-note')).toBeVisible();
  await expect(page.getByTestId('fit-education')).toContainText('Heads up');
  await expect(page.getByTestId('fit-pay')).toBeVisible();

  // The active category's job titles branch off the front — tap one for the role sheet
  // (RC.org content + fit radar), then close it.
  await page.getByTestId('title-node').filter({ hasText: 'Robotics Specialist' }).click();
  await expect(page.getByTestId('role-sheet')).toBeVisible();
  await expect(page.getByTestId('role-sheet')).toContainText('Specialist');
  await expect(page.getByTestId('role-sheet')).toContainText('national median $105,000/yr');
  await expect(page.getByTestId('fit-radar')).toBeVisible();
  await page.getByTestId('sheet-close').click();
  await expect(page.getByTestId('role-sheet')).not.toBeVisible();

  // Tapping a behind-node swaps it into the center: the heading and its branched titles update.
  // The entry Technician (Operate-derived, $45,936) is the node that yields "Technician".
  await page.getByTestId('category-node-technician').click();
  await expect(page.getByRole('heading', { name: 'Technician' })).toBeVisible();
  await expect(
    page.getByTestId('title-node').filter({ hasText: 'Automation Technician' }),
  ).toBeVisible();

  // "Start over" returns to Landing with the condition still selected (reset-survival).
  await page.getByTestId('retake').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('flow-narrative')).toHaveAttribute('aria-pressed', 'true');

  expect(consoleErrors, `console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
});
