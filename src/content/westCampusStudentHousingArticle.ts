import type { ResearchArticle } from './articleModels';

export const WEST_CAMPUS_STUDENT_HOUSING_ARTICLE_SLUG = 'west-campus-student-housing';
export const WEST_CAMPUS_STUDENT_HOUSING_ARTICLE_PATH =
  `/research/financial-systems/${WEST_CAMPUS_STUDENT_HOUSING_ARTICLE_SLUG}`;

export const WEST_CAMPUS_STUDENT_HOUSING_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: WEST_CAMPUS_STUDENT_HOUSING_ARTICLE_SLUG,
  number: '16',
  category: 'FINANCIAL SYSTEMS',
  title: 'Who Owns West Campus Student Housing?',
  seoTitle: 'West Campus Student Housing: Ownership and Returns',
  subtitle:
    'The captive economics of student housing around the University of Texas at Austin, traced from one student installment through property operations, capital structure, and first loss.',
  seoDescription:
    'A six-property West Campus analysis of student lease lock-in, ownership, NOI, basis, refinancing risk, and who absorbs losses.',
  artwork: {
    kind: 'image',
    heroSrc: '/images/research/west-campus-reader-hero.jpg',
    socialSrc: '/images/research/west-campus-social.jpg',
    alt: 'Editorial architectural model connecting West Campus apartment blocks, the UT Austin campus edge, and layered property-finance flows.',
    label: 'West Campus housing / ownership and capital stack',
    caption:
      'The editorial system separates location, operations, debt, and equity; the article’s linked model and figures carry the property-specific evidence.',
    objectPosition: '50% 50%',
  },
  date: '2026.07.22',
  lastVerified: '2026.07.22',
  readTime: '21 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'The evidence supports a real location and service premium before a lease is signed and substantial contractual lock-in afterward. It does not support a simple monopoly story or one excess-return claim for every owner: service mix, acquisition basis, capital structure, concessions, and refinancing exposure determine who keeps the rent dollar and who absorbs a loss.',
  conclusion: {
    title: 'Contractual lock-in is clearer than monopoly',
    content:
      'The evidence supports a real location and service premium before signing and much stronger bargaining constraints afterward. Owner returns still turn on basis, capital structure, concessions, and refinancing, so the same rent dollar can produce very different equity outcomes.',
  },
  evidenceBoundary:
    'This web edition reformats the supplied July 2026 report, analytical memo, workbook, and claims appendix. The six-property sample is not a complete market inventory, so it cannot support a West Campus concentration ratio. Only SkyLoft has a disclosed property-level mortgage stack in the package; current debt for the other five properties is illustrative. Normalized NOI, values, returns, and stress outcomes are model outputs rather than audited property results, realized sponsor returns, appraisals, or forecasts. The linked public sources were not independently refreshed for this publication.',
  metrics: [
    { label: 'Modeled sample', value: '4,805 BEDS' },
    { label: 'Modeled NOI margins', value: '46.0%–61.5%' },
    { label: 'Modeled levered IRRs', value: '–10.3%–25.5%' },
    { label: 'Largest stress paydown', value: '$46.3M' },
  ],
  resources: [
    {
      label: 'Full investigative report',
      href: '/research/west-campus-investigative-report.pdf',
      description: 'The complete 16-page article, exhibits, source notes, and assumption boundaries.',
      format: 'PDF',
    },
    {
      label: 'Editable investigative report',
      href: '/research/west-campus-investigative-report.docx',
      description: 'The supplied editable report used as the primary source for this web edition.',
      format: 'DOCX',
    },
    {
      label: 'Executive analytical memo',
      href: '/research/west-campus-executive-analytical-memo.docx',
      description: 'A concise decision memo separating supported findings, model outputs, and unresolved evidence.',
      format: 'DOCX',
    },
    {
      label: 'Six-property financial model',
      href: '/research/west-campus-property-models.xlsx',
      description: 'The 17-sheet model covering sources, assumptions, property statements, scenarios, student cost, zoning, and loss allocation.',
      format: 'XLSX',
    },
    {
      label: 'Dossiers, methodology, and claims',
      href: '/research/west-campus-dossiers-methodology-claims.docx',
      description: 'Property dossiers, source ledger, claims matrix, counter-evidence, and methodology notes.',
      format: 'DOCX',
    },
  ],
  content: [
    'At The Callaway House, $1,959 is not quite monthly rent. It is one of ten equal installments on a school-year obligation. Furniture, meals, utilities, internet, housekeeping, and amenities sit inside the bundle; parking and required liability coverage sit outside it. Unless a student can show income above three times the installment, a guarantor is required. The entry obligation is therefore $19,590 before parking and insurance, and a parent often signs behind the same number.',
    'Following that payment through the building changes the story. Callaway produces the highest modeled effective gross income in the six-property sample, but its service-heavy operation also produces the lowest modeled NOI margin. SkyLoft shows the opposite capital problem: a strong property margin can leave almost no cash for common equity after whole-loan interest, preferred current pay, and reserves. At 26 West, an older acquisition basis creates the largest modeled return even though its student-facing product is not the most expensive.',
    'The useful conclusion is narrower than “students are captive” or “owners are profiteering.” Before signing, students can compare university housing, cooperatives, older apartments, shared bedrooms, and commute-based alternatives. After signing, a guaranty, full-term obligation, controlled relet process, and early cancellation deadlines materially change bargaining power. The evidence is strongest for post-signing lock-in and weakest for a market-wide monopoly claim.',
  ],
  sections: [
    {
      id: 'installment-contract',
      title: 'A lease that is not quite monthly rent',
      paragraphs: [
        'Individual-bed leasing solves a real roommate problem: one resident is generally not liable for another resident\'s unpaid rent. It also turns each bedroom, bathroom arrangement, view, and floor premium into its own revenue unit. The amount shown on a property website may describe one installment, one contracted month, or one academic-use month. Those are different denominators.',
        'The comparison is clearest at 2400 Nueces. Its 12-month 4×4 rate has the lower advertised installment, but the nine-month contract costs $2,703 less in total and is cheaper for a student who only values the academic year. Callaway\'s ten-installment structure is more expensive, but it also includes food, housekeeping, utilities, internet, and furnishings. A price comparison that ignores term and service mix overstates precision.',
        'Reletting terms create the sharper boundary. The archived Torre lease required full-term rent whether the unit was occupied or not and imposed a reletting fee. Callaway places the replacement burden on the resident after defined deadlines. A guarantor or prepayment requirement can make a signed obligation more collectible; it does not make an unsigned bed generate rent.',
      ],
      table: {
        caption: 'Representative student cost under different contract denominators',
        columns: ['Product', 'Advertised installment', 'Installments', 'Contract total', 'Effective / contracted month', 'Per academic-use month', 'Interpretation'],
        rows: [
          ['2400 Nueces 4×4, 12-month', '$1,141', '12', '$13,792', '$1,149', '$1,532', 'Lower sticker; includes summer cost for a nine-month user'],
          ['2400 Nueces 4×4, 9-month', '$1,221', '9', '$11,089', '$1,232', '$1,232', 'Higher installment; lower total obligation'],
          ['Callaway entry private-dorm rate', '$1,959', '10', '$19,590', '$1,959', '$2,062', 'Meals and service bundle included; parking and insurance extra'],
          ['College Houses private room control', '$955', '9', '$8,595', '$955', '$955', 'Lower-cost academic-term cooperative control'],
        ],
      },
    },
    {
      id: 'six-properties',
      title: 'Six buildings, 4,805 beds, and several kinds of capital',
      paragraphs: [
        'The sample was chosen for the quality of the available ownership and financing evidence. SkyLoft exposes a 2019 securitized mortgage and preferred-equity stack. 2400 Nueces records a private ground-lease development followed by a university purchase. Waterloo connects a 0.45-acre site, a density bonus, a 796-bed tower, and a sale to Global Student Accommodation. The Standard shows construction debt followed by a recapitalization. Callaway provides a service-heavy private-dorm product. 26 West supplies an older asset with a reported acquisition price.',
        'The manager collecting rent is not necessarily the real-estate owner. The fee owner may sit in a special-purpose borrower; a master tenant may operate under another entity; the mortgage can be divided into senior and subordinate notes; and preferred capital can hold intervention rights before it suffers a complete economic loss. The leasing-office brand is only the first name in the chain.',
        'The sample also cannot prove market concentration. American Campus Communities, now part of Blackstone, and Landmark each control multiple properties, while UT, Global Student Accommodation, and the SkyLoft borrower represent other forms of ownership. Unresolved parcel entities and bed counts make a precise concentration ratio indefensible.',
      ],
      figures: [
        {
          src: '/images/research/west-campus-properties-map.png',
          alt: 'Schematic street-grid map locating Callaway, SkyLoft, 2400 Nueces, Waterloo, The Standard, and 26 West along the western edge of the UT Austin campus.',
          label: 'Study map / six-property evidence sample',
          caption:
            'The map is schematic rather than parcel-accurate. The sample was selected for evidence quality and is not a complete West Campus inventory.',
          width: 1786,
          height: 1305,
        },
      ],
      table: {
        caption: 'Ownership and operating structure in the modeled sample',
        columns: ['Property', 'Beds', 'Owner / sponsor', 'Manager / brand', 'Evidence status'],
        rows: [
          ['SkyLoft', '674', 'NP Skyloft, DST at 2019 origination; current control unresolved', 'SkyLoft brand; NP Skyloft Leaseco at origination', 'High for 2019; incomplete currently'],
          ['2400 Nueces', '622', 'Board of Regents of The University of Texas System', 'UT University Housing and Dining', 'High purchase evidence; asset debt allocation unresolved'],
          ['Waterloo', '796', 'Global Student Accommodation', 'Yugo Austin Waterloo', 'High sale chronology; low current debt and basis precision'],
          ['The Standard', '934', 'Landmark Properties', 'Landmark Properties', 'High sponsor evidence; recap balance and maturity undisclosed'],
          ['Callaway', '753', 'American Campus Communities / Blackstone platform', 'American Campus Communities', 'High sponsor and revenue evidence; low basis and debt precision'],
          ['26 West', '1,026', 'American Campus Communities / Blackstone platform', 'American Campus Communities', 'High acquisition evidence; current debt unresolved'],
        ],
      },
    },
    {
      id: 'property-statement',
      title: 'High property margins are not high owner returns',
      paragraphs: [
        'The workbook builds normalized property statements by reducing face rent for structural vacancy, unleased beds, bad debt, and concessions; adding fees, parking, reimbursements, retail, and administrative income; and deducting taxes, insurance, payroll, repairs, utilities, security, cleaning, turnover, marketing, management, and reserves. Only SkyLoft\'s 2019 operating statement is directly reported. The six current cases are modeled from public physical data, asking rates, concessions, and documented expense controls.',
        'Five properties produce modeled NOI margins between 58.4% and 61.5%. Callaway produces 46.0% because food, housekeeping, utilities, payroll, and contracted services lift expense per bed to roughly $12,725, versus about $6,300 to $6,800 at the other properties. The student-facing price is highest there, but a smaller share becomes property NOI.',
        'The gap widens below NOI. Debt service, preferred returns, replacement reserves, refinancing constraints, taxes at ownership entities, and nonrecurring capital separate property performance from common-equity performance. The modeled levered IRRs span from negative 10.3% at SkyLoft to 25.5% at 26 West. Those are normalized scenarios, not realized sponsor statements.',
      ],
      figures: [
        {
          src: '/images/research/west-campus-noi-margin.png',
          alt: 'Bar chart comparing modeled NOI per bed and NOI margins across SkyLoft, 2400 Nueces, Waterloo, The Standard, Callaway, and 26 West.',
          label: 'Figure 01 / property economics',
          caption:
            'Callaway has the highest service burden and the lowest modeled NOI margin; the other five cases cluster near 58% to 62%.',
          width: 1853,
          height: 1040,
        },
      ],
      table: {
        caption: 'Normalized property economics and combined-stress refinancing test',
        columns: ['Property', 'Effective gross income', 'NOI', 'NOI margin', 'Modeled levered IRR', 'Combined-stress refi paydown', 'Capital-structure boundary'],
        rows: [
          ['SkyLoft', '$10.35M', '$6.12M', '59.1%', '–10.3%', '$38.1M', '2019 whole loan and preferred stack disclosed'],
          ['2400 Nueces', '$9.48M', '$5.54M', '58.4%', '17.6%', '$7.8M', 'Actual purchase; debt allocation illustrative'],
          ['Waterloo', '$13.99M', '$8.60M', '61.5%', '8.3%', '$41.6M', 'Owner known; current debt illustrative'],
          ['The Standard', '$15.44M', '$9.39M', '60.8%', '10.6%', '$46.3M', 'Recap known; current balance illustrative'],
          ['Callaway', '$17.74M', '$8.15M', '46.0%', '13.0%', '$26.3M', 'Platform ownership known; debt and basis illustrative'],
          ['26 West', '$17.24M', '$10.60M', '61.4%', '25.5%', '$0.0M', 'Actual 2011 purchase; current debt illustrative'],
        ],
      },
    },
    {
      id: 'skyloft-stack',
      title: 'SkyLoft: a strong building statement and a weak common position',
      paragraphs: [
        'NP Skyloft, DST acquired the 212-unit, 674-bed tower for $119.55 million. Disclosed uses, including reserves and closing costs, totaled about $124.37 million. A $66.125 million whole mortgage sat above the property: $36 million of senior notes and a $30.125 million subordinate companion note. A $35 million preferred-equity position sat above common sponsor capital.',
        'The preferred security earned a 14% return—8% current pay and 6% accrual—and held change-of-control and loan-purchase rights under a recognition agreement. The mortgage itself appeared conservative at origination, but its reported LTV and DSCR did not treat the preferred claim as property debt.',
        'At normalized NOI of $6.12 million, whole-loan interest consumes about $2.94 million, preferred current pay consumes $2.8 million, and replacement reserves consume about $202,000. Approximately $171,000 remains for common equity before ownership-level costs and taxes. The central modeled value of $87.4 million covers the mortgage but not the mortgage plus preferred principal. Common equity is out of the money, and the preferred layer is impaired before accrued return.',
        'Later surveillance matters. Fitch reported a March 2024 transfer to special servicing and 42% occupancy as of March 2025. A current leasing page can coexist with unresolved capital distress: the building may remain open while the control and recovery waterfall change around it.',
      ],
      figures: [
        {
          src: '/images/research/west-campus-capital-stack.png',
          alt: 'Stacked horizontal chart comparing SkyLoft disclosed senior debt, subordinate mortgage, preferred equity, and common equity with illustrative debt and residual equity at five other West Campus properties.',
          label: 'Figure 02 / disclosed versus illustrative capital',
          caption:
            'SkyLoft is the only property with a disclosed current-loan stack in the package. Non-SkyLoft balances are analytical cases, not reported current debt.',
          width: 1853,
          height: 1171,
        },
      ],
      table: {
        caption: 'SkyLoft disclosed 2019 capital layers',
        columns: ['Layer', 'Amount', 'Economic position', 'Key term or right'],
        rows: [
          ['Senior mortgage notes', '$36.0M', 'Last property debt layer to lose value', 'Part of 120-month interest-only whole loan'],
          ['Subordinate companion note', '$30.125M', 'Impaired after junior capital and before senior notes', 'Part of the same $66.125M whole loan'],
          ['Preferred equity', '$35.0M', 'Ahead of common economically', '14% return; control and loan-purchase rights'],
          ['Implied common sponsor capital', '$23.24M', 'First capital layer to lose residual value', 'Derived from disclosed total uses'],
        ],
      },
    },
    {
      id: 'public-and-entitlement',
      title: '2400 Nueces and Waterloo reveal two different premiums',
      paragraphs: [
        '2400 Nueces is a useful control precisely because it is not a clean private-market comparable. The UT System bought the leasehold estate and improvements for $74.759 million in 2018. University ownership changes taxes, governance, lease terms, and the required guarantor. The model assumes no property-tax expense and produces $5.54 million of NOI. Its 17.6% modeled levered IRR depends on an illustrative bond allocation, so the purchase price is established while the asset-level financing is not.',
        'For students, the more important control is contract flexibility. Both nine- and 12-month products are published. The higher nine-month installment can still produce the lower academic-year cost. Proximity therefore does not require the same annual private-tower obligation.',
        'Waterloo turns land-use entitlement into a development calculation. LV Collective acquired a 0.45-acre site, used a November 2019 density-bonus amendment to support a 300-foot, 796-bed tower with an affordable set-aside, delivered it in 2022, and sold it to Global Student Accommodation. The sale price and full budget were not disclosed, so the workbook reconstructs a central $155 million development cost rather than presenting one invented transaction number.',
        'At $9.5 million of stabilized NOI, the central yield on cost is 6.13%. A 5.50% exit cap implies $172.7 million of value and $17.7 million of development profit. That 63-basis-point spread is thin: a 50-basis-point exit-cap increase cuts profit to $3.3 million, one month of effective concessions makes it slightly negative, and the combined cost, leasing, and exit shock produces a modeled $43.6 million loss.',
      ],
      figures: [
        {
          src: '/images/research/waterloo-development-stress.png',
          alt: 'Horizontal sensitivity chart showing Waterloo modeled development profit under base, construction-cost, delay, occupancy, concession, expense, exit-cap, and combined-stress cases.',
          label: 'Figure 03 / Waterloo development stress',
          caption:
            'The central spread is positive but small relative to construction, lease-up, and exit-cap risk; the cases are imposed sensitivities, not forecasts.',
          width: 2066,
          height: 1127,
        },
        {
          src: '/images/research/waterloo-residual-land-value.png',
          alt: 'Bar chart comparing modeled Waterloo residual land value under a 225-foot acquisition proxy and the 300-foot density-bonus entitlement.',
          label: 'Figure 04 / entitlement value',
          caption:
            'The modeled residual-land increment is about $9.7 million. It is a volumetric proxy, not an appraisal or a claim that zoning explains all appreciation.',
          width: 1699,
          height: 974,
        },
      ],
    },
    {
      id: 'basis-divides-outcomes',
      title: 'The Standard, Callaway, and 26 West make basis the divider',
      paragraphs: [
        'The Standard shows how a high-margin tower can sit close to a financing threshold. Landmark completed the 934-bed property after a reported $101.1 million construction loan and retained ownership in a 2023 recapitalization. The recap balance, rate, and maturity were not disclosed, so the workbook uses a $95 million illustrative current balance. Under the combined stress, the model requires the largest paydown in the sample: $46.3 million.',
        'Callaway reaches similar NOI with a different statement. Its $17.74 million of effective gross income is the sample high, but $9.58 million of expense leaves $8.15 million of NOI. At an illustrative central basis and 50% leverage, the ten-year common IRR is 13.0%. A student can face an expensive, difficult-to-exit contract while the owner earns an ordinary modeled return for a service-heavy asset. Both can be true.',
        '26 West is the low-basis case. American Campus Communities bought the 1,026-bed property for $86.2 million in 2011. The current normalized statement produces $10.60 million of NOI and a central value of $176.6 million. Its 25.5% modeled levered IRR is the sample high because the acquisition basis is far below current replacement economics. It is not a realized sponsor return: current debt, major capital improvements, capital calls, and historical distributions remain unresolved.',
      ],
      bullets: [
        'The Standard: strong operations can still face a large refinancing gap if recapitalization debt is high.',
        'Callaway: the highest student-facing bundle also carries the largest modeled operating cost per bed.',
        '26 West: the oldest reported acquisition basis preserves the largest modeled equity cushion.',
        'Rent practices alone do not rank owner returns.',
      ],
    },
    {
      id: 'premium-and-preleasing',
      title: 'The premium is real; its cause is not singular',
      paragraphs: [
        'Premium West Campus beds cost more than imperfect substitutes. The model\'s central bridge starts with an $850 conventional split-housing control, then assigns value to walk-to-campus location, furnishings and internet, individual liability, new construction and amenities, and room or bathroom privacy. About $100 per month remains unexplained in the central case. The ranges are broad and are not a hedonic regression, so the residual cannot simply be labeled market power.',
        'Location is genuinely scarce. UT reported 55,000 students in fall 2025, and university beds cover only part of that population. Walking distance, roommate matching, individual liability, furnishings, privacy, and amenities have economic value. At the same time, a leasing cycle that begins months before move-in, parental guarantees, fear of losing a layout, and costly relets weaken bargaining power.',
        'Late-cycle discounts complicate the scarcity message. Rise, Rambler, and The Standard have used concessions even while marketing urgency. Those pages show sales pressure rather than inventory truth. Executed lease files, weekly remaining inventory, and property-level concession histories would be needed to measure the premium cleanly.',
        'Preleasing is valuable because it converts future demand into signed paper, but points from different years do not form one market curve. SkyLoft was 100% leased in its January 2019 file and only 42% occupied in March 2025 surveillance. A strong early rent roll can reduce one year\'s lease-up uncertainty without immunizing the property from later demand, management, reputation, or capital problems.',
      ],
      figures: [
        {
          src: '/images/research/west-campus-prelease-points.png',
          alt: 'Scatter plot of reported prelease observations for Callaway, 26 West, Waterloo, and SkyLoft across different academic years and months before move-in.',
          label: 'Figure 05 / reported prelease points',
          caption:
            'The observations are strong but belong to different academic years; they cannot be pooled into one continuous leasing curve.',
          width: 1853,
          height: 1039,
        },
      ],
    },
    {
      id: 'what-breaks',
      title: 'What breaks first under combined stress',
      paragraphs: [
        'The combined model applies a 4% rent cut, seven points of occupancy loss, one additional month of concessions, 10% higher taxes, 20% higher insurance, 8% higher payroll and repairs, $500 per bed of replacement spending, a 75-basis-point cap-rate increase, and refinancing 200 basis points above the base rate. It is intentionally severe and internally linked, but it is not a forecast of West Campus.',
        'SkyLoft begins with the least common-equity protection. NOI falls from $6.12 million to $3.94 million, cash flow to common turns negative, and implied value falls to $50.9 million—below the $66.125 million whole mortgage. Common and preferred capital are wiped in the model, and part of the subordinate note lacks value coverage.',
        'The Standard, Waterloo, and Callaway remain capable of producing positive property NOI while facing large modeled refinancing paydowns. That distinction is central: an occupied building can remain cash-flow positive while the existing owner cannot refinance the old balance. The next step may be an equity contribution, preferred capital, an extension, a sale, or a transfer of control.',
      ],
      figures: [
        {
          src: '/images/research/west-campus-equity-stress.png',
          alt: 'Grouped bar chart comparing modeled base equity value and combined-stress equity value for six West Campus properties.',
          label: 'Figure 06 / equity under stress',
          caption:
            'Base and one-year combined-stress equity values are scenario outputs, not IRRs. Non-SkyLoft leverage remains illustrative.',
          width: 1853,
          height: 1040,
        },
      ],
      table: {
        caption: 'Modeled refinancing gap under the combined stress',
        columns: ['Property', 'Base NOI', 'Combined-stress value', 'Modeled refi paydown', 'Interpretation'],
        rows: [
          ['SkyLoft', '$6.12M', '$50.9M', '$38.1M', 'Value falls below disclosed whole mortgage'],
          ['2400 Nueces', '$5.54M', '$62.3M', '$7.8M', 'Uses illustrative bond allocation; public support differs'],
          ['Waterloo', '$8.60M', '$91.1M', '$41.6M', 'Positive NOI does not preserve old illustrative balance'],
          ['The Standard', '$9.39M', '$91.9M', '$46.3M', 'Largest modeled paydown in sample'],
          ['Callaway', '$8.15M', '$67.9M', '$26.3M', 'Service-heavy expense base amplifies stress'],
          ['26 West', '$10.60M', '$104.7M', '$0.0M', 'Lower modeled leverage preserves refinance room'],
        ],
      },
    },
    {
      id: 'loss-allocation',
      title: 'Who absorbs the first loss',
      paragraphs: [
        'A tenant or guarantor absorbs only a signed obligation. They do not cover vacant beds elsewhere in the building. Unleased inventory first reduces property cash flow through lost rent and added concessions. That operating shortfall then reaches common sponsor equity through lower distributions and lower value.',
        'Preferred equity follows economically, although contractual control can move before the preferred principal is fully lost. Mezzanine and subordinate mortgage debt follow according to their documents. Senior mortgage debt is last at the property level. Reserves, enforcement costs, guarantees, and claim timing can alter recovery, but the order is set by contracts rather than the consumer brand.',
        'At SkyLoft\'s central modeled value of $87.4 million, the whole mortgage remains covered while common equity is zero and the $35 million preferred principal is partly impaired. At the $50.9 million combined-stress value, common and preferred capital are gone and roughly $15.2 million of the subordinate mortgage lacks value coverage, while the $36 million senior balance remains covered.',
      ],
      bullets: [
        'Signed tenant or guarantor: liable only for the executed lease, not speculative vacancy.',
        'Property operating cash flow: first place where vacancy, bad debt, and concessions appear.',
        'Common sponsor equity: first capital layer to lose residual value.',
        'Preferred equity: next economic loss layer, often with earlier intervention rights.',
        'Mezzanine or subordinate mortgage debt: impaired after junior capital according to contract priority.',
        'Senior mortgage: last property-level claim to absorb the remaining shortfall.',
      ],
    },
    {
      id: 'unknowns',
      title: 'What the evidence still cannot answer',
      paragraphs: [
        'The package is unusually detailed for a public property study, but several decisions remain outside its evidence boundary. Current property-level debt, rates, maturities, guarantees, and reserves are unresolved for five of the six properties. Waterloo\'s sale price and full development budget are undisclosed. Property-level executed leases, bad-debt histories, remaining inventory, and realized concessions are unavailable.',
        'Those gaps prevent a clean concentration ratio, a market-wide rent regression, a realized sponsor-return comparison, and a definitive ranking of refinancing risk. Filling them would require deed and UCC work, lender or sponsor disclosure, weekly lease-up files, executed-lease samples, property-level operating statements, and a complete bed and pipeline denominator.',
        'The most supportable finding survives those unknowns. West Campus combines scarce location, differentiated services, individual-bed pricing, early leasing, and hard-to-exit signed obligations. Property margins can be high, but owner outcomes still depend on basis and capital structure. The same collectible rent dollar can support an ordinary return at one building, a large return at another, and almost no common cash flow at a third.',
      ],
      bullets: [
        'Do not report a market concentration ratio from this six-property evidence sample.',
        'Do not present illustrative non-SkyLoft debt as current reported borrowing.',
        'Do not treat normalized or stress-case IRRs as realized sponsor returns.',
        'Do not assign the unexplained rent premium to market power without executed-lease and inventory evidence.',
        'Do not treat a guarantor as protection against beds that were never leased.',
      ],
    },
  ],
  sources: [
    {
      label: 'West Campus investigative report',
      href: '/research/west-campus-investigative-report.pdf',
      lastVerified: '2026.07.22',
    },
    {
      label: 'West Campus six-property financial model',
      href: '/research/west-campus-property-models.xlsx',
      lastVerified: '2026.07.22',
    },
    {
      label: 'West Campus dossiers, methodology, and claims matrix',
      href: '/research/west-campus-dossiers-methodology-claims.docx',
      lastVerified: '2026.07.22',
    },
    {
      label: 'SkyLoft UBS 2019-C16 collateral term sheet — SEC',
      href: 'https://www.sec.gov/Archives/edgar/data/1532799/000153949719000414/n1550_x2-ts.htm',
    },
    {
      label: 'Fitch surveillance for UBS 2019-C16',
      href: 'https://www.fitchratings.com/research/structured-finance/fitch-downgrades-ubs-2019-c16-27-08-2025',
    },
    {
      label: '2400 Nueces rates — UT University Housing and Dining',
      href: 'https://housing.utexas.edu/housing/2400-nueces-apartments/2400-nueces-rates',
    },
    {
      label: 'UT System Board of Regents meeting minutes — July 11, 2018',
      href: 'https://www.utsystem.edu/sites/default/files/offices/board-of-regents/board-meetings/board-minutes/7-11-2018Meeting1181.pdf',
    },
    {
      label: 'Waterloo development case study — LV Collective',
      href: 'https://lvcollective.com/work/waterloo/',
    },
    {
      label: 'Waterloo acquisition report — REBusinessOnline',
      href: 'https://rebusinessonline.com/gsa-acquires-796-bed-student-housing-community-near-ut-austin-2/',
    },
    {
      label: 'The Standard recapitalization — TSB Capital Advisors',
      href: 'https://tsbca.com/tsb-capital-advisors-arranges-debt-for-the-recapitalization-of-the-standard-at-austin/',
    },
    {
      label: 'American Campus Communities 2021 Form 10-K — SEC',
      href: 'https://www.sec.gov/Archives/edgar/data/1283630/000128363022000031/acc-20211231.htm',
    },
    {
      label: '26 West property and current pricing — American Campus Communities',
      href: 'https://www.americancampus.com/student-apartments/tx/austin/26-west',
    },
    {
      label: 'University Neighborhood Overlay Program — City of Austin',
      href: 'https://www.austintexas.gov/planning/university-neighborhood-overlay-program',
    },
  ],
};
