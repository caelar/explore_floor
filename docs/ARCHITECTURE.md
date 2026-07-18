# Architecture

This is the "how the code is organized" doc. It explains stack choices, how data flows through the app, where things live, how the Figma and Playwright integrations work, and the documented future 3D path. For *what* we're building, see `PRD.md`. For *what data shapes exist*, see `DATA_MODEL.md`.

---

## 1. Stack choices and why

### Build & language

- **Vite** for dev server and build. Sub-second hot reload, near-zero config, Claude Code is fluent in it.
- **TypeScript, strict mode.** Catches the failure mode of "Claude Code shipped a thing that runs but is subtly wrong." Strict mode makes the data model in `DATA_MODEL.md` enforceable at compile time.
- **React 18.** Function components and hooks only. No class components. No legacy patterns.

### Styling

- **Tailwind CSS (v4, CSS-first)** with the `@theme` block in `src/styles/globals.css` as the **single source of design tokens** (loaded via the `@tailwindcss/vite` plugin; there is no `tailwind.config.ts`). Colors, typography, spacing, radii. Never inline hex. Never magic pixel values. If a value is reused or semantically named, it lives in `@theme`. (Motion durations/easings live in `/src/lib/motion.ts`; easings are mirrored into `@theme`.)
- This matters more than usual because the design tokens are also the **shared vocabulary with Figma** (section 7).

### Animation & motion (two layers)

The build is a design showcase, so motion gets two complementary engines with a hard ownership boundary between them. They do not conflict because **a given element and property is owned by exactly one library at a time.** Motion runs through React's render cycle and the Web Animations API. GSAP writes straight to the DOM and SVG and bypasses React's reconciler, which is why it stays at 60fps on large choreographed sequences. The only failure mode is two libraries grabbing the same transform on the same node at once, and the ownership rule below prevents that.

- **Motion (the library formerly named Framer Motion)** owns everything driven by React state or component lifecycle: screen and route transitions (`AnimatePresence`), card enter/exit, the drag-to-bin gesture (`drag` + `dragConstraints`), hover/tap micro-interactions, results layout reflow (`layout` prop), the compare interaction (active card lights up, content swaps), and the central `prefers-reduced-motion` gate. Standard pattern: declarative `motion.div` / `motion.svg` with variants.
- **GSAP** owns timeline-choreographed, multi-element, scene-level sequences and the SVG effects Motion can't do cleanly. It has **no live animation as of step 8 Phase A** (D-029): the Landing `DrawSVG` reveal, its last live use, was removed when the Landing went type-led dark. GSAP stays registered in `lib/gsap.ts` as a future seam for the high-fidelity results work. _(The conveyor item travel + arm reach + part-to-robot + snap timeline, the cinematic build beat, `MorphSVG`, and `MotionPath` parts-into-robot-slots are the documented cut, see the live ownership note below.)_ GSAP is fully free as of 2025, including these formerly-paid plugins.
- **React integration is fixed, not improvised.** Every GSAP animation runs inside the `useGSAP` hook (`@gsap/react`) with a scope ref, so it's scoped and auto-cleaned on unmount via `gsap.context().revert()`. Never a bare `gsap` selector in a component. Plugins are registered once at app start (`gsap.registerPlugin(useGSAP, MorphSVGPlugin, DrawSVGPlugin, MotionPathPlugin)`); the registration stands even though no live consumer draws on it yet.
- **One motion language across both engines.** All durations, easings, and the spring config live in `/src/lib/motion.ts` (easings mirrored into the `@theme` block in `src/styles/globals.css`; durations stay in code). Motion transitions and GSAP timelines both read those constants, so the feel is unified even though two engines produce it. These tokens live in code only; they are not synced to Figma (Figma Variables can't model easing or springs).
- **Ownership per screen (live):** Landing — Motion for the hero entrance over the static factory-floor illustration (career-map merge); the GSAP `DrawSVG` reveal of the old scene hint was removed at step 8 Phase A (D-029), so the Landing still has no GSAP. Flow — Motion owns the bucket-sort drag gesture, the card UI, the step-to-step transitions, and the illustrated scene layer's entrances (`SceneBackground` / `SceneCharacter` / `ThoughtBubble`, career-map merge). Results — Motion drives the live dark role-cards screen (D-029 Phase C) and all of the career map's motion (camera glides, orb entrances, glow blooms, panel docking — career-map merge, gated by `prefers-reduced-motion`); the ambient bubble map's floating bubbles and the constellation's node float, Motion's Phase E/F work here, went with those surfaces when the career map replaced them (`docs/knowledge/CAREER_MAP_REVIEW.md`); the node-map layout and compare swap (`layout`) Motion was built for here went with the node map when it was deleted at Phase E, and the exam-dashboard reflow went with the Phase-4 cut. _(Documented cut: the conveyor belt + item-to-robot choreography and the cinematic Build-beat GSAP timeline were the showcase scene work, never built. The heavy GSAP timelines the two-engine split was designed for are parked; GSAP now has no live animation surface at all.)_
- **Use the official GSAP AI skills.** GreenSock ships `greensock/gsap-skills` (Agent Skills format: core, timeline, plugins, react, performance). Install it into the repo's Claude Code skills in Phase 0 so the agent authors GSAP with GreenSock's canonical patterns rather than guessing. See `ROADMAP.md` Phase 0.
- **Not used:** anime.js (overlaps GSAP, adds a third paradigm) and Lottie (passive playback, can't drive the interactive robot). Rive is a documented future exploration for the robot only; see section 9.

### Scene rendering

- **Plain SVG as React components.** The live SVG geometry is the three-axis fit radar (a triangle, `lib/nodeLayout.ts`), live in the `/select` comparator, plus the results **career map** (`lib/careerMapLayout.ts` over the fixed Figma art in `data/careerMapArt.ts`; career-map merge, `docs/knowledge/CAREER_MAP_REVIEW.md`). The map's predecessors went in turn: the node map (which shared `nodeLayout.ts`) was **deleted at Phase E**, superseded by the ambient bubble map, and the bubble map + job constellation (Phase E/F, `lib/bubbleLayout` / `lib/constellationLayout`) were **deleted at the career-map merge** — the dark role-cards screen had already replaced the node map as the results headline (D-029 Phase C, whose `SignalBars` replaced the triangle radar on the headline). The `/src/scene/` directory was deleted at step 8 Phase A (D-029) when the Landing went type-led dark and dropped its `LandingSceneHint` placeholder, so there is no scene layer left. No canvas, no WebGL: a deliberate choice for debuggability and Claude Code's success rate.
- _(Documented cut: the full assembly-line scene, conveyor, robotic arms, bins, and the composed-SVG robot in the old `/src/scene/` were the original plan, never built. §5 and the §9 3D path are parked with them.)_

### State

- **Zustand**, one store per domain. The primary store is `sessionStore.ts` (defined in `DATA_MODEL.md` section 12). If we add more stores (e.g. a settings store), each lives in its own file in `/src/state/`.
- No Redux, no Context for global state, no prop-drilling.

### Audio

- **Howler.js** for SFX. Small, easy, handles all the things native HTMLAudio doesn't.
- Sounds are **off by default** with a visible toggle in the UI (top-right corner). All sound calls go through a single `audio.ts` helper so the toggle works as a kill switch.

### Testing

- **Playwright** for end-to-end and visual regression. Set up in Phase 0 with one happy-path test. Expanded each phase.
- **Vitest** for unit tests of pure functions. The live brain is `categoryScoring.ts` (exhaustively tested), with `screenerFit.ts`, `categoryBreakdown.ts`, `compareRecommendation.ts`, `careerMapLayout.ts`, `jobTrajectory.ts`, `chipFit.ts`, and `nodeLayout.ts` alongside it; `data-integrity.test.ts` guards the §17 narrative invariants. 102 tests across 10 suites (`DATA_MODEL.md` §13 lists them; the map suites arrived with the career-map merge, and the `bubbleLayout` / `constellationLayout` suites left with their surfaces). The classic `scoring.ts` / `robotAssembly.ts` specs were deleted with the classic flow in Phase 4 (D-027).

### Tooling

- **pnpm** as the package manager. Faster, deterministic, doesn't blow up `node_modules`.
- **ESLint + Prettier** with a sensible default config. Run automatically before any commit.
- **Husky + lint-staged** for pre-commit hooks (optional; add if friction becomes a thing).

### What we explicitly do *not* use

- No SSR framework (no Next.js, Remix, etc.). This is a SPA prototype.
- No backend or BFF layer. No `/api` routes. Mocked data only.
- No state management library other than Zustand.
- No styled-components, Emotion, or CSS-in-JS. Tailwind handles everything.
- No UI component library (no MUI, Chakra, shadcn). We're building bespoke components; the design is the point.
- No routing library bigger than what we need. Use **React Router** for the few routes we have (§6: landing, character, flow, loading, results, select) and don't reach further.

## 2. Data flow at a glance

> The diagram below shows the **classic** (documented-cut) path. The **live** narrative flow follows the same shape with different actors: `sessionStore` actions `recordAnswer` / `advanceStep` / `completeFlow` feed `lib/categoryScoring` (the three-role engine), `lib/screenerFit` (the fit line), and `lib/categoryBreakdown` (the score provenance, wired in step 8 Phase C into the role-cards `WhyYouMatched`, D-029); the `Flow` and `roleDetails` data come from `/src/data/flows` and `roleDetails.ts`. The principle is identical: data down, actions up, logic in pure `/src/lib` functions. _(The `recordStatement` action served the cut exam flow.)_

```
                  ┌──────────────────────┐
                  │  /src/data           │
                  │  (typed constants)   │
                  └──────────┬───────────┘
                             │ imports
                             ▼
   ┌──────────────────────────────────────────────────┐
   │  /src/state/sessionStore.ts (Zustand)            │
   │                                                  │
   │  state: SessionState                             │
   │  actions:                                        │
   │    - recordDecision  ────► /src/lib/scoring      │
   │    - completeSorting    └► /src/lib/robotAssembly│
   │    - tryOnRole          └► /src/lib/programSelect│
   └──────────────────────┬───────────────────────────┘
                          │ useStore() / selectors
                          ▼
   ┌──────────────────────────────────────────────────┐
   │  /src/screens/* and /src/scene/*                 │
   │  React components — read state, dispatch actions │
   │  No business logic.                              │
   └──────────────────────────────────────────────────┘
```

The principle: **data flows down, actions flow up, logic lives in pure functions in `/src/lib`.** Components are dumb consumers. The store is the only thing that knows about both the data and the logic; everything else either provides one or consumes the other.

## 3. File structure (canonical)

```
/
├── CLAUDE.md                      Operating manual; read first
│                                  (MCP servers configured globally, not via a shipped .mcp.json — see DECISIONS D-012)
├── .claude/                       The agent + design harness
│   ├── settings.json              Permission allowlist + enabledMcpjsonServers whitelist
│   ├── skills/                    data-author, scene-motion (+ installed GSAP/Motion packs)
│   ├── agents/                    verifier, design-reviewer, doc-steward
│   └── commands/                  phase-check, design-review, compound, capture-figma, pull-figma, revise-doc
├── docs/                          All planning docs
│   ├── PRD.md
│   ├── CONTEXT_BRIEF.md
│   ├── DESIGN_SYSTEM.md
│   ├── ARCHITECTURE.md            (this file)
│   ├── DATA_MODEL.md
│   ├── ROADMAP.md
│   ├── knowledge/                 Living memory: STATUS, DECISIONS, LESSONS, CASESTUDY, sessions/
│   └── rubrics/                   Design-quality rubrics (design-reviewer grades against these)
│
├── public/
│   ├── audio/                     SFX files
│   ├── fonts/                     Self-hosted woff2 — Montserrat, Roboto, Material Icons
│   │                              (local @font-face, no CDN; D-029, step 8 Phase A)
│   └── favicon.svg
│
├── src/
│   ├── app/                       App.tsx, router.tsx, providers.tsx, main.tsx (plugin registration)
│   │                              + AppLayout (the dark-only canvas shell, step 8 Phase A)
│   │
│   ├── screens/
│   │   ├── Landing/               Landing.tsx + LandingBackground.tsx (the factory-floor
│   │   │                          hero, career-map merge) + index
│   │   ├── CharacterSelect/       LIVE (career-map merge) — /character, pick who you play as
│   │   ├── Flow/                  LIVE — the narrative runner
│   │   │   ├── FlowRunner.tsx     Renders the current step by type; advances the flow
│   │   │   ├── MCQuestion.tsx     Intro multiple-choice steps
│   │   │   ├── SceneSortView.tsx  A narrative scene: its 4 choices, bucket-sorted
│   │   │   ├── BucketSort.tsx     Shared one-card-at-a-time bucket sort
│   │   │   └── index.ts
│   │   ├── Loading/               LIVE (career-map merge) — /loading, the quiz→results
│   │   │                          interstitial (LoadingScreen, LoadingMiniMap, loadingMapRig)
│   │   ├── Results/
│   │   │   ├── Results.tsx        Renders ResultsExperience (the dark role-cards screen)
│   │   │   ├── cards/             LIVE — the dark role-cards screen (D-029 Phase C), compare,
│   │   │   │                      and the career map (career-map merge, CAREER_MAP_REVIEW.md):
│   │   │   │                      ResultsExperience, ResultsPanel, RoleHero, SignalBars,
│   │   │   │                      WhyYouMatched, RoleTabs, CompareView, AmbientField,
│   │   │   │                      CareerMap, CareerMapField, CareerMapHubLabel,
│   │   │   │                      CareerMapOrbGlow, CareerMapTargetJobOrb, MapContextPanel,
│   │   │   │                      MapPanelRole, MapPanelJob (the renamed JobOverview content),
│   │   │   │                      TrajectoryViz
│   │   │   │                      (view-state via useResultsNav: view cards|compare|map,
│   │   │   │                       mapPhase overview|role|job, selectedJob, targetJobId)
│   │   │   ├── category/          RoleDetailSheet.tsx, FitRadar.tsx — both still live in /select
│   │   │   │                      (the narrative node map — CategoryResults.tsx, NodeMap.tsx,
│   │   │   │                       FitNote.tsx — was deleted at Phase E, D-029; its Phase E/F
│   │   │   │                       successors, the bubble map + constellation + JobOverview
│   │   │   │                       page, were replaced by the career map at the merge)
│   │   └── Select/                RoleSelect.tsx — the /select role-pick comparator
│   │
│   │                              (no /src/scene — the dir was deleted at step 8 Phase A, D-029,
│   │                               when the Landing went type-led dark; the conveyor/robot scene
│   │                               was never built)
│   │
│   ├── components/                Button, CtaButton, SparkleStar, AppHeader,
│   │                              Icon (the Material-ligature wrapper),
│   │                              SceneBackground, SceneCharacter, ThoughtBubble (the scene
│   │                              illustration layer, career-map merge),
│   │                              categoryAccent.ts (live — exports ROLE_ACCENT)
│   │                              (the click-vs-drag alternative DragSortCard/DropZone was
│   │                              removed as dead code — D-031; the orphaned ProgressBar +
│   │                              SegmentedControl were deleted in the componentization run)
│   │
│   ├── state/                     sessionStore.ts, useFlow.ts
│   │
│   ├── data/                      See DATA_MODEL.md §17 (live) + §1–§14 (documented cut)
│   │   ├── flows/                 LIVE — narrativeFlow, screeners, buckets, index (registry)
│   │   ├── roleDetails.ts         LIVE — the three RC.org roles (duties, competencies, pathUp)
│   │   ├── bridgePrograms.ts      LIVE (D-029 Phase C) — per-role bridge programs (placeholder)
│   │   ├── jobs.ts                LIVE (D-029 Phase F) — per-role featured jobs, 4/4/4
│   │   ├── exploreContent.ts      LIVE — the "How you fit" tab narratives
│   │   ├── careerMapArt.ts        LIVE (career-map merge) — fixed Figma map geometry + role colors
│   │   ├── sceneBackgrounds.ts    LIVE (career-map merge) — scene step → background image map
│   │   ├── thoughtBubbleIcons.ts  LIVE (career-map merge) — per-choice thought-bubble art
│   │   ├── loadingCopy.ts         LIVE (career-map merge) — the /loading rotating status lines
│   │   ├── roleSelect.ts          /select copy
│   │   ├── types.ts               §17 flow/category types (the classic types live in the
│   │   │                          deleted-flow record)
│   │   └── index.ts
│   │
│   ├── lib/
│   │   ├── categoryScoring.ts     LIVE — calculateCategoryScores + computeCategoryMax
│   │   ├── screenerFit.ts         LIVE — the education/pay fit line
│   │   ├── categoryBreakdown.ts   LIVE — score provenance; wired in step 8 Phase C into the
│   │   │                          role-cards WhyYouMatched (openers/moments + passedLabels, D-029)
│   │   ├── nodeLayout.ts          LIVE — fit-radar geometry for /select (the node map it also
│   │   │                          served was deleted at Phase E, D-029)
│   │   ├── careerMapLayout.ts     LIVE (career-map merge) — the career-map brain (pure + tested):
│   │   │                          area-true %-sized hub radii, edge re-trim, the pane-aware
│   │   │                          camera; see DATA_MODEL.md §13
│   │   ├── jobTrajectory.ts       LIVE (career-map merge) — a job's prior/current/next ladder
│   │   │                          rungs for TrajectoryViz
│   │   ├── jobDisplay.ts          LIVE (career-map merge) — salary/education display parsing
│   │   ├── chipFit.ts             LIVE — one-line chip fitting ("why you matched" chip row)
│   │   ├── gsap.ts                LIVE — GSAP plugin registration (a future seam; no live
│   │   │                          animation since the Landing reveal was removed, D-029)
│   │   ├── motion.ts              Motion tokens (durations/easings); both engines read these
│   │   ├── typeScale.ts           px-string mirror of the @theme type-scale steps (h4/h5/body)
│   │   │                          for Motion fontSize animation in SceneSortView (same mirror
│   │   │                          pattern as motion.ts)
│   │   ├── __tests__/             categoryScoring, screenerFit, categoryBreakdown,
│   │   │                          compareRecommendation, careerMapLayout, jobTrajectory,
│   │   │                          jobOverviewStats, chipFit, nodeLayout, data-integrity
│   │   │                          (102 tests across 10 suites)
│   │   └── index.ts
│   │
│   └── styles/
│       └── globals.css            Tailwind v4 entry (@import) + @theme design tokens (mirrors the
│                                  published DS library; precedence in DESIGN_SYSTEM.md §2)
│
├── tests/
│   └── e2e/                       narrative.spec, role-select.spec, reduced-motion.spec,
│                                  map-debug.spec (live)
│
├── tsconfig.json, vite.config.ts, playwright.config.ts, package.json, pnpm-lock.yaml
└── README.md                      Teammate onboarding + MCP/toolchain setup; defers to docs/
```

> **Deleted in Phase 4 (D-027), recoverable at git tag `archive/pre-narrative-only`.** The tree above is the live tree. Phase 4 removed: the Exam flow (`data/flows/examFlow.ts`, `screens/Results/exam/*`, `screens/Flow/StatementSortView.tsx`, `tests/e2e/exam.spec.ts`); the Classic flow (`screens/Sort/*`, `screens/Build/*`, `screens/Results/{ClassicResults,RoleCard,Pedestal,ProgramList,FourPartRead}.tsx`, the classic libs `scoring.ts`/`robotAssembly.ts`/`fit.ts`/`audio.ts`/`programSelection.ts`, the classic data `items.ts`/`roles.ts`/`robotParts.ts`/`competencies.ts`/`skills.ts`/`programs.ts`/`colorSchemes.ts`/`rounds.ts`/`resultsCopy.ts`/`classicFlow.ts`/`questionSets/`, the classic components `MatchIndicator.tsx`/`accent.ts`/`RoundIndicator.tsx`); `scene/RobotPlaceholder.tsx`; and the classic E2E (`happy-path.spec`, `compare.spec`). `categoryBreakdown.ts` and `programs`/`competencies`/`skills` are discussed below — the breakdown engine was **kept**, the data files were **deleted** (the live results surfaced zero programs until step 8; the category-keyed `bridgePrograms.ts` brings a placeholder set back at step 8 Phase C, D-029).

### Sizing rules

- **Screens orchestrate.** A `Sort.tsx` is layout, state reads, and event handlers. The actual sort card and bin UI live in sibling files.
- **Split by responsibility, not by line count.** A file does one job. A screen holds layout, state reads, and event handlers only; the moment it contains a reusable sub-element's JSX, inline business logic, or a second distinct UI concern, that part gets extracted to its named sibling (e.g. `SortCard.tsx`, `SortBins.tsx`). Crossing ~250 lines is a prompt to re-check against this rule, not an automatic split, and never a reason to fragment a single coherent concern. The `@theme` token block in `src/styles/globals.css` is exempt; it's just a map.
- **`index.ts` per folder** as the barrel export. Other files in the folder are not imported directly from outside the folder.

## 4. State patterns

### Reading state

```ts
import { useSessionStore } from '@/state/sessionStore';

// Subscribe to specific slices, never the whole store
const currentRound = useSessionStore((s) => s.state.currentRound);
const recordDecision = useSessionStore((s) => s.recordDecision);
```

This avoids unnecessary re-renders. **Do not** subscribe to the entire store from a component.

### Dispatching actions

All mutations go through store actions. Components never mutate state directly. The store actions are the only place that touches `/src/lib` business logic.

### Computed/derived state

Either compute inside a store action (and store the result), or use a selector pattern with `useMemo`. Don't recompute the same thing in five components.

### Persistence

None in v1. State lives in memory and resets on refresh. This is intentional for the prototype.

## 5. Scene composition — documented cut

> **Parked.** The assembly-line scene was never built, and `/src/scene/` is now gone entirely: its last file, the `LandingSceneHint` placeholder, was deleted at step 8 Phase A (D-029) when the Landing went type-led dark (`RobotPlaceholder` had already gone with the Phase-4 Exam/Classic archive). None of the `ConveyorBelt` / `RoboticArm` / `Bin` / `Factory` / `robot/parts` hierarchy below exists. The two-engine ownership rule (§1) still governs the **live** modest motion, but it is Motion-only in practice now: Motion owns the bucket-sort drag, step transitions, the role-cards compare stepping, and the career map's camera and orb motion (career-map merge; the bubble map's floating bubbles were the prior Phase-E surface); GSAP has no live animation (the Landing `DrawSVG` reveal was removed). The composition spec below is the original direction, kept for the record.

The assembly-line scene is built as a hierarchy of SVG React components. The scene choreography (belt, item travel, arm, part-to-robot) is driven by GSAP timelines; the drag-to-bin gesture and any React-state-driven transitions are Motion. See the ownership rule in section 1.

### Composition principle

The `<Factory>` is the static background. The `<ConveyorBelt>` is a long horizontal rectangle with motion. `<ConveyorItem>` instances ride it as labeled parts; the **user drags a part off the belt** into one of two `<Bin>`s set in front of the line (downscreen, in 2D) — "That's me" / "Not my thing." The `<RoboticArm>` then lifts each kept part from the keep bin and assembles it onto the `<Robot>`, which stands **behind/above the belt**; a second arm or a trash chute clears the pass bin. (Interaction model per `docs/knowledge/DECISIONS.md` D-014: the user sorts directly; the arm's job is assembly, not user-puppeteered sorting.) Engine split: Motion owns the drag-off-belt gesture; GSAP owns the belt, the assembling arm(s), and the part-to-robot snap.

### Motion variants

Each meaningful motion (arm-to-bin, item-to-bin, robot-part-snap-in) is a named variant. Variants live alongside the component that uses them. Standard set:

```ts
const ITEM_VARIANTS = {
  onBelt: { x: 0, opacity: 1 },
  toKeepBin: { x: 200, y: 80, opacity: 0, scale: 0.6, transition: { duration: 0.4 } },
  toPassBin: { x: -200, y: 80, opacity: 0, scale: 0.6, transition: { duration: 0.4 } },
};
```

This way the visual language is reusable and tunable from one place per concept.

### Performance notes

SVG performs fine at our scale. Cap the number of animated nodes to a few dozen at once (we'll have far fewer). Use `will-change: transform` sparingly. Profile if anything feels janky on a mid-range laptop; profile *before* optimizing.

## 6. Routing

Routes (`/src/app/router.tsx`):

- `/` — Landing (the factory-floor hero + start CTA; career-map merge)
- `/character` — `CharacterSelect`, pick who you play as (career-map merge; between landing and quiz)
- `/flow` — the `FlowRunner` (narrative): renders the current step by type
- `/loading` — the `LoadingScreen` interstitial (career-map merge; between quiz and results)
- `/results` — Results (renders `ResultsExperience`: the dark role-cards screen, compare, and the career map — the map replaced the Phase E/F bubble map + constellation + job-overview page at the career-map merge, `CAREER_MAP_REVIEW.md`)
- `/select` — the role-pick comparator (`RoleSelect`, the industry-professional arm)
- _(Documented cut: `/flow` also ran the cut Exam flow; `/results` also dispatched the exam dashboard and the classic results; the `/sort` and `/build` routes served the classic interest-sort and Build beat. All deleted in Phase 4, D-027. `defaultFlowId = 'narrative'`, D-021.)_

Navigation happens via store actions that update `state.currentScreen` *and* call `navigate()`; completion is declarative off `currentScreen` so it can't race the redirect. Refresh-on-results redirecting to landing is acceptable for a prototype.

## 7. Figma integration via MCP

The Figma MCP server is the seam between design and code, and it runs in a **read-leaning round-trip**, not a constant bidirectional sync. Code is the source of truth for behavior; the published Design System library is the source of truth for token values, with the `@theme` block mirroring it (`DESIGN_SYSTEM.md` §2); Figma is where static UI gets reviewed and refined visually. The binding manifest for the round-trip is `docs/figma/FIGMA_MAP.md` — `/capture-figma` and `/pull-figma` read it first, and an ID there is ground truth. The loop has a name and a tool now (see below), and Claude Code is a supported client for it.

### The round-trip: code to canvas and back

Figma's **code-to-canvas** tool (`generate_figma_design`, on the remote MCP server) captures live UI rendered from the running app into **editable Figma frames**. The flow is:

1. **Code to canvas.** Claude Code starts the local dev server, the tool captures the rendered screen (or a selected element) into Figma as standard, editable design layers. A whole multi-step flow can be captured screen by screen in one session.
2. **Refine on the canvas.** The captured frames are real Figma layers. A UI designer makes pixel-perfect edits to static elements: nudge spacing, retype copy, adjust a color, move a button, fix alignment.
3. **Canvas back to code.** You point Claude Code at the edited frame URL. It reads the frame through the MCP and implements the diff in React, against our conventions (Tailwind tokens, component composition), not as a blind regeneration.

### Why this earns its place

This is not "designs and code should match" for its own sake. It's a workflow lever for the team. It lets the UI-designer instinct make precise static edits on the canvas where that's faster and more natural than editing JSX, and it gives teammates who are less comfortable with agentic code authoring a real way to contribute changes that land in the build, without touching a terminal. That accessibility is the point.

### The honest boundary

The capture works on *rendered* UI, so the value is uneven by surface, and that's fine:

- **Static UI round-trips well:** cards, buttons, forms, the results layout, landing chrome, role cards. Edit these freely on the canvas and pull them back.
- **The animated scene and the robot do not round-trip.** They capture at best as a frozen snapshot of one DOM state, and their motion cannot be edited in Figma and brought back. Treat those regions of a captured frame as reference stills or leave them effectively blank. The conveyor, the arm, the build beat, and the GSAP/Motion choreography are code-authored, full stop. Nobody should expect to tune the scene in Figma.

### Variable sync (the part Figma can actually hold)

Design **variables** that Figma Variables can represent (color, typography, spacing, radii) stay synced by name between Figma and the `@theme` block in `src/styles/globals.css`: the Design System library (`afi5Q5nFtcnT9HJ04Cbylg`) holds the canonical values (the dark extension published there in ecosystem Pass 7, D-039) and the `@theme` block mirrors them, with `docs/figma/FIGMA_MAP.md` recording the variable IDs and the naming contract (`DESIGN_SYSTEM.md` §2 holds the precedence; the original RC-CC file is dead). Motion durations, easings, and springs are **not** in this set; they live in `/src/lib/motion.ts` in code only, because Figma can't model them. Keep the naming aligned so captures and variable reads stay clean:

- Figma `color/brand/gold` ↔ Tailwind `arm-gold` (kit-aligned; renamed from `arm-yellow`, D-024)
- Figma `color/role/{technician,specialist,integrator}` ↔ Tailwind `arm-gold` / `arm-teal` / `arm-orange` (the finalized role accents map to kit brand tokens via `ROLE_ACCENT` in `categoryAccent.ts`, D-029; the dark `-soft`/`-on`/`-glow` derivatives are the `--color-role-*` set)
- Figma `space/4` ↔ Tailwind `space-4`

Sync a related set as one operation (all colors at once, the full type scale at once) so there's no half-synced in-between state. Naming alignment is a soft convention that makes the round-trip cleaner; it is not enforced by tooling.

### No Code Connect

Earlier drafts leaned on Code Connect (`.figma.tsx` mapping files, `figma connect publish`) as the enforceable contract between Figma components and React. We are **not using it.** Its Dev Mode payoff is gated behind Figma Organization/Enterprise plans the team doesn't have, and the code-to-canvas round-trip above doesn't need it. Naming-convention discipline plus the capture loop covers what we need.

### Selective, not constant

Capture and sync at meaningful checkpoints: when a design iteration is settled, before a user test, before showing ARM, after a focused code-side refactor. Drift between Figma and code is fine when it's intentional and short-lived. Continuous background sync is noise.

### What we don't auto-generate

We don't auto-generate React components from Figma layouts from scratch. Layout-to-code generation fights our conventions (inline styles, deep wrapper nesting, no Tailwind tokens, no real composition). The MCP is for capturing rendered UI to the canvas, reading frames as reference, and applying surgical updates back to code, not for building components from nothing.

### Phase 0 setup (see ROADMAP)

Connect the remote Figma MCP server for Claude Code, authenticate, confirm a read works (pull a variable or a frame), and confirm one code-to-canvas capture succeeds. That's the whole gate. There is no write-round-trip smoke test to block on and no Code Connect publish step.


## 8. Playwright integration

Playwright is set up in Phase 0 and runs as part of `pnpm test`. It serves two purposes: regression prevention and self-verification during development.

### Test types

- **Flow E2E (live).** `narrative.spec` walks a known set of answers through `/flow` to `/results`, asserting the displayed percentages match the engine and the right top match shows; `role-select.spec` covers the `/select` comparator; `reduced-motion.spec` (rehomed to the narrative flow in Phase 4) checks the `prefers-reduced-motion` path; `map-debug.spec` asserts the career map's hub/orb geometry against the layout brain (career-map merge). Four specs total.
- **Interaction tests.** The bucket-sort drag, the role-cards compare stepping, the career map's dive-into-a-role (hub → role zoom → job panel).
- _(Documented cut: `exam.spec` drove the cut exam flow, and `happy-path`/`compare` drove the classic flow via a dev-only store handle. All deleted in Phase 4, D-027.)_
- **Visual regression.** Snapshot key screens. A later add.

### Self-verification by Claude Code

After making a change, Claude Code should run the Playwright suite and inspect failures rather than asking the user to manually check the browser. For visual changes, take a screenshot and view it. This dramatically reduces the "is it actually working?" loop.

### Test data

Tests use fixed seed data, not the live mock data. Tests live in `/tests/`, fixtures in `/tests/fixtures/`. A test that needs a specific scoring outcome constructs its own decisions object rather than relying on the live data, so tests don't break when content gets tuned.

### Configuration

`playwright.config.ts` runs against the dev server. Browsers: Chromium for fast iteration, with Firefox/WebKit as an optional matrix in CI. Headless by default.

## 9. The future 3D path (documented, not built)

> **Doubly parked.** This path migrates the assembly-line scene to 3D, but that scene is itself the documented cut (§5) and the live flows skip the robot entirely. So the 3D path is contingent on first building the 2D scene the realignment cut. Kept for the record only; it is not on any current track.

The PRD scopes the prototype to 2D. This section exists so the team has a credible path to 3D later without redoing the foundation.

### What changes

Only `/src/scene/` and its dependencies. Everything else (the data model, the scoring engine, the state store, the screens, the components, the design tokens) stays.

### What gets added

- **`@react-three/fiber`** for declarative 3D in React.
- **`@react-three/drei`** for OrbitControls, common helpers, useful primitives.
- Optionally **`leva`** for live-tuning 3D parameters during development.
- A `<Canvas>` boundary at the top of the scene tree. Inside the Canvas: 3D scene. Outside: regular DOM/SVG/HTML.

### What gets rebuilt

- `<ConveyorBelt>`, `<ConveyorItem>`, `<RoboticArm>`, `<Bin>`, `<Factory>` — all migrated from SVG to 3D meshes.
- The robot — modeled as a parameterized 3D mesh with attachment points instead of layered SVG parts. The data-driven part contributions still resolve to attachable 3D meshes, the same way SVG components do today. The `RobotState` schema is unchanged.
- Scene animation moves from GSAP timelines to a mix of Motion/GSAP (for UI overlays) and three.js animation primitives (for the 3D scene itself). Lerping camera, animating bones on the arm, etc.

### What stays the same

- The data model.
- The scoring engine.
- The robot assembly logic. The output is the same; only the rendering of the resulting parts changes.
- The state store.
- The non-scene UI: cards, buttons, navigation, results layout.
- The Figma design system (with 3D-specific concerns added: lighting, materials, camera framing).

### Cost estimate (rough)

A focused engineer could migrate the scene to 3D in 2–4 weeks, most of it spent on asset modeling and lighting rather than code. Doing it now would consume a disproportionate share of the prototype timeline and add risk; doing it later is straightforward because the seam is clean.

### Trigger for actually doing it

When ARM commits to building this for production and wants the "cinematic" treatment ARM expressed interest in, the 2D prototype is the proof-of-concept and the 3D version is the production build. The team isn't there yet.

### Sidebar: Rive for the robot (worth exploring, out of scope now)

Rive deserves a flag because it maps onto the robot better than anything else. It's purpose-built for interactive, state-machine-driven characters that respond to app state at runtime (the canonical example is Duolingo's mascot), the React runtime would bind cleanly to our Zustand state via data binding, and the runtime file is tiny. A Rive robot would be the single most impressive element in the build and a strong portfolio artifact.

It's out of scope for this timeframe for one concrete reason: the robot rig, mesh, and state machine have to be hand-authored by a person in the Rive editor, a separate tool with a real learning curve. Claude Code can wire the runtime and feed it inputs but cannot author the `.riv`. The team's animation-authoring bandwidth is thin (Caelan has some rigging/3D background, no one else does), so betting the centerpiece on a new tool inside this summer is the wrong risk. Documented here so the option is on the table if a future phase has the bandwidth; the default robot stays SVG composed from parts, animated by GSAP.

## 10. Build, lint, test

Standard scripts in `package.json`:

```
pnpm dev          # Vite dev server
pnpm build        # Production build (for demos)
pnpm preview      # Preview the production build locally
pnpm lint         # ESLint
pnpm format       # Prettier
pnpm typecheck    # tsc --noEmit
pnpm test         # Vitest unit tests + Playwright E2E
pnpm test:unit    # Vitest only
pnpm test:e2e     # Playwright only
pnpm test:visual  # Playwright visual regression only
```

A task is not done until `pnpm lint && pnpm typecheck && pnpm test` all pass.

## 11. Conventions and antipatterns

### Conventions

- **One concept per file.** A component, a hook, a helper. Not a grab bag.
- **Named exports.** `export const Foo = ...`. Default exports only where a framework requires (e.g. Vite entry, lazy-loaded routes).
- **Imports sorted** by the import-sorter convention (external first, then internal). Run on save.
- **Path alias** `@/` for `src/`. Configured in `tsconfig.json` and `vite.config.ts`. Use it; don't write `../../../`.
- **Props typed inline or via named interfaces** above the component. Pick one per component and stick with it.

### Antipatterns to flag (and refuse to do)

- Adding content (copy, weights, role descriptions) directly into a component. It belongs in `/src/data`.
- Reaching for `useEffect` to derive state. Compute it.
- Using `any`. If you genuinely need a punt, use `unknown` and narrow.
- Inline hex colors or pixel values. Use tokens.
- Adding a new top-level dependency without checking this doc or `CLAUDE.md`.
- Building a feature not described in `PRD.md`. Flag, don't build.
- "Helpful" generalizations (a config-driven sort engine when the spec is hardcoded 4 rounds of 6). Build the thing in the spec.

## 12. Dependency boundaries

Imports flow downward only:

```
screens / scene → components → state → lib → data
                                        ↑
                       (lib reads data, never the other way)
```

- `screens` and `scene` may import from `components`, `state`, `lib`, `data`.
- `components` may import from `lib` and `data` (rarely from `state`; prefer props).
- `state` may import from `lib` and `data`.
- `lib` may import from `data`.
- `data` imports nothing from `src/`.

If a circular dependency appears, that's a code smell pointing at a layering mistake. Fix it by moving code, not by adding `eslint-disable`.

## 13. Performance posture

This is a prototype, not a production product. The performance posture is:

- It should feel instant on a mid-range laptop in Chrome.
- No animation should drop below 60fps at normal viewport size.
- Bundle size doesn't matter for the prototype.
- We don't lazy-load anything.
- We don't do code splitting beyond what Vite does by default.

If something feels janky during development, profile and fix it. Don't optimize speculatively.

## 14. Accessibility posture

Light touch, per the PRD:

- Semantic HTML where it costs nothing.
- Keyboard navigation works for the sort interaction (drag-and-drop has a keyboard fallback: arrow keys + Enter to choose a bin).
- `prefers-reduced-motion` respected. Sound is off by default.
- Color contrast meets WCAG AA for text.

Anything more (screen reader narration of the scene, full keyboard nav of the results compare interaction) is deferred to a future build.
