import type { ArticleSection } from './articleModels';

export const US_RARE_EARTH_MAGNET_CAPACITY_AUDIT_SECTIONS_3: ArticleSection[] = [
  {
    "id": "capacity-is-not-fungible-blocks-shapes-grades-and-qualification",
    "title": "Capacity is not fungible: blocks, shapes, grades and qualification",
    "paragraphs": [
      "The national table uses tonnes because mass is the only common public unit. Tonnes are still a poor proxy for customer usefulness.",
      "A sintered NdFeB plant begins with an alloy whose chemistry depends on the target magnetic properties and operating environment. Powder is milled under controlled oxygen conditions, aligned in a magnetic field, pressed, sintered and heat treated. The resulting block then has to be cut or ground into a customer-specific geometry, coated against corrosion and magnetized. Tolerances can be tight, magnets are brittle, and machining creates substantial material loss. Commerce describes a production chain in which the yield of individual steps compounds to only 54-81% recovery from alloy to final magnet. [1]",
      "A 375-tonne stream of sintered blocks is therefore not equivalent to 375 tonnes of customer-ready finished pieces. HyProMag's phased plan makes the distinction explicit. It plans to install cutting and finishing equipment first, using up to 20 tonnes of blocks from the United Kingdom and Germany to work with U.S. customers on dimensions, tolerances, coatings, performance requirements and qualification. Integrated U.S. recycling and magnet manufacture comes later. [15]",
      "Grade is another hidden dimension. NdFeB magnets contain mostly neodymium and praseodymium, while dysprosium and terbium are often added or diffused to preserve coercivity at elevated temperatures. An automotive traction motor, a missile actuator, a data-center motor and a consumer-electronics part can demand different thermal performance, geometry, coating, traceability, life testing and approved process windows. The IEA identifies magnet manufacturing and metallisation—the conversion of oxides into metals, alloys or powders—as the acute downstream bottlenecks in diversification. It also notes that non-Chinese equipment such as strip casters, electrolysis cells, alignment pressers and grain-boundary-diffusion equipment can be scarce, costly and subject to multi-year lead times. [2]",
      "Qualification converts technical capacity into saleable capacity. A customer may require dimensional capability studies, magnetic-property distributions, corrosion testing, thermal aging, coating adhesion, material traceability, production-part approval, regulatory testing and repeated lots from the intended commercial line. A supplier that can make one acceptable sample has not necessarily demonstrated a stable process at rate. That is why MP's qualification deliveries and HyProMag's early finishing strategy matter: they expose the customer interface before or during scale-up rather than after the factory is nominally complete. [4][15]",
      "The practical unit of supply is therefore not “one tonne of NdFeB.” It is one tonne of a specified, qualified product family delivered on time with acceptable yield and repeatability. Public announcements rarely disclose enough grade-level detail to aggregate that unit nationally. The audit can identify the limitation; it cannot manufacture the missing data."
    ]
  },
  {
    "id": "the-material-balance-is-larger-than-the-finished-magnet-number",
    "title": "The material balance is larger than the finished-magnet number",
    "paragraphs": [
      "The 38,000-tonne headline is saleable or named magnet capacity. It is not the gross mass that must move through alloy preparation, powder production, pressing, sintering and machining.",
      "Commerce reports that total recovery from alloy to finished magnet can range from about 54% to 81%. It also says machining swarf is often recycled back into the process, and some industry participants question the viability of manufacturing without swarf recycling. [1] Applying the recovery range to the audited capacity produces a useful stress test:",
      "This is not a forecast of virgin alloy purchases. Internal swarf recovery, external recycling, returned scrap and purchased end-of-life magnets can circulate material and reduce replacement feed. HyProMag's entire process is designed around short-loop recycled magnets. Noveon also uses recycled feedstock as part of its manufacturing platform. The calculation instead answers a narrower physical question: what annual mass flow must the process system handle if the full nameplate stack runs at saleable output?",
      "The result is consequential. A 38,000-tonne finished-magnet industry is a roughly 46,000-70,000-tonne gross alloy-processing system before considering work-in-process inventories, customer-specific yield differences and start-up scrap. At the typical composition used by Commerce—about 69% iron, 30% rare earths and 1% boron—the gross flow contains roughly 14,000-21,000 tonnes of rare earths. [1]",
      "That quantity does not map directly to a single upstream market. The mix of neodymium, praseodymium, dysprosium and terbium depends on grade and process technology. Oxides must be separated, reduced to metal, alloyed, cast and converted into powder. Some U.S. programs integrate several steps; others rely on partners, imported alloy or imported blocks during early phases. Energy Fuels began construction in July 2026 on planned U.S. dysprosium and terbium oxide capacity, describing heavy rare earth production as a severe North American and European pinch point. The project is evidence of progress and of the remaining gap: oxide construction is upstream work still in progress, not an already operating source of qualified high-temperature magnet input. [17]",
      "The IEA's global numbers reinforce the mismatch. China accounted for 94% of sintered permanent-magnet production in 2024. Announced diversified mining capacity is much larger than downstream metal, alloy and magnet capacity, leaving metallisation and magnet manufacture as the bottleneck. [2] A U.S. plant with an installed press and furnace can still be exposed if the required metal, alloy, heavy-rare-earth additive, equipment spare, coating chemistry or qualified block comes from a concentrated source."
    ],
    "table": {
      "columns": [
        "Calculation",
        "Low case",
        "High case"
      ],
      "rows": [
        [
          "Finished magnet capacity",
          "37,584 tpa",
          "38,048 tpa"
        ],
        [
          "Alloy-to-magnet recovery",
          "81%",
          "54%"
        ],
        [
          "Gross alloy process flow",
          "46,400 tpa",
          "70,459 tpa"
        ],
        [
          "Rare-earth share of magnet/alloy mass",
          "30%",
          "30%"
        ],
        [
          "Rare earths in gross process flow",
          "13,920 tpa",
          "21,138 tpa"
        ],
        [
          "Rare earths embedded in finished magnets",
          "11,275 tpa",
          "11,414 tpa"
        ]
      ],
      "caption": "National gross material-flow sensitivity at full nameplate output"
    },
    "figures": [
      {
        "src": "/images/research/us-ndfeb-material-flow-sensitivity.svg",
        "alt": "Range chart comparing finished magnet capacity, gross alloy process flow, rare earth content in process flow, and rare earth content in finished magnets.",
        "label": "Figure 03 / Material-flow sensitivity",
        "caption": "Commerce’s 54 to 81 percent alloy-to-magnet recovery range turns about 38,000 tonnes of finished capacity into roughly 46,000 to 70,000 tonnes of gross annual process flow.",
        "width": 1800,
        "height": 1080
      }
    ]
  }
];
