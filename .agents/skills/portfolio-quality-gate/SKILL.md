---
name: portfolio-quality-gate
description: >-
  Run the smallest evidence-backed validation set for changes to the Portfolio Site and report exact local readiness without implying deployment or publication.
---

# Portfolio quality gate

Use this after implementing code, content, routing, SEO, analytics, styling, or security changes in this repository.

## Procedure

1. Capture `git status --short --branch`, the current commit, upstream, and the exact changed-file list. Preserve pre-existing changes.
2. Read `package.json` and classify the changed surfaces. Do not run every script by default.
3. If dependencies are missing and validation genuinely requires them, use the committed lockfile with `npm ci`. Treat task-created `node_modules` as leased generated state; remove it at closeout only if no live process owns it.
4. Run the minimum applicable checks:
   - TypeScript or React: `npm run lint`.
   - Production routing, public files, or build behavior: `npm run build` and `npm run verify:generated`.
   - SEO routes, metadata, schema, or canonical behavior: `npm run test:seo-schema` plus the relevant `verify:seo`, `verify:internal-links`, `verify:keywords`, or `verify:pseo` command.
   - Portfolio analytics: `npm run test:portfolio-analytics`.
   - Article registries or article content: `npm run verify:articles`; add targeted ranking or similarity checks only when those surfaces changed.
   - Styling or design-system changes: `npm run audit:style`, followed by `portfolio-ui-qa`.
   - Security headers or security-sensitive code: `npm run verify:security`.
5. Inspect failures. Fix only failures caused by the current change; report unrelated failures with evidence.
6. Re-run the smallest failed/relevant check after a fix.

## Return contract

Report:

- Exact checks and exit status.
- Changed-file scope and whether the worktree contains pre-existing changes.
- Local readiness verdict.
- Broader checks not run.
- Separate status for committed, pushed, deployed, published, live-observed, indexed, and measured states. Use `unknown`, not zero, when evidence is absent.
