// Core domain types for AgentOps (Section 4 of the build kit).
// This module is type-only: it produces no runtime output.

export type DataAccessLevel =
  | "Public"
  | "Internal"
  | "Confidential"
  | "Customer/Regulated";

export type Autonomy =
  | "Read-only"
  | "Suggest"
  | "Write-with-approval"
  | "Autonomous-write";

export type ReadinessStatus =
  | "Launch"
  | "Conditional"
  | "Needs Review"
  | "Do Not Launch";

export type ValueTier = "Low" | "Medium" | "High";

export interface Evals {
  accuracyPct: number; // 0–100
  hallucinationPct: number; // 0–100 (lower is better)
  escalationPct: number; // 0–100
  latencyMs: number;
  costPerTaskUsd: number;
  satisfactionPct: number; // 0–100
}

// The 7 rubric criteria, each scored 0–4 by the reviewer (synthetic for V1).
export interface RubricScores {
  businessValue: number; // 0–4
  useCaseClarity: number; // 0–4
  dataSafety: number; // 0–4
  toolPermissionRisk: number; // 0–4 (higher = safer / lower blast radius)
  evaluationQuality: number; // 0–4
  humanReviewCoverage: number; // 0–4
  auditability: number; // 0–4
}

export interface AuditEvent {
  timestamp: string; // ISO date
  actor: string; // person or system
  event: string; // what happened
}

export interface Agent {
  id: string; // e.g. "agt-001"
  name: string;
  ownerName: string;
  ownerTeam: string;
  useCase: string; // one sentence
  model: string; // e.g. "GPT-5.5", "Claude Opus 4.x", "internal-llama-3"
  dataAccess: DataAccessLevel;
  connectedTools: string[]; // e.g. ["Jira", "Confluence"]
  autonomy: Autonomy;
  estHoursSavedPerMonth: number;
  valueTier: ValueTier;
  evals: Evals;
  rubric: RubricScores;
  failureModes: string[];
  auditLog: AuditEvent[];
}
