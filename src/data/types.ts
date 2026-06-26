// All shared data types for the experience. Schema spec: docs/DATA_MODEL.md §17.
// Data is data, not code — content lives in the sibling files, never in components.

// ---------- Categories (study flow — DATA_MODEL §17) ----------

/** The four RC.org career-pathway categories the narrative flow scores. */
export type CategoryId = 'operate' | 'repair' | 'program' | 'plan';

/** Order matters: it encodes the deterministic tiebreak (and the fixed axis order
 *  for the node map and fit radar): operate > repair > program > plan. */
export const CATEGORIES: readonly CategoryId[] = ['operate', 'repair', 'program', 'plan'];

export type CategoryWeights = Record<CategoryId, number>;

/** Landing-screen copy a flow owns. */
export interface LandingCopy {
  overline: string;
  heading: string;
  description: string;
  cta: string;
}

/** Layer-2 role-sheet content (from the RC.org role cards on the team's board).
 *  Keyed by category. */
export interface RoleDetail {
  categoryId: CategoryId;
  roleName: string; // "Operator"
  description: string;
  jobActivities: string[];
  education: string;
  /** Education ladder for the screener fit line (D-020): 0 = HS/GED, 1 = associate/cert,
   *  2 = bachelor's+. Compared against the user's stated school appetite. */
  educationLevel: 0 | 1 | 2;
  commonJobTitles: string[];
  salary: string;
  /** Pay ladder for the screener fit line (D-020): 0 = ~$40k, 1 = ~$66k, 2 = $105k+.
   *  Compared against the user's stated pay expectation. */
  payLevel: 0 | 1 | 2;
}

// ---------- Flow (study instrument — DATA_MODEL §17) ----------

export type FlowId = 'narrative';

/** What the Landing condition switcher can arm: the narrative flow, or the standalone
 *  /select role-select comparator (a route, not a flow — it never starts a session). */
export type LandingConditionId = FlowId | 'select';

/** Sort buckets. 'maybe' exists because the prior user study asked for it; its scoring
 *  weight is MAYBE_WEIGHT in lib/categoryScoring.ts (0 for now). */
export type BucketId = 'thats-me' | 'maybe' | 'not-me';

export interface BucketDef {
  id: BucketId;
  label: string;
}

export interface MCChoice {
  id: string;
  label: string;
  /** Empty = unscored background question. One or more = scored; a choice can feed two
   *  categories (e.g. hands-on → operate + repair). */
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

/** A day-in-the-life story beat. Interaction (D-018): sort each of the four choices into
 *  the three buckets (That's me / Kinda me / Not me), one card at a time. A choice's bucket
 *  is recorded in the shared statementBuckets slice keyed by SceneChoice.id; the buckets are
 *  fixed chrome (SORT_BUCKETS), so they aren't per-scene data. */
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
  category: CategoryId;
}

/** A statement sort, one statement at a time into three buckets. Retained as a flow-step
 *  shape (categoryScoring/categoryBreakdown still handle it); no live flow uses it after the
 *  strip — the exam flow that did was archived (Phase 4). */
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

/** A step-driven flow scored across the four categories. No robot: the build beat is
 *  intentionally out of scope (D-017). */
export interface CategoryFlow extends FlowBase {
  kind: 'narrative' | 'exam';
  steps: FlowStep[];
  /** Declared full-path max per category — data-integrity asserts declared == computed. */
  expectedCategoryMax: CategoryWeights;
  resultsCopy: FlowResultsCopy;
}

export type Flow = CategoryFlow;

export interface CategoryResult {
  raw: CategoryWeights;
  /** 0-100 per category, normalized against that category's own achievable max
   *  on the path the user actually took (branch-aware). */
  matchPercentages: CategoryWeights;
  /** Best → worst; drives ring placement (innermost = first). */
  ranking: CategoryId[];
  primaryCategory: CategoryId;
}

// ---------- Runtime ----------

export interface SessionState {
  currentScreen: 'landing' | 'flow' | 'results';
  stepIndex: number; // cursor into the active flow's steps
  answers: Record<string, string>; // stepId → chosen MCChoice/SceneChoice id
  statementBuckets: Record<string, BucketId>; // SceneChoice.id → bucket
  categoryResult: CategoryResult | null;
}
