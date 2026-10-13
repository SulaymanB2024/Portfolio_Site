# Run an alternative scenario

`inputs.json` drives the investment models. Its reported values have dated source references; future drivers and customer economics are assumptions. The canonical manuscripts use that reviewed baseline. An alternative scenario computes a new answer without rewriting the manuscripts, figures, notebooks or canonical results.

From the repository root:

```sh
mkdir -p docs/article-drafts/strategy-planning-20261012/.cache
cp docs/article-drafts/strategy-planning-20261012/pitches/inputs.json docs/article-drafts/strategy-planning-20261012/.cache/scenario.json
```

Edit the assumptions in the copied file. Useful questions include lower Harvey adoption, more review, weaker Vanta retention, fewer weeks of ongoing evidence work, or a different Toast entry hurdle. The CLI rejects changes to the dated quote, observation cutoff and reported company anchors. New source facts require a reviewed baseline update; modifying a field does not verify a company fact.

```sh
python3 docs/article-drafts/strategy-planning-20261012/pitches/models.py \
  --inputs docs/article-drafts/strategy-planning-20261012/.cache/scenario.json \
  --output docs/article-drafts/strategy-planning-20261012/.cache/scenario-results.json
```

Omit `--output` to print JSON. A custom input file never overwrites `pitches/model-results.json` by default. Output includes a fingerprint of the input values. The script uses Python's standard library, with no network or credentials.

Zero usable time produces a `null` payback requirement and the remaining costs, rather than an infinite or fabricated return. Full ownership dilution, invalid retention, non-finite values and acquisition lists that do not cover the modeled horizon are rejected. The growth, cost and dilution assumptions are scenarios with no probability weights.

Run the stress and CLI-boundary checks with:

```sh
python3 docs/article-drafts/strategy-planning-20261012/pitches/test_models.py
```

The manuscript verifier checks the reviewed baseline with independent Decimal calculations. Changing that baseline requires revising the numerical prose, table/figure bindings and source record, then rerunning the authoring and verification workflow. A custom result file is not a reviewed replacement article.
