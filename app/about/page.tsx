import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  FileText,
  Layers,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About this demo — AgentOps",
  description:
    "Why AgentOps exists, how its deterministic readiness engine works, and the security posture behind this read-only synthetic demo.",
};

const REPO_URL = "https://github.com/Fischer-Product-Lab/agentops";
const PRD_URL = `${REPO_URL}/blob/main/docs/agentops-prd.md`;
const THREAT_MODEL_URL = `${REPO_URL}/blob/main/docs/threat-model.md`;
const HIGHLIGHTS_URL = `${REPO_URL}/blob/main/docs/highlights.md`;

const STACK = [
  "Next.js 16",
  "React 19",
  "TypeScript (strict)",
  "Tailwind CSS v4",
  "Recharts",
  "Zod",
];

function ExternalLink({
  href,
  icon: Icon,
  label,
  hint,
}: {
  href: string;
  icon: typeof Code2;
  label: string;
  hint: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-hairline bg-surface-2/40 p-3 transition-colors hover:border-gold/50 hover:bg-surface-2"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1 font-medium text-ink group-hover:text-gold">
          {label}
          <ArrowUpRight className="h-3.5 w-3.5 text-ink-faint group-hover:text-gold" />
        </span>
        <span className="block text-xs text-ink-faint">{hint}</span>
      </span>
    </a>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold-soft">
          <Sparkles className="h-3.5 w-3.5" />
          About this demo
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink">
          AgentOps — an AI agent governance control tower
        </h1>
        <p className="mt-2 text-ink-muted">
          A portfolio demonstration by Trevor Fischer · Fischer Product Lab —
          secure AI systems for trust, risk, and enterprise execution.
        </p>
      </header>

      {/* Why */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">
          Why AgentOps
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink-muted">
          <p>
            Enterprises are deploying AI agents faster than they can govern them
            — ticket triage, release notes, support summaries, policy Q&amp;A.
            Each is spun up by a different team, touches different data, and
            holds different tool permissions. Leadership rarely has one place to
            answer the questions that matter: which agents exist, who owns them,
            what can they touch, and which are actually safe to scale?
          </p>
          <p>
            AgentOps turns that sprawl into a single governed, measurable,
            executive-ready view — so the decision to scale, pause, or govern an
            agent is backed by evidence rather than instinct.
          </p>
        </div>
      </section>

      {/* How readiness works */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-data/30 bg-data/10 text-data">
            <Scale className="h-[18px] w-[18px]" />
          </span>
          <h2 className="font-display text-lg font-semibold text-ink">
            How readiness works
          </h2>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Every readiness verdict is a{" "}
          <span className="text-ink">pure, deterministic function</span> — no AI
          calls — which is what makes it explainable and auditable.
        </p>
        <ol className="mt-4 space-y-3">
          {[
            "Seven weighted criteria (scored 0–4) are normalized into a 0–100 score.",
            "The score maps to a band: Launch (80+), Conditional (60–79), Needs Review (40–59), or Do Not Launch (<40).",
            "Hard safety gates override the band: if data safety or tool-permission risk hits the critical floor, the verdict is capped or blocked — a strong average can never bury a critical risk.",
          ].map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink-muted">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-surface-2 text-xs font-semibold text-gold tabular-nums">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 rounded-lg border border-hairline bg-surface-2/40 p-3 text-sm leading-relaxed text-ink-muted">
          The thesis in one line:{" "}
          <span className="text-ink">
            a strong agent that is unsafe is still unsafe
          </span>{" "}
          — and the scoring encodes that judgment so it can&apos;t be averaged
          away.
        </p>
      </section>

      {/* Security posture */}
      <section className="rounded-xl border border-hairline bg-surface p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-launch/30 bg-launch/10 text-launch">
            <ShieldCheck className="h-[18px] w-[18px]" />
          </span>
          <h2 className="font-display text-lg font-semibold text-ink">
            Security posture
          </h2>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Synthetic data only — no real customer, employer, or personal data.",
            "Read-only — no write endpoints, forms, or admin surface.",
            "No client-side secrets; zero environment variables required.",
            "Deterministic scoring — explainable, auditable, no black box.",
            "Documented STRIDE threat model and security policy.",
            "Hardened supply chain — Dependabot, secret scanning, CodeQL.",
          ].map((item) => (
            <li
              key={item}
              className="flex gap-2.5 text-sm leading-relaxed text-ink-muted"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Stack + links */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-surface p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-gold">
              <Layers className="h-[18px] w-[18px]" />
            </span>
            <h2 className="font-display text-lg font-semibold text-ink">
              Built with
            </h2>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-hairline bg-surface-2/50 px-3 py-1 text-xs text-ink-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Go deeper
          </h2>
          <div className="mt-4 space-y-3">
            <ExternalLink
              href={REPO_URL}
              icon={Code2}
              label="Source on GitHub"
              hint="Full codebase, tests, and documentation"
            />
            <ExternalLink
              href={PRD_URL}
              icon={FileText}
              label="Product requirements (PRD)"
              hint="Problem, users, requirements, and metrics"
            />
            <ExternalLink
              href={THREAT_MODEL_URL}
              icon={ShieldCheck}
              label="Threat model"
              hint="STRIDE analysis for the demo"
            />
            <ExternalLink
              href={HIGHLIGHTS_URL}
              icon={Sparkles}
              label="Highlights"
              hint="What this project demonstrates"
            />
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-start justify-between gap-3 border-t border-hairline pt-6 sm:flex-row sm:items-center">
        <p className="text-sm text-ink-faint">
          Built by Trevor Fischer · Fischer Product Lab
        </p>
        <Link
          href="/"
          className="text-sm text-ink-muted transition-colors hover:text-gold"
        >
          Back to dashboard
        </Link>
      </footer>
    </div>
  );
}
