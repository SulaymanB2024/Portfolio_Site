import type { ArticleSection } from './articleModels';

export const ETHEREUM_BLOBSPACE_SECTIONS_1: ArticleSection[] = [
  {
    "id": "the-answer-in-one-table",
    "title": "The answer in one table",
    "paragraphs": [
      "Observed: Blobscan’s cumulative blob count and 86.94% posted-blob occupancy.",
      "Derived: target and maximum utilization ratios.",
      "Estimate: current non-zero bytes obtained by applying the cumulative rounded occupancy rate to the published 30,000–35,000/day range."
    ],
    "table": {
      "caption": "The answer in one table",
      "columns": ["Question", "Numerator", "Denominator", "Result", "What it means"],
      "rows": [
        ["How tightly are submitted blobs packed?", "Non-zero bytes in submitted blobs", "Fixed raw bytes in submitted blobs", "86.94% reported by Blobscan", "Posted blobs contain relatively little zero padding. It says nothing about empty slots."],
        ["How much BPO2 target capacity is used at 30,000 blobs/day?", "30,000 submitted blobs/day", "100,800 target blob-slots/day", "29.76%", "About seven of every ten target opportunities are unused at the low end of the current range."],
        ["How much BPO2 target capacity is used at 35,000 blobs/day?", "35,000", "100,800", "34.72%", "About two-thirds of target opportunities remain unused at the high end."],
        ["How much BPO2 maximum capacity is used?", "30,000–35,000", "151,200 maximum blob-slots/day", "19.84%–23.15%", "Current demand is roughly one-fifth to one-quarter of the hard per-block envelope."],
        ["How much regime-weighted target capacity was used since Dencun?", "20,133,327 cumulative blobs", "39,839,110 target opportunities", "50.54%", "Over the full history, actual blobs equal about half of the target capacity that existed in each regime."],
        ["How much regime-weighted maximum capacity was used?", "20,133,327", "64,292,937 maximum opportunities", "31.315%", "About two-thirds of the consensus maximum envelope was unused over the full period."]
      ]
    }
  },
  {
    "id": "four-capacity-regimes-not-one-denominator",
    "title": "Four capacity regimes, not one denominator",
    "paragraphs": [
      "EIP-4844 introduced a fixed-size blob object and an independent fee market. The specification defines each blob as 4,096 field elements of 32 bytes, or 131,072 raw bytes. At Dencun, Ethereum targeted three blobs per block and allowed a maximum of six. Pectra doubled the target to six and raised the maximum to nine. Fusaka activated PeerDAS on December 3, 2025 without immediately changing those numbers; BPO1 followed on December 9 with 10/15, and BPO2 followed on January 7, 2026 with 14/21. [S01–S05]",
      "A cumulative utilization calculation cannot divide all historical blobs by today’s 14-blob target. That would retroactively assign BPO2 capacity to periods when the protocol exposed three or six target slots. The correct denominator is regime-weighted.",
      "The slot boundaries come from Ethereum’s Deneb and Electra fork epochs, the BPO activation timestamps, Beacon Chain genesis time, and the 12-second slot duration. The final interval includes Blobscan’s last synced slot by ending at slot 14,794,853. [S03–S05; S15–S16]",
      "This reconstruction yields a regime-weighted target of 6.458 blobs per scheduled slot and a weighted maximum of 10.422. Actual history averaged 3.264 blobs per scheduled slot, or 23,499 blobs per day. Those averages are not a daily demand series. They are a compact check that the row-level capacity calculation reconciles."
    ],
    "table": {
      "caption": "Four capacity regimes, not one denominator",
      "columns": ["Regime", "Start", "Scheduled slots in interval", "Days", "Target / max per slot", "Target opportunities", "Maximum opportunities"],
      "rows": [
        ["Dencun → Pectra", "Slot 8,626,176", "3,022,848", "419.84", "3 / 6", "9,068,544", "18,137,088"],
        ["Pectra → BPO1", "Slot 11,649,024", "1,556,480", "216.18", "6 / 9", "9,338,880", "14,008,320"],
        ["BPO1 → BPO2", "Slot 13,205,504", "204,800", "28.44", "10 / 15", "2,048,000", "3,072,000"],
        ["BPO2 → Blobscan cutoff", "Slot 13,410,304", "1,384,549", "192.30", "14 / 21", "19,383,686", "29,075,529"],
        ["Total", "", "6,168,677", "856.76", "Regime-weighted", "39,839,110", "64,292,937"]
      ]
    },
    "figures": [{
      "src": "/research/ethereum-blobspace-schedule.svg",
      "alt": "Step chart of Ethereum blob target and maximum by protocol regime, with the current 30,000 to 35,000 blob daily range shown as a band.",
      "label": "Figure 1 / Capacity regime schedule",
      "width": 2286,
      "height": 1249,
      "caption": "Figure 1. Ethereum mainnet blob target and maximum by protocol regime. The shaded current-demand band converts 30,000–35,000 blobs/day into 4.167–4.861 blobs per scheduled slot. The band sits above Dencun’s old target of three and below every later target."
    }]
  },
  {
    "id": "eighty-seven-percent-full-is-conditional-on-a-blob-being-posted",
    "title": "“Eighty-seven percent full” is conditional on a blob being posted",
    "paragraphs": [
      "Blob objects are fixed-size envelopes. A rollup can submit a blob whose entire 131,072 bytes are meaningful non-zero data, or one with substantial zero padding. Blobscan’s “total blob usage size” measures meaningful non-zero data per day. Its snapshot reported:",
      "The statistic is useful. It says rollups generally do not purchase a 128-KiB-class object and leave most of it zeroed. At the displayed occupancy rate, a submitted blob carries about 113,954 non-zero bytes on average. The cumulative total contains roughly 2.087 TiB of non-zero bytes and 0.313 TiB of zero or padding bytes when reconstructed from the rounded occupancy figure. Blobscan displays 2.08 TiB because the dashboard inputs are rounded; the article does not force the derived result to equal a rounded display exactly.",
      "But the 86.94% denominator contains only blobs that exist. It excludes:",
      "This is why a market can have tightly packed purchased units and low utilization of system-wide capacity at the same time. An airline can fly 87%-full planes while operating only one-third of its potential schedule. The seat-load factor and fleet-capacity ratio are not competitors; they describe different layers.",
      "There is another boundary. “Non-zero” is not synonymous with “unique,” “compressed efficiently,” “economically valuable,” or “generated by distinct users.” A non-zero byte can be useful state-diff data, repeated data, protocol overhead, or payload whose semantic quality this aggregate cannot classify. The article therefore calls 86.94% syntactic occupancy, not useful-data efficiency.",
      "Blobscan’s total-minus-unique count implies 326,166 repeated blobs, or 1.62% of cumulative submissions. That is a blob-level uniqueness statistic under Blobscan’s definition, not a user-deduplication rate and not evidence of fraud or waste. [S08]"
    ],
    "bullets": [
      "20,133,327 total blobs;", "19,807,161 unique blobs;", "2.40 TiB of fixed raw blob bytes;", "2.08 TiB of usage;", "111.29 KiB average usage per blob;", "86.94% average occupancy;", "synced slot 14,794,852. [S08–S09]", "a produced block with no blobs;", "unused target capacity in a block with four blobs under a target of fourteen;", "unused space between target and maximum;", "a missed slot with no canonical block;", "the time between a protocol increase and demand catching up."
    ]
  },
  {
    "id": "current-bpo2-utilization-is-about-one-third-of-target",
    "title": "Current BPO2 utilization is about one-third of target",
    "paragraphs": [
      "BPO2 targets 14 blobs per slot and allows 21. With 12-second slots, a fully scheduled day contains 7,200 slots. The current envelopes are therefore:",
      "Blobscan’s July operator note said mainnet was seeing approximately 30,000–35,000 blobs per day. [S10] Dividing that range by BPO2 capacity gives:",
      "Estimate applies the cumulative, rounded 86.94% occupancy rate to the published current range. It is not a directly observed daily usage series.",
      "The raw-byte arithmetic is slightly higher than Blobscan’s rounded 3.8–4.5 GB operator estimate. The difference is not economically meaningful, but the unit convention matters for an archival-capacity article: 30,000 fixed 131,072-byte blobs equal 3.932 billion bytes, while a rounded “128 KB” convention yields a smaller number. The calculation files report decimal GB and binary GiB separately.",
      "Current demand has not stagnated at Dencun levels. Dencun’s target was 21,600 blobs/day. A 30,000–35,000/day range is 38.9%–62.0% above that original target. The more precise conclusion is therefore not “rollups never needed more capacity.” Demand moved above the original control point. Pectra and the two BPOs moved the control point much faster.",
      "At 30,000/day, the system has 70,800 target blob opportunities of daily headroom. At 35,000/day, it has 65,800. Relative to maximum, the daily headroom is 121,200–116,200 blobs. These are protocol opportunities, not inventory held on a balance sheet. They carry networking and archival implications if used, but an unused opportunity does not itself consume 131,072 bytes of storage."
    ],
    "bullets": ["Target: 7,200 × 14 = 100,800 blobs/day.", "Maximum: 7,200 × 21 = 151,200 blobs/day.", "Target raw bytes: 13.212 GB/day, or 12.305 GiB/day.", "Maximum raw bytes: 19.818 GB/day, or 18.457 GiB/day."],
    "table": {
      "caption": "Current BPO2 utilization is about one-third of target",
      "columns": ["Current run rate", "Blobs per scheduled slot", "BPO2 target utilization", "BPO2 maximum utilization", "Raw bytes/day", "Estimated non-zero bytes/day*"],
      "rows": [["30,000/day", "4.167", "29.76%", "19.84%", "3.932 GB", "3.419 GB"], ["35,000/day", "4.861", "34.72%", "23.15%", "4.588 GB", "3.988 GB"]]
    },
    "figures": [{
      "src": "/research/ethereum-blobspace-denominators.svg",
      "alt": "Horizontal bar chart comparing posted-blob byte occupancy, historical target and maximum utilization, and current BPO2 utilization ranges.",
      "label": "Figure 2 / Denominator map",
      "width": 2287,
      "height": 1336,
      "caption": "Figure 2. Four percentages that are all correct. Posted-blob byte occupancy is 86.94%; full-history target utilization is 50.54%; full-history maximum utilization is 31.315%; current BPO2 target and maximum utilization are ranges of 29.76%–34.72% and 19.84%–23.15%. The chart is a denominator map, not a single time series."
    }]
  }
];
