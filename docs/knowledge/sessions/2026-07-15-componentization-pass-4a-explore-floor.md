# Componentization Pass 4 — pre-flight audit, slice plan, and 4a (explore_floor) executed

**Resume here.** Pass 4 (code alignment) was pre-flight audited, **sliced into 4a/4b/4c** (D-049), and **4a — explore_floor is complete** with all gates green. The other two slices are **deferred**: **4b — nav code** (dashboard centered-search + CtaButton radius; robotics_career two auth states) and **4c — Icon union** (path A: expand robotics_career's *local* `Icon.tsx`, clear ~33 raw spans). Robotics_career is deprioritized (Caelan). **The dashboard nav slice waits until career_dashboard's Phase-5-mechanics branch (`p5/01-mechanics-reset`) settles — re-check with Caelan next session whether it's done.** ⚠️ That repo's "Phase 5" ≠ this run's conditional "Pass 5." Full plan + come-back flags: `COMPONENTIZATION_RUN.md` "Pass 4 slice map".

**Token tidy — done, no republish needed.** The "two unpublished tokens" turned out to need no library change: `Color/Neutral/Ink 2` = `#595959` already ships in the DS library (the Pass-2 "no primitive exists" note was stale). Rebound the raw SignalBar-track fill in the Interest Quiz file to it (master `127:172` → propagated to all 8 instances; 0 raw `#595959` left); `--color-white` was already bound to `On CTA` (0 raw whites). Local edit, nothing to republish (answers Caelan's "Figma shows nothing to publish" question). Detail: `FIGMA_MAP.md` §8. **Also recorded this session:** D-050 (code stays per-repo-aligned, not merged — the answer to "why not one shared code library"), and L-011 (cross-repo component mirrors must map token classes to the consuming repo's theme; Tailwind v4 drops unknown utilities silently).

## What ran this session

1. **Pre-flight audit** of Pass 4 against the registry (`rc-design-system/REGISTRY.md`) + all three FIGMA_MAP divergence manifests + the live code in all four repos + git state. Finding: the Figma tier (Passes 0–3) is clean; every "set aside" item is logged, not lost. The gaps were code-plan-side and are resolved by Caelan's calls below.
2. **Figma spot-check** (transport healthy this time): screenshotted the TopNav mega set (3 variants — the `Auth=Out` robotics_career target matches spec exactly), CtaButton (5 rectangular variants), PillButton (gold/teal/outline pills). **PASS — as documented.**
3. **Plan of record** written (D-049 + ledger slice map + STATUS): Pass 4 sliced; all rulings recorded.
4. **4a executed** (explore_floor).

## Decisions this session (Caelan)

- **Icon = path A** — expand robotics_career's *local* Icon, not migrate to `@rc/ui`'s (which robotics_career doesn't import; a package route also drags in a Caelan-only tag push). Parallel `@rc/ui` bump optional.
- **robotics_career = light scope + deprioritized** — nav auth states only when we get to it; button convergence (`GoldButton`/`GoldPill`/`OutlinePill` → shared) deferred. Come back to it.
- **Dashboard nav slice waits** on its Phase-5 branch settling; re-check next session.
- **CardHead/DEF-012 code side** → folds into conditional Pass 5.
- **Two unpublished tokens** — reopened; clear to publish (no other active Figma work), staged for Caelan's republish.
- **Orphans** (`ProgressBar`/`SegmentedControl`) — delete. Done.
- **4a CTA typography = faithful** — route the primary CTAs through the shared CtaButton and accept its lighter 14px-medium type (over the old 16px-bold), for true design-system consistency. (Asked via a preview A/B; chose "Unified, faithful.")

## 4a changes (explore_floor)

- **New `src/components/CtaButton.tsx`** — code mirror of the ecosystem CtaButton set (`color` gold/teal/outline × `size` lg/md, `rounded-md` 8px, `h-control-lg/md`, `font-body font-medium`, built-in icon gap). Barrel-exported. Retires the Phase-0 `Button` for primary CTAs (`Button` stays for `/select` only).
- **Routed through it:** Landing "Start" (gold/lg, §8 #2), flow "Continue" (gold/lg, §8 #4), role-overview + job-overview rail CTAs (teal/lg w-full, §8 #5 — standardized to lg 36px height; the Figma 54px was a frame concession with no code reflow equivalent).
- **Inline:** guest pill → "G" initial-avatar (§8 #1); compare Education bullets faint→muted (§8 #3); set-as-target `px-space-4`→`px-space-3` (§8 #6).
- **No-op:** §8 #7 (RoleTab inactive underline) already `border-transparent` in code.
- **Deleted:** the two orphaned components + barrel exports.
- **Deferred (per §8):** the two Flow Back buttons — already reasonable ghost controls.

## Gates

lint clean · typecheck OK · **82/82 unit** · **3/3 E2E** (narrative / role-select / reduced-motion). Landing + flow-intro self-screenshotted: the gold "Start" CtaButton reads well as a hero (the faithful shrink is not too small), the "G" guest avatar is correct, no downstream breakage.

**Design review (`design-reviewer` subagent, full live walk): PASS** on both rubrics (`design-system-compliance`, `results-screen`) — on-token, AA-legible, no results-clarity regression; the faithful lighter CTA type passes hierarchy. It caught **one latent p2 in the new component**, now **fixed**: `CtaButton.tsx` `size="md"` mapped to `text-label`, which isn't a token in *this* repo's scale (copied from the dashboard's theme) — Tailwind v4 would silently drop it. Latent only (no `md` call sites; all four CTAs use `lg` → the valid `text-small`). Fixed to `text-small`. The p3 gold-reserved watch (gold set-target pill on a Technician job-overview) is a sanctioned pass, no change.

## Not committed

All 4a code + the doc updates are uncommitted (commit/push left to Caelan per the usual rule). Prior "Awaiting Caelan" pushes still stand (STATUS).
