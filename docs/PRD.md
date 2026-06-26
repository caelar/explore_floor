# Product Requirements: Robotics Career Discovery Experience

**Working name:** Explore the Floor (replacement) / RC.org Career Discovery
**Status:** Prototype spec, v1
**Audience for this build:** Late-stage high school students seeking training programs
**Owner:** Caelan (MHCI capstone, ARM Institute client)

---

## 1. Overview

This is an interactive, narrative career-discovery experience for RoboticsCareer.org. A user walks through a day in their life (a morning routine, arriving at school, a class handout, a club lunch, home, homework, a video game) plus a few intro questions, sorting the choices each scene offers into three buckets: That's me / Kinda me / Not me. At the end they reach a results screen that shows how they match four RC.org career categories (Operate, Repair, Program, Plan, which map to Operator, Technician, Specialist, Integrator), featuring their top match while keeping the others live and comparable, with an honest read on the education and pay each path asks for.

The live build ships this as the **Narrative** flow, and the narrative flow is the whole build (Phase 4 stripped it to that one flow, `DECISIONS.md` D-027). Two other flows are the **documented cut**, preserved for the record but removed from the live tree (recoverable at git tag `archive/pre-narrative-only`):

- The **Exam** flow (background questions plus a 30-statement sort, scoring the same four categories) was the study's comparison condition. The narrative won the June 2026 study, so the exam was retired and deleted in Phase 4. It is documented in section 8 and `DATA_MODEL.md` §17.
- The original concept, where a user sorted interest cards on a moving conveyor belt and watched a custom robot get built from their picks, survived as the dormant **Classic** flow and is preserved in `DATA_MODEL.md` §1–§14 (the classic pipeline). Phase 4 deleted it too.

The realignment that re-centered this spec on the narrative quiz is `docs/knowledge/REALIGNMENT.md`; treat that memo and `DATA_MODEL.md` §17 as the current product, and the exam, conveyor, and robot material below as the parked record. Phase 4 keeps the four-category model; the collapse to ARM's three roles is the later Phase 5.

It replaces three existing tools that currently sit on the site as separate, weak experiences:

- **Explore the Floor** — a static illustrated factory scene with clickable hotspots and embedded videos. Visually dated, passive, low engagement.
- **My Goal / Find My Match** — a forked flow (Find Jobs vs Find Training Programs) that asks users to self-select competencies and skills from dense checkbox grids, then returns top matches. Functional but dry, and demands knowledge the target user does not have.
- **Interest Quiz** — a 3-question multiple-choice quiz that prescriptively assigns a single role.

This build folds the intent of all three into one coherent journey aimed squarely at the high-school training-seeker.

## 2. Problem and why this exists

The compressed version (full version in `CONTEXT_BRIEF.md`):

- RC.org has an engagement problem. Roughly 100,000 annual visitors, about 3,800 registered accounts, fewer than half of those with completed competency info. The typical visit is under a minute and most people never return.
- The core research finding: **the barrier is not lack of interest, it is lack of specificity.** A large "maybe" group has not converted curiosity into intent because they cannot picture what the work actually looks like or see themselves doing it.
- The current quizzes worsen this. They are prescriptive (one role, take it or leave it), abstract (asking teens about competencies they have never heard of), and give users nothing to come back for.
- An SME interview (Jessica Hammer, CMU Center for Transformational Play) provides the design north star: games let people *try on* a professional identity without commitment, and "half-real" decisions give teens a sense of agency and consequence that traditional career exploration lacks. This experience is built on that idea.

**The job this experience does:** turn a vague "maybe robotics is interesting" into a specific, personal "here are real roles I could see myself in, here's what already fits me, and here's what I'd build to get there."

## 3. Goals and non-goals

### Goals

- Let a high schooler discover robotics manufacturing roles through concrete, relatable choices rather than abstract competencies.
- Produce a recommendation across all four RC.org categories (operate, repair, program, plan), not a single prescriptive verdict.
- Make the experience genuinely engaging and worth completing, so the narrative and its results feel earned. _(The original "robot payoff" goal is the documented cut.)_
- Make every piece of content (scene choices, intro questions, role copy, scoring weights, results text) trivially editable by the team without touching logic.
- Ship a flow testable with users (the Phase 1 milestone, met).

### Non-goals (for this build)

- Account creation, auth, persistence. Out.
- Real backend or live ARM data integration. Out.
- The professional adult/job-seeker track. Stub only (see section 11).
- 3D/WebGL rendering. Future path documented in `ARCHITECTURE.md`, not built now.
- Production-grade accessibility, performance, analytics. Light touch only.

## 4. The two-track context

RC.org's redesign direction includes segmenting users by life stage. The long-term vision is two discovery experiences:

- **Gamified track** (this build) — high schoolers and younger training-seekers. Engaging, narrative, interest-driven. _(The "playful assembly-line, robot-building" framing is the documented cut; the live engagement comes from the day-in-the-life narrative.)_
- **Professional track** (stub) — adult job seekers and career switchers. Streamlined, buttoned-up, competency-driven, the existing My Goal flow refined and modernized.

For this prototype we build the gamified track end to end. The architecture leaves a clean seam for the professional track to be added later, reusing the same role/competency data and scoring engine behind a different UI. There is **no segmentation gate inside this experience**; the user arrives here already routed to the gamified track. See section 11 and `ARCHITECTURE.md`.

## 5. The experience, screen by screen

The whole flow targets **around 3 to 4 minutes**. Desktop-first, mobile responsive.

> **What's live vs. what's parked (realignment, 2026-06).** The experience the build ships is the **Narrative** flow, described in §5.0 below and specified step by step in `DATA_MODEL.md` §17. The **Exam** flow, the conveyor-and-robot screens in §5.2–§5.4, and the robot avatar in §6 are the **documented cut**: the study's comparison condition and the original vision, kept for the record but deleted from the live tree in Phase 4 (D-027). Read §5.0 and `DATA_MODEL.md` §17 for the current product; read §5.2–§5.4 as the parked design.

### 5.0 The narrative flow (live)

The live experience is a guided "day in the life." After a short researcher-facing landing (§5.1), the user answers a few intro questions (experience, education appetite, salary appetite) and then moves through seven day-in-the-life **scenes** (morning, arriving at school, a class handout, a club lunch, home, homework, a video game). Each scene presents four choices, one tied to each RC.org category, and the user sorts each choice into one of three buckets: **That's me / Kinda me / Not me**. There is no conveyor and no robot build; the sort is a calm, one-card-at-a-time judgement on the shared `BucketSort` mechanic. _(The cut Exam flow reused the same `BucketSort` for its 30 statements.)_

The four categories (Operate, Repair, Program, Plan) map to four RC.org roles (Operator, Technician, Specialist, Integrator). Scoring is the pure four-category engine in `lib/categoryScoring.ts`, branch-aware (it only walks the path the user took) and normalized per category against its own max. Results lead with the user's top match and let them compare the others, plus an always-on education/pay fit read. The **Narrative** results are a node map. _(The study originally compared presentations too: the cut Exam flow presented its results as a dashboard with a score breakdown.)_ Full step structure, scoring, and results model are in `DATA_MODEL.md` §17.

### 5.1 Landing

- A single screen that sets the tone and frame and carries a small researcher-facing segmented control that picks the study condition. After Phase 4 the live segments are **Narrative / Select** (the switcher filters `flowList` by kind, so the cut Exam segment falls away on its own). The landing keeps the "Explore the Floor" name and a "Start the story" CTA. No sign-up, no form.
- A stylized scene hints at what's coming behind the CTA. The hero visual is being redesigned alongside the high-fidelity results screen (the prior placeholder line-art conveyor sketch is parked with the rest of the documented cut); see `docs/knowledge/REALIGNMENT.md`.
- One primary CTA to start.

### 5.2 Sort (the assembly line) — documented cut (Classic flow)

The core mechanic. Concrete interests and activities arrive on a conveyor; the user sorts each into one of two bins:

- **"That's me"** (keep)
- **"Not my thing"** (pass)

Details:

- **24 items total, in 4 themed rounds of 6.** Rounds give the experience rhythm and a sense of progress rather than one long undifferentiated task. Round themes are internal only; the user does not see category labels (per Make.md guidance). Themes: things you like doing, school and clubs, how you solve problems, how you work. Final item set in section 8.
- **Fixed, deterministic item set** for the prototype. Every user sees the same 24 items in the same order. No adaptive funneling in v1 (documented as a future enhancement in `ARCHITECTURE.md`).
- Each sort decision contributes to the scoring engine (section 7) and visibly adds a part to the robot being assembled (section 6).
- A subtle progress indicator (e.g. "Round 2 of 4" or a filling bar) keeps the 2-4 minute promise honest.
- Phase 1 implements this as a simple drag-the-card / tap-a-bin sort into two bins, no conveyor animation. Phase 2 layers in the turning conveyor with interest-labeled parts: the user drags parts off the belt into the two bins, and a robot arm assembles the kept parts onto the robot standing behind the line (see section 6 and `ROADMAP.md` §3.2, refined per `DECISIONS.md` D-014).

### 5.3 Build (the payoff moment) — documented cut (Classic flow)

- The robot **assembles visibly as the user sorts.** Each "That's me" decision adds a part in real time, so the user watches their robot come together across the four rounds. This is the moment-to-moment reward that keeps them going.
- The robot is **only finalized and keepable on completion.** Bail out halfway and there is no robot to take. Progress is visible, but the payoff (the finished avatar on the pedestal, the results) is earned only by finishing. The Build beat is the short, satisfying moment where the second arm snaps the last part into place and the robot is "yours."
- The robot's appearance is derived from the user's kept choices (which parts, colors, accessories map to which interests). Mapping defined in `DATA_MODEL.md`.
- Transitions directly into Results.

### 5.4 Results — documented cut (Classic flow)

The most important screen. It must read as a recommendation, not a verdict. _(The live narrative results are the node map described in §5.0 and specified in `DATA_MODEL.md` §17; the cut exam flow presented a dashboard. The robot-on-a-pedestal results below are the classic documented cut. The "recommendation, not a verdict" principle and the specificity payload carry forward verbatim into the live results; only the rendering changed.)_

- The user's built robot sits on a **pedestal, center stage, in front of the role card it most closely matches.** That primary card is fully rendered: role name, plain-language description, a match read, what already fits the user, and a clear next action.
- The other two role families are present as **ghosted / outlined cards** flanking the primary.
- The user can **move their robot onto a ghosted card** to "try on" that role. This is the mechanic that makes it a recommendation engine, and it carries the core payload of the whole experience. When the robot moves to another role, the card reveals a concrete, four-part read:
  1. **How you match it** (the normalized score and a plain-language take on the fit).
  2. **The skills you'd build** to grow into this path.
  3. **The competencies you'd build** (ARM's real role competencies, in plain language).
  4. **Programs that get you there** (training programs that help acquire those skills and competencies; stubbed/mocked in the prototype, the real seam to RC.org's training inventory later).
- This is the conversion moment. The flow's whole logic is: your interests build a robot, the robot shows a career path that fits you, here are the other real paths too, here is exactly what you'd need to build for each, and here are the programs that help you build it. That chain turns vague interest into a specific, actionable next step, which is precisely the "specificity" the research says is missing and the training-program conversion ARM wants.
- Each role family shows a **match score** (normalized, all three visible, e.g. 78% / 54% / 31%). Honest spread, never all-100.
- **Low-signal case (demo-safe, not production-hardened).** A picky user who passes most items can produce all-low scores (e.g. 14% / 9% / 5%). The screen should not read as broken: frame it lightly, something like "You played your cards close. Here's a first read, but retake and tell us a bit more to sharpen it." This is a front-end and service-design prototype; one graceful framing line is enough. Robust edge-case handling is the dev team's scope, not this build's.
- One clear primary action per role: **"Explore training programs for this path"** (stubbed/mocked in the prototype). This is the conversion target ARM cares about most, so it is the loudest action on the screen. A secondary "retake" is available but understated.
- The robot avatar is framed as something the user keeps ("This is your build"), reinforcing the takeaway and seeding the later account/profile concept without requiring sign-up now.

## 6. The robot avatar — documented cut

> The live narrative flow **skips the robot build** (the study kept presentation minimal so participants focus on the questions; `DATA_MODEL.md` §17, `DECISIONS.md` D-017). _(The cut exam dashboard had shown a static robot placeholder as a visual anchor only; `RobotPlaceholder.tsx` was deleted with the exam and classic flows in Phase 4.)_ Re-enabling a live build later is a per-flow step, documented but not built. The section below is the parked original design.

- Assembles live during sorting; finalized only on completion (no half-robot if the user bails).
- Composed of modular SVG parts (base, body, arms, head, tools, accessories, surface treatments). Mapping is **literal and expressive**: each kept interest contributes a specific, semantically obvious part or treatment. Keeping "coding or modding games" might bolt on a chip-pin or spray a binary pattern across the chest; keeping "shop class or robotics club" might attach a mini robotic arm or a hard hat; keeping "planning hangouts" might add a clipboard. The robot is meant to *read* as the user's choices, not merely imply them.
- Lives on the results pedestal and is the user's "result you can see."
- Designed so it could later become a profile avatar once accounts exist. Not wired to anything in this build.
- Mapping rules (interest kept -> robot part/trait) are data, defined in `DATA_MODEL.md`, and tunable without code changes.

## 7. Scoring model (recommendation, not prescription)

The principle is fixed across every flow: **a weighted match across all the roles, never a single prescriptive verdict.** What changed in the realignment is the model the live flows score against.

> **Live (narrative): four RC.org categories.** The shipping narrative flow scores `operate / repair / program / plan` (mapping to Operator / Technician / Specialist / Integrator) with the pure, branch-aware engine in `lib/categoryScoring.ts`, normalized per category against its own max. Each scored intro answer and each scene choice contributes; the middle "Kinda me" bucket scores `MAYBE_WEIGHT` (0 today, tunable). Full algorithm and the narrative `expectedCategoryMax` are in `DATA_MODEL.md` §17. The cut **Exam** flow scored the same four categories off a 30-statement sort. The three-archetype model below is the **documented cut** (the deleted Classic flow's `lib/scoring.ts`), preserved for the record. (Phase 4 keeps four categories; the collapse to ARM's three roles is Phase 5.)

- _(Documented cut — Classic flow.)_ The three role families map to three internal archetypes:
  - **Builder -> Robotics Technician** (hands-on, building, fixing, maintaining)
  - **Innovator -> Robotics Specialist** (coding, problem-solving, programming, systems)
  - **Architect -> Robotics Integrator** (planning, coordinating, seeing how it all connects)
- Each interest item carries weighted contributions to one or more archetypes (an item can lean toward more than one; weights need not be exclusive). Weights live in `/src/data` and are defined in `DATA_MODEL.md`. **The v1 weight values are designer defaults**, chosen to demonstrate the recommendation model and produce a believable spread. ARM's dev team owns the real tuning when this moves to production. The team's call here was: get a strong strawman in place, do not block on perfecting numbers.
- Keeping an item ("That's me") adds its weights. **Passing contributes zero by default.** The schema supports negative weights so the team can experiment later with passes that actively subtract from an archetype, but the v1 default is zero.
- After all sorts, the engine produces a **normalized 0-100 match score for each of the three archetypes.** The highest is the featured match; all three are shown and comparable.
- The engine is a pure function in `/src/lib/scoring.ts`, fully unit-tested, with no UI dependency.
- Design intent: scores should produce a believable spread (a clear lean plus meaningful runners-up), not a near-tie or a blowout. The item weights are the tuning surface for achieving that, and the team will iterate on them. Keep them in data and easy to adjust.

## 8. Content: the interest items

The locked 24-item set, per team decision. Drawn from the Make.md brainstorm. Final wording is good enough to build against; weights and any small wording polish will iterate inside `/src/data` without touching code.

> **Question-structure study (2026-06-07, supersedes the A/B language test; the study has since concluded):** for the first user test this 24-item set lived as the **Classic** flow inside the flow registry (`DATA_MODEL.md` §17). It ran alongside two structurally different conditions — **Narrative** (branching intro questions + 7 day-in-the-life scenes, where each scene's four choices are sorted into three buckets) and **Exam** (background questions + a 30-statement sort) — that scored four RC.org categories. Both sorts used the same three buckets — **That's me / Kinda me / Not me** (D-018). A landing switcher picked the condition. The narrative won, and Phase 4 deleted the Classic and Exam flows (D-027); this 24-item set is part of the documented-cut record now. The earlier formal/playful language A/B (§16, set B) was retired before its content was authored. The registry and switcher are a research instrument, not product scope; see §14 and `DECISIONS.md` D-017, D-018, D-027.

**Round 1 — things you like doing**
1. Building or fixing things
2. Taking things apart to see how they work
3. Coding or modding games
4. Solving puzzles or brain teasers
5. Planning hangouts or events for friends
6. Turning ideas into real plans

**Round 2 — school and clubs**
7. Shop class or robotics club
8. Hands-on science experiments
9. Coding or computer class
10. Solving math or science problems
11. Keeping your group on track
12. Planning ahead before starting something

**Round 3 — how you solve problems**
13. Taking things apart to find what's wrong
14. Trying things until something works
15. Looking up how others fixed it
16. Testing different solutions
17. Writing or drawing out a plan first
18. Figuring out how all the steps connect

**Round 4 — how you work**
19. Fixing things when they break
20. Noticing when something needs fixing
21. Wanting to know how and why things work
22. Finding smarter or faster ways to do things
23. Seeing how everything fits together
24. Spotting problems before they happen

Each item maps to archetype weights in `DATA_MODEL.md`. Builder-leaning items emphasize hands-on building/fixing; Innovator-leaning items emphasize coding/research/problem-solving; Architect-leaning items emphasize planning/coordinating/connecting. Many items legitimately lean toward two archetypes and are weighted accordingly. Each item also maps to a literal, expressive robot-part contribution per section 6.

## 9. Content: roles, competencies, jobs

> **Documented cut (classic foundation).** The three archetype-tagged role families below are the classic content set. The live narrative flow scores four RC.org category roles whose content lives in `roleDetails.ts` (Operator / Technician / Specialist / Integrator; `DATA_MODEL.md` §17). The competency framework here seeded the shared `competencies.ts` / `programs.ts`, which were deleted in Phase 4 (D-027); the live narrative results surface zero programs today, and a category-keyed program/competency set returns at step 8 (`REALIGNMENT.md`). Read this section as reference and as the parked taxonomy.

The role definitions use ARM's **real competency framework**, captured from the existing My Goal screens. This is the mock-data foundation. (We can later replace or extend with scraped/official data; structure stays the same.)

### Robotics Technician (Builder)
- Plain-language framing: installs, maintains, and repairs the robots and equipment on a factory floor. Hands-on, learn-by-doing.
- Real competencies (mock data): Electrical Systems, Electronics & Controls, Fluid Power, Maintenance & Troubleshooting, Mechanical Systems, PLC (Programmable Logic Controller), Robot Programming, System Controls.
- Example jobs (from Make.md, retained): Robotics Technician, Manufacturing Maintenance Technician, Automation Equipment Operator, Robot Repair Specialist, Assembly Line Technician.
- Path framing: often starts with an apprenticeship or technical certificate, learning on the job.

### Robotics Specialist (Innovator)
- Plain-language framing: programs robots and designs the automated systems that make manufacturing faster and smarter.
- Real competencies (mock data): Advanced Robot Programming, Application Emphasis, Inspection/QA, Installation Concepts, Project Management, Robot and System Troubleshooting, Safety/Risk Assessment, Sensors, Vision.
- Example jobs: Robotics Specialist, Robot Programmer, Automation Engineer, Controls Engineer, Manufacturing Systems Developer.
- Path framing: often a degree in engineering, computer science, or robotics.

### Robotics Integrator (Architect)
- Plain-language framing: evaluates factories and designs the plans to bring robotic systems in; sees how all the pieces fit together.
- Real competencies (mock data): Augmented Reality/Virtual Reality, Big Data, Computer Programming, Interoperability, Offline Programming, Simulation, System and Process Design, Systems Simulation/Modeling, Visualization.
- Example jobs: Robotics Integrator, Automation Project Manager, Systems Integration Engineer, Manufacturing Operations Manager, Robotics Consultant.
- Path framing: often engineering or project management, frequently growing up from specialist roles.

### Shared essential skills (mock data, from ARM framework)
Active Listening, Adaptability, Attention to Detail, Communication, Conflict Resolution, Critical Thinking, Interpersonal Skills, Leadership, Problem Solving, Teaming, Technical Learning Ability, Technology Aptitude, Time Management, Work Ethic.

### Training programs (mock data)
The results screen surfaces programs that help a user build toward each role (section 5.4). For the prototype these are **mocked** as a small set of representative programs tagged to each role family and to the skills/competencies they develop. Structure is defined in `DATA_MODEL.md` and is shaped so a real RC.org training feed could drop in later without UI changes. Seed the mock set from real endorsed programs where convenient (e.g. SMART Robotics Technician Program, NC3 Certification, university mechatronics certificates), but accuracy is not required at this stage; the point is to prove the surface.

**Competencies are an output, not an input.** The user never picks competencies in this track. On the results screen, the relevant competencies for each role are translated into plain language and tied back to what the user's sorting revealed ("this role leans on hands-on troubleshooting, which is where you scored high"). Raw competency checkboxes belong to the professional-track stub.

## 10. Visual and tonal direction

Full detail in `DESIGN_SYSTEM.md`. The essentials:

- **On the RC UI Kit, no rebrand.** The design system is kit-aligned (`DECISIONS.md` D-024), matching `career_dashboard`: ARM Gold `#FFB81C` as the brand signature and primary CTA fill, Secondary Teal `#117289` as the interactive voice, a charcoal ink ramp, Montserrat + Roboto. This reads as part of RC.org because it shares the kit. Calm, warm, plainspoken, confident with negative space.
- **Supersede the neon palette.** The Make.md brainstorm colors (neon teal/blue/magenta) are dropped, permanently.
- **The four category accents** are a restrained, teal-led set being finalized with the high-fidelity results screen (`categoryAccent.ts` today; the kit reconciliation and the `arm-blue` retone are the step-8 results work in `REALIGNMENT.md`). No invented per-screen colors.
- **Motion is modest and state-driven.** Motion (the React library formerly called Framer Motion) carries the UI: screen and flow-step transitions, the bucket-sort drag, the node-map compare swap. GSAP carries the one ambient flourish that ships, the Landing reveal (`DrawSVG`). Smooth and calm, never frantic. Full rationale in `ARCHITECTURE.md` section 1. _(The conveyor, robotic arm, parts arcing into a robot, and the cinematic build beat are the documented cut, never built.)_
- **Sound is a light seasoning.** Subtle clicks and a soft completion cue, if added. Muted by default with a visible toggle. _(Documented as a Phase 3 polish item; not load-bearing.)_

> **Aesthetic anchor (documented cut): Untitled Goose Game.** The original direction was a Goose-game-adjacent illustrated scene (warm linework, a hand-crafted conveyor and robot). That scene was never built and is parked with the rest of the conveyor vision. The surviving intent, calm and warm rather than corporate or neon, lives on through the kit-aligned system, not through an illustrated scene layer.

## 11. The professional-track stub

Not built in this prototype. Documented so the architecture accommodates it:

- Same role and category data, same scoring engine. The live shared foundation is the four-category model (`roleDetails.ts` + `lib/categoryScoring.ts`); the "three role families" wording elsewhere in this doc is the dormant classic seam.
- Different input: explicit competency and skill self-report (the existing My Goal grids, modernized), since the adult audience can answer those.
- Different UI: streamlined, professional, no robot, no conveyor.
- Different output: still a ranked recommendation across the categories, but presented soberly.
- In code, this means the scoring engine and role/competency data are UI-agnostic and importable by a future professional-track surface. Do not couple them to gamified-track components.

## 12. Success criteria for the prototype

The prototype is successful when:

- A user can complete the narrative flow (land -> answer the intro questions -> sort the scenes -> results) in around 3-4 minutes with no dead ends.
- The results screen shows a believable weighted match across the four categories, with the compare interaction (the node-map swap) working.
- The result explains itself: the match read, the education/pay fit line, and a path the user can take next.
- The team can change any scene, intro question, weight, role detail, or piece of results copy by editing `/src/data` alone.
- The Playwright suite (narrative + role-select + reduced-motion) passes and the experience runs with no console errors.
- It is demoable to the ARM client and testable with the MHCI cohort.

_(Documented cut: the classic measure was "land -> sort 24 items -> build a robot -> three-role results." Preserved in §5.2–§5.4.)_

## 13. Open questions

After the team conversation, the resolved decisions are: the 24-item set is locked, the robot-part mapping is literal and expressive, passed items contribute zero (with the schema allowing negative for later experimentation), and archetype weights will be designer defaults that ARM's dev team owns tuning for production.

What remains (the live open questions are tracked in `docs/knowledge/REALIGNMENT.md` §11: define what the match percentage means in one line, frame an Operator result as a starting rung rather than a verdict, and settle whether "Kinda me" keeps scoring zero):

- **Results copy:** the per-role fit descriptions, the "why you scored that way" interpretation for a teen, the way mocked programs are described.
- **Landing copy:** the single sentence that frames the whole experience.
- **Specific robot-part choices per interest** — _documented cut;_ parked with the robot build (§6).

## 14. Explicitly out of scope

Auth, accounts, persistence, backend, real ARM data, the professional track, 3D/WebGL, analytics instrumentation, production accessibility, and any screen or step not described above. Flag before building any of these.

**Note on demo affordances.** Two non-core conveniences are intentionally allowed even though they are not part of the user-facing flow in section 5: a `?demo=true` mode that pre-fills a representative result and jumps straight to Results, and a hidden skip-to-results link for demo and user-test setup. Both are Phase 3 tooling (see `ROADMAP.md` 4.5 and 4.7), exist only to make demos and testing faster, and are the documented exception to "no step not described above."

**Note on the flow switcher (2026-06-07, updated 2026-06 for Phase 4).** The Landing screen carries a small researcher-facing segmented control that picks the study condition. After Phase 4 the live segments are **Narrative / Select** (`DATA_MODEL.md` §17, `DECISIONS.md` D-017, D-021, D-027); the switcher filters `flowList` by kind, so the cut Exam segment falls away, and the cut Classic flow already had no UI entry. Its slot had gone to the `/select` role-pick comparator. Like the demo affordances above, the switcher is a documented research instrument, not user-facing product scope; ARM's production build would drop it and ship a single chosen flow. (This supersedes the 2026-06-04 A/B language switcher.)
