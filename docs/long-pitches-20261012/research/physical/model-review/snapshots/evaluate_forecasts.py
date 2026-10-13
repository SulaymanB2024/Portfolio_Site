"""Evaluate frozen forecasts from verified future observations; no live-data watcher.

Usage: python evaluate_forecasts.py registry.json realized-observations.json
Realized observations require a common trading date and every registry symbol + SPY.
prices: {symbol: {close: number, shares_per_entry_share: number,
                  cash_distributions_per_entry_share?: number}}
The corporate-action factor converts horizon shares into one original entry share.
"""
import argparse
import json
import math
from datetime import date
from pathlib import Path
from statistics import mean, median


def evaluate(registry, observed):
    evaluated_on = date.fromisoformat(observed["trading_date"])
    required_on = date.fromisoformat(registry["evaluation_date"])
    if evaluated_on != required_on:
        raise ValueError("Use the frozen evaluation session; a later date changes the prediction horizon.")
    if not observed.get("corporate_actions_reconciled"):
        raise ValueError("Reconcile corporate actions before evaluation.")
    prices = observed["prices"]
    entries = registry["predictions"]
    symbols = [x["symbol"] for x in entries]
    if len(set(symbols)) != len(symbols):
        raise ValueError("Registry symbols must be unique.")
    required = set(symbols) | {registry["benchmark"]["symbol"]}
    if required - prices.keys():
        raise ValueError("Include every forecast and benchmark; do not drop failed companies.")

    def positive_number(value, label, allow_zero=False):
        if isinstance(value, bool):
            raise ValueError(f"{label} must be a number, not a boolean.")
        number = float(value)
        if not math.isfinite(number) or number < 0 or (number == 0 and not allow_zero):
            raise ValueError(f"{label} must be finite and {'nonnegative' if allow_zero else 'positive'}.")
        return number

    def equivalent(record):
        close = float(record["close"])
        factor = float(record["shares_per_entry_share"])
        if not math.isfinite(close) or close < 0 or not math.isfinite(factor) or factor <= 0:
            raise ValueError("Prices must be finite/nonnegative and corporate-action factors positive.")
        return close * factor

    benchmark_entry = positive_number(registry["benchmark"]["entry_close"], "Benchmark entry")
    benchmark_record = prices[registry["benchmark"]["symbol"]]
    benchmark_price_return = equivalent(benchmark_record) / benchmark_entry - 1
    complete_distributions = all(
        prices[s].get("cash_distributions_per_entry_share") is not None for s in required
    )
    rows = []
    for prediction in entries:
        symbol = prediction["symbol"]
        entry = positive_number(prediction["entry_close"], "Stock entry")
        central = positive_number(prediction["central_price_forecast"], "Central forecast", allow_zero=True)
        actual_equivalent = equivalent(prices[symbol])
        realized_price_return = actual_equivalent / entry - 1
        predicted_return = central / entry - 1
        row = {
            "symbol": symbol,
            "entry_close": entry,
            "central_price_forecast_original_share_basis": central,
            "realized_equivalent_price_original_share_basis": actual_equivalent,
            "forecast_price_return": predicted_return,
            "realized_price_return": realized_price_return,
            "excess_price_return_vs_spy": realized_price_return - benchmark_price_return,
            "absolute_price_error_as_fraction_of_entry": abs(actual_equivalent-central)/entry,
            "flat_price_baseline_absolute_error_as_fraction_of_entry": abs(actual_equivalent-entry)/entry,
            "long_direction_succeeded": realized_price_return > 0,
            "outperformed_spy_price": realized_price_return > benchmark_price_return,
        }
        if complete_distributions:
            dividend = positive_number(prices[symbol]["cash_distributions_per_entry_share"], "Stock distributions", allow_zero=True)
            benchmark_dividend = positive_number(benchmark_record["cash_distributions_per_entry_share"], "Benchmark distributions", allow_zero=True)
            row["realized_cash_return_without_reinvestment"] = (actual_equivalent+dividend)/entry-1
            row["excess_cash_return_vs_spy_without_reinvestment"] = (
                row["realized_cash_return_without_reinvestment"]
                - (equivalent(benchmark_record)+benchmark_dividend)/benchmark_entry+1
            )
        rows.append(row)
    errors = [r["absolute_price_error_as_fraction_of_entry"] for r in rows]
    return {
        "trading_date": str(evaluated_on),
        "registry_version": registry["version"],
        "benchmark_price_return": benchmark_price_return,
        "cash_distributions_complete": complete_distributions,
        "evaluation_note": "Price errors use original-entry-share equivalent prices. Cash return uses verified distributions without reinvestment only when all series are complete.",
        "summary": {
            "count": len(rows), "mean_absolute_price_error_as_fraction_of_entry": mean(errors),
            "median_absolute_price_error_as_fraction_of_entry": median(errors),
            "flat_price_baseline_mean_absolute_error_as_fraction_of_entry": mean(r["flat_price_baseline_absolute_error_as_fraction_of_entry"] for r in rows),
            "long_direction_success_count": sum(r["long_direction_succeeded"] for r in rows),
            "spy_outperformance_count": sum(r["outperformed_spy_price"] for r in rows),
        },
        "results": rows,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("registry", type=Path)
    parser.add_argument("observed", type=Path)
    args = parser.parse_args()
    print(json.dumps(evaluate(json.loads(args.registry.read_text()), json.loads(args.observed.read_text())), indent=2))
