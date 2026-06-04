import type { Agent } from "@/lib/types";

/**
 * Synthetic agent portfolio for AgentOps V1.
 *
 * SYNTHETIC DATA ONLY — every name, team, metric, and log entry below is
 * invented for demonstration. No real employer, customer, or personal data.
 *
 * The 7 rubric scores per agent are fixed (per the build kit). All readiness
 * statuses are *computed* from these scores by lib/readiness.ts — never stored —
 * so the verdict is always a pure, auditable function of the rubric.
 */
export const agents: Agent[] = [
  {
    id: "agt-001",
    name: "Jira Triage Bot",
    ownerName: "Priya Nair",
    ownerTeam: "Platform Engineering",
    useCase:
      "Auto-classifies incoming Jira tickets and routes them to the right squad and priority.",
    model: "GPT-5.5",
    dataAccess: "Internal",
    connectedTools: ["Jira", "Slack"],
    autonomy: "Suggest",
    estHoursSavedPerMonth: 160,
    valueTier: "High",
    evals: {
      accuracyPct: 94,
      hallucinationPct: 2,
      escalationPct: 6,
      latencyMs: 1200,
      costPerTaskUsd: 0.02,
      satisfactionPct: 88,
    },
    rubric: {
      businessValue: 3,
      useCaseClarity: 4,
      dataSafety: 4,
      toolPermissionRisk: 4,
      evaluationQuality: 4,
      humanReviewCoverage: 4,
      auditability: 4,
    },
    failureModes: [
      "Occasionally mis-routes ambiguous tickets to the wrong squad.",
      "May under-prioritize tickets that lack clear severity language.",
    ],
    auditLog: [
      { timestamp: "2026-01-14T09:12:00Z", actor: "Priya Nair", event: "Agent registered and scoped to read-only Jira project access." },
      { timestamp: "2026-02-03T15:40:00Z", actor: "Eval Pipeline", event: "Evaluation run completed: 94% routing accuracy across 500 tickets." },
      { timestamp: "2026-03-19T11:05:00Z", actor: "Security Review", event: "Data-access review passed; no confidential scopes requested." },
      { timestamp: "2026-04-22T08:30:00Z", actor: "Priya Nair", event: "Promoted to Suggest mode with human acceptance of routing." },
    ],
  },
  {
    id: "agt-002",
    name: "Release Notes Drafter",
    ownerName: "Marcus Lee",
    ownerTeam: "Developer Experience",
    useCase:
      "Drafts customer-facing release notes from merged pull requests and changelogs.",
    model: "Claude Opus 4.x",
    dataAccess: "Internal",
    connectedTools: ["GitHub", "Confluence"],
    autonomy: "Suggest",
    estHoursSavedPerMonth: 90,
    valueTier: "High",
    evals: {
      accuracyPct: 90,
      hallucinationPct: 4,
      escalationPct: 10,
      latencyMs: 3400,
      costPerTaskUsd: 0.08,
      satisfactionPct: 85,
    },
    rubric: {
      businessValue: 3,
      useCaseClarity: 4,
      dataSafety: 4,
      toolPermissionRisk: 4,
      evaluationQuality: 3,
      humanReviewCoverage: 3,
      auditability: 3,
    },
    failureModes: [
      "Can overstate the scope of minor changes.",
      "Sometimes includes internal ticket IDs that need stripping before publication.",
    ],
    auditLog: [
      { timestamp: "2026-01-28T10:00:00Z", actor: "Marcus Lee", event: "Agent registered against GitHub release branches." },
      { timestamp: "2026-02-20T13:22:00Z", actor: "Eval Pipeline", event: "Evaluation run completed: 90% factual alignment with changelog." },
      { timestamp: "2026-03-30T16:45:00Z", actor: "Docs Lead", event: "Approved drafts now require one editor sign-off before publish." },
    ],
  },
  {
    id: "agt-003",
    name: "Support Ticket Summarizer",
    ownerName: "Dana Whitfield",
    ownerTeam: "Customer Support",
    useCase:
      "Summarizes long customer support threads into a structured handoff brief for agents.",
    model: "GPT-5.5",
    dataAccess: "Customer/Regulated",
    connectedTools: ["Zendesk", "Slack"],
    autonomy: "Read-only",
    estHoursSavedPerMonth: 120,
    valueTier: "High",
    evals: {
      accuracyPct: 89,
      hallucinationPct: 5,
      escalationPct: 12,
      latencyMs: 1800,
      costPerTaskUsd: 0.03,
      satisfactionPct: 82,
    },
    rubric: {
      businessValue: 4,
      useCaseClarity: 4,
      dataSafety: 4,
      toolPermissionRisk: 4,
      evaluationQuality: 2,
      // Corrected 2 -> 1 to match the documented failure mode below: human
      // review only spot-checks a sample, which is "minimal" (1), not "partial"
      // (2). This reconciles the rubric with the agent's described posture and
      // yields the intended Conditional verdict (79) from the deterministic engine.
      humanReviewCoverage: 1,
      auditability: 3,
    },
    failureModes: [
      "May omit nuance in emotionally charged threads.",
      "Limited evaluation coverage on multi-language tickets.",
      "Human review currently spot-checks only a sample of summaries.",
    ],
    auditLog: [
      { timestamp: "2026-02-05T08:50:00Z", actor: "Dana Whitfield", event: "Agent registered with read-only Zendesk scope." },
      { timestamp: "2026-02-26T14:10:00Z", actor: "Privacy Review", event: "Customer-data handling reviewed; PII redaction confirmed in summaries." },
      { timestamp: "2026-04-02T09:35:00Z", actor: "Eval Pipeline", event: "Evaluation flagged limited coverage on non-English threads." },
    ],
  },
  {
    id: "agt-004",
    name: "Security Policy Q&A Bot",
    ownerName: "Sofia Alvarez",
    ownerTeam: "Information Security",
    useCase:
      "Answers employee questions about internal security policies from approved documentation.",
    model: "internal-llama-3",
    dataAccess: "Confidential",
    connectedTools: ["Confluence", "SharePoint"],
    autonomy: "Read-only",
    estHoursSavedPerMonth: 70,
    valueTier: "Medium",
    evals: {
      accuracyPct: 91,
      hallucinationPct: 3,
      escalationPct: 8,
      latencyMs: 900,
      costPerTaskUsd: 0.01,
      satisfactionPct: 87,
    },
    rubric: {
      businessValue: 3,
      useCaseClarity: 4,
      dataSafety: 3,
      toolPermissionRisk: 4,
      evaluationQuality: 3,
      humanReviewCoverage: 3,
      auditability: 3,
    },
    failureModes: [
      "Can cite outdated policy versions if the source index lags.",
      "Defers inconsistently on out-of-scope legal questions.",
    ],
    auditLog: [
      { timestamp: "2026-01-09T11:20:00Z", actor: "Sofia Alvarez", event: "Agent registered on the internal model with confidential doc access." },
      { timestamp: "2026-02-12T10:05:00Z", actor: "Security Review", event: "Source corpus restricted to approved, current policy set." },
      { timestamp: "2026-03-25T15:55:00Z", actor: "Eval Pipeline", event: "Evaluation run completed: 91% answer accuracy with citations." },
    ],
  },
  {
    id: "agt-005",
    name: "Customer Auto-Responder",
    ownerName: "Raj Patel",
    ownerTeam: "Customer Support",
    useCase:
      "Automatically writes and sends responses to inbound customer emails without human review.",
    model: "GPT-5.5",
    dataAccess: "Customer/Regulated",
    connectedTools: ["Gmail", "Zendesk", "Stripe"],
    autonomy: "Autonomous-write",
    estHoursSavedPerMonth: 200,
    valueTier: "High",
    evals: {
      accuracyPct: 76,
      hallucinationPct: 14,
      escalationPct: 3,
      latencyMs: 2200,
      costPerTaskUsd: 0.05,
      satisfactionPct: 64,
    },
    rubric: {
      businessValue: 3,
      useCaseClarity: 3,
      dataSafety: 1,
      toolPermissionRisk: 0,
      evaluationQuality: 2,
      humanReviewCoverage: 0,
      auditability: 2,
    },
    failureModes: [
      "Sends customer-facing commitments with no human approval.",
      "Holds broad write access to billing tooling (Stripe).",
      "High hallucination rate on edge-case billing questions.",
      "No audit gate or hold step before messages are sent.",
    ],
    auditLog: [
      { timestamp: "2026-03-01T07:45:00Z", actor: "Raj Patel", event: "Agent registered requesting autonomous send + billing write scopes." },
      { timestamp: "2026-03-02T09:10:00Z", actor: "Security Review", event: "Flagged: autonomous write to customer + billing systems without approval gate." },
      { timestamp: "2026-03-04T16:20:00Z", actor: "Privacy Review", event: "Flagged: regulated customer data reachable with no redaction or hold." },
      { timestamp: "2026-03-05T12:00:00Z", actor: "Governance Board", event: "Launch blocked pending least-privilege scopes and human-in-the-loop controls." },
    ],
  },
  {
    id: "agt-006",
    name: "Invoice Reconciliation Agent",
    ownerName: "Helen Cho",
    ownerTeam: "Finance Operations",
    useCase:
      "Matches incoming invoices to purchase orders and proposes reconciliations for approver sign-off.",
    model: "Claude Opus 4.x",
    dataAccess: "Confidential",
    connectedTools: ["NetSuite", "SAP"],
    autonomy: "Write-with-approval",
    estHoursSavedPerMonth: 140,
    valueTier: "High",
    evals: {
      accuracyPct: 88,
      hallucinationPct: 6,
      escalationPct: 15,
      latencyMs: 2600,
      costPerTaskUsd: 0.06,
      satisfactionPct: 80,
    },
    rubric: {
      businessValue: 4,
      useCaseClarity: 3,
      dataSafety: 2,
      toolPermissionRisk: 2,
      evaluationQuality: 3,
      humanReviewCoverage: 4,
      auditability: 4,
    },
    failureModes: [
      "Marginal data-safety posture for confidential financial records.",
      "Tool permissions are broader than strictly required for matching.",
    ],
    auditLog: [
      { timestamp: "2026-02-10T09:00:00Z", actor: "Helen Cho", event: "Agent registered with write-with-approval scope in NetSuite." },
      { timestamp: "2026-03-08T14:30:00Z", actor: "Eval Pipeline", event: "Evaluation run completed: 88% match accuracy; every write requires approval." },
      { timestamp: "2026-04-01T10:15:00Z", actor: "Security Review", event: "Recommended scope reduction on SAP connector before scaling." },
    ],
  },
  {
    id: "agt-007",
    name: "Code Review Assistant",
    ownerName: "Tom Becker",
    ownerTeam: "Developer Experience",
    useCase:
      "Reviews pull requests for style, common bugs, and missing tests, leaving suggested comments.",
    model: "GPT-5.5",
    dataAccess: "Internal",
    connectedTools: ["GitHub"],
    autonomy: "Suggest",
    estHoursSavedPerMonth: 110,
    valueTier: "Medium",
    evals: {
      accuracyPct: 87,
      hallucinationPct: 7,
      escalationPct: 9,
      latencyMs: 3000,
      costPerTaskUsd: 0.07,
      satisfactionPct: 83,
    },
    rubric: {
      businessValue: 3,
      useCaseClarity: 4,
      dataSafety: 3,
      toolPermissionRisk: 3,
      // Corrected 4 -> 3: top marks for evaluation quality contradicted the
      // documented failure mode below (misses security-relevant issues). A 3
      // reflects that real coverage gap and yields the intended Conditional
      // verdict (78) from the deterministic engine.
      evaluationQuality: 3,
      humanReviewCoverage: 3,
      auditability: 3,
    },
    failureModes: [
      "Can produce noisy or low-value comments on very large diffs.",
      "Occasionally misses security-relevant issues in unfamiliar frameworks.",
    ],
    auditLog: [
      { timestamp: "2026-01-22T13:00:00Z", actor: "Tom Becker", event: "Agent registered with comment-only GitHub permissions." },
      { timestamp: "2026-02-18T11:40:00Z", actor: "Eval Pipeline", event: "Evaluation run completed: 87% useful-comment rate on sampled PRs." },
      { timestamp: "2026-03-27T09:25:00Z", actor: "Developer Experience", event: "Comment volume tuned down after noisy-feedback signal." },
    ],
  },
  {
    id: "agt-008",
    name: "HR Onboarding Agent",
    ownerName: "Grace Okafor",
    ownerTeam: "People Operations",
    useCase:
      "Generates onboarding checklists and provisions accounts for new hires after manager approval.",
    model: "internal-llama-3",
    dataAccess: "Customer/Regulated",
    connectedTools: ["Workday", "Okta"],
    autonomy: "Write-with-approval",
    estHoursSavedPerMonth: 85,
    valueTier: "Medium",
    evals: {
      accuracyPct: 84,
      hallucinationPct: 8,
      escalationPct: 18,
      latencyMs: 2100,
      costPerTaskUsd: 0.04,
      satisfactionPct: 78,
    },
    rubric: {
      businessValue: 3,
      useCaseClarity: 3,
      dataSafety: 2,
      toolPermissionRisk: 2,
      evaluationQuality: 2,
      humanReviewCoverage: 2,
      auditability: 3,
    },
    failureModes: [
      "Touches regulated employee PII with only moderate safeguards.",
      "Limited evaluation coverage across regional hiring rules.",
      "Human review depth varies by hiring manager.",
    ],
    auditLog: [
      { timestamp: "2026-02-14T08:15:00Z", actor: "Grace Okafor", event: "Agent registered with write-with-approval scope in Workday and Okta." },
      { timestamp: "2026-03-11T15:05:00Z", actor: "Privacy Review", event: "Flagged regulated PII exposure; redaction and access limits recommended." },
      { timestamp: "2026-04-09T10:50:00Z", actor: "Eval Pipeline", event: "Evaluation flagged inconsistent coverage across regions." },
    ],
  },
];

/** Convenience lookup used by the detail route. */
export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}
