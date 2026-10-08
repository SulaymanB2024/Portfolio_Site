import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createOutreachHomeHandler } from '../lib/outreach/home.ts'
import { readLiveRegistry } from '../lib/outreach/store.ts'

const documents = new Map<boolean, Promise<string>>()
function document(notFound: boolean) {
  let html = documents.get(notFound)
  if (!html) {
    html = readFile(join(process.cwd(), 'dist', notFound ? '404/index.html' : 'index.html'), 'utf8')
    documents.set(notFound, html)
    void html.catch(() => documents.delete(notFound))
  }
  return html
}
export default { fetch: createOutreachHomeHandler(readLiveRegistry, document) }
