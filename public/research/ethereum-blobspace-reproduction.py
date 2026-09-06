#!/usr/bin/env python3
"""Reproduce the July 2026 historical blobspace audit; this does not fetch live data.

Requires Python 3.10+ and matplotlib==3.10.7.
Run: python ethereum-blobspace-reproduction.py --output-root ./reproduced
Outputs are written under OUTPUT/research. SVG dimensions are responsive.
"""
import argparse
import csv
import json
from pathlib import Path

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

SNAPSHOT = {
    'cutoff_date': '2026-07-18',
    'last_synced_slot_inclusive': 14794852,
    'total_blobs': 20133327,
    'unique_blobs': 19807161,
    'reported_occupancy': 0.8694,
    'operator_daily_range': [30000, 35000],
    'raw_bytes_per_blob': 131072,
    'provenance': 'Historical numbers retained in the August draft; original dashboard response not preserved. Operator range is not a daily series.',
}
REGIMES = [
    ('Dencun', 8626176, 11649024, 3, 6),
    ('Pectra', 11649024, 13205504, 6, 9),
    ('BPO1', 13205504, 13410304, 10, 15),
    ('BPO2', 13410304, 14794853, 14, 21),
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-root', type=Path, default=Path('reproduced'))
    out = parser.parse_args().output_root / 'research'
    out.mkdir(parents=True, exist_ok=True)
    rows = []
    for name, start, end, target, maximum in REGIMES:
        rows.append(dict(regime=name, start_slot=start, end_slot_exclusive=end,
                         scheduled_slots=end-start, target_per_slot=target,
                         maximum_per_slot=maximum, target_opportunities=(end-start)*target,
                         maximum_opportunities=(end-start)*maximum))
    assert all(a[2] == b[1] for a, b in zip(REGIMES, REGIMES[1:]))
    target = sum(r['target_opportunities'] for r in rows)
    maximum = sum(r['maximum_opportunities'] for r in rows)
    assert (target, maximum) == (39839110, 64292937)
    daily = []
    for count in SNAPSHOT['operator_daily_range']:
        raw = count * SNAPSHOT['raw_bytes_per_blob']
        daily.append(dict(blobs=count, target_fraction=count/(7200*14), maximum_fraction=count/(7200*21),
                          raw_GB=raw/1e9, raw_GiB=raw/2**30,
                          estimated_nonzero_GB=raw*SNAPSHOT['reported_occupancy']/1e9))
    result = dict(inputs=SNAPSHOT, regimes=rows, target_opportunities=target, maximum_opportunities=maximum,
                  history_target_fraction=SNAPSHOT['total_blobs']/target,
                  history_maximum_fraction=SNAPSHOT['total_blobs']/maximum,
                  repeated_blobs=SNAPSHOT['total_blobs']-SNAPSHOT['unique_blobs'],
                  daily_scenarios=daily,
                  missed_slot_sensitivity=[dict(hypothetical_miss_fraction=m,
                      history_target_fraction=SNAPSHOT['total_blobs']/(target*(1-m)),
                      history_maximum_fraction=SNAPSHOT['total_blobs']/(maximum*(1-m))) for m in [0, .005, .01, .02]])
    (out / 'ethereum-blobspace-calculations.json').write_text(json.dumps(result, indent=2)+'\n')
    with (out / 'ethereum-blobspace-schedule.csv').open('w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)

    plt.rcParams.update({'font.family': 'DejaVu Sans', 'font.size': 12, 'svg.fonttype': 'none',
                         'svg.hashsalt': 'ethereum-blobspace-2026-07', 'axes.spines.top': False,
                         'axes.spines.right': False, 'figure.facecolor': '#f7f4ed', 'axes.facecolor': '#f7f4ed'})
    fig, ax = plt.subplots(figsize=(12, 6.56))
    edges = [(r[1]-REGIMES[0][1])/7200 for r in REGIMES]+[(REGIMES[-1][2]-REGIMES[0][1])/7200]
    ax.stairs([r[3] for r in REGIMES], edges, baseline=None, color='#176b78', linewidth=3, label='Target')
    ax.stairs([r[4] for r in REGIMES], edges, baseline=None, color='#b25230', linewidth=3, label='Maximum')
    ax.fill_between([edges[3], edges[4]], 30000/7200, 35000/7200, color='#293447', alpha=.25,
                    label='July operator range: 4.17–4.86 blobs/slot')
    for i, regime in enumerate(REGIMES):
        ax.text((edges[i]+edges[i+1])/2, 22.5, regime[0], ha='center', fontsize=10)
    ax.set(xlim=(0, edges[-1]), ylim=(0, 24), ylabel='Blobs per scheduled slot', xlabel='Days since Dencun activation')
    ax.grid(axis='y', alpha=.15); ax.legend(loc='upper left', bbox_to_anchor=(0, .85), frameon=False, fontsize=10)
    fig.suptitle('Capacity increased in four distinct regimes', x=.09, ha='left', fontsize=19, fontweight='bold')
    fig.text(.09, .035, 'Through July 18, 2026 · EIPs 4844, 7691, 8134, 8135; Blobscan operator range.\nThe shaded range is a July observation, not a daily historical series.', fontsize=10)
    fig.subplots_adjust(left=.09, right=.97, top=.89, bottom=.21)
    fig.savefig(out/'ethereum-blobspace-schedule.svg', metadata={'Date': None}); plt.close(fig)

    fig, ax = plt.subplots(figsize=(12, 7.01))
    labels = ['Posted-blob byte occupancy', 'History / scheduled target', 'History / scheduled maximum',
              'July range / BPO2 target', 'July range / BPO2 maximum']
    values = [86.94, result['history_target_fraction']*100, result['history_maximum_fraction']*100,
              daily[0]['target_fraction']*100, daily[0]['maximum_fraction']*100]
    highs = values[:3]+[daily[1]['target_fraction']*100, daily[1]['maximum_fraction']*100]
    for i, (low, high) in enumerate(zip(values, highs)):
        ax.barh(i, low, height=.48, color='#176b78' if i < 3 else '#b25230')
        if high != low:
            ax.barh(i, high-low, left=low, height=.48, color='#b25230', alpha=.4, hatch='///')
        label = f'{low:.2f}%' if high == low else f'{low:.2f}–{high:.2f}%'
        ax.text(high+1.5, i, label, va='center', fontsize=11)
    ax.set(yticks=range(5), yticklabels=labels, xlim=(0, 104), xlabel='Percent of the named denominator')
    ax.invert_yaxis(); ax.grid(axis='x', alpha=.15); ax.set_axisbelow(True)
    fig.suptitle('A denominator map, not a single utilization series', x=.04, ha='left', fontsize=18, fontweight='bold')
    fig.text(.04, .035, 'Historical inputs through July 18, 2026 · Blobscan and author calculations.\nHatching marks the reported daily range. Original cumulative dashboard response was not preserved.', fontsize=10)
    fig.subplots_adjust(left=.30, right=.97, top=.85, bottom=.20)
    fig.savefig(out/'ethereum-blobspace-denominators.svg', metadata={'Date': None}); plt.close(fig)
    print(json.dumps({'target_opportunities': target, 'maximum_opportunities': maximum, 'outputs': str(out)}))


if __name__ == '__main__':
    main()
