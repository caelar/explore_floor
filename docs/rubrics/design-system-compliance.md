---
rubric: design-system-compliance
name: Design System Compliance
applies_to: [tsx, css]
version: 2
severity_defaults:
  default: p2
source:
  - docs/DESIGN_SYSTEM.md
  - docs/ARCHITECTURE.md §1, §11
  - "RC UI Kit (kit-aligned tokens, DECISIONS D-024)"
  - "src/components/categoryAccent.ts (the category accent mapping)"
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
      - id: category-accent-mapping
        severity: p1
        check: Category accents come from categoryAccent.ts (operate→arm-gold, repair→arm-orange, program→arm-blue, plan→arm-teal), never an invented per-screen hex
      - id: gold-reserved
        severity: p2
        check: arm-gold is the brand signature / primary CTA fill (operate's text-arm-gold accent is the interim step-8 exception)
      - id: no-neon
        severity: p1
        check: No Make.md neon colors (06ffa5, 00d9ff, ff006e) appear anywhere
      - id: light-mode-only
        severity: p2
        check: No dark-mode variants or dark backgrounds are introduced
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
        check: Type roles match usage (H1 hero, H2 screen title, match % as H2 in accent)
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
        check: Radii are only rounded-sm, rounded-md, or rounded-full
      - id: shadow-sparingly
        severity: p3
        check: Shadows use shadow-card or shadow-elev-2 and are used sparingly
  layering:
    order: 6
    title: Surface discipline
    criteria:
      - id: no-new-scene-tokens
        severity: p3
        check: No NEW surface introduces scene/* token usage (only the legacy LandingSceneHint hero reads them, grandfathered until the step-8 redesign)
      - id: no-glassmorphism
        severity: p2
        check: No glassmorphism / frosted-glass effects are used
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
        check: Every GSAP animation runs inside useGSAP with a scope ref (auto-reverts on unmount)
      - id: motion-owns-state
        severity: p3
        check: React-state/gesture motion uses Motion; the one GSAP use is the Landing reveal
---

Checks whether UI honors the kit-aligned, RC.org-derived design system: brand-exact color, the four-category accents, the preserved type system, the spacing/radius/shadow foundation, and motion discipline. This rubric governs *system conformance* and now also covers motion (folded in from the retired `motion-quality.md`). The visual quality of the high-fidelity results screen is judged by `results-screen.md`. _(The `goose-game-aesthetic.md` scene rubric was retired with the conveyor vision, D-026.)_

## Scope & Grounding

**Personas**
- *Riley (16-18), late-HS training-seeker* — the primary user. Should feel this is a fresh, friendly experience that's still recognizably part of RC.org.
- *Parent over the shoulder* — glances for 30 seconds; the look must read as a real, trustworthy ARM product, not a toy.
- *ARM client reviewer* — checks that brand identity is respected exactly (this is an "evolution, not rebrand").

**Realistic scenarios**
- A node on the narrative results map uses its category's accent (from `categoryAccent.ts`) for the match indicator.
- The fit radar's axes and the node ring read their category accent token, not a hardcoded hex.

**Anti-scenarios (should fail)**
- A component hardcodes `#38A5EE` instead of `text-arm-blue`, or invents a per-screen category color.
- A category is themed with a brand-new color outside `categoryAccent.ts`.
- A neon from the dead Make.md palette resurfaces anywhere.
- A "cool" frosted-glass card appears on Results.
- A physical motion sequence plays regardless of `prefers-reduced-motion`.

## 1. Tokens, not literals
Every reused or semantically named value lives in the `@theme` block in `src/styles/globals.css` (color/type/space/radius) or `/src/lib/motion.ts` (durations/easings). Inline hex and magic pixels are the single most common drift and break the Figma↔code token alignment. **Pass:** `className="text-arm-orange p-space-4 rounded-md"`. **Fail:** `style={{ color: '#F56A00', padding: '23px' }}`.

## 2. Color usage
The kit brand colors are exact and non-negotiable. The four categories are color-coded in one place, `categoryAccent.ts`: **operate→`arm-gold`, repair→`arm-orange`, program→`arm-blue`, plan→`arm-teal`**. A screen reads the token, never a hardcoded hex. `arm-gold` is the global brand signature and the primary CTA fill (operate's `text-arm-gold` accent is the interim step-8 exception). The Make.md neons are dead. Product is light-mode only. **Fail:** inventing a per-screen category color, or hardcoding `#38A5EE` instead of the `categoryAccent.ts` token. _(The classic Builder/Innovator/Architect archetype accents are the documented cut.)_

## 3. Typography
Montserrat for headings, Roboto for body, always. Sizes come from the scale (H1 56/64 … body 16/22, small 14/22). Match percentage renders as H2 in the category accent. **Fail:** a display font swapped in ad hoc, or a hand-set `font-size: 19px`.

## 4. Spacing & layout
Use the `space-0..7` scale (4 → 64px) and container tokens (`container-lg` 1248 default; `container-xl` 1500 for the sort scene). **Fail:** `gap: 18px`.

## 5. Radius & elevation
Only `rounded-sm` (4), `rounded-md` (8), `rounded-full`. Two shadow styles (`shadow-card`, `shadow-elev-2`), used sparingly — the playful layer leans on warm fills and soft outlines, not shadow stacks.

## 6. Surface discipline
Surfaces use the kit conventions (white cards on light surface, kit radii, the two soft shadow tiers, used sparingly). The two-layer (foundation vs playful-scene) model is the documented cut: the scene was never built, so no *new* surface should introduce `scene/*` tokens (only the legacy `LandingSceneHint` hero still reads them, grandfathered until the step-8 redesign). No glassmorphism.

## 7. Motion (folded from the retired motion-quality rubric)
Durations (`instant`/`snap`/`glide`/`pour`/`reveal`) and easings (`ease-soft`/`ease-snap`/`ease-physical`) live in `/src/lib/motion.ts` and are read by both engines. The hard rule survives: **a given element + property is owned by exactly one library at a time.** Motion owns React-state/gesture/lifecycle motion (flow-step transitions, the bucket-sort drag, the node-map compare swap); GSAP owns the single Landing `DrawSVG` reveal, inside `useGSAP` with a scope ref (auto-reverts on unmount). `prefers-reduced-motion` is respected globally (a p1). **Fail:** a hard-coded `duration: 0.35`, a bare `gsap.to(selector)` in a component, both engines writing `transform` on one node, or a physical sequence that ignores reduced-motion.

## Application
Run via `/design-review`, which screenshots the running screen and inspects the JSX/Tailwind (and, for motion, observes it live and toggles reduced-motion). Report p1s as blocking, p2s as should-fix, p3s as polish. Cite the offending file:line and the correct token.

## Cross-references
`results-screen.md` (the high-fidelity results quality bar), `.claude/skills/scene-motion` (the live motion ownership discipline), `CLAUDE.md` (tokens-not-literals rule), `DATA_MODEL.md` §17 (the four-category model + `categoryAccent.ts`).
