# Handoff — virtual-test prep: Landing strip + role-overview education, 2026-06-30

**Read after `STATUS.md`.** Two small, Caelan-requested revisions on top of the committed Phase-G
build, in prep for the **virtual** test round. Branch `narrative-v3-realign`. Gates at handoff:
**lint ✓, typecheck ✓, 82 unit ✓, 3 E2E ✓**. Committed.

## What we did

1. **Role-overview education → bold single line (matches salary).** On the role-cards "The role" tab
   (`RoleTabRole.tsx`) and the job-overview tab 0 (`JobOverview.tsx`), education rendered as the
   muted, multi-line bulleted `EducationList` (which surfaced "Master's (sometimes preferred)"). Both
   now render **`detail.educationShort`** in the salary box's exact treatment
   (`font-heading text-h4 text-text-on-dark`) — one bold line ("Bachelor's", "High school"), so the
   two stat boxes are balanced in weight + height. Same pattern the constellation side rail
   (`JobSidePanel`) already used. Dropped "Master's" by design (Caelan's call). The now-unused
   **`EducationList.tsx` was deleted** (zero remaining refs).

2. **Landing stripped to narrative-only (virtual test round).** Removed the **flow switcher**
   (`SegmentedControl`) and the **dev "skip to results"** button from `Landing.tsx`, so a tester's
   only action is the Start CTA. **Functionality kept** per Caelan: the `selectFlow` + `devSeedResults`
   store actions, the `/select` route, and `begin()`'s condition routing all remain — only the UI is
   gone, so restoring the switcher later re-enables the select arm with no other change. The dead
   local bindings + unused imports (`SegmentedControl`, `flowList`, `LandingConditionId`) were
   dropped to keep gates green; `SegmentedControl` stays exported (shared component).

3. **E2E specs updated to the narrative-only Landing.** `narrative` + `reduced-motion` now click Start
   directly (dropped the `flow-narrative` segment click + aria-pressed assertions); the retake
   assertion checks `start-cta` visible instead of the gone switcher. `role-select` navigates straight
   to the comparator via **`/#/select`** (HashRouter) since the switcher no longer surfaces it. Still
   3 E2E, all green.

## State at end of session

- **Committed** on `narrative-v3-realign`.
- Files: `Landing.tsx` (M), `RoleTabRole.tsx` (M), `JobOverview.tsx` (M), `EducationList.tsx` (D),
  `tests/e2e/{narrative,reduced-motion,role-select}.spec.ts` (M).
- Gates: lint ✓, typecheck ✓, **82 unit** ✓, **3 E2E** ✓. Visually self-checked via Playwright
  (Landing narrative-only; Specialist + Technician role tabs; "Robotics Programmer" job overview — all
  show the bold education line beside the bold salary).
- **Deviation from the Phase-G plan:** `VISUAL_REARCHITECTURE.md` §6 Phase G says delete the dev-skip
  button **and** the `devSeedResults` store action. We removed the UI but **kept the action** (Caelan's
  call — it's already DEV-only / stripped from production). Remove the action too at the formal handoff
  if desired.

## Next session

- **Biggest still-open Phase-G item:** a **Technician-top** `/design-review` to grade
  `technician-is-a-rung` (p1) + `low-signal-graceful` (p3), which can't be graded from the usual
  Specialist-top capture. (Offered this session; deferred.)
- Responsive story for the desktop-first constellation/map (confirm whether virtual testers are
  desktop-only first — if so it stays deferrable).
- Job/trajectory/fit copy still ARM-placeholder (`docs/reference/Job_Program_Data_Request.md`).
