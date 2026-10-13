# Publishing and updating Texas business research

The deliverable is a useful answer to a business decision, supported by primary evidence and readable on the actual site. Eighteen dedicated investigations cover twelve core Texas decisions and six mobility/freight decisions. Their commissioned readers, decisions and editorial review dates live in [library.json](library.json); dates there are manual reminders, not legal deadlines or scheduled jobs.

## Choose and research the next decision

Run `npm run texas:queue -- --as-of YYYY-MM-DD` in a verified owning checkout. It lists date reminders and material update triggers without fetching a source, changing an article or scheduling work. Review an earlier trigger immediately when actual new evidence appears. Choose work by commercial usefulness and new evidence, rather than a daily article quota.

Write a brief naming the reader, action at stake, question, controlling sources, required comparison, unresolved facts and update trigger. A new question receives a distinct canonical article. A changed answer to the same question updates the established URL. Avoid parallel pages competing to answer the same decision.

Read the current controlling text, order, filing, financial disclosure or dataset. Verify the source itself, its publication date, observation period, scope, units and implementation status. Record material claims with a pinpoint and qualification in the article's claim ledger. A successful URL request does not validate a claim. Retain dated access/source evidence privately in `.cache` or the task evidence directory; public downloads contain selected claims and visible sources, not operational records or raw third-party documents.

## Prepare an initial article

Use the native JSON manuscripts under `src/personal/editorial/data/articles`. Every article needs a real business decision, a direct opening, honest evidence boundary, primary links beside material claims, original analysis, a declared comparison, source-linked FAQs, a decision checklist and update triggers. The publication date is a prepared release date until delivery; adjust it if the actual initial release occurs later. Keep authorship and biography truthful.

Add the commissioned record to `library.json`, the matching summary to the catalog, a source-backed reader guide with actual section targets, a reading-path entry and relevant related-article links. Register the existing reader presentation and a credited artwork assignment; add a distinct share image. Preserve historical articles, restoration/revision receipts and assignments.

After factual and editorial review, record the initial receipt:

```sh
npm run texas:initial -- --slug SLUG --reason 'Explain the completed factual review and decision value.' --evidence https://primary.example/actual-source
```

The command records the actual manuscript hash and an explicit initial-review note. It verifies identity, reading time and citation targets; it does not certify source truth or publish the article. An existing initial receipt cannot be replaced with this command.

## Revise an established article

Read the actual new evidence and prior accepted text before editing. Change only claims or analysis that the new evidence affects. Retain the original `date`, slug, canonical URL, useful section targets and evidence needed to understand prior observations. Set `dateModified` for an actual material content update; a routine unchanged source check is not a new edition.

Update the relevant claim entries, source dates, qualifications and update triggers. Recalculate any affected comparison. Synchronize catalog and guide fields; keep the answer in visible prose and machine projections identical. Record the reviewed revision:

```sh
npm run texas:receipt -- --slug SLUG --reason 'Describe the new finding, affected decision and correction.' --evidence https://primary.example/actual-updated-source
```

The original hash remains intact. Each revision points to the prior hash and carries a reason, modified date and primary evidence. The command rejects a changed publication identity, unrelated evidence or a manufactured refresh with no manuscript change. It is a review record, not proof that the source supports every sentence. Read the actual diff and claims before accepting it.

## Verify the integrated edition

Generate the selected public projection and check that it matches the reviewed library:

The manifest's `bundlePath` selects the eighteen-article October 13 edition. The frozen twelve-article October 12 download remains available at its established URL. New edition paths must stay inside `public/research` and use JSON; choose a new edition rather than silently replacing a previously linked download. Source checks retain their actual individual dates even when the prepared release date advances.

```sh
npm run texas:bundle
npm run texas:check
node tools/verify-article-quality.mjs
node --experimental-strip-types --test --test-concurrency=2 tests/texas-editorial.test.ts tests/article-quality.test.ts tests/reading-topics.test.ts tests/reading-navigation.test.ts tests/search-metadata.test.ts tests/search-sitemap.test.ts tests/search-feed.test.ts tests/search-discovery.test.ts
npm run build
node --experimental-strip-types tools/verify-release.mjs
node --experimental-strip-types tools/verify-search.mjs
```

The local Node22 release and search commands need the type-stripping flag; configured Node24 CI runs the repository's normal release and search gates. Use the exact commands supported by the checkout. Broaden testing only for a new failure or a changed boundary.

Inspect each new or materially changed page on desktop and phone. Check the opening, comparison tables, source/FAQ ending, guide targets, return context, share image and readable static HTML. Verify any tested behavior in the actual rendered result. Correct visible defects before delivery; passing a build is an intermediate state.

Search hygiene comes from precise titles, distinct questions, source-backed answers, truthful Person/Article/CollectionPage identity, canonical URLs and linked reading paths. The existing static renderer creates sitemap, feed and machine projections from the same records. Do not add keyword stuffing, unsupported schema claims or unseen answers. No format guarantees Google indexing, rankings or citation by an AI service.

## Release and maintain the record

Prepare a concrete PR from the isolated branch with problem, resulting reader behavior, source cutoff, actual checks and material limitations. Attach it to the owning chat. Verify its exact head's required checks and preview. Obtain missing authorization for the exact edition; reuse an existing approval for that edition. Approval of one edition is not indefinite publishing permission.

After an authorized merge, verify the merged commit in READY production for the existing Vercel project and `sulayman-bowles.dev`. Read the canonical hub and affected article URLs, checking status, content, metadata, source download and discovery. A preview, push or successful CI is not production publication. If the runtime blocks an approved merge because approval is required while approvals are disabled, retain the approved scope and ask the human to perform the Merge action; do not route around the block.

Record result, reason, evidence and the next unresolved boundary in the source-owned work record. Keep editorial review dates and triggers current after research. No watcher or automation runs from this document. A future recurring task needs an explicitly authorized cadence, scope, host and notification policy.

After verified publication, retain a dated Search Console page/query baseline and landing-page analytics baseline using the site's established authorized measurement process. Compare equivalent reporting windows and separate brand queries, new-page lag and observation completeness. Treat relevant discovery, useful reading, repeat visits and attributable inquiries as outcomes to measure. Article count, source count, schema validation and optional machine-readable files are production evidence, not authority-growth measurements.
