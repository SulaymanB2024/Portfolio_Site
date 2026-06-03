import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'public/art/roman-toga/roman-toga-diagram.svg',
  'public/art/roman-toga/roman-toga-lines.svg',
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

const component = existsSync('src/components/RomanTogaReveal.tsx')
  ? readFileSync('src/components/RomanTogaReveal.tsx', 'utf8')
  : '';

if (!component.includes('/art/roman-toga/roman-toga-lines.svg')) {
  failures.push('RomanTogaReveal does not use the transparent toga derivative.');
}

if (
  existsSync('public/art/roman-toga/roman-toga-lines.svg') &&
  readFileSync('public/art/roman-toga/roman-toga-lines.svg', 'utf8').includes('<rect fill="#FFFFFF"')
) {
  failures.push('Transparent toga derivative still contains the white background rect.');
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

if (app.includes('SULAYMAN') || app.includes('BOWLES\n') || app.includes('BOWLES\r\n')) {
  failures.push('Former central animated name text still appears in App.tsx.');
}

const desktopNavLabels = ['Work', 'Method', 'Contact', 'Index +'];

for (const label of desktopNavLabels) {
  if (!app.includes(`>${label}<`) && !app.includes(`>{'${label}'}</`)) {
    failures.push(`Homepage navigation missing ${label}.`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Homepage toga implementation contract passed.');
