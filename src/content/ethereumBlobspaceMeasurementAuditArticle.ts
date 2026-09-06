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
  "title": "Ethereum Blobspace: 87% Full Inside Posted Blobs, 30–35% of Target in July 2026",
  "seoTitle": "Ethereum Blobspace Utilization: July 2026 Measurement Audit",
  "subtitle": "A historical audit of 20.1 million mainnet blobs through July 18, 2026, with separate measures for occupied bytes and scheduled opportunities.",
  "seoDescription": "A July 2026 Ethereum blobspace snapshot: 86.94% posted-blob occupancy versus 29.76–34.72% of BPO2 target. Data, denominators, and reproducible calculations.",
  "artwork": {
    "kind": "study",
    "variant": "triptych",
    "label": "Blob objects / scheduled capacity / network load",
    "note": "Three related measurements with three different denominators."
  },
  "date": "2026.09.06",
  "dateModified": "2026.09.06",
  "lastVerified": "2026.07.18",
  "readTime": "24 MIN",
  "author": "SULAYMAN BOWLES",
  "thesis": "Ethereum rollups tightly pack the blobs they submit, but the July operator range used only about one-third of BPO2 target capacity; occupancy, capacity, price, and reliability must remain separate measurements.",
  "conclusion": {
    "title": "Name the denominator first",
    "content": "The July snapshot shows tightly packed submitted blobs alongside substantial unused scheduled capacity. Those findings use different denominators. Report objects, occupied bytes, fees, and reliability separately; preserve each observation window before comparing regimes or making claims about demand and safe throughput."
  },
  "evidenceBoundary": "Historical inputs through July 18, 2026 (slot 14,794,852), retained in the August research draft. The original dashboard response is not included; arithmetic is reproducible, but the saved provider snapshot cannot be independently reconstructed from this package. The July operator range is not a September live reading, a daily series, or a sustained-load test.",
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
      "label": "July BPO2 target used",
      "value": "29.76–34.72%"
    }
  ],
  "content": [
    "Ethereum blobspace is simultaneously 86.94% full and roughly 30–35% utilized under the BPO2 target in the July snapshot. Neither statement is wrong. They divide different things.",
    "Blobscan’s 86.94% statistic measures non-zero bytes inside blobs that were actually submitted. Each blob has a fixed 131,072-byte envelope; the statistic asks how much of that envelope contains non-zero data. The 30–35% result instead divides a July 2026 operator range of 30,000–35,000 blobs per day by BPO2’s target of 100,800 blob opportunities per day across all scheduled slots. One is payload occupancy conditional on a blob existing. The other is network-capacity utilization before a blob exists.",
    "That denominator distinction changes the interpretation of Ethereum’s data-availability market. Rollups pack the blobs they buy tightly. The July range did not represent purchases of anything close to all the blob opportunities Ethereum targets. Across the entire period from Dencun through Blobscan’s July 18 cutoff, 20,133,327 submitted blobs used 50.54% of regime-weighted target capacity and 31.315% of regime-weighted maximum capacity. The July daily range exceeds Dencun’s original 21,600-blob target, but protocol capacity increased faster than demand.",
    "The fee story is separate again. A near-zero blob-object fee does not prove that posting data is free, because a blob-carrying transaction also pays execution gas. Ethereum’s EIP-7918 now explicitly ties a reserve mechanism to execution cost because, when execution dominates the user’s total price, the blob base fee can stop controlling quantity. Reliability requires another denominator and another evidence set. MigaLabs initially associated 16-plus-blob blocks with higher next-slot miss rates, then reported after a 100-day follow-up that the relationship disappeared and was apparently caused by a consensus-client database issue. The corrected conclusion is narrower: blob load was not a first-order reliability factor under the observed low-load regime, while sustained operation near BPO2’s limit remains untested.",
    "The useful result is not that blobspace is simply “full” or “empty.” It is that four measurements often presented as one—submitted objects, occupied bytes, fee pressure, and network load—must remain separate."
  ],
  "sections": [
    ...ETHEREUM_BLOBSPACE_SECTIONS_1,
    ...ETHEREUM_BLOBSPACE_SECTIONS_2,
    ...ETHEREUM_BLOBSPACE_SECTIONS_3,
    ...ETHEREUM_BLOBSPACE_SECTIONS_4,
  ],
  resources: [
    { label: 'Capacity intervals and calculations', href: '/research/ethereum-blobspace-calculations.json', description: 'Reported historical inputs, exact interval boundaries, and derived ratios.', format: 'JSON' },
    { label: 'Capacity schedule', href: '/research/ethereum-blobspace-schedule.csv', description: 'Four contiguous capacity regimes through the July 18 snapshot.', format: 'CSV' },
    { label: 'Source ledger', href: '/research/ethereum-blobspace-source-ledger.csv', description: 'Source register with historical-input and release-check boundaries.', format: 'CSV' },
    { label: 'Methodology', href: '/research/ethereum-blobspace-methodology.md', description: 'Definitions, date boundaries, and limits of the reconstruction.', format: 'MD' },
    { label: 'Reproduction script', href: '/research/ethereum-blobspace-reproduction.py', description: 'Rebuild the capacity calculations and both figures from the saved inputs.', format: 'PY' },
  ],
  "sources": ETHEREUM_BLOBSPACE_SOURCES
};
