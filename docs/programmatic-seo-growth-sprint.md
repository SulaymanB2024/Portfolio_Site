# Programmatic SEO Growth Sprint

Prepared July 20, 2026. Google Search Console organic clicks are the KPI. Rankings, indexation, impressions, clicks, leads, and revenue are external outcomes; this release cannot guarantee them.

## Baseline and launch boundary

The supplied pre-release baseline is 1 organic click and 135 impressions in the latest stable seven-day window, with 15 of 16 target articles indexed. This branch preserves that 16-article contract and adds 36 leaf guides plus four collection routes, taking the canonical inventory from 28 to 68 URLs.

The first seven days are an indexation and discovery sprint. The 1,000-click target is a 90-day stretch milestone because 1,000 weekly clicks at a 5% click-through rate requires approximately 20,000 weekly impressions.

## Measurement gates

| Window | Indexation | Weekly non-branded impressions | Weekly organic clicks |
| --- | ---: | ---: | ---: |
| Day 7 | At least 32 of 40 new routes | 1,000 | 25 |
| Day 30 | Monitor useful indexed inventory | 5,000 | 100 |
| Day 60 | Monitor useful indexed inventory | 12,500 | 400 |
| Day 90 | Monitor useful indexed inventory | 20,000 | 1,000 stretch |

Run the read-only report with a stable or fresh-data state:

```bash
npm run report:pseo-growth -- --start YYYY-MM-DD --end YYYY-MM-DD --state final
npm run report:pseo-growth -- --start YYYY-MM-DD --end YYYY-MM-DD --state all
```

The report writes ignored JSON, page CSV, and query CSV files under `output/seo/`. It separates branded and non-branded metrics, rolls up issue/platform/checklist families, compares the previous equal-length period, and records Google-observed URL Inspection state. URL Inspection does not request indexing.

## Release and monitoring sequence

1. Merge and deploy only after explicit production approval.
2. Run all-route HTTP, canonical, metadata, schema, sitemap, and static-head checks against the production host with uncached requests.
3. Run a fresh Firecrawl map and representative leaf/hub scrapes after deployment; do not reuse cached launch evidence.
4. Record URL Inspection state on release day, day 3, and day 7. Inspection observes Google's version and must not be described as an indexing request.
5. Review pages with impressions and average positions 11–30 for snippet clarity and contextual internal-link opportunities before expanding inventory.
6. After 14 days, retain a zero-impression page only when it remains independently useful. Otherwise move its registry state to `noindex` before generating more pages.

## External-action boundary

The authority pack contains eight approval-ready platform drafts and prospect notes. No outreach, community submission, profile edit, IndexNow request, production deployment, or merge is authorized by this document.
