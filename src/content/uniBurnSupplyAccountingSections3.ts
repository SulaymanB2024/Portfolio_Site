import type { ArticleSection } from './articleModels';

export const UNI_BURN_SUPPLY_ACCOUNTING_SECTIONS_3: ArticleSection[] = [
  {
    id: 'reproduce-the-historical-supply-bridge',
    title: 'Reproduce the historical supply bridge',
    paragraphs: [
      'The downloadable script retains the August 5, 2026, 18:15 UTC tracker input and the December 27, 2025, 20:33:11 UTC treasury-transfer timestamp. It calculates elapsed days from those timestamps without rounding first. That produces the 13.260 million annualized residual case. The separate reported 90-day input produces the 15.930 million case. Both use a 365-day year.',
      'The scenario CSV applies each rate to the same 20 million annual budget and a zero-new-mint assumption. Its exact break-even rows use B/G rather than rounded headline percentages. At 66.3% or 79.7% exactly, a small residual can remain because those labels are rounded.',
      'Positive modeled absorption means the specified burn proxy exceeds the specified distribution flow. It is not measured net exchange buying: searchers can use existing UNI inventory, and recipients can retain or transfer tokens without selling. The equation also omits unrelated holder sales, exchange inventories, borrowing, and liquidity changes.',
    ],
  },
  {
    id: 'what-is-observed-and-what-is-assumed',
    title: 'What is observed, reported, and assumed?',
    paragraphs: [
      'The contract mechanics and executed treasury authorization have primary sources. The historical tracker balance and 90-day wallet-analysis figure were preserved as numbers in the August draft. Their original raw responses and classified transaction exports were not included. The live pages have since changed, so this release cannot independently reproduce those historical provider observations.',
      'The package labels those numbers as reported historical inputs, the subtraction and annualization as derived calculations, and sell-through as an assumption. Arithmetic reproducibility does not convert an unarchived provider observation into an independently audited transaction census.',
      'The 8.025 million residual includes any other transfers captured by the tracker. Treating it as exclusively protocol-fee burn would overstate the evidence. Likewise, the 90-day figure is a reported comparison window; its wallet coverage has not been independently reclassified here.',
      'This article does not rely on a later v4 activation to explain the difference between the windows. Governance proposals, executed votes, enabled pools, collected fees, and completed claims are separate events. Establishing coverage at a particular cutoff requires receipts for each relevant event.',
    ],
  },
  {
    id: 'what-a-refresh-needs',
    title: 'What a refresh needs',
    paragraphs: [
      'A stronger update would retain a finalized block number, totalSupply() and balanceOf() reads, every included burn address, and classified transfer logs. It would identify the treasury transfer once, separate fee-claim transfers from manual transfers, and reconcile opening balance plus inflows to closing balance.',
      'The distribution side needs the same discipline: treasury releases, vesting balances, operating-wallet transfers, recipient classification, and actual sales where identifiable. An exchange deposit can be evidence of possible sale capacity without proving a completed sale. Unknown disposition should stay unknown.',
      'Only then should the model replace assumed sell-through with a measured flow for a named window. Keep the previous snapshot intact so readers can distinguish changes in activity from changes in wallet coverage or classification.',
    ],
  },
  {
    id: 'uni-supply-questions',
    title: 'Common questions about UNI supply',
    paragraphs: [
      'Did the 100 million transfer buy UNI from the market? No. The proposal transferred existing treasury inventory to a dead address. It reduced potential future treasury distribution; it did not establish a fee-funded purchase from outside holders.',
      'Does the growth budget mint 20 million new UNI each year? No. The cited authorization distributes existing treasury UNI. The contract’s mint authority is a separate mechanism with its own access and timing conditions.',
      'Is 891.975 million UNI circulating supply? No. It is the saved 1 billion contract denominator minus the reported recognized burn-address balance. It still includes controlled and inactive balances outside those addresses.',
      'Does positive absorption guarantee a higher UNI price? No. The sensitivity is a conditional token-flow comparison. It does not measure total market demand, holder selling, liquidity, or a return to any individual holder.',
      'Are the headline quantities current? No. They describe the August observation windows named above. The equations remain reusable, but a current estimate requires new synchronized inputs and retained evidence.',
    ],
  },
];
