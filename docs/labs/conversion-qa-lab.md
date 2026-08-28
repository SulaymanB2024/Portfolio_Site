# Conversion and Q/A Lab — Work → Contact

Date: 2026-07-30

Branch: `codex/conversion-qa-lab`

Base: `cba7d2ddc4c3cfa28cc8b024b170eae5064e67d9`

## Scope and guardrails

This lane improves the buyer decision path across `/work`, `/contact`, and the shared intake form. It does not change route definitions, analytics, the Formspree endpoint, canonical SEO metadata, deployment state, or any public outcome claim. Validation must not send a real form submission.

## Acceptance contract

| Area | Measurable pass condition | Evidence |
| --- | --- | --- |
| Work → Contact decision clarity | `/work` exposes the proof standard, a bounded sample, the inputs for a useful brief, and a direct anchored path to the contact form before the final CTA. | Source review plus rendered link/heading checks. |
| Claim boundaries | New buyer-facing copy distinguishes process or sample evidence from client outcomes and explicitly rejects guaranteed rankings, traffic, revenue, AI answer placement, and unsupported production coverage. | Targeted source search and rendered Q/A review. |
| Buyer fit | `/contact` answers what work fits, what a deliverable may contain, what access is needed, what submission authorizes, and how the first scope decision is made. | Rendered desktop/mobile review. |
| Intake quality | The required narrative field asks for the observed problem, blocked decision, affected surface, owner, constraints, and useful next check; optional selectors include technical SEO, AI-system evaluation, analytics/research, implementation, and validation scopes. | Form label, helper, option, and accessibility checks. |
| Privacy | The form names Formspree as the processor, offers direct email as an alternative, repeats the no-secrets boundary, and does not request credentials. | Rendered form review and source search. |
| Accessibility | Controls retain labels and minimum target sizes; helper and error text are programmatically associated; invalid submit focuses the first invalid field; expandable Q/A uses native `details`/`summary`. | Browser DOM/interaction checks and TypeScript lint. |
| Responsive behavior | At 1440 × 1000 and 390 × 844, `/work` and `/contact` have meaningful first paint, no horizontal overflow or clipped primary controls, and readable CTA/form/Q/A layouts. | Browser screenshots and DOM geometry checks. |
| Submission safety | Browser QA exercises only client-side invalid validation; zero requests are made to `formspree.io`. | Network observation during the interaction loop. |
| Build integrity | Owned changes pass `git diff --check`, `npm run lint`, and the smallest relevant production build plus route smoke checks. | Command ledger below. |
| Scope integrity | The commit contains only the four allowed source files and this report; no generated output, dependency tree, release worktree, push, deploy, or merge is included. | Final `git status`, `git diff`, and commit inspection. |

## Baseline diagnosis

- `/work` had strong proof cards and explicit public/private boundaries, but the closing CTA jumped directly from artifacts to a generic project brief. It did not help a serious buyer decide which standard to inspect, what the public sample establishes, or what makes the brief actionable.
- `/contact` already provided direct email, a compact form, method/sample links, and a no-secrets warning. Good-fit work and evidence boundaries existed in the static SEO fallback, but the hydrated page did not organize them into a buyer-facing fit, scope, and objection sequence.
- The form validated identity, email, URL syntax, and message presence, but “Message” and its generic prompt did not ask for the blocked decision, affected surface, owner, known constraints, or acceptance signal.
- Existing positive controls were preserved: direct email remains primary, URL remains optional for private/pre-launch work, the honeypot and secret-pattern blocker remain, and no outcome claim is inferred from public artifacts.

## Implemented decision journey

### Work

- Added a three-step “Evidence before intake” sequence: inspect the worked finding, inspect the bounded Atlas sample, then prepare an evidence brief.
- Reframed the final CTA around one surface, one evidence gap, and the decision it blocks.
- Added concrete brief inputs and a visible no-credentials boundary beside the anchored `/contact#contact-brief-panel` action.

### Contact

- Expanded the fit surface to technical SEO, crawl evidence, AI-system evidence, and analytics/research while keeping implemented and proposed work distinct.
- Added three decision gates: fit, evidence/access boundary, and smallest useful first scope.
- Added native expandable buyer Q/A covering focused versus full audits, deliverable structure, access, outcome guarantees, authorization, and next-scope logic.
- Reworked the “Include” checklist around surface, observed problem, and decision instead of generic intake nouns.
- Added a post-mount hash handoff so `/work` reliably lands at `#contact-brief-panel` after the lazy Contact route renders. Browser QA exposed the missed-anchor race before this fix.

### Intake form

- Renamed the narrative field to “Decision / problem” and added specific, accessible helper text for URL, decision context, constraints, owner, and deadlines.
- Added technical SEO, crawl/indexation, AI-system evaluation, analytics/research, implementation-validation, focused-diagnosis, and validation/rerun options.
- Exposed busy state to assistive technology, made errors assertive, and retained focus-on-first-invalid behavior.
- Kept Formspree disclosure next to the submit control and added a direct-email alternative.

## Diagnostic Q/A

### Buyer objections

**“Is this another generic audit deck?”**

The journey now describes inspectable observations, sources, interpretation, confidence, owners, acceptance checks, and reruns. It explicitly contrasts that process with opaque scoring and unsupported outcome claims.

**“Do I have to buy a full audit before you can help?”**

No. The Q/A and form both support a focused diagnosis when the affected surface and decision are narrow. Broader scope should follow the evidence gap rather than precede it.

**“Does AI-systems work mean a vague strategy engagement?”**

No such claim is made. The fit copy is limited to evaluation traces, source boundaries, replay plans, and keeping built behavior separate from proposed work.

**“What should I bring?”**

A site or product surface, an observed or suspected evidence gap, the decision and owner it affects, known constraints, and a useful next check. A public URL helps but remains optional.

### Trust questions

**“What does the public proof establish?”**

The method is process evidence and the Atlas run is a dated, sanitized demonstration. Neither is presented as a private client outcome, ranking result, revenue result, or proof of full production coverage.

**“Will you guarantee rankings, traffic, revenue, or AI answer placement?”**

No. The page says those outcomes depend on external systems and conditions. The offer is to make evidence, decisions, acceptance checks, and uncertainty inspectable.

**“Do you need my credentials now?”**

No. The page asks for a public URL or plain-language description first, tells the buyer not to submit credentials, and states that later access must follow fit and scope.

**“Where does the form data go?”**

The UI says Formspree processes the submission and offers direct email for buyers who prefer not to use the third-party form. Provider retention, inbox delivery, and deletion behavior are not claimed.

**“What does pressing send authorize?”**

Only a request to discuss fit and scope. The Q/A explicitly says it does not authorize access, deployment, publication, or billable work.

### Mobile friction

At 390 × 844, both routes had zero horizontal overflow. The contact heading and email stayed inside the viewport; the form collapsed to one column; visible inputs and selects measured 50 pixels high; the optional-context and submit controls measured 44 pixels; and Q/A summaries measured 55–78 pixels while wrapping without clipping. The Work CTA landed the form panel 112 pixels below the viewport top after the lazy-route anchor fix.

### What remains unknown

- Actual Work → Contact click-through, form-start, completion, qualified-lead, and email-versus-form rates; no conversion telemetry was analyzed in this lane.
- Formspree inbox delivery, spam handling, retention, deletion, and failure behavior; no real submission is permitted.
- Response time, availability, pricing, commercial terms, procurement requirements, and buyer-specific scope.
- Behavior behind private systems or authenticated provider access.
- Production deployment and live cache state; this lane is local-only.
- Exact copy parity with `src/seo/staticContent.ts`. The existing static fallback already covers good-fit work, direct contact, brief inputs, and the no-secrets boundary, but the new interactive decision gates and Q/A are not mirrored because that file is outside this lane.

## Validation ledger

| Check | Result | Why it was sufficient |
| --- | --- | --- |
| `git diff --check` | Pass. | Confirms patch whitespace and conflict-marker integrity. |
| `npm run lint` | Pass: `tsc --noEmit`. | Covers the changed React component, hook, props, event handlers, and new evidence-list types. |
| `npm run build` | Pass: 518 modules transformed; Vite production bundle and static-route generation completed. | Covers production compilation, lazy chunks, Tailwind class generation, and the repository’s generated route boundary. |
| `npm run audit:style` | Pass: all style-drift budgets within caps. | Confirms the new UI stays inside the existing utility/style constraints. |
| `npm run verify:security` | Pass: 23 checks. | Confirms the form honeypot, secret-pattern block, Formspree CSP boundary, and DOM-sink protections remain intact. |
| Desktop browser QA | Pass at 1440 × 1000. `/work` and `/contact` had the expected titles/H1s, zero horizontal overflow, no framework overlay, a visible anchored form handoff, an operable Q/A disclosure, and working AI-system/validation option selection. | Exercises the actual production bundle and the primary Work → Contact interaction. |
| Mobile browser QA | Pass at 390 × 844. Zero horizontal overflow; email width 275 pixels within the 390-pixel viewport; anchored panel top 112 pixels; visible controls at least 44 pixels; Q/A summaries wrapped without clipping. | Covers the narrow-screen risks introduced by denser decision and helper copy. |
| Invalid-only form interaction | Pass. Empty submit focused `#contact-name`, marked Name/Email/Decision invalid, announced “Review the highlighted fields,” and made zero Formspree requests. | Proves local validation and focus behavior without sending a real submission. The Formspree route was also aborted as a fail-safe. |
| Screenshot review | Pass for Work decision section, Work → Contact anchor, Contact first viewport, form error state, buyer Q/A, and mobile variants. | Confirms the rendered hierarchy and spacing claims rather than relying only on source/build checks. |

The preferred in-app Browser runtime connected but could not attach a new local-preview tab in two attempts. The allowed fallback used Playwright 1.54.0 with installed Google Chrome against `http://127.0.0.1:41879`. The only console errors were local-preview 404s for `/_vercel/insights/script.js`; that Vercel Analytics endpoint is unavailable in plain Vite preview and is unrelated to this patch. No other console warning, page error, failed asset, or framework overlay appeared.

Temporary screenshots were kept outside the repository under `/tmp/portfolio-conversion-qa-20260730/`. They are QA artifacts, not commit contents.

Broader `npm run verify:seo` and live-production checks were intentionally skipped. This lane did not change canonical metadata or static fallback files, and the release owner should run the SEO verifier after deciding whether to mirror the new interactive Q/A into `src/seo/staticContent.ts`.

## Integration recommendation

Integrate only after the owned commit is reviewed alongside any release-lane changes to the same three React files. If exact crawler/static parity is a release requirement, mirror the decision-gate and Q/A semantics in `src/seo/staticContent.ts` under a separately owned change, then rerun the repository SEO verifier.
