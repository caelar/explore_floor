---
name: data-author
description: Use when creating or editing anything in /src/data — scene choices, intro questions, category weights, role details, screener levels, results copy. Encodes the "data is data, not code" discipline and the DATA_MODEL §17 narrative-flow invariants so content stays tunable without touching component logic. Trigger on tasks like "add/edit a scene choice", "tune the category weights", "update a roleDetail", "fix expectedCategoryMax", or "update results copy".
---

# Authoring `/src/data`

`DATA_MODEL.md` is the schema spec — **read it, don't restate it.** This skill is the working discipline for editing data safely. The single rule everything serves: **content lives in typed data, never in components.** The team tunes content constantly; a content change must never require editing logic.

## Where things live
The live content is the narrative flow: `/src/data/flows/` (`narrativeFlow.ts`, `screeners.ts`, `buckets.ts`, registry `index.ts` — `DATA_MODEL.md` §17) and `roleDetails.ts` (the three ARM roles, keyed by `CategoryId`). The standalone `/select` comparator reads `roleSelect.ts`. Barrel `index.ts`. _(Classic and Exam were archived in Phase 4 — D-027; their data files are gone, recoverable at git tag `archive/pre-narrative-only`.)_

## Invariants — must hold after every edit (`DATA_MODEL.md` §17 is the live model; `data-integrity.test.ts` enforces)
- **Three roles** `technician / specialist / integrator` (Technician entry / Specialist mid / Integrator planning — ARM's live structure, D-028).
- **Narrative:** 6 intro MC steps (Q0–Q5) then exactly **7 scenes × 3 choices** (one per role, each sorted into a bucket — D-018); every `branchTo` resolves **forward**; `expectedCategoryMax = {11,11,11}`.
- **`expectedCategoryMax` must equal the computed full-path max** — **if you change MC `categories`, recompute it** (the narrative intro Q1 + Q3 score on a tier ladder, D-023: no-college/$45k → technician, 4yr+/$85k+ → specialist + integrator). Background MC choices may map to **zero** roles (narrative Q0, Q2 "1-2 years", Q2 "Whatever").
- **Buckets:** the 3 `SORT_BUCKETS` (`flows/buckets.ts`): That's me / **Kinda me** (id `maybe`) / Not me. Edit that label once, there. "Kinda me" scores `MAYBE_WEIGHT` (**0** today, tunable).
- **Screener fit (D-020):** appetite levels + copy live in `flows/screeners.ts`; role `educationLevel`/`payLevel` (0–2) in `roleDetails.ts`; the comparison is pure in `lib/screenerFit.ts` (don't put fit copy in the component). All three `roleDetails` resolve to three distinct role names.
- Unique step + choice ids; all owned copy (landing + results) non-empty.

## Tunable without code vs needs-code (`DATA_MODEL.md` §17)
- **Tunable (just edit data):** any text (scene/choice labels, role descriptions, fit copy, results copy), all role weights, MC `categories` tags (recompute `expectedCategoryMax`), screener levels, `roleDetails` content.
- **Needs code / stop and ask:** adding a fourth role, changing the scoring algorithm shape, changing session-state shape. If a content change *feels* like it needs a code edit, it probably doesn't — re-check the schema first.

## Workflow
1. Confirm the change is data, not logic. If logic, stop and flag.
2. Edit the relevant `/src/data` file, matching existing types exactly (no `any`).
3. Re-run the affected invariants above (recompute `expectedCategoryMax` by hand if you touched the flow's MC `categories` or scene choices).
4. Run `pnpm test:unit` — especially `data-integrity.test.ts` (the invariant gate) and `categoryScoring.test.ts`.
5. If you changed an `expectedCategoryMax`, update the declaration and record the decision in `DECISIONS.md`.

## Anti-patterns (refuse)
- Putting copy, weights, role text, or fit copy inside a component.
- Changing the flow's MC `categories` or scene choices without recomputing `expectedCategoryMax` (the `data-integrity` test will fail loudly).
- A config-driven generalization the spec didn't ask for (the narrative is a fixed 7 scenes of 3; build that).
