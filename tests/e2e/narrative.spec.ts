import { expect, type Locator,test } from '@playwright/test';

import { narrativeFlow } from '../../src/data/flows/narrativeFlow';
import { jobs } from '../../src/data/jobs';
import { roleDetails } from '../../src/data/roleDetails';
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

/** Wait until the locator's bounding box is stable across two polls. The map's camera glide
 *  moves hit targets, and a force-click fired mid-glide lands on stale coordinates (CM-14). */
const cameraSettled = async (locator: Locator) => {
  let prev = '';
  await expect
    .poll(
      async () => {
        const box = await locator.boundingBox();
        const next = JSON.stringify(box);
        const stable = box !== null && next === prev;
        prev = next;
        return stable;
      },
      { intervals: [200], timeout: 5000 },
    )
    .toBe(true);
};

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
  // The full flow is the longest spec: 6 intro questions + 7 two-beat scenes (each a Continue
  // plus three sliding choice cards, D-029 Phase B) + the results interactions runs ~30s, over
  // Playwright's 30s default. Give it headroom rather than clip the designed motion.
  test.setTimeout(60_000);

  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  await page.goto('/');
  // Landing → character pick → flow.
  await page.getByTestId('start-cta').click();
  await expect(page).toHaveURL(/\/character$/);
  await page.getByTestId('character-select-girl').click();
  await expect(page).toHaveURL(/\/flow$/);

  // Intro questions. Q0 (experience) is a new unscored question shown first under the
  // opening prompt; then Q1 = No branches straight to Q3 — Q2 (the college-duration question)
  // must never appear.
  await expect(
    page.getByRole('heading', { name: 'Do you have any experience in this field?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: mcLabel('n-q0'), exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Are you planning on going to college?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: mcLabel('n-q1'), exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'How long would you want to attend college?' }),
  ).not.toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'What is the lowest salary you would feel satisfied with?' }),
  ).toBeVisible();
  await page.getByRole('button', { name: mcLabel('n-q3'), exact: true }).click();
  await page.getByRole('button', { name: mcLabel('n-q4'), exact: true }).click();
  await page.getByRole('button', { name: mcLabel('n-q5'), exact: true }).click();

  // Seven scenes, each a two-beat (D-029 Phase B): the scene-context card shows "Scene N of 7"
  // and a gold Continue; pressing it reveals the three choice cards one at a time, each rated
  // into one of the three buckets. The current card slides out as the next mounts, so target it
  // by its label.
  for (const id of sceneIds) {
    await expect(page.getByTestId('scene-progress')).toBeVisible();
    await page.getByTestId('scene-continue').click();
    if (id === sceneIds[0]) {
      // The middle bucket reads "Kinda me", not "Maybe" (D-018).
      await expect(page.getByTestId('bucket-maybe')).toContainText('Kinda me');
    }
    for (const choice of sceneStep(id).choices) {
      await expect(
        page.getByTestId('scene-card').filter({ hasText: choice.label }),
      ).toBeVisible();
      await page.getByTestId(`bucket-${sceneBuckets[choice.id]}`).click();
    }
  }

  // Role results: the dark role cards (D-029 Phase C). Specialist is the runaway top match; the
  // hero match % and each signal bar equal the engine's read of the same MC answers + buckets.
  await expect(page).toHaveURL(/\/results$/, { timeout: 7000 });
  const expected = calculateCategoryScores(narrativeFlow, mcAnswers, sceneBuckets);
  expect(expected.primaryCategory).toBe('specialist'); // every scene's specialist choice was "That's me"
  await expect(page.getByTestId('role-name')).toHaveText('Specialist');
  await expect(page.getByTestId('match-pct-specialist')).toHaveText(
    `${expected.matchPercentages.specialist}%`,
  );
  for (const category of ['technician', 'specialist', 'integrator'] as const) {
    await expect(page.getByTestId(`signal-bar-${category}`)).toContainText(
      `${expected.matchPercentages[category]}%`,
    );
  }

  // "Why you matched" expands inline to the full breakdown: the screener-fit read (no college +
  // a Specialist top match → an education heads-up) and "what you passed on".
  await page.getByTestId('why-toggle').first().click();
  await expect(page.getByTestId('why-matched')).toContainText('What you passed on');
  await expect(page.getByTestId('why-matched')).toContainText('Heads up');

  // Tab 2 surfaces the role's competencies (ARM) + bridge programs.
  await page.getByTestId('role-tab-1').click();
  await expect(page.getByRole('heading', { name: /Competencies/ })).toBeVisible();

  // Prev/next steps through the ranked roles: next → the engine's second-ranked role. (It's
  // Integrator, not Technician: on the no-college path the branch-aware maxes differ, so
  // integrator 1/10 edges out technician 1/11.)
  const secondRoleName = roleDetails[expected.ranking[1]].roleName;
  await page.getByTestId('role-next').click();
  await expect(page.getByTestId('role-name')).toHaveText(secondRoleName);

  // Compare (D-029 Phase D): the control opens a two-column side-by-side of the current role
  // (left) and a switchable target (right), with a recommendation line. We're on the second
  // role now, so left = it; the default target is the next ranked role.
  const leftRole = roleDetails[expected.ranking[1]].roleName; // current role → left column
  const defaultTarget = roleDetails[expected.ranking[2]].roleName; // roleIndex+1 → right column
  await page.getByTestId('open-compare').click();
  await expect(page.getByTestId('compare-columns')).toBeVisible();
  await expect(page.getByTestId('compare-role-name')).toHaveText([leftRole, defaultTarget]);
  await expect(page.getByTestId('compare-recommendation')).toContainText('Our take');

  // The dropdown switches the right column to another role (the top match here).
  const topRole = roleDetails[expected.ranking[0]].roleName;
  await page.getByTestId('compare-target-trigger').click();
  await page.getByTestId(`compare-target-${expected.ranking[0]}`).click();
  await expect(page.getByTestId('compare-role-name')).toHaveText([leftRole, topRole]);

  // Each column's "why you matched" expands on its own; back returns to the cards.
  await page.getByTestId('why-toggle').first().click();
  await expect(page.getByTestId('why-matched').first()).toContainText('What you passed on');
  await page.getByTestId('compare-back').click();
  await expect(page.getByTestId('role-name')).toHaveText(leftRole);

  // Career map (D-029 Phase E/F unified): the control opens the zoomable map; three role bubbles
  // sized by match %. Tapping a bubble zooms into that role's jobs; tapping a job opens JobOverview
  // in the side panel (same cards as before).
  await page.getByTestId('open-map').click();
  await expect(page.getByTestId('results-map')).toBeVisible();
  for (const category of ['technician', 'specialist', 'integrator'] as const) {
    await expect(page.getByTestId(`map-bubble-${category}`)).toBeVisible();
  }

  // Intro card → "?" pill (CM-07): the directions carry the job-dots line, collapse into a
  // persistent pill on the first explore gesture, and the pill re-expands them on demand.
  await expect(page.getByTestId('career-map-intro')).toBeVisible();
  await expect(page.getByTestId('career-map-intro')).toContainText('small dots');
  await page.getByTestId('career-map-field').hover();
  await page.mouse.wheel(0, -300);
  await expect(page.getByTestId('career-map-intro')).not.toBeVisible();
  await expect(page.getByTestId('career-map-intro-pill')).toBeVisible();
  await page.getByTestId('career-map-intro-pill').click();
  await expect(page.getByTestId('career-map-intro')).toBeVisible();
  await page.getByTestId('career-map-intro-dismiss').click();
  await expect(page.getByTestId('career-map-intro-pill')).toBeVisible();

  // Role zoom: tapping the top-match bubble stays on the map; the floating context panel
  // (CM-10) mounts once the camera lands, showing the role body with the jobs-in-path list.
  // The map opens with an entrance camera glide, so let the bubble settle before clicking.
  const topBubble = page.getByTestId(`map-bubble-${expected.ranking[0]}`);
  await cameraSettled(topBubble);
  await topBubble.click({ force: true });
  await expect(page.getByTestId('career-map-field')).toBeVisible();
  await expect(page.getByTestId('map-context-panel')).toBeVisible();
  await expect(page.getByTestId('map-panel-role')).toContainText(topRole);
  await expect(page.getByTestId('map-panel-role')).toContainText('Jobs in this path');

  // Job select: the panel persists and its body swaps to the full three-tab job content.
  // The role-zoom glide moves the orb, so wait for the camera to land first (CM-14).
  const topJob = jobs[expected.ranking[0]][0];
  const topJobOrb = page.getByTestId(`career-map-job-${topJob.id}`);
  await cameraSettled(topJobOrb);
  await topJobOrb.click({ force: true });
  await expect(page.getByTestId('job-overview')).toContainText(topJob.title);
  await expect(page.getByTestId('job-overview')).toContainText(`Job in ${topRole}`);
  await page.getByTestId('job-overview-tab-1').click();
  await expect(page.getByRole('heading', { name: /Competencies/ })).toBeVisible();
  await page.getByTestId('job-overview-tab-2').click();
  await expect(page.getByTestId('trajectory')).toBeVisible();

  // Back chain (CM-09): the panel-header back reads the role name at job zoom (→ role body),
  // then "All paths" at role zoom (→ overview); the persistent exit platter leaves to cards.
  await expect(page.getByTestId('map-panel-back')).toContainText(topRole);
  await page.getByTestId('map-panel-back').click();
  await expect(page.getByTestId('map-panel-role')).toBeVisible();
  await expect(page.getByTestId('map-panel-back')).toContainText('All paths');
  await page.getByTestId('map-panel-back').click();
  await expect(page.getByTestId('map-context-panel')).not.toBeVisible();
  await expect(page.getByTestId('career-map-field')).toBeVisible();
  await page.getByTestId('map-back-cards').click();
  await expect(page.getByTestId('role-name')).toHaveText(topRole);

  // "Retake quiz" returns to Landing, ready to start over (the only control is the Start CTA).
  await page.getByTestId('retake').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('start-cta')).toBeVisible();

  expect(consoleErrors, `console errors:\n${consoleErrors.join('\n')}`).toEqual([]);
});
