# Deferred Directions: candidate work for a v4, pending v3 findings

_Snapshot 2026-07-01. Branch `narrative-v3-realign`._

These are things we **consciously deferred**, not things we missed. Most are gated on what the **v3 virtual test** surfaces: there's no point polishing a screen or committing to a motion nuance before we learn whether users trip on it. Revisit this list after the v3 round; the survivors become the v4 backlog. None of these blocks the current test or the July handoff.

Two items that used to live here **shipped 2026-07-01** and are no longer deferred: the **`breathe` ambient-duration token** (idle loops now read `breathe.orb/bubble/node/sparkle` from `motion.ts`) and the **directional Back-slide + intro-choice stagger** in the flow runner (Back now slides opposite to Forward via an AnimatePresence `custom` prop; intro answer rows cascade in after the card settles).

---

## Surface the "starting rung" cue earlier (one theme, three surfaces)

The Technician-as-a-starting-rung framing passed its rubric (the `pathUp` callout is in place), but the "path up" signal still lives one scroll down on Tab 1 and the full growth ladder is several navigations deep. Three deferrals point at the same theme, so tackle them together:

- **Hero rung cue (highest impact).** The first ~2s on the Technician hero is the one place with no upward signal. Add a compact "entry point, with a path up" chip under the match label in `RoleHero.tsx`, or hoist the `pathUp` callout above the role description in `RoleTabRole.tsx`. Verified unbuilt today.
- **Rung framing earlier than the overview tab.** The growth/rung read currently lives deep in the job-overview tab; pull it forward from the constellation side. Converges with the hero cue.
- **Rung framing on a Technician-leaning clear-winner compare.** The compare columns intentionally omit the `pathUp` callout, so a Technician-top clear-winner compare loses the starting-rung framing the cards carry. Fold into the same pass.

## Optional results polish (Phase-G deferred enhancements)

All underlying rubrics already PASS, so none is a gate:

- **Low / 0% map framing.** When the top match is low, soften the bubble map: a "nothing jumped out strongly yet" caption, and/or floor the displayed percentage so no bubble renders a stark bare "0%" (`bubbleLayout.ts` floors every bubble to ~168px, so a lone 0% reads coldest).
- **Non-interactive bridge-program rows.** `BridgeProgramRow.tsx` has no `onClick` / button / href and gives no tap feedback. Make interactive once real listings land (partly blocked on the ARM program data — see `HANDOFF_GUIDE.md` §1).
- **Compare "11 moments" vs "10 moments".** Branch-aware scoring walks different path lengths per role, so the two compare columns can cite different denominators. Correct, but could read as an inconsistency. Consider a footnote or a normalized denominator if it recurs in testing.
- **Outbound next-step CTA from compare.** Compare exits only via Back-to-cards and the target dropdown, with no forward CTA.
- **Map echoing the cards' "moments" framing.** Cosmetic cross-screen consistency: the bubble-map intro copy should echo the cards' "moments" language.
- **Side-panel "from N of your answers" caption.** A provenance caption for the job-constellation side-panel role read.

## Motion refinements (remaining nuance)

- **Mid-session reduced-motion flips don't stop the ambient loops (p3, Pass-6 review).** On-load `prefers-reduced-motion` is respected everywhere (the E2E spec covers it), but flipping the OS preference *during* a running results session leaves the bubble/constellation floats cycling. Likely fix: include the looped value in the reduced `animate` branches (`y: 0`) in `BubbleField.tsx` / `ConstellationNode.tsx` / `AmbientField.tsx` and confirm `useReducedMotion()` reactivity in `ResultsExperience.tsx`. Low: an on-load preference is the realistic case.

- **First BucketSort card slides in after the scene reveal settles.** The intro-question rows already stagger in after the card (shipped 2026-07-01), but the **scene** case is different: when Continue is pressed, the choices region reveals and the first `BucketSort` prompt card slides in *simultaneously*. The nuance is to let that first card arrive a beat after the reveal (height) settles. Left deferred because it's non-trivial to do without disturbing the intro→rating morph choreography and the per-choice card swaps (the card entrance is shared across all choices; distinguishing the first reveal from a choice swap is the hard part). Revisit if the simultaneity reads off in testing.

## Responsive + accessibility follow-ups

**Responsive story for the desktop-first screens — won't-fix, documented desktop-only (D-057, 2026-07-22).** The mockup is desktop-1400px and the map and cards gutter are tuned for `>= md`. The plan once asked for a per-screen responsive story and 44px touch targets; that is now **out of scope for all prototypes**. These experiences target desktop (DESIGN_SYSTEM §5) and mobile/responsive fit is a **documented known limitation**, not planned work. Kept here as the record of what was consciously not built.

**Career-map mobile label strategy — won't-fix, documented desktop-only (D-057).** At `< md` role zoom, job-label text overflows its layout box and can clip at the viewport edge: the label *box* (`MAP_JOB_LABEL`, 120vb wide) scales with the viewport, but the *type* size is pegged to the orb-diameter reference, so the two diverge as the screen narrows. This was the one open p2 from the merge review (2026-07-18); with responsiveness now out of scope it is a **documented desktop-only limitation**, no code change. Diagnosis and the live repro numbers remain in the `CAREER_MAP_REVIEW.md` Pass 3 record for anyone who later takes mobile on. (The fix would be a design call, not a camera hack: map-proportional type — shrinks to ~7px, likely unreadable — vs. a genuinely wider fitted box vs. a dedicated `< md` treatment.)

**Career-map review p3 tail (same review, all polish):** per-screen container-width literals (`Landing` 729, `CharacterSelect` 996, `LoadingScreen` 662, `AppHeader` 440) instead of container tokens; the `/select`-only `RoleDetailSheet` still on the light `bg-bg` surface; the Motion "animate opacity from undefined" console warnings on map SVG orbs (the `initial={false}` + SVG-attr idiom — give explicit baselines); three aria-hidden-with-focused-descendant warnings from map chrome; the ThoughtBubble arbitrary drop-shadow; the mobile intro card covering all three hubs at overview (fit the overview camera below the card at `< md`).

The a11y items sit inside the repo's stated "keyboard sanity only" scope, so all are low:

- **Full dropdown keyboard roving / focus-trap.** `CompareTargetMenu.tsx` has ARIA + Escape + outside-click but no arrow-key roving or focus-trap.
- **Signal-bar graphical contrast (p3, disposition unconfirmed).** A p3 finding on accent-fill vs recessed-track contrast on dark. `SignalBars.tsx` still describes the original fill; worth one check.
- **`TrajectoryViz` node-ring literals (p3, Pass-6 review).** `TrajectoryViz.tsx` hand-sets its ring borders as `rgba(255,255,255,0.7)` / `0.25` — the same case `--color-constellation-line` already solved (token color, per-state opacity in the component). One-token cleanup when next in the file.
- _(Closed 2026-07-01: the quiz reading-column container token — `FlowRunner` now uses `max-w-read` (`--container-read` 672px) instead of an ad-hoc `max-w-2xl`.)_

## Open scoring decisions and watch-items

- **Match-% "Kinda me" bucket weight.** `MAYBE_WEIGHT = 0` in `categoryScoring.ts` is deliberate and tunable, but the keep-or-change decision is unmade.
- **What Q0 (experience) routes to once unparked.** `narrativeFlow.ts` keeps Q0 unscored with its routing parked (`n-q0-yes`/`n-q0-no` both `categories: []`, per D-023). What it should route to when unparked is still open.
- **Latent gold=Technician / gold=my-pick collision.** Gold serves both as the Technician accent and the "my pick" selection color, which only collide on a Technician-top result. Left as a documented watch-item.

## Drag path — removed (end-state on record)

The dormant click-vs-drag alternative (`DragSortCard` / `DropZone`) was **removed as dead code 2026-07-01** (DECISIONS D-031, reversing `archive/VISUAL_REARCHITECTURE.md` §3 rule 4). It had zero importers and zero tests, so the "compiling and tested-enough to revive" guarantee was never actually met. The rater is click-only (`BucketSort`, tap/Enter). If a drag interaction is ever wanted, it's a fresh build; git history + the `archive/pre-narrative-only` tag preserve the old code.
