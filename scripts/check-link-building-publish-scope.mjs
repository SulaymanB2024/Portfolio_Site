import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MANIFEST_PATH = 'docs/link-building/publish-manifest.json';

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.resolve(ROOT, relativePath), 'utf8'));
}

function gitLines(args) {
  const output = execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return output.split(/\r?\n/).filter(Boolean);
}

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function main() {
  const manifest = readJson(MANIFEST_PATH);
  const publishFiles = uniqueSorted(manifest.publish_files ?? []);
  const publishSet = new Set(publishFiles);

  const modifiedFiles = gitLines(['diff', '--name-only']);
  const untrackedFiles = gitLines(['ls-files', '--others', '--exclude-standard']);
  const dirtyFiles = uniqueSorted([...modifiedFiles, ...untrackedFiles]);

  const missingPublishFiles = publishFiles.filter((file) => !fs.existsSync(path.resolve(ROOT, file)));
  const dirtyPublishFiles = dirtyFiles.filter((file) => publishSet.has(file));
  const dirtyOutsidePublishScope = dirtyFiles.filter((file) => !publishSet.has(file));

  const output = {
    ok: missingPublishFiles.length === 0 && dirtyOutsidePublishScope.length === 0,
    manifest: MANIFEST_PATH,
    publishFileCount: publishFiles.length,
    dirtyFileCount: dirtyFiles.length,
    dirtyPublishFileCount: dirtyPublishFiles.length,
    missingPublishFiles,
    dirtyPublishFiles,
    dirtyOutsidePublishScope,
    guidance:
      dirtyOutsidePublishScope.length > 0
        ? 'Do not stage or deploy the whole worktree. Publish from a clean branch/worktree containing only publish_files.'
        : 'Dirty files are inside the link-building publish scope.',
  };

  console.log(JSON.stringify(output, null, 2));

  if (!output.ok) {
    process.exitCode = 1;
  }
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
