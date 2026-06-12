import { expect, type Page, test } from '@playwright/test';

import { selectClassicFlow } from './helpers';

// Phase 1 Results coverage: the displayed match percentages match the scoring engine for a known
// sort, and the compare interaction swaps the active role. The sort pattern keeps round 1 (items
// 1-6) and passes the rest, which the engine scores Innovator 30 / Architect 24 / Builder 23
// (see src/data/items.ts weights + src/lib/scoring.ts normalization).

async function sortRoundOneOnly(page: Page) {
  await page.goto('/');
  await selectClassicFlow(page);
  await page.getByTestId('start-cta').click();
  await expect(page).toHaveURL(/\/sort$/);

  const keep = page.getByTestId('sort-keep');
  const pass = page.getByTestId('sort-pass');
  const progress = page.getByTestId('sort-progress');

  // Keep the 6 round-1 items.
  for (let i = 1; i <= 6; i++) {
    await keep.click();
    await expect(progress).toHaveText(`${i} of 24 sorted`);
  }
  // Pass the remaining 18 (the last one auto-advances to results).
  for (let i = 7; i <= 23; i++) {
    await pass.click();
    await expect(progress).toHaveText(`${i} of 24 sorted`);
  }
  await pass.click();
  await expect(page).toHaveURL(/\/results$/, { timeout: 7000 });
}

test('displayed match percentages match the scoring engine', async ({ page }) => {
  await sortRoundOneOnly(page);

  await expect(page.getByTestId('match-pct-specialist')).toHaveText('30%');
  await expect(page.getByTestId('match-pct-integrator')).toHaveText('24%');
  await expect(page.getByTestId('match-pct-technician')).toHaveText('23%');

  // Highest score (Innovator → Specialist) is the active card.
  await expect(page.getByTestId('role-card-specialist')).toHaveAttribute('data-active', 'true');
});

test('compare swaps the active role card', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await sortRoundOneOnly(page);

  // Primary (Specialist) starts active; Technician is a ghosted alternative.
  await expect(page.getByTestId('role-card-specialist')).toHaveAttribute('data-active', 'true');
  await expect(page.getByTestId('role-card-technician')).toHaveAttribute('data-active', 'false');

  // Try on Technician — it becomes active and the previously-active card de-emphasizes.
  await page.getByTestId('role-card-technician').click();
  await expect(page.getByTestId('role-card-technician')).toHaveAttribute('data-active', 'true');
  await expect(page.getByTestId('role-card-specialist')).toHaveAttribute('data-active', 'false');

  expect(consoleErrors, `console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
});
