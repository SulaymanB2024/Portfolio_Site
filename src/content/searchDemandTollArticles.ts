import type { ResearchArticle } from './articleModels';

const DATE = '2026.09.23';
const TEXAS_DATASET = '/research/texas-toll-road-ownership-2026.csv';
const TEXAS_OVERVIEW = '/markets/who-owns-texas-toll-roads';
const TOLL_CASH_FLOW = '/research/financial-systems/why-texas-toll-roads-stay-tolled';

const nttaSource = {
  label: 'NTTA — September 2026 committee notice and authority description',
  href: 'https://www.ntta.org/september-committee-meetings-0',
  lastVerified: DATE,
};
const nttaFinance = {
  label: 'NTTA — financial information and debt-obligation transparency',
  href: 'https://www.ntta.org/about-us/financial-information',
  lastVerified: DATE,
};
const hctraSource = {
  label: 'HCTRA — FY2025 Toll Road Authority Enterprise Fund financial statements',
  href: 'https://www.hctra.org/-/media/2ba0076447b44da0948e12147ce7a26b.ashx',
  lastVerified: DATE,
};
const txdotTollReport = {
  label: 'TxDOT — HB 803 Report on Toll Projects, FY2025',
  href: 'https://www.txdot.gov/content/dam/docs/division/gov/hb-803-report-fy-2025.pdf',
  lastVerified: DATE,
};
const nteAgreement = {
  label: 'TxDOT — NTE 35W Amended and Restated Facility Agreement',
  href: 'https://www.txdot.gov/content/dam/docs/business/alt-delivery/north-tarrant-express/nte-seg-3-amend-fac-agree.pdf',
  lastVerified: DATE,
};
const fhwaP3 = {
  label: 'FHWA — DBFOM toll-concession project profiles',
  href: 'https://www.fhwa.dot.gov/ipd/p3/defined/new_build_facilities/dbfom_toll_concessions.aspx',
  lastVerified: DATE,
};
const fhwaTollInventory = {
  label: 'FHWA — Toll Facilities in the United States',
  href: 'https://www.fhwa.dot.gov/policyinformation/tollpage/page08.cfm',
  lastVerified: DATE,
};
const fhwaP3Agreements = {
  label: 'FHWA — public-private partnership agreement library',
  href: 'https://www.fhwa.dot.gov/ipd/p3/p3_projects/agreements.aspx',
  lastVerified: DATE,
};
const ferrovialFactBook = {
  label: 'Ferrovial — 2026 Fact Book, concession ownership and project economics',
  href: 'https://www.sec.gov/Archives/edgar/data/1468522/000162828026032618/ferrovial-factbook2026_s.htm',
  lastVerified: DATE,
};
const buildAmericaSh130 = {
  label: 'U.S. DOT Build America — SH 130 Segments 5–6 financing and restructuring',
  href: 'https://www.transportation.gov/buildamerica/projects/sh-130-segments-5-and-6',
  lastVerified: DATE,
};

const commonResources = [
  {
    label: 'Texas toll-road ownership dataset',
    href: TEXAS_DATASET,
    description: 'Project-level public/private ownership, operator, toll-revenue claimant, concession term, billing agent, and evidence-date records.',
    format: 'CSV',
  },
  {
    label: 'Texas toll-road ownership investigation',
    href: TEXAS_OVERVIEW,
    description: 'The long-form ownership and capital-stack investigation behind this query-specific note.',
    format: 'WEB',
  },
];

export const TOLL_SEARCH_DEMAND_ARTICLES: ResearchArticle[] = [
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'who-owns-ntta',
    number: '31',
    category: 'TEXAS INFRASTRUCTURE',
    title: 'Who Owns NTTA? The North Texas Tollway Authority Is Public',
    seoTitle: 'Who Owns NTTA? Public Authority, Not a Private Company',
    subtitle: 'NTTA is a political subdivision of Texas created as a regional tollway authority—not a private toll-road company or a subsidiary of a foreign investor.',
    seoDescription: 'Who owns NTTA? NTTA is a public regional tollway authority made up of Dallas, Denton, Collin, and Tarrant counties. See what it owns and where toll money goes.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'NTTA / public authority / revenue bonds',
      note: 'The customer-facing toll system is public even though contractors, lenders, and concession companies can sit around parts of the network.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '7 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'NTTA is not owned by shareholders. It is a Texas political subdivision whose member counties appoint its public governance, while toll revenues support operations and revenue-backed debt.',
    conclusion: {
      title: 'NTTA has public governance, not private equity owners',
      content: 'The useful ownership answer is institutional: NTTA is a regional public authority. Bondholders have contractual claims on pledged revenues, vendors perform work, and separate private concessions may use NTTA for billing, but none of those relationships turns NTTA itself into a private company.',
    },
    evidenceBoundary: 'This page describes NTTA’s public legal and operating structure as verified September 23, 2026. It does not imply that every toll lane billed through an NTTA account is owned or operated by NTTA. Project-level ownership must be checked separately.',
    metrics: [
      { label: 'Member counties', value: '4' },
      { label: 'Legal form', value: 'TEXAS POLITICAL SUBDIVISION' },
      { label: 'Tax-supported NTTA debt', value: 'NONE' },
      { label: 'Evidence date', value: DATE },
    ],
    resources: commonResources,
    content: [
      'The North Texas Tollway Authority is public. NTTA describes itself as a political subdivision of the State of Texas authorized to acquire, build, maintain, repair, and operate turnpike projects. Its member counties are Dallas, Denton, Collin, and Tarrant; it also serves Ellis and Johnson counties. There is no stock ledger, private parent company, or foreign shareholder that “owns NTTA.”',
      'That answer is easy to blur because a driver can use one NTTA TollTag across facilities with different legal structures. NTTA can own and operate a road, provide toll-collection services for a TxDOT project, or collect on behalf of a privately operated concession. The billing relationship is not the ownership relationship.',
    ],
    sections: [
      {
        id: 'what-ntta-is',
        title: 'What NTTA legally is',
        paragraphs: [
          'NTTA is a regional tollway authority governed under Texas law. Its board is a public governing body rather than a corporate board elected by equity shareholders. Current NTTA notices identify Dallas, Denton, Collin, and Tarrant as the member counties and describe the authority as a political subdivision of Texas.',
          'NTTA’s core network includes the Dallas North Tollway, President George Bush Turnpike, Sam Rayburn Tollway, Chisholm Trail Parkway, 360 Tollway, and several bridges and tunnels. There are facility-specific nuances: for example, the Sam Rayburn Tollway is held through a state right-of-use arrangement rather than the simplest version of fee-title ownership.',
        ],
      },
      {
        id: 'who-controls-the-money',
        title: 'Who controls the toll money',
        paragraphs: [
          'NTTA says its toll projects receive no legislative appropriations and that tolls are collected to repay debt and operate and maintain the roadways. That makes the system financially self-supporting in a different sense from a private company. The authority issues revenue-supported obligations rather than equity shares.',
          'Bondholders therefore matter without becoming owners of NTTA. Debt documents can restrict how pledged revenue is used and require reserves or coverage tests. Those creditor rights are senior financial claims, not equity ownership of the authority or its roads.',
        ],
      },
      {
        id: 'why-tolltag-confuses-ownership',
        title: 'Why TollTag can make private roads look like NTTA roads',
        paragraphs: [
          'Electronic tolling separates the customer interface from the underlying asset. A TollTag can be accepted on a managed lane whose pavement belongs to TxDOT and whose operating and revenue rights sit with a concession company. NTTA’s collection role does not transfer road title or concession economics to NTTA.',
          'The practical test is to identify four separate fields: physical owner, statutory authority, operator, and toll-revenue claimant. The linked Texas ownership dataset keeps those fields apart for major systems and concessions.',
        ],
      },
      {
        id: 'direct-answer',
        title: 'The short answer to “is NTTA private?”',
        paragraphs: [
          'No. NTTA is a public regional tollway authority and Texas political subdivision. It can borrow in the municipal revenue-bond market and contract with private firms, but those relationships do not make it a private company.',
          'For a specific road, ask the question again at the project level. NTTA itself may be the owner/operator, or it may only be one service provider in a road whose title and cash-flow rights sit elsewhere.',
        ],
      },
    ],
    sources: [nttaSource, nttaFinance],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'texas-toll-roads-public-vs-private',
    number: '32',
    category: 'TEXAS INFRASTRUCTURE',
    title: 'Are Texas Toll Roads Privately Owned? A Road-by-Road Answer',
    seoTitle: 'Are Texas Toll Roads Privately Owned? Public vs Private Map',
    subtitle: 'Most major Texas toll systems are public. Four active major concessions give private companies finite operating and toll-revenue rights on state-owned corridors.',
    seoDescription: 'Are Texas toll roads privately owned? Most are public. See NTTA, HCTRA, TxDOT systems and four major private concessions, with ownership separated from operating rights.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Texas toll roads / public title / private concessions',
      note: 'A road can be publicly owned while a concession company holds a decades-long right to operate managed lanes and collect toll revenue.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '8 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: '“Private toll road” usually describes a concession right, not private title to Texas highway land; most material systems are public, while four active major concessions hold time-limited private operating and revenue rights.',
    conclusion: {
      title: 'Public versus private is not one field',
      content: 'Texas toll-road ownership is mostly public, but the cash-flow layer can be private. The right answer names the public titleholder, the operator, the revenue claimant, and the concession expiration rather than forcing each road into a single public/private label.',
    },
    evidenceBoundary: 'The comparison uses the material-system inventory and source package behind the July 23, 2026 Texas toll-road study, refreshed against public TxDOT and authority descriptions on September 23, 2026. It is not a census of every tolled lane or local connector in Texas.',
    metrics: [
      { label: 'Active major private concessions', value: '4' },
      { label: 'DFW concession end', value: '2061' },
      { label: 'SH 130 5–6 end', value: '2062' },
      { label: 'SH 288 status', value: 'PUBLIC SINCE 2024' },
    ],
    resources: commonResources,
    content: [
      'Most Texas toll roads are not privately owned. NTTA, HCTRA, regional mobility authorities, counties, and TxDOT own or control most of the major systems. The important exception is a small group of long-term public-private concessions where Texas keeps title to the corridor but a project company receives contractual rights to operate tolled managed lanes and keep defined toll revenue.',
      'The current material concession set is North Tarrant Express, LBJ Express, NTE 35W, and SH 130 Segments 5–6. SH 288 used to belong in that list, but Texas terminated and bought out the concession in October 2024, so treating it as currently privately operated would be stale.',
    ],
    sections: [
      {
        id: 'public-systems',
        title: 'The public side: NTTA, HCTRA, TxDOT, counties, and mobility authorities',
        paragraphs: [
          'NTTA is a Texas political subdivision. HCTRA is an enterprise function of Harris County. TxDOT’s Central Texas Turnpike System, Grand Parkway system, I-35E managed lanes, and SH 249 system sit in state public structures. Regional and county toll authorities fill out much of the remaining network.',
          'Public ownership does not mean toll-free. These systems use tolls to operate roads, fund maintenance and capital projects, build reserves, and service revenue-supported debt. The existence of long-lived debt is not evidence that a road was sold to bondholders.',
        ],
      },
      {
        id: 'private-concessions',
        title: 'The private side: four active major concessions',
        paragraphs: [
          'North Tarrant Express, LBJ Express, and NTE 35W are TxDOT corridors in Dallas–Fort Worth with long-term private concession rights that end in 2061. SH 130 Segments 5–6 is also state-owned, with a concession scheduled through 2062.',
          'The concession company can have private shareholders, project debt, operations obligations, rate-setting rules, revenue sharing, and a residual claim on cash. That is economically meaningful ownership of a contractual asset, but it is not the same as owning Texas highway land forever.',
        ],
      },
      {
        id: 'former-private',
        title: 'SH 288 shows why the date matters',
        paragraphs: [
          'SH 288’s managed lanes were built and operated under a concession whose original end date was 2068. Texas terminated the concession in 2024 and shifted the facility back into a public structure. A search result or article written before that transaction can therefore give a technically historical but currently wrong answer.',
          'The same distinction will matter again when other concessions expire, are refinanced, restructured, extended, or bought out. Toll-road ownership is a dated contract map, not a permanent label.',
        ],
      },
      {
        id: 'how-to-read',
        title: 'How to tell whether a specific Texas toll road is private',
        paragraphs: [
          'Check the facility owner first, then the operator, then the party entitled to toll revenue, and finally the concession term. A private operator may work under a service contract with no residual toll claim; a concessionaire can hold the revenue right for decades while the state keeps title.',
          'The companion dataset exposes those fields directly so “private” can be tested against a specific legal relationship rather than inferred from the toll price, logo, billing statement, or name of the operator.',
        ],
      },
    ],
    sources: [nttaSource, hctraSource, txdotTollReport, fhwaP3],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'who-owns-hctra-sam-houston-tollway',
    number: '33',
    category: 'TEXAS INFRASTRUCTURE',
    title: 'Who Owns HCTRA and the Sam Houston Tollway?',
    seoTitle: 'Who Owns HCTRA? Harris County Owns the Toll System',
    subtitle: 'HCTRA is a Harris County public toll-road enterprise. The Sam Houston Tollway is not a privately owned highway, even though contractors and bondholders participate in the system.',
    seoDescription: 'Who owns HCTRA and the Sam Houston Tollway? HCTRA is a Harris County public enterprise created under Texas law. Learn who governs it and where toll revenue goes.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'HCTRA / Harris County / toll enterprise',
      note: 'County ownership, enterprise accounting, operating contractors, and bondholder claims answer different parts of the ownership question.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '7 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'HCTRA is a public Harris County toll-road enterprise created by Commissioners Court, so the Sam Houston Tollway’s core ownership and governance are county-public rather than private.',
    conclusion: {
      title: 'HCTRA is part of Harris County’s public finance system',
      content: 'The Sam Houston Tollway is not owned by a private concessionaire. Harris County controls HCTRA; toll revenues support the enterprise, including operations, capital needs, and debt. Contractors and lenders can hold important contractual rights without becoming road owners.',
    },
    evidenceBoundary: 'This page addresses HCTRA’s institutional structure and the public ownership of its toll system. Individual interagency agreements, collection arrangements, service contracts, and bond pledges can allocate narrower rights without changing the core county ownership answer.',
    metrics: [
      { label: 'HCTRA established', value: '1983' },
      { label: 'Public owner', value: 'HARRIS COUNTY' },
      { label: 'Legal basis', value: 'TEXAS TRANSPORTATION CODE CH. 284' },
      { label: 'Accounting structure', value: 'ENTERPRISE FUND' },
    ],
    resources: commonResources,
    content: [
      'HCTRA is public. Harris County Commissioners Court established the Harris County Toll Road Authority in 1983 under Chapter 284 of the Texas Transportation Code. HCTRA operates as a Harris County enterprise fund, with toll revenue supporting the toll system rather than flowing to private shareholders.',
      'That structure covers the central ownership question for the Sam Houston Tollway. Private construction firms, technology vendors, road operators, and bond investors can have contracts or financial claims tied to the system, but they do not thereby own the county toll road.',
    ],
    sections: [
      {
        id: 'authority-structure',
        title: 'HCTRA is a Harris County authority, not a private company',
        paragraphs: [
          'Harris County created HCTRA after voters approved toll-road bond authority. The authority’s financial activity is reflected within the county’s public financial structure. Policy and major governance ultimately run through county institutions rather than an equity-holder vote.',
          'The enterprise-fund format matters because it makes the toll system look businesslike: users pay charges, the system records operating expenses, capital assets, liabilities, and debt service. Enterprise accounting does not turn the enterprise into a private corporation.',
        ],
      },
      {
        id: 'sam-houston',
        title: 'Who owns the Sam Houston Tollway',
        paragraphs: [
          'The Sam Houston Tollway belongs inside the HCTRA/Harris County public system. It is different from a TxDOT corridor under a long-term revenue concession such as NTE or LBJ Express.',
          'A driver may experience the roads similarly—electronic collection, variable trip cost, maintenance crews, debt-funded capital—but the legal cash-flow rights are different. HCTRA’s residual economics remain in a county public structure.',
        ],
      },
      {
        id: 'bondholders',
        title: 'Bondholders finance the system; they do not own the road',
        paragraphs: [
          'Revenue bonds can give creditors a pledge of toll revenues and contractual protections around reserves, coverage, and additional borrowing. Those protections can constrain management decisions, especially during financial stress.',
          'A lien on pledged revenue is not fee title to the roadway and is not common equity in HCTRA. The distinction is the same one that applies to a mortgage lender versus the owner of a house, though municipal revenue-bond documents have their own legal structure.',
        ],
      },
      {
        id: 'billing-vs-ownership',
        title: 'Billing and interoperability are separate from ownership',
        paragraphs: [
          'Texas toll agencies interoperate, so a tag issued by one authority can be used on another system. Collection technology is a payment rail. It should not be used to infer which government owns the road or which entity is entitled to the toll cash.',
          'For any Houston facility, the reliable method is still project-specific: identify the titleholder, governing authority, operator, billing agent, and revenue claimant independently.',
        ],
      },
    ],
    sources: [hctraSource],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'foreign-owned-texas-toll-roads',
    number: '34',
    category: 'TEXAS INFRASTRUCTURE',
    title: 'Are Texas Toll Roads Foreign-Owned? What Cintra and Ferrovial Actually Own',
    seoTitle: 'Are Texas Toll Roads Foreign-Owned? Cintra & Ferrovial Explained',
    subtitle: 'Foreign infrastructure investors own stakes in several Texas concession companies. Texas still owns the underlying state-highway corridors.',
    seoDescription: 'Are Texas toll roads foreign-owned? Separate state ownership of the road from foreign investor stakes in NTE, LBJ and NTE 35W concession companies.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Texas / concession company / foreign investor',
      note: 'The legally important line runs between public title to the road and equity ownership of the time-limited concession company.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '9 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Claims that foreign companies “own Texas toll roads” mix up two assets: Texas keeps title to the highway, while foreign infrastructure investors can own equity in private companies that hold toll and operating rights until a contract expires.',
    conclusion: {
      title: 'Foreign investors own concession equity, not Texas sovereignty',
      content: 'NTE, LBJ, and NTE 35W have foreign-linked infrastructure investors in their project companies, but the state retains title to the corridors. The investable asset is a finite bundle of toll, operating, and contractual rights—not perpetual ownership of Texas land.',
    },
    evidenceBoundary: 'Investor percentages can change through transfers, refinancings, or restructurings. This note uses the project ownership evidence in the site’s 2026 toll-road dataset and current public-source checks; it does not describe any investor as owning the State of Texas roadway itself.',
    metrics: [
      { label: 'DFW concessions reviewed', value: '3' },
      { label: 'Road title', value: 'STATE OF TEXAS' },
      { label: 'DFW concession end', value: '2061' },
      { label: 'Ownership object', value: 'PROJECT-COMPANY EQUITY' },
    ],
    resources: commonResources,
    content: [
      'Yes, foreign infrastructure investors hold equity interests in some Texas toll-road concession companies. No, that does not mean a foreign country or company owns the Texas highway itself. The distinction is easiest to see in Dallas–Fort Worth, where TxDOT keeps title to NTE, LBJ Express, and NTE 35W while private project companies hold long-dated operating and toll-revenue rights.',
      'Ferrovial’s Cintra business is a major shareholder in all three DFW concession companies, alongside infrastructure investors such as Meridiam and APG-managed capital. Those percentages describe ownership of the concession vehicles. TxDOT agreements expressly preserve public title to the facility and right-of-way.',
    ],
    sections: [
      {
        id: 'what-is-foreign-owned',
        title: 'What the foreign investor actually owns',
        paragraphs: [
          'The shareholder owns an interest in a project company. The project company owns contractual rights and obligations: it may operate managed lanes, collect defined toll revenue, maintain the facility, service project debt, share revenue with TxDOT, and hand the facility back under specified conditions.',
          'That equity can be sold, refinanced, pledged, or diluted subject to the concession and financing documents. The highway land is a different asset. TxDOT’s NTE agreement states that fee title remains with TxDOT even while the developer holds a leasehold estate and concession rights.',
        ],
      },
      {
        id: 'dfw-projects',
        title: 'The three DFW concessions',
        paragraphs: [
          'North Tarrant Express, LBJ Express, and NTE 35W all run to 2061 under the current concession schedule. Ferrovial/Cintra has disclosed controlling or majority stakes in the project companies, with Meridiam and APG interests making up the remaining equity in the published structures.',
          'These are financially significant private assets. The project companies receive toll cash, carry project debt, and can distribute residual cash to shareholders after operating costs, reserves, debt service, and public-sharing obligations. Calling them “nothing but contractors” would be as inaccurate as saying they own the Texas roadway outright.',
        ],
      },
      {
        id: 'sh130-history',
        title: 'SH 130 shows why old foreign-ownership claims go stale',
        paragraphs: [
          'Cintra and Zachry were the original equity sponsors of SH 130 Segments 5–6. After traffic materially underperformed forecasts, the project entered Chapter 11 in 2016 and the original equity was eliminated in the 2017 restructuring. Creditors, including Strategic Value Partners-related capital and the U.S. government through its TIFIA recovery, emerged with interests in the reorganized borrower.',
          'A claim that Spain or Cintra “owns SH 130” based on the original financing is therefore historically stale. Texas remained the titleholder before, during, and after the restructuring; what changed was equity ownership of the concession company.',
        ],
      },
      {
        id: 'language-test',
        title: 'A better wording test',
        paragraphs: [
          'Use “foreign-backed concession company” when the equity sits with foreign infrastructure investors. Use “publicly owned roadway under private concession” for the physical asset plus operating rights. Reserve “foreign-owned road” for a case where the actual road asset is privately owned by that investor, which is not what the cited Texas concession documents describe.',
          'This wording is less dramatic but much more useful for understanding who can raise capital, who receives cash, who bears traffic risk, and what disappears when the concession expires.',
        ],
      },
    ],
    sources: [nteAgreement, txdotTollReport, fhwaP3, ferrovialFactBook, buildAmericaSh130],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'texas-private-toll-rate-controls',
    number: '35',
    category: 'TEXAS INFRASTRUCTURE',
    title: 'Who Can Raise Texas Toll Rates? Public Boards, TxDOT, and Private Concessions',
    seoTitle: 'Who Sets Texas Toll Rates? Private Toll Rate Controls Explained',
    subtitle: 'Texas toll rates are not set by one statewide actor. Public systems use board or state policies; private concessions operate inside contract-defined pricing rules, sharing formulas, and enforcement rights.',
    seoDescription: 'Who can raise Texas toll rates? See how NTTA, HCTRA, TxDOT and private concession agreements control fixed and dynamically priced tolls.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Toll rate / contract formula / public oversight',
      note: 'A private concession can have pricing discretion without having unlimited pricing power.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '9 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Texas toll pricing power is facility-specific: public authorities set rates through public governance, while private concessions price within detailed contractual frameworks rather than a blank check to charge any amount.',
    conclusion: {
      title: 'There is no single Texas toll-rate switch',
      content: 'To know who can raise a toll, identify the facility and read its governing rate policy or concession. Public boards and TxDOT govern public systems; concessionaires can have substantial pricing discretion, especially on managed lanes, but that discretion sits inside enforceable contracts, performance standards, revenue-sharing provisions, and termination rights.',
    },
    evidenceBoundary: 'This is a structural explanation, not legal advice or a claim that one pricing formula applies across Texas. Exact escalation rules, dynamic-pricing algorithms, caps, discounts, HOV treatment, and revenue-sharing terms differ by project and can be amended.',
    metrics: [
      { label: 'Statewide universal toll cap', value: 'NONE' },
      { label: 'Private CDA term limit', value: 'PROJECT-SPECIFIC' },
      { label: 'NTE titleholder', value: 'TXDOT' },
      { label: 'Pricing evidence', value: 'CONTRACT + PUBLIC RATE POLICY' },
    ],
    resources: commonResources,
    content: [
      'No single company or state office sets every Texas toll rate. Public authorities such as NTTA and HCTRA adopt rates through their own public governance. TxDOT sets or administers rates on state toll systems. Private concessionaires on NTE, LBJ, NTE 35W, and SH 130 5–6 operate under project agreements that define the pricing regime and the public counterparty’s enforcement rights.',
      'That is why “Can a private toll operator charge anything it wants?” has the wrong frame. A concession grants real pricing authority, sometimes including dynamic rates that respond to traffic. It also binds the developer to a contract that covers the term, operations, performance, revenue sharing, defaults, remedies, and handback.',
    ],
    sections: [
      {
        id: 'public-rates',
        title: 'Public toll systems use public rate policies',
        paragraphs: [
          'NTTA, HCTRA, TxDOT, and regional mobility authorities are different issuers with different boards, statutes, debt covenants, and rate-setting processes. A rate increase can be tied to inflation, debt capacity, capital plans, operating costs, or a board-approved schedule.',
          'Revenue-bond covenants can create a financial floor underneath those policy choices by requiring the issuer to maintain adequate revenue for operations and debt service. That does not usually dictate a specific per-mile rate, but it can make “never raise tolls” incompatible with the financing structure.',
        ],
      },
      {
        id: 'concession-rates',
        title: 'Private concession rates are contract rights',
        paragraphs: [
          'A toll concession is negotiated around a defined pricing mechanism. On managed lanes, the commercial purpose often requires dynamic pricing to keep the lane moving at a target service level. The project agreement allocates how that authority is used and what public approvals, standards, or formulas apply.',
          'Because the concession company carries traffic risk and project debt, pricing is central to its economics. But TxDOT still retains contractual remedies for noncompliance and public powers that a shareholder does not acquire merely by owning the project company.',
        ],
      },
      {
        id: 'economic-controls',
        title: 'Revenue sharing and competition can matter as much as a formal cap',
        paragraphs: [
          'Toll control is not only a maximum posted price. Revenue-sharing formulas can move part of upside back to the state. Required general-purpose capacity, HOV rules, performance targets, competing free lanes, and the possibility that users avoid the facility constrain the operator’s economic freedom.',
          'A theoretically higher toll can reduce transactions enough to lower total revenue. Dynamic-pricing systems therefore balance price against lane speed and demand rather than functioning as a simple monopoly tariff.',
        ],
      },
      {
        id: 'how-to-check',
        title: 'How to check the rule for one road',
        paragraphs: [
          'Start with the facility’s current toll-rate page or board action. If it is a concession, open the executed comprehensive development or facility agreement and its amendments. Search the agreement for toll rates, managed lanes, revenue payment, HOV, escalation, default, and termination.',
          'Then separate the posted rate from the legal ceiling and the commercial algorithm. Those are related but not always identical concepts.',
        ],
      },
    ],
    sources: [nttaFinance, nteAgreement, txdotTollReport, fhwaTollInventory],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'who-owns-us-toll-roads',
    number: '36',
    category: 'U.S. INFRASTRUCTURE',
    title: 'Who Owns Toll Roads in the United States?',
    seoTitle: 'Who Owns U.S. Toll Roads? Public Authorities vs Concessions',
    subtitle: 'There is no national toll-road owner. States, public authorities, counties, bridge agencies, and a smaller set of private concession companies control different assets and revenue rights.',
    seoDescription: 'Who owns toll roads in the U.S.? Learn the difference between state and public-authority ownership, municipal toll systems, and private concession rights.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'U.S. toll roads / public agencies / P3 concessions',
      note: 'The national map is a patchwork of public owners and project-specific private operating rights rather than one federal or corporate system.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '8 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'U.S. toll roads are predominantly organized through state and local public entities, with private participation concentrated in specific leases and DBFOM toll concessions rather than a single private national network.',
    conclusion: {
      title: 'Ask “which facility?” before asking “who owns toll roads?”',
      content: 'The United States has no single ownership model. A turnpike authority can own a statewide system, a state DOT can own managed lanes operated by a concessionaire, and a city can lease an existing toll road for decades. Facility-level documents determine the answer.',
    },
    evidenceBoundary: 'FHWA inventories and P3 libraries classify many facilities but use specific reporting universes and dates. This page does not convert one federal table into a claim about the ownership percentage of every tolled mile in the country.',
    metrics: [
      { label: 'National owner', value: 'NONE' },
      { label: 'Common public owners', value: 'STATE + AUTHORITY + COUNTY' },
      { label: 'Private model', value: 'LEASE / DBFOM CONCESSION' },
      { label: 'Primary source', value: 'FHWA' },
    ],
    content: [
      'The federal government does not own one national toll-road system, and no private company owns all U.S. toll roads. Ownership is fragmented across state departments of transportation, turnpike and bridge authorities, counties, regional bodies, and local governments. Private capital enters through specific concessions and long-term leases.',
      'That produces several legally different arrangements that can look identical from the driver’s seat. An electronic toll sign can sit over a road owned and operated by a public authority, a state-owned managed lane run by a private concessionaire, or a formerly public toll facility leased to a private operator for decades.',
    ],
    sections: [
      {
        id: 'public-models',
        title: 'The common public ownership models',
        paragraphs: [
          'Many toll systems are held by a state authority or state DOT. Others sit with counties, bridge and tunnel authorities, port authorities, or regional transportation entities. These owners often issue revenue bonds backed by toll receipts and operate outside the ordinary tax-funded highway budget.',
          'Public ownership does not imply low leverage or short-lived tolling. A mature public toll authority can carry billions of dollars of revenue-supported debt and maintain tolling long after the original construction bonds are gone because the network continues to fund maintenance, expansion, reserves, and new capital.',
        ],
      },
      {
        id: 'private-models',
        title: 'Where private companies enter',
        paragraphs: [
          'FHWA’s P3 library documents long-term leases such as the Chicago Skyway and Indiana Toll Road as well as DBFOM toll concessions including NTE in Texas, I-77 Express Lanes in North Carolina, I-495 and I-95 HOT lanes in Virginia, and other project-specific facilities.',
          'In these structures, the private company’s asset is usually a leasehold or concession bundle: operating rights, toll-revenue rights, contractual protections, and obligations over a defined term. The public sector can retain underlying title and regulatory powers.',
        ],
      },
      {
        id: 'owner-vs-operator',
        title: 'Why federal toll inventories list owner and operator separately',
        paragraphs: [
          'FHWA facility records make an important distinction between the agency associated with the road and the operating/pricing characteristics of the facility. A state DOT can remain the listed owner of managed lanes even where a private project company has a contractual operating role.',
          'That is the safest way to read a national toll map: do not infer ownership from the brand on the website, the transponder accepted, or the company that performs maintenance.',
        ],
      },
      {
        id: 'research-method',
        title: 'How to verify a specific U.S. toll road',
        paragraphs: [
          'Use the state DOT or authority page to identify the public asset, then check FHWA’s P3 profile or the executed lease/concession agreement if a private operator is involved. Municipal bond official statements are useful for public systems; project-finance and concession documents are useful for private ones.',
          'The final answer should name the physical owner, operating entity, toll-revenue claimant, debt issuer or borrower, and contract expiration. “Public” or “private” alone loses most of the economics.',
        ],
      },
    ],
    sources: [fhwaP3Agreements, fhwaP3, fhwaTollInventory],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'texas-managed-lanes-ownership-operators',
    number: '37',
    category: 'TEXAS INFRASTRUCTURE',
    title: 'Who Owns Texas Managed Lanes and Express Lanes?',
    seoTitle: 'Who Owns Texas Express Lanes? Owner vs Operator Map',
    subtitle: 'Managed lanes can be state-owned, authority-owned, or privately operated under concession. The tolling account and operator name are not reliable shortcuts to ownership.',
    seoDescription: 'Who owns Texas managed and express lanes? Compare TxDOT-owned lanes, NTTA billing, and private concession operators on NTE, LBJ, NTE 35W and other corridors.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Managed lane / owner / operator',
      note: 'One corridor can contain public general-purpose lanes and tolled managed lanes with a separate operator and cash-flow claimant.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '8 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Texas managed lanes are a service design, not an ownership category: identical-looking express lanes can sit in fully public systems or state-owned corridors whose toll economics are concessioned to private project companies.',
    conclusion: {
      title: '“Managed lane” describes traffic management, not who owns it',
      content: 'Identify each corridor separately. TxDOT can own the right-of-way, a concessionaire can operate and monetize the managed lanes, NTTA can process toll transactions, and general-purpose lanes can remain free beside them—all at the same location.',
    },
    evidenceBoundary: 'Facility structures change through amendments, expansions, terminations, and handbacks. This note focuses on representative Texas arrangements and the major DFW concessions rather than every HOV/HOT or express lane in the state.',
    metrics: [
      { label: 'NTE titleholder', value: 'TXDOT' },
      { label: 'NTE operator', value: 'NTE MOBILITY PARTNERS' },
      { label: 'NTE end date', value: '2061' },
      { label: 'Pricing model', value: 'FIXED OR DYNAMIC BY FACILITY' },
    ],
    resources: commonResources,
    content: [
      '“Managed lane” tells you how a lane is operated, not who owns it. Texas uses tolled express or managed lanes to sell a faster, more reliable trip beside general-purpose lanes. Some are operated directly in public systems. Others are publicly owned corridors with long-term private concession companies controlling the managed-lane toll economics.',
      'North Tarrant Express is the clearest example. TxDOT retains title to the facility and right-of-way. NTE Mobility Partners holds the concession rights and operates the managed lanes. NTTA’s collection platform can handle billing. Those three roles coexist without being interchangeable.',
    ],
    sections: [
      {
        id: 'ownership-stack',
        title: 'A managed lane can have four different “owners” in casual conversation',
        paragraphs: [
          'The state can own the roadway. A private project company can hold a leasehold and concession. A contractor can physically operate or maintain equipment. A toll authority can issue the tag and process payment. Only the first two usually bear on the property and residual economic ownership question.',
          'This layered structure is why searching only the lane brand often produces contradictory answers. Each source is answering a different layer.',
        ],
      },
      {
        id: 'dfw-concessions',
        title: 'NTE, LBJ, and NTE 35W are public corridors with private concession economics',
        paragraphs: [
          'The three DFW projects run under long-term concession structures to 2061. Their private project companies carry project debt, operating obligations, and toll-revenue rights subject to contract terms and public sharing.',
          'TxDOT does not disappear from the structure. It retains public ownership and contractual enforcement powers. At the end of the concession, the private operating and revenue rights expire unless a contract is lawfully extended.',
        ],
      },
      {
        id: 'public-managed-lanes',
        title: 'Other managed lanes can remain fully public',
        paragraphs: [
          'FHWA’s toll-facility inventory identifies Texas managed lanes such as I-35E with TxDOT as the owner and describes the dynamic-pricing regime. Public ownership and dynamic pricing are therefore compatible; dynamic tolling is not evidence of privatization.',
          'Likewise, a public authority can operate express lanes using the same transponder technology and similar pricing logic without a private equity concession behind the facility.',
        ],
      },
      {
        id: 'driver-checklist',
        title: 'The four questions a driver or analyst should ask',
        paragraphs: [
          'First: who holds title to the corridor? Second: who operates the tolled lane? Third: who keeps the toll revenue after collection and required payments? Fourth: does that right expire under a concession or continue in a public system?',
          'Once those are answered, the transponder brand and payment processor can be treated as what they are: customer infrastructure rather than an ownership shortcut.',
        ],
      },
    ],
    sources: [nteAgreement, txdotTollReport, fhwaTollInventory],
  },
  {
    kind: 'research',
    cluster: 'financial-systems',
    slug: 'texas-private-toll-concession-expiration-dates',
    number: '38',
    category: 'TEXAS INFRASTRUCTURE',
    title: 'When Do Texas Private Toll-Road Concessions Expire?',
    seoTitle: 'Texas Private Toll Road Expiration Dates: 2061 and 2062',
    subtitle: 'NTE, LBJ Express, and NTE 35W run to 2061; SH 130 Segments 5–6 runs to 2062. SH 288’s concession ended early in 2024.',
    seoDescription: 'Texas private toll concession expiration dates: NTE, LBJ and NTE 35W end in 2061; SH 130 Segments 5–6 ends in 2062. See what actually expires.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Concession clock / handback / residual value',
      note: 'The road survives the concession. What expires is the private bundle of operating and toll-revenue rights.',
    },
    date: DATE,
    lastVerified: DATE,
    readTime: '8 MIN',
    author: 'SULAYMAN BOWLES',
    thesis: 'Texas private toll concessions are wasting contractual assets: the DFW concessions currently terminate in 2061 and SH 130 5–6 in 2062, after which the private revenue right ends unless the contract is extended or changed.',
    conclusion: {
      title: 'Expiration destroys the concession’s terminal value, not the highway',
      content: 'A private toll-road investor owns a finite stream of rights. At handback, the public asset remains. Valuation therefore has to model the remaining concession life, required maintenance, handback condition, debt maturity, and any extension as a separate contingent outcome rather than a perpetual terminal value.',
    },
    evidenceBoundary: 'Dates reflect current public agreements and TxDOT reporting as checked September 23, 2026. Agreements can permit early termination or defined extensions. An announced or proposed extension should not be treated as effective until it is documented.',
    metrics: [
      { label: 'NTE expiration', value: '2061' },
      { label: 'LBJ expiration', value: '2061' },
      { label: 'NTE 35W expiration', value: '2061' },
      { label: 'SH 130 5–6 expiration', value: '2062' },
    ],
    resources: commonResources,
    content: [
      'The three major Dallas–Fort Worth private toll concessions—North Tarrant Express, LBJ Express, and NTE 35W—currently end in 2061. SH 130 Segments 5–6 ends in 2062. Those dates come from TxDOT’s concession reporting and executed project documents, not from the maturity date of any one bond.',
      'The expiration date matters because the private asset is the concession, not the permanent road. Shareholders can receive cash only while the contract gives the project company toll and operating rights, subject to debt, reserves, public sharing, maintenance, and handback obligations.',
    ],
    sections: [
      {
        id: 'expiration-table',
        title: 'The current Texas concession clock',
        paragraphs: [
          'NTE Segments 1 and 2W: 2061. LBJ/IH-635 managed lanes: 2061. NTE 35W: 2061. SH 130 Segments 5–6: 2062. TxDOT’s toll-project report also shows SH 288’s original contractual termination in 2068, but that concession was terminated decades early in October 2024.',
          'A financing instrument can mature before the concession. That simply means the project may refinance, deleverage, or distribute more cash later; it does not extend the legal right to collect tolls.',
        ],
        table: {
          caption: 'Major Texas toll concessions and current termination status',
          columns: ['Project', 'Public titleholder', 'Private concession end', 'Current private status'],
          rows: [
            ['North Tarrant Express', 'TxDOT / State of Texas', '2061', 'Active'],
            ['LBJ Express', 'TxDOT / State of Texas', '2061', 'Active'],
            ['NTE 35W', 'TxDOT / State of Texas', '2061', 'Active'],
            ['SH 130 Segments 5–6', 'TxDOT / State of Texas', '2062', 'Active'],
            ['SH 288 managed lanes', 'TxDOT / State of Texas', 'Original 2068', 'Terminated in 2024'],
          ],
        },
      },
      {
        id: 'what-expires',
        title: 'What actually expires in 2061 or 2062',
        paragraphs: [
          'The project company’s contractual operating, leasehold, and toll-revenue rights reach the end of their term, subject to the agreement. The state’s fee title does not expire. Neither does the physical road.',
          'The agreement can require handback in a specified condition. That creates a late-life capital obligation: an operator cannot simply maximize distributions and return a deteriorated asset without regard to contractual standards.',
        ],
      },
      {
        id: 'valuation',
        title: 'Why expiration changes infrastructure valuation',
        paragraphs: [
          'A normal perpetual-company discounted cash-flow model assumes some continuing terminal economics. A finite concession does not. Each remaining year is a wasting asset unless an extension is contractually granted.',
          'That makes traffic growth, toll escalation, leverage, required maintenance, and the exact remaining term inseparable. A concession with strong current EBITDA can still be overvalued if the purchase price assumes cash flow beyond handback.',
        ],
      },
      {
        id: 'early-termination',
        title: 'SH 288 proves the scheduled end date is not guaranteed',
        paragraphs: [
          'Texas terminated the SH 288 concession in 2024 and paid to recover the private rights, years before the original 2068 date. The road remained public title throughout; the transaction extinguished the private concession early.',
          'An expiration table is therefore a base legal schedule, not a prediction that every contract will survive unchanged. Buyouts, defaults, restructurings, negotiated extensions, and statutory actions can alter the path.',
        ],
      },
    ],
    sources: [txdotTollReport, nteAgreement, fhwaP3Agreements],
  },
];
