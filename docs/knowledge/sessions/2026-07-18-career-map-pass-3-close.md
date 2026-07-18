# 2026-07-18 — Career-map review: Pass 3, close + merge

## Resume here

- **State:** **MERGED.** `career-map-merge` landed on `main` (D-053); the `CAREER_MAP_REVIEW.md` ledger is CLOSED with a Pass 3 record at its bottom. Gates at merge: lint zero-warning, typecheck, **102/102 unit**, **4/4 E2E**; both design rubrics **PASS** with zero p1. The push to origin is Caelan's.
- **Next action:** none for this thread. Hand Kayla the summary (`Capstone/Handoff/Career_Map_Merge_Summary_for_Kayla.md`) and raise the team items (CM-02 glass/screener separation, the CM-04 header mention, screener content). The review's deferred tail (one p2 + six p3s) is queued in `DEFERRED_DIRECTIONS.md` under "Responsive + accessibility follow-ups".
- **For Caelan:** two pushes pending (this repo's `main`, robotics_career `33e0ba5`); restart the Playwright MCP browser — the design-review pass installed a Vite full-reload filter in its context to survive HMR, and a restart clears it.

## What we did

**CM-16 ruled (D-055).** Caelan picked the recommendation: the Landing start CTA is a **shared PillButton (Dark Gold lg) instance**, not a new CtaButton variant and not a one-off. The Landing adopted the results gold-pill recipe verbatim, the `hero` Button variant and the `--radius-cta`/`--spacing-cta-x` tokens were deleted, CharacterSelect's cards (the radius token's only other consumer) normalized to `rounded-lg`, and `rc-design-system/REGISTRY.md` carries the dated remap amendment.

**Cleanup.** The pre-existing `ResultsMap` → `BubbleField` → `bubbleLayout` orphan chain deleted (+ its test suite, the `--container-map` token, and the barrel export); `nodeLayout` stays live via the `/select` FitRadar. The dead `breathe.bubble/node/sparkle` bases went too (only `orb`/`orbPulse` have consumers). `map-debug.spec.ts` was passing **vacuously** — it evaluated before the entrance mounted anything, so its assertion loops ran over empty lists; it now waits for the reveal and asserts `labelCount === 3` + non-empty edge gaps, and passes with the assertions genuinely executing.

**Docs reconciled (D-053).** DATA_MODEL §17's results section rewritten to the career-map architecture (nav model, the two map bullets, the file maps, 102/10 test counts); PRD §5.0/§5.1 adopt `/character` + `/loading`, the illustrated layer, and the factory hero (resolving the new-screen hard-rule flags); the doc-steward swept ARCHITECTURE, DESIGN_SYSTEM (incl. one merged "Results career-map usage" section replacing the bubble/constellation ones), root CLAUDE.md, and ROADMAP; the scene-motion skill and stale code comments (router, SparkleStar) updated by hand. Steward flags resolved: the §4.4 match-% line (was stale vs the Phase-C neutral rule) and the two Kayla-era job-stat tokens documented in §5. Two pre-existing drifts flagged and left: `--color-arm-teal-soft` missing from DESIGN_SYSTEM's brand tables (componentization-run drift), and §17 proposal 4's "hover tints not shipped" wording.

**Design review — both rubrics PASS, zero p1.** Six of seven p2s fixed in-session: three inline SVG hexes → tokens/mirrors (new `MAP_INK_HEX` in the careerMapArt mirror pattern), motion literals → tokens (`durations.pour`/`instant`; ThoughtBubble's 520/24 spring kept as a deliberate one-shot, commented), `md:gap-10` → `gap-space-6`, an **11vb legibility floor** on hub names (verified 15px on screen at desktop; also resolves the results-screen smallest-hub finding), and the mobile "?"-pill dropped to its own row below the exit platter (verified no intersection at 375). The seventh p2 — mobile role-zoom job-label fit — deferred with a live-repro diagnosis: the label box scales with the viewport while the type is pegged to the orb reference, so below `md` the text overflows the box the camera fits to; the honest fix is a mobile label-strategy call, queued in `DEFERRED_DIRECTIONS.md` with the p3 tail.

## Verification

Full gates re-run after every code change (the review fixes came after the first verifier pass): lint zero-warning, typecheck, 102/102 unit, 4/4 E2E. The two review fixes were verified live via scripted Playwright at 1280 and 375 (hub-name font sizes read from the DOM; pill/platter rects checked for intersection).

## Lessons worth carrying

- A spec that evaluates before its subject mounts passes vacuously forever — when a suite's assertions run inside loops over queried lists, assert the list's expected size too (`map-debug` now does).
- The steward's "PillButton doesn't exist in code" flag was the useful kind of pedantry: registry names are Figma-tier vocabulary, and docs should say which tier they mean (PRD §5.1 now does).
