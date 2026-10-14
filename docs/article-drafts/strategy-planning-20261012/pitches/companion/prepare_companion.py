"""Export source-bound browser inputs and Python parity cases. --check is read-only."""
from pathlib import Path
import argparse
import copy
import json
import random
import sys

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from models import load_inputs, results
from build_articles import HARVEY_SOURCES, VANTA_SOURCES


def artifacts():
    baseline = load_inputs()
    snapshot = {'cutoff': baseline['cutoff'], 'input_sha256': results(baseline)['input_sha256'],
                'harvey': baseline['harvey'], 'vanta': baseline['vanta'],
                'sources': {'harvey': next(s for s in HARVEY_SOURCES if s['id'] == 'HV3'),
                            'vanta': next(s for s in VANTA_SOURCES if s['id'] == 'VA2')}}
    hcases = [{'adoption': .6, 'review': .2, 'capture': .25},
              {'adoption': .3, 'review': .2, 'capture': .25},
              {'adoption': .6, 'review': .6, 'capture': .25},
              {'adoption': 0, 'review': .2, 'capture': .25},
              {'adoption': 1, 'review': 1, 'capture': 1}]
    vcases = [{'weeks': 46, 'questionnaires': 10, 'capture': .5},
              {'weeks': 16, 'questionnaires': 10, 'capture': .5},
              {'weeks': 46, 'questionnaires': 10, 'capture': 1},
              {'weeks': 0, 'questionnaires': 0, 'capture': .5},
              {'weeks': 52, 'questionnaires': 20, 'capture': 0}]
    rng = random.Random(20261012)
    hcases += [dict(adoption=rng.randrange(101)/100, review=rng.randrange(101)/100,
                    capture=rng.randrange(101)/100) for _ in range(15)]
    vcases += [dict(weeks=rng.randrange(53), questionnaires=rng.randrange(21),
                    capture=rng.randrange(101)/100) for _ in range(15)]
    fixtures = []
    for company, cases in [('harvey', hcases), ('vanta', vcases)]:
        for knobs in cases:
            inputs = copy.deepcopy(baseline)
            a = inputs[company]['assumed']
            if company == 'harvey':
                a.update(customer_adoption=knobs['adoption'], additional_review=knobs['review'], monetization=[knobs['capture']])
                row = results(inputs)['harvey']['customer_value']
                case = row['cases'][str(knobs['capture'])]
                expected = dict(hours=row['net_freed_hours'], captured=case['incremental_contribution'],
                                firstCost=row['first_year_total_cost'],
                                recurringCost=row['first_year_total_cost']-row['implementation_first_year'],
                                firstBenefit=case['net_first_year_benefit'],
                                recurringBenefit=case['net_first_year_benefit']+row['implementation_first_year'],
                                firstCapture=row['break_even_monetization_fraction'])
            else:
                a.update(weeks=knobs['weeks'], questionnaires_month=knobs['questionnaires'], cash_capture=[knobs['capture']])
                row = results(inputs)['vanta']['customer_value']
                case = row['cases'][str(knobs['capture'])]
                expected = dict(hours=row['annual_freed_hours'], captured=case['cash_avoidance'],
                                firstCost=row['normalized_annual_license']+row['first_year_implementation'],
                                recurringCost=row['normalized_annual_license'],
                                firstBenefit=case['net_first_year_cash_benefit'],
                                recurringBenefit=case['net_recurring_cash_benefit'],
                                firstCapture=row['break_even_first_year_capture'])
            expected['recurringCapture'] = (expected['firstCapture'] * expected['recurringCost'] / expected['firstCost']
                                             if expected['firstCapture'] is not None else None)
            fixtures.append({'company': company, 'knobs': knobs, 'expected': expected})
    return {'model-context.mjs': 'export default ' + json.dumps(snapshot, indent=2, allow_nan=False) + ';\n',
            'parity-cases.json': json.dumps(fixtures, indent=2, allow_nan=False) + '\n'}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    for name, content in artifacts().items():
        path = HERE/name
        if args.check:
            if not path.is_file() or path.read_text() != content:
                parser.error(f'{name} is stale; regenerate the reviewed companion')
        else:
            path.write_text(content)
    print('Browser snapshot and 40 parity cases ' + ('verified.' if args.check else 'exported.'))
