# Portfolio audience and search growth sprint decision journal

Status: local implementation evidence, August 11, 2026. No account change,
push, preview, merge, deployment, provider submission, indexing action, or
baseline collection is recorded as complete.

This is a branch-local receipt mirror. The canonical Hermes worktree changed to
an unrelated dirty branch during execution, so it was initially preserved
untouched. After that work committed cleanly, the canonical journal, ledger,
and handoff were updated in Hermes commit
`2a05900045a34260ec9c3db7ce648c0e7972f493`.

## 2026-08-11 — Measurement contract

- Phase: measurement implementation.
- Question: how can sessions be compared across four sites without broadening
  VOID's domain-specific Hermes collector?
- Evidence: GA4 supports one web stream across explicitly configured domains;
  the sprint requires a fixed `portfolio_site` value, one page view per route,
  exact production-host gates, and a separate Search Console fact set.
- Assumption: the approved portfolio property will use
  `America/Los_Angeles`, one shared web stream, and policy-only loading after
  owner/privacy review.
- Decision: add a fail-closed public measurement-ID interface to each site,
  keep VOID's existing property, and do not change the Hermes collector.
- Uncertainty: the property, stream, cross-domain UI setting, saved report,
  DebugView, Realtime, and next-day Data API rows do not yet exist as verified
  receipts.
- Simpler alternative: use four separate GA4 properties and combine exports.
  Rejected because it creates recurring aggregation and identity work.
- Validation: unit/browser tests verify the four-host allowlist, fixed site
  values, query stripping, no form-value collection, no local provider
  requests, and one local route receipt.
- Outcome: local implementation is green; measurement remains disabled until
  a valid public ID is separately approved and configured.

## 2026-08-11 — Search and page queue

- Phase: evidence-gated page implementation.
- Question: which page changes have enough demand evidence to stage without
  releasing the broader candidate branches?
- Evidence: the retained planning snapshot reported 8,537 portfolio Google
  impressions and 41 clicks. Page snapshots were: toll roads 799 impressions,
  4 clicks, position 9.84; robots.txt 164 impressions, 0 clicks, position 9.69;
  VOID checklist 2,152 impressions, 1 click, position 47.51; Jane Street 415
  impressions, 4 clicks, position 8.26.
- Assumption: the recorded page windows are complete and non-overlapping as
  documented in the planning evidence. A restored read-only preflight must
  revalidate them before production.
- Decision: stage the gated toll-road, robots.txt, and Jane Street titles plus
  their approved content changes; keep the VOID title; port only the technical
  audit workspace; give Operator analytics only.
- Uncertainty: current provider data cannot be recollected because Google OAuth
  returns `invalid_grant`.
- Simpler alternative: publish more pages or release the broad candidate
  branches. Rejected because demand and rollout evidence do not support it.
- Validation: route-specific SEO, metadata, internal-link, build, and browser
  checks pass for the three content sites; the VOID workspace passes save,
  restore, filter, CSV, JSON, Markdown, print, privacy, and mobile checks.
- Outcome: only the approved four-page queue is staged. The broad candidate
  branches remain unchanged.

## 2026-08-11 — Release isolation

- Phase: handoff and promotion control.
- Question: how should local implementation remain useful without implying a
  measurement PR, content release, or production approval?
- Evidence: the user authorized implementation but explicitly withheld push,
  merge, deployment, account mutation, submission, and indexing authority.
- Assumption: future releases will start from revalidated remote main and will
  receive exact per-commit approval.
- Decision: make local commits only, record measurement-only path manifests,
  and require selective porting rather than wholesale deployment of the sprint
  branches.
- Uncertainty: the current remote-main state, preview receipts, and Vercel
  commit-bound deployment receipts will change before any release window.
- Simpler alternative: push the sprint branches as ready-to-merge PRs. Rejected
  because external mutation and release timing are not authorized.
- Validation: local branch bases, prior candidate-branch tips, changed paths,
  tests, builds, and rollback boundaries are recorded in the handoff.
- Outcome: no external state changed. Analytics can be ported first; page work
  remains gated behind the baseline and weekly sequence.
