---
name: scene-motion
description: Use when authoring or editing animation — the flow-step transitions, the click-to-rate bucket-sort micro-interactions, the dark results screens' idle/ambient loops + the career map's camera/panel/orb beats + compare layout, or screen transitions. Encodes the hard Motion-vs-GSAP ownership boundary, the useGSAP discipline, and the shared motion tokens so the two engines never fight. Trigger on tasks touching GSAP, Motion (motion/react), AnimatePresence, layout animations, variants, timelines, or DrawSVG.
---

# Motion authoring

Authoritative specs: `ARCHITECTURE.md` §1 (the two-engine model), `DESIGN_SYSTEM.md` §8 (motion tokens), and the motion section of `docs/rubrics/design-system-compliance.md`. This skill is the discipline that keeps the two animation engines from colliding. Pair it with the installed GSAP and Motion agent skills for library API correctness; **this** file is the source of truth for *our* conventions.

> **Scope note (realignment + step 8 + the career-map merge).** The conveyor scene, robotic arm, live-building robot, and cinematic build beat this skill was originally written for are the **documented cut** (never built). All live motion is **Motion (`motion/react`)**; **GSAP has zero live uses today** (it registers at app start as a dormant seam — see below). The live motion: the Landing reveal, the flow step-to-step transitions (direction-aware) + the scene visuals (backgrounds, character, thought bubbles), the click-to-rate card/row micro-interactions, and the dark results screens' ambient "breathe" loops + the **career map** (camera glides, orb/label reveals, the floating context panel's crossfades) + compare layout. The ownership rule and `useGSAP` discipline below still govern if scene motion ever returns.

## The one hard rule
**A given element + property is owned by exactly one library at a time.** Motion runs through React's render cycle / WAAPI; GSAP writes straight to the DOM/SVG and bypasses React. They only break when both grab the same transform on the same node. Don't. (Moot today — GSAP animates nothing — but the rule stands for any revival.)

## Ownership map
- **Motion (`motion/react`, formerly framer-motion)** owns everything live: screen + flow-step transitions (`AnimatePresence`, **direction-aware** via a `custom` prop so Back slides opposite to Forward — see `FlowRunner`), card enter/exit, the intro-choice stagger (`MCQuestion`), the **click-to-rate** buckets (`BucketSort` — tap/Enter, **not** drag), hover/tap micro-interactions, the results **career map** (the camera as motion-values, orb/label reveals, the context panel's body crossfades) + **compare** entrance + `layout` + the ambient idle loops, and the global `prefers-reduced-motion` gate. Pattern: declarative `motion.div` / `motion.svg` with variants.
- **GSAP** — **dormant.** `lib/gsap.ts` registers `useGSAP` + `DrawSVGPlugin` once at app start, but nothing consumes them: the Landing `DrawSVG` reveal (GSAP's last live use) was removed at step-8 Phase A. _(Documented cut: the conveyor/arm/part-to-robot timelines, the build beat, `MorphSVG`, and `MotionPath` were the scene work GSAP was chosen for — never built, never registered.)_

Per-screen (live): **Landing** — Motion hero reveal + CTA. **Flow** — Motion owns the direction-aware step transitions, the scene visuals (background/character/thought-bubble entrances), the click-rating card/row micro-interactions, and the intro-choice stagger. **Results** — Motion owns the role-cards reflow, the career map (camera glides via motion-values, orb dim/brighten, the panel crossfades, the ambient orbs), and the compare swap.

## GSAP discipline (non-negotiable, for any revival)
- Every GSAP animation runs inside the **`useGSAP`** hook (`@gsap/react`) with a **scope ref**, so it auto-cleans on unmount via `gsap.context().revert()`.
- **Never** a bare `gsap.to(selector)` in a component.
- Register plugins **once** at app start (`lib/gsap.ts`). Today that's `gsap.registerPlugin(useGSAP, DrawSVGPlugin)`; add any new plugin there (not in a component) if scene motion returns.

## Tokens — one motion language across both engines (`DESIGN_SYSTEM.md` §8)
Durations live in `/src/lib/motion.ts` (Tailwind v4 has no duration-token namespace); easings are mirrored into `globals.css @theme` as `ease-soft` / `ease-snap` utilities.
- durations: `instant` 100 · `snap` 200 · `glide` 400 · `pour` 700 · `reveal` 1000 (ms)
- `breathe` (seconds): the multi-second idle-loop bases for the results ambient orbs — `orb` 18 · `orbPulse` 23 (each consumer adds its own per-index increment + stagger; the bubble/node/sparkle bases went with their subjects at the career-map merge).
- easings: `ease-soft` (most UI) · `ease-snap` (overshoot); `spring` (`{stiffness:200,damping:20}`) for physical UI motion.
Nothing animates in 0ms. Respect `prefers-reduced-motion` (fast crossfade / no idle loops instead of travel).

## SVG rendering
Live SVG geometry: the `/select` comparator's three-axis (triangle) **fit radar** (`lib/nodeLayout.ts`) and the results **career map** (`CareerMapField`, `lib/careerMapLayout.ts` — fixed Figma art with %-driven hub radii and re-trimmed edges). Named motion variants live alongside the component that uses them. _(Documented cut: the old narrative node map was deleted at step-8 Phase E — `nodeLayout.ts` now feeds only the `/select` radar; the Phase E/F bubble map + constellation were replaced by the career map at the career-map merge; the `/src/scene/` assembly-line hierarchy — `Factory`, `ConveyorBelt`, `RoboticArm`, `Bin`, `Robot` — was never built.)_

## Before done
- Confirm no node has both engines on the same property.
- If GSAP is revived: confirm it's inside `useGSAP` + scope, registered in `lib/gsap.ts`.
- Confirm durations/easings are tokens, not literals (idle loops use `breathe`).
- Sanity-check `prefers-reduced-motion` path exists.
- Consider running `/design-review` against the motion section of `design-system-compliance.md`.
