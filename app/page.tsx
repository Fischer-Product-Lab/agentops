import Link from "next/link";
import { ArrowRight, Boxes, GaugeCircle, ShieldCheck } from "lucide-react";

const previewCards = [
  {
    icon: Boxes,
    title: "Agent Registry",
    body: "Every AI agent in one inventory — owner, model, data access, and risk at a glance.",
  },
  {
    icon: GaugeCircle,
    title: "Launch Readiness",
    body: "A deterministic 0–100 score with hard safety gates that a high average can never override.",
  },
  {
    icon: ShieldCheck,
    title: "Audit & Governance",
    body: "Evaluation metrics, failure modes, and an audit trail for every agent decision.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="max-w-2xl">
        <span className="inline-flex items-center rounded-full border border-hairline bg-surface px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-ink-faint">
          Enterprise AI Governance
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
          The control tower for your{" "}
          <span className="text-gold">AI agents</span>.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-muted">
          AgentOps inventories every agent, scores its risk, surfaces its
          evaluation metrics, and gives each one a clear launch-readiness
          recommendation — Launch, Conditional, Needs Review, or Do Not Launch.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/registry"
            className="inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-canvas transition-colors hover:bg-gold-soft"
          >
            Explore the registry
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {previewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-xl border border-hairline bg-surface p-5 transition-colors hover:border-hairline-strong"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-ink">
                {card.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {card.body}
              </p>
            </div>
          );
        })}
      </section>

      <p className="mt-10 text-sm text-ink-faint">
        The executive dashboard, full registry, and per-agent detail views are
        built next.
      </p>
    </div>
  );
}
