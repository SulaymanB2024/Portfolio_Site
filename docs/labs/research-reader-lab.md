# Research reader lab

Date: July 30, 2026

## Scope and source of truth

This lab improves the shared long-form research reader without changing article claims, source records, publication metadata, canonical routes, or the publication index. The implementation is deliberately limited to:

- the shared reader shell and navigation;
- the two Markdown renderers used by custom research pages;
- reader-scoped presentation and print CSS.

The representative surfaces were:

1. Generic financial reader: `/research/financial-systems/what-happens-when-an-index-decides-a-company-matters`
2. Custom AI reader: `/research/ai-systems/the-first-ai-managers`
3. Custom technical reader: `/viralbench-codex-agent-harness`

## Acceptance evidence

| Reader contract | Acceptance threshold | Result |
| --- | --- | --- |
| Reading continuity | Every reader exposes a skip target, current-section URL copy, source-ledger shortcut when a ledger exists, and print action in the active desktop or mobile controls | Pass |
| Mobile contents | At 390 × 844, the contents panel fits within a 772 px maximum height, has no horizontal overflow, supports arrow-key movement, closes on Escape, and restores focus to its summary after source or section navigation | Pass |
| Citation receipts | Citations link to exact source IDs, move focus to the receipt, and visibly mark the reached source | Pass; the AI reader exposed 25 citations and 18 source rows, and its first citation rendered at 26.4 × 26.4 px |
| Note round-trip | Every rendered footnote reference has a backlink, including repeated references to one note | Pass; the ViralBench reader exposed 11 references and 11 backlinks across 10 notes |
| Link trust | External Markdown links identify new-tab behavior in their accessible name and use `target="_blank"` with `rel="noreferrer"` | Pass |
| Table semantics | Markdown tables expose column headers, a row header, per-cell mobile labels, and an explicit table label | Pass; the ViralBench reader exposed 3 responsive tables |
| Conclusion framing | The existing synthesis is followed by the existing evidence boundary and currency/cutoff note when configured | Pass; the generic financial reader rendered two distinct evidence-status cards |
| Print continuity | Navigation chrome is removed, closed details content is available, non-Texas responsive tables return to native table layout, Texas wide evidence tables retain the production stacked layout, source/note URLs are printed, and content does not overflow horizontally | Pass under Chromium print-media emulation |
| Claim integrity | No article body, source record, model, or publication-index file changes | Pass |

## What changed

### Reading and navigation

- Added a keyboard-reachable “Skip to article” link and a focusable article target.
- Added current-section copy behavior rather than copying an ambiguous page-only URL.
- Added a direct source-ledger shortcut beside copy and print actions.
- Added Home/End and directional-key navigation to the reading map and contents rails.
- Made the mobile contents panel close on Escape and restore focus after navigation.
- Added a visible open/closed affordance and kept all actions available inside the mobile panel.

### Evidence and links

- Added exact focus/target treatment for citations, notes, backlinks, and source receipts.
- Added repeated-footnote reference IDs and one backlink per reference in both Markdown renderers.
- Added an accessible source-ledger description to citation links.
- Added explicit external-link behavior, accessible labels, and a visual external-link cue.
- Preserved the existing evidence boundary and evidence-currency text, but paired them at the conclusion so the limits travel with the synthesis.

### Tables and print

- Gave static Markdown tables the same semantic row/column structure as React-rendered tables.
- Added mobile cell labels and explicit table labels; the shared renderers also emit a named region around scrollable tables.
- Restored stacked mobile tables to native table display in print, except the Texas reader's wide evidence tables, which retain the production stacked print safeguard.
- Expanded closed details content for print while hiding interactive filters and reader chrome.
- Added print-safe typography, break rules, compact hero/metric treatment, source URLs, note URLs, and download destinations.

## Reader questions

### Does the reader make evidence provenance visible?

Yes, within the evidence already present. Source-count metadata remains in the hero, a direct ledger shortcut is available from reader utilities, citations land on an exact source receipt, and the conclusion carries the existing boundary and cutoff/currency statements. The lab does not add source-quality ratings or infer provenance that the article data does not contain.

### Can a reader skim first and investigate later?

Yes. The reading map, current-section marker, mobile contents status, previous/next narrative links, and section-specific copy action support skimming. Exact citation targets, notes, repeated-reference backlinks, source URLs, and printed receipts support deeper investigation without losing the reading position.

### Does the experience hold up on mobile and in print?

The 390 × 844 browser check had no horizontal overflow. The contents panel stayed bounded, keyboard navigation worked, and closing or following a link returned focus to the summary. In print emulation, navigation chrome disappeared, source URLs became visible text, closed details content remained available, the three representative non-Texas tables used native table/header/row/cell display, and the Texas reader's wide evidence tables stayed stacked inside the printable article surface.

### Can readers tell where links go?

Internal citations and notes identify their destination and preserve a return path. External Markdown links announce that they open a new tab, use `noreferrer`, and carry a small outbound-link cue on screen. Printed source, note, and resource links include their destination URL.

### What remains unknown?

- The source records and article claims were not independently refreshed in this lab.
- Generic source metadata does not yet classify primary versus secondary evidence, record retrieval methods, or attach a limitation field to each source.
- Browser validation did not include a dedicated screen-reader lab, non-Chromium browser matrix, or physical paper/PDF pagination review.
- Clipboard writes can still be rejected by browser permissions; the live region reports that failure without claiming success.
- Print pagination can vary by browser, paper size, and printer driver even when the print-media layout is correct.

## Validation

The final implementation was checked with:

- `git diff --check`
- `npm run lint`
- `npm run audit:style`
- `npm run verify:articles`
- `npm run build`
- `npm run verify:seo`
- `npm run verify:generated`
- a targeted `tsx` Markdown smoke check covering repeated notes, backlinks, external-link attributes, row headers, and mobile table labels
- browser checks at 1280 px and 390 × 844 across the three representative routes
- Chromium print-media emulation for generic source receipts, ViralBench native tables, Texas stacked evidence tables, closed details, and note receipts

The first SEO check was intentionally run before the production build and failed because `dist/index.html` did not exist. After `npm run build`, both `verify:seo` and `verify:generated` passed. This was a validation-order prerequisite, not a reader regression.

No full test-suite or CI simulation was run: the edited surfaces are the shared reader, Markdown conversion, and scoped CSS, and the targeted article, SEO, generated-artifact, build, semantic smoke, and browser checks cover those contracts directly.

## Integration recommendation

Cherry-pick the lab as one commit because the shell, Markdown output, and CSS selectors form one reader contract. The integrating owner should inspect conflicts carefully if another lane changed `ArticleLayout.tsx`, `article-reader.css`, or either Markdown renderer. No push, deployment, publication, or release-worktree mutation is part of this lab.
