import type { ArticleSection } from './articleModels';

export const US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_1: ArticleSection[] = [
  {
    "id": "what-the-38-000-tonne-figure-actually-contains",
    "title": "What the 38,000-tonne figure actually contains",
    "paragraphs": [
      "The audit includes only U.S.-located sintered NdFeB magnet facilities or non-double-counted program components with an explicit annual capacity disclosure available by August 16, 2026. It excludes rare-earth-free magnets, bonded-magnet capacity, pure oxide/metal/alloy capacity, optional expansions, vague “beyond” targets, concept-study plants, and pilot lines without a primary-source capacity number.",
      "Sources: MP SEC filing and Q2 update [3][4]; USA Rare Earth and NIST [5][6][7]; eVAC/VAC [8][9]; Noveon [10][11]; Vulcan [12]; Georgia/JS Link [13]; HyProMag [14][15].",
      "The range is not cosmetic. Noveon and Georgia use “tons” without specifying whether they mean 2,000 pounds or 1,000 kilograms. If both are short tons, the national total falls by 464 metric tonnes. The uncertainty is small relative to the 38,000-tonne total, but it exposes a broader problem: public capacity tables often erase the units, definitions and dates that determine whether rows are comparable.",
      "The USA Rare Earth rows require a second control. The company has disclosed a 600-tonne Phase 1a target, a 1,200-tonne Phase 1a-plus-1b target, 6,400 tonnes at Blacksburg and a 10,000-tonne combined U.S. program. These are nested, not additive. The audit counts the 10,000-tonne corporate total once, assigns the explicit 600-tonne Phase 1a line to the ramp bucket, and uses a derived 9,400-tonne remainder only to keep the maturity arithmetic consistent. That remainder is not presented as a company-disclosed production line. [5][6][7]",
      "HyProMag creates a different trap. Its full Texas design is 1,526 tonnes of “total NdFeB products,” but 359 tonnes are alloy powder and 119 tonnes are swarf and offcuts. The magnet count is 1,048 tonnes: 673 tonnes of finished magnets plus 375 tonnes of sintered blocks. Counting the co-products as magnets would overstate finished-magnet capacity by 46%. [14]",
      "The same discipline excludes several tempting numbers. VAC's optional pathway to 4,000 or 12,000 tonnes is not current nameplate and is therefore omitted. Noveon's statement that it will expand “beyond 2,000 tons” supplies no new denominator. HyProMag's concept pathway to 4,656 tonnes is not the current plant design. Vulcan's separate Durham operation is commercially meaningful, but the company does not publish a primary-source annual capacity for it. An externally estimated pilot figure would make the national table look more precise while making it less reproducible."
    ],
    "table": {
      "columns": [
        "Company / facility",
        "Disclosed annual capacity",
        "Normalized metric range",
        "Product form",
        "Status at cutoff"
      ],
      "rows": [
        [
          "MP Materials — Independence, Fort Worth",
          "3,000 metric tonnes",
          "3,000",
          "Sintered magnets; integrated precursor chain",
          "Commissioning, start-up and customer qualification"
        ],
        [
          "MP Materials — 10X, Northlake",
          "7,000 metric tonnes",
          "7,000",
          "Sintered magnets",
          "Future; commissioning expected in 2028"
        ],
        [
          "USA Rare Earth — Stillwater Phase 1a",
          "600 metric tonnes",
          "600",
          "Machined, coated, magnetized sintered magnets",
          "Commissioned; 600-tpa run-rate target by Q4 2026"
        ],
        [
          "USA Rare Earth — remaining U.S. program",
          "9,400 metric tonnes, derived remainder",
          "9,400",
          "Sintered magnets; Blacksburg explicitly 6,400 tpa",
          "Future; Stillwater expansion and Blacksburg buildout"
        ],
        [
          "Vulcan Elements — Benson",
          "10,000 metric tonnes",
          "10,000",
          "Rare-earth permanent magnets / sintered NdFeB platform",
          "Future; site selected"
        ],
        [
          "JS Link America — Columbus",
          "3,000 “tons”",
          "2,722-3,000",
          "Rare-earth permanent magnets; sintered NdFeB technology",
          "Future; operations expected late 2027"
        ],
        [
          "Noveon Magnetics — San Marcos",
          "2,000 “tons” baseline",
          "1,814-2,000",
          "Commercial sintered finished magnets",
          "Commercial deliveries; expansion amount undisclosed"
        ],
        [
          "VAC / eVAC — Sumter",
          "2,000 metric tonnes",
          "2,000",
          "Automotive-grade sintered magnets and blocks",
          "Commercial production and shipments"
        ],
        [
          "HyProMag USA — Texas Hub",
          "1,048 metric tonnes",
          "1,048",
          "673 finished magnets + 375 sintered blocks",
          "Future; phased finishing and integrated recycling buildout"
        ],
        [
          "Total",
          "38,048 on stated units",
          "37,584-38,048",
          "",
          ""
        ]
      ],
      "caption": "Audited U.S. sintered NdFeB capacity as of August 16, 2026"
    },
    "figures": [
      {
        "src": "/images/research/us-ndfeb-plant-capacity-ledger.svg",
        "alt": "Horizontal capacity ledger for nine U.S. sintered NdFeB project rows, separated by maturity and normalized annual capacity.",
        "label": "Figure 01 / Plant capacity ledger",
        "caption": "Explicit U.S. sintered NdFeB project capacity totals 37,584 to 38,048 metric tonnes per year after resolving ambiguous units and nested program disclosures.",
        "width": 1800,
        "height": 1260
      }
    ]
  }
];
