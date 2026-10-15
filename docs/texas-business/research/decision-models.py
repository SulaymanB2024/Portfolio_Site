"""Recompute declared article scenarios; no live prices or operating data.

Run: python3 docs/texas-business/research/decision-models.py
The adjacent executed notebook contains the same portable calculation code.
Inputs come from the eighteen Texas manuscripts at the October 13 revision.
This is a calculation companion, not a tax, engineering or eligibility engine.
"""

import json
import math


def annuity_pv(annual_amount, years, rate):
    """Year-end level cash flows, expressed at time zero."""
    return sum(annual_amount / (1 + rate) ** year for year in range(1, years + 1))


def calculate():
    models = {}
    models['power'] = {
        'agreementSecurityA_USD': max(80 * 50_000, 6_000_000),
        'agreementSecurityB_USD': max(80 * 50_000, 3_000_000),
        'extraCollateralThreeYearSimpleCarryUSD': 2_000_000 * .04 * 3,
        'simpleCarryEqualToExtraCIAC_Years': 1_200_000 / (2_000_000 * .04),
        'eighteenMonthDelayUSD': 18 * 150_000,
        'annualEnergyMWh': 80 * .7 * 8_760,
        'annualSupplyOnlyUSD': 80 * .7 * 8_760 * 65,
        'boundary': 'Assumed 4% net financing spread after collateral interest; flat three-year hold, no release or exit model. Energy excludes delivery and other charges.',
    }
    annual_gallons = 300_000 * 365
    water_saving = annual_gallons / 1_000 * (4.75 - 4)
    models['water'] = {
        'annualUseGallons': annual_gallons,
        'annualSupplyPriceSavingUSD': water_saving,
        'lostProductionDayEquivalent': water_saving / 60_000,
        'peakDeficitGallons': 600_000 - 400_000,
        'consecutivePeakDaysCovered': 400_000 / (600_000 - 400_000),
        'normalDaysToRestoreOnePeakDeficit': 200_000 / (400_000 - 300_000),
        'normalDaysToRestoreFullStorage': 400_000 / (400_000 - 300_000),
        'boundary': 'Annual savings and production loss compared on the same horizon. No event probability, fire reserve or instantaneous-flow sufficiency.',
    }
    limited_tax = min(4_500_000, 3_000_000 * 1.2) * .02
    uncapped_tax = 4_500_000 * .02
    limited_noi, uncapped_noi = 200_000 - limited_tax, 200_000 - uncapped_tax
    models['property-tax'] = {
        'limitedTaxUSD': limited_tax, 'uncappedTaxUSD': uncapped_tax,
        'capitalizationSensitivityUSD': (uncapped_tax - limited_tax) / .075,
        'limitedDSCR': limited_noi / 100_000, 'uncappedDSCR': uncapped_noi / 100_000,
        'limitedMaximumAnnualDebtServiceUSD': limited_noi / 1.25,
        'uncappedMaximumAnnualDebtServiceUSD': uncapped_noi / 1.25,
        'boundary': 'Invented property, rate, NOI, debt service and covenant. Annual debt-service capacity is not principal loan sizing.',
    }
    models['data-center-tax'] = {
        'standardStatePurchaseSavingUSD': 160_000_000 * .0625,
        'retainedAssumedLocalTaxUSD': 160_000_000 * .02,
        'annualStandardStateElectricitySavingUSD': 1_500_000 * 12 * .0625,
        'countableCreatedPositionsBeforeOtherScreens': 25 - 10,
        'lostSavingOnPreCertificationCohortUSD': 20_000_000 * .0625,
        'remainingPurchaseSavingUSD': (160_000_000 - 20_000_000) * .0625,
        'boundary': 'Eligible investment, qualifying jobs and exempt purchase cohorts are separate. No actual certificate or taxability determined.',
    }
    gross = annuity_pv(900_000, 10, .08)
    net = annuity_pv(750_000, 10, .08) - 250_000
    first_benefit = 900_000 / 1.08
    tail = sum(150_000 / 1.08 ** year for year in (11, 12, 13))
    models['jeti'] = {
        'originalGrossPV_USD': gross, 'lostYearOneBenefitPV_USD': first_benefit,
        'fixedEndDeferredGrossPV_USD': gross - first_benefit,
        'originalNetPV_USD': net, 'separateYears11to13CostPV_USD': tail,
        'separateTailAdjustedNetPV_USD': net - tail,
        'boundary': '8% discount, year-end cash flows. Lost first benefit and tail costs are separate sensitivities, not one combined project forecast.',
    }
    ez = 12_000_000 * .75 * .00331
    models['franchise-tax'] = {
        'EZ_USD': ez,
        'longFormAt7MCompensationUSD': (12_000_000 - 7_000_000) * .75 * .0075,
        'taxOnlyAllowableCompensationBreakEvenUSD': 12_000_000 - ez / (.75 * .0075),
        'longFormAt6_65MCompensationUSD': (12_000_000 - 6_650_000) * .75 * .0075,
        'with2200PreparationCompensationBreakEvenUSD': 12_000_000 - (ez - 2_200) / (.75 * .0075),
        'boundary': 'Other inputs held fixed, allowable compensation assumed, no credit. Other margin choices and actual eligibility can change the result.',
    }
    premium = 20 * 2_080 * (32 - 30) * 1.25
    wage_pvs = [annuity_pv(premium, years, .08) for years in (3, 5)]
    conversion = .8 * .9 * .75
    models['hiring'] = {
        'annualLoadedWagePremiumUSD': premium, 'oneAnnualPremiumDelayEquivalentDays': premium / 5_000,
        'threeAndFiveYearPremiumPV_USD': wage_pvs,
        'immediateDelayEquivalentDays': [pv / 5_000 for pv in wage_pvs],
        'productiveWorkersPer100Offers': 100 * conversion,
        'offersFor20ExpectedProductiveWorkers': math.ceil(20 / conversion),
        'boundary': 'Year-end recurring premiums versus immediate one-off loss. Expected-volume funnel is not guaranteed staffing or a causal recruiting effect.',
    }
    route_a = 120 * 3_000 + 20_000 * 5 * .2 + 6 * 5_000
    route_b = 120 * 3_200 + 20_000 * 3 * .2 + 2 * 5_000
    models['logistics'] = {
        'routeA_AnnualEconomicUSD': route_a, 'routeB_AnnualEconomicUSD': route_b,
        'netPremiumBeforeIncidentSavingUSD': 120 * (3_200 - 3_000) - 20_000 * (5 - 3) * .2,
        'avoidedIncidentsNeededAt5000USD': (24_000 - 8_000) / 5_000,
        'oneTimePipelineCapitalReleaseUSD': 20_000 * (5 - 3),
        'extraAverageSafetyStockErasingAdvantageUSD': (route_a - route_b) / .2,
        'boundary': 'Common duties and handling excluded equally. Inventory capital is distinct from annual carrying cost; shared production stoppage counted once.',
    }
    good = 500 * 400 * .85 * .95
    required_allocation = 40_000 / good
    models['manufacturing'] = {
        'buyerAllocatedComponents': good * .25,
        'componentsAt94PercentTestYield': 500 * 400 * .85 * .94 * .25,
        'requiredTestYieldAt25PercentAllocation': 40_000 / (500 * 400 * .85 * .25),
        'requiredAllocationAt95PercentTestYield': required_allocation,
        'allocationHeadroomPercentagePoints': (.25 - required_allocation) * 100,
        'boundary': 'Declared gross output, yields and allocation. Percent versus percentage points preserved; no actual supplier capacity or entitlement.',
    }
    deductible_a, deductible_b = 12_000_000 * .03, 100_000
    models['insurance'] = {
        'quoteA_DeductibleUSD': deductible_a,
        'retainedDamageAt200k_AandB_USD': [min(200_000, d) for d in (deductible_a, deductible_b)],
        'retainedDamageAt600k_AandB_USD': [min(600_000, d) for d in (deductible_a, deductible_b)],
        'sevenDayContributionExposureUSD': 7 * 8_000,
        'fourteenAdditionalDayContributionExposureUSD': 14 * 8_000,
        'boundary': 'Simple retained damage applies to otherwise covered loss within modeled limits. Contribution is not a policy indemnity computation or expected loss.',
    }
    baseline = 200 * 28
    initial_mix = 120 * 20 + 80 * 28
    models['robotaxi-map'] = {
        'baselineFareUSD': baseline, 'initialMixFareUSD': initial_mix,
        'tenExceptionsFareUSD': initial_mix + 10 * 28,
        'tenExceptionsAllocatedTimeUSD': 10 * 20,
        'twentyExceptionsEconomicUSD': initial_mix + 20 * (28 + 20),
        'breakEvenExceptionsPer120Attempts': 20 / 120,
        'boundary': '120 AV attempts out of 200 requested journeys. Original AV charge retained; replacement fare and time incremental, refunds absent.',
    }
    models['waymo'] = {
        'autonomousBaseFareUSD': 200 * 24, 'alternativeBaseFareUSD': 200 * 29,
        'autonomousBaseTimeValueUSD': 200 * 8, 'alternativeBaseTimeValueUSD': 200 * 2,
        'timeValueBreakEvenPerHourUSD': (29 - 24) / ((8 - 2) / 60),
        'fallbackFareCashUSD': 160 * 24 + 40 * 38,
        'fallbackAllocatedMinutesAt60USDperHour': 160 * 8 + 40 * 20,
        'fallbackEconomicTotalUSD': 160 * (24 + 8) + 40 * (38 + 20),
        'independentIllustrativeTimetableLeadMinutes': 10 + 25 + 10,
        'boundary': '20 fallback minutes are total, replacing ordinary eight-minute wait. No AV fare on fallback. One employee; common in-vehicle time excluded from fare comparison. Separate timetable uses invented 10/25/10 minutes for pickup/travel/access and buffer; not provider times or fare-model inputs.',
    }
    available = 40 * 16 * .8
    models['zoox'] = {
        'availableVehicleHours': available,
        'completedTripsAt55PercentOccupied': available * .55 / (24 / 60),
        'completedTripsAt40PercentOccupied': available * .4 / (24 / 60),
        'boundary': 'Hours and duration use the same completed-trip population. No costs, fleet estimate, passenger multiplication or peak-capacity promise.',
    }
    current, direct, transfer = 1_500, 1_310, 1_380
    recovery, lost_contribution = 800 * .02 * 350, 800 * .02 * 500
    direct_total = 800 * direct + 200 * current + 40_000 + recovery + lost_contribution
    transfer_total = 800 * transfer + 200 * current + 40_000 + recovery + lost_contribution
    net_per_accepted = current - direct - .02 * 850
    models['freight'] = {
        'directEconomicTotalUSD': direct_total, 'transferEconomicTotalUSD': transfer_total,
        'directSavingUSD': 1_000 * current - direct_total,
        'incrementalRecoveryInvoicesUSD': recovery, 'incrementalLostContributionUSD': lost_contribution,
        'netSavingPerAcceptedShipmentBeforeSetupUSD': net_per_accepted,
        'firstWholeLoadBreakEven': math.ceil(40_000 / net_per_accepted),
        'unpricedEconomicHeadroomPerAcceptedLoadUSD': (1_000 * current - direct_total) / 800,
        'allInVariableCostCeilingAt800AcceptedUSD': current - 40_000 / 800 - .02 * 850,
        'providerRoadQuoteCeilingAt800AcceptedUSD': current - 40_000 / 800 - .02 * 850 - 100 - 60,
        'boundary': 'Allocated labor, paid invoices and lost contribution separated. 2% is incremental to current transport; common warehouse labor included once.',
    }
    models['authorization'] = {
        'allocatedExistingStaffUSD': 12 * 125 + 16 * 100,
        'paidBackupReservationUSD': 6 * 400,
        'incrementalPaidReplacementUSD': 60 * 120,
        'preparednessEconomicUSD': 12 * 125 + 16 * 100 + 6 * 400,
        'combinedStressEconomicUSD': 12 * 125 + 16 * 100 + 6 * 400 + 60 * 120,
        'commonFreightExcludedUSD': 360 * 900,
        'boundary': 'Backup reservation purchases priority, not free replacement. Common base freight excluded; no enforcement probability or actual quote.',
    }
    return {'status': 'Recomputed declared hypothetical inputs; not observed business results', 'models': models}


if __name__ == '__main__':
    print(json.dumps(calculate(), indent=2))
