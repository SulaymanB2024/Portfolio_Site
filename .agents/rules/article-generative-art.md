---
trigger: always_on
---

# Portfolio article art direction

## Authoritative concept

- The intended article signature is the credited live generative-art system from Codex task `019fd358-7686-7fc3-9866-d1b548d0011c` ("Update articles generative art"), not a generic family of newly invented flow fields, meshes, or geometric patterns.
- Use a distinct p5.js sketch by [@yuruyurau](https://x.com/yuruyurau) for every current public article. Maintain additional unassigned sketches as reserves for future articles.
- Every rendered sketch must name the artist and link to that sketch's exact original X post. A generic profile-only or site-wide credit is insufficient.
- Treat the generative art as editorial atmosphere, never evidence. Article-native charts, diagrams, tables, screenshots, and data plates must remain separate and semantically meaningful.

## Historical reference boundary

- The prior implementation is available read-only at `/Users/sulaymanbowles/Projects/CodexWork/portfolio-article-indexing-20260805`.
- Relevant reference surfaces include `src/components/GenerativeArticleArt.tsx`, `src/art/`, `scripts/data/yuruyurau-sketches.json`, `public/images/generative-art/`, the sketch/poster generators, and the two generative-art verification scripts.
- That historical worktree is dirty evidence. Never edit, clean, reset, commit, install into, or start persistent processes in it.
- Port or adapt only the pieces needed in this active worktree. Reconcile them with the current route registry and current `origin/main`; do not wholesale copy stale layout code.

## Reader composition

- Make the artwork a primary editorial anchor rather than a supporting thumbnail. On desktop, allow a 34–36rem square to span the byline and title rows while keeping the opening near one viewport; on mobile, use the full content column while retaining enough paper margin for the artwork to read as a framed plate.
- Keep one continuous paper reader background from the hero into the article body. Apply white-on-black `dark-field` and black-on-paper `paper-field` only inside the framed artwork; never turn the whole hero into a second page theme.
- Enforce a strict hero content budget: archive link, compact byline/date/read-time line, headline, and one deck. Keep full metadata in structured source metadata; do not stack keyword kickers, alternate display titles, source counts, or repeated detail controls above the article.
- Slight adjustments to scale, polarity, framing, crop, and surrounding composition are allowed. Preserve the reviewed sketch formula and timing unless a separately reviewed artwork change calls for modifying them.
- Begin the article body immediately after the hero.
- Provide one compact, non-sticky inline contents index. Do not reintroduce a sticky section rail, horizontal reading map, progress strip, mobile contents bar, or previous/next chapter duplication.
- Target readable prose around 18px desktop and 17px mobile with a dark ink color and an approximately 44rem measure.
- Prefer type, spacing, rules, purposeful figures, and changes of measure over dashboard-card stacks or ornamental UI.

## Runtime and accessibility contract

- Preserve a square poster while the live canvas loads.
- Lazy-load p5.js and the selected sketch; suspend animation offscreen and clean it up across route changes.
- Provide a clear play/pause control.
- Respect `prefers-reduced-motion` and preserve static poster behavior for reduced motion, no JavaScript, print, load failure, and unsupported environments.
- Prevent layout shift, horizontal overflow, hidden attribution, and unreadable controls at mobile and desktop breakpoints.

## Completion evidence

- Reconcile every current public article route against exactly one artwork assignment and verify reserve uniqueness.
- Render representative short-title, long-title, technical, and finance articles on desktop and mobile.
- Verify the exact source link and artist credit, live/pause behavior, reduced motion, poster/no-JavaScript/print fallbacks, offscreen suspension, route cleanup, lazy loading, and console health.
- Report which pieces were adapted from the historical implementation and which were newly written.
- Do not push, merge, deploy, publish, or alter external accounts without explicit authorization for that exact action.
