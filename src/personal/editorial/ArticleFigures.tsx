import './article-figures.css'

export interface ArticleFiguresProps {
  slug: string
  sectionId: string
  position: 'before' | 'after'
}

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`


const VIRALBENCH_ARTICLE_INLINE_IMAGE = '/images/viralbench-evidence-network.png';

const VIRALBENCH_ARTICLE_IMAGE = '/images/viralbench-agent-harness-hero.png';

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
        <span>Inventory failure pattern</span>
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
        Quantity errors made the abstract management problem physical: locally plausible actions accumulated into an incoherent operating policy.
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
      <div className="toll-snapshot__scroll" role="region" aria-labelledby="behavior-matrix-caption" tabIndex={0}>
        <table>
          <caption className="sr-only">Observed AI-manager behavior patterns and containment responses</caption>
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

function aiSectionFigure(sectionId: string) {
  if (sectionId === 'what-counts-as-an-ai-operated-business') return <AuthoritySpectrum />;
  if (sectionId === 'project-vend') return <PolicyLeakFigure />;
  if (sectionId === 'four-live-managers') return <BehaviorMatrix />;
  if (sectionId === 'human-company') return <HumanCompanyFigure />;
  if (sectionId === 'economics') return <EconomicsStack />;
  if (sectionId === 'operating-stack') return <OperatingStack />;
  if (sectionId === 'simulations') return <SimulationBoundary />;
  return null
}

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
      <div className="toll-snapshot__scroll" role="region" aria-labelledby="dfw-snapshot-caption" tabIndex={0}>
        <table>
          <caption className="sr-only">2025 sponsor-reported operating snapshot for DFW toll-road projects</caption>
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
      <div className="toll-snapshot__scroll" role="region" aria-labelledby="model-screen-caption" tabIndex={0}>
        <table>
          <caption className="sr-only">Finite-life 2025-base valuation screening scenarios</caption>
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

function tollSectionFigure({ sectionId, position }: { sectionId: string; position: 'before' | 'after' }) {
  if (sectionId === 'a-road-can-have-seven-different-owners' && position === 'after') return <OwnershipStackDiagram />;
  if (sectionId === 'how-a-toll-road-turns-traffic-into-equity-cash' && position === 'before') return <CashFlowWaterfall />;
  if (sectionId === 'how-a-toll-road-turns-traffic-into-equity-cash' && position === 'after') return <DfwOperatingSnapshot />;
  if (sectionId === 'sh-130-the-danger-of-believing-the-traffic-model' && position === 'before') return <Sh130RestructuringDiagram />;
  if (sectionId === 'sh-288-the-value-of-a-termination-clause' && position === 'before') return <Sh288BuyoutDiagram />;
  if (sectionId === 'what-makes-a-texas-toll-road-valuable' && position === 'after') return <ModelScreeningSnapshot />;
  if (sectionId === 'can-an-investor-actually-buy-one' && position === 'after') return <InstrumentRoutes />;
  return null;
}

const EVIDENCE_SECTION_ID = 'the-evidence-layer-comes-before-the-codex-layer';

const HARNESS_SECTION_ID = 'what-i-mean-by-codex-as-a-harness';

function ArticleVisual({ placement }: { placement: 'hero' | 'inline' }) {
  const isHero = placement === 'hero';

  return (
    <figure className={`viralbench-page-visual viralbench-page-visual--${placement}`}>
      <img
        src={publicAsset(isHero ? VIRALBENCH_ARTICLE_IMAGE : VIRALBENCH_ARTICLE_INLINE_IMAGE)}
        width="1672"
        height="941"
        alt={isHero
          ? 'A dark gallery of suspended social-media posts receding toward a bright exit, with a dotted path curving through the space.'
          : 'An abstract monochrome room filled with speech bubbles connected by fine lines and flowing data-like strands.'}
        decoding="async"
        fetchPriority={isHero ? 'high' : 'auto'}
        loading={isHero ? 'eager' : 'lazy'}
      />
    </figure>
  );
}

function LoopRail() {
  return (
    <svg className="viralbench-node__loop" viewBox="0 0 320 300" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M160 12 C247 12 308 67 308 150 C308 233 247 288 160 288 C73 288 12 233 12 150 C12 93 40 48 85 26" fill="none" vectorEffect="non-scaling-stroke" />
      <path d="M69 27 L85 26 L80 41" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function ArchitectureDiagram() {
  return (
    <figure className="viralbench-architecture" aria-labelledby="viralbench-architecture-caption">
      <div className="viralbench-architecture__rail">
        <span>Live environment</span>
        <span>Independent controls</span>
        <span>Bounded engineering</span>
      </div>
      <div className="viralbench-architecture__nodes">
        <div className="viralbench-node viralbench-node--live">
          <LoopRail />
          <span className="viralbench-node__index">01 / inner loop</span>
          <strong>ViralBench agent</strong>
          <p>Research → create → preview → submit</p>
        </div>
        <span className="viralbench-architecture__arrow" aria-hidden="true">↓</span>
        <div className="viralbench-node viralbench-node--evidence">
          <span className="viralbench-node__index">02 / evidence spine</span>
          <strong>Immutable trace + evaluator</strong>
          <p>Sources, artifacts, configuration, checks, fixed-window outcomes</p>
        </div>
        <span className="viralbench-architecture__arrow" aria-hidden="true">↓</span>
        <div className="viralbench-node viralbench-node--codex">
          <LoopRail />
          <span className="viralbench-node__index">03 / outer loop</span>
          <strong>Codex worktree</strong>
          <p>Diagnose → patch → replay → draft canary → promote or revert</p>
        </div>
      </div>
      <figcaption id="viralbench-architecture-caption">
        ViralBench runs the live marketing-agent loop. Codex improves the system through isolated experiments, independent evaluation, and locked deployment gates.
      </figcaption>
    </figure>
  );
}

export function ArticleFigures({ slug, sectionId, position }: ArticleFiguresProps) {
  let figure = null
  if (slug === 'the-first-ai-managers' && position === 'after') {
    figure = sectionId === 'lede' ? <HallOfShameFigure /> : aiSectionFigure(sectionId)
  } else if (slug === 'who-owns-texas-toll-roads') {
    figure = tollSectionFigure({ sectionId, position })
  } else if (slug === 'viralbench-codex-agent-harness') {
    if (sectionId === EVIDENCE_SECTION_ID && position === 'before') figure = <ArticleVisual placement="inline" />
    if (sectionId === HARNESS_SECTION_ID && position === 'after') figure = <ArchitectureDiagram />
  }
  return figure ? <div className="article-original-figures" data-figure-section={sectionId}>{figure}</div> : null
}

/** Place only before the evidence section's Markdown; ArticleFigures already does this. */
export function OriginalArticleVisuals({ slug }: { slug: string }) {
  return <ArticleFigures slug={slug} sectionId={EVIDENCE_SECTION_ID} position="before" />
}
