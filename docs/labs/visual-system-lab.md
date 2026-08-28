# Visual System Lab

## Scope

This lane owns the shared design primitives, About, Resume, Atlas, and the
route-scoped additions in `src/index.css`. It does not change route claims,
navigation, SEO mirrors, article-reader CSS, publishing state, or other pages.

## Baseline

- The site already has a strong native vocabulary: Cormorant Garamond at
  identity scale, Inter for interface copy, ink/canvas contrast, fine rules,
  calibration marks, a wireframe grid, and restrained motion.
- About carries the dark cinematic language, but its first viewport gives the
  headline a narrow measure and later sections fall back to repeated cards.
- Resume is legible and print-oriented, but boxed content groups and a very
  loose masthead make the evidence hierarchy slower to scan than it needs to
  be.
- Atlas has the clearest art direction, but it does not opt into the shared
  `site-page` contrast safeguards and its mobile hero leaves unnecessary dead
  space before the sample package.
- The primitive layer exposes useful shells, but its spacing, typography, and
  interaction states are not yet one visibly coherent editorial system.

## Direction

The implementation uses an **evidence ledger** rather than a generic card
system:

- large, controlled serif identity;
- compact sans-serif metadata;
- open lists separated by rules;
- numbered section rails;
- repeated calibration corners used only at structural boundaries;
- a consistent responsive gutter and reading measure;
- motion limited to short opacity/position changes that yield to reduced-motion
  preferences.

## Measurable acceptance

1. About, Resume, and Atlas share the same route-scoped visual-system tokens and
   audited light/dark contrast behavior.
2. At 390px mobile, 834px tablet, and 1440px desktop, the owned routes have no
   horizontal page overflow, clipped H1 text, or overlapping primary actions.
3. Essential small text resolves to at least the existing audited contrast
   floor (64% ink on light, 66% canvas on dark); decorative marks remain
   explicitly hidden from accessibility APIs.
4. About current-work and operating-principle content reads as open indexed
   editorial rows rather than a generic card grid.
5. Resume sections expose a stable number/title/content rail, with action
   controls at least 44px tall and the same content and heading order as the
   baseline.
6. Atlas retains its artwork, section order, evidence tables, links, and motion
   model while adopting the contrast floor and a tighter mobile handoff from
   hero to sample package.
7. No new dependency, image, font, runtime listener, data fetch, or eager media
   load is added.
8. Reduced-motion behavior remains authoritative; all new transitions are CSS
   only and become effectively instantaneous under the existing global
   reduced-motion rule.
9. `git diff --check`, `npm run audit:style`, and `npm run lint` pass. A targeted
   production build and browser route QA cover the crossed rendering boundary.

## Q/A ledger

### Visual identity

**Pass.** The owned routes now share one evidence-led editorial grammar without
flattening their individual character. About remains the dark cinematic field,
Resume remains a pale working document, and Atlas keeps its celestial map
artwork. Shared calibration marks, roman display type, compact metadata,
numbered section rails, and open ruled records bind them together. No gradient
glow, rounded-card system, decorative dashboard metric, or new brand motif was
introduced.

### Hierarchy

**Pass.** About’s desktop H1 resolves as four deliberate lines beside the
existing evidence map; the full intro and route actions remain in the opening
composition. Resume’s name, role statement, education, and actions form one
clear masthead, with the first numbered section visible at the bottom of the
1440px and 834px captures. About current work, About principles, and every
Resume section now use an explicit index/title/content hierarchy. All routes
retain exactly one H1, and browser QA found no duplicate IDs or unresolved
`aria-labelledby` references.

### Mobile and tablet

**Pass.** Browser checks at 390×844, 834×1112, and 1440×1000 found
`scrollWidth === clientWidth` on About, Resume, and Atlas. No H1 clipped or
overlapped another surface. Resume’s three mobile actions are each 48px tall
and all fit in the first 844px viewport. About’s tablet composition previews
the evidence map after the copy; Resume’s tablet composition previews
Education & focus; Atlas retains an artwork-led hero at all three sizes. The
Atlas mobile hero handoff was reduced from 118svh to 104svh before the sample
package.

### Contrast

**Pass.** Atlas now opts into the same `site-page-light` contrast safeguards as
the other owned routes. The audited essential-text mixtures calculate to
5.98:1 for 64% ink on canvas and 8.02:1 for 66% canvas on ink. Browser computed
style confirmed Atlas hero metadata resolves to the 64% light-page floor.
Decorative artwork, grid coordinates, and calibration marks remain explicitly
`aria-hidden` or pointer-only rather than being promoted to content.

### Performance

**Pass for the changed boundary.** The work adds no package, image, font,
listener, fetch, or eager asset. New behavior is CSS-only; existing
reduced-motion handling remains authoritative. The targeted production Vite
build transformed 518 modules successfully. Its emitted route chunks were
14.95 kB for About, 6.71 kB for Resume, and 43.72 kB for Atlas before gzip;
these are build outputs, not claims of improvement over a measured baseline.
The build wrote only to a temporary output directory.

### Unknowns

- Browser QA used the Codex in-app Chromium surface; Safari and Firefox were not
  separately exercised.
- Chromium print-media emulation confirmed the header/actions hide, the masthead
  collapses, the indexed grid remains bounded, and horizontal overflow stays
  absent. A physical printer and every paper-size pagination path were not
  tested.
- External Google Fonts were available during the captures. Font-failure
  fallback metrics were not separately screenshot-tested.

## Fidelity ledger

The repository baseline was the visual reference because no external concept
image was supplied. Baseline and final screenshots were captured from the same
local Vite server and inspected at native 1440×1000 desktop dimensions, with
additional 390×844 and 834×1112 captures. Temporary screenshot files were
reviewed directly and are not part of the repository.

| Comparison point | Baseline evidence | Final evidence |
| --- | --- | --- |
| Copy and route order | Existing About, Resume, and Atlas strings and section sequence | Visible copy and section sequence preserved; only a missing whitespace boundary inside the Atlas H1 DOM was corrected |
| Identity | Cormorant/Inter, ink/canvas, grid chrome, Atlas engraving | Same fonts, palette, chrome, map, and engraving; major display type standardized to controlled roman forms |
| Container model | About and Resume repeatedly returned to boxed card grids | Open ledger rows and indexed rails; no new card family |
| First viewport | About headline was narrow; Resume left large unstructured gaps; Atlas carried strong artwork | About balances headline/map, Resume exposes a document hierarchy and next-section preview, Atlas remains artwork-led |
| Responsive behavior | Mobile routes did not overflow, but Resume and Atlas left avoidable vertical slack | No overflow at three target widths; all Resume mobile actions fit; Atlas handoff shortened |
| Contrast | About and Resume used the shared floor; Atlas sat outside it | All three owned routes use the audited floor |
| Motion and assets | Existing Atlas scroll transforms and route artwork | Preserved; no new runtime animation or media |
| Semantics and controls | Existing H1/H2/H3 structure and link targets | One H1 per route, restored H3 semantics in About records, resolved labelled sections, 48px Resume actions |

The above-the-fold copy diff is clean: no visible label, CTA, claim, date, or
supporting sentence was added, removed, or renamed. The implementation was
faithfully verified against the repository’s established cinematic
artifact/evidence language; no fixable visual mismatch remains in the owned
desktop, tablet, or mobile surfaces.

## Validation

- `git diff --check` — passed; verifies patch whitespace and conflict-marker
  hygiene.
- `npm run audit:style` — passed; 0 hard-coded color utilities, 0 tight/negative
  tracking utilities, 0 viewport-scaled text utilities, 18 large-radius
  utilities within the budget of 26, 16 terminal-font utilities within the
  budget of 17, and the contrast safeguard present.
- `npm run lint` — passed (`tsc --noEmit`); verifies the new primitive API and
  route JSX types.
- `./node_modules/.bin/vite build --outDir
  /tmp/portfolio-visual-lab.LLWS81/dist --emptyOutDir` — passed; targeted
  production bundling for the changed React/CSS boundary.
- Browser route QA — passed on About, Resume, and Atlas at 390×844, 834×1112,
  and 1440×1000. Checked first viewports and representative ledger/status
  sections, route H1s, horizontal overflow, duplicate IDs, labelled-section
  targets, empty links, missing image alts, action sizes, and console
  errors/warnings.
- Chromium print-media emulation on Resume — passed; header and actions hidden,
  hero min-height collapsed to zero, indexed layout remained bounded, and
  horizontal overflow was absent.

The full `npm run build` static-route generator, the full test suite, and live
deployment checks were intentionally not run. The change is local visual
presentation only; the targeted Vite build covers compilation/bundling without
rewriting out-of-scope generated SEO/public files, and publication is outside
this lane.
