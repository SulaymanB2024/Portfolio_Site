# Case-study review

## Content and evidence

- Native article: `chegg-cash-flow-turnaround`; title *Can Chegg finance its own reinvention?*; 2,789 prose words, 16-minute site reading estimate, ten sections, seven tables, three figures and six primary sources.
- Source cutoff October 12, 2026; latest statements June 30, plus the September 1 debt-repayment disclosure. Annual filing source date is explicitly its reporting period, not an invented filing date.
- Historical, management-guidance and illustrative-model claims stay separate. June pro forma liquidity is never called actual current cash. Principal is distinguished from carrying value, restricted cash from liquid investment balances, and severance already inside CFO from assumed residual future payments.
- Replacement-growth table uses comparable-period declines; quarterly model uses sequential rates. Contribution margins and the reserve floor are explicit assumptions. No seasonality or stock valuation is implied.

## Calculations and reproducibility

`python3 docs/chegg-case-study/verify.py`: passed independent FCF/CFO/cash reconciliations, principal arithmetic, replacement hurdle, equal-margin boundary, all three scenario balances, severance timing, recurring-capex and one-time-investment sensitivities.

Six notebook code cells executed successfully, including three generated charts. The final public ZIP contains eighteen public files. Extracted ZIP reproduction matched every JSON/CSV output byte-for-byte; archive integrity passed; text/code/notebook files contain no private filesystem paths. Decimal calculations retain full precision; the article rounds for readability.

## Native rendering and design

SULLY-DESIGN: inspected the actual site reader at 1280×900 and 390×844, using the site's existing paper/ink design and reserve Coil Blossom artwork. Visible chart legend overlap and a clipped footer were corrected; SVG fonts now use the site's Georgia/Arial families. The social card's arithmetic and layout were inspected.

DOM readback: all ten sections' paragraphs and all seven tables match native JSON; 21 source links resolve; no duplicate IDs. Phone document width equals viewport width; every chart loads; figure and table overflow stays inside focusable regions. Three ArrowRight inputs move the phone figure 120px. Browser error log was empty.

Evidence: `evidence/desktop-opening.jpg`, `desktop-cash-bridge.jpg`, `desktop-liquidity.jpg`, `phone-opening.jpg`, `phone-revenue-chart.jpg`, and readback JSONs. The desktop cash-bridge screenshot precedes the final Arial/Georgia SVG font mapping; the final scenario and phone chart captures include it.

## Release checks

- `npm test`: 665 passed, zero failed after adopting initial-publication support.
- `npm run test:bot-observer`: 19 passed.
- `node tools/test-article-opening.mjs`: 28 passed after retaining the historical 39-figure invariant separately from new editions.
- `node tools/verify-article-quality.mjs`: 29 historical revisions plus one initial edition, passed.
- `node tools/verify-restored-articles.mjs`: original manuscripts, revisions and 130 retained assets passed.
- `npm run build`: type checks, client/SSR bundles and 47 canonical documents passed.
- `npm run verify:release`: 47 canonical pages, 30 feed entries, 82 legacy redirects and 1,709 asset references passed.
- `npm audit --audit-level=high`: passed; existing low-severity esbuild development-server advisory on Windows remains outside this article's runtime change.
- `git diff --check`: passed.

The initial-publication integrity helper, verifier and its tests were adopted from the reviewed source of existing PR #84 at `07ad3522dce06661167363cfaa62763c4e47e368`; this avoids a second provenance format. No Texas articles or unrelated content/design changes were adopted.

Publication is still pending branch CI, Vercel preview and production readback. Passing local gates alone does not establish live delivery.
