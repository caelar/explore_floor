# Componentization Pass 3 — RC.org Captures file swapped to shared DS instances

**Resume here.** Pass 3 is **complete** (docs-only commit, no push). In the RC.org Captures file (`F3GRK7HNLLtG48vPosyXKw`, robotics_career) every logged-out nav and every auth-form instance now points to a **shared DS-library** component: **10 nav** instances (`TopNavV2 State=Light` → `TopNav Auth=Out, Secondary=Off`) and **37 form** instances (FormField/OptionRow/OAuthButton/HintRow/StepFooter → the DS form family). The **Landing OverHero nav stays local** (Caelan's call — no OverHero variant exists in the mega set). 5 orphaned local form masters + the `State=Light` nav variant were deleted; every affected frame re-verified pixel-faithful except the intended nav change. **Next core pass: Pass 4 — code alignment** (nav auth states, button standardization, Icon 61-name union; hops repos). Pass 3 needed nothing from Caelan (local swaps only; the DS library was already published).

## What ran

All work via the Figma MCP `use_figma` (Plugin-API) channel against the active Captures file. `get_metadata` served the stale "Cover only" page list again — `figma.root.children` via `use_figma` is authoritative (5 pages: Cover `0:1`, Landing `2:2`, Explore `2:3`, Sign-up `2:4`, Components `78:2`).

**Nav — 10 instances → `TopNav Auth=Out, Secondary=Off`** (variant key `0b0673a3…`, set `f69105be…`):
- 8 auth frames (Sign-up `2:4`): SignUp `8:21`, SignIn `12:49`, SetupName `12:108`, SetupLocation `12:142`, Interests `12:180`, CareerStatus `12:218`, Military `12:263`, Competencies `13:216`.
- 2 Explore frames (`2:3`): Explore-list `84:3`, Explore-map `90:158`.
- Landing OverHero `21:18` **kept local** (set `19:21`, now OverHero-only after deleting `State=Light` `5:9`).

**Forms — 37 instances → the DS form family:** FormField ×10 (`88dd923c…`), OptionRow ×12 (set `d31a14f7…`; Checkbox/Unchecked `d5a94ce6…` ×9, Radio/Unchecked `c2c192df…` ×3), OAuthButton ×4 (`431abdb5…`), HintRow ×5 (`5067f0a9…`), StepFooter ×6 (`b3c1d94b…`). Full instance IDs in `robotics_career/docs/figma/FIGMA_MAP.md` §5 Pass-3 subsection.

**Retired (deleted, 0 instances doc-wide):** FormField `7:8`, OptionRow `11:52`, OAuthButton `8:14`, HintRow `7:11`, StepFooter `11:48`, `TopNavV2 State=Light` `5:9`. Local tier remaining: TopNavV2 (OverHero-only), SiteFooter `17:4`, CompetencyTile `13:213`, LinkedInIcon `8:7`, GoogleIcon `8:13`, Chip `81:3`, FilterDropdown `81:5`, JobCard `82:4`.

## Decisions this session

- **Landing OverHero nav kept local** (asked Caelan). The mega set dropped OverHero at D-044, so the Landing hero's transparent-over-hero nav has no like-for-like target. Options were swap-to-solid-Out+Off (loses the look), restore-OverHero-to-the-set (reopens D-044), or keep local. Kept local as a sanctioned Captures-file exception; the set now hosts only OverHero.
- **"Tighten gap" on the nav height drop** (asked Caelan). The mega nav is 60px vs the local 80px. Auth frames are VERTICAL auto-layout so content auto-reflowed up 20px and the frames hugged 20px shorter — no manual work. The 2 absolute Explore frames were nudged manually: Content + SiteFooter up 20px, frame height 1952→1932, preserving the original 40px nav-to-content gap.

## Sanctioned Figma-leads-code divergences (close at Pass 4)

1. **Nav light→dark unification.** Logged-out screens flip from the local light 80px nav (left search "Explore training or jobs…", `Resources ▾ · About us · Sign up · Sign in`) to the shared dark 60px mega nav (centered "Search roles, jobs, and programs" + sliders icon, gold gear + "RoboticsCareer.org" wordmark, `Resources ⌄ · Sign In · gold Sign Up`). Net deltas: light→dark, 80→60px, wordmark added, **"About us" link dropped**, search relabeled + centered, casing Sign up→Sign Up. Code `TopNavV2.tsx` still renders the light nav.
2. **Explore nav search now visible.** The local Explore navs hid search; the mega set always shows the centered search (redundant with the in-body "Keywords" search). `Explore.tsx` keeps it hidden until Pass 4.
3. **Header gap −20px compensation** (per the "tighten gap" ruling above) — a layout consequence of the shorter nav, not a design change.

## Notes to self / gotchas (for LESSONS.md if they recur)

- **`swapComponent` is override-preserving and property-mapping.** Swapping a propless local master to a property-driven DS master (built from the same capture, L-009) carried every override — placeholder text, dropdown chevron glyph, password-eye glyph, the nested Google brand icon — and mapped them straight into the DS component properties (`Label`, `Show Icon`, `Glyph`/`State` variants). No manual `setProperties` or glyph re-set was needed. Confirmed by piloting the trickiest cases first (State dropdown, Google OAuthButton, checkbox OptionRow) before batching.
- **Imported components are transient across `use_figma` calls.** `importComponentByKeyAsync` mints fresh node IDs each call (198:x one call, 199:x the next); never reference an imported node ID across calls — re-import in the same call, or use the stable component **key**. For a set variant, `importComponentByKeyAsync(variantKey)` returns the exact variant node to `swapComponent` to.
- **`get_metadata` stale-page-list persists** on this file (Cover only); use `figma.root.children` via `use_figma`.
- **Transport drops mid-call ~3× this session** ("socket connection closed" / "transport dropped; response lost"). `use_figma` is atomic and the writes committed anyway — always re-read state to confirm rather than blind-retrying; the swaps were idempotent so re-running would have been safe too.
- **Absolute vs auto-layout frames behave differently on a component height change.** Auto-layout (the 8 auth frames) self-heals spacing + frame height; absolute frames (the 2 Explore frames) need explicit child-nudge + frame resize.

## Verification

Zero instances remain on any old local master (document-wide `.instances` census) after the swaps; 55 remote DS instances on Sign-up, 4 on Explore. Screenshots confirmed fidelity across every form type — FormField (incl. dropdown chevrons + password eyes), HintRow, OAuthButton (LinkedIn + Google brand icons), StepFooter, checkbox + radio OptionRow — and the nav composites read clean on both light auth pages and the Explore page. No raw hex introduced (swaps carry the DS masters' bound paints).

## Docs updated

- `robotics_career/docs/figma/FIGMA_MAP.md` — §5 local tier updated + a Pass-3 swap/divergence subsection (the ground-truth manifest).
- `COMPONENTIZATION_RUN.md` — Pass 3 ticked in the ledger + a "Pass 3 outcomes" section.
- `DECISIONS.md` — D-048 (index + detail).
- `STATUS.md` — Pass 3 done, next Pass 4; this note linked.
