#!/usr/bin/env node
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { gzipSync } from 'node:zlib'

// Measure files a browser needs, following only static manifest imports. Deferred
// renderers/route payloads are separate stages, rather than an eager global total.
const args = process.argv.slice(2)
const options = {}
for (let i = 0; i < args.length; i += 2) {
  if (!['--dist', '--output'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: node tools/measure-site-bundles.mjs --dist DIST [--output REPORT.json]')
  options[args[i].slice(2)] = args[i + 1]
}
if (!options.dist) throw new Error('--dist is required')
const dist = path.resolve(options.dist)
const manifestBytes = await readFile(path.join(dist, '.vite/manifest.json'))
const manifest = JSON.parse(manifestBytes)
const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const fileStats = new Map()

async function measure(file) {
  if (fileStats.has(file)) return fileStats.get(file)
  const absolute = path.resolve(dist, file)
  if (!absolute.startsWith(`${dist}${path.sep}`)) throw new Error(`File outside output directory: ${file}`)
  const bytes = await readFile(absolute)
  const value = { file, rawBytes: bytes.length, gzipBytes: gzipSync(bytes, { level: 6 }).length, sha256: digest(bytes) }
  fileStats.set(file, value)
  return value
}

async function summary(files) {
  const details = []
  for (const file of [...new Set(files)].sort()) details.push(await measure(file))
  return { files: details, rawBytes: details.reduce((sum, file) => sum + file.rawBytes, 0),
    gzipBytes: details.reduce((sum, file) => sum + file.gzipBytes, 0) }
}

async function closure(roots, bootstrap = []) {
  const visited = new Set(), js = new Set(), css = new Set()
  function visit(key) {
    if (visited.has(key)) return
    const chunk = manifest[key]
    if (!chunk) throw new Error(`Missing manifest import: ${key}`)
    visited.add(key)
    js.add(chunk.file)
    for (const file of chunk.css ?? []) css.add(file)
    for (const imported of chunk.imports ?? []) visit(imported)
  }
  roots.forEach(visit)
  const javascript = await summary([...js]), stylesheets = await summary([...css]), startup = await summary(bootstrap)
  return { roots, chunks: [...visited].sort(), javascript, stylesheets, startup,
    total: { rawBytes: javascript.rawBytes + stylesheets.rawBytes + startup.rawBytes,
      gzipBytes: javascript.gzipBytes + stylesheets.gzipBytes + startup.gzipBytes } }
}

const entries = {}
const bootstraps = {}
for (const [key, chunk] of Object.entries(manifest)) {
  if (!chunk.isEntry) continue
  const html = await readFile(path.join(dist, key), 'utf8')
  const scripts = [...html.matchAll(/<script\b([^>]*)>/gi)].map(match => match[1])
    .filter(attributes => !/\btype\s*=\s*["']module["']/i.test(attributes))
    .map(attributes => attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]).filter(Boolean)
    .filter(url => !/^(?:https?:)?\/\//i.test(url)).map(url => url.replace(/^\/+/, ''))
  bootstraps[key] = scripts
  entries[key] = { ...(await closure([key], scripts)), html: await measure(key) }
}

// A page already bundled into index.html has no distinct manifest key. These
// candidates also work after route extraction; absent candidates add no payload.
const routeSources = {
  home: ['src/personal/HomePage.tsx', 'src/personal/Home.tsx'],
  work: ['src/personal/WorkCollection.tsx', 'src/personal/WorkPage.tsx'],
  writing: ['src/personal/editorial/WritingIndex.tsx'],
  about: ['src/personal/about/AboutPage.tsx'],
  resume: ['src/personal/editorial/ResumePage.tsx'],
  contact: ['src/personal/contact/ContactPage.tsx'],
  project: ['src/personal/projects/ProjectNarrativePage.tsx'],
  caseStudy: ['src/personal/projects/CaseStudyPage.tsx'],
  article: ['src/personal/editorial/ArticlePage.tsx'],
}
const routes = {}
for (const [route, candidates] of Object.entries(routeSources)) {
  routes[route] = await closure(['index.html', ...candidates.filter(key => manifest[key])], bootstraps['index.html'])
}

const graphics = {
  home: ['src/personal/object-renderer.ts'],
  work: ['src/personal/work-study-renderer.ts'],
  about: ['src/personal/about/interest-renderer.ts'],
  resume: ['src/personal/object-renderer.ts'],
  contact: ['src/personal/object-renderer.ts'],
  project: ['src/personal/work-study-renderer.ts'],
}
const routesWithGraphics = {}
for (const [route, candidates] of Object.entries(graphics)) {
  routesWithGraphics[route] = await closure([...routes[route].roots, ...candidates.filter(key => manifest[key])], bootstraps['index.html'])
}

const articlePayloads = {}
for (const key of Object.keys(manifest).filter(key => key.startsWith('src/personal/editorial/data/articles/'))) {
  articlePayloads[path.basename(key, '.json')] = await closure([...routes.article.roots, key], bootstraps['index.html'])
}
const chunks = []
for (const [key, chunk] of Object.entries(manifest)) {
  if (!/\.js$/.test(chunk.file)) continue
  chunks.push({ key, name: chunk.name ?? null, isEntry: Boolean(chunk.isEntry), isDynamicEntry: Boolean(chunk.isDynamicEntry),
    imports: chunk.imports ?? [], dynamicImports: chunk.dynamicImports ?? [], css: chunk.css ?? [], assets: chunk.assets ?? [], ...await measure(chunk.file) })
}
const auxiliaryAssets = await summary(Object.values(manifest).flatMap(chunk => chunk.assets ?? []))
const report = {
  schemaVersion: 1, dist, manifestSha256: digest(manifestBytes), compression: 'gzip level 6; sum of independently compressed files',
  scope: 'Static JS/CSS dependency closure plus HTML classic startup scripts. Entry HTML is measured separately. Route stages exclude deferred renderers until routesWithGraphics, and exclude models, decoder requests, poster images, workers and fonts. These are transfer-size estimates, not browser timings.',
  entries, routes, routesWithGraphics, articlePayloads,
  chunks: chunks.sort((a, b) => b.rawBytes - a.rawBytes), auxiliaryAssets,
}
if (options.output) {
  await mkdir(path.dirname(path.resolve(options.output)), { recursive: true })
  await writeFile(options.output, `${JSON.stringify(report, null, 2)}\n`)
}
console.log(JSON.stringify({ manifestSha256: report.manifestSha256,
  routes: Object.fromEntries(Object.entries(routes).map(([key, value]) => [key, value.total])),
  routesWithGraphics: Object.fromEntries(Object.entries(routesWithGraphics).map(([key, value]) => [key, value.total])),
  output: options.output ?? null }, null, 2))
