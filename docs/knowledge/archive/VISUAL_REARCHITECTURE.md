# Plan: Dark visual re-architecture of the narrative quiz (Claude Design → explore_floor)

> **ARCHIVED 2026-07-01 — step 8 is COMPLETE (all phases 0/A–G shipped, green).** Kept as the phase-by-phase **build log + decision record** (the 23-question design rationale) for the handoff and portfolio case study. Its still-live successors: deferred polish → `../DEFERRED_DIRECTIONS.md`; ARM-owned gaps → `../HANDOFF_GUIDE.md`; the data-request template → `../../reference/Job_Program_Data_Request.md`. Live state: `../STATUS.md`.
> **Status (historical):** Plan of record for the visual re-architecture. This is "step 8" of the realignment (the high-fidelity narrative results screen + a dark re-skin of the whole flow), made concrete against the Claude Design mockup.
> **Original home:** was `docs/knowledge/VISUAL_REARCHITECTURE.md`; moved to `archive/` on completion. A working copy was authored in plan mode at `~/.claude/plans/we-have-been-working-fizzy-horizon.md`.
> **Source mockup:** Claude Design project `Interest Quiz CD Prototype` (`df8d5f31-2435-4a09-9382-6af1d62f9b59`), file `design_handoff_quiz_to_results/Quiz to Results.dc.html` + its `README.md`. Read via the `DesignSync` MCP (read-only).

---

## 1. Context — why we're doing this

The realignment (Phases 4–5, done) stripped the build to the narrative quiz only and collapsed the four study categories to ARM's three published roles (Technician / Specialist / Integrator). `REALIGNMENT.md` parked one box unopened: **"build the high-fidelity narrative results screen from the Claude Design work, on the now-aligned tokens."** That box is this plan.

In parallel, Caelan built a detailed mockup in Claude Design that goes well beyond a results screen: it re-skins the entire experience to a **dark theme** matching ARM's live **My Match** flow, and expands the results from our single node-map into a **five-screen results system** (role cards → compare → ambient bubble map → per-role job constellation → job overview). A lot of intentional design decisions live in that mockup that we want to carry over faithfully.

The outcome we want: the live quiz, end to end, re-skinned to the dark ARM design language and built out to the mockup's full results experience, on our real content and our three-role model, ready for the late-July Fivestar handoff. The mockup is the visual/interaction source of truth; **our content and data model are the ground truth** (the mockup's quiz copy and four-path data are placeholder).

---

## 2. The target experience (7 screens)

| # | Screen | What it is | Maps to our current build |
|---|---|---|---|
| 1 | **Intro screeners** | Our 6 intro MC questions (Q0–Q5), one per view, auto-advance, dark question card + answer rows | `Flow/MCQuestion` re-skinned |
| 2 | **Day-in-the-life scenes** | Our 7 scenes; each shows its 3 choices **one at a time** as a rating card sliding in, rated into the 3 buckets | `Flow/SceneSortView` + `BucketSort` re-skinned |
| 3 | **Results — role cards** | Headline results: per-role hero (match %, salary, education, signal bars), tabs (The Role / Skills+Path+Next Steps), inline **"why you matched"**, prev/next through ranked roles | Replaces/absorbs `Results/category` node-map as the headline |
| 4 | **Results — compare** | Side-by-side two-role comparison, dropdown to switch target, swap | New |
| 5 | **Results — map** | Full-bleed dark canvas, subtle ambient dots, role **bubbles** sized by match %, click to dive into a role | New (conceptual cousin of today's node-map) |
| 6 | **Results — constellation + job overlay** | For a chosen role, 4 related **jobs as nodes** around a center; click a node → job summary side-panel | New — **needs sourced job data** |
| 7 | **Results — job overview** | Full job page: description, responsibilities, skills, bridge programs, tabs | New — **needs sourced job data** |

**Scope decision (confirmed):** build **all five** results screens, faithfully. Constellation + job-overview depend on per-role job and bridge-program data we don't have yet; Caelan will source it from ARM (template in §8). Until it lands, those screens are built against plausible placeholder data and swapped later.

---

## 3. Ground rules (locked decisions)

These are settled — do not relitigate while executing.

1. **Our question set is ground truth.** Keep the real 6 intro questions + 7 scenes from `narrativeFlow.ts`. The mockup's "5 generic screeners" and placeholder scene copy are **not** carried over. The mockup governs *visual treatment and interaction style only*.
2. **Three roles, never four.** Technician / Specialist / Integrator. The mockup's four paths (Program/Operate/Repair/Plan) collapse per the existing mapping: Operate+Repair → **Technician**, Program → **Specialist**, Plan → **Integrator**.
3. **Role palette = kit-only gold / teal / orange.** Technician = **gold `#FFB81C`**, Specialist = **teal `#117289`**, Integrator = **orange `#BF5309`**. This mirrors the mockup's mapping (Operate→gold, Program→teal, Plan→orange), uses only existing ARM-kit colors, and **retires `arm-blue`** (which fails AA and was always a temp holdout). The mockup's green (Repair) is dropped.
4. **Click-to-select; drag stays dormant.** Scenes are rated via click rows (the mockup's `.qf-rate` pattern). Leave `DragSortCard` / `DropZone` drag code in place but unused — it may return in the final implementation. _(**Superseded 2026-07-01, D-031:** `DragSortCard`/`DropZone` were removed as dead code — zero importers, zero tests, so "tested-enough to revive" was never met. The rater stays click-only; a drag revival would be a fresh build.)_
5. **Tokens: local dark set now; shared package later.** Author the dark palette directly in `explore_floor`'s `globals.css`. Keep the existing light tokens present but unused by the quiz; the quiz renders **dark-only, no theme toggle**. The shared `rc-design-system` package (`REALIGNMENT.md` §10) is deferred until after this prototype ships.
6. **Grey ramp is additive, but never duplicate an existing token.** Build one coherent dark neutral ramp from ARM's site greys + the greys/whites/blacks already in `globals.css`. Reuse the existing token wherever the value is already present — `#595959` = `--color-text-subtle`, `#757575` = `--color-text-faint`, `#262626` = `--color-near-black`, plus `--color-white` / `--color-black` — and **only add genuinely-new values**, which here are just `#1B1B1B` and `#292929`. Replace the mockup's slightly-off greys (`#181818`/`#1a1a1c`/`#1e1e20`) with this ramp where they're close. (Semantic dark-surface naming is fine, but don't create a second token that holds a hex an existing token already holds.)
7. **Motion: subtle and tasteful.** Buttons get a little life; sheets expand/collapse naturally; the map's ambient dots are gentle. Not over the top. Respect `prefers-reduced-motion`. Keep the Motion-vs-GSAP ownership rule (`scene-motion` skill).
8. **No ALL-CAPS / uppercase eyebrows or stat labels.** Sentence case for kickers and "Salary"/"Education" labels (per the mockup project's own `CLAUDE.md`). One exception in the mockup ("What you passed on" eyebrow) — snap it to sentence case too.
9. **Don't carry the mockup's runtime.** `support.js` and its `<x-dc>`/`<sc-if>`/`<sc-for>` syntax are reference-only. Rebuild idiomatically in React/Tailwind/Motion.
10. **Don't build what's out of scope** (per repo `CLAUDE.md`): no auth/backend/real API, no SkillsMatch wiring, no 3D, no professional track. All data stays local/mocked.

---

## 4. Token strategy (the dark design system)

All tokens live in the `@theme` block of `src/styles/globals.css` (Tailwind v4, CSS-first). Spacing, radius, type scale, shadows, and motion tokens **already match** the mockup's system (4/8 grid, Montserrat/Roboto, `cubic-bezier(0.25,0.46,0.45,0.94)` = our `--ease-soft`); leave them and reuse. The work is the **color layer** + **glass** + **fonts**.

**Dark neutral ramp (reuse existing tokens; add only the two genuinely-new values):**
- Canvas / page background: **`#1B1B1B` — NEW token** (replaces mockup `#181818`).
- Elevated surface / cards: **`#292929` — NEW token**; deeper panel / app-header reuse **`#262626`** (existing `--color-near-black`).
- Hairline borders & muted strokes: reuse **`#595959`** (`--color-text-subtle`) and **`#757575`** (`--color-text-faint`) — already in the system, do not re-add.
- Text on dark (add an off-white ramp — not currently in the system): primary `#F2F4F5` / `#FAFAFA`, secondary `#C4C8CC`, muted `#9AA0A5` / `#6F6F6F`.
- Reuse `--color-white` / `--color-black` as-is.
- So the only genuinely-new neutral hexes are `#1B1B1B`, `#292929`, and the off-white text ramp; everything else is an existing token (optionally given a semantic dark alias, but never a duplicate value).

**Glass / transparency (add as tokens, this is how we keep the design from going flat-and-ugly on a 4-grey palette):**
- Subtle fills: `rgba(255,255,255,0.035–0.06)` (cards, answer rows).
- Hairline borders: `rgba(255,255,255,0.07–0.14)`.
- Backdrop blur utilities: `blur(8px)` (sticky control bars), `blur(14px)` (map result card). Panel-tinted glass `rgba(30,30,32,0.85)`.
- Soft elevation shadow: `0 20px 70px rgba(0,0,0,0.35)` (results panel), `0 10px 40px rgba(0,0,0,0.28)` (modal/map cards).

**Role accents (gold/teal/orange), each needs three derivatives like the mockup:**
- `accent` (the brand hex), `accentSoft` (a lighter tint for role names/large text on dark — saturated brand colors are illegible as big text on `#1B1B1B`; mockup uses e.g. teal-soft `rgb(127,224,242)`), `onAccent` (text color when the accent is a fill — dark `#262626` on gold, white on teal/orange), and a `glow` rgba for bubbles/nodes.
- Update `src/components/categoryAccent.ts` (`CATEGORY_ACCENT_TEXT`) from gold/blue/teal → gold/teal/orange, and extend it to expose `accentSoft` / `onAccent` / `glow`.

**Fonts (currently only system fallbacks are loaded — real fonts are missing):**
- Load **Montserrat** (700, plus 500/600) and **Roboto** (400/500/700) and **Material Icons** (or swap to an icon set already in the repo). Prefer local `woff2` in `/public/fonts/` (the CD project bundles them under `_ds/.../fonts/`) with `@font-face`, over CDN, for offline determinism.

**Landing scene tokens:** the `--color-scene-*` tokens (used only by `LandingSceneHint`) become removable once the Landing hero is redesigned dark (Phase A). Decide then whether the line-art hint survives in a dark treatment or is replaced.

---

## 5. Architecture approach

- **Routing stays coarse; results get an internal state machine.** Keep React Router routes (`/`, `/flow`, `/results`, `/select`). Implement the five results views (cards / compare / map / constellation / job-overview) as an **internal view state** within `Results`, mirroring the mockup's single-component-with-`screen`-state, transitioned with Motion `AnimatePresence`. Add a small `useResultsNav` store (or local state) for `view`, `roleIndex`, `compareWith`, `jobIndex`, `activeTab`, `expanded`. Do **not** reuse the mockup's `localStorage['etf_combined_nav']` persistence.
- **Reuse the brain unchanged.** `lib/categoryScoring.ts`, `lib/screenerFit.ts`, `lib/categoryBreakdown.ts`, `lib/nodeLayout.ts` stay pure and mostly as-is. `categoryBreakdown.ts` (kept unwired since Phase 4) finally gets wired into the "why you matched" UI.
- **App shell / header is new.** The mockup has a fixed 60px app-header (RC logo, a search affordance, a user pill "Jordan") on every screen. Build a real `AppHeader` shell. The search + user pill are **placeholder chrome** — render a simplified, honest version (logo + minimal account stub, no fake search results). Flag for confirmation (§9).
- **Data: enrich `roleDetails`, add jobs + programs.** `roleDetails.ts` needs enriching toward the hero/tabs shape (duties as `{heading, text}`, "skills you'll build", a path-up framing, "why you matched" copy hooks). New data files for per-role **jobs** (the constellation + job-overview) and **bridge programs**. All authored under `src/data` per the `data-author` discipline; `data-integrity.test.ts` extended to cover the new shapes.
- **Components to add** (rough): `AppHeader`, `ResultsPanel` (the rounded panel + sticky control bar), `RoleHero`, `SignalBars`, `WhyYouMatched` (collapsed/expanded), `Tabs`, `CompareColumns` + `CompareTargetMenu`, `BubbleMap` + `AmbientField`, `JobConstellation` + `JobSidePanel`, `JobOverview`, `StatBox` (salary/education), `ProgramRow`, `SkillChip`. Reuse existing `Button`, `ProgressBar`, `SegmentedControl`.

---

## 6. Phases

Short phases, sequenced so the data-dependent screens come last (giving ARM time to fill the template). Each phase ends green (lint + typecheck + unit + E2E) and, for visual phases, a `/design-review` against the rubrics. **Per-phase "confirm before building" flags** are called out; the full question list is §9.

### Phase 0 — Data request + plan landing (tiny, do first)
- Drop this plan into the repo (`docs/knowledge/VISUAL_REARCHITECTURE.md`), link from `STATUS.md`.
- Hand Caelan the **data-request template** (§8) so ARM sourcing starts now, in parallel with Phases A–E.
- Author a new design rubric stub or extend `docs/rubrics/results-screen.md` to cover the dark system + the 5 result screens.

### Phase A — Dark token foundation, fonts, app shell, Landing
- Author the dark palette + glass tokens + role accents in `globals.css`; update `categoryAccent.ts`; retire `arm-blue`.
- Load Montserrat / Roboto / Material Icons.
- Build the `AppHeader` shell + dark canvas; wire it across routes.
- Re-skin **Landing** dark (hero redesign; resolve the `scene/*` hint).
- *Confirm:* final dark neutral values (1B1B1B vs 292929 vs 262626 assignment); whether the Landing line-art scene survives; the header's search/user-pill treatment.
- *Verify:* existing narrative E2E still passes end to end, now dark; reduced-motion spec green.

### Phase B — Quiz re-skin (intro screeners + scenes)
- Re-skin **intro MC** (`MCQuestion`) as the dark question card + answer rows; auto-advance; "Question N of M"; gold hover→fill with dark text.
- Re-skin **scenes** (`SceneSortView` + `BucketSort`) as the scene context card + per-choice rating card that slides in one-at-a-time (3 choices), rated into the 3 buckets; "Scene N of 7" + "Choice N of 3"; gold **Continue** to start each scene's choices.
- Keep bucket labels **That's me / Kinda me / Not me** (intentional, D-018). Leave drag code dormant.
- *Confirm:* slide direction/feel; whether the intro "prompt" lead-in lines map to any of our questions; bucket rows vs the mockup's single-select rating visual.
- *Verify:* narrative E2E updated to the new DOM; scoring unchanged.

### Phase C — Results: role cards (the headline screen) — **DONE (2026-06-29, D-029 Phase C)**
> Built and green (lint, typecheck, 55 unit, 3 E2E, build); graded `/design-review` PASS on system-compliance, 1 p1 + 1 p2 fixed on results-screen, 1 p3 (signal-bar contrast) deferred to Phase G. Handoff `sessions/2026-06-29-phase-C-results-role-cards.md`. **Execution note vs the plan below:** the role name + match % are **neutral on-dark** (not `accentSoft`) — faithful to the mockup, the accent lives in the active signal bar; salary/education moved to Tab 1 stat cards (the hero is name/%/bars/why only); Tab 2 chips are **real ARM competencies** (not generic skills); bridge programs are per-role placeholder pending ARM. Compare/Map are stubbed (Phases D/E) on a `useResultsNav` seam.
- Build `ResultsPanel` (rounded panel + sticky glass control bar), `RoleHero` (role name in accentSoft, match label, **match %**, salary, education, **signal bars** per role), `Tabs` (The Role / Skills+Path+Next Steps), `WhyYouMatched` (inline expand, wired to `categoryBreakdown.ts`), prev/next through ranked roles.
- Land the three **step-8 content goals** here: (1) a one-line plain-language **definition of what the match % means**; (2) frame the **Technician as a starting rung** with a visible path up to Specialist/Integrator + outbound links, not a verdict; (3) the **"why you matched"** provenance from `categoryBreakdown.ts`.
- Resolve the **3-axis radar**: the mockup uses horizontal **signal bars**, not a triangle radar — adopt bars in the hero and retire the degenerate triangle radar (carry the geometry in `nodeLayout.ts` only if the map/constellation still want it).
- Tab 2 surfaces **bridge programs** ("how to bridge the gap" rows) — re-introduces the role-keyed programs set that results lack today.
- *Confirm:* the match-% sentence wording; the path-up framing copy; whether duties become `{heading, text}` (richer than ARM's plain activity bullets) and who writes that copy.
- *Verify:* unit coverage for any new derivation; E2E reaches cards and asserts match % + tab switching.

### Phase D — Results: compare — **DONE (2026-06-30, D-029 Phase D)**
> Built and green (lint, typecheck, **61 unit**, **3 E2E**, build); graded `/design-review` **PASS** on both rubrics (2 p2 fixed, 2 p3 deferred). Handoff `sessions/2026-06-30-phase-D-results-compare.md`. **Execution notes vs the plan below:** the canonical `Quiz to Results.dc.html` compare render is just **back + dropdown + two role columns** — **no swap and no recommendation line** (those fed the *removed* compare-pick chooser the README flags as dead code). Per Caelan's call we **kept "no swap"** and **added a recommendation line** ("Our take") with a **"foreground the lower barrier when close"** framing (not the mockup's higher-%-only `qcRec`). Open question #14 (recommendation logic) is resolved by that rule.
- Built `CompareView` (control bar + two columns + recommendation line), `CompareColumn` (reuses `SignalBars` / `WhyYouMatched` / `StatBox` + description/duties; **no path-up callout** — stays a headline affordance), `CompareTargetMenu` (dropdown to switch the right column among the other roles; current/left role excluded; closes on select/outside/Escape; accent dot + per-row accent check). Extended `useResultsNav` with `compareWith` + per-column `compareExpanded`. New pure `lib/compareRecommendation.ts` (+6 unit tests). Compare copy added to `resultsCopy.cards` (drafted in voice, **signed off by Caelan 2026-06-30 — final**). Did **not** build the removed "compare-pick" chooser.
- *Recommendation rule:* lead with fit (higher match %); when within ~8 pts, foreground the lower-`educationLevel` role as the "start here" option and name the role to grow toward; copy variants `clearWinner` / `closeLowerBarrier` / `closeEqualBarrier`.
- *Deferred (p3 → Phase F/G):* an outbound next-step from compare (currently exits only via Back + dropdown); the rung framing on a Technician-leaning `clearWinner` compare (no path-up on this screen); full dropdown keyboard roving/focus-trap (ARIA + Escape/outside-click present, within `CLAUDE.md` a11y scope).
- *Verified:* narrative E2E opens compare → two columns + recommendation → switch target via dropdown → expand one column independently → back to cards.
- *Post-review polish (same day, Caelan live feedback; see the handoff's "Post-review iteration"):* the **real RC TopNav** ported from the dashboard repo replaced the Phase-A placeholder header (60px solid, real logo, centered search, gold profile pill; new `--spacing-nav` / `--color-gold-deep` / `sliders` icon); the results sheet became a **viewport-height scroll container with a sticky glass header** (top pinned a constant gap below the nav, body scrolls under the glass, bottom revealed at the end with a matching gap, corners clipped clean); **"Our take" moved to the top** of compare; the compare dropdown trigger got the **accent dot**; **salary standardized to the national median** (`RoleDetail.salaryMedian`) for consistent stat-box height; **"Start over" → "Retake quiz"**; and a **dev-only "skip to results"** control (`devSeedResults()`) was added on Landing for fast iteration (**remove at Phase G**).

### Phase E — Results: ambient bubble map — **DONE (2026-06-30, D-029 Phase E)**
> Built and green (lint, typecheck, **65 unit**, **3 E2E**, build); graded `/design-review` **PASS on both rubrics** (`design-system-compliance` + `results-screen`), **zero p1/p2 failures** — only token-hygiene polish, the p2s fixed this session (bubble float + ambient pulse easings snapped to `easings.soft`; the off-scale fluid bubble text + decorative glow/orb literals marked as intentional exceptions with comments, mirroring `AmbientField`). Reduced-motion verified live (float + ambient pulse both pin static). Handoff `sessions/2026-06-30-phase-E-bubble-map.md`. **Decisions locked (AskUserQuestion):** scope = **Phase E only** (constellation/job stay Phase F, ARM-data-dependent); layout = **rank-based** (top match largest, high-centre; 2nd/3rd flank below); **delete** the dead node-map.
- Built `ResultsMap` (`Results/cards/`, `data-testid="results-map"`): a **full-bleed** dark canvas (the `<main>` relaxes its `max-w-lg` rounded panel for the `map` view) with a decorative `AmbientField` behind, a glass "Your results" intro card (title + a plain-language "what the score means" line + a "tap a role" line, all `resultsCopy.cards.map`), a `BubbleField`, and a "Back to your matches" pill.
- `AmbientField`: six large blurred, role-tinted orbs (`var(--color-role-*)`) that slowly breathe (opacity pulse, staggered, **reduced-motion-gated**). Decorative (`aria-hidden`); blur/size/positions are mockup-derived literals with no token home (documented at the site).
- `BubbleField` + pure `lib/bubbleLayout.ts`: the three roles as **bubbles sized by match %**, rank-based (per-rank slot positions, radius scaled by `matchPercentages` between `R_MIN`/`R_MAX`). Each bubble fills with `ROLE_ACCENT.bg`, names role + match % in `onAccent`, carries a soft role `glow`, and floats gently (outer wrapper owns the float so it never fights the inner hover lift). Height-driven sizing so the field always fits the viewport (desktop-first; responsive is Phase G). `bubbleLayout` unit-tested (+4: distinct cats, rank-0 largest, radius monotonic with %, bounds).
- **Dive + loop:** tapping a bubble calls `useResultsNav.diveToRole(rank)` → sets `roleIndex` + `fromMap`, switches to `cards`; the cards control bar then shows a **"Back to the map"** pill (faithful to the mockup's `fromMap` chrome). New `useResultsNav` fields `fromMap` + `diveToRole`.
- **Node-map deleted:** `CategoryResults` / `NodeMap` / `FitNote` removed (the bubble map supersedes them). `FitRadar` + `RoleDetailSheet` + `lib/nodeLayout.ts` stay live in `/select`.
- *Verified:* `narrative` E2E opens the map → 3 bubbles → forced dive into the top match → lands on its card with the Back-to-map pill; `reduced-motion` opens the map (static bubbles) and dives with a normal click.
- *Deferred to Phase G (per review, all p3/cosmetic):* an optional `ambient`/`breathe` duration token for the idle loops (no token home today); the map echoing the cards' "moments" framing for consistency; full responsive (the field is desktop-first).

### Phase F — Results: constellation + job overlay + job overview — **DONE (2026-06-30, D-029 Phase F)**
> Built and green (lint, typecheck, **74 unit**, **3 E2E**, build); graded `/design-review` **PASS on both rubrics, zero p1** (one p2 fixed: node-star glyph contrast; three p3s deferred to Phase G). Handoff `sessions/2026-06-30-phase-F-constellation-job-overview.md`. **Decisions locked (AskUserQuestion):** (1) **distinct per-job placeholder** authored in voice (not the mockup's shared text), marked for ARM swap; (2) the map bubble now **dives into the constellation** (not cards — revises Phase E), and the constellation's "Role overview" → cards; (3) **count-aware** constellation (polar ring, Technician 3 / Specialist 5 / Integrator 5), not the mockup's fixed 4 corners. _(**Superseded 2026-06-30** in the results-quiz-polish pass: the ring is now a **fixed 4/4/4** — four featured jobs per role — restoring the mockup's four-corner balance. Technician gained a 4th title (`technician-robotics-maintenance-technician`, flagged for ARM confirmation); Specialist + Integrator each feature 4 of ARM's 5. See `jobs.ts` and `docs/reference/Job_Program_Data_Request.md`.)_
- Built `ResultsConstellation` (full-bleed shell: `AmbientField` behind + a 404px glass `JobSidePanel` + `ConstellationField` beside it), `ConstellationField` (% renderer: dashed center→node edges, accent-filled role center, nodes + labels), `ConstellationNode` (circular star button; outer float / inner hover; active fill+glow, others dim), `JobSidePanel` (one shell, two bodies swapped by an inner `AnimatePresence` — role summary on `selected`, job summary on `job`), `JobOverview` (reuses `ResultsPanel`; **local** tab state; 3 tabs: overview / skills+competencies+bridge programs / "how you fit" + trajectory), `TrajectoryViz` (static Technician→Specialist→Integrator ladder, current role lit), `EducationList` (extracted, shared). Pure `lib/constellationLayout.ts` (count-aware polar; reuses `polarPoint`, **not** `fanPoints`; +7 tests). New `Job` type + `src/data/jobs.ts` (4/4/4 placeholder — see the Phase-F count note above) + `ResultsExploreCopy`. `useResultsNav` gained `selectedJob` + `openConstellation`/`openJob`/`openJobOverview`/`backToConstellation`/`backToJob`/`roleOverview` (and dropped `diveToRole`). `--container-constellation`/`--container-job-panel` tokens.
- **One mounted shell:** `selected`+`job` are a single keyed `motion.div` (`key="constellation"`) in `ResultsExperience`, so the constellation never remounts between them; only the panel body swaps. `selected`/`job` join `map` in the full-bleed `<main>` branch; `job-overview` stays in the rounded scroll panel.
- *Data:* per-job content is **placeholder** pending ARM (the `Job_Program_Data_Request.md` per-job blocks); titles are real (from `commonJobTitles`). `data-integrity` covers the job shapes (counts 4/4/4, non-empty fields, unique ids) + the `explore` copy block.
- *Deferred to Phase G (per review, all p3/cosmetic):* a side-panel "from N of your answers" %-caption; the rung framing surfacing earlier than the overview tab; the gold-reserved co-occurrence note (Technician path); full responsive (constellation is desktop-first, like the map).

### Phase G — Polish, motion, responsive, a11y, review
- Tune Motion across the flow (button life, sheet expand/collapse, screen transitions); finalize reduced-motion behavior.
  - **Already landed (2026-06-29 quiz-fidelity pass, post-Phase-B; see `sessions/2026-06-29-quiz-fidelity-back-slide-morph.md`):** the scene **slide-up morph** (Continue compresses the scene card and reveals the choices, sliding it up via the centered column), the flow-step **horizontal slide** + **selected-row gold-hold through the exit** (the "stays lit to show state" convention), and a persistent **Back** affordance (branch-aware reverse traversal with prior picks pre-lit). All reduced-motion-gated and green. **Still do at G:** a fresh look at whether the morph/slide can go further (the mockup also slides the *first choice card* in after the reveal settles, vs our simultaneous reveal), directional slide on Back vs forward (we match the mockup's single direction today), and any other motion polish across the flow. Don't treat the motion bullet as closed.
- Mobile/tablet responsiveness (the mockup is desktop 1400px — define the responsive story for each screen); 44px touch targets.
- Light a11y (keyboard nav, AA contrast on the new dark palette, `aria-label`s, focus states).
- **Remove the dev-only "skip to results" control** (Landing `import.meta.env.DEV` button + the `devSeedResults()` store action, added 2026-06-30 for fast results iteration). It's already stripped from production builds, but delete it for the handoff.
- Final graded `/design-review`; `/phase-check`; `/compound` a session note + any new decisions (palette, dark system, results architecture).
- Optionally `/capture-figma` the final screens if the team wants them in the Figma handoff.

---

## 7. Verification (end-to-end)

- Gate every phase: `pnpm dev` clean, `pnpm lint`, `pnpm typecheck`, `pnpm test` (Vitest units incl. `data-integrity` + Playwright `narrative` / `role-select` / `reduced-motion`).
- Update the E2E specs as the DOM changes each phase; keep the data-integrity invariants (7 scenes × 3 choices, `expectedCategoryMax {11,11,11}`, unique ids, forward-only branches, three distinct roles).
- Use Playwright screenshots + the `design-reviewer` subagent (`/design-review`) for every visual phase rather than asking for manual checks.
- Confirm `prefers-reduced-motion` neutralizes the ambient field, slides, and hovers without breaking interaction.

---

## 8. Data-request template (hand to ARM) — *lift into its own file*

> **This template was lifted to `docs/reference/Job_Program_Data_Request.md` (the live version handed to ARM).** That copy is now **4 featured jobs per role (4/4/4)**, not the "3–4" the snapshot below still says — see its 2026-06-30 note. Treat the file as canonical; the snapshot below is kept for context only.

> Everything below is what we need to build the constellation + job-overview screens with real content. Role-level fields (description, activities, education, salary, competencies) are already captured in `docs/reference/ARM Updated Role Structure - Source Content.md`; this template asks only for the **per-job detail** and **bridge programs** that the role pages don't include. Where ARM can't provide a field, we'll write plausible placeholder and mark it for replacement.

```markdown
# Job + Program Content for the Quiz Results Build

For each of the three roles, we list ARM's published common job titles. For each
job we need a short, plain-language detail block (9th-grade reading level, no jargon),
plus a few bridge-training programs per role. Leave blanks where unknown.

## Role: Robotics Technician (entry)
Common job titles (from ARM): Robot Operator, Entry Level Robotics, Assembly Operator
For EACH job title above (pick the 3–4 you want featured):
- Job title:
- One-line summary (what this person does):
- 3–5 key responsibilities (short bullets):
- 4–6 skills used (short chips):
- Typical salary or range (if different from the role median $45,936/yr):
- Education / entry requirement (if different from HS/GED):

Bridge-training programs for Technician (2–3):
- Program name:
- Provider / school:
- What it covers (1 line):
- Length / format (if known):
- Link (if any):

## Role: Robotics Specialist (mid)
Common job titles (from ARM): Robotics Specialist, Robotics Engineer, Mechatronics
Engineer, Automation Engineer, Robotic Systems Engineer
[same per-job fields as above for the 3–4 featured]
[same bridge-program block, 2–3 programs]

## Role: Robotics Integrator (planning)
Common job titles (from ARM): Robotics Integrator, Robotic Integration Design Engineer,
Robotics Software Integrator, Robotics Application Development Engineer, Advanced
Industrial Integrator
[same per-job fields as above for the 3–4 featured]
[same bridge-program block, 2–3 programs]

## Cross-cutting (optional)
- Any real bridge programs ARM wants featured by name (the mockup used placeholders
  like "Lorain County Community College" — confirm or replace).
- Anything that should NOT appear (titles/programs to avoid).
```

---

## 9. Open questions (for Caelan, organized by where they bite)

These don't block starting Phase A; answer as we reach each phase. The big structural ones (scope, palette, tokens) are already settled (§3).

### Tokens / system (Phase A)
1. Final assignment of the dark ramp: canvas `#1B1B1B` vs `#181818`; cards on `#292929` vs `#262626`; header `#262626` — confirm the exact three or let `/design-review` tune them?
2. Off-white text ramp: adopt the mockup's `#F2F4F5 / #C4C8CC / #9AA0A5`, or derive from existing tokens?
3. `accentSoft` tints for role names on dark — pick now (gold-soft, teal-soft `rgb(127,224,242)`, orange-soft) or tune in review?
4. Fonts: local `woff2` (pull from the CD bundle) vs Google CDN? Material Icons vs an existing icon set?

### App shell (Phase A)
5. The header search bar + user pill ("Jordan", gold avatar) are placeholder. Render a minimal honest header (logo only? logo + stub account?), or keep a non-functional search affordance for fidelity?
6. Does the Landing line-art `LandingSceneHint` survive in dark, get a new dark hero, or get removed?

### Quiz re-skin (Phase B)
7. The mockup's per-scene optional "prompt" lead-in and the "Continue to reveal choices" intro state — keep that two-beat (context card → Continue → rating cards), or go straight to the first choice?
8. Bucket rating UI: the mockup shows a single highlighted selection per row; we sort into 3 buckets. Confirm the three buckets remain visible per choice (That's me / Kinda me / Not me) styled as the mockup's gold rating rows.

### Results — cards (Phase C)
9. **The match-% sentence.** What does "80% match" mean, in one plain line a teen reads? (The #1 content gap from testing.) Need the wording.
10. **Technician-as-rung framing.** Confirm the copy/treatment that frames the entry result as a starting point with a path up (Operator landed two testers "deflated").
11. Duties shape: author richer `{heading, text}` duty blurbs (like the mockup) or keep ARM's plain activity bullets? Who writes the new copy?
12. The signal bars: what are the per-role "signals" labeled (salary / education / interests / scenes)? Confirm the 3–4 bars and their source.
13. "Why you matched" expanded layout (numbered 01/02/03 sections + "what you chose" chips + "what you passed on") — carry the full structure, or a trimmed version?

### Results — compare (Phase D)
14. The recommendation line: what logic decides which role is "recommended" in a head-to-head (higher %, better fit, lower barrier)?

### Results — map (Phase E)
15. Three bubbles instead of four — confirm layout/positions; bubble size strictly by match %?
16. Clicking a bubble routes to that role's **cards** view or straight to its **constellation**?
17. Keep or retire the current node-map entirely once cards + bubble map exist?

### Results — constellation + jobs (Phase F)
18. Jobs per role on the constellation: 3? 4? Which titles featured (ARM lists 3/5/5)? _(Resolved 2026-06-30: **4 per role — 4/4/4**, restoring the mockup's four-corner ring.)_
19. Placeholder vs real data timing — proceed with placeholder if ARM data hasn't landed by Phase F?
20. Job-overview "next steps" CTA — where does it point (it can't wire to real ARM/SkillsMatch per scope; a stub link?)?

### Cross-cutting
21. Responsive story: the mockup is desktop-1400px. How important is mobile for the handoff/testing — full responsive each screen, or desktop-first with graceful degradation?
22. Any mockup copy that's **intentional** (vs placeholder) we must preserve verbatim? (Default assumption per §3: our content is ground truth, mockup copy is placeholder — call out exceptions.)
23. Should a `/compound decision` be logged for the palette (gold/teal/orange, retire arm-blue) and the dark-system call now or at Phase A?

---

## 10. Risks / watch-items

- **Data dependency (Phase F).** Constellation + job-overview need sourced content; mitigated by the §8 template handed out at Phase 0 and a placeholder fallback.
- **Palette legibility.** Saturated gold/teal/orange as large text on `#1B1B1B` needs the `accentSoft` tints; verify AA on every accent-on-dark pairing in Phase A.
- **E2E churn.** Each visual phase rewrites DOM the specs assert on — budget spec updates into every phase, don't let them drift.
- **Scope creep into the app shell.** The header's search/account are placeholder; resist building real chrome (no auth/backend per `CLAUDE.md`).
- **Old node-map.** Decide its fate explicitly (Phase E) so it doesn't linger half-wired.
- **Drag code dormancy.** Keep `DragSortCard`/`DropZone`/`BucketSort` drag paths compiling and tested-enough to revive, even though the UI is click-only. _(Superseded 2026-07-01, D-031: `DragSortCard`/`DropZone` removed as dead code; `BucketSort` stays click-only.)_
