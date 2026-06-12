import { expect, test } from '@playwright/test';

import { selectClassicFlow } from './helpers';

// The Phase 1 happy path: land → sort all 24 one at a time → build beat → results with three
// role cards and the robot, and no console errors anywhere along the way. Classic is dormant
// (no switcher tab — D-021), so the spec selects it through the dev store handle.
test('landing → sort all 24 one at a time → build → results shows three role cards', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/');
  await selectClassicFlow(page);
  await expect(page.getByRole('heading', { name: 'Explore the Floor' })).toBeVisible();

  await page.getByTestId('start-cta').click();
  await expect(page).toHaveURL(/\/sort$/);

  // One card at a time: click "That's me" (keep) for each item, confirming the progress
  // counter advances before sorting the next one.
  const keepBin = page.getByTestId('sort-keep');
  const progress = page.getByTestId('sort-progress');
  await expect(page.getByTestId('sort-card')).toBeVisible();

  for (let i = 1; i <= 23; i++) {
    await keepBin.click();
    await expect(progress).toHaveText(`${i} of 24 sorted`);
  }
  // The 24th decision finalizes scoring and auto-advances through /build to /results.
  await keepBin.click();
  await expect(page).toHaveURL(/\/results$/, { timeout: 7000 });

  await expect(page.locator('[data-testid^="role-card-"]')).toHaveCount(3);
  await expect(page.getByTestId('robot')).toBeVisible();

  expect(consoleErrors, `console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
});
