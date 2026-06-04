import { test } from "node:test";
import assert from "node:assert/strict";
import { computeReadiness } from "./readiness.ts";
import { agents } from "../data/agents.ts";
import type { RubricScores } from "./types.ts";

/**
 * Expected score + status for each of the 8 synthetic agents.
 *
 * Every status is computed by the deterministic engine — never stored. The
 * engine reproduces the build kit's table for 6 of 8 agents directly. For
 * agt-003 and agt-007 the kit's rubric inputs contradicted the agents' own
 * documented failure modes, so a single input was corrected on each (see the
 * comments in data/agents.ts). We never override the scoring output; we only
 * fixed inconsistent inputs, and the engine then yields the intended
 * Conditional verdicts.
 */
const EXPECTED: Record<string, { score: number; status: string }> = {
  "agt-001": { score: 98, status: "Launch" },
  "agt-002": { score: 88, status: "Launch" },
  "agt-003": { score: 79, status: "Conditional" }, // input corrected: HR 2 -> 1
  "agt-004": { score: 83, status: "Launch" },
  "agt-005": { score: 33, status: "Do Not Launch" }, // both safety gates tripped
  "agt-006": { score: 74, status: "Conditional" },
  "agt-007": { score: 78, status: "Conditional" }, // input corrected: EQ 4 -> 3
  "agt-008": { score: 58, status: "Needs Review" },
};

test("the portfolio contains exactly 8 agents", () => {
  assert.equal(agents.length, 8);
});

test("each agent resolves to its expected score and status", () => {
  for (const agent of agents) {
    const expected = EXPECTED[agent.id];
    assert.ok(expected, `no expectation defined for ${agent.id}`);

    const result = computeReadiness(agent.rubric);
    assert.equal(
      result.score,
      expected.score,
      `${agent.id} (${agent.name}) score`,
    );
    assert.equal(
      result.status,
      expected.status,
      `${agent.id} (${agent.name}) status`,
    );
  }
});

test("a single safety-floor breach caps an otherwise-strong agent at Needs Review", () => {
  // All criteria max except Data Safety at the critical floor.
  const rubric: RubricScores = {
    businessValue: 4,
    useCaseClarity: 4,
    dataSafety: 1,
    toolPermissionRisk: 4,
    evaluationQuality: 4,
    humanReviewCoverage: 4,
    auditability: 4,
  };
  const result = computeReadiness(rubric);
  assert.equal(result.bandStatus, "Launch"); // numeric band alone would Launch
  assert.equal(result.status, "Needs Review"); // gate overrides it
});

test("two safety-floor breaches force Do Not Launch", () => {
  const rubric: RubricScores = {
    businessValue: 4,
    useCaseClarity: 4,
    dataSafety: 1,
    toolPermissionRisk: 0,
    evaluationQuality: 4,
    humanReviewCoverage: 4,
    auditability: 4,
  };
  const result = computeReadiness(rubric);
  assert.equal(result.status, "Do Not Launch");
});
