import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MANIFEST_PATH = 'docs/link-building/publish-manifest.json';
const DEFAULT_OUTPUT_DIR = 'output/link-building-publish';

function parseArgs(argv) {
  const args = {
    outputDir: DEFAULT_OUTPUT_DIR,
    strict: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--strict') {
      args.strict = true;
    } else if (arg === '--out') {
      const next = argv[index + 1];
      if (!next) {
        throw new Error('--out requires a directory');
      }
      args.outputDir = next;
      index += 1;
    } else {
      throw new Error(`Unsupported argument: ${arg}`);
    }
  }

  return args;
}

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

function assertSafeOutputDir(relativePath) {
  const normalized = path.normalize(relativePath);
  if (path.isAbsolute(normalized) || normalized === '.' || normalized.startsWith('..')) {
    throw new Error(`Output directory must be a relative path inside the repo: ${relativePath}`);
  }

  if (!normalized.startsWith('output/')) {
    throw new Error('Output directory must live under ignored output/');
  }
}

function copyPublishFiles(files, outputDir) {
  const filesRoot = path.resolve(ROOT, outputDir, 'files');
  fs.rmSync(path.resolve(ROOT, outputDir), { recursive: true, force: true });
  fs.mkdirSync(filesRoot, { recursive: true });

  for (const file of files) {
    const source = path.resolve(ROOT, file);
    const destination = path.resolve(filesRoot, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(source, destination);
  }
}

function writeApplyScript(outputDir) {
  const scriptPath = path.resolve(ROOT, outputDir, 'apply-to-clean-worktree.sh');
  const script = `#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "$0")/files" && pwd)"
TARGET_DIR="\${1:-$(pwd)}"

rsync -a "$SOURCE_DIR"/ "$TARGET_DIR"/
echo "Copied link-building publish files into $TARGET_DIR"
`;

  fs.writeFileSync(scriptPath, script);
  fs.chmodSync(scriptPath, 0o755);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  assertSafeOutputDir(args.outputDir);

  const manifest = readJson(MANIFEST_PATH);
  const publishFiles = uniqueSorted(manifest.publish_files ?? []);
  const publishSet = new Set(publishFiles);
  const missingPublishFiles = publishFiles.filter((file) => !fs.existsSync(path.resolve(ROOT, file)));

  if (missingPublishFiles.length > 0) {
    throw new Error(`Missing publish files: ${missingPublishFiles.join(', ')}`);
  }

  const modifiedFiles = gitLines(['diff', '--name-only']);
  const untrackedFiles = gitLines(['ls-files', '--others', '--exclude-standard']);
  const dirtyFiles = uniqueSorted([...modifiedFiles, ...untrackedFiles]);
  const dirtyOutsidePublishScope = dirtyFiles.filter((file) => !publishSet.has(file));

  if (args.strict && dirtyOutsidePublishScope.length > 0) {
    throw new Error(`Dirty files outside publish scope: ${dirtyOutsidePublishScope.join(', ')}`);
  }

  copyPublishFiles(publishFiles, args.outputDir);
  writeApplyScript(args.outputDir);

  const output = {
    ok: true,
    generated_at: new Date().toISOString(),
    manifest: MANIFEST_PATH,
    outputDir: args.outputDir,
    fileTree: `${args.outputDir}/files`,
    applyScript: `${args.outputDir}/apply-to-clean-worktree.sh`,
    publishFileCount: publishFiles.length,
    dirtyOutsidePublishScope,
    guidance:
      dirtyOutsidePublishScope.length > 0
        ? 'Export created from manifest files only. Apply it to a clean branch/worktree before committing or deploying.'
        : 'Export contains the full dirty publish scope and no excluded dirty files were detected.',
  };

  fs.writeFileSync(path.resolve(ROOT, args.outputDir, 'export-summary.json'), `${JSON.stringify(output, null, 2)}\n`);
  fs.writeFileSync(path.resolve(ROOT, args.outputDir, 'publish-files.txt'), `${publishFiles.join('\n')}\n`);
  console.log(JSON.stringify(output, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
