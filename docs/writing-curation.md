# Writing curation — October 5, 2026

The Writing page now leads with **The Shopkeeper in the Machine** rather than chronological catalogue order. Seven selected essays and investigations receive the main visual treatment. Nine further articles use compact artwork rows; eight implementation notes use a quiet text list. Search still covers every published piece and preserves filters and the selected article when returning from a reader.

The lead cover, paired selections, and full-width research rows have different proportions. The Shopkeeper reader has a large four-line title and artwork; the Texas ownership investigation has a full-width headline and small artwork alongside its byline; ViralBench has a compact artwork column and sans-serif heading. All retain the existing palette and artwork.

Reading-time labels are removed from the Writing index, article covers, related-reading links, and Home's writing section. Historical estimates remain in source records for archive integrity; they are not presented as a reader-facing metric.

The five articles explicitly rejected by the user are withdrawn from the published catalogue: canonicalization, internal links, robots.txt, structured data, and audit findings. They no longer appear in discovery, related reading, feeds, sitemaps, or generated canonical documents. Their source JSON and reviewed evidence remain intact. Legacy URLs resolve directly to the relevant Atlas explanation; obsolete section targets do not transfer to unrelated headings.

## Verification

- 34 focused tests passed for curation, retained evidence, revision guards, search, feed, metadata, and reading navigation.
- Nine component-render tests passed, including exact title text and identical evidence figures in initial HTML and the interactive reader.
- Production build passed, generating 37 canonical pages. The release gate passed with 24 feed entries; every retired URL has a direct redirect before filesystem handling.
- All seven selected article covers were checked at tablet and phone widths, without document or headline overflow. The index was checked at desktop and phone widths, with no reading-time labels or missing entries.
- Search → article → back retained the query and selection. All five former article bookmarks opened Atlas; the findings bookmark was visibly positioned on its matching section.
- Representative covers, index layouts, and the compact notes list were visually inspected. The index was inspected in both light and dark palettes.
- All 29 manuscript SHA-256 hashes remain unchanged. The read-only language and original-source verification commands passed.

Logs, entry snapshots, screenshots, and a receipt are in `.cache/writing-curation-20261005/`. This is a local implementation, with no commit, push, or publication.
