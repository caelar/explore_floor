# 2026-06-25 — Realignment: Phases 2–3 (spec re-centering + gate rewrite)

Ran the reversible half of the realignment sweep (`REALIGNMENT.md` §9) on branch `narrative-v3-realign`. Two commits, both gates-green, each preceded by an adversarial-verification workflow. **Paused before Phase 4** (the destructive deletion) for user go-ahead, as planned.

## What we did (2 commits)

**Phase 2 — re-center the spec set (`a65bb1c`, D-025).** Every spec doc now leads with the live narrative quiz; the conveyor/robot/three-archetype/Goose-game vision is demoted to clearly-marked **"documented cut"** (the 3D-path treatment). `DATA_MODEL.md` §17 is promoted to the **primary** model via banners, **not renumbered** (renumbering would ripple through every `§`-reference + the ported `/revise-doc`/`doc-steward`). Touched PRD, DATA_MODEL, DESIGN_SYSTEM, ARCHITECTURE, ROADMAP, CLAUDE.md, README; light reconciliation of CONTEXT_BRIEF (research findings preserved); as-built notes folded into the 3 V3 reference docs (`n-q2-whatever`→`[]`, max→11, scene-7 shortened). **Kept on purpose** (Phase 4's job): the three-role hard rule + D-017 carve-out + `/src/scene` in CLAUDE.md. Verified by a 4-skeptic workflow + `doc-steward`; caught a pre-existing falsehood (`DATA_MODEL §17` said `defaultFlowId='classic'`; live is `'narrative'`) and several DESIGN_SYSTEM live-table residuals, all fixed.

**Phase 3 — re-point the gates (`7bc3646`, D-026).** `verifier` + `data-author` now headline the §17 flow invariants (classic demoted to a "validated until Phase 4" footnote), mirroring `data-integrity.test.ts`. Retired `goose-game-aesthetic` + `motion-quality` rubrics (motion folded into `design-system-compliance`, which is rewritten to the four-category accent map + kit surface discipline); authored `results-screen.md` (the node-map/dashboard were ungraded). Rescoped `scene-motion` to the live motion (Landing reveal + Motion transitions + bucket-sort drag + node-map compare). Reconciled `design-reviewer` + `HARNESS.md`. Verified by a 2-skeptic workflow, **zero findings**.

## State at end
- Branch `narrative-v3-realign`, **8 commits ahead of `main`**, working tree clean. Gates green: **lint, typecheck, 99 unit, 7 E2E**.
- `docs/rubrics/` now holds exactly `design-system-compliance.md` (incl. motion) + `results-screen.md`.
- **At the pause checkpoint before Phase 4.**

---

# PHASE 4 — execution plan (DESTRUCTIVE; needs user go-ahead). Blast radius verified this session.

**Goal:** archive then delete the dormant classic three-archetype / conveyor / robot code so the build matches the re-centered specs. Tag first; gates green between steps.

## Start here (next session)
1. Continue on `narrative-v3-realign` (do NOT re-branch). 9 commits ahead of `main`, tree clean, gates green (lint, typecheck, 99 unit, 7 E2E).
2. Read: this note → `STATUS.md` → `REALIGNMENT.md` §5/§9 + Appendix A. Then **verify-before-delete** each file below (the protocol: confirm no live importer before `git rm`).
3. **Get explicit user go-ahead** (this is irreversible). Settle the one open product decision (programs, below) first.

## KEEP — verified LIVE, do NOT delete (corrects the foundation handoff's "delete both scene files" line)
- **`src/lib/gsap.ts`** — `main.tsx` (plugin registration) + `Landing.tsx` (the reveal).
- **`src/scene/` (both files survive):** `LandingSceneHint` = the live Landing hero (`Landing.tsx:86`, and the only reader of the `scene/*` tokens); `RobotPlaceholder` = the live exam dashboard anchor (`ExamResults.tsx:63`). So **do NOT delete `/src/scene` and do NOT remove `/src/scene` from `CLAUDE.md`'s repo-structure.** Scene-token removal waits for the step-8 Landing redesign.
- **`src/components/categoryAccent.ts`** (live). Verify `components/accent.ts` is classic-only (it's the archetype colors; `ClassicResults`/`RoleCard` use it) before deleting it.
- All of `src/data/flows/` **except** `classicFlow.ts`; `roleDetails.ts`; `roleSelect.ts`.
- `src/lib`: `categoryScoring`, `screenerFit`, `categoryBreakdown`, `nodeLayout`, `motion` (+ `gsap`).
- Screens: `Landing/`, `Flow/`, `Results/Results.tsx` (the dispatcher — **edit**, don't delete), `Results/category/`, `Results/exam/`, `Select/`.
- State: `sessionStore`, `useFlow`, `useQuestionSet` (all **edit** to drop classic branches).

## DELETE — verified classic-only (reached only by barrels + classic screens + classic tests)
- **Screens:** `Sort/Sort.tsx`, `Sort/RoundBeat.tsx`, `Build/Build.tsx`, `Results/ClassicResults.tsx`, `Results/Pedestal.tsx`, `Results/RoleCard.tsx`, `Results/ProgramList.tsx`, `Results/FourPartRead.tsx`.
- **Lib:** `scoring.ts`, `robotAssembly.ts`, `fit.ts`, `audio.ts` (all classic-only; no live importer).
- **Data:** `items.ts`, `roles.ts`, `robotParts.ts`, `colorSchemes.ts`, `rounds.ts`, `resultsCopy.ts`, `questionSets/setA.ts` + `questionSets/index.ts`, `flows/classicFlow.ts`. (`components/accent.ts` too, after the verify above.)
- **Tests:** `scoring.test.ts`, `fit.test.ts`, `programSelection.test.ts`, `robotAssembly.test.ts`.

## ⚠️ OPEN DECISION — `programs` / `competencies` / `skills` / `programSelection` (settle before deleting)
**Verified this session: NO live screen imports any of them — the live four-category results currently surface ZERO training programs.** They're reached only by the barrels, the classic `roles.ts`, the classic screens, and `data-integrity`. So they're *technically* classic-only and deletable now. **But** the new `results-screen.md` rubric ("somewhere-to-go") and `REALIGNMENT.md` §4 both say the step-8 results should show programs/listings. And `programs.ts` is keyed by the classic `RoleId`s, so it'd need a category-aware re-cut for the live results anyway.
- **Recommended:** delete all four now (clean; no orphaned data once `roles.ts` goes), and re-introduce a **category-keyed** programs set when step 8 wires the "somewhere to go" section. Flag this so step 8 doesn't forget it's a known gap.
- **Alternative:** keep `programs`/`competencies`/`skills` as a seed — but with `roles.ts` deleted they'd be orphaned (no validator, no consumer) until step 8, which is dead weight. Not recommended.

## Surgical edits to LIVE files
- `data/flows/index.ts`: drop `classic` from the registry, `flowList`, and the `FlowId` type.
- `state/sessionStore.ts` + `state/useQuestionSet.ts`: remove the `flow.kind === 'classic'` import + branches (and the dev-only `globalThis.__sessionStore` handle if only the classic E2E used it — verify against `tests/e2e/helpers.ts`).
- `screens/Results/Results.tsx`: drop the `classic → ClassicResults` dispatch branch (keep narrative→node map, exam→dashboard).
- `lib/index.ts`: prune the classic exports (`scoring`, `robotAssembly`, `fit`, `audio`, `programSelection` per the decision). Keep the live exports the results screens import (`nodeLayout` helpers, `screenerFit`, `categoryBreakdown`, `motion`).
- `data/index.ts`: prune the classic exports. Keep `roleDetails`, `flows`, `roleSelect`, and (per the decision) `programs`/`competencies`/`skills`.
- `data/types.ts`: remove the classic types (`ArchetypeId`, `Role`, `InterestItem`, `QuestionSet`, `ColorScheme`, `RobotPart`/`RobotState`/`RobotContribution`/`RobotSlot`, `ScoreResult`, `ArchetypeWeights`, `Decision`, `RoundId`, `ARCHETYPE_TO_ROLE`, etc.). Keep the §17 category types (`CategoryId`, `Flow`/`FlowStep` union, `CategoryResult`, `RoleDetail`, `CategoryWeights`, `SORT_BUCKETS`/`BucketId`, `CATEGORIES`).
- `lib/__tests__/data-integrity.test.ts`: delete the `describe.each(questionSetList)` (§15/§16) block, the `§16 cross-set` block, and the `§15 shared-data` block (or trim it to whatever shared data survives the programs/competencies/skills decision). **Keep** the `§17 flow invariants`, `§17 narrative/exam shape`, and `§17 cross-flow` blocks.

## E2E re-baseline (7 → ~4)
- **Delete:** `tests/e2e/happy-path.spec.ts`, `tests/e2e/compare.spec.ts` (both drive the classic `/sort`→build→three-role-cards flow).
- **Rehome:** `tests/e2e/reduced-motion.spec.ts` — rewrite to assert the **narrative** flow works under `prefers-reduced-motion` (the default flow), so the reduced-motion coverage survives. (Exam is the fallback if narrative's drag is awkward under reduced motion.)
- **Keep:** `narrative.spec.ts`, `exam.spec.ts`, `role-select.spec.ts`.
- Update `tests/e2e/helpers.ts` (drop the classic dev-store helper if unused after the deletes).

## CLAUDE.md (the Phase-4 half — coordinate with the Phase-2 rewrite already done)
- Drop the **"exactly three role families" hard rule** and the **D-017 carve-out** (the live model is just the four categories now). Simplify the "recommendation across all three (classic) or all four (study flows)" rule to "across all four RC.org categories."
- Update the repo-structure `/data` + `/lib` lines to drop the now-deleted classic files. **Leave `/src/scene`** (live); update its one-line note to "placeholders: the Landing hero + the exam dashboard anchor" (no classic robot).
- The "What this is" realignment note can drop its "which is why the hard rules still mention three role families" clause once the rule is gone.

## globals.css
- The `scene/*` tokens **stay** (LandingSceneHint reads them) until the step-8 Landing redesign. `arm-blue` **stays** (program accent + links, retoned at step 8). No token deletions this phase.

## Order (dependency-safe; run gates green between groups)
1. `git tag archive/classic-conveyor` (BEFORE any delete; this is the recovery point).
2. Delete the 4 classic lib tests; trim `data-integrity.test.ts` to the §17 blocks. (`pnpm test:unit` should drop from 99 to the §17-only count and stay green.)
3. Delete the classic screens; edit `Results.tsx` dispatcher + `flows/index.ts` + `sessionStore`/`useQuestionSet` to drop classic branches. (`pnpm typecheck` + dev sanity.)
4. Delete the classic lib + prune `lib/index.ts`.
5. Delete the classic data + prune `data/index.ts`.
6. Prune the classic types from `types.ts`. (`pnpm typecheck` — this is where dangling type refs surface.)
7. E2E re-baseline (delete 2, rehome reduced-motion).
8. CLAUDE.md hard-rule + repo-structure edits.
9. Full gates green (lint, typecheck, unit, the ~4 E2E). Then an adversarial **verify workflow** (mirror Phases 2-3): a skeptic for "orphaned data / dangling import / broken live path," a skeptic for "did the deletion match the documented-cut spec sections," + the gate run.
10. Commit (one commit, or a couple by group), log **D-027**, tick `STATUS.md`. The deletion makes the code finally match what the Phase-2 specs already say.

## After Phase 4 (not part of it)
Step 8 — the high-fidelity narrative results screen on the kit tokens: define the match %, frame Operator as a rung, re-introduce category-keyed programs (the "somewhere to go" gap), redesign the Landing hero (frees the `scene/*` token removal), and retone `arm-blue`. Then a graded `/design-review` against the new `results-screen.md` rubric.
