# Roadmap

> **Realignment (2026-06): the original Phase 2–3 plan is superseded.** Phase 0 and Phase 1 shipped (the classic flow, scaffold through testable results). Then the product pivoted: a question-structure study (`DECISIONS.md` D-016–D-023) replaced the classic flow with the **Narrative** and **Exam** flows scoring four RC.org categories, and testing crowned the narrative. **Phase 4 then stripped the build to the narrative flow alone** (D-027), deleting the Classic and Exam flows from the live tree (recoverable at git tag `archive/pre-narrative-only`). **Phase 5 then collapsed the four study categories to ARM's three published roles** (D-028) — Technician (entry, folding the old Operate + Repair), Specialist (the old Program), Integrator (the old Plan). So the **conveyor "feel pass" (Phase 2) and most of Phase 3 are the documented cut**: the conveyor scene, the user-controlled arm, the live-building robot, the Build beat, and the results pedestal were never built and are no longer the plan. The real next product work is the **high-fidelity narrative results screen** (`REALIGNMENT.md` step 8), built on the kit-aligned tokens. Read Phase 2/§3 and the conveyor parts of Phase 3 as parked; the surviving Phase 3 polish (copy, light a11y, mobile, reduced-motion, Figma sync) still applies to the live narrative flow. (Phase 5 is done: the live model is ARM's three roles.)

The build ran in four phases. Each phase had a clear goal, a concrete task list, and verifiable acceptance criteria. Phase 0 and Phase 1 are complete; the realignment re-centered everything after them.

This doc is the operational counterpart to `PRD.md` (what we're building), `DATA_MODEL.md` (the schema, §17 is the live model), `ARCHITECTURE.md` (how the code is organized), and `DESIGN_SYSTEM.md` (how it looks). It points at all of those concretely as work progresses.

---

## 0. Overall timeline

| Phase | Goal | Output |
|---|---|---|
| Phase 0 | Scaffold and foundation | Working skeleton, every screen clickable, scoring engine tested — **complete** |
| Phase 1 | Testable flow | Full flow end to end with simple sort interaction — **complete (first user test)** |
| _Study insert_ | Question-structure study | Narrative + Exam flows, four categories, per-flow results (D-016–D-023) — concluded; narrative won |
| ~~Phase 2~~ | ~~Feel pass (conveyor scene, live robot)~~ | **Documented cut** — superseded by the narrative pivot |
| Phase 3 | Polish | The surviving items (copy, light a11y, mobile, reduced-motion, Figma sync) apply to the live narrative flow; the conveyor/robot/sound polish is cut |
| Phase 4 | Strip to narrative | Deleted the Classic + Exam flows; narrative-only, still four categories (D-027) — **done** |
| Phase 5 | Collapse to three roles | Collapsed the four study categories to ARM's three published roles — Technician/Specialist/Integrator (D-028) — **done** |
| Step 8 | High-fidelity narrative results | The real next product work (`REALIGNMENT.md` step 8), on kit-aligned tokens |

Work proceeds when acceptance criteria are met, not on a fixed schedule. The realignment sweep (`REALIGNMENT.md` §9) re-centers the docs and harness before step 8.

## 1. Phase 0 — Scaffold and foundation

**Goal:** stand up the project skeleton so that every subsequent phase is adding real content to an already-correct structure. No animations, no real UI polish. Boring screens, working plumbing.

### Tasks

#### 1.1 Project initialization

- Initialize Vite + React + TypeScript with pnpm.
- Install dependencies (per `ARCHITECTURE.md` section 1): `react`, `react-dom`, `react-router-dom`, `motion` (the package formerly published as `framer-motion`), `gsap`, `@gsap/react`, `zustand`, `howler`, `tailwindcss`, `@playwright/test`, `vitest`, `eslint`, `prettier`. GSAP plugins (MorphSVG, DrawSVG, MotionPath) ship in the free `gsap` package; register them at app start.
- Configure `tsconfig.json` with strict mode, `@/` path alias.
- Configure `vite.config.ts` with the path alias.
- Set up ESLint and Prettier with the import-sort plugin.
- Configure pnpm scripts: `dev`, `build`, `preview`, `lint`, `format`, `typecheck`, `test`, `test:unit`, `test:e2e`.

#### 1.2 Tailwind tokens

- Author the `@theme` token block in `src/styles/globals.css` mirroring `DESIGN_SYSTEM.md` section 2 exactly (Tailwind v4 is CSS-first — no `tailwind.config.ts`).
- All brand colors verbatim from the Figma file: `arm-gold`, `arm-gold-soft`, `arm-orange`, `arm-blue`, `arm-teal` (kit-aligned; `arm-gold`/`arm-gold-soft` renamed from `arm-yellow`/`arm-yellow-soft`, D-024). _(`arm-blue` was retired at step 8 Phase A, D-029; the live brand set is gold / teal / orange, plus the dark system in `DESIGN_SYSTEM.md` §3.5.)_
- All semantic colors, type scale, spacing scale, container widths, radii, shadows.
- New motion tokens from `DESIGN_SYSTEM.md` section 8 (`duration-instant` through `duration-reveal`, plus easing curves).
- `scene/` namespace tokens for the playful layer. _(Removed at step 8 Phase A, D-029, with `LandingSceneHint` and the `src/scene/` dir.)_

#### 1.3 File structure

- Create the full directory tree from `ARCHITECTURE.md` section 3.
- Add a `README.md` at root that points at `/docs/` for everything.

#### 1.4 Data model

- Create `/src/data/types.ts` with every type from `DATA_MODEL.md` section 2.
- Create `/src/data/items.ts` with all 24 interest items, weights from the table in `DATA_MODEL.md` section 3, and `robotContribution` arrays referencing placeholder part IDs.
- Create `/src/data/roles.ts` with the three Role objects, real ARM competencies, jobs, and pathway framing per `DATA_MODEL.md` section 4.
- Create `/src/data/competencies.ts` with all role competencies and starter `plainName` translations per `DATA_MODEL.md` section 5.
- Create `/src/data/skills.ts` with the 14 essential skills.
- Create `/src/data/programs.ts` with the seed mock programs per `DATA_MODEL.md` section 8.
- Create `/src/data/robotParts.ts` with placeholder part entries matching the "Robot intent" column in `DATA_MODEL.md` section 3. SVG components are stubs that render a labeled rectangle.
- Create `/src/data/colorSchemes.ts` mapping each archetype to its accent token.
- Create `/src/data/index.ts` barrel.
- **Verify the sanity totals** from `DATA_MODEL.md` section 15: Builder=22, Innovator=27, Architect=25.

#### 1.5 Pure-function logic

- Implement `/src/lib/scoring.ts` per `DATA_MODEL.md` section 9. Pure function, no React.
- Implement `/src/lib/robotAssembly.ts` per section 10. Pure function.
- Implement `/src/lib/programSelection.ts` per section 11. Pure function.
- Implement `/src/lib/audio.ts` — a Howler wrapper that respects the sound toggle. For Phase 0, the function exists but is a no-op (no sound files yet).

#### 1.6 Unit tests (Vitest)

- `/src/lib/__tests__/scoring.test.ts`:
  - All-keep returns 100/100/100.
  - All-pass returns 0/0/0.
  - A builder-heavy input (keep all Builder-weighted items, pass everything else) returns Builder as primary.
  - An innovator-heavy input returns Innovator as primary.
  - An architect-heavy input returns Architect as primary.
  - A representative mixed input (e.g. keep items 1, 3, 5, 9, 13, 17, 21) returns sane percentages.
  - Tiebreak order is deterministic (Builder > Innovator > Architect on ties).
- `/src/lib/__tests__/robotAssembly.test.ts`:
  - Empty decisions produce a default robot.
  - Multi-cardinality slots accumulate up to their cap.
  - Single-cardinality slots last-write-wins.
- `/src/lib/__tests__/programSelection.test.ts`:
  - Filters to programs serving the given role.
  - Returns the requested max count.

#### 1.7 State

- Create `/src/state/sessionStore.ts` (Zustand) per `DATA_MODEL.md` section 12. All actions wired up. `completeSorting` calls the scoring engine.

#### 1.8 Screens (stubbed)

- `/src/screens/Landing/Landing.tsx` — title, brief description, primary CTA that routes to `/sort`.
- `/src/screens/Sort/Sort.tsx` — a placeholder grid showing all 24 items as plain cards with "Keep" and "Pass" buttons. No animation. No conveyor. The flow just *works*.
- `/src/screens/Build/Build.tsx` — a "Building your robot..." placeholder with a 1-second auto-advance to `/results`.
- `/src/screens/Results/Results.tsx` — three placeholder role cards, raw match percentages, the robot as a labeled box, no compare interaction yet.
- `/src/app/router.tsx` — routes: `/`, `/sort`, `/build`, `/results`.

#### 1.9 Figma MCP (code-to-canvas)

- Connect the remote Figma MCP server for Claude Code and authenticate. Document the setup in `README.md`.
- Verify a read works: pull a variable or read a frame through the MCP.
- Verify one **code-to-canvas** capture works: with the dev server running, capture a stubbed screen into a Figma frame via `generate_figma_design`. That proves the round-trip exists.
- That is the entire Figma gate. No write-round-trip smoke test, no Code Connect, no `.figma.tsx` files, no `figma connect publish`. Code Connect is not used (it's gated behind Figma Org/Enterprise the team doesn't have; see `ARCHITECTURE.md` section 7).

#### 1.10 Agent skills and harness setup

- Install the official GSAP AI skills so Claude Code authors GSAP with GreenSock's canonical patterns: `/plugin marketplace add greensock/gsap-skills` (or `npx skills add https://github.com/greensock/gsap-skills`).
- Add the repo's own project skills and subagents per the harness plan (see the project setup notes). At minimum: a data-authoring skill for `/src/data`, a scene/animation skill encoding the Motion-vs-GSAP ownership rule, and a verification subagent that runs lint/typecheck/test and reports failures.
- Confirm `docs/` is discoverable from `CLAUDE.md` so every session loads context the same way.

#### 1.11 Playwright

- Configure `playwright.config.ts` to run against the dev server.
- Create `/tests/e2e/happy-path.spec.ts`: load `/`, click CTA, land on `/sort`, click "Keep" or "Pass" on every item, auto-advance to `/build`, land on `/results`, assert three role cards are visible.

### Phase 0 acceptance criteria

Phase is complete when ALL of these are true:

- [ ] `pnpm dev` runs without errors.
- [ ] `pnpm lint` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test:unit` passes all scoring, assembly, and program-selection tests.
- [ ] `pnpm test:e2e` passes the happy-path Playwright test.
- [ ] A human can click from `/` to `/results` without seeing a console error.
- [ ] Tailwind tokens match the Figma file's variables (spot-check brand colors and type scale).
- [ ] The Figma MCP connects, a read works, and one code-to-canvas capture succeeds.
- [ ] The GSAP AI skills are installed and discoverable by Claude Code.
- [ ] Every data sanity check from `DATA_MODEL.md` section 15 passes.

### Phase 0 risks

- The Figma code-to-canvas tool runs on the remote MCP server and respects seat type. Confirm the team's plan allows capturing into a file early; if a capture into an existing file is restricted, captures to a new draft file or clipboard still prove the loop. This is a small check, not a blocker.
- GSAP is imperative, which historically tripped agents up. The official GSAP skills (task 1.10) plus the fixed `useGSAP` + scope + cleanup pattern in `ARCHITECTURE.md` section 1 are the mitigation. Verify the skills load before Phase 2 leans on GSAP heavily.

### What is explicitly NOT in Phase 0

- Real visual design. The stubs are intentionally ugly so no one mistakes them for finished work.
- Drag-and-drop. Buttons are fine.
- The conveyor scene. Stays out until Phase 2.
- Any robot art. Placeholder shapes only.
- The compare interaction on results. Stays out until Phase 1.
- Sound. The audio helper exists but plays nothing.

---

## 2. Phase 1 — Testable flow

**Goal:** make the experience complete and coherent enough to put in front of users. Real flow, real scoring, real recommendations. Visually plain. **This is the build that goes in front of the MHCI cohort for the first user test.**

### Tasks

#### 2.1 Landing screen

- Final-ish copy (the landing one-liner is an open question per `PRD.md` section 13; use the best draft we have and iterate).
- Primary CTA styled per `DESIGN_SYSTEM.md`.
- A soft hint of the assembly-line scene behind the CTA (placeholder illustration is fine; the full scene comes in Phase 2). Add a gentle entrance reveal (GSAP `DrawSVG`) as an early, low-risk test of the scene-animation approach. _(Superseded at step 8 Phase A, D-029: the scene hint and its `DrawSVG` reveal were removed when the Landing went type-led dark. Kept here as the Phase 1 record.)_

#### 2.2 Sort screen — real interaction

- Replace the Phase 0 button-grid with a clean drag-to-bin / tap-a-bin interaction.
- One item displayed at a time, advancing as the user sorts.
- Two visible bins: "That's me" and "Not my thing." Distinct visual treatment, archetype-neutral.
- Round transitions (between rounds, a brief beat — encouraging and theme-free, e.g. "Nice work — that's round one done." Round themes stay internal per `PRD.md` §5.2; copy lives in `src/data/rounds.ts`).
- Round indicator using `Label/Overline` style: "ROUND 2 OF 4".
- A progress bar or counter so the user can see how far in they are.
- Input: drag the card into a bin, or tap a bin. The bespoke arrow-key/Enter mechanic was dropped (`DECISIONS.md` D-015); bins are native buttons, so basic Tab/Enter operability remains. Full keyboard-nav polish is a Phase 3 a11y item.

#### 2.3 Build screen — transition beat

- A brief "building your match…" beat (~1.5 seconds). Placeholder visual is fine — a simple loading state with the robot placeholder gathering its parts in a static layout. Real animation is Phase 2.
- Triggers the scoring engine if not already triggered, marks robot as finalized.

#### 2.4 Results screen — the conversion moment

This is the most important screen in the build. Implement carefully.

- **Layout:** three role cards in a row. The primary match is centered and full-sized. The other two are visibly secondary (smaller, lower contrast, but still legible — these are the "ghosted alternatives").
- **The robot avatar** sits on a pedestal in front of the primary card. Phase 1 robot is still placeholder shapes; the *interaction* is what matters now.
- **Each role card displays:**
  - Role name (e.g. "Robotics Specialist") with archetype label ("Innovator").
  - Plain-language short description from the role data.
  - Match percentage in archetype accent color.
  - The four-part read (see `PRD.md` section 5.4): how you match it, skills you'd build, competencies you'd build, programs that get you there.
  - Primary CTA per card: "Explore training programs for [role name]."
- **The compare interaction:** clicking or dragging the robot onto one of the ghosted cards "tries on" that role. The previously-primary card de-emphasizes; the newly-active card lights up with its archetype accent and its four-part read becomes the prominent content. The user can switch freely between all three.
- A subtle, understated "Retake" link at the bottom.

#### 2.5 Mock programs displayed

- Each role card's "programs that get you there" section pulls from `programSelection.ts` and shows the top 3 mock programs for that role.
- Each program displays its name, type (certificate/apprenticeship/degree/etc.), duration, and blurb. No real links yet.

#### 2.6 Playwright tests

- Update the happy-path test to do real sorting (24 decisions) and assert the right primary archetype shows for a known set of choices.
- Add a compare-interaction test: complete the flow, verify the primary card is highlighted, click an alternative, verify the previously-primary de-emphasizes and the new card lights up with its content.
- Add a scoring-correctness test that checks displayed percentages match the engine output.

### Phase 1 acceptance criteria

- [ ] A user can complete the full flow (land → sort 24 items → build → results) in approximately 3–4 minutes.
- [ ] The Sort screen interaction works via mouse, touch, and keyboard.
- [ ] The Results screen shows believable weighted match scores across all three archetypes for representative sorting patterns.
- [ ] The compare interaction works: moving the robot to a different role card swaps the active read.
- [ ] Each role card surfaces programs from the mock data.
- [ ] All Playwright tests pass, including the compare interaction.
- [ ] No console errors on any screen.
- [ ] The build is demoable to the MHCI cohort and survives 5 unmoderated user sessions without crashing.

### What gets tested with users at the end of Phase 1

The first round of user testing (MHCI cohort, late-HS proxies if accessible) covers:

- Does the flow make sense? Is anything confusing or skippable?
- Do the interest items feel relatable? Any swap-outs needed?
- Are the match percentages believable, or do they feel arbitrary?
- Does the four-part read on results feel like a meaningful answer, or generic?
- Does the compare interaction get discovered? Used? Valued?

The output of this test is a list of changes that feed Phase 2's work as content and interaction refinements alongside the new visual layer.

### Phase 1 risks

- The compare interaction is the biggest interaction-design risk in the whole build. If users don't discover it or find it confusing, the recommendation framing falls apart. Watch for this in user testing; be prepared to add affordances (hint text, animated suggestion) in Phase 2 if needed.
- The scoring spread may be unsatisfying with the v1 designer-default weights. If multiple test users hit near-ties or all-low percentages, the weights need real tuning. The team owns this iteration.

---

## 3. Phase 2 — Feel pass (DOCUMENTED CUT, superseded)

> **Superseded by the narrative pivot (2026-06).** Nothing in this phase was built. The conveyor scene, the user-controlled arm, the live-building robot, the Build beat, and the results pedestal are parked. The question-structure study replaced this work; the real next step is the high-fidelity narrative results screen (`REALIGNMENT.md` step 8). The section below is the original plan, kept for the record.

**Goal:** turn the working flow into the experience the PRD describes. The conveyor scene. The robotic arm. The robot building live. The Goose-game aesthetic landing.

### Tasks

#### 3.1 The conveyor scene

- Author all SVG scene components per `ARCHITECTURE.md` section 5 and `DESIGN_SYSTEM.md` section 10.
  - `Factory.tsx` — soft background.
  - `ConveyorBelt.tsx` — the moving surface.
  - `ConveyorItem.tsx` — the cards that travel along it.
  - `RoboticArm.tsx` — the user-controlled sorter.
  - `Bin.tsx` — the two destinations.
- Goose-game line weights and warm fills.

#### 3.2 The sort interaction, animated

The interaction model (refined per `docs/knowledge/DECISIONS.md` D-014):

- The conveyor belt turns; interest items ride it as labeled parts, arriving from one side.
- The **user drags a part off the belt** into one of **two bins set in front of the line** (downscreen, in 2D): "That's me" (keep) / "Not my thing" (pass). The user sorts directly — they do **not** puppeteer the arm.
- A **robot arm lifts each kept part from the "That's me" bin and assembles it onto the robot** standing behind/above the belt (see 3.3). The "Not my thing" bin is cleared by a second arm or a trash chute — exact treatment is a Phase 2 authoring choice (TBD).
- Engine ownership (`ARCHITECTURE.md` §1): **Motion** owns the user's drag-off-belt gesture; **GSAP** owns the belt motion, the assembling arm(s), the part-to-robot arc + snap, and ambient idle.
- Round transitions feel like the line "resets" between rounds (subtle visual cue).
- Subtle ambient idle motion (arm hovering, conveyor texture) — gentle, never distracting.

#### 3.3 The robot, live-building

- Author the SVG robot parts library. Many parts can be shared across items per `DATA_MODEL.md` section 7.
- The robot stands visibly **behind/above the conveyor** (in 2D) during sorting.
- Each "That's me" decision sends its part to the keep bin; the **robot arm lifts it from that bin and snaps it onto the robot** — the kept part's journey (belt → bin → arm → robot) is the visible cause of the build.
- The robot is partially built throughout sorting and becomes finalized at the Build beat.

#### 3.4 The Build beat

- A short (~2-second) cinematic moment between the last sort and the results. The final part snaps in. The robot does a small "ta-da" idle. Lighting/glow effect. Sound cue.
- Auto-advances to Results.

#### 3.5 The Results pedestal

- The robot transitions onto a pedestal in front of the primary role card. Satisfying motion, not abrupt.
- The compare interaction (already working from Phase 1) gets visual polish: the robot physically slides from one pedestal to another.

#### 3.6 Visual regression

- Baseline Playwright visual snapshots for all four screens.
- Snapshots for mid-sort (item in motion) and mid-compare (robot transitioning).

### Phase 2 acceptance criteria

- [ ] The sort experience uses the conveyor scene end to end.
- [ ] The user-controlled arm interaction works via mouse, drag, and keyboard.
- [ ] The robot visibly accretes parts during sorting in response to "That's me" decisions.
- [ ] The Build beat plays and feels like a payoff moment.
- [ ] The Results pedestal scene works, including the robot transitioning between pedestals during compare.
- [ ] Visual regression snapshots are baselined and all green.
- [ ] Performance: 60fps motion on a mid-range laptop in Chrome.
- [ ] The aesthetic reads as Goose-game-adjacent on first impression: warm, soft, illustrated, calm.

### What gets tested with users at the end of Phase 2

Second user testing round:

- Does the scene feel charming and worth completing, or does it feel slow or silly?
- Is the robot legible? Can users connect the parts they earned back to interests they kept?
- Does the compare interaction get discovered now that the visual cue is stronger?
- Does the Build beat land as a moment? Is it too long? Too short? Disposable?

### Phase 2 risks

- Performance. SVG with many animated nodes can chug. Profile early. Worst case, drop ambient idle motion.
- Visual coherence. The Goose-game aesthetic is easy to talk about and hard to nail. Plan time for at least one full visual refinement pass after the first version of the scene is up.
- Robot legibility. If users can't tell which parts came from which interests, the robot loses its meaning. Test specifically.

---

## 4. Phase 3 — Polish, mobile, sync

> **Partly superseded.** The polish items that apply to the **live** narrative flow survive: final copy (§4.1), motion polish + reduced-motion (§4.3), mobile responsiveness (§4.4), light a11y (§4.5), Figma sync (§4.6), and the demo affordances (§4.7). **Cut with the conveyor:** sound design (§4.2, the build was always fine silent), and any task scoped to the conveyor scene, the live robot, or the Build beat. Read the surviving items against the narrative flow and the high-fidelity results screen, not the conveyor. (The Exam flow these items also once covered was deleted in Phase 4, D-027.)

**Goal:** all the things that make this look like a finished prototype rather than a demo build. The thing you'd actually show the ARM client.

### Tasks

#### 4.1 Final copy pass

- Landing copy (the single sentence that frames the experience).
- Role description rewrites (plain-language for 9th grade reading level).
- The four-part read content per role: "how you match," "skills you'd build," "competencies you'd build," and the program blurbs.
- Round transition copy (between rounds 1-2, 2-3, 3-4).
- Build beat copy ("you're built!" or similar).
- Empty/edge-case states (refresh in the middle of sorting, etc.).

#### 4.2 Sound design

- Source or commission SFX assets: sort click (keep), sort click (pass), conveyor ambient loop, arm motion, item snap into bin, robot part attach, build-beat reveal, results entrance, archetype hover.
- Integrate via the existing `audio.ts` Howler wrapper.
- Sound is OFF by default. The sound toggle (top-right) must be visible and obviously interactive.

#### 4.3 Motion polish

- Tune Motion transitions and GSAP timeline timings against the shared motion tokens in `/src/lib/motion.ts` (see `DESIGN_SYSTEM.md` section 8 and `ARCHITECTURE.md` section 1).
- Add micro-interactions: button hovers, card hovers, focus states.
- Add `prefers-reduced-motion` respect: motion-sensitive users get fast crossfades instead of physical motion.

#### 4.4 Mobile responsiveness

- Tablet (iPad portrait/landscape): the experience works, the scene scales, the results layout reflows to a column.
- Phone (iPhone): the experience works. The conveyor may simplify (e.g. items appear one at a time without a horizontal scene). Acceptable to degrade the scene gracefully; not acceptable to break the flow.
- Touch targets meet 44px minimum on mobile.

#### 4.5 Light accessibility

- Keyboard nav for sort (already in Phase 1, polish in Phase 3).
- Keyboard nav for results compare (Tab between role cards, Enter to make that role active).
- WCAG AA contrast for all text.
- `aria-label` on interactive non-text controls (arm, bins, robot pedestal).
- Skip-to-results link for users who want to bypass sorting (e.g. demo audiences). Hidden visually, exposed to screen readers and keyboard.

#### 4.6 Figma sync (final)

- Push final React component changes back to Figma so the file reflects what was built.
- Capture the final built screens back to the Figma file via code-to-canvas so the file reflects what shipped.
- Update the Figma file's frame thumbnails so screenshots reflect the finished work.

_(**Done, 2026-07-03, D-040.** The original RC-CC file is dead; the destination is the "Interest Quiz" Figma file (`pjgrRJS5YYII1iciW7Pak2`) in the ARM team, subscribed to the Design System library. It holds all 9 final screens as **editable, variable-bound frames** — Chrome-extension captures integrated by an MCP bind pass, node IDs and evidence in `docs/figma/FIGMA_MAP.md` §6. Precedence is the three-artifact model in `DESIGN_SYSTEM.md` §2.)_

#### 4.7 ARM-facing demo polish

- A landing demo mode: a query param like `?demo=true` that pre-fills a representative sorting outcome and jumps straight to results. So ARM can see results without sorting through 24 items on a phone in a conference room.
- A README section in the repo explaining how to run the demo and what to look at.

### Phase 3 acceptance criteria

- [ ] All copy is final and reviewed by the team.
- [ ] Sound integrates with toggle working; defaults to off.
- [ ] The experience is usable on tablet and phone.
- [ ] `prefers-reduced-motion` is respected.
- [ ] WCAG AA contrast verified on all text.
- [ ] Keyboard nav works end to end without a mouse.
- [ ] Figma file reflects the shipped screens (final captures done); variable names still align with the Tailwind tokens.
- [ ] All Playwright tests still pass, including visual regression.
- [ ] The demo mode works.
- [ ] A team member who has never seen the build can clone the repo, run `pnpm install && pnpm dev`, and see the experience inside 5 minutes.

### Phase 3 risks

- Scope creep. Phase 3 will tempt the team to add small features ("what if we also had a share screen?"). Resist. Anything not on the Phase 3 task list goes on a post-prototype wishlist.
- Sound is the highest-risk single asset class. SFX that's bad, loud, or jarring sabotages the experience. Plan time for several iterations on sound feel.
- Mobile coverage. The conveyor scene was designed desktop-first. Phone treatment may need its own design pass. Reserve time for it.

---

## 5. What to cut if time runs short

In priority order, from least important to most important. Drop from the top of this list first.

1. **Demo mode (Phase 3).** Pre-filled results path is nice-to-have. ARM can sit through a real sort if they have to.
2. **Sound (Phase 3).** The build is fine silent. Worst case, ship muted with a placeholder toggle.
3. **Phone responsiveness.** Tablet support is enough for demo and most user testing. iPhone-perfect is bonus.
4. **Light a11y polish beyond keyboard nav.** Keyboard nav is required; perfect screen-reader narration of the scene is not.
5. **Visual regression in Playwright.** Helpful but not blocking.
6. **The Build beat as a cinematic moment.** Can degrade to a quick transition. Worse, but functional.
7. **Live-building robot during sorting.** Can degrade to "robot reveals fully built on Build beat" if Phase 2 runs hot. Worse, but functional.
8. **The conveyor scene.** If Phase 2 is in serious trouble, the Phase 1 simple-sort can ship as the demo, with the conveyor as documented future work. The flow still works, just plainer.

Do not cut, in any scenario:

- The scoring engine producing weighted recommendations across all three roles (never a single prescriptive verdict).
- The results screen showing all the matches, not one.
- The compare interaction (live as the dark role-cards screen's prev/next role-stepping; the narrative node-map swap that first served it was deleted at Phase E, D-029): it can degrade visually but must work. _(The cut exam dashboard's ranked roles were the other presentation the study compared.)_
- The result explaining itself: the match read, the "why you scored that way" interpretation, and the education/pay fit line.
- Real, plain-language copy that an actual high schooler would understand.

These are the things that make the build solve the research problem. Lose them and the prototype demonstrates nothing useful. _(The numbered cut-list above is the historical conveyor list; items 6–8 are already cut with the scene.)_

## 6. Definition of done (per task within any phase)

A task within a phase is not complete until:

1. The code matches the spec in the relevant doc (`PRD.md`, `DATA_MODEL.md`, `DESIGN_SYSTEM.md`).
2. `pnpm lint`, `pnpm typecheck`, and `pnpm test` all pass.
3. If the task affected UI, Playwright snapshots are updated and reviewed.
4. If the task added a component, it's named to match its Figma counterpart (convention only; no mapping file to maintain).
5. No `console.error`, no `console.warn` (unless silenced with a justified comment).
6. The change is described concisely enough that another team member can understand it without reading the full diff.

When in doubt about a task's scope, stop and ask. Especially in Phase 0 and 1, the failure mode is over-building (adding the conveyor in Phase 0 because it "would be cool," polishing copy in Phase 1 before users have tested it). The phases exist to prevent that.

## 7. After Phase 3

The prototype delivery to ARM is the last milestone of the summer. After delivery, the team owns:

- A final demo walk-through with ARM.
- A handoff document (separate from this repo) describing what was built, what was learned, and what we recommend ARM's dev team do next.
- The Figma file, fully synced with the code state.
- Whatever the team needs for the MHCI capstone deliverables.

The 3D path documented in `ARCHITECTURE.md` section 9 is post-summer work, contingent on ARM committing to build this for production. The team's job is to make that decision easy for ARM by delivering a prototype that earns the next investment.
