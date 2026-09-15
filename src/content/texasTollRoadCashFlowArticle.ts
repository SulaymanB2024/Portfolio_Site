import type { ResearchArticle } from './articleModels';

export const TEXAS_TOLL_CASH_FLOW_ARTICLE_SLUG = 'why-texas-toll-roads-stay-tolled';
export const TEXAS_TOLL_CASH_FLOW_ARTICLE_PATH =
  `/research/financial-systems/${TEXAS_TOLL_CASH_FLOW_ARTICLE_SLUG}`;

export const TEXAS_TOLL_CASH_FLOW_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: TEXAS_TOLL_CASH_FLOW_ARTICLE_SLUG,
  number: '25',
  category: 'FINANCIAL SYSTEMS',
  title: 'Why Texas Toll Roads Stay Tolled After Construction',
  seoTitle: 'Why Texas Toll Roads Stay Tolled After Construction',
  subtitle:
    'A source-by-source financial and legal investigation of debt, reserve requirements, public transfers, concession rights, and what would actually have to happen for a Texas toll to disappear.',
  seoDescription:
    'Why do Texas toll roads stay tolled after construction? FY2025 records show pooled debt, reserves, public transfers, concession rights, and legal toll-removal paths.',
  artwork: {
    kind: 'study',
    variant: 'triptych',
    label: 'Texas toll-road finance / FY2025 records',
    note: 'Public-system accounts, concession filings, statutes, and contract records kept on their original reporting bases.',
  },
  date: '2026.09.15',
  lastVerified: '2026.09.02',
  readTime: '18 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'A toll does not disappear when the original construction bill has been recovered. The live claim on toll revenue can instead come from pooled system debt, reserve and coverage covenants, continuing capital needs, statutory authority, or a concession contract.',
  conclusion: {
    title: 'Ask what still has a claim on the revenue',
    content:
      'The useful question is not whether a road is old enough to be “paid off.” It is which entity can charge the toll today, what debt or contract claims the revenue, what reserves and capital obligations remain, and which public body has the legal authority to remove the toll. Those answers differ road by road.',
  },
  evidenceBoundary:
    'Evidence cutoff: September 2, 2026. This is a material-system comparison, not a statewide toll-revenue denominator. Fiscal years, accounting bases, and reporting entities remain separate unless the source provides a common basis. Four evidence items remain open: the final Harris County order and project list under Transportation Code §284.008(d), the current ultimate-equity chain for SH 130 Concession Company, a complete CTRMA audit-to-monthly bridge, and exact page-level FBGPTRA headline extraction. No open item is replaced with an estimate.',
  metrics: [
    { label: 'HCTRA FY2025 toll revenue', value: '$1.028B' },
    { label: 'HCTRA county mobility transfer', value: '$398.6M' },
    { label: 'NTTA long-term debt', value: '$8.519B' },
    { label: 'SH 288 termination payment', value: '$1.732B' },
  ],
  resources: [
    {
      label: 'Texas toll-system comparison',
      href: '/research/texas-toll-roads-stay-tolled-system-comparison.csv',
      description:
        'FY2025 public-system comparison preserving fiscal year, revenue basis, debt, coverage, pledge scope, and whether a normalized comparison is defensible.',
      format: 'CSV',
    },
    {
      label: 'Claim ledger',
      href: '/research/texas-toll-roads-stay-tolled-claim-ledger.csv',
      description:
        'Ten high- and medium-risk claims with evidence, calculation limits, publication wording, and unresolved actions.',
      format: 'CSV',
    },
    {
      label: 'Methodology',
      href: '/research/texas-toll-roads-stay-tolled-methodology.md',
      description:
        'Scope, five-test framework, accounting rules, normalized-comparison rule, and the open evidence register.',
      format: 'MD',
    },
  ],
  content: [
    '“The road is paid off” sounds like a complete argument because it treats a toll road like a household loan: build it, collect enough money to cover the cost, then stop charging. Texas toll finance does not work that cleanly. Construction cost, road-level debt, system debt, statutory tolling authority, and private concession rights are separate questions. A road can clear one test while another legal or financial claim on the revenue remains active.',
    'The FY2025 records show several different reasons tolls persist. NTTA pledges revenue across a pooled Trust with $8.519 billion of long-term debt. Harris County moved $398.6 million of toll-system cash into a county mobility program while still carrying $2.759 billion of bond principal. TxDOT’s Central Texas Turnpike System and Grand Parkway direct excess revenue into required reserve structures. Privately operated North Texas concessions can distribute cash to shareholders after debt and contract tests are met. SH 288 shows the distinction most clearly: Texas paid about $1.732 billion to terminate the private concession in 2024, took control, reduced rates, and kept the managed lanes tolled.',
    'The result is not that tolls can never end. Texas law contains paths for toll removal in some structures. The result is narrower: recovering historical construction cost does not itself cancel the current legal and financial architecture around the road.',
  ],
  sections: [
    {
      id: 'five-tests',
      title: '“Paid off” is five different tests',
      paragraphs: [
        'A construction-cost recovery calculation asks whether cumulative net cash collected from drivers has exceeded the original design and construction bill. Even that calculation depends on what counts as cost: right-of-way, capitalized interest, grants, financing fees, electronic collection, later widening, and rehabilitation can move the answer materially.',
        'Authorities generally do not maintain a legally controlling meter that applies each future toll receipt against one historical construction invoice. Refunding bonds can replace earlier debt without rebuilding the road. A facility can also have no obvious standalone bond while its revenue supports a larger system.',
      ],
      bullets: [
        'Initial project cost: has cumulative net cash recovered the historical build cost?',
        'Road-level debt: does the individual facility still have identifiable debt?',
        'System debt and pledges: can this road’s revenue support pooled obligations elsewhere?',
        'Legal tolling authority: does a public entity still have statutory authority to charge?',
        'Concession rights: does a private contract preserve toll-revenue rights through a stated term?',
      ],
    },
    {
      id: 'same-basis-comparison',
      title: 'The cleanest current comparison is CTTS versus Grand Parkway',
      paragraphs: [
        'There is no single statewide Texas toll-dollar ledger. NTTA closes its year on December 31. Harris County, TxDOT, CTRMA, and Fort Bend use different periods and structures. Some disclose accrual expenses without a complete current-year cash waterfall; others include investment and non-toll revenue in the pledged denominator.',
        'The normalized comparison therefore uses only the Central Texas Turnpike System and Grand Parkway. Both rows come from the same TxDOT FY2025 HB 803 report, use the same operating-revenue denominator, and follow the same category schedule.',
        'For CTTS, each $100 of FY2025 operating revenue supported $30.17 of operations, $19.29 of repairs and maintenance, $47.49 of debt service, and $3.05 of required reserve. Grand Parkway used $15.03, $4.82, $44.59, and $35.56 respectively. The reserve difference is large, but both rows reconcile to the same reporting framework.',
      ],
      table: {
        caption: 'FY2025 dollars per $100 of operating revenue; same TxDOT source and category schedule',
        columns: ['System', 'Operations', 'Maintenance', 'Debt service', 'Required reserve', 'Operating revenue'],
        rows: [
          ['Central Texas Turnpike System', '$30.17', '$19.29', '$47.49', '$3.05', '$337.64M'],
          ['Grand Parkway', '$15.03', '$4.82', '$44.59', '$35.56', '$393.32M'],
        ],
      },
    },
    {
      id: 'hctra-cash',
      title: 'Harris County shows why one toll-dollar waterfall can be misleading',
      paragraphs: [
        'HCTRA reported $1.0276 billion of FY2025 toll revenue and $542.7 million of accounting operating expense. The accounting expense includes $115.5 million of depreciation and amortization, which is not a current cash payment.',
        'The cash-flow statement instead reports $995.7 million received from customers, $404.8 million paid to employees and suppliers, $242.0 million of principal and interest, $315.3 million of capital purchases, and a $398.6 million transfer to Harris County’s thoroughfare and mobility program. Those selected uses exceed current toll revenue because beginning cash and investments, investment earnings, borrowing, and other sources also funded the year.',
        'The $398.6 million line is a public transfer recorded in audited statements, not a private dividend. The financial statement also does not prove that the same amount could have been returned immediately through lower tolls. Bond covenants, required reserves, capital plans, and public approvals still matter.',
      ],
      table: {
        caption: 'HCTRA FY2025 selected cash activity; these are not a closed allocation of one current toll dollar',
        columns: ['Measure', 'Amount'],
        rows: [
          ['Customer cash receipts', '$995.7M'],
          ['Cash payments to employees and suppliers', '$404.8M'],
          ['Principal and interest', '$242.0M'],
          ['Capital purchases', '$315.3M'],
          ['County thoroughfare and mobility transfer', '$398.6M'],
        ],
      },
    },
    {
      id: 'ntta-trust',
      title: 'NTTA revenue belongs to a pooled Trust, not one road',
      paragraphs: [
        'NTTA’s FY2025 audited report recorded $1.253 billion of net toll revenue, $1.105 billion of net revenue available for debt service, $675.7 million of audited debt service, 1.64 times coverage, and $8.519 billion of long-term debt. The debt schedule extends to 2052.',
        'The December 2025 monthly report also shows $1.3575 billion of gross Trust revenue, $252.7 million of net operating expense, and $666.9 million of preliminary cash debt service. Subtracting those last two figures leaves $437.9 million. That number is only an algebraic remainder in this comparison. The schedule does not label it unrestricted cash, profit, a reserve deposit, or a capital allocation.',
        'NTTA also received about $630.5 million of refunding-bond proceeds during FY2025. Refunding changes creditor claims, maturities, or interest cost; it does not mean a road was built twice or create an automatic toll-removal date.',
      ],
    },
    {
      id: 'private-concessions',
      title: 'Private concessions add a different claim on toll revenue',
      paragraphs: [
        'North Tarrant Express, LBJ Express, and NTE 35W are publicly owned corridors with long-term private concession rights. Their project companies finance and operate dynamically priced managed lanes, service project debt, and may distribute cash after satisfying financing and contract tests.',
        'Ferrovial’s 2026 Factbook reported $935 million of FY2025 revenue, $776 million of adjusted EBITDA, and $553 million of project-company distributions across the three Texas concessions at the 100% project-company level. The same filing reported $318 million as Ferrovial’s ownership-adjusted share of distributions. Those denominators are different and should not be collapsed into one number.',
        'The filing separately reported $46.7 million of FY2025 payments to TxDOT, including revenue-sharing and a refinancing-gain payment. The path is therefore not toll booth to dividend: debt service, distribution locks, maintenance standards, capital needs, and public-agency sharing sit between revenue and sponsor cash.',
      ],
      table: {
        caption: 'Three different concession cash measures in FY2025',
        columns: ['Measure', 'Amount', 'Boundary'],
        rows: [
          ['Project-company revenue', '$935M', '100% of NTE, LBJ, and NTE 35W project companies'],
          ['Project-company distributions', '$553M', '100% project-company distributions'],
          ['Ferrovial share of distributions', '$318M', 'Sponsor ownership-adjusted share'],
          ['Payments to TxDOT', '$46.7M', 'Revenue sharing and refinancing-gain payments'],
        ],
      },
    },
    {
      id: 'sh130-sh288',
      title: 'SH 130 and SH 288 separate debt, contract rights, and tolling authority',
      paragraphs: [
        'Texas owns SH 130 Segments 5 and 6 while SH 130 Concession Company holds long-term operating and toll-revenue rights under the Facility Concession Agreement. The original financing package was about $1.328 billion. The original project company filed for Chapter 11 protection in 2016 and emerged from restructuring in 2017. The capital structure changed; the road remained open and tolled. The concession term extends to 2062.',
        'SH 288 provides the reverse case. The 2016 agreement gave Blueridge Transportation Group a long-term package of financing, construction, operation, maintenance, and toll-revenue rights while TxDOT retained public title. In 2024, the Texas Transportation Commission used the termination-for-convenience mechanism. The stated payment was $1,731,730,721 less permitted adjustments, and control transitioned to the public structure on October 8, 2024.',
        'Texas later reduced rates and retained the tolled managed-lane model. The private concession ended, but public tolling authority did not. The transaction was a payment to end contractual rights and assume control of future revenue, not a finding that drivers still owed the original construction cost.',
      ],
    },
    {
      id: 'can-tolls-end',
      title: 'Texas law does contain routes to toll removal',
      paragraphs: [
        'Transportation Code §284.008 creates a default path for certain county toll projects. Subject to the statutory exception, a project becomes part of the state highway system and is maintained without tolls after project-revenue bonds and interest are paid, or sufficient money is placed in trust to pay them through maturity.',
        'Subsection (d) lets a county request a Texas Transportation Commission order preventing that automatic transition. A February 25, 2016 Commission agenda records a Harris County request under the provision. The agenda proves the request existed; the final order and complete project scope remain on the open evidence register, so this analysis does not assign the exception to a named road.',
        'Other structures use different provisions. §366.407 addresses surplus revenue for regional tollway authorities, §370.174 covers regional mobility authorities, and §228.006 addresses surplus revenue from TxDOT toll projects. Bond documents and contracts can add further constraints.',
      ],
      bullets: [
        'Relevant debt and interest must be paid or legally defeased.',
        'Any pooled-system pledge still claiming the revenue must be resolved.',
        'Reserve, operating, and lifecycle-capital obligations must be addressed.',
        'No concessionaire can retain a conflicting contractual toll right.',
        'The responsible public body must have authority to remove the toll and choose to exercise it.',
        'Another funding source must accept future operations and reconstruction costs.',
      ],
    },
    {
      id: 'method',
      title: 'Method and open evidence',
      paragraphs: [
        'The comparison uses the latest audited fiscal year available by September 2, 2026, supplemented by bond disclosures, monthly reports, statutes, commission actions, and concession documents. Figures are not combined across systems unless the fiscal year and accounting basis support the comparison.',
        'Operating revenue, operating expense, depreciation, interest expense, and change in net position remain separate from customer receipts, operating cash payments, principal, cash interest, capital purchases, reserve movements, public transfers, borrowing, and ending cash. Public transfers and private equity distributions are reported separately. Missing fields remain missing rather than becoming zero.',
        'The downloadable claim ledger preserves open work instead of smoothing it away. Current open items are the final Harris County §284.008(d) order and project list, current ultimate-equity chain for SH 130 Concession Company, complete CTRMA FY2025 audit-to-monthly category bridge, and exact page-level FBGPTRA headline extraction.',
      ],
    },
  ],
  sources: [
    {
      label: 'Texas Transportation Commission July 30, 2024 minutes and Minute Order 116738',
      href: 'https://www.txdot.gov/content/dam/docs/commission/2024/0730/minutes.pdf',
      lastVerified: '2026-09-02',
    },
    {
      label: 'TxDOT SH 288 Managed Lanes executed agreements',
      href: 'https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh288-toll-lanes/executed-agreements.html',
      lastVerified: '2026-09-02',
    },
    {
      label: 'Harris County FY2025 Annual Comprehensive Financial Report hub',
      href: 'https://auditor.harriscountytx.gov/Reports/Annual-Comprehensive-Financial-Report-Harris-County',
      lastVerified: '2026-09-02',
    },
    {
      label: 'Ferrovial 2026 Factbook filed with the SEC',
      href: 'https://www.sec.gov/Archives/edgar/data/1468522/000162828026032618/ferrovial-factbook2026_s.htm',
      lastVerified: '2026-09-02',
    },
    {
      label: 'TxDOT SH 130 Segments 5 and 6 project records',
      href: 'https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh130.html',
      lastVerified: '2026-09-02',
    },
    {
      label: 'TxDOT SH 130 executed agreements',
      href: 'https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh130/executed-agreements.html',
      lastVerified: '2026-09-02',
    },
    {
      label: 'U.S. DOT Build America Bureau SH 130 finance profile',
      href: 'https://www.transportation.gov/buildamerica/projects/sh-130-segments-5-and-6',
      lastVerified: '2026-09-02',
    },
    {
      label: 'North Texas Tollway Authority financial information',
      href: 'https://www.ntta.org/about-us/financial-information',
      lastVerified: '2026-09-02',
    },
    {
      label: 'TxDOT FY2025 HB 803 Annual Toll Report',
      href: 'https://www.txdot.gov/content/dam/docs/division/gov/hb-803-report-fy-2025.pdf',
      lastVerified: '2026-09-02',
    },
    {
      label: 'Central Texas Regional Mobility Authority investor information',
      href: 'https://www.mobilityauthority.com/business/finance/fin-inv-info/',
      lastVerified: '2026-09-02',
    },
    {
      label: 'Fort Bend County Toll Road Authority FY2025 report',
      href: 'https://transparencydocs.fortbendcountytx.gov/Traditional_Finances/2025/FY2025_FBCTRA.pdf',
      lastVerified: '2026-09-02',
    },
    {
      label: 'Fort Bend Grand Parkway Toll Road Authority FY2025 report',
      href: 'https://transparencydocs.fortbendcountytx.gov/Traditional_Finances/2025/FY2025_FBGPTRA.pdf',
      lastVerified: '2026-09-02',
    },
    {
      label: 'Texas Transportation Code Chapter 284',
      href: 'https://statutes.capitol.texas.gov/Docs/TN/htm/TN.284.htm',
      lastVerified: '2026-09-02',
    },
    {
      label: 'Texas Transportation Code Chapter 366',
      href: 'https://statutes.capitol.texas.gov/Docs/TN/htm/TN.366.htm',
      lastVerified: '2026-09-02',
    },
    {
      label: 'Texas Transportation Code Chapter 370',
      href: 'https://statutes.capitol.texas.gov/Docs/TN/htm/TN.370.htm',
      lastVerified: '2026-09-02',
    },
    {
      label: 'Texas Transportation Code Chapter 228',
      href: 'https://statutes.capitol.texas.gov/Docs/TN/htm/TN.228.htm',
      lastVerified: '2026-09-02',
    },
    {
      label: 'Texas Transportation Commission February 25, 2016 agenda',
      href: 'https://ftp.dot.state.tx.us/pub/txdot/commission/2016/0225/agenda.pdf',
      lastVerified: '2026-09-02',
    },
  ],
};
