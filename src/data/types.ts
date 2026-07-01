// All shared data types for the experience. Schema spec: docs/DATA_MODEL.md §17.
// Data is data, not code — content lives in the sibling files, never in components.

// ---------- Roles (narrative flow — DATA_MODEL §17) ----------

/** The three ARM robotics career roles the narrative flow scores: Technician (entry),
 *  Specialist (mid), Integrator (planning). Mirrors RC.org's live three-role structure
 *  (docs/reference/ARM Updated Role Structure - Source Content.md). */
export type CategoryId = 'technician' | 'specialist' | 'integrator';

/** Order matters: it encodes the deterministic tiebreak (and the fixed axis order
 *  for the node map and fit radar): technician > specialist > integrator. */
export const CATEGORIES: readonly CategoryId[] = ['technician', 'specialist', 'integrator'];

export type CategoryWeights = Record<CategoryId, number>;

/** Landing-screen copy a flow owns. */
export interface LandingCopy {
  overline: string;
  heading: string;
  description: string;
  cta: string;
}

/** A "What you'll do" duty blurb on the results role card: a short verb heading plus a
 *  one-line plain expansion. Authored from each role's ARM job activities. */
export interface RoleDuty {
  heading: string;
  text: string;
}

/** Layer-2 role content (from the RC.org role cards). Keyed by role. Read by the narrative
 *  results role cards (DATA_MODEL §17) and the /select comparator's role sheet. */
export interface RoleDetail {
  categoryId: CategoryId;
  roleName: string; // "Technician"
  /** The role's tier in ARM's three-rung ladder, shown as the job-overview header level pill
   *  (reference parity): Technician "Entry level", Specialist "Mid level", Integrator "Planning". */
  tierLabel: string;
  description: string;
  jobActivities: string[];
  /** Richer "What you'll do" blurbs for the results card's role tab (heading + text),
   *  authored from jobActivities. */
  duties: RoleDuty[];
  /** The role-specific competencies ARM publishes for this path (its "Levels of
   *  Competencies"). Rendered as the results card's "Competencies you'll build" chips. */
  competencies: string[];
  /** One plain sentence for the "why you matched" breakdown's moments row: what the user's
   *  scene/interest picks said about this role. In the project voice (no em dashes). */
  whyMomentsText: string;
  /** Optional upward-path framing for an entry-level result (Technician), so it reads as a
   *  starting rung with a visible climb to Specialist/Integrator, not a verdict (results-screen
   *  rubric: technician-is-a-rung). Omitted on the higher roles. */
  pathUp?: string;
  education: string;
  /** Compact one-line education for the constellation side rail's small stat chips (reference
   *  parity — the rail shows a short value like "High school / GED" / "Bachelor's", not the full
   *  multi-line list the role/job tabs use). */
  educationShort: string;
  /** Education ladder for the screener fit line (D-020): 0 = HS/GED, 2 = bachelor's+
   *  (level 1, an associate/cert, has no role in the three-role model but stays a valid
   *  user-appetite rung). Compared against the user's stated school appetite. */
  educationLevel: 0 | 1 | 2;
  commonJobTitles: string[];
  salary: string;
  /** The national-median figure alone (e.g. "National median $45,936/yr"). The results cards +
   *  compare show this for a consistent one-figure read across roles (Technician has no range),
   *  while the fuller `salary` range stays for the /select sheet. */
  salaryMedian: string;
  /** Just the figure (e.g. "$45,936/yr") for the constellation rail's compact salary chip, where
   *  the longer "National median …" string would wrap (reference parity). */
  salaryShort: string;
  /** Pay ladder for the screener fit line (D-020): 0 = ~$46k (Technician), 2 = $85k+
   *  (Specialist/Integrator). Compared against the user's stated pay expectation. */
  payLevel: 0 | 1 | 2;
}

/** Icon key for a bridge-training program row (mapped to a Material ligature in the UI). */
export type BridgeProgramIcon = 'mechatronics' | 'systems' | 'certification' | 'controls';

/** A bridge-training program on the results card's "How to bridge the gap" list.
 *  PLACEHOLDER content pending ARM sourcing (docs/reference/Job_Program_Data_Request.md). */
export interface BridgeProgram {
  title: string;
  school: string;
  icon: BridgeProgramIcon;
}

/** A featured job within a role path (Phase F, DATA_MODEL §17). The results constellation rings
 *  these around the role center; the job overlay + job-overview page read the per-job content.
 *  ⚠️ PLACEHOLDER per-job copy (summary/responsibilities/skills/roleNoun) authored in the project
 *  voice pending ARM sourcing (docs/reference/Job_Program_Data_Request.md). Salary + education
 *  default to the role-level roleDetails; the optional overrides are for the day ARM provides
 *  per-job figures. Exactly 4 featured jobs per role (the 4-node constellation ring). */
export interface Job {
  /** Stable slug, unique across all roles, e.g. 'technician-robot-operator'. */
  id: string;
  categoryId: CategoryId;
  /** Display title, drawn from / consistent with the role's commonJobTitles. */
  title: string;
  /** One plain-voice line on what this person does day to day. ⚠️ PLACEHOLDER. */
  summary: string;
  /** ~3 "What you'll do" bullets. ⚠️ PLACEHOLDER. */
  responsibilities: string[];
  /** ~4 short skill chips for this specific job. ⚠️ PLACEHOLDER. */
  skills: string[];
  /** Consonant-initial noun for the "You as a {noun}" framing on the job-overview "How you fit"
   *  tab. Defaults to the title when omitted. */
  roleNoun?: string;
  /** Optional per-job salary override; defaults to roleDetails[categoryId].salaryMedian. */
  salaryMedian?: string;
  /** Optional per-job education override; defaults to roleDetails[categoryId].education. */
  education?: string;
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
  /** Short label for the results "why you matched" chips, where the full `label` can run long
   *  (e.g. "Meet with my friends to make some afterschool plans"). Falls back to `label`. */
  chipLabel?: string;
  /** Empty = unscored background question. One or more = scored; a choice can feed two
   *  roles (e.g. "$85,000+" → specialist + integrator). */
  categories: CategoryId[];
  /** Step id to jump to after this choice (Q1 "No" skips Q2). Omitted = next step. */
  branchTo?: string;
}

export interface MCStep {
  type: 'mc';
  id: string;
  /** Optional lead-in line shown above the question ("Let's start with some basic questions..."). */
  prompt?: string;
  /** Where the prompt sits relative to the question. 'above' (default) frames a scenario/transition.
   *  'below' renders it as a quiet reference detail under the question — for factual qualifiers like
   *  the salary range, which support the answer rather than set a scene. Keeps the prominent "above"
   *  slot for real scenarios (research: people skip the top line, so don't strand a needed fact there). */
  promptPlacement?: 'above' | 'below';
  question: string;
  choices: MCChoice[];
}

export interface SceneChoice {
  id: string;
  label: string;
  /** Short label for the results "why you matched" chips (the scene `label` can run long).
   *  Falls back to `label` when omitted. */
  chipLabel?: string;
  category: CategoryId; // exactly one; the three choices in a scene cover all three roles
}

/** A day-in-the-life story beat. Interaction (D-018): sort each of the three choices into
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

export type FlowStep = MCStep | SceneStep;

/** Copy for the dark results role-cards screen (DATA_MODEL §17). Templates use {role},
 *  {pct}, {pointed}, {total}, {passed}, {n}, {education}, {salary} placeholders the screen
 *  fills. All copy is data — no component holds these strings. */
export interface ResultsCardsCopy {
  /** Hero match labels by rank (index 0 = top match). */
  matchLabels: string[];
  /** "{index} of {total}" position label in the hero. */
  stepLabel: string;
  /** Sticky control-bar actions. */
  compareCta: string;
  mapCta: string; // mid-rank: "Skip to map"
  exploreCta: string; // last rank: "Explore careers"
  // --- Why you matched ---
  whyHeading: string; // "Why {role}?"
  collapsedLine: string; // "Across the {total} moments...{moreThanAny}. That's where your {pct}% comes from."
  moreThanAny: string; // ", more than any other role" (top match only)
  seeBreakdown: string;
  hideBreakdown: string;
  chosenLabel: string; // "What you chose"
  moreAnswers: string; // "+{n} more answers"
  connectLabel: string; // "How they connected"
  openerNoun: string; // "opener" (the school/pay row count when it points here; 1 → "opener")
  openersLabel: string; // label for the school/pay row when no opener pointed here ("School & pay")
  momentNoun: string; // "moment"
  meaningLabel: string; // "What this all means"
  meaningText: string; // the long tally-not-a-verdict paragraph
  passedLabel: string; // "What you passed on"
  passedCountLabel: string; // "{passed} of {total}"
  passedText: string; // "{passedExamples}...landed at {pct}% and not higher."
  passedExample: string; // ", like {a} and {b}" (joined into passedText)
  // --- Tabs ---
  roleTab: string;
  skillsTab: string;
  descriptionHeading: string;
  dutiesHeading: string;
  competenciesHeading: string;
  bridgeHeading: string;
  bridgeSubtitle: string;
  salaryLabel: string;
  educationLabel: string;
  // --- Compare (Phase D) ---
  backToRole: string; // control bar: "Back to {role}"
  compareWithLabel: string; // dropdown lead-in before the target role name
  recommendationLabel: string; // small lead-in above the recommendation line
  recommendation: CompareRecommendationCopy;
  // --- Map (Phase E) ---
  backToMap: string; // cards control bar (after a map dive): "Back to the map"
  /** Cards control bar, when reached via the map path: "Explore {role} careers" → that role's
   *  constellation (Phase G; replaces the old "Back to the map" back-action). */
  exploreRoleCta: string;
  map: ResultsMapCopy;
  // --- Explore: constellation / job panel / job overview (Phase F) ---
  explore: ResultsExploreCopy;
}

/** Copy for the Phase F explore views (DATA_MODEL §17): the role constellation, the job
 *  side-panel overlay, and the standalone job-overview page. Templates fill {role}, {noun}, and
 *  {n}; the rest are plain labels. The per-job *content* lives in src/data/jobs.ts — these are
 *  only the chrome. (data-integrity flattens this block, so every value is a string or a string
 *  array.) */
export interface ResultsExploreCopy {
  // constellation (view: 'selected')
  jobsInPathHeading: string; // "Jobs in this path"
  jobsInPathCount: string; // "{n} roles" counter beside the heading
  roleOverviewCta: string; // side-panel footer → role cards
  allPathsBack: string; // side-panel header back → map
  // job overlay (view: 'job')
  jobEyebrow: string; // "Job in {role}"
  jobOverviewCta: string; // side-panel footer → job-overview page
  responsibilitiesHeading: string; // job "What you'll do"
  // job overview page (view: 'job-overview')
  overviewBack: string; // control-bar back → job overlay
  setTargetCta: string; // inert "Set as target role" pill
  overviewTabs: string[]; // [overview, skills & competencies, how you fit]
  jobSkillsHeading: string; // per-job skills section
  closeGapHeading: string; // bridge-programs section
  closeGapSubtitle: string;
  youAsHeading: string; // "You as a {noun}"
  trajectoryHeading: string; // career-trajectory mini-viz heading
}

/** Copy for the ambient bubble-map results view (D-029 Phase E): the glass intro card + its
 *  back-to-cards control. No placeholders — these are plain lines. */
export interface ResultsMapCopy {
  title: string; // glass card heading
  intro: string; // one line on what the scores mean
  hint: string; // one line on how to use the map (tap a bubble)
}

/** The compare-screen recommendation line, by variant (see lib/compareRecommendation).
 *  Soft, non-verdict copy that leads with fit but foregrounds the lower-barrier role when
 *  the two are close. Templates fill role-name slots: {high}/{low} (clear winner),
 *  {lowBarrier}/{growToward} (close, differing barrier), {high} (close, equal barrier). */
export interface CompareRecommendationCopy {
  clearWinner: string;
  closeLowerBarrier: string;
  closeEqualBarrier: string;
}

/** Copy the results screen reads: the dark role cards (`cards`) plus the legacy node-map /
 *  role-sheet chrome (still used by the /select comparator's shared sheet). */
export interface FlowResultsCopy {
  heading: string;
  mapHint: string; // how to read/use the map
  centerLabel: string; // "Recommended titles"
  retake: string;
  cards: ResultsCardsCopy;
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

/** A step-driven flow scored across the three roles. */
export interface CategoryFlow extends FlowBase {
  kind: 'narrative';
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
  /** Back-stack of visited step indices (newest last), so Back can reverse a branch the
   *  forward path took (Q1 "No" skips Q2). Within-step position is `scenePhase`/`choiceIndex`. */
  history: number[];
  /** A scene's two-beat position: the context card ('intro') vs rating its choices ('rating').
   *  Meaningful only while `stepIndex` points at a scene step; reset to 'intro' on every advance. */
  scenePhase: 'intro' | 'rating';
  /** Which of the active scene's choices is being rated (0-based cursor). Drives the one-at-a-time
   *  rater and lets Back step to the previous choice with its prior pick pre-lit. */
  choiceIndex: number;
  /** Which way the last step change moved, so the runner's step transition can slide directionally
   *  (forward: in-from-right; back: in-from-left). Set by the nav actions, read by FlowRunner. */
  lastDirection: 'forward' | 'back';
  answers: Record<string, string>; // stepId → chosen MCChoice/SceneChoice id
  statementBuckets: Record<string, BucketId>; // SceneChoice.id → bucket
  categoryResult: CategoryResult | null;
}
