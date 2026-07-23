# 2026-07-23 — Career-map detail panels reverted to the pre-Kayla docked rail + standalone job page

## Resume here

- **State:** The results career-map detail panels are reverted (**D-058**) from Kayla's floating single-shell `MapContextPanel` back to the pre-Kayla **docked `JobSidePanel` two-step rail** + the **standalone large `JobOverview` page** (`view: 'job-overview'`), re-hosted on the *same* new zoomable `CareerMapField` + pane-aware camera. The persistent "Back to your results" exit platter is gone: back lives in the rail header per phase (left-aligned, vertically-centered glass pill), plus an **overview-only** exit pill top-left. New map + quiz structure untouched. All gates green (typecheck, lint, 102 unit, 4 E2E). Committed on `main`; **push is Caelan's**.
- **Next action:** Nothing required — the revert is complete and Caelan approved the visual. Open threads if he wants them: (1) any further rail/intro-card fine-tuning; (2) a `/design-review` pass (skipped this session — he gave visual approval directly, and the MCP screenshot tool kept stalling on the ambient-field canvas, so verification was DOM-measured).
- **Open holds:** `HANDOFF_GUIDE.md` rewrite still deferred to wrap-up (unchanged from D-057). Push of this commit + the D-057 line pending Caelan.

## What we did

Caelan flagged that the current career-map panels (floating panel that crossfaded role↔job in one shell under a "CAREER PATH"/"JOB" kicker, a persistent back platter, and a shrunk in-panel job) felt less polished and the interactions read as weird. He wanted his original pre-Kayla design back **1:1**, keeping only the new map + the new quiz structure.

Grounded the revert in git first (three Explore agents + `git show`): the redesign was a single commit `b10231d` (Pass 2c); its parent `9b420da` still holds the intact `JobOverview`, and `9b420da` also preserves the constellation-era `JobSidePanel`. Confirmed neither old commit matches exactly what he wanted (9b420da was one-step with no role rail; the constellation era had the rail) — so this is **the constellation-era two-step rail assembled onto the new map**, not a pure git revert. Caelan chose the **two-step** flow (role rail → compact job → "Job overview →" → big page) over one-step.

Executed:
- **Restored** `JobSidePanel.tsx` (docked rail, role + compact-job bodies, teal footer CTAs) and `JobOverview.tsx` (the large three-tab page) from `9b420da`; `JobOverview` adapted to the current single-arg `ResultsPanel` (dropped the removed `embedded`/`floating` variant).
- **`CareerMap.tsx`** — deleted the persistent platter + the `MapContextPanel` block; docks `JobSidePanel` at role/job phase; renders the overview-only "Back to your results" glass pill; keeps the `CareerMapField` call **with `paneDock`** so the pane-aware camera is unchanged.
- **`useResultsNav.ts`** — re-added `openJobOverview`, `backToJob`, and `'job-overview'` in `ResultsView`.
- **`ResultsExperience.tsx`** — added the `view === 'job-overview'` branch (full-bleed `JobOverview` over the shared `AmbientField`) + rewired the `CareerMap` callbacks (`onRoleOverview` → cards view, `onOpenJobOverview` → the big page).
- **Deleted** `MapContextPanel.tsx`, `MapPanelRole.tsx`, `MapPanelJob.tsx`.
- **Copy** (`narrativeFlow.ts` + `types.ts` `ResultsExploreCopy`) — re-added `overviewBack` / `roleOverviewCta` / `jobOverviewCta`, retired `panelKickerRole` / `panelKickerJob`; updated the `lib/__tests__/fixtures.ts` copy fixture.
- **E2E** (`narrative`, `reduced-motion`) — rewrote the map assertions to the two-step flow (`job-side-panel` / `job-panel-back` / `job-overview-cta` → `job-overview`).

Two follow-up tweaks Caelan asked for after the first pass, both verified via DOM (the screenshot tool stalls on the canvas):
- The **overview** back control → the glass **pill** (not plain text), kept overview-only.
- The **rail-header** back control → in a **glass pill too**, **left-aligned** and **vertically centered** in the header band.

Verified the three restored states live (overview pill + static intro; docked role rail; compact job body; large job page via DOM). Confirmed the two footer CTAs already match the standardized button system: shared `CtaButton` at `size="lg"` (36px `h-control-lg`, `rounded-md` 8px), teal `#117289` per the kit's interactive voice — same component/size as the flow's `Continue` CTA.

## State at end of session

- **D-058** logged (DECISIONS.md index + full entry). Reverses **D-054** (CM-12 panel-only) and the persistent-back-platter part of **D-053/D-056** (CM-09).
- Spec docs reconciled via **doc-steward**: `DATA_MODEL.md` §17, `ARCHITECTURE.md` (file tree), `DESIGN_SYSTEM.md`, `PRD.md` §5.0 as applicable; `CAREER_MAP_REVIEW.md` got "superseded by D-058" notes at CM-10/CM-12 (its landed history left intact).
- Gates: typecheck ✅, lint ✅ (zero warnings), 102 unit ✅, 4 E2E ✅.
- Change set: `JobSidePanel.tsx` + `JobOverview.tsx` new; `CareerMap` / `useResultsNav` / `ResultsExperience` / `narrativeFlow` / `types` / fixtures / 2 E2E specs modified; 3 panel components deleted.

## Next session

- Push (Caelan) if not already done.
- Optional: a `/design-review` pass on the reverted rail + big page once the screenshot tooling cooperates.
- Otherwise back to the wrap-up queue (HANDOFF_GUIDE rewrite, conditional componentization Pass 5) — unchanged by this session.
