# Sulayman Bowles — personal site

The source for [sulayman-bowles.dev](https://sulayman-bowles.dev): selected work, four curated essays, a current web résumé, personal interests, and interactive 3D and generative studies.

## Development

Requires Node.js 24 (22.12 or later for the application).

```sh
npm ci
npm run dev
npm test
npm run test:bot-observer
npm run build
npm run verify:release
npm run preview
```

`build` creates the Vite application and 17 route-specific HTML documents using the same public copy and article records. Each document has readable initial content, canonical metadata, social metadata, and structured data. React mounts the interactive site; hash navigation and historical article bookmarks remain supported. `dist/sitemap.xml` uses the canonical document paths. Unknown paths return the site's 404 with a real HTTP 404 status. The original local shader and model collection are separate entry points.

## Release

Vercel's existing `portfolio-site` project is linked to `SulaymanB2024/Portfolio_Site`; its production branch is `main`. Review branch CI and the Vercel build before merging. `vercel.json` retains canonical www redirection, historical URLs and downloads, security headers, local worker/WebAssembly permissions, and immutable caching for versioned bundles. Existing signed server-side bot observations remain in `middleware.ts` and `packages/bot-observer`; no new collector or account has been added.

The delivered design was frozen from the user workspace into this release. Its file hashes and launch receipts are in `evidence/launch`. Ongoing local design chats and their previews were not overwritten. Earlier production code remains recoverable in Git history. Public source records and downloaded research assets remain available, including the visibly historical July résumé PDF; the web résumé reflects September 2026 sources.

## Credits

The original dithering study is by Niccolò Fanton. The Jousting Helmet is credited to The Royal Armoury under CC BY 4.0, and Klems' Bayer pattern is credited in the colophon. Original article-art formulas and artist assignments remain in the generative library. The site supports reduced motion, keyboard controls, static artwork fallbacks, and printable reading views.
