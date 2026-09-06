import type { ArticleSection } from './articleModels';

export const ETHEREUM_BLOBSPACE_SECTIONS_4: ArticleSection[] = [
  {
    id: 'what-would-change-the-conclusion',
    title: 'What would change the conclusion?',
    paragraphs: [
      'A sustained rise in submitted blobs relative to the contemporaneous target would change the capacity finding. A different non-zero-byte share would change the occupancy finding. Higher total posting costs would change the price finding. None of those changes can stand in for the other two.',
      'A protocol upgrade also changes the baseline. The schedule file deliberately ends at the historical cutoff; it does not assume that BPO2 remains the latest regime indefinitely. Any later activation belongs in a new interval with its actual timestamp. Proposals and test configurations alone are insufficient evidence that a mainnet capacity change occurred.',
      'For reliability, the relevant new evidence would be sustained high-load observations with adequate samples and controls. For archival economics, it would be retained bytes, replication, egress, and service cost under a stated policy. Capacity opportunities do not become stored data until they are used.',
    ],
  },
  {
    id: 'blobspace-questions',
    title: 'Common questions about blobspace utilization',
    paragraphs: [
      'Can blobs be 87% full while Ethereum uses about one-third of its target? Yes. The first percentage conditions on blobs that were posted; the second counts all scheduled target opportunities. Empty opportunities do not enter the first denominator.',
      'Is the target a hard limit? No. The table distinguishes the fee-control target from the larger per-block maximum. A block can exceed the target while remaining within the maximum. A daily average also hides bursts.',
      'Does a repeated blob prove duplicate users or wasted spending? No. The saved provider uniqueness statistic classifies blob objects. It does not identify users, explain intent, or evaluate the usefulness of the payload.',
      'Is 30–35% a live September utilization reading? No. It is the July operator range divided by the BPO2 target, retained here to show the denominator calculation. Refreshing a live estimate requires a new, time-aligned observation.',
      'Can these figures establish demand for ETH or predict its price? No. This audit measures objects, bytes, and protocol opportunities. A token valuation would require additional evidence about fees, settlement, monetary policy, and demand outside this measurement scope.',
    ],
  },
];
