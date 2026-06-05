import { RUBRIC_CRITERIA } from "@/lib/readiness";
import type { RubricScores } from "@/lib/types";

function barColor(value: number): string {
  if (value <= 1) return "bg-danger";
  if (value === 2) return "bg-review";
  if (value === 3) return "bg-gold";
  return "bg-launch";
}

/** The 7 rubric criteria as a labeled bar breakdown (0–4 each, with weight). */
export function RubricBreakdown({ rubric }: { rubric: RubricScores }) {
  return (
    <ul className="space-y-3.5">
      {RUBRIC_CRITERIA.map((criterion) => {
        const value = rubric[criterion.key];
        return (
          <li key={criterion.key}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-ink-muted">{criterion.label}</span>
              <span className="shrink-0 tabular-nums text-ink-faint">
                {value}/4
                <span className="ml-2 text-ink-faint/70">
                  weight &times;{criterion.weight.toFixed(1)}
                </span>
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-2">
              <div
                className={`h-full rounded-full ${barColor(value)}`}
                style={{ width: `${(value / 4) * 100}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
