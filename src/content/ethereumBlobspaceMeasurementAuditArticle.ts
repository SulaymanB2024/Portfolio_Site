import type { ResearchArticle } from './articleModels';
import { ETHEREUM_BLOBSPACE_SECTIONS_1 } from './ethereumBlobspaceMeasurementAuditSections1';
import { ETHEREUM_BLOBSPACE_SECTIONS_2 } from './ethereumBlobspaceMeasurementAuditSections2';
import { ETHEREUM_BLOBSPACE_SECTIONS_3 } from './ethereumBlobspaceMeasurementAuditSections3';
import { ETHEREUM_BLOBSPACE_SECTIONS_4 } from './ethereumBlobspaceMeasurementAuditSections4';
import { ETHEREUM_BLOBSPACE_SOURCES } from './ethereumBlobspaceMeasurementAuditSources';

export const ETHEREUM_BLOBSPACE_MEASUREMENT_AUDIT_ARTICLE: ResearchArticle = {
  "kind": "research",
  "cluster": "financial-systems",
  "slug": "ethereum-blobspace-measurement-audit",
  "number": "12",
  "category": "ON-CHAIN MEASUREMENT",
  "title": "Ethereum Blobspace Is 87% Full Inside Posted Blobs, but Only 30–35% Used Across Slots",
  "seoTitle": "Ethereum Blobspace Utilization: 87% Full vs 30–35% Used",
  "subtitle": "A denominator-consistent audit of 20.1 million mainnet blobs across Dencun, Pectra, BPO1, and BPO2.",
  "seoDescription": "Ethereum blobs are 86.94% occupied after submission but current BPO2 capacity is only 29.76–34.72% utilized. This audit reconciles the denominators.",
  "artwork": {
    "kind": "study",
    "variant": "triptych",
    "label": "Blob objects / scheduled capacity / network load",
    "note": "Three related measurements with three different denominators."
  },
  "date": "2026.08.16",
  "dateModified": "2026.08.16",
  "lastVerified": "2026.08.16",
  "readTime": "24 MIN",
  "author": "SULAYMAN BOWLES",
  "thesis": "Ethereum rollups tightly pack the blobs they submit, but aggregate demand currently uses only about one-third of BPO2 target capacity; occupancy, capacity, price, and reliability must remain separate measurements.",
  "conclusion": {
    "title": "Name the denominator first",
    "content": "Ethereum did not end up with one blobspace utilization number. It ended up with a stack of related markets and resource constraints. The submitted objects are tightly packed: 86.94% of their fixed bytes are non-zero. The current schedule is lightly used: 30,000–35,000 blobs/day equal 29.76%–34.72% of BPO2 target and 19.84%–23.15% of maximum. The full history sits between those figures: 20.1 million blobs consumed 50.54% of the target opportunities and 31.315% of the maximum opportunities that existed in each regime. Demand grew beyond Dencun’s original target. Capacity grew faster. The blob-object fee can be tiny while execution remains the relevant price component. An early reliability warning disappeared after a client issue was corrected, while sustained saturation remains untested. BPO2’s unused headroom is therefore neither proof of failure nor proof of safety. It is the measured operating range Ethereum created to learn what the network can support. The next analysis should begin by naming the denominator."
  },
  "evidenceBoundary": "The analysis reconstructs capacity from protocol constants and a cumulative Blobscan snapshot through slot 14,794,852. It does not decode payload meaning, resolve blobs to human users, estimate a full daily series, or demonstrate sustained operation near BPO2 target or maximum load.",
  "metrics": [
    {
      "label": "Cumulative blobs",
      "value": "20.13M"
    },
    {
      "label": "Posted-blob occupancy",
      "value": "86.94%"
    },
    {
      "label": "Full-history target used",
      "value": "50.54%"
    },
    {
      "label": "Current BPO2 target used",
      "value": "29.76–34.72%"
    }
  ],
  "content": [
    "Ethereum blobspace is simultaneously 86.94% full and roughly 30–35% utilized under its current target. Neither statement is wrong. They divide different things.",
    "Blobscan’s 86.94% statistic measures non-zero bytes inside blobs that were actually submitted. Each blob has a fixed 131,072-byte envelope; the statistic asks how much of that envelope contains non-zero data. The 30–35% result instead divides a current operating range of 30,000–35,000 blobs per day by BPO2’s target of 100,800 blob opportunities per day across all scheduled slots. One is payload occupancy conditional on a blob existing. The other is network-capacity utilization before a blob exists.",
    "That denominator distinction changes the interpretation of Ethereum’s data-availability market. Rollups pack the blobs they buy tightly. They do not currently buy anything close to all the blob opportunities Ethereum targets. Across the entire period from Dencun through Blobscan’s July 18 cutoff, 20,133,327 submitted blobs used 50.54% of regime-weighted target capacity and 31.315% of regime-weighted maximum capacity. Current daily demand exceeds Dencun’s original 21,600-blob target, but protocol capacity increased faster than demand.",
    "The fee story is separate again. A near-zero blob-object fee does not prove that posting data is free, because a blob-carrying transaction also pays execution gas. Ethereum’s EIP-7918 now explicitly ties a reserve mechanism to execution cost because, when execution dominates the user’s total price, the blob base fee can stop controlling quantity. Reliability requires another denominator and another evidence set. MigaLabs initially associated 16-plus-blob blocks with higher next-slot miss rates, then reported after a 100-day follow-up that the relationship disappeared and was apparently caused by a consensus-client database issue. The corrected conclusion is narrower: blob load was not a first-order reliability factor under the observed low-load regime, while sustained operation near BPO2’s limit remains untested.",
    "The useful result is not that blobspace is simply “full” or “empty.” It is that four measurements often presented as one—submitted objects, occupied bytes, fee pressure, and network load—must remain separate."
  ],
  "sections": [
    ...ETHEREUM_BLOBSPACE_SECTIONS_1,
    ...ETHEREUM_BLOBSPACE_SECTIONS_2,
    ...ETHEREUM_BLOBSPACE_SECTIONS_3,
    ...ETHEREUM_BLOBSPACE_SECTIONS_4,
  ],
  "sources": ETHEREUM_BLOBSPACE_SOURCES
};
