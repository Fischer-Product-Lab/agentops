# AgentOps tool catalog

This file is the published list of what can actually be called on this demo.
Marketing copy is on `/about`. An eval agent should fetch this markdown.

This is a public, synthetic, read-only enterprise demo. It is not live
commercial SaaS. There are no write, launch, send, or password tools.

Source of truth for governed-agent tool names: `data/agents.ts`
(`Agent.connectedTools`). That file is not changed by this catalog.

---

## Page tools (callable on this demo)

Shipped callable tools today: **none**.

There is no `registerTool` in this repo. Live HTML does not expose
`get_agent_readiness`. Visiting agents must not assume a page-tool
surface exists.

### Proposed, not shipped

Documented for eval agents. Not implemented. Do not call.

- name: `get_agent_readiness`
- description: Return this agent’s synthetic readiness record (id, owner, autonomy, score, status, reasons).
- arguments / inputSchema: `{ "type": "object", "properties": {} }`
- annotations: `{ "readOnlyHint": true }`
- execute (documented only): return the record already on screen, the same object `computeReadiness(agent.rubric)` produced. Do not implement `registerTool` in this PR.

### Explicit NON-tools (not registered, not callable)

- launch / approve / promote
- send / publish / mail
- pay / Stripe write / any mutation
- password / 2FA / any credential (browser hands those to the human; they never go through the model)
- any form-backed tool (`SECURITY.md` forbids forms)

---

## Governed-agent tools (blast radius of listed agents)

These are **not** callable page tools on the demo. They are
`Agent.connectedTools: string[]` from `data/agents.ts` — what each
synthetic governed agent may touch. Names below are copied exactly.
Example of the live field: `agt-005` has Gmail, Zendesk, Stripe.

### agt-001 — Jira Triage Bot

- Jira
- Slack

### agt-002 — Release Notes Drafter

- GitHub
- Confluence

### agt-003 — Support Ticket Summarizer

- Zendesk
- Slack

### agt-004 — Security Policy Q&A Bot

- Confluence
- SharePoint

### agt-005 — Customer Auto-Responder

- Gmail
- Zendesk
- Stripe

### agt-006 — Invoice Reconciliation Agent

- NetSuite
- SAP

### agt-007 — Code Review Assistant

- GitHub

### agt-008 — HR Onboarding Agent

- Workday
- Okta
