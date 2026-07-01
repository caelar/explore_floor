# 2026-07-01 — Docs hygiene + code follow-ups + REMAINING_WORK reorg

Branch `narrative-v3-realign`. A cleanup session driven by `docs/knowledge/REMAINING_WORK.md`: knock out the small session-sized items, and reorganize everything that isn't ours-to-do-now off our active plate.

## What shipped

**Code (all gated: lint, typecheck; full suite run at the end).**
- **`breathe` ambient-duration token** in `src/lib/motion.ts` (`orb` 7 · `bubble` 5 · `node` 4 · `sparkle` 2.4, seconds) — the results idle loops (`AmbientField`, `BubbleField`, `ConstellationNode`) now read their base durations from it instead of hardcoded multi-second literals, and the "no token home for a multi-second ambient loop" comments are gone. No feel change (same values).
- **Directional Back-slide** in `FlowRunner.tsx`: new `SessionState.lastDirection` (`'forward' | 'back'`), set by the nav actions in `sessionStore.ts` (`advanceStep` / `rateChoice` → forward, `goBack` → back). The step transition is now `enter`/`center`/`exit` **variants** as functions of a `custom` dir, with `custom={dir}` on both `<AnimatePresence>` and the `motion.div` so the exiting step slides the right way. Forward: in-from-right / out-left; Back: mirrored. Reduced-motion still a plain crossfade.
- **Intro-choice stagger** in `MCQuestion.tsx`: the answer rows cascade in after the card settles (`delayChildren ≈ glide`, `staggerChildren`), reduced-motion mounts them shown. (The **scene** first-BucketSort-card variant of this is deferred — non-trivial without disturbing the morph; logged in `DEFERRED_DIRECTIONS.md`.)
- **Container token:** `--container-read` (672px) added to `globals.css` `@theme`; `FlowRunner` uses `max-w-read` instead of the ad-hoc `max-w-2xl` (closes the deferred a11y note).
- **Removed the dead drag path** (D-031): deleted `DragSortCard.tsx` + `DropZone.tsx`, dropped their two barrel exports, updated the `BucketSort` comment to click-only. Zero importers, zero tests — the "tested-enough to revive" guarantee was never met. Reverses `VISUAL_REARCHITECTURE.md` §3 rule 4; recoverable at tag `archive/pre-narrative-only`.

**Docs hygiene.**
- **Job count reconciled to 4/4/4** (the interim count-aware 3/5/5 was reversed in the 2026-06-30 polish pass). Corrected current-state text in `DATA_MODEL.md` + `VISUAL_REARCHITECTURE.md` + `STATUS.md`; appended a supersession note to `DECISIONS.md` D-029 Phase F (history preserved); left `sessions/*` notes as historical record.
- **`scene-motion` skill** rewritten: it had claimed the bucket-sort drag, the node-map compare swap, and the Landing GSAP reveal as live. Now reflects reality — all live motion is Motion (direction-aware step transitions, click-rating, intro stagger, results idle/layout); GSAP is registration-only (dormant seam); node map is gone; `nodeLayout.ts` feeds only the `/select` radar. Added the `breathe` token to its token list.
- **`src/lib/gsap.ts` comment** rewritten to the dormant-seam reality (only `useGSAP` + `DrawSVGPlugin` registered; the Phase-2 MorphSVG/MotionPath conveyor arcs are the documented cut).
- **Parent `Capstone/CLAUDE.md` palette line** fixed: explore_floor is now dark-only + kit-aligned (orange `#F56A00` → `#BF5309`, `arm-blue` `#38A5EE` retired), so the "older accents survive only in explore_floor" claim was stale. (Crosses the D-025 Cowork boundary; Caelan authorized.)
- **STATUS Phase 2/3 headings** reconciled: they still read "not started (Feel pass / Polish)"; now marked superseded/documented-cut with pointers to the step-8-done work and the new docs.

**Reorg (D-032).** The flat `REMAINING_WORK.md` catalog split by owner + timeframe into three docs and slimmed to a router:
- `HANDOFF_GUIDE.md` — ARM/Fivestar post-handoff work (per-job/bridge content swap, AI-role-variant integration, three-role name confirmation, CTA destination) + our pre-handoff cleanup (delete `devSeedResults()`). Seeds the July 21 client deliverable.
- `DEFERRED_DIRECTIONS.md` — consciously deferred polish + open decisions to revisit after the v3 test.
- `DESIGN_SYSTEM_RUN.md` — the `rc-design-system` package build sheet + `/capture-figma` queue for the dedicated design-system run (near-term).

## Deliberately not done
- `devSeedResults()` deletion (kept DEV-only for the current virtual test round; reminder parked in `HANDOFF_GUIDE.md` §5).
- `rc-design-system` package + `/capture-figma` (deferred to the design-system run; queued in `DESIGN_SYSTEM_RUN.md`).
- Scene first-BucketSort-card motion nuance, and all v4 polish (in `DEFERRED_DIRECTIONS.md`).

## Verification
Gates run at the end of the pass — see the session's final report. Playwright eyeball of the flow (directional Back, intro stagger, unchanged ambient loops, reduced-motion crossfade).
