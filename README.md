# Sulayman Bowles Portfolio

A Vite React portfolio and agency/research site for Sulayman Bowles. The app keeps the animated client experience, while the production build generates route-specific static HTML for crawlable metadata, summaries, canonical URLs, and JSON-LD.

## Routes

- `/`
- `/work`
- `/atlas`
- `/atlas/sample-crawl`
- `/simple`
- `/markets`
- `/method`
- `/void-agency`
- `/austin-technical-seo`
- `/case-studies/technical-seo-audit`
- `/about`
- `/resume`
- `/contact`
- `/ai-information`
- `/sitemap`
- `/markets/network-monopolies`
- `/markets/computational-commodity-systems`
- `/markets/fiat-horizon`

Aliases such as `/projects/atlas`, `/atlas/sample-run`, `/projects/markets`, `/audit-intake`, `/austin-seo`, `/technical-seo-case-study`, `/book`, `/plain`, `/text`, `/cv`, and `/resume.html` redirect or normalize to their canonical routes.

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

`npm run build` runs `vite build` and then `scripts/generate-static-routes.ts`, which writes canonical route HTML into `dist/`.
