# Performance and Accessibility Motion Lab

Date: 2026-07-30

Branch: `codex/performance-accessibility-lab`

Base: `cba7d2ddc4c3cfa28cc8b024b170eae5064e67d9`

## Scope and observed contracts

This lane was limited to `ParallaxImage.tsx`, `ScrollProgress.tsx`, `ScrollReveal.tsx`, and this report. `ParallaxScene.tsx` and `VisualSceneCanvas.tsx` do not exist at the assigned base.

Current usage matters:

- `ScrollReveal` has 22 homepage call sites. It is the highest-leverage live surface.
- `ScrollProgress` has eight live call sites across pages and the shared article layout.
- `ParallaxImage` has no live call site. Its changes harden the component contract, but they do not change a current public route.
- The application already disables Lenis under reduced motion and has a global reduced-motion CSS rule. These component changes align the remaining JavaScript-driven motion with that contract.

Before this lane, server-rendering `ScrollReveal` produced `opacity:0`, a translated transform, and a blur inline. If JavaScript or viewport animation failed, meaningful content could remain visually hidden. The progress indicator also added a spring animator on top of the scroll motion value, and both progress and image scroll subscriptions stayed active under reduced motion.

## Measurable acceptance

| Requirement | Acceptance signal | Result |
| --- | --- | --- |
| Fail open | Static `ScrollReveal` markup contains its child without `opacity:0`, transform, or blur styles | Pass |
| Keyboard safety | Focusing a link inside a pending reveal immediately removes all reveal styles | Pass |
| Reduced motion | A live media-query change leaves zero pending reveals and removes the decorative progress indicator | Pass |
| Lower scroll work | `ScrollProgress` binds directly to `scrollYProgress`; there is no spring animator | Pass |
| Shared browser observers | All `ScrollReveal` instances share one native media-query listener and one viewport observer | Pass by source inspection |
| Layout stability | Reveal/progress animation changes only non-layout visual properties; image dimensions reserve a ratio when supplied | Pass for reveal/progress; opt-in for image callers |
| Graceful capability fallback | Missing `IntersectionObserver` or Web Animations API leaves reveal/image content visible | Pass by feature-path inspection and static-render probe |
| No observed visual break | Homepage desktop and About mobile render meaningful settled content with no relevant console warning/error | Pass in tested Chromium surface |

## Implementation decisions

### Scroll reveal

- Converted entry motion to progressive enhancement. Static HTML is visible; a layout effect hides eligible elements immediately before paint, and a shared `IntersectionObserver` starts the one-shot Web Animations API transition.
- Preserved the prior 780 ms duration, easing curve, maximum 350 ms delay, 8 px optional blur, 6% viewport margin, and configured vertical offset.
- Kept the wrapper as a neutral `div` and did not add `aria-hidden`, so headings, copy, links, and controls remain in the accessibility tree.
- Added focus capture. If keyboard focus enters a pending or animating reveal, the animation is canceled and content becomes visible synchronously.
- Added fail-open capability checks and cleanup for observers, animations, and temporary inline styles.
- Added a hydration-safe, live reduced-motion subscription. It uses one native `MediaQueryList` listener for all motion-infrastructure subscribers.

### Scroll progress

- Removed `useSpring`. The bar now follows the scroll motion value directly, avoiding spring frames after scroll input and allowing Motion's current implementation to use native scroll-timeline acceleration where supported.
- Returns `null` under reduced motion, so it creates no scroll subscription in the settled reduced-motion state.
- Remains decorative and `aria-hidden`; it adds no screen-reader announcements and cannot receive focus.
- Continues to animate only `transform: scaleY`, so it cannot shift layout.

### Parallax image

- Split static and animated image paths. The animated child owns `useScroll`, so the scroll subscription unmounts when reduced motion is active.
- Preserved the normal parallax scale, grayscale/brightness/contrast treatment, reveal duration, clip, and easing.
- Bounded invalid or extreme speeds to `-0.5...0.5`; negative speed now reverses direction without producing invalid double-negative CSS.
- Added `width`, `height`, `srcSet`, `sizes`, loading, decoding, fetch-priority, and error-callback support. Valid width and height values reserve the same aspect ratio on the wrapper and are passed to the image.
- Replaces a failed image with a quiet in-layout fallback. Informative images retain `role="img"` and their accessible name; decorative images remain hidden from assistive technology.
- Static markup stays visible when JavaScript is unavailable, and browsers without required animation APIs keep the non-animated image visible.

## Rendered QA

The flow under test was: homepage loads -> content is present in the accessibility snapshot -> scroll enters a reveal -> temporary styles clear and content remains visible.

- Desktop Chromium surface: 1280 × 720, homepage.
- Mobile Chromium surface: 390 × 844, settled About page.
- Homepage and About accessibility snapshots contained their meaningful headings, links, paragraphs, and navigation.
- Normal scroll changed the About progress transform from a zero scale to a non-zero scale.
- The homepage reveal for “Evidence, before answers.” completed with empty inline opacity, transform, and filter values at `scrollY=1688`.
- Before focus, the reveal containing “technical SEO audit services” had `opacity:0` and `translate3d(0px, 12px, 0px)`. Focusing that link left it as the active element and immediately cleared opacity, transform, and filter.
- On the homepage, live reduced-motion emulation changed the pending transformed/transparent element count from 27 to zero with `matches=true`. On About, it removed the progress element; resetting the preference restored progress.
- The settled mobile page had no horizontal overflow; the progress track remained present but CSS-hidden below the desktop breakpoint.
- No relevant console errors or warnings appeared in the exercised desktop, mobile, focus, scroll, or reduced-motion states.

The browser media override and viewport override were reset, the QA tab was closed, and the Vite server was stopped.

## Q/A

### Motion

**Q: Does the infrastructure honor reduced motion without relying only on CSS?**

A: Yes. Reveal effects become immediately visible, the decorative progress component unmounts, and the image parallax child unmounts. The shared preference subscription also responds while the page is open.

**Q: Was ordinary motion visually redesigned?**

A: No. Reveal durations, easing, offsets, blur, clip, and viewport margins were preserved. The progress bar intentionally follows scroll directly rather than lagging through a spring; this is the only normal-mode timing change.

### Assistive technology

**Q: Can reveal content disappear from the accessibility tree?**

A: No `aria-hidden` or presentational role is applied. Static output contains ordinary visible semantic descendants, and the rendered DOM snapshot exposed the expected headings, links, and copy.

**Q: Can keyboard users focus an invisible control?**

A: The wrapper's focus-capture handler immediately cancels a pending reveal and clears its styles. This behavior was exercised on a real link.

### Slow devices

**Q: What work was removed?**

A: Reveal no longer instantiates a Motion visual element per wrapper, reveal animation uses the browser Web Animations API, repeated reveal instances share one viewport observer and one native media listener, and scroll progress no longer runs spring-settling frames.

**Q: Is there a measured low-end-device improvement?**

A: Not yet. This lane proves the work reduction structurally and through runtime state, but it did not record a CPU profile, long-task trace, or physical low-end-device benchmark.

### Image failure

**Q: What happens if an image cannot load?**

A: The broken image and blend overlay are replaced by an in-layout neutral fallback. Informative alt text remains the fallback's accessible name, decorative fallbacks remain hidden, and a caller-supplied error handler still runs.

**Q: Is layout shift eliminated for every image?**

A: Only when callers provide valid width and height. The component cannot infer intrinsic dimensions before fetching an arbitrary URL. There are currently no call sites to migrate, and page edits were outside this lane.

### Unknowns

**Q: What remains unverified?**

A: Safari and Firefox behavior, a physical screen reader, high-contrast modes, slow-network image failure on a live route, real-device CPU/GPU traces, and pixel-diff parity. The Web Animations and observer paths are feature-detected and fail visible, but those browser matrices were not exercised here.

## Validation

- `git diff --check` — pass.
- `npm run lint` (`tsc --noEmit`) — pass.
- `npm run build` — pass; Vite transformed 518 modules and static route generation completed.
- Focused server-render probe — pass; reveal markup is visible and image width/height/aspect ratio are emitted.
- Focused reverse-speed server-render probe — pass; `speed=-0.2` emits `translateY(20%)`, not invalid `--20%`.
- Short-lived rendered QA — pass for the desktop homepage and mobile About route with the limitations above.

Broader product, SEO, security, article, and live-site suites were not run because these localized client primitives do not cross those contracts. No deployment, push, merge, or release worktree mutation occurred.

## Integration recommendation

Integrate this commit as a localized motion-infrastructure change. Reviewers should pay particular attention to the progressive-enhancement lifecycle in `ScrollReveal` and the intentional removal of spring lag in `ScrollProgress`.

The only out-of-scope dependency for a stronger CLS guarantee is caller adoption of `width` and `height` when `ParallaxImage` gains a live use. If the allowed-file boundary expands later, the shared reduced-motion subscription could move into the existing `src/hooks/useReducedMotion.ts`; relocation is organizational, not required for correctness.
