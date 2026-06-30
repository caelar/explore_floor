# Job + Program Content for the Quiz Results Build

**For:** ARM Institute
**From:** the RoboticsCareer.org career-discovery quiz team (CMU MHCI capstone)
**Why we need it:** The new quiz results experience ends in a per-role "constellation" of related jobs and a full job-overview page for each. Role-level content (descriptions, activities, education, salary, competencies) is already captured from your live site in `ARM Updated Role Structure - Source Content.md`. This template asks **only** for the per-job detail and the bridge-training programs the role pages don't include. Where a field is unknown, leave it blank — we'll fill plausible placeholder and mark it for replacement.
**Reading level:** plain language a high-school junior/senior would understand; no jargon.

> Context for the plan: this feeds Phase F of `docs/knowledge/VISUAL_REARCHITECTURE.md`. Phases A–E don't depend on it, so there's runway, but the sooner this comes back, the better.

> **Status note (2026-06-29, Phase C):** the results role cards now render a **"How to bridge the gap"** list per role, built against **placeholder** bridge programs in `src/data/bridgePrograms.ts` (plausible stand-ins, not a vetted ARM list). The **bridge-training program** blocks below are the open ask that unblocks replacing that placeholder; per-job detail (job titles, summaries, responsibilities) is still only needed for Phase F. Everything else on the Phase C card (role description, duties, competencies, education, salary) is sourced from `ARM Updated Role Structure - Source Content.md` and needs nothing new.

> **Status note (2026-06-30, constellation refinement):** the constellation now shows **exactly 4 featured jobs per role** (a balanced 4-node ring). So we need **4 featured titles for each role** (not 3–4). What we're running on as placeholder today, to **confirm or adjust**:
> - **Technician:** ARM's role page lists only 3 common titles, so we **added a 4th — "Robotics Maintenance Technician"** (a sensible entry-level maintenance role). Please confirm it, or swap it for a better 4th.
> - **Specialist:** we feature **4 of your 5** — Robotics Programmer (placeholder for "Robotics Specialist", renamed so the job doesn't read identical to the role), Robotics Engineer, Mechatronics Engineer, Automation Engineer. **Dropped from the ring:** Robotic Systems Engineer. Confirm the four (and which to drop) or tell us to feature a different set.
> - **Integrator:** we feature **4 of your 5** — Robotics Integrator, Robotic Integration Design Engineer, Robotics Software Integrator, Robotics Application Development Engineer. **Dropped from the ring:** Advanced Industrial Integrator. Confirm or adjust.

---

## Role 1 — Robotics Technician (entry)

**ARM's listed common job titles:** Robot Operator · Entry Level Robotics · Assembly Operator _(only 3 — we added **Robotics Maintenance Technician** as the 4th; confirm or replace)_

We feature **exactly 4** titles on the constellation (see the 2026-06-30 status note). For **each** featured job:

- **Job title:**
- **One-line summary** (what this person actually does day to day):
- **3–5 key responsibilities** (short bullets):
- **4–6 skills used** (short, chip-sized phrases):
- **Typical salary or range** (only if different from the role median **$45,936/yr**):
- **Education / entry requirement** (only if different from **HS diploma / GED**):

**Bridge-training programs for Technician (2–3):**
- **Program name:**
- **Provider / school:**
- **What it covers** (1 line):
- **Length / format** (if known):
- **Link** (if any):

---

## Role 2 — Robotics Specialist (mid)

**ARM's listed common job titles:** Robotics Specialist · Robotics Engineer · Mechatronics Engineer · Automation Engineer · Robotic Systems Engineer

We feature **exactly 4** titles (4 of these 5 — see the 2026-06-30 status note). For **each**:

- **Job title:**
- **One-line summary:**
- **3–5 key responsibilities:**
- **4–6 skills used:**
- **Typical salary or range** (only if different from the role range **$85,000–$147,700/yr**, median **$105,000/yr**):
- **Education / entry requirement** (only if different from **Bachelor's required, Master's sometimes preferred**):

**Bridge-training programs for Specialist (2–3):**
- **Program name:**
- **Provider / school:**
- **What it covers:**
- **Length / format:**
- **Link:**

---

## Role 3 — Robotics Integrator (planning / highest)

**ARM's listed common job titles:** Robotics Integrator · Robotic Integration Design Engineer · Robotics Software Integrator · Robotics Application Development Engineer · Advanced Industrial Integrator

We feature **exactly 4** titles (4 of these 5 — see the 2026-06-30 status note). For **each**:

- **Job title:**
- **One-line summary:**
- **3–5 key responsibilities:**
- **4–6 skills used:**
- **Typical salary or range** (only if different from the role range **$87,000–$153,000/yr**, median **$99,250/yr**):
- **Education / entry requirement** (only if different from **Bachelor's required, Master's sometimes preferred**):

**Bridge-training programs for Integrator (2–3):**
- **Program name:**
- **Provider / school:**
- **What it covers:**
- **Length / format:**
- **Link:**

---

## Cross-cutting (optional)

- Any **real bridge programs** ARM wants featured by name? (Our mockup used placeholders like "Lorain County Community College" — confirm or replace.)
- Anything that should **not** appear (titles or programs to avoid)?
- A "next steps" destination per job, if one exists (e.g., a SkillsMatch or training-finder URL) — otherwise we'll stub the CTA.
