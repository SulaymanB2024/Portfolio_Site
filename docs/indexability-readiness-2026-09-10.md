# Indexability readiness — September 10, 2026

Baseline: `6c26f5a448196c3fa7f352b778d415ab965fd65d` (the substantive PR #35 merge).

## Actual changes

The generated response already contained the article, but `.js-pending` CSS hid it
behind an application loading shell. JavaScript being enabled does not mean the
entry bundle or a route chunk succeeds. The server document is now visible by
default and remains available until React's existing `RouteReady` layout effect
commits the actual page. No crawler-specific content or user-agent exception is
introduced. The source text, headings and links are available without scripts.
Tables scroll inside the static document at narrow widths rather than making
long citations and tabular evidence overflow the whole page.

The Research browser was missing the published rare-earth capacity article,
although the article already appeared in the sitemap and had other links. The
article now appears in the shared publication index and its Markets filter.
A regression test requires every one of the 25 indexable article records to
appear once with its current title and date. The shared index has 29 items,
including non-article resources; those counts are not Google index counts.

Each of the 36 diagnostic guides now includes a different illustrative worked
example, three observed-versus-intended checks and a specific decision. Generic
capture instructions are shorter. These examples are explicitly hypothetical,
not claims of new client crawls, measurements or results. The robots-blocked-page
repair now distinguishes a public page intended for search from a page intended
to leave search instead of automatically prescribing exclusion for both.

Ten sitemap dates previously stuck in July now follow the actual public-profile,
article, guide or collection records. These are content dates, not build dates.
Unchanged article dates and historical source-verification cutoffs are preserved.

Three route-heading records (Atlas sample crawl, audit method and Austin service)
now match the existing server H1s. An all-route regression test prevents those
records from silently disagreeing with the actual published documents.

## Exclusions and measurements

The Celestial Parallax prototype and archived research-methodology page remain
noindex, as do the 404 document and the duplicate software-buyout supporting HTML
report. Redirected aliases remain redirects. We want the correct canonical
published pages indexed, not a separate indexed copy of every URL variation.
There are still 78 eligible sitemap URLs; no blanket noindex removal occurred.

The current performance export cannot establish which of those 78 URLs Google
has excluded. The latest available Search Console email names "Page with redirect"
but provides no complete current URL Inspection inventory. The verification added
here measures readiness, not a transition into Google's index.

## Reproduction

- `npm run test:indexability`: 12 discovery, date, publishing-decision and live-response fixtures.
- `python3 scripts/browser-indexability.py`: 22 desktop/mobile cases with JavaScript disabled, a failed entry script, or a failed route chunk. Failing modes must actually block the selected script. Initial main text, headings, links and canonical metadata must remain available without scrolling.
- Existing browser smoke checks still test successful application rendering and live motion preferences.
- `npm run verify:pseo-live`: direct production HTTP 200s, content types, initial metadata, HTML/HTTP exclusions, readable-document release marker, JSON-LD, exact sitemap and robots policy. Four concurrent requests, 20-second request limits, 4 MiB response limits; no cache-busting URL parameters. Writes `audit-artifact/live-indexability.json`.
- Production verification runs after successful main-branch CI and does not submit URLs or modify Search Console. This can detect a stale or misconfigured deployment that a local build cannot.

The final PR records CI and deployment evidence. A successful HTTP/rendering check
is not proof of Google indexing. Actual movement requires URL Inspection or a
current Page Indexing report after recrawling.

## Primary guidance

- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl

No deprecated sitemap ping endpoint or unsupported general-purpose Google Indexing
API request is used. The latter is restricted to eligible job-posting and livestream
pages, not ordinary portfolio articles.
