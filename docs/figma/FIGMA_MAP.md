# FIGMA_MAP — the code ↔ Figma manifest

The durable record of this repo's Figma mirror: file keys, node IDs, variable IDs/keys, and the naming contract that binds React components to Figma components and `@theme` tokens to Figma Variables. This is the repo's replacement for Code Connect (Org/Enterprise-only; we're on Education). The `/capture-figma` and `/pull-figma` commands read this file first. Shape mirrors `career_dashboard/docs/figma/FIGMA_MAP.md` (D-038).

Status: **complete (2026-07-03, D-040)** — the dark extension (24 variables + 2 effect styles) is **published** in the DS library (stood up 2026-07-02, D-038, verified value-exact against `globals.css`); the Foundations pages render the dark section; and the Interest Quiz file holds **editable, variable-bound frames of all 9 final screens** (§6): captured with the official Figma Chrome extension, then bound to library variables via the MCP Plugin API (502 paints). The 2026-07-02 reference stills were deleted once each rebuild verified (the replace ruling, D-040). **An ID here is ground truth; an empty cell means not yet built.**

## 1. Files

| File | Key | Role |
|---|---|---|
| Design System (library) | `afi5Q5nFtcnT9HJ04Cbylg` | The foundations authority, published as a team library in the ARM team (`team::1630989118127729295`). Kit-aligned light values (81 vars, registered in the dashboard's map §4–§6) **plus the dark extension this repo owns (§4–§5 below)**. |
| Interest Quiz | `pjgrRJS5YYII1iciW7Pak2` | **This repo's per-project file and capture target.** In the ARM team project, subscribed to the DS library (moved + enabled by Caelan, Pass 7). |
| RC-CC | `yGDi4yDtptKttboTYV8on7` | **Dead** (D-037: one blank cover, zero variables). Never capture into it, never cite it as a source. |
| RC.org Prototype (Kayla's) | `k3AjijocJEmzrvlKTd9vJM` | The UX repo's design source, **pull-only** — registered and governed in `robotics_career/docs/figma/FIGMA_MAP.md`, listed here only so no session mistakes it for a capture target. |

## 2. The naming contract

- **Components:** PascalCase React component name = Figma component (set) name. `RoleCard.tsx` ↔ component set `RoleCard`. Variant axes use Figma convention (`State=active`).
- **Tokens:** the `@theme` custom property is the Figma variable's **WEB code syntax, verbatim, `var()`-wrapped**. Display names are human-grouped (`Color/Dark/Canvas`); the code syntax is the machine contract (`var(--color-dark-canvas)`).
- **Provenance:** every variable description states lineage — `kit: <name> (verbatim)` or `extension: <reason, with evidence>`. Lineage lives in descriptions, never in names.
- **What round-trips:** static UI only (screens at settled states, cards, chrome, type, color). Animated scenes and transient states (bucket-sort drags, flow transitions, ambient float/pulse loops, hover/focus) stay code-owned — capture resting states only.

## 3. Interest Quiz file — pages

| Page | Node ID | Contents |
|---|---|---|
| Cover | `0:1` | Dark cover card (`1:4`). |
| Quiz Flow | `1:2` | Landing + intro question + scene bucket-sort captures. |
| Results | `1:3` | The 5-screen dark results set. |

## 4. DS library — the dark extension variables (authored from this repo, Pass 7)

Published into the library's existing collections following its own invariant: raw values → `Primitives`, `var()` references → `Semantic` (every Semantic variable is a `VARIABLE_ALIAS`, never a raw value). Every variable carries an `extension:` lineage description (the kit has no dark ramp), narrow scopes (no `ALL_SCOPES`), and `var()`-wrapped WEB code syntax matching the code token exactly. Collection totals after the append: Primitives 89, Semantic 16.

> **Later append (2026-07-03, `robotics_career` D-008):** the UX/marketing repo added 4 more `Primitives` rows (Frost, On Glass Soft, Data Accent, Radius/2xl) + the `Shadow/1 Up` effect style, same lineage discipline — totals now **93 Primitives / 16 Semantic, 6 effect styles**. Those rows live in `robotics_career/docs/figma/FIGMA_MAP.md` §4; this file's dark-extension registry below is unaffected.

**`Primitives` (`VariableCollectionId:6:2`, mode `Value` `6:0`) — 17 added:**

| Variable | ID | Key | Value | WEB code syntax |
|---|---|---|---|---|
| Color/Dark/Canvas | `VariableID:513:2` | `c5977f6d3fd8d2f35bfb69930d5ae465ad1c3554` | `#1B1B1B` | `var(--color-dark-canvas)` |
| Color/Dark/Surface | `VariableID:513:3` | `fbdf8144f157ecba9343abea7e19b6a94eb71a32` | `#292929` | `var(--color-dark-surface)` |
| Color/Dark/Text On Dark | `VariableID:513:4` | `807841516410ff707cf3ecba6581c1cc58ce560a` | `#F2F4F5` | `var(--color-text-on-dark)` |
| Color/Dark/Text On Dark Muted | `VariableID:513:5` | `b712127b380c5b3dff3b646bfaee24e930efe270` | `#C4C8CC` | `var(--color-text-on-dark-muted)` |
| Color/Dark/Text On Dark Faint | `VariableID:513:6` | `f1f972efdb01f20f93e21d7c7f4855061eba3fd0` | `#9AA0A5` | `var(--color-text-on-dark-faint)` |
| Color/Dark/Glass Fill | `VariableID:513:7` | `372d773d5eed4291ea2631b55eb5f2479c02598f` | `#FFFFFF @ 4.5%` | `var(--color-glass-fill)` |
| Color/Dark/Glass Fill Strong | `VariableID:513:8` | `c4283f52b6fcf10950ae90839d83190b4e61cccf` | `#FFFFFF @ 6%` | `var(--color-glass-fill-strong)` |
| Color/Dark/Glass Border | `VariableID:513:9` | `678f3185cdfe71f4244481f2a77a2c5b585c41f1` | `#FFFFFF @ 10%` | `var(--color-glass-border)` |
| Color/Dark/Glass Border Soft | `VariableID:513:10` | `c01fe8dcab4cea5cc20aec9fcff4b840362924a8` | `#FFFFFF @ 7%` | `var(--color-glass-border-soft)` |
| Color/Dark/Glass Panel | `VariableID:513:11` | `9327d54fcdadc73b4d71fd7aa15d81794cf89a49` | `#262626 @ 85%` | `var(--color-glass-panel)` |
| Color/Dark/Constellation Line | `VariableID:513:12` | `a48fbb5e3f1511af9ab06689646aa62bb5f0d093` | `#E0E0E0` | `var(--color-constellation-line)` |
| Color/Role/Technician Soft | `VariableID:513:13` | `36c475206a782962fd6a49f114fa22682ea2348a` | `#FFD27A` | `var(--color-role-technician-soft)` |
| Color/Role/Technician Glow | `VariableID:513:14` | `4eecbb484c5641a56aff05af579a20cce6f73497` | `#FFB81C @ 30%` | `var(--color-role-technician-glow)` |
| Color/Role/Specialist Soft | `VariableID:513:15` | `a9c775b9c4006111e5d9720cc8550ecafd8093c2` | `#7FE0F2` | `var(--color-role-specialist-soft)` |
| Color/Role/Specialist Glow | `VariableID:513:16` | `76fda5bacd359f51fa5660e14bb64a7459160176` | `#7FE0F2 @ 30%` | `var(--color-role-specialist-glow)` |
| Color/Role/Integrator Soft | `VariableID:513:17` | `6534468b8a6f3893ef0646d9dae0f276aa23e310` | `#F2965A` | `var(--color-role-integrator-soft)` |
| Color/Role/Integrator Glow | `VariableID:513:18` | `30c5c447545e3e8d1376dd8ef596ce3d73acf954` | `#F2965A @ 30%` | `var(--color-role-integrator-glow)` |

**`Semantic` (`VariableCollectionId:139:66`, mode `Value` `139:0`) — 7 aliases added:**

| Variable | ID | Key | Alias target | WEB code syntax |
|---|---|---|---|---|
| Color/Dark/Panel | `VariableID:513:19` | `492809a851c79f3510008a320f18c33005ec9fc4` | Color/Neutral/Near Black | `var(--color-dark-panel)` |
| Color/Role/Technician | `VariableID:513:20` | `d652354939358bf49ab1c6f35e1fda5b19efe535` | Color/Brand/ARM Gold | `var(--color-role-technician)` |
| Color/Role/Technician On | `VariableID:513:21` | `665ba1f00ad81265b8b64a5b28a171eedeffb629` | Color/Neutral/Near Black | `var(--color-role-technician-on)` |
| Color/Role/Specialist | `VariableID:513:22` | `b1d6d8901ed622878f85495686267732ee6e78ee` | Color/Brand/Secondary Teal | `var(--color-role-specialist)` |
| Color/Role/Specialist On | `VariableID:513:23` | `8c345b7ce349d6cb3336f6a28157fd249a509ab2` | Color/Neutral/On CTA | `var(--color-role-specialist-on)` |
| Color/Role/Integrator | `VariableID:513:24` | `00ce2f552f853349cb88ed7d5716af9e0fde43c8` | Color/Brand/Secondary Orange | `var(--color-role-integrator)` |
| Color/Role/Integrator On | `VariableID:513:25` | `925e2939ce82d47275a7275b071e86e347e41095` | Color/Neutral/On CTA | `var(--color-role-integrator-on)` |

The two `Role/* On` whites alias `Color/Neutral/On CTA` (value-identical `#FFFFFF`): code says `var(--color-white)`, which has no library primitive — the same rewrite `@rc/ui` v1 documented. `blur-bar` / `blur-panel` stay code-only (no clean Figma variable home; `DESIGN_SYSTEM.md` §2).

## 5. DS library — dark effect styles

| Style | ID | Spec | Code token |
|---|---|---|---|
| Shadow/Dark Panel | `S:fba444b7168919821ddd192abdc2ab054f58a101,` | 0 20px 70px rgb(0 0 0 / 0.35) | `--shadow-dark-panel` |
| Shadow/Dark Card | `S:f3414e178d9f871b31f2f6ad69ee9f42467890ef,` | 0 10px 40px rgb(0 0 0 / 0.28) | `--shadow-dark-card` |

## 6. Screen captures — Interest Quiz file

**Editable, variable-bound frames, landed 2026-07-03 (D-040):** all 9 final screens at 1440×900, captured from the production preview with the **official Figma Chrome extension** (Caelan-driven, settled states, believable spread — Technician 82% / Specialist 80% / Integrator 80%), then integrated by an MCP Plugin-API pass: frames renamed to the §2 naming contract and **502 paints bound to library variables** — the §4 dark set plus `Color/Brand/ARM Gold` and `Color/Neutral/Near Black` from the light kit (the header chrome's own tokens), on-accent whites to the `Role/* On` aliases. Evidence: `get_variable_defs` per frame returns the `var()` vocabulary with zero raw hex where a token exists. The 2026-07-02 `Ref/*` stills were deleted after per-frame visual verification (the replace ruling; this supersedes the earlier keep-beside note).

Deliberate raw keeps inside the captures: `#595959` (`--color-text-subtle`, a code token with no published library variable — same class as `--color-white`), one `white/10` fill on the map, the avatar's gold gradient + ambient-orb/bubble-glow gradients, and vector geometry (radar, bubbles, constellation) — code-owned per §2.

| Screen | React component (frame name) | Route / state | Page | Node ID |
|---|---|---|---|---|
| Landing | `Landing` | `/` | Quiz Flow | `25:32` |
| Intro question | `MCQuestion` | `/flow` (question step) | Quiz Flow | `25:62` |
| Scene intro | `SceneSortView` | `/flow` (scene step, pre-sort) | Quiz Flow | `25:192` |
| Scene bucket-sort | `BucketSort` | `/flow` (scene step, sorting) | Quiz Flow | `25:117` |
| Results — role cards | `ResultsPanel` | `/results` screen 1 | Results | `25:253` |
| Results — compare | `CompareView` | `/results` screen 2 | Results | `25:494` |
| Results — bubble map | `ResultsMap` | `/results` screen 3 | Results | `25:881` |
| Results — constellation + job panel | `ResultsConstellation` | `/results` screen 4 | Results | `25:965` |
| Results — job overview | `JobOverview` | `/results` screen 5 | Results | `25:1183` |

## 7. DS library — shared components this repo owns (Pass 1, D-042/D-044)

Componentization Pass 1 promoted the shared **TopNav** and **PillButton** sets into the DS library (`afi5Q5nFtcnT9HJ04Cbylg`) — explore_floor's `AppHeader` is the nav reference (centered search wins the top tier everywhere). Keys are for `importComponentByKeyAsync`. The full DS component manifest lives in `career_dashboard/docs/figma/FIGMA_MAP.md` §6; these two rows are the ones this repo owns.

| Component | Node ID | Page | Key | Variants / props / code map |
|---|---|---|---|---|
| TopNav (mega set) | `636:40` | Shell Chrome | `f69105be…` | `Auth`{In,Out} × `Secondary`{On,Off}, **3 shipped combos** (D-044). `Auth=In, Secondary=Off` (`664:73`, key `ac27fc11…`) = this repo's `AppHeader.tsx` — quiz nav: centered search + Guest profile pill, no secondary. `In+On` (`ded8be8c…`) = dashboard two-tier (nests a `SecondaryNav` instance; `Secondary=On` maps to composing `<SecondaryNav/>` below `<TopNav/>`, **not** a `<TopNav>` prop). `Out+Off` (`0b0673a3…`) = marketing/logged-out (Resources ▾ · Sign In · gold Sign Up = nested `CtaButton` Filled/Gold/lg). Search centered to true nav width; Resources/Sign In → `List Row`. Supersedes the retired dashboard `TopNav` (`262:30`) and robotics_career's local `TopNavV2`. OverHero was dropped (D-044, was a D-042 axis). |
| PillButton (set) | `686:2` | Buttons | `ce4f8c7d…` | `Surface`{Light,Dark} × `Fill`{Gold,Teal,Outline}, **5 shipped combos** (no Dark/Teal); Label TEXT. Radius `radius/full`, all 36h (no Size axis). Light labels → `List Row` px32; Dark Gold → `Item Title`, Dark Outline → `Body/Default` (16). The pill-shaped CTA family (the quiz results chrome + every robotics_career pill); rectangular CTAs use `CtaButton` (career_dashboard §6). **Pass 1b (D-046, 2026-07-05):** optional leading + trailing icon slots added — `Show Icon Left#728:0` / `Icon Left#728:6` / `Show Icon Right#728:12` / `Icon Right#728:18` (BOOL **default off** + Material Icons ligature TEXT). An 18px Material Icons Regular glyph sits before/after the Label; `itemSpacing` set 0→8 for the gap (label-only rendering unchanged since a hidden child adds no gap); each icon fill is cloned from its variant's label so the ink follows Gold/Teal/Outline per variant (Near Black / On CTA / Ink / Text On Dark). Strictly additive — defaults off, zero existing PillButton instances anywhere so no consumer risk. Extracted from the bound results pills `25:297`/`25:303` (L-009). **Published 2026-07-05** (import-by-key returns the icon props). |

## 8. Interest Quiz file — local components + instance swaps (Pass 2 + 2b, 2026-07-05, D-045/D-047)

Componentization Pass 2 turned the 9 flat variable-bound frames (§6) into real instances. Local **quiz-vocabulary** masters live on a new **`Components`** page (`84:96`) in the Interest Quiz file (`pjgrRJS5YYII1iciW7Pak2`); shared chrome swaps to **published library instances** (§7 + career_dashboard §6). Masters were extracted by cloning a token-bound occurrence (never authored from scratch, L-009), so bound paints carried over. **Pass 2b (D-047) closed the tail:** the results icon-pills/CTAs swapped onto the Pass-1b icon-slotted shared sets, and the three variant-heavy masters (`SignalBar`, `RoleTab`, `CompareTargetMenu`) plus a StatBox `Size=Compact` variant were built and swapped. All 9 frames stay per-frame pixel-faithful; every master is token-clean (`get_variable_defs` returns only tokens; the sanctioned `#595959` SignalBar-Off keep has no library primitive). The normalizations below are sanctioned Figma-leads-code divergences to close at Pass 4.

### Local masters built (page `Components` `84:96`)

| Component | Node ID | Props | Swapped instances | Extracted from |
|---|---|---|---|---|
| **Chip** (glass results chip) | `84:99` | `Label#84:0` (TEXT) | 4 — answer chips in ResultsPanel + CompareView (`25:369/620/778/781`) | `25:369` "Help a sibling get ready" |
| **StatBox** (set, 2b) | `117:7` | `Size`{Default,Compact} + `Label`, `Value` (TEXT) | 8 full-size (Default) + **2 compact** (`118:153` Salary, `118:158` Education — JobSidePanel) | `25:423` Salary (Default); compact from `25:1069` |
| **ChoiceRow** | `90:80` | `Label#90:0` (TEXT) | 5 — MC answer rows + bucket-sort rows (`25:108/111/174/177/180`) | `25:174` "That's me" |
| **TierBadge** | `94:134` | `Label#94:0` (TEXT) | 1 — "Entry level" (JobOverview `25:1248`) | `25:1248` |
| **HeroArrow** | `94:139` | — (icon-only; glyph override) | 2 — carousel Prev/Next (`25:311` chevron_left, `25:388` chevron_right) | `25:311` |
| **SignalBar** (set, 2b) | `127:175` | `Highlight`{Technician,Specialist,Off} + `Label`, `Value` (TEXT) | **12** — 3 bars × 4 groups (`25:330` ResultsPanel, `25:581/739` CompareView cols, `25:1031` compact side panel); fill px set per instance | `25:332` (Tech-active gold) + `25:750` (Spec-active teal) + `25:341` (Off) |
| **RoleTab** (set, 2b) | `131:238` | `State`{Active,Inactive} + `Label` (TEXT) | **5** — 2-tab strip `25:396` (The role / Skills…) + 3-tab strip `25:1253` (Job overview / Skills & competencies / How you fit); swapped inside the `Tab:margin` wrappers | `25:397` (active tab) |
| **CompareTargetMenu** (set, 2b) | `134:263` | `Target`{Technician,Specialist,Integrator} (swatch) + `Label`, `TargetName` (TEXT) | **1** — CompareView "Compare with ● Specialist ⌄" (`25:544` → `136:238`), closed state | `25:544` |

`ChoiceRow` / `QuestionCard` / `SceneCard` have **no React component yet** (registry `ChoiceRow`); Figma leads code here (extract at Pass 4). `SignalBars` / `StatBox` / `RoleTabs` / `Chip` / `HeroArrow` / `BridgeProgramRow` / `CompareTargetMenu` are real components (`src/screens/Results/cards/*`). **SignalBar** models a single bar row (label `w-20` + responsive FILL track `#1b1b1b` + `%` value); the fill width is data, so it is a per-instance resize (not a variant), and the `Highlight` axis carries only the shipped tones (no Integrator-active, ruling 9). **RoleTab** — one item master serves both strips (`RoleTabs.tsx` 2-tab and the identical inline `JobOverview.tsx` 3-tab strip). **StatBox** `Size=Compact` = `px-space-3 py-space-2`, value 20px (vs Default 24px); the Default value paragraph/text were made FILL (were a hardcoded FIXED 322) so the box is responsive.

### Shared library instances swapped in

| Set | Variant | Key | Instances |
|---|---|---|---|
| **TopNav** (§7) | `Auth=In, Secondary=Off` (`664:73`) | `f69105beb3f62971c41307ab576e5685f6fb80b2` | **9** — every frame's nav header; profile pill set to **Guest / initial "G"** |
| **CtaButton** (career_dashboard §6) | `Style=Filled, Color=Gold, Size=lg` | `c3215d14a0449df2c90fb66fb0c272d6b0822e18` | **1** — Landing "Start the story" (`25:59`) |
| **PillButton** (§7, 2b) | `Surface=Dark, Fill=Outline` | `ce4f8c7d…` | **4** — Compare roles (`108:32`, lead `compare_arrows`), Skip to map (`110:138`, trail `arrow_forward`), Back to Technician (`111:141`, lead `arrow_back`), Back to Technician careers (`111:149`, trail `arrow_forward`) |
| **PillButton** (§7, 2b) | `Surface=Dark, Fill=Gold` | `ce4f8c7d…` | **1** — Set as target role (`111:145`, lead `star`) |
| **CtaButton** (career_dashboard §6, 2b) | `Style=Filled, Color=Teal, Size=lg` | `c3215d14…` | **1** — Role overview (`112:171`, trail `arrow_forward`; FILL width + 54h footprint preserved) |
| **CtaButton** (career_dashboard §6, 2b) | `Style=Filled, Color=Gold, Size=lg` | `c3215d14…` | **1** — Flow "Continue" (`114:105`, trail `arrow_forward`; SceneSortView) |

### Sanctioned Figma-leads-code divergences (close at Pass 4)

1. **Nav guest pill.** The shared `TopNav In+Off` nests the dashboard's `ProfileMenu` (24px avatar + text initial), so the quiz nav converges from `AppHeader.tsx`'s person-icon "Guest" pill (28px) to an initial-avatar **"G" / "Guest"**. Reconcile `AppHeader.tsx` (adopt the initial avatar, or add a guest/icon mode to `ProfileMenu`). Caelan-approved 2026-07-05.
2. **Landing CTA.** "Start the story" normalized from the bespoke 149×46 to `CtaButton` lg **120×36** (radius `radius/md` 8px). Reconcile `Button.tsx`/Landing at Pass 4 (parallels the dashboard 6px→8px normalization).
3. **Compare Education StatBox.** The `CompareColumn` Education box (a `font-body` bulleted `<ul>`) normalized onto the shared `StatBox`; its Value is an instance override (Roboto 16/22, bound to `Color/Dark/Text On Dark Muted` `b712127b…`). Minor: bullets render muted rather than faint.
4. **Continue CTA (2b).** Flow "Continue" normalized from bespoke 139×46 to `CtaButton Filled/Gold/lg` **120×36** (parallels the Landing normalization, #2).
5. **Role overview CTA (2b).** Normalized from bespoke 354×54 onto `CtaButton Filled/Teal/lg`, but **kept full-width** (instance `FILL` = 354 in its panel) and the panel's **54px footprint** (instance height override; the standard lg is 36) so the side panel does not reflow.
6. **Set-as-target pill (2b).** The inert gold `<span>` (`bg-arm-gold px-space-4`) normalized to `PillButton Dark/Gold`; 15px narrower (`px-space-4`→`px-space-3`).
7. **RoleTab inactive underline (2b).** The captured inactive tab used a black (invisible-on-dark) 2px border; the `RoleTab State=Inactive` master uses a transparent 2px border (renders identically, semantically `border-transparent`).

### Deferred tail (still open after Pass 2b — nothing destroyed; these remain faithful original frames)

- **QuestionCard** (`25:96`), **SceneCard** (`25:149/224`) — low capture repetition; deferred.
- **BridgeProgramRow** — not present in the captured frames (the Skills tab state isn't captured); N/A.
- **Flow "Back" buttons** (`25:188` SceneSortView, `25:249` BucketSort) — outline/ghost back controls, **not in the Pass-2b glyph map**; a `CtaButton Outline` (or ghost) candidate, deferred to keep scope tight. Note for Pass 4 code reconcile.
- **SignalBar Integrator-active tone** — intentionally **not built** (ruling 9): Integrator never appears as the top/target role in the captured frames, so the `Highlight` axis ships Technician/Specialist/Off only. Add if an Integrator-top capture ever lands.

### Token decision (publish-or-keep, per Pass 2 gate)

**Keep, no new publish.** The masters inherited the §6 "deliberate raw keeps": `--color-text-subtle` (`#595959`) stays raw (no library primitive exists), `--color-white` stays aliased to `Color/Neutral/On CTA`. The only fill I newly set (compare-Education body) is bound to the published muted variable, so no unbound hex was introduced beyond the sanctioned keeps.
