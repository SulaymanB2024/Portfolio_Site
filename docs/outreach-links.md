# Automatic portfolio links

## Current implementation record

- Requested result: entering a company in the existing recruiting workbook's Portfolio Links tab automatically creates and verifies a stable homepage alias and makes company arrivals available in GA4.
- Source: production `main` at `e20e0e5edf656fcbb06c257ac32932608f8d5efd`, isolated branch `codex/outreach-sheet-sync-20261008`. The launch repository's 336 dirty entries and other worktrees are preserved.
- Retained decisions: identical homepage, company path stays visible, real 404s, initial curated 50, existing `G-9VQ15148TG` tracker and privacy settings, Google Sheets as ongoing control panel.
- Relevant prior context read: project surface routes, launch README, analytics setup and source, Vercel routing, Google trigger restrictions, validation/browser/artifact policies.
- Acceptance: API-added row becomes a live alias on scheduled reconciliation without manual sync or redeployment; all 50 URLs verified; real unknown 404; one outreach arrival event; published GA4 dimension and exploration.
- Implemented/local: server, client, source-controlled Apps Script and seed. Full suite passed 609 tests (0 failures), bot observer 19 tests, typecheck/build/release gate passed. Desktop and 390×844 mobile homepage rendering inspected, no horizontal overflow; About→Home hash navigation and root canonical verified. Final full suite and build/release checks include the query-routing fix; its remote deployment gate is still pending. The later propagation-delay/status-copy changes receive the focused outreach checks.
- Spreadsheet: [Portfolio Links](https://docs.google.com/spreadsheets/d/1WDUFFDYgXqCXGwglBDpr2qB6pUtVpcJw04lMMQohuFA/edit#gid=679353431) contains headers and first 49 companies, Pending setup. Boston Consulting Group is held for the programmatic-ingestion acceptance test. No Live URLs have been written.
- Script: [bound project](https://script.google.com/u/0/home/projects/1uAupOOAIDrWfvFLl4hOPhzF0qAdL8yEmcV8ccBufVtUGfVwyfjk6JDxY/edit), name Portfolio Links — Automatic website sync, owner `sulayman.bowles@gmail.com`. Latest race fixes and Acceptance.gs saved in Google. Before running, update Code.gs once more for the final 3s/8s propagation delays. No secret or triggers configured. Initial installer stopped at its explicit missing-secret validation.
- GA4: property Personal Website `520454432`, stream `13322543198`, existing measurement ID retained. Event-scoped Outreach company (`outreach_company`) created and verified. Saved [Recruiter outreach](https://analytics.google.com/analytics/web/#/analysis/a381078978p520454432/edit/fR45np1jQrWheqdOfQDvVQ): Company arrivals tab; rows Outreach company; values Event count and Total users; filter Event name exactly outreach_visit; 50 rows. Reload confirmed settings saved. Zero outreach data expected until publication/arrival proof.
- Vercel: Hobby team `team_MYMuDXoBrKio5LKLLvZWfXef`, project portfolio-site `prj_XG5xtn0h0aR7D7ek9cqxHdYzqDac`. User separately approved store replacement and associated Statsig collection deletion. Native CLI removed only statsig-emerald-car, and Global Config listing verified empty afterward. Created portfolio-outreach `ecfg_krrnukoe4kchhoa2oolf5t2pn8lu`; bootstrapped the first 49 companies for routing validation, without temporary row-ID mappings. This is initial setup, not evidence of automatic ingestion. Sensitive GLOBAL_CONFIG and plain OUTREACH_CONFIG_ID/OUTREACH_TEAM_ID are configured for Production and Preview. Production website has not been changed.
- Recovery backup: old Statsig config stored in ignored `.cache/outreach-verification/statsig-store-backup.json`, mode 0600, SHA256 `668a666d4e2703824cf2c316acfceee05f6e165d38bbebb93becfd225832cb65`. The old URL/tokens were revoked by approved collection removal; the backup is config data only, not a Statsig account backup.
- Independent review: accepted and fixed stale whole-column UUID writes; post-write sorting/verification cache; public query overriding captured company slug. Tests exercise pre-network sorting, post-network sorting, writeback sorting, retries, edited outputs, collisions and duplicate normalization.
- Remote preview: [draft PR81](https://github.com/SulaymanB2024/Portfolio_Site/pull/81), commit d3d33fb779bc156a90778fed5564c060ff634963. The preview build and Generated output integrity passed, but company paths fell through to the static 404. Direct API requests selected the packaged handler, isolating the defect to alias routing. Removed the request.path transform; the next remote gate must verify original public paths reach the function.
- Browser: personal Sulayman Chrome, authenticated Google/Vercel identities verified. Connection IDs change after lock/reconnect; recover exact Apps Script/report/store tabs from fresh inventory rather than using old IDs. Mac lock repeatedly interrupted browser writes; CLI handles available native Vercel operations.
- Credential boundary: approved dedicated team writer portfolio-outreach-writer, expiry October 8, 2027. Native Vercel token creation returned 403 Cannot create tokens for this app; no writer token was created. Personal Chrome has the token name/team/1-year expiry prepared and a two-variable Secret form prepared for Production and Preview. Apps Script has an unsaved OUTREACH_SYNC_SECRET property with a blank value. The browser credential-entry contract requires user entry/submission; do not expose or copy credential values into chat, source or documentation.
- Next boundary: validate the corrected remote preview; configure writer token and matching shared sync secret, save final script, authorize triggers, publish on current production main, verify all links and GA4 arrival, then prove BCG added by Spreadsheet service API goes live during a scheduled run without manually syncing or redeploying.

## Homepage integration contract

The current production build is the template: `api/outreach-home.ts` packages `dist/index.html` and `dist/404/index.html`. It injects only approved outreach-company metadata; it copies no homepage markup/style/assets into a separate page.

For the parallel design integration at `sulayman-site-refinements-merge-20261007`, apply only these narrow existing-file hunks alongside the new API/lib/script/test files:

- `PersonalSite.tsx`: import documentOutreachSlug and pass its result as the fourth resolveRoute argument in `path()`.
- `editorial/routes.ts`: optional fourth argument and approved single-slug Home resolution after existing route/redirect logic, with hash precedence retained.
- `analytics.ts`: matching document metadata gives one outreach_visit per document; current public canonical page views and privacy behavior retained.
- `vercel.json`: registered alias handler after redirects/filesystem resolution, ordinary rewrite preserving the public request path, packaged home/404 files. Verify the public path on the remote deployment.
- `vite.config.ts`: local fixture preview plugin; package/TypeScript additions for server handlers.

Keep the design integration's accepted homepage, résumé CTA, About/Chegg/Sapien copy, article list and other design assets. Do not replace those sources from this older baseline. After integration rebuild the actual current homepage and repeat the alias rendering/routing gates.

## Operation

The Portfolio Links tab is the publication source. Add a company in column A; the automation owns columns B–F. Published URLs are retained when rows are removed. Slugs remain stable when rows are reordered or company labels change.

Runtime routing uses a durable Vercel Global Config snapshot rather than contacting Google Sheets during a page visit. The Apps Script edit trigger handles user edits; five-minute reconciliation also handles API changes, retries, and failed writeback. Unchanged input does not consume a config write.

## Ownership and recovery

- Automation owner: `sulayman.bowles@gmail.com`, running the bound script's installable edit trigger and five-minute time trigger. Keep exactly one script owner/writer; ScriptLock serializes that script's runs. Running installOutreachAutomation again replaces only this project's outreach triggers and reconciles current rows.
- Publication source: Portfolio Links, columns A–F. Column A is company input; B–F are generated. Column F is hidden by the installer and must stay attached to its company when sorting. The script detects interrupted row movement, retries and validates writeback rather than caching incorrect generated outputs.
- Server: portfolio-site under `sulaymanb2024's projects`; registry key outreach_companies in portfolio-outreach. GLOBAL_CONFIG is the reader; OUTREACH_VERCEL_TOKEN is the approved team writer. Keep the writer in the server's sensitive environment variable, never in Apps Script or browser bundles. Rotate before its confirmed expiry and redeploy once so the function uses the replacement.
- Signing secret: the same at-least-32-character random OUTREACH_SYNC_SECRET in Vercel and Script Properties. For rotation, update both and redeploy; reconcile after they match. No secret is committed or documented.
- A Sync error or Pending verification retains published links and retries on the next clock run. Check Apps Script Executions for the failed run, matching signing secrets, writer expiry/scope, Global Config usage and website availability. After fixing the cause, wait for the next scheduled run or explicitly run reconcilePortfolioLinks for recovery; the scheduled-ingestion acceptance test must not invoke this recovery step.
- An accidentally deleted row does not remove a published alias. Restore/add the company and its normalized identity will reuse the existing URL. For an accidentally changed label, restore the text on the same record ID; the published slug stays stable.
- Keep the registry and its reader connected during ordinary website releases. The handler packages the current build's homepage and 404. Merge into current main and rebuild so parallel accepted design changes remain the template.
- [Current Vercel limits](https://vercel.com/docs/global-config/global-config-limits): 1 MB per store and one store on Hobby; 100 included writes and 100,000 included reads. Batch edits and unchanged-input skipping avoid continuous writes. No paid-plan upgrade is configured. Updates can take up to 10 seconds to propagate; verification retries cover that interval.

## Delivery gates still pending

Remote preview must prove the homepage and 404 files are packaged and public paths reach the function. Verify /google, /google?slug=stripe, duplicate/encoded query keys, /not-registered?slug=google (404), /api/outreach-home?slug=google (404), HEAD, canonical and security headers. Successful aliases retain the root canonical; 404s retain the existing /404 canonical. Then verify production desktop/mobile rendering, hash navigation and a single actual GA4 outreach_visit arrival.

Run appendScheduledAcceptanceCompany only after the initial 49 are live. It writes Boston Consulting Group using the Spreadsheet service API without an edit trigger or sync call. Record its timestamp, the unchanged production deployment ID, the subsequent time-trigger execution and the verified /bcg result plus spreadsheet writeback. Only that observation proves automatic API-added-row ingestion; a bootstrap config write, local mock or manual reconcile does not.
