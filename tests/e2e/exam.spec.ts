import { expect, test } from '@playwright/test';

import { examFlow } from '../../src/data/flows/examFlow';
import type { BucketId, StatementSortStep } from '../../src/data/types';
import { calculateCategoryScores } from '../../src/lib/categoryScoring';

// The Exam study flow (DATA_MODEL §17): background questions, the mapped tech question,
// then the 30-statement sort into three buckets via tapping. Statements alternate
// that's-me / maybe / not-me so all three buckets are exercised (maybe scores
// MAYBE_WEIGHT, 0 today — the engine comparison stays honest either way).

const sortStep = examFlow.steps.find((s): s is StatementSortStep => s.type === 'statementSort')!;
const bucketCycle: BucketId[] = ['thats-me', 'maybe', 'not-me'];

const answers: Record<string, string> = {
  'e-q1': 'e-q1-maybe',
  'e-q2': 'e-q2-no',
  'e-q3': 'e-q3-program',
};
const statementBuckets: Record<string, BucketId> = Object.fromEntries(
  sortStep.statements.map((statement, index) => [statement.id, bucketCycle[index % 3]]),
);

const mcLabel = (stepId: string): string => {
  const step = examFlow.steps.find((s) => s.id === stepId);
  if (!step || step.type !== 'mc') throw new Error(`bad step ${stepId}`);
  const choice = step.choices.find((c) => c.id === answers[stepId]);
  if (!choice) throw new Error(`bad choice for ${stepId}`);
  return choice.label;
};

test('exam: questions + 30-statement sort across three buckets, results match the engine, condition survives retake', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/');
  await page.getByTestId('flow-exam').click();
  await expect(page.getByTestId('flow-exam')).toHaveAttribute('aria-pressed', 'true');

  await page.getByTestId('start-cta').click();
  await expect(page).toHaveURL(/\/flow$/);

  // The three questions.
  for (const stepId of ['e-q1', 'e-q2', 'e-q3']) {
    await page.getByRole('button', { name: mcLabel(stepId), exact: true }).click();
  }

  // The statement sort: tap the bucket for each statement, cycling all three buckets.
  // The outgoing card is still exiting (popLayout) when the next one mounts, so target
  // the current card by its label rather than the bare testid.
  const progress = page.getByTestId('flow-progress');
  for (let i = 0; i < sortStep.statements.length; i++) {
    const statement = sortStep.statements[i];
    await expect(
      page.getByTestId('statement-card').filter({ hasText: statement.label }),
    ).toBeVisible();
    await page.getByTestId(`bucket-${statementBuckets[statement.id]}`).click();
    if (i < sortStep.statements.length - 1) {
      await expect(progress).toHaveText(`${i + 1} of 30 sorted`);
    }
  }

  // Category results: displayed percentages equal the engine's read of the same inputs.
  await expect(page).toHaveURL(/\/results$/, { timeout: 7000 });
  const expected = calculateCategoryScores(examFlow, answers, statementBuckets);
  for (const category of ['operate', 'repair', 'program', 'plan'] as const) {
    await expect(page.getByTestId(`category-pct-${category}`)).toHaveText(
      `${expected.matchPercentages[category]}%`,
    );
  }

  // "Start over" returns to Landing with the condition still selected (reset-survival).
  await page.getByTestId('retake').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('flow-exam')).toHaveAttribute('aria-pressed', 'true');

  expect(consoleErrors, `console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
});
