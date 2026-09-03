---
name: portfolio-ui-qa
description: >-
  Perform focused browser QA for Portfolio Site visual, responsive, accessibility, navigation, or motion changes using a short-lived local preview.
---

# Portfolio UI QA

Use this for changes that affect layout, styling, interaction, navigation, animation, or rendered content.

## Procedure

1. Record the changed routes and components; do not audit the entire site unless requested.
2. Reuse an existing healthy local preview when one is already owned by the task. Otherwise start `npm run dev` and wait for `http://127.0.0.1:3000`.
3. Check the homepage plus every changed route at representative mobile (`390x844`) and desktop (`1440x900`) viewports.
4. Verify, as applicable:
   - No clipping, unintended horizontal scrolling, overlap, broken wrapping, or layout shift.
   - Header, footer, navigation, links, controls, and canonical route transitions work.
   - Keyboard navigation, visible focus, semantic landmarks, headings, labels, and touch-target sizing remain usable.
   - Text contrast and reading width are reasonable in both light and dark route tones.
   - Motion behaves correctly and the reduced-motion preference removes nonessential animation.
   - Browser console has no new errors and required assets return successfully.
5. Capture only the screenshots needed to prove the changed states. Store temporary captures in ignored task output, never in source folders.
6. Stop a preview started by this task and remove only task-created browser/test artifacts after confirming no live process owns them.

## Return contract

Report the routes, viewport sizes, interactions, console result, reduced-motion result, screenshots or observations, and any untested states. A local preview does not prove deployed or live production behavior.
