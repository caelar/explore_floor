# Ecosystem run — the pass ledger

_Execution ledger for `ECOSYSTEM_PLAN.md` (the rationale doc; read it for the "why"). Direction ratified by Caelan 2026-07-02 (D-035). The work is deliberately split into single-session passes so each session starts cold from this doc without re-deriving research._

**Session protocol.** Start a pass by reading `STATUS.md`, then this doc's next unchecked pass. Finish a pass by ticking its gates here, updating `STATUS.md`, and writing a session note. Don't run two passes in one session unless one is trivially small and green.

## Ledger

| Pass | What | Status |
|---|---|---|
| 1 | Asset rescue + this run sheet + D-035 bookkeeping | ✅ done 2026-07-02 |
| 2 | Stand up `rc-design-system` (`@rc/ui`) | ✅ done 2026-07-02 (pushed, tag `v1`) |
| 3 | Excavate Kayla's branches into `robotics_career` | ✅ done 2026-07-02 (pushed; + six-role content) |
| 4 | Harness port into the UX repo | ✅ done 2026-07-02 (+ baseline design review) |
| 5 | Tokenize Kayla's ~90 hex literals | ✅ done 2026-07-02 (from `robotics_career`) |
| 6 | explore_floor pre-sync pass | ✅ done 2026-07-02 (+ full weight-honesty sweep) |
| 7 | Figma: dark variables + Interest Quiz file + capture | ✅ **done 2026-07-03 (D-039 core + D-040 remainder)** — editable variable-bound rebuilds landed, steps 7–8 closed (step 7 cross-repo, UX D-007) |
| — | Stretch (only if calm): consumer conversion, atoms tier | ☐ |

**Standing rulings** (Caelan, 2026-07-02):
- GitHub remote: install `gh` CLI when Pass 2 needs it (`brew install gh`; Caelan runs `! gh auth login` interactively), then `gh repo create caelar/rc-design-system --private`.
- Rescued assets live in `robotics_career/public/figma-assets/`; Kayla's branches stay untouched.
- The 2026-07-01 Finder deletions (`style_guide/`, `RC_Proto`, `Floor_Explore_v1_superseded`, `career_dashboard_design`) were intentional; nothing to recover. The Angular `rc-ui-kit` only existed to seed the Figma style guide, so **the ARM UI-kit handoff is the Figma files alone** — this revises `archive/REALIGNMENT.md` §10's Fivestar-guardrail artifact list (was: Figma file + Angular kit + prototype). Parent `Capstone/CLAUDE.md` still names RC_Proto as active; fixing its folder map belongs to a Cowork session.

---

## Pass 1 — Asset rescue + run sheet + bookkeeping ✅ (2026-07-02)

The 10 hot-linked `figma.com/api/mcp/asset/...` URLs on `career_dashboard` `origin/homepage-and-explore` (captured ~06-30, dead ~07-07) were downloaded into `robotics_career/public/figma-assets/` — 3 PNG + 7 SVG, all verified non-empty with matching types. `MANIFEST.md` beside them maps URL id → filename → source constant (`HERO_BG` etc. in `Landing.tsx` / `SiteFooter.tsx` / `TopNavV2.tsx`) so Pass 3 rewrites references mechanically to `/figma-assets/<file>`. D-035 recorded; docs repointed (`DESIGN_SYSTEM_RUN.md`, `REMAINING_WORK.md`, `STATUS.md`, `ECOSYSTEM_PLAN.md` header).

---

## Pass 2 — Stand up `rc-design-system` (`@rc/ui`) — ✅ (2026-07-02)

Executed as specced; both gates PASS (133/133 base byte-identical, 27/27 dark with the two `-on` rewrites, 160/160 flatten parity; packed-tarball Mode-A smoke verified in-browser). Repo at `Prototypes/rc-design-system`, main @ `4dae373`, tag `v1`, typecheck green; **pushed to `github.com/caelar/rc-design-system` (private) with the tag** — the git dep `"@rc/ui": "github:caelar/rc-design-system#v1"` is live for Pass 3. One divergence from the spec text: pnpm 11 needs `pnpm-workspace.yaml` `allowBuilds: esbuild` for tsup (committed). Session note: [2026-07-02](./sessions/2026-07-02-ecosystem-pass-2-rc-design-system.md).

**Goal.** A new sibling repo at `Prototypes/rc-design-system`, the tokens-first backbone (`ECOSYSTEM_PLAN.md` §2): kit tokens + dark extension, fonts, base, one atom (`Icon`), FIGMA_MAP foundations. No more atoms, no consumer conversion, no design-sync — those are the stretch pass. Design was fully worked out in the Pass-1 session (multi-agent survey of both repos + a planning pass); execute as specced below.

**File tree** (every file):

```
rc-design-system/
├── package.json          # below; peerDep react ^18.3.1; scripts: build (tsup), typecheck (tsc --noEmit)
├── tsconfig.json         # jsx react-jsx, moduleResolution bundler, strict, noEmit
├── tsup.config.ts        # entry src/index.ts, format esm, dts, external react + react/jsx-runtime, clean
├── .gitignore            # node_modules/ only — dist/ IS committed
├── README.md             # what/why, install line, the two consumption modes, Icon usage, dist rule
├── conventions.md        # adapted from career_dashboard/.design-sync/conventions.md; see Docs below
├── styles.css            # entry: @import './fonts/fonts.css'; @import './tokens/tokens.css'; @import './base.css';
├── base.css              # career_dashboard globals.css L311–340 verbatim, @layer base kept
├── tokens/
│   ├── theme.css         # Tailwind v4 source: @theme (151 tokens) + @theme inline (9 aliases)
│   └── tokens.css        # flattened :root — all 160 pairs, name/value identical to theme.css
├── fonts/                # 5 woff2 copied from career_dashboard/public/fonts + fonts.css
├── src/
│   ├── index.ts          # export { Icon } from './atoms/Icon'; export type { IconName }
│   └── atoms/Icon.tsx    # see Icon below
├── dist/                 # committed tsup output (index.js + index.d.ts)
└── figma/FIGMA_MAP.md    # career_dashboard/docs/figma/FIGMA_MAP.md lines 1–311 + provenance header
```

**package.json** (exact):

```jsonc
{
  "name": "@rc/ui",
  "version": "1.0.0",
  "type": "module",
  "description": "RC design-system tokens, fonts, base styles, and shared atoms (research-prototype grade).",
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./styles.css": "./styles.css",
    "./base.css": "./base.css",
    "./tokens.css": "./tokens/tokens.css",
    "./theme.css": "./tokens/theme.css",
    "./fonts.css": "./fonts/fonts.css"
  },
  "files": ["dist", "tokens", "base.css", "styles.css", "fonts"],
  "scripts": { "build": "tsup", "typecheck": "tsc --noEmit" },
  "peerDependencies": { "react": "^18.3.1" },
  "devDependencies": { "@types/react": "^18.3.18", "react": "^18.3.1", "tsup": "^8.3.5", "typescript": "^5.7.2" }
}
```

No `"private": true` (blocks `pnpm pack`), no `prepare` script (see Build), no `sideEffects` field (absent = CSS never tree-shaken).

**Token merge — `tokens/theme.css`** (the careful part; merge rule: dashboard base verbatim, dark tokens appended, dashboard wins any collision — verified zero literal collisions):

- Base: `career_dashboard/src/styles/globals.css` L12–253 (`@theme` primitives, all comments kept — they carry D-026/DEF-013 provenance) + L262–272 (`@theme inline`, 9 aliases). That's the canonical 133 name:value pairs (the `.design-sync/NOTES.md` gate number).
- Dark append (27 tokens from `explore_floor/src/styles/globals.css`, inside the same `@theme` under a `/* ---- Dark system (from explore_floor D-029) ---- */` banner):
  - L48–50 dark surfaces: `--color-dark-canvas #1b1b1b`, `--color-dark-surface #292929`, `--color-dark-panel: var(--color-near-black)` (ref exists in the base).
  - L53–55 on-dark text ramp (3).
  - L58–62 glass set (5: fill, fill-strong, border, border-soft, panel).
  - L64–65 `--blur-bar` 8px, `--blur-panel` 14px.
  - L68–69 dark shadows: `--shadow-dark-panel`, `--shadow-dark-card`.
  - L76–89 role accents (12), with **two reference rewrites**: `--color-role-specialist-on` and `--color-role-integrator-on` change `var(--color-white)` → `var(--color-on-cta)` (value-identical `#ffffff`; `--color-white` doesn't exist in the dashboard base). `--color-role-technician-on: var(--color-near-black)` and the three accent refs (`arm-gold`/`arm-teal`/`arm-orange`) resolve as-is.
- Judged exclusions (stay in explore_floor, list them in conventions.md): `--color-constellation-line` (quiz-bound), the quiz containers (`--container-read/results/map/map-card/constellation/job-panel`) + `--spacing-nav` + `--ease-snap`, explore_floor's divergent radius/shadow/type-scale blocks and its light-semantic block (collides semantically with dashboard neutrals). Note: `--color-arm-gold-soft`/`--color-arm-teal-soft` (dark CTA hover tints) deliberately not shipped — cheap v1.1 if the UX repo wants CTA hovers on dark.
- Flatten to `tokens/tokens.css`: one `:root { }`, all 160 pairs in source order, `var()`/`color-mix()` untouched (recipe documented in `career_dashboard/.design-sync/NOTES.md`).

**base.css.** Dashboard globals L311–340 verbatim, keeping the `@layer base` wrapper. Ships the light body defaults (first consumer is the light marketing site; a dark app overrides `body` in 2 lines). Do not carry explore_floor's `*:focus-visible` ring (dark-tuned) or add the design-sync bundle's `.material-icons` font-size tweak.

**fonts/.** Copy the 5 woff2 from `career_dashboard/public/fonts/` (montserrat-700, roboto-400/500/700, material-icons). `fonts.css` = dashboard globals L275–309 with `url('/fonts/x.woff2')` → `url('./x.woff2')` (5 rewrites). Relative URLs are correct: Vite rebases `url()` in CSS imported from node_modules and bundles the woff2 — consumers need no public/fonts copies.

**Icon.** Copy `career_dashboard/src/components/Icon.tsx` (92 lines, React-only) with exactly two changes: (1) drop `leading-none` from the className (render-identical — `.material-icons` already sets `line-height: 1`; keeps the atom Tailwind-utility-free so consumers need no `@source`); (2) provenance header (source path, date, note that explore_floor's local Icon carries extra names — union deferred to the atoms pass).

**Build: tsup, committed dist, no `prepare`.** Committed dist keeps `file:`/`link:`/git-dep installs all working without the consumer resolving the package's toolchain; a `prepare` script doesn't fire for `link:` and is unreliable across `file:` flows. Discipline rule for the README: touched `src/`? run `pnpm build` before committing.

**Docs.**
- `figma/FIGMA_MAP.md`: copy lines 1–311 of `career_dashboard/docs/figma/FIGMA_MAP.md` (§1–§6, the shared foundations; §7 "Dashboard file" starts at L312 and stays behind, along with §8). Prepend provenance: copied date; the Figma DS file `afi5Q5nFtcnT9HJ04Cbylg` remains the values authority; the dashboard keeps its own full per-project map; on §1–§6 drift, re-copy from whichever repo last synced against Figma. Trim the header's dashboard-phase status paragraph.
- `conventions.md`: adapt the dashboard's `.design-sync/conventions.md` (token vocabulary, color-intent rules), then add the dark vocabulary (canvas < surface < panel elevation; text-on-dark ramp; glass family — and note `--color-on-glass-*` is the dashboard's *light* frost family, distinct from the dark `--color-glass-*`), the two consumption modes below, the `@source` note, and the merge provenance (base verbatim, +27 dark, the two `-on` rewrites, the left-behind list).
- Two consumption modes (document in conventions.md + README):
  - **Mode A — Tailwind v4 app** (the pattern for `robotics_career`): inside the consumer's Tailwind-processed stylesheet: `@import 'tailwindcss';` then `@import '@rc/ui/theme.css';` `@import '@rc/ui/fonts.css';` `@import '@rc/ui/base.css';`. Generates utilities (`bg-arm-gold`, `p-space-3`, `text-h4`, `rounded-card`) + `:root` vars. Critical caveat: `theme.css` must be imported in that CSS file, not as a JS import, or no utilities are generated.
  - **Mode B — non-Tailwind surface** (Claude Design sync, plain CSS): `import '@rc/ui/styles.css'` → fonts + flattened `:root` tokens + base; style via `var(--token)`.
  - Content scanning: the shipped Icon uses zero Tailwind utilities, so no `@source` needed at v1. If future atoms use utilities, consumers add `@source "../node_modules/@rc/ui/dist";`.

**Git + remote.** `git init -b main` → `pnpm install && pnpm build && pnpm typecheck` → commit → `git tag v1` → `brew install gh`, Caelan runs `! gh auth login`, `gh repo create caelar/rc-design-system --private --source=. --push`, push the tag. If auth stalls, stay local-and-committed; push later is a one-liner. Note: git-dep consumers pin the resolved commit in their lockfile; moving `v1` later means force-retag + `pnpm update @rc/ui`.

**Exit gates.**
1. **Gate 1 — textual faithfulness** (scratchpad script, not in the repo): name:value pairs of theme.css vs dashboard globals L12–272 → the 133 base pairs byte-identical; the extras → exactly the 27 dark names matching explore_floor values except the two documented `-on` rewrites; tokens.css vs theme.css → identical 160 pairs.
2. **Gate 2 — runtime smoke** (`pnpm pack` emulates what a git dep delivers, including the `files` allowlist): scratch Vite react-ts app installs the tarball + tailwindcss v4 + `@tailwindcss/vite`; Mode-A CSS entry; renders a kit card (`bg-arm-gold rounded-card p-space-3`), a dark strip (`bg-dark-canvas text-text-on-dark` with a `text-role-specialist-soft` span), and `<Icon name="lightning" size={24}/>`. Verify in-browser: computed `--color-arm-gold` = `#ffb81c`; `document.fonts.check("16px 'Material Icons'")` and `("700 16px Montserrat")` true; the icon renders as a glyph, not ligature text.
3. `pnpm typecheck` green; repo committed and tagged; pushed if auth cooperates.

---

## Pass 3 — Excavate the branches into `robotics_career` — ✅ (2026-07-02)

Executed as specced, plus the now-unblocked content call. Repo at `Prototypes/robotics_career`, main @ `2a89b55` (3 commits), **pushed to `github.com/caelar/robotics_career` (private)**. Both flows click through console-clean on `@rc/ui` Mode A (zero local token authorship); lint + typecheck green; all 10 assets serve from `/figma-assets/`. Beyond the spec: the Landing role section now carries **ARM's six published roles** — the four legacy tabs collapsed to the three robotics roles (reference doc) plus the three AI roles (transcribed from Caelan's live-site screenshots into `robotics_career/docs/reference/ARM_AI_Role_Structure.md`), as a grouped tab rail (ROBOTICS / AI); role content extracted to `src/data/roles.ts`; `competencies.ts` names reconciled verbatim to ARM's site (ids stable). Fixed in passing: the stray `;;`, a JobCard button-in-button nesting, an import-spacing typo. Deliberate keeps: local `Icon.tsx` (Kayla's 5 names aren't in the packaged Icon — atoms-pass item), local montserrat-500 face (`@rc/ui` v1.1 candidate), the `us-atlas` CDN topojson. Session note: [2026-07-02](./sessions/2026-07-02-ecosystem-pass-3-robotics-career.md).

**Kayla-prereq answers, now standing rulings (Caelan, 2026-07-02):**
- The "RC.org Prototype" file key is **`k3AjijocJEmzrvlKTd9vJM`** — **pull-only** (design source and asset source). Code→Figma sync for the UX repo goes to a **new Figma file** stood up in the Figma pass, never into Kayla's file. (Amends this sheet's Pass 4/Pass 7 lines that named her file as capture target.)
- Branch intent confirmed: the two branches were always meant to combine into one new prototype, and **the old branches close once their work is in the new repo** (supersedes the earlier leave-in-place-for-provenance note). Local archive tags `archive/homepage-and-explore` + `archive/sign-up-flow` exist in career_dashboard; the remote tag push + branch deletion await Caelan (git-push deny rule): `git push origin tag archive/homepage-and-explore tag archive/sign-up-flow && git push origin --delete homepage-and-explore sign-up-flow`.
- Landing content: adapt to ARM's new six-role content (done, above). The quiz's own AI build (D-034) stays deferred; explore_floor's three-robotics-role hard rule is unchanged.

**Original prerequisite note (for the record):** Kayla coordination — branch intent, the file key (nodes 815:3564 NavBar, 815:3201 homepage, 796:1949 competencies, 555:1262 sign-up panel, 360:1018 the June-22 quiz mockup), and the Landing content call (old four-category role tabs, "NOW FEATURING AI ROLES" hero badge).

**Steps** (`ECOSYSTEM_PLAN.md` §3; the branches only work as a pair — disjoint file sets, each imports the other's files; merging is conflict-free):
1. `git init -b main` in `robotics_career` (rename first if wanted — Caelan keeps the naming call), first commit = the already-rescued `public/figma-assets/` + MANIFEST.
2. Merge `origin/homepage-and-explore` + `origin/sign-up-flow` in a scratch worktree of career_dashboard; copy over: config files (new dev port — dashboard pins 5180, explore_floor 5174; pick 5186), trimmed `package.json` (drop zustand + vitest — unused; add `react-simple-maps`; add `"@rc/ui": "github:caelar/rc-design-system#v1"`), `competencies.ts` + its type, `src/shell/`, `src/screens/{Landing,Explore}.tsx`, `src/screens/auth/*`, fresh minimal `App.tsx` with only marketing + auth routes.
3. Tokens/fonts/Icon come from `@rc/ui` (Mode A), not local copies. Rewrite the 10 asset constants to `/figma-assets/<file>` per MANIFEST.
4. Stub the dashboard seams: `/dashboard` back-links in Profile/Saved (those screens stay behind), the sign-up completion `navigate` target.
5. Vendor or accept the `us-atlas` CDN topojson for the Explore map (decide in-session).
6. Run gates: lint, typecheck, dev-server console clean. The branch code has never been through any (stray `;;`, an undefined `font-montserrat` class — that fix lands in Pass 5 unless trivial here).
7. Create the GitHub remote (`gh repo create caelar/<name> --private`) and push.

**Do not** merge the branches into career_dashboard main (couples the marketing site to the dashboard; `competencies.ts` renames ripple into dashboard widgets/tests). Leave the branches in place for provenance.

**Exit gates:** app runs on `@rc/ui` with zero local token authorship; both flows (landing→explore, sign-up) click through clean; repo pushed.

## Pass 4 — Harness port into the UX repo — ✅ (2026-07-02)

Executed as specced, plus a baseline `/design-review`. `robotics_career` main @ `5899ca0` (local; push awaits Caelan): commands/subagents/guard-hook/settings ported from the dashboard (thresholds unchanged; hook verified firing on both violation classes), README shape from this repo, regenerated per-project: `CLAUDE.md`, the `content-data` skill, `docs/ROADMAP.md`, seeded FIGMA_MAP (Kayla's key **pull-only** per the Pass-3 ruling; capture target = TBD row for Pass 7), knowledge layer with D-001–D-005 seeded from the standing rulings. All exit gates green (lint/typecheck, cold cross-reference sweep, hook fires). The **baseline review** graded the screens against the new rubric: 87 hex (75 map value-exactly to tokens — Pass 5 is largely mechanical; 7 unmapped need calls), the 3 `font-montserrat` sites confirmed, all routes console-clean, and **two design-intent questions routed to Caelan's refinement** (gold-as-primary-CTA vs teal-acts; red requirement feedback vs the no-red status system). Session note: [2026-07-02](./sessions/2026-07-02-ecosystem-pass-4-harness-port.md).

**Rulings this pass (Caelan, 2026-07-02):**
- A small `docs/ROADMAP.md` joins the fresh knowledge layer (phases mirror the repo-touching passes) so `/phase-check` keeps the sibling shape.
- The rubric is authored **normatively against the target `@rc/ui`/kit-aligned system**, not around Kayla's current screens — its failures are the Pass-5 + refinement worklist. The separate taste/screen-quality rubric is **deferred** until the Figma/Claude Design refinement direction exists (trims this pass's "rubrics beyond design-system-compliance" line).

**Original spec (for the record).** Hand-port, best-of-both (`ECOSYSTEM_PLAN.md` §4; no template repo before handoff — extract that later as a post-handoff artifact):
- From **career_dashboard**: `capture-figma.md` / `pull-figma.md` (FIGMA_MAP-aware generation) and `phase-check.md` (has the spec-consistency step), the 7-01 token-slimdown conventions (STATUS snapshot, DECISIONS index, guard hook — dashboard's shape + thresholds).
- From **explore_floor**: the root `README.md` onboarding/harness sections (the dashboard has no root README).
- Regenerate per-project: skills (a data-discipline skill for the inline mock content; an interaction skill only if a footgun appears), rubrics beyond design-system-compliance, the seeded per-project FIGMA_MAP — register Kayla's "RC.org Prototype" file `k3AjijocJEmzrvlKTd9vJM` as **design source, pull-only**; the capture target is the new file from the Figma pass (Pass-3 ruling).
- `settings.json` nearly as-is; no `.mcp.json` (D-012); skill packs are a human install (`npx skills add`, L-002).
- Knowledge layer: STATUS.md, DECISIONS.md, sessions/, CLAUDE.md written fresh for the repo.

**Exit gates:** session ritual works cold (STATUS → commands run), guard hook fires, docs cross-reference clean.

## Pass 5 — Tokenize Kayla's hex literals — ✅ (2026-07-02)

Executed as specced from `robotics_career` (main @ `7347f6b`, local; push awaits Caelan). Every value in its `src/` is now token-traceable against `@rc/ui`: the ~90-hex census retired (only the 5 exempt brand fills + 2 ruled `#2BA4C4` map-pin keeps remain, commented), `font-montserrat`/faux weights gone, **the dense type folded onto the steps `@rc/ui` v1 already ships** (11→caption, 13→small, micro-10→eyebrow — zero new tokens, **no v1.1 bump needed**), content extracted to `src/data/` (faqs/testimonials/authOptions). Caelan's Batch-F rulings logged as its **D-006** (snaps + commented keeps: map-pin teal candidate, plain 10px, 36/26px between-steps, radius-20 cards, frost + footer alpha whites, layout heights, upward/inset shadows). All exit gates met: hex grep at target, lint/typecheck green, 11 routes console-clean at both widths, before/after screenshots unchanged apart from ruled snaps, and the `/design-review` re-run **flips the tokens + type sections to pass** — the remaining findings are exactly its `REFINEMENT_BRIEF.md`. Session note: `robotics_career/docs/knowledge/sessions/2026-07-02-pass5-tokenization.md`.

**Original spec (for the record):**

**Run this pass from `robotics_career`** (its harness only fires in-repo; Pass-4 ruling). The full execution spec is **`robotics_career/docs/knowledge/PASS_5_TOKENIZATION.md`** — written at Pass-4 close-out from the baseline `/design-review`, with the graded census (87 hex: 75 mechanical 1:1, 7 unmapped, 5 exempt), the batch plan, and the Batch-F decision list for Caelan. Close-out ticks THIS ledger cross-repo (docs commit here), the mirror of how Passes 2–4 were closed from this side. Reference snapshots of this doc + the plan live at `robotics_career/docs/reference/ECOSYSTEM_{PLAN,RUN}.md` (read-only copies; this file stays canonical).

Original scope (for the record): ~90 hard-coded hex literals, almost all 1:1 token values (20× `#E0E0E0` → `border`/`--color-border-*`, 17× `#595959` → ink-2, etc.). Mechanical replace against the `@rc/ui` vocabulary. Fix `font-montserrat` → `font-heading` (the class doesn't exist as a token; silently renders Roboto). ~~Fix the stray `;;`~~ (landed in Pass 3). Do this **before any Figma capture from the repo** so captures bind to variables. This is the mini version of the dashboard's DEF-008 at 1/6 the size.

**Exit gates:** zero project-owned raw hex in components (grep; 5 exempt brand SVG fills), lint/typecheck green, screens visually unchanged (Playwright eyeball), `/design-review` tokens+type sections flip to pass.

## Pass 6 — explore_floor pre-sync pass — ✅ (2026-07-02)

Executed as specced, with one ruling and one scope-add. **Ruling (Caelan):** the sizing preference call went the other way from the sheet's default — snap to the dashboard's existing token ladder where close, mint on the same ladder where not. So `control-sm/md/lg` (24/32/36) came over verbatim from `@rc/ui`, `control-xl` (40) + `control-tap` (44) were minted (v1.1 candidates), and nine control sites were swept (`h-9`→`h-control-lg` ×6, search bar→`h-control-xl`, hero arrows→`size-control-tap`); the rest ratified raw (D-036). The faux-600 sites went `font-bold`, the `SceneSortView` animated sizes now read the new `lib/typeScale.ts` @theme mirror, and docs reconciled per D-037 (`DESIGN_SYSTEM.md` §1/§2/§5/§7 code-outward + dark mapping + kit shadows; steward swept ARCHITECTURE / ROADMAP / HANDOFF_GUIDE / DESIGN_SYSTEM_RUN; rubric space-scale check updated). **Scope-add:** the `/design-review` re-run (both rubrics PASS) exposed the same weight-honesty bug class as faux-*500* at nine more Montserrat sites (seven `font-medium` + the two tab rows' never-rendering bold/medium contrast) — swept in-session, render-identical. Two pre-existing p3s catalogued in `DEFERRED_DIRECTIONS.md` (mid-session reduced-motion flips; `TrajectoryViz` ring literals). Flagged for Caelan, not edited (harness self-modification): the stale "Figma wins for token values" line in `.claude/commands/revise-doc.md` + `.claude/agents/doc-steward.md`. All gates green (lint / typecheck / 82 unit / 3 E2E); controls measured 36/40/44, pixel-identical. Session note: [2026-07-02](./sessions/2026-07-02-ecosystem-pass-6-presync.md).

**Original spec (for the record).** No sprawl campaign needed (audit verdict: 5 arbitrary Tailwind values repo-wide, zero inline hex). Just:
- Fix the two faux-600 `font-semibold` sites (no 600 face loaded — the dashboard's L-011 bug class) and the `SceneSortView` animated `fontSize` literals.
- Reconcile two doc drifts via `/revise-doc`: `DESIGN_SYSTEM.md` §7 still documents the old Material triple-stack shadows (code moved to kit soft tiers); §2's Figma mapping omits the entire dark system (~30 tokens). Also retire §1's "Figma wins for tokens" claim re the dead RC-CC file (the declared code-outward flow supersedes it).
- Preference call (Caelan): ratify the ~18 Tailwind-default sizing steps (`h-9`, `h-10` control heights) as raw, or mint control-height tokens (dashboard precedent exists). Default: ratify as raw.

**Exit gates:** lint/typecheck/tests green (82 unit + 3 E2E), `/design-review` still PASS, docs reconciled.

## Pass 7 — Figma: dark variables + Interest Quiz file + capture + the dashboard-convention mirror — ✅ core (2026-07-02, D-039)

**Executed (core, 2026-07-02).** Steps 1–6 done: the dark extension is **published** in the DS library (24 variables — 17 raw Primitives + 7 Semantic aliases, mirroring code's raw-vs-`var()` split — plus 2 dark effect styles, all with lineage descriptions, narrow scopes, and verbatim WEB code syntax; value-verified against `globals.css` before Caelan's publish click), the Foundations/Color + Elevation pages render the dark section, the **Interest Quiz file** (`pjgrRJS5YYII1iciW7Pak2`) is live in the ARM team with Cover / Quiz Flow / Results pages, `docs/figma/FIGMA_MAP.md` is seeded as the binding authority both Figma commands now read first, the **capture gate was confirmed yes** and all 8 final screens are in the file as **reference stills** (1440×900 image fills, production build, settled states), and the doc canon flipped per D-038 (`DESIGN_SYSTEM.md` preamble/§2/§15 + new §16 keeps / §17 `@rc/ui` v1.1 proposals; steward swept ARCHITECTURE / ROADMAP / HANDOFF_GUIDE / DESIGN_SYSTEM_RUN / HARNESS / CLAUDE.md; the two harness precedence lines defer to §2). **Remainder: ✅ closed 2026-07-03 (D-040).** The editable variable-bound rebuilds landed — captured by Caelan with the official Figma Chrome extension (the MCP `generate_figma_design` pipeline stalled a second time), then renamed + bound via the MCP Plugin API (9 frames, 502 paints, rows in FIGMA_MAP §6; stills deleted per the replace ruling). Steps 7–8 below are done: step 7 cross-repo the same evening (the UX repo's own D-007 session), step 8 on 2026-07-03. Capture-method note for the rebuild session: the `generate_figma_design` HTML-capture pipeline is a dead end here (expiring single-use IDs, a false "completed", macOS occlusion throttling stalling captures ~150s — front the window first); build via `use_figma` against the stills. Session note: [2026-07-02](./sessions/2026-07-02-ecosystem-pass-7-figma-core.md).

**Original ruling (Caelan, 2026-07-02, D-038):** Pass 7 also carries the **full mirror of `career_dashboard`'s design-system conventions**, landed in the same session because that's when each piece becomes true. The dashboard's setup (its `DESIGN_SYSTEM.md` §2/§3.5–3.7/§12 + `docs/figma/FIGMA_MAP.md`) is the target shape; Pass 6's code-outward canon (D-037) is explicitly the pre-publication state this pass supersedes.

(`ECOSYSTEM_PLAN.md` §5. One confirmation first: the team-demand gate on capturing the quiz's final dark screens — ask once, then default to capture.)
1. **Publish the dark extension into the DS library** (`afi5Q5nFtcnT9HJ04Cbylg`) as additional named variables, not a second mode (code models dark as additive tokens, D-029): Dark Canvas, Dark Surface, on-dark text ramp, glass set, role glow derivatives. `DESIGN_SYSTEM.md` §2's dark table is the publication worklist. Follow the dashboard's lineage discipline: **every variable description states `kit: <name> (verbatim)` or `extension: <reason, with evidence>`.**
2. **Create a new "Interest Quiz" Figma file** in the ARM team, subscribing to the DS library. RC-CC (`yGDi4yDtptKttboTYV8on7`) is dead — don't resuscitate.
3. Port the dashboard's FIGMA_MAP-aware `/capture-figma` into this repo + **seed `docs/figma/FIGMA_MAP.md` per the dashboard's shape**: file keys, node IDs, the naming contract (PascalCase React name = Figma component-set name; `@theme` property = the variable's web code syntax verbatim; static UI round-trips, interaction states stay code-owned). §2's tables convert straight into the manifest.
4. Capture the final dark screens (results 5-screen set + quiz steps) into the Interest Quiz file.
5. **After publication, flip the doc canon (D-038):** rewrite `DESIGN_SYSTEM.md` §2's source-of-truth paragraph to the dashboard's three-artifact model (Figma wins values / the doc wins usage / code wins behavior) and add a dashboard-§12-style precedence section; add compact §3.6-style "reserved tokens + deliberate keeps" and §3.7-style "upstream proposals" sections (the `@rc/ui` v1.1 candidates: `control-xl`/`control-tap`, the montserrat-500 face, the Icon name union — consolidate from §5, globals comments, and this ledger). Run it via `/revise-doc` so the steward sweeps the ripples; log the supersession against D-037.
6. **Harness reword (authorized in D-038):** update the precedence line in `.claude/commands/revise-doc.md` + `.claude/agents/doc-steward.md` to **defer to `DESIGN_SYSTEM.md` §2** instead of hardcoding a winner. If the self-modification guard blocks it even with the D-038 authorization on record, hand Caelan the two one-liners.
7. ✅ **Done cross-repo (2026-07-02, UX repo D-007** — run from `robotics_career` since it's self-contained). The capture target **"RC.org Site Prototype — Captures"** (`F3GRK7HNLLtG48vPosyXKw`) is live and registered in that repo's FIGMA_MAP §1, and its first capture sweep landed the same session (Landing, 8 sign-up screens, TopNavV2 set + SiteFooter + 7 auth components, paints bound by publish-key import; Explore's two frames are labeled raster references pending their bound rebuild). _Original spec: register Kayla's key pull-only (done at Pass 4); stand up a separate capture-target file — never capture into Kayla's file (Pass-3 ruling)._
8. ✅ **Done (2026-07-03).** New Claude Design project **"RC.org Site — UX Refinement"** (`a28efdc8-57d4-4730-aec6-38e5141b19f5`) carries the `@rc/ui` Mode B closure verbatim (160-pair `tokens/tokens.css` diff-clean against the package, fonts incl. the local montserrat-500 face, base + button-cursor rule) plus `REFINEMENT_BRIEF.md`; return trip contracted as `refine/*.html` + `refine/CHANGES.md`. Repo-side `.design-sync/` (config / conventions / NOTES) written in `robotics_career`, uncommitted for Caelan. Do-not-merge held: the live-rip project (`8686032d…`) untouched; current-state captures deferred to the refinement session itself; the esbuild real-atoms bundle stays the conscious skip.

**Exit gates (status at the core close-out, D-039):** ✅ DS library carries the dark variables published with lineage descriptions; ✅ Interest Quiz file holds the captured screens *(as reference stills)*; ✅ **captures bind to variables, not raw values — met 2026-07-03 (D-040)**: all 9 screens are editable frames (Chrome-extension capture, Caelan-driven) with 502 paints bound to library variables via the MCP Plugin API; stills deleted per the replace ruling; per-frame `get_variable_defs` evidence in FIGMA_MAP §6; ✅ `FIGMA_MAP.md` is the binding authority `/capture-figma` reads first; ✅ `DESIGN_SYSTEM.md` carries the three-artifact precedence + keeps/proposals sections (steward-swept); ✅ the two harness lines defer to §2.

## Stretch — only if the last week is calm

Step-5 consumer conversion (repoint career_dashboard + explore_floor at `@rc/ui`, delete local token authorship — real regression risk, zero client-visible payoff; known deltas: explore_floor's `--text-small--line-height` 22px vs the package's 1.45, its Icon's extra names beyond the packaged 47). The remaining atoms tier (CtaButton, Chip, StatusPill, Ring, Meter, MetaRow, Card/CardHead — the §10 step-0 store-free audit first). The esbuild atoms bundle (default: skip).
