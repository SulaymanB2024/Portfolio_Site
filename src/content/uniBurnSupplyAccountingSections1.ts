import type { ArticleSection } from './articleModels';

export const UNI_BURN_SUPPLY_ACCOUNTING_SECTIONS_1: ArticleSection[] = [
  {
    "id": "the-word-burn-is-doing-too-much-work",
    "title": "The word “burn” is doing too much work",
    "paragraphs": [
      "The UNIfication proposal executed an explicit call:",
      "UNI.transfer(0xdead, 100_000_000 ether)",
      "The Ethereum transaction succeeded on December 27, 2025 at 20:33:11 UTC. The governance interface records the proposal as executed on December 28. The one-day discrepancy is an interface and execution-status issue; this analysis uses the underlying transaction timestamp for the elapsed-day calculation. [1][2]",
      "The transaction sent UNI to 0x000000000000000000000000000000000000dEaD, a recognized dead address. It did not call an ERC-20 burn function. UNI’s deployed contract does not contain one.",
      "That distinction is not pedantry. In the official Uni.sol source:",
      "- totalSupply starts at 1 billion UNI;",
      "- the mint function increases totalSupply;",
      "- ordinary transfers subtract from one balance and add to another;",
      "- a transfer to 0xdead does not decrement totalSupply. [3]",
      "Etherscan therefore continues to display 1 billion UNI as the token’s total supply. The dead-address tokens are treated as economically inaccessible, but they remain part of the contract’s accounting denominator.",
      "This creates two valid statements that sound contradictory:",
      "1. Contract statement: UNI’s total supply remains 1 billion.",
      "2. Economic statement: 108.025 million UNI is no longer available to ordinary holders because it sits at recognized burn addresses.",
      "A useful analysis needs both. It also needs two more ledgers."
    ]
  },
  {
    "id": "four-ledgers-four-different-questions",
    "title": "Four ledgers, four different questions",
    "paragraphs": [
      "The first two can be calculated from contract and burn-address data. The third requires wallet classification. The fourth requires downstream transaction analysis.",
      "The dead-address-adjusted calculation is simple:",
      "1,000,000,000 - 108,025,224 = 891,974,776 UNI",
      "That number is a better scarcity denominator than 1 billion for some questions. It is still not a measure of liquid float. A treasury token outside 0xdead can remain controlled and unavailable to the market. A token in an operating wallet can be spent tomorrow. A token on an exchange can sit dormant for years. Address location is evidence, not a complete behavioral model.",
      "This distinction also matters for future minting. UNI’s contract allows the authorized minter to create up to 2% of totalSupply after the required waiting period. The official documentation says that authority has not been exercised. Because the contract’s accounting supply remains 1 billion, an initial full-cap mint could be up to 20 million UNI, not 17.84 million based on the dead-address-adjusted denominator. [3][4]",
      "The one-time treasury cancellation, recurring fee burns, treasury-funded growth, and contingent minting must therefore remain separate."
    ],
    "table": {
      "caption": "Four UNI supply ledgers at the August 2026 research cutoff",
      "columns": [
        "Ledger",
        "Amount at the cutoff",
        "Question answered",
        "Common misuse"
      ],
      "rows": [
        [
          "ERC-20 contract total supply",
          "1,000,000,000 UNI",
          "How many tokens does the contract recognize?",
          "Calling transfers to 0xdead a reduction in totalSupply()"
        ],
        [
          "Dead-address-adjusted effective supply",
          "891,974,776 UNI",
          "How many recognized tokens are outside the tracked burn addresses?",
          "Calling this “circulating supply” without removing treasury, operating, locked, or inactive balances"
        ],
        [
          "Protocol-controlled overhang",
          "At least the reported treasury and growth-wallet balances",
          "How much inventory remains under protocol or designated operating control?",
          "Assuming every controlled token is already market float"
        ],
        [
          "Market float",
          "Not directly inferred here",
          "How much UNI is plausibly available for sale?",
          "Treating a treasury-to-operating-wallet transfer as an immediate market sale"
        ]
      ]
    }
  },
  {
    "id": "the-100-million-uni-event-was-a-treasury-cancellation-not-a-buyback",
    "title": "The 100 million UNI event was a treasury cancellation, not a buyback",
    "paragraphs": [
      "The executed proposal described the 100 million UNI transfer as a retroactive burn, meant to approximate what might have been burned had protocol fees been active since UNI launched. [1]",
      "Economically, the action did three things:",
      "1. removed 100 million UNI from governance-controlled treasury inventory;",
      "2. reduced the dead-address-adjusted effective supply by 10% of the original 1 billion;",
      "3. reduced a potential source of future market supply.",
      "It did not use accumulated historical fee revenue to purchase 100 million UNI from market participants. No seller received cash or fee assets in exchange for those tokens. The treasury already owned them.",
      "The distinction affects every valuation ratio built from the event. The 100 million cannot be treated as:",
      "- recurring annual buyback capacity;",
      "- realized historical protocol revenue;",
      "- evidence that fees funded a $400 million market purchase;",
      "- a run rate that can be compared directly with an annual budget.",
      "It was a one-time cancellation of an overhang. That still has real economic value. A protocol-controlled token can fund grants, incentives, vendors, acquisitions, partnerships, or sales. Sending it to a dead address removes those options and permanently narrows the future supply set.",
      "But the cancellation belongs in the balance-sheet bridge, not in a recurring cash-flow multiple.",
      "At the August 5 snapshot, the 100 million transaction represented 92.57% of the 108.025 million UNI recognized at burn addresses. The residual represented 7.43%.",
      "This is why a headline such as “108 million UNI burned” is true and incomplete. Most of the number came from one balance-sheet action.",
      "Figure 1. Recognized burn-address balance as of August 5, 2026. The residual is an approximation because the tracker can include legacy or manual transfers outside the recurring fee path. Sources: Etherscan transaction and Burnalytics; author calculations."
    ],
    "table": {
      "caption": "Composition of the recognized UNI burn-address balance",
      "columns": [
        "Component",
        "UNI",
        "Share of recognized burn-address balance"
      ],
      "rows": [
        [
          "One-time treasury transfer",
          "100,000,000",
          "92.57%"
        ],
        [
          "Approximate recurring and other-burn residual",
          "8,025,224",
          "7.43%"
        ],
        [
          "Total recognized burn-address balance",
          "108,025,224",
          "100.00%"
        ]
      ]
    },
    "figures": [
      {
        "src": "/images/research/uni-burn-composition.svg",
        "label": "Figure 01 / One-time cancellation versus recurring residual",
        "width": 1200,
        "height": 675,
        "alt": "Most of the dead-address balance came from one transaction",
        "caption": ""
      }
    ]
  },
  {
    "id": "the-recurring-mechanism-is-economically-stronger-than-the-one-time-burn",
    "title": "The recurring mechanism is economically stronger than the one-time burn",
    "paragraphs": [
      "The recurring protocol-fee system works differently.",
      "Protocol fees accumulate in TokenJar contracts as the assets collected from pools, chains, or other fee sources. The protocol does not continuously sell those assets for UNI. Instead, outside searchers monitor the fee pots. When a pot is worth claiming, a searcher pays a fixed amount of UNI into the Firepit mechanism and receives the accumulated fee assets. The UNI is transferred to the dead address. The governance discussion specified 4,000 UNI for mainnet pots and 2,000 UNI for L2 pots at the time of the cited expansion. [5]",
      "The economic sequence is:",
      "1. swaps or sequencer activity generate fee assets;",
      "2. those assets accumulate in TokenJar;",
      "3. a searcher values the pot;",
      "4. the searcher sources UNI;",
      "5. the searcher pays fixed UNI to claim the pot;",
      "6. the UNI moves to the dead address.",
      "This is not a conventional corporate buyback. The protocol is not holding dollars and directing a broker to purchase its own token. It is an auction in which the right to withdraw fee assets is sold for UNI that is then removed from economic circulation.",
      "The difference matters in at least four ways.",
      "1. The market funds the recurring burn.",
      "A searcher must obtain UNI from an existing balance or the market. The fee pot creates willingness to pay. Unlike the 100 million treasury cancellation, this path can create external demand for UNI.",
      "2. Fee revenue and UNI burn are not one-for-one.",
      "The pot can contain ETH, stablecoins, or other fee assets. The burned amount is set in UNI per claim event, while auction timing depends on whether the pot’s value exceeds the searcher’s UNI cost, gas, hedging, execution risk, and required profit.",
      "A higher UNI price can increase the dollar cost of the fixed UNI payment. That can make a pot unprofitable until more fees accumulate. The result is lumpy burn timing. A fixed token threshold does not imply a fixed percentage of fee revenue is converted into UNI.",
      "3. Searchers perform the conversion.",
      "The searcher, not the protocol, bears the asset conversion, timing, and execution decision. Describing the system as “fees flow to the treasury and fund buybacks” erases this mechanism.",
      "4. A token burn is not a cash distribution.",
      "The transaction removes UNI from effective supply. It does not send fee assets to each holder. Official UNI documentation states that holders do not have an individual or pro-rata claim on protocol revenue. Governance rights and indirect scarcity effects remain distinct from a dividend, redemption right, or revenue share. [4]",
      "The recurring mechanism is therefore the more important piece for ongoing valuation, but it needs to be measured on its own."
    ]
  },
  {
    "id": "reconstructing-the-recurring-burn-rate",
    "title": "Reconstructing the recurring burn rate",
    "paragraphs": [
      "A complete classified export of every UNI transfer to every recognized burn address was not available from the dashboard snapshot. The model therefore uses two independent windows and labels the first one conservatively.",
      "Method 1: cumulative residual proxy.",
      "Burnalytics displayed 108,025,224 UNI at recognized burn addresses as of August 5, 2026 at 18:15 UTC. Subtracting the known 100 million treasury transfer leaves:",
      "108,025,224 - 100,000,000 = 8,025,224 UNI",
      "The elapsed time from the underlying transaction timestamp to the snapshot was 220.904 days. Annualizing:",
      "8,025,224 / 220.904 × 365 = 13,260,087 UNI per year",
      "This is an approximate recurring and other-burn proxy, not an exact recurring fee total. Any prior balance, manual transfer, or burn outside the normal fee auctions included by the tracker raises the residual. The number should be read as a reproducible aggregate bridge with a known classification limit.",
      "Method 2: independent 90-day estimate.",
      "An independent address-level analysis published August 1 reported 3.928 million UNI burned over the latest 90-day window. Annualizing:",
      "3,928,000 / 90 × 365 = 15,930,222 UNI per year",
      "The higher recent rate is plausible because protocol-fee coverage expanded during 2026, including additional chains, pools, and later v4 activations. That same expansion means neither annualization should be treated as a stable forecast. [8][10]",
      "The defensible range at the cutoff was therefore 13.26 million to 15.93 million UNI per year.",
      "Figure 2. Annualized token quantities, not dollar values. The burn figures are run rates. The growth budget is a scheduled transfer of existing treasury UNI. Sources: UNIfication proposal, Burnalytics, MrNasdog; author calculations.",
      "At those rates, the recurring burn equals 1.33% to 1.59% of the 1 billion contract supply per year, or 1.49% to 1.79% of the 891.975 million dead-address-adjusted effective supply.",
      "Those percentages are supply-sink measures. They are not holder returns."
    ],
    "table": {
      "caption": "Two independent annualized recurring-burn windows",
      "columns": [
        "Measure",
        "Raw observation",
        "Annualized UNI burn",
        "Use in the article"
      ],
      "rows": [
        [
          "Cumulative residual proxy",
          "8,025,224 UNI over 220.904 days",
          "13,260,087",
          "Longer-window lower case, subject to aggregate-classification noise"
        ],
        [
          "Independent recent window",
          "3,928,000 UNI over 90 days",
          "15,930,222",
          "Higher recent case, subject to independent wallet methodology"
        ],
        [
          "Scheduled annual growth budget",
          "20,000,000 UNI per year",
          "20,000,000",
          "Gross treasury distribution schedule, not minting"
        ]
      ]
    },
    "figures": [
      {
        "src": "/images/research/uni-burn-budget-comparison.svg",
        "label": "Figure 02 / Recurring burn versus scheduled growth budget",
        "width": 1200,
        "height": 675,
        "alt": "Recurring burn remained below the scheduled growth budget",
        "caption": ""
      }
    ]
  }
];
