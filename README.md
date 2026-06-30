# Sulayman Bowles Portfolio

A Vite React portfolio and agency/research site for Sulayman Bowles. The app keeps the animated client experience, while the production build generates route-specific static HTML for crawlable metadata, summaries, canonical URLs, and JSON-LD.

## Routes

- `/`
- `/about`
- `/resume`
- `/atlas`
- `/atlas/technical-seo-audit-console`
- `/method`
- `/method/technical-seo-audit`
- `/method/ai-crawler-access-audit`
- `/method/indexation-audit`
- `/method/internal-link-audit`
- `/markets`
- `/markets/valuation-research`
- `/markets/crypto-market-structure`

Thin market notes remain accessible but are noindexed and kept out of the sitemap until they have enough source depth, assumptions, tables, and charts to stand as research pages.

Aliases such as `/projects/atlas`, `/void-agency`, `/projects/markets`, legacy service paths, and old resume PDF URLs redirect to their canonical routes through `vercel.json`.

## Local Development

Prerequisite: Node.js.

```bash
npm ci
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```

`npm run build` runs `vite build` and then `scripts/generate-static-routes.ts`, which writes route-specific HTML into `dist/`, including noindex HTML for intentionally excluded notes.
