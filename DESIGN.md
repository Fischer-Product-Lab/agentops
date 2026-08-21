# AgentOps — visual language

Portfolio surface for Fischer Product Lab. This is a cinematic, read-only demonstration — not a night SaaS, not a template, not a title-card overlay on the existing demo.

## Tokens

| Token | Hex | Role |
| --- | --- | --- |
| Navy | `#0B1220` | Void. Page, canvas, chrome. |
| Ivory | `#F4EFE4` | Type and the primary CTA fill. |
| Gold | `#C4A35A` | The only accent. Rules, meta, rim-light, secondary CTA. |

Atmosphere is one thing: **film grain + a single gold/ivory light** sitting over a real AgentOps product window. Status colors (Launch / Conditional / Needs Review / Do Not Launch) exist only inside the product chrome, where they mean something.

## Type

Landing face: **Geist**. Landing mono: **Geist Mono**. Loaded via `next/font`. Live demo screens keep Hanken Grotesk + Fraunces so the product chrome stays itself.

Four sizes on the landing, no more:

| Name | Use |
| --- | --- |
| Display | Hero headline only |
| Title | Section heads |
| Body | Subcopy and how-it-decides |
| Meta | Eyebrows, nav, footer — mono, tracked, uppercase |

## Kill list

- No purple. No indigo mesh. No default shadcn violet.
- No Inter as the face.
- No emoji icons.
- No Spline / R3F orb.
- No fake “trusted by” logos.
- No five CTAs. Two: **Open the demo** and **See how it decides**.
- No auth, Stripe, CMS, or a second product.
- Do not invent metrics. Launch-ready counts, readiness bands, and governance signals come from `computeReadiness` over the existing synthetic fleet.
- Do not copy TrustDesk copy, chrome, or the questionnaire window. Steal the register only: void, one light, grain, grotesque headline, real product under the light.
- Do not put a title-card overlay on the existing dashboard.
