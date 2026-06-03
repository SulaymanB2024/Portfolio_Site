# Homepage Roman Toga Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage's repeated-name hero with a faint Roman toga diagram reveal and simplify the homepage navigation.

**Architecture:** Add one verification script that checks the implementation contract, commit the public-domain asset and metadata, introduce a focused `RomanTogaReveal` component, then compose it into the existing `HomePage` in `src/App.tsx`. Keep route structure and internal page headers unchanged.

**Tech Stack:** React 19, Vite 6, TypeScript, Motion, Tailwind utility classes, Node verification script, Playwright/browser screenshot verification.

---

### Task 1: Contract Verification Script

**Files:**
- Create: `scripts/verify-homepage-toga.mjs`

- [ ] **Step 1: Write the failing verification script**

```js
import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'public/art/roman-toga/roman-toga-diagram.svg',
  'public/art/roman-toga/meta.json',
  'src/components/RomanTogaReveal.tsx',
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    failures.push(`Missing required file: ${file}`);
  }
}

const app = readFileSync('src/App.tsx', 'utf8');

if (!app.includes('RomanTogaReveal')) {
  failures.push('HomePage does not render RomanTogaReveal.');
}

if (!app.includes('S. BOWLES')) {
  failures.push('Homepage compact brand label is not S. BOWLES.');
}

if (app.includes('>Sulayman Bowles</span>')) {
  failures.push('Homepage fixed brand still renders the full name.');
}

if (!app.includes('Technical SEO, Atlas, and finance research.')) {
  failures.push('Hero identity line is not the approved concise copy.');
}

if (app.includes('SULAYMAN') || app.includes('BOWLES\\n') || app.includes('BOWLES\\r\\n')) {
  failures.push('Former central animated name text still appears in App.tsx.');
}

const desktopNavLabels = ['Work', 'Method', 'Contact', 'Index +'];
for (const label of desktopNavLabels) {
  if (!app.includes(`>${label}<`) && !app.includes(`>{'${label}'}</`)) {
    failures.push(`Homepage navigation missing ${label}.`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\\n'));
  process.exit(1);
}

console.log('Homepage toga implementation contract passed.');
```

- [ ] **Step 2: Run the script and verify it fails**

Run: `node scripts/verify-homepage-toga.mjs`

Expected: FAIL with missing asset/component errors and homepage contract failures.

### Task 2: Roman Toga Asset

**Files:**
- Create: `public/art/roman-toga/roman-toga-diagram.svg`
- Create: `public/art/roman-toga/roman-toga-lines.svg`
- Create: `public/art/roman-toga/meta.json`

- [ ] **Step 1: Download the source SVG**

Run:

```bash
mkdir -p public/art/roman-toga
curl -L 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Roman_toga_diagram.svg' -o public/art/roman-toga/roman-toga-diagram.svg
```

Expected: `public/art/roman-toga/roman-toga-diagram.svg` exists and starts with SVG/XML content.

- [ ] **Step 2: Create the transparent derivative**

Run:

```bash
sed '/<rect fill="#FFFFFF" width="535.474" height="555.973"\/>/d' public/art/roman-toga/roman-toga-diagram.svg > public/art/roman-toga/roman-toga-lines.svg
```

Expected: `public/art/roman-toga/roman-toga-lines.svg` exists and does not contain `<rect fill="#FFFFFF"`.

- [ ] **Step 3: Add source metadata**

Write `public/art/roman-toga/meta.json`:

```json
{
  "title": "Roman toga diagram",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Roman_toga_diagram.svg",
  "assetUrl": "https://commons.wikimedia.org/wiki/Special:Redirect/file/Roman_toga_diagram.svg",
  "author": "LadyofHats",
  "license": "Public domain",
  "licenseNotes": "Wikimedia Commons lists the file as released into the public domain by its author, LadyofHats.",
  "retrievedAt": "2026-06-03",
  "localOriginal": "/art/roman-toga/roman-toga-diagram.svg",
  "localDerivative": "/art/roman-toga/roman-toga-lines.svg",
  "derivativeNotes": "The derivative removes the source SVG's white background rect so the diagram can render as a transparent faint line artifact."
}
```

### Task 3: RomanTogaReveal Component

**Files:**
- Create: `src/components/RomanTogaReveal.tsx`

- [ ] **Step 1: Implement the component**

Create a client-side decorative component that:

- renders two copies of the toga SVG,
- keeps the base layer faint,
- uses a canvas mask for a soft pointer trail on desktop,
- disables interactive reveal on mobile and reduced motion,
- reserves stable dimensions through the caller's className.

Use this API:

```ts
type RomanTogaRevealProps = {
  className?: string;
  assetHref?: string;
  disabled?: boolean;
  restOpacity?: number;
  revealOpacity?: number;
};
```

- [ ] **Step 2: Run the contract script**

Run: `node scripts/verify-homepage-toga.mjs`

Expected: Still FAIL because `HomePage` does not render the component yet.

### Task 4: Homepage Integration

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Import the component**

Add:

```ts
import { RomanTogaReveal } from './components/RomanTogaReveal';
```

- [ ] **Step 2: Replace the homepage header identity**

Change the fixed homepage brand anchor so visible text is `S. BOWLES`, remove the discipline line, and set:

```tsx
aria-label="Home - Sulayman Bowles"
```

- [ ] **Step 3: Simplify homepage navigation**

Desktop nav should render only:

```tsx
Work
Method
Contact
Index +
```

The `Index +` menu reveals anchors for `Atlas`, `Research`, `About`, `Resume`, and `AI Info`.

Mobile nav should order:

```tsx
Work
Method
Contact
Atlas
Research
About
Resume
AI Info
```

- [ ] **Step 4: Replace central animated name SVG**

Remove the decorative SVG text block that renders `SULAYMAN` and `BOWLES`. In the same absolute hero position, render:

```tsx
<RomanTogaReveal className="h-[min(34vh,260px)] min-h-[190px] w-[82vw] max-w-[520px] md:h-[min(46vh,520px)] md:min-h-[340px] md:w-[44vw] md:max-w-[620px]" />
```

- [ ] **Step 5: Update hero supporting copy**

Set the lower hero paragraph to:

```tsx
Technical SEO, Atlas, and finance research.
```

- [ ] **Step 6: Run the contract script**

Run: `node scripts/verify-homepage-toga.mjs`

Expected: PASS.

### Task 5: Verification

**Files:**
- No additional source files.

- [ ] **Step 1: Run type checking**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 3: Run the dev server**

Run: `npm run dev`

Expected: Vite serves the app on an available localhost port.

- [ ] **Step 4: Browser visual checks**

Use Browser/IAB or Playwright fallback to verify:

- desktop `1440x1000` first viewport has one full visible `Sulayman Bowles` lockup,
- mobile `390x844` first viewport has no text overlap,
- `Index +` exposes secondary links,
- the toga diagram is faintly visible,
- desktop pointer movement reveals stronger local lines.

- [ ] **Step 5: DOM/accessibility check**

Verify:

- homepage has one `h1`,
- compact brand link accessible label is `Home - Sulayman Bowles`,
- `WORK`, `METHOD`, and `CONTACT` anchors have correct hrefs,
- `Index +` links are real anchors.

### Task 6: Commit

**Files:**
- Stage only the files changed for this feature.

- [ ] **Step 1: Review status**

Run: `git status --short`

Expected: unrelated existing changes remain unstaged.

- [ ] **Step 2: Commit scoped files**

Run:

```bash
git add docs/superpowers/plans/2026-06-03-homepage-roman-toga-reveal.md \
  scripts/verify-homepage-toga.mjs \
  public/art/roman-toga/roman-toga-diagram.svg \
  public/art/roman-toga/roman-toga-lines.svg \
  public/art/roman-toga/meta.json \
  src/components/RomanTogaReveal.tsx \
  src/App.tsx
git commit -m "feat: add homepage toga reveal"
```

Expected: commit succeeds without staging unrelated `MarketsPage` or `InvestmentResearchMap` changes.
