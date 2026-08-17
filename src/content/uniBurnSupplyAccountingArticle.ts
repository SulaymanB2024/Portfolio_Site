import type { ResearchArticle } from './articleModels';
import { UNI_BURN_SUPPLY_ACCOUNTING_SECTIONS_1 } from './uniBurnSupplyAccountingSections1';
import { UNI_BURN_SUPPLY_ACCOUNTING_SECTIONS_2 } from './uniBurnSupplyAccountingSections2';
import { UNI_BURN_SUPPLY_ACCOUNTING_SECTIONS_3 } from './uniBurnSupplyAccountingSections3';
import {
  UNI_BURN_SUPPLY_ACCOUNTING_INTRO,
  UNI_BURN_SUPPLY_ACCOUNTING_RESOURCES,
  UNI_BURN_SUPPLY_ACCOUNTING_SOURCES,
} from './uniBurnSupplyAccountingSupporting';

export const UNI_BURN_SUPPLY_ACCOUNTING_ARTICLE_SLUG = 'uni-burn-supply-accounting';
export const UNI_BURN_SUPPLY_ACCOUNTING_ARTICLE_PATH =
  `/research/financial-systems/${UNI_BURN_SUPPLY_ACCOUNTING_ARTICLE_SLUG}`;

export const UNI_BURN_SUPPLY_ACCOUNTING_ARTICLE: ResearchArticle = {
  "kind": "research",
  "cluster": "financial-systems",
  "slug": "uni-burn-supply-accounting",
  "aliases": [],
  "number": "20",
  "category": "PROTOCOL ECONOMICS",
  "title": "UNI Is Deflationary in Economics, Not in ERC-20 Accounting",
  "seoTitle": "UNI Is Deflationary in Economics, Not in ERC-20 Accounting",
  "subtitle": "A forensic audit of Uniswap’s 108 million UNI “burn,” recurring fee auctions, 20 million UNI annual growth budget, and what the mechanism actually means for token valuation.",
  "seoDescription": "Audit UNI’s 108M dead-address balance, recurring fee burns, 20M growth budget, dormant mint authority, and the 66%–80% sell-through threshold.",
  "artwork": {
    "kind": "study",
    "variant": "triptych",
    "label": "UNI supply accounting / burn, treasury, and market float",
    "note": "Three separate views: the dead-address balance, recurring burn versus the growth budget, and net market absorption under different sell-through assumptions."
  },
  "date": "2026.08.16",
  "dateModified": "2026.08.16",
  "lastVerified": "2026.08.16",
  "readTime": "24 MIN",
  "author": "SULAYMAN BOWLES",
  "thesis": "UNI has a live, activity-linked economic sink, but the 108 million burn headline combines a one-time treasury cancellation with a much smaller recurring mechanism. Net scarcity depends on actual growth-budget sell-through, not the scheduled treasury transfer alone.",
  "conclusion": {
    "title": "The burn headline is not the valuation model",
    "content": "UNI is deflationary in one economically meaningful sense: more than 108 million tokens sat at recognized burn addresses at the snapshot, leaving approximately 891.975 million outside those addresses. The recurring fee system also creates a real demand-and-destruction path in which searchers pay UNI to claim protocol fee pots. UNI is not deflationary in ERC-20 accounting. The contract’s totalSupply() remains 1 billion because the protocol transfers UNI to a nonzero dead address rather than decrementing supply. That denominator still matters for data systems, FDV conventions, and the dormant 2% mint cap. The recurring mechanism, not the 100 million treasury event, should drive ongoing valuation. At the cutoff, defensible annualized burn estimates ranged from 13.26 million to 15.93 million UNI. That covered roughly 66% to 80% of the scheduled 20 million annual growth budget. The missing variable is sell-through. Below 66% of the budget reaching the market, both modeled burn rates imply net market absorption. Above 80%, both imply net release. The range between them depends on realized burn and recipient behavior. New minting would move the threshold against holders. The one-sentence investment takeaway is: UNI now has genuine activity-linked value capture, but its net scarcity and valuation cannot be read from the burn headline alone; they require separate accounting for dead-address balances, controlled treasury inventory, actual market distribution, and contingent minting."
  },
  "evidenceBoundary": "The 108.025 million UNI figure is a recognized burn-address aggregate, not a classified transaction export. The 8.025 million residual is therefore a recurring-and-other-burn proxy. The 13.26–15.93 million annualized figures are run rates, not forecasts. This analysis does not assert current circulating supply, market float, token price, or an exercised mint; the sell-through model uses a zero-new-mint base case.",
  "metrics": [
    {
      "label": "Contract total supply",
      "value": "1.000B UNI"
    },
    {
      "label": "Effective supply",
      "value": "891.975M UNI"
    },
    {
      "label": "Recurring burn run rate",
      "value": "13.26–15.93M"
    },
    {
      "label": "Break-even sell-through",
      "value": "66.3%–79.7%"
    }
  ],
  "indexable": true,
  content: UNI_BURN_SUPPLY_ACCOUNTING_INTRO,
  sections: [
    ...UNI_BURN_SUPPLY_ACCOUNTING_SECTIONS_1,
    ...UNI_BURN_SUPPLY_ACCOUNTING_SECTIONS_2,
    ...UNI_BURN_SUPPLY_ACCOUNTING_SECTIONS_3,
  ],
  resources: UNI_BURN_SUPPLY_ACCOUNTING_RESOURCES,
  sources: UNI_BURN_SUPPLY_ACCOUNTING_SOURCES,
};
