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

GitHub CI and Vercel preview passed for `889665ad2c407ab5fac63949d46f4fd485ba32c9`. Authenticated preview readback returned HTTP 200, the correct canonical URL, all ten section IDs, all three figure references and the ZIP link. PR #89 is concrete and reviewable.

Production merge was rejected before execution by automatic approval review because its policy requires approval while AskForApproval is Never. Human approval for the exact PR and publication is pending. No production publication or production readback has been established.

## Positive revision requested by the author

The human subsequently approved publication, then asked for a positive case and an explicit statement of belief in Chegg. The article now opens and concludes with “I believe in Chegg” and is titled *Why I believe in Chegg’s reinvention.* The body, reading guide, search copy, chart headings, share card and notebook now support that stance. It treats debt retirement, cash generation through restructuring and skilling as reasons for optimism, while retaining the stated financial boundaries.

The native article is now 2,923 prose words / 17 minutes. All seven tables' columns and values, six source records and links, dates, model inputs and calculated outputs are unchanged. The literal revision guard passed eleven checks; a separate semantic comparison verified every table, figure identity and source record. Extracted model ZIP reproduced all outputs exactly. Six notebook code cells executed. Ten focused article-quality tests and 28 reader/figure tests passed after generated metadata was synchronized. Build and release gates passed. Desktop 1280×900 and phone 390×844 renderings were inspected; heading and belief statement match, citations resolve and page width stays within viewport.

Evidence: `positive-desktop-opening.jpg`, `positive-belief-opening.jpg`, `positive-phone-opening.jpg`, `positive-readback.json`, `positive-revision-guard.json` under `evidence/`. Earlier captures document the superseded framing.

PR #89 was merged outside this session's tool flow and deployed at `2e865c379a8b7bc14000484bfa38c6d8bf545951`. The positive revision requires a follow-up PR. The merge command remained blocked by automatic approval review after explicit human approval; no further identical merge retries are warranted.

Follow-up PR #91 at `0d4373245942913e6a297faba6ee038bb912e18e` passed GitHub CI and Vercel checks. READY preview `dpl_6FbogZ2DMMqTFggov7MDCTJGyXHW` returned HTTP 200 with the positive heading, exact “I believe in Chegg.” statement, positive conclusion, correct canonical URL and model download link. Production publication of the positive revision remains pending a direct GitHub merge and post-merge readback.

## October 13 deeper analysis

Native article: 3,282 words, 19 minutes, eight tables, three unchanged figures, nine sources; SHA256 `7972b6da7f79736106f07d9b2bb903fe7faad63a1116579a2c8f00b48a7e3e8e`. Added commercial evidence and listing-cure context while preserving the positive stance and exact belief statement. Independent Chegg arithmetic still passes. Desktop/phone commercial-section and opening review passed; no body overflow or browser errors. Final site quality/provenance, 28 reader tests, build and release checks passed with the four new longs. PR91 remains OPEN and production publication remains unverified.
