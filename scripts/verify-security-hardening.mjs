import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const failures = [];
let checkCount = 0;

function read(relativePath) {
  return fs.readFileSync(path.resolve(ROOT, relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function expect(condition, message) {
  checkCount += 1;
  if (!condition) failures.push(message);
}

function headerMap(headers = []) {
  return Object.fromEntries(headers.map((header) => [header.key.toLowerCase(), header.value]));
}

function cspDirective(csp, name) {
  return csp
    .split(';')
    .map((part) => part.trim())
    .find((part) => part === name || part.startsWith(`${name} `));
}

function scanFiles(dir, predicate) {
  const root = path.resolve(ROOT, dir);
  const results = [];

  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', 'dist', 'build', 'output', 'test-results', 'playwright-report'].includes(entry.name)) continue;
        walk(fullPath);
      } else if (predicate(fullPath)) {
        results.push(path.relative(ROOT, fullPath));
      }
    }
  }

  walk(root);
  return results;
}

const vercel = readJson('vercel.json');
const globalHeaders = vercel.headers?.find((entry) => entry.source === '/(.*)');
expect(Boolean(globalHeaders), 'vercel.json must define global security headers for /(.*)');

const headers = headerMap(globalHeaders?.headers);
const csp = headers['content-security-policy'] ?? '';

expect(csp.includes("default-src 'self'"), 'CSP must set default-src self');
expect(csp.includes("base-uri 'self'"), 'CSP must restrict base-uri');
expect(csp.includes("object-src 'none'"), 'CSP must disable object embeds');
expect(csp.includes("frame-ancestors 'none'"), 'CSP must block framing');
expect(csp.includes('https://formspree.io'), 'CSP must allow the Formspree form boundary');
expect(cspDirective(csp, 'script-src') === "script-src 'self'", 'CSP script-src must stay self-only');
expect(csp.includes("script-src-attr 'none'"), 'CSP must block inline script attributes');
expect(headers['strict-transport-security']?.includes('max-age='), 'HSTS header is required');
expect(headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options must be nosniff');
expect(headers['x-frame-options'] === 'DENY', 'X-Frame-Options must be DENY');
expect(headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Referrer-Policy must be strict-origin-when-cross-origin');
expect(Boolean(headers['permissions-policy']), 'Permissions-Policy header is required');
expect(headers['x-permitted-cross-domain-policies'] === 'none', 'Cross-domain policy header must be none');

const executableInlineScript = /<script\b(?![^>]*\bsrc=)(?![^>]*type=["']application\/ld\+json["'])[^>]*>[\s\S]*?<\/script>/i;
expect(!executableInlineScript.test(read('index.html')), 'index.html must not contain executable inline scripts');

const staticGenerator = read('scripts/generate-static-routes.ts');
expect(!staticGenerator.includes('staticFallbackScript'), 'static generator must not reintroduce the inline fallback script');
expect(!staticGenerator.includes('<script>${'), 'static generator must not template executable inline scripts');

const main = read('src/main.tsx');
expect(main.includes("document.documentElement.classList.add('js')"), 'main.tsx must set the js class from the bundled script');
expect(main.includes("document.getElementById('seo-static-summary')?.remove()"), 'main.tsx must synchronously remove the static fallback');

const packageJson = readJson('package.json');
expect(packageJson.scripts.dev.includes('--host=127.0.0.1'), 'dev server must bind to loopback by default');
expect(packageJson.dependencies.vite === '^6.4.3', 'runtime Vite spec must stay on the patched 6.4.x line');
expect(packageJson.devDependencies.vite === '^6.4.3', 'dev Vite spec must stay on the patched 6.4.x line');

const form = read('src/components/AuditIntakeForm.tsx');
expect(form.includes('name="_gotcha"'), 'intake form must keep the honeypot field');
expect(form.includes('sensitiveSubmissionPattern'), 'intake form must keep secret-pattern blocking');

const unsafeDomFiles = scanFiles('src', (filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  return /\b(innerHTML|outerHTML|insertAdjacentHTML|dangerouslySetInnerHTML)\b/.test(source);
});
expect(unsafeDomFiles.length === 0, `unsafe DOM HTML sinks found: ${unsafeDomFiles.join(', ')}`);

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ ok: true, checks: checkCount }, null, 2));
}
