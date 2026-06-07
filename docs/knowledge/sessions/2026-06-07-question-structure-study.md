# 2026-06-07 — Question-structure study: three flows, four categories, per-flow results

Built the research instrument for the first user test: which **question structure** is most engaging / most trusted. Replaces the planned §16 A/B *language* test (set B was never authored). Logged as `DECISIONS.md` D-017, schema in `DATA_MODEL.md` §17. Branched between Phase 1 and Phase 2; all on `phase-1-flow`, 12 commits, gates green throughout.

## What we did

**Three selectable flows** (`src/data/flows/`, registry `flows/index.ts`, `flowList` Narrative/Exam/Classic, `defaultFlowId: 'classic'`). `Flow` is a discriminated union: `ClassicFlow` wraps the existing set A `QuestionSet` **by reference** (Phase 1 pipeline untouched); `CategoryFlow` (narrative/exam) declares ordered `steps`.
- **Narrative** — 5 intro MC (Q1 branches Yes→Q2 / No→Q3), then 7 day-in-the-life **scenes** (drag a pick into a zone, tap fallback).
- **Exam** — 2 background MC + 1 mapped MC, then a **30-statement sort** into 3 buckets (That's me / Maybe / Not me).

**Four categories** (`CategoryId` operate/repair/program/plan → Operator/Technician/Specialist/Integrator), **parallel to** the three archetypes — no change to `ArchetypeId`/`RoleId`/`roles.ts`. New results render from new `roleDetails.ts` (keyed by category). Operator lives only in the category world.

**Pure libs (TDD):** `lib/categoryScoring.ts` (branch-aware path walk, per-category normalization, `MAYBE_WEIGHT = 0` tunable), `lib/categoryBreakdown.ts` (`categoryContributions` — reuses the exported `walkPath`, powers the exam "why you scored"), `lib/nodeLayout.ts` (`polarPoint`/`fanPoints`/`radarPoints`; `ringRadius` removed with the rings).

**State:** `sessionStore` renamed `questionSetId`→`flowId` (same next-to-state, survives-`reset()` mechanism — D-016); added `recordAnswer`/`recordStatement`/`advanceStep`/`completeFlow`; category flows never touch `robot`. New `useFlow()`; `useQuestionSet()` resolves through the classic flow.

**Screens:** `/flow` → `FlowRunner` (renders the current step by type: `MCQuestion`, `SceneStepView`, `StatementSortView`; navigation declarative off `currentScreen` so completion can't race the redirect). Generalized `DragSortCard<T>` + `DropZone<T>` out of the old SortCard/SortBin (classic Sort wraps them, behavior identical). `/results` dispatches by `flow.kind`: classic → `ClassicResults` (verbatim move), narrative → node graph, exam → dashboard.

**Per-flow results** (the study compares these too):
- **Narrative** = an **Obsidian-style node graph** (`Results/category/`). Top match front-and-center; the other three behind it (arced above, faded); tap one → it swaps into the center (Motion `layout`); the heading names the centered role ("Your top match" vs "You're exploring"). Active role's job titles branch off the front on hairline connectors → role sheet. **Rebuilt from an initial concentric-rings version that read as "funky"** (the user's redirect, with planet/Obsidian references + a wireframe). Then sized the orbs up — job nodes are 56px button-circles, not 12px dots.
- **Exam** = a **dashboard** (`Results/exam/`): a robot anchor (static `RobotPlaceholder`, tinted by top category via new `CATEGORY_ACCENT_TEXT`) + four category bars; "Why you scored that way" (provenance) + "Your roles" (top-2 → role sheet).
- **Shared** `RoleDetailSheet` + `FitRadar` (RC.org content + four-axis radar). `jobTitle` optional (role-level open from Your roles). **The user confirmed this card "looks good" — leave it.**

**Tests:** data-integrity gains §17 per-flow invariants (7 scenes × 4 one-per-category, branches forward, 30 statements 8/7/7/8 interleaved, declared == computed max). New unit tests for categoryScoring/categoryBreakdown/nodeLayout. New `narrative.spec` + `exam.spec` e2e (engine-equal %s, branch skip, all three buckets, swap, title→sheet, condition survives retake). Retired set B + `question-set-b.spec`. **86 unit, 6 E2E green.**

## State at end of session

- Gates green: lint, typecheck, **86 unit**, **6 E2E**. Working tree clean; all committed on `phase-1-flow`.
- Verified visually via Playwright: both new flows end-to-end, the node-graph swap (4- and 5-title counts), the exam dashboard, the role sheet + radar.
- Robot build/beat **skipped** in both new flows by design — re-enable later via a per-flow `'build'` step/flag routed through `/build` (not built).
- Docs current: `DATA_MODEL.md` §16 (superseded) + §17, `DECISIONS.md` D-017, `PRD.md` §8/§14, `STATUS.md`, `CLAUDE.md` hard-rule carve-out, spec doc corrections, data-author skill. `QUESTION_SET_WORKSHEET.md` marked superseded.

## Next session

1. **Open item (D-017, flagged by the user):** the background questions (narrative Q1–Q3, exam Q1–Q2) are meant to map to something — the team's rationale is unrecovered, so they ship with empty `MCChoice.categories: []`. Schema-ready; adding weights is a data edit. **Chase the rationale with the team before running the study.**
2. Two `??`-flagged narrative choices ("IT club" scene 4, "Writing code" scene 6) ship as-authored — confirm with the team.
3. Optional polish (not blocking): a `/design-review` pass — but note the goose-game aesthetic rubric conflicts with the deliberate minimal/neutral study presentation; grade against intent, not the rubric. Robot-anchor return + any tint decisions if the build beat comes back.
4. Run the study (compare the three conditions), then fold findings into Phase 2 (`ROADMAP.md` §3, build to D-014).
