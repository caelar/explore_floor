# Narrative Quiz Structure, Content Spec

Source: FigJam board "Narrative Quiz Structure" (figma.com/board/HP9OFVXI69y7tKaFUJP1Lz), node 7:313, pulled 2026-06-22 (V3 language pass).

> **Updated for the three-role collapse (Phase 5, D-028, 2026-06-25).** The shipping product is **Version 1 (Narrative) only**, and it now scores ARM's **three** published robotics roles, not the four study categories the board drew. Version 1 below has been rewritten to match the live `src/data/flows/narrativeFlow.ts` + `src/data/roleDetails.ts` exactly. **Version 2 (Exam)** is the **archived/retired comparison condition** — the narrative won the June 2026 study and the exam was deleted from the live tree in Phase 4 (D-027). Its section is kept for the record on the original four study categories; it is not built and is not a recommendation.

**Purpose.** This document gives the questions, answer choices, role mappings, and flow for the Explore the Floor interest quiz. It's the cited content source for the data files, so it must match them. This spec covers content and order only. It says nothing about visual design or implementation.

**Light copyedits.** Sticky-note typos from the board were cleaned in transcription (spelling, apostrophes, "median in" to "median is"). No wording was otherwise changed.

---

## Shared framework

The live narrative flow scores the user across ARM's three robotics roles:

| Role | Level |
|---|---|
| Technician | Entry (folds the old Operate + Repair) |
| Specialist | Mid (the old Program) |
| Integrator | Planning (the old Plan) |

Scored choices tally toward one or more roles. The role totals drive the shared results experience (described at the end of this doc).

_(Historical: the board and the study scored four categories — Operate→Operator, Repair→Technician, Program→Specialist, Plan→Integrator. Phase 5, D-028, collapsed those to the three roles above: Operate + Repair fold into the entry Technician, built from the Operate/Operator card. The archived Version 2 below still uses the four study categories.)_

---

## Version 1: Narrative (FigJam Page 1, "Story line")

One continuous flow in two parts: a short set of intro questions, then a day-in-the-life story. Each question shows a prompt line (when one exists), the question, and its choices. Unless a branch is noted, any answer advances to the next question.

### Part 1: Intro questions

Opening prompt, shown with Q0: **"Let's start with some basic questions..."**

**Q0. Do you have any experience in this field?** _(new in V3; background, unscored)_

| Choice | Role mapping | Branch |
|---|---|---|
| Yes | none | go to Q1 |
| No | none | go to Q1 |

**Q1. Are you planning on going to college?**

| Choice | Role mapping | Branch |
|---|---|---|
| Yes | none | go to Q2 |
| No | Technician | skip to Q3 |

**Q2. How long?** _(only shown if Q1 = Yes)_

| Choice | Role mapping |
|---|---|
| Little as possible (1-2 years) | none (unscored) |
| Typical (4 years) | Specialist + Integrator |
| Long as possible (4+ years) | Specialist + Integrator |
| Whatever | none (unscored) |

**Q3. What is the lowest salary you would feel satisfied with?**
Prompt shown with the question: **"Robotics roles run from about $46,000 to over $150,000."**

| Choice | Role mapping |
|---|---|
| $45,000 | Technician |
| $85,000 | Specialist + Integrator |
| $105,000+ | Specialist + Integrator |

**Q4. What would you be happy spending your day doing?**
Prompt: **"Workers in robotics do many different things throughout the day..."**

| Choice | Role |
|---|---|
| Doing hands-on work to keep things running | Technician |
| Typing on a computer | Specialist |
| Leading others | Integrator |

**Q5. What do you think will bring you the most happiness?**
Prompt: **"Okay, one last thing. What will bring you fulfillment?"**

| Choice | Role |
|---|---|
| Inspiring others | Integrator |
| Seeing something I built actually work | Technician |
| Solving difficult problems | Specialist |

Note: On the board these intro questions carried no mappings. As built (V3 intro-question scoring, D-023, three-role re-cut D-028), education (Q1 "college?" combined with Q2 "how long?") and salary (Q3) nudge the match one point each on the role tier ladder: no college (Q1 "No") / $45k (Q3) → **Technician**; 4 years / 4+ years (Q2) and $85k / $105k+ (Q3) → **Specialist + Integrator**. Q2 "Little as possible (1-2 years)" is **unscored** — it sits above HS/GED but below a Bachelor's, matching no role, which also keeps the three role ceilings equal at 11. Q0 (experience) stays unscored (routing parked for later), and Q2 "Whatever" stays unscored as a noncommittal answer. These tags are a parallel signal to the always-on education/pay fit line, kept consistent with its levels but not merged.

### Part 2: Story

Transition line before Scene 1 (shown on Scene 1's prompt): **"Alright, let's get started."**

Seven scenes walk through a school day. Every scene has **three** choices, one per role. _(As built, D-018: the user sorts **each** of the three choices into the three buckets — That's me / Kinda me / Not me — one card at a time. This corrected an earlier "pick one choice" build. The three-role re-cut, D-028, dropped each scene's old Repair choice and folded the Operate/Repair signal into the entry Technician; see the board-notes section.)_

**Scene 1.** Prompt: "Alright, let's get started. Your alarm goes off in the morning. You're getting ready for your first day of school." **How do you start the day?**

| Choice | Role |
|---|---|
| Get dressed in the outfit I planned the night before | Integrator |
| Make breakfast and help a younger sibling get ready | Technician |
| Write down a step-by-step to-do list | Specialist |

**Scene 2.** Prompt: "You arrive at school, but have some time to kill." **What do you want to check out in that time?**

| Choice | Role |
|---|---|
| Take a look at the shop class | Technician |
| Explore the computer lab | Specialist |
| Meet with my friends to make some afterschool plans | Integrator |

**Scene 3.** Prompt: "The bell rings so you head to class. Your teacher hands you a handout of all the assignments for that year." **What are you most excited for?**

| Choice | Role |
|---|---|
| Taking the lead on a group project | Integrator |
| Building a 3D model | Technician |
| Solving some difficult math problems | Specialist |

**Scene 4.** Prompt: "It's lunch time! You usually spend this time with the club you are a part of." **Where will you be?**

| Choice | Role |
|---|---|
| Shop club | Technician |
| Computer science club | Specialist |
| Debate club | Integrator |

**Scene 5.** Prompt: "You're back home after a long day of school." **What are you doing around the house?**

| Choice | Role |
|---|---|
| Coding a game | Specialist |
| Fix your bike | Technician |
| Planning the rest of my week | Integrator |

**Scene 6.** Prompt: "You have to do some homework." **Which assignment would you want to complete the most?**

| Choice | Role |
|---|---|
| Working on my presentation | Integrator |
| Make 10 posters for a club event | Technician |
| Writing code | Specialist |

**Scene 7.** Prompt: "You finally have some time to relax. You decide to play a video game." **What are you playing?**

| Choice | Role |
|---|---|
| Puzzle-solving game | Specialist |
| Strategy game | Integrator |
| Building game | Technician |

After Scene 7 the user goes to results.

---

## Version 2: Direct questions + statement sort (FigJam Page 2) — ARCHIVED (retired comparison condition)

> **Archived, not built.** This is the study's **Exam** comparison condition. The narrative won the June 2026 study, so the exam flow was deleted from the live tree in Phase 4 (D-027) and never went through the three-role collapse. The section below is preserved for the record on the **original four study categories** (Operate/Repair/Program/Plan → Operator/Technician/Specialist/Integrator). Do not treat its mappings as live.

Three parts in order: starting questions, one mapped multiple-choice question, then a statement sort.

### Part 1: Starting questions

Both answered on a No / Maybe / Yes scale. No category mapping; these gather background context (the board doesn't specify how, or whether, they affect results).

**Q1. Are you planning on pursuing higher education?** No / Maybe / Yes

**Q2. Do you have prior work experience in Robotics and/or tech?** No / Maybe / Yes

### Part 2: Technology question

**Q3. When it comes to working with technology, what do you enjoy doing the most?** (single choice)

| Choice | Category |
|---|---|
| A. Making sure the equipment runs correctly every day | Operate |
| B. Figuring out what is broken and fixing it | Repair |
| C. Building or coding how the technology works | Program |
| D. Deciding how the technology should be used in a larger system | Plan |

### Part 3: Statement sort

Thirty statements presented one after another. For each, the user answers **"That's me" or "That's not me."** Every statement maps to one category (the four columns on the board show the mapping; the user never sees them). The system tallies "That's me" answers by category to produce the result.

Statements are listed here by category for the mapping. Presentation order is not specified on the board; interleave rather than running each category as a block.

**Operate (Operator), 8 statements**

| Statement | Category |
|---|---|
| Advising/tutoring others | Operate |
| Ensuring that your team stays on track | Operate |
| Very detail-oriented when performing a task | Operate |
| Working at a production floor | Operate |
| Safety is your number one priority | Operate |
| Staying focused during repetitive tasks | Operate |
| Keeping your team on track during hands-on work | Operate |
| Watching closely for problems when observing an automated task | Operate |

**Repair (Technician), 7 statements**

| Statement | Category |
|---|---|
| Fixing a chair | Repair |
| Installing and repairing parts of a bike | Repair |
| Checking what's wrong with your car on your own | Repair |
| Optimizing performance of your PC/Laptop | Repair |
| Taking something apart to understand it | Repair |
| Building and customizing your own PC | Repair |
| Debugging code when something isn't working | Repair |

**Program (Specialist), 7 statements**

| Statement | Category |
|---|---|
| Building a cool website from scratch | Program |
| Prototyping cool things | Program |
| Testing robotic applications | Program |
| Enjoy solving technical design problems | Program |
| Keeping up to date with new software libraries and tools | Program |
| Enjoy learning different coding languages | Program |
| Tackling challenging math/logic problems | Program |

**Plan (Integrator), 8 statements**

| Statement | Category |
|---|---|
| Planning and coordinating events | Plan |
| Directing and coordinating activities of others | Plan |
| Running simulations and interpreting their results | Plan |
| Designing automation workflows | Plan |
| Working in a planning or engineering office | Plan |
| Taking on leadership roles | Plan |
| Understanding the operations & supply chain of a product you're interested in | Plan |
| Collecting and analyzing data | Plan |

After the last statement the user goes to results.

---

## Results (the live narrative; the archived exam shared the layout)

Two layers, matching the two wireframes on FigJam Page 1.

### Layer 1: Role node map (wireframe 1)

A graph of nodes. The three role nodes (Technician, Specialist, Integrator) are placed by match strength — the top-matched role sits front-and-center, the other two sit behind it and swap in on tap. The center is labeled with the centered role's recommended titles.

Tapping a role node brings it to the center; the active role's job titles branch off the front on connector lines (drawn from that role's common job titles, listed below). Tapping a job-title node opens Layer 2.

### Layer 2: Role detail sheet (wireframe 2)

A sheet opens over the map explaining the role that the title belongs to. Content per sheet: role name, description, "Add this Role to your profile" link, job activities, education, common job titles, salary, and a "How you fit" graphic (a three-axis triangle radar) showing the user's three role scores.

### Role detail content (matches `src/data/roleDetails.ts`, from RC.org's three-role cards)

These three are the live roles. The entry **Technician** is built from RC.org's Operate/Operator card (the old four-category Operate + Repair fold into it).

**Technician** (entry)

- Description: In entry-level robot operating roles, you'll be responsible for the set-up, operation, and maintenance of robots and other automation equipment.
- Job activities: Supervise and instruct robots on existing tasks. Ensure quality outputs. Teach robots new tasks. Generate data for machine learning algorithms. Load parts. Work with the team to identify and solve issues.
- Education: High school diploma or GED certificate required
- Common job titles: Robot Operator; Entry Level Robotics; Assembly Operator; Automation Technician; Robotics Maintenance Technician
- Salary: National median $45,936/yr

**Specialist** (mid)

- Description: In mid-level robotics roles, you'll design, develop, program, and implement robotic systems and technologies to enhance the efficiency, productivity, and functionality of a manufacturer.
- Job activities: Build, configure, or test robots or robotic applications. Design robotic systems and end-of-arm tooling. Supervise technologists, technicians, or other engineers. Design software to control robotic systems for applications. Evaluate robotic systems or prototypes.
- Education: Bachelor's Degree (required) or Master's Degree (sometimes preferred)
- Common job titles: Robotics Specialist; Robotics Engineer; Mechatronics Engineer; Automation Engineer; Robotic Systems Engineer
- Salary: $85,000 to $147,700/yr; national median $105,000/yr

**Integrator** (planning)

- Description: Planning roles require experts who understand robotics at the highest level. You'll create automation plans and recommend the most efficient, effective, and profitable automation work centers for your company.
- Job activities: Perform feasibility studies on the automation projects, including data analysis to understand the initial process metrics and potential improvements. Test and plan using system simulation and modeling to ensure all automation systems (conveyors, sorters, industrial robots, collaborative robots, AMR, etc.) work cohesively as one unit. Determine an automation plan and oversee the implementation and testing processes to ensure improvement goals are met.
- Education: Bachelor's Degree (required) or Master's Degree (sometimes preferred)
- Common job titles: Robotics Integrator; Robotic Integration Design Engineer; Robotics Software Integrator; Robotics Application Development Engineer; Advanced Industrial Integrator
- Salary: $87,000 to $153,000/yr; national median $99,250/yr

_(Source: `docs/reference/ARM Updated Role Structure - Source Content.md`, RC.org's live three-role cards. The archived four-category Exam read an Operate card, a separate Repair card, and the same Program/Plan content; that four-card set is the documented cut.)_

---

## Board notes and open items

- The wireframe sketch shows three job-title nodes per role; the actual title lists above run five. The board doesn't say whether to cap at three; as built, all titles show.
- _(Resolved in V3.)_ Two choices previously carried question marks on the board, meaning the team wasn't settled on them: "IT club" (Version 1, Scene 4) and "Writing code" (Version 1, Scene 6). The team settled on both. "Writing code" ships as-labeled; "IT club" was the old Repair choice in Scene 4 and was dropped in the three-role re-cut (D-028) along with each scene's Repair option.
- _(Corrected 2026-06-07, verified against the live board.)_ Page 1's two format labels, "Multiple choice" (pink) and "Drag and drop" (blue), are a **color legend**, not unattached: the intro questions are pink (multiple choice, tap-to-select) and all seven story scenes are blue (drag and drop). As built: intro questions are single-select MC. _(Revised D-018; re-cut D-028:)_ each scene is a **per-choice sort** — the user judges all three choices, sorting each into one of three buckets (drag or tap), the same structure as the archived Version 2's statement sort. This replaced the D-017 "drag your one pick into a zone" build after the team clarified the board's intent.
- _(Corrected 2026-06-07; relabeled D-018.)_ The sort uses **three** buckets — "That's me" / **"Kinda me"** / "Not me" — not two, used by the narrative scenes (and, historically, the archived Version 2 statement sort). The middle bucket reads "Kinda me" (renamed from "Maybe"). A prior user study asked for a middle option; it currently scores as a no (`MAYBE_WEIGHT = 0`, tunable). See D-017, D-018.
- Page 2 of the board also holds an earlier rough results sketch (robot character, a percentage breakdown, "Breakdowns" and "Your roles" panels). The node-map flow described above is the intended results experience.
- _As built:_ results wireframe 1 was reworked into an Obsidian-style node graph — the top-matched role sits front-and-center, the other two sit behind it and swap in on tap, and the active role's job titles branch off the front on connector lines (all titles shown, no cap at three). This replaced an earlier concentric-rings version that read as "funky" (D-017).
