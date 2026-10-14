# Hyperliquid valuation: research and review record

Cutoff: 2026-10-14. The request named Kalshi once but Hyperliquid twice; this submission interprets Hyperliquid as the intended subject. It does not value Kalshi.

## Reading and contribution

Reviewed CoinShares' seven-stream framework, Multicoin's valuation tables and Artemis' exchange/HyperEVM approach. Reviewed Damodaran's Nvidia/DeepSeek essay for narrative-to-model discipline and the site's existing Chegg case for native article structure. Future price targets are kept separate from current present values. CoinShares explicitly avoids a second future-buyback supply adjustment; the article does not falsely criticize it for double counting.

The new analysis separates third-party distribution, lower-fee market mix, collateral efficiency, economic claims and continued growth after 2031. Most importantly, the pinned DeFiLlama adapter adds AQAv2 reserve income to the perpetuals product. The 3.34-bps headline ratio is not identified trading monetization. Forecast fee rates are assumptions, not an extrapolated clean historical take rate.

## Model and self-review

Five driver-based forecasts (2027–2031) plus five years fading the last explicit-year growth rate to terminal growth (2036). Discount every annual flow; terminal cash flows begin in 2037. Flows are USD billions; turnover is trillions; token claims are millions. Trading rates are already net to HYPE. Do not multiply by 99% again. Do not add reserve income to the mixed historical receipts again. Do not credit future repurchases twice via a shrinking denominator.

At 18% required return, 3% terminal growth and 955.31m claims: erosion $4.237573, central $29.964894, dominant infrastructure $126.356365. Central 2031 flow is $4.24bn; 2036 flow is $8.936bn. Base terminal share is 40.956%. The same operating case at 12% and 707m claims produces $79.616057. An $80 reference on the central supply/return assumptions requires an equivalent 59.948% first-five-year growth rate before the same fade. No scenario probabilities or liquidation floor are asserted.

## Unresolved evidence

- Q3 parent table: 224.23 - 45.42 - 173.97 = $4.84m unexplained. No expense plug or audited-margin inference.
- The matched 30-day AQAv2 component is not independently isolated. Do not infer a pure trading take from the headline ratio.
- HIP-4 documentation and provider fee timing are inconsistent. Central and erosion scenarios assume no HIP-4 fees; bull is a hypothetical future stream.
- Total supply is a provider convention, not an independently reconciled on-chain ownership register or a prediction of 2031 circulation.
- Fee allocation is policy-dependent; token-directed receipts are not a legally guaranteed corporate dividend.
- Author holdings and commercial relationships were not supplied. No statement of zero interests has been invented.

## Validation performed

The standard-library Python model was executed. Six focused Node tests passed: input parity, all three scenario cash flows, reverse valuation and sensitivities, invalid financial assumptions, retained evidence boundaries and source/asset references. Browser DOM tests at 390px and 1440px passed default/base output, bull output, invalid-input hiding and reset, with no JavaScript errors or horizontal page overflow. These used the actual markup, stylesheet and scripts in an offline DOM because local navigation was restricted; they are not a deployed-network test. Four SVGs were rasterized and visually inspected.

A complete local site build was not run: a full repository checkout and dependency installation were unavailable in this environment. The PR's CI and deployment preview remain the integration authority. This is a single-assistant self-review, not an independent investment committee approval.

## Reproduction

`python public/research/hyperliquid-valuation/model.py`

`node --experimental-strip-types --test tests/hyperliquid-valuation.test.ts`

Open `/research/hyperliquid-valuation/model.html` through the site to inspect the browser model. Its scripts and stylesheet are local assets with no external runtime dependencies. The article uses the existing JSON catalog and generic source/figure renderer; no framework dependency or production configuration change is required.
