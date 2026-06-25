# 2026-06-25 — Realignment: Phases 2–3 (spec re-centering + gate rewrite)

Ran the reversible half of the realignment sweep (`REALIGNMENT.md` §9) on branch `narrative-v3-realign`. Two commits, both gates-green, each preceded by an adversarial-verification workflow. **Paused before Phase 4** (the destructive deletion) for user go-ahead, as planned.

## What we did (2 commits)

**Phase 2 — re-center the spec set (`a65bb1c`, D-025).** Every spec doc now leads with the live narrative quiz; the conveyor/robot/three-archetype/Goose-game vision is demoted to clearly-marked **"documented cut"** (the 3D-path treatment). `DATA_MODEL.md` §17 is promoted to the **primary** model via banners, **not renumbered** (renumbering would ripple through every `§`-reference + the ported `/revise-doc`/`doc-steward`). Touched PRD, DATA_MODEL, DESIGN_SYSTEM, ARCHITECTURE, ROADMAP, CLAUDE.md, README; light reconciliation of CONTEXT_BRIEF (research findings preserved); as-built notes folded into the 3 V3 reference docs (`n-q2-whatever`→`[]`, max→11, scene-7 shortened). **Kept on purpose** (Phase 4's job): the three-role hard rule + D-017 carve-out + `/src/scene` in CLAUDE.md. Verified by a 4-skeptic workflow + `doc-steward`; caught a pre-existing falsehood (`DATA_MODEL §17` said `defaultFlowId='classic'`; live is `'narrative'`) and several DESIGN_SYSTEM live-table residuals, all fixed.

**Phase 3 — re-point the gates (`7bc3646`, D-026).** `verifier` + `data-author` now headline the §17 flow invariants (classic demoted to a "validated until Phase 4" footnote), mirroring `data-integrity.test.ts`. Retired `goose-game-aesthetic` + `motion-quality` rubrics (motion folded into `design-system-compliance`, which is rewritten to the four-category accent map + kit surface discipline); authored `results-screen.md` (the node-map/dashboard were ungraded). Rescoped `scene-motion` to the live motion (Landing reveal + Motion transitions + bucket-sort drag + node-map compare). Reconciled `design-reviewer` + `HARNESS.md`. Verified by a 2-skeptic workflow, **zero findings**.

## State at end
- Branch `narrative-v3-realign`, **8 commits ahead of `main`**, working tree clean. Gates green: **lint, typecheck, 99 unit, 7 E2E**.
- `docs/rubrics/` now holds exactly `design-system-compliance.md` (incl. motion) + `results-screen.md`.
- **At the pause checkpoint before Phase 4.**

## Next — Phase 4 (DESTRUCTIVE, needs user go-ahead)
The full plan + the load-bearing corrections are in the **2026-06-25 foundation handoff** (`sessions/2026-06-25-realignment-foundation-slice.md`, the "Phase 4" section). Headlines, do not lose:
- **`gsap.ts` is LIVE, not classic** (imported by `main.tsx` for plugin registration + `Landing.tsx` for the reveal). Do NOT delete it (Appendix A is wrong on this).
- **`/src/scene` survives — both placeholders are live-referenced (correction to the handoff's "delete both" line).** Verified by grep this session:
  - `LandingSceneHint` → the live **Landing hero** (`Landing.tsx:86`). Deleting it removes the hero visual; redesigning it is a step-8 product decision, not a Phase-4 blocker. Keeping it also keeps the `scene/*` tokens (it's their only live reader).
  - `RobotPlaceholder` → the live **exam dashboard anchor** (`ExamResults.tsx:63`, tinted by the top category). **Keep it.** It's *also* imported by the classic `ClassicResults.tsx` + `Build.tsx` (those go), but the exam use is live.
  - So Phase 4 **keeps `/src/scene` and does NOT remove `/src/scene` from `CLAUDE.md`'s repo-structure** (that handoff step is superseded). Scene-token removal waits for the step-8 Landing redesign.
- **3 of 7 E2E specs are classic** (`happy-path`, `compare`, `reduced-motion`) and will break; the gate re-baselines 7 → ~3. **Rehome `reduced-motion`** coverage onto a live flow rather than lose it.
- Tag `archive/classic-conveyor` BEFORE deleting; work in dependency order, gates green between steps. Delete the classic **screens** (`Sort`, `Build`, `Results/ClassicResults` + `Pedestal`/`RoleCard`/`ProgramList`/`FourPartRead`), **lib** (`scoring`, `robotAssembly`, `fit`, `audio`, `programSelection` if unused), **data** (`items`, `roles`, `robotParts`, `colorSchemes`?, `rounds`, `resultsCopy`, `questionSets/`), and **tests**; edit `data-integrity.test.ts` to drop the classic §15/§16 blocks (keep §17). Then drop the three-role hard rule + D-017 carve-out from `CLAUDE.md`, prune the classic types from `types.ts`, and reconcile the docs' "documented cut" sections (the deletion makes the code match what the specs now say).
