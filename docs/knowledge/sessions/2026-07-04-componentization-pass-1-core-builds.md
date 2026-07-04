# 2026-07-04 — Componentization Pass 1 (in progress): CtaButton + Chip built, CardHead reconciled, extraction staged

**Resume here.** Pass 1 is **mid-flight** — do not tick the ledger. Three of six build items are done in the DS library (`afi5Q5nFtcnT9HJ04Cbylg`): the **`CtaButton` set** (`608:7`, new `Buttons` page `605:2`), the **consolidated `Chip` set** (`611:12`, Chips & Badges), and the **CardHead DEF-012 action slot** (new props `Dismiss#613:0` + `Show Dismiss#613:3`, verified rendering). Caelan's cross-file paste is **done and verified**: all 9 extraction sources sit on the `Pass 1 staging` page (`602:2`) with **variable bindings 100% intact** (spot-checked 0 raw solids) — no rebind pass needed. **Next actions, in order:** build the TopNav mega set from the staged Header, build PillButton, convert the five staged form masters, run the bind-verify gate, then the two-publish sequence below. Standing mid-pass ruling to log at pass close: **CtaButton radius = 8px** (Caelan, 2026-07-03 plan review) — gets the next D-number; Pass 4's code ripple is one line (`CtaButton.tsx` `rounded-sm` → `rounded-md`, 17 call sites already extracted).

## Built this session (all in the DS library)

| Artifact | ID | Notes |
|---|---|---|
| `Buttons` page | `605:2` | Inserted after the `———` divider. PillButton goes here too. |
| `CtaButton` set | `608:7` | 5 shipped variants (Teal Filled lg+md, Outline lg+md, Gold Filled lg). Radius 8 bound `Radius/md`; heights bound `Size/control-lg/md`; px bound `space-3/space-2`; gap `space-1`. `Label#608:5` TEXT. lg label → `List Row`, md → `Label/Default (Dashboard)`. Teal fill `Secondary Teal`/`On CTA`; Outline `Card` + `Border Strong` stroke + `Ink` label; Gold `ARM Gold` + `Near Black`. |
| `Chip` set | `611:12` | The MetaChip+GoldChip fold: Tone=Teal/Closed/Outline/Gold × Size=Eyebrow/Caption, 5 shipped combos only, `Label#611:10` TEXT + `Show Icon#611:11` BOOLEAN (Material `schedule` 11px, default true on Teal/Eyebrow only). Weight combo-determined — **no Weight axis**. Teal/Closed eyebrow labels stay raw Roboto Bold 10/15 **unlinked** (mirrors the audited MetaChip — no tracking); captions link `Body/Caption Strong`/`Medium`; Gold links `Label/Eyebrow` + UPPER + dense (`space-0` px, 18px tall). MetaChip's radius-5 drift deliberately collapsed to `Radius/sm`(6). |
| CardHead slot | on `213:11` | Added `Dismiss#613:0` INSTANCE_SWAP (default `CardDismiss` `213:12`) + `Show Dismiss#613:3` BOOLEAN, hidden dismiss instances `613:14`/`613:16` appended trailing in both variants. Existing prop keys untouched (the Show Meta collision lesson). Instance-verified: Show Action=false + Show Dismiss=true renders the SponsoredCard worded-Dismiss head. |

## Staged extraction sources (`Pass 1 staging` page `602:2`)

Pasted by Caelan 2026-07-04; bindings survived the paste (same-library variables re-linked to their local originals).

| Staged node | ID | Use |
|---|---|---|
| `Header` (1440×60) | `621:35` | TopNav `Auth=In` master source (the quiz Landing header — centered search). |
| `Button` "Compare roles" (166×36) | `621:55` | PillButton Dark/Outline (leading icon). |
| `Button` "Skip to map" (145×36) | `621:60` | PillButton Dark/Outline (trailing icon). |
| `Text` "Set as target role" (212×36) | `621:68` | PillButton Dark/Gold. **Type note:** this is JobOverview's `font-heading bold` flavor; the master should carry the interactive CTA spec instead — Roboto Medium 16/22 = the `Item Title` style (ResultsExperience.tsx:100, `font-body font-medium`). JobOverview's bold stays a per-instance override at Pass 2. |
| `FormField` (560×59) | `621:89` | Pasted as COMPONENT — adopt in place (rename/move to a new `Forms` page). |
| `OptionRow` (560×59) | `621:92` | Ditto; add `Glyph=Checkbox/Radio` × `State=Checked/Unchecked` axes per registry §1. |
| `OAuthButton` (560×50) | `621:95` | Ditto; brand icons stay nested content. |
| `HintRow` (135×17) | `621:98` | Ditto. |
| `StepFooter` (1440×116) | `621:101` | Ditto; carries `Shadow/1 Up`. |

## Remaining Pass-1 work, in order

1. **TopNav mega set** (Shell Chrome page `258:2`): `Auth=In/Out` × `Scroll=Solid/OverHero`, 3 shipped combos only. `In+Solid` from staged `621:35` — swap its captured profile-pill subtree for a **`ProfileMenu` instance** (`259:14`, registry §2 says it nests in the right slot). `Out+Solid`: same bar + search; right slot from `docs/reference/nav-logged-out-target.png` — `Resources ▾` + divider + `Sign In` text + gold **Sign Up as a nested `CtaButton` instance** (Filled/Gold/lg). The kit `Text Link` (`12:7`) is SemiBold-15-underlined — the reference Sign In is not underlined; author raw text if the style doesn't match. `Out+OverHero`: Out minus the bar background, ink switches per the Captures `TopNavV2 State=OverHero` precedent (`19:3` in `F3GRK7HNLLtG48vPosyXKw` — read remotely, don't paste).
2. **PillButton set** (Buttons page `605:2`): Surface=Light/Dark × Fill=Gold/Teal/Outline, **5 shipped combos** (Dark Gold, Dark Outline from the staged pills; Light Gold/Teal/Outline authored — flat solid paints, extraction adds nothing). All ship at 36h → recommend **no Size axis** (ruling 9; the registry's lg/md row was speculative — enumerate-at-Pass-1 was its own instruction). Light specs: Gold = `ARM Gold` fill + **`Ink`** label (not Near Black — robotics text-ink), px 32, Roboto Medium 14 (`List Row`); Teal = `Secondary Teal` + `On CTA` (Explore.tsx:563); Outline = `Ink` stroke + `Ink` label, transparent fill. Dark labels are 16px: Outline → `Body/Default`, Gold → `Item Title`. Radius `Radius/full`.
3. **Form family**: adopt the five staged COMPONENTs — rename to contract, create a `Forms` page (insert before Shell Chrome), move them there, wire TEXT/BOOLEAN props, build OptionRow's 4 variants (its radio flavor exists in the Captures Military frame as a glyph override — replicate by cloning + swapping the glyph).
4. **Verify gate**: `get_variable_defs` on every new master (zero raw hex where a token exists); screenshot-compare TopNav Out+Solid vs the reference PNG and In+Solid vs the staged header.
5. **Publish №1 (Caelan clicks)** — required before any Dashboard-file instance swap (unpublished components can't cross files).
6. **Dashboard file (`7t46ROAv93lIQRspgaslgz`) swaps**: board TopNav instances (master `262:30`; boards at `120:56` Training-Seeker, `121:381` Job-Seeker) → mega set In+Solid; MetaChip (`184:8`) / GoldChip (`183:2`) instances across widget sets → `Chip` (Teal→Teal/Eyebrow, Closed→Closed/Eyebrow, Gold→Gold/Eyebrow). Then **retire** the three old masters (delete; keep the kit-verbatim `10:14`/`14:2`/`16:2` as provenance, registry §3). These swaps are the run's sanctioned Figma-leads-code divergences — enumerate them in the pass-close note.
7. **Publish №2 (Caelan)** — pushes the removals as deprecations. Delete the `Pass 1 staging` page after the nav/pill/form masters are built from it.
8. **FIGMA_MAPs ×3** (additive model): career_dashboard §6 gains CtaButton + Chip rows + supersession notes; explore_floor gains a DS-components section (TopNav, PillButton); robotics_career gains the five form rows (local masters superseded-pending-Pass-3).
9. **Bookkeeping**: tick Pass 1 in `COMPONENTIZATION_RUN.md`, log the 8px radius ruling as the next D-number, update `STATUS.md`, session note, commit each touched repo (no pushes — Caelan's).

## Facts the next session should not re-derive

- **Pipeline**: read the `figma:figma-use` skill before any `use_figma` call. Everything here was Plugin-API work: `setBoundVariableForPaint` returns a NEW paint (reassign); `setBoundVariable` works for radii/padding/itemSpacing/height; `loadFontAsync` before any text mutation (Roboto Medium/Bold/Regular + Material Icons Regular all in use); `combineAsVariants` then lay out children manually; `ComponentSetNode.addComponentProperty` works directly on an existing published set.
- `get_metadata` on the DS file served a stale page list (Cover only); `figma.root.children` via `use_figma` is authoritative.
- Text-style ID shorthand: `List Row` = `S:b5fd9245ef6de36c14cb2b47a6f73f68d2e22219,` · `Label/Default (Dashboard)` = `S:5d5a3093493b290a7c9d5d5e0d5be852e20979ae,` · `Label/Eyebrow` = `S:9b2f86b920d62fb71bd34136737e7904b4e2ddc9,` · `Body/Caption Strong` = `S:cbe61949ef9432204857b4424f2ae24b50e3d579,` · `Body/Caption Medium` = `S:2e419530a952bb3821056511d412220e09db4d02,` · `Body/Default` = `S:73a992351ac894720556ec3b92e25df535d099ce,` · `Item Title` = `S:aef3719842ac28699f9bbe1b6d62eea851c0733a,`.
- Key variable IDs: ARM Gold `6:3`, Secondary Teal `6:4`, Teal Soft `6:5`, Teal Ink `133:68`, Ink `6:8`, Card `6:14`, Border Strong `133:75`, On CTA `370:3`, Near Black `134:73`, Closed Bg/Ink `139:73`/`139:74`, Radius sm/md/full `138:66`/`138:67`/`138:70`, space-0..3 `137:66`..`137:69`, control-lg/md `370:16`/`370:15`, Glass Border `513:9`, Text On Dark `513:4`.
- The approved plan file (full checklist): `~/.claude/plans/we-have-been-moving-elegant-walrus.md`. The ratified taxonomy: `rc-design-system/REGISTRY.md`. The run sheet: `COMPONENTIZATION_RUN.md` (this repo).
