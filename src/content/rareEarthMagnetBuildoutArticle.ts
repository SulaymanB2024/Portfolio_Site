import type { ResearchArticle } from './articleModels';

export const RARE_EARTH_MAGNET_BUILDOUT_ARTICLE_SLUG =
  'us-rare-earth-magnet-manufacturing-capacity';
export const RARE_EARTH_MAGNET_BUILDOUT_ARTICLE_PATH =
  `/research/data-systems/${RARE_EARTH_MAGNET_BUILDOUT_ARTICLE_SLUG}`;

export const RARE_EARTH_MAGNET_BUILDOUT_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'data-systems',
  slug: RARE_EARTH_MAGNET_BUILDOUT_ARTICLE_SLUG,
  aliases: ['/markets/us-rare-earth-magnet-manufacturing-capacity'],
  number: '19',
  category: 'INDUSTRIAL SYSTEMS',
  title: 'The U.S. Rare-Earth Magnet Buildout Is Larger Than It Looks—and Less Mature',
  seoTitle: 'U.S. Rare-Earth Magnet Capacity: Plant-by-Plant Buildout',
  subtitle:
    'A physical-capacity audit of U.S. NdFeB magnet projects: 37,750 tonnes of disclosed firm-project nameplate, only 4,000 tonnes in the commercial-shipment class, and a supply chain still constrained by qualification, product mix, and upstream material conversion.',
  seoDescription:
    'Audit U.S. rare-earth magnet manufacturing capacity by plant maturity, product form, qualification status, upstream inputs, and realistic output scenarios.',
  artwork: {
    kind: 'study',
    variant: 'triptych',
    label: 'Rare-earth magnets / physical-capacity audit',
    note: 'Nameplate, qualified output, and gross process flow are measured separately.',
  },
  date: '2026.08.17',
  dateModified: '2026.08.17',
  lastVerified: '2026.08.17',
  readTime: '28 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'The United States can now point to roughly 37,750 metric tonnes of disclosed firm-project NdFeB magnet capacity, but that total is not current supply. Commercial shipments, customer-qualified output, product geometry, heavy-rare-earth inputs, alloy and powder conversion, yield loss, and the demand denominator all reduce what the headline can support.',
  conclusion: {
    title: 'Track qualified tonnes, not announced tonnes',
    content:
      'The buildout is real, but nameplate is the first line of the model rather than the answer. A useful domestic-capacity scorecard must report commercial shipments, qualified product families, input origin, yield, customer concentration, and sustained utilization. Until those measures rise together, the United States has a project pipeline and a smaller bankable supply base.',
  },
  evidenceBoundary:
    'This investigation uses public project disclosures, government awards, company releases, filings, and technical references available through August 17, 2026. Capacity statements are not standardized: some refer to metric tonnes, some to tons, some to a facility phase, and some to a future platform. The 37,750-tonne headline is a stated-unit sum of firm projects in the audit; normalization produces a 37,584–38,048-tonne range. Operating status is classified from disclosed shipments, commissioning, qualification, construction, and target dates. The 2028 scenarios and material-flow ranges are derived illustrations, not company guidance, engineering guarantees, market forecasts, or investment recommendations.',
  metrics: [
    { label: 'Firm-project nameplate', value: '37,750 t' },
    { label: 'Commercial-shipment class', value: '4,000 t' },
    { label: 'Ramp / qualification class', value: '3,600 t' },
    { label: 'Future-project class', value: '30,150 t' },
  ],
  resources: [
    {
      label: 'Capacity and maturity model',
      href: '/research/us-rare-earth-magnet-capacity-model.csv',
      description:
        'The machine-readable maturity-bucket model, normalization range, and illustrative qualified-output scenarios used in this web edition.',
      format: 'CSV',
    },
    {
      label: 'Methodology and definitions',
      href: '/research/us-rare-earth-magnet-methodology.md',
      description:
        'Definitions for project nameplate, commercial shipment, customer qualification, future capacity, gross process flow, and denominator handling.',
      format: 'MD',
    },
    {
      label: 'Source ledger',
      href: '/research/us-rare-earth-magnet-source-ledger.csv',
      description:
        'Primary-source index for the companies, government programs, technical references, and demand estimates used in the audit.',
      format: 'CSV',
    },
  ],
  content: [
    'The United States is no longer starting from zero in sintered neodymium-iron-boron magnets. A project-by-project audit produces 37,750 metric tonnes of disclosed firm-project nameplate. That figure is large enough to resemble published estimates of total U.S. magnet consumption, but the resemblance is misleading. Only 4,000 tonnes belongs to plants with both disclosed nameplate and commercial shipments. Another 3,600 tonnes sits in commissioning, ramp, or customer qualification. The remaining 30,150 tonnes is future capacity tied to construction, later phases, or announced production targets.',
    'A magnet plant does not become substitutable supply when the press release is issued or when the first furnace is hot. Customers qualify an alloy recipe, magnetic grade, coating, geometry, dimensional tolerance, traceability system, and process window. An automotive traction-motor magnet is not interchangeable with a defense actuator magnet or a commodity bonded magnet. Even within sintered NdFeB, coercivity, temperature performance, heavy-rare-earth content, grain-boundary diffusion, corrosion protection, and machining loss can change the usable output of the same nominal tonne.',
    'The demand comparison is equally sensitive. The Commerce Department’s roughly 37,000-tonne U.S. demand frame includes magnets embedded in imported finished goods. A domestic magnet factory competes first for direct motor, component, and system orders placed into the U.S. supply chain. Treating embedded imports as an immediately contestable addressable market overstates both near-term demand and the utilization available to new plants.',
  ],
  sections: [
    {
      id: 'headline',
      title: 'The 37,750-tonne headline is a project inventory, not current production',
      paragraphs: [
        'The audit starts with disclosed firm projects rather than every aspirational target. A project enters the headline only when a company or government source identifies a U.S. manufacturing site or funded production line and provides a capacity figure. Exploration-stage concepts, upstream oxide projects without magnet conversion, and generic corporate ambitions are excluded.',
        'The resulting total is 37,750 tonnes in the units used by project disclosures. Because public announcements do not always distinguish metric tonnes from U.S. short tons, the same ledger normalizes ambiguous rows both ways. That produces a range of 37,584 to 38,048 metric tonnes. The spread is small relative to the strategic claim, but preserving it prevents false precision.',
        'The larger adjustment is maturity. Noveon and eVAC account for the 4,000-tonne commercial-shipment class in the audit. MP Materials’ disclosed 3,000-tonne line and the first 600 tonnes of USA Rare Earth’s staged buildout remain in commissioning, ramp, or qualification. JS Link America, HyProMag USA, Vulcan Elements, the balance of USA Rare Earth’s project, and other disclosed firm lines sit in the future bucket until operating evidence changes their status.',
      ],
      table: {
        caption: 'U.S. NdFeB capacity stack used in this investigation',
        columns: ['Maturity class', 'Capacity', 'What the class requires', 'What it does not prove'],
        rows: [
          ['Commercial shipments', '4,000 t', 'Disclosed nameplate plus evidence of commercial shipments', 'Full utilization, broad qualification, domestic inputs, or positive margins'],
          ['Commissioning / ramp / qualification', '3,600 t', 'Installed or starting equipment with disclosed commissioning, first output, or customer qualification', 'Steady-state yield, recurring orders, or interchangeable product coverage'],
          ['Future firm projects', '30,150 t', 'Named U.S. project or funded line with disclosed capacity', 'Completed construction, on-time startup, financing sufficiency, or customer acceptance'],
          ['Firm-project total', '37,750 t', 'Arithmetic sum of the three maturity classes', 'Current domestic production'],
        ],
      },
      figures: [
        {
          src: '/images/research/rare-earth-magnet-capacity-maturity.svg',
          alt: 'Stacked bar separating 4,000 tonnes of commercial-shipment capacity, 3,600 tonnes in ramp or qualification, and 30,150 tonnes of future U.S. rare-earth magnet projects.',
          label: 'Figure 01 / Capacity by maturity',
          caption:
            'Eighty percent of the disclosed firm-project stack remains in the future-project class. Nameplate should not be read as current qualified output.',
          width: 1600,
          height: 900,
        },
      ],
    },
    {
      id: 'classification',
      title: 'Five gates separate an announced plant from bankable supply',
      paragraphs: [
        'The first gate is physical completion: buildings, furnaces, strip casters, hydrogen-decrepitation systems, mills, presses, sintering furnaces, heat-treatment equipment, coating lines, machining cells, metrology, and environmental controls must work as an integrated line. A ribbon cutting says little about bottleneck rate or scrap.',
        'The second gate is repeatable yield. Magnet manufacturing converts costly feedstock through several loss points. Oxidation, powder handling, pressing density, sintering shrinkage, cracking, machining, coating defects, and rejected magnetic properties can consume material without producing saleable magnets. A plant can demonstrate first output while operating far below economic yield.',
        'The third gate is product qualification. Customers approve a specific combination of grade, geometry, coating, magnetic orientation, temperature behavior, dimensional tolerance, process control, and traceability. Qualification can take quarters or years when the magnet sits inside a safety-critical motor, defense platform, medical device, or long-lived industrial system.',
        'The fourth gate is commercial depth. A single launch customer can absorb initial output but leave a plant exposed to one program schedule, one set of specifications, and one pricing negotiation. Broadly bankable capacity requires multiple qualified product families and a repeatable order book.',
        'The fifth gate is input security. Domestic pressing and sintering do not create a domestic supply chain if NdPr metal, alloy strip, dysprosium, terbium, or specialized processing services remain tied to one foreign system. The relevant unit is a qualified magnet with an auditable input chain, not a tonne passing through a U.S. building.',
      ],
      table: {
        caption: 'Evidence ladder for classifying magnet capacity',
        columns: ['Gate', 'Strong evidence', 'Weak substitute'],
        rows: [
          ['Physical completion', 'Integrated line commissioned; equipment and site identified', 'Groundbreaking or building shell'],
          ['Repeatable yield', 'Sustained saleable output, scrap data, or recurring production cadence', 'First furnace run or sample batch'],
          ['Qualification', 'Customer-approved grade, geometry, coating, and process window', 'Laboratory magnetic-property result'],
          ['Commercial depth', 'Recurring shipments to more than one program or product family', 'Non-binding memorandum or total addressable market'],
          ['Input security', 'Origin and conversion path for oxide, metal, alloy, heavy rare earths, and recycled feed', 'Final assembly in the United States'],
        ],
      },
    },
    {
      id: 'demand-denominator',
      title: 'The 37,000-tonne demand comparison mixes direct demand with magnets hidden inside imports',
      paragraphs: [
        'A recurring claim compares roughly 37,750 tonnes of announced U.S. capacity with a Commerce estimate near 37,000 tonnes of U.S. demand and concludes that the domestic shortfall is nearly solved. The numerator and denominator do not describe the same market boundary.',
        'The Commerce frame counts permanent magnets that reach the U.S. economy both directly and embedded inside imported finished goods. The embedded portion can sit inside a motor, vehicle, electronics assembly, appliance, industrial machine, or other product manufactured abroad. A new U.S. magnet plant cannot automatically sell into that volume. Capturing it may require relocating motor production, redesigning a component, changing a tier-one supplier, requalifying the entire system, or altering trade flows.',
        'Direct domestic magnet demand is therefore the near-term contestable denominator. Embedded-import demand is a broader system exposure and a long-run reshoring opportunity. Both matter, but dividing plant nameplate by the broader denominator makes the buildout look more complete than its immediate customer base supports.',
      ],
      table: {
        caption: 'Demand denominators that should remain separate',
        columns: ['Denominator', 'What it includes', 'Use in a capacity model'],
        rows: [
          ['Direct magnet demand', 'Magnets purchased by domestic motor, component, and system manufacturers', 'Near-term addressable orders and utilization'],
          ['Embedded-import magnet content', 'Magnets inside imported finished goods and subassemblies', 'Strategic exposure and possible long-run reshoring'],
          ['Replacement / aftermarket demand', 'Maintenance, repair, spares, and remanufacturing', 'Often fragmented; grade and geometry specific'],
          ['Export demand', 'Qualified foreign customers served from U.S. plants', 'Potential utilization, subject to cost, logistics, and trade rules'],
        ],
      },
      figures: [
        {
          src: '/images/research/rare-earth-magnet-demand-denominators.svg',
          alt: 'Diagram separating direct U.S. magnet purchases from magnets embedded in imported finished goods, replacement demand, and export demand.',
          label: 'Figure 02 / Demand is not one denominator',
          caption:
            'The broad strategic exposure is larger than the order book immediately available to a domestic magnet plant.',
          width: 1600,
          height: 900,
        },
      ],
    },
    {
      id: 'material-balance',
      title: 'Finished-magnet capacity requires 46,400 to 70,459 tonnes of gross process flow in the model',
      paragraphs: [
        'The 37,750-tonne headline measures finished magnet nameplate. It should not be compared directly with every upstream tonnage disclosure. Oxide, metal, alloy, strip, powder, pressed compacts, sintered blocks, machined pieces, and finished coated magnets are different mass points in the process.',
        'The model applies explicit ranges for alloy chemistry, conversion loss, process yield, machining loss, internal scrap recovery, and recycled-feed displacement. Under the central project stack, those assumptions imply 46,400 to 70,459 tonnes of gross process flow across the chain. That is not additional magnet demand and should not be added to the 37,750-tonne capacity figure. It is the upstream throughput needed to support the finished output under different yield and recycling cases.',
        'The distinction matters because a plant can announce finished-magnet nameplate without having secured the corresponding NdPr metal, heavy-rare-earth additives, alloy conversion, or recycling loop. Conversely, a metal or alloy plant’s tonnes cannot be counted as finished magnets. Capacity audits must preserve the unit, chemical form, product stage, and yield boundary of every disclosure.',
      ],
      table: {
        caption: 'Material-flow interpretation used in the workbook',
        columns: ['Measure', 'Modeled range', 'Interpretation'],
        rows: [
          ['Finished magnet nameplate', '37,584–38,048 t', 'Normalized range around the 37,750-tonne stated-unit project sum'],
          ['Gross process flow', '46,400–70,459 t', 'Cumulative material handled before saleable finished output under modeled yields and recycle loops'],
          ['Commercial-shipment class', '4,000 t', 'Nameplate attached to plants with disclosed commercial shipments'],
          ['Qualified output', 'Not publicly disclosed as a complete national total', 'Must be measured by customer-approved products and sustained shipments'],
        ],
      },
      figures: [
        {
          src: '/images/research/rare-earth-magnet-material-flow.svg',
          alt: 'Material-flow diagram from rare-earth oxide and metal through alloy, powder, sintering, machining, coating, recycling, and finished magnet output.',
          label: 'Figure 03 / Finished capacity versus gross process flow',
          caption:
            'The 46,400–70,459-tonne range is a throughput requirement, not a second capacity total.',
          width: 1600,
          height: 900,
        },
      ],
    },
    {
      id: 'product-mix',
      title: 'A tonne of magnets is not a fungible tonne',
      paragraphs: [
        'NdFeB capacity is commonly reported as one mass number, but customer utility depends on product form. A plant optimized for large block magnets may not efficiently serve thin arc segments, micro-magnets, high-speed rotor sleeves, grain-boundary-diffused grades, or complex assemblies. Machining intensity and coating surface area can change throughput even when finished mass is unchanged.',
        'Magnetic grade also changes the input set. High-temperature and high-coercivity applications may require dysprosium or terbium, or a process that concentrates those elements at grain boundaries. These heavy rare earths are far smaller in tonnage than NdPr but can be the binding constraint. A national capacity total that ignores grade coverage can show surplus while a specific motor program still has no qualified domestic source.',
        'Geometry and assembly matter for the same reason. Some customers buy finished coated magnets; others buy magnetized segments, rotor subassemblies, or complete magnetic circuits. Moving one step downstream can create more defensible value, but it also adds tooling, automation, intellectual property, quality systems, and customer-specific capital.',
      ],
      bullets: [
        'Report sintered and bonded magnets separately.',
        'Report finished magnet, machined segment, and assembled rotor capacity separately.',
        'Identify grade families and operating-temperature ranges rather than one NdFeB label.',
        'Track heavy-rare-earth dependence and grain-boundary-diffusion capability.',
        'Separate sample qualification from serial-production approval.',
      ],
    },
    {
      id: 'upstream',
      title: 'The upstream bottleneck can move even when magnet capacity grows',
      paragraphs: [
        'The U.S. buildout spans mining, separation, oxide production, metal and alloy conversion, magnet manufacturing, machining, coating, and recycling. Progress at one stage can expose a shortage at another. More sintering capacity increases the requirement for consistent alloy strip and powder; more alloy capacity increases the need for separated oxides and metal-making; more defense demand can tighten heavy-rare-earth additives even when NdPr is available.',
        'Feedstock origin also affects qualification and policy eligibility. A customer may require material traceability, exclusion of specified foreign entities, recycled content, or compliance with procurement rules. A plant that can technically run imported alloy may still need a separate domestic route for a defense or subsidized automotive program.',
        'Recycling improves the balance only when scrap is collected, chemically or metallurgically recovered, returned at the required purity, and qualified into a product. Manufacturing scrap is usually easier than end-of-life recovery because its composition and contamination history are known. End-of-life magnets can be dispersed across motors and devices, coated, bonded, corroded, or difficult to disassemble.',
      ],
      table: {
        caption: 'Where a domestic chain can still fail',
        columns: ['Stage', 'Failure mode', 'Observable evidence'],
        rows: [
          ['Separation', 'Insufficient NdPr purity or missing heavy-rare-earth products', 'Qualified oxide specifications and recurring deliveries'],
          ['Metal / alloy', 'Scale, consistency, or oxygen-control problems', 'Lot consistency, strip-cast output, customer acceptance'],
          ['Powder / sintering', 'Low yield, oxidation, cracking, or unstable magnetic properties', 'Saleable yield and process-capability data'],
          ['Machining / coating', 'Geometry bottlenecks, corrosion failures, or high scrap', 'Dimensional yield and coating qualification'],
          ['Assembly', 'Customer-specific tooling or rotor integration delays', 'Production-part approval and serial shipments'],
          ['Recycling', 'Collection and purification cost exceeds recovered value', 'Closed-loop contracts and qualified recycled feed'],
        ],
      },
    },
    {
      id: 'scenario-model',
      title: 'A maturity-adjusted 2028 model produces 8,000 to 28,000 tonnes—not 37,750 by default',
      paragraphs: [
        'The model does not forecast individual companies. It applies utilization factors to the three maturity buckets to show how much the headline depends on execution. Commercial-shipment capacity is assigned the highest factor, ramp and qualification capacity a lower factor, and future projects the widest range.',
        'The conservative case applies 85% to the commercial-shipment class, 45% to ramp and qualification, and 10% to future projects. It produces roughly 8,000 tonnes of saleable output. The base illustration applies 90%, 70%, and 35%, producing about 16,700 tonnes. The high-execution case applies 95%, 90%, and 70%, producing about 28,100 tonnes.',
        'These figures are not demand forecasts or company guidance. They show why a physical-capacity model needs probability, schedule, yield, qualification, and utilization layers. Even the high case leaves a gap between nameplate and output because new plants rarely reach full, product-mix-adjusted utilization immediately.',
      ],
      table: {
        caption: 'Illustrative maturity-adjusted output scenarios',
        columns: ['Case', 'Commercial shipments', 'Ramp / qualification', 'Future projects', 'Illustrative output'],
        rows: [
          ['Conservative', '85%', '45%', '10%', '~8.0 kt'],
          ['Base illustration', '90%', '70%', '35%', '~16.7 kt'],
          ['High execution', '95%', '90%', '70%', '~28.1 kt'],
          ['Headline nameplate', '100%', '100%', '100%', '37.75 kt'],
        ],
      },
    },
    {
      id: 'economics',
      title: 'Policy can finance construction and still leave utilization unresolved',
      paragraphs: [
        'Government awards, offtakes, loans, tax incentives, procurement rules, and price-support mechanisms can make a plant financeable before the private market would. They do not remove the need for competitive conversion cost, qualified inputs, customer acceptance, or recurring orders. The key policy question is whether support buys temporary learning and scale or permanently subsidizes idle and mismatched capacity.',
        'A domestic plant faces a difficult ramp profile. Fixed cost arrives before utilization. Qualification limits the number of saleable products. Early scrap is high. Customers may demand price parity with established Asian suppliers while also requiring domestic traceability and redundancy. Long-term offtake can bridge the ramp, but take-or-pay terms, floor prices, indexation, and customer concentration determine who carries the downside.',
        'The strongest projects combine a credible input route, experienced process operators, anchored demand, product-specific qualification, and enough balance-sheet support to survive a slow ramp. The weakest projects use a large nameplate number to stand in for all five.',
      ],
      bullets: [
        'Track committed offtake volume separately from non-binding interest.',
        'Identify floor prices, indexation, minimum-purchase obligations, and termination rights where disclosed.',
        'Model working capital and scrap during qualification, not only steady-state EBITDA.',
        'Test whether the plant remains viable when imported magnet prices fall.',
        'Treat government support as part of project finance, not proof of product-market fit.',
      ],
    },
    {
      id: 'scorecard',
      title: 'A better national scorecard has twelve fields',
      paragraphs: [
        'The common scoreboard—announced tonnes divided by national demand—compresses the supply chain into a ratio that cannot answer procurement, policy, or investment questions. A useful scorecard should be updated plant by plant and product family by product family.',
      ],
      table: {
        caption: 'Recommended fields for each U.S. magnet project',
        columns: ['Field', 'Question answered'],
        rows: [
          ['Nameplate and unit', 'What finished product mass is the line designed to make?'],
          ['Product form', 'Sintered, bonded, block, segment, assembly, or rotor?'],
          ['Operating evidence', 'Construction, commissioning, first output, qualification, or recurring shipment?'],
          ['Qualified capacity', 'How much output is approved for named product families?'],
          ['Utilization', 'What share of nameplate is producing saleable product?'],
          ['Saleable yield', 'How much input becomes accepted finished magnets?'],
          ['Grade coverage', 'Which magnetic and temperature-performance grades are qualified?'],
          ['Input origin', 'Where do oxide, metal, alloy, heavy rare earths, and recycled feed originate?'],
          ['Customer concentration', 'How much output depends on one customer or program?'],
          ['Offtake quality', 'Binding volume, price floor, indexation, and duration?'],
          ['Schedule confidence', 'What critical equipment, permits, financing, or qualification steps remain?'],
          ['Policy dependence', 'Which grants, loans, tax credits, procurement rules, or price supports are required?'],
        ],
      },
    },
    {
      id: 'methodology',
      title: 'Methodology and source ledger',
      paragraphs: [
        'The project ledger was built from company releases, government award announcements, regulatory filings, facility pages, and technical publications. Each capacity statement was stored with its original unit, product description, facility, phase, target date, and operating-status language. Duplicate announcements referring to the same line were reconciled rather than added.',
        'Status classification follows the strongest public evidence available. Commercial shipment requires more than first production. Ramp and qualification includes installed or starting lines that have not yet demonstrated broad recurring shipments. Future capacity includes construction, funded expansions, and later phases with a disclosed capacity but insufficient operating evidence.',
        'The workbook preserves reported values before normalization, then calculates maturity buckets, the stated-unit headline, the metric-tonne range, material-flow requirements, and illustrative output scenarios. Where public evidence is incomplete, the model marks the field unknown rather than converting silence into zero.',
      ],
      bullets: [
        'Evidence cutoff: August 17, 2026.',
        'Headline basis: disclosed firm-project U.S. finished-magnet nameplate.',
        'Excluded: upstream-only oxide or metal capacity, generic ambitions, and projects without a disclosed magnet-capacity figure.',
        'Normalization: ambiguous “tons” converted as both short tons and metric tonnes to preserve a range.',
        'Demand handling: direct demand and magnets embedded in imported finished goods remain separate.',
        'Scenario handling: maturity factors are transparent illustrations, not company forecasts.',
      ],
    },
  ],
  sources: [
    {
      label: 'U.S. Department of Commerce — Section 232 investigation of NdFeB permanent magnets',
      href: 'https://www.bis.gov/press-release/department-commerce-releases-results-section-232-investigation-neodymium-iron-boron-permanent-magnets',
      lastVerified: '2026.08.17',
    },
    {
      label: 'U.S. Geological Survey — Mineral Commodity Summaries: Rare Earths',
      href: 'https://www.usgs.gov/centers/national-minerals-information-center/rare-earths-statistics-and-information',
      lastVerified: '2026.08.17',
    },
    {
      label: 'U.S. Department of Energy — Critical Materials Assessment',
      href: 'https://www.energy.gov/cmm/critical-materials-assessment',
      lastVerified: '2026.08.17',
    },
    {
      label: 'U.S. Department of Defense — MP Materials rare-earth supply-chain agreement',
      href: 'https://www.defense.gov/News/Releases/Release/Article/4232241/dod-signs-historic-agreement-with-mp-materials-to-strengthen-us-rare-earths-supply-chain/',
      lastVerified: '2026.08.17',
    },
    {
      label: 'MP Materials — commercial production of NdFeB magnets in Fort Worth',
      href: 'https://mpmaterials.com/',
      lastVerified: '2026.08.17',
    },
    {
      label: 'MP Materials — investor filings and manufacturing disclosures',
      href: 'https://investors.mpmaterials.com/financials/sec-filings',
      lastVerified: '2026.08.17',
    },
    {
      label: 'Noveon Magnetics — U.S. magnet manufacturing and recycling platform',
      href: 'https://noveon.co/',
      lastVerified: '2026.08.17',
    },
    {
      label: 'Vacuumschmelze / eVAC — U.S. permanent-magnet manufacturing',
      href: 'https://vacuumschmelze.com/',
      lastVerified: '2026.08.17',
    },
    {
      label: 'USA Rare Earth — Stillwater, Oklahoma magnet facility',
      href: 'https://www.usare.com/',
      lastVerified: '2026.08.17',
    },
    {
      label: 'Vulcan Elements — U.S. rare-earth magnet manufacturing',
      href: 'https://vulcanelements.com/',
      lastVerified: '2026.08.17',
    },
    {
      label: 'JS Link America — U.S. permanent-magnet project',
      href: 'https://www.jslink.com/',
      lastVerified: '2026.08.17',
    },
    {
      label: 'HyProMag USA — recycled rare-earth magnet project',
      href: 'https://www.cotec.ca/hypromag-usa',
      lastVerified: '2026.08.17',
    },
    {
      label: 'General Motors — domestic rare-earth magnet supply initiatives',
      href: 'https://news.gm.com/',
      lastVerified: '2026.08.17',
    },
    {
      label: 'International Energy Agency — Global Critical Minerals Outlook',
      href: 'https://www.iea.org/reports/global-critical-minerals-outlook-2025',
      lastVerified: '2026.08.17',
    },
    {
      label: 'Government Accountability Office — critical-mineral supply-chain work',
      href: 'https://www.gao.gov/critical-minerals',
      lastVerified: '2026.08.17',
    },
    {
      label: 'National Renewable Energy Laboratory — rare-earth magnet supply-chain research',
      href: 'https://www.nrel.gov/materials/critical-materials.html',
      lastVerified: '2026.08.17',
    },
    {
      label: 'Ames National Laboratory — Critical Materials Institute',
      href: 'https://www.ameslab.gov/cmi',
      lastVerified: '2026.08.17',
    },
    {
      label: 'European Commission JRC — rare-earth permanent magnet material-flow research',
      href: 'https://joint-research-centre.ec.europa.eu/',
      lastVerified: '2026.08.17',
    },
    {
      label: 'U.S. Department of Defense — Industrial Base Policy critical-minerals programs',
      href: 'https://www.businessdefense.gov/ibr/mceip/index.html',
      lastVerified: '2026.08.17',
    },
    {
      label: 'Federal Register — neodymium-iron-boron permanent magnet trade and security actions',
      href: 'https://www.federalregister.gov/',
      lastVerified: '2026.08.17',
    },
  ],
};
