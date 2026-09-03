---
trigger: always_on
---

# Portfolio engineering rule

## Project identity

- This is Sulayman Bowles's production portfolio and research site: React 19, TypeScript, Vite 6, Tailwind 4, Motion, and Vercel.
- Use `npm` and the committed `package-lock.json`. Prefer existing components, utilities, CSS tokens, scripts, and dependencies.
- The design language is editorial and evidence-led: restrained canvas/ink/accent tokens, serif display type, sans-serif interface type, strong hierarchy, deliberate motion, and route-specific light/dark tones.

## Before editing

1. Read `README.md`, `package.json`, and the files directly involved.
2. Run `git status --short --branch` and identify pre-existing changes before writing.
3. State the intended file scope. Do not touch unrelated source or generated output.
4. Inspect current rendered behavior for visual work; do not redesign from assumptions or generic templates.

## Implementation constraints

- Keep React components typed and reuse the existing route, SEO, content-registry, analytics, and reduced-motion utilities.
- Preserve semantic landmarks, keyboard navigation, visible focus, readable contrast, touch targets, responsive layouts, and `prefers-reduced-motion` behavior.
- Route or content changes must keep canonical paths, static route generation, sitemap/public files, JSON-LD, internal links, and redirects consistent.
- Treat research claims, dates, denominators, and external facts as evidence-bearing content. Do not invent or silently strengthen claims.
- Analytics stays fail-closed unless its separately approved public measurement configuration is present.
- Do not place credentials in `.env`, source, artifacts, logs, or chat. Do not read ignored secrets unless the user explicitly puts them in scope.
- Avoid broad formatting churn and new dependencies. Keep changes reviewable and reversible.

## Verification

- Use the `portfolio-quality-gate` skill after code or content changes.
- Use the `portfolio-ui-qa` skill for visual, interaction, navigation, or responsive changes.
- Run only the checks relevant to the changed surfaces, but never describe an unrun check as passing.
- A local build is not a deployment. A deployment is not proven live behavior. Keep local, committed, pushed, deployed, indexed, and measured states separate.

## External-action boundary

- Do not push, merge, deploy, publish, submit IndexNow, perform outreach, enable analytics, or mutate external systems without explicit authorization for that exact action.
- Live-site and provider checks are observations only; record the URL/provider and observation time.
