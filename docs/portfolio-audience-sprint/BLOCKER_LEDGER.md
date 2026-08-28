# Portfolio audience and search growth sprint blocker ledger

Unknown or unavailable provider data is never represented as zero.

| ID | Gate | Evidence | Required next action | State |
|---|---|---|---|---|
| PA-001 | Google read-only preflight | OAuth returns `invalid_grant`; no replacement zero was recorded. | Restore the approved Google OAuth authorization, then rerun read-only GA4 and Search Console preflight. | Blocked |
| PA-002 | Portfolio GA4 property and web stream | No verified property, stream, measurement ID, `America/Los_Angeles` setting, cross-domain configuration, or Signals setting receipt exists. | With exact account-mutation approval, create and inspect the dedicated property and shared stream. | Blocked |
| PA-003 | Public build configuration | `VITE_PORTFOLIO_GA_MEASUREMENT_ID` and `PORTFOLIO_GA_MEASUREMENT_ID` intentionally remain unset. | Add the approved public ID to each exact production project only after disclosure and preview approval. | Blocked |
| PA-004 | Live analytics QA | DebugView, Realtime, and next-day Data API rows cannot exist while the ID is unset and nothing is deployed. | Verify one initial page view and one accepted SPA navigation per applicable host, then confirm next-day rows for all four hosts. | Blocked |
| PA-005 | Fourteen-day baseline | The baseline has not started; target-page metadata and material content have not entered a production freeze. | Start only after PA-001 through PA-004 are green; restart if a host is missing or duplicates page views. | Blocked |
| PA-006 | Production release sequence | No push, PR, preview, merge, deployment, Vercel receipt, provider submission, or indexing action is authorized. | Obtain the exact approval for each next action and reconcile current remote main before it. | Blocked |
| PA-007 | Disclosure review | Technical disclosure copy is staged and explicitly does not claim legal compliance. | Obtain site-owner/privacy review before production enablement. | Blocked |
| PA-008 | Operator repository-wide SEO verifier | The existing `/dashboard` crawlable summary is 48 words against a 120-word verifier floor; the same source exists on `origin/main` and is outside this analytics-only release. | Resolve in a separately scoped Operator content change; do not expand this sprint. | Open, non-blocking for focused analytics tests |
| PA-009 | Canonical Hermes documentation | The worktree collision resolved cleanly, and the canonical journal, ledger, and handoff were updated in `2a05900045a34260ec9c3db7ce648c0e7972f493`. | No remaining action. | Closed |
| PA-010 | VOID repository-wide smoke suite | The four-worker sweep reached 317 of 711 cases: 297 passed, 19 failed on an external Google Fonts `.woff2` request returning 404, one was interrupted, and 394 did not run. The changed-surface suite is green, and `/privacy` passed alone. | Before any VOID production commit, rerun the complete suite with deterministic/self-hosted font handling or a verified network condition and require a fully green receipt. | Blocked for production, non-blocking for local changed-surface handoff |
