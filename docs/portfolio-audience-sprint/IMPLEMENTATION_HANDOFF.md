# Portfolio audience and search growth sprint implementation handoff

## Outcome

The local implementation is complete across the four existing site worktrees.
Portfolio measurement fails closed without a valid public GA4 ID, and the four
approved page changes are staged without releasing any broad candidate branch.
No external or production mutation was performed.

## Repository receipts

| Site | Sprint branch | Revalidated base | Local implementation commit |
|---|---|---|---|
| `sulayman-bowles.dev` | `codex/portfolio-audience-sprint-dev-20260811` | `853969276a3c980b9975fde47a0b1e24641166dc` | `7da600a954d3491ea025faec71a3bd83d5a1ed55` |
| `sulayman-bowles.tech` | `codex/portfolio-audience-sprint-tech-20260811` | `a85bce3b3e0d93dc57679d38209e466d381bf60c` | `764f20be6c37ccde48ae5295fce30d18cd8d92ba` |
| `www.void-agency.com` | `codex/portfolio-audience-sprint-void-20260811` | `9e330f1943eef42db32ff45e7b907c70bf67072c` | analytics `8d31603fac669c7fd7966ef404dcad21a1f116bb`; workspace `084b92c5bbf8a50def46e5811fa43ef6dee8e637` |
| `1-800-operator.vercel.app` | `codex/portfolio-audience-sprint-operator-20260811` | `21ada226e6d646209da01c4970b2d87688ba6e85` | `d705036f6a08990d1fa204a361015050787e5d21` |

Prior broad candidate branches remain unchanged at their recorded tips:

- `.dev`: `codex/hermes-portfolio-authority-20260810` at `ac1a3d...`;
- `.tech`: `codex/hermes-growth-sulayman-bowles-tech-20260810` at `036981...`;
- VOID: `codex/void-hermes-expansion-20260810` at `fe6ab93...`;
- Operator: `codex/hermes-operator-growth-20260810` at `7bd5c7...`.

## Measurement interface

- Build settings:
  - `.dev`, `.tech`, and VOID:
    `VITE_PORTFOLIO_GA_MEASUREMENT_ID`;
  - Operator: `PORTFOLIO_GA_MEASUREMENT_ID`.
- Fixed host values:
  - `www.void-agency.com` → `void_agency`;
  - `sulayman-bowles.dev` → `sulayman_bowles_dev`;
  - `sulayman-bowles.tech` → `sulayman_bowles_tech`;
  - `1-800-operator.vercel.app` → `operator`.
- The integrations activate only on the exact HTTPS production host, disable
  automatic page views, Google Signals, ad storage/user data, and
  ad-personalization signals, and remove query strings and fragments from page
  and referrer paths.
- They do not inspect or send form contents, names, email addresses, phone
  numbers, user IDs, credentials, or arbitrary query values.
- VOID retains `G-MQKR22X3P8` and routes each SPA page view once to its existing
  destination plus the portfolio destination when configured. Other VOID
  custom events remain on the existing property.
- The intended GA4 report grain is `date` × `hostName` ×
  `landingPagePlusQueryString` × default channel group, with `sessions`,
  `engagedSessions`, engagement rate, views, and key events. Search Console
  clicks, impressions, CTR, and position stay in their own provider fact set.

## Measurement-first port manifest

Do not deploy the local `.dev`, `.tech`, or VOID implementation commits
wholesale for the measurement phase. From revalidated remote main, port only
these paths into fresh, separately approved measurement commits:

- `.dev`: `README.md`, `package.json`, `src/analytics/`,
  `src/components/InternalFooter.tsx`, `src/main.tsx`;
- `.tech`: `docs/SEO_MEASUREMENT.md`, `src/analytics/`,
  `src/design-system/ProjectDeltaShell.tsx`,
  `src/design-system/design-system-components.test.ts`,
  `src/design-system/foundation.css`, `src/index.tsx`;
- VOID: cherry-pick only analytics commit
  `8d31603fac669c7fd7966ef404dcad21a1f116bb` after current-main
  reconciliation; the workspace is a separate later commit;
- Operator: the complete local commit is analytics-only.

The remaining changed paths are the staged page bundles and must follow the
14-day baseline and weekly release sequence.

## Page implementation

- `.dev` toll roads: approved title variant, answer-first four-concession
  summary, ownership/case/archive links.
- `.dev` robots.txt: approved title variant and concise robots/noindex/auth plus
  authorization/rate-limit decision table.
- VOID technical audit: Pass, Needs attention, Unknown, and N/A states; local
  save/load/delete/reset; evidence notes; status/category filters; print; safe
  CSV, JSON, and Markdown exports; formula-injection protection; focused
  internal links. No other checklist was upgraded.
- `.tech` Jane Street: approved title and description, with the authored solver
  packet and externally unverified evidence boundary before the facts grid.
- Operator: analytics and disclosure only; no content candidate was ported.

## Validation receipts

### `.dev`

```bash
npm run lint
npm run test:portfolio-analytics
npm run generate:article-routes
npm run verify:articles
npm run verify:seo
npm run verify:generated
npm run verify:internal-links
npm run verify:keywords
npm run build
```

Result: green. Article verification covers 23 canonical articles; SEO and
generated-file checks cover the canonical inventory; analytics has 3 passing
contract tests.

### `.tech`

```bash
corepack yarn test
corepack yarn tsc --noEmit
corepack yarn build
corepack yarn verify:pseo
```

Result: green; 323 tests and 110 built SEO routes passed.

### VOID

```bash
npm run lint
npm run build
npx playwright test tests/programmatic-seo.spec.js tests/portfolio-analytics.spec.js
```

Result: green for the changed surface; 21 focused browser tests passed with one
worker, including CSV, JSON, and Markdown export assertions. The full 711-test
sweep was not green: it reached 317 cases with 297 passed, 19 failures caused
by an external Google Fonts `.woff2` request returning 404, one interrupted,
and 394 not run. `/privacy` passed when rerun alone. This is PA-010 and must be
green before production.

### Operator

```bash
npm --prefix internship-reels-site run build
npm --prefix internship-reels-site test
npm --prefix internship-reels-site run typecheck
npm --prefix internship-reels-site run verify:seo
```

Result: build privacy scan green, 269 tests passed, and type-checking passed.
The final SEO command exposes PA-008 and is not represented as green.

### Responsive and local-network QA

- Chromium screenshots were inspected at 1440px and 390px for both `.dev`
  pages, the Jane Street page, the VOID workspace, and Operator.
- No overlap or clipping was observed; Jane Street proof is above the facts
  grid; the VOID controls and rows collapse to one column.
- HAR request-URL scans on all four local previews contained no Google
  Analytics or Google Tag Manager request, confirming fail-closed local host
  behavior.

## Remaining release sequence

1. Restore Google read-only OAuth; the Hermes documentation collision is
   closed by commit `2a05900045a34260ec9c3db7ce648c0e7972f493`.
2. With exact approval, create the dedicated GA4 property and shared stream in
   `America/Los_Angeles`; configure all four domains and disable Signals and ad
   personalization in the property/UI as well as code.
3. Port measurement-only paths from fresh remote main, run green tests, produce
   previews, obtain disclosure/account/deployment approvals, and obtain
   commit-bound Vercel receipts.
4. Confirm DebugView/Realtime and next-day Data API rows for every host. Restart
   if any host is missing or duplicates page views.
5. Freeze the target pages and collect 14 complete baseline days.
6. Release `.dev`, wait 7 days for integrity only, release VOID, wait 7 days,
   then release `.tech`. Revalidate each title gate and current main before its
   exact commit.
7. Evaluate traffic at day 28 and weekly through day 90 using the sprint's
   three-consecutive-snapshot acceptance rules. Treat results as observational.

## Rollback

- Before production enablement, rollback is simply leaving the public
  measurement IDs unset; all four integrations then fail closed.
- For duplicate analytics, first remove the portfolio ID from the affected
  project and redeploy the last verified commit. Then revert the exact
  measurement merge commit after confirming the duplicate source.
- For canonical/indexing regression, broken exports, material runtime failure,
  or a deployment/commit mismatch, revert the exact affected site merge commit
  and deploy the last commit-bound receipt.
- The local implementation branches can be abandoned without affecting remote
  main because none were pushed.
