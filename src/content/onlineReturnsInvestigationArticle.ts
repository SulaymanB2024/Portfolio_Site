import type { ResearchArticle } from './articleModels';

export const ONLINE_RETURNS_INVESTIGATION_ARTICLE_SLUG = 'where-online-returns-actually-go';
export const ONLINE_RETURNS_INVESTIGATION_ARTICLE_PATH =
  `/research/financial-systems/${ONLINE_RETURNS_INVESTIGATION_ARTICLE_SLUG}`;

export const ONLINE_RETURNS_INVESTIGATION_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: ONLINE_RETURNS_INVESTIGATION_ARTICLE_SLUG,
  aliases: ['/markets/where-online-returns-actually-go'],
  number: '17',
  category: 'FINANCIAL SYSTEMS',
  title: 'Where Do Online Returns Go? Inside Reverse Logistics',
  seoTitle: 'Where Do Online Returns Go? Reverse Logistics Model',
  subtitle:
    'What happens to online returns after a refund: a product-level model of restocking, open-box resale, refurbishment, liquidation, recycling, destruction, and returnless refunds.',
  seoDescription:
    'Where do online returns go? Follow restocking, refurbishment, liquidation, recycling, or disposal with a nine-product reverse logistics model.',
  artwork: {
    kind: 'image',
    heroSrc: '/images/research/online-returns-reader-hero.webp',
    socialSrc: '/images/research/online-returns-social.jpg',
    alt: 'A monochrome reverse-logistics machine routing a returned parcel toward restock, refurbishment, recovery, recycling, or disposal.',
    label: 'Reverse-logistics investigation / nine product archetypes',
    caption:
      'Retail price does not determine whether retrieval works. Freight, condition, inspection cost, eligible resale channels, and value density do.',
    objectPosition: '50% 50%',
  },
  date: '2026.07.22',
  lastVerified: '2026.07.22',
  readTime: '26 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'A refund and a physical return are separate events. The value of retrieving the product depends on the cost of moving it, the cost of learning its condition, and the resale channels still legally and commercially available—not retail price alone.',
  conclusion: {
    title: 'Trace value after the refund',
    content:
      'A refund ends the customer transaction, not the product’s physical journey. Recovery depends on transport, inspection, condition, fraud controls, and available resale channels, so retail price alone cannot predict the route or environmental endpoint.',
  },
  evidenceBoundary:
    'This web edition reformats the supplied July 22, 2026 investigation and reverse-logistics workbook. The underlying sources were not independently refreshed for publication. Product-level values are analytical scenarios, not disclosed retailer averages, forecasts, accounting measures, or environmental disposition rates. The public auction sample contains two completed lots and is descriptive only.',
  metrics: [
    { label: 'Product archetypes modeled', value: '9' },
    { label: 'Workbook sheets', value: '36' },
    { label: 'Headphones return tax', value: '$77.44' },
    { label: 'Furniture retrieval value', value: '−$14.04' },
  ],
  resources: [
    {
      label: 'Full reverse-logistics investigation',
      href: '/research/where-online-return-actually-goes-report.pdf',
      description:
        'The complete 49-page report with the investigative article, methodology, model appendix, claim register, limitations, and source index.',
      format: 'PDF',
    },
    {
      label: 'Editable investigation',
      href: '/research/where-online-return-actually-goes-report.docx',
      description: 'The supplied editable report used as the source document for this web edition.',
      format: 'DOCX',
    },
    {
      label: 'Reverse-logistics tax model',
      href: '/research/reverse-logistics-tax-model.xlsx',
      description:
        'The 36-sheet model covering product assumptions, route engines, unit economics, thresholds, fraud, sustainability, auctions, and sensitivities.',
      format: 'XLSX',
    },
    {
      label: 'Retrieval-decision chart',
      href: '/images/research/online-returns-retrieval-decision.png',
      description:
        'A downloadable chart showing when expected recovery supports retrieving a returned product instead of issuing a returnless refund.',
      format: 'PNG',
    },
  ],
  content: [
    'Where do online returns go after a refund? They can be restocked, sold open-box, refurbished, liquidated, donated, recycled, destroyed, held as fraud evidence, or never retrieved at all. A $100 pair of headphones may be refunded before it reaches a return center, then consolidated, moved, opened, matched to a serial number, tested, cleaned, and routed. That sequence is a wager that inspection will unlock a resale channel worth more than the cost of retrieval.',
    'In the supplied base model, those headphones carry $5.91 of weighted reverse freight and $4.00 of intake and inspection cost. Expected net disposition recovery is $33.37. Retrieval adds $22.56 after the separate fraud-administration allowance, yet the returned order still produces a $77.44 return tax relative to the kept sale. Recovery does not make the return profitable; it makes the loss smaller.',
    'The same price can produce the opposite decision. A $100 small appliance has only $3.77 of retrieval value after fraud administration because its package and testing costs are heavier. A $100 footwear return has $41.70 because it moves cheaply and can often enter a controlled restock or outlet channel. Price is one input. The route is the outcome of a chain.',
  ],
  sections: [
    {
      id: 'refund-versus-product',
      title: 'Where online returns go after the refund',
      paragraphs: [
        'The consumer sees money move. The merchandise can remain still. Marketplace programs allow a seller or platform to settle a claim without creating a recoverable product asset: Walmart sellers can establish Keep It rules, Amazon supports returnless resolutions and liquidation programs, and marketplace refund policies can separate the customer payment from later physical disposition.',
        'The accounting makes that split visible. Amazon reports a return-allowance liability and a separate asset for rights to recover products from customers. Nike reports a sales-returns reserve separately from its inventory reserve. The refund obligation and the expected value of returned goods are related, but they are not the same balance or the same event.',
        'Ownership also changes who absorbs the loss. A vertically integrated retailer usually owns the inventory and controls disposition. A marketplace can process the refund and the physical return while a third-party seller remains economically exposed. Vendor credits, consignment terms, carrier claims, insurance, and platform protections can move a portion of the loss without changing the customer experience.',
      ],
      table: {
        caption: 'The four records that should remain separate in a return analysis',
        columns: ['Record', 'What it measures', 'Typical decision owner', 'Common analytical error'],
        rows: [
          ['Customer refund', 'Cash or credit returned to the buyer', 'Retailer, seller, or platform policy', 'Treating the refund as proof the product came back'],
          ['Retailer exposure', 'Contribution after refund, costs, fees, and recovery', 'Inventory owner and contractual counterparties', 'Calling a unit model GAAP profit or loss'],
          ['Physical recovery', 'Whether the correct item or material remains available', 'Return center, seller, retailer, or 3PL', 'Equating possession with resale eligibility'],
          ['Environmental disposition', 'Reuse, donation, recycling, destruction, or an unobserved downstream route', 'Inventory owner and downstream processor', 'Counting liquidation transfer as proven reuse'],
        ],
      },
    },
    {
      id: 'return-decision-engine',
      title: 'How the reverse logistics returns process chooses a route',
      paragraphs: [
        'The immediate retrieval rule is compact: expected disposition recovery must exceed reverse freight, inspection, and fraud-administration cost. The route engine then compares only legally and commercially eligible outcomes and selects the highest present-value net proceeds after cleaning, testing, storage, selling fees, secondary transport, disposal cost, and delay.',
        'Condition matters twice. It changes expected proceeds and changes which routes are available. An unopened item can support primary restock. A lightly used device may justify refurbishment. An opened cosmetic may retain physical material while losing commercial resale eligibility. A substituted laptop can have almost no legitimate recovery but high evidentiary value.',
        'The calculation is still subordinate to policy. Safety, recall, identity, abuse prevention, customer service, brand restrictions, vendor agreements, and environmental duties can require possession or block an otherwise attractive resale route.',
      ],
      figures: [
        {
          src: '/images/research/online-returns-disposition-decision-tree.png',
          alt: 'Decision tree that tests resale eligibility, identity, condition, and present-value proceeds before choosing restock, liquidation, donation, recycling, destruction, or an evidence hold.',
          label: 'Figure 01 / Disposition decision tree',
          caption:
            'The economically best route is selected only after legal eligibility, identity, condition, and channel constraints are applied.',
          width: 845,
          height: 602,
        },
      ],
    },
    {
      id: 'return-center',
      title: 'What happens to online returns at a return center',
      paragraphs: [
        'Consolidation can reduce transportation and per-unit receiving cost, but it also delays resale. Inspection is not one uniform task. Apparel may require tag, odor, wear, size, and season checks. Electronics add serial identity, activation, battery health, accessories, data risk, and function tests. Furniture adds structural condition, missing hardware, assembly state, and packaging damage. Beauty turns on seals and product integrity.',
        'The cost of learning can be worth more than the physical handling. The modeled $100 headphones support roughly 55 minutes of inspection at the assumed labor rate before retrieval turns negative. The $20 household item cannot support the two-minute base inspection under its weighted parcel route. Deeper inspection is rational when it opens a much stronger resale channel.',
        'For the headphones, testing helps preserve $33.37 of expected net disposition recovery. Yet the refund, product cost, outbound fulfillment, reverse freight, intake, fraud administration, secondary costs, and failed-unit risk still leave post-return contribution at negative $31.24.',
      ],
      figures: [
        {
          src: '/images/research/online-returns-headphones-waterfall.png',
          alt: 'Waterfall chart for a 100 dollar headphones return showing the refund, product cost, outbound fulfillment, reverse freight, inspection, recovery proceeds, and negative post-return contribution.',
          label: 'Figure 02 / $100 headphones waterfall',
          caption:
            'Testing preserves a higher-value channel, but the recovery chain still consumes most of the original order economics.',
          width: 2954,
          height: 1415,
        },
      ],
    },
    {
      id: 'nine-product-grid',
      title: 'Online return outcomes across nine products and three prices',
      paragraphs: [
        'The model holds retail price at $20, $100, or $500 and changes package geometry, condition mix, inspection, channel eligibility, fraud exposure, and resale recovery. The spread inside each price tier is the point. A low-value item can be worth retrieving through a store but not by parcel. A premium item can carry a large return tax and still support retrieval because enough value remains to recover.',
        'Return tax is kept-sale contribution minus post-return contribution. Under the required formula, landed product cost, original fulfillment, and original payment expense appear in both cases and cancel from the incremental dollar tax. They still determine the post-return loss and the percentage of kept-sale contribution consumed by the return.',
      ],
      table: {
        caption: 'Probability-weighted base-case unit economics; model outputs, not retailer disclosures',
        columns: ['Archetype', 'Price', 'Retrieval value after fraud admin', 'Return tax / returned order', 'Base operating decision'],
        rows: [
          ['$20 clothing', '$20', '$2.03', '$17.97', 'Retrieve through store/drop-off; returnless for long parcel'],
          ['$20 beauty', '$20', '−$0.31', '$20.31', 'Returnless for parcel; retrieve through store'],
          ['$20 household', '$20', '−$4.71', '$24.71', 'Returnless for parcel; retrieve through store'],
          ['$100 footwear', '$100', '$41.70', '$58.30', 'Retrieve'],
          ['$100 headphones', '$100', '$22.56', '$77.44', 'Retrieve'],
          ['$100 appliance', '$100', '$3.77', '$96.23', 'Retrieve; low-recovery case turns negative'],
          ['$500 laptop/phone', '$500', '$177.28', '$322.72', 'Retrieve'],
          ['$500 furniture', '$500', '−$14.04', '$514.04', 'Use store/local route; avoid centralized oversize'],
          ['$500 accessory', '$500', '$251.43', '$248.57', 'Retrieve'],
        ],
      },
    },
    {
      id: 'value-density',
      title: 'Value density explains why centralized furniture recovery can fail',
      paragraphs: [
        'The modeled $500 furniture item carries about $3.60 of retail value per billable pound, compared with more than $71 for the $500 laptop or phone. Its 48 × 20 × 20 inch package produces a 138-pound dimensional weight before rounding. A weighted reverse-freight burden of $98.90 exceeds the item’s maximum economical freight of $85.16.',
        'The result is negative retrieval value under the centralized base route. Store intake, short-distance movement, and local pickup remain positive. Under the model’s local-routing proxy, the break-even pickup distance is about 48 miles. The item still has consumer value; the network loses the ability to move it cheaply enough.',
        'The same constraint appears at $20. Beauty and small-household returns can work through a store or consolidated drop-off while failing through parcel routes. A returnless refund can therefore be a logistics decision rather than a statement that the product has no physical value.',
      ],
      figures: [
        {
          src: '/images/research/online-returns-freight-burden.png',
          alt: 'Grouped bar chart comparing expected reverse freight with maximum economical freight for nine return archetypes.',
          label: 'Figure 03 / Freight burden',
          caption:
            'Low value density breaks retrieval economics when expected reverse freight rises above the product’s maximum economical freight.',
          width: 2624,
          height: 1372,
        },
        {
          src: '/images/research/online-returns-furniture-waterfall.png',
          alt: 'Waterfall chart for a 500 dollar furniture return showing product cost, fulfillment, reverse freight, inspection, disposition proceeds, and negative post-return contribution.',
          label: 'Figure 04 / $500 furniture waterfall',
          caption:
            'The centralized route spends more moving and handling the item than the modeled recovery can support.',
          width: 2954,
          height: 1415,
        },
      ],
    },
    {
      id: 'secondary-market',
      title: 'Liquidation recovery is not the consumer resale price',
      paragraphs: [
        'Liquidation is not one final market. National auction platforms sell pallets and truckloads to regional wholesalers, bin stores, local auctions, repair shops, eBay sellers, social sellers, exporters, parts harvesters, and scrap buyers. The inventory labels can mix customer returns with overstock, shelf pulls, salvage, and other conditions.',
        'The winning bid is not the buyer’s cost and not the retailer’s final net recovery. Buyer premium, freight, liftgate service, residential delivery, unloading, inspection, repair, storage, failed units, listing fees, customer returns, and resale labor sit between the auction and the final sale. The downstream spread pays for real work and risk.',
        'The supplied public sample is intentionally small: two completed Walmart/B-Stock lots. The microwave lot implies a bid near 14.6% of stated retail and the eBike lot about 19.6%. With explicit buyer-premium and freight assumptions, modeled delivered cost rises to 26.7% and 49.4%. Estimated retailer net recovery after seller-side fees and preparation is roughly 10% to 12%. These two observations describe the lots; they do not estimate the market.',
      ],
      figures: [
        {
          src: '/images/research/online-returns-auction-recovery.png',
          alt: 'Two-lot auction chart comparing winning bid and delivered buyer cost against stated retail and adjusted current retail.',
          label: 'Figure 05 / Completed public auctions',
          caption:
            'Bid recovery, buyer delivered cost, and retailer net recovery are different denominators and should not be reported as one number.',
          width: 2294,
          height: 1393,
        },
        {
          src: '/images/research/online-returns-retailer-reseller-waterfall.png',
          alt: 'Two-part waterfall showing microwave-lot value survival for the retailer and the reseller break-even bridge.',
          label: 'Figure 06 / Retailer-to-reseller value bridge',
          caption:
            'The gap between retailer recovery and final resale compensates the buyer for freight, testing, repair, storage, failed units, selling costs, and execution risk.',
          width: 2678,
          height: 1370,
        },
      ],
    },
    {
      id: 'fraud-controls',
      title: 'Fraud changes the decision, but controls have their own return tax',
      paragraphs: [
        'The model separates lost recovery from investigation and claims administration. A substituted or missing item receives zero legitimate disposition recovery, so the lost product value already enters through the condition probabilities. The separate administration allowance contains only the additional investigation and claims burden. This avoids counting the missing item twice.',
        'A control can cost more than it saves. The illustrative control case adds inspection time, false-positive customer-service cost, and refund delay. It is negative for the modeled $100 footwear and headphones, but positive for the $500 electronics and accessory because loss given substitution is much larger.',
        'That is not a universal recommendation. The fraud probabilities are explicit assumptions rather than exact category rates. The result demonstrates why controls should be calibrated to recoverable value, identity risk, and customer harm—not retail price or a broad industry fraud headline alone.',
      ],
      figures: [
        {
          src: '/images/research/online-returns-fraud-loss.png',
          alt: 'Line chart showing expected fraud loss as confirmed substitution probability rises for 100 dollar and 500 dollar product archetypes.',
          label: 'Figure 07 / Fraud expected-loss sensitivity',
          caption:
            'Fraud loss rises with recoverable value and claims cost; the two premium archetypes justify a materially higher control budget.',
          width: 2294,
          height: 1349,
        },
      ],
    },
    {
      id: 'environmental-boundary',
      title: 'Financial recovery does not establish the environmental endpoint',
      paragraphs: [
        'A sustainability claim needs a denominator and a defined endpoint. A large count of items resold or donated can prove program scale without disclosing the share of customer returns, the share of third-party inventory, or the outcome of every product that entered the network. “Proper disposal” establishes a policy outcome without separating recycling, hazardous handling, incineration, energy recovery, or landfill.',
        'Liquidation proves title transfer, not reuse. The buyer may resell, repair, export, part out, recycle, or discard the product. Unless the downstream endpoint is observed, liquidation belongs in its own category rather than being counted automatically as circular recovery.',
        'The model therefore separates direct resale or reuse, liquidation transfer with an unobserved downstream endpoint, donation, recycling or material recovery, destruction or disposal, and fraudulent or missing units. These are scenario routes, not measured retailer diversion rates.',
      ],
      figures: [
        {
          src: '/images/research/online-returns-environmental-routes.png',
          alt: 'Stacked bars showing modeled physical routes for nine product archetypes while warning that scenario routes are not measured environmental outcomes.',
          label: 'Figure 08 / Physical routes and environmental limits',
          caption:
            'The route model preserves liquidation as downstream-unobserved rather than labeling every transferred item as reuse.',
          width: 2514,
          height: 1354,
        },
      ],
    },
    {
      id: 'online-returns-questions',
      title: 'What happens to online returns? Five direct answers',
      paragraphs: [
        'The shortest accurate answer is that there is no single destination. The reverse logistics returns process evaluates identity, condition, safety, freight, inspection cost, resale eligibility, delay, and expected recovery before the inventory owner chooses a route.',
      ],
      table: {
        caption: 'Direct answers to common online-return questions',
        columns: ['Question', 'Answer'],
        rows: [
          [
            'Do online returns get resold?',
            'Many do when identity, condition, safety, and channel rules permit restocking, open-box sale, refurbishment, or secondary-market resale. A refund alone does not prove that resale occurred.',
          ],
          [
            'Are online returns thrown away?',
            'Some are destroyed or disposed of when safety, contamination, recall, identity, damage, or recovery economics block reuse. Public evidence rarely supports one retailer-wide disposal percentage.',
          ],
          [
            'Why do retailers issue returnless refunds?',
            'A retailer may refund without retrieval when reverse freight, inspection, and handling cost more than expected recovery, or when safety and policy make the item ineligible for resale.',
          ],
          [
            'What does a reverse logistics return center do?',
            'It consolidates products, verifies identity, inspects condition, tests eligible items, records evidence, and routes inventory to restock, refurbishment, liquidation, donation, recycling, disposal, or an evidence hold.',
          ],
          [
            'What determines where an online return goes?',
            'The decision combines product ownership, condition probabilities, route eligibility, value density, freight, inspection, fees, fraud exposure, delay, and the present value of each recoverable channel.',
          ],
        ],
      },
    },
    {
      id: 'method-and-limitations',
      title: 'How to read the model and where it stops',
      paragraphs: [
        'The workbook is an auditable decision model rather than a forecast. It contains separate input, route, condition, disposition, unit-economic, threshold, fraud, sustainability, auction, evidence, assumption, and fact-check sheets. Hardcoded inputs remain visually distinct from inter-sheet links and formulas.',
        'The base case uses nine product archetypes and seven condition states. The condition engine evaluates eligible disposition routes and selects the highest present-value net recovery. The logistics engine then tests store return, consolidated drop-off, short and long parcel, oversize shipment, local pickup, and pallet liquidation. Sensitivities change condition mix, freight, inspection, fees, fraud, delay, recovery, and other drivers.',
        'The model cannot establish retailer-wide route shares, negotiated carrier rates, category-specific fraud incidence, realized liquidation fees, environmental endpoints, or company profitability. Public tariffs are not merchant contracts. Vendor cases are not random samples. Two closed auctions are not a market distribution. The downloadable report and workbook retain the full assumption register, source hierarchy, fact-check list, and source index so those limits remain clear.',
      ],
    },
  ],
  sources: [
    {
      label: 'Amazon 2025 Form 10-K — return liability and recovery asset',
      href: 'https://www.sec.gov/Archives/edgar/data/1018724/000101872426000004/amzn-20251231.htm',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Walmart Marketplace — Add a Keep It Rule',
      href: 'https://marketplacelearn.walmart.com/guides/Order%20management/Returns%20%26%20refunds/Add-a-Keep-It-Rule',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Target — Reverse Logistics Expert role',
      href: 'https://corporate.target.com/jobs/w43/09/reverse-logistics-expert',
      lastVerified: '2026.07.22',
    },
    {
      label: 'eBay — Refunding buyers',
      href: 'https://www.ebay.com/help/selling/managing-returns-refunds/refunding-buyers?id=5182',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Ulta Beauty — returns and returned-merchandise disposition',
      href: 'https://www.ulta.com/guestservices/all',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Best Buy — return and exchange policy',
      href: 'https://www.bestbuy.com/site/help-topics/return-exchange-policy/pcmcat260800050014.c?id=pcmcat260800050014',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Wayfair 2025 Form 10-K — bulky-product handling and returns risk',
      href: 'https://www.sec.gov/Archives/edgar/data/1616707/000161670726000027/w-20251231.htm',
      lastVerified: '2026.07.22',
    },
    {
      label: 'FDA — cosmetics and U.S. law',
      href: 'https://www.fda.gov/cosmetics/cosmetics-laws-regulations/cosmetics-us-law',
      lastVerified: '2026.07.22',
    },
    {
      label: 'UPS — shipping dimensions and weight',
      href: 'https://www.ups.com/us/en/support/shipping-support/shipping-dimensions-weight',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Walmart Fulfillment Services fee schedule',
      href: 'https://marketplacelearn.walmart.com/guides/Walmart%20Fulfillment%20Services%20%28WFS%29/WFS%20basics/WFS-fees',
      lastVerified: '2026.07.22',
    },
    {
      label: 'UPS 2026 daily rates',
      href: 'https://assets.ups.com/adobe/assets/urn%3Aaaid%3Aaem%3A356d938a-4f0a-4c71-b50e-bdd890f50b47/original/as/daily-rates-us-en.pdf',
      lastVerified: '2026.07.22',
    },
    {
      label: 'FedEx 2026 Service Guide',
      href: 'https://www.fedex.com/content/dam/fedex/us-united-states/services/Service_Guide_2026.pdf',
      lastVerified: '2026.07.22',
    },
    {
      label: 'CPSC — stop online sale of recalled products',
      href: 'https://www.cpsc.gov/Business--Manufacturing/Business-Education/ResaleThrift-Stores-Information-Center/Stop-Online-Sale-of-Recalled-Products',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Amazon 2024 Sustainability Report',
      href: 'https://sustainability.aboutamazon.com/2024-amazon-sustainability-report.pdf',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Online-auction field study of end-of-life apparel inventory',
      href: 'https://www.researchgate.net/publication/222881906_Can_retailers_get_higher_prices_for_end-of-life_inventory_through_online_auctions',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Amazon seller communication — FBA Liquidations typical recovery',
      href: 'https://sellercentral.amazon.com/seller-forums/discussions/t/7baf9138523e2e98ec8eb5f91875dd80',
      lastVerified: '2026.07.22',
    },
    {
      label: 'B-Stock Walmart eBikes lot 150245',
      href: 'https://walmart.bstock.com/auction/auction/view/id/150245/',
      lastVerified: '2026.07.22',
    },
    {
      label: 'B-Stock Walmart microwaves lot 150184',
      href: 'https://walmart.bstock.com/auction/auction/view/id/150184/',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Liquidation.com terms and conditions',
      href: 'https://www.liquidation.com/c/terms.html',
      lastVerified: '2026.07.22',
    },
    {
      label: 'Amazon U.S. Liquidation Auctions shipping terms',
      href: 'https://bstock.com/amazon/shipping/',
      lastVerified: '2026.07.22',
    },
  ],
};
