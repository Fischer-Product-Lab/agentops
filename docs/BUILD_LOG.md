# Build Log — AgentOps V1

A running narrative of how this project was built and the key decisions behind it.
Code and commit messages capture *what* changed; this captures the *why* and the
environment context that isn't obvious from the source alone.

---

## Status

- **Live demo:** https://agentops-kappa.vercel.app/
- **Repo:** `Fischer-Product-Lab/agentops` (GitHub)
- **Production branch:** `main` (Vercel auto-deploys on every push to `main`)
- **V1 scope:** complete and deployed.

---

## Environment & toolchain

- **OS:** Windows. Default terminal is **PowerShell** — note it's an older version that
  does **not** support `&&` as a statement separator. Use `;` to chain commands.
- **Tools installed via winget:** Git, Node.js LTS (includes npm), GitHub CLI (`gh`).
- **Package manager:** **pnpm** (installed standalone via winget). `corepack enable`
  failed with `EPERM` because it can't write to `C:\Program Files\nodejs` without admin
  rights, so the standalone install was used instead.
- **Project location:** `%USERPROFILE%\dev\agentops` — deliberately **outside OneDrive**.

### Why the project lives outside OneDrive

It was originally scaffolded inside a OneDrive-synced `Documents` folder, but OneDrive's
sync kept **locking files in `.next/`**, causing `EPERM` errors during rebuilds. The fix
was to relocate the whole project outside OneDrive (to `%USERPROFILE%\dev\agentops`).

> **Consequence:** projects under `dev\` are **not** backed up by OneDrive. **GitHub is
> the backup now** — commit and push regularly.

---

## Architecture decisions

- **Deterministic readiness engine.** `lib/readiness.ts` is a pure function — weighted
  score → band → hard safety gates. No AI calls in V1; this is what makes verdicts
  explainable, auditable, and reproducible. Verdicts are always *computed*, never stored.
- **Read-only, synthetic-only.** No forms, mutations, write endpoints, secrets, or env
  vars. See `SECURITY.md` and `docs/threat-model.md`.
- **SSG everywhere.** Detail pages use `generateStaticParams`. Dashboard/registry are
  static. This keeps the demo fast and attack-surface minimal.

### Notable fixes worth remembering

- **Readiness off-by-one (agt-008 scored 57 vs 58):** floating-point precision in
  `(raw / MAX_RAW_SCORE) * 100`. Fixed by reordering to
  `Math.round((raw * 100) / MAX_RAW_SCORE)`.
- **Rubric vs. intended verdict (agt-003, agt-007):** the build kit's written rubric
  inputs didn't produce the intended "Conditional" verdicts. Chose **Option 2** — adjust
  the rubric inputs to match each agent's documented failure mode (e.g. agt-003's human
  review is a spot-check sample = "minimal" (1), not "partial" (2)) so the deterministic
  engine yields the intended result honestly. Documented inline in `data/agents.ts` and
  reflected in `lib/readiness.test.ts` EXPECTED values.
- **Recharts during SSG:** `ResponsiveContainer` can't measure dimensions at build time
  (logged `width(-1)/height(-1)`). Used fixed dimensions in `eval-panel.tsx`; dashboard
  charts gate render behind a `mounted` flag.
- **Node ESM test resolution:** Node's ESM needs explicit extensions; imports in
  `readiness.test.ts` use `.ts` and `tsconfig.json` sets `allowImportingTsExtensions: true`.
  Test script runs `node --test --no-warnings lib/readiness.test.ts`.

---

## Build sequence (build-kit prompts)

| Prompt | What it delivered |
| --- | --- |
| A | Premium dark design system (`globals.css`) + responsive app shell (sidebar/topbar). |
| B | `lib/types.ts`, deterministic `lib/readiness.ts`, 8 synthetic agents, tests. |
| C | `/registry` sortable, risk-aware table. |
| D | `/registry/[id]` agent detail (score ring, rubric breakdown, eval gauges, audit log). |
| E | `/` executive dashboard (KPIs, status donut, hours-by-team chart, attention list). |
| F | README, `SECURITY.md`, STRIDE `docs/threat-model.md`, Dependabot, strict TS. |
| G | Deploy to Vercel from GitHub (no env vars; production branch `main`). |

## GitHub hardening

- Dependabot (`.github/dependabot.yml`) — weekly npm + Actions updates.
- Secret Scanning — enabled via `gh`.
- CodeQL — enabled manually via the GitHub UI (the API default-setup call returned 404
  due to a missing `security_events` token scope).

---

## Resuming in a new Cursor window

A new window opened on this folder starts a **fresh chat** with no memory of prior
sessions — that's expected. Everything needed is in the repo: the code, this log, the
PRD at `docs/agentops-prd.md`, and the security docs. To continue, just point a new chat
at this folder and reference this file.
