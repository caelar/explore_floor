# AI-roles integration: the domain-mirror architecture

_Snapshot 2026-07-01. A **proposed** architecture for adding ARM's three AI pathways to this prototype, using ARM's own Fivestar framework (deck 4.3). This is a spec, not the live model, and **nothing here is built.** The live model stays `DATA_MODEL.md` §17 (three robotics roles). Green-lit and logged as `D-034`; the comparison that motivates it is `ARM_FIVESTAR_COMPARISON.md`._

Companion to `HANDOFF_GUIDE.md` §2 (which flagged the AI variants as ARM-owned with "no answer on file"). This doc is that answer.

---

## 1. The principle

ARM's six pathways are a **2×3 grid**: one domain axis (Physical/Robotics vs. Digital/AI) crossed with three tiers (entry/mid/advanced), where each tier shares the same How/What/Why signature across both domains. So:

- The **tier** score is what our engine already computes (technician / specialist / integrator).
- The **domain** lean (robotics vs. AI) is the one new signal we need.
- The **six roles** are just tier × domain, derived at results time.

We keep our multi-role weighted result (no single winner). We do **not** re-author the seven scenes or the scoring brain.

## 2. The model

- **Tier axis (unchanged):** `CategoryId = 'technician' | 'specialist' | 'integrator'`, scored exactly as today by `lib/categoryScoring.ts`. The seven scenes stay at three choices each (one per tier), so the deepest data invariant, "each scene has exactly 3 choices, one per role" (`data-integrity.test.ts`), is untouched. This is the whole reason to use a domain axis instead of six flat roles: six flat roles would force six choices per scene and a full re-authoring of the instrument.
- **Domain axis (new):** `DomainId = 'robotics' | 'ai'`, sourced from **two new "Where" everyday-scenario MCs** (per Caelan's call). Two questions give a light physical-vs-digital lean, a soft confidence read rather than a hard switch, so a strongly-physical answer set weights the robotics trio up and the AI trio down, and a mixed set surfaces both.
- **Pathways (new, results-only):** six `PathwayId` = tier × domain. A thin **pure** `lib/pathwayScoring.ts` combines each tier's normalized match with the domain lean into six pathway percentages, ranked. It sits downstream of `categoryScoring`, so the tested brain is unchanged.
- **Content (new):** a `pathwayDetails` map (six entries) reusing ARM's competencies and insight narratives for the AI trio (both are in the deck and transcribed in `ARM_FIVESTAR_COMPARISON.md` §6). Jobs and bridge programs for the AI roles follow the existing content path (`docs/reference/Job_Program_Data_Request.md`).

**Domain-lean math (illustrative):** let the tier matches be `mT, mS, mI` (each 0-100, as today) and the domain lean be `d ∈ [0,1]` from the two Where questions (0 = fully physical, 1 = fully digital). Robotics pathway score = tier match × physical weight; AI pathway score = tier match × digital weight, where the weights come from `d` (for example `1-d` and `d`, or a softened split so neither trio zeroes out). Exact weighting is a build-time tuning knob, same spirit as `MAYBE_WEIGHT`.

## 3. The code surface (from a full repo map, 2026-07-01)

### Scales automatically (already role-count-driven)
These iterate `CATEGORIES` or take `roleCount`, so they absorb more roles with no change: `categoryScoring`, `categoryBreakdown`, `screenerFit`, `compareRecommendation`, `SignalBars`, `RoleHero` (the "N of M" stepper), `CompareView` / `CompareTargetMenu`, and `useResultsNav` prev/next bounds.

### Four visual hotspots that need rework for six roles
1. **`lib/bubbleLayout.ts` `RANK_SLOTS`**: exactly three fixed slot positions; `ranking.slice(0, RANK_SLOTS.length)` silently drops roles 4-6. The single biggest map break. Fix is contained to this file (add slots or go generative).
2. **`Results/cards/TrajectoryViz.tsx` `TIERS` / `CY`**: a hardcoded three-rung ladder with fixed y-positions and two connectors; a role outside `TIERS` mis-renders (`indexOf` returns -1). This is a linear-ladder assumption, not just a count. With a domain axis it likely becomes two three-rung ladders (one per domain) rather than a six-rung line.
3. **`lib/nodeLayout.ts` `CATEGORY_ANGLES`**: three fixed triangle angles; only affects the `/select` fit radar, not the narrative map. Six roles need six angles (or the radar stays a per-domain triad).
4. **`matchLabels` (`narrativeFlow.ts`)**: exactly three ranked labels; roles 4-6 all fall back to "your third closest match." Extend the array (and its `data-integrity` assertion).

### Compile-time checklists a new `CategoryId`/`PathwayId` forces
TypeScript will demand an entry the moment the id set grows, in each of: `roleDetails` (or the new `pathwayDetails`), `jobs` (4 per role), `bridgePrograms`, `exploreContent.fitNarrative`, `components/categoryAccent.ts` `ROLE_ACCENT`, and the `--color-role-*` CSS tokens in `globals.css` (Tailwind v4 needs full class literals per role, so new roles need new tokens).

### Tests/invariants to update at build time
`data-integrity.test.ts` (role count, the 3-choice-scene rule, 4 jobs/role, 3 match labels) and `bubbleLayout.test.ts` (asserts 3 bubbles).

## 4. Two build variants (decide at build time)

- **(A) Lean-domain surface.** Show the leaning domain's three pathways, with a cross-link to the other domain. Results UI stays a three-role layout, so the four hotspots need little or no change. Lightest. Reads as "you lean hands-on, here are your three robotics matches (and here's the AI mirror)."
- **(B) Full six in results.** Rework the four hotspots and show all six ranked. Fuller, and it matches ARM's framing of six co-equal pathways. **Recommended target if we build**, since ARM now publishes six co-equal pathways.

## 5. Staged build plan (documented, NOT executed)

When green-lit:

0. **Content.** Author the AI `pathwayDetails` (competencies + insight narratives from the deck; jobs and bridge programs via `Job_Program_Data_Request.md`). Spot-check the robotics insight copy against ARM's crisper versions.
1. **Domain signal.** Add the two "Where" everyday-scenario MCs, the `DomainId` type, and the domain-lean read (a small pure helper, parallel to `screenerFit`).
2. **Derivation.** Add `lib/pathwayScoring.ts` (tier × domain → six weighted, ranked). Keep `categoryScoring` untouched.
3. **Results UI.** Implement variant A or B. For B, address the four hotspots (bubble slots, trajectory ladder(s), radar angles, match labels).
4. **Tests + docs.** Extend `data-integrity` and the layout tests, then run `/revise-doc` + `doc-steward` to reconcile the affected specs: the `CLAUDE.md` hard rule ("three robotics roles" and "do not add or rename roles"), `DATA_MODEL.md` §17, `PRD.md`, the audience/scope lines, and `HANDOFF_GUIDE.md` §2. Log execution as a new decision.

## 6. Risk and effort notes

- **Timing.** This lands right at the July 21 client handoff. The safe read is: keep it documented now, build after the handoff (or fold a scoped variant A into the handoff only if there's clear appetite). Building variant B under handoff pressure is the main risk.
- **Scope creep.** Adding AI roles widens the product past "robotics manufacturing for high schoolers." That's sanctioned by ARM's own deck, but it changes a `CLAUDE.md` hard rule and the audience framing, so it's a real product decision, not just an engineering one. Handle the doc reconciliation deliberately (step 4).
- **Content dependency.** The AI jobs and bridge programs are the same kind of ARM-sourced content gap we already track in `HANDOFF_GUIDE.md` §1. The competencies and insight narratives, though, we already have from the deck.
- **What stays true.** The scoring engine, the three robotics roles' content, and the five results screens are all production-real today (`HANDOFF_GUIDE.md` §6). This plan adds on top of them; it doesn't re-derive them.
