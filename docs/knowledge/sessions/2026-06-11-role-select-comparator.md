# 2026-06-11 — Standalone /select role-select comparator (industry-professional arm)

A "skip the quiz" comparator for the industry-professional study arm running 2026-06-11: instead of any quiz condition, the participant just picks a role outright. Deliberately NOT a registered flow — `FlowId` and `flows/index.ts` are untouched, so the §17 data-integrity `describe.each` over `flowList` needed no carve-outs. No session state, no scoring, no analytics.

## What we did

- **`/select` route + `screens/Select/RoleSelect.tsx`.** Heading "Which of these sounds most like you?" over four cards in ladder order (Operate → Repair → Program → Plan), `roleName` + `description` from `roleDetails.ts`. Each card: a neutral "This is me" button and a "See details" link. Local `useState` only; resets on navigation by design.
- **Selecting → a deliberately thin confirmation:** "You're set as [Role]" + a Continue button back to Landing. The thinness is the protocol's point — don't enrich it.
- **`RoleDetailSheet` reuse:** `matchPercentages` is now optional on `RoleDetailSheetProps`; the fit-radar section renders only when it's provided. Both existing call sites (CategoryResults, ExamResults) still pass it, so nothing else changed. The "Add this Role to your profile" stub stays as is.
- **Copy is data:** `src/data/roleSelect.ts` exports `roleSelectCopy` (screen) + `roleSelectSheetCopy` (a minimal `FlowResultsCopy['sheet']` for the sheet chrome).
- **Landing entry point:** first shipped as a link under the switcher, then (same day, committed separately) promoted into the switcher itself per Caelan — the third tab, **replacing Classic** (D-021). The tab navigates straight to `/select`; it arms no condition. Classic went dormant: code, data, registration, and §17 tests all stay, `defaultFlowId` moved to `narrative`, and the classic E2E specs select it via a dev-only `globalThis.__sessionStore` handle (`tests/e2e/helpers.ts`).
- **E2E `tests/e2e/role-select.spec.ts`:** land → entry link → four cards in order → open Technician sheet (content yes, `fit-radar` count 0) → close → select Specialist → thin confirmation → Continue → Landing. Zero console errors asserted.

## State at end of session

- Gates green: lint, typecheck, **99 unit**, **7 E2E** (the new role-select spec included). Visually self-checked via Playwright (cards, sheet without radar, confirmation, Landing link placement) — plain study register, consistent with the narrative/exam presentation (per D-017, not graded against the goose rubric).
- Working tree has this change plus the still-uncommitted 2026-06-08 session work. **Not committed.**

## Next session

1. Commit (this comparator can ride with or after the 2026-06-08 batch on `phase-1-flow` / main).
2. If the comparator graduates from a one-day study arm to a kept condition, revisit whether it should become a real flow (it would then need §17 treatment) — today's answer was deliberately no.
