---
rubric: results-screen
name: Results Screen Quality
applies_to: [tsx]
version: 2
severity_defaults:
  default: p2
source:
  - docs/knowledge/archive/REALIGNMENT.md §4 (the real work ahead is the narrative results screen)
  - docs/knowledge/archive/VISUAL_REARCHITECTURE.md §2/§6 (the dark 5-screen results system; D-029)
  - "Claude Design mockup: design_handoff_quiz_to_results/Quiz to Results.dc.html (the cards screen is the visual source of truth)"
  - docs/PRD.md §5.0 / §5.4 (recommendation, not a verdict)
  - docs/DATA_MODEL.md §17 (the role cards, signal bars, why-you-matched, fit read)
sections:
  clarity:
    order: 1
    title: Match clarity
    criteria:
      - id: percentage-defined
        severity: p1
        check: The match percentage is defined in one plain line ("X% means …"), not left to the user to guess
      - id: recommendation-not-verdict
        severity: p1
        check: Reads as a recommendation across the categories, never a single prescriptive role
      - id: top-match-legible
        severity: p2
        check: The top match and which role is centered/active are immediately clear
  trust:
    order: 2
    title: Trust through explanation
    criteria:
      - id: interprets-not-echoes
        severity: p1
        check: The "why you scored that way" read interprets the user's answers, it does not just replay them
      - id: progressive-disclosure
        severity: p3
        check: Detail (the breakdown, the role sheet) sits behind progressive disclosure rather than dumping everything at once
      - id: fit-line-present
        severity: p2
        check: The education/pay fit read is present and legible (Phase C folds it into the why-you-matched "openers" rather than a standalone banner)
  discoverability:
    order: 3
    title: Discoverability of the compare
    criteria:
      - id: compare-discoverable
        severity: p1
        check: The other roles are reachable without instruction (Phase C - the ranked signal bars + the prev/next role arrows + the Compare control; later phases add the compare + bubble-map screens)
      - id: somewhere-to-go
        severity: p2
        check: The result gives an outbound next step (the Tab-2 "how to bridge the gap" bridge programs; later, real listings), not a dead end
  framing:
    order: 4
    title: Honest, encouraging framing
    criteria:
      - id: technician-is-a-rung
        severity: p1
        check: An entry-level (Technician) result reads as a starting rung with a visible path up to Specialist/Integrator, not a deflating verdict
      - id: low-signal-graceful
        severity: p3
        check: An all-low result is framed lightly, not as a broken or empty screen
  system:
    order: 5
    title: On-system
    criteria:
      - id: category-tokens
        severity: p2
        check: Accents come from categoryAccent.ts and type/space from the kit tokens (see design-system-compliance)
---

Judges the high-fidelity results screen, the single most important and currently highest-churn surface in the build. The V2 study found that the results screen, not either question set, is the real problem: engagement and trust are separable, the narrative won engagement, and trust comes from explaining the match. This rubric is the quality bar for grafting the exam's transparency onto the narrative results (`REALIGNMENT.md` §4). System conformance (exact tokens) is `design-system-compliance.md`'s job; this rubric judges whether the result is clear, trustworthy, discoverable, and honest.

## Scope & Grounding

**Personas**
- *Riley (16-18), late-HS training-seeker* — should leave with a specific, believable read on where they fit and what to do next, not a vague number.
- *Parent over the shoulder* — should understand the result in 30 seconds: which paths, why, what they ask for.
- *ARM client reviewer* — checks the result is a real recommendation with a path to a program, the conversion ARM cares about.

> **Phase C/D/E scope (D-029).** The results are the dark **role-cards** screen (the first of a 5-screen system: cards → compare → map → constellation → job). The cards screen (Phase C) carries the hero (match label, role name, match %, ranked **signal bars**), an inline **"why you matched"** breakdown (01 what you chose / 02 how they connected / 03 what it means / what you passed on), and two tabs (The role / Skills, path & next steps). **Compare (Phase D)** sets the current role side-by-side with a switchable target (dropdown), each column reusing the hero + "why" + description + salary/education + duties, plus a soft **"Our take"** recommendation line (leads with fit, foregrounds the lower-barrier role when close; no swap). **Map (Phase E)** is the ambient **bubble map**: a full-bleed dark canvas where the three roles are bubbles sized by match % (rank-based — top match largest, high-centre), tapped to dive into a role's cards; judge it on the same recommendation-spread, top-match-legibility, percentage-clarity, and on-system/AA criteria below (bubbles must not clip the viewport; the float + ambient pulse must be reduced-motion-safe). Constellation / job land in Phase F. The old node-map is **deleted** (superseded by the bubble map).

**Realistic scenarios**
- A user lands on a 91% Specialist match; the collapsed line says where the 91% comes from ("X of the 11 moments pointed toward Specialist"), and "see full breakdown" interprets which answers drove it.
- A user who scores Technician sees it framed as an entry point with a visible path up to Specialist/Integrator, plus links, not "you're a Technician, the end."
- A user steps prev/next through the ranked roles; the hero, signal-bar highlight, match label ("Your second closest match"), and tabs update, and the breakdown follows the active role.

**Anti-scenarios (should fail)**
- The match percentage appears with no definition ("11% match to … what?").
- The "why" section just lists the answers the user already gave, adding no interpretation.
- The compare interaction is invisible: a user never realizes they can see the other roles.
- A Technician (entry) result reads as a flat verdict with no upward path.
- The result has nowhere to go: no programs, no outbound link.

## 1. Match clarity
The number-one content gap from testing is that users can't tell what the percentage means ("I guess 11 percent match means 11 percent match to the career?"). One plain sentence settles it. The screen must read as a recommendation across the roles with a clear top match, never a single prescriptive verdict.

## 2. Trust through explanation
Trust came from the exam's "why you scored that way" breakdown. The live `categoryBreakdown` walks the same path the scorer did. The bar here is *interpretation*, not an echo: "you leaned toward hands-on, keep-it-running work" beats "you bucketed 5 of 7 Technician scenes 'That's me'." Detail sits behind progressive disclosure (the breakdown, the role sheet, the fit radar), and the education/pay fit read (D-020) is present and legible — folded into the breakdown's "openers" since Phase C (the standalone `FitNote` banner was retired, its file deleted in Phase E).

## 3. Discoverability of the compare
The compare is the specificity payload (PRD §5.4), and the V1 finding was that the node map's discoverability needs work. A user must be able to find the other roles without being told. The result must also give somewhere to go: training programs (a role-keyed set, reintroduced at step 8) and, eventually, real listings.

## 4. Honest, encouraging framing
Both participants who landed on the entry-level result felt deflated. A Technician (entry) result must read as a starting rung with a visible path up to Specialist/Integrator, paired with outbound links, not a deflating verdict (`REALIGNMENT.md` §11). An all-low result gets a light frame, not a broken-looking empty screen.

## 5. On-system
Accents come from `categoryAccent.ts`, type and spacing from the kit tokens. Defer to `design-system-compliance.md` for the token specifics; flag here only when an off-system choice hurts the result's clarity or credibility.

## Application
Run via `/design-review` against the dark results screens — the role cards (mid-breakdown), the compare side-by-side, and the bubble map. Because clarity and trust are subjective, the reviewer should describe *what* a real teen would misread or distrust and *why*, cite the screenshot, and propose a concrete fix (e.g. "add a one-line definition under the percentage", "rewrite the breakdown to interpret rather than list", "add an upward-path chip to the Technician result").

## Cross-references
`design-system-compliance.md` (tokens/color/motion), `PRD.md` §5.0/§5.4 (the conversion moment), `DATA_MODEL.md` §17 (the role cards, compare, bubble map, role sheet, fit read), `REALIGNMENT.md` §4/§11 (the research asks and the watch-items).
