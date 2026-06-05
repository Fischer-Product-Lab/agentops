import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { agents } from "@/data/agents";
import { computeReadiness } from "@/lib/readiness";
import { StatusBadge } from "@/components/status-badge";
import { StatusDonut } from "@/components/dashboard/status-donut";
import { HoursByTeamBar } from "@/components/dashboard/hours-by-team-bar";
import type { ReadinessStatus } from "@/lib/types";

const STATUS_ORDER: ReadinessStatus[] = [
  "Launch",
  "Conditional",
  "Needs Review",
  "Do Not Launch",
];

function KpiCard({
  label,
  value,
  icon: Icon,
  accent = "gold",
}: {
  label: string;
  value: string | number;
  icon: typeof Boxes;
  accent?: "gold" | "launch" | "review";
}) {
  const accentClass =
    accent === "launch"
      ? "border-launch/30 bg-launch/10 text-launch"
      : accent === "review"
        ? "border-review/30 bg-review/10 text-review"
        : "border-gold/30 bg-gold/10 text-gold";
  return (
    <div className="rounded-xl border border-hairline bg-surface p-5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg border ${accentClass}`}
      >
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <div className="mt-4 font-display text-3xl font-semibold tabular-nums text-ink">
        {value}
      </div>
      <div className="mt-1 text-sm text-ink-muted">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const scored = agents.map((agent) => ({
    agent,
    readiness: computeReadiness(agent.rubric),
  }));

  const totalAgents = agents.length;
  const totalHours = agents.reduce((s, a) => s + a.estHoursSavedPerMonth, 0);

  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    count: scored.filter((s) => s.readiness.status === status).length,
  }));
  const launchCount =
    statusCounts.find((s) => s.status === "Launch")?.count ?? 0;

  const hoursByTeam = Object.entries(
    agents.reduce<Record<string, number>>((acc, a) => {
      acc[a.ownerTeam] = (acc[a.ownerTeam] ?? 0) + a.estHoursSavedPerMonth;
      return acc;
    }, {}),
  )
    .map(([team, hours]) => ({ team, hours }))
    .sort((a, b) => b.hours - a.hours);

  const attentionRank: Record<string, number> = {
    "Do Not Launch": 0,
    "Needs Review": 1,
  };
  const needsAttention = scored
    .filter(
      (s) =>
        s.readiness.status === "Needs Review" ||
        s.readiness.status === "Do Not Launch",
    )
    .sort(
      (a, b) =>
        attentionRank[a.readiness.status] - attentionRank[b.readiness.status],
    );

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Executive Dashboard
        </h1>
        <p className="mt-2 text-ink-muted">
          Portfolio-wide view of every AI agent, its readiness, and where
          attention is needed.
        </p>
      </header>

      {/* KPIs */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total agents" value={totalAgents} icon={Boxes} />
        <KpiCard
          label="Hours saved / month"
          value={totalHours.toLocaleString("en-US")}
          icon={Clock}
        />
        <KpiCard
          label="Cleared to launch"
          value={launchCount}
          icon={CheckCircle2}
          accent="launch"
        />
        <KpiCard
          label="Needs attention"
          value={needsAttention.length}
          icon={AlertTriangle}
          accent="review"
        />
      </section>

      {/* Charts */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Agents by readiness
          </h2>
          <div className="mt-2 grid items-center gap-4 sm:grid-cols-2">
            <StatusDonut data={statusCounts} total={totalAgents} />
            <ul className="space-y-2">
              {statusCounts.map(({ status, count }) => (
                <li
                  key={status}
                  className="flex items-center justify-between gap-3"
                >
                  <StatusBadge status={status} />
                  <span className="tabular-nums text-ink-muted">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Hours saved by team
          </h2>
          <p className="mb-2 mt-1 text-sm text-ink-faint">
            Estimated monthly hours saved, by owning team.
          </p>
          <HoursByTeamBar data={hoursByTeam} />
        </div>
      </section>

      {/* Needs attention */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">
            Needs attention
          </h2>
          <Link
            href="/registry"
            className="inline-flex items-center gap-1 text-sm text-ink-muted transition-colors hover:text-gold"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {needsAttention.length === 0 ? (
          <p className="text-sm text-ink-muted">
            No agents currently require attention.
          </p>
        ) : (
          <ul className="divide-y divide-hairline/60">
            {needsAttention.map(({ agent, readiness }) => (
              <li key={agent.id}>
                <Link
                  href={`/registry/${agent.id}`}
                  className="group flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4"
                >
                  <div className="flex items-center gap-3 sm:w-72 sm:shrink-0">
                    <StatusBadge status={readiness.status} />
                    <span className="font-medium text-ink group-hover:text-gold">
                      {agent.name}
                    </span>
                  </div>
                  <span className="text-sm text-ink-muted">
                    {readiness.reasons[0]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
