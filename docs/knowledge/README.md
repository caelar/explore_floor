# Knowledge layer

The project's **living memory** — version-controlled so it travels with the code, doubles as ARM handoff material, and feeds the MHCI portfolio case study. This is the source of truth; a few durable facts are also mirrored into Claude's built-in memory for auto-recall.

It's adapted from the five-layer "design harness" idea (context · skills · orchestration · evaluation · knowledge) but **tuned to this project, not copied from a template** — only the files that earn their place for *our* goals (cross-session coherence, ARM handoff, portfolio) are here.

## Files

| File | What it's for | Cadence |
|---|---|---|
| [`STATUS.md`](./STATUS.md) | Where we are: live acceptance-criteria tracker per phase. **Read this first each session.** | Updated by `/phase-check` and as criteria clear. |
| [`DECISIONS.md`](./DECISIONS.md) | Why we did things: ADR-lite log (decision · rationale · alternatives · affected). | Append on any non-obvious call. `/compound decision`. |
| [`LESSONS.md`](./LESSONS.md) | Agentic-workflow + design-craft learnings — what worked, where the agent needed steering. | Capture when notable. `/compound lesson`. |
| [`CASESTUDY.md`](./CASESTUDY.md) | Portfolio narrative spine, fed by the three above. | Distill at milestones. |
| [`sessions/`](./sessions) | Dated handoff notes written at the end of large changes: what changed, why, what's next. | `/compound session`. |
| [`HARNESS.md`](./HARNESS.md) | Full reference for the harness: skills, commands, subagents, rubrics, MCP servers, and how to use/extend them. | When the harness changes. |
| [`REMAINING_WORK.md`](./REMAINING_WORK.md) | Router for what's left, by owner/timeframe → [`HANDOFF_GUIDE.md`](./HANDOFF_GUIDE.md) (ARM/Fivestar), [`DEFERRED_DIRECTIONS.md`](./DEFERRED_DIRECTIONS.md) (v4), [`DESIGN_SYSTEM_RUN.md`](./DESIGN_SYSTEM_RUN.md) (design-system run). | As work lands or re-scopes. |
| [`archive/`](./archive) | Completed plans kept for rationale (the realignment memo + the step-8 build log). Not active work. | Frozen on completion. |

## How it connects

- **Session start:** read `STATUS.md` + the newest `sessions/` note (see `CLAUDE.md` → Harness & session protocol).
- **Capture:** `/compound [decision|lesson|session]` writes to the right file.
- **Gate:** `/phase-check` verifies the current phase and ticks `STATUS.md`; `/design-review` grades UI against [`../rubrics/`](../rubrics).
- **Promote:** a lesson that recurs becomes a rule in `CLAUDE.md` (done by hand, no ceremony).
