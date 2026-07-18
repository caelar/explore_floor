# Data Model

This is the schema spec for everything in `/src/data` and the pure helpers in `/src/lib` that consume it. It's the load-bearing doc. Get this right and the rest of the build is structured edits; get it wrong and the experience leaks logic into UI code, which is the failure mode this convention exists to prevent.

The single guiding principle: **data is data, not code.** All content (scene choices, statements, intro questions, weights, role copy, competency wording, programs) lives here. UI reads it. Logic transforms it. Nothing about the content lives in a component.

> **Read this first (realignment, 2026-06).** The **live model is §17, the three-role flow system** (`technician / specialist / integrator`), which the shipping **Narrative** flow scores with `lib/categoryScoring.ts`. Phase 5 (D-028) collapsed the earlier four-category model (`operate / repair / program / plan`) to ARM's three published roles: the entry **Technician** folds the old Operate + Repair, **Specialist** is the old Program, **Integrator** is the old Plan. Treat §17 and `lib/screenerFit.ts` as the **primary** schema. Sections **§1–§14 describe the classic three-archetype / 24-item / robot pipeline**, a **documented cut** that was **deleted from the live tree in Phase 4 (D-027)** and is recoverable at git tag `archive/pre-narrative-only`. The **Exam** flow (the study's comparison condition) joined the documented cut in the same phase: it was a real, tested flow, now retired and removed from the live tree, its record preserved here and in §17. The robot-parts schema (§7), robot assembly (§10), and the A/B question-set apparatus (§16) are parked the same way the future 3D path is parked in `ARCHITECTURE.md`: kept for the record, no longer the plan. Where a classic or exam section and §17 appear to disagree, §17 is current. Phase 5 is **done**: the live model is the three roles (see `docs/knowledge/archive/REALIGNMENT.md`).

---

## 1. Overview

> **Primary model is §17.** This overview lists the **classic** entities (the documented cut). The live flow scores the three-role model whose entities (`Flow`, `FlowStep`, `CategoryId`, `RoleDetail`, `CategoryResult`) live in §17.

The model has six core entities:

- **InterestItem** — one of the 24 things the user sorts. Carries archetype weights, a round assignment, and a robot-part contribution.
- **Archetype** — Builder, Innovator, Architect. The internal scoring lens. Each maps 1:1 to a Role.
- **Role** — Robotics Technician, Robotics Specialist, Robotics Integrator. ARM's real role taxonomy. Carries competencies, jobs, and pathway framing.
- **Competency** — a specific ARM-framework competency belonging to a role.
- **EssentialSkill** — a shared soft skill from ARM's framework. Used in results copy and program matching.
- **TrainingProgram** — a mock program that builds toward a role and its competencies. The "programs that get you there" content on results.

Plus two runtime structures:

- **SessionState** — the user's in-flight sorting decisions, scores, and robot.
- **ScoreResult** — what the scoring engine produces.

## 2. TypeScript types

All types live in `/src/data/types.ts`.

```ts
// ---------- Archetypes & Roles ----------

export type ArchetypeId = 'builder' | 'innovator' | 'architect';

export type RoleId = 'technician' | 'specialist' | 'integrator';

/** Each archetype maps to exactly one role. */
export const ARCHETYPE_TO_ROLE: Record<ArchetypeId, RoleId> = {
  builder: 'technician',
  innovator: 'specialist',
  architect: 'integrator',
};

export interface Role {
  id: RoleId;
  archetypeId: ArchetypeId;
  name: string;            // "Robotics Technician"
  archetypeName: string;   // "Builder"
  shortDescription: string; // teen-friendly plain language
  pathFraming: string;      // typical educational pathway, plain language
  competencyIds: string[];
  jobs: Job[];
}

export interface Job {
  title: string;
  description: string;     // one-liner, plain language
}

// ---------- Competencies & Skills ----------

export interface Competency {
  id: string;
  roleId: RoleId;
  name: string;            // "PLC (Programmable Logic Controller)"
  plainName: string;       // teen-friendly translation; see section 5
}

export interface EssentialSkill {
  id: string;
  name: string;            // "Critical Thinking"
}

// ---------- Interest items ----------

/** Weights are integers 0-3. 0 = no signal, 1 = light lean, 2 = clear lean,
 *  3 = defining. An item can contribute to multiple archetypes. */
export interface ArchetypeWeights {
  builder: number;
  innovator: number;
  architect: number;
}

export type RoundId = 1 | 2 | 3 | 4;

export interface InterestItem {
  id: string;              // stable identifier, e.g. 'building-or-fixing'
  round: RoundId;
  label: string;           // what the user reads on the card
  weights: ArchetypeWeights;
  robotContribution: RobotContribution;
}

// ---------- Robot ----------

/** A robot has a fixed set of slots. Each kept interest contributes to one
 *  or more of them. The build logic resolves conflicts (last-wins by default;
 *  see section 9). */
export type RobotSlot =
  | 'base'
  | 'body'
  | 'leftArm'
  | 'rightArm'
  | 'head'
  | 'accessory'        // up to N accessories can stack
  | 'decal'            // up to N decals can stack
  | 'colorScheme';

export interface RobotContribution {
  /** Description for designers/authors. Not shown to user. */
  intent: string;
  /** One or more part contributions applied if this interest is kept. */
  parts: RobotPartRef[];
}

export interface RobotPartRef {
  slot: RobotSlot;
  partId: string;          // refs an entry in /src/data/robotParts.ts
}

export interface RobotPart {
  id: string;
  slot: RobotSlot;
  name: string;            // designer-facing label
  svgComponent: string;    // name of the React/SVG component to render
}

// ---------- Programs ----------

export interface TrainingProgram {
  id: string;
  name: string;
  type: 'apprenticeship' | 'certificate' | 'degree' | 'bootcamp' | 'workshop';
  duration: string;        // "12 weeks", "2 years", etc.
  rolesServed: RoleId[];
  competencyIds: string[]; // which competencies this program builds
  blurb: string;           // 1-2 sentence description
  url?: string;            // optional, mocked
}

// ---------- Runtime ----------

export type Decision = 'keep' | 'pass';

export interface SessionState {
  currentScreen: 'landing' | 'sort' | 'build' | 'results';
  currentRound: 0 | 1 | 2 | 3 | 4;     // 0 = not started, 4 = sorting done
  decisions: Record<string, Decision>; // keyed by InterestItem.id
  scoreResult: ScoreResult | null;
  robot: RobotState | null;
  currentlyTryingOn: RoleId | null;    // results screen state
  soundEnabled: boolean;
}

export interface RobotState {
  slots: Partial<Record<RobotSlot, string | string[]>>; // partId or array for stacking slots
  isFinalized: boolean;     // true only after completion
}

export interface ScoreResult {
  raw: ArchetypeWeights;            // sum of weights for kept items, per archetype
  matchPercentages: ArchetypeWeights; // 0-100 per archetype, see scoring formula
  primaryArchetype: ArchetypeId;
  primaryRole: RoleId;
  ranking: ArchetypeId[];            // ordered, primary first
}
```

## 3. The 24 interest items

Seeded weights below are **designer defaults** (per PRD section 7). They produce a believable spread. Their per-archetype maxes are Builder 22, Innovator 27, Architect 25. These maxes do not need to match: the scoring engine normalizes each archetype against its own maximum (`raw[A] / max[A] * 100`), so no archetype is structurally favored regardless of its raw ceiling. ARM's dev team owns tuning for production.

| # | Round | Label | B | I | A | Robot intent |
|---|-------|-------|---|---|---|--------------|
| 1 | 1 | Building or fixing things | 3 | 0 | 0 | Add a wrench tool to an arm |
| 2 | 1 | Taking things apart to see how they work | 2 | 2 | 0 | Add an opened-panel decal showing wires |
| 3 | 1 | Coding or modding games | 0 | 3 | 0 | Spray binary 1s and 0s across the chest |
| 4 | 1 | Solving puzzles or brain teasers | 0 | 3 | 0 | Add a puzzle-piece accessory |
| 5 | 1 | Planning hangouts or events for friends | 0 | 0 | 3 | Clip on a clipboard |
| 6 | 1 | Turning ideas into real plans | 0 | 0 | 3 | Add a blueprint roll under one arm |
| 7 | 2 | Shop class or robotics club | 3 | 0 | 0 | Add a small robotic arm attachment |
| 8 | 2 | Hands-on science experiments | 2 | 2 | 0 | Add a beaker accessory |
| 9 | 2 | Coding or computer class | 0 | 3 | 0 | Add a chip-pin to the chest |
| 10 | 2 | Solving math or science problems | 0 | 3 | 0 | Add a graph decal on shoulder |
| 11 | 2 | Keeping your group on track | 0 | 0 | 3 | Add a headset accessory |
| 12 | 2 | Planning ahead before starting something | 0 | 0 | 3 | Add a calendar/timeline decal |
| 13 | 3 | Taking things apart to find what's wrong | 3 | 0 | 0 | Add a magnifier on a head sensor |
| 14 | 3 | Trying things until something works | 3 | 0 | 0 | Add a slightly soldered/repaired arm look |
| 15 | 3 | Looking up how others fixed it | 0 | 2 | 0 | Add a small reference-book accessory |
| 16 | 3 | Testing different solutions | 0 | 3 | 0 | Add a checklist-with-checkmarks decal |
| 17 | 3 | Writing or drawing out a plan first | 0 | 0 | 3 | Add a pencil-tucked-behind-sensor look |
| 18 | 3 | Figuring out how all the steps connect | 0 | 0 | 3 | Add a flowchart decal on the back |
| 19 | 4 | Fixing things when they break | 3 | 0 | 0 | Add a wrench-and-screwdriver tool belt |
| 20 | 4 | Noticing when something needs fixing | 3 | 0 | 0 | Add a warning-light indicator on head |
| 21 | 4 | Wanting to know how and why things work | 0 | 3 | 0 | Add a question-mark thought-bubble pin |
| 22 | 4 | Finding smarter or faster ways to do things | 0 | 2 | 2 | Add a lightning-bolt accent |
| 23 | 4 | Seeing how everything fits together | 0 | 0 | 3 | Add a network/web pattern decal |
| 24 | 4 | Spotting problems before they happen | 0 | 1 | 2 | Add a small antenna/scanner on head |

Notes for the author of `/src/data/items.ts`:

- Build the array in this order. Round assignments and weights match the table verbatim.
- The "Robot intent" column is a starter description; the actual `parts` array per item refers to `partId`s from the part library (section 7). Pencil in placeholder IDs that match these intents; the SVG components themselves get authored alongside Phase 2 of the build.
- Many cells are zero. The schema requires all three weight fields. Do not omit them.

**Sanity totals (max possible if user keeps every item):** Builder 22, Innovator 27, Architect 25.

## 4. Roles

The three Role objects live in `/src/data/roles.ts`. Below is the canonical content for each. Plain-language descriptions are starter copy; the final copy work is an open question in the PRD.

### `technician` — Robotics Technician (Builder)

- **shortDescription:** "Technicians install, maintain, and repair the robots and equipment that keep factories running. Hands-on, learn-by-doing, real machines."
- **pathFraming:** "Often starts with an apprenticeship or a technical certificate. Many technicians grow into senior tech and shift-supervisor roles, learning on the job."
- **competencyIds:** see section 5.
- **jobs:**
  - Robotics Technician — Installs and repairs the robots on a factory floor.
  - Manufacturing Maintenance Technician — Keeps all the machines and equipment running smoothly.
  - Automation Equipment Operator — Runs and monitors automated machinery day to day.
  - Robot Repair Specialist — Diagnoses and fixes robots when something goes wrong.
  - Assembly Line Technician — Maintains the tools and equipment used in production lines.

### `specialist` — Robotics Specialist (Innovator)

- **shortDescription:** "Specialists program robots and design the automated systems that make manufacturing faster and smarter. If you love figuring out how things work, this is the path."
- **pathFraming:** "Often a degree in engineering, computer science, or robotics. Specialists often become senior engineers, team leads, or R&D experts."
- **competencyIds:** see section 5.
- **jobs:**
  - Robotics Specialist — Programs robots and proposes upgrades to improve how they work.
  - Robot Programmer — Writes the code that tells robots what to do.
  - Automation Engineer — Designs automated systems that make manufacturing faster.
  - Controls Engineer — Builds the systems that control how machines behave.
  - Manufacturing Systems Developer — Creates software and systems that keep factories running efficiently.

### `integrator` — Robotics Integrator (Architect)

- **shortDescription:** "Integrators look at a whole factory, plan how robotic systems should fit in, and make sure all the pieces work together. Big-picture, coordination, strategy."
- **pathFraming:** "Often engineering or project management. Many grow up from specialist roles into project managers, system architects, or robotics consulting."
- **competencyIds:** see section 5.
- **jobs:**
  - Robotics Integrator — Evaluates factories and designs plans to introduce robotic systems.
  - Automation Project Manager — Leads teams to plan and deliver automation projects.
  - Systems Integration Engineer — Makes sure all the different parts of a robotic system work together.
  - Manufacturing Operations Manager — Oversees how an entire factory or production line runs.
  - Robotics Consultant — Advises companies on how to use robotics to improve their operations.

## 5. Competencies (real ARM framework)

> **Documented cut — deleted Phase 4 (D-027), recoverable at git tag `archive/pre-narrative-only`.** `competencies.ts` was deleted with the classic pipeline. The real ARM competency framework below is kept for the record; a category-keyed competency surface can return alongside the step-8 programs work.

The cut `competencies.ts` held all entries. The `name` field is the official ARM term. The `plainName` field is a teen-friendly translation used in results copy. Plain names below are starter drafts; final copy is an open question.

### Technician competencies (`roleId: 'technician'`)

| id | name | plainName |
|----|------|-----------|
| tech-electrical | Electrical Systems | Working with the wiring and electrical guts of a machine |
| tech-electronics | Electronics & Controls | Setting up and tuning the controls that make machines behave |
| tech-fluid | Fluid Power | Working with the hydraulics and pneumatics that move heavy parts |
| tech-maintenance | Maintenance & Troubleshooting | Figuring out what's wrong and fixing it |
| tech-mechanical | Mechanical Systems | Working with the moving parts of machines |
| tech-plc | PLC (Programmable Logic Controller) | Programming the brains of industrial machines |
| tech-robot-programming | Robot Programming | Telling robots what to do in their own language |
| tech-system-controls | System Controls | Keeping a whole system running the way it should |

### Specialist competencies (`roleId: 'specialist'`)

| id | name | plainName |
|----|------|-----------|
| spec-advanced-programming | Advanced Robot Programming | Writing more complex code that makes robots do smarter things |
| spec-application | Application Emphasis | Picking the right robot for the right job |
| spec-inspection | Inspection/QA | Making sure everything robots make meets quality standards |
| spec-installation | Installation Concepts | Setting up new robots so they work the first time |
| spec-project-management | Project Management | Keeping a robotics project on time and on track |
| spec-troubleshooting | Robot and System Troubleshooting | Debugging the whole system when something breaks |
| spec-safety | Safety/Risk Assessment | Making sure no one and nothing gets hurt around robots |
| spec-sensors | Sensors | Working with the eyes, ears, and feel of a robot |
| spec-vision | Vision | Teaching robots to "see" with cameras |

### Integrator competencies (`roleId: 'integrator'`)

| id | name | plainName |
|----|------|-----------|
| int-arvr | Augmented Reality/Virtual Reality | Designing and testing factories in virtual space |
| int-big-data | Big Data | Pulling insight from huge piles of factory data |
| int-programming | Computer Programming | Writing code at the system level |
| int-interop | Interoperability | Making sure machines from different makers talk to each other |
| int-offline-programming | Offline Programming | Designing what a robot will do before it ever runs |
| int-simulation | Simulation | Modeling factories on a computer before building anything |
| int-process-design | System and Process Design | Designing how the whole factory should work |
| int-modeling | Systems Simulation/Modeling | Building digital twins of real systems |
| int-visualization | Visualization | Showing complex data and systems in ways people can understand |

## 6. Essential skills

> **Documented cut — deleted Phase 4 (D-027), recoverable at git tag `archive/pre-narrative-only`.** `skills.ts` was deleted with the classic pipeline. The shared soft-skill list below is kept for the record.

The shared soft-skill list from ARM's framework lived in `/src/data/skills.ts`. Used in results to call out cross-cutting strengths the user's sorting revealed.

```
active-listening, adaptability, attention-to-detail, communication,
conflict-resolution, critical-thinking, interpersonal-skills, leadership,
problem-solving, teaming, technical-learning-ability, technology-aptitude,
time-management, work-ethic
```

Each is `{ id, name }` only. No plain-name translation needed; the names are already plain.

## 7. Robot parts library

> **Documented cut — deleted Phase 4 (D-027), recoverable at git tag `archive/pre-narrative-only`.** The robot was never built as a scene and the live flow skips the robot build (§17). `robotParts.ts` was deleted with the classic pipeline. Parked, not the plan.

Lives in `/src/data/robotParts.ts`. Each `RobotPart` references an SVG React component that lives in `/src/scene/robot/parts/`. The library is the **interface between data and visuals**: items reference part IDs, the build logic resolves them to SVG components.

For Phase 0 and 1, parts are placeholder shapes. Phase 2 is when the actual stylized SVG art gets made.

### Slot rules

| Slot | Cardinality | Conflict resolution |
|------|-------------|---------------------|
| `base` | 1 | last kept wins |
| `body` | 1 | last kept wins |
| `leftArm` | 1 | last kept wins |
| `rightArm` | 1 | last kept wins |
| `head` | 1 | last kept wins |
| `accessory` | many (cap at 4 visual stacks) | accumulate; order by item id |
| `decal` | many (cap at 3 visual stacks) | accumulate; order by item id |
| `colorScheme` | 1 | derived from dominant archetype after scoring |

### Seed part IDs

Author placeholder entries to match the "Robot intent" column in section 3. Examples:

```
{ id: 'wrench-arm', slot: 'rightArm', name: 'Wrench-tool arm', svgComponent: 'WrenchArm' }
{ id: 'binary-decal', slot: 'decal', name: 'Binary spray', svgComponent: 'BinaryDecal' }
{ id: 'chip-pin', slot: 'accessory', name: 'Chip pin', svgComponent: 'ChipPin' }
{ id: 'clipboard', slot: 'accessory', name: 'Clipboard', svgComponent: 'Clipboard' }
{ id: 'mini-robot-arm', slot: 'accessory', name: 'Mini robot arm', svgComponent: 'MiniRobotArm' }
{ id: 'hardhat', slot: 'head', name: 'Hard hat', svgComponent: 'HardHat' }
{ id: 'magnifier-head', slot: 'head', name: 'Magnifier sensor head', svgComponent: 'MagnifierHead' }
{ id: 'blueprint-roll', slot: 'accessory', name: 'Blueprint roll', svgComponent: 'BlueprintRoll' }
{ id: 'flowchart-decal', slot: 'decal', name: 'Flowchart decal', svgComponent: 'FlowchartDecal' }
...
```

The full set of ~24 parts is authored as items are seeded. Many parts can be reused across items (e.g. the wrench arm could be the contribution for items 1 and 19; that's fine and probably desirable for visual coherence).

### Color schemes

Each archetype has a color scheme defined in `/src/data/colorSchemes.ts`. Final palette is set in `DESIGN_SYSTEM.md`. The build logic picks a scheme based on the user's dominant archetype after scoring completes.

## 8. Mock training programs

> **Documented cut — deleted Phase 4 (D-027), recoverable at git tag `archive/pre-narrative-only`.** `programs.ts` (along with `competencies.ts` and `skills.ts`) was deleted with the classic pipeline. **The live narrative results surface zero programs today** — a known gap. A category-keyed program set returns at the step-8 narrative results work (the "somewhere to go" payload the research asks for; `REALIGNMENT.md` step 8). The schema below is kept for the record and as the shape that step-8 set will follow.

The cut `programs.ts` lived in `/src/data/programs.ts`. It seeded about 6-10 representative programs covering the three role families. Accuracy is not required; structure is. _(It was keyed by the classic `RoleId`s — technician/specialist/integrator. The four-category results reached it through the category-to-role mapping, Operate→Operator, Repair→Technician, Program→Specialist, Plan→Integrator.)_

Seed examples:

```ts
{
  id: 'smart-tech',
  name: 'SMART Robotics Technician Program',
  type: 'certificate',
  duration: '16 weeks',
  rolesServed: ['technician'],
  competencyIds: ['tech-mechanical', 'tech-electrical', 'tech-maintenance', 'tech-plc'],
  blurb: 'A hands-on certificate covering the core skills technicians use day to day.'
}
{
  id: 'nc3-cert',
  name: 'NC3 Robotics Certification',
  type: 'certificate',
  duration: '12 weeks',
  rolesServed: ['technician', 'specialist'],
  competencyIds: ['tech-robot-programming', 'spec-installation', 'spec-safety'],
  blurb: 'Industry-recognized certification that opens doors at hundreds of manufacturers.'
}
{
  id: 'mechatronics-as',
  name: 'Mechatronics Associate Degree',
  type: 'degree',
  duration: '2 years',
  rolesServed: ['technician', 'specialist'],
  competencyIds: ['tech-electronics', 'tech-system-controls', 'spec-sensors', 'spec-vision'],
  blurb: 'Two-year degree blending mechanical, electrical, and programming foundations.'
}
{
  id: 'robotics-engineering-bs',
  name: 'Robotics Engineering BS',
  type: 'degree',
  duration: '4 years',
  rolesServed: ['specialist', 'integrator'],
  competencyIds: ['spec-advanced-programming', 'int-simulation', 'int-modeling'],
  blurb: 'A full engineering degree for the programming and design side of robotics.'
}
{
  id: 'industrial-apprenticeship',
  name: 'Manufacturing Apprenticeship',
  type: 'apprenticeship',
  duration: '2-4 years',
  rolesServed: ['technician'],
  competencyIds: ['tech-mechanical', 'tech-maintenance', 'tech-electrical'],
  blurb: 'Earn while you learn: paid apprenticeship with on-the-job training.'
}
{
  id: 'systems-integration-bootcamp',
  name: 'Automation Integration Bootcamp',
  type: 'bootcamp',
  duration: '8 weeks',
  rolesServed: ['integrator'],
  competencyIds: ['int-process-design', 'int-interop', 'int-visualization'],
  blurb: 'Intensive bootcamp for the system-design and integration side of automation.'
}
```

## 9. The scoring engine

> **Documented cut — deleted Phase 4 (D-027), recoverable at git tag `archive/pre-narrative-only`.** This is the classic three-archetype engine. The **live** brain is `lib/categoryScoring.ts` (the three-role engine, §17), which mirrors the pure-function shape below. The algorithm here is kept for the record.

Lived in `/src/lib/scoring.ts`. Pure function, no React, no side effects, fully unit-testable.

### Signature

```ts
export function calculateScores(
  decisions: Record<string, Decision>,
  items: InterestItem[]
): ScoreResult;
```

### Algorithm

1. For each archetype `A` in `['builder', 'innovator', 'architect']`:
   - `raw[A] = sum of items[i].weights[A] for every i where decisions[items[i].id] === 'keep'`
   - `max[A] = sum of items[i].weights[A] for every i in items` (the maximum possible)
   - `matchPercentages[A] = round(raw[A] / max[A] * 100)` clamped to integer
2. `primaryArchetype = archetype with the highest matchPercentages` (deterministic tiebreak: builder > innovator > architect)
3. `primaryRole = ARCHETYPE_TO_ROLE[primaryArchetype]`
4. `ranking = ['builder', 'innovator', 'architect'] sorted desc by matchPercentages`

### Properties to test

- All-keep produces 100/100/100 (saturation case)
- All-pass produces 0/0/0
- A user keeping only Builder-3 items produces high Builder, low others
- The function is pure (same input always produces same output, no global state read or written)
- It handles missing decisions for unsorted items by treating them as `'pass'`

### Tuning notes

The pass-equals-zero rule means a picky user can produce all-low scores honestly ("you haven't given us much signal yet for any of these"). The design should handle this gracefully on the results screen rather than the scoring engine artificially inflating numbers. Schema supports negative weights for later experiments; default v1 has no negative weights.

## 10. Robot assembly

> **Documented cut — deleted Phase 4 (D-027), recoverable at git tag `archive/pre-narrative-only`.** Parked with the robot build (§6/§7). The live flow never touches `robot` state. `robotAssembly.ts` was removed with the classic pipeline.

Lived in `/src/lib/robotAssembly.ts`. Pure function.

### Signature

```ts
export function assembleRobot(
  decisions: Record<string, Decision>,
  items: InterestItem[],
  primaryArchetype: ArchetypeId | null
): RobotState;
```

### Algorithm

1. Initialize an empty `RobotState` with `isFinalized: false` and a default base/body/colorScheme.
2. For each item kept (`decisions[id] === 'keep'`), in item order:
   - For each `RobotPartRef` in that item's `robotContribution.parts`:
     - For single-cardinality slots: assign `partId` (overwrite previous).
     - For multi-cardinality slots (`accessory`, `decal`): append `partId` to the array, respecting the cap.
3. Set `colorScheme` from `primaryArchetype` (or default if null).
4. Return the state. `isFinalized` is set to `true` by the caller only at the Build beat.

### Live-build semantics

During sorting (Phase 2+), `assembleRobot` is called after every decision so the user sees the robot accrete in real time. On completion, the screen transitions to the Build beat which finalizes the state (`isFinalized: true`) and the snap-into-place animation plays.

If the user bails (closes, navigates away, refreshes) before completion, no robot is persisted. No half-robot leaves the experience.

## 11. Program selection

> **Documented cut — deleted Phase 4 (D-027), recoverable at git tag `archive/pre-narrative-only`.** Deleted with `programs.ts` (§8). The live narrative results surface zero programs today; the category-keyed program selection returns at step 8. The shape below is kept for the record.

Lived in `/src/lib/programSelection.ts`. Given a role the user is "trying on," pick the most relevant programs.

### Signature

```ts
export function selectProgramsForRole(
  roleId: RoleId,
  programs: TrainingProgram[],
  options?: { max?: number }
): TrainingProgram[];
```

### Algorithm (v1, simple)

1. Filter `programs` to those whose `rolesServed` includes `roleId`.
2. Sort by number of competency matches with the role's `competencyIds` (descending), then by type preference (apprenticeship/certificate > bootcamp > degree for the HS audience).
3. Return top `max` (default 3).

The team can replace this scoring later. Keep it dumb in v1.

## 12. Session state

Lives in a Zustand store at `/src/state/sessionStore.ts`. Exposes:

```ts
interface SessionStore {
  state: SessionState;
  startSession: () => void;
  recordDecision: (itemId: string, decision: Decision) => void;
  advanceRound: () => void;
  completeSorting: () => void;     // triggers scoring, finalizes robot
  tryOnRole: (roleId: RoleId) => void;
  toggleSound: () => void;
  reset: () => void;
}
```

Conventions:

- `recordDecision` calls `assembleRobot` and updates the live (non-finalized) robot state.
- `completeSorting` runs `calculateScores`, sets `scoreResult`, sets `primaryRole`, sets `currentlyTryingOn` to the primary role by default, and marks `robot.isFinalized = true`.
- No persistence in v1. State lives in memory; refreshing the page starts fresh. The reset behavior is intentional for the prototype.

## 13. File layout

```
/src/data
  types.ts              All TypeScript interfaces (the §17 flow/category types; the classic
                        types remain in the deleted-flow record below)
  flows/                LIVE (§17) — the narrative flow
    narrativeFlow.ts    Narrative flow: intro MC (Q0-Q5) + 7 scenes; resultsCopy incl. `cards`
    screeners.ts        Screener appetite levels + fit copy + SCREENER_STEP_IDS (D-020)
    buckets.ts          The shared SORT_BUCKETS (That's me / Kinda me / Not me)
    index.ts            Registry: flows map, flowList, defaultFlowId (narrative only)
  roleDetails.ts        LIVE (§17) — the three RC.org roles (duties, competencies, salary, …)
  bridgePrograms.ts     LIVE (§17, D-029 Phase C) — per-role bridge programs (placeholder)
  jobs.ts               LIVE (§17, D-029 Phase F) — per-role featured jobs, 4/4/4 (placeholder copy)
  exploreContent.ts     LIVE (§17, Phase G) — the "How you fit" tab narratives (placeholder pending ARM)
  careerMapArt.ts       LIVE (§17, career-map merge) — fixed Figma map geometry (1289:394): per-rank
                        hub/orb/edge art; results fill the rank slots with role name/color/%
  sceneBackgrounds.ts   LIVE (career-map merge) — scene step id → background image path; presentation
                        assets stay out of the flow data so both tune separately
  thoughtBubbleIcons.ts LIVE (career-map merge) — per-scene, per-choice thought-bubble illustrations
                        (fallback to placeholder symbols)
  loadingCopy.ts        LIVE (career-map merge) — the /loading interstitial's rotating status lines
  roleSelect.ts         LIVE — /select role-pick copy
  index.ts              Barrel export

/src/lib
  categoryScoring.ts    LIVE (§17) — calculateCategoryScores + computeCategoryMax
  screenerFit.ts        LIVE (§17) — deriveScreenerProfile + screenerFitLines (D-020)
  categoryBreakdown.ts  LIVE (§17) — score provenance (pure + tested); wired in Phase C into
                        WhyYouMatched (openers/moments split + passedLabels, D-029)
  compareRecommendation.ts LIVE (§17, D-029 Phase D) — the compare "Our take" rule (pure + tested):
                        leaned role by match %, lower-barrier role by educationLevel, close flag,
                        copy-variant selector (clearWinner / closeLowerBarrier / closeEqualBarrier)
  careerMapLayout.ts    LIVE (§17, career-map merge) — the career-map brain (pure + tested): area-true
                        %-sized hub radii (r = k·√pct, ties equal by construction), edge re-trim onto
                        the live radius, bounds, the pane-aware camera (careerMapPaneRect +
                        careerMapCameraForBoundsInPane), zoom-driven label opacity
  jobTrajectory.ts      LIVE (§17, career-map merge) — resolves a job's prior/current/next ladder
                        rungs (cross-tier aware) for TrajectoryViz
  jobDisplay.ts         LIVE (§17, career-map merge) — salary/education display parsing + fallbacks
  chipFit.ts            LIVE (§17) — one-line chip fitting for the "why you matched" chip row
  nodeLayout.ts         LIVE (§17) — fit-radar geometry (node map deleted Phase E; live in the
                        /select radar)
  index.ts              Barrel export

/src/state
  sessionStore.ts       Zustand store

(no /src/scene — the dir + its last file LandingSceneHint.tsx were deleted at
 step 8 Phase A, D-029, when the Landing went type-led dark)
```

> **Deleted in Phase 4 (D-027), recoverable at git tag `archive/pre-narrative-only`.** The Exam flow (`flows/examFlow.ts`), the classic flow (`flows/classicFlow.ts`), the A/B question sets (`flows/questionSets/`), the classic data (`items.ts`, `roles.ts`, `robotParts.ts`, `competencies.ts`, `skills.ts`, `programs.ts`, `colorSchemes.ts`), the classic libs (`scoring.ts`, `robotAssembly.ts`, `fit.ts`, `programSelection.ts`, `audio.ts`), and `src/scene/RobotPlaceholder.tsx` were all removed from the live tree. The schema sections that describe them (§1–§14, §16) are kept here for the record, no longer the plan.

Tests for the live lib functions live in `/src/lib/__tests__/` (102 tests across `categoryScoring`, `screenerFit`, `categoryBreakdown`, `compareRecommendation`, `careerMapLayout`, `jobTrajectory`, `jobOverviewStats`, `chipFit`, `nodeLayout`, and `data-integrity` — the last covers the §17 explore copy block + the per-role job invariants 4/4/4). They run as part of the standard `pnpm test` and are independent of Playwright.

## 14. Tuning surface

What's expected to change without code edits:

- **Any text:** item labels, role descriptions, plain-name competency translations, job descriptions, program blurbs.
- **All archetype weights** in `items.ts`. This is the primary scoring tuning surface.
- **A whole flow's content** (§17): the narrative flow's scene choices, intro-question tags, weights, and owned copy are authored in `src/data/flows/` via the data-author skill, no component edits. _(Documented cut: §16's whole question-set authoring path went with the classic flow delete, D-027.)_
- _(Documented cut)_ Robot part assignments per item, and mock training programs — deleted with the classic data (§7, §8).

What requires a code edit:

- Adding a fourth archetype to the **classic** three-archetype pipeline (don't do this). _(The live narrative flow in §17 is a parallel model scoring ARM's three published roles — technician/specialist/integrator; it never touches the classic pipeline, so it's not a violation of this rule. The study originally ran a fourth category, Operator, which Phase 5 folded into the entry Technician, D-028.)_
- Changing scoring algorithm shape.
- Changing session state shape.

If a content change feels like it needs a code edit, stop and ask. It probably doesn't, and the convention is what keeps the team's iteration cheap.

## 15. Sanity checks before considering this doc "applied"

> **Documented cut — these checks validated classic data deleted in Phase 4 (D-027).** They no longer run (the classic `data-integrity` blocks were removed with the data). The live invariants are the §17 narrative-flow checks. The list below is kept for the record of what the classic pipeline guaranteed.

When `/src/data` was scaffolded from the classic sections, the build verified:

- All 24 items exist with all three weights set (no missing zeros). _(Per question set — see section 16.)_
- Sum-per-archetype across all items matches the set's **declared `expectedSums`** (Set A: Builder 22, Innovator 27, Architect 25). Sums are recomputed from live items and compared against the declaration, per set.
- Every role's `competencyIds` array is non-empty and references real entries in `competencies.ts`.
- Every program references real role IDs and real competency IDs.
- Every item's `robotContribution.parts` references real entries in `robotParts.ts` (placeholders fine; the references must resolve).
- A unit test confirms `calculateScores` on an all-keep input returns 100/100/100.
- A unit test confirms `calculateScores` on an all-pass input returns 0/0/0.
- A unit test confirms `calculateScores` returns the expected primary archetype for a representative builder-heavy input.

## 16. Question sets (A/B language test)

> **Documented cut — deleted Phase 4 (D-027), recoverable at git tag `archive/pre-narrative-only`.** The A/B language test was superseded by the question-structure study (§17, D-017) before set B was authored. The `QuestionSet` shape lived on only because the classic flow wrapped set A by reference; the classic flow was deleted in Phase 4, and this whole apparatus (set A, set B, the `b-` cross-set machinery, the worksheet path) went with it. Kept here for the record.

Added 2026-06-04 for the first user test (see `DECISIONS.md` D-016; flagged in `PRD.md` §8/§14). The test compares two language treatments — formal/exam-like vs playful/narrativized — so the content the user reads ships as two swappable **question sets**.

### The QuestionSet shape

```ts
interface QuestionSet {
  id: QuestionSetId;            // 'a' | 'b'
  name: string;                 // researcher-facing label on the landing switcher
  items: InterestItem[];        // its own 24 — own ids, labels, weights, robot mappings
  rounds: RoundMeta[];          // its own round-transition copy
  sortCopy: SortCopy;           // bin labels + drag hint
  landingCopy: LandingCopy;     // overline, heading, description, CTA
  resultsCopy: ResultsCopy;     // heading, compare hint, retake, low-signal, sections, fit bands
  expectedSums: ArchetypeWeights; // declared per-archetype sums; tests assert declared == computed
}
```

### What a set owns vs what stays shared

- **Set-owned:** the 24 interest items (ids, labels, weights, robot-part mappings), round copy, sort-screen copy, landing copy, results copy. The whole experience reads in one voice per set.
- **Shared (never per-set):** roles, competencies, essential skills, training programs, the robot-part catalog, color schemes, and the scoring algorithm. The three-role taxonomy is a hard rule.

### Invariants (enforced per set by `data-integrity.test.ts`)

- 24 items, 6 per round, all three weights present (0–3), every robot-part reference resolves.
- Recomputed per-archetype sums equal the set's **declared** `expectedSums`. Sets need not match each other — scoring normalizes each archetype against its own max, per set.
- Item ids unique within a set **and across sets** (decisions are keyed by item id; set B uses a `b-` prefix).
- All owned copy non-empty; 4 round entries covering rounds 1–4.

### Runtime model

- The registry lives in `questionSets/index.ts`; `defaultSetId` is `'a'`.
- The session store holds `questionSetId` **next to** session state, not inside it — `reset()` ("Start over") replaces only the session, so the researcher's chosen condition survives between participants. The landing switcher calls `selectQuestionSet`.
- Store actions resolve the active set's items at action time; screens read copy via the `useQuestionSet()` hook. Only one set is ever active in a session.

### Status (superseded for the live study)

The formal-vs-playful A/B was **superseded by the question-structure study** (§17, `DECISIONS.md` D-017) before set B's content was authored. Set B and the `b-` cross-set machinery were removed at that point, leaving `QuestionSetId` as just `'a'`. The QuestionSet shape and set A then survived only because the **classic** flow wrapped set A by reference (§17). Phase 4 deleted the classic flow (D-027), so the question-set apparatus is gone from the live tree. `QUESTION_SET_WORKSHEET.md` was **removed 2026-07-01** — its only revival path (slotting into the classic flow's QuestionSet) died with the classic flow in Phase 4; the A/B-language history lives in `DECISIONS.md` D-016/D-017 and the 2026-06-04 / 06-07 session notes.

## 17. Flows (question-structure study) — the primary model

> **This is the live schema.** The shipping product is the **Narrative** flow defined here; the three-role model (`technician / specialist / integrator`) and its entities (`Flow`, `FlowStep`, `CategoryId`, `RoleDetail`, `CategoryResult`) are the current data model. Phase 5 (D-028) collapsed the earlier four-category model (`operate / repair / program / plan`) to ARM's three published roles — the entry **Technician** folds the old Operate + Repair, **Specialist** is the old Program, **Integrator** is the old Plan. §1–§14 are the documented-cut classic pipeline. `data-integrity.test.ts` enforces the live invariants in this section (the gate docs, `verifier` and `data-author`, headline these).
>
> **Documented cut — the Exam flow (Phase 4, D-027).** The study originally shipped two category flows: Narrative and **Exam** (background questions + a 30-statement sort, scored on the same four categories, presented as a dashboard). The narrative won the June 2026 study, so Phase 4 stripped the build to the narrative flow and **removed the Exam flow from the live tree** (recoverable at git tag `archive/pre-narrative-only`). The exam shapes, scoring, results, and invariants below are kept for the record — they describe a cut flow, not a live one (and they still name the old four categories, since the three-role collapse came later in Phase 5). Where this section still names the Exam flow, read it as the parked comparison condition.

Added 2026-06-07 for the first user test (see `DECISIONS.md` D-017; flagged in `PRD.md`). The study compared which **question structure** is most engaging and produces the most trusted results. It ran two category flows plus the dormant classic; a researcher-facing segmented control on Landing switched between them per participant. After the study, Phase 4 cut the build down to the Narrative flow alone (D-027), and Phase 5 (D-028) then collapsed its four categories to ARM's three published roles.

The original A/B (§16) assumed both conditions shared one flow shape (24-item sort → build → 3-archetype results). The study broke that: the new flows had different step structures, scored RC.org **categories** instead of internal archetypes, and shared a new results experience. So `QuestionSet` grew a sibling: the **flow**. (The study ran on four categories; Phase 5 re-cut the live narrative flow to three roles. The four-category descriptions below that still read as live are flagged where they appear.)

### The flows (Narrative live; Classic and Exam are the documented cut)

| Flow | `kind` | Shape | Results | Status |
|---|---|---|---|---|
| **Narrative** | `narrative` | 6 intro MC questions (Q0–Q5; Q1 branches), then 7 day-in-the-life **scenes**; each scene's 3 choices (one per role) are sorted into the 3 buckets, one card at a time (D-018). | role node map | **Live** |
| **Classic** | `classic` | The Phase 1 experience, wrapping set A by reference. | 3 role cards (archetype pipeline) | Documented cut — deleted Phase 4 (D-027) |
| **Exam** | `exam` | 2 background MC + 1 mapped MC, then a **30-statement sort** into 3 buckets. | category dashboard | Documented cut — deleted Phase 4 (D-027) |

The live registry holds only the narrative flow (`FlowId = 'narrative'`, `defaultFlowId = 'narrative'`); the classic and exam rows above are the record of what the study ran.

### The three roles

After Phase 5 (D-028) the live narrative flow scores `CategoryId = 'technician' | 'specialist' | 'integrator'` — ARM's three published robotics career paths: **Technician** (entry, folding the old Operate + Repair), **Specialist** (mid, the old Program), **Integrator** (planning, the old Plan). The results screen renders entirely from `roleDetails` data (keyed by `CategoryId`). The "Operator" of the old four-category model is no longer a result — it folds into the entry Technician as a common job title, built from the old Operate/Operator card. This retires the D-017 carve-out (which quarantined four study categories from the three classic archetypes): the live model simply **is** three roles now. The classic pipeline (`ArchetypeId`/`RoleId`/`ARCHETYPE_TO_ROLE`, `roles.ts`) remains the documented cut and is untouched; the live `CategoryId` literals coincidentally match its `RoleId` strings, but they are a separate, parallel type that the results render from `roleDetails`.

_(Documented cut: the study ran on four categories `operate / repair / program / plan`, each mapped to a role: Operate→Operator, Repair→Technician, Program→Specialist, Plan→Integrator. That mapping is preserved in the exam material below.)_

### Shapes

```ts
type Flow = CategoryFlow;            // ClassicFlow was deleted in Phase 4 (D-027)
interface CategoryFlow {
  kind: 'narrative'; id; name; landingCopy;   // the 'exam' arm went with the Phase-4 delete
  steps: FlowStep[];                 // discriminated by `type`
  expectedCategoryMax: CategoryWeights; // declared full-path ceiling; tests assert == computed
  resultsCopy: FlowResultsCopy;      // role-sheet chrome + `cards` (ResultsCardsCopy, D-029 Phase C)
}
type FlowStep = MCStep | SceneStep;  // StatementSortStep was removed with the exam flow
// MCStep: optional prompt, question, choices[] — each choice maps to 0+ roles
//   (0 = unscored background) and may carry branchTo (a step id; Q1 "No" skips Q2).
// SceneStep: prompt + question + exactly 3 choices, one per role. Each choice is
//   sorted into a bucket (like a statement), recorded in statementBuckets by choice id.
// Buckets (shared SORT_BUCKETS): thats-me "That's me" / maybe "Kinda me" /
//   not-me "Not me". The middle label is "Kinda me" (D-018); its id stays `maybe`.
interface CategoryResult { raw; matchPercentages; ranking; primaryCategory; } // CategoryWeights
// RoleDetail (roleDetails.ts, keyed by CategoryId) — the role-card content. Phase C added
//   duties: {heading,text}[] ("What you'll do"), competencies: string[] (ARM's per-role
//   "Levels of Competencies"), whyMomentsText (the breakdown's moments line), and an optional
//   pathUp (entry-Technician upward-path callout). Phase D added salaryMedian (e.g. "National
//   median $105,000/yr") — the median-only figure the results cards + compare show for an even
//   stat-box height across roles (Technician has no range); the fuller `salary` range stays for
//   the /select sheet. bridgePrograms.ts (BridgeProgram, keyed by CategoryId) holds the per-role
//   "how to bridge the gap" training programs (placeholder pending ARM sourcing —
//   docs/reference/Job_Program_Data_Request.md).
// FlowResultsCopy.cards: ResultsCardsCopy — all dark role-cards + compare copy (match labels, the
//   collapsed/expanded "why you matched" templates, openers/moments labels, tab + section
//   headings, the compare backToRole/compareWithLabel + the "Our take" recommendation variants).
//   Templates use {role}/{pct}/{pointed}/{total}/{passed}/{high}/{low}/{lowBarrier}/... placeholders.
// _(Documented cut: the deleted ClassicFlow was `{ kind: 'classic'; questionSet }`; the deleted
//  exam flow used `kind: 'exam'` and a StatementSortStep of 30 statements + 3 buckets.)_
```

### Scoring (`lib/categoryScoring.ts` — pure, mirrors §9)

`calculateCategoryScores(flow, answers, statementBuckets)` walks the **path the answers actually took** (branch-aware: a skipped Q2 contributes to neither raw nor max), tallying per role: each scored MC choice and each scene choice adds 1 to its role's `max`. For `raw`, a scored MC choice adds 1 to each role it maps to (a two-role choice feeds both, e.g. "$85,000" → specialist + integrator); **scene choices are bucketed** — `thats-me` → 1, `maybe` (the "Kinda me" middle bucket) → `MAYBE_WEIGHT` (a tunable constant, **0** today — the prior study asked for a middle option but the team wants it scored as a no for now, D-018), `not-me`/unanswered → 0. Because a scene's three choices are each bucketed independently, one scene can credit several roles or none (unlike the old single-pick). Each role normalizes against its own max; `ranking` is sorted desc with the stable `technician > specialist > integrator` tiebreak. _(Documented cut: the exam flow scored a 30-statement sort the same way; `statementBuckets` still carries scene-choice buckets, the parameter name a holdover.)_

### Results (the live narrative role cards; the node map + exam dashboard are documented cuts)

> **Live headline (D-029 Phase C; compare D; the career map from the career-map merge, 2026-07-18).** The narrative results presentation is the **dark role-cards screen** (`Results/cards/`), with two sibling views: **compare** (Phase D) and the **career map** — Kayla's one-continuous-space zoomable map (overview → role zoom → job zoom), which **replaced the Phase E/F explore surfaces** (the ambient bubble map, the job constellation, and the standalone job-overview page; all deleted, their content absorbed into the map's floating context panel per the `CAREER_MAP_REVIEW.md` ledger). Per-job content (`src/data/jobs.ts`, 4/4/4 featured jobs — 4 per role) is **placeholder** pending ARM sourcing (the titles are real, from `commonJobTitles`). The old light node map was **deleted in Phase E** (`CategoryResults` / `NodeMap` / `FitNote`); `RoleDetailSheet` + `FitRadar` + `lib/nodeLayout.ts` stay live in the `/select` comparator.

- **Narrative → role cards** (`Results/cards/`): a results experience with an internal view-state (`useResultsNav`: `view` ∈ `cards | compare | map`, `roleIndex`, `activeTab`, `expanded`, the compare fields `compareWith` + per-column `compareExpanded`, and the map fields `mapPhase` ∈ `overview | role | job` + `selectedJob` + `targetJobId`, with the verbs `openConstellation` (a role's zoom — the verb name is a Phase-F holdover), `openJob`, `backToConstellation`, `backToMapOverview`, `setTargetJob`). The results `<main>` is a viewport-height scroll container (sits a constant gap below the nav); `ResultsPanel` splits into a **sticky glass header** (the control bar — Compare / Skip-to-map or Explore — pinned at the sheet top, content scrolls up under it) and a **scrolling body**, with the scroll container's `rounded-t-lg overflow` clipping the corners clean and the body revealing its rounded bottom only at the end (D-029 Phase D polish). The body holds a `RoleHero` (match label + "N of 3"; role name + **match %** both neutral on-dark; ranked **`SignalBars`** from `matchPercentages` with the active role's bar in its accent), an inline **`WhyYouMatched`** breakdown (collapsed line "where your X% comes from" → expanded **01 what you chose / 02 how they connected / 03 what it means / what you passed on**, wired to `categoryBreakdown` + `screenerFit`), and `RoleTabs` (The role: description, an entry-Technician **path-up** callout, salary/education stat cards, `{heading,text}` duties — Skills, path & next steps: ARM **competencies** chips + **bridge-program** rows). Prev/next steps through the ranked roles (resets tab + collapse + scroll-top).
- **Narrative → compare** (`Results/cards/CompareView`, D-029 Phase D): the current role (left) set side-by-side with a switchable target (right), reached via the Compare control. Each `CompareColumn` mirrors a role's overview-first-page — the hero (neutral name + match % + per-role `SignalBars`), an inline per-column `WhyYouMatched` (own `compareExpanded` state), role description, salary/education `StatBox`es, and `{heading,text}` duties — reusing the Phase C pieces unchanged. A `CompareTargetMenu` dropdown switches the right column among the other roles (the current/left role is excluded); a soft **"Our take"** recommendation line (`lib/compareRecommendation` + `resultsCopy.cards.recommendation`) leads with fit but foregrounds the lower-barrier role when the two are close. Faithful to the mockup's compare screen: no swap, no path-up callout (the rung framing stays a headline affordance). Desktop two-column, stacking under `md`.
- **Narrative → career map** (`Results/cards/CareerMap` + `CareerMapField` + `CareerMapHubLabel` / `CareerMapOrbGlow` / `CareerMapTargetJobOrb`, career-map merge): a truly full-bleed dark canvas reached via the map control ("Skip to your career map" / "Explore your career map"). Fixed Figma map art (`data/careerMapArt.ts`, node 1289:394) draws three rank clusters — hub, four job orbs, dashed branch paths — and the user's results fill the rank slots. **Hubs are area-true sized by match %** (`careerMapHubRadius`: `r = k·√pct`, 40% anchors the Figma hero radius, so ties render equal by construction) and carry distinct glyphs (arm / code / clipboard); edge paths re-trim their hub-side endpoints onto the live radius. **Job dots dim to 0.25 at overview** and brighten on the label zoom ramp or on hover/keyboard-focus with a name reveal. A glass **intro card** ("Your career map", incl. the dots line) dismisses to a persistent **"?" pill** with one settle-based re-expand per map visit (2.5s idle within 1.25× fit; skipped under reduced motion). The decorative `AmbientField` breathes behind everything; all motion reduced-motion-gated.
- **Narrative → map zoom ladder + context panel** (`MapContextPanel` + `MapPanelRole` + `MapPanelJob`, CM-10..12): the map's phases are `overview → role → job`, one continuous camera. At role and job zoom a **floating rounded glass panel** (margin on all sides, map visible around it; bottom sheet on mobile) carries the content: `MapPanelRole` (match read, `SignalBars`, description, stat chips, a jobs-in-path list — click to zoom) at role phase, `MapPanelJob` (the full three-tab job content: overview / skills & competencies incl. bridge programs / "How you fit" with the `TrajectoryViz` ladder via `lib/jobTrajectory`) at job phase; bodies crossfade inside one shell with a per-level header kicker. **Jobs are panel-only by decision** (CM-12 — no standalone job page). The **pane-aware camera** (`careerMapPaneRect` + `careerMapCameraForBoundsInPane`) fits the active cluster or orb into the space the panel leaves free, then pan/zoom stay free. Wayfinding is two stable affordances: a persistent **"Back to your results"** exit platter at every phase, and the panel-header phase-local back ("All paths" at role zoom → overview; the role name at job zoom → role zoom). The **target-role marker** (`targetJobId`/`setTargetJob` + `CareerMapTargetJobOrb`) is the outcome-tracking seed.
- **Narrative → node map** (`Results/category/`) — _deleted in Phase E (D-029)._ Was an Obsidian-style node graph (`CategoryResults` + `NodeMap` + `FitNote`). Its Phase E/F successors (the ambient bubble map, the job constellation + `JobSidePanel`, the standalone `JobOverview` page) were themselves **replaced by the career map and deleted at the career-map merge** (`bubbleLayout` / `constellationLayout` went with them). `lib/nodeLayout.ts` geometry stays (used by the `/select` fit radar).
- **Exam → dashboard** (`Results/exam/`) — _documented cut, deleted Phase 4 (D-027)._ The cut exam flow rendered a robot anchor + four category **bars**; then **"Why you scored that way"** (score provenance from `categoryContributions`) and **"Your roles"** (top-2 ranked → the role sheet).
- **Score provenance** `lib/categoryBreakdown.ts`: pure, walks the same branch-aware path as the scorer. Unwired since Phase 4, it is **wired in Phase C** into `WhyYouMatched` — extended to split a role's earned signals into **openers** (the school/pay screener steps, `SCREENER_STEP_IDS`) vs **moments** (interest MCs + scenes), and to surface **`passedLabels`** (a role's untaken options); `openerCount + momentCount === earnedCount`, `earnedCount + passedCount === totalCount`.
- **Shared role sheet** (`category/RoleDetailSheet`): the RC.org role-card content (description, activities, education, titles, salary) + a stub "Add this Role to your profile" link + a three-axis **fit radar** (per `lib/nodeLayout.ts` `CATEGORY_ANGLES`). Still live in the `/select` comparator (the cards screen renders inline tabs instead of the sheet).
- `Results.tsx` renders `ResultsExperience` (the cards screen). _(It previously dispatched by `flow.kind`: classic → `ClassicResults`, narrative → node map, exam → dashboard; the classic + exam branches went with the Phase-4 delete, and Phase C swapped the narrative node map for the role cards.)_

### Robot build: skipped (this iteration)

The narrative flow **skips the robot build + build beat** — the study kept presentation minimal so participants focus on the questions, and the build was never wired. Category flows never touch `robot` state and never route through `/build`. Re-enabling later is a per-flow `'build'` step or flag routed through `/build`; documented, not built.

### Runtime model

- Registry: `flows/index.ts` (`flows`, `flowList`, `defaultFlowId` = `'narrative'`). After Phase 4 the registry holds the narrative flow only; `FlowId = 'narrative'` is a single-member type. _(Documented cut: `flowList` was ordered Narrative/Exam/Classic; the exam and classic entries were deleted with their flows, D-027.)_ The store holds `flowId` **next to** session state (same survives-`reset()` mechanism as §16's `questionSetId`). The landing switcher calls `selectFlow` and filters `flowList` by kind, so the Exam/Classic segments fall away on their own; the CTA routes by condition (`select` → `/select` with no session, narrative → `/character`, the character pick, which continues to `/flow`). _(The `classic` → `/sort` route went with the classic delete.)_
- `FlowRunner` (`/flow`) renders the current step by type. The runner cursor lives in the store as one source of truth: `stepIndex` (which step), plus the within-step scene position — `scenePhase` (`'intro' | 'rating'`) and `choiceIndex` — and a `history` back-stack of visited step indices. Forward motion: MC picks `recordAnswer` + `advanceStep` (pushes history, resets the scene cursor); a scene's Continue calls `startScene` (intro → rating); rating a choice calls `rateChoice` (records the bucket, then walks to the next choice or — on the last — advances/finishes). `completeFlow` runs the scoring; completion routes through the `/loading` interstitial (rotating status lines from `data/loadingCopy.ts` over a faux progress bar) before `/results`. _(Dev only, D-029 Phase D: `devSeedResults` seeds a believable mock run and jumps straight to results, wired to a `import.meta.env.DEV` "skip to results" control on Landing for fast results iteration — remove at Phase G.)_ **Back** is a single store action `goBack`: a branch-aware reverse traversal (previous choice → scene intro → previous step, re-entering a prior scene at its last choice) offered whenever there's somewhere to reverse to; prior MC answers and scene buckets persist, so a revisit shows the pick pre-lit and re-pickable (2026-06-29 fidelity pass, the research-flagged "no way back" gap). Navigation is declarative off `currentScreen` so completion can't race the redirect. _(The `recordStatement` action and the `statementSort` render branch served the cut exam flow; `rateChoice` now owns scene-bucket recording.)_ `/results` renders `ResultsExperience` (the dark role cards; D-029 Phase C). _(It previously rendered `CategoryResults` (the node map); the `ClassicResults`/exam-dashboard branches went with the Phase-4 delete.)_

### Invariants (enforced by `data-integrity.test.ts`)

- Narrative (live): exactly 7 scenes, each with 3 choices covering all three roles; every `branchTo` resolves forward; computed full-path role max equals declared `expectedCategoryMax` (`{ technician: 11, specialist: 11, integrator: 11 }` — equal ceilings; "1-2 years" and "Whatever" are deliberately unscored, which keeps the three equal); unique step + choice ids; all owned copy non-empty (incl. the `cards` copy, flattened, and the 3 `matchLabels`); three `roleDetails` resolve to three distinct role names. **Phase C (D-029):** every role has non-empty `duties` (`{heading,text}`) + ARM `competencies` + `whyMomentsText`, and `bridgePrograms` carries ≥1 program per role with a valid icon.
- _(Documented cut — Exam, deleted Phase 4.)_ The exam invariant was: exactly 30 statements counted 8/7/7/8 (operate/repair/program/plan), interleaved (no two adjacent share a category), the 3 shared `SORT_BUCKETS` in order (`thats-me`/`maybe`/`not-me`) with the middle label asserted as "Kinda me" (D-018). The gate's `§17 exam flow shape` block was removed with the flow; the parametrized cross-flow blocks self-collapse to the single live flow.

### Screener fit (D-020)

The initial screener questions also produce an **always-on fit read** on results, separate from the match score. Each role carries an `educationLevel` and `payLevel` (0/1/2) in `roleDetails`. `lib/screenerFit.ts` (pure) `deriveScreenerProfile(flowId, answers)` reads the user's school/pay appetite (0/1/2) off the screener answers — narrative Q1+Q2 for education, Q3 for pay — and `screenerFitLines(category, profile)` compares it to the role in focus, returning a line per axis: **fits** when appetite ≥ the role's level, **heads-up** when the role needs more school / pays a tier below the user's target. Levels + copy are data (`src/data/flows/screeners.ts`). As of Phase C (D-029) this is folded into the role card's `WhyYouMatched` **"openers"** row (the school/pay angle), per the active role; `SCREENER_STEP_IDS` (in `flows/screeners.ts`) marks the opener steps so `categoryBreakdown` can split openers from moments. _(The standalone `Results/category/FitNote` banner is retired with the node-map headline. Documented cut: the exam path read education directly off exam Q1; that `if (flowId === 'exam')` branch was removed with the exam flow, D-027.)_

### Intro-question scoring (D-023, three-role re-cut)

The **narrative** intro questions now nudge the score (this updates the earlier "unmapped for scoring" state). On the role tier ladder, one point each: Q1 "No" (no college) and Q3 "$45,000" → **technician**; Q2 "Typical (4 years)" / "Long as possible (4+ years)" and Q3 "$85,000" / "$105,000+" → **specialist + integrator**. Q2 "Little as possible (1-2 years)" is deliberately **unscored** — it sits above HS/GED but below a Bachelor's, matching no role, which also keeps the three role ceilings equal at 11. Q0 (experience) and Q2 "Whatever" stay unscored. The salary question (Q3) is `$45,000 / $85,000 / $105,000+` (keys `n-q3-45` / `n-q3-85` / `n-q3-105`). These score tags run parallel to the always-on education/pay fit line (`screeners.ts`), kept consistent with its levels but not merged. See D-017, D-019, D-020, D-023, D-028.

_(Documented cut — Exam background mapping, deleted Phase 4.)_ The cut exam flow had partly recovered its background-question mapping: exam Q1/Q2 nudged the match on a tier ladder (No→Operator, Maybe/Yes→Specialist+Integrator — "not planning" vs "open to it", D-019), giving the exam flow an unequal full-path ceiling of `expectedCategoryMax {operate 11, repair 8, program 10, plan 11}` on the old four categories. That ceiling described the exam flow only and went with it; the live narrative flow has its own equal `expectedCategoryMax` (11/11/11). The verifier and `data-author` gates no longer headline the exam's 8/7/7/8 statement counts or its unequal max.
