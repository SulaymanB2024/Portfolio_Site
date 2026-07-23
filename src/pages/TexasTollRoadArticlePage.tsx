import { Fragment, useEffect, useMemo } from 'react';

import {
  ArticleReader,
  ArticleSectionHeader,
  createArticleNavigation,
  getArticleNavigationIndex,
  type ArticleNavItem,
  type ArticleReaderConfig,
} from '../components/ArticleLayout';
import {
  TEXAS_TOLL_ARTICLE_DATE,
  TEXAS_TOLL_ARTICLE_DESCRIPTION,
  TEXAS_TOLL_ARTICLE_DISPLAY_TITLE,
  TEXAS_TOLL_ARTICLE_FACT_GAPS,
  TEXAS_TOLL_ARTICLE_FAQS,
  TEXAS_TOLL_ARTICLE_LEDE_MARKDOWN,
  TEXAS_TOLL_ARTICLE_READ_TIME,
  TEXAS_TOLL_ARTICLE_SECTIONS,
  TEXAS_TOLL_ARTICLE_SLUG,
  TEXAS_TOLL_ARTICLE_SOURCES,
  TEXAS_TOLL_ARTICLE_TABLES,
  TEXAS_TOLL_ARTICLE_TITLE,
  TEXAS_TOLL_ARTICLE_UPDATED,
  type TexasTollArticleTable,
} from '../content/texasTollRoadArticle';
import { getSeoRoute } from '../seo/routes';
import { markdownToReact } from '../utils/markdownToReact';
import { useSEO } from '../utils/seo';

const ROUTE = getSeoRoute(`/markets/${TEXAS_TOLL_ARTICLE_SLUG}`)!;
const TABLES_BY_ID = new Map(TEXAS_TOLL_ARTICLE_TABLES.map((table) => [table.id, table]));

const headlineMetrics = [
  { value: '872', label: 'open toll miles', note: 'TxDOT statewide inventory' },
  { value: '4', label: 'large private concessions', note: 'after the SH 288 reversion' },
  { value: '$1.7317B', label: 'SH 288 termination payment', note: 'October 8, 2024' },
  { value: '7', label: 'distinct ownership layers', note: 'from pavement to residual rights' },
] as const;

const ownershipLayers = [
  { index: '01', role: 'Physical title', owner: 'State of Texas', detail: 'Highway and right-of-way' },
  { index: '02', role: 'Statutory control', owner: 'TxDOT / Commission', detail: 'Standards, remedies, consent rights' },
  { index: '03', role: 'Revenue right', owner: 'Concession company', detail: 'Finite right to charge tolls' },
  { index: '04', role: 'Equity claim', owner: 'Sponsors and funds', detail: 'Residual project-company ownership' },
  { index: '05', role: 'Debt control', owner: 'Bonds / TIFIA / banks', detail: 'Liens, covenants, step-in rights' },
  { index: '06', role: 'Operations', owner: 'Operator + billing agent', detail: 'Maintenance, lanes, tags, collection' },
  { index: '07', role: 'Residual title', owner: 'State at expiry', detail: 'Handback after the concession ends' },
] as const;

const cashFlowWaterfall = [
  { label: 'Billed tolls', detail: 'transactions × realized toll', tone: 'base' },
  { label: 'Collection losses', detail: 'discounts, exemptions, leakage, unpaid bills', tone: 'cost' },
  { label: 'Operating cash', detail: 'collection, customer service, routine O&M', tone: 'cost' },
  { label: 'Lifecycle capital', detail: 'pavement, structures, software, mandatory capacity', tone: 'cost' },
  { label: 'Financing claims', detail: 'interest, principal, reserves, covenant tests', tone: 'debt' },
  { label: 'Public share', detail: 'revenue sharing, taxes, transfers where applicable', tone: 'public' },
  { label: 'Equity residual', detail: 'distributable only after every senior claim', tone: 'equity' },
] as const;

const dfwMetrics = [
  { project: 'North Tarrant Express', revenue: '$323M', ebitda: '$278M', margin: '86.1%', leverage: '5.3×', revenuePerTransaction: '$8.73' },
  { project: 'LBJ Express', revenue: '$244M', ebitda: '$202M', margin: '82.8%', leverage: '10.1×', revenuePerTransaction: '$5.30' },
  { project: 'NTE 35W', revenue: '$368M', ebitda: '$294M', margin: '79.9%', leverage: '5.6×', revenuePerTransaction: '$7.08' },
] as const;

const instrumentRoutes = [
  { label: 'Municipal bonds', access: 'Public systems', payoff: 'Contractual debt service', constraint: 'Limited upside; pledge quality varies' },
  { label: 'Project bonds', access: 'Private concessions', payoff: 'Interest + principal', constraint: 'Traffic and covenant exposure' },
  { label: 'Fund secondary', access: 'Sponsor or pension stake', payoff: 'Equity distributions + exit', constraint: 'Transfer and government consents' },
  { label: 'Listed sponsor', access: 'Ferrovial shares', payoff: 'Diluted portfolio exposure', constraint: 'Texas is one part of a larger company' },
  { label: 'Distressed debt', access: 'Project-specific loans/bonds', payoff: 'Recovery or restructuring control', constraint: 'Rare, specialized, and document-heavy' },
] as const;

const screeningEstimates = [
  { project: 'North Tarrant Express', bearEv: '$2.88B', baseEv: '$4.44B', bullEv: '$6.91B', baseEquity: '$2.84B', discountRate: '7.25%', inputStatus: 'DFW inputs source-backed' },
  { project: 'LBJ Express', bearEv: '$1.89B', baseEv: '$2.95B', bullEv: '$4.50B', baseEquity: '$0.91B', discountRate: '7.50%', inputStatus: 'DFW inputs source-backed' },
  { project: 'NTE 35W', bearEv: '$2.74B', baseEv: '$4.72B', bullEv: '$8.12B', baseEquity: '$3.12B', discountRate: '7.75%', inputStatus: 'DFW inputs source-backed' },
  { project: 'SH 130 Segments 5–6', bearEv: '$0.56B', baseEv: '$0.99B', bullEv: '$2.12B', baseEquity: '$0.54B', discountRate: '9.00%', inputStatus: 'Revenue, EBITDA, and $450M debt estimated' },
] as const;

interface ArticleMarkdownProps {
  markdown: string;
  className?: string;
}

function ArticleMarkdown({ markdown, className = '' }: ArticleMarkdownProps) {
  const content = useMemo(() => markdownToReact(markdown), [markdown]);

  return <div className={`article-reader__prose ${className}`}>{content}</div>;
}

function OwnershipStackDiagram() {
  return (
    <figure className="toll-ownership-stack" aria-labelledby="ownership-stack-caption">
      <div className="toll-figure-label">
        <span>Figure 01</span>
        <span>North Tarrant Express / claim stack</span>
      </div>
      <div className="toll-ownership-stack__grid">
        {ownershipLayers.map((layer) => (
          <div key={layer.index} className="toll-ownership-layer">
            <span className="toll-ownership-layer__index">{layer.index}</span>
            <span className="toll-ownership-layer__role">{layer.role}</span>
            <strong>{layer.owner}</strong>
            <span>{layer.detail}</span>
          </div>
        ))}
      </div>
      <figcaption id="ownership-stack-caption">
        “Owner” changes meaning at each layer. Solid economic ownership sits beside contracts, services, and creditor controls; none of the private percentages divides the state-owned pavement.
      </figcaption>
    </figure>
  );
}

function CashFlowWaterfall() {
  return (
    <figure className="toll-cash-waterfall" aria-labelledby="cash-waterfall-caption">
      <div className="toll-figure-label">
        <span>Figure 02</span>
        <span>From toll bill to residual cash</span>
      </div>
      <div className="toll-cash-waterfall__grid">
        {cashFlowWaterfall.map((step, index) => (
          <div key={step.label} className={`toll-cash-step toll-cash-step--${step.tone}`}>
            <span className="toll-cash-step__index">{String(index + 1).padStart(2, '0')}</span>
            <strong>{step.label}</strong>
            <span>{step.detail}</span>
          </div>
        ))}
      </div>
      <figcaption id="cash-waterfall-caption">
        High EBITDA does not equal cash available to equity. Collection, maintenance, leverage, reserves, and public sharing sit between traffic and distributions.
      </figcaption>
    </figure>
  );
}

function DfwOperatingSnapshot() {
  return (
    <figure className="toll-snapshot" aria-labelledby="dfw-snapshot-caption">
      <div className="toll-figure-label">
        <span>2025 sponsor-reported snapshot</span>
        <span>USD / adjusted figures</span>
      </div>
      <div className="toll-snapshot__scroll">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Revenue</th>
              <th>Adj. EBITDA</th>
              <th>Margin</th>
              <th>Net debt / EBITDA</th>
              <th>Revenue / transaction</th>
            </tr>
          </thead>
          <tbody>
            {dfwMetrics.map((metric) => (
              <tr key={metric.project}>
                <th scope="row">{metric.project}</th>
                <td>{metric.revenue}</td>
                <td>{metric.ebitda}</td>
                <td>{metric.margin}</td>
                <td>{metric.leverage}</td>
                <td>{metric.revenuePerTransaction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption id="dfw-snapshot-caption">
        These are Ferrovial-adjusted operating measures, not audited project cash available for debt service. The leverage ratio is the more revealing contrast: LBJ carries the tightest financial cushion.
      </figcaption>
    </figure>
  );
}

function ModelScreeningSnapshot() {
  return (
    <figure className="toll-snapshot toll-model-screen" aria-labelledby="model-screen-caption">
      <div className="toll-figure-label">
        <span>Analyst model / 2025-base screen</span>
        <span>Finite life / no terminal value</span>
      </div>
      <div className="toll-model-screen__warning">
        <strong>Scenario, not price.</strong>
        <p>These ranges are simplified DCF outputs from the supplied workbook. They are not bids, carrying values, fairness opinions, or current security quotations.</p>
      </div>
      <div className="toll-snapshot__scroll">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Bear EV</th>
              <th>Base EV</th>
              <th>Bull EV</th>
              <th>Base equity</th>
              <th>Base discount rate</th>
              <th>Input status</th>
            </tr>
          </thead>
          <tbody>
            {screeningEstimates.map((estimate) => (
              <tr key={estimate.project}>
                <th scope="row">{estimate.project}</th>
                <td>{estimate.bearEv}</td>
                <td>{estimate.baseEv}</td>
                <td>{estimate.bullEv}</td>
                <td>{estimate.baseEquity}</td>
                <td>{estimate.discountRate}</td>
                <td>{estimate.inputStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption id="model-screen-caption">
        The model holds EBITDA margins constant and simplifies maintenance, sharing, cash tax, and handback reserves. It subtracts modeled debt from enterprise value rather than building a levered debt-service schedule; it omits refinancing, swaps, working capital, tax basis, and explicit growth capex. SH 130’s $81.7M revenue, $68M EBITDA, and $450M debt are analyst estimates. Scenario width—not the base case—is the main conclusion.
      </figcaption>
    </figure>
  );
}

function Sh130RestructuringDiagram() {
  return (
    <figure className="toll-case-diagram" aria-labelledby="sh130-diagram-caption">
      <div className="toll-figure-label">
        <span>Case 01 / SH 130</span>
        <span>Road survives; equity changes</span>
      </div>
      <div className="toll-case-diagram__grid">
        <div className="toll-case-card">
          <span className="toll-case-card__date">2007–2016</span>
          <strong>Original concession</strong>
          <dl>
            <div><dt>Equity</dt><dd>Cintra 65% / Zachry 35%</dd></div>
            <div><dt>Senior banks</dt><dd>$685.8M</dd></div>
            <div><dt>TIFIA</dt><dd>$430M</dd></div>
            <div><dt>Private equity</dt><dd>$209.8M</dd></div>
          </dl>
        </div>
        <div className="toll-case-event">
          <span>March 2016</span>
          <strong>Chapter 11</strong>
          <p>Early toll revenue ran more than 60% below original forecasts.</p>
        </div>
        <div className="toll-case-card toll-case-card--after">
          <span className="toll-case-card__date">June 2017 onward</span>
          <strong>Reorganized concession</strong>
          <dl>
            <div><dt>Control</dt><dd>SVP-controlled vehicle</dd></div>
            <div><dt>Federal recovery</dt><dd>Subordinated debt + equity</dd></div>
            <div><dt>Dated estimate</dt><dd>65% / 32% / 4% other (2Q 2024; rounded)</dd></div>
            <div><dt>State title</dt><dd>Unchanged</dd></div>
          </dl>
        </div>
      </div>
      <figcaption id="sh130-diagram-caption">
        The original equity was eliminated, creditors received new claims, and the road continued operating. Current materials support an SVP-controlled majority and a federal minority; the more granular 2Q 2024 estimate is date-qualified and rounds to 101%.
      </figcaption>
    </figure>
  );
}

function Sh288BuyoutDiagram() {
  return (
    <figure className="toll-case-diagram toll-case-diagram--buyout" aria-labelledby="sh288-diagram-caption">
      <div className="toll-figure-label">
        <span>Case 02 / SH 288</span>
        <span>Public title + private rights + state termination</span>
      </div>
      <div className="toll-buyout-track">
        <div>
          <span>2016</span>
          <strong>52-year concession executed</strong>
          <p>Texas keeps the corridor; the project company receives toll and operating rights.</p>
        </div>
        <div>
          <span>2023</span>
          <strong>Abertis buys 56.76%</strong>
          <p>Approximately $1.53B for the controlling economic stake.</p>
        </div>
        <div className="toll-buyout-track__event">
          <span>Oct. 8, 2024</span>
          <strong>Texas pays $1,731,730,721</strong>
          <p>Debt is retired first; toll and operating control revert to the public structure.</p>
        </div>
        <div>
          <span>2025 filing</span>
          <strong>Abertis reports €775.9M loss</strong>
          <p>Creditors can be made whole while recently purchased equity loses heavily.</p>
        </div>
      </div>
      <figcaption id="sh288-diagram-caption">
        Texas did not repurchase its land. It paid to terminate the finite private bundle of toll, operating, and revenue rights.
      </figcaption>
    </figure>
  );
}

function ArticleTable({ table }: { table: TexasTollArticleTable }) {
  return (
    <figure className="toll-data-table" aria-labelledby={`${table.id}-caption`}>
      <div className="toll-data-table__scroll">
        <table>
          <caption id={`${table.id}-caption`}>{table.caption}</caption>
          <thead>
            <tr>
              {table.columns.map((column) => <th key={column} scope="col">{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell, index) => index === 0
                  ? <th key={`${index}-${cell}`} scope="row">{cell}</th>
                  : <td key={`${index}-${cell}`}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note ? <figcaption>{table.note}</figcaption> : null}
    </figure>
  );
}

function InstrumentRoutes() {
  return (
    <div className="toll-instrument-grid" aria-label="Practical routes to Texas toll-road exposure">
      {instrumentRoutes.map((route) => (
        <article key={route.label}>
          <span>{route.access}</span>
          <h3>{route.label}</h3>
          <p>{route.payoff}</p>
          <small>{route.constraint}</small>
        </article>
      ))}
    </div>
  );
}

const tollEditorialPlates = {
  ownership: {
    src: '/images/research/toll-road-ownership-stack.jpg',
    alt: 'Monochrome cutaway artwork showing a toll road above layered contracts, data, and capital claims.',
    label: 'Editorial plate 01 / ownership stack',
    caption: 'The pavement, operating rights, information systems, debt, and residual equity occupy different layers.',
  },
  cashFlow: {
    src: '/images/research/toll-road-capital-layers.jpg',
    alt: 'Monochrome artwork showing elevated highways above layered traffic data and capital flows.',
    label: 'Editorial plate 02 / capital layers',
    caption: 'Traffic becomes equity value only after collection, operating, lifecycle, financing, and public claims.',
  },
  access: {
    src: '/images/research/toll-road-contract-paths.jpg',
    alt: 'Monochrome artwork showing several paths branching from one central toll-road corridor.',
    label: 'Editorial plate 03 / access paths',
    caption: 'Bond, fund, listed-sponsor, and distressed-debt routes lead to different claims on the same infrastructure.',
  },
  risk: {
    src: '/images/research/toll-road-risk-horizon.jpg',
    alt: 'Monochrome artwork showing a highway running through rising and falling financial curves toward the horizon.',
    label: 'Editorial plate 04 / duration and risk',
    caption: 'Finite concession life, traffic variance, leverage, and discount rates reshape the value of a durable road.',
  },
} as const;

function TollEditorialPlate({ plate }: { plate: (typeof tollEditorialPlates)[keyof typeof tollEditorialPlates] }) {
  return (
    <figure className="toll-editorial-plate">
      <div className="toll-figure-label">
        <span>{plate.label}</span>
        <span>Generated editorial artwork / July 20, 2026</span>
      </div>
      <img src={plate.src} alt={plate.alt} loading="lazy" decoding="async" />
      <figcaption>{plate.caption}</figcaption>
    </figure>
  );
}

function SectionVisual({ sectionId, position }: { sectionId: string; position: 'before' | 'after' }) {
  if (sectionId === 'a-road-can-have-seven-different-owners' && position === 'after') {
    return <><OwnershipStackDiagram /><TollEditorialPlate plate={tollEditorialPlates.ownership} /></>;
  }
  if (sectionId === 'how-a-toll-road-turns-traffic-into-equity-cash' && position === 'before') return <CashFlowWaterfall />;
  if (sectionId === 'how-a-toll-road-turns-traffic-into-equity-cash' && position === 'after') {
    return <><TollEditorialPlate plate={tollEditorialPlates.cashFlow} /><DfwOperatingSnapshot /></>;
  }
  if (sectionId === 'sh-130-the-danger-of-believing-the-traffic-model' && position === 'before') return <Sh130RestructuringDiagram />;
  if (sectionId === 'sh-288-the-value-of-a-termination-clause' && position === 'before') return <Sh288BuyoutDiagram />;
  if (sectionId === 'what-makes-a-texas-toll-road-valuable' && position === 'after') {
    return <><TollEditorialPlate plate={tollEditorialPlates.risk} /><ModelScreeningSnapshot /></>;
  }
  if (sectionId === 'can-an-investor-actually-buy-one' && position === 'after') {
    return <><InstrumentRoutes /><TollEditorialPlate plate={tollEditorialPlates.access} /></>;
  }
  return null;
}

function ArticleSection({
  section,
  index,
}: {
  section: (typeof TEXAS_TOLL_ARTICLE_SECTIONS)[number];
  index: string;
}) {
  return (
    <section id={section.id}>
      <ArticleSectionHeader index={index}>
        {section.title.replace(/^[IVX]+\.\s*/, '')}
      </ArticleSectionHeader>
      <SectionVisual sectionId={section.id} position="before" />
      {section.blocks.map((block, index) => {
        if (block.kind === 'table') {
          const table = TABLES_BY_ID.get(block.tableId);
          return table ? <Fragment key={block.tableId}><ArticleTable table={table} /></Fragment> : null;
        }
        return <Fragment key={`${section.id}-markdown-${index}`}><ArticleMarkdown markdown={block.markdown} /></Fragment>;
      })}
      <SectionVisual sectionId={section.id} position="after" />
    </section>
  );
}

function FactGapLedger({ index }: { index: string }) {
  return (
    <section id="what-remains-unknown">
      <ArticleSectionHeader index={index}>What remains unknown</ArticleSectionHeader>
      <p className="toll-section-intro">
        The public record is unusually rich, but it does not expose every cap-table right, distribution waterfall, operating subcontract, or current SH 130 financial statement. Those gaps are measurement limits—not evidence that the missing fact favors either side of the investment case.
      </p>
      <div className="toll-gap-grid">
        {TEXAS_TOLL_ARTICLE_FACT_GAPS.map((group) => (
          <article key={group.title}>
            <h3>{group.title}</h3>
            <ArticleMarkdown markdown={group.items.map((item) => `- ${item}`).join('\n')} />
          </article>
        ))}
      </div>
    </section>
  );
}

function FrequentlyAskedQuestions({ index }: { index: string }) {
  return (
    <section id="frequently-asked-questions">
      <ArticleSectionHeader index={index}>Texas toll-road ownership, answered directly</ArticleSectionHeader>
      <div className="toll-faq-list">
        {TEXAS_TOLL_ARTICLE_FAQS.map((faq, index) => (
          <details key={faq.question} open={index === 0}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function SourceLedger({ index }: { index: string }) {
  return (
    <section id="source-ledger" className="toll-source-ledger">
      <ArticleSectionHeader index={index}>Source ledger</ArticleSectionHeader>
      <p className="toll-section-intro">
        Executed agreements, government records, audited statements, SEC-filed sponsor disclosures, and clearly labeled company or pension materials. Source dates and limitations are preserved in the text.
      </p>
      <ol>
        {TEXAS_TOLL_ARTICLE_SOURCES.map((source) => (
          <li key={source.id} id={`source-${source.id}`}>
            <span className="toll-source-ledger__id">{source.id.toUpperCase()}</span>
            <div>
              <strong>{source.label}</strong>
              <p>{source.note}</p>
              <div className="toll-source-ledger__links">
                {source.hrefs.map((href, index) => (
                  <a key={href} href={href} target="_blank" rel="noreferrer">
                    {source.hrefs.length > 1 ? `Open source ${index + 1}` : 'Open source'}
                  </a>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function TexasTollRoadArticlePage() {
  useSEO(ROUTE);

  useEffect(() => {
    const targetId = window.location.hash.slice(1);

    if (!targetId) {
      window.scrollTo(0, 0);
      return undefined;
    }

    let frame = 0;
    let attempts = 0;
    const scrollToTarget = () => {
      const target = document.querySelector<HTMLElement>(`#top #${CSS.escape(targetId)}`);
      const lenis = window.lenis as unknown as {
        resize?: () => void;
        scrollTo: (target: HTMLElement, options: { immediate: boolean }) => void;
      } | undefined;

      if (target && lenis) {
        lenis.resize?.();
        lenis.scrollTo(target, { immediate: true });
        return;
      }

      if (attempts < 4) {
        attempts += 1;
        frame = window.requestAnimationFrame(scrollToTarget);
        return;
      }

      target?.scrollIntoView();
    };

    frame = window.requestAnimationFrame(scrollToTarget);

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const navItems: ArticleNavItem[] = createArticleNavigation([
    { kind: 'overview', id: 'overview', label: 'Overview' },
    ...TEXAS_TOLL_ARTICLE_SECTIONS.map((section) => ({
      kind: 'section' as const,
      id: section.id,
      label: section.title.replace(/^[IVX]+\.\s*/, ''),
    })),
    {
      kind: 'section',
      id: 'what-remains-unknown',
      label: 'What remains unknown',
    },
    {
      kind: 'faq',
      id: 'frequently-asked-questions',
      label: 'Direct answers',
    },
    {
      kind: 'source',
      id: 'source-ledger',
      label: 'Source ledger',
    },
  ]);
  const config: ArticleReaderConfig = {
    activePath: '/markets',
    mode: 'reference',
    className: 'texas-toll-article',
    archive: {
      href: '/markets',
      label: 'Markets archive',
    },
    hero: {
      eyebrow: 'Texas toll-road ownership / cash flow / risk',
      title: TEXAS_TOLL_ARTICLE_TITLE,
      displayTitle: TEXAS_TOLL_ARTICLE_DISPLAY_TITLE,
      deck: TEXAS_TOLL_ARTICLE_DESCRIPTION,
      image: {
        src: '/images/research/texas-toll-roads-reader-hero.webp',
        alt: 'Monochrome editorial artwork representing Texas toll-road infrastructure and layered ownership.',
        label: 'Ownership map / 01',
        caption: 'Public pavement, contractual rights, debt claims, and residual cash flow.',
      },
    },
    publication: {
      subject: 'Infrastructure ownership',
      published: {
        dateTime: TEXAS_TOLL_ARTICLE_DATE.replaceAll('.', '-'),
        value: 'July 11, 2026',
      },
      updated: {
        dateTime: TEXAS_TOLL_ARTICLE_UPDATED.replaceAll('.', '-'),
        value: 'July 11, 2026',
      },
      readTime: TEXAS_TOLL_ARTICLE_READ_TIME,
      evidence: `${TEXAS_TOLL_ARTICLE_SOURCES.length} sources`,
    },
    metrics: headlineMetrics.map((metric) => ({
      label: metric.label,
      value: metric.value,
      note: metric.note,
    })),
    callouts: [{
      label: 'Direct answer',
      title: 'Texas toll roads do not have one owner.',
      content: (
        <p>
          Texas, a county, or a public authority usually owns the physical roadway. A public system may keep the toll revenue, or a concession company may hold a finite right to operate the lanes and collect tolls. Sponsors own the company; lenders control senior claims; billing can sit with another public agency; and the state retains or recovers the asset at expiry.
        </p>
      ),
    }],
    navigation: { items: navItems },
    boundary: {
      label: 'Evidence boundary',
      content: 'Educational infrastructure research. Not investment, legal, tax, or municipal-bond advice.',
    },
    endnote: {
      content: 'Research cutoff: July 11, 2026. All dollar figures are nominal unless stated otherwise. Calculated figures are labeled in context.',
      links: [
        { href: '/markets', label: 'Markets archive' },
        { href: '/research', label: 'Research archive' },
        { href: '/research/search-console/technical-seo-public-data-infrastructure', label: 'Source methodology' },
        { href: '/about', label: 'About the author' },
      ],
    },
  };

  return (
    <ArticleReader config={config}>
        <section id="overview">
          <ArticleSectionHeader index={getArticleNavigationIndex(navItems, 'overview')}>
            Overview
          </ArticleSectionHeader>
          <ArticleMarkdown markdown={TEXAS_TOLL_ARTICLE_LEDE_MARKDOWN} />
        </section>
        {TEXAS_TOLL_ARTICLE_SECTIONS.map((section) => (
          <Fragment key={section.id}>
            <ArticleSection
              section={section}
              index={getArticleNavigationIndex(navItems, section.id)}
            />
          </Fragment>
        ))}
        <FactGapLedger index={getArticleNavigationIndex(navItems, 'what-remains-unknown')} />
        <FrequentlyAskedQuestions
          index={getArticleNavigationIndex(navItems, 'frequently-asked-questions')}
        />
        <SourceLedger index={getArticleNavigationIndex(navItems, 'source-ledger')} />
    </ArticleReader>
  );
}
