import type { InvestmentMemo } from './articleModels';
import {
  TEXAS_TOLL_ARTICLE_DATE,
  TEXAS_TOLL_ARTICLE_DESCRIPTION,
  TEXAS_TOLL_ARTICLE_IMAGE,
  TEXAS_TOLL_ARTICLE_READ_TIME,
  TEXAS_TOLL_ARTICLE_SEO_TITLE,
  TEXAS_TOLL_ARTICLE_SLUG,
  TEXAS_TOLL_ARTICLE_TITLE,
  TEXAS_TOLL_ARTICLE_UPDATED,
} from './texasTollRoadArticleMeta';

const archivedBoundary =
  'Archived strategy note retained for context. It is not investment advice, allocation guidance, a price target, or a current recommendation.';

export const INVESTMENT_MEMOS: InvestmentMemo[] = [
  {
    kind: 'investment-memo',
    slug: 'network-monopolies',
    number: '01',
    category: 'ARCHIVED RESEARCH FRAME',
    title: 'Archived Network Effects Memo',
    seoTitle: 'Archived Network Effects Memo',
    subtitle: 'A retained methodology example for separating system assumptions from public evidence.',
    seoDescription:
      'Archived, noindexed methodology note by Sulayman Bowles retained for context. It is not investment advice, allocation guidance, or a current recommendation.',
    image: '/og-default.png',
    date: '2026.04.18',
    readTime: '09 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: 'ARCHIVE',
    horizon: 'HISTORICAL',
    allocation: 'NOT ADVICE',
    risks: 'Archived material may include old framing and should not be treated as a current market view.',
    formula: 'research frame = assumption + evidence required + stated limit',
    formulaLabel: 'Archived Method Frame',
    recommendationBoundary: archivedBoundary,
    indexable: false,
    metrics: [
      { label: 'Status', value: 'ARCHIVE' },
      { label: 'Use', value: 'EDUCATIONAL' },
      { label: 'Boundary', value: 'NOT ADVICE' },
    ],
    sources: [],
    content: [
      'This archived note is retained only to preserve research-history context. It now functions as a methodology example: name a system-level assumption, identify the public evidence needed to support it, and keep unsupported forecast language out of current public claims.',
      'The useful signal is the discipline behind the draft, not any old allocation, return, or macro conclusion. Current public research should be read through the newer crawler-policy, public-data, identity-cleanup, and infrastructure-investing articles.',
      'The route is excluded from the sitemap and marked noindex,nofollow so it does not compete with current research pages or appear as a current recommendation.',
    ],
  },
  {
    kind: 'investment-memo',
    slug: 'computational-commodity-systems',
    number: '02',
    category: 'ARCHIVED RESEARCH FRAME',
    title: 'Archived Compute Infrastructure Memo',
    seoTitle: 'Archived Compute Infrastructure Memo',
    subtitle: 'A retained methodology example for technical-infrastructure assumptions and evidence limits.',
    seoDescription:
      'Archived, noindexed methodology note by Sulayman Bowles retained for context. It is not investment advice, token guidance, or a current recommendation.',
    image: '/og-default.png',
    date: '2026.05.02',
    readTime: '11 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: 'ARCHIVE',
    horizon: 'HISTORICAL',
    allocation: 'NOT ADVICE',
    risks: 'Archived material may include old framing and should not be treated as current protocol or infrastructure-market diligence.',
    formula: 'infrastructure claim = capacity signal + demand evidence + operational risk',
    formulaLabel: 'Archived Method Frame',
    recommendationBoundary: archivedBoundary,
    indexable: false,
    metrics: [
      { label: 'Status', value: 'ARCHIVE' },
      { label: 'Use', value: 'EDUCATIONAL' },
      { label: 'Boundary', value: 'NOT ADVICE' },
    ],
    sources: [],
    content: [
      'This archived note is retained as a research-process example, not as a live market view. The current standard is to separate technical infrastructure observations from unsupported claims about market size, protocol durability, or future token economics.',
      'A useful compute-infrastructure memo needs visible evidence for capacity, demand, verification costs, reliability, security assumptions, and operational bottlenecks. Without those inputs, the public page should describe the question being studied rather than imply a current conclusion.',
      'The route is excluded from the sitemap and marked noindex,nofollow so it remains available as historical context without becoming part of the current public research surface.',
    ],
  },
  {
    kind: 'investment-memo',
    slug: 'fiat-horizon',
    number: '03',
    category: 'ARCHIVED RESEARCH FRAME',
    title: 'Archived Monetary Assumptions Memo',
    seoTitle: 'Archived Monetary Assumptions Memo',
    subtitle: 'A retained methodology example for macro assumptions, source limits, and careful public language.',
    seoDescription:
      'Archived, noindexed methodology note by Sulayman Bowles retained for context. It is not investment advice, macro guidance, or a current recommendation.',
    image: '/og-default.png',
    date: '2026.05.15',
    readTime: '12 MIN',
    author: 'SULAYMAN BOWLES',
    conviction: 'ARCHIVE',
    horizon: 'HISTORICAL',
    allocation: 'NOT ADVICE',
    risks: 'Archived material may include old framing and should not be treated as current macro research or portfolio guidance.',
    formula: 'macro note = source data + assumption table + uncertainty boundary',
    formulaLabel: 'Archived Method Frame',
    recommendationBoundary: archivedBoundary,
    indexable: false,
    metrics: [
      { label: 'Status', value: 'ARCHIVE' },
      { label: 'Use', value: 'EDUCATIONAL' },
      { label: 'Boundary', value: 'NOT ADVICE' },
    ],
    sources: [],
    content: [
      'This archived note is retained as a reminder that macro writing needs stricter limits than ordinary commentary. Public pages should distinguish measured data, inferred relationships, scenario analysis, and unsupported recommendations.',
      'A useful monetary-assumptions memo needs source tables, defined windows, clear units, and uncertainty language. When those pieces are missing, the safer public format is a methodology note rather than a live claim about assets, solvency, or portfolio construction.',
      'The route is excluded from the sitemap and marked noindex,nofollow so it remains available as context without becoming part of the current public research surface.',
    ],
  },
  {
    kind: 'investment-memo',
    slug: TEXAS_TOLL_ARTICLE_SLUG,
    number: '04',
    category: 'INFRASTRUCTURE INVESTING',
    title: TEXAS_TOLL_ARTICLE_TITLE,
    seoTitle: TEXAS_TOLL_ARTICLE_SEO_TITLE,
    subtitle: 'The state usually owns the pavement. Contracts decide who controls toll revenue, who gets paid first, and who absorbs the loss.',
    seoDescription: TEXAS_TOLL_ARTICLE_DESCRIPTION,
    image: TEXAS_TOLL_ARTICLE_IMAGE,
    date: TEXAS_TOLL_ARTICLE_DATE,
    dateModified: TEXAS_TOLL_ARTICLE_UPDATED,
    readTime: TEXAS_TOLL_ARTICLE_READ_TIME,
    author: 'SULAYMAN BOWLES',
    conviction: 'SOURCE-LED',
    horizon: '2026 OWNERSHIP MAP',
    allocation: 'EDUCATIONAL RESEARCH',
    risks:
      'Concession-company percentages are not ownership of state land. Dated cap tables, sponsor-adjusted EBITDA, analyst calculations, and unresolved financial disclosures are labeled throughout.',
    formula: 'equity value = finite toll cash flow - debt - lifecycle obligations - public share',
    formulaLabel: 'Finite-Life Toll Concession Frame',
    valuationFrame:
      'Finite-life concession cash flow, debt, lifecycle obligations, public sharing, and residual rights at contract expiry.',
    recommendationBoundary:
      'Educational infrastructure-investing research. Analyst screening scenarios are not bids, appraisals, fairness opinions, price targets, or investment recommendations.',
    metrics: [
      { label: 'Scope', value: 'TEXAS STATEWIDE' },
      { label: 'Private concessions', value: '4 MATERIAL' },
      { label: 'Evidence cutoff', value: 'JULY 11, 2026' },
    ],
    sources: [
      { label: 'TxDOT statewide toll-road inventory', href: 'https://www.txdot.gov/discover/toll-roads-managed-lanes/txdot-toll-roads.html' },
      { label: 'Ferrovial 2026 Fact Book', href: 'https://www.sec.gov/Archives/edgar/data/1468522/000162828026032618/ferrovial-factbook2026_s.htm' },
      { label: 'Build America SH 130 project profile', href: 'https://www.transportation.gov/buildamerica/projects/sh-130-segments-5-and-6' },
      { label: 'TxDOT SH 288 executed agreements', href: 'https://www.txdot.gov/business/road-bridge-maintenance/alternative-delivery/sh288-toll-lanes/executed-agreements.html' },
      { label: 'NTTA 2025 annual financial report', href: 'https://www.ntta.org/sites/default/files/2026-06/06-25-2026_Digital-Annual-Report_2025.pdf' },
    ],
    content: [
      'Texas toll roads do not have one owner. Texas, a county, or a public authority usually owns the physical roadway. A public system may keep the toll revenue, or a concession company may hold a finite right to operate the lanes and collect tolls. Sponsors own the company; lenders control senior claims; billing can sit with another public agency; and the state retains or recovers the asset at expiry.',
      'The ownership stack explains two cases that otherwise look contradictory. SH 130 stayed open while the original private equity was eliminated in bankruptcy and creditors received new debt and equity claims. Texas later paid $1.7317 billion to terminate SH 288 even though the state already owned the corridor, because it was buying out the remaining toll and operating rights rather than buying land.',
      'The article follows a toll dollar through collection, operations, lifecycle capital, debt service, reserves, public sharing, and the final equity residual. It then compares public systems, the four material active private concessions, practical investment routes, and the facts that remain unavailable in public records.',
    ],
  },
];

export const MARKET_THESES = INVESTMENT_MEMOS;
export const PUBLIC_MARKET_THESES = INVESTMENT_MEMOS.filter((memo) => memo.indexable !== false);

export function getMarketThesisBySlug(slug: string) {
  return INVESTMENT_MEMOS.find((memo) => memo.slug === slug);
}

export function getMarketThesisByIndex(index: number) {
  return INVESTMENT_MEMOS[index] ?? INVESTMENT_MEMOS[0];
}
