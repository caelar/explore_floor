# Status

**Read this first.** Live snapshot of where the build is. Updated as acceptance criteria clear (by `/phase-check` or by hand).

- **Last updated:** 2026-05-29
- **Current focus:** Phase 0 — scaffold & foundation — **complete (10/10)**. All gates green; tokens verified against the Design System source values.
- **Next up:** Phase 1 — testable flow (real one-at-a-time drag-to-bin sort with rounds, the Results compare interaction, top-3 programs per role, Phase 1 Playwright tests). Criteria in `ROADMAP.md` §2. _Optional:_ a byte-level live Figma-variable diff (needs the Foundations frame selected in the Figma desktop app — the MCP's variable/context tools are selection-based).

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

## Phase 1 — Testable flow (not started)
Tracked when Phase 0 closes. Criteria in `ROADMAP.md` §2.

## Phase 2 — Feel pass (not started)
Criteria in `ROADMAP.md` §3.

## Phase 3 — Polish (not started)
Criteria in `ROADMAP.md` §4.
