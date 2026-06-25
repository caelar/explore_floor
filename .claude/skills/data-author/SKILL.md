---
name: data-author
description: Use when creating or editing anything in /src/data — scene choices, statements, intro questions, category weights, role details, screener levels, competencies, training programs (and the documented-cut classic interest items / archetype weights / robot-part mappings). Encodes the "data is data, not code" discipline and the DATA_MODEL §17 flow invariants so content stays tunable without touching component logic. Trigger on tasks like "add/edit a scene choice", "retag a statement", "tune the category weights", "update a roleDetail", "fix expectedCategoryMax", "update results copy", or "add a mock program".
---

# Authoring `/src/data`

`DATA_MODEL.md` is the schema spec — **read it, don't restate it.** This skill is the working discipline for editing data safely. The single rule everything serves: **content lives in typed data, never in components.** The team tunes content constantly; a content change must never require editing logic.

## Where things live
The **live** content is the four-category flows: `/src/data/flows/` (`narrativeFlow.ts`, `examFlow.ts`, `screeners.ts`, `buckets.ts`, `classicFlow.ts`, registry `index.ts` — `DATA_MODEL.md` §17) and `roleDetails.ts` (the four RC.org category roles, keyed by `CategoryId`). Shared: `competencies.ts`, `skills.ts` (14), `programs.ts` (~6-10), `colorSchemes.ts`. **Documented cut** (classic, still in the tree until the Phase-4 archival): `items.ts` (24 interests), `roles.ts` (3), `robotParts.ts`, `questionSets/` (set A only; the A/B language test is retired, §16). Barrel `index.ts`. See `DATA_MODEL.md` §13.

## Invariants — must hold after every edit (`DATA_MODEL.md` §17 is the live model; `data-integrity.test.ts` enforces)
**Live (the four-category flows, `flows/`):**
- **Four categories** `operate / repair / program / plan` (→ Operator / Technician / Specialist / Integrator). Parallel to the three archetypes, **never mixed**.
- **Narrative:** 6 intro MC steps (Q0–Q5) then exactly **7 scenes × 4 choices** (one per category, each sorted into a bucket — D-018); every `branchTo` resolves **forward**; `expectedCategoryMax = {11,11,11,11}`.
- **Exam:** 30 statements counted **8/7/7/8** (operate/repair/program/plan), interleaved (no two adjacent share a category); `expectedCategoryMax = {operate:11, repair:8, program:10, plan:11}` — **UNEQUAL, don't assume 11 across the board.**
- **`expectedCategoryMax` must equal the computed full-path max** — **if you change MC `categories`, recompute it** (e.g. exam Q1/Q2 score on a tier ladder, No→operate, Maybe/Yes→program+plan, D-019; narrative intro Q1/Q2 + Q3, D-023). Background MC choices may map to **zero** categories (narrative Q0 + Q2 "Whatever"; the exam intro no longer — D-019).
- **Buckets:** both flows share the 3 `SORT_BUCKETS` (`flows/buckets.ts`): That's me / **Kinda me** (id `maybe`) / Not me. Edit that label once, there, for both flows. "Kinda me" scores `MAYBE_WEIGHT` (**0** today, tunable).
- **Screener fit (D-020):** appetite levels + copy live in `flows/screeners.ts`; role `educationLevel`/`payLevel` (0–2) in `roleDetails.ts`; the comparison is pure in `lib/screenerFit.ts` (don't put fit copy in the component). All four `roleDetails` resolve to four distinct role names.
- Unique step + choice + statement ids; all owned copy (landing + results) non-empty.

**Shared (live):**
- Every `Role.competencyIds` is non-empty and resolves to a real `competencies.ts` entry.
- Every `TrainingProgram` references real role IDs and real competency IDs.
- Weights are integers **0-3** (0 none, 1 light, 2 clear, 3 defining).

**Documented cut (classic — still validated by `data-integrity.test.ts` until the Phase-4 archival, then removed):**
- 24 interest items (set A), round order, all three weights present (never omit a zero), unique ids.
- Per-archetype sums equal the set's declared `expectedSums` (Set A: Builder 22 · Innovator 27 · Architect 25); maxes need not be equal (scoring normalizes per archetype). Change a weight → update `expectedSums` + log in `DECISIONS.md`.
- Every item's `robotContribution.parts` resolves to a real `robotParts.ts` entry.
- Exactly three classic roles/archetypes — never add, rename, or remove one (Builder→Technician, Innovator→Specialist, Architect→Integrator). _(This rule governs the **classic** pipeline only; the live four-category model already has a fourth role, Operator, by design.)_

## Tunable without code vs needs-code (`DATA_MODEL.md` §14, §17)
- **Tunable (just edit data):** any text (scene/statement/choice labels, role descriptions, fit copy, results copy, program blurbs), all category and archetype weights, MC `categories` tags (recompute `expectedCategoryMax`), screener levels, `roleDetails` content, the mock program set.
- **Needs code / stop and ask:** adding a fifth category or a fourth classic archetype, changing the scoring algorithm shape, changing session-state shape. If a content change *feels* like it needs a code edit, it probably doesn't — re-check the schema first.

## Workflow
1. Confirm the change is data, not logic. If logic, stop and flag.
2. Edit the relevant `/src/data` file, matching existing types exactly (no `any`).
3. Re-run the affected invariants above (recompute `expectedCategoryMax` by hand if you touched a flow's MC `categories`, scene choices, or statement counts; recompute classic `expectedSums` if you touched a weight).
4. Run `pnpm test:unit` — especially `data-integrity.test.ts` (the invariant gate) and `categoryScoring.test.ts`.
5. If you changed an `expectedCategoryMax` or `expectedSums`, update the declaration and record the decision in `DECISIONS.md`.

## Anti-patterns (refuse)
- Putting copy, weights, role text, or fit copy inside a component.
- Mixing the four categories (`CategoryId`) with the three classic archetypes (`ArchetypeId`); they are parallel models.
- Changing a flow's MC `categories`, scene choices, or statement counts without recomputing `expectedCategoryMax` (the `data-integrity` test will fail loudly).
- A config-driven generalization the spec didn't ask for (the narrative is a fixed 7 scenes of 4, the exam a fixed 30 statements at 8/7/7/8; build that).
