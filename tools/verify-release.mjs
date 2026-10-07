import { readFile, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const read = file => readFile(file, 'utf8')
const config = JSON.parse(await read('vercel.json'))
const sitemap = await read('dist/sitemap.xml')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]))
const catalog = JSON.parse(await read('src/personal/editorial/data/catalog.json'))
assert.equal(urls.length, 13 + catalog.length, 'Every published article has a canonical document')
for (const article of catalog) assert(urls.some(url => url.pathname === article.path), `Missing original article URL: ${article.path}`)
assert.equal(new Set(urls.map(url => url.href)).size, urls.length)
let checkedAssets = 0
for (const url of urls) {
  assert.equal(url.origin, 'https://sulayman-bowles.dev')
  assert.equal(url.hash, '', 'Search discovery must use document paths')
  const html = await read(join('dist', url.pathname, 'index.html'))
  if (url.pathname !== '/') assert.equal(await read(join('dist', `${url.pathname}.html`)), html, `Clean URL fallback drift: ${url.pathname}`)
  assert(html.includes(`<link rel="canonical" href="${url.href}"`), `Canonical drift: ${url.pathname}`)
  assert(/name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/.test(html))
  assert(/<div id="root"><div class="static-site">/.test(html), `Missing readable initial HTML: ${url.pathname}`)
  assert(/<main><h1>[^<]+<\/h1>/.test(html), `Missing page identity: ${url.pathname}`)
  const schema = html.match(/<script id="page-schema"[^>]*>(.*?)<\/script>/s)
  assert(schema, `Missing schema: ${url.pathname}`); JSON.parse(schema[1])
  const filesystem = config.routes.findIndex(route => route.handle === 'filesystem')
  assert(!config.routes.slice(0, filesystem).some(route => !route.has && route.headers?.Location && new RegExp(`^(?:${route.src})$`).test(url.pathname)), `Canonical document intercepted by a legacy redirect: ${url.pathname}`)
  for (const match of html.matchAll(/(?:src|href)="(\/(?:assets\/[^"?#]+|[^"?#]+\.(?:png|webp|jpe?g|svg|pdf|csv|json|xlsx|docx|md|zip)))"/g)) {
    await stat(join('dist', match[1])); checkedAssets++
  }
}
const destinationPaths = new Set([...urls.map(url => url.pathname), '/404', '/Sulayman_Bowles_Resume.pdf'])
let redirects = 0
for (const route of config.routes) {
  if (!route.headers?.Location || route.has) continue
  const destination = new URL(route.headers.Location, 'https://sulayman-bowles.dev')
  if (destination.origin !== 'https://sulayman-bowles.dev') continue
  assert(destinationPaths.has(destination.pathname), `Unresolved redirect: ${route.src} → ${destination.pathname}`)
  const outgoing = config.routes.slice(0, config.routes.findIndex(route => route.handle === 'filesystem')).find(other => !other.has && other.src && new RegExp(`^(?:${other.src})$`).test(destination.pathname) && other.headers?.Location)
  assert(!outgoing, `Redirect chain or loop: ${route.src}`)
  redirects++
}
const csp = config.routes.find(route => route.headers?.['Content-Security-Policy']).headers['Content-Security-Policy']
assert(csp.includes("worker-src 'self' blob:"), 'Draco and artwork workers must remain usable')
assert(csp.includes("script-src 'self' 'wasm-unsafe-eval'"), 'Allow the local Draco WebAssembly decoder')
assert(!csp.includes("'unsafe-eval'"))
assert.equal(config.routes.at(-1).status, 404)
assert((await read('dist/404/index.html')).includes('noindex, follow'))
assert((await read('dist/robots.txt')).includes('Sitemap: https://sulayman-bowles.dev/sitemap.xml'))
assert(!(await read('dist/llms.txt')).includes('sulayman-bowles.dev/#/'))
const pkg = JSON.parse(await read('package.json')); const lock = JSON.parse(await read('package-lock.json'))
assert.deepEqual(lock.packages[''].dependencies, pkg.dependencies)
assert.deepEqual(lock.packages[''].devDependencies, pkg.devDependencies)
await import('./verify-search.mjs')
console.log(`Release gate passed: ${urls.length} readable canonical documents, ${redirects} direct legacy redirects, ${checkedAssets} asset references, worker CSP, 404, discovery, and lockfile.`)
