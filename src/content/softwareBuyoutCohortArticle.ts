import type { ResearchArticle } from './articleModels';

export const SOFTWARE_BUYOUT_COHORT_ARTICLE_SLUG = 'software-buyout-boom-2020-2022-exit-audit';
export const SOFTWARE_BUYOUT_COHORT_ARTICLE_PATH =
  `/research/financial-systems/${SOFTWARE_BUYOUT_COHORT_ARTICLE_SLUG}`;

export const SOFTWARE_BUYOUT_COHORT_ARTICLE: ResearchArticle = {
  kind: 'research',
  cluster: 'financial-systems',
  slug: SOFTWARE_BUYOUT_COHORT_ARTICLE_SLUG,
  aliases: [],
  number: '21',
  category: 'PRIVATE EQUITY',
  title: 'What Happened to the Software Buyout Boom?',
  seoTitle: 'Software Buyout Cohort, 2020–2022: Exit Audit',
  subtitle:
    'A control-based audit of 25 large sponsor-led software take-private transactions that keeps liquidity, current control, and investment returns separate.',
  seoDescription:
    'Audit 25 large 2020–2022 software buyouts by current control, liquidity events, creditor transfers, and clean sponsor realizations at the 2026 cutoff.',
  artwork: {
    kind: 'study',
    variant: 'triptych',
    label: 'Software buyouts / control, liquidity, and realization',
    note: 'Three separate ledgers: headline transaction value, ownership events, and the control status that determines whether a clean realization occurred.',
  },
  date: '2026.08.17',
  dateModified: '2026.08.29',
  lastVerified: '2026.08.17',
  readTime: '12 MIN',
  author: 'SULAYMAN BOWLES',
  thesis:
    'The 2020–2022 software take-private cohort produced liquidity events and ownership changes, but conventional control exits remained scarce at the cutoff; that is an exit-inventory finding, not a return estimate.',
  conclusion: {
    title: 'Control exits remain the missing event',
    content:
      'The cohort had liquidity, restructurings, and ownership changes, but no row met the stated clean-realization test at the cutoff. That result describes control, not investment performance. Without sponsor cash flows and comparable marks, the public package cannot establish cohort returns or permanent impairment.',
  },
  evidenceBoundary:
    'The public package contains a 25-row classification table, claim ledger, methodology note, summary, and fallback web edition. It does not expose the underlying transaction source ledger or sponsor cash flows. The mixed $171.2 billion headline-value total cannot support MOIC, IRR, impairment, or transaction-by-transaction independent verification from this site alone.',
  metrics: [
    { label: 'Deals audited', value: '25' },
    { label: 'Headline value', value: '$171.2B' },
    { label: 'Clean realizations', value: '0' },
    { label: 'Evidence cutoff', value: '2026.08.17' },
  ],
  content: [
    'The public research package audits 25 large sponsor-led software take-private transactions announced from 2020 through 2022. Company-reported headline transaction values sum to $171.2 billion, but those values use mixed definitions and size the cohort rather than measuring sponsor equity or current value.',
    'At the August 17, 2026 evidence cutoff, no transaction met the study’s control-based definition of a clean sponsor realization. That result does not mean every investment lost money. It means liquidity and ownership events must not be mislabeled as completed exits while the original sponsor group retains control.',
  ],
  sections: [
    {
      id: 'four-quantities-stay-separate',
      title: 'Four quantities must stay separate',
      paragraphs: [
        'The cohort total combines mixed company-reported headline transaction values. Some announcements use enterprise value, some use equity value, and others use another headline convention. The total is useful for sizing the selected cohort, but it is not a common-basis valuation series.',
        'A defensible audit therefore records transaction size, current control, ownership events, and fund return as different fields rather than deriving one from another.',
      ],
      table: {
        caption: 'Measurement boundaries used in the software buyout cohort audit',
        columns: ['Measure', 'What it answers', 'What it does not answer'],
        rows: [
          ['Headline transaction value', 'How large the announced deal was under the company’s stated definition', 'Sponsor equity invested, debt funded, or current value'],
          ['Current control', 'Who could direct the company at the evidence cutoff', 'Whether the controlling investor made or lost money'],
          ['Ownership event', 'Whether an IPO, stake sale, refinancing, dividend, continuation transfer, or creditor transfer occurred', 'Whether the original sponsor fully realized its position'],
          ['Fund return', 'MOIC, IRR, DPI, and loss ratio after all cash flows and marks', 'Not observable from transaction announcements alone'],
        ],
      },
    },
    {
      id: 'liquidity-without-clean-exits',
      title: 'Liquidity occurred without clean control exits',
      paragraphs: [
        'The cohort generated IPO proceeds, partial stake sales, refinancings, dividend distributions, continuation transactions, and creditor-led ownership changes. Those events matter, but they are not interchangeable. Under the stated definition, a clean realization requires a completed sale, broad public distribution, or equivalent transfer that removes the original sponsor group’s control.',
        'The narrower conclusion is more useful than a vintage verdict: a large stock of control investments assembled during the low-rate software take-private boom remained unresolved in conventional exit terms at the cutoff. Public labels such as “IPO,” “liquidity event,” and “exit” can obscure continuing control.',
      ],
    },
    {
      id: 'control-based-classification',
      title: 'The control-based classification',
      paragraphs: [
        'Full sponsor realization sits at the top of the hierarchy. Partial liquidity records proceeds while control continues. Creditor transfers remain separate because a lender-led ownership change can extinguish sponsor control without creating sponsor proceeds. Continuing sponsor ownership applies when no higher-priority classification is supported.',
        'SailPoint is the cleanest sensitivity case in the package. A public listing created a market price and sell-down route, but continuing sponsor voting control meant the IPO could not be treated as a completed control exit under this methodology.',
      ],
      bullets: [
        'Current-control evidence takes precedence over transaction labels.',
        'An IPO is not automatically a full realization.',
        'A continuation transaction may create liquidity while preserving effective control.',
        'A creditor transfer is not evidence of sponsor proceeds.',
      ],
    },
    {
      id: 'cohort-not-fully-seasoned',
      title: 'The cohort is not fully seasoned',
      paragraphs: [
        'A zero-realization count at this cutoff is not evidence that zero future realizations will occur. Most acquisitions were only three to five years into sponsor ownership, while technology holding periods at exit had lengthened to roughly five years by the end of 2025.',
        'Strategic sales, sponsor-to-sponsor transactions, public sell-downs, continuation structures, recapitalizations, and later operational improvement remain possible. The supportable conclusion is that conventional realization was delayed and ownership outcomes fragmented, not that the entire cohort was permanently impaired.',
      ],
    },
    {
      id: 'public-evidence-limit',
      title: 'What the public package cannot establish',
      paragraphs: [
        'A cohort MOIC or IRR would require sponsor equity contributions, acquisition debt, add-on investment, operating cash retained or distributed, dividend proceeds, partial-sale proceeds, continuation-vehicle pricing, management dilution, fees, fund allocations, and current marks. Those fields are not available in the public package at the level required for a return calculation.',
        'The package can support its stated control map and ownership-event inventory. Because it does not publish the underlying transaction source ledger, readers cannot independently reproduce every row from primary filings using this site alone. The claims should remain inside that evidence boundary.',
      ],
      bullets: [
        'Do not compare current enterprise value with announced purchase price as a synthetic return.',
        'Do not treat every IPO or partial sale as a full exit.',
        'Do not infer sponsor loss from creditor stress without reconstructing prior cash flows.',
      ],
    },
  ],
  resources: [
    {
      label: 'Row-level cohort',
      href: '/research/software-buyout-cohort-2020-2022.csv',
      description: 'Twenty-five classified transactions with announcement year, headline value, sponsor group, current-control summary, and outcome category.',
      format: 'CSV',
    },
    {
      label: 'Claim ledger',
      href: '/research/software-buyout-cohort-claim-ledger.csv',
      description: 'Ten bounded claims with evidence basis and confidence labels.',
      format: 'CSV',
    },
    {
      label: 'Methodology',
      href: '/research/software-buyout-cohort-methodology.md',
      description: 'Cohort construction, value basis, control hierarchy, return boundary, and counter-case.',
      format: 'MD',
    },
    {
      label: 'Machine-readable summary',
      href: '/research/software-buyout-cohort-summary.json',
      description: 'Headline result, definitions, boundaries, and canonical route contract.',
      format: 'JSON',
    },
    {
      label: 'Original fallback web edition',
      href: '/research/software-buyout-cohort-2020-2022',
      description: 'The noindex standalone edition retained as a source artifact for the merged research package.',
      format: 'HTML',
    },
  ],
  sources: [
    {
      label: 'Software buyout cohort row-level classification',
      href: 'https://sulayman-bowles.dev/research/software-buyout-cohort-2020-2022.csv',
      lastVerified: '2026.08.17',
    },
    {
      label: 'Software buyout cohort claim ledger',
      href: 'https://sulayman-bowles.dev/research/software-buyout-cohort-claim-ledger.csv',
      lastVerified: '2026.08.17',
    },
    {
      label: 'Software buyout cohort methodology',
      href: 'https://sulayman-bowles.dev/research/software-buyout-cohort-methodology.md',
      lastVerified: '2026.08.17',
    },
    {
      label: 'Software buyout cohort machine-readable summary',
      href: 'https://sulayman-bowles.dev/research/software-buyout-cohort-summary.json',
      lastVerified: '2026.08.17',
    },
  ],
};
