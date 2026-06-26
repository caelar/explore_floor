# RC.org Career Discovery — "Explore the Floor" (prototype)

An interactive, narrative career-discovery experience for **RoboticsCareer.org** (the ARM Institute's workforce platform). A user walks through a day in their life, sorting the choices each scene offers into three buckets, and lands on a results screen that recommends how they match ARM's three RC.org robotics roles (Technician, Specialist, Integrator). The build is the **Narrative** flow; Phase 4 stripped it to that one flow (D-027), and Phase 5 collapsed its four study categories to the three roles (D-028).

This is a **high-fidelity prototype** for an MHCI capstone with ARM as client — built to prove the concept and be user-tested, not to ship to production. ARM's dev team would rebuild from it later.

> Two flows are the documented cut, deleted in Phase 4 (recoverable at git tag `archive/pre-narrative-only`): the **Exam** flow (the study's comparison condition, a 30-statement sort scoring the same four study categories — the narrative won the study), and the original **Classic** concept (a stylized assembly-line sort that built a custom robot scoring three role families, never built as a scene). The plan of record is [`docs/knowledge/REALIGNMENT.md`](./docs/knowledge/REALIGNMENT.md); the live data model is `DATA_MODEL.md` §17. (Phase 5 is done: the live model is ARM's three roles — Technician/Specialist/Integrator.)

> **New here? Read [`CLAUDE.md`](./CLAUDE.md) first** — it's the operating manual. Then skim [`docs/`](./docs), starting with [`docs/knowledge/REALIGNMENT.md`](./docs/knowledge/REALIGNMENT.md) and [`docs/knowledge/STATUS.md`](./docs/knowledge/STATUS.md).

---

## Quick start

**Prereqs**
- **Node 22** (`.nvmrc` pins it — run `nvm use`).
- **pnpm** (`corepack enable` or `npm i -g pnpm`).

**Setup**
```bash
nvm use                 # Node 22
corepack enable         # provides pnpm
cp .env.example .env     # then fill in keys (see below)
pnpm install             # available after the Phase 0 scaffold
```

> The app is scaffolded and the live flows are built (Phase 0/1 complete, plus the question-structure study). The scripts below work.

**Run / verify** (post-Phase 0)
```bash
pnpm dev          # Vite dev server
pnpm test         # Vitest unit tests + Playwright E2E
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

**Start / stop the dev server**
```bash
pnpm dev                       # start — serves on http://localhost:5174
# stop — press Ctrl+C in the terminal running it
lsof -ti:5174 | xargs kill     # stop a stray/backgrounded server holding the port
```

## Tooling / MCP setup

The harness uses three MCP servers — **figma** (design↔code round-trip), **playwright** (review/E2E), **firecrawl** (scrape). Configure them once, either way:

- **Globally (recommended)** — `claude mcp add` for each (or your existing global setup). This repo deliberately ships **no** project `.mcp.json`, to avoid duplicate-server collisions when you already have these configured globally (see `DECISIONS.md` D-012).
- **Per-clone** — if you have no global config, drop your own `.mcp.json` at the repo root declaring `figma` / `playwright` / `firecrawl`; `.claude/settings.json` already whitelists those names via `enabledMcpjsonServers`.

Then:

- **Figma** — run `/mcp` in Claude Code and authenticate the `figma` server (OAuth, one-time).
- **Firecrawl** — set `FIRECRAWL_API_KEY` in `.env` ([get a key](https://www.firecrawl.dev/app/api-keys)).
- **Playwright** — no setup needed.

Animation skills for the agent (free, open-source):
```bash
npx skills add greensock/gsap-skills          # GSAP (scene choreography)
npx skills add C-Jeril/framer-motion-skills    # Motion (state-driven UI)
```

## Where things live

| Path | What |
|---|---|
| [`CLAUDE.md`](./CLAUDE.md) | Operating manual — read first every session. |
| [`docs/`](./docs) | The spec: `PRD`, `CONTEXT_BRIEF`, `ARCHITECTURE`, `DATA_MODEL` (§17 is the live model), `DESIGN_SYSTEM`, `ROADMAP`. The realignment plan of record is `docs/knowledge/REALIGNMENT.md`. |
| [`docs/knowledge/`](./docs/knowledge) | Living project memory: `STATUS`, `DECISIONS`, `LESSONS`, `CASESTUDY`, `sessions/`. **Start at [`STATUS.md`](./docs/knowledge/STATUS.md).** |
| [`docs/rubrics/`](./docs/rubrics) | Design-quality rubrics the `design-reviewer` grades against. |
| `.claude/` | The harness: `skills/`, `agents/`, `commands/`, `settings.json`. |
| `src/` | App code (created in Phase 0). |

## The agent harness

This project is built with Claude Code using a small, owned **harness** — the layer that makes the build coherent, reviewable, and resumable across sessions and teammates. It's itself a deliverable (the "agentic design practice" the case study is about). Quick map:

| Piece | Where | What it's for | How you use it |
|---|---|---|---|
| **Context** | `docs/`, `CLAUDE.md`, `docs/knowledge/` | What's always true about the project | Read automatically each session |
| **Skills** | `.claude/skills/` | Recurring jobs — `data-author` (`/src/data`), `scene-motion` (animation), + GSAP/Motion packs | Auto-fire when your task matches |
| **Slash commands** | `.claude/commands/` | Things you kick off (see below) | Type `/name` in the prompt |
| **Subagents** | `.claude/agents/` | `verifier` (gates) + `design-reviewer` (UI critique) + `doc-steward` (cross-doc reconciliation) in isolated contexts | Dispatched by the commands |
| **Rubrics** | `docs/rubrics/` | Checkable design-quality bars | Graded by `design-reviewer` |
| **MCP servers** | global (`claude mcp add`) or your own `.mcp.json` | figma (round-trip), playwright (review/E2E), firecrawl (scrape) | `/mcp` to connect/authenticate |
| **Knowledge** | `docs/knowledge/` | Status, decisions, lessons, case study, session handoffs | `/compound`; read `STATUS.md` first |

Commands: `/phase-check` (verify the phase's criteria + tick STATUS), `/design-review` (screenshot the UI and grade it vs rubrics), `/compound` (capture a decision/lesson/session note), `/capture-figma` & `/pull-figma` (the Figma round-trip), `/revise-doc` (edit a spec doc and reconcile the others via `doc-steward`).

**→ Full reference: [`docs/knowledge/HARNESS.md`](./docs/knowledge/HARNESS.md)** — every piece, what it's for, how to use it, and how to extend it. How it was set up: [`docs/knowledge/sessions/`](./docs/knowledge/sessions).
