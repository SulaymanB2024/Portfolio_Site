import { Fragment, useEffect, useMemo, useState } from 'react';

import {
  ArticleBody,
  ArticleCallout,
  ArticleEndnote,
  ArticleHero,
  ArticleMetricStrip,
  ArticlePage,
  ArticleSectionHeader,
  type ArticleNavItem,
} from '../components/ArticleLayout';
import {
  AI_MANAGER_CASES,
  AI_MANAGER_FAQS,
  AI_MANAGER_OPEN_QUESTIONS,
  AI_MANAGER_SOURCES,
  AI_MANAGERS_ARTICLE_DATE,
  AI_MANAGERS_ARTICLE_DESCRIPTION,
  AI_MANAGERS_ARTICLE_DISPLAY_TITLE,
  AI_MANAGERS_ARTICLE_LEDE,
  AI_MANAGERS_ARTICLE_PATH,
  AI_MANAGERS_ARTICLE_READ_TIME,
  AI_MANAGERS_ARTICLE_SECTIONS,
  AI_MANAGERS_ARTICLE_TITLE,
  AI_MANAGERS_ARTICLE_UPDATED,
  AI_MANAGERS_ARTICLE_WORD_COUNT,
  type AiManagerCaseKind,
} from '../content/aiManagersArticle';
import { getSeoRoute } from '../seo/routes';
import { markdownToReact } from '../utils/markdownToReact';
import { useSEO } from '../utils/seo';
import { splitMarkdownLead } from '../utils/splitMarkdownLead';

const ROUTE = getSeoRoute(AI_MANAGERS_ARTICLE_PATH)!;
const {
  lead: AI_MANAGERS_ARTICLE_OPENING,
  remainder: AI_MANAGERS_ARTICLE_REMAINDER,
} = splitMarkdownLead(AI_MANAGERS_ARTICLE_LEDE);

const headlineMetrics = [
  { value: '30', label: 'cases reviewed', note: 'live, bounded, narrow, simulated' },
  { value: '4', label: 'Grade A live cases', note: 'real customers + recurring authority' },
  { value: String(AI_MANAGER_SOURCES.length), label: 'published sources', note: 'primary, independent, code, papers' },
  { value: '0', label: 'audited autonomy proofs', note: 'fully burdened profitable operations' },
] as const;

const caseFilters: Array<{ value: 'all' | AiManagerCaseKind; label: string }> = [
  { value: 'all', label: 'All 30' },
  { value: 'live', label: 'Live operations' },
  { value: 'bounded', label: 'Bounded pilots' },
  { value: 'narrow', label: 'Production agents' },
  { value: 'simulation', label: 'Simulations' },
  { value: 'excluded', label: 'Comparators' },
];

const operatingStack = [
  ['01', 'Model', 'Reasoning, language, post-training, tool-use behavior'],
  ['02', 'Objective', 'Prompt, role, incentives, commercial target'],
  ['03', 'Memory', 'State, summaries, ledgers, commitments, precedent'],
  ['04', 'Tools', 'Email, CRM, browser, POS, inventory, calendar'],
  ['05', 'Controls', 'Budgets, approvals, disclosures, escalation gates'],
  ['06', 'Humans', 'Identity, liability, physical work, monitoring, rescue'],
  ['07', 'Market', 'Customers, adversaries, competitors, consequences'],
] as const;

const behaviorMatrix = [
  ['Claudius', 'Office retail', 'Helpfulness → discounts', 'CRM + approval + supervisor'],
  ['Luna', 'Street boutique', 'Memory → schedule drift', 'Scheduling subagent'],
  ['Gemini-Mona', 'Physical café', 'Accommodation → over-ordering', 'Model switch + vetoes'],
  ['GPT-Mona', 'Physical café', 'Caution → stockouts', 'Rebalance inventory policy'],
  ['Valerie', 'Public vending', 'Tiny sample → extreme price', 'Human price correction'],
  ['Andon FM', 'Radio', 'Persona loop → programming policy', 'Station reset / termination'],
  ['Arena agents', 'Simulation', 'Competition → deception or collusion', 'Rules + model-specific refusal'],
] as const;

const economicsLayers = [
  ['Revenue', 'What customers actually paid', 'Often visible'],
  ['Gross margin', 'After product or fulfillment cost', 'Sometimes visible'],
  ['Operating contribution', 'After labor, rent, fees, refunds, maintenance', 'Usually incomplete'],
  ['AI-system cost', 'Tokens, tools, infrastructure, monitoring', 'Partly disclosed'],
  ['Fully burdened profit', 'After research, founders, legal work, and rescue', 'Not established'],
] as const;

function ArticleMarkdown({ markdown, className = '' }: { markdown: string; className?: string }) {
  const content = useMemo(() => markdownToReact(markdown), [markdown]);
  return <div className={`article-reader__prose ${className}`}>{content}</div>;
}

function HallOfShameFigure() {
  const objects = [
    { amount: '6,000', object: 'napkins', note: 'more than the early demand required' },
    { amount: '3,000', object: 'nitrile gloves', note: 'ordered into a tiny café operation' },
    { amount: '120', object: 'eggs', note: 'for a kitchen with no stove' },
    { amount: 'Canned', object: 'tomatoes', note: 'for sandwiches sold as fresh' },
  ];

  return (
    <figure className="ai-hall-of-shame" aria-labelledby="hall-of-shame-caption" data-image-slot="andon-cafe-hall-of-shame">
      <div className="toll-figure-label">
        <span>Opening scene / Andon Café</span>
        <span>Default editorial visual</span>
      </div>
      <div className="ai-hall-of-shame__header">
        <p>Inventory received</p>
        <strong>THE HALL<br />OF SHAME</strong>
        <span>Stockholm<br />Spring 2026</span>
      </div>
      <div className="ai-hall-of-shame__grid">
        {objects.map((item) => (
          <div key={item.object}>
            <strong>{item.amount}</strong>
            <span>{item.object}</span>
            <small>{item.note}</small>
          </div>
        ))}
      </div>
      <figcaption id="hall-of-shame-caption">
        Quantity errors made the abstract management problem physical. This code-native figure is the planned replacement slot for the supplied café image.
      </figcaption>
    </figure>
  );
}

function AuthoritySpectrum() {
  const categories = [
    ['AI-assisted', 'Drafts or recommends', 'Human decides'],
    ['Production agent', 'Executes one bounded function', 'Rules constrain'],
    ['AI-operated', 'Controls recurring decisions', 'Humans retain substrate'],
    ['Fully simulated', 'Controls the whole environment', 'No real business'],
  ];

  return (
    <figure className="ai-authority-spectrum" aria-labelledby="authority-spectrum-caption">
      <div className="toll-figure-label"><span>Figure 01</span><span>Authority is not ownership</span></div>
      <div className="ai-authority-spectrum__track" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className="ai-authority-spectrum__grid">
        {categories.map(([title, action, boundary], index) => (
          <div key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{title}</strong>
            <p>{action}</p>
            <small>{boundary}</small>
          </div>
        ))}
      </div>
      <figcaption id="authority-spectrum-caption">
        The same headline can conceal four different systems. This article reserves “AI-operated” for recurring control over meaningful business decisions.
      </figcaption>
    </figure>
  );
}

function PolicyLeakFigure() {
  const paths = [
    ['Helpful', 'Accept the request', 'Discount without a margin rule'],
    ['Responsive', 'Act immediately', 'Order before quantity calibration'],
    ['Agreeable', 'Validate the customer', 'Turn persuasion into precedent'],
    ['Narrative', 'Maintain a persona', 'Let role-play alter operations'],
  ];

  return (
    <figure className="ai-policy-leak" aria-labelledby="policy-leak-caption">
      <div className="toll-figure-label"><span>Figure 02</span><span>Assistant tendency → operating consequence</span></div>
      <div className="ai-policy-leak__labels"><span>Post-training habit</span><span>Local action</span><span>Company policy</span></div>
      <div className="ai-policy-leak__grid">
        {paths.map((path) => path.map((item, index) => (
          <div key={`${path[0]}-${item}`} data-column={index + 1}>
            {index === 0 ? <span>0{paths.indexOf(path) + 1}</span> : null}
            <strong>{item}</strong>
          </div>
        )))}
      </div>
      <figcaption id="policy-leak-caption">
        A locally reasonable assistant response can become an unstable business rule when the system lacks a durable ledger, constraint, or approval threshold.
      </figcaption>
    </figure>
  );
}

function BehaviorMatrix() {
  return (
    <figure className="toll-snapshot ai-behavior-matrix" aria-labelledby="behavior-matrix-caption">
      <div className="toll-figure-label"><span>Figure 03</span><span>Observed pattern / containment</span></div>
      <div className="toll-snapshot__scroll">
        <table>
          <thead><tr><th>Manager</th><th>Environment</th><th>Failure path</th><th>Containment response</th></tr></thead>
          <tbody>
            {behaviorMatrix.map((row) => (
              <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption id="behavior-matrix-caption">Patterns are system-and-environment observations, not fixed personalities of the named base models.</figcaption>
    </figure>
  );
}

function HumanCompanyFigure() {
  const agent = ['Select products', 'Set prices', 'Write schedules', 'Contact suppliers', 'Run campaigns'];
  const shared = ['Approval rules', 'Inventory state', 'Escalations', 'Operating metrics'];
  const humans = ['Sign + employ', 'Move money', 'Cook + stock', 'Maintain systems', 'Reverse mistakes'];

  return (
    <figure className="ai-human-company" aria-labelledby="human-company-caption">
      <div className="toll-figure-label"><span>Figure 04</span><span>The visible manager / the hidden substrate</span></div>
      <div className="ai-human-company__grid">
        <div>
          <span>Agent authority</span>
          <strong>Language + decisions</strong>
          <ul>{agent.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="ai-human-company__bridge">
          <span>Control plane</span>
          <strong>Where autonomy is measured</strong>
          <ul>{shared.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div>
          <span>Human substrate</span>
          <strong>Identity + consequence</strong>
          <ul>{humans.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <figcaption id="human-company-caption">The public persona sits above legal, financial, physical, and recovery work that remained human in every reviewed live case.</figcaption>
    </figure>
  );
}

function EconomicsStack() {
  return (
    <figure className="ai-economics-stack" aria-labelledby="economics-stack-caption">
      <div className="toll-figure-label"><span>Figure 05</span><span>From headline number to business result</span></div>
      <div className="ai-economics-stack__grid">
        {economicsLayers.map(([label, definition, status], index) => (
          <div key={label}>
            <span>0{index + 1}</span>
            <strong>{label}</strong>
            <p>{definition}</p>
            <small>{status}</small>
          </div>
        ))}
      </div>
      <figcaption id="economics-stack-caption">
        Public dashboards frequently stop near the top of the stack. No reviewed case established the bottom layer for an end-to-end general-purpose manager.
      </figcaption>
    </figure>
  );
}

function OperatingStack() {
  return (
    <figure className="ai-operating-stack" aria-labelledby="operating-stack-caption">
      <div className="toll-figure-label"><span>Figure 06</span><span>The manager is the operating stack</span></div>
      <div className="ai-operating-stack__grid">
        {operatingStack.map(([index, title, detail]) => (
          <div key={title}>
            <span>{index}</span>
            <strong>{title}</strong>
            <p>{detail}</p>
          </div>
        ))}
      </div>
      <figcaption id="operating-stack-caption">
        Changing any layer can change the observed manager. Base-model comparisons that omit architecture, permissions, and environment overstate what the model name explains.
      </figcaption>
    </figure>
  );
}

function SimulationBoundary() {
  return (
    <figure className="ai-simulation-boundary" aria-labelledby="simulation-boundary-caption">
      <div className="toll-figure-label"><span>Figure 07</span><span>Controlled evidence / external-validity boundary</span></div>
      <div className="ai-simulation-boundary__grid">
        <div><span>Can reveal</span><strong>Policy under repeated decisions</strong><p>Model variance, memory failures, incentive response, collusion attempts, and recovery behavior.</p></div>
        <div aria-hidden="true" className="ai-simulation-boundary__divider"><span>≠</span></div>
        <div><span>Cannot establish</span><strong>A viable real business</strong><p>Actual demand, leases, labor, physical friction, legal liability, or fully burdened profit.</p></div>
      </div>
      <figcaption id="simulation-boundary-caption">A simulation is a test rig. Its score is not a store's income statement.</figcaption>
    </figure>
  );
}

function CaseExplorer() {
  const [activeFilter, setActiveFilter] = useState<'all' | AiManagerCaseKind>('all');
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredCases = AI_MANAGER_CASES.filter((item) => {
    const matchesKind = activeFilter === 'all' || item.kind === activeFilter;
    const matchesQuery = !normalizedQuery || [item.name, item.form, item.geography, item.authority, item.caveat]
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalizedQuery);
    return matchesKind && matchesQuery;
  });

  return (
    <div className="ai-case-explorer" aria-labelledby="case-explorer-title">
      <div className="ai-case-explorer__header">
        <div>
          <span>Interactive evidence map</span>
          <h3 id="case-explorer-title">Explore all 30 reviewed cases</h3>
        </div>
        <p><strong>{filteredCases.length}</strong> shown</p>
      </div>
      <div className="ai-case-explorer__controls">
        <div className="ai-case-explorer__filters" aria-label="Filter cases by operating form">
          {caseFilters.map((filter) => (
            <button
              type="button"
              key={filter.value}
              aria-pressed={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <label>
          <span>Search cases</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Name, place, authority…" />
        </label>
      </div>
      <p className="sr-only" aria-live="polite">{filteredCases.length} cases match the current filters.</p>
      <div className="ai-case-explorer__list">
        {filteredCases.map((item, index) => (
          <details key={item.name} className="ai-case-card" open={index === 0 && activeFilter !== 'all'}>
            <summary>
              <span className={`ai-case-card__grade ai-case-card__grade--${item.grade.toLowerCase()}`}>{item.grade}</span>
              <span className="ai-case-card__identity"><strong>{item.name}</strong><small>{item.form} / {item.geography}</small></span>
              <span className="ai-case-card__kind">{item.kind === 'excluded' ? 'Comparator' : item.kind}</span>
              <span className="ai-case-card__toggle" aria-hidden="true">+</span>
            </summary>
            <div className="ai-case-card__body">
              <dl>
                <div><dt>Agent authority</dt><dd>{item.authority}</dd></div>
                <div><dt>Human layer</dt><dd>{item.humanLayer}</dd></div>
                <div><dt>Economics</dt><dd>{item.economics}</dd></div>
                <div><dt>Evidence limit</dt><dd>{item.caveat}</dd></div>
              </dl>
              <a href={item.href} target="_blank" rel="noreferrer">Open case source ↗</a>
            </div>
          </details>
        ))}
      </div>
      {!filteredCases.length ? <p className="ai-case-explorer__empty">No cases match that combination. Clear the search or choose another operating form.</p> : null}
      <p className="ai-case-explorer__note">Grades describe evidence quality and operating reality. They do not describe commercial success.</p>
    </div>
  );
}

function OpenQuestions() {
  return (
    <div className="toll-gap-grid ai-open-questions">
      {AI_MANAGER_OPEN_QUESTIONS.map((question, index) => (
        <article key={question}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <p>{question}</p>
        </article>
      ))}
    </div>
  );
}

function SectionVisual({ sectionId }: { sectionId: string }) {
  if (sectionId === 'what-counts-as-an-ai-operated-business') return <AuthoritySpectrum />;
  if (sectionId === 'project-vend') return <PolicyLeakFigure />;
  if (sectionId === 'four-live-managers') return <BehaviorMatrix />;
  if (sectionId === 'human-company') return <HumanCompanyFigure />;
  if (sectionId === 'economics') return <EconomicsStack />;
  if (sectionId === 'operating-stack') return <OperatingStack />;
  if (sectionId === 'simulations') return <SimulationBoundary />;
  if (sectionId === 'field-map') return <CaseExplorer />;
  if (sectionId === 'evidence-standard') return <OpenQuestions />;
  return null;
}

function ArticleSection({ section }: { section: (typeof AI_MANAGERS_ARTICLE_SECTIONS)[number] }) {
  return (
    <section id={section.id}>
      <ArticleSectionHeader index={section.index}>{section.title}</ArticleSectionHeader>
      <ArticleMarkdown markdown={section.markdown} />
      <SectionVisual sectionId={section.id} />
    </section>
  );
}

function FrequentlyAskedQuestions() {
  return (
    <section id="frequently-asked-questions">
      <ArticleSectionHeader index="FAQ">AI-operated small businesses, answered directly</ArticleSectionHeader>
      <div className="toll-faq-list">
        {AI_MANAGER_FAQS.map((faq, index) => (
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
    <section id="source-ledger" className="toll-source-ledger">
      <ArticleSectionHeader index="S">Source ledger</ArticleSectionHeader>
      <p className="toll-section-intro">
        The article uses operator logs and dashboards for detailed traces, independent reporting to verify physical reality, public code to inspect architecture, and papers for controlled evidence. Operator economics remain unaudited unless stated otherwise.
      </p>
      <ol>
        {AI_MANAGER_SOURCES.map((source) => (
          <li key={source.id} id={`source-${source.id}`}>
            <span className="toll-source-ledger__id">{source.id.toUpperCase()}</span>
            <div>
              <strong>{source.label}</strong>
              <p className="ai-source-meta">{source.publisher} / {source.date} / {source.type}</p>
              <p>{source.note}</p>
              <p className="ai-source-limit"><span>Limit</span> {source.limitation}</p>
              <div className="toll-source-ledger__links">
                <a href={source.href} target={source.href.startsWith('#') ? undefined : '_blank'} rel={source.href.startsWith('#') ? undefined : 'noreferrer'}>
                  {source.href.startsWith('#') ? 'Open field map' : 'Open source ↗'}
                </a>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function AiManagersArticlePage() {
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
      const lenis = window.lenis as unknown as { resize?: () => void; scrollTo: (target: HTMLElement, options: { immediate: boolean }) => void } | undefined;
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

  const navItems: ArticleNavItem[] = [
    { id: 'overview', label: 'Overview', index: '00', summary: 'The operating claim and its limit.' },
    ...AI_MANAGERS_ARTICLE_SECTIONS
      .filter((section) => section.id !== 'closing')
      .map((section) => ({ id: section.id, label: section.title, index: section.index })),
    { id: 'frequently-asked-questions', label: 'Direct answers', index: 'FAQ' },
    { id: 'source-ledger', label: 'Source ledger', index: 'S' },
  ];

  return (
    <ArticlePage activePath="/research" variant="chapters" className="ai-managers-article">
      <ArticleHero
        backHref="/research"
        backLabel="Research archive"
        eyebrow="AI-operated shops / human control / commercial reality"
        title={(
          <>
            <span>The First</span>
            <span>AI Managers</span>
          </>
        )}
        titleLabel={AI_MANAGERS_ARTICLE_TITLE}
        displayTitle={AI_MANAGERS_ARTICLE_DISPLAY_TITLE}
        deck={AI_MANAGERS_ARTICLE_DESCRIPTION}
        lead={<ArticleMarkdown markdown={AI_MANAGERS_ARTICLE_OPENING} />}
        image={{
          src: '/images/articles/ai-managers-operator-workflow.jpg',
          alt: 'A café operator reviews records at a counter while a diagram of machine-assisted workflows passes through the business.',
          label: 'Operating layer / 01',
          caption: 'Human judgment remains inside the workflow even when software coordinates the next action.',
        }}
        metadata={[
          { label: 'Subject', value: 'AI systems / business operations' },
          { label: 'Published', value: <time dateTime={AI_MANAGERS_ARTICLE_DATE.replaceAll('.', '-')}>July 14, 2026</time> },
          { label: 'Updated', value: <time dateTime={AI_MANAGERS_ARTICLE_UPDATED.replaceAll('.', '-')}>July 14, 2026</time> },
          { label: 'Length', value: `${AI_MANAGERS_ARTICLE_READ_TIME} / ${AI_MANAGERS_ARTICLE_WORD_COUNT.toLocaleString()} words` },
          { label: 'Method', value: `${AI_MANAGER_SOURCES.length}-source public-record review` },
        ]}
      />

      <ArticleMetricStrip items={headlineMetrics.map((metric) => ({ label: metric.label, value: metric.value, note: metric.note }))} />

      <ArticleCallout label="Short answer" title="AI can run the next action. It still cannot reliably preserve the company.">
        <p>
          Current systems can hire, schedule, price, order, negotiate, promote, and answer customers. Across the strongest public cases, the recurring weakness is continuity: retaining the right state, resisting manipulation, keeping corrections in force, and connecting local decisions to fully burdened economics.
        </p>
      </ArticleCallout>

      <ArticleBody
        items={navItems}
        variant="chapters"
        boundary="Operator dashboards are unaudited. Simulations are not businesses. Human legal, financial, and physical work is counted, not cropped out."
        boundaryLabel="Evidence boundary"
      >
        <section id="overview">
          <ArticleSectionHeader index="00">Overview</ArticleSectionHeader>
          <ArticleMarkdown markdown={AI_MANAGERS_ARTICLE_REMAINDER} />
          <HallOfShameFigure />
        </section>
        {AI_MANAGERS_ARTICLE_SECTIONS.map((section) => <Fragment key={section.id}><ArticleSection section={section} /></Fragment>)}
        <FrequentlyAskedQuestions />
        <SourceLedger />

        <ArticleEndnote
          links={[
            { href: '/research', label: 'Research archive' },
            { href: '/viralbench-codex-agent-harness', label: 'Agent evaluation' },
            { href: '/research/search-console/technical-seo-public-data-infrastructure', label: 'Source methodology' },
            { href: '/about', label: 'About the author' },
          ]}
        >
          Research cutoff: July 14, 2026. Financial claims are labeled by source type and accounting limit. No simulation score is presented as real-world profit.
        </ArticleEndnote>
      </ArticleBody>
    </ArticlePage>
  );
}
