# Methodology and evidence contract — The AI Megawatt Is Not a Megawatt

Research cutoff: 2026-08-16

## Research question

When a project is described as “1 GW,” what can be inferred about installed NVIDIA GB300 NVL72 rack capacity and annual full-load-equivalent accelerator-hours after reconciling interconnection, facility, IT, rack, network/support, nameplate, and utilization boundaries?

## Scope

- Population: a homogeneous, current-generation GB300 NVL72 reference deployment.
- Geography: no project-specific geography; PUE scenarios are generic engineering sensitivities anchored by LBNL’s U.S. AI-serving estimate.
- Time window: hardware and research available through 2026-08-16.
- Unit of analysis: one nominal “1 GW” claim.
- Primary output: installed B300 GPU equivalents under explicit electrical boundaries.
- Secondary output: annual powered-on and full-load-equivalent GPU-hours.

## What evidence would change the conclusion

Measured GB300 rack power distributions; audited facility one-lines; project-specific interconnection agreements; actual network, storage, support, and cooling power; installed asset registers; observed workload utilization; or a revised vendor architecture.

## What makes the question unanswerable

A source that does not define whether “1 GW” is announced, requested, firm, energized, facility, IT, average, or nameplate capacity. In that case the correct output is “not convertible from disclosed evidence.”

## Definitions register

| Term | Working definition | Why it matters |
|---|---|---|
| Interconnection request | Maximum facility power requested at the point of grid connection, including total facility needs and design margins | It is not average demand and does not establish installed equipment |
| Facility nameplate | Maximum total-building electrical capacity at a stated boundary | PUE must be applied to reach IT capacity |
| IT nameplate | Capacity available to IT equipment, excluding facility infrastructure | Do not apply PUE twice |
| Compute-rack nameplate | Sum of “up to” GB300 rack requirements | External network, storage, and support IT still sit outside this boundary |
| Average facility demand | Time-weighted average power over a period | Converts to MWh/TWh, not directly to installed fleet |
| Installed fleet | Switched-on or deployed rack/accelerator count | Separate from how intensely the hardware is used |
| Computational utilization | Time-weighted fraction of maximum computational level | Produces full-load-equivalent hours; does not equal paid utilization |
| Commercial utilization | Share of capacity earning revenue or contract consideration | Not observable from public engineering specifications |

## Core formulas

1. IT MW = Facility MW ÷ PUE
2. Compute-rack MW = IT MW ÷ (1 + external IT overhead)
3. GB300 rack equivalents = Compute-rack MW × 1,000 ÷ 142 kW/rack
4. Installed B300 GPUs = Rack equivalents × 72 GPUs/rack
5. Powered-on GPU-hours/year = Installed GPUs × 8,760
6. Full-load-equivalent GPU-hours = Powered-on GPU-hours × computational utilization
7. Average power = operational power × utilization + idle power × (1 − utilization)

## Data provenance and transformations

- Hardware configuration and rack power: NVIDIA Enterprise Reference Architecture, accessed 2026-08-16.
- Network BOM: NVIDIA eight-SU tables. Counts are transcribed; switch power is multiplied by vendor typical-power specifications.
- Facility PUE: LBNL’s 1.145 estimate for facilities serving AI equipment in 2024 is used as the reference case. 1.10 and 1.25 are scenario values, not claims about the population.
- External IT overhead: 6%, 10%, and 14% scenarios. The lower end is informed by the documented switch-power floor; 10% is consistent with an optical-switch comparator before unquantified support equipment; 14% is an external sense-check from a GB200-era analysis.
- Utilization: LBNL 75%–85% training range and 20%–30% inference cases. These are scenario inputs and remain weakly measured.
- Fractional rack outputs are mathematical equivalents. Real deployments use whole racks, phased occupancy, and design reserves.

## Contradiction register

| Issue | Sources | Apparent reason | Treatment |
|---|---|---|---|
| SN5600 vs SN5610 switch naming | NVIDIA BOM/logical architecture vs networking-hardware page | Documentation version or model substitution | Both are recorded; switch power shown as a range/comparator |
| 1 GW as IT vs facility | Epoch TCO vs Frontier Hub and many public announcements | Different analytical boundaries | Each boundary receives a separate calculation |
| PUE 1.145 vs higher peak ratios | LBNL annual AI-serving estimate vs peak-oriented analyses | Average vs peak and facility design differences | PUE is a scenario input with boundary stated |
| Interconnection utilization near 50% | LBNL synthesis vs unknown project-specific operations | Redundancy, maintenance, staging, demand management | Used only as an illustrative energy conversion |

## Independent calculation checks

- Reference GPU count recomputed by two equivalent paths: facility→IT→rack and facility ÷ (PUE × IT-overhead factor × rack kW/GPU density).
- Eight-SU switch power independently compared with rack nameplate and with the 1.14 external-IT/server ratio in Epoch’s GB200 analysis.
- MW-to-MWh conversion checked using 1 GW × 8,760 hours = 8.76 TWh/year at 100% average draw; 50% yields 4.38 TWh/year.
- Every consequential formula is preserved in the XLSX model.
