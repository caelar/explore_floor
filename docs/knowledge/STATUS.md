# Status

**Read this first.** Live snapshot of where the build is. Updated as acceptance criteria clear (by `/phase-check` or by hand).

- **Last updated:** 2026-06-25
- **Current focus:** **Narrative career-discovery quiz** — the single live flow after the Phase-4 strip (`DECISIONS.md` D-027, `DATA_MODEL.md` §17). A branching intro (6 MC: experience Q0, education Q1/Q2, salary Q3, two interest MCs Q4/Q5) then **7 day-in-the-life scenes**, each sorting its 4 choices into the 3 buckets **That's me / Kinda me / Not me** (one `SORT_BUCKETS` constant; "Kinda me" scores `MAYBE_WEIGHT` 0 — D-018) via the shared `BucketSort`. Scores four RC.org categories (Operate/Repair/Program/Plan → Operator/Technician/Specialist/Integrator) and lands on the **node-graph results** (top match centered, the other three behind it, tap to swap in; job titles branch off the front → role sheet with fit radar). An always-on **education/pay fit line** reads the intro screeners against each role's ladders (`FitNote` + pure `lib/screenerFit.ts`, role `educationLevel`/`payLevel`, D-019/D-020/D-023). Plus the standalone **`/select` role-select comparator** (pick a role outright from the four `roleDetails` cards, thin "You're set as [Role]" confirmation — **not** a registered flow: no FlowId, no session state, no scoring; D-022, `sessions/2026-06-11-role-select-comparator.md`). The Landing switcher reads **Narrative / Select**. Gates green: lint, typecheck, **49 unit (5 files)**, **3 E2E** (`narrative` / `role-select` / `reduced-motion`). _The **Classic** interest-sort and the **Exam** 30-statement flow were the study's comparison conditions; the narrative won (June study) and both were archived in Phase 4, recoverable at git tag `archive/pre-narrative-only`._ Session handoffs: `sessions/2026-06-25-strip-to-narrative-and-three-roles.md` (the Phase 4/5 plan), `sessions/2026-06-25-realignment-phases-2-3.md`, `sessions/2026-06-22-narrative-v3-language-and-intro-scoring.md`.
- **Phase 1 status:** complete — all gates green; design-review passed all four classic screens with no p1/p2 findings. Built in 3 slices: Sort, Results (the conversion screen), Landing reveal + Build beat.
- **Open items (for step 8, the high-fidelity results screen):** define what the match percentage means in one plain line (the #1 content gap from testing); frame an entry-level result as a starting rung with a visible path up, not a verdict; wire match-explanation onto the narrative (`categoryBreakdown.ts` is kept, currently unwired); re-introduce a **category-keyed** programs set (the live results surface zero programs today — the known "somewhere to go" gap, since `programs`/`programSelection` were deleted in Phase 4); redesign the Landing hero (frees the `scene/*` token removal) and retone `arm-blue`. Then a graded `/design-review` against `results-screen.md`. The on-canvas title scatter was simplified to a tray (collision) and still wants a polish pass.
- **Next up:** **Phase 5 of the realignment sweep — collapse the four categories to ARM's three roles** (`REALIGNMENT.md` §9 step 6b + `sessions/2026-06-25-strip-to-narrative-and-three-roles.md`, the plan of record). Branch `narrative-v3-realign`. **Done:** the foundation slice (D-024), Phase 2 spec re-centering (D-025), Phase 3 gate rewrite (D-026), and **Phase 4 — the strip to narrative (D-027):** Classic deleted + Exam archived, build is narrative-only on four categories, E2E 7 → 3, `archive/pre-narrative-only` is the recovery tag. **Phase 5** collapses Operate+Repair → entry **Technician** (national median $45,936, HS/GED), Program → **Specialist**, Plan → **Integrator** (ARM's June 2026 three-role structure, `docs/reference/ARM Updated Role Structure - Source Content.md`); renames the `CategoryId` literals to `technician/specialist/integrator`; recomputes the per-category maxes; flips the diamond node-map/radar geometry to a triangle (`CATEGORY_ANGLES` + `FitRadar`); and **rewrites** (not drops) the `CLAUDE.md` hard rule, sweeping the whole file plus `verifier`/`data-author` to the live three roles. Order within the phase: re-cut the 7 scenes 4→3 choices and the canonical content spec **first**, then the rename + array-shrink + recompute as one typecheck-gated pass. Then **step 8** — the high-fidelity narrative results screen on the kit tokens (the open items above); the old conveyor "feel pass" stays **superseded**. Quick follow-up: trim the now-dead `howler` devDependency (`audio.ts` is gone).

---

## Harness bootstrap (this session)

- [x] Reconcile cross-doc contradictions (see `DECISIONS.md` 2026-05-29).
- [x] Onboarding substrate: `.mcp.json`, `.env.example`, `.gitignore`, root `README.md`, `.nvmrc`.
- [x] Knowledge layer scaffolded (`docs/knowledge/`).
- [x] Rubrics authored (`docs/rubrics/`: design-system-compliance, goose-game-aesthetic, motion-quality).
- [x] Subagents (`.claude/agents/`: verifier, design-reviewer).
- [x] Skills (`.claude/skills/`: data-author, scene-motion).
- [x] Slash commands (`.claude/commands/`: phase-check, design-review, compound, capture-figma, pull-figma).
- [x] `.claude/settings.json` permission allowlist.
- [x] `CLAUDE.md` + `ARCHITECTURE.md` updated for the harness.
- [x] Toolchain skills installed — GSAP + Framer Motion skills present (stored in `.agents/skills/`, symlinked into `.claude/skills/`, pinned in `skills-lock.json`).
- [x] Built-in memory mirror written.

---

## Phase 0 — Scaffold & foundation (complete — 10/10)

_Last `/phase-check`: 2026-05-29 — `verifier` PASS on all gates (lint, typecheck, 30 unit tests, e2e happy-path) and all `DATA_MODEL.md` §15 invariants; re-confirmed post-commit on branch `phase-0-scaffold`. Tailwind v4 (CSS-first `@theme`) adopted instead of v3 — see `DECISIONS.md` D-013. Also fixed the stale ROADMAP §1.4 "Innovator=24" typo → 27 (matches §15 + committed data)._

Acceptance criteria (from `ROADMAP.md` §1):

- [x] `pnpm dev` runs without errors.
- [x] `pnpm lint` passes.
- [x] `pnpm typecheck` passes.
- [x] `pnpm test:unit` passes scoring, assembly, program-selection tests (30 tests, incl. `data-integrity`).
- [x] `pnpm test:e2e` passes the happy-path Playwright test.
- [x] A human can click `/` → `/results` with no console error (e2e asserts zero console errors across the flow).
- [x] Tailwind tokens match the Figma file's variables (spot-check). Brand colors (arm-yellow `#FFB81C`, arm-orange `#F56A00`, arm-blue `#38A5EE`, arm-teal `#117289`) and the type scale (h1 56/64 … small 14/22) in `@theme` match `DESIGN_SYSTEM.md` §2–§4, which the file owner confirms were pulled from the Design System file's variables. _(A live MCP variable read was attempted but blocked — the `figma` MCP's variable/context tools are selection-based and `get_metadata` served a stale page snapshot; this is a tooling limit, not a value discrepancy.)_
- [x] Figma MCP connects, a read works, one code-to-canvas capture succeeds (Landing captured into the `explore_floor` file — node `6:2`).
- [x] GSAP AI skills installed and discoverable (`gsap-*` packs in `.claude/skills/`, pinned in `skills-lock.json`).
- [x] Every data sanity check from `DATA_MODEL.md` §15 passes (per-archetype sums **B 22 / I 27 / A 25**).

## Phase 1 — Testable flow (complete)

_Last `/phase-check`: 2026-05-30 — `verifier` PASS on all gates (lint, typecheck, 33 unit across scoring/assembly/program/fit/data-integrity, 4 E2E) and all `DATA_MODEL.md` §15 invariants (sums recomputed Builder 22 / Innovator 27 / Architect 25, plus the new role.skillIds-resolves check). `design-reviewer` PASS on all four screens — no p1/p2 findings. Built in 3 reviewed slices on branch `phase-1-flow`._

Acceptance criteria (from `ROADMAP.md` §2):

- [x] A user can complete the full flow (land → sort 24 → build → results). _(Flow completes end to end; the 3-4 min pacing is a human-test observation.)_
- [x] The Sort screen works via mouse, touch, and keyboard. _(Drag + tap; bins are native buttons so Tab/Enter operability remains. The bespoke arrow-key/Enter mechanic was intentionally removed — `DECISIONS.md` D-015. Full keyboard-nav polish is a Phase 3 a11y item.)_
- [x] Results shows believable weighted match scores across all three archetypes. _(E2E asserts displayed % == engine for a 30/24/23 spread.)_
- [x] The compare interaction works (moving the robot / tapping a card swaps the active read). _(E2E `compare.spec.ts`.)_
- [x] Each role card surfaces programs from the mock data. _(top-3 via `selectProgramsForRole`.)_
- [x] All Playwright tests pass, including the compare interaction. _(4/4.)_
- [x] No console errors on any screen. _(happy-path + reduced-motion specs assert zero console errors across the flow.)_
- [ ] **Demoable to the MHCI cohort; survives 5 unmoderated sessions.** _(Human user-test item — for the team to confirm in testing. Build is technically demoable: flow completes, no crashes in automated runs.)_

## Phase 2 — Feel pass (not started)
Criteria in `ROADMAP.md` §3. Sort interaction model refined — see `DECISIONS.md` D-014.

## Phase 3 — Polish (not started)
Criteria in `ROADMAP.md` §4.
