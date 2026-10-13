# Four articles and their models

The strategy piece is substantially rewritten. The three pitches make different judgments, with dated company evidence, explicit model assumptions, counterarguments and evidence that would change the call. The submission includes four manuscripts, 17 tables, eight figures and two executed notebooks. Shared site integration remains with the coordinating lane.

- [Sell the Review Before You Scale the App](article.md) — 12 minutes. The first channel determines the offer and the work you inherit; holding price constant exposes the original recommendation's bias.
- [Toast: I Want the Gross-Profit Engine at a Better Price](pitches/toast/article.md) — 11 minutes. A useful restaurant workflow can support operating leverage, but the price must leave enough of that improvement for the shareholder.
- [Harvey: Who Keeps the Value of Faster Legal Work?](pitches/harvey/article.md) — 12 minutes. Recovered time has to become customer contribution, renewal and delivery margin; the financing benchmark creates a substantial return burden.
- [Vanta: The Business After the Audit](pitches/vanta/article.md) — 13 minutes. Maintained evidence earns a recurring budget if customers keep using the system after the audit and new business is profitable.

## Reproducible models

[Interactive Harvey and Vanta companion](pitches/companion/startup-models.html) · [Preview and verification instructions](pitches/companion/README.md)

Change adoption, review, work weeks and cash capture to compare rollout costs with renewal economics. The companion keeps the dated company anchors fixed and labels hypothetical buyer inputs.

[Investment-pitch notebook](pitches/models.ipynb) · [Fact and assumption manifest](pitches/inputs.json) · [Python calculations](pitches/models.py) · [Run alternative scenarios](pitches/SCENARIOS.md)

[Strategy notebook](model.ipynb) · [Operating calculations](model.py)

The investment assumptions are editable through the JSON manifest. Harvey now tests adoption and review; Vanta tests audit-season versus year-round work. Ten model tests guard the scenarios and source/output boundaries. Both notebooks contain five executed code cells with zero errors. Their eight embedded figures match the final exports. Current Harvey ARR and actual private-company pricing/margins are not filled in with guessed facts; normalizations remain labeled as assumptions.

![Vanta's declared cohort scenario](figures/vanta-cohort-growth.png)

The $300m opening ARR is Vanta's April 2026 disclosure. All subsequent cohort rates, new ARR and investor return conditions in this figure are modeled assumptions.

[Completion and editorial review](REVIEW.md) · [Exact integration handoff](HANDOFF.md)

## More startup studies — October 13

| Article | Judgment and model |
| --- | --- |
| [Ramp](pitches/ramp/article.md) | Card contribution and paid workflow value must improve the same relationship. [Inputs](pitches/ramp/inputs.json), [model](pitches/ramp/model.py), [sources](pitches/ramp/SOURCES.md). |
| [ElevenLabs](pitches/elevenlabs/article.md) | Accepted audio and verified agent tasks provide the useful economic denominator. [Inputs](pitches/elevenlabs/inputs.json), [model](pitches/elevenlabs/model.py), [sources](pitches/elevenlabs/SOURCES.md). |
| [Flock Safety](pitches/flock-safety/article.md) | Renewals must recover deployment and continuing service cash. [Inputs](pitches/flock-safety/inputs.json), [model](pitches/flock-safety/model.py), [sources](pitches/flock-safety/SOURCES.md). |

These three articles add 7,178 words, seven tables and four original figures. Company disclosures and authored operating scenarios remain distinct. [Export manifest](pitches/startups-manifest.json) and [verification receipt](pitches/startups-verification.json) identify the native files and model inputs. Run each company model, `build_startups.py`, `startup_figures.py` and `verify_startups.py` when reviewing a new scenario. Authored prose and tables require corresponding editorial updates; the verifier rejects stale principal table outputs.
