# Link-Building Completion Audit

Generated: 2026-06-25

## Completed In This Repository

| Item | Evidence / scope | Status |
| --- | --- | --- |
| Authority playbook | docs/link-building/authority-playbook.md | done in repo |
| Outreach templates | docs/link-building/outreach-templates.md | done in repo |
| Prospect tracker | docs/link-building/prospect-tracker.csv | 60 rows |
| Live priority prospect evidence | docs/link-building/live-prospect-evidence.csv | 30 verified source checks |
| Owned profile update drafts | docs/link-building/owned-profile-updates.md | copy-ready, not applied externally |
| Approval-gated launch queue | docs/link-building/launch-queue.csv | ready/gated/research actions separated |
| Generated launch drafts | docs/link-building/generated-launch-drafts.md | 5 draft payloads |
| Outreach outcome log | docs/link-building/outreach-outcome-log.csv | 26 tracked external actions |
| Authority asset index | public/research/authority-assets.json | 12 assets |
| Crawler policy source map | public/research/ai-search-crawler-policy-sources.csv | 10 sources |
| Austin crawlability benchmark | public/research/austin-crawlability-benchmark-pilot.csv and public/research/austin-crawlability-benchmark-summary.json | 12 measured rows |
| Publish manifest | docs/link-building/publish-manifest.json | defines the link-building-only file scope |
| Publish readiness handoff | docs/link-building/publish-readiness.md | documents current deploy/scope blockers |
| Authority pack validator/generator | scripts/prepare-link-building.mjs and npm run linkbuilding:prepare | done in repo |
| Publish scope verifier | scripts/check-link-building-publish-scope.mjs and npm run linkbuilding:scope-check | guards against shipping unrelated dirty files |
| Publish export helper | scripts/export-link-building-publish.mjs and npm run linkbuilding:export-publish | exports manifest files for a clean worktree |
| Live deployment verifier | scripts/check-link-building-live.mjs and npm run linkbuilding:live-check | ready; must pass after deployment |
| Generated outreach packets | docs/link-building/generated-outreach-packets.md | ready for review |

## External Work Still Required

| Item | Evidence / scope | Status |
| --- | --- | --- |
| Owned profile edits | GitHub, LinkedIn, Devpost, Medium/Substack, Kaggle where applicable | requires account access |
| Manual outreach sends | Prospects in tracker with approved fit | requires approval and sender account |
| Publication decisions | Newsletters, resource pages, communities, local publications | external editorial control |
| Verified links | Ahrefs, GSC, Bing, and manual checks after crawl | requires time after publication |
| DR movement | Ahrefs after new referring domains are discovered | third-party metric, not guaranteed |

## Verification Commands

```bash
npm run linkbuilding:prepare
npm run linkbuilding:scope-check
npm run linkbuilding:export-publish
npm run lint
npm run build
npm run linkbuilding:live-check
```

## Completion Rule

The in-repository authority pack is ready when local validation passes and the generated files are present. Outreach should not start until `npm run linkbuilding:live-check` passes against the deployed canonical host. The full DR/link-building goal is not externally complete until profile edits, outreach sends, editorial placements, verified links, and post-crawl measurement have real evidence in `docs/link-building/prospect-tracker.csv`.
