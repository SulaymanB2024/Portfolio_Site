# Article art direction — October 5, 2026

All 29 articles retain the site's ink-and-paper palette and their original generative artwork. Their composition now follows the material: essay, financial ledger, capacity model, ownership survey, technical notebook, verified search, or project case study. The existing manuscripts, sources, publication dates, and catalogue are unchanged by this pass.

## Presentation

- Essays have larger openings and more open chapter spacing.
- Financial pieces put the artwork beside the headline, move contents to the right, and use label/value ledgers for opening figures.
- Capacity articles emphasize the first reference value while retaining its basis and caveats.
- Ownership surveys use compact artwork and horizontal evidence summaries.
- Technical articles use smaller covers, numbered chapters, and opening facts within the existing scope disclosure.
- The puzzle article separates arithmetic/search stages from its reconstructed move schedule.
- Project articles use a larger cover composition.

Desktop headline breaks are explicitly curated per article. Their text must match the authored title exactly; a changed title falls back to natural wrapping. Phone and print layouts use natural wrapping.

## Evidence diagrams

Seventeen lightweight HTML/SVG figures appear beside the sections that explain them. They include the 25-company software cohort, an Austin ownership chain, the puzzle's twelve recorded clues, crawler state transitions, URL relationships, evidence lineage, public-data projections, and migration routes. Table-based values come directly from the current article records. The initial public HTML uses the same figure component as the interactive reader.

These figures preserve the distinctions in the manuscripts. Ownership is not a sponsor-return calculation; brand counts are not market share; duplicate hypotheses are not publisher instructions; the puzzle's last recorded clue is separate from its 54-move path. No puzzle board coordinates or investment returns were invented. Conceptual diagrams identify their scope in captions.

Foreground SVG marks distinguish cohort categories without printed backgrounds. The mobile puzzle timeline scrolls within a focusable region, has a text alternative, and retains the full source table. No additional graphics dependency, canvas, animation loop, or request is introduced.

## Verification

| Command or check | Result |
| --- | --- |
| `node --experimental-strip-types --test tests/article-quality.test.ts tests/reading-navigation.test.ts tests/search-metadata.test.ts tests/research-figures.test.ts` | 26 passed |
| `node tools/test-article-opening.mjs` | 9 passed |
| `npm run build` | Passed; 42 indexable pages and discovery generated |
| `npm run verify:release` | Passed; 42 canonical documents, 69 legacy redirects, 29 feed entries, 292 source citations |
| `node tools/verify-article-quality.mjs` | Passed; accepted article language and evidence records retained |
| `node tools/verify-restored-articles.mjs` | Passed; original recoveries and assets retained |
| Entry SHA-256 guards | All 29 article JSON files, catalogue, artwork component, and test runner unchanged |
| `git diff --check` | Passed |

The existing in-app preview was checked on every article at 1280×900, 900×900, and 390×844: 87 route/viewport DOM checks without page overflow. The desktop pass also checked duplicate element IDs on all 29 pages. Representative covers and evidence diagrams were visually inspected in light and dark palettes. The final cohort and phone timeline were inspected again after their last edits. Print behavior was checked in source and render assertions, not by generating a PDF.

The machine-readable receipt, logs, and browser evidence are in `.cache/article-distinction-20261005/`. This pass is local; it does not commit, push, or publish the shared checkout.
