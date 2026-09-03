import type { ResearchArticle } from './articleModels';

export const TEXAS_TOLL_MONEY_ARTICLE_SLUG = 'why-texas-toll-roads-stay-tolled';
export const TEXAS_TOLL_MONEY_ARTICLE_PATH =
  `/research/financial-systems/${TEXAS_TOLL_MONEY_ARTICLE_SLUG}`;

export const TEXAS_TOLL_MONEY_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: TEXAS_TOLL_MONEY_ARTICLE_SLUG,
  aliases: [],
  number: '22',
  category: 'PUBLIC FINANCE',
  title: 'Why Texas Toll Roads Stay Tolled',
  seoTitle: 'Why Texas Toll Roads Stay Tolled After Construction',
  subtitle: 'Where the Money Goes After Construction',
  seoDescription:
    'Audited records show where Texas toll revenue goes after construction: operations, debt service, reserves, capital work, public transfers, and private distributions.',
  artwork: {
    kind: 'study',
    variant: 'triptych',
    label: 'Texas toll-road cash, debt, and legal-rights map',
    note: 'System records retain their own fiscal years and accounting bases. Unavailable categories remain unavailable instead of being filled with estimates.',
  },
  date: '2026.09.02',
  dateModified: '2026.09.03',
  lastVerified: '2026.09.02',
  readTime: '20 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'A Texas toll does not end when one historical construction bill appears recovered; it ends only when the current debt pledges, reserve obligations, statutory tolling power, capital needs, and any concession rights permit it to end.',
  conclusion: {
    title: 'The toll survives the construction bill',
    content:
      'A road’s original construction cost is only one layer. Tolling can continue because system debt, reserve covenants, public transfer authority, future capital needs, or private concession rights remain. The useful test is the current legal and financial structure, not the age of the pavement.',
  },
  evidenceBoundary:
    'This is a material-system comparison, not a denominator for every Texas toll facility or every dollar of statewide toll revenue. Only CTTS and Grand Parkway are normalized together; other systems remain on their own fiscal years, revenue bases, and disclosure limits.',
  metrics: [
    { label: 'Public systems examined', value: '7' },
    { label: 'Same-basis $100 rows', value: '2' },
    { label: 'HCTRA mobility transfer', value: '$398.6M' },
    { label: 'Longest active terms', value: '2061–2062' },
  ],
  content: [
    'Build the road, collect tolls, repay the road, remove the toll. That is the model many drivers carry in their heads. It assumes one project, one construction bill, one loan, and a clean ending. The major Texas systems examined here pool roads, refinance debt, maintain reserves, fund later capital work, transfer legally available cash, or operate under contracts whose toll-revenue rights last for decades.',
    'SH 288 provides the cleanest break in that mental model. The original private-finance package put the managed-lane project at about $1.064 billion. In 2024, TxDOT agreed to pay $1,731,730,721, less permitted adjustments, to terminate the private concession. Control transitioned on October 8, 2024. The lanes remained tolled.',
    'Texas was not buying pavement it had never owned. The state already held public title to the corridor. It paid to end a contract that carried financing, operating, maintenance, and toll-revenue rights. The transaction changed the party entitled to the revenue and the financing structure. It did not erase the state’s legal power to keep charging tolls.',
    'That distinction explains most of the controversy. A road may have recovered its original build cost and still remain inside a debt-backed system. A system may be financially strong and still retain statutory tolling power. A private operator may hold contractual rights long after the initial construction invoice is history.',
  ],
  sections: [
    {
      id: 'five-questions',
      title: '“Paid off” is five different questions',
      paragraphs: [
        'The phrase “paid off” compresses five separate financial and legal tests into one. A facility can satisfy one test and remain tolled because another layer is still active.',
        'Historical cost recovery is an economic calculation. Debt status is a financing calculation. Tolling power is a legal question. A concession term is a contractual right. None can safely stand in for the others.',
      ],
      table: {
        caption: 'The five tests hidden inside a paid-off-road claim',
        columns: ['Question', 'What it tests', 'Why the toll may remain'],
        rows: [
          ['Has the initial project cost been recovered?', 'Cumulative historical economics', 'Cost recovery is usually not the legal trigger that removes a toll.'],
          ['Is the individual road debt-free?', 'Facility-level financing', 'Old bonds may have been refunded, or the road may sit inside a pooled system.'],
          ['Is the broader toll system debt-free?', 'System debt and revenue pledges', 'A mature road can support other facilities, reserves, rehabilitation, and system debt.'],
          ['Does the public entity retain tolling authority?', 'Statutory and board power', 'Authority can survive retirement of one project obligation.'],
          ['Does a private concessionaire retain revenue rights?', 'Contract term and termination rights', 'A concession normally ends by date or contractual remedy, not cost recovery.'],
        ],
      },
      figures: [
        {
          src: '/images/research/texas-toll-five-questions.svg',
          alt: 'Diagram separating initial project cost, road-level debt, system debt, legal tolling authority, and private concession revenue rights.',
          label: 'Five separate tests',
          caption: 'A road can satisfy one question and remain tolled because another financial or legal layer is still active.',
          width: 1200,
          height: 800,
        },
      ],
    },
    {
      id: 'same-basis-comparison',
      title: 'The only clean $100 comparison in the current records',
      paragraphs: [
        'There is no single statewide Texas toll-dollar ledger. NTTA closes its year on December 31. Harris County, TxDOT, CTRMA, and Fort Bend use different fiscal years and reporting structures. Some systems disclose accrual expenses but not a complete current-year cash waterfall. Others combine toll revenue with investment income or other pledged revenue.',
        'The publication-safe normalized chart therefore uses only the Central Texas Turnpike System and the Grand Parkway System. Both rows appear in the same TxDOT FY2025 report and use the same fiscal year, operating-revenue denominator, and category schedule.',
        'For every $100 of CTTS FY2025 operating revenue, $30.17 supported operating expense, $19.29 supported repair and maintenance expense, $47.49 supported debt service, and $3.05 remained in the required reserve calculation. For Grand Parkway, the comparable amounts were $15.03, $4.82, $44.59, and $35.56.',
        'The narrow scope is the point. Placing NTTA, HCTRA, CTRMA, or Fort Bend beside those bars would create the appearance of precision while mixing revenue bases, cash and accrual categories, and different pledge structures.',
      ],
      table: {
        caption: 'Recurring obligations per $100 of each system’s own FY2025 operating revenue',
        columns: ['System', 'Operations', 'Repair and maintenance', 'Debt service', 'Required reserve', 'Total'],
        rows: [
          ['CTTS', '$30.17', '$19.29', '$47.49', '$3.05', '$100.00'],
          ['Grand Parkway', '$15.03', '$4.82', '$44.59', '$35.56', '$100.00'],
        ],
      },
      figures: [
        {
          src: '/images/research/texas-toll-fy2025-txdot-comparison.svg',
          alt: 'Stacked horizontal bars comparing operations, maintenance, debt service, and required reserve per one hundred dollars of FY2025 operating revenue for CTTS and Grand Parkway.',
          label: 'Same source, year, denominator, and schedule',
          caption: 'This is a comparison of two TxDOT debt-financed systems, not an allocation of every Texas toll dollar.',
          width: 1200,
          height: 675,
        },
      ],
    },
    {
      id: 'system-comparison',
      title: 'Major public systems do not use one financial model',
      paragraphs: [
        'The system comparison keeps each reporting period and revenue basis visible. The unavailable entries are not zeros. They mark systems where the latest public records do not support the same cash classification without assumptions.',
        'Outstanding system debt also cannot be relabeled as the construction cost of one road. It may include later projects, refundings, reconstruction, connectors, and other pooled obligations.',
      ],
      table: {
        caption: 'Latest usable public-system figures, with accounting and cash boundaries preserved',
        columns: ['System', 'Fiscal year and revenue basis', 'Operations and maintenance', 'Debt and coverage', 'Why tolling persists'],
        rows: [
          ['NTTA', 'Year ended Dec. 31, 2025; $1.3575b gross Trust revenue and $1.253b audited net toll revenue', '$252.7m net operating expense in the December report', '$8.519b long-term debt; 1.64× coverage; maturities to 2052', 'Pooled Trust pledge, debt service, reserves, capital program, and board rate policy'],
          ['HCTRA', 'Year ended Sept. 30, 2025; $1.0276b toll revenue and $995.7m customer cash receipts', '$404.8m cash operating payments; $542.7m accounting expense including depreciation', '$2.759b bond principal; 1.25× covenant; maturities to 2054', 'County system debt, capital work, reserves, public policy, and mobility-program transfers'],
          ['CTRMA', 'Year ended June 30, 2025; $276.4m audited toll revenue', 'Exact comparable cash split unavailable', 'About $2.448b principal; 2.28× coverage', 'Project and system obligations under Chapter 370 and financing documents'],
          ['CTTS', 'Year ended Aug. 31, 2025; $337.64m operating revenue', '$101.87m operations; $65.14m repair and maintenance', '$160.34m debt service; maturities to 2042', 'Project pledge and required reserve structure'],
          ['Grand Parkway', 'Year ended Aug. 31, 2025; $393.32m operating revenue', '$59.11m operations; $18.97m maintenance', '$175.38m debt service; maturities to 2053', 'Project pledge, debt service, and reserve structure'],
          ['FBCTRA', 'FY2025; $68.54m toll revenue', '$43.0m total accounting expense is not a cash O&M number', '$526.91m bond principal', 'Separate county authority and bond structure'],
          ['FBGPTRA', 'Separate FY2025 audited report', 'Not normalized in this article', 'Separately financed', 'Must not be collapsed into FBCTRA or countywide figures'],
        ],
      },
    },
    {
      id: 'ntta-pooled-trust',
      title: 'NTTA: the toll belongs to a pooled Trust',
      paragraphs: [
        'NTTA’s FY2025 audited report recorded $1.253 billion of net toll revenue, $1.105 billion of net revenue available for debt service, $675.7 million of audited debt service, 1.64 times coverage, and $8.519 billion of long-term debt. The debt schedule extends to 2052.',
        'Those balances do not describe one road. NTTA’s Trust Agreement pools revenue and defines the order in which pledged cash supports operations, debt payments, coverage tests, reserves, subordinate obligations, and later authorized uses.',
        'The December 2025 monthly report provides a separate preliminary view: $1.3575 billion of gross Trust revenue, $252.7 million of net operating expense, and $666.9 million of preliminary cash debt service. The arithmetic remainder is $437.9 million.',
        'That $437.9 million is an algebraic remainder in this comparison. The source schedule does not identify it as a current-year deposit to one named reserve or capital fund. It is not shareholder profit, unrestricted cash, or proof that the amount could be distributed. Any later use remains governed by the Trust, reserve rules, capital plans, and future obligations.',
        'NTTA also received about $630.5 million of refunding-bond proceeds during FY2025. Refunding changes financing terms and creditor claims. It does not mean a road was constructed twice, and it does not create a toll-removal date.',
      ],
      bullets: [
        'Gross Trust revenue, audited net toll revenue, and customer cash collections are different denominators.',
        'Preliminary monthly debt service is kept separate from audited annual debt service.',
        'System debt cannot be assigned to one mature road without a road-specific record.',
      ],
    },
    {
      id: 'hctra-multi-source-cash',
      title: 'Harris County: toll cash can become mobility funding',
      paragraphs: [
        'HCTRA’s FY2025 statements expose the difference between an income statement and a cash-flow statement. The accounting view starts with $1.0276 billion of toll revenue and $542.7 million of operating expense. That expense includes $115.5 million of depreciation and amortization. No one received a $115.5 million depreciation check in FY2025.',
        'The cash view records $995.7 million received from customers, $404.8 million paid to employees and suppliers, $242.0 million of bond principal and interest, $315.3 million of capital purchases, and a $398.6 million transfer to Harris County’s thoroughfare and mobility program.',
        'The four selected cash uses total $1.3607 billion, or $132.42 for every $100 of reported toll revenue. That ratio does not mean HCTRA spent the same toll dollar more than once. It means beginning cash and investments, investment earnings, borrowing, and other sources also funded the year.',
        'The $398.6 million mobility transfer is a public transfer recorded in the county’s audited statements. It is not a dividend to private owners. The audited line also does not prove that the same amount could have reduced tolls immediately; outstanding debt, coverage covenants, reserves, capital plans, and public approvals remain relevant.',
        'At September 30, 2025, HCTRA reported $2.759 billion of bond principal, maturities through 2054, and a 1.25-times revenue-bond covenant. The full cash-flow statement and governing documents are the right evidence for judging the transfer and capital program.',
      ],
      figures: [
        {
          src: '/images/research/texas-toll-hctra-cash-claims.svg',
          alt: 'Bar chart showing HCTRA FY2025 customer cash receipts, operating payments, principal and interest, capital purchases, and county mobility transfer, with reported toll revenue as a separate reference line.',
          label: 'Cash activity funded by more than current toll revenue',
          caption: 'The selected uses exceed reported toll revenue because the authority also drew on other cash sources. The chart is not a closed toll-dollar waterfall.',
          width: 1200,
          height: 675,
        },
      ],
    },
    {
      id: 'txdot-reserves',
      title: 'TxDOT’s debt-financed systems: excess enters the reserve structure',
      paragraphs: [
        'TxDOT’s FY2025 annual toll report states that excess revenue for its debt-financed systems was deposited into project reserve accounts required by the bond documents. Under that schedule, TxDOT reported no surplus from CTTS or Grand Parkway available for an unrelated transfer.',
        'That result explains why money left after operating expense and debt service does not automatically make a road free. Reserve and coverage requirements are part of the bargain under which investors lent against future tolls. A reserve can be economically useful cash while remaining legally committed credit support.',
        'The roads also continue to need capital after opening. TxDOT’s FY2026–FY2030 planning materials listed substantial work for CTTS and Grand Parkway, including rehabilitation, widening, interchanges, technology, and safety projects. Opening day is not the end of a road’s capital life.',
      ],
    },
    {
      id: 'ctrma-and-fort-bend',
      title: 'CTRMA and Fort Bend stay outside a manufactured comparison',
      paragraphs: [
        'CTRMA’s FY2025 audit reported $276.4 million of toll revenue, about $2.448 billion of debt principal, and 2.28-times debt-service coverage. Its June 2025 operating statements provide more detail on operations, interest, and principal. Their category presentation does not bridge cleanly to the audit without assumptions, so CTRMA remains outside the normalized chart.',
        'Fort Bend County has two separate toll authorities. FBCTRA reported $68.54 million of FY2025 toll revenue and $526.91 million of bond principal. Its $43.0 million of total expense includes noncash and financing-related items, so it is not used as cash O&M.',
        'FBGPTRA publishes a separate FY2025 report and has a separate financing structure. Combining the authorities or substituting countywide figures would make the analysis less accurate, not more complete.',
      ],
    },
    {
      id: 'private-concessions',
      title: 'Private concessions: project cash can reach shareholders',
      paragraphs: [
        'North Tarrant Express, LBJ Express, and NTE 35W are publicly owned corridors with long-term private concession rights. Their project companies finance and operate dynamically priced managed lanes, service project debt, maintain the facilities, and may distribute cash after satisfying contractual and financing tests.',
        'Ferrovial’s 2026 Factbook reported, at the 100-percent project-company level for the three Texas concessions, $935 million of FY2025 revenue, $776 million of adjusted EBITDA, and $553 million of project-company distributions. The same source reported $318 million as Ferrovial’s ownership-adjusted share of distributions from the Texas managed-lane companies.',
        'Those are different denominators. The first set covers 100 percent of the project companies. The second is Ferrovial’s share. Neither should be confused with payments to TxDOT.',
        'The Factbook separately reports $46.7 million of FY2025 payments to TxDOT across the projects. The cash path is not toll booth to dividend: debt service, distribution lockups, maintenance standards, capital needs, and public-agency sharing come first. The records nevertheless establish that traffic-risk concessions can generate private investor distributions.',
      ],
      table: {
        caption: 'Disclosed FY2025 payments to TxDOT from the three Ferrovial-led Texas projects',
        columns: ['Project', 'Payment', 'Type'],
        rows: [
          ['NTE 35W', '$26.4m', 'Revenue sharing'],
          ['NTE', '$8.1m', 'Revenue sharing'],
          ['NTE 35W', '$6.6m', 'Refinancing-gain payment'],
          ['LBJ Wishbone', '$5.6m', 'Revenue sharing'],
          ['Total', '$46.7m', 'Separate from project-company and sponsor distributions'],
        ],
      },
    },
    {
      id: 'sh-130-restructuring',
      title: 'SH 130: bankruptcy changed the capital, not the toll right',
      paragraphs: [
        'Texas owns SH 130 Segments 5 and 6. SH 130 Concession Company holds the long-term operating and toll-revenue rights under the Facility Concession Agreement. The original finance package totaled about $1.328 billion, including senior bank debt, a federal TIFIA loan, and private equity. The concession term extends to 2062.',
        'The original project company filed for Chapter 11 protection in 2016 and emerged from restructuring in 2017. Debt and ownership economics changed. The road remained open and tolled.',
        'A bankruptcy can write down or reorganize debt without terminating the concession. A new capital structure can replace the old one while the toll right survives.',
        'Current public records identify the responsible concession entity and contract. They do not provide a clean ultimate-equity chain comparable to Ferrovial’s public filing. This article leaves that layer unresolved rather than carrying forward pre-bankruptcy owner names.',
      ],
    },
    {
      id: 'sh-288-termination',
      title: 'SH 288: the concession ended and the toll did not',
      paragraphs: [
        'The 2016 comprehensive development agreement gave Blueridge Transportation Group a long-term package of financing, construction, operation, maintenance, and toll-revenue rights. TxDOT retained public title to the corridor.',
        'In 2024, the Texas Transportation Commission used the agreement’s termination-for-convenience mechanism. The stated payment was $1,731,730,721, less permitted adjustments. Control transitioned to the public structure on October 8, 2024.',
        'The state continued tolling and later reduced rates. The private concession ended; the legal tolling authority did not. SH 288 shows that ownership, financing, operating control, and the right to collect revenue can change independently.',
      ],
    },
    {
      id: 'can-tolls-end',
      title: 'Can a Texas toll road become free?',
      paragraphs: [
        'Yes. The word never does not survive the statute book. Transportation Code §284.008 creates a default path for certain county toll projects. Subject to the statute’s exception, the project becomes part of the state highway system and is maintained without tolls after project-revenue bonds and interest are paid, or sufficient money is placed in trust to pay them through maturity.',
        'Subsection (d) allows a county to request a Texas Transportation Commission order preventing that automatic transition. A February 25, 2016 Commission agenda records a Harris County request under the provision. The agenda establishes that a request existed; it does not, by itself, prove the final order’s scope or identify every affected facility.',
        'Other structures use different statutes. Section 366.037, with surplus defined in §366.003(9-a), addresses regional tollway authorities. Section 370.174 addresses regional mobility authorities. Section 228.006 addresses TxDOT toll-project surplus. Bond resolutions, trust agreements, and project contracts still control the order of payments and permissible uses.',
        'A campaign promise, press release, or historical statement about toll removal is not a covenant. The enforceable evidence is the statute, bond resolution, trust agreement, rate covenant, concession agreement, and board or commission action.',
      ],
      table: {
        caption: 'Who can change a toll depends on the structure',
        columns: ['Structure', 'Current legal reference', 'Primary decision-maker'],
        rows: [
          ['County toll project', 'Transportation Code §284.008(c)-(d)', 'County commissioners court and Texas Transportation Commission'],
          ['Regional tollway authority', '§366.037 and §366.003(9-a)', 'Authority board, constrained by trust and bond documents'],
          ['Regional mobility authority', '§370.174', 'RMA board'],
          ['TxDOT toll project', '§228.006', 'Texas Transportation Commission'],
          ['Traffic-risk concession', 'Facility-specific agreement', 'Project company within contractual limits and public controls'],
        ],
      },
      bullets: [
        'Relevant debt and interest must be paid or legally defeased.',
        'No pooled-system pledge may continue to claim the revenue.',
        'Reserve, operating, and lifecycle-capital obligations must be addressed.',
        'No concessionaire may retain a contractual toll right.',
        'The responsible public body must have power to remove the toll and choose to exercise it.',
        'Another funding source must accept future operations and reconstruction.',
      ],
    },
    {
      id: 'method-and-limits',
      title: 'Method, limits, and correction route',
      paragraphs: [
        'The analysis uses the latest audited fiscal year available by September 2, 2026, supplemented by bond disclosures, monthly reports, statutes, commission actions, and concession documents. Every figure retains its fiscal year or transaction date.',
        'The workbook keeps accounting and cash views separate. Depreciation is not cash. Principal is not an income-statement expense. Net position is not a bank balance. Current capital purchases may be funded by current toll receipts, prior reserves, grants, or new debt.',
        'Four items remain disclosed rather than being filled with assumptions: the final Harris County §284.008(d) order and project list; the current ultimate-equity chain for SH 130 Concession Company; a complete CTRMA audit-to-monthly bridge; and exact page-level FBGPTRA headline extraction before additional figures are published.',
        'Corrections should preserve each prior model version and record the date, affected claim, old value, new value, source, and whether the article’s conclusion changed.',
      ],
    },
    {
      id: 'frequently-asked-questions',
      title: 'Direct answers',
      paragraphs: [
        'Are Texas toll roads ever paid off? A project’s original financing can be retired, refunded, restructured, or defeated while tolling continues under a pooled system, statute, capital plan, or concession contract.',
        'Can toll revenue fund other projects? In some structures, yes, after required payments and subject to statutes, trust agreements, bond covenants, and public approvals. The authority differs by entity.',
        'Do private concessionaires make distributions? The Ferrovial-led NTE, LBJ, and NTE 35W project companies reported distributions for FY2025, but project-company distributions, Ferrovial’s share, and payments to TxDOT are separate measures.',
        'Who can remove a toll? The answer may be an authority board, county commissioners court, the Texas Transportation Commission, or a contract mechanism. The responsible body depends on the road’s current legal structure.',
      ],
    },
  ],
  resources: [
    {
      label: 'Texas toll-road financial model',
      href: '/research/texas-toll-road-finance-2025.xlsx',
      description: 'Formula-driven workbook with system comparison, normalized TxDOT rows, HCTRA cash activity, concessions, legal authority, sources, claims, and update controls.',
      format: 'XLSX',
    },
    {
      label: 'System comparison',
      href: '/research/texas-toll-road-finance-system-comparison.csv',
      description: 'Fiscal year, revenue basis, operations, debt, pledge scope, comparability status, and source links for seven public systems.',
      format: 'CSV',
    },
    {
      label: 'Same-basis $100 comparison',
      href: '/research/texas-toll-road-finance-100-comparison.csv',
      description: 'Reproducible CTTS and Grand Parkway FY2025 category calculations using one TxDOT source and denominator.',
      format: 'CSV',
    },
    {
      label: 'Concession and transaction table',
      href: '/research/texas-toll-road-finance-concessions.csv',
      description: 'Public title, concession entity, term, payment type, and current ownership boundary for material private or restructured cases.',
      format: 'CSV',
    },
    {
      label: 'Primary source ledger',
      href: '/research/texas-toll-road-finance-source-ledger.csv',
      description: 'Claim-level official and audited source map with reporting date, reliability, and classification notes.',
      format: 'CSV',
    },
    {
      label: 'Claim register',
      href: '/research/texas-toll-road-finance-claim-register.csv',
      description: 'Ten publication claims with risk, source IDs, status, and the wording constraint each claim must preserve.',
      format: 'CSV',
    },
    {
      label: 'Methodology and limits',
      href: '/research/texas-toll-road-finance-methodology.md',
      description: 'Scope, fiscal-year rules, accounting-to-cash treatment, formulas, legal classification, and unresolved evidence items.',
      format: 'MD',
    },
    {
      label: 'Machine-readable summary',
      href: '/research/texas-toll-road-finance-summary.json',
      description: 'Canonical route, direct answer, normalized-comparison boundary, and open evidence items.',
      format: 'JSON',
    },
  ],
  sources: [
    {
      label: 'Texas Transportation Commission — July 30, 2024 minutes and SH 288 Minute Order 116738',
      href: 'https://www.txdot.gov/content/dam/docs/commission/2024/0730/minutes.pdf',
      lastVerified: '2026.09.02',
    },
    {
      label: 'TxDOT — SH 288 Managed Lanes executed agreements',
      href: 'https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh288-toll-lanes/executed-agreements.html',
      lastVerified: '2026.09.02',
    },
    {
      label: 'Harris County — FY2025 Annual Comprehensive Financial Report',
      href: 'https://auditor.harriscountytx.gov/portals/auditor/documents/ACFRs/HC%20Final%209-30-25.pdf',
      lastVerified: '2026.09.02',
    },
    {
      label: 'Ferrovial SE — 2026 Factbook filed with the SEC',
      href: 'https://www.sec.gov/Archives/edgar/data/1468522/000162828026032618/ferrovial-factbook2026_s.htm',
      lastVerified: '2026.09.02',
    },
    {
      label: 'North Texas Tollway Authority — financial information and FY2025 records',
      href: 'https://www.ntta.org/about-us/financial-information',
      lastVerified: '2026.09.02',
    },
    {
      label: 'TxDOT — HB 803 Annual Toll Report, FY2025',
      href: 'https://www.txdot.gov/content/dam/docs/division/gov/hb-803-report-fy-2025.pdf',
      lastVerified: '2026.09.02',
    },
    {
      label: 'Central Texas Regional Mobility Authority — FY2025 financial and investor records',
      href: 'https://www.mobilityauthority.com/business/finance/fin-inv-info/',
      lastVerified: '2026.09.02',
    },
    {
      label: 'Fort Bend County Toll Road Authority — FY2025 financial report',
      href: 'https://transparencydocs.fortbendcountytx.gov/Traditional_Finances/2025/FY2025_FBCTRA.pdf',
      lastVerified: '2026.09.02',
    },
    {
      label: 'Fort Bend Grand Parkway Toll Road Authority — FY2025 financial report',
      href: 'https://transparencydocs.fortbendcountytx.gov/Traditional_Finances/2025/FY2025_FBGPTRA.pdf',
      lastVerified: '2026.09.02',
    },
    {
      label: 'TxDOT — SH 130 Segments 5 and 6 executed agreements',
      href: 'https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh130/executed-agreements.html',
      lastVerified: '2026.09.02',
    },
    {
      label: 'U.S. Department of Transportation — SH 130 Segments 5 and 6 project finance profile',
      href: 'https://www.transportation.gov/buildamerica/projects/sh-130-segments-5-and-6',
      lastVerified: '2026.09.02',
    },
    {
      label: 'Texas Transportation Code — Chapter 284',
      href: 'https://tcss.legis.texas.gov/resources/TN/htm/TN.284.htm',
      lastVerified: '2026.09.02',
    },
    {
      label: 'Texas Transportation Code — Chapter 366',
      href: 'https://tcss.legis.texas.gov/resources/TN/htm/TN.366.htm',
      lastVerified: '2026.09.02',
    },
    {
      label: 'Texas Transportation Code — Chapter 370',
      href: 'https://tcss.legis.texas.gov/resources/TN/htm/TN.370.htm',
      lastVerified: '2026.09.02',
    },
    {
      label: 'Texas Transportation Code — Chapter 228',
      href: 'https://tcss.legis.texas.gov/resources/TN/htm/TN.228.htm',
      lastVerified: '2026.09.02',
    },
    {
      label: 'Who Owns Texas Toll Roads? — entity and control map',
      href: '/markets/who-owns-texas-toll-roads',
      lastVerified: '2026.09.02',
    },
  ],
  indexable: true,
};
