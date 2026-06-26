# CLAUDE.md

This file is the operating manual for this repo. Read it fully at the start of every session before touching code. It is intentionally short. When you need depth, follow the pointers to `/docs`.

---

## What this is

An interactive, narrative career-discovery experience for **RoboticsCareer.org** (RC.org), the ARM Institute's workforce platform. A user walks through a day in their life, sorting the choices each scene offers into three buckets (That's me / Kinda me / Not me), and lands on a results screen that recommends how they match ARM's three robotics career roles (Robotics Technician, Specialist, Integrator). It replaces three weak existing tools on the site (Explore the Floor, My Goal, Interest Quiz) with one focused, engaging flow. This ships as the single **Narrative** flow (`DATA_MODEL.md` §17).

> **Realignment (2026-06, Phases 4–5 done).** The original concept, a stylized assembly-line sort that built a custom robot, is the **documented cut**: it was never built as a scene and its scaffolding (Classic flow + the Exam study condition) was deleted in Phase 4 (D-027, recoverable at git tag `archive/pre-narrative-only`). The live build is the **narrative quiz only**, and as of Phase 5 (D-028) it scores ARM's live **three-role** structure (Technician / Specialist / Integrator), collapsed from the four categories the study used. Plan of record: `docs/knowledge/REALIGNMENT.md`; live model: `DATA_MODEL.md` §17.

This is a **high-fidelity prototype**, not production code. It exists to (a) prove the concept to the ARM client and (b) be tested with real users. ARM's dev team would rebuild from it later. Optimize for clarity, feel, and iteration speed, not for production hardening.

## What this is NOT

Do not build any of the following unless explicitly asked:

- Authentication, accounts, login, or sign-up. None.
- A backend, database, or real API. All data is local and mocked.
- Real ARM platform integration, SkillsMatch wiring, or live job/training feeds.
- Heavy accessibility or i18n work. Basic semantic HTML and keyboard sanity only.
- The "professional track" (adult job-seeker version). It is a documented stub only. See `PRD.md`.
- 3D / WebGL. The prototype is 2D. A future 3D path is documented in `ARCHITECTURE.md` but is not in scope now.

If a task seems to require any of the above, stop and flag it rather than building it.

## Who it is for

Late-stage high school students looking at training programs after graduation. Not middle schoolers. Not adult career switchers (that is the stub track). Tone is encouraging, plainspoken, and a little playful. Never childish, never corporate. Reading level around 9th grade.

## The "why" in three sentences

Research found the barrier to robotics manufacturing careers is not lack of interest, it is lack of specificity: a large "maybe" group can't picture what the work actually looks like, so they never convert. RC.org's current quizzes make this worse by shoving people into a single prescriptive role bucket with no sense of what the work is or how they'd grow into it. This experience fixes that by letting users *try on* the field through concrete interests and see themselves across multiple real roles, with an honest read on what fits and what they'd build. Full context in `CONTEXT_BRIEF.md`.

---

## Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Build | Vite | Fast dev loop. |
| Language | TypeScript | Strict mode on. |
| UI | React 18 | Function components and hooks only. |
| Styling | Tailwind CSS (v4, CSS-first) | All design tokens live in the `@theme` block in `src/styles/globals.css` (loaded via `@tailwindcss/vite`). No magic hex values in components. |
| Animation (UI) | Motion (ex-Framer Motion) | React-state-driven motion: screen + flow-step transitions, the bucket-sort drag, the node-map compare swap, `prefers-reduced-motion`. |
| Animation (scene) | GSAP + plugins | The one live use is the Landing `DrawSVG` reveal; `@gsap/react` for `useGSAP`. _(The cinematic build beat and conveyor choreography GSAP was chosen for are the documented cut.)_ The two libraries share a motion-token file and never animate the same property on the same node. |
| Scene rendering | SVG (React components) | The live SVG is the results geometry (node map, fit radar). _(The composed-SVG assembly line is the documented cut.)_ |
| State | Zustand | One store per domain. No Redux. |
| Audio | Howler.js | _(Documented cut: sound was a Phase 3 seasoning, never integrated.)_ |
| Testing | Vitest + Playwright | Vitest for pure-function units (the category scoring engine especially, `data-integrity`); Playwright for the flow E2E specs (narrative / role-select / reduced-motion). |
| Package manager | pnpm | |
| Lint/format | ESLint + Prettier | Run before considering a task done. |

If you want to add a dependency, check `ARCHITECTURE.md` first. Prefer the stack above over reaching for new libraries.

## Repo structure

```
/docs                 All planning docs (read these, do not duplicate their content in code comments)
/public               Static assets, fonts
/src
  /app                App shell, routing, top-level providers
  /screens            Landing, Flow (the narrative runner), Results (the node-map results), Select
  /scene              [documented cut] LandingSceneHint only; the conveyor/robot scene was never built
  /components         Shared UI (buttons, sort cards, segmented control, accents)
  /state              Zustand stores (sessionStore, useFlow)
  /data               Mock data: the flow (§17, live), roleDetails (three roles), screeners, roleSelect
  /lib                Pure helpers: categoryScoring (the brain), screenerFit, categoryBreakdown, nodeLayout
  /styles             Tailwind v4 entry + the @theme design-token block (globals.css)
/tests                Playwright specs (narrative / role-select / reduced-motion)
src/styles/globals.css  Design tokens via Tailwind v4 @theme. Single source of truth for color/type/spacing (motion tokens live in src/lib/motion.ts).
```
See `ARCHITECTURE.md` §3 for the full tree and `DATA_MODEL.md` §17 for the live data model.

## Core conventions

- **Small files, split by responsibility.** A screen orchestrates: layout, state reads, event handlers. It does not hold a reusable sub-element's JSX, inline business logic, or more than one distinct UI concern. When any of those appear, extract them (logic into `/lib`, data into `/data`, sub-UI into `/components` or `/scene`). A file crossing ~250 lines is a signal to re-check it against this rule, not an automatic split. Do not pad or fragment to hit a number; split because the responsibilities are distinct.
- **Data is data, not code.** Scene choices, statements, intro questions, category weights, role details, and results copy live in typed objects under `/src/data` (the flows in `/src/data/flows`, §17). Changing content must never require editing component logic. This is the single most important convention in the repo: the team will be tuning content constantly.
- **The scoring engine is pure and isolated.** The live brain is `/src/lib/categoryScoring.ts`: it takes the user's answers and bucketed sorts and returns a normalized match score for all three roles, normalized per role against its own maximum (so the maxes need not be equal). Branch-aware (it only walks the path the user took). No React, no side effects, fully unit-tested. _(The classic `scoring.ts` three-archetype engine was the documented cut, deleted in Phase 4.)_
- **Tokens, not literals.** Colors, spacing, radii, type, and motion durations come from Tailwind config. No inline hex, no random pixel values.
- **Types first.** Define the shape in `/src/data/types.ts` (or local types) before wiring UI. Avoid `any`.
- **Comment the why, not the what.** The docs explain intent; code comments should only clarify non-obvious decisions.

## How to verify your work

Before calling any task complete:

1. `pnpm dev` runs with no console errors.
2. `pnpm lint` and `pnpm typecheck` pass.
3. `pnpm test` passes — Vitest unit tests (the category scoring engine, `data-integrity`) and the Playwright specs (narrative / role-select / reduced-motion).
4. The change matches the live plan (`docs/knowledge/REALIGNMENT.md` + `DATA_MODEL.md` §17); `ROADMAP.md` Phase 0/1 are done and Phase 2/3 are largely the documented cut.

Use Playwright to self-check visual and flow changes rather than asking the user to manually verify. Screenshot the relevant screen and inspect it.

## Harness & session protocol

This repo carries a small, owned agent + design harness. Use it; don't work around it.

- **Session start.** Read `docs/knowledge/STATUS.md` (where we are) and the newest note in `docs/knowledge/sessions/` (what last happened) before touching anything. Built-in memory mirrors a few durable facts, but `docs/knowledge/` is the source of truth.
- **Layer map.** Context = the six `docs/` files + `REALIGNMENT.md` (cited, never duplicated). Skills (`.claude/skills/`): `data-author` for `/src/data`, `scene-motion` for the Motion-vs-GSAP rule, plus the installed GSAP + Motion skills. Commands (`.claude/commands/`): `/phase-check`, `/design-review`, `/compound`, `/capture-figma`, `/pull-figma`, `/revise-doc` (edit a spec doc safely, reconciling the others). Evaluation = `docs/rubrics/`, graded by the `design-reviewer` subagent; `verifier` runs the gates; `doc-steward` reconciles cross-doc ripples (driven by `/revise-doc`).
- **Gates.** Run `/design-review` for visual work; run `/phase-check` at phase boundaries (it ticks `STATUS.md`). A task isn't done until lint + typecheck + test pass.
- **Compounding.** Capture non-obvious calls with `/compound decision`, workflow/craft learnings with `/compound lesson`, and a handoff note at the end of a large change with `/compound session`. A lesson that recurs gets promoted to a rule here in `CLAUDE.md`.
- **Full reference.** `docs/knowledge/HARNESS.md` documents every piece (skills, commands, subagents, rubrics, MCP servers) — what it's for, how to use it, and how to extend it.

## Phasing

Phase 0 and Phase 1 shipped (scaffold; the classic flow, testable end to end). Then the product pivoted to the narrative quiz, and the original Phase 2–3 plan is superseded. The live track is in `docs/knowledge/REALIGNMENT.md`.

- **Phase 0** — Scaffold, tokens, mock data, screens stubbed, clickable end to end. **Complete.**
- **Phase 1** — Real flow content, working scoring, testable results. **Complete** (first user test).
- **Study insert** — the Narrative + Exam flows, four categories, per-flow results (`DECISIONS.md` D-016–D-023). _Both shipped; the narrative won the June study._
- **Realignment Phase 4 (strip)** — Classic deleted, Exam archived; the build is the narrative flow only (D-027). **Done.**
- **Realignment Phase 5 (three roles)** — the four categories collapsed to ARM's three live roles (D-028). **Done.**
- **Phase 2 (conveyor feel pass) — documented cut.** The conveyor scene, the robotic arm, the live robot, and the Build beat were never built and are no longer the plan.
- **Phase 3 — partly superseded.** The polish that applies to the live flows survives (copy, light a11y, mobile, reduced-motion, Figma sync); the sound/conveyor/robot polish is cut.
- **Next** — the high-fidelity narrative results screen (`REALIGNMENT.md` step 8), on the kit-aligned tokens.

## Hard rules

- Never invent the ARM role taxonomy. The live model scores RC.org's **three published robotics roles: Robotics Technician (entry), Robotics Specialist (mid), Robotics Integrator (planning)** — ARM's current site structure (`docs/reference/ARM Updated Role Structure - Source Content.md`). Their content is fixed mock data in `roleDetails.ts`, keyed by `CategoryId` = `technician | specialist | integrator`. Do not add or rename roles. (The entry Technician folds in what the site used to split as Operate/Operator and Repair; "Operator" survives only as a common job title under Technician. The old four-category model and the D-017 carve-out are retired — D-028.)
- Never make the result a single prescriptive role. Always a weighted match across all three roles. See `PRD.md` scoring section + `DATA_MODEL.md` §17.
- Never use the neon palette from early brainstorm docs. Palette is defined in `DESIGN_SYSTEM.md` and the `@theme` block in `src/styles/globals.css`.
- Never add a screen, step, or feature not described in `PRD.md` without flagging it first.
- When in doubt about scope, content, or direction, stop and ask. The user is driving and prefers to be consulted before you expand scope.

## Doc map

- `docs/knowledge/REALIGNMENT.md` — **the plan of record.** Where the project actually is (the narrative pivot), the design-system unification, and the realignment sweep.
- `PRD.md` — what we're building and why, screen by screen. The spec (§5.0 is the live narrative flow; the conveyor screens are the documented cut).
- `CONTEXT_BRIEF.md` — the research story, compressed. The why.
- `DESIGN_SYSTEM.md` — tokens, components, motion. Kit-aligned to the RC UI Kit (D-024).
- `ARCHITECTURE.md` — stack rationale, file structure, state, scoring engine, the 3D path (parked).
- `DATA_MODEL.md` — every schema. **§17 (the three-role narrative flow) is the live model;** §1–§14 are the classic documented cut.
- `ROADMAP.md` — Phase 0/1 done; Phase 2/3 largely the documented cut.
- `docs/knowledge/` — living project memory: status, decisions, lessons, case study, session handoffs. **Read `STATUS.md` first each session.**
- `docs/rubrics/` — design-quality rubrics the `design-reviewer` subagent grades against.
- `README.md` (root) — teammate onboarding + MCP/toolchain setup.
