# ElevenLabs research readback and bounded handoff

## Current result

October 13, 2026: finished [article-draft.md](article-draft.md), approximately 2,537 words by the lane's word-token check, with three actual Markdown tables. The article's commercial judgment is positive about a workflow advantage and conditional about investment value at the tender benchmark. It tests accepted narration and verified support tasks, preserves the distinction between labor capacity and cash, develops a cheaper/bundled substitute countercase, and names operating evidence that would change the call. No holdings or client history are invented.

This child owns only `pitches/elevenlabs/`. The current source-owned root record is the expanded continuation in `../../REVIEW.md`, read before work. The branch/worktree identity was resolved as `codex/startup-model-companion-20261012`, linked to the personal-site launch Git owner. Existing manuscripts, company models, companion, shared records, generators, catalogs, routes and public assets were not edited. No helpers, commits, pushes, publication or outreach were performed.

## Exact supporting facts read

These are paraphrases of the controlling first-party pages, not independent company verification. Full metadata is in [sources.json](sources.json).

| Source | Specific supporting fact | Direct source |
| --- | --- | --- |
| EL1 | ARR exceeded $500m during the first four months of 2026. Published May 5; updated September 20. | [Company ARR update](https://elevenlabs.io/blog/500m-arr-and-new-investors) |
| EL2 | September announcement: $300m employee tender at $22bn; enterprise 55% of revenue; agent conversations exceed 15m weekly. | [Tender announcement](https://elevenlabs.io/blog/tender-22bn) |
| EL3 | Credit costs depend on model/product; limited regeneration terms appear in the pricing FAQ. | [Pricing](https://elevenlabs.io/pricing) |
| EL4 | Documentation distinguishes text characters from credits, API discounts and voice multipliers. | [Credit terminology](https://elevenlabs.io/docs/help-center/account/general/have-characters-changed) |
| EL5 | Website regenerations have conditions; API does not receive that same entitlement; v3 can supply two alternatives per billed click. | [Quota documentation](https://elevenlabs.io/docs/help-center/account/general/do-i-use-quota-on-every-generation) |
| EL6 | Shared voices earn rewards, with payout rates affected by withdrawal notice period. | [Payout documentation](https://elevenlabs.io/docs/eleven-creative/voices/payouts) |
| EL7 | Call-minute billing excludes additional LLM and external carrier charges from a complete bill. | [Agents pricing](https://elevenlabs.io/pricing/agents) |
| EL8 | Transcript evaluation uses an LLM and returns success, failure or unknown with rationale. | [Success evaluation](https://elevenlabs.io/docs/eleven-agents/customization/agent-analysis/success-evaluation) |
| EL9 | Voice owners can select withdrawal notice; legacy custom rates affect credit consumption. | [Voice Library](https://elevenlabs.io/docs/eleven-creative/voices/voice-library) |

Living pricing pages are promotion-sensitive. The reviewed company pages still displayed an October 12 promotional banner at the October 13 research read. No promotional credit allowance is used in the cost models. The assumed $0.20 generated-audio rate and $0.12 all-in agent rate are intentionally hypothetical, never represented as quotes.

No current overall ARR, gross margin, retention, royalty expense, inference COGS, deployment contribution or security-rights assumption is filled in from missing evidence. May's ARR checkpoint is not combined with September's tender as a current multiple.

## Inspectable arithmetic

[model.py](model.py) uses Decimal arithmetic, consumes [inputs.json](inputs.json), and emits [model-results.json](model-results.json). Company observations are separate provenance and do not enter either workload model. Renewal holds workload, quality and cash capture fixed; it is not a retention forecast.

Base audio: 600 accepted minutes × 1.4 = 840 generated minutes; hypothetical invoice is 840 × $0.20 = $168/month. Six manual work minutes versus two workflow minutes releases 40 hours × $45 = $1,800 of labor value. Capturing half gives $900, less the invoice gives $732/month. Twelve months less $1,200 setup = $7,584 first-year cash benefit. The $300 shared coordination cost appears in both loaded-cost totals and cancels from incremental benefit.

Base agents: 10,000 tasks × 70% = 7,000 verified completions; 3,000 fallbacks × five minutes × $45/hour = $11,250. Sixty oversight hours costs $2,700; 40,000 assumed call minutes × $0.12 = $4,800. Labor relief is $37,500 − $11,250 − $2,700 = $23,550; half less the invoice gives $6,975/month. Twelve months less $12,000 setup = $71,700. Recurring cash break-even completion is ($4,800 / 50% + $2,700) / $37,500 = 32.8%. The six-minute case requires 45.6%.

### Checks actually performed

- `python3 .../elevenlabs/model.py`: generated four audio and three agent scenarios, exit 0.
- `python3 .../elevenlabs/verify_model.py`: 71 independent exact-Fraction arithmetic checks passed. It does not call model calculation functions for recomputation. Source IDs, preserved inputs, zero workloads, zero cash capture and four invalid-input cases also passed.
- Regeneration to a temporary output: byte-for-byte identical to canonical results. Attempting output at the input path was rejected with exit 2.
- Source schema: nine unique IDs, all eight requested metadata fields, October 13 verification dates, and every draft URL represented in the register. Three complete Markdown tables checked.
- Manuscript table values and nearby explanations read against generated results, including heavy rework's positive loaded advantage but negative cash, poor fit's additional labor cost, and the agent stress case.
- Scoped `git diff --check` returned no errors; the company directory is new/untracked, so a staged whitespace check remains with the root. Local direct whitespace/source checks are complete.

Canonical inputs SHA-256: `644c27d9cc4a9d5e7350f864828be3fbe223b21f4e4c454103edf8e6938204a6`.

Canonical results SHA-256: `5860e73e6a0723dc8a40904e86eaa5087333c392b81acd50826f4a027ebe8724`.

## Root integration boundary

The root still owns native article JSON, charts, browser inspection, shared work records and requested delivery. No rendered or published state is claimed here.

Suggested table IDs in manuscript order: `elevenlabs-reported-checkpoints`, `elevenlabs-accepted-minute`, `elevenlabs-agent-outcomes`. Suggested figures:

1. After the audio table, chart `loadedCostPerAcceptedMinute` across four scenarios with the $5.00 manual baseline. Caption must retain 600 accepted minutes, $45 labor, hypothetical invoice, shared coordination, and distinction from cash savings.
2. After the agent table, show base/stress monthly cash bridges, or compare `monthlyNetCashBenefit` with `monthlyTimeValueAdvantage`. State that the stress case changes both completion and call duration; it is not an isolated causal estimate.

The authored prose contains no unresolved table/figure markers, so it remains readable before chart integration. Every assumption qualification beside a table and the current-ARR/tender distinction should survive native conversion.
