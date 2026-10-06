# Article quality pass — October 5, 2026

All 29 published articles received substantive manuscript edits and individually written search titles and descriptions. The pass reduced repeated framing, shortened headings, clarified mechanisms, and kept observations, estimates, proposed work, and unresolved facts distinct. The main prose total fell from 49,041 to 42,916 words; this is a descriptive result, not a target applied to every article.

The visible titles and artwork remain the site’s editorial presentation. Search and social metadata now use the reviewed `seoTitle` and `seoDescription` fields; schema headlines retain the visible title. The reader, writing cards, initial documents, and feed share the same article subtitles. The previous deck overrides and a ViralBench-only runtime summary were removed. Its proposed status is stated directly in the manuscript delivered to both readers and crawlers.

Every article carries the substantive editorial revision date October 5. Original publication dates, source dates, and research verification cutoffs remain unchanged. These edits do not imply newly refreshed financial data, operating capacity, or provider policies. Reading estimates use 220 words per minute for the main manuscript, including tables, code, and captions; separate source ledgers, expandable registries, and downloadable reports are excluded.

The existing next-reading section now has two curated subject links for each article. Those same canonical links appear in the initial document. Updating the whole catalog on one date exposed an Atom ordering tie; publication date now breaks equal revision dates before canonical URL.

One factual correction was made: RFC 9309 requires case-insensitive product-token group matching, while path matching should be case sensitive. The crawler-policy opening links to [the primary protocol](https://www.rfc-editor.org/rfc/rfc9309.html#section-2.2.1). Provider tables and their original verification dates were retained.

## Evidence and verification

`article-quality-revisions.json` binds each current manuscript to its pre-pass snapshot in `article-quality-baselines/`. The guards require unchanged identity, publication and verification dates, research boundaries, citations, distinct quantities within each prose unit, source ledgers, tables, figures, code, section targets, resources, and rich-record evidence. The protocol correction has one explicit citation exception. HTML revisions also preserve tags and attributes, complete tables and figures, and the original source ledger.

`article-restoration.json` remains the untouched recovery contract. `article-originals/` preserves the recovered manuscripts before editorial revision, and `article-revisions.json` records the 24 structured recoveries separately from the current all-article pass. The four retained reviewed-source snapshots and original standalone HTML remain bound to their original recovery hashes. All 130 original figure and download assets are preserved.

Read-only verification:

```sh
node tools/verify-article-quality.mjs
node tools/verify-restored-articles.mjs
node tools/reader-figure-assets.mjs --verify-only
```

Focused tests and release checks:

```sh
node --experimental-strip-types --test tests/article-quality.test.ts tests/article-revisions.test.ts tests/article-restoration.test.ts tests/search-metadata.test.ts tests/search-feed.test.ts tests/content-curation.test.ts tests/reading-navigation.test.ts tests/research-figures.test.ts
node tools/test-article-opening.mjs
npm run build
npm run verify:release
```

The opening tests compile JSX with the existing Vite installation into a task-owned cache, then render the shared components. No dependency change is required. The quality and restoration verifiers write no files. The release gate checks generated titles, descriptions, visible/schema dates, canonical routes, citation targets, and discovery output.

The 42 focused tests and three opening/render tests passed, followed by the production build and release gate. Live checks covered all 29 article routes and their metadata, plus six representative phone layouts. Representative screenshots were inspected on desktop and phone in light and dark modes; section navigation closed the phone contents panel and placed the requested heading below it. The user's original article tab was reloaded after its development session became stale and verified with the final manuscript.

This pass changes local source and the existing preview. It does not publish the site.
