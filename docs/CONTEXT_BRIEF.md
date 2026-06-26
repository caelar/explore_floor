# Context Brief

The compressed research story behind this build. Five-minute read. For the full methodology and underlying data, see the source documents listed at the end.

This doc exists so Claude Code (or any new collaborator) can internalize the *why* of the project without reading 200 pages of research. It captures the platform problem, the five cross-method insights that drove the design direction, and how this specific build is meant to address them.

---

## 1. TL;DR

RoboticsCareer.org has a real engagement problem: roughly 105,000 annual visitors, 3,800 registered accounts, fewer than 1,700 of those with completed competency profiles, an average session under a minute, and a return rate so low that most users never come back. The team's research found that the barrier is not lack of interest — it's lack of specificity. A large "maybe" group has not converted curiosity into intent because they cannot picture what robotics manufacturing work actually looks like or see themselves doing it. The site's current quizzes worsen this by being prescriptive, abstract, and giving users nothing memorable to leave with.

This build is the design response: a single replacement for the three weak existing tools (Explore the Floor, My Goal, Interest Quiz) that lets a high schooler discover roles through concrete, relatable choices in a day-in-the-life narrative, shows how they match real RC.org career paths, and points to specific programs to grow into them. It's a discovery experience and a conversion engine in one. _(The live product is the narrative quiz; the original robot-building, three-role-family framing is the documented cut, see `PRD.md` and `docs/knowledge/REALIGNMENT.md`. The research findings below are unchanged.)_

## 2. The platform problem

ARM's goal is to scale RC.org from roughly 100,000 to 1,000,000 annual users. The top-line growth has been real and steady (7,000 users in 2021 → 105,000 in 2025), but year-over-year growth is decelerating (235% in 2021–2022 down to 31% in 2024–2025), and the engagement metrics underneath the growth tell a less encouraging story:

- **3.6% of visitors create an account** (~3,800 of ~105,000 in 2025).
- **Fewer than half of those accounts** fill in their competency information, which is the data that powers the site's matching system.
- **Average engagement is 50 seconds per active user.** Engaged sessions per user: 0.59 (the typical visitor never completes even one session Google considers engaged).
- **Stickiness (DAU/MAU) is 3.8%.** Most users don't return.
- **The welcome landing page has a 64.8% bounce rate and 8-second average engagement.** People are arriving and leaving without going anywhere.

There is one notable positive signal: the training search page has the lowest bounce rate on the site (21.1%) and the highest engagement time (~1.5 minutes). When users get to something concrete and actionable, they engage. The funnel breaks well before that point.

The shorthand: RC.org is a search-and-leave platform when ARM wants it to be a return-and-grow platform. Most of the value (matching, programs, profile-driven recommendations) lives behind the 3.6% conversion wall.

## 3. The five insights that drove the design

These came out of a multi-method research portfolio in spring 2026: Man-on-the-Street intercepts (38 respondents), robotics competition QuickCapture survey (29 respondents), three high-school workshops (BotsIQ, Moon Area HS, SciTech), parent interviews via UserTesting (8), SME interviews (including Jessica Hammer of CMU's Center for Transformational Play), and an RC.org Discovery Survey of registered users (32 respondents).

### 3.1 Career identity forms earlier than expected

By late high school, the window for shifting how someone sees themselves in relation to a career like robotics is already narrowing. Younger audiences (middle and early high school) were measurably more open to new possibilities; older respondents (college-aged and up) had more locked-in self-concepts that resisted reframing. This is why the build targets **late-stage high school training seekers** specifically: late enough that they're making real decisions, early enough that the framing can still move them.

### 3.2 The barrier is invisibility, not negative perception

People aren't rejecting robotics manufacturing careers because they have a bad opinion of them. They're rejecting them because they don't know they exist, can't picture them, or the word "manufacturing" pattern-matches to an outdated image (grimy assembly lines, low-skill labor) that has little to do with the actual work. Representative quotes from the high school workshops:

> *"Maybe. It could be an interesting career I just don't have much experience with it."*
>
> *"Maybe, but I feel like I would want to learn more like I want to keep doing robotics I just don't know how."*
>
> *"No idea. I wasn't aware of it, and it's not something often taught in schools, so it wasn't on my horizon."*

The fix isn't more persuasion. It's more specificity — concrete, visual, "here's what this actually looks like."

### 3.3 The pipeline runs through people and hands-on experience, not platforms

Across every method, the people who ended up in robotics manufacturing got there through a teacher, a parent, a robotics club, a competition, a tour, a hands-on project. Almost never through a website. RC.org cannot replicate a robotics club. What it can do is be the next step *after* the hands-on moment: the place a curious kid lands when they wonder "could I actually do this?" If the platform makes that next step concrete and personal, it converts. If it makes the user fill out competency checkboxes, it doesn't.

### 3.4 Parents and educators are supportive but operate on stale information

Parents in interviews were positively disposed toward robotics careers and would support their kids pursuing them. But they were working from outdated mental models — the same "manufacturing means a factory floor in the 1980s" picture as their kids. They couldn't picture the work either, so they couldn't actively advocate for it. From a parent interview synthesis:

> *"Supportive, yes. But carrying the same outdated picture of what the work looks like."*

This means the design has to update mental models for adults too, even when the primary user is the kid. The "this is what robotics manufacturing actually looks like" story has to land in 30 seconds for a parent looking over a teen's shoulder.

### 3.5 There is a large "maybe" group that converts through specificity

This is the single most actionable finding and the explicit foundation of this build. Across all methods, a sizable middle group emerged that wasn't a "yes" or a "no" — they were a "maybe, but I'd need to know more." When asked what they would have needed, the answer was almost never *more persuasion*. It was *more specificity*: what does the day-to-day look like, what skills do I need, what programs exist, what's the path. The Make.md slide that captures this:

> *"The problem isn't a lack of interest, it's a lack of specificity. There's a large 'maybe' group that hasn't converted interest into career intent because they can't picture what the work actually looks like."*

The build's results screen exists to be the answer to that question, in the specific way: here are the RC.org career roles, here's how you match each, here are the concrete skills and competencies you'd build for them, here are the programs that get you there.

## 4. How this build maps to the insights

| Insight | How the build addresses it |
|---|---|
| Identity forms early | Audience is locked to late-HS training-seekers, not adult job-seekers. Tone and content tuned to that window. |
| The barrier is invisibility | The interest items are concrete activities ("Building or fixing things," "Coding or modding games") that make the work visible rather than asking about abstract competencies. |
| Pipeline runs through hands-on experience | The narrative mechanic is hands-on as a digital experience can be: you move through a day in your life and sort each choice, mimicking how you'd actually weigh real interests. _(The original robot-avatar artifact is the documented cut.)_ |
| Parents/educators have stale info | The result screen reads in plain language for any adult looking over the user's shoulder: real roles, real programs, real next steps. No jargon. |
| Maybe group converts through specificity | The compare interaction on results (your top match centered, the other categories alongside it, tap to see "how you'd match this, why you scored that way, the education and pay it asks for, programs that get you there") is the entire specificity payload as a single interactive moment. |

## 5. Where this fits in the bigger picture

The team's research synthesized a four-layer model of where intervention can happen, framed as an inverted pyramid:

- **Societal** — broad cultural awareness of robotics manufacturing as a viable path.
- **Exposure** — hands-on encounters: schools, clubs, competitions, factory tours.
- **Guidance** — mentors, parents, counselors who can advocate and direct.
- **Platform** — what RC.org is.

The platform layer is the smallest and most distal. The research consistently pointed at *exposure* as the highest-leverage layer (curriculum in schools, more hands-on programs). But ARM's product is the platform, so the platform is the lever this team has. The strategic framing is honest about that:

> The biggest gains in workforce development would come from earlier and more widespread exposure. The platform can't deliver that. What it *can* do is convert the people who already made it to the website — turn the maybe group into the yes group. That's the audience this build serves. We're not trying to fix the funnel from awareness to RC.org. We're trying to fix the funnel from RC.org to engaged user.

## 6. The theoretical anchor: Jessica Hammer and epistemic games

The SME interview with Jessica Hammer (CMU Center for Transformational Play) provided the closest thing to a design framework for what this experience is. Her concept of **epistemic games** is the theoretical foundation:

- Epistemic games let players take on a professional identity without committing to it. The player is "trying it on."
- Games allow for "half-real" decisions, ones with stakes inside the experience but no real-world consequence. This makes them safe places to explore.
- Crucially, the act of role-play in an epistemic game changes how the player thinks about that profession afterward, even if they don't pursue it. The frame shifts.

This experience is, deliberately, a small epistemic game. The user is invited to *try on* the role of someone who works in robotics manufacturing, by moving through a day in their life and sorting how each moment fits, and through a result that says "here's who you could be in this world, here's how to get there." It is half-real on purpose. The stakes are inside the experience. The shift in framing afterward is the actual product.

## 7. Source material

For the full research, see (in `/docs/research/` or the project knowledge):

- **Mid-Semester Readout Findings** — the consolidated cross-method synthesis.
- **Client Data Analysis Report** — the engagement-numbers analysis. The platform-side numbers in section 2 of this brief come from here.
- **User Research Context Analysis** — the foundational scoping document.
- **Man on the Street Findings** — early-stage intercept research, 38 respondents.
- **Robotics Competition Findings** — competition-attendee QuickCapture, 29 respondents.
- **Workshop Findings** — three high school workshops (BotsIQ, Moon Area HS, SciTech). The quotes in section 3.2 come from here.
- **Parent Findings** — UserTesting parent interviews. The quote in section 3.4 comes from here.
- **SME Interview Findings** — including the Jessica Hammer interview that anchors section 6.
- **Robotics Career Findings** — the RC.org Discovery Survey of registered users, 32 respondents.
- **Mid-Semester Competitive Analysis** — peer platform analysis.
- **Analogous Domain Report** — adjacent-industry analysis.
- **Overarching Research Goals** — the framing doc.

The cross-method synthesis is what produced the five insights. No single method drove any of them in isolation; the strength of the findings is that they triangulated across qualitative interviews, structured surveys, observational workshops, and SME consultations.

## 8. What this brief is NOT

- It is not a research methodology defense. Each method has its limits, documented in the underlying reports. Trust the conclusions to the extent the source docs warrant.
- It is not a substitute for reading the underlying reports when nuance matters. This is a working summary for build context, not a research artifact.
- It does not capture every interesting finding. It captures the ones that drove the design direction. Other findings (parents' specific concerns about pay and stability, geographic patterns in workshop responses, the survey's age-skew toward already-employed adults) are in the source docs and may inform later iterations.

The job of this brief is to make sure the build stays anchored in why it exists, especially when small product decisions arise that could pull the design away from the research foundation. When in doubt: it's about specificity, the maybe group, late-HS training-seekers, and the platform-conversion layer.
