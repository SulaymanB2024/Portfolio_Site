export default {
  "cutoff": "2026-10-12",
  "input_sha256": "8b93829fe44c607f80e3bdb495be9f2917ad5e42d887e9a0a3cd7c5f9e9f2779",
  "harvey": {
    "reported": {
      "funding_date": "2026-09-09",
      "funding_m": 550,
      "announced_valuation_bn": 15.5,
      "AmLaw100_using_company_report": "80%",
      "source_id": "HV1",
      "older_ARR_checkpoint": "> $100m, August 4 2025 (HV2)"
    },
    "unknown": [
      "verified current ARR",
      "paid-cohort retention/expansion",
      "actual seat price",
      "production delivery cost",
      "cash burn and balance sheet",
      "security rights and preference waterfall"
    ],
    "assumed": {
      "starting_ARR_normalizations_m": [
        200,
        400,
        600
      ],
      "central_normalization_is_estimate": false,
      "five_year_growth": [
        0.25,
        0.4,
        0.55
      ],
      "exit_equity_to_ARR": [
        10,
        20,
        25
      ],
      "future_ownership_dilution": 0.25,
      "return_hurdle": 0.2,
      "customer_seats": 100,
      "customer_adoption": 0.6,
      "eligible_hours_saved_week": 6,
      "weeks": 46,
      "additional_review": 0.2,
      "contribution_per_monetized_hour": 200,
      "annual_license_per_seat": 2400,
      "first_year_implementation": 50000,
      "delivery_active_seat_fraction": 0.65,
      "delivery_cost_active_seat_year": [
        250,
        900,
        1800
      ],
      "other_delivery_cost_share_ARR": 0.15,
      "years": 5,
      "starting_ARR_m": 400,
      "hurdle_multiples": [
        10,
        15,
        20,
        25
      ],
      "monetization": [
        0.1,
        0.25,
        0.4
      ],
      "sensitivity_adoption": [
        0.3,
        0.6,
        0.9
      ],
      "sensitivity_review": [
        0.2,
        0.4,
        0.6
      ]
    }
  },
  "vanta": {
    "reported": {
      "ARR_checkpoint_date": "2026-04-29",
      "ARR_m": 300,
      "customers": 16000,
      "ARR_source_id": "VA2",
      "financing_date": "2025-07-23",
      "announced_valuation_bn": 4.15,
      "financing_m": 150,
      "financing_source_id": "VA1"
    },
    "derived": {
      "ARR_per_reported_customer": 18750,
      "status": "Normalization only, not list price, paid-cohort ACV or the 2025 round's entry multiple"
    },
    "unknown": [
      "paid-cohort retention/expansion",
      "actual contract-size mix",
      "gross margin and acquisition cash",
      "cash burn and balance sheet",
      "current private transaction price",
      "security rights and preference waterfall"
    ],
    "assumed": {
      "five_year_gross_ARR_retention": [
        0.85,
        0.93,
        0.95
      ],
      "expansion_of_retained_ARR": [
        0.05,
        0.15,
        0.22
      ],
      "annual_new_ARR_m": {
        "downside": [
          50,
          55,
          60,
          65,
          70
        ],
        "base": [
          100,
          115,
          130,
          145,
          160
        ],
        "upside": [
          110,
          135,
          160,
          185,
          210
        ]
      },
      "exit_equity_to_ARR": [
        6,
        10,
        12
      ],
      "future_ownership_dilution": 0.2,
      "return_hurdle": 0.2,
      "weekly_saved_hours_excluding_questionnaires": 8,
      "weeks": 46,
      "questionnaires_month": 10,
      "hours_per_questionnaire_before_after": [
        1.5,
        0.5
      ],
      "avoidable_labor_cost_hour": 80,
      "cash_capture": [
        0.25,
        0.5,
        1.0
      ],
      "first_year_implementation": 5000,
      "audit_fee": "continues; excluded from both alternatives",
      "years": 5,
      "hurdle_multiples": [
        6,
        10,
        12
      ],
      "sensitivity_work_weeks": [
        16,
        32,
        46
      ]
    }
  },
  "sources": {
    "harvey": {
      "id": "HV3",
      "label": "Law-firm ROI calculator",
      "href": "https://www.harvey.ai/roi-calculator/law-firm",
      "publisher": "Harvey",
      "date": "Current page",
      "type": "Primary company disclosure",
      "lastVerified": "2026-10-12",
      "note": "Describes conversion of recovered time into work/profit and explicitly illustrative pricing. Our deployment inputs and ROI are independently authored scenarios, not extracted calculator results."
    },
    "vanta": {
      "id": "VA2",
      "label": "April 2026 ARR milestone",
      "href": "https://www.vanta.com/resources/vanta-crosses-300m-in-arr-as-growth-accelerates",
      "publisher": "Vanta",
      "date": "2026-04-29",
      "type": "Primary company disclosure",
      "lastVerified": "2026-10-12",
      "note": "Company reports ARR crossed $300m and 16,000 customers. Model uses $300m as a dated anchor. $18,750 ARR/customer is a coarse normalization, not list price or verified paid-cohort ACV."
    }
  }
};
