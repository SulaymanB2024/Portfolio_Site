import type { InvestmentMemo } from './articleModels';
import {
  TEXAS_TOLL_ARTICLE_CONCLUSION,
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
    slug: 'archived-research-methodology',
    number: '01',
    category: 'ARCHIVED RESEARCH FRAME',
    title: 'Archived Market Research Methodology',
    seoTitle: 'Archived Market Research Methodology',
    subtitle: 'Three retired market questions, preserved as one methodology record for networks, compute infrastructure, and monetary systems.',
    seoDescription:
      'Noindexed methodology archive by Sulayman Bowles covering evidence requirements for network, compute-infrastructure, and monetary-system research.',
    artwork: {
      kind: 'study',
      variant: 'triptych',
      label: 'Archive methodology / triptych study',
      note: 'An intentional three-part study of network, compute, and monetary research methods.',
    },
    date: '2026.04.18',
    dateModified: '2026.07.16',
    readTime: '12 MIN',
    author: 'SULAYMAN BOWLES',
    conclusion: {
      title: 'Archive the question, not a recommendation',
      content:
        'The surviving value of these sketches is their evidence contract: network persistence, compute utilization, or monetary transmission would each need current data, explicit units, and falsifiable links before supporting an allocation. None is presented here as a live thesis.',
    },
    conviction: 'ARCHIVE',
    horizon: 'HISTORICAL',
    allocation: 'NOT ADVICE',
    risks: 'A methodology can discipline a question without supplying current facts, valuation inputs, or an investable conclusion.',
    formula: 'research question = observable system + required evidence + falsifier + decision boundary',
    formulaLabel: 'Archived Research Contract',
    recommendationBoundary: archivedBoundary,
    indexable: false,
    metrics: [
      { label: 'Retired notes', value: '03' },
      { label: 'Current calls', value: 'NONE' },
      { label: 'Use', value: 'METHOD ONLY' },
    ],
    sources: [],
    content: [
      'These notes began as separate sketches about network effects, distributed compute, and monetary regimes. None matured into a current recommendation, and keeping three nearly identical archive pages overstated the amount of finished research. This page preserves the useful part instead: the evidence contract each question would need before it could support a public conclusion.',
      'The archive is intentionally noindexed. It records how a market question should be scoped, what observations would count, which missing inputs would stop the analysis, and what could falsify the initial thesis. It does not carry forward old allocations, return expectations, token views, or macro calls.',
    ],
    sections: [
      {
        id: 'network-method',
        title: 'Network advantage requires measurable persistence',
        paragraphs: [
          'A network thesis should begin with the mechanism that is supposed to compound. That mechanism might be liquidity, data density, standards adoption, distribution, switching costs, or a marketplace feedback loop. User growth by itself is not enough. The research must show why another participant improves the system for existing participants and why the benefit survives subsidies, multi-homing, and competitive entry.',
          'The minimum evidence set includes cohort retention, concentration by side of the market, acquisition economics, take-rate durability, evidence of multi-homing, and examples of successful or failed entry. A useful memo would also specify the event that breaks the thesis: falling engagement despite network growth, declining unit economics, or a rival reaching comparable utility without comparable scale.',
        ],
        table: {
          caption: 'Evidence contract for a network-system question',
          columns: ['Research layer', 'Required observation', 'Reason to stop'],
          rows: [
            ['Mechanism', 'The specific interaction that improves as participation rises', 'The benefit is asserted but not measured'],
            ['Durability', 'Retention, pricing power, or switching evidence across a defined period', 'Growth depends mainly on incentives or temporary scarcity'],
            ['Competition', 'Multi-homing and entrant performance', 'Users can reproduce the same utility elsewhere at low cost'],
          ],
        },
      },
      {
        id: 'compute-method',
        title: 'Compute infrastructure starts with capacity and utilization',
        paragraphs: [
          'A compute-infrastructure question is operational before it is financial. The analyst needs to know what capacity exists, how it is scheduled, who verifies the work, what reliability target is promised, and which constraint limits useful throughput. A protocol or platform can report nominal supply while leaving economically usable capacity uncertain.',
          'The diligence record should separate installed capacity from available capacity, booked demand from promotional usage, and protocol rewards from customer-paid revenue. It should expose hardware concentration, energy assumptions, geographic dependence, security costs, workload portability, failure rates, and the expense of proving that work occurred as represented.',
        ],
        table: {
          caption: 'Evidence contract for a compute-infrastructure question',
          columns: ['Research layer', 'Required observation', 'Reason to stop'],
          rows: [
            ['Supply', 'Verified hardware, location, uptime, and available throughput', 'Capacity is self-reported or cannot be reconciled'],
            ['Demand', 'Paid workloads, repeat usage, utilization, and customer concentration', 'Activity is dominated by incentives or internal testing'],
            ['Economics', 'Revenue, reward expense, verification cost, and maintenance burden', 'Token emissions or gross bookings are treated as margin'],
          ],
        },
      },
      {
        id: 'monetary-method',
        title: 'Monetary claims need windows, units, and transmission paths',
        paragraphs: [
          'A monetary-system note should not jump from a macro observation to an asset recommendation. It must define the variable, measurement window, unit, data revision policy, and transmission path. Inflation, liquidity, debt service, real rates, currency demand, and fiscal capacity can move together without supporting one simple directional trade.',
          'The analysis should distinguish recorded data from scenario assumptions and should show which balance sheet absorbs the change. If the thesis depends on refinancing, reserve demand, policy reaction, or investor positioning, those links need their own evidence. A scenario table can describe consequences under stated assumptions; it cannot turn an uncertain relationship into a forecast.',
        ],
        table: {
          caption: 'Evidence contract for a monetary-system question',
          columns: ['Research layer', 'Required observation', 'Reason to stop'],
          rows: [
            ['Measurement', 'Named series, units, release dates, and revision treatment', 'The argument mixes nominal, real, stock, and flow measures'],
            ['Transmission', 'The balance-sheet or market channel linking cause to outcome', 'Correlation is presented as a stable mechanism'],
            ['Decision', 'Scenario ranges, sensitivity, and a stated invalidation condition', 'The note implies an allocation without current market inputs'],
          ],
        },
      },
    ],
  },
  {
    kind: 'investment-memo',
    slug: TEXAS_TOLL_ARTICLE_SLUG,
    number: '02',
    category: 'INFRASTRUCTURE INVESTING',
    title: TEXAS_TOLL_ARTICLE_TITLE,
    seoTitle: TEXAS_TOLL_ARTICLE_SEO_TITLE,
    subtitle: 'The state usually owns the pavement. Contracts decide who controls toll revenue, who gets paid first, and who absorbs the loss.',
    seoDescription: TEXAS_TOLL_ARTICLE_DESCRIPTION,
    artwork: {
      kind: 'image',
      heroSrc: TEXAS_TOLL_ARTICLE_IMAGE,
      socialSrc: '/images/research/texas-toll-roads-social.jpg',
      alt: 'Monochrome editorial artwork representing Texas toll-road infrastructure and layered ownership.',
      label: 'Ownership map / 01',
      caption: 'Public pavement, contractual rights, debt claims, and residual cash flow.',
    },
    date: TEXAS_TOLL_ARTICLE_DATE,
    dateModified: TEXAS_TOLL_ARTICLE_UPDATED,
    readTime: TEXAS_TOLL_ARTICLE_READ_TIME,
    author: 'SULAYMAN BOWLES',
    conclusion: TEXAS_TOLL_ARTICLE_CONCLUSION,
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
