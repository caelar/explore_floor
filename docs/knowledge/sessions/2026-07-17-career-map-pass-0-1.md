# 2026-07-17 — Career-map review: Pass 0 quick wins + Pass 1 boards decided

## Resume here

- **State:** still on **`career-map-merge`**, merge still HELD. Pass 0 (all seven quick wins) and Pass 1 (three workshop boards, reviewed live, decisions recorded) are done and committed (`a376965`, `7d3928d`, plus the decisions docs commit). Gates green: lint zero-warning, typecheck, 107/107 unit, 4/4 E2E.
- **Next action:** open `CAREER_MAP_REVIEW.md` → "Board decisions (2026-07-17)" and run **Pass 2**: the glass surface system (panel glass nudged for legibility, tokenized, applied to quiz cards + answer rows + back platter), map overview information design (%-sized orbs with ties equal, dimmed job dots, hover brighten + label, intro-copy line, distinct hub icons, the CM-07 ? pill), and wayfinding (the pre-merge floating context panel returns on role/job zoom, panel-aware camera, optional full-page CTA, CM-13 copy pass). Then delete `/boards` + `src/screens/Boards/`.
- **Open holds:** CM-16 (hero button registry ruling) deferred to Pass 3 by Caelan. CM-02 team-discussion items unchanged. Nothing pushed anywhere; direct push stays denied.

## What we did

**Pass 0 (commit `a376965`).** CM-04 header re-constrained (`mx-auto max-w-lg` back, her inner search wrapper kept). CM-15 `notifyExplore`/`cancelCameraAnimation` memoized, deps fixed, lint now zero-warning. CM-17 AmbientField rebound to tokens (`breathe.orb` retimed 7→18 keeping her feel, new `breathe.orbPulse` 23, colors to `var(--color-role-*)`; the focus color shift verified animating in-browser). CM-08 near-black text-shadow halo on all job labels; surveyed all three clusters — only two slots are edge-bisected (`second.jobs[0]`, `third.jobs[2]`) and the halo hides the line behind the text in both, so no anchor nudges shipped; `labelDx/labelDy` plumbing added in case the call is overruled. CM-09 copy portion: new `backToResults` key, overview exit reads "Back to your results". CM-14 `cameraSettled` bounding-box-stability helper guards both the bubble and job-orb force-clicks. CM-18 all scene + landing backgrounds to WebP q85 (scene-1 downscaled 2880→1440 to match the set): ~34MB → ~650KB, paths changed only in `sceneBackgrounds.ts`, verified visually.

**Pass 1 (commit `7d3928d` + docs).** Built the three boards as a dev-only `/boards` route (real tokens, real scene art; glass variants judged live because backdrop-blur doesn't screenshot honestly). Caelan reviewed and decided all three — full decisions in `CAREER_MAP_REVIEW.md` §Board decisions. Headlines: glass = her panel glass nudged more legible (no white-frost flip, no veil); map overview = %-sized orbs + dimmed dots + hover labels + intro copy + distinct icons; role/job zoom = the pre-merge **floating** panel pattern returns with a panel-aware camera (docking rejected as gaining nothing), optional full-page CTA kept. His two pre-merge reference screenshots grounded the wayfinding call.

## State at end of session

- `career-map-merge` carries: reconciled merge + Pass 0 fixes + the boards + ledger updates + this note. All gates green at each commit.
- Dev server was left running in the background for the board review (`pnpm dev`, port 5174); safe to kill.
- The boards route survives until Pass 2 lands (it's the working reference for the glass tuning), then gets deleted per the ledger.

## Next session

Pass 2 applies the recorded decisions (surface system → map information design → wayfinding, roughly in that order; the glass tune goes first since the boards route is the live tuning bench). Pass 3 then closes: full gates, `/design-review`, D-entries (including CM-16 ruling and the two new screens `/character` + `/loading` flagged per the PRD hard rule), STATUS, merge to main, summary for Kayla.
