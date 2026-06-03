# Homepage Roman Toga Reveal Design

Date: 2026-06-03
Status: Draft for user review
Scope: Homepage hero identity, homepage navigation density, and faint brush-revealed Roman toga diagram treatment.

## Objective

The homepage should make one controlled identity statement instead of repeating the full name three times above the fold. The Roman toga diagram becomes the central visual object, faintly visible at rest and revealed by the existing brush/cursor language. Navigation should stop reading like a full sitemap in the top-right corner.

## Current Problems

- The homepage currently shows the full name in three places above the fold: fixed top-left brand, central animated SVG text, and lower-left hero h1.
- The top-right homepage nav exposes eight visible targets plus the sound control, which makes the first viewport feel busy and decision-heavy.
- The existing brush/ink trail is atmospheric only. It does not reveal a meaningful object, so it does not carry enough conceptual weight for the homepage.

## Design Decision

Use the Roman toga diagram as the central visual artifact and reduce the homepage to one full-name lockup.

The intended hierarchy:

1. Top-left fixed brand: compact mark only, `S. BOWLES`.
2. Center field: faint Roman toga diagram wire treatment, revealed by brush movement.
3. Lower-left hero copy: the only full visible `Sulayman Bowles` text instance.
4. Top-right nav: three primary choices plus a compact index.

## Asset Source

Primary asset:

- Source page: `https://commons.wikimedia.org/wiki/File:Roman_toga_diagram.svg`
- Local source file: `public/art/roman-toga/roman-toga-diagram.svg`
- Metadata file: `public/art/roman-toga/meta.json`
- License handling: Wikimedia Commons lists the diagram as public domain, released by LadyofHats. The local metadata file must preserve the source URL, author, license status, and retrieval date.

The implementation should use the SVG directly instead of rasterizing it unless browser rendering or masking makes raster layers necessary. If a processed version is created, preserve the untouched original as `roman-toga-diagram.svg` and name derivatives clearly.

Allowed derivatives:

- `public/art/roman-toga/roman-toga-lines.svg`: cleaned stroke-only version if the downloaded SVG has fills or unwanted labels.
- `public/art/roman-toga/roman-toga-mask.svg`: simplified silhouette mask if the reveal needs a bounded alpha shape.

## Homepage Hero

Replace the current central animated name SVG with a `RomanTogaReveal` component.

Placement:

- Desktop: centered slightly above the visual midpoint, with a fixed responsive height of `min(46vh, 520px)` and a minimum height of `340px`.
- Mobile: centered between the compact header and lower hero copy, with a fixed responsive height of `min(34vh, 260px)` and a minimum height of `190px`.
- The diagram must not overlap the lower-left h1, hero CTAs, or top navigation.

Visual state at rest:

- The toga diagram is visible before interaction, but faint.
- Suggested rest opacity: `0.08` to `0.14` on light canvas.
- Lines should use `currentColor` or `var(--color-ink)` with low opacity.
- The object should feel like a study drawing or technical plate, not a decorative sticker.

Reveal state:

- Pointer or brush movement reveals a stronger local layer along the cursor path.
- Suggested revealed opacity: `0.30` to `0.48`.
- Reveal should decay gradually after movement, matching the existing ink trail language.
- The reveal area should be soft-edged, not a hard circular flashlight.
- No sound should be added to the reveal.

Reduced motion:

- Do not animate reveal decay for `prefers-reduced-motion`.
- Show a static faint diagram at rest opacity plus a slightly stronger central detail layer, with no cursor-following mask.

Mobile:

- Use the static faint diagram on mobile.
- Do not require dragging to understand the hero.

## Identity Copy

Only one full visible name should appear in the first viewport.

Hero h1:

- Keep: `Sulayman Bowles`
- This is the primary h1 and the only full-name lockup in the visual first viewport.

Top-left brand:

- Replace the full `Sulayman Bowles` text with a compact mark.
- Label: `S. BOWLES`
- Remove the smaller discipline line from the fixed homepage brand.

Global identity line:

- Use: `Technical SEO, Atlas, and finance research.`

Central SVG text:

- Remove the visible `SULAYMAN` and `BOWLES` central animated name treatment.
- Do not hide it visually while leaving it as semantic heading text. If any decorative SVG remains, mark it `aria-hidden="true"`.

## Homepage Navigation

Desktop top-right nav should expose only primary user choices:

- `WORK` -> `/#selected-works`
- `METHOD` -> `/method`
- `CONTACT` -> `/#contact`

Secondary pages stay available through a compact index pattern:

- Control: `INDEX +`
- Revealed links: `Atlas`, `Research`, `About`, `Resume`, `AI Info`
- The index can be a small `<details>` menu, matching the existing mobile menu pattern.

Rationale:

- `Atlas` and `Research` already have large selected-work entries.
- `Resume` and `AI Info` are utility/trust pages, not first-choice homepage actions.
- `About` is useful but not more important than proof of work or contact intent.

Mobile nav:

- Keep a menu pattern, but order primary links first.
- Recommended order: `Work`, `Method`, `Contact`, then `Atlas`, `Research`, `About`, `Resume`, `AI Info`.

Internal pages:

- This spec only changes homepage navigation.
- `InternalHeader` keeps its current broader navigation in this pass.

## Component Contract

Create `src/components/RomanTogaReveal.tsx`.

Props:

- `className?: string`
- `assetHref?: string`
- `disabled?: boolean`
- `restOpacity?: number`
- `revealOpacity?: number`

Responsibilities:

- Render the toga SVG as a decorative visual object.
- Track pointer movement inside its hero region.
- Maintain a reveal trail or mask that decays over time.
- Respect `prefers-reduced-motion`.
- Avoid layout shifts after asset load by reserving stable dimensions.
- Keep interaction pointer-events passive so links and nav remain usable.

Implementation options:

- Preferred: SVG `<mask>` or CSS `mask-image` over duplicate SVG layers.
- Acceptable: Canvas mask over an SVG/image layer if SVG masking becomes brittle.
- Avoid: WebGL or Three.js for this feature. It is too heavy for a 2D line reveal.

## Accessibility

- The toga diagram is decorative and must be `aria-hidden="true"`.
- The homepage must retain exactly one visible and semantic h1 for `Sulayman Bowles`.
- The compact brand link must use `aria-label="Home - Sulayman Bowles"`.
- The `INDEX +` control must be keyboard-accessible and expose links as real anchors.
- The reveal interaction must not be required to access content or navigation.

## Performance

- The untouched SVG should be committed as downloaded. Any optimized derivative must be a separate file, and license-relevant metadata must stay in `meta.json`.
- Avoid animation loops when the reveal is idle.
- Stop reveal animation when the hero is out of view.
- Keep the component lightweight enough for the homepage first paint.

## File Changes In Implementation

Expected files:

- `public/art/roman-toga/roman-toga-diagram.svg`
- `public/art/roman-toga/meta.json`
- `src/components/RomanTogaReveal.tsx`
- `src/App.tsx`

Allowed derivative files:

- `public/art/roman-toga/roman-toga-lines.svg`
- `public/art/roman-toga/roman-toga-mask.svg`
- `src/index.css`

Do not change:

- Route structure.
- SEO route paths.
- Market article content.
- Proof/download inventory.
- Internal page layouts beyond any import typing or shared component impact required by the homepage.

## Acceptance Criteria

Visual:

- Desktop first viewport shows only one full visible `Sulayman Bowles` lockup.
- The central visual is the Roman toga diagram, not the former animated name SVG.
- The diagram is faintly visible without interaction.
- Brush movement reveals the diagram locally and softly.
- Top-right desktop nav no longer presents more than four visible controls before interaction.
- Mobile first viewport has no text overlap and no oversized nav list exposed by default.

Behavior:

- `WORK`, `METHOD`, and `CONTACT` links work from the homepage.
- Secondary links remain reachable through mobile menu, footer, selected work, or `INDEX +`.
- Reduced-motion users get a stable, non-animated diagram.
- Keyboard users can operate the nav and any `INDEX +` control.

Technical:

- `npm run lint` passes.
- `npm run build` passes.
- Playwright desktop screenshot at `1440x1000` confirms the first viewport hierarchy.
- Playwright mobile screenshot at `390x844` confirms no overlap and no hidden primary CTA.
- A DOM/accessibility check confirms one semantic h1 on the homepage and a usable accessible label for the compact brand.

## Non-Goals

- Do not redesign the entire homepage.
- Do not simplify every internal page header in this pass.
- Do not introduce a 3D statue model.
- Do not add new routes.
- Do not convert the homepage into a landing-page explainer.
