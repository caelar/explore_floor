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

---

# HANDOFF — executing Phases 2–4 (next session)

## Start here
1. Continue on the existing branch **`narrative-v3-realign`** (do NOT re-branch; it's 5 commits ahead of `main`, working tree clean, gates green: lint / typecheck / 99 unit / 7 E2E).
2. Read, in order: this note → `docs/knowledge/archive/REALIGNMENT.md` (the plan of record, §9 sweep + Appendix A drift catalog) → `STATUS.md`. The full execution plan also lives at `~/.claude/plans/take-a-look-at-swift-curry.md` (won't auto-load in a fresh chat — this note is self-sufficient).
3. **Locked decisions (don't relitigate):** kit-align in-repo now / shared `rc-design-system` package deferred; archive+delete classic; the user reviews between phases. The user wants this run **ultracode-style** — every substantive phase as a Workflow (parallel fan-out + an adversarial-verify stage before each commit), gates green at every commit.

## Execution model
- The doc machinery is installed: drive every spec edit through **`/revise-doc`** (edits the canonical owner) + the **`doc-steward`** subagent (reconciles the other docs). Precedence: `CONTEXT_BRIEF > PRD > DATA_MODEL > DESIGN_SYSTEM > ARCHITECTURE > ROADMAP > CLAUDE.md`.
- Verify each phase with a Workflow before committing (the foundation slice used a 3-skeptic spec audit and a design-review + WCAG/integrity pass — same pattern).

## Phase 2 — re-center specs (doc-only, reversible)
Rewrite each doc's conveyor-vision lead to the narrative-quiz reality (sources: `REALIGNMENT.md` Appendix A):
- `PRD.md` §5.2–5.4 / §6 / §10; `ROADMAP.md` Phase 2 + most of Phase 3; `ARCHITECTURE.md` §3 file tree / §5 scene / §9 3D path; `DESIGN_SYSTEM.md` §3.3 / §3.4 / §10 / §12 (note: §3.1–§3.3 already got a minimal D-024 touch — Phase 2 does the full rewrite); `DATA_MODEL.md` **promote §17 to primary, demote §7 (robot parts) / §10 (robot assembly) / §16 (question sets) to "documented cut"**; `CLAUDE.md` "What this is" / Phasing / repo-structure / Doc map; `README.md` opening.
- **Fold the 3 V3 doc-hygiene notes** from the foundation audit: (a) the Intro-Scoring source doc's table still shows `n-q2-whatever → ['repair']` but the code/decision is `[]` (unscored) — reconcile; (b) the Language-spec's provisional "keep `expectedCategoryMax` 9" is superseded by D-023's 11 — note it; (c) scene-7 shortening is the team-confirmed alternate.
- **Renumber caution:** the ported `/revise-doc` + `doc-steward` reference `DATA_MODEL §17` (flow invariants) + `§15` (sanity checks) **by number**. If you renumber DATA_MODEL when promoting §17, update those two references in `.claude/commands/revise-doc.md` + `.claude/agents/doc-steward.md`.
- Run a **completeness-critic** loop-until-dry: grep the doc set for residual `conveyor|robot|archetype|Builder|Innovator|Architect|Goose|pedestal|assembly.line` after the sweep.

## Phase 3 — rewrite gates (harness-only)
- `.claude/agents/verifier.md` + `.claude/skills/data-author/SKILL.md`: replace the "24 items / Builder 22·Innovator 27·Architect 25 / robot-parts" checks with the **§17 invariants** (mirror what `data-integrity.test.ts` already asserts):
  - Narrative: 6 intro MC steps (Q0–Q5) + 7 scenes; each scene exactly 4 choices, one per category; `expectedCategoryMax = {11,11,11,11}`; `computeCategoryMax(steps)` equals the declared max.
  - Exam: 2 edu screeners + 1 four-way MC + 30 statements interleaved 8/7/7/8 (no adjacent same-category); 3 buckets, middle "Kinda me" scores 0 (`MAYBE_WEIGHT`); `expectedCategoryMax = {operate:11, repair:8, program:10, plan:11}` — **UNEQUAL; do not hardcode 11 across the board.**
  - Shared: `SORT_BUCKETS` is one constant; `roleDetails` complete for all four categories with `educationLevel`/`payLevel` ladders; unique step ids; valid branch targets.
- Rubrics: **retire** `goose-game-aesthetic.md`; **fold** `motion-quality.md`'s surviving (reduced-motion, tokens) criteria into `design-system-compliance.md`; **rewrite** `design-system-compliance.md`'s stale `archetype-mapping` + `scene-namespace` criteria to the four-category/kit world; **author** a results-screen rubric (the node-graph results are currently ungraded — it was exempt under D-017). **Retire/rescope** `.claude/skills/scene-motion/SKILL.md` (it governs the never-built conveyor choreography; the modest UI motion that ships is the Landing GSAP reveal + Motion transitions).

## Phase 4 — archive + delete classic (⚠️ DESTRUCTIVE — pause for user go-ahead first)
Tag `archive/classic-conveyor` BEFORE deleting, then work in dependency order with gates green between steps. **The blast radius is bigger and partly different from `REALIGNMENT.md` Appendix A — corrections below are load-bearing:**

- **⚠️ `gsap.ts` is LIVE, not classic.** `src/screens/Landing/Landing.tsx` imports `gsap, useGSAP` from `@/lib/gsap` and `LandingSceneHint` from `@/scene`, and runs a `useGSAP` reveal on `.scene-draw`; `main.tsx` also imports `gsap.ts` (plugin registration). **Do NOT delete `gsap.ts`.** Appendix A is wrong on this.
- **⚠️ The live Landing renders the conveyor placeholder.** Deleting `src/scene/LandingSceneHint.tsx` (+ the `scene-*` tokens) removes the Landing's hero visual. **This needs a product/design decision** ("what does the Landing show now?") — surface it, don't silently delete. Could be a simple interim or folded into step 8.
- **⚠️ 3 of the 7 E2E specs are classic-flow tests** and will break: `tests/e2e/happy-path.spec.ts`, `compare.spec.ts` (2 tests), `reduced-motion.spec.ts` — all drive `/sort` → build → "three role cards". Live specs to keep: `narrative.spec.ts`, `exam.spec.ts`, `role-select.spec.ts`. So the **E2E gate drops from 7 to ~3**; re-baseline it. **Decide `reduced-motion`'s fate** — rehome that coverage onto a live flow (narrative/exam) rather than lose it.
- **Source to delete:** `src/scene/LandingSceneHint.tsx` + `RobotPlaceholder.tsx` (after the Landing decision); `screens/Sort/Sort.tsx`, `Sort/RoundBeat.tsx`, `Build/Build.tsx`, `Results/ClassicResults.tsx`, `Results/Pedestal.tsx`, `Results/RoleCard.tsx`, `Results/ProgramList.tsx`, `Results/FourPartRead.tsx`; `lib/scoring.ts`, `robotAssembly.ts`, `fit.ts`, `programSelection.ts`, `audio.ts` (verify truly unused first); `components/accent.ts` (classic archetype colors — keep `categoryAccent.ts`, the live one).
- **Data to delete:** `items.ts`, `robotParts.ts`, `roles.ts`, `competencies.ts`, `skills.ts`, `programs.ts`, `colorSchemes.ts`, `rounds.ts`, `resultsCopy.ts`, `questionSets/setA.ts` + `questionSets/index.ts`, `flows/classicFlow.ts`. (Verify `resultsCopy.ts`/`rounds.ts` are classic-only — the live results screens import the `@/data` barrel but use the flow's own `resultsCopy` field.)
- **Tests:** delete `scoring.test.ts`, `fit.test.ts`, `programSelection.test.ts`, `robotAssembly.test.ts`; edit `data-integrity.test.ts` to drop the §15/§16 classic blocks (24-item sums, robot parts, colorSchemes, roles/competencies/skills/programs) — keep the §17 flow assertions.
- **Surgical edits to LIVE files:** `flows/index.ts` (drop `classic` from the registry + `flowList` + the `FlowId` type); `state/sessionStore.ts` + `state/useQuestionSet.ts` (remove the `flow.kind === 'classic'` import + branches); `lib/index.ts` + `data/index.ts` (prune the classic exports — KEEP the live ones the results screens import); `types.ts` (remove the classic types — `ArchetypeId`/`Role`/`InterestItem`/`QuestionSet`/`ColorScheme`/`RobotPart`/etc.; keep the §17 category types).
- **`CLAUDE.md`:** drop the "exactly three role families" hard rule + the D-017 carve-out, and remove `/src/scene` from the repo-structure block. **Coordinate with Phase 2** — CLAUDE.md is rewritten in both; do it once (either fold the hard-rule edit into the Phase-2 CLAUDE rewrite, or sequence Phase 4's CLAUDE edit after).

## Deferred (do NOT do as part of the sweep)
- **Step 8 (product):** the high-fidelity narrative results screen; the restrained-palette **four-category accent system + the `arm-blue` retone** (`arm-blue` fails AA at 2.7:1 as text — that's the trigger); the Landing hero-visual replacement.
- **The shared `rc-design-system` package** (cross-repo) — user deferred it.

## Stale pointer (cleanup, low priority)
`RoboticsCareer_Project_Master_Context.md` is referenced by the **parent** `Capstone/CLAUDE.md` (Cowork's domain) and doesn't exist on disk; the repo-level `CLAUDE.md` does NOT reference it. Flag for the parent; nothing to fix in-repo.
