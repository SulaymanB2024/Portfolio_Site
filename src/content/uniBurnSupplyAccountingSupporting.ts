import type { ArticleResource, ArticleSource } from './articleModels';

export const UNI_BURN_SUPPLY_ACCOUNTING_INTRO: string[] = [
  "UNI’s contract supply is still exactly 1 billion. Its economically available supply is not.",
  "As of the latest retrievable recognized burn-address snapshot used in this analysis, 108.025 million UNI sat at addresses treated as burns. A single governance transaction accounted for 100 million of that amount. The remaining approximate 8.025 million was the residual from recurring fee burns and other transfers captured by the tracker. Annualized from the one-time transaction timestamp through the snapshot, that residual ran at 13.26 million UNI per year. An independent recent 90-day analysis produced a higher 15.93 million annualized rate.",
  "Both rates were below Uniswap’s scheduled 20 million UNI annual growth budget. The recurring burn covered roughly 66% to 80% of that gross schedule.",
  "That does not establish that UNI is currently inflating by 4 million to 7 million tokens per year. The growth budget is distributed from existing treasury inventory, not minted supply, and the market effect depends on what recipients do with the tokens. A quarterly treasury release can remain in an operating wallet, fund a vendor, enter an incentive program, or reach an exchange. Those paths are economically different.",
  "The clean conclusion is narrower:",
  "Uniswap has created a live, recurring, market-funded sink for UNI and completed a large one-time cancellation of treasury inventory. The token is deflationary under a dead-address-adjusted economic definition, but not under its ERC-20 totalSupply() accounting. Its ongoing holder economics depend on actual growth-budget sell-through, future burn activity, fee-induced changes in protocol usage, and whether governance ever exercises the dormant mint authority.",
  "Most public coverage compresses four different ledgers into one number. That is the source of the confusion."
];

export const UNI_BURN_SUPPLY_ACCOUNTING_RESOURCES: ArticleResource[] = [
  {
    "label": "UNI supply scenarios",
    "href": "/research/uni-burn-supply-scenarios.csv",
    "description": "Machine-readable no-new-mint sensitivity across growth-budget sell-through assumptions.",
    "format": "CSV"
  },
  {
    "label": "Source ledger",
    "href": "/research/uni-burn-source-ledger.csv",
    "description": "Primary and secondary source register with claims supported, definitions, limitations, and access dates.",
    "format": "CSV"
  },
  {
    "label": "Claim ledger",
    "href": "/research/uni-burn-claim-ledger.csv",
    "description": "Load-bearing claims labeled as observed, derived, estimated, interpreted, qualified, or rejected.",
    "format": "CSV"
  },
  {
    "label": "Methodology and data provenance",
    "href": "/research/uni-burn-methodology.md",
    "description": "Definitions, transformations, assumptions, exclusions, contradictions, and reproduction notes.",
    "format": "MD"
  },
  {
    "label": "Reproduction script",
    "href": "/research/uni-burn-reproduction.py",
    "description": "Python calculations and chart generation for the published supply bridge and sensitivity outputs.",
    "format": "PY"
  }
];

export const UNI_BURN_SUPPLY_ACCOUNTING_SOURCES: ArticleSource[] = [
  {
    "label": "Uniswap governance — UNIfication executed proposal",
    "href": "https://vote.uniswapfoundation.org/proposals/93",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "Ethereum transaction — 100 million UNI transfer to 0xdead",
    "href": "https://etherscan.io/tx/0x091f0083242a777d55821c1189e568d6d033d9da501b75087dc736fa143d2c1e",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "Uniswap governance repository — contracts/Uni.sol",
    "href": "https://github.com/Uniswap/governance/blob/master/contracts/Uni.sol",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "Uniswap Developers — UNI Token",
    "href": "https://developers.uniswap.org/docs/ecosystem/governance/uni",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "Uniswap governance forum — protocol fee expansion",
    "href": "https://gov.uniswap.org/t/temp-check-protocol-fee-expansion-eight-more-chains-and-remaining-mainnet-v3-pools/26035",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "OpenZeppelin — UNIfication Fees and UNIVesting audit",
    "href": "https://www.openzeppelin.com/news/uniswap-labs-unification-fees-univesting-audit",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "Burnalytics — UNI burn tracker",
    "href": "https://www.burnalytics.com/asset/uniswap",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "MrNasdog — UNI Inflation Analysis",
    "href": "https://mrnasdog.com/research/uni/inflation",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "Causal Effects of Protocol-Fee Changes on Liquidity Provision in AMMs",
    "href": "https://arxiv.org/abs/2607.08525",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "Uniswap Foundation governance — proposal 95",
    "href": "https://vote.uniswapfoundation.org/proposals/95",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "Uniswap Foundation governance — proposal 96",
    "href": "https://vote.uniswapfoundation.org/proposals/96",
    "lastVerified": "2026.08.16"
  },
  {
    "label": "Uniswap governance — executed v4 protocol-fee vote",
    "href": "https://app.uniswap.org/vote/2/9",
    "lastVerified": "2026.08.16"
  }
];
