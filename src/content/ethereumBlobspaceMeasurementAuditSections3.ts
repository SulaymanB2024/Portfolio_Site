import type { ArticleSection } from './articleModels';

export const ETHEREUM_BLOBSPACE_SECTIONS_3: ArticleSection[] = [
  {
    id: 'reliability-after-the-follow-up',
    title: 'The reliability finding changed after the follow-up',
    paragraphs: [
      'MigaLabs initially found higher next-slot miss rates after unusually large blob blocks. Its April 9 follow-up, covering roughly 100 days, reported that the relationship disappeared and appeared to trace to a consensus-client database problem. That correction belongs beside the initial finding. Treating the first result as settled evidence would misrepresent the researchers’ own update. [S13]',
      'The follow-up still does not establish safe sustained operation at the target or maximum. High-load blocks were rare in the observed sample. A reliability assessment needs enough observations at the relevant workload, client-version controls, and timing and propagation measurements. Low average demand cannot supply those missing observations.',
    ],
  },
  {
    id: 'how-to-reproduce-the-capacity-bridge',
    title: 'How to reproduce the capacity bridge',
    paragraphs: [
      'The downloadable calculation starts with four half-open slot intervals: start inclusive, end exclusive. Its last endpoint is 14,794,853, so the saved snapshot’s slot 14,794,852 is included exactly once. Multiply each interval’s slot count by the target and maximum that applied during that interval; then sum the opportunities before dividing the cumulative blob count.',
      'The reproduction script asserts that the intervals are contiguous and that the totals reconcile to 39,839,110 target opportunities and 64,292,937 maximum opportunities. It separately calculates the July operator range against 7,200 scheduled slots per day. Neither operation fabricates the missing daily observations.',
      'Byte calculations use 131,072 raw bytes per blob, decimal GB equal to one billion bytes, and binary GiB equal to 2^30 bytes. Applying 86.94% to a daily count is an estimate using a rounded cumulative occupancy input. It is not a measurement of that day’s payload.',
    ],
  },
  {
    id: 'evidence-dates-and-reproduction-limits',
    title: 'Evidence dates and reproduction limits',
    paragraphs: [
      'This is a historical measurement audit. The cumulative count, uniqueness count, occupancy, and last synced slot were retained in the August research draft and refer to the July 18, 2026 snapshot. The 30,000–35,000 daily range comes from Blobscan’s operator article, not an independently exported daily series. Publication in September does not move either observation window forward. [S08–S10]',
      'The original raw dashboard response was not preserved with the draft. The input file therefore records these values as reported historical inputs. A reader can reproduce the arithmetic, but cannot independently reconstruct the original dashboard response from this package. The protocol schedule and the operator’s published range were checked again during release preparation.',
      'A fresh observation should retain the response, retrieval time, chain, finalized slot, provider definitions, and a content hash. To extend this audit, obtain a daily series with the same boundaries and change both numerator and denominator together. Do not combine a refreshed count with this article’s old capacity cutoff.',
    ],
  },
];
