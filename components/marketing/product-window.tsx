import { ShieldCheck } from "lucide-react";
import { agents } from "@/data/agents";
import { computeReadiness } from "@/lib/readiness";
import { StatusBadge } from "@/components/status-badge";
import type { ReadinessStatus } from "@/lib/types";

const STATUS_ORDER: ReadinessStatus[] = [
  "Launch",
  "Conditional",
  "Needs Review",
  "Do Not Launch",
];

const ATTENTION_RANK: Record<string, number> = {
  "Do Not Launch": 0,
  "Needs Review": 1,
};

/**
 * Faithful in-page chrome of the executive control tower —
 * the real fleet, the real readiness engine, the real governance signals.
 * Not a mock dashboard and not a title card over the live page.
 */
export function ProductWindow() {
  const scored = agents.map((agent) => ({
    agent,
    readiness: computeReadiness(agent.rubric),
  }));

  const totalAgents = agents.length;
  const launchCount = scored.filter((s) => s.readiness.status === "Launch")
    .length;
  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: scored.filter((s) => s.readiness.status === status).length,
  }));
  const needsAttention = scored
    .filter(
      (s) =>
        s.readiness.status === "Needs Review" ||
        s.readiness.status === "Do Not Launch",
    )
    .sort(
      (a, b) =>
        ATTENTION_RANK[a.readiness.status] - ATTENTION_RANK[b.readiness.status],
    );

  return (
    <div className="product-window overflow-hidden rounded-xl bg-canvas">
      <div className="flex items-center gap-3 border-b border-hairline bg-surface px-3 py-2.5">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-ivory/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ivory/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-ivory/15" />
        </div>
        <div className="mx-auto flex h-7 max-w-md flex-1 items-center justify-center rounded-md border border-hairline bg-canvas px-3 font-mono text-[11px] tracking-normal text-ink-faint">
          agentops · control tower
        </div>
      </div>

      <div className="flex min-h-[28rem] bg-canvas">
        <aside className="hidden w-44 shrink-0 border-r border-hairline bg-surface/40 p-3 sm:block">
          <div className="flex items-center gap-2 px-1 py-1">
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-gold/40 bg-gold/10 text-gold">
              <ShieldCheck className="h-3.5 w-3.5" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-sm font-semibold text-ink">
                AgentOps
              </span>
              <span className="text-[9px] uppercase tracking-[0.16em] text-ink-faint">
                FPL
              </span>
            </span>
          </div>
          <div className="mt-4 px-1 text-[9px] font-medium uppercase tracking-[0.16em] text-ink-faint">
            Control Tower
          </div>
          <ul className="mt-2 space-y-0.5 text-[12px]">
            {["Dashboard", "Registry"].map((label, i) => (
              <li
                key={label}
                className={`relative rounded-md px-2.5 py-1.5 ${
                  i === 0 ? "bg-surface-2 text-ink" : "text-ink-muted"
                }`}
              >
                {i === 0 && (
                  <span className="absolute left-0 top-1/2 h-3.5 w-0.5 -translate-y-1/2 rounded-full bg-gold" />
                )}
                {label}
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-5">
          <header>
            <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
              Executive Dashboard
            </h3>
            <p className="mt-1 text-[12px] text-ink-faint">
              {totalAgents} agents inventoried · readiness computed on read
            </p>
          </header>

          <section className="grid grid-cols-3 gap-2.5">
            <Kpi label="Agents" value={totalAgents} />
            <Kpi label="Launch-ready" value={launchCount} accent="launch" />
            <Kpi
              label="Needs attention"
              value={needsAttention.length}
              accent="review"
            />
          </section>

          <section className="rounded-xl border border-hairline bg-surface p-4">
            <h4 className="font-display text-sm font-semibold text-ink">
              Agents by readiness
            </h4>
            <ul className="mt-3 space-y-2">
              {statusCounts.map(({ status, count }) => (
                <li
                  key={status}
                  className="flex items-center justify-between gap-3"
                >
                  <StatusBadge status={status} />
                  <span className="tabular-nums text-[13px] text-ink-muted">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-hairline bg-surface p-4">
            <h4 className="font-display text-sm font-semibold text-ink">
              Governance signals
            </h4>
            <ul className="mt-3 divide-y divide-hairline/60">
              {needsAttention.map(({ agent, readiness }) => (
                <li
                  key={agent.id}
                  className="flex flex-col gap-1.5 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex items-center gap-2.5 sm:w-64 sm:shrink-0">
                    <StatusBadge status={readiness.status} />
                    <span className="truncate text-[13px] font-medium text-ink">
                      {agent.name}
                    </span>
                  </div>
                  <span className="line-clamp-2 text-[12px] leading-relaxed text-ink-muted">
                    {readiness.reasons[0]}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "launch" | "review";
}) {
  const valueClass =
    accent === "launch"
      ? "text-launch"
      : accent === "review"
        ? "text-review"
        : "text-ink";

  return (
    <div className="rounded-xl border border-hairline bg-surface px-3 py-3">
      <div
        className={`font-display text-2xl font-semibold tabular-nums ${valueClass}`}
      >
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-ink-muted">{label}</div>
    </div>
  );
}
