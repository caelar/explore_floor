# 2026-06-25 — Phase 4 executed: stripped the build to the narrative flow (D-027)

Executed the destructive half of the realignment sweep. The prototype is now **narrative-flow-exclusive on the four-category model**. Committed as **D-027 (`67debef`)**. This note is the execution handoff; the forward plan (Phase 5) lives in `sessions/2026-06-25-strip-to-narrative-and-three-roles.md`, which stays the plan of record.

## State at end (start a new chat here)
- Branch **`narrative-v3-realign`**, **13 commits ahead of `main`**, working tree **clean**.
- Recovery tag **`archive/pre-narrative-only`** (`ed69503`, a docs-only commit) holds the full pre-strip code (all Classic + Exam). Roll back from there if needed.
- **Gates green:** lint, typecheck, **49 unit (5 files)**, **3 E2E** (`narrative` / `role-select` / `reduced-motion`).
- **Live surface:** the narrative flow + the `/select` comparator. `FlowId = 'narrative'`; registry/`flowList` narrative-only; node-map results; **still four categories** (`operate/repair/program/plan`). Landing switcher reads **Narrative / Select**.

## What this session did (the six gates-green groups)
1. **Commit the planning docs + tag** the recovery point (`ed69503`, `archive/pre-narrative-only`).
2. **Tests-first trim** — deleted the 4 classic lib tests, trimmed `data-integrity.test.ts` to the §17 blocks, dropped the exam asserts from `screenerFit.test.ts`.
3. **Delete Exam** — removed the exam consumers (`Results/exam/*`, the `Results.tsx` branch, the `screenerFit.ts` `flowId==='exam'` branch, `StatementSortView`, the `FlowRunner` statementSort branch), then `examFlow.ts`, then narrowed the registry. Deleted `exam.spec.ts` (it broke typecheck).
4. **Delete Classic** — screens, libs (`scoring`/`robotAssembly`/`fit`/`audio`/`programSelection`), data (incl. `programs`/`competencies`/`skills`), components (`MatchIndicator`/`accent`/`RoundIndicator`), `scene/RobotPlaceholder`, `state/useQuestionSet`. Rewrote `sessionStore.ts` + `types.ts` narrative-only; narrowed `FlowId → 'narrative'`, `currentScreen → landing|flow|results`; dropped `RoleId` + classic `SessionState` fields; router dropped `/sort` + `/build`.
5. **E2E re-baseline** — deleted `happy-path`/`compare`/`exam`/`helpers`; rewrote `reduced-motion.spec` onto the narrative flow (coverage preserved). Switcher auto-culled to Narrative / Select (it filters `flowList`).
6. **Docs/gates/verify** — `doc-steward` reconciled the 7 spec docs (Exam → documented cut, Classic → deleted-recoverable); retargeted `verifier.md` + `data-author` + the 2 rubrics to narrative four-category; verified by an adversarial diff skeptic (no breakage, no orphans), which caught + fixed one stale ARCHITECTURE line and four stale code comments. Logged D-027, ticked STATUS.

## Settled decisions (don't relitigate)
- **`categoryBreakdown.ts` KEPT** (pure, tested, unwired) — it's the step-8 match-explanation engine.
- **`programs`/`competencies`/`skills` DELETED** — the live results surface **zero programs** today (the known "somewhere to go" gap; a category-keyed set returns at step 8).
- Strip (Phase 4) kept separate from the 4→3 pivot (Phase 5) on purpose.

## Next session — Phase 5 (the 4→3 role pivot)
Full plan: `sessions/2026-06-25-strip-to-narrative-and-three-roles.md` (Phase 5 section) + `REALIGNMENT.md` §9 step 6b. Mapping source: `docs/reference/ARM Updated Role Structure - Source Content.md`. **Order matters: re-cut the content to three roles FIRST (5a), then the mechanical rename + array-shrink + recompute as one typecheck-gated pass (5b).** Mapping: Operate+Repair → entry **Technician** (national median **$45,936**, HS/GED, built from the old **Operate/Operator** content), Program → **Specialist**, Plan → **Integrator**.

**Phase-4 carry-overs Phase 5 must finish (deferred on purpose):**
- **`CLAUDE.md`** is untouched — Phase 5 **sweeps the whole file** and **rewrites** (not drops) the "three role families" hard rule to the live three roles, retires the D-017 carve-out. Grep `four categor` / `all four` / `three role families` / `Operate/Repair/Program`.
- **`types.ts`** still has `StatementSortStep`/`SortStatement` and `CategoryFlow.kind`'s `'exam'` arm — Phase 5 drops them.
- **`categoryBreakdown.test.ts`** fixture currently has `id: 'narrative', kind: 'exam'` (a minimal Phase-4 patch) — Phase 5 re-cuts it narrative-shaped.
- **`howler` + `@types/howler`** are now dead devDeps (`audio.ts` is gone) — quick `pnpm remove` trim.

**Gotchas a fresh chat must internalize:**
- **Name-collision trap (load-bearing):** the new **entry** Technician is built from the old **Operate/Operator** card, **never** the old `repair` card (whose `roleName` is already `'Technician'`, a mid role). Reason from job-activity text, not the matching string. `narrative.spec`'s name-collision assertions flip: the node that yields "Technician" becomes the Operate-derived entry role at $45,936.
- **`RoleId` is already deleted**, and its literals were `technician/specialist/integrator` — exactly what Phase 5 renames `CategoryId` to, so the rename is collision-free. Good.
- **`nodeLayout.ts` `CATEGORY_ANGLES` + `FitRadar.tsx`** need the diamond→triangle geometry change — a **required typecheck fix** in 5b (a 3-key weights object against a 4-key `Record<CategoryId>` is a hard error), not deferrable. The "is a 3-axis radar even right" aesthetic question defers to step 8.
- **`zeroWeights()` in `categoryScoring.ts`** is a hardcoded 4-key literal — derive it from `CATEGORIES` so it can't drift.
- **Test re-baseline scope (wider than it looks):** `data-integrity.test.ts`, `narrative.spec.ts`, **`role-select.spec.ts`** (hardcodes `toHaveCount(4)` + `repair`/`program` testids), and the unit specs `nodeLayout.test.ts` / `categoryScoring.test.ts` / `screenerFit.test.ts` (all full of 4-key literals).
- **Auto-classifier guard:** editing `.claude/agents/verifier.md` and `.claude/skills/data-author/SKILL.md` trips a "self-modification of agent config" denial — needs explicit user approval to proceed. Phase 5 rewrites both to the three-role invariants, so expect that prompt.

Out of scope for Phase 5 (step 8, separate): the high-fidelity results screen — define the match %, frame the entry Technician as a starting rung, wire `categoryBreakdown` onto the narrative, reintroduce category-keyed programs, Landing hero redesign, `arm-blue` retone, resolve the 3-axis-radar viz. Then a graded `/design-review` against `results-screen.md`.
