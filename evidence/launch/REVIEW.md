# Personal-site launch — October 1, 2026

The release replaces the previous portfolio with the delivered editorial personal site: interactive 3D work, four curated essays, current web résumé, personal interests and direct contact. The launch is isolated from other active design chats. The delivered source snapshot is recorded in snapshot.json; no shared site source or preview was overwritten.

Hosting adds 17 readable HTML documents, canonical/social metadata, structured data, sitemap, HTML discovery, 64 explicit old-path mappings plus two topical maps, and a real 404. Hash navigation, article bookmarks and the original supporting files remain available. Historical standalone crawler notes resolve to Atlas sections; the original article data remain retained. Unknown retired content returns404 rather than a misleading success response. Existing www canonicalization, public downloads, IndexNow verification and signed server-side bot observations remain. Browser-side third-party analytics from the previous interface are not part of the delivered new interface.

Validation:
- Production build with TypeScript and static-route generation passes. Existing large lazy GLTF chunk advisory remains.
- npm test:100/100 pass.
- npm run verify:release:17 readable canonical documents,65 internal direct redirects,87 asset references, sitemap/robots/llms,404 and lockfile pass.
- Built preview with production security headers: current homepage and ready 3D object; gallery search reduces toAtlas; gallery-to-reader opening preserves content and correct canonical;390px phone article and résumé have no horizontal overflow; phone menu opens and navigates; résumé PDF link is present; dark/light appearance switches. Fresh network/security event capture has no errors. An initial cached CSP blocked blob texture fetches; connect-src now permits only same-origin/blob/data, and the fresh-header check passes. No general script eval was enabled.
- Browser viewport overrides reset. Local preview and cache override will be closed/reset at task completion.

Pending at this checkpoint: GitHub clean-install/bot-observer gate, Vercel build, production cutover and live HTTP/render checks. These remain separate from local validation. Prior production rollback candidate:dpl_65FbkQ4N4aK2oPx1XKnPpJpfs8c5.
