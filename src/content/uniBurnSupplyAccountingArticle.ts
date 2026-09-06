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
  "seoTitle": "UNI Burn and Supply Accounting: An August 2026 Audit",
  "subtitle": "An August 2026 historical supply bridge: the reported 108 million UNI burn-address balance, treasury distribution, and a conditional sell-through model.",
  "seoDescription": "An August 2026 UNI supply audit: reported burn-address balances, treasury distribution, contract accounting, and a reproducible sell-through sensitivity.",
  "artwork": {
    "kind": "study",
    "variant": "triptych",
    "label": "UNI supply accounting / burn, treasury, and market float",
    "note": "Three separate views: the dead-address balance, recurring burn versus the growth budget, and net market absorption under different sell-through assumptions."
  },
  "date": "2026.09.06",
  "dateModified": "2026.09.06",
  "lastVerified": "2026.08.05",
  "readTime": "24 MIN",
  "author": "SULAYMAN BOWLES",
  "thesis": "UNI has a live, activity-linked economic sink, but the 108 million burn headline combines a one-time treasury cancellation with a much smaller recurring mechanism. Net scarcity depends on actual growth-budget sell-through, not the scheduled treasury transfer alone.",
  "conclusion": {
    "title": "The burn headline is not the valuation model",
    "content": "The historical burn headline combines treasury cancellation with a smaller recurring-and-other residual. Contract supply, dead-address balances, controlled inventory, and market float answer different questions. The 66%\u201380% threshold is a conditional model using reported inputs; realized scarcity still requires classified burn and distribution evidence."
  },
  "evidenceBoundary": "August 2026 snapshot, not a current balance. The tracker and 90-day inputs survive in the draft, but their original raw responses and classified exports were not preserved. The 108.025 million UNI figure is a reported recognized burn-address aggregate, not a classified transaction export. The 8.025 million residual is therefore a recurring-and-other-burn proxy. The 13.26–15.93 million annualized figures are run rates, not forecasts. This analysis does not assert current circulating supply, market float, token price, or an exercised mint; the sell-through model uses a zero-new-mint base case.",
  "metrics": [
    {
      "label": "Contract total supply",
      "value": "1.000B UNI"
    },
    {
      "label": "Snapshot effective supply",
      "value": "891.975M UNI"
    },
    {
      "label": "Reported annualized cases",
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
