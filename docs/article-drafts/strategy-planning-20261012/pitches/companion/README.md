# Who keeps the savings?

A browser companion to the Harvey and Vanta manuscripts. It changes buyer assumptions while keeping the reviewed company observations fixed. The controls reveal the difference between rollout payback and recurring economics, including adoption, review, an audit-season workload and cash capture.

## Use the companion

Serve this directory over HTTP and open `startup-models.html`. For an independent local preview:

```sh
cd docs/article-drafts/strategy-planning-20261012/pitches/companion
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/startup-models.html`; stop the server when finished. The existing lane preview also serves the full repository-relative path to this file. No package dependencies, external data services, credentials, analytics or external fonts are required by the companion.

The five runtime files are `startup-models.html`, `startup-models.css`, `startup-models.mjs`, `scenario-math.mjs` and `model-context.mjs`. Keep them together when integrating the bundle. Scripts use external modules and no inline event handlers, matching the site's script CSP. No public route is registered by this directory.

## Evidence and calculation boundaries

`model-context.mjs` is exported from the reviewed `../inputs.json` with its input fingerprint. Harvey's license/work inputs are assumptions. Vanta's annual contract is ARR/customer normalization from the dated April 29, 2026 checkpoint, rather than disclosed pricing or paid-cohort ACV. The assumptions and source links are visible in the companion.

Harvey credits incremental contribution after added review. Vanta credits spending actually avoided, with questionnaire work counted separately. Recurring benefits hold the selected workload and value capture constant and remove only the one-time implementation cost. No usable work yields a null payback requirement; costs remain. Capture above 100% is shown as unreachable. Scenarios have no probability weights.

## Reproduce and verify

From the repository root:

```sh
python3 docs/article-drafts/strategy-planning-20261012/pitches/companion/prepare_companion.py --check
node --test docs/article-drafts/strategy-planning-20261012/pitches/companion/scenario-math.test.mjs
```

Forty reviewed base, stress and seeded cases compare browser calculations with the existing Python models. Two further tests check invalid inputs, unchanged source data and the first-year/renewal cost bridge. Run `prepare_companion.py` without `--check` after a reviewed baseline revision to regenerate the snapshot and cases. Reconcile explanatory copy and presets before accepting a new baseline.

The calculations can be tested without the full site build. Actual browser checks still need to exercise presets, keyboard sliders, zero-capacity states, source details and the desktop/phone layouts. The source-owned `../../REVIEW.md` records that inspection and submission state.
