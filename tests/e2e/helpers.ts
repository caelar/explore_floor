import type { Page } from '@playwright/test';

import type { FlowId } from '../../src/data/types';

/** Select the classic flow via the dev-only store handle (sessionStore.ts). Classic is
 *  dormant — kept in code but absent from the landing switcher (D-021) — so its specs
 *  can't reach it through the UI. Call after goto('/'); Landing re-renders reactively. */
export async function selectClassicFlow(page: Page): Promise<void> {
  await page.evaluate(() => {
    const store = (
      globalThis as unknown as {
        __sessionStore: { getState(): { selectFlow(id: FlowId): void } };
      }
    ).__sessionStore;
    store.getState().selectFlow('classic');
  });
}
