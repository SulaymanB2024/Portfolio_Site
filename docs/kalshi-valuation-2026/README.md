# Kalshi’s $40 Billion Question

Research cutoff: October 14, 2026. Prepared for review as a pull request; not authorization to merge or publish automatically.

## Editorial judgment

Event contracts become a common feature of financial distribution. Kalshi can grow while brokers, competing venues and professional traders pressure the fee it retains. The model values retained economic revenue, not customer deposits, gross winnings or a universal take rate applied to incompatible notional measures.

Weighted enterprise value is $28.5329bn, or $29.5329bn aggregate equity with an assumed $1bn of unrestricted net corporate cash. The base case is $26.4060bn enterprise value. The $40bn benchmark is a Reuters report of financing discussions, not a verified closing. Existing security preferences, options and net cash remain unverified.

## Reading before drafting

Read the regulation-first history in Contrary’s early Kalshi profile and Messari’s April 2026 sports-microstructure study. Reviewed Sacra’s operating estimates, then primary fee, product and financing disclosures, Robinhood’s Rothera routing announcement, the CFTC’s October proposal, and ICE/CME results. The CFTC PDF and fee-schedule pages were also visually inspected.

For other-company valuation writing, reviewed the indexed December 2020 Damodaran Airbnb discussion: gross activity to retained revenue, operating margins, reinvestment and a price-implied reverse valuation. The underlying spreadsheet was not accessed. The site's Vanta manuscript opening and sections supplied a house-style reference for dated evidence, private-security limits and explicit investment hurdles; that manuscript is not represented here as a published page.

PitchBook’s September Kalshi initiation report was accessible only through its public abstract. The full paid report and model were not read or used as model inputs. The article’s source array is the canonical 17-source register; source-register.json records the claim boundaries.

## Publication files

- Native article: src/personal/editorial/data/articles/kalshi-40-billion-question.json
- Canonical route: /research/financial-systems/kalshi-40-billion-question
- 3,728 prose words; 20-minute reading estimate using the existing site convention.
- Catalog entry and initial-publication SHA256 record added. Historical catalog objects remain semantically unchanged; catalog serialization is compacted.
- Existing native model presentation selected. The previously reserved yuru-25 cover is assigned with the original artist attribution and existing motion/reduced-motion behavior intact.
- Four bespoke analytical SVGs: fee curve, revenue mix, cash-flow value bridge and scenario comparison. Captions distinguish assumptions, reported discussions and uncertainty; text alternatives and visible numeric labels accompany the graphics.
- A custom 1200×630 social.svg is included. The PNG metadata fallback reuses the site's existing branded research card; it is not represented as a newly rasterized custom card.
- A standalone interactive model uses local HTML/CSS/JavaScript, without new runtime dependencies, network calls, credentials or analytics.

## Model conventions

All amounts are USD billions unless labeled rates. Event turnover counts the $1 maximum payout once per matched trade; perpetuals use exposure traded. Economic net revenue is after transaction-linked concessions and distribution payments, before operating expenses. All forecast drivers and probabilities are author assumptions.

Cash flows are discounted to October 14, 2026 using actual days to year-end / 365. The common 78-day 2026 stub is a normalization, not an audited historical result. Scenario divergence begins in 2027. Three explicit annual scenarios run through 2036; volumes and ancillary income use CAGR interpolation through 2031, yields and margins interpolate linearly, and growth subsequently fades to 12%, 10%, 8%, 6% and 4%.

Operating margins include employee stock compensation as an economic expense. Positive EBIT is taxed at 26%; no immediate tax refunds or speculative loss-carryforward value are credited. Reinvestment is positive incremental annual revenue / 4, without automatic release on contraction. Terminal growth is 3%, terminal incremental ROIC 20%, and the default discount rate 13%. Terminal growth therefore requires reinvestment; it is not a costless perpetuity.

Reverse valuation scales every forecast year's revenue path, with additional reinvestment, rather than increasing only a terminal-year target. A 1.496615× base revenue path supports $40bn equity at the default cash assumption, reaching $13.2450bn revenue in 2031. Reducing retained sports yields by 25bp gives $23.1507bn base equity while holding margins fixed; sticky costs would worsen the outcome.

## Reproduction and validation

`python3 public/research-assets/kalshi-valuation-2026/model.py` regenerates model-output.json, assumptions.json and forecast.csv in its directory. The calculation is standard-library only. Regeneration may change whitespace or CSV line endings without changing values.

`node tools/test-kalshi-valuation.mjs` checks golden scenario outputs, 30 independent Python/JavaScript annual forecasts, cash-flow identities, reverse valuation, fee and discount sensitivities, source references, public resources, PNG dimensions, catalog agreement and the initial-publication hash. The wrapper tests/kalshi-valuation.test.ts includes it in the existing npm test suite.

Completed during authoring: Python arithmetic assertions; independent JavaScript agreement across all 30 annual cash-flow rows and three valuations; reverse-valuation and fee-shock agreement; catalog semantic preservation; manuscript SHA and reading-time calculation; SVG rendering and inspection of local figure previews.

Full native-site build and live browser QA were not completed in the authoring environment. Repository cloning was unavailable there, and localhost browser navigation was rejected by the environment's access policy. No attempt was made to bypass that policy. The existing PR workflow must establish native test/build/release results. Browser behavior at phone and desktop widths, keyboard interaction, article links and source previews still require a permitted browser review. The standalone model is designed for these widths; design intent is not a claim of a passed rendered-browser test.

No dependencies, deployment settings, existing article prose, production data or credentials are modified. Leave the PR unmerged for review.
