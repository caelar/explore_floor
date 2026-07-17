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
| 1 | Shared tier — build/reconcile component sets in the DS library, publish | ☑ 2026-07-04 (D-043/D-044) — built, published, dashboard swapped, old masters retired, FIGMA_MAPs ×3 done; **final republish landed 2026-07-05** (pushed the 3 old-master deletions as deprecations, bundled with Pass 1b) |
| 1b | **Shared-tier icon slot** — add optional leading/trailing icon to PillButton + CtaButton in the DS library; republish. Unblocks the Pass-2b results icon-pills. | ☑ 2026-07-05 (D-046) — built + verified + **published**; both sets carry additive leading/trailing icon slots (defaults off), token-bound per variant; the republished sets expose the icon props (importable by key). Outcomes below. |
| 2 | Interest Quiz file — local components + instance swaps | ☑ 2026-07-05 (D-045 + **D-047**) — Pass 2: `Components` page + 5 local masters + shared nav ×9 / CtaButton ×1. **Pass 2b (D-047): tail closed** — results icon-pill/CTA swaps ×7 onto the icon-slotted shared sets, + 3 net-new masters (`SignalBar` / `RoleTab` / `CompareTargetMenu`) + `StatBox Size=Compact`; 20 instances, all frames pixel-faithful, masters token-clean. Outcomes below. |
| 3 | Captures file — swap to library instances where promoted | ☑ 2026-07-08 (D-048) — 10 nav + 37 form instances swapped to shared DS instances; 5 form masters + `State=Light` nav variant retired; Landing OverHero kept local; all frames pixel-faithful bar the sanctioned nav divergence. Outcomes below. |
| 4 | Code alignment — **sliced into 4a/4b/4c** (D-049); hops repos | ◐ — **4a done 2026-07-15** (explore_floor, all gates green); **4b dashboard portion done 2026-07-17** (D-051 — CtaButton radius landed, TopNav verified no-op, all dashboard gates green); **4b robotics_career tail + 4c deferred** |
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

**Pass 4 — code alignment (hops repos).** The accepted pass-back-to-code: dashboard tier-1 `TopNav` swaps to the centered-search design; robotics_career implements the two nav auth states; button standardization lands per the registry; the Icon name union lands in `@rc/ui` (version bump + tag; robotics_career picks it up and clears its ~33 raw `material-icons` spans per its own rubric's `icon-atom` criterion). Each repo's own gates apply (lint / typecheck / tests, design review for visual changes). **Sliced into 4a/4b/4c at D-049 — see the slice map below.**

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

**Pass 1 closed 2026-07-04:** old masters `TopNav 262:30` / `MetaChip 184:8` / `GoldChip 183:2` **retired** (kit-verbatim `10:14`/`14:2`/`16:2` provenance kept); **FIGMA_MAPs ×3 done** (career_dashboard §6 `782a7be`, explore_floor §7 `7c098e9`, robotics_career `e1b3b0a`). New DS keys: CtaButton `c3215d14…`, Chip `a51417db…`, TopNav mega set `f69105be…`, PillButton `ce4f8c7d…`, FormField `88dd923c…`, OptionRow `d31a14f7…`, OAuthButton `431abdb5…`, HintRow `5067f0a9…`, StepFooter `b3c1d94b…`. **Final DS-library republish landed 2026-07-05** (pushed the 3 deletions as deprecations, bundled with the Pass-1b icon slots). Next core pass: **Pass 2 — Interest Quiz file**.

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

**Next:** **Pass 1b** (the shared-tier icon-slot add — handoff spec below) → Caelan republishes → **Pass 2b** (the deferred local tail + the icon-pill/CTA swaps) → **Pass 3 — Captures file**. Pass 1b and Pass 2b are separate sessions on purpose (1b edits the shared library and needs a republish; 2b's local work is unblocked and can run anytime). _(Pass 1b done D-046; **Pass 2b done D-047** — outcomes below; next core pass is Pass 3.)_

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

## Pass 1b outcomes (2026-07-05, D-046)

Built in the DS library (`afi5Q5nFtcnT9HJ04Cbylg`, page `Buttons`). Both sets gained **four additive component properties** — `Show Icon Left` (BOOL, default **false**), `Icon Left` (TEXT, Material Icons ligature), `Show Icon Right` (BOOL, default **false**), `Icon Right` (TEXT) — plus a leading Material Icons text node inserted before the Label and a trailing one after it, in **every** variant.

- **PillButton** (`686:2`) — 5 variants, prop keys `Show Icon Left#728:0` / `Icon Left#728:6` / `Show Icon Right#728:12` / `Icon Right#728:18`. Icon glyph 18px; `itemSpacing` set **0 → 8** so the gap appears when an icon shows (label-only rendering is unchanged — a hidden auto-layout child adds no gap or width).
- **CtaButton** (`608:7`) — 5 variants, prop keys `Show Icon Left#731:0` / `Icon Left#731:6` / `Show Icon Right#731:12` / `Icon Right#731:18`. Icon size **tracks the Size axis** (lg 18 / md 16); `itemSpacing` was already 8.
- **Token binding (L-009 clone method):** each icon's fill is a clone of its own variant's Label `fills`, so the bound variable carries over verbatim — verified label == iconLeft == iconRight for all 10 variants (PillButton: Ink `6:8` / On CTA `370:3` / Near Black `134:73` / Text On Dark `513:4`; CtaButton: On CTA `370:3` / Ink `6:8` / Near Black `134:73`). `get_variable_defs` on both sets shows only tokens — no raw hex introduced.
- **Extraction (L-009):** treatment (size 18–19, gap 8, Material Icons Regular, fill-follows-label) lifted from the bound results pills `25:297` "Compare roles" (lead `compare_arrows`) and `25:303` "Skip to map" (trail `arrow_forward`) in the quiz file, not authored from scratch.

**Non-breaking (verified):** icons-off masters are pixel-identical to the pre-edit baseline for both sets. Instance census: **zero** PillButton instances anywhere (so its add cannot break a consumer); CtaButton has exactly **one** dashboard instance (`325:1202` "Sign Up", Board Parts) and **one** quiz instance (`93:83` Landing "Start the story"). Both consumers are remote instances frozen on the last-published version until republish, so they show no change now; a post-republish simulation (a fresh Gold/lg instance, Label "Sign Up", icon props at default) renders label-only at 120×36 with the Label override preserved and `iconLeft`/`iconRight` hidden — pixel-identical to the dashboard baseline. Adding a leading sibling does not reset overrides (Figma maps overrides by node ID, not index).

**Republished 2026-07-05.** Caelan's DS-library republish landed — it bundled the pending Pass-1 old-master deletions **and** these icon slots in one publish. Verified post-publish: importing `CtaButton` (`c3215d14…`) and `PillButton` (`ce4f8c7d…`) by key returns the icon-slot props (`Show Icon Left/Right` + `Icon Left/Right`), so **Pass 2b is fully unblocked**. Existing consumer instances (dashboard `325:1202`, quiz `93:83`) still render label-only and keep their overrides — they gain the additive slots when their file accepts the library update; the Pass-2b swaps import the republished sets by key regardless. **Pass 2b** now swaps the results toolbar pills → PillButton and the icon-CTAs → CtaButton per the glyph map above.

**Carve-out held:** the compare dropdown (`CompareTargetMenu`) stays a distinct quiz-local master (Pass 2b) — untouched here.

## Pass 2b outcomes (2026-07-05, D-047)

Closed the D-045 deferred tail in the Interest Quiz file (`pjgrRJS5YYII1iciW7Pak2`) — all local (ruling 7), no republish, nothing needed from Caelan. Sequenced icon-swaps-first per Caelan. Full manifest: `docs/figma/FIGMA_MAP.md` §8. Gates: every affected frame re-screenshotted pixel-faithful; `get_variable_defs` on all four masters returns only tokens; Components-page census clean (no orphan temp nodes).

**A — Results icon-pill / icon-CTA swaps (7):** the raw `<button>`/`<span>` toolbar controls swapped to the Pass-1b icon-slotted shared instances, glyphs per the map above:
- `PillButton Dark/Outline`: Compare roles (`108:32`, lead `compare_arrows`), Skip to map (`110:138`, trail `arrow_forward`), Back to Technician (`111:141`, lead `arrow_back`), Back to Technician careers (`111:149`, trail `arrow_forward`).
- `PillButton Dark/Gold`: Set as target role (`111:145`, lead `star`).
- `CtaButton Filled/Teal/lg`: Role overview (`112:171`, trail `arrow_forward`) — set `FILL` width + fixed 54h so the side panel keeps its footprint.
- `CtaButton Filled/Gold/lg`: Flow "Continue" (`114:105`, trail `arrow_forward`, SceneSortView) — the last deferred icon-CTA.
- The conditional "Explore careers" gold pill is **not** present in the settled captures (only "Skip to map" renders) → no swap. The two Flow **Back** buttons stay deferred (not in the glyph map).

**Three net-new local masters** (page `Components` `84:96`), each extracted L-009 from a token-bound occurrence:
- **`SignalBar`** (`127:175`) — `Highlight`{Technician,Specialist,Off} × `Label`/`Value`. A single bar row: label (`w-20`) + responsive FILL track (`#1b1b1b`, radius 6, clips) + `%` value. Active = role accent fill (Technician `role-technician` gold / Specialist `role-specialist` teal, bound) + `text-on-dark` label/value; Off = `#595959` raw + `text-on-dark-faint` faint. Fill width is **data**, so per instance the fill child is resized to the captured px (not a variant). Built from `25:332` (Tech gold) + `25:750` (Spec teal) + `25:341` (Off). **No Integrator-active variant** — never appears in captures (ruling 9). Swapped 12 bars across `25:330` / `25:581` / `25:739` / `25:1031`.
- **`RoleTab`** (`131:238`) — `State`{Active,Inactive} × `Label`. Active = 2px `text-on-dark` underline + `text-on-dark` Bold; Inactive = transparent 2px border + `text-on-dark-faint` Medium (Montserrat 16). One item master serves both the 2-tab strip (`25:396`) and the identical 3-tab strip (`25:1253`); swapped inside the existing `Tab:margin` wrappers, 5 tabs total.
- **`CompareTargetMenu`** (`134:263`, the D-046 carve-out) — `Target`{Technician,Specialist,Integrator} (swatch color, bound to `role-*`) × `Label`/`TargetName`. `rounded-md` glass-fill-strong trigger: "Compare with" (faint) + role swatch dot + target name (Montserrat Bold, `text-on-dark`) + `expand_more` chevron. Closed state only. Swapped `25:544` → `136:238` (Target=Specialist). _(Gotcha: the `role-*` variables are remote/imported, so `getLocalVariablesAsync` can't find them by name — resolve via the variable's collection (`getVariableCollectionByIdAsync`) or `getVariableByIdAsync`, then `setBoundVariableForPaint`.)_

**StatBox → set** (`117:7`): promoted the Pass-2 master to a `Size`{Default,Compact} axis (Compact = `px-space-3 py-space-2`, value 20px). Swapped the 2 JobSidePanel compacts (`118:153`/`118:158`); restored `FILL` on the 8 Default instances (the `combineAsVariants` reset their width overrides) and made the Default value paragraph/text `FILL` (were a hardcoded FIXED 322) so the box is responsive — a structural repair.

**Sanctioned Figma-leads-code divergences (Pass 4):** Continue 139×46 → CtaButton lg 120×36; Role overview 354×54 → CtaButton lg full-width + 54h override; Set-as-target `px-space-4`→`px-space-3` (−15px); RoleTab inactive underline black→transparent (identical on dark). See `FIGMA_MAP.md` §8 divergences #4–#7.

**Deferred tail after 2b:** QuestionCard (`25:96`), SceneCard (`25:149/224`), BridgeProgramRow (not captured), the two Flow Back buttons (`25:188`/`25:249`). Next core pass: **Pass 3 — Captures file**.

## Pass 3 outcomes (2026-07-08, D-048)

Swapped the RC.org Captures file (`F3GRK7HNLLtG48vPosyXKw`, robotics_career) local-master instances to DS-library instances where promoted — a sanctioned Figma-leads-code pass (closes at Pass 4). Full manifest: `robotics_career/docs/figma/FIGMA_MAP.md` §5. Gates: every affected frame re-screenshotted pixel-faithful (bar the intended nav change); document-wide census clean (0 instances left on any retired master); no raw hex introduced (swaps carry the DS masters' bound paints). All 47 swaps used `swapComponent`, which **preserved every override and mapped it into the DS component properties** — the DS masters were promoted from these exact captures (L-009), so layer names match and nothing needed manual re-setting.

**Nav — 10 instances** `TopNavV2 State=Light` → shared **`TopNav Auth=Out, Secondary=Off`** (variant key `0b0673a3…`, set `f69105be…`):
- 8 auth frames (Sign-up page `2:4`): SignUp `8:21`, SignIn `12:49`, SetupName `12:108`, SetupLocation `12:142`, Interests `12:180`, CareerStatus `12:218`, Military `12:263`, Competencies `13:216`.
- 2 Explore frames (page `2:3`): Explore-list `84:3`, Explore-map `90:158`.
- **Landing OverHero (`21:18`) kept local** (Caelan, this session) — the mega set has no OverHero variant (dropped D-044). `TopNavV2` set `19:21` retained, now **OverHero-only** (Light variant `5:9` deleted).

**Forms — 37 instances** → the shared form family (overrides preserved, incl. dropdown chevrons, password-eye glyphs, the Google brand icon):
- **FormField ×10** (`88dd923c…`), **OptionRow ×12** (set `d31a14f7…`; Checkbox/Unchecked `d5a94ce6…` ×9, Radio/Unchecked `c2c192df…` ×3), **OAuthButton ×4** (`431abdb5…`; Google buttons keep the local `GoogleIcon` nested), **HintRow ×5** (`5067f0a9…`), **StepFooter ×6** (`b3c1d94b…`).

**Header-gap (Caelan chose "tighten gap"):** the nav shrank 80→60px. The 8 auth frames are VERTICAL auto-layout (flush), so content auto-reflowed up 20px and each frame hugged 20px shorter — no manual work. The 2 absolute Explore frames were nudged manually: Content + SiteFooter up 20px, frame height 1952→1932, to hold the original 40px nav-to-content gap.

**Retired (deleted, 0 instances doc-wide):** local `FormField` `7:8`, `OptionRow` `11:52`, `OAuthButton` `8:14`, `HintRow` `7:11`, `StepFooter` `11:48`, `TopNavV2 State=Light` `5:9`. **Local tier remaining** (registry §4, unchanged): `TopNavV2` (OverHero-only), `SiteFooter` `17:4`, `CompetencyTile` `13:213`, `LinkedInIcon` `8:7`, `GoogleIcon` `8:13`, `Chip` `81:3`, `FilterDropdown` `81:5`, `JobCard` `82:4`.

**Sanctioned Figma-leads-code divergences (close at Pass 4):** (1) **nav light→dark unification** (local light 80px, left search, `Resources ▾ · About us · Sign up · Sign in` → shared dark 60px, centered search + sliders, gear + wordmark, `Resources ⌄ · Sign In · gold Sign Up`; **"About us" dropped**, casing changed); (2) **Explore nav search now visible** (local hid it; the mega set always shows the centered search); (3) content nudged up 20px to compensate the shorter nav. Code (`TopNavV2.tsx`, auth screens, `Explore.tsx`) still renders the light nav / hidden search until Pass 4.

**Next core pass: Pass 4 — code alignment** (nav auth states, button standardization, Icon 61-name union; hops repos). Passes 0–3 done; only Pass 4 (+ conditional Pass 5) remain. Pass 3 needed nothing from Caelan (local swaps only; the DS library was already published).

## Pass 4 slice map (D-049, 2026-07-15)

Pass 4 is split into three per-concern slices (single-session units, one repo's gates each). A pre-flight audit against the registry + all three FIGMA_MAP divergence manifests + the live code found the Figma tier clean and the only gaps on the code-plan side; those are resolved here. Caelan's rulings (2026-07-15) are folded in. A Figma spot-check of the TopNav mega set + icon-slotted CtaButton/PillButton passed (as documented).

**Slice 4a — explore_floor (run this cycle; explore_floor gates only).** Self-contained, no repo hop. The complete edit list is `explore_floor/docs/figma/FIGMA_MAP.md` §8 "Sanctioned Figma-leads-code divergences" #1–#7:
1. **Guest pill → initial avatar** — `AppHeader.tsx` adopts the shared `ProfileMenu`'s initial-avatar "G"/"Guest" (or add a guest/icon mode to ProfileMenu). (§8 #1)
2. **Landing CTA** 149×46 → `CtaButton` lg **120×36**, radius 8px — `Button.tsx`/Landing. (§8 #2)
3. **Compare Education StatBox** — bulleted `<ul>` → StatBox Value override, muted. (§8 #3)
4. **Continue CTA** 139×46 → `CtaButton Filled/Gold/lg` 120×36. (§8 #4)
5. **Role-overview CTA** 354×54 → `CtaButton Filled/Teal/lg`, kept full-width (FILL) + 54px footprint. (§8 #5)
6. **Set-as-target pill** → `PillButton Dark/Gold`, `px-space-4`→`px-space-3` (−15px). (§8 #6)
7. **RoleTab inactive underline** — black→`border-transparent` (renders identically on dark). (§8 #7)

Plus: reconcile the two **Flow Back buttons** (`25:188` SceneSortView, `25:249` BucketSort — the §8 deferred-tail code note; a `CtaButton Outline`/ghost candidate) and **delete the orphaned `ProgressBar` + `SegmentedControl`** (zero call sites — registry §7; Caelan 07-15 "get rid of the orphaned stuff"). Gates: lint / typecheck / 82 unit / 3 E2E + `/design-review` (the CTA/pill/nav changes can move E2E selectors + are visual).

**Slice 4b — nav code (dashboard portion ☑ 2026-07-17, D-051; robotics_career tail DEFERRED).** career_dashboard: `CtaButton` `rounded-sm`→`rounded-md` (D-043) **landed**; `TopNav` centered search **verified a no-op** (the code already implements the winning AppHeader pattern — the "verify first" instinct was right; outcomes below). The Phase-5 gate settled before work began (branch merged to `main` + pushed, Track B unstarted; Caelan confirmed go). Still open: robotics_career's two nav auth states (light 80px → dark 60px mega nav; §5 divergence #1: centered search, `Resources ⌄ · Sign In · gold Sign Up`, wordmark, **"About us" dropped**, casing). ⚠️ Name collision: that repo's "Phase 5" ≠ this run's conditional "Pass 5."

**Slice 4c — Icon union (DEFERRED, robotics_career).** **Path A** (D-049): expand robotics_career's **local** `src/components/Icon.tsx` with the glyphs its raw spans use (union superset = 61 names; add what's referenced), then clear its ~33 raw `material-icons` spans (24 in `Explore.tsx`) per its rubric's `icon-atom` criterion. The `@rc/ui` bump to the full 61-name union + tag is a **parallel/optional** step (robotics_career imports the local Icon, not `@rc/ui`'s, so it isn't a blocker). Deferred with 4b (robotics_career deprioritized).

### Pass 4a outcomes (2026-07-15, executed)

explore_floor slice complete; all gates green (lint · typecheck · **82 unit** · **3 E2E**; **`design-reviewer` PASS** on both rubrics from a full live walk). Caelan chose the **faithful** CTA path (the shared button, accepting the lighter 14px-medium type over the old 16px-bold). The review caught + we fixed one latent p2: `CtaButton size="md"` used `text-label` (a dashboard-theme token absent here) → changed to `text-small`; latent only (no `md` call sites).

- **New `src/components/CtaButton.tsx`** — the code mirror of the ecosystem CtaButton set (`color` gold/teal/outline × `size` lg/md, `rounded-md` **8px** = the D-043 value, `h-control-lg/md`, `font-body font-medium`, built-in icon gap). Retires the Phase-0 `Button` placeholder for the primary CTAs (`Button` stays only for the out-of-scope `/select` screen). Exported from the barrel.
- **Routed through CtaButton:** Landing "Start" (`gold/lg`, §8 #2), flow "Continue" (`gold/lg`, §8 #4), the two rail CTAs — role-overview + job-overview (`teal/lg w-full`, §8 #5; standardized to the 36px lg height rather than the Figma instance's 54px, since that height override was a Figma-frame concession with no code reflow equivalent).
- **Inline normalizations:** guest pill → "G" initial-avatar (`AppHeader`, §8 #1); compare Education bullets faint→muted (`CompareColumn`, §8 #3); set-as-target pill `px-space-4`→`px-space-3` (`JobOverview`, §8 #6).
- **No-op:** §8 #7 (RoleTab inactive underline) was **already** `border-transparent` in `RoleTabs.tsx` — the Figma master converged to the code, nothing to change.
- **Orphans deleted:** `ProgressBar.tsx` + `SegmentedControl.tsx` + their barrel exports (0 call sites).
- **Not done (deferred tail, per §8 note):** the two Flow **Back** buttons stay as-is — already reasonable ghost controls; the §8 note itself defers them "to keep scope tight." A future `CtaButton Outline` candidate.

**Come-back flags (do not lose):**
- **robotics_career** — 4b nav auth states + 4c icon spans + the deferred **button convergence** (light scope now; `GoldButton`/`GoldPill`/`OutlinePill` → `CtaButton`/`PillButton` later, registry §6). Caelan: low priority "right now."
- **Dashboard nav slice** — ✅ **done 2026-07-17 (D-051).** The Phase-5 gate settled (`p5/01-mechanics-reset` merged to `main` + pushed; Track B unstarted); Caelan confirmed go. Radius landed + TopNav verified no-op on `chore/componentization-4b-nav` — outcomes below. **Push + merge of that branch are Caelan's.**
- **CardHead / DEF-012 code side** (SponsoredCard rebuilds a raw card head) → folds into **conditional Pass 5** (dashboard file) if not already covered there.
- **Two unpublished tokens** — ✅ **done 2026-07-15 (no republish needed).** The "no library primitive exists" premise was stale: `Color/Neutral/Ink 2` = `#595959` already ships in the DS library, so the tidy was a **local rebind** in the Interest Quiz file (SignalBar track master → `Ink 2`, propagated to all 8 instances; 0 raw `#595959` remain). `--color-white` was already bound to `On CTA` (0 raw whites). No shared-library write, no republish. Detail: explore_floor `FIGMA_MAP.md` §8 token decision.

### Pass 4b outcomes — dashboard portion (2026-07-17, executed)

Gate check first: `p5/01-mechanics-reset` verified **fully merged to `main` and pushed** (both at `6cb2c56`; `main` even with origin), working tree clean, Track B unstarted — the Phase-5-mechanics gate is closed. Caelan confirmed go, **dashboard slice only**, on a fresh branch (`chore/componentization-4b-nav`, honoring that repo's don't-work-on-main note).

- **CtaButton radius — landed.** `career_dashboard/src/components/CtaButton.tsx` `rounded-sm` → `rounded-md` (6→8px, the D-043 one-liner; class change only — `--radius-sm` and the 6px inputs/chips/pills family untouched by design). Propagates to all ~13 call-site files, both sizes and variants.
- **TopNav centered search — verified no-op.** The dashboard's `TopNav.tsx` already implements the winning centered-search design (explore_floor's `AppHeader`, D-041): flex row of logo · `mx-auto w-full max-w-[440px]` search · profile. The registry's "search actually centered" contrast was against the retired dashboard *Figma* master (`262:30`), not the code. Remaining diffs are per-repo token vocabulary (D-050 / L-011 — not chased). No edit; the come-back flag closes clean.
- **Gates (career_dashboard's own):** lint · typecheck · **163/163 unit** · **27/27 e2e**; focused `/design-review` **PASS, no findings** — 8px reads consistently everywhere (boards + popover), no clipping, focus ring follows the corners, the sanctioned 6px family doesn't clash, TopNav confirmed centered.
- **Docs:** career_dashboard D-062 + STATUS + session note (`2026-07-17-componentization-4b-radius.md`); this ledger + this repo's D-051.
- **Remaining in Pass 4:** the robotics_career 4b tail (two nav auth states, light scope) + 4c Icon union — both still deferred (robotics_career deprioritized), flags above.
