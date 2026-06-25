# Design System

This doc is the visual source of truth for the build. It pairs with the Figma file **RC-CC — Design System** (`yGDi4yDtptKttboTYV8on7`), which holds the canonical tokens, components, and frames. Where this doc disagrees with the Figma file, the Figma file wins for tokens and component definitions; this doc wins for the rules about how things are used, the bridge to the playful layer, and code-side conventions.

---

## 1. Philosophy

We're modernizing RC.org's existing Material-Design-flavored visual identity into something warmer and more playful for the gamified high-school track, **without rebranding**. The brand colors are exact. The type system is preserved. The spacing, radius, and shadow conventions are honored as a foundation. On top of that foundation we add a Goose-game-adjacent playful layer (illustration style, motion language, micro-personality) that makes the assembly-line experience feel charming rather than corporate.

Three principles:

- **Evolution, not rebrand.** A user who has seen RC.org should recognize this experience as part of the same product. ARM's gold, blue, teal, and orange are preserved verbatim and remain the dominant chromatic signature.
- **Two layers, one product.** A "foundation" layer (forms, layout, navigation, professional surfaces) inherited from RC-CC. A "playful" layer (the assembly line, the robot, the conveyor, the result screen) layered on top. The two layers share tokens but use them differently.
- **The Make.md neons are dead.** Anywhere in earlier brainstorm material that referenced neon teal `#06ffa5`, electric blue `#00d9ff`, or magenta `#ff006e`: ignored. Those colors do not appear anywhere in this build.

## 2. Token alignment with Figma

The Figma file (RC-CC) is the source for tokens. The `@theme` block in `src/styles/globals.css` mirrors those tokens 1:1 (Tailwind v4 is CSS-first — tokens live in `@theme`, not a `tailwind.config.ts`). The token names below are unchanged; the mapping is mechanical:

| Figma path | Tailwind name | Notes |
|---|---|---|
| `color/brand/yellow` | `arm-yellow` | The "ARM gold" |
| `color/brand/yellow-soft` | `arm-yellow-soft` | |
| `color/brand/orange` | `arm-orange` | |
| `color/brand/blue` | `arm-blue` | |
| `color/brand/teal` | `arm-teal` | |
| `color/semantic/page-bg` | `page-bg` | |
| `color/semantic/bg` | `bg` | |
| `color/semantic/bg-soft` | `bg-soft` | |
| `color/semantic/bg-section` | `bg-section` | |
| `color/semantic/text` | `text-default` | |
| `color/semantic/text-strong` | `text-strong` | |
| `color/semantic/text-muted` | `text-muted` | |
| `color/semantic/text-subtle` | `text-subtle` | |
| `color/semantic/text-faint` | `text-faint` | |
| `color/semantic/border` | `border-default` | |
| `color/semantic/overlay` | `overlay` | |
| `color/neutral/near-black` | `near-black` | |
| `color/neutral/black` | `black` | (overrides Tailwind default) |
| `color/neutral/white` | `white` | |
| `space/N` | `space-N` | 0-7 |
| `container/{sm/md/lg/xl/px}` | `container-{sm/md/lg/xl/px}` | |
| `section/py` | `section-py` | |
| `radius/{sm/md/full}` | `rounded-{sm/md/full}` | (overrides defaults) |
| `font/heading` | `font-heading` | Montserrat |
| `font/body` | `font-body` | Roboto |
| `size/{h1..h5,body,small}` | `text-{h1..h5,body,small}` | |
| `lh/{h1..h5,body,small}` | `leading-{h1..h5,body,small}` | |

Variable names align by the mapping above so Figma Variables and Tailwind tokens stay legible to each other and the code-to-canvas round-trip (see `ARCHITECTURE.md` section 7) produces clean captures. Only values Figma Variables can hold are synced (color, type, spacing, radii). Motion is code-only. There is no Code Connect.

## 3. Color

### 3.1 Brand (kit-aligned)

Snapped to the RC UI Kit, matching `career_dashboard` (D-024 here; its D-026). Values are canonical against the kit; the old archetype→accent assignments are retired (see §3.3).

| Token | Hex | Role |
|---|---|---|
| `arm-gold` | `#FFB81C` | Primary brand color, the "ARM gold." Primary CTA fill + brand signature (a fill, not a text color on white). Renamed from `arm-yellow`. |
| `arm-gold-soft` | `#FDC547` | CTA hover tint. |
| `arm-teal` | `#117289` | Secondary Teal — the single interactive voice: links, CTAs, the match indicator. |
| `arm-orange` | `#BF5309` | Secondary Orange — rare attention, AA-safe as text at 4.71:1 (was `#F56A00`, which failed AA at 3.02:1). |
| `arm-blue` | `#38A5EE` | **TEMP.** The program category accent + legacy link voice; fails AA as text (2.7:1). Retired/retoned in the step-8 results-accent redesign. |

### 3.2 Semantic (light mode foundation)

Inherited verbatim from RC-CC. The product is light-mode by default.

| Token | Hex |
|---|---|
| `page-bg` | `#F4F4F4` |
| `bg` | `#FFFFFF` |
| `bg-soft` | `#FAFAFA` |
| `bg-section` | `#F5F5F5` |
| `text-default` | `#262626` (charcoal; kit Neutral Dark — was navy-slate `#2D3A4A`) |
| `text-strong` | `#000000DE` (87% black) |
| `text-muted` | `#00000099` (60% black) |
| `text-subtle` | `#595959` |
| `text-faint` | `#757575` |
| `border-default` | `#E0E0E0` (kit Neutral Border; opaque — was 12% black, visually ~same on white) |
| `overlay` | `#262626F2` |
| `near-black` | `#262626` |

### 3.3 Archetype accents

> **Retired (kit-alignment, D-024).** The three-archetype→accent model below describes the abandoned classic experience. The live flows score four RC.org categories, and their accents (`categoryAccent.ts`) are being reconciled with the kit's restrained teal-led palette in the step-8 results redesign. Kept for the classic record until the Phase-2 spec sweep; see `docs/knowledge/REALIGNMENT.md`.

The three role archetypes are tied to brand colors. **Never invent a new color for an archetype.** This is what keeps the playful layer feeling like RC.org and not like a different product.

| Archetype | Role | Accent token |
|---|---|---|
| Builder | Robotics Technician | `arm-orange` `#F56A00` |
| Innovator | Robotics Specialist | `arm-blue` `#38A5EE` |
| Architect | Robotics Integrator | `arm-teal` `#117289` |

The accent shows up in:

- The role card border and primary action button.
- A subtle tint behind the robot when it's on a given pedestal.
- The match percentage indicator color.
- The robot color scheme (selected based on dominant archetype after scoring; see `DATA_MODEL.md` section 7).

`arm-yellow` is reserved for global product signature (the "this is RC.org" yellow) and is not used for any archetype.

### 3.4 Playful layer palette additions

For the assembly-line scene specifically, we add a few muted, warm fills that work with the Goose-game aesthetic. These are scene-specific and live under a `scene/` token namespace so they don't bleed into the foundation surfaces.

| Token | Hex (proposed) | Role |
|---|---|---|
| `scene-paper` | `#F5EFE3` | Soft cream background for the conveyor scene. Less clinical than `page-bg`. |
| `scene-paper-warm` | `#EFE4CE` | Slightly warmer tone for layering. |
| `scene-line` | `#2D3A4A` | Same as `text-default`. The Goose-style line color for SVG outlines. |
| `scene-line-soft` | `#5C6975` | Lighter outline for de-emphasized scene parts. |
| `scene-shadow` | `#2D3A4A1A` | 10% slate for soft ground shadows. |

These are starter values. Refine in Figma's `scene/` collection once we begin Phase 2. Adjust here in tandem.

## 4. Typography

### 4.1 Type pairing (locked)

- **Headings:** Montserrat. Bold for all H1–H5 by default.
- **Body:** Roboto. Regular / Medium / Bold available.
- **Icon font:** Material Icons.

### 4.2 Type scale

From the Figma `Typography` collection, verbatim:

| Style | Font | Weight | Size | Line height |
|---|---|---|---|---|
| `Heading/H1` | Montserrat | Bold | 56 | 64 |
| `Heading/H2` | Montserrat | Bold | 40 | 48 |
| `Heading/H3` | Montserrat | Bold | 32 | 38 |
| `Heading/H4` | Montserrat | Bold | 24 | 32 |
| `Heading/H5` | Montserrat | Bold | 20 | 28 |
| `Body/Default` | Roboto | Regular | 16 | 22 |
| `Body/Strong` | Roboto | Bold | 16 | 22 |
| `Body/Medium` | Roboto | Medium | 16 | 22 |
| `Label/Small` | Roboto | Regular | 14 | 22 |
| `Label/Small-Medium` | Roboto | Medium | 14 | 22 |
| `Label/Overline` | Roboto | Medium | 14 | 22, 1px tracking, UPPERCASE |
| `Display/Quote-Mark` | Montserrat | Regular | 96 | 96 |
| `Display/Quote` | Montserrat | Bold | 24 | 34 |
| `Display/Event-Day` | Montserrat | Bold | 32 | 38 |

### 4.3 Tailwind class names

```ts
fontFamily: {
  heading: ['Montserrat', 'system-ui', 'sans-serif'],
  body: ['Roboto', 'system-ui', 'sans-serif'],
}
fontSize: {
  h1:   ['56px', { lineHeight: '64px', fontWeight: '700' }],
  h2:   ['40px', { lineHeight: '48px', fontWeight: '700' }],
  h3:   ['32px', { lineHeight: '38px', fontWeight: '700' }],
  h4:   ['24px', { lineHeight: '32px', fontWeight: '700' }],
  h5:   ['20px', { lineHeight: '28px', fontWeight: '700' }],
  body: ['16px', { lineHeight: '22px' }],
  small: ['14px', { lineHeight: '22px' }],
}
```

### 4.4 Usage

- Hero / landing headline: H1.
- Screen titles: H2.
- Section titles: H3 or H4.
- Role card titles on results: H4.
- Interest card label: Body/Medium (the kid reads it easily, doesn't shout).
- Match percentage on results: H2 in archetype accent color.
- Overlines (`Label/Overline`) for round indicators ("ROUND 2 OF 4").

### 4.5 Playful layer additions

For occasional character (the landing CTA, the robot reveal moment, friendly result framing), we leave room for a single playful display font added later. Candidates: a slightly-irregular geometric like **Recoleta** or **Fraunces**, used at small scale for accent words only. Treat this as a Phase 3 polish, not a Phase 0 dependency. The build works fully with just Montserrat + Roboto.

## 5. Spacing

Inherited verbatim. The 0-indexed scale where `space/0 = 4px` is deliberate; it gives a meaningful "tight but visible" gap rather than zero.

| Token | Value (px) |
|---|---|
| `space-0` | 4 |
| `space-1` | 8 |
| `space-2` | 12 |
| `space-3` | 16 |
| `space-4` | 24 |
| `space-5` | 32 |
| `space-6` | 48 |
| `space-7` | 64 |

### Container widths

| Token | Value |
|---|---|
| `container-sm` | 564 |
| `container-md` | 912 |
| `container-lg` | 1248 |
| `container-xl` | 1500 |
| `container-px` | 16 (horizontal padding) |
| `section-py` | 48 (vertical section padding) |

The experience targets desktop primarily. Use `container-lg` (1248) as the typical layout max-width. The sort screen, with its conveyor scene, uses `container-xl` (1500) so the scene has room to breathe.

## 6. Radius

| Token | Value (px) | Use |
|---|---|---|
| `rounded-sm` | 4 | Inputs, small chips, secondary surfaces |
| `rounded-md` | 8 | Cards, buttons, primary surfaces |
| `rounded-full` | 9999 | Pills, badges, the avatar pedestal |

Minimal by design. Don't add new radius values.

## 7. Shadow / elevation

The Figma file defines two effect styles. Both are triple-shadow stacks following Material Design elevation conventions.

| Token | Composition | Use |
|---|---|---|
| `shadow-card` | Elev-3 stack (radius 1+1+3, offsets 2/1/1, alphas .20/.14/.12) | Default card lift |
| `shadow-elev-2` | Elev-5 stack (radius 1+2+5, offsets 3/2/1, alphas .20/.14/.12) | Hover, raised dialogs, the result pedestal |

Use sparingly. The playful layer should rely more on warm fills, soft outlines, and motion than on shadows.

## 8. Motion

Motion tokens live in code, not in Figma. Figma Variables can't model easing curves or springs, so these are defined once in `/src/lib/motion.ts`. The easing curves are mirrored into the `@theme` block in `src/styles/globals.css` as `ease-soft` / `ease-snap` utilities; durations stay in code only (Tailwind v4 has no first-class duration token namespace). Both animation engines (Motion and GSAP) read these same values so the feel is consistent across the two. See `ARCHITECTURE.md` section 1.

| Token | Value | Use |
|---|---|---|
| `duration-instant` | 100ms | Hover state changes, taps |
| `duration-snap` | 200ms | The robotic-arm snap, item dropping into a bin |
| `duration-glide` | 400ms | Conveyor item travel, card transitions |
| `duration-pour` | 700ms | Robot part assembly animations |
| `duration-reveal` | 1000ms | Build-moment reveal, result entrance |

Easing curves (also new):

| Token | Curve | Use |
|---|---|---|
| `ease-soft` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Most UI |
| `ease-snap` | `cubic-bezier(0.5, 0, 0.1, 1.5)` | Arm snapping, robot part settling (slight overshoot) |
| `ease-physical` | spring `{ stiffness: 200, damping: 20 }` | Motion physical springs for UI; GSAP scene uses its own eases/`ease-snap`. |

### Motion principles

- Nothing instant unless it's a tap. Even fast things get 100ms.
- Use spring physics for the conveyor scene; tween for UI cards.
- Respect `prefers-reduced-motion`. Motion-sensitive users get fast crossfades instead of physical motion.

## 9. Iconography

- Use **Material Icons** as defined in the Figma file (the `font/icon` token).
- Component set in Figma: `Icon/Material` with size variants 16/18/24/32/40/56/72.
- For the playful layer, the assembly-line scene uses bespoke SVG illustrations, not Material Icons. The two are kept distinct: Material Icons in UI chrome, custom SVG in the scene.

## 10. The playful layer

This is what makes the experience feel different from a typical RC.org screen.

### 10.1 Aesthetic anchor

Untitled Goose Game. Specifically:

- Confident, slightly imperfect outlines. Not super tight vector. Stroke widths around 1.5–2.5px on a 1500px canvas. Slight stroke variation gives "drawn" quality.
- Warm, muted fills. The `scene-paper` background, soft mid-tones, the brand accents at slightly desaturated tints when they appear in the scene.
- Negative space is used. Backgrounds aren't decorated to death.
- Characters and objects have a small "weight" to them via subtle ground shadows (`scene-shadow`) rather than hard outlines pinning them to a grid.

### 10.2 What the playful layer is NOT

- Not childish. The user is 16-18, not 9. Avoid cartoon overload, no smiley faces on robots unless asked.
- Not video-game-y in the saturated-neon sense. The Make.md neons stay dead.
- Not corporate. The foundation handles that; the scene leans warm.

### 10.3 Specific applications

- **Landing scene**: a partial view of the assembly-line scene visible behind the CTA card. Stylized and soft, with a gentle entrance reveal (GSAP `DrawSVG` linework drawing itself in) introduced in Phase 1 as an early, low-risk test of the scene-animation approach. Hints at what's coming.
- **Conveyor scene**: the central artifact. Goose-style line + fill, slight motion as ambient state (small ambient idle on the arm, the conveyor surface texture not moving fast enough to be distracting). Spatial model (in 2D, per `DECISIONS.md` D-014): the belt runs across the middle carrying interest-labeled parts; **two bins sit in front of it (downscreen)** — "That's me" / "Not my thing"; the **robot stands behind/above the belt**; a robot arm reaches from the keep bin up to the robot to assemble each kept part (a second arm or a trash chute clears the pass bin).
- **Robot**: stylized, friendly without being twee. Limbs and parts have visible "joints" (small circles), pieces look attached rather than seamlessly merged. The robot reads as built, not 3D-rendered. It is assembled by the arm lifting kept parts from the "That's me" bin, so each part visibly *arrives* rather than fading in.
- **Results pedestal**: a soft circular plinth, slight shadow, the robot standing on it. The role cards behind it have the same warm fill quality.

## 11. Component categories

The Figma file organizes components into Foundation and Composite categories:

**Foundation:**
- Icons (Material set, size variants 16-72)
- Buttons (Primary, Stroked, Text, Icon, Nav-Link) each with state/size variants
- Links (Text, Chevron) with state/context variants
- Disclosure & Tabs (Accordion, Tab/Item)
- Media & Interactive
- Cards
- Forms
- Layout

**Composite:**
- Banners
- Header
- Footer
- Dialog

For this build, we reach into the foundation for buttons, links, cards, forms, layout. We do **not** use the existing Header/Footer/Banner composites because the experience is intentionally chromeless (no site header on the gamified flow) but the build does need basic interactive elements that match RC-CC's existing patterns.

### Variant conventions

Figma components use property names like `State`, `Size`, `Context`, `Style`. These map cleanly to React prop names:

```tsx
// Button/Primary: State=default|hover, Size=md|lg
<Button.Primary state="default" size="md" />

// Link/Chevron: State=default|hover, Style=default|inline
<LinkChevron state="default" style="default" />
```

Figma variant names map to React prop values by the same convention (`Primary` to `variant="primary"`). Keep them aligned by hand; there's no Code Connect enforcing it.

## 12. Component additions for this build

Components specific to this experience, to be created in both Figma and code. Each is named identically in both tools, by convention, so the code-to-canvas round-trip stays legible.

- `ConveyorBelt` — the moving surface
- `ConveyorItem` — the cards that come down the belt
- `RoboticArm` — the user-controlled sorter
- `SortBin` — "That's me" and "Not my thing" targets
- `Robot` — the avatar being built (composes RobotParts)
- `RobotPart` — modular parts (Wrench arm, Chip pin, Clipboard, etc.; see `DATA_MODEL.md` section 7)
- `RoleCard` — the role recommendation cards on results (variants: `Primary`, `Ghosted`)
- `Pedestal` — the avatar display on results
- `ProgramList` — the "programs that get you there" list
- `MatchIndicator` — the percentage score per archetype
- `RoundIndicator` — "ROUND 2 OF 4" label
- `SoundToggle` — the audio on/off control

Define these in Figma's `——— Components ———` section as new pages or grouped under a new `Quiz Experience` category page, named to match the React components.

## 13. Bridging the two layers

The tension between the foundation layer (Material-Design-flavored web product) and the playful layer (Goose-game-adjacent illustrated scene) is real. The rules that keep it coherent:

- **Type stays the same across both layers.** Montserrat headings, Roboto body. Always.
- **Brand color usage stays consistent.** Yellow is the brand signature; orange/blue/teal are archetype-coded. No new colors.
- **Foundation surfaces use Material conventions** (white cards on light-gray bg, 8px radius, elev-3 shadows).
- **Scene surfaces use playful conventions** (paper cream background, soft strokes, custom illustration, ground shadows).
- **Transitions between layers are explicit, not blurred.** The landing screen has both, with the scene clearly behind/around the UI card. The sort screen is almost entirely the scene with foundation buttons sitting on top. The results screen is mostly foundation with the robot pedestal as the one scene element. Each screen knows which layer it belongs to.

## 14. What is explicitly out of scope

- Dark mode. The product is light-mode only. The Figma file has a single mode per collection; do not add dark variants.
- New brand colors. The four ARM brand colors and the semantic/neutral set are complete.
- New typefaces. Montserrat + Roboto are it for now. The Phase 3 display-font addition is optional and small-scoped.
- A third animation paradigm. The model is two engines, defined in `ARCHITECTURE.md` section 1: Motion for state-driven UI, GSAP (free, with MorphSVG/DrawSVG/MotionPath) for scene choreography and the cinematic moments. No anime.js (overlaps GSAP) and no Lottie (passive, can't drive the interactive robot). Rive is a documented future exploration for the robot only, not part of this build.
- Glassmorphism. Earlier brainstorm material mentioned this. We're not doing it. It fights both the Material foundation and the Goose-game playful layer.

## 15. Source-of-truth precedence

When the team disagrees on a token or component:

1. Figma file is the source for values (colors, sizes, spacing, type, components themselves).
2. This doc is the source for usage rules (which token in which context, which archetype gets which accent, what the playful layer is and isn't).
3. Code is the source for behavior (interaction, state, animation specifics).

If a conflict appears between Figma and this doc on a value, fix the doc; on a usage rule, fix the Figma. They should always agree.
