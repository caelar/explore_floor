# 2026-06-25 — Realignment: foundation slice

Adapted the realignment memo (`REALIGNMENT.md`) into an ultracode-native execution and ran the foundation slice (Phase 1 of the in-repo sweep). Branch `narrative-v3-realign`, four commits, every gate green, two adversarial-verification workflows.

## Decisions locked (user)
- Kit-align tokens **in-repo now**; defer the shared `rc-design-system` package.
- **Archive+delete** the dormant classic code (disposition decided; executes in a later slice).
- **Foundation slice first, then reassess.**

## What we did (4 commits)
1. **V3 committed (`5a44200`).** Branched off `main` (the branch-first rule was broken — V3 sat uncommitted). Before committing, an adversarial workflow (3 parallel skeptics) audited the V3 diff against its two team spec docs and re-derived the §17 invariants: all surfaces conform, `computeCategoryMax = 11`/category confirmed, zero blocker/minor. Three doc-hygiene notes (the team's source spec docs predate the resolved decisions) deferred to Phase 2. Added `REALIGNMENT.md` (`02b6f0f`).
2. **Doc machinery ported (`1c98d17`).** `/revise-doc` + `doc-steward` from the dashboard, adapted to this repo's flow world (precedence keyed to the §17 flow invariants + §15 sanity checks; entities reworded to `FlowId`/`CategoryId`/role names). Installs the tool the Phase-2 spec sweep runs through. Both now register in the harness.
3. **Tokens kit-aligned (`15e6e4f`, D-024).** `globals.css` → the RC UI Kit palette: `arm-yellow`→`arm-gold` (value `#ffb81c` kept, propagated to 7 consumers), `arm-orange`→`#bf5309` (AA-safe), `text-default` navy-slate→charcoal `#262626`, `border-default`→opaque `#e0e0e0`, Material triple-shadows→two soft tiers, `radius-sm` 4→6. `arm-blue` kept as a **TEMP** holdout (the live `program` accent + links need it). Verified by a design-review (7 live screens, regression-free) + WCAG/integrity workflow: the orange revalue **fixed a pre-existing AA failure** (repair accent + FitNote heads-up: 3.02→4.71); `arm-blue` text stays AA-failing (2.7) — pre-existing, deferred to step 8.

## State at end
- Branch `narrative-v3-realign`, 4 commits ahead of `main`. Gates green: **lint, typecheck, 99 unit, 7 E2E**. Working tree clean.
- At the **reassess checkpoint**.

## Next (remaining sweep — authored in the plan / `REALIGNMENT.md` §9)
- **Phase 2 — re-center specs** (doc-only) via `/revise-doc` + `doc-steward` + a completeness critic: PRD/ROADMAP/ARCHITECTURE/DESIGN_SYSTEM/DATA_MODEL/CLAUDE/README/STATUS off the conveyor vision. Fold the 3 V3 doc-hygiene notes (esp. the Intro-Scoring doc's `n-q2-whatever` table → `[]`).
- **Phase 3 — rewrite gates** (harness-only): `verifier` + `data-author` → §17 invariants; retire `goose-game-aesthetic`; fold `motion-quality` into `design-system-compliance`; author a results-screen rubric; retire/rescope `scene-motion`.
- **Phase 4 — archive+delete classic** (DESTRUCTIVE): tag `archive/classic-conveyor`, delete classic source/data/tests, strip `flow.kind==='classic'` from `sessionStore`/`useQuestionSet`, drop `classic` from the registry, split `types.ts`, drop the "exactly three role families" hard rule. Blast radius is bigger than `REALIGNMENT.md` Appendix A — it touches live state files. **Pause before this one.**
- **Step 8 (product):** the high-fidelity narrative results screen + the restrained-palette category-accent decision (the `arm-blue` retone).
