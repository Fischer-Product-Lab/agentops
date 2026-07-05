# AgentOps — Product Requirements Document (V1)

**Product:** AgentOps — enterprise AI agent governance control tower
**Author:** Trevor Fischer · Fischer Product Lab
**Status:** V1 shipped (read-only, synthetic demo) · [Live](https://agentops-fpl.vercel.app/)
**Last updated:** 2026-06

---

## 1. Problem

Enterprises are deploying AI agents faster than they can govern them — ticket triage,
release notes, support summarization, policy Q&A, security workflows. Each is spun up by
a different team, touches different data, and holds different tool permissions. Leadership
has **no single source of truth** to answer the questions that actually matter:

- Which agents exist, and who owns them?
- What data and tools can each one touch?
- Are they accurate, and are they actually saving time?
- Which ones are safe to scale, and which are a risk waiting to happen?

The result is **agent sprawl without governance**: real operational value mixed with
unmanaged risk, and no defensible, repeatable way to decide what ships.

## 2. Users

| User | What they need from AgentOps |
| --- | --- |
| **CISO / Security leadership** | Portfolio-wide risk view; confidence that high-risk agents can't quietly ship. |
| **AI / Platform PM** | A consistent readiness bar; evidence to scale, pause, or govern each agent. |
| **Agent owner (eng/ops)** | A clear rubric and explicit reasons for their agent's verdict. |
| **Risk / GRC / Privacy** | Data-access and tool-permission visibility; an audit trail per agent. |
| **Executives** | A one-glance answer to "how much value, how much risk, where's the attention?" |

## 3. Goals

- Inventory every agent with owner, data access, tools, autonomy, and business value.
- Score launch readiness with a **deterministic, explainable** rubric — not a black box.
- Enforce **hard safety gates** so a high average can never override a critical risk.
- Surface portfolio-level metrics (value, readiness mix, where attention is needed).
- Demonstrate mature security posture: synthetic data, read-only, documented threat model.

## 4. Non-goals (V1)

- No live AI/model calls (readiness is pure rules + math — by design).
- No write actions, approvals, or admin surface — the demo only displays.
- No authentication, multi-tenancy, or real data integrations.
- No real customer, employer, or personal data anywhere.

## 5. User stories

- *As a CISO,* I can open one dashboard and see how many agents are cleared to launch vs.
  need attention, so I know where to focus.
- *As an AI PM,* I can open an agent and see its 0–100 readiness score **with the reasons**,
  so the verdict is defensible.
- *As a risk reviewer,* I can see that any agent with a critical data-safety or
  tool-permission score is automatically capped or blocked, regardless of its average.
- *As an agent owner,* I can see the 7 rubric criteria and where I lost points, so I know
  exactly what to fix to reach Launch.

## 6. Functional requirements

1. **Agent Registry (`/registry`)** — sortable, risk-aware table of all agents (owner,
   team, data access, autonomy, readiness, value). Risk-elevated cells are visually flagged.
2. **Agent Detail (`/registry/[id]`)** — purpose, data/tools, evaluation metrics, the
   readiness scorecard (score ring + 7-criteria breakdown + reasons), failure modes, audit log.
3. **Executive Dashboard (`/`)** — totals, hours saved, readiness mix (donut), hours saved
   by team (bar), and a prioritized "needs attention" list.
4. **Readiness engine (`lib/readiness.ts`)** — pure function: weighted score → band →
   hard safety gates → human-readable reasons. Verdicts are **computed, never stored**.

## 7. The readiness rubric (the centerpiece)

Seven criteria, scored 0–4, weighted and normalized to 0–100:

`Business Value · Use-Case Clarity · Data Safety · Tool Permission Risk · Evaluation Quality · Human Review Coverage · Auditability`

- **Bands:** 80+ Launch · 60–79 Conditional · 40–59 Needs Review · <40 Do Not Launch.
- **Hard safety gates (cannot be averaged away):**
  - Data Safety **or** Tool Permission Risk ≤ 1 → capped at **Needs Review**.
  - **Both** ≤ 1 → forced to **Do Not Launch**.

This is the core product thesis: **a strong agent that is unsafe is still unsafe.** The
gates encode that judgment so the score can't be gamed by a high average.

## 8. Risk requirements (security by design)

| Risk | Control |
| --- | --- |
| Sensitive data exposure | Synthetic data only; no real data in repo or demo. |
| Unauthorized mutation | Read-only; no write endpoints, forms, or admin surface. |
| Unexplainable AI verdicts | Deterministic engine; every status traces to inputs + reasons. |
| Secret leakage | No client-side secrets; zero env vars required in V1. |
| Supply-chain risk | Dependabot, Secret Scanning, CodeQL, pinned dependency overrides. |

Full posture in [`SECURITY.md`](../SECURITY.md); STRIDE analysis in [`threat-model.md`](./threat-model.md).

## 9. Success metrics

- **Product (demonstrated in-app):** hours saved/month, % cleared to launch, # needs attention.
- **Portfolio (for the job search):** a recruiter can grasp the value in <60s on the
  dashboard; the readiness logic survives a "how does this score work?" interview question.

## 10. Launch plan

- **V1 (done):** read-only synthetic demo on Vercel, auto-deploy from `main`, hardened repo.

## 11. Roadmap

- **V1.1 — controlled interactivity:** filter/search the registry; "what-if" rubric slider
  that recomputes readiness live (still no persistence).
- **V2 — Hermes layer:** server-side, deterministic-policy-first AI assist for risk
  narratives and launch-readiness memos; fully audited, human-in-the-loop.
- **V3 — persistence:** move synthetic data to Supabase with RLS and read-only policies.
