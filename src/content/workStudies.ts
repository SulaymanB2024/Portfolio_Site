import { WORK_STUDIES as BASE_WORK_STUDIES, type WorkStudy } from './workStudiesBase';

export type { WorkStudy } from './workStudiesBase';

const coalForecastingStudy: WorkStudy = {
  slug: 'coal-price-forecasting-framework', legacyId: 'coal-price-forecasting-framework', number: 'XI',
  name: 'Newcastle Coal Price Forecasting', discipline: 'Energy Markets / Quant Research', status: 'Public research model', period: 'April 2025 · historical project',
  headline: ['Forecast the price.', 'Test the decision.'],
  description: 'A historical Newcastle coal forecasting framework linking fundamental data, VIF-controlled features, SARIMAX modeling, diagnostics, and economic-value tests.',
  role: 'Research model builder', medium: 'Python · SARIMAX · VIF · Strategy testing',
  premise: 'A commodity forecast is more useful when the model, feature choices, diagnostics, and decision rule can all be inspected separately.',
  chapters: [
    { title: 'Model the market drivers with the series.', paragraphs: [
      'The public project targets Newcastle FOB 6000kc NAR coal and was built around one-to-three-month forecasting for trading and risk-management research. Instead of treating the price series as the only input, the repository combines a staged data pipeline with exogenous features and time-series models so the forecast can be tied back to observable market drivers.',
      'The retained SARIMAX implementation handles missing and non-finite values, checks stationarity with ADF and KPSS tests, selects statistically significant exogenous features with OLS, and searches candidate seasonal and non-seasonal orders using AIC. That makes model specification an inspectable procedure rather than a single hard-coded equation.'
    ] },
    { title: 'Reduce redundant signals before trusting coefficients.', paragraphs: [
      'Commodity fundamentals often move together. A model can appear richly specified while several inputs are expressing the same underlying relationship. The project includes dedicated multicollinearity diagnostics that calculate variance inflation factors and iteratively remove the highest-VIF feature until the retained set clears the configured threshold or becomes too small to continue.',
      'That feature-control step sits beside broader diagnostics rather than replacing them. The repository separates model fitting, multicollinearity checks, residual diagnostics, time-series alternatives, and an ML ensemble module. The point is not that one model class must win; it is that each layer can be examined before a forecast is treated as useful evidence.'
    ] },
    { title: 'Ask whether a forecast changes a decision.', paragraphs: [
      'The project also separates statistical forecasting from economic-value testing. Its trading-strategy module can translate forecast-versus-price differences into directional or threshold signals, lag positions to avoid straightforward look-ahead bias, apply transaction-cost and slippage assumptions, and compute return, volatility, Sharpe, Sortino, drawdown, win-rate, and trade statistics.',
      'Those calculations are research infrastructure, not evidence of realized trading performance. The useful proof of work is the full chain: market data, feature screening, time-series specification, diagnostics, a decision rule, and an explicit cost-aware evaluation layer. A current coal view would require refreshed data, assumptions, and a fresh model run.'
    ] }
  ],
  decisions: [
    { choice: 'Exogenous drivers plus time-series structure', reason: 'SARIMAX can test whether market variables add information beyond the price history while preserving autoregressive and seasonal structure.' },
    { choice: 'VIF as a feature-control gate', reason: 'Highly collinear inputs are removed iteratively so a larger feature set is not mistaken for a more informative model.' },
    { choice: 'Specification by diagnostics, not one preset', reason: 'Stationarity tests, significance screening, AIC search, and residual checks keep model choices inspectable.' },
    { choice: 'Economic value is a separate test', reason: 'Forecast errors and trading usefulness answer different questions, so the repository evaluates a cost-aware decision rule instead of treating fit statistics as a trading result.' }
  ],
  result: 'A public quantitative-research codebase with staged data processing, VIF-based feature refinement, SARIMAX order selection, model diagnostics, strategy evaluation, and an interactive dashboard.',
  scope: 'This is a historical April 2025 research project, not a current Newcastle coal forecast, live trading system, or investment recommendation. The page describes code and research structure visible in the public repository. It does not claim forecast accuracy, realized P&L, production deployment, audited validation, or that retained historical outputs remain decision-ready today.',
  links: [
    { label: 'Inspect the public research repository', href: 'https://github.com/SulaymanB2024/UTexas_Coal', note: 'Public Python project with notebooks, modeling modules, reports, configuration, and dashboard code.' },
    { label: 'Inspect the SARIMAX implementation', href: 'https://github.com/SulaymanB2024/UTexas_Coal/blob/main/src/modeling/sarimax_model.py', note: 'Stationarity checks, feature selection, AIC order search, preprocessing, and model fitting.' }
  ],
  related: ['sezzle-fundamental-model', 'no-limit-artemis'], visual: 'thesis',
  visualLabel: 'A forecast is not yet a trade', visualCaption: 'Conceptual research plate. The page explains a historical forecasting system and does not display a current coal-price target.',
  observations: [
    { label: 'Drivers', text: 'Combine the price series with inspectable exogenous inputs instead of assuming history alone contains the full signal.' },
    { label: 'Diagnostics', text: 'Control collinearity, test stationarity, compare specifications, and keep model diagnostics distinct from the forecast narrative.' },
    { label: 'Decision', text: 'Evaluate a lagged, cost-aware rule separately from forecast fit; a backtest is not realized trading performance.' }
  ]
};

const raceCaseStudy: WorkStudy & { updated: string } = {
  slug: 'race-the-case-decision-model', legacyId: 'race-the-case-decision-model', number: 'XII',
  name: 'Race-the-Case Decision Model', discipline: 'Strategy / Capital Allocation', status: 'Historical competition model', period: 'April 2025 · historical project', updated: '2026-09-20',
  headline: ['Turn choices', 'into constraints.'],
  description: 'A historical Python competition model that turns strategic projects into explicit cost, timing, dependency, and capital-allocation decisions.',
  role: 'Model builder', medium: 'Python · Scenario analysis · Capital allocation',
  premise: 'A strategy recommendation becomes easier to inspect when each project has explicit costs, timing, dependencies, and a rule for what can fit inside the constraint set.',
  chapters: [
    { title: 'Make the project choices explicit.', paragraphs: [
      'The public Race-the-Case archive models a fictional Beauty First Cosmetics scenario. Its Project structure records potential value, effort, time to implement, cost, dependencies, strategic priority, and risk. A viability pass can then remove projects that exceed configured time, cost, or effort limits before the framework compares what remains.',
      'That changes the form of the recommendation. Instead of leaving candidate initiatives only in prose, the model turns them into inspectable assumptions that can be tested against the same constraint rules. The thresholds are scenario inputs, not facts about a real company, and their usefulness depends on the quality of the case data behind them.'
    ] },
    { title: 'Compare portfolios, not isolated ideas.', paragraphs: [
      'The decision framework applies a deliberately simplified ROI score, then enumerates project combinations that fit inside a capital constraint. It also records project dependencies and simulates different ordering rules, including highest heuristic ROI first, lowest cost first, and quickest wins, subject to remaining capital and a time horizon.',
      'The score is a decision aid rather than a valuation model. It gives potential-value bullets a fixed weight and subtracts penalties for effort, time, and cost. That makes the rule easy to inspect, but it also means the output should be read as a structured competition heuristic rather than an empirical estimate of return.'
    ] },
    { title: 'Keep scenario forecasts separate from observed results.', paragraphs: [
      'A second part of the repository generates one-, five-, and ten-year forward 10-K-style reports from configured growth assumptions and a retained baseline. The reports include strategic recommendations, risk sections, and summarized financial projections for the fictional case company.',
      'Those outputs are explicitly hypothetical. They are useful as a way to connect a strategic recommendation to a financial scenario, but they are not audited statements, forecasts of an actual company, or evidence that the recommended projects produced the projected results. The durable proof of work is the modeling structure and the boundaries around its assumptions.'
    ] }
  ],
  decisions: [
    { choice: 'Filter before ranking', reason: 'Remove options that violate explicit time, cost, or effort constraints before comparing relative attractiveness.' },
    { choice: 'Model project combinations', reason: 'Capital allocation is a portfolio problem; combinations and dependencies matter more than a standalone score.' },
    { choice: 'Keep the ROI rule inspectable', reason: 'The repository exposes a simple scoring heuristic rather than presenting it as a finance-grade return estimate.' },
    { choice: 'Label forward reports as scenarios', reason: 'Hypothetical case assumptions should not be confused with audited reporting, realized results, or a real-company forecast.' }
  ],
  result: 'A public Python competition archive with project viability filtering, heuristic ROI scoring, capital-constrained portfolio analysis, dependency mapping, branching-path simulations, and hypothetical forward financial reports.',
  scope: 'This is a historical April 2025 competition project built around a fictional Beauty First Cosmetics case. The linked public repository is the source record for this page. The simplified ROI score and forward 10-K-style outputs are scenario mechanics, not audited financial reporting, realized project returns, a current company forecast, or investment advice. No competition placement is claimed on this page.',
  links: [
    { label: 'Inspect the public project', href: 'https://github.com/SulaymanB2024/5-Race-the-Case-Competition', note: 'Public Python archive with the decision framework, report generator, assumptions, and strategic summary.' },
    { label: 'Inspect the decision framework', href: 'https://github.com/SulaymanB2024/5-Race-the-Case-Competition/blob/main/decision_framework.py', note: 'Project constraints, viability filters, heuristic scoring, combinations, dependencies, and branching-path simulation.' }
  ],
  related: ['sezzle-fundamental-model', 'coal-price-forecasting-framework'], visual: 'discovery',
  visualLabel: 'A portfolio of choices, not one score', visualCaption: 'Conceptual decision grid. It illustrates project-selection logic rather than a live company portfolio or an observed financial result.',
  observations: [
    { label: 'Filter', text: 'Reject projects that breach the scenario’s explicit time, cost, or effort limits before ranking anything.' },
    { label: 'Combine', text: 'Test which project sets fit the capital constraint and preserve dependencies instead of treating every initiative in isolation.' },
    { label: 'Scenario', text: 'Use forward financial reports to examine assumptions, not to imply audited statements, realized returns, or a real-company forecast.' }
  ]
};

export const WORK_STUDIES_UPDATED = '2026-09-16';
export const WORK_STUDIES: WorkStudy[] = [...BASE_WORK_STUDIES, coalForecastingStudy, raceCaseStudy];

export function workStudyUpdatedDate(study: WorkStudy) {
  return (study as WorkStudy & { updated?: string }).updated ?? WORK_STUDIES_UPDATED;
}
export const WORK_STUDIES_LATEST_UPDATED = WORK_STUDIES.reduce((latest, study) => {
  const updated = workStudyUpdatedDate(study);
  return updated > latest ? updated : latest;
}, WORK_STUDIES_UPDATED);

export function workStudyPath(study: Pick<WorkStudy, 'slug'>) { return `/work/${study.slug}`; }
export function findWorkStudy(path: string) {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, '');
  return WORK_STUDIES.find(study => workStudyPath(study) === clean);
}
