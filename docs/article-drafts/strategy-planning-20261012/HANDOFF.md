# Four articles — integration handoff

This batch contains four first-person manuscripts, four native article JSONs, 17 tables, eight original figures and two executed notebooks. The writing and reproducible models are ready for review. Catalog, artwork and public-route integration remain with the coordinating lane.

## Reader files and proposed routes

| Article | Manuscript | Native JSON filename | Proposed canonical path |
| --- | --- | --- | --- |
| Sell the Review Before You Scale the App | [article.md](article.md) | `choosing-a-growth-channel-under-a-capacity-limit.json` | `/research/strategy-systems/choosing-a-growth-channel-under-a-capacity-limit` |
| Toast: I Want the Gross-Profit Engine at a Better Price | [Toast](pitches/toast/article.md) | `toast-gross-profit-engine.json` | `/research/financial-systems/toast-gross-profit-engine` |
| Harvey: Who Keeps the Value of Faster Legal Work? | [Harvey](pitches/harvey/article.md) | `harvey-who-keeps-the-value-of-legal-ai.json` | `/research/financial-systems/harvey-who-keeps-the-value-of-legal-ai` |
| Vanta: The Business After the Audit | [Vanta](pitches/vanta/article.md) | `vanta-after-the-audit.json` | `/research/financial-systems/vanta-after-the-audit` |

JSONs live in `src/personal/editorial/data/articles/`. Each manuscript directory includes a source register and proposed `catalog-entry.json`. [The manifest](pitches/article-manifest.json) binds repository-relative paths, counts, reading estimates and model inputs. Reading estimates use 220 words/minute, excluding source registers. The four bodies total 10,752 words.

## What improved in this revision

The private-company pitches now stress the conditions behind their payback cases. Harvey tests adoption and review while holding the purchased-seat bill fixed. Vanta tests whether weekly savings continue after audit season. These are hypothetical dependencies, not observed company outcomes.

Investment assumptions now come from [inputs.json](pitches/inputs.json). [SCENARIOS.md](pitches/SCENARIOS.md) explains alternative inputs and explicit output files. The CLI protects dated reported anchors and does not rewrite the reviewed manuscripts. Zero usable time gives a null payback requirement and the remaining costs. Ten tests cover financial changes, invalid inputs, evidence boundaries and canonical-output preservation.

The article generator uses ordered `markdownSections[].blocks` with global table references. This is the site's existing renderer contract; the ordinary `sections` branch does not receive global tables. Exhibits now appear between the paragraphs that introduce and interpret them, including multiple tables in a section. The task preview uses the actual native Section component through a temporary Vite export, without editing shared application source.

Manuscript images, reading links and receipt paths are relative to the repository. A rejected first-version snapshot remains local in the original lane; its ignored archive is excluded from the pull request.

## Models and evidence

The new [interactive buyer-economics companion](pitches/companion/startup-models.html) exposes Harvey adoption/review/contribution capture and Vanta work weeks/questionnaire volume/cash capture. It separates rollout from renewal while holding the selected annual workload fixed. [Its README](pitches/companion/README.md) lists the five external-script runtime files and reproduction checks. The bundle has no external data-service calls or package dependencies; future public integration should keep the files together, register the accepted destination and provide the site's normal metadata. It does not modify or register the four article routes.

- [Strategy notebook](model.ipynb), `model.py` and `model-results.json`: operating cash, capacity, price counterfactuals and timing variants.
- [Investment notebook](pitches/models.ipynb), `pitches/models.py` and `pitches/model-results.json`: Toast underwriting, Harvey customer/delivery/return models, Vanta customer/cohort/return models.
- `figures/`: eight SVGs and PNG export copies. SVG names match the JSON's proposed `/images/research/` references.
- `verification.json` and `pitches/verification.json`: independent material arithmetic, final article and figure hashes.
- `pitches/notebook-output-check.json`: ten executed code cells, zero errors, eight embedded PNGs equal to final exports.
- `source-verification.json`, `pitches/source-verification.json`, `pitches/web-readbacks.json`: source access evidence. Five HTTP clients were denied; primary web text was read separately.
- `pitches/protected-files-check.json`: 29 existing articles plus catalog match the isolated main baseline.
- [REVIEW.md](REVIEW.md): actual checks, visual inspection and remaining boundaries.

Current Harvey ARR and actual private-company pricing/margins remain unverified; $400m is an illustrative normalization. Vanta's April ARR and older July valuation are different-date checkpoints. Private return scenarios exclude security preferences, audited cash needs and fees. Toast's quote is frozen at its stated time. All future drivers remain assumptions, with no probability weights. No holdings or client experience is invented.

## Integration steps

1. Review the four manuscripts, native JSONs and catalog proposals; register the accepted identities through the site's normal workflow.
2. Copy the eight referenced SVGs from `figures/` into `public/images/research/`. Preserve their exact filenames.
3. Assign cover artwork for each canonical path and add required poster/curation records. The body preview omits the unassigned covers.
4. Curate related reading and topic/skill mappings. The JSONs contain no nonexistent public model downloads or unregistered cross-links.
5. Refresh generated documents and discovery metadata, run integration/release checks, and inspect full desktop/phone routes. Body inspection does not verify covers, cards, navigation or deployment.

## Reproduction

From the repository root, with Node dependencies available:

```sh
python3 docs/article-drafts/strategy-planning-20261012/model.py
python3 docs/article-drafts/strategy-planning-20261012/pitches/models.py
python3 docs/article-drafts/strategy-planning-20261012/pitches/build_articles.py
python3 docs/article-drafts/strategy-planning-20261012/pitches/test_models.py
python3 docs/article-drafts/strategy-planning-20261012/verify.py
python3 docs/article-drafts/strategy-planning-20261012/pitches/verify.py
./node_modules/.bin/tsc --noEmit -p docs/article-drafts/strategy-planning-20261012/tsconfig.json
```

The calculations require only Python's standard library. Figure/notebook reproduction uses the pinned packages in `requirements.txt` inside a task-local environment. Run `pitches/prepare_notebooks.py` with that Python to execute both notebooks and rebuild the articles. `prepare-handoff.py` delegates to this workflow. Author prose in `strategy-draft.md` or `pitches/*-draft.md`; edit exhibit bindings in `pitches/build_articles.py`. Reconcile numerical prose before changing canonical assumptions.

Render HTML readbacks with `node --import tsx .../render-notebook.tsx`, first with defaults, then with `pitches/models.ipynb pitches/notebook-preview.html`. `node .../preview.mjs` starts a temporary dynamic localhost preview with four article links and lane resource aliases. Stop the owned preview after inspection. Restart it after changing its Vite plugin configuration.

The submission branch is `codex/strategy-investment-articles-20261012`, isolated from other active writing lanes at main revision `cb70322bb8f46589005c6f655be9044b8d841d58`. The user authorized a pull request; merging and public-site publication remain outside this submission.

## October 13 extension — Ramp, ElevenLabs and Flock Safety

Three additional articles are ready as native JSON and portable Markdown, with dated primary-source registers and executable hypothetical customer/cohort models. Use `pitches/startups-manifest.json` and each company `catalog-entry.json` for the proposed slugs, metadata and file paths. They add 7,178 authored words, seven native tables and four figures. Preserve `markdownSections[].blocks` and global table references; preserve the nearby source/model qualifications and first-person judgments.

The coordinating lane still owns catalog registration, artwork/cover assignment, curation and generated routes. Four additional SVGs must be copied from this lane's `figures/` to the site's public research-image destination when integrating: `ramp-card-software-contribution.svg`, `elevenlabs-accepted-audio-cost.svg`, `elevenlabs-agent-cash-capture.svg` and `flock-installed-cohort-cash.svg`. The local preview whitelist supplies them for inspection; no public copies or catalog entries have been installed by this lane. Register the earlier four articles and eight figures under their existing contract separately.

Run each company model to regenerate results; then regenerate new figures/exports and run `pitches/verify_startups.py` plus `pitches/elevenlabs/verify_model.py`. Principal monetary table values and Flock payback years are checked against emitted models. Editorial prose/tables remain authored and must be revised when scenario assumptions change. All current outputs are hypothetical operating cases, not company margins, audited earnings, current private-security prices or observed customer outcomes. The Harvey/Vanta companion has its own five-file runtime contract above.
