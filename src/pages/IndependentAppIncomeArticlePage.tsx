import { RestoredArticleSummary } from '../components/RestoredArticleSummary';
import { ArticleReader, createArticleNavigation } from '../components/ArticleLayout';
import { restoredArticleConfig } from './restoredArticleConfig';
import { INDEPENDENT_APP_INCOME_ARTICLE } from '../content/restoredResearchArticles';
import '../styles/app-income-article.css';
import { useMemo, useState } from 'react';

import {
  APP_INCOME_ASSET_BASE,
  APP_INCOME_CASES,
  APP_INCOME_COPY,
  APP_INCOME_DENOMINATORS,
  APP_INCOME_DOWNLOADS,
  APP_INCOME_EVIDENCE_BRIDGE,
  APP_INCOME_FAQS,
  APP_INCOME_LEDE,
  APP_INCOME_LIMITATIONS,
  APP_INCOME_REVENUE_BANDS,
  APP_INCOME_SOURCES,
  type AppIncomeEvidenceKind,
} from '../content/independentAppIncomeArticle';
import {
  INDEPENDENT_APP_INCOME_ARTICLE_PATH,
} from '../content/independentAppIncomeArticleMeta';
import { getSeoRoute } from '../seo/routes';
import { useSEO } from '../utils/seo';

const ROUTE = getSeoRoute(INDEPENDENT_APP_INCOME_ARTICLE_PATH)!;

const headlineMetrics = [
  { value: '15.4%', label: 'serious developers', note: '$1k+ current gross / portfolio' },
  { value: '10.2%', label: 'serious apps', note: '$1k+ current gross / single app' },
  { value: '12.0%', label: 'three-month sustained', note: 'developer-level central estimate' },
  { value: '4.7%', label: 'replacement income', note: '$5k+ owner profit / developers' },
] as const;

const railSections = [
  ['denominator', 'Choose the denominator'],
  ['evidence-bridge', 'From observation to estimate'],
  ['distribution', 'The revenue distribution'],
  ['portfolio-effect', 'What portfolios change'],
  ['unit-economics', 'Gross, proceeds, and profit'],
  ['selected-cases', 'Selected public cases'],
  ['limits', 'What remains unknown'],
  ['research-library', 'Research library'],
] as const;

const profitScenarios = [
  { label: 'Lean software', gross: '$1,438', note: '15% fee, low fixed and variable costs' },
  { label: 'API-heavy', gross: '$2,143', note: 'More variable serving cost per customer' },
  { label: 'Paid acquisition', gross: '$2,727', note: 'Material monthly acquisition spend' },
  { label: 'High fee + high UA', gross: '$3,750', note: 'Wider fee and acquisition burden' },
] as const;

function EvidenceBadge({ kind }: { kind: AppIncomeEvidenceKind }) {
  return <span className="app-income-evidence-badge" data-kind={kind}>{kind}</span>;
}

function CopyBlock({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div className="toll-article-prose">
      {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 84)}>{paragraph}</p>)}
    </div>
  );
}

function ResearchFigure({
  number,
  title,
  file,
  alt,
  caption,
}: {
  number: string;
  title: string;
  file: string;
  alt: string;
  caption: string;
}) {
  return (
    <figure className="app-income-figure">
      <div className="toll-figure-label">
        <span>Figure {number}</span>
        <span>{title}</span>
      </div>
      <div className="app-income-figure__image">
        <img src={`${APP_INCOME_ASSET_BASE}/charts/${file}`} alt={alt} loading="lazy" decoding="async" />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function DenominatorExplorer() {
  const [unit, setUnit] = useState<'Developers' | 'Apps'>('Developers');
  const [horizon, setHorizon] = useState<'Current month' | 'Three-month sustained'>('Current month');
  const [population, setPopulation] = useState<'Serious attempts' | 'All listed'>('Serious attempts');

  const choosePopulation = (next: 'Serious attempts' | 'All listed') => {
    setPopulation(next);
    if (next === 'All listed') setHorizon('Current month');
  };

  const selected = APP_INCOME_DENOMINATORS.find((row) => (
    row.unit === unit && row.horizon === horizon && row.population === population
  )) ?? APP_INCOME_DENOMINATORS[0];
  const scaleMax = 30;

  return (
    <div className="app-income-explorer" aria-labelledby="denominator-explorer-title">
      <div className="app-income-explorer__heading">
        <div>
          <EvidenceBadge kind="Modeled estimate" />
          <h3 id="denominator-explorer-title">Change the question. Watch the answer move.</h3>
        </div>
        <p>All percentages are modeled shares at or above $1,000 in gross monthly app revenue.</p>
      </div>

      <div className="app-income-control-grid">
        <fieldset>
          <legend>Unit</legend>
          <div>
            {(['Developers', 'Apps'] as const).map((option) => (
              <button key={option} type="button" aria-pressed={unit === option} onClick={() => setUnit(option)}>{option}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Population</legend>
          <div>
            {(['Serious attempts', 'All listed'] as const).map((option) => (
              <button key={option} type="button" aria-pressed={population === option} onClick={() => choosePopulation(option)}>{option}</button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend>Horizon</legend>
          <div>
            {(['Current month', 'Three-month sustained'] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={horizon === option}
                disabled={population === 'All listed' && option === 'Three-month sustained'}
                onClick={() => setHorizon(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <output className="app-income-range" aria-live="polite">
        <div className="app-income-range__summary">
          <div>
            <span>{selected.population} / {selected.unit.toLowerCase()} / {selected.horizon.toLowerCase()}</span>
            <strong>{selected.central.toFixed(1)}%</strong>
          </div>
          <p>{selected.note}</p>
        </div>
        <div className="app-income-range__plot" aria-label={`${selected.lower.toFixed(1)} to ${selected.upper.toFixed(1)} percent, central estimate ${selected.central.toFixed(1)} percent`}>
          <div className="app-income-range__axis"><span>0%</span><span>15%</span><span>30%</span></div>
          <div className="app-income-range__track">
            <span className="app-income-range__interval" style={{ left: `${(selected.lower / scaleMax) * 100}%`, width: `${((selected.upper - selected.lower) / scaleMax) * 100}%` }} />
            <span className="app-income-range__central" style={{ left: `${(selected.central / scaleMax) * 100}%` }} />
          </div>
          <div className="app-income-range__labels">
            <span>{selected.lower.toFixed(1)}% lower</span>
            <span>{selected.central.toFixed(1)}% central</span>
            <span>{selected.upper.toFixed(1)}% upper</span>
          </div>
        </div>
      </output>
    </div>
  );
}

function EvidenceBridge() {
  return (
    <div className="app-income-bridge" aria-label="Evidence bridge from the observed cohort to the developer estimate">
      {APP_INCOME_EVIDENCE_BRIDGE.map((step, index) => (
        <div className="app-income-bridge__step" key={step.label}>
          <span className="app-income-bridge__index">{String(index + 1).padStart(2, '0')}</span>
          <EvidenceBadge kind={step.kind} />
          <strong>{step.value}</strong>
          <h3>{step.label}</h3>
          <p>{step.detail}</p>
        </div>
      ))}
    </div>
  );
}

function RevenueBands() {
  return (
    <div className="app-income-bands" aria-label="Modeled current monthly gross revenue bands for serious apps">
      {APP_INCOME_REVENUE_BANDS.map((band) => (
        <div key={band.label}>
          <div>
            <strong>{band.label}</strong>
            <span>{band.detail}</span>
          </div>
          <div className="app-income-bands__bar"><span style={{ width: `${Math.max(band.share * 2.2, 1.4)}%` }} /></div>
          <em>{band.share.toFixed(band.share % 1 === 0 ? 0 : 2)}%</em>
        </div>
      ))}
    </div>
  );
}

function UnitEconomicsCalculator() {
  const [priceInput, setPriceInput] = useState('9.99');
  const [basis, setBasis] = useState<'gross' | 'proceeds' | 'profit'>('profit');
  const price = Math.max(Number(priceInput) || 0, 0.01);
  const result = useMemo(() => {
    if (basis === 'gross') return Math.ceil(1000 / price);
    if (basis === 'proceeds') return Math.ceil(1000 / (price * 0.85));
    return Math.ceil((1000 + 150) / Math.max((price * 0.85) - 0.25, 0.01));
  }, [basis, price]);
  const descriptions = {
    gross: 'before store or payment fees and operating costs',
    proceeds: 'after a modeled 15% platform or payment fee',
    profit: 'after a 15% fee, $150 fixed cost, and $0.25 per active subscriber',
  } as const;

  return (
    <div className="app-income-calculator">
      <div className="app-income-calculator__controls">
        <label>
          Monthly price
          <span><span aria-hidden="true">$</span><input type="number" min="0.99" step="1" inputMode="decimal" value={priceInput} onChange={(event) => setPriceInput(event.target.value)} /></span>
        </label>
        <fieldset>
          <legend>Target basis</legend>
          <div>
            {(['gross', 'proceeds', 'profit'] as const).map((option) => (
              <button key={option} type="button" aria-pressed={basis === option} onClick={() => setBasis(option)}>{option}</button>
            ))}
          </div>
        </fieldset>
      </div>
      <output aria-live="polite" className="app-income-calculator__result">
        <span>Active subscribers required</span>
        <strong>{result.toLocaleString('en-US')}</strong>
        <p>to produce $1,000 of monthly {basis}, {descriptions[basis]}.</p>
      </output>
      <p className="app-income-calculator__note">Scenario calculator only. Refunds, tax, annual-plan timing, trials, churn, regional pricing, founder labor, and personal tax are excluded.</p>
    </div>
  );
}

function CaseExplorer() {
  const [filter, setFilter] = useState<'all' | 'above' | 'below'>('all');
  const cases = APP_INCOME_CASES.filter((item) => filter === 'all' || item.threshold === filter);

  return (
    <div className="app-income-case-explorer">
      <div className="app-income-case-explorer__controls" aria-label="Filter selected app cases">
        {([
          ['all', 'All selected'],
          ['above', '$1k and above'],
          ['below', 'Below $1k'],
        ] as const).map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>
        ))}
      </div>
      <div className="app-income-case-table" role="region" aria-live="polite" aria-label={`${cases.length} selected public cases`} tabIndex={0}>
        <table>
          <thead>
            <tr><th>Product</th><th>MRR</th><th>Unit / category</th><th>What the case shows</th><th>Evidence</th></tr>
          </thead>
          <tbody>
            {cases.map((item) => (
              <tr key={item.name}>
                <th scope="row">{item.name}</th>
                <td data-threshold={item.threshold}>{item.displayMrr}</td>
                <td><strong>{item.unit}</strong><span>{item.category}</span></td>
                <td>{item.context}</td>
                <td><a href={`#source-${item.sourceId}`}>{item.sourceId}</a><span>{item.verification}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="app-income-case-explorer__boundary"><EvidenceBadge kind="Interpretation" /> Selection makes these cases useful for mechanism, not prevalence. Filtering the visible ledger does not recalculate the model.</p>
    </div>
  );
}

function DownloadLibrary() {
  return (
    <div className="app-income-downloads">
      {APP_INCOME_DOWNLOADS.map((asset, index) => (
        <a key={asset.href} href={asset.href} download>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <div>
            <small>{asset.format}</small>
            <strong>{asset.label}</strong>
            <p>{asset.note}</p>
          </div>
          <em aria-hidden="true">↓</em>
        </a>
      ))}
    </div>
  );
}

function FrequentlyAskedQuestions() {
  return (
    <section id="frequently-asked-questions" className="toll-article-section scroll-mt-28">
      <header><span>FAQ</span><h2>Independent app income, answered directly</h2></header>
      <div className="toll-faq-list">
        {APP_INCOME_FAQS.map((faq, index) => (
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
      <p className="toll-section-intro">Official store records, regulatory evidence, transaction cohorts, academic studies, fee rules, and selected verified dashboards. Every source keeps its class and limitation.</p>
      <ol>
        {APP_INCOME_SOURCES.map((source) => (
          <li key={source.id} id={`source-${source.id}`}>
            <span className="toll-source-ledger__id">{source.id}</span>
            <div>
              <strong>{source.label}</strong>
              <span className="app-income-source-meta">{source.publisher} · {source.evidenceClass}</span>
              <p>{source.note}</p>
              <div className="toll-source-ledger__links">
                <a href={source.href} target="_blank" rel="noreferrer">Open source</a>
                {source.lastVerified ? <span>Verified {source.lastVerified}</span> : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function IndependentAppIncomeArticlePage() {
  useSEO(ROUTE);
  const navigation = createArticleNavigation([
    { kind: 'overview', id: 'overview', label: 'Overview' },
    ...railSections.map(([id, label]) => ({ kind: 'section' as const, id, label })),
    { kind: 'faq', id: 'frequently-asked-questions', label: 'Direct answers' },
    { kind: 'source', id: 'source-ledger', label: 'Sources' },
  ]);
  const config = restoredArticleConfig(
    INDEPENDENT_APP_INCOME_ARTICLE, 'app-income-article', navigation,
    'Research cutoff: July 14, 2026. Modeled ranges, not a census; cases are selected illustrations.',
    headlineMetrics,
  );
  return (
    <ArticleReader config={config}>
      <section id="overview" className="toll-article-lede"><RestoredArticleSummary path={INDEPENDENT_APP_INCOME_ARTICLE_PATH} /><CopyBlock paragraphs={APP_INCOME_LEDE} /></section>

            <section id="denominator" className="toll-article-section scroll-mt-28">
              <header><span>01</span><h2>The denominator is the result</h2></header>
              <CopyBlock paragraphs={APP_INCOME_COPY.denominator} />
              <DenominatorExplorer />
              <ResearchFigure number="01" title="The denominator ladder" file="denominator_ladder.png" alt="Range chart comparing the share of apps and developers above one thousand dollars per month across serious, maintained, and all-listed populations." caption="The central answer changes by more than an order of magnitude between serious commercial attempts and every listed app. Bars show modeled uncertainty ranges, not sampling confidence intervals." />
            </section>

            <section id="evidence-bridge" className="toll-article-section scroll-mt-28">
              <header><span>02</span><h2>From an observed milestone to a current-state estimate</h2></header>
              <CopyBlock paragraphs={APP_INCOME_COPY.evidence} />
              <EvidenceBridge />
              <ResearchFigure number="02" title="Threshold survival" file="threshold_survival.png" alt="Chart comparing ever-hit, current-month, three-month sustained, and six-month sustained shares at one thousand and ten thousand dollars." caption="Touching a threshold is easier than staying above it. The observed launch-cohort statistic anchors the left edge; persistence beyond that point is modeled." />
            </section>

            <section id="distribution" className="toll-article-section scroll-mt-28">
              <header><span>03</span><h2>Most serious apps still live below $1,000</h2></header>
              <CopyBlock paragraphs={APP_INCOME_COPY.distribution} />
              <div className="app-income-inline-label"><EvidenceBadge kind="Modeled estimate" /><span>Serious independent apps / current gross monthly revenue</span></div>
              <RevenueBands />
              <ResearchFigure number="03" title="Modeled revenue bands" file="revenue_bands.png" alt="Horizontal bar chart of modeled monthly revenue bands for serious independent apps, from zero dollars through one hundred thousand dollars and above." caption="The visual makes the skew explicit: the mass of products sits at zero or below $1,000 while a small upper tail carries disproportionate revenue." />
            </section>

            <section id="portfolio-effect" className="toll-article-section scroll-mt-28">
              <header><span>04</span><h2>A developer can win without one breakout app</h2></header>
              <CopyBlock paragraphs={APP_INCOME_COPY.portfolio} />
              <div className="app-income-portfolio-grid">
                <article><span>Modeled mean</span><strong>1.83</strong><p>serious apps per independent developer</p></article>
                <article><span>Aggregate path</span><strong>17–25%</strong><p>of successful developers cross $1k only by summing sub-threshold apps</p></article>
                <article><span>Concentration</span><strong>55–75%</strong><p>receive at least 70% of portfolio revenue from the top app</p></article>
              </div>
            </section>

            <section id="unit-economics" className="toll-article-section scroll-mt-28">
              <header><span>05</span><h2>$1,000 of what?</h2></header>
              <CopyBlock paragraphs={APP_INCOME_COPY.economics} />
              <UnitEconomicsCalculator />
              <ResearchFigure number="04" title="Subscriber requirements" file="subscriber_requirements.png" alt="Bar chart showing active subscriber requirements at multiple monthly prices for one thousand dollars of gross revenue, proceeds, or lean owner profit." caption="Price changes the customer count, while fees and costs change the economic meaning of the same headline threshold." />
              <div className="app-income-profit-scenarios">
                {profitScenarios.map((scenario) => <article key={scenario.label}><span>{scenario.label}</span><strong>{scenario.gross}</strong><p>gross required for $1k owner profit</p><small>{scenario.note}</small></article>)}
              </div>
              <ResearchFigure number="05" title="Gross required for owner profit" file="gross_to_profit.png" alt="Bar chart comparing gross monthly revenue required to leave one thousand dollars of owner profit across lean, API-heavy, paid-acquisition, and high-fee scenarios." caption="Revenue screenshots do not show the cost stack. The model excludes founder labor and personal tax, so economic profit would require a still higher threshold." />
            </section>

            <section id="selected-cases" className="toll-article-section scroll-mt-28">
              <header><span>06</span><h2>Cases show mechanisms, not odds</h2></header>
              <CopyBlock paragraphs={APP_INCOME_COPY.cases} />
              <CaseExplorer />
              <ResearchFigure number="06" title="Selected public cases" file="case_scatter.png" alt="Log-scale scatter plot of selected public app and developer portfolio cases by current monthly recurring revenue." caption="The sample deliberately spans zero, low, threshold, and upper-tail outcomes. Its selection process prevents any frequency inference." />
            </section>

            <section id="limits" className="toll-article-section scroll-mt-28">
              <header><span>07</span><h2>What remains unknown</h2></header>
              <CopyBlock paragraphs={APP_INCOME_COPY.limitations} />
              <div className="toll-gap-grid app-income-gap-grid">
                <article>
                  <h3>Measurement gaps</h3>
                  <ul>{APP_INCOME_LIMITATIONS.slice(0, 3).map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
                <article>
                  <h3>Transfer limits</h3>
                  <ul>{APP_INCOME_LIMITATIONS.slice(3).map((item) => <li key={item}>{item}</li>)}</ul>
                </article>
              </div>
              <div className="app-income-desired-dataset">
                <span>The dataset that would replace the model</span>
                <p>Stable app and store IDs, resolved independent owners, monetization type, trailing monthly gross revenue, developer proceeds, operating costs, and at least six months of history—with inactive and zero-revenue apps retained.</p>
              </div>
            </section>

            <section id="research-library" className="toll-article-section scroll-mt-28">
              <header><span>08</span><h2>Open the model, not just the conclusion</h2></header>
              <CopyBlock paragraphs={APP_INCOME_COPY.methodology} />
              <DownloadLibrary />
              <figure className="app-income-workbook-preview">
                <img src={`${APP_INCOME_ASSET_BASE}/workbook_executive_preview.png`} alt="Preview of the workbook executive estimates sheet showing headline app and developer income ranges." loading="lazy" decoding="async" />
                <figcaption>Workbook executive sheet. The downloadable model contains 17 sheets and no hidden prevalence claims from the selected case ledger.</figcaption>
              </figure>
            </section>

            <FrequentlyAskedQuestions />
            <SourceLedger />
    </ArticleReader>
  );
}
