# AgentOps

**An enterprise AI agent governance control tower.**

**▶ Live demo: [agentops-kappa.vercel.app](https://agentops-kappa.vercel.app/)** · **Highlights & decisions: [docs/highlights.md](./docs/highlights.md)**

Companies are deploying AI agents everywhere — ticket triage, release notes, support summaries, policy Q&A — and leadership has no single place to answer: _which agents exist, who owns them, what data they touch, are they any good, and should they ship?_ AgentOps inventories every agent, scores its risk, surfaces its evaluation metrics, and gives each one a **launch-readiness recommendation**: Launch, Conditional, Needs Review, or Do Not Launch.

> Part of **Fischer Product Lab** — secure AI systems for trust, risk, and enterprise execution.

---

## Security & data posture (read this first)

This is a **public, read-only demonstration** built entirely on **synthetic data**.

- **Synthetic data only.** Every agent, owner, metric, and audit entry is invented. No real employer, customer, or personal data is present anywhere in this repository or the deployed demo.
- **Read-only.** There are no forms, no mutations, no public write endpoints, and no admin surface. The demo only displays.
- **No AI calls.** The readiness score is **deterministic** — plain rules and math — which is what makes it explainable and auditable.
- **No secrets in the browser.** No API keys or sensitive values exist in client-side code; V1 requires no environment variables at all.

See [`SECURITY.md`](./SECURITY.md) for the full posture and [`docs/threat-model.md`](./docs/threat-model.md) for the STRIDE analysis.

---

## What's inside

Three screens:

| Route | Screen | Purpose |
| --- | --- | --- |
| `/` | **Executive Dashboard** | Portfolio at a glance: totals, counts by readiness, hours saved, a "needs attention" list, and two charts. |
| `/registry` | **Agent Registry** | A sortable, risk-aware table of every agent. |
| `/registry/[id]` | **Agent Detail** | One agent in full: purpose, data/tools, evaluation metrics, the readiness scorecard with its 7-criteria breakdown and reasons, failure modes, and an audit log. |

### The readiness engine (the centerpiece)

`lib/readiness.ts` is a pure, deterministic function. Given an agent's seven rubric scores (0–4 each), it:

1. Computes a **weighted score** normalized to 0–100.
2. Maps it to a **band** (80+ Launch, 60–79 Conditional, 40–59 Needs Review, &lt;40 Do Not Launch).
3. Applies two **hard safety gates** — a high average can _never_ override a critical safety floor:
   - If Data Safety **or** Tool Permission Risk ≤ 1, the verdict is capped at **Needs Review**.
   - If **both** ≤ 1, the verdict is forced to **Do Not Launch**.

Verdicts are always _computed_, never stored, so every status is a reproducible, auditable function of the rubric. The logic is covered by tests in `lib/readiness.test.ts`.

---

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/) in **strict** mode
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for data visuals
- [Zod](https://zod.dev/) for schema validation
- [Lucide](https://lucide.dev/) icons
- Node's built-in test runner (`node --test`)

---

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org/) LTS and [pnpm](https://pnpm.io/).

```bash
# Install dependencies
pnpm install

# Run the dev server (http://localhost:3000)
pnpm dev

# Type-check + production build
pnpm build

# Run the readiness engine tests
pnpm test
```

---

## Project structure

```
agentops/
├── app/
│   ├── page.tsx                 # Executive dashboard (/)
│   ├── registry/
│   │   ├── page.tsx             # Agent registry (/registry)
│   │   └── [id]/page.tsx        # Agent detail (/registry/[id])
│   ├── layout.tsx               # Root layout + app shell
│   └── globals.css              # Design system (Tailwind v4 theme)
├── components/
│   ├── layout/                  # Sidebar, top bar, app shell
│   ├── dashboard/               # Status donut, hours-by-team chart
│   ├── agent/                   # Score ring, rubric breakdown, eval panel
│   ├── registry/                # Sortable registry table
│   └── status-badge.tsx         # Shared readiness badge + status colors
├── data/
│   └── agents.ts                # 8 synthetic agents (typed)
├── lib/
│   ├── types.ts                 # Domain types
│   ├── readiness.ts             # Deterministic readiness engine
│   └── readiness.test.ts        # Tests for the engine + safety gates
└── docs/
    ├── AGENTOPS_V1_BUILD_KIT.md # The build spec
    └── threat-model.md          # STRIDE analysis
```

---

## License

This project is a portfolio demonstration. © Trevor Fischer / Fischer Product Lab.
