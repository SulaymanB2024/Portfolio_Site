#!/usr/bin/env python3
"""Reproduce historical UNI scenarios; no network calls or current balance claims.

Requires Python 3.10+ and matplotlib==3.10.7.
Run: python uni-burn-reproduction.py --output-root ./reproduced
Numbers are reported August 2026 draft inputs, not reclassified transfer logs.
"""
import argparse
import csv
import json
from datetime import datetime
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

INPUTS = dict(contract_supply=1_000_000_000, recognized_burn_balance=108_025_224,
              treasury_transfer=100_000_000, annual_growth_budget=20_000_000,
              reported_recent_burn=3_928_000, recent_window_days=90,
              transfer_utc='2025-12-27T20:33:11+00:00', snapshot_utc='2026-08-05T18:15:00+00:00',
              provenance='Reported historical inputs retained in the August draft. Original tracker response and classified 90-day export not preserved.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-root', type=Path, default=Path('reproduced'))
    root = parser.parse_args().output_root
    data_dir = root/'research'; art_dir = root/'images/research'
    data_dir.mkdir(parents=True, exist_ok=True); art_dir.mkdir(parents=True, exist_ok=True)
    elapsed = (datetime.fromisoformat(INPUTS['snapshot_utc'])-datetime.fromisoformat(INPUTS['transfer_utc'])).total_seconds()/86400
    residual = INPUTS['recognized_burn_balance']-INPUTS['treasury_transfer']
    low = residual/elapsed*365
    high = INPUTS['reported_recent_burn']/INPUTS['recent_window_days']*365
    budget = INPUTS['annual_growth_budget']
    result = dict(inputs=INPUTS, elapsed_days=elapsed, recurring_and_other_residual=residual,
                  dead_address_adjusted_quantity=INPUTS['contract_supply']-INPUTS['recognized_burn_balance'],
                  annualized_low=low, annualized_high=high, break_even_low=low/budget, break_even_high=high/budget,
                  new_mint_assumption=0, interpretation='Conditional token-flow model; not measured exchange demand or circulating supply.')
    assert residual == 8025224 and result['dead_address_adjusted_quantity'] == 891974776
    assert 13.26e6 < low < 13.261e6 and 15.930e6 < high < 15.931e6
    (data_dir/'uni-burn-calculations.json').write_text(json.dumps(result, indent=2)+'\n')
    rows = [dict(sell_through=s, annual_budget_uni=budget, new_mint_uni=0,
                 low_burn_uni=low, high_burn_uni=high,
                 low_net_absorption_uni=low-budget*s, high_net_absorption_uni=high-budget*s)
            for s in [0, .25, .5, low/budget, .75, high/budget, 1]]
    with (data_dir/'uni-burn-supply-scenarios.csv').open('w', newline='') as f:
        w=csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)

    plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 12, 'svg.fonttype': 'none',
                         'svg.hashsalt': 'uni-burn-2026-08', 'axes.spines.top': False,
                         'axes.spines.right': False, 'figure.facecolor': '#f7f4ed', 'axes.facecolor': '#f7f4ed'})

    def bar_chart(filename, title, labels, values, note):
        fig, ax = plt.subplots(figsize=(12, 6.75))
        ax.barh(range(len(values)), values, height=.48, color=['#176b78', '#b25230', '#293447'][:len(values)])
        ax.set(yticks=range(len(labels)), yticklabels=labels, xlabel='Million UNI', xlim=(0, max(values)*1.22))
        ax.invert_yaxis(); ax.grid(axis='x', alpha=.15); ax.set_axisbelow(True)
        for i, value in enumerate(values): ax.text(value+max(values)*.02, i, f'{value:.2f}M', va='center')
        fig.suptitle(title, x=.045, ha='left', fontsize=18, fontweight='bold')
        fig.text(.045, .035, note, fontsize=10)
        fig.subplots_adjust(left=.30, right=.97, top=.82, bottom=.23)
        fig.savefig(art_dir/filename, metadata={'Date': None}); plt.close(fig)

    bar_chart('uni-burn-composition.svg', 'One treasury transfer dominates the reported balance',
              ['One-time treasury transfer', 'Recurring + other residual'], [100, residual/1e6],
              'Reported August 5, 2026 tracker balance: 108.025M UNI.\nTreasury transfer: 92.57%; residual: 7.43%. The residual is not a classified fee-burn total.')
    bar_chart('uni-burn-budget-comparison.svg', 'Annualized proxies and the treasury distribution schedule',
              ['Cumulative residual proxy', 'Reported 90-day proxy', 'Annual growth budget'], [low/1e6, high/1e6, budget/1e6],
              'August 2026 reported inputs · Burn rates are annualizations, not forecasts.\nThe 20M budget distributes existing treasury UNI; actual market sales are not established.')
    fig, ax = plt.subplots(figsize=(12, 7.2))
    xs = list(range(101)); low_y = [(low-budget*s/100)/1e6 for s in xs]; high_y = [(high-budget*s/100)/1e6 for s in xs]
    ax.fill_between(xs, low_y, high_y, color='#176b78', alpha=.12)
    ax.plot(xs, low_y, color='#b25230', linewidth=2.5, label='13.26M annualized proxy')
    ax.plot(xs, high_y, color='#176b78', linewidth=2.5, label='15.93M annualized proxy')
    ax.axhline(0, color='#293447', linewidth=1)
    for rate, color, y in [(low, '#b25230', -4.8), (high, '#176b78', -2.8)]:
        threshold=rate/budget*100
        ax.scatter([threshold], [0], color=color, zorder=3)
        ax.annotate(f'{threshold:.1f}%', xy=(threshold, 0), xytext=(threshold-7, y), color=color,
                    arrowprops=dict(arrowstyle='-', color=color))
    ax.set(xlim=(0, 100), ylim=(-8, 18), xlabel='Assumed share of 20M annual growth budget reaching market (%)',
           ylabel='Modeled net absorption (million UNI / year)')
    ax.grid(alpha=.15); ax.legend(loc='upper right', frameon=False, fontsize=11)
    fig.suptitle('The sign changes with assumed sell-through', x=.09, ha='left', fontsize=19, fontweight='bold')
    fig.text(.09, .03, 'B − 20M × sell-through; new mint assumption = 0. Historical August inputs.\nPositive = conditional removal; negative = conditional release. Not measured net exchange buying.', fontsize=10)
    fig.subplots_adjust(left=.09, right=.97, top=.86, bottom=.22)
    fig.savefig(art_dir/'uni-market-absorption-sensitivity.svg', metadata={'Date': None}); plt.close(fig)
    print(json.dumps({'elapsed_days': elapsed, 'annualized_low': low, 'annualized_high': high, 'output_root': str(root)}))


if __name__ == '__main__':
    main()
