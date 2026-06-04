import type { ReadinessStatus, RubricScores } from "./types";

export interface ReadinessResult {
  score: number; // 0–100
  bandStatus: ReadinessStatus; // before gates
  status: ReadinessStatus; // after gates (this is the one you display)
  reasons: string[];
}

/**
 * Rubric criteria metadata — the single source of truth for labels and weights.
 * Weights sum to 10, so the maximum raw score is 10 × 4 = 40.
 */
export const RUBRIC_CRITERIA: {
  key: keyof RubricScores;
  label: string;
  weight: number;
  /** When true, a higher score means safer / lower blast radius. */
  description: string;
}[] = [
  { key: "businessValue", label: "Business Value", weight: 1.0, description: "Impact and ROI of the use case." },
  { key: "useCaseClarity", label: "Use Case Clarity", weight: 1.0, description: "How well-defined and bounded the task is." },
  { key: "dataSafety", label: "Data Safety", weight: 2.0, description: "Sensitivity of data the agent can reach and how it is protected." },
  { key: "toolPermissionRisk", label: "Tool Permission Risk", weight: 2.0, description: "Blast radius of connected tools (higher score = safer)." },
  { key: "evaluationQuality", label: "Evaluation Quality", weight: 1.5, description: "Depth and rigor of the agent's evaluation coverage." },
  { key: "humanReviewCoverage", label: "Human Review Coverage", weight: 1.5, description: "Extent of human-in-the-loop oversight." },
  { key: "auditability", label: "Auditability", weight: 1.0, description: "Traceability and logging of the agent's actions." },
];

export const MAX_RAW_SCORE = RUBRIC_CRITERIA.reduce(
  (sum, c) => sum + c.weight * 4,
  0,
); // = 40

// Ordered worst → best, so we can compare and cap statuses.
const STATUS_ORDER: ReadinessStatus[] = [
  "Do Not Launch",
  "Needs Review",
  "Conditional",
  "Launch",
];

function rank(status: ReadinessStatus): number {
  return STATUS_ORDER.indexOf(status);
}

/** Step 2 — map a 0–100 score to a band. */
function bandForScore(score: number): ReadinessStatus {
  if (score >= 80) return "Launch";
  if (score >= 60) return "Conditional";
  if (score >= 40) return "Needs Review";
  return "Do Not Launch";
}

/**
 * Deterministic launch-readiness calculation.
 * Same input always produces the same output — no AI involved.
 *
 * Step 1: weighted score (normalized to 0–100).
 * Step 2: band from the score.
 * Step 3: hard safety gates that a high score can never override.
 */
export function computeReadiness(r: RubricScores): ReadinessResult {
  // Step 1 — weighted, normalized score.
  const raw = RUBRIC_CRITERIA.reduce(
    (sum, c) => sum + r[c.key] * c.weight,
    0,
  );
  // Multiply before dividing so the intermediate value is exact and a true
  // .5 rounds up consistently — avoids float artifacts like 57.4999 → 57.
  const score = Math.round((raw * 100) / MAX_RAW_SCORE);

  // Step 2 — band.
  const bandStatus = bandForScore(score);

  // Step 3 — hard safety gates.
  const dataSafetyLow = r.dataSafety <= 1;
  const toolRiskLow = r.toolPermissionRisk <= 1;

  let status = bandStatus;
  const reasons: string[] = [];

  if (dataSafetyLow && toolRiskLow) {
    status = "Do Not Launch";
    reasons.push(
      "Forced to Do Not Launch: both Data Safety and Tool Permission Risk are at or below the critical floor (≤ 1).",
    );
  } else if (dataSafetyLow || toolRiskLow) {
    const which = dataSafetyLow ? "Data Safety" : "Tool Permission Risk";
    if (rank(bandStatus) > rank("Needs Review")) {
      status = "Needs Review";
      reasons.push(
        `Capped at Needs Review: ${which} is at or below the critical floor (≤ 1), overriding a numeric score of ${score}.`,
      );
    } else {
      reasons.push(
        `${which} is at or below the critical floor (≤ 1).`,
      );
    }
  }

  // Contextual reasons: surface the most heavily-weighted weak spots (≤ 2),
  // so a reviewer can see *why* an agent fell short of Launch.
  const weakSpots = RUBRIC_CRITERIA.filter((c) => r[c.key] <= 2)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  for (const c of weakSpots) {
    const value = r[c.key];
    // Avoid duplicating a gate reason already covered above.
    const coveredByGate =
      (c.key === "dataSafety" && dataSafetyLow) ||
      (c.key === "toolPermissionRisk" && toolRiskLow);
    if (coveredByGate) continue;
    reasons.push(
      `${c.label} is ${value <= 1 ? "critically low" : "below target"} (${value}/4).`,
    );
  }

  if (reasons.length === 0) {
    reasons.push(
      status === "Launch"
        ? "Strong across the rubric with no safety-floor breaches; cleared to launch."
        : `Aggregate score of ${score}/100 lands in the ${status} band — solid, but short of the Launch threshold (80).`,
    );
  }

  return { score, bandStatus, status, reasons };
}
