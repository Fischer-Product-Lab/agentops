# AgentOps — Highlights

A concise tour of what AgentOps is, the decisions behind it, and what it demonstrates.
Part of **Fischer Product Lab** — secure AI systems for trust, risk, and enterprise execution.

**Live demo:** https://agentops-kappa.vercel.app/

---

## Overview

AgentOps is an enterprise **AI agent governance control tower**. It inventories the AI
agents running across an organization, scores each one's launch readiness with a
deterministic rubric, and makes risk impossible to ignore — so leadership can decide what
to scale, pause, or govern with evidence rather than instinct.

## The problem it solves

Enterprises are deploying AI agents faster than they can govern them — ticket triage,
release notes, support summaries, policy Q&A — each spun up by a different team, touching
different data, holding different tool permissions. Leadership rarely has a single place to
answer the questions that matter: *which agents exist, who owns them, what can they touch,
and which are actually safe to scale?* AgentOps turns that sprawl into one governed,
measurable, executive-ready view.

## What it does

- **Executive dashboard** — portfolio value, readiness mix, hours saved, and a prioritized
  "needs attention" list.
- **Risk-aware registry** — every agent with owner, team, data-access level, autonomy, and
  readiness, with high-risk attributes flagged before you even open an agent.
- **Agent detail** — purpose, data and tools, evaluation metrics, a readiness scorecard with
  a 7-criteria breakdown and stated reasons, documented failure modes, and an audit log.

## The readiness engine (the centerpiece)

Readiness is a **pure, deterministic function** — explainable and auditable, not a black box:

1. Seven weighted criteria (0–4 each) normalized to a 0–100 score.
2. Mapped to a band: Launch / Conditional / Needs Review / Do Not Launch.
3. **Hard safety gates** that a high average can never override — if data-safety or
   tool-permission risk hits the critical floor, the verdict is capped or blocked outright.

The product thesis in one line: **a strong agent that is unsafe is still unsafe**, and the
scoring encodes that judgment so it can't be averaged away. Verdicts are always computed,
never stored, so every status is a reproducible function of its inputs.

## Engineering & security highlights

- **Secure by design:** synthetic data only, read-only (no write paths or admin surface),
  zero client-side secrets, and no environment variables required in V1.
- **Documented governance:** a [PRD](./agentops-prd.md), a [STRIDE threat model](./threat-model.md),
  and a [security policy](../SECURITY.md).
- **Hardened supply chain:** Dependabot, secret scanning, CodeQL, pinned dependency
  overrides, and a branch-protected pull-request workflow on `main`.
- **Modern stack:** Next.js 16 (App Router) + React 19, TypeScript in strict mode,
  Tailwind v4, Recharts, Zod, deployed on Vercel with static generation.

## What it demonstrates

Product strategy and AI-platform thinking, security and risk judgment, deterministic and
explainable decision systems, and executive-grade communication — the ability to turn a
messy enterprise workflow into a governed, measurable product.

## Roadmap

- **V1.1 — controlled interactivity:** filter/search the registry and a live "what-if"
  rubric slider that recomputes readiness on the fly.
- **V2 — intelligence layer:** server-side, deterministic-policy-first AI assist for risk
  narratives and launch-readiness memos, fully audited and human-in-the-loop.
- **V3 — persistence:** synthetic data backed by Postgres with row-level security.
