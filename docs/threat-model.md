# AgentOps V1 — Threat Model

A lightweight STRIDE analysis for the AgentOps V1 demo. The system is a **public, read-only, statically-rendered web application backed entirely by synthetic data**. That posture eliminates most of the attack surface by design; this document records that reasoning explicitly.

## System summary

- **Trust boundary:** the public internet → a static Next.js site (no authenticated users, no roles).
- **Data:** synthetic, compiled into the build. No database, no user input persisted, no PII.
- **Compute:** server components render at build time (SSG); there are no public mutating API routes in V1.
- **Secrets:** none. V1 requires no environment variables and ships no client-side keys.

## STRIDE analysis

| Threat | Example for this system | Likelihood | Mitigation in V1 |
| --- | --- | --- | --- |
| **Spoofing** | An attacker impersonates a user or admin to reach privileged functionality. | Low | No authentication or accounts exist; there is no privileged functionality and no admin surface to reach. |
| **Tampering** | A user modifies an agent's data, score, or approval state. | Low | The demo is read-only. Data is compiled into the static build; there are no write endpoints, forms, or mutations. |
| **Repudiation** | An action is taken with no record of who did it. | Low | No state-changing actions exist. The displayed audit log is synthetic, illustrating the _pattern_ a production system would use. |
| **Information Disclosure** | Sensitive customer, employer, or personal data leaks. | Low | Synthetic data only — there is no sensitive data to disclose. No secrets are present in client code. |
| **Denial of Service** | An endpoint is flooded or abused to exhaust resources. | Low | Statically-rendered pages served via CDN; no expensive or unbounded server endpoints, no public AI calls. |
| **Elevation of Privilege** | A user gains access to admin-only or write-capable behavior. | Low | No roles, no admin mode, and no mutating endpoints exist to elevate into. |

## Residual risk & future considerations

As the product evolves beyond V1, these controls become relevant:

- **AI integration:** any future model calls must run **server-side only**, with bounded inputs, no sensitive-prompt logging, and human review for higher-risk actions.
- **Persistence (e.g. Supabase):** enable Row-Level Security and a read-only public policy before any public database access.
- **Authentication:** introduce a role model and branch-protected deploys before exposing any write or admin capability.
- **Supply chain:** Dependabot alerts/updates and CodeQL static analysis are enabled to manage dependency and code risk over time.
