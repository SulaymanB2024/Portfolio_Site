import type { ArticleMetric, ArticleResource } from './articleModels';

export const US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_CONTENT: string[] = [
  "The arithmetic is almost irresistible. Add the explicit annual capacity disclosed for the principal U.S. sintered neodymium-iron-boron magnet projects and the total reaches 37,584 to 38,048 metric tonnes per year. The range depends on whether two announcements that say only “tons” mean U.S. short tons or metric tonnes. Set that beside the Department of Energy's high-growth forecast of 37,000 metric tonnes of total U.S. demand in 2030, and the policy story appears complete: America has announced enough factories to cover the market. [1]",
  "That conclusion does not survive a physical audit.",
  "The 38,000-tonne figure is nameplate capacity, not output. On the companies' stated units, only 4,000 tonnes sits at plants with public evidence of commercial shipments and an explicit nameplate figure. Another 3,600 tonnes belongs to commissioned lines still in start-up, ramp or customer qualification. The remaining 30,448 tonnes, four-fifths of the stack, depends on future construction, equipment installation, commissioning or scale-up. The numbers also mix customer-ready magnets with sintered blocks, virgin-feed routes with recycling routes, current plants with corporate programs, and precise metric-tonne disclosures with undefined “tons.”",
  "The demand comparison is weaker still. Commerce says the 37,000-tonne forecast is total demand: direct magnet demand plus magnets already embedded in imported motors, electronics, vehicles and other goods. A U.S. magnet plant cannot displace a magnet inside a foreign-built motor unless the downstream component or product is also made domestically or its supplier changes. Commerce separately reported about 7,500 tonnes of direct sintered-magnet imports in 2021 and cited a Defense Logistics Agency estimate that embedded imports supplied 60% of essential civilian demand. It warned that all of these demand estimates should be approached with caution because the supply chain is opaque. [1]",
  "The better answer is narrower. The announced buildout is a material change in the U.S. industrial position. It could supply defense demand and create a commercially relevant domestic base. It does not yet establish a self-sufficient supply chain. Independence requires qualified output at repeatable rates, the right grade and product form, secure oxide-to-metal-to-alloy inputs, competitive downstream customers, and redundancy. A national nameplate total proves none of those conditions by itself."
];

export const US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_METRICS: ArticleMetric[] = [
  {
    "label": "Explicit project stack",
    "value": "37,584–38,048 TPA"
  },
  {
    "label": "Commercial-shipment nameplate",
    "value": "3,814–4,000 TPA"
  },
  {
    "label": "Future share",
    "value": "≈80%"
  },
  {
    "label": "Primary source records",
    "value": "16"
  }
];

export const US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_RESOURCES: ArticleResource[] = [
  {
    "label": "U.S. NdFeB capacity audit dataset",
    "href": "/research/us-ndfeb-capacity-audit.csv",
    "description": "Plant and program rows with original units, normalized metric ranges, product form, maturity, timing, and inclusion notes.",
    "format": "CSV"
  },
  {
    "label": "U.S. NdFeB source ledger",
    "href": "/research/us-ndfeb-source-ledger.csv",
    "description": "Primary and analytical sources with dates, definitions, supported claims, limitations, and audit notes.",
    "format": "CSV"
  },
  {
    "label": "U.S. NdFeB claim ledger",
    "href": "/research/us-ndfeb-claim-ledger.csv",
    "description": "Load-bearing observed and derived claims, source IDs, status, confidence, calculations, and qualifications.",
    "format": "CSV"
  }
];
