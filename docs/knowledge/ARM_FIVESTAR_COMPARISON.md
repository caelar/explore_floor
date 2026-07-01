# ARM Fivestar Interest Quiz vs. our narrative quiz

_Snapshot 2026-07-01. Analysis of ARM's deck "Interest Quiz Update, Release 4.3" (5-7-2026) against this prototype's narrative quiz. This is a **design memo**, not the live model. The live model stays `DATA_MODEL.md` §17 (three robotics roles). The AI-roles architecture this memo points to is proposed, not built: see `AI_ROLES_INTEGRATION.md` and decision `D-034`._

Source deck: `~/Downloads/Interest Quiz Update_Release 4.3_5-7-2026.pptx` (35 slides). Full text mirrored at `docs/reference/ARM_Fivestar_Interest_Quiz_4.3.md`.

---

## 1. What ARM's Fivestar quiz is

ARM rebuilt their Interest Quiz around a **4-dimension model** that scores **six career pathways across two domains**. The whole thing is a **2×3 grid**: one domain axis crossed with three tiers.

**The domain axis (Q1, "Where"):** Physical points at the Robotics domain, Digital points at the AI domain.

**The three tiers** run entry to advanced, and each tier carries the *same* How/What/Why signature in both domains:

| Tier | Robotics domain | AI domain | Shared signature (How · What · Why) |
|---|---|---|---|
| Entry | Robotics Technician | AI Data Technician | Structured/Discrete · Building, Testing · Efficiency, Operationalize |
| Mid | Robotics Specialist | AI Implementation Specialist | Collaborative · Optimizing, Designing · Efficacy & Accuracy, Improve |
| Advanced | Robotics Integrator | AI Developer | Strategic/Big-Picture · Scaling, Automating · Innovation, Evolve |

**The instrument:** four everyday-scenario multiple-choice questions, about two minutes, no prior knowledge assumed. Each probes one dimension:
- **Q1 Where** (environment): setting up a new coffee maker, hands-on the parts vs. pull up the app/guide. Physical vs. Digital → picks the domain.
- **Q2 How** (working style): a group road trip with nobody in charge, detailed plan vs. build it together vs. pick the direction and let details sort themselves. Structured vs. Collaborative vs. Strategic → narrows the tier.
- **Q3 What** (activities): redesigning a kitchen, list every appliance and spec vs. lay it out around how you work vs. automate and connect the whole house. Building vs. Optimizing vs. Scaling → narrows the tier.
- **Q4 Why** (motivators): an older TV won't turn on, check the remote batteries vs. work every cause methodically vs. use it as a push to a whole smart-home system. Efficiency vs. Efficacy vs. Innovation → confirms the tier and breaks ties.

**The scoring:** every answer earns 2 points on its dimension; all six pathways are scored at once; max is 8 (2 × 4). The **highest-scoring single pathway wins outright**. On a tie, the **Q4 "Why" answer breaks it**, so exactly one pathway is always returned.

**The result:** one pathway name plus a 2-to-3-sentence "personal insight" narrative describing how the person thinks and works, then CTAs to explore matched training programs and jobs. The appendix maps a **competency cluster** to each of the six pathways.

---

## 2. Side-by-side with our quiz

| Dimension | ARM Fivestar (4.3) | Our narrative quiz (live) |
|---|---|---|
| Roles | 6 (Robotics ×3 + AI ×3) | 3 (Robotics only: technician / specialist / integrator) |
| Structure | 2×3 grid (domain × tier) | 3 flat tiers |
| Instrument | 4 scenario MCs (~2 min) | 6 intro MCs + 7 day-in-the-life scenes (13 steps) |
| Answer mechanic | Pick one (A/B/C) | Sort each scene's 3 choices into 3 buckets (That's me / Kinda me / Not me) |
| Framework | Where / How / What / Why dimensions | interest MCs + education + salary screeners + scene sorts |
| Result | **One** prescriptive pathway + insight narrative | **Weighted match across all roles**, ranked |
| Tie handling | Q4 "Why" cascade to one winner | none needed (no single winner; stable rank tiebreak) |
| Explore-more | CTAs to programs and jobs | 5-screen results system (cards → compare → map → constellation → job overview) |

---

## 3. Where we already line up

- **Our three tiers are ARM's three robotics tiers.** Technician / Specialist / Integrator match one-to-one, entry to advanced.
- **Our competency chips already match ARM's clusters almost verbatim.** `roleDetails.ts` for the three robotics roles lines up with ARM's slide-21 clusters (Mechanical Systems, PLC, Robot Programming, and so on). That is a good independent confirmation that our robotics content is sound.
- **Both use relatable, no-prior-knowledge scenarios** and both end by inviting the user to explore programs and jobs.

## 4. Where we deliberately diverge (and should stay diverged)

ARM returns **one** prescriptive pathway. We return a **weighted match across roles**, on purpose. That is a research-backed hard rule for us: the large "maybe" group can't picture the work and shouldn't get boxed into a single verdict, so we show them across roles with an honest read on fit and what they'd build. We keep the richer instrument (scenes plus screeners) and the multi-role result. We do **not** adopt ARM's single-winner model or its Q4 "Why" tiebreaker, because there is no single winner to break a tie for.

This divergence is the point of our prototype, so treat ARM's single-pathway result as a difference to preserve, not a gap to close.

## 5. The one thing ARM's model hands us for free

Because every tier carries the **same How/What/Why signature in both domains**, our existing three-tier scoring engine already scores the "tier" half of all six roles. The only signal we're missing is the **domain lean, physical vs. digital**, which is exactly ARM's Q1 "Where." Add that one axis and the three AI roles fall out by mirroring the tier scores into the digital domain, with no rewrite of the scoring brain and no change to the seven scenes. That is the fast path to the AI roles, spelled out in `AI_ROLES_INTEGRATION.md`.

---

## 6. The four ARM ideas we're folding in

Confirmed with Caelan (2026-07-01): adopt all four.

### 6.1 Result insight narratives
ARM's per-pathway "personal insight" copy (slides 31-32) is crisper than ours. Adopt it for the three robotics roles (into `roleDetails.description` / `whyMomentsText`) and reuse the AI-trio narratives for the three new roles. **On adoption, de-em-dash and apply our voice rules** (no em dashes, contractions, plainspoken). ARM's verbatim source copy:

| Pathway | ARM insight narrative (verbatim source) |
|---|---|
| Robotics Technician | "You like to be close to the work, literally. You think in steps, value getting things right, and find real satisfaction in keeping systems running reliably. Hands-on problem-solving is where you thrive." |
| Robotics Specialist | "You are a connector and improver. You work best when you can bring people together around a problem, analyze how a system is really performing, and redesign solutions that hit a higher standard." |
| Robotics Integrator | "You think in systems and scale. You are energized by figuring out how something works in one place and making it work everywhere, and you are drawn to what is next, not just what is now." |
| AI Data Technician | "You are detail-driven and methodical. You know that good outputs start with good inputs, and you take pride in building the clean, reliable foundations that everything else depends on." |
| AI Implementation Specialist | "You are a collaborative problem-solver who bridges the gap between what AI can do and how people actually use it. You help teams get real, measurable value out of AI systems, and you care that it is done responsibly." |
| AI Developer | "You are a builder and a visionary. You are energized by creating systems that don't just solve today's problems, they learn, adapt, and evolve. You think architecturally and you are always asking what comes next." |

_(Em dashes in ARM's originals are already normalized to commas above.)_

### 6.2 Competency clusters
Use ARM's authoritative per-pathway lists (slide 21). For robotics, spot-check ours against ARM's (they already match). For AI, drop the clusters in wholesale as the new roles' `competencies`:

- **AI Data Technician:** Data Collection, Data Verification, Data Labeling, Data Ethics, Model Test Implementation, Model Utilization, Model Calibration, AI Model Safety & Security Adherence, Data Lineage.
- **AI Implementation Specialist:** Model Ethics (Unbiased Development), Safety (Risk Assessment), Data Wrangling, Model Tuning, Model Training & Test Development, System Troubleshooting, Project Management, Data Visualization, Data Analytics, Design Structure Application.
- **AI Developer:** Advanced Math & Statistics, AI Model Development, Synthetic Data, AI Model Policies, Strategic Planning, System Architecture & Lifecycle, Advanced Data Analytics, Risk Planning & Mitigation, Model Justification & ROI.

### 6.3 Where / How / What / Why lens
Map our questions and scenes onto ARM's four dimensions to audit coverage and sharpen the "why you matched" story.

| Dimension | ARM probe | Our coverage |
|---|---|---|
| Where (domain) | Q1 physical vs. digital | **Not probed.** This is the gap the two new "Where" questions fill (and the AI-roles unlock). |
| How (working style) | Q2 structured / collaborative / strategic | Interest MCs (Q4/Q5) + the seven scenes carry working-style signal. |
| What (activities) | Q3 building / optimizing / scaling | Interest MCs + scenes (build vs. solve vs. lead). |
| Why (motivators) | Q4 efficiency / efficacy / innovation | Scenes + interest MCs. |

Takeaway: our instrument tests the **tier** dimensions (How/What/Why, blended) well, and has **no domain probe** at all. That is consistent with our robotics-only scope today, and it's exactly where the AI-roles work plugs in.

### 6.4 Everyday-analogy questions
ARM's non-manufacturing scenarios (coffee maker, road trip, kitchen, broken TV) are a clean way to read someone with zero domain knowledge, which matches our own "try it on" philosophy. Adopt this framing for the **two new "Where" questions** (physical vs. digital, told as everyday situations). Note as a later option: the interest MCs (Q4/Q5) could be reworked into the same everyday-scenario style if we want a more consistent voice across the intro.

---

## 7. What this changes right now

Nothing in the build. This pass is documentation only. The comparison and the four adopted ideas are captured here; the fast path to the AI roles is captured in `AI_ROLES_INTEGRATION.md`; the direction is logged as `D-034`. The build stays deferred and green-lit separately, given the July 21 handoff.

This memo also updates the framing in `HANDOFF_GUIDE.md` §2: that section said the AI-variant mapping "has no answer on file here." The deck **is** the answer, so the mapping (AI roles = the digital mirror of the three robotics tiers) is now on file; only the build remains ARM/Fivestar's-or-a-future-pass's to green-light.
