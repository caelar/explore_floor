---
rubric: design-system-compliance
name: Design System Compliance
applies_to: [tsx, css]
version: 3
severity_defaults:
  default: p2
source:
  - docs/DESIGN_SYSTEM.md
  - docs/ARCHITECTURE.md §1, §11
  - "RC UI Kit (kit-aligned tokens, DECISIONS D-024)"
  - "src/components/categoryAccent.ts (the ROLE_ACCENT mapping)"
  - "docs/knowledge/archive/VISUAL_REARCHITECTURE.md + DECISIONS D-029 (the dark system, step 8)"
sections:
  tokens:
    order: 1
    title: Tokens, not literals
    criteria:
      - id: no-inline-hex
        severity: p1
        check: Color values come from Tailwind tokens, never inline hex
      - id: no-magic-px
        severity: p2
        check: Spacing, radius, and size values use scale tokens, not arbitrary pixels
      - id: motion-from-tokens
        severity: p2
        check: Durations and easings read from the motion tokens, not literals
  color:
    order: 2
    title: Color usage
    criteria:
      - id: role-accent-mapping
        severity: p1
        check: Role accents come from categoryAccent.ts ROLE_ACCENT (technician→arm-gold, specialist→arm-teal, integrator→arm-orange), never an invented per-screen hex; arm-blue is retired (D-029)
      - id: gold-reserved
        severity: p2
        check: arm-gold is the brand signature / primary CTA fill and the universal quiz hover/selected state; on results it is Technician's accent (watch that "gold = my pick" in the quiz doesn't read as "gold = Technician")
      - id: no-neon
        severity: p1
        check: No Make.md neon colors (06ffa5, 00d9ff, ff006e) appear anywhere
      - id: dark-on-system
        severity: p2
        check: The quiz/results render dark-only on the D-029 tokens (dark-canvas/-surface/-panel, text-on-dark ramp, glass-* + blur, role-*); no light-mode surfaces or off-token greys leak in, and dark text pairings hit AA
  type:
    order: 3
    title: Typography
    criteria:
      - id: families
        severity: p1
        check: Headings use Montserrat and body uses Roboto, no other families
      - id: scale
        severity: p2
        check: Text sizes come from the type scale (h1-h5, body, small)
      - id: role-usage
        severity: p3
        check: Type roles match usage (H1 hero, H2 screen/role-name title, large match %); on the dark results cards the role name and match % are neutral on-dark and the role accent lives in the active signal bar (D-029, faithful to the mockup), not an accent-colored number
  space:
    order: 4
    title: Spacing & layout
    criteria:
      - id: space-scale
        severity: p2
        check: Gaps and padding use the space-0..7 scale
      - id: containers
        severity: p3
        check: Layout width uses a container token (lg default, xl for the sort scene)
  surface:
    order: 5
    title: Radius & elevation
    criteria:
      - id: radius-set
        severity: p2
        check: Radii are only rounded-sm, rounded-md, rounded-lg, or rounded-full
      - id: shadow-sparingly
        severity: p3
        check: Shadows use shadow-card or shadow-elev-2 and are used sparingly
  layering:
    order: 6
    title: Surface discipline
    criteria:
      - id: no-scene-tokens
        severity: p3
        check: No surface reintroduces the removed scene/* tokens (deleted with LandingSceneHint in Phase A)
      - id: glass-from-tokens
        severity: p2
        check: Frosted-glass surfaces use the sanctioned glass-* fill/border + blur-bar/-panel tokens (D-029), not ad-hoc rgba() or arbitrary backdrop-blur values
  motion:
    order: 7
    title: Motion (folded from the retired motion-quality rubric)
    criteria:
      - id: reduced-motion
        severity: p1
        check: prefers-reduced-motion is respected (fast crossfades replace physical motion)
      - id: no-crossed-engines
        severity: p1
        check: Motion and GSAP never animate the same property on the same node
      - id: gsap-cleanup
        severity: p2
        check: Any GSAP animation (none live as of Phase A; lib/gsap.ts is a registered seam) runs inside useGSAP with a scope ref (auto-reverts on unmount)
      - id: motion-owns-state
        severity: p3
        check: React-state/gesture motion uses Motion; GSAP has zero live consumers (the Landing DrawSVG reveal was removed in Phase A)
---

Checks whether UI honors the kit-aligned, RC.org-derived design system: brand-exact color, the three-role accents, the preserved type system, the spacing/radius/shadow foundation, and motion discipline. This rubric governs *system conformance* and now also covers motion (folded in from the retired `motion-quality.md`). The visual quality of the high-fidelity results screen is judged by `results-screen.md`. _(The `goose-game-aesthetic.md` scene rubric was retired with the conveyor vision, D-026.)_

## Scope & Grounding

**Personas**
- *Riley (16-18), late-HS training-seeker* — the primary user. Should feel this is a fresh, friendly experience that's still recognizably part of RC.org.
- *Parent over the shoulder* — glances for 30 seconds; the look must read as a real, trustworthy ARM product, not a toy.
- *ARM client reviewer* — checks that brand identity is respected exactly (this is an "evolution, not rebrand").

**Realistic scenarios**
- A node on the narrative results map uses its category's accent (from `categoryAccent.ts`) for the match indicator.
- The fit radar's axes and the node ring read their category accent token, not a hardcoded hex.

**Anti-scenarios (should fail)**
- A component hardcodes a role hex (e.g. `#117289`) instead of the `categoryAccent.ts` token, or invents a per-screen category color.
- A category is themed with a brand-new color outside `categoryAccent.ts`, or retired `arm-blue` resurfaces.
- A neon from the dead Make.md palette resurfaces anywhere.
- A glass surface uses an ad-hoc `rgba()` / arbitrary `backdrop-blur-[…]` instead of the sanctioned `glass-*` + `blur-bar/-panel` tokens.
- A light-mode surface (white card, light page bg) leaks into the dark quiz/results.
- A physical motion sequence plays regardless of `prefers-reduced-motion`.

## 1. Tokens, not literals
Every reused or semantically named value lives in the `@theme` block in `src/styles/globals.css` (color/type/space/radius) or `/src/lib/motion.ts` (durations/easings). Inline hex and magic pixels are the single most common drift and break the Figma↔code token alignment. **Pass:** `className="text-arm-orange p-space-4 rounded-md"`. **Fail:** `style={{ color: '#F56A00', padding: '23px' }}`.

## 2. Color usage
The kit brand colors are exact and non-negotiable. The three roles are color-coded in one place, `categoryAccent.ts` (`ROLE_ACCENT`): **technician→`arm-gold`, specialist→`arm-teal`, integrator→`arm-orange`** (D-029; `arm-blue` is retired). Each role exposes `accent` / `accentSoft` (legible large role names on dark) / `onAccent` / `glow`. A screen reads the token, never a hardcoded hex. `arm-gold` is the global brand signature, the primary CTA fill, and the universal hover/selected state in the quiz; on results it doubles as Technician's accent — watch that the quiz's "gold = my pick" doesn't get read as "gold = Technician." The Make.md neons are dead. **The quiz and results render dark-only** on the D-029 tokens (the light tokens stay defined but unused; no theme toggle). **Fail:** inventing a per-screen role color, hardcoding a role hex instead of the `ROLE_ACCENT` token, or leaking a light-mode surface into the dark flow. _(The four study categories `operate/repair/program/plan` and the classic Builder/Innovator/Architect archetype accents are the documented cut; D-028 collapsed accents to the three roles.)_

## 3. Typography
Montserrat for headings, Roboto for body, always. Sizes come from the scale (H1 56/64 … body 16/22, small 14/22). On the dark results cards the role name (H2) and the match % are **neutral on-dark** and the role accent lives in the active signal bar (D-029, faithful to the mockup), not an accent-colored number. **Fail:** a display font swapped in ad hoc, or a hand-set `font-size: 19px`.

## 4. Spacing & layout
Use the `space-0..7` scale (4 → 64px) and container tokens (`container-lg` 1248 default; `container-xl` 1500 for the sort scene). **Fail:** `gap: 18px`.

## 5. Radius & elevation
Only `rounded-sm` (6), `rounded-md` (8), `rounded-lg` (16 — dark quiz/result cards, D-029 Phase B), `rounded-full`. Two shadow styles (`shadow-card`, `shadow-elev-2`), used sparingly — the playful layer leans on warm fills and soft outlines, not shadow stacks.

## 6. Surface discipline
The dark system (D-029) builds elevation as **canvas (`dark-canvas`) < surface (`dark-surface`) < panel (`dark-panel`)** plus frosted **glass** layers. Glass surfaces are sanctioned and tokenized: `glass-fill` / `glass-fill-strong` / `glass-border` / `glass-border-soft` / `glass-panel` for fills+hairlines, `blur-bar` (8px sticky bars) and `blur-panel` (14px map/result cards) for the blur. Use those tokens, never ad-hoc `rgba()` or arbitrary `backdrop-blur-[…]`. The removed `scene/*` tokens (deleted with `LandingSceneHint` in Phase A) must not reappear. The two-layer foundation-vs-playful-scene model is the documented cut. Shadows: the two dark tiers (`shadow-dark-panel`, `shadow-dark-card`) on dark surfaces, used sparingly.

## 7. Motion (folded from the retired motion-quality rubric)
Durations (`instant`/`snap`/`glide`/`pour`/`reveal`) and easings (`ease-soft`/`ease-snap`) live in `/src/lib/motion.ts` and are read by both engines. The hard rule survives: **a given element + property is owned by exactly one library at a time.** Motion owns all live motion — flow-step transitions, the choice-card slide, the node-map compare swap. GSAP has **zero live consumers** as of Phase A (the Landing `DrawSVG` reveal was removed when the Landing went type-led dark); `lib/gsap.ts` still registers `DrawSVGPlugin` + `useGSAP` at app start as a future seam, so any GSAP that returns must run inside `useGSAP` with a scope ref (auto-reverts on unmount). `prefers-reduced-motion` is respected globally (a p1): physical slides collapse to fast crossfades, themselves token-timed. **Fail:** a hard-coded `duration: 0.35`, a bare `gsap.to(selector)` in a component, both engines writing `transform` on one node, or a physical sequence that ignores reduced-motion.

## Application
Run via `/design-review`, which screenshots the running screen and inspects the JSX/Tailwind (and, for motion, observes it live and toggles reduced-motion). Report p1s as blocking, p2s as should-fix, p3s as polish. Cite the offending file:line and the correct token.

## Cross-references
`results-screen.md` (the high-fidelity results quality bar), `.claude/skills/scene-motion` (the live motion ownership discipline), `CLAUDE.md` (tokens-not-literals rule), `DATA_MODEL.md` §17 (the three-role model + `categoryAccent.ts`).
