# 2026-07-04 — Componentization Pass 1: shared tier built (3 sets) + dashboard TopNav swaps

**Resume here.** Pass 1's **shared-tier build is done** and the **dashboard TopNav swaps are done**; the pass is **not fully closed** — it still needs Caelan's **Publish №2**, the **old-master retirement**, and the **FIGMA_MAPs ×3**. Built this session in the DS library (`afi5Q5nFtcnT9HJ04Cbylg`): the **TopNav mega set** (`636:40`, reshaped — see below), the **PillButton set** (`686:2`), and the **form family** (new `Forms` page `694:2`: FormField/OptionRow/OAuthButton/HintRow/StepFooter). All token-clean (raw-hex audit across all 10 masters returned only the pre-existing `CardDismiss` white). Caelan did **Publish №1**, then I swapped all **3 dashboard boards'** TopNav → the new `Auth=In, Secondary=On` variant and deleted their separate SecondaryNav. **Next actions, in order:** (1) Caelan **Publish №2** (pushes the mega set/Chip/form updates + will carry the retirements); (2) **retire** the 3 old DS masters `TopNav 262:30` / `MetaChip 184:8` / `GoldChip 183:2` (destructive — pairs with Publish №2; the dashboard no longer references them and the other consumer files use local masters, but confirm with Caelan before deleting); (3) **FIGMA_MAPs ×3** (career_dashboard §6 gains CtaButton/Chip/TopNav/PillButton rows + the SecondaryNav-nested-in-TopNav note; explore_floor gains a DS-components section; robotics_career gains the 5 form rows); (4) tick Pass 1 in `COMPONENTIZATION_RUN.md`, commit each repo (no pushes).

## The TopNav model was reshaped at build time (reverses D-042 ruling 3) — see D-044

Caelan steered this live; the built model differs from the ratified D-042 spec:

- **OverHero dropped entirely.** "Makes little to no sense in the current prototype, and after revision it will make none." The `Scroll` axis is gone.
- **`Secondary` is an independent variant axis, not tied to Auth.** The secondary nav is **dashboard-only** — a logged-in *quiz* user (the Guest pill) has no secondary. So: `Auth`{In,Out} × `Secondary`{On,Off}, **3 shipped combos**:
  - `Auth=In, Secondary=On` (`626:53`) → **dashboard** (profile pill + secondary row, 102px)
  - `Auth=In, Secondary=Off` (`664:73`) → **quiz** (profile pill, no secondary, 60px)
  - `Auth=Out, Secondary=Off` (`632:38`) → **marketing/logged-out** (Resources ▾ · Sign In · gold Sign Up, 60px)
- **SecondaryNav stays its own published component** (`260:2`); `In+On` **nests an instance** of it (not a duplicate). In code it is composed separately (`App.tsx` renders `<TopNav/>` then `<SecondaryNav/>`), so FIGMA_MAP must note `Secondary=On` = "compose SecondaryNav below," not a `<TopNav secondary>` prop.
- **Structure:** each variant is a transparent VERTICAL wrapper → inner `Bar` frame (near-black `134:73` fill + glass-border bottom) → `Container:margin`. `In+On` appends the SecondaryNav instance under the Bar.
- **Refinements (Caelan):** search is now **100% centered to nav width** (logo + right slot each wrapped in equal FILL columns, search fixed 440 in the middle → center x = 720 in all variants); the nested SecondaryNav **edge padding = 16px** to match the top bar (first pill edge aligns with the logo); `Resources` + `Sign In` use the **List Row** text style (not hand-rolled Roboto Medium 16).
- Set doc backdrop bound to `Surface 2` (`133:73`) — no raw hex.

## PillButton (`686:2`)

`Surface`{Light,Dark} × `Fill`{Gold,Teal,Outline}, **5 shipped combos** (no Dark/Teal). Radius `radius/full`. `Label` TEXT prop. Light labels = List Row (R.Med 14); Dark Gold = Item Title (16), Dark Outline = Body/Default (16). Light Gold=ARM Gold+Ink px32; Light Teal=Secondary Teal+On CTA px32; Light Outline=Ink stroke+Ink label px32; Dark Gold=ARM Gold+Near Black px24; Dark Outline=Glass Border stroke+Text On Dark px16. Near-black doc backdrop behind the Dark row (page sibling) so the Dark Outline reads. All token-bound.

## Form family (`Forms` page `694:2`, inserted before Shell Chrome)

5 staged COMPONENTs moved + props wired: **FormField** (`621:89`, `Label` + `Show Icon` boolean on the visibility eye); **OptionRow** (now the set `695:13` — `Glyph`{Checkbox,Radio} × `State`{Unchecked,Checked}, 4 variants, teal `6:4` accent on checked, `Label` prop); **OAuthButton** (`621:95`, `Label`); **HintRow** (`621:98`, `Label`); **StepFooter** (`621:101`, `Continue Label` + `Skip Label` + `Show Skip` boolean).

## Dashboard swaps done (file `7t46ROAv93lIQRspgaslgz`)

All 3 boards on the `Boards` page swapped: TopNav (old key `6d1a30…`) → `In+On` (key `ded8be…`), resized to 1400×102, separate SecondaryNav deleted. Boards: Training-Seeker (`120:56`, nav `120:57`), Job-Seeker (`121:381`, nav `121:382`), Check-in active (`129:704`, nav `129:705`). Verified: Dashboard pill active, counts + "8 New" intact, secondary aligned to the top bar. **Chip swap is moot** — a full-file scan (Boards + Widgets pages) found **zero** MetaChip/GoldChip instances in the dashboard; the Chip fold stands in the DS library but there was nothing to migrate here.

## Double-check (Caelan asked) — this + previous chat

Raw-hex audit across all 10 Pass-1 masters: clean except the pre-existing `CardDismiss` master white `#ffffff` (×2 hidden instances in CardHead — not introduced by either componentization chat; a white token exists to bind if we ever touch it). Previous chat verified correct: **CtaButton** 5 variants, Gold-lg radius **8px and token-bound** (D-043); **Chip** 5 combos + `Show Icon`; **CardHead** dismiss slot (`Dismiss`/`Show Dismiss`) present.

## Keys the next session will need (published)

- TopNav variants: In+On `ded8be8c8d062e940b5828319cd1929bcc9c8c94` · In+Off `ac27fc11f8fd3ec9ceac25460680b8f923baa6a4` · Out+Off `0b0673a3a1ce8facfe278570d3cac9322c9a3cc0`
- Chip variants: Teal/Eyebrow `cc96325db70925a9a3b1baa77484860c5f5806f6` · Teal/Caption `855ca5892b2aa1ba7e95ae47142e6aa7e442cc1a` · Closed/Eyebrow `d6dc957e6a9af581318164b15e1d84373536d858` · Outline/Caption `779e7fc64ae4856102183afc961d60ea74b05ce3` · Gold/Eyebrow `ea15802ffecf2b759030d3242320213a097eca6e`
- Old masters to retire: TopNav `6d1a300bc755948c95566ad914c2e9f60afe02fc` (`262:30`) · MetaChip `f4ec8504dd76f82c8f115a74a0ad9974827ad38b` (`184:8`) · GoldChip `03ada4ddeff8e7391b0d0b12495e42e6accc41dd` (`183:2`)

## Facts the next session should not re-derive

- Cross-file swap = `figma.importComponentByKeyAsync(key)` → `instance.swapComponent(imported)`; a Dashboard instance's `mainComponent.id` is a local import, so **match old masters by `.key`, not node id**.
- A `use_figma` **transport drop mid-call ≠ atomic failure** — the script may have executed; **read state to confirm before retrying** (the board-1 swap succeeded through a dropped response).
- Caelan flagged a **future idea: collapse the two button sets** (CtaButton + PillButton) — a later decision, explicitly not now.
