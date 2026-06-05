# AgentOps — 3-Minute Demo Script

A tight, repeatable walkthrough for interviews, recruiter calls, and portfolio reviews.
**Live demo:** https://agentops-kappa.vercel.app/

> Goal: in three minutes, prove product judgment, security judgment, and executive
> communication. Lead with the *problem*, show the *decision*, end on the *governance*.

---

## 0. One-line setup (10s)

> "Enterprises are deploying AI agents faster than they can govern them. AgentOps is a
> control tower that inventories every agent, scores its launch readiness with a
> deterministic rubric, and makes the risk impossible to ignore. Everything here is
> synthetic — it's a read-only demo."

## 1. Executive dashboard — the portfolio at a glance (30s)

*Land on `/`.*
> "This is the executive view. Eight agents, ~975 hours saved a month, three cleared to
> launch, two needing attention. Leadership gets value and risk in one screen."

*Point at the readiness donut and the 'needs attention' list.*
> "The mix of Launch / Conditional / Needs Review / Do Not Launch, and a prioritized list
> of what's blocking — each with a one-line reason."

## 2. The registry — inventory with risk built in (25s)

*Click **Registry**.*
> "Every agent with its owner, team, data-access level, autonomy, and readiness. It's
> sortable, and the high-risk cells — confidential data, write-capable autonomy — are
> flagged visually, so risk surfaces before you even open an agent."

## 3. A blocked agent — the safety gate in action (45s) ← the key beat

*Open **Customer Auto-Responder** (Do Not Launch).*
> "This one has a respectable overall profile, but it's forced to **Do Not Launch**. Here's
> why: both Data Safety and Tool Permission Risk are at or below the critical floor."

*Point at the reasons under the score ring.*
> "That's the core idea — **a strong average can never override a critical safety risk.**
> The engine applies hard gates: one critical score caps an agent at Needs Review; two
> force Do Not Launch. The verdict isn't a vibe, it's a rule with a stated reason."

## 4. The rubric breakdown — explainability (25s)

*Scroll to the 7-criteria breakdown.*
> "Seven weighted criteria, zero to four each — business value, use-case clarity, data
> safety, tool permission risk, eval quality, human review coverage, auditability. An owner
> can see exactly where they lost points and what to fix to reach Launch."

## 5. Evaluation + audit — does it work, and can we prove it (20s)

*Point at eval gauges, then the audit log.*
> "Accuracy, hallucination rate, escalation, latency, cost per task — the performance side.
> And every agent has an audit trail. Decisions are recorded, not assumed."

## 6. Close on governance (15s)

> "No AI calls — the scoring is deterministic, so it's explainable and auditable. Synthetic
> data, read-only, no client-side secrets. The repo has a threat model, a PRD, and GitHub
> hardening — Dependabot, secret scanning, CodeQL, branch protection. I built it like I was
> already the PM responsible for shipping it safely."

---

## Anticipated questions

- **"How is the score calculated?"** → Weighted sum of 7 rubric scores, normalized to
  0–100, mapped to a band, then two hard safety gates override the band if a critical floor
  is breached. Pure function in `lib/readiness.ts`, covered by tests.
- **"Why no AI in an *AI* governance tool?"** → Deliberate. V1's job is the governance
  *framework* — explainable and auditable. AI assist (the Hermes layer) is V2: deterministic
  policy first, model second, behind a server-side, audited, human-in-the-loop boundary.
- **"What would you build next?"** → Controlled interactivity (a live what-if rubric
  slider), then the Hermes AI layer for risk narratives, then Supabase persistence with RLS.
- **"How is this secure?"** → Synthetic-only, read-only, zero env vars, no client secrets,
  STRIDE threat model, and supply-chain scanning. Security posture is a feature, not a footnote.
