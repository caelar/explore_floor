# Lessons

An **agentic-workflow + design-craft log** — not a generic wiki. What worked when driving this build with Claude Code, where the agent needed steering, and craft learnings worth keeping. This is raw material for the portfolio thesis ("a forward-looking, agentic design practice").

Capture when notable with `/compound lesson`. When a lesson recurs, promote it to a rule in `CLAUDE.md` (by hand).

Format per entry: **L-### — one-line takeaway** · context · what to do.

---

## 2026-07-03

### L-009 — The capture pipeline that ships: human clicks the Figma Chrome extension, the agent does the bind pass
- **Context:** Second session where the MCP `generate_figma_design` HTML capture died (first: expired batch IDs + occlusion throttling, D-039's war story; now: stalled at the submit step even before the mitigations got a fair run). Caelan interrupted and captured all 9 staged states himself with the **official Figma Chrome extension** in minutes — same capture engine, working interface. The output was genuinely good: real text layers in the product fonts (Montserrat/Roboto, Material Icons as ligatures), honest glass alphas (4.3% captured ≈ the 4.5% token), modest layer trees (28–269 nodes/frame). What made them *handoff-grade* was the agent-side integration pass: rename to the FIGMA_MAP §2 naming contract, then a Plugin-API sweep binding every matchable paint to a library variable by a value→variable map with context rules (`#262626` opaque = Near Black per the header's own code; `#FFB81C` = ARM Gold in chrome, Role/Technician in role contexts; white text on an accent ancestor = the `Role/* On` alias). 502 paints bound, 9 raw keeps, zero visual drift.
- **Do:** Split the round-trip by who's good at what: the human clicks capture (the extension is reliable; the MCP submit path is not in this environment), the agent stages app states beforehand and makes the result token-true afterward. Two Plugin-API gotchas from the bind sweep: **alpha-carrying variables** (the glass set) — reset the paint's own `opacity` to 1 when binding, or the variable's alpha multiplies against the captured alpha and the surface nearly vanishes; and **TEXT nodes need their fonts loaded** (`getStyledTextSegments(['fontName'])` → `loadFontAsync`) before reassigning fills. Also: derive the value→variable map from the *code's* token usage (grep the component), not from value equality alone — `#262626` was three different tokens by context.

## 2026-06-30

### L-008 — When the user cites a design reference, read the actual source via the design MCP, not screenshots
- **Context:** Asked to rework the quiz against "the Claude Design reference," I first reasoned from `docs/reference/dark/*.png` and built a mockup from inferred tokens. Those screenshots were the wrong artifact (ARM's live My-Match flow), and even the right ones are lossy. Caelan pointed me at the real source: the Claude Design `Quiz to Results.dc.html` in a claude.ai/design project. Pulling it via the **DesignSync MCP** (`get_project` → `list_files` → `get_file`) gave exact, authoritative values — scenario 17px/`#c4c8cc`, question 34px, choice card 20px/600, "introNum = index+1" — that no screenshot could yield, and confirmed our build already matched the reference (so the fix had to go *beyond* it).
- **Do:** When a reference lives in claude.ai/design (or the user says "the Claude Design mockup/file"), read the actual `.dc.html` through the DesignSync MCP before designing — don't infer tokens from screenshots, and don't assume the screenshots on disk are the right reference. Save a local copy under `docs/reference/` as ground truth (the harness already cites a `.dc.html` that wasn't physically in the repo). Corollary, from the same pass: measure real geometry live before reserving space — a min-height reserve added for wrapping became dead space once the font shrank enough that nothing wrapped (verified all 21 labels were one line, then dropped the reserve).

## 2026-06-08

### L-007 — AnimatePresence `mode="wait"`: the exiting screen's buttons still absorb clicks
- **Context:** The flow runner transitions MC questions with `mode="wait"`; the outgoing question's card lingers (fading) through the ~200ms exit. An opacity fade keeps the buttons hit-testable and their bounding box stable, so a fast click meant for the NEXT question — Playwright, or a quick human double-tap — lands on the EXITING question's button. Its stale handler overwrites that answer and advances past the next step. Invisible until the screener questions started scoring (D-019); then it silently corrupted results (e-q1 "Maybe" became "No"). Reproduced live in the store before fixing — cf. L-004, same `mode="wait"` family.
- **Do:** Lock a single-select step once answered — local `chosen` state → `disabled` on its buttons. The runner keys the card by step id, so the lock resets per question. Disabled buttons aren't actionable, so the click waits for the live next-question button instead of corrupting the old one. General rule: under `mode="wait"`, make the exiting interactive surface inert (disable / `pointer-events-none`); don't assume it's already unmounted.

## 2026-05-30

### L-006 — GSAP DrawSVG: ellipses not circles; register once; scope + matchMedia
- **Context:** First GSAP use in the build (Phase 1 landing reveal). DrawSVG animates `stroke-dasharray/offset`, so targets need a visible stroke — and it supports `rect/line/polyline/polygon/ellipse` but **not `<circle>`**, which silently won't draw.
- **Do:** Use `<ellipse>` for rollers/joints. Register plugins once at app start (`src/lib/gsap.ts`, side-effect imported in `main.tsx`), never in a component. Run every tween inside `useGSAP(..., { scope })` (auto-revert on unmount), and gate the draw with `gsap.matchMedia('(prefers-reduced-motion: no-preference)')` so reduced-motion users see the lines already drawn. Keep GSAP (scene strokes) and Motion (content opacity/transform) on disjoint nodes — verified no crossed engines.

### L-005 — Dynamic Tailwind class names aren't generated; use a static literal map
- **Context:** Archetype accents (`arm-orange`/`arm-blue`/`arm-teal`) needed to vary per role. `` `text-${token}` `` produces a class string Tailwind v4's scanner never sees, so the utility doesn't exist at runtime.
- **Do:** Author a static literal class map keyed by the variant (`src/components/accent.ts`: `ACCENT_CLASSES[archetype].text/border/bg/soft`). Every class appears verbatim in source, so it's generated. For SVG tinting, set the accent as the element's text color and draw with `currentColor` + `fill-bg`.

### L-004 — AnimatePresence `mode="wait"` + a draggable child stalls the swap
- **Context:** The Sort card used `mode="wait"` with a `drag` + `dragSnapToOrigin` card whose exit animated `x`. On a drag-commit the exit `x` fought the snap-back, exit never completed, and `mode="wait"` never mounted the next card — the user saw "no more cards." Reproduced it live before fixing (state was advancing; only the render stalled).
- **Do:** For a draggable item under AnimatePresence, use `mode="popLayout"` (the next item mounts immediately — can't stall), `forwardRef` the child (popLayout measures it via a ref), and keep `x`/drag-owned properties **out** of the exit variant (exit on opacity/scale only). Reproduce render-stall bugs before claiming a fix.

## 2026-05-29

### L-003 — The agent can't self-install external skills; hand the command to the user
- **Context:** `npx skills add greensock/gsap-skills` was blocked by Claude Code's safety classifier (installing external code that steers future sessions = self-modification / untrusted-code integration), even though it was approved in the plan. The user ran it and it succeeded.
- **Do:** For external skill/plugin installs, give the user the exact command (they can prefix `!` to run it in-session) rather than running it as the agent. Project-authored skills (our own `SKILL.md` files) are fine to create directly.

### L-002 — Tune external templates to the project; don't cargo-cult
- **Context:** Adopting the BilLogic "design harness" plugin's structure wholesale would have imported ritual (consent hashing, taxonomies) that doesn't pay off for a single-summer capstone.
- **Do:** Borrow the *frame* and the *schema*, then justify each artifact against this project's actual goals. Cut anything you can't defend. (See `DECISIONS.md` D-007.)

### L-001 — Verify doc-internal invariants by computing them, not trusting them
- **Context:** `DATA_MODEL.md` asserted the Innovator weights summed to 24; they actually sum to 27. The error would have surfaced as a failing Phase 0 sanity test authored from the same table.
- **Do:** When a doc states a total/invariant, recompute it before building against it. Cheap, catches load-bearing errors early. (See `DECISIONS.md` D-001.)
