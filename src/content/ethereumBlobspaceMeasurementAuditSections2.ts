import type { ArticleSection } from './articleModels';

export const ETHEREUM_BLOBSPACE_SECTIONS_2: ArticleSection[] = [
  {
    "id": "since-dencun-half-of-target-less-than-one-third-of-maximum",
    "title": "Since Dencun: half of target, less than one-third of maximum",
    "paragraphs": [
      "The full-history calculation is straightforward once the denominator is constructed correctly:",
      "20,133,327 realized blobs ÷ 39,839,110 target opportunities = 50.5366%",
      "20,133,327 realized blobs ÷ 64,292,937 maximum opportunities = 31.3150%",
      "This period spans 6,168,677 scheduled slots, or 856.76 days. Target headroom totals 19,705,783 blob-slots. Maximum headroom totals 44,159,610.",
      "The result should not be read as a time-weighted welfare score. It compresses at least four different states:",
      "Galaxy’s five-day post-Pectra analysis illustrates the denominator effect. It reported daily blobs rising from about 21,200 before Pectra to 25,600 after it, while target utilization fell because the target doubled from three to six. It also reported blobs around 86% full internally. Higher demand, lower target utilization, and high object occupancy all occurred together. [S14]",
      "A full daily series would show the transitions better than a cumulative ratio. The present reconstruction answers a different question: given the capacity Ethereum actually exposed in each period, how much of it was converted into submitted blobs? The answer is approximately half of target and less than one-third of maximum."
    ],
    "bullets": [
      "Dencun demand approached the original three-blob target for periods before Pectra.",
      "Pectra doubled the target, mechanically lowering the utilization ratio even as purchased blobs increased.",
      "BPO1 lasted only 28.44 days before BPO2.",
      "BPO2 intentionally opened a much larger operating range for network observation."
    ]
  },
  {
    "id": "does-counting-missed-slots-change-the-result",
    "title": "Does counting missed slots change the result?",
    "paragraphs": [
      "The base denominator uses scheduled slots, including slots that produced no canonical block. A produced-block denominator would be smaller. Because this analysis does not estimate the actual miss rate over the entire 856.76-day period, it tests hypothetical adjustments instead of silently excluding slots.",
      "The central conclusion is insensitive to plausible illustrative adjustments. These scenarios are not observed miss-rate estimates. Their purpose is to show that scheduled-versus-produced-slot choice does not turn one-third current target utilization into saturation."
    ],
    "table": {
      "caption": "Does counting missed slots change the result?",
      "columns": [
        "Hypothetical missed-slot rate",
        "Historical target utilization",
        "Historical maximum utilization",
        "Current BPO2 target utilization at 30k–35k/day"
      ],
      "rows": [
        [
          "0%",
          "50.54%",
          "31.315%",
          "29.76%–34.72%"
        ],
        [
          "0.5%",
          "50.79%",
          "31.47%",
          "29.91%–34.90%"
        ],
        [
          "1.0%",
          "51.05%",
          "31.63%",
          "30.06%–35.07%"
        ],
        [
          "2.0%",
          "51.57%",
          "31.95%",
          "30.37%–35.43%"
        ]
      ]
    }
  },
  {
    "id": "five-layers-that-dashboards-should-not-collapse",
    "title": "Five layers that dashboards should not collapse",
    "paragraphs": [
      "The blob market needs a measurement contract. At minimum, a dashboard should label five layers."
    ]
  },
  {
    "id": "1-object-count",
    "title": "1. Object count",
    "paragraphs": [
      "Question: How many blob envelopes were submitted?",
      "Use total blobs, blobs per slot, and blobs per day. This is the correct layer for target/max count utilization. It does not say how many non-zero bytes were inside each object."
    ]
  },
  {
    "id": "2-byte-occupancy",
    "title": "2. Byte occupancy",
    "paragraphs": [
      "Question: How much of each submitted envelope contained non-zero data?",
      "Use non-zero bytes divided by fixed raw bytes in submitted blobs. This is where 86.94% belongs. It does not count unused slot opportunities."
    ]
  },
  {
    "id": "3-capacity-utilization",
    "title": "3. Capacity utilization",
    "paragraphs": [
      "Question: How many protocol blob opportunities were exercised?",
      "Use submitted blobs divided by a stated denominator: scheduled target blob-slots, produced-block target blob-slots, scheduled maximum blob-slots, or produced-block maximum blob-slots. The choice must be visible. “Average blobs per block” can be misleading if “block” excludes missed slots or if the target changes inside the selected period."
    ]
  },
  {
    "id": "4-economic-price",
    "title": "4. Economic price",
    "paragraphs": [
      "Question: What did the poster actually pay?",
      "Separate blob-object fee, type-3 execution gas, and total posting cost. A dashboard that plots only the blob-object fee can display near-zero prices while rollups still pay meaningful execution costs."
    ]
  },
  {
    "id": "5-network-load-and-reliability",
    "title": "5. Network load and reliability",
    "paragraphs": [
      "Question: What happened to propagation, validation, proposer timing, reorgs, and missed slots at a given workload?",
      "Use workload-conditioned distributions and sufficiently large samples. A capacity parameter is not proof of safe sustained throughput; a few rare 21-blob blocks are not a saturation test.",
      "This taxonomy is not cosmetic. Each denominator can move in a different direction after an upgrade. Pectra raised the target, daily blobs rose, target utilization fell, object occupancy rose, blob-object fees collapsed, and execution costs dominated the total. A single “blob market health” number would erase the mechanism."
    ],
    "table": {
      "caption": "5. Network load and reliability",
      "columns": [
        "Metric",
        "Valid numerator",
        "Valid denominator",
        "Supports",
        "Does not support"
      ],
      "rows": [
        [
          "Posted-blob occupancy",
          "Non-zero bytes",
          "Raw bytes in posted blobs",
          "Packing/padding analysis",
          "Slot utilization, users, semantic usefulness"
        ],
        [
          "Target utilization",
          "Submitted blobs",
          "Target blob opportunities",
          "Use relative to fee-control point",
          "Hard-cap saturation, price paid"
        ],
        [
          "Maximum utilization",
          "Submitted blobs",
          "Maximum blob opportunities",
          "Distance from consensus envelope",
          "Equilibrium demand"
        ],
        [
          "Blob-object fee",
          "Blob gas payment",
          "Blob object or gas unit",
          "Blob-market component",
          "Total rollup posting cost"
        ],
        [
          "Total posting cost",
          "Blob fee + execution cost",
          "Transaction, blob, byte, or time",
          "Economic cost if denominator is stated",
          "Network stability"
        ],
        [
          "Miss rate by workload",
          "Misses after workload bucket",
          "Slots in workload bucket",
          "Conditional reliability association",
          "Causation without controls"
        ]
      ]
    }
  },
  {
    "id": "price-is-not-scarcity-and-object-fee-is-not-total-price",
    "title": "Price is not scarcity, and object fee is not total price",
    "paragraphs": [
      "EIP-4844’s excess-blob-gas mechanism raises the blob base fee when usage runs above target and lowers it below target. That invites a simple reading: a low blob fee means low demand relative to target. The reading is incomplete because the blob-carrying type-3 transaction also consumes execution gas.",
      "Galaxy’s post-Pectra snapshot makes the distinction concrete. It reported essentially zero blob-object fees in the first five full days after the upgrade, but about $11,015 per day of total blob-related costs when type-3 execution costs were included. Execution accounted for 99.99% of the ETH burned from the measured activity during that short window. [S14]",
      "EIP-7918 formalizes the mechanism behind the discrepancy. When execution costs dominate the consumer’s total price, moving the blob base fee has almost no effect on real demand. The blob fee can fall to its floor even though the relevant good is not literally free. EIP-7918 therefore imposes an execution-linked reserve behavior so the blob fee market retains a meaningful signal and blob consumers pay a fraction of the market rate for node compute. [S07]",
      "Three statements must remain separate:",
      "Low target utilization should usually push the native blob fee down, but the user’s total marginal cost can still be governed by execution. Conversely, a reserve-linked blob fee can be positive when target utilization is low. After EIP-7918, “blob base fee above one wei” is not clean evidence of current blob scarcity.",
      "For rollup economics, the useful unit is rarely dollars per blob alone. Operators care about total L1 posting cost per compressed byte, per batch, per L2 transaction, or per unit of revenue. Those require rollup-specific data outside this article’s aggregate scope. The measurement audit’s narrower contribution is to prevent one component from being mislabeled as the whole price."
    ],
    "bullets": [
      "Blob-object fees are low. This describes one protocol fee component.",
      "Total posting cost is low or high. This requires blob and execution components, normalized per transaction, blob, non-zero byte, or batch.",
      "Capacity is under target. This is a quantity ratio, not a price series."
    ]
  }
];
