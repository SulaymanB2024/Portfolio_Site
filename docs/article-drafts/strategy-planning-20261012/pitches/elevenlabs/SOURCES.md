# ElevenLabs source and assumption register

Research read October 13, 2026. Publication dates describe the evidence period; verification dates describe this read. All sources below are first-party, so company commercial claims retain company-reported status.

| ID | Controlling source | Date / status | Supported claim and limit |
| --- | --- | --- | --- |
| EL1 | [ARR update](https://elevenlabs.io/blog/500m-arr-and-new-investors) | Published May 5, 2026; updated September 20 | More than $500m ARR during the first four months of 2026. A historical lower bound; no current ARR or audited revenue is inferred. |
| EL2 | [Employee tender announcement](https://elevenlabs.io/blog/tender-22bn) | Published September 30, 2026; updated October 5 | $300m tender at $22bn valuation; enterprise 55% of revenue; agents handle more than 15m conversations weekly. Specific security rights, revenue-period definition and verified resolutions are not disclosed. |
| EL3 | [Pricing](https://elevenlabs.io/pricing) | Living page read October 13 | Billing depends on model, product, plan and route; allowances and promotions are date-sensitive. No enduring price per finished minute follows from the displayed credits. |
| EL4 | [Credit terminology](https://elevenlabs.io/docs/help-center/account/general/have-characters-changed) | Living documentation read October 13 | Explains characters, credits, API discounts and voice multipliers. General explanation does not override the selected model's actual meter. |
| EL5 | [Generation quota](https://elevenlabs.io/docs/help-center/account/general/do-i-use-quota-on-every-generation) | Living documentation read October 13 | Generations consume quota; free website regenerations are conditional. Describes v3's two alternatives per billed click; no universal one-output/one-charge rule. |
| EL6 | [Voice payouts](https://elevenlabs.io/docs/eleven-creative/voices/payouts) | Living documentation read October 13 | Shared voices can earn rewards; notice period influences payout rate. Aggregate royalty/licensing expense remains unknown. |
| EL7 | [Agents pricing](https://elevenlabs.io/pricing/agents) | Living page read October 13 | Call-minute billing; LLM costs are additional; external telephony provider bills directly. Marginal minute price is not total deployment cost. |
| EL8 | [Success evaluation](https://elevenlabs.io/docs/eleven-agents/customization/agent-analysis/success-evaluation) | Living documentation read October 13 | LLM evaluates transcripts against custom criteria with success/failure/unknown. Underlying task execution and repeat contact require separate verification. |
| EL9 | [Voice Library](https://elevenlabs.io/docs/eleven-creative/voices/voice-library) | Living documentation read October 13 | Owner-selected withdrawal notice and legacy voice multipliers. Availability is not assumed permanent or exclusive. |

## Model authority

[inputs.json](inputs.json) controls two hypothetical buyer workloads, not ElevenLabs forecasts. Observed company facts are isolated in `observedCompanyFacts` and are not fed into either cost model. Dollar values are USD. No scenario probabilities are assigned.

Audio holds accepted output at 600 minutes per month, values human time at $45/hour, and compares six manual work minutes per accepted minute with four alternative review/rework workloads. A hypothetical $0.20 effective invoice per generated minute includes allocated subscription/overage costs; generated duration is measured, never converted from characters. Common $300/month coordination appears in both loaded-cost totals. Positive labor relief becomes cash at 50%; additional labor is charged fully. $1,200 setup is first-year only.

Agents holds eligible unique tasks at 10,000 per month. Each has one agent attempt, followed by full five-minute human work if verification fails. The assumed $0.12 all-in minute invoice includes platform, model, carrier and allocated plan costs. Sixty oversight hours per month remain. A hypothetical seven-day repeat-contact window defines completion. Positive labor relief becomes cash at 50%; $12,000 setup is first-year only. No harm, customer waiting or undetected-error loss is priced. These exclusions cannot justify counting failed work as completion.

Renewal repeats the selected workload, quality and cash-capture assumptions. It is not a retention forecast. Missing company inference costs, royalty expense, delivery cost, retention, current ARR and preference terms stay unknown rather than becoming zeros.

Run `python3 model.py` from this directory, or pass explicit `--inputs` and `--output` paths. It uses the Python standard library and requires no network, credentials or dependency installation. [research-readback.md](research-readback.md) records the arithmetic checks and root handoff boundary.
