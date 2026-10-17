# Read-only editorial cross-review — revision 12

## Result

No actionable findings in the reviewed diff and supplied first-build captures. This is bounded review evidence, not an independent full release or browser-interaction certification.

Reviewed current changes to WritingIndex.tsx, TopicPage.tsx, ArticlePage.tsx and the new editorial-finish.css against d300c44edb3d232e6fa1b47bd0c675c82349a86d. Inspected all eight requested images: first-writing-desktop/phone, first-topic-desktop/phone, first-reader-desktop/phone, first-reader-ending-desktop/phone. Also read affected reading-guides/story-links cascade rules, StoryLink markup and the public renderer's ReadingPaths/TopicBody consumption.

## Findings and preservation evidence

- Phone Writing has a readable full-width headline/deck and a useful date/read-time/action column beside the retained artwork. Neither text nor artwork visibly clips in the supplied 390px capture. Desktop maintains the established illustrated lead.
- Topic’s desktop question rail and phone sequential flow are coherent. Source dates, introduction paragraphs, questions, article reasons and source-download destinations remain sourced from the same topic data. Wrapper additions preserve heading order and the existing links.
- TopicBody and ReadingPaths still default to noninteractive canonical URLs; public-mode question links remain canonical article paths with section anchors and no event handlers. New wrapper elements do not require window/history during public rendering. Existing focus-return lookup retains `.topic-readings h2 a` and `data-slug`.
- Writing’s discovery state, refs, Escape behavior, search/category logic and click destinations are unchanged. ArticlePage adds only a root class and stylesheet import; citation handling, route logic, utility actions and manuscript rendering remain intact.
- The phone reader keeps the complete title, subtitle, date/author and three utility actions. The compact ending uses full-width titles with wrapping deck beside each retained artwork, and visible metadata underneath. No material overlap/cutoff is visible in the supplied ending capture. Desktop ending remains visually unchanged.
- New editorial presentation rules are screen-scoped. Print rules only hide decorative directory ordinals and leave the new topic wrapper in normal block flow; the existing manuscript/reader print behavior remains. No renderer, artwork source, motion or article-data change appears in the reviewed diff.
- The change retains focus outlines from reading-guides and existing interactive elements. CSS changes do not add overlays or pointer-event suppression. Mobile fixed artwork columns are paired with minmax(0,1fr), and the <=370px continuation rule reduces the artwork column.

## Unverified limits / root acceptance

No browser, build, server, broad test suite, source mutation or nested helper used. Screenshots establish the shown 390px and desktop states only; this review does not independently verify live focus/keyboard history, search results, all canonical manuscripts, reader forms other than the supplied example, dark appearance, 320–370px layout, motion cadence, font-loading, browser print output or no-JavaScript rendered appearance. Root is already checking native interactions and all canonical families. Static public branching and print preservation above are source-based conclusions.

The newly introduced `editorial-finish.css` is untracked in this working tree and must be included in the eventual root delivery alongside its three imports (ordinary in-progress state; not a product defect).
