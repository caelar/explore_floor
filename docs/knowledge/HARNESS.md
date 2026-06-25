# The harness — full reference

Everything this project layers on top of Claude Code to make the build coherent, reviewable, and resumable across sessions and teammates: the context, skills, slash commands, subagents, rubrics, MCP servers, knowledge layer, and settings. This is the "what is all this and how do I use it" doc.

> **Mental model.** An agent = **model + harness**. Each piece below encodes an assumption about what the model shouldn't be left to do unaided — remember state across sessions, judge its own design work, keep two animation engines from colliding, etc. The frame is five layers (context · skills · orchestration · evaluation · knowledge); the working loop borrows Anthropic's planner → generator → evaluator split (plan mode → main agent → the `verifier`/`design-reviewer` subagents). It's bespoke and lean by design — we add pieces only when they earn their place.

---

## 0. Claude Code primitives (glossary)

If you're new to Claude Code, the building blocks differ in **who triggers them** and **where they run**:

| Primitive | Who triggers it | Runs in | Lives in |
|---|---|---|---|
| **Tool** | The model, automatically | main context | built-in (Read, Edit, Bash, …) or an MCP server |
| **Skill** | The model, when your task matches the skill's description | main context | `.claude/skills/<name>/SKILL.md` |
| **Slash command** | **You**, by typing `/name` | main context | `.claude/commands/<name>.md` |
| **Subagent** | The model (or a slash command), via the Agent tool | its **own** fresh context window | `.claude/agents/<name>.md` |
| **MCP server** | Exposes tools the model can call | external process/service | global config or an `.mcp.json` (see §6) |
| **Hook** | The harness, on an event (deterministic) | shell | `settings.json` |

Rule of thumb: **skills** teach the model *how* to do a recurring job (it pulls them in on its own); **slash commands** are things *you* kick off; **subagents** are for work you want done in a clean, isolated context (so it doesn't clog the main thread) or by an independent "second pair of eyes."

---

## 1. Context layer — what's always true

The model reads these to know the project. **Skills and rubrics cite them; they never duplicate them.**

- **`CLAUDE.md`** (repo root) — the operating manual; loaded every session. Contains the session-start ritual and the harness map.
- **`docs/`** — the spec: `PRD`, `CONTEXT_BRIEF`, `ARCHITECTURE`, `DATA_MODEL`, `DESIGN_SYSTEM`, `ROADMAP`.
- **`docs/knowledge/`** — living memory (see §7).
- **Built-in memory** (`~/.claude/.../memory/`) — a few durable facts mirrored for auto-recall (who the user is, knowledge lives in-repo, the harness is bespoke, the session ritual, the "tune don't cargo-cult" preference). The in-repo knowledge layer is the source of truth; memory is just a convenience mirror.

## 2. Skills — repeatable jobs the model pulls in automatically

Skills auto-activate when your request matches their description — you generally don't invoke them by hand (though they're listed in the skills menu). Two are **project-authored**; the rest came from free, open-source skill packs.

**Project skills (`.claude/skills/`)**
- **`data-author`** — fires when editing anything in `/src/data` (interest items, weights, roles, competencies, programs, robot parts). Encodes "data is data, not code" and the `DATA_MODEL` invariants (24 items, all three weights present, per-archetype sums **B 22 / I 27 / A 25**, references resolve). Keeps content tunable without touching component logic.
- **`scene-motion`** — fires on motion work (GSAP, Motion, drag, layout animations, the Landing reveal, the flow-step transitions, the node-map compare). Encodes the hard **Motion-vs-GSAP ownership boundary**, the `useGSAP` discipline, and the shared motion tokens. It is the source of truth for *our* conventions; the library packs below cover general API correctness. _(Rescoped from the documented-cut conveyor choreography, D-026.)_

**Installed library packs** (free/MIT; in `.agents/skills/`, symlinked into `.claude/skills/`, pinned in `skills-lock.json`)
- **GSAP:** `gsap-core`, `gsap-react` (the `useGSAP` hook), `gsap-timeline`, `gsap-plugins` (DrawSVG/MorphSVG/MotionPath/Flip), `gsap-scrolltrigger`, `gsap-frameworks`, `gsap-performance`, `gsap-utils`.
- **Framer Motion:** `framer-motion-react` (AnimatePresence, cleanup), `framer-motion-gestures` (drag/tap/hover → our drag-to-bin), `framer-motion-variants`, `framer-motion-layout` (shared transitions → results compare), `framer-motion-scroll`.

> These reference legacy `framer-motion` imports; we use the `motion` package (`motion/react`) — identical API, only import paths differ. `scene-motion` is authoritative for our conventions.

To add or restore packs: `npx skills add <owner/repo>` (the agent can't self-install — run it yourself), or `npx skills experimental_install` to restore from the lockfile.

## 3. Slash commands — things you kick off (`.claude/commands/`)

Type these in the prompt. They orchestrate skills + subagents.

| Command | Args | What it does |
|---|---|---|
| **`/phase-check`** | `[phase #]` | Reads the phase's acceptance criteria from `ROADMAP.md`, runs the **verifier** subagent (lint/typecheck/test + data invariants), ticks `STATUS.md`, and reports remaining gaps. Your phase gate. |
| **`/design-review`** | `[screen/URL] [rubric]` | Runs the **design-reviewer** subagent: screenshots the running UI via Playwright and grades it against `docs/rubrics/`, filing severity-tagged findings. |
| **`/compound`** | `decision\|lesson\|session …` | Captures knowledge into `docs/knowledge/` — an ADR entry, a workflow/craft lesson, or a dated session handoff note. |
| **`/capture-figma`** | `[screen/URL]` | Code→canvas: captures the running screen into editable Figma frames (figma MCP). Static UI only — the animated scene/robot don't round-trip. |
| **`/pull-figma`** | `<frame URL>` | Canvas→code: reads an edited Figma frame and applies the diff as idiomatic React against our token/composition conventions (not a blind regen). |

## 4. Subagents — isolated workers / independent reviewers (`.claude/agents/`)

Each runs in its **own context window** (keeps the main thread clean) and is dispatched by a slash command or by asking the model to "use the X subagent."

- **`verifier`** — runs the gates (`pnpm lint`/`typecheck`/`test`) and checks the `DATA_MODEL` §15 data invariants, then reports pass/fail with real output. Read-only except for running tests. Driven by `/phase-check`.
- **`design-reviewer`** — the independent design evaluator. Drives Playwright (navigate, screenshot, toggle reduced-motion), reads implementing code, and grades against the rubrics with specific `file:line` findings. **Read-only** — it never edits; you apply fixes after. Driven by `/design-review`.

> Why separate agents? An evaluator that interacts with the live app and grades against explicit criteria beats the main agent reviewing its own work (which tends to over-praise).

## 5. Evaluation — rubrics (`docs/rubrics/`)

Quality bars made checkable. The `design-reviewer` grades against them. Each is **YAML frontmatter** (machine-checkable `criteria` with `id` / `severity` p1–p3 / `check`) + a **prose body** (a `Scope & Grounding` block of personas/scenarios/anti-scenarios, then rationale + pass/fail examples per section).

- **`design-system-compliance`** — tokens-not-literals, the four-category accent mapping (`categoryAccent.ts`), type scale, radius/shadow, surface discipline, and **motion** (tokens, engine ownership, `prefers-reduced-motion`) folded in from the retired `motion-quality`.
- **`results-screen`** — the quality bar for the high-fidelity narrative node-map / exam dashboard results: match clarity, trust through explanation, discoverability of the compare, honest framing.
- _(Retired with the conveyor vision, D-026: `goose-game-aesthetic` — graded a scene that was never built; `motion-quality` — folded into `design-system-compliance`.)_

Severity: **p1** blocks, **p2** should-fix, **p3** polish. To add one, copy the frontmatter shape, tune the criteria, and cite a source.

## 6. MCP servers — external tools

Configured **globally** (`claude mcp add`), not via a shipped project `.mcp.json` — that file was removed to avoid duplicate-server collisions with the owner's global config (`DECISIONS.md` D-012). `.claude/settings.json` still whitelists the three names via `enabledMcpjsonServers`, so a teammate without a global setup can drop in their own `.mcp.json` and have it auto-enable. Run `/mcp` to see status/authenticate.

- **`figma`** (remote, OAuth) — the design↔code round-trip. Used by `/capture-figma` and `/pull-figma`; also reads variables/frames. One-time auth via `/mcp`. See `ARCHITECTURE.md` §7 for the read-leaning workflow and what does/doesn't round-trip.
- **`playwright`** — drives a real browser. Used by the `design-reviewer` (screenshots, interaction) and by the E2E test loop.
- **`firecrawl`** — web scraping/search. Needs `FIRECRAWL_API_KEY` in `.env`. Used for the deferred RC.org capture (Phase 1) and research spikes.

## 7. Knowledge layer — compounding memory (`docs/knowledge/`)

In-repo, version-controlled, doubles as ARM handoff + portfolio material. See `docs/knowledge/README.md` for the index. The loop: **work → capture (`/compound`) → recurring lessons get promoted to rules in `CLAUDE.md`.**

- **`STATUS.md`** — where we are; read first each session; ticked by `/phase-check`.
- **`DECISIONS.md`** — ADR-lite log (why we did things). The handoff backbone.
- **`LESSONS.md`** — agentic-workflow + design-craft learnings.
- **`CASESTUDY.md`** — the portfolio narrative spine.
- **`sessions/`** — dated handoff notes; the artifact a new session reads to resume.
- **`HARNESS.md`** — this file.

## 8. Settings (`.claude/settings.json`)

- `permissions.allow` — a permission allowlist for safe, frequent commands (`pnpm …`, read-only git, `npx playwright`, `npx skills add`) so you aren't prompted constantly; `deny` blocks `git push` and `rm -rf`.
- `enabledMcpjsonServers` — whitelists the three MCP server names (`figma`/`playwright`/`firecrawl`); a forward-compat no-op unless a project `.mcp.json` exists (see §6 + `DECISIONS.md` D-012).
- `enabledPlugins` — project-enabled plugins (e.g. commit-commands).

---

## How it fits together (typical workflows)

**Every session**
1. The model reads `CLAUDE.md` + `MEMORY.md` automatically, then (per the ritual) `STATUS.md` + the newest `sessions/` note.
2. You work. Relevant skills (`data-author`, `scene-motion`, GSAP/Motion) fire on their own.
3. For visual work, run `/design-review`. At a phase boundary, run `/phase-check`.
4. End a meaningful chunk with `/compound session` (and `/compound decision` for any non-obvious call).

**Building a screen** → edit code (skills auto-assist) → `pnpm dev` → `/design-review` → fix p1/p2 findings → `/phase-check` when the phase's criteria are in reach.

**Figma round-trip** → `/capture-figma` to push a settled static screen to canvas → a designer edits on the canvas → `/pull-figma <url>` to bring the diff back as tokenized React.

**Closing a phase** → `/phase-check` verifies + ticks `STATUS.md` → `/compound session` writes the handoff → (optionally) commit.

## How to extend it (grow as we go)

- **New skill:** `npx skills init <name>` (or hand-author `.claude/skills/<name>/SKILL.md`). Give it a sharp `description` so it triggers at the right time. Point it at the relevant doc; don't duplicate.
- **New rubric:** copy an existing one in `docs/rubrics/`, keep the YAML+prose shape, tune criteria + `Scope & Grounding`, cite a source.
- **New command:** add `.claude/commands/<name>.md` with a `description` + `argument-hint`; have it dispatch a subagent if the work should run isolated.
- **New subagent:** add `.claude/agents/<name>.md` with `name`, `description` (so the model knows when to use it), and a tight tool list.
- Log anything non-obvious with `/compound decision` so the choice is traceable.
