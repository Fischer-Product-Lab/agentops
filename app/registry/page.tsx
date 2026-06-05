import type { Metadata } from "next";
import { agents } from "@/data/agents";
import { computeReadiness } from "@/lib/readiness";
import {
  RegistryTable,
  type RegistryRow,
} from "@/components/registry/registry-table";

export const metadata: Metadata = {
  title: "Agent Registry — AgentOps",
  description: "Every AI agent in the portfolio, with its computed readiness.",
};

export default function RegistryPage() {
  const rows: RegistryRow[] = agents.map((agent) => {
    const readiness = computeReadiness(agent.rubric);
    return {
      id: agent.id,
      name: agent.name,
      ownerName: agent.ownerName,
      ownerTeam: agent.ownerTeam,
      model: agent.model,
      dataAccess: agent.dataAccess,
      autonomy: agent.autonomy,
      status: readiness.status,
      score: readiness.score,
      estHoursSavedPerMonth: agent.estHoursSavedPerMonth,
    };
  });

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Agent Registry
        </h1>
        <p className="mt-2 text-ink-muted">
          {rows.length} AI agents inventoried. Click any row for the full
          readiness scorecard. Click a column header to sort.
        </p>
      </header>

      <RegistryTable rows={rows} />
    </div>
  );
}
