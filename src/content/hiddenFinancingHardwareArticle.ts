import type { ResearchArticle } from './articleModels';

export const HIDDEN_FINANCING_HARDWARE_ARTICLE_SLUG = 'hidden-financing-hardware-startups';
export const HIDDEN_FINANCING_HARDWARE_ARTICLE_PATH =
  `/research/financial-systems/${HIDDEN_FINANCING_HARDWARE_ARTICLE_SLUG}`;

export const HIDDEN_FINANCING_HARDWARE_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: HIDDEN_FINANCING_HARDWARE_ARTICLE_SLUG,
  aliases: ['/markets/hidden-financing-hardware-startups'],
  number: '16',
  category: 'FINANCIAL SYSTEMS',
  title: 'Hardware Startup Financing: Five Capital Stacks',
  seoTitle: 'Hardware Startup Financing: Five Capital Stacks',
  subtitle:
    'How hardware startup financing combines venture equity, equipment finance, asset-backed debt, leases, customer capital, public support, and project finance across five companies.',
  seoDescription:
    'Hardware startup financing compared across five capital stacks: equity, equipment finance, asset debt, customer capital, public support, and project debt.',
  artwork: {
    kind: 'image',
    heroSrc: '/images/research/hidden-hardware-financing-reader-hero.webp',
    socialSrc: '/images/research/hidden-hardware-financing-social.jpg',
    alt: 'A monochrome hardware platform stacked above equity, secured finance, leases, logistics, and public-capital foundations.',
    label: 'Comparative investigation / five capital stacks',
    caption:
      'The hidden stack is the operating system beneath the hardware: corporate capital sits beside secured asset finance, leases, customer funding, and public support rather than replacing them.',
    objectPosition: '50% 48%',
  },
  date: '2026.07.22',
  lastVerified: '2026.07.22',
  readTime: '28 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'The venture round is only the corporate layer of a hardware startup. The economic outcome is set by the asset layer and the adjacent support layer: who owns the equipment, which cash flow services it, what recourse survives a shortfall, and who holds the asset after demand or technology disappoints.',
  conclusion: {
    title: 'Follow the asset burden past the funding headline',
    content:
      'Financing can reduce immediate equity needs while leaving purchase commitments, fixed payments, guarantees, replacement obligations, and residual risk inside the operating system. The decisive diligence starts with asset title, liens, recourse, cash-flow coverage, and recovery value.',
  },
  evidenceBoundary:
    'This web edition reformats the supplied July 22, 2026 report, workbook, and capital-stack diagrams. The underlying sources were not independently refreshed for publication. Reported values retain the source package’s evidence cutoff; modeled values are analytical scenarios, not company guidance, appraisals, forecasts, covenant calculations, or investment recommendations. A missing quantified instrument means the package did not establish it, not that the instrument cannot exist.',
  metrics: [
    { label: 'Financing archetypes', value: '5' },
    { label: 'Visible Waymo equity, 2024 + 2026', value: '$21.6B' },
    { label: 'CoreWeave FY2025 debt principal', value: '$21.615B' },
    { label: 'Modeled Northvolt residual exposure', value: '$4.4B' },
  ],
  resources: [
    {
      label: 'Full comparative report',
      href: '/research/hidden-financing-report.pdf',
      description: 'The complete 19-page investigation, including methodology, findings hierarchy, appendices, and source register.',
      format: 'PDF',
    },
    {
      label: 'Editable comparative report',
      href: '/research/hidden-financing-report.docx',
      description: 'The supplied editable report used as the source document for this web edition.',
      format: 'DOCX',
    },
    {
      label: 'Comparative financing model',
      href: '/research/hidden-financing-model.xlsx',
      description: 'The 29-sheet evidence ledger, assumption book, company comparison, scenarios, waterfalls, and findings workbook.',
      format: 'XLSX',
    },
    {
      label: 'Capital-stack diagram package',
      href: '/research/capital-stack-diagrams.zip',
      description: 'The original full-resolution PNG and Graphviz DOT files for all five company capital stacks.',
      format: 'ZIP',
    },
    {
      label: 'Waymo capital stack',
      href: '/images/research/hidden-financing-waymo-capital-stack.png',
      description: 'Full-resolution parent-funded platform diagram.',
      format: 'PNG',
    },
    {
      label: 'Serve Robotics capital stack',
      href: '/images/research/hidden-financing-serve-capital-stack.png',
      description: 'Full-resolution equity, equipment-financing, and supplier-warrant diagram.',
      format: 'PNG',
    },
    {
      label: 'CoreWeave capital stack',
      href: '/images/research/hidden-financing-coreweave-capital-stack.png',
      description: 'Full-resolution secured-debt, lease, and customer-prepayment diagram.',
      format: 'PNG',
    },
    {
      label: 'Anduril capital stack',
      href: '/images/research/hidden-financing-anduril-capital-stack.png',
      description: 'Full-resolution equity, customer-contract, and public-support diagram.',
      format: 'PNG',
    },
    {
      label: 'Northvolt capital stack',
      href: '/images/research/hidden-financing-northvolt-capital-stack.png',
      description: 'Full-resolution equity, project-debt, offtake, public-support, and distress diagram.',
      format: 'PNG',
    },
  ],
  content: [
    'Hardware startup financing usually combines corporate equity or debt, asset-level financing, and adjacent support from customers, suppliers, governments, or a parent company. Hardware companies can resemble software companies in a fundraising headline and infrastructure projects in a liquidation. The missing bridge is the financing stack: who paid for the vehicles, robots, accelerators, factories, tooling, inventory, and working capital before those assets produced enough cash to fund the next unit.',
    'The supplied report and workbook compare five structures. Waymo is a parent-funded platform; Serve Robotics is an equity-funded operator with secured equipment finance and a supplier warrant; CoreWeave is an asset-financed infrastructure operator with secured vehicles, leases, and customer prepayments; Anduril is a government-supported industrial company; and Northvolt is an offtake-backed, project-financed manufacturer whose distress makes the loss allocation visible.',
    'Across the cases, one rule holds: financing can reduce the sponsor’s immediate equity check without reducing the physical asset base. The cost, fixed claim, performance obligation, residual-value risk, or public-policy condition still belongs to someone. The analysis therefore tracks three stacks at once and follows each dollar through ownership, cash service, recourse, and downside.',
  ],
  sections: [
    {
      id: 'three-capital-stacks',
      title: 'Hardware startup financing has three capital stacks',
      paragraphs: [
        'The corporate stack is the visible one: founder shares, venture equity, strategic equity, parent contributions, corporate debt, and preferred claims. It tells us who funded the company and who owns the residual corporate value. It does not identify the owner of a robot, accelerator, factory tool, or depot improvement.',
        'The asset stack finances the installed base. It includes equipment debt, leases, asset-backed facilities, project debt, sale-leasebacks, and special-purpose vehicles. These instruments attach repayment and control rights to assets or their cash flow. They can extend capacity faster than corporate equity alone, but introduce fixed charges, collateral tests, reserves, covenants, foreclosure rights, and refinancing exposure.',
        'The adjacent-support stack is easy to omit because it may not look like financing. Customer deposits and prepayments, public incentives, supplier terms, strategic warrants, parent services, minimum-volume commitments, and guarantees all reduce or defer the sponsor’s cash need. They also create obligations, dilution, clawbacks, concentration, or contingent recourse. A complete capital map places all three stacks beside the physical assets they support.',
      ],
      table: {
        caption: 'The three layers required to understand a hardware financing structure',
        columns: ['Layer', 'Typical providers', 'What it funds', 'Primary claim', 'Key diligence question'],
        rows: [
          ['Corporate capital', 'Founders, venture funds, strategic investors, parent, corporate lenders', 'Platform, payroll, R&D, losses, general capex', 'Company equity or corporate cash flow', 'How much capital entered the company, and with what priority?'],
          ['Asset capital', 'Equipment lenders, lessors, banks, ABS or project investors, SPVs', 'Vehicles, robots, compute, factories, tooling, property', 'Asset cash flow, collateral, rent, or project waterfall', 'Who owns the asset and who can take it after default?'],
          ['Adjacent support', 'Customers, suppliers, governments, tax investors, parent entities', 'Working capital, capacity, construction, launch costs, risk buffers', 'Delivery, performance, warrants, policy compliance, guarantees', 'What economic obligation or contingent recourse accompanies the cash?'],
        ],
      },
    },
    {
      id: 'financing-mechanics',
      title: 'How asset financing for hardware startups moves risk',
      paragraphs: [
        'Every instrument answers the same underwriting questions. Who advances the money? Which entity owns the equipment? What cash flow services the claim? What happens when utilization falls? What covenants, guarantees, or performance duties remain? Who receives the asset and any deficiency claim after default?',
        'Debt and leases can lower upfront equity but replace a discretionary capital call with scheduled service. An SPV can isolate an asset pool only when the legal documents, collateral, cash waterfall, governance, and guarantees produce real separation. Customer capital can fund production, but it is paired with delivery, refund, uptime, or take-or-pay obligations. Public support lowers project cost only to the extent it is funded, collectible, retained after compliance, and not offset by a clawback or guarantee claim.',
        'Legal nonrecourse and economic nonrecourse are different. A parent can be outside the loan agreement yet remain the practical backstop because an asset is strategically essential, because a customer relationship would be damaged by abandonment, or because future financing depends on curing a troubled facility. Diligence must map both the written claim and the incentives that make support likely.',
      ],
      table: {
        caption: 'How common hardware-financing instruments move risk',
        columns: ['Instrument', 'Immediate benefit', 'Cash claim or obligation', 'Downside transfer test'],
        rows: [
          ['Parent or sponsor equity', 'No scheduled debt service', 'Full residual claim after other obligations', 'Parent absorbs burn, impairment, and opportunity cost'],
          ['Equipment debt', 'Matches borrowing to eligible assets', 'Principal, interest, reserves, and collateral tests', 'Recovery value and guarantees determine lender loss'],
          ['Lease or sale-leaseback', 'Reduces or recycles upfront cash', 'Fixed rent, return conditions, and possible residual support', 'Read deficiency, maintenance, and residual-guarantee terms'],
          ['Asset SPV or project finance', 'Ring-fences a financed asset pool', 'Contracted waterfall, covenants, and secured control', 'Test true separation, cross-defaults, and sponsor cures'],
          ['Customer deposit or prepayment', 'Funds capacity before delivery', 'Service, delivery, refund, or performance liability', 'Customer bears timing risk only within the contract'],
          ['Supplier terms or warrant', 'Defers cash and aligns a vendor', 'Payables, exclusivity, minimum purchases, or dilution', 'Supplier exposure may convert into price, control, or equity economics'],
          ['Grant, tax credit, or public loan', 'Lowers net project cost or cost of capital', 'Compliance, milestones, retention, or repayment', 'Count only funded, collectible, and retained support'],
        ],
      },
    },
    {
      id: 'waymo-parent-funded',
      title: 'Waymo: parent-funded platform',
      paragraphs: [
        'Waymo’s supplied evidence supports a high-equity, parent-backed structure. The 2024 and 2026 rounds total $21.6 billion of visible equity, and Alphabet supplied a significant majority of the 2026 round. That gives Waymo a patient corporate backstop and removes the visible refinancing calendar that would accompany a large fleet facility.',
        'The simplicity is financial, not physical. Vehicles, autonomy kits, charging, depots, spares, maintenance, insurance, remote assistance, and technology refresh still require capital. Without a quantified asset facility, lease schedule, customer-funding program, or public instrument in the comparative package, the most defensible allocation is that Waymo equity—and economically Alphabet—absorbs operating losses, asset impairment, and technology obsolescence.',
        'Parent capital has an opportunity cost even when it carries no coupon. It competes with other uses of Alphabet cash and remains exposed to the full loss waterfall. Consolidation or group control also does not prove that a ring-fenced fleet SPV exists. The unresolved diligence items are vehicle title, depot leases, liens, guarantees, and the legal owner of material autonomy hardware.',
      ],
      bullets: [
        'Archetype: parent-funded, equity-heavy platform.',
        'Visible 2024 + 2026 equity in the supplied model: $21.6B.',
        'Primary cash claim: equity return rather than scheduled fleet debt service.',
        'Residual holder: Waymo equity and, economically, Alphabet unless an undisclosed contract transfers part of the risk.',
      ],
      figures: [
        {
          src: '/images/research/hidden-financing-waymo-capital-stack.png',
          alt: 'Waymo capital stack showing Alphabet and outside equity funding flowing into vehicles, autonomy hardware, charging, depots, operations, and residual-value exposure.',
          label: 'Figure 01 / Waymo',
          caption:
            'Parent funding removes visible asset-level refinancing pressure, but leaves the economic asset and operating loss with equity.',
          width: 5610,
          height: 965,
        },
      ],
    },
    {
      id: 'serve-equipment-finance',
      title: 'Serve Robotics: equity-funded operator with equipment finance',
      paragraphs: [
        'Serve combines corporate equity with a more explicit asset channel. The supplied package maps a secured equipment-financing arrangement from Farnam and a Magna supplier warrant alongside the operating robot fleet. That structure reduces the amount of corporate cash needed at purchase, while making the equipment and supplier relationship part of the financing analysis.',
        'The 2024 cash-capex-to-revenue ratio of 5.66× shows how quickly physical deployment can outrun an early revenue base. The model’s base utilization is 48.2%, and the ratio of fleet revenue to the Farnam payment is about 0.28×. Those measures are not interchangeable with a legal covenant, but they demonstrate the operating burden: a financed robot must produce enough high-quality use to cover the fixed cash claim as well as field operations, support, maintenance, and replacement.',
        'A supplier warrant is also financing, even if it does not appear as debt. It can align Magna with Serve’s growth, defer some cash economics, and secure production access. In return it may create dilution, supplier concentration, minimum-volume dependencies, or negotiating leverage. The scalable version of this structure requires repeatable unit economics, financeable equipment, and service revenue that grows faster than fixed asset claims.',
      ],
      bullets: [
        'Archetype: equity-funded fleet operator plus secured equipment finance.',
        'FY2024 cash capex / revenue: 5.66×.',
        'Modeled base utilization: 48.2%.',
        'Modeled fleet revenue / Farnam payment: approximately 0.28×.',
      ],
      figures: [
        {
          src: '/images/research/hidden-financing-serve-capital-stack.png',
          alt: 'Serve Robotics capital stack showing corporate equity, Farnam secured equipment financing, a Magna supplier warrant, robot assets, operating cash flow, and downside allocation.',
          label: 'Figure 02 / Serve Robotics',
          caption:
            'Equipment finance lowers the upfront equity check; utilization and service cash flow still have to carry the scheduled claim.',
          width: 6042,
          height: 1613,
        },
      ],
    },
    {
      id: 'coreweave-asset-finance',
      title: 'CoreWeave: asset-financed infrastructure with multiple fixed claims',
      paragraphs: [
        'CoreWeave is the clearest example of an asset stack operating beside the corporate stack. The FY2025 model records $21.615 billion of debt principal, $8.195 billion of operating-lease obligations, $254 million of finance leases, and $8.185 billion of deferred revenue. Selected asset financing equals 78.6% of gross property and equipment in the model, while capex is 2.01× revenue.',
        'Each channel finances growth differently. Secured debt funds eligible infrastructure and places collateral and cash-flow rights with lenders. Leases finance facilities and equipment over time while creating fixed rent. Customer prepayments provide capacity capital before the related service is delivered, but the cash arrives with a performance liability. Deferred revenue is therefore funding, not free cash.',
        'The report’s central cash-flow warning is visible in two coverage views. Actual operating-cash-flow debt-service coverage is 0.70×. Removing the increase in deferred revenue produces operating cash flow before that customer-funding contribution of negative $1.116 billion. These analytical views are not lender covenant calculations; they isolate how much current growth depends on financing sources that sit outside ordinary earned revenue.',
        'CoreWeave can scale when contracted demand, infrastructure yield, financing tenor, and technology life remain aligned. It becomes fragile when capacity is built ahead of durable cash flow, collateral becomes obsolete faster than debt amortizes, lease terms outlast demand, or customer concentration turns prepayments into a performance and refund problem.',
      ],
      bullets: [
        'Archetype: secured asset financing, leases, and customer prepayments layered onto corporate equity.',
        'FY2025 debt principal: $21.615B; operating leases: $8.195B; finance leases: $254M.',
        'Deferred revenue: $8.185B; modeled OCF before the deferred-revenue increase: ($1.116B).',
        'Actual operating-cash-flow debt-service coverage in the model: 0.70×.',
      ],
      figures: [
        {
          src: '/images/research/hidden-financing-coreweave-capital-stack.png',
          alt: 'CoreWeave capital stack showing equity, secured asset debt, operating and finance leases, customer prepayments, compute infrastructure, cash-flow service, and residual risk.',
          label: 'Figure 03 / CoreWeave',
          caption:
            'The stack scales installed capacity, but debt, leases, and customer performance obligations all remain ahead of equity in different ways.',
          width: 4015,
          height: 2888,
        },
      ],
    },
    {
      id: 'anduril-public-support',
      title: 'Anduril: government-supported industrial capacity',
      paragraphs: [
        'Anduril’s structure joins venture-backed corporate capital to customer-linked industrial capacity and public support. The model compares a $310 million JobsOhio grant with $910.5 million of capital expenditure, or 34.0%. It also models $426.1 million of base net public benefit and a base public-support-to-private-capital ratio of about 0.88×.',
        'Those modeled ratios should not be mistaken for cash already collected or permanently retained. Public support can arrive as grants, tax credits, infrastructure, payroll incentives, training support, low-cost loans, or guarantees. Each component has a different funding date, collectibility, compliance test, and clawback path. The right measure is funded and retained net benefit, not the largest announced headline.',
        'Government demand and government financing must also remain separate. A customer contract can make capacity financeable by supporting revenue visibility; a grant reduces net project cost; a guarantee reallocates lender risk; and a tax credit depends on eligibility and monetization. The structure scales when the plant has durable demand, milestone discipline, and private capital that can carry timing gaps. It becomes brittle when the project is built around uncollected incentives or a single program that can be delayed, resized, or cancelled.',
      ],
      bullets: [
        'Archetype: venture-backed industrial company with customer-linked demand and public support.',
        'JobsOhio grant / capex: 34.0%.',
        'Modeled base net public benefit: $426.1M.',
        'Modeled base public support / private capital: approximately 0.88×.',
      ],
      figures: [
        {
          src: '/images/research/hidden-financing-anduril-capital-stack.png',
          alt: 'Anduril capital stack showing private equity, customer-linked demand, public incentives, factory investment, contractual conditions, and downside allocation.',
          label: 'Figure 04 / Anduril',
          caption:
            'Public support lowers net project cost only when it is funded, collectible, compliant, and retained after any clawback conditions.',
          width: 5002,
          height: 1791,
        },
      ],
    },
    {
      id: 'northvolt-project-finance',
      title: 'Northvolt: offtake-backed project finance in distress',
      paragraphs: [
        'Northvolt shows the full capital stack after the growth story breaks. Equity, project debt, customer offtake and prepayment support, public financing, suppliers, and bridge capital all helped build a manufacturing asset base. When ramp, yield, cost, timing, or demand disappointed, those financing channels became competing claims on the same constrained enterprise.',
        'The supplied model compares a $100 million debtor-in-possession facility with $5.8 billion of filing debt, only 1.7%. It places bridge liquidity at 4.22% of debt and estimates $4.4 billion of base residual exposure. Those values are evidence-bound analytical measures, not a recovery appraisal. They show why incremental rescue liquidity can keep operations alive without restoring the value of the pre-existing capital stack.',
        'Offtake and customer support can make a factory financeable, but they do not eliminate execution risk. Prepayments create delivery or refund obligations; project lenders retain security; public lenders or guarantors retain policy claims; suppliers can hold liens or critical operating leverage; and equity remains the first-loss layer. In distress, recoveries depend on asset saleability, unfinished-project cost, technology relevance, contract transferability, jurisdiction, and the priority waterfall.',
        'Northvolt is therefore the strongest warning against confusing an announced, fully financed project with a self-funding one. A structure can close financially and still fail economically if manufacturing yield, utilization, contribution margin, or replacement capital never reaches the level required by the fixed claims.',
      ],
      bullets: [
        'Archetype: offtake-backed, project-financed manufacturing platform with realized distress.',
        'DIP facility / filing debt: 1.7%.',
        'Bridge liquidity / debt: 4.22%.',
        'Modeled base residual exposure: $4.4B.',
      ],
      figures: [
        {
          src: '/images/research/hidden-financing-northvolt-capital-stack.png',
          alt: 'Northvolt capital stack showing equity, project debt, offtake and customer funding, public support, supplier exposure, debtor-in-possession liquidity, factory assets, and the distress waterfall.',
          label: 'Figure 05 / Northvolt',
          caption:
            'Rescue liquidity can preserve the option to operate or sell assets without repairing the loss already embedded in the pre-existing stack.',
          width: 4082,
          height: 2194,
        },
      ],
    },
    {
      id: 'residual-value-and-utilization',
      title: 'Residual value and utilization decide who actually loses',
      paragraphs: [
        'The owner of an asset is not necessarily the party that bears its economic residual risk. A lessor may hold title while the operator supplies a residual guarantee. A lender may have first lien but limited recovery if the equipment is specialized or obsolete. A parent may have no legal obligation to cure a facility yet support it to protect a network, customer, or future financing channel.',
        'Utilization is the bridge from installed capital to debt service. Lower paid use reduces operating contribution before it changes the legal principal balance. Once the cash shortfall appears, the structure moves through reserves, cash sweeps, sponsor cures, covenant remedies, foreclosure, asset sale, guarantee claims, and finally unsecured and equity loss. Technology obsolescence can accelerate the same waterfall by shrinking recovery value before the physical asset wears out.',
        'The cross-case metrics below are diagnostic rather than directly comparable accounting ratios. They deliberately reveal different pressure points: a high capex burden at Serve, fixed-claim coverage and customer-funded cash at CoreWeave, conditional public support at Anduril, and rescue liquidity that is small beside filing debt at Northvolt.',
      ],
      table: {
        caption: 'Selected downside indicators from the supplied workbook',
        columns: ['Case', 'Indicator', 'Value', 'What it tests', 'Evidence treatment'],
        rows: [
          ['Waymo', 'Visible 2024 + 2026 equity', '$21.6B', 'Parent and external equity capacity', 'Reported in supplied package'],
          ['Serve', 'FY2024 cash capex / revenue', '5.66×', 'Early revenue support for physical deployment', 'Calculated from supplied inputs'],
          ['Serve', 'Base fleet revenue / Farnam payment', '~0.28×', 'Service cash flow beside equipment claim', 'Modeled'],
          ['CoreWeave', 'Actual OCF debt-service coverage', '0.70×', 'Current cash generation beside debt service', 'Analytical; not a covenant calculation'],
          ['CoreWeave', 'OCF before deferred-revenue increase', '($1.116B)', 'Dependence on customer-funded working capital', 'Analytical adjustment'],
          ['Anduril', 'JobsOhio grant / capex', '34.0%', 'Announced public support beside project cost', 'Calculated; collection and retention still matter'],
          ['Northvolt', 'DIP / filing debt', '1.7%', 'Rescue liquidity beside legacy claims', 'Calculated from supplied inputs'],
          ['Northvolt', 'Base residual exposure', '$4.4B', 'Capital left exposed after modeled recoveries', 'Modeled'],
        ],
      },
    },
    {
      id: 'structures-that-scale',
      title: 'Which hardware financing structures actually scale?',
      paragraphs: [
        'A financing structure scales when the asset’s useful life, revenue contract, amortization schedule, and replacement cycle remain aligned after a downside case. Cheap capital does not rescue a unit that cannot cover service, and long-term debt does not make short-lived technology durable. The strongest structures match a repeatable asset pool to a cash flow that lenders, lessors, customers, or public partners can independently underwrite.',
        'Parent equity is most flexible but concentrates the loss and opportunity cost. Equipment finance scales when the collateral is standardized and service revenue is dependable. SPV or project finance scales when contracts and recoveries are legible without constant sponsor rescue. Customer capital scales when delivery and performance can be repeated without refund or concentration risk. Public support scales only as a supplement to an economic project, not as a substitute for one.',
        '“Asset-light” is an economic conclusion, not a statement about where title sits. A company is not asset-light merely because a lessor or SPV owns the equipment. The test is whether fixed payments, purchase commitments, minimum-volume duties, residual guarantees, parent cures, customer refunds, and replacement obligations still pull the asset burden back into the operating company.',
      ],
      table: {
        caption: 'Scalability and failure mode by financing archetype',
        columns: ['Archetype', 'Scales when', 'Breaks when', 'First loss usually lands with'],
        rows: [
          ['Parent-funded platform', 'Parent has patience and the platform creates strategic or financial value', 'Burn, losses, or opportunity cost exceed parent tolerance', 'Corporate equity and parent'],
          ['Leased or equipment-financed fleet', 'Utilization and contribution cover fixed service; collateral is reusable', 'Use falls, assets become specialized, or residual support returns', 'Operator equity, guarantor, then lender or lessor'],
          ['Asset-financed or SPV infrastructure', 'Contracted demand and asset life match tenor and amortization', 'Capacity, concentration, refinancing, or obsolescence breaks coverage', 'SPV equity, reserves, guarantor, then secured creditors'],
          ['Customer-financed industrial capacity', 'Deposits and contracts match deliverable milestones and capacity', 'Delivery fails or refund and performance duties exceed liquidity', 'Sponsor equity, then customers and lenders by contract priority'],
          ['Government-supported factory', 'Support is funded and retained beside a viable private-capital case', 'Incentives are delayed, clawed back, or mask weak unit economics', 'Private equity, guarantee providers, creditors, and public balance sheet'],
        ],
      },
    },
    {
      id: 'hardware-financing-questions',
      title: 'Hardware startup financing questions, answered',
      paragraphs: [
        'The right funding mix depends on what the company is building, who can underwrite the asset or contract, and whether cash generation arrives before fixed claims. The answers below separate corporate fundraising from the capital that finances physical deployment.',
      ],
      table: {
        caption: 'Direct answers to common hardware-financing questions',
        columns: ['Question', 'Answer'],
        rows: [
          [
            'How are hardware startups financed?',
            'Most combine founder or venture equity with some mix of equipment debt, leases, asset-backed facilities, project finance, customer prepayments, supplier terms, grants, tax credits, public loans, or parent support.',
          ],
          [
            'What hardware financing structures do startups use?',
            'Common structures include corporate equity, venture debt, equipment loans, leases, sale-leasebacks, borrowing-base facilities, asset SPVs, project finance, purchase-order finance, customer deposits, and public incentives.',
          ],
          [
            'How does asset financing for hardware startups work?',
            'A lender, lessor, or SPV funds an eligible asset and receives a fixed payment, collateral claim, cash-flow priority, or residual right. The operator preserves equity but accepts service, covenant, and recovery obligations.',
          ],
          [
            'What hardware startup funding options exist before venture scale?',
            'Early options can include founder capital, angels, preorders, customer-funded pilots, supplier credit, equipment leasing, grants, accelerator capital, strategic partners, and staged venture equity.',
          ],
          [
            'How does equipment financing for startups work?',
            'Equipment financing is strongest when the asset is identifiable, reusable, independently valuable, matched to durable revenue, and expected to remain useful longer than the financing term.',
          ],
        ],
      },
    },
    {
      id: 'findings-hierarchy',
      title: 'What the evidence establishes—and what remains unknown',
      paragraphs: [
        'The report uses a five-level evidence hierarchy so that a sourced filing number does not sit beside a scenario output as though both were facts. Confirmed findings are directly documented. Strongly supported findings follow from several consistent sources. Modeled findings depend on transparent assumptions. Plausible but unproven findings identify a structure that could exist without treating it as present. Unknowns remain explicit research gaps.',
        'The strongest cross-case conclusion is confirmed by the structure of the evidence: financing reduces the immediate equity requirement without removing the physical asset or its downside. The exact residual holder, however, can remain unknown until title records, lease schedules, security documents, guarantees, customer contracts, incentive agreements, and intercompany support arrangements are available.',
        'The next diligence pass should therefore begin with documents, not another funding headline. Reconcile the legal entity map; asset titles and liens; debt and lease maturities; borrowing-base and coverage definitions; customer deposits and performance liabilities; supplier terms and warrants; public-support funding and clawbacks; parent guarantees and services; utilization cohorts; maintenance and replacement capex; and recovery values under a technology shock.',
      ],
      table: {
        caption: 'Evidence hierarchy used throughout the report and model',
        columns: ['Level', 'Meaning', 'Permitted claim'],
        rows: [
          ['Confirmed', 'Directly documented in the supplied source package', 'State the value or structure with its source and date'],
          ['Strongly supported', 'Multiple consistent facts support the inference', 'State the inference and identify the remaining boundary'],
          ['Modeled', 'Calculated from disclosed inputs and explicit assumptions', 'Describe as a scenario or analytical output, never a reported fact'],
          ['Plausible but unproven', 'Commercially possible but not established by the package', 'Name as a diligence question, not a current instrument'],
          ['Unknown', 'Evidence is insufficient to allocate the amount, owner, recourse, or recovery', 'Preserve the gap and identify the document needed to close it'],
        ],
      },
      bullets: [
        'Do not infer asset ownership from corporate consolidation.',
        'Do not infer nonrecourse from an SPV label.',
        'Do not treat customer cash as free cash before the performance obligation is delivered.',
        'Do not count announced public support without funding, collectibility, compliance, and retention checks.',
        'Do not call a model asset-light until fixed claims and contingent recourse are mapped.',
      ],
    },
  ],
  sources: [
    {
      label: 'The Hidden Financing Behind Hardware Startups — supplied comparative report',
      href: '/research/hidden-financing-report.pdf',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Hidden financing comparative model — supplied 29-sheet workbook',
      href: '/research/hidden-financing-model.xlsx',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Capital-stack diagrams — supplied PNG and Graphviz source package',
      href: '/research/capital-stack-diagrams.zip',
      lastVerified: '2026.07.22',
    },
    {
      label: 'CoreWeave 2025 Form 10-K',
      href: 'https://www.sec.gov/Archives/edgar/data/1769628/000176962826000104/crwv-20251231.htm',
    },
    {
      label: 'CoreWeave Q1 2026 Form 10-Q',
      href: 'https://www.sec.gov/Archives/edgar/data/1769628/000176962826000058/crwv-20260331.htm',
    },
    {
      label: 'Fitch — CoreWeave DDTL 5.5 rating action',
      href: 'https://www.fitchratings.com/research/corporate-finance/fitch-assigns-coreweave-new-ddtl-bb-rating-affirms-idr-at-bb-outlook-positive-16-07-2026',
    },
    {
      label: 'Serve Robotics 2024 Form 10-K',
      href: 'https://www.sec.gov/Archives/edgar/data/1832483/000183248325000010/patr-20241231.htm',
    },
    {
      label: 'Serve Robotics FY2025 earnings exhibit',
      href: 'https://www.sec.gov/Archives/edgar/data/1832483/000183248326000004/serv-20251231xex991earning.htm',
    },
    {
      label: 'Alphabet 2025 fourth-quarter earnings materials',
      href: 'https://abc.xyz/investor/events/event-details/2026/2025-Q4-Earnings-Call-2026-Dr_C033hS6/default.aspx',
    },
  ],
};
