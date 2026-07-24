import type { ResearchArticle } from './articleModels';

export const WAYMO_HARDWARE_FINANCING_ARTICLE_SLUG = 'waymo-hardware-financing';
export const WAYMO_HARDWARE_FINANCING_ARTICLE_PATH =
  `/research/financial-systems/${WAYMO_HARDWARE_FINANCING_ARTICLE_SLUG}`;

export const WAYMO_HARDWARE_FINANCING_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: WAYMO_HARDWARE_FINANCING_ARTICLE_SLUG,
  number: '15',
  category: 'FINANCIAL SYSTEMS',
  title: 'The Hidden Financing Behind Hardware Startups',
  seoTitle: 'Waymo Hardware Financing: Who Funds the Assets?',
  subtitle:
    'A Waymo case study of who finances the vehicles and infrastructure, who owns the risk, and who absorbs the loss when utilization or technology fails.',
  seoDescription:
    'A source-led Waymo case study mapping $27.1B+ of equity funding, modeled fleet economics, residual-value risk, and who absorbs downside.',
  artwork: {
    kind: 'image',
    heroSrc: '/images/research/waymo-financing-reader-hero.webp',
    socialSrc: '/images/research/waymo-financing-social.jpg',
    alt: 'A monochrome autonomous-vehicle depot above layered fleet, infrastructure, capital, and downside systems.',
    label: 'Case study / capital stack',
    caption:
      'Public funding is visible; asset-level financing and legal ownership remain materially undisclosed.',
    objectPosition: '50% 46%',
  },
  date: '2026.07.22',
  lastVerified: '2026.06.17',
  readTime: '22 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'The supplied evidence describes Waymo as a parent-funded, equity-heavy platform—not a conventional leased-fleet, asset-backed, or project-financed operator. That removes visible debt-service and refinancing pressure, but leaves operating losses, technology obsolescence, and most residual-value risk with Waymo equity and, economically, Alphabet.',
  evidenceBoundary:
    'This article reformats the supplied July 22, 2026 report and analytical workbook. No source was independently refreshed for this publication. Waymo does not publish a standalone asset register, title schedule, lease schedule, lender package, or complete operating P&L in the supplied evidence. Unreported amounts are modeled ranges or named unknowns; a documented lower bound of zero means no quantified instrument was identified, not proof that none exists.',
  metrics: [
    { label: 'Disclosed funded rounds', value: '$27.1B–$27.35B' },
    { label: 'Strict Alphabet minimum', value: '>$10.8B' },
    { label: 'Modeled physical capital', value: '$0.38B–$1.35B' },
    { label: 'Modeled paid-hour use', value: '26%–39%' },
  ],
  resources: [
    {
      label: 'Full research report',
      href: '/research/waymo-hardware-financing-report.pdf',
      description: 'The complete 27-page report, including appendices, methodology, and selected source register.',
      format: 'PDF',
    },
    {
      label: 'Editable report',
      href: '/research/waymo-hardware-financing-report.docx',
      description: 'The supplied editable document used as the source for this web edition.',
      format: 'DOCX',
    },
    {
      label: 'Hardware financing model',
      href: '/research/waymo-hardware-financing-model.xlsx',
      description: 'The 21-sheet assumption book, scenario model, dashboard, scorecard, and financing toolkit.',
      format: 'XLSX',
    },
    {
      label: 'Capital-stack figure',
      href: '/images/research/waymo-capital-stack.png',
      description: 'Full-resolution view of evidenced capital, modeled asset capital, and unresolved financing channels.',
      format: 'PNG',
    },
    {
      label: 'Downside waterfall figure',
      href: '/images/research/waymo-downside-waterfall.png',
      description: 'Full-resolution utilization, asset-write-down, and residual-value downside illustration.',
      format: 'PNG',
    },
  ],
  content: [
    'Hardware businesses can look like software companies in a fundraising announcement and like infrastructure companies in a liquidation. The missing bridge is the financing stack: who pays for vehicles, sensors, batteries, charging, depots, inventory, maintenance, and working capital before a customer produces enough cash to fund the next unit.',
    'Waymo makes that bridge unusually important. The supplied package documents $27.1 billion to $27.35 billion of funded rounds through February 2026, including a modeled strict minimum of more than $10.8 billion from Alphabet across the 2024 and 2026 rounds. Yet those rounds do not disclose how much cash went into research, operations, market launches, vehicles, depots, or accumulated losses. Fundraising is the visible liability of the cap table; it is not an asset register.',
    'The analytical workbook therefore keeps three layers separate: reported facts, modeled ranges, and counterfactual financing tests. Its base case estimates $777 million of current physical-asset capital, 33.8% paid-hour utilization, $377.9 million of annualized recognized ride revenue, and $33.0 million of fleet contribution after depreciation. Those outputs are diagnostic estimates—not Waymo guidance, audited accounts, or a claim about enterprise value.',
  ],
  sections: [
    {
      id: 'visible-rounds-invisible-assets',
      title: 'The visible venture round and the invisible asset bill',
      paragraphs: [
        'Waymo’s disclosed capital history is dominated by four rounds: roughly $3.0 billion to $3.25 billion in 2020, $2.5 billion in 2021, $5.6 billion in 2024, and $16.0 billion in 2026. The workbook totals those rounds at $27.1 billion to $27.35 billion, with $27.225 billion as its base case. This is funded capital, not a measure of physical assets or cumulative cash burn.',
        'The same evidence package describes more than 3,000 vehicles in February 2026 and paid weekly-trip snapshots above 400,000 and 500,000. The model converts fleet counts, vehicle and autonomy-kit costs, charging and depot assumptions, spares, and working capital into a current physical-capital range of $380 million to $1.345 billion. The large gap between funded equity and modeled hardware is not excess cash; it is a reminder that software development, mapping, safety work, operations, insurance, labor, expansion, and historical losses also consume capital.',
        'This is the first diligence rule for any hardware startup: never substitute cumulative equity raised for the installed-asset bill. One measures how much financing entered the company. The other measures what must be purchased, maintained, depreciated, refinanced, or written down to operate the system.',
      ],
      table: {
        caption: 'Disclosed funding and modeled asset layers',
        columns: ['Layer', 'Low', 'Base', 'High', 'Evidence treatment'],
        rows: [
          ['Cumulative disclosed funded rounds', '$27.10B', '$27.225B', '$27.35B', 'Public round announcements'],
          ['Modeled Alphabet-funded capital', '$13.131B', '$17.451B', '$21.990B', 'Scenario allocation; not a disclosed total'],
          ['Strict Alphabet minimum in 2024 + 2026', '>$10.8B', '>$10.8B', '>$10.8B', 'Conservative lower bound from supplied evidence'],
          ['Modeled current physical-asset capital', '$0.380B', '$0.777B', '$1.345B', 'Fleet and infrastructure assumptions'],
          ['Economic asset capital / revenue', '1.63×', '2.06×', '2.48×', 'Modeled capital intensity'],
        ],
      },
    },
    {
      id: 'hardware-financing-mechanics',
      title: 'How hardware financing actually moves risk',
      paragraphs: [
        'Every financing instrument answers the same questions differently: who supplies cash, what collateral or contract secures repayment, which cash flow services the claim, what covenants constrain the operator, and who owns the asset when performance fails. The accounting label matters less than the legal and economic recourse.',
        'A lease can lower initial cash needs while leaving fixed rent, maintenance, insurance, mileage restrictions, and a residual guarantee behind. Asset-backed debt can match financing to eligible vehicles, but introduces borrowing bases, debt-service coverage tests, reserve accounts, concentration limits, and foreclosure rights. An SPV can isolate assets only when its contracts, cash waterfall, governance, and guarantees create real separation. Parent equity is simpler: it funds the gap without a scheduled payment, but the parent’s shareholders absorb the full loss.',
      ],
      table: {
        caption: 'Financing toolkit and failure behavior',
        columns: ['Instrument', 'Capital provider', 'Repayment source', 'Principal advantage', 'Failure behavior', 'Waymo evidence in package'],
        rows: [
          ['Equipment or finance lease', 'Bank, lessor, OEM captive', 'Fixed rentals from operating cash', 'Reduces upfront cash', 'Repossession plus deficiency or guarantor claim', 'No quantified facility identified'],
          ['Operating lease', 'Property or equipment lessor', 'Straight-line rent', 'Flexibility and lower initial cash', 'Eviction or repossession; unpaid-rent claim', 'Depot or property leases likely; not quantified'],
          ['Sale-leaseback', 'Asset buyer and lessor', 'Lease rentals', 'Monetizes installed assets', 'Lessor takes asset; operator may retain shortfall risk', 'Not identified'],
          ['Venture debt', 'Bank or fund', 'Future equity, cash burn runway, revenue', 'Delays equity issuance', 'Acceleration and claim on company or IP', 'No facility identified'],
          ['Asset-backed facility', 'Bank or ABS investors', 'Asset cash flow and liquidation proceeds', 'Scales with eligible collateral', 'Cash sweep, foreclosure, and possible parent cure', 'No facility identified; DSCR modeled counterfactually'],
          ['SPV or project finance', 'Sponsor and project investors', 'Contracted project or fleet cash flow', 'Matches long-lived capital to assets', 'SPV equity wiped first; secured creditors follow', 'No asset SPV or project-finance structure identified'],
          ['Customer prepayment', 'Customer', 'Future delivery or service', 'Funds production without lender priority', 'Refund and performance obligations', 'No fleet-funding deposits or prepayments identified'],
          ['Government support', 'Public agency or tax investor', 'Project cash flow or policy compliance', 'Can lower cost and extend tenor', 'Clawback, political review, or guarantee claim', 'No quantified grant, loan, guarantee, or credit identified'],
        ],
      },
    },
    {
      id: 'parent-funded-model',
      title: 'Waymo most closely resembles a parent-funded platform',
      paragraphs: [
        'The most defensible reading of the supplied record is a high-equity, parent-supported platform. Alphabet repeatedly supplied capital, the 2026 financing was majority funded by Alphabet, and Waymo remains economically inside the Alphabet group. Outside investors diversify the cap table, but their participation does not establish a lease, borrowing base, residual guarantee, or non-recourse project structure.',
        'Parent funding removes visible near-term refinancing deadlines and scheduled debt service. It does not make the assets light. Vehicle purchases, autonomy hardware, charging, depots, spares, maintenance, remote assistance, insurance, and technology refresh still have to be paid for. The loss simply remains in equity instead of passing immediately to a lender or lessor.',
        'Consolidation also needs careful interpretation. The package notes that Waymo is a consolidated variable-interest entity. That is an accounting and control fact about the company; it is not evidence that a ring-fenced fleet SPV owns vehicles or that secured lenders bear the first loss.',
      ],
      table: {
        caption: 'What parent funding establishes—and what it does not',
        columns: ['Observation', 'Supported conclusion', 'Still unknown'],
        rows: [
          ['Repeated Alphabet participation', 'Alphabet is the principal economic backstop', 'Exact cumulative parent cash contribution'],
          ['Majority Alphabet funding in 2026', 'Parent willingness supports current scale', 'Future willingness and return threshold'],
          ['Outside strategic and financial investors', 'Waymo has external equity validation', 'Special rights, preferences, guarantees, or recourse'],
          ['Waymo consolidated as a VIE', 'Alphabet controls and consolidates Waymo', 'Whether any separate asset-owning SPVs exist'],
          ['Large operating fleet and infrastructure', 'Material capital is deployed in physical operations', 'Vehicle titles, depot leases, liens, and residual holder'],
        ],
      },
    },
    {
      id: 'leased-fleet-model',
      title: 'A leased fleet changes cash timing, not automatically risk',
      paragraphs: [
        'A true leased-fleet model would place vehicle or equipment title with a lessor and let Waymo pay for use over time. That can lower initial equity per deployment and create an orderly replacement cycle. It can also turn a flexible equity-funded cost into a fixed obligation that survives a decline in rides.',
        'Specialized autonomous assets make risk transfer expensive. A lessor asked to finance a custom sensor suite, compute stack, modified vehicle, or dedicated charging installation will care about remarketing value, maintenance standards, software support, mileage, insurance, and technology obsolescence. If the secondary market is weak, the lessor can recover economics through rent, advance rate, residual guarantees, return-condition charges, or parent support.',
        'The supplied package does not quantify a Waymo fleet lease or lease schedule. Ordinary property or depot leases may exist, but that is different from proving that fleet capital and residual-value risk have moved off the operating company’s balance sheet.',
      ],
      bullets: [
        'Identify the legal owner of every material vehicle, autonomy kit, charger, and depot improvement.',
        'Reconcile lease liabilities, minimum payments, purchase options, mileage limits, and return conditions.',
        'Read residual guarantees and maintenance covenants before calling the structure asset-light.',
        'Test fixed rent against utilization and revenue shocks, not only the launch plan.',
        'Trace parent guarantees, keepwells, equity cures, and cross-defaults across the group.',
      ],
    },
    {
      id: 'asset-backed-spv-model',
      title: 'Asset-backed debt needs cash flow and collateral that survive the story',
      paragraphs: [
        'An asset-backed or SPV structure could finance eligible vehicles, equipment, or receivables with senior debt while sponsor equity absorbs the first loss. The structure scales only if lenders can underwrite a durable payment stream, value the collateral, perfect security interests, monitor concentration, and recover assets without depending entirely on the sponsor’s technology roadmap.',
        'The workbook tests debt as a counterfactual because no Waymo asset facility is identified. In the base case, modeled annual debt service consumes nearly all available fleet contribution: illustrative DSCR is 0.94× before a shock and 0.59× after a 25% utilization reduction. The high-capital scenario is already contribution-negative. Only the low-capital scenario produces comfortable modeled coverage.',
        'That range shows why asset debt cannot be inferred from fleet size. The underwriting question is not whether vehicles exist; it is whether the operating cash flow and recoverable asset value remain dependable after lower utilization, price pressure, downtime, claims, hardware refresh, and software obsolescence.',
      ],
      table: {
        caption: 'Counterfactual fleet-debt coverage—not a disclosed Waymo facility',
        columns: ['Modeled scenario', 'Physical capital', 'Recognized ride revenue', 'Contribution after depreciation', 'Illustrative DSCR', 'DSCR after 25% utilization shock'],
        rows: [
          ['Low capital', '$380.0M', '$233.0M', '$113.3M', '3.59×', '2.55×'],
          ['Base', '$777.0M', '$377.9M', '$33.0M', '0.94×', '0.59×'],
          ['High capital', '$1.345B', '$543.4M', '($268.9M)', '(0.07×)', '(0.16×)'],
        ],
      },
    },
    {
      id: 'customer-funded-model',
      title: 'Pay-as-you-go rides are not customer financing',
      paragraphs: [
        'Customer funding transfers part of the capital burden when buyers pay deposits, prepay capacity, commit to minimum volumes, or accept milestone and termination obligations before an asset is delivered. Defense, industrial, and custom-manufacturing businesses often use those structures because a named customer can underwrite production for a specific system.',
        'The package identifies transactional rider payments, not fleet-funding deposits or prepayments. A fare collected after a trip is operating revenue. It does not finance the vehicle years in advance, create contracted utilization, or guarantee recovery of a dedicated depot. Consumer demand can be frequent and still remain cancellable one ride at a time.',
        'Future enterprise, municipal, airport, or network-partner contracts could improve financeability if they include credible minimum revenue, reserved capacity, deposits, take-or-pay terms, or termination payments. Those provisions would also create service, refund, uptime, and performance obligations that must be modeled as liabilities rather than described as free capital.',
      ],
      table: {
        caption: 'Customer-capital pathways and their evidence status',
        columns: ['Pathway', 'What funds the asset', 'Economic obligation', 'Status in supplied package'],
        rows: [
          ['Retail ride payment', 'Cash paid after service', 'Complete the trip', 'Documented operating revenue; not fleet financing'],
          ['Consumer deposit', 'Cash before future rides', 'Refund or future service', 'Not identified'],
          ['Enterprise prepayment', 'Prepaid service block', 'Capacity and service-level delivery', 'Not identified'],
          ['Minimum-volume contract', 'Committed recurring revenue', 'Availability, pricing, and performance terms', 'Not identified'],
          ['Take-or-pay capacity', 'Payment for reserved capacity', 'Dedicated supply and termination protection', 'Not identified'],
        ],
      },
    },
    {
      id: 'government-supported-model',
      title: 'Regulatory permission is not government financing',
      paragraphs: [
        'Autonomous-vehicle deployment depends on public rules, permits, safety oversight, and access to roads. Those permissions are essential to commercial operation, but they are not the same thing as a grant, subsidized loan, loan guarantee, tax-credit monetization, public purchase commitment, or government-funded factory.',
        'The supplied package includes California regulatory materials and public safety records but identifies no quantified Waymo grant, government loan, guarantee, or tax credit. The model therefore records a documented lower bound of zero and an unresolved unknown—not a finding that public support can never exist.',
        'Government support can make a hardware platform more financeable by reducing upfront cost or extending debt tenor. It can also introduce domestic-content rules, job and location commitments, reporting duties, milestone tests, matching-spend requirements, and clawbacks. The net risk transfer is only visible after the program documents are read.',
      ],
      table: {
        caption: 'Public-sector involvement: permission versus capital',
        columns: ['Mechanism', 'What it changes', 'Evidence needed', 'Package status'],
        rows: [
          ['Operating permit or regulatory program', 'Legal ability to provide service', 'Authority, operating domain, reporting terms', 'Publicly evidenced'],
          ['Grant', 'Reduces asset cost without scheduled repayment', 'Award, eligible spend, milestones, clawbacks', 'No quantified award identified'],
          ['Government loan or guarantee', 'Lowers cost or extends tenor', 'Principal, security, guarantee, covenants', 'No quantified instrument identified'],
          ['Tax credit or tax-equity structure', 'Monetizes eligible investment', 'Eligibility, transferability, recapture terms', 'No quantified value identified'],
          ['Public purchase or capacity contract', 'Creates contracted demand', 'Volume, price, term, termination rights', 'Not identified'],
        ],
      },
    },
    {
      id: 'residual-value',
      title: 'Residual value is the hidden fulcrum',
      paragraphs: [
        'Hardware financing is easiest when the asset can be redeployed or sold. Waymo’s system combines production vehicles with specialized autonomy hardware, compute, sensors, integration, charging, depot improvements, spares, and operational tooling. The closer an asset is to a liquid standard vehicle, the easier it is to value. The more its value depends on proprietary software, calibration, regulatory approval, or a current sensor generation, the weaker its stand-alone collateral value becomes.',
        'The workbook models residual-value exposure at $185.3 million in the low case, $448.8 million in the base case, and $940.5 million in the high case. Those are analytical exposures, not observed liquidation quotes. The legal owner is also unresolved, so the model cannot conclusively assign every dollar to Waymo, an OEM, a lessor, a partner, or another entity.',
        'Technology cycles can strand assets before their mechanical life ends. A newer autonomy generation may lower unit cost and improve performance while making an earlier kit less attractive to finance. Residual guarantees can shift the first check written in a downside, but guarantees ultimately move the loss to the guarantor; they do not make it disappear.',
      ],
      table: {
        caption: 'Modeled residual-value exposure',
        columns: ['Scenario', 'Physical-asset capital', 'Residual exposure', 'Core uncertainty'],
        rows: [
          ['Low', '$380.0M', '$185.3M', 'Asset mix and recoverable standard-vehicle value'],
          ['Base', '$777.0M', '$448.8M', 'Title, hardware reuse, and secondary-market depth'],
          ['High', '$1.345B', '$940.5M', 'Large installed base with faster obsolescence or weak recovery'],
        ],
      },
    },
    {
      id: 'utilization-downside',
      title: 'Utilization turns physical capital into an operating result',
      paragraphs: [
        'A vehicle can be technically available and still fail economically if too few hours are paid. The workbook translates fleet availability, paid weekly trips, rides per paid hour, average fare, network fees, variable cost, fixed operating cost, and depreciation into paid-hour utilization of 26.5% to 39.2% and annualized recognized ride revenue of $233.0 million to $543.4 million.',
        'Its base case produces $33.0 million of annual fleet contribution after depreciation. A 25% utilization shock turns that into an $18.3 million annual loss; a 25% revenue shock produces a $61.5 million loss. A 20% increase in asset cost leaves $17.8 million of contribution after depreciation. These are sensitivity outputs, not forecasts, and the “high capital” scenario is not automatically bullish: more deployed capital and depreciation can overwhelm its higher revenue.',
        'The downside waterfall combines the operating shock with asset impairment. This is the economic sequence a financing structure must survive: lower paid use reduces cash contribution, a technology or cost reset reduces recoverable asset value, and the remaining loss follows title, collateral, guarantees, and the equity waterfall.',
      ],
      bullets: [
        'Base modeled annual contribution after depreciation: $33.0M.',
        'Base contribution after a 25% utilization shock: ($18.3M).',
        'Base contribution after a 25% recognized-revenue shock: ($61.5M).',
        'Base contribution after 20% higher asset cost and depreciation: $17.8M.',
      ],
      figures: [
        {
          src: '/images/research/waymo-downside-waterfall.png',
          alt: 'Downside waterfall showing how lower utilization and an asset write-down reduce modeled residual value before losses reach the capital providers.',
          label: 'Figure 02 / downside waterfall',
          caption:
            'Illustrative waterfall from operating underutilization to asset impairment and residual loss. Values are model outputs, not disclosed Waymo financials.',
          width: 3484,
          height: 1627,
        },
      ],
      table: {
        caption: 'Modeled fleet economics across the scenario range',
        columns: ['Scenario', 'Paid-hour utilization', 'Recognized ride revenue', 'Contribution after depreciation', 'Contribution after 25% utilization shock'],
        rows: [
          ['Low capital', '26.5%', '$233.0M', '$113.3M', '$70.8M'],
          ['Base', '33.8%', '$377.9M', '$33.0M', '($18.3M)'],
          ['High capital', '39.2%', '$543.4M', '($268.9M)', '($304.9M)'],
        ],
      },
    },
    {
      id: 'structures-that-scale',
      title: 'Which structures actually scale',
      paragraphs: [
        'A financing structure scales when the provider of capital can be repaid without relying on a permanently rising equity valuation. Parent equity scales with the parent’s balance sheet and strategic willingness. Leasing scales with reusable collateral and a lessor willing to own residual risk. Asset-backed debt scales with predictable cash flow and enforceable security. Customer funding scales with credible contracted demand. Government support scales only inside the limits and obligations of the public program.',
        'On the supplied evidence, Waymo currently fits the parent-funded archetype best. It has extraordinary access to equity and no identified fixed fleet-debt burden, asset-level SPV, customer pre-funding, supplier facility, or quantified government support. That gives the platform time to improve utilization and hardware cost, but it does not prove that the fleet can self-finance or that another capital provider will accept the residual risk on standalone terms.',
        'The decisive diligence question is therefore not “How much has Waymo raised?” It is “What portion of the next unit can be financed by its own durable cash flow, transferable collateral, or contracted customer demand—and who writes the check when those assumptions fail?” Until the legal asset map and standalone economics are disclosed, parent willingness remains the principal scaling mechanism.',
      ],
      bullets: [
        'Obtain vehicle titles, equipment schedules, depot leases, liens, and partner ownership agreements.',
        'Reconcile standalone revenue, cash burn, capex, depreciation, insurance, maintenance, and contribution margin.',
        'Separate OEM supply commitments from OEM financing or residual guarantees.',
        'Trace every parent guarantee, keepwell, equity cure, and cross-default provision.',
        'Underwrite utilization, downtime, fare pressure, hardware refresh, and liquidation value together.',
      ],
      table: {
        caption: 'Scalability by financing archetype',
        columns: ['Archetype', 'What enables scale', 'Principal downside holder', 'Waymo fit from supplied evidence'],
        rows: [
          ['Parent-funded platform', 'Parent balance sheet and strategic commitment', 'Parent and common equity', 'High'],
          ['Leased-fleet operator', 'Reusable assets and lessor underwriting', 'Operator first; lessor on residual shortfall', 'Not established'],
          ['SPV / asset-backed platform', 'Contracted cash flow and financeable collateral', 'SPV equity, then lender or guarantor', 'Not established'],
          ['Customer-funded operator', 'Deposits, prepayments, or minimum volumes', 'Customer on deposit; operator on delivery recourse', 'Not established'],
          ['Government-supported platform', 'Grant, guarantee, tax credit, or public contract', 'Shared; depends on clawback and guarantee terms', 'No quantified support identified'],
          ['Partner-capital model', 'OEM, fleet, landlord, or network balance sheet', 'Partner or startup depending on recourse', 'Operational partners evidenced; financing transfer unclear'],
        ],
      },
    },
  ],
  sources: [
    {
      label: 'Waymo — first external investment round (2020)',
      href: 'https://waymo.com/blog/2020/03/waymo-raises-first-external-investment-round',
    },
    {
      label: 'Waymo — world-class investors financing update (2021)',
      href: 'https://waymo.com/blog/2021/06/transforming-mobility-with-confidence-of-world-class-investors',
    },
    {
      label: 'Waymo — $5.6 billion investment round (2024)',
      href: 'https://waymo.com/blog/2024/10/investing-to-bring-the-waymo-driver-to-more-riders',
    },
    {
      label: 'Waymo — $16 billion investment round (2026)',
      href: 'https://waymo.com/blog/2026/02/waymo-raises-usd16-billion-investment-round',
    },
    {
      label: 'Alphabet 2024 Form 10-K',
      href: 'https://www.sec.gov/Archives/edgar/data/1652044/000165204425000014/goog-20241231.htm',
    },
    {
      label: 'Alphabet 2025 Form 10-K',
      href: 'https://www.sec.gov/Archives/edgar/data/1652044/000165204426000018/goog-20251231.htm',
    },
    {
      label: 'Alphabet Q2 2024 Form 10-Q',
      href: 'https://www.sec.gov/Archives/edgar/data/1652044/000165204424000079/goog-20240630.htm',
    },
    {
      label: 'Waymo response to Senator Markey',
      href: 'https://storage.googleapis.com/waymo-prod-cdn/uploads/680a27f89a3aae48977db655a5f45005-Sen._Markey_RA_Letter_Waymo__Response.pdf',
    },
    { label: 'Waymo Driver overview', href: 'https://waymo.com/waymo-driver/' },
    {
      label: 'Waymo — sixth-generation Waymo Driver (2024)',
      href: 'https://waymo.com/blog/2024/08/meet-the-6th-generation-waymo-driver',
    },
    {
      label: 'Waymo — sixth-generation production and Mesa update (2026)',
      href: 'https://waymo.com/blog/2026/02/ro-on-6th-gen-waymo-driver',
    },
    {
      label: 'NHTSA preliminary evaluation PE25-013',
      href: 'https://static.nhtsa.gov/odi/inv/2025/INOA-PE25013-23069.pdf',
    },
    {
      label: 'NHTSA recall report 25E-084',
      href: 'https://static.nhtsa.gov/odi/rcl/2025/RCLRPT-25E084-7732.pdf',
    },
    { label: 'Waymo rider and service FAQ', href: 'https://waymo.com/faq/' },
    {
      label: 'Obi report — Waymo, Uber, and Lyft pricing',
      href: 'https://rideobi.com/wp-content/uploads/2025/10/Obi-Report-Pricing-Insights-On-Waymo-Uber-and-Lyft.pdf',
    },
    {
      label: 'Jaguar Land Rover — long-term Waymo partnership',
      href: 'https://media.jaguar.com/news/2018/03/waymo-and-jaguar-land-rover-announce-long-term-partnership-beginning-self-driving',
    },
    {
      label: 'Reuters — Waymo, Moove, and London operations',
      href: 'https://www.reuters.com/business/autos-transportation/waymo-launch-autonomous-ride-hailing-service-london-next-year-2025-10-15/',
    },
    {
      label: 'California Public Utilities Commission — autonomous vehicle programs',
      href: 'https://www.cpuc.ca.gov/regulatory-services/licensing/transportation-licensing-and-analysis-branch/autonomous-vehicle-programs',
    },
    {
      label: 'California Public Utilities Commission — Waymo TCP filing',
      href: 'https://www.cpuc.ca.gov/-/media/cpuc-website/divisions/consumer-protection-and-enforcement-division/documents/tlab/av-programs/waymo-tcp-a-20250627.pdf',
    },
    {
      label: 'Waymo — charging and green transportation',
      href: 'https://waymo.com/blog/2023/08/making-green-transportation-accessible',
    },
  ],
};
