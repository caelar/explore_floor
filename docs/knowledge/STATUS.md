# Status

**Read this first.** Live snapshot of where the build is. Updated as acceptance criteria clear (by `/phase-check` or by hand). Keep this a snapshot: session-by-session detail lives in the `sessions/` notes, linked below, not inline here.

- **Last updated:** 2026-07-17
- **Current focus:** The single live flow is the **narrative career-discovery quiz** (`DATA_MODEL.md` §17; D-027/D-028): a branching 6-question intro, 7 day-in-the-life bucket-sort scenes, and the dark 5-screen **role-cards results** scoring ARM's three roles (Technician / Specialist / Integrator), plus the standalone `/select` comparator. The step-8 dark re-architecture, its polish, and the quiz-flow legibility pass are complete (D-029/D-030; dead drag path removed D-031). Work now lands on `main`. Gates green: lint, typecheck, **82 unit**, **3 E2E** (`narrative` / `role-select` / `reduced-motion`); both design rubrics PASS.
- **Phase 1 status:** complete — all gates green; design-review passed all four classic screens with no p1/p2 findings. Built in 3 slices: Sort, Results (the conversion screen), Landing reveal + Build beat.
- **Open items:** the step-8 content gaps (match-% line, Technician-as-rung framing, `categoryBreakdown` wiring, a programs set) all landed in Phase C. Remaining open work is catalogued in the `REMAINING_WORK.md` router (D-032): `HANDOFF_GUIDE.md` (ARM/Fivestar post-handoff content + our pre-handoff cleanup), `DESIGN_SYSTEM_RUN.md` (the `rc-design-system` build), and `DEFERRED_DIRECTIONS.md` (v4 polish + open scoring calls).
- **Next up:** the **componentization run** (`COMPONENTIZATION_RUN.md` = the ledger). **Passes 0/1/1b done** (D-042/D-043/D-044/D-046) — registry ratified, shared tier (TopNav mega set, PillButton, CtaButton, Chip, forms) built + published + icon-slotted. **Pass 2 + 2b done** (D-045/D-047): Interest Quiz file fully componentized (`FIGMA_MAP.md` §8). **Pass 3 done** (D-048, 2026-07-08): RC.org Captures file's nav (×10) + auth forms (×37) swapped to shared DS instances, local form masters + the Light nav variant retired, Landing OverHero kept local (`robotics_career` FIGMA_MAP §5); frames pixel-faithful bar the sanctioned nav divergence. **Pass 4 sliced into 4a/4b/4c** (D-049; slice map + come-back flags in `COMPONENTIZATION_RUN.md`). **4a — explore_floor: DONE 2026-07-15**, all gates green. **4b dashboard portion: DONE 2026-07-17** (D-051 / dashboard D-062 — radius landed, TopNav a verified no-op, all its gates green). **4b robotics_career tail + 4c — Icon union** remain **deferred** (robotics_career deprioritized). The **ecosystem run** (D-035) is done through Pass 7; only its **stretch pass** remains. All feeds the **late-July client handoff** (`HANDOFF_GUIDE.md`); the componentization run is not a handoff gate.
- **Awaiting Caelan (pushes):** explore_floor `main` is **pushed and current through `85bd155`** (2026-07-17, bar the push-state touch-up commits themselves). career_dashboard is **fully landed**: the 4b slice (`e5038f4`) **merged to `main` and pushed** by Caelan 2026-07-17 (its merged branch ref is deletable at leisure). robotics_career still carries `4872a82` unpushed on `refine/phase-2-loop`. Direct `git push` is denied to the agent. DS-library republish is **current (2026-07-05, through Pass 1b)**; **no republish pending** (the 07-15 token tidy needed none — bound to the existing `Ink 2` primitive).
- **Future direction (documented, not built):** ARM's Fivestar deck (Release 4.3) was analyzed vs. our quiz: comparison + four adopted ideas in `ARM_FIVESTAR_COMPARISON.md`, and a **domain-mirror path to the three AI roles** (keep the 3-tier engine, add a physical/digital domain axis, derive 6 roles at results) in `AI_ROLES_INTEGRATION.md` (`DECISIONS.md` D-034). Build deferred; hard rules unchanged until green-lit.

### Earlier sessions

Newest first; full detail lives in each note.

- 2026-07-17 · D-051 · componentization **4b dashboard portion done** — Phase-5 gate verified settled (merged + pushed), Caelan confirmed go; CtaButton `rounded-sm`→`rounded-md` landed + TopNav closed as a verified no-op, on `chore/componentization-4b-nav` (dashboard D-062; its gates + focused design review all green); robotics_career 4b tail + 4c stay deferred → [note](./sessions/2026-07-17-componentization-pass-4b-dashboard.md)
- 2026-07-15 · D-049 · componentization Pass 4 pre-flight + sliced (4a/4b/4c); **4a — explore_floor done**: new local `CtaButton` (faithful type), guest pill "G", §8 normalizations, orphans deleted, all gates green; 4b/4c deferred → [note](./sessions/2026-07-15-componentization-pass-4a-explore-floor.md)
- 2026-07-08 · D-048 · componentization Pass 3: RC.org Captures file swapped to shared DS instances — 10 logged-out nav (light→dark mega nav) + 37 auth-form instances; 5 local form masters + Light nav variant retired; Landing OverHero kept local; all frames pixel-faithful bar the sanctioned nav divergence → [note](./sessions/2026-07-08-componentization-pass-3-captures-file.md)
- 2026-07-05 · D-047 · componentization Pass 2b: Interest Quiz tail closed — 7 results icon-pill/CTA swaps + 3 net-new local masters (SignalBar/RoleTab/CompareTargetMenu) + StatBox Size=Compact; 20 instances, all frames pixel-faithful, token-clean → [note](./sessions/2026-07-05-componentization-pass-2b-quiz-tail.md)
- 2026-07-05 · D-046 · componentization Pass 1b: shared PillButton + CtaButton gained additive leading/trailing icon slots (defaults off, token-bound per variant), verified non-breaking; awaiting republish → [note](./sessions/2026-07-05-componentization-pass-1b-icon-slot.md)
- 2026-07-05 · D-045 · componentization Pass 2 (partial): Interest Quiz `Components` page + 5 local masters + shared TopNav ×9 / CtaButton swapped; icon-slot + variant tail deferred to Pass 2b → [note](./sessions/2026-07-05-componentization-pass-2-quiz-file.md)
- 2026-07-04 · D-043/D-044 · Pass 1 shared tier built (TopNav mega set reshaped, PillButton, form family) + 3 dashboard boards swapped to In+On → [note](./sessions/2026-07-04-pass-1-shared-tier-and-dashboard-swaps.md)
- 2026-07-04 · componentization Pass 1 (core builds): CtaButton + Chip sets built, CardHead slot reconciled, extraction staged and verified → [note](./sessions/2026-07-04-componentization-pass-1-core-builds.md)
- 2026-07-03 · D-042 · componentization Pass 0: cross-repo audit, four rulings settled, promotion registry ratified in rc-design-system → [note](./sessions/2026-07-03-componentization-pass-0-registry.md)
- 2026-07-03 · D-041 · componentization run planned: ecosystem surveys, Caelan's cluster rulings (nav mega set, buttons, chips, forms, Icon union), run sheet written → [note](./sessions/2026-07-03-componentization-run-planned.md)
- 2026-07-03 · D-040 · ecosystem run Pass 7 remainder: variable-bound screen rebuilds (extension capture + bind pass), steps 7–8 closed → [note](./sessions/2026-07-03-ecosystem-pass-7-remainder.md)
- 2026-07-02 · D-039 · ecosystem run Pass 7 core: dark set published, Interest Quiz file + FIGMA_MAP, precedence flip → [note](./sessions/2026-07-02-ecosystem-pass-7-figma-core.md)
- 2026-07-02 · D-036/D-037 · ecosystem run Pass 6: pre-sync pass — control ladder, weight honesty, code-outward docs → [note](./sessions/2026-07-02-ecosystem-pass-6-presync.md)
- 2026-07-02 · ecosystem run Pass 4: harness ported into `robotics_career` + baseline design review → [note](./sessions/2026-07-02-ecosystem-pass-4-harness-port.md)
- 2026-07-02 · ecosystem run Pass 3: `robotics_career` excavated + six-role content, pushed → [note](./sessions/2026-07-02-ecosystem-pass-3-robotics-career.md)
- 2026-07-02 · ecosystem run Pass 2: `rc-design-system` (`@rc/ui` v1) stood up, both gates PASS → [note](./sessions/2026-07-02-ecosystem-pass-2-rc-design-system.md)
- 2026-07-02 · D-035 · ecosystem run Pass 1: asset rescue + run sheet + GO bookkeeping → [note](./sessions/2026-07-02-ecosystem-pass-1-rescue-and-run-sheet.md)
- 2026-07-01 · D-031/D-032 · docs hygiene + code follow-ups + REMAINING_WORK reorg → [note](./sessions/2026-07-01-hygiene-and-doc-reorg.md)
- 2026-06-30 · virtual-test prep: narrative-only Landing + bold role-overview education → [note](./sessions/2026-06-30-virtual-test-prep-landing-education.md)
- 2026-06-30 · Technician-top + all-low design review (both framing criteria PASS) → [note](./sessions/2026-06-30-technician-top-design-review.md)
- 2026-06-30 · results + quiz polish pass → [note](./sessions/2026-06-30-results-quiz-polish-pass.md)
- 2026-06-30 · D-030 · quiz-flow legibility pass → [note](./sessions/2026-06-30-quiz-flow-legibility-pass.md)
- 2026-06-30 · Phase G polish handoff → [note](./sessions/2026-06-30-phase-G-polish-handoff.md)
- 2026-06-30 · Phase G polish complete → [note](./sessions/2026-06-30-phase-G-polish-complete.md)
- 2026-06-30 · D-029 Phase F · job constellation + job overview → [note](./sessions/2026-06-30-phase-F-constellation-job-overview.md)
- 2026-06-30 · D-029 Phase E · ambient bubble map → [note](./sessions/2026-06-30-phase-E-bubble-map.md)
- 2026-06-30 · Phase D · results compare view → [note](./sessions/2026-06-30-phase-D-results-compare.md)
- 2026-06-29 · quiz-fidelity: back-slide + morph → [note](./sessions/2026-06-29-quiz-fidelity-back-slide-morph.md)
- 2026-06-29 · D-029 Phase C · dark results role-cards → [note](./sessions/2026-06-29-phase-C-results-role-cards.md)
- 2026-06-26 · step-8 visual re-architecture plan → [note](./sessions/2026-06-26-visual-rearchitecture-plan.md)
- 2026-06-26 · realignment completion audit + doc-drift cleanup → [note](./sessions/2026-06-26-realignment-completion-audit.md)
- 2026-06-26 · Phase B · quiz re-skin → [note](./sessions/2026-06-26-phase-B-quiz-reskin.md)
- 2026-06-26 · Phase A · dark token foundation + Landing → [note](./sessions/2026-06-26-phase-A-dark-foundation.md)
- 2026-06-26 · D-028 · Phase 5 three-role collapse executed → [note](./sessions/2026-06-26-phase-5-three-roles-executed.md)
- 2026-06-25 · Phase 4/5 strip-to-narrative + three-roles plan → [note](./sessions/2026-06-25-strip-to-narrative-and-three-roles.md)
- 2026-06-25 · realignment Phases 2–3 → [note](./sessions/2026-06-25-realignment-phases-2-3.md)
- 2026-06-25 · realignment foundation slice → [note](./sessions/2026-06-25-realignment-foundation-slice.md)
- 2026-06-25 · D-027 · Phase 4 strip executed → [note](./sessions/2026-06-25-phase-4-strip-executed.md)
- 2026-06-22 · narrative v3 language + intro scoring → [note](./sessions/2026-06-22-narrative-v3-language-and-intro-scoring.md)
- 2026-06-11 · D-022 · role-select comparator → [note](./sessions/2026-06-11-role-select-comparator.md)
- 2026-06-08 · screener fit + MC race → [note](./sessions/2026-06-08-screener-fit-and-mc-race.md)
- 2026-06-08 · narrative bucket-sort → [note](./sessions/2026-06-08-narrative-bucket-sort.md)
- 2026-06-07 · question-structure study → [note](./sessions/2026-06-07-question-structure-study.md)
- 2026-06-04 · A/B question sets → [note](./sessions/2026-06-04-ab-question-sets.md)
- 2026-05-30 · Phase 1 flow → [note](./sessions/2026-05-30-phase-1-flow.md)
- 2026-05-29 · Phase 0 scaffold → [note](./sessions/2026-05-29-phase-0-scaffold.md)
- 2026-05-29 · docs reconciliation + harness bootstrap → [note](./sessions/2026-05-29-docs-reconciliation-and-harness.md)

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

## Phase 2 — Feel pass — superseded (documented cut)
The original Phase 2 was the conveyor "feel pass" (sound, robotic-arm choreography, the build beat). That scene was never built and is the **documented cut** (`REALIGNMENT.md`; `CLAUDE.md` "Phasing"). The live feel work happened instead in the **step-8 dark re-architecture** (see "Next up" above — DONE). Old criteria: `ROADMAP.md` §3.

## Phase 3 — Polish — partly superseded
The polish that applies to the live narrative flow shipped inside step 8 (copy, reduced-motion, dark a11y, Figma sync); the sound/conveyor/robot polish is the documented cut. Remaining polish + conscious deferrals now live in `docs/knowledge/DEFERRED_DIRECTIONS.md`, with ARM-owned gaps in `HANDOFF_GUIDE.md` and the design-system queue in `DESIGN_SYSTEM_RUN.md`. Old criteria: `ROADMAP.md` §4.
