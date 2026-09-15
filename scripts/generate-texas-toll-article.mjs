import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const partsDirectory = path.join(root, 'src/content/texasTollRoadFinanceStatic');
const outputDirectory = path.join(root, 'public/research/financial-systems');
const outputPath = path.join(outputDirectory, 'why-texas-toll-roads-stay-tolled.html');

const partNames = (await readdir(partsDirectory))
  .filter((name) => /^\d{2}\.html$/.test(name))
  .sort();

if (partNames.length !== 8) {
  throw new Error(`Expected 8 Texas toll-road article fragments; found ${partNames.length}.`);
}

const fragments = await Promise.all(
  partNames.map((name) => readFile(path.join(partsDirectory, name), 'utf8')),
);
const article = fragments.join('');

const requiredSignals = [
  '<h1>Why Texas Toll Roads Stay Tolled: Where the Money Goes After Construction</h1>',
  'texas-toll-roads-stay-tolled-100.svg',
  'texas-toll-roads-stay-tolled-financial-model-2025.xlsx',
  'Texas Transportation Code Chapter 284',
  'application/ld+json',
];
for (const signal of requiredSignals) {
  if (!article.includes(signal)) {
    throw new Error(`Texas toll-road article is missing required signal: ${signal}`);
  }
}

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, article, 'utf8');
console.log(`Generated ${path.relative(root, outputPath)} from ${partNames.length} reviewed fragments.`);
