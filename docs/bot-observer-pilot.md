# Bot Observer Phase 1 pilot

This runbook covers the two-week `sulayman-bowles.dev` pilot. The system is a passive request observer, not a bot-identity authority and not a replacement for endpoint protection.

## Evidence model

Every report must preserve three independent dimensions:

- `observed_class`: what the request looked like (`self_identified_bot`, `suspected_automation`, or `ordinary_browser`).
- `claimed_bot_id`, `claimed_operator`, and `purpose`: what a versioned registry infers from the request's self-declared user agent.
- `verification_status`: whether the claimed identity has been independently verified. Phase 1 records `unverified`; later adapters may add published-range, reverse-DNS, or signed-identity verification.

Use wording such as:

> OAI-SearchBot user agent observed; identity not independently verified.

Do not report a claimed user agent as proof that an operator fetched, indexed, understood, cited, or trained on the page.

## Phase 1 architecture

```text
selected public GET/HEAD request
  -> Vercel Routing Middleware
  -> deterministic local classifier and redactor
  -> HMAC-signed, best-effort HTTPS POST via waitUntil()
  -> Supabase Edge Function collector
  -> private bot_internal Postgres schema
  -> four core reporting views plus focused diagnostic views
```

The request path performs no DNS, IP-range, third-party, or LLM lookup. Collector delivery is deliberately fail-open: logging failure must not alter the visitor response.

### Observed routes

- `GET` and `HEAD` document requests.
- `/robots.txt`, `/sitemap.xml`, `/sitemap-*`, and `/llms.txt`.
- Public PDFs and important machine-readable public resources.

### Excluded routes

- `/api/*`, health checks, and any non-`GET`/`HEAD` request.
- `/_next/*`, `/assets/*`, images, fonts, CSS, JavaScript bundles, and source maps.
- Forms, authentication, lead capture, and expensive actions. Those need separate instrumentation and targeted BotID, rate-limit, or WAF controls.

## Configuration contract

Never commit values for the following variables. Use separate credentials per site and environment.

### Vercel project

| Name | Required | Meaning |
| --- | --- | --- |
| `BOT_OBSERVER_ENABLED` | Yes | Explicit kill switch. Only the exact string `true` turns capture on. |
| `BOT_OBSERVER_COLLECTOR_URL` | Yes | HTTPS URL of the deployed `bot-event-collector` Edge Function. |
| `BOT_OBSERVER_SITE_ID` | Yes | Stable non-secret identifier for this site. It must match a collector configuration entry. |
| `BOT_OBSERVER_HMAC_SECRET` | Yes | Per-site HMAC secret shared only with the collector. |

Vercel supplies deployment metadata such as environment, deployment ID, and Git commit SHA. Do not duplicate those values as secrets. Scope pilot credentials to Preview first, then Production only after the preview gate passes.

### Supabase Edge Function and Vault

| Name | Required | Meaning |
| --- | --- | --- |
| `SUPABASE_DB_URL` | Hosted default | Server-side Postgres connection used by the collector. Never expose it to the browser or Vercel client bundle. |
| `BOT_OBSERVER_SITE_CREDENTIALS` | Optional fallback | JSON credential map for local/self-hosted operation. Hosted production reads the per-site HMAC secret from Supabase Vault instead. |

The hosted credential is encrypted at rest in Supabase Vault. `bot_internal.sites.hmac_secret_id` references the active Vault entry; only the server-side direct database connection reads `vault.decrypted_secrets`. Never grant browser/API roles access to the Vault view or the private observer schema.

The collector contract is:

- `POST` with `content-type: application/json` only.
- Maximum streamed body size: 32 KiB.
- Headers: `x-bot-log-site-id`, `x-bot-log-timestamp`, `x-bot-log-nonce`, and `x-bot-log-signature`.
- Signing input: `site_id + "." + timestamp + "." + nonce + "." + sha256(body)`.
- Timestamp tolerance: plus or minus 300 seconds. `occurredAt` must also be close to the signed timestamp.
- Host must be allow-listed for the selected site ID.
- Consumed nonces are stored only as hashes and cannot be replayed.
- Authentication failures intentionally use generic 4xx responses; they must not reveal which credential check failed.

The HMAC authenticates the sending website. It does **not** verify a crawler's claimed identity.

## Database contract

The migration creates a private `bot_internal` schema. It is not included in Supabase's exposed Data API schemas.

Core objects already provisioned in the hosted project:

- `bot_internal.sites`
- `bot_internal.important_pages`
- `bot_internal.bot_events`
- `bot_internal.ingest_nonces`
- `bot_internal.bot_verifications`
- `bot_internal.bot_registry`
- `bot_internal.daily_bot_rollups`
- `bot_internal.refresh_daily_bot_rollups(...)`
- `bot_internal.enforce_retention(...)`

Initial reporting views:

- `bot_internal.bot_activity_daily`
- `bot_internal.bot_activity_by_operator`
- `bot_internal.bot_activity_by_purpose`
- `bot_internal.top_bot_requested_pages`

Raw events are append-only collector input. Reports should use views or rollups. Do not grant `anon` or `authenticated` direct access to the private schema. Database credentials with broad privileges remain server-side.

## Deployment order

1. **Inspect the selected Supabase target.** Confirm the intended project, region, status, and Postgres version. The hosted project already contains the `bot_observer_initial` and `bot_observer_advisor_hardening` migrations; local filenames use those hosted migration versions to prevent accidental replay.
2. **Apply only pending upgrades.** Run migrations locally first. On the selected hosted project, apply only the Vault credential/retention upgrade. Verify all seven tables, functions, views, grants, nonce uniqueness, and the retention routine before any site sends events.
3. **Configure the collector.** Create a random per-site HMAC secret in Supabase Vault, attach its UUID to `bot_internal.sites.hmac_secret_id`, and deploy `bot-event-collector` without Supabase JWT enforcement because the function performs its own HMAC authentication. Transfer the secret to Vercel through a masked or encrypted channel; never print it in a command, log, report, or artifact.
4. **Exercise collector rejection paths.** An unsigned request, an invalid content type, an oversized body, a stale timestamp, a bad signature, a wrong host, and a replayed nonce must all be rejected without inserting an event.
5. **Exercise one valid signed event.** Confirm exactly one raw event and one consumed nonce, then refresh and inspect the core reporting views.
6. **Configure Vercel Preview.** Add the four Vercel variables to Preview only and redeploy. Keep the observer disabled until the collector checks pass.
7. **Run the preview canary.** Enable capture, request one selected route with a known crawler user agent, one ordinary-browser request, and several excluded routes. Confirm the visitor responses are unchanged, exactly the selected requests arrive, and all identities remain `unverified`.
8. **Promote deliberately.** Add Production-scoped values, redeploy, and repeat the canary against `sulayman-bowles.dev`. Record the deployment ID, commit SHA, classifier version, and registry version that begin the pilot window.
9. **Start the two-week scorecard.** Record daily delivery probes, classification review, middleware timing, table size, and decisions in one dated worksheet. Do not add a second site until the exit review.

Migration, collector, Vercel environment, and production promotion are separate observable stages. A successful local test does not prove any hosted resource is configured.

## Local validation

From the repository root:

```bash
npm run test:bot-observer
npm run verify:bot-observer
npm run lint
```

The focused test command covers classification, route selection, redaction, signing, tamper rejection, and strict event-schema behavior. The structural verifier checks the crossed boundaries among middleware, collector, and migration. `npm run lint` is the smallest repository-wide TypeScript contract check justified by the new root middleware and shared package.

When Docker and the Supabase CLI are available, add the persistence boundary check:

```bash
supabase db reset --no-seed
supabase functions serve bot-event-collector --no-verify-jwt --env-file supabase/.env.local
```

Keep `supabase/.env.local` untracked. Use test-only credentials and never print them in logs or shell history.

Run `npm run build` once before production promotion because middleware integration crosses the deployment boundary. A browser visual pass is not required: Phase 1 changes no rendered UI. Instead, compare HTTP status, redirect, cache, and response-body behavior for selected and excluded routes with capture enabled and disabled.

## Remote validation

Use a unique preview URL and verify it before the production domain.

```bash
# Selected route; should keep its normal response and create one event.
curl --fail-with-body --silent --show-error --head \
  --user-agent 'OAI-SearchBot/1.0' \
  'https://PREVIEW_HOST/ai-information?campaign=must-not-be-stored'

# Ordinary browser; should keep its normal response and remain ordinary_browser.
curl --fail-with-body --silent --show-error --head \
  --user-agent 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/138 Safari/537.36' \
  'https://PREVIEW_HOST/about'

# Excluded static image; should create no passive event.
curl --fail-with-body --silent --show-error --head \
  'https://PREVIEW_HOST/favicon.svg'

# Unsigned collector request; should return a generic 4xx and insert nothing.
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  --request POST --header 'content-type: application/json' --data '{}' \
  'https://SUPABASE_PROJECT.supabase.co/functions/v1/bot-event-collector'
```

Replace the example hosts; do not paste secrets into these commands. Verify the database from a privileged SQL session:

```sql
select occurred_at, site_id, host, path, observed_class,
       claimed_operator, purpose, verification_status,
       query_parameter_names, redacted_referrer_origin
from bot_internal.bot_events
order by received_at desc
limit 20;

select * from bot_internal.bot_activity_daily order by date desc limit 20;
select * from bot_internal.bot_activity_by_operator order by date desc limit 20;
select * from bot_internal.bot_activity_by_purpose order by date desc limit 20;
select * from bot_internal.top_bot_requested_pages order by date desc limit 20;
```

Confirm that query **names** may appear but query values do not; referrers contain only a normalized origin; and cookies, authorization values, request bodies, emails, and raw IPs are absent.

## Two-week acceptance scorecard

Use a fixed start and end timestamp and make the go/no-go decision from the five measures below.

| Measure | How to measure | Pilot acceptance gate |
| --- | --- | --- |
| End-to-end event delivery | Send at least two synthetic requests per day to selected routes, give each a unique non-sensitive query-parameter **name**, and check arrival within 10 minutes. Record probes sent and rows received. | At least 98% arrive; no unexplained gap longer than 24 hours. This measures synthetic delivery, not absolute loss for all organic traffic. |
| False classification | Manually review every unmatched automation UA plus a stratified sample of at least 100 captured rows across registry matches, `isbot` fallback, and ordinary browsers. | No fallback result asserts an operator or purpose; no verified identity is inferred from UA alone; at least 98% of sampled observed classes need no rule correction. |
| Middleware overhead | Compare capture enabled vs disabled on the same preview deployment using repeated selected and excluded requests; inspect Vercel middleware duration and response errors. | No response/status/body regression, no visitor-facing error attributable to logging, and p95 added middleware duration at or below 5 ms. Investigate any p95 TTFB increase above 10 ms. |
| Database volume | Record daily rows, raw-table bytes, index bytes, and projected 90-day size with `pg_total_relation_size`. | Projected raw-plus-index footprint stays below 250 MiB for this site, retention completes, and no unexplained day grows more than 5x the prior seven-day median. |
| Decision usefulness | Keep a dated list of actions that the page/operator/purpose reports supported and whether ordinary analytics already supplied the same evidence. | At least two concrete decisions are attributable to this observer and unavailable from ordinary analytics. Otherwise keep it as a limited diagnostic or stop expansion. |

Suggested size query:

```sql
select
  count(*) as rows,
  pg_size_pretty(pg_relation_size('bot_internal.bot_events')) as table_size,
  pg_size_pretty(pg_indexes_size('bot_internal.bot_events')) as index_size,
  pg_size_pretty(pg_total_relation_size('bot_internal.bot_events')) as total_size
from bot_internal.bot_events;
```

At the end of day 14, choose one outcome: expand unchanged, revise and repeat the pilot, retain only aggregates, or disable collection. Do not expand merely because requests were recorded.

## Fail-open behavior and rollback

Expected behavior:

- Classification and event construction are synchronous and bounded; delivery runs through `waitUntil()`.
- Missing or invalid observer configuration disables capture.
- A timeout, DNS failure, non-2xx collector response, schema rejection, or database error is contained in the background logging task.
- Middleware never challenges, redirects, rewrites, or blocks a visitor because of observer classification.

Rollback sequence:

1. Set `BOT_OBSERVER_ENABLED=false` (any value other than the exact string `true` disables capture), or remove the observer variables from the affected Vercel environment, then redeploy.
2. Confirm selected and excluded routes still return their normal responses and no new events arrive after the deployment timestamp.
3. If necessary, undeploy or rotate the collector's site entry after Vercel capture is off. Rotate the HMAC secret immediately if exposure is suspected.
4. Preserve existing rows under the documented retention policy while investigating. Do not drop the schema as an emergency first step; destructive cleanup is a separate reviewed operation.

Disabling the collector alone is safe for visitors but creates deliberate event loss. Prefer disabling at Vercel first when performing a planned rollback.

## Privacy boundaries

Phase 1 may store request metadata needed for bot-traffic analysis, including the user agent, selected route, query-parameter **names**, normalized referrer origin, coarse deployment metadata, claimed identity fields, and rule/version evidence.

Phase 1 must not store:

- Raw cookies or `Authorization` headers.
- Request bodies, form contents, or email addresses.
- Full header sets.
- Query-string values or unredacted referrer paths/queries.
- Raw IP addresses or a permanent visitor identifier.
- A stable cross-year fingerprint.

The schema may reserve later verification or fingerprint columns, but Phase 1 does not populate rotating IP hashes, JA3/JA4 clusters, reverse-DNS results, published-range matches, or signed-bot identity. Preview data is retained for seven days; captured suspicious events for no more than 30 days; raw accepted events for 90 days; daily aggregates for 13 to 24 months; registry and verification history may be retained indefinitely. Rejected collector requests insert no event. Apply the shortest period that supports the pilot, disclose the analytics purpose, and revisit retention before adding another site.

## Claims boundary

Allowed language:

- Request observed.
- Claimed identity from user agent.
- Purpose inferred from the versioned registry and published crawler documentation.
- Identity unverified.
- Middleware capture succeeded.

Never claim from this dataset alone that:

- A page was indexed, understood, cited, or added to a training corpus.
- The requester was genuinely the organization named in its user agent.
- A missing log proves that an operator never accessed the content through a proxy or another service.
- JA3/JA4, an IP range, or a behavioral rule is a definitive identity without the corresponding verification evidence.

## Explicit Phase 1 exclusions

- No global bot blocking, challenge, or redirect behavior.
- No Vercel BotID, rate-limit, or WAF policy changes; those remain a separate endpoint-protection lane.
- No Cloudflare reverse proxy, Worker, Queue, or additional provider ingress.
- No deployment to `sulayman-bowles.tech` or `void-agency.com`.
- No VOID rendering or prerendering changes.
- No IP-range, reverse-DNS, or Web Bot Auth verification adapter.
- No rotating IP hashes or JA3/JA4 clustering.
- No authenticated CSV/JSON export API, dashboard, alerting, or large asynchronous export jobs.
- No LLM classification and no network lookup in middleware.
- No proof of indexing, training, citation, or operator identity.

Phase 2 begins only after the two-week scorecard identifies a concrete reason to add complexity.
