import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

function snapshot(dir, result = {}) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) snapshot(file, result);
    else if (file.endsWith('.html')) result[file] = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  }
  return result;
}
const before = snapshot('dist');
assert.ok(Object.keys(before).length > 0, 'Build the site before testing idempotence.');
execFileSync(process.execPath, ['--import', 'tsx', 'scripts/generate-static-routes.ts'], { stdio: 'inherit' });
assert.deepEqual(snapshot('dist'), before, 'Repeated static generation changed the built HTML.');
console.log(`Static generation is byte-idempotent across ${Object.keys(before).length} HTML files.`);
