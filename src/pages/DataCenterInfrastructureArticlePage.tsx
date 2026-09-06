import { RestoredArticleSummary } from '../components/RestoredArticleSummary';
import { ArticleReader, createArticleNavigation } from '../components/ArticleLayout';
import { restoredArticleConfig } from './restoredArticleConfig';
import { DATA_CENTER_INFRASTRUCTURE_ARTICLE } from '../content/restoredResearchArticles';
import '../styles/data-center-article.css';
import { Fragment, useMemo, useState, type KeyboardEvent } from 'react';

import {
  DATA_CENTER_ARTICLE_FACT_GAPS,
  DATA_CENTER_ARTICLE_FAQS,
  DATA_CENTER_ARTICLE_LEDE_MARKDOWN,
  DATA_CENTER_ARTICLE_SECTIONS,
  DATA_CENTER_ARTICLE_SLUG,
  DATA_CENTER_ARTICLE_SOURCES,
  DATA_CENTER_ARTICLE_TABLES,
  type DataCenterArticleTable,
} from '../content/dataCenterInfrastructureArticle';
import { getSeoRoute } from '../seo/routes';
import { markdownToReact } from '../utils/markdownToReact';
import { useSEO } from '../utils/seo';

const ROUTE = getSeoRoute(`/markets/${DATA_CENTER_ARTICLE_SLUG}`)!;
const TABLES_BY_ID = new Map(DATA_CENTER_ARTICLE_TABLES.map((table) => [table.id, table]));

const headlineMetrics = [
  { value: '20%', label: 'Meta equity ownership', note: '$45.95B disclosed maximum exposure' },
  { value: '99 days', label: 'PF2 proceeds in escrow', note: 'debt close ≠ usable construction cash' },
  { value: '100%', label: 'remaining base rent', note: 'PF1 post-commencement convenience exit' },
  { value: '38', label: 'DataBank ABS investors', note: '$1.1B operating-asset securitization' },
] as const;

const assetStates = [
  {
    index: '01',
    label: 'Generic land',
    evidence: 'Title or option, acreage, ordinary utilities',
    valuation: 'Comparable land value and alternative use',
    capital: 'Developer equity, land lender',
    risk: 'Site suitability and opportunity cost',
    unlock: 'Entitlement plus a credible utility study',
  },
  {
    index: '02',
    label: 'Entitled data-center land',
    evidence: 'Zoning, environmental path, site plan, preliminary permits',
    valuation: 'Comparable entitled sites and residual development value',
    capital: 'Developer and land-JV equity',
    risk: 'Political reversal, permit conditions, no power',
    unlock: 'A defined power request and delivery concept',
  },
  {
    index: '03',
    label: 'Power-positioned land',
    evidence: 'Utility studies, queue position, deposits, transmission plan',
    valuation: 'Probability-weighted powered-acre or $/MW option value',
    capital: 'Institutional land equity, preferred equity, development debt',
    risk: 'Deliverability, upgrade cost, transferability and timing',
    unlock: 'Executable service path plus demand commitment',
  },
  {
    index: '04',
    label: 'Tenant-backed development',
    evidence: 'Lease or capacity agreement, design criteria, credit support',
    valuation: 'Conditional rent less development cost',
    capital: 'JV equity, private credit, conditional construction lenders',
    risk: 'Commencement tests, tenant options, cost and power',
    unlock: 'Funded equity, debt, permits, power and completion support',
  },
  {
    index: '05',
    label: 'Financed construction',
    evidence: 'Loan or indenture, controlled accounts, completion guarantee',
    valuation: 'Cost to complete plus tenant-credit-adjusted yield on cost',
    capital: 'Banks, private notes, preferred equity',
    risk: 'Cost overrun, schedule, energization and acceptance',
    unlock: 'Energized and commissioned technical systems',
  },
  {
    index: '06',
    label: 'Energized technical facility',
    evidence: 'Active utility service, tested electrical and cooling systems',
    valuation: 'Replacement cost plus probability-weighted rent',
    capital: 'Bridge and takeout lenders, infrastructure equity',
    risk: 'Final acceptance, SLA and rent-start timing',
    unlock: 'Tenant acceptance and service commencement',
  },
  {
    index: '07',
    label: 'Accepted, rent-producing asset',
    evidence: 'Acceptance certificate, invoices, operating metrics',
    valuation: 'Lease DCF, DSCR, cap rate and property recovery',
    capital: 'Insurers, term banks, ABS and CMBS investors',
    risk: 'Concentration, reliability, rollover and residual value',
    unlock: 'Operating history, reserves and a permanent package',
  },
  {
    index: '08',
    label: 'Permanently financed security',
    evidence: 'Rated notes or term debt, cash traps, amortization',
    valuation: 'Structured cash flow and rating-case recovery',
    capital: 'ABS investors, insurers, pension and infrastructure debt',
    risk: 'Balloon, re-leasing, obsolescence and extension',
    unlock: 'Diversification, renewal, expansion or amortization',
  },
  {
    index: '09',
    label: 'Portfolio platform',
    evidence: 'Multiple assets and tenants, repeat issuance, governance',
    valuation: 'Portfolio DCF, sum of parts, borrowing base',
    capital: 'Broad institutional debt and equity',
    risk: 'Correlated tenant, power and technology exposure',
    unlock: 'Renewal, asset rotation, sale or recapitalization',
  },
  {
    index: '10',
    label: 'Residual / re-leasing asset',
    evidence: 'Lease expiry or default, plant condition, remaining power rights',
    valuation: 'Retrofit-adjusted re-leasing, land and power value',
    capital: 'Opportunistic real estate, rescue credit, new tenant capital',
    risk: 'Retrofit cost, downtime, market depth and power-right loss',
    unlock: 'A new lease, recommissioning or alternate use',
  },
] as const;

const assetStatePhases = [
  { label: 'Site formation', range: 'States 01–03' },
  { label: 'Contract + build', range: 'States 04–06' },
  { label: 'Operate + finance', range: 'States 07–09' },
  { label: 'Residual', range: 'State 10' },
] as const;

const powerStates = [
  { index: '0', state: 'Load concept', evidence: 'Required MW identified', value: 'Site-screening only', risk: 'No utility duty, price, or schedule' },
  { index: '1', state: 'Request / queue', evidence: 'Application and deposit', value: 'Option value', risk: 'Study outcome, queue reform, deposit loss' },
  { index: '2', state: 'Studied', evidence: 'Feasibility or system-impact work', value: 'Land differentiation', risk: 'No final service duty; cost and timing move' },
  { index: '3', state: 'Contracted, conditional', evidence: 'Agreement subject to approvals and milestones', value: 'A contractual pathway', risk: 'Termination, upgrade cost, regulatory delay' },
  { index: '4', state: 'Approved and funded', evidence: 'Service agreement, collateral, upgrade funding', value: 'Construction-bankable pathway', risk: 'Generation, transmission and permitting execution' },
  { index: '5', state: 'Physically energized', evidence: 'Delivery facilities complete; power at site', value: 'Major technical risk removed', risk: 'Reliability, ramp, curtailment, price, expansion' },
  { index: '6', state: 'Operating firm service', evidence: 'Facility runs at contracted load', value: 'Supports operating cash flow', risk: 'Price resets, emergencies, regulation, future phases' },
] as const;

const leaseLives = [
  {
    phase: 'Before commencement',
    thesis: 'A conditional promise to deliver a specification',
    points: ['Hall and MW delivery tests', 'Power, cooling, redundancy, and schedule conditions', 'Credits, extensions, rejection, or no-fee termination', 'Sponsor completion support carries the project'],
    risk: 'The developer still owns delivery risk.',
  },
  {
    phase: 'After commencement',
    thesis: 'A contracted operating payment stream',
    points: ['Base rent and pass-throughs are due', 'Non-use may not excuse payment', 'Termination fee or make-whole can protect debt', 'Tenant and guarantor credit become the central exposure'],
    risk: 'The lender now owns tenant, rollover, and residual risk.',
  },
] as const;

const capitalStack = [
  {
    title: 'Funded capital',
    subtitle: 'Cash already in the structure',
    items: ['Developer common equity', 'Institutional / JV equity', 'Preferred or structured equity', 'Construction debt', 'Permanent debt / ABS', 'Tenant equipment finance'],
  },
  {
    title: 'Contingent corporate support',
    subtitle: 'Cash or credit only when a trigger occurs',
    items: ['Completion guarantee', 'Tenant parent guarantee / LOC', 'Termination make-whole', 'Residual-value guarantee', 'Minimum utility payment', 'Repurchase or replacement support'],
  },
  {
    title: 'External cost support',
    subtitle: 'Value outside the property-company stack',
    items: ['Utility / rate-base investment', 'Customer-funded utility upgrades', 'Tax relief and abatements', 'Public roads, water, sewer, site work', 'Grants and clean-energy credits', 'Vendor terms and equipment programs'],
  },
] as const;

const residualLayers = [
  { index: '01', kind: 'Contract', label: 'Lease + tenant credit', note: 'Highest during term; can vanish at expiry or default' },
  { index: '02', kind: 'Scarce right', label: 'Power + interconnection rights', note: 'Often the scarcest durable legal and physical position' },
  { index: '03', kind: 'Network', label: 'Fiber + network position', note: 'Durable where latency, routes, and ecosystem matter' },
  { index: '04', kind: 'Technical plant', label: 'Electrical + cooling plant', note: 'Valuable only to the extent another user can adapt it' },
  { index: '05', kind: 'Physical plant', label: 'Shell + civil works', note: 'Depends on loading, height, divisibility, and security' },
  { index: '06', kind: 'Site floor', label: 'Land + permits', note: 'Floor value, but exposed to politics, water, and environment' },
] as const;

interface ArticleMarkdownProps {
  markdown: string;
  className?: string;
}

function ArticleMarkdown({ markdown, className = '' }: ArticleMarkdownProps) {
  const content = useMemo(() => markdownToReact(markdown), [markdown]);
  return <div className={`toll-article-prose ${className}`}>{content}</div>;
}

function FigureLabel({ left, right }: { left: string; right: string }) {
  return (
    <div className="toll-figure-label">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

interface FigureHeadingProps {
  id: string;
  index: string;
  meta: string;
  title: string;
  description: string;
}

function FigureHeading({ id, index, meta, title, description }: FigureHeadingProps) {
  return (
    <header className="dc-figure-heading">
      <FigureLabel left={index} right={meta} />
      <h3 id={id}>{title}</h3>
      <p>{description}</p>
    </header>
  );
}

function AssetStateExplorer() {
  const [activeIndex, setActiveIndex] = useState(6);
  const active = assetStates[activeIndex];

  const selectState = (index: number) => {
    setActiveIndex(index);
    window.requestAnimationFrame(() => {
      document.getElementById(`dc-state-tab-${assetStates[index].index}`)?.focus();
    });
  };

  const handleStateKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % assetStates.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + assetStates.length) % assetStates.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = assetStates.length - 1;
    if (nextIndex === index) return;
    event.preventDefault();
    selectState(nextIndex);
  };

  return (
    <figure className="dc-state-explorer" aria-labelledby="dc-state-title" aria-describedby="dc-state-explorer-caption">
      <FigureHeading
        id="dc-state-title"
        index="Interactive model 01"
        meta="Select a node · arrow keys move"
        title="Permanent capital enters after delivery becomes operating risk."
        description="The same site can support ten different valuation methods and capital pools as its evidence changes."
      />
      <div className="dc-state-explorer__phase-key" aria-hidden="true">
        {assetStatePhases.map((phase, index) => (
          <div key={phase.label} className={`dc-state-explorer__phase dc-state-explorer__phase--${index + 1}`}>
            <strong>{phase.label}</strong>
            <span>{phase.range}</span>
          </div>
        ))}
      </div>
      <div className="dc-state-explorer__rail">
        <svg viewBox="0 0 1000 58" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className="dc-state-explorer__line" d="M50 29 H950" />
          <path className="dc-state-explorer__line dc-state-explorer__line--operating" d="M650 29 H950" />
          <path className="dc-state-explorer__threshold" d="M650 5 V53" />
        </svg>
        <div className="dc-state-explorer__controls" role="tablist" aria-label="Data-center asset states">
          {assetStates.map((state, index) => (
            <button
              key={state.index}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-controls="dc-state-detail"
              id={`dc-state-tab-${state.index}`}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleStateKeyDown(event, index)}
            >
              <span className="dc-state-explorer__node">{state.index}</span>
              <strong>{state.label}</strong>
            </button>
          ))}
        </div>
      </div>
      <div className="dc-state-explorer__crossover"><span>State 07</span> Common permanent-capital crossover</div>
      <div
        id="dc-state-detail"
        className="dc-state-explorer__detail"
        role="tabpanel"
        aria-labelledby={`dc-state-tab-${active.index}`}
      >
        <header>
          <span>State {active.index}</span>
          <h3>{active.label}</h3>
        </header>
        <dl>
          <div><dt>Evidence</dt><dd>{active.evidence}</dd></div>
          <div><dt>Valuation lens</dt><dd>{active.valuation}</dd></div>
          <div><dt>Available capital</dt><dd>{active.capital}</dd></div>
          <div><dt>Dominant risk</dt><dd>{active.risk}</dd></div>
          <div><dt>Next unlock</dt><dd>{active.unlock}</dd></div>
        </dl>
      </div>
      <figcaption id="dc-state-explorer-caption">
        A project can stop in any state or regress. State 07 is the closest common crossover for permanent cash-flow capital; State 08 packages it rather than creating it.
      </figcaption>
    </figure>
  );
}

function PowerStateLadder() {
  return (
    <figure className="dc-power-ladder" aria-labelledby="dc-power-title" aria-describedby="dc-power-caption">
      <FigureHeading
        id="dc-power-title"
        index="Figure 02"
        meta="Qualitative sequence · not to scale"
        title="A power position gains value in discrete contractual steps."
        description="Each step removes one uncertainty while leaving a different price, timing, transfer, or operating risk behind."
      />
      <div className="dc-power-ladder__plot">
        <svg viewBox="0 0 980 270" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className="dc-power-ladder__path-shadow" d="M30 236 H210 V204 H350 V172 H490 V140 H630 V108 H770 V76 H910 V44 H950" />
          <path className="dc-power-ladder__path" d="M30 236 H210 V204 H350 V172 H490 V140 H630 V108 H770 V76 H910 V44 H950" />
        </svg>
        <ol>
          {powerStates.map((state, index) => (
            <li key={state.index} style={{ paddingTop: `${(powerStates.length - 1 - index) * 1.55}rem` }}>
              <article>
                <span>{state.index}</span>
                <strong>{state.state}</strong>
                <small>{state.evidence}</small>
                <p>{state.value}</p>
                <em>{state.risk}</em>
              </article>
            </li>
          ))}
        </ol>
      </div>
      <div className="dc-power-ladder__axis" aria-hidden="true">
        <span>Development option</span>
        <span>Operating cash-flow support</span>
      </div>
      <figcaption id="dc-power-caption">“Secured” should always be replaced by the exact state, remaining conditions, price, schedule, and remedies. The vertical rise shows de-risking sequence, not a measured valuation.</figcaption>
    </figure>
  );
}

function LeaseTwoLives() {
  return (
    <figure className="dc-lease-lives" aria-labelledby="dc-lease-title" aria-describedby="dc-lease-caption">
      <FigureHeading
        id="dc-lease-title"
        index="Figure 03"
        meta="One contract · two risk objects"
        title="Acceptance flips the lease from a specification promise to a payment stream."
        description="The term may be unchanged, but the party carrying the dominant risk changes at the operating hinge."
      />
      <div className="dc-lease-lives__plot">
        <svg viewBox="0 0 900 120" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <marker id="dc-lease-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0 L10 5 L0 10 z" />
            </marker>
          </defs>
          <path className="dc-lease-lives__line dc-lease-lives__line--delivery" d="M24 60 H430" markerEnd="url(#dc-lease-arrow)" />
          <path className="dc-lease-lives__line dc-lease-lives__line--operating" d="M470 60 H876" markerEnd="url(#dc-lease-arrow)" />
        </svg>
        <section className="dc-lease-life dc-lease-life--delivery">
          <span>01 · Delivery life</span>
          <h4>{leaseLives[0].phase}</h4>
          <p>{leaseLives[0].thesis}</p>
          <ul>{leaseLives[0].points.map((point) => <li key={point}>{point}</li>)}</ul>
          <strong>{leaseLives[0].risk}</strong>
        </section>
        <div className="dc-lease-lives__hinge">
          <span>Operating hinge</span>
          <strong>Acceptance</strong>
          <small>Rent starts</small>
        </div>
        <section className="dc-lease-life dc-lease-life--operating">
          <span>02 · Cash-flow life</span>
          <h4>{leaseLives[1].phase}</h4>
          <p>{leaseLives[1].thesis}</p>
          <ul>{leaseLives[1].points.map((point) => <li key={point}>{point}</li>)}</ul>
          <strong>{leaseLives[1].risk}</strong>
        </section>
      </div>
      <figcaption id="dc-lease-caption">A long headline term is not enough. Delivery, acceptance, termination, minimum-payment, and guarantor terms determine whether the lease is truly offtake-like.</figcaption>
    </figure>
  );
}

function ShadowCapitalStack() {
  return (
    <figure className="dc-capital-stack" aria-labelledby="dc-capital-title" aria-describedby="dc-capital-caption">
      <FigureHeading
        id="dc-capital-title"
        index="Figure 04"
        meta="Economic support map"
        title="Three support systems can make one campus look fully funded."
        description="Only one is cash already in the project company. The others activate on a trigger or sit outside the property stack."
      />
      <div className="dc-capital-stack__diagram">
        <div className="dc-capital-stack__lanes">
        {capitalStack.map((column, index) => (
          <section key={column.title} className={`dc-capital-stack__lane dc-capital-stack__lane--${index + 1}`}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h4>{column.title}</h4>
            <p>{column.subtitle}</p>
            <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ))}
        </div>
        <svg className="dc-capital-stack__connectors" viewBox="0 0 900 136" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className="dc-capital-stack__connector dc-capital-stack__connector--funded" d="M150 0 V42 Q150 70 180 70 H418 Q450 70 450 104 V132" />
          <path className="dc-capital-stack__connector dc-capital-stack__connector--contingent" d="M450 0 V132" />
          <path className="dc-capital-stack__connector dc-capital-stack__connector--external" d="M750 0 V42 Q750 70 720 70 H482 Q450 70 450 104 V132" />
        </svg>
        <div className="dc-capital-stack__project">
          <span>Funded project company</span>
          <strong>Campus delivery → operating cash flow</strong>
          <p>All three lanes can lower the effective cost or risk of delivery, but only funded capital is continuously present as cash or debt proceeds.</p>
        </div>
      </div>
      <div className="dc-capital-stack__return">
        <span>↶ Loss-return test</span>
        <p>For every guarantee, tariff, or incentive, identify the trigger, cap, expiry, exclusions, and the party that owns the loss after protection burns off.</p>
      </div>
      <figcaption id="dc-capital-caption">Funded capital, contingent promises, and external cost support perform different economic jobs and should remain visibly separate.</figcaption>
    </figure>
  );
}

function ResidualValueStack() {
  return (
    <figure className="dc-residual-stack" aria-labelledby="dc-residual-title" aria-describedby="dc-residual-caption">
      <FigureHeading
        id="dc-residual-title"
        index="Figure 05"
        meta="Schematic cutaway · not priced"
        title="Residual value survives in layers with different clocks."
        description="A lease can disappear overnight. Power, network position, plant, shell, and land decay—or transfer—at different rates."
      />
      <div className="dc-residual-stack__diagram">
        {residualLayers.map((layer) => (
          <article key={layer.index}>
            <div className="dc-residual-stack__layer">
              <span>{layer.index}</span>
              <div><small>{layer.kind}</small><strong>{layer.label}</strong></div>
            </div>
            <p>{layer.note}</p>
          </article>
        ))}
      </div>
      <figcaption id="dc-residual-caption">The recovery case should be built component by component. The lease, power position, technical plant, shell, and land do not share one useful life.</figcaption>
    </figure>
  );
}

function CaseUnderwritingMap({ table }: { table: DataCenterArticleTable }) {
  return (
    <figure className="dc-table-visual dc-underwriting-figure" aria-labelledby="dc-underwriting-title" aria-describedby="dc-underwriting-caption">
      <FigureHeading
        id="dc-underwriting-title"
        index="Case map 06"
        meta={`${table.rows.length} transactions · read left to right`}
        title="Every transaction finances a different handoff."
        description="Construction object, support package, and permanent repayment object are related—but they are not the same collateral."
      />
      <ol className="dc-underwriting-map">
        {table.rows.map((row, index) => {
          const stages = [
            { label: 'Build', value: row[1], tone: 'build' },
            { label: 'Support', value: row[2], tone: 'support' },
            { label: 'Permanent state', value: row[3], tone: 'permanent' },
          ] as const;
          return (
            <li key={row[0]}>
              <header><span>{String(index + 1).padStart(2, '0')}</span><strong>{row[0]}</strong></header>
              <div className="dc-underwriting-map__sequence">
                {stages.map((stage) => (
                  <div key={stage.label} className="dc-underwriting-map__stage" data-tone={stage.tone}>
                    <span>{stage.label}</span>
                    <p>{stage.value}</p>
                  </div>
                ))}
              </div>
              <aside><span>Still exposed</span><p>{row[4]}</p></aside>
            </li>
          );
        })}
      </ol>
      <figcaption id="dc-underwriting-caption">The arrow sequence is analytical, not chronological to scale. Open the exact research table below for the complete record and caveat.</figcaption>
    </figure>
  );
}

function StateRegressionMap({ table }: { table: DataCenterArticleTable }) {
  return (
    <figure className="dc-table-visual dc-regression-figure" aria-labelledby="dc-regression-title" aria-describedby="dc-regression-caption">
      <FigureHeading
        id="dc-regression-title"
        index="Case map 07"
        meta={`${table.rows.length} reversals · loss traced by layer`}
        title="Project failure is usually a state change, not a zero."
        description="The lost state, surviving asset, and exposed party must be traced separately before the recovery conclusion is useful."
      />
      <ol className="dc-regression-map">
        {table.rows.map((row, index) => (
          <li key={row[0]}>
            <header><span>{String(index + 1).padStart(2, '0')}</span><strong>{row[0]}</strong></header>
            <div className="dc-regression-map__chain">
              <div data-tone="lost"><span>State lost</span><p>{row[1]}</p></div>
              <div data-tone="survived"><span>What survived</span><p>{row[2]}</p></div>
              <div data-tone="exposed"><span>Exposure remained with</span><p>{row[3]}</p></div>
            </div>
            <blockquote><span>Lesson</span><p>{row[4]}</p></blockquote>
          </li>
        ))}
      </ol>
      <figcaption id="dc-regression-caption">Arrows show the recovery-analysis sequence, not legal priority. The exact table remains available below.</figcaption>
    </figure>
  );
}

function TableVisualSummary({ table }: { table: DataCenterArticleTable }) {
  if (table.id === 'case-underwriting-map') return <CaseUnderwritingMap table={table} />;
  if (table.id === 'state-regression-cases') return <StateRegressionMap table={table} />;
  return null;
}

function TableScrollHint() {
  return (
    <div className="toll-table-scroll-hint" aria-hidden="true">
      <span>Scroll horizontally for the full record</span>
      <span>→</span>
    </div>
  );
}

function ArticleTable({ table }: { table: DataCenterArticleTable }) {
  return (
    <>
      <TableVisualSummary table={table} />
      <details className="toll-data-disclosure dc-data-disclosure">
        <summary>
          <span className="toll-data-disclosure__index">Exact research table</span>
          <span className="toll-data-disclosure__title">{table.caption.replace(/^Table \d+\.\s*/, '')}</span>
          <span className="toll-data-disclosure__meta">{table.rows.length} cases · {table.columns.length} fields</span>
          <span className="toll-data-disclosure__action" aria-hidden="true" />
        </summary>
        <figure className="toll-data-table" aria-labelledby={`${table.id}-caption`}>
          <TableScrollHint />
          <div className="toll-data-table__scroll">
            <table>
              <caption id={`${table.id}-caption`}>{table.caption}</caption>
              <thead><tr>{table.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
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
          <figcaption>{table.note}</figcaption>
        </figure>
      </details>
    </>
  );
}

function SectionVisual({ sectionId, position }: { sectionId: string; position: 'before' | 'after' }) {
  if (sectionId === 'there-is-no-conversion-date' && position === 'after') return <AssetStateExplorer />;
  if (sectionId === 'power-is-an-option-until-it-can-be-delivered' && position === 'after') return <PowerStateLadder />;
  if (sectionId === 'the-lease-has-two-lives' && position === 'after') return <LeaseTwoLives />;
  if (sectionId === 'the-shadow-capital-stack' && position === 'after') return <ShadowCapitalStack />;
  if (sectionId === 'what-is-left-when-the-tenant-leaves' && position === 'after') return <ResidualValueStack />;
  return null;
}

function ArticleSection({ section, index }: { section: (typeof DATA_CENTER_ARTICLE_SECTIONS)[number]; index: number }) {
  return (
    <section id={section.id} className="toll-article-section scroll-mt-28">
      <header>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <h2>{section.title.replace(/^[IVX]+\.\s*/, '')}</h2>
      </header>
      <SectionVisual sectionId={section.id} position="before" />
      {section.blocks.map((block, blockIndex) => {
        if (block.kind === 'table') {
          const table = TABLES_BY_ID.get(block.tableId);
          return table ? <Fragment key={block.tableId}><ArticleTable table={table} /></Fragment> : null;
        }
        return <Fragment key={`${section.id}-${blockIndex}`}><ArticleMarkdown markdown={block.markdown} /></Fragment>;
      })}
      <SectionVisual sectionId={section.id} position="after" />
    </section>
  );
}

function FactGapLedger() {
  return (
    <section id="what-remains-unknown" className="toll-article-section scroll-mt-28">
      <header><span>10</span><h2>What remains unknown</h2></header>
      <p className="toll-section-intro">The public record is strongest around announced financings and successful closes. Missing private contracts, distressed loan files, and property-level recovery data are measurement gaps—not evidence that the absent facts support either side of the thesis.</p>
      <div className="toll-gap-grid">
        {DATA_CENTER_ARTICLE_FACT_GAPS.map((group) => (
          <article key={group.title}>
            <h3>{group.title}</h3>
            <ArticleMarkdown markdown={group.items.map((item) => `- ${item}`).join('\n')} />
          </article>
        ))}
      </div>
    </section>
  );
}

function FrequentlyAskedQuestions() {
  return (
    <section id="frequently-asked-questions" className="toll-article-section scroll-mt-28">
      <header><span>FAQ</span><h2>Data-center infrastructure, answered directly</h2></header>
      <div className="toll-faq-list">
        {DATA_CENTER_ARTICLE_FAQS.map((faq, index) => (
          <details key={faq.question} open={index === 0}>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function SourceLedger() {
  return (
    <section id="source-ledger" className="toll-article-section toll-source-ledger scroll-mt-28">
      <header><span>S</span><h2>Source ledger</h2></header>
      <p className="toll-section-intro">Primary filings, executed contract exhibits, regulator orders, ratings criteria, and direct transaction releases. The article distinguishes filed facts, company descriptions, analytical inferences, and unresolved private terms.</p>
      <ol>
        {DATA_CENTER_ARTICLE_SOURCES.map((source) => (
          <li key={source.id} id={`source-${source.id}`}>
            <span className="toll-source-ledger__id">{source.id.toUpperCase()}</span>
            <div>
              <strong>{source.label}</strong>
              <p>{source.note}</p>
              <div className="toll-source-ledger__links">
                {source.hrefs.map((href, index) => (
                  <a key={href} href={href} target="_blank" rel="noreferrer">{source.hrefs.length > 1 ? `Open source ${index + 1}` : 'Open source'}</a>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function DataCenterInfrastructureArticlePage() {
  useSEO(ROUTE);
  const navigation = createArticleNavigation([
    { kind: 'overview', id: 'overview', label: 'Overview' },
    ...DATA_CENTER_ARTICLE_SECTIONS.map((section) => ({ kind: 'section' as const, id: section.id, label: section.title.replace(/^[IVX]+\.\s*/, '') })),
    { kind: 'section', id: 'what-remains-unknown', label: 'What remains unknown' },
    { kind: 'faq', id: 'frequently-asked-questions', label: 'Direct answers' },
    { kind: 'source', id: 'source-ledger', label: 'Sources' },
  ]);
  const config = restoredArticleConfig(
    DATA_CENTER_INFRASTRUCTURE_ARTICLE, 'data-center-article', navigation,
    'Research cutoff: July 14, 2026. 21 source records; filed facts and private-term gaps remain separate.',
    headlineMetrics,
  );
  return (
    <ArticleReader config={config}>
      <section id="overview" className="toll-article-lede"><RestoredArticleSummary path={ROUTE.path} /><ArticleMarkdown markdown={DATA_CENTER_ARTICLE_LEDE_MARKDOWN} /></section>
                {DATA_CENTER_ARTICLE_SECTIONS.map((section, index) => (
                  <Fragment key={section.id}><ArticleSection section={section} index={index} /></Fragment>
                ))}
                <FactGapLedger />
                <FrequentlyAskedQuestions />
                <SourceLedger />
    </ArticleReader>
  );
}
