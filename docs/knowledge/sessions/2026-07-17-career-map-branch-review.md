# 2026-07-17 — Kayla's career-map branch: trial merge + review ledger

## Resume here

- **State:** the repo is checked out on local branch **`career-map-merge`** (main + Kayla's `visuals` + `career-map` work, conflicts reconciled). All gates green there: lint clean (one warning, CM-15), typecheck clean, 107/107 unit, 4/4 Playwright. **Merge to main is HELD** pending the review ledger.
- **Next action:** open `docs/knowledge/CAREER_MAP_REVIEW.md` and run **Pass 0** (the code-only quick wins: CM-04 header revert, CM-08 label halo, CM-09 exit-control copy, CM-14 spec race, CM-15 lint warning, CM-17 token rebind, CM-18 asset compression). Then build the three canvas boards (Pass 1).
- **Open holds:** `career-map-merge` is local only (Caelan pushes if he wants Kayla to see it). Team discussions pending: glass direction + screener/narrative separation (CM-02, includes the critique notes), header alignment (CM-04), and walking Kayla through the ledger. No D-entries logged yet on purpose; Pass 3 logs them at merge time so we don't collide with main's moving D-numbering. Main itself still awaits Caelan's push of the D-052 close-out commits (unchanged from the last note).

## What we did

**Explored Kayla's two remote branches.** `origin/visuals` and `origin/career-map` were initially the identical commit (`9a1b4c4`): the scene-visuals layer (7 scene backgrounds, character + variations, thought bubbles with 21 per-question icons, Flow wiring). Mid-session Kayla pushed `5f80fd9` to `career-map`: the zoomable career map replacing the constellation (CareerMap/CareerMapField + careerMapLayout), a functional target-role toggle, cross-tier job trajectories (`seniority` + `trajectory` on Job), the `/character` select screen, the `/loading` interstitial, a redesigned landing, and real tests (careerMapLayout/jobTrajectory/jobOverviewStats units, migrated e2e specs). So `career-map` = `visuals` + the map commit; merging it brings both.

**Trial-merged into main and got the gates green.** Seven conflicted files, all from main's componentization run colliding with her feature work. Reconciliation kept both sides: main's control-height tokens, directional step slide, and `max-w-read` combined with her scene machinery, target toggle, and redesigned surfaces. Two import-sort autofixes. The one full-suite failure was a flake in her spec (`click({ force: true })` firing mid-camera-zoom, CM-14), confirmed by three green reruns.

**Reviewed the merged build visually with Caelan and wrote the ledger.** Eight screenshots traced to code. Verdict, agreed: the map concept and visual direction are an upgrade (the constellation carried no meaning), but execution regressed readability (4.5% glass over illustrations), information encoding (orb size no longer tracks match %, ties render at different sizes), and wayfinding (context side panel gone, per-phase shape-shifting back control, directions card gone on first touch). All 19 issues live in **`CAREER_MAP_REVIEW.md`** (CM-01..CM-19) with severity, code anchors, agreed directions, and a pass plan. Two Figma pulls grounded it: the glass target (Quiz-Sketches-Assets `238-242`, heavy frost + solid gold selected state) and Kayla's own map mockup (RC.org Prototype `1289-394`), which had distinct hub icons and equal-size tied roles, both lost on the way to code.

## State at end of session

- Branch `career-map-merge` (local): the reconciled merge + eslint fixes + the review ledger + this note + the STATUS update. Gates green as of `41ca195` (docs commits after that don't touch code).
- The side-by-side comparison infrastructure was torn down (scratch worktree removed, both dev servers stopped). To recreate: serve this branch, and a detached worktree at main for the original.
- `origin/visuals` untouched; superseded by `career-map` (its commits are contained in it).
- Nothing pushed anywhere. Direct push stays denied to the agent.

## Next session

Start from the ledger's session plan: **Pass 0** quick wins burn down without design input, then the three **boards** (glass surfaces, map overview sizing, role zoom + panel) decide CM-01/02, CM-05/06/07, and CM-10..13 before Pass 2 applies them. Pass 3 closes: full gates, `/design-review`, D-entries + STATUS, merge to main, summary for Kayla. Nothing merges while the H-severity items are open.
