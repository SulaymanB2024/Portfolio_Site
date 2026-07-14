# Bot Observer pilot launch record

This file records the production boundary for the two-week `sulayman-bowles.dev` pilot. It is operational evidence, not evidence that any claimed crawler identity is genuine.

## Fixed window

| Field | Value |
| --- | --- |
| Start | `2026-07-12T19:56:40Z` (`2026-07-12 14:56:40 CDT`) |
| End | `2026-07-26T19:56:40Z` (`2026-07-26 14:56:40 CDT`) |
| Production deployment | `dpl_9ByJKiPaUnN7xLJEUht9aHdbj8Wb` |
| Source commit | `b7c241c` |
| Event schema | `1.0.0` |
| Classifier | `2026-07-11.1` |
| Registry | `2026-07-11` |
| Collector | `2026-07-12.1` |

The production alias was still attached to this Ready deployment after the launch canary. The prior immutable deployment was `dpl_TEEzHRPjZpPY7whZYiW3AtztSvsS`.

## Launch gates passed

- The repaired capture-enabled preview stored all three selected canary requests, stored neither excluded asset/API request, and stored no query-string value.
- Production repeated the same `3/3` delivery result. The two excluded requests produced zero events, and the three retained canary identities remained `unverified`.
- Maximum canary `occurred_at` to `received_at` lag was `1010.2 ms`. Visitor responses completed in `143.5-245.6 ms`; delivery completed asynchronously after the response path.
- The new production deployment and the prior immutable deployment returned identical bodies and status codes for `/`, `/ai-information`, `/robots.txt`, `/llms.txt`, `/favicon.svg`, and the branded 404 route.
- Vercel reported no runtime error cluster after production canaries.
- All seven private tables had RLS enabled, `anon` and `authenticated` had zero table grants in `bot_internal`, the active site referenced a Vault secret, and both maintenance jobs were active.

After validation, 17 synthetic events and their 17 replay nonces were removed using a timestamp boundary before `2026-07-12T19:58:00Z`. Two later production events without validation query markers were preserved. The clean measurement set contained zero Preview events and zero events with query-parameter names at the time of the baseline query.

## Recurring jobs

| Job | Schedule | Purpose |
| --- | --- | --- |
| `bot-observer-daily-rollup` | `5 3 * * *` | Refresh daily reporting aggregates. |
| `bot-observer-retention` | `17 3 * * *` | Enforce Preview, suspicious-event, raw-event, and aggregate retention. |

## Measurement gap at launch

No recurring synthetic delivery probe was scheduled. Vercel Hobby would require new authenticated API-route cron machinery and would add synthetic page requests to the report stream; the available Supabase `pg_net` alternative is beta and was not enabled solely for this pilot. Do not infer a delivery-loss rate from organic traffic or missing events.

The day-14 event-delivery gate is therefore valid only if the two daily probes specified in the runbook are sent and recorded during the window. If that evidence is absent, report event loss as a measurement gap, not as zero loss or a failed site.

## Day-14 decision contract

At or after the fixed end timestamp, evaluate the five runbook measures: event delivery, false classification, middleware overhead, database volume, and decision usefulness. Choose exactly one outcome: expand unchanged, revise and repeat, retain only aggregates, or disable collection. Do not deploy to another site before that review.
