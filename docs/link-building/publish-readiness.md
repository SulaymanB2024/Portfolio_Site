# Link-Building Publish Readiness

Updated: 2026-06-25

## Current State

The link-building authority pack is published on `https://sulayman-bowles.dev`.

Production evidence:

- Published commit: `26a985871028ca5a16a81a65996c65379261e21b`
- `npm run linkbuilding:live-check` passed at `2026-06-25T19:54:51.175Z`
- `npm run submit:indexnow` returned HTTP `200 OK` and submitted 30 URLs

Clean publish clone validation passed:

- `npm run linkbuilding:scope-check`
- `npm run linkbuilding:prepare`
- `npm run lint`
- `npm run build`
- `npm run submit:indexnow -- --dry-run`
- `npm run linkbuilding:live-check`

Publish scope validation currently fails in this checkout:

- `npm run linkbuilding:scope-check`
- Reason: the worktree contains unrelated modified page/component files outside `docs/link-building/publish-manifest.json`.

## Files Outside Publish Scope

Do not stage or deploy these with the link-building authority pack:

- `src/components/AuditIntakeForm.tsx`
- `src/components/InternalFooter.tsx`
- `src/components/InternalHeader.tsx`
- `src/components/RomanTogaReveal.tsx`
- `src/components/ScrollProgress.tsx`
- `src/pages/AtlasPage.tsx`
- `src/pages/AtlasSampleCrawlPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/MarketsPage.tsx`
- `src/pages/TechnicalSeoCaseStudyPage.tsx`
- `src/pages/WorkPage.tsx`

## Publish Sequence

Use a clean branch or worktree from `origin/main`, then apply only the files listed in `docs/link-building/publish-manifest.json`.

From this mixed checkout, produce the manifest-only export:

```bash
npm run linkbuilding:export-publish
```

Then, from the clean branch/worktree, apply the exported files:

```bash
output/link-building-publish/apply-to-clean-worktree.sh /path/to/clean/worktree
```

Run:

```bash
npm run linkbuilding:scope-check
npm run linkbuilding:export-publish
npm run linkbuilding:prepare
npm run lint
npm run build
npm run submit:indexnow -- --dry-run
```

After deployment to the canonical host, run:

```bash
npm run linkbuilding:live-check
```

Only after the live check passes:

```bash
npm run submit:indexnow
```

Then begin the approval-gated external work in:

- `docs/link-building/launch-queue.csv`
- `docs/link-building/generated-launch-drafts.md`
- `docs/link-building/owned-profile-updates.md`
- `docs/link-building/outreach-outcome-log.csv`

## Completion Boundary

This publish step only makes the linkable assets live. The DR/link-building goal is not complete until external profile edits, outreach sends, editorial placements, verified backlinks, and post-crawl measurement are recorded with evidence.
