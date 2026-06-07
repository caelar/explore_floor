// All shared data types for the experience. Schema spec: docs/DATA_MODEL.md §2.
// Data is data, not code — content lives in the sibling files, never in components.

// ---------- Archetypes & Roles ----------

export type ArchetypeId = 'builder' | 'innovator' | 'architect';

export type RoleId = 'technician' | 'specialist' | 'integrator';

/** Each archetype maps to exactly one role. */
export const ARCHETYPE_TO_ROLE: Record<ArchetypeId, RoleId> = {
  builder: 'technician',
  innovator: 'specialist',
  architect: 'integrator',
};

export interface Job {
  title: string;
  description: string; // one-liner, plain language
}

export interface Role {
  id: RoleId;
  archetypeId: ArchetypeId;
  name: string; // "Robotics Technician"
  archetypeName: string; // "Builder"
  shortDescription: string; // teen-friendly plain language
  pathFraming: string; // typical educational pathway, plain language
  competencyIds: string[];
  skillIds: string[]; // essential (soft) skills this role leans on; resolves to skills.ts
  jobs: Job[];
}

// ---------- Competencies & Skills ----------

export interface Competency {
  id: string;
  roleId: RoleId;
  name: string; // "PLC (Programmable Logic Controller)"
  plainName: string; // teen-friendly translation; see DATA_MODEL §5
}

export interface EssentialSkill {
  id: string;
  name: string; // "Critical Thinking"
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
  id: string; // stable identifier, e.g. 'building-or-fixing'
  round: RoundId;
  label: string; // what the user reads on the card
  weights: ArchetypeWeights;
  robotContribution: RobotContribution;
}

/** Per-round authoring + copy. The sort is a fixed 4 rounds of 6 (PRD §5.2). */
export interface RoundMeta {
  round: RoundId;
  /** Internal theme — authoring context only. NEVER rendered (PRD §5.2: no category labels). */
  theme: string;
  /** Encouraging beat shown when this round begins. Round 1 is null (it's the start). */
  enterCopy: string | null;
}

// ---------- Question sets (A/B language test) ----------

/** Sort-screen copy a question set owns: the two bin labels + the drag hint. */
export interface SortCopy {
  keepLabel: string;
  passLabel: string;
  dragHint: string;
}

/** Landing-screen copy a question set owns. */
export interface LandingCopy {
  overline: string;
  heading: string;
  description: string;
  cta: string;
}

/** Results-screen copy a question set owns (the shape of `resultsCopy`). */
export interface ResultsCopy {
  heading: string;
  compareHint: string;
  retake: string;
  lowSignal: string;
  sections: {
    match: string;
    skills: string;
    competencies: string;
    programs: string;
  };
  fit: Record<FitBand, string>;
}

/** Only 'a' remains — the planned set B (formal/playful A/B) was superseded by the
 *  question-structure study flows (§17) before its content was authored. */
export type QuestionSetId = 'a';

/** A complete, standalone content variant for the A/B language user test (DATA_MODEL §16).
 *  A set owns its 24 interest items (own ids, labels, weights, robot mappings) and the copy
 *  around them; roles, competencies, skills, programs, and the robot-part catalog stay
 *  SHARED — the three-role taxonomy is fixed. */
export interface QuestionSet {
  id: QuestionSetId;
  /** Researcher-facing label on the landing switcher, e.g. 'Set A'. */
  name: string;
  items: InterestItem[];
  rounds: RoundMeta[];
  sortCopy: SortCopy;
  landingCopy: LandingCopy;
  resultsCopy: ResultsCopy;
  /** Declared per-archetype weight sums. The data-integrity test asserts declared ==
   *  computed, so each set carries its own maxima — they need not match across sets
   *  (scoring normalizes per archetype against its own max). */
  expectedSums: ArchetypeWeights;
}

// ---------- Categories (study flows — DATA_MODEL §17) ----------

/** The four RC.org career-pathway categories the study flows score. Parallel to —
 *  not an extension of — the archetype model: the classic flow never reads these.
 *  Operate maps to the Operator role, which exists only in this category world. */
export type CategoryId = 'operate' | 'repair' | 'program' | 'plan';

/** Order matters: it encodes the deterministic tiebreak (and the fixed axis order
 *  for the node map and fit radar): operate > repair > program > plan. */
export const CATEGORIES: readonly CategoryId[] = ['operate', 'repair', 'program', 'plan'];

export type CategoryWeights = Record<CategoryId, number>;

/** Layer-2 role-sheet content (from the RC.org role cards on the team's board).
 *  Keyed by category so roles.ts and the three-role taxonomy stay untouched. */
export interface RoleDetail {
  categoryId: CategoryId;
  roleName: string; // "Operator"
  description: string;
  jobActivities: string[];
  education: string;
  commonJobTitles: string[];
  salary: string;
}

// ---------- Flows (study instrument — DATA_MODEL §17) ----------

export type FlowId = 'narrative' | 'exam' | 'classic';

/** Statement-sort buckets. 'maybe' exists because the prior user study asked for it;
 *  its scoring weight is MAYBE_WEIGHT in lib/categoryScoring.ts (0 for now). */
export type BucketId = 'thats-me' | 'maybe' | 'not-me';

export interface BucketDef {
  id: BucketId;
  label: string;
}

export interface MCChoice {
  id: string;
  label: string;
  /** Empty = unscored background question (the team intends these to map to
   *  something later — see DECISIONS D-017 open item). One or more = scored;
   *  a choice can feed two categories (e.g. hands-on → operate + repair). */
  categories: CategoryId[];
  /** Step id to jump to after this choice (Q1 "No" skips Q2). Omitted = next step. */
  branchTo?: string;
}

export interface MCStep {
  type: 'mc';
  id: string;
  /** Optional lead-in line shown above the question ("Let's start with some basic questions..."). */
  prompt?: string;
  question: string;
  choices: MCChoice[];
}

export interface SceneChoice {
  id: string;
  label: string;
  category: CategoryId; // exactly one; the four choices in a scene cover all four
}

/** A day-in-the-life story beat. Interaction: drag your pick into the drop zone. */
export interface SceneStep {
  type: 'scene';
  id: string;
  prompt: string; // the narrative setup ("Your alarm goes off in the morning...")
  question: string; // the ask ("How do you start the day?")
  choices: SceneChoice[];
}

export interface SortStatement {
  id: string;
  label: string;
  category: CategoryId; // hidden from the user; tallied on "that's me"
}

/** The exam flow's 30-statement sort. Presentation order is fixed here in data
 *  (interleaved across categories), one statement at a time into three buckets. */
export interface StatementSortStep {
  type: 'statementSort';
  id: string;
  statements: SortStatement[];
  buckets: BucketDef[];
}

export type FlowStep = MCStep | SceneStep | StatementSortStep;

/** Copy the category results screen reads (node map + role sheet chrome). */
export interface FlowResultsCopy {
  heading: string;
  mapHint: string; // how to read/use the map
  centerLabel: string; // "Recommended titles"
  retake: string;
  sheet: {
    activities: string;
    education: string;
    titles: string;
    salary: string;
    fit: string; // "How you fit"
    addToProfile: string; // stub link label
  };
}

interface FlowBase {
  id: FlowId;
  /** Researcher-facing label on the landing switcher. */
  name: string;
  landingCopy: LandingCopy;
}

/** The original Phase 1 experience, wrapped by reference — its pipeline
 *  (interest sort, robot build, archetype results) is untouched. */
export interface ClassicFlow extends FlowBase {
  kind: 'classic';
  questionSet: QuestionSet;
}

/** A step-driven study flow scored across the four categories. No robot:
 *  the build beat is intentionally skipped this iteration (D-017). */
export interface CategoryFlow extends FlowBase {
  kind: 'narrative' | 'exam';
  steps: FlowStep[];
  /** Declared full-path max per category — data-integrity asserts declared == computed. */
  expectedCategoryMax: CategoryWeights;
  resultsCopy: FlowResultsCopy;
}

export type Flow = ClassicFlow | CategoryFlow;

export interface CategoryResult {
  raw: CategoryWeights;
  /** 0-100 per category, normalized against that category's own achievable max
   *  on the path the user actually took (branch-aware). */
  matchPercentages: CategoryWeights;
  /** Best → worst; drives ring placement (innermost = first). */
  ranking: CategoryId[];
  primaryCategory: CategoryId;
}

// ---------- Robot ----------

/** A robot has a fixed set of slots. Each kept interest contributes to one
 *  or more of them. The build logic resolves conflicts (last-wins by default;
 *  see DATA_MODEL §10). */
export type RobotSlot =
  | 'base'
  | 'body'
  | 'leftArm'
  | 'rightArm'
  | 'head'
  | 'accessory' // up to N accessories can stack
  | 'decal' // up to N decals can stack
  | 'colorScheme';

export interface RobotContribution {
  /** Description for designers/authors. Not shown to user. */
  intent: string;
  /** One or more part contributions applied if this interest is kept. */
  parts: RobotPartRef[];
}

export interface RobotPartRef {
  slot: RobotSlot;
  partId: string; // refs an entry in /src/data/robotParts.ts
}

export interface RobotPart {
  id: string;
  slot: RobotSlot;
  name: string; // designer-facing label
  svgComponent: string; // name of the React/SVG component to render (Phase 2)
}

// ---------- Color schemes ----------

/** Archetype-derived color scheme for the robot + role accents (DESIGN_SYSTEM §3.3).
 *  Picked from the dominant archetype after scoring. */
export interface ColorScheme {
  id: ArchetypeId | 'default';
  accentToken: string; // Tailwind/Figma token name, e.g. 'arm-orange'
  accentHex: string; // raw hex for SVG fills / non-class usage
  name: string; // designer-facing label
}

// ---------- Programs ----------

export interface TrainingProgram {
  id: string;
  name: string;
  type: 'apprenticeship' | 'certificate' | 'degree' | 'bootcamp' | 'workshop';
  duration: string; // "12 weeks", "2 years", etc.
  rolesServed: RoleId[];
  competencyIds: string[]; // which competencies this program builds
  blurb: string; // 1-2 sentence description
  url?: string; // optional, mocked
}

// ---------- Runtime ----------

export type Decision = 'keep' | 'pass';

export interface SessionState {
  currentScreen: 'landing' | 'sort' | 'build' | 'results' | 'flow';
  currentRound: 0 | 1 | 2 | 3 | 4; // 0 = not started, 4 = sorting done
  decisions: Record<string, Decision>; // keyed by InterestItem.id
  scoreResult: ScoreResult | null;
  robot: RobotState | null;
  currentlyTryingOn: RoleId | null; // results screen state
  soundEnabled: boolean;
  // ---- Category-flow runtime (DATA_MODEL §17) — untouched by the classic flow ----
  stepIndex: number; // cursor into the active CategoryFlow's steps
  answers: Record<string, string>; // stepId → chosen MCChoice/SceneChoice id
  statementBuckets: Record<string, BucketId>; // SortStatement.id → bucket
  categoryResult: CategoryResult | null;
}

export interface RobotState {
  slots: Partial<Record<RobotSlot, string | string[]>>; // partId or array for stacking slots
  isFinalized: boolean; // true only after completion
}

export interface ScoreResult {
  raw: ArchetypeWeights; // sum of weights for kept items, per archetype
  matchPercentages: ArchetypeWeights; // 0-100 per archetype, see scoring formula
  primaryArchetype: ArchetypeId;
  primaryRole: RoleId;
  ranking: ArchetypeId[]; // ordered, primary first
}

/** Plain-language band for a match percentage, used in the results "how you match" read. */
export type FitBand = 'strong' | 'solid' | 'light';
