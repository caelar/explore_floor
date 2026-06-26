# Realignment and Design-System Unification

**A findings-and-recommendations memo for the quiz prototype (`explore_floor`).**
Written 2026-06-23. Scope: where this project actually is, how it relates to `career_dashboard` and the wider RC.org prototype portfolio, and how to bring the two products, the design system, and the code/Figma/Claude-Design workflow back into one line.

This memo is a proposal. It does not change code, tokens, or specs. It names the work and sequences it. Acting on it should run through the realignment sweep in section 9.

---

## 0. The short version

The product already pivoted. The scaffolding around it did not. The live build is a narrative "day in the life" quiz that scores four RC.org career categories, and testing crowned it ("Engagement belongs to the narrative, and it wasn't close"). But the PRD, the roadmap, the design tokens, two of three rubrics, a whole skill, and the verifier invariants still describe the abandoned factory-floor conveyor and build-a-robot vision, a scene that was never even built. So the realignment is not a rebuild. It is a deliberate sweep that re-centers the docs and harness on the narrative quiz, retires the dead conveyor scaffolding, and pulls the design system onto the same kit the dashboard already uses.

Three recommendations carry the memo:

1. **Update `explore_floor` in place, with a hard re-baseline. Do not fork a new repo.** The live narrative core (roughly 2,400 lines, fully tested) is solid and is already the default. The problem is drift in the surrounding docs and tooling, plus roughly 1,700 lines of dormant conveyor and classic scaffolding to delete or archive. A fresh repo would cost us a re-port of the harness, tests, CI, and (worse) the decision history that makes the pivot legible, all for marginal gain.

2. **Unify on one design-system source, and do not create a sixth.** The dashboard is already kit-aligned and is the de facto upstream. Its tokens already feed Figma (the published design-system library) and Claude Design (the imported `_ds` bundle). `explore_floor` is the lone holdout still carrying the pre-kit conveyor palette. Re-align it by subscribing to the same tokens, keep the published Figma library as the single canonical values source, and stand up a thin shared token-and-component package (`rc-design-system`) now, with the dashboard, the quiz, and every new prototype subscribing to it (full plan in section 10).

3. **Run three surfaces with three clear jobs.** Code owns token values and behavior. Claude Design is the fast exploration lab. Figma is the settled, round-trip, handoff surface. Tokens flow one way, outward from code, into both Figma and Claude Design. Nobody hand-keeps tokens in two places.

The rest of this memo is the evidence and the plan.

---

## 1. The shape of the project right now

It helps to separate the product (what we are building) from the prototype (the code and its scaffolding) from the surfaces (where design work happens).

**The product** is a narrative quiz for late-stage high schoolers. A user walks through a day in their life (morning routine, arriving at school, a class handout, a club lunch, home, homework, a video game) and a few intro questions, sorting choices, and lands on a results screen that recommends how they fit four RC.org career categories: Operate to Operator, Repair to Technician, Program to Specialist, Plan to Integrator. This replaced the original idea, where a user sorted interest cards on a moving conveyor belt and watched a little robot get built from their picks.

**The prototype** (`explore_floor`) is about 70 percent realigned to that product in code, and about 70 percent still pointing at the dead vision in everything around the code. The narrative flow is the default (`defaultFlowId = 'narrative'`), the landing switcher reads Narrative / Exam / Select, and the classic conveyor experience is dormant with no UI entry (decision D-021). Yet `STATUS.md` still lists "Phase 2, the feel pass (the conveyor scene, the robotic arm, the robot building live, the Goose-game landing)" as Next up, and the docs, tokens, and harness mostly describe that scene.

**The surfaces** are three, and the design system already ties two of them together:

- **Code.** Two sibling repos, `explore_floor` (this one) and `career_dashboard`. Same stack (Vite 5, React 18.3, TS 5.7, Tailwind v4 CSS-first `@theme`, Zustand, Motion). The dashboard was built by porting this repo's harness, so the conventions match. The dashboard has since pulled ahead on design-system maturity.
- **Figma.** A published design-system library (`afi5Q5nFtcnT9HJ04Cbylg`) that mirrors the dashboard's `globals.css`, plus the dashboard file (`7t46ROAv93lIQRspgaslgz`) that subscribes to it. The quiz's own Figma file (`cd1DISE5pwqx8a8SnCsrp2`) currently holds only V3 question-screen notes, and the FigJam storyboard (`z0IK…`) holds the illustrated narrative direction.
- **Claude Design.** The fast front-end lab. The project "Interest quiz question cards exploration" holds the next-generation quiz screens (results, question flow, compare flows, role overview, the percentage-definition explorations, color, selectors), and it imports the dashboard's design system as a shared `_ds` bundle. So the quiz is already being designed against the dashboard's exact tokens, even while the quiz code still uses the old ones.

The research is unambiguous and recent. The June 16 client study (five participants, each took both a narrative and an "exam" version) ruled to carry the narrative forward. The June 22 session note says "V3 builds on that one flow only." The biggest single finding was that the results screen, not either question set, is the real problem, and that trust comes from explaining the match. That is why the Claude Design project's center of gravity is the results screen.

---

## 2. Finding: the product pivoted, the scaffolding lagged

This is the core tension. The pivot happened in clean, logged stages (D-016 through D-023), so it is fully traceable. What did not happen is the cleanup of everything written for the original vision.

**What is solid and worth keeping (the live narrative core, roughly 2,400 lines plus about 1,100 lines of tests):**

- `src/lib/categoryScoring.ts`, the pure four-category scoring engine, branch-aware (it walks only the path the user actually took) and heavily unit-tested. This is the brain, and it is genuinely reusable.
- The typed flow content under `src/data/flows/` (`narrativeFlow.ts`, `examFlow.ts`, `screeners.ts`, `buckets.ts`, the registry), plus `roleDetails.ts` (the four RC.org category roles, copied verbatim from the live role cards with salary and education ladders).
- The shared `BucketSort` interaction ("That's me / Kinda me / Not me"), used by both narrative scenes and the exam statement sort.
- `screenerFit.ts` (the always-on education and pay fit line) and `nodeLayout.ts` (the node-graph and fit-radar geometry).
- The §17 type backbone in `types.ts` and the `data-integrity.test.ts` invariants that auto-cover any new flow.

**What is dead weight tied to the abandoned vision (roughly 1,700 lines of source, about 876 of it dead data):**

- The entire `src/scene/` directory. Worth saying plainly: the conveyor scene was never built. `src/scene/` is only `LandingSceneHint.tsx` (a placeholder line-art conveyor sketch) and `RobotPlaceholder.tsx` (a placeholder line robot). None of the `ConveyorBelt`, `RoboticArm`, `Bin`, `Factory`, or `robot/parts/` tree that `ARCHITECTURE.md` describes exists.
- The dormant classic flow screens (`Sort.tsx`, `RoundBeat.tsx`, `Build.tsx`) and classic results (`ClassicResults.tsx`, `Pedestal.tsx`, `RoleCard.tsx`, `ProgramList.tsx`, `FourPartRead.tsx`).
- The archetype and robot libs (`scoring.ts`, the original three-archetype engine; `robotAssembly.ts`; `fit.ts`; `programSelection.ts`; `audio.ts`; `gsap.ts`).
- The classic data, the largest single block: `robotParts.ts` (a 26-part catalog whose SVG component strings were never authored), `items.ts` (the 24 interest cards), `roles.ts`, `competencies.ts`, `skills.ts`, `programs.ts`, `colorSchemes.ts`, `rounds.ts`, `questionSets/setA.ts`.

This dead code is currently kept alive for one reason only: `data-integrity.test.ts` still validates it.

**The drift in docs and harness** is catalogued fully in the appendix. The headline items: `PRD.md` still describes the assembly-line sort and the robot avatar; `ROADMAP.md` Phase 2 in full describes the conveyor feel pass; `DESIGN_SYSTEM.md` still carries the archetype accent colors and the playful scene palette; the `scene-motion` skill governs choreography that does not exist; the `goose-game-aesthetic` rubric is declared inapplicable by every session note since the pivot; and `verifier.md` plus the `data-author` skill still headline "24 interest items, Builder 22 / Innovator 27 / Architect 25" as the load-bearing checks.

One more drift item, separate from the conveyor question: both CLAUDE.md files point at `RoboticsCareer_Project_Master_Context.md` as required reading, and that file does not exist anywhere on disk. We either author it or remove the pointers.

---

## 3. Finding: the design system already unified around the dashboard

The single most useful thing this exploration turned up is that the unification work is largely done, just not yet extended to this repo.

The canonical ARM values come from the RC UI Kit (`RC Design Resources/RC UI Kit copy.png`, pixel-verified). The dashboard snapped its tokens to that kit in decision D-026: ARM Gold `#FFB81C`, Secondary Teal `#117289`, Secondary Orange `#bf5309`, a charcoal ink ramp (`#262626` / `#595959` / `#757575` / `#9a9a9a`), surfaces `#fafafa` / `#ffffff`, border `#e0e0e0`, a calm no-red four-tone status system, Montserrat 700 with Roboto 400/500/700, and the Refined radii (6 / 8 / 10 / 14). Its `globals.css` is structured as a raw-hex primitives block plus an alias block, which doubles as a Figma Variables spec.

From that one source, tokens already flow to two places:

- **To Figma**, as the published design-system library, bound by `docs/figma/FIGMA_MAP.md`. Because the team is on Figma's Education tier (no Code Connect), that manifest is the hand-maintained binding authority: it records file keys, the naming contract, the variable-to-token table, style keys, and component node IDs. Every component card in Figma cites its source file, its decision ID, which props are variants versus data, and an audit date. The round-trip is proven (run `rc-figma-001`, D-034).
- **To Claude Design**, as the tokens-only bundle in the project "RC Dashboard — Refreshed Design System," pushed via `/design-sync`. The quiz exploration project imports that bundle. There is also a separate "RC.org Live Rip Design System" project that recreates the current production look, kept deliberately distinct from the refresh.

`explore_floor` is the holdout. Its `globals.css` still defines `arm-yellow` (the old name for gold), `arm-orange #f56a00` labeled Builder, `arm-blue #38a5ee` labeled Innovator (a value the dashboard deleted for failing contrast and not being in the kit), `arm-teal` labeled Architect, a navy-slate text color, a "Playful scene layer" block for the conveyor, and Material triple-shadow stacks. So the two prototypes sit on two different palette lineages, and the dashboard's D-026 note already flags this staleness as a known, pending cross-repo item.

There is a real subtlety worth naming. There are five or six competing token sources today: the published Figma library, the dashboard's `globals.css`, RC_Proto's `tokens.css`, this repo's stale `globals.css`, the RC UI Kit reference image, and an Angular `rc-ui-kit` under `style_guide/`. The Angular kit matters because the actual Fivestar platform is .NET plus Angular plus Angular Material, so for the eventual rebuild the Angular kit is the stack-aligned artifact, while the React/Tailwind tokens serve the prototypes. The goal is not to add a source. The goal is to name one values authority and feed everything from it.

---

## 4. Finding: the real work ahead is the narrative results screen

The research and the Claude Design work point the same direction, so the realignment should clear the path for it rather than relitigate the scene.

The V2 study found that engagement and trust are separable. The narrative won engagement; the exam's "why you scored that way" breakdown won trust. The strategy is to graft the exam's transparency onto the narrative. The concrete asks, all sourced from testing, are: define what the match percentage means in one plain line (the number-one content gap, and still an open exploration in Claude Design under "Percentage Definition Explorations"); explain the match by interpreting answers rather than echoing them, behind progressive disclosure; fix the node map's discoverability; add a side-by-side role comparison alongside the map; frame an entry-level Operator result as a starting rung with a visible path up, not a verdict; and give the result somewhere to go (training programs, real job listings).

The `Quiz Results.dc.html` mockup in Claude Design already answers most of this, and it does so on the dashboard's tokens. It even carries the dashboard's nav chrome and ends with "Set as Target Role," which is literally the dashboard's `TargetRoleCard`. So the two products are converging at the seams, which is another reason to unify their design systems rather than let the quiz drift on its own palette.

---

## 5. Recommendation A: update in place, re-baseline, do not fork

**Keep `explore_floor`, re-center it, and clean it out.** Here is the reasoning.

The live narrative core is solid, tested (99 unit tests, 7 end-to-end), and already the default. The cost of a fresh repo is real and the gain is small. We would re-port the harness, the tests, the CI, the launch config, and the conventions, and we would either lose or have to re-create the decision log and session notes that make the pivot legible. That decision log is not overhead. It is the spine of the portfolio case study about building a tuned, bespoke harness, and it is the reason this exploration could reconstruct the whole pivot. Throwing it away to escape a doc sweep is a bad trade.

The repo name is not a reason to fork either. "Explore the Floor" is the name of the RC.org tool we are replacing, not the conveyor mechanic. The landing copy keeps "Explore the Floor" and "Start the story" on purpose. The name survives the pivot cleanly.

What "re-baseline" means in practice is more than editing prose. It is:

- Deleting or archiving the roughly 1,700 lines of dormant conveyor and classic scaffolding, so `data-integrity` stops being the only thing keeping it alive. The cleanest move is to archive the three-archetype taxonomy and the robot and conveyor code to a tagged branch (for example `archive/classic-conveyor`) rather than freeze it in `main`. That lets `CLAUDE.md` drop the "exactly three role families" hard rule and the D-017 carve-out, and lets `types.ts` shed the legacy archetype, robot, and question-set types that are currently mixed into one 379-line file.
- Promoting `DATA_MODEL.md` §17 to the primary model and demoting the robot and conveyor sections to "documented cut," the same way the future 3D path is parked. We keep the record of what we considered, but we stop presenting it as the plan.
- Rewriting the parts of `PRD.md`, `ROADMAP.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `CLAUDE.md`, and `README.md` that lead with the conveyor, so a new reader meets the narrative quiz first.

The one condition that flips this recommendation: if the team decides the quiz must ship inside the Angular and Material platform stack for the Fivestar rebuild rather than as a React prototype, then a fresh, stack-aligned build is warranted. Even then, we lift the UI-agnostic data and scoring layer (`types.ts` §17, `flows/`, `roleDetails.ts`, `categoryScoring.ts`, `screenerFit.ts`) wholesale rather than rebuild it. The PRD already designed that seam (§11: "the scoring engine and role and competency data are UI-agnostic and importable. Do not couple them to gamified-track components").

---

## 6. Recommendation B: unify on one design-system source, do not create a sixth

**Make the dashboard's kit-aligned token set the single canonical source, expose it once, and have everyone consume it.** Stand that source up now as a small shared repo, and have the dashboard, the quiz, and every new prototype subscribe to it.

An earlier draft of this memo staged the shared repo for after the handoff. That was too cautious, and it rested on a deadline that is really about four weeks out, not two. Three things make now the right moment:

- We are re-aligning the quiz's tokens to the kit anyway. Hand-editing `globals.css` now and replacing it with a package import later is throwaway work; doing the alignment as a subscription is the same effort with no rework.
- The dashboard's tokens just stabilized (the D-044 and D-045 consolidation closed), so this is a clean moment to extract a fixed canonical source rather than chase a moving one.
- The number-one pre-handoff deliverable, the high-fidelity quiz results screen, is about to be built. If the package exists first, that screen is on-system from the first commit instead of built on stale tokens and re-aligned in a later pass.

So the move now: extract the kit-aligned `@theme` plus the already-decoupled atoms into a thin `rc-design-system` repo (full plan and build sheet in section 10), publish it as a package, and convert the dashboard and the quiz to import it. The quiz's token alignment becomes "subscribe to the package," not a hand-edit of `globals.css` (the specific token deltas it encodes are catalogued in Appendix A). Two guardrails hold:

- Ship tokens, fonts, base styles, and the decoupled atom layer (Button, Chip, StatusPill, Ring, Meter, MetaRow, Icon, Card, CardHead), not a full component library. The bespoke shells (the dashboard's 12 widgets, the quiz's node graph) stay per-product, since they are coupled to each app's stores and fixtures. This mirrors the Figma DS library's own scope split: foundations shared, composites per file.
- Keep one values authority (the Figma library, reverse-engineered from the RC UI Kit image) expressed in two consumable forms: the React and Tailwind tokens for the prototypes, and the Angular SCSS tokens (`style_guide/rc-ui-kit`) for the Fivestar rebuild. Same values, two stacks, fed from one source.

This includes bundling the same decoupled atoms into the Claude Design DS project, so the exploration work can use real components instead of hand-rolled HTML. That is a now-or-never call, not a later one: Claude Design is not a handoff deliverable and the project ends at the handoff, so deferring it past the demo means never doing it at all. We do it now (the atoms are already decoupled, so the converter's bundle step is cheap), with one degradation path: if the esbuild bundle fights Claude Design's renderer under deadline, fall back to static preview cards rather than sink time into it. Keep the published Figma library (`afi5Q5nFtcnT9HJ04Cbylg`) as the single canonical values source and `FIGMA_MAP.md` as the binding manifest. Building the shared repo is not from-scratch work; we extract what already exists in the dashboard and retire the competing copies. Section 10 has the architecture, the atom list, the esbuild reasoning, and the build sheet.

---

## 7. Recommendation C: three surfaces, three jobs, tokens flow one way

The reason the three-path workflow feels tangled is that the jobs are not assigned. Here is the assignment.

- **Code owns two things: the token values and the behavior.** The canonical `@theme` block lives in code (the dashboard today, the shared package later). Interaction, state, and motion live in code and stay there.
- **Claude Design is the exploration lab.** It is where new screens and ideas get tried fast, in HTML and CSS, against the shared token bundle. It is cheap and throwaway-friendly, which is exactly right for the open questions on the results screen. The quiz exploration project is already doing this well.
- **Figma is the settled and handoff surface.** Once a screen stops moving, it gets captured into Figma (via `/capture-figma`, bound through `FIGMA_MAP.md`), iterated there when a designer wants to, and pulled back as tokenized React (via `/pull-figma`). Figma is also the deliverable Fivestar expects.

The rule that keeps this coherent: **tokens flow one way, outward from code.** Code's `@theme` syncs to Figma (System A, the two-way round-trip for components and screens, but tokens still originate in code) and to Claude Design (System B, the one-way tokens-only export via `/design-sync`). One source, two mirrors. Nobody hand-edits a hex value in Figma or Claude Design and hopes it propagates back. Design iteration round-trips through Figma for screens and components; token values do not.

There is a third, smaller tool worth keeping distinct: the dashboard's `tools/design-reference/` Playwright harness, which screenshots a design source and the running app side by side as a fidelity oracle. That is a dev-only check, not a sync path. Keep it labeled as such.

The single most important thing this recommendation needs from Recommendation B: align the quiz's code tokens to the kit. Until that happens, the Claude Design mockups are on kit tokens while the quiz code is on stale ones, and the loop cannot close.

One extension, detailed in section 10: once the shared `rc-design-system` package exists, the box labeled code `@theme` above is that package. The dashboard and quiz import it rather than each authoring their own tokens, and it is also where the reusable React atoms live, so a new prototype gets both tokens and components from one import.

A simple way to hold the model in mind:

```
        RC UI Kit image  ──►  Figma DS library (canonical VALUES)
                                      │
                                      ▼
                        code  @theme / globals.css   ◄── single token source
                          │                     │
          System B (/design-sync)        System A (/capture-figma,
          tokens-only, one way            /pull-figma) screens &
                          │               components, round-trip
                          ▼                     │
                  Claude Design            Figma files
                 (exploration lab)      (settled + handoff)

   Exploration: Claude Design ─► implement in code ─► capture settled
   screens to Figma for the Fivestar handoff. Token values never
   originate downstream.
```

---

## 8. Recommendation D: port the dashboard's harness machinery

The dashboard's harness is the same one this repo started, retuned and grown. Three pieces are worth pulling back, and a few smaller ones.

- **`/revise-doc` plus the `doc-steward` subagent.** This is the biggest gap and the highest-value port, precisely because the quiz's specs are the ones churning hardest. `/revise-doc` edits the owning canonical doc, dispatches `doc-steward` to reconcile the others, appends a decision, and ticks `STATUS.md`. The conveyor residue spread across `PRD.md`, `ROADMAP.md`, `DESIGN_SYSTEM.md`, and `ARCHITECTURE.md` is exactly the kind of cross-doc ripple this tool is built to catch. Adopt the doc-ownership precedence with it (CONTEXT_BRIEF over PRD over DATA_MODEL over DESIGN_SYSTEM over ARCHITECTURE over ROADMAP; Figma wins for values, the doc wins for usage, code wins for behavior).
- **Rewrite the stale gates.** `verifier.md` and the `data-author` skill should lead with the live §17 invariants (7 scenes of 4 choices, one per category; the exam's 30 statements at 8/7/7/8; `expectedCategoryMax` of 11 per category; the role education and pay ladders) instead of the 24-item, three-archetype, robot-parts checks.
- **Fix the rubrics.** Retire `goose-game-aesthetic.md` (every session note since the pivot says it does not apply) and replace it with a results-screen rubric for the upcoming high-fidelity node-graph pass, which is currently ungraded. Fold the surviving reduced-motion and tokens criteria from `motion-quality.md` into `design-system-compliance.md`, matching the dashboard's structure, since the scene work that made motion a first-class concern is out of plan.

Smaller, optional alignments: add a `.claude/launch.json` to pin dev and preview ports; decide the MCP and plugin deltas consciously (this repo enables firecrawl and the commit-commands plugin, the dashboard does not); and reuse the dashboard's Session Setup researcher test bench pattern for the comparative study flows.

---

## 9. The realignment sweep (sequence)

Run it as one deliberate pass, in this order, so each step sets up the next.

1. **Branch and commit first.** The V3 work currently sits uncommitted on `main`, which breaks the harness's branch-first rule. Branch (for example `narrative-v3-realign`) and commit the existing V3 passes before touching anything else.
2. **Port the doc machinery.** Bring over `/revise-doc` and `doc-steward` and write the doc-ownership precedence into the docs. Do this first so the rest of the sweep ripples cleanly.
3. **Stand up the shared package and subscribe to it.** Extract `rc-design-system` (section 10), then have `explore_floor` import its kit-aligned tokens instead of hand-editing `globals.css`; run `/design-review`. If the package is not up yet, hand-align `globals.css` per Appendix A as the interim. Reconcile the parent `Capstone/CLAUDE.md` palette line in the same commit.
4. **Re-center the specs.** Promote `DATA_MODEL.md` §17 to primary; demote the robot, conveyor, and question-set sections to "documented cut." Rewrite the lead of `PRD.md`, `ROADMAP.md`, `ARCHITECTURE.md`, `DESIGN_SYSTEM.md`, `CLAUDE.md`, and `README.md` to the narrative quiz. Drive these through `/revise-doc` so the cross-doc ripples are caught.
5. **Rewrite the gates.** Update `verifier.md` and the `data-author` skill to the §17 invariants. Retire `goose-game-aesthetic`, author the results-screen rubric, and fold `motion-quality` into `design-system-compliance`. Retire `scene-motion` or rescope it to the modest UI motion that ships.
6. **Strip the build to the narrative flow, then pivot to ARM's three roles** (decided 2026-06-25; supersedes the original "decide the dormant-classic question," and corrects its now-inverted "drop the three role families" instruction). The team moved the prototype to the **narrative flow exclusively**, which unblocks two folded-together cuts, run as two reviewed sub-phases (destructive delete kept separate from content re-authoring):
   - **6a — Strip to narrative (destructive).** Tag a recovery point, then archive **both** the dormant Classic code **and** the **Exam** flow (the study's comparison condition, retired now that the narrative won), delete them from `main`, re-baseline the gates and E2E (7 → ~3). The build lands narrative-only, still on the four-category model. **Select stays** (it had a positive response; it auto-shows three cards after 6b). Exam can't sit dormant the way Classic did, because 6b changes the shared `CategoryId`, which would break `examFlow`'s typecheck and its 8/7/7/8 invariant.
   - **6b — Pivot to the three roles.** Collapse the four RC.org categories to ARM's updated three-role structure: Operate+Repair → the entry **Robotics Technician** (built from the old Operate/Operator content, HS/GED, $45,936), Program → **Specialist**, Plan → **Integrator** (the June 2026 site change captured verbatim in `docs/reference/ARM Updated Role Structure - Source Content.md`). Rename the `CategoryId` literals from `operate/repair/program/plan` to `technician/specialist/integrator` (honest names for the Fivestar handoff), recompute the per-category maxes, and rewrite the `CLAUDE.md` hard rule to the live three roles (it is **not** dropped; the live model *becomes* a three-role model).
   The verified Exam-archive blast radius, the corrected order-of-operations, and the five execution corrections are in `sessions/2026-06-25-strip-to-narrative-and-three-roles.md` (the handoff). 6a logs as the strip decision (D-027), 6b as the pivot decision (D-028).
7. **Fix the stale pointer.** Author `RoboticsCareer_Project_Master_Context.md` (a real consolidated portfolio narrative would serve the handoff) or remove the references from both CLAUDE.md files.
8. **Then build the high-fidelity results screen** from the Claude Design work, on the now-aligned tokens, and capture it into Figma for the handoff if the team wants it in the Figma deliverable. **Now planned in full — see `docs/knowledge/VISUAL_REARCHITECTURE.md`** (2026-06-26, `DECISIONS.md` D-029): a dark re-skin of the whole flow matching ARM's live **My Match** flow, plus the mockup's **5-screen results system** (role cards → compare → bubble map → job constellation → job overview), across 7 short phases (0/A–G). Role palette is kit-only **gold/teal/orange** (retires `arm-blue`); our question set stays ground truth (the mockup is visual/interaction only); local dark tokens now, the shared package (section 10) stays deferred.

Steps 1 through 7 are the realignment. Step 8 is the actual product work the realignment unblocks — and it is now scoped and sequenced in `VISUAL_REARCHITECTURE.md`.

---

## 10. The shared design-system package (`rc-design-system`)

This is the consolidation that turns the kit into one shared, subscribable source, written out in full so a session (or several) can work through it without re-deriving it. It is all now-or-never work: Claude Design is not a handoff deliverable and the project ends at the handoff, so nothing here can sensibly wait for after it (see Timing and trigger below). It answers the real question underneath Recommendation B: with six prototypes coming, where do the shared tokens and the genuinely reusable components live, and how does every surface get them.

### Two needs, two component tiers

Separating these dissolves most of the apparent tension.

Two needs:
- **Code reuse across the prototypes** wants a real, importable React component package.
- **Standardizing and rendering in Claude Design** wants either preview cards (cheap) or, for zero drift, the real components bundled in.

Two tiers of component:
- **Decoupled atoms:** Button / CtaButton, Chip, StatusPill, Ring, Meter, MetaRow, Icon, and the surface pair Card / CardHead. Prop-driven, no store reads, no fixtures.
- **Coupled shells:** the dashboard's 12 widgets, the quiz's node graph, anything that reads a Zustand store or a fixture.

The shared package carries tokens, fonts, and the atom tier. The shells stay per-product. This is the same scope split the Figma DS library already makes (it holds tokens plus foundation primitives, while the dashboard file holds the widget sets, which are deliberately not instances of the DS Card, per FIGMA_MAP §7's card-geometry contract). The rule to hold onto: a component is shared in all three surfaces (code, Figma, Claude Design), or in none of them.

### On esbuild-bundled React for the atoms (yes, and why it failed before)

The `/design-sync` converter reported that the dashboard "is a Vite application prototype, not a publishable component library... no main/module/exports entry," and offered to bundle component source directly via `componentSrcMap + esbuild`. The right read: that error is a packaging problem, not an esbuild problem. It failed because it was pointed at an app, which has no library entry, and because the dashboard's atoms sit next to coupled widgets.

Both problems disappear once the atoms live in a package with a real `exports` map. At that point two things become true at once: every prototype can import the atoms as ordinary code, and esbuild-bundling them into Claude Design is clean and faithful, because the atoms have no store or fixture dependencies to drag along. So the real React atoms (not just HTML previews) belong in the shared layer, and they render in Claude Design through the converter once they are decoupled and packaged. The decoupling is the prerequisite, not the esbuild.

This refines, rather than reverses, the earlier "tokens only" note. Tokens-only was the right call for syncing an app to Claude Design. Tokens plus decoupled atoms is the right call for a package consumed by many prototypes. Different artifact, different scope.

### The architecture

Stand up a thin standalone repo as the code authority. Do not promote the dashboard to that role: an app-as-library-source is the exact awkwardness that produced the converter error.

```
rc-design-system/
  package.json        # real main / module / exports  (this is what fixes the converter)
  tokens/             # @theme source + the flattened :root tokens.css
  fonts/              # the woff2 faces + fonts.css
  src/atoms/          # decoupled React + Tailwind atoms
  src/index.ts        # exports
  base.css            # the base layer
  styles.css          # entry: @imports fonts -> tokens -> base
  figma/FIGMA_MAP.md  # the binding manifest, moved here from the dashboard
  design-sync/        # config that pushes tokens + atoms to Claude Design
  conventions.md      # the usage + color-intent doc
  README.md
```

Source-of-truth roles, kept clean:
- **Figma DS library = canonical for values.** The kit lives there, audited against the RC UI Kit image. Figma wins on any value conflict.
- **`rc-design-system` repo = canonical for code.** Tokens as CSS and TS, plus the React atoms. It mirrors Figma's values.
- **Claude Design DS project = downstream mirror.** Regenerated from the repo via `/design-sync`: tokens plus atom previews, plus the esbuild-bundled atoms once they are decoupled.
- **Dashboard, quiz, RC_Proto, and the three new prototypes = consumers.** They import the package and stop authoring tokens locally.

The flow end to end: the RC UI Kit image feeds the Figma DS library (the values authority), which stays in step with the `rc-design-system` repo (the code authority), which publishes to the prototypes as a package and syncs to Claude Design as the downstream mirror.

### Distribution (keep it light for research prototypes)

These are high-fidelity research prototypes, not a long-lived product, so the bar is "shared tokens plus a few atoms so the prototypes look consistent and build faster," not a production design system. Ranked:

1. **Git dependency** (`"@rc/ui": "github:caelar/rc-design-system#v1"`). No registry, version by tag or commit. Best fit for the current separate-repo topology. Recommended.
2. GitHub Packages or a private npm. More versioning ceremony than this needs right now.
3. **pnpm-workspace monorepo** (`packages/ui` plus `apps/*`). The textbook answer, and it would also fix the harness-porting duplication across repos. But it restructures every repo and changes how the dashboard deploys to GitHub Pages, so treat it as a deliberate, separate decision, not a side effect of this work.
4. Vendored copy (the `.design-sync` bundle pattern) only as a stopgap, since it drifts unless regenerated.

### The discipline that keeps it from becoming a sixth source

One direction only, code to mirror. A provenance comment on every Claude Design card and every atom (source file, decision ID, which props are variants versus data, audit date), the way the Figma cards already carry it. Regenerate the Claude Design project, never hand-edit it. And the "shared in all three surfaces or none" rule above. Component sync does add a faithfulness gate, the kind we already felt on the Figma side (the D-044 and D-045 card-padding drift, where the widgets did not inherit DS Card edits). But for a project that ends at the handoff, that gate runs for weeks, not forever, so it is a cost we pay now rather than a reason to defer.

### Walking the options that were on the table

- A new repo holding just this: yes, the code authority above.
- "Delete the old Claude Design DS and re-upload": reframe to regenerate in place. The quiz exploration project imports that DS project's `_ds` bundle, so deleting it breaks the import. Point `/design-sync` at the new repo and overwrite the existing "RC Dashboard — Refreshed Design System" project (rename it "RC Design System"); the quiz re-imports the updated bundle.
- The dashboard as the ground-truth source: no. It is an app, not a library, so others would either reach into its `src/` over fragile cross-repo paths or carve a library boundary inside it anyway, which is the extraction in an awkward home.
- Import it into the dashboard, the quiz, and each new project: yes. That is the move that retires the five or six competing token sources.

### Timing and trigger

Bring the extraction forward to now, with one part held back. The package itself (kit tokens plus the decoupled atoms) and the subscriptions (the dashboard and the quiz importing it) are worth standing up before the handoff, for three reasons: we are re-aligning the quiz's tokens to the kit anyway, so doing it as a subscription rather than a hand-edit avoids throwaway work; the dashboard's tokens just stabilized, so it is a clean moment to extract a fixed source; and the high-fidelity quiz results screen is about to be built, so the package existing first means that screen is on-system from the first commit. The runway supports it: the handoff is about four weeks out, and the extraction is a day or two of work, most of it mechanical.

There is no part to hold for after July 21. An earlier draft parked the live esbuild render of the real atoms inside Claude Design as a post-handoff fast-follow, but that is incoherent: Claude Design is not a handoff deliverable and the project ends at the handoff, so its only useful window is now, during the remaining quiz and future-prototype explorations. So either it earns its place now or we skip it for good. We do it now, because once the atoms are decoupled the bundle step is cheap, with one degradation path: if the esbuild bundle proves fragile in Claude Design's renderer under deadline, fall back to static preview cards rather than fight it.

The hard guardrail on doing this now: run it on a branch with each consuming app's tests as the gate, so a packaging or import change cannot break the working-prototype build before the demo. The three unborn prototypes (Homepage, Sign-Up Flow, Explore Jobs and Trainings) are still the largest payoff, since they get to be born on-system, but they are no longer the trigger. The trigger is now.

### The Fivestar guardrail

The React package is for prototype velocity, not for the client. The Fivestar rebuild is Angular and Material, so the handoff artifacts stay the Figma file, the Angular `rc-ui-kit` under `style_guide/`, and the working prototype, all mirroring the same Figma values. The React package is an internal tool that makes building the six prototypes faster and more consistent. Do not let it get treated as the thing Fivestar consumes.

### Build sheet (for the session that stands this up)

A concrete checklist a later session or an agent can follow.

0. **Store-free atom audit (do this pre-handoff, it is cheap).** Walk `career_dashboard/src/components` and tag each file as atom (prop-driven, no store, no fixture) or shell. Expected atoms: `Card`, `CardHead`, `CardFooter`, `CtaButton`, `Chip`, `StatusPill`, `Ring`, `Meter`, `MetaRow`, `Icon`. Expected shells to leave behind: the 12 widgets, `StatusControl`, `WidgetCardControls`, `NudgeHost`, anything reading `dashboardStore` or `trayDragStore`. Record the verdict in the package's `conventions.md`.
1. **Scope the atom list by intersection.** Ship the atoms that are both Figma DS primitives and needed by the Quiz Results and question screens: `CtaButton`, `Card` + `CardHead`, `Chip`, `StatusPill` (or a match-percentage chip), `Ring` + `Meter` (the match arc and the fit read), `MetaRow` (salary and education lines), `Icon`. That intersection is essentially the whole foundation set.
2. **Create the repo** with the tree above. Give `package.json` a real `exports` map (this is the line that fixes the converter):
   ```jsonc
   {
     "name": "@rc/ui",
     "type": "module",
     "exports": {
       ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
       "./tokens.css": "./tokens/tokens.css",
       "./base.css": "./base.css",
       "./styles.css": "./styles.css"
     },
     "files": ["dist", "tokens", "base.css", "styles.css", "fonts"]
   }
   ```
   Build the atoms with a library bundler (Vite library mode or tsup). Keep Tailwind classes in the atoms and ship the tokens as the CSS layer the consumer imports, so a consuming app gets `import '@rc/ui/styles.css'` plus `import { CtaButton } from '@rc/ui'`.
3. **Move the canonical tokens in.** Lift the kit-aligned `@theme` from `career_dashboard/src/styles/globals.css` into `tokens/`, both as the authored `@theme` source and the flattened `:root` `tokens.css` (the existing System B faithfulness gate, name-and-value identical, carries over). Move `FIGMA_MAP.md` into `figma/`.
4. **Convert the consumers.** Point `career_dashboard` and `explore_floor` at the package: import its tokens and atoms, delete their local token authorship and their local copies of the shared atoms. Each app keeps its own shells.
5. **Repoint `/design-sync`.** Update the `design-sync/` config to source from the package, push the tokens and bundle the decoupled atoms (the `componentSrcMap + esbuild` path the converter offered, now clean because the atoms have no store or fixture deps), and overwrite the existing Claude Design DS project in place. Confirm the quiz exploration project still imports the bundle. Degradation path: if the esbuild bundle fights Claude Design's renderer under deadline, ship static atom preview cards instead. Do not defer this past the handoff; Claude Design has no use once the project ends.
6. **Start the new prototypes on it.** Homepage, Sign-Up Flow, Explore Jobs and Trainings: scaffold each with `@rc/ui` from the first commit, so they are born on-system.

The deliverable of that session is one token source consumed everywhere, the reusable atoms importable by every prototype, and a Claude Design DS project that mirrors real components instead of hand-rolled shells.

---

## 11. Watch-items and decisions that are yours, not mine

A few things sit above the code and need a call.

- **The Fivestar role overhaul.** _(Update 2026-06-25 — now ADOPTED, no longer deferred.)_ Their June 22 update standardized the live site to three roles plus three AI-prefixed variants, and quietly made their own quiz scenario-based. That breaks our four-category mapping. The team originally decided not to rework mappings this round (little runway). **What changed:** moving the prototype to the narrative flow exclusively removes the exam 30-statement re-pool that made this collapse expensive, and it dissolves the study-integrity objection (there's no longer a two-instrument comparison to keep stable). So the "collapse Operate and Repair" path this item predicted is now the actual plan, folded into the sweep as step 6b (the three-role pivot) above and detailed in `sessions/2026-06-25-strip-to-narrative-and-three-roles.md`. The AI-prefixed variants and Fivestar's own scenario-based quiz remain an open alignment item (worth a check that our three-role names match theirs before the handoff).
- **Define the match percentage.** Still the number-one unresolved content gap ("I guess 11 percent match means 11 percent match to the career?"). It needs one plain sentence, settled before the high-fidelity results screen ships.
- **Frame the entry Technician result as a starting rung, not a verdict.** _(Update 2026-06-25, D-028: "Operator" folded into the entry Technician when the four categories collapsed to three roles, so this now lands on the Technician result.)_ Both participants who landed on the old entry-level result felt deflated. Pair the Technician result with a visible path up to Specialist/Integrator and outbound links.
- **Small scoring calls:** whether the "Kinda me" middle bucket should keep scoring zero (`MAYBE_WEIGHT = 0`), and what Q0 ("experience in this field") should route to once unparked.
- **Where this memo should live.** It is written into `explore_floor/docs/knowledge/` because that is where the actionable work is. If you want it visible at the portfolio level, copy it up to `Capstone/`.

---

## Appendix A: the full drift catalog (every artifact to rewrite or remove)

Tokens and styles, in `src/styles/globals.css`:
- `--color-arm-yellow #ffb81c` (old kit name), `--color-arm-orange #f56a00` labeled Builder, `--color-arm-blue #38a5ee` labeled Innovator, `--color-arm-teal #117289` labeled Architect. The whole archetype-to-color mapping. Rewrite to kit names and values, delete blue.
- The Playful scene layer block: `--color-scene-paper #f5efe3`, `-paper-warm #efe4ce`, `-line #2d3a4a`, `-line-soft #5c6975`, `-scene-shadow`. Remove.
- `--color-text-default #2d3a4a` (navy-slate) and the Material triple-shadow stacks. Replace with the charcoal ink ramp and the three-tier soft elevation.

Harness:
- `.claude/skills/scene-motion/SKILL.md`: governs the conveyor, arm, build beat, and drag-to-bin that do not exist. Retire or rescope.
- `.claude/skills/data-author/SKILL.md`: headline still "24 interest items, Builder 22 / Innovator 27 / Architect 25" and "exactly three roles or archetypes." Rewrite to the §17 invariants.
- `.claude/agents/verifier.md`: hardcoded 24-item, three-archetype, robot-parts checks. Replace with §17.
- `docs/rubrics/goose-game-aesthetic.md`: retire. `docs/rubrics/motion-quality.md`: fold the surviving criteria into `design-system-compliance.md`. `docs/rubrics/design-system-compliance.md`: update its archetype-mapping and scene-namespace criteria to the four-category world and the kit palette.

Specs:
- `PRD.md` §1, §5.2 (assembly-line sort), §5.3 (Build payoff), §5.4 (robot on pedestal), §6 (the robot avatar), §10 (Goose-game). Rewrite to the narrative quiz and node-graph results.
- `ROADMAP.md` Phase 2 in full and most of Phase 3 (conveyor, animated sort, live robot, Build beat, pedestal). Replace with the real next steps.
- `ARCHITECTURE.md` §3 file tree (the unbuilt scene and robot branches), §5 scene composition, §9 the 3D path. Document the live libs and routes instead.
- `DATA_MODEL.md` §7 (robot parts), §10 (robot assembly), §16 (question sets). Archive; promote §17.
- `DESIGN_SYSTEM.md` §3.3 archetype accents, §3.4 scene palette, §10 playful layer, §12 conveyor and robot components. Drop or relegate; align accents to the kit; document the node-graph and role-sheet and fit-radar language.
- `CLAUDE.md` "What this is," Phasing, repo-structure block, and the "exactly three role families" hard rule. `README.md` opening. `STATUS.md` "Next up" line. All rewrite to the narrative reality.
- Decisions tied to dead features (D-006 demo mode, D-014 the drag-parts-off-belt sort, D-011 the deferred capture for the dead goose rubric): mark superseded-in-practice.
- `QUESTION_SET_WORKSHEET.md` and the §16 A/B language apparatus (set B never authored): archive.
- The stale `RoboticsCareer_Project_Master_Context.md` pointer in both CLAUDE.md files: author the doc or remove the references.

Dormant source to delete or archive (roughly 1,700 lines): `src/scene/LandingSceneHint.tsx`, `RobotPlaceholder.tsx`; `Sort.tsx`, `RoundBeat.tsx`, `Build.tsx`; `ClassicResults.tsx`, `Pedestal.tsx`, `RoleCard.tsx`, `ProgramList.tsx`, `FourPartRead.tsx`; `lib/scoring.ts`, `robotAssembly.ts`, `fit.ts`, `programSelection.ts`, `audio.ts`, `gsap.ts`; and the classic data (`robotParts.ts`, `items.ts`, `roles.ts`, `competencies.ts`, `skills.ts`, `programs.ts`, `colorSchemes.ts`, `rounds.ts`, `questionSets/setA.ts`, `classicFlow.ts`).

## Appendix B: canonical kit values (the harmonization target)

Brand: ARM Gold `#FFB81C` (primary and CTAs, a fill, never a text color on white), Secondary Teal `#117289` (the single interactive voice: links, CTAs, match), Secondary Orange `#bf5309` (rare attention, AA-safe). Tints: teal-soft `#f2f9fb`, orange-soft `#fbe9dd`.

Neutrals: ink `#262626`, ink-2 `#595959`, muted `#757575`, muted-2 `#9a9a9a`, border `#e0e0e0`, border-strong `#d4d4d4`, hairline `#ededed`, surface `#fafafa`, surface-2 `#f4f4f4`, card `#ffffff`. Proposed AA-safe danger `#c0341a`.

Status (calm, no red): applied teal, interview amber, offer and accepted green, closed grey.

Type: Montserrat 700 for headings, Roboto 400/500/700 for body and UI (no 600), Material Icons. Even ladder 10 / 12 / 14 / 16 / 18 / 24 / 46 plus a 28 identity step.

Spacing: a 4 and 8 grid (4 / 8 / 12 / 16 / 24 / 32 / 48 / 64). Radius (Refined): 6 / 8 / 10 / 14 / full. Shadows: three soft tiers (resting, hover, dragging). Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.

Do not mix in the document and Word palette's ARM Gold `#F5A623`. That is the deliverable-doc gold, a different value from the web `#FFB81C`, and the two palettes stay separate.

## Appendix C: the surfaces, by the numbers

- Figma design-system library (published, ARM team): `afi5Q5nFtcnT9HJ04Cbylg`. Dashboard file (subscribes): `7t46ROAv93lIQRspgaslgz`. Quiz file (V3 notes only today): `cd1DISE5pwqx8a8SnCsrp2`. Quiz storyboard FigJam (the illustrated narrative direction): `z0IKTwMMyYcAhqN46BaL77`.
- Claude Design: quiz exploration project "Interest quiz question cards exploration" (`3854272b-93f3-4276-a1d5-3612e8e0fa77`), importing the DS bundle from "RC Dashboard — Refreshed Design System" (`9747e5f8-cb73-43e6-8ca9-b0c5fefc9aac`). Separate live-site recreation: "RC.org Live Rip Design System" (`8686032d-11d9-4c5a-9ba4-336222bdbc27`).
- Handoff: the Fivestar dev team, lead contact Caroline Suh (Senior Design Consultant). Final presentation July 21, 10:00 to 11:30 at CMU. Deliverables: a Figma file, a working prototype, high-fidelity mockups of key interactions, workflow descriptions, and data assets. Real platform stack the rebuild targets: .NET, Angular, SQL Server, Angular Material, SSR.
