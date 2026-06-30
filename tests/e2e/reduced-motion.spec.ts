import { expect, test } from '@playwright/test';

import { narrativeFlow } from '../../src/data/flows/narrativeFlow';
import { jobs } from '../../src/data/jobs';
import type { BucketId } from '../../src/data/types';

// Guards the prefers-reduced-motion path: with reduced motion the narrative flow (the default,
// and the only flow after the strip) must still work end to end. MC transitions and the scene
// bucket-sort crossfade instead of animating, the results signal bars + view transitions are
// instant, and Landing's content entrance is skipped. We assert it completes with no console
// errors and the role cards still step.

const mcAnswers: Record<string, string> = {
  'n-q0': 'n-q0-no',
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

test('narrative flow works under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/');
  // Landing is narrative-only now (switcher UI removed) — Start goes straight into the flow.
  await page.getByTestId('start-cta').click();
  await expect(page).toHaveURL(/\/flow$/);

  // Intro questions (Q1 = No branches over Q2, so "How long?" never shows).
  await page.getByRole('button', { name: mcLabel('n-q0'), exact: true }).click();
  await page.getByRole('button', { name: mcLabel('n-q1'), exact: true }).click();
  await page.getByRole('button', { name: mcLabel('n-q3'), exact: true }).click();
  await page.getByRole('button', { name: mcLabel('n-q4'), exact: true }).click();
  await page.getByRole('button', { name: mcLabel('n-q5'), exact: true }).click();

  // Seven scenes (two-beat): Continue past each scene-context card, then tap the target bucket
  // row for each choice card (it crossfades instead of sliding under reduced motion).
  for (const id of sceneIds) {
    await page.getByTestId('scene-continue').click();
    for (const choice of sceneStep(id).choices) {
      await expect(page.getByTestId('scene-card').filter({ hasText: choice.label })).toBeVisible();
      await page.getByTestId(`bucket-${sceneBuckets[choice.id]}`).click();
    }
  }

  await expect(page).toHaveURL(/\/results$/, { timeout: 7000 });

  // The role cards render and step without motion: every scene's specialist choice was "That's
  // me", so Specialist is the top match; prev/next steps to the second-ranked role (Integrator —
  // on the no-college path the branch-aware maxes make integrator 1/10 edge out technician 1/11).
  await expect(page.getByTestId('role-name')).toHaveText('Specialist');
  await page.getByTestId('role-next').click();
  await expect(page.getByTestId('role-name')).toHaveText('Integrator');

  // The map + constellation render without motion and a dive still works (D-029 Phase E/F): with
  // reduced motion the bubbles and nodes are static, so normal clicks land. Open the map, tap the
  // top-match bubble to dive into its constellation, then open a job overlay.
  await page.getByTestId('open-map').click();
  await expect(page.getByTestId('results-map')).toBeVisible();
  await expect(page.getByTestId('map-bubble-specialist')).toBeVisible();
  await page.getByTestId('map-bubble-specialist').click();
  await expect(page.getByTestId('results-constellation')).toBeVisible();
  await expect(page.getByTestId('constellation-center')).toContainText('Specialist');
  const firstJob = jobs.specialist[0];
  await page.getByTestId(`constellation-node-${firstJob.id}`).click();
  await expect(page.getByTestId('job-side-panel')).toContainText('Job in Specialist');

  expect(consoleErrors, `console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
});
