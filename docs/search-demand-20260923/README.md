# September 23 research port

PR [#63](https://github.com/SulaymanB2024/Portfolio_Site/pull/63), frozen at `088e1e7621fa0636ceaa52b96d5beba3085bbe66`, contained 23 manuscripts missing from the October 16 main branch. This port publishes those records through the current native JSON catalog, reader, reading paths and generated canonical documents. It retains the existing 62 manuscripts and the newer application and SEO architecture.

`source-records.json` freezes the complete original records from the three TypeScript collections. `port.json` identifies the source commit, source blobs, collection hashes, original record hashes and each native destination. `source-ledger.json` retains every original source label, URL, order and verification date, with stable source IDs added for the current reader. `docs/article-publications.json` binds the native initial editions to their bytes.

All original titles, manuscript text, section IDs, tables, resources, evidence boundaries, publication dates and verification cutoffs are unchanged. The native wrapper adds canonical paths, empty alias lists, an edition date equal to the original publication date, stable source IDs and existing local artwork. Reading estimates use the current 220-word-per-minute calculation: the old seven-to-eleven-minute estimates become three minutes. The original estimates remain in the frozen records and port manifest.

The guide answers quote each article’s original thesis; guide tasks retain section titles and opening sentences. The eight crawler/Search Console readings extend the existing crawler-evidence path; the fifteen ownership and financing readings extend financial-systems. Existing authored sequences retain their order. Existing abstract artwork and its attribution are reused. No factual illustration, new source or new factual assertion was created.

This integration preserves historical research. It does not independently reverify the September sources or claim an October factual refresh. The original PR’s failed historical CI was a fixed-publication-count assertion; current native publication and discovery checks replace that obsolete architecture-specific assumption.

The restoration archive excludes an older, unverified `/markets/who-owns-us-toll-roads` candidate. That exclusion remains unchanged. The guard now distinguishes that historical path from PR #63’s `/research/financial-systems/who-owns-us-toll-roads`: sharing the slug requires a different canonical URL, no alias to the excluded URL and an intact native initial-publication receipt. Regression checks reject the historical path, an alias revival, missing or mismatched receipts, and changed article bytes.

Focused verification:

```sh
node --experimental-strip-types --test tests/search-demand-port.test.ts tests/article-quality.test.ts tests/article-restoration.test.ts tests/reading-topics.test.ts tests/content-curation.test.ts
node tools/verify-article-quality.mjs
node tools/verify-restored-articles.mjs
```

The root integration owner runs the application build, generated-document release gate and rendered inspection for the consolidated PR.

October 16 local results: all 30 focused tests passed. The article-quality verifier passed with 29 revised bodies and 56 initial editions; restoration verification passed with 25 recoveries, 24 source revisions, four reviewed-source archives and all 130 original assets unchanged. A direct comparison with frozen main `714f462bf460ce415d2d5c6b36e50d2e56d92211` confirmed that all 62 pre-existing manuscript files remain byte-for-byte unchanged. `git diff --check` passed for this port. Build, rendered inspection and external delivery remain with the root integration owner.
