# Handoff Guide: what ARM / Fivestar will need to do

_Snapshot 2026-07-01. Branch `narrative-v3-realign`. Owner of the formal write-up: the CMU MHCI capstone team, for the ARM Institute and the Fivestar dev team (Caroline, Senior Design Consultant)._

This is the engineering-side catalog of **known gaps that are ARM's / Fivestar's to close after handoff**, plus the small cleanup we owe before we hand it over. It exists so that work stops living on our active plate and is instead owned by the right party. The **formal client hand-off deliverable** (a Figma file, the working prototype, high-fidelity mockups, and the data assets) lands at the **July 21** presentation and draws its "here's what's left for your team" section from this doc.

Nothing here blocks the current virtual test round. The one hard dependency for a production-real handoff is real ARM content (§1).

---

## 1. Per-job and bridge-program content (the single largest dependency) — blocked on ARM

The constellation, job-overview, and "How to bridge the gap" screens render off `src/data/jobs.ts` and `src/data/bridgePrograms.ts`. The **data shapes are final** and the job **titles are real ARM common titles**, but every job's summary, responsibilities, skills, and `roleNoun`, plus all bridge-program names and schools, are **authored project-voice stand-ins**. Both files carry explicit `⚠️ PLACEHOLDER` banners.

- The request template is authored, complete, and already handed out: **`docs/reference/Job_Program_Data_Request.md`** (its answer blanks are still empty). Remaining work: ARM fills it in, then we (or Fivestar) swap the content into the two data files.
- **Count is 4 featured jobs per role (4/4/4)** — the constellation is a balanced four-corner ring. Technician's role page lists only 3 common titles, so we **added a 4th, `technician-robotics-maintenance-technician`, which ARM must confirm or replace**. Specialist and Integrator each feature 4 of ARM's 5 published titles (one dropped from each; see the data-request doc's 2026-06-30 note for which).
- **Not part of this dependency:** `roleDetails.ts`. Its salaries, competencies, education, and job activities are transcribed verbatim from ARM's live site and already verified. Do not re-source those.

**Priority: high.** This is what makes the results screens production-real.

## 2. The AI-prefixed role variants + the scenario quiz — ARM/Fivestar integrate, not us

Fivestar's June-22 platform update added three **AI-prefixed role variants** and made their own quiz **scenario-based**. We deliberately did **not** integrate the AI role names into this prototype — that is platform-integration work for ARM/Fivestar to do on their side after handoff. This prototype scores ARM's three **base** published roles (Robotics Technician / Specialist / Integrator), which is the taxonomy on file in `docs/reference/ARM Updated Role Structure - Source Content.md`.

What ARM/Fivestar own here:
- Deciding how the AI-prefixed variants map onto (or replace) the three base roles this prototype uses.
- Reconciling their scenario-based quiz with this narrative quiz, if both are to coexist.

The in-repo ARM source doc only captures the three base roles. **Update (2026-07-01, D-034):** ARM's Fivestar deck (Release 4.3) now supplies the mapping answer, the AI variants are the digital mirror of the three robotics tiers, on the same How/What/Why signature. A documented domain-mirror integration path (keep the 3-tier engine, add a physical/digital domain axis, derive 6 roles) is spec'd in `AI_ROLES_INTEGRATION.md`, with the comparison in `ARM_FIVESTAR_COMPARISON.md`. The **build stays deferred** and remains a green-light decision (ours post-handoff, or ARM/Fivestar's on their platform); only the "how" is now on file.

## 3. Confirm the three role names match Fivestar's live taxonomy — blocked on Fivestar/ARM

The four-to-three collapse (D-028) named our roles **Technician / Specialist / Integrator** to match ARM's site at the time. Before the July 21 handoff, someone has to confirm those three names still match Fivestar's live taxonomy. This is a non-code verification gated on an external party. A naming mismatch handed to Fivestar would be embarrassing, so treat it as a real pre-handoff checklist item. **Priority: medium.**

## 4. Job-overview "next steps" CTA destination — blocked on ARM (low)

The "Set as target role" pill on the job-overview screen is **inert chrome by scope** (no SkillsMatch or live ARM wiring in a prototype). The real per-job destination, if one exists, is an outstanding ask in the data-request template's cross-cutting section (line ~89: "a 'next steps' destination per job, if one exists — otherwise we'll stub the CTA"). If ARM has no per-job destination, the CTA stays stubbed and this closes.

## 5. Cleanup we owe before handoff (our task, not ARM's)

- **Remove the `devSeedResults()` store action.** It seeds a plausible completed run and jumps straight to results, skipping the quiz. The Landing UI button and its `import.meta.env.DEV` guard are already gone; the store action itself is **intentionally kept for the current virtual test round** (`src/state/sessionStore.ts` — the type decl + its implementation, and it's referenced in a Landing prose comment). **Delete all three before the handoff.** It is dead in production builds today, but the plan's letter is to remove it outright for the handoff.

## 6. What is already production-real (so nobody re-derives it)

- **The scoring engine** (`src/lib/categoryScoring.ts`) is pure, branch-aware, and unit-tested. It returns a normalized match across all three roles.
- **`roleDetails.ts`** content is ARM-verbatim and verified (see §1).
- **The five results screens** (role cards → compare → bubble map → job constellation → job overview) are all built and green.
- **Design tokens** are kit-aligned (dark-only) in this repo; the shared `rc-design-system` package is a separate, deferred effort (see `DESIGN_SYSTEM_RUN.md`).

---

## The formal July 21 deliverable (what this feeds)

At the late-July handoff the client-facing package is a Figma file + the working prototype + high-fidelity mockups + the data assets (per `archive/REALIGNMENT.md` Appendix C). The "what your team needs to do next" section of that package is authored from §§1–5 above, in the polished client voice (Word deliverable per `Document Guides/Document_Style_Guide.md`, produced by the Cowork side). Keep this doc current so that write-up is a transcription, not a re-derivation.
