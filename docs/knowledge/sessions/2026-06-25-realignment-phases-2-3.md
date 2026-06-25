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
- **`gsap.ts` is LIVE, not classic** (Landing reveal + plugin registration). Do NOT delete it (Appendix A is wrong on this).
- **The live Landing renders the conveyor placeholder** (`LandingSceneHint`). Deleting it removes the hero visual — surface a product decision, don't silently delete.
- **3 of 7 E2E specs are classic** (`happy-path`, `compare`, `reduced-motion`) and will break; the gate re-baselines 7 → ~3. **Rehome `reduced-motion`** coverage onto a live flow rather than lose it.
- Tag `archive/classic-conveyor` BEFORE deleting; work in dependency order, gates green between steps. Then drop the three-role hard rule + `/src/scene` from CLAUDE.md and split `types.ts`.
