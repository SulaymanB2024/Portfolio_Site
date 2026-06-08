# Sulayman Bowles Portfolio

A Vite React portfolio and agency/research site for Sulayman Bowles. The app keeps the animated client experience, while the production build generates route-specific static HTML for crawlable metadata, summaries, canonical URLs, and JSON-LD.

## Routes

- `/`
- `/atlas`
- `/simple`
- `/markets`
- `/method`
- `/about`
- `/resume`
- `/ai-information`
- `/sitemap`
- `/markets/network-monopolies`
- `/markets/computational-commodity-systems`
- `/markets/fiat-horizon`

Aliases such as `/projects/atlas`, `/void-agency`, `/projects/markets`, `/book`, `/plain`, `/text`, `/cv`, and `/resume.html` redirect or normalize to their canonical routes.

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
