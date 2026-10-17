# Read-only profile/contact cross-review — revision 12

Reviewed the actual current diffs of AboutPage/about-study-design.css, ResumePage/resume-explorer.css, ContactPage/ContactSculpture/contact.css against the current main baseline, plus all six native integrated opening captures: first-about-desktop/phone.jpg, first-resume-desktop/phone.jpg and first-contact-desktop/phone.jpg in this task cache. No source edits, browser activity, builds, tests or nested delegation. Only this note is written.

## Actionable finding

**Contact has a new intermediate-width stage/row size conflict (601–760px).** `contact.css:138` now assigns the study's first grid row `clamp(240px, 32svh, 340px)` through 760px, while `.lion-study-stage` keeps `min-height:320px` (`contact.css:9`, and max850 rule around line60). Its minimum resets to zero only through 600px (around line70). At a 700×800 viewport the explicit row is 256px but its stage is at least320px, so that stage can extend64px into its caption/tools row. This exact breakpoint combination is newly introduced by the broader max760 row override. Root should inspect a native intermediate-width Contact at approximately700×800, then either keep the intermediate study row at least320px or consistently reset the stage minimum within the new explicit-row breakpoint. Choose based on the rendered result and preserve canvas framing/interaction.

This is a concrete CSS constraint conflict and a targeted native verification request. I did not operate a browser and do not claim to have observed overlap at that viewport.

## No other actionable findings

- About desktop/390 opening: added collection label and selector hierarchy fit the accepted paper/ink/Syne/Newsreader composition; actual captures show no clipped visible labels or competing visual direction. New source is scoped to collection mode, so selected bass/score/chess states are not restyled by these declarations. Original selection handlers, return focus, keyboard canvas and routes remain untouched. Root reports Astra's additional32px phone opening reduction is newer than the captured image; that final spacing remains for root recapture.
- Résumé desktop/390 opening: all six roles and role dates remain source-owned, button order is unchanged, download/full-document destinations remain untouched and full-document control retains aria-expanded/controls. Bigger chronology rows provide separate readable title/role/date grouping; screenshot shows intact labels. Changed chapter headings/sequence CSS uses wrapping measures and does not introduce a new fixed horizontal width. Actual chapter/document behavior remains root's check.
- Contact desktop/390 opening: invitation and destinations visibly form one useful opening. Nav semantics and DOM order put email/copy/LinkedIn before the sculpture. Email safely wraps; copy retains live status; handlers and play/pause/range/reset, disabled/reduced-motion logic, artwork loading and attribution remain unchanged. ContactSculpture's children removal has exactly one updated caller. Failure instruction correctly says contact links are above.
- Contact phone art is pale in the supplied still. Existing continuous dissolve/field behavior can produce this phase; no renderer or lifecycle diff supports treating that still as a new contrast defect. Root should rely on its native motion observation, not freeze the artwork or change its approved bytes on this evidence.

## Limits / acceptance boundary

These are opening screenshots plus static source/diff checks. They cannot establish keyboard operation, return focus, play/pause cadence, clipboard success/failure, loaded-state timing, dark appearance, intermediate-width overflow or complete selected-interest/résumé chapters and endings. Root owns those meaningful native checks and full content/asset/release verification. No redesigned direction is requested and no other material visible weakness is supported by this evidence.
