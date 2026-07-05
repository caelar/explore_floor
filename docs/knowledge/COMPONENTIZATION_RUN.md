# Componentization run — the pass ledger

_Execution ledger for the cross-file **Figma componentization pass**, ratified by Caelan 2026-07-03 (D-041) out of the Interest Quiz eyeball pass. The work is split into single-session passes so each session starts cold from this doc without re-deriving the survey or re-litigating the rulings._

**Session protocol.** Same as `ECOSYSTEM_RUN.md`: start a pass by reading `STATUS.md`, then this doc's next unchecked pass. Finish a pass by ticking its gates here, updating `STATUS.md`, and writing a session note. The run is driven from `explore_floor` (ledger, session notes, decisions live here); hop to a sibling repo only for a slice that edits that repo's code or docs (the ecosystem run's Pass-5 precedent). The promotion registry (Pass 0's output) lives in `rc-design-system` so the shared tier describes itself after handoff. Each pass updates the owning repo's `docs/figma/FIGMA_MAP.md` — an ID there is ground truth.

## What this run is

The dashboard already invented the model: real published component sets in the DS library with variant axes, the PascalCase naming contract (React component name = Figma component-set name, variant axes = props), and FIGMA_MAP as the Code Connect substitute (we're on Education; Code Connect is Org/Enterprise-only). This run **extends that model to the other two consumer files and formalizes the promote-vs-local rule**: recurring elements become named component instances instead of loose frame contents, shared ones live in the DS library, file-local ones live on a per-file Components page (the Captures file's existing pattern).

**In scope:** the DS library shared tier, the Interest Quiz file, the RC.org Captures file, a bounded code-alignment pass (nav, buttons, Icon union), and conditionally the Dashboard file. **Out of scope:** the `@rc/ui` code atoms tier (unchanged stretch, `ECOSYSTEM_RUN.md`) except the Icon name union, which Caelan explicitly pulled in. Nothing here gates the July 21 handoff; the payoff is that the handoff files read as a real design system.

## Ledger

| Pass | What | Status |
|---|---|---|
| 0 | Audit + promotion registry, ratified by Caelan | ☑ 2026-07-03 (D-042) |
| 1 | Shared tier — build/reconcile component sets in the DS library, publish | ☑ 2026-07-04 (D-043/D-044) — built, published, dashboard swapped, old masters retired, FIGMA_MAPs ×3 done; only Caelan's final republish (to push the deletions) remains |
| 1b | **Shared-tier icon slot** — add optional leading/trailing icon to PillButton + CtaButton in the DS library; republish. Unblocks the Pass-2b results icon-pills. | ☐ (D-046) — handoff spec below; a Pass-1 amendment (library, ecosystem-wide), needs Caelan's republish |
| 2 | Interest Quiz file — local components + instance swaps | ◑ 2026-07-05 (D-045) — 5 local masters + shared nav/CtaButton swapped, all 9 frames pixel-faithful; SignalBars / RoleTabs / icon-pills / cards deferred to **Pass 2b** |
| 3 | Captures file — swap to library instances where promoted | ☐ |
| 4 | Code alignment — nav, buttons, Icon union (hops repos) | ☐ |
| 5 | (Conditional) Dashboard file reconciliation | ☐ |

Core order 0 → 1 → 2 → 3; Pass 4 can interleave any time after Pass 1's rulings are built. Minimum worthwhile cut if the pre-handoff window tightens: **Passes 0–2** (registry + shared tier + a componentized Interest Quiz file).

## The terrain (survey snapshot, 2026-07-03)

Full survey detail is in the 2026-07-03 session note; this is the operative summary.

| Surface | File key | State |
|---|---|---|
| DS library (shared) | `afi5Q5nFtcnT9HJ04Cbylg` | **22 published component sets** with real variant axes (Button, StatusPill ×20 variants, Ring, ProgressBar, Card ×4 states, CardHead, CardDismiss, CardEmptyState, TopNav, SecondaryNav + Pill, Footer, ProfileMenu, GoldChip, MetaChip, CountBadge, NewBadge, Text Link, CompanyLogo, StatusPopover…), from the dashboard's Phase-3/D-044 work. Component keys in `career_dashboard/docs/figma/FIGMA_MAP.md` §6. Variables: 113 (93 Primitives / 16 Semantic), 25 text styles, 6 effect styles. No light/dark mode split — dark is additive named tokens (D-029). |
| Dashboard | `7t46ROAv93lIQRspgaslgz` | 12 widget component sets (Size S/M/L) + board frames. Known gap: widget cards rebuild their own card surface instead of instancing the DS `Card` (its FIGMA_MAP §7 note). |
| RC.org Captures | `F3GRK7HNLLtG48vPosyXKw` | 12 screen frames + ~12 **local masters** on a Components page: `TopNavV2` set (State=Light/OverHero — the only variant set), `SiteFooter`, 7 auth primitives (`FormField`, `HintRow`, `OptionRow`, `StepFooter`, `OAuthButton`, brand icons, `CompetencyTile`), `Chip`, `FilterDropdown`, `JobCard` (7 instances). Nothing published to the library. |
| Interest Quiz | `pjgrRJS5YYII1iciW7Pak2` | 9 variable-bound plain frames (D-040), **zero components**. Node IDs in this repo's `docs/figma/FIGMA_MAP.md` §6. |

Code side, the clusters that matter: **buttons** (DS `Button`, dashboard `CtaButton`, explore_floor `Button` (rounded-md), robotics_career `GoldButton`/`GoldPill`/`OutlinePill`/`OAuthButton`, plus the quiz's pill-shaped results chrome); **chips** (dashboard `Chip` tone×size×weight + `StatusPill` sm/md + Figma-side `MetaChip`/`GoldChip`/`CountBadge`/`NewBadge`; robotics_career `Chip` + `SectionLabel`; quiz results `Chip`); **forms** (robotics_career only: `FormField`, `CheckboxRow`/`RadioRow`, `FilterDropdown`); **Icon** (three near-identical copies: packaged 47-name atom, explore_floor's extras, Kayla's 5 + ~33 raw `material-icons` spans); **cards/progress** (mostly already published).

## Standing rulings (Caelan, 2026-07-03)

1. **Create real Figma components** for anything reused within or across the robotics_career and explore_floor files; extend the dashboard's component model rather than inventing a new one.
2. **Nav: one mega set.** Fully specced below — Kayla's `TopNavV2` is divergent and gets brought in line. Code changes accepted.
3. **Buttons: standardize across the board.** The code ripple is accepted ("this will be a pass back to code"). robotics_career's buttons stay **local for now** — the expectation is they get brought in line with the common style later, not promoted as-is. The quiz's round/pill controls may justify a second set; if so Caelan **leans two sets** (rectangular CTA + pill). Ratify at Pass 0.
4. **Chips: consolidate.** The dashboard's chip-size sprawl is a real consolidation opportunity, not something to mirror faithfully. Reduce the matrix to what shipped screens actually use.
5. **Form family: promote.** The auth primitives could serve other surfaces; bring them into the shared tier.
6. **Icon: do the name union, in code.** Icons are font glyphs on the Figma side (no component work needed there); the union lands in `@rc/ui`'s `IconName` — the one `@rc/ui` code exception in this run (already deferred to "the atoms pass" by robotics_career's D-006 and the package's own Icon.tsx note).
7. **Quiz vocabulary stays local** to the Interest Quiz file (RoleCard, bucket-sort card, StatBox, SignalBars, RoleTabs…). Vectors (radar, bubbles, constellation) stay plain geometry per the FIGMA_MAP §2 contract.
8. **Dark/light: no Figma-mode restructure.** The additive named-token model stands. A shared component gets a `Surface=light/dark` variant axis only where it genuinely ships on both; dark-only components bind dark tokens directly. (A mode restructure would invalidate 113 variables' worth of documented bindings for zero handoff payoff.)
9. **Variant discipline:** a component earns a variant axis only when the states/tones actually appear in shipped screens. StatusPill's 20 earned theirs; don't build speculative matrices.

## The nav mega set (the specced ruling)

One shared top-nav component set replaces the three divergent navs. Anatomy: the 60px near-black utility bar — brand lockup left, **centered** scoped search, right slot varies by auth state.

- **The centered-search version wins.** explore_floor's `AppHeader` (`src/components/AppHeader.tsx`) is the reference implementation — it is the dashboard `TopNav` ported with the search actually centered, and that's really the only difference between them.
- **`Auth=in`:** right slot = profile pill. Reference: the bound `Landing` capture in the Interest Quiz file (node `25:32`) already carries this state token-bound — extract the master from it rather than authoring from scratch.
- **`Auth=out`:** right slot = `Resources ▾` + divider + `Sign In` text link + gold `Sign Up` pill CTA. Reference image: **`docs/reference/nav-logged-out-target.png`** (Caelan, 2026-07-03).
- **Dashboard:** tier 1 of its two-tier nav is replaced by the set (`Auth=in`). Tier 2 (`SecondaryNav`) is **dashboard-only** — it stays its own published component, outside the mega set.
- **robotics_career:** logged-out screens use `Auth=out`; logged-in state uses `Auth=in`. `TopNavV2`'s current design is retired by this ruling. Pass 0 ruling (D-042): the over-hero idea survives as a **`Scroll=Solid/OverHero` axis** — OverHero is the Auth=out design with the bar background removed, lightly adapted for legibility over the hero photo (text/ink switches). Only shipped combo: Out+OverHero (the marketing Landing).
- **Boundary:** only things that are literally the nav bar join the set. Page-local headers that aren't nav elements are not forced in.
- Nav guidance received at Pass 0 (2026-07-03): the reference image plus the OverHero ruling above is the full spec; no further screenshots needed.

## Pass specs

**Pass 0 — audit + promotion registry.** Read-only outside the registry itself. Build the cross-file duplicate matrix (start from the terrain above; fresh-read the thin spots — robotics_career's file-internal screen components, the quiz results vocabulary). Decide per cluster: **shared** (DS library) / **local** (per-file Components page) / **not a component** (true one-off). Settle with Caelan: button one-vs-two sets (he leans two, pill + rectangular, if the quiz's pill chrome justifies it), which chip sizes/tones survive consolidation, the TopNavV2 scroll-state fate, and his further nav guidance. Output: a promotion registry in `rc-design-system` (new `REGISTRY.md` or a `conventions.md` section — decide there) listing every promoted set with its variant axes, owner, and consumers, plus each file's local tier. **Gate: Caelan ratifies the registry.**

**Pass 1 — shared tier.** In the DS library via the Plugin API: build the new sets (nav mega set, button set(s), form family) and reconcile the existing ones (chip consolidation, CardHead action slot — the dashboard's DEF-012 gap). Cheapest master source is extraction from existing token-bound frames (Interest Quiz `25:32` for `Auth=in`; the Captures file's masters for forms) — the L-009 lesson generalizes: never author from scratch what a bound frame already contains. Author the `Auth=out` right slot from the reference image. Publish; update each owning repo's FIGMA_MAP (each repo documents its own rows, the additive model). Gate: sets published, `get_variable_defs` on new masters shows token-bound paints, FIGMA_MAPs updated.

**Pass 2 — Interest Quiz file.** Create the Components page, build the ratified local masters (quiz tier), swap recurring elements across the 9 frames to instances — shared sets where promoted, local masters otherwise. Appearance must stay pixel-faithful (the nav should not change: explore_floor's is the set's reference). The unpublished code tokens `--color-text-subtle` and `--color-white` will resurface as component fills here — decide publish-or-keep then, in this repo's FIGMA_MAP terms. Gate: per-frame visual verification still passes; FIGMA_MAP gains the component/instance registry.

**Pass 3 — Captures file.** Swap its local masters to library instances where promoted: nav → mega set (an intentional visible change — the file will lead the code until Pass 4), forms → the shared family. `JobCard`, `SiteFooter`, `CompetencyTile`, brand icons stay local. Enumerate every intentional Figma-leads-code divergence in the session note. Gate: robotics_career FIGMA_MAP updated; divergence list written.

**Pass 4 — code alignment (hops repos).** The accepted pass-back-to-code: dashboard tier-1 `TopNav` swaps to the centered-search design; robotics_career implements the two nav auth states; button standardization lands per the registry; the Icon name union lands in `@rc/ui` (version bump + tag; robotics_career picks it up and clears its ~33 raw `material-icons` spans per its own rubric's `icon-atom` criterion). Each repo's own gates apply (lint / typecheck / tests, design review for visual changes).

**Pass 5 — conditional, dashboard file.** Widgets instance the DS `Card`; the chip consolidation ripples through the widget sets. Only if the last week is calm — the dashboard file is already the strongest artifact.

## Contract notes

- **Figma may lead code during this run** — a deliberate, temporary inversion of the normal code→Figma mirror rule, confined to Passes 1/3 and closed by Pass 4. Every divergence gets enumerated in the pass's session note; none may survive the run.
- **Known debts folded in** (don't re-discover them): the dashboard widget-Card instancing gap; DEF-012's CardHead action slot; the Icon union + robotics_career raw spans (D-006); robotics_career's four-way button divergence; explore_floor's two unpublished code tokens.
- **Pipeline:** this is Plugin-API restructuring work, proven at the 502-paint scale (L-009). Frame-to-component extraction and instance swapping are heavier than paint binding — treat each pass as a full session.

## Pass 0 outcomes (settled 2026-07-03, D-042)

The registry itself is `rc-design-system/REGISTRY.md` — ratified by Caelan. The five open questions resolved:

1. **Buttons: two sets.** `CtaButton` (rectangular: Style=Filled/Outline × Color=Teal/Gold × Size=lg/md, shipped combos only; the 6px-vs-8px radius call settles at the Pass 1 master build) + `PillButton` (Surface=Light/Dark × Fill=Gold/Teal/Outline). Evidence: the dashboard is rectangular 6px, the quiz results chrome and *every* robotics_career CTA are 36px pills. The kit-verbatim Figma `Button` (`10:14`) stays as a kit-provenance reference, not-for-app-use.
2. **Chip consolidation: fold `MetaChip` + `GoldChip` into one shared `Chip`** (the 5 shipped combos + a Show Icon boolean; code already retired GoldChip into `Chip tone="gold"`). `CountBadge`/`NewBadge` stay distinct (18px nav micro-badges nested in the published `SecondaryNav/Pill`); `StatusPill` untouched.
3. **`TopNavV2` scroll states: kept** as the mega set's `Scroll=Solid/OverHero` axis (Caelan overruled the drop recommendation — the marketing hero treatment is a real designed state). Spec in the nav section above.
4. **Registry home: `REGISTRY.md`** at the rc-design-system root, with a pointer line in `conventions.md`.
5. **Nav guidance: received** — the reference image + the OverHero ruling; no further screenshots.

Audit facts recorded for later passes: Icon union = **61 names** (47 packaged + 10 explore_floor + 4 robotics_career live extras; dead `wrench` and dup `close` dropped); explore_floor's `ProgressBar`/`SegmentedControl` are orphaned at zero call sites (deletion candidates); the reference image's Sign Up CTA is a rounded-rect gold button (a `CtaButton`, not a pill).

## Pass 1 outcomes (2026-07-04, D-043/D-044)

Built in the DS library (`afi5Q5nFtcnT9HJ04Cbylg`), all token-clean (raw-hex audit across 10 masters found only the pre-existing `CardDismiss` white):

- **TopNav mega set** (`636:40`) — **reshaped from the D-042 spec** (D-044): OverHero dropped; `Secondary` is an **independent axis** (not tied to Auth); `Auth`{In,Out} × `Secondary`{On,Off}, 3 shipped combos — `In+On` dashboard / `In+Off` quiz / `Out+Off` marketing. `SecondaryNav` (`260:2`) nests as an instance in `In+On`. Search centered to nav width; nested-secondary padding = 16px; Resources/Sign In on List Row.
- **PillButton** (`686:2`) — `Surface`{Light,Dark} × `Fill`{Gold,Teal,Outline}, 5 shipped combos, `radius/full`, `Label` prop.
- **Form family** (`Forms` page `694:2`) — FormField (+`Show Icon`), OptionRow set (4 variants: Checkbox/Radio × Checked/Unchecked, teal accent), OAuthButton, HintRow, StepFooter (+`Show Skip`); all with TEXT props.
- **CtaButton** radius = **8px** (D-043, token-bound); **Chip** + **CardHead** slot verified from the previous chat.

**Sanctioned Figma-leads-code divergences** (enumerate at Pass 4): dashboard board TopNav instances swapped to `In+On` (each board's separate `SecondaryNav` deleted; the two-tier is now one component instance) — verified clean (active pill + counts intact). **Chip swap was moot** — zero `MetaChip`/`GoldChip` instances anywhere in the dashboard file. `Secondary=On` maps to composing `<SecondaryNav/>` in code, **not** a `<TopNav>` prop.

**Pass 1 closed 2026-07-04:** old masters `TopNav 262:30` / `MetaChip 184:8` / `GoldChip 183:2` **retired** (kit-verbatim `10:14`/`14:2`/`16:2` provenance kept); **FIGMA_MAPs ×3 done** (career_dashboard §6 `782a7be`, explore_floor §7 `7c098e9`, robotics_career `e1b3b0a`). New DS keys: CtaButton `c3215d14…`, Chip `a51417db…`, TopNav mega set `f69105be…`, PillButton `ce4f8c7d…`, FormField `88dd923c…`, OptionRow `d31a14f7…`, OAuthButton `431abdb5…`, HintRow `5067f0a9…`, StepFooter `b3c1d94b…`. **Only Caelan's final DS-library republish remains** (to push the 3 deletions as deprecations). Next core pass: **Pass 2 — Interest Quiz file**.

## Pass 2 outcomes (partial, 2026-07-05, D-045)

Componentized the 9 Interest Quiz frames (`pjgrRJS5YYII1iciW7Pak2`). Full manifest: `docs/figma/FIGMA_MAP.md` §8. **Local components stay local** (ruling 7) — no library publish needed, so Pass 2 needs nothing from Caelan.

**Done (all 9 frames re-verified pixel-faithful):**
- New **`Components`** page (`84:96`); 5 local masters extracted from token-bound occurrences (L-009): **Chip** `84:99`, **StatBox** `87:105`, **ChoiceRow** `90:80`, **TierBadge** `94:134`, **HeroArrow** `94:139`.
- Instance swaps: **Chip ×4, StatBox ×8, ChoiceRow ×5, TierBadge ×1, HeroArrow ×2** + shared **TopNav ×9** (`Auth=In,Secondary=Off`, guest pill → Guest/G) + **CtaButton ×1** (Landing gold).
- Token call: **keep** — `--color-text-subtle` (#595959) raw, whites aliased to `On CTA`; no unbound hex introduced (the one new fill, compare-Education body, is bound to the muted variable).

**Sanctioned Figma-leads-code divergences (Pass 4):** (1) nav guest pill converges to the shared ProfileMenu (initial "G" vs AppHeader's person-icon; Caelan-approved); (2) Landing CTA normalized to CtaButton lg 120×36 (was 149×46); (3) compare Education StatBox body normalized (bulleted `<ul>` → StatBox Value override).

**Deferred to Pass 2b (nothing destroyed — these are still faithful original frames):**
- **SignalBars** (×4) — needs responsive tracks + `Highlight` variant (Tech-gold/Spec-teal) + fill recompute.
- **Results toolbar pills → PillButton** and **icon-CTAs ("Continue", "Role overview") → CtaButton** — **blocked:** both sets are label-only; the targets carry icons. Needs a Pass-1 library change (add an icon slot), then swap.
- **RoleTabs** (2 strips) — `RoleTab` item with `Active` variant; **QuestionCard / SceneCard** — low capture repetition; **BridgeProgramRow** — not in the captured frames; **compact StatBox/SignalBars** (JobSidePanel) — a `Size=Compact` follow-up.

**Next:** **Pass 1b** (the shared-tier icon-slot add — handoff spec below) → Caelan republishes → **Pass 2b** (the deferred local tail + the icon-pill/CTA swaps) → **Pass 3 — Captures file**. Pass 1b and Pass 2b are separate sessions on purpose (1b edits the shared library and needs a republish; 2b's local work is unblocked and can run anytime).

## Pass 1b — shared-tier icon slot (handoff spec, D-046)

**Why:** Pass 2 found `PillButton` and `CtaButton` are **label-only**, blocking every icon-bearing results pill/CTA. This is a Pass-1 (shared-library) gap, carved out from Pass 2b because it edits the DS library (`afi5Q5nFtcnT9HJ04Cbylg`) — ecosystem blast radius (the dashboard + robotics_career consume these too) and it needs Caelan's republish. Run it as its own session, before the Pass-2b pill swaps. Work happens **in the library file, not the quiz file.**

**Scope:** add optional **leading + trailing** icon slots to the two sets, strictly additive so existing consumers are untouched.
- **PillButton** — set `686:2`, page Buttons, key `ce4f8c7df3677e2207d65b47c100fa7caa2eb705`; 5 variants (Surface×Fill).
- **CtaButton** — set `608:7`, page Buttons, key `c3215d14a0449df2c90fb66fb0c272d6b0822e18`; 5 variants (Style×Color×Size).

**Property model** (mirror the Chip `Show Icon` precedent): per set add `Show Icon Left` (BOOL, **default false**), `Icon Left` (TEXT — Material Icons ligature), `Show Icon Right` (BOOL, **default false**), `Icon Right` (TEXT). Insert a Material Icons text node before the Label (leading) and after it (trailing) in each variant's auto-layout; bind visibility to the booleans, characters to the glyph props, and **the icon fill to the same variable as that variant's label** so the icon ink follows the gold/teal/outline label per variant. Extract the icon treatment (size ~16–18, gap) from a bound results pill (`25:297` "Compare roles", `25:303` "Skip to map") rather than authoring from scratch (L-009).

**Non-breaking check (required):** with defaults false, screenshot a dashboard board and a robotics_career screen before/after the library edit — confirm no visible change and no reset instance overrides.

**Verify + document:** screenshot the PillButton/CtaButton variants with icons toggled on (leading + trailing); `get_variable_defs` shows the icon fills token-bound. Update the FIGMA_MAP rows (career_dashboard §6 CtaButton, explore_floor §7 PillButton) with the new props. **Then Caelan republishes** (pairs with the still-pending Pass-1 final republish).

**Carve-out (D-046):** the compare **"Compare with ● Specialist ⌄" dropdown** (code `CompareTargetMenu.tsx`) is **not a PillButton** — different shape/size/behavior (a select with a color swatch + chevron). It stays a distinct **quiz-local** master built in Pass 2b, excluded from this icon work.

**Glyph map for the Pass-2b swaps** (which icon each results control needs, once the slots exist): Compare roles → lead `compare_arrows`; Skip to map → trail `arrow_forward`; Back to Technician → lead `arrow_back`; Set as target role → lead `star`; Back to Technician careers → trail `arrow_forward`; Role overview (CtaButton) → trail `arrow_forward`.
