# 2026-07-03 — Componentization Pass 0: audit + promotion registry ratified (D-042)

**Resume here.** Pass 0 is **done and ratified**: the promotion registry lives at **`rc-design-system/REGISTRY.md`** (pointer in its `conventions.md`), and the four open questions are settled (D-042): **two button sets** (`CtaButton` rectangular + `PillButton`), **chip fold** (`MetaChip`/`GoldChip` retire into one shared `Chip`, 5 shipped combos + Show Icon), **nav OverHero kept** as a `Scroll=Solid/OverHero` axis (OverHero = the Auth=out design minus the bar background, ink switches for legibility — Caelan's guidance arrived in-session, no more screenshots needed), **registry home = `REGISTRY.md`**. Next action: **Pass 1 in a fresh session** — the shared-tier build in the DS library (`COMPONENTIZATION_RUN.md` Pass 1 spec; extraction-first per L-009). Open holds: none from Caelan except pushing today's two commits (explore_floor + rc-design-system).

## What we did

- **Cross-repo audit (read-only):** two parallel inventory agents (robotics_career file-internal components; explore_floor shared dir + results vocabulary) plus direct reads of the dashboard's `DESIGN_SYSTEM.md` §7 / `FIGMA_MAP` §6, robotics_career's FIGMA_MAP, the quiz FIGMA_MAP, the dashboard `Chip`/`CtaButton` sources, and the packaged `@rc/ui` Icon.
- **Key evidence surfaced:** every robotics_career CTA is a 36px pill (no rectangular button exists there); the dashboard is rectangular 6px (`CtaButton`, 17 extracted call sites); the quiz splits (rounded-md gold Button on Landing/Select, 36px pills in the results chrome); the dashboard `Chip` allows 32 combos but ships 5; the DS library's kit-verbatim `Button`/`Nav Bar`/`Footer` are provenance artifacts matching no shipped control; the Icon union sizes at **61 names**; explore_floor's `ProgressBar` + `SegmentedControl` are orphaned (zero call sites); the nav reference image's Sign Up CTA is a rounded-rect gold button (a `CtaButton`, not a pill).
- **Strawman → rulings:** presented the cluster matrix; Caelan ruled two button sets, the chip fold as proposed, keep OverHero (overruling the audit's drop recommendation — 1 of 11 screens uses it, but the hero treatment is a designed state), `REGISTRY.md` as home.
- **Registry written and ratified:** `rc-design-system/REGISTRY.md` — §1 new shared sets (TopNav mega set, CtaButton, PillButton, Chip, the form family as five sets), §2 published-unchanged, §3 retirements/supersessions, §4 per-file local tiers, §5 the Icon union, §6 not-a-component, §7 folded-in debts.
- **Bookkeeping:** run-doc ledger ticked + outcomes section replaces the open questions; nav spec finalized in the run doc; D-042 logged; STATUS updated.

## State at end of session

- No `src/`, no Figma changes — Pass 0 was read-only outside the registry and bookkeeping. Gates untouched (last green: lint / typecheck / 82 unit / 3 E2E at `b10ba65`).
- Two commits this session: explore_floor (run doc, DECISIONS, STATUS, this note) and rc-design-system (`REGISTRY.md` + `conventions.md` pointer). Pushes are Caelan's.

## Next session

**Pass 1 — the shared tier** (`COMPONENTIZATION_RUN.md`): in the DS library via the Plugin API, build TopNav (extract `Auth=In` from Interest Quiz `25:32`; author `Auth=Out` from the reference image; derive `OverHero` per the D-042 ruling), `CtaButton` (settle the 6px-vs-8px radius at the master build), `PillButton`, the consolidated `Chip` (then retire `MetaChip`/`GoldChip` after instance swaps), and the form family from the Captures masters; reconcile `CardHead`'s DEF-012 action slot. Publish, then update each owning repo's FIGMA_MAP.
