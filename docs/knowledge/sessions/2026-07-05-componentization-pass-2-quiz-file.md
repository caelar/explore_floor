# Componentization Pass 2 — Interest Quiz file (partial)

**Date:** 2026-07-05 · **Decision:** D-045 · **Run sheet:** `COMPONENTIZATION_RUN.md` (Pass 2) · **Manifest:** `docs/figma/FIGMA_MAP.md` §8

> **Resume here.** Pass 2 is **partial and committed** (docs only — no push). In the Interest Quiz file (`pjgrRJS5YYII1iciW7Pak2`) I created a **`Components` page** (`84:96`) and built **5 local masters** — Chip `84:99`, StatBox `87:105`, ChoiceRow `90:80`, TierBadge `94:134`, HeroArrow `94:139` — then swapped their occurrences to instances, plus the shared **TopNav ×9** (every nav header, guest pill → **Guest / "G"**) and **CtaButton ×1** (Landing "Start the story"). All 9 frames re-verified pixel-faithful. **Next is Pass 2b:** the deferred tail below. The results **toolbar pills and icon-CTAs are BLOCKED** on an icon slot — `PillButton` and `CtaButton` are label-only, so that work pairs with a **Pass-1 library change** (add a leading-glyph slot), which needs Caelan's DS-library republish. Local components stay local (ruling 7), so nothing else in Pass 2 needs Caelan.

## What shipped

Method (proven, L-009 generalized): extract each master by **cloning a token-bound occurrence** → `createComponentFromNode` → name → `addComponentProperty` + bind the text node; then swap each occurrence (create instance → `setProperties` → position at the original's index → remove the original). Bound paints carry over on clone, so no re-binding was needed.

| Master | Node | Props | Instances swapped |
|---|---|---|---|
| Chip (glass) | `84:99` | Label | 4 (`25:369/620/778/781`) |
| StatBox | `87:105` | Label, Value | 8 full-size pairs |
| ChoiceRow | `90:80` | Label | 5 (MC + bucket rows) |
| TierBadge | `94:134` | Label | 1 ("Entry level") |
| HeroArrow | `94:139` | — (glyph override) | 2 (carousel Prev/Next) |
| TopNav (shared) | `664:73` var | Auth=In/Sec=Off | 9 nav headers |
| CtaButton (shared) | Filled/Gold/lg | Label | 1 (Landing) |

## Decisions this session

- **Nav guest pill → converge (Caelan-approved).** The shared `TopNav In+Off` nests the dashboard `ProfileMenu` (24px avatar + initial), not `AppHeader.tsx`'s 28px person-icon "Guest" pill. Asked Caelan; he chose **converge to the shared component** (Guest / initial "G") over fixing the master or keeping a local header. Logged as a Pass-4 code reconcile.
- **Compare Education StatBox.** `CompareColumn` renders Education as a `font-body` bulleted `<ul>`, not the h4 single value — the initial swap flattened it to a stray "•". Fixed by setting the correct multi-line bulleted Value + an instance override (Roboto 16/22 bound to `Color/Dark/Text On Dark Muted`). Both compare-Education boxes are now faithful StatBox instances.
- **Token call: keep.** No new library publish — `#595959` stays raw, whites stay aliased to `On CTA`; the only new fill is variable-bound.

## Deferred to Pass 2b (nothing destroyed; all remain faithful original frames)

1. **SignalBars** (×4) — responsive-width tracks + a `Highlight` variant (Tech-gold / Spec-teal) + fixed-fill recompute; extract-and-swap is lossy as-is.
2. **Results toolbar pills → PillButton**, **icon-CTAs "Continue"/"Role overview" → CtaButton** — **BLOCKED on an icon slot** (both sets are label-only). Pair with a Pass-1 library add, then swap in Pass 2b.
3. **RoleTabs** (2 strips) — `RoleTab` item + `Active` variant. **QuestionCard / SceneCard** — low capture repetition. **BridgeProgramRow** — not in the captured frames. **Compact StatBox/SignalBars** (JobSidePanel) — `Size=Compact` follow-up.

## Lessons

- **Inspect an occurrence's structure before destroying it.** The compare-Education box had an extra bullet node + a different body style; blind `texts[1]` capture grabbed "•". Cheap `findAll(TEXT)` + a look at the source (or the code) before `remove()` avoids the round-trip.
- **The shared button sets are label-only.** `PillButton`/`CtaButton` have no icon slot — a real constraint that blocks every icon-bearing pill/CTA in the quiz. Surfaced here; the fix is a Pass-1 library change, not a Pass-2 workaround.
- **Imported library sets can't be `remove()`d** (protected remote refs) and don't clutter the canvas — leave them.
