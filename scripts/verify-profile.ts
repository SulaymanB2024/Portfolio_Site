import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { PROFILE_FACTS } from '../src/content/profileFacts';

const manifest = JSON.parse(fs.readFileSync('docs/resume-pdf-manifest.json', 'utf8'));
const hash = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
assert.equal(manifest.profileReviewed, PROFILE_FACTS.lastReviewed);
assert.equal(manifest.profileSha256, hash(JSON.stringify(PROFILE_FACTS)), 'Profile changed without regenerating the public PDF. Run npm run generate:resume and inspect the result.');
assert.equal(manifest.pdfPath, 'public/Sulayman_Bowles_Resume.pdf');
const pdf = fs.readFileSync(manifest.pdfPath);
assert.equal(manifest.pdfSha256, hash(pdf), 'PDF differs from its reviewed manifest.');
assert.ok(pdf.subarray(0, 5).toString() === '%PDF-');
console.log('Public résumé PDF and shared profile hashes match the reviewed manifest.');
