import type { InvestmentMemo, ResearchArticle } from './articleModels';
import * as app from './independentAppIncomeArticleMeta';
import * as dc from './dataCenterInfrastructureArticleMeta';
import { APP_INCOME_LEDE, APP_INCOME_SOURCES, APP_INCOME_DOWNLOADS } from './independentAppIncomeArticle';
import { DATA_CENTER_ARTICLE_SOURCES } from './dataCenterInfrastructureArticle';

export const INDEPENDENT_APP_INCOME_ARTICLE: ResearchArticle = {
    kind: 'research',
    cluster: app.INDEPENDENT_APP_INCOME_ARTICLE_CLUSTER,
    slug: app.INDEPENDENT_APP_INCOME_ARTICLE_SLUG,
    number: '04',
    category: 'PRODUCT ECONOMICS',
    title: app.INDEPENDENT_APP_INCOME_ARTICLE_TITLE,
    seoTitle: app.INDEPENDENT_APP_INCOME_ARTICLE_SEO_TITLE,
    subtitle: app.INDEPENDENT_APP_INCOME_ARTICLE_DESCRIPTION,
    seoDescription:
      'See modeled indie app income ranges by denominator, test subscriber economics, explore selected cases, and download the full report, workbook, data, and code.',
    artwork: { kind: 'study', variant: 'triptych', label: 'Source-led research', note: 'Dated evidence and explicit limits.' },
    date: app.INDEPENDENT_APP_INCOME_ARTICLE_DATE,
    dateModified: app.INDEPENDENT_APP_INCOME_ARTICLE_UPDATED,
    lastVerified: app.INDEPENDENT_APP_INCOME_ARTICLE_LAST_VERIFIED,
    readTime: app.INDEPENDENT_APP_INCOME_ARTICLE_READ_TIME,
    author: 'SULAYMAN BOWLES',
    thesis:
      'About 15.4% of developers behind meaningful independent app attempts are modeled to generate at least $1,000 in current monthly gross revenue across their portfolios; the denominator and revenue basis change the answer materially.',
    evidenceBoundary:
      'These are modeled ranges, not an app-store census. Selected public cases illustrate mechanisms and are never used as prevalence counts. Intervals express assumption uncertainty, not sampling confidence.',
    metrics: [
      { label: 'Serious developers', value: '15.4% CENTRAL' },
      { label: 'Serious apps', value: '10.2% CENTRAL' },
      { label: 'Simulation draws', value: '500,000' },
    ],
    sources: APP_INCOME_SOURCES.map((source) => ({
      label: source.label,
      href: source.href,
      lastVerified: source.lastVerified,
    })),
    resources: APP_INCOME_DOWNLOADS.map((asset) => ({ label: asset.label, href: asset.href, description: asset.note, format: asset.format })),
    conclusion: { title: 'Keep the denominator visible', content: 'The income estimates are a model of serious independent attempts, not a census of every app. Gross revenue, sustained revenue, developer proceeds, and owner profit answer different questions.' },
    content: [...APP_INCOME_LEDE],
  };

export const DATA_CENTER_INFRASTRUCTURE_ARTICLE: InvestmentMemo = {
    kind: 'investment-memo',
    slug: dc.DATA_CENTER_ARTICLE_SLUG,
    number: '05',
    category: 'INFRASTRUCTURE INVESTING',
    title: dc.DATA_CENTER_ARTICLE_TITLE,
    seoTitle: dc.DATA_CENTER_ARTICLE_SEO_TITLE,
    subtitle:
      'A data center becomes financeable in stages: site and power rights, tenant commitment, completion support, acceptance, operating rent, and a residual case.',
    seoDescription: dc.DATA_CENTER_ARTICLE_DESCRIPTION,
    artwork: { kind: 'study', variant: 'triptych', label: 'Source-led research', note: 'Dated evidence and explicit limits.' },
    date: dc.DATA_CENTER_ARTICLE_DATE,
    dateModified: dc.DATA_CENTER_ARTICLE_UPDATED,
    readTime: dc.DATA_CENTER_ARTICLE_READ_TIME,
    author: 'SULAYMAN BOWLES',
    conviction: 'SOURCE-LED',
    horizon: 'ASSET-STATE MODEL',
    allocation: 'EDUCATIONAL RESEARCH',
    risks:
      'Queue positions, leases, guarantees, securitizations, and physical completion are not interchangeable proof. Private contract terms, power deliverability, recovery evidence, and public cost remain visible gaps.',
    formula:
      'financeable value = contracted cash flow + scarce power rights + adaptable property - completion, concentration, obsolescence, and refinancing haircuts',
    formulaLabel: 'Data-Center Infrastructure Frame',
    valuationFrame:
      'A ten-state model separating development option value, construction credit, operating cash flow, permanent financing, and residual or re-leasing value.',
    recommendationBoundary:
      'Educational infrastructure-finance research. The article is not an appraisal, credit rating, transaction opinion, price target, or investment recommendation.',
    metrics: [
      { label: 'Asset states', value: '10' },
      { label: 'Primary-source ledger', value: '21 ENTRIES' },
      { label: 'Evidence cutoff', value: 'JULY 14, 2026' },
    ],
    sources: DATA_CENTER_ARTICLE_SOURCES.flatMap((source) => source.hrefs.map((href) => ({ label: `${source.id.toUpperCase()} — ${source.label}`, href, lastVerified: '2026.07.14' }))),
    conclusion: { title: 'Underwrite the asset state', content: 'A data center becomes financeable as deliverable power, tenant acceptance, operating payments, durable credit support, and a credible residual or amortization case accumulate. Legal ownership alone does not show where the first loss sits.' },
    content: [
      'A hyperscale campus is not one asset moving through a generic construction timeline. It is a sequence of risk objects: generic land, entitled land, a power position, tenant-backed development, financed construction, an energized facility, accepted operating cash flow, a permanently financed security, a platform, and eventually a residual or re-leasing asset.',
      'The article follows the contracts around that sequence. It distinguishes a utility request from firm service, a signed lease from post-acceptance rent, funded capital from contingent guarantees, and tenant credit from the physical recovery case. Meta Hyperion, Applied Digital, Cumulus and AWS, DataBank, and QTS show how legal ownership and economic first loss can diverge.',
      'The central conclusion is stage-specific: permanent capital can treat the project as an infrastructure cash-flow asset when repayment depends mainly on durable operating payments and residual rights, rather than on the probability that the campus can still be built, powered, accepted, and refinanced.',
    ],
  };
