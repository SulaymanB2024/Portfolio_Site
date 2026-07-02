import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOTS = ['src/App.tsx', 'src/pages', 'src/components'];
const PATTERNS = [
  ['hard-coded color utilities', /\b(?:bg|text|border|decoration|shadow|drop-shadow)-\[[^\]]*(?:#|rgba\()/g, 0],
  ['negative or tight tracking utilities', /\btracking-(?:\[-|tight|tighter)/g, 0],
  ['viewport-scaled text utilities', /\btext-\[(?:clamp\([^,\]]+,[^,\]]*vw|[^\]]*vw[^\]]*)\]/g, 0],
  ['large radius utilities', /\brounded-(?:2xl|3xl|full)\b/g, 26],
  ['terminal font utilities', /\bfont-mono\b/g, 17],
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
const report = PATTERNS.map(([label, pattern, maxAllowed]) => {
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

  return { label, count, examples, maxAllowed };
});

console.log('Homepage-led style drift audit');
for (const item of report) {
  const status = item.count <= item.maxAllowed ? 'ok' : `over budget ${item.maxAllowed}`;
  console.log(`- ${item.label}: ${item.count} (${status})`);
  if (item.examples.length) console.log(`  examples: ${item.examples.join(', ')}`);
}

const failures = report.filter((item) => item.count > item.maxAllowed);
if (failures.length) {
  console.error('\nStyle drift budget exceeded. Keep new work on theme tokens, fixed breakpoint typography, and shared primitives.');
  process.exitCode = 1;
} else {
  console.log('\nStyle drift budgets passed. Large radius and terminal-font counts remain capped because several are intentional circular marks or code/evidence panels.');
}
