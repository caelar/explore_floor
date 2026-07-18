import { chromium } from '@playwright/test';

const CAPTURES = [
  {
    tab: 0,
    captureId: '46499099-5af6-4b2e-b9ff-d591926b72bd',
    endpoint:
      'https://mcp.figma.com/mcp/capture/46499099-5af6-4b2e-b9ff-d591926b72bd/submit',
  },
  {
    tab: 1,
    captureId: 'd0e1d129-ab8e-43fe-a2ca-2a425b696a1b',
    endpoint:
      'https://mcp.figma.com/mcp/capture/d0e1d129-ab8e-43fe-a2ca-2a425b696a1b/submit',
  },
  {
    tab: 2,
    captureId: 'd1551373-ace2-4566-ae49-afc162be47e1',
    endpoint:
      'https://mcp.figma.com/mcp/capture/d1551373-ace2-4566-ae49-afc162be47e1/submit',
  },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });

await page.goto('http://localhost:5176/explore_floor/');
await page.getByTestId('dev-skip-to-loading').click();
await page.getByTestId('loading-screen').waitFor();
await page.getByTestId('open-map').waitFor({ timeout: 8000 });
await page.getByTestId('open-map').click();
await page.waitForSelector('[data-testid="results-map"]');
await page.waitForSelector('[data-testid="career-map-field"]');
// Map entrance stagger before hub labels are interactive.
await page.waitForTimeout(1500);

const topBubble = page.getByTestId('map-bubble-specialist');
await topBubble.click({ force: true });
await page.waitForSelector('[data-testid="map-back-overview"]', { timeout: 15000 });
await page.waitForTimeout(1000);

await page.getByTestId('career-map-job-specialist-robotics-specialist').click({ force: true });
await page.waitForSelector('[data-testid="job-overview"]', { timeout: 15000 });

const scriptRes = await page.context().request.get(
  'https://mcp.figma.com/mcp/html-to-design/capture.js',
);
await page.evaluate((source) => {
  const el = document.createElement('script');
  el.textContent = source;
  document.head.appendChild(el);
}, await scriptRes.text());
await page.waitForTimeout(800);

for (const capture of CAPTURES) {
  if (capture.tab > 0) {
    await page.getByTestId(`job-overview-tab-${capture.tab}`).click();
    await page.waitForTimeout(400);
  }

  const result = await page.evaluate(
    ({ captureId, endpoint }) =>
      window.figma.captureForDesign({
        captureId,
        endpoint,
        selector: '[data-testid="career-map-job-panel"]',
      }),
    capture,
  );
  console.log(`Tab ${capture.tab} capture:`, JSON.stringify(result));
  await page.waitForTimeout(3000);
}

await browser.close();
