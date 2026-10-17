# Contact phone-mount → wide resize diagnostic

Read-only source analysis, no edits/browser/build. Root repro: fresh 390px mount, pause/reset at field 0, widen to 1280px → blank while status stays ready; Play/Reset do not restore. Fresh wide load works, and wide-origin → narrow → wide works.

## Supported conclusions

The mount-time `mobilePolicy` alone is not a demonstrated rendering cause:

- `object-renderer.ts:180` captures policy. The autoplay branches at 205/216 apply to helmet/flow, not headrest; autoplay is true in both policies.
- Contact's only geometry difference is initial sample allocation at 511: 12,000 vs 42,000. `lion-study.ts:189–191` clamps every later draw range to allocated `count`, so widening cannot request a 42k draw from a 12k buffer. At field 0, `updateDustVisibility` hides dust, while the intact surface Mesh remains. Sample allocation cannot directly explain disappearance of the intact Mesh.
- The other mount-policy-dependent branch is `onScroll` at 360: mobile-origin instances pause while scrolling and schedule a 160ms reset. A desktop-origin instance never takes this branch. This matches the origin asymmetry, but source alone does not show a stuck timer; it is a suspect to observe, not a proven cause.
- `resize` at 299 reads a fresh policy, updates pixel ratio and detail, then calls renderer.setSize and composer.setSize. Actual installed EffectComposer.setSize (node_modules/postprocessing/build/index.js:1345) always reads current drawing-buffer size and resizes both targets and passes. There is no cached-ratio early return.
- `fittedDistance` at 285 uses current object world bounds and current camera aspect; resize scales camera radius relative to prior fitDistance. Reset at 291 recomputes fit and sets absolute camera position/target, so failure after Reset weighs against ordinary accumulated camera-ratio error. All scene geometry is normalized to an approximately two-unit extent before first reset, with camera far=100.
- `ContactSculpture.tsx:29–40` marks React status ready after the first successful composer-render callback only. Ready is not proof that repaint still happens after resizing.

## Smallest decisive observation (no product rewrite)

In failed state, choose Play and observe the existing range input's `aria-valuetext` over time. ContactSculpture updates this only from the actual `onRendered` callback and `getField`. A changing value proves composer frames continue; a static value indicates rendering is gated before callback (or phase is held—observe beyond the brief intact hold). Existing DEV counters are also useful if already available.

- If callbacks stop: inspect `visible`, `scrolling`, `contextLost`, `frame`, `wakeTimer` at `active()`/`requestRender`. Scroll out and back to force an IntersectionObserver update. The smallest justified fix if stale visibility is confirmed is to refresh the actual viewport intersection from the resized rect in `resize`, retaining document-hidden/context-loss gates and normal observer suspension. If `scrolling` is confirmed stuck across breakpoint, end the stale scroll pause/timer when current policy becomes desktop; retain narrow-screen scroll suppression. Do not blindly disable offscreen suspension.
- If callbacks continue: inspect numerical `fitDistance`, camera position/aspect and composer input/output dimensions in the failed state. Finite bounds with visible-space camera and correctly sized targets rules out the presumed fitting fix. Then inspect render calls/pixels before final dither to distinguish mesh/camera vs postprocessing. A remount would hide the evidence and unnecessarily discard manual angle/field state.

## Proposed implementation boundary

No honest singular root cause or unconditional patch is established by current source plus repro description. The strongest next step is the callback discriminator above, followed by a small fix to the observed failing boundary. Do not change asset bytes, materials/shading, sample density, autoplay, reduced-motion, or remount on breakpoints as a speculative repair. The source evidence specifically contradicts an out-of-range dust draw explanation and a stale composer-size shortcut.

## Follow-up: callbacks confirmed in failed state

Root observed range value advance to 81 percent dispersed while the wide screenshot stayed blank. This rules out active()/scroll/visibility scheduling as the cause of this reproduced failure; do not apply the conditional gate fixes proposed above.

Final bounded source check:

- Three's installed Box3.expandByObject recomputes world matrices and includes all child geometry regardless of `visible` or draw range. Dust visibility and narrow/wide draw-count changes therefore do not remove or invalidate the fit bounds. Headrest has no CPU animation of object transforms; all deformation is in vertex shaders. After normalization, the intact Mesh and sampled points remain bounded and their CPU fit is unchanged by animation.
- The intact mesh's field-dependent fragment discard is guarded by `lionField > .005`. At settled field0 this discard cannot erase the surface. Dust frag alpha is1 for surviving samples. Dither returns transparent only when incoming alpha is <.0001; otherwise it preserves input alpha and maps source tone into the same paper/ink palette. Neither alpha path branches on mobile policy.
- `LiveDitherEffect.update` refreshes buffer dimensions and recalculates direct-sampling mode every rendered frame. `setView` refreshes CSS dimensions on resize. The code does not retain a mobile-only UV normalization constant.
- Installed EffectComposer resizes both buffers and every pass from renderer drawing-buffer dimensions. It supplies current input texture to every render pass. No source-level mobile-born-only allocation shortcut was found.

No unconditional fix is proven. The remaining shortest useful diagnostic is runtime numeric evidence inside the failed render: finite camera position/aspect/projection + fitDistance/object bounds; actual composer input/output dimensions versus canvas; render call/triangle count; and alpha/non-paper content of the intermediate scene buffer. Reading one scene buffer before dither distinguishes geometry/projection from final pass output. This is preferable to changing fit or alpha equations without evidence. A screenshot plus an advancing field establishes blank completed frames, but cannot reveal which buffer first became blank.

## Root disposition after settled native inspection

No renderer patch was made. The subsequent intact state is visibly present on the same phone-origin instance after Reset settles, and remains present through narrow→wide replay; fresh loads also work at both widths. Exact captures: contact-resize-settled-desktop.jpg, contact-resize-stable-phone.jpg and contact-resize-stable-desktop.jpg. Earlier immediate resize/reset captures include blank rendered states during the live study, so they are retained as observation evidence rather than used to justify a speculative camera, alpha or allocation rewrite. The inspected final states pass; no new motion/cadence or all-phase rapid-resize guarantee is claimed. Original renderer, shader, asset and scheduling bytes remain unchanged.
