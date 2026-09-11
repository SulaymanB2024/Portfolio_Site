import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { PROFILE_FACTS } from '../src/content/profileFacts';

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-profile-'));
const profile = JSON.stringify(PROFILE_FACTS);
const pdfPath = 'public/Sulayman_Bowles_Resume.pdf';
const sha256 = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
try {
  const input = path.join(dir, 'profile.json');
  fs.writeFileSync(input, profile);
  execFileSync('python3', ['scripts/generate-resume-pdf.py', input, pdfPath], { stdio: 'inherit' });
  fs.writeFileSync('docs/resume-pdf-manifest.json', JSON.stringify({
    source: 'src/content/profileFacts.ts', generator: 'scripts/generate-resume-pdf.py',
    profileReviewed: PROFILE_FACTS.lastReviewed, profileSha256: sha256(profile),
    pdfPath, pdfSha256: sha256(fs.readFileSync(pdfPath)),
  }, null, 2) + '\n');
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
