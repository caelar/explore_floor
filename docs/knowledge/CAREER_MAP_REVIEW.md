# Career Map Review (pre-merge ledger)

**Status: merge HELD.** This is the working ledger for landing Kayla's `visuals` + `career-map` work. We reviewed the merged build screen by screen against the old results flow and traced every issue to code. The verdict: the map concept and visual direction are an upgrade (the constellation motif carried no meaning), but several execution choices regressed readability, wayfinding, and information encoding. We fix inside her framework, we don't roll back.

Created 2026-07-17 from Caelan's visual review plus a code trace of `origin/career-map` (`5f80fd9`, on top of `9a1b4c4` / `4490cc4`). Work through this ledger in the next session, tick items as they land, then merge.

## Where things stand

- `origin/visuals` and `origin/career-map` share the scene-visuals commits; `career-map` adds the map commit on top. Merging `career-map` brings both.
- The reconciled trial merge lives on local branch **`career-map-merge`** (currently checked out in this repo). All gates pass on it: lint clean (zero warnings), typecheck clean, 107/107 unit tests, 4/4 Playwright specs.
- **Pass 0 landed (2026-07-17):** CM-04, CM-08 (halo; nudges assessed unnecessary, see item), CM-09 (copy portion), CM-14, CM-15, CM-17, CM-18 all closed on `career-map-merge`, gates re-run green.
- Conflict reconciliation already applied there: main's componentization kept (control-height tokens, directional step slide, `max-w-read`), Kayla's features kept, plus an eslint import-sort autofix. One deliberate exception is logged as CM-04 (header) and one as CM-16 (hero button).
- Original main is viewable side by side via the scratchpad worktree (detached at `1a0fbad`).

## Figma references

- Glass treatment target: Quiz-Sketches-Assets, node `238-242` (https://www.figma.com/design/TljHunsJr8ReKNEOCAGcUZ/Quiz-Sketches-Assets?node-id=238-242). Heavy white frost with real opacity and blur, no dark veil, selected answer goes solid gold.
- Kayla's original map mockup: RC.org Prototype, node `1289-394` (https://www.figma.com/design/k3AjijocJEmzrvlKTd9vJM/RC.org-Prototype?node-id=1289-394). Distinct hub icons (arm / code brackets / clipboard) and the two tied 30% roles rendered at equal size. Neither survived into code.

## What we keep as-is

The map metaphor and the one-continuous-space zoom ladder. The loading interstitial (visual motif of what's coming, tabulating copy, all of it works). Character select. The scene backgrounds, character, and thought-bubble concept. The target-role marker (seed of the outcome-tracking story). Cross-tier trajectory data and the job panel content. Her new unit tests and migrated e2e specs.

---

## Issue ledger

Severity: **H** breaks comprehension or trust, **M** hurts quality or consistency, **L** polish.

### A. Readability and the surface system

**CM-01 (H) Glass cards are near-invisible over illustrations.**
`--color-glass-fill` is white at 4.5% opacity, designed for the flat near-black canvas. Over an illustration it reads as text floating on the image. Kayla's own CharacterSelect cards and job panel use `glass-fill-strong` plus `backdrop-blur-panel`; the quiz cards use plain `glass-fill` with no blur, so the system is inconsistent inside the branch itself. The Figma target (node 238-242 above) carries contrast in the card, not in a veil: heavy white frost, readable text, solid gold selected state.
*Resolve:* canvas board with iterations along four axes (fill opacity, blur strength, inner scrim, veil strength behind), including the Figma treatment as one candidate. Winner becomes a new token tier (glass-on-image) in `globals.css`, not per-screen literals. Team discussion feeds this (see CM-02).

**CM-02 (M) MC questions sit on the landing factory background.**
`FlowRunner` gives MC steps `LANDING_BG` with a `near-black/50` veil, so the first questions visually repeat the landing and the screener never reads as its own chapter. Open question: keep MC steps on the plain dark canvas so the scene illustrations land as an arrival.
*Resolve:* team discussion, together with this critique feedback we already had in hand:
- "Are you planning on going to college" needs an **unsure** option.
- Standing question on why we keep the last two screeners; candidate replacement is the AI sort screeners, at some point.
- Add a screen that marks the transition from screener to narrative, and richer status copy saying what part of the quiz you're in and how far along, more than just the numbers.

**CM-03 (M) The flow Back button needs a platter.**
A bare text button at the bottom of an illustrated scene has no surface. Give it the same treatment the board picks for CM-01 (small glass platter consistent with the DS).
*Resolve:* code pass after CM-01 lands.

### B. System consistency

**CM-04 (M) The header went full-bleed.** ☑ **Done (Pass 0).**
Kayla removed `mx-auto max-w-lg` (1248px column) from AppHeader, so logo and profile hug the viewport edges. The constrained container was a purposeful decision and mirrors the dashboard repo's TopNav; the prototypes need to match each other above all.
*Resolve:* code pass, revert to the constrained container. Mention to Kayla (it also silently diverges from the shared TopNav master in Figma).
*Landed:* `mx-auto max-w-lg` restored on the AppHeader container; her inner search wrapper kept (centers identically once the column is capped). The mention-to-Kayla item stays open under Team discussion.

### C. Map information design

**CM-05 (H) Role orb size no longer encodes match %.**
`careerMapRoles(ranking, _matchPercentages)` ignores the percentages; the three clusters are fixed Figma geometry sized by rank slot. Two roles tied at 73% render at very different sizes, which falsely encodes a difference. Kayla's own mockup rendered tied roles at equal size, so the build diverges from the mockup too.
*Resolve:* canvas board. Caelan leans toward something closer to the old orbs, larger in the foreground with the dashed lines coming off them, possibly with the outlying job dots hidden or dimmed at landing so the main orbs can grow. Hard requirement whatever wins: equal percentages read equal.

**CM-06 (H) Job orbs at overview are unlabeled identical dots.**
Labels are zoom-driven (`jobLabelOpacityFromZoom`), a nice flourish in theory, but at landing zoom the user sees roughly twelve anonymous dots. All hubs share one robot-arm glyph, so the icons differentiate nothing (the mockup had distinct icons per role).
*Resolve:* hover label at the very least (with the caveat that hover doesn't exist on touch, so hover alone can't be the answer). Board the compromise: dim or hide job dots at overview (full semantic zoom), or show labels for the nearest few, balanced against the "dropping into the map" reveal we like. Port the distinct hub icons from the mockup, or drop icons entirely.

**CM-07 (M) The directions card vanishes on first touch and never returns.**
Any pan or zoom-in fires `notifyExplore` which dismisses the intro card; it only resets when the phase re-enters overview. The card houses the instructions, so one over-excited scroll and a new user is lost. Working direction (first pass, to refine): the card collapses into a persistent **?** pill rather than vanishing, so there's always a way back to the directions; optionally one settle-based re-expand at overview zoom (camera idle for a beat, still near fit-zoom, nothing selected), capped at once so it never nags; never re-block the map at role/job zoom.
*Resolve:* short design discussion in session, then code pass.

**CM-08 (L, but we care) Labels collide with dashed edges.** ☑ **Done (Pass 0) — halo only; nudges judged unnecessary.**
"Assembly Operator" has an edge running through it. Fixed art plus fixed label anchors, no collision handling.
*Resolve:* code pass. Dark halo/scrim behind label text so edges passing underneath stop fighting the type, plus nudge the worst anchors in `careerMapArt.ts`. No collision engine needed.
*Landed:* near-black halo (4-layer text-shadow, token-bound) on every job label. Surveyed all three clusters at role zoom: exactly two slots have an edge bisecting their label (`second.jobs[0]`, `third.jobs[2]` — both a vertical segment entering the orb from below). The halo hides the line completely behind the text in both, and a nudge big enough to clear it (~55vb) would detach the label from its orb, so no nudges applied. `labelDx`/`labelDy` plumbing exists in `careerMapArt.ts` → `careerMapLayout` → the label span if the board review overrules this.

### D. Map navigation and wayfinding

**CM-09 (H) The back control changes label, meaning, and mechanic per phase.** ◐ **Copy portion done (Pass 0); affordance rework waits on the CM-10/11 board.**
Overview shows "Back to {role}" which actually exits to the results cards; role zoom shows "Back to the map"; job zoom has no back control at all (the panel's X does it). "Back to Integrator" reads like a zoom action, not an exit.
*Resolve:* code pass. Stable exit affordance with honest copy ("Back to your results"), a separate phase-local back, both on a platter consistent with the DS. Feeds the boards for CM-10/11.
*Landed so far:* new `backToResults` copy key ("Back to your results") on the overview exit control, replacing the misleading "Back to {role}". Platter + stable exit/phase-back split still open.

**CM-10 (H) Role zoom lost all persistent context.**
The old constellation kept a side panel mounted: role name and summary (where you are), the job list (what you can do next), and a way back. The new role zoom is orbs in space with a floating text link. The old convention was better wayfinding, and the map can keep its continuous-space feel while regaining it.
*Resolve:* canvas board. Leading candidate: a slim context rail on role/job zoom listing the role and its jobs, click to zoom. Explicitly not a wholesale restore of the old panel; the bar is persistent orientation.

**CM-11 (M) Panel plus map layout compromises the cluster.**
With the job panel docked, seeing all four job orbs means shrinking everything or breaking the map's spacing.
*Resolve:* same board as CM-10. Options to draw: panel-aware camera (fit the cluster into the viewport space the panel leaves), overlay panel, bottom sheet, or restoring a full job page (see CM-12).

**CM-12 (M) No full-screen job view.**
Roles get a full-bleed cards treatment; jobs used to have their own overview page and now max out at a docked panel. Breaks the established convention without a stated reason.
*Resolve:* expand affordance on the panel, or a deliberate decision that jobs stay panel-only, recorded in DECISIONS.md.

**CM-13 (M) "Explore careers" is ambiguous at the moment it appears.**
The user doesn't know what the map is yet. The real progression is: you're looking at the high-level roles, then you explore the jobs on those paths. The CTA and the intro card should carry that (the mockup's intro copy already did: "Tap any circle to explore the path and the jobs inside it"). No onboarding slides.
*Resolve:* copy pass on the CTA, the intro card, and the CM-09 exit label, framed around the roles-then-jobs progression.

### E. Technical debt from the merge trial

**CM-14 (M)** ☑ **Done (Pass 0).** `narrative.spec.ts` job-orb click is a race: `click({ force: true })` can fire mid-camera-zoom and miss (observed once, passed on rerun). Wait for the zoom to settle before clicking. *Landed:* a `cameraSettled` helper (bounding-box stable across two 200ms polls) now guards both the role-bubble click (the map opens with an entrance glide too) and the job-orb click.
**CM-15 (L)** ☑ **Done (Pass 0).** `CareerMapField.tsx:370` has a `react-hooks/exhaustive-deps` warning (`notifyExplore`). *Landed:* `notifyExplore` + `cancelCameraAnimation` memoized with `useCallback`, effect deps corrected; lint is zero-warning.
**CM-16 (M)** Kayla's `hero` Button variant (20px radius pill, Figma 1368:450) vs the shared `CtaButton` (D-049). The trial merge kept hers on the redesigned landing. Needs a componentization-registry ruling: new CtaButton variant, or a one-off with a logged reason.
**CM-17 (L)** ☑ **Done (Pass 0).** `AmbientField` reintroduces local breathe constants where main had tokenized `breathe` in `motion.ts`, and hardcodes the three role accent hexes. Rebind to tokens. *Landed:* loop durations tokenized (`breathe.orb` retimed 7→18 per her feel, new `breathe.orbPulse` 23); colors rebound to `var(--color-role-*)` (the focus color shift still animates — verified in-browser). The 1.4s focus shift stays local as a one-shot transition, not a breathe loop.
**CM-18 (M)** ☑ **Done (Pass 0).** Asset weight: `scene-1.png` is 12.9MB (others ~3MB), `landing-bg.png` 3.2MB. Compress before merge. *Landed:* all 7 scene backgrounds + landing-bg converted to WebP q85 (scene-1 first downscaled 2880→1440 to match the set); ~34MB → ~650KB total, paths updated in `sceneBackgrounds.ts` only, renders verified in-browser.
**CM-19 (M)** No docs trail on Kayla's branches: no D-entries, STATUS untouched, and `/character` + `/loading` are new screens that per the repo's hard rule need flagging against PRD.md. Log the decisions when this lands.

---

## Workshop boards to build

1. **Glass surface treatment** (CM-01/02/03): quiz card + answer rows over a scene background and over the landing background, 4 to 6 iterations across fill/blur/scrim/veil, Figma 238-242 as one candidate.
2. **Map overview** (CM-05/06): orb sizing by %, tie handling, job-dot visibility at landing (hidden / dimmed / nearest-labeled), icon treatment.
3. **Role zoom + panel** (CM-10/11/12): context rail, panel-aware camera, overlay vs docked vs full page.

HTML canvas boards or Claude Design, decide at session start. Each board ends in a decision recorded here.

☑ **Built and reviewed 2026-07-17** as an in-app dev-only route (`/boards`, `src/screens/Boards/`, registered only under `import.meta.env.DEV`; delete the folder + route once Pass 2 lands). Caelan reviewed all three live.

### Board decisions (2026-07-17, Caelan)

1. **Glass (CM-01/02/03):** her existing panel glass (`glass-fill-strong` + `backdrop-blur-panel`, board variant B) is the direction, nudged toward variant D's legibility — raise the fill somewhat above 6% while keeping the glassy look; tune the exact value live against the scenes in Pass 2. Reuses/extends existing tokens rather than minting a parallel system. The heavy white frost (E, the literal Figma read) and the background veil (F) are out. Selected answer stays solid gold. The Back control gets the same platter (CM-03).
2. **Map overview (CM-05/06):** board variant B — orbs sized by match % (area-true, ties render equal), job dots dimmed at landing, distinct hub icons from the mockup. Plus: hovering a job dot brightens it and reveals its name (desktop affordance); the intro card gains a line explaining what the small dots are (covers touch); zoom-driven labels stay as-is.
3. **Role zoom + panel (CM-10/11/12):** the pre-merge floating panel pattern returns as persistent context — a floating rounded panel (NOT edge-docked; margin on all sides, map visible around it), role content at role zoom (top-match read, description, jobs-in-path list), job content at job zoom, stable back controls in its header. Panel-aware camera fits the cluster into the space the panel leaves, then pan/zoom stay free (CM-11). The optional full-page open ("Role overview →" / "Job overview →" CTA, as pre-merge) stays — a deliberate CM-12 decision; revisit only if job-seeker usability sessions show confusion. Docking rejected: with a panel-aware camera it gains nothing, and floating keeps the continuous-space feel. Collapse toggle: nice-to-have, not required.

## Team discussion items

- Glass direction and the screener/narrative separation, with the critique notes under CM-02 (Caelan + Kayla + team).
- Header alignment across prototypes (mention to Kayla, CM-04).
- Screener content: the unsure option, the AI-sort-screener replacement question.
- Walk Kayla through this ledger before or while the fixes land; several items reverse calls she made silently, and the reasons should travel with the changes.

## Session plan (next chat)

- **Pass 0, quick wins (code only, no design ambiguity):** ☑ **done 2026-07-17** — CM-04 header revert, CM-08 label halo, CM-09 copy fix on the exit control, CM-14 spec fix, CM-15 lint warning, CM-17 token rebind, CM-18 compression. All on `career-map-merge`, gates green (lint zero-warning, typecheck, 107 unit, 4/4 E2E).
- **Pass 1, boards:** ☑ **done 2026-07-17** — three boards built at dev-only `/boards`, reviewed live, decisions recorded above.
- **Pass 2, apply decisions:** CM-01/02/03 surface system (panel glass, legibility-nudged, tokenized), CM-05/06/07 map information design (%-sized orbs, dimmed dots + hover labels + intro copy, the ? pill), CM-10/11/12/13 wayfinding (floating context panel + panel-aware camera + optional full-page CTA + the copy pass). Then delete `/boards` + `src/screens/Boards/`.
- **Pass 3, close:** full gates, `/design-review` rubric pass, D-entries + STATUS + this ledger ticked, then merge `career-map-merge` to main and hand Kayla the summary.

Single-session passes, run-sheet style. This doc is the ledger; nothing merges until the H items are closed or explicitly deferred with a reason.
