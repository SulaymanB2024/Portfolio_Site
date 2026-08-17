import type { ArticleSection } from './articleModels';

export const UNI_BURN_SUPPLY_ACCOUNTING_SECTIONS_2: ArticleSection[] = [
  {
    "id": "the-20-million-growth-budget-is-distribution-not-issuance",
    "title": "The 20 million growth budget is distribution, not issuance",
    "paragraphs": [
      "UNIfication created an annual growth budget of 20 million UNI, distributed quarterly through a vesting contract. The executed proposal approved two years, or 40 million UNI, while stating that the UNI remains in treasury until vested and that unvested authorization can be cancelled. OpenZeppelin’s audit describes an initial 5 million UNI quarterly release and the relevant custody and control mechanics. [1][6]",
      "The growth budget and UNI’s 2% mint cap happen to share the same initial quantity: 20 million UNI on a 1 billion base. They are not the same mechanism.",
      "A vesting release can create supply pressure, but only through behavior. The relevant chain is:",
      "treasury authorization → vesting release → operating custody → grant/vendor/incentive/other use → recipient behavior → potential market sale",
      "Skipping the middle steps turns a schedule into a false observation.",
      "The independent August 1 analysis reported roughly 14 million UNI in the designated operating wallet and roughly 267.2 million UNI in treasury, with no market deployment identified in its 90-day observation window. Those figures are useful and time-sensitive. They support the conclusion that scheduled releases had not automatically become equivalent market float during that window. They do not prove that the wallet will never spend or sell. [8]",
      "The right model therefore uses a sell-through variable."
    ],
    "table": {
      "caption": "Separate UNI treasury distribution, minting, and burn mechanisms",
      "columns": [
        "Mechanism",
        "Source of tokens",
        "Changes totalSupply()?",
        "Immediate market effect"
      ],
      "rows": [
        [
          "20M annual growth budget",
          "Existing treasury UNI",
          "No",
          "Depends on downstream disposition"
        ],
        [
          "Up to 2% annual mint authority",
          "Newly created UNI",
          "Yes",
          "Depends on whether mint occurs and how tokens are used"
        ],
        [
          "Recurring fee burn",
          "UNI paid by searchers",
          "No contract reduction; increases dead-address balance",
          "Removes economically available UNI"
        ],
        [
          "100M retroactive burn",
          "Existing treasury UNI",
          "No contract reduction; increases dead-address balance",
          "One-time cancellation of controlled overhang"
        ]
      ]
    }
  },
  {
    "id": "the-sell-through-threshold-is-66-to-80",
    "title": "The sell-through threshold is 66% to 80%",
    "paragraphs": [
      "Define:",
      "- B = annual recurring UNI burn;",
      "- G = annual scheduled growth budget, 20 million UNI;",
      "- s = share of the growth budget that reaches the market;",
      "- M = newly minted UNI that reaches the market.",
      "Then:",
      "Net market absorption = B - (G × s) - M",
      "Positive values mean the recurring burn removes more UNI than modeled protocol distributions add to market supply. Negative values mean modeled distributions exceed the burn.",
      "The base case sets M = 0 because no exercised mint was identified. The break-even sell-through is:",
      "B / G",
      "Using the two burn rates:",
      "- low case: 13.26M / 20M = 66.3%;",
      "- high case: 15.93M / 20M = 79.7%.",
      "If less than roughly two-thirds of the annual budget reaches the market, both burn-rate cases imply net market absorption. If more than roughly four-fifths reaches the market, both imply net release. Between those points, the answer depends on the burn rate.",
      "Figure 3. No-new-mint sensitivity. Positive values mean the recurring burn exceeds modeled growth-budget sell-through. Negative values mean modeled sell-through exceeds the burn. Source: author model.",
      "This sensitivity is the central result. It replaces a hidden assumption with an observable question.",
      "The gross numerical difference between the 20 million schedule and the burn range was 4.07 million to 6.74 million UNI per year. That gap should not be called net inflation. It is the amount that would remain if 100% of the annual budget reached the market and no other variables changed.",
      "At 50% sell-through, the modeled sink remained positive by 3.26 million to 5.93 million UNI per year. At the independent analysis’s reported operating-wallet accumulation, a lower sell-through assumption was more consistent with the observed window than an automatic 100% assumption. That can change."
    ],
    "table": {
      "caption": "No-new-mint sensitivity to growth-budget sell-through",
      "columns": [
        "Growth-budget sell-through",
        "Net absorption at 13.26M burn",
        "Net absorption at 15.93M burn",
        "Interpretation"
      ],
      "rows": [
        [
          "0%",
          "+13.26M",
          "+15.93M",
          "Net UNI removal"
        ],
        [
          "25%",
          "+8.26M",
          "+10.93M",
          "Net UNI removal"
        ],
        [
          "50%",
          "+3.26M",
          "+5.93M",
          "Net UNI removal"
        ],
        [
          "66.3%",
          "~0.00M",
          "+2.67M",
          "Low case breaks even"
        ],
        [
          "75%",
          "-1.74M",
          "+0.93M",
          "Mixed"
        ],
        [
          "79.7%",
          "-2.67M",
          "~0.00M",
          "High case breaks even"
        ],
        [
          "100%",
          "-6.74M",
          "-4.07M",
          "Net UNI release"
        ]
      ]
    },
    "figures": [
      {
        "src": "/images/research/uni-market-absorption-sensitivity.svg",
        "label": "Figure 03 / Net market absorption sensitivity",
        "width": 1200,
        "height": 720,
        "alt": "The answer changes at 66% to 80% sell-through",
        "caption": ""
      }
    ]
  },
  {
    "id": "the-growth-budget-can-earn-a-return",
    "title": "The growth budget can earn a return",
    "paragraphs": [
      "A pure token-flow bridge treats a sold UNI as supply entering the market. It does not judge what the spending buys.",
      "A 20 million UNI budget used for ineffective incentives would be economically worse than the same distribution used to build a product, acquire distribution, support liquidity, or create fee-generating integrations. A serious valuation needs both sides:",
      "1. the market supply created by spending;",
      "2. the future protocol activity created by the spending.",
      "The second side is harder to measure and easier to overstate. The executed services arrangement commits the budget to protocol growth and development, with reporting obligations and a broad mandate that can include developer support, grants, incentives, partnerships, product distribution, and other investments. [1]",
      "The appropriate test is not “Did the wallet spend UNI?” It is:",
      "Did each cohort of spending produce additional durable protocol fees, liquidity, volume, integrations, or strategic control worth more than the token cost and resulting supply pressure?",
      "That requires cohort-level budget reporting. At minimum:",
      "- date and amount of each release;",
      "- recipient or program category;",
      "- token disposition;",
      "- exchange deposits or market sales where observable;",
      "- stated objective;",
      "- incremental protocol usage;",
      "- incremental fee pots and UNI burns;",
      "- duration of the effect;",
      "- counterfactual or control where possible.",
      "Without that evidence, the growth budget is neither automatically dilution nor automatically productive investment. It is a controlled overhang with an uncertain return."
    ]
  },
  {
    "id": "what-a-uni-valuation-model-should-measure",
    "title": "What a UNI valuation model should measure",
    "paragraphs": [
      "A conventional price-to-sales multiple is a poor starting point for UNI after UNIfication.",
      "Protocol fees do not become a corporate revenue account available for dividends. They accumulate in TokenJar and are exchanged through a permissionless claim mechanism for fixed UNI payments. Holders do not have a pro-rata claim. The token’s economic benefit is indirect, through scarcity, governance, and the future policy of the system.",
      "A better framework has six components.",
      "1. Contract supply.",
      "Use totalSupply() for contract accounting, mint-cap analysis, and FDV conventions. Do not reduce it when UNI moves to 0xdead.",
      "2. Effective supply.",
      "Subtract recognized dead-address balances for scarcity analysis. Label the methodology and addresses included.",
      "3. Protocol-controlled overhang.",
      "Track treasury, vesting, operating, grant, incentive, bridge, and other controlled balances separately. Avoid counting the same UNI twice as it moves between controlled wallets.",
      "4. Recurring external demand.",
      "Measure UNI paid by searchers, by chain and fee source. Separate transaction counts, fixed UNI thresholds, fee-pot values, timing, and searcher margins. A higher token price may change claim frequency even if the token amount per claim stays fixed.",
      "5. Distribution and minting.",
      "Measure actual operating-wallet disposition, not only scheduled release. Add any exercised mint separately because it changes contract supply. If governance eventually uses both the 20 million growth schedule and a full 2% mint, the gross token flow could reach 40 million UNI before burns. That is a scenario, not the current base case.",
      "6. Endogenous protocol response.",
      "Protocol fees can alter LP returns, liquidity, routing, and volume. Fee expansion can also increase the set of fee-generating pools and chains. The direction is empirical.",
      "A July 2026 working paper used a matched event-study design and did not detect a large short-run average response in active liquidity or local depth for the studied fee changes. That result is useful because it weakens the strongest immediate-liquidity-collapse argument. It does not establish zero cost, no pool-level heterogeneity, or no long-run response. [9]",
      "The valuation output should therefore be a set of scenarios rather than one mechanical multiple.",
      "The model should report token quantities first, then dollar values at synchronized timestamps. Mixing current token price with historical burns or fee pots can manufacture precision."
    ],
    "table": {
      "caption": "Scenario drivers for a UNI valuation model",
      "columns": [
        "Scenario driver",
        "Bear case",
        "Base case",
        "Bull case"
      ],
      "rows": [
        [
          "Fee coverage and volume",
          "Fee take reduces LP competitiveness or routing share",
          "Fee coverage expands while core volume holds",
          "v4, Unichain, hooks, and integrations add net fee-generating volume"
        ],
        [
          "Auction economics",
          "Higher UNI cost delays claims; pots accumulate",
          "Auctions clear at observed frequencies",
          "Better tooling and more fee sources raise claim frequency"
        ],
        [
          "Growth-budget sell-through",
          "Most distributed UNI reaches market",
          "Partial spending with operating-wallet retention",
          "Low sell-through and strong recipient holding"
        ],
        [
          "Growth return",
          "Spending fails to create durable usage",
          "Mixed program returns",
          "Spending creates fee growth exceeding token cost"
        ],
        [
          "Minting",
          "Governance exercises the cap",
          "No mint",
          "No mint and stronger treasury discipline"
        ],
        [
          "Holder-rights discount",
          "Governance and indirect scarcity receive a large discount",
          "Current rights remain stable",
          "Governance adds stronger holder-directed economics"
        ]
      ]
    }
  },
  {
    "id": "why-erc-20-accounting-still-matters",
    "title": "Why ERC-20 accounting still matters",
    "paragraphs": [
      "A critic can reasonably argue that dead-address tokens are gone in every way that matters. They cannot be sold, used for grants, or deployed as incentives. Why insist that total supply remains 1 billion?",
      "Because the denominator appears in real systems.",
      "- block explorers and data vendors report it;",
      "- smart contracts can read it;",
      "- governance and analytics can use it;",
      "- the 2% mint cap is calculated from it;",
      "- FDV conventions often multiply it by price;",
      "- bridges, indexers, and dashboards can disagree if one subtracts dead balances and another does not.",
      "A token can be economically deflationary while its ERC-20 supply is unchanged. The accurate phrase is not “UNI’s total supply fell to 892 million.” It is:",
      "UNI’s contract total supply remained 1 billion, while the recognized dead-address-adjusted effective supply fell to approximately 891.975 million.",
      "That sentence prevents downstream errors without denying the economic effect."
    ]
  }
];
