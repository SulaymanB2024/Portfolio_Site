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

export const WORK_STUDIES_UPDATED = '2026-09-16';
export const WORK_STUDIES: WorkStudy[] = [...BASE_WORK_STUDIES, coalForecastingStudy];

export function workStudyPath(study: Pick<WorkStudy, 'slug'>) { return `/work/${study.slug}`; }
export function findWorkStudy(path: string) {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, '');
  return WORK_STUDIES.find(study => workStudyPath(study) === clean);
}
