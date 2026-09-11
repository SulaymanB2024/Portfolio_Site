# Sulayman Bowles Portfolio

A Vite React portfolio and agency/research site for Sulayman Bowles. The app keeps the animated client experience, while the production build generates route-specific static HTML for crawlable metadata, summaries, canonical URLs, and JSON-LD.

Live site: [sulayman-bowles.dev](https://sulayman-bowles.dev/)

Key source surfaces: [AI information](https://sulayman-bowles.dev/ai-information) · [Research assets](https://sulayman-bowles.dev/research) · [authority asset index](https://sulayman-bowles.dev/research/authority-assets.json) · [AI crawler policy source map](https://sulayman-bowles.dev/research/ai-search-crawler-policy-sources.csv)

## Routes

- `/`
- `/work`
- `/atlas`
- `/atlas/sample-crawl`
- `/simple`
- `/markets`
- `/research/ai-crawlers/ai-search-crawler-policy`
- `/research/search-console/technical-seo-public-data-infrastructure`
- `/research/personal-seo/canonical-identity-personal-seo`
- `/markets/who-owns-texas-toll-roads`
- `/method`
- `/void-agency`
- `/austin-technical-seo`
- `/case-studies/technical-seo-audit`
- `/about`
- `/resume`
- `/contact`
- `/ai-information`
- `/research`
- `/sitemap`
- `/markets/network-monopolies`
- `/markets/computational-commodity-systems`
- `/markets/fiat-horizon`

Aliases such as `/projects/atlas`, `/atlas/sample-run`, `/projects/markets`, `/audit-intake`, `/austin-seo`, `/technical-seo-case-study`, `/book`, `/plain`, `/text`, `/cv`, and `/resume.html` redirect or normalize to their canonical routes.

## Local Development

Prerequisite: Node.js.

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```

`npm run build` runs `vite build` and then `scripts/generate-static-routes.ts`, which writes canonical route HTML into `dist/`.

## Portfolio analytics

Portfolio measurement is disabled unless a valid public GA4 web-stream ID is
provided at build time:

```bash
VITE_PORTFOLIO_GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run build
```

The value is a public measurement identifier, not a credential. Do not enable
it until the shared property, stream, disclosure, and deployment have received
their separate approvals. The browser integration only activates on
`https://sulayman-bowles.dev`, emits one explicit `page_view` for the initial
route and each accepted path change, labels events with
`portfolio_site=sulayman_bowles_dev`, and removes query strings and fragments.
Preview, localhost, and lookalike hosts fail closed. Google Signals and
ad-personalization signals are disabled by the site configuration.

## Link-Building Authority Assets

- `docs/link-building/authority-playbook.md` defines the DR/referring-domain strategy, campaign rules, measurement baseline, and completion criteria.
- `docs/link-building/outreach-templates.md` contains manual outreach drafts for AI crawler policy, Atlas, Austin benchmark, profile reclamation, and public case-study collaboration.
- `docs/link-building/prospect-tracker.csv` is the working tracker for owned profile updates, citation opportunities, outreach status, and verified outcomes.
- `docs/link-building/live-prospect-evidence.csv` records live source checks for priority prospects and gates.
- `docs/link-building/owned-profile-updates.md` contains copy-ready profile and repository update drafts.
- `docs/link-building/launch-queue.csv` separates ready, gated, ready-after-publish, and research-only actions.
- `docs/link-building/generated-launch-drafts.md` contains approval-ready draft payloads for viable pitches and community submissions.
- `docs/link-building/outreach-outcome-log.csv` tracks submissions, published links, anchors, follow state, and verification evidence.
- `docs/link-building/austin-benchmark-targets.csv` and `docs/link-building/austin-crawlability-benchmark.md` define the local benchmark input list and review summary.
- `docs/link-building/publish-manifest.json` lists the files that belong to the authority-pack publish and excludes unrelated dirty worktree files.
- `docs/link-building/publish-readiness.md` records the current local/live gate status and exact publish sequence.
- `/research` is the public human-readable hub for citation-ready assets and supporting source files.
- `public/research/authority-assets.json` is a public index of citation-worthy pages and claim boundaries.
- `public/research/ai-search-crawler-policy-sources.csv` is a public source map for the AI-search crawler policy article.
- `public/research/austin-crawlability-benchmark-pilot.csv` and `public/research/austin-crawlability-benchmark-summary.json` are the public Austin benchmark outputs.
- `npm run linkbuilding:export-publish` writes an ignored `output/link-building-publish/` bundle containing only publish-manifest files for application to a clean branch or worktree.
- `npm run linkbuilding:scope-check` verifies that the current dirty worktree contains only files from the publish manifest before staging or deployment.
- `npm run linkbuilding:live-check` verifies that the authority hub, raw assets, sitemap, and `llms.txt` are actually live on `https://sulayman-bowles.dev` before outreach or IndexNow submission.

## Site-quality checks and résumé maintenance

After `npm run build`, run `npm run verify:site-integrity` to check generated HTML,
local destinations, fragments, assets, canonical/sitemap/noindex rules and flat/directory
variants. It writes ignored `audit-artifact/site-integrity.json`.
`npm run verify:static-idempotence` verifies that rerunning the static generator changes
none of the built HTML. `test:site-integrity` and `test:site-behavior` cover intentional
failures and lifecycle/content contracts. CI runs these alongside the existing gates.

The public profile, résumé HTML, Person schema and `llms.txt` derive from
`src/content/profileFacts.ts`. Following a confirmed public-profile edit:

```sh
# Optional authoring dependency, not a website/runtime requirement.
python3 -m pip install reportlab==4.4.9
npm run generate:resume
npm run generate:public
npm run verify:profile
```

Inspect the resulting one-page PDF before committing it. The manifest in
`docs/resume-pdf-manifest.json` binds the PDF bytes to the serialized profile facts;
this prevents silently stale downloads but does not externally verify employment claims.

Optional browser smoke: install `playwright==1.57.0` and provide system Chrome (or set
`BROWSER_EXECUTABLE`), then run `python3 scripts/browser-smoke.py` after building.
Screenshots and results stay in `audit-artifact/browser`. This test aborts external
requests and validates the built application, not production hosting.

See `docs/sitewide-search-quality-2026-09-10.md` for the source-review scope and limits.
