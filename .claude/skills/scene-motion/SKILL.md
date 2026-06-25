---
name: scene-motion
description: Use when authoring or editing animation — the flow-step transitions, the bucket-sort drag gesture, the narrative node-map compare swap, the Landing GSAP reveal, or screen transitions. Encodes the hard Motion-vs-GSAP ownership boundary, the useGSAP discipline, and the shared motion tokens so the two engines never fight. Trigger on tasks touching GSAP, Motion (motion/react), AnimatePresence, drag, layout animations, timelines, or DrawSVG.
---

# Motion authoring

Authoritative specs: `ARCHITECTURE.md` §1 (the two-engine model), `DESIGN_SYSTEM.md` §8 (motion tokens), and the motion section of `docs/rubrics/design-system-compliance.md`. This skill is the discipline that keeps the two animation engines from colliding. Pair it with the installed GSAP and Motion agent skills for library API correctness; **this** file is the source of truth for *our* conventions.

> **Scope note (realignment).** The conveyor scene, robotic arm, live-building robot, and cinematic build beat this skill was originally written for are the **documented cut** (never built). The live motion is modest: the Landing reveal, the flow-step transitions, the bucket-sort drag, and the node-map compare. The ownership rule and `useGSAP` discipline below still govern that live motion and the upcoming high-fidelity results screen.

## The one hard rule
**A given element + property is owned by exactly one library at a time.** Motion runs through React's render cycle / WAAPI; GSAP writes straight to the DOM/SVG and bypasses React. They only break when both grab the same transform on the same node. Don't.

## Ownership map
- **Motion (`motion/react`, formerly framer-motion)** owns React-state / lifecycle / gesture motion: screen + flow-step transitions (`AnimatePresence`), card enter/exit, the **bucket-sort drag** gesture (`drag` + `dragConstraints`), hover/tap micro-interactions, the node-map **compare swap** (`layout`), and the global `prefers-reduced-motion` gate. Pattern: declarative `motion.div` / `motion.svg` with variants.
- **GSAP** owns the one ambient flourish that ships: the **Landing `DrawSVG` reveal** (`.scene-draw`, registered in `lib/gsap.ts`). _(Documented cut: the conveyor/arm/part-to-robot timelines, the build beat, `MorphSVG`, and `MotionPath` were the scene work GSAP was chosen for, never built.)_

Per-screen (live): **Landing** — Motion CTA; GSAP `DrawSVG` reveal. **Flow** — Motion owns the bucket-sort drag, the card UI, and the step-to-step transitions. **Results** — Motion owns the node-map layout and the compare swap (`layout`), and the dashboard reflow.

## GSAP discipline (non-negotiable)
- Every GSAP animation runs inside the **`useGSAP`** hook (`@gsap/react`) with a **scope ref**, so it auto-cleans on unmount via `gsap.context().revert()`.
- **Never** a bare `gsap.to(selector)` in a component.
- Register plugins **once** at app start: `gsap.registerPlugin(useGSAP, MorphSVGPlugin, DrawSVGPlugin, MotionPathPlugin)`.

## Tokens — one motion language across both engines (`DESIGN_SYSTEM.md` §8)
Durations and easings live in `/src/lib/motion.ts` and are read by **both** engines:
- durations: `instant` 100 · `snap` 200 · `glide` 400 · `pour` 700 · `reveal` 1000 (ms)
- easings: `ease-soft` (most UI) · `ease-snap` (overshoot for arm/part settle) · `ease-physical` (Motion spring)
Nothing animates in 0ms. Scene uses spring physics; UI cards use tweens. Respect `prefers-reduced-motion` (fast crossfade instead of physical motion).

## SVG rendering
The live SVG is the **results geometry**: the narrative node map and the four-axis fit radar, driven by `lib/nodeLayout.ts` (no canvas, no WebGL). Named motion variants live alongside the component that uses them. _(Documented cut: the `/src/scene/` assembly-line hierarchy — `Factory`, `ConveyorBelt`, `RoboticArm`, `Bin`, `Robot` — was never built; `/src/scene/` holds only two placeholders.)_

## Before done
- Confirm no node has both engines on the same property.
- Confirm GSAP is inside `useGSAP` + scope.
- Confirm durations/easings are tokens, not literals.
- Sanity-check `prefers-reduced-motion` path exists.
- Consider running `/design-review` against the motion section of `design-system-compliance.md`.
