# UNI supply bridge: historical inputs and conditional scenarios

Published September 6, 2026. Tracker input: August 5, 2026, 18:15 UTC.
Separate reported recent window: 3,928,000 UNI over 90 days, cited August 1.

The August draft preserved these provider numbers but not the original tracker
response or classified wallet export. Live pages have changed. They are reported
historical inputs, not newly verified balances or an independently audited transfer
census. The source and claim ledgers separate them from primary contract mechanics.

Subtract the 100,000,000 treasury transfer from 108,025,224 recognized burn-address
UNI. The residual 8,025,224 includes recurring and any other transfers captured by
the tracker. Annualize over the exact UTC time since December 27, 2025, 20:33:11;
round only at presentation. Annualize the other window with a 365/90 multiplier.

The effective quantity is 1,000,000,000 minus 108,025,224. It is neither circulating
supply nor market float. Transferring to a nonzero dead address does not decrement
the UNI contract's totalSupply(). Treasury distribution and new minting are separate.

The model is B − Gs − M: annualized proxy, annual budget, assumed sell-through,
and new minted tokens reaching market. G = 20M and M = 0. Exact break-even rows use
B/G. Neither proxy is a forecast, and positive modeled absorption is not measured
net exchange buying. Existing searcher inventory and unrelated holder sales are omitted.

```sh
python -m pip install matplotlib==3.10.7
python uni-burn-reproduction.py --output-root ./reproduced
```

The script makes no network calls and writes calculations, scenarios, and three SVGs.
A refresh needs retained block-specific reads, address coverage, classified transfers,
and recipient-disposition evidence before replacing assumptions with observations.
