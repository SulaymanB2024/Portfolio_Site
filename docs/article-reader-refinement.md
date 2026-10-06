# Article reader and prose refinement

The shared reader keeps the site's paper, serif type, and living ink artwork, with a more compact cover, consistent reading measure, shorter section rhythm, and wider evidence figures on large screens. On phones, artwork takes less vertical space; contents remain sticky, and tables scroll within keyboard-focusable regions. Research figures link to their original full-size files.

Openings and scope notes now use a shared component in the interactive and public-document readers. The five revised essays integrate their thesis into the opening instead of displaying it twice. Full scope and assumptions remain available in a native disclosure; printing expands it. The AI Megawatt conversion diagram appears beside the conversion method, before its formula table. Its metrics accompany the facility calculation.

| Revised essay | Prose words before → after | Reduction |
| --- | ---: | ---: |
| AI Megawatt | 2,200 → 1,519 | 31% |
| Airline loyalty financing | 2,026 → 1,494 | 26% |
| Online returns | 1,781 → 1,276 | 28% |
| Waymo hardware financing | 2,198 → 1,514 | 31% |
| Hardware capital stacks | 2,567 → 1,686 | 34% |

Counts include subtitle, thesis, evidence boundary, section titles, paragraphs, bullets, and conclusion; they exclude unchanged table/figure/source text. Reading estimates are recalculated at 220 words per minute including displayed prose, tables, and captions, excluding source ledgers and downloadable reports. The original research dates and cutoffs remain unchanged; this is an editorial revision, not a source refresh.

Research tables, figures, code examples, source ledgers, downloads, metrics, evidence boundaries, identities, and chapter targets remain unchanged. Figures may move without changing their contents. Frozen original source-field hashes, separate edited-file hashes, and protected evidence hashes are recorded in `article-restoration.json` and `article-revisions.json`. The read-only restoration verifier checks both states, all 130 retained assets, and the four previously reviewed manuscripts. Literal guards supplement the semantic readback review; they do not establish the truth of research claims.

## Verification

- `node --experimental-strip-types --test tests/article-revisions.test.ts tests/article-restoration.test.ts tests/content-curation.test.ts tests/editorial-links.test.ts tests/search-metadata.test.ts tests/search-feed.test.ts tests/reader-position.test.ts tests/route-scroll.test.ts tests/route-preparation.test.ts tests/route-warmup.test.ts` — 48 passed.
- `npm run build` — type checking, client build, public-document build; 42 canonical documents generated.
- `npm run verify:release` — 42 canonical documents, 69 direct legacy redirects, 29 feed entries, source links, evidence targets, and local assets passed.
- `node tools/verify-restored-articles.mjs` — original recoveries, five explicit editorial revisions, unchanged research evidence and assets passed; no writes.
- Revision guards — all five manuscripts passed required source/download retention; AI numeric bases and scope qualifications passed.
- Production readback — every current opening and section paragraph in the five revised articles appears in the generated public document.
- Browser — all 29 readers opened at 1280×720 with no duplicate prose IDs or page overflow. Seven representative readers passed at 390×844, including the revised essays, recovered HTML, and Markdown essay. AI Megawatt reviewed in light/dark appearance; native source S8 preview opened, scope disclosure expanded, phone chapter arrival measured 96px, and tables remained keyboard-focusable scroll regions. Figure order and full-size targets verified.

No dependency changes, push, or publication. Other chats' Home, Writing index, Work, About, Contact, and Résumé changes are preserved.
