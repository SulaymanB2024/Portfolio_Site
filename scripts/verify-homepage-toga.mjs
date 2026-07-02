import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'public/art/roman-toga/roman-toga-diagram.svg',
  'public/art/roman-toga/roman-toga-lines.svg',
  'public/art/roman-toga/meta.json',
  'src/components/RomanTogaReveal.tsx',
  'src/components/InternalHeader.tsx',
  'src/content/siteNavigation.ts',
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

if (!app.includes('absolute inset-0 z-[1]')) {
  failures.push('Homepage toga layer is not a full-page inset layer.');
}

if (!app.includes('fit="cover"')) {
  failures.push('Homepage toga layer does not use cover fit.');
}

if (!app.includes('focus="large-figure"')) {
  failures.push('Homepage toga layer does not focus exclusively on the large figure.');
}

if (!app.includes('revealOpacity={0.68}')) {
  failures.push('Homepage toga reveal is not using the stronger brush opacity.');
}

if (app.includes('max-w-[520px]') || app.includes('md:max-w-[620px]')) {
  failures.push('Homepage toga layer still uses centered max-width sizing.');
}

const component = existsSync('src/components/RomanTogaReveal.tsx')
  ? readFileSync('src/components/RomanTogaReveal.tsx', 'utf8')
  : '';
const header = existsSync('src/components/InternalHeader.tsx')
  ? readFileSync('src/components/InternalHeader.tsx', 'utf8')
  : '';
const navigation = existsSync('src/content/siteNavigation.ts')
  ? readFileSync('src/content/siteNavigation.ts', 'utf8')
  : '';

if (!component.includes('/art/roman-toga/roman-toga-lines.svg')) {
  failures.push('RomanTogaReveal does not use the transparent toga derivative.');
}

if (!component.includes("fit?: 'contain' | 'cover'") || !component.includes("fit = 'contain'")) {
  failures.push('RomanTogaReveal does not expose the contain/cover fit contract.');
}

if (
  !component.includes("type RomanTogaFocus = 'diagram' | 'large-figure'") ||
  !component.includes('focus?: RomanTogaFocus') ||
  !component.includes("focus = 'diagram'")
) {
  failures.push('RomanTogaReveal does not expose the diagram/large-figure focus contract.');
}

if (
  !component.includes('LARGE_FIGURE_CROP') ||
  !component.includes('LARGE_FIGURE_FOCAL_POINT') ||
  !component.includes('getSourceRect(image, focus)') ||
  !component.includes('sourceRect.x') ||
  !component.includes('sourceRect.width')
) {
  failures.push('RomanTogaReveal does not crop canvas drawing to the large figure.');
}

if (
  !component.includes("const imageAlignment = focus === 'large-figure' ? LARGE_FIGURE_FOCAL_POINT : undefined") ||
  !component.includes('getObjectFitRect(sourceRect, width, height, fit, imageAlignment)')
) {
  failures.push('RomanTogaReveal does not align the large figure through its focal point.');
}

if (
  !component.includes('const [isMobile') ||
  !component.includes("window.matchMedia('(max-width: 767px)')") ||
  !component.includes('const canReveal = !disabled && !prefersReducedMotion && !isMobile')
) {
  failures.push('RomanTogaReveal does not use the mobile-safe reveal contract.');
}

if (!component.includes('data-toga-focus={focus}')) {
  failures.push('RomanTogaReveal does not expose a stable focus marker for rendered checks.');
}

if (!component.includes('overflow-hidden')) {
  failures.push('RomanTogaReveal root does not crop away non-focused diagram regions.');
}

if (!component.includes('data-toga-reveal-root')) {
  failures.push('RomanTogaReveal does not expose a stable root marker for rendered page-scale checks.');
}

if (
  existsSync('public/art/roman-toga/roman-toga-lines.svg') &&
  readFileSync('public/art/roman-toga/roman-toga-lines.svg', 'utf8').includes('<rect fill="#FFFFFF"')
) {
  failures.push('Transparent toga derivative still contains the white background rect.');
}

if (!header.includes('SULAYMAN BOWLES')) {
  failures.push('Shared header brand label is not Sulayman Bowles.');
}

if (!header.includes('Technical SEO · Search Systems · Finance Research')) {
  failures.push('Shared header tagline is not aligned with the updated public positioning.');
}

if (!app.includes('I am a UT Austin McCombs student building Atlas and running Void Agency.')) {
  failures.push('Hero identity line is not the approved conversion copy.');
}

if (app.includes('SULAYMAN') || app.includes('BOWLES\n') || app.includes('BOWLES\r\n')) {
  failures.push('Former central animated name text still appears in App.tsx.');
}

const desktopNavItems = [
  { label: 'Work', href: '/work' },
  { label: 'Method', href: '/method' },
  { label: 'Contact', href: '/contact' },
];

for (const item of desktopNavItems) {
  if (!navigation.includes(`label: '${item.label}'`) || !navigation.includes(`href: '${item.href}'`)) {
    failures.push(`Shared navigation missing ${item.label}.`);
  }
}

if (!header.includes('primaryNav.map((item') || !header.includes('navLabel(item)')) {
  failures.push('Shared header does not render navigation from primaryNav.');
}

if (!header.includes('site-header-menu-label') || !header.includes('INDEX')) {
  failures.push('Shared mobile header does not expose the compact index menu.');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Homepage toga implementation contract passed.');
