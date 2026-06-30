# Handoff: Quiz → Results (RoboticsCareer.org career-match flow)

> **Local copy of the canonical Claude Design reference**, imported from the
> claude.ai/design project **"Interest Quiz CD Prototype"**
> (`df8d5f31-2435-4a09-9382-6af1d62f9b59`, file
> `design_handoff_quiz_to_results/Quiz to Results.dc.html`) via the claude_design MCP on
> 2026-06-30. This is the `.dc.html` the harness docs cite as ground truth. Open
> `Quiz to Results.dc.html` in a browser to view it (it loads `support.js` + the logo from
> this folder; fonts come from Google's CDN, so it needs an internet connection).

## Overview
An onboarding **interest quiz** that profiles a user across robotics-career "paths," then
presents a **results experience**: ranked role-match cards, a side-by-side role comparison,
a visual "map" of results, a per-role constellation of related jobs, and individual job
detail/overview screens. One self-contained flow: answer the quiz, land on the top match,
explore from there.

## About the design file
`Quiz to Results.dc.html` is a **design reference created in HTML** — a working prototype
showing intended look, copy, and interaction, **not production code to copy directly**. It
runs on a small in-house templating runtime (`support.js`, a React-like layer); **do not
port `support.js` or its `<x-dc>` / `<sc-if>` / `<sc-for>` syntax into the real app.**
Recreate the screens in `explore_floor` idiomatically. Treat the prototype as the source of
truth for **layout, spacing, color, typography, copy, and interaction**.

## Screens (in order)
1. **Quiz — intro screeners** (`screen: 'quiz'`, `segment: 'intro'`): single-select screener
   questions. Card `rgba(255,255,255,0.035)` fill, 1px hairline, **16px** radius, `34px 36px
   36px` padding; muted "Question N of M", hairline divider, optional prompt, then the
   question as Montserrat-700 **34px**. Answer rows stack with 11px gaps and highlight to gold
   on select; selecting auto-advances. "No" to college skips the "How long?" follow-up.
2. **Quiz — day-in-the-life scenes** (`segment: 'scenes'`): 7 scenes ("Scene N of 7"). Scene
   context card (scenario paragraph + question), then choices presented **one at a time**
   ("Choice N of 4") as a rating card that slides in (`+130→0`, 460ms) / out (`0→-90`, 200ms).
   Intro state has a gold **Continue**; pressing it reveals the per-choice rating cards.
3. **Results — role-overview cards** (`screen: 'cards'`): headline results — matched role,
   big match %, "why you matched" inline expand, tabbed detail, prev/next through ranked roles.
4. **Results — compare** (`screen: 'compare'`): side-by-side pick vs. another role, header
   dropdown to switch target. (An earlier "compare-pick" chooser is removed dead code.)
5. **Results — map** (`screen: 'map'`): ambient floating role bubbles; click to dive in.
6. **Results — constellation + job overlay** (`screen: 'selected' / 'job'`): related jobs as
   nodes around a center; click a node for a job summary overlay; 404px side panel.
7. **Results — job overview** (`screen: 'job-overview'`): full job page with tabs.

## Key type / token facts (used by the in-repo fidelity work)
- **Canvas** `#181818`; app surface `#1a1a1c`; header `#262626`.
- **Text on dark:** primary `#f2f4f5`, secondary `#c4c8cc`, muted `#9aa0a5` / `#6f6f6f`.
- **Gold** `#ffb81c` (ink on gold `#262626`); **teal** `#117289` (links / primary actions).
- **Quiz question** (intro + scene-intro): Montserrat-700 **34px** / line-height 1.14,
  `#f2f4f5`. Compresses to **22px** in the scene rating phase.
- **Scenario / prompt line:** Roboto-400 **17px** (intro) → **18px** (rating), line-height
  1.55, color **`#c4c8cc`** (secondary, not the faint caption grey).
- **Choice rating card:** Montserrat-**600** **20px** / line-height 1.3, `rgba(255,255,255,
  0.035)` fill, 1px hairline, **14px** radius, 22px padding.
- **Rating rows** ("That's me / Kinda me / Not me"): Roboto-500 **17px**, 62px tall, 12px
  radius, invert to gold fill + `#262626` ink (weight 700) on select.
- **"Question/Choice N of M" label:** Roboto-400 **13px** `#9aa0a5`. The intro number is just
  `introIndex + 1` (position on the path), **not** a count of answered questions.
- Radius: 8px inputs, 14–16px cards, 20px results panel, 9999px pills. Easing
  `cubic-bezier(0.25,0.46,0.45,0.94)`.

## Data model
All copy, names, numbers, and matches are **placeholder mock data** in the prototype's logic
class (`ARCH` paths, `QINTRO` screeners, `QSCENES` scenes, `BRIDGE` programs, `JOB_DESC` /
`RESPONSIBILITIES` / `SKILLS`). Wire to real data; confirm named institutions before shipping.
The prototype models four paths (Program / Operate / Repair / Plan); the live build collapses
to ARM's three roles (Technician / Specialist / Integrator, D-028).

## Files in this folder
- `Quiz to Results.dc.html` — the full prototype (all 7 screens + logic + mock data).
- `support.js` — the in-house runtime. **Reference only — do not port.** Needed to open the
  HTML locally.
- `assets/rc_logo_white_text.png` — header logo.
