# Ethereum blobspace measurement audit: historical reconstruction

Published September 6, 2026. Cumulative observation cutoff: July 18, 2026,
slot 14,794,852 inclusive. Research draft retained August 16, 2026.

The input values are transcribed historical observations retained in the draft.
The original Blobscan response was not preserved. Reproduction verifies arithmetic
and chart construction; it does not independently reproduce the provider snapshot.
The 30,000–35,000/day range comes from Blobscan's operator article and is not a daily
export or a current September reading. The source ledger gives the original references.

For each half-open interval, multiply scheduled slots by the regime's target and
maximum. Sum the intervals, then divide the cumulative 20,133,327 blobs by those
totals. Do not apply BPO2 capacity retroactively. Missed slots remain in the scheduled
denominator; hypothetical miss-rate adjustments are sensitivity checks, not observations.

Posted-blob occupancy divides non-zero bytes by raw bytes in submitted objects.
It excludes unused opportunities. Each raw blob is 131,072 bytes. GB is 10^9 bytes;
GiB is 2^30 bytes. Daily non-zero bytes estimated with 86.94% use a rounded cumulative
occupancy input and are not measured daily payloads.

To reproduce in an isolated Python environment:

```sh
python -m pip install matplotlib==3.10.7
python ethereum-blobspace-reproduction.py --output-root ./reproduced
```

The script writes the JSON calculation record, interval CSV, and two SVG figures.
It makes no network calls. A new audit needs synchronized observations, explicit
provider definitions, finalized slot boundaries, retained raw responses, and hashes.
