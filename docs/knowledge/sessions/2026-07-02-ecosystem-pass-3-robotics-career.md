# 2026-07-02 — Ecosystem run Pass 3: `robotics_career` excavated + six-role content

**Resume here.** Pass 3 is done: `Prototypes/robotics_career` exists (3 commits, main @ `2a89b55`), runs Kayla's Landing + Explore + full sign-up flow on `@rc/ui` Mode A, and is **pushed to `github.com/caelar/robotics_career` (private)**. The Landing now carries ARM's six published roles (3 robotics + 3 AI, grouped rail). One item awaits Caelan (git-push deny rule): pushing the archive tags and deleting the two old branches on career_dashboard — the exact commands are below. **Next: Pass 4** (harness port into the UX repo), per the run sheet. No code touched in this repo; gates unaffected.

## Caelan's rulings this session (now in the run sheet)

- Kayla's "RC.org Prototype" Figma file key is `k3AjijocJEmzrvlKTd9vJM` — **pull-only**; the UX repo's future captures go to a new Figma file, never hers.
- The two career_dashboard branches were always excavation seeds; they close once their work is in the new repo.
- Landing content adapts to ARM's new six-role structure: the four legacy tabs (Operate/Repair/Program/Plan) collapse to the three robotics roles, and the three AI roles come in from the live site (Caelan's screenshots covered all three cards).

## What we did

- **Excavation (commit `5f686c5`).** Merged both branches in a scratch worktree (disjoint file sets, zero conflicts; homepage's versions of shared touch-points, sign-up's `auth/*` verbatim), copied the closure into the new repo, wired `@rc/ui` Mode A (theme/fonts/base imports; zero local token authorship), rewrote all 10 asset constants to `/figma-assets/` per MANIFEST, wrote a fresh minimal `App.tsx` (marketing + auth routes; `/dashboard` renders a labeled seam stub instead of navigating into the absent dashboard). Port 5186. Trimmed `package.json` (dropped zustand/vitest/Playwright; added the `@rc/ui` git dep — resolved and installed cleanly from the private remote).
- **Six-role content (commit `2a89b55`).** Role-card content extracted from `Landing.tsx` into `src/data/roles.ts`; robotics content verbatim from this repo's reference doc, AI content transcribed into `robotics_career/docs/reference/ARM_AI_Role_Structure.md` (AI Data Technician $52k–$87k / AI Implementation Specialist $101.5k–$140.5k / AI Developer $106k–$157k). Grouped tab rail (ROBOTICS / AI labels, six tabs) keeps Kayla's tab-and-card interaction. `competencies.ts` names reconciled verbatim to ARM's Levels of Competencies (fixed `Fluid Inspection/QA` → `Inspection/QA`, `System & Process Design` → `System and Process Design`, Title-Case drift); ids stable so the sign-up Competencies screen is untouched.
- **Fixes in passing:** the stray `;;`, a JobCard button-in-button DOM nesting (now `div[role=button]` with keyboard handling), an import-spacing typo.
- **Gates:** lint + typecheck green; every route console-clean; full click-through verified (Landing role section incl. AI cards, Explore list + map view with 56 state paths + 7 markers off the `us-atlas` CDN, sign-up chain end-to-end into the `/dashboard` stub).

## Deliberate keeps (not debt surprises)

- **Local `Icon.tsx`**: Kayla's 5 icon names (`info`/`robot`/`wrench`/`code`/`clipboard`) aren't in the packaged `@rc/ui` Icon — union them in the atoms pass, then drop the local copy.
- **Local montserrat-500 face**: `@rc/ui` ships only the 700 heading weight; v1.1 candidate.
- **`us-atlas` CDN topojson**: fine for a prototype; vendor only if offline use appears.
- Kayla's ~90 hex literals and the 3 dead `font-montserrat` classes stay for **Pass 5** (tokenization) as planned.

## Awaiting Caelan (blocked by the git-push deny rule)

Local archive tags exist in career_dashboard. To close the branches, run (e.g. via `!` in a session):

```
cd ~/Desktop/Capstone/Prototypes/career_dashboard
git push origin tag archive/homepage-and-explore tag archive/sign-up-flow
git push origin --delete homepage-and-explore sign-up-flow
```

## State at end of session

- `robotics_career`: main @ `2a89b55`, clean tree, pushed with all 3 commits; dev on 5186.
- career_dashboard: untouched except two local tags (`archive/homepage-and-explore`, `archive/sign-up-flow`); its pre-existing local doc modifications were left alone.
- explore_floor: docs-only changes (this note, `ECOSYSTEM_RUN.md` Pass-3 tick + ruling amendments, `STATUS.md`).
- Ledger: Passes 1–3 ✅; Pass 4 (harness port) next; 5–7 + stretch queued.

## Next session

Pass 4 per the run sheet: hand-port the harness into `robotics_career` (dashboard's `capture-figma`/`pull-figma`/`phase-check` + token-slimdown conventions, this repo's README onboarding shape), regenerate per-project pieces, seed FIGMA_MAP with Kayla's key as pull-only design source. The repo it lands in now exists and is green.
