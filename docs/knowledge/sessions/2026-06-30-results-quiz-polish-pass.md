# Handoff — results + quiz polish pass (Claude Design realignment), 2026-06-30

**Read this after `STATUS.md`.** A follow-up polish pass on top of the committed Phase G
(`efe5797`), fixing a fresh batch of issues Caelan found on a live walk. All changes are in the
**working tree, uncommitted** (branch `narrative-v3-realign`, 22 files). Gates green at handoff:
**lint ✓, typecheck ✓, 80 unit ✓, 3 E2E ✓**. Graded `/design-review`: **PASS on both rubrics**
(the p2 + the one actionable p3 were fixed this session; see below).

Reference (ground truth for everything but copy): Claude Design `Quiz to Results.dc.html`, project
`df8d5f31-2435-4a09-9382-6af1d62f9b59`, read via the **DesignSync MCP** (`get_file`). The README in
that project is the plain-English spec.

---

## What changed (by the issue Caelan raised)

1. **Quiz scene→scene "lurch" + over-broad swipe** — `Flow/FlowRunner.tsx`, `SceneSortView.tsx`,
   `BucketSort.tsx`.
   - Every step now **top-anchors** (`justify-start pt-space-7`); the liked intro→rating "slide-up"
     is produced by a **shrinking spacer** in `SceneSortView` (the reference's `qSpacer`), not by
     flex-centering. The scene-context card top is now stable across a scene change (measured: 180px
     on Scene 1 and Scene 2 intro; morphs to 124px in rating) — no cross-scene vertical jump.
   - `BucketSort`: the `x: 130→0→-90` slide now wraps **only the prompt card** (`scene-card`); the
     rating rows (`bucket-*`) + helper text are a **static sibling**. Per-choice lit/acted state
     hoisted to `BucketSort` (reset on `current.id`, pre-lit from `bucketOf` via a ref). Side win:
     the rows' focus ring is no longer clipped by the slide's `overflow-hidden` (Phase-B a11y note).

2. **Constellation labels overlap the center + too small** — `lib/constellationLayout.ts`,
   `ConstellationField.tsx`, `ConstellationNode.tsx`, `data/jobs.ts`, `types.ts`,
   `data-integrity.test.ts`, `docs/reference/Job_Program_Data_Request.md`. Enlarged (center r 96→120,
   node r 64→78, orbit 210→280, view 1040×640→1040×760 so it uses the vertical space).
   **Follow-up (Caelan): every role now features exactly 4 jobs**, laid out at the **four corners**
   like the Claude Design reference (`constellationLayout` special-cases count===4 to corner offsets,
   wider than tall; polar ring kept as a fallback for other counts) — every label sits **below** its
   node and clears the center (no more "labels on top"). `jobs.ts`: Specialist + Integrator dropped
   their 5th featured title (Robotic Systems
   Engineer / Advanced Industrial Integrator); Technician gained a 4th ("Robotics Maintenance
   Technician", placeholder) — all recorded in the ARM data-request doc for confirmation. The
   `data-integrity` job-count invariant is now 4/4/4. **Node stars enlarged** 32→52 to fill the
   bigger circles (renders ~49px in the 156px node). Verified live: 4 nodes, zero label↔center
   overlap on Integrator (longest titles) and the others, ring centered/not clipped.

3. **Side panel strays from the reference** — `JobSidePanel.tsx`, `StatBox.tsx`, `roleDetails.ts`,
   `types.ts`, `data-integrity.test.ts`. Bordered header back-nav; **compact** Salary/Education stat
   chips (new `StatBox` `compact` + new `RoleDetail.salaryShort`/`educationShort` short single-line
   values at `text-small`, balanced — both 78px on Technician); **teal** footer button for both
   "Role overview" and "Job overview" (was neutral-glass / gold). Teal is the kit's documented
   interactive voice; gold stays reserved for encouragement CTAs (Continue / Set as target). New
   `--color-arm-teal-soft` hover token.

4. **Cards background + arrows + gutter-click + stat boxes** — `ResultsExperience.tsx`,
   `ResultsPanel.tsx`, `RoleHero.tsx` (+ `ResultsMap`/`ResultsConstellation` lost their per-view
   AmbientField). The `<main>` is now **always full-bleed** with **one shared `AmbientField`** behind
   every view; `ResultsPanel` is **translucent glass** (`bg-glass-panel` + `backdrop-blur-panel`), so
   cards/compare/job-overview float over the same orb field as the map/constellation (an intentional
   divergence from the reference's flat cards panel — Caelan's call, for consistency). Prev/next
   arrows aligned to the role-title row (`RoleHero` `mt-space-6`). A **gutter click-layer**
   (`cards-gutter`) behind the cards panel → map (or constellation when `fromMap`). The cards-tab
   "big" salary/education boxes stay the reference equal-pair treatment. _Caveat: the gutter only has
   room to click when the viewport exceeds the 1248px panel (`max-w-lg` = `--container-lg` here, not
   512px) — a desktop-wide convenience; the explicit "Skip to map" button always works. Responsive is
   still the deferred Phase-G story._

5. **Map "Back to matches" removed** — `ResultsMap.tsx`, `ResultsExperience.tsx`, `narrativeFlow.ts`,
   `types.ts`, `fixtures.ts`. It was a staged artifact; the reference map is the hub (arrive via Skip,
   leave by diving into a role). Dropped the button, the `onBack` prop, and the `ResultsMapCopy.back`
   key.

6. **Job-overview chevron + trajectory** — `JobOverview.tsx`, `TrajectoryViz.tsx`,
   `exploreContent.ts` (+ `types.ts`/`index.ts` cleanup). The top-right button chevron now points
   **right** (trailing `arrow-r`), matching the other onward "Explore … →" controls. "Where this can
   lead" was **rebuilt** from the job-branch diamond into a vertical **role-tier growth ladder**
   (Technician→Specialist→Integrator): current tier lit in accent with "You're here", higher tiers
   labelled "N roles to explore", lit climb connectors — telling "this is a starting place, room to
   grow" in the constellation's sparkle/dashed language. Background is now a **role-tinted glow over
   glass** (replaces the old purple handoff gradient). The dead `careerTrajectory` placeholder
   (data + type + re-export) was removed (its only consumer was the old diagram).

## Design-review fixes applied this session
- p2 `glass-from-tokens` (TrajectoryViz): the rung fill → `var(--color-glass-fill)`, the unlit
  connector → `var(--color-constellation-line)` + `strokeOpacity 0.32` (was ad-hoc `rgba()`s).
- p3 `balanced-pair`: compact chip value dropped to `text-small` so Technician's "High school / GED"
  fits one line (chips now equal height).
- p3 `gold-reserved` (inert "Set as target role" gold pill): **left as-is** — reference-faithful
  documented chrome (the mockup styles it gold; it's a known no-op stub).
- p3 `low-signal-graceful`: **unverified** — the dev-skip seed only produces a Specialist-top result,
  so an all-low-score screen couldn't be driven. Structurally supported; wants a Technician-/low-top
  capture to grade (carry-over).

## State / gotchas for next time
- Branch `narrative-v3-realign`, **uncommitted** (Caelan commits). Phase G is committed at `efe5797`.
- Dev server `pnpm dev` → `/explore_floor/` (port varies; was 5177). Reach results fast via the
  Landing **dev-only** "skip to results" button (`dev-skip-to-results`) — still present, **DEV-only**,
  slated for removal before the handoff.
- **Screenshot results screens with the blur-off trick** (the `blur(52px)` orbs + backdrop-blur time
  out the MCP screenshot): inject
  `[style*="blur(52px)"]{filter:none!important} *{backdrop-filter:none!important}` first. The orbs are
  SOFT in production — solid-looking captures are the blur-off artifact. The Playwright MCP writes
  screenshots to the **repo root** (`./name.jpeg`) — delete them before committing (this session's
  were cleaned).
- The E2E specs needed **no changes** (DOM-compatible); they still walk every results screen.
- Carry-overs: the desktop-first **responsive** story (gutter-click, constellation/map sizing);
  the **low-signal** results-screen grade; remove the dev "skip to results" control for the handoff.
