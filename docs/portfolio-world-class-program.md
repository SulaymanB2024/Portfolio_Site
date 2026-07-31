# Portfolio World-Class Program

## Acceptance contract

### Source of truth

- Working surface: `/Users/sulaymanbowles/.codex/worktrees/37ee/Portfolio_Site`
- Git state: detached worktree at `c2f5ecac154b15e1cfe789cf6cc974f66483c130`
- Remote: `https://github.com/SulaymanB2024/Portfolio_Site.git`
- Current authority: the checked-out source and a fresh local production preview. Prior reports are context, not acceptance evidence.
- Existing work is dirty and must be preserved. Review threads are read-only; this root is the only writer until page contracts are accepted.
- Release authority: after local acceptance, the user explicitly authorized creating the release commit, pushing a release branch, generating and validating a Vercel preview, and—only if every preview gate passes—merging/promoting it to production with `dpl_H3yNyBHnZJb6HvRQwD4fwRRtLgWT` retained as the rollback target.

### Product standard

The finished site must feel like one authored public product across all 35 canonical routes, both intentional noindex routes, and the 404 state. It should preserve the existing large-serif identity, ink/canvas contrast, crosshair and grid chrome, evidence panels, and restrained motion while removing ornamental inconsistency, weak hierarchy, generic portfolio patterns, and synthetic copy.

At representative widths of 1440×1000, 820×1180, and 390×844:

1. Every route has a clear first-screen hierarchy, a legible reading path, and no unintended overflow, clipping, collision, empty slab, or obscured control.
2. Shared header, footer, navigation, article chrome, forms, evidence panels, tables, cards, link treatments, and motion states follow one token and interaction system.
3. A first-time visitor can answer within five seconds: who Sulayman is, what his strongest public proof is, and what action to take next.
4. Every CTA names its destination or outcome. Generic labels such as “Open project” are used only when they accurately describe the destination.
5. Public copy is terse, human, specific, and claim-calibrated. Repeated abstractions, filler labels, keyword exposition, templated takeaways, and circular “proof” language are removed.
6. Status terms follow the ladder: self-reported → implemented → publicly demonstrated → deployed → measured outcome. Dates distinguish publication, update, evidence cutoff, and provider verification.
7. Text, controls, focus, responsive reflow, reduced motion, target size, labels, errors, and reading order are usable without relying on screenshots alone. No claim of complete WCAG conformance is made without semantic and interaction evidence.
8. Cold first paint, hydrated state, menu/dialog states, keyboard focus, forms, tables, long articles, loading/fallback behavior, reduced motion, and 404 recovery remain coherent.
9. No P0 or P1 design/copy/accessibility finding remains. P2 findings are either resolved or explicitly accepted with a documented reason.
10. Local checks, commits, pushes, and production deployment remain distinct evidence states.

### Validation gates

- Current-run screenshots at matched desktop, intermediate, and mobile viewports.
- DOM/computed-style evidence for material spacing, contrast, clipping, focus, reduced-motion, and responsive claims.
- Route smoke for all canonical and noindex routes plus 404.
- Targeted interaction checks for navigation, forms, article contents, tables, expandable panels, and conversion links.
- `npm run lint`
- `npm run audit:style`
- `npm run build`
- `npm run verify:generated`
- `npm run verify:internal-links`
- `npm run verify:seo`
- Root review of every accepted diff and of the final rendered state.

### Definition of done

Done means the full route/state/device ledger passes; the copy and claim system is coherent in authored UI, metadata, schema, and static fallbacks; cross-reviewers have challenged the accepted changes; no required work remains; and temporary preview/browser state is cleaned up. A passing build alone is not completion.

### Stop and escalation conditions

- Stop a lane when it reaches its route boundary, encounters an unresolved fact/claim, or would need to edit a shared file.
- Escalate conflicting design or copy recommendations to the root; do not let reviewers overwrite one another.
- Stop after two no-material-progress cycles and return exact evidence.
- Do not publish or alter external state without explicit authorization.

## Ownership ledger

### Wave 1 — independent page audits

#### Lane A: Core journey and conversion

- Role: principal portfolio product designer and conversion director.
- Routes: `/`, `/work`, `/about`, `/resume`, `/method`, `/contact`, `/sitemap`, and 404.
- Shared states: desktop/mobile header, index menu, footer, forms, homepage work states, cold first paint.
- Files/sources: `src/App.tsx`, core page components, `InternalHeader`, `InternalFooter`, `AuditIntakeForm`, navigation/profile/work content, and corresponding route/static metadata.
- Exclusions: Atlas routes, research/markets article bodies, implementation, commit, push, deploy.

#### Lane B: Atlas product narrative

- Role: principal product-marketing designer and interaction director for technical products.
- Routes: `/atlas`, `/atlas/sample-crawl`, `/atlas/celestial-parallax`.
- Shared states: map/evidence/method/technical/final sections, sample tables, prototype scroll and reduced-motion states.
- Files/sources: Atlas page components, Atlas-specific components/content/assets, and corresponding route/schema/static metadata.
- Exclusions: general portfolio pages, research/markets articles, implementation, commit, push, deploy.

#### Lane C: Research and article reading system

- Role: editorial product designer and long-form information-architecture director.
- Routes: `/research`, `/markets`, all 23 article routes, and `/markets/archived-research-methodology`.
- Shared states: article hero, contents, tables, figures, source ledgers, downloads, chapter navigation, search/filter/detail states, and long mobile reading.
- Files/sources: `ArticleLayout`, article reader styles, research/markets pages, article page variants, content registries, and corresponding route/static metadata.
- Exclusions: core conversion pages, Atlas product pages, implementation, commit, push, deploy.

### Wave 2 — editorial and adversarial cross-review

- Existing owner: task `019fb436-f721-7130-a0ca-dfc68d8abf62`, “Portfolio Copywriting & Editorial Review.”
- Role: editorial director, claim-boundary reviewer, and factual consistency owner.
- Inputs: current root state, Wave 1 reports, and its existing unmerged editorial implementation.
- Output: reconciled copy manifest, conflicting recommendations, safe-to-port changes, and rejected changes with reasons.
- It does not write into the root worktree.

### Root writer

- Owns shared-system decisions, implementation, conflict resolution, validation, and final acceptance.
- Inspects actual source, screenshots, measurements, and worker diffs; worker summaries are evidence, not authority.

## Cross-review protocol

1. Each Wave 1 lane returns a prioritized route/state ledger with exact screenshot and DOM evidence.
2. Each lane must name strengths and counterevidence, not only defects.
3. The root synthesizes overlaps into one system map before editing.
4. The editorial owner challenges all visitor-facing copy and claim changes.
5. After implementation, at least one lane reviews a different lane’s changed surfaces.
6. The root reruns the complete route/state/device matrix and accepts or rejects every remaining P0–P2 item.

## Candidate change registry

| Candidate | State | Evidence / review requirement |
|---|---|---|
| Remove the empty fifth `coverageRows` record on `/atlas` | Accepted and implemented | Direct source inspection proves it renders a blank numbered row; Atlas lane independently confirmed it. |
| Replace generic Work badges and `Open project` labels with actual states and destination-specific CTAs | Accepted and implemented | Work data now supplies calibrated status and project labels; the page also has one explicit project-brief handoff. |
| Qualify first-party revenue/employment claims and stop labeling circular self-links as public proof | Accepted and implemented | Revenue and employment wording now states the evidence limit; proof cards without public corroboration no longer render as links. |
| Calibrate Atlas capability status to `publicly demonstrated`, `implemented / proof partial`, and `prototype` | Accepted and implemented | Capability rows, schema, hero support, and terminal panel now match the bounded public sample. |
| Add an explicit noindex motion-prototype disclosure without reintroducing low contrast or mobile CTA overlap | Accepted, implemented, and visually verified | The source-current 390×844 reduced-motion capture shows the disclosure, proposed-workflow language, complete CTAs, and a non-overlapping methodology tray. |
| Generate visible publication/update dates from canonical constants | Accepted and implemented | Shared normalization/formatting now drives generic article metadata, research cards, market cards, source verification, and same-day update suppression. |
| Replace repeated article-shell takeaway language with route-specific conclusions | Accepted, implemented, and visually verified | All 23 canonical articles now own a unique 3–10 word conclusion title and 25–55 word evidence-bounded synthesis. The shared reader renders the conclusion separately from the freshness note, static HTML preserves it, and the article verifier fails on missing, duplicated, or boilerplate conclusions. |
| Align header/footer/profile positioning to one controlled identity line | Accepted and implemented | Header, footer, profile positioning, homepage metadata, and static-route generator now use the Technical SEO / AI Systems / Finance Research identity. |

## Checkpoint

- Stage: local implementation and source-current Vercel preview acceptance complete; production promotion remains pending the guarded merge and canonical-domain checks.
- Verified state: all three read-only Wave 1 reports and the editorial cross-review were reconciled by one implementation owner. Release runtime commit `38fd8cef37b40a8840902c5409a3db222a7c8e03` passes the local source gate and the fresh exact-commit Vercel preview gate across raw HTML, hydrated DOM, responsive, interaction, reduced-motion, print, live-article, HTTP, asset, and redirect contracts.
- Material changes:
  - Reused the readable stacked-table treatment for print media and added a style-audit safeguard, preventing wide Texas evidence tables from clipping outside the printable article surface.
  - Replaced the raw static crawl fallback's generic wrapper with a semantic `main` landmark and made static-route generation fail closed when any generated route or 404 lacks that landmark or an H1.
  - Repaired tablet navigation, modal semantics, focus treatment, scroll locking, route notes, print scoping, article legacy tokens, and keyboard-accessible overflow regions.
  - Replaced page-root `overflow-x-hidden` with `overflow-x-clip`, restoring the intended sticky header; captured the pre-open scroll position, fixed the header while INDEX is open, and made its focus cycle deterministic in both directions.
  - Added inline accessible form errors, a contact form jump path, a distinct commercial-action pattern, and a Work-to-contact handoff.
  - Corrected the mobile portrait focal offset and kept the compact INDEX header through 1279px.
  - Calibrated Atlas capability, schema, terminal, CTA, reduced-motion, prototype-disclosure, and sample-table behavior to the public evidence boundary.
  - Reworked research dates, archive labels/actions, finance archive coverage, source/download language, article-title specificity, and noindex archive discoverability.
  - Replaced generic article endnotes with typed route-specific conclusions across all 23 canonical articles, added explicit closes to the custom AI, Texas, and ViralBench readers, preserved the same conclusions in static HTML, and offset the conclusion anchor below fixed mobile chrome.
- Decisions: only one implementation writer was active at a time; no new review lanes were created after the completed Core, Atlas, Research, and editorial reports.
- Final checks run from the isolated mirror `/tmp/portfolio-final-acceptance.ecEMaE`:
  - `npm run lint` — exit 0.
  - `npm run audit:style` — exit 0; all style-drift budgets passed.
  - Final `npm run build` — exit 0; 518 modules transformed and static routes generated.
  - `npm run verify:generated` — exit 0.
  - `npm run verify:internal-links` — exit 0; 35 canonical routes, zero orphans, maximum depth 2, all 23 articles with at least three contextual inbound sources.
  - `npm run verify:seo` — exit 0.
  - Earlier title-metadata and title-assertion failures were caused by the accepted Waymo and West Campus title replacements; both were reconciled before these final green runs.
- Conclusion follow-up checks run from the isolated mirror `/tmp/portfolio-conclusions.eiwkYL`:
  - `npm run lint` — exit 0.
  - Final `npm run build` — exit 0; 518 modules transformed and static routes generated.
  - `npm run verify:articles` — exit 0; all 23 canonical articles have unique route-specific conclusions, all 23 indexable readers retain unique artwork and normalized navigation, and the 10-article technical series retains zero repeated 16-word passages.
  - `npm run audit:style` — exit 0; all style-drift budgets passed.
  - `npm run verify:generated`, `npm run verify:internal-links`, `npm run verify:seo`, and `npm run verify:keywords` — exit 0.
- Base final Browser result: passed against the fresh production preview on port 4192.
  - The 38-state inventory—35 canonical routes, both intentional noindex routes, and 404—passed at 1440×1000, 820×1180, and 390×844: 114 route/viewport checks with zero failures.
  - Each route matched its expected path, mounted the client app, exposed a visible `main` and `h1`, stayed within the horizontal viewport, loaded without broken completed images, and matched its expected index/noindex contract.
  - Production browser logs contained zero warnings or errors.
  - INDEX remained visible after scrolling, opened with `body.top = -560px`, trapped backward and forward focus across the close control and links, and restored the page to `scrollY = 560` after Escape.
  - Empty contact submission focused `contact-name`, rendered three inline errors, connected each invalid field through `aria-describedby`, kept mobile fields at 16px, and did not transmit the form.
  - The source-current reduced-motion Atlas prototype showed the explicit noindex disclosure and proposed-workflow language; its audit CTA ended at 587px and the methodology tray began at 597.5px with no overlap.
  - Mobile ownership-table rows measured about 404px rather than the pre-fix multi-thousand-pixel rows, stayed within a 291px card, and produced no page overflow.
  - Article print media hid site chrome and reading rails while preserving visible semantic section headings and unconstrained article content.
  - Atlas sample records used a two-column card grid at 820px and a keyboard-focusable table region at 1440px.
- Conclusion follow-up Browser result: passed against the corrected fresh production preview on port 4193.
  - The source-current conclusion matrix covered generic technical research, generic financial research, the custom AI reader, the noindex market archive, the Texas market reader, and ViralBench at 1440×1000, 820×1180, and 390×844. Every route rendered the expected label, unique heading, synthesis, source note, and related links with correct robots state, no page or footer overflow, and zero browser warnings or errors.
  - The first 390px conclusion capture exposed a fixed-chrome anchor overlap. `scroll-margin-top` now keeps the heading visible below the header and contents rail; all six conclusion captures were regenerated from the corrected source.
- Release preview Browser result: passed against Vercel deployment `dpl_EVDV6RAj6KdGw9xHSCebD2FQqtvc`, built from release runtime commit `38fd8cef37b40a8840902c5409a3db222a7c8e03`.
  - Provider metadata matched project `portfolio-site`, PR 9, branch `codex/portfolio-world-class-release`, and the exact commit; the preview was `READY`, had no alias error, and was not a production deployment.
  - All 38 states passed at 1440×1000, 820×1180, and 390×844: 114/114 fresh viewport cells, 114 screenshot hashes, 38 raw-HTML captures, zero browser warnings/errors, zero broken completed images, and zero page/footer overflow failures.
  - The protected preview passed the 35-route sitemap, robots policy, semantic raw fallback, true HTTP 404, seven security-header checks, representative PDF/static assets, legacy redirects, and all 23 live article contracts.
  - Fifteen targeted interaction groups passed, including INDEX focus/scroll restoration at mobile and tablet widths, empty form validation with zero Formspree traffic, article contents and disclosure states, responsive tables, reduced motion, two print readers, six representative conclusions, conversion paths, and 404 recovery links.
  - The Texas print regression is closed: all seven responsive evidence tables render as stacked rows with `min-width: 0`, remain inside the 1440px print viewport, and produce no document overflow.
- Source-current evidence: `/Users/sulaymanbowles/.codex/visualizations/2026/07/30/019fb548-8559-7cc0-a683-13da0c800b31/portfolio-source-current-final-verification/`.
- Conclusion evidence manifest: `/Users/sulaymanbowles/.codex/visualizations/2026/07/30/019fb548-8559-7cc0-a683-13da0c800b31/portfolio-source-current-final-verification/conclusion-verification.json`.
- Release preview evidence: `/Users/sulaymanbowles/.codex/visualizations/2026/07/30/019fb548-8559-7cc0-a683-13da0c800b31/portfolio-release-preview-38fd8ce/`.
- Release preview manifest: `/Users/sulaymanbowles/.codex/visualizations/2026/07/30/019fb548-8559-7cc0-a683-13da0c800b31/portfolio-release-preview-38fd8ce/release-verification-manifest.json`.
- A previously saved screenshot set was rejected because its prototype capture displayed pre-change copy; it is not acceptance evidence.
- Cleanup: browser viewport and media overrides were reset, controlled tabs were closed, the production preview was stopped, and both temporary validation mirrors were moved to Trash. The conclusion mirror is recoverable at `/Users/sulaymanbowles/.Trash/portfolio-conclusions.eiwkYL`.
- Unresolved visual-evidence ledger:
  - P0: none found.
  - P1: none remaining in the accepted matrix or targeted interaction states.
  - P2: none remaining in the bounded world-class program; the route-specific conclusion follow-up is closed.
- Local-acceptance evidence boundary: acceptance was completed before release authorization; no commit, push, deployment, publication, or provider change was used as acceptance evidence.
- Release-readiness audit: `docs/portfolio-world-class-release-readiness.md` records the exact 69-path release delta, current remote and Vercel identities, live divergence proof, preview gates, rollback target, and granted authorization.
- Current remote/live state: GitHub `main` and canonical production remain at `e449a404e20f0bee615a780764e5ceb32c7200af`; the accepted source is not published. Production deployment `dpl_H3yNyBHnZJb6HvRQwD4fwRRtLgWT` remains the verified rollback target.
- Current release gate: no local or preview acceptance blocker remains. The release branch and PR are published, and the exact runtime preview passed every recorded gate. Production may proceed only through the guarded PR merge, exact production-deployment identity check, canonical-domain HTTP/browser verification, and rollback to `dpl_H3yNyBHnZJb6HvRQwD4fwRRtLgWT` if any production gate fails.
