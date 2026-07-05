# Componentization Pass 1b — shared-tier icon slot

**Date:** 2026-07-05 · **Decision:** D-046 · **Run sheet:** `COMPONENTIZATION_RUN.md` (Pass 1b) · **Manifest:** `docs/figma/FIGMA_MAP.md` §7 (PillButton) + `career_dashboard/docs/figma/FIGMA_MAP.md` §6 (CtaButton)

> **Resume here.** Pass 1b is **built and verified in the DS library** (`afi5Q5nFtcnT9HJ04Cbylg`, page `Buttons`) — docs committed, no push. Both shared button sets now carry **additive leading + trailing icon slots**, defaults off, token-bound per variant: **PillButton** (`686:2`) and **CtaButton** (`608:7`). Nothing changed for existing consumers (verified). **The one remaining gate is Caelan's DS-library republish** — it now bundles the still-pending Pass-1 old-master deletions **and** these icon slots. After the republish, **Pass 2b** swaps the results toolbar pills → PillButton and the icon-CTAs → CtaButton (glyph map in `COMPONENTIZATION_RUN.md`). The compare dropdown (`CompareTargetMenu`) stays carved out — a quiz-local master for Pass 2b, untouched here.

## What shipped

Four additive component properties per set, plus a Material Icons text node before the Label (leading) and after it (trailing) in every variant.

| Set | Node | Prop keys | Icon size | Gap |
|---|---|---|---|---|
| **PillButton** | `686:2` | `Show Icon Left#728:0` / `Icon Left#728:6` / `Show Icon Right#728:12` / `Icon Right#728:18` | 18 (all 36h) | `itemSpacing` 0 → 8 |
| **CtaButton** | `608:7` | `Show Icon Left#731:0` / `Icon Left#731:6` / `Show Icon Right#731:12` / `Icon Right#731:18` | lg 18 / md 16 | already 8 |

- `Show Icon Left/Right` = BOOLEAN, **default false**. `Icon Left/Right` = TEXT (Material Icons ligature; placeholder defaults `arrow_back` / `arrow_forward`, overridden per instance).
- Each icon node = Material Icons Regular, `lineHeight` = fontSize (px), `visible=false`, `componentPropertyReferences = { visible, characters }`.
- **Fill (L-009 clone method):** the icon's `fills` is a deep clone of its own variant's Label `fills`, so the bound variable carries over verbatim — the icon ink follows the token per variant with no re-binding.
- **Extraction (L-009):** treatment lifted from the bound results pills `25:297` "Compare roles" (lead `compare_arrows`, 19px) and `25:303` "Skip to map" (trail `arrow_forward`, 18px) in the quiz file — not authored from scratch.

## Verification

- **Non-breaking.** Icons-off masters are pixel-identical to the pre-edit baseline (screenshotted both). Instance census across the ecosystem: **zero** PillButton instances anywhere; CtaButton has exactly one dashboard instance (`325:1202` "Sign Up", Board Parts) and one quiz instance (`93:83` Landing "Start the story"). Both consumers are remote instances frozen on the last-published version, so they show no change now; a **post-republish simulation** (fresh Gold/lg instance, Label "Sign Up", icon props at default) renders label-only at 120×36 with the Label override preserved and both icons hidden — pixel-identical to the dashboard baseline. Inserting a leading sibling does not reset overrides (Figma maps overrides by node ID, not index).
- **Token-bound.** Read `boundVariables` on all 10 variants: label == iconLeft == iconRight for every one (PillButton: Ink `6:8` / On CTA `370:3` / Near Black `134:73` / Text On Dark `513:4`; CtaButton: On CTA `370:3` / Ink `6:8` / Near Black `134:73`). `get_variable_defs` on both sets returns only tokens — no raw hex introduced.
- **Renders correctly on.** Temp instances (deleted after): PillButton Dark/Gold "Compare roles" (lead `compare_arrows` + trail `arrow_forward`) and Light/Teal "Set as target" (lead `star`); CtaButton Gold/lg "Role overview" (trail `arrow_forward`) and Outline/md "Back" (lead `arrow_back`). Leading/trailing placement, 8px gap, vertical centering, and per-variant ink all correct; heights held (36 / md 32).

## Decisions this session (execution calls under D-046)

- **Icon size tracks the Size axis on CtaButton** (lg 18 / md 16) so the glyph stays proportional to the button; PillButton is uniform 18 (all one height). Both within the spec's "~16–18".
- **PillButton `itemSpacing` 0 → 8.** Needed so the gap appears when an icon shows. Safe: a hidden auto-layout child contributes no gap or width, so label-only rendering is unchanged (confirmed by the baseline-parity screenshot).
- **Placeholder glyph defaults** `arrow_back` (left) / `arrow_forward` (right) — hidden by default, overridden per instance in Pass 2b.

## Next

**Caelan republishes the DS library** (bundles Pass-1 deletions + these icon slots) → **Pass 2b**: swap the results toolbar pills → PillButton and icon-CTAs → CtaButton per the glyph map, plus the deferred local tail (SignalBars, RoleTabs, cards, compact variants) and the compare dropdown as a quiz-local master.
