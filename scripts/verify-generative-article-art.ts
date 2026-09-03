import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  ARTICLE_GENERATIVE_ART_ASSIGNMENTS,
  GENERATIVE_ARTWORK_LIBRARY,
  RESERVE_GENERATIVE_ARTWORK,
} from '../src/art/generative/manifest';
import { ARTICLE_ROUTE_METADATA } from '../src/content/articleRouteMetadata';

type SourceRecord = {
  id: string;
  sourceUrl: string;
  code: string;
};

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirectory = path.join(repositoryRoot, 'src/art/generative');
const sketchDirectory = path.join(sourceDirectory, 'sketches');
const sourceRecords = JSON.parse(
  await readFile(path.join(repositoryRoot, 'scripts/data/yuruyurau-sketches.json'), 'utf8'),
) as SourceRecord[];

const expectedArticlePaths = [
  ...ARTICLE_ROUTE_METADATA.map((route) => route.path),
  '/viralbench-codex-agent-harness',
].sort();
const expectedAssignedCount = expectedArticlePaths.length;
const expectedReserveCount = GENERATIVE_ARTWORK_LIBRARY.length - expectedAssignedCount;
const assignedArtwork = GENERATIVE_ARTWORK_LIBRARY.filter((artwork) => artwork.status === 'assigned');
const assignedTreatments = new Set(assignedArtwork.map((artwork) => artwork.treatment));
assert.equal(GENERATIVE_ARTWORK_LIBRARY.length, 44, 'Artwork library must contain exactly 44 sketches.');
assert.equal(assignedArtwork.length, expectedAssignedCount, 'Every current editorial article must have one assigned sketch.');
assert.equal(RESERVE_GENERATIVE_ARTWORK.length, expectedReserveCount, 'Every unassigned sketch must remain in reserve.');
assert.deepEqual(
  [...assignedTreatments].sort(),
  ['dark-field', 'paper-field'],
  'Assigned article art must preserve both curated monochrome treatments.',
);

const assignmentEntries = Object.entries(ARTICLE_GENERATIVE_ART_ASSIGNMENTS);
const assignedIds = assignmentEntries.map(([, sketchId]) => sketchId);
assert.equal(assignmentEntries.length, expectedAssignedCount, 'Every current editorial article must have one assignment.');
assert.equal(new Set(assignedIds).size, expectedAssignedCount, 'Assigned sketch IDs must be unique.');

const actualArticlePaths = assignmentEntries.map(([articlePath]) => articlePath).sort();
assert.deepEqual(
  actualArticlePaths,
  expectedArticlePaths,
  'Generative-art assignments must exactly cover every editorial article route.',
);

const sourceUrls = GENERATIVE_ARTWORK_LIBRARY.map((artwork) => artwork.attribution.sourceUrl);
assert.equal(new Set(sourceUrls).size, 44, 'Every artwork must point to a unique original post.');
for (const artwork of GENERATIVE_ARTWORK_LIBRARY) {
  assert.match(
    artwork.attribution.sourceUrl,
    /^https:\/\/x\.com\/yuruyurau\/status\/\d+$/,
    `${artwork.sketchId} must use a direct @yuruyurau status URL.`,
  );
  assert.equal(artwork.attribution.artistUrl, 'https://x.com/yuruyurau');
  assert.equal(artwork.attribution.label, 'Original p5.js sketch by @yuruyurau');
  assert.equal(typeof artwork.factory, 'function', `${artwork.sketchId} must expose a lazy factory.`);
  assert(
    artwork.treatment === 'dark-field' || artwork.treatment === 'paper-field',
    `${artwork.sketchId} must declare a supported visual treatment.`,
  );
}

assert.equal(sourceRecords.length, 44, 'Source record must preserve all 44 reviewed formulas.');
const sketchFiles = (await readdir(sketchDirectory)).filter((file) => file.endsWith('.ts')).sort();
assert.equal(sketchFiles.length, 44, 'Exactly 44 generated TypeScript sketch modules must exist.');

const posterFingerprints = new Set<string>();
for (const record of sourceRecords) {
  assert(
    !/\b(?:fetch|loadFont|loadImage|loadJSON|loadStrings|loadTable|loadXML)\b/.test(record.code),
    `${record.id} must not depend on an external runtime asset.`,
  );
  const artwork = GENERATIVE_ARTWORK_LIBRARY.find((candidate) => candidate.sketchId === record.id);
  assert(artwork, `Missing manifest entry for ${record.id}.`);
  assert.equal(artwork.attribution.sourceUrl, record.sourceUrl, `${record.id} source URL drifted.`);

  const modulePath = path.join(sketchDirectory, `${record.id}.ts`);
  const moduleSource = await readFile(modulePath, 'utf8');
  assert(moduleSource.includes(record.sourceUrl), `${record.id} module is missing its original-post annotation.`);
  const normalizedModuleSource = moduleSource.replace(/\s+/g, '');
  const normalizedReviewedSource = record.code
    .replace(/\bdraw\s*=/g, 'instance.draw =')
    .replace(/\s+/g, '');
  assert(
    normalizedModuleSource.includes(normalizedReviewedSource),
    `${record.id} formula or timing drifted from its reviewed source.`,
  );
  const loadedModule = await artwork.factory();
  assert.equal(typeof loadedModule.default, 'function', `${record.id} did not load a valid p5 factory.`);

  const posterPath = path.join(repositoryRoot, 'public', artwork.posterSrc);
  const posterStats = await stat(posterPath);
  assert(posterStats.size > 1_000, `${record.id} poster is unexpectedly small.`);
  const posterBytes = await readFile(posterPath);
  assert.equal(posterBytes.subarray(0, 4).toString('ascii'), 'RIFF', `${record.id} poster is not WebP.`);
  assert.equal(posterBytes.subarray(8, 12).toString('ascii'), 'WEBP', `${record.id} poster is not WebP.`);
  const fingerprint = createHash('sha256').update(posterBytes).digest('hex');
  assert(!posterFingerprints.has(fingerprint), `${record.id} poster duplicates another accepted sketch.`);
  posterFingerprints.add(fingerprint);
}

const filesToScan = [
  path.join(repositoryRoot, 'scripts/generate-yuruyurau-sketch-modules.mjs'),
  ...sketchFiles.map((file) => path.join(sketchDirectory, file)),
];
for (const file of filesToScan) {
  const source = await readFile(file, 'utf8');
  assert(!/\beval\s*\(/.test(source), `${file} must not use eval().`);
  assert(!/new\s+Function\b/.test(source), `${file} must not use new Function().`);
}

const componentSource = await readFile(
  path.join(repositoryRoot, 'src/components/GenerativeArticleArt.tsx'),
  'utf8',
);
assert(componentSource.includes("import('p5')"), 'p5 must remain dynamically imported.');
assert(
  !/^import(?!\s+type\b)\s+.*from\s+['\"]p5['\"]/m.test(componentSource),
  'p5 must not be statically imported.',
);

console.log(
  `Generative article art verification passed: ${expectedAssignedCount} assigned, ${expectedReserveCount} reserve, 44 direct sources.`,
);
