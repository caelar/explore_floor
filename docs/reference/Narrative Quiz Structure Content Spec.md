# Narrative Quiz Structure, Content Spec

Source: FigJam board "Narrative Quiz Structure" (figma.com/board/HP9OFVXI69y7tKaFUJP1Lz), pulled 2026-06-07.

**Purpose.** This document gives the questions, answer choices, category mappings, and flow for two versions of the Explore the Floor interest quiz. We're building both versions to test which style users prefer. This spec covers content and order only. It says nothing about visual design or implementation, and it isn't a recommendation for either.

**Light copyedits.** Sticky-note typos from the board were cleaned in transcription (spelling, apostrophes, "median in" to "median is"). No wording was otherwise changed.

---

## Shared framework

Both versions score the user across the same four interest categories, each tied to a role:

| Category | Role |
|---|---|
| Operate | Operator |
| Repair | Technician |
| Program | Specialist |
| Plan | Integrator |

Scored choices and statements tally toward one or more categories. The category totals drive the shared results experience (described at the end of this doc).

---

## Version 1: Narrative (FigJam Page 1, "Story line")

One continuous flow in two parts: a short set of intro questions, then a day-in-the-life story. Each question shows a prompt line (when one exists), the question, and its choices. Unless a branch is noted, any answer advances to the next question.

### Part 1: Intro questions

Opening prompt, shown with Q1: **"Let's start with some basic questions..."**

**Q1. Are you planning on going to college?**

| Choice | Category mapping | Branch |
|---|---|---|
| Yes | none | go to Q2 |
| No | none | skip to Q3 |

**Q2. How long?** _(only shown if Q1 = Yes)_

| Choice | Category mapping |
|---|---|
| Little as possible (1-2 years) | none |
| Typical (4 years) | none |
| Long as possible (4+ years) | none |
| Whatever | none |

**Q3. What is the lowest salary you would feel satisfied with?**
Prompt shown with the question: "Keep in mind, the median is $60,000 in the US."

| Choice | Category mapping |
|---|---|
| $40,000 | none |
| $60,000 | none |
| $80,000+ | none |

**Q4. What would you be happy spending your day doing?**
Prompt: **"Workers in robotics do many different things throughout the day..."**

| Choice | Category mapping |
|---|---|
| Doing hands-on work | Operate, Repair |
| Typing on a computer | Program |
| Leading others | Plan |

**Q5. What do you think will bring you the most happiness?**
Prompt: **"Okay, one last thing. What will bring you fulfillment?"**

| Choice | Category mapping |
|---|---|
| Inspiring others | Plan |
| Earning a lot of money | Plan |
| Feeling like I'm helping people | Operate, Repair |
| Solving difficult problems | Program |

Note: Q1-Q3 carry no category mappings on the board. They gather background context (education plans, salary expectations); the board doesn't specify how, or whether, they affect results.

### Part 2: Story

Transition line before Scene 1: **"Alright, let's get started."**

Seven scenes walk through a school day. Every scene has four choices, one per category.

**Scene 1.** Prompt: "Your alarm goes off in the morning. You're getting ready for your first day of school." **How do you start the day?**

| Choice | Category |
|---|---|
| Get dressed in the outfit I planned the night before | Plan |
| Help my parents make breakfast | Repair |
| Write down a step-by-step to-do list | Program |
| Walk my dog | Operate |

**Scene 2.** Prompt: "You arrive at school, but have some time to kill." **What do you want to check out in that time?**

| Choice | Category |
|---|---|
| Take a look at the shop class | Operate |
| Explore the computer lab | Program |
| Meet with my friends to make some afterschool plans | Plan |
| Double-check my homework | Repair |

**Scene 3.** Prompt: "The bell rings so you head to class. Your teacher hands you a handout of all the assignments for that year." **What are you most excited for?**

| Choice | Category |
|---|---|
| Taking the lead on a group project | Plan |
| Building a diorama | Operate |
| Being a tutor to a younger student | Repair |
| Solving some difficult math problems | Program |

**Scene 4.** Prompt: "It's lunch time! You usually spend this time with the club you are a part of." **Where will you be?**

| Choice | Category |
|---|---|
| Shop club | Operate |
| Computer science club | Program |
| Debate club | Plan |
| IT club | Repair |

**Scene 5.** Prompt: "You're back home after a long day of school." **What are you doing around the house?**

| Choice | Category |
|---|---|
| Coding a game | Program |
| Helping my parents with some chores | Repair |
| Playing with Legos | Operate |
| Planning the rest of my week | Plan |

**Scene 6.** Prompt: "You have to do some homework." **Which assignment would you want to complete the most?**

| Choice | Category |
|---|---|
| Working on my presentation | Plan |
| Re-do a previous assignment | Repair |
| Writing code | Program |
| Make 10 posters for a club event | Operate |

**Scene 7.** Prompt: "You finally have some time to relax. You decide to play a video game." **What are you playing?**

| Choice | Category |
|---|---|
| Puzzle-solving game like Portal or Outer Wilds | Program |
| Strategy game like Civ or TFT | Plan |
| Building game like Minecraft or Animal Crossing | Operate |
| Simulation game like Sims or Cities Skylines | Repair |

After Scene 7 the user goes to results.

---

## Version 2: Direct questions + statement sort (FigJam Page 2)

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

## Results (shared by both versions)

Two layers, matching the two wireframes on FigJam Page 1.

### Layer 1: Category node map (wireframe 1)

A map of nodes on concentric circles. The four category nodes (Operate, Repair, Program, Plan) are placed by match strength: innermost ring is most like you, outermost ring is least like you. The center is labeled "Recommended titles."

Clicking a category node spawns job-title nodes connected to it, drawn from that category's common job titles (listed below). Clicking a job-title node opens Layer 2.

### Layer 2: Role detail sheet (wireframe 2)

A sheet opens over the map explaining the category that the title belongs to. Content per sheet: role name, description, "Add this Role to your profile" link, job activities, education, common job titles, salary, and a "How you fit" graphic showing the user's four category scores.

### Role detail content (from RC.org role cards)

**Operate**

- Description: In entry-level robot operating roles, you'll be responsible for the set-up, operation, and maintenance of robots and other automation equipment.
- Job activities: Supervise and instruct robots on existing tasks. Ensure quality outputs. Teach robots new tasks. Generate data for machine learning algorithms. Load parts. Work with the team to identify and solve issues.
- Education: High school diploma or GED certificate required
- Common job titles: Robot Operator; Entry Level Robotics; Assembly Operator
- Salary: national median $40,300/yr

**Repair**

- Description: In entry-level repair roles, you'll focus on the day-to-day maintenance of robots on the manufacturing floor and collaborate with those operating the robots.
- Job activities: Install, service, maintain, troubleshoot, and repair robots and automated production systems. Maximize the efficiency of robotic systems and minimize downtime. Understand computers, electrical and electronic systems, sensor and feedback principles, and how robots work as machines.
- Education: Associate's degree or a post-secondary certificate required
- Common job titles: Automation Technician; Robotics Maintenance Technician; Mechatronics & Robotics Technician; Robotics Process Controls Technician
- Salary: range $54,000 to $78,000/yr; national median $66,000/yr

**Program**

- Description: In mid-level robotics roles, you'll design, develop, program, and implement robotic systems and technologies to enhance the efficiency, productivity, and functionality of a manufacturer.
- Job activities: Build, configure, or test robots or robotic applications. Design robotic systems and end-of-arm tooling. Supervise technologists, technicians, or other engineers. Design software to control robotic systems for applications. Evaluate robotic systems or prototypes.
- Education: Bachelor's Degree (preferred), Associate's Degree (required)
- Common job titles: Robotics Specialist; Robotics Engineer; Mechatronics Engineer; Automation Engineer; Robotic Systems Engineer
- Salary: range $86,000 to $124,000/yr; national median $105,000/yr

**Plan**

- Description: Planning roles require experts who understand robotics at the highest level. You'll create automation plans and recommend the most efficient, effective, and profitable automation work centers for your company.
- Job activities: Perform feasibility studies on the automation projects, including data analysis to understand the initial process metrics and potential improvements. Test and plan using system simulation and modeling to ensure all automation systems (conveyors, sorters, industrial robots, collaborative robots, AMR, etc.) work cohesively as one unit. Determine an automation plan and oversee the implementation and testing processes to ensure improvement goals are met.
- Education: Bachelor's Degree (required) or Master's Degree (sometimes preferred)
- Common job titles: Robotics Integrator; Robotic Integration Design Engineer; Robotics Software Integrator; Robotics Application Development Engineer; Advanced Industrial Integrator
- Salary: range $87,000 to $153,000/yr; national median $127,000/yr

---

## Board notes and open items

- The wireframe sketch shows three job-title nodes per category; the actual title lists above run three to five. The board doesn't say whether to cap at three.
- Two choices carry question marks on the board, meaning the team wasn't settled on them: "IT club" (Version 1, Scene 4) and "Writing code" (Version 1, Scene 6).
- Page 1 of the board has two unattached format labels, "Multiple choice" and "Drag and drop." They aren't assigned to anything; treat all Version 1 questions as standard single-select unless told otherwise.
- Page 2 of the board also holds an earlier rough results sketch (robot character, four-category percentage breakdown, "Breakdowns" and "Your roles" panels). The node-map flow described above is the intended results experience.
