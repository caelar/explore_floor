# Remaining Work — router

_Snapshot 2026-07-17 (reorganized 2026-07-01, D-032)._

The realignment sweep and the step-8 dark re-architecture are both complete and green (82 unit across 9 files, 3 E2E; both design rubrics PASS). The old flat "everything remaining" list was **reorganized 2026-07-01 by owner and timeframe** (DECISIONS D-032), so our active plate is now clear. What's left lives in three purpose-built docs:

| Where it went | Doc | Owner / timeframe |
|---|---|---|
| Things ARM / Fivestar must do after handoff, + the small cleanup we owe first | **[HANDOFF_GUIDE.md](./HANDOFF_GUIDE.md)** | ARM / Fivestar; feeds the July 21 deliverable |
| Consciously deferred polish + open decisions, to revisit after the v3 test | **[DEFERRED_DIRECTIONS.md](./DEFERRED_DIRECTIONS.md)** | us, a possible v4 |
| The `rc-design-system` package + `/capture-figma` queue | **[DESIGN_SYSTEM_RUN.md](./DESIGN_SYSTEM_RUN.md)** | folded into the ecosystem run (GO, D-035) |
| **The ecosystem run** — package, UX-repo excavation, harness port, Figma work, in single-session passes | **[ECOSYSTEM_RUN.md](./ECOSYSTEM_RUN.md)** (rationale: [ECOSYSTEM_PLAN.md](./ECOSYSTEM_PLAN.md)) | us; **Passes 1–7 done 07-03 (D-040)**; only the stretch pass remains |
| **The componentization run** — real Figma components + variants across the ecosystem files (nav mega set, buttons, chips, forms), promote-vs-local registry, bounded code alignment | **[COMPONENTIZATION_RUN.md](./COMPONENTIZATION_RUN.md)** (D-041) | us; **Passes 0–4 complete 07-17 (D-042–D-052)**; conditional Pass 5 in the wrap-up queue below; not a July 21 gate |

Decision history is in **[DECISIONS.md](./DECISIONS.md)**; live build state in **[STATUS.md](./STATUS.md)**.

## Done in the 2026-07-01 hygiene + code pass

- **Code:** added a `breathe` ambient-duration token (`motion.ts`) and wired the results idle loops to it; made the flow step transition **direction-aware** (Back slides opposite to Forward, via an AnimatePresence `custom` prop in `FlowRunner`) and added an **intro-choice stagger** (`MCQuestion`); swapped the quiz reading column's ad-hoc `max-w-2xl` for a real `--container-read` token; **removed the dead drag path** (`DragSortCard` / `DropZone`, D-031).
- **Docs hygiene:** reconciled the **4/4/4** job count across `DATA_MODEL` / `VISUAL_REARCHITECTURE` / `DECISIONS` / `STATUS` (reversing the superseded 3/5/5); refreshed the stale `src/lib/gsap.ts` comment and the **`scene-motion`** skill's "live motion" list; fixed the parent `Capstone/CLAUDE.md` palette line (explore_floor is now dark-only + kit-aligned); reconciled STATUS's stale Phase 2/3 headings.
- **Reorg:** created the three docs above and slimmed this file to a router (D-032).

## Post-presentation wrap-up queue (after the Tuesday 2026-07-21 presentation)

_Caelan's standing instruction (2026-07-17): after the presentation he will ask **"what's left to wrap up the project?"** — answer from this section. These items are deferred until then on purpose; do not surface them as active work before that._

- **Componentization Pass 5 — dashboard file reconciliation** (spec: `COMPONENTIZATION_RUN.md` Pass 5): widgets instance the DS `Card` instead of rebuilding their own card surface (dashboard FIGMA_MAP §7 gap); the chip consolidation ripples through the widget sets; plus the folded-in CardHead/DEF-012 code side (`SponsoredCard` rebuilds a raw card head). A single-session Plugin-API pass with per-frame pixel-faithful verification. **Caelan explicitly wants to run this during wrap-up.**
- Also in scope for that conversation: the registry-§6 "later" items (robotics_career button convergence; optional `@rc/ui` 61-name Icon bump), the ecosystem run's stretch pass, and whatever in `DEFERRED_DIRECTIONS.md` / `HANDOFF_GUIDE.md` §5 cleanup is still open then.

## Still genuinely open (see the docs above for detail)

- **High:** ARM per-job + bridge-program content swap (`HANDOFF_GUIDE.md` §1).
- **High:** the pushes awaiting Caelan (this repo's close-out docs; robotics_career `refine/phase-2-loop`, 4 ahead).
- **Medium:** three-role name confirmation vs Fivestar (`HANDOFF_GUIDE.md` §3); remove `devSeedResults()` before handoff (`HANDOFF_GUIDE.md` §5); Kayla's career-map merge (HELD behind `CAREER_MAP_REVIEW.md`, CM-01..19).
- **Low:** everything in `DEFERRED_DIRECTIONS.md` (rung cue, results polish, the scene first-card motion nuance, responsive, a11y, open scoring calls).
