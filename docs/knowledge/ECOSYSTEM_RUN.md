# Ecosystem run — the pass ledger

_Execution ledger for `ECOSYSTEM_PLAN.md` (the rationale doc; read it for the "why"). Direction ratified by Caelan 2026-07-02 (D-035). The work is deliberately split into single-session passes so each session starts cold from this doc without re-deriving research._

**Session protocol.** Start a pass by reading `STATUS.md`, then this doc's next unchecked pass. Finish a pass by ticking its gates here, updating `STATUS.md`, and writing a session note. Don't run two passes in one session unless one is trivially small and green.

## Ledger

| Pass | What | Status |
|---|---|---|
| 1 | Asset rescue + this run sheet + D-035 bookkeeping | ✅ done 2026-07-02 |
| 2 | Stand up `rc-design-system` (`@rc/ui`) | ✅ done 2026-07-02 (pushed, tag `v1`) |
| 3 | Excavate Kayla's branches into `robotics_career` | ✅ done 2026-07-02 (pushed; + six-role content) |
| 4 | Harness port into the UX repo | ☐ next |
| 5 | Tokenize Kayla's ~90 hex literals | ☐ |
| 6 | explore_floor pre-sync pass | ☐ |
| 7 | Figma: dark variables + Interest Quiz file + capture | ☐ |
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

## Pass 4 — Harness port into the UX repo — ~1 session

Hand-port, best-of-both (`ECOSYSTEM_PLAN.md` §4; no template repo before handoff — extract that later as a post-handoff artifact):
- From **career_dashboard**: `capture-figma.md` / `pull-figma.md` (FIGMA_MAP-aware generation) and `phase-check.md` (has the spec-consistency step), the 7-01 token-slimdown conventions (STATUS snapshot, DECISIONS index, guard hook — dashboard's shape + thresholds).
- From **explore_floor**: the root `README.md` onboarding/harness sections (the dashboard has no root README).
- Regenerate per-project: skills (a data-discipline skill for the inline mock content; an interaction skill only if a footgun appears), rubrics beyond design-system-compliance, the seeded per-project FIGMA_MAP — register Kayla's "RC.org Prototype" file `k3AjijocJEmzrvlKTd9vJM` as **design source, pull-only**; the capture target is the new file from the Figma pass (Pass-3 ruling).
- `settings.json` nearly as-is; no `.mcp.json` (D-012); skill packs are a human install (`npx skills add`, L-002).
- Knowledge layer: STATUS.md, DECISIONS.md, sessions/, CLAUDE.md written fresh for the repo.

**Exit gates:** session ritual works cold (STATUS → commands run), guard hook fires, docs cross-reference clean.

## Pass 5 — Tokenize Kayla's hex literals — ~0.5 day

In the UX repo (post-excavation): ~90 hard-coded hex literals, almost all 1:1 token values (20× `#E0E0E0` → `border`/`--color-border-*`, 17× `#595959` → ink-2, etc.). Mechanical replace against the `@rc/ui` vocabulary. Fix `font-montserrat` → `font-heading` (the class doesn't exist as a token; silently renders Roboto). Fix the stray `;;`. Do this **before any Figma capture from the repo** so captures bind to variables. This is the mini version of the dashboard's DEF-008 at 1/6 the size.

**Exit gates:** zero raw hex in components (grep), lint/typecheck green, screens visually unchanged (Playwright eyeball).

## Pass 6 — explore_floor pre-sync pass — ~0.5 session

No sprawl campaign needed (audit verdict: 5 arbitrary Tailwind values repo-wide, zero inline hex). Just:
- Fix the two faux-600 `font-semibold` sites (no 600 face loaded — the dashboard's L-011 bug class) and the `SceneSortView` animated `fontSize` literals.
- Reconcile two doc drifts via `/revise-doc`: `DESIGN_SYSTEM.md` §7 still documents the old Material triple-stack shadows (code moved to kit soft tiers); §2's Figma mapping omits the entire dark system (~30 tokens). Also retire §1's "Figma wins for tokens" claim re the dead RC-CC file (the declared code-outward flow supersedes it).
- Preference call (Caelan): ratify the ~18 Tailwind-default sizing steps (`h-9`, `h-10` control heights) as raw, or mint control-height tokens (dashboard precedent exists). Default: ratify as raw.

**Exit gates:** lint/typecheck/tests green (82 unit + 3 E2E), `/design-review` still PASS, docs reconciled.

## Pass 7 — Figma: dark variables + Interest Quiz file + capture — ~1–1.5 days

(`ECOSYSTEM_PLAN.md` §5. One confirmation first: the team-demand gate on capturing the quiz's final dark screens — ask once, then default to capture.)
1. **Publish the dark extension into the DS library** (`afi5Q5nFtcnT9HJ04Cbylg`) as additional named variables, not a second mode (code models dark as additive tokens, D-029): Dark Canvas, Dark Surface, on-dark text ramp, glass set, role glow derivatives. Follow the §3.5 lineage discipline the library uses.
2. **Create a new "Interest Quiz" Figma file** in the ARM team, subscribing to the DS library. RC-CC (`yGDi4yDtptKttboTYV8on7`) is dead — don't resuscitate.
3. Port the dashboard's FIGMA_MAP-aware `/capture-figma` into this repo + seed a small per-project FIGMA_MAP (Pass 4 may have done the UX repo's; this is explore_floor's).
4. Capture the final dark screens (results 5-screen set + quiz steps) into the Interest Quiz file.
5. Register the "RC.org Prototype" file key (`k3AjijocJEmzrvlKTd9vJM`, on hand since Pass 3) in the UX repo's FIGMA_MAP as design source, **pull-only**; stand up a separate new file as the UX repo's capture target (Pass-3 ruling: never capture into Kayla's file).
6. Claude Design: reuse the dashboard's `.design-sync` tokens-and-styles pattern for the UX refinement loop, sourced from `@rc/ui`. Do-not-merge rule stands: the "RoboticsCareer.org Design System" project (`8686032d…`) is the live-site recreation — keep the kit vocabulary out of it. The esbuild real-atoms bundle stays the conscious skip.

**Exit gates:** DS library carries the dark variables published; Interest Quiz file holds the captured screens; captures bind to variables, not raw values.

## Stretch — only if the last week is calm

Step-5 consumer conversion (repoint career_dashboard + explore_floor at `@rc/ui`, delete local token authorship — real regression risk, zero client-visible payoff; known deltas: explore_floor's `--text-small--line-height` 22px vs the package's 1.45, its Icon's extra names beyond the packaged 47). The remaining atoms tier (CtaButton, Chip, StatusPill, Ring, Meter, MetaRow, Card/CardHead — the §10 step-0 store-free audit first). The esbuild atoms bundle (default: skip).
