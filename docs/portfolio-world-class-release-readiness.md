# Portfolio World-Class Release Readiness

## Decision

The source-current portfolio implementation is locally accepted, but it is not released. The repository default branch and the canonical production domains still resolve to the pre-program source. No commit, push, preview creation, production promotion, domain reassignment, or rollback was performed during the read-only audit that produced this ledger.

The user subsequently authorized the full guarded release cycle: create the release commit, push a release branch, generate and validate a Vercel preview, and—only if every preview gate passes—merge/promote it to production while retaining the recorded rollback target. Until that sequence finishes, the implementation remains **authorized and release-ready, not live**.

## Authoritative identities

| Surface | Verified identity | Meaning |
|---|---|---|
| Accepted worktree | `/Users/sulaymanbowles/.codex/worktrees/37ee/Portfolio_Site` | Sole source-current implementation owner |
| Accepted worktree base | `c2f5ecac154b15e1cfe789cf6cc974f66483c130` | Unpublished child of the current remote default branch |
| Remote `main` | `e449a404e20f0bee615a780764e5ceb32c7200af` | Current GitHub default-branch head |
| Production deployment | `dpl_H3yNyBHnZJb6HvRQwD4fwRRtLgWT` | Current rollback target and canonical-domain deployment |
| Production source | `main` at `e449a404e20f0bee615a780764e5ceb32c7200af` | Confirms production is pre-program |
| Production aliases | `sulayman-bowles.dev`, `www.sulayman-bowles.dev` | Both point to the deployment above |
| Newest known preview | `dpl_gCxMCYvDR6PnCkYs4J5rQSDWxBP1` | Preview-only deployment from `codex/seo-expansion-20260728` at `abb8e64de075cd274fdbe7b17ce61e0eec9b8eb1`; not the accepted source |
| Vercel project | `prj_XG5xtn0h0aR7D7ek9cqxHdYzqDac` | `portfolio-site`, Vite, team `team_MYMuDXoBrKio5LKLLvZWfXef` |

Direct ancestry inspection proved that `c2f5ecac` has parent `e449a404`. `git ls-remote` independently returned `e449a404` for `refs/heads/main`.

## Local acceptance evidence

- The complete acceptance contract and checkpoint are in `docs/portfolio-world-class-program.md`.
- Source-current captures are in `/Users/sulaymanbowles/.codex/visualizations/2026/07/30/019fb548-8559-7cc0-a683-13da0c800b31/portfolio-source-current-final-verification/`.
- Captures `01` through `08` were generated at 20:02 CDT on July 30, 2026. The route-specific conclusion captures `09` through `14` were regenerated from the final corrected source at 20:27 CDT.
- `conclusion-verification.json`, generated at `2026-07-31T01:27:55.767Z`, records the route, viewport, robots state, conclusion label/title/content/note, geometry, overflow state, link count, screenshot path, and screenshot byte count for every conclusion follow-up surface.
- The final source passed the bounded lint, style, build, generated-file, link, SEO, keyword, article, route, responsive, interaction, reduced-motion, and print gates recorded in the program checkpoint.

This is source-current local acceptance only. It is not evidence that GitHub, a Vercel preview, or production contains the accepted implementation.

## Production divergence evidence

A cache-busted request to:

`https://sulayman-bowles.dev/research/technical-seo/canonicalization-graph-consistency?release-audit=20260730-2035`

returned HTTP 200 from Vercel with `x-vercel-cache: MISS`, `age: 0`, and `x-vercel-id: cle1::9bttf-1785461752872-3101ce256de8`. The 27,032-byte response:

- retained the pre-program title `Canonicalization as a Graph Consistency Problem`;
- did not contain the accepted heading `Make every signal converge`; and
- did not contain `article-conclusion-title`.

The captured body SHA-256 is `d251436c6fb887a200368af5ead5d1cbef6527d1c0609af6e3c7eae8fcd6ba86`. The captured headers SHA-256 is `ab9b8f5e3b2fd0efade5c38b7259680823bd538afdee21b60f8b99019fa7b193`.

The response artifacts were removed from `/tmp` and retained recoverably at `/Users/sulaymanbowles/.Trash/portfolio-live-audit.oM7qo6`.

Vercel independently resolved the canonical domain to production deployment `dpl_H3yNyBHnZJb6HvRQwD4fwRRtLgWT`, created from Git commit `e449a404`. That deployment is `READY`, has no alias error, and remains the rollback target. Vercel reported no grouped runtime errors for the project in the preceding seven days and no unresolved toolbar threads.

## Exact release delta

The accepted release consists of:

- the 17-path `c2f5ecac` commit over remote `e449a404`; and
- 64 source-current paths over the clean `c2f5ecac` Git tree.

Twelve paths overlap, producing 69 unique release paths:

```text
docs/portfolio-world-class-program.md
docs/portfolio-world-class-release-readiness.md
index.html
package-lock.json
package.json
public/llms.txt
public/research/authority-assets.json
scripts/generate-article-route-metadata.ts
scripts/generate-static-routes.ts
scripts/style-audit.mjs
scripts/verify-ai-search-seo.mjs
scripts/verify-technical-article-series.ts
src/App.tsx
src/components/ArticleLayout.tsx
src/components/AuditIntakeForm.tsx
src/components/InternalFooter.tsx
src/components/InternalHeader.tsx
src/components/ParallaxImage.tsx
src/components/ScrollProgress.tsx
src/components/ScrollReveal.tsx
src/components/design/Primitives.tsx
src/content/aiManagersArticle.ts
src/content/airlineLoyaltyFinancingArticle.ts
src/content/articleModels.ts
src/content/articleRouteMetadata.ts
src/content/austinHomeServiceOwnershipArticle.ts
src/content/evidenceLists.ts
src/content/hiddenFinancingHardwareArticle.ts
src/content/indexCompanyMattersArticle.ts
src/content/marketTheses.ts
src/content/onlineReturnsInvestigationArticle.ts
src/content/profileFacts.ts
src/content/publicationIndex.ts
src/content/researchArticles.ts
src/content/researchAssets.ts
src/content/seoExpansion.ts
src/content/siteNavigation.ts
src/content/technicalArticleSeries.ts
src/content/texasTollRoadArticle.ts
src/content/texasTollRoadArticleMeta.ts
src/content/viralBenchArticle.ts
src/content/viralBenchArticleMeta.ts
src/content/waymoHardwareFinancingArticle.ts
src/content/westCampusStudentHousingArticle.ts
src/index.css
src/main.tsx
src/pages/AboutPage.tsx
src/pages/AiManagersArticlePage.tsx
src/pages/AtlasCelestialParallaxPage.tsx
src/pages/AtlasPage.tsx
src/pages/AtlasSampleCrawlPage.tsx
src/pages/ContactPage.tsx
src/pages/MarketArticlePage.tsx
src/pages/MarketsPage.tsx
src/pages/NotFoundPage.tsx
src/pages/ResearchPage.tsx
src/pages/ResumePage.tsx
src/pages/TexasTollRoadArticlePage.tsx
src/pages/ViralBenchArticlePage.tsx
src/pages/VoidAgencyMethodPage.tsx
src/pages/WorkPage.tsx
src/seo/generatedPublicFiles.ts
src/seo/routes.ts
src/seo/schema.ts
src/seo/staticContent.ts
src/styles/article-reader.css
src/utils/markdownToHtml.ts
src/utils/markdownToReact.tsx
src/utils/publicationDate.ts
```

The 64-path source-current comparison is derived from Git's tracked diff plus untracked-file inventory against `c2f5ecac`: 58 modified paths and six additions, with no deletions. `public/sitemap.xml` was checked and is content-identical to that baseline.

## Authorized release sequence

The user explicitly authorized commit, release-branch push, preview generation and validation, and conditional production publication. The execution sequence is:

1. Create a clean integration worktree under `/Users/sulaymanbowles/Projects/CodexWork` from current remote `main`; re-prove that `e449a404` is still the remote head before integrating.
2. Preserve `c2f5ecac` and the 64-path source-current delta as one reviewable release branch. Confirm the 69-path manifest and inspect the complete diff before committing.
3. Run the smallest source-integrity gates after integration: lint, style audit, build, generated-file verification, internal-link verification, SEO verification, keyword verification, and article verification.
4. Push the release branch and let Vercel create a preview. Do not promote the older `abb8e64d` preview.
5. Run the accepted 38-state inventory—35 canonical routes, two intentional noindex routes, and 404—at 1440×1000, 820×1180, and 390×844 against the new preview. Recheck INDEX focus/scroll restoration, form errors, reduced motion, tables, print, conclusion anchors, robots state, overflow, broken images, and browser logs.
6. Review the preview diff and evidence. Only then merge/promote to production.
7. Re-run cache-busted canonical-domain smoke checks and the material visual/interaction states against production. Confirm the production deployment metadata points to the released commit.
8. If the production gate fails, restore deployment `dpl_H3yNyBHnZJb6HvRQwD4fwRRtLgWT` to the canonical aliases and verify both aliases after rollback.

## Authorization received

The user supplied the required authorization:

> Create the release commit, push a release branch, generate and validate a Vercel preview, and—only if every preview gate passes—merge/promote it to production using the recorded rollback target.

This authority does not waive the preview gates. A failed preview gate stops promotion; a failed production gate triggers restoration of the recorded rollback deployment.
