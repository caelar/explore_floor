import { expect, test } from '@playwright/test';

import { selectClassicFlow } from './helpers';

// Guards the prefers-reduced-motion path (motion-quality rubric, p1): with reduced motion the
// whole flow must still work end to end — Sort crossfades instead of dragging, the Build beat is
// instant, Results' layout reflow is duration 0, and Landing skips the DrawSVG draw. We assert it
// completes with no console errors and the compare still swaps.
test('full flow works under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });

  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/');
  await selectClassicFlow(page);
  await page.getByTestId('start-cta').click();
  await expect(page).toHaveURL(/\/sort$/);

  const keep = page.getByTestId('sort-keep');
  const progress = page.getByTestId('sort-progress');
  for (let i = 1; i <= 23; i++) {
    await keep.click();
    await expect(progress).toHaveText(`${i} of 24 sorted`);
  }
  await keep.click();
  await expect(page).toHaveURL(/\/results$/, { timeout: 7000 });

  // Compare still works without motion.
  await expect(page.getByTestId('role-card-technician')).toHaveAttribute('data-active', 'true');
  await page.getByTestId('role-card-specialist').click();
  await expect(page.getByTestId('role-card-specialist')).toHaveAttribute('data-active', 'true');

  expect(consoleErrors, `console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
});
