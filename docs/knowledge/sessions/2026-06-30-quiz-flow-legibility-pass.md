# Handoff — quiz-flow legibility pass, 2026-06-30

**Read this after `STATUS.md`.** A focused polish pass on the **live narrative quiz** (intro
screeners + day-in-the-life scenes), from two rounds of Caelan feedback, grounded in the imported
Claude Design reference. Branch `narrative-v3-realign`. Gates at handoff: **lint ✓, typecheck ✓, 82
unit ✓, 3 E2E ✓**. Graded `/design-review` (design-system-compliance): **clean PASS** (3 cosmetic
p3 watch-items, below). Decision **D-030**; lesson **L-008**.

Reference (ground truth for everything but our own question set): Claude Design
`Quiz to Results.dc.html`, project `df8d5f31-2435-4a09-9382-6af1d62f9b59`, read via the **DesignSync
MCP** and now saved locally at **`docs/reference/claude-design/`** (the `.dc.html` + `support.js` +
logo + a README of exact tokens). This is the `.dc.html` the harness docs cite — it wasn't
physically in the repo before; now it is. _(I first reasoned from the wrong artifact —
`docs/reference/dark/*.png`, which is ARM's live My-Match flow, not the quiz. See L-008.)_

---

## What we did (by the issue Caelan raised)

**Round 1**
1. **Answer-box jump** — `Flow/BucketSort.tsx`. The choice rating card dropped from `text-h4`
   (24/700) toward the reference's smaller size; first 20px/600, then (round 2) **body 16/600**.
2. **"Question 6 of 6" stuck on Back** — `Flow/FlowRunner.tsx`. The counter was a global
   answered-count, so after finishing all six, stepping Back showed "6 of 6" everywhere. Now
   **index-based** (`steps.slice(0, stepIndex).filter(mc && answered).length + 1`). Verified live:
   Back reads 6 → 5 → 4 → 3 → 2 → 1.
3. **"How long?" ambiguity** — `data/flows/narrativeFlow.ts`. Rewritten self-contained:
   **"How long would you want to attend college?"**
4. **Salary line is a factual qualifier, not a scenario** — new `MCStep.promptPlacement` field
   (`data/types.ts`); the salary range renders **below** the question as a quiet `text-small` line
   (`Flow/MCQuestion.tsx`). Copy: "For reference, robotics roles run from about $46,000 to over
   $150,000." (no icon, per Caelan).
5. **Scenario gets skipped (the V2 research finding)** — `Flow/SceneSortView.tsx`. **Inverted the
   hierarchy**: the scenario is now the headline (h4 24 → body 16 on the morph, Montserrat 600,
   white) and the question drops to a smaller white line below it (h5 20 → body 16, Roboto 400, no
   gold). Built a standalone options mockup first (`~/Desktop/quiz-context-options.html`, still
   there); Caelan picked the A+C hybrid.

**Round 2 (Caelan's follow-ups on round 1)**
6. Q5 (`n-q4`) lead-in "Workers in robotics…" **removed**; Q6 (`n-q5`) lead-in **trimmed** to
   "Okay, one last thing."
7. Scene **question back to white** (`text-on-dark`, was muted) — matches the prototype.
8. **Tokens only** — killed the off-scale **17px/18px**; the scene now uses h4/h5/body throughout.
9. **Choice card to body 16/600** + **min-height reserve removed**. Measured all 21 scene labels
   live: at 16px every one is a single line (longest ~442px in a ~558px card), so the 2-line reserve
   was dead space. Card 122px → **72px**, uniform (no row jump), no longer dwarfing the recap.

Also: a one-line comment marking the `SceneSortView` qSpacer `56` height as a deliberate off-scale
layout constant (the only token-hygiene p3 from the review).

## State at end of session

- **Uncommitted? No** — committed this pass. The commit also swept up the **trailing
  results-polish tweaks from the prior pass** that were still uncommitted (entangled in the working
  tree): `narrativeFlow.ts` results-map copy ("Your Results" + path-oriented intro/hint),
  `roleDetails.ts` educationShort "High school / GED" → "High school", `SignalBars.tsx` `dense`
  prop, `JobSidePanel.tsx` (uses it). Those are documented in
  `sessions/2026-06-30-results-quiz-polish-pass.md`.
- **Gates:** lint ✓, typecheck ✓, **82 unit** ✓, **3 E2E** ✓ (narrative spec's "How long?"
  assertion updated to the new wording).
- **Design-review:** clean PASS on design-system-compliance. Three **p3 watch-items, left as-is**
  (deliberately): (a) `SceneSortView` scene intro uses `<p>` for the visual headline (scenario) and
  `<h2>` for the smaller question, so the document outline is inverted vs. the visual — but a
  multi-sentence narrative scenario doesn't belong in an `<h2>`, so current semantics are defensible;
  (b) the rating-beat recap scenario and the choice-card label are typographically identical
  (16/600) — a hierarchy watch-item that matches the compact mockup intent and Caelan's explicit
  call (if it tests ambiguous, nudge the recap scenario to `text-on-dark-muted`); (c) the qSpacer
  56px, now commented. None block.

## Next session

- If user-testing the scenario-first treatment surfaces the recap/choice-card ambiguity (p3 b
  above), re-open a hair of hierarchy by muting the rating-beat recap scenario.
- Open question still standing from the round-1 writeup: whether to extend the scenario-first /
  detail-below treatment to the genuinely scenario-like **intro screeners** (e.g. Q5's old
  day-to-day framing) — currently intro screeners keep the normal "prompt above, bold question"
  treatment, with the salary as the one factual exception. Greeting/transition prompts (Q0, Q6)
  should stay as-is.
- The dev-only "skip to results" control on Landing is still present (DEV-only, never ships).
