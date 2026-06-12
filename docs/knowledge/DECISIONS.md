# Decisions

ADR-lite log of non-obvious calls. Newest first. One entry per decision: **what · why · alternatives · affected**. Capture with `/compound decision`.

This is the highest-value handoff artifact: when ARM's dev team (or future-you) asks "why is it like this?", the answer lives here.

---

## 2026-06-11

### D-021 — Classic leaves the landing switcher; the role-select comparator takes its slot; narrative becomes the default
- **Decision:** The landing condition switcher reads **Narrative / Exam / Role select**. The "Role select" tab navigates straight to `/select` (the "skip the quiz" comparator for the industry-professional arm) — it's a route, not a flow: tapping it doesn't arm a condition for the CTA. **Classic is dormant:** all code, data, and registration stay (in `flows/index.ts`, `flowList`, the §17 integrity tests, and the `/sort`/`/build` routes), but it has no UI entry. `defaultFlowId` → `narrative` so a fresh load can't silently start classic. The classic E2E specs reach it via a dev-only `globalThis.__sessionStore` handle in `sessionStore.ts` (stripped from production builds).
- **Why:** The study conditions are now narrative vs exam vs straight role-pick; classic isn't a condition in this round but the team wants it kept "just in case." Keeping it registered keeps its data validated; removing only the UI entry is the smallest cut.
- **Alternatives:** Keep classic as a fourth tab (rejected — not a study condition, clutters the researcher control); delete classic (rejected — explicit keep); persist a select "condition" in the store so the CTA starts it (rejected — needs FlowId widening or a parallel field for no protocol benefit).
- **Affected:** `Landing.tsx`, `flows/index.ts` (`defaultFlowId` only), `sessionStore.ts` (dev handle), classic E2E specs + `tests/e2e/helpers.ts`, `role-select.spec.ts`.

## 2026-06-08

### D-020 — Screeners drive an always-on education/pay fit line on results
- **Decision:** The initial screener questions also produce a results **"fit check"** (a small block next to the role in focus). Each role carries an `educationLevel` and `payLevel` (0 = HS / ~$40k … 2 = Bachelor's+ / $105k+; Specialist and Integrator both land at edu level 2 per the team). `deriveScreenerProfile` reads the user's appetite (0/1/2) off the flow's screener answers — exam Q1 directly; narrative Q1+Q2 ("going to college?" + "how long?") for education, narrative Q3 for pay — and `screenerFitLines` compares it to the role's ladder, returning an **always-shown** line per axis: a green check when the user's appetite meets or exceeds the role, an amber heads-up when the role asks for more school or pays a tier below their target. Education shows in both flows; pay is narrative-only (the exam asks no salary question). Shown next to the top match (exam dashboard) / the centered role (narrative node map). Levels + copy are data (`src/data/flows/screeners.ts` + the `roleDetails` ladders); the comparison is a pure lib (`lib/screenerFit.ts`).
- **Why:** The team wants the screeners reflected in results even when interests point elsewhere — "you map to Integrator the most, but you said you don't want school, and we should let people know." This reconciles their two framings: the **category mapping (D-019) is the score nudge**; the **0/1/2 level is the fit read**. Always-on (their call) so a clean fit gets affirmed too, not only mismatches.
- **Alternatives:** Caveat-only with no score nudge (rejected — they chose "also nudge", D-019); show only on a mismatch (rejected — they chose always-on); a 4th education level so Integrator reads as more school than Specialist (rejected — they confirmed both at level 2); pin the narrative fit to the top match rather than the swapped role (rejected — following the centered role keeps it coherent with the heading).
- **Affected:** `src/data/types.ts` (RoleDetail `educationLevel`/`payLevel`), `roleDetails.ts` (levels), `src/data/flows/screeners.ts` (new — levels + copy), `lib/screenerFit.ts` (new) + lib barrel, `Results/category/FitNote.tsx` (new), `ExamResults` + `CategoryResults` (wire), `screenerFit.test.ts` + data-integrity (level range) + narrative/exam e2e, `DATA_MODEL.md` §17, this entry. **Gates: lint, typecheck, 99 unit, 6 E2E green.**

### D-019 — Exam screener questions (Q1/Q2) nudge the category match
- **Decision:** The exam's two background screeners now carry category weights on a **tier ladder** (the team's recovered mapping, then refined): "Are you pursuing higher education?" and "Do you have prior experience?" each map **No → Operator** (operate, entry tier 0); **Maybe / Yes → Specialist + Integrator** (program + plan, advanced tier 2). The middle "Maybe" counts as **full appetite, same as Yes** (level 2) — the question reads as "not planning" vs "open to it", so being open to school/experience leans advanced. Q3 maps its four options left-to-right onto operate/repair/program/plan. The exam intro questions now **nudge the match**; `expectedCategoryMax` becomes `{operate 11, repair 8, program 10, plan 11}` (Q1/Q2 reach operate/program/plan; Q3 all four). The **salary** question stays out of the score — fit-line only (D-020). One tier level (0/1/2) drives both the score nudge and the fit line. Hardened the MC transition in the same change (a fast click could land on the exiting question's lingering button and corrupt the answer — see L-007) so scored first-step answers are reliable.
- **Why:** The team recovered the rationale and confirmed it: these questions gauge how much school/experience the user is after, which aligns with the role tier ladder, so they belong in the score as a nudge. The Maybe→2 refinement is the team's call — openness to higher ed should count toward the roles that need it, not split toward the middle tier. Wiring it surfaced (and forced a fix of) the latent MC-transition race.
- **Alternatives:** Keep them unscored background (rejected — the team wants them counted); keep the first-pass categorical split (No→Operator, Maybe→Technician+Specialist, Yes→Integrator) (rejected — the team moved Maybe up to the advanced tier); a numeric weighted-MC schema so Yes outweighs Maybe (rejected — Maybe = Yes = level 2 now, so a shared category set is simpler than per-answer weights); nudge the match with salary too (rejected — the team kept salary fit-line-only; the match stays interest-driven + the school/experience nudge). The **narrative** intro screeners stay unmapped for scoring (that half of the D-017 open item is still open) but feed the fit line via their answers.
- **Affected:** `src/data/flows/examFlow.ts` (e-q1/e-q2 categories + `expectedCategoryMax`), `src/data/flows/screeners.ts` (e-q1 Maybe level 2), `src/screens/Flow/MCQuestion.tsx` (answer lock), `screenerFit.test.ts` + `data-integrity.test.ts` (max), `DATA_MODEL.md` §17 open item, this entry.

### D-018 — Narrative scenes are a per-choice 3-bucket sort (not a single pick); middle bucket reads "Kinda me" in both flows
- **Decision:** Each of the 7 narrative **scenes** now presents its 4 choices and the user sorts **each one** into the three buckets — **That's me / Kinda me / Not me** — one card at a time, the exam's `StatementSortView` mechanic with the scene's story framing on top. This replaces the D-017 "drag your one pick into a zone" model. The middle bucket is relabeled from "Maybe" to **"Kinda me"** across **both** study flows (narrative + exam) via one shared `SORT_BUCKETS` constant (`src/data/flows/buckets.ts`); its `BucketId` stays `'maybe'`, so scoring is unchanged — "Kinda me" still scores `MAYBE_WEIGHT` (**0** today, tunable). Scene choices flow into the existing `statementBuckets` map keyed by `SceneChoice.id`, so one scene can now credit several categories or none. The sort UI is extracted into a shared `BucketSort` component used by both the exam statement sort and each scene.
- **Why:** The team clarified the FigJam board's intent: the narrative was always meant to mirror the other quizzes' sort structure (judge each option), not pick a single winner — D-017 misread the board. Keeping one bucket vocabulary across both conditions removes a wording confound from a study that's specifically comparing **question structure**. "Kinda me" is the team's preferred phrasing for the middle option. Scoring stays at 0 because the existing deliberate decision (a middle option that scores as a no, pending tuning) is unchanged; only the label moved. Reusing `statementBuckets` + `bucketWeight` means the change is mostly UI — the scoring/normalization path and per-category max are untouched (`expectedCategoryMax` still {9,9,9,9}).
- **Alternatives:** Keep the single-pick scene (rejected — contradicts the team's clarified intent and breaks structural parallel with the exam); show all 4 choices at once as a Likert grid (rejected — the user chose one-card-at-a-time to match the exam exactly); give "Kinda me" partial credit, e.g. 0.5 (rejected — the user kept it at 0, consistent with the prior decision and identical scoring across flows; flip `MAYBE_WEIGHT` later if wanted); relabel only the narrative's middle bucket (rejected — the user chose both flows for study consistency); store scene choices in `answers` like the old pick (rejected — buckets belong in `statementBuckets`; `answers` now holds only MC picks + branching).
- **Affected:** `src/data/flows/buckets.ts` (new `SORT_BUCKETS`), `src/data/flows/examFlow.ts` (uses it), `src/data/types.ts` (`SceneStep` doc), `src/screens/Flow/BucketSort.tsx` (new shared sort), `StatementSortView.tsx` (thin wrapper), `SceneSortView.tsx` (new, replaces `SceneStepView.tsx`), `FlowRunner.tsx` (scene `onDone` advances/completes), `src/lib/categoryScoring.ts` + `categoryBreakdown.ts` (scene case reads buckets), unit tests (scene scoring/breakdown), `data-integrity.test.ts` ("Kinda me" lock), rewritten `narrative.spec`, `exam.spec` ("Kinda me" check), `DATA_MODEL.md` §17, `PRD.md`, the content spec's as-built notes, this entry. **Gates green: lint, typecheck, 89 unit, 6 E2E.**

## 2026-06-07

### D-017 — Question-structure study: three selectable flows, four categories, per-flow results (supersedes the §16 A/B language test for the live study)
- **Decision:** The first user test compares which **question structure** is most engaging and most trusted, not which language treatment. Three selectable **flows** ship on one build (`DATA_MODEL.md` §17): **Classic** (the Phase 1 interest sort, wrapping set A by reference — pipeline untouched), **Narrative** (5 intro MC with a Q1 branch, then 7 day-in-the-life scenes you drag a pick into), and **Exam** (2 background MC + 1 mapped MC, then a 30-statement sort into three buckets). The two new flows score **four RC.org categories** (Operate/Repair/Program/Plan → Operator/Technician/Specialist/Integrator), a model **parallel to** the three archetypes (no change to `ArchetypeId`/`RoleId`/`ARCHETYPE_TO_ROLE`). **Each new flow has its own results presentation** (the study compares these too): Narrative → an **Obsidian-style node graph** (top match centered, the other three behind it, tap to swap in; job titles branch off the front → role sheet — rebuilt from an initial concentric-rings version that read as "funky"); Exam → a **dashboard** (robot anchor + four category bars + "why you scored that way" provenance + "your roles"). Both share the role detail sheet (RC.org content + four-axis fit radar). A researcher-facing three-way segmented control on Landing switches flows; `flowId` lives next to session state so the condition survives `reset()` (same mechanism as D-016's `questionSetId`). The robot build + build beat are **skipped** in both new flows this iteration (the exam dashboard shows a static `RobotPlaceholder` as an anchor only, tinted by the top category). The statement sort's **`maybe` bucket scores 0** via a tunable `MAYBE_WEIGHT` constant. The §16 set B placeholder + `question-set-b` spec are retired (superseded by the flow switcher).
- **Why:** Research need shifted from language to structure — the team designed two structurally different instruments on the FigJam board ("Narrative Quiz Structure") plus a shared light-fidelity results wireframe. The user chose: keep the old flow as a third selectable condition; skip the robot for now to keep presentation minimal (focus on the questions), leaving re-enabling easy; three buckets for the sort (a prior study's participants asked for a "maybe") but score maybe as a no for now, tunable later; scene picks are drag-to-zone. Building flows as a discriminated union (classic wraps the existing QuestionSet by reference) keeps the Phase 1 pipeline at zero churn while the new flows declare ordered steps.
- **Alternatives:** Extend the §16 QuestionSet to carry structure (rejected — the classic scoring/robot/results pipeline keys off the 24-item shape; forcing four categories + steps into it would ripple through scoring.ts and every classic test); widen `ArchetypeId` to four (rejected — same ripple; the category world is cleanly separate and the new results read from `roleDetails`, not `roles.ts`); replace the old flow entirely (rejected — the user wants it as a comparison condition); keep robot part-mappings for the new flows (rejected — deferred with the rest of the build beat).
- **Affected:** `src/data/types.ts` (CategoryId/Flow/FlowStep/CategoryResult/RoleDetail), `src/data/flows/` (narrative/exam/classic + registry), `src/data/roleDetails.ts`, `src/lib/categoryScoring.ts` + `nodeLayout.ts` (+ tests), `src/state/sessionStore.ts` (flowId, category actions) + `useFlow`/`useQuestionSet`, generalized `DragSortCard`/`DropZone`, `src/screens/Flow/` (runner + MC/scene/statement views), `src/screens/Results/` (dispatcher + `ClassicResults` + `category/`), router `/flow`, Landing switcher, `data-integrity.test.ts` (§17 per-flow), new `narrative`/`exam` e2e, `DATA_MODEL.md` §16–§17, `CLAUDE.md` hard-rule carve-out, this entry.
- **Open item (revisit with the team):** the background questions (narrative Q1–Q3, exam Q1–Q2) are meant to map to *something* — they shape what the user is presented with — but the rationale is unrecovered, so they ship with empty category weights (`MCChoice.categories: []`). The schema is ready; adding weights later is a data edit only. Also pending: the two `??`-flagged narrative choices ("IT club" scene 4, "Writing code" scene 6) ship as-authored; the on-canvas title scatter from wireframe 1 was simplified to a tray (collision with 3-5 wide titles) and wants a polish pass.

## 2026-06-04

### D-016 — A/B question-set instrument inserted between Phase 1 and Phase 2
- **Decision:** The first user test compares two language treatments (formal/exam-like vs playful/narrativized), so content ships as two swappable **question sets** (`DATA_MODEL.md` §16): each set owns its 24 items (own ids/labels/weights/robot mappings) plus the landing, sort, round, and results copy; roles/competencies/skills/programs/parts stay shared. A researcher-facing segmented control on Landing switches sets; `questionSetId` lives **next to** session state in the store (not inside it) so `reset()`'s shallow merge preserves the condition between participants. Per-set **declared `expectedSums`** replace the global 22/27/25 sums invariant (recomputed-vs-declared, per set). Set B ships as a loud `[B]`-marked placeholder clone until the compiled content lands via the worksheet (`docs/knowledge/QUESTION_SET_WORKSHEET.md`) + data-author skill.
- **Why:** Research need — the test isolates language treatment, so both treatments must run on the same build with a switch the researcher can flip between sessions without re-setup. Building the registry to hold *fully independent* sets (not label overlays) covers both rewordings and structurally different question sets, which the team hasn't finished compiling. User chose full-experience scope (cards + flow + results copy), independent structure, and a visible landing toggle.
- **Alternatives:** Label-overlay map per set (rejected — locks out different items/weights); env/build-time switch or URL param (rejected — researcher needs an in-app flip); two deployed builds (rejected — heavier setup, drifts).
- **Affected:** `src/data/types.ts` (QuestionSet/SortCopy/LandingCopy/ResultsCopy), `src/data/questionSets/`, `src/state/sessionStore.ts` + `useQuestionSet`, `src/components/SegmentedControl.tsx`, Landing/Sort/Results/FourPartRead, `data-integrity.test.ts` (per-set `describe.each`), new `tests/e2e/question-set-b.spec.ts`, `DATA_MODEL.md` §13–§16, `PRD.md` §8/§14, data-author skill invariants. **Known boundary:** `Build.tsx` copy, the Results empty state, and chrome strings are intentionally NOT set-owned in this pass. Also fixed: `playwright.config.ts` now follows vite's port move to 5174.

## 2026-05-30

### D-015 — Phase 1 sort interaction is drag + tap only (no arrow-key/Enter mechanic)
- **Decision:** The Phase 1 Sort screen is sorted by **dragging the card into a bin or tapping a bin**. The bespoke "arrow keys to focus a bin, Enter to choose" mechanic (built then removed) is dropped. The two bins remain native `<button>`s, so basic keyboard operability (Tab to a bin, Enter/Space to activate) still exists for free — what's gone is the custom arrow-navigation layer.
- **Why:** User call during the Slice 1 checkpoint — the arrow/Enter layer added UI state and a focus model that didn't fit the intended drag-first interaction, and it foreshadows the Phase 2 conveyor where sorting is purely drag-off-the-belt. Native button semantics keep the experience keyboard-reachable without the bespoke layer.
- **Alternatives:** Keep the arrow/Enter mechanic (rejected per user); remove keyboard entirely incl. button activation (rejected — needlessly drops the free native a11y).
- **Affected:** `src/screens/Sort/Sort.tsx`, `src/screens/Sort/SortBin.tsx`; `ROADMAP.md` §2.2 (keyboard bullet) + the round-beat copy example. Full keyboard-nav polish remains a Phase 3 a11y item.

### D-014 — Phase 2 sort model: user drags parts off the belt; the arm assembles from the keep bin
- **Decision:** Refine the Phase 2 conveyor interaction. **The user drags interest parts directly off the moving belt into one of two bins set in front of the line (downscreen in 2D): "That's me" / "Not my thing." A robot arm then lifts each kept part from the "That's me" bin and assembles it onto the robot standing behind/above the belt.** A second arm — or a trash chute — clears the "Not my thing" bin (exact treatment is a Phase 2 authoring choice, TBD). This supersedes the earlier "user controls the arm to push items to bins" framing.
- **Why:** User's articulated vision at the Slice 1 checkpoint. Dragging parts directly is more legible and direct than puppeteering an arm; reserving the arm for *assembly* gives the robot-build payoff a clear, visible cause (kept part → arm → robot). Engine ownership stays clean: Motion owns the user's drag-off-belt gesture; GSAP owns the belt, the assembling arm(s), and the part-to-robot snap.
- **Alternatives:** User-controlled sorting arm (the prior doc model; rejected — indirect, more interaction-design risk); auto-sorting with the user only watching (rejected — removes agency, the core "half-real decision" the PRD is built on).
- **Affected:** `ROADMAP.md` §3.2/§3.3, `PRD.md` §5.2/§5.3, `DESIGN_SYSTEM.md` §10.3, `ARCHITECTURE.md` §5. Phase 2 builds to this model; Phase 1 stays the plain card-sort.

## 2026-05-29

### D-013 — Tailwind v4 (CSS-first): design tokens live in `@theme`, not `tailwind.config.ts`
- **Decision:** Phase 0 scaffolds on **Tailwind v4** via the `@tailwindcss/vite` plugin. The design-token source of truth is the `@theme` block in `src/styles/globals.css`; there is no `tailwind.config.ts` and no `postcss.config.js`/`autoprefixer`. Token **names are unchanged** (`arm-yellow`, `space-4`, `text-h1`, …) so the Figma-variable mirror and the tokens-not-literals rule are unaffected. Easing curves are mirrored into `@theme` (`ease-soft`/`ease-snap`); motion **durations** + the spring stay in `/src/lib/motion.ts` (v4 has no duration token namespace).
- **Why:** The user chose v4 explicitly during Phase 0 planning. v4 is the current major and a fresh scaffold pulls it by default; it moves tokens into CSS-first `@theme`, which is the idiomatic v4 model. Keeping token names identical preserves every downstream convention.
- **Alternatives:** Tailwind v3 with `tailwind.config.ts` (the original doc assumption; rejected per the user's call — would pin to the prior major); v4 in legacy `@config` compat mode loading a `tailwind.config.ts` (rejected — fights the v4 grain for no benefit once names are preserved).
- **Affected:** `src/styles/globals.css` (the `@theme` block), `package.json` (`tailwindcss@4` + `@tailwindcss/vite`, no postcss/autoprefixer), `vite.config.ts`. Docs reconciled to point at `@theme`: `CLAUDE.md`, `docs/ARCHITECTURE.md` §1/§3/§7, `docs/DESIGN_SYSTEM.md` §2/§8, `docs/ROADMAP.md` §1.2, `docs/rubrics/design-system-compliance.md`.

### D-012 — Don't ship a project `.mcp.json`; configure MCP servers globally (supersedes D-009)
- **Decision:** Remove the committed `.mcp.json`. MCP servers (`figma` / `playwright` / `firecrawl`) are expected to be configured globally (`claude mcp add` or an existing global setup). `.claude/settings.json` keeps `enabledMcpjsonServers` as a name-whitelist so a teammate with no global config can drop in their own local `.mcp.json` and have it auto-enable.
- **Why:** A project `.mcp.json` whose server names collide with the owner's global config caused duplicate-server issues in Claude Code. The app never depends on the file (it's dev-time tooling, not runtime), so removing it is the clean fix; the whitelist preserves the per-clone fallback.
- **Alternatives:** Keep `.mcp.json` and rename project servers to avoid collisions (rejected — churns the docs + still double-registers tools); `git update-index --skip-worktree` to keep it tracked but locally deleted (rejected — fragile, hides the file's absence from teammates).
- **Affected:** `.mcp.json` (deleted), `README.md`, `docs/ARCHITECTURE.md`, `docs/knowledge/HARNESS.md`. Historical refs in `STATUS.md` + the 2026-05-29 session note are left as-dated.

### D-011 — Defer the live RC.org capture until aesthetic-rubric authoring
- **Decision:** Don't scrape/screenshot RoboticsCareer.org yet. Capture it (Firecrawl + Playwright) when we author the aesthetic/design-system rubrics, ~Phase 1.
- **Why:** RC.org's brand tokens are already in `DESIGN_SYSTEM.md` verbatim; a live capture mainly grounds the *aesthetic* rubric and the before/after narrative, which we don't need until visual work starts.
- **Alternatives:** Capture now (rejected — premature); skip entirely (rejected — loses before/after + rubric grounding).
- **Affected:** `docs/rubrics/goose-game-aesthetic.md` (carries a TODO to add RC.org reference stills).

### D-010 — Motion skills via the free MIT community package (no Motion+)
- **Decision:** Install Motion (Framer) agent skills from `C-Jeril/framer-motion-skills` (MIT). Do **not** use `npx motion-ai`.
- **Why:** The official Motion AI Kit requires a paid Motion+ subscription, which we don't have. The community skills are free, open-source, Claude-Code-compatible, and cover our surface (components, variants, gestures, layout/shared transitions).
- **Alternatives:** `npx motion-ai` (rejected — paywalled); no Motion skills (rejected — leaves a gap vs GSAP).
- **Note:** It references legacy `framer-motion` imports; we use `motion/react`. Identical API; our `scene-motion` skill is authoritative for conventions.
- **Affected:** `README.md`, `.claude/skills/scene-motion`, toolchain setup.

### D-009 — Declare project MCP servers in `.mcp.json` for onboarding — *superseded by D-012*
- **Decision:** Add `figma` (remote HTTP), `playwright`, `firecrawl` to `.mcp.json`.
- **Why:** A teammate cloning the repo has none of the owner's global plugins; project-scoped servers get them productive immediately.
- **Alternatives:** Rely on each person installing plugins (rejected — slow onboarding, undocumented).
- **Affected:** `.mcp.json`, `.env.example`, `README.md`.

### D-008 — Knowledge lives in-repo; mirror durable facts to built-in memory
- **Decision:** `docs/knowledge/` is the version-controlled source of truth; a few durable agent-preference facts are mirrored into Claude built-in memory.
- **Why:** In-repo knowledge is reviewable in diffs, travels to the ARM handoff, and seeds the portfolio case study. Built-in memory adds auto-recall without re-reading files.
- **Alternatives:** Built-in memory only (rejected — invisible to handoff/portfolio).
- **Affected:** `docs/knowledge/*`, built-in memory.

### D-007 — Build a bespoke harness; don't install the BilLogic plugin
- **Decision:** Author our own harness. Borrow only the BilLogic plugin's five-layer frame and its rubric YAML+prose schema. Cut its heavy ritual (SHA-256 rule-consent, `ideations/`/`preferences/` taxonomy, `hd-config.md`, auto-generated reports).
- **Why:** The plugin is more prescriptive than we want; authoring our own is leaner, fits the project, and is the stronger portfolio story (a practice we built, not installed).
- **Alternatives:** Install the plugin wholesale (rejected — prescriptive, generic).
- **Affected:** `.claude/`, `docs/knowledge/`, `docs/rubrics/`.

### D-006 — Allow demo affordances despite "no undocumented steps"
- **Decision:** Permit a `?demo=true` pre-filled-results mode and a hidden skip-to-results link (Phase 3 tooling).
- **Why:** Demos and user-test setup are much faster with them; they're not user-facing flow steps.
- **Alternatives:** Strict adherence to the PRD screen list (rejected — friction for demos).
- **Affected:** `PRD.md` §14 (note added), `ROADMAP.md` §4.5/§4.7.

### D-005 — Remove project timeframes from the docs
- **Decision:** Strip schedule estimates (phase durations, "six weeks") from `ROADMAP.md`/`PRD.md`. Keep UX/animation timings.
- **Why:** Work ships when acceptance criteria are met, not on a fixed calendar; the dates added noise and false precision.
- **Alternatives:** Keep estimates (rejected — not how this project actually runs).
- **Affected:** `ROADMAP.md` §0, `PRD.md` §3.

### D-004 — Landing scene gets a Phase 1 GSAP `DrawSVG` reveal
- **Decision:** Move the landing-scene entrance animation earlier — a gentle `DrawSVG` reveal in Phase 1 as a low-risk test of the scene-animation approach (was "no animation yet").
- **Why:** Cheap to do, de-risks the GSAP path before Phase 2 leans on it heavily.
- **Affected:** `DESIGN_SYSTEM.md` §10.3, `ROADMAP.md` §2.1.

### D-003 — Vitest is part of the stack and `pnpm test`
- **Decision:** Name Vitest explicitly alongside Playwright (`CLAUDE.md` stack + verify); `pnpm test` = Vitest units + Playwright E2E.
- **Why:** The scoring engine and other pure functions need fast unit tests; `CLAUDE.md` had under-stated this.
- **Affected:** `CLAUDE.md`.

### D-002 — Standardize the file-size re-check threshold at ~250 lines
- **Decision:** Use ~250 lines across all docs as a soft "re-check responsibilities" signal (not a hard limit).
- **Why:** `CLAUDE.md` said ~200 and `ARCHITECTURE.md` said ~250; one number, framed as steering against drift.
- **Affected:** `CLAUDE.md`.

### D-001 — Innovator archetype max = 27; scoring normalizes per archetype
- **Decision:** The Innovator weight column sums to **27** (not the previously stated 24). Document the true sums (Builder 22 / Innovator 27 / Architect 25) and the fact that maxes need not be equal.
- **Why:** The scoring engine normalizes each archetype against its **own** max (`raw[A]/max[A]*100`), so unequal maxes don't favor any archetype. The "balanced maxes" claim was both numerically wrong and conceptually unnecessary. Chose to fix the docs, not re-tune 24 weights (it's a prototype; the dev team owns real tuning).
- **Alternatives:** Re-tune weights so Innovator = 24/25 (rejected — busywork with no scoring benefit).
- **Affected:** `DATA_MODEL.md` §3 (×2) + §15; relevant to Phase 0 `items.ts` + the Vitest sanity check.
