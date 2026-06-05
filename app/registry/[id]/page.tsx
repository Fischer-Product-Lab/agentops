import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { agents, getAgentById } from "@/data/agents";
import { computeReadiness } from "@/lib/readiness";
import { StatusBadge } from "@/components/status-badge";
import { ScoreRing } from "@/components/agent/score-ring";
import { RubricBreakdown } from "@/components/agent/rubric-breakdown";
import { EvalPanel } from "@/components/agent/eval-panel";

export function generateStaticParams() {
  return agents.map((agent) => ({ id: agent.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) return { title: "Agent not found — AgentOps" };
  return {
    title: `${agent.name} — AgentOps`,
    description: agent.useCase,
  };
}

function Meta({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-ink-faint">
        {label}
      </dt>
      <dd className="mt-0.5 text-ink">{value}</dd>
      {sub && <dd className="text-xs text-ink-faint">{sub}</dd>}
    </div>
  );
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) notFound();

  const readiness = computeReadiness(agent.rubric);
  const isLaunch = readiness.status === "Launch";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        href="/registry"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to registry
      </Link>

      {/* Header */}
      <header className="rounded-xl border border-hairline bg-surface p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            {agent.name}
          </h1>
          <StatusBadge status={readiness.status} />
        </div>
        <p className="mt-1 text-sm text-ink-faint">{agent.id}</p>
        <p className="mt-3 max-w-2xl text-ink-muted">{agent.useCase}</p>

        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 text-sm sm:grid-cols-3 lg:grid-cols-4">
          <Meta label="Owner" value={agent.ownerName} sub={agent.ownerTeam} />
          <Meta label="Model" value={agent.model} />
          <Meta label="Data Access" value={agent.dataAccess} />
          <Meta label="Autonomy" value={agent.autonomy} />
          <Meta label="Value Tier" value={agent.valueTier} />
          <Meta
            label="Hours Saved / mo"
            value={agent.estHoursSavedPerMonth}
          />
          <Meta label="Connected Tools" value={agent.connectedTools.join(", ")} />
        </dl>
      </header>

      {/* Readiness scorecard */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-hairline bg-surface p-6">
          <h2 className="self-start font-display text-lg font-semibold text-ink">
            Launch Readiness
          </h2>
          <ScoreRing score={readiness.score} status={readiness.status} />
          <StatusBadge status={readiness.status} />
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink">
            Rubric breakdown
          </h2>
          <p className="mb-4 mt-1 text-sm text-ink-faint">
            Seven criteria, each scored 0–4 and weighted. Data Safety and Tool
            Permission Risk carry hard safety gates.
          </p>
          <RubricBreakdown rubric={agent.rubric} />
        </div>
      </section>

      {/* Why this verdict */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Why this verdict
        </h2>
        <ul className="space-y-2.5">
          {readiness.reasons.map((reason, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              {isLaunch ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-launch" />
              ) : (
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-review" />
              )}
              <span className="text-ink-muted">{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Evaluation */}
      <section>
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">
          Evaluation
        </h2>
        <EvalPanel evals={agent.evals} />
      </section>

      {/* Failure modes */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Failure modes
        </h2>
        <ul className="space-y-2.5">
          {agent.failureModes.map((mode, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-review" />
              <span className="text-ink-muted">{mode}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Audit log */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Audit log
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline text-left">
                <th className="py-2 pr-4 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                  Timestamp (UTC)
                </th>
                <th className="py-2 pr-4 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                  Actor
                </th>
                <th className="py-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                  Event
                </th>
              </tr>
            </thead>
            <tbody>
              {agent.auditLog.map((entry, i) => (
                <tr
                  key={i}
                  className="border-b border-hairline/60 last:border-0"
                >
                  <td className="py-3 pr-4 whitespace-nowrap text-ink-faint tabular-nums">
                    {dateFormatter.format(new Date(entry.timestamp))}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-ink-muted">
                    {entry.actor}
                  </td>
                  <td className="py-3 text-ink-muted">{entry.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
