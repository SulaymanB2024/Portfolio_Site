# Austin Crawlability Benchmark Pilot

Generated: 2026-06-25

This pilot measures a bounded public sample of Austin-area technology and business websites. It is intended to create a source-backed local conversation around crawlability, source clarity, and machine-readable public pages.

## Public Assets

- CSV: `public/research/austin-crawlability-benchmark-pilot.csv`
- Summary JSON: `public/research/austin-crawlability-benchmark-summary.json`

## Claim Boundaries

- This pilot is not representative of all Austin companies.
- Rows do not claim rankings, traffic movement, revenue impact, AI citations, or site health.
- Access-limited, timed-out, or challenged fetches are measurement gaps, not negative findings.
- The benchmark should be used as a public-data conversation starter before any local media pitch.

## Methodology

- Bounded one-request public fetch of each homepage.
- One public robots.txt fetch per final origin.
- One sitemap fetch using the first robots.txt sitemap URL when available, otherwise /sitemap.xml.
- Signals are presence/availability checks, not quality scores or SEO diagnoses.

## Aggregate Signals

| Signal | Count | Share |
| --- | ---: | ---: |
| homepage_fetch_ok | 12 | 100% |
| homepage_2xx_or_3xx | 12 | 100% |
| https_final | 12 | 100% |
| title_present | 12 | 100% |
| meta_description_present | 12 | 100% |
| canonical_present | 12 | 100% |
| h1_present | 11 | 92% |
| jsonld_present | 12 | 100% |
| robots_request_completed | 12 | 100% |
| robots_2xx_or_3xx | 12 | 100% |
| robots_declared_sitemap | 10 | 83% |
| sitemap_request_completed | 12 | 100% |
| sitemap_2xx_or_3xx | 10 | 83% |
| measurement_gaps | 6 | 50% |

## Sample

| Site | Segment | Homepage status | Signals observed | Measurement note |
| --- | --- | ---: | ---: | --- |
| BigCommerce | commerce_platform | 200 | 22 | possible_bot_challenge_or_interstitial |
| WP Engine | hosting_platform | 200 | 21 | public_fetch_completed |
| NinjaOne | it_software | 200 | 9 | possible_bot_challenge_or_interstitial |
| AlertMedia | b2b_software | 200 | 9 | public_fetch_completed |
| DISCO | legal_technology | 200 | 9 | possible_bot_challenge_or_interstitial |
| Shipwell | logistics_software | 200 | 9 | public_fetch_completed |
| data.world | data_platform | 200 | 8 | public_fetch_completed |
| Kasasa | fintech | 200 | 8 | possible_bot_challenge_or_interstitial |
| ZenBusiness | business_services | 200 | 9 | public_fetch_completed |
| Self Financial | fintech | 200 | 9 | possible_bot_challenge_or_interstitial |
| Workrise | workforce_platform | 200 | 10 | possible_bot_challenge_or_interstitial |
| Everlywell | health_technology | 200 | 8 | public_fetch_completed |

## Pitch Use

Use this as support for Austin-local outreach only after review. The pitch should discuss aggregate public-web patterns and the need for technical SEO evidence. It should not call out individual companies as broken, unhealthy, or ranking poorly.
