import type { ResearchArticle } from './articleModels';

const DATE = '2026.09.23';

const gscDiscrepancies = {
  label: 'Google Search Console — Performance report data discrepancies',
  href: 'https://support.google.com/webmasters/answer/17010575',
  lastVerified: DATE,
};
const gscData = {
  label: 'Google Search Console — Performance report data and aggregation',
  href: 'https://support.google.com/webmasters/answer/17011364',
  lastVerified: DATE,
};
const gscApi = {
  label: 'Google Search Console API — Search Analytics query',
  href: 'https://developers.google.com/webmaster-tools/v1/searchanalytics/query',
  lastVerified: DATE,
};
const gscBulk = {
  label: 'Google Search Central — bulk Search Console export to BigQuery',
  href: 'https://developers.google.com/search/blog/2023/02/bulk-data-export',
  lastVerified: DATE,
};
const gscBigQuery = {
  label: 'Google Search Central — BigQuery efficiency for Search Console exports',
  href: 'https://developers.google.com/search/blog/2023/06/bigquery-efficiency-tips',
  lastVerified: DATE,
};

const coreweave85 = {
  label: 'CoreWeave 8-K — DDTL 5.5 facility, August 2026',
  href: 'https://www.sec.gov/Archives/edgar/data/1769628/000176962826000357/crwv-20260807.htm',
  lastVerified: DATE,
};
const coreweave10q = {
  label: 'CoreWeave 10-Q — debt, DDTL collateral, and June 2026 balance sheet',
  href: 'https://www.sec.gov/Archives/edgar/data/1769628/000176962826000366/crwv-20260630.htm',
  lastVerified: DATE,
};
const coreweaveRelease = {
  label: 'CoreWeave — DDTL 5.5 closing release',
  href: 'https://www.sec.gov/Archives/edgar/data/1769628/000176962826000357/ex991pr.htm',
  lastVerified: DATE,
};

const austinOwnership = '/research/financial-systems/who-owns-austin-home-service-companies';
const austinDataset = '/research/austin-home-service-ownership-2026.csv';

const riversideT3 = {
  label: 'The Riverside Company — T3 Services Group portfolio entry',
  href: 'https://www.riversidecompany.com/investment-portfolio/t3-services-group',
  lastVerified: '2026.07.26',
};
const southernGryphon = {
  label: 'Gryphon Investors — majority investment in Southern Home Services holding company',
  href: 'https://www.gryphon-inv.com/news/gryphon-investors-completes-majority-investment-in-southern-hvac-and-announces-new-home-services-holding-company/',
  lastVerified: '2026.07.26',
};
const lCattertonMasterTrades = {
  label: 'L Catterton — Master Trades Group investment',
  href: 'https://www.lcatterton.com/investments.html',
  lastVerified: '2026.07.26',
};
const giArs = {
  label: 'GI Partners — American Residential Services portfolio entry',
  href: 'https://www.gipartners.com/private-equity/portfolio/american-residential-services',
  lastVerified: '2026.07.26',
};
const dunesJaMar = {
  label: 'Dunes Point Capital — Roofing Services Solutions acquisition of Ja-Mar',
  href: 'https://www.dunespointcapital.com/news/roofing-services-solutions-acquires-ja-mar-roofing-sheet-metal/',
  lastVerified: '2026.07.26',
};

const airlineInvestigation = '/research/financial-systems/how-airlines-borrow-against-loyalty-programs';
const american2025 = {
  label: 'American Airlines Group — 2025 Form 10-K',
  href: 'https://www.sec.gov/Archives/edgar/data/4515/000000620126000014/aal-20251231.htm',
  lastVerified: DATE,
};
const americanFinancing = {
  label: 'American Airlines — $10 billion AAdvantage financing announcement',
  href: 'https://www.sec.gov/Archives/edgar/data/4515/000000620121000024/aex991securednotespricingp.htm',
  lastVerified: DATE,
};
const americanCollateral = {
  label: 'American Airlines — AAdvantage financing collateral and intercompany structure',
  href: 'https://www.sec.gov/Archives/edgar/data/4515/000000620121000098/aal-20210930.htm',
  lastVerified: DATE,
};

const apptronik = {
  label: 'Apptronik — more than $935 million Series A financing',
  href: 'https://apptronik.com/news-collection/apptronik-closes-over-935-million-series-a',
  lastVerified: DATE,
};
const figure = {
  label: 'Figure — more than $1 billion Series C at $39 billion post-money valuation',
  href: 'https://www.figure.ai/news/series-c',
  lastVerified: DATE,
};

export const SYSTEMS_SEARCH_DEMAND_ARTICLES: ResearchArticle[] = [
  {
    kind: 'research',
    cluster: 'search-console',
    slug: 'search-console-query-vs-page-totals',
    number: '45',
    category: 'SEARCH CONSOLE',
    title: 'Why Search Console Query Totals Do Not Match Page Totals',
    seoTitle: 'Why Search Console Query Totals Don’t Match Page Totals',
    subtitle: 'Anonymized queries, 1,000-row UI limits, top-row API behavior, and property-vs-page aggregation make apparently inconsistent Search Console totals mathematically legitimate.',
    seoDescription: 'Why do Search Console query totals differ from page totals? Learn anonymized queries, row limits, API truncation and property-vs-page aggregation with a reproducible reconciliation method.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Search Console / hidden query rows / aggregation',
      note: 'A dashboard total, page table, and query table can all be correct while answering different aggregation and privacy questions.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '9 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Search Console totals reconcile only after accounting for privacy filtering, row truncation, and aggregation level; summing visible query rows is not a valid reconstruction of the property-level chart total.',
    conclusion: {
      title: 'Treat the chart total as a different dataset, not a broken sum',
      content: 'Query tables intentionally omit some data and page grouping can change aggregation. Reconciliation should record the date range, filters, search type, aggregation mode, visible-row total, and chart/property total, then classify the residual instead of forcing it into named queries.',
    },
    evidenceBoundary: 'Search Console privacy thresholds and internal serving limits are not fully exposed, so the exact composition of the hidden residual cannot be reconstructed from the UI. Google explicitly documents anonymized queries and truncation; this page does not attempt to deanonymize them.',
    metrics: [
      { label: 'UI table cap', value: '1,000 ROWS' },
      { label: 'API max rowLimit', value: '25,000 / REQUEST' },
      { label: 'API guarantee of all rows', value: 'NO' },
      { label: 'Anonymized queries in query table', value: 'OMITTED' },
    ],
    content: [
      'Search Console can show 10,000 impressions in the chart while the visible query rows add to much less. That is expected behavior, not necessarily a data bug. Google documents three major reasons: the query table omits anonymized low-frequency queries, the interface only displays up to 1,000 rows, and grouping by page or Search appearance changes the aggregation compared with the property-level chart.',
      'The API adds another trap. A request can page through rows with startRow and rowLimit, but Google states that Search Analytics is bounded by internal limitations and does not guarantee every row. “I paginated the API” is therefore not proof that the named-query rows reconstruct the full property total.',
    ],
    sections: [
      {
        id: 'anonymized',
        title: 'Anonymized queries create a deliberate residual',
        paragraphs: [
          'Google removes rare or privacy-sensitive query strings from the query table. Their clicks and impressions can still contribute to the unfiltered chart total. As a result, named queries plus “queries not containing X” can fail to equal the property total when a query filter causes the anonymized bucket to disappear.',
          'The correct analytical treatment is an unattributed residual. Do not invent an “other” keyword distribution or proportionally allocate the missing impressions across visible queries.',
        ],
      },
      {
        id: 'row-limits',
        title: 'The UI and API are different truncation surfaces',
        paragraphs: [
          'The Performance table can display a maximum of 1,000 rows. The Search Analytics API supports a rowLimit up to 25,000 and startRow pagination, but the API documentation still warns that internal Search Console limitations mean it returns top rows rather than a guaranteed complete universe.',
          'For a small property, those limits may not matter on most days. For long-tail analysis, they can dominate. A sudden gap between chart totals and exported query rows can reflect visibility into the tail rather than a change in actual impressions.',
        ],
      },
      {
        id: 'aggregation',
        title: 'Property aggregation and page aggregation count differently',
        paragraphs: [
          'At property level, multiple results from the same Search Console property on one search can be consolidated into one property impression. When grouping by page, individual URLs are credited separately. Summing URL rows can therefore differ from the property-level chart even before privacy filtering.',
          'Position also changes meaning across aggregation choices because the topmost result for the property can differ from individual URL positions. A pipeline should never join property-level and page-level metrics without carrying the aggregation type.',
        ],
      },
      {
        id: 'reconciliation',
        title: 'A reproducible reconciliation table',
        paragraphs: [
          'Store five numbers for every extraction: property chart clicks/impressions, visible query-row clicks/impressions, visible page-row clicks/impressions, API-row totals under the exact dimensions requested, and the residual versus the property total. Also store search type, dates, filters, and dataState.',
          'The residual is itself useful. If it grows while page impressions grow, the site may be accumulating more long-tail exposure. But because anonymization and serving limits are mixed together, label that interpretation as a measurement hypothesis rather than a count of hidden keywords.',
        ],
      },
    ],
    sources: [gscDiscrepancies, gscData, gscApi],
  },
  {
    kind: 'research',
    cluster: 'search-console',
    slug: 'search-console-data-pipeline',
    number: '46',
    category: 'SEARCH CONSOLE',
    title: 'How to Build a Search Console Data Pipeline That Preserves Evidence',
    seoTitle: 'Search Console Data Pipeline: API, BigQuery, Evidence & QA',
    subtitle: 'A production Search Console pipeline should preserve raw extracts, aggregation metadata, incomplete-data flags, anonymized-query boundaries, and reproducible derived tables.',
    seoDescription: 'Build a Search Console data pipeline with raw API or BigQuery exports, partitioned facts, query/page aggregates, evidence snapshots, QA checks and reproducible SEO reports.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Search Console / raw facts / derived metrics',
      note: 'The pipeline should make every chart traceable back to an extraction window, aggregation mode, and immutable raw record.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '11 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'The durable Search Console data model separates immutable raw facts from derived SEO judgments and carries Google’s privacy, truncation, aggregation, and incomplete-data boundaries all the way to the report.',
    conclusion: {
      title: 'Preserve the evidence boundary with the metric',
      content: 'A useful SEO pipeline can answer not just “what changed?” but “which source rows, date state, aggregation rule, and transformation produced this claim?” BigQuery bulk export is the strongest base for large properties; the API remains useful for targeted pulls and operational checks.',
    },
    evidenceBoundary: 'Google’s bulk export excludes anonymized query strings and the API can return top rows rather than every row. No pipeline can reconstruct data that Google does not disclose. The design below preserves those boundaries instead of masking them.',
    metrics: [
      { label: 'Raw layers', value: 'SITE + URL IMPRESSION' },
      { label: 'Preferred large-site feed', value: 'BIGQUERY BULK EXPORT' },
      { label: 'Anonymized query value', value: 'EMPTY STRING IN BULK EXPORT' },
      { label: 'Core rule', value: 'RAW → NORMALIZED → DERIVED' },
    ],
    content: [
      'A Search Console pipeline becomes unreliable when the same table mixes Google’s source data, cleaned dimensions, opportunity scores, and human judgments. The fix is a layered model: retain the raw export, normalize it without changing meaning, materialize stable aggregates, and compute SEO decisions in a separate derived layer.',
      'Google’s BigQuery bulk export is the cleanest source for large or long-lived properties because it delivers ongoing daily data without the ordinary daily row limit, apart from anonymized queries. For smaller or tactical workflows, the Search Analytics API is still useful, but the extraction job should preserve its dimensions, filters, aggregation type, row limits, and incomplete-data metadata.',
    ],
    sections: [
      {
        id: 'raw-layer',
        title: 'Layer 1: immutable source facts',
        paragraphs: [
          'Store each daily bulk-export partition or API response exactly as received, plus extraction timestamp, property identifier, requested date window, dimensions, filters, search type, dataState, and aggregation type. Do not overwrite yesterday’s raw response with a refreshed one without versioning the change.',
          'For API pulls that include fresh data, persist Google’s first_incomplete_date or first_incomplete_hour metadata. A ranking alert built on still-changing rows should be labeled provisional.',
        ],
      },
      {
        id: 'normalized-layer',
        title: 'Layer 2: normalized query, URL, country, device, and appearance keys',
        paragraphs: [
          'Normalize URL casing and canonical host policy only where the semantics are known. Keep Google’s credited URL as a source field. For bulk export, preserve empty query strings as the anonymized-query bucket instead of dropping them during ingestion unless a downstream analysis explicitly asks for named queries only.',
          'Generate stable surrogate keys for the property, URL, query, device, country, search type, and appearance dimensions. Store the raw string beside the normalized value so a future normalization bug can be reversed.',
        ],
      },
      {
        id: 'aggregate-layer',
        title: 'Layer 3: materialized summaries instead of dashboard scans',
        paragraphs: [
          'Google recommends pre-aggregating frequent BigQuery views rather than pointing dashboards at the raw fact tables. A daily URL table, daily query table, query-by-URL table, and rolling 7/28/90-day comparison layer cover most SEO diagnostics without rescanning the full dataset on every page load.',
          'Partition by data date and apply date filters early. For exploratory analyses where exactness is unnecessary, BigQuery’s approximate functions can cut processing costs.',
        ],
      },
      {
        id: 'decision-layer',
        title: 'Layer 4: derived opportunity records with provenance',
        paragraphs: [
          'A content-opportunity record should store the query cluster, target URL, current impressions, clicks, CTR, average position, comparison window, scoring formula version, evidence-row IDs, and a status such as observe, rewrite, create, consolidate, or reject. The recommendation is derived data; the underlying Google facts remain untouched.',
          'This separation makes strategy auditable. When an article is created, the system can later compare its pre-publication query cluster with post-publication data without pretending that every change was caused by the article.',
        ],
      },
      {
        id: 'qa',
        title: 'QA gates before a metric becomes a claim',
        paragraphs: [
          'Check date completeness, aggregation compatibility, duplicate ingestion, zero-impression anomalies, unexpectedly missing partitions, canonical URL changes, and query-table residuals. A chart should carry its extraction cutoff and whether fresh/incomplete data was included.',
          'Finally, preserve the exact SQL or transformation version used to create important public results. “Search Console says” is not reproducible unless another analyst can regenerate the number from the retained source rows.',
        ],
      },
    ],
    sources: [gscApi, gscBulk, gscBigQuery, gscDiscrepancies],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'coreweave-ddtl-5-5',
    number: '47',
    category: 'AI INFRASTRUCTURE FINANCE',
    title: 'CoreWeave DDTL 5.5: How a $2.6 Billion GPU-Backed Loan Works',
    seoTitle: 'CoreWeave DDTL 5.5: $2.6B GPU Loan Structure Explained',
    subtitle: 'The August 2026 facility finances GPU servers and related infrastructure against customer-contract economics through a dedicated CoreWeave financing subsidiary.',
    seoDescription: 'CoreWeave DDTL 5.5 explained: $2.6B delayed-draw loan, SOFR + 5.50%, 2031 maturity, GPU collateral, customer contracts and asset-level financing structure.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Customer contract / GPU asset / delayed-draw loan',
      note: 'The financing connects contracted AI demand to specific infrastructure capex rather than funding the entire company through one unsecured corporate balance sheet.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '10 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'DDTL 5.5 turns contracted AI-infrastructure demand into financeable asset-level cash flow: a dedicated subsidiary can draw debt as GPU servers and related infrastructure are purchased to perform eligible customer contracts.',
    conclusion: {
      title: 'The innovation is contract-backed asset finance at AI scale',
      content: 'CoreWeave is matching infrastructure debt to deployed GPU assets and customer cash flows rather than relying exclusively on parent-level unsecured capital. That reduces some financing mismatch but leaves residual-value, re-leasing, customer concentration, refinancing, and technology-obsolescence risk inside the credit.',
    },
    evidenceBoundary: 'This page explains disclosed facility terms and capital structure; it is not a credit rating, valuation, or investment recommendation. The full collateral package, borrowing-base mechanics, covenants, and contract eligibility tests should be read in the governing credit documents before drawing a credit conclusion.',
    metrics: [
      { label: 'Facility size', value: '$2.6B' },
      { label: 'SOFR margin', value: '+5.50%' },
      { label: 'Maturity', value: 'SEP. 1, 2031' },
      { label: 'Draw window', value: 'THROUGH DEC. 2026' },
    ],
    content: [
      'CoreWeave’s DDTL 5.5 is a $2.6 billion delayed-draw term loan entered into in August 2026 through CoreWeave Financing DDTL V-V, LLC, an indirect subsidiary. CoreWeave’s SEC filing says the facility is primarily intended to finance capital expenditures required to perform customer contracts, including GPU servers and related infrastructure.',
      'The structure matters because AI cloud companies spend enormous amounts before the matching customer revenue arrives. A delayed-draw facility lets the borrower fund qualifying deployments as the capex is incurred instead of holding the full debt proceeds from day one. The loan matures September 1, 2031 and prices at Term SOFR plus 5.50% for SOFR borrowings.',
    ],
    sections: [
      {
        id: 'borrower',
        title: 'The borrower sits below the public parent',
        paragraphs: [
          'The named borrower is a dedicated financing subsidiary rather than CoreWeave, Inc. itself. CoreWeave has used similar special-purpose or asset-level structures across its DDTL platform, allowing lenders to underwrite a defined pool of infrastructure and contract cash flows.',
          'A financing subsidiary does not mean the economics are isolated from CoreWeave’s operating platform. The GPU deployments still depend on CoreWeave’s ability to build, power, network, operate, and re-market the capacity.',
        ],
      },
      {
        id: 'collateral',
        title: 'Customer contracts make GPU capex more debt-like',
        paragraphs: [
          'CoreWeave’s June 2026 filing says its DDTLs are generally collateralized by the assets underlying contributed customer contracts and pledged contractual cash flows, often with investment-grade counterparties. That is a stronger underwriting object than speculative GPU purchases with no contracted user.',
          'The lender is still exposed to contract duration and asset life. CoreWeave’s closing release notes that DDTL 5.5 has an approximately five-year maturity while underlying customer contracts average about three years, so repayment can depend on renewal or re-leasing after the initial contract.',
        ],
      },
      {
        id: 'economics',
        title: 'SOFR + 5.50% is the visible price, not the whole cost',
        paragraphs: [
          'The SEC filing gives a floating rate of Term SOFR plus 5.50%, or a base-rate alternative plus 4.50%. Commitment fees, original issue economics, hedging, amortization, collateral requirements, reserves, and transaction costs can change the all-in economics.',
          'Because the facility is delayed draw, unused commitments and draw timing also matter. Debt should arrive as qualifying capex ramps, which can reduce negative carry compared with borrowing the entire amount before deployment.',
        ],
      },
      {
        id: 'residual-risk',
        title: 'The credit ultimately depends on what happens after the first contract',
        paragraphs: [
          'A GPU server can have useful life beyond one customer contract, but its market value is not fixed. New accelerators can reduce the relative value of older hardware, and data-center capacity can be constrained or advantaged by power, network, cooling, and location.',
          'CoreWeave’s release explicitly frames renewal or re-leasing as part of the structure. That turns residual-value and remarketing capability into credit variables alongside the initial contract counterparty.',
        ],
      },
    ],
    sources: [coreweave85, coreweave10q, coreweaveRelease],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'gpu-financing-ai-infrastructure',
    number: '48',
    category: 'AI INFRASTRUCTURE FINANCE',
    title: 'How AI Companies Finance GPUs Without Putting Everything on the Parent Balance Sheet',
    seoTitle: 'How AI Companies Finance GPUs: Asset-Level Debt & Contract SPVs',
    subtitle: 'CoreWeave’s DDTL platform shows how customer contracts, GPU assets, pledged cash flows, and bankruptcy-remote financing subsidiaries can fund AI infrastructure below the parent company.',
    seoDescription: 'How AI infrastructure companies finance GPUs with delayed-draw loans, asset-level debt, contract-backed SPVs, pledged cash flows and residual-value underwriting.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'GPU fleet / customer contract / financing SPV',
      note: 'Contracted compute demand can be transformed into asset-level collateral when the lender can trace equipment, cash flow, and control rights.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '11 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'At sufficient scale, contracted GPU infrastructure can be financed like project equipment: isolate eligible assets and cash flows, borrow against the contract-backed deployment, and reserve parent-level equity and debt for the risks the asset vehicle cannot absorb.',
    conclusion: {
      title: 'GPU finance is converging with infrastructure finance',
      content: 'The more standardized the equipment, contracts, deployment milestones, and cash-control package become, the easier it is to finance AI capex below the parent. The limit is residual risk: GPUs depreciate economically, customer contracts expire, power capacity is location-specific, and the operating platform still has to redeploy the asset.',
    },
    evidenceBoundary: 'CoreWeave is the primary public case because it discloses large DDTL facilities. This page uses that case to explain financing mechanics; it does not claim every AI company has access to identical non-recourse debt or that GPU collateral has stable liquidation value.',
    metrics: [
      { label: 'CoreWeave DDTLs outstanding Jun. 2026', value: '$13.6B' },
      { label: 'DDTL 5.5', value: '$2.6B' },
      { label: 'CoreWeave total indebtedness Jun. 2026', value: '$35.6B' },
      { label: 'Core financing object', value: 'ASSET + CONTRACT CASH FLOW' },
    ],
    content: [
      'The parent-company balance sheet is not the only place to finance GPUs. CoreWeave’s public filings show a repeatable alternative: contribute eligible customer contracts and the associated infrastructure into financing structures, pledge the equipment and contract cash flows, and borrow through dedicated subsidiaries. The result resembles project finance more than a generic venture-backed server purchase.',
      'The economic logic is straightforward. A three-year take-or-pay or committed cloud contract can support debt against the servers required to deliver it. The financing becomes stronger when the counterparty is creditworthy, the deployment is identifiable, the cash is pledged, and the hardware can be re-leased if the first contract expires before the loan.',
    ],
    sections: [
      {
        id: 'capital-stack',
        title: 'The AI infrastructure capital stack',
        paragraphs: [
          'Equity absorbs the first-loss and platform risk. Parent-level debt funds broader corporate needs. Asset-level DDTLs fund defined GPU deployments. Equipment leases, vendor terms, data-center leases, and customer prepayments can sit around those layers depending on the contract.',
          'The stack lowers the amount of expensive equity needed per dollar of deployed GPU capacity. It also increases fixed claims and refinancing dependence, so leverage can amplify both the scalability and the downside of the operating model.',
        ],
      },
      {
        id: 'spv',
        title: 'Why use a financing subsidiary or SPV',
        paragraphs: [
          'A dedicated borrower can separate eligible collateral, pledged accounts, customer contracts, and lender controls from unrelated corporate assets. CoreWeave describes some DDTL structures through bankruptcy-remote special-purpose consolidated subsidiaries.',
          'That isolation can make underwriting simpler and can improve lender confidence in the cash-flow path. It does not make operational dependencies disappear: the SPV still relies on the wider company for data-center operations, software, scheduling, customer support, procurement, and remarketing.',
        ],
      },
      {
        id: 'underwriting',
        title: 'What a GPU lender is really underwriting',
        paragraphs: [
          'The lender cares about the customer’s payment obligation, contract termination rights, deployment milestones, power and data-center readiness, server useful life, GPU resale or re-lease value, insurance, maintenance, concentration, and the borrower’s ability to redeploy capacity.',
          'The collateral package is therefore more than a pile of chips. A GPU without power, networking, a customer contract, or an operating platform can be worth materially less than the modeled productive asset.',
        ],
      },
      {
        id: 'failure-modes',
        title: 'The failure modes are different from SaaS debt',
        paragraphs: [
          'If the customer defaults, the borrower may need to find a replacement before debt service breaks. If a new GPU generation changes price-performance sharply, re-leasing assumptions can weaken. If a data-center build is late, the contract may not begin generating cash when the debt draw occurs.',
          'That makes contract duration versus debt maturity a central variable. DDTL 5.5’s roughly five-year maturity extending beyond the average three-year underlying customer contract makes the residual-value question explicit rather than hiding it in a terminal-value assumption.',
        ],
      },
    ],
    sources: [coreweave10q, coreweave85, coreweaveRelease],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'who-owns-austin-hvac-companies',
    number: '49',
    category: 'AUSTIN OWNERSHIP',
    title: 'Who Owns Austin’s HVAC Companies?',
    seoTitle: 'Who Owns Austin HVAC Companies? PE Platforms & Local Brands',
    subtitle: 'Austin HVAC brands span founder-owned shops, private-equity-backed platforms, public-company brands, and franchise operators. The local name often survives the transaction.',
    seoDescription: 'Who owns Austin HVAC companies? Trace Radiant, Stan’s, Fox, Daniel’s, Precision, Abacus, ARS, Goettl and other brands to current platforms and sponsors.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Austin HVAC brand / platform / sponsor',
      note: 'The logo on a service truck can remain local while the equity chain moves through a national platform and institutional sponsor.',
    },
    date: DATE,
    lastVerified: '2026.07.26',
    readTime: '10 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Austin HVAC is neither “all private equity” nor purely local: the July 2026 ownership census shows retained local brands beside founder-owned operators, public companies, franchisees, and sponsor-backed home-services platforms.',
    conclusion: {
      title: 'The brand and the owner are separate fields',
      content: 'Radiant, Stan’s, Fox, Daniel’s, Precision, Abacus, ARS, Goettl, and other Austin-facing HVAC brands sit in different ownership chains. A local operating identity can survive acquisition, so current ownership has to be verified through platform and sponsor records rather than inferred from a company’s founding story.',
    },
    evidenceBoundary: 'This vertical page is derived from the site’s July 26, 2026 Austin home-services census. It is a brand-ownership map, not market share, price, service quality, employment, or customer-volume research. Private-company control can change after the cutoff.',
    metrics: [
      { label: 'HVAC/plumbing/electrical census records', value: '26' },
      { label: 'Full Austin census', value: '67 BRANDS' },
      { label: 'Full source ledger', value: '130 RECORDS' },
      { label: 'Evidence cutoff', value: 'JUL. 26, 2026' },
    ],
    resources: [
      {
        label: 'Full Austin home-services ownership investigation',
        href: austinOwnership,
        description: 'The complete 67-brand ownership map, methodology, evidence ratings, conflicts, and limitations.',
        format: 'WEB',
      },
      {
        label: 'Austin ownership dataset',
        href: austinDataset,
        description: 'Normalized brand-level ownership table behind the July 2026 census.',
        format: 'CSV',
      },
    ],
    content: [
      'Austin’s HVAC market contains several different ownership models under customer-facing names that still feel local. Radiant traces through T3 Services Group to The Riverside Company. Stan’s sits inside Master Trades Group, an L Catterton investment. Fox Service Company, Precision Heating & Air, and Daniel’s Plumbing & Air sit inside Southern Home Services, where Gryphon Investors holds a majority investment through the holding-company structure.',
      'Other chains differ again. Abacus is disclosed as a Wrench Group subsidiary. ARS/Rescue Rooter Austin traces to American Residential Services and GI Partners at the July cutoff, while a sale process had been reported but not closed. Goettl is a Cortec investment. Those relationships describe equity and platform control; they do not by themselves establish how the local branch is managed or whether service changed after acquisition.',
    ],
    sections: [
      {
        id: 'retained-brands',
        title: 'Private-equity ownership often leaves the local brand in place',
        paragraphs: [
          'Home-services platforms commonly retain acquired names because the local brand already has reviews, phone numbers, technician recognition, organic search visibility, and decades of customer memory. The acquisition can therefore be economically significant while barely changing the logo a homeowner sees.',
          'Fox is a useful example: the company can accurately describe local management and operations while ownership records place the brand inside Southern Home Services and Gryphon’s broader platform. “Locally operated” and “locally owned” answer different questions.',
        ],
      },
      {
        id: 'major-chains',
        title: 'Selected Austin HVAC ownership chains',
        paragraphs: [
          'Radiant → T3 Services Group → The Riverside Company. Stan’s → Master Trades Group → L Catterton. Fox, Precision, and Daniel’s → Southern Home Services → Gryphon Investors. Abacus → Wrench Group, with the investor structure sitting above Wrench. ARS/Rescue Rooter → American Residential Services → GI Partners at the research cutoff.',
          'The full census retains confidence ratings and dates because private ownership can change through add-on deals, sponsor exits, recapitalizations, and founder rollovers.',
        ],
      },
      {
        id: 'not-market-share',
        title: 'A brand count is not HVAC market share',
        paragraphs: [
          'The census counts qualifying consumer-facing brands once. A one-location founder business and a multi-state platform brand therefore have equal weight in the denominator. Revenue, trucks, service calls, technicians, permits, paid-search share, and organic visibility would produce different concentration measures.',
          'This page should be used to answer “who owns this brand?” rather than “who controls Austin HVAC demand?” The latter requires transaction or operating data that the public ownership record does not provide.',
        ],
      },
      {
        id: 'verification',
        title: 'How the ownership chain was verified',
        paragraphs: [
          'The underlying project gives priority to current sponsor portfolio pages, buyer and seller announcements, company legal/privacy disclosures, government records, and current platform brand lists. Old acquisition press releases are checked for later exits before being treated as current ownership.',
          'Unresolved or pending transactions stay labeled that way. A reported sale process is not a completed sale, and a minority investment is not automatically control.',
        ],
      },
    ],
    sources: [riversideT3, southernGryphon, lCattertonMasterTrades, giArs],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'who-owns-austin-plumbing-electrical-companies',
    number: '50',
    category: 'AUSTIN OWNERSHIP',
    title: 'Who Owns Austin’s Plumbing and Electrical Companies?',
    seoTitle: 'Who Owns Austin Plumbing & Electrical Companies?',
    subtitle: 'Austin plumbing and electrical brands include local operators, multi-trade platforms, sponsor-backed rollups, and franchises. Ownership can sit several layers above the name on the truck.',
    seoDescription: 'Who owns Austin plumbing and electrical companies? Trace Abacus, Radiant, Stan’s, Daniel’s, Roger’s and multi-trade brands to their platforms and investors.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Austin plumbing / electrical / ownership chain',
      note: 'Multi-trade platforms can acquire a plumbing brand, add HVAC or electrical service, and keep the original consumer name.',
    },
    date: DATE,
    lastVerified: '2026.07.26',
    readTime: '9 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Austin plumbing and electrical ownership is increasingly multi-trade: several familiar local brands now sit inside broader home-services platforms while founder-owned and franchise businesses remain a large part of the researched universe.',
    conclusion: {
      title: 'Trace the legal chain, not the service menu',
      content: 'A company can add plumbing, HVAC, and electrical services after joining a platform without changing its consumer brand. Current ownership therefore has to be traced through legal entities, parent platforms, sponsors, and franchise relationships rather than inferred from the trade category.',
    },
    evidenceBoundary: 'This page reuses the July 26, 2026 audited Austin home-services ownership dataset. It does not rank service quality or price and does not treat every plumbing or electrical contractor in the Austin metro as part of the census.',
    metrics: [
      { label: 'Full Austin census', value: '67 BRANDS' },
      { label: 'Mechanical-trade records', value: '26' },
      { label: 'Sponsor-backed census records', value: '14' },
      { label: 'Evidence cutoff', value: 'JUL. 26, 2026' },
    ],
    resources: [
      {
        label: 'Full Austin home-services ownership investigation',
        href: austinOwnership,
        description: 'Complete ownership map and methodology across HVAC, plumbing, electrical, roofing, foundation repair, and pest control.',
        format: 'WEB',
      },
      {
        label: 'Austin ownership dataset',
        href: austinDataset,
        description: 'Brand-level parent, sponsor, owner type, evidence rating, and footprint fields.',
        format: 'CSV',
      },
    ],
    content: [
      'Several Austin plumbing and electrical brands now sit inside multi-trade home-services platforms. Radiant, for example, is an Austin brand inside T3 Services Group and Riverside’s portfolio. Stan’s sits inside Master Trades Group under L Catterton. Daniel’s Plumbing & Air is part of Southern Home Services under Gryphon. Abacus is a Wrench Group subsidiary.',
      'That does not mean independent businesses disappeared. The broader 67-brand census still contains many founder, family, or locally owned operators as well as franchisees and unresolved private companies. The point of the ownership map is to distinguish those structures rather than using the presence of a local brand name as a proxy for local equity control.',
    ],
    sections: [
      {
        id: 'multi-trade',
        title: 'Why plumbing, HVAC, and electrical ownership increasingly overlaps',
        paragraphs: [
          'A home-services platform can cross-sell multiple trades into the same household, dispatch from a shared system, centralize call centers and marketing, and acquire add-on brands with adjacent licenses and technician bases. The consumer brand may therefore expand into a second or third trade after joining the platform.',
          'This creates a search problem: “Austin plumber” and “Austin HVAC company” can return brands that ultimately have the same parent even though the logos and websites remain separate.',
        ],
      },
      {
        id: 'selected-chains',
        title: 'Selected plumbing and electrical ownership chains',
        paragraphs: [
          'Radiant → T3 Services Group → The Riverside Company. Stan’s → Master Trades Group → L Catterton. Daniel’s → Southern Home Services → Gryphon Investors. Abacus → Wrench Group. Roger’s Plumbing sits inside SAS Service Partners, backed by Storr Group according to the underlying ownership package.',
          'These labels describe the supported current chain at the cutoff. They do not imply that every platform owner has 100% of every operating subsidiary or that a founder has no continuing role or rolled equity.',
        ],
      },
      {
        id: 'franchise',
        title: 'Franchise ownership is a different edge from platform ownership',
        paragraphs: [
          'A local franchisee can own or operate the Austin business while using a national brand whose franchisor has its own corporate owner. Treating the franchisor’s investor as the direct owner of the local franchisee without evidence would collapse two separate legal relationships.',
          'The dataset therefore records franchise relationships separately from parent-subsidiary and sponsor-control relationships.',
        ],
      },
      {
        id: 'consumer-use',
        title: 'What ownership can and cannot tell a homeowner',
        paragraphs: [
          'Ownership can tell you whether two brands share a platform, whether a sponsor or public company sits above the operator, and whether a local claim refers to management or equity. It cannot, by itself, tell you which contractor will quote less, arrive faster, or do better work.',
          'Those outcomes need separate data. The useful contribution here is reducing hidden common ownership before a customer or analyst starts comparing apparently independent brands.',
        ],
      },
    ],
    sources: [riversideT3, southernGryphon, lCattertonMasterTrades],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'private-equity-home-services-rollups',
    number: '51',
    category: 'HOME-SERVICES FINANCE',
    title: 'How Private-Equity Rollups Work in Home Services',
    seoTitle: 'How Private Equity Home-Service Rollups Work: Platform + Add-Ons',
    subtitle: 'The home-services rollup model buys or partners with local HVAC, plumbing, roofing, and pest brands, then layers them into larger operating platforms while often preserving the local name.',
    seoDescription: 'How private-equity home-services rollups work: platform acquisitions, add-ons, founder rollover, retained brands, centralized systems, leverage and sponsor exits.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Local brand / operating platform / sponsor',
      note: 'The rollup is an ownership and operating architecture: retained local customer acquisition on the front end, consolidated capital and systems above it.',
    },
    date: DATE,
    lastVerified: '2026.07.26',
    readTime: '11 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Home-services rollups create value by combining fragmented local demand and retained brands with larger-platform purchasing, recruiting, dispatch, finance, and acquisition capacity; the structure can also add leverage, integration risk, and ownership opacity.',
    conclusion: {
      title: 'A rollup is a capital system, not merely a list of acquisitions',
      content: 'The platform has to turn acquired local brands into durable cash flow after purchase price, debt service, integration costs, technician retention, and future maintenance capex. Keeping the local name can preserve customer acquisition, but it also makes common ownership harder for consumers to see.',
    },
    evidenceBoundary: 'This is a structural analysis grounded in the Austin ownership census and sponsor transaction records. It does not claim that private-equity ownership causes a particular price, service, wage, or customer outcome without separate causal evidence.',
    metrics: [
      { label: 'Austin sponsor-backed brands in census', value: '14' },
      { label: 'Full census', value: '67 BRANDS' },
      { label: 'Common transaction', value: 'PLATFORM + ADD-ON' },
      { label: 'Key risk', value: 'INTEGRATION + LEVERAGE' },
    ],
    resources: [
      {
        label: 'Austin home-services ownership investigation',
        href: austinOwnership,
        description: 'A 67-brand case study showing how local brands map into platforms, sponsors, franchises, and public companies.',
        format: 'WEB',
      },
      {
        label: 'Austin ownership dataset',
        href: austinDataset,
        description: 'Machine-readable brand and ownership classifications used as the local empirical base.',
        format: 'CSV',
      },
    ],
    content: [
      'A private-equity home-services rollup usually starts with a platform: an operator large enough to acquire additional HVAC, plumbing, electrical, roofing, foundation, or pest-control businesses. The sponsor supplies equity capital and often acquisition capacity; the platform buys or partners with local companies; founders may sell outright, roll equity, or continue managing the local operation.',
      'The local brand often survives because its phone number, reviews, technicians, search visibility, and neighborhood reputation are valuable assets. Consolidation therefore can be invisible in the customer interface even while finance, procurement, call-center technology, recruiting, and acquisition decisions move upward.',
    ],
    sections: [
      {
        id: 'platform-add-on',
        title: 'Platform first, add-ons second',
        paragraphs: [
          'The first larger investment creates a platform with management, systems, lender relationships, and a repeatable acquisition process. Smaller add-ons can then be purchased and integrated at the platform level. The sponsor is underwriting both the existing cash flow and the ability to keep deploying capital into fragmented local markets.',
          'That strategy can create multiple expansion if small businesses are bought at lower valuation multiples than the scaled platform eventually receives at exit. But the spread is not free: transaction costs, integration, debt, systems migration, management bandwidth, and lost technicians can consume it.',
        ],
      },
      {
        id: 'retained-brand',
        title: 'Why acquired companies keep their names',
        paragraphs: [
          'Home services are highly local. A consumer searches for an emergency plumber or AC repair company nearby, not for a holding company. Retaining the acquired name can preserve reviews, local SEO, trucks, licenses, and customer memory while the platform consolidates functions behind the scenes.',
          'That creates a disclosure problem for consumers and researchers. Multiple brands in the same search result can share a common platform and sponsor, so brand-level competition can look more fragmented than ownership actually is.',
        ],
      },
      {
        id: 'economics',
        title: 'Where the rollup economics come from',
        paragraphs: [
          'Potential gains include shared procurement, denser technician routing, centralized call conversion, broader recruiting, cross-selling between trades, standardized software, improved working-capital management, and lower-cost access to debt or insurance. Acquisition itself can also be the growth engine.',
          'The sponsor must still pay for the business. A rollup financed at aggressive leverage or high acquisition multiples can need strong organic performance just to maintain its return. Interest rates and debt covenants therefore matter even in a service industry with little factory equipment.',
        ],
      },
      {
        id: 'risk',
        title: 'The main failure modes',
        paragraphs: [
          'Technicians and local managers can leave after a transaction. Centralized marketing can raise lead costs instead of lowering them. Cross-selling can damage trust. Integration can break dispatch or pricing. A platform can overpay for add-ons late in a consolidation cycle.',
          'Ownership opacity is another risk for research quality. Sponsor websites, platform pages, legal disclosures, and transaction announcements need dated verification because an old acquisition headline can remain online long after the sponsor exits.',
        ],
      },
    ],
    sources: [riversideT3, southernGryphon, lCattertonMasterTrades, giArs, dunesJaMar],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'airline-loyalty-collateral-valuation',
    number: '52',
    category: 'LOYALTY FINANCE',
    title: 'How Airline Loyalty Programs Are Valued as Collateral',
    seoTitle: 'How Airline Loyalty Programs Are Valued as Collateral',
    subtitle: 'Lenders value the recurring partner-cash system around a loyalty program—co-brand agreements, pledged accounts, IP, data rights, reserves, and cash-flow durability—not a pile of points.',
    seoDescription: 'How are airline loyalty programs valued as collateral? Follow partner cash, co-brand contracts, pledged accounts, AAdvantage debt capacity and the gap between debt and equity value.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Co-brand cash / loyalty IP / secured debt',
      note: 'Collateral value comes from controllable recurring cash and legal rights; program enterprise value, debt capacity, and airline equity value are separate measurements.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '11 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'A loyalty program becomes financeable when lenders can isolate recurring partner receipts and control the contracts, accounts, IP, reserves, and intercompany rights around them; valuation therefore starts with cash durability and collateral control rather than a retail cents-per-point estimate.',
    conclusion: {
      title: 'Debt capacity is evidence of cash-flow quality, not the program’s full value',
      content: 'American’s $10 billion AAdvantage financing showed that loyalty cash flows could support very large secured debt, but the borrowing amount is not an appraisal of program equity. A valuation must still forecast partner economics, redemption and fulfillment cost, contract concentration, required reinvestment, debt, and dependence on the airline network.',
    },
    evidenceBoundary: 'Public filings disclose substantial loyalty economics but not every co-brand price, allocation, renewal term, or lender model. Valuation multiples and DCF outputs remain analytical estimates. The page separates disclosed financing terms from modeled program value.',
    metrics: [
      { label: 'AAdvantage financing at close', value: '$10.0B' },
      { label: '2025 American partner cash', value: '$6.2B' },
      { label: '2025 AAdvantage liability', value: '$10.564B' },
      { label: 'Core collateral', value: 'CONTRACTS + CASH + IP + ACCOUNTS' },
    ],
    resources: [
      {
        label: 'Full loyalty-financing investigation',
        href: airlineInvestigation,
        description: 'The complete cash-flow, accounting, collateral, debt-waterfall, and valuation investigation.',
        format: 'WEB',
      },
    ],
    content: [
      'Lenders do not value an airline loyalty program by multiplying outstanding miles by a consumer redemption value. The secured asset is the cash-producing commercial system around the program: recurring payments from co-brand banks and other partners, key agreements, controlled deposit accounts, reserves, loyalty intellectual property and data rights, and the intercompany contracts needed to keep the program functioning.',
      'American’s 2021 AAdvantage financing makes that structure visible. The airline and a loyalty IP vehicle raised $10.0 billion through secured notes and a term loan. SEC filings describe collateral including specified AAdvantage agreements and payments, IP licenses, program rights, deposit and reserve accounts, equity in the loyalty vehicles, and other assets of those special-purpose entities.',
    ],
    sections: [
      {
        id: 'cash-flow',
        title: 'Start with recurring partner cash, not point balances',
        paragraphs: [
          'The card issuer pays the airline under a long-term commercial relationship that bundles miles, marketing, customer access, brand rights, and benefits. That partner payment can arrive well before the member redeems the award, creating recurring cash that is more useful to a lender than the nominal number of points outstanding.',
          'American reported $6.2 billion of cash remuneration from co-branded credit-card and other partners in 2025 in the source package underlying the companion investigation. That figure is not the same as loyalty revenue because accounting recognition and cash collection occur on different clocks.',
        ],
      },
      {
        id: 'collateral-control',
        title: 'Control of the cash path is part of collateral value',
        paragraphs: [
          'A lender receives more protection when partner payments flow through pledged or controlled accounts before excess cash reaches the airline. Reserve requirements, coverage tests, sweep mechanics, and early-amortization triggers reduce the ability to move value away from creditors after the debt is issued.',
          'The legal collateral package also matters because the program cannot be separated cleanly from the airline by economics alone. IP licenses and intercompany agreements help preserve the lender’s claim on the loyalty operating system through stress or restructuring.',
        ],
      },
      {
        id: 'enterprise-value',
        title: 'Program enterprise value and secured debt capacity are different',
        paragraphs: [
          'A program can support $10 billion of debt and still be worth substantially more—or less—depending on cash growth, margins, reinvestment, partner concentration, contract renewal risk, and the discount rate. The maximum prudent loan is constrained by lender coverage and downside recovery, not just the midpoint of an equity valuation.',
          'This is why headlines comparing a loyalty-program valuation with the airline’s market capitalization can mislead. Program enterprise value includes cash flows that depend on the airline ecosystem, while airline equity market value sits below the airline’s own debt and other claims.',
        ],
      },
      {
        id: 'risk',
        title: 'What reduces collateral value',
        paragraphs: [
          'A co-brand bank can renegotiate economics at renewal. Card spending can slow. Members can redeem faster. The airline can have fewer attractive seats to offer. A devaluation can protect economics but damage engagement. Regulatory or data-use changes can affect the partnership.',
          'The strongest valuation therefore stresses both partner cash and fulfillment. A loyalty program is unusually financeable because its cash can be recurring and asset-light, but its durability still depends on a healthy airline, valuable currency, engaged members, and powerful distribution partners.',
        ],
      },
    ],
    sources: [american2025, americanFinancing, americanCollateral],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'humanoid-robot-startup-financing',
    number: '53',
    category: 'ROBOTICS FINANCE',
    title: 'How Humanoid-Robot Companies Finance Hardware Before Scale',
    seoTitle: 'How Humanoid Robot Startups Finance Hardware Before Scale',
    subtitle: 'Apptronik and Figure show the pre-scale robotics pattern: very large equity rounds, strategic corporate investors, manufacturing buildout, and GPU/data spending before mature asset-backed debt becomes the obvious base case.',
    seoDescription: 'How humanoid robot startups finance hardware: Apptronik’s $935M+ Series A, Figure’s $1B+ Series C, strategic investors, manufacturing capex, GPUs and the path toward asset finance.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Humanoid robot / equity capital / manufacturing scale',
      note: 'Before a robot fleet has long operating history and contract cash flows, investors are financing technology, manufacturing, deployment learning, and working capital together.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '10 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Humanoid robotics is still financed mainly as venture and strategic growth equity because the capital must absorb technology, manufacturing, deployment, and market risk before individual robots or customer contracts can support standardized asset-level debt.',
    conclusion: {
      title: 'The financing will change when the cash flows become boring',
      content: 'Equity is expensive but flexible enough to fund rapid redesign, factory buildout, AI training, and uncertain unit economics. As fleets accumulate utilization history and customers sign durable contracts, portions of the stack can migrate toward equipment leases, receivables finance, vendor credit, or contract-backed debt—but the public 2026 evidence still shows equity doing most of the risk absorption.',
    },
    evidenceBoundary: 'Apptronik and Figure are illustrative public cases, not a complete industry census. Funding announcements describe committed capital and intended uses but do not disclose full unit economics, cash burn, customer contract terms, or future debt capacity.',
    metrics: [
      { label: 'Apptronik Series A total', value: '>$935M' },
      { label: 'Apptronik total capital raised', value: '~$1B' },
      { label: 'Figure Series C commitments', value: '>$1B' },
      { label: 'Figure post-money valuation', value: '$39B' },
    ],
    content: [
      'A humanoid robot company has to finance much more than the metal body. Before scale, the same capital pool funds hardware iteration, actuators and supply chain, manufacturing tooling, software and controls, GPU training infrastructure, field deployments, safety work, data collection, inventory, and the working capital between buying components and receiving customer cash.',
      'That risk mix explains why the headline 2025–2026 financings look like giant growth-equity rounds rather than conventional equipment loans. Apptronik announced a $520 million Series A-X extension in February 2026 after a $415 million initial Series A, taking the round above $935 million and total capital raised to nearly $1 billion. Figure announced more than $1 billion of Series C commitments in September 2025 at a $39 billion post-money valuation.',
    ],
    sections: [
      {
        id: 'why-equity',
        title: 'Why equity carries the early hardware risk',
        paragraphs: [
          'A lender prefers a stable asset value, predictable utilization, enforceable customer payments, and a clear recovery path. A pre-scale humanoid robot can change materially between hardware generations, and its value depends on proprietary software, service, spare parts, safety performance, and customer integration.',
          'Equity can tolerate that uncertainty because it participates in upside rather than requiring fixed scheduled repayment. The tradeoff is dilution and a much higher required return than secured equipment debt.',
        ],
      },
      {
        id: 'strategic-capital',
        title: 'Strategic investors can finance both capital and commercialization',
        paragraphs: [
          'Apptronik’s disclosed investors include Google, Mercedes-Benz, AT&T Ventures, John Deere, and other financial investors. Figure’s Series C included technology, asset-management, telecom, and semiconductor investors. Strategic capital can bring a prospective customer, supplier, compute partner, distribution relationship, or manufacturing knowledge in addition to cash.',
          'That does not mean every strategic investor has a commercial contract or special economics. The investment announcement establishes participation, not the full operating relationship.',
        ],
      },
      {
        id: 'use-of-funds',
        title: 'The capital is funding factories and AI at the same time',
        paragraphs: [
          'Figure said its Series C would support scaling robots into homes and commercial operations, expanding BotQ manufacturing, building GPU infrastructure for Helix training and simulation, and collecting new data. Apptronik described its financing as supporting production and deployment of Apollo.',
          'This combination makes the business more capital intensive than pure software and more R&D intensive than mature industrial equipment. A single round can be paying for both a factory learning curve and a foundation-model learning curve.',
        ],
      },
      {
        id: 'future-debt',
        title: 'What would make humanoid fleets financeable with debt',
        paragraphs: [
          'A future lender could underwrite robots more like equipment if there is reliable unit cost, useful life, maintenance history, residual value, insurance, customer credit, utilization, and multi-year contracted payments. A robotics-as-a-service receivable could eventually be financed separately from the parent’s R&D.',
          'The threshold is evidence, not hype. Once a fleet produces boring, repeatable cash flow, debt can fund the repeatable asset while equity remains responsible for the next hardware generation, software platform, and market expansion.',
        ],
      },
    ],
    sources: [apptronik, figure],
  },
];
