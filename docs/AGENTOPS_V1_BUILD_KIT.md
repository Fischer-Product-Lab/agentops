# AgentOps V1 — Build Kit

**What this file is:** the complete spec for AgentOps V1 *plus* the exact prompts to paste into your AI coding tool (Cursor or Claude Code). It is written to be read by a machine as much as by you.

**How to use it:**
1. After you create your project (Phase 1 in the playbook), drop this file into the repo at `docs/AGENTOPS_V1_BUILD_KIT.md`.
2. Open the project in Cursor or Claude Code.
3. Work through the prompts in Section 7 **one at a time**. Run the app and look at it after each one. Commit after each one.
4. Never accept code you can't explain out loud. If the tool builds something you don't understand, ask it to explain before moving on. This is the whole point — you're building a thing you can defend in an interview.

---

## 1. What AgentOps V1 is (in one paragraph)

AgentOps is an **enterprise AI agent governance control tower**. Companies are deploying AI agents everywhere (ticket triage, release notes, support summaries) and leadership has no single place to answer: *which agents exist, who owns them, what data they touch, are they any good, and should they ship?* AgentOps inventories every agent, scores its risk, shows its evaluation metrics, and gives each one a **launch-readiness recommendation** — Launch, Conditional, Needs Review, or Do Not Launch.

## 2. V1 guardrails (non-negotiable)

- **Read-only.** No buttons that change data. No forms that submit. The public demo only displays.
- **Synthetic data only.** No real employer, customer, or personal data. Ever.
- **No AI calls in V1.** The readiness score is **deterministic** (plain rules and math). This is a feature, not a limitation — it's what makes the system explainable and auditable. AI gets added later, after the workflow is solid.
- **No secrets in the browser.** Nothing sensitive in client-side code.

## 3. Scope: 3 screens (that's it for V1)

| Route | Screen | Job |
|---|---|---|
| `/` | **Executive Dashboard** | Portfolio at a glance: how many agents, by readiness status, total estimated hours saved, agents that need attention, two charts. |
| `/registry` | **Agent Registry** | A sortable table of every agent: name, owner, use case, model, data access, risk, status, value. |
| `/registry/[id]` | **Agent Detail** | One agent in full: purpose, data + tools, evaluation scores, the readiness scorecard (with the 7-criteria breakdown), failure modes, and an audit log. |

## 4. Data model

Use these TypeScript types. Keep all data in `data/agents.ts` as a typed array.

```ts
export type DataAccessLevel = "Public" | "Internal" | "Confidential" | "Customer/Regulated";
export type Autonomy = "Read-only" | "Suggest" | "Write-with-approval" | "Autonomous-write";
export type ReadinessStatus = "Launch" | "Conditional" | "Needs Review" | "Do Not Launch";
export type ValueTier = "Low" | "Medium" | "High";

export interface Evals {
  accuracyPct: number;        // 0–100
  hallucinationPct: number;   // 0–100 (lower is better)
  escalationPct: number;      // 0–100
  latencyMs: number;
  costPerTaskUsd: number;
  satisfactionPct: number;    // 0–100
}

// The 7 rubric criteria, each scored 0–4 by the reviewer (synthetic for V1).
export interface RubricScores {
  businessValue: number;        // 0–4
  useCaseClarity: number;       // 0–4
  dataSafety: number;           // 0–4
  toolPermissionRisk: number;   // 0–4 (higher = safer / lower blast radius)
  evaluationQuality: number;    // 0–4
  humanReviewCoverage: number;  // 0–4
  auditability: number;         // 0–4
}

export interface AuditEvent {
  timestamp: string;   // ISO date
  actor: string;       // person or system
  event: string;       // what happened
}

export interface Agent {
  id: string;                  // e.g. "agt-001"
  name: string;
  ownerName: string;
  ownerTeam: string;
  useCase: string;             // one sentence
  model: string;               // e.g. "GPT-5.5", "Claude Opus 4.x", "internal-llama-3"
  dataAccess: DataAccessLevel;
  connectedTools: string[];    // e.g. ["Jira", "Confluence"]
  autonomy: Autonomy;
  estHoursSavedPerMonth: number;
  valueTier: ValueTier;
  evals: Evals;
  rubric: RubricScores;
  failureModes: string[];
  auditLog: AuditEvent[];
}
```

## 5. Launch-readiness rubric (the centerpiece — build this as a pure function)

This is the most important piece of the product and the thing you'll talk about most in interviews. It must be **deterministic** — same input always gives same output, no AI involved.

Put it in `lib/readiness.ts`.

**Step 1 — weighted score.** Each criterion is scored 0–4. Weights:

| Criterion | Weight |
|---|---|
| Business Value | 1.0 |
| Use Case Clarity | 1.0 |
| Data Safety | 2.0 |
| Tool Permission Risk | 2.0 |
| Evaluation Quality | 1.5 |
| Human Review Coverage | 1.5 |
| Auditability | 1.0 |

Weights sum to 10, so max raw score = 10 × 4 = **40**. Normalize: `score = round(raw / 40 * 100)` → a 0–100 number.

**Step 2 — bands:**

| Score | Status |
|---|---|
| 80–100 | Launch |
| 60–79 | Conditional |
| 40–59 | Needs Review |
| 0–39 | Do Not Launch |

**Step 3 — hard safety gates (this is the part that impresses people).** A high average must never override a critical safety floor. After computing the band:

- If `dataSafety <= 1` **or** `toolPermissionRisk <= 1`, the status can be **no better than "Needs Review"**, regardless of the numeric score.
- If `dataSafety <= 1` **and** `toolPermissionRisk <= 1`, the status is forced to **"Do Not Launch"**.

The function should return the score, the band-based status, the final gated status, and a short list of `reasons` (e.g. `"Capped at Needs Review: autonomous write capability with weak approval controls"`). The detail screen displays those reasons.

```ts
export interface ReadinessResult {
  score: number;            // 0–100
  bandStatus: ReadinessStatus;   // before gates
  status: ReadinessStatus;       // after gates (this is the one you display)
  reasons: string[];
}

export function computeReadiness(r: RubricScores): ReadinessResult { /* implement the 3 steps above */ }
```

## 6. Synthetic agents (use these 8 — they are pre-scored and consistent)

These span the full spectrum so the demo shows the rubric doing real work. Computed status shown for verification.

| id | Name | Model | Data | Autonomy | Rubric (BV,UCC,DS,TR,EQ,HR,Aud) | → Status |
|---|---|---|---|---|---|---|
| agt-001 | Jira Triage Bot | GPT-5.5 | Internal | Suggest | 3,4,4,4,4,4,4 | **Launch** (98) |
| agt-002 | Release Notes Drafter | Claude Opus 4.x | Internal | Suggest | 3,4,4,4,3,3,3 | **Launch** (88) |
| agt-003 | Support Ticket Summarizer | GPT-5.5 | Customer/Regulated | Read-only | 4,4,4,4,2,2,3 | **Conditional** (73) |
| agt-004 | Security Policy Q&A Bot | internal-llama-3 | Confidential | Read-only | 3,4,3,4,3,3,3 | **Launch** (83) |
| agt-005 | Customer Auto-Responder | GPT-5.5 | Customer/Regulated | Autonomous-write | 3,3,1,0,2,0,2 | **Do Not Launch** (33, both gates tripped) |
| agt-006 | Invoice Reconciliation Agent | Claude Opus 4.x | Confidential | Write-with-approval | 4,3,2,2,3,4,4 | **Conditional** (74) |
| agt-007 | Code Review Assistant | GPT-5.5 | Internal | Suggest | 3,4,3,3,4,3,3 | **Conditional** (79) |
| agt-008 | HR Onboarding Agent | internal-llama-3 | Customer/Regulated | Write-with-approval | 3,3,2,2,2,2,3 | **Needs Review** (58) |

Tell your AI tool: keep these rubric scores and computed statuses exactly; invent realistic values for the other fields (owner, team, useCase, connectedTools, evals, estHoursSavedPerMonth, valueTier, failureModes, 3–5 auditLog entries each). The `computeReadiness` function applied to the rubric scores above must reproduce the status shown.

## 7. Build prompts — paste these into Cursor / Claude Code, one at a time

Each assumes this file is in the repo so the tool can read it.

**Prompt A — Theme / design system**
> Read `docs/AGENTOPS_V1_BUILD_KIT.md`. Set up a premium dark design system using Tailwind CSS variables: near-black navy background (#0b0f17), ivory text (#f5efe1), one restrained gold accent (#c9a45c), plus a calm blue (#9cc9ff) for data. Use Fraunces for headings and Hanken Grotesk for body via next/font. Build a shared app shell: left sidebar nav (Dashboard, Registry), a top bar with a clearly visible "Synthetic demo data" badge, and a content area. Make it responsive. No real data yet.

**Prompt B — Data + readiness function**
> Using the types in Section 4, create `data/agents.ts` with the 8 agents from Section 6. Fill in realistic values for the unspecified fields but keep the rubric scores exactly as listed. Then implement `lib/readiness.ts` exactly per Section 5, including the weighted score, the bands, and the two hard safety gates with human-readable `reasons`. Add a tiny test file that asserts each of the 8 agents resolves to the status shown in the table.

**Prompt C — Registry screen**
> Build `/registry` as a read-only table of all agents: name, owner, model, data access, autonomy, readiness status (as a colored badge — green Launch, gold Conditional, orange Needs Review, red Do Not Launch), and estimated hours saved. Make rows sortable and clickable, linking to `/registry/[id]`. No edit controls.

**Prompt D — Agent detail screen**
> Build `/registry/[id]`. Show the agent's purpose, owner/team, model, connected tools, data access, and autonomy. Add an Evaluation panel (accuracy, hallucination, escalation, latency, cost/task, satisfaction) using small Recharts visuals. Add a Launch-Readiness scorecard: the 0–100 score, the final gated status badge, the 7 criteria as a labeled bar breakdown, and the `reasons` list. Show failure modes and a read-only audit log table.

**Prompt E — Executive dashboard**
> Build `/` as the executive overview: total agents, a count by readiness status, total estimated hours saved per month, and a short "Needs attention" list (every agent that is Needs Review or Do Not Launch, with a one-line reason). Add two Recharts: a donut of agents by status and a bar of hours saved by team. Keep it calm and scannable.

**Prompt F — Docs + security**
> Create `README.md` (what AgentOps is, the synthetic-data/read-only posture, how to run it), `SECURITY.md` (synthetic data only, no client secrets, read-only demo, dependency scanning), and `docs/threat-model.md` (a STRIDE table for this read-only demo). Turn on TypeScript strict mode. Then tell me the exact clicks to enable Dependabot, secret scanning, and CodeQL in GitHub repo settings.

**Prompt G — Deploy**
> Walk me through deploying this to Vercel from my GitHub repo, step by step, confirming there are no environment variables needed for V1 and that the production branch is `main`. Then give me the live URL checklist to confirm the demo is read-only and shows the synthetic-data badge.

## 8. Definition of done for AgentOps V1

In three minutes you can open the live URL and show: the dashboard → the registry → click an agent → its evals and readiness scorecard → point to the Do-Not-Launch agent and explain *why the gate tripped* → the audit log → the threat model. If you can narrate that, V1 is done and the resume bullet is earned.
