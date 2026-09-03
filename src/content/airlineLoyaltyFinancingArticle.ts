import type { ResearchArticle } from './articleModels';

export const AIRLINE_LOYALTY_FINANCING_ARTICLE_SLUG =
  'how-airlines-borrow-against-loyalty-programs';
export const AIRLINE_LOYALTY_FINANCING_ARTICLE_PATH =
  `/research/financial-systems/${AIRLINE_LOYALTY_FINANCING_ARTICLE_SLUG}`;

export const AIRLINE_LOYALTY_FINANCING_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: AIRLINE_LOYALTY_FINANCING_ARTICLE_SLUG,
  aliases: ['/markets/how-airlines-borrow-against-loyalty-programs'],
  number: '18',
  category: 'FINANCIAL SYSTEMS',
  title: 'How Airlines Borrow Against Loyalty Programs',
  seoTitle: 'How Airlines Borrow Against Loyalty Programs',
  subtitle:
    'How airline loyalty program financing turns bank payments, co-brand contracts, controlled accounts, and loyalty IP into collateral—without treating points as deposits.',
  seoDescription:
    'How airlines borrow against loyalty programs: follow bank cash, deferred revenue, pledged accounts, loyalty-backed debt, and the lender waterfall.',
  artwork: {
    kind: 'image',
    heroSrc: '/images/research/airline-loyalty-financing-reader-hero.webp',
    socialSrc: '/images/research/airline-loyalty-financing-social.jpg',
    alt: 'A monochrome airline financing system linking aircraft operations, loyalty value, bank cash, and secured collateral channels.',
    label: 'Airline loyalty financing / AAdvantage primary case',
    caption:
      'The card purchase, bank payment, future award, and lender claim are separate transactions. The financing only works after designated loyalty cash is routed into controlled accounts.',
    objectPosition: '50% 48%',
  },
  date: '2026.07.23',
  lastVerified: '2026.07.23',
  readTime: '24 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'Airlines do not borrow against points as if miles were customer deposits. They borrow against recurring partner receipts and the contracts, accounts, intellectual property, data rights, reserves, and intercompany payments that make those receipts durable and controllable.',
  conclusion: {
    title: 'The collateral is the partner-cash system',
    content:
      'Loyalty-backed borrowing depends on recurring partner receipts and the contracts, accounts, intellectual property, reserves, and intercompany controls around them—not on treating miles as deposits. Stress analysis must follow that cash waterfall without substituting modeled point economics for undisclosed contract terms.',
  },
  evidenceBoundary:
    'This web edition reformats the supplied July 23, 2026 investigation and its embedded exhibits. The underlying sources were not independently refreshed for publication. Reported values retain the source package’s evidence cutoff; derived, estimated, management-defined, and pro forma values remain labeled. Point prices, revenue allocations, redemption costs, valuation ranges, and stress cases are analytical estimates—not disclosed contract terms, forecasts, covenant calculations, appraisals, or investment recommendations.',
  metrics: [
    { label: 'American 2025 partner cash', value: '$6.2B' },
    { label: 'American 2025 loyalty liability', value: '$10.564B' },
    { label: 'Initial AAdvantage financing', value: '$10.0B' },
    { label: 'Targeted direct deposits', value: '≥90%' },
  ],
  resources: [
    {
      label: 'Full airline loyalty financing investigation',
      href: '/research/airline-loyalty-financing-report.pdf',
      description:
        'The complete 22-page report covering partner cash, accounting, fulfillment, loyalty-backed debt, valuation, issuer risk, methodology, and a source index.',
      format: 'PDF',
    },
    {
      label: 'Editable investigation',
      href: '/research/airline-loyalty-financing-report.docx',
      description:
        'The supplied editable report used as the source document for this web edition.',
      format: 'DOCX',
    },
    {
      label: 'Loyalty parties and money map',
      href: '/images/research/airline-loyalty-parties-money.png',
      description:
        'A downloadable map separating the cardholder, merchant, issuer, airline, loyalty vehicle, award claim, and lender-controlled cash flow.',
      format: 'PNG',
    },
  ],
  content: [
    'How airlines borrow against loyalty programs: the card issuer pays cash under a commercial agreement; the airline records some consideration as current revenue and some as a contract liability; the member claims an award later; and a separate financing structure can give lenders first claim on designated partner and intercompany collections. The collateral is recurring cash, contracts, controlled accounts, loyalty intellectual property, data rights, reserves, and special-purpose-vehicle equity—not the member’s points as a fixed-dollar deposit.',
    'The publication includes a 22-page investigation, nine full-resolution exhibits, a point-level cash model, and a lender-waterfall reconstruction. American AAdvantage is the primary case, with Delta SkyMiles, United MileagePlus, and Air Canada Aeroplan used to separate ordinary operating float, explicit partner prepayments, and secured loyalty-backed debt.',
    'The central mistake is collapsing four clocks into one. Bank cash can arrive within weeks. Revenue is recognized across delivered marketing services and future awards. Fulfillment can occur years later or never. When the program is financed, debt service and reserves can be trapped before excess cash reaches the airline.',
  ],
  sections: [
    {
      id: 'four-clocks',
      title: 'One airline point starts four financial clocks',
      paragraphs: [
        'Start with a $1,000 hotel purchase on an AAdvantage card. The hotel sale is settled among the cardholder, merchant, acquirer, network, and issuer; American is not a party to that merchant settlement. A second commercial transaction follows when the issuer calculates the miles associated with the account and pays the airline or loyalty vehicle under the co-brand agreement.',
        'The reconstructed model assumes 1,000 points produce $12 of partner cash, or 1.2 cents per point. That is an estimate because the public filings disclose the commercial bundle and settlement cadence, not the current net point price after fixed payments, benefits, volume terms, and other contract economics.',
        'The member sees 1,000 miles. The issuer sees a reward cost and a retention asset. The airline sees cash, current performance obligations, and a future award claim. A secured lender may see the same receipt enter a pledged account. No one clock determines the others.',
      ],
      figures: [
        {
          src: '/images/research/airline-loyalty-cash-conversion-cycle.png',
          alt: 'Matrix tracing cash, accounting, fulfillment, and financing from card purchase through issuer payment, redemption, breakage, or early amortization.',
          label: 'Figure 01 / One point’s cash conversion cycle',
          caption:
            'The same 1,000-point issuance follows four clocks. The base model is estimated where contracts are opaque.',
          width: 2056,
          height: 1452,
        },
      ],
    },
    {
      id: 'what-the-bank-buys',
      title: 'The bank buys a commercial bundle, not just miles',
      paragraphs: [
        'Co-brand agreements package the award currency with brand rights, customer access, card acquisition, exclusivity, marketing inventory, airport and in-flight placements, and travel benefits such as checked bags, priority boarding, upgrades, or lounge access. The point is the unit that makes the arrangement measurable; it is not the whole product.',
        'That distinction limits every wholesale cents-per-point estimate. Dividing a $12 issuer payment by 1,000 points treats brand, customer acquisition, card benefits, data access, and the award obligation as one product. Public filings describe the components but do not disclose enough contract detail to isolate a current net bank price for one mile.',
        'Recurring monthly point sales are also different from explicit partner prepayments. Air Canada’s Aeroplan acquisition materials separately disclosed C$1.212 billion of deferred partner consideration connected to long-term commercial agreements and C$400 million of bank prepayments to be applied against later mile purchases. One funded future participation and services; the other created purchase credits.',
      ],
      table: {
        caption: 'Three mechanisms that are often incorrectly described as the same financing',
        columns: ['Mechanism', 'What creates cash today', 'Accounting', 'Provider claim'],
        rows: [
          ['Operating float', 'Recurring point sales and co-brand consideration', 'Current revenue plus contract liability', 'Commercial rights; no principal-and-interest claim'],
          ['Explicit partner prepayment', 'Upfront renewal, exclusivity, transition, or future-purchase money', 'Deferred and amortized or applied against later purchases', 'Future services or contractual purchase credits'],
          ['Loyalty-backed debt', 'Loan or note proceeds', 'Financial debt with interest, maturity, and covenants', 'Liens on contracts, IP, accounts, reserves, and SPV equity'],
        ],
      },
    },
    {
      id: 'cash-is-not-revenue',
      title: 'Partner cash is not the same thing as loyalty revenue',
      paragraphs: [
        'For the 1,000-point model, the $12 receipt is allocated 40% to current marketing and benefits and 60% to the future award: $4.80 of immediate revenue and $7.20 of contract liability. Those percentages are estimated. The filings disclose relative-standalone-selling-price methods, expected redemption, equivalent-ticket values, breakage, and brand valuation inputs, but not the current contract-specific split.',
        'American reported $6.2 billion of 2025 cash remuneration from co-branded cards and other partners. It added $4.445 billion to its loyalty contract liability, released $3.935 billion, and ended with $10.564 billion deferred. Separately, it reported $3.511 billion of loyalty marketing-services revenue and $4.036 billion of loyalty travel revenue. The travel amount includes releases from prior cohorts; none of these figures substitutes for another.',
        'The same timing mismatch appears at Delta and United. A contract liability measures consideration allocated to expected future performance. It is not the expected cash cost of providing an award, does not carry a conventional coupon or principal maturity, and normally settles through service rather than cash repayment.',
      ],
      table: {
        caption: 'Fiscal 2025 loyalty-program balance sheets; reported categories are similar but not identical',
        columns: ['Program', 'Ending liability', 'Annual additions', 'Annual releases', 'Current / partner-related revenue'],
        rows: [
          ['American AAdvantage', '$10.564B', '$4.445B', '$3.935B', '$3.511B marketing services; $4.036B loyalty travel'],
          ['Delta SkyMiles', '$9.262B', '$4.892B', '$4.456B total', '$3.362B other-revenue loyalty; $4.237B award travel'],
          ['United MileagePlus', '$7.777B', '$3.883B', '$3.547B total', '$3.2B marketing, advertising, non-travel, and benefits'],
        ],
      },
      figures: [
        {
          src: '/images/research/airline-loyalty-cash-not-revenue.png',
          alt: 'Accounting and cash bridge showing a modeled 12 dollar partner receipt split into immediate revenue and deferred liability, then reduced by redemption cash and program expense.',
          label: 'Figure 02 / Cash is not revenue',
          caption:
            'The accounting bridge and the cash-contribution bridge use the same modeled receipt but answer different questions.',
          width: 2380,
          height: 1291,
        },
        {
          src: '/images/research/airline-loyalty-balance-sheets.png',
          alt: 'Grouped bars comparing 2025 ending loyalty liabilities, annual additions, and annual releases for American, Delta, and United.',
          label: 'Figure 03 / Loyalty-program balance sheets',
          caption:
            'Ending liabilities are roughly two years of annual release at Delta and United and 2.7 years at American, whose balance includes upfront Citi consideration.',
          width: 2472,
          height: 1270,
        },
      ],
    },
    {
      id: 'float-breakage-award-cost',
      title: 'Float, breakage, and award cost create the operating spread',
      paragraphs: [
        'The delay between issuance and redemption is operating float. Delta and United say most new miles are redeemed within two years. The supplied cohort model places 25% of redemptions in Year 0, 35% in Year 1, 20% in Year 2, 8% later, and 12% in expected breakage. Conditional on redemption, the expected wait is about 1.7 years.',
        'Breakage is an estimate of points unlikely to be redeemed, not simply legal expiration. A no-expiration program can still recognize proportional breakage based on account behavior and expected redemption. Longer timing gives the airline more use of the cash, but a confidence shock can reverse the benefit by causing a redemption wave during weak partner spending or constrained seat inventory.',
        'The value of a point depends on whose ledger is being measured. The bank’s bundle price, the accounting allocation, the member’s avoided fare, the airline’s incremental cash cost, and the opportunity cost of displacing a paying passenger can differ by multiples. An empty off-peak seat can cost little incremental cash; a scarce premium award can displace thousands of dollars of fare contribution.',
      ],
      figures: [
        {
          src: '/images/research/airline-loyalty-point-values.png',
          alt: 'Range plot distinguishing modeled bank bundle payment, accounting allocation, consumer value, airline incremental cost, and airline opportunity cost per point.',
          label: 'Figure 04 / What one point is worth to each party',
          caption:
            'These ranges answer different questions and should not be compared as though they were one observable market price.',
          width: 2470,
          height: 1277,
        },
      ],
    },
    {
      id: 'loyalty-backed-debt',
      title: 'Airline loyalty-backed debt redirects the cash waterfall',
      paragraphs: [
        'Operating float creates the recurring cash stream. Airline loyalty-backed debt adds a legal claim on that stream. American and United moved loyalty rights and payment paths into bankruptcy-remote structures, contributed or licensed intellectual property and data rights, pledged collection and reserve accounts, and protected key partner and intercompany agreements.',
        'Cash control is the lender protection. American’s documents targeted at least 90% of AAdvantage revenue for direct deposit into the collection account each quarter, with off-account receipts swept in. Fees, interest, required principal, and reserves came before excess cash could move to the airline. Coverage or reserve failures could trigger early amortization and accelerate cash trapping.',
        'The lender claim attaches to defined collections, contracts, accounts, IP rights, reserves, and SPV equity—not to a vague promise that loyalty will remain profitable. The structure can protect a cash stream through restructuring, but it does not make the loyalty program operationally independent from routes, seats, employees, airports, and the airline brand experience.',
      ],
      figures: [
        {
          src: '/images/research/airline-loyalty-backed-financing.png',
          alt: 'Side-by-side American AAdvantage and United MileagePlus loyalty-backed financing waterfalls from co-brand agreements through controlled accounts, debt service, reserves, and excess cash.',
          label: 'Figure 05 / Loyalty-backed financing structures',
          caption:
            'American and United used the same design logic: isolate assets, direct collections, service debt, fund reserves, then release excess cash.',
          width: 2056,
          height: 1267,
        },
      ],
    },
    {
      id: 'american-united-debt',
      title: 'American kept the channel; United repaid it',
      paragraphs: [
        'American initially raised $10.0 billion in 2021: $3.5 billion of 5.50% notes, $3.0 billion of 5.75% notes, and a $3.5 billion term loan. It added a $1.0 billion incremental AAdvantage term loan in 2025. At March 31, 2026, the disclosed visible balances totaled about $6.543 billion across the two note series and two term loans.',
        'United raised $6.8 billion in 2020 through $3.8 billion of 6.50% notes and a $3.0 billion term loan. It prepaid the term loan in July 2024 and redeemed the remaining $1.52 billion of MileagePlus notes in July 2025. The same loyalty assets no longer supported that debt after repayment.',
        'The pandemic transactions worked because partner cash and card spending were more resilient than passenger flying, while the legal documents reduced leakage. Debt capacity still is not program value. It proves that designated cash flows supported a stated borrowing amount under reserves, covenants, and cash control.',
      ],
      table: {
        caption: 'Reported loyalty-backed financing structures and later status',
        columns: ['Program', 'Initial financing', 'Core controls', 'Status in supplied evidence'],
        rows: [
          ['American AAdvantage', '$10.0B in 2021; $1.0B incremental term loan in 2025', '≥90% direct-deposit target; collection and reserve accounts; coverage test up to 2.0×', 'Approximately $6.543B visible at March 31, 2026'],
          ['United MileagePlus', '$6.8B in 2020', '90% collections; daily sweep; coverage test up to 2.0×; intercompany restrictions', 'Term loan repaid July 2024; remaining notes redeemed July 2025'],
        ],
      },
    },
    {
      id: 'program-valuation',
      title: 'A loyalty program can exceed airline equity without exceeding airline enterprise value',
      paragraphs: [
        'American’s March 2021 financing presentation showed an airline enterprise value of $49.521 billion, an equity market capitalization of $14.182 billion, and 2019 pro forma AAdvantage adjusted EBITDA of $2.911 billion. Applying an estimated 7× to 10× multiple produces a gross program range of $20.4 billion to $29.1 billion.',
        'That range equals 41% to 59% of the matching-date airline enterprise value, but 1.44× to 2.05× the equity market capitalization. The slogan that the loyalty program is “worth more than the airline” only works when gross program enterprise value is compared with distressed airline equity—two different claims on the same corporate system.',
        'The supplied DCF produces an estimated $22.9 billion to $34.9 billion range. Both approaches depend on durable card spending, partner concentration, contract pricing, member behavior, and the airline platform. Existing loyalty-backed debt still has to be deducted before reaching program equity value.',
      ],
      figures: [
        {
          src: '/images/research/airline-loyalty-program-value.png',
          alt: 'Comparison of American enterprise value, AAdvantage multiple and DCF value ranges, American equity market capitalization, and 2021 loyalty debt capacity.',
          label: 'Figure 06 / Loyalty value versus airline value',
          caption:
            'Only the airline enterprise-value and market-cap bars share the March 2021 date; the program ranges derive from 2019 pro forma economics.',
          width: 2469,
          height: 1350,
        },
      ],
    },
    {
      id: 'partner-failure',
      title: 'When the bank relationship breaks, cash can fail before the liability disappears',
      paragraphs: [
        'Aeroplan shows the control problem. Air Canada announced that it would leave the externally owned program, then later bought Aeroplan back for announced cash consideration plus assumption of roughly C$1.9 billion of miles-related redemption liability. Bank and network partners supplied long-term agreement consideration and future-mile purchase prepayments to preserve continuity.',
        'The outgoing issuer can stop creating new cash long before the last funded point is redeemed. The airline can own the loyalty brand while the bank owns or services the card portfolio. The program still owes points, and the airline still controls much of the high-value award inventory.',
        'The supplied American stress test is deliberately mechanical rather than a contractual DSCR calculation. Using $6.2 billion of 2025 partner cash and a visible peak quarterly debt-service proxy, gross coverage falls from 4.4× in the base case to 1.7× after a 60% partner-cash reduction. In that issuer-disruption case, modeled program cash contribution turns negative while the ending loyalty liability remains $7.82 billion.',
      ],
      table: {
        caption: 'Modeled partnership-loss scenario; pro forma outputs, not company guidance or contractual covenant calculations',
        columns: ['Scenario', 'Partner cash', 'Gross coverage proxy', 'Program cash contribution', 'Ending loyalty liability'],
        rows: [
          ['Base', '$6.20B', '4.4×', '$3.30B', '$11.07B'],
          ['Recession', '$4.96B', '3.5×', '$1.79B', '$9.79B'],
          ['Severe spend shock', '$3.72B', '2.6×', '$0.50B', '$8.82B'],
          ['Issuer disruption', '$2.48B', '1.7×', '−$0.82B', '$7.82B'],
          ['Near-termination', '$1.86B', '1.3×', '−$1.58B', '$7.18B'],
        ],
      },
      figures: [
        {
          src: '/images/research/airline-loyalty-partner-stress.png',
          alt: 'Line chart showing a modeled American gross coverage proxy declining below a 2.0 times threshold between 40 and 60 percent partner-cash loss.',
          label: 'Figure 07 / Partnership-termination stress test',
          caption:
            'The coverage proxy crosses below 2.0× between a 40% and 60% loss of the $6.2 billion partner-cash anchor.',
          width: 2472,
          height: 1301,
        },
      ],
    },
    {
      id: 'profit-from-points',
      title: 'How much airline profit comes from points?',
      paragraphs: [
        'There is no defensible single percentage. American’s $6.2 billion of 2025 partner cash equaled 11.3% of operating revenue, but cash can be deferred. Its $3.511 billion of marketing-services revenue exceeded consolidated operating income, but a revenue line is not a profit share. Its $4.036 billion of award-travel revenue released prior contract liabilities rather than recording fresh bank cash.',
        'The 2021 financing presentation reported $2.911 billion of 2019 AAdvantage adjusted EBITDA and $3.145 billion of net cash from operations. Those are management-defined, pro forma program measures affected by intercompany mechanics. They are useful for financing analysis but do not isolate the consolidated counterfactual profit American would lose if AAdvantage disappeared.',
        'The point model translates the program cash bridge into $6.38 of expected contribution for each 1,000 points sold for $12. It should not be called profit from points. A full contribution model would need confidential issuer pricing, current allocation, flight and partner mix, route-level displacement, acquisition cost, benefits, incremental ticket demand, transfer pricing, breakage, and corporate overhead.',
      ],
      figures: [
        {
          src: '/images/research/airline-loyalty-profit-bridge.png',
          alt: 'Two-panel chart separating the 2019 AAdvantage pro forma cash bridge from four non-additive American 2025 cash, revenue, and operating-income measures.',
          label: 'Figure 08 / Profit-attribution bridge',
          caption:
            'Cash receipts, marketing revenue, deferred-revenue release, and consolidated operating profit answer different questions and cannot be added.',
          width: 2659,
          height: 1341,
        },
      ],
    },
    {
      id: 'airline-loyalty-financing-faq',
      title: 'Airline loyalty program financing questions, answered',
      paragraphs: [
        'The fastest way to analyze the system is to ask which clock, contract, and claimant a number belongs to. These direct answers preserve the distinctions used throughout the report.',
      ],
      table: {
        caption: 'Direct answers to the search questions this investigation is designed to resolve',
        columns: ['Question', 'Direct answer'],
        rows: [
          ['Airline loyalty program financing', 'A commercial partner first creates recurring cash. A separate secured structure can then pledge designated collections, contracts, accounts, reserves, loyalty IP, data rights, intercompany payments, and SPV equity to lenders.'],
          ['Airline loyalty-backed debt', 'Debt service, principal, and reserves are paid through controlled accounts before excess loyalty cash is released to the airline; coverage or reserve failures can trigger early amortization.'],
          ['How do airlines make money from loyalty programs?', 'Airlines sell a commercial bundle to banks and partners, recognize some consideration for current services, defer the award obligation, benefit from timing and breakage, and often fulfill awards below the member’s perceived value.'],
          ['Are airline miles a liability?', 'The airline records allocated consideration for expected future awards as a loyalty contract liability. Miles are not generally a fixed-dollar customer deposit and the liability is not conventional financial debt.'],
          ['Are airline loyalty programs worth more than airlines?', 'A gross loyalty-program enterprise value can exceed distressed airline equity while remaining below total airline enterprise value. The dates, definitions, and debt deductions must match before making the comparison.'],
          ['Airline loyalty program securitization', 'The pandemic-era structures isolated loyalty assets and cash paths in special-purpose entities, pledged controlled accounts and contracts, and imposed debt-service coverage, reserve, and early-amortization protections.'],
        ],
      },
    },
    {
      id: 'methodology',
      title: 'Methodology, labels, and evidence limits',
      paragraphs: [
        'The supplied executive memo, dossiers, governing financing documents, audited reports, quarterly filings, transaction materials, and reconstructed point model form the research record. Investor presentations are used only with their management-defined and pro forma labels.',
        'Reported [R] means directly disclosed in a filing, transaction document, or company record. Derived [D] means arithmetic using reported inputs. Estimated [E] is a model input or range used where public disclosure is unavailable. Inferred [I] is a stated conclusion from the evidence. Pro forma [PF] and management-defined [M] preserve the source’s non-audited or company-specific definition.',
        'The missing data are material: current net bank point prices, fixed payments, minimum purchases, escalators, termination thresholds, current breakage rates, route-level seat costs, displacement curves, partner reimbursement matrices, and exact current allocation percentages are not public in the supplied record. The model exposes those gaps rather than replacing them with false precision.',
      ],
      table: {
        caption: 'Evidence labels used throughout the supplied investigation',
        columns: ['Label', 'Meaning'],
        rows: [
          ['Reported [R]', 'Directly disclosed in an audited filing, transaction document, or company record'],
          ['Derived [D]', 'Arithmetic using reported inputs'],
          ['Estimated [E]', 'Model input or range used because public disclosure is unavailable'],
          ['Inferred [I]', 'Conclusion drawn from the interaction of disclosed facts and stated as an inference'],
          ['Pro forma [PF]', 'Scenario output or company presentation adjusted outside audited consolidated results'],
          ['Management-defined [M]', 'Company metric, valuation, or presentation definition that is not an independent market measure'],
        ],
      },
    },
  ],
  sources: [
    {
      label: 'American Airlines 2025 Form 10-K',
      href: 'https://www.sec.gov/Archives/edgar/data/6201/000119312526187124/d151029dars.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'American Airlines Form 10-Q for the quarter ended March 31, 2026',
      href: 'https://www.sec.gov/Archives/edgar/data/6201/000000620126000032/aal-20260331.htm',
      lastVerified: '2026.07.23',
    },
    {
      label: 'AAdvantage Financing Investor Presentation, March 2021',
      href: 'https://www.sec.gov/Archives/edgar/data/4515/000000620121000022/aainvestorpresentation.htm',
      lastVerified: '2026.07.23',
    },
    {
      label: 'AAdvantage 2021 Term Loan Credit Agreement',
      href: 'https://www.sec.gov/Archives/edgar/data/4515/000000620121000054/ex104q121aadvantagexcredit.htm',
      lastVerified: '2026.07.23',
    },
    {
      label: 'American Airlines 2019 Form 10-K',
      href: 'https://www.sec.gov/Archives/edgar/data/6201/000000620120000023/a10k123119.htm',
      lastVerified: '2026.07.23',
    },
    {
      label: 'American and Citi exclusive co-brand agreement announcement',
      href: 'https://americanairlines.gcs-web.com/static-files/aa971970-8330-4eb3-b7fb-97c6cd6060e9',
      lastVerified: '2026.07.23',
    },
    {
      label: 'AAdvantage terms and conditions',
      href: 'https://www.aa.com/i18n/aadvantage-program/aadvantage-terms-and-conditions.jsp',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Delta Air Lines 2025 Form 10-K',
      href: 'https://www.sec.gov/Archives/edgar/data/27904/000002790426000013/dal-20251231.htm',
      lastVerified: '2026.07.23',
    },
    {
      label: 'American Express 2025 Annual Report',
      href: 'https://www.sec.gov/Archives/edgar/data/4962/000110465926034161/tm265890d2_ars.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'United Airlines 2025 Form 10-K',
      href: 'https://www.sec.gov/Archives/edgar/data/319687/000010051726000023/ual-20251231.htm',
      lastVerified: '2026.07.23',
    },
    {
      label: 'United MileagePlus Financing Form 8-K and investor materials',
      href: 'https://www.sec.gov/Archives/edgar/data/100517/000110465920080673/tm2024018-1_8k.htm',
      lastVerified: '2026.07.23',
    },
    {
      label: 'United MileagePlus Credit Agreement',
      href: 'https://www.sec.gov/Archives/edgar/data/100517/000110465920080673/tm2024018d1_ex10-1.htm',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Air Canada Aeroplan acquisition accounting presentation',
      href: 'https://www.aircanada.com/content/dam/aircanada/portal/documents/PDF/speeches-presentations/en/Aeroplan-Acquisition-en.pdf',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Air Canada loyalty-program transition announcement',
      href: 'https://www.newswire.ca/news-releases/air-canada-to-launch-its-own-loyalty-program-in-2020-621967683.html',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Aimia and Air Canada definitive Aeroplan sale agreement',
      href: 'https://www.aimia.com/aimia-and-air-canada-enter-into-definitive-agreement-for-purchase-of-the-aeroplan-loyalty-business/',
      lastVerified: '2026.07.23',
    },
    {
      label: 'Air Canada 2020 Annual Report',
      href: 'https://www.aircanada.com/content/dam/aircanada/portal/documents/PDF/en/annual-report/2020_ar.pdf',
      lastVerified: '2026.07.23',
    },
  ],
  indexable: true,
};
