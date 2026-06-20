import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['src/App.tsx', 'src/pages', 'src/components'];
const PATTERNS = [
  ['hard-coded hex utilities', /\b(?:bg|text|border)-\[#/g],
  ['negative or tight tracking utilities', /\btracking-(?:\[-|tight|tighter)/g],
  ['viewport-scaled text utilities', /\btext-\[(?:clamp\([^,\]]+,[^,\]]*vw|[^\]]*vw[^\]]*)\]/g],
  ['large radius utilities', /\brounded-(?:2xl|3xl|full)\b/g],
  ['terminal font utilities', /\bfont-mono\b/g],
];

function walk(path) {
  const stat = statSync(path);
  if (stat.isFile()) return [path];
  return readdirSync(path).flatMap((entry) => {
    const child = join(path, entry);
    if (child.includes('/dist/') || child.includes('/node_modules/')) return [];
    return walk(child);
  });
}

const files = ROOTS.flatMap(walk).filter((file) => /\.(tsx|ts|css)$/.test(file));
const report = PATTERNS.map(([label, pattern]) => {
  let count = 0;
  const examples = [];

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const matches = [...text.matchAll(pattern)];
    count += matches.length;
    if (matches.length && examples.length < 6) {
      const line = text.slice(0, matches[0].index).split('\n').length;
      examples.push(`${file}:${line}`);
    }
  }

  return { label, count, examples };
});

console.log('Homepage-led style drift audit');
for (const item of report) {
  console.log(`- ${item.label}: ${item.count}`);
  if (item.examples.length) console.log(`  examples: ${item.examples.join(', ')}`);
}

const risky = report.filter((item) => item.label !== 'terminal font utilities' && item.count > 0);
if (risky.length) {
  console.log('\nNote: this audit is informational. Use it to shrink route-specific drift over time.');
}
