# Eight authored project case studies

September 12, 2026. Replaces the eight text-heavy additions in PR #46 with eight first-class case-study routes and an editorial Work index. Earlier public work remains available in a six-entry archive; existing fragment IDs are preserved.

## Pages

- `/work/internshipdeadlines`
- `/work/project-delta`
- `/work/payrollpro`
- `/work/no-limit-artemis`
- `/work/mandatearc`
- `/work/jane-street-puzzle`
- `/work/internship-aggregator-engine`
- `/work/1-800-operator`

Each page includes original explanatory SVG artwork, contribution and status details, three authored chapters, explicit design decisions, a project-specific interactive explanatory panel, results, source notes, and related projects. The panels are illustrative and are not represented as product screenshots, measured performance, or execution of the original solver. Private implementations and provider details are not published.

## Source and behavior

`workStudies.ts` owns copy. `workStudyView.ts` renders the same authored document for static output and the React page. `workStudyInteractions.ts` progressively enhances controls; all explanatory text is available without JavaScript. Work pages use scoped CSS, native case navigation, keyboard-operable controls, reduced-motion handling, and print styles. The existing homepage and research readers are unchanged.

The existing route/static catalogs are retained as `baseRouteCatalog.ts` and `baseStaticContent.ts`. New wrappers compose eight project routes and replace the stale six-card static Work fallback. Canonical identity nodes remain shared with the existing schema system.

## Validation

Local source-level validation passed all five work-study tests, canonical identity checks, generated-file consistency, keyword checks, and internal-link checks. A browser pass of the standalone authored markup checked the index and eight pages at 1440, 390, and 320 pixels, with no remaining horizontal overflow. Interactive observations and grain selection were exercised. These local checks do not substitute for the production build.

The pull-request CI runs the full TypeScript and Vite build, 47 hydrated browser layout checks, keyboard controls and index-to-case navigation, and 76 initial-document tests covering no JavaScript and failed script loads. Consult exact CI receipts for final build status.
