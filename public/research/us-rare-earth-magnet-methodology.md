# U.S. rare-earth magnet capacity: methodology

Companion to “The U.S. Rare-Earth Magnet Buildout Is Larger Than It Looks—and Less Mature” by Sulayman Bowles.

Evidence cutoff: August 17, 2026. This companion was restored on September 10, 2026 from the published article and its existing capacity-model and source-ledger CSVs. It is not a new plant survey or a refreshed operating-status assessment.

## Files and scope

- [Article](https://sulayman-bowles.dev/research/data-systems/us-rare-earth-magnet-manufacturing-capacity)
- [Capacity model](https://sulayman-bowles.dev/research/us-rare-earth-magnet-capacity-model.csv)
- [Source ledger](https://sulayman-bowles.dev/research/us-rare-earth-magnet-source-ledger.csv)

The inventory measures disclosed U.S. finished NdFeB magnet projects. Upstream separation, oxide, metal, alloy, powder, recycling feedstock, and finished magnets are different product stages. Do not add their capacity figures together as finished-magnet supply.

A firm-project record requires an identifiable project and disclosed capacity. Record the facility, phase, original capacity value and unit, product form, target date, operating-status evidence, and source. Reconcile successive announcements before counting capacity; an expansion update is not automatically a second project.

## Units and maturity

Retain original tons/tonnes wording. The headline 37,750 is a stated-unit sum, not a precise metric-tonne total. The article's normalization range is 37,584–38,048 metric tonnes, reflecting unit uncertainty. Do not replace ambiguous source units with a single unqualified metric figure.

Classify projects separately as commercial shipments, commissioning/ramp/qualification, or future firm projects. The existing model contains 4,000 stated units in the commercial-shipment class, 3,600 in ramp/qualification, and 30,150 in future projects. These sum to 37,750. A first-production announcement, nameplate rating, or target date does not establish sustained customer-qualified output.

In the CSV, `capacity_unit` identifies the basis of `capacity_value`, which retains the original basis of each record: maturity buckets and their summary use stated units, normalization rows use metric tonnes, and material-flow rows use the model's gross process-flow basis. The separate scenario-output columns use the stated-unit basis and are blank for non-scenario records.

## Illustrative output scenarios

For each maturity bucket, multiply the capacity field by the scenario factor in the capacity-model CSV, then sum bucket outputs. Do not add the CSV summary row to the bucket rows again.

| Bucket | Model capacity | Conservative factor | Base factor | High factor |
| --- | ---: | ---: | ---: | ---: |
| Commercial shipments | 4,000 | 0.85 | 0.90 | 0.95 |
| Commissioning / ramp / qualification | 3,600 | 0.45 | 0.70 | 0.90 |
| Future firm projects | 30,150 | 0.10 | 0.35 | 0.70 |
| Derived output sum | | 8,035 | 16,672.5 | 28,145 |

These are arithmetic illustrations on the model's stated-unit basis. They retain the input-unit caveat. The factors are analyst assumptions, not company guidance, probabilities, guaranteed utilization rates, or a measured supply forecast.

## Material flow and demand

Gross process flow is a separate calculation from finished output. The model's 46,400–70,459 material-flow range must not be added to magnet nameplate or described as finished-magnet supply. Keep yield assumptions, product chemistry, upstream origin, and potential scrap recovery distinct.

Likewise, direct magnet imports and magnets embedded in imported motors, vehicles, electronics, or assemblies measure different demand boundaries. A comparison must use a consistent product scope and period. Missing embedded-import coverage does not equal zero demand.

## Limits and corrections

Unknown qualification, shipments, utilization, customer concentration, or input provenance remains unknown. Ownership, funding, or announced construction does not prove an operating supply chain. Public evidence can change after the cutoff.

A correction should identify the project, field, original source, replacement evidence and date, then rerun unit normalization and affected scenario rows. The public CSV is the disclosed model, not an independently audited engineering workbook. These materials are educational research, not an investment recommendation.
