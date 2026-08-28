import type { ResearchArticle } from './articleModels';

export const INDEX_COMPANY_MATTERS_ARTICLE_SLUG =
  'what-happens-when-an-index-decides-a-company-matters';
export const INDEX_COMPANY_MATTERS_ARTICLE_PATH =
  `/research/financial-systems/${INDEX_COMPANY_MATTERS_ARTICLE_SLUG}`;

export const INDEX_COMPANY_MATTERS_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: INDEX_COMPANY_MATTERS_ARTICLE_SLUG,
  aliases: ['/markets/what-happens-when-an-index-decides-a-company-matters'],
  number: '19',
  category: 'FINANCIAL SYSTEMS',
  title: 'What Happens When an Index Decides a Company Matters?',
  seoTitle: 'What Happens When an Index Decides a Company Matters?',
  subtitle:
    'How private index rules become public market orders—and why inclusion can move ownership, liquidity, and price without guaranteeing permanent value.',
  seoDescription:
    'What happens when an index decides a company matters: follow index rules, fund demand, closing auctions, price effects, and cost-of-capital limits.',
  artwork: {
    kind: 'image',
    heroSrc: '/images/research/index-company-reader-hero.jpg',
    socialSrc: '/images/research/index-company-social.jpg',
    alt: 'Editorial market mechanism turning index rules into coordinated trading flows, ownership changes, liquidity, and divergent price paths.',
    label: 'Index inclusion / rules, demand, and market outcomes',
    caption:
      'The provider changes a rulebook; funds and market participants implement exposure through several channels, without guaranteeing a permanent price effect.',
    objectPosition: '50% 50%',
  },
  date: '2026.07.23',
  lastVerified: '2026.07.23',
  readTime: '22 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'Index administrators define classifications and weights. Contracts built around those definitions convert a private rule into public trading demand, but the size, timing, and persistence of the price effect depend on governance, source-index offsets, implementation choices, anticipation, and market liquidity.',
  conclusion: {
    title: 'A rule becomes demand through implementation',
    content:
      'Index providers define eligibility and weights; products tracking those rules translate them into time-bound trading demand. Any claimed price or capital-cost effect still needs product-level replication flows, event windows, offsets, liquidity, and persistence evidence.',
  },
  evidenceBoundary:
    'This web edition reformats the supplied July 23, 2026 institutional and quantitative evidence audit. The underlying sources were not independently refreshed for web publication. The supplied package did not include the event-level database, model outputs, exchange auction files, product-level holdings, or reproducible code required for a new multi-index event study, so no missing means, confidence intervals, auction fractions, arbitrage returns, or persistence estimates have been invented.',
  metrics: [
    { label: 'Tesla destination demand', value: '$78–85B' },
    { label: 'Tesla effective-day volume', value: '~$154B' },
    { label: 'S&P Indices 2025 revenue', value: '$1.850B' },
    { label: '2010–20 addition mean', value: '0.83%' },
  ],
  resources: [
    {
      label: 'Full index-decision evidence audit',
      href: '/research/index-company-matters-evidence-audit.pdf',
      description:
        'The complete 32-page investigation, including methodology comparisons, event evidence, participant economics, interpretation limits, fact checks, and the master source ledger.',
      format: 'PDF',
    },
    {
      label: 'Editable evidence audit',
      href: '/research/index-company-matters-evidence-audit.docx',
      description:
        'The supplied editable report used as the primary source document for this web edition.',
      format: 'DOCX',
    },
  ],
  content: [
    'An index provider does not manage the portfolios that follow its benchmark. It defines the eligible universe, membership, weights, review calendar, and treatment of exceptional events. A fund sponsor promises a form of tracking; a portfolio manager decides how and when to implement it; an exchange processes the orders; and arbitrageurs may accumulate inventory before the effective close.',
    'That authority is not uniform. S&P combines published screens with confidential committee selection. Russell relies mainly on capitalization ranks, public preliminary lists, and retention bands. Nasdaq-100 uses ranks and buffers with narrow special-case discretion. MSCI builds investable universes through size, liquidity, free-float, foreign-room, and market-access tests.',
    'The resulting trade is also smaller and less certain than headline “assets benchmarked” figures imply. Expected purchases must be based on replicating assets and implementation practice, then reduced for source-index selling, overlapping mandates, internal crossing, derivatives, sampling, and early execution. The closing auction is a coordination point, not the only place or time funds can change exposure.',
  ],
  sections: [
    {
      id: 'effective-close',
      title: 'The effective close: Tesla enters the S&P 500',
      paragraphs: [
        'S&P announced Tesla’s addition after the market closed on November 16, 2020, then chose a one-tranche implementation at Tesla’s full float-adjusted weight. The change became effective before the December 21 open, making the December 18 official close the benchmark price that tracking portfolios needed to match.',
        'Published estimates placed destination demand from S&P 500 trackers at roughly $78–$85 billion. Tesla was not migrating from the S&P MidCap 400 or SmallCap 600, so there was no same-stock sale by a related S&P size-index tracker to offset that buying. It was an unusually concentrated case, not a normal addition template.',
        'Tesla traded approximately $154 billion on the effective day—about 4.7 times its preceding ten-day average dollar volume. Yet it opened nearly 5% below the effective close, finished its first constituent day down 6.5%, and stood at $89.70 for each $100 invested at the effective close six months later. The provider’s decision created a large ownership transfer without guaranteeing a persistent premium.',
      ],
      figures: [
        {
          src: '/images/research/tesla-sp500-inclusion-price-path.png',
          alt: 'Tesla price path indexed to 100 at its S&P 500 effective close, falling at the first open, first close, and six-month mark.',
          label: 'Figure 01 / Post-effective reversal',
          caption:
            'The announcement-to-close rise and later reversal are not a clean causal estimate: anticipation, momentum, and concurrent news remain material confounders.',
          width: 1430,
          height: 599,
        },
      ],
    },
    {
      id: 'four-rule-systems',
      title: 'Four different systems decide who gets in',
      paragraphs: [
        'Index administration separates eligibility, selection, retention, weighting, rebalancing, reconstitution, and maintenance. A provider can be mechanical at one stage and judgment-based at another. “Rules-based” therefore does not mean judgment-free; it means judgment is located in definitions, data, exceptions, or committee choice.',
        'S&P’s screens determine who can be considered, but they do not create a right to admission. Russell makes ordinary membership more rank-driven and publishes a timetable that traders can model. Nasdaq-100 adds incumbent buffers and fast-entry rules. MSCI starts from international investability, including free float, foreign room, liquidity, and market-access constraints.',
      ],
      table: {
        caption: 'Where judgment and predictability sit in four major index families',
        columns: ['Index family', 'Ordinary entry logic', 'Primary judgment point', 'Predictability'],
        rows: [
          ['S&P 500', 'Eligibility screens plus committee selection', 'Confidential constituent choice, timing, and exceptions', 'Lower for ordinary additions'],
          ['Russell 1000/2000', 'Investability screens, capitalization ranks, and bands', 'Input definitions, timetable, and exceptional treatment', 'High around scheduled reviews'],
          ['Nasdaq-100', 'Capitalization ranks, retention buffers, and fast entry', 'Eligibility interpretation and special-case discretion', 'High for annual ranks; lower for exceptions'],
          ['MSCI GIMI', 'Country, size, float, liquidity, and foreign-access screens', 'Market classification and investability inputs', 'Varies by market and review event'],
        ],
      },
    },
    {
      id: 'provider-commercial-machine',
      title: 'The provider is a commercial rulemaker',
      paragraphs: [
        'Index providers sell licenses, data, subscriptions, analytics, custom indexes, and rights tied to exchange-traded products and derivatives. The same benchmark can support many products at once, allowing the provider to earn recurring revenue without purchasing the constituent securities.',
        'S&P Global reported $1.850 billion of Indices revenue in 2025: $1.206 billion of asset-linked fees, $320 million of subscriptions, and $324 million of usage-based royalties. The segment reported $1.271 billion of operating profit, or a 68.7% margin. Those economics show the value of a benchmark franchise, but a constituent change does not generate all provider revenue.',
        'The commercial model can create incentives around adoption, premium data, and custom design. It does not establish that a provider selected an issuer for private benefit. The relevant evidence is governance: documented methodologies, consultations, committee responsibilities, conflict registers, oversight, and access terms.',
      ],
      figures: [
        {
          src: '/images/research/index-provider-revenue-mix.png',
          alt: 'Stacked bar showing S&P Global Indices 2025 revenue of 1.206 billion dollars in asset-linked fees, 320 million in subscriptions, and 324 million in usage-based royalties.',
          label: 'Figure 02 / S&P Global Indices revenue mix',
          caption:
            'Asset-linked fees were the largest disclosed revenue stream, but subscriptions and product royalties also matter.',
          width: 1495,
          height: 525,
        },
      ],
    },
    {
      id: 'company-trying-to-qualify',
      title: 'What the company can—and cannot—control',
      paragraphs: [
        'An issuer can influence eligibility inputs through profitability, float, voting rights, liquidity, listing venue, corporate structure, and financial reporting. It can split shares, simplify a dual-class structure, issue stock, repurchase shares, or choose an eligible exchange. Those actions can make a company more likely to qualify without guaranteeing admission.',
        'Tesla accumulated the profitable quarters required by S&P’s methodology and entered the eligible universe. It could not observe the committee’s candidate slate, set the announcement time, choose one tranche instead of two, or order passive funds to buy at a chosen price.',
        'That distinction matters when evaluating management intent. A company may reorganize or communicate with eligibility in mind, but a documented eligibility motive is different from an inferred one. The supplied record supports narrow issuer incentives, not claims of coordinated conduct.',
      ],
    },
    {
      id: 'rule-to-trade',
      title: 'How a rule becomes a market order',
      paragraphs: [
        'A target weight is not a headline asset figure. For each product, predicted purchases should start with replicating assets and the fraction expected to be implemented in physical securities. The model must then subtract source-index selling, overlapping umbrella exposure, internal crossing, derivative substitution, sampling, and positions established before the close.',
        'A promotion from the S&P MidCap 400 to the S&P 500 illustrates the offset. Public ETF snapshots in the supplied audit imply about $1.81 billion of visible S&P 500 ETF buying and $2.01 billion of MidCap 400 ETF selling, for approximately $200 million of net visible ETF supply. That is not a complete flow estimate; it shows why gross destination assets can be directionally wrong.',
        'Portfolio managers can trade early, use futures or swaps, cross orders internally, work with transition managers, or accept temporary tracking error. The exchange auction concentrates the final handoff because the official close is the benchmark price, but it does not reveal every route by which exposure changed.',
      ],
      figures: [
        {
          src: '/images/research/index-migration-net-demand.png',
          alt: 'Bar chart showing 1.81 billion dollars of visible S&P 500 ETF buying, 2.01 billion of visible MidCap 400 ETF selling, and negative 200 million of net visible ETF demand.',
          label: 'Figure 03 / Gross demand versus net demand',
          caption:
            'The Flex migration illustration uses scale-normalized public ETF assets. It is a lower-bound teaching case, not a measured event-level flow.',
          width: 1414,
          height: 566,
        },
      ],
    },
    {
      id: 'event-study-evidence',
      title: 'The index effect changed by era',
      paragraphs: [
        'Published evidence rejects a single timeless “index effect.” Greenwood and Sammon report an S&P 500 addition announcement-period mean of 7.39% for 134 events in the 1990s and 0.83% for 153 events in 2010–2020. Their broader headline estimate for the latest decade is approximately 0.3%. Deletion effects also moved toward zero.',
        'The historical record still supports a sequence: anticipation, announcement, pre-effective positioning, the effective-session trade, closing-auction concentration, overnight reversal, and longer-run ownership or liquidity change. Different studies measure different links in that chain, so an announcement return should not be averaged with an auction-volume spike or treated as a permanent valuation effect.',
        'A shrinking average can coexist with a large individual case. Tesla combined unusual size, no source-index offset, strong momentum, and a one-tranche implementation. One dramatic event does not re-establish a stable modern coefficient.',
      ],
      figures: [
        {
          src: '/images/research/index-effect-by-era.png',
          alt: 'Line chart with confidence intervals showing S&P 500 addition and deletion coefficients moving toward zero from the 1980s through 2010 to 2020.',
          label: 'Figure 04 / S&P 500 effect by era',
          caption:
            'Controlled coefficients from the supplied Greenwood–Sammon comparison. Era estimates are published evidence, not new calculations from an event database in this project.',
          width: 1457,
          height: 687,
        },
      ],
    },
    {
      id: 'who-earns-transfer',
      title: 'Who earns—and bears—the transfer',
      paragraphs: [
        'The index provider earns licensing, subscription, data, and asset-linked revenue. A fund sponsor earns management fees and may share in securities-lending revenue, while bearing responsibility for tracking. Exchanges and liquidity suppliers earn transaction or market-data revenue and absorb operational risk around a concentrated close.',
        'Portfolio managers decide execution. Arbitrageurs forecast changes, accumulate or short inventory, hedge market risk, and try to transfer positions at the benchmark price. Existing shareholders may sell into temporary demand, while deleted-company holders can absorb price pressure and thin liquidity.',
        'The transfer is distributed across institutions rather than controlled by one actor. The provider defines; the sponsor promises; the manager trades; the exchange clears a price; arbitrageurs warehouse risk; and the issuer controls only its own eligibility inputs.',
      ],
      table: {
        caption: 'Participant economics in an index-change event',
        columns: ['Participant', 'Potential receipt', 'Primary risk or cost'],
        rows: [
          ['Index provider', 'Licensing, data, subscriptions, and asset-linked fees', 'Reputation, methodology, and regulatory risk'],
          ['Fund sponsor', 'Management and securities-lending revenue', 'Tracking error, trading cost, and transition governance'],
          ['Portfolio manager', 'Execution performance within mandate', 'Benchmark slippage and inventory risk'],
          ['Exchange / liquidity supplier', 'Auction, spread, and market-data revenue', 'Imbalance, resilience, and inventory loss'],
          ['Index arbitrageur', 'Convergence or liquidity premium', 'Prediction error, borrow cost, crowding, and reversal'],
          ['Existing shareholder', 'Opportunity to sell into demand', 'Pressure can be temporary; future upside is surrendered'],
        ],
      },
    },
    {
      id: 'governance-conflicts',
      title: 'Committee discretion deserves scrutiny, not mythology',
      paragraphs: [
        'S&P places constituent selection and methodology oversight inside its benchmark-administration governance. Committee deliberations are confidential, announcements follow a controlled timetable, and separate functions address integrity and conflict management. FTSE Russell, MSCI, and Nasdaq locate discretion differently but also publish governance and consultation structures.',
        'Potential conflicts remain around premium data, pro forma files, custom indexes, client input, and commercial incentives tied to benchmark adoption. Timely operational detail can be more valuable than the public headline as the effective close approaches.',
        'The supported conclusion is narrow. Providers have commercial incentives and nonpublic knowledge of upcoming decisions; they also maintain formal controls intended to separate methodology and administration from sales and related businesses. The evidence supports examining those controls, not alleging corruption.',
      ],
    },
    {
      id: 'cost-of-capital',
      title: 'Inclusion does not automatically lower the cost of capital',
      paragraphs: [
        'A one-day price increase cannot answer a financing question. Temporary inelastic demand transfers value among investors. Better liquidity can reduce transaction costs. Broader ownership and analyst attention can reduce segmentation or information frictions. Committee selection can also be interpreted as certification. These are separate mechanisms.',
        'A credible cost-of-capital test needs longer-horizon outcomes: seasoned-equity discounts, issuance likelihood, debt yields, credit spreads, implied cost of equity, financing mix, or investment. It also needs a counterfactual that separates inclusion from size, profitability, momentum, liquidity, and concurrent news.',
        'The supplied evidence supports a hierarchy. Temporary price pressure is documented in some eras and cases. Persistent ownership and liquidity changes are credible. Permanent valuation changes are mixed. A lower realized corporate cost of capital is plausible but unproven without an actual financing outcome and credible identification.',
      ],
      table: {
        caption: 'Why observable index effects do not answer the same question',
        columns: ['Mechanism', 'Observable measure', 'What it can establish', 'Primary limit'],
        rows: [
          ['Temporary demand', 'Effective-close return and reversal', 'A transfer among investors', 'Not a durable financing benefit'],
          ['Liquidity', 'Spreads, depth, turnover, lending, price impact', 'Lower trading friction', 'Firm and market trends also change'],
          ['Ownership / recognition', 'Passive ownership, breadth, analyst coverage', 'A different investor base', 'Selection and concurrent growth'],
          ['Permanent valuation', 'Matched long-horizon abnormal return', 'Possible discount-rate change', 'Identification is weak'],
          ['Financing cost', 'Debt spreads, issuance, implied cost of equity', 'Direct corporate outcome', 'No matched panel in the supplied package'],
        ],
      },
    },
    {
      id: 'index-inclusion-questions',
      title: 'Index inclusion questions, answered',
      paragraphs: [
        'The answers below keep the market-structure claim separate from the permanent-value claim.',
      ],
      bullets: [
        'What happens when a stock is added to an index? The provider changes membership or weight; tracking products then acquire the required exposure under their own implementation policies.',
        'What happens when a company joins the S&P 500? The exact demand depends on its target weight, physically replicating assets, source-index offsets, derivatives, internal crossing, and early positioning.',
        'Stock index inclusion effect: the average addition response has varied sharply by era and moved toward zero in modern published samples.',
        'Do stocks go up when added to an index? Some rise around announcement or implementation, but anticipation, selection, news, liquidity, and reversals prevent a universal answer.',
        'How index funds buy new constituents: managers can trade before the close, use closing auctions, cross internally, sample, or substitute derivatives within the fund’s mandate.',
        'Index rebalancing price impact: concentrated benchmark demand can move the closing price, but the visible auction is only part of the transition.',
        'Does index inclusion lower cost of capital? It may change liquidity and ownership, but the supplied evidence does not establish a causal reduction in corporate financing costs.',
      ],
    },
    {
      id: 'methodology-limits',
      title: 'Methodology and five interpretation limits',
      paragraphs: [
        'A finished empirical extension would require one observation per security-level membership or material weight event, permanent identifiers, methodology vintages, exact announcement and effective timestamps, source and destination weights, concurrent-news flags, product-level holdings, exchange auction records, and factor-adjusted returns.',
        'Event windows should separate announcement, anticipation, effective session, auction, overnight reversal, and +5, +20, +60, and +120 trading-day persistence. Net replication demand should be reconstructed product by product and reconciled with observed holdings rather than inferred from headline benchmarked assets.',
      ],
      bullets: [
        'Missing event-level package: the upload did not include the event master, return series, auction files, holdings, model outputs, or code.',
        'Selection and contamination: S&P additions are selected from strong candidates, and company news can overlap event windows.',
        'Anticipation is hard to date: Russell, Nasdaq, S&P, and MSCI information becomes tradable at different stages.',
        'Flow estimates remain ranges: public ETF assets omit many funds, derivatives, internal crosses, and early execution.',
        'Cost-of-capital identification is weak: short-run returns, liquidity, ownership, valuation, and financing outcomes are different variables.',
      ],
    },
  ],
  sources: [
    {
      label: 'S&P U.S. Indices Methodology',
      href: 'https://www.spglobal.com/spdji/en/documents/methodologies/methodology-sp-us-indices.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'S&P Dow Jones Indices governance policies',
      href: 'https://www.spglobal.com/spdji/en/documents/index-policies/sp-index-governance-policies.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Nasdaq-100 Index Methodology',
      href: 'https://indexes.nasdaq.com/docs/Methodology_NDX.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'MSCI Global Investable Market Indexes Methodology',
      href: 'https://www.msci.com/eqb/methodology/meth_docs/MSCI_GIMIMethodology_May2026.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'NYSE Opening and Closing Auctions Fact Sheet',
      href: 'https://www.nyse.com/publicdocs/nyse/markets/nyse/NYSE_Opening_and_Closing_Auctions_Fact_Sheet.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Nasdaq Closing Cross FAQ',
      href: 'https://www.nasdaqtrader.com/Trader.aspx?id=OpenClose',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Tesla set to join the S&P 500',
      href: 'https://press.spglobal.com/2020-11-16-Tesla-Set-to-Join-S-P-500',
      lastVerified: '2026.07.23',
    },
    {
      label: 'What Happened to the Index Effect?',
      href: 'https://www.spglobal.com/spdji/en/research/article/what-happened-to-the-index-effect-a-look-at-three-decades-of-sp-500-adds-and-drops/',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Revisiting Tesla’s Addition to the S&P 500',
      href: 'https://www.researchaffiliates.com/insights/publications/articles/832-revisiting-teslas-addition-to-the-sp500',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Lynch and Mendenhall: New Evidence on S&P 500 Changes',
      href: 'https://pages.stern.nyu.edu/~alynch/pdfs/jb97lm.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Kasch and Sarkar: Is There an S&P 500 Index Effect?',
      href: 'https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr484.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Wurgler: On the Economic Consequences of Index-Linked Investing',
      href: 'https://pages.stern.nyu.edu/~jwurgler/papers/indexing13.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Chang, Hong, and Liskovich: Russell Index Assignment',
      href: 'https://ideas.repec.org/a/oup/rfinst/v28y2015i1p212-246.html',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Ben-David, Franzoni, and Moussawi: Russell Assignment Note',
      href: 'https://afajof.org/wp-content/uploads/20191016-Note-for-JF.pdf',
      lastVerified: '2026.07.23',
    },
  ],
};
