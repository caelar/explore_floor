---
rubric: results-screen
name: Results Screen Quality
applies_to: [tsx]
version: 1
severity_defaults:
  default: p2
source:
  - docs/knowledge/REALIGNMENT.md §4 (the real work ahead is the narrative results screen)
  - docs/PRD.md §5.0 / §5.4 (recommendation, not a verdict)
  - docs/DATA_MODEL.md §17 (the node map, the role sheet, the fit line)
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
        check: The always-on education/pay fit line is shown and legible next to the role in focus
  discoverability:
    order: 3
    title: Discoverability of the compare
    criteria:
      - id: compare-discoverable
        severity: p1
        check: The compare interaction (the node-map swap) is discoverable without instruction
      - id: somewhere-to-go
        severity: p2
        check: The result gives an outbound next step (training programs, real listings), not a dead end
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

**Realistic scenarios**
- A user lands on a 31% Specialist match; the screen says in one line what 31% means, interprets which of their answers drove it, and offers programs that build toward it.
- A user who scores Technician sees it framed as an entry point with a visible path up to Specialist/Integrator, plus links, not "you're a Technician, the end."
- A user taps a behind-node on the narrative map; it swaps to center, the heading updates ("You're exploring …"), and the fit line follows the centered role.

**Anti-scenarios (should fail)**
- The match percentage appears with no definition ("11% match to … what?").
- The "why" section just lists the answers the user already gave, adding no interpretation.
- The compare interaction is invisible: a user never realizes they can see the other roles.
- A Technician (entry) result reads as a flat verdict with no upward path.
- The result has nowhere to go: no programs, no outbound link.

## 1. Match clarity
The number-one content gap from testing is that users can't tell what the percentage means ("I guess 11 percent match means 11 percent match to the career?"). One plain sentence settles it. The screen must read as a recommendation across the roles with a clear top match, never a single prescriptive verdict.

## 2. Trust through explanation
Trust came from the exam's "why you scored that way" breakdown. The live `categoryBreakdown` walks the same path the scorer did. The bar here is *interpretation*, not an echo: "you leaned toward hands-on, keep-it-running work" beats "you bucketed 5 of 7 Technician scenes 'That's me'." Detail sits behind progressive disclosure (the breakdown, the role sheet, the fit radar), and the always-on education/pay fit line (`FitNote`, D-020) is present and legible.

## 3. Discoverability of the compare
The compare is the specificity payload (PRD §5.4), and the V1 finding was that the node map's discoverability needs work. A user must be able to find the other roles without being told. The result must also give somewhere to go: training programs (a role-keyed set, reintroduced at step 8) and, eventually, real listings.

## 4. Honest, encouraging framing
Both participants who landed on the entry-level result felt deflated. A Technician (entry) result must read as a starting rung with a visible path up to Specialist/Integrator, paired with outbound links, not a deflating verdict (`REALIGNMENT.md` §11). An all-low result gets a light frame, not a broken-looking empty screen.

## 5. On-system
Accents come from `categoryAccent.ts`, type and spacing from the kit tokens. Defer to `design-system-compliance.md` for the token specifics; flag here only when an off-system choice hurts the result's clarity or credibility.

## Application
Run via `/design-review` against the narrative node-map results, mid-compare. Because clarity and trust are subjective, the reviewer should describe *what* a real teen would misread or distrust and *why*, cite the screenshot, and propose a concrete fix (e.g. "add a one-line definition under the percentage", "rewrite the breakdown to interpret rather than list", "add an upward-path chip to the Technician result").

## Cross-references
`design-system-compliance.md` (tokens/color/motion), `PRD.md` §5.0/§5.4 (the conversion moment), `DATA_MODEL.md` §17 (the node map, dashboard, role sheet, fit line), `REALIGNMENT.md` §4/§11 (the research asks and the watch-items).
