# Four public-equity long pitches

Written October 13, 2026. Information and entry-price cutoff: October 12, 2026. Horizon: October 12, 2028. Currency USD; financial inputs in millions and shares in millions. This bundle supports Adobe, PayPal, Crocs and Expedia. Forecasts are author judgments; future predictive accuracy is unobserved.

`inputs.json` separates source financials from forward assumptions. `source-register.json` provides exact primary links and dates. `prices-20261012.json` preserves actual connected Alpaca SIP bars and request parameters. `forecast-registry.json` freezes the central price forecasts and operating tests. `models.py` produces cash budgets, affordable net share reduction, scenarios, a coupled reverse hurdle and valuation sensitivities. No gross buyback yield is added to per-share returns.

Run the standard-library calculations with Python 3.10 or newer:

```sh
python models.py
```

For plots/notebook reproduction, install the pinned packages in a virtual environment, register its Python kernel, and rerun `worked-model.ipynb`. `figures.py` exports matching PNG and SVG figures. The notebook reads the supplied source inputs under `research/`; no credentials, live API or absolute workstation paths are needed. Models do not fetch fresh facts during reproduction. Optional `build_inputs.py` recreates the original bindings from the included structured research files; reconcile prose before changing canonical assumptions.

The four completed Markdown reports under `articles/` include tables, figures and source links. `scenario-prices.csv` exposes unrounded scenarios. `METHODOLOGY.md` defines cash treatments and the forecast evaluation basis. Values near a source share date use its disclosed denominator, not an exact October capitalization.

To evaluate later, supply verified realized observations to `evaluate_forecasts.py` along with the original registry. The observation schema is documented at the top of that script. Use the frozen October 12, 2028 session, reconcile corporate actions and retain all four companies, including a failed/delisted one. Complete cash distributions permit a separate comparison without reinvestment. If the exchange unexpectedly closes, record a separately versioned calendar exception before scoring; do not quietly change the horizon. Do not treat scenario ranges as probabilities or confidence intervals.

Changing a forecast later must create a new dated version. Keep this original registry and its input/output hashes so realized results can be assessed without hindsight. No watcher, trade or portfolio allocation is part of this model.
