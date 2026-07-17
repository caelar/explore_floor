import { expect, test } from '@playwright/test';

test('debug map hub label positions', async ({ page }) => {
  await page.goto('/explore_floor/');
  await page.getByTestId('dev-skip-to-loading').click();
  await page.getByTestId('loading-screen').waitFor();
  await page.getByTestId('open-map').waitFor({ timeout: 8000 });
  await page.getByTestId('open-map').click();

  const info = await page.evaluate(() => {
    const MAP_JOB_R = 19.669;
    const field = document.querySelector('[data-testid="career-map-field"]');
    const svg = field?.querySelector('svg');
    const labels = svg ? [...svg.querySelectorAll('[data-testid^="map-bubble-"]')] : [];

    const hubCenters: Record<string, { cx: number; cy: number; r: number }> = {
      'map-bubble-specialist': { cx: 577.173, cy: 251.623, r: 65.788 },
      'map-bubble-integrator': { cx: 813.197, cy: 402.19, r: 45.441 },
      'map-bubble-technician': { cx: 185.156, cy: 206.86, r: 45.441 },
    };

    const jobCenters = [
      { cx: 813.197, cy: 187.87 },
      { cx: 426.607, cy: 99.7 },
      { cx: 337.08, cy: 381.844 },
      { cx: 578.53, cy: 467.3 },
      { cx: 921.714, cy: 214.999 },
      { cx: 1074.994, cy: 400.834 },
      { cx: 647.71, cy: 361.497 },
      { cx: 653.135, cy: 547.331 },
      { cx: 423.894, cy: 479.508 },
      { cx: 347.932, cy: 206.86 },
      { cx: 293.674, cy: 19.669 },
      { cx: 19.669, cy: 166.167 },
    ];

    const paths = [
      ...document.querySelectorAll('[data-testid="career-map-edge"]'),
    ] as SVGPathElement[];
    const edgeGaps = paths.map((path) => {
      const group = path.parentElement;
      const transform = group?.getAttribute('transform') ?? '';
      const match = /translate\(([-\d.]+)\s+([-\d.]+)\)/.exec(transform);
      const tx = match ? Number(match[1]) : 0;
      const ty = match ? Number(match[2]) : 0;

      const len = path.getTotalLength();
      const endLocal = path.getPointAtLength(len);
      const startLocal = path.getPointAtLength(0);
      const end = { x: endLocal.x + tx, y: endLocal.y + ty };
      const start = { x: startLocal.x + tx, y: startLocal.y + ty };

      const hubs = Object.values(hubCenters);
      const distStartHub = Math.min(...hubs.map((h) => Math.hypot(start.x - h.cx, start.y - h.cy)));
      const distEndHub = Math.min(...hubs.map((h) => Math.hypot(end.x - h.cx, end.y - h.cy)));
      const jobPoint = distStartHub < distEndHub ? end : start;

      let nearest = Infinity;
      for (const job of jobCenters) {
        nearest = Math.min(nearest, Math.hypot(jobPoint.x - job.cx, jobPoint.y - job.cy));
      }
      return nearest - MAP_JOB_R;
    });

    const MAP_VIEW_WIDTH = 1094.663;
    const motionLayer = field?.querySelector('.absolute.left-0.top-0');
    const transform = motionLayer ? getComputedStyle(motionLayer).transform : '';
    let scale = 1;
    if (transform && transform !== 'none') {
      const matrix = /matrix\(([^)]+)\)/.exec(transform);
      if (matrix) {
        scale = Number(matrix[1].split(',')[0]?.trim()) || 1;
      }
    }
    const mapWidth = field?.clientWidth ?? 900;
    const edgeGapVb = (MAP_VIEW_WIDTH / (mapWidth * scale)) * 1;

    return {
      labelCount: labels.length,
      edgeGaps,
      edgeGapVb,
      labels: labels.map((el) => {
        const testid = el.getAttribute('data-testid') ?? '';
        const hub = hubCenters[testid];
        const texts = [...el.querySelectorAll('text')].map((t) => {
          const box = t.getBBox();
          return {
            text: t.textContent?.trim(),
            box: { x: box.x, y: box.y, w: box.width, h: box.height },
            cy: box.y + box.height / 2,
          };
        });
        const inside =
          hub &&
          texts.every(
            (t) =>
              t.cy >= hub.cy - hub.r &&
              t.cy <= hub.cy + hub.r &&
              t.box.x + t.box.w / 2 >= hub.cx - hub.r &&
              t.box.x + t.box.w / 2 <= hub.cx + hub.r,
          );
        return { testid, texts, insideHub: inside };
      }),
    };
  });

  console.log(JSON.stringify(info, null, 2));
  for (const label of info.labels) {
    if (!label.insideHub) throw new Error(`${label.testid} text escaped hub bounds`);
  }
  for (const gap of info.edgeGaps) {
    expect(gap).toBeGreaterThan(0);
    expect(gap).toBeLessThanOrEqual(info.edgeGapVb * 1.05 + 0.01);
  }
  await page.screenshot({ path: 'test-results/map-debug.png', fullPage: false });
});
