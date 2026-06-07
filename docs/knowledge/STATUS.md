# Status

**Read this first.** Live snapshot of where the build is. Updated as acceptance criteria clear (by `/phase-check` or by hand).

- **Last updated:** 2026-06-07
- **Current focus:** **Question-structure study instrument** for the first user test (inserted between Phase 1 and Phase 2 — `DECISIONS.md` D-017, `DATA_MODEL.md` §17). Three selectable **flows** with a researcher switcher on Landing: **Classic** (the Phase 1 interest sort, unchanged), **Narrative** (branching intro MC + 7 drag-a-pick scenes), **Exam** (background MC + a 30-statement 3-bucket sort). The two new flows score four RC.org categories (Operate/Repair/Program/Plan) and each has its **own results** presentation: Narrative → an **Obsidian-style node graph** (top match centered, the other three behind it, tap to swap in; job titles branch off the front → role sheet), Exam → a **dashboard** (robot anchor + category bars + "why you scored that way" + "your roles"). Both share the role detail sheet (fit radar). Robot build skipped in the new flows this iteration (easy to re-enable; the exam dashboard shows a static robot anchor only). Maybe bucket scores 0 (tunable). Gates green: lint, typecheck, **86 unit**, **6 E2E**. The §16 A/B language test + set B are **retired** (superseded — D-017). Session handoff: `sessions/2026-06-07-question-structure-study.md`.
- **Phase 1 status:** complete — all gates green; design-review passed all four classic screens with no p1/p2 findings. Built in 3 slices: Sort, Results (the conversion screen), Landing reveal + Build beat.
- **Open items (D-017):** background questions (narrative Q1–Q3, exam Q1–Q2) carry empty category weights — the team's mapping rationale is unrecovered; schema-ready to add later. Two `??`-flagged narrative choices ship as-authored. The on-canvas title scatter was simplified to a tray (collision) — wants a polish pass + a `/design-review` on the new screens.
- **Next up:** run the study on this build (compare the three conditions), then Phase 2 — feel pass (the conveyor scene, the robotic arm, the robot building live, the Goose-game landing). Criteria in `ROADMAP.md` §3. Build to the **refined sort model** logged in `DECISIONS.md` D-014: the user drags parts off the belt into two bins; the arm assembles the kept parts onto the robot behind the line.

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
