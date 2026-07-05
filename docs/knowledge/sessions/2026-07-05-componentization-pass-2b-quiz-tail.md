# Componentization Pass 2b — Interest Quiz deferred tail

**Date:** 2026-07-05 · **Decision:** D-047 · **Run sheet:** `COMPONENTIZATION_RUN.md` (Pass 2b) · **Manifest:** `docs/figma/FIGMA_MAP.md` §8

> **Resume here.** Pass 2b is **complete and committed** (docs only, no push). In the Interest Quiz file (`pjgrRJS5YYII1iciW7Pak2`) the D-045 deferred tail is closed: the **7 results icon-pills/CTAs** were swapped onto the Pass-1b icon-slotted shared `PillButton`/`CtaButton`, and **3 net-new local masters** (`SignalBar` `127:175`, `RoleTab` `131:238`, `CompareTargetMenu` `134:263`) plus a **StatBox `Size=Compact`** variant (`117:7`) were built and swapped — 20 instances total, every affected frame re-verified pixel-faithful, all four masters token-clean. All local (ruling 7), no republish, nothing needed from Caelan. **Next core pass: Pass 3 — Captures file** (`robotics_career`). The remaining quiz tail is low-priority: QuestionCard (`25:96`), SceneCard (`25:149/224`), BridgeProgramRow (not captured), and the two Flow **Back** buttons (`25:188`/`25:249`, not in the glyph map).

## Sequencing (Caelan)

Icon-swaps-first: land the freshly-unblocked pill/CTA swaps (the reason Pass 1b was built), then the net-new masters, so the highest-value work banks early and the session can stop cleanly if it runs long. Executed A → E → B → C → D; all five landed.

## What shipped

**A — Results icon-pill / icon-CTA swaps (7).** Raw `<button>`/`<span>` toolbar controls → shared instances with the icon slots set (import-by-key, `setProperties` the `Show Icon`/`Icon` props):

| Control | Instance | Variant | Icon |
|---|---|---|---|
| Compare roles | `108:32` | PillButton Dark/Outline | lead `compare_arrows` |
| Skip to map | `110:138` | PillButton Dark/Outline | trail `arrow_forward` |
| Back to Technician | `111:141` | PillButton Dark/Outline | lead `arrow_back` |
| Back to Technician careers | `111:149` | PillButton Dark/Outline | trail `arrow_forward` |
| Set as target role | `111:145` | PillButton Dark/Gold | lead `star` |
| Role overview | `112:171` | CtaButton Filled/Teal/lg | trail `arrow_forward` (FILL width + 54h) |
| Continue (Flow) | `114:105` | CtaButton Filled/Gold/lg | trail `arrow_forward` |

Validated each against the baseline before destroying (dropped a test PillButton next to the real pills on the dark bar — indistinguishable, 163 vs 166px). "Explore careers" conditional gold pill isn't in the settled captures → no swap.

**B — SignalBar** (`127:175`): `Highlight`{Technician,Specialist,Off} × Label/Value. Single bar row — label `w-20` + responsive FILL track (`#1b1b1b`, radius 6, clips) + `%` value. Active = role accent fill (bound `role-technician` gold / `role-specialist` teal) + `text-on-dark`; Off = `#595959` raw + `text-on-dark-faint`. Extracted L-009 from `25:332` (Tech) + `25:750` (Spec) + `25:341` (Off). **Fill width is data → per-instance resize** to the captured px (not a variant). Swapped 12 bars across `25:330`/`25:581`/`25:739`/`25:1031`. No Integrator-active variant (never appears; ruling 9).

**C — RoleTab** (`131:238`): `State`{Active,Inactive} × Label. Active = 2px `text-on-dark` underline + Bold; Inactive = transparent border + `text-on-dark-faint` Medium (Montserrat 16). One item serves both the 2-tab (`25:396`) and 3-tab (`25:1253`) strips; swapped 5 tabs inside their `Tab:margin` wrappers.

**D — CompareTargetMenu** (`134:263`, the D-046 carve-out): `Target`{Technician,Specialist,Integrator} swatch × Label/TargetName. `rounded-md` glass trigger, closed state. Swapped `25:544` → `136:238`.

**E — StatBox → set** (`117:7`): `Size`{Default,Compact}. Compact = `px-space-3 py-space-2`, value 20px. Swapped the 2 JobSidePanel compacts (`118:153`/`118:158`).

## Gotchas / lessons (for `LESSONS.md` if they recur)

- **`combineAsVariants` resets instance layout-sizing overrides.** Promoting StatBox to a set collapsed the 8 existing Default instances' FILL width → they overlapped. Fix: restore `layoutSizingHorizontal='FILL'` on every instance in a horizontal row. Also exposed that the Default value paragraph was a hardcoded FIXED 322 (not FILL) — made it responsive (a repair). **After any `combineAsVariants` on a component that already has instances, re-verify the instances' sizing on a real frame.**
- **Remote/imported variables aren't in `getLocalVariablesAsync`.** The `role-*` swatch vars are DS-library imports; `.find(v => v.name === 'Color/Role/Technician')` returned null → `setBoundVariableForPaint(p,'color',null)` silently unbound the swatch (left raw teal). Resolve imported vars via `getVariableByIdAsync` or walk the variable's collection (`getVariableCollectionByIdAsync`), then bind.
- **Screenshots on transparent bg invert emphasis.** Active `text-on-dark` (near-white) is invisible on the default checkerboard/white; faint text looks darker. Verify dark-frame components with a full-frame or dark-backed screenshot, not the isolated node.
- **Faithful master by variant-cloning, not re-authoring.** Build one variant fully (with props) from a bound occurrence, then `clone()` it for the other variants and change only the delta (fill binding / text emphasis). Clones preserve the prop keys, so `combineAsVariants` merges Label/Value into a single shared property (verified on StatBox, SignalBar, RoleTab, CompareTargetMenu).

## Sanctioned Figma-leads-code divergences (Pass 4)

Continue 139×46 → CtaButton lg 120×36; Role overview 354×54 → CtaButton lg full-width + 54h override; Set-as-target `px-space-4`→`px-space-3` (−15px); RoleTab inactive underline black→transparent. Full list: `FIGMA_MAP.md` §8 #4–#7.

## Verification

All affected frames re-screenshotted pixel-faithful (ResultsPanel, CompareView, JobOverview, ResultsConstellation, SceneSortView). `get_variable_defs` on `117:7`/`127:175`/`131:238`/`134:263` returns only tokens (the `#595959` SignalBar-Off keep has no library primitive — the §6 sanctioned raw keep). Components-page census clean; zero orphan temp build nodes on Results/Quiz Flow pages.
