# Article figure presentation

Research figures now blend their source canvases into the site's paper in both
themes. Raster diagrams retain subdued category hues; inversion rotates those
hues back so red, green, and blue remain recognizable in dark mode. This is a
presentation change: source images, captions, citations, and research data remain
unchanged. Print output uses the normal light figures.

The three AI Megawatt charts use separately generated ink SVGs. Their data paths,
coordinates, labels, references, and clipping remain identical to the originals.
The plotting box's top and right spines are hidden. The five sensitivity curves
use distinct dash patterns, repeated in the legend. Original full-size figures
remain available through the image links.

On narrow screens, each figure has its own focusable horizontal scroll frame
and a 680 px minimum drawing width, instead of shrinking chart labels to a few
pixels. Desktop figures fit their column. The same frame is applied to the
recovered standalone toll-road manuscript without changing its archived HTML.

Regenerate derivatives with `node tools/reader-figure-assets.mjs`. Verify their
recorded hashes and exact expected output without writes with
`node tools/reader-figure-assets.mjs --verify-only`.

Validation on 2026-10-05:

- `node --experimental-strip-types --test tests/research-figures.test.ts tests/article-restoration.test.ts tests/article-revisions.test.ts`: 13 passing tests.
- `node tools/verify-restored-articles.mjs`: original evidence and all 130 original asset hashes preserved.
- `npm run build`: type check, client build, and 42 public documents generated.
- `node tools/verify-release.mjs`: search and release gates passed.
- In-app browser at `http://127.0.0.1:5196`: the capacity and sensitivity charts and a color-coded CoreWeave diagram inspected in light/dark desktop views; the utilization chart inspected in dark mode; capacity chart inspected at 390 × 844 in both themes. Mobile horizontal panning moved 330 px inside the frame without page overflow. All three derivative SVGs loaded; no console errors were reported in these checks.

Rendered screenshots and readbacks are under
`.cache/article-figure-style-20261005/`. This validates the shared figure styling
and representative charts; it is not a claim that every restored diagram's
original internal layout has been redesigned.
