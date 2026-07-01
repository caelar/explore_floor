# Design-System Run: the queue for the shared-tokens effort

_Snapshot 2026-07-01. Branch `narrative-v3-realign`._

The **`rc-design-system` shared package** and the **`/capture-figma`** of the final dark screens were both **deferred out of the 2026-07-01 hygiene pass** and belong to a dedicated **design-system run** (planned for later today). This doc is that run's reference: everything queued for it, in one place, so the run doesn't have to re-discover scope.

The authoritative build sheet is **`archive/REALIGNMENT.md` §10** (with §6 Rec B, §7 Rec C, and D-024/D-029 for the "kit-align in-repo now, defer the package" call). This is a pointer + checklist, not a re-spec.

---

## 1. Stand up the `rc-design-system` package (`archive/REALIGNMENT.md` §10, steps 0–6)

The whole package extraction stays deferred by decision (Caelan overrode §10's "the trigger is now" framing: kit-align in-repo first, package after). What remains unbuilt, all by design:

- **Step 0 — store-free atom audit.** Pre-extraction pass to confirm the candidate atoms are decoupled from any store.
- **Step 1 — scope atoms by intersection.** The intersection-scoped atom list: `CtaButton`, `Card`/`CardHead`, `Chip`, `StatusPill`, `Ring`, `Meter`, `MetaRow`, `Icon`. Tokens, fonts, and base styles ship; **not** a full component library.
- **Step 2 — create the repo** with a real `package.json` exports map (the JSON block in §10).
- **Step 3 — move canonical tokens in:** the kit `@theme` + a flattened `tokens.css` + `FIGMA_MAP.md`.
- **Step 4 — (folded into 3).**
- **Step 5 — convert consumers.** Point both `career_dashboard` **and** `explore_floor` at the package (`"@rc/ui": "github:caelar/rc-design-system#v1"`, the recommended git-dependency distribution), delete their local token authorship, and repoint `/design-sync` to source from it. Also bundle the real React atoms (`componentSrcMap` + esbuild) into the Claude Design project so exploration renders real components, and rename that project to "RC Design System".
- **Step 6 — scaffold the three unborn prototypes** (Homepage, Sign-Up Flow, Explore Jobs & Trainings) on `@rc/ui` from the first commit. §10 calls this the largest payoff.

**Source-of-truth roles** (§10): Figma DS library = canonical for *values*; the `rc-design-system` repo = canonical for *code*; the Claude Design DS project = downstream mirror. Tokens flow one way, outward from code.

**Explicit consequence to undo here:** `explore_floor/src/styles/globals.css` still **authors its own dark `@theme` locally** — an intentional artifact of the deferral. Rec C's "one canonical source" end-state is only partially realized until step 5 repoints this repo at the package.

## 2. `/capture-figma` the final dark screens

Capture the final dark results + quiz screens into the Fivestar Figma handoff (team-demand-gated: "if the team wants them in the Figma handoff"). No session note records a capture of the final screens yet, so the decision is unmade pending team preference. Do it in this run so the Figma file the client receives matches the built prototype. This run is also the natural time to reconcile `/capture-figma` against the shared-package components (System A Figma / System B Claude Design).

## 3. Smaller optional alignments (from `archive/REALIGNMENT.md` §8 Rec D)

- **`.claude/launch.json`** to pin dev/preview ports. Not present on disk; explicitly optional.
- A **conscious MCP/plugin-delta decision** (this repo enables firecrawl + the commit-commands plugin; the dashboard does not). Never formally actioned.
- **Reuse the dashboard's Session Setup researcher test-bench pattern.** Likely moot now that the June study concluded (the narrative won); recorded for completeness.

---

## Go / no-go (worth one explicit call before handoff)

The risk `archive/REALIGNMENT.md` §10's timing section flagged is real: because the project ends at the late-July handoff, "defer until after ships" may mean the package **never happens**, which is the exact outcome that section warned against. Worth one explicit go/no-go before the July 21 handoff: either commit the design-system run now, or consciously accept that the two repos keep their local token authorship through handoff and the package becomes ARM/Fivestar's problem.
