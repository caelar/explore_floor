import { expect, test } from '@playwright/test';

import { roleDetails } from '../../src/data/roleDetails';
import { CATEGORIES } from '../../src/data/types';

// The standalone /select comparator (the "skip the quiz" arm for industry professionals):
// Landing → role select → open a detail sheet (no fit radar, no scores) → pick a role →
// the deliberately thin confirmation → back to Landing. No session state, no scoring.

test('role select: land, open a detail, select, confirm, return to Landing', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/');
  // The comparator rides the condition switcher (third tab, where Classic used to be — D-021).
  await page.getByTestId('flow-select').click();
  await expect(page).toHaveURL(/\/select$/);

  // All four cards, in ladder order (Operate → Repair → Program → Plan), named from roleDetails.
  const cards = page.locator('[data-testid^="select-card-"]');
  await expect(cards).toHaveCount(4);
  for (let i = 0; i < CATEGORIES.length; i++) {
    await expect(cards.nth(i)).toContainText(roleDetails[CATEGORIES[i]].roleName);
  }

  // "See details" opens the shared role sheet — content yes, fit radar no (no scores here).
  await page.getByTestId('select-details-repair').click();
  await expect(page.getByTestId('role-sheet')).toBeVisible();
  await expect(page.getByTestId('role-sheet')).toContainText(roleDetails.repair.roleName);
  await expect(page.getByTestId('fit-radar')).toHaveCount(0);
  await page.getByTestId('sheet-close').click();
  await expect(page.getByTestId('role-sheet')).not.toBeVisible();

  // "This is me" → the thin confirmation, then Continue returns to Landing.
  await page.getByTestId('select-role-program').click();
  await expect(page.getByTestId('select-confirm')).toHaveText(
    `You’re set as ${roleDetails.program.roleName}`,
  );
  await page.getByTestId('select-continue').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('start-cta')).toBeVisible();

  expect(consoleErrors, `console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
});
