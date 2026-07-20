# 2026-07-20 — Career-map chrome fix pass (post-merge)

## Resume here

- **State:** Three screenshot-flagged issues on the landed career map are **fixed and verified** (D-056). Hub icons/target star center correctly, the "Back to your results" exit is top-left with the detail panel still left-docked below it, and the "Your career map" intro card no longer falls onto the hubs. Gates green: lint (zero-warning), typecheck, **102/102 unit**, **4/4 E2E**.
- **Next action:** none open for this thread. The fix pass is **committed on `main`** (8 files: 4 code + 4 docs) — **push pending**, Caelan's (`git push` stays denied to the agent).
- **Open holds:** unchanged from 07-18 — still pending Caelan: rc-design-system `main` (`2dcd460`) and robotics_career `refine/phase-2-loop` (`33e0ba5`) pushes; the conditional componentization Pass 5 + registry-§6 after the Tue 07-21 presentation. Two small known limits left as-is (below).

## What we did

Caelan flagged three things from two screenshots of the live map: icons not in the right spot, the back button on the wrong side, and the help card overflowing into the map.

**Icons (the real bug).** The hub icons and the target-job star are Material Icons glyphs drawn as SVG `<text>`. The hub icons used `dominant-baseline="middle"`, which this icon font renders on the *alphabetic* baseline, so every glyph sat half a glyph-height too high (worse on bigger hubs, which read as "scattered"). Confirmed by measuring `getBBox()` center vs the attr `y` in the live DOM, and that `central` lands at a 0px delta on both axes. Fix: hub icon → `central` (the star already used `central`, so it was correct — a mid-transition screenshot made it look off). Full write-up: **L-013**.

**Back button + panel.** Moved "Back to your results" from top-right to **top-left**. It was top-right precisely because the detail panel docks left; I first solved the collision by docking the panel **right** (built + verified), but Caelan prefers the panel on the left, so I reverted that and instead the left panel now starts a `space-2` gap **below** the back button (`PANEL_TOP_BELOW_BACK` in `CareerMap.tsx`). The `'right'` `MapPaneDock` I'd added was removed, not left as dead code.

**Intro card.** It was 269px tall (3 sentences × 2 lines) and overlapped the Specialist hub. Shrinking alone didn't hold — the overview camera packs the hubs higher on shorter viewports, so at 1280×720 the compact card still overlapped by 59px. The durable fix was to make each sentence one line: trimmed the copy in `narrativeFlow.ts`, widened `--container-map-card` 640→720, dropped the title `h3`→`h4`, tightened the divider. Card is now 165px and clears the hubs from ~720px height up (measured: +15px at 720, comfortable at 900+). Rejected a camera top-reserve because the card auto-collapses on pan/zoom and a reserve would fight the user's own pan.

**Verification.** Everything measured against the live DOM at 1440×900, 1280×720, 390×844 (Playwright `getBBox`/`getBoundingClientRect`): icon deltas 0, back button top-left with no panel overlap, card clears hubs. Full gates re-run after the panel-left revert.

## State at end of session

- Changed (uncommitted on `main`): `src/screens/Results/cards/CareerMap.tsx`, `src/screens/Results/cards/CareerMapHubLabel.tsx`, `src/data/flows/narrativeFlow.ts`, `src/styles/globals.css`. `careerMapLayout.ts` touched then fully reverted (the `'right'` dock) — not in the diff.
- Decision **D-056**, lesson **L-013** recorded.

## Next session

- Nothing required for the map. Two deliberate small limits left as-is, easy follow-ups if Caelan wants them: (1) on **mobile** the full-width intro card covers the corner back button until dismissed (pre-existing — the card was already full-width over the old top-right button, so not a regression); (2) intro-card clearance is comfortable at ≥720px viewport height but can re-touch below ~680px (a dismissible transient card; a camera top-reserve is the only full fix and was rejected for the pan-conflict reason above).
- Otherwise resume the 07-18 queue: the two pending pushes and the post-presentation wrap-up (conditional Pass 5 + registry §6) after Tue 07-21.
