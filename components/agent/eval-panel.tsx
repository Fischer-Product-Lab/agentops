"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import type { Evals } from "@/lib/types";

const TRACK = "#141c2b";
const GAUGE_SIZE = 96; // matches the h-24 / w-24 wrapper (renders cleanly in SSG)

function Gauge({ value, color }: { value: number; color: string }) {
  return (
    <div className="relative h-24 w-24">
      <RadialBarChart
        width={GAUGE_SIZE}
        height={GAUGE_SIZE}
        innerRadius="72%"
        outerRadius="100%"
        data={[{ value }]}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar
          background={{ fill: TRACK }}
          dataKey="value"
          cornerRadius={8}
          fill={color}
          isAnimationActive={false}
        />
      </RadialBarChart>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-lg font-semibold tabular-nums text-ink">
          {value}
          <span className="text-xs text-ink-faint">%</span>
        </span>
      </div>
    </div>
  );
}

function GaugeTile({
  label,
  value,
  color,
  hint,
}: {
  label: string;
  value: number;
  color: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-hairline bg-surface-2/40 p-4 text-center">
      <Gauge value={value} color={color} />
      <div className="text-sm font-medium text-ink">{label}</div>
      <div className="text-[11px] text-ink-faint">{hint}</div>
    </div>
  );
}

function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-hairline bg-surface-2/40 p-4 text-center">
      <div className="flex h-24 items-center">
        <span className="font-display text-3xl font-semibold tabular-nums text-data">
          {value}
        </span>
      </div>
      <div className="text-sm font-medium text-ink">{label}</div>
      <div className="text-[11px] text-ink-faint">{hint}</div>
    </div>
  );
}

function formatLatency(ms: number): string {
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

export function EvalPanel({ evals }: { evals: Evals }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <GaugeTile
        label="Accuracy"
        value={evals.accuracyPct}
        color="#5fd6a0"
        hint="higher is better"
      />
      <GaugeTile
        label="Hallucination"
        value={evals.hallucinationPct}
        color="#e8736f"
        hint="lower is better"
      />
      <GaugeTile
        label="Escalation"
        value={evals.escalationPct}
        color="#e6a560"
        hint="routed to a human"
      />
      <GaugeTile
        label="Satisfaction"
        value={evals.satisfactionPct}
        color="#9cc9ff"
        hint="higher is better"
      />
      <StatTile
        label="Latency"
        value={formatLatency(evals.latencyMs)}
        hint="per task"
      />
      <StatTile
        label="Cost / task"
        value={`$${evals.costPerTaskUsd.toFixed(2)}`}
        hint="estimated"
      />
    </div>
  );
}
