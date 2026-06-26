# Status

**Read this first.** Live snapshot of where the build is. Updated as acceptance criteria clear (by `/phase-check` or by hand).

- **Last updated:** 2026-06-26
- **Current focus:** **Narrative career-discovery quiz** — the single live flow after the Phase-4 strip + the Phase-5 three-role pivot (`DECISIONS.md` D-027/D-028, `DATA_MODEL.md` §17). A branching intro (6 MC: experience Q0, education Q1/Q2, salary Q3, two interest MCs Q4/Q5) then **7 day-in-the-life scenes**, each sorting its 3 choices into the 3 buckets **That's me / Kinda me / Not me** (one `SORT_BUCKETS` constant; "Kinda me" scores `MAYBE_WEIGHT` 0 — D-018) via the shared `BucketSort`. Scores ARM's **three live roles** (Technician entry / Specialist mid / Integrator planning) and lands on the **node-graph results** (top match centered, the other two behind it, tap to swap in; job titles branch off the front → role sheet with triangle fit radar). An always-on **education/pay fit line** reads the intro screeners against each role's ladders (`FitNote` + pure `lib/screenerFit.ts`, role `educationLevel`/`payLevel`, D-019/D-020/D-023). Plus the standalone **`/select` role-select comparator** (pick a role outright from the three `roleDetails` cards, thin "You're set as [Role]" confirmation — **not** a registered flow: no FlowId, no session state, no scoring; D-022, `sessions/2026-06-11-role-select-comparator.md`). The Landing switcher reads **Narrative / Select**. Gates green: lint, typecheck, **49 unit (5 files)**, **3 E2E** (`narrative` / `role-select` / `reduced-motion`). _The **Classic** interest-sort and the **Exam** 30-statement flow were the study's comparison conditions; the narrative won (June study) and both were archived in Phase 4, recoverable at git tag `archive/pre-narrative-only`._ Session handoffs: `sessions/2026-06-26-realignment-completion-audit.md` (completion audit + doc-drift cleanup — read alongside the pivot note before step 8), `sessions/2026-06-26-phase-5-three-roles-executed.md` (this pivot), `sessions/2026-06-25-phase-4-strip-executed.md`, `sessions/2026-06-25-strip-to-narrative-and-three-roles.md` (the Phase 4/5 plan), `sessions/2026-06-22-narrative-v3-language-and-intro-scoring.md`.
- **Phase 1 status:** complete — all gates green; design-review passed all four classic screens with no p1/p2 findings. Built in 3 slices: Sort, Results (the conversion screen), Landing reveal + Build beat.
- **Open items (for step 8, the high-fidelity results screen):** define what the match percentage means in one plain line (the #1 content gap from testing); frame an entry-level result as a starting rung with a visible path up, not a verdict; wire match-explanation onto the narrative (`categoryBreakdown.ts` is kept, currently unwired); re-introduce a **category-keyed** programs set (the live results surface zero programs today — the known "somewhere to go" gap, since `programs`/`programSelection` were deleted in Phase 4); redesign the Landing hero (frees the `scene/*` token removal) and retone `arm-blue`. Then a graded `/design-review` against `results-screen.md`. The on-canvas title scatter was simplified to a tray (collision) and still wants a polish pass.
- **Next up:** **Step 8 is now opened and planned in full** — a **dark visual re-architecture** of the whole quiz (re-skin matching ARM's live **My Match** flow + the mockup's **5-screen results system**). Plan of record: **`docs/knowledge/VISUAL_REARCHITECTURE.md`** (7 short phases 0/A–G; `DECISIONS.md` D-029). Phase 0 (plan landing + decision + this status tick) is done; **start a fresh chat at Phase A** (dark tokens + fonts + `AppHeader` shell + Landing). Locked calls: kit-only role palette **gold(Technician)/teal(Specialist)/orange(Integrator)** retiring `arm-blue`; our question set is ground truth; local dark tokens now, shared package deferred; click-to-select with drag dormant. The open items above are folded into the plan (Phase C lands the match-% line, the Technician-as-rung framing, the `categoryBreakdown` wiring, and the programs set; the 3-axis radar is replaced by signal bars). Per-role job + bridge-program content will be **ARM-sourced** via the data-request template (`docs/reference/Job_Program_Data_Request.md`). The old conveyor "feel pass" stays **superseded**. The realignment sweep is complete: foundation slice (D-024), Phase 2 spec re-centering (D-025), Phase 3 gate rewrite (D-026), **Phase 4 strip to narrative (D-027)**, and **Phase 5 — collapse to ARM's three roles (D-028, done):** Operate+Repair → entry **Technician** ($45,936, HS/GED), Program → **Specialist**, Plan → **Integrator**; `CategoryId` renamed `technician/specialist/integrator`; the salary question rebuilt on the real ARM ranges ($45k → technician, $85k/$105k+ → specialist+integrator) with "1-2 years" left unscored so the per-role maxes stay equal at `{11,11,11}`; diamond node-map/radar flipped to a triangle (`CATEGORY_ANGLES` + `FitRadar`); `StatementSortStep`/exam-`kind` removed; `CLAUDE.md` hard rule rewritten + D-017 carve-out retired; `verifier`/`data-author` swept to three roles. Branch `narrative-v3-realign`, all gates green. _(The dead `howler`/`@types/howler` devDeps were trimmed in the D-028 pass; `audio.ts` is gone.)_

---

## Harness bootstrap (this session)

- [x] Reconcile cross-doc contradictions (see `DECISIONS.md` 2026-05-29).
- [x] Onboarding substrate: `.mcp.json`, `.env.example`, `.gitignore`, root `README.md`, `.nvmrc`.
- [x] Knowledge layer scaffolded (`docs/knowledge/`).
- [x] Rubrics authored (`docs/rubrics/`: design-system-compliance, goose-game-aesthetic, motion-quality). _(Point-in-time log — `goose-game-aesthetic` + `motion-quality` were later retired in D-026 and `results-screen` added; the current set is `design-system-compliance`, `results-screen`.)_
- [x] Subagents (`.claude/agents/`: verifier, design-reviewer).
- [x] Skills (`.claude/skills/`: data-author, scene-motion).
- [x] Slash commands (`.claude/commands/`: phase-check, design-review, compound, capture-figma, pull-figma). _(`revise-doc` was ported later in the realignment, D-024.)_
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
